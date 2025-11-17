import React, { useEffect, useState } from "react";
import api from "../../api/auth";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaKey,
  FaFilePdf,
  FaFileExcel,
  FaSort,
  FaPlus
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import UserModal from "../../components/admin/UserModal";

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

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<User | null>(null);
  const [showResetModal, setShowResetModal] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });

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
      part.toLowerCase() === search.toLowerCase() ? <span key={i} className="px-1 bg-yellow-200 rounded">{part}</span> : part
    );
  };

  // --- CRUD Actions ---
  const addUser = async () => {
    try {
      if (!newUser.name || !newUser.email || !newUser.password) {
        toast.error("Vui lòng điền đầy đủ thông tin!");
        return;
      }
      await api.post("/admin/users", newUser);
      toast.success("Thêm user thành công!");
      fetchUsers();
      setShowAddModal(false);
      setNewUser({ name: "", email: "", password: "", role: "user" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Thêm user thất bại");
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

  // --- Export ---
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
    <div className="min-h-screen p-6 rounded-lg shadow-inner bg-gradient-to-r from-purple-50 via-white to-purple-50">
      <h1 className="mb-6 text-3xl font-bold text-purple-600 drop-shadow-md">Quản Lý Người Dùng</h1>

      {/* Search & Add & Export */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex items-center gap-2 p-2 bg-white rounded shadow">
          <FaSearch className="text-purple-500"/>
          <input
            className="w-64 p-2 outline-none"
            placeholder="Tìm ID, tên, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 ml-auto text-white transition-transform rounded shadow bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus /> Thêm User
        </button>
        <button
          className="flex items-center gap-2 px-3 py-2 text-white transition-transform bg-red-500 rounded shadow hover:scale-105"
          onClick={exportPDF}
        >
          <FaFilePdf /> PDF
        </button>
        <button
          className="flex items-center gap-2 px-3 py-2 text-white transition-transform bg-green-500 rounded shadow hover:scale-105"
          onClick={exportExcel}
        >
          <FaFileExcel /> Excel
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="w-full border border-gray-200">
          <thead className="bg-purple-100">
            <tr>
              {["id","name","email","role","createdAt","lastLogin"].map((key,i)=>(
                <th key={i} className="p-3 text-left border cursor-pointer">{key.toUpperCase()}</th>
              ))}
              <th className="p-3 text-center border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((u,index)=>(
              <tr key={u.id} className="text-center transition-colors hover:bg-purple-50">
                <td className="p-2 border">{(page-1)*perPage + index + 1}</td>
                <td className="p-2 border">{highlight(u.name)}</td>
                <td className="p-2 border">{highlight(u.email)}</td>
                <td className="p-2 border">
                  <span className={`px-2 py-1 rounded text-white ${u.role==="admin"?"bg-blue-500":"bg-gray-500"} shadow-sm`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-2 border">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-2 border">{u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "-"}</td>
                <td className="flex justify-center gap-2 p-2 border">
                  <button className="text-blue-500 transition-colors hover:text-blue-700" onClick={()=>setShowEditModal(u)}><FaEdit/></button>
                  <button className="text-yellow-500 transition-colors hover:text-yellow-700" onClick={()=>setShowResetModal(u)}><FaKey/></button>
                  <button className="text-red-500 transition-colors hover:text-red-700" onClick={()=>setShowDeleteModal(u)}><FaTrash/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        <button disabled={page===1} onClick={()=>setPage(page-1)} className="px-3 py-1 transition border rounded hover:bg-purple-100">Prev</button>
        {[...Array(totalPages)].map((_, i)=>(
          <button key={i} onClick={()=>setPage(i+1)} className={`px-3 py-1 border rounded ${page===i+1?"bg-purple-500 text-white":""} hover:bg-purple-200 transition`}>{i+1}</button>
        ))}
        <button disabled={page===totalPages} onClick={()=>setPage(page+1)} className="px-3 py-1 transition border rounded hover:bg-purple-100">Next</button>
      </div>

      {/* Modals */}
      {showAddModal && <UserModal isOpen={true} onClose={()=>setShowAddModal(false)} onSaved={fetchUsers} />}
      {showEditModal && <UserModal isOpen={true} onClose={()=>setShowEditModal(null)} onSaved={fetchUsers} user={showEditModal} />}
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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="p-6 bg-white shadow-lg rounded-xl w-96 animate-fadeIn">
      <h3 className="mb-4 text-xl font-bold text-purple-600">{title}</h3>
      {children}
      <button onClick={onClose} className="px-4 py-2 mt-4 bg-gray-300 rounded hover:bg-gray-400">Hủy</button>
    </div>
  </div>
);
