/**
 * SMT Smart Tax Experts — Calendly Webhook Route
 *
 * Receives Calendly webhook events, verifies the signature, and processes
 * invitee.created / invitee.canceled / invitee.rescheduled.
 * Uses raw body so the signature check has the exact bytes.
 */

import { Router } from 'express';
import { handleCalendlyEvent } from '../services/calendlyService';

const router = Router();

// Raw body (required for HMAC signature verification)
router.post('/calendly', (req, res) => {
  const signature = req.headers['calendly-webhook-signature'] as string | undefined;
  const body = Buffer.isBuffer(req.body) ? req.body : JSON.stringify(req.body || {});

  handleCalendlyEvent(body, signature).then((result) => {
    res.status(result.status).json({ status: result.message });
  }).catch(() => {
    res.status(500).json({ error: 'Internal webhook processing error' });
  });
});

export default router;
