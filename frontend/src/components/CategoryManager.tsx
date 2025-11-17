// src/components/CategoryManager.tsx
import { useEffect, useState } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../api/category";

type Props = {
  type: "income" | "expense";
  onChange?: () => void; // gọi khi danh mục thay đổi để refresh dropdown
};

export default function CategoryManager({ type, onChange }: Props) {
  const [categories, setCategories] = useState<any[]>([]);
  const [newName, setNewName] = useState("");

  const load = () => getCategories(type).then(setCategories);

  useEffect(() => {
    load();
  }, [type]);

  const handleAdd = async () => {
    if (!newName) return alert("Nhập tên danh mục");
    await createCategory({ name: newName, type });
    setNewName("");
    load();
    onChange?.();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa?")) {
      await deleteCategory(id);
      load();
      onChange?.();
    }
  };

  return (
   <div className="p-3 mt-2 border rounded-lg bg-purple-50">
  <h3 className="mb-2 font-semibold text-purple-700">Quản lý danh mục</h3>
  <div className="flex gap-2 mb-2">
    <input
      type="text"
      value={newName}
      onChange={(e) => setNewName(e.target.value)}
      placeholder="Tên danh mục"
      className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
    />
    <button onClick={handleAdd} className="px-3 py-1 text-white transition bg-purple-500 rounded-lg hover:bg-purple-600">
      Thêm
    </button>
  </div>
  <ul className="space-y-1 overflow-auto max-h-40">
    {categories.map((c) => (
      <li key={c.id} className="flex items-center justify-between p-2 transition bg-white rounded-lg shadow-sm hover:shadow-md">
        <span>{c.name}</span>
        <button onClick={() => handleDelete(c.id)} className="px-2 text-red-500 transition hover:text-red-600">Xóa</button>
      </li>
    ))}
  </ul>
</div>

  );
}
