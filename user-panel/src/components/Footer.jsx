import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Shield, Send, CheckCircle2, Heart } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setStatus('');
    try {
      const res = await api.post('/newsletter/subscribe', { email });
      setStatus(res.data.message || 'Subscribed successfully!');
      setEmail('');
    } catch (err) {
      setStatus(err.response?.data?.message || 'Subscription failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-gray-950 border-t border-gray-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800/60">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-2.5 bg-sky-600 text-white rounded-2xl shadow-lg shadow-sky-600/25">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Broker<span className="text-sky-400">Compare</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              The ultimate side-by-side comparison engine for Stock Brokers and Forex Brokers. Check leverage, spreads, regulations, hidden charges, and dynamic scores dynamically.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <span className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Subscribe for Weekly FX & Stock Fee Reports</span>
              <form onSubmit={handleSubscribe} className="flex max-w-md">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-gray-900 border border-gray-800 rounded-l-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 flex-1"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2.5 rounded-r-xl font-bold text-xs shadow-lg flex items-center space-x-1 disabled:opacity-50"
                >
                  <span>{submitting ? '...' : 'Subscribe'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              {status && <p className="text-[11px] text-emerald-400 font-semibold mt-2">{status}</p>}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Stock Brokers</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link to="/broker/zerodha" className="hover:text-white transition-colors">Zerodha Review</Link></li>
              <li><Link to="/broker/angel-one" className="hover:text-white transition-colors">Angel One Review</Link></li>
              <li><Link to="/broker/groww" className="hover:text-white transition-colors">Groww Review</Link></li>
              <li><Link to="/broker/mstock" className="hover:text-white transition-colors">m.Stock Review</Link></li>
              <li><Link to="/broker/fyers" className="hover:text-white transition-colors">FYERS Review</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Forex Brokers</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link to="/broker/exness" className="hover:text-white transition-colors">Exness FX</Link></li>
              <li><Link to="/broker/vt-markets" className="hover:text-white transition-colors">VT Markets</Link></li>
              <li><Link to="/broker/vantage" className="hover:text-white transition-colors">Vantage Markets</Link></li>
              <li><Link to="/broker/startrader" className="hover:text-white transition-colors">StarTrader</Link></li>
              <li><Link to="/broker/ec-markets" className="hover:text-white transition-colors">EC Markets</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link to="/compare" className="hover:text-white transition-colors">Side-by-Side Comparison</Link></li>
              <li><Link to="/blogs" className="hover:text-white transition-colors">Blog & Guides</Link></li>
              <li><Link to="/faqs" className="hover:text-white transition-colors">FAQs & Support</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Risk Disclaimer */}
        <div className="pt-8 text-center space-y-3">
          <p className="text-[11px] text-gray-400 leading-relaxed max-w-4xl mx-auto">
            Risk Disclaimer: Trading stock equity options, futures, CFDs, and leveraged forex currency pairs involves high market risk. Ensure you thoroughly understand the fee structures and regulations (SEBI, ASIC, FCA, CySEC) before trading.
          </p>
          <div className="text-xs text-gray-400 font-medium">
            © {new Date().getFullYear()} BrokerCompare Platform. All rights reserved. Dynamic comparison data powered by MongoDB.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
