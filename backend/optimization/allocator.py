import os
import json
import logging
import pandas as pd
from rule_engine.checker import RuleEngine
from ml.inference.predict import RoomRecommender
from utils.db import save_allocation_to_db

logger = logging.getLogger(__name__)

class OptimizationEngine:
    def __init__(self, db_conn, config_path="config.json"):
        self.conn = db_conn
        self.config_path = config_path
        self.weights = {
            "distance": 0.4,
            "capacity_wastage": 0.3,
            "ml_score": 0.3
        }
        self.load_config()
        self.rule_engine = RuleEngine(db_conn)
        self.recommender = RoomRecommender()

    def load_config(self):
        if os.path.exists(self.config_path):
            try:
                with open(self.config_path, 'r') as f:
                    config = json.load(f)
                self.weights = config.get("optimization", {}).get("weights", self.weights)
                logger.info(f"Loaded optimization weights: {self.weights}")
            except Exception as e:
                logger.error(f"Error reading config: {e}")

    def get_distance_between_blocks(self, block_a, block_b):
        """Looks up the distance between two blocks in building_distance.csv / database."""
        if block_a == block_b:
            return 0
        try:
            cursor = self.conn.cursor()
            cursor.execute("""
                SELECT distance_meters FROM building_distances
                WHERE (building_a = ? AND building_b = ?)
                   OR (building_a = ? AND building_b = ?)
                LIMIT 1
            """, (block_a, block_b, block_b, block_a))
            row = cursor.fetchone()
            if row:
                return row['distance_meters']
        except Exception:
            pass
        return 150 # default fallback distance in meters

    def allocate_room(self, request):
        """
        Runs Rule Engine + ML Ranking + Optimization to allocate a room.
        Returns:
            dict: The allocated room details and metadata, or None if allocation fails.
        """
        # 1. Load active venues
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM venues WHERE status = 'Active'")
        venues_list = [dict(row) for row in cursor.fetchall()]
        venues_df = pd.DataFrame(venues_list)
        
        if len(venues_df) == 0:
            logger.error("No active venues found in database!")
            return None
            
        # 2. Rule Engine: Filter invalid rooms
        eligible_df = self.rule_engine.get_eligible_rooms(venues_df, request)
        if len(eligible_df) == 0:
            logger.warning("No rooms passed rule validation filters!")
            return None
            
        # 3. ML Recommendation Engine: Rank rooms
        # Refresh recommender model if updated
        self.recommender.load_model()
        ranked_candidates = self.recommender.recommend_rooms(request, eligible_df, self.conn)
        
        # Convert ranked candidates list back to scored dataframe
        scores_dict = dict(ranked_candidates)
        
        # 4. Optimization Engine: Multi-objective Cost Minimization
        # Let's compute cost for each eligible room
        optimized_candidates = []
        
        # Determine previous block for student group
        prev_block = None
        date_str = request['date']
        start_time = request['start_time']
        end_time = request['end_time']
        dept = request.get('department', 'General')
        
        cursor.execute("""
            SELECT venue_name FROM allocation_history
            WHERE department = ? AND date = ? AND end_time <= ?
            ORDER BY end_time DESC LIMIT 1
        """, (dept, date_str, start_time))
        prev_row = cursor.fetchone()
        if prev_row:
            cursor.execute("SELECT block FROM venues WHERE venue_name = ? LIMIT 1", (prev_row['venue_name'],))
            block_row = cursor.fetchone()
            if block_row:
                prev_block = block_row['block']
                
        std_count = request['student_count']
        
        for _, room in eligible_df.iterrows():
            v_name = room['venue_name']
            r_cap = room['capacity']
            
            # (a) Distance Penalty (normalized to 500m max)
            dist_meters = 0
            if prev_block:
                dist_meters = self.get_distance_between_blocks(prev_block, room['block'])
            dist_penalty = min(1.0, dist_meters / 500.0)
            
            # (b) Capacity Wastage Penalty (normalized)
            cap_wastage = (r_cap - std_count) / r_cap if r_cap > 0 else 1.0
            
            # (c) ML Score (1.0 is best, so penalty is 1.0 - ml_score)
            ml_score = scores_dict.get(v_name, 0.0)
            ml_penalty = 1.0 - ml_score
            
            # Cost = w_1 * dist_penalty + w_2 * cap_wastage + w_3 * ml_penalty
            cost = (
                self.weights.get("distance", 0.4) * dist_penalty +
                self.weights.get("capacity_wastage", 0.3) * cap_wastage +
                self.weights.get("ml_score", 0.3) * ml_penalty
            )
            
            optimized_candidates.append({
                'room': room.to_dict(),
                'cost': round(cost, 4),
                'ml_score': ml_score,
                'distance': dist_meters,
                'wastage': r_cap - std_count
            })
            
        # Sort candidates by cost ascending (lower cost is better)
        optimized_candidates = sorted(optimized_candidates, key=lambda x: x['cost'])
        
        if len(optimized_candidates) == 0:
            return None
            
        best_candidate = optimized_candidates[0]
        allocated_room = best_candidate['room']
        
        # 5. Save Allocation to Database & Generate ID
        import uuid
        alloc_id = f"AL{uuid.uuid4().hex[:6].upper()}"
        
        # Determine peak hour
        hr_start = int(start_time.split(':')[0])
        is_peak = 1 if hr_start in [9, 10, 11] else 0
        
        alloc_record = {
            'allocation_id': alloc_id,
            'venue_name': allocated_room['venue_name'],
            'purpose': request['purpose'],
            'student_count': std_count,
            'faculty_id': request.get('faculty_id', 'FAC5001'),
            'department': dept,
            'start_time': start_time,
            'end_time': end_time,
            'date': date_str,
            'utilization_rate': round(std_count / allocated_room['capacity'], 2),
            'satisfaction_score': 5, # default high satisfaction score for optimized allocations
            'is_peak_hour': is_peak
        }
        
        save_allocation_to_db(alloc_record, conn=self.conn)
        logger.info(f"Room allocated successfully: {allocated_room['venue_name']} with cost {best_candidate['cost']}")
        
        # Return summary
        return {
            'allocation_id': alloc_id,
            'allocated_room': allocated_room,
            'cost': best_candidate['cost'],
            'ml_score': best_candidate['ml_score'],
            'distance_from_prev': best_candidate['distance'],
            'capacity_wastage': best_candidate['wastage'],
            'top_5_recommendations': ranked_candidates[:5]
        }
