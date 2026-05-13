import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUser, FiMapPin, FiPhone, FiStar, FiArrowLeft, FiSave, FiMail } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { useLanguage } from '../context/LanguageContext';

function EditProfile() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    city: '',
    kuldeviName: '',
    surapura: '',
    contactNumber: '',
    email: ''
  });
  const [kuldeviOptions, setKuldeviOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProfile();
    api.get('/api/kuldevi').then(res => setKuldeviOptions([...res.data.kuldevis].sort((a, b) => a.name.localeCompare(b.name)))).catch(() => {});
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/user/profile');
      const u = res.data.user;
      setForm({
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        city: u.city || '',
        kuldeviName: u.kuldeviName || '',
        surapura: u.surapura || '',
        contactNumber: u.contactNumber || '',
        email: u.email || ''
      });
    } catch {
      toast.error(t.failedToLoadData);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = t.firstNameRequired;
    if (!form.lastName.trim()) errs.lastName = t.lastNameRequired;
    if (!form.city.trim()) errs.city = t.cityRequired;
    if (!form.kuldeviName.trim()) errs.kuldeviName = t.kuldeviRequired;
    if (!form.surapura.trim()) errs.surapura = t.surapuraRequired;
    if (!form.contactNumber.trim()) errs.contactNumber = t.contactRequired;
    if (form.email.trim() && !/\S+@\S+\.\S+/.test(form.email)) errs.email = t.invalidEmailFormat;
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSaving(true);
    try {
      const res = await api.put('/api/user/profile', form);
      const { user } = res.data;
      localStorage.setItem('family_tree_user', JSON.stringify(user));
      toast.success(t.profileUpdated);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || t.failedToUpdate;
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = (hasErr) => ({
    background: '#f8f4ff',
    border: `2px solid ${hasErr ? '#ef4444' : '#e8e0f5'}`,
    borderRadius: 10,
    padding: '11px 14px',
    fontSize: 14,
    color: '#1e1b4b',
    width: '100%',
    outline: 'none',
    fontFamily: 'Poppins, sans-serif',
    transition: 'border-color 0.2s'
  });

  const labelStyle = {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 13, fontWeight: 600, color: '#4b4680', marginBottom: 6
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f0ff' }}>
        <Navbar />
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
          <div className="spinner-border" style={{ color: '#6C3FC5', width: 48, height: 48 }} role="status" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0ff' }}>
      <Navbar />

      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #6C3FC5, #4a2d8a)',
        padding: '24px 0', marginBottom: 32
      }}>
        <div className="container">
          <div className="d-flex align-items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 10, color: '#fff', padding: '8px 14px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                fontWeight: 600, fontSize: 13, fontFamily: 'Poppins, sans-serif'
              }}
            >
              <FiArrowLeft size={15} /> {t.back}
            </button>
            <div>
              <h4 style={{ color: '#fff', fontWeight: 700, margin: 0 }}>{t.editProfileTitle}</h4>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 2 }}>{t.editProfileSub}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 640, paddingBottom: 60 }}>
        <div style={{
          background: '#fff', borderRadius: 20,
          boxShadow: '0 8px 40px rgba(108,63,197,0.1)',
          border: '1px solid rgba(108,63,197,0.1)',
          padding: '36px 32px'
        }}>

          {/* Avatar */}
          <div className="text-center mb-4">
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6C3FC5, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px', fontSize: 28, color: '#fff', fontWeight: 700
            }}>
              {form.firstName ? form.firstName[0].toUpperCase() : <FiUser size={30} />}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1e1b4b' }}>
              {form.firstName} {form.lastName}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* First & Last Name */}
            <div className="row g-3 mb-3">
              <div className="col-6">
                <label style={labelStyle}>
                  <FiUser size={14} style={{ color: '#6C3FC5' }} />
                  {t.firstName}
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  placeholder={t.firstNamePlaceholder}
                  style={inputStyle(errors.firstName)}
                  onFocus={e => e.target.style.borderColor = '#6C3FC5'}
                  onBlur={e => e.target.style.borderColor = errors.firstName ? '#ef4444' : '#e8e0f5'}
                />
                {errors.firstName && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.firstName}</div>}
              </div>
              <div className="col-6">
                <label style={labelStyle}>
                  <FiUser size={14} style={{ color: '#6C3FC5' }} />
                  {t.lastName}
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  placeholder={t.lastNamePlaceholder}
                  style={inputStyle(errors.lastName)}
                  onFocus={e => e.target.style.borderColor = '#6C3FC5'}
                  onBlur={e => e.target.style.borderColor = errors.lastName ? '#ef4444' : '#e8e0f5'}
                />
                {errors.lastName && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.lastName}</div>}
              </div>
            </div>

            {/* City */}
            <div className="mb-3">
              <label style={labelStyle}>
                <FiMapPin size={14} style={{ color: '#6C3FC5' }} />
                {t.city}
              </label>
              <input
                type="text"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                placeholder={t.cityPlaceholder}
                style={inputStyle(errors.city)}
                onFocus={e => e.target.style.borderColor = '#6C3FC5'}
                onBlur={e => e.target.style.borderColor = errors.city ? '#ef4444' : '#e8e0f5'}
              />
              {errors.city && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.city}</div>}
            </div>

            {/* Kuldevi */}
            <div className="mb-3">
              <label style={labelStyle}>
                <span style={{ fontSize: 15 }}>🕉️</span>
                {t.kuldeviName}
              </label>
              <select
                value={form.kuldeviName}
                onChange={e => setForm({ ...form, kuldeviName: e.target.value })}
                style={inputStyle(errors.kuldeviName)}
                onFocus={e => e.target.style.borderColor = '#6C3FC5'}
                onBlur={e => e.target.style.borderColor = errors.kuldeviName ? '#ef4444' : '#e8e0f5'}
              >
                <option value="">{t.kuldeviPlaceholder}</option>
                {kuldeviOptions.map(k => (
                  <option key={k._id} value={k.name}>{k.name}</option>
                ))}
              </select>
              {errors.kuldeviName && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.kuldeviName}</div>}
            </div>

            {/* Surapura */}
            <div className="mb-3">
              <label style={labelStyle}>
                <span style={{ fontSize: 15 }}>🏘️</span>
                {t.surapura}
              </label>
              <input
                type="text"
                value={form.surapura}
                onChange={e => setForm({ ...form, surapura: e.target.value })}
                placeholder={t.surapuraPlaceholder}
                style={inputStyle(errors.surapura)}
                onFocus={e => e.target.style.borderColor = '#6C3FC5'}
                onBlur={e => e.target.style.borderColor = errors.surapura ? '#ef4444' : '#e8e0f5'}
              />
              {errors.surapura && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.surapura}</div>}
            </div>

            {/* Contact */}
            <div className="mb-3">
              <label style={labelStyle}>
                <FiPhone size={14} style={{ color: '#6C3FC5' }} />
                {t.contactNumber}
              </label>
              <input
                type="tel"
                value={form.contactNumber}
                onChange={e => setForm({ ...form, contactNumber: e.target.value })}
                placeholder={t.contactPlaceholder}
                style={inputStyle(errors.contactNumber)}
                onFocus={e => e.target.style.borderColor = '#6C3FC5'}
                onBlur={e => e.target.style.borderColor = errors.contactNumber ? '#ef4444' : '#e8e0f5'}
              />
              {errors.contactNumber && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.contactNumber}</div>}
            </div>

            {/* Email (optional) */}
            <div className="mb-4">
              <label style={labelStyle}>
                <FiMail size={14} style={{ color: '#6C3FC5' }} />
                {t.emailOptional}
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                style={inputStyle(errors.email)}
                onFocus={e => e.target.style.borderColor = '#6C3FC5'}
                onBlur={e => e.target.style.borderColor = errors.email ? '#ef4444' : '#e8e0f5'}
              />
              {errors.email && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.email}</div>}
            </div>

            {/* Buttons */}
            <div className="d-flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                style={{
                  flex: 1, padding: '13px', borderRadius: 12, fontWeight: 600, fontSize: 14,
                  background: '#f1eeff', border: '2px solid #e0d5ff',
                  color: '#6C3FC5', cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
                }}
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{
                  flex: 2, padding: '13px', borderRadius: 12, fontWeight: 700, fontSize: 14,
                  background: saving ? '#a78bfa' : 'linear-gradient(135deg,#6C3FC5,#8B5CF6)',
                  border: 'none', color: '#fff', cursor: saving ? 'not-allowed' : 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  boxShadow: '0 4px 18px rgba(108,63,197,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                }}
              >
                <FiSave size={15} />
                {saving ? t.updatingProfile : t.updateProfile}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
