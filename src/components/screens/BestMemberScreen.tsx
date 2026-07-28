import React from 'react';
import { BEST_MEMBER_CANDIDATES } from '../../data/mockData';
import { soundFx } from '../../utils/soundEffects';
import { ButterflyParticle } from '../ButterflyParticle';
import { Check } from 'lucide-react';

interface BestMemberScreenProps {
  selectedCandidateId: string | null;
  onSelectCandidate: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export const BestMemberScreen: React.FC<BestMemberScreenProps> = ({
  selectedCandidateId,
  onSelectCandidate,
  onBack,
  onNext
}) => {
  const handleSelect = (id: string) => {
    soundFx.playSelect();
    onSelectCandidate(id);
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between w-full py-3 px-3 sm:px-6">
      {/* Title Header */}
      <div className="text-center mb-2">
        <h2 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-wider text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] uppercase">
          BEST MEMBER<br />VOTING SCREEN
        </h2>
      </div>

      {/* Main Content Layout: Left Instructions & Right Candidate Pills */}
      <div className="relative flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-auto max-w-6xl mx-auto w-full py-2">
        {/* Left Side Instructions */}
        <div className="md:col-span-6 flex flex-col items-start space-y-4 text-left p-4 sm:p-6 bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 shadow-lg">
          <p className="font-serif-display text-lg sm:text-2xl md:text-3xl font-normal text-white leading-relaxed drop-shadow-md">
            Vote for the Best Member. Select one candidate from the list on the right.
          </p>

          <p className="font-serif-display text-base sm:text-xl md:text-2xl font-normal text-amber-200 leading-snug drop-shadow-md">
            Your vote counts for the <strong className="font-bold">2026 Hugo Award</strong>.
          </p>

          {/* Floating Butterfly Bottom */}
          <div className="hidden sm:block animate-float-slow delay-500 pt-4">
            <ButterflyParticle type="monarch" size={44} />
          </div>
        </div>

        {/* Right Side Candidate Glass Pills */}
        <div className="md:col-span-6 flex flex-col space-y-3.5 w-full max-w-md mx-auto md:ml-auto">
          {BEST_MEMBER_CANDIDATES.map((candidate) => {
            const isSelected = selectedCandidateId === candidate.id;

            return (
              <button
                key={candidate.id}
                onClick={() => handleSelect(candidate.id)}
                className={`w-full py-2.5 px-4 sm:px-6 rounded-full font-serif-display text-lg sm:text-xl transition-all duration-300 flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'glass-pill-active scale-105 text-gray-900 font-bold shadow-[0_0_20px_rgba(251,191,36,0.6)]'
                    : 'glass-pill hover:bg-white/95 text-gray-900 hover:scale-102'
                }`}
              >
                <div className="flex items-center space-x-3.5 overflow-hidden">
                  {candidate.avatar && (
                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-amber-300 shadow-md shrink-0"
                    />
                  )}
                  <span className="text-left font-serif-display truncate">{candidate.name}</span>
                </div>
                {isSelected && (
                  <span className="w-7 h-7 rounded-full bg-amber-400 text-black flex items-center justify-center shrink-0 ml-2 shadow-sm">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
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
            if (!selectedCandidateId) {
              soundFx.playClick();
              alert('Please select a candidate to vote for');
              return;
            }
            soundFx.playSelect();
            onNext();
          }}
          className={`px-8 py-2.5 rounded-full border border-white/80 font-serif-display text-lg sm:text-xl transition-all shadow-lg cursor-pointer ${
            selectedCandidateId
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
