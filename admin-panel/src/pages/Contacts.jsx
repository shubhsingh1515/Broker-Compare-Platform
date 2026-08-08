import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Mail, CheckCircle, Trash2 } from 'lucide-react';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/contacts');
      setContacts(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'unread' ? 'read' : 'replied';
    try {
      await api.put(`/contacts/${id}`, { status: nextStatus });
      fetchContacts();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete message?')) {
      try {
        await api.delete(`/contacts/${id}`);
        fetchContacts();
      } catch (err) {
        alert('Failed to delete message');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Customer Inquiries</h1>
        <p className="text-sm text-gray-400">View and respond to messages submitted via contact form</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-950 text-gray-400 uppercase text-[11px] tracking-wider border-b border-gray-800">
            <tr>
              <th className="py-3.5 px-4">Name & Email</th>
              <th className="py-3.5 px-4">Subject</th>
              <th className="py-3.5 px-4">Message</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-8 text-gray-500">Loading inquiries...</td></tr>
            ) : contacts.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8 text-gray-500">No contact messages received.</td></tr>
            ) : (
              contacts.map((c) => (
                <tr key={c._id} className="hover:bg-gray-800/40">
                  <td className="py-4 px-4">
                    <span className="font-semibold text-white block">{c.name}</span>
                    <span className="text-xs text-gray-400">{c.email}</span>
                  </td>
                  <td className="py-4 px-4 font-medium text-white">{c.subject}</td>
                  <td className="py-4 px-4 text-xs text-gray-300 max-w-sm">{c.message}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleStatusToggle(c._id, c.status)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        c.status === 'unread'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : c.status === 'read'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {c.status}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button onClick={() => handleDelete(c._id)} className="p-2 text-gray-400 hover:text-rose-400">
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

export default Contacts;
