import api from "./api";


// ========================================
// SAVE JOB
// ========================================

export const saveJob = (job) => {

    return api.post(
        "/jobs/save",
        job
    );

};


// ========================================
// GET SAVED JOBS
// ========================================

export const getSavedJobs = () => {

    return api.get(
        "/jobs/saved"
    );

};


// ========================================
// UPDATE JOB STATUS
// ========================================

export const updateJobStatus = (
    id,
    status
) => {

    return api.put(
        `/jobs/saved/${id}/status`,
        {
            status: status
        }
    );

};


// ========================================
// DELETE SAVED JOB
// ========================================

export const deleteSavedJob = (
    id
) => {

    return api.delete(
        `/jobs/saved/${id}`
    );

};