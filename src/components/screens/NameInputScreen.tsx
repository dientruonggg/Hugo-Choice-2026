import React, { useState, useRef, useEffect } from 'react';
import { soundFx } from '../../utils/soundEffects';
import { ButterflyParticle } from '../ButterflyParticle';
import { ALL_MEMBERS, filterMembers, ClubMember } from '../../data/membersData';
import { HugoTeam } from '../../types';
import { Search, UserCheck, ChevronDown, Sparkles, Check } from 'lucide-react';

interface NameInputScreenProps {
  initialName: string;
  onBack: () => void;
  onNext: (name: string, teamId?: HugoTeam) => void;
}

const TEAM_BADGES: Record<HugoTeam, { name: string; bg: string; text: string; image: string }> = {
  prs: { name: 'Power Rangers', bg: 'bg-red-500/35 border-red-300/80', text: 'text-red-300 font-bold', image: '/team_logo/POWER RANGERS.png' },
  hc: { name: 'Heroes Company', bg: 'bg-blue-500/35 border-blue-300/80', text: 'text-blue-300 font-bold', image: '/team_logo/Heroes.png' },
  bnn: { name: 'Banana', bg: 'bg-yellow-500/35 border-yellow-300/80', text: 'text-yellow-300 font-bold', image: '/team_logo/BANANA.png' },
  niff: { name: 'Nifflers', bg: 'bg-purple-500/35 border-purple-300/80', text: 'text-purple-300 font-bold', image: '/team_logo/NIFFLER.png' }
};

export const NameInputScreen: React.FC<NameInputScreenProps> = ({
  initialName,
  onBack,
  onNext
}) => {
  const [name, setName] = useState(initialName);
  const [selectedTeamId, setSelectedTeamId] = useState<HugoTeam | undefined>();
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<HugoTeam | 'all'>('all');
  const [isOpenSuggestions, setIsOpenSuggestions] = useState(false);
  const [error, setError] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredMembers = filterMembers(name, selectedTeamFilter);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpenSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectMember = (member: ClubMember) => {
    soundFx.playSelect();
    setName(member.name);
    setSelectedTeamId(member.teamId);
    setIsOpenSuggestions(false);
    setError('');
  };

  const handleProceed = () => {
    if (!name.trim()) {
      soundFx.playClick();
      setError('Please enter or select your name to continue');
      return;
    }
    soundFx.playSelect();
    onNext(name.trim(), selectedTeamId);
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between w-full h-full min-h-0 py-2 sm:py-3 px-3 sm:px-6">
      {/* Title Header */}
      <div className="text-center mb-2 shrink-0">
        <h2 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold tracking-wider text-white text-stroke-gold drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] uppercase">
          WHO ARE YOU?
        </h2>
        <p className="font-serif-display text-xs sm:text-base text-amber-200 mt-1 drop-shadow">
          Select or search your name from Hugo Club member list to begin voting
        </p>
      </div>

      {/* Main Form Section */}
      <div className="relative max-w-2xl mx-auto w-full my-auto py-2 flex-1 flex flex-col justify-center min-h-0">
        <div ref={wrapperRef} className="relative w-full">
          {/* Label */}
          <label className="block font-serif-display text-base sm:text-xl text-amber-200 mb-2 font-bold flex items-center justify-between">
            <span>Your Full Name / Họ và Tên:</span>
            {selectedTeamId && (
              <span className={`text-xs px-3 py-1 rounded-full border inline-flex items-center gap-1.5 ${TEAM_BADGES[selectedTeamId].bg} ${TEAM_BADGES[selectedTeamId].text}`}>
                <img src={TEAM_BADGES[selectedTeamId].image} alt={TEAM_BADGES[selectedTeamId].name} className="w-4 h-4 object-contain rounded-full shrink-0" />
                <span>{TEAM_BADGES[selectedTeamId].name}</span>
              </span>
            )}
          </label>

          {/* Searchable Combobox Input */}
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSelectedTeamId(undefined);
                setIsOpenSuggestions(true);
                setError('');
              }}
              onFocus={() => setIsOpenSuggestions(true)}
              placeholder="Type your name or select from list..."
              className="w-full py-3.5 pl-11 pr-10 rounded-2xl bg-white/95 text-gray-900 placeholder-gray-500 font-serif-display text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-amber-300 shadow-xl border-2 border-amber-300/40"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            <button
              type="button"
              onClick={() => setIsOpenSuggestions(!isOpenSuggestions)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpenSuggestions ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Team Filter Pills inside dropdown header */}
          {isOpenSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-gray-950/95 border-2 border-amber-300/50 shadow-2xl backdrop-blur-xl overflow-hidden animate-fade-in">
              <div className="p-2.5 border-b border-white/10 bg-black/40 flex items-center justify-between gap-2 overflow-x-auto">
                <span className="text-xs text-amber-200/80 font-serif-display shrink-0 font-semibold">Filter Team:</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setSelectedTeamFilter('all')}
                    className={`px-2.5 py-1 rounded-full text-xs font-serif-display transition-all ${
                      selectedTeamFilter === 'all'
                        ? 'bg-amber-400 text-black font-bold'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    All
                  </button>
                  {(['prs', 'hc', 'bnn', 'niff'] as HugoTeam[]).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTeamFilter(t)}
                      className={`px-2 py-1 rounded-full text-xs font-serif-display transition-all flex items-center gap-1.5 ${
                        selectedTeamFilter === t
                          ? 'bg-amber-400 text-black font-bold'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <img src={TEAM_BADGES[t].image} alt={TEAM_BADGES[t].name} className="w-3.5 h-3.5 object-contain rounded-full shrink-0" />
                      <span>{TEAM_BADGES[t].name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Suggestions List */}
              <div className="max-h-60 overflow-y-auto p-1.5 space-y-1 custom-scrollbar">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => {
                    const badge = TEAM_BADGES[member.teamId];
                    const isSelected = name.trim().toLowerCase() === member.name.toLowerCase();

                    return (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => handleSelectMember(member)}
                        className={`w-full p-2.5 rounded-xl text-left font-serif-display text-sm sm:text-base transition-all flex items-center justify-between cursor-pointer border ${
                          isSelected
                            ? 'bg-amber-400 text-gray-950 font-bold border-amber-300 shadow-md'
                            : 'bg-white/5 hover:bg-white/15 border-white/5 text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <UserCheck className={`w-4 h-4 shrink-0 ${isSelected ? 'text-gray-950' : 'text-amber-300'}`} />
                          <span className="truncate">{member.name}</span>
                        </div>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full border shrink-0 ml-2 inline-flex items-center gap-1 ${badge.bg} ${badge.text}`}>
                          <img src={badge.image} alt={badge.name} className="w-3 h-3 object-contain rounded-full shrink-0" />
                          <span>{badge.name}</span>
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="py-6 text-center text-amber-200/60 font-serif-display text-sm">
                    No matching member found. You can still type your full name above!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Info Box */}
          <div className="mt-3 p-3 rounded-xl bg-amber-950/30 border border-amber-300/30 text-amber-200 text-xs sm:text-sm font-serif-display flex items-center justify-between">
            <span>✨ Selecting from list automatically links your Hugo team</span>
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0 ml-2" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-2 text-red-300 text-sm font-bold text-center animate-shake">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
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
          onClick={handleProceed}
          className={`px-8 py-2.5 rounded-full border border-white/80 font-serif-display text-lg sm:text-xl transition-all shadow-lg cursor-pointer ${
            name.trim()
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
