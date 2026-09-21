import os
import requests
from dotenv import load_dotenv

load_dotenv()


ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs/in/search"


def search_jobs(
    query="",
    location="",
    page=1,
    results_per_page=20,
    job_type="",
    remote=False,
    min_salary=""
):
    """
    Search jobs using the Adzuna API.
    """

    app_id = os.getenv("ADZUNA_APP_ID")
    app_key = os.getenv("ADZUNA_APP_KEY")

    if not app_id or not app_key:
        raise ValueError(
            "Adzuna API credentials are missing. "
            "Please add ADZUNA_APP_ID and ADZUNA_APP_KEY to .env"
        )

    url = f"{ADZUNA_BASE_URL}/{page}"

    params = {
        "app_id": app_id,
        "app_key": app_key,
        "results_per_page": results_per_page,
        "what": query,
        "where": location,
        "content-type": "application/json"
    }

    # -----------------------------------------
    # SALARY FILTER
    # -----------------------------------------

    if min_salary:
        try:
            params["salary_min"] = int(min_salary)
        except ValueError:
            pass

    # -----------------------------------------
    # JOB TYPE FILTER
    # -----------------------------------------

    if job_type == "full_time":
        params["full_time"] = "true"

    elif job_type == "part_time":
        params["part_time"] = "true"

    elif job_type == "contract":
        params["contract"] = "true"

    elif job_type == "permanent":
        params["permanent"] = "true"

    # -----------------------------------------
    # REMOTE SEARCH
    # -----------------------------------------

    if remote:

        if query:
            params["what"] = f"{query} remote"
        else:
            params["what"] = "remote"

    try:

        response = requests.get(
            url,
            params=params,
            timeout=15
        )

        response.raise_for_status()

        data = response.json()

        jobs = []

        for item in data.get("results", []):

            salary_min = item.get("salary_min")
            salary_max = item.get("salary_max")

            # -----------------------------------------
            # FORMAT SALARY
            # -----------------------------------------

            if salary_min and salary_max:

                salary = f"₹{salary_min:,.0f} - ₹{salary_max:,.0f}"

            elif salary_min:

                salary = f"From ₹{salary_min:,.0f}"

            elif salary_max:

                salary = f"Up to ₹{salary_max:,.0f}"

            else:

                salary = "Not specified"

            # -----------------------------------------
            # COMPANY
            # -----------------------------------------

            company_data = item.get("company", {})

            if isinstance(company_data, dict):
                company = company_data.get("display_name", "")
            else:
                company = str(company_data)

            # -----------------------------------------
            # LOCATION
            # -----------------------------------------

            location_data = item.get("location", {})

            if isinstance(location_data, dict):
                job_location = location_data.get(
                    "display_name",
                    ""
                )
            else:
                job_location = str(location_data)

            # -----------------------------------------
            # NORMALIZED JOB OBJECT
            # -----------------------------------------

            job = {
                "id": str(item.get("id", "")),
                "title": item.get("title", ""),
                "company": company,
                "location": job_location,
                "salary_min": salary_min,
                "salary_max": salary_max,
                "salary": salary,
                "description": item.get("description", ""),
                "url": item.get("redirect_url", ""),
                "created": item.get("created", ""),
                "category": item.get("category", {}).get(
                    "label",
                    ""
                ) if isinstance(item.get("category"), dict) else ""
            }

            jobs.append(job)

        return {
            "jobs": jobs,
            "count": len(jobs),
            "total": data.get("count", 0),
            "page": page
        }

    except requests.exceptions.Timeout:

        raise RuntimeError(
            "Adzuna request timed out. Please try again."
        )

    except requests.exceptions.RequestException as e:

        raise RuntimeError(
            f"Adzuna API request failed: {str(e)}"
        )

    except ValueError:

        raise RuntimeError(
            "Invalid response received from Adzuna API."
        )