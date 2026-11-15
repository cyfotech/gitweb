"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth_1 = require("../middleware/auth");
const uuid_1 = require("uuid");
const emailService_1 = require("../services/emailService");
const emailTemplateStorage_1 = require("../services/emailTemplateStorage");
const router = (0, express_1.Router)();
// GET /api/v1/settings
router.get('/', async (_req, res) => {
    try {
        const settings = await prisma_1.default.globalsetting.findMany();
        const obj = {};
        settings.forEach(s => {
            obj[s.key] = s.value;
        });
        res.json(obj);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});
// POST /api/v1/settings/test-smtp - Test live SMTP connection and optional test email
router.post('/test-smtp', auth_1.authenticate, async (req, res) => {
    try {
        const verifyResult = await (0, emailService_1.verifySmtpConnection)();
        if (!verifyResult.success) {
            return res.status(400).json({
                success: false,
                status: 'connection_failed',
                error: verifyResult.error || 'SMTP connection verification failed. Check configuration.',
            });
        }
        const { sendTestMessage } = req.body || {};
        const ownerEmail = (0, emailService_1.getOwnerEmail)();
        let emailSent = false;
        let messageId;
        if (sendTestMessage) {
            const sendResult = await (0, emailService_1.sendEmail)({
                to: ownerEmail,
                subject: 'STE Smart Tax Experts - SMTP Diagnostic Test',
                html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; max-width: 600px;">
            <h2 style="color: #0f766e; margin-bottom: 12px;">STE Smart Tax Experts - SMTP Test</h2>
            <p>This is an automated diagnostic test confirming that your Gmail SMTP server is configured and operating correctly.</p>
            <div style="background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 8px; padding: 16px; margin: 16px 0;">
              <p style="margin: 0; font-weight: bold; color: #0d9488;">✓ SMTP Handshake & Authentication Successful</p>
              <p style="margin: 8px 0 0 0; font-size: 13px; color: #64748b;">Timestamp: ${new Date().toISOString()}</p>
            </div>
            <p style="font-size: 13px; color: #64748b;">Recipient & Owner: ${ownerEmail}</p>
          </div>
        `,
            });
            if (!sendResult.success) {
                return res.status(400).json({
                    success: false,
                    status: 'send_failed',
                    error: sendResult.error || 'SMTP connected, but test email delivery failed.',
                });
            }
            emailSent = true;
            messageId = sendResult.messageId;
        }
        return res.json({
            success: true,
            status: 'verified',
            smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
            ownerEmail,
            emailSent,
            messageId,
            message: emailSent
                ? `SMTP connection verified and test email dispatched to ${ownerEmail}.`
                : 'SMTP connection verified successfully.',
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message || 'SMTP verification failed',
        });
    }
});
// POST /api/v1/settings/test-calendly - Validate Calendly URL & optional API token
router.post('/test-calendly', auth_1.authenticate, async (req, res) => {
    try {
        const { url, token } = req.body;
        if (!url || typeof url !== 'string') {
            return res.status(400).json({ success: false, error: 'A valid Calendly URL is required.' });
        }
        const trimmedUrl = url.trim();
        if (!trimmedUrl.includes('calendly.com')) {
            return res.status(400).json({ success: false, error: 'The URL must be a valid calendly.com link.' });
        }
        // If an API token is provided, test authentication against Calendly V2 API
        if (token && typeof token === 'string' && token.trim().length > 0) {
            try {
                const calRes = await fetch('https://api.calendly.com/users/me', {
                    headers: {
                        'Authorization': `Bearer ${token.trim()}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (calRes.ok) {
                    const calData = await calRes.json();
                    return res.json({
                        success: true,
                        status: 'verified',
                        user: calData?.resource?.name || calData?.resource?.email || 'Authenticated User',
                        message: `Calendly API connected successfully (${calData?.resource?.name || 'Verified User'}).`,
                    });
                }
                else {
                    return res.status(400).json({
                        success: false,
                        status: 'token_invalid',
                        error: `Calendly API rejected the token (Status: ${calRes.status}). Check credentials.`,
                    });
                }
            }
            catch (err) {
                return res.status(400).json({
                    success: false,
                    error: `Could not connect to Calendly API: ${err.message}`,
                });
            }
        }
        // If only URL is tested, verify URL reachable
        try {
            const ping = await fetch(trimmedUrl, { method: 'HEAD' });
            return res.json({
                success: true,
                status: ping.ok ? 'active' : 'reachable',
                message: 'Calendly scheduling link verified and reachable.',
            });
        }
        catch {
            // Fallback
            return res.json({
                success: true,
                status: 'configured',
                message: 'Calendly URL format validated.',
            });
        }
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message || 'Validation failed' });
    }
});
// PUT /api/v1/settings/bulk - upsert multiple keys at once
router.put('/bulk', auth_1.authenticate, async (req, res) => {
    try {
        const { settings } = req.body; // { [key]: value }
        if (!settings || typeof settings !== 'object') {
            return res.status(400).json({ error: 'settings object is required' });
        }
        const ops = Object.entries(settings).map(([key, value]) => prisma_1.default.globalsetting.upsert({
            where: { key },
            update: { value: value },
            create: { id: (0, uuid_1.v4)(), key, value: value, category: 'general' },
        }));
        await prisma_1.default.$transaction(ops);
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to save settings' });
    }
});
// PUT /api/v1/settings/:key
router.put('/:key', auth_1.authenticate, async (req, res) => {
    try {
        const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
        const { value, description, category } = req.body;
        const setting = await prisma_1.default.globalsetting.upsert({
            where: { key },
            update: { value: value || {}, description, category: category || 'general' },
            create: {
                id: (0, uuid_1.v4)(),
                key,
                value: value || {},
                description,
                category: category || 'general',
            },
        });
        res.json(setting);
    }
    catch {
        res.status(500).json({ error: 'Failed to update setting' });
    }
});
// ============================================================================
// EMAIL TEMPLATES API (Editable from Admin Panel)
// ============================================================================
// GET /api/v1/settings/templates - Retrieve all form email templates
router.get('/templates', auth_1.authenticate, async (_req, res) => {
    try {
        const templates = await (0, emailTemplateStorage_1.getAllTemplates)();
        return res.json(templates);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Failed to fetch email templates' });
    }
});
// GET /api/v1/settings/templates/:formType - Retrieve template by form type
router.get('/templates/:formType', auth_1.authenticate, async (req, res) => {
    try {
        const formType = req.params.formType;
        const template = await (0, emailTemplateStorage_1.getTemplateByFormType)(formType);
        if (!template) {
            return res.status(404).json({ error: `Email template for ${formType} not found` });
        }
        return res.json(template);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Failed to fetch email template' });
    }
});
// PUT /api/v1/settings/templates/:formType - Update template subject, greeting, message, footer, active status
router.put('/templates/:formType', auth_1.authenticate, async (req, res) => {
    try {
        const formType = req.params.formType;
        const { subject, greeting, message, footer, isActive } = req.body;
        if (!subject || typeof subject !== 'string' || !subject.trim()) {
            return res.status(400).json({ error: 'Subject is required' });
        }
        if (!message || typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({ error: 'Message body is required' });
        }
        const updated = await (0, emailTemplateStorage_1.upsertTemplate)(formType, {
            subject: subject.trim(),
            greeting: typeof greeting === 'string' ? greeting.trim() : undefined,
            message: message.trim(),
            footer: typeof footer === 'string' ? footer.trim() : undefined,
            isActive: typeof isActive === 'boolean' ? isActive : undefined,
        });
        return res.json({
            success: true,
            message: `Template for ${formType} updated successfully.`,
            template: updated,
        });
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Failed to update email template' });
    }
});
exports.default = router;
