import React, { useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

const NODE_WIDTH = 170;
const NODE_HEIGHT = 100;
const H_GAP = 60;
const V_GAP = 120;

function computeLayout(nodes) {
  if (!nodes || nodes.length === 0) return { flowNodes: [], flowEdges: [] };

  const childrenMap = {};
  const nodeMap = {};
  nodes.forEach((n) => {
    nodeMap[n.nodeId] = n;
    childrenMap[n.nodeId] = [];
  });

  const roots = [];
  nodes.forEach((n) => {
    if (!n.parentId || !nodeMap[n.parentId]) roots.push(n.nodeId);
    else childrenMap[n.parentId].push(n.nodeId);
  });

  function subtreeWidth(id) {
    const kids = childrenMap[id] || [];
    if (!kids.length) return NODE_WIDTH;
    const total = kids.reduce((s, k) => s + subtreeWidth(k), 0);
    return Math.max(total + H_GAP * (kids.length - 1), NODE_WIDTH);
  }

  const positions = {};
  function place(id, x, y) {
    positions[id] = { x, y };
    const kids = childrenMap[id] || [];
    if (!kids.length) return;
    const total =
      kids.reduce((s, k) => s + subtreeWidth(k), 0) + H_GAP * (kids.length - 1);
    let cx = x - total / 2 + NODE_WIDTH / 2;
    kids.forEach((k) => {
      const w = subtreeWidth(k);
      place(k, cx + w / 2 - NODE_WIDTH / 2, y + NODE_HEIGHT + V_GAP);
      cx += w + H_GAP;
    });
  }

  const rootTotalW =
    roots.reduce((s, r) => s + subtreeWidth(r), 0) + H_GAP * (roots.length - 1);
  let rx = -rootTotalW / 2 + NODE_WIDTH / 2;
  roots.forEach((r) => {
    const w = subtreeWidth(r);
    place(r, rx + w / 2 - NODE_WIDTH / 2, 0);
    rx += w + H_GAP;
  });

  const flowNodes = nodes.map((n) => {
    const isRoot = !n.parentId || !nodeMap[n.parentId];
    return {
      id: n.nodeId,
      type: 'person',
      position: positions[n.nodeId] || { x: 0, y: 0 },
      data: { node: n, isRoot }
    };
  });

  const flowEdges = nodes
    .filter((n) => n.parentId && nodeMap[n.parentId])
    .map((n) => ({
      id: `e-${n.parentId}-${n.nodeId}`,
      source: n.parentId,
      target: n.nodeId,
      sourceHandle: 'bottom',
      targetHandle: 'top',
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#a78bfa',
        width: 16,
        height: 16
      },
      style: { stroke: '#a78bfa', strokeWidth: 2.5 }
    }));

  return { flowNodes, flowEdges };
}

const genderStyle = {
  male:   { bg: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', border: '#93c5fd' },
  female: { bg: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', border: '#93c5fd' },
  other:  { bg: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', border: '#93c5fd' }
};
const rootBg = 'linear-gradient(135deg,#6C3FC5,#4c1d95)';

function PersonNode({ data }) {
  const { node, isRoot } = data;
  const gs = genderStyle[node.gender] || genderStyle.male;
  const bg = isRoot ? rootBg : gs.bg;
  const border = isRoot ? '#F4C430' : gs.border;

  return (
    <>
      <Handle
        type="target"
        id="top"
        position={Position.Top}
        style={{ background: 'transparent', border: 'none', width: 1, height: 1, top: 0 }}
      />

      <div style={{
        width: NODE_WIDTH,
        minHeight: NODE_HEIGHT,
        background: bg,
        border: `2.5px solid ${border}`,
        borderRadius: 16,
        boxShadow: isRoot
          ? '0 8px 30px rgba(108,63,197,0.45)'
          : '0 4px 18px rgba(0,0,0,0.22)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px 12px',
        color: '#fff',
        textAlign: 'center',
        position: 'relative'
      }}>
        {isRoot && (
          <div style={{
            position: 'absolute', top: -11, left: '50%',
            transform: 'translateX(-50%)',
            background: '#F4C430', color: '#1a1a2e',
            fontSize: 9, fontWeight: 800,
            padding: '2px 10px', borderRadius: 20,
            letterSpacing: 1, whiteSpace: 'nowrap'
          }}>ROOT</div>
        )}

        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(255,255,255,0.22)',
          border: '2px solid rgba(255,255,255,0.5)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14, fontWeight: 800, marginBottom: 8, flexShrink: 0
        }}>
          {node.name.trim().split(/\s+/).slice(0,2).map(w=>w[0]?.toUpperCase()).join('')||'?'}
        </div>

        <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.25, wordBreak: 'break-word' }}>
          {node.name}
        </div>

        {node.nickname && (
          <div style={{ fontSize: 11, opacity: 0.8, fontStyle: 'italic', marginTop: 3 }}>
            "{node.nickname}"
          </div>
        )}

        {node.code && (
          <div style={{
            marginTop: 5, fontSize: 9, color: 'rgba(255,255,255,0.45)',
            letterSpacing: 1.2, fontFamily: 'monospace'
          }}>
            #{node.code}
          </div>
        )}
      </div>

      <Handle
        type="source"
        id="bottom"
        position={Position.Bottom}
        style={{ background: 'transparent', border: 'none', width: 1, height: 1, bottom: 0 }}
      />
    </>
  );
}

const nodeTypes = { person: PersonNode };

function Inner({ nodes }) {
  const { flowNodes, flowEdges } = useMemo(() => computeLayout(nodes), [nodes]);

  return (
    <div style={{
      width: '100%',
      height: 600,
      background: 'linear-gradient(135deg,#f5f0ff 0%,#eef2ff 100%)',
      borderRadius: 16,
      overflow: 'hidden',
      border: '1px solid #e0d7f8',
      boxShadow: '0 4px 24px rgba(108,63,197,0.1)'
    }}>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.15}
        maxZoom={2.5}
        attributionPosition="bottom-left"
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: false }}
      >
        <Background color="#c4b5fd" gap={28} size={1} style={{ opacity: 0.35 }} />
        <Controls style={{
          background: '#fff',
          border: '1px solid #e0d7f8',
          borderRadius: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }} />
        <MiniMap
          nodeColor={() => '#6C3FC5'}
          style={{
            background: '#fff',
            border: '1px solid #e0d7f8',
            borderRadius: 10
          }}
        />
      </ReactFlow>
    </div>
  );
}

export default function FamilyTreeFlow({ nodes }) {
  return (
    <ReactFlowProvider>
      <Inner nodes={nodes} />
    </ReactFlowProvider>
  );
}
