import api from './auth';

// Tạo giao dịch
export const createTransaction = (data: any) =>
  api.post('/transactions', data).then(res => res.data);

// Lấy danh sách giao dịch
export const getTransactions = async (type: "income" | "expense", month?: string) => {
  const res = await api.get(`/transactions`, { params: { type, month } });
  return res.data;
};

// Lấy giao dịch theo ID
export const getTransactionById = (id: number) =>
  api.get(`/transactions/${id}`).then(res => res.data);

// Cập nhật giao dịch
export const updateTransaction = (id: number, data: any) =>
  api.put(`/transactions/${id}`, data).then(res => res.data);

// Xóa giao dịch
export const deleteTransaction = (id: number) =>
  api.delete(`/transactions/${id}`).then(res => res.data);
