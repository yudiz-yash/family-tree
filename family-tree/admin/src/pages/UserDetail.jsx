import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiArrowLeft, FiUser, FiMail, FiMapPin, FiPhone, FiCheckCircle, FiClock, FiGitMerge,
  FiLock, FiEye, FiEyeOff, FiKey
} from 'react-icons/fi';
import api from '../api/axios';
import FamilyTreeFlow from '../components/FamilyTreeFlow';

function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showPlain, setShowPlain] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await api.get(`/api/admin/users/${id}`);
      setData(res.data.user);
    } catch (err) {
      toast.error('Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setResetting(true);
    try {
      await api.put(`/api/admin/users/${id}/reset-password`, { newPassword });
      toast.success('Password reset successfully');
      setNewPassword('');
      setConfirmPassword('');
      fetchUser();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to reset password');
    } finally {
      setResetting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border" style={{ color: '#6C3FC5', width: 48, height: 48 }} role="status" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="empty-state">
        <FiUser size={40} />
        <p>User not found</p>
      </div>
    );
  }

  const user = data;
  const tree = data.familyTree;

  return (
    <div>
      <button className="back-btn" onClick={() => navigate('/users')}>
        <FiArrowLeft size={16} /> Back to Users
      </button>

      <div className="d-flex align-items-center gap-3 mb-4">
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6C3FC5, #8B5CF6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            color: '#fff',
            fontWeight: 700,
            flexShrink: 0
          }}
        >
          {user.firstName ? user.firstName[0].toUpperCase() : (user.mobileNumber || '?')[0]}
        </div>
        <div>
          <h4 className="page-title mb-0">
            {user.firstName ? `${user.firstName} ${user.lastName}` : 'User'}
          </h4>
          <p className="page-subtitle mb-0">{user.mobileNumber || '—'}</p>
        </div>
        <div className="ms-auto">
          {user.profileCompleted ? (
            <span className="badge-success" style={{ padding: '6px 14px', borderRadius: 20 }}>
              <FiCheckCircle size={13} /> Profile Complete
            </span>
          ) : (
            <span className="badge-warning" style={{ padding: '6px 14px', borderRadius: 20 }}>
              <FiClock size={13} /> Profile Pending
            </span>
          )}
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* User Info Card */}
        <div className="col-12">
          <div className="info-card">
            <h6 style={{ fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
              <FiUser size={16} className="me-2" style={{ color: '#6C3FC5' }} />
              User Information
            </h6>

            <div className="row">
              {[
                { icon: FiPhone, label: 'Mobile', value: user.mobileNumber || '—' },
                { icon: FiMail, label: 'Email', value: user.email || '—' },
                { icon: FiUser, label: 'First Name', value: user.firstName || '—' },
                { icon: FiUser, label: 'Last Name', value: user.lastName || '—' },
                { icon: FiMapPin, label: 'City', value: user.city || '—' },
                { label: 'Kuldevi', value: user.kuldeviName || '—', emoji: '🕉️' },
                { label: 'Surapura', value: user.surapura || '—', emoji: '🏘️' },
                { icon: FiPhone, label: 'Contact', value: user.contactNumber || '—' },
                { label: 'Joined', value: formatDate(user.createdAt), emoji: '📅' }
              ].map((row) => (
                <div className="col-lg-6" key={row.label}>
                  <div className="info-row">
                    <span className="info-label d-flex align-items-center gap-1">
                      {row.icon ? <row.icon size={13} style={{ color: '#94a3b8' }} /> : row.emoji || ''}
                      {row.label}
                    </span>
                    <span className="info-value">{row.value}</span>
                  </div>
                </div>
              ))}
              <div className="col-lg-6">
                <div className="info-row">
                  <span className="info-label d-flex align-items-center gap-1">
                    <FiKey size={13} style={{ color: '#94a3b8' }} />
                    Password
                  </span>
                  <span className="info-value d-flex align-items-center gap-2">
                    {user.plainPassword
                      ? (showPlain ? user.plainPassword : '••••••••')
                      : '—'}
                    {user.plainPassword && (
                      <button
                        type="button"
                        onClick={() => setShowPlain(v => !v)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, lineHeight: 1 }}
                        title={showPlain ? 'Hide password' : 'Show password'}
                      >
                        {showPlain ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                      </button>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Password Card */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="info-card">
            <h6 style={{ fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>
              <FiLock size={16} className="me-2" style={{ color: '#6C3FC5' }} />
              Reset User Password
            </h6>
            <form onSubmit={handleResetPassword}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6, display: 'block' }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNew ? 'text' : 'password'}
                      className="form-control"
                      style={{ border: '1px solid #e2e8f0', fontSize: 14, paddingRight: 40 }}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(v => !v)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}
                    >
                      {showNew ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="col-md-6">
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6, display: 'block' }}>
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      className="form-control"
                      style={{ border: '1px solid #e2e8f0', fontSize: 14, paddingRight: 40 }}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(v => !v)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}
                    >
                      {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="col-12">
                  <button
                    type="submit"
                    disabled={resetting}
                    style={{
                      background: 'linear-gradient(135deg, #6C3FC5, #8B5CF6)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 22px',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: resetting ? 'not-allowed' : 'pointer',
                      opacity: resetting ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <FiLock size={14} />
                    {resetting ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Tree Visualization */}
      {tree && tree.nodes && tree.nodes.length > 0 && (
        <div className="info-card">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 style={{ fontWeight: 700, color: '#1e293b', margin: 0 }}>
              <FiGitMerge size={16} className="me-2" style={{ color: '#6C3FC5' }} />
              Family Tree Visualization
            </h6>
            <div className="d-flex gap-3" style={{ fontSize: 12, color: '#64748b' }}>
              <span>
                <span
                  style={{
                    display: 'inline-block',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: '#6C3FC5',
                    marginRight: 4
                  }}
                />
                Root
              </span>
              <span>
                <span
                  style={{
                    display: 'inline-block',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: '#4a9eff',
                    marginRight: 4
                  }}
                />
                Male
              </span>
            </div>
          </div>
          <FamilyTreeFlow nodes={tree.nodes} />
        </div>
      )}
    </div>
  );
}

export default UserDetail;
