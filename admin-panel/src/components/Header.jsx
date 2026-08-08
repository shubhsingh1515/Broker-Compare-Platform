import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, LogOut, User, Bell } from 'lucide-react';

const Header = ({ onOpenSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="flex items-center space-x-4">
        <button
          onClick={onOpenSidebar}
          className="p-2 text-gray-400 rounded-lg hover:bg-gray-800 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-white hidden sm:block">Control Center</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-gray-800/60 rounded-full border border-gray-700/50">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-medium text-gray-300">System Live</span>
        </div>

        <div className="flex items-center space-x-3 pl-4 border-l border-gray-800">
          <div className="text-right hidden sm:block">
            <span className="block text-sm font-semibold text-white">{user?.name || 'Administrator'}</span>
            <span className="block text-xs text-gray-400 capitalize">{user?.role || 'Superadmin'}</span>
          </div>

          <div className="w-9 h-9 rounded-full bg-sky-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {user?.name?.charAt(0) || 'A'}
          </div>

          <button
            onClick={logout}
            title="Logout"
            className="p-2 text-gray-400 rounded-lg hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
