"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useUser, User } from "../../context/UserContext";
import toast, { Toaster } from "react-hot-toast";

interface Profile {
  name: string;
  email: string;
  avatar?: string | null;
}

const UserProfile: React.FC = () => {
  const { user, setUser } = useUser();
  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    avatar: null,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get<Profile>("http://localhost:3000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const avatarUrl = res.data.avatar
        ? `http://localhost:3000/${res.data.avatar}`
        : null;

      setProfile({ ...res.data, avatar: avatarUrl });
      setUser((prev: User) => ({
        ...prev,
        name: res.data.name,
        avatar: avatarUrl || prev.avatar,
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);

      // preview ngay
      const reader = new FileReader();
      reader.onload = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("email", profile.email);
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await axios.patch<Profile>(
        "http://localhost:3000/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedAvatar = res.data.avatar
        ? `http://localhost:3000/${res.data.avatar}`
        : profile.avatar;

      setProfile((prev) => ({ ...prev, ...res.data, avatar: updatedAvatar }));

      setUser((prev: User) => ({
        ...prev,
        name: res.data.name,
        avatar: updatedAvatar || prev.avatar,
      }));

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile");
    }
    setLoading(false);
  };

  // Lấy chữ cái đầu của tên
  const getInitial = () => profile.name?.[0]?.toUpperCase() || "?";

  return (
    <div className="flex flex-col items-center max-w-md p-6 mx-auto mt-10 bg-white border border-gray-200 shadow-lg rounded-2xl">
      <Toaster position="top-right" />
      <h2 className="mb-6 text-2xl font-bold text-center text-purple-700">
        Thông Tin Người Dùng
      </h2>

      <div className="flex flex-col items-center">
        {avatarFile || profile.avatar ? (
          <img
            src={avatarFile ? URL.createObjectURL(avatarFile) : profile.avatar || ""}
            alt="Avatar"
            className="object-cover w-32 h-32 mb-4 border-2 border-purple-200 rounded-full shadow-md"
          />
        ) : (
          <div className="flex items-center justify-center w-32 h-32 mb-4 text-4xl font-bold text-white bg-purple-500 rounded-full shadow-md">
            {getInitial()}
          </div>
        )}
        <input type="file" onChange={handleFileChange} className="mb-4" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
        <div>
          <label className="block mb-1 font-medium">Họ tên</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 mt-2 text-white transition bg-purple-500 rounded-lg shadow hover:bg-purple-600"
        >
          {loading ? "Đang cập nhật..." : "Cập nhật thông tin"}
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
