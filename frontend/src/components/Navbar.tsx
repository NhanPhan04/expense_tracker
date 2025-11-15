import { useNavigate } from "react-router-dom";

interface NavbarProps {
  userName: string;
}

const Navbar = ({ userName }: NavbarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Ghi nhớ dữ liệu user trước khi logout
    const userData = JSON.parse(localStorage.getItem("dashboardState") || "{}");

    // Lưu vào localStorage tạm, dùng khi login lại
    localStorage.setItem("lastUserState", JSON.stringify(userData));

    // Xóa token
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between p-4 text-white bg-gray-800">
      <div className="text-xl font-bold">Expense Tracker</div>
      <div className="flex items-center gap-4">
        <span>{userName}</span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
