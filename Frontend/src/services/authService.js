import api from "./api"

export const loginUser = (data) => api.post("/users/login", data);
export const registerUser = (data) => api.post("/users/register", data);
export const getUser = () => api.get("/users/me")