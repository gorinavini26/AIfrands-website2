import React, { useState } from 'react';
import { Logo } from './Logo';

interface OnboardingViewProps {
  name: string;
  email: string;
  onComplete: (year: string, goal: string) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ name, email, onComplete }) => {
  const [year, setYear] = useState('Year 1');
  const [goal, setGoal] = useState('Build strong coding fundamentals');

  const goals = [
    'Build strong coding fundamentals',
    'Prepare for internships & placements',
    'Learn AI/ML and build projects',
    'Improve DSA & problem solving',
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-7 sm:p-9 text-white">
          <Logo size="md" showText={true} />
          <p className="mt-7 text-indigo-200 text-xs font-extrabold uppercase tracking-widest">First-time setup</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-2 tracking-tight">
            Welcome, {name.split(' ')[0]}! 👋
          </h1>
          <p className="text-indigo-100 mt-3 text-sm leading-relaxed max-w-xl">
            Let’s personalize AI Frands before taking you to your dashboard. You can change these choices later.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onComplete(year, goal);
          }}
          className="p-6 sm:p-9 space-y-7"
        >
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
              Your current year
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Year 1', 'Year 2', 'Year 3', 'Year 4'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setYear(option)}
                  className={`py-3 rounded-xl border-2 text-xs font-extrabold transition-all ${
                    year === option
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
              Main learning goal
            </label>
            <div className="space-y-2">
              {goals.map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    goal === option ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="goal"
                    value={option}
                    checked={goal === option}
                    onChange={(e) => setGoal(e.target.value)}
                    className="accent-indigo-600"
                  />
                  <span className="text-xs font-bold text-slate-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-slate-400 truncate">{email}</p>
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-extrabold text-sm shadow-lg shadow-indigo-600/20 transition-all"
            >
              Enter AI Frands →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
