import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, roles } = useAuthStore();

  // 1. Kiểm tra trạng thái đăng nhập
  // Nếu chưa đăng nhập, đá văng về trang /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Kiểm tra phân quyền (RBAC - Role Based Access Control)
  // Nếu route có yêu cầu quyền cụ thể (vd: chỉ ADMIN)
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = roles.some((role) => allowedRoles.includes(role));
    
    if (!hasRequiredRole) {
      // Đã đăng nhập nhưng không đủ thẩm quyền -> Đẩy ra trang báo lỗi 403
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 3. Nếu mọi bài kiểm tra đều qua -> Render các component con bên trong (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;