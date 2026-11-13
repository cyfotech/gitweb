/**
 * Test SMTP Email Script
 * Sends a test email to verify Gmail SMTP configuration with STE branding
 * Run with: npx ts-node backend/test-smtp.ts
 */

import * as dotenv from 'dotenv';
dotenv.config();

import { sendEmail, verifySmtpConnection } from './src/services/emailService';
import { getBrandContext } from './src/services/emailTemplateService';

const TEST_RECIPIENT = 'pauravshah2@gmail.com';
const SENDER_EMAIL = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'pauravshah2@gmail.com';

// Logo URL - using cid for reliable embedding
const LOGO_URL = 'cid:preferred-tax-logo';

async function testSmtp() {
  console.log('='.repeat(60));
  console.log('SMTP Email Test Script with STE Branding');
  console.log('='.repeat(60));
  console.log(`Test Recipient: ${TEST_RECIPIENT}`);
  console.log(`Sender Email: ${SENDER_EMAIL}`);
  console.log('');

  // Verify SMTP connection
  console.log('Verifying SMTP connection...');
  const connectionResult = await verifySmtpConnection();

  if (!connectionResult.success) {
    console.error('❌ SMTP Connection Failed:');
    console.error(connectionResult.error || 'Unknown error');
    process.exit(1);
  }

  console.log('✅ SMTP Connection Verified');
  console.log('');

  // Build and send test email with premium STE branding
  const brand = getBrandContext();
  const timestamp = new Date().toISOString();

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Test Email - Smart Tax Experts</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  </style>
</head>
<body style="margin:0;padding:0;background:linear-gradient(135deg,#E8F5E9 0%,#FFFFFF 100%);font-family:'Inter',Helvetica,Arial,sans-serif;color:#1A1A1A;line-height:1.6;">
  <div style="width:100%;max-width:620px;margin:0 auto;background:#FFFFFF;border:1px solid #E5E5E5;border-radius:20px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#05A68D,#05A68D);padding:32px 28px 24px;text-align:center;position:relative;overflow:hidden;">
      <img src="${LOGO_URL}" alt="Smart Tax Experts" width="120" height="auto" style="display:block;border:0;outline:none;text-decoration:none;margin:0 auto 12px;">
      <div style="font-size:18px;font-weight:700;color:#FFFFFF;letter-spacing:-0.5px;margin:0 0 8px 0;line-height:1.3;">
        Smart Tax <span style="color:#FFFFFF;opacity:0.95;">Experts</span>
      </div>
    </div>
    <div style="padding:32px 28px;">
      <h1 style="margin:0 0 16px 0;font-size:24px;color:#2C3E50;font-weight:700;">SMTP Test Successful! 📧</h1>
      <p style="font-size:16px;color:#4A4A4A;margin:0 0 20px 0;">
        This is a test email to verify Gmail SMTP configuration is working correctly with premium STE branding.
      </p>
      <div style="background:#E8F5E9;padding:20px;border-radius:12px;border-left:4px solid #05A68D;margin-bottom:16px;">
        <p style="font-size:14px;color:#1A1A1A;margin:0 0 6px 0;"><strong style="color:#05A68D;">Test Details:</strong></p>
        <ul style="font-size:14px;color:#4A4A4A;margin:0;padding-left:20px;line-height:1.6;">
          <li><strong>Sender:</strong> ${SENDER_EMAIL}</li>
          <li><strong>Recipient:</strong> ${TEST_RECIPIENT}</li>
          <li><strong>Timestamp:</strong> ${timestamp}</li>
          <li><strong>SMTP Host:</strong> ${process.env.SMTP_HOST || 'smtp.gmail.com'}</li>
        </ul>
      </div>
      <p style="font-size:14px;color:#4A4A4A;margin:0;">
        Your email system is now configured with admin-controlled templates and premium STE branding!
      </p>
    </div>
    <div style="background:#F8F9FA;border-top:1px solid #E5E5E5;padding:24px 28px;text-align:center;">
      <div style="font-size:15px;font-weight:700;color:#1A1A1A;margin-bottom:10px;">${brand.businessName}</div>
      <div style="font-size:13px;color:#4A4A4A;line-height:1.5;">
        <span style="color:#05A68D;font-weight:500;">${SENDER_EMAIL}</span><br>
        <a href="${brand.websiteUrl}" style="color:#05A68D;text-decoration:none;font-weight:500;">${brand.websiteUrl || 'preferredtax.com'}</a>
      </div>
      <div style="font-size:12px;color:#7A7A7A;margin-top:12px;padding-top:10px;border-top:1px solid #E5E5E5;">
        &copy; ${new Date().getFullYear()} ${brand.businessName}. Confidential communication. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>`;

  console.log('Sending test email with premium STE branding...');

  const result = await sendEmail({
    to: TEST_RECIPIENT,
    subject: 'Test Email: SMTP Configuration Verified - Smart Tax Experts',
    html: htmlContent,
  });

  if (result.success) {
    console.log('');
    console.log('✅ Test Email Sent Successfully!');
    console.log(`   Message ID: Available via transporter`);
    console.log('');
    console.log('='.repeat(60));
    console.log('TEST PASSED: Gmail SMTP is working correctly with premium STE branding!');
    console.log(`Test email sent to: ${TEST_RECIPIENT}`);
    console.log(`Sender: ${SENDER_EMAIL}`);
    console.log(`Branding: Smart Tax Experts emerald gradient header`);
    console.log(`Logo: ste_logo_light_transparent.png via jsDelivr CDN`);
    console.log('='.repeat(60));

    process.exit(0);
  } else {
    console.error('');
    console.error('❌ Failed to send test email:');
    console.error(result.error || 'Unknown error');
    console.error('');
    console.error('Common fixes:');
    console.error('  1. Check SMTP credentials in .env file');
    console.error('  2. Use an App Password if 2FA is enabled');
    console.error('  3. Ensure less secure apps are allowed (or use OAuth2)');

    process.exit(1);
  }
}

// Run the test
testSmtp();