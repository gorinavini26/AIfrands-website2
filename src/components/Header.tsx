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
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 z-40 flex items-center justify-between px-4 sm:px-6 shadow-xs">
      {/* Left Area: Mobile Menu Toggle, Brand Badge & Search Pill */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        <button
          className="lg:hidden text-slate-700 p-2 hover:bg-slate-100 rounded-2xl transition-colors cursor-pointer"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open Mobile Navigation"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <Logo size="sm" showText={true} />
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
            Active
          </span>
        </div>

        <div className="relative max-w-xs sm:max-w-md w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search topics, assignments, tools..."
            className="block w-full pl-10 pr-8 py-2 border-2 border-slate-200 rounded-2xl bg-slate-50 text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-slate-800 placeholder-slate-400 transition-all shadow-2xs"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                onSearch('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Right Area: Streak Flame, AI Tutor Button, Notifications & User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak Pill & XP Badge */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 border-b-4 border-amber-300 rounded-2xl text-amber-900 font-extrabold text-xs shadow-xs cursor-default"
          title={`${profile.streakDays} Day Active Streak!`}
        >
          <span className="text-base animate-bounce-subtle">🔥</span>
          <span>{profile.streakDays}d Streak</span>
        </div>

        {/* AI Tutor Primary Button with 3D press-down */}
        <button
          onClick={onOpenAIAssistant}
          className="btn-3d btn-3d-indigo px-3.5 py-2 text-xs font-extrabold flex items-center gap-1.5"
          title="Open AI Tutor & Assistant"
        >
          <span className="material-symbols-outlined text-[18px]">
            auto_awesome
          </span>
          <span className="hidden md:inline">AI Tutor</span>
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-colors relative cursor-pointer"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[22px]">
            notifications
          </span>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white" />
          )}
        </button>

        <div className="h-6 w-px bg-slate-200/80 hidden sm:block" />

        {/* Login / User Status */}
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <div
              onClick={onOpenLogin}
              className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-xs shadow-xs border border-indigo-300 overflow-hidden">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile.name ? profile.name.slice(0, 2).toUpperCase() : 'CS'
                )}
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              title="Logout"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold text-indigo-700 bg-indigo-50 border-2 border-indigo-200 hover:bg-indigo-100 rounded-2xl transition-all cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">login</span>
            <span className="hidden sm:inline">Login</span>
          </button>
        )}
      </div>
    </header>
  );
};

