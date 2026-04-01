import api from "./api";



export const toggleJobStatus = (jobId) => api.post(`/job/toggle-status/${jobId}`)
export const createJob = (formData) => api.post(`/job/create`,formData)
export const updateJob = (jobId) => api.post(`/job/update/${jobId}`)
export const deleteJob = (jobId) => api.post(`/job/delete/${jobId}`)

export const updateAppStatus = (appId,status) => api.post(`/application/update-status/${appId}`,status) //status in req.body

export const getMyPostedJobs = () => api.get("/job/my-job")

export const allApplicantsForJob = (jobId) => api.get(`/application/job/${jobId}/applicants`)

export const setRecruiterDetails=(formData) => api.post("/recruiter/setProfile",formData)
export const getRecruiterDetails = (targetId) => api.get(`/recruiter/getProfile/${targetId}`)