import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBallotEmailHtml } from './src/utils/generateBallotEmailHtml.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Configure Nodemailer Transporter
const createTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback to test account if SMTP env vars are not set
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

app.post('/api/send-email', async (req, res) => {
  const { userEmail, userName, ballot, emailConfig } = req.body || {};

  if (!userEmail) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  try {
    const transporter = await createTransporter();
    const sender = process.env.SMTP_FROM || '"Hugo Award 2026" <no-reply@hugoenglishclub.com>';
    const name = userName || 'Voter';
    const submittedAt = ballot?.submittedAt ? new Date(ballot.submittedAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN');

    const introHeading = emailConfig?.introHeading || 'Cảm ơn bạn đã tham gia bình chọn tại Hugo Award 2026! 🎉';
    const introMessage = emailConfig?.introMessage || 'Chào bạn,\n\nBan Tổ Chức Hugo English Club xin gửi lời cảm ơn chân thành nhất đến bạn!';
    const footerNote = emailConfig?.footerNote || '✨ Đừng quên theo dõi Fanpage Hugo English Club!';
    const clubSignature = emailConfig?.clubSignature || 'Trân trọng,\nBan Tổ Chức Hugo Award 2026 • Hugo English Club';
    const subjectTitle = emailConfig?.subjectTitle || `[Hugo Award 2026] Official Voting Ballot - ${name}`;

    const formattedIntroHtml = introMessage
      .split('\n\n')
      .map(p => `<p style="line-height: 1.6; font-size: 14px; margin-bottom: 12px; color: #e2e8f0;">${p.replace(/\n/g, '<br/>')}</p>`)
      .join('');

    const htmlContent = generateBallotEmailHtml({ userEmail, userName, ballot, emailConfig });

    const info = await transporter.sendMail({
      from: sender,
      to: userEmail,
      subject: subjectTitle,
      html: htmlContent,
    });

    console.log('Direct system email dispatched successfully to:', userEmail, 'Message ID:', info.messageId);

    const testUrl = nodemailer.getTestMessageUrl(info);
    res.json({
      success: true,
      message: `System email sent to ${userEmail}!`,
      previewUrl: testUrl || undefined
    });
  } catch (error) {
    console.error('Failed to send backend system email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Serve static dist in production
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Hugo Award Direct Email Server running on port ${PORT}`);
});
