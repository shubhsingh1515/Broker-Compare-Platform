const PopularComparison = require('../models/PopularComparison');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

exports.getPopularComparisons = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category) query.category = category;

    const comparisons = await PopularComparison.find(query)
      .populate('brokers', 'name slug logo overallRating trustScore brokerType minDeposit country')
      .sort({ order: 1, createdAt: -1 });

    return successResponse(res, 200, 'Popular comparisons retrieved', comparisons);
  } catch (error) {
    next(error);
  }
};

exports.createPopularComparison = async (req, res, next) => {
  try {
    const { title, slug, brokers, description, category, isFeatured, order } = req.body;
    const compSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const comparison = await PopularComparison.create({
      title,
      slug: compSlug,
      brokers,
      description,
      category,
      isFeatured,
      order
    });

    return successResponse(res, 201, 'Popular comparison created', comparison);
  } catch (error) {
    next(error);
  }
};

exports.updatePopularComparison = async (req, res, next) => {
  try {
    const comparison = await PopularComparison.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!comparison) return errorResponse(res, 404, 'Popular comparison not found');
    return successResponse(res, 200, 'Popular comparison updated', comparison);
  } catch (error) {
    next(error);
  }
};

exports.deletePopularComparison = async (req, res, next) => {
  try {
    const comparison = await PopularComparison.findByIdAndDelete(req.params.id);
    if (!comparison) return errorResponse(res, 404, 'Popular comparison not found');
    return successResponse(res, 200, 'Popular comparison deleted');
  } catch (error) {
    next(error);
  }
};
