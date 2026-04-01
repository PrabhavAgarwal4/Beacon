import api from "./api";

export const applyForJob = ({jobId})=>{
    return api.post(`/application/apply/${jobId}`)
}
export const getApplicationStatus = ({jobId})=>{
  return api.get(`/application/application-status`,{
    params:{jobId}
  })
}
export const getMyApplications = () => {
  return api.get("/application/my-applications");
};