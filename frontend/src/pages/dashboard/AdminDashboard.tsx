import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

const AdminDashboard = () => {
  const [userName, setUserName] = useState("Admin");

  // Lấy dữ liệu trước đó từ localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserName(payload.name || "Admin");
    }

    const savedState = localStorage.getItem("lastUserState");
    if (savedState) {
      console.log("📝 Khôi phục trạng thái trước đó:", JSON.parse(savedState));
      // Xóa sau khi load
      localStorage.removeItem("lastUserState");
    }
  }, []);

 return (
    <div className="bg-white shadow rounded p-6 min-h-[85vh]">
      <h1 className="mb-4 text-2xl font-bold">Trang chủ Admin</h1>
      <p>Chào mừng, <span className="font-semibold">{userName}</span>!</p>
    </div>
  );
};
export default AdminDashboard;
