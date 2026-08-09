import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: UserProfile;
  onShowToast: (msg: string) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  profile,
  onShowToast,
}) => {
  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [subject, setSubject] = useState('Academic Support & Inquiry');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    adminEmail: string;
    previewUrl?: string;
  } | null>(null);

  useEffect(() => {
    if (profile) {
      if (profile.name) setName(profile.name);
      if (profile.email) setEmail(profile.email);
    }
  }, [profile]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessInfo(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill in all required fields (Name, Email, Message).');
      return;
    }

    setIsSending(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessInfo({
          adminEmail: data.details?.adminEmail || 'admin@csportal.edu',
          previewUrl: data.previewUrl,
        });
        setMessage('');
        onShowToast('Contact form submitted! Admin notification email sent via Nodemailer.');
      } else {
        setErrorMsg(data.error || 'Failed to submit contact form. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg('Network error while sending contact form. Please check backend connection.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-xl p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200">
              <span className="material-symbols-outlined text-lg">mail</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Contact CS Portal Administrator
              </h3>
              <p className="text-[10px] text-slate-500 font-mono">
                Direct Nodemailer notification to admin
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Success Banner */}
        {successInfo ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
              <span className="material-symbols-outlined text-base text-emerald-600">
                check_circle
              </span>
              Notification Sent Successfully!
            </div>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Your inquiry has been processed by the Express backend. An email notification was delivered to the administrator (<span className="font-mono font-bold">{successInfo.adminEmail}</span>).
            </p>
            {successInfo.previewUrl && (
              <a
                href={successInfo.previewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:underline font-bold pt-1"
              >
                <span>View Nodemailer Ethereal Email Preview</span>
                <span className="material-symbols-outlined text-[12px]">open_in_new</span>
              </a>
            )}
            <div className="pt-2">
              <button
                onClick={() => setSuccessInfo(null)}
                className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {errorMsg && (
              <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 font-mono">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Your Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@csportal.edu"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-mono text-xs rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Subject / Topic
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Academic Support & Inquiry">Academic Support & Inquiry</option>
                <option value="Course Registration Help">Course Registration Help</option>
                <option value="Portal Bug / Technical Issue">Portal Bug / Technical Issue</option>
                <option value="Lab & Assignment Question">Lab & Assignment Question</option>
                <option value="General Feedback">General Feedback</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Your Message *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your inquiry, question, or feedback in detail..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm inline-flex items-center gap-1.5"
              >
                {isSending ? (
                  <>
                    <span className="material-symbols-outlined text-xs animate-spin">sync</span>
                    <span>Sending Notification...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xs">send</span>
                    <span>Submit & Notify Admin</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
