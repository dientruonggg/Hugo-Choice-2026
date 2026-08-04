import { HugoTeam } from '../types';

export interface Top5Candidate {
  id: string;
  name: string;
  image: string;
  teamId?: HugoTeam;
  description?: string;
  tag?: string;
}

export const TOP_5_BEST_MEMBERS: Top5Candidate[] = [
  // BANANA
  { id: 'top5_member_1', name: 'Nguyễn Trần Uyên Trang', teamId: 'bnn', image: '/assets/profile_image/TheBestMember/Banana/ntutrang.JPG' },
  { id: 'top5_member_2', name: 'Bạch Nhật Minh', teamId: 'bnn', image: '/assets/profile_image/TheBestMember/Banana/bnminh.JPG' },
  { id: 'top5_member_3', name: 'Mai Vũ Phúc', teamId: 'bnn', image: '/assets/profile_image/TheBestMember/Banana/mvphuc.jpg' },
  { id: 'top5_member_4', name: 'Hồ Thị Mỹ Duyên', teamId: 'bnn', image: '/assets/profile_image/TheBestMember/Banana/htmduyen.jpg' },
  { id: 'top5_member_5', name: 'Phạm Phan Bảo Trúc', teamId: 'bnn', image: '/assets/profile_image/TheBestMember/Banana/ppbtruc.jpg' },
  // NIFFLER
  { id: 'top5_member_6', name: 'Lê Long Vũ', teamId: 'niff', image: '/assets/profile_image/TheBestMember/Niffler/llvu.jpg' },
  { id: 'top5_member_7', name: 'Nguyễn Thị Thu Hiền', teamId: 'niff', image: '/assets/profile_image/TheBestMember/Niffler/ntthien.jpg' },
  { id: 'top5_member_8', name: 'Trần Trương Đức Lộc', teamId: 'niff', image: '/assets/profile_image/TheBestMember/Niffler/ttdloc.jpg' },
  { id: 'top5_member_9', name: 'Nguyễn Hữu Hòa Bình', teamId: 'niff', image: '/assets/profile_image/TheBestMember/Niffler/nhhbinh.JPG' },
  { id: 'top5_member_10', name: 'Trương Thị Trà My', teamId: 'niff', image: '/assets/profile_image/TheBestMember/Niffler/tttmy.JPG' },
  // POWER RANGERS
  { id: 'top5_member_11', name: 'Phạm Thanh Pha', teamId: 'prs', image: '/assets/profile_image/TheBestMember/Power_Rangers/ptpha.jpg' },
  { id: 'top5_member_12', name: 'Nguyễn Hữu Lập', teamId: 'prs', image: '/assets/profile_image/TheBestMember/Power_Rangers/nhlap.PNG' },
  { id: 'top5_member_13', name: 'Phạm Mạnh Dũng', teamId: 'prs', image: '/assets/profile_image/TheBestMember/Power_Rangers/pmdung.JPG' },
  { id: 'top5_member_14', name: 'Trần Dĩ Kha', teamId: 'prs', image: '/assets/profile_image/TheBestMember/Power_Rangers/tdkha.jpg' },
  { id: 'top5_member_15', name: 'Nguyễn Tấn Sinh Thời', teamId: 'prs', image: '/assets/profile_image/TheBestMember/Power_Rangers/ntsthoi.JPG' },
  // HEROES COMPANY
  { id: 'top5_member_16', name: 'Hoàng Bảo Ngọc', teamId: 'hc', image: '/assets/profile_image/TheBestMember/Heroes_Company/hbngoc.jpg' },
  { id: 'top5_member_17', name: 'Vũ Thanh Trà', teamId: 'hc', image: '/assets/profile_image/TheBestMember/Heroes_Company/vttra.jpg' },
  { id: 'top5_member_18', name: 'Nguyễn Đại Phú', teamId: 'hc', image: '/assets/profile_image/TheBestMember/Heroes_Company/ndphu.jpg' },
  { id: 'top5_member_19', name: 'Trương Thị Ngọc Huyền', teamId: 'hc', image: '/assets/profile_image/TheBestMember/Heroes_Company/ttnhuyen.jpg' },
  { id: 'top5_member_20', name: 'Thái Thành Tài', teamId: 'hc', image: '/assets/profile_image/TheBestMember/Heroes_Company/tttai.jpg' }
];

export const TOP_5_BEST_EVENTS: Top5Candidate[] = [
  { id: 'top5_event_1', name: 'HUGO CAMPING 2026 - EMBERLINE', image: '/assets/profile_image/TheBestEvent/HC26-E.png', tag: 'CAMPING RETREAT' },
  { id: 'top5_event_2', name: 'HUGO CHRISTMAS 2025 - THE GOLDEN HOUR', image: '/assets/profile_image/TheBestEvent/HC25-TGH.png', tag: 'CHRISTMAS EVENT' },
  { id: 'top5_event_3', name: 'WELCOME NEWBIE 2026 - ECLIPSE', image: '/assets/profile_image/TheBestEvent/WN26-E.png', tag: 'WELCOME EVENT' },
  { id: 'top5_event_4', name: 'ONLINE TALKSHOW - TẤM VÉ VIỄN PHƯƠNG', image: '/assets/profile_image/TheBestEvent/OT-TVVP.png', tag: 'TALKSHOW' },
  { id: 'top5_event_5', name: 'WELCOME NEWBIE 2025 - FLAREON', image: '/assets/profile_image/TheBestEvent/WN25-F.png', tag: 'WELCOME EVENT' }
];

export const TOP_5_ROOKIES: Top5Candidate[] = [
  { id: 'top5_rookie_1', name: 'Lê Long Vũ', teamId: 'niff', image: '/assets/profile_image/TheRookie/llvu.JPG' },
  { id: 'top5_rookie_2', name: 'Nguyễn Đại Phú', teamId: 'hc', image: '/assets/profile_image/TheRookie/ndphu.jpg' },
  { id: 'top5_rookie_3', name: 'Thái Thành Tài', teamId: 'hc', image: '/assets/profile_image/TheRookie/tttai.jpg' },
  { id: 'top5_rookie_4', name: 'Huỳnh Thị Thanh Lịch', teamId: 'prs', image: '/assets/profile_image/TheRookie/httlich.PNG' },
  { id: 'top5_rookie_5', name: 'Nguyễn Tấn Sinh Thời', teamId: 'prs', image: '/assets/profile_image/TheRookie/ntsthoi.JPG' }
];

export const TOP_5_PERFECT_DUOS: Top5Candidate[] = [
  { id: 'top5_duo_1', name: 'Huỳnh Thị Thanh Lịch & Trần Dĩ Kha', image: '/assets/profile_image/PerfectDuo/Lich-Kha.png' },
  { id: 'top5_duo_2', name: 'Đoàn Thanh Hậu & Hoàng Bảo Ngọc', image: '/assets/profile_image/PerfectDuo/Hau-Ngoc.png' },
  { id: 'top5_duo_3', name: 'Nguyễn Thị Thu Hiền & Trần Quốc Thái', image: '/assets/profile_image/PerfectDuo/Hien-Thai.png' },
  { id: 'top5_duo_4', name: 'Nguyễn Hữu Lập & Phạm Thanh Pha', image: '/assets/profile_image/PerfectDuo/Lap-Pha.png' },
  { id: 'top5_duo_5', name: 'Lê Long Vũ & Nguyễn Hữu Hòa Bình', image: '/assets/profile_image/PerfectDuo/Vu-Binh.png' }
];
