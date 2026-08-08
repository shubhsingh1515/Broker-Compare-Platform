import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Building2,
  Globe,
  TrendingUp,
  FileText,
  Mail,
  Users,
  GitCompare,
  Star,
  CheckCircle2,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { stats, latestBrokers, latestContacts, topBrokers } = data || {};

  const kpis = [
    { title: 'Total Brokers', value: stats?.totalBrokers || 0, icon: Building2, color: 'from-sky-500 to-blue-600' },
    { title: 'Active Stock Brokers', value: stats?.stockBrokers || 0, icon: TrendingUp, color: 'from-emerald-500 to-teal-600' },
    { title: 'Active Forex Brokers', value: stats?.forexBrokers || 0, icon: Globe, color: 'from-violet-500 to-purple-600' },
    { title: 'Blog Articles', value: stats?.totalBlogs || 0, icon: FileText, color: 'from-amber-500 to-orange-600' },
    { title: 'Unread Inquiries', value: stats?.unreadContacts || 0, icon: Mail, color: 'from-rose-500 to-pink-600' },
    { title: 'Newsletter Subscribers', value: stats?.totalSubscribers || 0, icon: Users, color: 'from-indigo-500 to-cyan-600' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Overview</h1>
        <p className="text-sm text-gray-400">Monitor broker comparisons, inquiries, and platform metrics</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 relative overflow-hidden group hover:border-gray-700 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{kpi.title}</span>
                  <span className="block text-3xl font-extrabold text-white mt-2">{kpi.value}</span>
                </div>
                <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${kpi.color} text-white shadow-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Latest Added Brokers */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-sky-400" />
              <span>Latest Added Brokers</span>
            </h2>
          </div>
          <div className="space-y-4">
            {latestBrokers?.map((broker) => (
              <div key={broker._id} className="flex items-center justify-between p-3 bg-gray-950/60 rounded-xl border border-gray-800/60">
                <div className="flex items-center space-x-3">
                  <img src={broker.logo} alt={broker.name} className="w-10 h-10 rounded-lg object-cover bg-white p-1" />
                  <div>
                    <h3 className="font-semibold text-white text-sm">{broker.name}</h3>
                    <span className="inline-block text-[11px] font-medium text-sky-400 uppercase tracking-wider">{broker.brokerType}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold text-white">{broker.overallRating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Rated Brokers */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Star className="w-5 h-5 text-amber-400" />
              <span>Top Rated Brokers</span>
            </h2>
          </div>
          <div className="space-y-4">
            {topBrokers?.map((broker) => (
              <div key={broker._id} className="flex items-center justify-between p-3 bg-gray-950/60 rounded-xl border border-gray-800/60">
                <div className="flex items-center space-x-3">
                  <img src={broker.logo} alt={broker.name} className="w-10 h-10 rounded-lg object-cover bg-white p-1" />
                  <div>
                    <h3 className="font-semibold text-white text-sm">{broker.name}</h3>
                    <span className="text-xs text-gray-400">{broker.country}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-bold text-emerald-400">{broker.trustScore}/100 Trust</span>
                  <span className="text-xs text-gray-400">Rating: {broker.overallRating} / 5</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Contact Inquiries */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Mail className="w-5 h-5 text-rose-400" />
            <span>Recent Customer Inquiries</span>
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-950 text-gray-400 uppercase text-[11px] tracking-wider border-b border-gray-800">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {latestContacts?.map((c) => (
                <tr key={c._id} className="hover:bg-gray-800/30">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white block">{c.name}</span>
                    <span className="text-xs text-gray-400">{c.email}</span>
                  </td>
                  <td className="py-3 px-4 font-medium">{c.subject}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      c.status === 'unread' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
