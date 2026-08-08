const Contact = require('../models/Contact');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return errorResponse(res, 400, 'All fields (name, email, subject, message) are required');
    }

    const contact = await Contact.create({ name, email, subject, message });
    return successResponse(res, 201, 'Thank you! Your message has been submitted successfully.', contact);
  } catch (error) {
    next(error);
  }
};

exports.getContacts = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 15 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

    return successResponse(res, 200, 'Contacts retrieved', contacts, {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    next(error);
  }
};

exports.updateContactStatus = async (req, res, next) => {
  try {
    const { status, replyNotes } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, replyNotes },
      { new: true, runValidators: true }
    );
    if (!contact) return errorResponse(res, 404, 'Contact inquiry not found');
    return successResponse(res, 200, 'Contact status updated', contact);
  } catch (error) {
    next(error);
  }
};

exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return errorResponse(res, 404, 'Contact inquiry not found');
    return successResponse(res, 200, 'Contact inquiry deleted');
  } catch (error) {
    next(error);
  }
};
