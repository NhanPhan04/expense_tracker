import api from "./auth";
export const getAllUsers = () => api.get("/admin/users"); // ✅ đúng
export const updateUserRole = (id: number, role: string) =>
  api.patch(`/admin/users/${id}`, { role });

export const resetUserPassword = (id: number) =>
  api.patch(`/admin/users/${id}/reset-password`, { newPassword: "123456" });
