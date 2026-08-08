import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, GitCompare, Edit3, Trash2 } from 'lucide-react';

const PopularComparisons = () => {
  const [comparisons, setComparisons] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    brokers: [],
    category: 'stock',
    description: '',
    isFeatured: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [compRes, brokerRes] = await Promise.all([
        api.get('/popular-comparisons'),
        api.get('/brokers', { params: { limit: 100 } })
      ]);
      setComparisons(compRes.data.data);
      setBrokers(brokerRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (comp = null) => {
    if (comp) {
      setEditId(comp._id);
      setFormData({
        ...comp,
        brokers: comp.brokers?.map(b => b._id || b)
      });
    } else {
      setEditId(null);
      setFormData({
        title: '',
        slug: '',
        brokers: [],
        category: 'stock',
        description: '',
        isFeatured: true
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.brokers.length < 2) {
      alert('Please select at least 2 brokers for comparison!');
      return;
    }

    try {
      if (editId) {
        await api.put(`/popular-comparisons/${editId}`, formData);
      } else {
        await api.post('/popular-comparisons', formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save popular comparison');
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete popular comparison "${title}"?`)) {
      try {
        await api.delete(`/popular-comparisons/${id}`);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  const handleBrokerCheckbox = (bId) => {
    setFormData((prev) => {
      const exists = prev.brokers.includes(bId);
      if (exists) {
        return { ...prev, brokers: prev.brokers.filter(id => id !== bId) };
      } else {
        if (prev.brokers.length >= 3) {
          alert('You can select up to 3 brokers max for a comparison.');
          return prev;
        }
        return { ...prev, brokers: [...prev.brokers, bId] };
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Popular Comparisons</h1>
          <p className="text-sm text-gray-400">Curate top requested side-by-side broker matchups (e.g. Zerodha vs Groww)</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Popular Matchup</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center py-8 text-gray-500">Loading...</div>
        ) : comparisons.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500">No popular comparisons configured yet.</div>
        ) : (
          comparisons.map((c) => (
            <div key={c._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <GitCompare className="w-5 h-5 text-sky-400" />
                    <span>{c.title}</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">{c.description}</p>
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => handleOpenModal(c)} className="p-1.5 text-gray-400 hover:text-sky-400"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(c._id, c.title)} className="p-1.5 text-gray-400 hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-3 border-t border-gray-800">
                {c.brokers?.map((b) => (
                  <div key={b._id} className="flex items-center space-x-2 bg-gray-950 px-3 py-1.5 rounded-xl border border-gray-800">
                    <img src={b.logo} alt={b.name} className="w-5 h-5 object-cover rounded bg-white p-0.5" />
                    <span className="text-xs font-semibold text-white">{b.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6 space-y-5">
            <h3 className="text-lg font-bold text-white">{editId ? 'Edit Matchup' : 'Create Popular Comparison'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm"
                  placeholder="e.g. Zerodha vs Groww"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm"
                >
                  <option value="stock">Stock Brokers</option>
                  <option value="forex">Forex Brokers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Select Brokers (Choose 2 or 3)</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-950 rounded-xl border border-gray-800">
                  {brokers.map((b) => (
                    <label key={b._id} className="flex items-center space-x-2 text-xs text-gray-300 cursor-pointer p-1.5 hover:bg-gray-900 rounded">
                      <input
                        type="checkbox"
                        checked={formData.brokers.includes(b._id)}
                        onChange={() => handleBrokerCheckbox(b._id)}
                        className="rounded text-sky-600 bg-gray-900 border-gray-700"
                      />
                      <span>{b.name} ({b.brokerType})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white text-sm"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold">Save Matchup</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopularComparisons;
