const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// GET /api/settings — public, returns payment QR info and maintenance mode status
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json({
      success: true,
      qrCodeImage: settings?.qrCodeImage || '',
      paymentAmount: settings?.paymentAmount || '',
      maintenanceMode: settings?.maintenanceMode ?? true
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
