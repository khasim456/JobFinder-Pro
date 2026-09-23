import os
import mysql.connector

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from dotenv import load_dotenv

from database import initialize_tables

from routes.auth_routes import auth_bp
from routes.job_routes import job_bp
from routes.saved_job_routes import saved_job_bp
from routes.history_routes import history_bp


# =====================================================
# LOAD ENVIRONMENT VARIABLES
# =====================================================

load_dotenv()


# =====================================================
# CREATE FLASK APP
# =====================================================

app = Flask(__name__)


# =====================================================
# CORS CONFIGURATION
# =====================================================

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173"
            ]
        }
    }
)


# =====================================================
# JWT CONFIGURATION
# =====================================================

app.config["JWT_SECRET_KEY"] = os.getenv(
    "JWT_SECRET_KEY",
    "change-this-secret-key"
)

jwt = JWTManager(app)


# =====================================================
# REGISTER BLUEPRINTS
# =====================================================

app.register_blueprint(auth_bp)

app.register_blueprint(job_bp)

app.register_blueprint(saved_job_bp)

app.register_blueprint(history_bp)


# =====================================================
# HOME / HEALTH CHECK
# =====================================================

@app.route("/")
def home():

    return jsonify({
        "message": "JobFinder Pro Backend is running!",
        "status": "success"
    })


@app.route("/api/health")
def health():

    return jsonify({
        "status": "healthy",
        "application": "JobFinder Pro"
    })


# =====================================================
# ERROR HANDLERS
# =====================================================

@app.errorhandler(404)
def not_found(error):

    return jsonify({
        "message": "API endpoint not found."
    }), 404


@app.errorhandler(500)
def internal_server_error(error):

    return jsonify({
        "message": "Internal server error."
    }), 500


# =====================================================
# START APPLICATION
# =====================================================

if __name__ == "__main__":

    print("------------------------------------------")
    print("      JOBFINDER PRO BACKEND")
    print("------------------------------------------")

    print("Initializing database tables...")

    initialize_tables()

    print("------------------------------------------")
    print("Server running at:")
    print("http://127.0.0.1:5000")
    print("------------------------------------------")

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )