import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Kiểm tra Role từ Role Entity của Nhóm I
  const hasAccess = allowedRoles.some(role => 
    user.roles.includes(`ROLE_${role}`)
  );

  return hasAccess ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;