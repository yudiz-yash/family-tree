const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// PUT /api/user/profile
router.put(
  '/profile',
  protect,
  [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('kuldeviName').notEmpty().withMessage('Kuldevi name is required'),
    body('surapura').notEmpty().withMessage('Surapura is required'),
    body('contactNumber').notEmpty().withMessage('Contact number is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { firstName, lastName, city, kuldeviName, surapura, contactNumber } = req.body;

    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          firstName,
          lastName,
          city,
          kuldeviName,
          surapura,
          contactNumber,
          profileCompleted: true
        },
        { new: true }
      ).select('-password');

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          city: user.city,
          kuldeviName: user.kuldeviName,
          surapura: user.surapura,
          contactNumber: user.contactNumber,
          profileCompleted: user.profileCompleted,
          role: user.role
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// GET /api/user/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        city: user.city,
        kuldeviName: user.kuldeviName,
        surapura: user.surapura,
        contactNumber: user.contactNumber,
        profileCompleted: user.profileCompleted,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
