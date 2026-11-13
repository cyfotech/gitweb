/**
 * SMT Smart Tax Experts — Calendly Webhook Service
 *
 * - Verifies the Calendly webhook signature (HMAC-SHA256 over the raw request
 *   body, using the webhook signing key from env CALENDLY_WEBHOOK_SIGNING_KEY).
 * - Processes invitee.created / invitee.canceled / invitee.rescheduled events.
 * - Prevents duplicate processing by tracking event IDs.
 */
/** Verify the raw-request signature. Returns true when valid (or disabled). */
export declare function verifyCalendlySignature(rawBody: string | Buffer, signatureHeader?: string | undefined): boolean;
export declare function handleCalendlyEvent(rawBody: string | Buffer, signatureHeader?: string): Promise<{
    ok: boolean;
    status: number;
    message: string;
}>;
