export interface BallotEmailData {
  userEmail: string;
  userName?: string;
  submittedAt?: string;
  ballot?: {
    team?: string;
    member?: string;
    event?: string;
    rookie?: string;
    duo?: string;
    submittedAt?: string;
  };
  emailConfig?: {
    subjectTitle?: string;
    introHeading?: string;
    introMessage?: string;
    footerNote?: string;
    clubSignature?: string;
  };
}

export function generateBallotEmailHtml(data: BallotEmailData): string {
  const { userEmail, userName, ballot, emailConfig } = data;
  const name = userName || 'Voter';
  
  const submittedAtFormatted = ballot?.submittedAt
    ? new Date(ballot.submittedAt).toLocaleString('vi-VN')
    : data.submittedAt
    ? new Date(data.submittedAt).toLocaleString('vi-VN')
    : new Date().toLocaleString('vi-VN');

  const team = ballot?.team || 'N/A';
  const member = ballot?.member || 'N/A';
  const event = ballot?.event || 'N/A';
  const rookie = ballot?.rookie || 'N/A';
  const duo = ballot?.duo || 'N/A';

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hugo Award 2026 - Official Voting Ballot Receipt</title>
  <style>
    a { color: inherit !important; text-decoration: none !important; }
    .im { color: inherit !important; }
  </style>
</head>
<body style="margin: 0; padding: 30px 10px; background-color: #0d1710; font-family: Georgia, 'Times New Roman', serif; -webkit-font-smoothing: antialiased; color: #ffffff;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="width: 100%; background-color: #0d1710;">
    <tr>
      <td align="center">
        
        <!-- Main Receipt Container (Matches SubmissionScreen Modal UI Image 2) -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #101b13; border: 2px solid #fbbf24; border-radius: 24px; padding: 32px 24px; box-shadow: 0 0 50px rgba(251, 191, 36, 0.35); text-align: left;">
          
          <!-- Top Gold Medal Badge Circle -->
          <tr>
            <td align="center" style="padding-bottom: 12px;">
              <div style="width: 54px; height: 54px; border-radius: 50%; border: 1.5px solid #fbbf24; background-color: rgba(251, 191, 36, 0.15); text-align: center; line-height: 54px; display: inline-block;">
                <span style="font-size: 26px; line-height: 54px;">🏅</span>
              </div>
            </td>
          </tr>

          <!-- Header Title & Subtitle -->
          <tr>
            <td align="center" style="padding-bottom: 16px;">
              <h1 style="font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: bold; color: #ffffff; margin: 0 0 4px 0; letter-spacing: 1px; text-transform: uppercase;">
                HUGO AWARD 2026
              </h1>
              <p style="font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-size: 14px; color: #fde68a; margin: 0;">
                Official Voting Ballot Receipt
              </p>
            </td>
          </tr>

          <!-- Divider Line -->
          <tr>
            <td style="padding-bottom: 20px;">
              <div style="height: 1px; background-color: rgba(255, 255, 255, 0.15); width: 100%;"></div>
            </td>
          </tr>

          <!-- Ballot Card 1: Voter Name -->
          <tr>
            <td style="padding-bottom: 10px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #08100a; border: 1px solid rgba(251, 191, 36, 0.4); border-radius: 14px; padding: 14px 18px;">
                <tr>
                  <td style="font-family: Georgia, serif; color: #fef08a; font-size: 15px; font-weight: 500; width: 30%;">Voter:</td>
                  <td align="right" style="font-family: Georgia, serif; color: #ffffff; font-size: 16px; font-weight: bold;">${name}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Ballot Card 2: Gmail / Email -->
          <tr>
            <td style="padding-bottom: 10px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #08100a; border: 1px solid rgba(251, 191, 36, 0.4); border-radius: 14px; padding: 14px 18px;">
                <tr>
                  <td style="font-family: Georgia, serif; color: #fef08a; font-size: 15px; font-weight: 500; width: 35%;">Gmail / Email:</td>
                  <td align="right" style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px; font-weight: bold;">
                    <a href="mailto:${userEmail}" style="color: #34d399 !important; text-decoration: none !important;">${userEmail}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Ballot Card 3: Best Team -->
          <tr>
            <td style="padding-bottom: 10px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #08100a; border: 1px solid rgba(251, 191, 36, 0.4); border-radius: 14px; padding: 14px 18px;">
                <tr>
                  <td style="font-family: Georgia, serif; color: #fef08a; font-size: 15px; font-weight: 500; width: 35%;">Best Team:</td>
                  <td align="right" style="font-family: Georgia, serif; color: #fbbf24; font-size: 16px; font-weight: bold;">${team}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Ballot Card 4: Best Member -->
          <tr>
            <td style="padding-bottom: 10px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #08100a; border: 1px solid rgba(251, 191, 36, 0.4); border-radius: 14px; padding: 14px 18px;">
                <tr>
                  <td style="font-family: Georgia, serif; color: #fef08a; font-size: 15px; font-weight: 500; width: 35%;">Best Member:</td>
                  <td align="right" style="font-family: Georgia, serif; color: #fbbf24; font-size: 16px; font-weight: bold;">${member}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Ballot Card 5: Best Event -->
          <tr>
            <td style="padding-bottom: 10px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #08100a; border: 1px solid rgba(251, 191, 36, 0.4); border-radius: 14px; padding: 14px 18px;">
                <tr>
                  <td style="font-family: Georgia, serif; color: #fef08a; font-size: 15px; font-weight: 500; width: 35%;">Best Event:</td>
                  <td align="right" style="font-family: Georgia, serif; color: #fbbf24; font-size: 14px; font-weight: bold;">${event}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Ballot Card 6: The Rookie -->
          <tr>
            <td style="padding-bottom: 10px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #08100a; border: 1px solid rgba(251, 191, 36, 0.4); border-radius: 14px; padding: 14px 18px;">
                <tr>
                  <td style="font-family: Georgia, serif; color: #fef08a; font-size: 15px; font-weight: 500; width: 35%;">The Rookie:</td>
                  <td align="right" style="font-family: Georgia, serif; color: #fbbf24; font-size: 16px; font-weight: bold;">${rookie}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Ballot Card 7: The Perfect Duo -->
          <tr>
            <td style="padding-bottom: 16px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #08100a; border: 1px solid rgba(251, 191, 36, 0.4); border-radius: 14px; padding: 14px 18px;">
                <tr>
                  <td style="font-family: Georgia, serif; color: #fef08a; font-size: 15px; font-weight: 500; width: 40%;">The Perfect Duo:</td>
                  <td align="right" style="font-family: Georgia, serif; color: #fbbf24; font-size: 15px; font-weight: bold;">${duo}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Timestamp -->
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <p style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #fde68a; opacity: 0.85; margin: 0;">
                Submitted on: ${submittedAtFormatted}
              </p>
            </td>
          </tr>

          <!-- Gold Leaderboard Button -->
          <tr>
            <td align="center" style="padding-bottom: 16px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); background-color: #fbbf24; border-radius: 9999px; padding: 14px 20px;">
                    <a href="https://hugo-award-2026.vercel.app" style="color: #000000 !important; font-family: Georgia, serif; font-size: 14px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; text-decoration: none !important; display: block;">
                      ☑ VIEW LIVE LEADERBOARD
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Note -->
          <tr>
            <td align="center" style="padding-top: 8px;">
              <p style="font-family: Georgia, serif; font-style: italic; font-size: 13px; color: #fbbf24; margin: 0;">
                Thank you for voting at Hugo Award 2026! • Hugo English Club
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}
