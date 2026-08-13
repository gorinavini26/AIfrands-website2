import React, { useState } from 'react';
import { AITool } from '../types';

interface AIToolsViewProps {
  aiTools: AITool[];
  onToggleBookmark: (id: string) => void;
  onOpenAIAssistant: () => void;
}

export const AIToolsView: React.FC<AIToolsViewProps> = ({
  aiTools,
  onToggleBookmark,
  onOpenAIAssistant,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  const categories = ['All', 'LLM', 'Developer Tool', 'Research', 'Creative', 'Writing'];

  const filteredTools = aiTools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.provider.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || tool.category === selectedCategory;

    const matchesBookmark = !onlyBookmarked || tool.bookmarked;

    return matchesSearch && matchesCategory && matchesBookmark;
  });

  // Top recommended tools
  const recommendedTools = aiTools.filter(
    (t) => ['tool_5', 'tool_1', 'tool_3', 'tool_6'].includes(t.id)
  );

  return (
    <div className="flex flex-col w-full text-slate-800 bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-slate-100 dark:from-slate-950 dark:via-indigo-950/40 dark:to-slate-900 min-h-screen p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full space-y-4 sm:space-y-6">
        
        {/* HERO SECTION BANNER - ROSE / FLAME VIOLET ACCENT */}
        <div className="bg-gradient-to-r from-rose-800 via-purple-900 to-slate-950 rounded-3xl p-4 sm:p-8 text-white shadow-xl shadow-rose-950/25 border-b-4 border-rose-950 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-400 text-slate-950 text-xs font-extrabold shadow-sm border-b-2 border-rose-600">
              <span>🤖</span> Curated AI Directory
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              AI Tools & Smart Tutor Suite
            </h1>
            <p className="text-xs sm:text-sm text-rose-100/90 font-medium leading-relaxed">
              Pair programming assistants, LLMs, research paper tools, and code debuggers. External links open directly in new tabs.
            </p>
          </div>

          <div className="shrink-0 relative z-10">
            <button
              onClick={onOpenAIAssistant}
              className="btn-3d btn-3d-amber py-3.5 px-6 text-slate-950 font-extrabold text-sm flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              <span>Launch Embedded AI Tutor</span>
            </button>
          </div>
        </div>

        {/* TOP PICKS FOR CS MAJORS */}
        <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center font-extrabold text-xl">
                ⭐
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Recommended Toolkits for CS Majors</h2>
                <p className="text-xs text-slate-500 font-medium">Hand-picked by faculty for coding, debugging & synthesis</p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
              Top Picks
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedTools.map((tool) => (
              <div
                key={`rec_${tool.id}`}
                className="bg-slate-50 hover:bg-white border-2 border-slate-200/90 hover:border-indigo-400 rounded-2xl p-5 transition-all shadow-2xs flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-extrabold uppercase rounded-full">
                      {tool.category}
                    </span>
                    <button
                      onClick={() => onToggleBookmark(tool.id)}
                      className={`p-1.5 rounded-xl transition-colors ${
                        tool.bookmarked ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={tool.bookmarked ? 'Saved' : 'Save Tool'}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {tool.bookmarked ? 'bookmark' : 'bookmark_border'}
                      </span>
                    </button>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-wider mb-2">
                    {tool.provider}
                  </p>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                </div>

                {/* ONE CLEAR PRIMARY BUTTON */}
                <div className="pt-4 border-t border-slate-200/80 mt-4 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-1">
                    <span>✅</span> Verified
                  </span>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noreferrer"
                    title={`Opens ${tool.name} in a new browser tab`}
                    className="py-2 px-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-xs inline-flex items-center gap-1.5 border-b-2 border-indigo-800 active:border-b-0 active:translate-y-0.5"
                  >
                    <span>Launch</span>
                    <span className="text-[10px] opacity-80 font-normal">(New Tab)</span>
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-4 rounded-3xl border-2 border-slate-200/90 shadow-xs">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tools by name, provider, or topic (e.g., Cursor, Gemini)..."
              className="w-full bg-slate-50 text-slate-800 text-xs font-bold rounded-2xl py-2.5 pl-10 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 font-extrabold text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}

            <button
              onClick={() => setOnlyBookmarked(!onlyBookmarked)}
              className={`px-3.5 py-2 rounded-2xl whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
                onlyBookmarked
                  ? 'bg-amber-400 text-slate-950 font-extrabold border-b-2 border-amber-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {onlyBookmarked ? 'bookmark' : 'bookmark_border'}
              </span>
              Saved ({aiTools.filter((t) => t.bookmarked).length})
            </button>
          </div>
        </div>

        {/* ALL AI TOOLS GRID */}
        {filteredTools.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-10 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 rounded-2xl flex items-center justify-center font-extrabold text-2xl mx-auto shadow-xs">
              🤖
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {onlyBookmarked ? 'No Bookmarked AI Tools Yet' : 'No AI Tools Match Your Search'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              {onlyBookmarked
                ? 'Save your favorite LLMs, debuggers, and research assistants by clicking the bookmark icon on any tool card.'
                : `We couldn't find any tools matching "${searchTerm}". Try resetting your filter or searching for another keyword.`}
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setOnlyBookmarked(false);
                }}
                className="btn-3d btn-3d-indigo py-2.5 px-5 text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Reset Filters & Show All Tools</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="card-3d p-5 flex flex-col justify-between group hover:-translate-y-1 transition-all"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-11 h-11 bg-indigo-50 dark:bg-indigo-950 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-2xl">
                        {tool.icon}
                      </span>
                    </div>

                    <button
                      onClick={() => onToggleBookmark(tool.id)}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        tool.bookmarked
                          ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-400'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={tool.bookmarked ? 'Saved' : 'Save Tool'}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {tool.bookmarked ? 'bookmark' : 'bookmark_border'}
                      </span>
                    </button>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold uppercase tracking-wider mb-2">
                    {tool.provider}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed line-clamp-3">
                    {tool.description}
                  </p>
                </div>

                {/* ONE CLEAR BUTTON PER CARD */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                  <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-extrabold rounded-full uppercase">
                    {tool.category}
                  </span>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noreferrer"
                    title={`Opens ${tool.name} in a new browser tab`}
                    className="btn-3d btn-3d-indigo text-xs py-1.5 px-3 font-extrabold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Launch</span>
                    <span className="text-[10px] opacity-80 font-normal">(New Tab)</span>
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
