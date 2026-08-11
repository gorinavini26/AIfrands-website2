import React from 'react';

export const SkeletonHeaderBanner: React.FC = () => (
  <div className="animate-pulse bg-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-4 border-2 border-slate-700 shadow-xl">
    <div className="h-6 bg-slate-700/80 rounded-full w-36" />
    <div className="h-8 bg-slate-700/90 rounded-xl w-3/4 sm:w-1/2" />
    <div className="h-4 bg-slate-700/60 rounded-lg w-full max-w-xl" />
    <div className="flex gap-3 pt-2">
      <div className="h-10 bg-slate-700/90 rounded-2xl w-32" />
      <div className="h-10 bg-slate-700/60 rounded-2xl w-28" />
    </div>
  </div>
);

export const SkeletonCardGrid: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-xs">
        <div className="flex justify-between items-center">
          <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-24" />
        <div className="h-7 bg-slate-300 dark:bg-slate-700 rounded-lg w-16" />
        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full w-full" />
      </div>
    ))}
  </div>
);

export const SkeletonList: React.FC<{ rows?: number }> = ({ rows = 3 }) => (
  <div className="space-y-3 w-full">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="animate-pulse bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded-md w-2/3" />
        </div>
        <div className="w-20 h-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>
    ))}
  </div>
);
