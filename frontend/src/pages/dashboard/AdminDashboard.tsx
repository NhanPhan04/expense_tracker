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
    <div>
      <Navbar userName={userName} />
      <div className="p-8">
        <h1 className="text-2xl font-bold">Trang chủ Admin</h1>
        {/* Các component dashboard khác */}
      </div>
    </div>
  );
};

export default AdminDashboard;
