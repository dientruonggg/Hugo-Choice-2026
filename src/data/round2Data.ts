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
  {
    id: 'top5_member_1',
    name: 'Đào Tiến Huy',
    teamId: 'prs',
    image: '/assets/profile_image/TheBestMember/dth.png',
    description: 'Thành viên năng nổ với cống hiến vượt bậc'
  },
  {
    id: 'top5_member_2',
    name: 'Nguyễn Tuyết Mai',
    teamId: 'hc',
    image: '/assets/profile_image/TheBestMember/ntm.png',
    description: 'Gương mặt nhiệt huyết và đầy trách nhiệm'
  },
  {
    id: 'top5_member_3',
    name: 'Trần Anh Khoa',
    teamId: 'bnn',
    image: '/assets/profile_image/TheBestMember/tak.png',
    description: 'Tinh thần sáng tạo và kết nối xuất sắc'
  },
  {
    id: 'top5_member_4',
    name: 'Trịnh Đông Anh',
    teamId: 'niff',
    image: '/assets/profile_image/TheBestMember/tda.png',
    description: 'Cá nhân bứt phá và tỏa sáng rực rỡ'
  },
  {
    id: 'top5_member_5',
    name: 'Trần Thị Thanh Thảo',
    teamId: 'bnn',
    image: '/assets/profile_image/TheBestMember/tttt.png',
    description: 'Cống hiến bền bỉ và tạo động lực cho câu lạc bộ'
  }
];

export const TOP_5_BEST_EVENTS: Top5Candidate[] = [
  {
    id: 'top5_event_1',
    name: 'HUGO CAMPING 2026 - EMBERLINE',
    image: '/assets/profile_image/TheBestEvent/Camping.png',
    tag: 'CAMPING RETREAT',
    description: 'Chuyến dã ngoại đáng nhớ bùng nổ năng lượng'
  },
  {
    id: 'top5_event_2',
    name: 'WELCOME NEWBIE 2026 - ECLIPSE',
    image: '/assets/profile_image/TheBestEvent/WN.png',
    tag: 'WELCOME EVENT',
    description: 'Sự kiện chào đón tân binh ấn tượng'
  },
  {
    id: 'top5_event_3',
    name: 'HUGO WORKSHOP - INSIDER SECRETS',
    image: '/assets/profile_image/TheBestEvent/Workshop.png',
    tag: 'WORKSHOP',
    description: 'Buổi chia sẻ kỹ năng chuyên sâu'
  },
  {
    id: 'top5_event_4',
    name: 'ANGEL & DEMON NIGHT',
    image: '/assets/profile_image/TheBestEvent/angel.png',
    tag: 'NIGHT EVENT',
    description: 'Đêm tiệc giao lưu bùng nổ cảm xúc'
  },
  {
    id: 'top5_event_5',
    name: 'YEAR IN INK 2026',
    image: '/assets/profile_image/TheBestEvent/yearinink.png',
    tag: 'CELEBRATION',
    description: 'Sự kiện tổng kết & vinh danh dấu ấn'
  }
];

export const TOP_5_ROOKIES: Top5Candidate[] = [
  {
    id: 'top5_rookie_1',
    name: 'Huỳnh Tiến Phát',
    teamId: 'prs',
    image: '/assets/profile_image/TheRookie/htp.png',
    description: 'Tân binh triển vọng và bứt phá mạnh mẽ'
  },
  {
    id: 'top5_rookie_2',
    name: 'Nguyễn Thị Uyên Trang',
    teamId: 'hc',
    image: '/assets/profile_image/TheRookie/ntut.png',
    description: 'Thế hệ Gen mới tràn đầy năng lượng'
  },
  {
    id: 'top5_rookie_3',
    name: 'Phạm Thị Quỳnh Trang',
    teamId: 'bnn',
    image: '/assets/profile_image/TheRookie/ptqt.png',
    description: 'Tích cực tham gia mọi hoạt động CLB'
  },
  {
    id: 'top5_rookie_4',
    name: 'Trần Minh Triết',
    teamId: 'niff',
    image: '/assets/profile_image/TheRookie/tmt.png',
    description: 'Gương mặt tân binh tài năng và sáng tạo'
  },
  {
    id: 'top5_rookie_5',
    name: 'Trần Thị Thuý Linh',
    teamId: 'bnn',
    image: '/assets/profile_image/TheRookie/tttl.png',
    description: 'Sự xuất hiện nổi bật trong thế hệ mới'
  }
];

export const TOP_5_PERFECT_DUOS: Top5Candidate[] = [
  {
    id: 'top5_duo_1',
    name: 'Đông Anh & Lê Khanh',
    image: '/assets/profile_image/PerfectDuo/DA-LK.png',
    description: 'Bộ đôi ăn ý & đồng hành tích cực'
  },
  {
    id: 'top5_duo_2',
    name: 'Hữu Phước & Hồng Giang',
    image: '/assets/profile_image/PerfectDuo/Phuoc-Giang.png',
    description: 'Cặp cạ cứng tạo nên nhiều dấu ấn'
  },
  {
    id: 'top5_duo_3',
    name: 'Tuấn Anh & Nhật Quang',
    image: '/assets/profile_image/PerfectDuo/TA-QN.png',
    description: 'Đồng đội nhịp nhàng trong mọi sự kiện'
  },
  {
    id: 'top5_duo_4',
    name: 'Phương Uyên & Anh Khoa',
    image: '/assets/profile_image/PerfectDuo/Uyen-Khoa.png',
    description: 'Bộ đôi kết hợp ăn ý và sáng tạo'
  },
  {
    id: 'top5_duo_5',
    name: 'Trần Võ & Văn Thiện',
    image: '/assets/profile_image/PerfectDuo/Vo-Thien.png',
    description: 'Cặp đôi năng nổ và hết mình'
  }
];
