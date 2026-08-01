import React from 'react';
import { HugoTeam } from '../../types';
import { TEAMS } from '../../data/mockData';
import { soundFx } from '../../utils/soundEffects';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface TeamSelectionScreenProps {
  selectedTeam: HugoTeam | null;
  userName?: string;
  onSelectTeam: (team: HugoTeam) => void;
  onBack: () => void;
  onNext: () => void;
}

export const TeamSelectionScreen: React.FC<TeamSelectionScreenProps> = ({
  selectedTeam,
  onSelectTeam,
  onBack,
  onNext
}) => {
  const handleSelect = (teamId: HugoTeam) => {
    soundFx.playSelect();
    onSelectTeam(teamId);
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between items-center w-full h-full min-h-[75vh] py-6 sm:py-8 px-4 sm:px-6 select-none">
      {/* Title Header */}
      <div className="text-center mb-6 shrink-0">
        <h2 className="font-serif-display text-4.5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] uppercase">
          WHICH TEAM ARE YOU IN?
        </h2>
        <p className="font-serif-display text-xs sm:text-base text-amber-200 mt-2 font-medium tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          Please select your official team to proceed
        </p>
      </div>

      {/* Main Grid Content Section */}
      <div className="relative max-w-4xl mx-auto w-full my-auto flex-1 flex flex-col justify-center py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full">
          {TEAMS.map((team) => {
            const isSelected = selectedTeam === team.id;
            const logoSrc = team.heroLogo || team.activeImage || team.image;

            return (
              <motion.div
                key={team.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelect(team.id)}
                animate={{ 
                  y: isSelected ? -12 : 0,
                  scale: isSelected ? 1.02 : 1
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border flex flex-col items-center text-center justify-between min-h-[12rem] md:min-h-[16rem] h-auto shadow-2xl ${
                  isSelected
                    ? 'bg-gradient-to-b from-white/10 to-white/5 border-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.25)]'
                    : 'bg-white/5 hover:bg-white/10 border-white/10'
                }`}
                style={{
                  boxShadow: isSelected ? `0 0 25px ${team.glow}33, inset 0 0 15px rgba(255,255,255,0.05)` : undefined,
                  borderColor: isSelected ? team.color : undefined
                }}
              >
                {/* Subtle Glow Ring */}
                {isSelected && (
                  <div 
                    className="absolute inset-0 rounded-2xl border pointer-events-none animate-pulse"
                    style={{ borderColor: team.color, opacity: 0.4 }}
                  />
                )}

                {/* Team Icon/Logo */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center my-auto transition-transform duration-300">
                  {logoSrc ? (
                    <img 
                      src={logoSrc} 
                      alt={team.name} 
                      className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" 
                    />
                  ) : (
                    <span className="text-4xl">{team.icon}</span>
                  )}
                </div>

                {/* Team Name & Slogan */}
                <div className="mt-3 shrink-0 w-full">
                  <h3 className={`font-serif-display font-bold text-sm sm:text-base md:text-lg tracking-wide ${
                    isSelected ? 'text-amber-200' : 'text-slate-300'
                  }`}>
                    {team.name}
                  </h3>
                  
                  {isSelected && (
                    <div className="mt-1 flex items-center justify-center gap-1 text-[0.65rem] font-bold text-amber-300 uppercase tracking-widest animate-fade-in">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>Selected</span>
                    </div>
                  )}

                  <AnimatePresence>
                    {isSelected && (
                      <motion.p
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="text-[0.7rem] sm:text-xs italic font-semibold leading-relaxed px-1 overflow-hidden"
                        style={{ color: team.color }}
                      >
                        "{team.description}"
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
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
          onClick={() => {
            if (!selectedTeam) {
              soundFx.playClick();
              alert('Please select a team to proceed!');
              return;
            }
            soundFx.playSelect();
            onNext();
          }}
          className={`px-8 py-3 rounded-full font-sans-clean font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 active:scale-95 cursor-pointer ${
            selectedTeam
              ? 'bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 hover:from-amber-200 hover:to-amber-300 text-slate-950 hover:scale-105 shadow-[0_0_25px_rgba(251,191,36,0.4)]'
              : 'bg-white/20 text-slate-400 opacity-60 pointer-events-none'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};
