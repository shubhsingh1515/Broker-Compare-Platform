const Testimonial = require('../models/Testimonial');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

exports.getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
    return successResponse(res, 200, 'Testimonials retrieved', testimonials);
  } catch (error) {
    next(error);
  }
};

exports.createTestimonial = async (req, res, next) => {
  try {
    const data = req.body;
    if (req.file) {
      data.avatar = `/uploads/${req.file.filename}`;
    }
    const testimonial = await Testimonial.create(data);
    return successResponse(res, 201, 'Testimonial created', testimonial);
  } catch (error) {
    next(error);
  }
};

exports.updateTestimonial = async (req, res, next) => {
  try {
    const data = req.body;
    if (req.file) {
      data.avatar = `/uploads/${req.file.filename}`;
    }
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!testimonial) return errorResponse(res, 404, 'Testimonial not found');
    return successResponse(res, 200, 'Testimonial updated', testimonial);
  } catch (error) {
    next(error);
  }
};

exports.deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return errorResponse(res, 404, 'Testimonial not found');
    return successResponse(res, 200, 'Testimonial deleted');
  } catch (error) {
    next(error);
  }
};
