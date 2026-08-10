import React, { useState } from 'react';
import { Logo } from './Logo';

interface AuthViewProps {
  onAuthSuccess: (user: { name: string; email: string }) => void;
  onShowToast: (message: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess, onShowToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (val: string): boolean => {
    // Basic email format check: contains @ and a dot domain
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setErrorMsg('Please enter your name to get started.');
      return;
    }

    if (!trimmedEmail) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setErrorMsg('Please enter a valid email format (e.g., student@university.edu).');
      return;
    }

    setIsSubmitting(true);

    // Instant sign in without friction or email confirmation
    setTimeout(() => {
      onAuthSuccess({ name: trimmedName, email: trimmedEmail });
      onShowToast(`Welcome to AI Frands, ${trimmedName}! 🚀`);
      setIsSubmitting(false);
    }, 200);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-body-md select-none">
      {/* Playful Ambient Glowing Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Playful Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-xl relative z-10 space-y-6 text-center">
        
        {/* Brand Badge & Title */}
        <div className="space-y-3">
          <div className="flex justify-center pb-1">
            <div className="p-3 bg-indigo-600/20 rounded-2xl border border-indigo-500/30 shadow-inner inline-block">
              <Logo size="lg" showText={false} />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] font-black tracking-widest text-indigo-400 uppercase">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-extrabold text-sm">
              AI Frands
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span>CS LEARNING PORTAL</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            Welcome to AI Frands 👋
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
            Enter your name and email to start your interactive CS learning journey — no passwords required!
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 bg-red-950/90 border border-red-800/80 rounded-2xl text-red-200 text-xs font-semibold flex items-center gap-2 text-left shadow-sm animate-fadeIn">
            <span className="material-symbols-outlined text-red-400 text-base shrink-0">
              error
            </span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Simple Friction-Free Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {/* Field 1: Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-indigo-400 text-base">person</span>
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="e.g. Alex Rivera"
              className="w-full bg-slate-950/90 text-white placeholder-slate-500 text-sm font-semibold rounded-2xl p-3.5 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none transition-all shadow-inner"
              required
            />
          </div>

          {/* Field 2: Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-purple-400 text-base">mail</span>
              Your Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="e.g. alex@university.edu"
              className="w-full bg-slate-950/90 text-white placeholder-slate-500 text-sm font-semibold rounded-2xl p-3.5 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none transition-all shadow-inner"
              required
            />
          </div>

          {/* Chunky 3D Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 active:scale-[0.98] text-white font-extrabold text-base rounded-2xl shadow-xl shadow-indigo-500/25 border-b-4 border-purple-800 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>Start Learning</span>
              <span className="text-lg">🚀</span>
            </button>
          </div>
        </form>

        {/* Feature Highlights */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-4 text-[11px] text-slate-400 font-semibold">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-emerald-400 text-xs">bolt</span>
            <span>Instant Access</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-cyan-400 text-xs">lock_open</span>
            <span>No Passwords</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-purple-400 text-xs">sync</span>
            <span>Auto-Saved</span>
          </div>
        </div>

      </div>
    </div>
  );
};
