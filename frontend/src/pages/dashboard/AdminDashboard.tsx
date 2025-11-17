import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import api from "../../api/auth";

interface TopUser {
  name: string;
  totalIncome: number;
  totalExpense: number;
}

interface CategoryAmount {
  name: string;
  totalAmount: number;
  [key: string]: any; // ✅ thêm dòng này
}


interface MonthlyTransaction {
  month: string;
  income: number;
  expense: number;
}

interface UserGrowth {
  month: string;
  count: number;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#ffbb28", "#8dd1e1"];

const AdminDashboard = () => {
  const [userName, setUserName] = useState("Admin");

  const [userGrowth, setUserGrowth] = useState<UserGrowth[]>([]);
  const [monthlyTransactions, setMonthlyTransactions] = useState<MonthlyTransaction[]>([]);
  const [topExpenseCategories, setTopExpenseCategories] = useState<CategoryAmount[]>([]);
  const [topIncomeCategories, setTopIncomeCategories] = useState<CategoryAmount[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);

  // Lấy user từ token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserName(payload.name || "Admin");
    }
  }, []);

  // Lấy dữ liệu dashboard từ API
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        const data = res.data.data;

        setUserGrowth(data.userGrowth || []);
        setMonthlyTransactions(data.monthlyTransactions || []);
        setTopExpenseCategories(data.topExpenseCategories || []);
        setTopIncomeCategories(data.topIncomeCategories || []);
        setTopUsers(data.topUsers || []);
      } catch (err) {
        console.error("Lỗi khi load dashboard:", err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-purple-100 via-white to-blue-100">
      <h1 className="mb-6 text-3xl font-bold text-gray-700">Trang chủ Admin</h1>
      <p className="mb-8 text-lg text-gray-600">Chào mừng, <span className="font-semibold">{userName}</span>!</p>

      {/* Biểu đồ tăng trưởng user */}
      <div className="p-4 mb-6 bg-white rounded shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">Tăng trưởng người dùng theo tháng</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={userGrowth}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ tròn chi/thu theo danh mục */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Danh mục chi nhiều nhất</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={topExpenseCategories}
                dataKey="totalAmount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#ff7f50"
                label
              >
                {topExpenseCategories.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Danh mục thu nhiều nhất</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={topIncomeCategories}
                dataKey="totalAmount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#82ca9d"
                label
              >
                {topIncomeCategories.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Danh sách top user */}
      <div className="p-4 bg-white rounded shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">Top user chi & thu nhiều nhất</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-collapse border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Tên User</th>
                <th className="px-4 py-2 border">Tổng Thu</th>
                <th className="px-4 py-2 border">Tổng Chi</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((user, idx) => (
                <tr key={idx} className="even:bg-yellow-50">
                  <td className="px-4 py-2 border">{user.name}</td>
                  <td className="px-4 py-2 border">{user.totalIncome}</td>
                  <td className="px-4 py-2 border">{user.totalExpense}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
