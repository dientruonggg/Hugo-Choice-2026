import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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
  const { userEmail, userName, ballot } = req.body || {};

  if (!userEmail) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  try {
    const transporter = await createTransporter();
    const sender = process.env.SMTP_FROM || '"Hugo Award 2026" <no-reply@hugoenglishclub.com>';
    const name = userName || 'Voter';
    const submittedAt = ballot?.submittedAt ? new Date(ballot.submittedAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN');

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b140d; color: #ffffff; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #111e14; border: 2px solid #fbbf24; border-radius: 16px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; }
        .header h1 { color: #fbbf24; margin: 0; font-size: 26px; }
        .header p { color: #34d399; margin: 5px 0 0 0; font-size: 14px; }
        .voter-info { background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 10px; margin: 20px 0; border: 1px solid rgba(255,255,255,0.1); }
        .ballot-item { background: rgba(255,255,255,0.03); padding: 12px 16px; border-radius: 10px; margin-bottom: 10px; border-left: 4px solid #fbbf24; }
        .category-name { color: #fef08a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
        .choice-name { color: #ffffff; font-size: 16px; font-weight: bold; margin-top: 4px; }
        .footer { text-align: center; font-size: 12px; color: #9ca3af; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏆 Hugo Award 2026</h1>
          <p>Official Voting Ballot Confirmation</p>
        </div>

        <div class="voter-info">
          <p style="margin: 0;"><strong>Voter:</strong> ${name}</p>
          <p style="margin: 4px 0 0 0;"><strong>Gmail:</strong> ${userEmail}</p>
          <p style="margin: 4px 0 0 0; color: #9ca3af; font-size: 12px;">Submitted on: ${submittedAt}</p>
        </div>

        <h3 style="color: #fbbf24; margin-bottom: 12px;">Official Ballot Selections</h3>

        <div class="ballot-item">
          <div class="category-name">Nature Team</div>
          <div class="choice-name">${ballot?.team || 'N/A'}</div>
        </div>

        <div class="ballot-item">
          <div class="category-name">Nature Best Member</div>
          <div class="choice-name">${ballot?.member || 'N/A'}</div>
        </div>

        <div class="ballot-item">
          <div class="category-name">Nature Best Event</div>
          <div class="choice-name">${ballot?.event || 'N/A'}</div>
        </div>

        <div class="ballot-item">
          <div class="category-name">The Rookie Award</div>
          <div class="choice-name">${ballot?.rookie || 'N/A'}</div>
        </div>

        <div class="ballot-item">
          <div class="category-name">The Perfect Duo</div>
          <div class="choice-name">${ballot?.duo || 'N/A'}</div>
        </div>

        <div class="footer">
          <p>Cảm ơn bạn đã tham gia bình chọn tại <strong>Hugo Award 2026</strong>!</p>
          <p>© 2026 Hugo English Club. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const info = await transporter.sendMail({
      from: sender,
      to: userEmail,
      subject: `[Hugo Award 2026] Official Voting Ballot - ${name}`,
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
