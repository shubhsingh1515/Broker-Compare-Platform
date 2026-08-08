import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import BrokerCard from '../components/BrokerCard';
import {
  Shield,
  Search,
  GitCompare,
  TrendingUp,
  Globe,
  Award,
  Zap,
  CheckCircle2,
  ArrowRight,
  Star,
  ChevronRight,
  Sparkles,
  Users
} from 'lucide-react';

const Home = () => {
  const [popularComparisons, setPopularComparisons] = useState([]);
  const [topBrokers, setTopBrokers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [popRes, brokerRes, blogRes, testRes, bannerRes] = await Promise.all([
        api.get('/popular-comparisons'),
        api.get('/brokers', { params: { limit: 6, featured: 'true' } }),
        api.get('/blogs', { params: { limit: 3 } }),
        api.get('/testimonials'),
        api.get('/banners?type=home')
      ]);

      setPopularComparisons(popRes.data.data || []);
      setTopBrokers(brokerRes.data.data || []);
      setBlogs(blogRes.data.data || []);
      setTestimonials(testRes.data.data || []);
      if (bannerRes.data.data && bannerRes.data.data.length > 0) {
        setBanner(bannerRes.data.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/brokers?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const categories = [
    { title: 'Stock Brokers', count: 'India SEBI', icon: TrendingUp, link: '/brokers?type=stock', color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400' },
    { title: 'Forex Brokers', count: 'Global FX', icon: Globe, link: '/brokers?type=forex', color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400' },
    { title: 'Best for Beginners', count: 'Low Deposit', icon: Award, link: '/brokers?tag=beginners', color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400' },
    { title: 'Best for Options', count: 'Fast Orders', icon: Zap, link: '/brokers?tag=options', color: 'from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-400' },
    { title: 'Best for Scalping', count: 'Raw Spreads', icon: Sparkles, link: '/brokers?tag=scalping', color: 'from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400' },
    { title: 'Best for Long Term', count: 'Zero AMC', icon: Shield, link: '/brokers?tag=long-term', color: 'from-cyan-500/20 to-teal-500/10 border-cyan-500/30 text-cyan-400' }
  ];

  return (
    <div className="space-y-24 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 lg:pt-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-600/20 to-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-900/90 border border-sky-500/30 text-sky-400 text-xs font-bold shadow-lg animate-bounce">
            <Sparkles className="w-4 h-4" />
            <span>Finology-Style Unbiased Side-by-Side Comparison Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Compare <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">Stock & Forex Brokers</span> Side-by-Side
          </h1>

          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Examine leverage, brokerage fees, MT4/MT5 platforms, SEBI & ASIC regulations, raw spreads, and hidden charges dynamically in one table.
          </p>

          {/* Hero Search Box */}
          <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3 p-2 bg-gray-900/90 border border-gray-800 rounded-3xl shadow-2xl backdrop-blur-xl">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Zerodha, Exness, Groww, Vantage, MT5..."
                className="w-full bg-transparent text-white placeholder-gray-500 pl-12 pr-4 py-3 text-sm focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-sky-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              <span>Search Brokers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            {categories.map((c, i) => {
              const Icon = c.icon;
              return (
                <Link
                  key={i}
                  to={c.link}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all hover:scale-105 ${c.color}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{c.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* POPULAR COMPARISONS MATCHUPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400 block mb-1">Top Requested Head-to-Head</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Popular Comparisons</h2>
          </div>
          <Link to="/compare" className="text-sky-400 hover:text-sky-300 font-bold text-sm flex items-center space-x-1">
            <span>View All Matchups</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {popularComparisons.map((item) => (
            <div key={item._id} className="bg-gray-900/90 border border-gray-800 hover:border-sky-500/50 rounded-3xl p-6 transition-all shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  {item.category} Matchup
                </span>
                <span className="text-xs text-gray-400 font-semibold">Side-by-Side</span>
              </div>

              {/* Matchup Brokers Logos */}
              <div className="flex items-center justify-around py-4 bg-gray-950/60 rounded-2xl border border-gray-800/80">
                {item.brokers?.map((b, bIdx) => (
                  <React.Fragment key={b._id || bIdx}>
                    <div className="flex flex-col items-center space-y-2">
                      <img src={b.logo} alt={b.name} className="w-14 h-14 rounded-2xl object-cover bg-white p-1.5 shadow-md" />
                      <span className="font-extrabold text-white text-sm">{b.name}</span>
                      <span className="text-[11px] text-amber-400 font-bold">★ {b.overallRating}</span>
                    </div>

                    {bIdx < item.brokers.length - 1 && (
                      <div className="w-10 h-10 rounded-full bg-sky-600/20 border border-sky-500/40 text-sky-400 font-black text-xs flex items-center justify-center shadow-lg">
                        VS
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-gray-400 max-w-sm line-clamp-1">{item.description}</p>
                <Link
                  to={`/compare?brokers=${item.brokers?.map(b => b.slug).join('-vs-')}`}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 flex items-center space-x-1 whitespace-nowrap"
                >
                  <span>Compare Now</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TOP RATED BROKERS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1">Empirically Verified</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Top Rated Stock & Forex Brokers</h2>
          </div>
          <Link to="/brokers" className="text-sky-400 hover:text-sky-300 font-bold text-sm flex items-center space-x-1">
            <span>Explore All Brokers</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topBrokers.map((broker) => (
            <BrokerCard key={broker._id} broker={broker} />
          ))}
        </div>
      </section>

      {/* PLATFORM TRUST & METRICS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-sky-950/40 border border-gray-800 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center relative z-10">
            <div>
              <span className="block text-4xl font-black text-white">50+</span>
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest mt-1 block">Brokers Indexed</span>
            </div>
            <div>
              <span className="block text-4xl font-black text-emerald-400">100%</span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest mt-1 block">Dynamic DB Powered</span>
            </div>
            <div>
              <span className="block text-4xl font-black text-amber-400">0.0</span>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest mt-1 block">Bias / Hardcoded Fee</span>
            </div>
            <div>
              <span className="block text-4xl font-black text-purple-400">24/7</span>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest mt-1 block">Realtime Comparison</span>
            </div>
          </div>
        </div>
      </section>

      {/* USER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400 block mb-1">Community Reviews</span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">What Traders Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div key={t._id} className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center space-x-1 text-amber-400">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-gray-300 text-sm italic leading-relaxed">"{t.content}"</p>
              <div className="pt-2 border-t border-gray-800/80">
                <span className="font-extrabold text-white text-sm block">{t.name}</span>
                <span className="text-xs text-sky-400 font-semibold">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST BLOG ARTICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400 block mb-1">Education & Guides</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Latest Articles</h2>
          </div>
          <Link to="/blogs" className="text-sky-400 hover:text-sky-300 font-bold text-sm flex items-center space-x-1">
            <span>Read All Guides</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <Link key={b._id} to={`/blog/${b.slug}`} className="bg-gray-900 border border-gray-800 hover:border-sky-500/50 rounded-3xl overflow-hidden shadow-xl transition-all group flex flex-col justify-between">
              <img src={b.image} alt={b.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
              <div className="p-6 space-y-3">
                <span className="text-[11px] font-extrabold text-sky-400 uppercase tracking-wider">{b.category}</span>
                <h3 className="font-extrabold text-white text-base group-hover:text-sky-300 transition-colors line-clamp-2">{b.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-2">{b.summary}</p>
                <div className="pt-2 text-[11px] text-gray-500">Published on {new Date(b.publishedAt).toLocaleDateString()}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
