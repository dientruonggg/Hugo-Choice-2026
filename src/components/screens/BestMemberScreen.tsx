import React, { useState } from 'react';
import { ALL_MEMBERS, filterMembers, getAvailableGivenNameInitials, ClubMember } from '../../data/membersData';
import { HugoTeam } from '../../types';
import { soundFx } from '../../utils/soundEffects';
import { ButterflyParticle } from '../ButterflyParticle';
import { Check, Search, UserCheck, Sparkles, Award, ChevronLeft, ChevronRight } from 'lucide-react';

interface BestMemberScreenProps {
  selectedCandidateIds: string[];
  userTeam?: HugoTeam | null;
  onSelectCandidates: (ids: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const TEAM_BADGES: Record<HugoTeam, { name: string; shortName: string; bg: string; text: string; image: string }> = {
  prs: { name: 'Power Rangers', shortName: 'P.Rangers', bg: 'bg-red-500/35 border-red-300/80', text: 'text-red-300 font-bold', image: '/team_logo/POWER RANGERS.png' },
  hc: { name: 'Heroes Company', shortName: 'Heroes Co.', bg: 'bg-blue-500/35 border-blue-300/80', text: 'text-blue-300 font-bold', image: '/team_logo/Heroes.png' },
  bnn: { name: 'Banana', shortName: 'Banana', bg: 'bg-yellow-500/35 border-yellow-300/80', text: 'text-yellow-300 font-bold', image: '/team_logo/BANANA.png' },
  niff: { name: 'Nifflers', shortName: 'Nifflers', bg: 'bg-purple-500/35 border-purple-300/80', text: 'text-purple-300 font-bold', image: '/team_logo/NIFFLER.png' }
};

export const BestMemberScreen: React.FC<BestMemberScreenProps> = ({
  selectedCandidateIds = [],
  userTeam = null,
  onSelectCandidates,
  onBack,
  onNext
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const targetTeam: HugoTeam | 'all' = userTeam || 'all';
  const [selectedLetterFilter, setSelectedLetterFilter] = useState<string>('all');

  const selectedList = Array.isArray(selectedCandidateIds) ? selectedCandidateIds : (selectedCandidateIds ? [selectedCandidateIds] : []);

  const teamMembersPool = targetTeam !== 'all'
    ? ALL_MEMBERS.filter(m => m.teamId === targetTeam)
    : ALL_MEMBERS;

  const availableInitials = getAvailableGivenNameInitials(teamMembersPool);
  const hasActiveFilter = searchQuery.trim() !== '' || selectedLetterFilter !== 'all';
  const filteredList = hasActiveFilter ? filterMembers(searchQuery, targetTeam, selectedLetterFilter) : [];

  const handleSelectMember = (member: ClubMember) => {
    soundFx.playSelect();
    if (selectedList.includes(member.id) || selectedList.includes(member.name)) {
      // Remove
      const nextList = selectedList.filter(id => id !== member.id && id !== member.name);
      onSelectCandidates(nextList);
    } else {
      if (selectedList.length >= 3) {
        alert('Bạn chỉ được chọn tối đa 3 người cho Best Member! Vui lòng bỏ chọn 1 người trước nếu muốn thay đổi.');
        return;
      }
      onSelectCandidates([...selectedList, member.id]);
    }
  };

  const isComplete = selectedList.length === 3;

  return (
    <div className="relative flex-1 flex flex-col justify-between w-full h-full min-h-0 py-2 sm:py-3 px-3 sm:px-6 overflow-y-auto custom-scrollbar pb-64 sm:pb-72">
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
            if (selectedList.length < 3) {
              soundFx.playClick();
              alert(`Yêu cầu phải vote đủ 3 người mới qua được! (Hiện tại bạn mới chọn ${selectedList.length}/3 người)`);
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
          <span>Next ({selectedList.length}/3)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Title Header */}
      <div className="text-center mb-2 sm:mb-3 shrink-0">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[0.65rem] sm:text-xs font-bold mb-1 shadow-md">
          <span>⏱️ VÒNG 2 (29/07 - 02/08)</span>
          <span className="opacity-50">•</span>
          <span>BẮT BUỘC CHỌN ĐỦ 3 NGUỜI</span>
        </div>
        <h2 className="font-serif-display text-2xl sm:text-4xl md:text-5xl font-black tracking-wider text-white text-stroke-gold drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] uppercase">
          THE BEST MEMBER
        </h2>
        <p className="font-serif-display text-[0.7rem] sm:text-sm text-amber-300 font-bold mt-0.5 max-w-2xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
          🎗 Tôn vinh cá nhân có cống hiến xuất sắc • <span className="text-white underline">Yêu cầu chọn đủ 3 người</span> mới qua được!
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="relative flex-1 flex flex-col min-h-0 max-w-5xl mx-auto w-full py-1 overflow-hidden">
        {/* Search & Team Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-2 bg-black/60 p-2 sm:p-3 rounded-2xl backdrop-blur-md border border-amber-300/50 shadow-2xl w-full min-w-0 max-w-full shrink-0">
          {/* Search Box */}
          <div className="relative w-full sm:w-56 md:w-64 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={userTeam ? `Tìm thành viên ${TEAM_BADGES[userTeam].name}...` : "Search member by name..."}
              className="w-full py-2 sm:py-2.5 pl-9 pr-3 rounded-full bg-white/95 text-gray-900 placeholder-gray-500 font-serif-display text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Selection counter status */}
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold font-serif-display border flex items-center gap-1.5 shadow ${isComplete ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200' : 'bg-amber-500/20 border-amber-400 text-amber-200'}`}>
              <span>{isComplete ? '✓ Đã chọn đủ 3/3 người' : `Đang chọn: ${selectedList.length}/3 người (Cần thêm ${3 - selectedList.length})`}</span>
            </div>
          </div>
        </div>

        {/* Alphabet Letter Quick Filter Bar */}
        <div className="mb-2.5 bg-black/60 px-3 py-1.5 rounded-xl backdrop-blur-md border border-amber-300/40 flex items-center gap-1 overflow-x-auto custom-scrollbar shrink-0">
          <span className="text-[0.7rem] sm:text-xs text-amber-300 font-serif-display shrink-0 font-bold mr-1">Tên A-Z:</span>
          <button
            type="button"
            onClick={() => {
              setSelectedLetterFilter('all');
              soundFx.playClick();
            }}
            className={`px-2 py-0.5 rounded-full text-[0.7rem] sm:text-xs font-serif-display transition-all cursor-pointer shrink-0 ${selectedLetterFilter === 'all'
                ? 'bg-amber-400 text-black font-extrabold shadow'
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
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full text-[0.7rem] sm:text-xs font-serif-display transition-all flex items-center justify-center cursor-pointer shrink-0 ${selectedLetterFilter === letter
                  ? 'bg-amber-400 text-black font-extrabold shadow-[0_0_12px_rgba(251,191,36,0.9)] scale-110'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Currently Selected 3 Members Pills Bar */}
        <div className="mb-2.5 p-2.5 sm:p-3 rounded-2xl bg-black/70 border-2 border-amber-400/60 backdrop-blur-md text-white shadow-xl shrink-0">
          <div className="text-[0.65rem] sm:text-xs text-amber-300 font-bold uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Danh sách 3 ứng viên Best Member đã chọn ({selectedList.length}/3):</span>
            {!isComplete && <span className="text-amber-200 italic animate-pulse">Vui lòng chọn thêm {3 - selectedList.length} người</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2].map((idx) => {
              const selectedId = selectedList[idx];
              const memObj = selectedId ? ALL_MEMBERS.find(m => m.id === selectedId || m.name === selectedId) : null;

              return memObj ? (
                <div
                  key={memObj.id}
                  className="px-3 py-1.5 rounded-full bg-amber-400 text-black font-bold font-serif-display text-xs sm:text-sm flex items-center gap-2 shadow-md animate-fade-in"
                >
                  <span className="w-5 h-5 rounded-full bg-black text-amber-300 text-[0.65rem] flex items-center justify-center font-black">
                    #{idx + 1}
                  </span>
                  <span>{memObj.name}</span>
                  <button
                    type="button"
                    onClick={() => handleSelectMember(memObj)}
                    className="w-4 h-4 rounded-full bg-black/30 hover:bg-black/70 text-white flex items-center justify-center text-xs font-bold cursor-pointer"
                    title="Bỏ chọn"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-full bg-white/10 border border-dashed border-white/30 text-white/50 font-serif-display text-xs sm:text-sm flex items-center gap-1.5"
                >
                  <span className="w-5 h-5 rounded-full bg-white/10 text-white/50 text-[0.65rem] flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <span>Chưa chọn ứng viên #{idx + 1}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrollable Grid of Members */}
        <div className="relative flex-1 min-h-0 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 custom-scrollbar">
          {!hasActiveFilter ? (
            <div className="col-span-full py-12 px-4 rounded-2xl bg-black/40 border border-dashed border-amber-300/40 text-center flex flex-col items-center justify-center my-auto">
              <Search className="w-10 h-10 text-amber-300 mb-2 animate-bounce" />
              <p className="font-serif-display text-white text-sm sm:text-base font-bold mb-1">
                {userTeam
                  ? `Gõ tên thành viên Đội ${TEAM_BADGES[userTeam].name} vào ô tìm kiếm hoặc chọn chữ cái`
                  : 'Gõ tên thành viên vào ô tìm kiếm hoặc chọn chữ cái để hiển thị danh sách ứng viên'}
              </p>
              <p className="text-xs text-amber-200/80 italic">
                (Hãy chọn đúng 3 người để hoàn tất Best Member)
              </p>
            </div>
          ) : filteredList.length > 0 ? (
            filteredList.map((member) => {
              const isSelected = selectedList.includes(member.id) || selectedList.includes(member.name);
              const badge = TEAM_BADGES[member.teamId];

              return (
                <button
                  key={member.id}
                  onClick={() => handleSelectMember(member)}
                  className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl font-serif-display transition-all duration-200 flex items-center justify-between cursor-pointer border text-left ${isSelected
                      ? 'bg-amber-400 border-amber-300 text-gray-950 font-black shadow-[0_0_24px_rgba(251,191,36,0.85)] scale-[1.02]'
                      : 'bg-black/55 hover:bg-amber-950/60 border-amber-300/40 text-white hover:scale-[1.01]'
                    }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden min-w-0">
                    <UserCheck className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${isSelected ? 'text-gray-950' : 'text-amber-300'}`} />
                    <div className="truncate min-w-0">
                      <div className="text-xs sm:text-base font-bold truncate leading-tight">{member.name}</div>
                      <div className={`text-[0.65rem] sm:text-xs inline-flex items-center gap-1 opacity-95 ${isSelected ? 'text-gray-950 font-bold' : badge.text}`}>
                        <img src={badge.image} alt={badge.name} className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain rounded-full shrink-0" />
                        <span className="truncate">{badge.shortName}</span>
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-950 text-amber-300 flex items-center justify-center shrink-0 ml-1 shadow font-bold text-xs">
                      ✓
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="col-span-full py-10 text-center text-amber-200/90 font-serif-display text-base drop-shadow">
              Không tìm thấy thành viên phù hợp với từ khóa "{searchQuery}"
            </div>
          )}
        </div>
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
            if (selectedList.length < 3) {
              soundFx.playClick();
              alert(`Yêu cầu phải vote đủ 3 người mới qua được! (Hiện tại bạn mới chọn ${selectedList.length}/3 người)`);
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
          Next ({selectedList.length}/3)
        </button>
      </div>

      {/* Extra Bottom Scroll Space */}
      <div className="w-full h-48 sm:h-64 shrink-0 pointer-events-none" />
    </div>
  );
};
