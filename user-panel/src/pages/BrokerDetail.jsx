import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCompare } from '../context/CompareContext';
import {
  Star,
  ShieldCheck,
  ExternalLink,
  Check,
  Plus,
  Zap,
  Globe,
  Award,
  DollarSign,
  HelpCircle,
  X
} from 'lucide-react';

const BrokerDetail = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToCompare, removeFromCompare, isSelected } = useCompare();

  useEffect(() => {
    fetchBroker();
  }, [slug]);

  const fetchBroker = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/brokers/${slug}`);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data || !data.broker) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Broker Profile Not Found</h2>
        <Link to="/brokers" className="text-sky-400 font-bold hover:underline">Back to Broker Directory</Link>
      </div>
    );
  }

  const { broker, customFeatures = [] } = data;
  const selected = isSelected(broker._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Profile Banner Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <img
              src={broker.logo}
              alt={broker.name}
              className="w-20 h-20 rounded-3xl object-cover bg-white p-2 border border-gray-700 shadow-xl"
            />
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-black text-white">{broker.name}</h1>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  {broker.brokerType} Broker
                </span>
              </div>
              <p className="text-xs text-gray-400 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Regulated by {broker.regulation?.join(', ') || 'Global Regulatory Bodies'}</span>
                <span>•</span>
                <span>Est. {broker.founded}</span>
                <span>•</span>
                <span>{broker.country}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => selected ? removeFromCompare(broker._id) : addToCompare(broker)}
              className={`py-3 px-5 rounded-2xl font-bold text-xs flex items-center space-x-2 transition-all ${
                selected ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' : 'bg-gray-800 hover:bg-gray-700 text-white'
              }`}
            >
              {selected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{selected ? 'Added to Compare' : 'Add to Compare'}</span>
            </button>

            <a
              href={broker.website}
              target="_blank"
              rel="noreferrer"
              className="py-3 px-6 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-2xl font-bold text-xs shadow-lg shadow-sky-600/30 flex items-center space-x-2"
            >
              <span>Visit Official Site</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Rating Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-800">
          <div className="bg-gray-950/80 p-4 rounded-2xl border border-gray-800/80 text-center">
            <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest">Overall Score</span>
            <span className="text-2xl font-black text-amber-400 mt-1 block">★ {broker.overallRating} / 5</span>
          </div>

          <div className="bg-gray-950/80 p-4 rounded-2xl border border-gray-800/80 text-center">
            <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest">Trust Index</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">{broker.trustScore} / 100</span>
          </div>

          <div className="bg-gray-950/80 p-4 rounded-2xl border border-gray-800/80 text-center">
            <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest">Min Deposit</span>
            <span className="text-2xl font-black text-white mt-1 block">{broker.minDepositCurrency || '$'} {broker.minDeposit}</span>
          </div>

          <div className="bg-gray-950/80 p-4 rounded-2xl border border-gray-800/80 text-center">
            <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest">Max Leverage</span>
            <span className="text-2xl font-black text-sky-400 mt-1 block">{broker.maxLeverage}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Details (Left Column) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Fee Schedule Table */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>Brokerage & Fee Schedule</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800">
                <span className="text-gray-400 font-semibold block uppercase text-[10px]">Account Opening Fee</span>
                <span className="font-extrabold text-white text-sm mt-1 block">{broker.brokerage?.accountOpeningCharges || 'Free'}</span>
              </div>
              <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800">
                <span className="text-gray-400 font-semibold block uppercase text-[10px]">AMC (Annual Charge)</span>
                <span className="font-extrabold text-white text-sm mt-1 block">{broker.brokerage?.amc || 'Free'}</span>
              </div>
              <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800">
                <span className="text-gray-400 font-semibold block uppercase text-[10px]">Equity Delivery</span>
                <span className="font-extrabold text-emerald-400 text-sm mt-1 block">{broker.brokerage?.equityDelivery || 'N/A'}</span>
              </div>
              <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800">
                <span className="text-gray-400 font-semibold block uppercase text-[10px]">Intraday Brokerage</span>
                <span className="font-extrabold text-white text-sm mt-1 block">{broker.brokerage?.intraday || 'N/A'}</span>
              </div>
              <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800">
                <span className="text-gray-400 font-semibold block uppercase text-[10px]">Options Charges</span>
                <span className="font-extrabold text-white text-sm mt-1 block">{broker.brokerage?.optionsCharges || 'N/A'}</span>
              </div>
              <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800">
                <span className="text-gray-400 font-semibold block uppercase text-[10px]">Average Spread</span>
                <span className="font-extrabold text-sky-400 text-sm mt-1 block">{broker.brokerage?.spread || 'From 0.0 pips'}</span>
              </div>
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-3">
              <h4 className="font-extrabold text-emerald-400 text-sm uppercase tracking-wider flex items-center space-x-1.5">
                <Check className="w-4 h-4" />
                <span>Advantages & Pros</span>
              </h4>
              <ul className="space-y-2 text-xs text-gray-300">
                {broker.pros?.map((p, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-3">
              <h4 className="font-extrabold text-rose-400 text-sm uppercase tracking-wider flex items-center space-x-1.5">
                <X className="w-4 h-4" />
                <span>Disadvantages & Cons</span>
              </h4>
              <ul className="space-y-2 text-xs text-gray-300">
                {broker.cons?.map((c, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5"></span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Final Verdict */}
          <div className="bg-gradient-to-r from-sky-950/40 via-gray-900 to-gray-900 border border-sky-500/30 rounded-3xl p-6 space-y-3">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest block">Expert Final Verdict</span>
            <p className="text-sm text-gray-200 leading-relaxed italic">"{broker.finalVerdict}"</p>
          </div>
        </div>

        {/* Sidebar Breakdown */}
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-extrabold text-white text-base">Ratings Breakdown</h3>
            <div className="space-y-3 text-xs">
              {[
                { label: 'Trust & Regulation', score: broker.ratings?.trustScore || 4.8 },
                { label: 'Brokerage & Fees', score: broker.ratings?.chargesScore || 4.6 },
                { label: 'Execution Speed', score: broker.ratings?.executionScore || 4.7 },
                { label: 'Trading Platform', score: broker.ratings?.platformScore || 4.9 },
                { label: 'Customer Support', score: broker.ratings?.supportScore || 4.5 }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-gray-300 font-semibold">
                    <span>{item.label}</span>
                    <span className="text-amber-400 font-bold">{item.score} / 5</span>
                  </div>
                  <div className="w-full h-2 bg-gray-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-teal-400 rounded-full"
                      style={{ width: `${(item.score / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BrokerDetail;
