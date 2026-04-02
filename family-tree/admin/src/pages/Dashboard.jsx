import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUsers, FiGitMerge, FiCheckCircle, FiClock } from 'react-icons/fi';
import api from '../api/axios';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
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
      light: '#ede9fe'
    },
    {
      label: 'Family Trees',
      value: stats?.totalTrees || 0,
      icon: FiGitMerge,
      bg: 'linear-gradient(135deg, #0891b2, #06b6d4)',
      light: '#e0f2fe'
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
          <div className="stat-card" key={card.label}>
            <div
              className="stat-icon"
              style={{ background: card.bg }}
            >
              <card.icon size={24} color="#fff" />
            </div>
            <div>
              <div className="stat-value">{card.value}</div>
              <div className="stat-label">{card.label}</div>
            </div>
          </div>
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
                  <th>Email</th>
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
                          {user.firstName ? user.firstName[0].toUpperCase() : user.email[0].toUpperCase()}
                        </div>
                        <span className="fw-semibold">
                          {user.firstName ? `${user.firstName} ${user.lastName}` : '—'}
                        </span>
                      </div>
                    </td>
                    <td style={{ color: '#64748b' }}>{user.email}</td>
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
