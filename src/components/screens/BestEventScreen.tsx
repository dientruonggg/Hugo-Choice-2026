import React from 'react';
import { BEST_EVENTS } from '../../data/mockData';
import { soundFx } from '../../utils/soundEffects';
import { ButterflyParticle } from '../ButterflyParticle';
import { Check } from 'lucide-react';

interface BestEventScreenProps {
  selectedEventId: string | null;
  onSelectEvent: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export const BestEventScreen: React.FC<BestEventScreenProps> = ({
  selectedEventId,
  onSelectEvent,
  onBack,
  onNext
}) => {
  const handleSelect = (id: string) => {
    soundFx.playSelect();
    onSelectEvent(id);
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between w-full h-full min-h-0 py-2 sm:py-3 px-3 sm:px-6">
      {/* Title Header */}
      <div className="text-center mb-2 sm:mb-3 shrink-0">
        <h2 className="font-cinzel text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-bold tracking-wider text-white text-stroke-gold drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] uppercase">
          BEST EVENT
        </h2>
        <h3 className="font-cinzel text-xs sm:text-xl font-semibold tracking-widest text-amber-200 mt-1 uppercase">
          VOTING SCREEN
        </h3>
      </div>

      {/* Main Interactive Wooden Signboards Multi-Column Grid */}
      <div className="relative flex-1 min-h-0 overflow-y-auto pr-1 w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 py-2 custom-scrollbar">
        {BEST_EVENTS.map((event) => {
          const isSelected = selectedEventId === event.id;

          return (
            <button
              key={event.id}
              onClick={() => handleSelect(event.id)}
              className={`w-full p-3.5 rounded-2xl wood-button transition-all duration-300 flex flex-col justify-between cursor-pointer relative text-left ${
                isSelected
                  ? 'ring-4 ring-amber-300 scale-102 shadow-[0_0_40px_rgba(251,191,36,0.6)]'
                  : 'hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2 overflow-hidden">
                {event.avatar ? (
                  <img
                    src={event.avatar}
                    alt={event.name}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border-2 border-amber-300 shadow-md shrink-0"
                  />
                ) : (
                  <span className="text-2xl sm:text-3xl drop-shadow">{event.icon}</span>
                )}
                <div className="text-left overflow-hidden pr-6">
                  <span className="font-cinzel font-extrabold text-xs sm:text-sm text-amber-100 uppercase tracking-wide block truncate">
                    {event.name}
                  </span>
                  {event.tag && (
                    <span className="font-sans-clean text-[0.65rem] font-bold text-amber-300 tracking-wider uppercase block">
                      {event.tag}
                    </span>
                  )}
                </div>
              </div>

              {event.description && (
                <p className="font-sans-clean text-xs text-amber-200/80 text-left line-clamp-2 mt-1">
                  {event.description}
                </p>
              )}

              {isSelected && (
                <div className="absolute top-2 right-2 w-6.5 h-6.5 rounded-full bg-amber-400 text-black flex items-center justify-center shrink-0 shadow-lg">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="w-full flex justify-between items-center pt-3 sm:pt-4 border-t border-white/10 shrink-0 mt-auto">
        <button
          onClick={() => {
            soundFx.playClick();
            onBack();
          }}
          className="px-8 py-2.5 rounded-full border border-white/50 bg-black/30 hover:bg-black/50 text-white font-serif-display text-base sm:text-lg transition-all shadow-lg"
        >
          Back
        </button>

        <button
          onClick={() => {
            if (!selectedEventId) {
              soundFx.playClick();
              alert('Please select an event option to vote');
              return;
            }
            soundFx.playSelect();
            onNext();
          }}
          className={`px-8 py-2.5 rounded-full border border-white/80 font-serif-display text-base sm:text-lg transition-all shadow-lg cursor-pointer ${
            selectedEventId
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
