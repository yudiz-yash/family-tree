import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUser, FiMapPin, FiPhone, FiStar } from 'react-icons/fi';
import api from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import LangSwitcher from '../components/LangSwitcher';

function CompleteProfile() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    city: '',
    kuldeviName: '',
    surapura: '',
    contactNumber: ''
  });
  const [kuldeviOptions, setKuldeviOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get('/api/kuldevi').then(res => setKuldeviOptions([...res.data.kuldevis].sort((a, b) => a.name.localeCompare(b.name)))).catch(() => {});
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = t.firstNameRequired;
    if (!form.lastName.trim()) errs.lastName = t.lastNameRequired;
    if (!form.city.trim()) errs.city = t.cityRequired;
    if (!form.kuldeviName.trim()) errs.kuldeviName = t.kuldeviRequired;
    if (!form.surapura.trim()) errs.surapura = t.surapuraRequired;
    if (!form.contactNumber.trim()) errs.contactNumber = t.contactRequired;
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
      const res = await api.put('/api/user/profile', form);
      const { user } = res.data;
      localStorage.setItem('family_tree_user', JSON.stringify(user));
      toast.success(t.profileCompleted);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || t.failedToSaveProfile;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <LangSwitcher />
      <div className="profile-card">
        <div className="text-center mb-4">
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #6C3FC5, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <FiUser size={30} color="#fff" />
          </div>
          <h3 style={{ color: '#6C3FC5', fontWeight: 700, marginBottom: 4 }}>{t.completeProfile}</h3>
          <p style={{ color: '#888', fontSize: 14 }}>{t.completeProfileSub}</p>
        </div>

        <div className="step-indicator">
          <div className="step-dot"></div>
          <div className="step-dot active"></div>
          <div className="step-dot"></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label">{t.firstName}</label>
              <input
                type="text"
                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                placeholder={t.firstNamePlaceholder}
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
              {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
            </div>
            <div className="col-6 mb-3">
              <label className="form-label">{t.lastName}</label>
              <input
                type="text"
                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                placeholder={t.lastNamePlaceholder}
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
              {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">
              <FiMapPin size={14} className="me-1" style={{ color: '#6C3FC5' }} />
              {t.city}
            </label>
            <input
              type="text"
              className={`form-control ${errors.city ? 'is-invalid' : ''}`}
              placeholder={t.cityPlaceholder}
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            {errors.city && <div className="invalid-feedback">{errors.city}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">
              <FiStar size={14} className="me-1" style={{ color: '#6C3FC5' }} />
              {t.kuldeviName}
            </label>
            <select
              className={`form-control ${errors.kuldeviName ? 'is-invalid' : ''}`}
              value={form.kuldeviName}
              onChange={(e) => setForm({ ...form, kuldeviName: e.target.value })}
            >
              <option value="">{t.kuldeviPlaceholder}</option>
              {kuldeviOptions.map(k => (
                <option key={k._id} value={k.name}>{k.name}</option>
              ))}
            </select>
            {errors.kuldeviName && <div className="invalid-feedback">{errors.kuldeviName}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">
              <span style={{ fontSize: 14, marginRight: 4 }}>🏘️</span>
              {t.surapura}
            </label>
            <input
              type="text"
              className={`form-control ${errors.surapura ? 'is-invalid' : ''}`}
              placeholder={t.surapuraPlaceholder}
              value={form.surapura}
              onChange={(e) => setForm({ ...form, surapura: e.target.value })}
            />
            {errors.surapura && <div className="invalid-feedback">{errors.surapura}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label">
              <FiPhone size={14} className="me-1" style={{ color: '#6C3FC5' }} />
              {t.contactNumber}
            </label>
            <input
              type="tel"
              className={`form-control ${errors.contactNumber ? 'is-invalid' : ''}`}
              placeholder={t.contactPlaceholder}
              value={form.contactNumber}
              onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
            />
            {errors.contactNumber && <div className="invalid-feedback">{errors.contactNumber}</div>}
          </div>

          <button type="submit" className="btn-primary-custom" disabled={loading}>
            {loading ? t.saving : t.saveAndContinue}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompleteProfile;
