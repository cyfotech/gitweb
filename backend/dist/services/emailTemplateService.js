"use strict";
/**
 * Smart Tax Expert — Premium 3D-Inspired Branded Email Templates.
 *
 * Modern, professional email designs matching the website's visual identity.
 * Features: STE logo header, emerald/mint/charcoal palette, elegant gradients,
 * depth with shadows, modern typography, responsive layout.
 * Compatible with Gmail, Outlook, and mobile devices.
 * Templates are returned as full HTML strings with inline CSS.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrandContext = getBrandContext;
exports.buildCustomerConfirmation = buildCustomerConfirmation;
exports.buildOwnerNotification = buildOwnerNotification;
exports.buildAppointmentConfirmation = buildAppointmentConfirmation;
exports.buildAppointmentCancellation = buildAppointmentCancellation;
exports.buildAdminReplyEmail = buildAdminReplyEmail;
exports.buildCareerApplicationConfirmation = buildCareerApplicationConfirmation;
exports.buildCareerApplicationNotification = buildCareerApplicationNotification;
// Brand colors (3D-inspired palette - emerald green, mint green, white, charcoal)
const BRAND = {
    emerald: '#20AD68',
    emeraldDark: '#087C50',
    mint: '#32D99A',
    mintLight: '#69E8B4',
    mintDark: '#15985B',
    charcoal: '#202A26',
    textPrimary: '#1A1A1A',
    textSecondary: '#4A4A4A',
    textMuted: '#7A7A7A',
    bgMain: '#F5FAF7',
    bgCard: '#FFFFFF',
    borderLight: '#E2EDE7',
    white: '#FFFFFF',
};
// Subtle animation frames for 3D effect (GIF placeholders - referenced in CSS)
// Note: Outlook doesn't support animations, but they work in Gmail and mobile mail apps
function escapeHtml(value) {
    if (value === null || value === undefined)
        return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
function safeUrl(url) {
    const trimmed = (url || '').trim();
    if (!trimmed)
        return '#';
    if (!/^(https?:\/\/|mailto:)/i.test(trimmed))
        return '#';
    return escapeHtml(trimmed);
}
function getBrandContext() {
    const configuredWebsiteUrl = process.env.WEBSITE_URL || process.env.FRONTEND_URL || '';
    let websiteUrl = '';
    try {
        const url = new URL(configuredWebsiteUrl);
        if (url.protocol === 'https:' || url.protocol === 'http:') {
            websiteUrl = url.origin;
        }
    }
    catch {
        // Keep website links disabled until a valid public origin is configured.
    }
    return {
        businessName: process.env.SMTP_FROM_NAME || process.env.BUSINESS_NAME || 'STE Smart Tax Experts',
        businessEmail: process.env.SMTP_FROM_EMAIL || process.env.BUSINESS_EMAIL || process.env.SMTP_USER || '',
        websiteUrl,
        calendlyUrl: process.env.CALENDLY_URL || (websiteUrl ? `${websiteUrl.replace(/\/+$/, '')}/book-consultation` : ''),
        logoUrl: 'cid:preferred-tax-logo',
    };
}
/**
 * Premium email wrapper with 3D-inspired design, Smart Tax Expert logo header, and branded colors.
 * Features rounded sections, subtle shadows, gradients, and responsive design.
 */
function wrapper(innerHtml, brand) {
    const safeName = escapeHtml(brand.businessName);
    const safeEmail = escapeHtml(brand.businessEmail);
    const site = safeUrl(brand.websiteUrl);
    const logoSrc = brand.logoUrl === 'cid:preferred-tax-logo'
        ? brand.logoUrl
        : /^https?:\/\//i.test(brand.logoUrl)
            ? escapeHtml(brand.logoUrl)
            : '';
    const logoHtml = logoSrc
        ? `<img src="${logoSrc}" alt="${safeName}" width="180" style="display:block;width:180px;max-width:100%;height:auto;margin:0 auto 16px;border:0;">`
        : '';
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${escapeHtml(brand.businessName)} - Email</title>
</head>
<body style="margin:0;padding:0;background:linear-gradient(135deg,${BRAND.bgMain} 0%,#FFFFFF 100%);font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:${BRAND.textPrimary};line-height:1.6;">
  <div style="width:100%;max-width:640px;margin:0 auto;background:${BRAND.bgCard};border:1px solid ${BRAND.borderLight};border-radius:20px;overflow:hidden;box-shadow:0 12px 48px rgba(15,94,59,0.12);">
    <div style="background:linear-gradient(135deg,${BRAND.emerald} 0%,${BRAND.emeraldDark} 100%);padding:40px 28px 28px;text-align:center;position:relative;overflow:hidden;">
      <div style="background:${BRAND.white};border-radius:12px;padding:16px;display:inline-block;box-shadow:0 4px 16px rgba(0,0,0,0.15);">
        ${logoHtml}
      </div>
      <div style="font-size:24px;font-weight:800;color:${BRAND.white};margin:16px 0 6px 0;letter-spacing:-0.5px;text-transform:uppercase;">${safeName}</div>
      <div style="font-size:14px;color:${BRAND.mintLight};font-weight:600;letter-spacing:0.5px;">Smart Tax Experts • Trusted Advisory</div>
      <div style="height:3px;background:linear-gradient(90deg,${BRAND.mint} 0%,${BRAND.mintLight} 100%);margin:20px auto 0;width:80px;border-radius:2px;"></div>
    </div>
    ${innerHtml}
    <div style="background:linear-gradient(135deg,#F5FAF7 0%,#E8F5EF 100%);border-top:2px solid ${BRAND.emerald};padding:28px 28px;text-align:center;">
      <div style="font-size:16px;font-weight:700;color:${BRAND.emerald};margin-bottom:10px;">${safeName}</div>
      <div style="font-size:13px;color:${BRAND.textSecondary};line-height:1.7;">
        <a href="mailto:${safeEmail}" style="color:${BRAND.emerald};text-decoration:none;font-weight:600;">${safeEmail}</a><br>
        <a href="${site}" style="color:${BRAND.emerald};text-decoration:none;font-weight:500;">${site || 'Visit our website'}</a>
      </div>
      <div style="font-size:12px;color:${BRAND.textMuted};margin-top:16px;padding-top:14px;border-top:1px solid ${BRAND.borderLight};">
        &copy; ${new Date().getFullYear()} ${safeName}. Confidential communication. All rights reserved.<br>
        <span style="color:${BRAND.textMuted};font-size:11px;">This email was sent automatically. Please do not reply directly unless referenced in the message body.</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}
/**
 * Premium 3D-style CTA button with gradient emerald background and subtle shadow.
 * Hover effect is simulated with a darker gradient for email compatibility.
 */
function ctaButton(href, label, width = 'auto') {
    const url = safeUrl(href);
    return `<a href="${url}" style="display:inline-block;background:linear-gradient(180deg,${BRAND.emerald}, ${BRAND.emeraldDark});color:${BRAND.white} !important;padding:16px 40px;border-radius:12px;font-weight:800;font-size:16px;text-decoration:none;letter-spacing:0.5px;text-align:center;min-width:${width};box-shadow:0 6px 20px rgba(15,94,59,0.25);border:0;margin:24px 0;">
      ${escapeHtml(label)}
    </a>`;
}
/**
 * Premium 3D info card with emerald header bar.
 */
function infoCard(title, rows, color = BRAND.emerald) {
    return `
    <div style="background:${BRAND.bgCard};border:2px solid ${color};border-radius:14px;box-shadow:0 6px 20px rgba(15,94,59,0.08);overflow:hidden;margin:20px 0;">
      <div style="background:linear-gradient(135deg,${color} 0%,${BRAND.emeraldDark} 100%);padding:14px 20px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:${BRAND.white};font-weight:800;">${escapeHtml(title)}</div>
      </div>
      <div style="padding:20px;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${rows}
        </table>
      </div>
    </div>`;
}
/** Customer confirmation for a general website enquiry / consultation request. */
function buildCustomerConfirmation(data, brand = getBrandContext()) {
    const body = `
    <div style="padding:36px 32px;">
      <div style="text-align:center;margin-bottom:28px;">
        <div style="display:inline-block;background:linear-gradient(135deg,#E8F5EF 0%,#D4EDE4 100%);color:${BRAND.emerald};font-size:12px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;padding:8px 20px;border-radius:999px;margin-bottom:16px;border:2px solid ${BRAND.mint};">✓ Confirmation Received</div>
      </div>
      <p style="font-size:18px;line-height:1.7;color:${BRAND.textPrimary};margin-top:0;">
        Dear <strong>${escapeHtml(data.customerName)}</strong>,
      </p>
      <p style="font-size:15px;line-height:1.7;color:${BRAND.textSecondary};">
        Thank you for reaching out to <strong>${escapeHtml(brand.businessName)}</strong>. Your enquiry has been received and is being reviewed by our expert team.
      </p>
      <div style="background:linear-gradient(135deg,#F0FBF6 0%,#E8F5EF 100%);border-left:4px solid ${BRAND.emerald};padding:20px;margin:24px 0;border-radius:8px;">
        <div style="font-size:13px;color:${BRAND.textMuted};margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Your Reference Number</div>
        <div style="font-size:22px;font-weight:800;color:${BRAND.emerald};font-family:monospace;letter-spacing:1px;">${escapeHtml(data.referenceNumber)}</div>
        <div style="font-size:12px;color:${BRAND.textMuted};margin-top:6px;">Please keep this reference for future correspondence.</div>
      </div>
      ${data.formName || data.submittedAt ? `
      <p style="font-size:12px;line-height:1.6;color:${BRAND.textMuted};background:#F5FAF7;padding:10px 14px;border-radius:6px;margin:20px 0;">
        ${data.formName ? `Form: <strong style="color:${BRAND.textPrimary}">${escapeHtml(data.formName)}</strong>` : ''}
        ${data.submittedAt ? `&nbsp;|&nbsp; Submitted: <strong style="color:${BRAND.textPrimary}">${escapeHtml(data.submittedAt)}</strong>` : ''}
      </p>` : ''}
      ${infoCard('Enquiry Details', `
          <tr><td style="padding:10px 0;color:${BRAND.textMuted};width:45%;font-weight:600;">Reference ID:</td><td style="padding:10px 0;color:${BRAND.textPrimary};font-weight:800;font-family:monospace;font-size:14px;">${escapeHtml(data.referenceNumber)}</td></tr>
          ${data.serviceName ? `
          <tr><td style="padding:10px 0;color:${BRAND.textMuted};font-weight:600;">Requested Service:</td><td style="padding:10px 0;color:${BRAND.textPrimary};font-weight:700;">${escapeHtml(data.serviceName)}</td></tr>` : ''}
        `, BRAND.mint)}
      ${data.summary?.length ? `
      <div style="background:${BRAND.bgMain};border-radius:12px;padding:20px;margin:24px 0;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${data.summary.map(field => `<tr><td style="padding:10px 12px;color:${BRAND.textMuted};vertical-align:top;font-weight:600;width:40%;">${escapeHtml(field.label)}</td><td style="padding:10px 12px;color:${BRAND.textPrimary};font-weight:700;vertical-align:top;border-left:2px solid ${BRAND.mint};padding-left:16px;">${escapeHtml(field.value)}</td></tr>`).join('')}
        </table>
      </div>` : ''}
      ${data.message ? `
      <div style="background:${BRAND.bgCard};border:2px solid ${BRAND.borderLight};border-radius:12px;padding:20px;margin:24px 0;box-shadow:0 4px 12px rgba(15,94,59,0.05);">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:${BRAND.emerald};font-weight:800;margin-bottom:12px;border-bottom:2px solid ${BRAND.mint};padding-bottom:8px;">Your Message</div>
        <div style="font-size:14px;line-height:1.7;color:${BRAND.textSecondary};white-space:pre-wrap;background:#FAFCFA;padding:16px;border-radius:8px;">${escapeHtml(data.message)}</div>
      </div>` : ''}
      <div style="background:linear-gradient(135deg,#FFF9E6 0%,#FFFCF2 100%);border:2px solid #FFD88A;border-left:4px solid #F5A623;padding:20px;margin:24px 0;border-radius:10px;">
        <div style="font-size:13px;color:${BRAND.textPrimary};line-height:1.7;">
          <strong style="color:${BRAND.emerald};font-size:14px;">Next Steps:</strong> ${escapeHtml(data.nextSteps || 'A senior tax specialist will review your requirements and reach out to you within 4 business hours.')}
        </div>
      </div>
      <div style="text-align:center;margin:32px 0;">
        ${ctaButton(brand.calendlyUrl, 'Schedule a Consultation')}
      </div>
      <div style="text-align:center;margin-top:20px;padding:16px;background:#F5FAF7;border-radius:8px;">
        <p style="font-size:13px;color:${BRAND.textSecondary};margin:0;">
          <strong style="color:${BRAND.emerald};">Need immediate assistance?</strong> Reply to this email and our team will respond promptly.<br>
          <span style="font-size:12px;color:${BRAND.textMuted};margin-top:4px;display:block;">Response time: Within 4 business hours</span>
        </p>
      </div>
    </div>`;
    return wrapper(body, brand);
}
/** Owner notification with the complete enquiry details. */
function buildOwnerNotification(data, brand = getBrandContext()) {
    const rows = data.fields
        .map((f) => `
      <tr>
        <td style="padding:14px 16px;color:${BRAND.textMuted};vertical-align:top;width:38%;font-weight:600;background:#F8FCF9;border-bottom:1px solid ${BRAND.borderLight};">${escapeHtml(f.label)}</td>
        <td style="padding:14px 16px;color:${BRAND.textPrimary};font-weight:700;vertical-align:top;border-bottom:1px solid ${BRAND.borderLight};">${escapeHtml(f.value) || '&mdash;'}</td>
      </tr>`)
        .join('');
    const customerName = data.fields.find(f => ['Full Name', 'Customer Name', 'Name'].includes(f.label))?.value;
    const heading = data.formName
        ? `New ${data.formName}`
        : customerName || 'New Enquiry';
    const body = `
    <div style="padding:32px;">
      <div style="display:inline-flex;align-items:center;gap:12px;background:linear-gradient(135deg,${BRAND.emerald} 0%,${BRAND.mint} 100%);color:${BRAND.white};font-size:12px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;padding:10px 20px;border-radius:999px;margin-bottom:20px;box-shadow:0 4px 12px rgba(15,94,59,0.3);">
        <span style="font-size:16px;">⚡</span> New Website Enquiry
      </div>
      <h2 style="margin:0 0 12px 0;font-size:24px;color:#0F172A;font-weight:800;letter-spacing:-0.5px;">${escapeHtml(heading)}</h2>
      <div style="background:linear-gradient(135deg,#FFF8E1 0%,#FFF3C7 100%);border:2px solid #FFD54F;padding:12px 16px;border-radius:8px;margin-bottom:24px;">
        <p style="font-size:14px;color:${BRAND.textPrimary};margin:0;font-weight:600;">Reference: <strong style="color:${BRAND.emerald};font-size:16px;font-family:monospace;">${escapeHtml(data.referenceNumber)}</strong></p>
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:14px;border:2px solid ${BRAND.emerald};border-radius:12px;overflow:hidden;box-shadow:0 6px 20px rgba(15,94,59,0.1);background:${BRAND.white};">
        <thead>
          <tr style="background:linear-gradient(135deg,${BRAND.emerald} 0%,${BRAND.emeraldDark} 100%);color:${BRAND.white};">
            <th style="padding:14px 16px;text-align:left;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Field</th>
            <th style="padding:14px 16px;text-align:left;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Value</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      ${data.message ? `
      <div style="margin-top:24px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:${BRAND.emerald};font-weight:800;margin-bottom:10px;border-bottom:2px solid ${BRAND.mint};padding-bottom:6px;">Customer Message</div>
        <div style="background:linear-gradient(135deg,#F5FAF7 0%,#E8F5EF 100%);border-left:4px solid ${BRAND.emerald};padding:20px;font-size:14px;color:${BRAND.textPrimary};line-height:1.7;white-space:pre-wrap;box-shadow:0 4px 12px rgba(15,94,59,0.06);border-radius:8px;font-weight:500;">${escapeHtml(data.message)}</div>
      </div>` : ''}

      <div style="margin-top:24px;padding:16px 20px;background:linear-gradient(135deg,#F0FBF6 0%,#E8F5EF 100%);border:2px solid ${BRAND.mint};border-radius:10px;font-size:13px;color:${BRAND.textPrimary};box-shadow:0 4px 12px rgba(15,94,59,0.06);">
        <div style="font-weight:800;color:${BRAND.emerald};margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;font-size:11px;">Source Page</div>
        <strong style="font-size:14px;">${escapeHtml(data.sourcePage || '/contact')}</strong>
      </div>
    </div>`;
    return wrapper(body, brand);
}
/** Appointment confirmation (sent to customer and owner after Calendly booking). */
function buildAppointmentConfirmation(data, brand = getBrandContext()) {
    const body = `
    <div style="padding:36px 32px;">
      <div style="text-align:center;margin-bottom:28px;">
        <div style="display:inline-block;background:linear-gradient(135deg,#E8F5EF 0%,#D4EDE4 100%);color:${BRAND.emerald};font-size:12px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;padding:8px 20px;border-radius:999px;margin-bottom:16px;border:2px solid ${BRAND.mint};">✓ Appointment Confirmed</div>
      </div>
      <p style="font-size:18px;line-height:1.7;color:${BRAND.textPrimary};margin-top:0;">
        Dear <strong>${escapeHtml(data.customerName)}</strong>,
      </p>
      <p style="font-size:15px;line-height:1.7;color:${BRAND.textSecondary};">
        Great news — your consultation with <strong>${escapeHtml(brand.businessName)}</strong> is confirmed. We look forward to speaking with you.
      </p>
      <div style="background:linear-gradient(135deg,#F0FBF6 0%,#E8F5EF 100%);border-left:4px solid ${BRAND.emerald};padding:20px;margin:24px 0;border-radius:8px;">
        <div style="font-size:13px;color:${BRAND.textMuted};margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Reference Number</div>
        <div style="font-size:22px;font-weight:800;color:${BRAND.emerald};font-family:monospace;letter-spacing:1px;">${escapeHtml(data.referenceNumber)}</div>
      </div>
      ${infoCard('Appointment Details', `
          <tr><td style="padding:10px 0;color:${BRAND.textMuted};width:45%;font-weight:600;">Date:</td><td style="padding:10px 0;color:${BRAND.textPrimary};font-weight:800;font-size:14px;">${escapeHtml(data.appointmentDate)}</td></tr>
          <tr><td style="padding:10px 0;color:${BRAND.textMuted};font-weight:600;">Time:</td><td style="padding:10px 0;color:${BRAND.textPrimary};font-weight:800;font-size:14px;">${escapeHtml(data.appointmentTime)}</td></tr>
          <tr><td style="padding:10px 0;color:${BRAND.textMuted};font-weight:600;">Duration:</td><td style="padding:10px 0;color:${BRAND.textPrimary};font-weight:700;">${escapeHtml(data.durationMinutes)} minutes</td></tr>
          <tr><td style="padding:10px 0;color:${BRAND.textMuted};font-weight:600;">Location:</td><td style="padding:10px 0;color:${BRAND.textPrimary};font-weight:700;">${escapeHtml(data.meetingLocation)}</td></tr>
        `, BRAND.mint)}
      ${data.meetingUrl && /^https?:\/\//i.test(data.meetingUrl) ? `
        <div style="text-align:center;margin-top:24px;">
          ${ctaButton(data.meetingUrl, 'Join Meeting Now')}
        </div>` : ''}
      <div style="background:linear-gradient(135deg,#FFF9E6 0%,#FFFCF2 100%);border:2px solid #FFD88A;padding:18px;margin-top:24px;border-radius:10px;">
        <p style="font-size:14px;line-height:1.7;color:${BRAND.textPrimary};margin:0;">
          <strong style="color:${BRAND.emerald};">Reschedule or Cancel?</strong> Reply to this email and our team will assist you promptly.
        </p>
      </div>
    </div>`;
    return wrapper(body, brand);
}
/** Appointment cancellation notification. */
function buildAppointmentCancellation(data, brand = getBrandContext()) {
    const body = `
    <div style="padding:32px 28px;">
      <p style="font-size:16px;line-height:1.65;color:${BRAND.textPrimary};margin-top:0;">
        Dear <strong>${escapeHtml(data.customerName)}</strong>,
      </p>
      <p style="font-size:14px;line-height:1.65;color:${BRAND.textSecondary};">
        Your consultation scheduled for <strong>${escapeHtml(data.appointmentDate)}</strong> at
        <strong>${escapeHtml(data.appointmentTime)}</strong> has been cancelled.
      </p>
      <p style="font-size:14px;line-height:1.65;color:${BRAND.textSecondary};">
        If this is in error or you'd like to reschedule, please reply to this email or book a new time below.
      </p>
      <div style="text-align:center;margin:24px 0 8px;">
        ${ctaButton(brand.calendlyUrl, 'Schedule a New Appointment')}
      </div>
    </div>`;
    return wrapper(body, brand);
}
function buildAdminReplyEmail(data, brand = getBrandContext()) {
    const body = `
    <div style="padding:32px 28px;">
      <div style="background:${BRAND.bgCard};border:1px solid ${BRAND.borderLight};border-radius:12px;padding:20px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
        <p style="font-size:15px;line-height:1.7;color:${BRAND.textSecondary};white-space:pre-wrap;">${escapeHtml(data.message)}</p>
      </div>
      <p style="font-size:13px;color:${BRAND.textMuted};margin:0;">Reference: <strong style="color:${BRAND.textPrimary};">${escapeHtml(data.referenceNumber)}</strong></p>
    </div>`;
    return wrapper(body, brand);
}
/** Customer confirmation email for career application submission. */
function buildCareerApplicationConfirmation(data, brand = getBrandContext()) {
    const body = `
    <div style="padding:36px 32px;">
      <div style="text-align:center;margin-bottom:28px;">
        <div style="display:inline-block;background:linear-gradient(135deg,#E8F5EF 0%,#D4EDE4 100%);color:${BRAND.emerald};font-size:12px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;padding:8px 20px;border-radius:999px;margin-bottom:16px;border:2px solid ${BRAND.mint};">✓ Application Received</div>
      </div>
      <p style="font-size:18px;line-height:1.7;color:${BRAND.textPrimary};margin-top:0;">
        Dear <strong>${escapeHtml(data.customerName)}</strong>,
      </p>
      <p style="font-size:15px;line-height:1.7;color:${BRAND.textSecondary};">
        Thank you for your interest in joining the <strong>${escapeHtml(brand.businessName)}</strong> team! We have received your application for the <strong style="color:${BRAND.emerald};">${escapeHtml(data.position)}</strong> position.
      </p>
      <div style="background:linear-gradient(135deg,#F0FBF6 0%,#E8F5EF 100%);border-left:4px solid ${BRAND.emerald};padding:20px;margin:24px 0;border-radius:8px;">
        <div style="font-size:13px;color:${BRAND.textMuted};margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Application ID</div>
        <div style="font-size:22px;font-weight:800;color:${BRAND.emerald};font-family:monospace;letter-spacing:1px;">${escapeHtml(data.referenceNumber)}</div>
      </div>
      ${infoCard('Application Summary', `
          <tr><td style="padding:10px 0;color:${BRAND.textMuted};width:45%;font-weight:600;">Application ID:</td><td style="padding:10px 0;color:${BRAND.textPrimary};font-weight:800;font-family:monospace;font-size:14px;">${escapeHtml(data.referenceNumber)}</td></tr>
          <tr><td style="padding:10px 0;color:${BRAND.textMuted};font-weight:600;">Position Applied:</td><td style="padding:10px 0;color:${BRAND.textPrimary};font-weight:700;">${escapeHtml(data.position)}</td></tr>
          <tr><td style="padding:10px 0;color:${BRAND.textMuted};font-weight:600;">Submitted:</td><td style="padding:10px 0;color:${BRAND.textPrimary};font-weight:700;">${escapeHtml(data.submittedAt)}</td></tr>
        `, BRAND.mint)}
      ${data.applicationDetails?.length ? `
      <div style="background:${BRAND.bgMain};border-radius:12px;padding:20px;margin:24px 0;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${data.applicationDetails.map(field => `<tr><td style="padding:10px 12px;color:${BRAND.textMuted};vertical-align:top;font-weight:600;width:40%;">${escapeHtml(field.label)}</td><td style="padding:10px 12px;color:${BRAND.textPrimary};font-weight:700;vertical-align:top;border-left:2px solid ${BRAND.mint};padding-left:16px;">${escapeHtml(field.value)}</td></tr>`).join('')}
        </table>
      </div>` : ''}
      ${data.coverLetter ? `
      <div style="background:${BRAND.bgCard};border:2px solid ${BRAND.borderLight};border-radius:12px;padding:20px;margin:24px 0;box-shadow:0 4px 12px rgba(15,94,59,0.05);">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:${BRAND.emerald};font-weight:800;margin-bottom:12px;border-bottom:2px solid ${BRAND.mint};padding-bottom:8px;">Cover Letter</div>
        <div style="font-size:14px;line-height:1.7;color:${BRAND.textSecondary};white-space:pre-wrap;background:#FAFCFA;padding:16px;border-radius:8px;">${escapeHtml(data.coverLetter)}</div>
      </div>` : ''}
      <div style="background:linear-gradient(135deg,#FFF9E6 0%,#FFFCF2 100%);border:2px solid #FFD88A;border-left:4px solid #F5A623;padding:20px;margin:24px 0;border-radius:10px;">
        <div style="font-size:13px;color:${BRAND.textPrimary};line-height:1.7;">
          <strong style="color:${BRAND.emerald};font-size:14px;">Next Steps:</strong> ${escapeHtml(data.nextSteps || 'Our recruitment team will review your application and contact you within 5-7 business days if your profile matches our requirements.')}
        </div>
      </div>
      <div style="text-align:center;margin-top:28px;padding:16px;background:#F5FAF7;border-radius:8px;">
        <p style="font-size:13px;color:${BRAND.textSecondary};margin:0;">
          Thank you for considering a career with <strong style="color:${BRAND.emerald};">${escapeHtml(brand.businessName)}</strong>!
        </p>
      </div>
    </div>`;
    return wrapper(body, brand);
}
/** Owner/admin notification for new career application. */
function buildCareerApplicationNotification(data, brand = getBrandContext()) {
    const body = `
    <div style="padding:32px;">
      <div style="display:inline-flex;align-items:center;gap:12px;background:linear-gradient(135deg,${BRAND.emerald} 0%,${BRAND.mint} 100%);color:${BRAND.white};font-size:12px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;padding:10px 20px;border-radius:999px;margin-bottom:20px;box-shadow:0 4px 12px rgba(15,94,59,0.3);">
        <span style="font-size:16px;">💼</span> New Career Application
      </div>
      <h2 style="margin:0 0 12px 0;font-size:24px;color:#0F172A;font-weight:800;letter-spacing:-0.5px;">${escapeHtml(data.customerName)} - ${escapeHtml(data.position)}</h2>
      <div style="background:linear-gradient(135deg,#FFF8E1 0%,#FFF3C7 100%);border:2px solid #FFD54F;padding:12px 16px;border-radius:8px;margin-bottom:24px;">
        <p style="font-size:14px;color:${BRAND.textPrimary};margin:0;font-weight:600;">Application ID: <strong style="color:${BRAND.emerald};font-size:16px;font-family:monospace;">${escapeHtml(data.referenceNumber)}</strong></p>
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:14px;border:2px solid ${BRAND.emerald};border-radius:12px;overflow:hidden;box-shadow:0 6px 20px rgba(15,94,59,0.1);background:${BRAND.white};">
        <thead>
          <tr style="background:linear-gradient(135deg,${BRAND.emerald} 0%,${BRAND.emeraldDark} 100%);color:${BRAND.white};">
            <th style="padding:14px 16px;text-align:left;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Field</th>
            <th style="padding:14px 16px;text-align:left;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Value</th>
          </tr>
        </thead>
        <tbody>
          ${data.applicationDetails?.map((f) => `
            <tr>
              <td style="padding:14px 16px;color:${BRAND.textMuted};vertical-align:top;width:38%;font-weight:600;background:#F8FCF9;border-bottom:1px solid ${BRAND.borderLight};">${escapeHtml(f.label)}</td>
              <td style="padding:14px 16px;color:${BRAND.textPrimary};font-weight:700;vertical-align:top;border-bottom:1px solid ${BRAND.borderLight};">${escapeHtml(f.value) || '&mdash;'}</td>
            </tr>`).join('') || '<tr><td colspan="2" style="padding:20px 16px;text-align:center;color:' + BRAND.textMuted + ';font-style:italic;">No details provided</td></tr>'}
        </tbody>
      </table>

      ${data.coverLetter ? `
      <div style="margin-top:24px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:${BRAND.emerald};font-weight:800;margin-bottom:10px;border-bottom:2px solid ${BRAND.mint};padding-bottom:6px;">Cover Letter</div>
        <div style="background:linear-gradient(135deg,#F5FAF7 0%,#E8F5EF 100%);border-left:4px solid ${BRAND.emerald};padding:20px;font-size:14px;color:${BRAND.textPrimary};line-height:1.7;white-space:pre-wrap;box-shadow:0 4px 12px rgba(15,94,59,0.06);border-radius:8px;font-weight:500;">${escapeHtml(data.coverLetter)}</div>
      </div>` : ''}
    </div>`;
    return wrapper(body, brand);
}
