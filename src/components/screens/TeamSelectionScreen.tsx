import React from 'react';
import { NatureTeam } from '../../types';
import { TEAMS } from '../../data/mockData';
import { soundFx } from '../../utils/soundEffects';
import { ButterflyParticle } from '../ButterflyParticle';
import { motion, AnimatePresence } from 'motion/react';

interface TeamSelectionScreenProps {
  selectedTeam: NatureTeam | null;
  onSelectTeam: (team: NatureTeam) => void;
  onBack: () => void;
  onNext: () => void;
}

export const TeamSelectionScreen: React.FC<TeamSelectionScreenProps> = ({
  selectedTeam,
  onSelectTeam,
  onBack,
  onNext
}) => {
  const handleSelect = (teamId: NatureTeam) => {
    soundFx.playSelect();
    onSelectTeam(teamId);
  };

  const currentTeamObj = TEAMS.find(t => t.id === selectedTeam);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex-1 flex flex-col items-center justify-between w-full min-h-[80vh] px-4 py-6"
    >
      {/* Title */}
      <motion.div layout className="text-center my-auto">
        <h2 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-bold tracking-wider text-white text-stroke-gold drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] uppercase">
          NATURE TEAM<br />SELECTION
        </h2>
      </motion.div>

      {/* 4 Team Orbs Selection Row */}
      <motion.div layout className="relative my-auto w-full max-w-4xl flex flex-wrap items-center justify-center gap-6 sm:gap-10">
        {TEAMS.map((team) => {
          const isSelected = selectedTeam === team.id;
          const imgSrc = isSelected ? (team.activeImage || team.image) : team.image;

          return (
            <motion.div layout key={team.id} className="relative flex flex-col items-center">
              {/* Floating Butterfly resting on selected team */}
              {isSelected && (
                <div className="absolute -top-10 -right-4 z-30 animate-float-slow pointer-events-none">
                  <ButterflyParticle type="hope" size={54} />
                </div>
              )}

              {/* Glowing Orb Button with Team PNG Image */}
              <button
                onClick={() => handleSelect(team.id)}
                className={`group relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-3xl flex items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden p-3 ${
                  isSelected
                    ? 'bg-white/40 border-2 border-amber-300 shadow-[0_0_40px_rgba(255,255,255,0.8)] scale-110'
                    : 'bg-black/30 hover:bg-white/20 border border-white/30 hover:scale-105'
                }`}
                style={{
                  boxShadow: isSelected ? `0 0 50px ${team.glow}` : undefined
                }}
              >
                {/* Team PNG Image */}
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={team.name}
                    className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] transform group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <span className="text-4xl sm:text-5xl md:text-6xl drop-shadow">
                    {team.icon}
                  </span>
                )}

                {/* Inner Glow Border */}
                <div className={`absolute inset-2 rounded-2xl border pointer-events-none ${isSelected ? 'border-amber-300/80' : 'border-white/20'}`} />
              </button>

              {/* Team Name Label */}
              <span className={`mt-3 font-serif-display font-semibold text-base sm:text-lg transition-colors ${
                isSelected ? 'text-amber-200 font-bold drop-shadow' : 'text-white/80'
              }`}>
                {team.name}
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Team Description Callout */}
      <AnimatePresence mode="wait">
        {currentTeamObj && (
          <motion.div 
            key={currentTeamObj.id}
            layout
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
            className="text-center my-2 p-3 sm:p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-amber-300/30 max-w-md"
          >
            <p className="font-serif-display text-sm sm:text-base text-amber-100 italic">
              "{currentTeamObj.description}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Back & Next Buttons */}
      <motion.div layout className="w-full flex justify-between items-center pt-4 border-t border-white/10">
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
            if (!selectedTeam) {
              soundFx.playClick();
              alert('Please select a Nature Team to proceed');
              return;
            }
            soundFx.playSelect();
            onNext();
          }}
          className={`px-8 py-2.5 rounded-full border border-white/80 font-serif-display text-lg sm:text-xl transition-all shadow-lg cursor-pointer ${
            selectedTeam
              ? 'bg-white/90 hover:bg-white text-gray-900 font-medium hover:scale-105'
              : 'bg-white/40 text-gray-800 opacity-60'
          }`}
        >
          Next
        </button>
      </motion.div>
    </motion.div>
  );
};
