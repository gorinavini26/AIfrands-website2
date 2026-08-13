import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Logo } from './Logo';

interface HeaderProps {
  profile: UserProfile;
  setIsMobileOpen: (open: boolean) => void;
  onOpenLogin: () => void;
  onOpenAIAssistant: () => void;
  onOpenContact: () => void;
  onSearch: (term: string) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  setIsMobileOpen,
  onOpenLogin,
  onOpenAIAssistant,
  onOpenContact,
  onSearch,
  unreadCount,
  onOpenNotifications,
  isAuthenticated,
  onLogout,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 z-40 flex items-center justify-between px-2.5 sm:px-6 shadow-xs">
      {/* Left Area: Mobile Menu Toggle, Brand Badge & Search Pill */}
      <div className="flex items-center gap-1.5 sm:gap-4 flex-1 min-w-0">
        <button
          className="lg:hidden text-slate-700 dark:text-slate-200 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open Mobile Navigation"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <Logo size="sm" showText={true} />
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
            Active
          </span>
        </div>

        {/* Search Bar with Mobile Toggle */}
        <div className="relative flex-1 max-w-[180px] xs:max-w-[220px] sm:max-w-md w-full">
          <span className="material-symbols-outlined absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="block w-full pl-8 sm:pl-10 pr-7 sm:pr-8 py-1.5 sm:py-2 border-2 border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-all shadow-2xs"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                onSearch('');
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full min-h-[32px] min-w-[32px] flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Right Area: Streak Flame, AI Tutor Button, Notifications & User */}
      <div className="flex items-center gap-1 sm:gap-2.5 shrink-0 ml-1">
        {/* Streak Pill & XP Badge */}
        <div
          className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-amber-100 dark:bg-amber-950/80 border-b-2 sm:border-b-4 border-amber-300 dark:border-amber-700 rounded-xl sm:rounded-2xl text-amber-900 dark:text-amber-200 font-extrabold text-[11px] sm:text-xs shadow-xs cursor-default shrink-0"
          title={`${profile?.streakDays || 0} Day Active Streak!`}
        >
          <span className="text-xs sm:text-base animate-bounce-subtle">🔥</span>
          <span className="hidden xs:inline">{profile?.streakDays || 0}d</span>
        </div>

        {/* AI Tutor Primary Button with 3D press-down */}
        <button
          onClick={onOpenAIAssistant}
          className="btn-3d btn-3d-indigo px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-extrabold flex items-center gap-1 sm:gap-1.5 min-h-[40px] sm:min-h-[44px]"
          title="Open AI Tutor & Assistant"
        >
          <span className="material-symbols-outlined text-[18px]">
            auto_awesome
          </span>
          <span className="hidden sm:inline">AI Tutor</span>
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors relative cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[20px] sm:text-[22px]">
            notifications
          </span>
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          )}
        </button>

        {/* Site-Wide Dark Mode Toggle Button */}
        {onToggleDarkMode && (
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-slate-600 dark:text-amber-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all cursor-pointer flex items-center justify-center min-h-[44px] min-w-[44px]"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span className="material-symbols-outlined text-[20px] sm:text-[22px]">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        )}

        <div className="h-6 w-px bg-slate-200/80 dark:bg-slate-800 hidden sm:block" />

        {/* Login / User Status */}
        {isAuthenticated ? (
          <div className="flex items-center gap-1 sm:gap-2">
            <div
              onClick={onOpenLogin}
              className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-extrabold text-[11px] sm:text-xs shadow-xs border border-indigo-300 overflow-hidden shrink-0">
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
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-xl transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Logout"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-extrabold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 border-2 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-2xl transition-all cursor-pointer shadow-2xs min-h-[40px] shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">login</span>
            <span className="hidden sm:inline">Login</span>
          </button>
        )}
      </div>
    </header>
  );
};

