const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect, adminOnly } = require('../middleware/auth');

const DEFAULT_CATEGORIES = [
  { id: 'c1', name: 'iPhone 16 Series', slug: 'iphone-16', type: 'iphone-new' },
  { id: 'c2', name: 'iPhone 15 Series', slug: 'iphone-15', type: 'iphone-new' },
  { id: 'c3', name: 'iPhone 14 Series', slug: 'iphone-14', type: 'iphone-new' },
  { id: 'c4', name: 'iPhone 13 Series', slug: 'iphone-13', type: 'iphone-used' },
  { id: 'c5', name: 'iPhone 12 Series', slug: 'iphone-12', type: 'iphone-used' },
  { id: 'c6', name: 'Apple Adapters & Cables', slug: 'adapters', type: 'accessory' },
  { id: 'c7', name: 'AirPods & Audio', slug: 'audio', type: 'accessory' },
  { id: 'c8', name: 'MagSafe Cases & Wallets', slug: 'cases', type: 'accessory' },
];

// GET /api/categories - Fetch categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    if (categories && categories.length > 0) {
      return res.json(categories);
    }
    return res.json(DEFAULT_CATEGORIES);
  } catch (err) {
    return res.json(DEFAULT_CATEGORIES);
  }
});

// POST /api/categories - Add category (Admin Only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const category = await Category.create({
      ...req.body,
      id: req.body.id || 'cat_' + Date.now(),
    });
    return res.status(201).json(category);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = router;
