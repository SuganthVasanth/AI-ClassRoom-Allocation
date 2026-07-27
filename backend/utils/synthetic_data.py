import os
import pandas as pd
import numpy as np
import random
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

def clean_boolean(val):
    if pd.isna(val):
        return False
    val_str = str(val).strip().upper()
    if val_str in ['YES', 'Y', '1.0', '1', 'TRUE', 'T', 'TV', 'LAPTOP']:
        return True
    return False

def clean_int(val, default=0):
    if pd.isna(val):
        return default
    try:
        # handle strings like '50 desk'
        val_str = str(val).split()[0]
        return int(float(val_str))
    except Exception:
        return default

def load_and_consolidate_venues(excel_path):
    logger.info(f"Loading venue master from: {excel_path}")
    if not os.path.exists(excel_path):
        raise FileNotFoundError(f"Excel Master Venue file not found at: {excel_path}")
    
    xls = pd.ExcelFile(excel_path)
    sheet_names = [s for s in xls.sheet_names if s != 'Sheet1']
    
    all_rooms = []
    
    for sname in sheet_names:
        df = pd.read_excel(xls, sheet_name=sname)
        logger.info(f"Processing sheet: {sname} with {len(df)} rows")
        
        # Standardize columns by matching headers
        cols = {col.strip().lower(): col for col in df.columns}
        
        # Determine column names based on available headers
        name_col = next((cols[c] for c in ['venue name', 'venue_name'] if c in cols), None)
        type_col = next((cols[c] for c in ['venue type', 'venue_type'] if c in cols), None)
        block_col = next((cols[c] for c in ['block'] if c in cols), None)
        floor_col = next((cols[c] for c in ['floor'] if c in cols), None)
        cap_col = next((cols[c] for c in ['capacity'] if c in cols), None)
        
        proj_col = next((cols[c] for c in ['projector', 'projector / led tv'] if c in cols), None)
        cctv_col = next((cols[c] for c in ['cctv'] if c in cols), None)
        wifi_col = next((cols[c] for c in ['wifi'] if c in cols), None)
        av_col = next((cols[c] for c in ['audio/videos', 'audio/video'] if c in cols), None)
        pc_col = next((cols[c] for c in ['no of system (pc)', 'pc_count'] if c in cols), None)
        dept_col = next((cols[c] for c in ['department', 'college'] if c in cols), None)
        
        for idx, row in df.iterrows():
            # Get room name
            rname = str(row[name_col]).strip() if name_col and not pd.isna(row[name_col]) else None
            if not rname or rname == 'nan' or rname == '-':
                continue
                
            rtype = str(row[type_col]).strip() if type_col and not pd.isna(row[type_col]) else 'Classroom'
            rblock = str(row[block_col]).strip() if block_col and not pd.isna(row[block_col]) else sname
            
            # Floor can be in floor_col or parsed from name
            rfloor = '0'
            if floor_col:
                fl = row[floor_col]
                # If there are multiple floor cols, row[floor_col] could be a series
                if isinstance(fl, pd.Series):
                    fl = fl.iloc[0]
                rfloor = str(fl).strip()
            
            rcap = clean_int(row[cap_col] if cap_col else 40, default=40)
            if rcap <= 0:
                rcap = 40
                
            rproj = clean_boolean(row[proj_col]) if proj_col else False
            rcctv = clean_boolean(row[cctv_col]) if cctv_col else False
            rwifi = clean_boolean(row[wifi_col]) if wifi_col else False
            rav = clean_boolean(row[av_col]) if av_col else False
            rpc = clean_int(row[pc_col]) if pc_col else 0
            rdept = str(row[dept_col]).strip() if dept_col and not pd.isna(row[dept_col]) else 'General'
            
            # Smart board and AC can be inferred
            rac = sname in ['Learning Centre', 'Research park'] or rcap >= 80
            rsmart = rproj and (rpc > 0 or rtype.upper() == 'SEMINAR')
            
            all_rooms.append({
                'venue_name': rname,
                'venue_type': rtype,
                'block': rblock,
                'floor': rfloor,
                'capacity': rcap,
                'projector': int(rproj),
                'led_tv': int(rproj or rav),
                'smart_board': int(rsmart),
                'ac': int(rac),
                'wifi': int(rwifi),
                'cctv': int(rcctv),
                'audio_video': int(rav),
                'num_pcs': rpc,
                'department_preference': rdept,
                'status': 'Active'
            })
            
    df_venues = pd.DataFrame(all_rooms).drop_duplicates(subset=['venue_name'])
    return df_venues

def generate_synthetic_data(venues_df, output_dir="data/synthetic"):
    os.makedirs(output_dir, exist_ok=True)
    logger.info(f"Generating synthetic datasets to: {output_dir}")
    
    # 1. Student Master
    depts = ['CSE', 'AIML', 'AIDS', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'TEXTILE']
    students = []
    student_id_seq = 10001
    for dept in depts:
        for year in [1, 2, 3, 4]:
            for sem in [2*year-1, 2*year]:
                # 40-80 students per department-semester
                count = random.randint(45, 75)
                for _ in range(count):
                    students.append({
                        'student_id': f"BIT{student_id_seq}",
                        'name': f"Student_{student_id_seq}",
                        'department': dept,
                        'year': year,
                        'semester': sem,
                        'is_disabled': 1 if random.random() < 0.02 else 0 # 2% accessibility requirement
                    })
                    student_id_seq += 1
    
    df_students = pd.DataFrame(students)
    df_students.to_csv(os.path.join(output_dir, "student_master.csv"), index=False)
    
    # 2. Faculty Master
    faculties = []
    faculty_id_seq = 5001
    blocks = venues_df['block'].unique().tolist()
    for dept in depts:
        for i in range(15): # 15 faculty per dept
            faculties.append({
                'faculty_id': f"FAC{faculty_id_seq}",
                'name': f"Dr. Faculty_{faculty_id_seq}",
                'department': dept,
                'preferred_building': random.choice(blocks),
                'preferred_room_type': random.choice(['Classroom', 'Lab', 'Seminar'])
            })
            faculty_id_seq += 1
            
    df_faculties = pd.DataFrame(faculties)
    df_faculties.to_csv(os.path.join(output_dir, "faculty_master.csv"), index=False)
    
    # 3. Building Distance
    distances = []
    for b1 in blocks:
        for b2 in blocks:
            if b1 == b2:
                dist = 0
            else:
                dist = random.randint(30, 450) # meters
            distances.append({
                'building_a': b1,
                'building_b': b2,
                'distance_meters': dist
            })
    df_distances = pd.DataFrame(distances)
    df_distances.to_csv(os.path.join(output_dir, "building_distance.csv"), index=False)
    
    # 4. Maintenance Schedule
    maintenance = []
    rooms = venues_df['venue_name'].tolist()
    # Put 5% of rooms on maintenance for some future dates
    for room in random.sample(rooms, int(len(rooms)*0.05)):
        start = datetime.now() + timedelta(days=random.randint(-5, 15))
        end = start + timedelta(days=random.randint(1, 5))
        maintenance.append({
            'venue_name': room,
            'start_date': start.strftime('%Y-%m-%d'),
            'end_date': end.strftime('%Y-%m-%d'),
            'description': random.choice(['AC Repair', 'Painting', 'Wiring Work', 'Projector Replacement'])
        })
    df_maintenance = pd.DataFrame(maintenance)
    df_maintenance.to_csv(os.path.join(output_dir, "maintenance_schedule.csv"), index=False)
    
    # 5. Academic Timetable (Recurring)
    timetable = []
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    slots = [
        ('09:00', '10:00'), ('10:00', '11:00'), ('11:15', '12:15'), ('12:15', '13:15'),
        ('14:00', '15:00'), ('15:00', '16:00')
    ]
    # Let's populate academic timetable for classrooms
    classrooms = venues_df[venues_df['venue_type'] == 'Classroom']['venue_name'].tolist()
    fac_ids = df_faculties['faculty_id'].tolist()
    
    for room in random.sample(classrooms, min(len(classrooms), 80)): # 80 active rooms in timetable
        for day in days:
            # allocate 3-4 random slots per room per day
            allocated_slots = random.sample(slots, random.randint(3, 4))
            for start, end in allocated_slots:
                dept = random.choice(depts)
                year = random.choice([1, 2, 3, 4])
                sem = 2*year - random.choice([0, 1])
                timetable.append({
                    'course_code': f"{dept}{random.randint(100, 499)}",
                    'department': dept,
                    'year': year,
                    'semester': sem,
                    'student_count': random.randint(35, 60),
                    'faculty_id': random.choice(fac_ids),
                    'day_of_week': day,
                    'start_time': start,
                    'end_time': end,
                    'venue_name': room
                })
    df_timetable = pd.DataFrame(timetable)
    df_timetable.to_csv(os.path.join(output_dir, "academic_timetable.csv"), index=False)
    
    # 6. Allocation & Booking History (for training the recommendation model)
    # The history represents past bookings, which the ML model will learn from.
    history = []
    booking_purposes = ['Class', 'Lab', 'Seminar', 'Workshop', 'Placement', 'Meeting', 'Conference', 'Training']
    start_date = datetime.now() - timedelta(days=90) # 90 days of history
    
    # We must ensure that EVERY venue in venues_df has at least 3 records in the history 
    # to avoid XGBoost ValueError and split stratification issues.
    booking_idx = 0
    venues_list = [row for _, row in venues_df.iterrows()]
    
    # Phase 1: Generate 3 bookings for each venue
    for room in venues_list:
        for _ in range(3):
            b_date = start_date + timedelta(days=random.randint(0, 85))
            # Pick a suitable purpose based on room type
            r_type = str(room['venue_type']).lower()
            if 'lab' in r_type:
                purpose = 'Lab'
            elif 'seminar' in r_type or 'conference' in r_type:
                purpose = random.choice(['Seminar', 'Workshop', 'Conference'])
            else:
                purpose = random.choice(['Class', 'Meeting', 'Training'])
                
            dept = random.choice(depts)
            room_name = room['venue_name']
            room_cap = room['capacity']
            
            std_count = random.randint(max(1, room_cap - 20), room_cap)
            if std_count <= 0:
                std_count = min(15, room_cap) if room_cap > 0 else 15
                
            hr_start = random.choice([9, 10, 11, 12, 14, 15])
            duration = random.choice([1, 2, 3])
            s_time = f"{hr_start:02d}:00"
            e_time = f"{hr_start+duration:02d}:00"
            
            history.append({
                'booking_id': f"BKG{100000 + booking_idx}",
                'venue_name': room_name,
                'purpose': purpose,
                'student_count': std_count,
                'faculty_id': random.choice(fac_ids),
                'department': dept,
                'start_time': s_time,
                'end_time': e_time,
                'date': b_date.strftime('%Y-%m-%d'),
                'status': 'Approved',
                'utilization_rate': round(std_count / room_cap, 2) if room_cap > 0 else 1.0,
                'satisfaction_score': random.randint(3, 5),
                'is_peak_hour': 1 if hr_start in [9, 10, 11] else 0
            })
            booking_idx += 1
            
    # Phase 2: Generate remaining bookings randomly up to 1500
    while booking_idx < 1500:
        b_date = start_date + timedelta(days=random.randint(0, 85))
        purpose = random.choice(booking_purposes)
        dept = random.choice(depts)
        
        # facility requirements based on purpose
        req_pc = random.choice([0, 20, 40]) if purpose == 'Lab' else 0
        req_proj = 1 if purpose in ['Seminar', 'Workshop', 'Conference', 'Placement'] else random.choice([0, 1])
        
        # filter rooms that fit the criteria roughly
        candidates = venues_df[
            (venues_df['capacity'] >= 30) & 
            (venues_df['projector'] >= req_proj) &
            (venues_df['num_pcs'] >= req_pc)
        ]
        
        if len(candidates) == 0:
            candidates = venues_df
            
        selected_room_row = candidates.sample(1).iloc[0]
        room_name = selected_room_row['venue_name']
        room_cap = selected_room_row['capacity']
        
        std_count = random.randint(max(1, room_cap - 20), room_cap)
        if std_count <= 0:
            std_count = 25
            
        hr_start = random.choice([9, 10, 11, 12, 14, 15])
        duration = random.choice([1, 2, 3])
        s_time = f"{hr_start:02d}:00"
        e_time = f"{hr_start+duration:02d}:00"
        
        history.append({
            'booking_id': f"BKG{100000 + booking_idx}",
            'venue_name': room_name,
            'purpose': purpose,
            'student_count': std_count,
            'faculty_id': random.choice(fac_ids),
            'department': dept,
            'start_time': s_time,
            'end_time': e_time,
            'date': b_date.strftime('%Y-%m-%d'),
            'status': 'Approved',
            'utilization_rate': round(std_count / room_cap, 2) if room_cap > 0 else 1.0,
            'satisfaction_score': random.randint(3, 5),
            'is_peak_hour': 1 if hr_start in [9, 10, 11] else 0
        })
        booking_idx += 1
        
    df_history = pd.DataFrame(history)
    df_history.to_csv(os.path.join(output_dir, "booking_history.csv"), index=False)
    
    # Save allocation history
    df_alloc = df_history.copy().rename(columns={'booking_id': 'allocation_id'})
    df_alloc.to_csv(os.path.join(output_dir, "allocation_history.csv"), index=False)
    
    # 7. Exam Schedule
    exams = []
    exam_date = datetime.now() + timedelta(days=20) # Exam period starts in 20 days
    for day in range(5):
        current_exam_date = exam_date + timedelta(days=day)
        # 2 exam slots per day: morning 09:30-12:30, afternoon 13:30-16:30
        for slot_idx, (start, end) in enumerate([('09:30', '12:30'), ('13:30', '16:30')]):
            random_depts = random.sample(depts, 3)
            for d_idx, dept in enumerate(random_depts):
                exams.append({
                    'exam_id': f"EX{1000 + len(exams)}",
                    'course_code': f"{dept}{random.randint(100, 499)}",
                    'department': dept,
                    'date': current_exam_date.strftime('%Y-%m-%d'),
                    'start_time': start,
                    'end_time': end,
                    'student_count': random.randint(45, 90)
                })
    df_exams = pd.DataFrame(exams)
    df_exams.to_csv(os.path.join(output_dir, "exam_schedule.csv"), index=False)
    
    logger.info("All synthetic datasets generated successfully!")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    # Testing consolidation
    df_venues = load_and_consolidate_venues("Master Venue Details.xlsx")
    print(df_venues.head())
    print(f"Total consolidated rooms: {len(df_venues)}")
    generate_synthetic_data(df_venues)
