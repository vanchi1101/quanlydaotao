import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const MENU_ITEMS = [
  {
    path: '/dashboard',
    label: 'Tổng quan',
    icon: 'bi-speedometer',
    roles: ['ROLE_ADMIN', 'ROLE_SINHVIEN', 'ROLE_GIANGVIEN', 'ROLE_GIAOVU'],
  },
  {
    path: '/students',
    label: 'Hồ sơ Sinh viên',
    icon: 'bi-mortarboard',
    roles: ['ROLE_ADMIN', 'ROLE_GIAOVU'],
  },
  {
    path: '/schedule',
    label: 'Lịch học',
    icon: 'bi-calendar-event',
    roles: ['ROLE_ADMIN', 'ROLE_SINHVIEN', 'ROLE_GIANGVIEN'],
  },
  {
    path: '/grades',
    label: 'Tra cứu điểm',
    icon: 'bi-journal-text',
    roles: ['ROLE_ADMIN', 'ROLE_SINHVIEN', 'ROLE_GIANGVIEN'],
  },
  {
    path: '/finance',
    label: 'Học phí',
    icon: 'bi-credit-card',
    roles: ['ROLE_ADMIN', 'ROLE_SINHVIEN', 'ROLE_GIAOVU'],
  },
  {
    external: '/adminlte/auth/users.html',
    label: 'Authorization',
    icon: 'bi-window',
    roles: ['ROLE_ADMIN'],
  },
];

const MainLayout = () => {
  const { user, roles, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const previousClassName = document.body.className;
    document.body.className = 'layout-fixed sidebar-expand-lg bg-body-tertiary';

    return () => {
      document.body.className = previousClassName;
    };
  }, []);

  const filteredMenu = MENU_ITEMS.filter((item) =>
    item.roles.some((role) => roles.includes(role)),
  );

  const currentTitle =
    filteredMenu.find((item) => location.pathname.startsWith(item.path))?.label || 'Hệ thống';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-wrapper">
      <nav className="app-header navbar navbar-expand bg-body">
        <div className="container-fluid">
          <ul className="navbar-nav">
            <li className="nav-item">
              <button
                type="button"
                className="nav-link btn btn-link text-decoration-none"
                onClick={() => setIsSidebarOpen((value) => !value)}
                aria-label="Toggle sidebar"
              >
                <i className="bi bi-list" />
              </button>
            </li>
            <li className="nav-item d-none d-md-block">
              <span className="nav-link fw-semibold">{currentTitle}</span>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown user-menu">
              <button
                type="button"
                className="nav-link dropdown-toggle btn btn-link text-decoration-none"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="d-none d-md-inline me-2">{user?.fullName || 'User'}</span>
                <span className="user-image rounded-circle shadow d-inline-flex align-items-center justify-content-center bg-primary text-white fw-semibold">
                  {(user?.fullName?.charAt(0) || 'U').toUpperCase()}
                </span>
              </button>

              <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                <li className="user-header text-bg-primary">
                  <p className="mb-0">
                    {user?.fullName || 'User'}
                    <small className="d-block">{user?.username || ''}</small>
                  </p>
                </li>
                <li className="user-body">
                  <div className="small text-muted">
                    {roles.length > 0 ? roles.join(' | ') : 'No role'}
                  </div>
                </li>
                <li className="user-footer">
                  <button type="button" className="btn btn-default btn-flat" onClick={handleLogout}>
                    Sign out
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      <aside
        className="app-sidebar bg-body-secondary shadow"
        data-bs-theme="dark"
        style={{ display: isSidebarOpen ? 'block' : 'none' }}
      >
        <div className="sidebar-brand">
          <NavLink to="/dashboard" className="brand-link text-decoration-none">
            <img
              src="/adminlte/assets/img/AdminLTELogo.png"
              alt="AdminLTE Logo"
              className="brand-image opacity-75 shadow"
            />
            <span className="brand-text fw-light">UDA Manager</span>
          </NavLink>
        </div>

        <div className="sidebar-wrapper">
          <nav className="mt-2">
            <ul className="nav sidebar-menu flex-column" role="navigation" aria-label="Main navigation">
              {filteredMenu.map((item) => (
                <li className="nav-item" key={item.path || item.external}>
                  {item.external ? (
                    <a className="nav-link" href={item.external}>
                      <i className={`nav-icon bi ${item.icon}`} />
                      <p>{item.label}</p>
                    </a>
                  ) : (
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `nav-link ${isActive ? 'active' : ''}`.trim()
                      }
                    >
                      <i className={`nav-icon bi ${item.icon}`} />
                      <p>{item.label}</p>
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      <main className="app-main">
        <div className="app-content">
          <div className="container-fluid py-4">
            <Outlet />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <strong>UDA Manager</strong>
        <span className="ms-2">AdminLTE layout for the React frontend.</span>
      </footer>
    </div>
  );
};

export default MainLayout;
