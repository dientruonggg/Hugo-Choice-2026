import React from 'react';

interface ButterflyParticleProps {
  type?: 'monarch' | 'white' | 'gold' | 'png' | 'hope';
  className?: string;
  size?: number;
}

export const ButterflyParticle: React.FC<ButterflyParticleProps> = ({
  type = 'monarch',
  className = '',
  size = 48
}) => {
  if (type === 'hope') {
    return (
      <img
        src="/assets/hope_butterfly.webp"
        alt="Hope Butterfly"
        style={{ width: size, height: 'auto' }}
        className={`animate-flutter drop-shadow-[0_4px_12px_rgba(96,165,250,0.6)] ${className}`}
      />
    );
  }
  if (type === 'png') {
    return (
      <img
        src="/assets/butterfly.webp"
        alt="Butterfly"
        style={{ width: size, height: 'auto' }}
        className={`animate-flutter drop-shadow-[0_4px_12px_rgba(255,255,255,0.4)] ${className}`}
      />
    );
  }
  if (type === 'white') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`animate-flutter drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] ${className}`}
      >
        {/* Left Wing */}
        <path
          d="M50 50 C20 10 0 30 15 65 C25 80 45 70 50 50 Z"
          fill="url(#whiteWingGrad)"
          stroke="rgba(255, 255, 255, 0.9)"
          strokeWidth="1.5"
        />
        {/* Right Wing */}
        <path
          d="M50 50 C80 10 100 30 85 65 C75 80 55 70 50 50 Z"
          fill="url(#whiteWingGrad)"
          stroke="rgba(255, 255, 255, 0.9)"
          strokeWidth="1.5"
        />
        {/* Inner glow detail */}
        <circle cx="50" cy="50" r="3" fill="#ffffff" />
        <defs>
          <linearGradient id="whiteWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#f3f4f6" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#e5e7eb" stopOpacity="0.7" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (type === 'gold') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`animate-flutter drop-shadow-[0_0_20px_rgba(251,191,36,0.9)] ${className}`}
      >
        <path
          d="M60 60 C20 0 -10 35 15 80 C35 105 55 85 60 60 Z"
          fill="url(#goldWingGrad)"
          stroke="#fef08a"
          strokeWidth="2"
        />
        <path
          d="M60 60 C100 0 130 35 105 80 C85 105 65 85 60 60 Z"
          fill="url(#goldWingGrad)"
          stroke="#fef08a"
          strokeWidth="2"
        />
        <path d="M60 45 L60 75" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
        <defs>
          <linearGradient id="goldWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Monarch butterfly default
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-flutter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] ${className}`}
    >
      {/* Monarch Wing Left */}
      <path
        d="M60 60 C15 5 -5 40 18 85 C38 100 55 80 60 60 Z"
        fill="url(#monarchGrad)"
        stroke="#18181b"
        strokeWidth="3"
      />
      <path
        d="M30 40 Q45 55 55 58 M25 60 Q42 68 55 62"
        stroke="#18181b"
        strokeWidth="2"
      />
      {/* Monarch Wing Right */}
      <path
        d="M60 60 C105 5 125 40 102 85 C82 100 65 80 60 60 Z"
        fill="url(#monarchGrad)"
        stroke="#18181b"
        strokeWidth="3"
      />
      <path
        d="M90 40 Q75 55 65 58 M95 60 Q78 68 65 62"
        stroke="#18181b"
        strokeWidth="2"
      />
      {/* Antennae & Body */}
      <path d="M60 42 C56 30 50 25 46 20 M60 42 C64 30 70 25 74 20" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="60" cy="60" rx="3" ry="12" fill="#18181b" />
      <defs>
        <linearGradient id="monarchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="60%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#9a3412" />
        </linearGradient>
      </defs>
    </svg>
  );
};
