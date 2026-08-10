import React, { useState } from 'react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onShowToast: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
  onShowToast,
}) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [githubUrl, setGithubUrl] = useState(profile.githubUrl);
  const [bio, setBio] = useState(profile.bio);
  const [year, setYear] = useState(profile.year);
  const [editorFontSize, setEditorFontSize] = useState(profile.editorFontSize || 14);

  const [primaryLangs, setPrimaryLangs] = useState<string[]>(profile.primaryLanguages);
  const [toolsIdes, setToolsIdes] = useState<string[]>(profile.toolsAndIdes);
  const [newLangInput, setNewLangInput] = useState('');
  const [newToolInput, setNewToolInput] = useState('');

  const [notifications, setNotifications] = useState(profile.notifications);

  // Modals state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newEmailVal, setNewEmailVal] = useState('');
  const [newPasswordVal, setNewPasswordVal] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      email,
      githubUrl,
      bio,
      year,
      editorFontSize,
      primaryLanguages: primaryLangs,
      toolsAndIdes: toolsIdes,
      notifications,
    });
    onShowToast('Profile settings saved successfully!');
  };

  const handleAddLanguage = () => {
    if (!newLangInput.trim()) return;
    if (!primaryLangs.includes(newLangInput.trim())) {
      setPrimaryLangs([...primaryLangs, newLangInput.trim()]);
    }
    setNewLangInput('');
  };

  const handleRemoveLanguage = (lang: string) => {
    setPrimaryLangs(primaryLangs.filter((l) => l !== lang));
  };

  const handleAddTool = () => {
    if (!newToolInput.trim()) return;
    if (!toolsIdes.includes(newToolInput.trim())) {
      setToolsIdes([...toolsIdes, newToolInput.trim()]);
    }
    setNewToolInput('');
  };

  const handleRemoveTool = (tool: string) => {
    setToolsIdes(toolsIdes.filter((t) => t !== tool));
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    onUpdateProfile({ notifications: updated });
    onShowToast('Notification preference updated.');
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 py-6 space-y-6 text-slate-800 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Profile Header Section */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-xl overflow-hidden shadow-sm relative z-10 border border-slate-200">
                <img
                  src={
                    profile.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                  }
                  alt="Alex"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <button
                title="Change Profile Photo"
                onClick={() => onShowToast('Avatar editor opened. Photo refreshed!')}
                className="absolute -bottom-2 -right-2 bg-indigo-600 text-white w-7 h-7 rounded-lg flex items-center justify-center shadow-sm hover:scale-110 transition-transform z-20"
              >
                <span className="material-symbols-outlined text-[14px]">edit</span>
              </button>
            </div>

            <div className="flex-1 space-y-3 w-full">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-lg sm:text-xl text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none font-bold"
                />
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] rounded uppercase font-bold border border-indigo-200">
                  {year}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-slate-500 font-mono text-xs">
                <span className="material-symbols-outlined text-[14px]">terminal</span>
                <span>{email}</span>
                <span className="mx-1 text-slate-300">|</span>
                <span className="material-symbols-outlined text-[14px]">code</span>
                <span>{githubUrl}</span>
              </div>

              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full text-slate-700 bg-slate-50 rounded-lg p-2.5 text-xs font-sans border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              />

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Save Profile
                </button>
                <button
                  onClick={() => onShowToast(`Public profile URL: https://csportal.edu/u/${profile.studentId}`)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  View Public Profile
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Grid Settings Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Tech Stack & Appearance */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tech Stack Preferences */}
            <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm text-slate-900 flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-indigo-600 text-base">
                    data_object
                  </span>
                  Stack Preferences
                </h2>
              </div>

              <div className="space-y-4">
                {/* Languages */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Primary Languages
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {primaryLangs.map((lang) => (
                      <span
                        key={lang}
                        className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded font-mono text-xs flex items-center gap-1.5 border border-slate-200"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        {lang}
                        <button
                          type="button"
                          onClick={() => handleRemoveLanguage(lang)}
                          className="text-slate-400 hover:text-red-600 font-bold ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-1.5 mt-2">
                    <input
                      type="text"
                      value={newLangInput}
                      onChange={(e) => setNewLangInput(e.target.value)}
                      placeholder="Add language (e.g. Go)"
                      className="flex-1 bg-slate-50 text-xs text-slate-800 rounded px-2.5 py-1 focus:outline-none border border-slate-200"
                    />
                    <button
                      onClick={handleAddLanguage}
                      className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs rounded font-bold hover:bg-indigo-100 border border-indigo-200"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Tools & IDEs */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Tools & IDEs
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {toolsIdes.map((tool) => (
                      <span
                        key={tool}
                        className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded font-mono text-xs flex items-center gap-1.5 border border-slate-200"
                      >
                        {tool}
                        <button
                          type="button"
                          onClick={() => handleRemoveTool(tool)}
                          className="text-slate-400 hover:text-red-600 font-bold ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-1.5 mt-2">
                    <input
                      type="text"
                      value={newToolInput}
                      onChange={(e) => setNewToolInput(e.target.value)}
                      placeholder="Add tool (e.g. Linux)"
                      className="flex-1 bg-slate-50 text-xs text-slate-800 rounded px-2.5 py-1 focus:outline-none border border-slate-200"
                    />
                    <button
                      onClick={handleAddTool}
                      className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs rounded font-bold hover:bg-indigo-100 border border-indigo-200"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Appearance Section */}
            <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-sm text-slate-900 flex items-center gap-1.5 font-bold border-b border-slate-100 pb-3">
                <span className="material-symbols-outlined text-indigo-600 text-base">
                  palette
                </span>
                Appearance & Editor
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      High Density Theme
                    </p>
                    <p className="text-[10px] font-mono text-slate-500">
                      Slate-900 / Indigo-600 Profile
                    </p>
                  </div>
                  <div className="w-10 h-5 bg-indigo-600 rounded-full relative cursor-not-allowed">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <p className="text-xs font-bold text-slate-900">
                      Editor Font Size
                    </p>
                    <span className="font-mono text-xs text-indigo-600 font-bold">
                      {editorFontSize}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={editorFontSize}
                    onChange={(e) => setEditorFontSize(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Account Security & Notifications */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Security */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-4 border-b border-slate-100">
                <h2 className="text-sm text-slate-900 flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-indigo-600 text-base">
                    shield_person
                  </span>
                  Account Security
                </h2>
              </div>

              <div className="p-4 space-y-4">
                {/* Email */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                      PRIMARY EMAIL
                    </p>
                    <p className="font-mono text-xs text-slate-900 font-bold">
                      {email}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    Change Email
                  </button>
                </div>

                <div className="w-full h-[1px] bg-slate-100" />

                {/* Password */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                      PASSWORD
                    </p>
                    <p className="font-mono text-xs text-slate-900">
                      ••••••••••••
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Last changed 42 days ago
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    Update Password
                  </button>
                </div>

                <div className="w-full h-[1px] bg-slate-100" />

                {/* Connected Accounts */}
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                    CONNECTED ACCOUNTS
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-indigo-600">
                          code
                        </span>
                        <span className="text-xs text-slate-900 font-bold">
                          GitHub
                        </span>
                      </div>
                      <span className="text-emerald-600 font-mono text-xs flex items-center gap-1 font-bold">
                        <span className="material-symbols-outlined text-sm">
                          check_circle
                        </span>{' '}
                        Linked
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-amber-600">
                          mail
                        </span>
                        <span className="text-xs text-slate-900 font-bold">
                          Google Workspace
                        </span>
                      </div>
                      <button
                        onClick={() => onShowToast('Google OAuth account linked!')}
                        className="text-indigo-600 font-mono text-xs hover:underline font-bold"
                      >
                        Link Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Notification Rules */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-4 border-b border-slate-100">
                <h2 className="text-sm text-slate-900 flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-indigo-600 text-base">
                    notifications_active
                  </span>
                  Notification Rules
                </h2>
              </div>

              <div className="p-4 space-y-4">
                {/* Toggle 1 */}
                <div className="flex items-center justify-between">
                  <div className="pr-4">
                    <p className="text-xs text-slate-900 font-bold mb-0.5">
                      Assignment Deadlines
                    </p>
                    <p className="font-mono text-[11px] text-slate-500">
                      Alerts 24h and 2h before submission drops.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNotification('assignmentDeadlines')}
                    className={`w-10 h-5 rounded-full relative transition-colors ${
                      notifications.assignmentDeadlines ? 'bg-indigo-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-xs ${
                        notifications.assignmentDeadlines ? 'right-0.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle 2 */}
                <div className="flex items-center justify-between">
                  <div className="pr-4">
                    <p className="text-xs text-slate-900 font-bold mb-0.5">
                      Portal System Updates
                    </p>
                    <p className="font-mono text-[11px] text-slate-500">
                      Scheduled maintenance and new tool rollouts.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNotification('portalUpdates')}
                    className={`w-10 h-5 rounded-full relative transition-colors ${
                      notifications.portalUpdates ? 'bg-indigo-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-xs ${
                        notifications.portalUpdates ? 'right-0.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle 3 */}
                <div className="flex items-center justify-between">
                  <div className="pr-4">
                    <p className="text-xs text-slate-900 font-bold mb-0.5">
                      Community Messages
                    </p>
                    <p className="font-mono text-[11px] text-slate-500">
                      Direct pings from study groups and TAs.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNotification('communityMessages')}
                    className={`w-10 h-5 rounded-full relative transition-colors ${
                      notifications.communityMessages ? 'bg-indigo-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-xs ${
                        notifications.communityMessages ? 'right-0.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Email Change Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 max-w-md w-full space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-slate-900">Change Primary Email</h3>
              <input
                type="email"
                value={newEmailVal}
                onChange={(e) => setNewEmailVal(e.target.value)}
                placeholder="new.student@csportal.edu"
                className="w-full bg-slate-50 text-slate-800 text-xs rounded-lg p-2.5 focus:outline-none border border-slate-200"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 py-2 rounded-lg bg-slate-100 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (newEmailVal) {
                      setEmail(newEmailVal);
                      onUpdateProfile({ email: newEmailVal });
                      onShowToast('Primary email updated!');
                    }
                    setShowEmailModal(false);
                  }}
                  className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-sm"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 max-w-md w-full space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-slate-900">Update Password</h3>
              <input
                type="password"
                value={newPasswordVal}
                onChange={(e) => setNewPasswordVal(e.target.value)}
                placeholder="New password (min 8 chars)"
                className="w-full bg-slate-50 text-slate-800 text-xs rounded-lg p-2.5 focus:outline-none border border-slate-200"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2 rounded-lg bg-slate-100 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (newPasswordVal) {
                      onShowToast('Password updated securely.');
                    }
                    setShowPasswordModal(false);
                  }}
                  className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-sm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
