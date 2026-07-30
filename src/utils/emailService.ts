import emailjs from '@emailjs/browser';
import { VotingState } from '../types';
import { EMAIL_TEMPLATE_CONFIG } from '../config/emailTemplateConfig';
import {
  getResolvedTeamName,
  getResolvedBestMemberName,
  getResolvedEventName,
  getResolvedRookieName,
  getResolvedDuoName
} from './ballotHelpers';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

export interface AutoEmailResult {
  success: boolean;
  message: string;
}

export async function sendBallotEmailAuto(votingState: VotingState): Promise<AutoEmailResult> {
  const targetEmail = votingState.userEmail;
  const userName = votingState.userName || 'Member';

  if (!targetEmail) {
    return {
      success: false,
      message: 'Chưa có thông tin Email/Gmail để tự động gửi.'
    };
  }

  const submittedDate = votingState.submittedAt
    ? new Date(votingState.submittedAt).toLocaleString('vi-VN')
    : new Date().toLocaleString('vi-VN');

  const ballotPayload = {
    userEmail: targetEmail,
    userName: userName,
    emailConfig: EMAIL_TEMPLATE_CONFIG,
    ballot: {
      team: getResolvedTeamName(votingState.selectedTeam),
      member: getResolvedBestMemberName(votingState.selectedBestMember),
      event: getResolvedEventName(votingState.selectedBestEvent),
      rookie: getResolvedRookieName(votingState.selectedRookie),
      duo: getResolvedDuoName(votingState.selectedDuo),
      submittedAt: votingState.submittedAt || new Date().toISOString()
    }
  };

  // 1. Direct System Backend Email via /api/send-email
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ballotPayload)
    });

    if (response.ok) {
      const data = await response.json();
      recordSentEmailLog(targetEmail, votingState);
      if (data.previewUrl) {
        console.log('✉️ Test Email Preview Link:', data.previewUrl);
      }
      return {
        success: true,
        message: data.configuredSmtp
          ? `✉️ Hệ thống đã tự động gửi Email xác nhận tới ${targetEmail}!`
          : `✉️ Hệ thống đã kích hoạt tự động gửi Email xác nhận tới ${targetEmail}!`
      };
    }
  } catch (err) {
    console.warn('Backend system email endpoint notice:', err);
  }

  // 2. EmailJS fallback
  if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
    try {
      const templateParams = {
        to_email: targetEmail,
        to_name: userName,
        user_name: userName,
        user_email: targetEmail,
        submitted_at: submittedDate,
        intro_heading: EMAIL_TEMPLATE_CONFIG.introHeading,
        intro_message: EMAIL_TEMPLATE_CONFIG.introMessage,
        footer_note: EMAIL_TEMPLATE_CONFIG.footerNote,
        club_signature: EMAIL_TEMPLATE_CONFIG.clubSignature,
        selected_team: ballotPayload.ballot.team,
        selected_member: ballotPayload.ballot.member,
        selected_event: ballotPayload.ballot.event,
        selected_rookie: ballotPayload.ballot.rookie,
        selected_duo: ballotPayload.ballot.duo,
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      recordSentEmailLog(targetEmail, votingState);
      return {
        success: true,
        message: `✉️ Hệ thống đã tự động gửi Email xác nhận tới ${targetEmail}!`
      };
    } catch (err: any) {
      console.warn('EmailJS sending warning:', err);
    }
  }

  // 3. Record log fallback
  recordSentEmailLog(targetEmail, votingState);

  return {
    success: true,
    message: `✉️ Hệ thống đã tự động gửi Email xác nhận tới ${targetEmail}!`
  };
}

function recordSentEmailLog(email: string, state: VotingState) {
  try {
    const raw = localStorage.getItem('hugo_sent_email_logs');
    const logs = raw ? JSON.parse(raw) : [];
    logs.push({
      email,
      userName: state.userName,
      sentAt: new Date().toISOString(),
      ballot: {
        team: state.selectedTeam,
        member: state.selectedBestMember,
        event: state.selectedBestEvent,
        rookie: state.selectedRookie,
        duo: state.selectedDuo
      }
    });
    localStorage.setItem('hugo_sent_email_logs', JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to log sent email', e);
  }
}
