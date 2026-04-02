import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiGitMerge } from 'react-icons/fi';
import api from '../api/axios';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
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
      const res = await api.post('/api/auth/login', form);
      const { token, user } = res.data;
      localStorage.setItem('family_tree_token', token);
      localStorage.setItem('family_tree_user', JSON.stringify(user));
      toast.success('Login successful!');
      if (user.profileCompleted) {
        navigate('/dashboard');
      } else {
        navigate('/complete-profile');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <FiGitMerge size={48} color="#6C3FC5" />
          <h1>FamilyTree</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <div className="input-group">
              <span className="input-group-text" style={{ background: '#f8f4ff', border: '2px solid #e8e0f5', borderRight: 'none' }}>
                <FiMail color="#6C3FC5" />
              </span>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                style={{ borderLeft: 'none' }}
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            {errors.email && <div className="text-danger mt-1" style={{ fontSize: '12px' }}>{errors.email}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text" style={{ background: '#f8f4ff', border: '2px solid #e8e0f5', borderRight: 'none' }}>
                <FiLock color="#6C3FC5" />
              </span>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                style={{ borderLeft: 'none' }}
                placeholder="Your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            {errors.password && <div className="text-danger mt-1" style={{ fontSize: '12px' }}>{errors.password}</div>}
          </div>

          <button type="submit" className="btn-primary-custom" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-4" style={{ fontSize: '14px', color: '#888' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#6C3FC5', fontWeight: 600, textDecoration: 'none' }}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
