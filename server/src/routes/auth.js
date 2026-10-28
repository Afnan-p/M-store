const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const path = require('path');
const dotenv = require('dotenv');

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'mstore_super_secret_jwt_key_2026_production',
    { expiresIn: '30d' }
  );
};

// POST /api/auth/login - Admin Login Endpoint
router.post('/login', async (req, res) => {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const cleanPassword = String(password).trim();
  const envAdminEmail = (process.env.ADMIN_EMAIL || 'admin@mstore.in').toLowerCase().trim();
  const envAdminPassword = process.env.ADMIN_PASSWORD || 'mstore@123';

  try {
    // 1. Check MongoDB Admin User FIRST (allows admin to change credentials dynamically from Settings)
    const user = await User.findOne({ email: normalizedEmail });
    if (user) {
      // Explicitly reject any legacy demo password
      if (cleanPassword === 'admin123') {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      if (await bcrypt.compare(cleanPassword, user.password)) {
        const token = generateToken(user._id, user.role);
        return res.json({
          success: true,
          user: {
            id: user._id,
            name: user.name || 'M Store Manager',
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2. Fallback to Initial Environment Variables check ONLY if database has no admin user yet (First Run Bootstrap)
    const anyAdminInDb = await User.exists({ role: 'admin' });
    if (!anyAdminInDb && envAdminEmail && normalizedEmail === envAdminEmail) {
      if (envAdminPassword && cleanPassword === envAdminPassword) {
        // Automatically sync/seed this user to MongoDB so future changes can be made via dashboard
        let adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(envAdminPassword, salt);
            adminUser = await User.create({
              name: 'M Store Manager',
              email: envAdminEmail,
              password: hashedPassword,
              role: 'admin',
            });
          } catch (seedErr) {
            console.warn('[Auth] Could not auto-seed admin user:', seedErr.message);
          }
        }

        const token = generateToken(adminUser ? adminUser._id : 'admin_env', 'admin');
        return res.json({
          success: true,
          user: {
            id: adminUser ? adminUser._id : 'admin_env',
            name: adminUser ? adminUser.name : 'M Store Manager',
            email: adminUser ? adminUser.email : envAdminEmail,
            role: 'admin',
          },
          token,
        });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(500).json({ message: 'Authentication failed' });
  }
});

// GET /api/auth/me - Current Admin Profile
router.get('/me', protect, adminOnly, async (req, res) => {
  try {
    dotenv.config({ path: path.resolve(__dirname, '../../.env') });
    let adminUser = null;
    if (req.user && req.user.id && req.user.id !== 'admin_env' && req.user.id !== 'admin_dev') {
      adminUser = await User.findById(req.user.id).select('-password');
    }
    if (!adminUser) {
      adminUser = await User.findOne({ role: 'admin' }).select('-password');
    }

    const email = adminUser ? adminUser.email : (process.env.ADMIN_EMAIL || 'admin@mstore.in');
    const name = adminUser ? adminUser.name : 'M Store Manager';
    const role = adminUser ? adminUser.role : 'admin';

    res.json({
      id: adminUser ? adminUser._id : 'admin_default',
      email,
      name,
      role,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving profile' });
  }
});

// PUT /api/auth/credentials - Update Admin Login Email & Password from Store Settings
router.put('/credentials', protect, adminOnly, async (req, res) => {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
  const { currentPassword, newEmail, newPassword } = req.body;

  if (!currentPassword) {
    return res.status(400).json({ message: 'Current password is required to save security changes' });
  }

  const envAdminEmail = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.trim().toLowerCase() : 'admin@mstore.in';
  const envAdminPassword = process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD.trim() : 'mstore@123';

  try {
    // 1. Locate Admin User Document
    let adminUser = null;
    if (req.user && req.user.id && req.user.id !== 'admin_env' && req.user.id !== 'admin_dev') {
      adminUser = await User.findById(req.user.id);
    }
    if (!adminUser) {
      adminUser = await User.findOne({ role: 'admin' });
    }
    if (!adminUser) {
      adminUser = await User.findOne({ email: envAdminEmail });
    }

    // 2. Verify Current Password
    let isPasswordValid = false;
    if (adminUser && adminUser.password) {
      isPasswordValid = await bcrypt.compare(String(currentPassword).trim(), adminUser.password);
    }
    if (!isPasswordValid && String(currentPassword).trim() === envAdminPassword) {
      isPasswordValid = true;
    }

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect. Please re-enter your existing password.' });
    }

    // 3. If no User record exists yet, create one
    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const initialHashed = await bcrypt.hash(envAdminPassword, salt);
      adminUser = new User({
        name: 'M Store Manager',
        email: envAdminEmail,
        password: initialHashed,
        role: 'admin',
      });
    }

    // 4. Update Email if provided
    if (newEmail && newEmail.trim()) {
      const cleanNewEmail = newEmail.trim().toLowerCase();
      const existingOther = await User.findOne({ email: cleanNewEmail, _id: { $ne: adminUser._id } });
      if (existingOther) {
        return res.status(400).json({ message: 'This email is already in use by another user' });
      }
      adminUser.email = cleanNewEmail;
    }

    // 5. Update Password if provided
    if (newPassword && newPassword.trim()) {
      const cleanNewPassword = String(newPassword).trim();
      if (cleanNewPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' });
      }
      const salt = await bcrypt.genSalt(10);
      adminUser.password = await bcrypt.hash(cleanNewPassword, salt);
    }

    await adminUser.save();

    const token = generateToken(adminUser._id, adminUser.role);

    return res.json({
      success: true,
      message: 'Admin login credentials updated successfully!',
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
      token,
    });
  } catch (err) {
    console.error('Update credentials error:', err);
    return res.status(500).json({ message: 'Failed to update admin credentials: ' + err.message });
  }
});

module.exports = router;
