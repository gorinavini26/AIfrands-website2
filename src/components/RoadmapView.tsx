import React, { useState } from 'react';
import { RoadmapModule } from '../types';

interface RoadmapViewProps {
  roadmapModules: RoadmapModule[];
  onToggleTopicCheck: (moduleId: string, topicIndex: number) => void;
  onMarkModuleComplete: (moduleId: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenAIAssistant: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmapModules,
  onToggleTopicCheck,
  onMarkModuleComplete,
  onNavigateTab,
  onOpenAIAssistant,
}) => {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [activeModalModule, setActiveModalModule] = useState<RoadmapModule | null>(null);

  // Compute Overall Progress
  const totalModules = roadmapModules.length;
  const completedModules = roadmapModules.filter((m) => m.status === 'completed').length;
  const inProgressModules = roadmapModules.filter((m) => m.status === 'in_progress').length;
  const lockedModules = roadmapModules.filter((m) => m.status === 'locked').length;

  const avgProgress = totalModules
    ? Math.round(roadmapModules.reduce((acc, curr) => acc + curr.progress, 0) / totalModules)
    : 55;

  // Year Progress calculation
  const getYearAvg = (yearNum: number) => {
    const mods = roadmapModules.filter((m) => m.year === yearNum);
    if (!mods.length) return 0;
    return Math.round(mods.reduce((acc, m) => acc + m.progress, 0) / mods.length);
  };

  const year1Avg = getYearAvg(1);
  const year2Avg = getYearAvg(2);
  const year3Avg = getYearAvg(3);
  const year4Avg = getYearAvg(4);

  // Filter Modules
  const filteredModules = roadmapModules.filter((mod) => {
    const matchesYear = selectedYear === 'all' || mod.year === selectedYear;
    const matchesCat = selectedCategory === 'All' || mod.category === selectedCategory;
    return matchesYear && matchesCat;
  });

  const categories = ['All', 'Core Module', 'Elective', 'Project'];

  // Current active modal module updated reference
  const modalModule = activeModalModule
    ? roadmapModules.find((m) => m.id === activeModalModule.id) || activeModalModule
    : null;

  return (
    <div className="flex flex-col w-full text-slate-800 bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-slate-100 min-h-screen p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        
        {/* HERO BANNER - EMERALD / TEAL ACCENT */}
        <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-teal-900/25 border-b-4 border-teal-950 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-sm border-b-2 border-emerald-600">
              <span>🗺️</span> 4-Year BTech Curriculum Path
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Degree Progression & Semester Milestones
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed">
              Track your 8-semester CS curriculum roadmap with dynamic topic checklists, completion status, and curated learning videos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <button
              onClick={onOpenAIAssistant}
              className="btn-3d btn-3d-amber py-3.5 px-6 text-slate-950 font-extrabold text-sm flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              <span>Ask AI Tutor for Guidance</span>
            </button>
          </div>
        </div>

        {/* YEAR 1 & 2 ROADMAP PROMPT CARD */}
        {(selectedYear === 1 || selectedYear === 2 || selectedYear === 'all') && (
          <div className="bg-gradient-to-r from-amber-500/10 via-indigo-600/10 to-purple-600/10 border-2 border-amber-400/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 text-[11px] font-black uppercase tracking-wider">
                  🧭 Not sure where to start on this roadmap?
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  Focus on your Active Semester modules first!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  We recommend starting with <strong>Intro to CS / C++</strong> or <strong>Data Structures</strong>. Click any module card to check off completed topic units!
                </p>
              </div>

              <button
                onClick={onOpenAIAssistant}
                className="btn-3d btn-3d-amber px-4 py-2.5 text-slate-950 text-xs font-extrabold shrink-0 flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">auto_awesome</span>
                <span>Get Step-by-Step AI Advice</span>
              </button>
            </div>
          </div>
        )}

        {/* DEGREE STAGE CIRCULAR PROCESS & MILESTONES */}
        <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest">// Process Architecture</span>
              <h2 className="text-lg font-extrabold text-slate-900">Academic Year Stages</h2>
            </div>

            {/* Stage Filter Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl text-xs font-extrabold">
              {['all', 1, 2, 3, 4].map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y as number | 'all')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    selectedYear === y
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {y === 'all' ? 'All Years' : `Year ${y}`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Circular Progress Diagram */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border-2 border-slate-200/80">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-slate-200"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - avgProgress / 100)}
                    strokeLinecap="round"
                    className="text-indigo-600 transition-all duration-1000 ease-out"
                    fill="transparent"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-extrabold text-slate-900">{avgProgress}%</span>
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Overall Degree</span>
                  <span className="text-[10px] font-extrabold text-indigo-600 mt-0.5">Sem 3 Active</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 w-full text-center text-xs border-t border-slate-200 pt-3">
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Passed</p>
                  <p className="font-extrabold text-emerald-600 text-sm">{completedModules}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Active</p>
                  <p className="font-extrabold text-indigo-600 text-sm">{inProgressModules}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Locked</p>
                  <p className="font-extrabold text-slate-500 text-sm">{lockedModules}</p>
                </div>
              </div>
            </div>

            {/* 4 Stage Process Steps */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Stage 1 */}
              <div
                onClick={() => setSelectedYear(1)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedYear === 1
                    ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200/90'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-xs">
                      Y1
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xs text-slate-900">Year 1: Fundamentals</h3>
                      <p className="text-[10px] text-slate-500 font-bold">Semesters 1 & 2</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-extrabold uppercase">
                    {year1Avg}% Done
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                  <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${year1Avg}%` }} />
                </div>
              </div>

              {/* Stage 2 */}
              <div
                onClick={() => setSelectedYear(2)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedYear === 2
                    ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200/90'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xs">
                      Y2
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xs text-slate-900">Year 2: Core CS</h3>
                      <p className="text-[10px] text-indigo-600 font-extrabold">Semesters 3 & 4 (Active)</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-[10px] font-extrabold uppercase">
                    {year2Avg}% Active
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                  <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${year2Avg}%` }} />
                </div>
              </div>

              {/* Stage 3 */}
              <div
                onClick={() => setSelectedYear(3)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedYear === 3
                    ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200/90'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-extrabold text-xs">
                      Y3
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xs text-slate-900">Year 3: Specialization</h3>
                      <p className="text-[10px] text-slate-500 font-bold">Semesters 5 & 6</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-extrabold uppercase">
                    {year3Avg}% Upcoming
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                  <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${year3Avg}%` }} />
                </div>
              </div>

              {/* Stage 4 */}
              <div
                onClick={() => setSelectedYear(4)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedYear === 4
                    ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200/90'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-extrabold text-xs">
                      Y4
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xs text-slate-900">Year 4: Capstone & Career</h3>
                      <p className="text-[10px] text-slate-500 font-bold">Semesters 7 & 8</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-extrabold uppercase">
                    {year4Avg}% Locked
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                  <div className="bg-slate-400 h-full rounded-full transition-all" style={{ width: `${year4Avg}%` }} />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* SEMESTER MODULES DIRECTORY */}
        <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest">// Course Modules</span>
              <h2 className="text-lg font-extrabold text-slate-900">Semester Modules Directory</h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Module Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredModules.map((mod, idx) => {
              const isExpanded = expandedModuleId === mod.id;
              const isCompleted = mod.status === 'completed';
              const isInProgress = mod.status === 'in_progress';
              const completedTopicsCount = mod.topics.filter((t) => t.completed).length;
              const totalTopicsCount = mod.topics.length;
              const allTopicsChecked = totalTopicsCount > 0 && completedTopicsCount === totalTopicsCount;

              // Subject visual accent color rules
              let borderAccent = 'border-t-6 border-t-indigo-500 shadow-indigo-500/10';
              if (mod.title.toLowerCase().includes('math') || mod.category.toLowerCase().includes('elective')) {
                borderAccent = 'border-t-6 border-t-purple-500 shadow-purple-500/10';
              } else if (mod.title.toLowerCase().includes('structure') || mod.title.toLowerCase().includes('algorithm')) {
                borderAccent = 'border-t-6 border-t-emerald-500 shadow-emerald-500/10';
              } else if (mod.title.toLowerCase().includes('ai') || mod.title.toLowerCase().includes('intelligence') || mod.title.toLowerCase().includes('web')) {
                borderAccent = 'border-t-6 border-t-amber-500 shadow-amber-500/10';
              } else if (mod.category.toLowerCase().includes('project')) {
                borderAccent = 'border-t-6 border-t-rose-500 shadow-rose-500/10';
              }

              return (
                <div
                  key={mod.id}
                  onClick={() => setActiveModalModule(mod)}
                  className={`card-3d p-5 sm:p-6 transition-all flex flex-col justify-between space-y-4 group cursor-pointer ${borderAccent}`}
                >
                  <div>
                    {/* Header Tags */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200 font-extrabold text-[10px] uppercase tracking-wider">
                        {mod.semesters}
                      </span>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 shadow-xs ${
                          isCompleted
                            ? 'bg-indigo-600 text-white'
                            : isInProgress
                            ? 'bg-emerald-500 text-white animate-bounce-subtle'
                            : 'bg-slate-700 text-slate-200'
                        }`}
                      >
                        {isCompleted ? 'Passed ✅' : isInProgress ? 'Active ⚡' : 'Locked 🔒'}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                      <span>{mod.title}</span>
                      <span className="material-symbols-outlined text-slate-400 group-hover:text-indigo-600 transition-colors text-xl">
                        open_in_full
                      </span>
                    </h3>
                    
                    <div className="flex items-center justify-between gap-2 mt-1 flex-wrap">
                      <p className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">
                        Year {mod.year} • {mod.category}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800/80 px-2 py-0.5 rounded-lg shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        <span>🔥 {105 + ((idx * 43) % 95)} working on this module</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed">
                      {mod.description}
                    </p>

                    {/* Progress Bar & Real-time Percentage */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-extrabold">
                        <span className="text-slate-500">Topics Completion</span>
                        <span className="text-indigo-700">{mod.progress}% ({completedTopicsCount}/{totalTopicsCount})</span>
                      </div>
                      <div className="w-full bg-slate-200/90 h-3 rounded-full overflow-hidden border border-slate-300/50 shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isCompleted ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400'
                          }`}
                          style={{ width: `${mod.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* DYNAMIC TOPICS CHECKLIST SECTION */}
                  <div className="border-t border-slate-200/80 pt-3 space-y-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                        className="py-1.5 px-3 bg-white hover:bg-indigo-50 text-indigo-700 border border-slate-200 hover:border-indigo-300 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <span className="material-symbols-outlined text-base">checklist</span>
                        <span>{isExpanded ? 'Hide Checklist' : `Checklist (${completedTopicsCount}/${totalTopicsCount})`}</span>
                        <span className="material-symbols-outlined text-sm">
                          {isExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>

                      {/* Quick Resource Preview Badge */}
                      {mod.resources && mod.resources.length > 0 && (
                        <button
                          onClick={() => setActiveModalModule(mod)}
                          className="text-[10px] font-extrabold text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm text-red-500">play_circle</span>
                          <span>{mod.resources.length} Free Resources</span>
                        </button>
                      )}
                    </div>

                    {/* Expandable Checklist inline on card */}
                    {isExpanded && (
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 space-y-2.5 shadow-2xs">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                          Click to toggle status:
                        </p>
                        {mod.topics.map((t, topicIdx) => {
                          const ytQuery = encodeURIComponent(`${t.name} tutorial`);
                          const ytUrl = `https://www.youtube.com/results?search_query=${ytQuery}`;

                          return (
                            <div
                              key={topicIdx}
                              onClick={() => onToggleTopicCheck(mod.id, topicIdx)}
                              className={`flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer border gap-2 ${
                                t.completed
                                  ? 'bg-emerald-50/80 border-emerald-200 text-slate-900'
                                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all ${
                                    t.completed
                                      ? 'bg-emerald-500 text-white shadow-2xs'
                                      : 'border-2 border-slate-300 bg-white'
                                  }`}
                                >
                                  {t.completed && <span className="material-symbols-outlined text-sm font-black">check</span>}
                                </div>
                                <span className={`text-xs truncate ${t.completed ? 'line-through text-slate-500 font-bold' : 'font-extrabold text-slate-800'}`}>
                                  {t.name}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                                <a
                                  href={ytUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="py-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg text-[10px] font-extrabold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                                  title={`Watch "${t.name}" tutorial on YouTube`}
                                >
                                  <span className="material-symbols-outlined text-xs">play_circle</span>
                                  <span>Watch Tutorial</span>
                                </a>

                                <span
                                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                    t.completed
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {t.completed ? 'Done' : 'Pending'}
                                </span>
                              </div>
                            </div>
                          );
                        })}

                        {/* "Mark Module as Complete" Button */}
                        <div className="pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            disabled={!allTopicsChecked}
                            onClick={() => onMarkModuleComplete(mod.id)}
                            className={`w-full py-2 px-3 rounded-xl text-xs font-extrabold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                              allTopicsChecked
                                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-b-2 border-amber-600 active:translate-y-0.5 cursor-pointer'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                            }`}
                          >
                            <span className="material-symbols-outlined text-base">
                              {allTopicsChecked ? 'verified' : 'lock'}
                            </span>
                            <span>
                              {allTopicsChecked ? 'Mark Module as Complete' : `Check all items to complete (${completedTopicsCount}/${totalTopicsCount})`}
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* FULL MODULE EXPANDED MODAL / DRAWER */}
      {modalModule && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalModule(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-2xl transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            {/* Modal Header */}
            <div className="space-y-2 pr-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-extrabold text-xs uppercase">
                  Year {modalModule.year} • {modalModule.semesters}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-extrabold text-xs uppercase">
                  {modalModule.category}
                </span>
                <span
                  className={`px-3 py-1 rounded-full font-extrabold text-xs uppercase ${
                    modalModule.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : modalModule.status === 'in_progress'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {modalModule.status === 'completed'
                    ? 'Passed ✅'
                    : modalModule.status === 'in_progress'
                    ? 'Active ⚡'
                    : 'Locked 🔒'}
                </span>
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900">{modalModule.title}</h2>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                {modalModule.description}
              </p>
            </div>

            {/* Progress Overview */}
            <div className="bg-slate-50 border-2 border-slate-200/80 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-extrabold">
                <span className="text-slate-600 uppercase tracking-wider font-mono">Module Mastery Level</span>
                <span className="text-indigo-700 text-sm">{modalModule.progress}% Completed</span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    modalModule.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${modalModule.progress}%` }}
                />
              </div>
            </div>

            {/* Topic Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600">checklist</span>
                  <span>Topic Mastery Checklist</span>
                </h3>
                <span className="text-xs font-extrabold text-slate-500">
                  {modalModule.topics.filter((t) => t.completed).length} / {modalModule.topics.length} Completed
                </span>
              </div>

              <div className="space-y-2">
                {modalModule.topics.map((topic, topicIdx) => {
                  const ytQuery = encodeURIComponent(`${topic.name} tutorial`);
                  const ytUrl = `https://www.youtube.com/results?search_query=${ytQuery}`;

                  return (
                    <div
                      key={topicIdx}
                      onClick={() => onToggleTopicCheck(modalModule.id, topicIdx)}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl border-2 transition-all cursor-pointer gap-2 ${
                        topic.completed
                          ? 'bg-emerald-50/90 border-emerald-300 text-slate-900'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                            topic.completed
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'border-2 border-slate-300 bg-white'
                          }`}
                        >
                          {topic.completed && <span className="material-symbols-outlined text-base font-black">check</span>}
                        </div>
                        <span className={`text-xs sm:text-sm truncate ${topic.completed ? 'line-through text-slate-500 font-bold' : 'font-extrabold text-slate-800'}`}>
                          {topic.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <a
                          href={ytUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          title={`Watch "${topic.name}" tutorial on YouTube`}
                        >
                          <span className="material-symbols-outlined text-sm">play_circle</span>
                          <span>Watch Tutorial</span>
                        </a>

                        <span
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                            topic.completed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {topic.completed ? 'Done' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* "Mark Module as Complete" Action Button */}
            {(() => {
              const allChecked = modalModule.topics.length > 0 && modalModule.topics.every((t) => t.completed);
              return (
                <div className="pt-2">
                  <button
                    disabled={!allChecked}
                    onClick={() => {
                      onMarkModuleComplete(modalModule.id);
                      setActiveModalModule(null);
                    }}
                    className={`w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${
                      allChecked
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 shadow-lg cursor-pointer'
                        : 'bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {allChecked ? 'workspace_premium' : 'lock'}
                    </span>
                    <span>
                      {allChecked
                        ? '🎉 Mark Module as Fully Complete'
                        : `Complete all items above to activate (${modalModule.topics.filter((t) => t.completed).length}/${modalModule.topics.length} checked)`}
                    </span>
                  </button>
                </div>
              );
            })()}

            {/* Recommended Learning Resources & YouTube Videos */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500">subscriptions</span>
                <span>Recommended Learning Resources & YouTube Courses</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {modalModule.resources && modalModule.resources.length > 0 ? (
                  modalModule.resources.map((res) => (
                    <a
                      key={res.id}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 bg-slate-50 hover:bg-indigo-50/80 border-2 border-slate-200/90 hover:border-indigo-400 rounded-2xl transition-all flex flex-col justify-between space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-sm ${
                            res.type === 'youtube'
                              ? 'bg-red-100 text-red-600'
                              : res.type === 'course'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            <span className="material-symbols-outlined text-lg">
                              {res.type === 'youtube' ? 'play_circle' : res.type === 'course' ? 'school' : 'menu_book'}
                            </span>
                          </div>
                          <div>
                            <p className="text-[10px] font-extrabold text-slate-500 uppercase">
                              {res.channelOrProvider}
                            </p>
                            {res.durationOrBadge && (
                              <span className="text-[9px] font-extrabold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded">
                                {res.durationOrBadge}
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="material-symbols-outlined text-slate-400 group-hover:text-indigo-600 transition-colors text-base">
                          launch
                        </span>
                      </div>

                      <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {res.title}
                      </h4>
                    </a>
                  ))
                ) : (
                  <div className="col-span-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
                    Standard curriculum lectures available on college LMS portal.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModalModule(null)}
                className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
