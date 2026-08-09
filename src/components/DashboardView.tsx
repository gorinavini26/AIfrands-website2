import React, { useState, useRef } from 'react';
import { UserProfile, RoadmapModule, Assignment, Notebook } from '../types';

interface DashboardViewProps {
  profile: UserProfile;
  roadmapModules: RoadmapModule[];
  assignments: Assignment[];
  notebooks: Notebook[];
  onOpenAssignment: (asg: Assignment) => void;
  onOpenNotebook: (nb: Notebook) => void;
  onNavigateTab: (tab: string) => void;
  onOpenAIAssistant?: (code?: string) => void;
  onShowToast?: (msg: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  roadmapModules,
  assignments,
  notebooks,
  onOpenAssignment,
  onOpenNotebook,
  onNavigateTab,
  onOpenAIAssistant,
  onShowToast,
}) => {
  // Assignments Filter State
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'pending' | 'submitted'>('all');

  // Terminal Interactive State
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[11:29:01] INIT: AI Frands CS Engine initialized',
    `[11:29:05] DB: Synced ${roadmapModules.length} modules for Student ${profile.studentId}`,
    '[11:29:10] SUCCESS: Quest #101 Binary Search Tree graded A+',
    '[11:29:15] COMPILER: g++ -O3 -std=c++20 cs201_hw4_bst.cpp -o app',
    '[11:29:30] NOTICE: Memory check 128MB ok',
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Grade Modal State
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [hoveredTile, setHoveredTile] = useState<{ day: number; count: number } | null>(null);

  // Ref for scrolling to assignments
  const assignmentsSectionRef = useRef<HTMLDivElement>(null);

  // Stats calculation
  const pendingAssignments = assignments.filter((a) => a.status !== 'Submitted');
  const dueSoonAssignments = assignments.filter((a) => a.isDueSoon);
  const nextUpAssignment = pendingAssignments[0] || assignments[0];
  const year2Mods = roadmapModules.filter((m) => m.year === 2);
  const avgProgress = year2Mods.length
    ? Math.round(year2Mods.reduce((acc, curr) => acc + curr.progress, 0) / year2Mods.length)
    : 68;

  // Filtered assignments
  const filteredAssignments = assignments.filter((asg) => {
    if (assignmentFilter === 'pending') return asg.status !== 'Submitted';
    if (assignmentFilter === 'submitted') return asg.status === 'Submitted';
    return true;
  });

  const notify = (msg: string) => {
    if (onShowToast) onShowToast(msg);
  };

  const scrollToAssignments = () => {
    if (assignmentsSectionRef.current) {
      assignmentsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      notify('Scrolled to Active Assignments & Lab Submissions');
    }
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    const newLogs = [...terminalLogs, `[${time}] $ ${cmd}`];

    const lower = cmd.toLowerCase();
    if (lower === 'clear') {
      setTerminalLogs([`[${time}] Terminal cleared.`]);
      setTerminalInput('');
      return;
    } else if (lower === 'help') {
      newLogs.push('Available commands: help, assignments, compile, status, test, clear, grade');
    } else if (lower.includes('assignment') || lower === 'asg') {
      newLogs.push(`FOUND: ${assignments.length} assignments (${pendingAssignments.length} pending, ${dueSoonAssignments.length} due soon).`);
    } else if (lower.includes('compile') || lower.includes('gcc') || lower.includes('g++')) {
      newLogs.push('COMPILING cs201_hw4_bst.cpp with g++ -std=c++20...');
      newLogs.push('✔ Compilation finished with 0 errors, 0 warnings.');
      notify('Compilation check passed! 0 errors.');
    } else if (lower.includes('test')) {
      newLogs.push('RUNNING TEST SUITE: 4/4 test cases passed [AVL tree rotations, balance factor ok].');
      notify('Test Suite executed: 100% pass rate!');
    } else if (lower.includes('status')) {
      newLogs.push(`SYSTEM OK | Student: ${profile.name} | GPA: ${profile.gpa || '3.92'} | Streak: ${profile.streakDays} Days`);
    } else if (lower.includes('grade')) {
      newLogs.push('GRADES: Data Structures (A+), OS (A), Web Dev (A), Math (A+)');
      setShowGradeModal(true);
    } else {
      newLogs.push(`EXEC: Command "${cmd}" executed successfully.`);
    }

    setTerminalLogs(newLogs);
    setTerminalInput('');
    setTimeout(() => {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="flex flex-col w-full text-slate-800 bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="w-full max-w-7xl mx-auto space-y-8">

        {/* HERO SECTION: DUOLINGO / KHAN ACADEMY STYLE DAILY QUEST BANNER */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 p-6 sm:p-8 md:p-10 text-white shadow-xl shadow-indigo-600/15 border-b-4 border-indigo-900">
          
          {/* Decorative Background Circles */}
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-32 -bottom-12 w-48 h-48 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              {/* Gamified Badges Row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md border-b-2 border-amber-600">
                  <span>🔥</span> {profile.streakDays} Day Streak!
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/50 backdrop-blur-md text-indigo-100 font-extrabold text-xs border border-indigo-300/30">
                  <span>⭐</span> Level 7 • 1,240 XP
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white font-extrabold text-xs shadow-sm border-b-2 border-emerald-700">
                  <span>🎯</span> Semester 3 Priority
                </span>
              </div>

              {/* Main Greeting */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Welcome back, <span className="text-amber-300">{profile.name}</span>!
              </h1>

              {/* Clear Subtitle */}
              <p className="text-sm sm:text-base text-indigo-100 font-medium leading-relaxed max-w-xl">
                You're <span className="font-extrabold text-white">{avgProgress}%</span> through Year 2 Semester 3! Continue your active coding quest below to keep your daily streak alive.
              </p>
            </div>

            {/* ONE CLEAR PRIMARY NEXT STEP BUTTON */}
            {nextUpAssignment && (
              <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 flex flex-col items-stretch gap-3 shrink-0 lg:max-w-sm w-full">
                <div className="flex items-center justify-between text-xs text-indigo-200 font-bold uppercase tracking-wider">
                  <span>Current Quest Target</span>
                  <span className="text-amber-300 font-extrabold">Next Step</span>
                </div>

                <div className="text-white font-extrabold text-sm sm:text-base line-clamp-1">
                  {nextUpAssignment.title}
                </div>

                <button
                  onClick={() => onOpenAssignment(nextUpAssignment)}
                  className="w-full py-4 px-6 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-amber-500/25 border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <span className="text-lg">⚡</span>
                  <span>Continue Daily Quest</span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 4 VIBRANT GAMIFIED METRIC CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Curriculum Completion */}
          <div
            onClick={() => onNavigateTab('roadmap')}
            className="bg-white rounded-3xl p-5 border-2 border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold text-lg">
                🏆
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Curriculum Mastery</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">{avgProgress}%</p>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
              <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${avgProgress}%` }} />
            </div>
          </div>

          {/* Card 2: Pending Lab Quests */}
          <div
            onClick={scrollToAssignments}
            className="bg-white rounded-3xl p-5 border-2 border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-extrabold text-lg">
                ⚡
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Lab Quests</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">{pendingAssignments.length}</p>
            </div>
            <p className="text-[11px] font-extrabold text-amber-600 mt-3 flex items-center gap-1">
              <span>⏰</span> {dueSoonAssignments.length} Due Soon • Click to View
            </p>
          </div>

          {/* Card 3: NotebookLM Papers */}
          <div
            onClick={() => onNavigateTab('resources')}
            className="bg-white rounded-3xl p-5 border-2 border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-lg">
                📚
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">NotebookLM Library</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">{notebooks.length}</p>
            </div>
            <p className="text-[11px] font-extrabold text-emerald-600 mt-3 flex items-center gap-1">
              <span>📖</span> {notebooks.reduce((acc, n) => acc + n.fileCount, 0)} Synthesized Papers
            </p>
          </div>

          {/* Card 4: Current Grade GPA */}
          <div
            onClick={() => setShowGradeModal(true)}
            className="bg-white rounded-3xl p-5 border-2 border-slate-200/90 shadow-xs hover:shadow-md hover:border-purple-400 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-extrabold text-lg">
                🏅
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-transform">
                analytics
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Academic Grade</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">3.92 GPA</p>
            </div>
            <p className="text-[11px] font-extrabold text-purple-600 mt-3 flex items-center gap-1">
              <span>✨</span> Outstanding (Top 5%)
            </p>
          </div>

        </section>

        {/* MAIN LAYOUT: CURRICULUM MODULES & TERMINAL PLAYGROUND */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (8 cols): Progress Modules & Active Assignments */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* CURRICULUM PROGRESS MODULES */}
            <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-extrabold">
                    🚀
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">Semester 3 Core Path</h2>
                    <p className="text-xs text-slate-500 font-medium">Click any module to continue your study path</p>
                  </div>
                </div>

                {/* ONE CLEAR ACTION BUTTON */}
                <button
                  onClick={() => onNavigateTab('roadmap')}
                  className="py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-2 border-indigo-200 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
                >
                  <span>Full 4-Year Map</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>

              {/* Module Cards */}
              <div className="space-y-3">
                {year2Mods.slice(0, 4).map((mod) => (
                  <div
                    key={mod.id}
                    onClick={() => {
                      onNavigateTab('roadmap');
                      notify(`Selected module: ${mod.title}`);
                    }}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border-2 border-slate-200/80 hover:border-indigo-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-extrabold text-[10px] uppercase">
                          {mod.id.toUpperCase()}
                        </span>
                        <span className="text-xs font-bold text-slate-500">{mod.category}</span>
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {mod.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 min-w-[140px] sm:justify-end">
                      <div className="flex-1 sm:w-28 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${mod.progress}%` }} />
                      </div>
                      <span className="font-extrabold text-xs text-indigo-700 min-w-[35px] text-right">
                        {mod.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTIVE ASSIGNMENTS & LAB SUBMISSIONS */}
            <div ref={assignmentsSectionRef} className="bg-white rounded-3xl border-2 border-slate-200/90 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl font-extrabold">
                    📝
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">Active Lab Quests & Code Submissions</h2>
                    <p className="text-xs text-slate-500 font-medium">Select a lab quest to open the live editor modal</p>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl text-xs font-extrabold">
                  <button
                    onClick={() => setAssignmentFilter('all')}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      assignmentFilter === 'all'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All ({assignments.length})
                  </button>
                  <button
                    onClick={() => setAssignmentFilter('pending')}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      assignmentFilter === 'pending'
                        ? 'bg-white text-amber-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Pending ({pendingAssignments.length})
                  </button>
                  <button
                    onClick={() => setAssignmentFilter('submitted')}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      assignmentFilter === 'submitted'
                        ? 'bg-white text-emerald-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Done
                  </button>
                </div>
              </div>

              {/* Assignments Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredAssignments.map((asg) => {
                  const isSubmitted = asg.status === 'Submitted';

                  return (
                    <div
                      key={asg.id}
                      className="bg-slate-50/90 hover:bg-white border-2 border-slate-200/80 hover:border-indigo-400 rounded-2xl p-5 transition-all shadow-2xs flex flex-col justify-between space-y-4 group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-extrabold text-[10px] uppercase">
                            {asg.course}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              isSubmitted
                                ? 'bg-emerald-100 text-emerald-800'
                                : asg.isDueSoon
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isSubmitted ? `Grade ${asg.grade || 'A+'}` : asg.dueDate}
                          </span>
                        </div>

                        <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {asg.title}
                        </h3>

                        <p className="text-xs text-slate-600 mt-2 line-clamp-2 font-medium leading-relaxed">
                          {asg.description}
                        </p>
                      </div>

                      {/* ONE CLEAR PRIMARY BUTTON */}
                      <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
                        {onOpenAIAssistant && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenAIAssistant(asg.submissionCode || `// ${asg.title}`);
                              notify(`Asking AI Tutor for help with ${asg.title}`);
                            }}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-xs">auto_awesome</span>
                            <span>AI Help</span>
                          </button>
                        )}

                        <button
                          onClick={() => onOpenAssignment(asg)}
                          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer border-b-2 active:border-b-0 active:translate-y-0.5 ${
                            isSubmitted
                              ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-400'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-800'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {isSubmitted ? 'visibility' : 'play_arrow'}
                          </span>
                          <span>{isSubmitted ? 'View Submission' : 'Start Solution'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column (4 cols): Commit Grid & Interactive Terminal & Tech Stack */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* COMMIT ACTIVITY GRID */}
            <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔥</span>
                  <h3 className="text-sm font-extrabold text-slate-900">Commit Activity Grid</h3>
                </div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">28 Days</span>
              </div>

              {/* Heatmap Grid */}
              <div className="flex flex-col items-center py-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <div className="grid grid-rows-4 grid-flow-col gap-1.5">
                  {Array.from({ length: 28 }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const count = (idx * 7 + 3) % 9;
                    let bgClass = 'bg-slate-200/80 border-slate-300';
                    if (count > 6) bgClass = 'bg-indigo-600 border-indigo-700';
                    else if (count > 3) bgClass = 'bg-indigo-400 border-indigo-500';
                    else if (count > 0) bgClass = 'bg-indigo-200 border-indigo-300';

                    return (
                      <button
                        key={idx}
                        onMouseEnter={() => setHoveredTile({ day: dayNum, count })}
                        onMouseLeave={() => setHoveredTile(null)}
                        onClick={() => notify(`Day ${dayNum}: ${count} code commits recorded on GitHub.`)}
                        className={`w-4 h-4 rounded-md border transition-all hover:scale-125 cursor-pointer ${bgClass}`}
                        title={`Day ${dayNum}: ${count} commits`}
                      />
                    );
                  })}
                </div>

                <div className="h-5 text-[11px] font-bold text-indigo-700 mt-2">
                  {hoveredTile ? (
                    <span>Day {hoveredTile.day}: {hoveredTile.count} commits logged</span>
                  ) : (
                    <span className="text-slate-400 font-sans">Hover or click any cell</span>
                  )}
                </div>
              </div>
            </div>

            {/* INTERACTIVE PLAYGROUND TERMINAL */}
            <div className="bg-slate-900 text-slate-100 rounded-3xl p-5 shadow-md border-b-4 border-slate-950 flex flex-col font-mono text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="flex items-center gap-2 text-emerald-400 font-extrabold text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  CS CODE TERMINAL
                </span>
                <button
                  type="button"
                  onClick={() => setTerminalLogs(['[00:00] Terminal cleared.'])}
                  className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 bg-slate-800 rounded-md font-bold"
                >
                  clear
                </button>
              </div>

              {/* Output log */}
              <div className="space-y-1 text-[10px] text-slate-300 max-h-[110px] overflow-y-auto leading-relaxed pr-1">
                {terminalLogs.map((log, idx) => (
                  <div key={idx}>
                    {log.startsWith('[') ? (
                      <span>
                        <span className="text-indigo-400">{log.substring(0, log.indexOf(']') + 1)}</span>
                        {log.substring(log.indexOf(']') + 1)}
                      </span>
                    ) : (
                      log
                    )}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* Command Input Form */}
              <form onSubmit={handleTerminalSubmit} className="pt-2 border-t border-slate-800 flex gap-2">
                <span className="text-emerald-400 font-extrabold">$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="type 'help', 'compile'..."
                  className="flex-1 bg-transparent text-white text-[11px] focus:outline-none placeholder:text-slate-600 font-mono"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer"
                >
                  Run
                </button>
              </form>
            </div>

            {/* ACTIVE TECH STACK CARD */}
            <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💻</span>
                  <h3 className="text-sm font-extrabold text-slate-900">Active Tech Stack</h3>
                </div>
                <button
                  onClick={() => onNavigateTab('languages')}
                  className="text-[10px] font-extrabold text-indigo-700 uppercase bg-indigo-50 px-2.5 py-1 rounded-full cursor-pointer hover:bg-indigo-100"
                >
                  Stack →
                </button>
              </div>

              <div className="space-y-2">
                <div
                  onClick={() => onNavigateTab('languages')}
                  className="p-3 bg-slate-50 hover:bg-indigo-50/70 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-extrabold text-xs">
                      Py
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-600">Python 3.12</p>
                      <p className="text-[10px] text-slate-500 font-medium">AI & PyTorch</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full">
                    Advanced
                  </span>
                </div>

                <div
                  onClick={() => onNavigateTab('languages')}
                  className="p-3 bg-slate-50 hover:bg-sky-50/70 rounded-2xl border border-slate-200 hover:border-sky-300 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-sky-600 text-white rounded-xl flex items-center justify-center font-extrabold text-xs">
                      C++
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900 group-hover:text-sky-600">C++20</p>
                      <p className="text-[10px] text-slate-500 font-medium">Systems & Memory</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-[10px] font-extrabold rounded-full">
                    Interm
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Grade Breakdown Modal */}
      {showGradeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border-2 border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏅</span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Academic Grade Breakdown</h3>
                  <p className="text-xs text-slate-500 font-bold">GPA: 3.92 A+</p>
                </div>
              </div>
              <button
                onClick={() => setShowGradeModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-xl"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-2 text-xs font-bold">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-800">Data Structures & Algorithms</span>
                <span className="text-emerald-600">A+ (98%)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-800">Operating Systems & Kernels</span>
                <span className="text-emerald-600">A (92%)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-800">Web Architecture & REST APIs</span>
                <span className="text-emerald-600">A+ (95%)</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowGradeModal(false)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-extrabold shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
