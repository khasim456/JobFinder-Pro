from flask import Blueprint, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from database import get_db_connection


history_bp = Blueprint(
    "history",
    __name__,
    url_prefix="/api/history"
)


# =====================================================
# GET SEARCH HISTORY
# =====================================================

@history_bp.route("/", methods=["GET"])
@jwt_required()
def get_history():

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
                query,
                location,
                searched_at
            FROM search_history
            WHERE user_id = %s
            ORDER BY searched_at DESC
            """,
            (int(user_id),)
        )

        history = cursor.fetchall()

        return jsonify({
            "success": True,
            "history": history,
            "count": len(history)
        }), 200

    except Exception as e:

        print(
            "GET HISTORY ERROR:",
            e
        )

        return jsonify({
            "success": False,
            "message": "Unable to retrieve search history.",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =====================================================
# DELETE ONE SEARCH HISTORY ITEM
# =====================================================

@history_bp.route(
    "/<int:history_id>",
    methods=["DELETE"]
)
@jwt_required()
def delete_history(history_id):

    user_id = get_jwt_identity()

    connection = None
    cursor = None

    try:

        connection = get_db_connection()

        cursor = connection.cursor()

        cursor.execute(
            """
            DELETE FROM search_history
            WHERE id = %s
            AND user_id = %s
            """,
            (
                history_id,
                int(user_id)
            )
        )

        connection.commit()

        if cursor.rowcount == 0:

            return jsonify({
                "message": "History item not found."
            }), 404

        return jsonify({
            "success": True,
            "message": "Search history deleted successfully."
        }), 200

    except Exception as e:

        if connection:
            connection.rollback()

        print(
            "DELETE HISTORY ERROR:",
            e
        )

        return jsonify({
            "success": False,
            "message": "Unable to delete history.",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =====================================================
# CLEAR ALL SEARCH HISTORY
# =====================================================

@history_bp.route(
    "/clear",
    methods=["DELETE"]
)
@jwt_required()
def clear_history():

    user_id = get_jwt_identity()

    connection = None
    cursor = None

    try:

        connection = get_db_connection()

        cursor = connection.cursor()

        cursor.execute(
            """
            DELETE FROM search_history
            WHERE user_id = %s
            """,
            (int(user_id),)
        )

        deleted_count = cursor.rowcount

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Search history cleared successfully.",
            "deleted_count": deleted_count
        }), 200

    except Exception as e:

        if connection:
            connection.rollback()

        print(
            "CLEAR HISTORY ERROR:",
            e
        )

        return jsonify({
            "success": False,
            "message": "Unable to clear search history.",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()