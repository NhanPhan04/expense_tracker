import api from "./auth"; // dùng cùng axios instance đã có interceptor JWT

// Lấy danh mục theo type ('income' | 'expense')
export const getCategories = async (type: "income" | "expense") => {
  try {
    const res = await api.get(`/categories?type=${type}`);
    return res.data; // [{id, name, type, user:{id,...} | null}]
  } catch (err) {
    console.error("Lỗi load categories:", err);
    return [];
  }
};

// Tạo danh mục mới
export const createCategory = async (data: { name: string; type: "income" | "expense" }) => {
  const res = await api.post("/categories", data);
  return res.data;
};

// Cập nhật danh mục
export const updateCategory = async (id: number, data: { name: string }) => {
  const res = await api.put(`/categories/${id}`, data);
  return res.data;
};

// Xóa danh mục
export const deleteCategory = async (id: number) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};
