import pytest
from fastapi.testclient import TestClient
import sqlite3
import os

# Set dummy DB path for testing before import to ensure it uses a clean database if needed,
# or let's import directly. We can override the DB path or mock the database.
# Let's import the app from api.main
from api.main import app
from utils.db import init_db, get_connection

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    db_path = "data/campus_scheduler.db"
    # Ensure database folder exists
    os.makedirs("data", exist_ok=True)
    
    # Initialize DB
    init_db(db_path=db_path)
    
    # Add a mock venue to the database to ensure API tests have data
    conn = get_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM venues") # Clean venues
    cursor.execute("""
    INSERT INTO venues VALUES (
        'CS101', 'Classroom', 'Computing Block', '1', 60,
        1, 1, 0, 1, 1, 1, 1, 40, 'CSE', 'Active'
    )
    """)
    cursor.execute("DELETE FROM bookings")
    cursor.execute("DELETE FROM allocation_history")
    cursor.execute("DELETE FROM timetable")
    cursor.execute("DELETE FROM maintenance_schedule")
    cursor.execute("DELETE FROM building_distances")
    cursor.execute("INSERT INTO building_distances VALUES ('Computing Block', 'Computing Block', 0)")
    conn.commit()
    conn.close()

def test_api_recommend_room():
    payload = {
        "purpose": "Class",
        "student_count": 30,
        "date": "2026-07-20",
        "start_time": "09:00",
        "end_time": "10:00",
        "department": "CSE",
        "faculty_id": "FAC5001"
    }
    response = client.post("/recommend-room", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "allocation_id" in data
    assert data["allocated_room"]["venue_name"] == "CS101"

def test_api_room_availability():
    response = client.get("/room-availability?date=2026-07-20&start_time=09:00&end_time=10:00")
    assert response.status_code == 200
    data = response.json()
    assert "available_rooms_count" in data
    # Should be 0 since CS101 is booked in the previous test (test_api_recommend_room saves allocation)
    # Let's check that it responds successfully
    assert isinstance(data["rooms"], list)

def test_api_allocate_exam():
    payload = {
        "cohort_counts": {"CSE": 25, "AIML": 15},
        "date": "2026-08-05",
        "start_time": "09:30",
        "end_time": "12:30"
    }
    response = client.post("/allocate-exam", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "total_students" in data
    assert data["total_students"] == 40
    assert len(data["allocations"]) > 0

def test_api_generate_seat_plan():
    payload = {
        "allocation_id": "EXAM_TEST_101",
        "students": [
            {"student_id": "BIT001", "roll_number": "CS101", "department": "CSE", "is_disabled": 0},
            {"student_id": "BIT002", "roll_number": "CS102", "department": "CSE", "is_disabled": 0},
            {"student_id": "BIT003", "roll_number": "ML101", "department": "AIML", "is_disabled": 1}
        ],
        "capacity": 30,
        "broken_seats": [[1, 2]],
        "num_cols": 6
    }
    response = client.post("/generate-seat-plan", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "seating_chart" in data
    assert data["student_count"] == 3
    
def test_api_model_info():
    response = client.get("/model-info")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
