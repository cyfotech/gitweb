import 'dotenv/config';
import { sendEmail, verifySmtpConnection } from '../src/services/emailService';

async function main() {
  console.log('=== SMTP Test Started ===');
  console.log('Sender: configured backend SMTP account');
  console.log('Recipient: pauravshah2@gmail.com');
  console.log('Subject: STE Smart Tax Experts – SMTP Test');
  console.log('');

  // Step 1: Verify SMTP connection
  console.log('Step 1: Verifying SMTP connection...');
  const verifyResult = await verifySmtpConnection();

  if (!verifyResult.success) {
    console.log('FAILED - SMTP Connection Verification');
    console.log(`Error: ${verifyResult.error}`);
    process.exit(1);
  }
  console.log('SUCCESS - SMTP Connection Verified');
  console.log('');

  // Step 2: Send test email
  console.log('Step 2: Sending test email...');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color:#087C50;background-image:linear-gradient(135deg,#087C50,#20AD68);padding:24px;border-radius:12px;color:#fff;text-align:center;">
          <img src="cid:preferred-tax-logo" alt="STE Smart Tax Experts" width="150" style="display:block;max-width:100%;height:auto;margin:0 auto 12px;">
          <h2 style="margin:0;color:#fff;">STE Smart Tax Experts</h2>
        </div>
        <div style="padding:24px;color:#202A26;">
          <p>Gmail SMTP integration test. This confirms that the configured account accepted a branded test message.</p>
        </div>
        <hr style="border:none;border-top:1px solid #DDECE4;margin:20px 0;">
        <p style="font-size:12px;color:#526168;text-align:center;">
          Automated SMTP acceptance test from the Preferred Tax Consultancy backend.
        </p>
      </div>
    </body>
    </html>
  `;

  const sendResult = await sendEmail({
    to: 'pauravshah2@gmail.com',
    subject: 'STE Smart Tax Experts – SMTP Test',
    html,
  });

  if (sendResult.success) {
    console.log('SUCCESS - Test email sent successfully');
    console.log('SUCCESS');
    process.exit(0);
  } else {
    console.log('FAILED - Test email delivery failed');
    console.log(`Error: ${sendResult.error}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('FAILED - Unexpected error:', err.message);
  process.exit(1);
});