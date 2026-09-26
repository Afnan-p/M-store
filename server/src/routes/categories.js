const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const { protect, adminOnly } = require('../middleware/auth');

const DEFAULT_CATEGORIES = [
  {
    id: 'cat_iphones',
    name: 'iPhones',
    slug: 'iphones',
    image: '/images/cat-iphones.png',
    link: '/iphones',
    type: 'iphone-new',
    description: 'Brand new sealed Apple iPhones with official warranty.',
    status: 'active',
    displayOrder: 1,
  },
  {
    id: 'cat_used_iphones',
    name: 'Used iPhones',
    slug: 'used-iphones',
    image: '/images/cat-preowned.png?v=2',
    link: '/used-iphones',
    type: 'iphone-used',
    description: 'Certified pre-owned iPhones tested for battery & performance.',
    status: 'active',
    displayOrder: 2,
  },
  {
    id: 'cat_android',
    name: 'Android',
    slug: 'android',
    image: '/images/cat-iphones.png',
    link: '/category/android',
    type: 'android',
    description: 'Latest & pre-owned Android smartphones.',
    status: 'active',
    displayOrder: 3,
  },
  {
    id: 'cat_accessories',
    name: 'Accessories',
    slug: 'accessories',
    image: '/images/cat-accessories.png',
    link: '/accessories',
    type: 'accessory',
    description: 'Original Apple accessories, adapters, cases & audio gear.',
    status: 'active',
    displayOrder: 4,
  },
  {
    id: 'cat_offers',
    name: 'Offers',
    slug: 'offers',
    image: '/images/cat-offers.png',
    link: '/offers',
    type: 'offers',
    description: 'Exclusive combo deals, promotional discounts and gift bundles.',
    status: 'active',
    displayOrder: 5,
  },
];

// GET /api/categories - Fetch categories
router.get('/', async (req, res) => {
  try {
    // Clean up old used-android category doc if exists
    await Category.deleteMany({ slug: 'used-android' });

    for (const defCat of DEFAULT_CATEGORIES) {
      await Category.findOneAndUpdate(
        { $or: [{ id: defCat.id }, { slug: defCat.slug }] },
        { $set: defCat },
        { upsert: true, new: true }
      );
    }
    const categories = await Category.find({ status: 'active' }).sort({ displayOrder: 1, createdAt: 1 });
    return res.json(categories);
  } catch (err) {
    return res.json(DEFAULT_CATEGORIES);
  }
});

// GET /api/categories/:id - Fetch single category
router.get('/:id', async (req, res) => {
  try {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const category = await Category.findOne({
      $or: [
        { id: req.params.id },
        { slug: req.params.id },
        ...(isValidObjectId ? [{ _id: req.params.id }] : []),
      ],
    });
    if (category) return res.json(category);
    return res.status(404).json({ message: 'Category not found' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// POST /api/categories - Add category (Admin Only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const name = req.body.name || 'New Category';
    const slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const categoryData = {
      ...req.body,
      id: req.body.id || 'cat_' + Date.now(),
      slug,
      link: req.body.link || `/products?category=${slug}`,
    };

    const category = await Category.create(categoryData);
    return res.status(201).json(category);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// PUT /api/categories/:id - Update category (Admin Only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const category = await Category.findOneAndUpdate(
      {
        $or: [
          { id: req.params.id },
          ...(isValidObjectId ? [{ _id: req.params.id }] : []),
        ],
      },
      req.body,
      { new: true, upsert: true }
    );
    return res.json(category);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// DELETE /api/categories/:id - Delete category (Admin Only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    await Category.findOneAndDelete({
      $or: [
        { id: req.params.id },
        ...(isValidObjectId ? [{ _id: req.params.id }] : []),
      ],
    });
    return res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;

