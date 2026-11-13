import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

async function sendTestEmail() {
  try {
    const host = process.env.SMTP_HOST?.trim();
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER?.trim();
    const password = (process.env.SMTP_PASSWORD || process.env.SMTP_PASS)?.replace(/\s/g, '');

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      requireTLS: port === 587,
      auth: { user, pass: password },
      tls: { minVersion: 'TLSv1.2' },
    });

    const to = 'fakemaster9900@gmail.com';
    const subject = 'SMTP Test Email – Preferred Tax Consultancy';
    const html = `
      <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #079E85;">SMTP Test Email</h2>
        <p>Hello Paurav,</p>
        <p>This is a test email from Preferred Tax Consultancy to verify that Gmail SMTP integration is working correctly.</p>
        <p><strong>SMTP test completed.</strong></p>
        <p>Regards,<br/>Paurav Shah<br/>Preferred Tax Consultancy</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'Preferred Tax Consultancy'}" <${process.env.SMTP_FROM_EMAIL || user}>`,
      to,
      subject,
      html,
    });

    console.log('✅ SUCCESS: Email sent successfully!');
    console.log('[Response] Message ID:', info.messageId);
    process.exit(0);
  } catch (error: any) {
    console.error('❌ FAILED: Email transmission failed');
    console.error('[Error] Code:', error?.code || 'UNKNOWN');
    console.error('[Error] Message:', error?.message || 'Unknown error');
    process.exit(1);
  }
}

sendTestEmail();