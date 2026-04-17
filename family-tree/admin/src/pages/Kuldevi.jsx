import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import api from '../api/axios';

function Kuldevi() {
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => { fetchList(); }, []);

  const fetchList = async () => {
    try {
      const res = await api.get('/api/kuldevi');
      setList(res.data.kuldevis);
    } catch {
      toast.error('Failed to load list');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    try {
      const res = await api.post('/api/kuldevi', { name: name.trim() });
      setList(prev => [...prev, res.data.kuldevi].sort((a, b) => a.name.localeCompare(b.name)));
      setName('');
      toast.success('Added successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await api.delete(`/api/kuldevi/${id}`);
      setList(prev => prev.filter(k => k._id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Madh / Kuldevi</h1>
          <p className="page-subtitle">Manage the dropdown options shown on user profiles</p>
        </div>
      </div>

      {/* Add form */}
      <div className="card mb-4" style={{ maxWidth: 480 }}>
        <div className="card-body p-4">
          <h6 className="fw-bold mb-3" style={{ color: '#6C3FC5' }}>Add New Entry</h6>
          <form onSubmit={handleAdd} className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Khodiyar Maa"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ borderRadius: 10, border: '2px solid #e8e0f5', fontSize: 14 }}
            />
            <button
              type="submit"
              disabled={adding || !name.trim()}
              className="btn d-flex align-items-center gap-2 fw-semibold"
              style={{ background: '#6C3FC5', color: '#fff', borderRadius: 10, whiteSpace: 'nowrap', fontSize: 14 }}
            >
              <FiPlus size={16} /> {adding ? 'Adding…' : 'Add'}
            </button>
          </form>
        </div>
      </div>

      {/* List */}
      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: '#6C3FC5' }} role="status" />
            </div>
          ) : list.length === 0 ? (
            <div className="text-center py-5" style={{ color: '#888' }}>
              No entries yet. Add one above.
            </div>
          ) : (
            <table className="table table-hover mb-0">
              <thead style={{ background: '#f8f4ff' }}>
                <tr>
                  <th style={{ padding: '14px 20px', fontWeight: 700, color: '#4b4680', fontSize: 13 }}>#</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700, color: '#4b4680', fontSize: 13 }}>Name</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700, color: '#4b4680', fontSize: 13 }}>Added On</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700, color: '#4b4680', fontSize: 13 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map((k, i) => (
                  <tr key={k._id}>
                    <td style={{ padding: '13px 20px', color: '#888', fontSize: 14 }}>{i + 1}</td>
                    <td style={{ padding: '13px 20px', fontWeight: 600, fontSize: 14 }}>{k.name}</td>
                    <td style={{ padding: '13px 20px', color: '#888', fontSize: 13 }}>
                      {new Date(k.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '13px 20px' }}>
                      <button
                        onClick={() => handleDelete(k._id)}
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Kuldevi;
