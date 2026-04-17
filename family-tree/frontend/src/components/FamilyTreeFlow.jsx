import React, { useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  Handle,
  Position,
  BaseEdge,
  getSmoothStepPath,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';

const NODE_W = 160;
const NODE_H = 110;
const H_GAP  = 80;
const V_GAP  = 140;

/* ─── layout ──────────────────────────────────────────────────── */
function buildLayout(nodes, selectedId, editMode) {
  if (!nodes?.length) return { flowNodes: [], flowEdges: [] };

  const nodeMap  = {};
  const childMap = {};
  nodes.forEach(n => { nodeMap[n.nodeId] = n; childMap[n.nodeId] = []; });

  const roots = [];
  nodes.forEach(n => {
    if (!n.parentId || !nodeMap[n.parentId]) roots.push(n.nodeId);
    else childMap[n.parentId].push(n.nodeId);
  });

  function sw(id) {
    const kids = childMap[id] || [];
    if (!kids.length) return NODE_W;
    return Math.max(kids.reduce((s, k) => s + sw(k), 0) + H_GAP * (kids.length - 1), NODE_W);
  }

  const pos = {};
  function place(id, x, y) {
    pos[id] = { x, y };
    const kids = childMap[id] || [];
    if (!kids.length) return;
    const total = kids.reduce((s, k) => s + sw(k), 0) + H_GAP * (kids.length - 1);
    let cx = x - total / 2 + NODE_W / 2;
    kids.forEach(k => {
      const w = sw(k);
      place(k, cx + w / 2 - NODE_W / 2, y + NODE_H + V_GAP);
      cx += w + H_GAP;
    });
  }

  const rootTW = roots.reduce((s, r) => s + sw(r), 0) + H_GAP * (roots.length - 1);
  let rx = -rootTW / 2 + NODE_W / 2;
  roots.forEach(r => { const w = sw(r); place(r, rx + w / 2 - NODE_W / 2, 0); rx += w + H_GAP; });

  /* depth for edge thickness */
  const depth = {};
  function setDepth(id, d) { depth[id] = d; (childMap[id] || []).forEach(k => setDepth(k, d + 1)); }
  roots.forEach(r => setDepth(r, 0));

  const flowNodes = nodes.map(n => ({
    id: n.nodeId,
    type: 'leaf',
    position: pos[n.nodeId] || { x: 0, y: 0 },
    data: { node: n, isRoot: !n.parentId || !nodeMap[n.parentId], isSelected: editMode && n.nodeId === selectedId && !n.isCommon, editMode, depth: depth[n.nodeId] || 0, isCommon: !!n.isCommon }
  }));

  const flowEdges = nodes
    .filter(n => n.parentId && nodeMap[n.parentId])
    .map(n => ({
      id: `e-${n.parentId}-${n.nodeId}`,
      source: n.parentId, target: n.nodeId,
      sourceHandle: 'bottom', targetHandle: 'top',
      type: 'branch',
      data: { depth: depth[n.parentId] || 0 }
    }));

  return { flowNodes, flowEdges };
}

/* ─── custom branch edge ──────────────────────────────────────── */
function BranchEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }) {
  const d = data?.depth || 0;
  const strokeW = Math.max(1.5, 3.5 - d * 0.5);
  const color = d === 0 ? '#6B3A2A' : d === 1 ? '#7B4A35' : '#8B5A45';

  const [edgePath] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
    borderRadius: 12,
    offset: 40
  });

  return (
    <>
      {/* shadow/glow behind */}
      <path
        d={edgePath}
        fill="none"
        stroke="rgba(0,0,0,0.35)"
        strokeWidth={strokeW + 2}
        strokeLinecap="round"
      />
      {/* main branch */}
      <path
        d={edgePath}
        fill="none"
        stroke={color}
        strokeWidth={strokeW}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 1px 3px rgba(107,58,42,0.4))` }}
      />
      {/* highlight */}
      <path
        d={edgePath}
        fill="none"
        stroke="rgba(255,220,180,0.15)"
        strokeWidth={1}
        strokeLinecap="round"
      />
    </>
  );
}

/* ─── node palette ────────────────────────────────────────────── */
const LEAF = {
  male:   { bg: ['#1B4D2E','#2E7D4F'], border: '#4CAF7A', glow: 'rgba(46,125,79,0.5)',  icon: '🌿', label: 'Male'   },
  female: { bg: ['#7B1D3A','#B5294E'], border: '#F48FB1', glow: 'rgba(181,41,78,0.5)',  icon: '🌸', label: 'Female' },
  other:  { bg: ['#3B2A6E','#5C3FA8'], border: '#9C84D4', glow: 'rgba(92,63,168,0.5)',  icon: '🍃', label: 'Other'  },
};
const ROOT_LEAF = { bg: ['#5D3A00','#8B5E00'], border: '#F4C430', glow: 'rgba(244,196,48,0.6)', icon: '🌳' };

function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('') || '?';
}

/* ─── leaf node ───────────────────────────────────────────────── */
function LeafNode({ data }) {
  const { node, isRoot, isSelected, editMode, depth, isCommon } = data;
  const p    = isRoot ? ROOT_LEAF : (LEAF[node.gender] || LEAF.male);
  const [c1, c2] = p.bg;

  return (
    <>
      {/* top connector stub (visual branch joining point) */}
      {!isRoot && (
        <div style={{
          position: 'absolute', top: -12, left: '50%',
          transform: 'translateX(-50%)',
          width: 3, height: 12,
          background: 'linear-gradient(to bottom, #7B4A35, #6B3A2A)',
          borderRadius: '3px 3px 0 0',
          zIndex: 0
        }} />
      )}

      <Handle type="target" id="top" position={Position.Top}
        style={{ background: 'transparent', border: 'none', width: 1, height: 1, top: 0, opacity: 0 }} />

      <div style={{
        width: NODE_W,
        background: `linear-gradient(160deg, ${c1} 0%, ${c2} 100%)`,
        borderRadius: isRoot ? '14px 14px 14px 14px' : 12,
        padding: '14px 12px 12px',
        color: '#fff',
        textAlign: 'center',
        position: 'relative',
        cursor: editMode ? 'pointer' : 'default',
        border: isSelected ? `3px solid #F4C430` : `2px solid ${p.border}`,
        boxShadow: isSelected
          ? `0 0 0 4px rgba(244,196,48,0.25), 0 12px 36px rgba(0,0,0,0.5), 0 0 20px ${p.glow}`
          : `0 8px 28px rgba(0,0,0,0.4), 0 0 12px ${p.glow}`,
        transform: isSelected ? 'scale(1.06)' : 'scale(1)',
        transition: 'transform 0.18s, box-shadow 0.18s',
        zIndex: 1
      }}>

        {/* Root badge */}
        {isRoot && !isCommon && (
          <div style={{
            position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)',
            background: 'linear-gradient(90deg,#F4C430,#D4A017)',
            color: '#3B1F00', fontSize: 9, fontWeight: 800,
            padding: '2px 12px', borderRadius: 20,
            letterSpacing: 1.5, whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(244,196,48,0.5)'
          }}>🌳 ANCESTOR</div>
        )}
        {/* Common tree root badge */}
        {isRoot && isCommon && (
          <div style={{
            position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)',
            background: 'linear-gradient(90deg,#6C3FC5,#8B5CF6)',
            color: '#fff', fontSize: 9, fontWeight: 800,
            padding: '2px 12px', borderRadius: 20,
            letterSpacing: 1.5, whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(108,63,197,0.5)'
          }}>🌍 COMMON ROOT</div>
        )}
        {/* Common node badge (non-root) */}
        {!isRoot && isCommon && (
          <div style={{
            position: 'absolute', top: -10, left: 6,
            background: 'rgba(108,63,197,0.8)',
            color: '#fff', fontSize: 8, fontWeight: 800,
            padding: '2px 8px', borderRadius: 20, letterSpacing: 1
          }}>COMMON</div>
        )}

        {/* Selected badge */}
        {isSelected && !isRoot && (
          <div style={{
            position: 'absolute', top: -10, right: 6,
            background: 'linear-gradient(90deg,#22c55e,#16a34a)',
            color: '#fff', fontSize: 8, fontWeight: 800,
            padding: '2px 8px', borderRadius: 20, letterSpacing: 1
          }}>✓</div>
        )}

        {/* Nature icon */}
        <div style={{ fontSize: 9, opacity: 0.6, marginBottom: 4, letterSpacing: 1 }}>
          {p.icon}
        </div>

        {/* Avatar circle */}
        <div style={{
          width: 42, height: 42, borderRadius: '50%',
          background: 'rgba(0,0,0,0.25)',
          border: `2px solid ${isSelected ? '#F4C430' : 'rgba(255,255,255,0.35)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 8px',
          fontSize: 15, fontWeight: 800, color: '#fff',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.3)',
          letterSpacing: -0.5
        }}>
          {initials(node.name)}
        </div>

        {/* Name */}
        <div style={{
          fontWeight: 700, fontSize: 13, lineHeight: 1.3,
          wordBreak: 'break-word', marginBottom: 2,
          textShadow: '0 1px 4px rgba(0,0,0,0.5)'
        }}>
          {node.name}
        </div>

        {/* Nickname */}
        {node.nickname && (
          <div style={{ fontSize: 10.5, opacity: 0.65, fontStyle: 'italic', marginBottom: 5 }}>
            "{node.nickname}"
          </div>
        )}

        {/* Gender pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 3,
          fontSize: 9.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8,
          background: 'rgba(0,0,0,0.3)',
          border: `1px solid rgba(255,255,255,0.15)`,
          padding: '2px 10px', borderRadius: 20
        }}>
          {p.label}
        </div>
      </div>

      <Handle type="source" id="bottom" position={Position.Bottom}
        style={{ background: 'transparent', border: 'none', width: 1, height: 1, bottom: 0, opacity: 0 }} />
    </>
  );
}

/* ─── SVG tree background defs ────────────────────────────────── */
function TreeDefs() {
  return (
    <svg width={0} height={0} style={{ position: 'absolute' }}>
      <defs>
        <pattern id="leafPattern" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1.5" fill="rgba(255,255,255,0.03)" />
          <circle cx="40" cy="35" r="1"   fill="rgba(255,255,255,0.025)" />
          <circle cx="55" cy="8"  r="1"   fill="rgba(255,255,255,0.02)" />
        </pattern>
      </defs>
    </svg>
  );
}

/* ─── Root trunk visual (renders below root node in canvas) ───── */
function TrunkOverlay({ nodes, rfNodes }) {
  if (!rfNodes?.length) return null;
  const rootRF = rfNodes.find(n => n.data?.isRoot);
  if (!rootRF) return null;
  return null; /* trunk is drawn via the branch stubs on nodes */
}

const nodeTypes = { leaf: LeafNode };
const edgeTypes = { branch: BranchEdge };

/* ─── inner flow ──────────────────────────────────────────────── */
function Inner({ nodes, selectedId, editMode, onNodeSelect }) {
  const { flowNodes, flowEdges } = useMemo(
    () => buildLayout(nodes, selectedId, editMode),
    [nodes, selectedId, editMode]
  );

  return (
    <div style={{
      width: '100%', height: 680,
      borderRadius: 22, overflow: 'hidden',
      background: 'linear-gradient(175deg, #050E07 0%, #071A0C 40%, #0A2010 70%, #071A0C 100%)',
      border: '2px solid rgba(107,58,42,0.5)',
      boxShadow: '0 12px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
      position: 'relative'
    }}>
      <TreeDefs />

      {/* forest floor gradient overlay at bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
        background: 'linear-gradient(to top, rgba(5,14,7,0.8), transparent)',
        zIndex: 10, pointerEvents: 'none', borderRadius: '0 0 22px 22px'
      }} />

      {/* top mist */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 60,
        background: 'linear-gradient(to bottom, rgba(5,14,7,0.6), transparent)',
        zIndex: 10, pointerEvents: 'none', borderRadius: '22px 22px 0 0'
      }} />

      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.1}
        maxZoom={2.5}
        attributionPosition="bottom-left"
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        onNodeClick={(_, n) => { if (editMode && onNodeSelect && !n.data?.isCommon) onNodeSelect(n.id); }}
      >
        {/* subtle dot pattern */}
        <Background
          variant="dots"
          color="rgba(255,255,255,0.04)"
          gap={30}
          size={1}
        />

        <Controls style={{
          background: 'rgba(5,14,7,0.8)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(107,58,42,0.4)',
          borderRadius: 12,
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)'
        }} />
      </ReactFlow>

      {/* edit hint */}
      {editMode && nodes.length > 0 && (
        <div style={{
          position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(5,14,7,0.85)',
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(107,58,42,0.4)',
          borderRadius: 20, padding: '6px 18px',
          color: 'rgba(255,255,255,0.55)', fontSize: 11.5, fontWeight: 500,
          whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 20
        }}>
          🌿 Click any card to select
        </div>
      )}

      {/* legend */}
      <div style={{
        position: 'absolute', top: 14, right: 14,
        background: 'rgba(5,14,7,0.8)',
        backdropFilter: 'blur(6px)',
        border: '1px solid rgba(107,58,42,0.35)',
        borderRadius: 12, padding: '8px 14px',
        display: 'flex', gap: 12, zIndex: 20,
        pointerEvents: 'none'
      }}>
        {[
          { color: '#F4C430', label: 'Root' },
          { color: '#2E7D4F', label: 'Male' },
          { color: '#B5294E', label: 'Female' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color, boxShadow: `0 0 4px ${l.color}` }} />
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10.5, fontWeight: 600 }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FamilyTreeFlow({ nodes, selectedId, editMode, onNodeSelect }) {
  return (
    <ReactFlowProvider>
      <Inner nodes={nodes} selectedId={selectedId} editMode={editMode} onNodeSelect={onNodeSelect} />
    </ReactFlowProvider>
  );
}
