const mongoose = require('mongoose');

const stockHistorySchema = new mongoose.Schema(
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
    previousStock: {
      type: Number,
      required: true,
    },
    newStock: {
      type: Number,
      required: true,
    },
    changeAmount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      enum: ['Sold', 'New Stock Added', 'Damaged', 'Returned', 'Stock Correction', 'Other'],
    },
    notes: {
      type: String,
      default: '',
    },
    updatedBy: {
      type: String,
      default: 'M Store Manager',
    },
  },
  {
    timestamps: true,
  }
);

stockHistorySchema.index({ productId: 1, storeId: 1, createdAt: -1 });

const StockHistory = mongoose.models.StockHistory || mongoose.model('StockHistory', stockHistorySchema);

module.exports = StockHistory;
