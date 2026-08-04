import { VotingState, HugoTeam, LiveResultsData } from '../types';
import { saveBallotToFirestore } from './firebase';
import { CURRENT_ROUND } from '../config/roundConfig';

const getStorageKeySavedBallots = (round = CURRENT_ROUND) => `hugo_award_saved_ballots_map_2026_r${round}`;
const getStorageKeyCurrentVote = (round = CURRENT_ROUND) => `hugo_award_2026_user_state_r${round}`;

export interface SavedBallotRecord {
  userEmail?: string;
  userName: string;
  userAvatar?: string;
  selectedTeam: HugoTeam | null;
  selectedBestMember: string[] | string | null;
  selectedBestEvent: string[] | string | null;
  selectedRookie: string[] | string | null;
  selectedDuo: string[] | string | null;
  isSubmitted: boolean;
  submittedAt?: string;
  round?: number;
}

export function getAllSavedBallots(round = CURRENT_ROUND): Record<string, SavedBallotRecord> {
  try {
    const raw = localStorage.getItem(getStorageKeySavedBallots(round));
    if (raw) return JSON.parse(raw);
    // Backward compatibility for Round 1
    if (round === 1) {
      const fallbackRaw = localStorage.getItem('hugo_award_saved_ballots_map_2026');
      if (fallbackRaw) return JSON.parse(fallbackRaw);
    }
  } catch (e) {
    console.error('Error reading saved ballots map', e);
  }
  return {};
}

export function getSavedBallotForUser(email?: string, name?: string, round = CURRENT_ROUND): SavedBallotRecord | null {
  const map = getAllSavedBallots(round);
  if (email && map[email.toLowerCase()]) {
    return map[email.toLowerCase()];
  }
  if (name && map[name.toLowerCase()]) {
    return map[name.toLowerCase()];
  }
  return null;
}

export async function saveUserBallot(state: VotingState, round = CURRENT_ROUND) {
  if (!state.userName && !state.userEmail) return;

  const key = (state.userEmail || state.userName).toLowerCase();
  const record: SavedBallotRecord = {
    userEmail: state.userEmail,
    userName: state.userName,
    userAvatar: state.userAvatar,
    selectedTeam: state.selectedTeam,
    selectedBestMember: state.selectedBestMember,
    selectedBestEvent: state.selectedBestEvent,
    selectedRookie: state.selectedRookie,
    selectedDuo: state.selectedDuo,
    isSubmitted: state.isSubmitted,
    submittedAt: state.submittedAt || (state.isSubmitted ? new Date().toISOString() : undefined),
    round: round
  };

  // 1. Save to local storage map (keyed by gmail/email or username)
  try {
    const map = getAllSavedBallots(round);
    map[key] = record;
    if (state.userName) {
      map[state.userName.toLowerCase()] = record;
    }
    localStorage.setItem(getStorageKeySavedBallots(round), JSON.stringify(map));
    localStorage.setItem(getStorageKeyCurrentVote(round), JSON.stringify(state));
  } catch (e) {
    console.error('Error saving ballot map to localStorage', e);
  }

  // 2. Sync to Firestore if configured
  await saveBallotToFirestore(record);
}

/**
 * Sync all local ballots stored in localStorage up to Firestore.
 * Useful when Firestore was created after some local votes were submitted.
 */
export async function syncAllLocalBallotsToFirestore(): Promise<{ total: number; synced: number }> {
  const map = getAllSavedBallots();
  const records = Object.values(map);
  const uniqueRecordsMap: Record<string, SavedBallotRecord> = {};

  // Deduplicate by email or username
  records.forEach(r => {
    const key = (r.userEmail || r.userName).toLowerCase();
    if (key) {
      uniqueRecordsMap[key] = r;
    }
  });

  const uniqueList = Object.values(uniqueRecordsMap);
  let synced = 0;

  for (const record of uniqueList) {
    try {
      await saveBallotToFirestore(record);
      synced++;
    } catch (err) {
      console.warn('Error syncing ballot to Firestore:', err);
    }
  }

  return { total: uniqueList.length, synced };
}

/**
 * Export all local ballots as a JSON file backup.
 */
export function exportLocalBallotsJSON() {
  const map = getAllSavedBallots();
  const jsonStr = JSON.stringify(map, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hugo_ballots_backup_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import JSON backup of ballots and sync to Firestore + LocalStorage
 */
export async function importBallotsJSON(jsonString: string): Promise<number> {
  try {
    const importedMap = JSON.parse(jsonString) as Record<string, SavedBallotRecord>;
    const currentMap = getAllSavedBallots();
    const mergedMap = { ...currentMap, ...importedMap };
    
    localStorage.setItem(getStorageKeySavedBallots(), JSON.stringify(mergedMap));
    
    let count = 0;
    for (const key of Object.keys(importedMap)) {
      await saveBallotToFirestore(importedMap[key]);
      count++;
    }
    return count;
  } catch (err) {
    console.error('Failed to import ballots JSON:', err);
    throw err;
  }
}

/**
 * Dynamically calculate LiveResultsData from an array of ballot records
 */
export function calculateLiveResultsFromBallots(ballots: SavedBallotRecord[]): LiveResultsData {
  const results: LiveResultsData = {
    totalSubmissions: 0,
    teams: { prs: 0, hc: 0, bnn: 0, niff: 0 },
    bestMember: {},
    bestEvent: {},
    rookie: {},
    perfectDuo: {}
  };

  // Deduplicate by unique user key (email or username)
  const uniqueBallotsMap: Record<string, SavedBallotRecord> = {};
  ballots.forEach(b => {
    const key = (b.userEmail || b.userName || '').toLowerCase().trim();
    if (key) {
      uniqueBallotsMap[key] = b;
    }
  });

  const uniqueList = Object.values(uniqueBallotsMap);

  const toArr = (val: any): string[] => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string' && val.trim() !== '') return [val];
    return [];
  };

  const submittedBallots = uniqueList.filter(b => b.isSubmitted);
  results.totalSubmissions = submittedBallots.length;

  submittedBallots.forEach(b => {
    if (b.selectedTeam && results.teams[b.selectedTeam] !== undefined) {
      results.teams[b.selectedTeam] = (results.teams[b.selectedTeam] || 0) + 1;
    }
    toArr(b.selectedBestMember).forEach(id => {
      if (id) results.bestMember[id] = (results.bestMember[id] || 0) + 1;
    });
    toArr(b.selectedBestEvent).forEach(id => {
      if (id) results.bestEvent[id] = (results.bestEvent[id] || 0) + 1;
    });
    toArr(b.selectedRookie).forEach(id => {
      if (id) results.rookie[id] = (results.rookie[id] || 0) + 1;
    });
    toArr(b.selectedDuo).forEach(id => {
      if (id) results.perfectDuo[id] = (results.perfectDuo[id] || 0) + 1;
    });
  });

  return results;
}

