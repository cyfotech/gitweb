"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const emailService_1 = require("../services/emailService");
const emailTemplateStorage_1 = require("../services/emailTemplateStorage");
const router = (0, express_1.Router)();
// Available form types for email templates
const FORM_TYPES = ['contact', 'consultation', 'services_enquiry', 'other_enquiries', 'blog'];
/**
 * GET /api/v1/email-templates
 * Get all email templates (admin only)
 */
router.get('/', auth_1.authenticate, async (req, res) => {
    try {
        const templates = await (0, emailTemplateStorage_1.getAllTemplates)();
        res.json({ templates });
    }
    catch (error) {
        console.error('Failed to fetch email templates:', error);
        res.status(500).json({ error: 'Failed to fetch email templates' });
    }
});
/**
 * GET /api/v1/email-templates/:formType
 * Get specific template by form type (admin only)
 */
router.get('/:formType', auth_1.authenticate, async (req, res) => {
    try {
        const { formType } = req.params;
        if (!FORM_TYPES.includes(formType)) {
            return res.status(400).json({
                error: `Invalid form type. Available types: ${FORM_TYPES.join(', ')}`
            });
        }
        const template = await (0, emailTemplateStorage_1.getTemplateByFormType)(formType);
        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }
        res.json({ template });
    }
    catch (error) {
        console.error('Failed to fetch email template:', error);
        res.status(500).json({ error: 'Failed to fetch email template' });
    }
});
/**
 * PUT /api/v1/email-templates/:formType
 * Update email template (admin only)
 */
router.put('/:formType', auth_1.authenticate, async (req, res) => {
    try {
        const { formType } = req.params;
        if (!FORM_TYPES.includes(formType)) {
            return res.status(400).json({
                error: `Invalid form type. Available types: ${FORM_TYPES.join(', ')}`
            });
        }
        const { subject, greeting, message, footer, branding, isActive } = req.body;
        if (!subject || typeof subject !== 'string' || subject.length > 200) {
            return res.status(400).json({ error: 'Subject is required and must be 200 characters or fewer' });
        }
        if (!greeting || typeof greeting !== 'string') {
            return res.status(400).json({ error: 'Greeting is required' });
        }
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message content is required' });
        }
        if (!footer || typeof footer !== 'string') {
            return res.status(400).json({ error: 'Footer is required' });
        }
        // Check for template variables in subject
        if (subject.includes('{{') && subject.includes('}}')) {
            if (!subject.match(/\{\{(customerName|referenceNumber|brandName)\}*\}/)) {
                return res.status(400).json({
                    error: 'Subject contains template variables but they should be customerName, referenceNumber, or brandName'
                });
            }
        }
        const updated = await (0, emailTemplateStorage_1.upsertTemplate)(formType, {
            subject,
            greeting,
            message,
            footer,
            branding: branding || null,
            isActive: isActive !== undefined ? Boolean(isActive) : true,
        });
        res.json({
            success: true,
            template: updated,
            message: 'Email template updated successfully'
        });
    }
    catch (error) {
        console.error('Failed to update email template:', error);
        res.status(500).json({ error: error.message || 'Failed to update email template' });
    }
});
/**
 * POST /api/v1/email-templates/test
 * Test email template by sending to configured test address
 *
 * Body: { formType: string, to: string, variables: object }
 */
router.post('/test', auth_1.authenticate, async (req, res) => {
    try {
        const { formType, to, variables } = req.body;
        if (!FORM_TYPES.includes(formType)) {
            return res.status(400).json({
                error: `Invalid form type. Available types: ${FORM_TYPES.join(', ')}`
            });
        }
        if (!to || typeof to !== 'string' || !to.includes('@')) {
            return res.status(400).json({ error: 'Valid recipient email is required' });
        }
        // Default test variables
        const defaultVars = {
            customerName: 'Test User',
            referenceNumber: 'TEST-EMAIL-' + Date.now(),
            serviceName: 'Sample Service',
            companyName: 'Test Company',
            annualVolumeOrRevenue: '$100,000 - $500,000',
            preferredContactMethod: 'Email',
            message: 'This is a test message.',
            fields: [
                { label: 'Full Name', value: 'Test User' },
                { label: 'Email', value: to },
                { label: 'Phone', value: '+1 (555) 123-4567' },
            ],
            nextSteps: 'This is a test email to verify template rendering.',
            sourcePage: '/test',
            brandName: 'Preferred Tax Consultancy',
        };
        const testVars = { ...defaultVars, ...variables };
        // Build customer email
        const customerEmail = await (0, emailTemplateStorage_1.buildCustomerEmailFromTemplate)(formType, testVars);
        if (!customerEmail) {
            return res.status(500).json({ error: 'Failed to build customer email from template' });
        }
        // Send to test address
        const result = await (0, emailService_1.sendEmail)({
            to,
            subject: customerEmail.subject,
            html: customerEmail.html,
        });
        if (!result.success) {
            return res.status(500).json({ error: result.error || 'Failed to send test email' });
        }
        res.json({
            success: true,
            message: 'Test email sent successfully',
            subject: customerEmail.subject,
            sentTo: to
        });
    }
    catch (error) {
        console.error('Failed to send test email:', error);
        res.status(500).json({ error: error.message || 'Failed to send test email' });
    }
});
/**
 * POST /api/v1/email-templates/verify-smtp
 * Verify SMTP connection (for testing purposes)
 */
router.post('/verify-smtp', auth_1.authenticate, async (req, res) => {
    try {
        const result = await (0, emailService_1.verifySmtpConnection)();
        if (result.success) {
            res.json({
                success: true,
                message: 'SMTP connection verified successfully'
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: result.error || 'SMTP connection verification failed'
            });
        }
    }
    catch (error) {
        console.error('SMTP verification error:', error);
        res.status(500).json({ error: error.message || 'Failed to verify SMTP connection' });
    }
});
/**
 * GET /api/v1/email-templates/preview/:formType
 * Preview email HTML for a template
 */
router.get('/preview/:formType', auth_1.authenticate, async (req, res) => {
    try {
        const { formType } = req.params;
        if (!FORM_TYPES.includes(formType)) {
            return res.status(400).json({
                error: `Invalid form type. Available types: ${FORM_TYPES.join(', ')}`
            });
        }
        const template = await (0, emailTemplateStorage_1.getTemplateByFormType)(formType);
        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }
        // Default preview variables
        const previewVars = {
            customerName: 'John Doe',
            referenceNumber: 'PRJ-TEST-123',
            serviceName: 'CPA Services',
            companyName: 'Acme Corp',
            annualVolumeOrRevenue: '$500,000 - $1M',
            preferredContactMethod: 'Email',
            message: 'This is a sample message for preview purposes. It demonstrates how your email template will appear to customers.',
            fields: [
                { label: 'Full Name', value: 'John Doe' },
                { label: 'Email', value: 'john.doe@example.com' },
                { label: 'Phone', value: '+1 (555) 987-6543' },
                { label: 'Company', value: 'Acme Corporation' },
            ],
            nextSteps: 'A representative will contact you within 24 hours to schedule your consultation.',
            sourcePage: '/contact',
            brandName: 'Preferred Tax Consultancy',
            ctaUrl: 'https://preferredtax.com/book-consultation',
            ctaLabel: 'Schedule Your Free Consultation',
        };
        const customerEmail = await (0, emailTemplateStorage_1.buildCustomerEmailFromTemplate)(formType, previewVars);
        const ownerEmail = await (0, emailTemplateStorage_1.buildOwnerEmailFromTemplate)(formType, previewVars);
        res.json({
            template,
            preview: {
                customer: customerEmail,
                owner: ownerEmail,
            },
            previewVariables: previewVars
        });
    }
    catch (error) {
        console.error('Failed to preview email template:', error);
        res.status(500).json({ error: error.message || 'Failed to preview email template' });
    }
});
/**
 * GET /api/v1/email-templates/types
 * Get available form types
 */
router.get('/types/list', (req, res) => {
    res.json({
        formTypes: FORM_TYPES,
        descriptions: {
            contact: 'Contact Us form submissions',
            consultation: 'Book Consultation requests',
            services_enquiry: 'Services Enquiry form submissions',
            other_enquiries: 'Other Enquiries form submissions',
            blog: 'Blog contact form submissions',
        }
    });
});
exports.default = router;
