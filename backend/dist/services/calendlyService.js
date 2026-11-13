"use strict";
/**
 * SMT Smart Tax Experts — Calendly Webhook Service
 *
 * - Verifies the Calendly webhook signature (HMAC-SHA256 over the raw request
 *   body, using the webhook signing key from env CALENDLY_WEBHOOK_SIGNING_KEY).
 * - Processes invitee.created / invitee.canceled / invitee.rescheduled events.
 * - Prevents duplicate processing by tracking event IDs.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCalendlySignature = verifyCalendlySignature;
exports.handleCalendlyEvent = handleCalendlyEvent;
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const emailService_1 = require("./emailService");
const emailTemplateService_1 = require("./emailTemplateService");
const SIGNATURE_HEADER = 'calendly-webhook-signature';
/** Verify the raw-request signature. Returns true when valid (or disabled). */
function verifyCalendlySignature(rawBody, signatureHeader) {
    if (!signatureHeader)
        return false;
    const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
    if (!signingKey) {
        // If no key is configured, we cannot verify — reject for safety.
        console.warn('[Calendly] No signing key configured; rejecting webhook.');
        return false;
    }
    try {
        const hmac = crypto_1.default.createHmac('sha256', signingKey);
        hmac.update(rawBody);
        const expected = hmac.digest('base64');
        return crypto_1.default.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader));
    }
    catch {
        return false;
    }
}
function toSafeDate(iso) {
    if (!iso)
        return null;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
}
function extractInvitee(payload) {
    const invitee = payload?.invitee;
    return {
        name: invitee?.name || undefined,
        email: invitee?.email || undefined,
        cancel: invitee?.cancel_url || undefined,
        reschedule: invitee?.reschedule_url || undefined,
    };
}
function getInviteeAnswer(payload, keywords) {
    return payload?.invitee?.questions_and_answers
        ?.find(item => keywords.test(item.question || ''))
        ?.answer?.trim() || '';
}
function extractEventInfo(payload) {
    const scheduled = payload?.invitee?.scheduled_event;
    const locationType = scheduled?.location?.type;
    return {
        name: payload?.event_type?.name || scheduled?.name || 'Consultation',
        duration: payload?.event_type?.duration || 30,
        location: locationType === 'physical'
            ? scheduled?.location?.location || 'Physical meeting'
            : locationType === 'google_conference' || locationType === 'zoom_conference'
                ? 'Video Meeting'
                : 'Video / Phone',
        url: locationType === 'google_conference' || locationType === 'zoom_conference'
            ? scheduled?.location?.location
            : undefined,
    };
}
async function recordDelivery(eventId, eventType, payload) {
    const existing = await prisma_1.default.calendlywebhookdelivery.findUnique({ where: { eventId } });
    if (existing) {
        // Already seen — skip (idempotent). If it previously failed, allow retry.
        if (existing.status === 'processed')
            return false;
    }
    await prisma_1.default.calendlywebhookdelivery.upsert({
        where: { eventId },
        update: { status: 'processing' },
        create: { id: crypto_1.default.randomUUID(), eventId, eventType, payload, status: 'processing' },
    });
    return true;
}
async function finalizeDelivery(eventId, status) {
    await prisma_1.default.calendlywebhookdelivery.update({
        where: { eventId },
        data: { status, processedAt: new Date() },
    }).catch(() => { });
}
async function sendAppointmentEmails(a) {
    const brand = (0, emailTemplateService_1.getBrandContext)();
    const adminEmail = (0, emailService_1.getOwnerEmail)();
    const start = a.appointmentStart;
    const fmtDate = start.toLocaleString('en-US', { timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    const fmtTime = start.toLocaleString('en-US', { timeZone: 'UTC', hour: 'numeric', minute: '2-digit' });
    const html = (0, emailTemplateService_1.buildAppointmentConfirmation)({
        customerName: a.customerName,
        customerEmail: a.customerEmail,
        appointmentDate: fmtDate,
        appointmentTime: fmtTime,
        durationMinutes: String(a.durationMinutes),
        meetingLocation: a.meetingLocation,
        meetingUrl: a.meetingUrl,
        referenceNumber: a.referenceNo,
    }, brand);
    const ownerHtml = (0, emailTemplateService_1.buildOwnerNotification)({
        referenceNumber: a.referenceNo,
        sourcePage: 'Calendly appointment booking',
        fields: [
            { label: 'Form', value: 'Appointment Booking' },
            { label: 'Customer Name', value: a.customerName },
            { label: 'Customer Email', value: a.customerEmail },
            { label: 'Phone', value: a.customerPhone || 'Not provided' },
            { label: 'Appointment', value: a.eventName },
            { label: 'Date', value: fmtDate },
            { label: 'Time (UTC)', value: fmtTime },
            { label: 'Duration', value: `${a.durationMinutes} minutes` },
            { label: 'Meeting Location', value: a.meetingLocation },
            { label: 'Meeting URL', value: a.meetingUrl || 'Not provided' },
            { label: 'Additional Details', value: a.formMessage || 'Not provided' },
            { label: 'Submitted', value: new Date().toISOString() },
        ],
    }, brand);
    const [customerResult, ownerResult] = await Promise.all([
        (0, emailService_1.sendEmail)({
            to: a.customerEmail,
            subject: `Appointment Confirmed — ${brand.businessName} (${a.referenceNo})`,
            html,
        }),
        (0, emailService_1.sendEmail)({
            to: adminEmail,
            subject: `Appointment Scheduled — ${a.customerName} (${a.referenceNo})`,
            html: ownerHtml,
            replyTo: a.customerEmail,
        }),
    ]);
    if (!customerResult.success || !ownerResult.success) {
        throw new Error('Appointment email delivery failed.');
    }
}
async function handleCalendlyEvent(rawBody, signatureHeader) {
    const verified = verifyCalendlySignature(rawBody, signatureHeader);
    if (!verified) {
        return { ok: false, status: 401, message: 'Invalid signature' };
    }
    let data;
    try {
        data = JSON.parse(typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8'));
    }
    catch {
        return { ok: false, status: 400, message: 'Malformed JSON' };
    }
    const eventType = data.event || data.payload?.event || 'unknown';
    const eventId = data.event_id || data.payload?.invitee?.uuid || crypto_1.default.randomUUID();
    const event = data.payload;
    const invitee = extractInvitee(event);
    const eventInfo = extractEventInfo(event);
    // Idempotency guard
    const proceed = await recordDelivery(eventId, eventType, data);
    if (!proceed) {
        return { ok: true, status: 200, message: 'Duplicate event ignored' };
    }
    try {
        if (eventType === 'invitee.created' && event?.created_at) {
            const start = toSafeDate(event.invitee?.scheduled_event?.start_time || event.created_at);
            const end = toSafeDate(event.invitee?.scheduled_event?.end_time) ||
                (start ? new Date(start.getTime() + (eventInfo.duration || 30) * 60000) : null);
            const referenceNo = `APT-${crypto_1.default.randomBytes(3).toString('hex').toUpperCase()}`;
            const existingAppointment = await prisma_1.default.appointment.findFirst({
                where: { webhookEventId: eventId },
            });
            const customerPhone = getInviteeAnswer(event, /phone|mobile|telephone/i);
            const formMessage = getInviteeAnswer(event, /message|details|notes|reason/i);
            const appointment = existingAppointment || await prisma_1.default.appointment.create({
                data: {
                    id: crypto_1.default.randomUUID(),
                    referenceNo,
                    customerName: invitee.name || 'Valued Client',
                    customerEmail: invitee.email || '',
                    customerPhone: customerPhone || null,
                    serviceName: eventInfo.name,
                    calendlyEventId: eventId,
                    calendlyInviteeUri: data.payload?.invitee?.uuid,
                    appointmentStart: start,
                    appointmentEnd: end,
                    meetingLocation: eventInfo.location,
                    meetingUrl: eventInfo.url,
                    appointmentStatus: 'scheduled',
                    webhookEventId: eventId,
                },
            });
            if (invitee.email) {
                await sendAppointmentEmails({
                    customerName: invitee.name || 'Valued Client',
                    customerEmail: invitee.email,
                    customerPhone,
                    appointmentStart: start,
                    appointmentEnd: end,
                    meetingLocation: eventInfo.location,
                    meetingUrl: eventInfo.url || '',
                    referenceNo: appointment.referenceNo,
                    eventName: eventInfo.name,
                    durationMinutes: eventInfo.duration || 30,
                    formMessage,
                });
            }
            await finalizeDelivery(eventId, 'processed');
            return { ok: true, status: 200, message: 'created' };
        }
        if (eventType === 'invitee.canceled') {
            await prisma_1.default.appointment.updateMany({
                where: { calendlyInviteeUri: data.payload?.invitee?.uuid || eventId },
                data: { appointmentStatus: 'cancelled' },
            });
            if (invitee.email) {
                const brand = (0, emailTemplateService_1.getBrandContext)();
                const html = (0, emailTemplateService_1.buildAppointmentCancellation)({
                    customerName: invitee.name || 'Valued Client',
                    customerEmail: invitee.email,
                    appointmentDate: 'scheduled time',
                    appointmentTime: '',
                    durationMinutes: String(eventInfo.duration || 30),
                    meetingLocation: eventInfo.location,
                    meetingUrl: eventInfo.url || '',
                    referenceNumber: 'N/A',
                }, brand);
                const [customerResult, ownerResult] = await Promise.all([
                    (0, emailService_1.sendEmail)({ to: invitee.email, subject: `Appointment Cancelled — ${brand.businessName}`, html }),
                    (0, emailService_1.sendEmail)({
                        to: (0, emailService_1.getOwnerEmail)(),
                        subject: `Appointment Cancelled — ${invitee.name || 'Customer'}`,
                        html,
                        replyTo: invitee.email,
                    }),
                ]);
                if (!customerResult.success || !ownerResult.success) {
                    throw new Error('Appointment cancellation email delivery failed.');
                }
            }
            await finalizeDelivery(eventId, 'processed');
            return { ok: true, status: 200, message: 'cancelled' };
        }
        if (eventType === 'invitee.rescheduled' && event?.new_event?.uuid) {
            await prisma_1.default.appointment.updateMany({
                where: { calendlyInviteeUri: data.payload?.invitee?.uuid || eventId },
                data: { appointmentStatus: 'scheduled', calendlyEventId: event.new_event.uuid },
            });
            await finalizeDelivery(eventId, 'processed');
            return { ok: true, status: 200, message: 'rescheduled' };
        }
        // Unhandled event type — still mark processed to avoid infinite retries.
        await finalizeDelivery(eventId, 'processed');
        return { ok: true, status: 200, message: `unhandled:${eventType}` };
    }
    catch (e) {
        console.error('[Calendly] webhook processing error:', e.message);
        await finalizeDelivery(eventId, 'failed');
        return { ok: false, status: 500, message: 'Processing error' };
    }
}
