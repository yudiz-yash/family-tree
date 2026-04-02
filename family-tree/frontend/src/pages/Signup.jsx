import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiGitMerge } from 'react-icons/fi';
import api from '../api/axios';

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
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
      const res = await api.post('/api/auth/register', {
        email: form.email,
        password: form.password
      });
      const { token, user } = res.data;
      localStorage.setItem('family_tree_token', token);
      localStorage.setItem('family_tree_user', JSON.stringify(user));
      toast.success('Account created! Please complete your profile.');
      navigate('/complete-profile');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
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
          <p>Create your account</p>
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

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text" style={{ background: '#f8f4ff', border: '2px solid #e8e0f5', borderRight: 'none' }}>
                <FiLock color="#6C3FC5" />
              </span>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                style={{ borderLeft: 'none' }}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            {errors.password && <div className="text-danger mt-1" style={{ fontSize: '12px' }}>{errors.password}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label">Confirm Password</label>
            <div className="input-group">
              <span className="input-group-text" style={{ background: '#f8f4ff', border: '2px solid #e8e0f5', borderRight: 'none' }}>
                <FiLock color="#6C3FC5" />
              </span>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                style={{ borderLeft: 'none' }}
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
            </div>
            {errors.confirmPassword && <div className="text-danger mt-1" style={{ fontSize: '12px' }}>{errors.confirmPassword}</div>}
          </div>

          <button type="submit" className="btn-primary-custom" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-4" style={{ fontSize: '14px', color: '#888' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6C3FC5', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
