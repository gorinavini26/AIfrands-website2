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
      newLogs.push(`SYSTEM OK | Student: ${profile.name} | GPA: 3.92 | Streak: ${profile.streakDays} Days`);
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
    <div className="flex flex-col w-full text-slate-800 bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-slate-100 min-h-screen p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="w-full max-w-7xl mx-auto space-y-6">

        {/* HERO SECTION - PLAYFUL 3D GRADIENT */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-950 to-slate-950 text-white p-6 sm:p-8 border-4 border-indigo-900/80 shadow-2xl shadow-indigo-950/30">
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge-chunky bg-amber-400 text-slate-950 border-b-2 border-amber-600">
                  <span className="animate-bounce-subtle">🔥</span> {profile.streakDays} Day Streak
                </span>
                <span className="badge-chunky bg-indigo-800/90 text-amber-300 border border-indigo-600/50">
                  <span className="animate-bounce-subtle">⭐</span> Level 7 • 1,240 XP
                </span>
                <span className="badge-chunky bg-purple-500/20 text-purple-200 border border-purple-400/30">
                  <span>🎯</span> Year 2 • Semester 3
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Welcome back, <span className="bg-gradient-to-r from-amber-300 via-pink-400 to-indigo-300 bg-clip-text text-transparent">{profile.name}</span>!
              </h1>

              <p className="text-xs sm:text-sm text-indigo-100/90 font-medium leading-relaxed">
                You're <strong className="text-amber-300">{avgProgress}%</strong> through your semester coursework. Keep up the high velocity and complete your pending CS labs today!
              </p>
            </div>

            {/* NEXT QUEST CARD */}
            {nextUpAssignment && (
              <div className="bg-slate-900/90 border-2 border-indigo-500/40 p-4 sm:p-5 rounded-3xl flex flex-col justify-between gap-3 shrink-0 lg:max-w-sm w-full shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-indigo-300 font-bold">
                  <span className="uppercase tracking-wider flex items-center gap-1 text-[11px]">
                    <span className="text-amber-400">⚡</span> Next Daily Quest
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold">
                    ACTIVE
                  </span>
                </div>

                <div>
                  <h3 className="text-white font-extrabold text-sm sm:text-base line-clamp-1">
                    {nextUpAssignment.title}
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5 font-medium">
                    {nextUpAssignment.course} • ~20 mins completion
                  </p>
                </div>

                <button
                  onClick={() => onOpenAssignment(nextUpAssignment)}
                  className="btn-3d btn-3d-amber w-full py-3 px-4 text-slate-950 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-base">bolt</span>
                  <span>Continue Daily Quest</span>
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 4 STAT CARDS WITH 3D DEPTH */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div
            onClick={() => onNavigateTab('roadmap')}
            className="card-3d p-5 cursor-pointer flex flex-col justify-between space-y-3 group border-l-4 border-l-indigo-500"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl shadow-xs">
                <span className="material-symbols-outlined">workspace_premium</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all">
                arrow_forward
              </span>
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Degree Completion</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">{avgProgress}%</p>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full" style={{ width: `${avgProgress}%` }} />
            </div>
          </div>

          <div
            onClick={scrollToAssignments}
            className="card-3d p-5 cursor-pointer flex flex-col justify-between space-y-3 group border-l-4 border-l-amber-500"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl shadow-xs">
                <span className="material-symbols-outlined">assignment_late</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all">
                arrow_forward
              </span>
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Pending Labs</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">{pendingAssignments.length}</p>
            </div>
            <p className="text-xs font-bold text-amber-600 flex items-center gap-1">
              <span>⚠️</span> {dueSoonAssignments.length} assignments due soon
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('resources')}
            className="card-3d p-5 cursor-pointer flex flex-col justify-between space-y-3 group border-l-4 border-l-emerald-500"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl shadow-xs">
                <span className="material-symbols-outlined">menu_book</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all">
                arrow_forward
              </span>
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Notebook Library</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">{notebooks.length}</p>
            </div>
            <p className="text-xs font-bold text-emerald-600">
              {notebooks.reduce((acc, n) => acc + n.fileCount, 0)} research files synced
            </p>
          </div>

          <div
            onClick={() => setShowGradeModal(true)}
            className="card-3d p-5 cursor-pointer flex flex-col justify-between space-y-3 group border-l-4 border-l-purple-500"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg">
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all">
                arrow_forward
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Performance</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">3.92 GPA</p>
            </div>
            <p className="text-xs font-semibold text-purple-600">
              Top 5% of class cohort
            </p>
          </div>

        </section>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-8 space-y-6">
            
            {/* MODULE PROGRESS */}
            <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Semester 3 Core Path</h2>
                  <p className="text-xs text-slate-500 font-medium">Click module to jump to curriculum detail</p>
                </div>

                <button
                  onClick={() => onNavigateTab('roadmap')}
                  className="btn-3d btn-3d-slate py-1.5 px-3.5 text-slate-800 text-xs font-extrabold flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>Full 4-Year Map</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>

              <div className="space-y-3">
                {year2Mods.slice(0, 4).map((mod, idx) => {
                  const borderColors = [
                    'border-t-4 border-t-indigo-500 shadow-indigo-500/10',
                    'border-t-4 border-t-purple-500 shadow-purple-500/10',
                    'border-t-4 border-t-emerald-500 shadow-emerald-500/10',
                    'border-t-4 border-t-amber-500 shadow-amber-500/10',
                  ];
                  const borderStyle = borderColors[idx % borderColors.length];

                  return (
                    <div
                      key={mod.id}
                      onClick={() => {
                        onNavigateTab('roadmap');
                        notify(`Selected module: ${mod.title}`);
                      }}
                      className={`card-3d p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${borderStyle}`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-extrabold text-[10px] uppercase border border-indigo-200">
                            {mod.id.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-500 font-bold">{mod.category}</span>
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {mod.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3 min-w-[140px] sm:justify-end">
                        <div className="flex-1 sm:w-28 bg-slate-200/90 h-2.5 rounded-full overflow-hidden border border-slate-300/50">
                          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 h-full rounded-full" style={{ width: `${mod.progress}%` }} />
                        </div>
                        <span className="font-extrabold text-xs text-slate-700 min-w-[35px] text-right font-mono">
                          {mod.progress}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ACTIVE ASSIGNMENTS */}
            <div ref={assignmentsSectionRef} className="bg-white rounded-2xl border-2 border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Active Lab Quests & Code Submissions</h2>
                  <p className="text-xs text-slate-500">Select a lab assignment to open the editor modal</p>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                  <button
                    onClick={() => setAssignmentFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      assignmentFilter === 'all'
                        ? 'bg-white text-slate-900 font-black shadow-xs'
                        : 'text-slate-500 font-medium'
                    }`}
                  >
                    All ({assignments.length})
                  </button>
                  <button
                    onClick={() => setAssignmentFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      assignmentFilter === 'pending'
                        ? 'bg-white text-amber-600 font-black shadow-xs'
                        : 'text-slate-500 font-medium'
                    }`}
                  >
                    Pending ({pendingAssignments.length})
                  </button>
                  <button
                    onClick={() => setAssignmentFilter('submitted')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      assignmentFilter === 'submitted'
                        ? 'bg-white text-emerald-600 font-black shadow-xs'
                        : 'text-slate-500 font-medium'
                    }`}
                  >
                    Done
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredAssignments.map((asg) => {
                  const isSubmitted = asg.status === 'Submitted';

                  return (
                    <div
                      key={asg.id}
                      className="bg-slate-50 border-2 border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                            {asg.course}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isSubmitted
                                ? 'bg-emerald-100 text-emerald-800'
                                : asg.isDueSoon
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isSubmitted ? `Graded ${asg.grade || 'A+'}` : asg.dueDate}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {asg.title}
                        </h3>

                        <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                          {asg.description}
                        </p>

                        <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                          <span>File: {asg.filename}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                        {onOpenAIAssistant && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenAIAssistant(asg.submissionCode || `// ${asg.title}`);
                              notify(`Asking AI Tutor for help with ${asg.title}`);
                            }}
                            className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-xs">auto_awesome</span>
                            <span>AI Help</span>
                          </button>
                        )}

                        <button
                          onClick={() => onOpenAssignment(asg)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer ${
                            isSubmitted
                              ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                              : 'bg-slate-900 hover:bg-slate-800 text-white'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {isSubmitted ? 'visibility' : 'code'}
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

          <div className="lg:col-span-4 space-y-6">
            
            {/* COMMIT ACTIVITY GRID */}
            <div className="bg-white rounded-2xl border-2 border-slate-200/80 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600 text-lg">grid_on</span>
                  <h3 className="text-sm font-bold text-slate-900">Commit Activity Grid</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">28 Days</span>
              </div>

              <div className="flex flex-col items-center py-2 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                <div className="grid grid-rows-4 grid-flow-col gap-1.5">
                  {Array.from({ length: 28 }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const count = (idx * 7 + 3) % 9;
                    let bgClass = 'bg-slate-200/80 border-slate-300/60';
                    if (count > 6) bgClass = 'bg-indigo-600 border-indigo-700';
                    else if (count > 3) bgClass = 'bg-indigo-400 border-indigo-500';
                    else if (count > 0) bgClass = 'bg-indigo-200 border-indigo-300';

                    return (
                      <button
                        key={idx}
                        onMouseEnter={() => setHoveredTile({ day: dayNum, count })}
                        onMouseLeave={() => setHoveredTile(null)}
                        onClick={() => notify(`Day ${dayNum}: ${count} code commits recorded on GitHub.`)}
                        className={`w-3.5 h-3.5 rounded border transition-all hover:scale-125 cursor-pointer ${bgClass}`}
                        title={`Day ${dayNum}: ${count} commits`}
                      />
                    );
                  })}
                </div>

                <div className="h-5 text-[11px] font-medium text-indigo-700 mt-2 font-mono">
                  {hoveredTile ? (
                    <span>Day {hoveredTile.day}: {hoveredTile.count} commits logged</span>
                  ) : (
                    <span className="text-slate-400">Hover or click any cell</span>
                  )}
                </div>
              </div>
            </div>

            {/* INTERACTIVE PLAYGROUND TERMINAL */}
            <div className="bg-slate-950 text-slate-100 rounded-2xl p-4 shadow-xl border-2 border-slate-800 flex flex-col font-mono text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="flex items-center gap-2 text-emerald-400 font-bold text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  CS CODE TERMINAL
                </span>
                <button
                  type="button"
                  onClick={() => setTerminalLogs(['[00:00] Terminal cleared.'])}
                  className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 bg-slate-800 rounded font-medium"
                >
                  clear
                </button>
              </div>

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

              <form onSubmit={handleTerminalSubmit} className="pt-2 border-t border-slate-800 flex gap-2">
                <span className="text-emerald-400 font-bold">$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="type 'help', 'compile'..."
                  className="flex-1 bg-transparent text-white text-[11px] focus:outline-none placeholder:text-slate-600 font-mono"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
                >
                  Run
                </button>
              </form>
            </div>

            {/* ACTIVE TECH STACK CARD */}
            <div className="bg-white rounded-2xl border-2 border-slate-200/80 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600 text-lg">code_blocks</span>
                  <h3 className="text-sm font-bold text-slate-900">Active Tech Stack</h3>
                </div>
                <button
                  onClick={() => onNavigateTab('languages')}
                  className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 uppercase bg-slate-100 px-2 py-1 rounded cursor-pointer"
                >
                  Stack →
                </button>
              </div>

              <div className="space-y-2">
                <div
                  onClick={() => onNavigateTab('languages')}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-xs">
                      Py
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">Python 3.12</p>
                      <p className="text-[10px] text-slate-500">AI & PyTorch</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                    Advanced
                  </span>
                </div>

                <div
                  onClick={() => onNavigateTab('languages')}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-xs">
                      C++
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">C++20</p>
                      <p className="text-[10px] text-slate-500">Systems & Memory</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-[10px] font-bold rounded-full">
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl border-2 border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Academic Grade Breakdown</h3>
                <p className="text-xs text-slate-500 font-semibold">Cumulative GPA: 3.92</p>
              </div>
              <button
                onClick={() => setShowGradeModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-2 text-xs font-semibold">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-slate-800">Data Structures & Algorithms</span>
                <span className="text-emerald-600 font-bold">A+ (98%)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-slate-800">Operating Systems & Kernels</span>
                <span className="text-emerald-600 font-bold">A (92%)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-slate-800">Web Architecture & REST APIs</span>
                <span className="text-emerald-600 font-bold">A+ (95%)</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowGradeModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
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
