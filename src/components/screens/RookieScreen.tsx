import React, { useState } from 'react';
import { ALL_MEMBERS, filterMembers, ClubMember } from '../../data/membersData';
import { HugoTeam } from '../../types';
import { soundFx } from '../../utils/soundEffects';
import { ButterflyParticle } from '../ButterflyParticle';
import { Check, Search, UserCheck, Sparkles, Award } from 'lucide-react';

interface RookieScreenProps {
  selectedRookieId: string | null;
  onSelectRookie: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const TEAM_BADGES: Record<HugoTeam, { name: string; shortName: string; bg: string; text: string; image: string }> = {
  prs: { name: 'Power Rangers', shortName: 'P.Rangers', bg: 'bg-red-500/35 border-red-300/80', text: 'text-red-300 font-bold', image: '/team_logo/POWER RANGERS.png' },
  hc: { name: 'Heroes Company', shortName: 'Heroes Co.', bg: 'bg-blue-500/35 border-blue-300/80', text: 'text-blue-300 font-bold', image: '/team_logo/Heroes.png' },
  bnn: { name: 'Banana', shortName: 'Banana', bg: 'bg-yellow-500/35 border-yellow-300/80', text: 'text-yellow-300 font-bold', image: '/team_logo/BANANA.png' },
  niff: { name: 'Nifflers', shortName: 'Nifflers', bg: 'bg-purple-500/35 border-purple-300/80', text: 'text-purple-300 font-bold', image: '/team_logo/NIFFLER.png' }
};

export const RookieScreen: React.FC<RookieScreenProps> = ({
  selectedRookieId,
  onSelectRookie,
  onBack,
  onNext
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<HugoTeam | 'all'>('all');

  const filteredList = filterMembers(searchQuery, selectedTeamFilter);

  const selectedMemberObj = ALL_MEMBERS.find(
    m => m.id === selectedRookieId || m.name === selectedRookieId
  );

  const handleSelectMember = (member: ClubMember) => {
    soundFx.playSelect();
    onSelectRookie(member.id);
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between w-full h-full min-h-0 py-2 sm:py-3 px-3 sm:px-6 overflow-hidden">
      {/* Title Header */}
      <div className="text-center mb-2 sm:mb-3 shrink-0">
        <h2 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold tracking-wider text-white text-stroke-gold drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] uppercase">
          THE ROOKIE
        </h2>
        <h3 className="font-sans-clean text-xs sm:text-lg font-bold tracking-[0.2em] text-amber-200 uppercase mt-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
          HUGO AWARD 2026
        </h3>
      </div>

      {/* Main Content Layout */}
        <div className="relative flex-1 flex flex-col min-h-0 max-w-5xl mx-auto w-full py-1 overflow-hidden">
        {/* Search & Team Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 mb-3 bg-black/60 p-2.5 sm:p-3 rounded-2xl backdrop-blur-md border border-amber-300/50 shadow-2xl w-full min-w-0 max-w-full shrink-0">
          {/* Search Box */}
          <div className="relative w-full sm:w-56 md:w-64 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search newbie/member by name..."
              className="w-full py-2 sm:py-2.5 pl-9 pr-3 rounded-full bg-white/95 text-gray-900 placeholder-gray-500 font-serif-display text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Team Filter Pills (Order: All -> Power Rangers -> Heroes Company -> Banana -> Nifflers) */}
          <div className="flex flex-row items-center justify-start sm:justify-end gap-1.5 w-full min-w-0 max-w-full overflow-x-auto custom-scrollbar pb-1.5 pt-0.5 px-1">
            <button
              type="button"
              onClick={() => {
                setSelectedTeamFilter('all');
                soundFx.playClick();
              }}
              className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[0.7rem] xs:text-xs sm:text-sm font-serif-display transition-all cursor-pointer ${
                selectedTeamFilter === 'all'
                  ? 'bg-amber-400 text-gray-950 font-black shadow-[0_0_15px_rgba(251,191,36,0.9)] scale-105'
                  : 'bg-black/75 hover:bg-black/90 border border-white/30 text-white font-bold'
              }`}
            >
              All ({ALL_MEMBERS.length})
            </button>
            {(['prs', 'hc', 'bnn', 'niff'] as HugoTeam[]).map(teamKey => {
              const badge = TEAM_BADGES[teamKey];
              const isSelected = selectedTeamFilter === teamKey;
              return (
                <button
                  key={teamKey}
                  type="button"
                  onClick={() => {
                    setSelectedTeamFilter(teamKey);
                    soundFx.playClick();
                  }}
                  className={`px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-full text-[0.7rem] xs:text-xs sm:text-sm font-serif-display transition-all flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-gray-950 font-black shadow-[0_0_15px_rgba(251,191,36,0.9)] scale-105'
                      : 'bg-black/75 hover:bg-black/90 border border-white/30 text-white font-bold'
                  }`}
                >
                  <img src={badge.image} alt={badge.name} className="w-4.5 h-4.5 xs:w-5 xs:h-5 sm:w-6 sm:h-6 object-contain rounded-full border border-white/50 shrink-0 drop-shadow-md" />
                  <span className="hidden sm:inline">{badge.name}</span>
                  <span className="inline sm:hidden">{badge.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Currently Selected Rookie Banner */}
        {selectedMemberObj && (
          <div className="mb-3 p-3.5 rounded-2xl bg-amber-400/30 border-2 border-amber-300/70 backdrop-blur-md flex items-center justify-between text-white animate-fade-in shadow-xl shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold shadow-lg">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-amber-200 uppercase font-bold tracking-wider">Your Nominated Rookie</div>
                <div className="font-serif-display text-lg sm:text-xl font-bold text-amber-100">{selectedMemberObj.name}</div>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm sm:text-base font-serif-display border flex items-center gap-2 ${TEAM_BADGES[selectedMemberObj.teamId].bg} ${TEAM_BADGES[selectedMemberObj.teamId].text}`}>
              <img src={TEAM_BADGES[selectedMemberObj.teamId].image} alt={TEAM_BADGES[selectedMemberObj.teamId].name} className="w-5.5 h-5.5 object-contain rounded-full shrink-0" />
              <span>{TEAM_BADGES[selectedMemberObj.teamId].name}</span>
            </span>
          </div>
        )}

        {/* Scrollable Grid of Members */}
        <div className="relative flex-1 min-h-0 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 custom-scrollbar">
          {filteredList.length > 0 ? (
            filteredList.map((member) => {
              const isSelected = selectedRookieId === member.id || selectedRookieId === member.name;
              const badge = TEAM_BADGES[member.teamId];

              return (
                <button
                  key={member.id}
                  onClick={() => handleSelectMember(member)}
                  className={`p-3.5 rounded-2xl font-serif-display transition-all duration-200 flex items-center justify-between cursor-pointer border text-left ${
                    isSelected
                      ? 'bg-amber-400 border-amber-300 text-gray-950 font-black shadow-[0_0_24px_rgba(251,191,36,0.85)] scale-[1.02]'
                      : 'bg-black/55 hover:bg-amber-950/60 border-amber-300/40 text-white hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <UserCheck className={`w-5.5 h-5.5 shrink-0 ${isSelected ? 'text-gray-950' : 'text-amber-300'}`} />
                    <div className="truncate">
                      <div className="text-base font-bold truncate">{member.name}</div>
                      <div className={`text-xs sm:text-sm inline-flex items-center gap-1.5 opacity-95 ${isSelected ? 'text-gray-950 font-bold' : badge.text}`}>
                        <img src={badge.image} alt={badge.name} className="w-4.5 h-4.5 object-contain rounded-full shrink-0" />
                        <span>{badge.name}</span>
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-6.5 h-6.5 rounded-full bg-gray-950 text-amber-300 flex items-center justify-center shrink-0 ml-1 shadow">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="col-span-full py-10 text-center text-amber-200/90 font-serif-display text-base drop-shadow">
              No members found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Fixed Navigation Buttons - Pulled up on portrait screen orientation */}
      <div className="w-full max-w-6xl flex justify-between items-center pt-2 sm:pt-3 border-t border-white/15 shrink-0 px-4 sm:px-8">
        <button
          onClick={() => {
            soundFx.playClick();
            onBack();
          }}
          className="px-6 py-2 sm:px-9 sm:py-2.5 min-w-[95px] sm:min-w-[130px] rounded-full border-2 border-white/90 bg-black/60 hover:bg-black/80 text-white font-serif-display text-base sm:text-xl transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)] cursor-pointer"
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
          className={`px-6 py-2 sm:px-9 sm:py-2.5 min-w-[95px] sm:min-w-[130px] rounded-full border-2 border-white/90 font-serif-display text-base sm:text-xl transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)] cursor-pointer ${
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
