import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { generateBallotEmailHtml } from './src/utils/generateBallotEmailHtml.js';

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

            const htmlContent = generateBallotEmailHtml({ userEmail, userName, ballot });

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
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]',
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
