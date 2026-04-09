import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login'; // Đảm bảo đường dẫn này khớp với cấu trúc thư mục của bạn
import ProtectedRoute from './routes/ProtectedRoute';


import MainLayout from './layouts/MainLayout';


// Component mẫu cho Dashboard (Bạn có thể tách ra file riêng sau)
const Dashboard = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 className="text-lg font-bold text-gray-800 mb-2">Thống kê tổng quan</h3>
    <p className="text-gray-600">Nội dung động sẽ được hiển thị dựa theo vai trò của bạn tại đây.</p>
  </div>
);




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





      {/* PROTECTED ROUTES BỌC TRONG MAIN LAYOUT */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          
          {/* Dashboard chung cho mọi người */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Các Route dành riêng (Sẽ làm ở Giai đoạn 2) */}
          <Route path="/students" element={<div>Trang quản lý Sinh viên (Đang xây dựng)</div>} />
          <Route path="/schedule" element={<div>Trang Lịch học (Đang xây dựng)</div>} />
          
        </Route>
      </Route>




      {/* ================= ADMIN ONLY ROUTES ================= */}
      {/* Ví dụ: Phải đăng nhập VÀ có quyền ROLE_ADMIN mới được vào */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
        {/* <Route path="/admin/users" element={<UserManagement />} /> */}
      </Route>





      {/* ================= CATCH ALL ================= */}
      {/* Nhập URL linh tinh -> Đẩy về đăng nhập */}
      {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;

// Lưu ý: Cần import useAuthStore trong file App.jsx để DashboardPlaceholder hoạt động
import useAuthStore from './store/useAuthStore';