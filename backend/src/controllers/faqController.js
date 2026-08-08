const FAQ = require('../models/FAQ');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

exports.getFAQs = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;

    const faqs = await FAQ.find(query).sort({ order: 1, createdAt: -1 });
    return successResponse(res, 200, 'FAQs retrieved', faqs);
  } catch (error) {
    next(error);
  }
};

exports.createFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.create(req.body);
    return successResponse(res, 201, 'FAQ created', faq);
  } catch (error) {
    next(error);
  }
};

exports.updateFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!faq) return errorResponse(res, 404, 'FAQ not found');
    return successResponse(res, 200, 'FAQ updated', faq);
  } catch (error) {
    next(error);
  }
};

exports.deleteFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) return errorResponse(res, 404, 'FAQ not found');
    return successResponse(res, 200, 'FAQ deleted');
  } catch (error) {
    next(error);
  }
};
