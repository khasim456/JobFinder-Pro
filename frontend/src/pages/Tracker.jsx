import { useEffect, useState } from "react";

import {
    getSavedJobs,
    updateJobStatus,
    deleteSavedJob
} from "../services/savedJobService";


function Tracker() {

    const [jobs, setJobs] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ========================================
    // LOAD SAVED JOBS
    // ========================================

    const loadJobs = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getSavedJobs();

            setJobs(
                response.data.jobs || []
            );

        } catch (error) {

            console.error(
                "Tracker error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load applications"
            );

        } finally {

            setLoading(false);

        }
    };


    // ========================================
    // LOAD WHEN PAGE OPENS
    // ========================================

    useEffect(() => {

        loadJobs();

    }, []);


    // ========================================
    // CHANGE STATUS
    // ========================================

    const handleStatusChange = async (
        jobId,
        newStatus
    ) => {

        try {

            await updateJobStatus(
                jobId,
                newStatus
            );

            // Update UI immediately
            setJobs((currentJobs) =>
                currentJobs.map((job) =>
                    job.id === jobId
                        ? {
                            ...job,
                            status: newStatus
                        }
                        : job
                )
            );

        } catch (error) {

            console.error(
                "Status update error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to update status"
            );

        }
    };


    // ========================================
    // DELETE JOB
    // ========================================

    const handleDelete = async (
        jobId
    ) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this job?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await deleteSavedJob(
                jobId
            );

            setJobs((currentJobs) =>
                currentJobs.filter(
                    (job) =>
                        job.id !== jobId
                )
            );

        } catch (error) {

            console.error(
                "Delete job error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to delete job"
            );
        }
    };


    // ========================================
    // STATUS SECTIONS
    // ========================================

    const statuses = [
        {
            value: "Saved",
            title: "Saved",
            icon: "🔖"
        },
        {
            value: "Applied",
            title: "Applied",
            icon: "📝"
        },
        {
            value: "Interview",
            title: "Interview",
            icon: "🎤"
        },
        {
            value: "Offer",
            title: "Offer",
            icon: "🎉"
        },
        {
            value: "Rejected",
            title: "Rejected",
            icon: "❌"
        }
    ];


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (
            <main className="page-container">

                <div className="loading-page">

                    <div className="spinner"></div>

                    <p>
                        Loading application tracker...
                    </p>

                </div>

            </main>
        );
    }


    // ========================================
    // ERROR
    // ========================================

    if (error) {

        return (
            <main className="page-container">

                <div className="error-message">
                    {error}
                </div>

            </main>
        );
    }


    // ========================================
    // PAGE
    // ========================================

    return (

        <main className="page-container">

            <div className="page-title">

                <p className="eyebrow">
                    APPLICATION TRACKER
                </p>

                <h1>
                    Track Your Applications
                </h1>

                <p>
                    Manage your saved jobs and
                    application progress.
                </p>

            </div>


            <div className="tracker-summary">

                <div className="summary-card">
                    <strong>
                        {jobs.length}
                    </strong>

                    <span>
                        Total Jobs
                    </span>
                </div>

                <div className="summary-card">
                    <strong>
                        {
                            jobs.filter(
                                job =>
                                    job.status ===
                                    "Saved"
                            ).length
                        }
                    </strong>

                    <span>
                        Saved
                    </span>
                </div>

                <div className="summary-card">
                    <strong>
                        {
                            jobs.filter(
                                job =>
                                    job.status ===
                                    "Applied"
                            ).length
                        }
                    </strong>

                    <span>
                        Applied
                    </span>
                </div>

                <div className="summary-card">
                    <strong>
                        {
                            jobs.filter(
                                job =>
                                    job.status ===
                                    "Interview"
                            ).length
                        }
                    </strong>

                    <span>
                        Interview
                    </span>
                </div>

                <div className="summary-card">
                    <strong>
                        {
                            jobs.filter(
                                job =>
                                    job.status ===
                                    "Offer"
                            ).length
                        }
                    </strong>

                    <span>
                        Offer
                    </span>
                </div>

            </div>


            <div className="tracker-sections">

                {statuses.map((section) => {

                    const sectionJobs =
                        jobs.filter(
                            job =>
                                job.status ===
                                section.value
                        );

                    return (

                        <section
                            className="tracker-section"
                            key={section.value}
                        >

                            <div className="tracker-section-header">

                                <h2>
                                    {section.icon}{" "}
                                    {section.title}
                                </h2>

                                <span>
                                    {sectionJobs.length}
                                </span>

                            </div>


                            {sectionJobs.length === 0 ? (

                                <div className="tracker-empty">

                                    No jobs in this section.

                                </div>

                            ) : (

                                <div className="tracker-jobs">

                                    {sectionJobs.map(
                                        (job) => (

                                            <article
                                                className="tracker-job-card"
                                                key={job.id}
                                            >

                                                <div>

                                                    <h3>
                                                        {job.job_title}
                                                    </h3>

                                                    <p>
                                                        {job.company ||
                                                            "Company not specified"}
                                                    </p>

                                                    <p>
                                                        📍{" "}
                                                        {job.location ||
                                                            "Location not specified"}
                                                    </p>

                                                    {job.salary && (

                                                        <p>
                                                            💰{" "}
                                                            {job.salary}
                                                        </p>

                                                    )}

                                                </div>


                                                <div className="tracker-actions">

                                                    <label>
                                                        Status
                                                    </label>

                                                    <select
                                                        value={
                                                            job.status
                                                        }
                                                        onChange={(event) =>
                                                            handleStatusChange(
                                                                job.id,
                                                                event.target.value
                                                            )
                                                        }
                                                    >

                                                        <option value="Saved">
                                                            Saved
                                                        </option>

                                                        <option value="Applied">
                                                            Applied
                                                        </option>

                                                        <option value="Interview">
                                                            Interview
                                                        </option>

                                                        <option value="Offer">
                                                            Offer
                                                        </option>

                                                        <option value="Rejected">
                                                            Rejected
                                                        </option>

                                                    </select>


                                                    {job.job_url && (

                                                        <a
                                                            href={
                                                                job.job_url
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Apply Now →
                                                        </a>

                                                    )}


                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                job.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </article>

                                        )
                                    )}

                                </div>

                            )}

                        </section>

                    );

                })}

            </div>

        </main>
    );
}


export default Tracker;