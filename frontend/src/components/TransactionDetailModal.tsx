import { useEffect, useState } from "react";
import { getTransactionById, updateTransaction, deleteTransaction } from "../api/transaction";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../api/category";

type Props = {
  txId: number;
  type: "income" | "expense";
  onClose: () => void;
  onUpdated: () => void;
};

export default function TransactionDetailModal({ txId, type, onClose, onUpdated }: Props) {
  const [tx, setTx] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({ amount: 0, date: "", note: "", categoryId: 0 });
  const [newCatName, setNewCatName] = useState("");

  const loadTx = async () => {
    if (!txId) return;
    const data = await getTransactionById(txId);
    setTx(data);
    setForm({
      amount: Number(data.amount),
      date: data.date.split("T")[0],
      note: data.note || "",
      categoryId: data.category?.id || 0,
    });
  };

  const loadCategories = async () => {
    const cats = await getCategories(type);
    setCategories(cats);
  };

  useEffect(() => {
    loadTx();
    loadCategories();
  }, [txId, type]);

  const handleSave = async () => {
    if (!form.amount || form.amount <= 0) return alert("Số tiền phải lớn hơn 0!");
    await updateTransaction(tx.id, form);
    onUpdated();
    onClose();
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc muốn xóa giao dịch này?")) return;
    await deleteTransaction(tx.id);
    onUpdated();
    onClose();
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    const cat = await createCategory({ name: newCatName, type });
    setCategories([...categories, cat]);
    setNewCatName("");
    setForm({ ...form, categoryId: cat.id });
  };

  const handleDeleteCategory = async (catId: number) => {
    if (!confirm("Xóa danh mục này?")) return;
    await deleteCategory(catId);
    setCategories(categories.filter((c) => c.id !== catId));
    if (form.categoryId === catId) setForm({ ...form, categoryId: 0 });
  };

  const handleUpdateCategory = async (catId: number) => {
    const newName = prompt("Tên mới danh mục:");
    if (!newName) return;
    const updated = await updateCategory(catId, { name: newName });
    setCategories(categories.map((c) => (c.id === catId ? updated : c)));
  };

  if (!tx) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative p-6 bg-white rounded w-96 max-h-[90vh] overflow-auto">
        <button className="absolute text-gray-500 top-2 right-2 hover:text-gray-700" onClick={onClose}>✕</button>
        <h2 className="mb-4 text-lg font-semibold">Chi tiết giao dịch</h2>

        <div className="space-y-2">
          <div>
            <label className="block text-sm">Số tiền:</label>
            <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm">Ngày:</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm">Ghi chú:</label>
            <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm">Danh mục:</label>
            <select className="w-full p-2 border rounded" value={form.categoryId || ""} onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}>
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <div className="flex gap-2 mt-2">
              <input type="text" placeholder="Thêm danh mục mới" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} className="flex-1 p-2 border rounded" />
              <button type="button" className="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-600" onClick={handleAddCategory}>Thêm</button>
            </div>

            <div className="mt-2 space-y-1">
              {categories.map((c) => (
                <div key={c.id} className="flex items-center justify-between text-sm">
                  <span>{c.name}</span>
                  <div className="flex gap-1">
                    <button className="px-1 text-blue-500 hover:underline" onClick={() => handleUpdateCategory(c.id)}>Sửa</button>
                    <button className="px-1 text-red-500 hover:underline" onClick={() => handleDeleteCategory(c.id)}>Xóa</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={onClose}>Hủy</button>
          <button className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600" onClick={handleDelete}>Xóa giao dịch</button>
          <button className="px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600" onClick={handleSave}>Lưu</button>
        </div>
      </div>
    </div>
  );
}
