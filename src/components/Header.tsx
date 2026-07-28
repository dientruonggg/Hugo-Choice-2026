import React from 'react';
import { ScreenStep, VotingState } from '../types';
import { soundFx } from '../utils/soundEffects';
import { Volume2, VolumeX, Vote, BarChart2, RotateCcw, Music } from 'lucide-react';

interface HeaderProps {
  currentStep: ScreenStep;
  votingState: VotingState;
  onNavigate: (step: ScreenStep) => void;
  onOpenBallotDrawer: () => void;
  onOpenAdminLeaderboard: () => void;
  onOpenGoogleLogin: () => void;
  onReset: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  votingState,
  onNavigate,
  onOpenBallotDrawer,
  onOpenAdminLeaderboard,
  onOpenGoogleLogin,
  onReset,
  onLogout
}) => {
  const [isMuted, setIsMuted] = React.useState(soundFx.getMuted());
  const [isBgMusicPlaying, setIsBgMusicPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
    if (!muted) soundFx.playClick();
  };

  const handleToggleBgMusic = () => {
    if (audioRef.current) {
      if (isBgMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.error("Audio playback failed", err);
        });
      }
    }
  };

  // Count votes cast
  const votesCount = [
    votingState.selectedTeam,
    votingState.selectedBestMember,
    votingState.selectedBestEvent,
    votingState.selectedRookie,
    votingState.selectedDuo
  ].filter(Boolean).length;

  return (
    <header className="sticky top-2 z-40 flex items-center justify-between w-[96%] max-w-6xl mx-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-transparent bg-opacity-0 transition-all duration-300" data-purpose="site-header">
      {/* Background Audio */}
      <audio 
        ref={audioRef} 
        src="/ambient-bg.mp3" 
        loop 
        autoPlay
        onPlay={() => setIsBgMusicPlaying(true)}
        onPause={() => setIsBgMusicPlaying(false)}
      />
      
      {/* Brand Title & Hugo Logo */}
      <div
        onClick={() => onNavigate('landing')}
        className="flex items-center space-x-3 cursor-pointer group"
        data-purpose="brand-logo"
      >
        {/* Prominent Hugo Logo Icon with Glowing Golden Aura */}
        <div className="relative w-[4.5rem] h-[4.5rem] sm:w-[5.25rem] sm:h-[5.25rem] md:w-24 md:h-24 flex items-center justify-center rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)] group-hover:scale-105 transition-transform duration-300 animate-float-slow overflow-hidden border-2 border-amber-300">
          <img
            src="/assets/logo.png"
            alt="Hugo English Club Logo"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/hugo_award_2024.png';
            }}
            className="w-full h-full object-cover scale-[1.5] bg-white"
          />
        </div>

        <div className="flex flex-col">
          <h1 className="font-cinzel text-base sm:text-xl md:text-2xl font-extrabold tracking-wider text-white text-shadow-elegant drop-shadow-md group-hover:text-amber-300 transition-colors">
            HUGO ENGLISH CLUB
          </h1>
          <p className="font-serif-display italic text-[0.65rem] sm:text-xs text-amber-200/90 tracking-wide hidden sm:block">
            Light up your fire
          </p>
        </div>
      </div>

      {/* Top Right Actions */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Sound FX Toggle */}
        <button
          onClick={handleToggleSound}
          className="p-2 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 text-white/90 hover:text-amber-300 transition-all duration-200 text-xs md:text-sm flex items-center space-x-1"
          title={isMuted ? "Unmute sound" : "Mute sound"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-300" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
        </button>

        {/* BG Music Toggle */}
        <button
          onClick={handleToggleBgMusic}
          className={`relative p-2 rounded-full border transition-all duration-300 text-xs md:text-sm flex items-center justify-center ${
            isBgMusicPlaying 
              ? 'bg-fuchsia-900/40 border-fuchsia-400/60 text-fuchsia-200 hover:bg-fuchsia-800/50 shadow-[0_0_15px_rgba(232,121,249,0.5)]' 
              : 'bg-black/30 hover:bg-black/50 border-white/20 text-white/90 hover:text-fuchsia-300'
          }`}
          title={isBgMusicPlaying ? "Pause ambient vibes 🌸" : "Play chill flower vibes 🌸"}
        >
          {isBgMusicPlaying && (
            <div className="absolute inset-0 rounded-full border border-fuchsia-400 animate-ping opacity-50 pointer-events-none" />
          )}
          <Music className={`w-4 h-4 ${isBgMusicPlaying ? 'text-fuchsia-300 animate-pulse' : 'text-fuchsia-200'}`} />
        </button>

        {/* Live Ballot Summary Drawer Button */}
        {votingState.userName && (
          <button
            onClick={onOpenBallotDrawer}
            className="px-3 py-1.5 rounded-full bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-400/40 text-emerald-100 text-xs md:text-sm font-sans-clean font-medium flex items-center space-x-1.5 shadow-md backdrop-blur-md transition-all duration-200"
            title="View my ballot summary"
          >
            <Vote className="w-4 h-4 text-amber-300" />
            <span className="hidden md:inline">My Ballot</span>
            <span className="bg-amber-400 text-black text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full">
              {votesCount}/5
            </span>
          </button>
        )}

        {/* Live Results Leaderboard Button */}
        <button
          onClick={onOpenAdminLeaderboard}
          className="px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 text-xs md:text-sm font-sans-clean font-medium flex items-center space-x-1 shadow-md backdrop-blur-md transition-all duration-200"
          title="View Live Leaderboard"
        >
          <BarChart2 className="w-4 h-4 text-amber-300" />
          <span className="hidden md:inline">Live Stats</span>
        </button>

        {/* Google Authentication Button with Butterfly & Golden Ripple Wave */}
        {!votingState.userName ? (
          <div className="relative group">
            {/* Radiating Golden Wave Ripple Ring */}
            <div className="absolute -inset-1 rounded-full border-2 border-amber-300/80 animate-ping pointer-events-none opacity-75" />
            <div className="absolute -inset-2 rounded-full border border-amber-400/40 animate-pulse pointer-events-none opacity-60" />

            {/* Diagonal Butterfly resting on Log in Button */}
            <div className="absolute -top-5 -left-4 z-30 animate-float-slow pointer-events-none">
              <img
                src="/assets/butterfly.png"
                alt="Butterfly on Login"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-[0_0_10px_rgba(251,191,36,0.9)] animate-flutter -rotate-12"
              />
            </div>

            <button
              id="header-login-button"
              onClick={() => {
                soundFx.playClick();
                onOpenGoogleLogin();
              }}
              className="relative px-4 py-2 rounded-full bg-gradient-to-r from-amber-300 via-amber-200 to-white hover:from-amber-400 hover:to-amber-100 text-gray-950 font-sans-clean font-black text-xs md:text-sm tracking-wider shadow-[0_0_20px_rgba(251,191,36,0.7)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center space-x-2 cursor-pointer border-2 border-amber-400"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                />
              </svg>
              <span className="font-extrabold uppercase">Log in</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            {votingState.userAvatar && (
              <img
                src={votingState.userAvatar}
                alt={votingState.userName}
                className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-amber-400/80 object-cover shadow-sm"
              />
            )}
            <span 
              className="font-sans-clean text-xs md:text-sm font-bold text-amber-200 truncate max-w-[90px] sm:max-w-[140px]"
              title={votingState.userEmail || votingState.userName}
            >
              {votingState.userName}
            </span>
            <button
              onClick={() => {
                soundFx.playClick();
                if (confirm("Log out of your account?")) {
                  if (onLogout) {
                    onLogout();
                  } else {
                    onReset();
                  }
                }
              }}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-red-500/20 text-white/90 hover:text-red-300 font-sans-clean text-[0.7rem] md:text-xs transition-all border border-white/20"
              title="Log out"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
