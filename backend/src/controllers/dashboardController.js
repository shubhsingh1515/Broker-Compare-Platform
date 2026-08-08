const Broker = require('../models/Broker');
const Blog = require('../models/Blog');
const Contact = require('../models/Contact');
const Newsletter = require('../models/Newsletter');
const PopularComparison = require('../models/PopularComparison');
const { successResponse } = require('../helpers/responseHelper');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalBrokers = await Broker.countDocuments();
    const activeBrokers = await Broker.countDocuments({ isActive: true });
    const stockBrokers = await Broker.countDocuments({ brokerType: { $in: ['stock', 'both'] } });
    const forexBrokers = await Broker.countDocuments({ brokerType: { $in: ['forex', 'both'] } });
    const totalBlogs = await Blog.countDocuments();
    const unreadContacts = await Contact.countDocuments({ status: 'unread' });
    const totalSubscribers = await Newsletter.countDocuments({ isSubscribed: true });
    const popularComparisonsCount = await PopularComparison.countDocuments();

    const latestBrokers = await Broker.find()
      .select('name logo brokerType overallRating trustScore createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const latestContacts = await Contact.find()
      .select('name email subject status createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const topBrokers = await Broker.find({ isActive: true })
      .select('name logo overallRating trustScore country')
      .sort({ overallRating: -1 })
      .limit(5);

    return successResponse(res, 200, 'Dashboard statistics', {
      stats: {
        totalBrokers,
        activeBrokers,
        stockBrokers,
        forexBrokers,
        totalBlogs,
        unreadContacts,
        totalSubscribers,
        popularComparisonsCount
      },
      latestBrokers,
      latestContacts,
      topBrokers
    });
  } catch (error) {
    next(error);
  }
};
