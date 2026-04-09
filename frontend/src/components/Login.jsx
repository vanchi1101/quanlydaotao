import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react'; // Thêm icon cho sinh động
import axiosInstance from '../api/axiosInstance';
import useAuthStore from '../store/useAuthStore';

const Login = () => {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    try {
      const response = await axiosInstance.post('/auth/login', {
        username: data.email, // Backend đang dùng username
        password: data.password,
      });

      if (response.success) {
        loginStore(response.data);
        navigate('/dashboard');
      }
    } catch (error) {
      setServerError(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* LEFT SIDE: FORM & INSTRUCTIONS */}
      <div className="w-full md:w-1/2 flex flex-col p-10 lg:p-24 overflow-y-auto">
        {/* Logo Section */}
        <div className="mb-12">
          <h1 className="text-[32px] font-bold text-[#1A3066] tracking-tight">UDA</h1>
        </div>

        {/* Heading Section */}
        <div className="mb-10">
          <h2 className="text-[40px] font-bold text-[#111827] mb-2">Đăng nhập</h2>
          <p className="text-base text-[#6B7280] leading-6">
            Chào mừng bạn trở lại! Vui lòng nhập thông tin của bạn.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-8 max-w-md">
          {serverError && (
            <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg border border-red-100">
              {serverError}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[14px] font-medium text-[#374151]">Email</label>
            <input
              {...register('email', { required: 'Vui lòng nhập Email' })}
              type="text"
              placeholder="Enter your email"
              className={`w-full h-12 px-4 border ${
                errors.email ? 'border-red-500' : 'border-[#D1D5DB]'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all`}
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
          </div>

          <div className="space-y-2 relative">
            <label className="text-[14px] font-medium text-[#374151]">Password</label>
            <div className="relative">
              <input
                {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={`w-full h-12 px-4 border ${
                  errors.password ? 'border-red-500' : 'border-[#D1D5DB]'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12.5 bg-[#3B82F6] text-white text-base font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading && <Loader2 className="animate-spin" size={20} />}
            Login
          </button>

          <div className="text-center text-sm">
            <span className="text-[#6B7280]">Bạn chưa có tài khoản? </span>
            <button type="button" className="text-[#3B82F6] font-semibold hover:underline">
              Sign up
            </button>
          </div>
        </form>

        {/* Footer Guide Section */}
        <div className="mt-auto pt-10">
          <h3 className="text-[24px] font-bold text-[#166534] mb-4">Hướng dẫn cho Sinh viên</h3>
          <div className="border border-[#E5E7EB] rounded-xl p-6 bg-white">
            <p className="text-[19px] font-medium text-[#4B5563] mb-3">Sinh viên phải tuân thủ:</p>
            <ul className="space-y-2 text-[15px] text-[#4B5563] leading-6">
              <li className="flex gap-2"><span>1.</span> Đăng nhập để học trực tuyến.</li>
              <li className="flex gap-2"><span>2.</span> Không cho mượn tài khoản bất kỳ hình thức nào.</li>
              <li className="flex gap-2"><span>3.</span> Mật khẩu lần đầu đăng nhập là ngày tháng năm sinh của em dd/mm/yyyy</li>
              <li className="flex gap-2"><span>4.</span> Thay đổi password thường xuyên để bảo mật...</li>
              <li className="flex gap-2">
                <span>5.</span> Nếu gặp bất cứ vấn đề gì vui lòng liên hệ trung tâm ICT để được hướng dẫn và giải quyết
              </li>
              <li className="pl-5 text-sm italic font-medium">Sđt: email....</li>
            </ul>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: ILLUSTRATION PLACEHOLDER */}
      <div className="hidden md:block md:w-1/2 bg-[#FFF] relative overflow-hidden">
        {/* Placeholder cho ảnh minh họa */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
          <img src="../public/donga_logo.jpg" alt="" />
        </div>
        {/* Hi ứng trang trí (tùy chọn) */}
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>
      </div>
    </div>
  );
};

export default Login;