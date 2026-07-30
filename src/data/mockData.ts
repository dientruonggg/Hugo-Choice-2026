import { TeamInfo, Candidate, EventOption, DuoPair, LiveResultsData, TeamMoment } from '../types';

export const TEAMS: TeamInfo[] = [
  {
    id: 'prs',
    name: 'Power Rangers',
    icon: '⚡',
    image: '/assets/teams/PRs.png',
    activeImage: '/assets/teams/PRs2.png',
    heroLogo: '/team_logo/POWER RANGERS.png',
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
    heroLogo: '/team_logo/Heroes.png',
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
    heroLogo: '/team_logo/BANANA.png',
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
    heroLogo: '/team_logo/NIFFLER.png',
    description: 'Clever & Curious - Always hunting for hidden treasures and success',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.6)'
  }
];

export const INITIAL_TEAM_MOMENTS: TeamMoment[] = [
  // Power Rangers
  {
    id: 'm-prs-1',
    teamId: 'prs',
    imageUrl: '/assets/profile_image/TheBestEvent/Camping.png',
    caption: 'Khởi động cực cháy tại Hugo Camping Emberline! 🔥 Quẩy hết mình cùng đội hình siêu đẳng.',
    author: 'Khánh Linh',
    likes: 42,
    date: 'Dec 2025',
    tag: 'Emberline Camping'
  },
  {
    id: 'm-prs-2',
    teamId: 'prs',
    imageUrl: '/assets/profile_image/TheBestEvent/Workshop.png',
    caption: 'Biệt đội PRs tỏa sáng rực rỡ tại Workshop Insider Secrets ⚡',
    author: 'Anh Khoa',
    likes: 28,
    date: 'Nov 2025',
    tag: 'Workshop Secrets'
  },
  {
    id: 'm-prs-3',
    teamId: 'prs',
    imageUrl: '/assets/profile_image/TheBestMember/tak.png',
    caption: 'Team spirit bất diệt của những chiến binh siêu năng lượng!',
    author: 'Minh Tâm',
    likes: 35,
    date: 'Jan 2026',
    tag: 'Team Building'
  },

  // Heroes Company
  {
    id: 'm-hc-1',
    teamId: 'hc',
    imageUrl: '/assets/profile_image/TheBestEvent/angel.png',
    caption: 'Vinh danh những chiến binh kiên cường nhất của Heroes Company 🛡️✨',
    author: 'Hoài Nam',
    likes: 39,
    date: 'Jan 2026',
    tag: 'Talkshow Tấm Vé'
  },
  {
    id: 'm-hc-2',
    teamId: 'hc',
    imageUrl: '/assets/profile_image/TheBestEvent/WN.png',
    caption: 'Welcome Newbie Eclipse - Sát cánh bên nhau bảo vệ tinh thần Hugo! 🌌',
    author: 'Mỹ Ngô',
    likes: 31,
    date: 'Oct 2025',
    tag: 'Eclipse Newbie'
  },

  // Banana
  {
    id: 'm-bnn-1',
    teamId: 'bnn',
    imageUrl: '/assets/profile_image/TheBestEvent/yearinink.png',
    caption: 'Trận cười thả ga & những khoảnh khắc ấm áp tại Hugo Christmas Golden Hour 🎄🍌',
    author: 'Thu Thủy',
    likes: 48,
    date: 'Dec 2025',
    tag: 'Golden Hour'
  },
  {
    id: 'm-bnn-2',
    teamId: 'bnn',
    imageUrl: '/assets/profile_image/TheBestEvent/Camping.png',
    caption: 'Đêm bùng nổ tài năng xung quanh lửa trại Emberline 🔥 Hài hước & đầy năng lượng!',
    author: 'Tuấn Võ',
    likes: 26,
    date: 'Feb 2026',
    tag: 'Campfire Night'
  },

  // Nifflers
  {
    id: 'm-niff-1',
    teamId: 'niff',
    imageUrl: '/assets/profile_image/TheBestEvent/WN.png',
    caption: 'Nifflers săn kho báu cực đỉnh tại Flareon! 🐾✨ Thông minh & lém lỉnh.',
    author: 'Tấn Quốc',
    likes: 45,
    date: 'Oct 2025',
    tag: 'Flareon Welcome'
  },
  {
    id: 'm-niff-2',
    teamId: 'niff',
    imageUrl: '/assets/profile_image/TheBestEvent/angel.png',
    caption: 'Buổi Talkshow Tấm Vé Viễn Phương siêu ấm áp cùng đại gia đình Nifflers 🎙️',
    author: 'Uyên Trang',
    likes: 33,
    date: 'Jan 2026',
    tag: 'Talkshow Sharing'
  }
];

export const BEST_EVENTS: EventOption[] = [
  {
    id: 'e1',
    name: 'Live Stream: ÔN THI TIẾNG ANH ĐẦU VÀO MIỄN PHÍ',
    icon: '📺',
    avatar: '/assets/profile_image/TheBestEvent/Workshop.png',
    description: 'Special online livestream helping members ace English placement exams.',
    tag: 'ONLINE LIVESTREAM'
  },
  {
    id: 'e2',
    name: '[HUGO 𝐂𝐇𝐑𝐈𝐒𝐓𝐌𝐀𝐒 𝟐𝟎𝟐𝟓] - 𝐓𝐇𝐄 𝐆𝐎𝐋𝐃𝐄𝐍 𝐇𝐎𝐔𝐑 🎄✨',
    icon: '🎄',
    avatar: '/assets/profile_image/TheBestEvent/Camping.png',
    description: 'Magical Christmas party with heartwarming activities and golden memories.',
    tag: 'HOLIDAY CELEBRATION'
  },
  {
    id: 'e3',
    name: '[𝐎𝐍𝐋𝐈𝐍𝐄 𝐓𝐀𝐋𝐊𝐒𝐇𝐎𝐖 - 𝐇𝐔𝐆𝐎 𝐄𝐍𝐆𝐋𝐈𝐒𝐇 𝐂𝐋𝐔𝐁] | TẤM VÉ VIỄN PHƯƠNG',
    icon: '🎙️',
    avatar: '/assets/profile_image/TheBestEvent/angel.png',
    description: 'Inspiring online talkshow sharing valuable overseas and career journeys.',
    tag: 'TALKSHOW'
  },
  {
    id: 'e4',
    name: '[𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐍𝐄𝐖𝐁𝐈𝐄 𝟐𝟎𝟐𝟔] - 𝐄𝐂𝐋𝐈𝐏𝐒𝐄',
    icon: '🌘',
    avatar: '/assets/profile_image/TheBestEvent/WN.png',
    description: 'Grand welcome celebration for the 2026 rookie cohort.',
    tag: 'WELCOME EVENT'
  },
  {
    id: 'e5',
    name: '[𝐇𝐔𝐆𝐎 𝐖𝐎𝐑𝐊𝐒𝐇𝐎𝐏] - 𝐈𝐍𝐒𝐈𝐃𝐄𝐑 𝐒𝐄𝐂𝐑𝐄𝐓𝐒 🔥',
    icon: '🔥',
    avatar: '/assets/profile_image/TheBestEvent/yearinink.png',
    description: 'Exclusive skill-building workshop unlocking insider communication secrets.',
    tag: 'WORKSHOP'
  },
  {
    id: 'e6',
    name: '📣 [𝐇𝐔𝐆𝐎 𝐂𝐀𝐌𝐏𝐈𝐍𝐆 𝟐𝟎𝟐𝟔 - 𝐄𝐌𝐁𝐄𝐑𝐋𝐈𝐍𝐄] 📣',
    icon: '🏕️',
    avatar: '/assets/profile_image/TheBestEvent/Camping.png',
    description: 'Unforgettable outdoor camping retreat around Emberline campfire.',
    tag: 'CAMPING RETREAT'
  },
  {
    id: 'e7',
    name: '[𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐍𝐄𝐖𝐁𝐈𝐄 𝟐𝟎𝟐5] - FLAREON',
    icon: '✨',
    avatar: '/assets/profile_image/TheBestEvent/WN.png',
    description: 'Fiery and vibrant welcome gathering for the 2025 club members.',
    tag: 'WELCOME EVENT'
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
    'niff-5': 14,
    'hc-7': 11,
    'hc-13': 9,
    'niff-10': 5,
    'prs-11': 3
  },
  bestEvent: {
    e1: 28,
    e2: 14
  },
  rookie: {
    'prs-24': 15,
    'hc-23': 9,
    'bnn-13': 8,
    'prs-26': 7,
    'prs-91': 3
  },
  perfectDuo: {
    'bnn-4 & bnn-2': 14,
    'hc-7 & hc-10': 12,
    'prs-9 & prs-12': 7,
    'niff-10 & niff-1': 6,
    'bnn-5 & bnn-10': 3
  }
};
