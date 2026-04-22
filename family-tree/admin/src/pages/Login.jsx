import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock } from 'react-icons/fi';
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
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
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
      toast.error(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #4a2d8a 50%, #6C3FC5 100%)',
      padding: 20
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.98)',
        borderRadius: 24,
        padding: '44px 40px',
        width: '100%',
        maxWidth: 440,
        boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
        border: '1px solid rgba(255,255,255,0.5)'
      }}>
        {/* Logo + heading */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/logo.png" alt="logo" style={{ width: 150, height: 150, objectFit: 'contain', marginBottom: 4 }} />
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#6C3FC5', margin: '8px 0 2px', fontFamily: "'Noto Sans Gujarati', sans-serif" }}>
            લુહાર ડોડીયા પરીવાર એકતા ગ્રુપ
          </h2>
          <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: 18, margin: '6px 0 4px' }}>Admin Sign In</h3>
          <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>Sign in with your admin credentials</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label style={{ fontSize: 14, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
              Admin Email
            </label>
            <div className="input-group">
              <span className="input-group-text" style={{ background: '#f8f4ff', border: '2px solid #e8e0f5', borderRight: 'none' }}>
                <FiMail color="#6C3FC5" />
              </span>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                style={{ borderLeft: 'none' }}
                placeholder="Enter your email"
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
              <span className="input-group-text" style={{ background: '#f8f4ff', border: '2px solid #e8e0f5', borderRight: 'none' }}>
                <FiLock color="#6C3FC5" />
              </span>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                style={{ borderLeft: 'none' }}
                placeholder="Enter your password"
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
              color: '#fff', border: 'none', borderRadius: 10,
              padding: '12px', fontWeight: 600, fontSize: 15,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, transition: 'all 0.3s'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
