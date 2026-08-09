import React, { useState } from 'react';
import { Assignment } from '../types';

interface AssignmentModalProps {
  assignment: Assignment | null;
  onClose: () => void;
  onSubmitAssignment: (assignmentId: string, submissionCode: string) => void;
  onShowToast: (msg: string) => void;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  assignment,
  onClose,
  onSubmitAssignment,
  onShowToast,
}) => {
  if (!assignment) return null;

  const [code, setCode] = useState(
    assignment.submissionCode ||
      `// Submission for ${assignment.title}\n// Course: ${assignment.course}\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Binary Search Tree initialized!" << endl;\n    return 0;\n}`
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
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl p-5 max-w-2xl w-full space-y-4 shadow-2xl">
        <div className="flex justify-between items-start pb-3 border-b border-slate-200">
          <div>
            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px] uppercase tracking-wider border border-indigo-200">
              {assignment.course}
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              {assignment.title}
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              File target: {assignment.filename} | {assignment.dueDate}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {assignment.description}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
              Source Code / Solution Editor
            </label>
            <textarea
              rows={8}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 font-mono text-xs p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed border border-slate-200"
            />
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-xs text-slate-500 font-mono">
              Status: <span className="font-bold text-slate-800">{assignment.status}</span>
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-xs">upload</span>
                {isSubmitting ? 'Uploading...' : 'Submit Solution'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
