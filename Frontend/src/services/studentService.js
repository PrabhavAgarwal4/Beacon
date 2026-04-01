import api from "./api";
export const getStudentProfile = (userId) => api.get(`/student/getProfile/${userId}`);
export const setStudentProfile = (data) => api.post(`/student/setProfile`, data);
export const uploadResume = (formData) => api.post(`/student/upload-resume`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' } // Crucial for files!
});