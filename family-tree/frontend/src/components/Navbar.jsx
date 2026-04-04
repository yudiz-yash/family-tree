import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiGitMerge, FiGlobe } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

function Navbar() {
  const navigate = useNavigate();
  const { t, lang, switchLang } = useLanguage();
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
          <span className="fw-bold">{t.brandName}</span>
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
                {t.navDashboard}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center gap-1" to="/family-tree">
                {t.navFamilyTree}
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

            {/* Language switcher */}
            <li className="nav-item d-flex align-items-center">
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6 }}>
                <FiGlobe size={15} style={{ color: 'rgba(255,255,255,0.7)', flexShrink: 0 }} />
                <select
                  value={lang}
                  onChange={e => switchLang(e.target.value)}
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    padding: '5px 10px',
                    cursor: 'pointer',
                    outline: 'none',
                    fontFamily: 'Poppins, sans-serif',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    paddingRight: 28,
                  }}
                >
                  <option value="gu" style={{ background: '#4a2d8a', color: '#fff' }}>{t.gujarati}</option>
                  <option value="en" style={{ background: '#4a2d8a', color: '#fff' }}>{t.english}</option>
                </select>
                <span style={{
                  position: 'absolute', right: 8, pointerEvents: 'none',
                  color: 'rgba(255,255,255,0.7)', fontSize: 10
                }}>▼</span>
              </div>
            </li>

            <li className="nav-item">
              <button
                className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1"
                onClick={handleLogout}
              >
                <FiLogOut size={16} />
                {t.navLogout}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
