// src/routes/AppRoutes.tsx
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgetPasswordInline from "../pages/auth/ForgetPasswordInline";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import UserDashboard from "../pages/dashboard/UserDashboard";
import Users from "../pages/admin/Users"; 
import ProtectedRoute from "../components/ProtectedRoute";
import RoleRedirect from "../components/RoleRedirect";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Root / tự động redirect theo role */}
        <Route path="/" element={<RoleRedirect />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPasswordInline />} />

        {/* User routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserLayout>
                <Outlet /> {/* cần Outlet để render nested route */}
              </UserLayout>
            </ProtectedRoute>
          }
        >
          <Route path="/user" element={<UserDashboard />} />
          {/* Thêm page user khác /transactions, /statistics,... */}
        </Route>

        {/* Admin routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            </ProtectedRoute>
          }
        >
       <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Users />} /> {/* <-- thêm route này */}
          {/* thêm các page admin khác /admin/statistics, /admin/settings */}
        </Route>

        {/* Fallback nếu route không tồn tại */}
        <Route path="*" element={<RoleRedirect />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
