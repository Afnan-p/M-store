const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const ProductStock = require('../models/ProductStock');
const { protect, adminOnly } = require('../middleware/auth');

const INITIAL_PRODUCTS = [];

let inMemoryProducts = [];

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// GET /api/products - Fetch products with optional filtering by storeId or category
router.get('/', async (req, res) => {
  const { category, storeId, available } = req.query;

  try {
    if (isDbConnected()) {
      const filter = {};
      if (category) filter.category = category;
      if (storeId && storeId !== 'ALL' && storeId !== 'all') {
        filter.$or = [{ storeId: storeId }, { storeId: 'ALL' }, { storeId: 'all' }];
      }
      if (available !== undefined) {
        filter.available = available === 'true';
      }

      const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
      const formatted = products.map((p) => ({
        ...p,
        id: p.id || String(p._id),
      }));

      inMemoryProducts = formatted;
      return res.json(formatted);
    }
  } catch (err) {
    console.warn('MongoDB error fetching products:', err.message);
  }

  return res.json(inMemoryProducts);
});

// GET /api/products/og/:id - Serve dynamic SSR OpenGraph HTML for social link preview
router.get('/og/:id', async (req, res) => {
  const target = req.params.id;
  let product = null;

  try {
    if (isDbConnected()) {
      product = await Product.findOne({
        $or: [{ id: target }, { slug: target }],
      });
      if (!product) {
        const allDocs = await Product.find({}).lean();
        product = allDocs.find((p) => p.id === target || p.slug === target || slugify(p.name) === target);
      }
    }
  } catch (err) {
    console.warn('MongoDB error fetching product for OG:', err.message);
  }

  if (!product) {
    product = inMemoryProducts.find((p) => p.id === target || p.slug === target || slugify(p.name) === target);
  }

  const clientUrl = process.env.CLIENT_URL || 'https://m-store-two.vercel.app';
  const targetSlug = product ? (product.slug || slugify(product.name) || product.id) : target;
  const redirectUrl = `${clientUrl.replace(/\/+$/, '')}/product/${targetSlug}`;

  if (!product) {
    return res.redirect(redirectUrl);
  }

  const title = `${product.name} | M STORE Kerala`;
  const description = product.description
    ? product.description.slice(0, 160)
    : `Buy ${product.name} at M STORE. Quality checked with best value warranty and fast Kerala delivery.`;
  const imageUrl = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : `${clientUrl}/favicon.png`;

  res.setHeader('Content-Type', 'text/html');
  return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta property="og:title" content="${product.name}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="product">
  <meta property="og:url" content="${redirectUrl}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:secure_url" content="${imageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${product.name}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  <meta http-equiv="refresh" content="0;url=${redirectUrl}">
</head>
<body>
  <p>Redirecting to <a href="${redirectUrl}">${title}</a>...</p>
  <script>window.location.href = "${redirectUrl}";</script>
</body>
</html>`);
});

// GET /api/products/:id - Fetch single product by ID or Slug
router.get('/:id', async (req, res) => {
  const target = req.params.id;
  try {
    if (isDbConnected()) {
      const product = await Product.findOne({
        $or: [{ id: target }, { slug: target }],
      });
      if (product) return res.json(product);

      // Search memory/all products if slug match
      const allDocs = await Product.find({}).lean();
      const matchDoc = allDocs.find((p) => p.id === target || p.slug === target || slugify(p.name) === target);
      if (matchDoc) return res.json(matchDoc);
    }
  } catch (err) {
    console.warn('MongoDB error fetching product by ID/slug, checking memory:', err.message);
  }

  const found = inMemoryProducts.find((p) => p.id === target || p.slug === target || slugify(p.name) === target);
  if (found) return res.json(found);

  return res.status(404).json({ message: 'Product not found' });
});

// POST /api/products - Create new product (Admin Only)
router.post('/', protect, adminOnly, async (req, res) => {
  const newProduct = {
    ...req.body,
    slug: req.body.slug || slugify(req.body.name || ''),
    storeId: req.body.storeId || 'ALL',
    id: req.body.id || 'p_' + Date.now(),
    createdAt: req.body.createdAt || new Date().toISOString(),
  };

  inMemoryProducts.unshift(newProduct);

  const initialQty = req.body.initialStock !== undefined ? Number(req.body.initialStock) : 10;
  const STORES = ['store001', 'store002', 'store003', 'store004'];

  try {
    if (isDbConnected()) {
      const created = await Product.create(newProduct);

      const isSpecificStore = newProduct.storeId && newProduct.storeId !== 'ALL' && newProduct.storeId !== 'all';

      // Auto-create ProductStock records in MongoDB ONLY for assigned store(s)
      for (const storeId of STORES) {
        const pStoreLower = String(newProduct.storeId).toLowerCase();
        const isMatch = !isSpecificStore || (
          newProduct.storeId === storeId ||
          (storeId === 'store001' && pStoreLower.includes('kootanad')) ||
          (storeId === 'store002' && pStoreLower.includes('kecheri')) ||
          (storeId === 'store003' && pStoreLower.includes('mattom')) ||
          (storeId === 'store004' && pStoreLower.includes('pattambi'))
        );

        if (isMatch) {
          await ProductStock.findOneAndUpdate(
            { productId: newProduct.id, storeId },
            {
              $set: { stock: initialQty },
              $setOnInsert: {
                id: `stock_${newProduct.id}_${storeId}`,
                productId: newProduct.id,
                storeId,
                itemType: 'product',
              },
            },
            { upsert: true, new: true }
          );
        }
      }

      return res.status(201).json(created);
    }
  } catch (err) {
    console.warn('MongoDB error creating product, saved in memory:', err.message);
  }

  return res.status(201).json(newProduct);
});

// PUT /api/products/:id - Update product (Admin Only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  const index = inMemoryProducts.findIndex((p) => p.id === req.params.id);
  if (index !== -1) {
    inMemoryProducts[index] = { ...inMemoryProducts[index], ...req.body };
  } else {
    inMemoryProducts.push({ ...req.body, id: req.params.id });
  }

  try {
    if (isDbConnected()) {
      const updated = await Product.findOneAndUpdate({ id: req.params.id }, req.body, {
        new: true,
        upsert: true,
      });
      return res.json(updated);
    }
  } catch (err) {
    console.warn('MongoDB error updating product, saved in memory:', err.message);
  }

  const result = index !== -1 ? inMemoryProducts[index] : req.body;
  return res.json(result);
});

// DELETE /api/products/:id - Delete product (Admin Only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  const targetId = req.params.id;

  if (!targetId || targetId === 'undefined') {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  inMemoryProducts = inMemoryProducts.filter(
    (p) => p.id !== targetId && String(p._id) !== targetId && p.slug !== targetId
  );

  try {
    if (isDbConnected()) {
      const isObjectId = mongoose.isValidObjectId(targetId);
      
      const query = {
        $or: [
          { id: targetId },
          { slug: targetId },
          ...(isObjectId ? [{ _id: targetId }] : []),
        ],
      };

      const existingDoc = await Product.findOne(query);

      let deletedCount = 0;
      if (existingDoc) {
        const docId = existingDoc.id;
        const docMongoId = String(existingDoc._id);

        const deleteRes = await Product.deleteMany({
          $or: [
            { _id: existingDoc._id },
            { id: targetId },
            ...(docId ? [{ id: docId }] : []),
          ],
        });
        deletedCount = deleteRes.deletedCount;

        await ProductStock.deleteMany({
          $or: [
            { productId: targetId },
            { productId: docMongoId },
            ...(docId ? [{ productId: docId }] : []),
          ],
        });
      } else {
        const deleteRes = await Product.deleteMany(query);
        deletedCount = deleteRes.deletedCount;
        await ProductStock.deleteMany({ productId: targetId });
      }

      return res.json({ message: 'Product deleted successfully', deletedCount });
    }
  } catch (err) {
    console.warn('MongoDB error deleting product:', err.message);
  }

  return res.json({ message: 'Product deleted successfully', deletedId: targetId });
});

module.exports = router;
