/**
 * Admin-Controlled Email Template Service
 *
 * Manages editable email templates for all website forms with variable substitution.
 * Supports the public contact, consultation, service, CPA, career, callback and blog forms.
 */

import prisma from '../utils/prisma';
import { getBrandContext, BrandContext } from './emailTemplateService';

export type FormType =
  | 'contact'
  | 'consultation'
  | 'services_enquiry'
  | 'cpa'
  | 'career'
  | 'callback'
  | 'other_enquiries'
  | 'blog';

export interface EmailTemplateData {
  id: string;
  formType: string;
  subject: string;
  greeting: string;
  message: string;
  footer: string;
  branding: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for template defaults (without dates)
interface EmailTemplateDefaults {
  id: string;
  formType: FormType;
  subject: string;
  greeting: string;
  message: string;
  footer: string;
  branding: string | null;
  isActive: boolean;
}

export interface TemplateVariable {
  [key: string]: string | number | undefined | FieldData | FieldData[];
}

export interface FieldData {
  label: string;
  value: string | number | undefined;
}

const LOGO_URL = 'cid:preferred-tax-logo';

// Default templates for each form type
const DEFAULT_TEMPLATES: Record<FormType, EmailTemplateDefaults> = {
  contact: {
    id: 'default-contact',
    formType: 'contact',
    subject: 'Thank You for Your Contact Inquiry – {{brandName}}',
    greeting: 'Dear {{customerName}},',
    message: `Thank you for reaching out to {{brandName}}. We have received your inquiry and our team will review your submission.

**Your Enquiry Details:**
{{fields}}

**Next Steps:**
Our team will review your submission and follow up using the contact details you provided within 4 business hours.

If you have any urgent questions, please reply to this email directly.`,
    footer: 'Best regards,\n{{brandName}} Team',
    branding: null,
    isActive: true,
  },
  consultation: {
    id: 'default-consultation',
    formType: 'consultation',
    subject: 'Confirmation: Your Consultation Request – {{brandName}}',
    greeting: 'Dear {{customerName}},',
    message: `Thank you for requesting a consultation with {{brandName}}. Your consultation request has been received under reference number **{{referenceNumber}}**.

**Consultation Request Summary:**
- **Service Requested:** {{serviceName}}
- **Company/Firm:** {{companyName}}
- **Annual Volume/Revenue:** {{annualVolumeOrRevenue}}
- **Preferred Contact Method:** {{preferredContactMethod}}
- **Email:** {{email}}
- **Phone:** {{phone}}

**Next Steps:**
A senior tax specialist will contact you within 4 business hours to schedule your consultation.

**Message:** {{message}}`,
    footer: 'Best regards,\n{{brandName}} Team',
    branding: null,
    isActive: true,
  },
  services_enquiry: {
    id: 'default-services-enquiry',
    formType: 'services_enquiry',
    subject: 'Thank You for Your Services Inquiry – {{brandName}}',
    greeting: 'Dear {{customerName}},',
    message: `Thank you for your interest in {{serviceName}} at {{brandName}}. Your services enquiry has been successfully received.

**Enquiry Details:**
- **Service:** {{serviceName}}
- **Enquiry Type:** {{enquiryType}}
- **Subject:** {{subject}}
- **Email:** {{email}}
- **Phone:** {{phone}}

**Next Steps:**
Our dedicated team will review your requirements and reach out to discuss how we can support your needs.

Additional Information: {{message}}`,
    footer: 'Best regards,\nThe {{brandName}} Team',
    branding: null,
    isActive: true,
  },
  cpa: {
    id: 'default-cpa',
    formType: 'cpa',
    subject: 'Your CPA Outsourcing Enquiry – {{brandName}}',
    greeting: 'Dear {{customerName}},',
    message: `Thank you for contacting {{brandName}} about CPA outsourcing. We have received your request for {{serviceName}}.

**Your details:**
{{fields}}

Our CPA services team will review your requirements and follow up shortly.`,
    footer: 'Best regards,\n{{brandName}} CPA Services Team',
    branding: null,
    isActive: true,
  },
  career: {
    id: 'default-career',
    formType: 'career',
    subject: 'Application Received: {{serviceName}} – {{brandName}}',
    greeting: 'Dear {{customerName}},',
    message: `Thank you for applying to {{brandName}}. We received your application for {{serviceName}} under reference {{referenceNumber}}.

    **Contact details:** {{email}} | {{phone}}

    Our recruitment team will review your application and contact you if your experience matches the role.`,
    footer: 'Best regards,\n{{brandName}} Recruitment Team',
    branding: null,
    isActive: true,
  },
  callback: {
    id: 'default-callback',
    formType: 'callback',
    subject: 'Callback Request Received – {{brandName}}',
    greeting: 'Dear {{customerName}},',
    message: `Thank you for requesting a callback from {{brandName}}. We received your request and will call you using the phone number provided.

**Your details:**
{{fields}}`,
    footer: 'Best regards,\n{{brandName}} Team',
    branding: null,
    isActive: true,
  },
  other_enquiries: {
    id: 'default-other-enquiries',
    formType: 'other_enquiries',
    subject: 'Thank You for Your Enquiry – {{brandName}}',
    greeting: 'Dear {{customerName}},',
    message: `Thank you for contacting {{brandName}} with your enquiry. We have received your submission and will respond as soon as possible.

**Enquiry Subject:** {{subject}}
**Email:** {{email}}
**Phone:** {{phone}}

**Your Message:**
{{message}}

**Next Steps:**
Our team will review your enquiry and contact you using the details you provided.`,
    footer: 'Best regards,\n{{brandName}} Team',
    branding: null,
    isActive: true,
  },
  blog: {
    id: 'default-blog',
    formType: 'blog',
    subject: 'Thank You for Your Interest in Our Blog – {{brandName}}',
    greeting: 'Hello {{customerName}},',
    message: `Thank you for reaching out about our blog content. We appreciate your interest in {{brandName}}'s insights and expertise.

    **Email:** {{email}}

    **Your Message:**
{{message}}

**Next Steps:**
Our content team will review your enquiry and respond accordingly.`,
    footer: 'Best regards,\nThe {{brandName}} Content Team',
    branding: null,
    isActive: true,
  },
};

/**
 * Substitute template variables with actual values
 */
export function substituteVariables(
  template: string,
  variables: TemplateVariable
): string {
  return template.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (placeholder, key: string) => {
    const value = variables[key];
    if (value === undefined || value === null) return placeholder;
    if (Array.isArray(value)) {
      return value.map(field => `${field.label}: ${field.value ?? ''}`).join('\n');
    }
    if (typeof value === 'object') return '';
    return String(value);
  });
}

/**
 * Get all email templates
 */
export async function getAllTemplates(): Promise<EmailTemplateData[]> {
  await seedDefaultTemplates();
  return prisma.emailtemplate.findMany({ orderBy: { formType: 'asc' } });
}

/**
 * Get template by form type
 */
export async function getTemplateByFormType(formType: FormType): Promise<EmailTemplateData | null> {
  const template = await prisma.emailtemplate.findUnique({ where: { formType } });
  if (template) return template;
  const fallback = DEFAULT_TEMPLATES[formType];
  if (!fallback) return null;
  return prisma.emailtemplate.upsert({
    where: { formType },
    create: fallback,
    update: {},
  });
}

/**
 * Create or update a template
 */
export async function upsertTemplate(
  formType: FormType,
  data: {
    subject: string;
    greeting: string;
    message: string;
    footer: string;
    branding?: string | null;
    isActive?: boolean;
  }
): Promise<EmailTemplateData> {
  const existing = await prisma.emailtemplate.findUnique({ where: { formType } });

  if (existing) {
    return await prisma.emailtemplate.update({
      where: { formType },
      data: {
        subject: data.subject,
        greeting: data.greeting,
        message: data.message,
        footer: data.footer,
        branding: data.branding || null,
        isActive: data.isActive !== undefined ? data.isActive : existing.isActive,
      },
    });
  }

  return await prisma.emailtemplate.create({
    data: {
      formType,
      subject: data.subject,
      greeting: data.greeting,
      message: data.message,
      footer: data.footer,
      branding: data.branding || null,
      isActive: data.isActive !== false,
    },
  });
}

/**
 * Seed default templates into database
 */
export async function seedDefaultTemplates(): Promise<void> {
  for (const [formType, template] of Object.entries(DEFAULT_TEMPLATES)) {
    await prisma.emailtemplate.upsert({
      where: { formType },
      create: template,
      update: {},
    });
  }
}

/**
 * Build customer confirmation email from admin-controlled template
 */
export async function buildCustomerEmailFromTemplate(
  formType: FormType,
  variables: TemplateVariable,
  brand?: BrandContext
): Promise<{ subject: string; html: string } | null> {
  const template = await getTemplateByFormType(formType);
  if (!template || !template.isActive) return null;

  return renderCustomerEmailTemplate(template, variables, brand);
}

export function renderCustomerEmailTemplate(
  template: Pick<EmailTemplateData, 'subject' | 'greeting' | 'message' | 'footer' | 'branding'>,
  variables: TemplateVariable,
  brand = getBrandContext()
): { subject: string; html: string } {
  const values = { ...variables, brandName: brand.businessName };
  const subject = substituteVariables(template.subject, values);
  const greeting = renderPlainTemplate(template.greeting, values);
  const message = renderPlainTemplate(template.message, values);
  const footer = renderPlainTemplate(template.footer, values);
  const branding = template.branding
    ? renderMarkupTemplate(template.branding, values)
    : '';
  const ctaUrl = getSafeHttpUrl(brand.calendlyUrl);
  const body = `
    <div style="padding:32px 28px;">
      ${greeting ? `<h1 style="font-size:20px;line-height:1.4;color:#087C50;margin:0 0 18px;font-weight:700;">${greeting}</h1>` : ''}
      <div style="background:#FFFFFF;border:1px solid #DDECE4;border-radius:12px;padding:20px;font-size:14px;line-height:1.7;color:#333333;box-shadow:0 6px 20px rgba(8,124,80,0.08);">${message}</div>
      ${branding ? `<div style="margin-top:20px;padding:16px;background:#F4FBF7;border-left:3px solid #32D99A;border-radius:8px;color:#333333;">${branding}</div>` : ''}
      ${ctaUrl ? `<table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" style="margin:24px auto 8px;"><tr><td align="center" bgcolor="#087C50" style="background-color:#087C50;background-image:linear-gradient(180deg,#20AD68,#087C50);border-radius:8px;box-shadow:0 5px 16px rgba(8,124,80,0.22);"><a href="${escapeHtml(ctaUrl)}" style="display:inline-block;padding:14px 28px;color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:700;">Schedule a Consultation</a></td></tr></table>` : ''}
      ${footer ? `<div style="margin-top:24px;padding-top:16px;border-top:1px solid #DDECE4;font-size:14px;line-height:1.6;color:#087C50;">${footer}</div>` : ''}
    </div>`;
  return { subject, html: wrapper(body, subject, brand) };
}

/**
 * Build owner notification email from template
 */
export async function buildOwnerEmailFromTemplate(
  formType: FormType,
  variables: TemplateVariable,
  brand?: BrandContext
): Promise<{ subject: string; html: string } | null> {
  const brandCtx = brand || getBrandContext();

  // Owner notification uses different subject format
  const subject = substituteVariables(
    `New {{formName}} Submission – {{referenceNumber}}`,
    {
      ...variables,
      brandName: brandCtx.businessName,
      formName: getFormName(formType),
    }
  );

  const fields = variables.fields as FieldData[] | undefined;
  const fieldsTable = fields && fields.length
    ? `<table role="presentation" style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #DDECE4;">${fields.map((f) =>
        `<tr><td style="padding:12px 14px;color:#526168;vertical-align:top;width:38%;border-bottom:1px solid #DDECE4;">${escapeHtml(f.label)}</td><td style="padding:12px 14px;color:#202A26;font-weight:600;vertical-align:top;border-bottom:1px solid #DDECE4;">${escapeHtml(f.value ?? '') || '&mdash;'}</td></tr>`
      ).join('')}</table>`
    : '';

  const messageSection = variables.message
    ? `<div style="margin-top:18px;"><div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#087C50;font-weight:800;margin-bottom:6px;">Message</div><div style="background:#F4FBF7;border-left:4px solid #20AD68;padding:14px 16px;font-size:13px;color:#333333;line-height:1.6;white-space:pre-wrap;">${escapeHtml(String(variables.message || ''))}</div></div>`
    : '';

  const body = `
    <div style="padding:28px;">
      <div style="display:inline-block;background:#E7F8EF;color:#087C50;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;padding:6px 14px;border-radius:999px;margin-bottom:14px;">New ${getFormName(formType)} Submission</div>
      <h2 style="margin:0 0 8px;font-size:20px;color:#202A26;font-weight:700;">${escapeHtml(String(variables.customerName || 'New Submission'))}</h2>
      <p style="font-size:13px;color:#526168;margin:0 0 18px;">Reference: <strong style="color:#087C50;">${escapeHtml(String(variables.referenceNumber || '#N/A'))}</strong></p>

      ${fieldsTable}

      ${messageSection}

      <div style="margin-top:22px;padding:14px 16px;background:#F4FBF7;border:1px solid #DDECE4;border-radius:10px;font-size:12px;color:#202A26;">
        <p style="margin:0 0 6px;font-weight:600;">Source page</p>
        <p style="margin:0;color:#526168;">${escapeHtml(String(variables.sourcePage || '/contact'))}</p>
      </div>
    </div>`;

  const html = ownerWrapper(body, subject, brandCtx);

  return { subject, html };
}

function getSafeHttpUrl(value: string): string {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : '';
  } catch {
    return '';
  }
}

function escapeHtml(value: string | number): string {
  if (typeof value !== 'string') return String(value ?? '');
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderPlainTemplate(template: string, variables: TemplateVariable): string {
  return template
    .split(/(\{\{[a-zA-Z0-9_]+\}\})/g)
    .map(part => part.startsWith('{{') && part.endsWith('}}')
      ? escapeHtml(substituteVariables(part, variables))
      : escapeHtml(part))
    .join('')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

function renderMarkupTemplate(template: string, variables: TemplateVariable): string {
  return template.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (placeholder, key: string) => {
    const value = variables[key];
    if (value === undefined || value === null) return placeholder;
    if (Array.isArray(value)) {
      return escapeHtml(value.map(field => `${field.label}: ${field.value ?? ''}`).join('\n')).replace(/\n/g, '<br>');
    }
    if (typeof value === 'object') return '';
    return escapeHtml(String(value)).replace(/\n/g, '<br>');
  });
}

function getFormName(formType: FormType): string {
  const names: Record<FormType, string> = {
    contact: 'Contact',
    consultation: 'Consultation Request',
    services_enquiry: 'Services Enquiry',
    cpa: 'CPA Outsourcing',
    career: 'Career Application',
    callback: 'Callback Request',
    other_enquiries: 'Other Enquiries',
    blog: 'Blog Enquiry',
  };
  return names[formType] || 'Submission';
}

function wrapper(body: string, subject: string, brand: BrandContext): string {
  const safeName = escapeHtml(brand.businessName);
  const safeEmail = escapeHtml(brand.businessEmail);
  const site = brand.websiteUrl ? escapeHtml(brand.websiteUrl) : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#F4FBF7;background-image:linear-gradient(135deg,#E7F8EF 0%,#FFFFFF 100%);font-family:Arial,Helvetica,sans-serif;color:#202A26;line-height:1.6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4FBF7;background-image:linear-gradient(135deg,#E7F8EF 0%,#FFFFFF 100%);">
    <tr><td align="center" style="padding:24px 10px;">
      <table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:620px;background:#FFFFFF;border:1px solid #DDECE4;border-radius:16px;overflow:hidden;box-shadow:0 10px 40px rgba(8,124,80,0.12);">
        <tr><td align="center" bgcolor="#087C50" style="background-color:#087C50;background-image:linear-gradient(135deg,#087C50 0%,#20AD68 100%);padding:30px 24px;">
          <img src="${LOGO_URL}" alt="STE Smart Tax Experts" width="150" style="display:block;width:150px;max-width:100%;height:auto;margin:0 auto;border:0;outline:none;text-decoration:none;font-size:14px;color:#FFFFFF;">
          <div style="font-size:18px;font-weight:700;color:#FFFFFF;letter-spacing:-0.3px;margin:12px 0 0;line-height:1.3;">STE Smart Tax Experts</div>
        </td></tr>
        <tr><td style="background:#FFFFFF;">${body}</td></tr>
        <tr><td align="center" bgcolor="#F4FBF7" style="background:#F4FBF7;border-top:1px solid #DDECE4;padding:24px 20px;">
          <div style="font-size:15px;font-weight:700;color:#087C50;margin-bottom:10px;">${safeName}</div>
          <div style="font-size:13px;color:#526168;line-height:1.5;">
            <a href="mailto:${safeEmail}" style="color:#087C50;text-decoration:none;font-weight:600;">${safeEmail}</a>
            ${site ? `<br><a href="${site}" style="color:#087C50;text-decoration:none;font-weight:600;">${site}</a>` : ''}
          </div>
          <div style="font-size:12px;color:#65726B;margin-top:12px;padding-top:10px;border-top:1px solid #DDECE4;">
            &copy; ${new Date().getFullYear()} ${safeName}. Confidential communication. All rights reserved.
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function ownerWrapper(body: string, subject: string, brand: BrandContext): string {
  return wrapper(body, subject, brand);
}