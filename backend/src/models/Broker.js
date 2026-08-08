const mongoose = require('mongoose');

const brokerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    logo: { type: String, required: true },
    brokerType: { type: String, enum: ['stock', 'forex', 'both'], required: true, index: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
    founded: { type: Number, required: true },
    headOffice: { type: String, required: true },
    country: { type: String, required: true, index: true },
    website: { type: String, required: true },
    regulation: [{ type: String, index: true }], // SEBI, ASIC, FCA, CySEC, FSCA, etc.
    
    // Key Metrics & Deposit
    trustScore: { type: Number, min: 0, max: 100, default: 85, index: true },
    overallRating: { type: Number, min: 0, max: 5, default: 4.5, index: true },
    minDeposit: { type: Number, default: 0, index: true },
    minDepositCurrency: { type: String, default: 'USD' },
    maxLeverage: { type: String, default: '1:500' },
    accountTypes: [{ type: String }],
    
    // Trading Platforms
    tradingPlatforms: {
      mt4: { type: Boolean, default: false },
      mt5: { type: Boolean, default: false },
      tradingView: { type: Boolean, default: false },
      webPlatform: { type: Boolean, default: true },
      mobileApp: { type: Boolean, default: true },
      desktopApp: { type: Boolean, default: true }
    },

    // Trading Products
    products: {
      forex: { type: Boolean, default: false },
      stocks: { type: Boolean, default: false },
      indices: { type: Boolean, default: false },
      crypto: { type: Boolean, default: false },
      etf: { type: Boolean, default: false },
      commodity: { type: Boolean, default: false },
      mutualFunds: { type: Boolean, default: false },
      ipo: { type: Boolean, default: false },
      options: { type: Boolean, default: false },
      futures: { type: Boolean, default: false },
      currency: { type: Boolean, default: false }
    },

    // Brokerage & Fee Structure
    brokerage: {
      accountOpeningCharges: { type: String, default: 'Free' },
      amc: { type: String, default: 'Free' },
      equityDelivery: { type: String, default: 'Free' },
      intraday: { type: String, default: '₹20 or 0.03%' },
      optionsCharges: { type: String, default: '₹20 per order' },
      futuresCharges: { type: String, default: '₹20 per order' },
      commodityCharges: { type: String, default: '₹20 per order' },
      spread: { type: String, default: 'From 0.0 pips' },
      commission: { type: String, default: '$0 / lot' }
    },

    // Execution & Advanced Features
    executionSpeed: { type: String, default: 'Instant (< 50ms)' },
    swapFree: { type: Boolean, default: false },
    negativeBalanceProtection: { type: Boolean, default: true },
    copyTrading: { type: Boolean, default: false },
    socialTrading: { type: Boolean, default: false },
    pamm: { type: Boolean, default: false },
    mam: { type: Boolean, default: false },
    vps: { type: Boolean, default: false },
    apiTrading: { type: Boolean, default: true },
    algoTrading: { type: Boolean, default: true },
    marginTrading: { type: Boolean, default: true },
    researchReports: { type: Boolean, default: true },
    tradingSignals: { type: Boolean, default: false },
    education: { type: Boolean, default: true },

    // Customer Support
    customerSupport: {
      liveChat: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      phone: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: false },
      languages: [{ type: String }]
    },

    // Banking Methods
    depositMethods: [{ type: String }],
    withdrawalMethods: [{ type: String }],
    processingTime: { type: String, default: 'Instant to 24 Hours' },

    // Reviews & Highlights
    pros: [{ type: String }],
    cons: [{ type: String }],
    bestFor: { type: String, default: 'Beginners & Active Traders' },
    finalVerdict: { type: String, default: 'An outstanding broker with top tier regulation and modern platforms.' },

    // Ratings breakdown
    ratings: {
      trustScore: { type: Number, default: 4.8 },
      chargesScore: { type: Number, default: 4.6 },
      executionScore: { type: Number, default: 4.7 },
      platformScore: { type: Number, default: 4.9 },
      supportScore: { type: Number, default: 4.5 },
      overallScore: { type: Number, default: 4.7 }
    },

    // Flags & SEO
    isFeatured: { type: Boolean, default: false, index: true },
    isPopular: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    tags: [{ type: String, index: true }], // stock, forex, beginners, options, scalping, long-term
    faqs: [
      {
        question: { type: String },
        answer: { type: String }
      }
    ],
    metaTitle: { type: String },
    metaDescription: { type: String }
  },
  { timestamps: true }
);

// Search Index
brokerSchema.index({
  name: 'text',
  country: 'text',
  regulation: 'text',
  tags: 'text',
  bestFor: 'text'
});

module.exports = mongoose.model('Broker', brokerSchema);
