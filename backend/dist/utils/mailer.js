"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFormSubmissionEmails = sendFormSubmissionEmails;
exports.sendConsultationEmails = sendConsultationEmails;
exports.sendCareerApplicationEmails = sendCareerApplicationEmails;
const emailService_1 = require("../services/emailService");
const emailTemplateService_1 = require("../services/emailTemplateService");
const logger_1 = require("./logger");
const emailTemplateStorage_1 = require("../services/emailTemplateStorage");
async function sendFormSubmissionEmails(data) {
    const brand = (0, emailTemplateService_1.getBrandContext)();
    const submittedAt = data.submittedAt.toISOString();
    const formType = data.formType || 'contact';
    const serviceName = data.fields.find(field => /service|position|role/i.test(field.label))?.value || '';
    const fieldValue = (pattern) => data.fields.find(field => pattern.test(field.label))?.value || '';
    const variables = {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        email: data.customerEmail,
        phone: data.fields.find(field => /^phone$/i.test(field.label))?.value || '',
        serviceName,
        companyName: fieldValue(/company|firm|organization/i),
        annualVolumeOrRevenue: fieldValue(/revenue|volume/i),
        preferredContactMethod: fieldValue(/preferred contact/i),
        formName: data.formName,
        referenceNumber: data.referenceNumber,
        submittedAt,
        sourcePage: data.sourcePage,
        message: data.message || '',
        fields: data.fields,
        subject: data.fields.find(field => /^subject$/i.test(field.label))?.value || '',
        enquiryType: data.fields.find(field => /enquiry type/i.test(field.label))?.value || '',
        nextSteps: 'Our team will review your submission and follow up using the contact details you provided.',
        ctaUrl: brand.calendlyUrl,
        ctaLabel: 'Schedule a Consultation',
    };
    const template = await (0, emailTemplateStorage_1.getTemplateByFormType)(formType);
    const [customerEmail, ownerEmailContent] = await Promise.all([
        template?.isActive ? (0, emailTemplateStorage_1.buildCustomerEmailFromTemplate)(formType, variables, brand) : Promise.resolve(null),
        (0, emailTemplateStorage_1.buildOwnerEmailFromTemplate)(formType, variables, brand),
    ]);
    const customerIsDisabled = Boolean(template && !template.isActive);
    const ownerEmail = (0, emailService_1.getOwnerEmail)();
    const [customerResult, ownerResult] = await Promise.all([
        customerIsDisabled
            ? Promise.resolve({ success: false, error: 'Customer confirmation template is disabled.' })
            : customerEmail
                ? (0, emailService_1.sendEmail)({ to: data.customerEmail, subject: customerEmail.subject, html: customerEmail.html })
                : Promise.resolve({ success: false, error: 'Customer email template is unavailable.' }),
        ownerEmailContent
            ? (0, emailService_1.sendEmail)({
                to: ownerEmail,
                subject: ownerEmailContent.subject,
                html: ownerEmailContent.html,
                replyTo: data.customerEmail,
            })
            : Promise.resolve({ success: false, error: 'Owner notification template is unavailable.' }),
    ]);
    const failures = [
        !customerResult.success && !customerIsDisabled && 'customer confirmation',
        !ownerResult.success && 'owner notification',
    ].filter(Boolean);
    if (customerIsDisabled)
        failures.push('customer confirmation template is disabled');
    if (failures.length) {
        logger_1.logger.error('Form email delivery was incomplete', {
            formName: data.formName,
            referenceNumber: data.referenceNumber,
            failedMessages: failures,
            customerTemplateDisabled: customerIsDisabled,
        });
    }
    const deliveryErrors = [];
    if (!customerResult.success && !customerIsDisabled) {
        deliveryErrors.push(`Customer confirmation: ${customerResult.error || 'SMTP did not accept the email.'}`);
    }
    else if (customerIsDisabled) {
        deliveryErrors.push('Customer confirmation: its email template is disabled.');
    }
    if (!ownerResult.success) {
        deliveryErrors.push(`Owner notification: ${ownerResult.error || 'SMTP did not accept the email.'}`);
    }
    return {
        customerSent: customerResult.success && !customerIsDisabled,
        ownerSent: ownerResult.success,
        customerMessageId: customerResult.messageId,
        ownerMessageId: ownerResult.messageId,
        ownerEmail,
        customerError: !customerResult.success || customerIsDisabled
            ? deliveryErrors.find(error => error.startsWith('Customer confirmation:'))
            : undefined,
        ownerError: !ownerResult.success
            ? deliveryErrors.find(error => error.startsWith('Owner notification:'))
            : undefined,
        error: deliveryErrors.length
            ? `Your request is saved, but email delivery needs attention. ${deliveryErrors.join(' ')}`
            : undefined,
    };
}
async function sendConsultationEmails(data, sourcePage = '/book-consultation') {
    const formType = data.category === 'cpa'
        ? 'cpa'
        : /\/services?(\/|$)|[?&]service=/i.test(sourcePage)
            ? 'services_enquiry'
            : data.preferredContactMethod?.toLowerCase() === 'phone' && /callback/i.test(sourcePage)
                ? 'callback'
                : 'consultation';
    return sendFormSubmissionEmails({
        formName: formType === 'cpa'
            ? 'CPA Outsourcing'
            : formType === 'services_enquiry'
                ? 'Service Enquiry'
                : formType === 'callback'
                    ? 'Callback Request'
                    : 'Consultation Request',
        formType,
        referenceNumber: data.referenceNo,
        customerName: data.fullName,
        customerEmail: data.email,
        fields: [
            { label: 'Full Name', value: data.fullName },
            { label: 'Email', value: data.email },
            { label: 'Phone', value: data.phone },
            { label: 'Company / Firm', value: data.companyName || 'Not specified' },
            { label: 'Client Classification', value: data.category },
            { label: 'Requested Service', value: data.serviceName },
            { label: 'Revenue / Volume', value: data.annualVolumeOrRevenue || 'Not specified' },
            { label: 'Preferred Contact Method', value: data.preferredContactMethod || 'Email' },
        ],
        message: data.message || undefined,
        sourcePage,
        submittedAt: data.createdAt,
    });
}
async function sendCareerApplicationEmails(data, applicationId) {
    const referenceNumber = applicationId || `APP-${data.applicationDate.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const details = [
        { label: 'Full Name', value: data.fullName },
        { label: 'Email', value: data.email },
        { label: 'Phone', value: data.phone },
        { label: 'Position', value: data.position },
        { label: 'Country', value: data.country || data.companyName || 'Not provided' },
        { label: 'City', value: data.city || 'Not provided' },
        { label: 'Experience Level', value: data.experienceLevel || 'Not specified' },
        { label: 'Years of Experience', value: String(data.yearsExperience) },
        { label: 'Relevant Skills', value: data.relevantSkills },
        { label: 'Software Knowledge', value: data.softwareKnowledge || 'Not provided' },
        { label: 'Resume', value: data.resumeName || 'Not provided' },
    ];
    return sendFormSubmissionEmails({
        formName: 'Career Application',
        formType: 'career',
        referenceNumber,
        customerName: data.fullName,
        customerEmail: data.email,
        fields: details,
        message: [data.coverLetter, data.additionalInfo].filter(Boolean).join('\n\n') || undefined,
        sourcePage: '/careers',
        submittedAt: data.applicationDate,
    });
}
