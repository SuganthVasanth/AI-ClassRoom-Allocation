import logging
import math
import uuid
from utils.db import save_allocation_to_db

logger = logging.getLogger(__name__)

class ExamHallAllocator:
    def __init__(self, db_conn):
        self.conn = db_conn

    def allocate_exam_halls(self, cohort_counts, exam_date, start_time, end_time):
        """
        cohort_counts: dict of {dept_name: student_count}
                       e.g. {'CSE': 72, 'AIML': 50, 'AIDS': 53}
        """
        logger.info(f"Running Exam Hall Allocation for cohorts: {cohort_counts} on {exam_date}")
        
        # 1. Generate roll numbers for student groups
        # Map department prefix to letter code
        dept_prefixes = {
            'CSE': ('CS', 101),
            'AIML': ('ML', 101),
            'AIDS': ('AD', 101),
            'ECE': ('EC', 101),
            'EEE': ('EE', 101),
            'MECH': ('ME', 101),
            'CIVIL': ('CV', 101),
            'IT': ('IT', 101),
            'TEXTILE': ('TX', 101)
        }
        
        dept_students_map = {}
        for dept, count in cohort_counts.items():
            prefix, start_idx = dept_prefixes.get(dept, (dept[:2].upper(), 101))
            dept_students_map[dept] = []
            for i in range(count):
                roll_num = f"{prefix}{start_idx + i}"
                dept_students_map[dept].append({
                    'student_id': f"BIT_EX_{dept}_{start_idx + i}",
                    'roll_number': roll_num,
                    'department': dept,
                    'is_disabled': 0
                })
                
        # Round-robin interleaving across departments for anti-cheating exam seating
        student_pool = []
        max_dept_count = max([len(v) for v in dept_students_map.values()]) if dept_students_map else 0
        dept_keys = list(dept_students_map.keys())
        
        for idx in range(max_dept_count):
            for d in dept_keys:
                if idx < len(dept_students_map[d]):
                    student_pool.append(dept_students_map[d][idx])
                
        total_students = len(student_pool)
        if total_students == 0:
            return {"error": "No students to allocate"}

        # 2. Get available rooms (venues with venue_type = 'Classroom' or capacity >= 30)
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT venue_name, capacity FROM venues 
            WHERE status = 'Active' AND capacity >= 30 AND venue_type = 'Classroom'
            ORDER BY capacity DESC, venue_name ASC
        """)
        available_rooms = [dict(row) for row in cursor.fetchall()]
        
        if not available_rooms:
            cursor.execute("SELECT venue_name, capacity FROM venues WHERE status = 'Active' ORDER BY capacity DESC")
            available_rooms = [dict(row) for row in cursor.fetchall()]
            
        # 3. Sequentially allocate students to rooms based on capacity
        allocations = []
        student_idx = 0
        
        for room in available_rooms:
            if student_idx >= total_students:
                break
                
            room_name = room['venue_name']
            room_cap = room['capacity']
            
            # Fill the room up to its capacity
            room_students = []
            while student_idx < total_students and len(room_students) < room_cap:
                room_students.append(student_pool[student_idx])
                student_idx += 1
                
            if not room_students:
                continue
                
            # Summarize the department ranges in this room
            dept_segments = {}
            for s in room_students:
                dept = s['department']
                roll = s['roll_number']
                if dept not in dept_segments:
                    dept_segments[dept] = []
                dept_segments[dept].append(roll)
                
            summarized_ranges = []
            for dept, rolls in dept_segments.items():
                rolls_sorted = sorted(rolls, key=lambda r: int(''.join(filter(str.isdigit, r))))
                start_roll = rolls_sorted[0]
                end_roll = rolls_sorted[-1]
                summarized_ranges.append(f"{dept}: {start_roll}-{end_roll} ({len(rolls)} students)")
                
            # Generate allocation record
            alloc_id = f"EX_{uuid.uuid4().hex[:6].upper()}"
            
            alloc_record = {
                'allocation_id': alloc_id,
                'venue_name': room_name,
                'purpose': 'Exam',
                'student_count': len(room_students),
                'faculty_id': 'FAC_EXAM',
                'department': ','.join(dept_segments.keys()),
                'start_time': start_time,
                'end_time': end_time,
                'date': exam_date,
                'utilization_rate': round(len(room_students) / room_cap, 2),
                'satisfaction_score': 5,
                'is_peak_hour': 1
            }
            
            # Save allocation to history
            save_allocation_to_db(alloc_record, conn=self.conn)
            
            allocations.append({
                'allocation_id': alloc_id,
                'venue_name': room_name,
                'capacity': room_cap,
                'allocated_count': len(room_students),
                'ranges': summarized_ranges,
                'students': room_students # list of assigned student dicts
            })
            
        unallocated_count = total_students - student_idx
        if unallocated_count > 0:
            logger.warning(f"Could not allocate all students. {unallocated_count} students remaining.")
            
        return {
            "total_students": total_students,
            "allocated_count": student_idx,
            "unallocated_count": unallocated_count,
            "rooms_allocated": len(allocations),
            "allocations": allocations
        }
