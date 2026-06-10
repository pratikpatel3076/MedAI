from flask import Blueprint, request, jsonify
from middleware.auth import token_required
from models.consultation import ConsultationModel

emergency_bp = Blueprint('emergency', __name__)

@emergency_bp.route('/consultations', methods=['GET'])
@token_required
def get_consultations():
    try:
        triage_level = request.args.get('triage_level', 'ALL')
        consultations = ConsultationModel.get_all_consultations({"triage_level": triage_level})
        
        # Convert ObjectId to string for JSON serialization
        for c in consultations:
            c['_id'] = str(c['_id'])
            if 'created_at' in c:
                c['created_at'] = c['created_at'].isoformat()
                
        return jsonify(consultations), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@emergency_bp.route('/consultations/<id>/note', methods=['POST'])
@token_required
def add_doctor_note(id):
    try:
        data = request.get_json()
        note = data.get('note', '')
        ConsultationModel.add_note(id, note)
        return jsonify({"message": "Note added successfully"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
