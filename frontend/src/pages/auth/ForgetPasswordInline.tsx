// src/pages/auth/ForgetPasswordInline.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { forgetPassword, resetPassword } from "../../api/auth";
import { useNavigate } from "react-router-dom";
const ForgetPasswordInline = () => {
  const { register, handleSubmit, reset } = useForm();
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
const navigate = useNavigate(); // <-- thêm navigate
  // Countdown gửi lại OTP
  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = window.setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const sendOtp = async (data: any) => {
    try {
      await forgetPassword({ email: data.email });
      setEmail(data.email);
      setOtpSent(true);
      setCountdown(60);
      alert("✅ OTP đã được gửi về email!");
    } catch (err: any) {
      alert(err.response?.data?.message || "❌ Gửi OTP thất bại");
    }
  };

  const resendOtp = async () => {
    try {
      await forgetPassword({ email });
      setCountdown(60);
      alert("✅ OTP đã được gửi lại!");
    } catch (err: any) {
      alert(err.response?.data?.message || "❌ Gửi OTP thất bại");
    }
  };

  const resetPass = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      alert("❌ Mật khẩu không khớp!");
      return;
    }
    try {
      await resetPassword({ email, otp: data.otp, newPassword: data.newPassword });
      alert("✅ Mật khẩu đã được cập nhật!");
      setOtpSent(false);
      reset();
       navigate("/login"); // <-- chuyển hướng về login
    } catch (err: any) {
      alert(err.response?.data?.message || "❌ Cập nhật mật khẩu thất bại");
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-r from-yellow-400 to-orange-400">
      <form className="flex flex-col w-full max-w-md gap-6 p-10 m-auto bg-white shadow-2xl rounded-2xl">
        {!otpSent ? (
          <>
            <h2 className="text-2xl font-bold text-center">Quên mật khẩu</h2>
            <input
              {...register("email")}
              placeholder="Email"
              className="p-3 border rounded-xl focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={handleSubmit(sendOtp)}
              className="p-3 font-semibold text-white transition bg-yellow-500 rounded-xl hover:bg-yellow-600"
            >
              Gửi OTP
            </button>
            <div className="mt-2 text-sm text-center">
              <a href="/login" className="text-yellow-600 hover:underline">
                Nhớ mật khẩu? Đăng nhập
              </a>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center">Đặt mật khẩu mới</h2>
            <input
              {...register("otp")}
              placeholder="Mã OTP"
              className="p-3 border rounded-xl focus:ring-2 focus:ring-yellow-400"
            />
            <input
              {...register("newPassword")}
              type="password"
              placeholder="Mật khẩu mới"
              className="p-3 border rounded-xl focus:ring-2 focus:ring-yellow-400"
            />
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Xác nhận mật khẩu"
              className="p-3 border rounded-xl focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={handleSubmit(resetPass)}
              className="p-3 font-semibold text-white transition bg-yellow-500 rounded-xl hover:bg-yellow-600"
            >
              Xác nhận
            </button>

            <button
              disabled={countdown > 0}
              onClick={resendOtp}
              className={`p-2 rounded-xl mt-2 text-white font-semibold transition ${
                countdown > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"
              }`}
            >
              {countdown > 0 ? `Gửi lại OTP sau ${countdown}s` : "Gửi lại OTP"}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgetPasswordInline;
