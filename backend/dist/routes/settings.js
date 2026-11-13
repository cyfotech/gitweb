"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth_1 = require("../middleware/auth");
const uuid_1 = require("uuid");
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
        const { value, description, category } = req.body;
        const setting = await prisma_1.default.globalsetting.upsert({
            where: { key: req.params.key },
            update: { value: value || {}, description, category: category || 'general' },
            create: {
                id: (0, uuid_1.v4)(),
                key: req.params.key,
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
exports.default = router;
