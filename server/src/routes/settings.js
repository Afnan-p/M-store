const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// GET store contact settings
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        whatsappNumber: process.env.VITE_WHATSAPP_NUMBER || '+91 88910 03031',
        phone: process.env.VITE_STORE_PHONE || '+91 99463 36587',
        email: 'admin@mstore.in',
        address: 'Kootanad, Palakkad',
        workingHours: '10:00 AM - 9:00 PM Daily',
        instagram: 'https://instagram.com/m_store_official',
      });
    }
    res.json(settings);
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ error: 'Server error loading settings' });
  }
});

// UPDATE store contact settings
router.put('/', async (req, res) => {
  try {
    const { whatsappNumber, phone, email, address, workingHours, instagram } = req.body;
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings({});
    }

    if (whatsappNumber !== undefined) settings.whatsappNumber = whatsappNumber;
    if (phone !== undefined) settings.phone = phone;
    if (email !== undefined) settings.email = email;
    if (address !== undefined) settings.address = address;
    if (workingHours !== undefined) settings.workingHours = workingHours;
    if (instagram !== undefined) settings.instagram = instagram;

    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ error: 'Failed to update store settings' });
  }
});

module.exports = router;
