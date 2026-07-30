import React, { useState } from 'react';
import { HugoTeam, TeamMoment } from '../../types';
import { TEAMS } from '../../data/mockData';
import { soundFx } from '../../utils/soundEffects';
import { getStoredMoments, addTeamMoment, toggleLikeMoment } from '../../utils/momentsStorage';
import { ButterflyParticle } from '../ButterflyParticle';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Heart, Sparkles, CheckCircle2, X, Camera, Maximize2, Image as ImageIcon, Tag, User } from 'lucide-react';

interface TeamSelectionScreenProps {
  selectedTeam: HugoTeam | null;
  onSelectTeam: (team: HugoTeam) => void;
  onBack: () => void;
  onNext: () => void;
}

// Preset photo choices for quick moment creation
const PRESET_MOMENT_PHOTOS = [
  { url: '/assets/profile_image/TheBestEvent/Camping.png', label: 'Camping Emberline' },
  { url: '/assets/profile_image/TheBestEvent/Workshop.png', label: 'Workshop Secrets' },
  { url: '/assets/profile_image/TheBestEvent/angel.png', label: 'Talkshow Sharing' },
  { url: '/assets/profile_image/TheBestEvent/WN.png', label: 'Welcome Newbie' },
  { url: '/assets/profile_image/TheBestEvent/yearinink.png', label: 'Christmas Hour' }
];

export const TeamSelectionScreen: React.FC<TeamSelectionScreenProps> = ({
  selectedTeam,
  onSelectTeam,
  onBack,
  onNext
}) => {
  // Currently displayed team in the showcase panel
  const [activeTeamId, setActiveTeamId] = useState<HugoTeam>(selectedTeam || 'prs');
  const [moments, setMoments] = useState<TeamMoment[]>(() => getStoredMoments());
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [lightboxMoment, setLightboxMoment] = useState<TeamMoment | null>(null);

  // Form states for adding moment
  const [newImageUrl, setNewImageUrl] = useState(PRESET_MOMENT_PHOTOS[0].url);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMomentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaption.trim()) {
      alert('Vui lòng nhập caption / cảm nghĩ cho khoảnh khắc này');
      return;
    }

    const created = addTeamMoment({
      teamId: activeTeamId,
      imageUrl: newImageUrl || PRESET_MOMENT_PHOTOS[0].url,
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
      {/* Top Header */}
      <div className="text-center shrink-0 mb-2 sm:mb-3">
        <h2 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-wider text-white text-stroke-gold drop-shadow-[0_6px_18px_rgba(0,0,0,0.8)] uppercase">
          TEAM SHOWCASE
        </h2>
        <p className="font-serif-display text-amber-200/90 text-xs sm:text-sm italic mt-0.5">
          Khám phá những khoảnh khắc rực rỡ & Bình chọn Đội yêu thích của bạn
        </p>
      </div>

      {/* Main Responsive Split Layout */}
      <div className="relative flex-1 w-full max-w-6xl flex flex-col lg:flex-row gap-4 min-h-0 overflow-hidden my-auto">
        
        {/* LEFT COLUMN: Team Selection Cards (List / Sidebar) */}
        <div className="w-full lg:w-80 shrink-0 flex flex-row lg:flex-col gap-2 sm:gap-3 overflow-x-auto lg:overflow-y-auto max-h-none lg:max-h-full pb-2 lg:pb-0 pr-1 scrollbar-thin">
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
                className={`relative flex-1 lg:flex-none p-3 rounded-2xl cursor-pointer transition-all duration-300 border flex items-center gap-3 shrink-0 min-w-[170px] lg:min-w-0 ${
                  isActiveView
                    ? 'bg-gradient-to-r from-amber-950/70 to-black/70 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.3)] scale-[1.02]'
                    : isVoted
                    ? 'bg-emerald-950/40 border-emerald-400/60 hover:bg-black/50'
                    : 'bg-black/40 hover:bg-white/10 border-white/20'
                }`}
                style={{
                  borderColor: isActiveView ? team.color : undefined
                }}
              >
                {/* Floating Butterfly on Active/Voted Team */}
                {isVoted && (
                  <div className="absolute -top-3 -right-2 z-20 pointer-events-none">
                    <ButterflyParticle type="hope" size={36} />
                  </div>
                )}

                {/* Team Icon / Image */}
                <div
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center p-1.5 overflow-hidden transition-transform ${
                    isActiveView ? 'scale-110' : ''
                  }`}
                  style={{
                    backgroundColor: `${team.color}25`,
                    boxShadow: isActiveView ? `0 0 20px ${team.glow}` : undefined
                  }}
                >
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={team.name}
                      className="w-full h-full object-contain drop-shadow"
                    />
                  ) : (
                    <span className="text-2xl">{team.icon}</span>
                  )}
                </div>

                {/* Team Info */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-1.5">
                    <h3 className={`font-serif-display font-bold text-sm sm:text-base truncate ${
                      isActiveView ? 'text-amber-200' : 'text-white'
                    }`}>
                      {team.name}
                    </h3>
                  </div>
                  
                  {/* Status Indicator Pill */}
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
                      <span className="text-[0.65rem] text-white/50 truncate">
                        Xem chi tiết
                      </span>
                    )}
                  </div>
                </div>

                {/* Vote Button on sidebar for quick selection */}
                {!isVoted && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTeamForVote(team.id);
                    }}
                    className="px-2.5 py-1 text-xs font-serif-display font-semibold rounded-lg bg-amber-400/20 hover:bg-amber-400 text-amber-200 hover:text-black border border-amber-300/40 transition-all shrink-0 hidden lg:block"
                  >
                    Chọn
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Team Showcase Card & Moments Gallery */}
        <div className="flex-1 flex flex-col w-full h-full min-h-0 bg-black/40 backdrop-blur-md rounded-3xl border border-amber-300/30 p-4 sm:p-5 overflow-y-auto scrollbar-thin">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTeamObj.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4"
            >
              {/* HERO SECTION: Team Big Poster & Details */}
              <div 
                className="relative rounded-2xl p-4 sm:p-6 overflow-hidden border border-white/20 flex flex-col md:flex-row items-center gap-5 justify-between"
                style={{
                  background: `linear-gradient(135deg, ${currentTeamObj.color}30 0%, rgba(0,0,0,0.7) 100%)`
                }}
              >
                {/* Background Glow */}
                <div 
                  className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-50"
                  style={{ backgroundColor: currentTeamObj.color }}
                />

                {/* Team Hero Graphic / Logo */}
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 shrink-0 flex items-center justify-center p-2 rounded-2xl bg-black/30 border border-white/20 shadow-2xl">
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

                {/* Team Info Details */}
                <div className="flex-1 text-center md:text-left z-10">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="text-3xl">{currentTeamObj.icon}</span>
                    <h3 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-wide text-shadow">
                      {currentTeamObj.name}
                    </h3>
                  </div>

                  <p className="font-serif-display text-amber-200 italic text-sm sm:text-base mt-2 max-w-xl">
                    "{currentTeamObj.description}"
                  </p>

                  {/* Actions Bar */}
                  <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
                    {selectedTeam === currentTeamObj.id ? (
                      <div className="px-4 py-2 rounded-full bg-emerald-500/30 border border-emerald-400 text-emerald-200 font-serif-display text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(52,211,153,0.4)] animate-pulse">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ĐÃ BÌNH CHỌN CHO TEAM NÀY
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSelectTeamForVote(currentTeamObj.id)}
                        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 hover:from-amber-300 hover:to-white text-gray-950 font-serif-display font-extrabold text-sm sm:text-base shadow-[0_0_20px_rgba(251,191,36,0.6)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-5 h-5 text-amber-900" />
                        Bình Chọn Team {currentTeamObj.name}
                      </button>
                    )}

                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-serif-display text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-amber-300" />
                      Thêm khoảnh khắc
                    </button>
                  </div>
                </div>
              </div>

              {/* MOMENTS GALLERY SECTION */}
              <div className="mt-2">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-amber-300" />
                    <h4 className="font-serif-display font-bold text-lg text-white">
                      Khoảnh Khắc Đáng Nhớ ({activeMoments.length})
                    </h4>
                  </div>
                  <span className="text-xs text-amber-200/70 italic">
                    Bấm vào ảnh để phóng to
                  </span>
                </div>

                {activeMoments.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-black/20 border border-dashed border-white/20 text-center flex flex-col items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-white/30 mb-2" />
                    <p className="font-serif-display text-white/70 text-sm">
                      Chưa có khoảnh khắc nào được chia sẻ cho Team {currentTeamObj.name}.
                    </p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="mt-3 px-4 py-2 rounded-full bg-amber-400/20 hover:bg-amber-400 text-amber-200 hover:text-black border border-amber-300/40 text-xs font-serif-display font-bold transition-all"
                    >
                      + Đăng khoảnh khắc đầu tiên
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
                    {activeMoments.map((moment) => (
                      <motion.div
                        key={moment.id}
                        whileHover={{ y: -4 }}
                        onClick={() => setLightboxMoment(moment)}
                        className="group relative bg-black/50 backdrop-blur-sm border border-white/20 hover:border-amber-400/70 rounded-2xl overflow-hidden cursor-pointer flex flex-col transition-all duration-300 shadow-lg"
                      >
                        {/* Image Container */}
                        <div className="relative aspect-video w-full overflow-hidden bg-black/60">
                          <img
                            src={moment.imageUrl}
                            alt={moment.caption}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/profile_image/TheBestEvent/Camping.png';
                            }}
                          />
                          
                          {/* Tag Overlay */}
                          {moment.tag && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/20 text-[0.65rem] font-semibold text-amber-200 flex items-center gap-1">
                              <Tag className="w-3 h-3 text-amber-300" />
                              {moment.tag}
                            </span>
                          )}

                          {/* Hover Expand Icon */}
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Maximize2 className="w-6 h-6 text-white drop-shadow-md" />
                          </div>
                        </div>

                        {/* Content Container */}
                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <p className="font-serif-display text-xs sm:text-sm text-gray-100 line-clamp-2 italic">
                            "{moment.caption}"
                          </p>

                          <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[0.7rem] text-white/60">
                            <span className="flex items-center gap-1 truncate font-medium text-amber-100/90">
                              <User className="w-3 h-3 text-amber-300" />
                              {moment.author}
                            </span>

                            {/* Like / Heart Button */}
                            <button
                              onClick={(e) => handleLike(moment.id, e)}
                              className="px-2 py-1 rounded-full bg-white/10 hover:bg-pink-500/20 text-pink-300 border border-pink-400/30 flex items-center gap-1 transition-all hover:scale-110"
                            >
                              <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                              <span className="font-bold">{moment.likes}</span>
                            </button>
                          </div>
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

      {/* Bottom Navigation Buttons */}
      <div className="w-full max-w-6xl flex justify-between items-center pt-2 sm:pt-3 border-t border-white/10 shrink-0 mt-auto">
        <button
          onClick={() => {
            soundFx.playClick();
            onBack();
          }}
          className="px-6 sm:px-8 py-2 rounded-full border border-white/50 bg-black/30 hover:bg-black/50 text-white font-serif-display text-base sm:text-xl transition-all shadow-lg cursor-pointer"
        >
          Back
        </button>

        <div className="flex items-center gap-3">
          {selectedTeam && (
            <div className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-amber-400/70 shadow-[0_0_15px_rgba(251,191,36,0.4)] flex items-center gap-1.5 text-xs sm:text-sm text-amber-100 font-serif-display shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="opacity-90">Đã chọn:</span>
              <strong className="text-amber-300 font-extrabold uppercase tracking-wide drop-shadow">
                {TEAMS.find(t => t.id === selectedTeam)?.name}
              </strong>
            </div>
          )}

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
            className={`px-6 sm:px-8 py-2 rounded-full border border-white/80 font-serif-display text-base sm:text-xl transition-all shadow-lg cursor-pointer ${
              selectedTeam
                ? 'bg-gradient-to-r from-amber-300 via-amber-200 to-white hover:scale-105 text-gray-950 font-bold'
                : 'bg-white/40 text-gray-800 opacity-60'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* MODAL 1: ADD NEW MOMENT */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg bg-gray-900/90 border border-amber-300/40 rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-amber-200 flex items-center gap-2 mb-1">
                <Camera className="w-6 h-6 text-amber-300" />
                Thêm Khoảnh Khắc Team {currentTeamObj.name}
              </h3>
              <p className="text-xs text-white/70 mb-4">
                Chia sẻ hình ảnh và kỷ niệm của bạn cùng đội {currentTeamObj.name}
              </p>

              <form onSubmit={handleAddMomentSubmit} className="space-y-3.5">
                {/* Photo selection / input */}
                <div>
                  <label className="block text-xs font-semibold text-amber-100 mb-1.5">
                    Chọn Ảnh / Tải Ảnh Lên
                  </label>
                  
                  {/* Preset quick photo choices */}
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {PRESET_MOMENT_PHOTOS.map((photo, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setNewImageUrl(photo.url)}
                        className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                          newImageUrl === photo.url ? 'border-amber-400 scale-105 shadow-[0_0_10px_rgba(251,191,36,0.6)]' : 'border-white/20 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  {/* Custom image URL or Upload */}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Dán link ảnh (https://...)"
                      className="flex-1 px-3 py-1.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-300"
                    />
                    <label className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
                      Tải lên
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Caption */}
                <div>
                  <label className="block text-xs font-semibold text-amber-100 mb-1">
                    Caption / Kỷ Niệm (*)
                  </label>
                  <textarea
                    rows={3}
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="Viết caption ấm áp hoặc hài hước cho khoảnh khắc này..."
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-300"
                    required
                  />
                </div>

                {/* Author Name */}
                <div>
                  <label className="block text-xs font-semibold text-amber-100 mb-1">
                    Tên Người Đăng
                  </label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Tên của bạn..."
                    className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-300"
                  />
                </div>

                {/* Event Tag */}
                <div>
                  <label className="block text-xs font-semibold text-amber-100 mb-1">
                    Thẻ Tag / Sự Kiện
                  </label>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Ví dụ: Camping 2026, Workshop Secrets..."
                    className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-300"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-white/30 text-white/80 text-xs font-serif-display"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-200 text-gray-950 text-xs font-serif-display font-bold shadow-lg hover:scale-105 transition-all cursor-pointer"
                  >
                    Đăng Khoảnh Khắc
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: LIGHTBOX PREVIEW */}
      <AnimatePresence>
        {lightboxMoment && (
          <div 
            onClick={() => setLightboxMoment(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-gray-950 border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              <button
                onClick={() => setLightboxMoment(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-white/90 transition-all border border-white/30"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={lightboxMoment.imageUrl}
                  alt={lightboxMoment.caption}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>

              <div className="p-4 sm:p-5 bg-gradient-to-b from-gray-900 to-black flex flex-col gap-2">
                <p className="font-serif-display text-sm sm:text-base text-amber-100 italic">
                  "{lightboxMoment.caption}"
                </p>
                <div className="flex items-center justify-between text-xs text-white/60 pt-2 border-t border-white/10">
                  <span>Đăng bởi: <strong className="text-amber-300">{lightboxMoment.author}</strong> ({lightboxMoment.date})</span>
                  <button
                    onClick={(e) => handleLike(lightboxMoment.id, e)}
                    className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/40 flex items-center gap-1.5 font-bold"
                  >
                    <Heart className="w-4 h-4 fill-pink-400 text-pink-400" />
                    {lightboxMoment.likes} Lượt thích
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
