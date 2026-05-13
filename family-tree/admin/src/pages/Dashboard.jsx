import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUsers, FiGitMerge, FiCheckCircle, FiClock, FiUserCheck } from 'react-icons/fi';
import api from '../api/axios';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // Silently assign 6-digit codes to any nodes that don't have one yet
    api.post('/api/admin/migrate-codes').catch(() => {});
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/admin/stats');
      setStats(res.data.stats);
    } catch (err) {
      toast.error('Failed to load stats');
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

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border" style={{ color: '#6C3FC5', width: 48, height: 48 }} role="status" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: FiUsers,
      bg: 'linear-gradient(135deg, #6C3FC5, #8B5CF6)',
      light: '#ede9fe',
      link: '/users'
    },
    {
      label: 'Family Trees',
      value: stats?.totalTrees || 0,
      icon: FiGitMerge,
      bg: 'linear-gradient(135deg, #0891b2, #06b6d4)',
      light: '#e0f2fe',
      link: '/family-trees'
    },
    {
      label: 'Pending Approvals',
      value: stats?.pendingApprovals || 0,
      icon: FiUserCheck,
      bg: 'linear-gradient(135deg, #d97706, #f59e0b)',
      light: '#fef3c7',
      link: '/approvals'
    }
  ];

  return (
    <div>
      <div>
        <h4 className="page-title">Dashboard</h4>
        <p className="page-subtitle">Welcome back! Here's an overview of your family tree application.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((card) => (
          <Link to={card.link} key={card.label} style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ cursor: 'pointer' }}>
              <div className="stat-icon" style={{ background: card.bg }}>
                <card.icon size={24} color="#fff" />
              </div>
              <div>
                <div className="stat-value">{card.value}</div>
                <div className="stat-label">{card.label}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Users Table */}
      <div className="admin-table-card">
        <div className="admin-table-header">
          <h5>Recent Users</h5>
          <button
            style={{
              background: '#6C3FC5',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/users')}
          >
            View All
          </button>
        </div>

        {stats?.recentUsers?.length === 0 ? (
          <div className="empty-state">
            <FiUsers size={40} />
            <p>No users yet</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Mobile</th>
                  <th>City</th>
                  <th>Profile</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentUsers?.map((user) => (
                  <tr key={user._id} onClick={() => navigate(`/users/${user._id}`)}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="user-avatar">
                          {user.firstName ? user.firstName[0].toUpperCase() : (user.mobileNumber || '?')[0]}
                        </div>
                        <span className="fw-semibold">
                          {user.firstName ? `${user.firstName} ${user.lastName}` : '—'}
                        </span>
                      </div>
                    </td>
                    <td style={{ color: '#64748b' }}>{user.mobileNumber || '—'}</td>
                    <td>{user.city || '—'}</td>
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

export default Dashboard;
