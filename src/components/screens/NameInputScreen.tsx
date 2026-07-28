import React, { useState } from 'react';
import { soundFx } from '../../utils/soundEffects';
import { ButterflyParticle } from '../ButterflyParticle';

interface NameInputScreenProps {
  initialName: string;
  onBack: () => void;
  onNext: (name: string) => void;
}

export const NameInputScreen: React.FC<NameInputScreenProps> = ({
  initialName,
  onBack,
  onNext
}) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name to continue');
      return;
    }
    soundFx.playSelect();
    onNext(name.trim());
  };

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center w-full min-h-[80vh] px-4 py-8">
      {/* Top Right "Back" button matching screenshot */}
      <div className="absolute top-2 right-2 sm:right-6 z-30">
        <button
          onClick={() => {
            soundFx.playClick();
            onBack();
          }}
          className="px-6 py-2 rounded-full glass-panel text-white font-serif-display text-base hover:bg-white/30 transition-all shadow-md"
        >
          Back
        </button>
      </div>

      {/* Main Form Center */}
      <div className="relative z-20 w-full max-w-xl flex flex-col items-center text-center my-auto">
        {/* Question Title */}
        <h2 className="font-serif-display text-4xl sm:text-6xl md:text-7xl font-medium text-white text-shadow-elegant drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] mb-8 tracking-tight">
          What is your name?
        </h2>

        {/* Input Box Container with Butterflies Perched on Corners */}
        <form onSubmit={handleSubmit} className="relative w-full mb-8">
          {/* Butterfly Perched Left */}
          <div className="absolute -top-6 -left-4 sm:-left-6 z-30 pointer-events-none">
            <ButterflyParticle type="white" size={48} />
          </div>

          {/* Butterfly Perched Right */}
          <div className="absolute -top-6 -right-4 sm:-right-6 z-30 pointer-events-none">
            <ButterflyParticle type="white" size={48} />
          </div>

          {/* Input Box */}
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            placeholder="Enter your name"
            className="w-full py-4 sm:py-5 px-6 sm:px-8 rounded-2xl bg-white/80 backdrop-blur-md border-2 border-amber-200/80 text-gray-900 placeholder-gray-500 font-serif-display text-xl sm:text-2xl text-center focus:outline-none focus:ring-4 focus:ring-amber-300/80 focus:bg-white transition-all shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
            autoFocus
          />

          {error && (
            <p className="mt-3 text-red-200 font-sans-clean font-semibold text-sm bg-red-950/70 py-1 px-4 rounded-full inline-block backdrop-blur-sm">
              {error}
            </p>
          )}
        </form>

        {/* Next Button */}
        <button
          onClick={() => handleSubmit()}
          className="px-10 py-3 sm:py-3.5 rounded-full bg-white/90 hover:bg-white text-gray-900 font-serif-display text-xl sm:text-2xl font-normal shadow-[0_4px_25px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 border border-amber-200 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};
