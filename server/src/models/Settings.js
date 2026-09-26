const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    whatsappNumber: {
      type: String,
      default: '+91 88910 03031',
    },
    phone: {
      type: String,
      default: '+91 99463 36587',
    },
    email: {
      type: String,
      default: 'admin@mstore.in',
    },
    address: {
      type: String,
      default: 'Kootanad, Palakkad',
    },
    workingHours: {
      type: String,
      default: '10:00 AM - 9:00 PM Daily',
    },
    instagram: {
      type: String,
      default: 'https://instagram.com/m_store_official',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
