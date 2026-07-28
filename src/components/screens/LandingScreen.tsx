import React from 'react';
import { ScreenStep } from '../../types';
import { soundFx } from '../../utils/soundEffects';
import { ButterflyParticle } from '../ButterflyParticle';

interface LandingScreenProps {
  userName?: string;
  onStart: () => void;
  onRequireLogin: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ userName, onStart, onRequireLogin }) => {
  const [isFlyingToLogin, setIsFlyingToLogin] = React.useState(false);
  const [loginPos, setLoginPos] = React.useState({ x: 0, y: 0 });

  const handleStart = () => {
    soundFx.playSelect();
    if (!userName) {
      const loginBtn = document.getElementById('header-login-button');
      if (loginBtn) {
        const rect = loginBtn.getBoundingClientRect();
        setLoginPos({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      }
      setIsFlyingToLogin(true);
      setTimeout(() => {
        setIsFlyingToLogin(false);
        onRequireLogin();
      }, 3000);
      return;
    }
    onStart();
  };

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center w-full min-h-[80vh] px-4 py-8">
      {/* Animated Flying Butterfly from Start to Log in Button */}
      {isFlyingToLogin && (
        <div 
          className="animate-fly-to-login-dynamic"
          style={{ 
            '--target-x': loginPos.x ? `${loginPos.x}px` : 'calc(100% - 90px)', 
            '--target-y': loginPos.y ? `${loginPos.y}px` : '24px' 
          } as React.CSSProperties}
        >
          <img
            src="/assets/hope_butterfly.png"
            alt="Flying Hope Butterfly"
            className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(96,165,250,0.9)] animate-flutter-fast"
          />
        </div>
      )}
      
      {/* Left Typography Block - "WHAT'S NEXT? HUGO AWARD 2026" */}
      <div
        className="absolute top-4 sm:top-12 md:top-1/2 left-0 right-0 md:right-auto md:left-6 lg:left-16 md:-translate-y-1/2 flex flex-col items-center md:items-start text-center md:text-left z-20 max-w-2xl mx-auto md:mx-0 px-4 md:px-0"
        data-purpose="hero-typography"
      >
        <h2 className="font-cinzel text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white tracking-tight drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] text-stroke-gold uppercase mb-2">
          WHAT'S<br className="hidden md:block" /> NEXT?
        </h2>
        <h3 className="font-sans-clean text-sm sm:text-lg md:text-xl font-extrabold uppercase tracking-[0.2em] text-amber-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          HUGO AWARD 2026
        </h3>
      </div>

      {/* Center Interactive Orb "Start" Button */}
      <div className="relative flex flex-col items-center justify-center z-20 mt-32 md:mt-0" data-purpose="interactive-orb">
        {/* Floating & Flapping Butterfly assets near Orb */}
        <div className="absolute -top-14 -left-12 z-30 animate-float-slow">
          <img
            src="/assets/butterfly.png"
            alt="Butterfly"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] animate-flutter"
          />
        </div>

        {/* Small Flapping Butterfly around Orb */}
        <div className="absolute top-2 -right-8 z-30 animate-float-slow delay-300">
          <img
            src="/assets/butterfly.png"
            alt="Butterfly"
            className="w-9 h-9 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.6)] animate-flutter"
          />
        </div>
        <div className="absolute -bottom-6 left-1 z-30 animate-float-slow delay-700">
          <ButterflyParticle type="white" size={28} />
        </div>

        {/* Glowing Pedestal Orb */}
        <button
          onClick={handleStart}
          className="group relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/40 shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-500 hover:scale-105 active:scale-95 animate-pulse-glow cursor-pointer"
        >
          {/* Outer Ring Accent */}
          <div className="absolute inset-2 rounded-full border border-amber-300/30 group-hover:border-amber-300/80 transition-colors duration-500" />
          
          {/* Inner Light Core */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-b from-white/20 via-amber-200/10 to-transparent blur-md group-hover:from-amber-200/30 transition-all duration-500" />

          {/* Start Label */}
          <span className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-semibold text-white group-hover:text-amber-300 transition-colors duration-300 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] tracking-wide">
            Start
          </span>
        </button>

        {/* Decorative Pedestal Stand */}
        <div className="flex flex-col items-center mt-4 opacity-80">
          <div className="w-12 h-9 sm:w-16 sm:h-12 bg-gradient-to-b from-white/30 to-white/5 rounded-t-lg border-t border-white/40 backdrop-blur-sm shadow-md" />
          <div className="w-24 sm:w-32 h-2.5 sm:h-3 bg-black/40 rounded-full blur-sm" />
        </div>
      </div>
    </div>
  );
};
