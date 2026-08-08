const Newsletter = require('../models/Newsletter');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

exports.subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return errorResponse(res, 400, 'Email address is required');

    let subscriber = await Newsletter.findOne({ email });
    if (subscriber) {
      if (!subscriber.isSubscribed) {
        subscriber.isSubscribed = true;
        await subscriber.save();
      }
      return successResponse(res, 200, 'You are already subscribed to our newsletter!');
    }

    subscriber = await Newsletter.create({ email });
    return successResponse(res, 201, 'Successfully subscribed to the newsletter!', subscriber);
  } catch (error) {
    next(error);
  }
};

exports.getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Newsletter.find({ isSubscribed: true }).sort({ createdAt: -1 });
    return successResponse(res, 200, 'Subscribers retrieved', subscribers);
  } catch (error) {
    next(error);
  }
};

exports.exportSubscribersCSV = async (req, res, next) => {
  try {
    const subscribers = await Newsletter.find({ isSubscribed: true }).sort({ createdAt: -1 });
    let csv = 'Email,SubscribedAt\n';
    subscribers.forEach(sub => {
      csv += `"${sub.email}","${sub.createdAt.toISOString()}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

exports.deleteSubscriber = async (req, res, next) => {
  try {
    const subscriber = await Newsletter.findByIdAndDelete(req.params.id);
    if (!subscriber) return errorResponse(res, 404, 'Subscriber not found');
    return successResponse(res, 200, 'Subscriber removed');
  } catch (error) {
    next(error);
  }
};
