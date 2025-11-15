import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

const UserDashboard = () => {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserName(payload.name || "User");
    }

    const savedState = localStorage.getItem("lastUserState");
    if (savedState) {
      console.log("📝 Khôi phục trạng thái trước đó:", JSON.parse(savedState));
      localStorage.removeItem("lastUserState");
    }
  }, []);

   return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Nội dung trang */}
      <div className="max-w-6xl p-8 mx-auto">
        <h1 className="mb-4 text-3xl font-bold">Trang chủ User</h1>

        {/* Dashboard content */}
        <div className="p-6 bg-white shadow-md rounded-xl">
          <p className="text-gray-700">
            Chào mừng bạn trở lại, <span className="font-semibold">{userName}</span>!
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;