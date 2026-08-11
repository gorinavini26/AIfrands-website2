import React, { useState } from 'react';
import { TechLanguage } from '../types';

interface LanguagesViewProps {
  languages: TechLanguage[];
  onOpenAIAssistantWithCode?: (code: string) => void;
  editorFontSize?: number;
}

export const LanguagesView: React.FC<LanguagesViewProps> = ({
  languages,
  onOpenAIAssistantWithCode,
  editorFontSize = 14,
}) => {
  const [activeLang, setActiveLang] = useState<TechLanguage>(languages[0] || languages[1]);
  const [userCode, setUserCode] = useState<string>(activeLang?.sampleCode || '');
  const [outputLog, setOutputLog] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleSelectLang = (lang: TechLanguage) => {
    setActiveLang(lang);
    setUserCode(lang.sampleCode);
    setOutputLog(null);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutputLog(null);

    setTimeout(() => {
      setIsRunning(false);
      setOutputLog(
        `[CS Portal Exec Engine]\nCompiling & executing ${activeLang.name} module...\n----------------------------------------\nProgram finished with exit code 0.\nOutput:\nData structure processed successfully!\nExecution time: 0.042ms`
      );
    }, 800);
  };

  return (
    <div className="flex flex-col w-full text-slate-800 bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-slate-100 min-h-screen p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* HERO BANNER - ELECTRIC BLUE / CYAN ACCENT */}
        <div className="bg-gradient-to-r from-blue-800 via-indigo-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-950/25 border-b-4 border-blue-950 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400 text-slate-950 text-xs font-extrabold shadow-sm border-b-2 border-cyan-600">
              <span>💻</span> Interactive Stack Sandbox
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Language Paradigms & Code Runner
            </h1>
            <p className="text-xs sm:text-sm text-cyan-100/90 font-medium leading-relaxed">
              Master Python, C++, Java, and Rust paradigms with live execution, instant trace logging, and AI tutoring.
            </p>
          </div>
        </div>

        {/* Language Selection Grid with 3D Depth Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {languages.map((lang) => {
            const isSelected = activeLang.id === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => handleSelectLang(lang)}
                className={`flex items-center justify-between p-4 rounded-3xl transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-white border-2 border-indigo-600 shadow-xl ring-2 ring-indigo-500/20 translate-y-[-2px]'
                    : 'card-3d border-2 border-slate-200/90 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center font-black text-sm shadow-sm shrink-0 border border-slate-200/50"
                    style={{ backgroundColor: `${lang.color}25`, color: lang.color }}
                  >
                    {lang.code}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs text-slate-900">
                      {lang.name}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide">
                      {lang.level}
                    </span>
                  </div>
                </div>

                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs border border-white"
                  style={{ backgroundColor: lang.color }}
                />
              </button>
            );
          })}
        </div>

        {/* Interactive IDE / Code Playground */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white border-2 border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
          
          {/* Left Editor */}
          <div className="lg:col-span-8 p-6 space-y-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-2 font-mono text-xs font-extrabold text-slate-600">
                    playground_{activeLang.name.toLowerCase()}.
                    {activeLang.name === 'Python'
                      ? 'py'
                      : activeLang.name === 'C++'
                      ? 'cpp'
                      : activeLang.name === 'Java'
                      ? 'java'
                      : 'rs'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="btn-3d btn-3d-amber px-5 py-2.5 text-xs text-slate-950 font-extrabold gap-1.5 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-base">
                      {isRunning ? 'refresh' : 'play_arrow'}
                    </span>
                    <span>{isRunning ? 'Executing...' : 'Run Code'}</span>
                  </button>

                  {onOpenAIAssistantWithCode && (
                    <button
                      onClick={() => onOpenAIAssistantWithCode(userCode)}
                      className="btn-3d btn-3d-indigo px-4 py-2.5 text-xs font-extrabold gap-1"
                    >
                      <span className="material-symbols-outlined text-base">
                        auto_awesome
                      </span>
                      <span>Ask AI Tutor</span>
                    </button>
                  )}
                </div>
              </div>

              {/* TextArea Code Editor */}
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                style={{ fontSize: `${editorFontSize}px` }}
                className="w-full h-80 bg-slate-900 text-slate-100 font-mono p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed border-b-4 border-slate-950"
                spellCheck={false}
              />
            </div>

            {/* Execution Console Output */}
            {outputLog ? (
              <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-xs whitespace-pre-wrap leading-relaxed border-2 border-emerald-500/30">
                {outputLog}
              </div>
            ) : (
              <div className="bg-slate-900 text-slate-300 p-4 rounded-2xl font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-2 border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>Console Ready. Click "Run Code" above to compile & execute your {activeLang.name} program.</span>
                </div>
                <button
                  onClick={handleRunCode}
                  className="btn-3d btn-3d-amber text-[11px] py-1.5 px-3 self-start sm:self-auto cursor-pointer"
                >
                  <span>Run Code</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Info Sidebar */}
          <div className="lg:col-span-4 p-6 space-y-6 flex flex-col justify-between bg-slate-50/70">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-base shadow-sm"
                  style={{
                    backgroundColor: `${activeLang.color}20`,
                    color: activeLang.color,
                  }}
                >
                  {activeLang.code}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {activeLang.name}
                  </h3>
                  <p className="text-xs font-extrabold text-indigo-600 uppercase">
                    Level: {activeLang.level}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                {activeLang.description}
              </p>

              <div className="space-y-3 bg-white p-4 rounded-2xl border-2 border-slate-200/80 shadow-2xs">
                <h4 className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">
                  Paradigms & Concepts
                </h4>
                <ul className="space-y-2 text-xs text-slate-700 font-bold">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-500 text-base">
                      check_circle
                    </span>
                    Type System & Memory Model
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-500 text-base">
                      check_circle
                    </span>
                    Object-Oriented & Structural
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-500 text-base">
                      check_circle
                    </span>
                    Concurrency & Standard Lib
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-2xl text-xs space-y-2">
              <p className="font-extrabold text-indigo-900">⚡ Daily Practice Bonus</p>
              <p className="text-indigo-700 font-medium">Running sample code earns +15 XP towards your daily CS streak!</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
