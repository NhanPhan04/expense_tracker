// src/pages/auth/Login.tsx
import { useForm } from "react-hook-form";
import { login } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const { register: formRegister, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      const res = await login(data);
      console.log("Login response:", res.data);

      const token = res.data.access_token;
      if (!token) {
        alert("❌ Backend không trả token!");
        return;
      }

      localStorage.setItem("token", token);

      // Giải mã payload từ JWT
      let payload;
      try {
        payload = JSON.parse(atob(token.split(".")[1]));
        console.log("JWT payload:", payload);
      } catch (err) {
        alert("❌ Token không hợp lệ");
        return;
      }

      const role = payload.role;
      if (!role) {
        alert("❌ Không có role trong token");
        return;
      }

      localStorage.setItem("role", role);
      alert("✅ Đăng nhập thành công! Role: " + role);

      if (role === "admin") navigate("/admin");
      else navigate("/user");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "❌ Đăng nhập thất bại");
    }
  };

  return (
    <div className="flex w-full min-h-screen">
      {/* Bên trái: Illustration */}
      <div className="items-center justify-center flex-1 hidden md:flex bg-gradient-to-br from-purple-500 to-pink-500 rounded-l-3xl">
        <h1 className="text-4xl font-bold text-white">Chào mừng trở lại!</h1>
      </div>

      {/* Form bên phải */}
      <div className="flex items-center justify-center flex-1 bg-white shadow-2xl rounded-r-3xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative flex flex-col w-full max-w-md gap-6 p-10"
        >
          <h2 className="text-3xl font-bold text-center text-gray-700">Đăng nhập</h2>

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

          <button
            type="submit"
            className="p-3 font-semibold text-white transition bg-purple-500 rounded-xl hover:bg-purple-600"
          >
            Đăng nhập
          </button>

          <div className="flex flex-col items-center mt-2 text-sm text-gray-600">
            <Link to="/register" className="font-medium text-purple-500 hover:underline">
              Bạn chưa có tài khoản? Đăng ký
            </Link>
            <Link
              to="/forget-password"
              className="mt-2 font-medium text-purple-500 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
