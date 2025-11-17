import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api/profileApi';

export default function ProfileForm() {
  const [profile, setProfile] = useState({ name: '', email: '', avatar: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const res = await getProfile();
    setProfile(res.data);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (avatarUrl) => {
    setProfile({ ...profile, avatar: avatarUrl });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateProfile(profile);
    setLoading(false);
    alert('Cập nhật thành công');
  };

  // Lấy chữ cái đầu tên
  const getInitial = () => profile.name?.[0]?.toUpperCase() || '?';

  return (
    <form onSubmit={handleSubmit} className="max-w-md p-4 mx-auto bg-white rounded shadow">
      <div className="flex flex-col items-center">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt="Avatar"
            className="object-cover w-24 h-24 mb-2 rounded-full"
          />
        ) : (
          <div className="flex items-center justify-center w-24 h-24 mb-2 text-2xl font-bold text-white bg-blue-500 rounded-full">
            {getInitial()}
          </div>
        )}
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const reader = new FileReader();
              reader.onload = () => handleAvatarChange(reader.result);
              reader.readAsDataURL(e.target.files[0]);
            }
          }}
          className="mb-4"
        />
      </div>

      <label className="block mt-4">
        Name:
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          className="w-full p-2 mt-1 border rounded"
        />
      </label>
      <label className="block mt-4">
        Email:
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          className="w-full p-2 mt-1 border rounded"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 mt-4 text-white bg-blue-500 rounded"
      >
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
