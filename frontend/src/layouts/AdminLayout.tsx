// src/layouts/AdminLayout.tsx
import { ReactNode, useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";

type Props = { children?: ReactNode };

// Avatar mặc định
const DEFAULT_AVATAR =
  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

const AdminLayout = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; avatar: string }>({
    name: "Admin",
    avatar: DEFAULT_AVATAR,
  });

  // Load user từ localStorage khi layout mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser.name || storedUser.avatar) {
      setUser({
        name: storedUser.name || "Admin",
        avatar: storedUser.avatar || DEFAULT_AVATAR,
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gray-100">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative z-30 
          bg-white shadow-lg w-64 p-5 space-y-6 
          transform h-screen
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
        `}
      >
        <h1 className="text-2xl font-bold text-purple-500">Admin Panel</h1>
        <nav className="flex flex-col gap-3 mt-10">
          <Link to="/admin" className="hover:text-purple-600">
            Dashboard
          </Link>
          <Link to="/admin/users" className="hover:text-purple-600">
            Users
          </Link>
          <Link to="/admin/statistics" className="hover:text-purple-600">
            Statistics
          </Link>
          <Link to="/admin/settings" className="hover:text-purple-600">
            Settings
          </Link>
          <Link to="/admin/profile" className="hover:text-purple-600">
            Profile
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 md:ml-0">
        {/* Topbar */}
        <div className="flex items-center justify-between p-4 bg-white shadow">
          <button
            className="font-bold md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <div className="flex items-center gap-3 font-semibold text-gray-700">
            <img
              src={user.avatar}
              alt="Avatar"
              className="object-cover w-8 h-8 rounded-full"
            />
            <span>Xin chào, {user.name}!</span>
          </div>

          <button
            className="px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 overflow-auto">{children || <Outlet />}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
