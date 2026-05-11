import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  FiUserCheck, FiUserX, FiClock, FiSearch,
  FiMail, FiUser, FiMapPin, FiPhone, FiChevronDown, FiChevronUp, FiCreditCard
} from 'react-icons/fi';
import api from '../api/axios';

function Approvals() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [processing, setProcessing] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await api.get('/api/admin/users');
      setUsers(res.data.users.filter(u => u.status === 'pending'));
    } catch {
      toast.error('Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const handleApprove = async (userId) => {
    setProcessing(userId + '_approve');
    try {
      await api.put(`/api/admin/users/${userId}/approve`);
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success('User approved and notified via email');
    } catch {
      toast.error('Failed to approve user');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm('Reject this registration request? The user will be notified via email.')) return;
    setProcessing(userId + '_reject');
    try {
      await api.put(`/api/admin/users/${userId}/reject`);
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success('User rejected and notified via email');
    } catch {
      toast.error('Failed to reject user');
    } finally {
      setProcessing(null);
    }
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const name = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    return u.email.toLowerCase().includes(q) || name.includes(q) || (u.city || '').toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border" style={{ color: '#6C3FC5', width: 48, height: 48 }} role="status" />
      </div>
    );
  }

  return (
    <div>
      <h4 className="page-title">Approval Requests</h4>
      <p className="page-subtitle">Review user profiles and approve or reject registration requests.</p>

      <div className="admin-table-card">
        <div className="admin-table-header">
          <h5 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiClock size={18} color="#f59e0b" />
            Pending Requests ({users.length})
          </h5>
          <div className="input-group" style={{ width: 260 }}>
            <span className="input-group-text" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <FiSearch size={16} color="#94a3b8" />
            </span>
            <input
              type="text"
              className="form-control"
              style={{ border: '1px solid #e2e8f0', fontSize: 14 }}
              placeholder="Search by name, email or city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <FiUserCheck size={44} />
            <p>{search ? 'No requests match your search' : 'No pending approval requests'}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '4px 0' }}>
            {filtered.map(user => {
              const isExpanded = expanded === user._id;
              const hasProfile = user.profileCompleted;
              const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');

              return (
                <div key={user._id} style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 14,
                  overflow: 'hidden',
                  background: '#fff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
                }}>
                  {/* Card header row */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 18px',
                    background: isExpanded ? '#fafaf8' : '#fff'
                  }}>
                    {/* Avatar */}
                    <div className="user-avatar" style={{ flexShrink: 0 }}>
                      {(user.firstName || user.email)[0].toUpperCase()}
                    </div>

                    {/* Name + email */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>
                        {fullName || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Profile not filled</span>}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <FiMail size={11} /> {user.email}
                      </div>
                    </div>

                    {/* Registered date */}
                    <div style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {formatDate(user.createdAt)}
                    </div>

                    {/* Profile badge */}
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      background: hasProfile ? '#dcfce7' : '#fef3c7',
                      color: hasProfile ? '#16a34a' : '#92400e',
                      fontSize: 11, fontWeight: 600,
                      padding: '3px 10px', borderRadius: 20, flexShrink: 0
                    }}>
                      {hasProfile ? '✓ Profile Complete' : '⏳ Profile Pending'}
                    </span>

                    {/* Payment badge */}
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      background: user.paymentDone ? '#dbeafe' : '#fff7ed',
                      color: user.paymentDone ? '#1d4ed8' : '#c2410c',
                      fontSize: 11, fontWeight: 600,
                      padding: '3px 10px', borderRadius: 20, flexShrink: 0
                    }}>
                      {user.paymentDone ? '💳 Payment Done' : '⏳ Payment Pending'}
                    </span>

                    {/* Expand toggle */}
                    {hasProfile && (
                      <button
                        onClick={() => setExpanded(isExpanded ? null : user._id)}
                        style={{
                          background: '#f1f5f9', border: 'none', borderRadius: 8,
                          padding: '6px 10px', cursor: 'pointer', color: '#64748b',
                          display: 'flex', alignItems: 'center', gap: 4, fontSize: 12,
                          flexShrink: 0
                        }}
                      >
                        {isExpanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                        {isExpanded ? 'Hide' : 'Details'}
                      </button>
                    )}

                    {/* Action buttons */}
                    <div className="d-flex gap-2" style={{ flexShrink: 0 }}>
                      <button
                        className="btn btn-sm d-inline-flex align-items-center gap-1"
                        style={{
                          background: '#dcfce7', color: '#16a34a',
                          border: '1px solid #bbf7d0', borderRadius: 8,
                          fontSize: 12, fontWeight: 600, padding: '5px 12px'
                        }}
                        disabled={!!processing}
                        onClick={() => handleApprove(user._id)}
                      >
                        <FiUserCheck size={13} />
                        {processing === user._id + '_approve' ? 'Approving…' : 'Approve'}
                      </button>
                      <button
                        className="btn btn-sm d-inline-flex align-items-center gap-1"
                        style={{
                          background: '#fff0f0', color: '#dc2626',
                          border: '1px solid #fecaca', borderRadius: 8,
                          fontSize: 12, fontWeight: 600, padding: '5px 12px'
                        }}
                        disabled={!!processing}
                        onClick={() => handleReject(user._id)}
                      >
                        <FiUserX size={13} />
                        {processing === user._id + '_reject' ? 'Rejecting…' : 'Reject'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded profile details */}
                  {isExpanded && hasProfile && (
                    <div style={{
                      padding: '14px 18px 18px',
                      borderTop: '1px solid #f1f5f9',
                      background: '#fafaf8'
                    }}>
                      <div className="row g-3">
                        {[
                          { icon: FiUser, label: 'Full Name', value: fullName },
                          { icon: FiMail, label: 'Email', value: user.email },
                          { icon: FiMapPin, label: 'City', value: user.city },
                          { emoji: '🕉️', label: 'Kuldevi / Madh', value: user.kuldeviName },
                          { emoji: '🏘️', label: 'Surapura', value: user.surapura },
                          { icon: FiPhone, label: 'Contact', value: user.contactNumber },
                          { icon: FiCreditCard, label: 'Payment', value: user.paymentDone ? '✓ Completed' : '⏳ Pending', highlight: user.paymentDone }
                        ].map(row => (
                          <div className="col-sm-6 col-lg-4" key={row.label}>
                            <div style={{
                              background: '#fff', borderRadius: 10,
                              padding: '10px 14px',
                              border: '1px solid #e2e8f0'
                            }}>
                              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                                {row.icon
                                  ? <row.icon size={11} />
                                  : <span style={{ fontSize: 13 }}>{row.emoji}</span>
                                }
                                {row.label}
                              </div>
                              <div style={{ fontWeight: 600, fontSize: 13, color: row.highlight === true ? '#16a34a' : row.highlight === false ? '#c2410c' : '#1e293b' }}>
                                {row.value || '—'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Approvals;
