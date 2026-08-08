import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { Star, ShieldCheck, Check, Plus, ExternalLink, ChevronRight, Zap } from 'lucide-react';

const BrokerCard = ({ broker }) => {
  const { addToCompare, removeFromCompare, isSelected } = useCompare();
  const selected = isSelected(broker._id);

  const handleToggleCompare = (e) => {
    e.preventDefault();
    if (selected) {
      removeFromCompare(broker._id);
    } else {
      addToCompare(broker);
    }
  };

  return (
    <div className="bg-gray-900/90 border border-gray-800 hover:border-sky-500/50 rounded-2xl p-6 transition-all duration-200 hover:shadow-2xl hover:shadow-sky-500/10 flex flex-col justify-between group relative overflow-hidden">
      
      {/* Top Badge */}
      <div className="flex items-center justify-between mb-5">
        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
          broker.brokerType === 'stock'
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
        }`}>
          {broker.brokerType} BROKER
        </span>

        <div className="flex items-center space-x-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full text-amber-400 text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{broker.overallRating}</span>
          <span className="text-gray-400 font-normal">/ 5</span>
        </div>
      </div>

      {/* Main Info Header */}
      <div className="flex items-start space-x-4 mb-6">
        <img
          src={broker.logo}
          alt={broker.name}
          className="w-14 h-14 rounded-2xl object-cover bg-white p-1.5 border border-gray-700 shadow-md group-hover:scale-105 transition-transform"
        />
        <div className="flex-1 min-w-0">
          <Link to={`/broker/${broker.slug}`} className="font-extrabold text-white text-lg block hover:text-sky-400 transition-colors truncate">
            {broker.name}
          </Link>
          <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{broker.regulation?.join(', ') || 'Regulated'}</span>
            <span>•</span>
            <span>{broker.country}</span>
          </div>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-2 gap-3 p-3.5 bg-gray-950/60 rounded-xl border border-gray-800/80 mb-6 text-xs">
        <div>
          <span className="block text-[10px] text-gray-400 uppercase font-semibold">Min Deposit</span>
          <span className="font-bold text-white mt-0.5 block">{broker.minDepositCurrency || '$'} {broker.minDeposit}</span>
        </div>
        <div>
          <span className="block text-[10px] text-gray-400 uppercase font-semibold">Max Leverage</span>
          <span className="font-bold text-sky-400 mt-0.5 block">{broker.maxLeverage || '1:500'}</span>
        </div>
        <div>
          <span className="block text-[10px] text-gray-400 uppercase font-semibold">Trust Score</span>
          <span className="font-bold text-emerald-400 mt-0.5 block">{broker.trustScore}/100</span>
        </div>
        <div>
          <span className="block text-[10px] text-gray-400 uppercase font-semibold">Execution Speed</span>
          <span className="font-bold text-white mt-0.5 block truncate">{broker.executionSpeed || '< 30ms'}</span>
        </div>
      </div>

      {/* Key Pros */}
      {broker.pros && broker.pros.length > 0 && (
        <div className="space-y-2 mb-6 text-xs text-gray-300">
          {broker.pros.slice(0, 2).map((pro, idx) => (
            <div key={idx} className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-1">{pro}</span>
            </div>
          ))}
        </div>
      )}

      {/* Card Actions */}
      <div className="flex items-center space-x-3 pt-4 border-t border-gray-800/80">
        <button
          onClick={handleToggleCompare}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all ${
            selected
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
              : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
          }`}
        >
          {selected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{selected ? 'Added to Compare' : 'Add to Compare'}</span>
        </button>

        <Link
          to={`/broker/${broker.slug}`}
          className="py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs shadow-md shadow-sky-600/20 flex items-center justify-center space-x-1 transition-all"
        >
          <span>Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default BrokerCard;
