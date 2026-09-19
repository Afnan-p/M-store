const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const OfferProduct = require('../models/OfferProduct');
const { protect, adminOnly } = require('../middleware/auth');

const INITIAL_OFFER_PRODUCTS = [
  {
    id: 'offprod_001',
    name: 'Apple Silicone Case (MagSafe)',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=600&auto=format&fit=crop',
    storeId: 'ALL',
    stock: 150,
    status: 'active',
  },
  {
    id: 'offprod_002',
    name: 'Apple 20W USB-C Power Adapter',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=600&auto=format&fit=crop',
    storeId: 'ALL',
    stock: 200,
    status: 'active',
  },
  {
    id: 'offprod_003',
    name: '9H Tempered Glass Screen Protector',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=600&auto=format&fit=crop',
    storeId: 'ALL',
    stock: 300,
    status: 'active',
  },
  {
    id: 'offprod_004',
    name: 'Wireless Bluetooth Earbuds',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
    storeId: 'ALL',
    stock: 80,
    status: 'active',
  },
  {
    id: 'offprod_005',
    name: 'MagSafe Wireless Charging Cable (1m)',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=600&auto=format&fit=crop',
    storeId: 'ALL',
    stock: 120,
    status: 'active',
  },
];

let inMemoryOfferProducts = [...INITIAL_OFFER_PRODUCTS];

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

// GET /api/offer-products - Get all offer products
router.get('/', async (req, res) => {
  const { storeId, status } = req.query;

  try {
    if (isDbConnected()) {
      const query = {};
      if (storeId && storeId !== 'ALL') {
        query.$or = [{ storeId: storeId }, { storeId: 'ALL' }];
      }
      if (status) {
        query.status = status;
      }

      const offerProducts = await OfferProduct.find(query).sort({ createdAt: -1 });
      if (offerProducts && offerProducts.length > 0) {
        inMemoryOfferProducts = offerProducts.map((d) => (d.toObject ? d.toObject() : d));
        return res.json(offerProducts);
      }
    }
  } catch (error) {
    console.warn('MongoDB error fetching offer products, returning in-memory catalog:', error.message);
  }

  let filtered = [...inMemoryOfferProducts];
  if (storeId && storeId !== 'ALL' && storeId !== 'all') {
    filtered = filtered.filter((op) => !op.storeId || op.storeId === 'ALL' || op.storeId === 'all' || op.storeId === storeId);
  }
  if (status) {
    filtered = filtered.filter((op) => op.status === status);
  }

  return res.json(filtered);
});

// GET /api/offer-products/:id - Get single offer product
router.get('/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const offerProduct = await OfferProduct.findOne({ id: req.params.id });
      if (offerProduct) return res.json(offerProduct);
    }
  } catch (error) {
    console.warn('MongoDB error fetching offer product by ID, checking memory:', error.message);
  }

  const found = inMemoryOfferProducts.find((op) => op.id === req.params.id);
  if (found) return res.json(found);

  return res.status(404).json({ message: 'Offer product not found' });
});

// POST /api/offer-products - Create new offer product (Admin Only)
router.post('/', protect, adminOnly, async (req, res) => {
  const offerProductData = {
    ...req.body,
    id: req.body.id || 'offprod_' + Date.now(),
    createdAt: req.body.createdAt || new Date().toISOString(),
  };

  inMemoryOfferProducts.unshift(offerProductData);

  try {
    if (isDbConnected()) {
      const newOfferProduct = new OfferProduct(offerProductData);
      await newOfferProduct.save();
      return res.status(201).json(newOfferProduct);
    }
  } catch (error) {
    console.warn('MongoDB error creating offer product, saved in memory:', error.message);
  }

  return res.status(201).json(offerProductData);
});

// PUT /api/offer-products/:id - Update existing offer product (Admin Only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  const index = inMemoryOfferProducts.findIndex((op) => op.id === req.params.id);
  if (index !== -1) {
    inMemoryOfferProducts[index] = { ...inMemoryOfferProducts[index], ...req.body };
  } else {
    inMemoryOfferProducts.push({ ...req.body, id: req.params.id });
  }

  try {
    if (isDbConnected()) {
      const updatedOfferProduct = await OfferProduct.findOneAndUpdate(
        { id: req.params.id },
        { $set: req.body },
        { new: true, runValidators: true }
      );
      if (updatedOfferProduct) return res.json(updatedOfferProduct);
    }
  } catch (error) {
    console.warn('MongoDB error updating offer product, saved in memory:', error.message);
  }

  const result = index !== -1 ? inMemoryOfferProducts[index] : req.body;
  return res.json(result);
});

// DELETE /api/offer-products/:id - Delete offer product (Admin Only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  inMemoryOfferProducts = inMemoryOfferProducts.filter((op) => op.id !== req.params.id);

  try {
    if (isDbConnected()) {
      await OfferProduct.findOneAndDelete({ id: req.params.id });
      return res.json({ message: 'Offer product deleted successfully', id: req.params.id });
    }
  } catch (error) {
    console.warn('MongoDB error deleting offer product, deleted from memory:', error.message);
  }

  return res.json({ message: 'Offer product deleted successfully', id: req.params.id });
});

module.exports = router;
