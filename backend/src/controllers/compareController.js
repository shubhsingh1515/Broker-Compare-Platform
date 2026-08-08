const Broker = require('../models/Broker');
const ComparisonFeature = require('../models/ComparisonFeature');
const ComparisonValue = require('../models/ComparisonValue');
const calculateHighlights = require('../helpers/calculateHighlights');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

exports.compareBrokers = async (req, res, next) => {
  try {
    const { brokerIds, slugs } = req.body;

    let query = {};
    if (brokerIds && Array.isArray(brokerIds) && brokerIds.length > 0) {
      query._id = { $in: brokerIds };
    } else if (slugs && Array.isArray(slugs) && slugs.length > 0) {
      query.slug = { $in: slugs };
    } else {
      return errorResponse(res, 400, 'Please provide an array of brokerIds or slugs to compare');
    }

    const brokers = await Broker.find(query).populate('categoryId');

    if (!brokers || brokers.length === 0) {
      return errorResponse(res, 404, 'No brokers found for comparison');
    }

    // Fetch all custom comparison feature definitions
    const customFeatures = await ComparisonFeature.find().sort({ sortOrder: 1, createdAt: 1 });

    // Fetch all custom feature values for these brokers
    const brokerObjectIds = brokers.map(b => b._id);
    const customValues = await ComparisonValue.find({ brokerId: { $in: brokerObjectIds } }).populate('featureId');

    // Group custom feature values by broker ID
    const customValuesMap = {};
    customValues.forEach(item => {
      const bId = item.brokerId.toString();
      if (!customValuesMap[bId]) customValuesMap[bId] = {};
      if (item.featureId) {
        customValuesMap[bId][item.featureId.key] = {
          label: item.featureId.label,
          type: item.featureId.type,
          value: item.value
        };
      }
    });

    // Attach custom values to each broker object
    const brokersWithCustomFeatures = brokers.map(b => {
      const bObj = b.toObject();
      bObj.customFeatures = customValuesMap[b._id.toString()] || {};
      return bObj;
    });

    // Calculate Dynamic Highlights
    const highlights = calculateHighlights(brokersWithCustomFeatures);

    return successResponse(res, 200, 'Comparison data generated successfully', {
      brokers: brokersWithCustomFeatures,
      dynamicFeatures: customFeatures,
      highlights
    });
  } catch (error) {
    next(error);
  }
};
