const mongoose = require('mongoose');

const comparisonFeatureSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, lowercase: true },
    label: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['text', 'boolean', 'number', 'rating', 'currency', 'percentage'],
      default: 'text'
    },
    category: {
      type: String,
      enum: ['basic', 'fees', 'platform', 'features', 'support', 'custom'],
      default: 'custom'
    },
    isHighlighted: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ComparisonFeature', comparisonFeatureSchema);
