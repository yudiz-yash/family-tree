const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendAdminNotification } = require('../utils/email');

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
    body('contactNumber').notEmpty().withMessage('Contact number is required'),
    body('email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid email format')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { firstName, lastName, city, kuldeviName, surapura, contactNumber, email } = req.body;
    const isFirstCompletion = !req.user.profileCompleted;

    try {
      const updateData = { firstName, lastName, city, kuldeviName, surapura, contactNumber, profileCompleted: true };
      if (email && email.trim()) {
        updateData.email = email.trim().toLowerCase();
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true }
      ).select('-password');

      // Notify admin with full profile details when profile is completed for the first time
      if (isFirstCompletion && user.status === 'pending') {
        sendAdminNotification(user).catch(err => console.error('Admin notify email failed:', err.message));
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          mobileNumber: user.mobileNumber,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          city: user.city,
          kuldeviName: user.kuldeviName,
          surapura: user.surapura,
          contactNumber: user.contactNumber,
          profileCompleted: user.profileCompleted,
          paymentDone: user.paymentDone,
          role: user.role,
          status: user.status
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
        paymentDone: user.paymentDone,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/user/payment-done
router.post('/payment-done', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { paymentDone: true },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Payment marked as completed',
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
        paymentDone: user.paymentDone,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
