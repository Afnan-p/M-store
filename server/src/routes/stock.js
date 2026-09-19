const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ProductStock = require('../models/ProductStock');
const StockHistory = require('../models/StockHistory');
const Product = require('../models/Product');
const OfferProduct = require('../models/OfferProduct');
const { protect, adminOnly } = require('../middleware/auth');

const STORES = ['store001', 'store002', 'store003', 'store004'];

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

// Helper to calculate status
function getStockStatus(stock) {
  if (stock === 0) return 'Out of Stock';
  if (stock >= 1 && stock <= 5) return 'Low Stock';
  return 'In Stock';
}

const MOCK_STOCK_LEVELS = {};

let inMemoryStocks = [];
let inMemoryHistory = [];

// GET /api/stock - List all product stock records with filters
router.get('/', async (req, res) => {
  const { storeId, status, search, category } = req.query;

  try {
    if (isDbConnected()) {
      const products = await Product.find({}).lean();
      const offerProducts = await OfferProduct.find({}).lean();

      // Build fast lookup maps by String(id), String(_id) and lowercase name
      const prodMap = new Map();
      products.forEach((p) => {
        if (p.id) prodMap.set(String(p.id), p);
        if (p._id) prodMap.set(String(p._id), p);
        if (p.name) prodMap.set(p.name.toLowerCase().trim(), p);
      });

      const offerMap = new Map();
      offerProducts.forEach((op) => {
        if (op.id) offerMap.set(String(op.id), op);
        if (op._id) offerMap.set(String(op._id), op);
        if (op.name) offerMap.set(op.name.toLowerCase().trim(), op);
      });

      let allStockRecords = await ProductStock.find({}).lean();

      // Auto-ensure stock entries exist in MongoDB in a single bulk operation
      const missingDocs = [];
      const allProductItems = [
        ...products.map((p) => ({ id: p.id, itemType: 'product' })),
        ...offerProducts.map((op) => ({ id: op.id, itemType: 'offerProduct' })),
      ];

      for (const pItem of allProductItems) {
        const prodObj = prodMap.get(String(pItem.id));
        const isSpecificStore = prodObj?.storeId && prodObj.storeId !== 'ALL' && prodObj.storeId !== 'all';
        const pStoreLower = String(prodObj?.storeId || '').toLowerCase();

        for (const sId of STORES) {
          const isMatch = !isSpecificStore || (
            prodObj?.storeId === sId ||
            (sId === 'store001' && pStoreLower.includes('kootanad')) ||
            (sId === 'store002' && pStoreLower.includes('kecheri')) ||
            (sId === 'store003' && pStoreLower.includes('mattom')) ||
            (sId === 'store004' && pStoreLower.includes('pattambi'))
          );

          if (!isMatch) continue;

          const exists = allStockRecords.some((s) => String(s.productId) === String(pItem.id) && s.storeId === sId);
          if (!exists) {
            missingDocs.push({
              id: `stock_${pItem.id}_${sId}`,
              productId: String(pItem.id),
              storeId: sId,
              stock: 10,
              itemType: pItem.itemType,
            });
          }
        }
      }

      if (missingDocs.length > 0) {
        try {
          await ProductStock.insertMany(missingDocs, { ordered: false });
          allStockRecords = await ProductStock.find({}).lean();
        } catch (insertErr) {
          allStockRecords = await ProductStock.find({}).lean();
        }
      }

      // Filter out dummy unassigned stock entries for products assigned to specific stores
      const cleanedStockRecords = allStockRecords.filter((s) => {
        const p = prodMap.get(String(s.productId));
        if (p && p.storeId && p.storeId !== 'ALL' && p.storeId !== 'all') {
          const pStoreLower = String(p.storeId).toLowerCase();
          const isMatch = (
            p.storeId === s.storeId ||
            (s.storeId === 'store001' && pStoreLower.includes('kootanad')) ||
            (s.storeId === 'store002' && pStoreLower.includes('kecheri')) ||
            (s.storeId === 'store003' && pStoreLower.includes('mattom')) ||
            (s.storeId === 'store004' && pStoreLower.includes('pattambi'))
          );
          if (!isMatch) return false;
        }
        return true;
      });

      let stockRecords = cleanedStockRecords;
      if (storeId && storeId !== 'ALL' && storeId !== 'all') {
        stockRecords = cleanedStockRecords.filter((s) => s.storeId === storeId);
      }

      const enriched = stockRecords.map((s) => {
        const p = prodMap.get(String(s.productId)) || (s.productName ? prodMap.get(s.productName.toLowerCase().trim()) : null);
        const op = offerMap.get(String(s.productId)) || (s.productName ? offerMap.get(s.productName.toLowerCase().trim()) : null);

        const name = p ? p.name : op ? op.name : (s.productName || s.productId);
        const cat = p ? p.category : op ? 'accessory' : (s.productId.includes('acc') ? 'accessory' : 'iphone-used');

        const pImg = p?.images && p.images.length > 0 ? p.images[0] : null;
        const image = pImg || op?.image || s.productImage || '/images/placeholder-iphone.svg';

        const price = p ? p.price : op ? op.price : 0;
        const storage = p ? p.storage : (cat === 'accessory' ? 'N/A' : '128GB');
        const calcStatus = getStockStatus(s.stock);

        return {
          id: s.id,
          productId: s.productId,
          storeId: s.storeId,
          stock: s.stock,
          itemType: s.itemType,
          status: calcStatus,
          productName: name,
          productCategory: cat,
          productImage: image,
          productPrice: price,
          productStorage: storage,
          updatedAt: s.updatedAt,
          createdAt: s.createdAt,
        };
      });

      let filtered = enriched;
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (item) => item.productName.toLowerCase().includes(q) || item.productId.toLowerCase().includes(q)
        );
      }
      if (category && category !== 'ALL') {
        filtered = filtered.filter((item) => item.productCategory === category);
      }
      if (status && status !== 'ALL') {
        filtered = filtered.filter((item) => item.status === status);
      }
      return res.json(filtered);
    }
  } catch (err) {
    console.warn('MongoDB error fetching stock records, using in-memory stock list:', err.message);
  }

  // Fallback using inMemoryStocks
  let filtered = inMemoryStocks.map((s) => {
    return {
      id: s.id,
      productId: s.productId,
      storeId: s.storeId,
      stock: s.stock,
      itemType: s.itemType,
      status: getStockStatus(s.stock),
      productName: s.productName || s.productId.replace(/_/g, ' ').toUpperCase(),
      productCategory: s.productCategory || (s.productId.includes('acc') ? 'accessory' : 'iphone-new'),
      productImage: s.productImage || '/images/placeholder-iphone.svg',
      productPrice: s.productPrice || 49900,
      productStorage: s.productStorage || '128GB',
      updatedAt: s.updatedAt,
      createdAt: s.createdAt,
    };
  });

  if (storeId && storeId !== 'ALL' && storeId !== 'all') {
    filtered = filtered.filter((item) => item.storeId === storeId);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (item) => item.productName.toLowerCase().includes(q) || item.productId.toLowerCase().includes(q)
    );
  }
  if (status && status !== 'ALL') {
    filtered = filtered.filter((item) => item.status === status);
  }

  return res.json(filtered);
});

// GET /api/stock/:productId/:storeId - Fetch specific stock
router.get('/:productId/:storeId', async (req, res) => {
  const { productId, storeId } = req.params;

  try {
    if (isDbConnected()) {
      let record = await ProductStock.findOne({ productId, storeId });
      if (record) return res.json(record);
    }
  } catch (err) {
    console.warn('MongoDB error fetching product stock, checking memory:', err.message);
  }

  let found = inMemoryStocks.find((s) => s.productId === productId && s.storeId === storeId);
  if (!found) {
    found = {
      id: `stock_${productId}_${storeId}`,
      productId,
      storeId,
      stock: 10,
      itemType: 'product',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    inMemoryStocks.push(found);
  }

  return res.json(found);
});

// PATCH /api/stock - Update stock & record audit history (Admin Only)
router.patch('/', protect, adminOnly, async (req, res) => {
  const { productId, storeId, newStock, reason, notes, updatedBy } = req.body;

  if (!productId || !storeId) {
    return res.status(400).json({ message: 'productId and storeId are required' });
  }

  const stockNum = Number(newStock);
  if (isNaN(stockNum) || stockNum < 0) {
    return res.status(400).json({ message: 'Stock value must be a non-negative number (>= 0)' });
  }

  const validReasons = ['Sold', 'New Stock Added', 'Damaged', 'Returned', 'Stock Correction', 'Other'];
  const chosenReason = validReasons.includes(reason) ? reason : 'Stock Correction';

  // In-Memory Stock Update
  let memIndex = inMemoryStocks.findIndex((s) => s.productId === productId && s.storeId === storeId);
  const previousStock = memIndex !== -1 ? inMemoryStocks[memIndex].stock : 0;
  const changeAmount = stockNum - previousStock;

  const updatedStockObj = {
    id: `stock_${productId}_${storeId}`,
    productId,
    storeId,
    stock: stockNum,
    itemType: productId.includes('off') ? 'offerProduct' : 'product',
    updatedAt: new Date().toISOString(),
  };

  if (memIndex !== -1) {
    inMemoryStocks[memIndex] = { ...inMemoryStocks[memIndex], ...updatedStockObj };
  } else {
    inMemoryStocks.push(updatedStockObj);
  }

  const historyItem = {
    id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    productId,
    storeId,
    previousStock,
    newStock: stockNum,
    changeAmount,
    reason: chosenReason,
    notes: notes || '',
    updatedBy: updatedBy || 'M Store Manager',
    createdAt: new Date().toISOString(),
  };
  inMemoryHistory.unshift(historyItem);

  try {
    if (isDbConnected()) {
      const updatedRecord = await ProductStock.findOneAndUpdate(
        { productId, storeId },
        {
          $set: { stock: stockNum },
          $setOnInsert: { id: `stock_${productId}_${storeId}` },
        },
        { new: true, upsert: true }
      );

      const dbHistory = await StockHistory.create({
        id: historyItem.id,
        productId,
        storeId,
        previousStock,
        newStock: stockNum,
        changeAmount,
        reason: chosenReason,
        notes: notes || '',
        updatedBy: updatedBy || 'M Store Manager',
      });

      return res.json({
        stock: updatedRecord,
        history: dbHistory,
        message: 'Stock updated successfully',
      });
    }
  } catch (err) {
    console.warn('MongoDB error updating stock, saved in memory:', err.message);
  }

  return res.json({
    stock: updatedStockObj,
    history: historyItem,
    message: 'Stock updated successfully',
  });
});

// GET /api/stock/history/:productId/:storeId - Fetch audit log
router.get('/history/:productId/:storeId', async (req, res) => {
  const { productId, storeId } = req.params;

  try {
    if (isDbConnected()) {
      const history = await StockHistory.find({ productId, storeId }).sort({ createdAt: -1 }).limit(20);
      if (history && history.length > 0) return res.json(history);
    }
  } catch (err) {
    console.warn('MongoDB error fetching stock history, checking memory:', err.message);
  }

  const filteredHistory = inMemoryHistory
    .filter((h) => h.productId === productId && h.storeId === storeId)
    .slice(0, 20);

  return res.json(filteredHistory);
});

module.exports = router;
