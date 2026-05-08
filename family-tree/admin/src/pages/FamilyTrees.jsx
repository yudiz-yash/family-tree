import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiGitMerge, FiSearch, FiEye, FiTrash2 } from 'react-icons/fi';
import api from '../api/axios';

function FamilyTrees() {
  const navigate = useNavigate();
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedTreeId, setExpandedTreeId] = useState(null);

  useEffect(() => {
    fetchTrees();
  }, []);

  const fetchTrees = async () => {
    try {
      const res = await api.get('/api/admin/family-trees');
      setTrees(res.data.trees);
    } catch (err) {
      toast.error('Failed to load family trees');
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

  const handleDeleteTree = async (e, treeId) => {
    e.stopPropagation();
    if (!window.confirm('Permanently delete this family tree? This cannot be undone.')) return;
    try {
      await api.delete(`/api/admin/family-trees/${treeId}`);
      setTrees(prev => prev.filter(t => t._id !== treeId));
      toast.success('Tree deleted');
    } catch {
      toast.error('Failed to delete tree');
    }
  };

  const filtered = trees.filter((t) => {
    const q = search.toLowerCase();
    const userName = t.userId
      ? `${t.userId.firstName || ''} ${t.userId.lastName || ''}`.toLowerCase()
      : '';
    const email = t.userId?.email?.toLowerCase() || '';
    return userName.includes(q) || email.includes(q);
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
      <h4 className="page-title">Family Trees</h4>
      <p className="page-subtitle">View all family trees created by users.</p>

      <div className="admin-table-card">
        <div className="admin-table-header">
          <h5>All Trees ({trees.length})</h5>
          <div className="input-group" style={{ width: 260 }}>
            <span className="input-group-text" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <FiSearch size={16} color="#94a3b8" />
            </span>
            <input
              type="text"
              className="form-control"
              style={{ border: '1px solid #e2e8f0', fontSize: 14 }}
              placeholder="Search by user name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <FiGitMerge size={40} />
            <p>{search ? 'No trees match your search' : 'No family trees created yet'}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Members</th>
                  <th>Male</th>
                  <th>Female</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tree) => (
                  <tr
                    key={tree._id}
                    onClick={() => tree.userId?._id && navigate(`/users/${tree.userId._id}`)}
                  >
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="user-avatar">
                          {tree.userId?.firstName
                            ? tree.userId.firstName[0].toUpperCase()
                            : tree.userId?.email?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="fw-semibold">
                          {tree.userId?.firstName
                            ? `${tree.userId.firstName} ${tree.userId.lastName}`
                            : '—'}
                        </span>
                      </div>
                    </td>
                    <td style={{ color: '#64748b' }}>{tree.userId?.email || '—'}</td>
                    <td>
                      <span className="badge-info">
                        <FiGitMerge size={12} />
                        {tree.nodes?.length || 0}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: '#1d4ed8', fontWeight: 600 }}>
                        {tree.nodes?.filter((n) => n.gender === 'male').length || 0}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: '#be185d', fontWeight: 600 }}>
                        {tree.nodes?.filter((n) => n.gender === 'female').length || 0}
                      </span>
                    </td>
                    <td style={{ color: '#64748b' }}>{formatDate(tree.createdAt)}</td>
                    <td style={{ color: '#64748b' }}>{formatDate(tree.updatedAt)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm d-inline-flex align-items-center gap-1"
                          style={{
                            background: '#ede9fe',
                            color: '#6C3FC5',
                            border: 'none',
                            borderRadius: 8,
                            padding: '5px 10px',
                            fontSize: 12,
                            fontWeight: 600
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (tree.userId?._id) navigate(`/users/${tree.userId._id}`);
                          }}
                        >
                          <FiEye size={13} /> View
                        </button>
                        <button
                          className="btn btn-sm d-inline-flex align-items-center gap-1"
                          style={{ background: '#fff0f0', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 8, fontSize: 12, fontWeight: 600, padding: '5px 10px' }}
                          onClick={(e) => handleDeleteTree(e, tree._id)}
                        >
                          <FiTrash2 size={13} /> Delete
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

export default FamilyTrees;
