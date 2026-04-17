import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { FiSave, FiTrash2, FiUserPlus, FiUsers, FiUser, FiEdit2, FiX, FiInfo } from 'react-icons/fi';
import ReactFlow, {
  ReactFlowProvider, Background, Controls,
  Handle, Position, getSmoothStepPath
} from 'reactflow';
import 'reactflow/dist/style.css';
import api from '../api/axios';

const NODE_W = 160, NODE_H = 110, H_GAP = 80, V_GAP = 140;

function generateId() { return `ct_${Date.now()}_${Math.random().toString(36).substr(2,9)}`; }

function deleteWithDescendants(nodes, id) {
  const del = new Set();
  const collect = (i) => { del.add(i); nodes.forEach(n => { if (n.parentId === i) collect(n.nodeId); }); };
  collect(id);
  return nodes.filter(n => !del.has(n.nodeId));
}

/* ── layout ── */
function buildLayout(nodes, selectedId) {
  if (!nodes?.length) return { flowNodes: [], flowEdges: [] };
  const nodeMap = {}, childMap = {};
  nodes.forEach(n => { nodeMap[n.nodeId] = n; childMap[n.nodeId] = []; });
  const roots = [];
  nodes.forEach(n => { if (!n.parentId || !nodeMap[n.parentId]) roots.push(n.nodeId); else childMap[n.parentId].push(n.nodeId); });
  const sw = (id) => { const k = childMap[id] || []; if (!k.length) return NODE_W; return Math.max(k.reduce((s,c) => s+sw(c),0)+H_GAP*(k.length-1), NODE_W); };
  const pos = {};
  const place = (id, x, y) => {
    pos[id] = { x, y };
    const k = childMap[id] || []; if (!k.length) return;
    const total = k.reduce((s,c) => s+sw(c),0)+H_GAP*(k.length-1);
    let cx = x - total/2 + NODE_W/2;
    k.forEach(c => { const w = sw(c); place(c, cx+w/2-NODE_W/2, y+NODE_H+V_GAP); cx += w+H_GAP; });
  };
  const rtw = roots.reduce((s,r) => s+sw(r),0)+H_GAP*(roots.length-1);
  let rx = -rtw/2+NODE_W/2;
  roots.forEach(r => { const w = sw(r); place(r, rx+w/2-NODE_W/2, 0); rx += w+H_GAP; });
  const depth = {}; const sd = (id,d) => { depth[id]=d; (childMap[id]||[]).forEach(k=>sd(k,d+1)); }; roots.forEach(r=>sd(r,0));
  const flowNodes = nodes.map(n => ({ id: n.nodeId, type:'leaf', position: pos[n.nodeId]||{x:0,y:0}, data:{ node:n, isRoot:!n.parentId||!nodeMap[n.parentId], isSelected:n.nodeId===selectedId, depth:depth[n.nodeId]||0 } }));
  const flowEdges = nodes.filter(n=>n.parentId&&nodeMap[n.parentId]).map(n=>({ id:`e-${n.parentId}-${n.nodeId}`, source:n.parentId, target:n.nodeId, sourceHandle:'bottom', targetHandle:'top', type:'branch', data:{depth:depth[n.parentId]||0} }));
  return { flowNodes, flowEdges };
}

function BranchEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }) {
  const d = data?.depth||0, strokeW = Math.max(1.5,3.5-d*0.5), color = d===0?'#6B3A2A':d===1?'#7B4A35':'#8B5A45';
  const [path] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, borderRadius:12, offset:40 });
  return (<><path d={path} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth={strokeW+2} strokeLinecap="round"/><path d={path} fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round"/></>);
}

const LEAF = { male:{bg:['#1B4D2E','#2E7D4F'],border:'#4CAF7A',icon:'🌿'}, female:{bg:['#7B1D3A','#B5294E'],border:'#F48FB1',icon:'🌸'}, other:{bg:['#3B2A6E','#5C3FA8'],border:'#9C84D4',icon:'🍃'} };
const ROOT_LEAF = { bg:['#5D3A00','#8B5E00'], border:'#F4C430' };
const initials = (n='') => n.trim().split(/\s+/).slice(0,2).map(w=>w[0]?.toUpperCase()).join('')||'?';

function LeafNode({ data }) {
  const { node, isRoot, isSelected, depth } = data;
  const p = isRoot ? ROOT_LEAF : (LEAF[node.gender]||LEAF.male);
  const [c1,c2] = p.bg;
  return (
    <>
      {!isRoot && <div style={{ position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',width:3,height:12,background:'linear-gradient(to bottom,#7B4A35,#6B3A2A)',borderRadius:'3px 3px 0 0',zIndex:0 }}/>}
      <Handle type="target" id="top" position={Position.Top} style={{ background:'transparent',border:'none',width:1,height:1,top:0,opacity:0 }}/>
      <div style={{ width:NODE_W, background:`linear-gradient(160deg,${c1} 0%,${c2} 100%)`, borderRadius:12, padding:'14px 12px 12px', color:'#fff', textAlign:'center', position:'relative', cursor:'pointer', border:isSelected?'3px solid #F4C430':`2px solid ${p.border}`, boxShadow:isSelected?'0 0 0 4px rgba(244,196,48,0.25),0 12px 36px rgba(0,0,0,0.5)':'0 8px 28px rgba(0,0,0,0.4)', transform:isSelected?'scale(1.06)':'scale(1)', transition:'transform 0.18s', zIndex:1 }}>
        {isRoot && <div style={{ position:'absolute',top:-11,left:'50%',transform:'translateX(-50%)',background:'linear-gradient(90deg,#F4C430,#D4A017)',color:'#3B1F00',fontSize:9,fontWeight:800,padding:'2px 12px',borderRadius:20,letterSpacing:1.5,whiteSpace:'nowrap' }}>🌳 COMMON ROOT</div>}
        {isSelected && !isRoot && <div style={{ position:'absolute',top:-10,right:6,background:'linear-gradient(90deg,#22c55e,#16a34a)',color:'#fff',fontSize:8,fontWeight:800,padding:'2px 8px',borderRadius:20 }}>✓</div>}
        <div style={{ fontSize:9,opacity:0.6,marginBottom:4 }}>{(LEAF[node.gender]||LEAF.male).icon}</div>
        <div style={{ width:42,height:42,borderRadius:'50%',background:'rgba(0,0,0,0.25)',border:`2px solid ${isSelected?'#F4C430':'rgba(255,255,255,0.35)'}`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 8px',fontSize:15,fontWeight:800,color:'#fff' }}>{initials(node.name)}</div>
        <div style={{ fontWeight:700,fontSize:13,lineHeight:1.3,wordBreak:'break-word',marginBottom:2,textShadow:'0 1px 4px rgba(0,0,0,0.5)' }}>{node.name}</div>
        {node.nickname && <div style={{ fontSize:10.5,opacity:0.65,fontStyle:'italic',marginBottom:5 }}>"{node.nickname}"</div>}
        <div style={{ display:'inline-flex',alignItems:'center',gap:3,fontSize:9.5,fontWeight:600,textTransform:'uppercase',letterSpacing:0.8,background:'rgba(0,0,0,0.3)',border:'1px solid rgba(255,255,255,0.15)',padding:'2px 10px',borderRadius:20 }}>{node.gender}</div>
      </div>
      <Handle type="source" id="bottom" position={Position.Bottom} style={{ background:'transparent',border:'none',width:1,height:1,bottom:0,opacity:0 }}/>
    </>
  );
}

const nodeTypes = { leaf: LeafNode };
const edgeTypes = { branch: BranchEdge };

function TreeCanvas({ nodes, selectedId, onSelect }) {
  const { flowNodes, flowEdges } = useMemo(() => buildLayout(nodes, selectedId), [nodes, selectedId]);
  return (
    <div style={{ width:'100%', height:580, borderRadius:18, overflow:'hidden', background:'linear-gradient(175deg,#050E07 0%,#071A0C 40%,#0A2010 70%,#071A0C 100%)', border:'2px solid rgba(107,58,42,0.5)' }}>
      <ReactFlow nodes={flowNodes} edges={flowEdges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} fitView fitViewOptions={{padding:0.3}} minZoom={0.1} maxZoom={2.5} nodesDraggable={false} nodesConnectable={false} elementsSelectable={false} onNodeClick={(_,n) => onSelect(n.id)}>
        <Background variant="dots" color="rgba(255,255,255,0.04)" gap={30} size={1}/>
        <Controls style={{ background:'rgba(5,14,7,0.8)',border:'1px solid rgba(107,58,42,0.4)',borderRadius:12 }}/>
      </ReactFlow>
    </div>
  );
}

/* ── node modal ── */
const EMPTY = { name:'', nickname:'', gender:'male', dateOfBirth:'' };
function NodeModal({ open, onClose, onSave, title, initial }) {
  const [form, setForm] = useState(EMPTY);
  const [err, setErr] = useState('');
  useEffect(() => { if (open) { setForm(initial||EMPTY); setErr(''); } }, [open, initial]);
  if (!open) return null;
  const save = () => { if (!form.name.trim()) { setErr('Name is required'); return; } onSave(form); };
  const iStyle = { width:'100%',padding:'11px 14px',background:'rgba(255,255,255,0.07)',border:'2px solid rgba(139,92,246,0.3)',borderRadius:12,color:'#fff',fontSize:14,fontFamily:'inherit',outline:'none' };
  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(15,10,40,0.75)',backdropFilter:'blur(6px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,padding:16 }} onClick={onClose}>
      <div style={{ background:'linear-gradient(145deg,#1e1b4b,#2d1a5a)',borderRadius:24,padding:'32px 28px',width:'100%',maxWidth:420,boxShadow:'0 32px 80px rgba(0,0,0,0.55)',border:'1px solid rgba(139,92,246,0.25)' }} onClick={e=>e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0 fw-bold" style={{color:'#fff'}}>{title}</h5>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:10,cursor:'pointer',color:'rgba(255,255,255,0.6)',padding:'6px 8px' }}><FiX size={18}/></button>
        </div>
        <div className="mb-3">
          <label style={{ fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.6)',display:'block',marginBottom:7 }}>Full Name *</label>
          <input type="text" placeholder="Enter full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} autoFocus style={iStyle} onFocus={e=>e.target.style.borderColor='#8B5CF6'} onBlur={e=>e.target.style.borderColor='rgba(139,92,246,0.3)'}/>
          {err && <div style={{color:'#f87171',fontSize:12,marginTop:5}}>{err}</div>}
        </div>
        <div className="mb-3">
          <label style={{ fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.6)',display:'block',marginBottom:7 }}>Nickname <span style={{opacity:0.4}}>(optional)</span></label>
          <input type="text" placeholder="e.g. Kaka, Bhai" value={form.nickname} onChange={e=>setForm({...form,nickname:e.target.value})} style={iStyle} onFocus={e=>e.target.style.borderColor='#8B5CF6'} onBlur={e=>e.target.style.borderColor='rgba(139,92,246,0.3)'}/>
        </div>
        <div className="mb-4">
          <label style={{ fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.6)',display:'block',marginBottom:10 }}>Gender</label>
          <div style={{display:'flex',gap:10}}>
            {[{v:'male',l:'Male',ac:'#3b82f6'},{v:'female',l:'Female',ac:'#ec4899'},{v:'other',l:'Other',ac:'#8b5cf6'}].map(g=>(
              <div key={g.v} onClick={()=>setForm({...form,gender:g.v})} style={{ flex:1,padding:'10px 8px',borderRadius:12,textAlign:'center',cursor:'pointer',fontWeight:600,fontSize:13,border:`2px solid ${form.gender===g.v?g.ac:'rgba(255,255,255,0.1)'}`,background:form.gender===g.v?`rgba(${g.v==='male'?'59,130,246':g.v==='female'?'236,72,153':'139,92,246'},0.15)`:'rgba(255,255,255,0.04)',color:form.gender===g.v?g.ac:'rgba(255,255,255,0.45)',transition:'all 0.18s' }}>{g.l}</div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label style={{ fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.6)',display:'block',marginBottom:7 }}>Date of Birth <span style={{opacity:0.4}}>(optional)</span></label>
          <input type="date" value={form.dateOfBirth} onChange={e=>setForm({...form,dateOfBirth:e.target.value})} style={{...iStyle,colorScheme:'dark',color:form.dateOfBirth?'#fff':'rgba(255,255,255,0.35)'}} onFocus={e=>e.target.style.borderColor='#8B5CF6'} onBlur={e=>e.target.style.borderColor='rgba(139,92,246,0.3)'}/>
        </div>
        <div className="d-flex gap-3">
          <button onClick={onClose} style={{ flex:1,padding:'12px',borderRadius:12,fontWeight:600,fontSize:14,background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.6)',cursor:'pointer',fontFamily:'inherit' }}>Cancel</button>
          <button onClick={save} style={{ flex:1,padding:'12px',borderRadius:12,fontWeight:700,fontSize:14,background:'linear-gradient(135deg,#6C3FC5,#8B5CF6)',border:'none',color:'#fff',cursor:'pointer',fontFamily:'inherit' }}>Save</button>
        </div>
      </div>
    </div>
  );
}

/* ── main page ── */
export default function CommonTreePage() {
  const [nodes, setNodes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState({ open:false, title:'', type:null, editId:null, initial:null });

  useEffect(() => { fetchTree(); }, []);

  const fetchTree = async () => {
    try {
      const res = await api.get('/api/common-tree');
      if (res.data.tree?.nodes?.length) setNodes(res.data.tree.nodes);
    } catch { toast.error('Failed to load common tree'); }
    finally { setLoading(false); }
  };

  const selected = nodes.find(n => n.nodeId === selectedId) || null;

  /* find deepest leaf (the connection point shown as info) */
  const connectionNode = useMemo(() => {
    if (!nodes.length) return null;
    const childMap = {};
    nodes.forEach(n => { childMap[n.nodeId] = []; });
    nodes.forEach(n => { if (n.parentId && childMap[n.parentId]) childMap[n.parentId].push(n.nodeId); });
    const depth = {};
    const roots = nodes.filter(n => !n.parentId || !nodes.find(x => x.nodeId === n.parentId));
    const sd = (id, d) => { depth[id]=d; (childMap[id]||[]).forEach(k=>sd(k,d+1)); };
    roots.forEach(r => sd(r.nodeId, 0));
    const leaves = nodes.filter(n => !childMap[n.nodeId]?.length);
    if (!leaves.length) return null;
    return leaves.reduce((a,b) => (depth[a.nodeId]||0) >= (depth[b.nodeId]||0) ? a : b);
  }, [nodes]);

  const openAdd = (type) => {
    if (type !== 'root' && !selectedId) { toast.error('Select a node first'); return; }
    setModal({ open:true, title: type==='root'?'Add Root Ancestor':type==='child'?'Add Child':type==='sibling'?'Add Sibling':'Add Parent', type, editId:null, initial:null });
  };

  const openEdit = (id) => {
    const n = nodes.find(x=>x.nodeId===id); if (!n) return;
    setModal({ open:true, title:'Edit Member', type:'edit', editId:id, initial:{ name:n.name,nickname:n.nickname,gender:n.gender,dateOfBirth:n.dateOfBirth||'' } });
  };

  const closeModal = () => setModal({ open:false,title:'',type:null,editId:null,initial:null });

  const handleSave = (form) => {
    if (modal.type === 'edit') {
      setNodes(prev => prev.map(n => n.nodeId===modal.editId ? {...n,...form} : n));
      toast.success('Updated');
    } else if (modal.type === 'root') {
      const n = { nodeId:generateId(), ...form, parentId:null };
      setNodes(prev => [...prev, n]); setSelectedId(n.nodeId); toast.success('Root added');
    } else if (modal.type === 'child') {
      const n = { nodeId:generateId(), ...form, parentId:selectedId };
      setNodes(prev => [...prev, n]); setSelectedId(n.nodeId); toast.success('Child added');
    } else if (modal.type === 'sibling') {
      const sel = nodes.find(n=>n.nodeId===selectedId);
      const n = { nodeId:generateId(), ...form, parentId:sel?.parentId||null };
      setNodes(prev => [...prev, n]); setSelectedId(n.nodeId); toast.success('Sibling added');
    } else if (modal.type === 'parent') {
      const n = { nodeId:generateId(), ...form, parentId:null };
      setNodes(prev => { const upd = prev.map(x=>x.nodeId===selectedId?{...x,parentId:n.nodeId}:x); return [n,...upd]; });
      setSelectedId(n.nodeId); toast.success('Parent added');
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this node and all its descendants?')) return;
    setNodes(prev => deleteWithDescendants(prev, id));
    if (selectedId === id) setSelectedId(null);
    toast.success('Deleted');
  };

  const saveTree = async () => {
    if (!nodes.length) { toast.error('Add at least one node'); return; }
    setSaving(true);
    try {
      await api.post('/api/common-tree', { nodes });
      toast.success('Common tree saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const clearTree = async () => {
    if (!window.confirm('This will remove the common tree from ALL users. Continue?')) return;
    try {
      await api.delete('/api/common-tree');
      setNodes([]); setSelectedId(null);
      toast.success('Common tree cleared');
    } catch { toast.error('Failed to clear'); }
  };

  const btnBase = { display:'flex',alignItems:'center',gap:8,padding:'9px 14px',borderRadius:10,fontWeight:600,fontSize:13,cursor:'pointer',border:'1px solid transparent',fontFamily:'inherit',transition:'all 0.15s' };

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{height:'50vh'}}><div className="spinner-border" style={{color:'#6C3FC5'}} role="status"/></div>;

  return (
    <div>
      <div className="page-header mb-4">
        <div>
          <h1 className="page-title">Common Tree</h1>
          <p className="page-subtitle">This tree will be prepended to every user's family tree</p>
        </div>
      </div>

      {/* Info banner */}
      {connectionNode && (
        <div className="d-flex align-items-center gap-2 mb-3 px-3 py-2" style={{ background:'#f0fdf4',border:'1.5px solid #86efac',borderRadius:12,fontSize:13,color:'#15803d' }}>
          <FiInfo size={15}/>
          <span>Connection point (last node): <strong>{connectionNode.name}</strong> — user tree roots will attach here.</span>
        </div>
      )}

      <div style={{ display:'flex', gap:20, alignItems:'flex-start' }}>
        {/* Action panel */}
        <div style={{ flexShrink:0, minWidth:220, background:'linear-gradient(160deg,#050E07,#071A0C)', borderRadius:20, padding:'18px 16px', boxShadow:'0 16px 48px rgba(0,0,0,0.6)', border:'1px solid rgba(107,58,42,0.45)', display:'flex', flexDirection:'column', gap:8 }}>
          <div style={{ fontSize:10,fontWeight:700,color:'rgba(76,175,122,0.7)',letterSpacing:1.5,padding:'0 2px 4px' }}>🌿 BUILD COMMON TREE</div>

          <button style={{...btnBase,background:'rgba(27,77,46,0.6)',color:'#4CAF7A',border:'1px solid rgba(76,175,122,0.4)'}} onClick={()=>openAdd('root')}>🌱 Add Root</button>

          {[['child','Add Child','59,130,246'],['sibling','Add Sibling','34,197,94'],['parent','Add Parent','168,85,247']].map(([type,label,ac])=>(
            <button key={type} disabled={!selectedId} onClick={()=>openAdd(type)} style={{...btnBase, background:selectedId?`rgba(${ac},0.15)`:'rgba(255,255,255,0.04)', color:selectedId?`rgb(${ac})`:'rgba(255,255,255,0.3)', border:`1px solid ${selectedId?`rgba(${ac},0.35)`:'rgba(255,255,255,0.07)'}`, cursor:selectedId?'pointer':'not-allowed' }}>{label}</button>
          ))}

          <div style={{ height:1,background:'rgba(107,58,42,0.3)',margin:'4px 0' }}/>

          {selected ? (
            <>
              <div style={{ background:'rgba(108,63,197,0.2)',border:'1px solid rgba(139,92,246,0.35)',borderRadius:12,padding:'10px 12px' }}>
                <div style={{ fontSize:10,color:'#a78bfa',fontWeight:700,letterSpacing:1,marginBottom:4 }}>✓ SELECTED</div>
                <div style={{ fontWeight:700,fontSize:13,color:'#fff' }}>{selected.name}</div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>openEdit(selected.nodeId)} style={{...btnBase,flex:1,justifyContent:'center',background:'rgba(251,191,36,0.15)',color:'#fbbf24',border:'1px solid rgba(251,191,36,0.3)'}}><FiEdit2 size={13}/> Edit</button>
                <button onClick={()=>handleDelete(selected.nodeId)} style={{...btnBase,flex:1,justifyContent:'center',background:'rgba(248,113,113,0.15)',color:'#f87171',border:'1px solid rgba(248,113,113,0.3)'}}><FiTrash2 size={13}/> Del</button>
              </div>
            </>
          ) : nodes.length > 0 ? (
            <div style={{ fontSize:12,color:'rgba(255,255,255,0.3)',textAlign:'center',padding:'6px 0',fontStyle:'italic' }}>Click a node to select</div>
          ) : null}

          <div style={{ height:1,background:'rgba(107,58,42,0.3)',margin:'4px 0' }}/>

          <button disabled={!nodes.length||saving} onClick={saveTree} style={{...btnBase,justifyContent:'center',background:nodes.length?'linear-gradient(135deg,#6C3FC5,#8B5CF6)':'rgba(255,255,255,0.05)',color:nodes.length?'#fff':'rgba(255,255,255,0.2)',border:'none',fontSize:14,fontWeight:700,padding:'12px 14px',boxShadow:nodes.length?'0 4px 18px rgba(108,63,197,0.45)':'none'}}>
            <FiSave size={15}/> {saving?'Saving…':'Save Common Tree'}
          </button>

          {nodes.length > 0 && (
            <button onClick={clearTree} style={{...btnBase,justifyContent:'center',background:'rgba(248,113,113,0.1)',color:'#f87171',border:'1px solid rgba(248,113,113,0.25)'}}>
              <FiTrash2 size={14}/> Clear Tree
            </button>
          )}
        </div>

        {/* Canvas */}
        <div style={{ flex:1, minWidth:0 }}>
          {nodes.length === 0 ? (
            <div style={{ width:'100%',height:580,background:'linear-gradient(175deg,#050E07 0%,#071A0C 40%,#0A2010 70%,#071A0C 100%)',borderRadius:18,border:'2px dashed rgba(107,58,42,0.5)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:20 }}>
              <div style={{fontSize:70,filter:'drop-shadow(0 6px 20px rgba(46,125,79,0.4))'}}>🌳</div>
              <div style={{textAlign:'center'}}>
                <h4 style={{color:'#fff',fontWeight:800,margin:'0 0 8px'}}>No Common Tree Yet</h4>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:14,margin:0}}>Add a root ancestor to start building</p>
              </div>
              <button onClick={()=>openAdd('root')} style={{...btnBase,background:'linear-gradient(135deg,#1B4D2E,#2E7D4F)',color:'#fff',border:'2px solid rgba(76,175,122,0.5)',fontSize:15,fontWeight:700,padding:'14px 32px',boxShadow:'0 6px 24px rgba(46,125,79,0.5)'}}>
                🌱 Add Root Ancestor
              </button>
            </div>
          ) : (
            <ReactFlowProvider>
              <TreeCanvas nodes={nodes} selectedId={selectedId} onSelect={setSelectedId}/>
            </ReactFlowProvider>
          )}
        </div>
      </div>

      <NodeModal open={modal.open} onClose={closeModal} onSave={handleSave} title={modal.title} initial={modal.initial}/>
    </div>
  );
}
