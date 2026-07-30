import React, { useState, useEffect } from 'react';
import { ALL_MEMBERS, filterMembers, ClubMember } from '../../data/membersData';
import { HugoTeam } from '../../types';
import { soundFx } from '../../utils/soundEffects';
import { Check, Search, UserCheck, Heart, Sparkles, Users } from 'lucide-react';

interface PerfectDuoScreenProps {
  selectedDuoId: string | null;
  onSelectDuo: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const TEAM_BADGES: Record<HugoTeam, { name: string; bg: string; text: string; image: string }> = {
  prs: { name: 'Power Rangers', bg: 'bg-red-500/35 border-red-300/80', text: 'text-red-300 font-bold', image: '/team_logo/POWER RANGERS.png' },
  hc: { name: 'Heroes Company', bg: 'bg-blue-500/35 border-blue-300/80', text: 'text-blue-300 font-bold', image: '/team_logo/Heroes.png' },
  bnn: { name: 'Banana', bg: 'bg-yellow-500/35 border-yellow-300/80', text: 'text-yellow-300 font-bold', image: '/team_logo/BANANA.png' },
  niff: { name: 'Nifflers', bg: 'bg-purple-500/35 border-purple-300/80', text: 'text-purple-300 font-bold', image: '/team_logo/NIFFLER.png' }
};

export const PerfectDuoScreen: React.FC<PerfectDuoScreenProps> = ({
  selectedDuoId,
  onSelectDuo,
  onBack,
  onNext
}) => {
  // Parse existing duo selection if available
  const initialParts = selectedDuoId ? selectedDuoId.split(/\s*[-&]\s*/) : [];
  const [personA, setPersonA] = useState<string>(initialParts[0] || '');
  const [personB, setPersonB] = useState<string>(initialParts[1] || '');

  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [teamFilterA, setTeamFilterA] = useState<HugoTeam | 'all'>('all');
  const [teamFilterB, setTeamFilterB] = useState<HugoTeam | 'all'>('all');

  const listA = filterMembers(searchA, teamFilterA);
  const listB = filterMembers(searchB, teamFilterB);

  // Sync to parent on change
  useEffect(() => {
    if (personA && personB) {
      onSelectDuo(`${personA} & ${personB}`);
    } else if (personA) {
      onSelectDuo(personA);
    } else if (personB) {
      onSelectDuo(personB);
    }
  }, [personA, personB]);

  const handleSelectPersonA = (member: ClubMember) => {
    soundFx.playSelect();
    setPersonA(member.id);
  };

  const handleSelectPersonB = (member: ClubMember) => {
    soundFx.playSelect();
    setPersonB(member.id);
  };

  const memberAObj = ALL_MEMBERS.find(m => m.id === personA || m.name === personA);
  const memberBObj = ALL_MEMBERS.find(m => m.id === personB || m.name === personB);

  return (
    <div className="relative flex-1 flex flex-col justify-between w-full h-full min-h-0 py-2 sm:py-3 px-3 sm:px-6">
      {/* Title Header */}
      <div className="text-center mb-2 shrink-0">
        <h2 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-wider text-white text-stroke-gold drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] uppercase">
          THE PERFECT DUO
        </h2>
        <p className="font-serif-display text-xs sm:text-base text-pink-200 mt-1">
          Select Member #1 and Member #2 to create your Perfect Duo pair
        </p>
      </div>

      {/* Duo Combination Preview Card */}
      <div className="max-w-3xl mx-auto w-full mb-3 p-3 rounded-2xl bg-pink-950/40 border border-pink-400/50 backdrop-blur-md flex items-center justify-between shadow-xl text-white shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-4 w-full justify-center text-center">
          {/* Member 1 Box */}
          <div className="px-4 py-1.5 rounded-xl bg-white/10 border border-white/20 min-w-[140px] sm:min-w-[180px]">
            <div className="text-[0.65rem] text-pink-300 uppercase font-bold tracking-wider">Partner #1</div>
            <div className="font-serif-display text-sm sm:text-lg font-bold text-amber-200 truncate">
              {memberAObj?.name || personA || 'Select Member 1'}
            </div>
          </div>

          {/* Heart Icon */}
          <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold shrink-0 shadow-lg animate-pulse">
            <Heart className="w-5 h-5 fill-current" />
          </div>

          {/* Member 2 Box */}
          <div className="px-4 py-1.5 rounded-xl bg-white/10 border border-white/20 min-w-[140px] sm:min-w-[180px]">
            <div className="text-[0.65rem] text-pink-300 uppercase font-bold tracking-wider">Partner #2</div>
            <div className="font-serif-display text-sm sm:text-lg font-bold text-amber-200 truncate">
              {memberBObj?.name || personB || 'Select Member 2'}
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Selection Grid */}
      <div className="relative flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto w-full py-1">
        {/* COLUMN 1: Partner #1 */}
        <div className="flex flex-col bg-black/40 p-3 sm:p-4 rounded-3xl backdrop-blur-md border border-white/20 min-h-0 overflow-hidden">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <h3 className="font-serif-display text-base font-bold text-amber-300 flex items-center gap-1.5">
              <Users className="w-4 h-4" /> 1. Select Member #1
            </h3>
            {personA && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-bold">
                Selected
              </span>
            )}
          </div>

          {/* Search Box A */}
          <div className="relative mb-2 shrink-0">
            <input
              type="text"
              value={searchA}
              onChange={(e) => setSearchA(e.target.value)}
              placeholder="Search Partner #1..."
              className="w-full py-1.5 pl-8 pr-3 rounded-full bg-white/90 text-gray-900 placeholder-gray-500 font-serif-display text-xs focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
          </div>

          {/* Team Filters A with Team Logos (prs -> hc -> bnn -> niff) */}
          <div className="flex flex-wrap gap-1 mb-2 shrink-0">
            <button
              onClick={() => setTeamFilterA('all')}
              className={`px-2 py-0.5 rounded-full text-[0.7rem] font-serif-display transition-all ${
                teamFilterA === 'all' ? 'bg-amber-400 text-black font-bold' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              All
            </button>
            {(['prs', 'hc', 'bnn', 'niff'] as HugoTeam[]).map(t => (
              <button
                key={t}
                onClick={() => setTeamFilterA(t)}
                className={`px-2 py-0.5 rounded-full text-[0.7rem] font-serif-display transition-all flex items-center gap-1 ${
                  teamFilterA === t ? 'bg-amber-400 text-black font-bold' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <img src={TEAM_BADGES[t].image} alt={TEAM_BADGES[t].name} className="w-3.5 h-3.5 object-contain rounded-full shrink-0" />
                <span>{TEAM_BADGES[t].name}</span>
              </button>
            ))}
          </div>

          {/* Scrollable Members List A */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
            {listA.map(member => {
              const isSelected = personA === member.id || personA === member.name;
              const badge = TEAM_BADGES[member.teamId];
              return (
                <button
                  key={member.id}
                  onClick={() => handleSelectPersonA(member)}
                  className={`w-full p-2 rounded-xl text-left font-serif-display text-xs transition-all flex items-center justify-between cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-400 text-gray-950 font-bold border-amber-300 shadow-md scale-[1.01]'
                      : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
                  }`}
                >
                  <span className="truncate">{member.name}</span>
                  <span className={`text-[0.65rem] shrink-0 ml-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border ${badge.bg} ${badge.text}`}>
                    <img src={badge.image} alt={badge.name} className="w-3 h-3 object-contain rounded-full shrink-0" />
                    <span>{badge.name}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* COLUMN 2: Partner #2 */}
        <div className="flex flex-col bg-black/40 p-3 sm:p-4 rounded-3xl backdrop-blur-md border border-white/20 min-h-0 overflow-hidden">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <h3 className="font-serif-display text-base font-bold text-pink-300 flex items-center gap-1.5">
              <Users className="w-4 h-4" /> 2. Select Member #2
            </h3>
            {personB && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-400 text-black font-bold">
                Selected
              </span>
            )}
          </div>

          {/* Search Box B */}
          <div className="relative mb-2 shrink-0">
            <input
              type="text"
              value={searchB}
              onChange={(e) => setSearchB(e.target.value)}
              placeholder="Search Partner #2..."
              className="w-full py-1.5 pl-8 pr-3 rounded-full bg-white/90 text-gray-900 placeholder-gray-500 font-serif-display text-xs focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
          </div>

          {/* Team Filters B with Team Logos (prs -> hc -> bnn -> niff) */}
          <div className="flex flex-wrap gap-1 mb-2 shrink-0">
            <button
              onClick={() => setTeamFilterB('all')}
              className={`px-2 py-0.5 rounded-full text-[0.7rem] font-serif-display transition-all ${
                teamFilterB === 'all' ? 'bg-pink-400 text-black font-bold' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              All
            </button>
            {(['prs', 'hc', 'bnn', 'niff'] as HugoTeam[]).map(t => (
              <button
                key={t}
                onClick={() => setTeamFilterB(t)}
                className={`px-2 py-0.5 rounded-full text-[0.7rem] font-serif-display transition-all flex items-center gap-1 ${
                  teamFilterB === t ? 'bg-pink-400 text-black font-bold' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <img src={TEAM_BADGES[t].image} alt={TEAM_BADGES[t].name} className="w-3.5 h-3.5 object-contain rounded-full shrink-0" />
                <span>{TEAM_BADGES[t].name}</span>
              </button>
            ))}
          </div>

          {/* Scrollable Members List B */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
            {listB.map(member => {
              const isSelected = personB === member.id || personB === member.name;
              const badge = TEAM_BADGES[member.teamId];
              return (
                <button
                  key={member.id}
                  onClick={() => handleSelectPersonB(member)}
                  className={`w-full p-2 rounded-xl text-left font-serif-display text-xs transition-all flex items-center justify-between cursor-pointer border ${
                    isSelected
                      ? 'bg-pink-400 text-gray-950 font-bold border-pink-300 shadow-md scale-[1.01]'
                      : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
                  }`}
                >
                  <span className="truncate">{member.name}</span>
                  <span className={`text-[0.65rem] shrink-0 ml-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border ${badge.bg} ${badge.text}`}>
                    <img src={badge.image} alt={badge.name} className="w-3 h-3 object-contain rounded-full shrink-0" />
                    <span>{badge.name}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="w-full flex justify-between items-center pt-3 sm:pt-4 border-t border-white/10 shrink-0 mt-auto">
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
            if (!personA || !personB) {
              soundFx.playClick();
              alert('Please select both Member #1 and Member #2 to form your Duo');
              return;
            }
            soundFx.playSelect();
            onNext();
          }}
          className={`px-8 py-2.5 rounded-full border border-white/80 font-serif-display text-lg sm:text-xl transition-all shadow-lg cursor-pointer ${
            personA && personB
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
