/**
 * SMT Smart Tax Experts — Calendly Webhook Route
 *
 * Receives Calendly webhook events, verifies the signature, and processes
 * invitee.created / invitee.canceled / invitee.rescheduled.
 * Uses raw body so the signature check has the exact bytes.
 */
declare const router: import("express-serve-static-core").Router;
export default router;
