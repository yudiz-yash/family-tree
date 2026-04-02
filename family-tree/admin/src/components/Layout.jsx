import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiUsers,
  FiGitMerge,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronRight
} from 'react-icons/fi';

const navItems = [
  { to: '/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/users', icon: FiUsers, label: 'Users' },
  { to: '/family-trees', icon: FiGitMerge, label: 'Family Trees' }
];

function Layout({ children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const adminUser = JSON.parse(localStorage.getItem('family_tree_admin_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('family_tree_admin_token');
    localStorage.removeItem('family_tree_admin_user');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <FiGitMerge size={26} className="brand-icon" />
          <span>FamilyTree</span>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
            <FiX />
          </button>
        </div>

        <div className="sidebar-subtitle">Admin Panel</div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
              <FiChevronRight size={14} className="sidebar-arrow" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">A</div>
            <div>
              <div className="admin-name">Admin</div>
              <div className="admin-email">{adminUser.email || 'admin@familytree.com'}</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            <FiLogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="topbar-menu-btn" onClick={() => setSidebarOpen(true)}>
            <FiMenu size={22} />
          </button>
          <div className="topbar-title">Family Tree Admin</div>
          <div className="topbar-actions">
            <div className="topbar-badge">
              <span>Admin</span>
            </div>
          </div>
        </header>

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
