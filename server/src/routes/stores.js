const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const { protect, adminOnly } = require('../middleware/auth');

// Default initial stores fallback
const INITIAL_STORES = [
  {
    id: 'store001',
    name: 'Store 1 - Kootanad',
    code: 'STORE-01',
    location: 'Main Road, Near Bus Stand, Kootanad',
    phone: '+91 98765 43210',
    image: '/images/store-kootanad.png',
    maps: 'https://maps.google.com/?q=Kootanad+Kerala',
    status: 'active',
    description: 'Flagship M Store showroom featuring new sealed iPhones and certified pre-owned devices.',
  },
  {
    id: 'store002',
    name: 'Store 2 - Kecheri',
    code: 'STORE-02',
    location: 'Opposite Calicut Road, Kecheri',
    phone: '+91 98765 43211',
    image: '/images/store-kecheri.png',
    maps: 'https://maps.google.com/?q=Kecheri+Kerala',
    status: 'active',
    description: 'Kecheri branch with extensive range of pre-owned iPhones and original Apple gear.',
  },
  {
    id: 'store003',
    name: 'Store 3 - Mattom',
    code: 'STORE-03',
    location: 'Near Church Junction, Mattom',
    phone: '+91 98765 43212',
    image: '/images/store-mattom.png',
    maps: 'https://maps.google.com/?q=Mattom+Kerala',
    status: 'active',
    description: 'Mattom showroom providing hands-on testing, fast trade-ins, and accessory bundles.',
  },
  {
    id: 'store004',
    name: 'Store 4 - Pattambi',
    code: 'STORE-04',
    location: 'Town Centre, Pattambi',
    phone: '+91 98765 43213',
    image: '/images/store-kootanad.png',
    maps: 'https://maps.google.com/?q=Pattambi+Kerala',
    status: 'active',
    description: 'Pattambi M Store branch offering premium Apple sales and expert device support.',
  },
];

// GET /api/stores - Fetch all physical stores
router.get('/', async (req, res) => {
  try {
    let stores = await Store.find().sort({ id: 1 });
    if (!stores || stores.length === 0) {
      await Store.insertMany(INITIAL_STORES);
      stores = await Store.find().sort({ id: 1 });
    }
    return res.json(stores);
  } catch (err) {
    return res.json(INITIAL_STORES);
  }
});

// GET /api/stores/:id - Fetch single store
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findOne({ id: req.params.id });
    if (store) return res.json(store);

    const initial = INITIAL_STORES.find((s) => s.id === req.params.id);
    if (initial) return res.json(initial);

    return res.status(404).json({ message: 'Store not found' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// POST /api/stores - Create new store (Admin Only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const newStoreData = {
      ...req.body,
      id: req.body.id || 'store_' + Date.now(),
    };
    const store = await Store.create(newStoreData);
    return res.status(201).json(store);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// PUT /api/stores/:id - Update store (Admin Only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const store = await Store.findOneAndUpdate({ id: req.params.id }, req.body, {
      new: true,
      upsert: true,
    });
    return res.json(store);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// DELETE /api/stores/:id - Delete store (Admin Only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Store.findOneAndDelete({ id: req.params.id });
    return res.json({ message: 'Store deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
