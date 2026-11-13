/**
 * SMT Smart Tax Experts — Environment Validation
 *
 * Validates required environment variables on boot without logging values.
 */

const REQUIRED = ['DATABASE_URL', 'JWT_SECRET'] as const;
const OPTIONAL_CALENDLY = ['CALENDLY_URL', 'CALENDLY_WEBHOOK_SIGNING_KEY'] as const;

export function validateEnv(): { ok: boolean; warnings: string[] } {
  const warnings: string[] = [];
  let ok = true;

  for (const key of REQUIRED) {
    if (!process.env[key]) {
      ok = false;
      warnings.push(`Missing required env: ${key}`);
    }
  }

  const smtpConfigured = process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    (process.env.SMTP_PASSWORD || process.env.SMTP_PASS);
  if (!smtpConfigured) {
    warnings.push('SMTP is not fully configured — form submissions cannot send confirmation or owner notification emails.');
  }
  if (!process.env.OWNER_EMAIL) {
    warnings.push('OWNER_EMAIL is not configured — notifications will use SMTP_USER.');
  }
  if (!process.env.WEBSITE_URL) {
    warnings.push('WEBSITE_URL is not configured — website links will be omitted from email footers.');
  }

  if (!process.env.CALENDLY_WEBHOOK_SIGNING_KEY) {
    warnings.push('CALENDLY_WEBHOOK_SIGNING_KEY not set — Calendly webhooks will be rejected (expected until configured).');
  }

  return { ok, warnings };
}
