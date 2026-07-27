import math
import logging
from utils.db import save_seat_allocation_to_db

logger = logging.getLogger(__name__)

class SeatAllocator:
    def __init__(self, db_conn):
        self.conn = db_conn

    def allocate_seats(self, allocation_id, students, capacity, broken_seats=None, num_cols=6):
        """
        students: list of student dicts:
                  [{'student_id': str, 'roll_number': str, 'department': str, 'is_disabled': int}]
        broken_seats: list of tuples (row_idx, col_idx) (1-indexed) representing broken seats
        """
        logger.info(f"Allocating seats for Allocation {allocation_id} with {len(students)} students, room capacity {capacity}")
        if broken_seats is None:
            broken_seats = []
            
        # 1. Determine grid dimensions
        num_rows = math.ceil(capacity / num_cols)
        
        # 2. Categorize students: accessibility vs normal
        disabled_students = [s for s in students if s.get('is_disabled', 0) == 1]
        normal_students = [s for s in students if s.get('is_disabled', 0) == 0]
        
        # Group normal students by department to enable interleaved picking
        dept_groups = {}
        for s in normal_students:
            dept = s['department']
            if dept not in dept_groups:
                dept_groups[dept] = []
            dept_groups[dept].append(s)
            
        # 3. Create grid and allocate
        grid = {} # maps (r, c) -> student dict
        
        # Helper to convert row number to letter (1->A, 2->B, etc.)
        def get_row_letter(r):
            return chr(64 + r) if r <= 26 else f"R{r}"
            
        allocated_list = []
        
        # Pass 1: Place disabled students in row 1 (earliest columns)
        # Skip broken seats
        dis_idx = 0
        if disabled_students:
            for c in range(1, num_cols + 1):
                if dis_idx >= len(disabled_students):
                    break
                if (1, c) in broken_seats:
                    continue
                student = disabled_students[dis_idx]
                grid[(1, c)] = student
                seat_num = f"{get_row_letter(1)}{c}"
                allocated_list.append({
                    'student_id': student['student_id'],
                    'roll_number': student['roll_number'],
                    'department': student['department'],
                    'seat_number': seat_num,
                    'row_num': 1,
                    'col_num': c,
                    'is_accessibility': 1
                })
                dis_idx += 1
                
        if dis_idx < len(disabled_students):
            logger.warning(f"Could not fit all accessibility students in Row 1. Remaining: {len(disabled_students) - dis_idx}")
            # Try row 2 for remaining accessibility students
            for c in range(1, num_cols + 1):
                if dis_idx >= len(disabled_students):
                    break
                if (2, c) in broken_seats or (2, c) in grid:
                    continue
                student = disabled_students[dis_idx]
                grid[(2, c)] = student
                seat_num = f"{get_row_letter(2)}{c}"
                allocated_list.append({
                    'student_id': student['student_id'],
                    'roll_number': student['roll_number'],
                    'department': student['department'],
                    'seat_number': seat_num,
                    'row_num': 2,
                    'col_num': c,
                    'is_accessibility': 1
                })
                dis_idx += 1

        # Pass 2: Place normal students in remaining seats using neighbor checks for department mixing
        for r in range(1, num_rows + 1):
            for c in range(1, num_cols + 1):
                # Skip if already occupied (disabled student) or if seat is broken
                if (r, c) in grid or (r, c) in broken_seats:
                    continue
                    
                # Check neighbors to avoid adjacent same department
                # Neighbor left: (r, c-1)
                # Neighbor top: (r-1, c)
                left_dept = grid.get((r, c-1), {}).get('department')
                top_dept = grid.get((r-1, c), {}).get('department')
                
                avoid_depts = {left_dept, top_dept} - {None}
                
                # Pick a student from a department not in avoid_depts
                selected_dept = None
                for dept, group in dept_groups.items():
                    if group and dept not in avoid_depts:
                        selected_dept = dept
                        break
                        
                # Fallback if all remaining depts are in avoid_depts
                if not selected_dept:
                    for dept, group in dept_groups.items():
                        if group:
                            selected_dept = dept
                            break
                            
                if not selected_dept:
                    # No students left
                    break
                    
                student = dept_groups[selected_dept].pop(0)
                grid[(r, c)] = student
                
                seat_num = f"{get_row_letter(r)}{c}"
                allocated_list.append({
                    'student_id': student['student_id'],
                    'roll_number': student['roll_number'],
                    'department': student['department'],
                    'seat_number': seat_num,
                    'row_num': r,
                    'col_num': c,
                    'is_accessibility': 0
                })
                
        # 4. Generate Hall-wise Seating Chart (grid visualization)
        chart = []
        for r in range(1, num_rows + 1):
            row_cells = []
            for c in range(1, num_cols + 1):
                cell_val = "-"
                if (r, c) in broken_seats:
                    cell_val = "[X]" # Broken seat indicator
                elif (r, c) in grid:
                    cell_val = grid[(r, c)]['roll_number']
                row_cells.append(cell_val)
            chart.append(row_cells)
            
        # 5. Save to database
        save_seat_allocation_to_db(allocation_id, allocated_list, db_path="data/campus_scheduler.db")
        
        return {
            'allocation_id': allocation_id,
            'seating_chart': chart,
            'seating_list': allocated_list,
            'dimensions': {'rows': num_rows, 'cols': num_cols},
            'student_count': len(allocated_list)
        }
