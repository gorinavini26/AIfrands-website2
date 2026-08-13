import React from 'react';
import { UserProfile } from '../types';
import { Logo } from './Logo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: UserProfile;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onOpenLogin: () => void;
  onOpenContact: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  isMobileOpen,
  setIsMobileOpen,
  onOpenLogin,
  onOpenContact,
  isAuthenticated,
  onLogout,
}) => {
  // Exactly 5 main navigation items as requested
  const navItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: 'grid_view', badge: 'Home' },
    { id: 'code-quest', label: 'CODE QUEST', icon: 'sports_esports', badge: 'Game' },
    { id: 'roadmap', label: 'ROADMAP', icon: 'map', badge: 'Sem 3' },
    { id: 'ai-tools', label: 'AI TUTORS & TOOLS', icon: 'auto_awesome', badge: 'AI' },
    { id: 'languages', label: 'PRACTICE & STACK', icon: 'code_blocks', badge: 'Code' },
    { id: 'resources', label: 'NOTEBOOK LIBRARY', icon: 'menu_book', badge: 'Papers' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop with smooth fade */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-slate-900 text-slate-200 z-50 flex flex-col border-r border-slate-800 shadow-2xl lg:shadow-none transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800/80">
          <div
            className="cursor-pointer group hover:opacity-90 transition-opacity"
            onClick={() => handleNavClick('dashboard')}
          >
            <Logo size="md" />
          </div>

          <button
            className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800"
            onClick={() => setIsMobileOpen(false)}
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* 5 Main Navigation Items */}
        <nav className="flex-1 px-3.5 mt-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-1 text-[10px] font-extrabold text-slate-500 tracking-widest uppercase">
            Main Menu
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 min-h-[44px] rounded-2xl text-xs font-extrabold tracking-wide transition-all cursor-pointer text-left ${
                  isActive
                    ? 'btn-3d btn-3d-indigo w-full border-b-4 border-indigo-900 shadow-lg shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-slate-800/90 hover:text-white border-2 border-transparent hover:border-slate-700/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-amber-300 animate-bounce-subtle' : 'text-slate-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'bg-slate-800 text-slate-400 border border-slate-700/50'
                  }`}
                >
                  {item.badge}
                </span>
              </button>
            );
          })}

          {/* Contact Admin Link */}
          <div className="pt-4 border-t border-slate-800/80 mt-3">
            <button
              onClick={() => {
                onOpenContact();
                setIsMobileOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold rounded-xl text-emerald-400 hover:bg-emerald-950/40 transition-colors border border-emerald-900/50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                mail
              </span>
              <span>Contact Admin</span>
            </button>
          </div>
        </nav>

        {/* Student Profile Card at Bottom */}
        <div className="p-3.5 border-t border-slate-800/80">
          <div
            onClick={() => handleNavClick('settings')}
            className="bg-slate-800/80 hover:bg-slate-800 rounded-2xl p-3 border border-slate-700/60 cursor-pointer transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-xs shadow-xs border border-indigo-400/30 overflow-hidden">
                  {profile?.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profile?.name ? profile.name.slice(0, 2).toUpperCase() : 'CS'
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-extrabold text-slate-100 group-hover:text-indigo-300 transition-colors truncate max-w-[110px]">
                    {profile?.name || profile?.studentId || 'CS Scholar'}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-slate-400 font-bold">
                      {isAuthenticated ? 'Authenticated' : 'Student'}
                    </span>
                  </div>
                </div>
              </div>

              {isAuthenticated ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLogout();
                  }}
                  title="Logout"
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/60 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    logout
                  </span>
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenLogin();
                  }}
                  title="Login / Register"
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    login
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

