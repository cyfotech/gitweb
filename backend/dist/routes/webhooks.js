"use strict";
/**
 * SMT Smart Tax Experts — Calendly Webhook Route
 *
 * Receives Calendly webhook events, verifies the signature, and processes
 * invitee.created / invitee.canceled / invitee.rescheduled.
 * Uses raw body so the signature check has the exact bytes.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const calendlyService_1 = require("../services/calendlyService");
const router = (0, express_1.Router)();
// Raw body (required for HMAC signature verification)
router.post('/calendly', (req, res) => {
    const signature = req.headers['calendly-webhook-signature'];
    const body = Buffer.isBuffer(req.body) ? req.body : JSON.stringify(req.body || {});
    (0, calendlyService_1.handleCalendlyEvent)(body, signature).then((result) => {
        res.status(result.status).json({ status: result.message });
    }).catch(() => {
        res.status(500).json({ error: 'Internal webhook processing error' });
    });
});
exports.default = router;
