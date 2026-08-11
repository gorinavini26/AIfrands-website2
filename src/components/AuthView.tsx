import React, { useState } from 'react';
import { Logo } from './Logo';
import { saveSignupToFirestore } from '../services/userService';

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

  const handleSubmit = async (e: React.FormEvent) => {
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

    // Save signup record to Firestore 'signups' collection
    await saveSignupToFirestore(trimmedName, trimmedEmail);

    onAuthSuccess({ name: trimmedName, email: trimmedEmail });
    onShowToast(`Welcome to AI Frands, ${trimmedName}! 🚀`);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-y-auto font-body-md">
      {/* Playful Ambient Glowing Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 my-8 space-y-10">
        
        {/* BRAND HERO HEADER */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="flex justify-center pb-1">
            <div className="p-3 bg-indigo-600/20 rounded-2xl border border-indigo-500/30 shadow-inner inline-block">
              <Logo size="lg" showText={false} />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-black tracking-widest uppercase shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-extrabold">
              AI Frands
            </span>
            <span>• CS LEARNING PORTAL FOR YEAR 1–3</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Master Computer Science <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
              One Semester At A Time
            </span>
          </h1>

          {/* ONE-LINE VALUE PROPOSITION TAGLINE */}
          <p className="text-sm sm:text-base text-indigo-200/90 font-semibold max-w-xl mx-auto leading-relaxed border-l-2 border-amber-400 pl-3 text-left sm:text-center sm:border-l-0 sm:pl-0">
            "Your 4-year CS roadmap, AI-guided, one semester at a time."
          </p>

          {/* SOCIAL PROOF LINE */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-300 font-bold bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800/80 w-fit mx-auto">
            <div className="flex -space-x-2 overflow-hidden">
              <span className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white text-[10px] font-black flex items-center justify-center">AR</span>
              <span className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-gradient-to-tr from-emerald-500 to-teal-600 text-white text-[10px] font-black flex items-center justify-center">SK</span>
              <span className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-gradient-to-tr from-amber-500 to-orange-600 text-white text-[10px] font-black flex items-center justify-center">JM</span>
            </div>
            <span>⚡ Join <strong className="text-amber-300 font-extrabold">1,450+ students</strong> already on their CS journey</span>
          </div>
        </div>

        {/* HOW IT WORKS SECTION (3 Simple Steps) */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xs font-black uppercase tracking-widest text-indigo-400">Simple 3-Step Path</h2>
            <p className="text-lg font-extrabold text-white">How AI Frands Supercharges Your CS Journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-left relative overflow-hidden group hover:border-indigo-500/50 transition-all">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-black text-sm flex items-center justify-center">
                1
              </div>
              <h3 className="text-sm font-extrabold text-white">Personalized CS Quiz</h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Select your current year (Year 1–3) & interest track (AI, Web Dev, Systems, DSA) to customize your curriculum.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-left relative overflow-hidden group hover:border-purple-500/50 transition-all">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300 font-black text-sm flex items-center justify-center">
                2
              </div>
              <h3 className="text-sm font-extrabold text-white">Semester Roadmaps & Labs</h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Access curated topic checklists, lecture notes, lab assignments, and YouTube tutorials for your active semester.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-left relative overflow-hidden group hover:border-amber-500/50 transition-all">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 font-black text-sm flex items-center justify-center">
                3
              </div>
              <h3 className="text-sm font-extrabold text-white">Interactive Sandbox & Quests</h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Execute code in Python, C++, Java & Rust, complete Welcome Quests, earn XP badges, and build a portfolio.
              </p>
            </div>
          </div>
        </div>

        {/* SIGN-UP FORM CARD */}
        <div className="w-full max-w-md mx-auto bg-slate-900/90 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5 text-center relative">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">Start Your Free Journey 🚀</h2>
            <p className="text-xs text-slate-400 font-medium">No password required • Instant semester setup</p>
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 active:scale-[0.98] text-white font-extrabold text-base rounded-2xl shadow-xl shadow-indigo-500/25 border-b-4 border-purple-800 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>Get Started Now</span>
              <span className="text-lg">🚀</span>
            </button>
          </form>

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

        {/* TESTIMONIAL CARDS (Clearly marked as editable placeholders) */}
        <div className="space-y-3 pt-4">
          <div className="text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Student Feedback</span>
            <h3 className="text-sm font-extrabold text-slate-300">Loved By CS Undergrads</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-2 text-left relative">
              <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800/50">
                [Placeholder Testimonial]
              </span>
              <p className="text-xs text-slate-300 italic leading-relaxed pt-1">
                "AI Frands helped me breeze through Year 1 C++ & Data Structures without getting overwhelmed. The semester-by-semester roadmap is a game changer!"
              </p>
              <div className="flex items-center gap-2 pt-1">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
                  AM
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Alex M.</p>
                  <p className="text-[10px] text-slate-400">CS Year 2 Student • Stanford Cohort</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-2 text-left relative">
              <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800/50">
                [Placeholder Testimonial]
              </span>
              <p className="text-xs text-slate-300 italic leading-relaxed pt-1">
                "Having AI-guided module checklists and curated YouTube tutorials for Operating Systems made my Semester 4 exam prep practically effortless."
              </p>
              <div className="flex items-center gap-2 pt-1">
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center">
                  SR
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Samantha R.</p>
                  <p className="text-[10px] text-slate-400">BTech CS Year 3 • UIUC</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
