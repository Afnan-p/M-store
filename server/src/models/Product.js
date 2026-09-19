const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
      enum: ['iphone-new', 'iphone-used', 'accessory'],
    },
    subCategory: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    color: {
      type: String,
      default: '',
    },
    storage: {
      type: String,
      default: 'N/A',
    },
    condition: {
      type: String,
      default: 'Brand New',
    },
    batteryHealth: {
      type: Number,
      default: null,
    },
    storeId: {
      type: String,
      required: true,
      default: 'store001',
    },
    images: [
      {
        type: String,
      },
    ],
    available: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    replacementStatus: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    isOffer: {
      type: Boolean,
      default: false,
    },
    offerBadge: {
      type: String,
      default: '',
    },
    offer: {
      enabled: { type: Boolean, default: false },
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      status: { type: String, enum: ['active', 'disabled'], default: 'active' },
      items: [
        {
          offerProductId: { type: String, required: true },
          quantity: { type: Number, default: 1, min: 1 },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ storeId: 1, category: 1 });
productSchema.index({ isOffer: 1 });
productSchema.index({ available: 1 });
productSchema.index({ slug: 1 });

module.exports = mongoose.model('Product', productSchema);
