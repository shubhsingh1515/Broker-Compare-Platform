const ComparisonFeature = require('../models/ComparisonFeature');
const ComparisonValue = require('../models/ComparisonValue');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

// GET /api/features
exports.getFeatures = async (req, res, next) => {
  try {
    const features = await ComparisonFeature.find().sort({ sortOrder: 1, createdAt: 1 });
    return successResponse(res, 200, 'Features retrieved', features);
  } catch (error) {
    next(error);
  }
};

// GET /api/features/:id
exports.getFeatureById = async (req, res, next) => {
  try {
    const feature = await ComparisonFeature.findById(req.params.id);
    if (!feature) return errorResponse(res, 404, 'Feature not found');
    return successResponse(res, 200, 'Feature details', feature);
  } catch (error) {
    next(error);
  }
};

// POST /api/features (Admin Only)
exports.createFeature = async (req, res, next) => {
  try {
    const { key, label, type, category, isHighlighted, sortOrder } = req.body;
    const featureKey = key || label.toLowerCase().replace(/[^a-z0-9]+/g, '_');

    const feature = await ComparisonFeature.create({
      key: featureKey,
      label,
      type,
      category,
      isHighlighted,
      sortOrder
    });

    return successResponse(res, 201, 'Comparison feature created successfully', feature);
  } catch (error) {
    next(error);
  }
};

// PUT /api/features/:id (Admin Only)
exports.updateFeature = async (req, res, next) => {
  try {
    const feature = await ComparisonFeature.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!feature) return errorResponse(res, 404, 'Feature not found');
    return successResponse(res, 200, 'Feature updated successfully', feature);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/features/:id (Admin Only)
exports.deleteFeature = async (req, res, next) => {
  try {
    const feature = await ComparisonFeature.findByIdAndDelete(req.params.id);
    if (!feature) return errorResponse(res, 404, 'Feature not found');

    // Remove associated values
    await ComparisonValue.deleteMany({ featureId: req.params.id });
    return successResponse(res, 200, 'Feature deleted successfully');
  } catch (error) {
    next(error);
  }
};

// GET /api/features/values/:brokerId
exports.getBrokerFeatureValues = async (req, res, next) => {
  try {
    const { brokerId } = req.params;
    const values = await ComparisonValue.find({ brokerId }).populate('featureId');
    return successResponse(res, 200, 'Broker feature values retrieved', values);
  } catch (error) {
    next(error);
  }
};

// POST /api/features/values (Admin Only - batch save or single save)
exports.saveBrokerFeatureValues = async (req, res, next) => {
  try {
    const { brokerId, values } = req.body; // values: [{ featureId, value }]

    if (!brokerId || !Array.isArray(values)) {
      return errorResponse(res, 400, 'brokerId and values array are required');
    }

    const savedResults = [];
    for (const item of values) {
      const updated = await ComparisonValue.findOneAndUpdate(
        { brokerId, featureId: item.featureId },
        { value: item.value },
        { upsert: true, new: true }
      );
      savedResults.push(updated);
    }

    return successResponse(res, 200, 'Broker feature values updated successfully', savedResults);
  } catch (error) {
    next(error);
  }
};
