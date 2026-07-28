# 🏆 Hugo Award 2026 - Hugo English Club

> **Hugo Award 2026** là hệ thống bình chọn trực tuyến chính thức của **Hugo English Club**, được thiết kế với giao diện hiện đại, sống động và quy trình bình chọn minh bạch, hấp dẫn.

---

## 🌟 Tính Năng Nổi Bật

- 🗳️ **Quy Trình Bình Chọn Multi-Step**: Trải nghiệm bình chọn qua từng danh mục giải thưởng mượt mà:
  - **Best Team**: Bình chọn Ban/Đội được yêu thích nhất.
  - **Best Member**: Thành viên xuất sắc nhất năm.
  - **Best Event**: Sự kiện ấn tượng nhất năm.
  - **The Rookie**: Gương mặt mới triển vọng nhất.
  - **The Perfect Duo**: Cặp đôi ăn ý nhất.
- 🔐 **Xác Thực Tài Khoản Google (Firebase Auth)**: Đăng nhập bằng Gmail để lưu trữ lá phiếu và đảm bảo tính chính xác.
- 📊 **Real-time Live Leaderboard**: Xem bảng xếp hạng kết quả bình chọn theo thời gian thực (dành cho Admin/BTC).
- 🖼️ **Tải Xuất Phiếu Bầu Dạng PNG**: Tự động tạo và tải xuống thẻ kết quả bình chọn hình ảnh PNG chất lượng cao để chia sẻ lên Mạng xã hội.
- ✉️ **Gửi Email Xác Nhận Tự Động**: Hệ thống gửi email xác nhận phiếu bầu chi tiết đến Gmail của người tham gia qua Nodemailer / EmailJS.
- 🎨 **Giao Diện & Hiệu Ứng Sống Động**: Thiết kế nổi bật với hiệu ứng hạt bướm động (`ButterflyParticle`), hiệu ứng pháo hoa confetti khi gửi phiếu và âm thanh tương tác.

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **React 19** & **TypeScript**
- **Vite** (Build tool cực nhanh)
- **TailwindCSS v4** (Styling)
- **Motion (Framer Motion)** (Animations)
- **Lucide React** (Iconography)
- **html2canvas** (Xuất ảnh PNG)
- **canvas-confetti** (Hiệu ứng chúc mừng)

### Backend & Service Integrations
- **Node.js & Express.js** (Server gửi mail backend API)
- **Nodemailer** / **EmailJS** (Dịch vụ gửi Email)
- **Firebase Auth** (Xác thực tài khoản Google)

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Local Setup)

### Yêu Cầu Tiền Đề
- **Node.js**: `v18.x` trở lên (hoặc **Bun**)
- **npm**, **yarn**, hoặc **bun**

### 1. Clone Repository & Cài Đặt Dependencies

```bash
git clone https://github.com/dientruonggg/Hugo-Choice-2026.git
cd Hugo-Choice-2026/hugo-award-2026---hugo-english-club

# Cài đặt thư viện bằng npm
npm install
# Hoặc bằng bun
bun install
```

### 2. Cấu Hình Biến Môi Trường (`.env`)

Tạo file `.env` dựa trên file mẫu `.env.example`:

```bash
cp .env.example .env
```

Điền các thông tin cấu hình cần thiết trong `.env`:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id

# SMTP Email Configuration (Dành cho Express Mail Server)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="Hugo Award 2026 <no-reply@hugoenglishclub.com>"
```

### 3. Chạy Ứng Dụng

#### Chạy giao diện Development (Vite Dev Server)
```bash
npm run dev
```
Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:3000`

#### Chạy Server Gửi Mail Backend (Express)
```bash
node server.js
```
Server backend sẽ chạy tại cổng `3001` (`http://localhost:3001`).

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
hugo-award-2026---hugo-english-club/
├── public/                 # Assets tĩnh (Hình ảnh đại diện, logo, âm thanh)
├── src/
│   ├── components/        # Các UI Components dùng chung (Header, Drawer, Modals...)
│   │   └── screens/       # Màn hình chính của từng bước bình chọn
│   ├── data/              # Dữ liệu candidates/events/teams ngầm định
│   ├── types.ts           # Định nghĩa TypeScript interfaces & types
│   ├── utils/             # Các utilities (ballotStorage, emailService, firebase...)
│   ├── App.tsx            # Component chính quản lý luồng trạng thái
│   └── main.tsx           # Entry point của ứng dụng React
├── server.js              # Express Backend Server gửi Email xác nhận
├── vite.config.ts         # Cấu hình Vite
└── package.json           # Khai báo dependencies và npm scripts
```

---

## 📜 Scripts

| Lệnh `npm run` | Mô tả |
| :--- | :--- |
| `npm run dev` | Khởi chạy Vite Dev Server ở chế độ phát triển |
| `npm run build` | Biên dịch dự án ra thư mục `dist/` cho production |
| `npm run preview` | Xem trước bản build production |
| `npm run lint` | Kiểm tra lỗi TypeScript |

---

## 🤝 Quyền Sở Hữu & Đóng Góp

Được phát triển dành riêng cho **Hugo English Club - Hugo Award 2026**.  
© 2026 **Hugo English Club**. All rights reserved.
