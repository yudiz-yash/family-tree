import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiUserCheck, FiUserX, FiClock, FiMail, FiSearch } from 'react-icons/fi';
import api from '../api/axios';

function Approvals() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [processing, setProcessing] = useState(null);

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
    return u.email.toLowerCase().includes(q);
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
      <p className="page-subtitle">Review and approve or reject new user registrations.</p>

      <div className="admin-table-card">
        <div className="admin-table-header">
          <h5 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiClock size={18} color="#f59e0b" />
            Pending Requests ({users.length})
          </h5>
          <div className="input-group" style={{ width: 240 }}>
            <span className="input-group-text" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <FiSearch size={16} color="#94a3b8" />
            </span>
            <input
              type="text"
              className="form-control"
              style={{ border: '1px solid #e2e8f0', fontSize: 14 }}
              placeholder="Search by email..."
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
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Registered At</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="user-avatar">
                          {user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-semibold" style={{ fontSize: 14 }}>{user.email}</div>
                          <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <FiMail size={11} /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#64748b', fontSize: 13 }}>{formatDate(user.createdAt)}</td>
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        background: '#fef3c7', color: '#92400e',
                        fontSize: 12, fontWeight: 600,
                        padding: '4px 10px', borderRadius: 20
                      }}>
                        <FiClock size={11} /> Pending
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Approvals;
