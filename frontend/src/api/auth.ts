import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // backend
});
// Interceptor: tự động thêm token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const register = (data: any) => api.post("/auth/register", data);
export const login = (data: any) => api.post("/auth/login", data);
export const forgetPassword = (data: any) => api.post("/auth/forget-password", data);
export const resetPassword = (data: any) => api.post("/auth/reset-password", data);

export default api;
