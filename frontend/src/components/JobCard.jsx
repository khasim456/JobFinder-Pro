import { useState } from "react";

import { saveJob } from "../services/savedJobService";


function JobCard({ job }) {

    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");


    // ========================================
    // JOB DATA
    // ========================================

    const title =
        job.title ||
        "Untitled Job";


    const company =
        job.company ||
        "Company not specified";


    const location =
        job.location ||
        "Location not specified";


    // ========================================
    // SALARY
    // ========================================

    let salary = "Salary not specified";

    if (job.salary_min && job.salary_max) {

        salary =
            `₹${Number(job.salary_min).toLocaleString()} - ` +
            `₹${Number(job.salary_max).toLocaleString()}`;

    } else if (job.salary_min) {

        salary =
            `From ₹${Number(job.salary_min).toLocaleString()}`;

    } else if (job.salary_max) {

        salary =
            `Up to ₹${Number(job.salary_max).toLocaleString()}`;

    }


    // ========================================
    // DESCRIPTION
    // ========================================

    const description =
        (job.description || "")
            .replace(/<[^>]*>/g, "")
            .slice(0, 250);


    // ========================================
    // CATEGORY
    // ========================================

    const category =
        job.category ||
        "";


    // ========================================
    // APPLY URL
    // ========================================

    const applyUrl =
        job.url ||
        "";


    // ========================================
    // SAVE JOB
    // ========================================

    const handleSave = async () => {

        try {

            setSaving(true);

            setMessage("");


            await saveJob({

                job_id: String(job.id),

                job_title: title,

                company: company,

                location: location,

                salary: salary,

                job_url: applyUrl

            });


            setMessage(
                "✓ Job saved successfully"
            );


        } catch (error) {

            console.error(
                "Save job error:",
                error
            );


            setMessage(

                error.response?.data?.message ||

                "Unable to save job"

            );


        } finally {

            setSaving(false);

        }

    };


    // ========================================
    // UI
    // ========================================

    return (

        <article className="job-card">


            {/* TOP SECTION */}

            <div className="job-card-top">

                <div className="job-icon">
                    💼
                </div>


                <div className="job-information">

                    <h3>
                        {title}
                    </h3>


                    <p className="company-name">
                        {company}
                    </p>


                    <p>
                        📍 {location}
                    </p>

                </div>

            </div>


            {/* JOB DETAILS */}

            <div className="job-details">

                <span>
                    💰 {salary}
                </span>


                {category && (

                    <span>
                        🏷️ {category}
                    </span>

                )}

            </div>


            {/* DESCRIPTION */}

            <p className="job-description">

                {description}

                {description.length >= 250
                    ? "..."
                    : ""}

            </p>


            {/* FOOTER */}

            <div className="job-card-footer">


                {/* SAVE */}

                <button
                    className="save-button"
                    onClick={handleSave}
                    disabled={saving}
                >

                    {saving
                        ? "Saving..."
                        : "🔖 Save Job"}

                </button>


                {/* APPLY */}

                {applyUrl && (

                    <a
                        href={applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="apply-button"
                    >

                        Apply Now →

                    </a>

                )}


                {/* MESSAGE */}

                {message && (

                    <span className="save-message">

                        {message}

                    </span>

                )}

            </div>


        </article>

    );

}


export default JobCard;