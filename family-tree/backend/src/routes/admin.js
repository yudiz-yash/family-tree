const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FamilyTree = require('../models/FamilyTree');
const { protect, isAdmin } = require('../middleware/auth');

// GET /api/admin/users
router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });

    const usersWithTrees = await Promise.all(
      users.map(async (user) => {
        const tree = await FamilyTree.findOne({ userId: user._id });
        return {
          ...user.toObject(),
          familyTree: tree || null
        };
      })
    );

    res.json({ success: true, users: usersWithTrees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/admin/users/:id
router.get('/users/:id', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const tree = await FamilyTree.findOne({ userId: user._id });

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        familyTree: tree || null
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/admin/family-trees
router.get('/family-trees', protect, isAdmin, async (req, res) => {
  try {
    const trees = await FamilyTree.find().populate('userId', '-password').sort({ createdAt: -1 });

    res.json({ success: true, trees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/admin/stats
router.get('/stats', protect, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalTrees = await FamilyTree.countDocuments();

    const recentUsers = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalTrees,
        recentUsers
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
