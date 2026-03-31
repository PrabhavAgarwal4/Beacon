import api from "./api";

export const getAllJobs = () => api.get("/job")