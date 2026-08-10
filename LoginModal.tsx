import React, { useState } from 'react';
import { Logo } from './Logo';
import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
} from '../firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string, user: { name: string; email: string; year?: string; studentId?: string; uid?: string; isNewUser?: boolean }) => void;
  onShowToast: (msg: string) => void;
}

const LoadingSpinner: React.FC = () => (
  <svg
    className="animate-spin h-4 w-4 text-current"
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

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onShowToast,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

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
      return `Domain "${currentDomain}" is not authorized. Add "${currentDomain}" to Firebase Console > Authentication > Settings > Authorized domains.`;
    }
    if (code === 'auth/popup-blocked') {
      return 'Your browser blocked the Google sign-in popup. Allow popups for this site and try again.';
    }
    if (code === 'auth/configuration-not-found' || code === 'auth/operation-not-allowed') {
      return 'Google Sign-In is not enabled for this Firebase project. Enable Google under Firebase Console → Authentication → Sign-in method.';
    }
    if (code === 'auth/unauthorized-client') {
      return 'Unauthorized Client ID or origin. Check Google Cloud / Firebase Console settings.';
    }
    if (code === 'auth/network-request-failed') {
      return 'Network connection issue. Please check your internet connection.';
    }

    if (message.includes('auth/') || message.includes('Firebase:')) {
      return 'Google Authentication failed. Please try again.';
    }

    return message || 'Authentication failed. Please try again.';
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      const userName = result.user.displayName || 'Google User';
      const additionalInfo = getAdditionalUserInfo(result);
      onLoginSuccess(token, {
        name: userName,
        email: result.user.email || '',
        uid: result.user.uid,
        isNewUser: additionalInfo?.isNewUser === true,
      });
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
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-5 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded transition-colors"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>

        <div className="space-y-2">
          <div className="flex justify-center pb-1">
            <Logo size="md" showText={false} />
          </div>

          <h2 className="text-xl text-slate-900 font-extrabold">
            Welcome to AI Frands
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium">
            Sign in with your Google account to access your AI Frands dashboard.
          </p>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 text-left font-medium">
            {errorMsg}
          </div>
        )}

        <button
          type="button"
          disabled={isLoading}
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2.5 py-3 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-xl text-xs sm:text-sm font-extrabold text-white transition-all shadow-md cursor-pointer disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span>Connecting to Google...</span>
            </>
          ) : (
            <>
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
              <span>Sign in with Google</span>
            </>
          )}
        </button>

        <div className="pt-1 text-center font-mono text-[10px] text-slate-400">
          Firebase Auth
        </div>
      </div>
    </div>
  );
};
