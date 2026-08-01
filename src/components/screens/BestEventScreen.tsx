import React from 'react';
import { BEST_EVENTS } from '../../data/mockData';
import { TOP_5_BEST_EVENTS } from '../../data/round2Data';
import { activeRoundConfig, CURRENT_ROUND } from '../../config/roundConfig';
import { soundFx } from '../../utils/soundEffects';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BestEventScreenProps {
  selectedEventIds: string[];
  onSelectEvents: (ids: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export const BestEventScreen: React.FC<BestEventScreenProps> = ({
  selectedEventIds = [],
  onSelectEvents,
  onBack,
  onNext
}) => {
  const selectedList = Array.isArray(selectedEventIds) ? selectedEventIds : (selectedEventIds ? [selectedEventIds] : []);
  const requiredCount = activeRoundConfig.requiredVotesPerCategory;
  const isComplete = selectedList.length === requiredCount;

  const handleSelect = (id: string) => {
    soundFx.playSelect();
    if (selectedList.includes(id)) {
      onSelectEvents(selectedList.filter(eId => eId !== id));
    } else {
      if (selectedList.length >= requiredCount) {
        alert(`Bạn chỉ được chọn tối đa ${requiredCount} sự kiện cho hạng mục Best Event! Vui lòng bỏ chọn 1 sự kiện trước nếu muốn thay đổi.`);
        return;
      }
      onSelectEvents([...selectedList, id]);
    }
  };

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
            if (selectedList.length < requiredCount) {
              soundFx.playClick();
              alert(`Yêu cầu phải vote đủ ${requiredCount} sự kiện mới qua được! (Hiện tại bạn mới chọn ${selectedList.length}/${requiredCount} sự kiện)`);
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
          <span>Next ({selectedList.length}/{requiredCount})</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Title Header */}
      <div className="text-center mb-2 sm:mb-3 shrink-0">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[0.65rem] sm:text-xs font-bold mb-1 shadow-md">
          {CURRENT_ROUND === 2 ? (
            <>
              <span>🔥 VÒNG 2 (05/08 - 09/08)</span>
              <span className="opacity-50">•</span>
              <span>CHỌN ĐÚNG 2 SỰ KIỆN TOP 5</span>
            </>
          ) : (
            <>
              <span>⏱️ VÒNG 1 (01/08 - 03/08)</span>
              <span className="opacity-50">•</span>
              <span>BẮT BUỘC CHỌN ĐỦ 3 SỰ KIỆN</span>
            </>
          )}
        </div>
        <h2 className="font-serif-display text-2xl sm:text-4xl md:text-5xl font-black tracking-wider text-white text-stroke-gold drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] uppercase">
          THE BEST EVENT
        </h2>
        <p className="font-serif-display text-[0.7rem] sm:text-sm text-amber-300 font-bold mt-0.5 max-w-2xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
          🎗 Tôn vinh sự kiện hoặc chuỗi hoạt động có quy mô & sức ảnh hưởng lớn nhất • <span className="text-white underline">Yêu cầu chọn đủ {requiredCount} sự kiện</span> mới qua được!
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="relative flex-1 flex flex-col min-h-0 max-w-5xl mx-auto w-full py-1 overflow-hidden">
        {CURRENT_ROUND === 2 ? (
          /* ROUND 2 TOP 5 CARDS DISPLAY */
          <div className="flex flex-col min-h-0 h-full overflow-y-auto custom-scrollbar p-1">
            <div className="mb-3 p-3 rounded-2xl bg-black/60 border border-amber-400/50 backdrop-blur-md text-amber-200 text-center text-xs sm:text-sm font-bold font-serif-display shrink-0">
              🎬 Top 5 Sự Kiện Xuất Sắc Nhất Vòng 1 — Vui lòng chọn đúng 2 sự kiện ({selectedList.length}/{requiredCount})
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 my-auto">
              {TOP_5_BEST_EVENTS.map((candidate) => {
                const isSelected = selectedList.includes(candidate.id) || selectedList.includes(candidate.name);

                return (
                  <div
                    key={candidate.id}
                    onClick={() => handleSelect(candidate.id)}
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
                      <h3 className={`font-serif-display text-xs sm:text-sm font-black leading-snug line-clamp-2 ${isSelected ? 'text-gray-950' : 'text-amber-200'}`}>
                        {candidate.name}
                      </h3>
                      {candidate.tag && (
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[0.65rem] font-bold ${isSelected ? 'bg-black/30 text-amber-200' : 'bg-amber-400/20 text-amber-300'}`}>
                          {candidate.tag}
                        </span>
                      )}
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
            {/* Currently Selected Pills Bar */}
            <div className="max-w-5xl mx-auto w-full mb-2 p-2.5 sm:p-3 rounded-2xl bg-black/70 border-2 border-amber-400/60 backdrop-blur-md text-white shadow-xl shrink-0">
              <div className="text-[0.65rem] sm:text-xs text-amber-300 font-bold uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Danh sách sự kiện Best Event đã chọn ({selectedList.length}/{requiredCount}):</span>
                {!isComplete && <span className="text-amber-200 italic animate-pulse">Vui lòng chọn thêm {requiredCount - selectedList.length} sự kiện</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: requiredCount }).map((_, idx) => {
                  const selectedId = selectedList[idx];
                  const eventObj = selectedId ? BEST_EVENTS.find(e => e.id === selectedId || e.name === selectedId) : null;

                  return eventObj ? (
                    <div
                      key={eventObj.id}
                      className="px-3 py-1.5 rounded-full bg-amber-400 text-black font-bold font-serif-display text-xs sm:text-sm flex items-center gap-2 shadow-md animate-fade-in"
                    >
                      <span className="w-5 h-5 rounded-full bg-black text-amber-300 text-[0.65rem] flex items-center justify-center font-black">
                        #{idx + 1}
                      </span>
                      <span className="max-w-[200px] truncate">{eventObj.name}</span>
                      <button
                        type="button"
                        onClick={() => handleSelect(eventObj.id)}
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
                      <span>Chưa chọn sự kiện #{idx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Grid of Events */}
            <div className="relative flex-1 min-h-0 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 custom-scrollbar">
              {BEST_EVENTS.map((evt) => {
                const isSelected = selectedList.includes(evt.id) || selectedList.includes(evt.name);

                return (
                  <div
                    key={evt.id}
                    onClick={() => handleSelect(evt.id)}
                    className={`p-3.5 sm:p-4 rounded-2xl font-serif-display transition-all duration-200 flex flex-col justify-between cursor-pointer border text-left relative overflow-hidden group ${isSelected
                        ? 'bg-amber-400 border-amber-300 text-gray-950 font-black shadow-[0_0_24px_rgba(251,191,36,0.85)] scale-[1.02]'
                        : 'bg-black/55 hover:bg-amber-950/60 border-amber-300/40 text-white hover:scale-[1.01]'
                      }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-2xl">{evt.icon}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[0.65rem] font-bold ${isSelected ? 'bg-black/20 text-gray-950' : 'bg-amber-400/20 text-amber-300'}`}>
                          {evt.tag}
                        </span>
                      </div>
                      <h3 className={`text-sm sm:text-base font-bold leading-snug mb-1.5 ${isSelected ? 'text-gray-950' : 'text-amber-200'}`}>
                        {evt.name}
                      </h3>
                      <p className={`text-xs leading-relaxed ${isSelected ? 'text-gray-900 font-medium' : 'text-white/70'}`}>
                        {evt.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-gray-950' : 'text-amber-300'}`}>
                        {isSelected ? '✓ Đã chọn' : 'Bình chọn ngay'}
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-gray-950 text-amber-300 flex items-center justify-center font-bold text-xs">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
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
            if (selectedList.length < requiredCount) {
              soundFx.playClick();
              alert(`Yêu cầu phải vote đủ ${requiredCount} sự kiện mới qua được! (Hiện tại bạn mới chọn ${selectedList.length}/${requiredCount} sự kiện)`);
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
          Next ({selectedList.length}/{requiredCount})
        </button>
      </div>

      {/* Extra Bottom Scroll Space */}
      <div className="w-full h-48 sm:h-64 shrink-0 pointer-events-none" />
    </div>
  );
};
