from flask import Blueprint, request, jsonify
from services.gemini_service import GeminiService
from services.emergency_detector import detect_emergency
from models.consultation import ConsultationModel
from db import get_db

symptom_bp = Blueprint('symptoms', __name__)

@symptom_bp.route('/analyze', methods=['POST'])
def analyze_symptoms():
    try:
        data = request.get_json()
        symptoms = data.get('message', '')
        chat_history = data.get('chat_history', [])
        language = data.get('language', 'english')

        if not symptoms:
            return jsonify({"message": "Symptoms are required"}), 400

        # 1. Synchronous Emergency Detection
        is_emergency = detect_emergency(symptoms)
        if is_emergency:
            emergency_response = {
                "reply": "EMERGENCY: Your symptoms suggest a potentially life-threatening condition. Please stop this chat and call emergency services (112) immediately.",
                "triage_level": "URGENT",
                "specialist": "Emergency Medicine",
                "is_emergency": True,
                "disclaimer": "This is an automated emergency detection. Seek immediate help."
            }
            # Save to DB
            ConsultationModel.create_consultation({
                "type": "symptom",
                "input_text": symptoms,
                "ai_response": emergency_response,
                "triage_level": "URGENT",
                "is_emergency": True
            })
            return jsonify(emergency_response), 200

        # 2. Gemini Analysis
        ai_response = GeminiService.analyze_symptoms(symptoms, chat_history, language)
        
        # Override emergency if Gemini finds it but simple detector didn't
        is_emergency = ai_response.get("is_emergency", False) or is_emergency
        ai_response["is_emergency"] = is_emergency

        # Save to DB
        ConsultationModel.create_consultation({
            "type": "symptom",
            "input_text": symptoms,
            "ai_response": ai_response,
            "triage_level": ai_response.get("triage_level", "LOW"),
            "is_emergency": is_emergency
        })

        return jsonify(ai_response), 200

    except Exception as e:
        print(f"Symptom Analysis Route Error: {e}")
        return jsonify({"message": "Internal server error"}), 500

@symptom_bp.route('/history', methods=['GET'])
def get_symptom_history():
    try:
        db = get_db()
        # Fetches last 20 consultations from MongoDB where type is "symptom"
        consultations = list(db.consultations.find({"type": "symptom"}).sort("created_at", -1).limit(20))
        
        history = []
        for c in consultations:
            history.append({
                "_id": str(c["_id"]),
                "input_text": c.get("input_text", ""),
                "ai_response": {
                    "triage_level": c.get("ai_response", {}).get("triage_level", "LOW"),
                    "specialist": c.get("ai_response", {}).get("specialist", "N/A"),
                    "reply": c.get("ai_response", {}).get("reply", "")
                },
                "created_at": c.get("created_at")
            })
            
        return jsonify(history), 200
    except Exception as e:
        print(f"Symptom History Route Error: {e}")
        return jsonify({"message": "Internal server error"}), 500
