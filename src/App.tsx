import React, { useState, useEffect } from 'react';
import { UserProfile, RoadmapModule, AITool, Assignment, Notebook, TechLanguage, GameProgress } from './types';
import { initialProfile, initialRoadmapModules, initialAITools, initialAssignments, initialNotebooks, techLanguages } from './data/mockData';
import { auth, signOut, onAuthStateChanged } from './firebase';
import { getUserData, saveUserData, getUidFromEmail, initialGameProgress } from './services/userService';
import { AuthView } from './components/AuthView';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CodingGameView } from './components/CodingGameView';
import { RoadmapView } from './components/RoadmapView';
import { AIToolsView } from './components/AIToolsView';
import { LanguagesView } from './components/LanguagesView';
import { ResourcesView } from './components/ResourcesView';
import { SettingsView } from './components/SettingsView';
import { LoginModal } from './components/LoginModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ContactModal } from './components/ContactModal';
import { AssignmentModal } from './components/AssignmentModal';
import { NotebookModal } from './components/NotebookModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { NotificationToast } from './components/NotificationToast';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // App Data State
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [roadmapModules, setRoadmapModules] = useState<RoadmapModule[]>(initialRoadmapModules);
  const [aiTools, setAITools] = useState<AITool[]>(initialAITools);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [notebooks, setNotebooks] = useState<Notebook[]>(initialNotebooks);
  const [languages, setLanguages] = useState<TechLanguage[]>(techLanguages);
  const [gameProgress, setGameProgress] = useState<GameProgress>(() => {
    try {
      const saved = localStorage.getItem('aifrands_game_progress');
      return saved ? JSON.parse(saved) : initialGameProgress;
    } catch {
      return initialGameProgress;
    }
  });

  // Auth & Token state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);

  // Modal States
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(false);
  const [aiAssistantCode, setAIAssistantCode] = useState<string | undefined>(undefined);

  // Site-wide Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('aifrands_dark_mode') === 'true';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('aifrands_dark_mode', isDarkMode ? 'true' : 'false');
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    setToastMessage(isDarkMode ? '☀️ Switched to Light Mode' : '🌙 Switched to Dark Mode');
  };

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Session rehydration and Firebase Auth listener
  useEffect(() => {
    // 1. Check local session first
    const savedEmail = localStorage.getItem('aifrands_user_email');
    const savedName = localStorage.getItem('aifrands_user_name') || 'Student';

    if (savedEmail) {
      const uid = getUidFromEmail(savedEmail);
      setCurrentUserUid(uid);
      setIsAuthenticated(true);
      getUserData(uid, savedName, savedEmail).then((userData) => {
        setProfile(userData.profile);
        const activeModules = (userData.roadmapModules && userData.roadmapModules.length > 0)
          ? userData.roadmapModules
          : initialRoadmapModules;
        setRoadmapModules(activeModules);
        setAssignments(userData.assignments);
        setNotebooks(userData.notebooks);

        if (!userData.roadmapModules || userData.roadmapModules.length === 0) {
          saveUserData(uid, { roadmapModules: initialRoadmapModules });
        }
      });
      return;
    }

    // 2. Fallback to Firebase listener if present
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setIsAuthenticated(true);
        const userEmail = firebaseUser.email || '';
        const userName = firebaseUser.displayName || userEmail.split('@')[0] || 'Student';
        const uid = userEmail ? getUidFromEmail(userEmail) : firebaseUser.uid;
        setCurrentUserUid(uid);

        const userData = await getUserData(uid, userName, userEmail);
        setProfile(userData.profile);
        const activeModules = (userData.roadmapModules && userData.roadmapModules.length > 0)
          ? userData.roadmapModules
          : initialRoadmapModules;
        setRoadmapModules(activeModules);
        setAssignments(userData.assignments);
        setNotebooks(userData.notebooks);
        if (userData.gameProgress) {
          setGameProgress(userData.gameProgress);
        }

        if (!userData.roadmapModules || userData.roadmapModules.length === 0) {
          saveUserData(uid, { roadmapModules: initialRoadmapModules });
        }
      } else {
        setIsAuthenticated(false);
        setCurrentUserUid(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Apply high density theme class to body
  useEffect(() => {
    if (profile?.highDensityTheme) {
      document.body.classList.add('high-density');
    } else {
      document.body.classList.remove('high-density');
    }
  }, [profile?.highDensityTheme]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignore
    }
    localStorage.removeItem('aifrands_user_email');
    localStorage.removeItem('aifrands_user_name');
    localStorage.removeItem('aifrands_user_uid');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('guest_uid');
    setAuthToken(null);
    setIsAuthenticated(false);
    setCurrentUserUid(null);
    setToastMessage('Logged out successfully.');
  };

  const handleAuthSuccess = async (user: { name: string; email: string }) => {
    setIsAuthenticated(true);
    const uid = getUidFromEmail(user.email);
    setCurrentUserUid(uid);

    // Save local session for instant re-entry
    localStorage.setItem('aifrands_user_email', user.email);
    localStorage.setItem('aifrands_user_name', user.name);
    localStorage.setItem('aifrands_user_uid', uid);

    // Retrieve or create per-user record in Firestore
    const userData = await getUserData(uid, user.name, user.email);
    setProfile(userData.profile);
    const activeModules = (userData.roadmapModules && userData.roadmapModules.length > 0)
      ? userData.roadmapModules
      : initialRoadmapModules;
    setRoadmapModules(activeModules);
    setAssignments(userData.assignments);
    setNotebooks(userData.notebooks);
    if (userData.gameProgress) {
      setGameProgress(userData.gameProgress);
    }
    if (!userData.roadmapModules || userData.roadmapModules.length === 0) {
      saveUserData(uid, { roadmapModules: initialRoadmapModules });
    }
    setActiveTab('dashboard');
  };

  const handleSaveGameProgress = (updated: Partial<GameProgress>) => {
    const merged = { ...gameProgress, ...updated, updatedAt: new Date().toISOString() };
    setGameProgress(merged);
    try {
      localStorage.setItem('aifrands_game_progress', JSON.stringify(merged));
    } catch {}

    if (currentUserUid) {
      saveUserData(currentUserUid, { gameProgress: merged });
    }
  };

  // Handlers
  const handleToggleBookmark = async (id: string) => {
    try {
      const res = await fetch('/api/tools/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const data = await res.json();
        setAITools((prev) =>
          prev.map((t) => (t.id === id ? data.tool : t))
        );
        setToastMessage(data.tool.bookmarked ? 'Tool bookmarked!' : 'Bookmark removed.');
      } else {
        setAITools((prev) =>
          prev.map((t) => (t.id === id ? { ...t, bookmarked: !t.bookmarked } : t))
        );
      }
    } catch {
      setAITools((prev) =>
        prev.map((t) => (t.id === id ? { ...t, bookmarked: !t.bookmarked } : t))
      );
    }
  };

  const handleUpdateProfile = async (updated: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updated };
    setProfile(newProfile);
    if (currentUserUid) {
      await saveUserData(currentUserUid, { profile: newProfile });
    }
  };

  const handleSubmitAssignment = async (assignmentId: string, submissionCode: string) => {
    const updatedAssignments = assignments.map((a) =>
      a.id === assignmentId
        ? {
            ...a,
            status: 'Submitted' as const,
            isDueSoon: false,
            dueDate: 'Submitted just now',
            submissionCode,
          }
        : a
    );

    const newStreak = (profile.streakDays || 0) + 1;
    const updatedProfile = { ...profile, streakDays: newStreak };

    setAssignments(updatedAssignments);
    setProfile(updatedProfile);
    setToastMessage('🎉 Assignment submitted successfully! Streak incremented!');

    if (currentUserUid) {
      await saveUserData(currentUserUid, {
        assignments: updatedAssignments,
        profile: updatedProfile,
      });
    }
  };

  const handleCreateNotebook = async (
    title: string,
    category: string,
    summary: string,
    content: string
  ) => {
    const localNb: Notebook = {
      id: `nb_${Date.now()}`,
      title,
      category,
      summary: summary || 'Custom study synthesis notes created in portal.',
      updatedAt: 'Just now',
      fileCount: 1,
      content,
    };
    const updatedNotebooks = [localNb, ...notebooks];
    setNotebooks(updatedNotebooks);
    setToastMessage(`Notebook "${title}" created!`);

    if (currentUserUid) {
      await saveUserData(currentUserUid, { notebooks: updatedNotebooks });
    }
  };

  const handleToggleTopicCheck = async (moduleId: string, topicIndex: number) => {
    const sourceModules = roadmapModules.length > 0 ? roadmapModules : initialRoadmapModules;
    const updatedModules = sourceModules.map((mod) => {
      if (mod.id !== moduleId) return mod;

      const newTopics = mod.topics.map((t, idx) =>
        idx === topicIndex ? { ...t, completed: !t.completed } : t
      );

      const completedCount = newTopics.filter((t) => t.completed).length;
      const totalCount = newTopics.length;
      const newProgress = totalCount
        ? Math.round((completedCount / totalCount) * 100)
        : 0;

      let newStatus = mod.status;
      if (newProgress === 100) {
        newStatus = 'completed';
      } else if (newProgress > 0) {
        newStatus = 'in_progress';
      } else {
        newStatus = mod.year > 2 ? 'locked' : 'in_progress';
      }

      return {
        ...mod,
        topics: newTopics,
        progress: newProgress,
        status: newStatus as 'completed' | 'in_progress' | 'locked',
      };
    });

    setRoadmapModules(updatedModules);

    if (currentUserUid) {
      await saveUserData(currentUserUid, { roadmapModules: updatedModules });
    }
  };

  const handleMarkModuleComplete = async (moduleId: string) => {
    const sourceModules = roadmapModules.length > 0 ? roadmapModules : initialRoadmapModules;
    const updatedModules = sourceModules.map((mod) => {
      if (mod.id !== moduleId) return mod;

      const newTopics = mod.topics.map((t) => ({ ...t, completed: true }));
      return {
        ...mod,
        topics: newTopics,
        progress: 100,
        status: 'completed' as const,
      };
    });

    setRoadmapModules(updatedModules);

    if (currentUserUid) {
      await saveUserData(currentUserUid, { roadmapModules: updatedModules });
    }

    const modName = sourceModules.find((m) => m.id === moduleId)?.title || 'Module';
    setToastMessage(`🎉 Module "${modName}" marked as 100% complete!`);
  };

  const handleRestoreModules = async () => {
    setRoadmapModules(initialRoadmapModules);
    setToastMessage('✅ Curriculum modules restored successfully!');
    if (currentUserUid) {
      await saveUserData(currentUserUid, { roadmapModules: initialRoadmapModules });
    }
  };

  const handleHeaderSearch = (term: string) => {
    if (term.trim().length > 0) {
      if (activeTab !== 'ai-tools' && activeTab !== 'roadmap') {
        setActiveTab('ai-tools');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <AuthView
          onAuthSuccess={handleAuthSuccess}
          onShowToast={(msg) => setToastMessage(msg)}
        />
        {toastMessage && (
          <NotificationToast
            message={toastMessage}
            onClear={() => setToastMessage(null)}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenContact={() => setShowContactModal(true)}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      {/* Main Top Header */}
      <Header
        profile={profile}
        setIsMobileOpen={setIsMobileOpen}
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenAIAssistant={() => {
          setAIAssistantCode(undefined);
          setShowAIAssistant(true);
        }}
        onOpenContact={() => setShowContactModal(true)}
        onSearch={handleHeaderSearch}
        unreadCount={assignments.filter((a) => a.isDueSoon).length}
        onOpenNotifications={() => {
          setToastMessage(`You have ${assignments.filter((a) => a.isDueSoon).length} pending assignment due soon!`);
        }}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main Content Area */}
      <main className="pt-14 lg:pl-64 flex-1 flex flex-col transition-all bg-slate-50 min-h-screen">
        {activeTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            roadmapModules={roadmapModules}
            assignments={assignments}
            notebooks={notebooks}
            onOpenAssignment={(asg) => setSelectedAssignment(asg)}
            onOpenNotebook={(nb) => setSelectedNotebook(nb)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAIAssistant={(code) => {
              setAIAssistantCode(code);
              setShowAIAssistant(true);
            }}
            onShowToast={(msg) => setToastMessage(msg)}
          />
        )}

        {activeTab === 'code-quest' && (
          <CodingGameView
            gameProgress={gameProgress}
            onSaveProgress={handleSaveGameProgress}
            currentUserUid={currentUserUid}
            profile={profile}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapView
            roadmapModules={roadmapModules}
            onToggleTopicCheck={handleToggleTopicCheck}
            onMarkModuleComplete={handleMarkModuleComplete}
            onRestoreModules={handleRestoreModules}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAIAssistant={() => {
              setAIAssistantCode(undefined);
              setShowAIAssistant(true);
            }}
          />
        )}

        {activeTab === 'ai-tools' && (
          <AIToolsView
            aiTools={aiTools}
            onToggleBookmark={handleToggleBookmark}
            onOpenAIAssistant={() => {
              setAIAssistantCode(undefined);
              setShowAIAssistant(true);
            }}
          />
        )}

        {activeTab === 'languages' && (
          <LanguagesView
            languages={languages}
            editorFontSize={profile.editorFontSize || 14}
            onOpenAIAssistantWithCode={(code) => {
              setAIAssistantCode(code);
              setShowAIAssistant(true);
            }}
          />
        )}

        {activeTab === 'resources' && (
          <ResourcesView
            notebooks={notebooks}
            roadmapModules={roadmapModules}
            onOpenNotebook={(nb) => setSelectedNotebook(nb)}
            onCreateNotebook={handleCreateNotebook}
            onToggleTopicCheck={handleToggleTopicCheck}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onShowToast={(msg) => setToastMessage(msg)}
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
          />
        )}
      </main>

      {/* Modals & Overlays */}
      <OnboardingModal
        isOpen={isAuthenticated && !profile?.onboardingCompleted}
        profile={profile}
        onCompleteOnboarding={(updatedProfile, defaultSem) => {
          handleUpdateProfile(updatedProfile);
          if (defaultSem) {
            setActiveTab('roadmap');
          }
        }}
        onShowToast={(msg) => setToastMessage(msg)}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={async (token, user) => {
          if (token) setAuthToken(token);
          await handleAuthSuccess(user);
        }}
        onShowToast={(msg) => setToastMessage(msg)}
      />

      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        profile={profile}
        onShowToast={(msg) => setToastMessage(msg)}
      />

      <AssignmentModal
        assignment={selectedAssignment}
        editorFontSize={profile.editorFontSize || 14}
        onClose={() => setSelectedAssignment(null)}
        onSubmitAssignment={handleSubmitAssignment}
        onShowToast={(msg) => setToastMessage(msg)}
      />

      <NotebookModal
        notebook={selectedNotebook}
        onClose={() => setSelectedNotebook(null)}
      />

      <AIAssistantModal
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        initialCode={aiAssistantCode}
      />

      <NotificationToast
        message={toastMessage}
        onClear={() => setToastMessage(null)}
      />
    </div>
  );
}

export default App;
