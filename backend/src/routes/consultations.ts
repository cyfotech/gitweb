import { Router, Response } from 'express';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import { sendConsultationEmails, FormEmailResult } from '../utils/mailer';
import { logger } from '../utils/logger';
import { isValidEmail, sendEmail, getOwnerEmail } from '../services/emailService';
import {
  buildAdminReplyEmail,
  buildAppointmentConfirmation,
  buildAppointmentCancellation,
  buildOwnerNotification,
  getBrandContext,
} from '../services/emailTemplateService';

const router = Router();
const consultationSubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many consultation requests. Please try again later.' },
});
const consultationReplyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

function getRouteParam(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

// Helper to format service slugs into readable titles
function formatServiceName(slug: string): string {
  if (!slug) return 'Strategic Discovery & CPA Advisory';
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ----------------------------------------------------
// PUBLIC ROUTE: POST /api/v1/consultations
// Customer submission from Book Consultation Form
// ----------------------------------------------------
router.post('/', consultationSubmitLimiter, async (req, res) => {
  try {
    const data = req.body && typeof req.body === 'object' ? req.body : {};
    const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';

    const fullName = text(data.fullName) ||
      `${text(data.firstName)} ${text(data.lastName)}`.trim();
    const email = text(data.email).toLowerCase();
    const phone = text(data.phone);
    const serviceSlug = text(data.serviceSlug);
    const message = text(data.message);
    const sourcePage = text(data.sourcePage) || '/book-consultation';

    if (!fullName || fullName.length > 120) {
      return res.status(400).json({ error: 'Customer name is required and must be 120 characters or fewer.' });
    }

    if (email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    const phoneDigits = phone.replace(/\D/g, '').length;
    if (phone.length > 32 || !/^\+?[\d\s().-]+$/.test(phone) || phoneDigits < 7 || phoneDigits > 15) {
      return res.status(400).json({ error: 'A valid phone number is required.' });
    }

    if (!serviceSlug || serviceSlug.length > 191) {
      return res.status(400).json({ error: 'A consultation service must be selected.' });
    }
    if (message.length > 5000 || sourcePage.length > 500) {
      return res.status(400).json({ error: 'Message or source page is invalid or too long.' });
    }
    const category = text(data.serviceCategory || data.category) || 'business';
    const preferredContactMethod = text(data.preferredContactMethod) || 'email';
    const companyName = text(data.companyName || data.company);
    const annualVolumeOrRevenue = text(data.annualRevenue || data.annualVolumeOrRevenue) || 'standard';
    const serviceName = text(data.serviceName) || formatServiceName(serviceSlug);
    if (!['individual', 'business', 'cpa'].includes(category) ||
      !['email', 'phone'].includes(preferredContactMethod) ||
      companyName.length > 191 || annualVolumeOrRevenue.length > 100 || serviceName.length > 191) {
      return res.status(400).json({ error: 'One or more consultation details are invalid.' });
    }
    if (data.privacyConsent !== true) {
      return res.status(400).json({ error: 'Privacy consent is required to submit a consultation request.' });
    }

    // Prevent accidental rapid duplicate submission within 60 seconds
    const recentDuplicate = await prisma.consultationrequest.findFirst({
      where: {
        email,
        serviceSlug,
        createdAt: {
          gte: new Date(Date.now() - 60 * 1000),
        },
      },
    });

    if (recentDuplicate) {
      return res.status(409).json({
        error: `This consultation request was already received. Reference: ${recentDuplicate.referenceNo}. Please do not submit it again.`,
      });
    }

    const ts = Date.now().toString(36).toUpperCase();
    const randHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    let referenceNo = `STE-CONS-${ts}-${randHex}`;
    let collisionCheck = await prisma.consultationrequest.findUnique({ where: { referenceNo } });
    while (collisionCheck) {
      const nextRand = crypto.randomBytes(3).toString('hex').toUpperCase();
      referenceNo = `STE-CONS-${Date.now().toString(36).toUpperCase()}-${nextRand}`;
      collisionCheck = await prisma.consultationrequest.findUnique({ where: { referenceNo } });
    }

    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Direct Client Browser';

    const initialHistory = JSON.stringify([
      {
        id: uuidv4(),
        status: 'new',
        title: 'Consultation Request Received',
        changedBy: 'Customer (Online)',
        timestamp: new Date().toISOString(),
        note: 'Customer submitted consultation and scope inquiry.',
      },
    ]);

    const consultation = await prisma.consultationrequest.create({
      data: {
        id: uuidv4(),
        referenceNo,
        fullName,
        email,
        phone,
        companyName: companyName || null,
        category,
        serviceSlug,
        annualVolumeOrRevenue,
        preferredContactMethod,
        message,
        privacyConsent: data.privacyConsent !== false,
        status: 'new',
        ipAddress: typeof clientIp === 'string' ? clientIp.split(',')[0].trim() : '127.0.0.1',
        userAgent: userAgent.slice(0, 255),
        statusHistory: initialHistory,
        notes: JSON.stringify([]),
      },
    });

    let emailResult: FormEmailResult;
    try {
      emailResult = await sendConsultationEmails({
        referenceNo,
        fullName,
        email: consultation.email,
        phone: consultation.phone,
        companyName: consultation.companyName,
        category: consultation.category,
        serviceName,
        annualVolumeOrRevenue: consultation.annualVolumeOrRevenue,
        preferredContactMethod: consultation.preferredContactMethod,
        message: consultation.message,
        createdAt: consultation.createdAt,
      }, sourcePage);
    } catch (error) {
      logger.error('Consultation saved but email processing failed', {
        referenceNo,
        error: error instanceof Error ? error.message : String(error),
      });
      emailResult = {
        customerSent: false,
        ownerSent: false,
        customerError: 'Email processing failed before SMTP delivery.',
        ownerError: 'Email processing failed before SMTP delivery.',
        error: 'Your request is saved, but email processing failed. Our team can locate it using your reference number.',
      };
    }

    const communicationHistory = [
      {
        id: uuidv4(),
        type: 'EMAIL',
        direction: 'OUTBOUND',
        purpose: 'customer_confirmation',
        subject: 'We received your consultation request',
        body: `Confirmation email for ${referenceNo}`,
        sender: 'STE Smart Tax Experts',
        recipient: consultation.email,
        timestamp: new Date().toISOString(),
        deliveryStatus: emailResult.customerSent ? 'accepted_by_smtp' : 'not_accepted',
        messageId: emailResult.customerMessageId,
        error: emailResult.customerError,
      },
      {
        id: uuidv4(),
        type: 'EMAIL',
        direction: 'OUTBOUND',
        purpose: 'owner_notification',
        subject: `New consultation request: ${fullName}`,
        body: `Owner notification for ${referenceNo}`,
        sender: 'STE Smart Tax Experts',
        recipient: emailResult.ownerEmail || '',
        timestamp: new Date().toISOString(),
        deliveryStatus: emailResult.ownerSent ? 'accepted_by_smtp' : 'not_accepted',
        messageId: emailResult.ownerMessageId,
        error: emailResult.ownerError,
      },
    ];
    await prisma.consultationrequest.update({
      where: { id: consultation.id },
      data: { communicationHistory: JSON.stringify(communicationHistory) },
    });

    return res.status(201).json({
      success: true,
      id: consultation.id,
      referenceNo: consultation.referenceNo,
      submissionReceived: true,
      emailDelivery: {
        customerConfirmation: emailResult.customerSent ? 'accepted_by_smtp' : 'not_accepted',
        ownerNotification: emailResult.ownerSent ? 'accepted_by_smtp' : 'not_accepted',
      },
      emailDeliveryErrors: {
        customerConfirmation: emailResult.customerError,
        ownerNotification: emailResult.ownerError,
      },
      emailDeliveryMessage: emailResult.error,
      message: 'Consultation request submitted successfully.',
    });
  } catch (err: any) {
    console.error('Failed to book consultation:', err);
    return res.status(500).json({ error: 'Database operation failed. Could not save consultation.' });
  }
});

// Helper to parse notes safely into an array of objects
function parseNotes(notesStr?: string | null) {
  if (!notesStr) return [];
  try {
    const parsed = JSON.parse(notesStr);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // If legacy plain text notes exist, convert into object array
    if (typeof notesStr === 'string' && notesStr.trim()) {
      return [{
        id: 'legacy-1',
        text: notesStr.trim(),
        author: 'Administrator',
        timestamp: new Date().toISOString(),
      }];
    }
  }
  return [];
}

function parseCommunicationHistory(value?: string | null): any[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ----------------------------------------------------
// ADMIN ROUTE: GET /api/v1/consultations
// Clean search, sort (newest/oldest), status, category, date
// ----------------------------------------------------
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 100;
    const skip = (page - 1) * limit;

    const { status, category, search, startDate, endDate, sort } = req.query as Record<string, string>;

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { fullName: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
        { companyName: { contains: q } },
        { referenceNo: { contains: q } },
        { serviceSlug: { contains: q } },
      ];
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const orderByDirection = sort === 'oldest' ? 'asc' : 'desc';

    const [consultations, total] = await Promise.all([
      prisma.consultationrequest.findMany({
        where,
        orderBy: { createdAt: orderByDirection },
        skip,
        take: limit,
      }),
      prisma.consultationrequest.count({ where }),
    ]);

    const parsed = consultations.map(c => {
      let historyList = [];
      try {
        if (c.statusHistory) historyList = JSON.parse(c.statusHistory);
      } catch {
        historyList = [];
      }
      return {
        ...c,
        statusHistory: historyList,
        parsedNotes: parseNotes(c.notes),
        communicationHistory: parseCommunicationHistory(c.communicationHistory),
      };
    });

    return res.json({
      consultations: parsed,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    console.error('Failed to fetch consultations:', err);
    return res.status(500).json({ error: 'Failed to fetch consultations from database' });
  }
});

// ----------------------------------------------------
// ADMIN ROUTE: GET /api/v1/consultations/analytics
// Clean 5 Essential Counts directly from live database
// ----------------------------------------------------
router.get('/analytics', authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const [
      total,
      newCount,
      scheduledCount,
      inProgressCount,
      completedCount,
      contactedCount,
      cancelledCount,
      rejectedCount,
    ] = await Promise.all([
      prisma.consultationrequest.count(),
      prisma.consultationrequest.count({ where: { status: { in: ['new', 'pending', 'pending_review'] } } }),
      prisma.consultationrequest.count({ where: { status: 'scheduled' } }),
      prisma.consultationrequest.count({ where: { status: 'in_progress' } }),
      prisma.consultationrequest.count({ where: { status: 'completed' } }),
      prisma.consultationrequest.count({ where: { status: 'contacted' } }),
      prisma.consultationrequest.count({ where: { status: 'cancelled' } }),
      prisma.consultationrequest.count({ where: { status: 'rejected' } }),
    ]);

    return res.json({
      summary: {
        total,
        new: newCount,
        contacted: contactedCount,
        scheduled: scheduledCount,
        inProgress: inProgressCount,
        completed: completedCount,
        cancelled: cancelledCount,
        rejected: rejectedCount,
      },
    });
  } catch (err: any) {
    console.error('Failed to generate consultation analytics:', err);
    return res.status(500).json({ error: 'Failed to aggregate consultation statistics' });
  }
});

// ----------------------------------------------------
// ADMIN ROUTE: GET /api/v1/consultations/:id
// Single Consultation Record
// ----------------------------------------------------
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const consultationId = getRouteParam(req.params.id);
    const consultation = await prisma.consultationrequest.findUnique({
      where: { id: consultationId },
    });

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation request not found' });
    }

    let history: any[] = [];
    try {
      if (consultation.statusHistory) history = JSON.parse(consultation.statusHistory);
    } catch {
      history = [];
    }

    return res.json({
      ...consultation,
      statusHistory: history,
      parsedNotes: parseNotes(consultation.notes),
      communicationHistory: parseCommunicationHistory(consultation.communicationHistory),
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to load consultation details' });
  }
});

router.post('/:id/reply', authenticate, consultationReplyLimiter, async (req: AuthRequest, res: Response) => {
  const { to, subject, message } = req.body as { to?: unknown; subject?: unknown; message?: unknown };
  const recipient = typeof to === 'string' ? to.trim().toLowerCase() : '';
  if (!isValidEmail(recipient)) {
    return res.status(400).json({ error: 'A valid recipient email address is required.' });
  }
  if (typeof subject !== 'string' || !subject.trim() || subject.length > 200 || /[\r\n]/.test(subject)) {
    return res.status(400).json({ error: 'Email subject is required and must be 200 characters or fewer.' });
  }
  if (typeof message !== 'string' || !message.trim() || message.length > 20000) {
    return res.status(400).json({ error: 'Email message is required and must be 20,000 characters or fewer.' });
  }

  try {
    const consultationId = getRouteParam(req.params.id);
    const current = await prisma.consultationrequest.findUnique({ where: { id: consultationId } });
    if (!current) return res.status(404).json({ error: 'Consultation request not found.' });
    const adminName = req.adminUser?.name || 'STE Smart Tax Experts Team';
    const delivery = await sendEmail({
      to: recipient,
      subject: subject.trim(),
      replyTo: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      html: buildAdminReplyEmail({
        message: message.trim(),
        referenceNumber: current.referenceNo || current.id,
      }, getBrandContext()),
    });
    const communicationHistory = parseCommunicationHistory(current.communicationHistory);
    const communication = {
      id: uuidv4(),
      type: 'EMAIL',
      direction: 'OUTBOUND',
      purpose: 'admin_reply',
      subject: subject.trim(),
      body: message.trim(),
      sender: adminName,
      recipient,
      timestamp: new Date().toISOString(),
      deliveryStatus: delivery.success ? 'accepted_by_smtp' : 'not_accepted',
      messageId: delivery.messageId,
      error: delivery.error,
    };
    communicationHistory.push(communication);

    await prisma.consultationrequest.update({
      where: { id: consultationId },
      data: { communicationHistory: JSON.stringify(communicationHistory) },
    });

    if (!delivery.success) {
      return res.status(502).json({
        error: delivery.error || 'SMTP did not accept the reply.',
        communicationHistory,
      });
    }

    return res.json({
      success: true,
      acceptedBySmtp: true,
      messageId: delivery.messageId,
      communicationHistory,
    });
  } catch (error) {
    logger.error('Failed to send consultation reply', {
      error: error instanceof Error ? error.message : String(error),
    });
    return res.status(500).json({ error: 'Failed to send consultation email reply.' });
  }
});

// ----------------------------------------------------
// ADMIN ROUTE: PUT /api/v1/consultations/:id/status
// Status transition with audit trail & optional cancellation reason
// ----------------------------------------------------
router.put('/:id/status', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { status, note, cancellationReason, appointmentDate, appointmentTime, meetingType, meetingLocation, assignedAdminName } = req.body;
    const adminUser = req.adminUser;

    const consultationId = getRouteParam(req.params.id);
    const existing = await prisma.consultationrequest.findUnique({
      where: { id: consultationId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Consultation request not found' });
    }

    let history: any[] = [];
    try {
      if (existing.statusHistory) history = JSON.parse(existing.statusHistory);
    } catch {
      history = [];
    }

    const changedByName = adminUser ? `${adminUser.name || adminUser.email}` : 'Administrator';

    let actionTitle = `Status updated to ${status.replace('_', ' ').toUpperCase()}`;
    if (status === 'approved') actionTitle = 'Consultation Approved';
    if (status === 'contacted') actionTitle = 'Customer Contacted';
    if (status === 'scheduled') actionTitle = 'Consultation Scheduled';
    if (status === 'in_progress') actionTitle = 'Consultation In Progress';
    if (status === 'completed') actionTitle = 'Consultation Completed';
    if (status === 'cancelled') actionTitle = 'Consultation Cancelled';
    if (status === 'rejected') actionTitle = 'Consultation Rejected';

    history.unshift({
      id: uuidv4(),
      status,
      title: actionTitle,
      changedBy: changedByName,
      timestamp: new Date().toISOString(),
      note: note || cancellationReason || `Status transition from ${existing.status} to ${status}`,
    });

    const updateData: any = {
      status,
      statusHistory: JSON.stringify(history),
    };

    if (cancellationReason !== undefined) updateData.cancellationReason = cancellationReason;
    if (appointmentDate !== undefined) updateData.appointmentDate = appointmentDate;
    if (appointmentTime !== undefined) updateData.appointmentTime = appointmentTime;
    if (meetingType !== undefined) updateData.meetingType = meetingType;
    if (meetingLocation !== undefined) updateData.meetingLocation = meetingLocation;
    if (assignedAdminName !== undefined) updateData.assignedAdminName = assignedAdminName;

    const updated = await prisma.consultationrequest.update({
      where: { id: consultationId },
      data: updateData,
    });

    // Automated professional customer email updates based on status
    const brand = getBrandContext();
    const refNo = existing.referenceNo || existing.id;

    if (status === 'approved') {
      try {
        const approvedHtml = `
          <div style="padding:32px 28px;">
            <div style="display:inline-block;background:#E7F8EF;color:#087C50;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;padding:6px 14px;border-radius:999px;margin-bottom:16px;">
              ✓ Consultation Approved
            </div>
            <h2 style="margin:0 0 12px;font-size:22px;color:#0F172A;font-weight:800;">Dear ${existing.fullName},</h2>
            <p style="font-size:15px;line-height:1.7;color:#334155;margin:0 0 16px;">
              Your consultation request has been reviewed and <strong>approved</strong> by our senior advisory team.
            </p>
            <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:16px;margin-bottom:20px;">
              <p style="margin:0;font-size:14px;color:#166534;font-weight:600;">
                Consultation Reference: <strong style="font-family:monospace;font-size:16px;">${refNo}</strong>
              </p>
              <p style="margin:6px 0 0;font-size:13px;color:#15803D;">
                Service: <strong>${formatServiceName(existing.serviceSlug)}</strong>
              </p>
            </div>
            <p style="font-size:14px;line-height:1.7;color:#475569;margin:0 0 20px;">
              ${note || 'Our specialist will contact you directly to conduct your session. You can also pick an instant meeting slot on our online calendar if you prefer.'}
            </p>
            ${brand.calendlyUrl ? `
              <div style="text-align:center;margin:28px 0;">
                <a href="${brand.calendlyUrl}" style="display:inline-block;background:#087C50;color:#FFFFFF;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none;box-shadow:0 4px 12px rgba(8,124,80,0.25);">
                  Pick a Time on Calendly &rarr;
                </a>
              </div>
            ` : ''}
            <p style="font-size:13px;color:#64748B;margin:24px 0 0;border-top:1px solid #E2E8F0;padding-top:16px;">
              Questions? Reply directly to this email or reach us at <a href="mailto:${brand.businessEmail}" style="color:#087C50;font-weight:600;">${brand.businessEmail}</a>.
            </p>
          </div>
        `;
        await sendEmail({
          to: existing.email,
          subject: `Consultation Approved — ${brand.businessName} [Ref: ${refNo}]`,
          html: approvedHtml,
        });
      } catch (emailErr) {
        logger.error('Failed to dispatch consultation approved email', { error: emailErr });
      }
    } else if (status === 'rejected') {
      try {
        const rejectedHtml = `
          <div style="padding:32px 28px;">
            <div style="display:inline-block;background:#FEE2E2;color:#991B1B;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;padding:6px 14px;border-radius:999px;margin-bottom:16px;">
              Consultation Status Update
            </div>
            <h2 style="margin:0 0 12px;font-size:22px;color:#0F172A;font-weight:800;">Dear ${existing.fullName},</h2>
            <p style="font-size:15px;line-height:1.7;color:#334155;margin:0 0 16px;">
              Thank you for your interest in ${brand.businessName}. After reviewing your submission [Ref: <strong>${refNo}</strong>], our team is unable to accept this specific consultation at this time.
            </p>
            ${cancellationReason || note ? `
              <div style="background:#FEF2F2;border-left:4px solid #EF4444;padding:14px 16px;border-radius:4px;margin:16px 0;">
                <p style="margin:0;font-size:13px;color:#991B1B;line-height:1.6;">
                  <strong>Note from team:</strong> ${cancellationReason || note}
                </p>
              </div>
            ` : ''}
            <p style="font-size:14px;line-height:1.7;color:#475569;margin:16px 0;">
              If you have any further questions or feel your requirements align with other services, please contact our support team at <a href="mailto:${brand.businessEmail}" style="color:#087C50;font-weight:600;">${brand.businessEmail}</a>.
            </p>
          </div>
        `;
        await sendEmail({
          to: existing.email,
          subject: `Update Regarding Your Consultation Request — ${brand.businessName} [Ref: ${refNo}]`,
          html: rejectedHtml,
        });
      } catch (emailErr) {
        logger.error('Failed to dispatch consultation rejected email', { error: emailErr });
      }
    } else if (status === 'cancelled') {
      try {
        const cancelHtml = buildAppointmentCancellation({
          customerName: existing.fullName,
          customerEmail: existing.email,
          appointmentDate: existing.appointmentDate || 'Upcoming',
          appointmentTime: existing.appointmentTime || 'Scheduled Session',
          durationMinutes: '30',
          meetingLocation: existing.meetingLocation || 'Online',
          meetingUrl: '',
          referenceNumber: refNo,
        }, brand);
        await sendEmail({
          to: existing.email,
          subject: `Consultation Cancelled — ${brand.businessName} [Ref: ${refNo}]`,
          html: cancelHtml,
        });
      } catch (emailErr) {
        logger.error('Failed to dispatch consultation cancelled email', { error: emailErr });
      }
    }

    return res.json({
      ...updated,
      statusHistory: history,
      parsedNotes: parseNotes(updated.notes),
    });
  } catch (err: any) {
    console.error('Failed to update consultation status:', err);
    return res.status(500).json({ error: 'Failed to update consultation status' });
  }
});

// ----------------------------------------------------
// ADMIN ROUTE: PUT /api/v1/consultations/:id/schedule
// Schedule or update consultation appointment details
// ----------------------------------------------------
router.put('/:id/schedule', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { appointmentDate, appointmentTime, meetingType, meetingLocation, assignedAdminName } = req.body;
    const adminUser = req.adminUser;
    const consultationId = getRouteParam(req.params.id);

    const existing = await prisma.consultationrequest.findUnique({
      where: { id: consultationId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Consultation request not found' });
    }

    let history: any[] = [];
    try {
      if (existing.statusHistory) history = JSON.parse(existing.statusHistory);
    } catch {
      history = [];
    }

    const changedByName = adminUser ? `${adminUser.name || adminUser.email}` : 'Administrator';

    history.unshift({
      id: uuidv4(),
      status: 'scheduled',
      title: 'Appointment Scheduled',
      changedBy: changedByName,
      timestamp: new Date().toISOString(),
      note: `Appointment confirmed for ${appointmentDate} at ${appointmentTime} via ${meetingType}. Assigned to ${assignedAdminName || 'Staff'}.`,
    });

    const updated = await prisma.consultationrequest.update({
      where: { id: consultationId },
      data: {
        status: 'scheduled',
        appointmentDate,
        appointmentTime,
        meetingType,
        meetingLocation,
        assignedAdminName,
        statusHistory: JSON.stringify(history),
      },
    });

    // Send professional HTML appointment confirmation email to customer & notification to owner
    const brand = getBrandContext();
    const adminEmail = getOwnerEmail();
    const durationMinutes = req.body.durationMinutes || '30';

    try {
      const customerHtml = buildAppointmentConfirmation({
        customerName: existing.fullName,
        customerEmail: existing.email,
        appointmentDate,
        appointmentTime,
        durationMinutes: String(durationMinutes),
        meetingLocation: meetingLocation || 'Online Video (Google Meet / Zoom)',
        meetingUrl: meetingLocation && /^https?:\/\//i.test(meetingLocation) ? meetingLocation : '',
        referenceNumber: existing.referenceNo || existing.id,
      }, brand);

      const ownerHtml = buildOwnerNotification({
        referenceNumber: existing.referenceNo || existing.id,
        sourcePage: 'Admin Scheduled Appointment',
        fields: [
          { label: 'Event', value: 'Consultation Appointment Confirmed' },
          { label: 'Customer Name', value: existing.fullName },
          { label: 'Customer Email', value: existing.email },
          { label: 'Phone', value: existing.phone || 'Not provided' },
          { label: 'Date', value: appointmentDate },
          { label: 'Time', value: appointmentTime },
          { label: 'Duration', value: `${durationMinutes} minutes` },
          { label: 'Meeting Type / Location', value: meetingLocation || meetingType || 'Online' },
          { label: 'Assigned Advisor', value: assignedAdminName || changedByName },
          { label: 'Scheduled By', value: changedByName },
          { label: 'Timestamp', value: new Date().toISOString() },
        ],
      }, brand);

      await Promise.all([
        sendEmail({
          to: existing.email,
          subject: `Consultation Appointment Confirmed — ${brand.businessName} [Ref: ${existing.referenceNo || existing.id}]`,
          html: customerHtml,
        }),
        sendEmail({
          to: adminEmail,
          subject: `Appointment Scheduled — ${existing.fullName} [Ref: ${existing.referenceNo || existing.id}]`,
          html: ownerHtml,
          replyTo: existing.email,
        }),
      ]);
    } catch (emailErr) {
      console.error('Failed to send appointment confirmation email:', emailErr);
    }

    return res.json({
      ...updated,
      statusHistory: history,
      parsedNotes: parseNotes(updated.notes),
    });
  } catch (err: any) {
    console.error('Failed to schedule appointment:', err);
    return res.status(500).json({ error: 'Failed to schedule appointment' });
  }
});

// ----------------------------------------------------
// ADMIN ROUTE: POST /api/v1/consultations/:id/notes
// Add, Edit, or Delete Individual Note
// ----------------------------------------------------
router.post('/:id/notes', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { note } = req.body;
    if (!note || !note.trim()) {
      return res.status(400).json({ error: 'Note text cannot be empty' });
    }

    const adminUser = req.adminUser;
    const consultationId = getRouteParam(req.params.id);
    const existing = await prisma.consultationrequest.findUnique({
      where: { id: consultationId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    const author = adminUser ? `${adminUser.name || adminUser.email}` : 'Administrator';
    const notesList = parseNotes(existing.notes);

    const newNoteObj = {
      id: uuidv4(),
      text: note.trim(),
      author,
      timestamp: new Date().toISOString(),
    };

    notesList.unshift(newNoteObj);

    // Also record in activity timeline
    let history: any[] = [];
    try {
      if (existing.statusHistory) history = JSON.parse(existing.statusHistory);
    } catch {
      history = [];
    }

    history.unshift({
      id: uuidv4(),
      status: existing.status,
      title: 'Internal Note Added',
      changedBy: author,
      timestamp: new Date().toISOString(),
      note: note.trim().slice(0, 100) + (note.trim().length > 100 ? '...' : ''),
    });

    const updated = await prisma.consultationrequest.update({
      where: { id: consultationId },
      data: {
        notes: JSON.stringify(notesList),
        statusHistory: JSON.stringify(history),
      },
    });

    return res.json({
      ...updated,
      statusHistory: history,
      parsedNotes: notesList,
    });
  } catch (err: any) {
    console.error('Failed to add note to consultation:', err);
    return res.status(500).json({ error: 'Failed to save note' });
  }
});

// Delete note by Note ID
router.delete('/:id/notes/:noteId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id, noteId } = req.params;
    const consultationId = getRouteParam(id);
    const noteIdStr = getRouteParam(noteId);
    const existing = await prisma.consultationrequest.findUnique({
      where: { id: consultationId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    const currentNotes = parseNotes(existing.notes);
    const filteredNotes = currentNotes.filter((n: any) => n.id !== noteIdStr);

    const updated = await prisma.consultationrequest.update({
      where: { id: consultationId },
      data: {
        notes: JSON.stringify(filteredNotes),
      },
    });

    return res.json({
      ...updated,
      parsedNotes: filteredNotes,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete note' });
  }
});

// ----------------------------------------------------
// ADMIN ROUTE: PUT /api/v1/consultations/:id
// Update customer profile
// ----------------------------------------------------
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { fullName, email, phone, companyName, category, preferredContactMethod, message } = req.body;
    const consultationId = getRouteParam(req.params.id);

    const updated = await prisma.consultationrequest.update({
      where: { id: consultationId },
      data: {
        fullName,
        email,
        phone,
        companyName,
        category,
        preferredContactMethod,
        message,
      },
    });

    return res.json({
      ...updated,
      parsedNotes: parseNotes(updated.notes),
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update consultation information' });
  }
});

// ----------------------------------------------------
// ADMIN ROUTE: DELETE /api/v1/consultations/:id
// Permanently remove consultation request
// ----------------------------------------------------
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const consultationId = getRouteParam(req.params.id);
    await prisma.consultationrequest.delete({
      where: { id: consultationId },
    });
    return res.json({ success: true, message: 'Consultation deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete consultation record' });
  }
});

export default router;
