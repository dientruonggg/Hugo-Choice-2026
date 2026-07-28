import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

function emailApiPlugin(): Plugin {
  return {
    name: 'hugo-email-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/send-email', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const { userEmail, userName, ballot } = data;

            if (!userEmail) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Email address is required' }));
              return;
            }

            console.log(`[Hugo Email API] Direct email dispatch request for: ${userEmail}`);

            // SMTP Transporter configuration
            let transporter;
            if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
              transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 587,
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                  user: process.env.SMTP_USER,
                  pass: process.env.SMTP_PASS,
                },
              });
            } else {
              // Ethereal test SMTP account as auto-fallback
              const testAccount = await nodemailer.createTestAccount();
              transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                  user: testAccount.user,
                  pass: testAccount.pass,
                },
              });
            }

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
                  <div class="category-name">Best Team</div>
                  <div class="choice-name">${ballot?.team || 'N/A'}</div>
                </div>

                <div class="ballot-item">
                  <div class="category-name">Best Member</div>
                  <div class="choice-name">${ballot?.member || 'N/A'}</div>
                </div>

                <div class="ballot-item">
                  <div class="category-name">Best Event</div>
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

            const previewUrl = nodemailer.getTestMessageUrl(info);
            console.log(`[Hugo Email API] Direct system email dispatched to: ${userEmail}. Message ID: ${info.messageId}`);
            if (previewUrl) {
              console.log(`[Hugo Email API] Test Email Preview Link: ${previewUrl}`);
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: true,
              message: `System email sent to ${userEmail}`,
              previewUrl: previewUrl || undefined,
              configuredSmtp: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER)
            }));
          } catch (err: any) {
            console.error('[Hugo Email API] Error sending email:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err?.message || 'Failed to send email' }));
          }
        });
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), emailApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
