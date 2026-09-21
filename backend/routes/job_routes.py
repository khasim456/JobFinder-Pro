from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    verify_jwt_in_request,
    get_jwt_identity
)

from database import get_db_connection

from services.adzuna_service import search_jobs


# ========================================
# JOB BLUEPRINT
# ========================================

job_bp = Blueprint(
    "jobs",
    __name__,
    url_prefix="/api/jobs"
)


# ========================================
# SEARCH JOBS
# ========================================

@job_bp.route("/search", methods=["GET"])
def search():

    # ------------------------------------
    # GET SEARCH PARAMETERS
    # ------------------------------------

    query = request.args.get(
        "query",
        ""
    ).strip()

    location = request.args.get(
        "location",
        ""
    ).strip()

    page = request.args.get(
        "page",
        1,
        type=int
    )

    job_type = request.args.get(
        "job_type",
        ""
    ).strip()

    remote = request.args.get(
        "remote",
        "false"
    ).lower() == "true"

    min_salary = request.args.get(
        "min_salary",
        ""
    ).strip()


    # ------------------------------------
    # CHECK PAGE
    # ------------------------------------

    if page < 1:
        page = 1


    # ------------------------------------
    # SEARCH ADZUNA
    # ------------------------------------

    try:

        result = search_jobs(

            query=query,

            location=location,

            page=page,

            results_per_page=20,

            job_type=job_type,

            remote=remote,

            min_salary=min_salary

        )


        # --------------------------------
        # SAVE SEARCH HISTORY
        # --------------------------------

        try:

            # JWT is optional.
            # User does not need to be logged in
            # to search jobs.

            verify_jwt_in_request(
                optional=True
            )

            user_id = get_jwt_identity()


            if user_id and (
                query or location
            ):

                connection = None
                cursor = None

                try:

                    connection = get_db_connection()

                    cursor = connection.cursor()

                    cursor.execute(
                        """
                        INSERT INTO search_history
                        (
                            user_id,
                            query,
                            location
                        )
                        VALUES
                        (
                            %s,
                            %s,
                            %s
                        )
                        """,
                        (
                            int(user_id),
                            query,
                            location
                        )
                    )

                    connection.commit()

                except Exception as history_error:

                    print(
                        "History save error:",
                        history_error
                    )

                finally:

                    if cursor:
                        cursor.close()

                    if connection:
                        connection.close()


        except Exception as jwt_error:

            print(
                "Optional JWT error:",
                jwt_error
            )


        # --------------------------------
        # RETURN JOB RESULTS
        # --------------------------------

        return jsonify({

            "success": True,

            "jobs": result.get(
                "jobs",
                []
            ),

            "count": result.get(
                "count",
                0
            ),

            "total": result.get(
                "total",
                0
            ),

            "page": result.get(
                "page",
                page
            )

        }), 200


    # ------------------------------------
    # ADZUNA CREDENTIAL ERROR
    # ------------------------------------

    except ValueError as e:

        print(
            "Adzuna configuration error:",
            e
        )

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500


    # ------------------------------------
    # ADZUNA REQUEST ERROR
    # ------------------------------------

    except RuntimeError as e:

        print(
            "Adzuna API error:",
            e
        )

        return jsonify({

            "success": False,

            "message": str(e)

        }), 502


    # ------------------------------------
    # OTHER ERROR
    # ------------------------------------

    except Exception as e:

        print(
            "Job search error:",
            e
        )

        return jsonify({

            "success": False,

            "message": "Unable to search jobs.",

            "error": str(e)

        }), 500