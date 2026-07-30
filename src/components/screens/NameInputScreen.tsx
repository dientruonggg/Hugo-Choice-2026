import React, { useState, useRef, useEffect } from 'react';
import { soundFx } from '../../utils/soundEffects';
import { ALL_MEMBERS, filterMembers, ClubMember } from '../../data/membersData';
import { HugoTeam } from '../../types';
import { Search, UserCheck, ChevronDown, Sparkles, UserPlus, Download, User } from 'lucide-react';
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
  const [isOpenSuggestions, setIsOpenSuggestions] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [guestEntries, setGuestEntries] = useState(getGuestEntries());
  const [error, setError] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredMembers = filterMembers(name, selectedTeamFilter);
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
    <div className="relative flex-1 flex flex-col justify-between w-full h-full min-h-0 py-2 sm:py-3 px-3 sm:px-6">
      {/* Title Header */}
      <div className="text-center mb-2 shrink-0">
        <h2 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold tracking-wider text-white text-stroke-gold drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] uppercase">
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

          {/* Team Filter Pills inside dropdown header */}
          {isOpenSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-gray-950/95 border-2 border-amber-300/60 shadow-2xl backdrop-blur-xl overflow-hidden animate-fade-in">
              <div className="p-2.5 border-b border-white/10 bg-black/40 flex items-center justify-between gap-2 overflow-x-auto">
                <span className="text-xs text-amber-200/80 font-serif-display shrink-0 font-semibold">Lọc Đội Thành Viên:</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setSelectedTeamFilter('all')}
                    className={`px-2.5 py-1 rounded-full text-xs font-serif-display transition-all cursor-pointer ${
                      selectedTeamFilter === 'all'
                        ? 'bg-amber-400 text-black font-bold'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    Tất cả
                  </button>
                  {(['prs', 'hc', 'bnn', 'niff'] as HugoTeam[]).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTeamFilter(t)}
                      className={`px-2 py-1 rounded-full text-xs font-serif-display transition-all flex items-center gap-1.5 cursor-pointer ${
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
              <div className="max-h-64 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {/* Option to add custom name as Guest (Separated from Official Member list) */}
                {name.trim() && !isExactMemberMatch && (
                  <button
                    type="button"
                    onClick={handleSelectCustomGuest}
                    className="w-full p-2.5 sm:p-3 rounded-xl text-left font-serif-display text-xs sm:text-sm bg-gradient-to-r from-amber-950/80 via-black/80 to-amber-900/60 hover:from-amber-900 hover:to-amber-800 border-2 border-amber-400/70 text-amber-200 flex items-center justify-between transition-all cursor-pointer shadow-lg my-1"
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

                {/* Member Suggestions */}
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
                  <div className="py-5 text-center text-amber-200/70 font-serif-display text-xs">
                    Không tìm thấy thành viên khớp. Bạn có thể chọn tùy chọn trên để dùng tên khách mời!
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
      <div className="w-full max-w-6xl flex justify-between items-center pt-3 sm:pt-4 pb-4 sm:pb-8 mb-[22vh] sm:mb-6 border-t border-white/15 shrink-0 px-4 sm:px-8">
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
          className={`px-6 py-2 sm:px-9 sm:py-2.5 min-w-[95px] sm:min-w-[130px] rounded-full border-2 border-white/90 font-serif-display text-base sm:text-xl transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)] active:scale-95 select-none touch-manipulation cursor-pointer ${
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
