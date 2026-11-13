/**
 * SMT Smart Tax Experts — Calendly Webhook Service
 *
 * - Verifies the Calendly webhook signature (HMAC-SHA256 over the raw request
 *   body, using the webhook signing key from env CALENDLY_WEBHOOK_SIGNING_KEY).
 * - Processes invitee.created / invitee.canceled / invitee.rescheduled events.
 * - Prevents duplicate processing by tracking event IDs.
 */

import crypto from 'crypto';
import prisma from '../utils/prisma';
import { getOwnerEmail, sendEmail } from './emailService';
import {
  buildAppointmentConfirmation,
  buildAppointmentCancellation,
  buildOwnerNotification,
  getBrandContext,
} from './emailTemplateService';

const SIGNATURE_HEADER = 'calendly-webhook-signature';

/** Verify the raw-request signature. Returns true when valid (or disabled). */
export function verifyCalendlySignature(rawBody: string | Buffer, signatureHeader?: string | undefined): boolean {
  if (!signatureHeader) return false;

  const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
  if (!signingKey) {
    // If no key is configured, we cannot verify — reject for safety.
    console.warn('[Calendly] No signing key configured; rejecting webhook.');
    return false;
  }

  try {
    const hmac = crypto.createHmac('sha256', signingKey);
    hmac.update(rawBody);
    const expected = hmac.digest('base64');
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader));
  } catch {
    return false;
  }
}

interface CalendlyInvitee {
  uuid?: string;
  email?: string;
  name?: string;
  cancel_url?: string;
  reschedule_url?: string;
  scheduled_event?: {
    uuid?: string;
    name?: string;
    start_time?: string;
    end_time?: string;
    location?: { type?: string; location?: string };
  };
  questions_and_answers?: Array<{ question?: string; answer?: string }>;
  new_invitee?: { email?: string; name?: string };
  old_invitee?: { email?: string; name?: string };
}

interface CalendlyEventPayload {
  event?: string;
  payload?: {
    created_at?: string;
    event?: string;
    invitee?: CalendlyInvitee;
    event_type?: { name?: string; duration?: number };
    old_event?: { uuid?: string };
    new_event?: { uuid?: string };
  };
  event_id?: string;
}

function toSafeDate(iso?: string): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

function extractInvitee(payload: CalendlyEventPayload['payload']): { name?: string; email?: string; cancel?: string; reschedule?: string } {
  const invitee = payload?.invitee;
  return {
    name: invitee?.name || undefined,
    email: invitee?.email || undefined,
    cancel: invitee?.cancel_url || undefined,
    reschedule: invitee?.reschedule_url || undefined,
  };
}

function getInviteeAnswer(payload: CalendlyEventPayload['payload'], keywords: RegExp): string {
  return payload?.invitee?.questions_and_answers
    ?.find(item => keywords.test(item.question || ''))
    ?.answer?.trim() || '';
}

function extractEventInfo(payload: CalendlyEventPayload['payload']): { name: string; duration: number; location: string; url?: string } {
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

async function recordDelivery(eventId: string, eventType: string, payload: any): Promise<boolean> {
  const existing = await prisma.calendlywebhookdelivery.findUnique({ where: { eventId } });
  if (existing) {
    // Already seen — skip (idempotent). If it previously failed, allow retry.
    if (existing.status === 'processed') return false;
  }
  await prisma.calendlywebhookdelivery.upsert({
    where: { eventId },
    update: { status: 'processing' },
    create: { id: crypto.randomUUID(), eventId, eventType, payload, status: 'processing' },
  });
  return true;
}

async function finalizeDelivery(eventId: string, status: 'processed' | 'failed'): Promise<void> {
  await prisma.calendlywebhookdelivery.update({
    where: { eventId },
    data: { status, processedAt: new Date() },
  }).catch(() => { });
}

async function sendAppointmentEmails(a: { customerName: string; customerEmail: string; customerPhone: string; appointmentStart: Date; appointmentEnd: Date; meetingLocation: string; meetingUrl: string; referenceNo: string; eventName: string; durationMinutes: number; formMessage: string }): Promise<void> {
  const brand = getBrandContext();
  const adminEmail = getOwnerEmail();
  const start = a.appointmentStart;

  const fmtDate = start.toLocaleString('en-US', { timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const fmtTime = start.toLocaleString('en-US', { timeZone: 'UTC', hour: 'numeric', minute: '2-digit' });

  const html = buildAppointmentConfirmation({
    customerName: a.customerName,
    customerEmail: a.customerEmail,
    appointmentDate: fmtDate,
    appointmentTime: fmtTime,
    durationMinutes: String(a.durationMinutes),
    meetingLocation: a.meetingLocation,
    meetingUrl: a.meetingUrl,
    referenceNumber: a.referenceNo,
  }, brand);

  const ownerHtml = buildOwnerNotification({
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
    sendEmail({
      to: a.customerEmail,
      subject: `Appointment Confirmed — ${brand.businessName} (${a.referenceNo})`,
      html,
    }),
    sendEmail({
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

export async function handleCalendlyEvent(rawBody: string | Buffer, signatureHeader?: string): Promise<{ ok: boolean; status: number; message: string }> {
  const verified = verifyCalendlySignature(rawBody, signatureHeader);
  if (!verified) {
    return { ok: false, status: 401, message: 'Invalid signature' };
  }

  let data: CalendlyEventPayload;
  try {
    data = JSON.parse(typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8'));
  } catch {
    return { ok: false, status: 400, message: 'Malformed JSON' };
  }

  const eventType = data.event || data.payload?.event || 'unknown';
  const eventId = data.event_id || data.payload?.invitee?.uuid || crypto.randomUUID();
  const event = data.payload;
  const invitee = extractInvitee(event);
  const eventInfo = extractEventInfo(event);

  // Idempotency guard
  const proceed = await recordDelivery(eventId, eventType, data as any);
  if (!proceed) {
    return { ok: true, status: 200, message: 'Duplicate event ignored' };
  }

  try {
    if (eventType === 'invitee.created' && event?.created_at) {
      const start = toSafeDate(event.invitee?.scheduled_event?.start_time || event.created_at);
      const end = toSafeDate(event.invitee?.scheduled_event?.end_time) ||
        (start ? new Date(start.getTime() + (eventInfo.duration || 30) * 60000) : null);
      const referenceNo = `APT-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

      const existingAppointment = await prisma.appointment.findFirst({
        where: { webhookEventId: eventId },
      });
      const customerPhone = getInviteeAnswer(event, /phone|mobile|telephone/i);
      const formMessage = getInviteeAnswer(event, /message|details|notes|reason/i);
      const appointment = existingAppointment || await prisma.appointment.create({
        data: {
          id: crypto.randomUUID(),
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
          appointmentStart: start as Date,
          appointmentEnd: end as Date,
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
      await prisma.appointment.updateMany({
        where: { calendlyInviteeUri: data.payload?.invitee?.uuid || eventId },
        data: { appointmentStatus: 'cancelled' },
      });

      if (invitee.email) {
        const brand = getBrandContext();
        const html = buildAppointmentCancellation({
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
          sendEmail({ to: invitee.email, subject: `Appointment Cancelled — ${brand.businessName}`, html }),
          sendEmail({
            to: getOwnerEmail(),
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
      await prisma.appointment.updateMany({
        where: { calendlyInviteeUri: data.payload?.invitee?.uuid || eventId },
        data: { appointmentStatus: 'scheduled', calendlyEventId: event.new_event.uuid },
      });
      await finalizeDelivery(eventId, 'processed');
      return { ok: true, status: 200, message: 'rescheduled' };
    }

    // Unhandled event type — still mark processed to avoid infinite retries.
    await finalizeDelivery(eventId, 'processed');
    return { ok: true, status: 200, message: `unhandled:${eventType}` };
  } catch (e: any) {
    console.error('[Calendly] webhook processing error:', e.message);
    await finalizeDelivery(eventId, 'failed');
    return { ok: false, status: 500, message: 'Processing error' };
  }
}
