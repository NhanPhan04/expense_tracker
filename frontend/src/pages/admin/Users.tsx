import React, { useEffect, useState } from "react";
import api from "../../api/auth";
import { FaSearch, FaEdit, FaTrash, FaKey, FaFilePdf, FaFileExcel, FaSort, FaPlus } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

interface User {
  id: number;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
  lastLogin?: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<keyof User>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [page, setPage] = useState(1);
  const perPage = 10;

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<User | null>(null);
  const [showResetModal, setShowResetModal] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });

  // Role-based access
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      toast.error("Bạn không có quyền truy cập");
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
      setFiltered(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lấy danh sách user thất bại");
    } finally {
      setLoading(false);
    }
  };

  // 🔎 Search & highlight
  useEffect(() => {
    const s = search.toLowerCase();
    const result = users.filter(
      (u) =>
        (u.name?.toLowerCase().includes(s) ?? false) ||
        (u.email?.toLowerCase().includes(s) ?? false) ||
        u.id.toString().includes(s)
    );
    setFiltered(result);
    setPage(1);
  }, [search, users]);

  const handleSort = (key: keyof User) => {
    const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    const sorted = [...filtered].sort((a, b) => {
      if ((a[key] ?? "").toString() < (b[key] ?? "").toString()) return order === "asc" ? -1 : 1;
      if ((a[key] ?? "").toString() > (b[key] ?? "").toString()) return order === "asc" ? 1 : -1;
      return 0;
    });
    setSortKey(key);
    setSortOrder(order);
    setFiltered(sorted);
  };

  const highlight = (text: string | number | null) => {
    if (!search || !text) return text ?? "-";
    const parts = text.toString().split(new RegExp(`(${search})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? <span key={i} className="bg-yellow-200">{part}</span> : part
    );
  };

  // --- CRUD Actions ---
  const addUser = async () => {
    try {
      if (!newUser.name || !newUser.email || !newUser.password) {
        toast.error("Vui lòng điền đầy đủ thông tin!");
        return;
      }

      const res = await api.post("/admin/users", newUser);
      toast.success("Thêm user thành công!");
      fetchUsers();
      setShowAddModal(false);
      setNewUser({ name: "", email: "", password: "", role: "user" });

    } catch (err: any) {
      if (err.response?.data) {
        if (Array.isArray(err.response.data.errors)) {
          err.response.data.errors.forEach((e: any) => toast.error(e.msg || e.message));
        } else if (err.response.data.message) {
          toast.error(err.response.data.message); // ví dụ: "Email đã tồn tại"
        } else {
          toast.error("Thêm user thất bại");
        }
      } else {
        toast.error("Thêm user thất bại");
      }
    }
  };

  const editUser = async () => {
    if (!showEditModal) return;
    try {
      await api.patch(`/admin/users/${showEditModal.id}`, showEditModal);
      toast.success("Cập nhật user thành công!");
      fetchUsers();
      setShowEditModal(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Cập nhật thất bại");
    }
  };

  const resetPassword = async () => {
    if (!showResetModal) return;
    try {
      await api.patch(`/admin/users/${showResetModal.id}/reset-password`, { newPassword });
      toast.success("Reset password thành công!");
      setShowResetModal(null);
      setNewPassword("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Reset thất bại");
    }
  };

  const deleteUser = async () => {
    if (!showDeleteModal) return;
    try {
      await api.delete(`/admin/users/${showDeleteModal.id}`);
      toast.success("Xóa user thành công!");
      fetchUsers();
      setShowDeleteModal(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Xóa thất bại");
    }
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("User List", 14, 10);
    autoTable(doc, {
      head: [["ID", "Name", "Email", "Role", "CreatedAt", "Last Login"]],
      body: filtered.map((u, index) => [
        index + 1,
        u.name,
        u.email,
        u.role,
        new Date(u.createdAt).toLocaleDateString(),
        u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "-",
      ])
    });
    doc.save("users.pdf");
    toast.success("Xuất PDF thành công!");
  };

  // Export Excel
  const exportExcel = () => {
    const worksheetData = filtered.map((u, index) => ({
      ID: (page - 1) * perPage + index + 1,
      Name: u.name,
      Email: u.email,
      Role: u.role,
      CreatedAt: new Date(u.createdAt).toLocaleDateString(),
      LastLogin: u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "-",
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), "users.xlsx");
    toast.success("Xuất Excel thành công!");
  };

  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">User Management</h1>

      {/* Search & Add & Export */}
      <div className="flex items-center gap-2 mb-4">
        <FaSearch />
        <input
          className="w-64 p-2 border rounded"
          placeholder="Tìm ID, tên, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="flex items-center gap-2 px-3 py-2 ml-auto text-white bg-blue-500 rounded hover:bg-blue-600"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus /> Thêm User
        </button>
        <button
          className="flex items-center gap-2 px-3 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          onClick={exportPDF}
        >
          <FaFilePdf /> PDF
        </button>
        <button
          className="flex items-center gap-2 px-3 py-2 text-white bg-green-500 rounded hover:bg-green-600"
          onClick={exportExcel}
        >
          <FaFileExcel /> Excel
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded shadow">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("id")}>ID <FaSort className="inline" /></th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("name")}>Name <FaSort className="inline" /></th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("email")}>Email <FaSort className="inline" /></th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("role")}>Role <FaSort className="inline" /></th>
              <th className="p-2 border">CreatedAt</th>
              <th className="p-2 border">Last Login</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((u, index) => (
              <tr key={u.id} className="text-center">
                <td className="p-2 border">{(page - 1) * perPage + index + 1}</td>
                <td className="p-2 border">{highlight(u.name)}</td>
                <td className="p-2 border">{highlight(u.email)}</td>
                <td className="p-2 border"><span className={`px-2 py-1 rounded text-white ${u.role==="admin"?"bg-blue-500":"bg-gray-600"}`}>{u.role}</span></td>
                <td className="p-2 border">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-2 border">{u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "-"}</td>
                <td className="flex justify-center gap-2 p-2 border">
                  <button className="text-blue-500" onClick={()=>setShowEditModal(u)}><FaEdit/></button>
                  <button className="text-yellow-600" onClick={()=>setShowResetModal(u)}><FaKey/></button>
                  <button className="text-red-500" onClick={()=>setShowDeleteModal(u)}><FaTrash/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <button disabled={page===1} onClick={()=>setPage(page-1)} className="px-3 py-1 border rounded">Prev</button>
        {[...Array(totalPages)].map((_, i) => (
          <button key={i} onClick={()=>setPage(i+1)} className={`px-3 py-1 border rounded ${page===i+1?"bg-blue-500 text-white":""}`}>{i+1}</button>
        ))}
        <button disabled={page===totalPages} onClick={()=>setPage(page+1)} className="px-3 py-1 border rounded">Next</button>
      </div>

      {/* --- Modals --- */}
      {showAddModal && (
        <Modal title="Thêm User" onClose={()=>setShowAddModal(false)}>
          <input placeholder="Name" className="w-full p-2 mb-2 border rounded" value={newUser.name} onChange={e=>setNewUser({...newUser,name:e.target.value})}/>
          <input placeholder="Email" className="w-full p-2 mb-2 border rounded" value={newUser.email} onChange={e=>setNewUser({...newUser,email:e.target.value})}/>
          <input placeholder="Password" type="password" className="w-full p-2 mb-2 border rounded" value={newUser.password} onChange={e=>setNewUser({...newUser,password:e.target.value})}/>
          <select className="w-full p-2 mb-4 border rounded" value={newUser.role} onChange={e=>setNewUser({...newUser,role:e.target.value})}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex justify-end gap-2">
            <button onClick={addUser} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">Thêm</button>
          </div>
        </Modal>
      )}

      {showEditModal && showEditModal.id && (
        <Modal title="Chỉnh sửa User" onClose={()=>setShowEditModal(null)}>
          <input placeholder="Name" className="w-full p-2 mb-2 border rounded" value={showEditModal.name ?? ""} onChange={e=>setShowEditModal({...showEditModal!,name:e.target.value})}/>
          <input placeholder="Email" className="w-full p-2 mb-2 border rounded" value={showEditModal.email ?? ""} onChange={e=>setShowEditModal({...showEditModal!,email:e.target.value})}/>
          <select className="w-full p-2 mb-4 border rounded" value={showEditModal.role} onChange={e=>setShowEditModal({...showEditModal!,role:e.target.value})}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex justify-end gap-2">
            <button onClick={editUser} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">Lưu</button>
          </div>
        </Modal>
      )}

      {showResetModal && (
        <Modal title="Reset Password" onClose={()=>setShowResetModal(null)}>
          <input type="password" placeholder="New Password" className="w-full p-2 mb-4 border rounded" value={newPassword} onChange={e=>setNewPassword(e.target.value)}/>
          <div className="flex justify-end gap-2">
            <button onClick={resetPassword} className="px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600">Xác nhận</button>
          </div>
        </Modal>
      )}

      {showDeleteModal && (
        <Modal title="Xác nhận xóa" onClose={()=>setShowDeleteModal(null)}>
          <p>Bạn có chắc muốn xóa user {showDeleteModal.name}?</p>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={deleteUser} className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">Xóa</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- Modal component ---
interface ModalProps { title: string; children: React.ReactNode; onClose: ()=>void }
const Modal = ({title, children, onClose}: ModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="p-6 bg-white rounded-xl w-96">
      <h3 className="mb-4 text-xl font-bold">{title}</h3>
      {children}
      <button onClick={onClose} className="px-4 py-2 mt-4 bg-gray-400 rounded hover:bg-gray-500">Hủy</button>
    </div>
  </div>
);
