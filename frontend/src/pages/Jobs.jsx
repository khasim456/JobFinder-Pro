import { useState } from "react";

import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import JobCard from "../components/JobCard";

import { searchJobs } from "../services/jobService";


function Jobs() {

    // ========================================
    // STATE
    // ========================================

    const [jobs, setJobs] = useState([]);

    const [count, setCount] = useState(0);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [searched, setSearched] = useState(false);

    const [remote, setRemote] = useState(false);

    const [type, setType] = useState("");


    // ========================================
    // SEARCH JOBS
    // ========================================

    const handleSearch = async (
        query,
        location
    ) => {

        setLoading(true);

        setError("");

        setSearched(true);

        try {

            const response = await searchJobs(
                query,
                location,
                1,
                type,
                remote,
                ""
            );


            // Backend returns "jobs"
            setJobs(
                response.data.jobs || []
            );


            // Number of jobs
            setCount(
                response.data.count || 0
            );


        } catch (error) {

            console.error(
                "Job search error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load jobs"
            );

            setJobs([]);

            setCount(0);

        } finally {

            setLoading(false);

        }
    };


    // ========================================
    // PAGE UI
    // ========================================

    return (

        <main className="page-container">

            {/* PAGE TITLE */}

            <div className="page-title">

                <p className="eyebrow">
                    JOB DISCOVERY
                </p>

                <h1>
                    Find Your Dream Job
                </h1>

                <p>
                    Search live job opportunities
                    using keywords and location.
                </p>

            </div>


            {/* SEARCH BAR */}

            <SearchBar
                onSearch={handleSearch}
                loading={loading}
            />


            {/* FILTER BAR */}

            <FilterBar
                remote={remote}
                setRemote={setRemote}
                type={type}
                setType={setType}
            />


            {/* ERROR MESSAGE */}

            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}


            {/* RESULTS HEADER */}

            {searched &&
                !loading &&
                !error && (

                    <div className="results-header">

                        <h2>
                            Job Results
                        </h2>

                        <span>

                            {count.toLocaleString()}

                            {" "}

                            jobs found

                        </span>

                    </div>

                )}


            {/* BEFORE SEARCH */}

            {!searched && (

                <div className="empty-state">

                    <div>
                        🔎
                    </div>

                    <h2>
                        Start Your Job Search
                    </h2>

                    <p>
                        Enter a job title and location
                        above to find opportunities.
                    </p>

                </div>

            )}


            {/* LOADING */}

            {loading && (

                <div className="loading-page">

                    <div className="spinner"></div>

                    <p>
                        Searching for jobs...
                    </p>

                </div>

            )}


            {/* JOB CARDS */}

            {!loading &&
                jobs.length > 0 && (

                    <div className="jobs-grid">

                        {jobs.map((job) => (

                            <JobCard
                                key={job.id}
                                job={job}
                            />

                        ))}

                    </div>

                )}


            {/* NO JOBS */}

            {!loading &&
                searched &&
                jobs.length === 0 &&
                !error && (

                    <div className="empty-state">

                        <div>
                            😕
                        </div>

                        <h2>
                            No Jobs Found
                        </h2>

                        <p>
                            Try another keyword
                            or location.
                        </p>

                    </div>

                )}

        </main>

    );
}


export default Jobs;