// src/components/RoleRedirect.tsx
import { Navigate } from "react-router-dom";

const RoleRedirect = () => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload.role;
    if (role === "admin") return <Navigate to="/admin" />;
    if (role === "user") return <Navigate to="/user" />;
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }

  return <Navigate to="/login" />;
};

export default RoleRedirect;
