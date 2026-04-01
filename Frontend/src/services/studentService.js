import api from "./api";
export const getStudentProfile = (userId) => api.get(`/api/v1/users/student/profile/${userId}`);
export const setStudentProfile = (data) => api.post(`/api/v1/users/student/set-profile`, data);
export const uploadResume = (formData) => api.post(`/api/v1/users/student/upload-resume`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' } // Crucial for files!
});