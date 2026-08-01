import React, { useState, useEffect } from 'react';
import { ALL_MEMBERS, filterMembers, getAvailableGivenNameInitials, ClubMember } from '../../data/membersData';
import { HugoTeam } from '../../types';
import { soundFx } from '../../utils/soundEffects';
import { Check, Search, Heart, Users, Sparkles, Zap, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';

interface PerfectDuoScreenProps {
  selectedDuoIds: string[];
  onSelectDuos: (duos: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const TEAM_BADGES: Record<HugoTeam, { name: string; bg: string; text: string; image: string }> = {
  prs: { name: 'Power Rangers', bg: 'bg-red-500/35 border-red-300/80', text: 'text-red-300 font-bold', image: '/team_logo/POWER RANGERS.png' },
  hc: { name: 'Heroes Company', bg: 'bg-blue-500/35 border-blue-300/80', text: 'text-blue-300 font-bold', image: '/team_logo/Heroes.png' },
  bnn: { name: 'Banana', bg: 'bg-yellow-500/35 border-yellow-300/80', text: 'text-yellow-300 font-bold', image: '/team_logo/BANANA.png' },
  niff: { name: 'Nifflers', bg: 'bg-purple-500/35 border-purple-300/80', text: 'text-purple-300 font-bold', image: '/team_logo/NIFFLER.png' }
};

// Reusable member picker panel using Cyan & Emerald (non-romantic colors)
interface MemberPickerProps {
  label: string;
  color: 'cyan' | 'emerald';
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
  const [letterFilter, setLetterFilter] = useState<string>('all');
  const availableInitials = getAvailableGivenNameInitials(ALL_MEMBERS);
  const hasActiveFilter = search.trim() !== '' || teamFilter !== 'all' || letterFilter !== 'all';
  const list = hasActiveFilter ? filterMembers(search, teamFilter, letterFilter) : [];

  const ringColor = color === 'cyan' ? 'focus:ring-cyan-300' : 'focus:ring-emerald-300';
  const selectedBg = color === 'cyan' ? 'bg-cyan-400 border-cyan-300 text-gray-950 font-extrabold' : 'bg-emerald-400 border-emerald-300 text-gray-950 font-extrabold';
  const activePill = color === 'cyan' ? 'bg-cyan-400 text-black font-extrabold' : 'bg-emerald-400 text-black font-extrabold';
  const titleColor = color === 'cyan' ? 'text-cyan-300' : 'text-emerald-300';

  return (
    <div className="flex flex-col bg-black/40 p-3 rounded-2xl backdrop-blur-md border border-white/20 min-h-0 overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h3 className={`font-serif-display text-sm font-bold flex items-center gap-1.5 ${titleColor}`}>
          <Users className="w-4 h-4" /> {label}
        </h3>
        {selectedId && (
          <span className={`text-[0.7rem] px-2 py-0.5 rounded-full ${activePill}`}>
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
      <div className="flex flex-wrap gap-1 mb-1.5 shrink-0">
        <button
          onClick={() => {
            onTeamFilter('all');
            soundFx.playClick();
          }}
          className={`px-2 py-0.5 rounded-full text-[0.7rem] font-serif-display transition-all cursor-pointer ${teamFilter === 'all' ? activePill : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
        >
          Tất cả ({ALL_MEMBERS.length})
        </button>
        {(['prs', 'hc', 'bnn', 'niff'] as HugoTeam[]).map(t => {
          const count = ALL_MEMBERS.filter(m => m.teamId === t).length;
          return (
            <button
              key={t}
              onClick={() => {
                onTeamFilter(t);
                soundFx.playClick();
              }}
              className={`px-1.5 py-0.5 rounded-full text-[0.7rem] font-serif-display transition-all flex items-center gap-1 cursor-pointer ${teamFilter === t ? activePill : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
            >
              <img src={TEAM_BADGES[t].image} alt={TEAM_BADGES[t].name} className="w-3.5 h-3.5 object-contain rounded-full shrink-0" />
              <span className="hidden sm:inline">{TEAM_BADGES[t].name} ({count})</span>
              <span className="sm:hidden">{t.toUpperCase()} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Alphabet Quick Filter */}
      <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar mb-2 shrink-0 pb-1">
        <span className="text-[0.65rem] text-amber-200/80 font-serif-display shrink-0 font-bold mr-0.5">Tên:</span>
        <button
          onClick={() => {
            setLetterFilter('all');
            soundFx.playClick();
          }}
          className={`px-1.5 py-0.5 rounded-full text-[0.65rem] font-serif-display transition-all shrink-0 cursor-pointer ${letterFilter === 'all' ? activePill : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
        >
          Tất cả
        </button>
        {availableInitials.map(letter => (
          <button
            key={letter}
            onClick={() => {
              setLetterFilter(letter);
              soundFx.playClick();
            }}
            className={`w-5 h-5 rounded-full text-[0.65rem] font-serif-display transition-all flex items-center justify-center shrink-0 cursor-pointer ${letterFilter === letter ? activePill + ' scale-110 shadow' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Scrollable 2-Column Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar">
        {!hasActiveFilter ? (
          <div className="py-8 px-3 text-center flex flex-col items-center justify-center my-auto border border-dashed border-white/20 rounded-xl bg-black/30">
            <Search className="w-6 h-6 text-amber-300 mb-1 animate-bounce" />
            <p className="font-serif-display text-white text-xs font-bold">
              Gõ tên vào ô tìm kiếm hoặc chọn Đội / Chữ cái để tìm {label}
            </p>
          </div>
        ) : list.length === 0 ? (
          <div className="text-center text-white/50 font-serif-display text-xs py-6">Không tìm thấy thành viên phù hợp với từ khóa "{search}"</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {list.map(member => {
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
                  className={`p-2 rounded-xl text-left font-serif-display text-xs transition-all flex items-center justify-between cursor-pointer border ${isSelected
                      ? selectedBg + ' shadow-md scale-[1.01]'
                      : isOtherSelected
                        ? 'bg-red-950/30 border-red-500/30 text-white/40 cursor-not-allowed opacity-60'
                        : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
                    }`}
                >
                  <div className="truncate flex items-center gap-1">
                    <span className="truncate font-semibold">{member.name}</span>
                    {isOtherSelected && (
                      <span className="text-[0.6rem] text-red-300 font-bold bg-red-900/60 px-1 py-0.5 rounded shrink-0">
                        Đã chọn
                      </span>
                    )}
                  </div>
                  <span className={`text-[0.65rem] shrink-0 ml-1 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full border ${badge.bg} ${badge.text}`}>
                    <img src={badge.image} alt={badge.name} className="w-3.5 h-3.5 object-contain rounded-full shrink-0" />
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export const PerfectDuoScreen: React.FC<PerfectDuoScreenProps> = ({
  selectedDuoIds = [],
  onSelectDuos,
  onBack,
  onNext
}) => {
  const initialList = Array.isArray(selectedDuoIds) ? selectedDuoIds : (selectedDuoIds ? [selectedDuoIds] : []);

  // Track 3 pair objects
  const [pairs, setPairs] = useState<Array<{ a: string; b: string }>>(() => {
    const list: Array<{ a: string; b: string }> = [
      { a: '', b: '' },
      { a: '', b: '' },
      { a: '', b: '' }
    ];
    initialList.forEach((str, idx) => {
      if (idx < 3) {
        const parts = str.split(/\s*&\s*/);
        list[idx] = { a: parts[0] || '', b: parts[1] || '' };
      }
    });
    return list;
  });

  const [activeSlot, setActiveSlot] = useState<number>(0);

  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [teamFilterA, setTeamFilterA] = useState<HugoTeam | 'all'>('all');
  const [teamFilterB, setTeamFilterB] = useState<HugoTeam | 'all'>('all');

  // Mobile sub-tab inside current active slot: 'A' or 'B'
  const [mobileSubTab, setMobileSubTab] = useState<'A' | 'B'>('A');

  // Current active slot pair
  const currentPair = pairs[activeSlot] || { a: '', b: '' };

  const handleSetPersonA = (id: string) => {
    const updated = [...pairs];
    updated[activeSlot] = { ...updated[activeSlot], a: id };
    if (updated[activeSlot].a === updated[activeSlot].b) {
      updated[activeSlot].b = '';
    }
    setPairs(updated);
    emitDuos(updated);
  };

  const handleSetPersonB = (id: string) => {
    const updated = [...pairs];
    updated[activeSlot] = { ...updated[activeSlot], b: id };
    if (updated[activeSlot].a === updated[activeSlot].b) {
      updated[activeSlot].a = '';
    }
    setPairs(updated);
    emitDuos(updated);
  };

  const emitDuos = (pList: Array<{ a: string; b: string }>) => {
    const formatted = pList
      .filter(p => p.a && p.b)
      .map(p => `${p.a} & ${p.b}`);
    onSelectDuos(formatted);
  };

  const validPairsCount = pairs.filter(p => p.a && p.b).length;
  const isComplete = validPairsCount === 3;

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
            if (validPairsCount < 3) {
              soundFx.playClick();
              alert(`Yêu cầu phải chọn đủ 3 cặp Perfect Duo mới qua được! (Hiện tại bạn mới chọn ${validPairsCount}/3 cặp)`);
              return;
            }
            soundFx.playSelect();
            onNext();
          }}
          className={`px-4 py-1.5 sm:px-6 sm:py-2 rounded-full border-2 border-white/80 font-serif-display text-xs sm:text-base flex items-center gap-1 cursor-pointer transition-all shadow-md active:scale-95 select-none ${isComplete
              ? 'bg-gradient-to-r from-amber-300 via-amber-200 to-white text-gray-950 font-bold hover:scale-105 shadow-[0_0_20px_rgba(251,191,36,0.6)]'
              : 'bg-white/40 text-gray-800 opacity-60'
            }`}
        >
          <span>Next ({validPairsCount}/3 cặp)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Title Header */}
      <div className="text-center mb-2 shrink-0">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[0.65rem] sm:text-xs font-bold mb-1 shadow-md">
          <span>⏱️ VÒNG 1 (01/08 - 03/08)</span>
          <span className="opacity-50">•</span>
          <span>VÒNG 2 (05/08 - 09/08)</span>
          <span className="opacity-50">•</span>
          <span>BẮT BUỘC CHỌN ĐỦ 3 CẶP</span>
        </div>
        <h2 className="font-serif-display text-2xl sm:text-4xl md:text-5xl font-black tracking-wider text-white text-stroke-gold drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] uppercase">
          THE PERFECT DUO
        </h2>
        <p className="font-serif-display text-[0.7rem] sm:text-sm text-amber-300 font-bold mt-0.5 max-w-2xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
          🎗 Tôn vinh cặp cạ & đồng đội ăn ý • <span className="text-white underline">Yêu cầu chọn đủ 3 CẶP</span> (6 người) mới qua được!
        </p>
      </div>

      {/* 3 PAIRS OVERVIEW TABS */}
      <div className="max-w-4xl mx-auto w-full mb-2 shrink-0">
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map(slotIdx => {
            const pair = pairs[slotIdx];
            const memA = ALL_MEMBERS.find(m => m.id === pair.a || m.name === pair.a);
            const memB = ALL_MEMBERS.find(m => m.id === pair.b || m.name === pair.b);
            const isPairReady = Boolean(memA && memB);
            const isActive = activeSlot === slotIdx;

            return (
              <button
                key={slotIdx}
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setActiveSlot(slotIdx);
                }}
                className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${isActive
                    ? 'bg-amber-400/30 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.5)] scale-[1.02]'
                    : isPairReady
                      ? 'bg-emerald-950/40 border-emerald-400/60 text-white'
                      : 'bg-black/50 border-white/20 text-white/60 hover:bg-black/70'
                  }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[0.65rem] sm:text-xs font-bold uppercase tracking-wider text-amber-300">
                    CẶP #{slotIdx + 1}
                  </span>
                  <span className={`text-[0.6rem] px-1.5 py-0.5 rounded-full font-bold ${isPairReady ? 'bg-emerald-400 text-black' : 'bg-white/10 text-amber-200/70'}`}>
                    {isPairReady ? '✓ Xong' : 'Đang chọn'}
                  </span>
                </div>
                <div className="font-serif-display text-xs sm:text-sm font-bold truncate">
                  {memA && memB ? (
                    <span className="text-white">{memA.name} & {memB.name}</span>
                  ) : memA ? (
                    <span className="text-amber-200">{memA.name} & ...</span>
                  ) : memB ? (
                    <span className="text-amber-200">... & {memB.name}</span>
                  ) : (
                    <span className="text-white/40 italic">Chưa chọn Cặp #{slotIdx + 1}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Pair Slot Indicator */}
      <div className="max-w-4xl mx-auto w-full mb-2 shrink-0">
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/60 border border-amber-300/40 text-xs text-amber-200">
          <span className="font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Đang thiết lập: CẶP #{activeSlot + 1}</span>
          </span>
          <span className="text-[0.7rem] text-emerald-300 font-bold">
            {currentPair.a && currentPair.b ? '✓ Đã hoàn thành Cặp này' : 'Hãy chọn Đồng đội #1 và Đồng đội #2'}
          </span>
        </div>
      </div>

      {/* Mobile Sub-Tab Switcher (hidden on md+) */}
      <div className="flex md:hidden gap-2 mb-2 shrink-0">
        <button
          onClick={() => setMobileSubTab('A')}
          className={`flex-1 py-1.5 rounded-xl font-serif-display text-xs font-bold transition-all border ${mobileSubTab === 'A'
              ? 'bg-cyan-400 text-black border-cyan-300'
              : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20'
            }`}
        >
          {currentPair.a ? '✓ ' : ''}Đồng đội #1
        </button>
        <button
          onClick={() => setMobileSubTab('B')}
          className={`flex-1 py-1.5 rounded-xl font-serif-display text-xs font-bold transition-all border ${mobileSubTab === 'B'
              ? 'bg-emerald-400 text-black border-emerald-300'
              : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20'
            }`}
        >
          {currentPair.b ? '✓ ' : ''}Đồng đội #2
        </button>
      </div>

      {/* Selection Grid (Cyan & Emerald non-romantic colors) */}
      <div className="flex-1 min-h-0 overflow-hidden max-w-4xl mx-auto w-full">
        {/* Desktop: side by side */}
        <div className="hidden md:grid md:grid-cols-2 gap-4 h-full">
          <MemberPicker
            label={`1. Đồng đội #1 (Cặp ${activeSlot + 1})`}
            color="cyan"
            selectedId={currentPair.a}
            otherSelectedId={currentPair.b}
            search={searchA}
            teamFilter={teamFilterA}
            onSearch={setSearchA}
            onTeamFilter={setTeamFilterA}
            onSelect={(m) => { soundFx.playSelect(); handleSetPersonA(m.id); }}
          />
          <MemberPicker
            label={`2. Đồng đội #2 (Cặp ${activeSlot + 1})`}
            color="emerald"
            selectedId={currentPair.b}
            otherSelectedId={currentPair.a}
            search={searchB}
            teamFilter={teamFilterB}
            onSearch={setSearchB}
            onTeamFilter={setTeamFilterB}
            onSelect={(m) => { soundFx.playSelect(); handleSetPersonB(m.id); }}
          />
        </div>

        {/* Mobile: single tab view */}
        <div className="md:hidden h-full">
          {mobileSubTab === 'A' ? (
            <MemberPicker
              label={`1. Đồng đội #1 (Cặp ${activeSlot + 1})`}
              color="cyan"
              selectedId={currentPair.a}
              otherSelectedId={currentPair.b}
              search={searchA}
              teamFilter={teamFilterA}
              onSearch={setSearchA}
              onTeamFilter={setTeamFilterA}
              onSelect={(m) => { soundFx.playSelect(); handleSetPersonA(m.id); setMobileSubTab('B'); }}
            />
          ) : (
            <MemberPicker
              label={`2. Đồng đội #2 (Cặp ${activeSlot + 1})`}
              color="emerald"
              selectedId={currentPair.b}
              otherSelectedId={currentPair.a}
              search={searchB}
              teamFilter={teamFilterB}
              onSearch={setSearchB}
              onTeamFilter={setTeamFilterB}
              onSelect={(m) => { soundFx.playSelect(); handleSetPersonB(m.id); }}
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="w-full max-w-4xl mx-auto flex justify-between items-center pt-2 sm:pt-3 mt-2 border-t border-white/15 shrink-0">
        <button
          onClick={() => { soundFx.playClick(); onBack(); }}
          className="px-5 py-2 sm:px-8 sm:py-2.5 min-w-[80px] sm:min-w-[120px] rounded-full border-2 border-white/90 bg-black/60 hover:bg-black/80 text-white font-serif-display text-sm sm:text-lg transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)] cursor-pointer"
        >
          Back
        </button>

        <button
          onClick={() => {
            if (validPairsCount < 3) {
              soundFx.playClick();
              alert(`Yêu cầu phải chọn đủ 3 cặp Perfect Duo mới qua được! (Hiện tại bạn mới chọn ${validPairsCount}/3 cặp)`);
              return;
            }
            soundFx.playSelect();
            onNext();
          }}
          className={`px-5 py-2 sm:px-8 sm:py-2.5 min-w-[80px] sm:min-w-[120px] rounded-full border-2 border-white/90 font-serif-display text-sm sm:text-lg transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)] cursor-pointer ${isComplete
              ? 'bg-white/90 hover:bg-white text-gray-900 font-medium hover:scale-105'
              : 'bg-white/40 text-gray-800 opacity-60'
            }`}
        >
          Next ({validPairsCount}/3 cặp)
        </button>
      </div>

      {/* Extra Bottom Scroll Space */}
      <div className="w-full h-48 sm:h-64 shrink-0 pointer-events-none" />
    </div>
  );
};
