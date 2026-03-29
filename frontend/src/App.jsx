import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login'; // Đảm bảo đường dẫn này khớp với cấu trúc thư mục của bạn
import ProtectedRoute from './routes/ProtectedRoute';

// Component tạm thời cho Dashboard để test sau khi đăng nhập
const DashboardPlaceholder = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          {user?.fullName?.charAt(0) || 'U'}
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Chào mừng trở lại!</h1>
        <p className="text-gray-600 mb-6">{user?.fullName}</p>
        
        <button 
          onClick={() => logout()} 
          className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

// Component tạm thời cho trang lỗi phân quyền
const Unauthorized = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <h1 className="text-3xl font-bold text-red-600">403 - Bạn không có quyền truy cập trang này</h1>
  </div>
);

function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      {/* Ai cũng có thể truy cập */}
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ================= PROTECTED ROUTES ================= */}
      {/* Phải đăng nhập mới được vào */}
      <Route element={<ProtectedRoute />}>
        {/* Route mặc định sau khi đăng nhập */}
        <Route path="/dashboard" element={<DashboardPlaceholder />} />
        
        {/* Nơi đây sẽ chứa các route khác như /students, /courses... */}
      </Route>

      {/* ================= ADMIN ONLY ROUTES ================= */}
      {/* Ví dụ: Phải đăng nhập VÀ có quyền ROLE_ADMIN mới được vào */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
        {/* <Route path="/admin/users" element={<UserManagement />} /> */}
      </Route>

      {/* ================= CATCH ALL ================= */}
      {/* Nhập URL linh tinh -> Đẩy về đăng nhập */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

// Lưu ý: Cần import useAuthStore trong file App.jsx để DashboardPlaceholder hoạt động
import useAuthStore from './store/useAuthStore';