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
    <div>
       <Navbar userName={userName} />
      <div className="p-8">
        <h1 className="text-2xl font-bold">Trang chủ User</h1>
        {/* Các component dashboard khác */}
      </div>
    </div>
  );
};

export default UserDashboard;
