const express = require('express');
const router = express.Router();
const Kuldevi = require('../models/Kuldevi');
const { protect, isAdmin } = require('../middleware/auth');

// Public — used by frontend dropdown
router.get('/', async (req, res) => {
  try {
    const list = await Kuldevi.find().sort({ name: 1 });
    res.json({ success: true, kuldevis: list });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin — add
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ success: false, message: 'Name is required' });
    const kuldevi = await Kuldevi.create({ name: name.trim() });
    res.status(201).json({ success: true, kuldevi });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'Already exists' });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin — delete
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    await Kuldevi.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
