const express = require('express');
const router = express.Router();
const FamilyTree = require('../models/FamilyTree');
const { protect } = require('../middleware/auth');

function generateCode(usedCodes) {
  let code, attempts = 0;
  do {
    code = String(Math.floor(100000 + Math.random() * 900000));
    attempts++;
  } while (usedCodes.has(code) && attempts < 10000);
  return code;
}

function assignCodes(nodes, existingCodeMap) {
  const usedCodes = new Set();
  // First pass: collect all codes already present so we don't duplicate
  nodes.forEach(n => {
    const c = n.code || existingCodeMap[n.nodeId];
    if (c && /^\d{6}$/.test(c)) usedCodes.add(c);
  });
  // Second pass: assign missing codes
  return nodes.map(n => {
    const existing = n.code || existingCodeMap[n.nodeId];
    if (existing && /^\d{6}$/.test(existing)) return { ...n, code: existing };
    const code = generateCode(usedCodes);
    usedCodes.add(code);
    return { ...n, code };
  });
}

// POST /api/family-tree — create or update, assigns stable codes
router.post('/', protect, async (req, res) => {
  const { nodes } = req.body;
  if (!Array.isArray(nodes)) {
    return res.status(400).json({ success: false, message: 'Nodes must be an array' });
  }
  try {
    // Load existing tree to preserve already-assigned codes
    const existing = await FamilyTree.findOne({ userId: req.user._id });
    const existingCodeMap = {};
    if (existing) {
      existing.nodes.forEach(n => {
        if (n.code && /^\d{6}$/.test(n.code)) existingCodeMap[n.nodeId] = n.code;
      });
    }

    const processedNodes = assignCodes(nodes, existingCodeMap);

    const tree = await FamilyTree.findOneAndUpdate(
      { userId: req.user._id },
      { userId: req.user._id, nodes: processedNodes },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: 'Family tree saved successfully', tree });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/family-tree — get current user's tree
router.get('/', protect, async (req, res) => {
  try {
    const tree = await FamilyTree.findOne({ userId: req.user._id });
    if (!tree) return res.json({ success: true, tree: null });
    res.json({ success: true, tree });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/family-tree/import-node/:code — find node + descendants by stable 6-digit code
router.get('/import-node/:code', protect, async (req, res) => {
  const { code } = req.params;
  if (!/^\d{6}$/.test(code)) {
    return res.status(400).json({ success: false, message: 'Code must be exactly 6 digits' });
  }
  try {
    const tree = await FamilyTree.findOne({ 'nodes.code': code });
    if (!tree) {
      return res.status(404).json({ success: false, message: 'No member found with this code' });
    }

    const allNodes = tree.nodes;
    const targetNode = allNodes.find(n => n.code === code);
    if (!targetNode) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Collect target node + all descendants recursively
    const collected = [];
    const collect = (nodeId) => {
      const node = allNodes.find(n => n.nodeId === nodeId);
      if (node) {
        collected.push(node.toObject ? node.toObject() : { ...node });
        allNodes.filter(n => n.parentId === nodeId).forEach(child => collect(child.nodeId));
      }
    };
    collect(targetNode.nodeId);

    res.json({ success: true, nodes: collected, rootName: targetNode.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
