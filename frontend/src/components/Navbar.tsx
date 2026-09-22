import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, LayoutDashboard, Sparkles, BarChart2, BookOpen, History, LogOut, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', icon: Sprout },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'recommend', label: 'Recommend', icon: Sparkles },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'explorer', label: 'Crop Explorer', icon: BookOpen },
    { id: 'history', label: 'History', icon: History }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavClick('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agri-500 to-agri-700 flex items-center justify-center text-white shadow-md shadow-agri-500/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-agri-800 via-agri-700 to-emerald-800 bg-clip-text text-transparent">
                SmartCrop AI
              </span>
              <span className="block text-[10px] font-semibold text-agri-600 tracking-wider uppercase">
                Advisory Platform
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-agri-50 text-agri-800 font-semibold shadow-xs border border-agri-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-agri-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile & Sign Out CTA */}
          <div className="hidden md:flex items-center space-x-3">
            {user && (
              <div className="flex items-center space-x-2 bg-slate-100/90 p-1.5 pl-3 rounded-full border border-slate-200">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-agri-500"
                />
                <div className="text-left">
                  <span className="block text-xs font-bold text-slate-800 leading-none">{user.name}</span>
                  <span className="block text-[10px] text-slate-500 leading-tight truncate max-w-[130px]">{user.email}</span>
                </div>
              </div>
            )}

            <button
              onClick={logout}
              className="flex items-center space-x-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-200 transition-all active:scale-95"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-agri-100 text-agri-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-agri-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 space-y-2 border-t border-slate-100">
            {user && (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-2">
                  <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
                  <div className="text-left">
                    <span className="block text-xs font-bold text-slate-900">{user.name}</span>
                    <span className="block text-[10px] text-slate-500">{user.email}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 bg-rose-600 text-white py-2.5 rounded-xl text-sm font-bold shadow-md"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
