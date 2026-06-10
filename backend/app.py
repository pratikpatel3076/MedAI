from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from routes.auth_routes import auth_bp
from routes.symptom_routes import symptom_bp
from routes.report_routes import report_bp
from routes.emergency_routes import emergency_bp
from routes.medicine_routes import medicine_bp

app = Flask(__name__)
CORS(app)

app.config.from_object(Config)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(symptom_bp, url_prefix='/api/symptoms')
app.register_blueprint(report_bp, url_prefix='/api/reports')
app.register_blueprint(emergency_bp, url_prefix='/api/doctor')
app.register_blueprint(medicine_bp, url_prefix='/api/medicine')

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "AI Medical Assistant"}), 200

@app.errorhandler(404)
def not_found(e):
    return jsonify({"message": "Resource not found"}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({"message": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=Config.FLASK_PORT, debug=True)
