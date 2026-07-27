import sqlite3
import pytest
import pandas as pd
from rule_engine.checker import RuleEngine, check_time_overlap

def test_time_overlap():
    # Complete overlap
    assert check_time_overlap("09:00", "10:00", "09:00", "10:00") is True
    # Partial overlap
    assert check_time_overlap("09:00", "10:00", "09:30", "10:30") is True
    # Touch but no overlap
    assert check_time_overlap("09:00", "10:00", "10:00", "11:00") is False
    # Completely separate
    assert check_time_overlap("09:00", "10:00", "11:00", "12:00") is False

@pytest.fixture
def temp_db():
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
    CREATE TABLE bookings (
        booking_id TEXT PRIMARY KEY, venue_name TEXT, purpose TEXT, student_count INTEGER,
        faculty_id TEXT, department TEXT, start_time TEXT, end_time TEXT, date TEXT, status TEXT
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
    
    # Populate a test venue
    cursor.execute("""
    INSERT INTO venues VALUES (
        'ME101', 'Classroom', 'Mech Block', '1', 40,
        1, 0, 0, 0, 1, 1, 0, 0, 'MECH', 'Active'
    )
    """)
    
    # Populate a maintenance window
    cursor.execute("INSERT INTO maintenance_schedule VALUES ('ME101', '2026-07-20', '2026-07-22', 'Painting')")
    
    # Populate a timetable entry (recurring Monday class)
    cursor.execute("INSERT INTO timetable VALUES ('ME101_CLASS', 'MECH', 1, 1, 30, 'FAC01', 'Monday', '09:00', '10:00', 'ME101')")
    
    # Populate an ad-hoc booking (on Friday July 24)
    cursor.execute("INSERT INTO bookings VALUES ('B01', 'ME101', 'Class', 35, 'FAC01', 'MECH', '14:00', '15:00', '2026-07-24', 'Approved')")
    
    conn.commit()
    yield conn
    conn.close()

def test_rule_validation(temp_db):
    rule_engine = RuleEngine(temp_db)
    
    # Construct room row series
    cursor = temp_db.cursor()
    cursor.execute("SELECT * FROM venues WHERE venue_name = 'ME101'")
    room_row = dict(cursor.fetchone())
    
    # Case 1: Valid request
    req_valid = {
        'purpose': 'Class',
        'student_count': 35,
        'date': '2026-07-23', # Thursday (no recurring class conflict)
        'start_time': '09:00',
        'end_time': '10:00',
        'department': 'MECH'
    }
    is_valid, msg = rule_engine.validate_room(room_row, req_valid)
    assert is_valid is True
    
    # Case 2: Capacity conflict
    req_capacity = req_valid.copy()
    req_capacity['student_count'] = 50 # capacity is 40
    is_valid, msg = rule_engine.validate_room(room_row, req_capacity)
    assert is_valid is False
    assert "Capacity" in msg
    
    # Case 3: Maintenance conflict (Monday July 20)
    req_maint = req_valid.copy()
    req_maint['date'] = '2026-07-20'
    is_valid, msg = rule_engine.validate_room(room_row, req_maint)
    assert is_valid is False
    assert "maintenance" in msg
    
    # Case 4: Timetable conflict (Monday July 27, 09:30-10:30 overlaps with 09:00-10:00 class)
    req_timetable = req_valid.copy()
    req_timetable['date'] = '2026-07-27' # Monday
    req_timetable['start_time'] = '09:30'
    req_timetable['end_time'] = '10:30'
    is_valid, msg = rule_engine.validate_room(room_row, req_timetable)
    assert is_valid is False
    assert "timetable" in msg or "class" in msg
    
    # Case 5: Booking conflict (Friday July 24, 14:30-15:30 overlaps with 14:00-15:00 booking)
    req_booking = req_valid.copy()
    req_booking['date'] = '2026-07-24'
    req_booking['start_time'] = '14:30'
    req_booking['end_time'] = '15:30'
    is_valid, msg = rule_engine.validate_room(room_row, req_booking)
    assert is_valid is False
    assert "ad-hoc booking" in msg or "booking" in msg
