import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, HelpCircle, Edit3, Trash2 } from 'lucide-react';

const FAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ question: '', answer: '', category: 'General' });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const res = await api.get('/faqs');
      setFaqs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (f = null) => {
    if (f) {
      setEditId(f._id);
      setFormData(f);
    } else {
      setEditId(null);
      setFormData({ question: '', answer: '', category: 'General' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/faqs/${editId}`, formData);
      } else {
        await api.post('/faqs', formData);
      }
      setShowModal(false);
      fetchFAQs();
    } catch (err) {
      alert('Failed to save FAQ');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete FAQ?')) {
      try {
        await api.delete(`/faqs/${id}`);
        fetchFAQs();
      } catch (err) {
        alert('Failed to delete FAQ');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">FAQ Management</h1>
          <p className="text-sm text-gray-400">Frequently asked questions and support guides</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-sky-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center space-x-2">
          <Plus className="w-4 h-4" /><span>Add FAQ</span>
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((f) => (
          <div key={f._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-start justify-between">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-sky-400 uppercase">{f.category}</span>
              <h3 className="text-base font-bold text-white">{f.question}</h3>
              <p className="text-sm text-gray-300">{f.answer}</p>
            </div>
            <div className="flex space-x-1 pl-4">
              <button onClick={() => handleOpenModal(f)} className="p-1.5 text-gray-400 hover:text-sky-400"><Edit3 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(f._id)} className="p-1.5 text-gray-400 hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">{editId ? 'Edit FAQ' : 'Add FAQ'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Question *</label>
                <input type="text" required value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Answer *</label>
                <textarea rows="4" required value={formData.answer} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white text-sm"></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold">Save FAQ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQs;
