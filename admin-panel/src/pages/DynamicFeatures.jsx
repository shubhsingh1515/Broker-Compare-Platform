import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Sliders, Trash2, Edit3, CheckCircle, HelpCircle } from 'lucide-react';

const DynamicFeatures = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    label: '',
    key: '',
    type: 'text',
    category: 'custom',
    isHighlighted: true,
    sortOrder: 0
  });

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const res = await api.get('/features');
      setFeatures(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (feat = null) => {
    if (feat) {
      setEditId(feat._id);
      setFormData(feat);
    } else {
      setEditId(null);
      setFormData({
        label: '',
        key: '',
        type: 'text',
        category: 'custom',
        isHighlighted: true,
        sortOrder: 0
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/features/${editId}`, formData);
      } else {
        await api.post('/features', formData);
      }
      setShowModal(false);
      fetchFeatures();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save dynamic feature');
    }
  };

  const handleDelete = async (id, label) => {
    if (window.confirm(`Delete dynamic feature "${label}"? This will also clear all assigned broker values.`)) {
      try {
        await api.delete(`/features/${id}`);
        fetchFeatures();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete feature');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dynamic Comparison Features</h1>
          <p className="text-sm text-gray-400">Create custom comparison fields dynamically without modifying code</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-sky-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Comparison Field</span>
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-950 text-gray-400 uppercase text-[11px] tracking-wider border-b border-gray-800">
            <tr>
              <th className="py-3.5 px-4">Field Label</th>
              <th className="py-3.5 px-4">Key Code</th>
              <th className="py-3.5 px-4">Data Type</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Highlighted</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {loading ? (
              <tr><td colSpan="6" className="text-center py-8 text-gray-500">Loading features...</td></tr>
            ) : features.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-8 text-gray-500">No dynamic features added yet.</td></tr>
            ) : (
              features.map((f) => (
                <tr key={f._id} className="hover:bg-gray-800/40">
                  <td className="py-4 px-4 font-semibold text-white">{f.label}</td>
                  <td className="py-4 px-4 font-mono text-xs text-sky-400">{f.key}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-800 text-gray-300 border border-gray-700 capitalize">
                      {f.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 capitalize text-xs text-gray-400">{f.category}</td>
                  <td className="py-4 px-4">
                    {f.isHighlighted ? (
                      <span className="text-xs text-emerald-400 font-semibold">Yes</span>
                    ) : (
                      <span className="text-xs text-gray-500">No</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(f)}
                      className="p-2 text-gray-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(f._id, f.label)}
                      className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 space-y-5">
            <h3 className="text-lg font-bold text-white">{editId ? 'Edit Feature' : 'Create Custom Comparison Field'}</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Field Label *</label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                  placeholder="e.g. AI Trading Support"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Key Code (Unique) *</label>
                <input
                  type="text"
                  required
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value.toLowerCase().replace(/[^a-z0-9_]+/g, '_') })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-sky-500"
                  placeholder="e.g. ai_trading_support"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Data Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                >
                  <option value="text">Text (e.g. "From 0.0 pips")</option>
                  <option value="boolean">Boolean (Yes / No Checkbox)</option>
                  <option value="number">Number (e.g. 50)</option>
                  <option value="rating">Rating (0 - 5 Stars)</option>
                  <option value="currency">Currency ($ / ₹)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="isHighlighted"
                  checked={formData.isHighlighted}
                  onChange={(e) => setFormData({ ...formData, isHighlighted: e.target.checked })}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 bg-gray-950 border-gray-800"
                />
                <label htmlFor="isHighlighted" className="text-sm font-medium text-gray-300 cursor-pointer">
                  Highlight in Comparison Table
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-sky-600/20"
                >
                  Save Feature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicFeatures;
