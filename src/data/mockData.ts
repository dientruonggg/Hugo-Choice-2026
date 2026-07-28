import { TeamInfo, Candidate, EventOption, DuoPair, LiveResultsData } from '../types';

export const TEAMS: TeamInfo[] = [
  {
    id: 'prs',
    name: 'Power Rangers',
    icon: '⚡',
    image: '/assets/teams/PRs.png',
    activeImage: '/assets/teams/PRs2.png',
    description: 'Dynamic & Heroic - Unstoppable energy and teamwork in every challenge',
    color: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.6)'
  },
  {
    id: 'hc',
    name: 'Heroes Company',
    icon: '🛡️',
    image: '/assets/teams/HC.png',
    activeImage: '/assets/teams/HC2.png',
    description: 'Brave & Dedicated - Protecting excellence and inspiring greatness',
    color: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.6)'
  },
  {
    id: 'bnn',
    name: 'Banana',
    icon: '🍌',
    image: '/assets/teams/BNN.png',
    activeImage: '/assets/teams/BNN2.png',
    description: 'Joyful & Vibrant - Brightening the club with humor and passion',
    color: '#eab308',
    glow: 'rgba(234, 179, 8, 0.6)'
  },
  {
    id: 'niff',
    name: 'Nifflers',
    icon: '🐾',
    image: '/assets/teams/Niff.png',
    activeImage: '/assets/teams/Niff2.png',
    description: 'Clever & Curious - Always hunting for hidden treasures and success',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.6)'
  }
];

export const BEST_MEMBER_CANDIDATES: Candidate[] = [
  { id: 'm1', name: 'Duong Thi Hoai', avatar: '/assets/profile_image/TheBestMember/dth.png', role: 'Outstanding Hugo Member' },
  { id: 'm2', name: 'Ngo Thi My', avatar: '/assets/profile_image/TheBestMember/ntm.png', role: 'Active Hugo Contributor' },
  { id: 'm3', name: 'Tran Anh Khoa', avatar: '/assets/profile_image/TheBestMember/tak.png', role: 'Creative Hugo Leader' },
  { id: 'm4', name: 'Tran Duy Anh', avatar: '/assets/profile_image/TheBestMember/tda.png', role: 'Dedicated Hugo Member' },
  { id: 'm5', name: 'Tran Thi Thu Thuy', avatar: '/assets/profile_image/TheBestMember/tttt.png', role: 'Inspiring Hugo Member' }
];

export const BEST_EVENTS: EventOption[] = [
  {
    id: 'e1',
    name: 'Hugo Camping 2024: Zenith of Mid-day',
    icon: '🏕️',
    avatar: '/assets/profile_image/TheBestEvent/Camping.png',
    description: 'Under the starry night sky with bonfire acoustic sing-alongs and storytelling.',
    tag: 'OUTDOOR RETREAT'
  },
  {
    id: 'e2',
    name: 'Workshop: Angle Of View',
    icon: '📷',
    avatar: '/assets/profile_image/TheBestEvent/angel.png',
    description: 'Perspective sharing and visual storytelling workshop session.',
    tag: 'SKILL BUILDING'
  },
  {
    id: 'e3',
    name: 'Welcome Newbies Winter 2023: Finding the Epiphany',
    icon: '❄️',
    avatar: '/assets/profile_image/TheBestEvent/WN.png',
    description: 'Warm welcome gathering for new club members with interactive games.',
    tag: 'NETWORKING'
  },
  {
    id: 'e4',
    name: 'Hugo Writing Competition: The Year in Ink',
    icon: '✒️',
    avatar: '/assets/profile_image/TheBestEvent/yearinink.png',
    description: 'Creative writing contest inspiring members to express their stories.',
    tag: 'COMPETITION'
  },
  {
    id: 'e5',
    name: "Improv Workshop: Thank God, you're here - Season 2",
    icon: '🎭',
    avatar: '/assets/profile_image/TheBestEvent/Workshop.png',
    description: 'Hilarious and engaging improvisational speaking workshop.',
    tag: 'IMPROV WORKSHOP'
  }
];

export const ROOKIE_CANDIDATES: Candidate[] = [
  { id: 'r1', name: 'Ho Thi Phuong', avatar: '/assets/profile_image/TheRookie/htp.png', role: 'Enthusiastic Rookie 2026' },
  { id: 'r2', name: 'Nguyen Tran Uyen Trang', avatar: '/assets/profile_image/TheRookie/ntut.png', role: 'Outstanding Debut Speaker' },
  { id: 'r3', name: 'Pham Tan Quoc Tuan', avatar: '/assets/profile_image/TheRookie/ptqt.png', role: 'Active Discussion Leader' },
  { id: 'r4', name: 'Thai Minh Tam', avatar: '/assets/profile_image/TheRookie/tmt.png', role: 'Inspiring Rookie Contributor' },
  { id: 'r5', name: 'Tran Thi Thao Ly', avatar: '/assets/profile_image/TheRookie/tttl.png', role: 'Creative Event Volunteer' }
];

export const PERFECT_DUOS: DuoPair[] = [
  {
    id: 'd1',
    name: 'Truong Phuoc - Hong Giang',
    avatar: '/assets/profile_image/PerfectDuo/Phuoc-Giang.png',
    personA1: 'Truong Phuoc',
    personA2: 'Hong Giang'
  },
  {
    id: 'd2',
    name: 'Anh Khoa - Ngoc Uyen',
    avatar: '/assets/profile_image/PerfectDuo/Uyen-Khoa.png',
    personA1: 'Anh Khoa',
    personA2: 'Ngoc Uyen'
  },
  {
    id: 'd3',
    name: 'Duy Anh - Lien Khuong',
    avatar: '/assets/profile_image/PerfectDuo/DA-LK.png',
    personA1: 'Duy Anh',
    personA2: 'Lien Khuong'
  },
  {
    id: 'd4',
    name: 'Quang Nhat - Tram Anh',
    avatar: '/assets/profile_image/PerfectDuo/TA-QN.png',
    personA1: 'Quang Nhat',
    personA2: 'Tram Anh'
  },
  {
    id: 'd5',
    name: 'Tuan Vo - Van Thien',
    avatar: '/assets/profile_image/PerfectDuo/Vo-Thien.png',
    personA1: 'Tuan Vo',
    personA2: 'Van Thien'
  }
];

export const INITIAL_LIVE_RESULTS: LiveResultsData = {
  totalSubmissions: 42,
  teams: {
    prs: 15,
    hc: 12,
    bnn: 9,
    niff: 6
  },
  bestMember: {
    m1: 14,
    m2: 9,
    m3: 11,
    m4: 5,
    m5: 3
  },
  bestEvent: {
    e1: 28,
    e2: 14
  },
  rookie: {
    r1: 8,
    r2: 15,
    r3: 7,
    r4: 9,
    r5: 3
  },
  perfectDuo: {
    d1: 12,
    d2: 14,
    d3: 6,
    d4: 7,
    d5: 3
  }
};
