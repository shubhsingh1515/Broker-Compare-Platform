const Category = require('../models/Category');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

exports.getCategories = async (req, res, next) => {
  try {
    const { type } = req.query;
    const query = { isActive: true };
    if (type) query.type = { $in: [type, 'both'] };

    const categories = await Category.find(query).sort({ name: 1 });
    return successResponse(res, 200, 'Categories retrieved', categories);
  } catch (error) {
    next(error);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return errorResponse(res, 404, 'Category not found');
    return successResponse(res, 200, 'Category details', category);
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, slug, type, description, icon } = req.body;
    const categorySlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const category = await Category.create({ name, slug: categorySlug, type, description, icon });
    return successResponse(res, 201, 'Category created', category);
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return errorResponse(res, 404, 'Category not found');
    return successResponse(res, 200, 'Category updated', category);
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return errorResponse(res, 404, 'Category not found');
    return successResponse(res, 200, 'Category deleted');
  } catch (error) {
    next(error);
  }
};
