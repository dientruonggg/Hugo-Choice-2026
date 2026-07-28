import React from 'react';
import { ROOKIE_CANDIDATES } from '../../data/mockData';
import { soundFx } from '../../utils/soundEffects';
import { ButterflyParticle } from '../ButterflyParticle';
import { Check } from 'lucide-react';

interface RookieScreenProps {
  selectedRookieId: string | null;
  onSelectRookie: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export const RookieScreen: React.FC<RookieScreenProps> = ({
  selectedRookieId,
  onSelectRookie,
  onBack,
  onNext
}) => {
  const handleSelect = (id: string) => {
    soundFx.playSelect();
    onSelectRookie(id);
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between w-full min-h-[80vh] px-4 py-6">
      {/* Title Header matching Image 5 */}
      <div className="text-center mb-6">
        <h2 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-bold tracking-wider text-white text-stroke-gold drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] uppercase">
          THE ROOKIE
        </h2>
        <h3 className="font-sans-clean text-base sm:text-2xl font-bold tracking-[0.2em] text-amber-200 uppercase mt-1">
          HUGO AWARD 2026
        </h3>
      </div>

      {/* Main Candidate Pills Stack matching Image 5 */}
      <div className="relative my-auto w-full max-w-md mx-auto flex flex-col space-y-3.5 py-2">
        {/* Monarch Butterfly resting on Candidate 5 bottom right edge */}
        <div className="absolute -bottom-4 right-2 sm:-right-8 z-30 animate-float-slow pointer-events-none">
          <ButterflyParticle type="monarch" size={68} />
        </div>

        {ROOKIE_CANDIDATES.map((candidate) => {
          const isSelected = selectedRookieId === candidate.id;

          return (
            <button
              key={candidate.id}
              onClick={() => handleSelect(candidate.id)}
              className={`w-full py-2.5 px-4 sm:px-6 rounded-full font-sans-clean font-semibold text-base sm:text-lg uppercase tracking-wider transition-all duration-300 flex items-center justify-between cursor-pointer ${
                isSelected
                  ? 'glass-pill-active scale-105 text-emerald-950 font-bold border-2 border-amber-300 shadow-[0_0_25px_rgba(74,222,128,0.6)]'
                  : 'glass-pill-green hover:brightness-105 hover:scale-102 text-white'
              }`}
            >
              <div className="flex items-center space-x-3.5 overflow-hidden">
                {candidate.avatar && (
                  <img
                    src={candidate.avatar}
                    alt={candidate.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-300 shadow-md shrink-0"
                  />
                )}
                <span className="text-left font-sans-clean truncate">{candidate.name}</span>
              </div>
              {isSelected && (
                <span className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center shrink-0 ml-2 shadow-sm">
                  <Check className="w-4 h-4 stroke-[3]" />
                </span>
              )}
            </button>
          );
        })}


      </div>

      {/* Navigation Controls */}
      <div className="w-full flex justify-between items-center pt-4 border-t border-white/10">
        <button
          onClick={() => {
            soundFx.playClick();
            onBack();
          }}
          className="px-8 py-2 rounded-full border border-white/50 bg-black/30 hover:bg-black/50 text-white font-serif-display text-base sm:text-lg transition-all shadow-lg"
        >
          Back
        </button>

        <button
          onClick={() => {
            if (!selectedRookieId) {
              soundFx.playClick();
              alert('Please select a candidate for The Rookie Award');
              return;
            }
            soundFx.playSelect();
            onNext();
          }}
          className={`px-8 py-2 rounded-full border border-white/80 font-serif-display text-base sm:text-lg transition-all shadow-lg cursor-pointer ${
            selectedRookieId
              ? 'bg-white/90 hover:bg-white text-gray-900 font-medium hover:scale-105'
              : 'bg-white/40 text-gray-800 opacity-60'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};
