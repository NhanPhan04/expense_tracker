import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // backend
});

export const register = (data: any) => api.post("/auth/register", data);
export const login = (data: any) => api.post("/auth/login", data);
export const forgetPassword = (data: any) => api.post("/auth/forget-password", data);
export const resetPassword = (data: any) => api.post("/auth/reset-password", data);

export default api;
