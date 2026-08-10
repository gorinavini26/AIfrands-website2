import React, { useState, useEffect } from 'react';
import { UserProfile, RoadmapModule, AITool, Assignment, Notebook, TechLanguage } from './types';
import { initialProfile, initialRoadmapModules, initialAITools, initialAssignments, initialNotebooks, techLanguages } from './data/mockData';
import { auth, signOut, onAuthStateChanged } from './firebase';
import { AuthView } from './components/AuthView';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { RoadmapView } from './components/RoadmapView';
import { AIToolsView } from './components/AIToolsView';
import { LanguagesView } from './components/LanguagesView';
import { ResourcesView } from './components/ResourcesView';
import { SettingsView } from './components/SettingsView';
import { LoginModal } from './components/LoginModal';
import { ContactModal } from './components/ContactModal';
import { AssignmentModal } from './components/AssignmentModal';
import { NotebookModal } from './components/NotebookModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { NotificationToast } from './components/NotificationToast';
import { OnboardingView } from './components/OnboardingView';
import { StreakModal } from './components/StreakModal';

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

  // Auth & Token state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [onboardingUser, setOnboardingUser] = useState<{ name: string; email: string; uid: string } | null>(null);
  const [showStreakModal, setShowStreakModal] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Modal States
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(false);
  const [aiAssistantCode, setAIAssistantCode] = useState<string | undefined>(undefined);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setAuthReady(true);

      if (firebaseUser) {
        setIsAuthenticated(true);
        const userName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Student';

        setProfile((prev) => ({
          ...prev,
          id: firebaseUser.uid,
          name: userName,
          email: firebaseUser.email || prev.email,
          avatarUrl: firebaseUser.photoURL || prev.avatarUrl,
        }));

        const onboardingKey = `aifrands:onboarding:${firebaseUser.uid}`;
        const pending = localStorage.getItem(onboardingKey) === 'pending';
        if (pending) {
          setOnboardingUser({ name: userName, email: firebaseUser.email || '', uid: firebaseUser.uid });
          setShowOnboarding(true);
          setActiveTab('dashboard');
        }
      } else {
        setIsAuthenticated(false);
        setShowOnboarding(false);
        setOnboardingUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load initial backend data
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [profRes, roadRes, toolRes, asgRes, nbRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/roadmap'),
          fetch('/api/tools'),
          fetch('/api/assignments'),
          fetch('/api/notebooks'),
        ]);

        if (profRes.ok) setProfile(await profRes.json());
        if (roadRes.ok) setRoadmapModules(await roadRes.json());
        if (toolRes.ok) setAITools(await toolRes.json());
        if (asgRes.ok) setAssignments(await asgRes.json());
        if (nbRes.ok) {
          const serverNotebooks: Notebook[] = await nbRes.json();
          const localNotebooks: Notebook[] = JSON.parse(
            localStorage.getItem('aifrands:custom-notebooks') || '[]'
          );
          const serverIds = new Set(serverNotebooks.map((nb) => nb.id));
          setNotebooks([
            ...localNotebooks.filter((nb) => !serverIds.has(nb.id)),
            ...serverNotebooks,
          ]);
        }
      } catch (err) {
        console.warn('Backend API offline or starting up, using local state.', err);
      }
    }

    loadBackendData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    } catch (err) {
      console.warn('Logout error:', err);
    }
    localStorage.removeItem('auth_token');
    setAuthToken(null);
    setIsAuthenticated(false);
    setToastMessage('Logged out successfully from AI Frands.');
  };

  const handleLoginSuccess = (
    token: string,
    user: { name: string; email: string; year?: string; studentId?: string }
  ) => {
    if (token) {
      setAuthToken(token);
    }
    setIsAuthenticated(true);
    setProfile((prev) => ({
      ...prev,
      name: user.name || prev.name,
      email: user.email || prev.email,
      year: user.year || prev.year,
      studentId: user.studentId || prev.studentId,
    }));
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

    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error('Failed to sync profile with server', err);
    }
  };

  const handleSubmitAssignment = async (assignmentId: string, submissionCode: string) => {
    try {
      const res = await fetch('/api/assignments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId, submissionCode }),
      });

      if (res.ok) {
        const data = await res.json();
        setAssignments((prev) =>
          prev.map((a) => (a.id === assignmentId ? data.assignment : a))
        );
        if (data.streakDays) {
          setProfile((prev) => ({ ...prev, streakDays: data.streakDays }));
        }
      } else {
        setAssignments((prev) =>
          prev.map((a) =>
            a.id === assignmentId
              ? { ...a, status: 'Submitted', isDueSoon: false, dueDate: 'Submitted just now', submissionCode }
              : a
          )
        );
      }
    } catch {
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === assignmentId
            ? { ...a, status: 'Submitted', isDueSoon: false, dueDate: 'Submitted just now', submissionCode }
            : a
        )
      );
    }
  };

  const handleCreateNotebook = async (
    title: string,
    category: string,
    summary: string,
    content: string
  ) => {
    const localNb: Notebook = {
      id: `nb_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title: title.trim(),
      category,
      summary: summary.trim() || 'Custom study synthesis notes created in AI Frands.',
      updatedAt: 'Just now',
      fileCount: 1,
      content: content.trim() || `# ${title.trim()}\n\n## Study Notes\n\nStart writing your notes here.`,
    };

    // Update the UI immediately. The notebook is usable even if the optional
    // backend API is unavailable (for example on a static deployment).
    setNotebooks((prev) => {
      const next = [localNb, ...prev];
      const custom = JSON.parse(localStorage.getItem('aifrands:custom-notebooks') || '[]');
      localStorage.setItem('aifrands:custom-notebooks', JSON.stringify([localNb, ...custom]));
      return next;
    });
    setToastMessage(`Notebook "${localNb.title}" created successfully!`);

    try {
      const res = await fetch('/api/notebooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: localNb.title,
          category: localNb.category,
          summary: localNb.summary,
          content: localNb.content,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.notebook) {
          setNotebooks((prev) => [
            data.notebook,
            ...prev.filter((nb) => nb.id !== localNb.id && nb.title !== localNb.title),
          ]);
          const custom = JSON.parse(localStorage.getItem('aifrands:custom-notebooks') || '[]');
          localStorage.setItem(
            'aifrands:custom-notebooks',
            JSON.stringify([data.notebook, ...custom.filter((nb: Notebook) => nb.id !== localNb.id && nb.title !== localNb.title)])
          );
        }
      }
    } catch (err) {
      console.warn('Notebook backend sync unavailable; keeping local notebook.', err);
    }
  };

  const completeOnboarding = (year: string, goal: string) => {
    if (onboardingUser) {
      localStorage.setItem(`aifrands:onboarding:${onboardingUser.uid}`, 'done');
      setProfile((prev) => ({ ...prev, year: year || prev.year }));
    }
    setShowOnboarding(false);
    setOnboardingUser(null);
    setActiveTab('dashboard');
    setToastMessage(`Welcome to AI Frands${onboardingUser ? ', ' + onboardingUser.name.split(' ')[0] : ''}! 🎉`);
  };

  const handleHeaderSearch = (term: string) => {
    if (term.trim().length > 0) {
      if (activeTab !== 'ai-tools' && activeTab !== 'roadmap') {
        setActiveTab('ai-tools');
      }
    }
  };

  if (!authReady) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white"><span className="text-sm font-bold">Loading AI Frands…</span></div>;
  }

  if (!isAuthenticated) {
    return (
      <>
        <AuthView
          onAuthSuccess={(user) => {
            setIsAuthenticated(true);
            setProfile((prev) => ({
              ...prev,
              id: user.uid,
              name: user.name,
              email: user.email,
            }));

            if (user.isNewUser) {
              localStorage.setItem(`aifrands:onboarding:${user.uid}`, 'pending');
              setOnboardingUser({ name: user.name, email: user.email, uid: user.uid });
              setShowOnboarding(true);
            } else {
              setActiveTab('dashboard');
            }
          }}
          onShowToast={(msg) => setToastMessage(msg)}
        />
        {toastMessage && (
          <NotificationToast
            message={toastMessage}
            onClose={() => setToastMessage(null)}
          />
        )}
      </>
    );
  }

  if (showOnboarding && onboardingUser) {
    return (
      <OnboardingView
        name={onboardingUser.name}
        email={onboardingUser.email}
        onComplete={completeOnboarding}
      />
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
        onOpenStreak={() => setShowStreakModal(true)}
        onOpenContact={() => setShowContactModal(true)}
        onSearch={handleHeaderSearch}
        unreadCount={assignments.filter((a) => a.isDueSoon).length}
        onOpenNotifications={() => {
          setToastMessage(`You have ${assignments.filter((a) => a.isDueSoon).length} pending assignment due soon!`);
        }}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
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

        {activeTab === 'roadmap' && (
          <RoadmapView
            roadmapModules={roadmapModules}
            onToggleTopicCheck={(moduleId, topicIndex) => {
              setRoadmapModules((prev) =>
                prev.map((mod) => {
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

                  const updated = {
                    ...mod,
                    topics: newTopics,
                    progress: newProgress,
                    status: newStatus as 'completed' | 'in_progress' | 'locked',
                  };

                  fetch('/api/roadmap/module', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      id: moduleId,
                      progress: newProgress,
                      status: newStatus,
                    }),
                  }).catch((err) => console.warn('Server sync error:', err));

                  return updated;
                })
              );
            }}
            onMarkModuleComplete={(moduleId) => {
              setRoadmapModules((prev) =>
                prev.map((mod) => {
                  if (mod.id !== moduleId) return mod;

                  const newTopics = mod.topics.map((t) => ({ ...t, completed: true }));
                  const updated = {
                    ...mod,
                    topics: newTopics,
                    progress: 100,
                    status: 'completed' as const,
                  };

                  fetch('/api/roadmap/module', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      id: moduleId,
                      progress: 100,
                      status: 'completed',
                    }),
                  }).catch((err) => console.warn('Server sync error:', err));

                  return updated;
                })
              );

              const modName = roadmapModules.find((m) => m.id === moduleId)?.title || 'Module';
              setToastMessage(`🎉 Congratulations! Module "${modName}" marked as 100% complete!`);
            }}
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
            onToggleTopicCheck={(moduleId, topicIndex) => {
              setRoadmapModules((prev) =>
                prev.map((mod) => {
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

                  const updated = {
                    ...mod,
                    topics: newTopics,
                    progress: newProgress,
                    status: newStatus as 'completed' | 'in_progress' | 'locked',
                  };

                  fetch('/api/roadmap/module', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      id: moduleId,
                      progress: newProgress,
                      status: newStatus,
                    }),
                  }).catch((err) => console.warn('Server sync error:', err));

                  return updated;
                })
              );
            }}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onShowToast={(msg) => setToastMessage(msg)}
          />
        )}
      </main>

      {/* Modals & Overlays */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={(token, user) => {
          handleLoginSuccess(token, user);
          if (user.isNewUser && user.uid) {
            localStorage.setItem(`aifrands:onboarding:${user.uid}`, 'pending');
            setOnboardingUser({ name: user.name, email: user.email, uid: user.uid });
            setShowOnboarding(true);
          }
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

      {showStreakModal && (
        <StreakModal
          days={profile.streakDays}
          onClose={() => setShowStreakModal(false)}
        />
      )}

      <NotificationToast
        message={toastMessage}
        onClear={() => setToastMessage(null)}
      />
    </div>
  );
}

export default App;
