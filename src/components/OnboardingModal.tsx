import React, { useState } from 'react';
import { UserProfile } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  profile: UserProfile;
  onCompleteOnboarding: (updatedProfile: UserProfile, defaultSemester: number) => void;
  onShowToast?: (msg: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  profile,
  onCompleteOnboarding,
  onShowToast,
}) => {
  const initialYearNum = profile?.year?.includes('1') ? 1 : profile?.year?.includes('2') ? 2 : profile?.year?.includes('3') ? 3 : profile?.year?.includes('4') ? 4 : 2;
  const [selectedYear, setSelectedYear] = useState<number>(initialYearNum);
  const [selectedSemester, setSelectedSemester] = useState<number>(profile?.currentSemester || (initialYearNum * 2 - 1));
  const [interestTrack, setInterestTrack] = useState<string>('AI/ML');
  const [primaryGoal, setPrimaryGoal] = useState<string>('Labs & Exam GPA');
  const [favLanguage, setFavLanguage] = useState<string>('Python');

  if (!isOpen) return null;

  const handleYearChange = (yearNum: number) => {
    setSelectedYear(yearNum);
    setSelectedSemester(yearNum * 2 - 1);
  };

  // Derive dynamic recommended path based on quiz answers
  const getRecommendedPath = () => {
    if (interestTrack === 'AI/ML') return '🤖 AI & Machine Learning Specialization';
    if (interestTrack === 'Web Dev') return '💻 Full-Stack Web & Cloud Systems';
    if (interestTrack === 'Systems') return '⚙️ Operating Systems & Low-Level Architecture';
    return '⚡ Competitive Programming & Data Structures Track';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...(profile || {}),
      year: `Year ${selectedYear}`,
      currentSemester: selectedSemester,
      primaryLanguages: Array.from(new Set([favLanguage, ...(profile?.primaryLanguages || ['Python', 'C++'])])),
      onboardingCompleted: true,
      bio: `${getRecommendedPath()} Student • ${primaryGoal}`,
    } as UserProfile;

    onCompleteOnboarding(updated, selectedSemester);
    if (onShowToast) {
      onShowToast(`Quiz completed! Set roadmap default to Year ${selectedYear} • Semester ${selectedSemester} 🎯`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl border-4 border-indigo-600 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 text-slate-800 relative overflow-hidden my-8">
        {/* Background glow */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-100 text-indigo-900 font-extrabold text-xs uppercase tracking-wider border border-indigo-200">
            <span>🎓</span> CS Student Personalization Quiz
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tailor Your CS Learning Path
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Answer 4 quick questions so AI Frands can personalize your semester roadmap and recommended labs.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* Q1: ACADEMIC YEAR & SEMESTER */}
          <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              1. What is your current Year & Semester?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((y) => (
                <button
                  type="button"
                  key={y}
                  onClick={() => handleYearChange(y)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer border-2 ${
                    selectedYear === y
                      ? 'bg-indigo-600 text-white border-indigo-800 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Year {y}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {[selectedYear * 2 - 1, selectedYear * 2].map((sem) => (
                <button
                  type="button"
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer border-2 flex items-center justify-between ${
                    selectedSemester === sem
                      ? 'bg-purple-600 text-white border-purple-800 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>Semester {sem}</span>
                  <span className="material-symbols-outlined text-sm">
                    {selectedSemester === sem ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Q2: INTEREST TRACK */}
          <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              2. What topic interests you most?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'AI/ML', label: '🤖 AI, ML & LLMs' },
                { id: 'Web Dev', label: '💻 Web & Full-Stack' },
                { id: 'Systems', label: '⚙️ Systems & OS' },
                { id: 'Data', label: '⚡ DSA & Logic' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setInterestTrack(item.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all text-left cursor-pointer border-2 flex items-center justify-between ${
                    interestTrack === item.id
                      ? 'bg-indigo-600 text-white border-indigo-800 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="material-symbols-outlined text-sm">
                    {interestTrack === item.id ? 'check_circle' : 'circle'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Q3 & Q4: GOAL & FAV LANGUAGE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                3. Main Semester Goal
              </label>
              <select
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
                className="w-full bg-white border-2 border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Labs & Exam GPA">🌱 Ace Labs & GPA</option>
                <option value="Portfolio & Projects">🛠️ Build Portfolio Projects</option>
                <option value="Internship & Coding Prep">🚀 Internship & LeetCode Prep</option>
              </select>
            </div>

            <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                4. Primary Code Language
              </label>
              <select
                value={favLanguage}
                onChange={(e) => setFavLanguage(e.target.value)}
                className="w-full bg-white border-2 border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Python">🐍 Python</option>
                <option value="C++">⚙️ C++</option>
                <option value="Java">☕ Java</option>
                <option value="JavaScript">⚡ JavaScript / TypeScript</option>
              </select>
            </div>
          </div>

          {/* DYNAMIC RECOMMENDATION BOX */}
          <div className="p-4 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border-2 border-amber-400/80 rounded-2xl space-y-1 text-left">
            <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
              <span className="text-base">✨</span> Your Recommended Path
            </div>
            <p className="text-sm font-extrabold text-indigo-950">
              {getRecommendedPath()}
            </p>
            <p className="text-xs text-slate-600 font-medium">
              We'll set your default roadmap view to <strong>Year {selectedYear} • Semester {selectedSemester}</strong> with personalized checklists!
            </p>
          </div>

          <button
            type="submit"
            className="btn-3d btn-3d-amber w-full py-3.5 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl"
          >
            <span>Launch Year {selectedYear} • Semester {selectedSemester} Roadmap</span>
            <span className="material-symbols-outlined text-lg">rocket_launch</span>
          </button>
        </form>
      </div>
    </div>
  );
};
