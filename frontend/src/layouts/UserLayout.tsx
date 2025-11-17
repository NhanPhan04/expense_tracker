// src/layouts/UserLayout.tsx
import {  
  Home,
  Wallet,
  ChevronDown,
  ChevronRight,
  ListTodo,
  BarChart3,
  User,
  CircleMinus,
  CirclePlus,
  Bell, 
  Phone, 
  Info 
} from "lucide-react";
import { ReactNode, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

type Props = { children?: ReactNode };

const UserLayout = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expenseMenuOpen, setExpenseMenuOpen] = useState(true);
  const { user, setUser } = useUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setUser({ name: "User", avatar: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" });
    window.location.href = "/login";
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-purple-50">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 transition-opacity duration-300 bg-black bg-opacity-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative z-30 
          bg-gradient-to-b from-purple-100 to-purple-200 shadow-xl
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
        <h1 className="text-2xl font-bold text-purple-700 drop-shadow-md">
          Danh Mục
        </h1>

        <nav className="flex flex-col gap-3 mt-10 text-gray-700">
          <Link to="/user" className="flex items-center gap-2 px-3 py-2 transition rounded-lg hover:bg-purple-200 hover:text-purple-700">
            <Home size={18} className="text-purple-600" />
            Trang Chủ
          </Link>

          {/* Quản lý chi tiêu */}
          <div>
            <button
              className="flex items-center justify-between w-full px-3 py-2 font-semibold transition rounded-lg hover:bg-purple-200 hover:text-purple-700"
              onClick={() => setExpenseMenuOpen(!expenseMenuOpen)}
            >
              <div className="flex items-center gap-2">
                <Wallet size={18} />
                <span>Quản lý chi tiêu</span>
              </div>
              {expenseMenuOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expenseMenuOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="flex flex-col gap-2 mt-2 ml-6">
                <Link to="/user/expense" className="flex items-center gap-2 px-2 py-1 transition rounded-lg hover:bg-red-100 hover:text-red-600">
                  <CircleMinus size={16} className="text-red-500" /> Tiền Chi
                </Link>
                <Link to="/user/income" className="flex items-center gap-2 px-2 py-1 transition rounded-lg hover:bg-green-100 hover:text-green-600">
                  <CirclePlus size={16} className="text-green-600" /> Tiền Thu
                </Link>
              </div>
            </div>
          </div>

          <Link to="/user/transactions" className="flex items-center gap-2 px-3 py-2 transition rounded-lg hover:bg-orange-100 hover:text-orange-500">
            <ListTodo size={18} className="text-orange-500" /> Báo Cáo
          </Link>

          <Link to="/user/profile" className="flex items-center gap-2 px-3 py-2 transition rounded-lg hover:bg-gray-100 hover:text-gray-700">
            <User size={18} className="text-gray-600" /> Thông Tin Cá Nhân
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 md:ml-0">
        {/* Topbar */}
        <div className="flex items-center justify-between p-4 text-white shadow-xl bg-gradient-to-r from-purple-400 to-purple-600 rounded-b-2xl">
          {/* Mobile menu button */}
          <button className="text-xl font-bold text-white transition md:hidden hover:text-yellow-200" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>

          {/* User info */}
        {/* User info */}
<div className="flex items-center gap-3 font-semibold">
  <div className="flex items-center justify-center w-10 h-10 text-white bg-purple-700 rounded-full shadow-lg">
    {user.name.charAt(0).toUpperCase()}
  </div>
  <span className="text-sm text-white md:text-base">Xin chào, {user.name}!</span>
</div>


          {/* Action icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 transition rounded-full hover:bg-purple-500/30"><Bell size={20} /></button>
            <button className="p-2 transition rounded-full hover:bg-purple-500/30"><Phone size={20} /></button>
            <button className="p-2 transition rounded-full hover:bg-purple-500/30"><Info size={20} /></button>
            <button className="px-4 py-2 text-white transition-transform transform bg-purple-700 rounded-lg shadow-lg hover:bg-purple-800 hover:scale-105" onClick={handleLogout}>
              Đăng Xuất
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 overflow-auto transition-all duration-300 shadow-inner bg-gradient-to-b from-gray-50 to-gray-200 rounded-t-2xl">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
