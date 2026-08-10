import React, { useState } from 'react';
import { Assignment } from '../types';

interface AssignmentModalProps {
  assignment: Assignment | null;
  onClose: () => void;
  onSubmitAssignment: (assignmentId: string, submissionCode: string) => void;
  onShowToast: (msg: string) => void;
  editorFontSize?: number;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  assignment,
  onClose,
  onSubmitAssignment,
  onShowToast,
  editorFontSize = 14,
}) => {
  if (!assignment) return null;

  const [code, setCode] = useState(
    assignment.submissionCode ||
      `// Write your solution for ${assignment.filename} here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello CS201!" << endl;\n    return 0;\n}`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white rounded-2xl p-6 max-w-2xl w-full space-y-4 border border-slate-800 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-xs">
                {assignment.course}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{assignment.dueDate}</span>
            </div>
            <h2 className="text-xl font-black">{assignment.title}</h2>
            <p className="text-xs text-slate-400 mt-1">File: {assignment.filename}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
          <p className="font-semibold text-slate-200 mb-1">Problem Description:</p>
          <p>{assignment.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Code Submission (.cpp / .py / .java)
            </label>
            <textarea
              rows={8}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ fontSize: `${editorFontSize}px` }}
              className="w-full bg-slate-950 text-emerald-400 font-mono p-3.5 rounded-2xl border border-slate-800 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-400">
              Status: <strong className="text-emerald-400 font-extrabold">{assignment.status}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-3d btn-3d-slate px-4 py-2 text-xs text-slate-900 font-extrabold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-3d btn-3d-emerald px-5 py-2 text-xs font-extrabold"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Solution 🚀'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
