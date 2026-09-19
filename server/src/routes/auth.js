const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'mstore_super_secret_jwt_key_2026_production',
    { expiresIn: '30d' }
  );
};

// POST /api/auth/login - Admin Login Endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    // 1. Try finding registered admin in MongoDB Atlas
    const user = await User.findOne({ email: normalizedEmail });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id, user.role);
      return res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    }

    // 2. Controlled fallback using configurable Environment Variables
    const defaultAdminEmail = (process.env.ADMIN_EMAIL || 'admin@mstore.in').toLowerCase();
    const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (normalizedEmail === defaultAdminEmail && password === defaultAdminPassword) {
      const token = generateToken('admin_001', 'admin');
      return res.json({
        success: true,
        user: {
          id: 'admin_001',
          name: 'M Store Manager',
          email: defaultAdminEmail,
          role: 'admin',
        },
        token,
      });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(500).json({ message: 'Authentication failed' });
  }
});

module.exports = router;
