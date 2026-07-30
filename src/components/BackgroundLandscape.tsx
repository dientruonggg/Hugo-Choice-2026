import React from 'react';
import { ButterflyParticle } from './ButterflyParticle';

interface BackgroundLandscapeProps {
  children?: React.ReactNode;
  overlayOpacity?: string;
  themeVariant?: 'meadow' | 'sunset' | 'darkForest';
}

export const BackgroundLandscape: React.FC<BackgroundLandscapeProps> = ({
  children,
  overlayOpacity = 'bg-black/30',
  themeVariant = 'meadow'
}) => {
  const primaryBg = "/assets/bg.png";
  const effectBg = "/assets/effect.png";

  return (
    <div className="relative h-screen max-h-screen w-full overflow-hidden bg-[#101b13] flex flex-col selection:bg-amber-300 selection:text-black">
      {/* Fixed Background Image Layer */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-105 pointer-events-none z-0"
        style={{
          backgroundImage: `url('${primaryBg}')`
        }}
      />

      {/* Fixed Light Effect Overlay Layer (Brightened) */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat mix-blend-screen pointer-events-none z-1 opacity-90"
        style={{
          backgroundImage: `url('${effectBg}')`
        }}
      />

      {/* Fixed Lighting Gradient Overlay (Lightened per feedback) */}
      <div className={`fixed inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/25 pointer-events-none z-0`} />

      {/* Floating Fairy Dust & Butterflies Effect (Fixed) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-1">
        <div className="absolute top-[20%] left-[15%] w-2 h-2 rounded-full bg-amber-200 blur-[1px] animate-ping duration-1000 opacity-60" />
        <div className="absolute top-[40%] left-[80%] w-3 h-3 rounded-full bg-white blur-[2px] animate-pulse opacity-80" />
        <div className="absolute top-[65%] left-[30%] w-2.5 h-2.5 rounded-full bg-amber-300 blur-[1px] animate-bounce opacity-70" />
        <div className="absolute top-[10%] left-[60%] w-2 h-2 rounded-full bg-emerald-200 blur-[1px] animate-pulse opacity-50" />
        
        {/* Floating Ambient PNG Butterflies on top of bg effect */}
        <div className="absolute top-[15%] left-[8%] animate-float-slow opacity-90 scale-90 z-2">
          <ButterflyParticle type="png" size={90} />
        </div>
        <div className="absolute top-[60%] right-[8%] animate-float-slow opacity-95 scale-100 z-2">
          <ButterflyParticle type="png" size={110} />
        </div>
        <div className="absolute top-[35%] right-[22%] animate-float-slow opacity-85 scale-75 z-2">
          <ButterflyParticle type="png" size={75} />
        </div>
        <div className="absolute top-[75%] left-[20%] animate-float-slow opacity-80 scale-80 z-2">
          <ButterflyParticle type="png" size={85} />
        </div>
      </div>

      {/* Main Content Container (Flex constrained to viewport) */}
      <div className="relative z-10 flex-1 flex flex-col w-full h-full min-h-0 overflow-hidden">
        <div className="flex-1 flex flex-col justify-between w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3 h-full min-h-0 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};
