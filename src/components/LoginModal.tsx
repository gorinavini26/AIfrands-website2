import React, { useState } from 'react';
import { Logo } from './Logo';
import { saveSignupToFirestore } from '../services/userService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string, user: { name: string; email: string }) => void;
  onShowToast: (msg: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onShowToast,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState('');

  if (!isOpen) return null;

  const validateEmail = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setErrorMsg('Please enter your name.');
      return;
    }

    if (!trimmedEmail) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    // Save signup record to Firestore 'signups' collection
    await saveSignupToFirestore(trimmedName, trimmedEmail);

    onLoginSuccess('local_token', { name: trimmedName, email: trimmedEmail });
    onShowToast(`Welcome, ${trimmedName}! 🚀`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-center text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>

        <div className="space-y-2">
          <div className="flex justify-center pb-1">
            <Logo size="md" showText={false} />
          </div>

          <h2 className="text-xl text-white font-extrabold flex items-center justify-center gap-2">
            Welcome to AI Frands 👋
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto font-medium">
            Enter your details to switch accounts or resume learning.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/80 text-red-200 text-xs rounded-2xl border border-red-800 text-left font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          <div className="space-y-1">
            <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">
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
              className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs font-semibold rounded-xl p-3 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">
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
              className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs font-semibold rounded-xl p-3 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 mt-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-indigo-500/20 border-b-2 border-purple-800 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Let's Go</span>
            <span>🚀</span>
          </button>
        </form>

        <div className="pt-1 font-mono text-[10px] text-slate-500">
          Instant Session • Friction-Free
        </div>
      </div>
    </div>
  );
};
