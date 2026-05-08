import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiGitMerge } from 'react-icons/fi';
import api from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import LangSwitcher from '../components/LangSwitcher';

function Signup() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = t.emailRequired;
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = t.invalidEmailFormat;
    if (!form.password) errs.password = t.passwordRequired;
    else if (form.password.length < 6) errs.password = t.passwordMinLength;
    if (!form.confirmPassword) errs.confirmPassword = t.confirmPasswordRequired;
    else if (form.password !== form.confirmPassword) errs.confirmPassword = t.passwordsNoMatch;
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
      navigate('/complete-profile');
    } catch (err) {
      const msg = err.response?.data?.message || t.registrationFailed;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <LangSwitcher />
      <div className="auth-card">
        <div className="auth-logo">
          <FiGitMerge size={48} color="#6C3FC5" />
          <h1>{t.brandName}</h1>
          <p>{t.createAccountTitle}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">{t.emailAddress}</label>
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
            <label className="form-label">{t.password}</label>
            <div className="input-group">
              <span className="input-group-text" style={{ background: '#f8f4ff', border: '2px solid #e8e0f5', borderRight: 'none' }}>
                <FiLock color="#6C3FC5" />
              </span>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                style={{ borderLeft: 'none' }}
                placeholder={t.minChars}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            {errors.password && <div className="text-danger mt-1" style={{ fontSize: '12px' }}>{errors.password}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label">{t.confirmPassword}</label>
            <div className="input-group">
              <span className="input-group-text" style={{ background: '#f8f4ff', border: '2px solid #e8e0f5', borderRight: 'none' }}>
                <FiLock color="#6C3FC5" />
              </span>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                style={{ borderLeft: 'none' }}
                placeholder={t.reEnterPassword}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
            </div>
            {errors.confirmPassword && <div className="text-danger mt-1" style={{ fontSize: '12px' }}>{errors.confirmPassword}</div>}
          </div>

          <button type="submit" className="btn-primary-custom" disabled={loading}>
            {loading ? t.creatingAccount : t.createAccountBtn}
          </button>
        </form>

        <div className="text-center mt-4" style={{ fontSize: '14px', color: '#888' }}>
          {t.alreadyHaveAccount}{' '}
          <Link to="/login" style={{ color: '#6C3FC5', fontWeight: 600, textDecoration: 'none' }}>
            {t.signInLink}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
