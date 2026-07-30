import { TEAMS, BEST_EVENTS } from '../data/mockData';
import { ALL_MEMBERS, ClubMember } from '../data/membersData';

export function getResolvedTeam(teamId: string | null) {
  if (!teamId) return null;
  return TEAMS.find(t => t.id === teamId || t.name === teamId) || null;
}

export function getResolvedTeamName(teamId: string | null, fallback = 'N/A'): string {
  const teamObj = getResolvedTeam(teamId);
  return teamObj ? `${teamObj.icon} ${teamObj.name}` : (teamId || fallback);
}

export function getMemberByIdOrName(val: string | null): ClubMember | null {
  if (!val) return null;
  return ALL_MEMBERS.find(m => m.id === val || m.name === val) || null;
}

export function getResolvedBestMemberName(val: string | null, fallback = 'N/A'): string {
  if (!val) return fallback;
  const mem = getMemberByIdOrName(val);
  if (mem) return mem.name;
  return val.trim() || fallback;
}

export function getResolvedEvent(eventId: string | null) {
  if (!eventId) return null;
  return BEST_EVENTS.find(e => e.id === eventId || e.name === eventId) || null;
}

export function getResolvedEventName(val: string | null, fallback = 'N/A'): string {
  if (!val) return fallback;
  const eventObj = getResolvedEvent(val);
  if (eventObj) return `${eventObj.icon} ${eventObj.name}`;
  return val.trim() || fallback;
}

export function getResolvedRookieName(val: string | null, fallback = 'N/A'): string {
  if (!val) return fallback;
  const mem = getMemberByIdOrName(val);
  if (mem) return mem.name;
  return val.trim() || fallback;
}

export function getResolvedDuoName(val: string | null, fallback = 'N/A'): string {
  if (!val) return fallback;
  const parts = val.split(/\s*&\s*/);
  if (parts.length >= 2) {
    const memA = getMemberByIdOrName(parts[0]);
    const memB = getMemberByIdOrName(parts[1]);
    const nameA = memA ? memA.name : parts[0];
    const nameB = memB ? memB.name : parts[1];
    return `${nameA} & ${nameB}`;
  }
  const singleMem = getMemberByIdOrName(val);
  if (singleMem) return singleMem.name;
  return val.trim() || fallback;
}
