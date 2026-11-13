import { sendEmail, EmailSendResult } from './emailService';
import { logger } from '../utils/logger';

export interface AdminOtpEmailOptions {
  to: string;
  adminName: string;
  otp: string;
  expiresInMinutes?: number;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Builds the professional branded HTML email for the temporary 8-digit admin login password.
 */
export function buildAdminOtpEmailHtml(options: {
  adminName: string;
  otp: string;
  expiresInMinutes: number;
}): string {
  const { adminName, otp, expiresInMinutes } = options;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preferred Tax Consultancy – Temporary Admin Login Password</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #041318;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e2e8f0;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
    }
    .wrapper {
      width: 100%;
      background-color: #041318;
      padding: 40px 16px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background: linear-gradient(180deg, #071f28 0%, #031319 100%);
      border: 1px solid rgba(45, 212, 191, 0.25);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .header {
      padding: 36px 32px 24px;
      text-align: center;
      background: linear-gradient(180deg, rgba(13, 148, 136, 0.15) 0%, transparent 100%);
      border-bottom: 1px solid rgba(45, 212, 191, 0.15);
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      background-color: rgba(45, 212, 191, 0.12);
      border: 1px solid rgba(45, 212, 191, 0.35);
      border-radius: 9999px;
      color: #2dd4bf;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 14px;
    }
    .brand-title {
      color: #ffffff;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0 0 6px 0;
    }
    .brand-sub {
      color: #94a3b8;
      font-size: 13px;
      margin: 0;
    }
    .content {
      padding: 36px 32px;
    }
    .greeting {
      font-size: 16px;
      color: #f1f5f9;
      margin-top: 0;
      margin-bottom: 16px;
      font-weight: 600;
    }
    .message {
      font-size: 14px;
      line-height: 1.65;
      color: #cbd5e1;
      margin-bottom: 28px;
    }
    .otp-box {
      background: rgba(2, 44, 48, 0.65);
      border: 2px dashed rgba(45, 212, 191, 0.45);
      border-radius: 14px;
      padding: 24px 20px;
      text-align: center;
      margin-bottom: 28px;
    }
    .otp-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #5eead4;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace, monospace;
      font-size: 38px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: 10px;
      margin: 0;
      text-shadow: 0 0 20px rgba(45, 212, 191, 0.5);
    }
    .expiry-notice {
      display: inline-block;
      margin-top: 12px;
      padding: 4px 12px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 6px;
      color: #fca5a5;
      font-size: 12px;
      font-weight: 600;
    }
    .steps-card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 28px;
    }
    .steps-title {
      font-size: 13px;
      font-weight: 700;
      color: #e2e8f0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 12px 0;
    }
    .steps-list {
      margin: 0;
      padding-left: 18px;
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.6;
    }
    .steps-list li {
      margin-bottom: 6px;
    }
    .warning-box {
      background: rgba(245, 158, 11, 0.1);
      border-left: 4px solid #f59e0b;
      padding: 14px 16px;
      border-radius: 0 8px 8px 0;
      font-size: 12px;
      line-height: 1.55;
      color: #fde68a;
      margin-bottom: 28px;
    }
    .warning-box strong {
      color: #fbbf24;
    }
    .footer {
      padding: 24px 32px;
      background-color: #020b0e;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      text-align: center;
      font-size: 11px;
      color: #64748b;
      line-height: 1.6;
    }
    .footer a {
      color: #2dd4bf;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <div class="container">
            <!-- Header -->
            <div class="header">
              <span class="badge">Security Verification</span>
              <h1 class="brand-title">Preferred Tax Consultancy</h1>
              <p class="brand-sub">Smart Tax Experts (STE) Executive Admin Portal</p>
            </div>

            <!-- Body -->
            <div class="content">
              <p class="greeting">Hello, ${adminName}</p>
              <p class="message">
                A request was initiated to sign in to the Preferred Tax Consultancy Admin Control Center. Use the one-time temporary password below to authenticate your session:
              </p>

              <!-- OTP Display -->
              <div class="otp-box">
                <div class="otp-label">Temporary 8-Digit Password</div>
                <div class="otp-code">${otp}</div>
                <div class="expiry-notice">⏱ Valid for exactly ${expiresInMinutes} minutes</div>
              </div>

              <!-- Instructions -->
              <div class="steps-card">
                <div class="steps-title">Login Instructions</div>
                <ol class="steps-list">
                  <li>Return to the open Preferred Tax Consultancy Admin Login tab.</li>
                  <li>Enter or paste this 8-digit temporary password into the verification field.</li>
                  <li>Click <strong>Verify &amp; Login</strong> before the 5-minute timer expires.</li>
                </ol>
              </div>

              <!-- Security Notice -->
              <div class="warning-box">
                <strong>Important Security Notice:</strong> Never share this code with anyone. Preferred Tax Consultancy staff will never ask for your password or verification code. If you did not initiate this login attempt, please notify the security team immediately.
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p style="margin: 0 0 6px 0;">This is an automated administrative notification sent to verified administrators.</p>
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} Preferred Tax Consultancy Group. All rights reserved.</p>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

/**
 * Sends the 8-digit OTP temporary password email via the centralized SMTP service.
 */
export async function sendAdminOtpEmail(options: AdminOtpEmailOptions): Promise<EmailSendResult> {
  const expiresInMinutes = options.expiresInMinutes || 5;
  const html = buildAdminOtpEmailHtml({
    adminName: options.adminName,
    otp: options.otp,
    expiresInMinutes,
  });

  const text = `Preferred Tax Consultancy - Temporary Admin Login Password\n\n` +
    `Hello ${options.adminName},\n\n` +
    `Your temporary 8-digit admin login password is:\n\n` +
    `    ${options.otp}\n\n` +
    `This code expires in exactly ${expiresInMinutes} minutes and can only be used once.\n\n` +
    `If you did not request this login code, please disregard this email.\n\n` +
    `Preferred Tax Consultancy Group - Smart Tax Experts (STE)`;

  try {
    const result = await sendEmail({
      to: options.to,
      subject: 'Preferred Tax Consultancy – Your Temporary Admin Login Password',
      html,
      text,
    });

    if (result.success) {
      logger.info('Admin OTP temporary password email sent successfully', {
        to: options.to,
        messageId: result.messageId,
      });
    } else {
      logger.error('Failed to send admin OTP email', {
        to: options.to,
        error: result.error,
      });
    }

    return result;
  } catch (error: any) {
    logger.error('Exception sending admin OTP email', {
      to: options.to,
      error: error?.message || error,
    });
    return {
      success: false,
      error: error?.message || 'Failed to dispatch OTP email',
    };
  }
}

