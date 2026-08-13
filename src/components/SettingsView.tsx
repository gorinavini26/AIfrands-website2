import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onShowToast: (msg: string) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const PRESET_AVATARS = [
  { id: 'a1', name: 'Alex (Default)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { id: 'a2', name: 'Marcus', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { id: 'a3', name: 'Sophia', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
  { id: 'a4', name: 'David', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
  { id: 'a5', name: 'Maya', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
  { id: 'a6', name: 'Liam', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80' },
  { id: 'a7', name: 'AI Bot 1', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=cs1' },
  { id: 'a8', name: 'AI Bot 2', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=cs2' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
  onShowToast,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [githubUrl, setGithubUrl] = useState(profile?.githubUrl || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [year, setYear] = useState(profile?.year || 'Year 2');
  const [editorFontSize, setEditorFontSize] = useState(profile?.editorFontSize || 14);
  const [highDensityTheme, setHighDensityTheme] = useState(!!profile?.highDensityTheme);

  const [primaryLangs, setPrimaryLangs] = useState<string[]>(profile?.primaryLanguages || []);
  const [toolsIdes, setToolsIdes] = useState<string[]>(profile?.toolsAndIdes || []);
  const [newLangInput, setNewLangInput] = useState('');
  const [newToolInput, setNewToolInput] = useState('');

  const [notifications, setNotifications] = useState(
    profile?.notifications || {
      assignmentDeadlines: true,
      portalUpdates: false,
      communityMessages: true,
    }
  );

  // Avatar states & file ref
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || PRESET_AVATARS[0].url);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newEmailVal, setNewEmailVal] = useState('');
  const [newPasswordVal, setNewPasswordVal] = useState('');

  // Account integration status
  const [googleWorkspaceLinked, setGoogleWorkspaceLinked] = useState(true);
  const [githubLinked, setGithubLinked] = useState(true);

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated = {
      name,
      email,
      githubUrl,
      bio,
      year,
      avatarUrl,
      editorFontSize,
      highDensityTheme,
      primaryLanguages: primaryLangs,
      toolsAndIdes: toolsIdes,
      notifications,
    };
    onUpdateProfile(updated);
    onShowToast('Profile settings saved successfully!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        onShowToast('File size must be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setAvatarUrl(result);
          onUpdateProfile({ avatarUrl: result });
          onShowToast('Profile avatar uploaded and saved!');
          setShowAvatarModal(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPresetAvatar = (url: string) => {
    setAvatarUrl(url);
    onUpdateProfile({ avatarUrl: url });
    onShowToast('Avatar changed and saved!');
    setShowAvatarModal(false);
  };

  const handleAddLanguage = () => {
    if (!newLangInput.trim()) return;
    const trimmed = newLangInput.trim();
    if (!primaryLangs.includes(trimmed)) {
      const updated = [...primaryLangs, trimmed];
      setPrimaryLangs(updated);
      onUpdateProfile({ primaryLanguages: updated });
      onShowToast(`Added language: ${trimmed}`);
    }
    setNewLangInput('');
  };

  const handleRemoveLanguage = (lang: string) => {
    const updated = primaryLangs.filter((l) => l !== lang);
    setPrimaryLangs(updated);
    onUpdateProfile({ primaryLanguages: updated });
    onShowToast(`Removed language: ${lang}`);
  };

  const handleAddTool = () => {
    if (!newToolInput.trim()) return;
    const trimmed = newToolInput.trim();
    if (!toolsIdes.includes(trimmed)) {
      const updated = [...toolsIdes, trimmed];
      setToolsIdes(updated);
      onUpdateProfile({ toolsAndIdes: updated });
      onShowToast(`Added tool: ${trimmed}`);
    }
    setNewToolInput('');
  };

  const handleRemoveTool = (tool: string) => {
    const updated = toolsIdes.filter((t) => t !== tool);
    setToolsIdes(updated);
    onUpdateProfile({ toolsAndIdes: updated });
    onShowToast(`Removed tool: ${tool}`);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    onUpdateProfile({ notifications: updated });
    onShowToast(`Notification preference updated.`);
  };

  const handleToggleHighDensity = () => {
    const updated = !highDensityTheme;
    setHighDensityTheme(updated);
    onUpdateProfile({ highDensityTheme: updated });
    onShowToast(`High Density Theme ${updated ? 'Enabled' : 'Disabled'}`);
  };

  const handleFontSizeChange = (size: number) => {
    setEditorFontSize(size);
    onUpdateProfile({ editorFontSize: size });
  };

  return (
    <div className="flex flex-col w-full text-slate-800 bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-slate-100 dark:from-slate-950 dark:via-indigo-950/40 dark:to-slate-900 min-h-screen p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full space-y-4 sm:space-y-6">
        
        {/* Profile Header Section */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            
            {/* Avatar & Upload Trigger */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-xl overflow-hidden shadow-sm relative z-10 border-2 border-slate-200 bg-slate-100">
                <img
                  src={avatarUrl}
                  alt={name || 'Student Avatar'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <button
                type="button"
                title="Change Profile Photo"
                onClick={() => setShowAvatarModal(true)}
                className="absolute -bottom-2 -right-2 bg-indigo-600 hover:bg-indigo-700 text-white w-8 h-8 rounded-lg flex items-center justify-center shadow-md hover:scale-110 transition-transform z-20 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            <div className="flex-1 space-y-3 w-full">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => onUpdateProfile({ name })}
                  placeholder="Student Name"
                  className="text-lg sm:text-xl text-slate-900 bg-transparent border-b border-slate-200 hover:border-slate-400 focus:border-indigo-600 focus:outline-none font-bold py-0.5"
                />

                {/* Academic Year Selector Dropdown */}
                <div className="flex items-center gap-1.5 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                  <span className="material-symbols-outlined text-[15px] text-indigo-700">school</span>
                  <select
                    value={year}
                    onChange={(e) => {
                      const newYear = e.target.value;
                      setYear(newYear);
                      onUpdateProfile({ year: newYear });
                      onShowToast(`Academic level updated to ${newYear}`);
                    }}
                    className="bg-transparent text-indigo-900 text-xs font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="Year 1">Year 1 (Freshman)</option>
                    <option value="Year 2">Year 2 (Sophomore)</option>
                    <option value="Year 3">Year 3 (Junior)</option>
                    <option value="Year 4">Year 4 (Senior)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-slate-500 font-mono text-xs">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">terminal</span>
                  <span>{email}</span>
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">code</span>
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    onBlur={() => onUpdateProfile({ githubUrl })}
                    placeholder="github.com/username"
                    className="bg-transparent text-slate-700 border-b border-slate-200 hover:border-slate-400 focus:border-indigo-600 focus:outline-none font-mono text-xs"
                  />
                </div>
              </div>

              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                onBlur={() => onUpdateProfile({ bio })}
                placeholder="Write a brief bio describing your CS goals or stack..."
                className="w-full text-slate-700 bg-slate-50 rounded-lg p-2.5 text-xs font-sans border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              />

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="btn-3d btn-3d-indigo px-4 py-2.5 text-xs font-extrabold flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  <span>Save Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://csportal.edu/u/${profile.studentId}`);
                    onShowToast(`Copied profile link: https://csportal.edu/u/${profile.studentId}`);
                  }}
                  className="btn-3d btn-3d-slate px-4 py-2.5 text-xs font-extrabold flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">share</span>
                  <span>Share Profile Link</span>
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
                          className="text-slate-400 hover:text-red-600 font-bold ml-1 cursor-pointer"
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
                      onKeyDown={(e) => e.key === 'Enter' && handleAddLanguage()}
                      placeholder="Add language (e.g. Go)"
                      className="flex-1 bg-slate-50 text-xs text-slate-800 rounded px-2.5 py-1 focus:outline-none border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={handleAddLanguage}
                      className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs rounded font-bold hover:bg-indigo-100 border border-indigo-200 cursor-pointer"
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
                          className="text-slate-400 hover:text-red-600 font-bold ml-1 cursor-pointer"
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
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTool()}
                      placeholder="Add tool (e.g. Docker)"
                      className="flex-1 bg-slate-50 text-xs text-slate-800 rounded px-2.5 py-1 focus:outline-none border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={handleAddTool}
                      className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs rounded font-bold hover:bg-indigo-100 border border-indigo-200 cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Appearance & Editor Section */}
            <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-sm text-slate-900 flex items-center gap-1.5 font-bold border-b border-slate-100 pb-3">
                <span className="material-symbols-outlined text-indigo-600 text-base">
                  palette
                </span>
                Appearance & Editor
              </h2>

              <div className="space-y-5">
                
                {/* High Density Theme Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      High Density Theme
                    </p>
                    <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      Compact spacing and high-contrast typography
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleHighDensity}
                    className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${
                      highDensityTheme ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
                        highDensityTheme ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Site-wide Dark Mode Toggle */}
                {onToggleDarkMode && (
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <span>{isDarkMode ? '🌙' : '☀️'}</span> Site-Wide Dark Mode
                      </p>
                      <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        Extend sleek dark theme to all views and components
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onToggleDarkMode}
                      className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${
                        isDarkMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
                          isDarkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                )}

                {/* Editor Font Size Slider */}
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
                    step="1"
                    value={editorFontSize}
                    onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />

                  {/* Real-Time Font Size Live Code Preview */}
                  <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-emerald-400 font-mono transition-all overflow-x-auto shadow-inner">
                    <p style={{ fontSize: `${editorFontSize}px` }} className="leading-snug">
                      <code>// Live Preview: {editorFontSize}px font size</code>
                      <br />
                      <code>int main() &#123; return 0; &#125;</code>
                    </p>
                  </div>
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
                    type="button"
                    onClick={() => setShowEmailModal(true)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
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
                      Encrypted credentials
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(true)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
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
                      <button
                        type="button"
                        onClick={() => {
                          const nextState = !githubLinked;
                          setGithubLinked(nextState);
                          onShowToast(nextState ? 'GitHub account linked!' : 'GitHub account unlinked.');
                        }}
                        className={`font-mono text-xs font-bold ${
                          githubLinked ? 'text-emerald-600' : 'text-indigo-600 hover:underline'
                        }`}
                      >
                        {githubLinked ? '✓ Linked' : 'Link Account'}
                      </button>
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
                        type="button"
                        onClick={() => {
                          const nextState = !googleWorkspaceLinked;
                          setGoogleWorkspaceLinked(nextState);
                          onShowToast(nextState ? 'Google Workspace linked!' : 'Google Workspace unlinked.');
                        }}
                        className={`font-mono text-xs font-bold ${
                          googleWorkspaceLinked ? 'text-emerald-600' : 'text-indigo-600 hover:underline'
                        }`}
                      >
                        {googleWorkspaceLinked ? '✓ Linked' : 'Link Account'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Notification Rules Section */}
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
                {/* Toggle 1: Assignment Deadlines */}
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
                    className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${
                      notifications.assignmentDeadlines ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
                        notifications.assignmentDeadlines ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle 2: Portal System Updates */}
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
                    className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${
                      notifications.portalUpdates ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
                        notifications.portalUpdates ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle 3: Community Messages */}
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
                    className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${
                      notifications.communityMessages ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
                        notifications.communityMessages ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Profile Avatar Modal / Gallery */}
        {showAvatarModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600">account_circle</span>
                  Choose Profile Picture
                </h3>
                <button
                  onClick={() => setShowAvatarModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              {/* Upload Option */}
              <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-indigo-950">Upload Custom Image</p>
                  <p className="text-[11px] text-indigo-700 font-medium">PNG, JPG, or GIF up to 5MB from your device</p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">upload_file</span>
                  <span>Upload Photo</span>
                </button>
              </div>

              {/* Preset Gallery Grid */}
              <div>
                <p className="text-xs font-extrabold text-slate-700 mb-2">Or Choose a Preset Avatar:</p>
                <div className="grid grid-cols-4 gap-3">
                  {PRESET_AVATARS.map((preset) => {
                    const isSelected = avatarUrl === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPresetAvatar(preset.url)}
                        className={`group relative rounded-xl overflow-hidden border-2 transition-all p-1 cursor-pointer ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/30'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-16 object-cover rounded-lg group-hover:scale-105 transition-transform"
                        />
                        <p className="text-[10px] font-bold text-center text-slate-700 mt-1 truncate">
                          {preset.name}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Change Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="text-base font-extrabold text-slate-900">Change Primary Email</h3>
              <p className="text-xs text-slate-500">
                Enter your new university or personal email address.
              </p>
              <input
                type="email"
                value={newEmailVal}
                onChange={(e) => setNewEmailVal(e.target.value)}
                placeholder="new.student@university.edu"
                className="w-full bg-slate-50 text-slate-800 text-xs font-medium rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-200"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (newEmailVal.trim()) {
                      setEmail(newEmailVal.trim());
                      onUpdateProfile({ email: newEmailVal.trim() });
                      onShowToast('Primary email updated!');
                    }
                    setShowEmailModal(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors"
                >
                  Update Email
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="text-base font-extrabold text-slate-900">Update Password</h3>
              <p className="text-xs text-slate-500">
                Choose a strong password (at least 8 characters).
              </p>
              <input
                type="password"
                value={newPasswordVal}
                onChange={(e) => setNewPasswordVal(e.target.value)}
                placeholder="New password"
                className="w-full bg-slate-50 text-slate-800 text-xs font-medium rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-200"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (newPasswordVal.trim().length >= 6) {
                      onShowToast('Password updated successfully!');
                      setShowPasswordModal(false);
                    } else {
                      onShowToast('Password must be at least 6 characters.');
                    }
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors"
                >
                  Save Password
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
