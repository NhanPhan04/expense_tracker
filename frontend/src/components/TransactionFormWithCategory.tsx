import { useEffect, useState } from "react";
import { getCategories } from "../api/category";
import { createTransaction } from "../api/transaction";
import CategoryManager from "./CategoryManager";

// Hàm format số tiền
const formatMoney = (num: number) =>
  num.toLocaleString("vi-VN", { minimumFractionDigits: 0 });

type Props = { type: "income" | "expense" };

export default function TransactionFormWithCategory({ type }: Props) {
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState<number | string>("");
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const loadCategories = () => getCategories(type).then(setCategories);

  useEffect(() => {
    loadCategories();
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amt = Number(amount);

    // Validate
    if (!date) return alert("Chọn ngày");
    if (!categoryId) return alert("Chọn danh mục");
    if (!amt || amt <= 0) return alert("Nhập số tiền hợp lệ");

    try {
      await createTransaction({ date, note, amount: amt, type, categoryId });
      alert("Nhập giao dịch thành công!");
      setDate(""); setNote(""); setAmount(""); setCategoryId(null);
      loadCategories(); // reload danh mục nếu cần
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu giao dịch");
    }
  };

  return (
  <div className="max-w-md p-6 mx-auto space-y-4 bg-white border border-gray-200 shadow-lg rounded-2xl">
  <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <label className="block mb-1 font-medium text-gray-700">Ngày</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
      />
    </div>

    <div>
      <label className="block mb-1 font-medium text-gray-700">Ghi chú</label>
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Ghi chú"
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
      />
    </div>

    <div>
      <label className="block mb-1 font-medium text-gray-700">Số tiền</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Số tiền"
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
      />
      {amount && Number(amount) > 0 && (
        <div className="mt-1 text-gray-500">{formatMoney(Number(amount))} VND</div>
      )}
    </div>

    <div>
      <label className="block mb-1 font-medium text-gray-700">Danh mục</label>
      <div className="flex gap-2">
        <select
          value={categoryId ?? ""}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
        >
          <option value="">Chọn danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button
          type="button"
          className="px-3 py-1 font-semibold text-purple-700 transition bg-purple-100 rounded-lg hover:bg-purple-200"
          onClick={() => setShowCategoryManager(!showCategoryManager)}
        >
          Chỉnh sửa
        </button>
      </div>
    </div>

    {showCategoryManager && <CategoryManager type={type} onChange={loadCategories} />}

    <button
      type="submit"
      className={`w-full py-2 text-white font-semibold rounded-lg shadow hover:shadow-lg transition-transform transform hover:scale-105 ${
        type === "income" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
      }`}
    >
      {type === "income" ? "Nhập khoản thu" : "Nhập khoản chi"}
    </button>
  </form>
</div>

  );
}
