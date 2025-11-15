// src/pages/auth/Register.tsx
import { useForm } from "react-hook-form";
import { register as apiRegister } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const { register: formRegister, handleSubmit, watch } = useForm();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      alert("❌ Mật khẩu không khớp");
      return;
    }

    try {
      await apiRegister({ name: data.name, email: data.email, password: data.password });
      alert("✅ Đăng ký thành công! Vui lòng đăng nhập");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "❌ Đăng ký thất bại");
    }
  };

  return (
    <div className="flex w-full min-h-screen">
      <div className="items-center justify-center flex-1 hidden md:flex bg-gradient-to-br from-purple-500 to-pink-500 rounded-l-3xl">
        <h1 className="text-4xl font-bold text-white">Chào mừng!</h1>
      </div>

      <div className="flex items-center justify-center flex-1 bg-white shadow-2xl rounded-r-3xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative flex flex-col w-full max-w-md gap-6 p-10"
        >
          <h2 className="text-3xl font-bold text-center text-gray-700">Đăng ký</h2>

          <input
            {...formRegister("name")}
            type="text"
            placeholder="Họ tên"
            className="p-3 transition border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            {...formRegister("email")}
            type="email"
            placeholder="Email"
            className="p-3 transition border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <div className="relative">
            <input
              {...formRegister("password")}
              type={showPass ? "text" : "password"}
              placeholder="Mật khẩu"
              className="w-full p-3 transition border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute font-medium text-gray-500 right-3 top-3"
            >
              {showPass ? "Ẩn" : "Hiện"}
            </button>
          </div>

          <div className="relative">
            <input
              {...formRegister("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              placeholder="Xác nhận mật khẩu"
              className="w-full p-3 transition border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute font-medium text-gray-500 right-3 top-3"
            >
              {showConfirm ? "Ẩn" : "Hiện"}
            </button>
          </div>

          <button
            type="submit"
            className="p-3 font-semibold text-white transition bg-purple-500 rounded-xl hover:bg-purple-600"
          >
            Đăng ký
          </button>

          <div className="flex flex-col items-center mt-2 text-sm text-gray-600">
            <Link to="/login" className="font-medium text-purple-500 hover:underline">
              Bạn đã có tài khoản? Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
