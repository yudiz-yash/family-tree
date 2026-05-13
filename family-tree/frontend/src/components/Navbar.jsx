import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiGlobe } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
const logo = '/logo.png';

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
    <nav className="navbar navbar-expand-lg" style={{ background: '#fff', borderBottom: '2px solid #ede9f8', boxShadow: '0 2px 12px rgba(108,63,197,0.08)' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/dashboard">
          <img src={logo} alt="logo" style={{ width: 70, height: 70, objectFit: 'contain' }} />
          <span className="fw-bold" style={{ color: '#6C3FC5' }}>{t.brandName}</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          style={{ borderColor: '#6C3FC5' }}
        >
          <span className="navbar-toggler-icon" style={{ filter: 'invert(30%) sepia(80%) saturate(500%) hue-rotate(230deg)' }}></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center gap-1" style={{ color: '#4a2d8a', fontWeight: 500 }} to="/dashboard">
                {t.navDashboard}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center gap-1" style={{ color: '#4a2d8a', fontWeight: 500 }} to="/family-tree">
                {t.navFamilyTree}
              </Link>
            </li>
            {user && (
              <li className="nav-item">
                <span className="nav-link d-flex align-items-center gap-1" style={{ color: '#6C3FC5', fontWeight: 600 }}>
                  <FiUser size={16} />
                  {user.firstName || user.mobileNumber}
                </span>
              </li>
            )}

            {/* Language switcher */}
            <li className="nav-item d-flex align-items-center">
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6 }}>
                <FiGlobe size={15} style={{ color: '#6C3FC5', flexShrink: 0 }} />
                <select
                  value={lang}
                  onChange={e => switchLang(e.target.value)}
                  style={{
                    background: '#f4f0ff',
                    border: '1px solid #c4b5f0',
                    borderRadius: 8,
                    color: '#4a2d8a',
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
                  <option value="gu">{t.gujarati}</option>
                  <option value="en">{t.english}</option>
                </select>
                <span style={{
                  position: 'absolute', right: 8, pointerEvents: 'none',
                  color: '#6C3FC5', fontSize: 10
                }}>▼</span>
              </div>
            </li>

            <li className="nav-item">
              <button
                className="btn btn-sm d-flex align-items-center gap-1"
                style={{ background: '#6C3FC5', color: '#fff', border: 'none', borderRadius: 8 }}
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
