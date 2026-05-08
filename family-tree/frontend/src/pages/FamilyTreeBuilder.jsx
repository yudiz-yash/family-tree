import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiEdit2, FiTrash2, FiSave, FiArrowLeft, FiUsers, FiX, FiGitMerge, FiUserPlus, FiUser, FiSearch
} from 'react-icons/fi';
import Navbar from '../components/Navbar';
import FamilyTreeFlow from '../components/FamilyTreeFlow';
import api from '../api/axios';
import { useLanguage } from '../context/LanguageContext';

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

const INITIAL_FORM = { name: '', nickname: '', gender: 'male', dateOfBirth: '' };

/* ─── Member Modal ─────────────────────────────────────────────── */
function NodeModal({ open, onClose, onSave, title, initialData, isEditMode }) {
  const { t } = useLanguage();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [importMode, setImportMode] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [importResult, setImportResult] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState('');

  useEffect(() => {
    if (open) {
      setForm(initialData || INITIAL_FORM);
      setErrors({});
      setImportMode(false);
      setImportCode('');
      setImportResult(null);
      setImportError('');
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleSave = () => {
    if (!form.name.trim()) { setErrors({ name: t.nameRequired }); return; }
    onSave(form, null);
  };

  const handleSearch = async () => {
    if (!/^\d{6}$/.test(importCode)) { setImportError('Enter a valid 6-digit code'); return; }
    setImportLoading(true);
    setImportError('');
    setImportResult(null);
    try {
      const res = await api.get(`/api/family-tree/import-node/${importCode}`);
      setImportResult(res.data);
    } catch (err) {
      setImportError(err.response?.data?.message || 'Member not found');
    } finally {
      setImportLoading(false);
    }
  };

  const handleImportSave = () => {
    if (!importResult?.nodes?.length) return;
    onSave(null, importResult.nodes);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(15,10,40,0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: 16
    }} onClick={onClose}>
      <div style={{
        background: 'linear-gradient(145deg,#1e1b4b,#2d1a5a)',
        borderRadius: 24, padding: '32px 28px',
        width: '100%', maxWidth: 430,
        boxShadow: '0 32px 80px rgba(0,0,0,0.55)',
        border: '1px solid rgba(139,92,246,0.25)'
      }} onClick={e => e.stopPropagation()}>

        {/* header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="mb-0 fw-bold" style={{ color: '#fff', fontSize: 18 }}>{title}</h5>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
              {importMode ? 'Import using a 6-digit member code' : t.fillDetails}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10, cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
            padding: '6px 8px', lineHeight: 1
          }}>
            <FiX size={18} />
          </button>
        </div>

        {/* Mode tabs — only for add operations, not edit */}
        {!isEditMode && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {[
              { label: '📝 Fill Details', val: false },
              { label: '🔗 Import by Code', val: true },
            ].map(tab => (
              <button key={String(tab.val)} onClick={() => setImportMode(tab.val)} style={{
                flex: 1, padding: '9px 12px', borderRadius: 12, fontWeight: 600,
                fontSize: 12.5, cursor: 'pointer', border: 'none',
                background: importMode === tab.val
                  ? 'linear-gradient(135deg,#6C3FC5,#8B5CF6)'
                  : 'rgba(255,255,255,0.07)',
                color: importMode === tab.val ? '#fff' : 'rgba(255,255,255,0.45)',
                fontFamily: 'Poppins, sans-serif',
                boxShadow: importMode === tab.val ? '0 4px 14px rgba(108,63,197,0.4)' : 'none',
                transition: 'all 0.2s'
              }}>{tab.label}</button>
            ))}
          </div>
        )}

        {importMode ? (
          /* ── IMPORT BY CODE MODE ── */
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>
              6-Digit Member Code
            </label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <input
                type="text"
                maxLength={6}
                placeholder="e.g. 123456"
                value={importCode}
                onChange={e => { setImportCode(e.target.value.replace(/\D/g, '')); setImportError(''); setImportResult(null); }}
                autoFocus
                style={{
                  flex: 1, padding: '12px 16px',
                  background: 'rgba(255,255,255,0.07)',
                  border: `2px solid ${importError ? '#f87171' : 'rgba(139,92,246,0.3)'}`,
                  borderRadius: 12, color: '#fff', fontSize: 20,
                  fontFamily: 'monospace', outline: 'none', letterSpacing: 6, textAlign: 'center'
                }}
                onFocus={e => e.target.style.borderColor = '#8B5CF6'}
                onBlur={e => e.target.style.borderColor = importError ? '#f87171' : 'rgba(139,92,246,0.3)'}
                onKeyDown={e => e.key === 'Enter' && importCode.length === 6 && handleSearch()}
              />
              <button onClick={handleSearch} disabled={importLoading || importCode.length !== 6} style={{
                padding: '12px 16px', borderRadius: 12, fontWeight: 600, fontSize: 13,
                background: importCode.length === 6 ? 'linear-gradient(135deg,#6C3FC5,#8B5CF6)' : 'rgba(255,255,255,0.07)',
                color: importCode.length === 6 ? '#fff' : 'rgba(255,255,255,0.3)',
                border: 'none', cursor: importCode.length === 6 ? 'pointer' : 'not-allowed',
                fontFamily: 'Poppins, sans-serif', display: 'flex', alignItems: 'center', gap: 6,
                boxShadow: importCode.length === 6 ? '0 4px 14px rgba(108,63,197,0.4)' : 'none'
              }}>
                {importLoading
                  ? <div className="spinner-border spinner-border-sm" style={{ color: '#fff', width: 14, height: 14, borderWidth: 2 }} role="status" />
                  : <FiSearch size={14} />}
                {!importLoading && 'Find'}
              </button>
            </div>

            {importError && (
              <div style={{ color: '#f87171', fontSize: 12, marginBottom: 14, padding: '8px 12px', background: 'rgba(248,113,113,0.1)', borderRadius: 8, border: '1px solid rgba(248,113,113,0.2)' }}>
                ⚠ {importError}
              </div>
            )}

            {importResult && (
              <div style={{ background: 'rgba(76,175,122,0.1)', border: '1px solid rgba(76,175,122,0.3)', borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#4CAF7A', letterSpacing: 1, marginBottom: 6 }}>✓ MEMBER FOUND</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 4 }}>{importResult.rootName}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                  {importResult.nodes.length} member{importResult.nodes.length !== 1 ? 's' : ''} will be imported
                  {importResult.nodes.length > 1
                    ? ` (+ ${importResult.nodes.length - 1} descendant${importResult.nodes.length - 1 !== 1 ? 's' : ''})`
                    : ''}
                </div>
              </div>
            )}

            <div className="d-flex gap-3 mt-3">
              <button onClick={onClose} style={{
                flex: 1, padding: '12px', borderRadius: 12, fontWeight: 600, fontSize: 14,
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
              }}>{t.cancel}</button>
              <button onClick={handleImportSave} disabled={!importResult} style={{
                flex: 1, padding: '12px', borderRadius: 12, fontWeight: 700, fontSize: 14,
                background: importResult ? 'linear-gradient(135deg,#1B4D2E,#2E7D4F)' : 'rgba(255,255,255,0.05)',
                border: 'none',
                color: importResult ? '#fff' : 'rgba(255,255,255,0.2)',
                cursor: importResult ? 'pointer' : 'not-allowed',
                boxShadow: importResult ? '0 4px 18px rgba(46,125,79,0.45)' : 'none',
                fontFamily: 'Poppins, sans-serif'
              }}>
                🌿 Import Members
              </button>
            </div>
          </div>
        ) : (
          /* ── FILL DETAILS MODE ── */
          <>
            {/* Name */}
            <div className="mb-3">
              <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5, display: 'block', marginBottom: 7 }}>
                {t.fullNameLabel} <span style={{ color: '#f87171' }}>*</span>
              </label>
              <input
                type="text"
                placeholder={t.enterFullName}
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                autoFocus
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'rgba(255,255,255,0.07)',
                  border: `2px solid ${errors.name ? '#f87171' : 'rgba(139,92,246,0.3)'}`,
                  borderRadius: 12, color: '#fff', fontSize: 14,
                  fontFamily: 'Poppins, sans-serif', outline: 'none', transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#8B5CF6'}
                onBlur={e => e.target.style.borderColor = errors.name ? '#f87171' : 'rgba(139,92,246,0.3)'}
              />
              {errors.name && <div style={{ color: '#f87171', fontSize: 12, marginTop: 5 }}>{errors.name}</div>}
            </div>

            {/* Nickname */}
            <div className="mb-4">
              <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5, display: 'block', marginBottom: 7 }}>
                {t.nicknameLabel} <span style={{ color: 'rgba(255,255,255,0.3)' }}>{t.optional}</span>
              </label>
              <input
                type="text"
                placeholder={t.nicknamePlaceholder}
                value={form.nickname}
                onChange={e => setForm({ ...form, nickname: e.target.value })}
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '2px solid rgba(139,92,246,0.3)',
                  borderRadius: 12, color: '#fff', fontSize: 14,
                  fontFamily: 'Poppins, sans-serif', outline: 'none'
                }}
                onFocus={e => e.target.style.borderColor = '#8B5CF6'}
                onBlur={e => e.target.style.borderColor = 'rgba(139,92,246,0.3)'}
              />
            </div>

            {/* Date of Birth */}
            <div className="mb-4">
              <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5, display: 'block', marginBottom: 7 }}>
                {t.dobLabel} <span style={{ color: 'rgba(255,255,255,0.3)' }}>{t.dobOptional}</span>
              </label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '2px solid rgba(139,92,246,0.3)',
                  borderRadius: 12, color: form.dateOfBirth ? '#fff' : 'rgba(255,255,255,0.35)',
                  fontSize: 14, fontFamily: 'Poppins, sans-serif', outline: 'none', colorScheme: 'dark'
                }}
                onFocus={e => e.target.style.borderColor = '#8B5CF6'}
                onBlur={e => e.target.style.borderColor = 'rgba(139,92,246,0.3)'}
              />
            </div>

            {/* Actions */}
            <div className="d-flex gap-3">
              <button onClick={onClose} style={{
                flex: 1, padding: '12px', borderRadius: 12, fontWeight: 600, fontSize: 14,
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
              }}>{t.cancel}</button>
              <button onClick={handleSave} style={{
                flex: 1, padding: '12px', borderRadius: 12, fontWeight: 700, fontSize: 14,
                background: 'linear-gradient(135deg,#6C3FC5,#8B5CF6)',
                border: 'none', color: '#fff', cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(108,63,197,0.5)', fontFamily: 'Poppins, sans-serif'
              }}>{t.saveMember}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Floating Action Panel ────────────────────────────────────── */
function ActionPanel({ selectedNode, nodes, onAdd, onEdit, onDelete, onSave, saving }) {
  const { t } = useLanguage();
  const base = {
    display: 'flex', alignItems: 'center', gap: 9,
    padding: '10px 14px', borderRadius: 12, fontWeight: 600,
    fontSize: 13, cursor: 'pointer', width: '100%',
    fontFamily: 'Poppins, sans-serif', transition: 'all 0.18s',
    border: '1px solid transparent'
  };
  const ghostBtn = (active, ac) => ({
    ...base,
    background: active ? `rgba(${ac},0.15)` : 'rgba(255,255,255,0.04)',
    color: active ? `rgb(${ac})` : 'rgba(255,255,255,0.3)',
    border: `1px solid ${active ? `rgba(${ac},0.35)` : 'rgba(255,255,255,0.07)'}`,
    cursor: active ? 'pointer' : 'not-allowed'
  });

  return (
    <div style={{
      background: 'linear-gradient(160deg,#050E07,#071A0C)',
      borderRadius: 20, padding: '18px 16px',
      boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
      border: '1px solid rgba(107,58,42,0.45)',
      display: 'flex', flexDirection: 'column', gap: 8,
      minWidth: 220, maxWidth: 240
    }}>

      <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(76,175,122,0.7)', letterSpacing: 1.5, padding: '0 2px 2px' }}>
        🌿 {t.growYourTree}
      </div>

      <button style={{ ...base, background: 'rgba(27,77,46,0.6)', color: '#4CAF7A', border: '1px solid rgba(76,175,122,0.4)' }}
        onClick={() => onAdd('root')}>
        🌱 {t.addRootAncestor}
      </button>

      <button style={ghostBtn(!!selectedNode, '59,130,246')} disabled={!selectedNode} onClick={() => onAdd('child')}>
        <FiUserPlus size={15} /> {t.addChild}
      </button>
      <button style={ghostBtn(!!selectedNode, '34,197,94')} disabled={!selectedNode} onClick={() => onAdd('sibling')}>
        <FiUsers size={15} /> {t.addSibling}
      </button>
      <button style={ghostBtn(!!selectedNode, '168,85,247')} disabled={!selectedNode} onClick={() => onAdd('parent')}>
        <FiUser size={15} /> {t.addParent}
      </button>

      <div style={{ height: 1, background: 'rgba(107,58,42,0.3)', margin: '4px 0' }} />

      {selectedNode ? (
        <>
          <div style={{
            background: 'rgba(108,63,197,0.2)', border: '1px solid rgba(139,92,246,0.35)',
            borderRadius: 12, padding: '10px 12px'
          }}>
            <div style={{ fontSize: 10, color: '#a78bfa', fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>✓ {t.selectedLabel}</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{selectedNode.name}</div>
            {selectedNode.nickname && (
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic', marginTop: 2 }}>"{selectedNode.nickname}"</div>
            )}
            {selectedNode.code && (
              <div style={{ fontSize: 10, color: '#a78bfa', marginTop: 4, letterSpacing: 1, fontFamily: 'monospace' }}>ID: {selectedNode.code}</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => onEdit(selectedNode.nodeId)} style={{
              ...base, flex: 1, justifyContent: 'center',
              background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)'
            }}><FiEdit2 size={13} /> {t.edit}</button>
            <button onClick={() => onDelete(selectedNode.nodeId)} style={{
              ...base, flex: 1, justifyContent: 'center',
              background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)'
            }}><FiTrash2 size={13} /> {t.delete}</button>
          </div>
        </>
      ) : nodes.length > 0 ? (
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '6px 0', fontStyle: 'italic' }}>
          {t.clickCardToSelect}
        </div>
      ) : null}

      <div style={{ height: 1, background: 'rgba(107,58,42,0.3)', margin: '4px 0' }} />

      <button
        disabled={nodes.length === 0 || saving}
        onClick={onSave}
        style={{
          ...base, justifyContent: 'center',
          background: nodes.length === 0 ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#6C3FC5,#8B5CF6)',
          color: nodes.length === 0 ? 'rgba(255,255,255,0.2)' : '#fff',
          border: 'none',
          boxShadow: nodes.length > 0 ? '0 4px 18px rgba(108,63,197,0.45)' : 'none',
          fontSize: 14, fontWeight: 700, padding: '12px 14px'
        }}>
        <FiSave size={15} /> {saving ? t.savingTree : t.saveTree}
      </button>
    </div>
  );
}

/* ─── Empty state ──────────────────────────────────────────────── */
function EmptyTree({ onAddRoot }) {
  const { t } = useLanguage();
  return (
    <div style={{
      width: '100%', height: 680,
      background: 'linear-gradient(175deg,#050E07 0%,#071A0C 40%,#0A2010 70%,#071A0C 100%)',
      borderRadius: 22, border: '2px dashed rgba(107,58,42,0.5)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20,
      boxShadow: '0 12px 50px rgba(0,0,0,0.6)', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(46,125,79,0.08),transparent)', top:-100, right:-100, pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(244,196,48,0.05),transparent)', bottom:-60, left:-60, pointerEvents:'none' }} />

      <div style={{ fontSize: 80, filter: 'drop-shadow(0 6px 20px rgba(46,125,79,0.4))', position:'relative' }}>🌳</div>
      <div style={{ textAlign:'center', position:'relative' }}>
        <h4 style={{ color:'#fff', fontWeight:800, margin:'0 0 8px', fontSize:24, letterSpacing:-0.5, textShadow:'0 2px 12px rgba(0,0,0,0.5)' }}>
          {t.plantFamilyTree}
        </h4>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, margin:0 }}>
          {t.plantFamilyTreeSub}
        </p>
      </div>
      <button onClick={onAddRoot} style={{
        background: 'linear-gradient(135deg,#1B4D2E,#2E7D4F)',
        color: '#fff', border: '2px solid rgba(76,175,122,0.5)',
        borderRadius: 14, padding: '14px 32px', fontWeight: 700, fontSize: 15,
        cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
        boxShadow: '0 6px 24px rgba(46,125,79,0.5)',
        display:'flex', alignItems:'center', gap:8, position:'relative', transition: 'transform 0.2s, box-shadow 0.2s'
      }}
        onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 32px rgba(46,125,79,0.65)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(46,125,79,0.5)'; }}
      >
        🌱 {t.plantRootAncestor}
      </button>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────────── */
export default function FamilyTreeBuilder() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [nodes, setNodes] = useState([]);
  const [commonNodes, setCommonNodes] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, title: '', type: null, editNodeId: null, initialData: null });

  useEffect(() => { fetchTree(); }, []);

  const fetchTree = async () => {
    try {
      const [treeRes, commonRes] = await Promise.all([
        api.get('/api/family-tree'),
        api.get('/api/common-tree').catch(() => ({ data: { tree: null } }))
      ]);
      if (treeRes.data.tree?.nodes?.length) {
        const fetched = treeRes.data.tree.nodes;
        setNodes(fetched);
        setViewMode(true);
        // Silently save once if any node is missing a backend-assigned code
        const needsCodes = fetched.some(n => !n.code || !/^\d{6}$/.test(n.code));
        if (needsCodes) {
          api.post('/api/family-tree', { nodes: fetched })
            .then(r => { if (r.data.tree?.nodes?.length) setNodes(r.data.tree.nodes); })
            .catch(() => {});
        }
      }
      if (commonRes.data.tree?.nodes?.length) {
        setCommonNodes(commonRes.data.tree.nodes);
      }
    } catch { toast.error(t.failedToLoad); }
    finally { setLoading(false); }
  };

  /* Merge common tree + user tree for display only */
  const mergedNodes = useMemo(() => {
    if (!commonNodes.length) return nodes;
    const prefixed = commonNodes.map(n => ({
      ...n,
      nodeId: `common_${n.nodeId}`,
      parentId: n.parentId ? `common_${n.parentId}` : null,
      isCommon: true
    }));
    const childMap = {};
    prefixed.forEach(n => { childMap[n.nodeId] = []; });
    prefixed.forEach(n => { if (n.parentId && childMap[n.parentId]) childMap[n.parentId].push(n.nodeId); });
    const depth = {};
    const roots = prefixed.filter(n => !n.parentId);
    const sd = (id, d) => { depth[id] = d; (childMap[id] || []).forEach(k => sd(k, d + 1)); };
    roots.forEach(r => sd(r.nodeId, 0));
    const leaves = prefixed.filter(n => !childMap[n.nodeId]?.length);
    if (!leaves.length) return nodes;
    const connectionNode = leaves.reduce((a, b) => (depth[a.nodeId] || 0) >= (depth[b.nodeId] || 0) ? a : b);
    const userRootIds = nodes
      .filter(n => !n.parentId || !nodes.find(x => x.nodeId === n.parentId))
      .map(n => n.nodeId);
    const attachedUserNodes = nodes.map(n =>
      userRootIds.includes(n.nodeId) ? { ...n, parentId: connectionNode.nodeId } : n
    );
    return [...prefixed, ...attachedUserNodes];
  }, [nodes, commonNodes]);

  const selectedNode = nodes.find(n => n.nodeId === selectedNodeId) || null;

  const openAddModal = (type) => {
    if (type !== 'root' && !selectedNodeId) { toast.error(t.selectMemberFirst); return; }
    const titles = {
      root: t.addRootMember,
      child: t.addChildModal,
      sibling: t.addBrotherSister,
      parent: t.addParentModal
    };
    setModal({ open: true, title: titles[type], type, editNodeId: null, initialData: null });
  };

  const openEditModal = (nodeId) => {
    const n = nodes.find(x => x.nodeId === nodeId);
    if (!n) return;
    setModal({ open: true, title: t.editMember, type: 'edit', editNodeId: nodeId, initialData: { name: n.name, nickname: n.nickname, gender: n.gender, dateOfBirth: n.dateOfBirth || '' } });
  };

  const closeModal = () => setModal({ open: false, title: '', type: null, editNodeId: null, initialData: null });

  const handleModalSave = (formData, importedNodes) => {
    /* ── Import branch ── */
    if (importedNodes && importedNodes.length > 0) {
      const idMap = {};
      importedNodes.forEach(n => { idMap[n.nodeId] = generateNodeId(); });

      const importedIdSet = new Set(importedNodes.map(n => n.nodeId));
      const rootNode = importedNodes.find(n => !n.parentId || !importedIdSet.has(n.parentId));

      let importedRootParentId = null;
      if (modal.type === 'child') importedRootParentId = selectedNodeId;
      else if (modal.type === 'sibling') importedRootParentId = nodes.find(n => n.nodeId === selectedNodeId)?.parentId || null;

      const remapped = importedNodes.map(n => ({
        ...n,
        nodeId: idMap[n.nodeId],
        parentId: n.nodeId === rootNode?.nodeId
          ? importedRootParentId
          : (n.parentId ? idMap[n.parentId] : null)
      }));

      if (modal.type === 'parent') {
        const newRootId = idMap[rootNode?.nodeId];
        setNodes(prev => {
          const updated = prev.map(x => x.nodeId === selectedNodeId ? { ...x, parentId: newRootId } : x);
          return [...remapped, ...updated];
        });
      } else {
        setNodes(prev => [...prev, ...remapped]);
        if (modal.type === 'root') setViewMode(false);
      }

      if (remapped.length > 0) setSelectedNodeId(remapped[0].nodeId);
      toast.success(`Imported ${remapped.length} member${remapped.length !== 1 ? 's' : ''}`);
      closeModal();
      return;
    }

    /* ── Normal form branch ── */
    if (!formData) { closeModal(); return; }

    if (modal.type === 'edit') {
      setNodes(prev => prev.map(n => n.nodeId === modal.editNodeId ? { ...n, ...formData } : n));
      toast.success(t.memberUpdated);
    } else if (modal.type === 'root') {
      const n = { nodeId: generateNodeId(), ...formData, parentId: null };
      setNodes(prev => [...prev, n]);
      setSelectedNodeId(n.nodeId);
      setViewMode(false);
      toast.success(t.rootMemberAdded);
    } else if (modal.type === 'child') {
      const n = { nodeId: generateNodeId(), ...formData, parentId: selectedNodeId };
      setNodes(prev => [...prev, n]);
      setSelectedNodeId(n.nodeId);
      toast.success(t.childAdded);
    } else if (modal.type === 'sibling') {
      const sel = nodes.find(n => n.nodeId === selectedNodeId);
      const n = { nodeId: generateNodeId(), ...formData, parentId: sel?.parentId || null };
      setNodes(prev => [...prev, n]);
      setSelectedNodeId(n.nodeId);
      toast.success(t.siblingAdded);
    } else if (modal.type === 'parent') {
      const n = { nodeId: generateNodeId(), ...formData, parentId: null };
      setNodes(prev => {
        const updated = prev.map(x => x.nodeId === selectedNodeId ? { ...x, parentId: n.nodeId } : x);
        return [n, ...updated];
      });
      setSelectedNodeId(n.nodeId);
      toast.success(t.parentAdded);
    }
    closeModal();
  };

  const handleDelete = (nodeId) => {
    const descendants = [];
    const count = (id) => nodes.forEach(n => { if (n.parentId === id) { descendants.push(n); count(n.nodeId); } });
    count(nodeId);
    const msg = descendants.length > 0 ? t.deleteWithDescendants(descendants.length) : t.deleteMember;
    if (window.confirm(msg)) {
      setNodes(prev => deleteNodeAndDescendants(prev, nodeId));
      if (selectedNodeId === nodeId) setSelectedNodeId(null);
      toast.success(t.memberDeleted);
    }
  };

  const handleSave = async () => {
    if (!nodes.length) { toast.error(t.addAtLeastOneMember); return; }
    setSaving(true);
    try {
      const res = await api.post('/api/family-tree', { nodes });
      // Sync state with backend response so codes are always up to date
      if (res.data.tree?.nodes?.length) setNodes(res.data.tree.nodes);
      toast.success(t.familyTreeSaved);
      setViewMode(true);
    } catch { toast.error(t.failedToSave); }
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
                <FiArrowLeft /> {t.back}
              </button>
              <div>
                <h2 className="mb-0">
                  <FiGitMerge className="me-2" style={{ color: '#F4C430' }} />
                  {t.familyTreeBuilder}
                </h2>
                <small style={{ opacity: 0.8 }}>
                  {nodes.length} {nodes.length !== 1 ? t.members : t.member}
                  {commonNodes.length > 0 && <span style={{ marginLeft: 8, color: '#c4b5fd', fontSize: 11 }}>+ {commonNodes.length} common</span>}
                </small>
              </div>
            </div>

            <div className="d-flex gap-2">
              {nodes.length > 0 && (
                <button
                  className="btn btn-sm fw-semibold d-flex align-items-center gap-2"
                  style={{
                    borderRadius: 10,
                    background: 'linear-gradient(135deg,#1B4D2E,#2E7D4F)',
                    color: '#fff', border: '1.5px solid rgba(76,175,122,0.5)',
                    boxShadow: '0 4px 14px rgba(46,125,79,0.4)', padding: '7px 14px'
                  }}
                  onClick={() => {
                    setViewMode(false);
                    setModal({ open: true, title: t.addRootMember, type: 'root', editNodeId: null, initialData: null });
                  }}
                >
                  🌱 {t.addNewRoot}
                </button>
              )}
              {viewMode && (
                <button className="btn btn-warning fw-semibold d-flex align-items-center gap-2"
                  style={{ borderRadius: 10 }} onClick={() => setViewMode(false)}>
                  <FiEdit2 /> {t.editTree}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">

        {/* Legend */}
        <div className="d-flex align-items-center gap-3 mb-3 flex-wrap" style={{ fontSize: 12, color: '#888' }}>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#6C3FC5', marginRight: 5 }}></span>{t.rootLegend}</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#3b82f6', marginRight: 5 }}></span>{t.male}</span>
          {!viewMode && nodes.length > 0 && (
            <span style={{ marginLeft: 'auto', color: '#6C3FC5', fontWeight: 600 }}>
              {t.clickNodeToSelect}
            </span>
          )}
        </div>

        {viewMode ? (
          <FamilyTreeFlow nodes={mergedNodes} editMode={false} />
        ) : (
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
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
        isEditMode={modal.type === 'edit'}
      />
    </div>
  );
}
