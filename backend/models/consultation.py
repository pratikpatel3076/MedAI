from datetime import datetime
from db import get_db
from bson import ObjectId

class ConsultationModel:
    @staticmethod
    def create_consultation(data):
        db = get_db()
        consultation = {
            "type": data.get("type"), # "symptom" or "report"
            "input_text": data.get("input_text"),
            "ai_response": data.get("ai_response"),
            "triage_level": data.get("triage_level"),
            "is_emergency": data.get("is_emergency", False),
            "doctor_note": "",
            "created_at": datetime.utcnow()
        }
        return db.consultations.insert_one(consultation)

    @staticmethod
    def get_all_consultations(filters=None):
        db = get_db()
        query = {}
        if filters and filters.get("triage_level") and filters.get("triage_level") != "ALL":
            query["triage_level"] = filters.get("triage_level")
        return list(db.consultations.find(query).sort("created_at", -1))

    @staticmethod
    def add_note(consultation_id, note):
        db = get_db()
        return db.consultations.update_one(
            {"_id": ObjectId(consultation_id)},
            {"$set": {"doctor_note": note}}
        )
