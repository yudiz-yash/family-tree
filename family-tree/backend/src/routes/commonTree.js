const express = require('express');
const router = express.Router();
const CommonTree = require('../models/CommonTree');
const { protect, isAdmin } = require('../middleware/auth');

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
  nodes.forEach(n => {
    const c = n.code || existingCodeMap[n.nodeId];
    if (c && /^\d{6}$/.test(c)) usedCodes.add(c);
  });
  return nodes.map(n => {
    const existing = n.code || existingCodeMap[n.nodeId];
    if (existing && /^\d{6}$/.test(existing)) return { ...n, code: existing };
    const code = generateCode(usedCodes);
    usedCodes.add(code);
    return { ...n, code };
  });
}

// GET /api/common-tree — any logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const tree = await CommonTree.findOne();
    res.json({ success: true, tree: tree || null });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/common-tree — admin: save (upsert singleton), assigns stable codes
router.post('/', protect, isAdmin, async (req, res) => {
  const { nodes } = req.body;
  if (!Array.isArray(nodes)) return res.status(400).json({ success: false, message: 'Nodes must be an array' });
  try {
    const existing = await CommonTree.findOne();
    const existingCodeMap = {};
    if (existing) {
      existing.nodes.forEach(n => {
        if (n.code && /^\d{6}$/.test(n.code)) existingCodeMap[n.nodeId] = n.code;
      });
    }
    const processedNodes = assignCodes(nodes, existingCodeMap);
    let tree;
    if (existing) {
      existing.nodes = processedNodes;
      tree = await existing.save();
    } else {
      tree = await CommonTree.create({ nodes: processedNodes });
    }
    res.json({ success: true, tree });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/common-tree — admin: wipe the common tree
router.delete('/', protect, isAdmin, async (req, res) => {
  try {
    await CommonTree.deleteMany();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
