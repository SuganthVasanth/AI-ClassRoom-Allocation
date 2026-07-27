import os
import pandas as pd
import numpy as np
import pickle
import logging
from datetime import datetime
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix
import xgboost as xgb
from sklearn.ensemble import RandomForestClassifier

from ml.training.features import FeaturePipeline
from utils.db import get_connection

from sklearn.base import BaseEstimator, ClassifierMixin

logger = logging.getLogger(__name__)

class ContiguousClassXGBWrapper(BaseEstimator, ClassifierMixin):
    def __init__(self, n_estimators=50, max_depth=5, random_state=42):
        self.n_estimators = n_estimators
        self.max_depth = max_depth
        self.random_state = random_state
        self.model = None
        self.class_map = {}
        self.reverse_map = {}
        self.classes_ = None

    def fit(self, X, y):
        # Learn mapping to contiguous classes
        unique_y = np.unique(y)
        self.class_map = {old: new for new, old in enumerate(unique_y)}
        self.reverse_map = {new: old for old, new in self.class_map.items()}
        y_mapped = np.array([self.class_map[val] for val in y])
        
        # Fit XGBoost
        self.model = xgb.XGBClassifier(
            n_estimators=self.n_estimators,
            max_depth=self.max_depth,
            random_state=self.random_state,
            eval_metric='mlogloss'
        )
        self.model.fit(X, y_mapped)
        
        # Expose classes_ for compatibility
        self.classes_ = unique_y
        if hasattr(X, "columns"):
            self.feature_names_in_ = np.array(X.columns)
        return self

    def predict(self, X):
        assert self.model is not None, "Model has not been fitted yet."
        preds_cont = self.model.predict(X)
        return np.array([self.reverse_map[val] for val in preds_cont])

    def predict_proba(self, X):
        assert self.model is not None, "Model has not been fitted yet."
        probas_cont = self.model.predict_proba(X)
        return probas_cont


def compute_top_k_accuracy(y_true, y_proba_matrix, k=5):
    """Computes top-k accuracy for a multi-class model."""
    top_k_preds = np.argsort(y_proba_matrix, axis=1)[:, -k:]
    hits = 0
    for idx, true_val in enumerate(y_true):
        if true_val in top_k_preds[idx]:
            hits += 1
    return hits / len(y_true)

def train_and_evaluate_models(synthetic_dir="data/synthetic", models_dir="models", db_path="data/campus_scheduler.db"):
    logger.info("Starting model training pipeline...")
    os.makedirs(models_dir, exist_ok=True)
    
    # 1. Load data
    booking_csv = os.path.join(synthetic_dir, "booking_history.csv")
    if not os.path.exists(booking_csv):
        raise FileNotFoundError(f"Historical booking file not found at: {booking_csv}")
        
    df_bookings = pd.read_csv(booking_csv)
    
    conn = get_connection(db_path)
    df_venues = pd.read_sql_query("SELECT * FROM venues", conn)
    
    # Initialize and fit feature pipeline
    pipeline = FeaturePipeline()
    pipeline.fit(df_bookings, df_venues)
    
    # Reconstruct request features for training
    logger.info("Extracting features for training records...")
    training_data = []
    
    # Convert bookings into feature vectors
    # To represent request features:
    venues_map = {row['venue_name']: row for _, row in df_venues.iterrows()}
    
    for _, row in df_bookings.iterrows():
        v_name = row['venue_name']
        if v_name not in venues_map:
            continue
            
        room = venues_map[v_name]
        
        # Parse dates
        try:
            dt = datetime.strptime(row['date'], '%Y-%m-%d')
            month = dt.month
            day_name = dt.strftime('%A')
            day_of_week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].index(day_name)
        except Exception:
            month = 7
            day_of_week = 0
            
        start_hour = int(row['start_time'].split(':')[0])
        end_hour = int(row['end_time'].split(':')[0])
        duration_hrs = max(1, end_hour - start_hour)
        is_peak = 1 if start_hour in [9, 10, 11] else 0
        
        # Facility booleans
        req_proj = 1 if row['purpose'].lower() in ['seminar', 'workshop', 'conference'] else 0
        req_led = 1 if row['purpose'].lower() in ['seminar', 'placement'] else 0
        req_lab = 1 if row['purpose'].lower() == 'lab' else 0
        
        # Enforce mapping preference
        dept_pref_align = 1 if room['department_preference'] == row['department'] else 0
        
        training_data.append({
            'purpose_enc': pipeline.encode_value('purpose', row['purpose']),
            'department_enc': pipeline.encode_value('department', row['department']),
            'student_count': row['student_count'],
            'capacity': room['capacity'],
            'capacity_difference': room['capacity'] - row['student_count'],
            'utilization_percentage': row['student_count'] / room['capacity'],
            'block_enc': pipeline.encode_value('block', room['block']),
            'floor': int(float(room['floor'])) if str(room['floor']).replace('.','',1).isdigit() else 0,
            'walking_distance': 100, # average/dummy baseline for history
            'projector_required': req_proj,
            'led_required': req_led,
            'lab_required': req_lab,
            'day_of_week': day_of_week,
            'month': month,
            'peak_hours': is_peak,
            'historical_utilization': 0.7,
            'faculty_preference': 0,
            'department_preference': dept_pref_align,
            'room_popularity': 10,
            'previous_allocation_count': 10,
            'booking_duration': duration_hrs,
            'consecutive_class_count': 0,
            'distance_from_previous_class': 100,
            'maintenance_risk': 0.05,
            'label': pipeline.encode_value('venue_name', v_name)
        })
        
    df_train = pd.DataFrame(training_data)
    
    # Feature columns and Label
    X = df_train.drop(columns=['label'])
    y = df_train['label']
    
    logger.info(f"Training dataset size: {X.shape}")
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Initialize models
    rf_model = RandomForestClassifier(random_state=42, n_estimators=50, max_depth=5)
    
    # Grid Search on Random Forest
    logger.info("Performing Grid Search on Random Forest...")
    param_grid = {
        'n_estimators': [30, 50],
        'max_depth': [3, 5]
    }
    grid_search = GridSearchCV(rf_model, param_grid, cv=3, scoring='accuracy', n_jobs=-1)
    grid_search.fit(X_train, y_train)
    best_rf = grid_search.best_estimator_
    rf_model = best_rf
    logger.info(f"Best RF parameters: {grid_search.best_params_}")
    
    # Train XGBoost Classifier using our Contiguous Wrapper
    logger.info("Training XGBoost Classifier...")
    best_xgb = ContiguousClassXGBWrapper(random_state=42, n_estimators=50, max_depth=5)
    best_xgb.fit(X_train, y_train)
    
    # Evaluate XGBoost
    y_pred_xgb = best_xgb.predict(X_test)
    y_proba_xgb = best_xgb.predict_proba(X_test)
    
    acc_xgb = accuracy_score(y_test, y_pred_xgb)
    top5_xgb = compute_top_k_accuracy(y_test.values, y_proba_xgb, k=5)
    prec_xgb, rec_xgb, f1_xgb, _ = precision_recall_fscore_support(y_test, y_pred_xgb, average='weighted', zero_division=0)
    
    logger.info(f"XGBoost Test Accuracy: {acc_xgb:.4f}, Weighted F1: {f1_xgb:.4f}, Top-5 Accuracy: {top5_xgb:.4f}")
    
    # Evaluate Random Forest
    y_pred_rf = rf_model.predict(X_test)
    y_proba_rf = rf_model.predict_proba(X_test)
    
    acc_rf = accuracy_score(y_test, y_pred_rf)
    top5_rf = compute_top_k_accuracy(y_test.values, y_proba_rf, k=5)
    prec_rf, rec_rf, f1_rf, _ = precision_recall_fscore_support(y_test, y_pred_rf, average='weighted', zero_division=0)
    
    logger.info(f"Random Forest Test Accuracy: {acc_rf:.4f}, Weighted F1: {f1_rf:.4f}, Top-5 Accuracy: {top5_rf:.4f}")
    
    # Support other packages (CatBoost / LightGBM)
    catboost_installed = False
    lgbm_installed = False
    
    try:
        import lightgbm as lgb  # pyrefly: ignore [missing-import]
        lgb_model = lgb.LGBMClassifier(random_state=42, n_estimators=50, max_depth=5)
        lgb_model.fit(X_train, y_train)
        y_pred_lgb = lgb_model.predict(X_test)
        y_proba_lgb = lgb_model.predict_proba(X_test)
        acc_lgb = accuracy_score(y_test, y_pred_lgb)
        logger.info(f"LightGBM Test Accuracy: {acc_lgb:.4f}")
        lgbm_installed = True
    except ImportError:
        logger.info("LightGBM not installed. Skipping model comparison.")
        
    try:
        from catboost import CatBoostClassifier  # pyrefly: ignore [missing-import]
        cat_model = CatBoostClassifier(iterations=50, depth=5, verbose=0, random_seed=42)
        cat_model.fit(X_train, y_train)
        y_pred_cat = cat_model.predict(X_test)
        acc_cat = accuracy_score(y_test, y_pred_cat)
        logger.info(f"CatBoost Test Accuracy: {acc_cat:.4f}")
        catboost_installed = True
    except ImportError:
        logger.info("CatBoost not installed. Skipping model comparison.")

    # Select best model (XGB vs RF)
    best_model = best_xgb if acc_xgb >= acc_rf else rf_model
    best_acc = max(acc_xgb, acc_rf)
    best_f1 = f1_xgb if acc_xgb >= acc_rf else f1_rf
    best_top5 = top5_xgb if acc_xgb >= acc_rf else top5_rf
    model_name = "XGBoost" if acc_xgb >= acc_rf else "Random Forest"
    
    # Save the selected model
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    model_ver = f"model_v_{timestamp}"
    
    model_path = os.path.join(models_dir, "model.pkl")
    encoder_path = os.path.join(models_dir, "feature_encoder.pkl")
    
    # Save active model files
    with open(model_path, 'wb') as f:
        pickle.dump(best_model, f)
    pipeline.save(encoder_path)
    
    # Backup versioned model files
    with open(os.path.join(models_dir, f"{model_ver}.pkl"), 'wb') as f:
        pickle.dump(best_model, f)
    pipeline.save(os.path.join(models_dir, f"feature_encoder_{timestamp}.pkl"))
    
    # Save metadata to DB
    cursor = conn.cursor()
    cursor.execute("UPDATE model_metadata SET is_active = 0") # disable older versions
    cursor.execute("""
        INSERT OR REPLACE INTO model_metadata (version, trained_at, records_count, accuracy, f1_score, top5_accuracy, is_active)
        VALUES (?, ?, ?, ?, ?, ?, 1)
    """, (model_ver, datetime.now().strftime('%Y-%m-%d %H:%M:%S'), len(df_bookings), float(best_acc), float(best_f1), float(best_top5)))
    
    conn.commit()
    conn.close()
    
    logger.info(f"Selected {model_name} as the active model with test accuracy {best_acc:.4f}.")
    return model_ver, best_acc, best_f1, best_top5

def trigger_retraining_if_needed(synthetic_dir="data/synthetic", models_dir="models", db_path="data/campus_scheduler.db", threshold=1000):
    """
    Checks the number of historical records. If they exceed the last trained metadata count
    by 'threshold', triggers a full model retrain.
    """
    conn = get_connection(db_path)
    cursor = conn.cursor()
    
    # Get current records count in DB
    cursor.execute("SELECT COUNT(*) FROM allocation_history")
    history_count = cursor.fetchone()[0]
    
    # Get count when last model was trained
    cursor.execute("SELECT records_count FROM model_metadata WHERE is_active = 1 LIMIT 1")
    last_meta = cursor.fetchone()
    last_trained_count = last_meta['records_count'] if last_meta else 0
    
    conn.close()
    
    diff = history_count - last_trained_count
    logger.info(f"Current allocation records: {history_count}. Records when last trained: {last_trained_count}. Difference: {diff}")
    
    if diff >= threshold or last_trained_count == 0:
        logger.info(f"Threshold of {threshold} reached. Triggering automatic model retraining...")
        return train_and_evaluate_models(synthetic_dir, models_dir, db_path)
    else:
        logger.info("Model is up to date. Retraining not required.")
        return None, 0.0, 0.0, 0.0
