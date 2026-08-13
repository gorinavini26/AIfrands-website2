import React, { useState } from 'react';
import { Notebook, RoadmapModule } from '../types';

interface ResourcesViewProps {
  notebooks: Notebook[];
  roadmapModules?: RoadmapModule[];
  onOpenNotebook: (nb: Notebook) => void;
  onCreateNotebook: (title: string, category: string, summary: string, content: string) => void;
  onToggleTopicCheck?: (moduleId: string, topicIndex: number) => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  notebooks,
  roadmapModules,
  onOpenNotebook,
  onCreateNotebook,
  onToggleTopicCheck,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Operating Systems');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    onCreateNotebook(newTitle, newCategory, newSummary, newContent);
    setNewTitle('');
    setNewSummary('');
    setNewContent('');
    setShowCreateModal(false);
  };

  return (
    <div className="flex flex-col w-full text-slate-800 bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-slate-100 dark:from-slate-950 dark:via-indigo-950/40 dark:to-slate-900 min-h-screen p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full space-y-4 sm:space-y-6">
        
        {/* HERO BANNER - FUCHSIA / VIOLET ACCENT */}
        <div className="bg-gradient-to-r from-purple-800 via-fuchsia-900 to-slate-950 rounded-3xl p-4 sm:p-8 text-white shadow-xl shadow-fuchsia-950/25 border-b-4 border-purple-950 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-400 text-slate-950 text-xs font-extrabold shadow-sm border-b-2 border-fuchsia-600">
              <span>📚</span> Academic Repository
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              NotebookLM Library & Course Notes
            </h1>
            <p className="text-xs sm:text-sm text-fuchsia-100/90 font-medium leading-relaxed">
              Synthesized lecture notes, research paper summaries, and exam cheat-sheets.
            </p>
          </div>

          <div className="shrink-0 relative z-10">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-3d btn-3d-amber py-3.5 px-6 text-slate-950 font-extrabold text-sm flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>Create Study Notebook</span>
            </button>
          </div>
        </div>

        {/* Notebook Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {notebooks.length === 0 ? (
            <div className="col-span-full bg-white border-2 border-dashed border-slate-300 rounded-3xl p-10 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 bg-fuchsia-100 text-fuchsia-700 rounded-2xl flex items-center justify-center font-extrabold text-2xl mx-auto shadow-xs">
                📚
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Your Notebook Library is Empty</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Create your first AI-synthesized notebook to organize lecture slides, exam formula sheets, or research paper summaries in one place.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-3d btn-3d-amber py-2.5 px-5 text-slate-950 text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>Create First Notebook</span>
              </button>
            </div>
          ) : (
            notebooks.map((nb) => (
            <div
              key={nb.id}
              onClick={() => onOpenNotebook(nb)}
              className="card-3d p-6 cursor-pointer flex flex-col justify-between group space-y-4 border-l-4 border-l-indigo-500"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 font-extrabold text-[10px] rounded-full uppercase tracking-wider">
                    {nb.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-extrabold font-mono">
                    {nb.updatedAt}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {nb.title}
                </h3>

                <p className="text-xs text-slate-600 font-medium leading-relaxed mt-2 line-clamp-3">
                  {nb.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-extrabold">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="material-symbols-outlined text-base text-indigo-600">
                    description
                  </span>
                  {nb.fileCount} Sources Linked
                </span>

                <button className="btn-3d btn-3d-indigo py-2 px-4 text-xs font-extrabold flex items-center gap-1">
                  <span>Read Notes</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
            </div>
          )))}
        </div>

        {/* TOPIC CHECKLISTS & YOUTUBE TUTORIAL FINDER */}
        {roadmapModules && roadmapModules.length > 0 && (
          <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest">// YouTube Tutorial Finder</span>
                <h2 className="text-lg font-extrabold text-slate-900">Course Topic Checklists & Video Tutorials</h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Click "Watch Tutorial" next to any topic to automatically open a YouTube video search.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {roadmapModules.map((mod) => (
                <div key={mod.id} className="bg-slate-50 border-2 border-slate-200/90 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                    <div>
                      <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">
                        Year {mod.year} • {mod.semesters}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900">{mod.title}</h3>
                    </div>
                    <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full text-[10px] font-extrabold uppercase">
                      {mod.topics.filter((t) => t.completed).length}/{mod.topics.length} Done
                    </span>
                  </div>

                  <div className="space-y-2 pt-1">
                    {mod.topics.map((t, idx) => {
                      const ytQuery = encodeURIComponent(`${t.name} tutorial`);
                      const ytUrl = `https://www.youtube.com/results?search_query=${ytQuery}`;

                      return (
                        <div
                          key={idx}
                          onClick={() => onToggleTopicCheck && onToggleTopicCheck(mod.id, idx)}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl transition-all border gap-2 ${
                            onToggleTopicCheck ? 'cursor-pointer' : ''
                          } ${
                            t.completed
                              ? 'bg-emerald-50/80 border-emerald-200 text-slate-900'
                              : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
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
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const existing = notebooks.find((n) =>
                                  n.title.toLowerCase().includes(t.name.toLowerCase()) ||
                                  t.name.toLowerCase().includes(n.category.toLowerCase()) ||
                                  n.category.toLowerCase().includes(mod.title.toLowerCase())
                                );
                                if (existing) {
                                  onOpenNotebook(existing);
                                } else {
                                  onOpenNotebook({
                                    id: `nb_dyn_${mod.id}_${idx}`,
                                    title: `${t.name} Notes`,
                                    category: mod.title,
                                    summary: `Synthesized study guide and reference material covering ${t.name}.`,
                                    updatedAt: 'Just now',
                                    fileCount: 3,
                                    content: `# ${t.name} Deep Dive

## 1. Core Principles & Overview
- **${t.name}** is an essential domain in ${mod.title}.
- Focuses on achieving maximum system efficiency and predictable algorithmic execution.
- Key concepts include **Memory Layout**, **Data Representation**, and **Asymptotic Analysis**.

## 2. Key Mechanisms & Implementation
- **Core Abstraction**: Provides clean API contracts and isolation.
- **Performance Optimization**: Minimizes resource contention and cache misses.
- **Error Handling**: Guarantees system resilience under high load.

## 3. Practice & Interview Applications
- Frequently requested in technical CS coding assessments and system architecture interviews.
- Always verify edge cases and memory constraints before deployment.`
                                  });
                                }
                              }}
                              className="py-1 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-300 rounded-lg text-[10px] font-extrabold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                              title={`Read notes on ${t.name}`}
                            >
                              <span className="material-symbols-outlined text-xs">description</span>
                              <span>Read Notes</span>
                            </button>

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
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: Create Notebook */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  <span>Create New Study Notebook</span>
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-xl"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-600 mb-1 uppercase tracking-wider">
                    Notebook Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Distributed Systems & Consensus Protocols"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-2xl py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-600 mb-1 uppercase tracking-wider">
                    Course Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-2xl py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Data Structures">Data Structures & Algorithms</option>
                    <option value="Operating Systems">Operating Systems</option>
                    <option value="Web Development">Web Development</option>
                    <option value="AI / Machine Learning">AI / Machine Learning</option>
                    <option value="Database Systems">Database Systems</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-600 mb-1 uppercase tracking-wider">
                    Summary
                  </label>
                  <input
                    type="text"
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    placeholder="Brief description of lecture synthesis..."
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-2xl py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-600 mb-1 uppercase tracking-wider">
                    Markdown Notes Content
                  </label>
                  <textarea
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="# Key Takeaways & Exam Preparation Notes..."
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-mono text-xs rounded-2xl p-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-700 font-extrabold text-xs hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs border-b-4 border-amber-600 active:border-b-0 active:translate-y-0.5 shadow-md transition-all"
                  >
                    Save Notebook
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
