import { HugoTeam } from '../types';

export interface ClubMember {
  id: string;
  name: string;
  teamId: HugoTeam;
  teamName: string;
}

export function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export function getGivenName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts[parts.length - 1] || fullName;
}

const rawBananaMembers = [
  'Nguyễn Ngọc Tường Vy',
  'Trần Phan Thúy Hiền',
  'Trần Văn Lợi',
  'Nguyễn Lê Hồng Giang',
  'Trần Tuấn Võ',
  'Trần Thị Ngọc Trâm',
  'Nguyễn Phước Linh',
  'Trần Thị Ngọc Nhi',
  'Võ Thị Hải Yến',
  'Võ Văn Thiện',
  'Võ Hoàng Huy',
  'Phạm Trần Yến Nhi',
  'Nguyễn Trần Uyên Trang',
  'Lê Nguyên Hân',
  'Nguyễn Hà Phương Uyên',
  'Nguyễn Thị Ánh Ngọc',
  'Mai Vũ Phúc',
  'Trần Khánh Quốc',
  'Lê Thị Anh Thư',
  'Bạch Nhật Minh',
  'Hoàng Ngọc Hưng',
  'Trần Nam Khánh',
  'Trần Hoài An',
  'Võ Đặng Nhật Quang',
  'Hồ Thị Mỹ Duyên',
  'Hoàng Như Ý',
  'Nguyễn Duy Khánh',
  'Thái Hữu Phước',
  'Phạm Anh Hào',
  'Huỳnh Nguyễn Thế Hiển',
  'Phạm Võ Thanh Tú',
  'Hoàng Hải Long',
  'Lê Doãn Phú',
  'Nguyễn Tiến Hưng',
  'Hồ Thị Thuỷ Tiên',
  'Trần Phước Anh Vũ',
  'Nguyễn Vũ Phong',
  'Phạm Phan Bảo Trúc'
];

const rawPowerRangersMembers = [
  'Phạm Mạnh Dũng',
  'Nguyễn Nhật Lâm',
  'Lê Phước Anh Tuấn',
  'Huỳnh Văn Hồng Sang',
  'Nguyễn Ngọc Quyên',
  'Trần Dĩ Kha',
  'Trịnh Hoàng Khoa',
  'Huỳnh Hoàng Thiện Kim',
  'Lê Quang Nhật',
  'Lê Thị Loan Âu',
  'Trần Thị Thu Thủy',
  'Mai Trâm Anh',
  'Nguyễn Xuân Hiếu',
  'Hoàng Văn Thắng',
  'Đặng Bảo Chiến',
  'Bùi Thái Phước',
  'Đinh Bảo Châu Thi',
  'Đỗ Thị Phương Linh',
  'Phan Nữ Kiều Hạnh',
  'Nguyễn Hồng Trang',
  'Huỳnh Bảo Quyên',
  'Trịnh Đình Lê Huy',
  'Trần Xuân Khánh Trình',
  'Phạm Tấn Quốc Tuấn',
  'Nguyễn Thành Long',
  'Trần Thị Thảo Ly',
  'Dương Mỹ Phương Anh',
  'Nguyễn Quang Thắng',
  'Mai Thuỳ Linh',
  'Nguyễn Hữu Phước Lộc',
  'Hoàng Văn Thanh',
  'Nguyễn Phước Bình',
  'Nguyễn Hữu Lập',
  'Nguyễn Thủy Tiên',
  'Nguyễn Vũ Thịnh Anh',
  'Phạm Thanh Pha',
  'Trương Đinh Như Ý',
  'Hà Châu Hân',
  'Nguyễn Vĩnh Phúc',
  'Phạm Chiêu Uyên',
  'Nguyễn Văn Tùng Dương',
  'Dương Phước Hoàng',
  'Ngô Thuỳ Linh',
  'Huỳnh Thị Thanh Lịch',
  'Nguyễn Thị Nghĩa',
  'Hồ Văn Trung Hiếu',
  'Hoàng Tam Nguyên',
  'Nguyễn Thị Ngọc Minh',
  'Hồ Mai Anh Thư',
  'Đỗ Nguyễn Cẩm Tú',
  'Nguyễn Song Bảo Nhân',
  'Nguyễn Tấn Sinh Thời',
  'Nguyễn Trần Khánh Ngọc',
  'Nguyễn Minh Mẫn',
  'Lê Nhật Anh'
];

const rawHeroesCompanyMembers = [
  'Trương Đình Việt',
  'Lê Cao Dương',
  'Nguyễn Đức Quang',
  'Trần Nguyên Khánh',
  'Huỳnh Kim Hoàng',
  'Nguyễn Minh Duyên',
  'Trần Anh Khoa',
  'Trần Huy Hoàng',
  'Trương Quang Lộc',
  'Phùng Ngọc Uyên',
  'Trần Thị Thanh Nga',
  'Nguyễn Hoàng Uyên',
  'Ngô Thị Mỵ',
  'Nguyễn Ngọc Minh Tâm',
  'Lê Văn Đức',
  'Hoàng Huy Học',
  'Võ Tuấn Lâm',
  'Bùi Văn An Huy',
  'Nguyễn Thị Thùy Linh',
  'Nguyễn Hữu Minh Quân',
  'Lê Thanh Phong',
  'Nguyễn Tạ Đình Việt',
  'Thái Minh Tâm',
  'Nguyễn Mạnh Kiên',
  'Lương Công Khánh',
  'Nguyễn Gia Huy',
  'Nguyễn Thị Trà My',
  'Đinh Thị Đài Nguyên',
  'Bùi Thị Thanh Thảo',
  'Nguyễn Quỳnh Như',
  'Đỗ Thị Như Ý',
  'Hoàng Bảo Ngọc',
  'Lê Trần Mỹ Hạnh',
  'Nguyễn Quỳnh Trâm',
  'Trương Thị Ngọc Huyền',
  'Vũ Thanh Trà',
  'Trần Lê Linh Đan',
  'Trần Quốc Thái',
  'Đoàn Thanh Hậu',
  'Trương Bùi Diễn',
  'Nguyễn Nguyễn Thái Tuệ',
  'Nguyễn Minh Khánh',
  'Huỳnh Thị Hồng Tú',
  'Nguyễn Đại Phú',
  'Phạm Như Anh Thư',
  'Trương Tấn Khoa',
  'Nguyễn Tấn Khoa',
  'Võ Thanh Quân',
  'Thái Thành Tài',
  'Nguyễn Phước Nam Hải',
  'Nguyễn Đặng Minh Hương',
  'Bảo Duy',
  'Nguyễn Đông Phúc',
  'Huỳnh Công Minh',
  'Nguyễn Văn Huy'
];

const rawNifflerMembers = [
  'Ngô Trần Liên Khương',
  'Nguyễn Vy Thảo Lam',
  'Phạm Thị Mỹ Tâm',
  'Tôn Thất Dương',
  'Dương Thị Hoài',
  'Đoàn Nhật Huy',
  'Nguyễn Lê An My',
  'Đoàn Nhật Hoàng',
  'Lê Thị Thuỳ Linh',
  'Trần Duy Anh',
  'Tăng Thanh Tùng',
  'Nguyễn Hạnh Nguyên',
  'Hồ Thị Phượng',
  'Nguyễn Hồng Đức',
  'Trần Đình Phương Thảo',
  'Lê Trí Phương Nam',
  'Đoàn Minh Hiếu',
  'Lê Văn Khoa',
  'Trương Thị Trà My',
  'Phan Văn Hiếu',
  'Lê Dịu Hương',
  'Phùng Hữu Hải Anh',
  'Đỗ Trung Nguyên',
  'Trương Bùi Minh Châu',
  'Phan Thanh Huyền',
  'Nguyễn Hữu Hòa Bình',
  'Nguyễn Thị Thu Hiền',
  'Nguyễn Quốc Cường',
  'Nguyễn Doãn Minh Tâm',
  'Trần Nguyễn Đăng Khoa',
  'Nguyễn Thế Vân Nhi',
  'Huỳnh Uyên Quế Trân',
  'Trần Trương Đức Lộc',
  'Võ Nguyên Hưng',
  'Nguyễn Đoàn Hoàng Hiệp',
  'Võ Văn Triều',
  'Trần Nguyễn Thành Nhân',
  'Lê Long Vũ',
  'Bùi Phương Ánh Dương',
  'Trương Nguyễn Nhật Hàn',
  'Phan Ngọc Minh Hằng',
  'Đào Xuân Bách',
  'Nguyễn Anh Bão'
];

export const ALL_MEMBERS: ClubMember[] = [
  ...rawBananaMembers.map((name, idx) => ({
    id: `bnn-${idx + 1}`,
    name: name.trim().replace(/\.$/, ''),
    teamId: 'bnn' as HugoTeam,
    teamName: 'Banana'
  })),
  ...rawPowerRangersMembers.map((name, idx) => ({
    id: `prs-${idx + 1}`,
    name: name.trim().replace(/\.$/, ''),
    teamId: 'prs' as HugoTeam,
    teamName: 'Power Rangers'
  })),
  ...rawHeroesCompanyMembers.map((name, idx) => ({
    id: `hc-${idx + 1}`,
    name: name.trim().replace(/\.$/, ''),
    teamId: 'hc' as HugoTeam,
    teamName: 'Heroes Company'
  })),
  ...rawNifflerMembers.map((name, idx) => ({
    id: `niff-${idx + 1}`,
    name: name.trim().replace(/\.$/, ''),
    teamId: 'niff' as HugoTeam,
    teamName: 'Nifflers'
  }))
];

export function getAvailableGivenNameInitials(members: ClubMember[] = ALL_MEMBERS): string[] {
  const lettersSet = new Set<string>();
  members.forEach(m => {
    const given = getGivenName(m.name);
    const norm = removeVietnameseTones(given).toUpperCase();
    if (norm.length > 0) {
      lettersSet.add(norm[0]);
    }
  });
  return Array.from(lettersSet).sort((a, b) => a.localeCompare(b, 'vi'));
}

export function filterMembers(
  query: string,
  teamFilter: HugoTeam | 'all' = 'all',
  letterFilter: string = 'all'
): ClubMember[] {
  const normalizedQuery = removeVietnameseTones(query.trim());
  const normalizedLetter = letterFilter !== 'all' ? removeVietnameseTones(letterFilter).toUpperCase() : '';

  const list = ALL_MEMBERS.filter((member) => {
    const matchesTeam = teamFilter === 'all' || member.teamId === teamFilter;
    if (!matchesTeam) return false;

    if (normalizedLetter) {
      const given = getGivenName(member.name);
      const normGiven = removeVietnameseTones(given).toUpperCase();
      const normFull = removeVietnameseTones(member.name).toUpperCase();
      const matchesGivenLetter = normGiven.startsWith(normalizedLetter);
      const matchesFullLetter = normFull.startsWith(normalizedLetter);
      if (!matchesGivenLetter && !matchesFullLetter) return false;
    }

    if (!normalizedQuery) return true;
    const normalizedName = removeVietnameseTones(member.name);
    return normalizedName.includes(normalizedQuery);
  });

  return list.sort((a, b) => {
    const givenA = getGivenName(a.name);
    const givenB = getGivenName(b.name);
    const normA = removeVietnameseTones(givenA);
    const normB = removeVietnameseTones(givenB);

    const comp = normA.localeCompare(normB, 'vi');
    if (comp !== 0) return comp;

    // Tie breaker: compare full name
    return removeVietnameseTones(a.name).localeCompare(removeVietnameseTones(b.name), 'vi');
  });
}

