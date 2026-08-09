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

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string, user: { name: string; email: string; year?: string; studentId?: string }) => void;
  onShowToast: (msg: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onShowToast,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [year, setYear] = useState('Year 3');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const parseFirebaseError = (err: any): string => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      case 'auth/email-already-in-use':
        return 'An account with this email address already exists.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      default:
        return err?.message || 'Authentication failed.';
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address to reset password.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccessMsg(`Reset email sent to ${email.trim()}!`);
      onShowToast('Password reset email sent.');
    } catch (err: any) {
      setErrorMsg(parseFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setErrorMsg('Please enter your full name.');
          setIsLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(userCredential.user, { displayName: name.trim() });
        const token = await userCredential.user.getIdToken();
        const userName = name.trim() || email.split('@')[0];
        onLoginSuccess(token, { name: userName, email: email.trim(), year });
        onShowToast(`Account created for ${userName}!`);
        onClose();
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        const token = await userCredential.user.getIdToken();
        const userName = userCredential.user.displayName || email.split('@')[0];
        onLoginSuccess(token, { name: userName, email: email.trim(), year });
        onShowToast(`Welcome back, ${userName}!`);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(parseFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      const userName = result.user.displayName || 'Google User';
      onLoginSuccess(token, { name: userName, email: result.user.email || '', year });
      onShowToast(`Logged in with Google as ${userName}!`);
      onClose();
    } catch (err: any) {
      setErrorMsg(parseFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded transition-colors"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>

        <div className="text-center space-y-1">
          <div className="flex justify-center pb-1">
            <Logo size="md" showText={false} />
          </div>

          <h2 className="text-lg text-slate-900 font-extrabold">
            {isResetMode ? 'Reset Password' : isSignUp ? 'Create Student Account' : 'Welcome to AI Frands'}
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium">
            {isResetMode
              ? 'Enter your account email to receive password reset link.'
              : isSignUp
              ? 'Join the AI Frands learning portal to track your CS roadmap.'
              : 'Enter your credentials to access AI Frands dashboard.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 text-center font-medium">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-2.5 bg-emerald-50 text-emerald-700 text-xs rounded-xl border border-emerald-200 text-center font-medium">
            {successMsg}
          </div>
        )}

        {isResetMode ? (
          <form onSubmit={handlePasswordReset} className="space-y-3">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                Student Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@csportal.edu"
                className="w-full bg-slate-50 text-slate-800 text-xs rounded-xl py-2 px-3 focus:outline-none border border-slate-200 focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-600 text-white font-extrabold text-xs rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              {isLoading ? 'Sending Link...' : 'Send Password Reset Link'}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsResetMode(false);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="w-full text-center text-xs text-indigo-600 hover:underline font-extrabold cursor-pointer pt-1"
            >
              ← Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Smith"
                    className="w-full bg-slate-50 text-slate-800 text-xs rounded-xl py-2 px-3 focus:outline-none border border-slate-200 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                    Academic Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-slate-50 text-slate-800 text-xs rounded-xl py-2 px-3 focus:outline-none border border-slate-200 focus:ring-1 focus:ring-indigo-500 font-extrabold"
                  >
                    <option value="Year 1">Year 1 (Fundamentals)</option>
                    <option value="Year 2">Year 2 (Core CS)</option>
                    <option value="Year 3">Year 3 (Specialization)</option>
                    <option value="Year 4">Year 4 (Projects & Career)</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                Student Email
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-slate-400 text-base">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@csportal.edu"
                  className="w-full bg-slate-50 text-slate-800 text-xs rounded-xl py-2 pl-9 pr-3 focus:outline-none border border-slate-200 focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
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
                    className="text-[10px] text-indigo-600 hover:underline font-extrabold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-slate-400 text-base">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 text-slate-800 text-xs rounded-xl py-2 pl-9 pr-9 focus:outline-none border border-slate-200 focus:ring-1 focus:ring-indigo-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-600 text-white font-extrabold text-xs rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Log In'}</span>
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>
        )}

        {!isResetMode && (
          <>
            <div className="flex items-center gap-2 my-2">
              <div className="h-[1px] bg-slate-200 flex-1" />
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                OR CONTINUE WITH
              </span>
              <div className="h-[1px] bg-slate-200 flex-1" />
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-extrabold text-slate-800 border border-slate-200 transition-colors cursor-pointer"
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
              <span>Continue with Google</span>
            </button>
          </>
        )}

        <div className="pt-1 text-center flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setIsResetMode(false);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className="text-indigo-600 hover:underline font-extrabold cursor-pointer"
          >
            {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
          </button>
          <span className="font-mono text-[10px] text-slate-400">Firebase Auth</span>
        </div>
      </div>
    </div>
  );
};

