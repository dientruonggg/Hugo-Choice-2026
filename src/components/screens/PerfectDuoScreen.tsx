import React from 'react';
import { PERFECT_DUOS } from '../../data/mockData';
import { soundFx } from '../../utils/soundEffects';
import { ButterflyParticle } from '../ButterflyParticle';
import { Check } from 'lucide-react';

interface PerfectDuoScreenProps {
  selectedDuoId: string | null;
  onSelectDuo: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export const PerfectDuoScreen: React.FC<PerfectDuoScreenProps> = ({
  selectedDuoId,
  onSelectDuo,
  onBack,
  onNext
}) => {
  const handleSelect = (id: string) => {
    soundFx.playSelect();
    onSelectDuo(id);
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between w-full py-2 px-3 sm:px-6">
      {/* Title Header */}
      <div className="relative flex flex-col items-center sm:items-start text-center sm:text-left mb-2 pl-0 sm:pl-4">
        <h2 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-wider text-white text-stroke-gold drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] uppercase">
          THE PERFECT DUO
        </h2>
        <h3 className="font-sans-clean text-xs sm:text-sm font-bold tracking-[0.2em] text-amber-200 uppercase mt-0.5">
          HUGO AWARD 2026
        </h3>
      </div>

      {/* Grid of 5 Floral Duo Glass Cards */}
      <div className="relative my-auto w-full max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 py-2">
        {PERFECT_DUOS.map((duo) => {
          const isSelected = selectedDuoId === duo.id;

          return (
            <div
              key={duo.id}
              onClick={() => handleSelect(duo.id)}
              className={`relative p-5 rounded-3xl backdrop-blur-md transition-all duration-300 flex flex-col items-center justify-between cursor-pointer border ${
                isSelected
                  ? 'bg-white/40 border-amber-300 ring-4 ring-amber-300/80 scale-105 shadow-[0_0_35px_rgba(251,191,36,0.5)]'
                  : 'bg-white/20 hover:bg-white/30 border-white/40 hover:scale-102 shadow-lg'
              }`}
            >
              {/* Pink Flower Accent Corners */}
              <div className="absolute top-1 left-2 text-pink-300 text-lg pointer-events-none">🌸</div>
              <div className="absolute top-1 right-2 text-pink-300 text-lg pointer-events-none">🌸</div>
              <div className="absolute bottom-1 left-2 text-pink-300 text-lg pointer-events-none">🌸</div>
              <div className="absolute bottom-1 right-2 text-pink-300 text-lg pointer-events-none">🌸</div>

              {/* Duo Avatar PNG Image */}
              {duo.avatar && (
                <div className="w-full flex justify-center mb-2">
                  <img
                    src={duo.avatar}
                    alt={duo.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-amber-300 shadow-md"
                  />
                </div>
              )}

              {/* Duo Names Row */}
              <div className="w-full text-center text-gray-900 font-serif-display font-bold text-lg sm:text-xl py-1">
                <p className="drop-shadow-sm text-gray-950">{duo.name}</p>
              </div>

              {/* Vote Button */}
              <button
                className={`mt-3 py-1.5 px-8 rounded-full font-serif-display text-base font-semibold transition-all shadow-md flex items-center space-x-2 ${
                  isSelected
                    ? 'bg-amber-400 text-black font-bold'
                    : 'bg-white/90 hover:bg-white text-gray-900'
                }`}
              >
                <span>{isSelected ? 'VOTED' : 'VOTE'}</span>
                {isSelected && <Check className="w-4 h-4 text-black stroke-[3]" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="w-full flex justify-between items-center pt-6 border-t border-white/10">
        <button
          onClick={() => {
            soundFx.playClick();
            onBack();
          }}
          className="px-8 py-2.5 rounded-full border border-white/50 bg-black/30 hover:bg-black/50 text-white font-serif-display text-lg sm:text-xl transition-all shadow-lg"
        >
          Back
        </button>

        <button
          onClick={() => {
            if (!selectedDuoId) {
              soundFx.playClick();
              alert('Please select a Duo pair to vote');
              return;
            }
            soundFx.playSelect();
            onNext();
          }}
          className={`px-8 py-2.5 rounded-full border border-white/80 font-serif-display text-lg sm:text-xl transition-all shadow-lg cursor-pointer ${
            selectedDuoId
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
