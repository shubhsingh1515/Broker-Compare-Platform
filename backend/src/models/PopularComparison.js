const mongoose = require('mongoose');

const popularComparisonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // e.g. "Zerodha vs Groww"
    slug: { type: String, required: true, unique: true, lowercase: true },
    brokers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Broker', required: true }],
    description: { type: String },
    category: { type: String, enum: ['stock', 'forex'], default: 'stock' },
    isFeatured: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PopularComparison', popularComparisonSchema);
