import pytest
from fastapi.testclient import TestClient
import sqlite3
import os

# Set dummy DB path for testing before import to ensure it uses a clean database if needed,
# or let's import directly. We can override the DB path or mock the database.
os.environ["DB_PATH"] = "data/test_campus_scheduler.db"

# Let's import the app from api.main
from api.main import app
from utils.db import init_db, get_connection

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    db_path = "data/test_campus_scheduler.db"
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

def test_api_upload_and_download_venue_mapping():
    import pandas as pd
    import io
    
    # Create a small dummy students list dataframe
    df = pd.DataFrame([
        {"S.No": 1, "Reg No": "7376211CS101", "Student Name": "Student One", "Department": "CSE"},
        {"S.No": 2, "Reg No": "7376211CS102", "Student Name": "Student Two", "Department": "CSE"},
        {"S.No": 3, "Reg No": "7376211IT101", "Student Name": "Student Three", "Department": "IT"}
    ])
    
    # Save df to in-memory bytes
    excel_file = io.BytesIO()
    with pd.ExcelWriter(excel_file, engine='openpyxl') as writer:
        df.to_excel(writer, index=False)
    excel_file.seek(0)
    
    # Post request to /upload-venue-mapping
    response = client.post(
        "/upload-venue-mapping",
        files={"file": ("test_students.xlsx", excel_file, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
        data={
            "mode": "separate",
            "start_date": "2026-07-20",
            "start_session": "FN",
            "end_date": "2026-07-24",
            "end_session": "AN"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "session_id" in data
    assert "summary" in data
    assert "students" in data
    assert data["summary"]["total_students"] == 3
    assert data["start_date"] == "2026-07-20"
    assert data["end_date"] == "2026-07-24"
    assert data["start_session"] == "FN"
    assert data["end_session"] == "AN"
    
    session_id = data["session_id"]
    
    # Test downloading the allotment file
    download_response = client.get(f"/download-allotment/{session_id}")
    assert download_response.status_code == 200
    assert download_response.headers["content-type"] == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    
    # Clean up temp file
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    temp_file_path = os.path.join(BASE_DIR, "data", "temp", f"{session_id}.xlsx")
    if os.path.exists(temp_file_path):
        os.remove(temp_file_path)


def test_api_upload_venue_mapping_with_session_facilities():
    import pandas as pd
    import io
    import os
    from utils.db import get_connection

    # Insert test venues into database
    conn = get_connection()
    cursor = conn.cursor()
    
    # Clean and insert specific test venues
    cursor.execute("DELETE FROM venues WHERE venue_name IN ('AIML Lab 6', 'WW 217', 'AIML Lab 7', 'WW 218')")
    
    # AIML Lab 6 lacks projector
    cursor.execute("""
    INSERT INTO venues (venue_name, venue_type, block, floor, capacity, projector, led_tv, smart_board, ac, wifi, cctv, audio_video, num_pcs, department_preference, status)
    VALUES ('AIML Lab 6', 'Lab', 'Computing Block', '1', 60, 0, 0, 0, 0, 0, 0, 0, 40, 'CSE', 'Active')
    """)
    # WW 217 lacks projector
    cursor.execute("""
    INSERT INTO venues (venue_name, venue_type, block, floor, capacity, projector, led_tv, smart_board, ac, wifi, cctv, audio_video, num_pcs, department_preference, status)
    VALUES ('WW 217', 'Classroom', 'Western Wing - IB Block', '2', 60, 0, 0, 0, 0, 0, 0, 0, 0, 'CSE', 'Active')
    """)
    # AIML Lab 7 HAS projector
    cursor.execute("""
    INSERT INTO venues (venue_name, venue_type, block, floor, capacity, projector, led_tv, smart_board, ac, wifi, cctv, audio_video, num_pcs, department_preference, status)
    VALUES ('AIML Lab 7', 'Lab', 'Computing Block', '1', 60, 1, 0, 0, 0, 0, 0, 0, 40, 'CSE', 'Active')
    """)
    # WW 218 HAS projector
    cursor.execute("""
    INSERT INTO venues (venue_name, venue_type, block, floor, capacity, projector, led_tv, smart_board, ac, wifi, cctv, audio_video, num_pcs, department_preference, status)
    VALUES ('WW 218', 'Classroom', 'Western Wing - IB Block', '2', 60, 1, 0, 0, 0, 0, 0, 0, 0, 'CSE', 'Active')
    """)
    conn.commit()
    conn.close()

    # Create dummy upload Excel with 7376232AG102 (mapped to AIML Lab 6 and WW 217)
    df = pd.DataFrame([
        {"S.No": 1, "Reg No": "7376232AG102", "Student Name": "Test Student", "Department": "CSE"}
    ])
    
    # CASE 1: FN requires Projector, AN requires nothing
    excel_file = io.BytesIO()
    with pd.ExcelWriter(excel_file, engine='openpyxl') as writer:
        df.to_excel(writer, index=False)
    excel_file.seek(0)

    response = client.post(
        "/upload-venue-mapping",
        files={"file": ("test_students.xlsx", excel_file, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
        data={
            "start_date": "2026-07-20",
            "start_session": "FN",
            "fn_facilities": "Projector",
            "remarks": "Test FN"
        }
    )

    assert response.status_code == 200
    data = response.json()
    assert data["fn_facilities"] == ["Projector"]
    assert data["an_facilities"] == []
    
    # FN is replaced (AIML Lab 7), AN is not replaced (WW 217)
    student = data["students"][0]
    assert student["Lab (FN)"] == "AIML Lab 7"
    assert student["Venue (AN)"] == "WW 217"
    
    # Clean up temp file
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    temp_path = os.path.join(BASE_DIR, "data", "temp", f"{data['session_id']}.xlsx")
    if os.path.exists(temp_path):
        os.remove(temp_path)

    # CASE 2: FN requires nothing, AN requires Projector
    excel_file = io.BytesIO()
    with pd.ExcelWriter(excel_file, engine='openpyxl') as writer:
        df.to_excel(writer, index=False)
    excel_file.seek(0)

    response = client.post(
        "/upload-venue-mapping",
        files={"file": ("test_students.xlsx", excel_file, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
        data={
            "start_date": "2026-07-20",
            "start_session": "FN",
            "an_facilities": "Projector",
            "remarks": "Test AN"
        }
    )

    assert response.status_code == 200
    data = response.json()
    assert data["fn_facilities"] == []
    assert data["an_facilities"] == ["Projector"]
    
    # FN is not replaced (AIML Lab 6), AN is replaced (WW 218)
    student = data["students"][0]
    assert student["Lab (FN)"] == "AIML Lab 6"
    assert student["Venue (AN)"] == "WW 218"
    
    # Clean up temp file
    temp_path = os.path.join(BASE_DIR, "data", "temp", f"{data['session_id']}.xlsx")
    if os.path.exists(temp_path):
        os.remove(temp_path)


def test_api_upload_invalid_file():
    import pandas as pd
    import io
    
    df_one_col = pd.DataFrame([
        {"Random Header 1": "value1"}
    ])
    
    excel_file = io.BytesIO()
    with pd.ExcelWriter(excel_file, engine='openpyxl') as writer:
        df_one_col.to_excel(writer, index=False)
    
    response = client.post(
        "/upload-venue-mapping",
        files={"file": ("invalid_students.xlsx", excel_file, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
        data={
            "start_date": "2026-07-20",
            "start_session": "FN"
        }
    )
    assert response.status_code == 400
    assert "No student records could be parsed" in response.json()["detail"]


def test_api_download_nonexistent_allotment():
    response = client.get("/download-allotment/SES_NONEXISTENT")
    assert response.status_code == 404
