import React, { useState } from 'react';
import { Logo } from './Logo';
import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
} from '../firebase';

interface AuthViewProps {
  onAuthSuccess: (user: { name: string; email: string }) => void;
  onShowToast: (message: string) => void;
}

const LoadingSpinner: React.FC = () => (
  <svg
    className="animate-spin h-5 w-5 text-current"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess, onShowToast }) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const parseFirebaseError = (err: any): string => {
    console.error('[Firebase Auth Error Details]:', {
      code: err?.code,
      message: err?.message,
      fullError: err,
      domain: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
    });

    const code = err?.code || '';
    const message = err?.message || '';
    const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'your live domain';

    if (code === 'auth/popup-closed-by-user') {
      return 'Google Sign-In was cancelled.';
    }
    if (code === 'auth/unauthorized-domain') {
      return `Domain "${currentDomain}" is not authorized in Firebase. Add "${currentDomain}" to Firebase Console > Authentication > Settings > Authorized domains.`;
    }
    if (code === 'auth/unauthorized-client') {
      return 'Unauthorized Client ID or domain origin. Check OAuth settings in Google Cloud / Firebase Console.';
    }
    if (code === 'auth/network-request-failed') {
      return 'Network connection issue. Please check your internet connection and try again.';
    }

    if (message.includes('auth/') || message.includes('Firebase:')) {
      return 'Google Authentication failed. Please try again or use Guest Mode.';
    }

    return message || 'Google Authentication failed. Please try again.';
  };

  const handleDemoMode = () => {
    onShowToast('Entered as Student Guest (Demo Mode)');
    onAuthSuccess({
      name: 'Student Guest',
      email: 'guest@university.edu',
    });
  };

  const handleGoogleSignIn = async () => {
    if (isGoogleLoading) return;

    setErrorMsg('');
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
      {/* Background Glow Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Centered Card */}
      <div className="w-full max-w-md bg-slate-900/95 border border-slate-800/90 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-xl relative z-10 space-y-7 text-center">
        
        {/* Brand Header */}
        <div className="space-y-3">
          <div className="flex justify-center pb-1">
            <Logo size="lg" showText={false} />
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] font-black tracking-widest text-indigo-400 uppercase">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-extrabold text-sm">
              AI Frands
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span>CS LEARNING PORTAL</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome to AI Frands
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
            Sign in with your Google account to access your CS roadmaps, AI study tutors, and interactive notebooks.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 bg-red-950/90 border border-red-800/80 rounded-2xl text-red-200 text-xs font-medium flex items-start gap-2.5 text-left shadow-sm animate-fadeIn">
            <span className="material-symbols-outlined text-red-400 text-base shrink-0 mt-0.5">
              error
            </span>
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3.5 pt-2">
          {/* Primary Google Sign-In Button */}
          <button
            type="button"
            disabled={isGoogleLoading}
            onClick={handleGoogleSignIn}
            className="w-full h-12 sm:h-13 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-extrabold text-sm sm:text-base rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-white/5 cursor-pointer border border-slate-200 disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {isGoogleLoading ? (
              <>
                <LoadingSpinner />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
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
                <span>Sign in with Google</span>
              </>
            )}
          </button>

          {/* Guest Mode Option */}
          <button
            type="button"
            disabled={isGoogleLoading}
            onClick={handleDemoMode}
            className="w-full h-11 bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-indigo-500/50 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-indigo-400">explore</span>
            <span>Continue as Guest</span>
          </button>
        </div>

        {/* Security Footer */}
        <div className="pt-2 text-[10px] text-slate-500 font-extrabold uppercase tracking-widest flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-xs text-emerald-400">lock</span>
          <span>Secured by Google Firebase Auth</span>
        </div>

      </div>
    </div>
  );
};
