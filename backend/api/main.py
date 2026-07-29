import os
import sqlite3
import logging
from typing import Dict, List, Optional
from fastapi import FastAPI, HTTPException, Query, File, UploadFile, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from utils.db import get_connection, init_db, get_allocation_history_count
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

# Startup event
@app.on_event("startup")
def startup_event():
    db_path = "data/campus_scheduler.db"
    init_db(db_path=db_path)
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
    end_time: str = Query(..., example="10:00")
):
    conn = get_connection()
    try:
        # Load all venues
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM venues WHERE status = 'Active'")
        venues = [dict(row) for row in cursor.fetchall()]
        
        rule_engine = RuleEngine(conn)
        
        available_rooms = []
        for v in venues:
            # Check availability
            is_under_maint = rule_engine.is_room_under_maintenance(v['venue_name'], date)
            has_booking_overlap = rule_engine.check_booking_overlap(v['venue_name'], date, start_time, end_time)
            
            try:
                import datetime
                dt = datetime.datetime.strptime(date, '%Y-%m-%d')
                day_of_week = dt.strftime('%A')
                has_timetable_overlap = rule_engine.check_timetable_overlap(v['venue_name'], day_of_week, start_time, end_time)
            except Exception:
                has_timetable_overlap = False
                
            if not is_under_maint and not has_booking_overlap and not has_timetable_overlap:
                available_rooms.append({
                    "venue_name": v["venue_name"],
                    "venue_type": v["venue_type"],
                    "block": v["block"],
                    "floor": v["floor"],
                    "capacity": v["capacity"],
                    "projector": v["projector"],
                    "ac": v["ac"],
                    "num_pcs": v["num_pcs"],
                    "department_preference": v.get("department_preference", "General")
                })
                
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

def get_suitable_replacement_room(orig_room_name, req_facs, student_dept, all_venues_list, venues_name_map, assigned_counts):
    if not req_facs:
        return orig_room_name
        
    orig_name_upper = orig_room_name.strip().upper()
    orig_room = venues_name_map.get(orig_name_upper)
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
        if not check_room_satisfies_facilities(v, req_facs):
            continue
            
        # Verify type category match
        is_candidate_lab = "lab" in v["venue_type"].lower() or "laboratory" in v["venue_type"].lower()
        if is_candidate_lab != is_orig_lab:
            continue
            
        v_name_upper = v["venue_name"].strip().upper()
        current_count = assigned_counts.get(v_name_upper, 0)
        capacity = v["capacity"]
        
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
        cap_score = v["capacity"]
        
        candidates.append((v, block_score, dept_score, cap_score))
        
    if not candidates:
        # Fallback: if all satisfying rooms are full, look at all satisfying rooms (even if full)
        # and choose the one with the most remaining capacity (or least over-allocated)
        for v in all_venues_list:
            if not check_room_satisfies_facilities(v, req_facs):
                continue
            is_candidate_lab = "lab" in v["venue_type"].lower() or "laboratory" in v["venue_type"].lower()
            if is_candidate_lab != is_orig_lab:
                continue
                
            v_name_upper = v["venue_name"].strip().upper()
            current_count = assigned_counts.get(v_name_upper, 0)
            
            block_score = 1 if (orig_block and v["block"] == orig_block) else 0
            v_dept = v.get("department_preference", "General")
            dept_score = 2 if (v_dept.upper() == student_dept.upper()) else (1 if v_dept == "General" else 0)
            
            # For fallback, sort by remaining capacity: capacity - current_count
            remaining_cap = v["capacity"] - current_count
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
                "orig_venue_an": venue_an
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
                    capacity = v_info["capacity"] if v_info else 40
                    
                    while assigned_fn.get(current_lab.strip().upper(), 0) >= capacity:
                        lab_idx += 1
                        if lab_idx < len(dept_labs):
                            current_lab = dept_labs[lab_idx]
                            v_info = venues_by_name.get(current_lab.strip().upper())
                            capacity = v_info["capacity"] if v_info else 40
                        else:
                            last_lab = dept_labs[-1]
                            current_lab = get_suitable_replacement_room(last_lab, req_fn_facilities or [], dept_name, all_venues, venues_by_name, assigned_fn)
                            dept_labs.append(current_lab)
                            v_info = venues_by_name.get(current_lab.strip().upper())
                            capacity = v_info["capacity"] if v_info else 40
                            
                    resolved_lab = current_lab
                    if req_fn_facilities:
                        orig_room = venues_by_name.get(current_lab.strip().upper())
                        if not (orig_room and check_room_satisfies_facilities(orig_room, req_fn_facilities)):
                            resolved_lab = get_suitable_replacement_room(current_lab, req_fn_facilities, dept_name, all_venues, venues_by_name, assigned_fn)
                            
                    s["allotted_lab_fn"] = resolved_lab
                    assigned_fn[resolved_lab.strip().upper()] = assigned_fn.get(resolved_lab.strip().upper(), 0) + 1
                    
                # Allocate Afternoon Venues
                venue_idx = 0
                current_venue = dept_venues[0]
                for s in students_in_dept:
                    v_info = venues_by_name.get(current_venue.strip().upper())
                    capacity = v_info["capacity"] if v_info else 40
                    
                    while assigned_an.get(current_venue.strip().upper(), 0) >= capacity:
                        venue_idx += 1
                        if venue_idx < len(dept_venues):
                            current_venue = dept_venues[venue_idx]
                            v_info = venues_by_name.get(current_venue.strip().upper())
                            capacity = v_info["capacity"] if v_info else 40
                        else:
                            last_venue = dept_venues[-1]
                            current_venue = get_suitable_replacement_room(last_venue, req_an_facilities or [], dept_name, all_venues, venues_by_name, assigned_an)
                            dept_venues.append(current_venue)
                            v_info = venues_by_name.get(current_venue.strip().upper())
                            capacity = v_info["capacity"] if v_info else 40
                            
                    resolved_venue = current_venue
                    if req_an_facilities:
                        orig_room = venues_by_name.get(current_venue.strip().upper())
                        if not (orig_room and check_room_satisfies_facilities(orig_room, req_an_facilities)):
                            resolved_venue = get_suitable_replacement_room(current_venue, req_an_facilities, dept_name, all_venues, venues_by_name, assigned_an)
                            
                    s["allotted_venue_an"] = resolved_venue
                    assigned_an[resolved_venue.strip().upper()] = assigned_an.get(resolved_venue.strip().upper(), 0) + 1
                    
                for s in students_in_dept:
                    students_allotted.append({
                        "S.No": len(students_allotted) + 1,
                        "Reg No": s["reg_no"],
                        "Student Name": s["name"],
                        "Department": s["department"],
                        "Lab (FN)": s["allotted_lab_fn"],
                        "Venue (AN)": s["allotted_venue_an"]
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
                capacity = v_info["capacity"] if v_info else 40
                
                while assigned_fn.get(current_lab.strip().upper(), 0) >= capacity:
                    lab_idx += 1
                    if lab_idx < len(all_labs):
                        current_lab = all_labs[lab_idx]
                        v_info = venues_by_name.get(current_lab.strip().upper())
                        capacity = v_info["capacity"] if v_info else 40
                    else:
                        last_lab = all_labs[-1]
                        current_lab = get_suitable_replacement_room(last_lab, req_fn_facilities or [], s["department"], all_venues, venues_by_name, assigned_fn)
                        all_labs.append(current_lab)
                        v_info = venues_by_name.get(current_lab.strip().upper())
                        capacity = v_info["capacity"] if v_info else 40
                        
                resolved_lab = current_lab
                if req_fn_facilities:
                    orig_room = venues_by_name.get(current_lab.strip().upper())
                    if not (orig_room and check_room_satisfies_facilities(orig_room, req_fn_facilities)):
                        resolved_lab = get_suitable_replacement_room(current_lab, req_fn_facilities, s["department"], all_venues, venues_by_name, assigned_fn)
                        
                s["allotted_lab_fn"] = resolved_lab
                assigned_fn[resolved_lab.strip().upper()] = assigned_fn.get(resolved_lab.strip().upper(), 0) + 1
                
            # Allocate Afternoon Venues
            venue_idx = 0
            current_venue = all_venues_list[0]
            for s in students_pool:
                v_info = venues_by_name.get(current_venue.strip().upper())
                capacity = v_info["capacity"] if v_info else 40
                
                while assigned_an.get(current_venue.strip().upper(), 0) >= capacity:
                    venue_idx += 1
                    if venue_idx < len(all_venues_list):
                        current_venue = all_venues_list[venue_idx]
                        v_info = venues_by_name.get(current_venue.strip().upper())
                        capacity = v_info["capacity"] if v_info else 40
                    else:
                        last_venue = all_venues_list[-1]
                        current_venue = get_suitable_replacement_room(last_venue, req_an_facilities or [], s["department"], all_venues, venues_by_name, assigned_an)
                        all_venues_list.append(current_venue)
                        v_info = venues_by_name.get(current_venue.strip().upper())
                        capacity = v_info["capacity"] if v_info else 40
                        
                resolved_venue = current_venue
                if req_an_facilities:
                    orig_room = venues_by_name.get(current_venue.strip().upper())
                    if not (orig_room and check_room_satisfies_facilities(orig_room, req_an_facilities)):
                        resolved_venue = get_suitable_replacement_room(current_venue, req_an_facilities, s["department"], all_venues, venues_by_name, assigned_an)
                        
                s["allotted_venue_an"] = resolved_venue
                assigned_an[resolved_venue.strip().upper()] = assigned_an.get(resolved_venue.strip().upper(), 0) + 1
                
            for s in students_pool:
                students_allotted.append({
                    "S.No": len(students_allotted) + 1,
                    "Reg No": s["reg_no"],
                    "Student Name": s["name"],
                    "Department": s["department"],
                    "Lab (FN)": s["allotted_lab_fn"],
                    "Venue (AN)": s["allotted_venue_an"]
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
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    temp_file_path = os.path.join(BASE_DIR, "data", "temp", f"{session_id}.xlsx")
    
    if not os.path.exists(temp_file_path):
        raise HTTPException(status_code=404, detail="Allotment file not found or expired. Please upload the student list again.")
        
    return FileResponse(
        path=temp_file_path,
        filename="Venue Mapping.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

