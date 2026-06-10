from flask import Blueprint, request, jsonify
import jwt
from datetime import datetime, timedelta
from config import Config
from models.user import UserModel
from middleware.auth import token_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({"message": "Missing required fields"}), 400
    
    if UserModel.find_by_email(data['email']):
        return jsonify({"message": "User already exists"}), 400
    
    UserModel.create_user(data['email'], data['password'], data['name'])
    return jsonify({"message": "Doctor registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Missing credentials"}), 400
    
    user = UserModel.find_by_email(data['email'])
    if not user or not UserModel.verify_password(data['password'], user['password_hash']):
        return jsonify({"message": "Invalid email or password"}), 401
    
    token = jwt.encode({
        'email': user['email'],
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, Config.JWT_SECRET, algorithm="HS256")
    
    return jsonify({
        "token": token,
        "user": {
            "email": user['email'],
            "name": user['name']
        }
    }), 200

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_me():
    user = UserModel.find_by_email(request.user_email)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify({
        "email": user['email'],
        "name": user['name']
    }), 200
