import API from "./api";


// ========================================
// SEARCH JOBS
// ========================================

export const searchJobs = async (
    query = "",
    location = "",
    page = 1,
    jobType = "",
    remote = false,
    minSalary = ""
) => {

    const response = await API.get(
        "/jobs/search",
        {
            params: {
                query: query,
                location: location,
                page: page,
                job_type: jobType,
                remote: remote,
                min_salary: minSalary
            }
        }
    );

    return response;
};


// ========================================
// GET JOB BY ID
// ========================================

export const getJobById = async (jobId) => {

    const response = await API.get(
        `/jobs/${jobId}`
    );

    return response;
};