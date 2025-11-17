"use client";

import { useState, useEffect } from "react";
import { getTransactions } from "../../api/transaction";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { Utensils, ShoppingCart, Car, Home, Shirt } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

// Kiểu dữ liệu
interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: number;
  date: string;
  category?: { name: string };
  note?: string;
}

interface PieItem {
  name: string;
  value: number;
  color: string;
  [key: string]: any;   // <--- FIX QUAN TRỌNG
}


const EXPENSE_COLORS = ["#F44336", "#E57373", "#D32F2F", "#EF5350", "#B71C1C"];
const INCOME_COLORS = ["#4CAF50", "#81C784", "#388E3C", "#66BB6A", "#1B5E20"];

const ICONS: Record<string, any> = {
  "Ăn uống": Utensils,
  "Mua sắm": ShoppingCart,
  "Đi lại": Car,
  "Nhà cửa": Home,
  "Quần áo": Shirt,
};

const TransactionsPage = () => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [incomePie, setIncomePie] = useState<PieItem[]>([]);
  const [expensePie, setExpensePie] = useState<PieItem[]>([]);
  const [dailyData, setDailyData] = useState<{ date: string; income: number; expense: number }[]>([]);
  
  // Tổng thu, chi, số dư
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });

  useEffect(() => {
    loadTransactions();
  }, [month]);

  const loadTransactions = async () => {
    try {
      const incomes = await getTransactions("income", month);
      const expenses = await getTransactions("expense", month);

      const all: Transaction[] = [...incomes, ...expenses];
      setTransactions(all);

      // Pie chart
      const sumByCategory = (arr: Transaction[], type: "income" | "expense") => {
        const map: Record<string, number> = {};
        arr.forEach((t) => {
          const key = t.category?.name || "Khác";
          map[key] = (map[key] || 0) + Number(t.amount || 0);
        });
        const colors = type === "income" ? INCOME_COLORS : EXPENSE_COLORS;
        return Object.entries(map).map(([name, value], idx) => ({
          name,
          value,
          color: colors[idx % colors.length],
        }));
      };

      setIncomePie(sumByCategory(incomes, "income"));
      setExpensePie(sumByCategory(expenses, "expense"));

      // Tính tổng thu/chi
      const totalIncome = incomes.reduce((sum: number, t: { amount: any; }) => sum + Number(t.amount), 0);
      const totalExpense = expenses.reduce((sum: number, t: { amount: any; }) => sum + Number(t.amount), 0);
      setSummary({
        income: totalIncome,
        expense: totalExpense,
        balance: totalIncome - totalExpense,
      });

      // Line chart daily
      const mapDaily: Record<string, { income: number; expense: number }> = {};
      all.forEach((t) => {
        const date = t.date.slice(0, 10);
        if (!mapDaily[date]) mapDaily[date] = { income: 0, expense: 0 };
        if (t.type === "income") mapDaily[date].income += t.amount;
        else mapDaily[date].expense += t.amount;
      });

      const dailyArray = Object.entries(mapDaily)
        .map(([date, val]) => ({ date, ...val }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setDailyData(dailyArray);
    } catch (err) {
      console.error(err);
    }
  };

 return (
  <div className="min-h-screen p-6 bg-gradient-to-br from-gray-100 to-gray-200">
    <h1 className="mb-6 text-3xl font-bold text-gray-800">📊 Báo Cáo Giao Dịch</h1>

    {/* Tổng thu / chi / số dư */}
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
      {/* Tổng thu */}
      <div className="p-5 transition shadow-lg cursor-pointer bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-xl hover:scale-105">
        <p className="font-medium text-green-600">Tổng Thu</p>
        <p className="text-2xl font-bold text-green-700">{formatCurrency(summary.income)}</p>
      </div>

      {/* Tổng chi */}
      <div className="p-5 transition shadow-lg cursor-pointer bg-gradient-to-br from-red-50 to-red-100 rounded-xl hover:shadow-xl hover:scale-105">
        <p className="font-medium text-red-600">Tổng Chi</p>
        <p className="text-2xl font-bold text-red-700">{formatCurrency(summary.expense)}</p>
      </div>

      {/* Số dư */}
      <div className="p-5 transition shadow-lg cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-xl hover:scale-105">
        <p className="font-medium text-blue-600">Số Dư</p>
        <p className="text-2xl font-bold text-blue-700">{formatCurrency(summary.balance)}</p>
      </div>
    </div>

    {/* Bộ lọc tháng */}
    <div className="flex items-center gap-3 mb-8">
      <label className="text-lg font-semibold">Chọn tháng:</label>
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
      />
    </div>

    {/* Biểu đồ Pie */}
    <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
      {/* Income Pie */}
      <div className="p-5 transition bg-white shadow-lg rounded-xl hover:shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">📈 Thu theo danh mục</h2>
        {incomePie.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={incomePie} dataKey="value" outerRadius={90}>
                {incomePie.map((item, idx) => (
                  <Cell key={idx} fill={item.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>Không có dữ liệu</p>
        )}
      </div>

      {/* Expense Pie */}
      <div className="p-5 transition bg-white shadow-lg rounded-xl hover:shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">📉 Chi theo danh mục</h2>
        {expensePie.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={expensePie} dataKey="value" outerRadius={90}>
                {expensePie.map((item, idx) => (
                  <Cell key={idx} fill={item.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>Không có dữ liệu</p>
        )}
      </div>
    </div>

    {/* Line chart */}
    <div className="p-5 mb-8 transition bg-white shadow-lg rounded-xl hover:shadow-xl">
      <h2 className="mb-4 text-xl font-semibold text-gray-700">
        📆 Xu hướng thu & chi theo ngày
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={dailyData}>
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(v) => v.toLocaleString()} />
          <Tooltip formatter={(v: number) => formatCurrency(v)} />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#4CAF50" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="expense" stroke="#F44336" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* Table */}
    <div className="p-5 bg-white shadow-lg rounded-xl">
      <h2 className="mb-4 text-xl font-semibold text-gray-700">📄 Chi tiết giao dịch</h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Ngày</th>
              <th className="px-4 py-2 border">Loại</th>
              <th className="px-4 py-2 border">Danh mục</th>
              <th className="px-4 py-2 border">Số tiền</th>
              <th className="px-4 py-2 border">Ghi chú</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t) => (
              <tr
                key={t.id}
                className="transition cursor-pointer hover:bg-orange-50"
              >
                <td className="px-4 py-2 border">{t.date.slice(0, 10)}</td>
                <td
                  className={`px-4 py-2 border font-semibold ${
                    t.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {t.type === "income" ? "Thu" : "Chi"}
                </td>
                <td className="px-4 py-2 border">{t.category?.name || "Khác"}</td>
                <td className="px-4 py-2 border">{formatCurrency(t.amount)}</td>
                <td className="px-4 py-2 border">{t.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

};

export default TransactionsPage;
