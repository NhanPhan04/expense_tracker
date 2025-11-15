import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api/profileApi';
import AvatarUpload from './AvatarUpload';

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

  return (
    <form onSubmit={handleSubmit} className="max-w-md p-4 mx-auto bg-white rounded shadow">
      <AvatarUpload avatar={profile.avatar} onChange={handleAvatarChange} />
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
