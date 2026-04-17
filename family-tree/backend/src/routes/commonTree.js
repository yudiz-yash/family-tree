const express = require('express');
const router = express.Router();
const CommonTree = require('../models/CommonTree');
const { protect, isAdmin } = require('../middleware/auth');

// GET /api/common-tree — any logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const tree = await CommonTree.findOne();
    res.json({ success: true, tree: tree || null });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/common-tree — admin: save (upsert singleton)
router.post('/', protect, isAdmin, async (req, res) => {
  const { nodes } = req.body;
  if (!Array.isArray(nodes)) return res.status(400).json({ success: false, message: 'Nodes must be an array' });
  try {
    const existing = await CommonTree.findOne();
    let tree;
    if (existing) {
      existing.nodes = nodes;
      tree = await existing.save();
    } else {
      tree = await CommonTree.create({ nodes });
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
