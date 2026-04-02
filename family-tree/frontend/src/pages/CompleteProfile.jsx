import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUser, FiMapPin, FiPhone, FiStar } from 'react-icons/fi';
import api from '../api/axios';

function CompleteProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    city: '',
    kuldeviName: '',
    contactNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.kuldeviName.trim()) errs.kuldeviName = 'Kuldevi name is required';
    if (!form.contactNumber.trim()) errs.contactNumber = 'Contact number is required';
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
      toast.success('Profile completed!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save profile';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="text-center mb-4">
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #6C3FC5, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <FiUser size={30} color="#fff" />
          </div>
          <h3 style={{ color: '#6C3FC5', fontWeight: 700, marginBottom: 4 }}>Complete Your Profile</h3>
          <p style={{ color: '#888', fontSize: 14 }}>Tell us a bit about yourself to get started</p>
        </div>

        <div className="step-indicator">
          <div className="step-dot"></div>
          <div className="step-dot active"></div>
          <div className="step-dot"></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                placeholder="John"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
              {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
            </div>
            <div className="col-6 mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                placeholder="Doe"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
              {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">
              <FiMapPin size={14} className="me-1" style={{ color: '#6C3FC5' }} />
              City
            </label>
            <input
              type="text"
              className={`form-control ${errors.city ? 'is-invalid' : ''}`}
              placeholder="Your city"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            {errors.city && <div className="invalid-feedback">{errors.city}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">
              <FiStar size={14} className="me-1" style={{ color: '#6C3FC5' }} />
              Kuldevi Name
            </label>
            <input
              type="text"
              className={`form-control ${errors.kuldeviName ? 'is-invalid' : ''}`}
              placeholder="Your kuldevi / family deity"
              value={form.kuldeviName}
              onChange={(e) => setForm({ ...form, kuldeviName: e.target.value })}
            />
            {errors.kuldeviName && <div className="invalid-feedback">{errors.kuldeviName}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label">
              <FiPhone size={14} className="me-1" style={{ color: '#6C3FC5' }} />
              Contact Number
            </label>
            <input
              type="tel"
              className={`form-control ${errors.contactNumber ? 'is-invalid' : ''}`}
              placeholder="+91 9876543210"
              value={form.contactNumber}
              onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
            />
            {errors.contactNumber && <div className="invalid-feedback">{errors.contactNumber}</div>}
          </div>

          <button type="submit" className="btn-primary-custom" disabled={loading}>
            {loading ? 'Saving...' : 'Save & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompleteProfile;
