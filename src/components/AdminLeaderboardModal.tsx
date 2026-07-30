import React from 'react';
import { LiveResultsData } from '../types';
import { BEST_EVENTS, TEAMS } from '../data/mockData';
import { getResolvedBestMemberName, getResolvedRookieName, getResolvedDuoName } from '../utils/ballotHelpers';
import { X, Award, Flame, Users, Calendar, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface AdminLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: LiveResultsData;
  onClearMyBallot?: () => void;
}

export const AdminLeaderboardModal: React.FC<AdminLeaderboardModalProps> = ({
  isOpen,
  onClose,
  results,
  onClearMyBallot
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#121c14] border border-amber-400/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-white">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-[#18281b] to-amber-950/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-full bg-amber-400/20 border border-amber-400/50">
              <Award className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="font-cinzel text-xl md:text-2xl font-bold text-amber-200">
                Live Hugo Award 2026 Leaderboard
              </h2>
              <p className="font-sans-clean text-xs text-emerald-300 flex items-center space-x-2">
                <span>Total Votes Cast: <strong className="text-amber-300">{results.totalSubmissions}</strong></span>
                <span>•</span>
                <span className="flex items-center text-amber-300">
                  <Flame className="w-3.5 h-3.5 mr-1" /> Live Tally
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          {/* Teams Stats */}
          <div>
            <h3 className="font-cinzel text-sm uppercase tracking-widest text-amber-300 mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2" /> Teams Distribution
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TEAMS.map(team => {
                const count = results.teams[team.id] || 0;
                const percent = results.totalSubmissions ? Math.round((count / results.totalSubmissions) * 100) : 0;

                return (
                  <div key={team.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-2xl block mb-1">{team.icon}</span>
                    <span className="font-serif-display text-sm font-semibold block text-white">{team.name}</span>
                    <span className="text-amber-300 font-sans-clean font-bold text-lg block my-1">{count} votes</span>
                    <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%`, backgroundColor: team.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Best Member */}
          <div>
            <h3 className="font-cinzel text-sm uppercase tracking-widest text-amber-300 mb-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-2" /> Best Member
            </h3>
            <div className="space-y-2">
              {Object.entries(results.bestMember).map(([idOrName, count]) => {
                const name = getResolvedBestMemberName(idOrName);
                const percent = results.totalSubmissions ? Math.round((count / results.totalSubmissions) * 100) : 0;

                return (
                  <div key={idOrName} className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-between">
                    <div className="flex-1 pr-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-serif-display font-medium text-white">{name}</span>
                        <span className="text-amber-300 font-bold">{count} ({percent}%)</span>
                      </div>
                      <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-amber-300 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Best Event */}
          <div>
            <h3 className="font-cinzel text-sm uppercase tracking-widest text-amber-300 mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-2" /> Best Event
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BEST_EVENTS.map(e => {
                const count = results.bestEvent[e.id] || 0;
                const percent = results.totalSubmissions ? Math.round((count / results.totalSubmissions) * 100) : 0;

                return (
                  <div key={e.id} className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-3xl">{e.icon}</span>
                      <div>
                        <h4 className="font-cinzel font-bold text-white text-base">{e.name}</h4>
                        <span className="text-xs text-amber-300 font-bold">{count} votes ({percent}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* The Rookie */}
          <div>
            <h3 className="font-cinzel text-sm uppercase tracking-widest text-amber-300 mb-3 flex items-center">
              🌱 The Rookie Award
            </h3>
            <div className="space-y-2">
              {Object.entries(results.rookie).map(([idOrName, count]) => {
                const name = getResolvedRookieName(idOrName);
                const percent = results.totalSubmissions ? Math.round((count / results.totalSubmissions) * 100) : 0;

                return (
                  <div key={idOrName} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex-1 pr-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-serif-display font-medium text-white">{name}</span>
                        <span className="text-emerald-300 font-bold">{count} ({percent}%)</span>
                      </div>
                      <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Perfect Duo */}
          <div>
            <h3 className="font-cinzel text-sm uppercase tracking-widest text-amber-300 mb-3 flex items-center">
              🦋 The Perfect Duo
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(results.perfectDuo).map(([idOrName, count]) => {
                const name = getResolvedDuoName(idOrName);
                const percent = results.totalSubmissions ? Math.round((count / results.totalSubmissions) * 100) : 0;

                return (
                  <div key={idOrName} className="p-3 rounded-lg bg-purple-950/20 border border-purple-400/30 flex justify-between items-center">
                    <div>
                      <span className="font-serif-display text-sm font-semibold text-white block">
                        {name}
                      </span>
                      <span className="text-xs text-purple-200">{count} votes ({percent}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-black/40 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => {
              soundFx.playClick();
              if (window.confirm("Are you sure you want to clear your ballot and vote again? Your previous votes will be removed from the live tally.")) {
                if (onClearMyBallot) onClearMyBallot();
              }
            }}
            className="px-4 py-2 rounded-full border border-red-500/50 bg-red-500/10 hover:bg-red-500/30 text-red-400 font-cinzel font-bold text-xs transition-colors"
          >
            Clear My Ballot & Revote
          </button>
          
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-6 py-2 rounded-full bg-amber-400 text-black font-cinzel font-bold text-sm hover:bg-amber-300 transition-colors"
          >
            Close Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};
