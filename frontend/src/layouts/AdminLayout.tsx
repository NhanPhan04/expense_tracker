import { ReactNode, useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Users, BarChart2, Settings, User, List } from "lucide-react";

type Props = { children?: ReactNode };

const DEFAULT_AVATAR =
  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

const AdminLayout = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; avatar: string }>({
    name: "Admin",
    avatar: DEFAULT_AVATAR,
  });

  const location = useLocation();

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

  const menuItems = [
    { label: "Trang Chủ", path: "/admin", icon: <Home size={18} /> },
    { label: "Quản Lý Người Dùng", path: "/admin/users", icon: <Users size={18} /> },
    { label: "Quản Lý Danh Mục", path: "/admin/categories", icon: <List size={18} /> },
    { label: "Thông Tin Cá Nhân", path: "/admin/profile", icon: <User size={18} /> },
  ];

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gray-100">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 transition-opacity bg-black bg-opacity-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
 <div
  className={`
    fixed md:relative z-30 
    bg-gradient-to-b from-purple-600 to-purple-800 text-white 
    w-64 p-5 
          flex flex-col
          min-h-screen
          space-y-6 
          transition-transform duration-300 ease-in-out
          transform
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
          rounded-r-2xl
          rounded-l-2xl
          rounded-tr-none
        `}
      >

        <h1 className="mb-6 text-3xl font-extrabold tracking-wide text-white drop-shadow-lg">
          Danh Mục
        </h1>

        <nav className="flex flex-col flex-1 gap-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200
                hover:bg-purple-500 hover:shadow-lg
                ${location.pathname === item.path ? "bg-purple-700 shadow-xl" : ""}
              `}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="text-sm text-center text-purple-200">Admin Dashboard © 2025</div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 md:ml-0">
        {/* Topbar */}
<div className="sticky top-0 z-10 flex items-center justify-between p-4 shadow-md bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800">
  {/* Phần trái: Xin chào + Avatar */}
  <div className="flex items-center gap-4">
    <div className="relative">
      <img
        src={user.avatar}
        alt="Avatar"
        className="object-cover w-12 h-12 border-2 border-white rounded-full shadow-lg"
      />
      <span className="absolute bottom-0 right-0 block w-4 h-4 border-2 border-white rounded-full shadow-md bg-gradient-to-r from-green-400 to-green-200 animate-pulse"></span>
    </div>
    <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 animate-gradient-x">
      {`Xin chào, ${user.name}!`}
    </span>
  </div>

  {/* Giữa: Tiêu đề trang */}
  <h1 className="flex-1 text-xl font-extrabold text-center text-white drop-shadow-md">
    Quản Lý Chi Tiêu Cá Nhân
  </h1>

  {/* Phần phải: Logout */}
  <button
    className="px-5 py-2 font-semibold text-white transition-all duration-300 rounded-lg shadow bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-700 hover:to-purple-500"
    onClick={handleLogout}
  >
    Đăng Xuất
  </button>
</div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto bg-gray-50">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
