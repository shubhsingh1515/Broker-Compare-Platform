import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, User, Calendar, Tag } from 'lucide-react';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/blogs/${slug}`);
      setBlog(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-24 text-center text-gray-500">Loading article...</div>;
  if (!blog) return <div className="p-24 text-center text-gray-500">Article not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <Link to="/blogs" className="inline-flex items-center space-x-2 text-xs font-bold text-sky-400 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Articles</span>
      </Link>

      <div className="space-y-4">
        <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20">
          {blog.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">{blog.title}</h1>
        
        <div className="flex items-center space-x-4 text-xs text-gray-400 pt-2 border-b border-gray-800 pb-4">
          <div className="flex items-center space-x-1.5"><User className="w-3.5 h-3.5 text-sky-400" /><span>{blog.author}</span></div>
          <span>•</span>
          <div className="flex items-center space-x-1.5"><Calendar className="w-3.5 h-3.5 text-sky-400" /><span>{new Date(blog.publishedAt).toLocaleDateString()}</span></div>
        </div>
      </div>

      <img src={blog.image} alt={blog.title} className="w-full h-80 sm:h-96 object-cover rounded-3xl border border-gray-800 shadow-2xl" />

      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-10 text-gray-200 text-sm leading-relaxed whitespace-pre-line">
        {blog.content}
      </div>
    </div>
  );
};

export default BlogDetail;
