export interface RoundConfig {
  currentRound: 1 | 2;
  requiredVotesPerCategory: number; // 3 for Round 1, 2 for Round 2
  showLiveStats: boolean; // true for Round 1, false for Round 2
  enableEmail: boolean; // true for both
}

// Current Active Round — Round 1: Aug 1-4, Round 2: Aug 5-7
// Đổi sang 2 khi bắt đầu Round 2 (5/8)
export const CURRENT_ROUND: 1 | 2 = 2;

// Trạng thái cổng bình chọn — Set true để tạm đóng cổng bình chọn (chờ mở Vòng 2)
export const IS_VOTING_CLOSED: boolean = false;

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
