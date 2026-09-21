import {
  useEffect,
  useState
} from "react";

import StatusBadge from "../components/StatusBadge";

import {
  getSavedJobs,
  deleteSavedJob
} from "../services/savedJobService";


function SavedJobs() {

  const [jobs, setJobs] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  const loadJobs =
    async () => {

      try {

        setLoading(true);

        const response =
          await getSavedJobs();


        setJobs(
          response.data.jobs || []
        );


      } catch (error) {

        setError(
          error.response?.data?.message ||
          "Unable to load saved jobs"
        );

      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    loadJobs();

  }, []);


  const handleDelete =
    async (id) => {

      try {

        await deleteSavedJob(id);

        setJobs(
          jobs.filter(
            (job) => job.id !== id
          )
        );

      } catch (error) {

        setError(
          error.response?.data?.message ||
          "Unable to remove job"
        );

      }

    };


  if (loading) {

    return (

      <div className="loading-page">

        <div className="spinner"></div>

        <p>
          Loading saved jobs...
        </p>

      </div>

    );

  }


  return (

    <main className="page-container">


      <div className="page-title">

        <p className="eyebrow">
          YOUR OPPORTUNITIES
        </p>

        <h1>
          Saved Jobs
        </h1>

        <p>
          Jobs you've bookmarked for later.
        </p>

      </div>


      {error && (

        <div className="error-message">
          {error}
        </div>

      )}


      {jobs.length === 0 ? (

        <div className="empty-state">

          <div>
            🔖
          </div>

          <h2>
            No Saved Jobs
          </h2>

          <p>
            Search for jobs and save interesting
            opportunities here.
          </p>

        </div>

      ) : (

        <div className="saved-jobs-list">

          {jobs.map((job) => (

            <article
              className="saved-job-card"
              key={job.id}
            >


              <div className="saved-job-info">

                <div className="job-icon">
                  💼
                </div>


                <div>

                  <h3>
                    {job.job_title}
                  </h3>

                  <p>
                    {job.company}
                  </p>

                  <span>
                    📍 {job.location}
                  </span>

                  <br />

                  <span>
                    💰 {job.salary ||
                      "Salary not specified"}
                  </span>

                  <div>

                    <StatusBadge
                      status={job.status}
                    />

                  </div>

                </div>

              </div>


              <div className="saved-job-actions">


                {job.job_url && (

                  <a
                    href={job.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apply-button"
                  >

                    Apply →

                  </a>

                )}


                <button
                  className="delete-button"
                  onClick={() =>
                    handleDelete(job.id)
                  }
                >

                  🗑 Remove

                </button>


              </div>


            </article>

          ))}

        </div>

      )}


    </main>

  );

}


export default SavedJobs;