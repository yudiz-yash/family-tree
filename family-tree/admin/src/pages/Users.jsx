import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUsers, FiCheckCircle, FiClock, FiGitMerge, FiSearch, FiTrash2, FiUserCheck, FiUserX } from 'react-icons/fi';
import api from '../api/axios';

function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/admin/users');
      setUsers(res.data.users);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleDeleteUser = async (e, userId) => {
    e.stopPropagation();
    if (!window.confirm('Permanently delete this user and their family tree? This cannot be undone.')) return;
    try {
      await api.delete(`/api/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.mobileNumber && u.mobileNumber.includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.firstName && u.firstName.toLowerCase().includes(q)) ||
      (u.lastName && u.lastName.toLowerCase().includes(q)) ||
      (u.city && u.city.toLowerCase().includes(q))
    );
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
      <h4 className="page-title">Users</h4>
      <p className="page-subtitle">Manage all registered users and their family trees.</p>

      <div className="admin-table-card">
        <div className="admin-table-header">
          <h5>All Users ({users.length})</h5>
          <div className="d-flex align-items-center gap-2">
            <div className="input-group" style={{ width: 240 }}>
              <span className="input-group-text" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <FiSearch size={16} color="#94a3b8" />
              </span>
              <input
                type="text"
                className="form-control"
                style={{ border: '1px solid #e2e8f0', fontSize: 14 }}
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <FiUsers size={40} />
            <p>{search ? 'No users match your search' : 'No users registered yet'}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>City</th>
                  <th>Kuldevi</th>
                  <th>Contact</th>
                  <th>Account</th>
                  <th>Tree Status</th>
                  <th>Profile</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user._id} onClick={() => navigate(`/users/${user._id}`)}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="user-avatar">
                          {user.firstName
                            ? user.firstName[0].toUpperCase()
                            : (user.mobileNumber || '?')[0]}
                        </div>
                        <span className="fw-semibold">
                          {user.firstName ? `${user.firstName} ${user.lastName}` : '—'}
                        </span>
                      </div>
                    </td>
                    <td style={{ color: '#64748b' }}>{user.mobileNumber || '—'}</td>
                    <td>{user.city || '—'}</td>
                    <td>{user.kuldeviName || '—'}</td>
                    <td>{user.contactNumber || '—'}</td>
                    <td>
                      {user.status === 'pending' ? (
                        <span style={{ display:'inline-flex', alignItems:'center', gap:4, background:'#fef3c7', color:'#92400e', fontSize:11, fontWeight:600, padding:'3px 8px', borderRadius:20 }}>
                          <FiClock size={10} /> Pending
                        </span>
                      ) : user.status === 'rejected' ? (
                        <span style={{ display:'inline-flex', alignItems:'center', gap:4, background:'#fee2e2', color:'#dc2626', fontSize:11, fontWeight:600, padding:'3px 8px', borderRadius:20 }}>
                          <FiUserX size={10} /> Rejected
                        </span>
                      ) : (
                        <span style={{ display:'inline-flex', alignItems:'center', gap:4, background:'#dcfce7', color:'#16a34a', fontSize:11, fontWeight:600, padding:'3px 8px', borderRadius:20 }}>
                          <FiUserCheck size={10} /> Approved
                        </span>
                      )}
                    </td>
                    <td>
                      {user.familyTree ? (
                        <span className="badge-info">
                          <FiGitMerge size={12} />
                          {user.familyTree.nodes?.length || 0} nodes
                        </span>
                      ) : (
                        <span className="badge-warning">No Tree</span>
                      )}
                    </td>
                    <td>
                      {user.profileCompleted ? (
                        <span className="badge-success">
                          <FiCheckCircle size={12} /> Complete
                        </span>
                      ) : (
                        <span className="badge-warning">
                          <FiClock size={12} /> Pending
                        </span>
                      )}
                    </td>
                    <td style={{ color: '#64748b' }}>{formatDate(user.createdAt)}</td>
                    <td>
                      <button
                        onClick={(e) => handleDeleteUser(e, user._id)}
                        className="btn btn-sm d-flex align-items-center gap-1"
                        style={{ background: '#fff0f0', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 8, fontSize: 13 }}
                      >
                        <FiTrash2 size={13} /> Delete
                      </button>
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

export default Users;
