import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import api from '../services/api';
import {
  Shield,
  Search,
  GitCompare,
  TrendingUp,
  Globe,
  Star,
  Menu,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const Navbar = () => {
  const { selectedBrokers, removeFromCompare, clearCompare } = useCompare();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [compareDrawerOpen, setCompareDrawerOpen] = useState(false);

  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Instant live search debounced
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get(`/brokers/search?q=${encodeURIComponent(searchQuery)}`);
        setSuggestions(res.data.data || []);
        setShowDropdown(true);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside search listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (brokerSlug) => {
    setShowDropdown(false);
    setSearchQuery('');
    navigate(`/broker/${brokerSlug}`);
  };

  const navLinks = [
    { name: 'Stock Brokers', path: '/brokers?type=stock', icon: TrendingUp },
    { name: 'Forex Brokers', path: '/brokers?type=forex', icon: Globe },
    { name: 'Compare Table', path: '/compare', icon: GitCompare },
    { name: 'Blog Guides', path: '/blogs' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-gray-950/85 backdrop-blur-xl border-b border-gray-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2.5 bg-gradient-to-tr from-sky-600 to-sky-400 text-white rounded-2xl shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1">
                Broker<span className="text-sky-400">Compare</span>
              </span>
              <span className="block text-[10px] text-gray-400 font-semibold tracking-widest uppercase">Stock + Forex Comparison</span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div ref={searchRef} className="relative hidden md:block flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                placeholder="Search Zerodha, Exness, Groww, Forex, SEBI..."
                className="w-full bg-gray-900/90 border border-gray-800 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
              />
              {isSearching && (
                <div className="absolute right-3.5 top-3.5 w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>

            {/* Auto Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-gray-800">
                <div className="p-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-950/60 px-4">
                  Matching Brokers ({suggestions.length})
                </div>
                {suggestions.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => handleSelectSuggestion(item.slug)}
                    className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-800/60 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={item.logo} alt={item.name} className="w-8 h-8 rounded-lg object-cover bg-white p-0.5" />
                      <div>
                        <span className="font-bold text-white text-sm block">{item.name}</span>
                        <span className="text-xs text-gray-400 uppercase">{item.brokerType} • {item.country}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{item.overallRating}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'text-gray-300 hover:text-white hover:bg-gray-800/40'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Compare Counter Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCompareDrawerOpen(true)}
              className="relative flex items-center space-x-2 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-sky-600/25 transition-all"
            >
              <GitCompare className="w-4 h-4" />
              <span className="hidden sm:inline">Compare</span>
              {selectedBrokers.length > 0 && (
                <span className="w-5 h-5 bg-white text-sky-900 rounded-full text-[11px] font-extrabold flex items-center justify-center animate-pulse">
                  {selectedBrokers.length}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white lg:hidden rounded-xl bg-gray-900 border border-gray-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-gray-900 border-b border-gray-800 p-4 space-y-3">
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brokers..."
                className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500"
              />
            </div>

            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* Floating Compare Drawer Modal */}
      {compareDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-md bg-gray-900 h-full p-6 flex flex-col justify-between border-l border-gray-800 shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                <div className="flex items-center space-x-2">
                  <GitCompare className="w-5 h-5 text-sky-400" />
                  <h3 className="text-lg font-bold text-white">Compare Tray ({selectedBrokers.length}/3)</h3>
                </div>
                <button onClick={() => setCompareDrawerOpen(false)} className="p-1.5 text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedBrokers.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <Sparkles className="w-12 h-12 text-gray-600 mx-auto" />
                  <p className="text-sm text-gray-400">Your compare tray is empty.</p>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">Browse brokers and click "Add to Compare" to compare up to 3 brokers side by side!</p>
                </div>
              ) : (
                <div className="space-y-4 py-6">
                  {selectedBrokers.map((b) => (
                    <div key={b._id} className="flex items-center justify-between bg-gray-950 p-4 rounded-2xl border border-gray-800">
                      <div className="flex items-center space-x-3">
                        <img src={b.logo} alt={b.name} className="w-10 h-10 rounded-xl object-cover bg-white p-1" />
                        <div>
                          <h4 className="font-bold text-white text-sm">{b.name}</h4>
                          <span className="text-xs text-sky-400 uppercase">{b.brokerType} • {b.overallRating} ★</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCompare(b._id)}
                        className="p-1.5 text-gray-500 hover:text-rose-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedBrokers.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-gray-800">
                <button
                  onClick={() => {
                    setCompareDrawerOpen(false);
                    const slugs = selectedBrokers.map(b => b.slug).join('-vs-');
                    navigate(`/compare?brokers=${slugs}`);
                  }}
                  className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-sky-600/25 flex items-center justify-center space-x-2 text-sm"
                >
                  <span>Launch Side-by-Side Comparison</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={clearCompare}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2.5 px-4 rounded-xl text-xs"
                >
                  Clear All Selection
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
