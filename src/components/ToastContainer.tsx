import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Sparkles, Info, X } from 'lucide-react';
import { ToastDetail, ToastType } from '../utils/toast';
import { soundFx } from '../utils/soundEffects';

interface ToastItem extends ToastDetail {
  id: string;
}

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ToastDetail>;
      if (!customEvent.detail) return;

      const { message, type, duration = 4000 } = customEvent.detail;
      const id = `${Date.now()}-${Math.random()}`;

      // Play soft sound based on type
      if (type === 'success') {
        soundFx.playSelect();
      } else {
        soundFx.playClick();
      }

      setToasts(prev => [...prev, { id, message, type, duration }]);

      // Auto remove
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    };

    window.addEventListener('hugo-toast', handleToastEvent);
    return () => {
      window.removeEventListener('hugo-toast', handleToastEvent);
    };
  }, []);

  const removeToast = (id: string) => {
    soundFx.playClick();
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2.5 w-full max-w-sm px-4 pointer-events-none select-none">
      {toasts.map(toast => {
        const iconMap: Record<ToastType, React.ReactNode> = {
          success: <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 stroke-[2.5]" />,
          error: <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 stroke-[2.5]" />,
          info: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 stroke-[2.5]" />,
          warning: <Info className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 stroke-[2.5]" />
        };

        const borderMap: Record<ToastType, string> = {
          success: 'border-emerald-300/60 bg-emerald-50/70',
          error: 'border-rose-300/60 bg-rose-50/70',
          info: 'border-amber-300/60 bg-amber-50/70',
          warning: 'border-orange-300/60 bg-orange-50/70'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4.5 py-3 rounded-full border shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl text-slate-900 transition-all duration-300 transform scale-100 hover:scale-[1.02] w-full animate-fade-in ${borderMap[toast.type]}`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="shrink-0">{iconMap[toast.type]}</span>
              <p className="font-sans-clean font-bold tracking-tight text-xs sm:text-sm text-slate-800 truncate pr-1">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 w-5 h-5 rounded-full hover:bg-black/10 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
