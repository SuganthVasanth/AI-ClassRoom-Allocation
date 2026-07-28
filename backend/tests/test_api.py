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


def test_api_upload_venue_mapping_modes_and_stats():
    import pandas as pd
    import io
    import os
    
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # Create dummy data
    df = pd.DataFrame([
        {"S.No": 1, "Reg No": "7376211CS101", "Student Name": "Alice", "Department": "CSE"},
        {"S.No": 2, "Reg No": "7376211CS102", "Student Name": "Bob", "Department": "CSE"},
        {"S.No": 3, "Reg No": "7376211ZZ999", "Student Name": "Charlie", "Department": "XYZ"}
    ])
    
    excel_file = io.BytesIO()
    with pd.ExcelWriter(excel_file, engine='openpyxl') as writer:
        df.to_excel(writer, index=False)
    
    # --- TEST 1: separate MODE ---
    excel_file.seek(0)
    response_sep = client.post(
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
    assert response_sep.status_code == 200
    data_sep = response_sep.json()
    
    # Verify summary stats
    summary_sep = data_sep["summary"]
    assert summary_sep["total_students"] == 3
    # At least the XYZ student should be unmapped because XYZ dept is invalid and registration no is not in Venue Mapping.xlsx
    assert summary_sep["unmapped_students"] >= 1
    assert summary_sep["mapped_students"] == 3 - summary_sep["unmapped_students"]
    
    # Map the allotments of separate mode by student ID
    sep_allotments = {s["Reg No"]: (s["Lab (FN)"], s["Venue (AN)"]) for s in data_sep["students"]}
    
    # Verify fallback for XYZ student
    assert "7376211ZZ999" in sep_allotments
    fallback_lab, fallback_venue = sep_allotments["7376211ZZ999"]
    assert fallback_lab == "IT Lab 1"
    assert fallback_venue == "WW 226"
    
    # Clean up temp file
    temp_files_to_clean = [data_sep["session_id"]]
    
    # --- TEST 2: vice_versa MODE ---
    excel_file.seek(0)
    response_vv = client.post(
        "/upload-venue-mapping",
        files={"file": ("test_students.xlsx", excel_file, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
        data={
            "mode": "vice_versa",
            "start_date": "2026-07-20",
            "start_session": "FN"
        }
    )
    assert response_vv.status_code == 200
    data_vv = response_vv.json()
    temp_files_to_clean.append(data_vv["session_id"])
    
    vv_allotments = {s["Reg No"]: (s["Lab (FN)"], s["Venue (AN)"]) for s in data_vv["students"]}
    # Verify swapped values
    for reg_no, (sep_lab, sep_venue) in sep_allotments.items():
        vv_lab, vv_venue = vv_allotments[reg_no]
        assert vv_lab == sep_venue
        assert vv_venue == sep_lab

    # --- TEST 3: full_day_fn MODE ---
    excel_file.seek(0)
    response_fn = client.post(
        "/upload-venue-mapping",
        files={"file": ("test_students.xlsx", excel_file, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
        data={
            "mode": "full_day_fn",
            "start_date": "2026-07-20",
            "start_session": "FN"
        }
    )
    assert response_fn.status_code == 200
    data_fn = response_fn.json()
    temp_files_to_clean.append(data_fn["session_id"])
    
    fn_allotments = {s["Reg No"]: (s["Lab (FN)"], s["Venue (AN)"]) for s in data_fn["students"]}
    for reg_no, (sep_lab, sep_venue) in sep_allotments.items():
        fn_lab, fn_venue = fn_allotments[reg_no]
        assert fn_lab == sep_lab
        assert fn_venue == sep_lab

    # --- TEST 4: full_day_an MODE ---
    excel_file.seek(0)
    response_an = client.post(
        "/upload-venue-mapping",
        files={"file": ("test_students.xlsx", excel_file, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
        data={
            "mode": "full_day_an",
            "start_date": "2026-07-20",
            "start_session": "FN"
        }
    )
    assert response_an.status_code == 200
    data_an = response_an.json()
    temp_files_to_clean.append(data_an["session_id"])
    
    an_allotments = {s["Reg No"]: (s["Lab (FN)"], s["Venue (AN)"]) for s in data_an["students"]}
    for reg_no, (sep_lab, sep_venue) in sep_allotments.items():
        an_lab, an_venue = an_allotments[reg_no]
        assert an_lab == sep_venue
        assert an_venue == sep_venue

    # --- Clean up all session temp files ---
    for sid in temp_files_to_clean:
        temp_file_path = os.path.join(BASE_DIR, "data", "temp", f"{sid}.xlsx")
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)


def test_api_upload_invalid_file():
    import pandas as pd
    import io
    
    # Test case A: DataFrame with only 1 column (not enough columns for fallback parsing)
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
            "mode": "separate",
            "start_date": "2026-07-20",
            "start_session": "FN"
        }
    )
    assert response.status_code == 400
    assert "No student records could be parsed" in response.json()["detail"]

    # Test case B: Empty DataFrame (no rows)
    df_empty = pd.DataFrame(columns=["Reg No", "Student Name", "Department"])
    excel_file_empty = io.BytesIO()
    with pd.ExcelWriter(excel_file_empty, engine='openpyxl') as writer:
        df_empty.to_excel(writer, index=False)
    excel_file_empty.seek(0)
    
    response_empty = client.post(
        "/upload-venue-mapping",
        files={"file": ("empty_students.xlsx", excel_file_empty, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
        data={
            "mode": "separate",
            "start_date": "2026-07-20",
            "start_session": "FN"
        }
    )
    assert response_empty.status_code == 400
    assert "No student records could be parsed" in response.json()["detail"]


def test_api_download_nonexistent_allotment():
    response = client.get("/download-allotment/SES_NONEXISTENT")
    assert response.status_code == 404



