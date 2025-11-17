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
import AdminProfile from "../pages/profile/AdminProfile";
import UserProfile from "../pages/profile/UserProfile";
import ExpensePage from '../pages/Category/ExpensePage';
import IncomePage from '../pages/Category/IncomePage';
import TransactionsPage from "../pages/User/TransactionsPage";
import CategoryPage from "../pages/admin/CategoryPage";
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
        {/* User routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserLayout>
                <Outlet /> {/* Outlet để render nested route */}
              </UserLayout>
            </ProtectedRoute>
          }
        >
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/user/profile" element={<UserProfile />} />
          {/* Category pages */}
          <Route path="/user/expense" element={<ExpensePage />} />
          <Route path="/user/income" element={<IncomePage />} />
          {/* Các page user khác như /transactions, /statistics có thể thêm sau */}
          {/* **Báo cáo giao dịch** */}
          <Route path="/user/transactions" element={<TransactionsPage />} />
        </Route>


        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} /> {/* /admin */}
          <Route path="users" element={<Users />} />   {/* /admin/users */}
          <Route path="profile" element={<AdminProfile />} /> {/* /admin/profile */}
           <Route path="categories" element={<CategoryPage />} />
          {/* Thêm các page admin khác /admin/statistics, /admin/settings */}
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<RoleRedirect />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
