import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  year: string;
  studentId: string;
  createdAt: string;
  role: 'student' | 'admin';
}

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure directory exists
function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn('Failed to create data directory:', err);
  }
}

// Initial seed users
function getInitialSeedUsers(): StoredUser[] {
  const salt = bcrypt.genSaltSync(10);
  const alexHash = bcrypt.hashSync('password123', salt);
  const adminHash = bcrypt.hashSync('admin123', salt);

  return [
    {
      id: 'usr_alex_001',
      name: 'Alex Chen',
      email: 'alex.chen@csportal.edu',
      passwordHash: alexHash,
      year: 'Year 3',
      studentId: 'CS-2024-88',
      createdAt: new Date('2025-09-01').toISOString(),
      role: 'student',
    },
    {
      id: 'usr_admin_001',
      name: 'Portal Administrator',
      email: 'admin@csportal.edu',
      passwordHash: adminHash,
      year: 'Faculty',
      studentId: 'FAC-001',
      createdAt: new Date('2025-01-01').toISOString(),
      role: 'admin',
    },
  ];
}

class UserDatabase {
  private users: StoredUser[] = [];

  constructor() {
    this.init();
  }

  private init() {
    ensureDataDir();
    try {
      if (fs.existsSync(USERS_FILE)) {
        const raw = fs.readFileSync(USERS_FILE, 'utf-8');
        this.users = JSON.parse(raw);
        console.log(`[UserDatabase] Loaded ${this.users.length} users from storage.`);
      } else {
        this.users = getInitialSeedUsers();
        this.save();
        console.log(`[UserDatabase] Seeded ${this.users.length} initial users to storage.`);
      }
    } catch (err) {
      console.error('[UserDatabase] Error reading users file, re-initializing seed users:', err);
      this.users = getInitialSeedUsers();
    }
  }

  private save() {
    ensureDataDir();
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(this.users, null, 2), 'utf-8');
    } catch (err) {
      console.error('[UserDatabase] Error saving users file:', err);
    }
  }

  public findByEmail(email: string): StoredUser | undefined {
    return this.users.find(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
    );
  }

  public findById(id: string): StoredUser | undefined {
    return this.users.find((u) => u.id === id);
  }

  public async createUser(userData: {
    name: string;
    email: string;
    password: string;
    year?: string;
  }): Promise<StoredUser> {
    const existing = this.findByEmail(userData.email);
    if (existing) {
      throw new Error('A user with this email address already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    const randomSuffix = Math.floor(10 + Math.random() * 90);
    const newUser: StoredUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: userData.name || userData.email.split('@')[0],
      email: userData.email.trim().toLowerCase(),
      passwordHash,
      year: userData.year || 'Year 1',
      studentId: `CS-2026-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      role: 'student',
    };

    this.users.push(newUser);
    this.save();
    return newUser;
  }

  public async verifyPassword(password: string, passwordHash: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
  }

  public sanitizeUser(user: StoredUser) {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  public getAllPublicUsers() {
    return this.users.map((u) => this.sanitizeUser(u));
  }
}

export const userDb = new UserDatabase();
