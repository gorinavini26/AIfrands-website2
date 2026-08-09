import React, { useEffect } from 'react';

interface NotificationToastProps {
  message: string | null;
  onClear: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  message,
  onClear,
}) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClear();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [message, onClear]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-surface-container-high border border-tertiary/40 text-on-surface px-5 py-3.5 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
      <span className="material-symbols-outlined text-tertiary text-xl animate-pulse">
        check_circle
      </span>
      <span className="text-xs font-label-caps font-semibold tracking-wide">
        {message}
      </span>
      <button
        onClick={onClear}
        className="text-on-surface-variant hover:text-on-surface ml-2"
      >
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
};
