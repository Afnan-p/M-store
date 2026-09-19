const mongoose = require('mongoose');

const productStockSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    productId: {
      type: String,
      required: true,
    },
    storeId: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    itemType: {
      type: String,
      enum: ['product', 'offerProduct'],
      default: 'product',
    },
  },
  {
    timestamps: true,
  }
);

productStockSchema.index({ productId: 1, storeId: 1 }, { unique: true });
productStockSchema.index({ storeId: 1 });
productStockSchema.index({ stock: 1 });

const ProductStock = mongoose.models.ProductStock || mongoose.model('ProductStock', productStockSchema);

module.exports = ProductStock;
