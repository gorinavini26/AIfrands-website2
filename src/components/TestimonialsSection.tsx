import React from 'react';

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  college?: string;
  avatarInitials?: string;
  avatarBg?: string;
  quote: string;
  verified?: boolean;
}

/**
 * Real Student Testimonials List
 * Empty array by default to ensure NO fake or placeholder testimonials are displayed on the landing page.
 * When real student feedback is received, add testimonials to this array or supply via props.
 */
export const realTestimonials: TestimonialItem[] = [
  // Example template structure for adding future real testimonials:
  // {
  //   id: '1',
  //   name: 'Student Name',
  //   role: 'CS Year 2 Student',
  //   college: 'University Name',
  //   avatarInitials: 'SN',
  //   avatarBg: 'bg-indigo-600',
  //   quote: 'Actual feedback from real student.',
  //   verified: true,
  // },
];

interface TestimonialsSectionProps {
  testimonials?: TestimonialItem[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials = realTestimonials,
}) => {
  // Hide section completely if there are no real testimonials to display
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 pt-4 animate-fadeIn">
      <div className="text-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Student Feedback</span>
        <h3 className="text-sm font-extrabold text-slate-200">What CS Students Say</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 space-y-3 text-left relative transition-all"
          >
            <p className="text-xs text-slate-300 italic leading-relaxed pt-1">
              "{item.quote}"
            </p>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
              <div
                className={`w-7 h-7 rounded-full ${item.avatarBg || 'bg-indigo-600'} text-white font-extrabold text-xs flex items-center justify-center shrink-0`}
              >
                {item.avatarInitials || item.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{item.name}</span>
                  {item.verified && (
                    <span className="material-symbols-outlined text-emerald-400 text-xs" title="Verified Student">
                      verified
                    </span>
                  )}
                </p>
                <p className="text-[10px] text-slate-400">
                  {item.role} {item.college ? `• ${item.college}` : ''}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
