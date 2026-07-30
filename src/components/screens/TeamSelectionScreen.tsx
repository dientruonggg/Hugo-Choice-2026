import React, { useState } from 'react';
import { HugoTeam, TeamMoment } from '../../types';
import { TEAMS } from '../../data/mockData';
import { soundFx } from '../../utils/soundEffects';
import { getStoredMoments, addTeamMoment, toggleLikeMoment } from '../../utils/momentsStorage';
import { ButterflyParticle } from '../ButterflyParticle';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Heart, Sparkles, CheckCircle2, X, Camera, Maximize2, Image as ImageIcon, Tag, User, ChevronDown } from 'lucide-react';

interface TeamSelectionScreenProps {
  selectedTeam: HugoTeam | null;
  onSelectTeam: (team: HugoTeam) => void;
  onBack: () => void;
  onNext: () => void;
}

export const TeamSelectionScreen: React.FC<TeamSelectionScreenProps> = ({
  selectedTeam,
  onSelectTeam,
  onBack,
  onNext
}) => {
  // Currently displayed team in the showcase panel
  const [activeTeamId, setActiveTeamId] = useState<HugoTeam>(selectedTeam || 'prs');
  const [moments, setMoments] = useState<TeamMoment[]>(() => getStoredMoments());
  const [showDetailOnMobile, setShowDetailOnMobile] = useState(false);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [lightboxMoment, setLightboxMoment] = useState<TeamMoment | null>(null);

  // Form states for adding moment
  const [newCaption, setNewCaption] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newTag, setNewTag] = useState('');

  const currentTeamObj = TEAMS.find(t => t.id === activeTeamId) || TEAMS[0];
  const activeMoments = moments.filter(m => m.teamId === activeTeamId);

  const handleSelectTeamForVote = (teamId: HugoTeam) => {
    soundFx.playSelect();
    onSelectTeam(teamId);
    setActiveTeamId(teamId);
  };

  const handleViewTeam = (teamId: HugoTeam) => {
    soundFx.playClick();
    setActiveTeamId(teamId);
  };

  const handleLike = (momentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick();
    const updated = toggleLikeMoment(momentId);
    setMoments(updated);
  };

  const handleAddMomentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaption.trim()) {
      alert('Vui lòng nhập caption / cảm nghĩ cho khoảnh khắc này');
      return;
    }

    addTeamMoment({
      teamId: activeTeamId,
      imageUrl: '',
      caption: newCaption.trim(),
      author: newAuthor.trim() || 'Thành viên Hugo',
      date: 'Vừa xong',
      tag: newTag.trim() || 'Khoảnh khắc Team'
    });

    soundFx.playSelect();
    setMoments(getStoredMoments());
    setIsAddModalOpen(false);
    setNewCaption('');
    setNewAuthor('');
    setNewTag('');
  };

  return (
    <div className="relative flex-1 flex flex-col items-center justify-between w-full h-full min-h-0 py-2 sm:py-3 px-3 sm:px-6 overflow-hidden">
      {/* Top Header - Compact for Mobile */}
      <div className="text-center shrink-0 mb-1.5 sm:mb-3">
        <h2 className="font-cinzel text-xl sm:text-4xl md:text-5xl font-extrabold tracking-wider text-white text-stroke-gold drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] uppercase leading-tight">
          TEAM SHOWCASE
        </h2>
        <p className="font-serif-display text-amber-200/90 text-[0.65rem] sm:text-xs italic mt-0.5">
          Khám phá những khoảnh khắc rực rỡ & Bình chọn Đội yêu thích của bạn
        </p>
      </div>

      {/* MOBILE ONLY (< lg): Ultra Compact 2x2 Grid Layout */}
      <div className="w-full max-w-2xl lg:hidden flex-1 flex flex-col justify-center min-h-0 my-auto py-1 space-y-3">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {TEAMS.map((team) => {
            const isVoted = selectedTeam === team.id;
            const imgSrc = team.activeImage || team.image;

            return (
              <div
                key={team.id}
                onClick={() => {
                  handleSelectTeamForVote(team.id);
                }}
                className={`relative p-3 rounded-2xl cursor-pointer transition-all duration-300 border flex flex-col items-center text-center justify-between select-none touch-manipulation active:scale-95 shadow-lg ${
                  isVoted
                    ? 'bg-gradient-to-br from-amber-950/80 via-black/80 to-amber-900/60 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)] scale-[1.02]'
                    : 'bg-black/50 hover:bg-black/70 border-white/20'
                }`}
              >
                {/* Floating Butterfly Badge */}
                {isVoted && (
                  <div className="absolute -top-2 -right-2 z-20 pointer-events-none">
                    <ButterflyParticle type="hope" size={32} />
                  </div>
                )}

                {/* Team Icon */}
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center p-1.5 overflow-hidden mb-1.5"
                  style={{ backgroundColor: `${team.color}25` }}
                >
                  {imgSrc ? (
                    <img src={imgSrc} alt={team.name} className="w-full h-full object-contain drop-shadow" />
                  ) : (
                    <span className="text-2xl">{team.icon}</span>
                  )}
                </div>

                <h3 className="font-serif-display font-bold text-xs sm:text-sm text-white truncate w-full mb-1">
                  {team.name}
                </h3>

                {/* Vote Action Pill */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTeamForVote(team.id);
                  }}
                  className={`w-full py-1 px-2 rounded-xl text-[0.7rem] font-bold font-serif-display transition-all border flex items-center justify-center space-x-1 cursor-pointer ${
                    isVoted
                      ? 'bg-gradient-to-r from-amber-400 to-amber-200 text-gray-950 border-amber-300 shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-amber-200 border-white/20'
                  }`}
                >
                  {isVoted ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-gray-950" />
                      <span>Đã chọn</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>Bình chọn</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Toggle details on mobile */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowDetailOnMobile(!showDetailOnMobile)}
            className="text-[0.7rem] text-amber-200/80 hover:text-amber-100 font-serif-display underline flex items-center justify-center gap-1 mx-auto py-1"
          >
            <span>{showDetailOnMobile ? 'Thu gọn chi tiết' : 'Xem thêm giới thiệu các đội'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDetailOnMobile ? 'rotate-180' : ''}`} />
          </button>

          {showDetailOnMobile && (
            <div className="mt-2 p-3 rounded-2xl bg-black/60 border border-white/20 text-xs text-amber-100 font-serif-display text-left space-y-2 max-h-48 overflow-y-auto">
              <p className="italic text-amber-200 font-bold">"{currentTeamObj.name}: {currentTeamObj.description}"</p>
              <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                <span>Khoảnh khắc ({activeMoments.length})</span>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-200 border border-amber-400/30 text-[0.65rem] font-bold"
                >
                  + Đăng khoảnh khắc
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP ONLY (>= lg): Full Showcase Split View */}
      <div className="hidden lg:flex relative flex-1 w-full max-w-6xl flex-row gap-4 min-h-0 overflow-hidden my-auto">
        {/* LEFT COLUMN: Team Selection Cards */}
        <div className="w-80 shrink-0 flex flex-col gap-3 overflow-y-auto max-h-full pr-1 scrollbar-thin">
          {TEAMS.map((team) => {
            const isVoted = selectedTeam === team.id;
            const isActiveView = activeTeamId === team.id;
            const imgSrc = isActiveView || isVoted ? (team.activeImage || team.image) : team.image;

            return (
              <motion.div
                key={team.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleViewTeam(team.id)}
                className={`relative p-3.5 rounded-2xl cursor-pointer transition-all duration-300 border flex items-center gap-3 shrink-0 ${
                  isActiveView
                    ? 'bg-gradient-to-r from-amber-950/70 to-black/70 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.3)] scale-[1.02]'
                    : isVoted
                    ? 'bg-emerald-950/40 border-emerald-400/60 hover:bg-black/50'
                    : 'bg-black/40 hover:bg-white/10 border-white/20'
                }`}
                style={{ borderColor: isActiveView ? team.color : undefined }}
              >
                {isVoted && (
                  <div className="absolute -top-3 -right-2 z-20 pointer-events-none">
                    <ButterflyParticle type="hope" size={36} />
                  </div>
                )}

                <div
                  className={`relative w-14 h-14 rounded-xl flex items-center justify-center p-1.5 overflow-hidden transition-transform ${
                    isActiveView ? 'scale-110' : ''
                  }`}
                  style={{
                    backgroundColor: `${team.color}25`,
                    boxShadow: isActiveView ? `0 0 20px ${team.glow}` : undefined
                  }}
                >
                  {imgSrc ? (
                    <img src={imgSrc} alt={team.name} className="w-full h-full object-contain drop-shadow" />
                  ) : (
                    <span className="text-2xl">{team.icon}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <h3 className={`font-serif-display font-bold text-base truncate ${isActiveView ? 'text-amber-200' : 'text-white'}`}>
                    {team.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-1">
                    {isVoted ? (
                      <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                        <CheckCircle2 className="w-3 h-3" /> Đã chọn
                      </span>
                    ) : isActiveView ? (
                      <span className="inline-flex items-center gap-1 text-[0.65rem] font-medium px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30">
                        <Sparkles className="w-3 h-3" /> Đang xem
                      </span>
                    ) : (
                      <span className="text-[0.65rem] text-white/50 truncate">Xem chi tiết</span>
                    )}
                  </div>
                </div>

                {!isVoted && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTeamForVote(team.id);
                    }}
                    className="px-3 py-1.5 text-xs font-serif-display font-semibold rounded-lg bg-amber-400/20 hover:bg-amber-400 text-amber-200 hover:text-black border border-amber-300/40 transition-all shrink-0 cursor-pointer"
                  >
                    Chọn
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Team Showcase Card */}
        <div className="flex-1 flex flex-col w-full h-full min-h-0 bg-black/40 backdrop-blur-md rounded-3xl border border-amber-300/30 p-5 overflow-y-auto scrollbar-thin">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTeamObj.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4"
            >
              <div 
                className="relative rounded-2xl p-6 overflow-hidden border border-white/20 flex flex-row items-center gap-5 justify-between"
                style={{ background: `linear-gradient(135deg, ${currentTeamObj.color}30 0%, rgba(0,0,0,0.7) 100%)` }}
              >
                <div 
                  className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-50"
                  style={{ backgroundColor: currentTeamObj.color }}
                />

                <div className="relative w-44 h-44 shrink-0 flex items-center justify-center p-2 rounded-2xl bg-black/30 border border-white/20 shadow-2xl">
                  {currentTeamObj.heroLogo ? (
                    <img
                      src={currentTeamObj.heroLogo}
                      alt={currentTeamObj.name}
                      className="w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)] hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <img
                      src={currentTeamObj.activeImage || currentTeamObj.image}
                      alt={currentTeamObj.name}
                      className="w-full h-full object-contain drop-shadow"
                    />
                  )}
                </div>

                <div className="flex-1 text-left z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{currentTeamObj.icon}</span>
                    <h3 className="font-cinzel text-3xl font-extrabold text-white tracking-wide text-shadow">
                      {currentTeamObj.name}
                    </h3>
                  </div>

                  <p className="font-serif-display text-amber-200 italic text-base mt-2 max-w-xl">
                    "{currentTeamObj.description}"
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    {selectedTeam === currentTeamObj.id ? (
                      <div className="px-4 py-2 rounded-full bg-emerald-500/30 border border-emerald-400 text-emerald-200 font-serif-display text-sm font-bold flex items-center gap-2 shadow-md">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ĐÃ BÌNH CHỌN CHO TEAM NÀY
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSelectTeamForVote(currentTeamObj.id)}
                        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 hover:from-amber-300 hover:to-white text-gray-950 font-serif-display font-extrabold text-base shadow-[0_0_20px_rgba(251,191,36,0.6)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-5 h-5 text-amber-900" />
                        Bình Chọn Team {currentTeamObj.name}
                      </button>
                    )}

                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-serif-display text-sm flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-amber-300" />
                      Thêm khoảnh khắc
                    </button>
                  </div>
                </div>
              </div>

              {/* MOMENTS GALLERY */}
              <div className="mt-2">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-amber-300" />
                    <h4 className="font-serif-display font-bold text-lg text-white">
                      Khoảnh Khắc Đáng Nhớ ({activeMoments.length})
                    </h4>
                  </div>
                </div>

                {activeMoments.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-black/20 border border-dashed border-white/20 text-center flex flex-col items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-white/30 mb-2" />
                    <p className="font-serif-display text-white/70 text-sm">
                      Chưa có khoảnh khắc nào được chia sẻ cho Team {currentTeamObj.name}.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
                    {activeMoments.map((moment) => (
                      <motion.div
                        key={moment.id}
                        whileHover={{ y: -4 }}
                        onClick={() => setLightboxMoment(moment)}
                        className="group relative bg-black/50 backdrop-blur-sm border border-white/20 hover:border-amber-400/70 rounded-2xl overflow-hidden cursor-pointer flex flex-col transition-all duration-300 shadow-lg p-3"
                      >
                        <p className="font-serif-display text-sm text-gray-100 italic">
                          "{moment.caption}"
                        </p>
                        <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                          <span className="flex items-center gap-1 text-amber-100">
                            <User className="w-3 h-3 text-amber-300" />
                            {moment.author}
                          </span>
                          <button
                            onClick={(e) => handleLike(moment.id, e)}
                            className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-pink-500/20 text-pink-300 border border-pink-400/30 flex items-center gap-1"
                          >
                            <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                            <span className="font-bold">{moment.likes}</span>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Navigation Controls - Positioned at 2/3 of screen height */}
      <div className="w-full max-w-6xl flex justify-between items-center pt-3 sm:pt-4 pb-4 sm:pb-8 mb-[22vh] sm:mb-6 border-t border-amber-300/30 shrink-0 px-4 sm:px-8">
        <button
          onClick={() => {
            soundFx.playClick();
            onBack();
          }}
          className="px-6 py-2 sm:px-9 sm:py-2.5 min-w-[95px] sm:min-w-[130px] rounded-full bg-black/60 hover:bg-black/80 border-2 border-white/90 text-white font-serif-display text-base sm:text-xl transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:scale-105 active:scale-95 select-none touch-manipulation cursor-pointer"
        >
          Back
        </button>

        <button
          onClick={() => {
            if (!selectedTeam) {
              soundFx.playClick();
              alert('Vui lòng chọn 1 Team để tiếp tục!');
              return;
            }
            soundFx.playSelect();
            onNext();
          }}
          className={`px-6 py-2 sm:px-9 sm:py-2.5 min-w-[95px] sm:min-w-[130px] rounded-full border-2 border-white/90 font-serif-display text-base sm:text-xl transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)] active:scale-95 select-none touch-manipulation cursor-pointer ${
            selectedTeam
              ? 'bg-gradient-to-r from-amber-300 via-amber-200 to-white hover:scale-105 text-gray-950 font-bold'
              : 'bg-white/40 text-gray-800 opacity-60'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};
