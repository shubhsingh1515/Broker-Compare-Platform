import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import {
  Save,
  ArrowLeft,
  Building2,
  Star,
  Sliders,
  Layers,
  DollarSign,
  Zap,
  CheckSquare,
  HelpCircle
} from 'lucide-react';

const BrokerForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('basic');
  const [categories, setCategories] = useState([]);
  const [customFeatures, setCustomFeatures] = useState([]);
  const [dynamicValues, setDynamicValues] = useState({}); // { featureKeyOrId: value }

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&auto=format&fit=crop&q=80',
    brokerType: 'stock',
    categoryId: '',
    founded: 2015,
    headOffice: 'Bengaluru, India',
    country: 'India',
    website: 'https://example.com',
    regulation: 'SEBI',
    trustScore: 90,
    overallRating: 4.7,
    minDeposit: 0,
    minDepositCurrency: 'USD',
    maxLeverage: '1:500',
    accountTypes: 'Standard, ECN',
    tradingPlatforms: {
      mt4: false,
      mt5: false,
      tradingView: true,
      webPlatform: true,
      mobileApp: true,
      desktopApp: true
    },
    products: {
      forex: false,
      stocks: true,
      indices: true,
      crypto: false,
      etf: true,
      commodity: true,
      mutualFunds: true,
      ipo: true,
      options: true,
      futures: true,
      currency: true
    },
    brokerage: {
      accountOpeningCharges: 'Free',
      amc: 'Free',
      equityDelivery: 'Free',
      intraday: '₹20 or 0.03%',
      optionsCharges: '₹20 per order',
      futuresCharges: '₹20 per order',
      commodityCharges: '₹20 per order',
      spread: 'From 0.0 pips',
      commission: '$0'
    },
    executionSpeed: 'Instant (< 20ms)',
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
    tradingSignals: false,
    education: true,
    customerSupport: {
      liveChat: true,
      email: true,
      phone: true,
      whatsapp: true,
      languages: 'English, Hindi'
    },
    depositMethods: 'UPI, Cards, Net Banking',
    withdrawalMethods: 'Bank Transfer, UPI',
    processingTime: 'Instant to 24 Hours',
    pros: 'Zero Delivery Fee, High Liquidity, Lightning Fast UI',
    cons: 'Annual maintenance fee, Support hold times',
    bestFor: 'Beginners & FnO Traders',
    finalVerdict: 'Top rated broker with reliable execution and clean platforms.',
    ratings: {
      trustScore: 4.8,
      chargesScore: 4.6,
      executionScore: 4.7,
      platformScore: 4.9,
      supportScore: 4.5,
      overallScore: 4.7
    },
    isFeatured: true,
    isPopular: true,
    isActive: true,
    tags: 'stock, beginners, options'
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [catRes, featRes] = await Promise.all([
        api.get('/categories'),
        api.get('/features')
      ]);
      setCategories(catRes.data.data);
      setCustomFeatures(featRes.data.data);

      if (isEdit) {
        const brokerRes = await api.get(`/brokers/${id}`);
        const b = brokerRes.data.data.broker;
        setFormData({
          ...b,
          categoryId: b.categoryId?._id || b.categoryId || '',
          regulation: Array.isArray(b.regulation) ? b.regulation.join(', ') : b.regulation,
          accountTypes: Array.isArray(b.accountTypes) ? b.accountTypes.join(', ') : b.accountTypes,
          depositMethods: Array.isArray(b.depositMethods) ? b.depositMethods.join(', ') : b.depositMethods,
          withdrawalMethods: Array.isArray(b.withdrawalMethods) ? b.withdrawalMethods.join(', ') : b.withdrawalMethods,
          pros: Array.isArray(b.pros) ? b.pros.join('\n') : b.pros,
          cons: Array.isArray(b.cons) ? b.cons.join('\n') : b.cons,
          tags: Array.isArray(b.tags) ? b.tags.join(', ') : b.tags,
          customerSupport: {
            ...b.customerSupport,
            languages: Array.isArray(b.customerSupport?.languages) ? b.customerSupport.languages.join(', ') : b.customerSupport?.languages
          }
        });

        // Load custom values
        const customRes = await api.get(`/features/values/${id}`);
        const valMap = {};
        customRes.data.data.forEach((v) => {
          if (v.featureId) {
            valMap[v.featureId._id || v.featureId] = v.value;
          }
        });
        setDynamicValues(valMap);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        regulation: typeof formData.regulation === 'string' ? formData.regulation.split(',').map(s => s.trim()).filter(Boolean) : formData.regulation,
        accountTypes: typeof formData.accountTypes === 'string' ? formData.accountTypes.split(',').map(s => s.trim()).filter(Boolean) : formData.accountTypes,
        depositMethods: typeof formData.depositMethods === 'string' ? formData.depositMethods.split(',').map(s => s.trim()).filter(Boolean) : formData.depositMethods,
        withdrawalMethods: typeof formData.withdrawalMethods === 'string' ? formData.withdrawalMethods.split(',').map(s => s.trim()).filter(Boolean) : formData.withdrawalMethods,
        pros: typeof formData.pros === 'string' ? formData.pros.split('\n').map(s => s.trim()).filter(Boolean) : formData.pros,
        cons: typeof formData.cons === 'string' ? formData.cons.split('\n').map(s => s.trim()).filter(Boolean) : formData.cons,
        tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(s => s.trim()).filter(Boolean) : formData.tags,
        customerSupport: {
          ...formData.customerSupport,
          languages: typeof formData.customerSupport.languages === 'string' ? formData.customerSupport.languages.split(',').map(s => s.trim()).filter(Boolean) : formData.customerSupport.languages
        }
      };

      let savedBrokerId = id;
      if (isEdit) {
        await api.put(`/brokers/${id}`, payload);
      } else {
        const res = await api.post('/brokers', payload);
        savedBrokerId = res.data.data._id;
      }

      // Save custom feature values
      if (savedBrokerId && Object.keys(dynamicValues).length > 0) {
        const valueArray = Object.entries(dynamicValues).map(([featureId, value]) => ({
          featureId,
          value
        }));
        await api.post('/features/values', {
          brokerId: savedBrokerId,
          values: valueArray
        });
      }

      navigate('/brokers');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save broker');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: '1. Basic Info', icon: Building2 },
    { id: 'ratings', label: '2. Scores & Ratings', icon: Star },
    { id: 'platforms', label: '3. Platforms & Products', icon: Layers },
    { id: 'charges', label: '4. Brokerage & Charges', icon: DollarSign },
    { id: 'features', label: '5. Execution & Features', icon: Zap },
    { id: 'dynamic', label: '6. Custom Dynamic Features', icon: Sliders },
    { id: 'verdict', label: '7. Pros, Cons & Verdict', icon: CheckSquare }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/brokers')}
            className="p-2 text-gray-400 hover:text-white bg-gray-900 border border-gray-800 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {isEdit ? `Edit Broker: ${formData.name}` : 'Create New Broker Profile'}
            </h1>
            <p className="text-sm text-gray-400">Fill in comprehensive specs for exact dynamic comparison</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{submitting ? 'Saving Broker...' : 'Save Broker Profile'}</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto space-x-2 bg-gray-900 border border-gray-800 p-2 rounded-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-sky-600 text-white shadow-md font-semibold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6">
        {/* TAB 1: BASIC INFO */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white mb-4">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Broker Name *</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                  placeholder="e.g. Zerodha"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Broker Type *</label>
                <select
                  name="brokerType"
                  value={formData.brokerType}
                  onChange={handleInputChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                >
                  <option value="stock">Stock Broker</option>
                  <option value="forex">Forex Broker</option>
                  <option value="both">Both (Stock & Forex)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Category</label>
                <select
                  name="categoryId"
                  value={formData.categoryId || ''}
                  onChange={handleInputChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                >
                  <option value="">Select Category (Optional)</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name} ({cat.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Logo URL *</label>
                <input
                  type="text"
                  required
                  name="logo"
                  value={formData.logo}
                  onChange={handleInputChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Founded Year</label>
                <input
                  type="number"
                  name="founded"
                  value={formData.founded}
                  onChange={handleInputChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Head Office</label>
                <input
                  type="text"
                  name="headOffice"
                  value={formData.headOffice}
                  onChange={handleInputChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Website URL</label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Regulations (Comma Separated)</label>
                <input
                  type="text"
                  name="regulation"
                  value={formData.regulation}
                  onChange={handleInputChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                  placeholder="SEBI, ASIC, FCA"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Minimum Deposit Amount</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="minDeposit"
                    value={formData.minDeposit}
                    onChange={handleInputChange}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                  />
                  <input
                    type="text"
                    name="minDepositCurrency"
                    value={formData.minDepositCurrency}
                    onChange={handleInputChange}
                    className="w-24 bg-gray-950 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                    placeholder="USD/INR"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Max Leverage</label>
                <input
                  type="text"
                  name="maxLeverage"
                  value={formData.maxLeverage}
                  onChange={handleInputChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                  placeholder="e.g. 1:500 or 1:5 MIS"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Account Types (Comma Separated)</label>
                <input
                  type="text"
                  name="accountTypes"
                  value={formData.accountTypes}
                  onChange={handleInputChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                  placeholder="Standard, ECN, Cent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Tags (Comma Separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                  placeholder="stock, forex, beginners, scalping"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6 pt-4 border-t border-gray-800">
              <label className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 bg-gray-950 border-gray-800"
                />
                <span>Active Status</span>
              </label>

              <label className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 bg-gray-950 border-gray-800"
                />
                <span>Featured Broker</span>
              </label>

              <label className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPopular"
                  checked={formData.isPopular}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 bg-gray-950 border-gray-800"
                />
                <span>Popular Broker</span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 2: RATINGS & BREAKDOWN */}
        {activeTab === 'ratings' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white mb-4">Scores & Ratings Breakdown</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Overall Rating (0 - 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  name="overallRating"
                  value={formData.overallRating}
                  onChange={handleInputChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Trust Score (0 - 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  name="trustScore"
                  value={formData.trustScore}
                  onChange={handleInputChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Charges Score (0 - 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.ratings?.chargesScore || 4.5}
                  onChange={(e) => handleNestedChange('ratings', 'chargesScore', parseFloat(e.target.value))}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Execution Score (0 - 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.ratings?.executionScore || 4.5}
                  onChange={(e) => handleNestedChange('ratings', 'executionScore', parseFloat(e.target.value))}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Platform Score (0 - 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.ratings?.platformScore || 4.8}
                  onChange={(e) => handleNestedChange('ratings', 'platformScore', parseFloat(e.target.value))}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Support Score (0 - 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.ratings?.supportScore || 4.5}
                  onChange={(e) => handleNestedChange('ratings', 'supportScore', parseFloat(e.target.value))}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PLATFORMS & PRODUCTS */}
        {activeTab === 'platforms' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-bold text-white mb-4">Supported Trading Platforms</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {Object.keys(formData.tradingPlatforms || {}).map((plat) => (
                  <label key={plat} className="flex items-center space-x-2 bg-gray-950 p-3 rounded-xl border border-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.tradingPlatforms[plat]}
                      onChange={(e) => handleNestedChange('tradingPlatforms', plat, e.target.checked)}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 bg-gray-900 border-gray-700"
                    />
                    <span className="text-xs font-semibold text-gray-200 uppercase">{plat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-4">Tradable Products & Assets</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Object.keys(formData.products || {}).map((prod) => (
                  <label key={prod} className="flex items-center space-x-2 bg-gray-950 p-3 rounded-xl border border-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.products[prod]}
                      onChange={(e) => handleNestedChange('products', prod, e.target.checked)}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 bg-gray-900 border-gray-700"
                    />
                    <span className="text-xs font-semibold text-gray-200 uppercase">{prod}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CHARGES & FEES */}
        {activeTab === 'charges' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white mb-4">Brokerage & Fee Schedule</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Account Opening Charges</label>
                <input
                  type="text"
                  value={formData.brokerage?.accountOpeningCharges}
                  onChange={(e) => handleNestedChange('brokerage', 'accountOpeningCharges', e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">AMC (Annual Maintenance)</label>
                <input
                  type="text"
                  value={formData.brokerage?.amc}
                  onChange={(e) => handleNestedChange('brokerage', 'amc', e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Equity Delivery Charge</label>
                <input
                  type="text"
                  value={formData.brokerage?.equityDelivery}
                  onChange={(e) => handleNestedChange('brokerage', 'equityDelivery', e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Intraday Brokerage</label>
                <input
                  type="text"
                  value={formData.brokerage?.intraday}
                  onChange={(e) => handleNestedChange('brokerage', 'intraday', e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Options Charges</label>
                <input
                  type="text"
                  value={formData.brokerage?.optionsCharges}
                  onChange={(e) => handleNestedChange('brokerage', 'optionsCharges', e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Futures Charges</label>
                <input
                  type="text"
                  value={formData.brokerage?.futuresCharges}
                  onChange={(e) => handleNestedChange('brokerage', 'futuresCharges', e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Average Spread</label>
                <input
                  type="text"
                  value={formData.brokerage?.spread}
                  onChange={(e) => handleNestedChange('brokerage', 'spread', e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                  placeholder="e.g. From 0.0 pips or N/A"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Commission per Lot</label>
                <input
                  type="text"
                  value={formData.brokerage?.commission}
                  onChange={(e) => handleNestedChange('brokerage', 'commission', e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: EXECUTION & FEATURES */}
        {activeTab === 'features' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white mb-4">Advanced Trading Features</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[
                { name: 'swapFree', label: 'Islamic Swap Free' },
                { name: 'negativeBalanceProtection', label: 'Negative Balance Protection' },
                { name: 'copyTrading', label: 'Copy Trading' },
                { name: 'socialTrading', label: 'Social Trading' },
                { name: 'pamm', label: 'PAMM Account' },
                { name: 'mam', label: 'MAM Account' },
                { name: 'vps', label: 'VPS Hosting' },
                { name: 'apiTrading', label: 'API Trading' },
                { name: 'algoTrading', label: 'Algo Trading' },
                { name: 'marginTrading', label: 'Margin Trading (MTF)' },
                { name: 'researchReports', label: 'Research Reports' },
                { name: 'tradingSignals', label: 'Trading Signals' },
                { name: 'education', label: 'Educational Content' }
              ].map((feat) => (
                <label key={feat.name} className="flex items-center space-x-2 bg-gray-950 p-3.5 rounded-xl border border-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    name={feat.name}
                    checked={Boolean(formData[feat.name])}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 bg-gray-900 border-gray-700"
                  />
                  <span className="text-xs font-semibold text-gray-200">{feat.label}</span>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Execution Speed</label>
                <input
                  type="text"
                  name="executionSpeed"
                  value={formData.executionSpeed}
                  onChange={handleInputChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Deposit Methods (Comma Separated)</label>
                <input
                  type="text"
                  name="depositMethods"
                  value={formData.depositMethods}
                  onChange={handleInputChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DYNAMIC CUSTOM FEATURES */}
        {activeTab === 'dynamic' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Admin Dynamic Comparison Fields</h2>
              <p className="text-xs text-gray-400">Configure values for custom features created in the Dynamic Features panel</p>
            </div>

            {customFeatures.length === 0 ? (
              <div className="p-8 text-center bg-gray-950 rounded-xl border border-gray-800 text-gray-500 text-sm">
                No custom features created yet. Create them from the "Dynamic Features" tab in sidebar.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customFeatures.map((feat) => {
                  const val = dynamicValues[feat._id] ?? '';
                  return (
                    <div key={feat._id} className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                      <label className="block text-xs font-semibold text-sky-400 uppercase mb-2">
                        {feat.label} ({feat.type})
                      </label>
                      {feat.type === 'boolean' ? (
                        <select
                          value={val === true || val === 'true' ? 'true' : 'false'}
                          onChange={(e) => setDynamicValues(prev => ({ ...prev, [feat._id]: e.target.value === 'true' }))}
                          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm"
                        >
                          <option value="true">Yes / True</option>
                          <option value="false">No / False</option>
                        </select>
                      ) : (
                        <input
                          type={feat.type === 'number' ? 'number' : 'text'}
                          value={val}
                          onChange={(e) => setDynamicValues(prev => ({ ...prev, [feat._id]: e.target.value }))}
                          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm"
                          placeholder={`Enter ${feat.label}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: PROS, CONS & VERDICT */}
        {activeTab === 'verdict' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white mb-4">Pros, Cons & Final Verdict</h2>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Pros (One per line)</label>
              <textarea
                rows="4"
                name="pros"
                value={formData.pros}
                onChange={handleInputChange}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-sky-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Cons (One per line)</label>
              <textarea
                rows="4"
                name="cons"
                value={formData.cons}
                onChange={handleInputChange}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-sky-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Best For</label>
              <input
                type="text"
                name="bestFor"
                value={formData.bestFor}
                onChange={handleInputChange}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Final Verdict Summary</label>
              <textarea
                rows="3"
                name="finalVerdict"
                value={formData.finalVerdict}
                onChange={handleInputChange}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-sky-500"
              ></textarea>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default BrokerForm;
