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
    <div className="flex flex-col w-full text-slate-800 bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* HERO SECTION BANNER */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/15 border-b-4 border-indigo-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold shadow-sm border-b-2 border-amber-600">
              <span>🤖</span> Curated AI Directory
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              AI Tools & Smart Tutor Suite
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 font-medium leading-relaxed">
              Pair programming assistants, LLMs, paper synthesis tools, and code debuggers.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={onOpenAIAssistant}
              className="py-3.5 px-6 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm rounded-2xl shadow-lg border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 cursor-pointer"
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
                    className="py-2 px-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-xs inline-flex items-center gap-1 border-b-2 border-indigo-800 active:border-b-0 active:translate-y-0.5"
                  >
                    <span>Launch</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 shadow-2xs hover:border-indigo-400 transition-all flex flex-col justify-between hover:shadow-xs group"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="w-11 h-11 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-2xl">
                      {tool.icon}
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleBookmark(tool.id)}
                    className={`p-2 rounded-xl transition-colors ${
                      tool.bookmarked
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
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
                <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3">
                  {tool.description}
                </p>
              </div>

              {/* ONE CLEAR BUTTON PER CARD */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-extrabold rounded-full uppercase">
                  {tool.category}
                </span>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-xs flex items-center gap-1 border-b-2 border-indigo-800 active:border-b-0 active:translate-y-0.5"
                >
                  <span>Launch</span>
                  <span className="material-symbols-outlined text-xs">open_in_new</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
