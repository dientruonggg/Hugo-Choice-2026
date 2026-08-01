import React from 'react';
import { soundFx } from '../../utils/soundEffects';
import { ButterflyParticle } from '../ButterflyParticle';

interface ProcessModalScreenProps {
  onProceed: () => void;
}

export const ProcessModalScreen: React.FC<ProcessModalScreenProps> = ({ onProceed }) => {
  const handleProceed = () => {
    soundFx.playSelect();
    onProceed();
  };

  return (
    <div className="relative flex-1 flex items-center justify-center w-full min-h-[80vh] px-4 py-8">
      {/* Decorative Butterflies on Card Edge */}
      <div className="absolute top-12 left-6 md:left-24 z-30 animate-float-slow">
        <ButterflyParticle type="white" size={56} />
      </div>
      <div className="absolute bottom-16 right-6 md:right-24 z-30 animate-float-slow delay-500">
        <ButterflyParticle type="white" size={60} />
      </div>

      {/* Main Glass Process Card */}
      <div className="relative w-full max-w-2xl p-6 sm:p-10 md:p-12 rounded-3xl glass-panel-dark border border-white/40 shadow-2xl flex flex-col items-center text-center text-white z-20 my-auto">

        {/* Title */}
        <h2 className="font-serif-display text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-wider text-white text-shadow-elegant mb-6 sm:mb-8 border-b border-white/20 pb-4 w-full">
          HUGO AWARD 2026 PROCESS
        </h2>

        {/* Content Paragraph 1: Award Categories */}
        <div className="mb-6 space-y-2">
          <h3 className="font-serif-display text-lg sm:text-2xl font-bold text-amber-200">
            Hạng Mục Bình Chọn (Award Categories)
          </h3>
          <p className="font-serif-display text-sm sm:text-lg text-amber-100 font-bold leading-relaxed max-w-xl mx-auto">
            🛡️ Best Team • 🌟 The Best Member • 🎬 The Best Event • 🚀 The Rookie • 🦋 The Perfect Duo
          </p>
        </div>

        {/* Content Paragraph 2: Timeline & Rules */}
        <div className="mb-8 space-y-2">
          <h3 className="font-serif-display text-lg sm:text-2xl font-bold text-amber-200">
            Thể Lệ & Thời Gian (Timeline & Rules)
          </h3>
          <ul className="font-serif-display text-xs sm:text-base text-white/90 leading-relaxed space-y-1.5 text-left max-w-lg mx-auto bg-black/30 p-4 rounded-2xl border border-white/10">
            <li>⏱️ <strong className="text-amber-300">Vòng 1 Bình Chọn:</strong> 01/08 - 03/08/2026</li>
            <li>⏱️ <strong className="text-amber-300">Vòng 2 Bình Chọn:</strong> 05/08 - 09/08/2026</li>
            <li>⏳ <strong className="text-amber-300">Hạn Chót Đóng Phiếu:</strong> 23:59 ngày 09/08/2026</li>
            <li>📌 <strong className="text-amber-300">Quy Định Bình Chọn:</strong> Bắt buộc chọn đủ 3 người / 3 sự kiện / 3 tân binh / 3 cặp duo để nộp phiếu</li>
          </ul>
        </div>

        {/* Green Leaf Button "Got It!" */}
        <button
          onClick={handleProceed}
          className="group relative px-10 py-3.5 rounded-full glass-pill-green font-serif-display font-bold text-lg sm:text-xl text-emerald-950 hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_8px_30px_rgba(74,222,128,0.4)] flex items-center space-x-2"
        >
          <span>Got It!</span>
        </button>
      </div>
    </div>
  );
};
