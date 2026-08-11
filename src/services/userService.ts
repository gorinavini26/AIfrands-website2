import { doc, getDoc, setDoc, getDocFromServer, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { UserProfile, RoadmapModule, Assignment, Notebook } from '../types';
import { initialRoadmapModules, initialAssignments, initialNotebooks } from '../data/mockData';

/**
 * Saves sign-in/registration details (name, email, timestamp) to the 'signups' Firestore collection.
 */
export async function saveSignupToFirestore(name: string, email: string): Promise<void> {
  try {
    const signupsCollection = collection(db, 'signups');
    await addDoc(signupsCollection, {
      name: name.trim(),
      email: email.trim(),
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
    });
    console.info(`Saved signup record to Firestore signups collection for ${email}`);
  } catch (err) {
    console.error('Failed to save signup record to Firestore signups collection:', err);
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function getUidFromEmail(email: string): string {
  if (!email || !email.trim()) return `guest_${Date.now()}`;
  const clean = email.toLowerCase().trim();
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    const char = clean.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const cleanStr = clean.replace(/[^a-z0-9]/g, '_');
  return `usr_${cleanStr}_${Math.abs(hash)}`;
}

export interface UserData {
  userId: string;
  profile: UserProfile;
  roadmapModules: RoadmapModule[];
  assignments: Assignment[];
  notebooks: Notebook[];
  updatedAt?: string;
}

/**
  Creates a clean zero-progress initial state for a brand new user account.
  - 0-day streak
  - 0 completed roadmap topics (0% progress)
  - 0 submitted assignments (all Pending)
 */
export function createZeroProgressUserData(uid: string, name?: string, email?: string): UserData {
  const cleanProfile: UserProfile = {
    id: uid,
    name: name || 'Student',
    studentId: `CS_${uid.substring(0, 6).toUpperCase()}`,
    year: 'Year 2',
    email: email || '',
    githubUrl: '',
    bio: 'Computer Science student starting their CS journey.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    streakDays: 0, // Zero streak for brand new user
    primaryLanguages: ['Python', 'C++'],
    toolsAndIdes: ['VS Code', 'Cursor'],
    editorFontSize: 14,
    highDensityTheme: false,
    notifications: {
      assignmentDeadlines: true,
      portalUpdates: false,
      communityMessages: true,
    },
  };

  const cleanRoadmapModules: RoadmapModule[] = initialRoadmapModules.map((m) => ({
    ...m,
    progress: 0,
    status: m.year > 2 ? 'locked' : 'in_progress',
    topics: m.topics.map((t) => ({ ...t, completed: false })),
  }));

  const cleanAssignments: Assignment[] = initialAssignments.map((a) => ({
    ...a,
    status: 'Pending',
    isDueSoon: a.id === 'asg_1',
    dueDate: a.id === 'asg_1' ? 'Due Tomorrow, 11:59 PM' : 'Due Oct 15, 2026',
    submissionCode: '',
    grade: undefined,
  }));

  // Clean initial notebook library
  const cleanNotebooks: Notebook[] = [...initialNotebooks];

  return {
    userId: uid,
    profile: cleanProfile,
    roadmapModules: cleanRoadmapModules,
    assignments: cleanAssignments,
    notebooks: cleanNotebooks,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Fetches user data for a specific UID from Firestore.
 * If the user document does not exist, creates and saves a fresh zero-progress user document.
 */
export async function getUserData(uid: string, name?: string, email?: string): Promise<UserData> {
  const userDocPath = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const existingData = userDocSnap.data() as Partial<UserData>;
      const fallback = createZeroProgressUserData(uid, name, email);
      const mergedProfile: UserProfile = {
        ...fallback.profile,
        ...(existingData.profile || {}),
        name: name || existingData.profile?.name || fallback.profile.name,
        email: email || existingData.profile?.email || fallback.profile.email,
      };
      return {
        userId: uid,
        profile: mergedProfile,
        roadmapModules: existingData.roadmapModules || fallback.roadmapModules,
        assignments: existingData.assignments || fallback.assignments,
        notebooks: existingData.notebooks || fallback.notebooks,
        updatedAt: existingData.updatedAt || new Date().toISOString(),
      };
    } else {
      // New user - create zero progress data
      const newZeroData = createZeroProgressUserData(uid, name, email);
      try {
        await setDoc(userDocRef, newZeroData);
      } catch (err) {
        console.warn('Could not save initial zero-progress document to Firestore:', err);
      }
      return newZeroData;
    }
  } catch (error) {
    console.info(`Notice: Could not load remote user document for UID ${uid}, falling back to default profile.`, error);
    // Fallback to local zero-progress user data if network/offline
    return createZeroProgressUserData(uid, name, email);
  }
}

/**
 * Persists updated user data to Firestore under their UID.
 */
export async function saveUserData(uid: string, data: Partial<UserData>): Promise<void> {
  if (!uid) return;
  const userDocPath = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(
      userDocRef,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userDocPath);
  }
}

/**
 * Validate Firestore connection
 */
export async function validateFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (err) {
    console.info('Firestore offline or connecting...', err);
    return false;
  }
}
