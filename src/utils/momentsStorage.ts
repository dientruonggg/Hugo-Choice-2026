import { TeamMoment } from '../types';
import { INITIAL_TEAM_MOMENTS } from '../data/mockData';

const MOMENTS_KEY = 'hugo_award_2024_team_moments';

export const getStoredMoments = (): TeamMoment[] => {
  try {
    const saved = localStorage.getItem(MOMENTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Fallback
  }
  return INITIAL_TEAM_MOMENTS;
};

export const saveStoredMoments = (moments: TeamMoment[]) => {
  try {
    localStorage.setItem(MOMENTS_KEY, JSON.stringify(moments));
  } catch {
    // Ignore
  }
};

export const addTeamMoment = (newMoment: Omit<TeamMoment, 'id' | 'likes'>): TeamMoment => {
  const moments = getStoredMoments();
  const created: TeamMoment = {
    ...newMoment,
    id: `m-custom-${Date.now()}`,
    likes: 1
  };
  const updated = [created, ...moments];
  saveStoredMoments(updated);
  return created;
};

export const toggleLikeMoment = (momentId: string): TeamMoment[] => {
  const moments = getStoredMoments();
  const updated = moments.map(m => {
    if (m.id === momentId) {
      return { ...m, likes: m.likes + 1 };
    }
    return m;
  });
  saveStoredMoments(updated);
  return updated;
};

export const resetStoredMoments = (): TeamMoment[] => {
  try {
    localStorage.setItem(MOMENTS_KEY, JSON.stringify([]));
  } catch {
    // Ignore
  }
  return INITIAL_TEAM_MOMENTS;
};
