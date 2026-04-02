import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiGitMerge, FiShield } from 'react-icons/fi';
import api from '../api/axios';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await api.post('/api/auth/admin-login', form);
      const { token, user } = res.data;
      localStorage.setItem('family_tree_admin_token', token);
      localStorage.setItem('family_tree_admin_user', JSON.stringify(user));
      toast.success('Welcome, Admin!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid admin credentials';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      {/* Left Sidebar */}
      <div className="admin-login-sidebar">
        <div style={{ marginBottom: 32 }}>
          <FiGitMerge size={56} color="#F4C430" />
        </div>
        <h2 style={{ color: '#fff', fontWeight: 800, marginBottom: 8, fontSize: 26 }}>FamilyTree</h2>
        <p style={{ color: '#a0a0b0', fontSize: 15, marginBottom: 40 }}>Admin Control Panel</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
          {[
            { icon: '👥', label: 'Manage Users' },
            { icon: '🌳', label: 'View Family Trees' },
            { icon: '📊', label: 'Analytics & Stats' }
          ].map((f) => (
            <div
              key={f.label}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                color: '#fff',
                fontSize: 14
              }}
            >
              <span style={{ fontSize: 20 }}>{f.icon}</span>
              {f.label}
            </div>
          ))}
        </div>
      </div>

      {/* Right Form Area */}
      <div className="admin-login-form-area">
        <div className="admin-login-card">
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6C3FC5, #8B5CF6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <FiShield size={26} color="#fff" />
            </div>
            <h3 style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Admin Sign In</h3>
            <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>Sign in with your admin credentials</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label style={{ fontSize: 14, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
                Admin Email
              </label>
              <div className="input-group">
                <span
                  className="input-group-text"
                  style={{ background: '#f8fafc', border: '2px solid #e2e8f0', borderRight: 'none' }}
                >
                  <FiMail color="#6C3FC5" />
                </span>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  style={{ borderLeft: 'none', border: '2px solid #e2e8f0' }}
                  placeholder="admin@familytree.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              {errors.email && <div style={{ color: '#dc3545', fontSize: 12, marginTop: 4 }}>{errors.email}</div>}
            </div>

            <div className="mb-4">
              <label style={{ fontSize: 14, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <div className="input-group">
                <span
                  className="input-group-text"
                  style={{ background: '#f8fafc', border: '2px solid #e2e8f0', borderRight: 'none' }}
                >
                  <FiLock color="#6C3FC5" />
                </span>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  style={{ borderLeft: 'none', border: '2px solid #e2e8f0' }}
                  placeholder="Admin password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              {errors.password && <div style={{ color: '#dc3545', fontSize: 12, marginTop: 4 }}>{errors.password}</div>}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #6C3FC5, #8B5CF6)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '12px',
                fontWeight: 600,
                fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.3s'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In as Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
