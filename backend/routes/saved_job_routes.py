from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from database import get_db_connection


saved_job_bp = Blueprint(
    "saved_jobs",
    __name__,
    url_prefix="/api/jobs"
)


# ========================================
# SAVE JOB
# ========================================

@saved_job_bp.route("/save", methods=["POST"])
@jwt_required()
def save_job():

    user_id = get_jwt_identity()

    if not user_id:
        return jsonify({
            "message": "User authentication required"
        }), 401

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Job data is required"
        }), 400

    job_id = data.get("job_id")
    job_title = data.get("job_title")
    company = data.get("company", "")
    location = data.get("location", "")
    salary = data.get("salary", "")
    job_url = data.get("job_url", "")

    if not job_id or not job_title:
        return jsonify({
            "message": "Job ID and job title are required"
        }), 400

    connection = None
    cursor = None

    try:

        connection = get_db_connection()
        cursor = connection.cursor()

        # Check if this job is already saved
        cursor.execute(
            """
            SELECT id
            FROM saved_jobs
            WHERE user_id = %s
            AND job_id = %s
            """,
            (
                int(user_id),
                str(job_id)
            )
        )

        existing_job = cursor.fetchone()

        if existing_job:
            return jsonify({
                "message": "Job already saved"
            }), 409

        # Insert job
        cursor.execute(
            """
            INSERT INTO saved_jobs
            (
                user_id,
                job_id,
                job_title,
                company,
                location,
                salary,
                job_url,
                status
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                'Saved'
            )
            """,
            (
                int(user_id),
                str(job_id),
                job_title,
                company,
                location,
                salary,
                job_url
            )
        )

        connection.commit()

        return jsonify({
            "message": "Job saved successfully",
            "saved_job_id": cursor.lastrowid
        }), 201

    except Exception as e:

        if connection:
            connection.rollback()

        print("SAVE JOB ERROR:", e)

        return jsonify({
            "message": "Unable to save job",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ========================================
# GET SAVED JOBS
# ========================================

@saved_job_bp.route("/saved", methods=["GET"])
@jwt_required()
def get_saved_jobs():

    user_id = get_jwt_identity()

    connection = None
    cursor = None

    try:

        connection = get_db_connection()

        cursor = connection.cursor(
            dictionary=True
        )

        cursor.execute(
            """
            SELECT
                id,
                job_id,
                job_title,
                company,
                location,
                salary,
                job_url,
                status,
                saved_at
            FROM saved_jobs
            WHERE user_id = %s
            ORDER BY saved_at DESC
            """,
            (int(user_id),)
        )

        jobs = cursor.fetchall()

        return jsonify({
            "success": True,
            "jobs": jobs
        }), 200

    except Exception as e:

        print(
            "GET SAVED JOBS ERROR:",
            e
        )

        return jsonify({
            "message": "Unable to load saved jobs",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ========================================
# UPDATE JOB STATUS
# ========================================

@saved_job_bp.route(
    "/saved/<int:id>/status",
    methods=["PUT"]
)
@jwt_required()
def update_job_status(id):

    user_id = get_jwt_identity()

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Request body is required"
        }), 400

    status = data.get("status")

    allowed_statuses = [
        "Saved",
        "Applied",
        "Interview",
        "Offer",
        "Rejected"
    ]

    if status not in allowed_statuses:
        return jsonify({
            "message": "Invalid job status"
        }), 400

    connection = None
    cursor = None

    try:

        connection = get_db_connection()

        cursor = connection.cursor()

        cursor.execute(
            """
            UPDATE saved_jobs
            SET status = %s
            WHERE id = %s
            AND user_id = %s
            """,
            (
                status,
                id,
                int(user_id)
            )
        )

        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({
                "message": "Saved job not found"
            }), 404

        return jsonify({
            "message": "Job status updated successfully"
        }), 200

    except Exception as e:

        if connection:
            connection.rollback()

        print(
            "UPDATE STATUS ERROR:",
            e
        )

        return jsonify({
            "message": "Unable to update job status",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ========================================
# DELETE SAVED JOB
# ========================================

@saved_job_bp.route(
    "/saved/<int:id>",
    methods=["DELETE"]
)
@jwt_required()
def delete_saved_job(id):

    user_id = get_jwt_identity()

    connection = None
    cursor = None

    try:

        connection = get_db_connection()

        cursor = connection.cursor()

        cursor.execute(
            """
            DELETE FROM saved_jobs
            WHERE id = %s
            AND user_id = %s
            """,
            (
                id,
                int(user_id)
            )
        )

        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({
                "message": "Saved job not found"
            }), 404

        return jsonify({
            "message": "Job deleted successfully"
        }), 200

    except Exception as e:

        if connection:
            connection.rollback()

        print(
            "DELETE SAVED JOB ERROR:",
            e
        )

        return jsonify({
            "message": "Unable to delete saved job",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()