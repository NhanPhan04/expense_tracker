// src/layouts/AdminLayout.tsx
import { ReactNode, useState } from "react";
import { Outlet, Link } from "react-router-dom";

type Props = {
  children?: ReactNode;
};

const AdminLayout = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg w-64 p-5 space-y-6 absolute md:relative md:translate-x-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform`}>
        <h1 className="text-2xl font-bold text-purple-500">Admin Panel</h1>
        <nav className="flex flex-col gap-3 mt-10">
          <Link to="/admin" className="hover:text-purple-600">Dashboard</Link>
          <Link to="/admin/users" className="hover:text-purple-600">Users</Link>
          <Link to="/admin/statistics" className="hover:text-purple-600">Statistics</Link>
          <Link to="/admin/settings" className="hover:text-purple-600">Settings</Link>
         <Link to="/admin/profile" className="hover:text-purple-600">Profile</Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Topbar */}
        <div className="flex items-center justify-between p-4 bg-white shadow">
          <button className="font-bold md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <div className="font-semibold text-gray-700">Xin chào, Admin!</div>
          <button
            className="px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
