const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Broker = require('../models/Broker');
const ComparisonFeature = require('../models/ComparisonFeature');
const ComparisonValue = require('../models/ComparisonValue');
const PopularComparison = require('../models/PopularComparison');
const Blog = require('../models/Blog');
const FAQ = require('../models/FAQ');
const Banner = require('../models/Banner');
const Testimonial = require('../models/Testimonial');

const dns = require("node:dns");

// Use Cloudflare DNS (optional)
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/broker_compare_db');
  console.log('[Seed DB Connected]');
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing collections
    await Admin.deleteMany();
    await Category.deleteMany();
    await Broker.deleteMany();
    await ComparisonFeature.deleteMany();
    await ComparisonValue.deleteMany();
    await PopularComparison.deleteMany();
    await Blog.deleteMany();
    await FAQ.deleteMany();
    await Banner.deleteMany();
    await Testimonial.deleteMany();

    console.log('[Cleared Old Data]');

    // 1. Create Default Admin
    const admin = await Admin.create({
      name: 'Super Admin',
      email: 'admin@brokercompare.com',
      password: 'Admin@123',
      role: 'superadmin'
    });
    console.log('[Admin Created]: admin@brokercompare.com / Admin@123');

    // 2. Categories
    const categories = await Category.insertMany([
      { name: 'Stock Brokers', slug: 'stock-brokers', type: 'stock', description: 'Top equity, futures, and options brokers in India', icon: 'TrendingUp' },
      { name: 'Forex Brokers', slug: 'forex-brokers', type: 'forex', description: 'Global FX brokers with high leverage & tight spreads', icon: 'Globe' },
      { name: 'Best for Beginners', slug: 'best-for-beginners', type: 'both', description: 'Easy-to-use platforms with low minimum deposit and top educational tools', icon: 'Award' },
      { name: 'Best for Options', slug: 'best-for-options', type: 'stock', description: 'Advanced option analytics, order chaining, and low per-order charges', icon: 'Zap' },
      { name: 'Best for Scalping', slug: 'best-for-scalping', type: 'forex', description: 'Ultra-fast execution speeds, raw spreads from 0.0 pips', icon: 'Activity' },
      { name: 'Best for Long Term', slug: 'best-for-long-term', type: 'both', description: 'Zero AMC, free delivery, robust research reports & mutual funds', icon: 'Shield' }
    ]);
    console.log('[Categories Created]');

    const stockCatId = categories[0]._id;
    const forexCatId = categories[1]._id;

    // 3. Custom Comparison Features (Dynamic Fields)
    const customFeatures = await ComparisonFeature.insertMany([
      { key: 'ai_trading', label: 'AI Trading Support', type: 'boolean', category: 'features', isHighlighted: true, sortOrder: 1 },
      { key: 'swap_free_acc', label: 'Islamic Swap-Free Account', type: 'boolean', category: 'features', isHighlighted: true, sortOrder: 2 },
      { key: 'raw_spread_pips', label: 'EUR/USD Raw Spread', type: 'text', category: 'fees', isHighlighted: true, sortOrder: 3 },
      { key: 'free_direct_mf', label: 'Free Direct Mutual Funds', type: 'boolean', category: 'features', isHighlighted: true, sortOrder: 4 },
      { key: 'max_order_per_sec', label: 'Order Speed (Orders/sec)', type: 'number', category: 'platform', isHighlighted: false, sortOrder: 5 }
    ]);
    console.log('[Custom Comparison Features Created]');

    // 4. Sample Brokers (5 Stock + 5 Forex)
    const sampleBrokers = [
      // STOCK BROKERS
      {
        name: 'Zerodha',
        slug: 'zerodha',
        logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&auto=format&fit=crop&q=80',
        brokerType: 'stock',
        categoryId: stockCatId,
        founded: 2010,
        headOffice: 'Bengaluru, India',
        country: 'India',
        website: 'https://zerodha.com',
        regulation: ['SEBI'],
        trustScore: 98,
        overallRating: 4.9,
        minDeposit: 0,
        minDepositCurrency: 'INR',
        maxLeverage: '1:5 (Intraday MIS)',
        accountTypes: ['Kite Equity & FnO', 'Commodity Account', 'NRI Account'],
        tradingPlatforms: { mt4: false, mt5: false, tradingView: true, webPlatform: true, mobileApp: true, desktopApp: true },
        products: { forex: false, stocks: true, indices: true, crypto: false, etf: true, commodity: true, mutualFunds: true, ipo: true, options: true, futures: true, currency: true },
        brokerage: {
          accountOpeningCharges: '₹200',
          amc: '₹300 / year',
          equityDelivery: '₹0 (Free)',
          intraday: '₹20 or 0.03% (Whichever lower)',
          optionsCharges: '₹20 per executed order',
          futuresCharges: '₹20 or 0.03% per order',
          commodityCharges: '₹20 or 0.03% per order',
          spread: 'N/A',
          commission: '₹0'
        },
        executionSpeed: '< 20ms',
        swapFree: false,
        negativeBalanceProtection: true,
        copyTrading: false,
        socialTrading: false,
        pamm: false,
        mam: false,
        vps: false,
        apiTrading: true,
        algoTrading: true,
        marginTrading: true,
        researchReports: false,
        tradingSignals: false,
        education: true,
        customerSupport: { liveChat: true, email: true, phone: true, whatsapp: false, languages: ['English', 'Hindi', 'Kannada', 'Tamil'] },
        depositMethods: ['UPI', 'Net Banking', 'IMPS'],
        withdrawalMethods: ['Bank Transfer', 'UPI'],
        processingTime: 'Instant to 24 Hours',
        pros: ['Zero brokerage on Equity Delivery', 'Kite platform is lightning fast & reliable', 'Varsity free financial education portal', 'Huge liquidity & trust factor'],
        cons: ['₹300 annual maintenance charge', 'Does not provide direct tip research calls', 'Occasional surge slowdowns during extreme market spikes'],
        bestFor: 'Overall Indian Investors & Active Traders',
        finalVerdict: 'Zerodha remains the undisputed market leader in India with clean UI, zero equity delivery fee, and robust infrastructure.',
        ratings: { trustScore: 4.9, chargesScore: 4.8, executionScore: 4.8, platformScore: 4.9, supportScore: 4.5, overallScore: 4.9 },
        isFeatured: true,
        isPopular: true,
        tags: ['stock', 'beginners', 'options', 'long-term']
      },
      {
        name: 'Angel One',
        slug: 'angel-one',
        logo: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=200&auto=format&fit=crop&q=80',
        brokerType: 'stock',
        categoryId: stockCatId,
        founded: 1996,
        headOffice: 'Mumbai, India',
        country: 'India',
        website: 'https://angelone.in',
        regulation: ['SEBI'],
        trustScore: 95,
        overallRating: 4.7,
        minDeposit: 0,
        minDepositCurrency: 'INR',
        maxLeverage: '1:5 (Intraday MTF)',
        accountTypes: ['Angel One iTrade Prime', 'HNI Trading Account'],
        tradingPlatforms: { mt4: false, mt5: false, tradingView: true, webPlatform: true, mobileApp: true, desktopApp: false },
        products: { forex: false, stocks: true, indices: true, crypto: false, etf: true, commodity: true, mutualFunds: true, ipo: true, options: true, futures: true, currency: true },
        brokerage: {
          accountOpeningCharges: '₹0 (Free)',
          amc: '₹0 for 1st Year (Then ₹20/mo)',
          equityDelivery: '₹0 (Free)',
          intraday: '₹20 or 0.25% (Whichever lower)',
          optionsCharges: '₹20 per executed order',
          futuresCharges: '₹20 or 0.25% per order',
          commodityCharges: '₹20 per order',
          spread: 'N/A',
          commission: '₹0'
        },
        executionSpeed: '< 30ms',
        swapFree: false,
        negativeBalanceProtection: true,
        copyTrading: false,
        socialTrading: false,
        pamm: false,
        mam: false,
        vps: false,
        apiTrading: true,
        algoTrading: true,
        marginTrading: true,
        researchReports: true,
        tradingSignals: true,
        education: true,
        customerSupport: { liveChat: true, email: true, phone: true, whatsapp: true, languages: ['English', 'Hindi', 'Gujarati', 'Marathi'] },
        depositMethods: ['UPI', 'Net Banking'],
        withdrawalMethods: ['Bank Transfer'],
        processingTime: 'Instant to Same Day',
        pros: ['Free account opening & 1st year AMC', 'Full advisory research reports included for free', 'Smart API access for automated trading', 'ARQ Prime AI recommendation engine'],
        cons: ['Call & Trade charges of ₹20 per call', 'App updates can occasionally change UI layouts'],
        bestFor: 'Traders needing Advisory & Smart API Support',
        finalVerdict: 'Angel One combines discount brokerage rates with full-service advisory research and automated trading capabilities.',
        ratings: { trustScore: 4.7, chargesScore: 4.7, executionScore: 4.6, platformScore: 4.7, supportScore: 4.7, overallScore: 4.7 },
        isFeatured: true,
        isPopular: true,
        tags: ['stock', 'beginners', 'options', 'scalping']
      },
      {
        name: 'Groww',
        slug: 'groww',
        logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&auto=format&fit=crop&q=80',
        brokerType: 'stock',
        categoryId: stockCatId,
        founded: 2016,
        headOffice: 'Bengaluru, India',
        country: 'India',
        website: 'https://groww.in',
        regulation: ['SEBI'],
        trustScore: 94,
        overallRating: 4.8,
        minDeposit: 0,
        minDepositCurrency: 'INR',
        maxLeverage: '1:5',
        accountTypes: ['Groww Direct Demat'],
        tradingPlatforms: { mt4: false, mt5: false, tradingView: true, webPlatform: true, mobileApp: true, desktopApp: false },
        products: { forex: false, stocks: true, indices: true, crypto: false, etf: true, commodity: false, mutualFunds: true, ipo: true, options: true, futures: true, currency: false },
        brokerage: {
          accountOpeningCharges: '₹0 (Free)',
          amc: '₹0 (Free Lifetime)',
          equityDelivery: '₹20 or 0.05%',
          intraday: '₹20 or 0.05%',
          optionsCharges: '₹20 per executed order',
          futuresCharges: '₹20 per order',
          commodityCharges: 'N/A',
          spread: 'N/A',
          commission: '₹0'
        },
        executionSpeed: '< 40ms',
        swapFree: false,
        negativeBalanceProtection: true,
        copyTrading: false,
        socialTrading: false,
        pamm: false,
        mam: false,
        vps: false,
        apiTrading: false,
        algoTrading: false,
        marginTrading: false,
        researchReports: false,
        tradingSignals: false,
        education: true,
        customerSupport: { liveChat: true, email: true, phone: true, whatsapp: false, languages: ['English', 'Hindi'] },
        depositMethods: ['UPI', 'Net Banking'],
        withdrawalMethods: ['Bank Transfer'],
        processingTime: 'Instant',
        pros: ['100% free lifetime AMC & Zero account opening fee', 'Ultra intuitive UI perfect for beginners', 'Seamless direct mutual funds investment portal', 'Fast account activation via Aadhaar e-Sign'],
        cons: ['Flat ₹20 charge even on equity delivery', 'Lacks advanced charting & algo API capabilities'],
        bestFor: 'Beginners & Long Term Mutual Fund Investors',
        finalVerdict: 'Groww provides the simplest user experience in India for beginner investors moving from Mutual Funds into Stocks.',
        ratings: { trustScore: 4.6, chargesScore: 4.5, executionScore: 4.4, platformScore: 4.9, supportScore: 4.6, overallScore: 4.8 },
        isFeatured: true,
        isPopular: true,
        tags: ['stock', 'beginners', 'long-term']
      },
      {
        name: 'm.Stock',
        slug: 'mstock',
        logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=200&auto=format&fit=crop&q=80',
        brokerType: 'stock',
        categoryId: stockCatId,
        founded: 2022,
        headOffice: 'Mumbai, India (Mirae Asset)',
        country: 'India',
        website: 'https://mstock.com',
        regulation: ['SEBI'],
        trustScore: 92,
        overallRating: 4.6,
        minDeposit: 0,
        minDepositCurrency: 'INR',
        maxLeverage: '1:5 (MTF Available)',
        accountTypes: ['Zero Brokerage Account', 'Free Demat Account'],
        tradingPlatforms: { mt4: false, mt5: false, tradingView: true, webPlatform: true, mobileApp: true, desktopApp: false },
        products: { forex: false, stocks: true, indices: true, crypto: false, etf: true, commodity: true, mutualFunds: true, ipo: true, options: true, futures: true, currency: true },
        brokerage: {
          accountOpeningCharges: '₹999 (Zero Brokerage Plan)',
          amc: '₹0 (Lifetime Free with ₹999 plan)',
          equityDelivery: '₹0 (Free For Life)',
          intraday: '₹0 (Free For Life)',
          optionsCharges: '₹0 (Free For Life)',
          futuresCharges: '₹0 (Free For Life)',
          commodityCharges: '₹0 (Free For Life)',
          spread: 'N/A',
          commission: '₹0'
        },
        executionSpeed: '< 35ms',
        swapFree: false,
        negativeBalanceProtection: true,
        copyTrading: false,
        socialTrading: false,
        pamm: false,
        mam: false,
        vps: false,
        apiTrading: true,
        algoTrading: false,
        marginTrading: true,
        researchReports: true,
        tradingSignals: false,
        education: true,
        customerSupport: { liveChat: true, email: true, phone: true, whatsapp: true, languages: ['English', 'Hindi'] },
        depositMethods: ['UPI', 'Net Banking'],
        withdrawalMethods: ['Bank Transfer'],
        processingTime: 'Instant to 24 Hours',
        pros: ['True 100% Zero Brokerage across Intraday, FnO, Delivery & Mutual Funds', 'Backed by financial giant Mirae Asset Group', 'Lowest MTF interest rates starting from 6.99%'],
        cons: ['One-time upfront account opening fee of ₹999', 'App interface feels a bit traditional compared to Groww'],
        bestFor: 'High Frequency FnO Traders seeking Zero Brokerage',
        finalVerdict: 'm.Stock by Mirae Asset is a game changer for active option and intraday traders looking to save thousands in brokerage fees.',
        ratings: { trustScore: 4.7, chargesScore: 5.0, executionScore: 4.5, platformScore: 4.3, supportScore: 4.4, overallScore: 4.6 },
        isFeatured: false,
        isPopular: true,
        tags: ['stock', 'options', 'scalping']
      },
      {
        name: 'FYERS',
        slug: 'fyers',
        logo: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=200&auto=format&fit=crop&q=80',
        brokerType: 'stock',
        categoryId: stockCatId,
        founded: 2015,
        headOffice: 'Bengaluru, India',
        country: 'India',
        website: 'https://fyers.in',
        regulation: ['SEBI'],
        trustScore: 91,
        overallRating: 4.7,
        minDeposit: 0,
        minDepositCurrency: 'INR',
        maxLeverage: '1:5',
        accountTypes: ['FYERS Trading Account'],
        tradingPlatforms: { mt4: false, mt5: false, tradingView: true, webPlatform: true, mobileApp: true, desktopApp: false },
        products: { forex: false, stocks: true, indices: true, crypto: false, etf: true, commodity: true, mutualFunds: true, ipo: true, options: true, futures: true, currency: true },
        brokerage: {
          accountOpeningCharges: '₹0 (Free)',
          amc: '₹0 (Free Lifetime)',
          equityDelivery: '₹0 (Free)',
          intraday: '₹20 or 0.03%',
          optionsCharges: '₹20 per executed order',
          futuresCharges: '₹20 or 0.03%',
          commodityCharges: '₹20 per order',
          spread: 'N/A',
          commission: '₹0'
        },
        executionSpeed: '< 25ms',
        swapFree: false,
        negativeBalanceProtection: true,
        copyTrading: false,
        socialTrading: false,
        pamm: false,
        mam: false,
        vps: false,
        apiTrading: true,
        algoTrading: true,
        marginTrading: true,
        researchReports: false,
        tradingSignals: true,
        education: true,
        customerSupport: { liveChat: true, email: true, phone: true, whatsapp: false, languages: ['English', 'Hindi'] },
        depositMethods: ['UPI', 'Net Banking'],
        withdrawalMethods: ['Bank Transfer'],
        processingTime: 'Instant',
        pros: ['Direct TradingView chart trade execution', 'Free API access for programmatic algo trading', 'Options Scalper tool & strategy builder', 'Zero AMC forever'],
        cons: ['Customer support hold time during peak hours can be high'],
        bestFor: 'Pro Traders & Chartists relying on TradingView',
        finalVerdict: 'FYERS offers the ultimate TradingView integration for serious technical traders who want to trade directly from charts.',
        ratings: { trustScore: 4.6, chargesScore: 4.8, executionScore: 4.7, platformScore: 4.9, supportScore: 4.3, overallScore: 4.7 },
        isFeatured: false,
        isPopular: false,
        tags: ['stock', 'options', 'scalping']
      },

      // FOREX BROKERS
      {
        name: 'Exness',
        slug: 'exness',
        logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&auto=format&fit=crop&q=80',
        brokerType: 'forex',
        categoryId: forexCatId,
        founded: 2008,
        headOffice: 'Limassol, Cyprus',
        country: 'Cyprus',
        website: 'https://exness.com',
        regulation: ['FCA', 'CySEC', 'FSA', 'FSCA'],
        trustScore: 99,
        overallRating: 4.9,
        minDeposit: 10,
        minDepositCurrency: 'USD',
        maxLeverage: 'Unlimited / 1:2000',
        accountTypes: ['Standard', 'Standard Cent', 'Raw Spread', 'Zero', 'Pro'],
        tradingPlatforms: { mt4: true, mt5: true, tradingView: true, webPlatform: true, mobileApp: true, desktopApp: true },
        products: { forex: true, stocks: true, indices: true, crypto: true, etf: false, commodity: true, mutualFunds: false, ipo: false, options: false, futures: false, currency: true },
        brokerage: {
          accountOpeningCharges: 'Free',
          amc: 'Free',
          equityDelivery: 'N/A',
          intraday: 'N/A',
          optionsCharges: 'N/A',
          futuresCharges: 'N/A',
          commodityCharges: 'Spread only',
          spread: 'From 0.0 pips',
          commission: '$3.50 / lot (Raw Spread)'
        },
        executionSpeed: 'Ultra-fast (< 10ms)',
        swapFree: true,
        negativeBalanceProtection: true,
        copyTrading: true,
        socialTrading: true,
        pamm: true,
        mam: true,
        vps: true,
        apiTrading: true,
        algoTrading: true,
        marginTrading: true,
        researchReports: true,
        tradingSignals: true,
        education: true,
        customerSupport: { liveChat: true, email: true, phone: true, whatsapp: true, languages: ['English', 'Hindi', 'Spanish', 'Arabic', 'Chinese'] },
        depositMethods: ['Crypto (USDT)', 'Cards', 'UPI / Local Transfer', 'Skrill', 'Neteller'],
        withdrawalMethods: ['Instant Crypto (USDT)', 'Instant UPI', 'Cards', 'Skrill'],
        processingTime: 'Instant 24/7 Automatic Withdrawals',
        pros: ['Instant 24/7 automated withdrawals without human delay', 'Unlimited leverage options for small accounts', 'Swap-free Islamic account enabled by default', 'Top global licenses including FCA UK & CySEC'],
        cons: ['Unlimited leverage can be risky for undisciplined beginners'],
        bestFor: 'Global Forex Traders, Scalpers & Automated Algo EA Users',
        finalVerdict: 'Exness is widely considered the world’s best forex broker due to instant withdrawals, tight raw spreads, and flexible leverage.',
        ratings: { trustScore: 5.0, chargesScore: 4.9, executionScore: 5.0, platformScore: 4.9, supportScore: 4.9, overallScore: 4.9 },
        isFeatured: true,
        isPopular: true,
        tags: ['forex', 'scalping', 'beginners']
      },
      {
        name: 'VT Markets',
        slug: 'vt-markets',
        logo: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=200&auto=format&fit=crop&q=80',
        brokerType: 'forex',
        categoryId: forexCatId,
        founded: 2015,
        headOffice: 'Sydney, Australia',
        country: 'Australia',
        website: 'https://vtmarkets.com',
        regulation: ['ASIC', 'FSCA'],
        trustScore: 94,
        overallRating: 4.7,
        minDeposit: 50,
        minDepositCurrency: 'USD',
        maxLeverage: '1:500',
        accountTypes: ['Standard STP', 'Raw ECN'],
        tradingPlatforms: { mt4: true, mt5: true, tradingView: true, webPlatform: true, mobileApp: true, desktopApp: true },
        products: { forex: true, stocks: true, indices: true, crypto: true, etf: false, commodity: true, mutualFunds: false, ipo: false, options: false, futures: false, currency: true },
        brokerage: {
          accountOpeningCharges: 'Free',
          amc: 'Free',
          equityDelivery: 'N/A',
          intraday: 'N/A',
          optionsCharges: 'N/A',
          futuresCharges: 'N/A',
          commodityCharges: 'Spread only',
          spread: 'From 0.0 pips (Raw ECN)',
          commission: '$3.00 / lot per side'
        },
        executionSpeed: '< 15ms',
        swapFree: true,
        negativeBalanceProtection: true,
        copyTrading: true,
        socialTrading: true,
        pamm: false,
        mam: true,
        vps: true,
        apiTrading: true,
        algoTrading: true,
        marginTrading: true,
        researchReports: true,
        tradingSignals: true,
        education: true,
        customerSupport: { liveChat: true, email: true, phone: true, whatsapp: false, languages: ['English', 'Spanish', 'Vietnamese', 'Thai'] },
        depositMethods: ['UPI', 'Credit/Debit Card', 'Crypto', 'Bank Wire'],
        withdrawalMethods: ['Bank Wire', 'Crypto', 'Cards'],
        processingTime: 'Within 1-3 Hours',
        pros: ['Strict ASIC tier-1 Australian regulation', 'Free Trading Central technical signals & analysis', 'Deep ECN liquidity pool with minimal slippage', 'Generous deposit bonuses and promotions'],
        cons: ['Minimum deposit of $50 is slightly higher than $10 competitors'],
        bestFor: 'Forex Scalpers & ECN Traders looking for Tier-1 Regulation',
        finalVerdict: 'VT Markets offers institutional grade ECN liquidity combined with top tier ASIC regulation and great deposit promos.',
        ratings: { trustScore: 4.7, chargesScore: 4.6, executionScore: 4.8, platformScore: 4.7, supportScore: 4.6, overallScore: 4.7 },
        isFeatured: true,
        isPopular: true,
        tags: ['forex', 'scalping', 'options']
      },
      {
        name: 'Vantage',
        slug: 'vantage',
        logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&auto=format&fit=crop&q=80',
        brokerType: 'forex',
        categoryId: forexCatId,
        founded: 2009,
        headOffice: 'Sydney, Australia',
        country: 'Australia',
        website: 'https://vantagemarkets.com',
        regulation: ['ASIC', 'FCA', 'VFSC'],
        trustScore: 96,
        overallRating: 4.8,
        minDeposit: 50,
        minDepositCurrency: 'USD',
        maxLeverage: '1:1000',
        accountTypes: ['Standard STP', 'Raw ECN', 'Pro ECN'],
        tradingPlatforms: { mt4: true, mt5: true, tradingView: true, webPlatform: true, mobileApp: true, desktopApp: true },
        products: { forex: true, stocks: true, indices: true, crypto: true, etf: true, commodity: true, mutualFunds: false, ipo: false, options: false, futures: false, currency: true },
        brokerage: {
          accountOpeningCharges: 'Free',
          amc: 'Free',
          equityDelivery: 'N/A',
          intraday: 'N/A',
          optionsCharges: 'N/A',
          futuresCharges: 'N/A',
          commodityCharges: 'Spread only',
          spread: 'From 0.0 pips',
          commission: '$2.00 / lot per side (Pro ECN)'
        },
        executionSpeed: '< 12ms',
        swapFree: true,
        negativeBalanceProtection: true,
        copyTrading: true,
        socialTrading: true,
        pamm: true,
        mam: true,
        vps: true,
        apiTrading: true,
        algoTrading: true,
        marginTrading: true,
        researchReports: true,
        tradingSignals: true,
        education: true,
        customerSupport: { liveChat: true, email: true, phone: true, whatsapp: true, languages: ['English', 'French', 'Chinese', 'Arabic'] },
        depositMethods: ['UPI', 'Cards', 'Crypto', 'Neteller', 'Skrill'],
        withdrawalMethods: ['UPI', 'Bank Wire', 'Crypto'],
        processingTime: 'Instant to 2 Hours',
        pros: ['Ultra competitive $2 commission on Pro ECN account', 'Dual ASIC and FCA tier-1 safety', 'Built-in Vantage Copy Trading mobile social ecosystem', 'Pro-Trader educational courses'],
        cons: ['Pro ECN requires $10,000 minimum deposit'],
        bestFor: 'Pro Forex Traders & Copy Trading Enthusiasts',
        finalVerdict: 'Vantage Markets stands out as a highly reliable multi-asset broker with premium trading tools and copy trading.',
        ratings: { trustScore: 4.9, chargesScore: 4.7, executionScore: 4.9, platformScore: 4.8, supportScore: 4.7, overallScore: 4.8 },
        isFeatured: true,
        isPopular: true,
        tags: ['forex', 'beginners', 'scalping']
      },
      {
        name: 'StarTrader',
        slug: 'startrader',
        logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=200&auto=format&fit=crop&q=80',
        brokerType: 'forex',
        categoryId: forexCatId,
        founded: 2018,
        headOffice: 'London, UK',
        country: 'United Kingdom',
        website: 'https://startrader.com',
        regulation: ['FCA', 'ASIC', 'FSCA'],
        trustScore: 90,
        overallRating: 4.5,
        minDeposit: 50,
        minDepositCurrency: 'USD',
        maxLeverage: '1:500',
        accountTypes: ['Standard', 'ECN'],
        tradingPlatforms: { mt4: true, mt5: true, tradingView: false, webPlatform: true, mobileApp: true, desktopApp: true },
        products: { forex: true, stocks: true, indices: true, crypto: true, etf: false, commodity: true, mutualFunds: false, ipo: false, options: false, futures: false, currency: true },
        brokerage: {
          accountOpeningCharges: 'Free',
          amc: 'Free',
          equityDelivery: 'N/A',
          intraday: 'N/A',
          optionsCharges: 'N/A',
          futuresCharges: 'N/A',
          commodityCharges: 'Spread only',
          spread: 'From 0.1 pips',
          commission: '$3.50 / lot'
        },
        executionSpeed: '< 20ms',
        swapFree: true,
        negativeBalanceProtection: true,
        copyTrading: true,
        socialTrading: true,
        pamm: false,
        mam: true,
        vps: true,
        apiTrading: true,
        algoTrading: true,
        marginTrading: true,
        researchReports: true,
        tradingSignals: true,
        education: true,
        customerSupport: { liveChat: true, email: true, phone: true, whatsapp: false, languages: ['English', 'Arabic'] },
        depositMethods: ['Crypto', 'Cards', 'UPI', 'Skrill'],
        withdrawalMethods: ['Crypto', 'UPI', 'Bank Wire'],
        processingTime: 'Within 24 Hours',
        pros: ['FCA regulated security for client funds', 'PAMM & Copy trading integration', 'Dedicated account managers'],
        cons: ['Lacks native TradingView platform integration'],
        bestFor: 'PAMM & Managed Account Investors',
        finalVerdict: 'StarTrader offers solid copy trading options backed by FCA regulations.',
        ratings: { trustScore: 4.5, chargesScore: 4.4, executionScore: 4.5, platformScore: 4.4, supportScore: 4.6, overallScore: 4.5 },
        isFeatured: false,
        isPopular: false,
        tags: ['forex', 'long-term']
      },
      {
        name: 'EC Markets',
        slug: 'ec-markets',
        logo: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=200&auto=format&fit=crop&q=80',
        brokerType: 'forex',
        categoryId: forexCatId,
        founded: 2012,
        headOffice: 'London, UK',
        country: 'United Kingdom',
        website: 'https://ecmarkets.com',
        regulation: ['FCA', 'FSC'],
        trustScore: 89,
        overallRating: 4.4,
        minDeposit: 100,
        minDepositCurrency: 'USD',
        maxLeverage: '1:500',
        accountTypes: ['Standard', 'ECN Raw'],
        tradingPlatforms: { mt4: true, mt5: true, tradingView: false, webPlatform: true, mobileApp: true, desktopApp: true },
        products: { forex: true, stocks: true, indices: true, crypto: true, etf: false, commodity: true, mutualFunds: false, ipo: false, options: false, futures: false, currency: true },
        brokerage: {
          accountOpeningCharges: 'Free',
          amc: 'Free',
          equityDelivery: 'N/A',
          intraday: 'N/A',
          optionsCharges: 'N/A',
          futuresCharges: 'N/A',
          commodityCharges: 'Spread only',
          spread: 'From 0.0 pips',
          commission: '$3.00 / lot'
        },
        executionSpeed: '< 25ms',
        swapFree: true,
        negativeBalanceProtection: true,
        copyTrading: false,
        socialTrading: false,
        pamm: true,
        mam: true,
        vps: true,
        apiTrading: true,
        algoTrading: true,
        marginTrading: true,
        researchReports: true,
        tradingSignals: false,
        education: true,
        customerSupport: { liveChat: true, email: true, phone: true, whatsapp: false, languages: ['English', 'Chinese'] },
        depositMethods: ['Bank Wire', 'Crypto', 'Cards'],
        withdrawalMethods: ['Bank Wire', 'Crypto'],
        processingTime: '1 to 2 Business Days',
        pros: ['Strict FCA London compliance', 'Deep liquidity tier-1 banks execution', 'Raw spreads with zero markup'],
        cons: ['Higher minimum deposit of $100', 'Withdrawal speed depends on banking hours'],
        bestFor: 'Institutional & High Net-Worth FX Traders',
        finalVerdict: 'EC Markets provides top UK regulatory compliance with clean institutional raw execution.',
        ratings: { trustScore: 4.6, chargesScore: 4.3, executionScore: 4.5, platformScore: 4.3, supportScore: 4.2, overallScore: 4.4 },
        isFeatured: false,
        isPopular: false,
        tags: ['forex', 'long-term']
      }
    ];

    const createdBrokers = await Broker.insertMany(sampleBrokers);
    console.log('[10 Sample Brokers Created]');

    // 5. Populate Custom Feature Values for Brokers
    const zerodhaId = createdBrokers.find(b => b.slug === 'zerodha')._id;
    const growwId = createdBrokers.find(b => b.slug === 'groww')._id;
    const exnessId = createdBrokers.find(b => b.slug === 'exness')._id;
    const vantageId = createdBrokers.find(b => b.slug === 'vantage')._id;

    const featureValues = [];
    customFeatures.forEach(feat => {
      if (feat.key === 'ai_trading') {
        featureValues.push({ brokerId: zerodhaId, featureId: feat._id, value: false });
        featureValues.push({ brokerId: growwId, featureId: feat._id, value: false });
        featureValues.push({ brokerId: exnessId, featureId: feat._id, value: true });
        featureValues.push({ brokerId: vantageId, featureId: feat._id, value: true });
      } else if (feat.key === 'swap_free_acc') {
        featureValues.push({ brokerId: zerodhaId, featureId: feat._id, value: false });
        featureValues.push({ brokerId: exnessId, featureId: feat._id, value: true });
        featureValues.push({ brokerId: vantageId, featureId: feat._id, value: true });
      } else if (feat.key === 'raw_spread_pips') {
        featureValues.push({ brokerId: exnessId, featureId: feat._id, value: '0.0 Pips' });
        featureValues.push({ brokerId: vantageId, featureId: feat._id, value: '0.1 Pips' });
      } else if (feat.key === 'free_direct_mf') {
        featureValues.push({ brokerId: zerodhaId, featureId: feat._id, value: true });
        featureValues.push({ brokerId: growwId, featureId: feat._id, value: true });
      }
    });

    await ComparisonValue.insertMany(featureValues);
    console.log('[Custom Comparison Values Seeded]');

    // 6. Popular Comparisons
    await PopularComparison.insertMany([
      {
        title: 'Zerodha vs Groww',
        slug: 'zerodha-vs-groww',
        brokers: [zerodhaId, growwId],
        description: 'Detailed comparison of India’s top 2 stock brokers: Fees, UI, Mutual funds & FnO charges.',
        category: 'stock',
        isFeatured: true,
        order: 1
      },
      {
        title: 'Exness vs Vantage Markets',
        slug: 'exness-vs-vantage',
        brokers: [exnessId, vantageId],
        description: 'Global forex comparison: Leverage, spreads, instant crypto withdrawal & copy trading.',
        category: 'forex',
        isFeatured: true,
        order: 2
      }
    ]);
    console.log('[Popular Comparisons Created]');

    // 7. Sample Blogs
    await Blog.insertMany([
      {
        title: 'Zerodha vs Groww: Which Broker is Best for You in 2026?',
        slug: 'zerodha-vs-groww-2026-comparison',
        content: `Choosing between Zerodha and Groww comes down to your primary investment goal. If you are an active trader trading Futures & Options or requiring advanced technical charts, Zerodha Kite is unparalleled. On the other hand, if you are a beginner looking to invest in Mutual Funds and simple long-term stocks with zero AMC, Groww is the preferred choice.`,
        summary: 'A deep dive into Zerodha vs Groww comparison covering brokerage fees, AMC, app interface, and customer support.',
        category: 'Stock Trading',
        tags: ['zerodha', 'groww', 'stock-broker'],
        author: 'Finance Expert',
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
        isPublished: true
      },
      {
        title: 'Top 5 Forex Brokers with Lowest Spreads and Instant Withdrawals',
        slug: 'top-5-forex-brokers-lowest-spreads',
        content: `For scalpers and day traders in the forex market, spread cost and withdrawal speed are critical factors. Brokers like Exness offer 0.0 pip raw spreads alongside instant 24/7 automated crypto and local bank payouts, eliminating waiting periods completely.`,
        summary: 'Compare top global forex brokers offering ECN execution, raw spreads from 0.0 pips, and instant withdrawals.',
        category: 'Forex Trading',
        tags: ['forex', 'exness', 'vantage', 'scalping'],
        author: 'FX Strategist',
        image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80',
        isPublished: true
      }
    ]);

    // 8. Sample FAQs
    await FAQ.insertMany([
      {
        question: 'How do I compare brokers side by side?',
        answer: 'Simply click on the "Compare" tab, select 2 or 3 brokers from our drop-down list or search modal, and view our automated side-by-side table matrix with highlight badges.',
        category: 'General',
        order: 1
      },
      {
        question: 'Are stock broker reviews on this site independent?',
        answer: 'Yes! All ratings and scores are dynamically derived from empirical fee structures, regulatory filings, user reviews, and platform benchmark testing.',
        category: 'General',
        order: 2
      },
      {
        question: 'What is the difference between Stock Brokers and Forex Brokers?',
        answer: 'Stock brokers deal with domestic equity shares, options, futures, and mutual funds regulated by bodies like SEBI. Forex brokers deal with international currency pairs, gold, indices, and global commodities with leverage.',
        category: 'Trading Basics',
        order: 3
      }
    ]);

    // 9. Sample Banners
    await Banner.insertMany([
      {
        title: 'Compare 50+ Top Stock & Forex Brokers Side-by-Side',
        subtitle: 'Unbiased ratings, hidden fees breakdown, regulation check, and instant side-by-side comparison matrix.',
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80',
        link: '/compare',
        type: 'home'
      }
    ]);

    // 10. Sample Testimonials
    await Testimonial.insertMany([
      {
        name: 'Rahul Sharma',
        role: 'FnO Trader',
        content: 'This broker comparison tool saved me thousands in hidden AMC and options brokerage fees. The side-by-side winner badges are super clear!',
        rating: 5
      },
      {
        name: 'Michael Davis',
        role: 'Forex Scalper',
        content: 'Finding an ASIC-regulated forex broker with instant USDT withdrawals used to take days. Broker Compare showed me Exness vs Vantage instantly.',
        rating: 5
      }
    ]);

    console.log('==============================================');
    console.log('  SUCCESSFULLY SEEDED ALL DATABASE COLLECTIONS!');
    console.log('==============================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
