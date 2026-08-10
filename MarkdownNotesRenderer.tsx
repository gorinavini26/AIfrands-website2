import React, { useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface MarkdownNotesRendererProps {
  title: string;
  category: string;
  content: string;
}

export const MarkdownNotesRenderer: React.FC<MarkdownNotesRendererProps> = ({
  title,
  category,
  content,
}) => {
  const [activeTocId, setActiveTocId] = useState<string | null>(null);

  // Helper to parse text for bold terms (**term**) and inline code (`code`)
  const renderFormattedText = (text: string) => {
    // Regex matches **bold term** OR `code`
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const term = part.slice(2, -2);
        return (
          <span
            key={index}
            className="inline-flex items-center px-2 py-0.5 mx-0.5 rounded-md bg-indigo-50 border border-indigo-200/90 text-indigo-800 font-extrabold text-[0.9em] font-mono shadow-2xs hover:bg-indigo-100 hover:border-indigo-300 transition-colors cursor-pointer"
            title={`Glossary term: ${term}`}
          >
            {term}
          </span>
        );
      } else if (part.startsWith('`') && part.endsWith('`')) {
        const codeText = part.slice(1, -1);
        return (
          <code
            key={index}
            className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-100 border border-slate-200/80 text-purple-700 font-mono text-xs font-bold"
          >
            {codeText}
          </code>
        );
      }
      return part;
    });
  };

  // Parse markdown lines into structured elements & TOC
  const lines = content.split('\n');
  const tocList: TocItem[] = [];
  let headingCounter = 0;

  // Pre-pass to extract TOC items
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('#')) {
      const match = trimmed.match(/^(#{1,3})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        // Strip markdown bold if present in heading text
        const text = match[2].replace(/\*\*/g, '');
        const id = `notes-heading-${headingCounter++}`;
        tocList.push({ id, text, level });
      }
    }
  });

  // Render element pass
  let currentHeadingIndex = 0;
  const renderedElements: React.ReactNode[] = [];
  let currentListItems: React.ReactNode[] = [];

  const flushList = (key: string) => {
    if (currentListItems.length > 0) {
      renderedElements.push(
        <ul key={key} className="space-y-3 my-4 pl-1 sm:pl-2">
          {currentListItems}
        </ul>
      );
      currentListItems = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Check for Headings
    if (trimmed.startsWith('#')) {
      flushList(`list-before-${idx}`);
      const match = trimmed.match(/^(#{1,3})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const rawText = match[2];
        const headingObj = tocList[currentHeadingIndex++];
        const id = headingObj?.id || `heading-${idx}`;

        if (level === 1) {
          renderedElements.push(
            <h1
              id={id}
              key={idx}
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-8 mb-4 pb-3 border-b-2 border-indigo-500/20 flex items-center gap-2.5 scroll-mt-6"
            >
              <span className="material-symbols-outlined text-indigo-600 text-2xl sm:text-3xl">
                auto_stories
              </span>
              <span>{renderFormattedText(rawText)}</span>
            </h1>
          );
        } else if (level === 2) {
          renderedElements.push(
            <h2
              id={id}
              key={idx}
              className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-3 pt-2 border-b border-slate-200/90 flex items-center gap-2 scroll-mt-6"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block shrink-0"></span>
              <span>{renderFormattedText(rawText)}</span>
            </h2>
          );
        } else {
          renderedElements.push(
            <h3
              id={id}
              key={idx}
              className="text-lg font-bold text-indigo-900 mt-6 mb-2 flex items-center gap-2 scroll-mt-6"
            >
              <span className="material-symbols-outlined text-indigo-500 text-base">
                arrow_right
              </span>
              <span>{renderFormattedText(rawText)}</span>
            </h3>
          );
        }
        return;
      }
    }

    // Check for Bullet points (- or *)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const bulletText = trimmed.substring(2);
      currentListItems.push(
        <li key={`li-${idx}`} className="flex items-start gap-3 leading-relaxed text-slate-700 text-sm sm:text-base">
          <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shrink-0 mt-2 shadow-2xs" />
          <span className="flex-1">{renderFormattedText(bulletText)}</span>
        </li>
      );
      return;
    }

    // If not a bullet point, flush list
    flushList(`list-flush-${idx}`);

    // Check for empty line / spacing
    if (!trimmed) {
      return;
    }

    // Check for code blocks
    if (trimmed.startsWith('```')) {
      return; // handled simple or raw code
    }

    // Regular Paragraph
    renderedElements.push(
      <p key={idx} className="my-3 leading-relaxed text-slate-700 text-sm sm:text-base">
        {renderFormattedText(trimmed)}
      </p>
    );
  });

  // Final list flush if any remaining
  flushList('list-flush-final');

  // Search URLs for Additional Resources
  const docSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(title + ' official documentation MIT OCW notes')}`;
  const gfgSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(title + ' GeeksforGeeks tutorial article')}`;
  const practiceSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(title + ' practice problems LeetCode quiz')}`;

  const scrollToSection = (id: string) => {
    setActiveTocId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start relative">
      {/* Sticky Table of Contents Sidebar (Desktop lg+) */}
      {tocList.length > 0 && (
        <aside className="hidden lg:block w-64 shrink-0 sticky top-2 bg-slate-50 border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2.5">
            <span className="material-symbols-outlined text-indigo-600 text-base">
              toc
            </span>
            <span>Table of Contents</span>
          </div>

          <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1 text-xs">
            {tocList.map((item) => {
              const isSub = item.level === 3;
              const isActive = activeTocId === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all flex items-center gap-1.5 leading-snug cursor-pointer ${
                    isSub ? 'ml-3 text-slate-500 hover:text-slate-900' : 'font-bold text-slate-700 hover:text-indigo-600'
                  } ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-extrabold border-l-2 border-indigo-600'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{item.text}</span>
                </button>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-400 font-medium">
            💡 Click any section to jump directly
          </div>
        </aside>
      )}

      {/* Main Article Area */}
      <div className="flex-1 w-full max-w-3xl mx-auto space-y-8">
        
        {/* Mobile TOC Quick Navigation Bar (Visible on sm/md) */}
        {tocList.length > 0 && (
          <div className="block lg:hidden bg-indigo-50/80 border border-indigo-100 rounded-2xl p-3 shadow-xs">
            <details className="group">
              <summary className="flex items-center justify-between font-bold text-xs text-indigo-900 cursor-pointer list-none">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600 text-base">
                    toc
                  </span>
                  <span>Jump to Section ({tocList.length} Headings)</span>
                </span>
                <span className="material-symbols-outlined text-sm group-open:rotate-180 transition-transform">
                  expand_more
                </span>
              </summary>
              <div className="mt-3 pt-3 border-t border-indigo-200/60 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                {tocList.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left py-1 px-2 rounded hover:bg-indigo-100/70 text-indigo-800 font-medium truncate"
                  >
                    • {item.text}
                  </button>
                ))}
              </div>
            </details>
          </div>
        )}

        {/* Article Body Content */}
        <article className="prose prose-slate max-w-none bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs leading-relaxed space-y-2">
          {renderedElements}
        </article>

        {/* ADDITIONAL RESOURCES SECTION AT BOTTOM */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">
                // Expand Your Knowledge
              </span>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <span>📚</span> Additional Learning Resources
              </h3>
            </div>
            <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold border border-indigo-400/30">
              Curated Search
            </span>
          </div>

          <p className="text-xs text-slate-300 font-medium">
            Explore verified external guides, official university documentation, and practice problem sets for <strong className="text-white">{title}</strong>:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Resource 1: Docs & Textbooks */}
            <a
              href={docSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/80 rounded-2xl p-4 transition-all group flex flex-col justify-between space-y-3 cursor-pointer"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-indigo-400 text-xl">
                    menu_book
                  </span>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    Official
                  </span>
                </div>
                <h4 className="text-xs font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                  Official Docs & Notes
                </h4>
                <p className="text-[11px] text-slate-400 font-medium line-clamp-2">
                  MIT OCW, university lecture slides, and specs.
                </p>
              </div>
              <div className="flex items-center justify-between text-[10px] font-extrabold text-indigo-400 pt-2 border-t border-slate-700/60">
                <span>Search Docs</span>
                <span className="material-symbols-outlined text-xs group-hover:translate-x-0.5 transition-transform">
                  open_in_new
                </span>
              </div>
            </a>

            {/* Resource 2: GeeksforGeeks Article */}
            <a
              href={gfgSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/80 rounded-2xl p-4 transition-all group flex flex-col justify-between space-y-3 cursor-pointer"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-emerald-400 text-xl">
                    code_blocks
                  </span>
                  <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    Tutorial
                  </span>
                </div>
                <h4 className="text-xs font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                  GeeksforGeeks Article
                </h4>
                <p className="text-[11px] text-slate-400 font-medium line-clamp-2">
                  Step-by-step algorithms and code implementations.
                </p>
              </div>
              <div className="flex items-center justify-between text-[10px] font-extrabold text-emerald-400 pt-2 border-t border-slate-700/60">
                <span>Read Articles</span>
                <span className="material-symbols-outlined text-xs group-hover:translate-x-0.5 transition-transform">
                  open_in_new
                </span>
              </div>
            </a>

            {/* Resource 3: Practice Problems */}
            <a
              href={practiceSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/80 rounded-2xl p-4 transition-all group flex flex-col justify-between space-y-3 cursor-pointer"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-amber-400 text-xl">
                    quiz
                  </span>
                  <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                    Practice
                  </span>
                </div>
                <h4 className="text-xs font-extrabold text-white group-hover:text-amber-300 transition-colors">
                  Practice Problems
                </h4>
                <p className="text-[11px] text-slate-400 font-medium line-clamp-2">
                  LeetCode problems, quiz questions, and interview tasks.
                </p>
              </div>
              <div className="flex items-center justify-between text-[10px] font-extrabold text-amber-400 pt-2 border-t border-slate-700/60">
                <span>Solve Quizzes</span>
                <span className="material-symbols-outlined text-xs group-hover:translate-x-0.5 transition-transform">
                  open_in_new
                </span>
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
