import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Star, Edit3, Trash2 } from 'lucide-react';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: 'Trader', content: '', rating: 5 });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get('/testimonials');
      setTestimonials(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (t = null) => {
    if (t) {
      setEditId(t._id);
      setFormData(t);
    } else {
      setEditId(null);
      setFormData({ name: '', role: 'Trader', content: '', rating: 5 });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/testimonials/${editId}`, formData);
      } else {
        await api.post('/testimonials', formData);
      }
      setShowModal(false);
      fetchTestimonials();
    } catch (err) {
      alert('Failed to save testimonial');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete testimonial?')) {
      try {
        await api.delete(`/testimonials/${id}`);
        fetchTestimonials();
      } catch (err) {
        alert('Failed to delete testimonial');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">User Reviews & Testimonials</h1>
          <p className="text-sm text-gray-400">Manage user feedback displayed on home page</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-sky-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center space-x-2">
          <Plus className="w-4 h-4" /><span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div key={t._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">{t.name}</h3>
                <span className="text-xs text-sky-400">{t.role}</span>
              </div>
              <div className="flex space-x-1">
                <button onClick={() => handleOpenModal(t)} className="p-1.5 text-gray-400 hover:text-sky-400"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(t._id)} className="p-1.5 text-gray-400 hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <p className="text-sm text-gray-300 italic">"{t.content}"</p>
            <div className="flex items-center space-x-1 text-amber-400">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">{editId ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">User Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Role / Designation</label>
                <input type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Review Content *</label>
                <textarea rows="3" required value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white text-sm"></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold">Save Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
