import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiGitMerge } from 'react-icons/fi';

function Navbar() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('family_tree_user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('family_tree_token');
    localStorage.removeItem('family_tree_user');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(135deg, #6C3FC5, #4a2d8a)' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/dashboard">
          <FiGitMerge size={24} style={{ color: '#F4C430' }} />
          <span className="fw-bold">FamilyTree</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center gap-1" to="/dashboard">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center gap-1" to="/family-tree">
                Family Tree
              </Link>
            </li>
            {user && (
              <li className="nav-item">
                <span className="nav-link d-flex align-items-center gap-1" style={{ color: '#F4C430' }}>
                  <FiUser size={16} />
                  {user.firstName || user.email}
                </span>
              </li>
            )}
            <li className="nav-item">
              <button
                className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1"
                onClick={handleLogout}
              >
                <FiLogOut size={16} />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
