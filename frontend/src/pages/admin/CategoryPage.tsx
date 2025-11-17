// src/pages/admin/CategoryPage.tsx
import { useState, useEffect, ChangeEvent } from "react";
import api from "../../api/auth"; // axios instance
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Category {
  id: number;
  name: string;
  type: "income" | "expense";
  total: number; // tổng tiền
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#ffc0cb",
  "#b19cd9",
  "#ffbb28",
];

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState<string>(""); // lọc theo tháng
  const [year, setYear] = useState<string>("");   // lọc theo năm

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryType, setNewCategoryType] = useState<"income" | "expense">("expense");

  // fetch dữ liệu từ API
  const fetchCategories = async () => {
    try {
      const res = await api.get("/category", {
        params: { month, year },
      });
      const data: Category[] = res.data.data.map((c: any) => ({
        ...c,
        total: c.total || 0,
      }));
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [month, year]);

  // thêm danh mục mới
  const handleAdd = async () => {
    if (!newCategoryName) return alert("Nhập tên danh mục!");
    try {
      await api.post("/category", {
        name: newCategoryName,
        type: newCategoryType,
      });
      setNewCategoryName("");
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  // xóa danh mục
  const handleDelete = async (id: number) => {
    if (!confirm("Xác nhận xóa danh mục này?")) return;
    try {
      await api.delete(`/category/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  // filter tìm kiếm
  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // chuẩn bị dữ liệu PieChart
  const incomeChartData = filteredCategories
    .filter(c => c.type === "income")
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
    .map(c => ({ name: c.name, value: c.total }));

  const expenseChartData = filteredCategories
    .filter(c => c.type === "expense")
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
    .map(c => ({ name: c.name, value: c.total }));

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold text-center">
        Quản Lý Danh Mục
      </h1>

      {/* Lọc tháng/năm */}
      <div className="flex gap-4 mb-4">
        <input
          type="month"
          value={month && year ? `${year}-${month}` : ""}
          onChange={(e) => {
            const [y, m] = e.target.value.split("-");
            setYear(y);
            setMonth(m);
          }}
          className="px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
      </div>

      {/* Thêm danh mục */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Tên danh mục"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
        <select
          value={newCategoryType}
          onChange={(e) =>
            setNewCategoryType(e.target.value as "income" | "expense")
          }
          className="px-3 py-2 border rounded"
        >
          <option value="income">Thu</option>
          <option value="expense">Chi</option>
        </select>
        <button
          onClick={handleAdd}
          className="px-4 py-2 font-semibold text-white bg-green-500 rounded hover:bg-green-600"
        >
          Thêm
        </button>
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="p-4 border rounded shadow">
          <h2 className="mb-2 text-lg font-semibold">Top 10 Thu</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incomeChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {incomeChartData.map((entry, index) => (
                  <Cell
                    key={`cell-income-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 border rounded shadow">
          <h2 className="mb-2 text-lg font-semibold">Top 10 Chi</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {expenseChartData.map((entry, index) => (
                  <Cell
                    key={`cell-expense-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Danh sách danh mục */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Tên</th>
            <th className="px-4 py-2 border">Loại</th>
            <th className="px-4 py-2 border">Tổng tiền</th>
            <th className="px-4 py-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((c) => (
            <tr key={c.id}>
              <td className="px-4 py-2 border">{c.name}</td>
              <td className="px-4 py-2 border">{c.type === "income" ? "Thu" : "Chi"}</td>
              <td className="px-4 py-2 border">{c.total}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleDelete(c.id)}
                  className="px-2 py-1 mr-2 text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
