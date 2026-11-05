const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']); } catch(_) {}
dotenv.config({ path: __dirname + '/../../.env' });

const Product = require('../models/Product');
const ProductStock = require('../models/ProductStock');
const OfferProduct = require('../models/OfferProduct');

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

async function sync() {
  await mongoose.connect(process.env.MONGO_URI);

  // 1. Seed offer products if empty
  const currentOffers = await OfferProduct.countDocuments();
  console.log('Current offer products in DB:', currentOffers);
  if (currentOffers === 0) {
    await OfferProduct.insertMany(INITIAL_OFFER_PRODUCTS);
    console.log('Seeded 5 offer products into MongoDB Atlas!');
  }

  // 2. Identify products in DB
  const prods = await Product.find({}).lean();
  const offerProds = await OfferProduct.find({}).lean();

  const validIds = new Set([
    ...prods.map(p => String(p.id)),
    ...prods.map(p => String(p._id)),
    ...offerProds.map(op => String(op.id)),
    ...offerProds.map(op => String(op._id))
  ]);

  console.log('Valid product/offer IDs count:', validIds.size);

  // 3. Purge orphaned stocks
  const deleteResult = await ProductStock.deleteMany({
    productId: { $nin: Array.from(validIds) }
  });
  console.log('Deleted orphaned stock records:', deleteResult.deletedCount);

  const remainingStocks = await ProductStock.find({}).lean();
  console.log('Remaining stock records in DB:', remainingStocks.length);
  console.log('Remaining stocks:', remainingStocks.map(s => ({ pid: s.productId, stock: s.stock })));

  process.exit(0);
}
sync().catch(e => { console.error(e); process.exit(1); });
