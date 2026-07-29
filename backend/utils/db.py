import os
import sqlite3
import pandas as pd
import json
import logging

logger = logging.getLogger(__name__)

DEFAULT_DB_PATH = os.getenv("DB_PATH", "data/campus_scheduler.db")

def get_connection(db_path=DEFAULT_DB_PATH):
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_db(db_path=DEFAULT_DB_PATH, config_path="config.json"):
    logger.info(f"Initializing database: {db_path}")
    conn = get_connection(db_path)
    cursor = conn.cursor()
    
    # 1. Create Venues table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS venues (
        venue_name TEXT PRIMARY KEY,
        venue_type TEXT,
        block TEXT,
        floor TEXT,
        capacity INTEGER,
        projector INTEGER,
        led_tv INTEGER,
        smart_board INTEGER,
        ac INTEGER,
        wifi INTEGER,
        cctv INTEGER,
        audio_video INTEGER,
        num_pcs INTEGER,
        department_preference TEXT,
        status TEXT
    )
    """)
    
    # 2. Create Bookings table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS bookings (
        booking_id TEXT PRIMARY KEY,
        venue_name TEXT,
        purpose TEXT,
        student_count INTEGER,
        faculty_id TEXT,
        department TEXT,
        start_time TEXT,
        end_time TEXT,
        date TEXT,
        status TEXT,
        FOREIGN KEY (venue_name) REFERENCES venues (venue_name)
    )
    """)
    
    # 3. Create Allocation History table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS allocation_history (
        allocation_id TEXT PRIMARY KEY,
        venue_name TEXT,
        purpose TEXT,
        student_count INTEGER,
        faculty_id TEXT,
        department TEXT,
        start_time TEXT,
        end_time TEXT,
        date TEXT,
        status TEXT,
        utilization_rate REAL,
        satisfaction_score INTEGER,
        is_peak_hour INTEGER,
        FOREIGN KEY (venue_name) REFERENCES venues (venue_name)
    )
    """)
    
    # 4. Create Timetable table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS timetable (
        course_code TEXT,
        department TEXT,
        year INTEGER,
        semester INTEGER,
        student_count INTEGER,
        faculty_id TEXT,
        day_of_week TEXT,
        start_time TEXT,
        end_time TEXT,
        venue_name TEXT,
        FOREIGN KEY (venue_name) REFERENCES venues (venue_name)
    )
    """)
    
    # 5. Create Seat Allocation table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS seat_allocation (
        allocation_id TEXT,
        student_id TEXT,
        roll_number TEXT,
        department TEXT,
        seat_number TEXT,
        row_num INTEGER,
        col_num INTEGER,
        is_accessibility INTEGER
    )
    """)
    
    # 6. Create Model Metadata table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS model_metadata (
        version TEXT PRIMARY KEY,
        trained_at TEXT,
        records_count INTEGER,
        accuracy REAL,
        f1_score REAL,
        top5_accuracy REAL,
        is_active INTEGER
    )
    """)

    # 7. Create Maintenance Schedule table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS maintenance_schedule (
        venue_name TEXT,
        start_date TEXT,
        end_date TEXT,
        description TEXT,
        FOREIGN KEY (venue_name) REFERENCES venues (venue_name)
    )
    """)

    # 8. Create Faculty table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS faculty (
        faculty_id TEXT PRIMARY KEY,
        name TEXT,
        department TEXT,
        preferred_building TEXT,
        preferred_room_type TEXT
    )
    """)
    
    # 9. Create Building Distances table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS building_distances (
        building_a TEXT,
        building_b TEXT,
        distance_meters REAL
    )
    """)
    
    conn.commit()
    conn.close()
    logger.info("Database tables initialized successfully.")

def populate_db_from_csvs(db_path=DEFAULT_DB_PATH, synthetic_dir="data/synthetic"):
    logger.info("Populating database from synthetic data...")
    conn = get_connection(db_path)
    
    # Populate Venues (processed and saved earlier)
    # We consolidate it in run.py, but let's double check if we can populate others
    csv_mappings = {
        "booking_history.csv": ("bookings", "REPLACE"),
        "allocation_history.csv": ("allocation_history", "REPLACE"),
        "academic_timetable.csv": ("timetable", "REPLACE"),
        "maintenance_schedule.csv": ("maintenance_schedule", "REPLACE"),
        "faculty_master.csv": ("faculty", "REPLACE")
    }
    
    for csv_file, (table, behavior) in csv_mappings.items():
        csv_path = os.path.join(synthetic_dir, csv_file)
        if os.path.exists(csv_path):
            df = pd.read_csv(csv_path)
            # Make sure we don't import columns that don't exist in the SQL schema
            if table == "bookings":
                df = df[['booking_id', 'venue_name', 'purpose', 'student_count', 'faculty_id', 'department', 'start_time', 'end_time', 'date', 'status']]
            elif table == "allocation_history":
                df = df[['allocation_id', 'venue_name', 'purpose', 'student_count', 'faculty_id', 'department', 'start_time', 'end_time', 'date', 'status', 'utilization_rate', 'satisfaction_score', 'is_peak_hour']]
            elif table == "timetable":
                df = df[['course_code', 'department', 'year', 'semester', 'student_count', 'faculty_id', 'day_of_week', 'start_time', 'end_time', 'venue_name']]
            elif table == "maintenance_schedule":
                df = df[['venue_name', 'start_date', 'end_date', 'description']]
            elif table == "faculty":
                df = df[['faculty_id', 'name', 'department', 'preferred_building', 'preferred_room_type']]
                
            df.to_sql(table, conn, if_exists='replace' if behavior == 'REPLACE' else 'append', index=False)
            logger.info(f"Loaded {len(df)} records into table: {table}")
        else:
            logger.warning(f"File not found: {csv_path}. Skipping.")
            
    conn.close()

def load_venues_from_db(db_path=DEFAULT_DB_PATH):
    conn = get_connection(db_path)
    df = pd.read_sql_query("SELECT * FROM venues WHERE status = 'Active'", conn)
    conn.close()
    return df

def get_allocation_history_count(db_path=DEFAULT_DB_PATH):
    conn = get_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM allocation_history")
    count = cursor.fetchone()[0]
    conn.close()
    return count

def save_allocation_to_db(alloc, db_path=DEFAULT_DB_PATH, conn=None):
    should_close = False
    if conn is None:
        conn = get_connection(db_path)
        should_close = True
    
    cursor = conn.cursor()
    
    # Save to allocation_history
    cursor.execute("""
    INSERT OR REPLACE INTO allocation_history 
    (allocation_id, venue_name, purpose, student_count, faculty_id, department, start_time, end_time, date, status, utilization_rate, satisfaction_score, is_peak_hour)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        alloc['allocation_id'], alloc['venue_name'], alloc['purpose'], alloc['student_count'],
        alloc.get('faculty_id', 'FAC0000'), alloc.get('department', 'General'), alloc['start_time'], alloc['end_time'],
        alloc['date'], 'Approved', alloc.get('utilization_rate', 1.0), alloc.get('satisfaction_score', 5), alloc.get('is_peak_hour', 0)
    ))
    
    conn.commit()
    if should_close:
        conn.close()

def save_seat_allocation_to_db(alloc_id, seating_list, db_path=DEFAULT_DB_PATH, conn=None):
    should_close = False
    if conn is None:
        conn = get_connection(db_path)
        should_close = True
        
    cursor = conn.cursor()
    
    # Delete old seat plans for this allocation
    cursor.execute("DELETE FROM seat_allocation WHERE allocation_id = ?", (alloc_id,))
    
    for item in seating_list:
        cursor.execute("""
        INSERT INTO seat_allocation (allocation_id, student_id, roll_number, department, seat_number, row_num, col_num, is_accessibility)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            alloc_id, item['student_id'], item['roll_number'], item['department'],
            item['seat_number'], item['row_num'], item['col_num'], item['is_accessibility']
        ))
        
    conn.commit()
    if should_close:
        conn.close()

