import React from 'react';

interface MascotAvatarProps {
  direction: 'up' | 'right' | 'down' | 'left';
  mood?: 'idle' | 'moving' | 'happy' | 'oops';
  size?: number;
}

export const MascotAvatar: React.FC<MascotAvatarProps> = ({
  direction,
  mood = 'idle',
  size = 48,
}) => {
  // Map direction to degrees
  const dirDegrees = {
    right: 0,
    down: 90,
    left: 180,
    up: 270,
  }[direction];

  return (
    <div
      className="relative flex items-center justify-center transition-transform duration-300 ease-out"
      style={{
        width: size,
        height: size,
        transform: `rotate(${dirDegrees}deg)`,
      }}
    >
      {/* Robot SVG Container */}
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full drop-shadow-md transition-all ${
          mood === 'happy'
            ? 'animate-bounce'
            : mood === 'moving'
            ? 'scale-105'
            : mood === 'oops'
            ? 'animate-pulse'
            : ''
        }`}
      >
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4338ca" />
          </linearGradient>

          <linearGradient id="chestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          <linearGradient id="earGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Direction Pointer Nose / Arrow */}
        <path
          d="M 50,12 L 58,26 L 42,26 Z"
          fill="#f59e0b"
          className="drop-shadow-xs"
        />

        {/* Antenna */}
        <line
          x1="50"
          y1="25"
          x2="50"
          y2="10"
          stroke="#94a3b8"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle
          cx="50"
          cy="8"
          r="6"
          fill={mood === 'oops' ? '#f43f5e' : mood === 'happy' ? '#10b981' : '#38bdf8'}
          filter="url(#glow)"
          className="animate-pulse"
        />

        {/* Robot Head Outer */}
        <rect
          x="20"
          y="25"
          width="60"
          height="52"
          rx="18"
          fill="url(#bodyGrad)"
          stroke="#818cf8"
          strokeWidth="3"
        />

        {/* Side Ears / Knobs */}
        <rect x="12" y="40" width="8" height="18" rx="4" fill="url(#earGrad)" />
        <rect x="80" y="40" width="8" height="18" rx="4" fill="url(#earGrad)" />

        {/* Visor Screen */}
        <rect
          x="26"
          y="32"
          width="48"
          height="28"
          rx="12"
          fill="#0f172a"
          stroke="#334155"
          strokeWidth="2"
        />

        {/* Eyes based on mood */}
        {mood === 'oops' ? (
          // Confused / Hurt eyes (X X)
          <g stroke="#f43f5e" strokeWidth="3" strokeLinecap="round">
            <line x1="33" y1="40" x2="43" y2="50" />
            <line x1="43" y1="40" x2="33" y2="50" />
            <line x1="57" y1="40" x2="67" y2="50" />
            <line x1="67" y1="40" x2="57" y2="50" />
          </g>
        ) : mood === 'happy' ? (
          // Joyful arch eyes (^ ^)
          <g stroke="#38bdf8" strokeWidth="3.5" fill="none" strokeLinecap="round">
            <path d="M 33,48 Q 38,38 43,48" />
            <path d="M 57,48 Q 62,38 67,48" />
          </g>
        ) : (
          // Cute Glowing Round Eyes
          <g>
            <circle cx="38" cy="46" r="5" fill="#38bdf8" filter="url(#glow)" />
            <circle cx="62" cy="46" r="5" fill="#38bdf8" filter="url(#glow)" />
            <circle cx="40" cy="44" r="1.8" fill="#ffffff" />
            <circle cx="64" cy="44" r="1.8" fill="#ffffff" />
          </g>
        )}

        {/* Cute Mouth */}
        {mood === 'happy' ? (
          <path
            d="M 42,54 Q 50,60 58,54"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ) : mood === 'oops' ? (
          <path
            d="M 44,57 Q 50,52 56,57"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ) : (
          <rect x="44" y="54" width="12" height="3" rx="1.5" fill="#38bdf8" />
        )}

        {/* Chest Panel / Core */}
        <circle cx="50" cy="85" r="5" fill="#38bdf8" />
        <rect
          x="30"
          y="77"
          width="40"
          height="12"
          rx="6"
          fill="url(#chestGrad)"
          opacity="0.9"
        />
      </svg>
    </div>
  );
};
