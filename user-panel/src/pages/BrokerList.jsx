import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import BrokerCard from '../components/BrokerCard';
import { Filter, Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const BrokerList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state
  const typeParam = searchParams.get('type') || 'all';
  const tagParam = searchParams.get('tag') || '';
  const searchParam = searchParams.get('search') || '';

  const [type, setType] = useState(typeParam);
  const [tag, setTag] = useState(tagParam);
  const [search, setSearch] = useState(searchParam);
  const [mt4, setMt4] = useState(false);
  const [mt5, setMt5] = useState(false);
  const [tradingView, setTradingView] = useState(false);
  const [sort, setSort] = useState('rating_desc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setType(searchParams.get('type') || 'all');
    setTag(searchParams.get('tag') || '');
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    fetchBrokers();
  }, [type, tag, search, mt4, mt5, tradingView, sort, page]);

  const fetchBrokers = async () => {
    setLoading(true);
    try {
      const params = {
        type: type !== 'all' ? type : undefined,
        tag: tag || undefined,
        search: search || undefined,
        mt4: mt4 ? 'true' : undefined,
        mt5: mt5 ? 'true' : undefined,
        tradingView: tradingView ? 'true' : undefined,
        sort,
        page,
        limit: 9
      };
      const res = await api.get('/brokers', { params });
      setBrokers(res.data.data || []);
      setTotal(res.data.meta?.total || 0);
      setTotalPages(res.data.meta?.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight capitalize">
            {type === 'stock' ? 'Stock Brokers India (SEBI Regulated)' : type === 'forex' ? 'Global Forex Brokers (MT4/MT5 & High Leverage)' : 'All Stock & Forex Brokers'}
          </h1>
          <p className="text-sm text-gray-400 mt-1">Showing {total} verified broker profiles</p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold text-gray-400 uppercase">Sort By:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-sky-500"
          >
            <option value="rating_desc">Highest Rated</option>
            <option value="trust_desc">Highest Trust Score</option>
            <option value="deposit_asc">Lowest Deposit</option>
            <option value="newest">Newest Listed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filter Sidebar */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-6 h-fit sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <h3 className="font-bold text-white text-base flex items-center space-x-2">
              <Filter className="w-4 h-4 text-sky-400" />
              <span>Filter Brokers</span>
            </h3>
            <button
              onClick={() => {
                setType('all');
                setTag('');
                setSearch('');
                setMt4(false);
                setMt5(false);
                setTradingView(false);
                setSearchParams({});
              }}
              className="text-[11px] font-bold text-sky-400 hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Broker Type Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category Type</label>
            <div className="space-y-2">
              {[
                { id: 'all', label: 'All Brokers' },
                { id: 'stock', label: 'Stock Brokers' },
                { id: 'forex', label: 'Forex Brokers' }
              ].map((item) => (
                <label key={item.id} className="flex items-center space-x-2 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="radio"
                    name="typeRadio"
                    checked={type === item.id}
                    onChange={() => { setType(item.id); setPage(1); }}
                    className="text-sky-600 focus:ring-sky-500 bg-gray-950 border-gray-800"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Platforms Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Trading Platforms</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-xs text-gray-300 cursor-pointer">
                <input type="checkbox" checked={mt4} onChange={(e) => setMt4(e.target.checked)} className="rounded text-sky-600 bg-gray-950 border-gray-800" />
                <span>MetaTrader 4 (MT4)</span>
              </label>
              <label className="flex items-center space-x-2 text-xs text-gray-300 cursor-pointer">
                <input type="checkbox" checked={mt5} onChange={(e) => setMt5(e.target.checked)} className="rounded text-sky-600 bg-gray-950 border-gray-800" />
                <span>MetaTrader 5 (MT5)</span>
              </label>
              <label className="flex items-center space-x-2 text-xs text-gray-300 cursor-pointer">
                <input type="checkbox" checked={tradingView} onChange={(e) => setTradingView(e.target.checked)} className="rounded text-sky-600 bg-gray-950 border-gray-800" />
                <span>TradingView Charts</span>
              </label>
            </div>
          </div>
        </div>

        {/* Brokers Grid */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : brokers.length === 0 ? (
            <div className="py-20 text-center bg-gray-900 rounded-3xl border border-gray-800 space-y-3">
              <p className="text-lg font-bold text-white">No brokers match your selected filters.</p>
              <p className="text-xs text-gray-400">Try clearing filters or changing search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brokers.map((broker) => (
                <BrokerCard key={broker._id} broker={broker} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-800">
              <span className="text-xs text-gray-400">Page {page} of {totalPages}</span>
              <div className="flex items-center space-x-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 disabled:opacity-40 hover:bg-gray-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 disabled:opacity-40 hover:bg-gray-800"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrokerList;
