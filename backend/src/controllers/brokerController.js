const Broker = require('../models/Broker');
const Category = require('../models/Category');
const ComparisonValue = require('../models/ComparisonValue');
const ComparisonFeature = require('../models/ComparisonFeature');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

// GET /api/brokers
exports.getBrokers = async (req, res, next) => {
  try {
    const {
      type,
      region,
      category,
      country,
      regulation,
      tag,
      search,
      featured,
      popular,
      minDepositMax,
      mt4,
      mt5,
      tradingView,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = { isActive: true };

    if (region && region !== 'all') {
      if (region === 'indian') {
        query.$or = [{ region: 'indian' }, { country: new RegExp('India', 'i') }];
      } else if (region === 'foreign') {
        query.$or = [{ region: 'foreign' }, { country: { $ne: 'India' } }];
      } else {
        query.region = region;
      }
    }

    if (type && type !== 'all') {
      query.brokerType = { $in: [type, 'both'] };
    }

    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.categoryId = categoryDoc._id;
      }
    }

    if (country) {
      query.country = new RegExp(country, 'i');
    }

    if (regulation) {
      query.regulation = { $in: [new RegExp(regulation, 'i')] };
    }

    if (tag) {
      query.tags = tag;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (popular === 'true') {
      query.isPopular = true;
    }

    if (minDepositMax) {
      query.minDeposit = { $lte: Number(minDepositMax) };
    }

    if (mt4 === 'true') query['tradingPlatforms.mt4'] = true;
    if (mt5 === 'true') query['tradingPlatforms.mt5'] = true;
    if (tradingView === 'true') query['tradingPlatforms.tradingView'] = true;

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { country: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') },
        { bestFor: new RegExp(search, 'i') }
      ];
    }

    let sortOptions = { overallRating: -1 };
    if (sort === 'rating_desc') sortOptions = { overallRating: -1 };
    if (sort === 'rating_asc') sortOptions = { overallRating: 1 };
    if (sort === 'deposit_asc') sortOptions = { minDeposit: 1 };
    if (sort === 'deposit_desc') sortOptions = { minDeposit: -1 };
    if (sort === 'trust_desc') sortOptions = { trustScore: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Broker.countDocuments(query);
    const brokers = await Broker.find(query)
      .populate('categoryId', 'name slug type icon')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    return successResponse(res, 200, 'Brokers retrieved successfully', brokers, {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/brokers/search
exports.searchBrokers = async (req, res, next) => {
  try {
    const { q, region } = req.query;
    if (!q || q.trim().length === 0) {
      return successResponse(res, 200, 'Search results', []);
    }

    const regex = new RegExp(q, 'i');
    const searchQuery = {
      isActive: true,
      $or: [
        { name: regex },
        { tags: regex },
        { country: regex },
        { regulation: regex },
        { brokerType: regex }
      ]
    };

    if (region && region !== 'all') {
      if (region === 'indian') {
        searchQuery.region = 'indian';
      } else if (region === 'foreign') {
        searchQuery.region = 'foreign';
      }
    }

    const brokers = await Broker.find(searchQuery)
      .select('name slug logo brokerType region overallRating country trustScore tags')
      .limit(8);

    return successResponse(res, 200, 'Search suggestions', brokers);
  } catch (error) {
    next(error);
  }
};

// GET /api/brokers/:slugOrId
exports.getBrokerBySlugOrId = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    let broker;

    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      broker = await Broker.findById(slugOrId).populate('categoryId');
    } else {
      broker = await Broker.findOne({ slug: slugOrId }).populate('categoryId');
    }

    if (!broker) {
      return errorResponse(res, 404, 'Broker not found');
    }

    // Fetch dynamic custom comparison values
    const customValues = await ComparisonValue.find({ brokerId: broker._id }).populate('featureId');

    const formattedCustomValues = customValues.map(item => ({
      featureId: item.featureId?._id,
      key: item.featureId?.key,
      label: item.featureId?.label,
      type: item.featureId?.type,
      category: item.featureId?.category,
      value: item.value
    }));

    return successResponse(res, 200, 'Broker details retrieved', {
      broker,
      customFeatures: formattedCustomValues
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/brokers (Admin Only)
exports.createBroker = async (req, res, next) => {
  try {
    const brokerData = req.body;

    if (req.file) {
      brokerData.logo = `/uploads/${req.file.filename}`;
    }

    if (!brokerData.slug && brokerData.name) {
      brokerData.slug = brokerData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const newBroker = await Broker.create(brokerData);
    return successResponse(res, 201, 'Broker created successfully', newBroker);
  } catch (error) {
    next(error);
  }
};

// PUT /api/brokers/:id (Admin Only)
exports.updateBroker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.file) {
      updateData.logo = `/uploads/${req.file.filename}`;
    }

    const updatedBroker = await Broker.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedBroker) {
      return errorResponse(res, 404, 'Broker not found');
    }

    return successResponse(res, 200, 'Broker updated successfully', updatedBroker);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/brokers/:id (Admin Only)
exports.deleteBroker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const broker = await Broker.findByIdAndDelete(id);

    if (!broker) {
      return errorResponse(res, 404, 'Broker not found');
    }

    // Also delete associated custom comparison values
    await ComparisonValue.deleteMany({ brokerId: id });

    return successResponse(res, 200, 'Broker deleted successfully');
  } catch (error) {
    next(error);
  }
};
