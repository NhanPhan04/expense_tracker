import { useEffect, useState } from "react";
import { getTransactions, updateTransaction, deleteTransaction } from "../api/transaction";

type Props = { type: "income" | "expense" };

const formatMoney = (num: number) =>
  num.toLocaleString("vi-VN", { minimumFractionDigits: 0 });

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "2-digit", day: "2-digit" };
  return d.toLocaleDateString("vi-VN", options);
};

export default function TransactionTable({ type }: Props) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ note: "", amount: 0, date: "" });

  const loadTransactions = () => getTransactions(type, month).then(setTransactions);

  useEffect(() => {
    loadTransactions();
  }, [type, month]);

 // Tổng tiền
const total = transactions.reduce(
  (sum, t) => sum + Number(t.amount || 0), // ép sang number
  0
);


  const openEdit = (tx: any) => {
    setSelectedTx(tx);
    setEditForm({ note: tx.note || "", amount: tx.amount, date: tx.date.split("T")[0] });
  };

  const handleSave = async () => {
    if (!editForm.amount || editForm.amount <= 0) {
      alert("Số tiền phải lớn hơn 0!");
      return;
    }
    try {
      const updated = await updateTransaction(selectedTx.id, editForm);
      setTransactions((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
      setSelectedTx(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) return;
    try {
      await deleteTransaction(selectedTx.id);
      setTransactions((prev) => prev.filter((t) => t.id !== selectedTx.id));
      setSelectedTx(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Có lỗi xảy ra khi xóa!");
    }
  };

  return (
    <div className="p-4 mt-6 bg-white rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
  {type === "income" ? "Tổng thu nhập" : "Tổng chi tiêu"}: {formatMoney(total)} VND
</h2>

        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

     <table className="w-full overflow-hidden border-collapse rounded-lg shadow-sm">
  <thead className="bg-purple-100">
    <tr>
      <th className="p-3 text-left text-purple-700">Danh mục</th>
      <th className="p-3 text-left text-purple-700">Ghi chú</th>
      <th className="p-3 text-left text-purple-700">Ngày</th>
      <th className="p-3 text-left text-purple-700">Số tiền</th>
      <th className="p-3 text-left text-purple-700">Chi tiết</th>
    </tr>
  </thead>
  <tbody>
    {transactions.map((t) => (
      <tr key={t.id} className="transition hover:bg-purple-50">
        <td className="p-2 border-b">{t.category?.name}</td>
        <td className="p-2 border-b">{t.note}</td>
        <td className="p-2 border-b">{formatDate(t.date)}</td>
        <td className={`p-2 border-b font-semibold ${type === "income" ? "text-green-600" : "text-red-600"}`}>
          {formatMoney(Number(t.amount || 0))} VND
        </td>
        <td className="p-2 border-b">
          <button
            className="px-2 py-1 text-white transition bg-purple-500 rounded-lg hover:bg-purple-600"
            onClick={() => openEdit(t)}
          >
            Xem
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


      {/* Modal chi tiết */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative p-6 bg-white rounded w-96">
            <button
              className="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
              onClick={() => setSelectedTx(null)}
            >
              ✕
            </button>
            <h2 className="mb-4 text-lg font-semibold">Chi tiết giao dịch</h2>

            <div className="space-y-2">
              <div>
                <label className="block text-sm">Số tiền:</label>
                <input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm">Ngày:</label>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm">Ghi chú:</label>
                <textarea
                  value={editForm.note}
                  onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setSelectedTx(null)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600"
                onClick={handleSave}
              >
                Lưu
              </button>
              <button
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                onClick={handleDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
