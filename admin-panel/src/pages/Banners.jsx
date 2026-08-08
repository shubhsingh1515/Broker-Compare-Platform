import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Image, Edit3, Trash2 } from 'lucide-react';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ title: '', subtitle: '', image: '', link: '/compare', type: 'home' });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await api.get('/banners');
      setBanners(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (b = null) => {
    if (b) {
      setEditId(b._id);
      setFormData(b);
    } else {
      setEditId(null);
      setFormData({ title: '', subtitle: '', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80', link: '/compare', type: 'home' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/banners/${editId}`, formData);
      } else {
        await api.post('/banners', formData);
      }
      setShowModal(false);
      fetchBanners();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save banner');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete banner?')) {
      try {
        await api.delete(`/banners/${id}`);
        fetchBanners();
      } catch (err) {
        alert('Failed to delete banner');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Banner Management</h1>
          <p className="text-sm text-gray-400">Manage promotional hero banners & advertisement placements</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-sky-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center space-x-2">
          <Plus className="w-4 h-4" /><span>Add Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div key={b._id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between">
            <img src={b.image} alt={b.title} className="w-full h-40 object-cover" />
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-sky-400">{b.type} Banner</span>
                <div className="flex space-x-1">
                  <button onClick={() => handleOpenModal(b)} className="p-1.5 text-gray-400 hover:text-sky-400"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(b._id)} className="p-1.5 text-gray-400 hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <h3 className="font-bold text-white text-base">{b.title}</h3>
              <p className="text-xs text-gray-400">{b.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">{editId ? 'Edit Banner' : 'Create Banner'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Title *</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Subtitle</label>
                <input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Image URL *</label>
                <input type="text" required value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm" />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold">Save Banner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banners;
