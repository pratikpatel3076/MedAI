from flask import Blueprint, request, jsonify
from services.gemini_service import GeminiService
from models.consultation import ConsultationModel

medicine_bp = Blueprint('medicine', __name__)

@medicine_bp.route('/lookup', methods=['POST'])
def lookup_medicine():
    try:
        data = request.get_json()
        medicine_name = data.get('medicine_name', '')

        if not medicine_name:
            return jsonify({"message": "Medicine name is required"}), 400

        # Gemini lookup
        ai_response = GeminiService.lookup_medicine(medicine_name)

        # Save to DB
        ConsultationModel.create_consultation({
            "type": "medicine",
            "input_text": medicine_name,
            "ai_response": ai_response,
            "triage_level": "LOW",
            "is_emergency": False
        })

        return jsonify(ai_response), 200

    except Exception as e:
        print(f"Medicine Lookup Route Error: {e}")
        return jsonify({"message": "Internal server error"}), 500
