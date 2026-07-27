import pandas as pd
import numpy as np
import os
import json
import pickle
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class FeaturePipeline:
    def __init__(self):
        self.categorical_maps = {}
        self.venue_names = []
        self.fitted = False

    def fit(self, history_df, venues_df):
        """Fits the category encoders on historical and venue datasets."""
        logger.info("Fitting feature engineering encoders...")
        
        # Collect categories
        self.venue_names = sorted(venues_df['venue_name'].unique().tolist())
        
        categorical_cols = ['purpose', 'department', 'block', 'venue_name']
        for col in categorical_cols:
            if col in history_df.columns:
                unique_vals = sorted(history_df[col].dropna().unique().tolist())
                # Add unknown placeholder
                if 'UNKNOWN' not in unique_vals:
                    unique_vals.append('UNKNOWN')
                self.categorical_maps[col] = {val: idx for idx, val in enumerate(unique_vals)}
            elif col in venues_df.columns:
                unique_vals = sorted(venues_df[col].dropna().unique().tolist())
                if 'UNKNOWN' not in unique_vals:
                    unique_vals.append('UNKNOWN')
                self.categorical_maps[col] = {val: idx for idx, val in enumerate(unique_vals)}
                
        self.fitted = True
        logger.info("Feature engineering pipeline fitted successfully.")

    def encode_value(self, col, val):
        cmap = self.categorical_maps.get(col, {})
        val_str = str(val).strip()
        if val_str in cmap:
            return cmap[val_str]
        return cmap.get('UNKNOWN', 0)

    def extract_features_for_candidates(self, request, candidates_df, db_conn):
        """
        Extracts feature vectors for a list of candidate rooms given a request.
        Returns a pandas DataFrame of features ready for model prediction.
        """
        if not self.fitted:
            raise ValueError("FeaturePipeline is not fitted yet!")

        features_list = []
        
        # Load helper data from DB/Files for contextual features
        cursor = db_conn.cursor()
        
        # Load building distances
        cursor.execute("SELECT * FROM venues")
        all_venues = {row['venue_name']: row for row in cursor.fetchall()}
        
        # Get historical stats per venue
        cursor.execute("""
            SELECT venue_name, 
                   COUNT(*) as booking_count,
                   AVG(utilization_rate) as avg_util
            FROM allocation_history
            GROUP BY venue_name
        """)
        venue_history = {row['venue_name']: row for row in cursor.fetchall()}
        
        # Previous class info (to calculate walking distance and consecutive class count)
        prev_class_block = None
        date_str = request['date']
        start_time = request['start_time']
        end_time = request['end_time']
        dept = request.get('department', 'General')
        
        # Find if this department had a class just before this slot
        # e.g., if current starts at 10:00, previous ended around 10:00
        cursor.execute("""
            SELECT venue_name FROM allocation_history
            WHERE department = ? AND date = ? AND end_time <= ?
            ORDER BY end_time DESC LIMIT 1
        """, (dept, date_str, start_time))
        prev_row = cursor.fetchone()
        if prev_row and prev_row['venue_name'] in all_venues:
            prev_class_block = all_venues[prev_row['venue_name']]['block']

        # Faculty preference info
        fac_id = request.get('faculty_id', 'FAC5001')
        cursor.execute("SELECT preferred_building FROM faculty WHERE faculty_id = ? LIMIT 1", (fac_id,))
        fac_pref_row = cursor.fetchone()
        preferred_building = fac_pref_row['preferred_building'] if fac_pref_row else None
        
        # Parse time slot details
        try:
            dt = datetime.strptime(date_str, '%Y-%m-%d')
            month = dt.month
            day_name = dt.strftime('%A')
            day_of_week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].index(day_name)
        except Exception:
            month = 7
            day_of_week = 0 # Monday
            
        start_hour = int(start_time.split(':')[0])
        end_hour = int(end_time.split(':')[0])
        duration_hrs = max(1, end_hour - start_hour)
        is_peak = 1 if start_hour in [9, 10, 11] else 0
        
        # Calculate walking distances from distances database
        cursor.execute("SELECT * FROM venues WHERE venue_name = ?", (candidates_df.iloc[0]['venue_name'] if len(candidates_df) > 0 else '',))
        # Let's read distance matrix
        df_dist = pd.read_sql_query("SELECT * FROM venues", db_conn) # placeholder
        # Actual distance loader:
        distances_dict = {}
        cursor.execute("SELECT * FROM venues") # dummy query to reset
        
        # We can read the building distance table
        try:
            cursor.execute("SELECT * FROM sqlite_master WHERE type='table' AND name='building_distances'")
            # If not in SQLite yet (we loaded csv), let's read the csv or query SQLite table building_distances
            df_dist_matrix = pd.read_sql_query("SELECT * FROM building_distances", db_conn)
            for _, r in df_dist_matrix.iterrows():
                distances_dict[(r['building_a'], r['building_b'])] = r['distance_meters']
        except Exception:
            # Fallback if building_distances not initialized
            pass

        for _, room in candidates_df.iterrows():
            v_name = room['venue_name']
            room_cap = room['capacity']
            std_count = request['student_count']
            
            cap_diff = room_cap - std_count
            util_pct = std_count / room_cap if room_cap > 0 else 0
            
            # Facility requirements booleans
            req_proj = 1 if request['purpose'].lower() in ['seminar', 'workshop', 'conference'] else 0
            req_led = 1 if request['purpose'].lower() in ['seminar', 'placement'] else 0
            req_lab = 1 if request['purpose'].lower() == 'lab' else 0
            
            # Historical features
            v_stats = venue_history.get(v_name, {'booking_count': 0, 'avg_util': 0.6})
            book_count = v_stats['booking_count']
            avg_util = v_stats['avg_util']
            
            # Faculty preference alignment
            fac_pref_align = 1 if preferred_building and room['block'] == preferred_building else 0
            
            # Department preference alignment
            dept_pref_align = 1 if room['department_preference'] == dept else 0
            
            # Walking distance calculations
            walking_dist = 0
            if prev_class_block:
                walking_dist = distances_dict.get((prev_class_block, room['block']), distances_dict.get((room['block'], prev_class_block), 100))
                
            # Maintenance risk score
            maint_risk = (book_count * 0.005) + (0.1 if room['ac'] else 0.02)
            maint_risk = min(0.95, max(0.01, maint_risk))
            
            # Floor details
            try:
                floor_num = int(float(room['floor']))
            except Exception:
                floor_num = 0
                
            features_list.append({
                'purpose_enc': self.encode_value('purpose', request['purpose']),
                'department_enc': self.encode_value('department', dept),
                'student_count': std_count,
                'capacity': room_cap,
                'capacity_difference': cap_diff,
                'utilization_percentage': util_pct,
                'block_enc': self.encode_value('block', room['block']),
                'floor': floor_num,
                'walking_distance': walking_dist,
                'projector_required': req_proj,
                'led_required': req_led,
                'lab_required': req_lab,
                'day_of_week': day_of_week,
                'month': month,
                'peak_hours': is_peak,
                'historical_utilization': avg_util,
                'faculty_preference': fac_pref_align,
                'department_preference': dept_pref_align,
                'room_popularity': book_count,
                'previous_allocation_count': book_count,
                'booking_duration': duration_hrs,
                'consecutive_class_count': 1 if prev_class_block else 0,
                'distance_from_previous_class': walking_dist,
                'maintenance_risk': maint_risk,
                'venue_name_enc': self.encode_value('venue_name', v_name)
            })
            
        return pd.DataFrame(features_list)

    def save(self, filepath):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'wb') as f:
            pickle.dump(self, f)
        logger.info(f"Feature engineering pipeline saved to: {filepath}")

    @staticmethod
    def load(filepath):
        with open(filepath, 'rb') as f:
            pipeline = pickle.load(f)
        logger.info(f"Feature engineering pipeline loaded from: {filepath}")
        return pipeline
