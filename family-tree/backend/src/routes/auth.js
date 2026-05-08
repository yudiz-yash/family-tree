const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendAdminNotification, sendApprovalEmail, sendRejectionEmail } = require('../utils/email');

const generateToken = (id, role = 'user', email = null) => {
  return jwt.sign({ id, role, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// POST /api/auth/register
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const user = await User.create({ email, password, status: 'pending' });

      // Notify admin — fire and forget
      sendAdminNotification(user).catch(err => console.error('Admin notify email failed:', err.message));

      res.status(201).json({
        success: true,
        pending: true,
        message: 'Registration successful! Your account is pending admin approval. You will receive an email once approved.'
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
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      if (user.status === 'pending') {
        return res.status(401).json({
          success: false,
          pending: true,
          message: 'Your account is pending admin approval. You will receive an email once approved.'
        });
      }

      if (user.status === 'rejected') {
        return res.status(401).json({
          success: false,
          message: 'Your registration request was not approved. Please contact the administrator.'
        });
      }

      const token = generateToken(user._id);

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          city: user.city,
          kuldeviName: user.kuldeviName,
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
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        city: req.user.city,
        kuldeviName: req.user.kuldeviName,
        contactNumber: req.user.contactNumber,
        profileCompleted: req.user.profileCompleted,
        role: req.user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
