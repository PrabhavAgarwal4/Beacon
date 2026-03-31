import api from "./api";

export const getAllJobs = ({ page = 1, search = "", location = "", job_type = "" }) => {
  return api.get(`/job`, {
    params: { page, search, location, job_type }
  });
};