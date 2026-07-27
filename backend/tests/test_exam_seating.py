import sqlite3
import pytest
from exam_allocator.allocator import ExamHallAllocator
from seat_allocator.allocator import SeatAllocator

@pytest.fixture
def exam_db():
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
    CREATE TABLE allocation_history (
        allocation_id TEXT PRIMARY KEY, venue_name TEXT, purpose TEXT, student_count INTEGER,
        faculty_id TEXT, department TEXT, start_time TEXT, end_time TEXT, date TEXT, status TEXT,
        utilization_rate REAL, satisfaction_score INTEGER, is_peak_hour INTEGER
    )
    """)
    cursor.execute("""
    CREATE TABLE seat_allocation (
        allocation_id TEXT, student_id TEXT, roll_number TEXT, department TEXT, seat_number TEXT,
        row_num INTEGER, col_num INTEGER, is_accessibility INTEGER
    )
    """)
    
    # Insert exam halls: ME301 (capacity 50), ME302 (capacity 50), ME303 (capacity 50)
    cursor.execute("INSERT INTO venues VALUES ('ME301', 'Classroom', 'Mech Block', '3', 50, 0, 0, 0, 0, 1, 1, 0, 0, 'General', 'Active')")
    cursor.execute("INSERT INTO venues VALUES ('ME302', 'Classroom', 'Mech Block', '3', 50, 0, 0, 0, 0, 1, 1, 0, 0, 'General', 'Active')")
    cursor.execute("INSERT INTO venues VALUES ('ME303', 'Classroom', 'Mech Block', '3', 50, 0, 0, 0, 0, 1, 1, 0, 0, 'General', 'Active')")
    
    conn.commit()
    yield conn
    conn.close()

def test_exam_hall_splitting(exam_db):
    allocator = ExamHallAllocator(exam_db)
    
    cohort_counts = {'CSE': 72, 'AIML': 50, 'AIDS': 53} # Total 175 students
    # Available room capacities: ME301 (50), ME302 (50), ME303 (50) -> Total 150 capacity
    
    result = allocator.allocate_exam_halls(
        cohort_counts=cohort_counts,
        exam_date='2026-08-05',
        start_time='09:30',
        end_time='12:30'
    )
    
    # Assert 150 students allocated, 25 unallocated due to room capacity limits
    assert result['allocated_count'] == 150
    assert result['unallocated_count'] == 25
    assert result['rooms_allocated'] == 3
    
    # Check that rooms are filled to capacity
    for alloc in result['allocations']:
        assert alloc['allocated_count'] == 50

def test_seat_allocation(exam_db):
    allocator = SeatAllocator(exam_db)
    
    # Generate 20 students from 2 departments, 2 with accessibility needs
    students = []
    for i in range(10):
        students.append({
            'student_id': f"BIT_CS_{i}",
            'roll_number': f"CS{101+i}",
            'department': 'CSE',
            'is_disabled': 1 if i == 0 else 0
        })
        students.append({
            'student_id': f"BIT_ML_{i}",
            'roll_number': f"ML{101+i}",
            'department': 'AIML',
            'is_disabled': 1 if i == 0 else 0
        })
        
    # Total students: 20. Room capacity: 24. Grid size: 4 rows x 6 columns
    # Broken seats: (2, 3) and (2, 4)
    broken = [(2, 3), (2, 4)]
    
    result = allocator.allocate_seats(
        allocation_id="TEST_SEAT_01",
        students=students,
        capacity=24,
        broken_seats=broken,
        num_cols=6
    )
    
    # Check dimensions
    assert result['dimensions']['rows'] == 4
    assert result['dimensions']['cols'] == 6
    assert result['student_count'] == 20
    
    # Check broken seats are marked [X] in seating chart
    chart = result['seating_chart']
    assert chart[1][2] == '[X]' # Row 2, Col 3 (0-indexed 1, 2)
    assert chart[1][3] == '[X]' # Row 2, Col 4 (0-indexed 1, 3)
    
    # Check that disabled students are placed in row 1
    seating_list = result['seating_list']
    disabled_assigned = [item for item in seating_list if item['is_accessibility'] == 1]
    assert len(disabled_assigned) == 2
    for item in disabled_assigned:
        assert item['row_num'] == 1
        
    # Check alternate seating: no adjacent cells have the same department
    # Let's inspect the seating chart
    for r in range(4):
        for c in range(5):
            cell_1 = chart[r][c]
            cell_2 = chart[r][c+1]
            if cell_1 not in ['-', '[X]'] and cell_2 not in ['-', '[X]']:
                dept_1 = 'CSE' if 'CS' in cell_1 else 'AIML'
                dept_2 = 'CSE' if 'CS' in cell_2 else 'AIML'
                assert dept_1 != dept_2
