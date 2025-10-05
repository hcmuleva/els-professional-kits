import os
from datetime import datetime, timedelta
from functools import wraps

from flask import Flask, request, jsonify
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import jwt

# -----------------------------
# Config
# -----------------------------
DB_USER = os.getenv("POSTGRES_USER", "appuser")
DB_PASS = os.getenv("POSTGRES_PASSWORD", "apppass")
DB_NAME = os.getenv("POSTGRES_DB", "appdb")
DB_HOST = os.getenv("POSTGRES_HOST", "postgres")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
JWT_SECRET = os.getenv("JWT_SECRET", "change_me_in_prod")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# -----------------------------
# Models
# -----------------------------
class User(db.Model):
    __tablename__ = "users"  # aligns with typical starter kits; change if needed
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False, default="student")
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat()
        }

# Optional: create table if it doesn't exist (safe when starter kit already did)
with app.app_context():
    db.create_all()

# -----------------------------
# Auth helpers
# -----------------------------
def create_jwt(user_id: int, role: str, email: str) -> str:
    payload = {
        "sub": str(user_id),
        "role": role,
        "email": email,
        "exp": datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401
        token = auth.split(" ", 1)[1].strip()
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            request.user = payload  # attach to request
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return wrapper

# -----------------------------
# Routes
# -----------------------------
@app.route("/health", methods=["GET"])
def health():
    return {"status": "ok"}

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    role = (data.get("role") or "student").strip()

    if not username or not email or not password:
        return jsonify({"error": "username, email, and password are required"}), 400

    # Check existing
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    user = User(
        username=username,
        email=email,
        password_hash=generate_password_hash(password),
        role=role if role else "student"
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully", "user": user.to_dict()}), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_jwt(user.id, user.role, user.email)
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user_role": user.role
    }), 200

@app.route("/api/users", methods=["GET"])
@token_required
def get_users():
    users = User.query.order_by(User.id.asc()).all()
    return jsonify([u.to_dict() for u in users]), 200

# -----------------------------
# Entry
# -----------------------------
if __name__ == "__main__":
    # For local dev (Docker uses gunicorn below)
    app.run(host="0.0.0.0", port=5050)
