import sqlite3
import pytest
import pandas as pd
import json
from optimization.allocator import OptimizationEngine

@pytest.fixture
def opt_db():
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute("""
    CREATE TABLE venues (
        venue_name TEXT PRIMARY KEY, venue_type TEXT, block TEXT, floor TEXT, capacity INTEGER,
        projector INTEGER, led_tv INTEGER, smart_board INTEGER, ac INTEGER, wifi INTEGER,
        cctv INTEGER, audio_video INTEGER, num_pcs INTEGER, department_preference TEXT, status TEXT
    )
    """)
    cursor.execute("""
    CREATE TABLE building_distances (
        building_a TEXT, building_b TEXT, distance_meters INTEGER
    )
    """)
    cursor.execute("""
    CREATE TABLE bookings (
        booking_id TEXT PRIMARY KEY, venue_name TEXT, purpose TEXT, student_count INTEGER,
        faculty_id TEXT, department TEXT, start_time TEXT, end_time TEXT, date TEXT, status TEXT,
        preferred_building TEXT
    )
    """)
    cursor.execute("""
    CREATE TABLE allocation_history (
        allocation_id TEXT PRIMARY KEY, venue_name TEXT, purpose TEXT, student_count INTEGER,
        faculty_id TEXT, department TEXT, start_time TEXT, end_time TEXT, date TEXT, status TEXT,
        utilization_rate REAL, satisfaction_score INTEGER, is_peak_hour INTEGER
    )
    """)
    cursor.execute("""
    CREATE TABLE timetable (
        course_code TEXT, department TEXT, year INTEGER, semester INTEGER, student_count INTEGER,
        faculty_id TEXT, day_of_week TEXT, start_time TEXT, end_time TEXT, venue_name TEXT
    )
    """)
    cursor.execute("""
    CREATE TABLE maintenance_schedule (
        venue_name TEXT, start_date TEXT, end_date TEXT, description TEXT
    )
    """)
    cursor.execute("""
    CREATE TABLE model_metadata (
        version TEXT PRIMARY KEY, trained_at TEXT, records_count INTEGER, accuracy REAL, f1_score REAL, top5_accuracy REAL, is_active INTEGER
    )
    """)
    
    # Insert two rooms: ME101 (capacity 40, Mech Block) and SF101 (capacity 80, Sunflower Block)
    cursor.execute("INSERT INTO venues VALUES ('ME101', 'Classroom', 'Mech Block', '1', 40, 1, 0, 0, 0, 1, 1, 0, 0, 'MECH', 'Active')")
    cursor.execute("INSERT INTO venues VALUES ('SF101', 'Classroom', 'Sunflower Block', '1', 80, 1, 0, 0, 1, 1, 1, 0, 0, 'CSE', 'Active')")
    
    # Distance between blocks
    cursor.execute("INSERT INTO building_distances VALUES ('Mech Block', 'Sunflower Block', 300)")
    cursor.execute("INSERT INTO building_distances VALUES ('Mech Block', 'Mech Block', 0)")
    cursor.execute("INSERT INTO building_distances VALUES ('Sunflower Block', 'Sunflower Block', 0)")
    
    conn.commit()
    yield conn
    conn.close()

def test_optimization_cost(opt_db, tmp_path):
    # Create a temporary config file
    config_file = tmp_path / "test_config.json"
    config_data = {
        "optimization": {
            "weights": {
                "distance": 0.4,
                "capacity_wastage": 0.4,
                "ml_score": 0.2
            }
        }
    }
    with open(config_file, "w") as f:
        json.dump(config_data, f)
        
    engine = OptimizationEngine(opt_db, config_path=str(config_file))
    
    # Mock ML recommendation model output to return uniform scores
    engine.recommender.model = None # triggers uniform score fallback in RoomRecommender
    
    # Request for 35 students from MECH department
    # Previous class was in ME101 (Mech Block)
    # We expect ME101 to have 0 distance penalty and small capacity wastage
    # SF101 will have 300m distance penalty and large capacity wastage
    
    # Insert a previous class history to trigger distance calculations
    cursor = opt_db.cursor()
    cursor.execute("""
        INSERT INTO allocation_history VALUES (
            'AL_PREV', 'ME101', 'Class', 30, 'FAC01', 'MECH', '08:00', '09:00', '2026-07-20', 'Approved', 0.75, 5, 1
        )
    """)
    opt_db.commit()
    
    request = {
        'purpose': 'Class',
        'student_count': 30,
        'date': '2026-07-20',
        'start_time': '09:00',
        'end_time': '10:00',
        'department': 'MECH',
        'faculty_id': 'FAC01'
    }
    
    result = engine.allocate_room(request)
    
    assert result is not None
    # ME101 should be chosen because it is closer (dist=0 vs 300) and has less capacity wastage (40 vs 80)
    assert result['allocated_room']['venue_name'] == 'ME101'
    assert result['distance_from_prev'] == 0
    assert result['capacity_wastage'] == 10 # 40 - 30
