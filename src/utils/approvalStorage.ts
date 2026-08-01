import { HugoTeam } from '../types';
import { ClubMember } from '../data/membersData';

export interface PendingApproval {
  id: string;
  type: 'member' | 'event';
  name: string;
  teamId?: HugoTeam;
  requestedBy?: string;
  timestamp: string;
}

const PENDING_KEY = 'hugo_award_2026_pending_approvals';
const CUSTOM_EVENTS_KEY = 'hugo_award_2026_custom_events';

export function getPendingApprovals(): PendingApproval[] {
  try {
    const saved = localStorage.getItem(PENDING_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // Ignore
  }
  return [];
}

export function savePendingApprovals(approvals: PendingApproval[]) {
  localStorage.setItem(PENDING_KEY, JSON.stringify(approvals));
}

export function requestAddMember(name: string, teamId: HugoTeam = 'prs', requestedBy: string = 'Guest'): void {
  const approvals = getPendingApprovals();
  
  // Check if already requested or exists
  const exists = approvals.some(a => a.type === 'member' && a.name.toLowerCase() === name.trim().toLowerCase());
  if (exists) return;

  approvals.push({
    id: `pending-member-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type: 'member',
    name: name.trim(),
    teamId,
    requestedBy,
    timestamp: new Date().toISOString()
  });
  
  savePendingApprovals(approvals);
}

export function requestAddEvent(name: string, requestedBy: string = 'Guest'): void {
  const approvals = getPendingApprovals();

  const exists = approvals.some(a => a.type === 'event' && a.name.toLowerCase() === name.trim().toLowerCase());
  if (exists) return;

  approvals.push({
    id: `pending-event-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type: 'event',
    name: name.trim(),
    requestedBy,
    timestamp: new Date().toISOString()
  });

  savePendingApprovals(approvals);
}

// Custom events storage
export interface CustomEvent {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export function getCustomEvents(): CustomEvent[] {
  try {
    const saved = localStorage.getItem(CUSTOM_EVENTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // Ignore
  }
  return [];
}

export function addCustomEventToDatabase(name: string): CustomEvent {
  const events = getCustomEvents();
  const newEvent: CustomEvent = {
    id: `custom-event-${Date.now()}`,
    name,
    icon: '🌟',
    description: 'Custom event approved by admin'
  };
  events.push(newEvent);
  localStorage.setItem(CUSTOM_EVENTS_KEY, JSON.stringify(events));
  return newEvent;
}
