import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Download, Newspaper, Trash2 } from 'lucide-react';

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await api.get('/newsletter');
      setSubscribers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/newsletter/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `subscribers_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export subscribers CSV');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Unsubscribe this email?')) {
      try {
        await api.delete(`/newsletter/${id}`);
        fetchSubscribers();
      } catch (err) {
        alert('Failed to delete subscriber');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Newsletter Subscribers</h1>
          <p className="text-sm text-gray-400">Export subscriber list for marketing campaigns</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center space-x-2 shadow-lg shadow-emerald-600/20"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-950 text-gray-400 uppercase text-[11px] tracking-wider border-b border-gray-800">
            <tr>
              <th className="py-3.5 px-4">Email Address</th>
              <th className="py-3.5 px-4">Subscribed Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {loading ? (
              <tr><td colSpan="3" className="text-center py-8 text-gray-500">Loading subscribers...</td></tr>
            ) : subscribers.length === 0 ? (
              <tr><td colSpan="3" className="text-center py-8 text-gray-500">No subscribers found.</td></tr>
            ) : (
              subscribers.map((s) => (
                <tr key={s._id} className="hover:bg-gray-800/40">
                  <td className="py-4 px-4 font-semibold text-white">{s.email}</td>
                  <td className="py-4 px-4 text-xs text-gray-400">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-4 text-right">
                    <button onClick={() => handleDelete(s._id)} className="p-2 text-gray-400 hover:text-rose-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
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

export default Newsletter;
