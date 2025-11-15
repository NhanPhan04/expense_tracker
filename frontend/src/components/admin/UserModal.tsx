// components/admin/UserModal.tsx
import { useState, useEffect } from 'react';
import api from '../../api/auth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  user?: any;
}

const UserModal = ({ isOpen, onClose, onSaved, user }: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setPassword('');
    } else {
      setName('');
      setEmail('');
      setRole('user');
      setPassword('');
    }
  }, [user]);

  const handleSubmit = async () => {
    try {
      if (user) {
        await api.patch(`/admin/users/${user.id}`, { name, email, role });
      } else {
        await api.post('/admin/users', { name, email, role, password });
      }
      onSaved();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lưu thất bại');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="p-6 bg-white rounded-xl w-96">
        <h2 className="mb-4 text-xl font-bold">{user ? 'Sửa User' : 'Thêm User'}</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên"
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
        />
        {!user && (
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            type="password"
            className="w-full p-2 mb-3 border rounded"
          />
        )}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
