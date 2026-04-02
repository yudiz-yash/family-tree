import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiPlus, FiEdit2, FiTrash2, FiSave, FiArrowLeft, FiUsers, FiX, FiGitMerge, FiUserPlus, FiUser
} from 'react-icons/fi';
import Navbar from '../components/Navbar';
import FamilyTreeFlow from '../components/FamilyTreeFlow';
import api from '../api/axios';

function generateNodeId() {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function deleteNodeAndDescendants(nodes, nodeId) {
  const toDelete = new Set();
  function collect(id) {
    toDelete.add(id);
    nodes.forEach((n) => { if (n.parentId === id) collect(n.nodeId); });
  }
  collect(nodeId);
  return nodes.filter((n) => !toDelete.has(n.nodeId));
}

const INITIAL_FORM = { name: '', nickname: '', gender: 'male' };

/* ─── Member Modal ─────────────────────────────────────────────── */
function NodeModal({ open, onClose, onSave, title, initialData }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) { setForm(initialData || INITIAL_FORM); setErrors({}); }
  }, [open, initialData]);

  if (!open) return null;

  const handleSave = () => {
    if (!form.name.trim()) { setErrors({ name: 'Name is required' }); return; }
    onSave(form);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: 16
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 420,
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)'
      }} onClick={e => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0 fw-bold" style={{ color: '#6C3FC5' }}>{title}</h5>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 4 }}>
            <FiX size={20} />
          </button>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold" style={{ color: '#444' }}>
            Name <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            placeholder="Full name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            autoFocus
            style={{ borderRadius: 10, border: '2px solid #e8e0f5', padding: '10px 14px' }}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold" style={{ color: '#444' }}>Nickname (optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Baba, Dadi, Chiku..."
            value={form.nickname}
            onChange={e => setForm({ ...form, nickname: e.target.value })}
            style={{ borderRadius: 10, border: '2px solid #e8e0f5', padding: '10px 14px' }}
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold" style={{ color: '#444' }}>Gender</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['male', 'female', 'other'].map(g => (
              <div
                key={g}
                onClick={() => setForm({ ...form, gender: g })}
                style={{
                  flex: 1, padding: '10px 8px', borderRadius: 10, textAlign: 'center',
                  cursor: 'pointer', fontWeight: 600, fontSize: 13, textTransform: 'capitalize',
                  border: `2px solid ${form.gender === g ? (g === 'male' ? '#3b82f6' : g === 'female' ? '#ec4899' : '#8b5cf6') : '#e8e0f5'}`,
                  background: form.gender === g
                    ? g === 'male' ? '#eff6ff' : g === 'female' ? '#fdf2f8' : '#f5f3ff'
                    : '#fafafa',
                  color: form.gender === g
                    ? g === 'male' ? '#1d4ed8' : g === 'female' ? '#be185d' : '#5b21b6'
                    : '#888',
                  transition: 'all 0.15s'
                }}
              >
                {g === 'male' ? '♂ Male' : g === 'female' ? '♀ Female' : '⚧ Other'}
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex gap-2">
          <button className="btn flex-fill fw-semibold"
            style={{ border: '2px solid #e8e0f5', borderRadius: 10, padding: '10px', color: '#666' }}
            onClick={onClose}>Cancel</button>
          <button className="btn flex-fill fw-semibold"
            style={{ background: 'linear-gradient(135deg,#6C3FC5,#4c1d95)', color: '#fff', borderRadius: 10, padding: '10px', border: 'none' }}
            onClick={handleSave}>Save Member</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Floating Action Panel ────────────────────────────────────── */
function ActionPanel({ selectedNode, nodes, onAdd, onEdit, onDelete, onSave, saving }) {
  const btnBase = {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '9px 14px', borderRadius: 10, fontWeight: 600,
    fontSize: 13, cursor: 'pointer', border: 'none', width: '100%',
    transition: 'opacity 0.15s'
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: 18,
      padding: 18,
      boxShadow: '0 8px 32px rgba(108,63,197,0.18)',
      border: '1px solid #e8e0f5',
      display: 'flex', flexDirection: 'column', gap: 8,
      minWidth: 210
    }}>
      {/* Add root */}
      <button style={{ ...btnBase, background: '#f5f0ff', color: '#6C3FC5' }}
        onClick={() => onAdd('root')}>
        <FiPlus size={15} /> Add Root Member
      </button>

      <div style={{ height: 1, background: '#f0e8ff', margin: '2px 0' }} />

      {/* Add relative — only when something selected */}
      <button
        style={{ ...btnBase, background: selectedNode ? '#eff6ff' : '#f9f9f9', color: selectedNode ? '#1d4ed8' : '#bbb' }}
        disabled={!selectedNode} onClick={() => onAdd('child')}>
        <FiUserPlus size={15} /> Add Child
      </button>
      <button
        style={{ ...btnBase, background: selectedNode ? '#f0fdf4' : '#f9f9f9', color: selectedNode ? '#15803d' : '#bbb' }}
        disabled={!selectedNode} onClick={() => onAdd('sibling')}>
        <FiUsers size={15} /> Add Sibling
      </button>
      <button
        style={{ ...btnBase, background: selectedNode ? '#fdf4ff' : '#f9f9f9', color: selectedNode ? '#7e22ce' : '#bbb' }}
        disabled={!selectedNode} onClick={() => onAdd('parent')}>
        <FiUser size={15} /> Add Parent
      </button>

      {/* Selected info + edit/delete */}
      {selectedNode && (
        <>
          <div style={{ height: 1, background: '#f0e8ff', margin: '2px 0' }} />
          <div style={{
            background: '#f8f4ff', borderRadius: 10, padding: '10px 12px',
            borderLeft: '3px solid #6C3FC5'
          }}>
            <div style={{ fontSize: 11, color: '#6C3FC5', fontWeight: 700, marginBottom: 3 }}>SELECTED</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a2e' }}>{selectedNode.name}</div>
            {selectedNode.nickname && (
              <div style={{ fontSize: 11, color: '#888', fontStyle: 'italic' }}>"{selectedNode.nickname}"</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              style={{ ...btnBase, flex: 1, background: '#fffbeb', color: '#92400e', justifyContent: 'center' }}
              onClick={() => onEdit(selectedNode.nodeId)}>
              <FiEdit2 size={13} /> Edit
            </button>
            <button
              style={{ ...btnBase, flex: 1, background: '#fff1f2', color: '#be123c', justifyContent: 'center' }}
              onClick={() => onDelete(selectedNode.nodeId)}>
              <FiTrash2 size={13} /> Delete
            </button>
          </div>
        </>
      )}

      {!selectedNode && nodes.length > 0 && (
        <div style={{ fontSize: 12, color: '#aaa', textAlign: 'center', padding: '4px 0' }}>
          Click a node to select
        </div>
      )}

      <div style={{ height: 1, background: '#f0e8ff', margin: '2px 0' }} />

      <button
        style={{ ...btnBase, background: nodes.length === 0 ? '#f0f0f0' : 'linear-gradient(135deg,#6C3FC5,#4c1d95)', color: nodes.length === 0 ? '#bbb' : '#fff', justifyContent: 'center' }}
        disabled={nodes.length === 0 || saving}
        onClick={onSave}>
        <FiSave size={14} /> {saving ? 'Saving…' : 'Save Tree'}
      </button>
    </div>
  );
}

/* ─── Empty state ──────────────────────────────────────────────── */
function EmptyTree({ onAddRoot }) {
  return (
    <div style={{
      width: '100%', height: 620,
      background: 'linear-gradient(135deg,#f5f0ff 0%,#eef2ff 100%)',
      borderRadius: 16, border: '2px dashed #c4b5fd',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16
    }}>
      <div style={{ fontSize: 64 }}>👨‍👩‍👧‍👦</div>
      <h5 style={{ color: '#6C3FC5', fontWeight: 700, margin: 0 }}>Start Your Family Tree</h5>
      <p style={{ color: '#888', fontSize: 14, margin: 0 }}>Add the first member to begin</p>
      <button
        onClick={onAddRoot}
        style={{
          background: 'linear-gradient(135deg,#6C3FC5,#4c1d95)', color: '#fff',
          border: 'none', borderRadius: 12, padding: '12px 28px',
          fontWeight: 700, fontSize: 15, cursor: 'pointer',
          boxShadow: '0 4px 18px rgba(108,63,197,0.35)'
        }}>
        <FiPlus style={{ marginRight: 8 }} />Add Root Member
      </button>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────────── */
export default function FamilyTreeBuilder() {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, title: '', type: null, editNodeId: null, initialData: null });

  useEffect(() => { fetchTree(); }, []);

  const fetchTree = async () => {
    try {
      const res = await api.get('/api/family-tree');
      if (res.data.tree?.nodes?.length) {
        setNodes(res.data.tree.nodes);
        setViewMode(true);
      }
    } catch { toast.error('Failed to load family tree'); }
    finally { setLoading(false); }
  };

  const selectedNode = nodes.find(n => n.nodeId === selectedNodeId) || null;

  const openAddModal = (type) => {
    if (type !== 'root' && !selectedNodeId) { toast.error('Select a member first'); return; }
    const titles = { root: 'Add Root Member', child: 'Add Child', sibling: 'Add Brother / Sister', parent: 'Add Parent' };
    setModal({ open: true, title: titles[type], type, editNodeId: null, initialData: null });
  };

  const openEditModal = (nodeId) => {
    const n = nodes.find(x => x.nodeId === nodeId);
    if (!n) return;
    setModal({ open: true, title: 'Edit Member', type: 'edit', editNodeId: nodeId, initialData: { name: n.name, nickname: n.nickname, gender: n.gender } });
  };

  const closeModal = () => setModal({ open: false, title: '', type: null, editNodeId: null, initialData: null });

  const handleModalSave = (formData) => {
    if (modal.type === 'edit') {
      setNodes(prev => prev.map(n => n.nodeId === modal.editNodeId ? { ...n, ...formData } : n));
      toast.success('Member updated');
    } else if (modal.type === 'root') {
      const n = { nodeId: generateNodeId(), ...formData, parentId: null };
      setNodes(prev => [...prev, n]);
      setSelectedNodeId(n.nodeId);
      toast.success('Root member added');
    } else if (modal.type === 'child') {
      const n = { nodeId: generateNodeId(), ...formData, parentId: selectedNodeId };
      setNodes(prev => [...prev, n]);
      setSelectedNodeId(n.nodeId);
      toast.success('Child added');
    } else if (modal.type === 'sibling') {
      const sel = nodes.find(n => n.nodeId === selectedNodeId);
      const n = { nodeId: generateNodeId(), ...formData, parentId: sel?.parentId || null };
      setNodes(prev => [...prev, n]);
      setSelectedNodeId(n.nodeId);
      toast.success('Sibling added');
    } else if (modal.type === 'parent') {
      const n = { nodeId: generateNodeId(), ...formData, parentId: null };
      setNodes(prev => {
        const updated = prev.map(x => x.nodeId === selectedNodeId ? { ...x, parentId: n.nodeId } : x);
        return [n, ...updated];
      });
      setSelectedNodeId(n.nodeId);
      toast.success('Parent added');
    }
    closeModal();
  };

  const handleDelete = (nodeId) => {
    const descendants = [];
    const count = (id) => nodes.forEach(n => { if (n.parentId === id) { descendants.push(n); count(n.nodeId); } });
    count(nodeId);
    const msg = descendants.length > 0
      ? `This will also delete ${descendants.length} descendant(s). Are you sure?`
      : 'Delete this member?';
    if (window.confirm(msg)) {
      setNodes(prev => deleteNodeAndDescendants(prev, nodeId));
      if (selectedNodeId === nodeId) setSelectedNodeId(null);
      toast.success('Member deleted');
    }
  };

  const handleSave = async () => {
    if (!nodes.length) { toast.error('Add at least one member'); return; }
    setSaving(true);
    try {
      await api.post('/api/family-tree', { nodes });
      toast.success('Family tree saved!');
      setViewMode(true);
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="tree-builder-container">
        <Navbar />
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
          <div className="spinner-border" style={{ color: '#6C3FC5' }} role="status" />
        </div>
      </div>
    );
  }

  return (
    <div className="tree-builder-container">
      <Navbar />

      {/* Header */}
      <div className="page-header">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <button className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
                onClick={() => navigate('/dashboard')}>
                <FiArrowLeft /> Back
              </button>
              <div>
                <h2 className="mb-0">
                  <FiGitMerge className="me-2" style={{ color: '#F4C430' }} />
                  Family Tree Builder
                </h2>
                <small style={{ opacity: 0.8 }}>{nodes.length} member{nodes.length !== 1 ? 's' : ''}</small>
              </div>
            </div>

            {viewMode && (
              <button className="btn btn-warning fw-semibold d-flex align-items-center gap-2"
                style={{ borderRadius: 10 }} onClick={() => setViewMode(false)}>
                <FiEdit2 /> Edit Tree
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container py-4">

        {/* Legend */}
        <div className="d-flex align-items-center gap-3 mb-3 flex-wrap" style={{ fontSize: 12, color: '#888' }}>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#6C3FC5', marginRight: 5 }}></span>Root</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#3b82f6', marginRight: 5 }}></span>Male</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#ec4899', marginRight: 5 }}></span>Female</span>
          {!viewMode && nodes.length > 0 && (
            <span style={{ marginLeft: 'auto', color: '#6C3FC5', fontWeight: 600 }}>
              Click any node to select it
            </span>
          )}
        </div>

        {viewMode ? (
          /* ── VIEW MODE ── */
          <FamilyTreeFlow nodes={nodes} editMode={false} />
        ) : (
          /* ── EDIT MODE ── */
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            {/* Action Panel */}
            <div style={{ flexShrink: 0 }}>
              <ActionPanel
                selectedNode={selectedNode}
                nodes={nodes}
                onAdd={openAddModal}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onSave={handleSave}
                saving={saving}
              />
            </div>

            {/* Tree or empty */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {nodes.length === 0
                ? <EmptyTree onAddRoot={() => openAddModal('root')} />
                : <FamilyTreeFlow
                    nodes={nodes}
                    selectedId={selectedNodeId}
                    editMode={true}
                    onNodeSelect={setSelectedNodeId}
                  />
              }
            </div>
          </div>
        )}
      </div>

      <NodeModal
        open={modal.open}
        onClose={closeModal}
        onSave={handleModalSave}
        title={modal.title}
        initialData={modal.initialData}
      />
    </div>
  );
}
