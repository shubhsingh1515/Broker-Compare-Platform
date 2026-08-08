import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, FolderTree, Edit3, Trash2 } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', type: 'stock', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setEditId(cat._id);
      setFormData(cat);
    } else {
      setEditId(null);
      setFormData({ name: '', slug: '', type: 'stock', description: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/categories/${editId}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete category "${name}"?`)) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Category Management</h1>
          <p className="text-sm text-gray-400">Organize stock & forex comparison categories</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-950 text-gray-400 uppercase text-[11px] tracking-wider border-b border-gray-800">
            <tr>
              <th className="py-3.5 px-4">Category Name</th>
              <th className="py-3.5 px-4">Slug</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Description</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-8 text-gray-500">Loading...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8 text-gray-500">No categories found.</td></tr>
            ) : (
              categories.map((c) => (
                <tr key={c._id} className="hover:bg-gray-800/40">
                  <td className="py-4 px-4 font-semibold text-white">{c.name}</td>
                  <td className="py-4 px-4 text-xs font-mono text-sky-400">{c.slug}</td>
                  <td className="py-4 px-4 uppercase text-xs font-bold text-gray-300">{c.type}</td>
                  <td className="py-4 px-4 text-xs text-gray-400 max-w-xs truncate">{c.description}</td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <button onClick={() => handleOpenModal(c)} className="p-2 text-gray-400 hover:text-sky-400"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(c._id, c.name)} className="p-2 text-gray-400 hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 space-y-5">
            <h3 className="text-lg font-bold text-white">{editId ? 'Edit Category' : 'New Category'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm"
                >
                  <option value="stock">Stock</option>
                  <option value="forex">Forex</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white text-sm"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
