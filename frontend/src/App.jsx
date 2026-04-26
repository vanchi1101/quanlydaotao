import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';

const Dashboard = () => (
  <div className="card">
    <div className="card-body">
      <h3 className="card-title">Thống kê tổng quan</h3>
      <p className="card-text">Nội dung động sẽ được hiển thị dựa theo vai trò của bạn tại đây.</p>
    </div>
  </div>
);

const Unauthorized = () => (
  <div className="d-flex align-items-center justify-content-center min-vh-100">
    <div className="text-center">
      <h1 className="text-danger fw-bold">403 - Bạn không có quyền truy cập trang này</h1>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<div>Trang quản lý Sinh viên (Đang xây dựng)</div>} />
          <Route path="/schedule" element={<div>Trang Lịch học (Đang xây dựng)</div>} />
          <Route path="/grades" element={<div>Trang Tra cứu điểm (Đang xây dựng)</div>} />
          <Route path="/finance" element={<div>Trang Học phí (Đang xây dựng)</div>} />
          <Route path="/courses" element={<div>Trang Chương trình & Học phần (Đang xây dựng)</div>} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
        <Route path="/admin/users" element={<div>Trang Quản lý Hệ thống (Đang xây dựng)</div>} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
