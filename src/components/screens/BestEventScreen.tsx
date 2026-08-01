import React from 'react';
import { BEST_EVENTS } from '../../data/mockData';
import { soundFx } from '../../utils/soundEffects';
import { ButterflyParticle } from '../ButterflyParticle';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

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

  const handleSelect = (id: string) => {
    soundFx.playSelect();
    if (selectedList.includes(id)) {
      onSelectEvents(selectedList.filter(eId => eId !== id));
    } else {
      if (selectedList.length >= 3) {
        alert('Bạn chỉ được chọn tối đa 3 sự kiện cho hạng mục Best Event! Vui lòng bỏ chọn 1 sự kiện trước nếu muốn thay đổi.');
        return;
      }
      onSelectEvents([...selectedList, id]);
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
              alert(`Yêu cầu phải vote đủ 3 sự kiện mới qua được! (Hiện tại bạn mới chọn ${selectedList.length}/3 sự kiện)`);
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
          <span>⏱️ VÒNG 1 (01/08 - 03/08)</span>
          <span className="opacity-50">•</span>
          <span>VÒNG 2 (05/08 - 09/08)</span>
          <span className="opacity-50">•</span>
          <span>BẮT BUỘC CHỌN ĐỦ 3 SỰ KIỆN</span>
        </div>
        <h2 className="font-serif-display text-2xl sm:text-4xl md:text-5xl font-black tracking-wider text-white text-stroke-gold drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] uppercase">
          THE BEST EVENT
        </h2>
        <p className="font-serif-display text-[0.7rem] sm:text-sm text-amber-300 font-bold mt-0.5 max-w-2xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
          🎗 Tôn vinh sự kiện hoặc chuỗi hoạt động có quy mô & sức ảnh hưởng lớn nhất • <span className="text-white underline">Yêu cầu chọn đủ 3 sự kiện</span> mới qua được!
        </p>
      </div>

      {/* Currently Selected 3 Events Pills Bar */}
      <div className="max-w-5xl mx-auto w-full mb-2 p-2.5 sm:p-3 rounded-2xl bg-black/70 border-2 border-amber-400/60 backdrop-blur-md text-white shadow-xl shrink-0">
        <div className="text-[0.65rem] sm:text-xs text-amber-300 font-bold uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Danh sách 3 sự kiện Best Event đã chọn ({selectedList.length}/3):</span>
          {!isComplete && <span className="text-amber-200 italic animate-pulse">Vui lòng chọn thêm {3 - selectedList.length} sự kiện</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2].map((idx) => {
            const selectedId = selectedList[idx];
            const eventObj = selectedId ? BEST_EVENTS.find(e => e.id === selectedId || e.name === selectedId) : null;

            return eventObj ? (
              <div
                key={eventObj.id}
                className="px-3 py-1.5 rounded-full bg-amber-400 text-black font-bold font-serif-display text-xs sm:text-sm flex items-center gap-2 shadow-md animate-fade-in truncate max-w-xs"
              >
                <span className="w-5 h-5 rounded-full bg-black text-amber-300 text-[0.65rem] flex items-center justify-center font-black shrink-0">
                  #{idx + 1}
                </span>
                <span className="truncate">{eventObj.icon} {eventObj.name}</span>
                <button
                  type="button"
                  onClick={() => handleSelect(eventObj.id)}
                  className="w-4 h-4 rounded-full bg-black/30 hover:bg-black/70 text-white flex items-center justify-center text-xs font-bold cursor-pointer shrink-0"
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

      {/* Main Interactive Wooden Signboards Multi-Column Grid */}
      <div className="relative flex-1 min-h-0 overflow-y-auto pr-1 w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 py-2 custom-scrollbar">
        {BEST_EVENTS.map((event) => {
          const isSelected = selectedList.includes(event.id);

          return (
            <button
              key={event.id}
              onClick={() => handleSelect(event.id)}
              className={`w-full p-3.5 rounded-2xl wood-button transition-all duration-300 flex flex-col justify-between cursor-pointer relative text-left ${isSelected
                  ? 'ring-4 ring-amber-300 scale-102 shadow-[0_0_40px_rgba(251,191,36,0.6)]'
                  : 'hover:scale-[1.01]'
                }`}
            >
              <div className="flex items-center space-x-3 mb-2 overflow-hidden">
                <span className="text-2xl sm:text-3xl drop-shadow">{event.icon}</span>
                <div className="text-left overflow-hidden pr-6">
                  <span className="font-serif-display font-extrabold text-xs sm:text-sm text-amber-100 uppercase tracking-wide block truncate">
                    {event.name}
                  </span>
                  {event.tag && (
                    <span className="font-sans-clean text-[0.65rem] font-bold text-amber-300 tracking-wider uppercase block">
                      {event.tag}
                    </span>
                  )}
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 w-6.5 h-6.5 rounded-full bg-amber-400 text-black flex items-center justify-center shrink-0 shadow-lg font-bold text-xs">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Navigation Controls */}
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
              alert(`Yêu cầu phải vote đủ 3 sự kiện mới qua được! (Hiện tại bạn mới chọn ${selectedList.length}/3 sự kiện)`);
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
