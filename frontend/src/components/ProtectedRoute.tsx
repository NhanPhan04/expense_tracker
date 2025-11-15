// src/components/ProtectedRoute.tsx
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;
  allowedRoles?: ("user" | "admin")[];
};

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") as "user" | "admin";

  if (!token) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" />;

  return <>{children}</>;
};

export default ProtectedRoute;
