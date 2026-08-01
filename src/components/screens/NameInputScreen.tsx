import React, { useState } from 'react';
import { soundFx } from '../../utils/soundEffects';
import { HugoTeam } from '../../types';
import { Sparkles, User } from 'lucide-react';

interface NameInputScreenProps {
  initialName: string;
  onBack: () => void;
  onNext: (name: string, teamId?: HugoTeam) => void;
}

export const NameInputScreen: React.FC<NameInputScreenProps> = ({
  initialName,
  onBack,
  onNext
}) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  const handleProceed = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      soundFx.playClick();
      setError('Please enter your full name to continue');
      return;
    }

    soundFx.playSelect();
    onNext(trimmed);
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between items-center w-full h-full min-h-[75vh] py-6 sm:py-8 px-4 sm:px-6 select-none">
      {/* Title Header */}
      <div className="text-center mb-6 shrink-0">
        <h2 className="font-serif-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] uppercase">
          WHO ARE YOU?
        </h2>
        <p className="font-serif-display text-xs sm:text-base text-amber-200 mt-2 font-medium tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          Please enter your full name to start voting
        </p>
      </div>

      {/* Main Plain Input Section */}
      <div className="relative max-w-md mx-auto w-full my-auto flex-1 flex flex-col justify-center">
        <div className="relative w-full space-y-3">

          {/* Input Label */}
          <label className="block font-serif-display text-sm sm:text-base text-amber-200 font-bold flex items-center gap-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
            <span>Your Full Name:</span>
          </label>

          {/* Plain Text Input */}
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleProceed();
              }}
              placeholder="Enter your name..."
              className="w-full py-4 pl-11 pr-4 rounded-2xl bg-white/15 backdrop-blur-xl text-white placeholder-slate-300 font-serif-display text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-amber-300/80 shadow-2xl border border-white/30"
              autoFocus
            />
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-200/80 pointer-events-none" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-300 text-sm font-bold text-center animate-shake pt-1">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Single Pair Bottom Navigation Buttons */}
      <div className="w-full max-w-xl mx-auto flex justify-between items-center pt-4 border-t border-white/15 shrink-0 mt-6">
        <button
          onClick={() => {
            soundFx.playClick();
            onBack();
          }}
          className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 text-white font-sans-clean font-semibold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.25)] hover:scale-105 active:scale-95 cursor-pointer"
        >
          Back
        </button>

        <button
          onClick={handleProceed}
          className={`px-8 py-3 rounded-full font-sans-clean font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_0_25px_rgba(251,191,36,0.4)] active:scale-95 cursor-pointer ${name.trim()
              ? 'bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 hover:from-amber-200 hover:to-amber-300 text-slate-950 hover:scale-105'
              : 'bg-white/20 text-slate-400 opacity-60 pointer-events-none'
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};
