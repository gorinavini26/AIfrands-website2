import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import jwt from 'jsonwebtoken';
import { userDb } from './src/db/userStore.js';
import { sendContactNotificationEmail } from './src/services/emailService.js';
import {
  initialProfile,
  initialRoadmapModules,
  initialAITools,
  initialAssignments,
  initialNotebooks,
  techLanguages,
} from './src/data/mockData.js';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'cs_portal_secure_jwt_secret_key_2026';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-Memory Database State
let currentProfile = { ...initialProfile };
let roadmapModules = [...initialRoadmapModules];
let aiTools = [...initialAITools];
let assignments = [...initialAssignments];
let notebooks = [...initialNotebooks];

// Authentication Middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required.' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decodedUser: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.user = decodedUser;
    next();
  });
}

// Initialize Gemini Client Lazily
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// --- API ROUTES ---

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Authentication Routes (JWT & Password Hashing via User Database)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, year } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const newUser = await userDb.createUser({ name, email, password, year });
    const safeUser = userDb.sanitizeUser(newUser);

    // Sync profile
    currentProfile.name = safeUser.name;
    currentProfile.email = safeUser.email;
    currentProfile.year = safeUser.year;
    currentProfile.studentId = safeUser.studentId;

    const token = jwt.sign(
      { id: safeUser.id, email: safeUser.email, name: safeUser.name, year: safeUser.year, role: safeUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Account created successfully with secure password hashing.',
      token,
      user: safeUser,
    });
  } catch (err: any) {
    console.error('Registration Error:', err);
    return res.status(400).json({ error: err.message || 'Registration failed.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = userDb.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. User email not found.' });
    }

    const isMatch = await userDb.verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials. Password incorrect.' });
    }

    const safeUser = userDb.sanitizeUser(user);

    // Sync profile
    currentProfile.name = safeUser.name;
    currentProfile.email = safeUser.email;
    currentProfile.year = safeUser.year;
    currentProfile.studentId = safeUser.studentId;

    const token = jwt.sign(
      { id: safeUser.id, email: safeUser.email, name: safeUser.name, year: safeUser.year, role: safeUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful. JWT issued.',
      token,
      user: safeUser,
    });
  } catch (err: any) {
    console.error('Login Error:', err);
    return res.status(500).json({ error: 'Authentication service failure.' });
  }
});

app.get('/api/auth/me', authenticateToken, (req: any, res) => {
  const user = userDb.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User account not found.' });
  }

  const safeUser = userDb.sanitizeUser(user);
  return res.json({
    authenticated: true,
    user: safeUser,
    profile: currentProfile,
  });
});

app.post('/api/auth/logout', (req, res) => {
  return res.json({ message: 'Logged out successfully.' });
});

// Contact Form & Nodemailer Email Processing Endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, Email, and Message are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const result = await sendContactNotificationEmail({
      name,
      senderEmail: email,
      subject: subject || 'CS Portal Inquiry',
      message,
      to: process.env.ADMIN_EMAIL || 'admin@csportal.edu',
    });

    return res.json({
      success: true,
      message: 'Thank you for reaching out! Your message was received and an administrator notification email was sent via Nodemailer.',
      previewUrl: result.previewUrl,
      details: {
        adminEmail: result.adminEmail,
        submittedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error('Contact Form Processing Error:', err);
    return res.status(500).json({
      error: 'Failed to send notification email.',
      details: err?.message || 'Nodemailer transporter error.',
    });
  }
});

// Profile & Preferences API
app.get('/api/profile', (req, res) => {
  res.json(currentProfile);
});

app.put('/api/profile', (req, res) => {
  const { name, bio, year, githubUrl, email, avatarUrl } = req.body;

  if (name !== undefined) currentProfile.name = name;
  if (bio !== undefined) currentProfile.bio = bio;
  if (year !== undefined) currentProfile.year = year;
  if (githubUrl !== undefined) currentProfile.githubUrl = githubUrl;
  if (email !== undefined) currentProfile.email = email;
  if (avatarUrl !== undefined) currentProfile.avatarUrl = avatarUrl;

  res.json({ message: 'Profile updated', profile: currentProfile });
});

app.put('/api/profile/preferences', (req, res) => {
  const { primaryLanguages, toolsAndIdes, editorFontSize } = req.body;

  if (primaryLanguages) currentProfile.primaryLanguages = primaryLanguages;
  if (toolsAndIdes) currentProfile.toolsAndIdes = toolsAndIdes;
  if (editorFontSize) currentProfile.editorFontSize = editorFontSize;

  res.json({ message: 'Preferences updated', profile: currentProfile });
});

app.put('/api/profile/notifications', (req, res) => {
  const { assignmentDeadlines, portalUpdates, communityMessages } = req.body;

  if (currentProfile.notifications) {
    if (assignmentDeadlines !== undefined)
      currentProfile.notifications.assignmentDeadlines = assignmentDeadlines;
    if (portalUpdates !== undefined)
      currentProfile.notifications.portalUpdates = portalUpdates;
    if (communityMessages !== undefined)
      currentProfile.notifications.communityMessages = communityMessages;
  }

  res.json({ message: 'Notification rules updated', profile: currentProfile });
});

// Roadmap API
app.get('/api/roadmap', (req, res) => {
  res.json(roadmapModules);
});

app.put('/api/roadmap/module', (req, res) => {
  const { id, progress, status, completedTopic } = req.body;
  const mod = roadmapModules.find((m) => m.id === id);

  if (!mod) {
    return res.status(404).json({ error: 'Module not found' });
  }

  if (progress !== undefined) mod.progress = progress;
  if (status !== undefined) mod.status = status;
  if (completedTopic !== undefined) {
    const t = mod.topics.find((topic) => topic.name === completedTopic);
    if (t) t.completed = true;
  }

  res.json({ message: 'Module updated', module: mod });
});

// AI Tools API
app.get('/api/tools', (req, res) => {
  res.json(aiTools);
});

app.post('/api/tools/bookmark', (req, res) => {
  const { id } = req.body;
  const tool = aiTools.find((t) => t.id === id);
  if (!tool) {
    return res.status(404).json({ error: 'Tool not found' });
  }

  tool.bookmarked = !tool.bookmarked;
  res.json({ message: 'Bookmark status toggled', tool });
});

// Assignments API
app.get('/api/assignments', (req, res) => {
  res.json(assignments);
});

app.post('/api/assignments/submit', (req, res) => {
  const { assignmentId, submissionCode } = req.body;
  const asg = assignments.find((a) => a.id === assignmentId);

  if (!asg) {
    return res.status(404).json({ error: 'Assignment not found' });
  }

  asg.status = 'Submitted';
  asg.isDueSoon = false;
  asg.submissionCode = submissionCode;
  asg.dueDate = 'Submitted just now';

  // Increase streak for completing work
  currentProfile.streakDays += 1;

  res.json({
    message: 'Assignment submitted successfully!',
    assignment: asg,
    streakDays: currentProfile.streakDays,
  });
});

// Notebooks / NotebookLM Library API
app.get('/api/notebooks', (req, res) => {
  res.json(notebooks);
});

app.post('/api/notebooks', (req, res) => {
  const { title, category, summary, content } = req.body;
  if (!title || !category) {
    return res.status(400).json({ error: 'Title and Category are required.' });
  }

  const newNotebook = {
    id: `nb_${Date.now()}`,
    title,
    category,
    summary: summary || 'Custom study synthesis notes created in portal.',
    updatedAt: 'Just now',
    fileCount: 1,
    content: content || `# ${title}\n\nCategory: ${category}\n\nNotes created on CS Portal.`,
  };

  notebooks.unshift(newNotebook);
  res.json({ message: 'Notebook created', notebook: newNotebook });
});

// Languages API
app.get('/api/languages', (req, res) => {
  res.json(techLanguages);
});

// Commit Activity Heatmap API
app.get('/api/activity', (req, res) => {
  const days = 30;
  const activityData = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const count = Math.floor(Math.random() * 8); // 0 to 7 commits
    return {
      date: d.toISOString().split('T')[0],
      count,
    };
  });
  res.json(activityData);
});

// Gemini AI Assistant Endpoint
app.post('/api/ai/code-assistant', async (req, res) => {
  const { prompt, context } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt parameter is required.' });
  }

  const aiClient = getGeminiClient();
  if (!aiClient) {
    // Graceful fallback response when API key is not configured
    return res.json({
      text: `[CS Portal AI Tutor - Offline Mode]\n\nHere is guidance on "${prompt}":\n\n1. Check your logic and data structure constraints.\n2. Ensure proper memory/pointer initialization if in C/C++.\n3. Make sure to test boundary cases (e.g. empty inputs, null pointers).\n\n(Tip: Attach your Gemini API Key in Settings > Secrets to activate real-time Gemini AI code reasoning!)`,
    });
  }

  try {
    const systemInstruction = `You are the CS Portal AI Coding Assistant & CS Tutor for BTech Computer Science students.
Provide precise, well-structured, encouraging technical guidance, code explanations, algorithmic complexity (Big O) breakdowns, and debugging tips. Keep responses formatted in clean Markdown.`;

    const fullPrompt = context
      ? `Context / Code:\n${context}\n\nStudent Query: ${prompt}`
      : prompt;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text || 'No response text returned from model.' });
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    res.status(500).json({
      error: 'AI Assistant error',
      details: err?.message || 'Failed to call Gemini API',
    });
  }
});

// --- SERVER INITIALIZATION ---
async function startServer() {
  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
