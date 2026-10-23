
import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

from database import initialize_tables
from routes.auth_routes import auth_bp
from routes.job_routes import job_bp
from routes.saved_job_routes import saved_job_bp
from routes.history_routes import history_bp


# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__)

# CORS configuration
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "https://job-finder-pro-sigma.vercel.app",
            ]
        }
    },
)

# JWT configuration
app.config["JWT_SECRET_KEY"] = os.getenv(
    "JWT_SECRET_KEY",
    "change-this-secret-key"
)

jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(job_bp)
app.register_blueprint(saved_job_bp)
app.register_blueprint(history_bp)


# Home route
@app.route("/")
def home():
    return jsonify({
        "message": "JobFinder Pro Backend is running!",
        "status": "success"
    })


# Health check
@app.route("/api/health")
def health():
    return jsonify({
        "status": "healthy",
        "application": "JobFinder Pro"
    })


# Handle 404 errors
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "message": "API endpoint not found."
    }), 404


# Handle 500 errors
@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({
        "message": "Internal server error."
    }), 500


# Start application locally
if __name__ == "__main__":
    print("JOBFINDER PRO BACKEND")
    print("Initializing database tables...")

    initialize_tables()

    port = int(os.environ.get("PORT", 5000))

    print(f"Server running on port {port}")

    app.run(
        host="0.0.0.0",
        port=port,
        debug=os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    )
