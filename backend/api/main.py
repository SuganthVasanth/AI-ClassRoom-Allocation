import os
import sqlite3
import logging
from typing import Dict, List, Optional
from fastapi import FastAPI, HTTPException, Query
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
    conn = get_connection()
    try:
        opt_engine = OptimizationEngine(conn)
        result = opt_engine.allocate_room(request.dict())
        if not result:
            raise HTTPException(status_code=404, detail="No suitable room could be allocated satisfying the constraints.")
            
        # Check if retraining is needed (1000 record threshold check)
        # This will retrain the model asynchronously or synchronously if threshold met.
        try:
            trigger_retraining_if_needed(threshold=1000)
        except Exception as retrain_err:
            logger.error(f"Retraining check error: {retrain_err}")
            
        return result
    except Exception as e:
        logger.error(f"Error in recommend-room: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.post("/allocate-exam")
def allocate_exam(request: ExamRequest):
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
    except Exception as e:
        logger.error(f"Error in allocate-exam: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.post("/generate-seat-plan")
def generate_seat_plan(request: SeatingRequest):
    conn = get_connection()
    try:
        # Convert broken seats from list of lists to list of tuples
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
                    "num_pcs": v["num_pcs"]
                })
                
        return {"available_rooms_count": len(available_rooms), "rooms": available_rooms}
    except Exception as e:
        logger.error(f"Error in room-availability: {e}")
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
