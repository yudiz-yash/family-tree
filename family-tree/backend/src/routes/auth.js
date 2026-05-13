const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id, role = 'user', email = null) => {
  return jwt.sign({ id, role, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// POST /api/auth/register
router.post(
  '/register',
  [
    body('mobileNumber')
      .matches(/^[6-9]\d{9}$/)
      .withMessage('Please provide a valid 10-digit mobile number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { mobileNumber, password } = req.body;

    try {
      const existingUser = await User.findOne({ mobileNumber });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists with this mobile number' });
      }

      const user = await User.create({ mobileNumber, password, status: 'pending' });
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          mobileNumber: user.mobileNumber,
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

// POST /api/auth/login
router.post(
  '/login',
  [
    body('mobileNumber')
      .matches(/^[6-9]\d{9}$/)
      .withMessage('Please provide a valid 10-digit mobile number'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { mobileNumber, password } = req.body;

    try {
      const user = await User.findOne({ mobileNumber });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid mobile number or password' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid mobile number or password' });
      }

      if (user.status === 'rejected') {
        return res.status(401).json({
          success: false,
          message: 'Your registration request was not approved. Please contact the administrator.'
        });
      }

      // pending + profile done + payment done → block until admin approves
      if (user.status === 'pending' && user.profileCompleted && user.paymentDone) {
        return res.status(401).json({
          success: false,
          pending: true,
          message: 'Your account is pending admin approval. You will receive an email once approved.'
        });
      }

      // allow login so user can complete profile or payment
      const token = generateToken(user._id);

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          mobileNumber: user.mobileNumber,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          city: user.city,
          kuldeviName: user.kuldeviName,
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

// POST /api/auth/admin-login
router.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }

  const token = generateToken('admin', 'admin', email);

  res.json({
    success: true,
    token,
    user: {
      id: 'admin',
      email,
      role: 'admin'
    }
  });
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      return res.json({
        success: true,
        user: { id: 'admin', email: req.user.email, role: 'admin' }
      });
    }

    res.json({
      success: true,
      user: {
        id: req.user._id,
        mobileNumber: req.user.mobileNumber,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        city: req.user.city,
        kuldeviName: req.user.kuldeviName,
        contactNumber: req.user.contactNumber,
        profileCompleted: req.user.profileCompleted,
        paymentDone: req.user.paymentDone,
        role: req.user.role,
        status: req.user.status
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
