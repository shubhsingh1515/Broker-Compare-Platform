const Banner = require('../models/Banner');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

exports.getBanners = async (req, res, next) => {
  try {
    const { type } = req.query;
    const query = { isActive: true };
    if (type) query.type = type;

    const banners = await Banner.find(query).sort({ createdAt: -1 });
    return successResponse(res, 200, 'Banners retrieved', banners);
  } catch (error) {
    next(error);
  }
};

exports.createBanner = async (req, res, next) => {
  try {
    const bannerData = req.body;
    if (req.file) {
      bannerData.image = `/uploads/${req.file.filename}`;
    }
    const banner = await Banner.create(bannerData);
    return successResponse(res, 201, 'Banner created', banner);
  } catch (error) {
    next(error);
  }
};

exports.updateBanner = async (req, res, next) => {
  try {
    const updateData = req.body;
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    const banner = await Banner.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!banner) return errorResponse(res, 404, 'Banner not found');
    return successResponse(res, 200, 'Banner updated', banner);
  } catch (error) {
    next(error);
  }
};

exports.deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return errorResponse(res, 404, 'Banner not found');
    return successResponse(res, 200, 'Banner deleted');
  } catch (error) {
    next(error);
  }
};
