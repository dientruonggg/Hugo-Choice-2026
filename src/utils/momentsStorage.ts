import { TeamMoment } from '../types';
import { INITIAL_TEAM_MOMENTS } from '../data/mockData';

const MOMENTS_KEY = 'hugo_award_2024_team_moments';
const LIKED_MOMENTS_KEY = 'hugo_award_user_liked_moments';
const CREATED_MOMENTS_KEY = 'hugo_award_user_created_moments';

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

export const getUserLikedMomentIds = (): string[] => {
  try {
    const saved = localStorage.getItem(LIKED_MOMENTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Fallback
  }
  return [];
};

export const saveUserLikedMomentIds = (ids: string[]) => {
  try {
    localStorage.setItem(LIKED_MOMENTS_KEY, JSON.stringify(ids));
  } catch {
    // Ignore
  }
};

export const getUserCreatedMomentIds = (): string[] => {
  try {
    const saved = localStorage.getItem(CREATED_MOMENTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    } else {
      // Auto-migrate legacy test moments saved on this device so creator can delete them
      const storedMoments = getStoredMoments();
      const ids = storedMoments.map(m => m.id);
      saveUserCreatedMomentIds(ids);
      return ids;
    }
  } catch {
    // Fallback
  }
  return [];
};

export const saveUserCreatedMomentIds = (ids: string[]) => {
  try {
    localStorage.setItem(CREATED_MOMENTS_KEY, JSON.stringify(ids));
  } catch {
    // Ignore
  }
};

export const isMomentLikedByUser = (momentId: string): boolean => {
  const likedIds = getUserLikedMomentIds();
  return likedIds.includes(momentId);
};

export const isMomentCreatedByUser = (momentId: string, currentUserName?: string, momentAuthor?: string): boolean => {
  const createdIds = getUserCreatedMomentIds();
  if (createdIds.includes(momentId)) return true;

  // Check matching author name if provided
  if (currentUserName && momentAuthor && currentUserName.trim().toLowerCase() === momentAuthor.trim().toLowerCase()) {
    return true;
  }

  // Fallback: Custom moments created during test phase on client can be deleted by local user
  if (momentId.startsWith('m-custom-')) {
    return true;
  }

  return false;
};

export const addTeamMoment = (newMoment: Omit<TeamMoment, 'id' | 'likes'>): TeamMoment => {
  const moments = getStoredMoments();
  const created: TeamMoment = {
    ...newMoment,
    id: `m-custom-${Date.now()}`,
    likes: 1
  };

  // Track that this device created this moment
  const createdIds = getUserCreatedMomentIds();
  if (!createdIds.includes(created.id)) {
    saveUserCreatedMomentIds([...createdIds, created.id]);
  }

  // Auto-like for creator
  const likedIds = getUserLikedMomentIds();
  if (!likedIds.includes(created.id)) {
    saveUserLikedMomentIds([...likedIds, created.id]);
  }

  const updated = [created, ...moments];
  saveStoredMoments(updated);
  return created;
};

export const toggleLikeMoment = (momentId: string): { moments: TeamMoment[]; isLikedNow: boolean } => {
  const moments = getStoredMoments();
  const likedIds = getUserLikedMomentIds();
  const alreadyLiked = likedIds.includes(momentId);

  let nextLikedIds: string[];
  let isLikedNow: boolean;

  if (alreadyLiked) {
    nextLikedIds = likedIds.filter(id => id !== momentId);
    isLikedNow = false;
  } else {
    nextLikedIds = [...likedIds, momentId];
    isLikedNow = true;
  }

  saveUserLikedMomentIds(nextLikedIds);

  const updated = moments.map(m => {
    if (m.id === momentId) {
      const newLikes = isLikedNow ? m.likes + 1 : Math.max(0, m.likes - 1);
      return { ...m, likes: newLikes };
    }
    return m;
  });

  saveStoredMoments(updated);
  return { moments: updated, isLikedNow };
};

export const deleteTeamMoment = (momentId: string): TeamMoment[] => {
  const moments = getStoredMoments();
  const updated = moments.filter(m => m.id !== momentId);
  saveStoredMoments(updated);

  const createdIds = getUserCreatedMomentIds().filter(id => id !== momentId);
  saveUserCreatedMomentIds(createdIds);
  const likedIds = getUserLikedMomentIds().filter(id => id !== momentId);
  saveUserLikedMomentIds(likedIds);

  return updated;
};

export const resetStoredMoments = (): TeamMoment[] => {
  try {
    localStorage.removeItem(MOMENTS_KEY);
    localStorage.removeItem(LIKED_MOMENTS_KEY);
    localStorage.removeItem(CREATED_MOMENTS_KEY);
  } catch {
    // Ignore
  }
  return INITIAL_TEAM_MOMENTS;
};
