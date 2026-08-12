import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  variant?: 'light' | 'chat' | 'dark' | 'notes';
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
  variant = 'chat',
}) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const handleCopyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  let codeBlockCounter = 0;
  const isNotes = variant === 'notes';

  return (
    <div className={`markdown-content space-y-2 text-xs leading-relaxed ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className={isNotes ? "text-xl sm:text-2xl font-black text-white mt-5 mb-3 pb-2 border-b-2 border-indigo-500/30 flex items-center gap-2" : "text-lg sm:text-xl font-extrabold text-indigo-900 dark:text-indigo-300 mt-4 mb-2 pb-1 border-b border-indigo-200 dark:border-indigo-800 flex items-center gap-2"}>
              <span className="text-amber-400 font-mono">#</span>
              <span>{children}</span>
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className={isNotes ? "text-lg sm:text-xl font-black text-amber-300 mt-6 mb-3 pt-3 border-t border-slate-800 flex items-center gap-2" : "text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-3.5 mb-1.5 flex items-center gap-1.5"}>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shrink-0 shadow-xs shadow-amber-400/50" />
              <span>{children}</span>
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className={isNotes ? "text-base sm:text-lg font-extrabold text-amber-300 dark:text-amber-300 mt-6 mb-3 pt-3 border-t border-slate-800/80 flex items-center gap-2.5 tracking-tight" : "text-sm font-extrabold text-indigo-800 dark:text-indigo-400 mt-3 mb-1"}>
              {isNotes && (
                <span className="px-2 py-0.5 rounded-md bg-amber-400/15 text-amber-300 border border-amber-400/30 text-xs font-black shrink-0">
                  📌 Concept
                </span>
              )}
              <span>{children}</span>
            </h3>
          ),
          p: ({ children }) => (
            <p className={isNotes ? "my-2.5 text-slate-200 font-normal text-xs sm:text-sm leading-relaxed" : "my-1.5 text-slate-800 dark:text-slate-200 font-medium leading-relaxed"}>
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className={isNotes ? "font-extrabold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-1.5 py-0.5 rounded-md mx-0.5 inline-block text-[0.93em] shadow-2xs" : "font-extrabold text-indigo-900 dark:text-amber-300 bg-indigo-50 dark:bg-indigo-950/80 px-1.5 py-0.5 rounded-md border border-indigo-200/80 dark:border-indigo-800/80"}>
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-slate-300 dark:text-slate-300 font-serif">
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul className={isNotes ? "my-3 space-y-2 pl-3 border-l-2 border-indigo-500/40" : "my-2 space-y-1.5 pl-2 border-l-2 border-indigo-300 dark:border-indigo-800"}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className={isNotes ? "my-3 space-y-2.5 pl-5 list-decimal marker:text-amber-400 marker:font-black text-slate-200" : "my-2 space-y-1.5 pl-4 list-decimal marker:font-extrabold marker:text-indigo-600 dark:marker:text-indigo-400"}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className={isNotes ? "text-slate-200 font-medium text-xs sm:text-sm leading-relaxed pl-1 list-disc marker:text-amber-400 marker:font-black" : "text-slate-800 dark:text-slate-200 font-medium pl-1 leading-relaxed"}>
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-3 p-3.5 bg-amber-500/10 border-l-4 border-amber-400 text-amber-200 rounded-r-2xl text-xs font-medium italic space-y-1">
              {children}
            </blockquote>
          ),
          code: ({ node, inline, className: codeClassName, children, ...props }: any) => {
            const rawCode = String(children).replace(/\n$/, '');
            const isSingleLine = !rawCode.includes('\n');

            if (inline || isSingleLine) {
              return (
                <code
                  className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-900 text-emerald-400 font-mono text-[11px] font-bold border border-slate-800 inline-block"
                  {...props}
                >
                  {rawCode}
                </code>
              );
            }

            const currentIndex = codeBlockCounter++;
            const isCopied = copiedCodeIndex === currentIndex;

            return (
              <div className="my-3 rounded-2xl bg-slate-950 border-2 border-slate-800 shadow-lg overflow-hidden font-mono text-xs">
                {/* Code Block Header */}
                <div className="bg-slate-900/90 px-4 py-2 flex items-center justify-between text-[11px] text-slate-300 font-bold border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </span>
                    <span className="text-slate-400 text-[10px] uppercase tracking-wider font-extrabold ml-1">
                      Code Snippet
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyCode(rawCode, currentIndex)}
                    className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-extrabold transition-all flex items-center gap-1 cursor-pointer border border-slate-700 active:scale-95"
                    title="Copy code to clipboard"
                  >
                    <span className="material-symbols-outlined text-xs">
                      {isCopied ? 'check' : 'content_copy'}
                    </span>
                    <span>{isCopied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                {/* Code Body */}
                <pre className="p-4 overflow-x-auto text-emerald-300 leading-relaxed font-mono text-xs font-semibold">
                  <code>{rawCode}</code>
                </pre>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
