import React, { useState } from 'react';
import { Logo } from './Logo';
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from '../firebase';

interface AuthViewProps {
  onAuthSuccess: (user: { name: string; email: string }) => void;
  onShowToast: (message: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess, onShowToast }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Loading & Error states
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Email format validation helper
  const isValidEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr.trim());
  };

  const parseFirebaseError = (err: any): string => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials.';
      case 'auth/email-already-in-use':
        return 'An account with this email address already exists. Try logging in instead.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/popup-closed-by-user':
        return 'Google Sign-In window was closed before completing.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please wait a moment and try again.';
      default:
        return err?.message || 'Authentication failed. Please try again.';
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !isValidEmail(email)) {
      setErrorMsg('Please enter a valid email address to receive password reset instructions.');
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccessMsg(`Password reset link sent to ${email.trim()}! Please check your inbox.`);
      onShowToast('Password reset email sent successfully.');
    } catch (err: any) {
      setErrorMsg(parseFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validation
    const cleanEmail = email.trim();
    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      setErrorMsg('Please enter a valid email address (e.g. user@example.com).');
      return;
    }

    if (!isResetMode) {
      if (!password) {
        setErrorMsg('Please enter your password.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
    }

    if (isSignUp && !name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        const user = userCredential.user;

        // Set Firebase display name
        await updateProfile(user, { displayName: name.trim() });

        const userName = name.trim() || cleanEmail.split('@')[0];
        onShowToast(`Welcome to AI Frands, ${userName}! Your account has been created.`);
        onAuthSuccess({
          name: userName,
          email: cleanEmail,
        });
      } else {
        // Log In
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const user = userCredential.user;
        const userName = user.displayName || name.trim() || user.email?.split('@')[0] || 'Student';

        onShowToast(`Welcome back, ${userName}!`);
        onAuthSuccess({
          name: userName,
          email: user.email || cleanEmail,
        });
      }
    } catch (err: any) {
      setErrorMsg(parseFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userName = user.displayName || user.email?.split('@')[0] || 'Google User';

      onShowToast(`Signed in with Google as ${userName}!`);
      onAuthSuccess({
        name: userName,
        email: user.email || '',
      });
    } catch (err: any) {
      setErrorMsg(parseFirebaseError(err));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-body-md">
      {/* Background Decorative Mesh / Lights */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main SaaS Auth Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center pb-1">
            <Logo size="lg" showText={false} />
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs font-black tracking-widest text-indigo-400 uppercase">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-extrabold text-sm">
              AI Frands
            </span>
            <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
            <span>CS LEARNING PORTAL</span>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {isResetMode
              ? 'Reset Password'
              : isSignUp
              ? 'Join AI Frands'
              : 'Welcome to AI Frands'}
          </h1>

          <p className="text-xs text-slate-400 max-w-xs mx-auto font-medium leading-relaxed">
            {isResetMode
              ? 'Enter your account email and we will send you instructions to reset your password.'
              : isSignUp
              ? 'Create your account to start tracking roadmaps, AI tools, and course assignments.'
              : 'Sign in to access your personalized CS roadmaps, notebooks, and AI study tutor.'}
          </p>
        </div>

        {/* Tab Switcher (Login vs Sign Up) */}
        {!isResetMode && (
          <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs font-extrabold">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                !isSignUp
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span>Log In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                isSignUp
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">person_add</span>
              <span>Sign Up</span>
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-950/80 border border-red-800/80 rounded-2xl text-red-200 text-xs font-medium flex items-start gap-2.5 animate-fadeIn">
            <span className="material-symbols-outlined text-red-400 text-base shrink-0 mt-0.5">
              error
            </span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-800/80 rounded-2xl text-emerald-200 text-xs font-medium flex items-start gap-2.5 animate-fadeIn">
            <span className="material-symbols-outlined text-emerald-400 text-base shrink-0 mt-0.5">
              check_circle
            </span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Password Reset Form */}
        {isResetMode ? (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                Account Email
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-slate-500 text-base">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.smith@csportal.edu"
                  className="w-full bg-slate-950/80 text-white text-xs rounded-xl py-2.5 pl-9 pr-3 focus:outline-none border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Sending Reset Link...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">mark_email_read</span>
                  <span>Send Reset Email</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsResetMode(false);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="w-full text-center text-xs text-indigo-400 hover:text-indigo-300 font-extrabold transition-colors cursor-pointer pt-1"
            >
              ← Back to Login
            </button>
          </form>
        ) : (
          /* Login / Signup Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-slate-500 text-base">
                    badge
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Smith"
                    className="w-full bg-slate-950/80 text-white text-xs rounded-xl py-2.5 pl-9 pr-3 focus:outline-none border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-slate-500 text-base">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.smith@csportal.edu"
                  className="w-full bg-slate-950/80 text-white text-xs rounded-xl py-2.5 pl-9 pr-3 focus:outline-none border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetMode(true);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-[10px] font-extrabold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-slate-500 text-base">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950/80 text-white text-xs rounded-xl py-2.5 pl-9 pr-9 focus:outline-none border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-500 hover:text-slate-300"
                >
                  <span className="material-symbols-outlined text-base">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span>Authenticating with Firebase...</span>
              ) : (
                <>
                  <span>{isSignUp ? 'Create Student Account' : 'Log In to AI Frands'}</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* OR Divider */}
        {!isResetMode && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-[1px] bg-slate-800 flex-1" />
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">
                OR
              </span>
              <div className="h-[1px] bg-slate-800 flex-1" />
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              disabled={isGoogleLoading || isLoading}
              onClick={handleGoogleSignIn}
              className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white border border-slate-800 hover:border-slate-700 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-2 text-center text-[10px] text-slate-500 font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-xs text-emerald-400">lock</span>
          <span>Secured by Firebase Authentication</span>
        </div>

      </div>
    </div>
  );
};
