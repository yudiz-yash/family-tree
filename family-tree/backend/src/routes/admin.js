const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FamilyTree = require('../models/FamilyTree');
const CommonTree = require('../models/CommonTree');
const Settings = require('../models/Settings');
const { protect, isAdmin } = require('../middleware/auth');
const { sendApprovalEmail, sendRejectionEmail } = require('../utils/email');

function generateCode(usedCodes) {
  let code, attempts = 0;
  do {
    code = String(Math.floor(100000 + Math.random() * 900000));
    attempts++;
  } while (usedCodes.has(code) && attempts < 10000);
  return code;
}

function assignCodes(nodes, existingCodeMap = {}) {
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

    let tree = await FamilyTree.findOne({ userId: user._id });

    // Auto-assign stable 6-digit codes to any nodes that are missing them
    if (tree && tree.nodes.length > 0) {
      const needsCodes = tree.nodes.some(n => !n.code || !/^\d{6}$/.test(n.code));
      if (needsCodes) {
        const rawNodes = tree.nodes.map(n => (n.toObject ? n.toObject() : { ...n }));
        const existingCodeMap = {};
        rawNodes.forEach(n => { if (n.code && /^\d{6}$/.test(n.code)) existingCodeMap[n.nodeId] = n.code; });
        const processedNodes = assignCodes(rawNodes, existingCodeMap);
        tree = await FamilyTree.findByIdAndUpdate(tree._id, { nodes: processedNodes }, { new: true });
      }
    }

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

// PUT /api/admin/users/:id/reset-password
router.put('/users/:id/reset-password', protect, isAdmin, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/admin/users/:id  (hard delete user + their family tree)
router.delete('/users/:id', protect, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await FamilyTree.findOneAndDelete({ userId: req.params.id });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/admin/family-trees/:id  (hard delete tree only)
router.delete('/family-trees/:id', protect, isAdmin, async (req, res) => {
  try {
    await FamilyTree.findByIdAndDelete(req.params.id);
    res.json({ success: true });
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
    const pendingApprovals = await User.countDocuments({ role: 'user', status: 'pending' });

    const recentUsers = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalTrees,
        pendingApprovals,
        recentUsers
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/admin/users/:id/approve
router.put('/users/:id/approve', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    sendApprovalEmail(user).catch(err => console.error('Approval email failed:', err.message));
    res.json({ success: true, message: 'User approved', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/admin/users/:id/reject
router.put('/users/:id/reject', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    sendRejectionEmail(user).catch(err => console.error('Rejection email failed:', err.message));
    res.json({ success: true, message: 'User rejected', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/admin/settings
router.get('/settings', protect, isAdmin, async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json({
      success: true,
      qrCodeImage: settings?.qrCodeImage || '',
      paymentAmount: settings?.paymentAmount || ''
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/admin/settings
router.put('/settings', protect, isAdmin, async (req, res) => {
  try {
    const { qrCodeImage, paymentAmount } = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ qrCodeImage: qrCodeImage || '', paymentAmount: paymentAmount || '' });
    } else {
      if (qrCodeImage !== undefined) settings.qrCodeImage = qrCodeImage;
      if (paymentAmount !== undefined) settings.paymentAmount = paymentAmount;
      await settings.save();
    }
    res.json({
      success: true,
      message: 'Settings saved',
      qrCodeImage: settings.qrCodeImage,
      paymentAmount: settings.paymentAmount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/admin/migrate-codes — assign stable 6-digit codes to all existing nodes
router.post('/migrate-codes', protect, isAdmin, async (req, res) => {
  try {
    // Collect all codes already assigned globally to avoid cross-tree collisions
    const allTrees = await FamilyTree.find();
    const globalUsed = new Set();
    allTrees.forEach(t => t.nodes.forEach(n => { if (n.code && /^\d{6}$/.test(n.code)) globalUsed.add(n.code); }));

    let migratedTrees = 0;

    for (const tree of allTrees) {
      const needsMigration = tree.nodes.some(n => !n.code || !/^\d{6}$/.test(n.code));
      if (!needsMigration) continue;

      const existingCodeMap = {};
      tree.nodes.forEach(n => { if (n.code && /^\d{6}$/.test(n.code)) existingCodeMap[n.nodeId] = n.code; });

      // Use global used set for true uniqueness across all trees
      const usedForThisTree = new Set([...globalUsed]);
      const processedNodes = tree.nodes.map(n => {
        const existing = n.code || existingCodeMap[n.nodeId];
        if (existing && /^\d{6}$/.test(existing)) return { ...n, code: existing };
        const code = generateCode(usedForThisTree);
        usedForThisTree.add(code);
        globalUsed.add(code);
        return { ...n, code };
      });

      await FamilyTree.findByIdAndUpdate(tree._id, { nodes: processedNodes });
      migratedTrees++;
    }

    // Migrate common tree nodes too
    const commonTree = await CommonTree.findOne();
    if (commonTree) {
      const needsMigration = commonTree.nodes.some(n => !n.code || !/^\d{6}$/.test(n.code));
      if (needsMigration) {
        const usedForCommon = new Set([...globalUsed]);
        const processedNodes = commonTree.nodes.map(n => {
          if (n.code && /^\d{6}$/.test(n.code)) return n;
          const code = generateCode(usedForCommon);
          usedForCommon.add(code);
          return { ...n, code };
        });
        await CommonTree.findByIdAndUpdate(commonTree._id, { nodes: processedNodes });
        migratedTrees++;
      }
    }

    res.json({ success: true, migratedTrees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
