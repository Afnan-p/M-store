const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema(
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
      required: true,
    },
    thumbnail: {
      type: String,
      default: '/images/featured-p1-natural.jpg',
    },
    categoryType: {
      type: String,
      enum: ['NEW', 'USED', 'BOTH'],
      default: 'BOTH',
    },
    displayOrder: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Segment', segmentSchema);
