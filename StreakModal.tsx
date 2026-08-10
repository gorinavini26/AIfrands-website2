import React from 'react';

interface StreakModalProps {
  days: number;
  onClose: () => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({ days, onClose }) => (
  <div className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-slate-950">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl">🔥</div>
            <h2 className="text-xl font-extrabold mt-2">{days}-day learning streak</h2>
            <p className="text-xs font-bold opacity-80 mt-1">Keep showing up every day.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-black/10" aria-label="Close streak details">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <h3 className="text-sm font-extrabold text-slate-900">How it works</h3>
          <ul className="mt-3 space-y-2 text-xs text-slate-600 font-medium leading-relaxed">
            <li>• Complete a meaningful learning activity each day.</li>
            <li>• Your streak counts consecutive active days.</li>
            <li>• Submitting an assignment or completing study activity can keep your streak active.</li>
            <li>• Missing a day can break the current streak, so aim for consistency rather than long sessions.</li>
          </ul>
        </div>
        <button onClick={onClose} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-extrabold">
          Got it — keep learning
        </button>
      </div>
    </div>
  </div>
);
