import React, { useState } from 'react';
import api from '../services/api';
import { Mail, User, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', msg: '' });
    try {
      const res = await api.post('/contacts', formData);
      setStatus({ type: 'success', msg: res.data.message || 'Thank you! Your message has been sent successfully.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to submit inquiry' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Contact Us</h1>
        <p className="text-sm text-gray-400">Have questions about broker fees or want your broker listed? Drop us a message!</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl space-y-6">
        {status.msg && (
          <div className={`p-4 rounded-2xl flex items-center space-x-3 text-sm font-semibold ${
            status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
          }`}>
            {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span>{status.msg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Your Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Subject *</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
              placeholder="Broker Review / Inquiry"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Message *</label>
            <textarea
              rows="5"
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-sky-500"
              placeholder="Write your query details here..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-sky-600/25 flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
          >
            <span>{submitting ? 'Sending Message...' : 'Send Message'}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
