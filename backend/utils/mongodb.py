import os
import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from dotenv import load_dotenv

# Set up logger
logger = logging.getLogger(__name__)

# Load environment variables from the .env file in the backend root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=env_path)

# Connection configurations
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "bitSmartCampus")

# Global client cache
_mongo_client = None

def get_mongo_client():
    """
    Retrieve or initialize the global MongoDB client.
    Thread-safe lazy initialization.
    """
    global _mongo_client
    if _mongo_client is None:
        try:
            logger.info(f"Connecting to MongoDB at URI: {MONGO_URI}")
            # Initialize MongoClient with connection pooling and time-out limits
            _mongo_client = MongoClient(
                MONGO_URI,
                serverSelectionTimeoutMS=2000,  # 2 seconds timeout for fast checks
                connectTimeoutMS=2000,
                maxPoolSize=50                    # Connection pooling limit
            )
        except Exception as e:
            logger.error(f"Failed to create MongoDB client: {e}")
            raise e
    return _mongo_client

def get_mongo_db():
    """
    Retrieve the database instance.
    """
    client = get_mongo_client()
    return client[MONGO_DB_NAME]

def test_mongo_connection():
    """
    Ping the MongoDB server to verify that connection is established and healthy.
    Returns:
        tuple (bool, str): (Success status, details/error message)
    """
    try:
        client = get_mongo_client()
        # The ping command is cheap and does not require auth helper checks
        client.admin.command("ping")
        msg = f"Successfully connected to MongoDB at {MONGO_URI} (Database: {MONGO_DB_NAME})"
        logger.info(msg)
        return True, msg
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        err_msg = f"MongoDB connection failure: {e}"
        logger.error(err_msg)
        return False, err_msg
    except Exception as e:
        err_msg = f"Unexpected error connecting to MongoDB: {e}"
        logger.error(err_msg)
        return False, err_msg

def seed_initial_bookings_if_empty():
    """
    Checks if the 'bookings' collection is empty.
    If it is, populates it with default initial requests.
    """
    try:
        db = get_mongo_db()
        collection = db.bookings
        
        # Check if empty
        if collection.count_documents({}) == 0:
            logger.info("MongoDB 'bookings' collection is empty. Seeding initial requests...")
            
            initial_bookings = [
                {
                    "id": "req-1",
                    "staffId": "usr-3",
                    "staffName": "Prof. Amit Sharma",
                    "subject": "Computer Networks Seminar",
                    "date": "2026-07-18",
                    "time": "14:00",
                    "duration": 2,
                    "strength": 85,
                    "facilities": ["Projector", "AC", "Wi-Fi", "Audio System"],
                    "preferredBuildingId": "bld-1",
                    "remarks": "Invited guest lecture. Needs high stability internet.",
                    "status": "approved",
                    "allocatedClassroomId": "room-301",
                    "allocatedClassroomName": "RAM-301 (VCS Hall)",
                    "aiSuggested": True,
                    "aiConfidence": 96,
                    "createdAt": "2026-07-15T09:30:00Z",
                    "isBulkAllotment": False
                },
                {
                    "id": "req-2",
                    "staffId": "usr-3",
                    "staffName": "Prof. Amit Sharma",
                    "subject": "Remedial Class - Discrete Math",
                    "date": "2026-07-20",
                    "time": "16:00",
                    "duration": 1,
                    "strength": 30,
                    "facilities": ["Projector", "Wi-Fi"],
                    "preferredBuildingId": "bld-1",
                    "remarks": "For second-year students requiring additional aid.",
                    "status": "pending",
                    "createdAt": "2026-07-16T08:15:00Z",
                    "isBulkAllotment": False
                },
                {
                    "id": "req-3",
                    "staffId": "usr-staff2",
                    "staffName": "Dr. Vinitha Nair",
                    "subject": "Analog Design Workshop",
                    "date": "2026-07-19",
                    "time": "09:30",
                    "duration": 3,
                    "strength": 55,
                    "facilities": ["Projector", "Wi-Fi", "Smart Board"],
                    "preferredBuildingId": "bld-2",
                    "remarks": "Required lab bench space and smart whiteboard capability.",
                    "status": "pending",
                    "createdAt": "2026-07-16T11:00:00Z",
                    "isBulkAllotment": False
                },
                {
                    "id": "req-4",
                    "staffId": "usr-staff3",
                    "staffName": "Prof. S. Rangarajan",
                    "subject": "EEE Board of Studies Meeting",
                    "date": "2026-07-14",
                    "time": "11:00",
                    "duration": 2,
                    "strength": 25,
                    "facilities": ["AC", "Wi-Fi", "Smart Board"],
                    "preferredBuildingId": "bld-4",
                    "remarks": "Annual curriculum review session.",
                    "status": "approved",
                    "allocatedClassroomId": "room-vis-201",
                    "allocatedClassroomName": "VIS-201 (Lecture Hall)",
                    "aiSuggested": False,
                    "createdAt": "2026-07-13T10:00:00Z",
                    "isBulkAllotment": False
                }
            ]
            
            collection.insert_many(initial_bookings)
            logger.info("Successfully seeded 4 default requests into MongoDB.")
        else:
            logger.info("MongoDB 'bookings' collection already has records. Seeding skipped.")
            
    except Exception as e:
        logger.error(f"Error seeding MongoDB bookings: {e}")
