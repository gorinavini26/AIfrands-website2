import React, { useState } from 'react';
import {
  YEARS_DATA,
  SemesterData,
  SubjectChapter,
  YearData,
} from '../data/curriculumData';
import { MindMapDiagram } from './MindMapDiagram';
import { exportSemesterToPDF } from '../utils/pdfExporter';
import { MarkdownRenderer } from './MarkdownRenderer';

interface CurriculumViewProps {
  semestersData: SemesterData[];
  onToggleTopicCheck: (semesterId: number, subjectId: string, topicId: string) => void;
  onShowToast?: (msg: string) => void;
  initialYearNav?: number | null;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  semestersData,
  onToggleTopicCheck,
  onShowToast,
  initialYearNav,
}) => {
  // Navigation State for 4-Level Drill-Down Hierarchy
  // level 1 = Year selector screen
  // level 2 = Semester selector screen for chosen year
  // level 3 = Subject list for chosen semester + suggested projects + PDF download
  // level 4 = Chapter detail screen (Subtopics checklist + Notes + Mind map + YouTube video)
  const [selectedYear, setSelectedYear] = useState<number | null>(initialYearNav || null);
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  // Current Active Objects based on navigation selections
  const activeYearObj: YearData | undefined = YEARS_DATA.find((y) => y.year === selectedYear);
  const activeSemesterObj: SemesterData | undefined = semestersData.find((s) => s.id === selectedSemesterId);
  const activeSubjectObj: SubjectChapter | undefined = activeSemesterObj?.subjects.find(
    (sub) => sub.id === selectedSubjectId
  );

  // Reset to root or specific level
  const handleGoToRoot = () => {
    setSelectedYear(null);
    setSelectedSemesterId(null);
    setSelectedSubjectId(null);
  };

  const handleGoToYear = (yearNum: number) => {
    setSelectedYear(yearNum);
    setSelectedSemesterId(null);
    setSelectedSubjectId(null);
  };

  const handleGoToSemester = (semId: number) => {
    setSelectedSemesterId(semId);
    setSelectedSubjectId(null);
  };

  // Calculate completion percentage for a subject, semester, or year
  const getSubjectProgress = (subject: SubjectChapter): number => {
    if (!subject.topics || subject.topics.length === 0) return 0;
    const completed = subject.topics.filter((t) => t.completed).length;
    return Math.round((completed / subject.topics.length) * 100);
  };

  const getSemesterProgress = (semester: SemesterData): number => {
    if (!semester.subjects || semester.subjects.length === 0) return 0;
    const totalProg = semester.subjects.reduce((sum, sub) => sum + getSubjectProgress(sub), 0);
    return Math.round(totalProg / semester.subjects.length);
  };

  const getYearProgress = (yearNum: number): number => {
    const yearSems = semestersData.filter((s) => s.year === yearNum);
    if (!yearSems.length) return 0;
    const sum = yearSems.reduce((acc, sem) => acc + getSemesterProgress(sem), 0);
    return Math.round(sum / yearSems.length);
  };

  // Helper for Toast
  const notify = (msg: string) => {
    if (onShowToast) onShowToast(msg);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header & Breadcrumb Bar (Strict 1-Level View Enforcer) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {/* Dynamic Breadcrumb Path */}
          <nav className="flex items-center flex-wrap gap-2 text-xs font-bold text-slate-400 mb-2">
            <button
              onClick={handleGoToRoot}
              className={`hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer ${
                selectedYear === null ? 'text-amber-400 font-extrabold' : ''
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">map</span>
              <span>CS Curriculum</span>
            </button>

            {selectedYear !== null && (
              <>
                <span className="text-slate-600">/</span>
                <button
                  onClick={() => handleGoToYear(selectedYear)}
                  className={`hover:text-amber-400 transition-colors cursor-pointer ${
                    selectedSemesterId === null ? 'text-amber-400 font-extrabold' : ''
                  }`}
                >
                  Year {selectedYear}
                </button>
              </>
            )}

            {selectedSemesterId !== null && (
              <>
                <span className="text-slate-600">/</span>
                <button
                  onClick={() => handleGoToSemester(selectedSemesterId)}
                  className={`hover:text-amber-400 transition-colors cursor-pointer ${
                    selectedSubjectId === null ? 'text-amber-400 font-extrabold' : ''
                  }`}
                >
                  Semester {selectedSemesterId}
                </button>
              </>
            )}

            {selectedSubjectId !== null && activeSubjectObj && (
              <>
                <span className="text-slate-600">/</span>
                <span className="text-amber-300 font-black truncate max-w-[180px] sm:max-w-[280px]">
                  {activeSubjectObj.title}
                </span>
              </>
            )}
          </nav>

          {/* Title based on current level */}
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            {selectedSubjectId !== null && activeSubjectObj ? (
              <>
                <span className="material-symbols-outlined text-amber-400">auto_stories</span>
                <span>{activeSubjectObj.title}</span>
              </>
            ) : selectedSemesterId !== null && activeSemesterObj ? (
              <>
                <span className="material-symbols-outlined text-indigo-400">school</span>
                <span>{activeSemesterObj.title}: {activeSemesterObj.subtitle}</span>
              </>
            ) : selectedYear !== null && activeYearObj ? (
              <>
                <span className="material-symbols-outlined text-amber-400">account_balance</span>
                <span>{activeYearObj.title} ({activeYearObj.tagline})</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-indigo-400 font-bold">view_in_ar</span>
                <span>Computer Science Degree Pathway</span>
              </>
            )}
          </h1>
        </div>

        {/* Level Action Buttons (e.g. Back button or PDF export) */}
        <div className="flex items-center gap-3">
          {selectedSemesterId !== null && activeSemesterObj && selectedSubjectId === null && (
            <button
              onClick={() => {
                exportSemesterToPDF(activeSemesterObj);
                notify('📄 Generating Semester Syllabus PDF...');
              }}
              className="btn-3d btn-3d-indigo px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">picture_as_pdf</span>
              <span>Download PDF</span>
            </button>
          )}

          {selectedYear !== null && (
            <button
              onClick={() => {
                if (selectedSubjectId !== null) {
                  setSelectedSubjectId(null);
                } else if (selectedSemesterId !== null) {
                  setSelectedSemesterId(null);
                } else {
                  setSelectedYear(null);
                }
              }}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              <span>Back</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LEVEL 1: YEAR SELECTOR SCREEN (Visible when selectedYear === null)        */}
      {/* ========================================================================= */}
      {selectedYear === null && (
        <div className="space-y-6">
          <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-extrabold uppercase tracking-widest">
                Hierarchical Degree Roadmap
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Select Your Academic Year</h2>
              <p className="text-sm text-slate-300 max-w-2xl">
                4-year structured CS pathway divided into 8 semesters. Click any year to drill down into its semester subjects, concept notes, mind maps, and project blueprints.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {YEARS_DATA.map((yearObj) => {
              const yearProgress = getYearProgress(yearObj.year);
              return (
                <div
                  key={yearObj.year}
                  onClick={() => handleGoToYear(yearObj.year)}
                  className="bg-slate-900/90 border border-slate-800 hover:border-amber-400/60 transition-all duration-300 rounded-3xl p-6 shadow-xl flex flex-col justify-between group cursor-pointer hover:scale-[1.01]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black tracking-wide">
                        {yearObj.tagline}
                      </span>
                      <span className="text-xs font-extrabold text-slate-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-indigo-400">check_circle</span>
                        <span>{yearProgress}% Progress</span>
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                        {yearObj.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {yearObj.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar & Open CTA */}
                  <div className="pt-6 mt-6 border-t border-slate-800/80 space-y-3">
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${yearProgress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-400">2 Semesters Included</span>
                      <span className="font-black text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Explore Year {yearObj.year}</span>
                        <span className="material-symbols-outlined text-base">chevron_right</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEVEL 2: SEMESTER SELECTOR SCREEN (selectedYear !== null & semId === null) */}
      {/* ========================================================================= */}
      {selectedYear !== null && selectedSemesterId === null && activeYearObj && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {activeYearObj.title} — Choose Semester
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Click a semester below to view its full subject list, subtopics, and semester project ideas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {semestersData
              .filter((sem) => sem.year === selectedYear)
              .map((semester) => {
                const semProgress = getSemesterProgress(semester);
                return (
                  <div
                    key={semester.id}
                    onClick={() => handleGoToSemester(semester.id)}
                    className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 transition-all rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between group cursor-pointer hover:scale-[1.01]"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-black">
                          {semester.title}
                        </span>
                        <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                          {semProgress}% Complete
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-indigo-300 transition-colors">
                          {semester.subtitle}
                        </h3>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                          {semester.description}
                        </p>
                      </div>

                      {/* Subject Badges */}
                      <div className="space-y-1.5 pt-2">
                        <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                          Core Subjects ({semester.subjects.length}):
                        </div>
                        <ul className="space-y-1">
                          {semester.subjects.map((sub) => (
                            <li
                              key={sub.id}
                              className="text-xs font-semibold text-slate-300 flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                              <span>{sub.title}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Footer CTA */}
                    <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-400">
                        {semester.suggestedProjects.length} Hands-On Projects
                      </span>
                      <span className="btn-3d btn-3d-indigo px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>View Semester Syllabus</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEVEL 3: SUBJECT LIST + PROJECTS + PDF (semId !== null & subjectId === null)*/}
      {/* ========================================================================= */}
      {selectedSemesterId !== null && selectedSubjectId === null && activeSemesterObj && (
        <div className="space-y-8">
          {/* Semester Overview Header Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-black uppercase tracking-wider">
                  {activeSemesterObj.title} Syllabus
                </span>
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-extrabold">
                  Year {activeSemesterObj.year}
                </span>
              </div>
              <h2 className="text-2xl font-black text-white">{activeSemesterObj.subtitle}</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeSemesterObj.description} Click any subject card below to access detailed chapter notes, subtopic checklists, visual mind maps, and tutorial videos.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-3 min-w-[200px]">
              <button
                onClick={() => {
                  exportSemesterToPDF(activeSemesterObj);
                  notify('📄 Exporting Semester Syllabus to PDF...');
                }}
                className="btn-3d btn-3d-amber w-full px-5 py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">download</span>
                <span>Download Syllabus PDF</span>
              </button>
            </div>
          </div>

          {/* Subject Cards Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-400">library_books</span>
              <span>Semester Subjects & Chapters ({activeSemesterObj.subjects.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeSemesterObj.subjects.map((sub) => {
                const subProg = getSubjectProgress(sub);
                const completedCount = sub.topics.filter((t) => t.completed).length;

                return (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubjectId(sub.id)}
                    className="bg-slate-900/90 border border-slate-800 hover:border-amber-400/60 transition-all rounded-3xl p-6 shadow-xl flex flex-col justify-between group cursor-pointer hover:scale-[1.01]"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-black">
                          {sub.category}
                        </span>
                        <span className="text-xs font-black text-amber-400">
                          {subProg}%
                        </span>
                      </div>

                      <h4 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                        {sub.title}
                      </h4>

                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {sub.description}
                      </p>
                    </div>

                    <div className="pt-5 mt-5 border-t border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                        <span>Topics Completed</span>
                        <span>{completedCount} / {sub.topics.length}</span>
                      </div>

                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-amber-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${subProg}%` }}
                        />
                      </div>

                      <button className="w-full btn-3d btn-3d-indigo py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 group-hover:bg-indigo-600 transition-all">
                        <span>Open Chapter</span>
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Suggested Projects Section (Bottom of Semester View) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">rocket_launch</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Suggested Hands-On Projects</h3>
                <p className="text-xs text-slate-400">
                  Recommended practical engineering projects for {activeSemesterObj.title} to reinforce theoretical concepts.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeSemesterObj.suggestedProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-slate-950/80 border border-indigo-500/30 rounded-2xl p-5 shadow-md flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-indigo-300">{proj.title}</h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-extrabold uppercase">
                        {proj.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Stack:</span>
                    {proj.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEVEL 4: CHAPTER DETAIL PAGE (selectedSubjectId !== null & activeSubjectObj)*/}
      {/* ========================================================================= */}
      {selectedSubjectId !== null && activeSubjectObj && activeSemesterObj && (
        <div className="space-y-8">
          {/* Chapter Overview Header */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-black">
                {activeSemesterObj.title} • {activeSubjectObj.category}
              </span>
              <span className="text-xs font-extrabold text-slate-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-amber-400">check_circle</span>
                <span>
                  {getSubjectProgress(activeSubjectObj)}% Completed
                </span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">{activeSubjectObj.title}</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {activeSubjectObj.description}
            </p>
          </div>

          {/* Section 1: Interactive Subtopics Checklist */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">checklist</span>
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Subtopics Checklist</h3>
                  <p className="text-xs text-slate-400">Tick topics as you study. Progress saves to your student profile.</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-black">
                {activeSubjectObj.topics.filter((t) => t.completed).length} / {activeSubjectObj.topics.length} Complete
              </span>
            </div>

            <div className="max-h-[420px] overflow-y-auto space-y-2.5 pr-1.5 custom-scrollbar">
              {activeSubjectObj.topics.map((topic, index) => (
                <label
                  key={topic.id}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    topic.completed
                      ? 'bg-indigo-950/30 border-indigo-500/40 text-indigo-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono font-bold text-slate-500 w-5 text-right">
                      {index + 1}.
                    </span>
                    <input
                      type="checkbox"
                      checked={topic.completed}
                      onChange={() => {
                        onToggleTopicCheck(activeSemesterObj.id, activeSubjectObj.id, topic.id);
                        notify(topic.completed ? 'Topic marked incomplete' : '✨ Topic completed! Progress saved.');
                      }}
                      className="w-5 h-5 accent-amber-400 rounded cursor-pointer shrink-0"
                    />
                    <span className={`text-xs font-extrabold ${topic.completed ? 'line-through opacity-70' : ''}`}>
                      {topic.name}
                    </span>
                  </div>

                  {topic.completed && (
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                      Done
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Section 2: Chapter Notes */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">sticky_note_2</span>
              </div>
              <div>
                <h3 className="text-base font-black text-white">Chapter Concept Notes</h3>
                <p className="text-xs text-slate-400">Core theoretical summary, formulas, and architecture takeaways.</p>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-inner">
              <MarkdownRenderer content={activeSubjectObj.notes} variant="notes" />
            </div>
          </div>

          {/* Section 3: Chapter Visual Mind Map */}
          <MindMapDiagram data={activeSubjectObj.mindMap} />

          {/* Section 4: Relevant YouTube Tutorial Resource */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">play_circle</span>
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Recommended Video Tutorial</h3>
                  <p className="text-xs text-slate-400">Hand-picked video lecture to deepen chapter mastery.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white">{activeSubjectObj.youtubeTitle}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-red-400">subscriptions</span>
                  <span>YouTube Lecture Resource</span>
                </p>
              </div>

              <a
                href={activeSubjectObj.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-3d btn-3d-amber px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer text-slate-950 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-base">open_in_new</span>
                <span>Watch Video</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
