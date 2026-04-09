import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { 
  LayoutDashboard, Users, GraduationCap, BookOpen, 
  Calendar, CreditCard, FileText, LogOut, Menu, X, Bell 
} from 'lucide-react';

// 1. CẤU HÌNH DANH MỤC MENU (Định nghĩa Role ở đây)
const MENU_ITEMS = [
  { 
    path: '/dashboard', 
    label: 'Tổng quan', 
    icon: LayoutDashboard, 
    roles: ['ROLE_ADMIN', 'ROLE_SINHVIEN', 'ROLE_GIANGVIEN', 'ROLE_GIAOVU'] 
  },
  { 
    path: '/admin/users', 
    label: 'Quản lý Hệ thống', 
    icon: Users, 
    roles: ['ROLE_ADMIN'] // Chỉ Admin mới thấy
  },
  { 
    path: '/students', 
    label: 'Hồ sơ Sinh viên', 
    icon: GraduationCap, 
    roles: ['ROLE_ADMIN', 'ROLE_GIAOVU'] // Admin và Nhân viên đào tạo
  },
  { 
    path: '/courses', 
    label: 'Chương trình & Học phần', 
    icon: BookOpen, 
    roles: ['ROLE_ADMIN', 'ROLE_GIAOVU', 'ROLE_GIANGVIEN'] 
  },
  { 
    path: '/schedule', 
    label: 'Lịch học / Lịch dạy', 
    icon: Calendar, 
    roles: ['ROLE_SINHVIEN', 'ROLE_GIANGVIEN'] // Trải nghiệm riêng cho Sinh viên & Giảng viên
  },
  { 
    path: '/grades', 
    label: 'Tra cứu Điểm', 
    icon: FileText, 
    roles: ['ROLE_SINHVIEN', 'ROLE_GIANGVIEN', 'ROLE_ADMIN'] 
  },
  { 
    path: '/finance', 
    label: 'Học phí & Thanh toán', 
    icon: CreditCard, 
    roles: ['ROLE_SINHVIEN', 'ROLE_GIAOVU', 'ROLE_ADMIN'] 
  },
];

const MainLayout = () => {
  const { user, roles, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 2. LOGIC LỌC MENU TỰ ĐỘNG THEO ROLE CỦA USER HIỆN TẠI
  const filteredMenu = MENU_ITEMS.filter((item) => 
    item.roles.some((role) => roles.includes(role))
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden">
      
      {/* 3. SIDEBAR (THANH ĐIỀU HƯỚNG BÊN TRÁI) */}
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30 w-64 bg-[#1A3066] text-white transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo Brand */}
        <div className="flex items-center justify-center h-16 border-b border-white/10">
          <h1 className="text-2xl font-bold tracking-widest">UDA MANAGER</h1>
        </div>

        {/* Menu Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {filteredMenu.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-[#3B82F6] text-white font-medium shadow-md' 
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'}
                    `}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info Bottom Sidebar (Tùy chọn hiển thị) */}
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-gray-400 uppercase font-semibold mb-2">Quyền truy cập:</div>
          <div className="flex flex-wrap gap-1">
            {roles.map(role => (
              <span key={role} className="bg-white/10 px-2 py-1 rounded text-[11px] text-blue-200">
                {role.replace('ROLE_', '')}
              </span>
            ))}
          </div>
        </div>
      </aside>

      {/* 4. MAIN CONTENT AREA (VÙNG NỘI DUNG CHÍNH BÊN PHẢI) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header (Navbar) */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 lg:px-8 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">
              {filteredMenu.find(m => location.pathname.startsWith(m.path))?.label || 'Hệ thống'}
            </h2>
          </div>

          <div className="flex items-center gap-4 border-l pl-4 ml-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-gray-800">{user?.fullName}</p>
                <p className="text-xs text-gray-500">{user?.username}</p>
              </div>
              <div className="w-10 h-10 bg-[#3B82F6] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              <button 
                onClick={handleLogout}
                className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                title="Đăng xuất"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Nội dung thay đổi (Outlet) */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet /> {/* Các component con (Dashboard, Students...) sẽ render ở đây */}
        </main>
      </div>

    </div>
  );
};

export default MainLayout;