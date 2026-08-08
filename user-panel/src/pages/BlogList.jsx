import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FileText, ChevronRight } from 'lucide-react';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blogs');
      setBlogs(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Trading Guides & Articles</h1>
        <p className="text-sm text-gray-400 mt-1">Independent analysis, fee comparisons, and strategy guides</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No articles published yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((b) => (
            <Link key={b._id} to={`/blog/${b.slug}`} className="bg-gray-900 border border-gray-800 hover:border-sky-500/50 rounded-3xl overflow-hidden shadow-xl transition-all group flex flex-col justify-between">
              <img src={b.image} alt={b.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
              <div className="p-6 space-y-3">
                <span className="text-[11px] font-extrabold text-sky-400 uppercase tracking-wider">{b.category}</span>
                <h3 className="font-extrabold text-white text-base group-hover:text-sky-300 transition-colors line-clamp-2">{b.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-2">{b.summary}</p>
                <div className="pt-2 text-[11px] text-gray-500 flex items-center justify-between border-t border-gray-800">
                  <span>{new Date(b.publishedAt).toLocaleDateString()}</span>
                  <span className="text-sky-400 font-semibold flex items-center">Read <ChevronRight className="w-3.5 h-3.5" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
