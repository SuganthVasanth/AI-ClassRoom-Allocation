import os
import shutil
import logging
import sqlite3
import pandas as pd
from datetime import datetime

# Initialize logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("orchestrator")

from utils.synthetic_data import load_and_consolidate_venues, generate_synthetic_data
from utils.db import init_db, populate_db_from_csvs, get_connection
from ml.training.train import train_and_evaluate_models
from optimization.allocator import OptimizationEngine
from exam_allocator.allocator import ExamHallAllocator
from seat_allocator.allocator import SeatAllocator

def bootstrap_system():
    logger.info("==============================================")
    logger.info("BOOTSTRAPPING SCHEDULING SYSTEM")
    logger.info("==============================================")
    
    # 1. Create directories
    os.makedirs("data/raw", exist_ok=True)
    os.makedirs("data/processed", exist_ok=True)
    os.makedirs("data/synthetic", exist_ok=True)
    os.makedirs("models", exist_ok=True)
    
    # 2. Copy/Verify Master Venue Excel
    excel_source = "Master Venue Details.xlsx"
    excel_target = "data/raw/Master Venue Details.xlsx"
    if os.path.exists(excel_source):
        shutil.copy2(excel_source, excel_target)
        logger.info(f"Copied {excel_source} to {excel_target}")
    else:
        if not os.path.exists(excel_target):
            raise FileNotFoundError(f"Source file {excel_source} not found!")
            
    # 3. Clean and Consolidate Venues from Excel
    df_venues = load_and_consolidate_venues(excel_target)
    df_venues.to_csv("data/processed/consolidated_venues.csv", index=False)
    logger.info(f"Consolidated {len(df_venues)} venues to processed CSV.")
    
    # 4. Initialize Database Schema
    db_path = "data/campus_scheduler.db"
    init_db(db_path=db_path)
    
    # Write venues to DB
    conn = get_connection(db_path)
    df_venues.to_sql("venues", conn, if_exists="replace", index=False)
    logger.info("Saved consolidated venues to SQLite table 'venues'.")
    conn.close()
    
    # 5. Generate Synthetic Datasets
    generate_synthetic_data(df_venues, output_dir="data/synthetic")
    
    # 6. Populate Database with Synthetic Data
    populate_db_from_csvs(db_path=db_path, synthetic_dir="data/synthetic")
    
    # 7. Populate Distance Matrix into SQLite
    conn = get_connection(db_path)
    dist_csv = "data/synthetic/building_distance.csv"
    if os.path.exists(dist_csv):
        df_dist = pd.read_csv(dist_csv)
        df_dist.to_sql("building_distances", conn, if_exists="replace", index=False)
        logger.info("Loaded building distance matrix into table 'building_distances'.")
    conn.close()
    
    logger.info("System bootstrap completed successfully!")

def run_model_training():
    logger.info("\n==============================================")
    logger.info("TRAINING MACHINE LEARNING MODELS")
    logger.info("==============================================")
    model_ver, acc, f1, top5 = train_and_evaluate_models()
    logger.info(f"Active Model version: {model_ver}")
    logger.info(f"Model test accuracy: {acc:.4f}")
    logger.info(f"Model test F1-score: {f1:.4f}")
    logger.info(f"Model test Top-5 accuracy: {top5:.4f}")
    logger.info("ML Models trained and active model selected.")

def run_scheduler_demo():
    logger.info("\n==============================================")
    logger.info("RUNNING SCHEDULER & ALLOCATION DEMO")
    logger.info("==============================================")
    db_path = "data/campus_scheduler.db"
    conn = get_connection(db_path)
    
    # 1. Test Room Scheduling Recommendation & Optimization
    opt_engine = OptimizationEngine(conn)
    
    # Request details: Class booking for 45 students in CSE department
    # On a Monday, 09:00 - 10:00 (which might overlap with recurring class or not)
    # We will choose a date and time that fits
    test_request = {
        'purpose': 'Class',
        'student_count': 35,
        'date': '2026-07-22', # Wednesday
        'start_time': '11:15',
        'end_time': '12:15',
        'department': 'CSE',
        'faculty_id': 'FAC5001'
    }
    
    logger.info(f"Scheduling request: {test_request}")
    alloc_res = opt_engine.allocate_room(test_request)
    if alloc_res:
        logger.info(f"Allocation Result:")
        logger.info(f"  Allocation ID: {alloc_res['allocation_id']}")
        logger.info(f"  Selected Venue: {alloc_res['allocated_room']['venue_name']}")
        logger.info(f"  Venue Capacity: {alloc_res['allocated_room']['capacity']}")
        logger.info(f"  Venue Block: {alloc_res['allocated_room']['block']}")
        logger.info(f"  Walking Distance: {alloc_res['distance_from_prev']} meters")
        logger.info(f"  Optimization Cost: {alloc_res['cost']}")
        logger.info("  Top 5 ML Recommended Venues:")
        for r_name, score in alloc_res['top_5_recommendations']:
            logger.info(f"    - {r_name}: {score:.4f}")
    else:
        logger.warning("Allocation failed!")
        
    # 2. Test Examination Hall Allocation Splitting
    logger.info("\n----------------------------------------------")
    logger.info("TESTING EXAMINATION HALL ALLOCATION")
    logger.info("----------------------------------------------")
    exam_allocator = ExamHallAllocator(conn)
    cohort_counts = {'CSE': 72, 'AIML': 50, 'AIDS': 53} # Total 175 students
    
    exam_date = '2026-08-05'
    start_time = '09:30'
    end_time = '12:30'
    
    logger.info(f"Exam Cohorts: {cohort_counts}")
    exam_res = exam_allocator.allocate_exam_halls(
        cohort_counts=cohort_counts,
        exam_date=exam_date,
        start_time=start_time,
        end_time=end_time
    )
    
    logger.info(f"Exam Allocation Result Summary:")
    logger.info(f"  Total Students: {exam_res['total_students']}")
    logger.info(f"  Allocated Count: {exam_res['allocated_count']}")
    logger.info(f"  Unallocated Count: {exam_res['unallocated_count']}")
    logger.info(f"  Rooms Allocated: {exam_res['rooms_allocated']}")
    
    # Save the first room's student list for seating allocation
    first_room_alloc_id = None
    first_room_students = []
    first_room_capacity = 50
    
    for idx, alloc in enumerate(exam_res['allocations']):
        logger.info(f"  Room {idx+1}: {alloc['venue_name']} (Cap: {alloc['capacity']}) - Allocated: {alloc['allocated_count']}")
        logger.info(f"    Ranges: {alloc['ranges']}")
        if idx == 0:
            first_room_alloc_id = alloc['allocation_id']
            first_room_students = alloc['students']
            first_room_capacity = alloc['capacity']
            
    # 3. Test Seating Allocation Chart Generation
    logger.info("\n----------------------------------------------")
    logger.info("TESTING SEATING ALLOCATION ENGINE")
    logger.info("----------------------------------------------")
    if first_room_alloc_id:
        seat_allocator = SeatAllocator(conn)
        # Mark seat in Row 2, Col 3 and Row 2, Col 4 as broken
        broken_seats = [(2, 3), (2, 4)]
        
        # Tag first student as disabled to test accessibility placing
        if first_room_students:
            first_room_students[0]['is_disabled'] = 1
            first_room_students[1]['is_disabled'] = 1
            
        seating_res = seat_allocator.allocate_seats(
            allocation_id=first_room_alloc_id,
            students=first_room_students,
            capacity=first_room_capacity,
            broken_seats=broken_seats,
            num_cols=6
        )
        
        logger.info(f"Seating Chart Grid for Room {seating_res['allocation_id']}:")
        for row in seating_res['seating_chart']:
            logger.info("  " + " | ".join(row))
            
        logger.info(f"Sample seating list records (first 5):")
        for rec in seating_res['seating_list'][:5]:
            logger.info(f"  Roll: {rec['roll_number']}, Dept: {rec['department']}, Seat: {rec['seat_number']}, Acc: {rec['is_accessibility']}")
            
    conn.close()

if __name__ == "__main__":
    bootstrap_system()
    run_model_training()
    run_scheduler_demo()
    logger.info("\n==============================================")
    logger.info("DEMO FINISHED SUCCESSFULLY!")
    logger.info("To start the API Server, run: python -m uvicorn api.main:app --reload")
    logger.info("==============================================")
