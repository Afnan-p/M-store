const mongoose = require('mongoose');

const offerProductSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    storeId: {
      type: String,
      default: 'ALL', // 'ALL' or specific storeId like 'store001'
    },
    stock: {
      type: Number,
      default: 100,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

offerProductSchema.index({ storeId: 1, status: 1 });

const OfferProduct = mongoose.models.OfferProduct || mongoose.model('OfferProduct', offerProductSchema);

module.exports = OfferProduct;
