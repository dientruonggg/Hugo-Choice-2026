import React, { useState, useRef, useEffect } from 'react';
import { soundFx } from '../../utils/soundEffects';
import { ALL_MEMBERS, filterMembers, getAvailableGivenNameInitials, ClubMember } from '../../data/membersData';
import { HugoTeam } from '../../types';
import { Search, UserCheck, ChevronDown, Sparkles, UserPlus, Download, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { addGuestName, getGuestEntries, exportGuestListTxt } from '../../utils/guestStorage';

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
  const [selectedLetterFilter, setSelectedLetterFilter] = useState<string>('all');
  const [isOpenSuggestions, setIsOpenSuggestions] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [guestEntries, setGuestEntries] = useState(getGuestEntries());
  const [error, setError] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const availableInitials = getAvailableGivenNameInitials(ALL_MEMBERS);
  const hasActiveSearchOrFilter = name.trim() !== '' || selectedTeamFilter !== 'all' || selectedLetterFilter !== 'all';
  const filteredMembers = hasActiveSearchOrFilter ? filterMembers(name, selectedTeamFilter, selectedLetterFilter) : [];

  const isExactMemberMatch = ALL_MEMBERS.some(
    m => m.name.toLowerCase() === name.trim().toLowerCase()
  );

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
    setIsGuest(false);
    setIsOpenSuggestions(false);
    setError('');
  };

  const handleSelectCustomGuest = () => {
    if (!name.trim()) return;
    soundFx.playSelect();
    const updated = addGuestName(name.trim());
    setGuestEntries(updated);
    setIsGuest(true);
    setSelectedTeamId(undefined);
    setIsOpenSuggestions(false);
    setError('');
  };

  const handleProceed = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      soundFx.playClick();
      setError('Vui lòng nhập hoặc chọn tên của bạn để tiếp tục');
      return;
    }

    // If custom name not in official member list, save into guest storage separately
    if (!isExactMemberMatch) {
      addGuestName(trimmed);
    }

    soundFx.playSelect();
    onNext(trimmed, selectedTeamId);
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between w-full h-full min-h-0 py-2 sm:py-3 px-3 sm:px-6 overflow-y-auto custom-scrollbar pb-64 sm:pb-72">
      {/* TOP NAVIGATION BAR */}
      <div className="w-full max-w-2xl mx-auto flex justify-between items-center mb-2 px-1 shrink-0 z-20">
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
          onClick={handleProceed}
          className={`px-4 py-1.5 sm:px-6 sm:py-2 rounded-full border-2 border-white/80 font-serif-display text-xs sm:text-base flex items-center gap-1 cursor-pointer transition-all shadow-md active:scale-95 select-none ${name.trim()
              ? 'bg-gradient-to-r from-amber-300 via-amber-200 to-white text-gray-950 font-bold hover:scale-105'
              : 'bg-white/40 text-gray-800 opacity-60'
            }`}
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Title Header */}
      <div className="text-center mb-2 shrink-0">
        <h2 className="font-serif-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-wider text-white text-stroke-gold drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] uppercase">
          WHO ARE YOU?
        </h2>
        <p className="font-serif-display text-xs sm:text-base text-amber-200 mt-1 drop-shadow">
          Chọn tên từ danh sách thành viên Hugo hoặc nhập tên riêng của bạn
        </p>
      </div>

      {/* Main Form Section */}
      <div className="relative max-w-2xl mx-auto w-full my-auto py-2 flex-1 flex flex-col justify-center min-h-0">
        <div ref={wrapperRef} className="relative w-full">

          {/* Label with strong shadow for high readability */}
          <label className="block font-serif-display text-base sm:text-xl text-amber-200 mb-2 font-bold flex items-center justify-between">
            <span className="bg-black/65 px-3.5 py-1.5 rounded-xl border border-amber-400/40 shadow-[0_4px_15px_rgba(0,0,0,0.9)] text-shadow-elegant flex items-center gap-2 text-amber-300 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
              <span>Your Full Name / Họ và Tên:</span>
            </span>

            {selectedTeamId ? (
              <span className={`text-xs px-3 py-1 rounded-full border inline-flex items-center gap-1.5 shadow-md ${TEAM_BADGES[selectedTeamId].bg} ${TEAM_BADGES[selectedTeamId].text}`}>
                <img src={TEAM_BADGES[selectedTeamId].image} alt={TEAM_BADGES[selectedTeamId].name} className="w-4 h-4 object-contain rounded-full shrink-0" />
                <span>{TEAM_BADGES[selectedTeamId].name}</span>
              </span>
            ) : isGuest || (!isExactMemberMatch && name.trim()) ? (
              <span className="text-xs px-3 py-1 rounded-full border border-amber-400/60 bg-amber-500/30 text-amber-200 font-bold inline-flex items-center gap-1 shadow-md backdrop-blur-md">
                <User className="w-3.5 h-3.5 text-amber-300" />
                <span>Khách mời (Guest)</span>
              </span>
            ) : null}
          </label>

          {/* Searchable Combobox Input */}
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSelectedTeamId(undefined);
                setIsGuest(false);
                setIsOpenSuggestions(true);
                setError('');
              }}
              onFocus={() => setIsOpenSuggestions(true)}
              placeholder="Nhập tên của bạn hoặc chọn từ danh sách..."
              className="w-full py-3.5 pl-11 pr-10 rounded-2xl bg-white/95 text-gray-900 placeholder-gray-500 font-serif-display text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-amber-300 shadow-2xl border-2 border-amber-300/60"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            <button
              type="button"
              onClick={() => setIsOpenSuggestions(!isOpenSuggestions)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpenSuggestions ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Team & Alphabet Filter Pills inside dropdown header */}
          {isOpenSuggestions && (
            <div className="relative md:absolute md:top-full md:left-0 md:right-0 w-full mt-2 z-50 rounded-2xl bg-gray-950/95 border-2 border-amber-300/60 shadow-2xl backdrop-blur-xl overflow-hidden animate-fade-in">
              {/* Team Filter Bar */}
              <div className="p-2 border-b border-white/10 bg-black/40 flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar">
                <span className="text-[0.7rem] sm:text-xs text-amber-200/80 font-serif-display shrink-0 font-semibold">Đội:</span>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTeamFilter('all');
                      soundFx.playClick();
                    }}
                    className={`px-2 py-0.5 rounded-full text-[0.7rem] sm:text-xs font-serif-display transition-all cursor-pointer ${selectedTeamFilter === 'all'
                        ? 'bg-amber-400 text-black font-extrabold'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                  >
                    Tất cả ({ALL_MEMBERS.length})
                  </button>
                  {(['prs', 'hc', 'bnn', 'niff'] as HugoTeam[]).map(t => {
                    const count = ALL_MEMBERS.filter(m => m.teamId === t).length;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setSelectedTeamFilter(t);
                          soundFx.playClick();
                        }}
                        className={`px-2 py-0.5 rounded-full text-[0.7rem] sm:text-xs font-serif-display transition-all flex items-center gap-1 cursor-pointer ${selectedTeamFilter === t
                            ? 'bg-amber-400 text-black font-extrabold'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                      >
                        <img src={TEAM_BADGES[t].image} alt={TEAM_BADGES[t].name} className="w-3.5 h-3.5 object-contain rounded-full shrink-0" />
                        <span>{TEAM_BADGES[t].name} ({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Alphabet Quick Filter Bar */}
              <div className="p-1.5 border-b border-white/10 bg-black/60 flex items-center gap-1 overflow-x-auto custom-scrollbar">
                <span className="text-[0.65rem] sm:text-[0.7rem] text-amber-300 font-serif-display shrink-0 font-bold px-1">Chữ cái Tên:</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLetterFilter('all');
                    soundFx.playClick();
                  }}
                  className={`px-2 py-0.5 rounded-full text-[0.65rem] sm:text-xs font-serif-display transition-all cursor-pointer shrink-0 ${selectedLetterFilter === 'all'
                      ? 'bg-amber-400 text-black font-extrabold'
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
                      setSelectedLetterFilter(letter);
                      soundFx.playClick();
                    }}
                    className={`w-6 h-6 rounded-full text-[0.65rem] sm:text-xs font-serif-display transition-all flex items-center justify-center cursor-pointer shrink-0 ${selectedLetterFilter === letter
                        ? 'bg-amber-400 text-black font-extrabold shadow-[0_0_10px_rgba(251,191,36,0.8)] scale-110'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>

              {/* Scrollable Suggestions Grid */}
              <div className="max-h-64 overflow-y-auto p-2 custom-scrollbar">
                {/* Option to add custom name as Guest */}
                {name.trim() && !isExactMemberMatch && (
                  <button
                    type="button"
                    onClick={handleSelectCustomGuest}
                    className="w-full p-2.5 rounded-xl text-left font-serif-display text-xs sm:text-sm bg-gradient-to-r from-amber-950/80 via-black/80 to-amber-900/60 hover:from-amber-900 hover:to-amber-800 border-2 border-amber-400/70 text-amber-200 flex items-center justify-between transition-all cursor-pointer shadow-lg mb-2"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <UserPlus className="w-4 h-4 text-amber-300 shrink-0" />
                      <span className="truncate">Thêm tên <strong>"{name.trim()}"</strong> (Khách mời / Guest)</span>
                    </div>
                    <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-amber-400 text-black font-extrabold shrink-0 ml-2 shadow">
                      Guest
                    </span>
                  </button>
                )}

                {/* Member Suggestions 2-Column Grid */}
                {!hasActiveSearchOrFilter ? (
                  <div className="py-6 px-3 text-center text-amber-200/90 font-serif-display text-xs font-semibold">
                    🔍 Hãy nhập tên thành viên vào ô tìm kiếm hoặc chọn Đội / Chữ cái để hiển thị danh sách
                  </div>
                ) : filteredMembers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {filteredMembers.map((member) => {
                      const badge = TEAM_BADGES[member.teamId];
                      const isSelected = name.trim().toLowerCase() === member.name.toLowerCase();

                      return (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => handleSelectMember(member)}
                          className={`p-2 rounded-xl text-left font-serif-display text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer border ${isSelected
                              ? 'bg-amber-400 text-gray-950 font-extrabold border-amber-300 shadow-md scale-[1.01]'
                              : 'bg-white/5 hover:bg-white/15 border-white/5 text-white'
                            }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <UserCheck className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-gray-950' : 'text-amber-300'}`} />
                            <span className="truncate font-semibold">{member.name}</span>
                          </div>
                          <span className={`text-[0.65rem] px-1.5 py-0.5 rounded-full border shrink-0 ml-1 inline-flex items-center gap-1 ${badge.bg} ${badge.text}`}>
                            <img src={badge.image} alt={badge.name} className="w-3 h-3 object-contain rounded-full shrink-0" />
                            <span className="hidden sm:inline">{badge.name}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-5 text-center text-amber-200/70 font-serif-display text-xs">
                    Không tìm thấy thành viên khớp với từ khóa "{name}". Bạn có thể chọn nút bên trên để đăng ký tên Khách mời!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Info Box */}
          <div className="mt-3 p-3 rounded-xl bg-black/60 border border-amber-300/40 text-amber-200 text-xs sm:text-sm font-serif-display flex items-center justify-between backdrop-blur-md shadow-md">
            <span>✨ Bạn có thể tự do chọn tên từ danh sách hoặc dùng tên riêng làm Khách Mời (Guest).</span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-2 text-red-300 text-sm font-bold text-center animate-shake">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons - Pulled up on portrait screen orientation */}
      <div className="w-full max-w-6xl flex justify-between items-center pt-2 sm:pt-3 border-t border-white/15 shrink-0 px-4 sm:px-8">
        <button
          onClick={() => {
            soundFx.playClick();
            onBack();
          }}
          className="px-6 py-2 sm:px-9 sm:py-2.5 min-w-[95px] sm:min-w-[130px] rounded-full border-2 border-white/90 bg-black/60 hover:bg-black/80 text-white font-serif-display text-base sm:text-xl transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:scale-105 active:scale-95 select-none touch-manipulation cursor-pointer"
        >
          Back
        </button>

        <button
          onClick={handleProceed}
          className={`px-6 py-2 sm:px-9 sm:py-2.5 min-w-[95px] sm:min-w-[130px] rounded-full border-2 border-white/90 font-serif-display text-base sm:text-xl transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)] active:scale-95 select-none touch-manipulation cursor-pointer ${name.trim()
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
