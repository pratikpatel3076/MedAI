from flask import Blueprint, request, jsonify
import os
from werkzeug.utils import secure_filename
from config import Config
from services.report_parser import extract_text_from_pdf
from services.gemini_service import GeminiService
from models.consultation import ConsultationModel

report_bp = Blueprint('reports', __name__)

ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@report_bp.route('/analyze', methods=['POST'])
def analyze_report():
    try:
        if 'file' not in request.files:
            return jsonify({"message": "No file part"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"message": "No selected file"}), 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(Config.UPLOAD_FOLDER, filename)
            file.save(file_path)

            # 1. Extract text
            text, error = extract_text_from_pdf(file_path)
            if error:
                # Remove file if parsing fails
                if os.path.exists(file_path):
                    os.remove(file_path)
                return jsonify({"message": error}), 400

            # 2. Analyze with Gemini
            ai_response = GeminiService.analyze_report(text)
            
            # 3. Save to DB
            ConsultationModel.create_consultation({
                "type": "report",
                "input_text": filename,
                "ai_response": ai_response,
                "triage_level": "LOW", # Reports usually don't have immediate triage level like symptoms
                "is_emergency": False
            })

            # Cleanup
            if os.path.exists(file_path):
                os.remove(file_path)

            return jsonify(ai_response), 200
        
        return jsonify({"message": "Only PDF files are allowed"}), 400

    except Exception as e:
        print(f"Report Analysis Route Error: {e}")
        return jsonify({"message": "Internal server error"}), 500
