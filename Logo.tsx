import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'full' | 'icon-only';
}

export const LogoIcon: React.FC<{ sizePx?: number; className?: string }> = ({
  sizePx = 36,
  className = '',
}) => {
  return (
    <svg
      width={sizePx}
      height={sizePx}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        {/* Main Icon Gradient - Cyan/Blue to Purple to Pink/Orange */}
        <linearGradient id="aiFrandsBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>

        <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#d946ef" />
        </linearGradient>

        <linearGradient id="codeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>

        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Chip/Container Outer Box */}
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        rx="26"
        fill="#0f172a"
        stroke="url(#aiFrandsBgGrad)"
        strokeWidth="4"
      />

      {/* Subtle Circuit Pins / Byte Dots */}
      <circle cx="20" cy="12" r="2.5" fill="#38bdf8" opacity="0.8" />
      <circle cx="80" cy="12" r="2.5" fill="#ec4899" opacity="0.8" />
      <circle cx="20" cy="88" r="2.5" fill="#8b5cf6" opacity="0.8" />
      <circle cx="80" cy="88" r="2.5" fill="#f59e0b" opacity="0.8" />

      {/* Code Brackets: '<' on left, '>' on right */}
      {/* Left bracket '<' */}
      <path
        d="M 32 36 L 20 50 L 32 64"
        stroke="url(#codeGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right bracket '>' */}
      <path
        d="M 68 36 L 80 50 L 68 64"
        stroke="url(#codeGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central Electric Lightning Bolt / Spark with Glow */}
      <path
        d="M 54 22 L 36 50 H 50 L 44 78 L 66 46 H 52 Z"
        fill="url(#boltGrad)"
        filter="url(#glow)"
      />

      {/* Inner highlight core of bolt */}
      <path
        d="M 53 25 L 39 50 H 51 L 46 73 L 63 47 H 51 Z"
        fill="#ffffff"
        opacity="0.4"
      />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizePx = size === 'sm' ? 28 : size === 'md' ? 36 : size === 'lg' ? 44 : 56;

  const textSizeClasses =
    size === 'sm'
      ? 'text-base'
      : size === 'md'
      ? 'text-lg'
      : size === 'lg'
      ? 'text-2xl'
      : 'text-3xl';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon sizePx={sizePx} />

      {showText && (
        <div className="flex flex-col leading-none">
          <div className={`${textSizeClasses} font-extrabold tracking-tight flex items-center gap-1`}>
            {/* 'AI' in electric cyan/blue */}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-xs">
              AI
            </span>
            {/* 'Frands' in vibrant electric purple to neon pink/orange gradient */}
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-amber-400 bg-clip-text text-transparent drop-shadow-xs">
              Frands
            </span>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-0.5">
            CS LEARNING ENGINE
          </span>
        </div>
      )}
    </div>
  );
};
