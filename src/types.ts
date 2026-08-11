export interface UserProfile {
  id: string;
  name: string;
  studentId: string;
  year: string;
  currentSemester?: number;
  onboardingCompleted?: boolean;
  email: string;
  githubUrl: string;
  bio: string;
  avatarUrl: string;
  streakDays: number;
  primaryLanguages: string[];
  toolsAndIdes: string[];
  editorFontSize: number;
  highDensityTheme?: boolean;
  notifications: {
    assignmentDeadlines: boolean;
    portalUpdates: boolean;
    communityMessages: boolean;
  };
}

export interface RoadmapResource {
  id: string;
  title: string;
  type: 'youtube' | 'doc' | 'course' | 'article';
  channelOrProvider: string;
  url: string;
  durationOrBadge?: string;
}

export interface RoadmapModule {
  id: string;
  title: string;
  category: 'Core Module' | 'Elective' | 'Lab' | 'Project';
  progress: number; // 0 to 100
  year: number; // 1, 2, 3, 4
  semesters: string; // e.g. "Semester 3 & 4"
  description: string;
  status: 'completed' | 'in_progress' | 'locked';
  topics: { name: string; completed: boolean }[];
  resources?: RoadmapResource[];
}

export interface AITool {
  id: string;
  name: string;
  provider: string;
  description: string;
  category: 'LLM' | 'Developer Tool' | 'Research' | 'Creative' | 'Writing';
  icon: string;
  bookmarked: boolean;
  url: string;
}

export interface Assignment {
  id: string;
  title: string;
  filename: string;
  course: string;
  dueDate: string;
  status: 'Pending' | 'Submitted' | 'Graded';
  isDueSoon: boolean;
  grade?: string;
  description: string;
  submissionCode?: string;
}

export interface Notebook {
  id: string;
  title: string;
  category: string;
  summary: string;
  updatedAt: string;
  fileCount: number;
  content?: string;
}

export interface CommitDay {
  date: string;
  count: number; // 0 to 8+
}

export interface TechLanguage {
  id: string;
  name: string;
  code: string;
  level: 'Advanced' | 'Intermediate' | 'Beginner';
  color: string;
  bgOpacityColor: string;
  description: string;
  sampleCode: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  year?: string;
  studentId?: string;
  createdAt?: string;
}

export interface ContactFormInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  previewUrl?: string;
  details?: {
    adminEmail: string;
    submittedAt: string;
  };
}
