import React, { useState, useEffect } from 'react';
import { Assignment } from '../types';

interface AssignmentModalProps {
  assignment: Assignment | null;
  onClose: () => void;
  onSubmitAssignment: (assignmentId: string, submissionCode: string) => void;
  onShowToast: (msg: string) => void;
  editorFontSize?: number;
  onOpenAIAssistant?: (codeContext: string) => void;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  assignment,
  onClose,
  onSubmitAssignment,
  onShowToast,
  editorFontSize = 14,
  onOpenAIAssistant,
}) => {
  if (!assignment) return null;

  const [activeTab, setActiveTab] = useState<'concept' | 'editor'>(() => {
    return assignment.conceptExplainer || assignment.roadmapSteps ? 'concept' : 'editor';
  });

  const [code, setCode] = useState(
    assignment.submissionCode ||
      assignment.starterSkeletonCode ||
      `// Write your solution for ${assignment.filename} here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello CS201!" << endl;\n    return 0;\n}`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCode(
      assignment.submissionCode ||
        assignment.starterSkeletonCode ||
        `// Write your solution for ${assignment.filename} here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello CS201!" << endl;\n    return 0;\n}`
    );
    setActiveTab(assignment.conceptExplainer || assignment.roadmapSteps ? 'concept' : 'editor');
  }, [assignment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onSubmitAssignment(assignment.id, code);
      setIsSubmitting(false);
      onShowToast(`Submitted ${assignment.filename} successfully!`);
      onClose();
    }, 600);
  };

  const handleResetToSkeleton = () => {
    if (assignment.starterSkeletonCode) {
      setCode(assignment.starterSkeletonCode);
      onShowToast('Reset code editor to beginner starter skeleton template');
    }
  };

  const difficulty = assignment.difficulty || 'Beginner';

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col border-2 border-slate-800 shadow-2xl overflow-hidden my-auto">
        
        {/* MODAL HEADER */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-extrabold text-[10px] uppercase tracking-wider">
                {assignment.course}
              </span>

              <span
                className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider border ${
                  difficulty === 'Beginner'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    : difficulty === 'Intermediate'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                    : 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                }`}
              >
                🌱 {difficulty} Level
              </span>

              <span className="text-xs text-slate-400 font-medium">Due: {assignment.dueDate}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {assignment.title}
            </h2>
            <p className="text-xs text-slate-400 font-mono">File: {assignment.filename}</p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* MODAL NAVIGATION TABS */}
        <div className="flex items-center gap-2 px-5 py-3 bg-slate-950/80 border-b border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('concept')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'concept'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span className="material-symbols-outlined text-base">menu_book</span>
            <span>1. Concept & Step-by-Step Roadmap</span>
            {assignment.conceptExplainer && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span className="material-symbols-outlined text-base">terminal</span>
            <span>2. Code Sandbox & Submission</span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {activeTab === 'concept' ? (
            <div className="space-y-6">
              
              {/* PROBLEM OVERVIEW & EXPLAINER */}
              <div className="bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-base">lightbulb</span>
                  <span>Problem Summary</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {assignment.description}
                </p>
              </div>

              {/* CONCEPT EXPLAINER: TEACH FROM ZERO */}
              {assignment.conceptExplainer && (
                <div className="bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-950 rounded-2xl p-5 border-2 border-indigo-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🧠</span>
                      <h3 className="text-base font-extrabold text-white">
                        Concept Breakdown: Teach From Zero
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider border border-amber-400/30">
                      Beginner Friendly
                    </span>
                  </div>

                  {/* WHAT IS IT & WHY IS IT USED */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-950/90 p-4 rounded-xl border border-indigo-500/20 space-y-2">
                      <h4 className="text-xs font-extrabold text-indigo-300 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">help_outline</span>
                        <span>What is this thing?</span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {assignment.conceptExplainer.whatIsIt}
                      </p>
                    </div>

                    <div className="bg-slate-950/90 p-4 rounded-xl border border-indigo-500/20 space-y-2">
                      <h4 className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">rocket_launch</span>
                        <span>Why is it used in Real CS?</span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {assignment.conceptExplainer.whyItIsUsed}
                      </p>
                    </div>
                  </div>

                  {/* KEY TERMINOLOGY PILLS */}
                  {assignment.conceptExplainer.keyTerms.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                        📚 Key Terminology
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {assignment.conceptExplainer.keyTerms.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1"
                          >
                            <span className="text-xs font-black text-emerald-400 font-mono">
                              {item.term}
                            </span>
                            <p className="text-[11px] text-slate-300 leading-snug">
                              {item.definition}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP-BY-STEP IMPLEMENTATION ROADMAP */}
              {assignment.roadmapSteps && assignment.roadmapSteps.length > 0 && (
                <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-indigo-400">route</span>
                      <h3 className="text-base font-extrabold text-white">
                        Step-by-Step Implementation Roadmap
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {assignment.roadmapSteps.length} Guided Steps
                    </span>
                  </div>

                  <div className="space-y-4">
                    {assignment.roadmapSteps.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="bg-slate-900 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                              {step.stepNumber}
                            </span>
                            <h4 className="text-xs sm:text-sm font-extrabold text-white">
                              {step.title}
                            </h4>
                          </div>

                          {onOpenAIAssistant && (
                            <button
                              onClick={() => {
                                onOpenAIAssistant(
                                  `I am working on Step ${step.stepNumber} of "${assignment.title}": ${step.title}.\nDescription: ${step.description}\nCould you explain how to write this step in code?`
                                );
                              }}
                              className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-xs">auto_awesome</span>
                              <span>Ask AI Tutor</span>
                            </button>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 font-medium leading-relaxed pl-8">
                          {step.description}
                        </p>

                        {step.skeletonHint && (
                          <div className="ml-8 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto">
                            <div className="text-[10px] text-slate-500 font-sans uppercase font-bold mb-1">
                              Code Snippet Hint:
                            </div>
                            <pre className="whitespace-pre">{step.skeletonHint}</pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTION CALLOUT TO START CODING */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-purple-500/20 border-2 border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-extrabold text-white">
                    Understand the concepts and roadmap steps?
                  </h4>
                  <p className="text-xs text-slate-300">
                    Jump into the code editor with the pre-populated beginner skeleton template!
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('editor')}
                  className="btn-3d btn-3d-amber py-3 px-6 text-slate-950 text-xs font-extrabold flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>Open Code Sandbox →</span>
                </button>
              </div>

            </div>
          ) : (
            /* TAB 2: CODE SANDBOX & SUBMISSION */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-extrabold text-slate-200">
                    Code Submission Editor (.cpp / .c / .js)
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Follow the step-by-step comments in the starter skeleton code below.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {assignment.starterSkeletonCode && (
                    <button
                      type="button"
                      onClick={handleResetToSkeleton}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Reset editor code to beginner skeleton template"
                    >
                      <span className="material-symbols-outlined text-sm">restart_alt</span>
                      <span>Reset Skeleton</span>
                    </button>
                  )}

                  {onOpenAIAssistant && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenAIAssistant(
                          `Here is my current solution code for "${assignment.title}" (${assignment.filename}):\n\n\`\`\`cpp\n${code}\n\`\`\`\nCan you review my logic and help me fix any syntax or logical bugs?`
                        );
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-xs font-extrabold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">auto_awesome</span>
                      <span>Review Code with AI</span>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <textarea
                  rows={14}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={{ fontSize: `${editorFontSize}px` }}
                  className="w-full bg-slate-950 text-emerald-400 font-mono p-4 rounded-2xl border-2 border-slate-800 focus:border-indigo-500 focus:outline-none leading-relaxed shadow-inner"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Current Status:</span>
                  <strong className="text-emerald-400 font-black uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    {assignment.status}
                  </strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-3d btn-3d-slate px-4 py-2 text-xs text-slate-900 font-extrabold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-3d btn-3d-emerald px-6 py-2.5 text-xs font-extrabold cursor-pointer"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Solution 🚀'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

