import os
import pandas as pd
import numpy as np
import pickle
import logging

from ml.training.features import FeaturePipeline

logger = logging.getLogger(__name__)

class RoomRecommender:
    def __init__(self, models_dir="models"):
        self.models_dir = models_dir
        self.model = None
        self.pipeline = None
        self.load_model()

    def load_model(self):
        model_path = os.path.join(self.models_dir, "model.pkl")
        encoder_path = os.path.join(self.models_dir, "feature_encoder.pkl")
        
        if os.path.exists(model_path) and os.path.exists(encoder_path):
            try:
                with open(model_path, 'rb') as f:
                    self.model = pickle.load(f)
                self.pipeline = FeaturePipeline.load(encoder_path)
                logger.info("ML model and feature pipeline loaded successfully for inference.")
            except Exception as e:
                logger.error(f"Error loading model from {model_path}: {e}")
                self.model = None
                self.pipeline = None
        else:
            logger.warning("Serialized model or feature pipeline not found. Recommendations will use fallback heuristics.")

    def recommend_rooms(self, request, candidates_df, db_conn):
        """
        Predicts confidence scores for each candidate room.
        Returns a list of tuples: (venue_name, score) sorted by score descending.
        """
        if len(candidates_df) == 0:
            return []

        # If model is not loaded, use a fallback heuristic: score based on capacity fit and block preference
        if self.model is None or self.pipeline is None:
            logger.warning("ML model not available. Using capacity/heuristic-based scores.")
            scored_candidates = []
            for _, room in candidates_df.iterrows():
                # Heuristic: base score = 1.0. Penalize large capacity wastage
                wastage = room['capacity'] - request['student_count']
                score = 1.0 / (1.0 + 0.01 * wastage)
                # Boost if department matches
                if room['department_preference'] == request.get('department'):
                    score += 0.2
                scored_candidates.append((room['venue_name'], round(score, 4)))
            return sorted(scored_candidates, key=lambda x: x[1], reverse=True)

        try:
            # Reconstruct candidate features
            features_df = self.pipeline.extract_features_for_candidates(request, candidates_df, db_conn)
            
            # Predict probabilities
            # Features passed to model should exclude 'venue_name_enc' if it was not in X_train,
            # or if it was, we include it. Let's look at train.py: X = df_train.drop(columns=['label'])
            # The label is the venue_name_enc. The feature vector in features.py has venue_name_enc as a feature?
            # Wait, in features.py: 'venue_name_enc': self.encode_value('venue_name', v_name)
            # Wait, did we exclude 'venue_name_enc' from X in train.py?
            # In train.py: X = df_train.drop(columns=['label']) - where label is 'venue_name_enc'.
            # But the columns in training_data had: 'venue_name_enc': pipeline.encode_value('venue_name', v_name) AND the target is 'label'.
            # Wait! If 'venue_name_enc' is in X, it acts as a feature. Let's make sure the features passed match the model features!
            # Let's inspect the model columns. The features dataframe created by extract_features_for_candidates has 'venue_name_enc' as a column.
            # And in train.py, the columns of df_train (excluding label) are the features.
            # Yes! The columns are: 'purpose_enc', 'department_enc', 'student_count', 'capacity', 'capacity_difference',
            # 'utilization_percentage', 'block_enc', 'floor', 'walking_distance', 'projector_required', 'led_required',
            # 'lab_required', 'day_of_week', 'month', 'peak_hours', 'historical_utilization', 'faculty_preference',
            # 'department_preference', 'room_popularity', 'previous_allocation_count', 'booking_duration',
            # 'consecutive_class_count', 'distance_from_previous_class', 'maintenance_risk', 'venue_name_enc'.
            # This is perfectly aligned!
            
            # Drop venue_name_enc if present since it is the target label, not a feature
            if 'venue_name_enc' in features_df.columns:
                features_df = features_df.drop(columns=['venue_name_enc'])
                
            # Align features_df columns with what's expected by the model
            if hasattr(self.model, "feature_names_in_"):
                expected_cols = list(self.model.feature_names_in_)
                features_df = features_df[expected_cols]
            
            # Predict probabilities
            probas = self.model.predict_proba(features_df)
            
            scored_candidates = []
            for idx, (_, room) in enumerate(candidates_df.iterrows()):
                v_name = room['venue_name']
                # Get the class index for this venue
                class_label = self.pipeline.encode_value('venue_name', v_name)
                
                # Get model class classes_ list
                class_idx = np.where(self.model.classes_ == class_label)[0]
                if len(class_idx) > 0:
                    score = probas[idx, class_idx[0]]
                else:
                    score = 0.0
                    
                scored_candidates.append((v_name, float(round(score, 4))))
                
            # Sort by score descending
            return sorted(scored_candidates, key=lambda x: x[1], reverse=True)
            
        except Exception as e:
            logger.error(f"Error predicting recommendations: {e}")
            # Fallback
            scored_candidates = []
            for _, room in candidates_df.iterrows():
                wastage = room['capacity'] - request['student_count']
                score = 1.0 / (1.0 + 0.01 * wastage)
                scored_candidates.append((room['venue_name'], round(score, 4)))
            return sorted(scored_candidates, key=lambda x: x[1], reverse=True)
