import React from 'react';
import { ScreenStep } from '../types';
import { soundFx } from '../utils/soundEffects';

interface PaginationFooterProps {
  currentStep: ScreenStep;
  onNavigate: (step: ScreenStep) => void;
}

export const PaginationFooter: React.FC<PaginationFooterProps> = ({
  currentStep,
  onNavigate
}) => {
  const steps: { key: ScreenStep; label: string; stepNum: number }[] = [
    { key: 'best_member', label: 'Best Member', stepNum: 1 },
    { key: 'best_event', label: 'Best Event', stepNum: 2 },
    { key: 'rookie', label: 'Rookie', stepNum: 3 },
    { key: 'perfect_duo', label: 'Perfect Duo', stepNum: 4 }
  ];

  const currentObj = steps.find(s => s.key === currentStep);
  if (!currentObj) return null;

  const currentNum = currentObj.stepNum;

  const handlePageClick = (stepKey: ScreenStep) => {
    soundFx.playClick();
    onNavigate(stepKey);
  };

  return (
    <nav 
      aria-label="Category Navigation"
      className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 shadow-lg select-none"
    >
      {steps.map((step) => {
        const isActive = currentNum === step.stepNum;
        return (
          <button
            key={step.key}
            type="button"
            onClick={() => handlePageClick(step.key)}
            className={`relative flex items-center justify-center rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
              isActive
                ? 'bg-white text-stone-950 px-3 py-1 sm:px-3.5 sm:py-1 shadow-sm font-semibold scale-100'
                : 'text-white/70 hover:text-white hover:bg-white/10 w-7 h-7 sm:w-8 sm:h-8'
            }`}
          >
            <span>{step.stepNum}</span>
            {isActive && (
              <span className="hidden sm:inline ml-1.5 text-[11px] font-medium tracking-tight opacity-95">
                {step.label}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};


