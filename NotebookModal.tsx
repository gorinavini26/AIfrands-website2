import React from 'react';
import { Notebook } from '../types';
import { MarkdownNotesRenderer } from './MarkdownNotesRenderer';

interface NotebookModalProps {
  notebook: Notebook | null;
  onClose: () => void;
}

export const NotebookModal: React.FC<NotebookModalProps> = ({
  notebook,
  onClose,
}) => {
  if (!notebook) return null;

  const ytSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(notebook.title + ' tutorial')}`;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-y-auto">
      <div className="bg-slate-100 border border-slate-300/80 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Reader Top Bar */}
        <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 text-indigo-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">
                auto_stories
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-400/30">
                  {notebook.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Updated {notebook.updatedAt} • {notebook.fileCount} sources
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white mt-0.5 tracking-tight line-clamp-1">
                {notebook.title}
              </h2>
            </div>
          </div>

          {/* Related YouTube Tutorial & Close Controls */}
          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
            {/* Related YouTube Tutorial Button */}
            <a
              href={ytSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-extrabold shadow-md shadow-red-600/30 border-b-2 border-red-800 active:border-b-0 active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
              title="Search related YouTube video tutorials"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>Related YouTube Tutorial</span>
              <span className="material-symbols-outlined text-xs">open_in_new</span>
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Close reader"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Notebook Summary Sub-banner */}
        {notebook.summary && (
          <div className="px-6 py-3 bg-indigo-900/10 border-b border-indigo-100/80 flex items-start gap-2.5 text-xs text-indigo-950 font-medium">
            <span className="material-symbols-outlined text-indigo-600 text-base shrink-0 mt-0.5">
              lightbulb
            </span>
            <div>
              <strong className="font-extrabold text-indigo-900 uppercase text-[10px] tracking-wider block">
                Synthesis Summary
              </strong>
              <p className="leading-relaxed text-slate-700">{notebook.summary}</p>
            </div>
          </div>
        )}

        {/* Scrollable Main Reader Body */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-100/60">
          <MarkdownNotesRenderer
            title={notebook.title}
            category={notebook.category}
            content={
              notebook.content ||
              `# ${notebook.title}\n\nCategory: ${notebook.category}\n\nNo detailed notes content provided.`
            }
          />
        </div>

        {/* Reader Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200/90 flex items-center justify-between text-xs text-slate-500 font-medium shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-[11px]">
              AI Frands Notebook Reader • Ready for Study
            </span>
          </div>

          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Close Reader
          </button>
        </div>
      </div>
    </div>
  );
};
