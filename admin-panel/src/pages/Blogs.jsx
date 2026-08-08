import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, FileText, Edit3, Trash2 } from 'lucide-react';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blogs');
      setBlogs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete blog post "${title}"?`)) {
      try {
        await api.delete(`/blogs/${id}`);
        fetchBlogs();
      } catch (err) {
        alert('Failed to delete blog post');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Blog Management</h1>
          <p className="text-sm text-gray-400">Publish educational trading guides and market comparisons</p>
        </div>
        <Link to="/blogs/new" className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center space-x-2 shadow-lg shadow-sky-600/20">
          <Plus className="w-4 h-4" /><span>Write Article</span>
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-950 text-gray-400 uppercase text-[11px] tracking-wider border-b border-gray-800">
            <tr>
              <th className="py-3.5 px-4">Article</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Author</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-8 text-gray-500">Loading blogs...</td></tr>
            ) : blogs.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8 text-gray-500">No blog posts found.</td></tr>
            ) : (
              blogs.map((b) => (
                <tr key={b._id} className="hover:bg-gray-800/40">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <img src={b.image} alt={b.title} className="w-12 h-10 rounded-lg object-cover bg-gray-800" />
                      <div>
                        <span className="font-semibold text-white block text-sm">{b.title}</span>
                        <span className="text-xs text-gray-400 max-w-md block truncate">{b.summary}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-sky-400">{b.category}</td>
                  <td className="py-4 px-4 text-xs text-gray-300">{b.author}</td>
                  <td className="py-4 px-4 text-xs text-gray-400">{new Date(b.publishedAt).toLocaleDateString()}</td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <Link to={`/blogs/edit/${b._id}`} className="p-2 text-gray-400 hover:text-sky-400 inline-block"><Edit3 className="w-4 h-4" /></Link>
                    <button onClick={() => handleDelete(b._id, b.title)} className="p-2 text-gray-400 hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Blogs;
