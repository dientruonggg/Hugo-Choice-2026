import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { VotingState, ScreenStep } from '../../types';
import { soundFx } from '../../utils/soundEffects';
import { ButterflyParticle } from '../ButterflyParticle';
import { Check, Sparkles, Award, RotateCcw, Share2, Printer, Vote, Download, Mail } from 'lucide-react';
import { TEAMS, BEST_MEMBER_CANDIDATES, BEST_EVENTS, ROOKIE_CANDIDATES, PERFECT_DUOS } from '../../data/mockData';
import { sendBallotEmailAuto } from '../../utils/emailService';

interface SubmissionScreenProps {
  votingState: VotingState;
  onSubmitBallot: () => void;
  onNavigate: (step: ScreenStep) => void;
  onReset: () => void;
  onOpenLeaderboard: () => void;
}

export const SubmissionScreen: React.FC<SubmissionScreenProps> = ({
  votingState,
  onSubmitBallot,
  onNavigate,
  onReset,
  onOpenLeaderboard
}) => {
  const [showReceiptModal, setShowReceiptModal] = useState(votingState.isSubmitted);
  const [isDownloading, setIsDownloading] = useState(false);
  const [emailNotice, setEmailNotice] = useState<string | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const teamObj = TEAMS.find(t => t.id === votingState.selectedTeam);
  const memberObj = BEST_MEMBER_CANDIDATES.find(m => m.id === votingState.selectedBestMember);
  const eventObj = BEST_EVENTS.find(e => e.id === votingState.selectedBestEvent);
  const rookieObj = ROOKIE_CANDIDATES.find(r => r.id === votingState.selectedRookie);
  const duoObj = PERFECT_DUOS.find(d => d.id === votingState.selectedDuo);

  const handleDownloadPNG = async () => {
    if (!receiptRef.current) return;
    soundFx.playClick();
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#111e14',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const filenameStr = (votingState.userEmail || votingState.userName || 'anonymous')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_');
      link.download = `hugo-award-2026-ballot-${filenameStr}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download receipt PNG', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSendEmail = () => {
    soundFx.playClick();

    const targetEmail = votingState.userEmail || '';
    const subject = `[Hugo Award 2026] Official Voting Ballot - ${votingState.userName || 'Member'}`;

    const bodyText = `HỘI ĐỒNG BÌNH CHỌN HUGO AWARD 2026
---------------------------------------------
XÁC NHẬN PHIẾU BÌNH CHỌN CHÍNH THỨC

• Người bình chọn: ${votingState.userName || 'Anonymous'}
• Gmail / Email: ${votingState.userEmail || 'Chưa cung cấp'}
• Thời gian nộp: ${votingState.submittedAt ? new Date(votingState.submittedAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN')}

CHI TIẾT PHIẾU BÌNH CHỌN:
1. Nature Team: ${teamObj ? `${teamObj.icon} ${teamObj.name}` : 'N/A'}
2. Nature Best Member: ${memberObj ? memberObj.name : 'N/A'}
3. Nature Best Event: ${eventObj ? `${eventObj.icon} ${eventObj.name}` : 'N/A'}
4. The Rookie Award: ${rookieObj ? rookieObj.name : 'N/A'}
5. The Perfect Duo: ${duoObj ? duoObj.name : 'N/A'}

---------------------------------------------
Cảm ơn bạn đã tham gia bình chọn tại Hugo Award 2026!
Hugo English Club`;

    const mailtoUrl = `mailto:${encodeURIComponent(targetEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

    try {
      navigator.clipboard.writeText(bodyText);
    } catch {
      // Clipboard write fallback
    }

    window.open(mailtoUrl, '_blank');

    setEmailNotice('✉️ Đã mở Email và sao chép nội dung phiếu bình chọn!');
    setTimeout(() => setEmailNotice(null), 5000);
  };

  const handleSubmit = async () => {
    soundFx.playFanfare();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    onSubmitBallot();
    setShowReceiptModal(true);

    // Auto send email upon submission
    if (votingState.userEmail) {
      const res = await sendBallotEmailAuto(votingState);
      if (res.message) {
        setEmailNotice(res.message);
      }
    } else {
      setEmailNotice('💡 Mẹo: Đăng nhập Google để tự động nhận Email xác nhận!');
    }
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between items-center w-full min-h-[80vh] px-4 py-6 text-center">
      {/* Title Header matching Image 7 */}
      <div className="my-auto z-20">
        <h2 
          className="font-script text-5xl sm:text-7xl md:text-8xl text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)] select-none"
          style={{ textShadow: '0 4px 20px rgba(0, 0, 0, 0.95), 0 8px 35px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.5)' }}
        >
          The Journey Ends Here
        </h2>
      </div>

      {/* Radiant Glowing Butterfly Centerpiece matching Image 7 */}
      <div className="relative my-auto flex flex-col items-center justify-center z-20 py-4">
        {/* Particle Glow Aura */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-300/30 via-white/40 to-amber-300/30 blur-3xl animate-pulse" />

        <div className="relative z-10 animate-float-slow my-4 scale-125 sm:scale-150">
          <ButterflyParticle type="white" size={140} />
        </div>

        {/* Large Glowing Submit Button matching Image 7 */}
        {!votingState.isSubmitted ? (
          <button
            onClick={handleSubmit}
            className="group relative px-12 sm:px-16 py-4 sm:py-5 rounded-full bg-white/90 hover:bg-white text-gray-900 border-2 border-amber-300 font-sora font-extrabold text-3xl sm:text-4xl shadow-[0_0_50px_rgba(255,255,255,0.8)] hover:scale-108 active:scale-95 transition-all duration-300 cursor-pointer flex flex-col items-center"
          >
            <span className="tracking-wide">Submit</span>
            <span className="font-sans-clean font-bold text-xs sm:text-sm text-amber-700 tracking-widest uppercase">
              Hugo Award 2026
            </span>
          </button>
        ) : (
          <button
            onClick={() => {
              soundFx.playClick();
              setShowReceiptModal(true);
            }}
            className="px-10 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-cinzel font-black text-2xl shadow-[0_0_40px_rgba(74,222,128,0.8)] hover:scale-105 transition-all cursor-pointer flex items-center space-x-2"
          >
            <Check className="w-8 h-8 stroke-[3]" />
            <span>Ballot Submitted! (View Receipt)</span>
          </button>
        )}
      </div>

      {/* Bottom Left Star Stats Badge matching Image 7 */}
      <div className="w-full flex justify-between items-end pt-4 border-t border-white/10 z-20">
        <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-amber-300/40 shadow-lg">
          <span className="font-sora font-extrabold text-3xl sm:text-4xl text-amber-300">
            16
          </span>
          <span className="text-2xl sm:text-3xl">⭐</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              soundFx.playClick();
              onNavigate('team_selection');
            }}
            className="px-6 py-2.5 rounded-full border border-white/50 bg-black/30 hover:bg-black/50 text-white font-serif-display text-base transition-all"
          >
            Review Selections
          </button>
        </div>
      </div>

      {/* Ballot Submission Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div ref={receiptRef} className="w-full max-w-lg bg-[#111e14] border-2 border-amber-400/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-white text-left relative overflow-hidden">
            {/* Modal Header */}
            <div className="text-center pb-4 border-b border-white/10">
              <div className="inline-flex p-3 rounded-full bg-amber-400/20 border border-amber-400/50 mb-2">
                <Award className="w-8 h-8 text-amber-300" />
              </div>
              <h2 className="font-cinzel text-xl md:text-3xl font-extrabold text-white tracking-wide">
                Hugo Award 2026
              </h2>
              <p className="font-sans-clean text-xs md:text-sm text-amber-200/90">
                Official Voting Ballot Receipt
              </p>
            </div>

            {/* Voter Info & Ballot Selections */}
            <div className="my-6 space-y-2.5 font-serif-display text-sm sm:text-base">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                <span className="text-amber-300/80">Voter:</span>
                <span className="font-bold text-white">{votingState.userName || 'Anonymous'}</span>
              </div>

              {votingState.userEmail && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                  <span className="text-amber-300/80">Gmail / Email:</span>
                  <span className="font-bold text-amber-200 text-xs sm:text-sm">{votingState.userEmail}</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                <span className="text-amber-300/80">Nature Team:</span>
                <span className="font-bold text-white">{teamObj ? `${teamObj.icon} ${teamObj.name}` : 'N/A'}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                <span className="text-amber-300/80">Best Member:</span>
                <span className="font-bold text-white">{memberObj?.name || 'N/A'}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                <span className="text-amber-300/80">Best Event:</span>
                <span className="font-bold text-white">{eventObj ? `${eventObj.icon} ${eventObj.name}` : 'N/A'}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                <span className="text-amber-300/80">The Rookie:</span>
                <span className="font-bold text-white">{rookieObj?.name || 'N/A'}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                <span className="text-amber-300/80">The Perfect Duo:</span>
                <span className="font-bold text-white">
                  {duoObj ? duoObj.name : 'N/A'}
                </span>
              </div>

              {votingState.submittedAt && (
                <div className="pt-1 text-center text-xs text-amber-300/60 font-sans-clean">
                  Submitted on: {new Date(votingState.submittedAt).toLocaleString()}
                </div>
              )}
            </div>

            {/* Modal Actions - Ignored during HTML2Canvas PNG capture */}
            <div data-html2canvas-ignore="true" className="space-y-3 pt-2">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowReceiptModal(false);
                  onOpenLeaderboard();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-cinzel font-bold text-sm shadow-md hover:from-amber-300 hover:to-amber-400 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Vote className="w-4 h-4" />
                <span>View Live Leaderboard</span>
              </button>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleDownloadPNG}
                  disabled={isDownloading}
                  className="py-2.5 px-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 border border-amber-400/40 font-sans-clean text-xs font-semibold flex items-center justify-center space-x-1 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>{isDownloading ? 'Downloading...' : 'PNG'}</span>
                </button>

                <button
                  onClick={handleSendEmail}
                  className="py-2.5 px-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 border border-amber-400/40 font-sans-clean text-xs font-semibold flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Gửi Email</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setShowReceiptModal(false);
                    onReset();
                  }}
                  className="py-2.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-sans-clean text-xs font-semibold flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>New Ballot</span>
                </button>
              </div>

              {emailNotice && (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs text-center animate-fade-in font-sans-clean">
                  {emailNotice}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
