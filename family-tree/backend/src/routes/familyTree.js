const express = require('express');
const router = express.Router();
const FamilyTree = require('../models/FamilyTree');
const { protect } = require('../middleware/auth');

// POST /api/family-tree — create or update
router.post('/', protect, async (req, res) => {
  const { nodes } = req.body;

  if (!Array.isArray(nodes)) {
    return res.status(400).json({ success: false, message: 'Nodes must be an array' });
  }

  try {
    const tree = await FamilyTree.findOneAndUpdate(
      { userId: req.user._id },
      { userId: req.user._id, nodes },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Family tree saved successfully',
      tree
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/family-tree — get current user's tree
router.get('/', protect, async (req, res) => {
  try {
    const tree = await FamilyTree.findOne({ userId: req.user._id });

    if (!tree) {
      return res.json({ success: true, tree: null });
    }

    res.json({ success: true, tree });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
