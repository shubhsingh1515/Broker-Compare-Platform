const mongoose = require('mongoose');

const comparisonValueSchema = new mongoose.Schema(
  {
    brokerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker', required: true, index: true },
    featureId: { type: mongoose.Schema.Types.ObjectId, ref: 'ComparisonFeature', required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
);

comparisonValueSchema.index({ brokerId: 1, featureId: 1 }, { unique: true });

module.exports = mongoose.model('ComparisonValue', comparisonValueSchema);
