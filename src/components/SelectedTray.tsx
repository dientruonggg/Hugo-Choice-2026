import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export interface SelectedTrayItem {
  id: string;
  name: string;
  subLabel?: string;
}

interface SelectedTrayProps {
  title: string; // e.g. "Selected Candidates", "Selected Rookies"
  items: (SelectedTrayItem | null)[];
  maxItems?: number; // Default 3
  onRemove?: (item: SelectedTrayItem, index: number) => void;
  onSlotClick?: (index: number) => void;
  activeSlotIndex?: number;
  customStatusText?: string;
}

export const SelectedTray: React.FC<SelectedTrayProps> = ({
  title,
  items,
  maxItems = 3,
  onRemove,
  onSlotClick,
  activeSlotIndex,
  customStatusText
}) => {
  const filledCount = items.filter(Boolean).length;
  const isComplete = filledCount >= maxItems;

  const slots = Array.from({ length: maxItems }, (_, idx) => items[idx] || null);

  return (
    <div className="mt-1.5 p-3.5 sm:p-4 rounded-2xl bg-white/20 hover:bg-white/25 backdrop-blur-2xl border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.22)] text-slate-900 shrink-0 transition-all duration-300 select-none">
      {/* Tray Header */}
      <div className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5] drop-shadow-sm" />
          <span className="font-extrabold tracking-wider drop-shadow-xs">
            {title}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[11px] font-black tracking-tight shadow-sm">
            {filledCount}/{maxItems}
          </span>
        </div>
        {!isComplete && (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/35 text-amber-950 font-extrabold text-[11px] backdrop-blur-md animate-pulse">
            {customStatusText || `Select ${maxItems - filledCount} more`}
          </span>
        )}
      </div>

      {/* Grid of Slots */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {slots.map((item, idx) => {
          const isActive = activeSlotIndex === idx;

          return item ? (
            <div
              key={item.id || idx}
              onClick={() => onSlotClick?.(idx)}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-between transition-all duration-200 shadow-md backdrop-blur-md border border-white/40 group ${
                onSlotClick ? 'cursor-pointer' : ''
              } ${
                isActive
                  ? 'bg-amber-400 border-amber-300 text-slate-950 font-black shadow-[0_0_20px_rgba(251,191,36,0.5)] scale-[1.02]'
                  : 'bg-white/70 text-slate-900 hover:bg-white/80'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate min-w-0">
                <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full text-xs flex items-center justify-center font-black shrink-0 transition-transform group-hover:scale-105 ${
                  isActive
                    ? 'bg-slate-950 text-amber-300'
                    : 'bg-slate-950 text-amber-300 shadow-sm'
                }`}>
                  {idx + 1}
                </span>
                <span className="truncate tracking-tight font-bold">
                  {item.subLabel ? `${item.subLabel} ${item.name}` : item.name}
                </span>
              </div>
              {onRemove && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item, idx);
                  }}
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black cursor-pointer ml-2 shrink-0 transition-all ${
                    isActive
                      ? 'bg-slate-950/20 hover:bg-slate-950 text-slate-950 hover:text-white'
                      : 'bg-slate-950/10 hover:bg-rose-600 text-slate-700 hover:text-white'
                  }`}
                  title="Remove item"
                >
                  ×
                </button>
              )}
            </div>
          ) : (
            <div
              key={idx}
              onClick={() => onSlotClick?.(idx)}
              className={`px-3.5 py-2.5 rounded-xl border-2 border-dashed text-xs font-bold flex items-center gap-2.5 transition-all backdrop-blur-md ${
                onSlotClick ? 'cursor-pointer' : ''
              } ${
                isActive
                  ? 'bg-amber-300/35 border-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50'
                  : 'bg-white/20 hover:bg-white/30 border-white/50 text-slate-800/80 shadow-sm'
              }`}
            >
              <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full text-xs flex items-center justify-center shrink-0 font-extrabold ${
                isActive ? 'bg-slate-950 text-amber-300' : 'bg-white/40 border border-white/60 text-slate-800'
              }`}>
                {idx + 1}
              </span>
              <span className="italic font-semibold tracking-tight opacity-90">
                Slot #{idx + 1} empty
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
