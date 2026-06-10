from datetime import datetime
import bcrypt
from db import get_db

class UserModel:
    @staticmethod
    def create_user(email, password, name):
        db = get_db()
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user = {
            "email": email,
            "password_hash": password_hash,
            "name": name,
            "created_at": datetime.utcnow()
        }
        return db.users.insert_one(user)

    @staticmethod
    def find_by_email(email):
        db = get_db()
        return db.users.find_one({"email": email})

    @staticmethod
    def verify_password(password, password_hash):
        return bcrypt.checkpw(password.encode('utf-8'), password_hash)
