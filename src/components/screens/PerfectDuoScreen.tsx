import React, { useState } from 'react';
import { ALL_MEMBERS, filterMembers, getAvailableGivenNameInitials, ClubMember } from '../../data/membersData';
import { TOP_5_PERFECT_DUOS } from '../../data/round2Data';
import { activeRoundConfig, CURRENT_ROUND } from '../../config/roundConfig';
import { HugoTeam } from '../../types';
import { soundFx } from '../../utils/soundEffects';
import { Check, Search, Heart, Users, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

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
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <Users className={`w-4 h-4 ${titleColor}`} />
          <span className={`font-serif-display font-black text-sm ${titleColor}`}>{label}</span>
        </div>
        {selectedId && (
          <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold border border-emerald-400/40">
            ✓ Đã chọn
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 mb-2 shrink-0">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={`Tìm ${label.toLowerCase()}...`}
            className={`w-full py-1.5 pl-8 pr-2 rounded-full bg-white/95 text-gray-900 text-xs font-medium focus:outline-none focus:ring-2 ${ringColor}`}
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
        </div>

        <select
          value={teamFilter}
          onChange={(e) => onTeamFilter(e.target.value as HugoTeam | 'all')}
          className="py-1.5 px-2 rounded-full bg-white/90 text-gray-900 text-[0.7rem] font-bold focus:outline-none cursor-pointer"
        >
          <option value="all">Tất cả Team</option>
          <option value="prs">Power Rangers</option>
          <option value="hc">Heroes Company</option>
          <option value="bnn">Banana</option>
          <option value="niff">Nifflers</option>
        </select>
      </div>

      <div className="mb-2 bg-black/40 px-2 py-1 rounded-xl border border-white/10 flex items-center gap-1 overflow-x-auto custom-scrollbar shrink-0">
        <button
          type="button"
          onClick={() => {
            setLetterFilter('all');
            soundFx.playClick();
          }}
          className={`px-1.5 py-0.5 rounded-full text-[0.65rem] font-serif-display transition-all cursor-pointer shrink-0 ${letterFilter === 'all'
              ? activePill
              : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
        >
          Tất cả
        </button>
        {availableInitials.map(letter => (
          <button
            key={letter}
            type="button"
            onClick={() => {
              setLetterFilter(letter);
              soundFx.playClick();
            }}
            className={`w-5 h-5 rounded-full text-[0.65rem] font-serif-display transition-all flex items-center justify-center cursor-pointer shrink-0 ${letterFilter === letter
                ? activePill
                : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1 grid grid-cols-2 gap-1.5 custom-scrollbar">
        {!hasActiveFilter ? (
          <div className="col-span-full py-8 text-center text-white/60 font-serif-display text-xs italic my-auto">
            Gõ tên vào ô tìm kiếm hoặc lọc theo chữ cái/Team để chọn {label}
          </div>
        ) : list.length > 0 ? (
          list.map(member => {
            const isSelected = selectedId === member.id || selectedId === member.name;
            const isDisabled = otherSelectedId === member.id || otherSelectedId === member.name;
            const badge = TEAM_BADGES[member.teamId];

            return (
              <button
                key={member.id}
                type="button"
                disabled={isDisabled}
                onClick={() => {
                  soundFx.playSelect();
                  onSelect(member);
                }}
                className={`p-2 rounded-xl text-left font-serif-display transition-all flex items-center justify-between border cursor-pointer ${isSelected
                    ? selectedBg
                    : isDisabled
                      ? 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed opacity-50'
                      : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                  }`}
              >
                <div className="truncate min-w-0 pr-1">
                  <div className="text-xs font-bold truncate leading-tight">{member.name}</div>
                  <div className={`text-[0.6rem] inline-flex items-center gap-1 opacity-90 ${isSelected ? 'text-gray-900 font-bold' : badge.text}`}>
                    <img src={badge.image} alt={badge.name} className="w-3 h-3 object-contain rounded-full shrink-0" />
                    <span className="truncate">{badge.name}</span>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })
        ) : (
          <div className="col-span-full py-6 text-center text-white/50 font-serif-display text-xs">
            Không tìm thấy thành viên phù hợp
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
  const requiredCount = activeRoundConfig.requiredVotesPerCategory;

  // Round 2 selection state
  const [selectedR2Duos, setSelectedR2Duos] = useState<string[]>(initialList);

  // Round 1 state
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
  const [mobileSubTab, setMobileSubTab] = useState<'A' | 'B'>('A');

  const currentPair = pairs[activeSlot] || { a: '', b: '' };

  const handleSelectR2Duo = (duo: Top5Candidate) => {
    soundFx.playSelect();
    const isSelected = selectedR2Duos.includes(duo.id) || selectedR2Duos.includes(duo.name);
    let next: string[];
    if (isSelected) {
      next = selectedR2Duos.filter(id => id !== duo.id && id !== duo.name);
    } else {
      if (selectedR2Duos.length >= requiredCount) {
        alert(`Bạn chỉ được chọn tối đa ${requiredCount} cặp cho hạng mục Perfect Duo! Vui lòng bỏ chọn 1 cặp trước nếu muốn thay đổi.`);
        return;
      }
      next = [...selectedR2Duos, duo.id];
    }
    setSelectedR2Duos(next);
    onSelectDuos(next);
  };

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

  const validPairsCount = CURRENT_ROUND === 2 ? selectedR2Duos.length : pairs.filter(p => p.a && p.b).length;
  const isComplete = validPairsCount === requiredCount;

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
            if (validPairsCount < requiredCount) {
              soundFx.playClick();
              alert(`Yêu cầu phải chọn đủ ${requiredCount} cặp Perfect Duo mới qua được! (Hiện tại bạn mới chọn ${validPairsCount}/${requiredCount} cặp)`);
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
          <span>Next ({validPairsCount}/{requiredCount} cặp)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Title Header */}
      <div className="text-center mb-2 shrink-0">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[0.65rem] sm:text-xs font-bold mb-1 shadow-md">
          {CURRENT_ROUND === 2 ? (
            <>
              <span>🔥 VÒNG 2 (05/08 - 09/08)</span>
              <span className="opacity-50">•</span>
              <span>CHỌN ĐÚNG 2 CẶP DUO TOP 5</span>
            </>
          ) : (
            <>
              <span>⏱️ VÒNG 1 (01/08 - 03/08)</span>
              <span className="opacity-50">•</span>
              <span>BẮT BUỘC CHỌN ĐỦ 3 CẶP</span>
            </>
          )}
        </div>
        <h2 className="font-serif-display text-2xl sm:text-4xl md:text-5xl font-black tracking-wider text-white text-stroke-gold drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] uppercase">
          THE PERFECT DUO
        </h2>
        <p className="font-serif-display text-[0.7rem] sm:text-sm text-amber-300 font-bold mt-0.5 max-w-2xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
          🎗 Tôn vinh cặp cạ & đồng đội ăn ý • <span className="text-white underline">Yêu cầu chọn đủ {requiredCount} CẶP</span> mới qua được!
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="relative flex-1 flex flex-col min-h-0 max-w-5xl mx-auto w-full py-1 overflow-hidden">
        {CURRENT_ROUND === 2 ? (
          /* ROUND 2 TOP 5 CARDS DISPLAY */
          <div className="flex flex-col min-h-0 h-full overflow-y-auto custom-scrollbar p-1">
            <div className="mb-3 p-3 rounded-2xl bg-black/60 border border-amber-400/50 backdrop-blur-md text-amber-200 text-center text-xs sm:text-sm font-bold font-serif-display shrink-0">
              💖 Top 5 Cặp Đôi Xuất Sắc Nhất Vòng 1 — Vui lòng chọn đúng 2 cặp ({validPairsCount}/{requiredCount})
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 my-auto">
              {TOP_5_PERFECT_DUOS.map((candidate) => {
                const isSelected = selectedR2Duos.includes(candidate.id) || selectedR2Duos.includes(candidate.name);

                return (
                  <div
                    key={candidate.id}
                    onClick={() => handleSelectR2Duo(candidate)}
                    className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center justify-between cursor-pointer select-none group shadow-xl ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-400/90 to-amber-500/90 border-amber-300 text-gray-950 font-extrabold shadow-[0_0_30px_rgba(251,191,36,0.85)] scale-105 z-10'
                        : 'bg-black/65 hover:bg-black/85 border-amber-400/30 text-white hover:scale-102'
                    }`}
                  >
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/80 border border-amber-400/40 text-amber-300 text-[0.65rem] font-black">
                      TOP 5
                    </span>
                    {isSelected && (
                      <span className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-black flex items-center justify-center shadow-lg">
                        ✓
                      </span>
                    )}

                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-300/60 my-2 shadow-lg group-hover:scale-105 transition-transform duration-300 bg-black/40">
                      <img src={candidate.image} alt={candidate.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="w-full">
                      <h3 className={`font-serif-display text-xs sm:text-sm font-black leading-snug truncate ${isSelected ? 'text-gray-950' : 'text-amber-200'}`}>
                        {candidate.name}
                      </h3>
                      <p className={`text-[0.7rem] mt-1.5 line-clamp-2 ${isSelected ? 'text-gray-900 font-medium' : 'text-white/70'}`}>
                        {candidate.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      className={`w-full mt-3 py-1.5 rounded-xl font-serif-display text-xs font-black transition-all ${
                        isSelected
                          ? 'bg-gray-950 text-amber-300 shadow'
                          : 'bg-amber-400/20 text-amber-300 group-hover:bg-amber-400 group-hover:text-black'
                      }`}
                    >
                      {isSelected ? '✓ ĐÃ BÌNH CHỌN' : 'BÌNH CHỌN'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ROUND 1 VIEW */
          <>
            {/* Slot Tabs */}
            <div className="flex items-center justify-between gap-2 mb-2 bg-black/60 p-2 rounded-2xl backdrop-blur-md border border-amber-300/40 shadow-xl shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
                {[0, 1, 2].map(idx => {
                  const p = pairs[idx];
                  const isPairDone = p.a && p.b;
                  const isActive = activeSlot === idx;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActiveSlot(idx);
                        soundFx.playClick();
                      }}
                      className={`px-3 py-1.5 rounded-xl font-serif-display text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border ${isActive
                          ? 'bg-amber-400 border-amber-300 text-gray-950 shadow-[0_0_15px_rgba(251,191,36,0.6)] scale-105'
                          : isPairDone
                            ? 'bg-emerald-950/60 border-emerald-400/60 text-emerald-200'
                            : 'bg-white/10 border-white/15 text-white/70 hover:bg-white/20'
                        }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isActive ? 'text-gray-950 fill-gray-950' : isPairDone ? 'text-emerald-400 fill-emerald-400' : 'text-amber-400'}`} />
                      <span>Cặp #{idx + 1}</span>
                      {isPairDone && <span className="text-[0.65rem] font-black">✓</span>}
                    </button>
                  );
                })}
              </div>

              <div className="hidden sm:flex items-center gap-1 text-xs font-serif-display font-bold text-amber-200">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Tiến độ: {validPairsCount}/3 cặp</span>
              </div>
            </div>

            {/* Main Member Pickers (Desktop Split / Mobile Subtab) */}
            <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-2.5 overflow-hidden">
              <div className="md:hidden flex rounded-xl bg-black/60 p-1 border border-white/15 shrink-0 mb-1">
                <button
                  type="button"
                  onClick={() => setMobileSubTab('A')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-serif-display transition-all ${mobileSubTab === 'A' ? 'bg-cyan-400 text-black shadow' : 'text-white/70'}`}
                >
                  Thành viên 1 ({currentPair.a ? 'Đã chọn' : 'Chưa chọn'})
                </button>
                <button
                  type="button"
                  onClick={() => setMobileSubTab('B')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-serif-display transition-all ${mobileSubTab === 'B' ? 'bg-emerald-400 text-black shadow' : 'text-white/70'}`}
                >
                  Thành viên 2 ({currentPair.b ? 'Đã chọn' : 'Chưa chọn'})
                </button>
              </div>

              <div className={`flex-1 min-h-0 ${mobileSubTab === 'A' ? 'block' : 'hidden md:block'}`}>
                <MemberPicker
                  label={`Thành viên 1 (Cặp #${activeSlot + 1})`}
                  color="cyan"
                  selectedId={currentPair.a}
                  otherSelectedId={currentPair.b}
                  search={searchA}
                  teamFilter={teamFilterA}
                  onSearch={setSearchA}
                  onTeamFilter={setTeamFilterA}
                  onSelect={(m) => handleSetPersonA(m.id)}
                />
              </div>

              <div className={`flex-1 min-h-0 ${mobileSubTab === 'B' ? 'block' : 'hidden md:block'}`}>
                <MemberPicker
                  label={`Thành viên 2 (Cặp #${activeSlot + 1})`}
                  color="emerald"
                  selectedId={currentPair.b}
                  otherSelectedId={currentPair.a}
                  search={searchB}
                  teamFilter={teamFilterB}
                  onSearch={setSearchB}
                  onTeamFilter={setTeamFilterB}
                  onSelect={(m) => handleSetPersonB(m.id)}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Fixed Navigation Buttons */}
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
            if (validPairsCount < requiredCount) {
              soundFx.playClick();
              alert(`Yêu cầu phải chọn đủ ${requiredCount} cặp Perfect Duo mới qua được! (Hiện tại bạn mới chọn ${validPairsCount}/${requiredCount} cặp)`);
              return;
            }
            soundFx.playSelect();
            onNext();
          }}
          className={`px-6 py-2 sm:px-9 sm:py-2.5 min-w-[95px] sm:min-w-[130px] rounded-full border-2 border-white/90 font-serif-display text-base sm:text-xl transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)] cursor-pointer ${isComplete
              ? 'bg-white/90 hover:bg-white text-gray-900 font-medium hover:scale-105'
              : 'bg-white/40 text-gray-800 opacity-60'
            }`}
        >
          Next ({validPairsCount}/{requiredCount} cặp)
        </button>
      </div>

      {/* Extra Bottom Scroll Space */}
      <div className="w-full h-48 sm:h-64 shrink-0 pointer-events-none" />
    </div>
  );
};
