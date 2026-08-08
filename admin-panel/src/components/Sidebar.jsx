import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Sliders,
  FolderTree,
  GitCompare,
  Image,
  FileText,
  HelpCircle,
  MessageSquareQuote,
  Mail,
  Newspaper,
  Shield,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Brokers', path: '/brokers', icon: Building2 },
    { name: 'Dynamic Features', path: '/features', icon: Sliders },
    { name: 'Categories', path: '/categories', icon: FolderTree },
    { name: 'Popular Comparisons', path: '/popular-comparisons', icon: GitCompare },
    { name: 'Banners', path: '/banners', icon: Image },
    { name: 'Blogs', path: '/blogs', icon: FileText },
    { name: 'FAQs', path: '/faqs', icon: HelpCircle },
    { name: 'Testimonials', path: '/testimonials', icon: MessageSquareQuote },
    { name: 'Contact Inquiries', path: '/contacts', icon: Mail },
    { name: 'Newsletter', path: '/newsletter', icon: Newspaper }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-gray-950 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">BrokerCompare</span>
              <span className="block text-[10px] text-sky-400 font-semibold tracking-widest uppercase">Admin Panel</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/25 font-semibold'
                      : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-100'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
