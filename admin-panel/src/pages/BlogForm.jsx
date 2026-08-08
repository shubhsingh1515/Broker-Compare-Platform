import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save } from 'lucide-react';

const BlogForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: 'Stock Trading',
    tags: 'stock, zerodha, groww',
    author: 'Broker Compare Team',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    isPublished: true
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      api.get(`/blogs/${id}`)
        .then((res) => {
          const b = res.data.data;
          setFormData({
            ...b,
            tags: Array.isArray(b.tags) ? b.tags.join(', ') : b.tags
          });
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(s => s.trim()).filter(Boolean) : formData.tags
      };

      if (isEdit) {
        await api.put(`/blogs/${id}`, payload);
      } else {
        await api.post('/blogs', payload);
      }
      navigate('/blogs');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save blog post');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading post...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/blogs')} className="p-2 text-gray-400 hover:text-white bg-gray-900 border border-gray-800 rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Article' : 'Write New Article'}</h1>
        </div>
        <button onClick={handleSubmit} disabled={submitting} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center space-x-2">
          <Save className="w-4 h-4" /><span>{submitting ? 'Publishing...' : 'Publish Article'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Title *</label>
            <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Category</label>
            <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Image Cover URL *</label>
            <input type="text" required value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Tags (Comma Separated)</label>
            <input type="text" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Summary *</label>
          <textarea rows="2" required value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-white text-sm"></textarea>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Article Body Content *</label>
          <textarea rows="12" required value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-white text-sm font-mono" placeholder="Write full article body here..."></textarea>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
