import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Star,
  Shield,
  Building2,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const BrokerList = () => {
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [region, setRegion] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBrokers();
  }, [search, type, region, page]);

  const fetchBrokers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/brokers', {
        params: { search, type, region, page, limit: 10 }
      });
      setBrokers(res.data.data);
      setTotalPages(res.data.meta?.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      try {
        await api.delete(`/brokers/${id}`);
        fetchBrokers();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete broker');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Broker Management</h1>
          <p className="text-sm text-gray-400">Add, edit, and configure stock & forex broker profiles</p>
        </div>
        <Link
          to="/brokers/new"
          className="inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-sky-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Broker</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, country, tags..."
            className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={region}
              onChange={(e) => { setRegion(e.target.value); setPage(1); }}
              className="bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Regions (Indian & Foreign)</option>
              <option value="indian">🇮🇳 Indian Brokers</option>
              <option value="foreign">🌐 Foreign Brokers</option>
            </select>
          </div>

          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1); }}
            className="bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
          >
            <option value="all">All Types (Stock & Forex)</option>
            <option value="stock">Stock Brokers Only</option>
            <option value="forex">Forex Brokers Only</option>
          </select>
        </div>
      </div>

      {/* Broker Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-950 text-gray-400 uppercase text-[11px] tracking-wider border-b border-gray-800">
              <tr>
                <th className="py-3.5 px-4">Broker Name</th>
                <th className="py-3.5 px-4">Region & Type</th>
                <th className="py-3.5 px-4">Country & Regulation</th>
                <th className="py-3.5 px-4">Min Deposit</th>
                <th className="py-3.5 px-4">Rating & Trust</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    Loading brokers...
                  </td>
                </tr>
              ) : brokers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    No brokers found matching your query.
                  </td>
                </tr>
              ) : (
                brokers.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img src={b.logo} alt={b.name} className="w-10 h-10 rounded-xl object-cover bg-white p-1 border border-gray-700" />
                        <div>
                          <span className="font-semibold text-white block text-sm">{b.name}</span>
                          <span className="text-xs text-gray-400">Est. {b.founded}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col space-y-1 items-start">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold uppercase tracking-wider ${
                          (b.region === 'indian' || (!b.region && b.country?.toLowerCase().includes('india')))
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        }`}>
                          {(b.region === 'indian' || (!b.region && b.country?.toLowerCase().includes('india'))) ? '🇮🇳 Indian' : '🌐 Foreign'}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold uppercase tracking-wider ${
                          b.brokerType === 'stock' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                          {b.brokerType}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="block font-medium text-white">{b.country}</span>
                      <span className="text-xs text-gray-400">{b.regulation?.join(', ') || 'N/A'}</span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-white">
                      {b.minDepositCurrency || '$'} {b.minDeposit}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1 text-amber-400 font-bold text-sm">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span>{b.overallRating}</span>
                        <span className="text-xs text-gray-400 font-normal">({b.trustScore}/100 Trust)</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {b.isActive ? (
                        <span className="inline-flex items-center text-xs text-emerald-400 space-x-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs text-rose-400 space-x-1">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/brokers/edit/${b._id}`}
                          className="p-2 text-gray-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors"
                          title="Edit Broker"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(b._id, b.name)}
                          className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Delete Broker"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-950 border-t border-gray-800 text-sm">
            <span className="text-gray-400">Page {page} of {totalPages}</span>
            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                className="p-2 rounded-lg bg-gray-900 border border-gray-800 disabled:opacity-40 hover:bg-gray-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                className="p-2 rounded-lg bg-gray-900 border border-gray-800 disabled:opacity-40 hover:bg-gray-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrokerList;
