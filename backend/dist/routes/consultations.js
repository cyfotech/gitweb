"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth_1 = require("../middleware/auth");
const uuid_1 = require("uuid");
const mailer_1 = require("../utils/mailer");
const logger_1 = require("../utils/logger");
const emailService_1 = require("../services/emailService");
const emailTemplateService_1 = require("../services/emailTemplateService");
const router = (0, express_1.Router)();
const consultationSubmitLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many consultation requests. Please try again later.' },
});
const consultationReplyLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
});
function getRouteParam(value) {
    return Array.isArray(value) ? value[0] : value;
}
// Helper to format service slugs into readable titles
function formatServiceName(slug) {
    if (!slug)
        return 'Strategic Discovery & CPA Advisory';
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
        const text = (value) => typeof value === 'string' ? value.trim() : '';
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
        const recentDuplicate = await prisma_1.default.consultationrequest.findFirst({
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
        const randomSuffix = Math.floor(100000 + Math.random() * 900000);
        const referenceNo = `STE-CONS-${randomSuffix}`;
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
        const userAgent = req.headers['user-agent'] || 'Direct Client Browser';
        const initialHistory = JSON.stringify([
            {
                id: (0, uuid_1.v4)(),
                status: 'new',
                title: 'Consultation Request Received',
                changedBy: 'Customer (Online)',
                timestamp: new Date().toISOString(),
                note: 'Customer submitted consultation and scope inquiry.',
            },
        ]);
        const consultation = await prisma_1.default.consultationrequest.create({
            data: {
                id: (0, uuid_1.v4)(),
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
        let emailResult;
        try {
            emailResult = await (0, mailer_1.sendConsultationEmails)({
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
        }
        catch (error) {
            logger_1.logger.error('Consultation saved but email processing failed', {
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
                id: (0, uuid_1.v4)(),
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
                id: (0, uuid_1.v4)(),
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
        await prisma_1.default.consultationrequest.update({
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
    }
    catch (err) {
        console.error('Failed to book consultation:', err);
        return res.status(500).json({ error: 'Database operation failed. Could not save consultation.' });
    }
});
// Helper to parse notes safely into an array of objects
function parseNotes(notesStr) {
    if (!notesStr)
        return [];
    try {
        const parsed = JSON.parse(notesStr);
        if (Array.isArray(parsed))
            return parsed;
    }
    catch {
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
function parseCommunicationHistory(value) {
    if (!value)
        return [];
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch {
        return [];
    }
}
// ----------------------------------------------------
// ADMIN ROUTE: GET /api/v1/consultations
// Clean search, sort (newest/oldest), status, category, date
// ----------------------------------------------------
router.get('/', auth_1.authenticate, async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 100;
        const skip = (page - 1) * limit;
        const { status, category, search, startDate, endDate, sort } = req.query;
        const where = {};
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
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        const orderByDirection = sort === 'oldest' ? 'asc' : 'desc';
        const [consultations, total] = await Promise.all([
            prisma_1.default.consultationrequest.findMany({
                where,
                orderBy: { createdAt: orderByDirection },
                skip,
                take: limit,
            }),
            prisma_1.default.consultationrequest.count({ where }),
        ]);
        const parsed = consultations.map(c => {
            let historyList = [];
            try {
                if (c.statusHistory)
                    historyList = JSON.parse(c.statusHistory);
            }
            catch {
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
    }
    catch (err) {
        console.error('Failed to fetch consultations:', err);
        return res.status(500).json({ error: 'Failed to fetch consultations from database' });
    }
});
// ----------------------------------------------------
// ADMIN ROUTE: GET /api/v1/consultations/analytics
// Clean 5 Essential Counts directly from live database
// ----------------------------------------------------
router.get('/analytics', auth_1.authenticate, async (_req, res) => {
    try {
        const [total, newCount, scheduledCount, inProgressCount, completedCount, contactedCount, cancelledCount, rejectedCount,] = await Promise.all([
            prisma_1.default.consultationrequest.count(),
            prisma_1.default.consultationrequest.count({ where: { status: { in: ['new', 'pending', 'pending_review'] } } }),
            prisma_1.default.consultationrequest.count({ where: { status: 'scheduled' } }),
            prisma_1.default.consultationrequest.count({ where: { status: 'in_progress' } }),
            prisma_1.default.consultationrequest.count({ where: { status: 'completed' } }),
            prisma_1.default.consultationrequest.count({ where: { status: 'contacted' } }),
            prisma_1.default.consultationrequest.count({ where: { status: 'cancelled' } }),
            prisma_1.default.consultationrequest.count({ where: { status: 'rejected' } }),
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
    }
    catch (err) {
        console.error('Failed to generate consultation analytics:', err);
        return res.status(500).json({ error: 'Failed to aggregate consultation statistics' });
    }
});
// ----------------------------------------------------
// ADMIN ROUTE: GET /api/v1/consultations/:id
// Single Consultation Record
// ----------------------------------------------------
router.get('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const consultationId = getRouteParam(req.params.id);
        const consultation = await prisma_1.default.consultationrequest.findUnique({
            where: { id: consultationId },
        });
        if (!consultation) {
            return res.status(404).json({ error: 'Consultation request not found' });
        }
        let history = [];
        try {
            if (consultation.statusHistory)
                history = JSON.parse(consultation.statusHistory);
        }
        catch {
            history = [];
        }
        return res.json({
            ...consultation,
            statusHistory: history,
            parsedNotes: parseNotes(consultation.notes),
            communicationHistory: parseCommunicationHistory(consultation.communicationHistory),
        });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to load consultation details' });
    }
});
router.post('/:id/reply', auth_1.authenticate, consultationReplyLimiter, async (req, res) => {
    const { subject, message } = req.body;
    if (typeof subject !== 'string' || !subject.trim() || subject.length > 200 || /[\r\n]/.test(subject)) {
        return res.status(400).json({ error: 'Email subject is required and must be 200 characters or fewer.' });
    }
    if (typeof message !== 'string' || !message.trim() || message.length > 20000) {
        return res.status(400).json({ error: 'Email message is required and must be 20,000 characters or fewer.' });
    }
    try {
        const consultationId = getRouteParam(req.params.id);
        const current = await prisma_1.default.consultationrequest.findUnique({ where: { id: consultationId } });
        if (!current)
            return res.status(404).json({ error: 'Consultation request not found.' });
        if (!(0, emailService_1.isValidEmail)(current.email))
            return res.status(400).json({ error: 'Customer email address is invalid.' });
        const adminName = req.adminUser?.name || 'STE Smart Tax Experts Team';
        const delivery = await (0, emailService_1.sendEmail)({
            to: current.email,
            subject: subject.trim(),
            replyTo: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
            html: (0, emailTemplateService_1.buildAdminReplyEmail)({
                message: message.trim(),
                referenceNumber: current.referenceNo || current.id,
            }, (0, emailTemplateService_1.getBrandContext)()),
        });
        const communicationHistory = parseCommunicationHistory(current.communicationHistory);
        const communication = {
            id: (0, uuid_1.v4)(),
            type: 'EMAIL',
            direction: 'OUTBOUND',
            purpose: 'admin_reply',
            subject: subject.trim(),
            body: message.trim(),
            sender: adminName,
            recipient: current.email,
            timestamp: new Date().toISOString(),
            deliveryStatus: delivery.success ? 'accepted_by_smtp' : 'not_accepted',
            messageId: delivery.messageId,
            error: delivery.error,
        };
        communicationHistory.push(communication);
        await prisma_1.default.consultationrequest.update({
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
    }
    catch (error) {
        logger_1.logger.error('Failed to send consultation reply', {
            error: error instanceof Error ? error.message : String(error),
        });
        return res.status(500).json({ error: 'Failed to send consultation email reply.' });
    }
});
// ----------------------------------------------------
// ADMIN ROUTE: PUT /api/v1/consultations/:id/status
// Status transition with audit trail & optional cancellation reason
// ----------------------------------------------------
router.put('/:id/status', auth_1.authenticate, async (req, res) => {
    try {
        const { status, note, cancellationReason, appointmentDate, appointmentTime, meetingType, meetingLocation, assignedAdminName } = req.body;
        const adminUser = req.adminUser;
        const consultationId = getRouteParam(req.params.id);
        const existing = await prisma_1.default.consultationrequest.findUnique({
            where: { id: consultationId },
        });
        if (!existing) {
            return res.status(404).json({ error: 'Consultation request not found' });
        }
        let history = [];
        try {
            if (existing.statusHistory)
                history = JSON.parse(existing.statusHistory);
        }
        catch {
            history = [];
        }
        const changedByName = adminUser ? `${adminUser.name || adminUser.email}` : 'Administrator';
        let actionTitle = `Status updated to ${status.replace('_', ' ').toUpperCase()}`;
        if (status === 'contacted')
            actionTitle = 'Customer Contacted';
        if (status === 'scheduled')
            actionTitle = 'Consultation Scheduled';
        if (status === 'in_progress')
            actionTitle = 'Consultation In Progress';
        if (status === 'completed')
            actionTitle = 'Consultation Completed';
        if (status === 'cancelled')
            actionTitle = 'Consultation Cancelled';
        if (status === 'rejected')
            actionTitle = 'Consultation Rejected';
        history.unshift({
            id: (0, uuid_1.v4)(),
            status,
            title: actionTitle,
            changedBy: changedByName,
            timestamp: new Date().toISOString(),
            note: note || cancellationReason || `Status transition from ${existing.status} to ${status}`,
        });
        const updateData = {
            status,
            statusHistory: JSON.stringify(history),
        };
        if (cancellationReason !== undefined)
            updateData.cancellationReason = cancellationReason;
        if (appointmentDate !== undefined)
            updateData.appointmentDate = appointmentDate;
        if (appointmentTime !== undefined)
            updateData.appointmentTime = appointmentTime;
        if (meetingType !== undefined)
            updateData.meetingType = meetingType;
        if (meetingLocation !== undefined)
            updateData.meetingLocation = meetingLocation;
        if (assignedAdminName !== undefined)
            updateData.assignedAdminName = assignedAdminName;
        const updated = await prisma_1.default.consultationrequest.update({
            where: { id: consultationId },
            data: updateData,
        });
        return res.json({
            ...updated,
            statusHistory: history,
            parsedNotes: parseNotes(updated.notes),
        });
    }
    catch (err) {
        console.error('Failed to update consultation status:', err);
        return res.status(500).json({ error: 'Failed to update consultation status' });
    }
});
// ----------------------------------------------------
// ADMIN ROUTE: PUT /api/v1/consultations/:id/schedule
// Schedule or update consultation appointment details
// ----------------------------------------------------
router.put('/:id/schedule', auth_1.authenticate, async (req, res) => {
    try {
        const { appointmentDate, appointmentTime, meetingType, meetingLocation, assignedAdminName } = req.body;
        const adminUser = req.adminUser;
        const consultationId = getRouteParam(req.params.id);
        const existing = await prisma_1.default.consultationrequest.findUnique({
            where: { id: consultationId },
        });
        if (!existing) {
            return res.status(404).json({ error: 'Consultation request not found' });
        }
        let history = [];
        try {
            if (existing.statusHistory)
                history = JSON.parse(existing.statusHistory);
        }
        catch {
            history = [];
        }
        const changedByName = adminUser ? `${adminUser.name || adminUser.email}` : 'Administrator';
        history.unshift({
            id: (0, uuid_1.v4)(),
            status: 'scheduled',
            title: 'Appointment Scheduled',
            changedBy: changedByName,
            timestamp: new Date().toISOString(),
            note: `Appointment confirmed for ${appointmentDate} at ${appointmentTime} via ${meetingType}. Assigned to ${assignedAdminName || 'Staff'}.`,
        });
        const updated = await prisma_1.default.consultationrequest.update({
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
        return res.json({
            ...updated,
            statusHistory: history,
            parsedNotes: parseNotes(updated.notes),
        });
    }
    catch (err) {
        console.error('Failed to schedule appointment:', err);
        return res.status(500).json({ error: 'Failed to schedule appointment' });
    }
});
// ----------------------------------------------------
// ADMIN ROUTE: POST /api/v1/consultations/:id/notes
// Add, Edit, or Delete Individual Note
// ----------------------------------------------------
router.post('/:id/notes', auth_1.authenticate, async (req, res) => {
    try {
        const { note } = req.body;
        if (!note || !note.trim()) {
            return res.status(400).json({ error: 'Note text cannot be empty' });
        }
        const adminUser = req.adminUser;
        const consultationId = getRouteParam(req.params.id);
        const existing = await prisma_1.default.consultationrequest.findUnique({
            where: { id: consultationId },
        });
        if (!existing) {
            return res.status(404).json({ error: 'Consultation not found' });
        }
        const author = adminUser ? `${adminUser.name || adminUser.email}` : 'Administrator';
        const notesList = parseNotes(existing.notes);
        const newNoteObj = {
            id: (0, uuid_1.v4)(),
            text: note.trim(),
            author,
            timestamp: new Date().toISOString(),
        };
        notesList.unshift(newNoteObj);
        // Also record in activity timeline
        let history = [];
        try {
            if (existing.statusHistory)
                history = JSON.parse(existing.statusHistory);
        }
        catch {
            history = [];
        }
        history.unshift({
            id: (0, uuid_1.v4)(),
            status: existing.status,
            title: 'Internal Note Added',
            changedBy: author,
            timestamp: new Date().toISOString(),
            note: note.trim().slice(0, 100) + (note.trim().length > 100 ? '...' : ''),
        });
        const updated = await prisma_1.default.consultationrequest.update({
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
    }
    catch (err) {
        console.error('Failed to add note to consultation:', err);
        return res.status(500).json({ error: 'Failed to save note' });
    }
});
// Delete note by Note ID
router.delete('/:id/notes/:noteId', auth_1.authenticate, async (req, res) => {
    try {
        const { id, noteId } = req.params;
        const consultationId = getRouteParam(id);
        const noteIdStr = getRouteParam(noteId);
        const existing = await prisma_1.default.consultationrequest.findUnique({
            where: { id: consultationId },
        });
        if (!existing) {
            return res.status(404).json({ error: 'Consultation not found' });
        }
        const currentNotes = parseNotes(existing.notes);
        const filteredNotes = currentNotes.filter((n) => n.id !== noteIdStr);
        const updated = await prisma_1.default.consultationrequest.update({
            where: { id: consultationId },
            data: {
                notes: JSON.stringify(filteredNotes),
            },
        });
        return res.json({
            ...updated,
            parsedNotes: filteredNotes,
        });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to delete note' });
    }
});
// ----------------------------------------------------
// ADMIN ROUTE: PUT /api/v1/consultations/:id
// Update customer profile
// ----------------------------------------------------
router.put('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const { fullName, email, phone, companyName, category, preferredContactMethod, message } = req.body;
        const consultationId = getRouteParam(req.params.id);
        const updated = await prisma_1.default.consultationrequest.update({
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
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to update consultation information' });
    }
});
// ----------------------------------------------------
// ADMIN ROUTE: DELETE /api/v1/consultations/:id
// Permanently remove consultation request
// ----------------------------------------------------
router.delete('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const consultationId = getRouteParam(req.params.id);
        await prisma_1.default.consultationrequest.delete({
            where: { id: consultationId },
        });
        return res.json({ success: true, message: 'Consultation deleted successfully' });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to delete consultation record' });
    }
});
exports.default = router;
