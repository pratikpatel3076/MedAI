from pymongo import MongoClient
from config import Config
import sys

try:
    client = MongoClient(Config.MONGODB_URI)
    db = client.get_database()
    # Test connection
    client.admin.command('ping')
    print("Successfully connected to MongoDB.")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    sys.exit(1)

def get_db():
    return db
