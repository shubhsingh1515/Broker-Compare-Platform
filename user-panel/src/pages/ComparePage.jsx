import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useCompare } from '../context/CompareContext';
import ComparisonTable from '../components/ComparisonTable';
import { GitCompare, Plus, X, Sparkles, Building2 } from 'lucide-react';

const ComparePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedBrokers, addToCompare, removeFromCompare, clearCompare } = useCompare();

  const [allBrokers, setAllBrokers] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Slot modal state
  const [activeSlotModal, setActiveSlotModal] = useState(null);

  useEffect(() => {
    fetchBrokersList();
  }, []);

  useEffect(() => {
    if (selectedBrokers.length > 0) {
      fetchComparisonMatrix();
    } else {
      setComparisonData(null);
      setLoading(false);
    }
  }, [selectedBrokers]);

  const fetchBrokersList = async () => {
    try {
      const res = await api.get('/brokers', { params: { limit: 100 } });
      setAllBrokers(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComparisonMatrix = async () => {
    setLoading(true);
    try {
      const ids = selectedBrokers.map(b => b._id);
      const res = await api.post('/compare', { brokerIds: ids });
      setComparisonData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBrokerForSlot = (broker) => {
    addToCompare(broker);
    setActiveSlotModal(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <GitCompare className="w-8 h-8 text-sky-400" />
            <span>Side-by-Side Broker Comparison Engine</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">Compare up to 3 stock or forex brokers with dynamic winner highlights</p>
        </div>

        {selectedBrokers.length > 0 && (
          <button
            onClick={clearCompare}
            className="text-xs font-bold text-gray-400 hover:text-rose-400 transition-colors self-start sm:self-auto"
          >
            Clear Selected Brokers
          </button>
        )}
      </div>

      {/* Slot Pickers (3 Slots) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((slotIdx) => {
          const broker = selectedBrokers[slotIdx];
          return (
            <div
              key={slotIdx}
              className={`rounded-3xl p-6 border transition-all ${
                broker
                  ? 'bg-gray-900 border-sky-500/40 shadow-xl'
                  : 'bg-gray-900/40 border-dashed border-gray-800 hover:border-gray-700'
              }`}
            >
              {broker ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img src={broker.logo} alt={broker.name} className="w-12 h-12 rounded-2xl object-cover bg-white p-1" />
                    <div>
                      <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block">Slot {slotIdx + 1}</span>
                      <h4 className="font-extrabold text-white text-base">{broker.name}</h4>
                      <span className="text-xs text-gray-400 uppercase">{broker.brokerType}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCompare(broker._id)}
                    className="p-2 text-gray-500 hover:text-rose-400 bg-gray-950 rounded-xl"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setActiveSlotModal(slotIdx)}
                  className="w-full h-full py-6 flex flex-col items-center justify-center space-y-2 text-gray-500 hover:text-sky-400 transition-colors"
                >
                  <div className="p-3 bg-gray-950 rounded-2xl border border-gray-800">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">Select Broker {slotIdx + 1}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison Table Section */}
      {selectedBrokers.length < 2 ? (
        <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-16 text-center space-y-4">
          <Sparkles className="w-12 h-12 text-sky-400 mx-auto animate-pulse" />
          <h3 className="text-xl font-bold text-white">Select at least 2 brokers to compare</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Choose brokers above to see side-by-side fee schedules, leverage ratios, TradingView & MT5 availability, and dynamic winner badges!
          </p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <ComparisonTable data={comparisonData} />
      )}

      {/* Slot Selection Modal */}
      {activeSlotModal !== null && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-xl p-6 space-y-5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <h3 className="text-lg font-bold text-white">Select Broker for Slot {activeSlotModal + 1}</h3>
              <button onClick={() => setActiveSlotModal(null)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {allBrokers.map((b) => {
                const disabled = selectedBrokers.some(sb => sb._id === b._id);
                return (
                  <button
                    key={b._id}
                    disabled={disabled}
                    onClick={() => handleSelectBrokerForSlot(b)}
                    className="w-full text-left p-4 bg-gray-950 hover:bg-gray-800/60 disabled:opacity-40 border border-gray-800 rounded-2xl flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={b.logo} alt={b.name} className="w-10 h-10 rounded-xl object-cover bg-white p-1" />
                      <div>
                        <h4 className="font-bold text-white text-sm">{b.name}</h4>
                        <span className="text-xs text-sky-400 uppercase">{b.brokerType} • {b.country}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-400">★ {b.overallRating}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePage;
