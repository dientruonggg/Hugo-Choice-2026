export interface RoundConfig {
  currentRound: 1 | 2;
  requiredVotesPerCategory: number; // 3 for Round 1, 2 for Round 2
  showLiveStats: boolean; // true for Round 1, false for Round 2
  enableEmail: boolean; // true for both
}

// Current Active Round for Dev Branch: Round 2
export const CURRENT_ROUND: 1 | 2 = 2;

export const ROUND_CONFIG: Record<1 | 2, RoundConfig> = {
  1: {
    currentRound: 1,
    requiredVotesPerCategory: 3,
    showLiveStats: true,
    enableEmail: true,
  },
  2: {
    currentRound: 2,
    requiredVotesPerCategory: 2,
    showLiveStats: false,
    enableEmail: true,
  }
};

export const activeRoundConfig = ROUND_CONFIG[CURRENT_ROUND];
