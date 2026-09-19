const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Segment = require('../models/Segment');
const { protect, adminOnly } = require('../middleware/auth');

const DEFAULT_SEGMENTS = [
  { id: 'seg_16pro', name: 'iPhone 16 Pro', slug: 'iphone-16-pro', thumbnail: '/images/featured-p5-desert.jpg', categoryType: 'BOTH', displayOrder: 1, isActive: true },
  { id: 'seg_16', name: 'iPhone 16', slug: 'iphone-16', thumbnail: '/images/featured-p4-blue.jpg', categoryType: 'BOTH', displayOrder: 2, isActive: true },
  { id: 'seg_15promax', name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max', thumbnail: '/images/featured-p7-row2.jpg', categoryType: 'BOTH', displayOrder: 3, isActive: true },
  { id: 'seg_15pro', name: 'iPhone 15 Pro', slug: 'iphone-15-pro', thumbnail: '/images/featured-p1-natural.jpg', categoryType: 'BOTH', displayOrder: 4, isActive: true },
  { id: 'seg_15', name: 'iPhone 15', slug: 'iphone-15', thumbnail: '/images/featured-p2-black.jpg', categoryType: 'BOTH', displayOrder: 5, isActive: true },
  { id: 'seg_14pro', name: 'iPhone 14 Pro', slug: 'iphone-14-pro', thumbnail: '/images/featured-p3-purple.jpg', categoryType: 'BOTH', displayOrder: 6, isActive: true },
  { id: 'seg_14', name: 'iPhone 14', slug: 'iphone-14', thumbnail: '/images/featured-p4-blue.jpg', categoryType: 'BOTH', displayOrder: 7, isActive: true },
  { id: 'seg_13pro', name: 'iPhone 13 Pro', slug: 'iphone-13-pro', thumbnail: '/images/featured-p5-row2.jpg', categoryType: 'BOTH', displayOrder: 8, isActive: true },
  { id: 'seg_13', name: 'iPhone 13', slug: 'iphone-13', thumbnail: '/images/featured-p6-row2.jpg', categoryType: 'BOTH', displayOrder: 9, isActive: true },
  { id: 'seg_12', name: 'iPhone 12', slug: 'iphone-12', thumbnail: '/images/featured-p8-row2.jpg', categoryType: 'BOTH', displayOrder: 10, isActive: true },
  { id: 'seg_11', name: 'iPhone 11', slug: 'iphone-11', thumbnail: '/images/featured-p4-blue.jpg', categoryType: 'BOTH', displayOrder: 11, isActive: true },
];

let inMemorySegments = [...DEFAULT_SEGMENTS];

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

async function seedSegmentsIfNeeded() {
  if (!isDbConnected()) return;
  try {
    const count = await Segment.countDocuments();
    if (count === 0) {
      await Segment.insertMany(DEFAULT_SEGMENTS);
    } else {
      const dbDocs = await Segment.find({}).sort({ displayOrder: 1 });
      if (dbDocs && dbDocs.length > 0) {
        inMemorySegments = dbDocs.map((doc) => doc.toObject());
      }
    }
  } catch (err) {
    console.error('Error seeding default segments:', err.message);
  }
}

// GET /api/segments - List all segments sorted by displayOrder
router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      await seedSegmentsIfNeeded();
      const segments = await Segment.find({}).sort({ displayOrder: 1 });
      if (segments && segments.length > 0) {
        inMemorySegments = segments.map((d) => d.toObject ? d.toObject() : d);
        return res.json(segments);
      }
    }
  } catch (err) {
    console.warn('MongoDB error fetching segments, returning in-memory segments:', err.message);
  }
  inMemorySegments.sort((a, b) => a.displayOrder - b.displayOrder);
  return res.json(inMemorySegments);
});

// POST /api/segments - Add new segment (Admin Only)
router.post('/', protect, adminOnly, async (req, res) => {
  const newSeg = {
    id: req.body.id || 'seg_' + Date.now(),
    name: req.body.name || 'New Model',
    slug: req.body.slug || 'new-model',
    thumbnail: req.body.thumbnail || '/images/featured-p1-natural.jpg',
    categoryType: req.body.categoryType || 'BOTH',
    displayOrder: req.body.displayOrder || inMemorySegments.length + 1,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
  };

  inMemorySegments.push(newSeg);

  try {
    if (isDbConnected()) {
      const created = await Segment.create(newSeg);
      return res.status(201).json(created);
    }
  } catch (err) {
    console.warn('MongoDB error creating segment, saved in memory:', err.message);
  }

  return res.status(201).json(newSeg);
});

// PUT /api/segments/:id - Update segment details (Admin Only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  const index = inMemorySegments.findIndex((s) => s.id === req.params.id);
  if (index !== -1) {
    inMemorySegments[index] = { ...inMemorySegments[index], ...req.body };
  }

  try {
    if (isDbConnected()) {
      const updated = await Segment.findOneAndUpdate({ id: req.params.id }, req.body, {
        new: true,
        upsert: true,
      });
      return res.json(updated);
    }
  } catch (err) {
    console.warn('MongoDB error updating segment, saved in memory:', err.message);
  }

  if (index !== -1) {
    return res.json(inMemorySegments[index]);
  }
  return res.status(404).json({ message: 'Segment not found' });
});

// PATCH /api/segments/:id/toggle - Toggle segment status (active / disabled) (Admin Only)
router.patch('/:id/toggle', protect, adminOnly, async (req, res) => {
  const index = inMemorySegments.findIndex((s) => s.id === req.params.id);
  if (index !== -1) {
    inMemorySegments[index].isActive = !inMemorySegments[index].isActive;
  }

  try {
    if (isDbConnected()) {
      const segment = await Segment.findOne({ id: req.params.id });
      if (segment) {
        segment.isActive = !segment.isActive;
        await segment.save();
        return res.json(segment);
      }
    }
  } catch (err) {
    console.warn('MongoDB error toggling segment, saved in memory:', err.message);
  }

  if (index !== -1) {
    return res.json(inMemorySegments[index]);
  }
  return res.status(404).json({ message: 'Segment not found' });
});

// DELETE /api/segments/:id - Delete segment (Admin Only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  inMemorySegments = inMemorySegments.filter((s) => s.id !== req.params.id);

  try {
    if (isDbConnected()) {
      await Segment.findOneAndDelete({ id: req.params.id });
      return res.json({ message: 'Segment deleted successfully' });
    }
  } catch (err) {
    console.warn('MongoDB error deleting segment, deleted from memory:', err.message);
  }

  return res.json({ message: 'Segment deleted successfully' });
});

module.exports = router;
