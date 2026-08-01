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

export function getResolvedBestMemberName(val: string[] | string | null, fallback = 'Chưa chọn đủ 3 người'): string {
  if (!val) return fallback;
  const arr = Array.isArray(val) ? val : [val];
  if (arr.length === 0) return fallback;
  return arr.map(id => {
    const mem = getMemberByIdOrName(id);
    return mem ? mem.name : id;
  }).join(', ');
}

export function getResolvedEvent(eventId: string | null) {
  if (!eventId) return null;
  return BEST_EVENTS.find(e => e.id === eventId || e.name === eventId) || null;
}

export function getResolvedEventName(val: string[] | string | null, fallback = 'Chưa chọn đủ 3 sự kiện'): string {
  if (!val) return fallback;
  const arr = Array.isArray(val) ? val : [val];
  if (arr.length === 0) return fallback;
  return arr.map(id => {
    const eventObj = getResolvedEvent(id);
    return eventObj ? `${eventObj.icon} ${eventObj.name}` : id;
  }).join(', ');
}

export function getResolvedRookieName(val: string[] | string | null, fallback = 'Chưa chọn đủ 3 tân binh'): string {
  if (!val) return fallback;
  const arr = Array.isArray(val) ? val : [val];
  if (arr.length === 0) return fallback;
  return arr.map(id => {
    const mem = getMemberByIdOrName(id);
    return mem ? mem.name : id;
  }).join(', ');
}

export function getResolvedDuoName(val: string[] | string | null, fallback = 'Chưa chọn đủ 3 cặp'): string {
  if (!val) return fallback;
  const arr = Array.isArray(val) ? val : [val];
  if (arr.length === 0) return fallback;
  return arr.map(singleDuo => {
    const parts = singleDuo.split(/\s*&\s*/);
    if (parts.length >= 2) {
      const memA = getMemberByIdOrName(parts[0]);
      const memB = getMemberByIdOrName(parts[1]);
      const nameA = memA ? memA.name : parts[0];
      const nameB = memB ? memB.name : parts[1];
      return `${nameA} & ${nameB}`;
    }
    const singleMem = getMemberByIdOrName(singleDuo);
    return singleMem ? singleMem.name : singleDuo;
  }).join('  |  ');
}
