import React, { useState, useEffect } from 'react';
import { ALL_MEMBERS, filterMembers, ClubMember } from '../../data/membersData';
import { HugoTeam } from '../../types';
import { soundFx } from '../../utils/soundEffects';
import { Check, Search, Heart, Users, Sparkles, Zap, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';

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

// Reusable member picker panel
interface MemberPickerProps {
  label: string;
  color: 'amber' | 'pink';
  selectedId: string;
  otherSelectedId?: string;
  search: string;
  teamFilter: HugoTeam | 'all';
  onSearch: (v: string) => void;
  onTeamFilter: (t: HugoTeam | 'all') => void;
  onSelect: (m: ClubMember) => void;
}

const MemberPicker: React.FC<MemberPickerProps> = ({
  label, color, selectedId, otherSelectedId, search, teamFilter, onSearch, onTeamFilter, onSelect
}) => {
  const list = filterMembers(search, teamFilter);
  const ringColor = color === 'amber' ? 'focus:ring-amber-300' : 'focus:ring-pink-300';
  const selectedBg = color === 'amber' ? 'bg-amber-400 border-amber-300 text-gray-950' : 'bg-pink-400 border-pink-300 text-gray-950';
  const activePill = color === 'amber' ? 'bg-amber-400 text-black' : 'bg-pink-400 text-black';
  const titleColor = color === 'amber' ? 'text-amber-300' : 'text-pink-300';

  return (
    <div className="flex flex-col bg-black/40 p-3 rounded-2xl backdrop-blur-md border border-white/20 min-h-0 overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h3 className={`font-serif-display text-sm font-bold flex items-center gap-1.5 ${titleColor}`}>
          <Users className="w-4 h-4" /> {label}
        </h3>
        {selectedId && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activePill} text-black`}>
            ✓ Đã chọn
          </span>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-2 shrink-0">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={`Tìm ${label}...`}
          className={`w-full py-1.5 pl-8 pr-3 rounded-full bg-white/90 text-gray-900 placeholder-gray-500 font-serif-display text-xs focus:outline-none focus:ring-2 ${ringColor}`}
        />
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
      </div>

      {/* Team Filters */}
      <div className="flex flex-wrap gap-1 mb-2 shrink-0">
        <button
          onClick={() => onTeamFilter('all')}
          className={`px-2 py-0.5 rounded-full text-[0.7rem] font-serif-display transition-all ${
            teamFilter === 'all' ? activePill + ' font-bold' : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          Tất cả
        </button>
        {(['prs', 'hc', 'bnn', 'niff'] as HugoTeam[]).map(t => (
          <button
            key={t}
            onClick={() => onTeamFilter(t)}
            className={`px-2 py-0.5 rounded-full text-[0.7rem] font-serif-display transition-all flex items-center gap-1 ${
              teamFilter === t ? activePill + ' font-bold' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <img src={TEAM_BADGES[t].image} alt={TEAM_BADGES[t].name} className="w-3.5 h-3.5 object-contain rounded-full shrink-0" />
            <span className="hidden sm:inline">{TEAM_BADGES[t].name}</span>
            <span className="sm:hidden">{t.toUpperCase()}</span>
          </button>
        ))}
      </div>

      {/* Scrollable list */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
        {list.length === 0 ? (
          <div className="text-center text-white/50 font-serif-display text-xs py-6">Không tìm thấy thành viên</div>
        ) : list.map(member => {
          const isSelected = selectedId === member.id || selectedId === member.name;
          const isOtherSelected = !!otherSelectedId && (otherSelectedId === member.id || otherSelectedId === member.name);
          const badge = TEAM_BADGES[member.teamId];

          return (
            <button
              key={member.id}
              onClick={() => {
                if (isOtherSelected) {
                  soundFx.playClick();
                  alert('Thành viên này đã được chọn làm đồng đội bên kia! Vui lòng chọn 2 người khác nhau.');
                  return;
                }
                onSelect(member);
              }}
              className={`w-full p-2 rounded-xl text-left font-serif-display text-xs transition-all flex items-center justify-between cursor-pointer border ${
                isSelected
                  ? selectedBg + ' font-bold shadow-md scale-[1.01]'
                  : isOtherSelected
                  ? 'bg-red-950/30 border-red-500/30 text-white/40 cursor-not-allowed opacity-60'
                  : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
              }`}
            >
              <div className="truncate flex items-center gap-1.5">
                <span className="truncate">{member.name}</span>
                {isOtherSelected && (
                  <span className="text-[0.65rem] text-red-300 font-bold bg-red-900/60 px-1.5 py-0.5 rounded shrink-0">
                    Đã chọn ở bên đối diện
                  </span>
                )}
              </div>
              <span className={`text-[0.65rem] shrink-0 ml-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border ${badge.bg} ${badge.text}`}>
                <img src={badge.image} alt={badge.name} className="w-3 h-3 object-contain rounded-full shrink-0" />
                <span className="hidden sm:inline">{badge.name}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const PerfectDuoScreen: React.FC<PerfectDuoScreenProps> = ({
  selectedDuoId,
  onSelectDuo,
  onBack,
  onNext
}) => {
  const initialParts = selectedDuoId ? selectedDuoId.split(/\s*&\s*/) : [];
  const [personA, setPersonA] = useState<string>(initialParts[0] || '');
  const [personB, setPersonB] = useState<string>(initialParts[1] || '');

  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [teamFilterA, setTeamFilterA] = useState<HugoTeam | 'all'>('all');
  const [teamFilterB, setTeamFilterB] = useState<HugoTeam | 'all'>('all');

  // Mobile tab: 'A' or 'B'
  const [activeTab, setActiveTab] = useState<'A' | 'B'>('A');

  // Prevent same member selected on both sides
  useEffect(() => {
    if (personA && personB && personA === personB) {
      setPersonB('');
    }
  }, [personA, personB]);

  useEffect(() => {
    if (personA && personB) {
      onSelectDuo(`${personA} & ${personB}`);
    } else if (personA) {
      onSelectDuo(personA);
    } else if (personB) {
      onSelectDuo(personB);
    }
  }, [personA, personB]);

  const memberAObj = ALL_MEMBERS.find(m => m.id === personA || m.name === personA);
  const memberBObj = ALL_MEMBERS.find(m => m.id === personB || m.name === personB);

  return (
    <div className="relative flex-1 flex flex-col w-full h-full min-h-0 py-2 px-3 sm:px-6 overflow-y-auto custom-scrollbar pb-64 sm:pb-72">
      {/* TOP NAVIGATION BAR */}
      <div className="w-full max-w-5xl mx-auto flex justify-between items-center mb-2 px-1 shrink-0 z-20">
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            onBack();
          }}
          className="px-4 py-1.5 sm:px-6 sm:py-2 rounded-full border-2 border-white/80 bg-black/70 hover:bg-black/90 text-white font-serif-display text-xs sm:text-base flex items-center gap-1 cursor-pointer transition-all shadow-md active:scale-95 select-none"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (!personA || !personB) {
              soundFx.playClick();
              alert('Vui lòng chọn đủ 2 thành viên để tạo cặp Cạ / Đồng đội ăn ý (Perfect Duo)');
              return;
            }
            if (personA === personB) {
              soundFx.playClick();
              alert('Vui lòng chọn 2 thành viên khác nhau!');
              return;
            }
            soundFx.playSelect();
            onNext();
          }}
          className={`px-4 py-1.5 sm:px-6 sm:py-2 rounded-full border-2 border-white/80 font-serif-display text-xs sm:text-base flex items-center gap-1 cursor-pointer transition-all shadow-md active:scale-95 select-none ${
            personA && personB && personA !== personB
              ? 'bg-gradient-to-r from-amber-300 via-amber-200 to-white text-gray-950 font-bold hover:scale-105'
              : 'bg-white/40 text-gray-800 opacity-60'
          }`}
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      {/* Title Header - Reflecting Best Bond / Colab Vibe */}
      <div className="text-center mb-2 shrink-0">
        <h2 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-wider text-white text-stroke-gold drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] uppercase">
          THE PERFECT DUO
        </h2>
        <p className="font-serif-display text-[0.65rem] sm:text-sm text-amber-200 mt-0.5 italic">
          Bình chọn Cặp Cạ & Đồng Đội Ăn Ý (Best Bond, Colab, Vibe & Hoạt Động Câu Lạc Bộ)
        </p>
      </div>

      {/* Compact Duo Preview Card */}
      <div className="max-w-3xl mx-auto w-full mb-2 shrink-0">
        <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-2xl bg-amber-950/40 border border-amber-400/50 backdrop-blur-md shadow-xl text-white">
          <div className="px-3 py-1 rounded-xl bg-white/10 border border-white/20 flex-1 text-center">
            <div className="text-[0.6rem] text-amber-300 uppercase font-bold tracking-wider">Đồng đội #1</div>
            <div className="font-serif-display text-xs sm:text-base font-bold text-amber-200 truncate">
              {memberAObj?.name || (personA ? personA : <span className="opacity-50">Chưa chọn</span>)}
            </div>
          </div>

          {/* Central Best Bond Synergy Badge */}
          <div className="px-2 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-200 text-gray-950 flex items-center justify-center font-bold shrink-0 shadow-lg gap-1 text-[0.65rem] sm:text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-950" />
            <span className="font-serif-display font-extrabold uppercase tracking-wide">BEST BOND</span>
          </div>

          <div className="px-3 py-1 rounded-xl bg-white/10 border border-white/20 flex-1 text-center">
            <div className="text-[0.6rem] text-pink-300 uppercase font-bold tracking-wider">Đồng đội #2</div>
            <div className="font-serif-display text-xs sm:text-base font-bold text-amber-200 truncate">
              {memberBObj?.name || (personB ? personB : <span className="opacity-50">Chưa chọn</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Switcher (hidden on md+) */}
      <div className="flex md:hidden gap-2 mb-2 shrink-0">
        <button
          onClick={() => setActiveTab('A')}
          className={`flex-1 py-1.5 rounded-xl font-serif-display text-xs font-bold transition-all border ${
            activeTab === 'A'
              ? 'bg-amber-400 text-black border-amber-300'
              : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20'
          }`}
        >
          {personA ? '✓ ' : ''}Đồng đội #1
        </button>
        <button
          onClick={() => setActiveTab('B')}
          className={`flex-1 py-1.5 rounded-xl font-serif-display text-xs font-bold transition-all border ${
            activeTab === 'B'
              ? 'bg-pink-400 text-black border-pink-300'
              : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20'
          }`}
        >
          {personB ? '✓ ' : ''}Đồng đội #2
        </button>
      </div>

      {/* Selection Grid */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {/* Desktop: side by side */}
        <div className="hidden md:grid md:grid-cols-2 gap-4 h-full">
          <MemberPicker
            label="1. Chọn Đồng đội #1"
            color="amber"
            selectedId={personA}
            otherSelectedId={personB}
            search={searchA}
            teamFilter={teamFilterA}
            onSearch={setSearchA}
            onTeamFilter={setTeamFilterA}
            onSelect={(m) => { soundFx.playSelect(); setPersonA(m.id); }}
          />
          <MemberPicker
            label="2. Chọn Đồng đội #2"
            color="pink"
            selectedId={personB}
            otherSelectedId={personA}
            search={searchB}
            teamFilter={teamFilterB}
            onSearch={setSearchB}
            onTeamFilter={setTeamFilterB}
            onSelect={(m) => { soundFx.playSelect(); setPersonB(m.id); }}
          />
        </div>

        {/* Mobile: single tab view */}
        <div className="md:hidden h-full">
          {activeTab === 'A' ? (
            <MemberPicker
              label="1. Chọn Đồng đội #1"
              color="amber"
              selectedId={personA}
              otherSelectedId={personB}
              search={searchA}
              teamFilter={teamFilterA}
              onSearch={setSearchA}
              onTeamFilter={setTeamFilterA}
              onSelect={(m) => { soundFx.playSelect(); setPersonA(m.id); setActiveTab('B'); }}
            />
          ) : (
            <MemberPicker
              label="2. Chọn Đồng đội #2"
              color="pink"
              selectedId={personB}
              otherSelectedId={personA}
              search={searchB}
              teamFilter={teamFilterB}
              onSearch={setSearchB}
              onTeamFilter={setTeamFilterB}
              onSelect={(m) => { soundFx.playSelect(); setPersonB(m.id); }}
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="w-full flex justify-between items-center pt-2 sm:pt-3 mt-2 border-t border-white/15 shrink-0">
        <button
          onClick={() => { soundFx.playClick(); onBack(); }}
          className="px-5 py-2 sm:px-8 sm:py-2.5 min-w-[80px] sm:min-w-[120px] rounded-full border-2 border-white/90 bg-black/60 hover:bg-black/80 text-white font-serif-display text-sm sm:text-lg transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)] cursor-pointer"
        >
          Back
        </button>

        <button
          onClick={() => {
            if (!personA || !personB) {
              soundFx.playClick();
              alert('Vui lòng chọn đủ 2 thành viên để tạo cặp Cạ / Đồng đội ăn ý (Perfect Duo)');
              return;
            }
            if (personA === personB) {
              soundFx.playClick();
              alert('Vui lòng chọn 2 thành viên khác nhau!');
              return;
            }
            soundFx.playSelect();
            onNext();
          }}
          className={`px-5 py-2 sm:px-8 sm:py-2.5 min-w-[80px] sm:min-w-[120px] rounded-full border-2 border-white/90 font-serif-display text-sm sm:text-lg transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)] cursor-pointer ${
            personA && personB && personA !== personB
              ? 'bg-white/90 hover:bg-white text-gray-900 font-medium hover:scale-105'
              : 'bg-white/40 text-gray-800 opacity-60'
          }`}
        >
          Next
        </button>
      </div>

      {/* 200px - 300px Extra Bottom Scroll Space for Mobile Accessibility */}
      <div className="w-full h-48 sm:h-64 shrink-0 pointer-events-none" />
    </div>
  );
};
