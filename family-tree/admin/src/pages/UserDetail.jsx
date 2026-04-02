import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiArrowLeft, FiUser, FiMail, FiMapPin, FiPhone, FiCheckCircle, FiClock, FiGitMerge
} from 'react-icons/fi';
import api from '../api/axios';
import FamilyTreeFlow from '../components/FamilyTreeFlow';

function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
          {user.firstName ? user.firstName[0].toUpperCase() : user.email[0].toUpperCase()}
        </div>
        <div>
          <h4 className="page-title mb-0">
            {user.firstName ? `${user.firstName} ${user.lastName}` : 'User'}
          </h4>
          <p className="page-subtitle mb-0">{user.email}</p>
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
        <div className="col-lg-5">
          <div className="info-card">
            <h6 style={{ fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
              <FiUser size={16} className="me-2" style={{ color: '#6C3FC5' }} />
              User Information
            </h6>

            {[
              { icon: FiMail, label: 'Email', value: user.email },
              { icon: FiUser, label: 'First Name', value: user.firstName || '—' },
              { icon: FiUser, label: 'Last Name', value: user.lastName || '—' },
              { icon: FiMapPin, label: 'City', value: user.city || '—' },
              { label: 'Kuldevi', value: user.kuldeviName || '—', emoji: '🕉️' },
              { icon: FiPhone, label: 'Contact', value: user.contactNumber || '—' },
              { label: 'Joined', value: formatDate(user.createdAt), emoji: '📅' }
            ].map((row) => (
              <div className="info-row" key={row.label}>
                <span className="info-label d-flex align-items-center gap-1">
                  {row.icon ? <row.icon size={13} style={{ color: '#94a3b8' }} /> : row.emoji || ''}
                  {row.label}
                </span>
                <span className="info-value">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tree Stats */}
        <div className="col-lg-7">
          <div className="info-card h-100">
            <h6 style={{ fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>
              <FiGitMerge size={16} className="me-2" style={{ color: '#6C3FC5' }} />
              Family Tree Overview
            </h6>

            {tree ? (
              <>
                <div className="row g-3 mb-3">
                  {[
                    {
                      label: 'Total Members',
                      value: tree.nodes?.length || 0,
                      color: '#6C3FC5',
                      bg: '#ede9fe'
                    },
                    {
                      label: 'Male Members',
                      value: tree.nodes?.filter((n) => n.gender === 'male').length || 0,
                      color: '#1d4ed8',
                      bg: '#dbeafe'
                    },
                    {
                      label: 'Female Members',
                      value: tree.nodes?.filter((n) => n.gender === 'female').length || 0,
                      color: '#be185d',
                      bg: '#fce7f3'
                    }
                  ].map((s) => (
                    <div className="col-4" key={s.label}>
                      <div
                        style={{
                          background: s.bg,
                          borderRadius: 12,
                          padding: '14px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 13, color: '#64748b' }}>
                  <span>Created: {formatDate(tree.createdAt)}</span>
                  <span className="mx-2">•</span>
                  <span>Updated: {formatDate(tree.updatedAt)}</span>
                </div>
              </>
            ) : (
              <div className="empty-state" style={{ minHeight: 'auto', padding: '20px' }}>
                <FiGitMerge size={32} />
                <p style={{ fontSize: 14 }}>No family tree created yet</p>
              </div>
            )}
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
              <span>
                <span
                  style={{
                    display: 'inline-block',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: '#e91e8c',
                    marginRight: 4
                  }}
                />
                Female
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
