import os
import sqlite3
import logging
from typing import Dict, List, Optional
from fastapi import FastAPI, HTTPException, Query, File, UploadFile, Form, Body
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from utils.db import get_connection, init_db, get_allocation_history_count, get_sqlite_bookings, save_sqlite_booking, update_sqlite_booking_status
from utils.mongodb import test_mongo_connection, seed_initial_bookings_if_empty, get_mongo_db
from rule_engine.checker import RuleEngine
from optimization.allocator import OptimizationEngine
from exam_allocator.allocator import ExamHallAllocator
from seat_allocator.allocator import SeatAllocator
from ml.training.train import trigger_retraining_if_needed

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("api")

app = FastAPI(
    title="BIT SmartCampus AI Scheduling & Navigation Engine",
    description="Intelligent classroom scheduler combining constraints, ML recommendations, and optimization.",
    version="1.0.0"
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_ACTIVE = False

INITIAL_BOOKINGS_SEED = []

def seed_sqlite_bookings_if_empty():
    try:
        bookings = get_sqlite_bookings()
        if not bookings:
            logger.info("SQLite fallback booking_requests is empty. Seeding initial requests...")
            for b in INITIAL_BOOKINGS_SEED:
                save_sqlite_booking(b["id"], b)
            logger.info("Successfully seeded 0 requests into SQLite fallback.")
    except Exception as e:
        logger.error(f"Error seeding SQLite fallback bookings: {e}")

# Startup event
@app.on_event("startup")
def startup_event():
    global MONGO_ACTIVE
    db_path = "data/campus_scheduler.db"
    init_db(db_path=db_path)
    
    # Test MongoDB connection on startup
    success, msg = test_mongo_connection()
    if success:
        logger.info("MongoDB is active. Operating in MongoDB Mode.")
        MONGO_ACTIVE = True
        seed_initial_bookings_if_empty()
        # Delete initial mock bookings if present
        try:
            db = get_mongo_db()
            db.bookings.delete_many({"id": {"$in": ["req-1", "req-2", "req-3", "req-4"]}})
            logger.info("Cleared mock bookings from MongoDB.")
        except Exception as e:
            logger.error(f"Error clearing mock bookings from MongoDB: {e}")
    else:
        logger.warning(f"MongoDB offline ({msg}). Operating in SQLite Fallback Mode.")
        MONGO_ACTIVE = False
        seed_sqlite_bookings_if_empty()
        # Delete initial mock bookings if present
        try:
            from utils.db import get_connection
            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute("DELETE FROM booking_requests WHERE id IN ('req-1', 'req-2', 'req-3', 'req-4')")
            conn.commit()
            conn.close()
            logger.info("Cleared mock bookings from SQLite.")
        except Exception as e:
            logger.error(f"Error clearing mock bookings from SQLite: {e}")
        
    logger.info("FastAPI Server startup complete.")

# ----------------- PYDANTIC SCHEMAS -----------------

class RoomRequest(BaseModel):
    purpose: str = Field(..., example="Class")
    student_count: int = Field(..., example=45)
    date: str = Field(..., example="2026-07-20")
    start_time: str = Field(..., example="09:00")
    end_time: str = Field(..., example="10:00")
    department: str = Field(..., example="CSE")
    faculty_id: Optional[str] = Field("FAC5001", example="FAC5001")
    strict_dept: Optional[bool] = Field(False, example=False)

class ExamRequest(BaseModel):
    cohort_counts: Dict[str, int] = Field(..., example={"CSE": 72, "AIML": 50, "AIDS": 53})
    date: str = Field(..., example="2026-08-05")
    start_time: str = Field(..., example="09:30")
    end_time: str = Field(..., example="12:30")

class StudentInfo(BaseModel):
    student_id: str
    roll_number: str
    department: str
    is_disabled: int = 0

class SeatingRequest(BaseModel):
    allocation_id: str
    students: List[StudentInfo]
    capacity: int
    broken_seats: Optional[List[List[int]]] = Field(None, example=[[2, 3]])
    num_cols: Optional[int] = Field(6, example=6)

# ----------------- API ENDPOINTS -----------------

@app.post("/recommend-room")
def recommend_room(request: RoomRequest):
    if request.student_count <= 0:
        raise HTTPException(status_code=400, detail="Student count must be greater than 0.")
        
    conn = get_connection()
    try:
        opt_engine = OptimizationEngine(conn)
        result = opt_engine.allocate_room(request.dict())
        if not result:
            raise HTTPException(status_code=404, detail="No suitable room could be allocated satisfying the constraints.")
            
        try:
            trigger_retraining_if_needed(threshold=1000)
        except Exception as retrain_err:
            logger.error(f"Retraining check error: {retrain_err}")
            
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in recommend-room: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.post("/allocate-exam")
def allocate_exam(request: ExamRequest):
    if not request.cohort_counts or sum(request.cohort_counts.values()) <= 0:
        raise HTTPException(status_code=400, detail="Cohort counts must contain at least 1 student.")

    conn = get_connection()
    try:
        allocator = ExamHallAllocator(conn)
        result = allocator.allocate_exam_halls(
            cohort_counts=request.cohort_counts,
            exam_date=request.date,
            start_time=request.start_time,
            end_time=request.end_time
        )
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in allocate-exam: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.post("/generate-seat-plan")
def generate_seat_plan(request: SeatingRequest):
    conn = get_connection()
    try:
        broken = []
        if request.broken_seats:
            broken = [tuple(seat) for seat in request.broken_seats]
            
        students_dict_list = [s.dict() for s in request.students]
        
        allocator = SeatAllocator(conn)
        result = allocator.allocate_seats(
            allocation_id=request.allocation_id,
            students=students_dict_list,
            capacity=request.capacity,
            broken_seats=broken,
            num_cols=request.num_cols
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in generate-seat-plan: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/room-availability")
def get_room_availability(
    date: str = Query(..., example="2026-07-20"),
    start_time: str = Query(..., example="09:00"),
    end_time: str = Query(..., example="10:00"),
    include_occupied: bool = Query(False)
):
    conn = get_connection()
    try:
        # Load all venues
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM venues WHERE status = 'Active'")
        venues = [dict(row) for row in cursor.fetchall()]
        
        available_rooms = []
        all_rooms_status = []
        
        # Calculate day of week for timetable check
        try:
            dt = datetime.strptime(date, '%Y-%m-%d')
            day_of_week = dt.strftime('%A')
        except Exception:
            day_of_week = 'Monday'
            
        # Parse query times to check overlaps
        q_start = start_time
        q_end = end_time
        
        # Query timetable recurrences for the day of week
        cursor.execute("""
            SELECT venue_name, course_code, department, year, semester, start_time, end_time 
            FROM timetable 
            WHERE LOWER(day_of_week) = LOWER(?)
        """, (day_of_week,))
        timetable_rows = [dict(row) for row in cursor.fetchall()]
        
        # Query maintenance schedules
        cursor.execute("""
            SELECT venue_name, description, start_date, end_date 
            FROM maintenance_schedule 
            WHERE ? BETWEEN start_date AND end_date
        """, (date,))
        maint_rows = [dict(row) for row in cursor.fetchall()]
        
        # Query SQLite approved/pending bookings
        cursor.execute("""
            SELECT booking_id, venue_name, purpose, student_count, faculty_id, department, start_time, end_time, status 
            FROM bookings 
            WHERE date = ? AND LOWER(status) IN ('approved', 'pending')
        """, (date,))
        bookings_rows = [dict(row) for row in cursor.fetchall()]
        
        # Query SQLite approved/pending allocation history
        cursor.execute("""
            SELECT allocation_id, venue_name, purpose, student_count, faculty_id, department, start_time, end_time, status 
            FROM allocation_history 
            WHERE date = ? AND LOWER(status) IN ('approved', 'pending')
        """, (date,))
        alloc_history_rows = [dict(row) for row in cursor.fetchall()]

        # Query all approved/pending booking requests (including bulk allotments)
        all_booking_reqs = []
        if MONGO_ACTIVE:
            try:
                db = get_mongo_db()
                all_booking_reqs = list(db.bookings.find({"status": {"$in": ["approved", "pending", "Approved", "Pending"]}}))
            except Exception as e:
                logger.error(f"Error querying MongoDB bookings for availability: {e}")
        else:
            try:
                all_booking_reqs = [b for b in get_sqlite_bookings() if b.get("status", "").lower() in ["approved", "pending"]]
            except Exception as e:
                logger.error(f"Error querying SQLite bookings for availability: {e}")
                
        # Resolve target session(s) for the query times
        from rule_engine.checker import check_time_overlap
        query_sessions = get_sessions_from_times(q_start, q_end)
        
        for v in venues:
            v_name = v['venue_name']
            v_name_upper = v_name.strip().upper()
            
            schedules = []
            
            # 1. Check Maintenance
            for m in maint_rows:
                if m['venue_name'].strip().upper() == v_name_upper:
                    schedules.append({
                        "type": "Maintenance",
                        "description": f"Under Maintenance: {m['description']} (from {m['start_date']} to {m['end_date']})"
                    })
            
            # 2. Check Timetable conflict
            for t in timetable_rows:
                if t['venue_name'].strip().upper() == v_name_upper:
                    if check_time_overlap(q_start, q_end, t['start_time'], t['end_time']):
                        schedules.append({
                            "type": "Timetable Class",
                            "description": f"Timetable Lecture: {t['course_code']} for {t['department']} Year {t['year']} (Sem {t['semester']}) from {t['start_time']} to {t['end_time']}"
                        })
            
            # 3. Check SQLite Bookings conflict
            for b in bookings_rows:
                if b['venue_name'].strip().upper() == v_name_upper:
                    if check_time_overlap(q_start, q_end, b['start_time'], b['end_time']):
                        schedules.append({
                            "type": "Booking",
                            "description": f"Approved Booking: {b['purpose']} for {b['department']} ({b['student_count']} students, {b['start_time']} - {b['end_time']}, Faculty: {b['faculty_id']})"
                        })
                        
            # 4. Check SQLite Allocation History conflict
            for a in alloc_history_rows:
                if a['venue_name'].strip().upper() == v_name_upper:
                    if check_time_overlap(q_start, q_end, a['start_time'], a['end_time']):
                        schedules.append({
                            "type": "Allocation",
                            "description": f"Allocation: {a['purpose']} for {a['department']} ({a['student_count']} students, {a['start_time']} - {a['end_time']}, Faculty: {a['faculty_id']})"
                        })
                        
            # 5. Check Booking requests (including Bulk Allotments)
            for req in all_booking_reqs:
                if req.get("isBulkAllotment"):
                    bd = req.get("bulkDetails", {})
                    b_start = bd.get("startDate") or req.get("start_date")
                    b_end = bd.get("endDate") or req.get("end_date")
                    b_start_session = bd.get("startSession") or req.get("start_session") or "FN"
                    b_end_session = bd.get("endSession") or req.get("end_session") or "AN"
                    
                    existing_slots = get_date_session_slots(b_start, b_start_session, b_end, b_end_session)
                    # Check if requested date is within the bulk allotment dates
                    dates_covered = [slot[0] for slot in existing_slots]
                    if date in dates_covered:
                        # Determine if query session overlaps
                        students = bd.get("students", [])
                        matching_students_fn = 0
                        matching_students_an = 0
                        
                        if "FN" in query_sessions:
                            matching_students_fn = sum(1 for s in students if s.get("Lab (FN)", "").strip().upper() == v_name_upper)
                        if "AN" in query_sessions:
                            matching_students_an = sum(1 for s in students if s.get("Venue (AN)", "").strip().upper() == v_name_upper)
                            
                        if matching_students_fn > 0:
                            schedules.append({
                                "type": "Bulk Allotment",
                                "description": f"Approved Bulk Allotment (FN): {matching_students_fn} students allocated (from {b_start} to {b_end})"
                            })
                        if matching_students_an > 0:
                            schedules.append({
                                "type": "Bulk Allotment",
                                "description": f"Approved Bulk Allotment (AN): {matching_students_an} students allocated (from {b_start} to {b_end})"
                            })
                else:
                    # Single booking request
                    b_date = req.get("date")
                    if b_date:
                        try:
                            b_date_parsed = datetime.strptime(b_date, "%Y-%m-%d").strftime("%Y-%m-%d")
                        except ValueError:
                            try:
                                b_date_parsed = datetime.strptime(b_date, "%d-%m-%Y").strftime("%Y-%m-%d")
                            except ValueError:
                                continue
                        if b_date_parsed == date:
                            b_venue = req.get("allocatedClassroomName") or req.get("venue_name")
                            if b_venue and b_venue.strip().upper() == v_name_upper:
                                b_time = req.get("time") or req.get("start_time") or "09:00"
                                duration = req.get("duration") or 1
                                try:
                                    dur_hours = int(duration)
                                except ValueError:
                                    dur_hours = 1
                                try:
                                    e_hour = int(b_time.split(':')[0]) + dur_hours
                                    b_end_time = f"{e_hour:02d}:00"
                                except Exception:
                                    b_end_time = "10:00"
                                    
                                if check_time_overlap(q_start, q_end, b_time, b_end_time):
                                    schedules.append({
                                        "type": "Booking Request",
                                        "description": f"Booking Request: {req.get('purpose', 'Event')} ({req.get('student_count', 0)} students, {b_time} - {b_end_time})"
                                    })
            
            is_avail = len(schedules) == 0
            
            room_data = {
                "venue_name": v["venue_name"],
                "venue_type": v["venue_type"],
                "block": v["block"],
                "floor": v["floor"],
                "capacity": v["capacity"],
                "projector": v["projector"],
                "ac": v["ac"],
                "num_pcs": v["num_pcs"],
                "department_preference": v.get("department_preference", "General"),
                "status": "Available" if is_avail else "Occupied",
                "schedules": schedules
            }
            
            if is_avail:
                available_rooms.append(room_data)
                
            all_rooms_status.append(room_data)
            
        if include_occupied:
            return {"available_rooms_count": len(available_rooms), "rooms": all_rooms_status}
        else:
            return {"available_rooms_count": len(available_rooms), "rooms": available_rooms}
            
    except Exception as e:
        logger.error(f"Error in room-availability: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/venues/all")
def get_all_venues():
    """Return every active venue without any availability filtering.
    Used by the Venue Finder to search across all rooms regardless of schedule."""
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM venues WHERE status = 'Active' ORDER BY venue_name")
        venues = [dict(row) for row in cursor.fetchall()]
        result = []
        for v in venues:
            result.append({
                "venue_name": v["venue_name"],
                "venue_type": v["venue_type"],
                "block": v["block"],
                "floor": v["floor"],
                "capacity": v["capacity"],
                "projector": v.get("projector"),
                "ac": v.get("ac"),
                "num_pcs": v.get("num_pcs"),
                "department_preference": v.get("department_preference", "General")
            })
        return {"total": len(result), "rooms": result}
    except Exception as e:
        logger.error(f"Error in venues/all: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/model-info")
def get_model_info():
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT version, trained_at, records_count, accuracy, f1_score, top5_accuracy
            FROM model_metadata WHERE is_active = 1 LIMIT 1
        """)
        row = cursor.fetchone()
        if not row:
            return {"status": "No active model trained yet. Using heuristic engine."}
            
        return {
            "status": "Active model loaded",
            "model_version": row["version"],
            "trained_at": row["trained_at"],
            "training_records_count": row["records_count"],
            "metrics": {
                "accuracy": row["accuracy"],
                "f1_score": row["f1_score"],
                "top5_accuracy": row["top5_accuracy"]
            }
        }
    except Exception as e:
        logger.error(f"Error in model-info: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# ----------------- STUDENT VENUE ALLOTMENT EXCEL ENDPOINTS -----------------

from datetime import datetime, timedelta

def get_date_session_slots(start_date_str, start_session, end_date_str, end_session):
    slots = []
    try:
        start_dt = datetime.strptime(start_date_str, "%Y-%m-%d")
        end_dt = datetime.strptime(end_date_str, "%Y-%m-%d") if end_date_str else start_dt
    except ValueError:
        try:
            start_dt = datetime.strptime(start_date_str, "%d-%m-%Y")
            end_dt = datetime.strptime(end_date_str, "%d-%m-%Y") if end_date_str else start_dt
        except ValueError:
            return []
    
    curr_dt = start_dt
    while curr_dt <= end_dt:
        date_str = curr_dt.strftime("%Y-%m-%d")
        
        sessions = ["FN", "AN"]
        if curr_dt == start_dt and start_session == "AN":
            sessions = ["AN"]
        if curr_dt == end_dt and end_session == "FN":
            if "FN" in sessions:
                sessions = ["FN"]
            else:
                sessions = []
                
        for s in sessions:
            slots.append((date_str, s))
        curr_dt += timedelta(days=1)
    return slots

def get_sessions_from_times(start_time_str, end_time_str):
    try:
        s_hour = int(start_time_str.split(':')[0])
        e_hour = int(end_time_str.split(':')[0])
    except Exception:
        s_hour = 9
        e_hour = 17
    sessions = []
    if s_hour < 13 and e_hour > 9:
        sessions.append("FN")
    if s_hour < 17 and e_hour > 13:
        sessions.append("AN")
    return sessions


FACILITY_COLUMN_MAP = {
    "Projector": "projector",
    "Wi-Fi": "wifi",
    "AC": "ac",
    "Audio System": "audio_video",
    "Smart Board": "smart_board",
    "Computers": "num_pcs"
}

def check_room_satisfies_facilities(room_dict, req_facs):
    for fac in req_facs:
        col = FACILITY_COLUMN_MAP.get(fac)
        if not col:
            continue
        if col == "num_pcs":
            if room_dict.get(col, 0) == 0:
                return False
        else:
            if not room_dict.get(col):
                return False
    return True

def get_suitable_replacement_room(orig_room_name, req_facs, student_dept, all_venues_list, venues_name_map, assigned_counts, occupied_seats=None):
    if occupied_seats is None:
        occupied_seats = {}
        
    orig_name_upper = orig_room_name.strip().upper()
    orig_room = venues_name_map.get(orig_name_upper)
    
    # Check if the original room satisfies facilities and has remaining capacity
    if orig_room:
        satisfies_facs = check_room_satisfies_facilities(orig_room, req_facs or []) if req_facs else True
        orig_occupied = occupied_seats.get(orig_name_upper, 0)
        orig_effective_cap = orig_room["capacity"] - orig_occupied
        if satisfies_facs and assigned_counts.get(orig_name_upper, 0) < orig_effective_cap:
            return orig_room_name

    orig_type = orig_room["venue_type"] if orig_room else None
    orig_block = orig_room["block"] if orig_room else None
    
    if not orig_type:
        # Infer type from name
        if "lab" in orig_room_name.lower() or "laboratory" in orig_room_name.lower():
            orig_type = "Lab"
        else:
            orig_type = "Classroom"
            
    is_orig_lab = "lab" in orig_type.lower() or "laboratory" in orig_type.lower()
    
    candidates = []
    for v in all_venues_list:
        if req_facs and not check_room_satisfies_facilities(v, req_facs):
            continue
            
        # Verify type category match
        is_candidate_lab = "lab" in v["venue_type"].lower() or "laboratory" in v["venue_type"].lower()
        if is_candidate_lab != is_orig_lab:
            continue
            
        v_name_upper = v["venue_name"].strip().upper()
        current_count = assigned_counts.get(v_name_upper, 0)
        capacity = v["capacity"] - occupied_seats.get(v_name_upper, 0)
        
        # Verify capacity constraint
        if current_count >= capacity:
            continue
            
        # Scoring metrics
        # 1. Block Match (same block first)
        block_score = 1 if (orig_block and v["block"] == orig_block) else 0
        # 2. Dept Preference Match (student dept matches pref, then General, then others)
        v_dept = v.get("department_preference", "General")
        dept_score = 2 if (v_dept.upper() == student_dept.upper()) else (1 if v_dept == "General" else 0)
        # 3. Capacity (larger first or sort preference)
        cap_score = v["capacity"] - occupied_seats.get(v_name_upper, 0)
        
        candidates.append((v, block_score, dept_score, cap_score))
        
    if not candidates:
        # Fallback: if all satisfying rooms are full, look at all satisfying rooms (even if full)
        # and choose the one with the most remaining capacity (or least over-allocated)
        for v in all_venues_list:
            if req_facs and not check_room_satisfies_facilities(v, req_facs):
                continue
            is_candidate_lab = "lab" in v["venue_type"].lower() or "laboratory" in v["venue_type"].lower()
            if is_candidate_lab != is_orig_lab:
                continue
                
            v_name_upper = v["venue_name"].strip().upper()
            current_count = assigned_counts.get(v_name_upper, 0)
            
            block_score = 1 if (orig_block and v["block"] == orig_block) else 0
            v_dept = v.get("department_preference", "General")
            dept_score = 2 if (v_dept.upper() == student_dept.upper()) else (1 if v_dept == "General" else 0)
            
            # For fallback, sort by remaining capacity: (capacity - occupied_seats) - current_count
            effective_capacity = v["capacity"] - occupied_seats.get(v_name_upper, 0)
            remaining_cap = effective_capacity - current_count
            candidates.append((v, block_score, dept_score, remaining_cap))
            
        if not candidates:
            return orig_room_name  # fallback to original if no candidate satisfies
            
        candidates.sort(key=lambda x: (-x[1], -x[2], -x[3]))
        return candidates[0][0]["venue_name"]
        
    # Sort candidates: block_score (desc), dept_score (desc), cap_score (desc)
    candidates.sort(key=lambda x: (-x[1], -x[2], -x[3]))
    return candidates[0][0]["venue_name"]

@app.post("/upload-venue-mapping")
def upload_venue_mapping(
    file: UploadFile = File(...),
    mode: str = Form("separate"),
    start_date: str = Form(...),
    start_session: str = Form("FN"),
    end_date: Optional[str] = Form(None),
    end_session: Optional[str] = Form("AN"),
    fn_facilities: Optional[str] = Form(None),
    an_facilities: Optional[str] = Form(None),
    remarks: Optional[str] = Form(None),
    strict_dept: bool = Form(False)
):
    import io
    import pandas as pd
    import uuid
    
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    VENUE_MAPPING_PATH = os.path.join(BASE_DIR, "Venue Mapping.xlsx")
    
    if not os.path.exists(VENUE_MAPPING_PATH):
        logger.error(f"Venue Mapping.xlsx not found at {VENUE_MAPPING_PATH}")
        raise HTTPException(status_code=500, detail="Master Venue Mapping.xlsx file not found on the server.")
        
    try:
        # Parse required facilities if provided
        req_fn_facilities = []
        if fn_facilities:
            req_fn_facilities = [f.strip() for f in fn_facilities.split(",") if f.strip()]
            
        req_an_facilities = []
        if an_facilities:
            req_an_facilities = [f.strip() for f in an_facilities.split(",") if f.strip()]
            
        # Load active venues from database to support facility check
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM venues WHERE status = 'Active'")
        all_venues = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        # Determine the target slots for the request
        target_slots = get_date_session_slots(start_date, start_session, end_date if end_date else start_date, end_session if end_date else start_session)
        
        # Track occupancy per venue per session
        # Format: {venue_name_upper: {date: {session: count}}}
        raw_occupancy = {}
        
        def add_occupancy(v_name, date, session, count):
            k = v_name.strip().upper()
            if k not in raw_occupancy:
                raw_occupancy[k] = {}
            if date not in raw_occupancy[k]:
                raw_occupancy[k][date] = {}
            raw_occupancy[k][date][session] = raw_occupancy[k][date].get(session, 0) + count

        seen_booking_ids = set()

        # 1. Fetch approved booking requests (bulk or single)
        all_booking_reqs = []
        if MONGO_ACTIVE:
            try:
                db = get_mongo_db()
                all_booking_reqs = list(db.bookings.find({"status": {"$regex": "(?i)^approved$"}}))
            except Exception as e:
                logger.error(f"Error querying MongoDB bookings: {e}")
        else:
            try:
                all_booking_reqs = [b for b in get_sqlite_bookings() if b.get("status", "").lower() == "approved"]
            except Exception as e:
                logger.error(f"Error querying SQLite bookings: {e}")

        for req in all_booking_reqs:
            req_id = req.get("id") or req.get("booking_id")
            if req_id:
                seen_booking_ids.add(str(req_id).strip().upper())
                
            if req.get("isBulkAllotment"):
                bd = req.get("bulkDetails", {})
                b_start = bd.get("startDate") or req.get("start_date")
                b_end = bd.get("endDate") or req.get("end_date")
                b_start_session = bd.get("startSession") or req.get("start_session") or "FN"
                b_end_session = bd.get("endSession") or req.get("end_session") or "AN"
                
                existing_slots = get_date_session_slots(b_start, b_start_session, b_end, b_end_session)
                overlap = set(target_slots).intersection(existing_slots)
                if not overlap:
                    continue
                    
                students = bd.get("students", [])
                for s in students:
                    lab_fn = s.get("Lab (FN)")
                    venue_an = s.get("Venue (AN)")
                    for date, session in overlap:
                        if session == "FN" and lab_fn:
                            add_occupancy(lab_fn, date, "FN", 1)
                        elif session == "AN" and venue_an:
                            add_occupancy(venue_an, date, "AN", 1)
            else:
                b_date = req.get("date")
                if not b_date:
                    continue
                try:
                    b_date_parsed = datetime.strptime(b_date, "%Y-%m-%d").strftime("%Y-%m-%d")
                except ValueError:
                    try:
                        b_date_parsed = datetime.strptime(b_date, "%d-%m-%Y").strftime("%Y-%m-%d")
                    except ValueError:
                        continue
                        
                b_time = req.get("time") or req.get("start_time") or "09:00"
                duration = req.get("duration") or 1
                try:
                    dur_hours = int(duration)
                except ValueError:
                    dur_hours = 1
                sessions = get_sessions_from_times(b_time, f"{int(b_time.split(':')[0]) + dur_hours}:00")
                
                for session in sessions:
                    if (b_date_parsed, session) in target_slots:
                        venue = req.get("allocatedClassroomName") or req.get("venue_name")
                        strength = req.get("strength") or req.get("student_count") or 1
                        if venue:
                            add_occupancy(venue, b_date_parsed, session, strength)

        # 2. Fetch approved bookings and allocation_history from SQLite, skipping already processed IDs
        conn_db = get_connection()
        db_cursor = conn_db.cursor()
        
        for table_name, id_col in [("bookings", "booking_id"), ("allocation_history", "allocation_id")]:
            try:
                db_cursor.execute(f"SELECT {id_col}, venue_name, date, start_time, end_time, student_count FROM {table_name} WHERE LOWER(status) = 'approved'")
                rows = db_cursor.fetchall()
                for r in rows:
                    rec_id = str(r[id_col]).strip().upper()
                    if rec_id in seen_booking_ids:
                        continue
                    seen_booking_ids.add(rec_id)
                    
                    v_name = r["venue_name"]
                    r_date = r["date"]
                    try:
                        r_date_parsed = datetime.strptime(r_date, "%Y-%m-%d").strftime("%Y-%m-%d")
                    except ValueError:
                        try:
                            r_date_parsed = datetime.strptime(r_date, "%d-%m-%Y").strftime("%Y-%m-%d")
                        except ValueError:
                            continue
                    
                    sessions = get_sessions_from_times(r["start_time"], r["end_time"])
                    for s in sessions:
                        if (r_date_parsed, s) in target_slots:
                            add_occupancy(v_name, r_date_parsed, s, r["student_count"])
            except Exception as e:
                logger.error(f"Error processing SQLite table {table_name}: {e}")
        conn_db.close()

        # Compute max occupancy for each venue in FN and AN
        occupied_fn = {}
        occupied_an = {}
        for venue, dates in raw_occupancy.items():
            max_fn = 0
            max_an = 0
            for date, sessions in dates.items():
                max_fn = max(max_fn, sessions.get("FN", 0))
                max_an = max(max_an, sessions.get("AN", 0))
            if max_fn > 0:
                occupied_fn[venue] = max_fn
            if max_an > 0:
                occupied_an[venue] = max_an

        
        venues_by_name = {v["venue_name"].strip().upper(): v for v in all_venues}
        
        # Load master mapping
        df_master = pd.read_excel(VENUE_MAPPING_PATH)
        # Clean master column names and data
        df_master.columns = [str(c).strip() for c in df_master.columns]
        
        # Build fallback dict
        dept_fallback = {}
        for dept, group in df_master.groupby("Department"):
            most_common_lab = group["Lab (FN)"].mode().iloc[0] if not group["Lab (FN)"].mode().empty else "IT Lab 1"
            most_common_venue = group["Venue (AN)"].mode().iloc[0] if not group["Venue (AN)"].mode().empty else "WW 226"
            dept_fallback[str(dept).strip().upper()] = {"Lab (FN)": most_common_lab, "Venue (AN)": most_common_venue}
            
        master_dict = {}
        for _, row in df_master.iterrows():
            reg_no = str(row.get("Reg No", "")).strip().upper()
            if reg_no:
                master_dict[reg_no] = {
                    "Lab (FN)": str(row.get("Lab (FN)", "IT Lab 1")).strip(),
                    "Venue (AN)": str(row.get("Venue (AN)", "WW 226")).strip()
                }
                
        # Load uploaded file
        contents = file.file.read()
        df_upload = pd.read_excel(io.BytesIO(contents))
        df_upload.columns = [str(c).strip() for c in df_upload.columns]
        
        parsed_students = []
        unmapped_count = 0
        for idx, row in df_upload.iterrows():
            row_keys = {str(k).lower().strip(): v for k, v in row.items()}
            
            # Smart register number detection
            reg_no = ""
            for k in ["reg no", "reg_no", "regno", "register no", "register number", "roll no", "roll_no", "rollnumber", "student_id"]:
                if k in row_keys and pd.notna(row_keys[k]):
                    reg_no = str(row_keys[k]).strip()
                    break
            if not reg_no:
                if len(row) > 1:
                    reg_no = str(list(row.values)[1]).strip()
                    
            if not reg_no or reg_no.lower() in ["nan", "none", ""]:
                continue
                
            reg_no_upper = reg_no.upper()
            
            # Smart name detection
            name = ""
            for k in ["student name", "student_name", "name", "candidate name", "fullname", "full name"]:
                if k in row_keys and pd.notna(row_keys[k]):
                    name = str(row_keys[k]).strip()
                    break
            if not name and len(row) > 2:
                name = str(list(row.values)[2]).strip()
                
            # Smart department detection
            dept = "General"
            for k in ["department", "dept", "branch", "course"]:
                if k in row_keys and pd.notna(row_keys[k]):
                    dept = str(row_keys[k]).strip()
                    break
            if dept == "General" and len(row) > 3:
                dept = str(list(row.values)[3]).strip()
                
            # Smart email/mail id detection
            email = ""
            for k in ["mail id", "mail_id", "email", "student email", "student mail", "mail", "mailid"]:
                if k in row_keys and pd.notna(row_keys[k]):
                    email = str(row_keys[k]).strip()
                    break
            if not email:
                for k, v in row.items():
                    if pd.notna(v) and "@" in str(v):
                        email = str(v).strip()
                        break
                        
            lab_fn = "IT Lab 1"
            venue_an = "WW 226"
            
            if reg_no_upper in master_dict:
                lab_fn = master_dict[reg_no_upper]["Lab (FN)"]
                venue_an = master_dict[reg_no_upper]["Venue (AN)"]
            else:
                dept_key = dept.strip().upper()
                if dept_key in dept_fallback:
                    lab_fn = dept_fallback[dept_key]["Lab (FN)"]
                    venue_an = dept_fallback[dept_key]["Venue (AN)"]
                else:
                    unmapped_count += 1
            
            parsed_students.append({
                "reg_no": reg_no,
                "reg_no_upper": reg_no_upper,
                "name": name,
                "department": dept,
                "orig_lab_fn": lab_fn,
                "orig_venue_an": venue_an,
                "email": email
            })
            
        import re
        def natural_sort_key(s):
            return [int(text) if text.isdigit() else text.lower() for text in re.split(r'(\d+)', s["reg_no"])]

        students_allotted = []
        assigned_fn = {}
        assigned_an = {}
        
        # Group parsed students by department
        from collections import defaultdict
        dept_groups = defaultdict(list)
        for s in parsed_students:
            dept_groups[s["department"].strip().upper()].append(s)
            
        sorted_depts = sorted(list(dept_groups.keys()))

        if strict_dept:
            # Process department by department sequentially (leaving leftover capacity empty)
            for dept_name in sorted_depts:
                students_in_dept = sorted(dept_groups[dept_name], key=natural_sort_key)
                dept_labs = sorted(list(set(s["orig_lab_fn"] for s in students_in_dept)))
                dept_venues = sorted(list(set(s["orig_venue_an"] for s in students_in_dept)))
                if not dept_labs:
                    dept_labs = ["IT Lab 1"]
                if not dept_venues:
                    dept_venues = ["WW 226"]
                    
                # Allocate Forenoon Labs
                lab_idx = 0
                current_lab = dept_labs[0]
                for s in students_in_dept:
                    v_info = venues_by_name.get(current_lab.strip().upper())
                    capacity = (v_info["capacity"] - occupied_fn.get(current_lab.strip().upper(), 0)) if v_info else 40
                    
                    while assigned_fn.get(current_lab.strip().upper(), 0) >= capacity:
                        lab_idx += 1
                        if lab_idx < len(dept_labs):
                            current_lab = dept_labs[lab_idx]
                            v_info = venues_by_name.get(current_lab.strip().upper())
                            capacity = (v_info["capacity"] - occupied_fn.get(current_lab.strip().upper(), 0)) if v_info else 40
                        else:
                            last_lab = dept_labs[-1]
                            current_lab = get_suitable_replacement_room(last_lab, req_fn_facilities or [], dept_name, all_venues, venues_by_name, assigned_fn, occupied_seats=occupied_fn)
                            dept_labs.append(current_lab)
                            v_info = venues_by_name.get(current_lab.strip().upper())
                            capacity = (v_info["capacity"] - occupied_fn.get(current_lab.strip().upper(), 0)) if v_info else 40
                            
                    resolved_lab = current_lab
                    if req_fn_facilities:
                        orig_room = venues_by_name.get(current_lab.strip().upper())
                        if not (orig_room and check_room_satisfies_facilities(orig_room, req_fn_facilities)):
                            resolved_lab = get_suitable_replacement_room(current_lab, req_fn_facilities, dept_name, all_venues, venues_by_name, assigned_fn, occupied_seats=occupied_fn)
                            
                    s["allotted_lab_fn"] = resolved_lab
                    assigned_fn[resolved_lab.strip().upper()] = assigned_fn.get(resolved_lab.strip().upper(), 0) + 1
                    
                # Allocate Afternoon Venues
                venue_idx = 0
                current_venue = dept_venues[0]
                for s in students_in_dept:
                    v_info = venues_by_name.get(current_venue.strip().upper())
                    capacity = (v_info["capacity"] - occupied_an.get(current_venue.strip().upper(), 0)) if v_info else 40
                    
                    while assigned_an.get(current_venue.strip().upper(), 0) >= capacity:
                        venue_idx += 1
                        if venue_idx < len(dept_venues):
                            current_venue = dept_venues[venue_idx]
                            v_info = venues_by_name.get(current_venue.strip().upper())
                            capacity = (v_info["capacity"] - occupied_an.get(current_venue.strip().upper(), 0)) if v_info else 40
                        else:
                            last_venue = dept_venues[-1]
                            current_venue = get_suitable_replacement_room(last_venue, req_an_facilities or [], dept_name, all_venues, venues_by_name, assigned_an, occupied_seats=occupied_an)
                            dept_venues.append(current_venue)
                            v_info = venues_by_name.get(current_venue.strip().upper())
                            capacity = (v_info["capacity"] - occupied_an.get(current_venue.strip().upper(), 0)) if v_info else 40
                            
                    resolved_venue = current_venue
                    if req_an_facilities:
                        orig_room = venues_by_name.get(current_venue.strip().upper())
                        if not (orig_room and check_room_satisfies_facilities(orig_room, req_an_facilities)):
                            resolved_venue = get_suitable_replacement_room(current_venue, req_an_facilities, dept_name, all_venues, venues_by_name, assigned_an, occupied_seats=occupied_an)
                            
                    s["allotted_venue_an"] = resolved_venue
                    assigned_an[resolved_venue.strip().upper()] = assigned_an.get(resolved_venue.strip().upper(), 0) + 1
                    
                for s in students_in_dept:
                    students_allotted.append({
                        "S.No": len(students_allotted) + 1,
                        "Reg No": s["reg_no"],
                        "Student Name": s["name"],
                        "Department": s["department"],
                        "Lab (FN)": s["allotted_lab_fn"],
                        "Venue (AN)": s["allotted_venue_an"],
                        "Email": s.get("email", "")
                    })
        else:
            # Process continuously across all departments to utilize venues to the fullest
            students_pool = []
            for dept_name in sorted_depts:
                students_in_dept = sorted(dept_groups[dept_name], key=natural_sort_key)
                students_pool.extend(students_in_dept)
                
            all_labs = sorted(list(set(s["orig_lab_fn"] for s in students_pool)))
            all_venues_list = sorted(list(set(s["orig_venue_an"] for s in students_pool)))
            if not all_labs:
                all_labs = ["IT Lab 1"]
            if not all_venues_list:
                all_venues_list = ["WW 226"]
                
            # Allocate Forenoon Labs
            lab_idx = 0
            current_lab = all_labs[0]
            for s in students_pool:
                v_info = venues_by_name.get(current_lab.strip().upper())
                capacity = (v_info["capacity"] - occupied_fn.get(current_lab.strip().upper(), 0)) if v_info else 40
                
                while assigned_fn.get(current_lab.strip().upper(), 0) >= capacity:
                    lab_idx += 1
                    if lab_idx < len(all_labs):
                        current_lab = all_labs[lab_idx]
                        v_info = venues_by_name.get(current_lab.strip().upper())
                        capacity = (v_info["capacity"] - occupied_fn.get(current_lab.strip().upper(), 0)) if v_info else 40
                    else:
                        last_lab = all_labs[-1]
                        current_lab = get_suitable_replacement_room(last_lab, req_fn_facilities or [], s["department"], all_venues, venues_by_name, assigned_fn, occupied_seats=occupied_fn)
                        all_labs.append(current_lab)
                        v_info = venues_by_name.get(current_lab.strip().upper())
                        capacity = (v_info["capacity"] - occupied_fn.get(current_lab.strip().upper(), 0)) if v_info else 40
                        
                resolved_lab = current_lab
                if req_fn_facilities:
                    orig_room = venues_by_name.get(current_lab.strip().upper())
                    if not (orig_room and check_room_satisfies_facilities(orig_room, req_fn_facilities)):
                        resolved_lab = get_suitable_replacement_room(current_lab, req_fn_facilities, s["department"], all_venues, venues_by_name, assigned_fn, occupied_seats=occupied_fn)
                        
                s["allotted_lab_fn"] = resolved_lab
                assigned_fn[resolved_lab.strip().upper()] = assigned_fn.get(resolved_lab.strip().upper(), 0) + 1
                
            # Allocate Afternoon Venues
            venue_idx = 0
            current_venue = all_venues_list[0]
            for s in students_pool:
                v_info = venues_by_name.get(current_venue.strip().upper())
                capacity = (v_info["capacity"] - occupied_an.get(current_venue.strip().upper(), 0)) if v_info else 40
                
                while assigned_an.get(current_venue.strip().upper(), 0) >= capacity:
                    venue_idx += 1
                    if venue_idx < len(all_venues_list):
                        current_venue = all_venues_list[venue_idx]
                        v_info = venues_by_name.get(current_venue.strip().upper())
                        capacity = (v_info["capacity"] - occupied_an.get(current_venue.strip().upper(), 0)) if v_info else 40
                    else:
                        last_venue = all_venues_list[-1]
                        current_venue = get_suitable_replacement_room(last_venue, req_an_facilities or [], s["department"], all_venues, venues_by_name, assigned_an, occupied_seats=occupied_an)
                        all_venues_list.append(current_venue)
                        v_info = venues_by_name.get(current_venue.strip().upper())
                        capacity = (v_info["capacity"] - occupied_an.get(current_venue.strip().upper(), 0)) if v_info else 40
                        
                resolved_venue = current_venue
                if req_an_facilities:
                    orig_room = venues_by_name.get(current_venue.strip().upper())
                    if not (orig_room and check_room_satisfies_facilities(orig_room, req_an_facilities)):
                        resolved_venue = get_suitable_replacement_room(current_venue, req_an_facilities, s["department"], all_venues, venues_by_name, assigned_an, occupied_seats=occupied_an)
                        
                s["allotted_venue_an"] = resolved_venue
                assigned_an[resolved_venue.strip().upper()] = assigned_an.get(resolved_venue.strip().upper(), 0) + 1
                
            for s in students_pool:
                students_allotted.append({
                    "S.No": len(students_allotted) + 1,
                    "Reg No": s["reg_no"],
                    "Student Name": s["name"],
                    "Department": s["department"],
                    "Lab (FN)": s["allotted_lab_fn"],
                    "Venue (AN)": s["allotted_venue_an"],
                    "Email": s.get("email", "")
                })
            
        if len(students_allotted) == 0:
            raise HTTPException(status_code=400, detail="No student records could be parsed from the uploaded Excel sheet. Please ensure columns include 'Reg No', 'Student Name' and 'Department'.")
            
        df_result = pd.DataFrame(students_allotted)
        
        # Save temp file
        temp_dir = os.path.join(BASE_DIR, "data", "temp")
        os.makedirs(temp_dir, exist_ok=True)
        session_id = f"SES_{uuid.uuid4().hex[:8].upper()}"
        temp_file_path = os.path.join(temp_dir, f"{session_id}.xlsx")
        df_result.to_excel(temp_file_path, index=False)
        
        # Calculate summary/stats
        unique_labs = int(df_result["Lab (FN)"].nunique())
        unique_venues = int(df_result["Venue (AN)"].nunique())
        
        # Group by details for charts
        lab_counts = df_result["Lab (FN)"].value_counts().to_dict()
        venue_counts = df_result["Venue (AN)"].value_counts().to_dict()
        
        summary = {
            "total_students": len(df_result),
            "mapped_students": len(df_result) - unmapped_count,
            "unmapped_students": unmapped_count,
            "unique_labs_count": unique_labs,
            "unique_venues_count": unique_venues,
            "lab_distribution": [{"venue": k, "count": int(v)} for k, v in lab_counts.items()],
            "venue_distribution": [{"venue": k, "count": int(v)} for k, v in venue_counts.items()]
        }
        
        return {
            "session_id": session_id,
            "summary": summary,
            "students": students_allotted,  # Return all students since we will paginate on the frontend
            "all_students_count": len(students_allotted),
            "unmapped_count": unmapped_count,
            "start_date": start_date,
            "start_session": start_session,
            "end_date": end_date if end_date else start_date,
            "end_session": end_session if end_date else start_session,
            "fn_facilities": req_fn_facilities,
            "an_facilities": req_an_facilities,
            "remarks": remarks
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error in upload_venue_mapping: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process Excel file: {str(e)}")

@app.get("/download-allotment/{session_id}")
def download_allotment(session_id: str):
    import pandas as pd
    import json
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    temp_dir = os.path.join(BASE_DIR, "data", "temp")
    temp_file_path = os.path.join(temp_dir, f"{session_id}.xlsx")
    
    if not os.path.exists(temp_file_path):
        # Regenerate Excel file from DB
        students = None
        # Check MongoDB first if active
        if MONGO_ACTIVE:
            try:
                db = get_mongo_db()
                collection = db.bookings
                doc = collection.find_one({"bulkDetails.sessionId": session_id})
                if doc and "bulkDetails" in doc and "students" in doc["bulkDetails"]:
                    students = doc["bulkDetails"]["students"]
            except Exception as e:
                logger.error(f"Error querying MongoDB for allotment download: {e}")
                
        # If not active or not found, fallback to SQLite
        if not students:
            try:
                from utils.db import get_connection
                conn = get_connection()
                cursor = conn.cursor()
                cursor.execute("SELECT data FROM booking_requests")
                rows = cursor.fetchall()
                conn.close()
                for row in rows:
                    booking = json.loads(row[0])
                    if booking.get("bulkDetails", {}).get("sessionId") == session_id:
                        students = booking.get("bulkDetails", {}).get("students")
                        break
            except Exception as e:
                logger.error(f"Error querying SQLite for allotment download: {e}")
                
        if students:
            try:
                os.makedirs(temp_dir, exist_ok=True)
                df = pd.DataFrame(students)
                # Ensure original column ordering
                cols_order = ["S.No", "Reg No", "Student Name", "Department", "Lab (FN)", "Venue (AN)"]
                cols_order = [c for c in cols_order if c in df.columns]
                df = df[cols_order]
                df.to_excel(temp_file_path, index=False)
            except Exception as e:
                logger.error(f"Error writing regenerated Excel allotment: {e}")
                raise HTTPException(status_code=500, detail=f"Failed to regenerate Excel: {str(e)}")
        else:
            raise HTTPException(status_code=404, detail="Allotment file not found and could not be recovered from database.")
        
    return FileResponse(
        path=temp_file_path,
        filename="Venue Mapping.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

# ----------------- BOOKINGS PERSISTENCE ENDPOINTS (MONGODB W/ SQLITE FALLBACK) -----------------

class StatusPayload(BaseModel):
    status: str

@app.post("/bookings")
def create_booking(payload: dict = Body(...)):
    doc_id = payload.get("id")
    if not doc_id:
        import uuid
        doc_id = f"req-{uuid.uuid4().hex[:9]}"
        payload["id"] = doc_id
        
    if MONGO_ACTIVE:
        try:
            db = get_mongo_db()
            collection = db.bookings
            payload["_id"] = doc_id
            collection.replace_one({"_id": doc_id}, payload, upsert=True)
            payload.pop("_id", None)
            return payload
        except Exception as e:
            logger.error(f"Failed to write to MongoDB: {e}. Falling back to SQLite.")
            
    # SQLite Fallback (or if MongoDB write failed)
    try:
        save_sqlite_booking(doc_id, payload)
        return payload
    except Exception as e:
        logger.error(f"Error in create_booking SQLite fallback: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/bookings")
def get_bookings(staff_id: Optional[str] = Query(None, description="Filter bookings by staff/user ID")):
    if MONGO_ACTIVE:
        try:
            db = get_mongo_db()
            collection = db.bookings
            query = {}
            if staff_id:
                query["staffId"] = staff_id
            cursor = collection.find(query)
            bookings = []
            for doc in cursor:
                doc.pop("_id", None)
                bookings.append(doc)
            return bookings
        except Exception as e:
            logger.error(f"Failed to fetch from MongoDB: {e}. Falling back to SQLite.")
            
    # SQLite Fallback
    try:
        all_bookings = get_sqlite_bookings()
        if staff_id:
            all_bookings = [b for b in all_bookings if b.get("staffId") == staff_id]
        return all_bookings
    except Exception as e:
        logger.error(f"Error in get_bookings SQLite fallback: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/bookings/{booking_id}/status")
def update_booking_status(booking_id: str, payload: StatusPayload):
    if MONGO_ACTIVE:
        try:
            db = get_mongo_db()
            collection = db.bookings
            doc = collection.find_one({"id": booking_id})
            if doc:
                collection.update_one({"id": booking_id}, {"$set": {"status": payload.status}})
                updated_doc = collection.find_one({"id": booking_id})
                updated_doc.pop("_id", None)
                return updated_doc
        except Exception as e:
            logger.error(f"Failed to update MongoDB booking status: {e}. Falling back to SQLite.")

    # SQLite Fallback
    try:
        updated_doc = update_sqlite_booking_status(booking_id, payload.status)
        if not updated_doc:
            raise HTTPException(status_code=404, detail=f"Booking request {booking_id} not found.")
        return updated_doc
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error in update_booking_status SQLite fallback: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/student-allotment")
def get_student_allotment(email: str = Query(...)):
    if not email:
        raise HTTPException(status_code=400, detail="Email parameter is required.")
        
    all_booking_reqs = []
    if MONGO_ACTIVE:
        try:
            db = get_mongo_db()
            all_booking_reqs = list(db.bookings.find({"status": {"$regex": "(?i)^approved$"}}))
        except Exception as e:
            logger.error(f"Error querying MongoDB bookings for student portal: {e}")
    else:
        try:
            all_booking_reqs = [b for b in get_sqlite_bookings() if b.get("status", "").lower() == "approved"]
        except Exception as e:
            logger.error(f"Error querying SQLite bookings for student portal: {e}")
            
    student_allotments = []
    target_email = email.strip().lower()
    
    for req in all_booking_reqs:
        if req.get("isBulkAllotment"):
            bd = req.get("bulkDetails", {})
            students = bd.get("students", [])
            for s in students:
                s_email = s.get("Email") or s.get("email") or ""
                if str(s_email).strip().lower() == target_email:
                    b_start = bd.get("startDate") or req.get("start_date")
                    b_end = bd.get("endDate") or req.get("end_date")
                    b_start_session = bd.get("startSession") or req.get("start_session") or "FN"
                    b_end_session = bd.get("endSession") or req.get("end_session") or "AN"
                    
                    student_allotments.append({
                        "id": req.get("id") or req.get("booking_id"),
                        "subject": req.get("subject", "Bulk Student Allotment"),
                        "startDate": b_start,
                        "endDate": b_end,
                        "startSession": b_start_session,
                        "endSession": b_end_session,
                        "remarks": req.get("remarks") or bd.get("remarks") or "",
                        "lab_fn": s.get("Lab (FN)") or s.get("allotted_lab_fn") or "IT Lab 1",
                        "venue_an": s.get("Venue (AN)") or s.get("allotted_venue_an") or "WW 226",
                        "student_name": s.get("Student Name") or s.get("name") or "",
                        "reg_no": s.get("Reg No") or s.get("reg_no") or "",
                        "department": s.get("Department") or s.get("department") or ""
                    })
                    
    return {"allotments": student_allotments}


