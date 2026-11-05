const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']); } catch(_) {}
dotenv.config({ path: __dirname + '/../../.env' });

const Product = require('../models/Product');
const ProductStock = require('../models/ProductStock');

async function clean() {
  await mongoose.connect(process.env.MONGO_URI);
  const products = await Product.find({}).lean();
  const realProductIds = products.map(p => String(p.id));

  // Remove any stock record that is an offer product or not a real product
  const deleteResult = await ProductStock.deleteMany({
    productId: { $nin: realProductIds }
  });
  console.log('Removed non-product stocks from ProductStock:', deleteResult.deletedCount);

  const remaining = await ProductStock.find({}).lean();
  console.log('Remaining real product stocks:', remaining.map(s => ({ pid: s.productId, stock: s.stock })));
  process.exit(0);
}
clean().catch(e => { console.error(e); process.exit(1); });
