"use client";

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
  LineChart,
  Line,
 
} from "recharts";

import {
  Wallet,
  Utensils,
  Shirt,
  ShoppingCart,
  Car,
  Home,
  Calendar,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import { useEffect, useState, FC } from "react";
import { getTransactions } from "../../api/transaction";

// ===== KIỂU DỮ LIỆU =====
interface PieItem {
  name: string;
  value: number;
  color: string;
  icon: FC<any>;
}

interface BarItem {
  name: string;
  income: number;
  expense: number;
}

interface DailyItem {
  date: string;
  income: number;
  expense: number;
}

// ===== MÀU & ICON =====
const INCOME_COLORS = ["#4CAF50", "#81C784", "#388E3C", "#66BB6A", "#1B5E20"];
const EXPENSE_COLORS = ["#F44336", "#E57373", "#D32F2F", "#EF5350", "#B71C1C"];
const ICONS: Record<string, FC<any>> = {
  "Ăn uống": Utensils,
  "Mua sắm": ShoppingCart,
  "Quần áo": Shirt,
  "Đi lại": Car,
  "Nhà cửa": Home,
};

// ===== CHUYỂN ĐỔI NGÀY/THÁNG =====
const formatMonthVN = (value: string) => {
  const [year, month] = value.split("-");
  return `Tháng ${Number(month)}/${year}`;
};

const formatDayVN = (value: string) => {
  const d = new Date(value);
  return `${d.getDate()}/${d.getMonth() + 1}`;
};

const UserDashboard = () => {
  const [userName, setUserName] = useState("User");
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const [incomePie, setIncomePie] = useState<PieItem[]>([]);
  const [expensePie, setExpensePie] = useState<PieItem[]>([]);
  const [barData, setBarData] = useState<BarItem[]>([]);
  const [dailyData, setDailyData] = useState<DailyItem[]>([]);
  const [topExpenses, setTopExpenses] = useState<PieItem[]>([]);
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
    incomeChange: 0,
    expenseChange: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserName(payload.name || "User");
    }
  }, []);

  const sumByCategory = (arr: any[], type: "income" | "expense") => {
    const map: Record<string, number> = {};
    arr.forEach((t) => {
      const key = t.category?.name || "Khác";
      map[key] = (map[key] || 0) + Number(t.amount || 0);
    });

    const colors = type === "income" ? INCOME_COLORS : EXPENSE_COLORS;

    return Object.entries(map)
      .map(([name, value], idx) => ({
        name,
        value: Number(value),
        color: colors[idx % colors.length],
        icon: ICONS[name] || Utensils,
      }))
      .sort((a, b) => b.value - a.value);
  };

  const loadData = async () => {
    if (!selectedMonth) return;
    try {
      const incomes = await getTransactions("income", selectedMonth);
      const expenses = await getTransactions("expense", selectedMonth);

      setIncomePie(sumByCategory(incomes, "income"));
      setExpensePie(sumByCategory(expenses, "expense"));

      const totalIncome = incomes.reduce((sum: number, t: { amount: any }) => sum + Number(t.amount || 0), 0);
      const totalExpense = expenses.reduce((sum: number, t: { amount: any }) => sum + Number(t.amount || 0), 0);
      setBarData([{ name: formatMonthVN(selectedMonth), income: totalIncome, expense: totalExpense }]);

      setSummary({
        income: totalIncome,
        expense: totalExpense,
        balance: totalIncome - totalExpense,
        incomeChange: 5,
        expenseChange: -2,
      });

      const mapDaily: Record<string, { income: number; expense: number }> = {};
      [...incomes, ...expenses].forEach((t) => {
        const date = t.date.slice(0, 10);
        if (!mapDaily[date]) mapDaily[date] = { income: 0, expense: 0 };
        if (t.type === "income") mapDaily[date].income += Number(t.amount || 0);
        else mapDaily[date].expense += Number(t.amount || 0);
      });
      const dailyArray = Object.entries(mapDaily)
        .map(([date, val]) => ({ date, ...val }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setDailyData(dailyArray);

      setTopExpenses(sumByCategory(expenses, "expense").slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedMonth]);

  return (
    <div className="w-full min-h-screen p-6 bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Wallet size={34} className="text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Trang chủ</h1>
            <p className="text-gray-500">Xin chào, {userName} 👋</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Calendar size={20} className="text-purple-600" />
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
        <div className="flex items-center justify-between p-4 transition-transform transform shadow-lg bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 rounded-xl hover:scale-105">
          <div>
            <p className="font-medium text-gray-700">Tổng thu</p>
            <h3 className="text-xl font-bold text-purple-800">{summary.income.toLocaleString()} ₫</h3>
          </div>
          <div className="flex items-center text-green-600">
            <ArrowUp size={20} />
            <span>{summary.incomeChange}%</span>
          </div>
        </div>

        <div
          className={`flex items-center justify-between p-4 bg-gradient-to-br from-red-100 via-red-200 to-red-300 shadow-lg rounded-xl transition-transform transform hover:scale-105 ${
            summary.expenseChange >= 0 ? "text-red-700" : "text-green-600"
          }`}
        >
          <div>
            <p className="font-medium text-gray-700">Tổng chi</p>
            <h3 className="text-xl font-bold text-red-800">{summary.expense.toLocaleString()} ₫</h3>
          </div>
          <div className="flex items-center">
            {summary.expenseChange >= 0 ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
            <span>{Math.abs(summary.expenseChange)}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 transition-transform transform shadow-lg bg-gradient-to-br from-green-100 via-green-200 to-green-300 rounded-xl hover:scale-105">
          <div>
            <p className="font-medium text-gray-700">Số dư</p>
            <h3 className="text-xl font-bold text-green-800">{summary.balance.toLocaleString()} ₫</h3>
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="p-6 mb-6 bg-white shadow-lg rounded-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">Xu hướng thu & chi theo ngày</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyData}>
            <XAxis dataKey="date" tickFormatter={formatDayVN} />
            <YAxis tickFormatter={(v) => v.toLocaleString()} />
            <Tooltip formatter={(v: number) => `${v.toLocaleString()} ₫`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#4CAF50"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#F44336"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Expenses */}
      <div className="p-6 mb-6 bg-white shadow-lg rounded-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">Danh mục chi tiêu nổi bật</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {topExpenses.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center p-3 transition-transform transform rounded-lg shadow-md bg-gradient-to-br from-white via-gray-50 to-gray-100 hover:scale-105 hover:shadow-lg"
              >
                <div
                  className="p-2 transition-colors duration-300 rounded-full"
                  style={{ backgroundColor: item.color + "33" }}
                >
                  <Icon size={28} color={item.color} />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-700">{item.name}</p>
                <p className="text-sm font-bold text-gray-900">{item.value.toLocaleString()} ₫</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
        {/* Thu */}
        <div className="p-6 bg-white shadow-lg rounded-xl">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Biểu đồ thu</h2>
          {incomePie.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomePie as any}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  paddingAngle={4}
                  isAnimationActive={true}
                >
                  {incomePie.map((item, idx) => (
                    <Cell key={idx} fill={item.color} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v.toLocaleString()} ₫`} />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  formatter={(value, entry, index) => <span style={{ color: incomePie[index].color }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>Không có dữ liệu thu</p>
          )}
        </div>

        {/* Chi */}
        <div className="p-6 bg-white shadow-lg rounded-xl">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Biểu đồ chi</h2>
          {expensePie.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensePie as any}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  paddingAngle={4}
                  isAnimationActive={true}
                >
                  {expensePie.map((item, idx) => (
                    <Cell key={idx} fill={item.color} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v.toLocaleString()} ₫`} />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  formatter={(value, entry, index) => <span style={{ color: expensePie[index].color }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>Không có dữ liệu chi</p>
          )}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="p-6 bg-white shadow-lg rounded-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">Biểu đồ thu & chi</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={barData}>
  <defs>
    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#4CAF50" stopOpacity={0.9} />
      <stop offset="100%" stopColor="#81C784" stopOpacity={0.6} />
    </linearGradient>
    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#F44336" stopOpacity={0.9} />
      <stop offset="100%" stopColor="#EF5350" stopOpacity={0.6} />
    </linearGradient>
  </defs>
  <XAxis dataKey="name" />
  <YAxis tickFormatter={(v) => v.toLocaleString()} />
  <Tooltip formatter={(v: number) => `${v.toLocaleString()} ₫`} />
  <Legend />
  <Bar dataKey="income" name="Thu" fill="url(#incomeGradient)" radius={[5, 5, 0, 0]} />
  <Bar dataKey="expense" name="Chi" fill="url(#expenseGradient)" radius={[5, 5, 0, 0]} />
</BarChart>

        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserDashboard;
