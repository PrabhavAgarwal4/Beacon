import api from "./api.js";


export const getPendingUsers = () => api.get(`/admin/pending-users`);
export const approveUser = (userId) => api.post(`/admin/approve-user`, { userId });

export const getPendingJobs = () => api.get(`/admin/pending-jobs`);
export const approveJob = (jobId) => api.post(`/admin/approve-job/${jobId}`);