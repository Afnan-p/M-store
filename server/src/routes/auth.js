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

const path = require('path');
const dotenv = require('dotenv');

// POST /api/auth/login - Admin Login Endpoint
router.post('/login', async (req, res) => {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const cleanPassword = String(password).trim();

  try {
    // 1. Production Admin Credentials check via Environment Variables
    const envAdminEmail = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.trim().toLowerCase() : null;
    const envAdminPassword = process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD.trim() : null;

    if (!envAdminEmail || !envAdminPassword) {
      console.warn('[Auth Warning] Admin credentials are not configured in environment variables.');
    }

    // If submitted email matches configured ADMIN_EMAIL, strictly validate against ADMIN_PASSWORD only
    if (envAdminEmail && normalizedEmail === envAdminEmail) {
      if (envAdminPassword && cleanPassword === envAdminPassword) {
        const token = generateToken('admin_env', 'admin');
        return res.json({
          success: true,
          user: {
            id: 'admin_env',
            name: 'M Store Manager',
            email: envAdminEmail,
            role: 'admin',
          },
          token,
        });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2. MongoDB Admin User check (for custom database admin accounts)
    const user = await User.findOne({ email: normalizedEmail });
    if (user) {
      // Explicitly reject any legacy demo password
      if (password === 'admin123') {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      if (await bcrypt.compare(password, user.password)) {
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
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(500).json({ message: 'Authentication failed' });
  }
});

module.exports = router;
