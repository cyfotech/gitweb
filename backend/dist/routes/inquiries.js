"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth_1 = require("../middleware/auth");
const uuid_1 = require("uuid");
const emailService_1 = require("../services/emailService");
const emailTemplateService_1 = require("../services/emailTemplateService");
const mailer_1 = require("../utils/mailer");
const router = (0, express_1.Router)();
const publicInquiryLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many enquiries. Please try again later.' },
});
const inquiryReplyLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
});
function getRouteParam(value) {
    return Array.isArray(value) ? value[0] : value;
}
function generateInquiryNumber() {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = crypto_1.default.randomBytes(3).toString('hex').toUpperCase();
    return `INQ-${ts}-${rand}`;
}
// ----------------------------------------------------
// PUBLIC ROUTE: POST /api/v1/inquiries
// Public Contact Us / Partner Inquiry submission
// ----------------------------------------------------
router.post('/', publicInquiryLimiter, async (req, res) => {
    try {
        const data = req.body && typeof req.body === 'object' ? req.body : {};
        const text = (value) => typeof value === 'string' ? value.trim() : '';
        const name = text(data.name);
        const email = text(data.email).toLowerCase();
        const phone = text(data.phone);
        const organization = text(data.organization);
        const inquiryType = text(data.inquiryType) || 'General Inquiry';
        const subject = text(data.subject) || `Inquiry from ${name}`;
        const message = text(data.message);
        const sourcePage = text(data.sourcePage) || '/contact';
        if (!name || name.length > 120) {
            return res.status(400).json({ error: 'Full name is required and must be 120 characters or fewer.' });
        }
        if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) || email.length > 254) {
            return res.status(400).json({ error: 'A valid email address is required.' });
        }
        if (!message || message.length > 10000) {
            return res.status(400).json({ error: 'Message is required and must be 10,000 characters or fewer.' });
        }
        if (phone.length > 32 || organization.length > 191 || subject.length > 191 ||
            inquiryType.length > 100 || sourcePage.length > 500 || /[\r\n]/.test(subject)) {
            return res.status(400).json({ error: 'One or more enquiry fields are invalid or too long.' });
        }
        const duplicate = await prisma_1.default.contactinquiry.findFirst({
            where: {
                email,
                message,
                sourcePage,
                createdAt: { gte: new Date(Date.now() - 60 * 1000) },
            },
            orderBy: { createdAt: 'desc' },
        });
        if (duplicate) {
            return res.status(409).json({
                error: `This enquiry was already received. Reference: ${duplicate.inquiryNumber}. Please do not submit it again.`,
            });
        }
        // Generate unique inquiry number
        let inquiryNumber = generateInquiryNumber();
        let collisionCheck = await prisma_1.default.contactinquiry.findUnique({ where: { inquiryNumber } });
        while (collisionCheck) {
            inquiryNumber = generateInquiryNumber();
            collisionCheck = await prisma_1.default.contactinquiry.findUnique({ where: { inquiryNumber } });
        }
        const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'unknown';
        const userAgent = req.headers['user-agent'] || 'unknown';
        const nowIso = new Date().toISOString();
        const initialStatusHistory = JSON.stringify([
            {
                status: 'new',
                changedBy: 'System (Public Form)',
                changedAt: nowIso,
                note: 'Inquiry received through public website portal',
            },
        ]);
        const initialActivityLogs = JSON.stringify([
            {
                id: (0, uuid_1.v4)(),
                action: 'CREATED',
                description: `Inquiry submitted via ${sourcePage}`,
                performedBy: 'System',
                timestamp: nowIso,
            },
        ]);
        const inquiry = await prisma_1.default.contactinquiry.create({
            data: {
                id: (0, uuid_1.v4)(),
                inquiryNumber,
                name,
                email,
                phone: phone || null,
                organization: organization || null,
                inquiryType,
                subject,
                message,
                status: 'new',
                sourcePage,
                ipAddress: typeof ipAddress === 'string' ? ipAddress.slice(0, 100) : 'unknown',
                userAgent: typeof userAgent === 'string' ? userAgent.slice(0, 255) : 'unknown',
                isRead: false,
                isArchived: false,
                statusHistory: initialStatusHistory,
                activityLogs: initialActivityLogs,
            },
        });
        const formType = /callback/i.test(sourcePage)
            ? 'callback'
            : /blog/i.test(sourcePage)
                ? 'blog'
                : /\/services?(\/|$)|service_enquiry/i.test(sourcePage + ' ' + inquiryType)
                    ? 'services_enquiry'
                    : /^(other|other_enquiries)$/i.test(inquiryType)
                        ? 'other_enquiries'
                        : 'contact';
        const formName = {
            callback: 'Callback Request',
            blog: 'Blog Enquiry',
            services_enquiry: 'Service Enquiry',
            other_enquiries: 'Other Enquiry',
            contact: 'Contact Us',
        }[formType];
        let emailResult;
        try {
            emailResult = await (0, mailer_1.sendFormSubmissionEmails)({
                formName,
                formType,
                referenceNumber: inquiryNumber,
                customerName: name,
                customerEmail: email,
                fields: [
                    { label: 'Full Name', value: name },
                    { label: 'Email', value: email },
                    { label: 'Phone', value: phone || 'Not provided' },
                    { label: 'Organization', value: organization || 'Not provided' },
                    { label: 'Enquiry Type', value: inquiryType },
                    { label: 'Subject', value: subject },
                ],
                message,
                sourcePage,
                submittedAt: inquiry.createdAt,
            });
        }
        catch (error) {
            console.error('Contact enquiry saved but email processing failed:', error);
            emailResult = {
                customerSent: false,
                ownerSent: false,
                customerError: 'Email processing failed before SMTP delivery.',
                ownerError: 'Email processing failed before SMTP delivery.',
            };
        }
        const communicationHistory = [
            {
                id: (0, uuid_1.v4)(),
                type: 'EMAIL',
                direction: 'OUTBOUND',
                purpose: 'customer_confirmation',
                subject: `We received your ${formName.toLowerCase()}`,
                body: `Confirmation email for ${inquiryNumber}`,
                sender: 'STE Smart Tax Experts',
                recipient: email,
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
                subject: `New ${formName}: ${name}`,
                body: `Owner notification for ${inquiryNumber}`,
                sender: 'STE Smart Tax Experts',
                recipient: emailResult.ownerEmail || '',
                timestamp: new Date().toISOString(),
                deliveryStatus: emailResult.ownerSent ? 'accepted_by_smtp' : 'not_accepted',
                messageId: emailResult.ownerMessageId,
                error: emailResult.ownerError,
            },
        ];
        try {
            await prisma_1.default.contactinquiry.update({
                where: { id: inquiry.id },
                data: { communicationHistory: JSON.stringify(communicationHistory) },
            });
        }
        catch (updateError) {
            console.warn('Failed to update inquiry communication history', updateError);
            // Continue - inquiry is saved, just without communication history
        }
        return res.status(201).json({
            success: true,
            submissionReceived: true,
            inquiryId: inquiry.id,
            inquiryNumber: inquiry.inquiryNumber,
            emailDelivery: {
                customerConfirmation: emailResult.customerSent ? 'accepted_by_smtp' : 'not_accepted',
                ownerNotification: emailResult.ownerSent ? 'accepted_by_smtp' : 'not_accepted',
            },
            emailDeliveryErrors: {
                customerConfirmation: emailResult.customerError,
                ownerNotification: emailResult.ownerError,
            },
            message: emailResult.customerSent && emailResult.ownerSent
                ? 'Your inquiry has been successfully submitted. We will contact you soon.'
                : 'Your inquiry has been saved. We will contact you soon.',
        });
    }
    catch (err) {
        console.error('Submit inquiry error:', err);
        // Return proper error response with available context
        res.status(500).json({
            error: 'Failed to submit inquiry. Please try again later.',
            submissionReceived: false,
            inquiryId: undefined,
        });
    }
});
// ----------------------------------------------------
// PROTECTED: GET /api/v1/inquiries/admins
// Get active admins for assignment
// ----------------------------------------------------
router.get('/admins', auth_1.authenticate, async (_req, res) => {
    try {
        const admins = await prisma_1.default.adminuser.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                adminrole: { select: { name: true } },
            },
            orderBy: { name: 'asc' },
        });
        res.json(admins.map(a => ({
            id: a.id,
            name: a.name,
            email: a.email,
            role: a.adminrole?.name || 'ADMIN',
        })));
    }
    catch (err) {
        console.error('Fetch admins error:', err);
        res.status(500).json({ error: 'Failed to fetch admin users' });
    }
});
// ----------------------------------------------------
// PROTECTED: GET /api/v1/inquiries/analytics
// Live statistics dashboard
// ----------------------------------------------------
router.get('/analytics', auth_1.authenticate, async (_req, res) => {
    try {
        const [total, newCount, inProgressCount, waitingCount, respondedCount, closedCount, spamCount, unassignedCount, archivedCount,] = await Promise.all([
            prisma_1.default.contactinquiry.count({ where: { isArchived: false } }),
            prisma_1.default.contactinquiry.count({ where: { status: 'new', isArchived: false } }),
            prisma_1.default.contactinquiry.count({ where: { status: 'in_progress', isArchived: false } }),
            prisma_1.default.contactinquiry.count({ where: { status: 'waiting_response', isArchived: false } }),
            prisma_1.default.contactinquiry.count({ where: { status: 'responded', isArchived: false } }),
            prisma_1.default.contactinquiry.count({ where: { status: 'closed', isArchived: false } }),
            prisma_1.default.contactinquiry.count({ where: { status: 'spam', isArchived: false } }),
            prisma_1.default.contactinquiry.count({ where: { assignedAdminId: null, isArchived: false } }),
            prisma_1.default.contactinquiry.count({ where: { isArchived: true } }),
        ]);
        // Today & This Week
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const [todayCount, weekCount] = await Promise.all([
            prisma_1.default.contactinquiry.count({ where: { createdAt: { gte: startOfToday } } }),
            prisma_1.default.contactinquiry.count({ where: { createdAt: { gte: startOfWeek } } }),
        ]);
        // Calculate resolution rate
        const nonSpamTotal = total - spamCount;
        const resolutionRate = nonSpamTotal > 0 ? Math.round((closedCount / nonSpamTotal) * 100) : 0;
        res.json({
            total,
            new: newCount,
            inProgress: inProgressCount,
            waitingResponse: waitingCount,
            responded: respondedCount,
            closed: closedCount,
            spam: spamCount,
            unassigned: unassignedCount,
            archived: archivedCount,
            todayCount,
            weekCount,
            resolutionRate,
        });
    }
    catch (err) {
        console.error('Inquiries analytics error:', err);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});
// ----------------------------------------------------
// PROTECTED: GET /api/v1/inquiries
// Paginated, filtered, searchable inquiry list
// ----------------------------------------------------
router.get('/', auth_1.authenticate, async (req, res) => {
    try {
        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '50', 10);
        const skip = (page - 1) * limit;
        const { status, search, adminId, unassigned, timeframe, isArchived, sort, } = req.query;
        const where = {};
        // Archive filter
        if (isArchived === 'true') {
            where.isArchived = true;
        }
        else if (isArchived === 'false' || !isArchived) {
            where.isArchived = false;
        }
        // Status filter
        if (status && typeof status === 'string' && status !== 'all') {
            where.status = status;
        }
        // Admin assignment
        if (unassigned === 'true') {
            where.assignedAdminId = null;
        }
        else if (adminId && typeof adminId === 'string' && adminId !== 'all') {
            where.assignedAdminId = adminId;
        }
        // Timeframe
        if (timeframe && typeof timeframe === 'string') {
            const now = new Date();
            if (timeframe === 'today') {
                where.createdAt = { gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) };
            }
            else if (timeframe === 'yesterday') {
                const startYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
                const endYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                where.createdAt = { gte: startYesterday, lt: endYesterday };
            }
            else if (timeframe === 'last_7_days') {
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(now.getDate() - 7);
                where.createdAt = { gte: sevenDaysAgo };
            }
            else if (timeframe === 'last_30_days') {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(now.getDate() - 30);
                where.createdAt = { gte: thirtyDaysAgo };
            }
        }
        // Multi-field search
        if (search && typeof search === 'string' && search.trim()) {
            const q = search.trim();
            where.OR = [
                { inquiryNumber: { contains: q } },
                { name: { contains: q } },
                { email: { contains: q } },
                { phone: { contains: q } },
                { organization: { contains: q } },
                { subject: { contains: q } },
                { message: { contains: q } },
            ];
        }
        // Sorting
        let orderBy = { createdAt: 'desc' };
        if (sort === 'oldest') {
            orderBy = { createdAt: 'asc' };
        }
        else if (sort === 'updated') {
            orderBy = { updatedAt: 'desc' };
        }
        else if (sort === 'name_asc') {
            orderBy = { name: 'asc' };
        }
        const [inquiries, total] = await Promise.all([
            prisma_1.default.contactinquiry.findMany({
                where,
                include: {
                    inquirynote: {
                        orderBy: { createdAt: 'desc' },
                        include: { adminuser: { select: { id: true, name: true, email: true } } },
                    },
                },
                orderBy,
                skip,
                take: limit,
            }),
            prisma_1.default.contactinquiry.count({ where }),
        ]);
        // Parse JSON fields
        const parsed = inquiries.map(inq => {
            let parsedStatusHistory = [];
            let parsedActivityLogs = [];
            let parsedCommHistory = [];
            try {
                if (inq.statusHistory)
                    parsedStatusHistory = JSON.parse(inq.statusHistory);
            }
            catch (e) { }
            try {
                if (inq.activityLogs)
                    parsedActivityLogs = JSON.parse(inq.activityLogs);
            }
            catch (e) { }
            try {
                if (inq.communicationHistory)
                    parsedCommHistory = JSON.parse(inq.communicationHistory);
            }
            catch (e) { }
            return {
                ...inq,
                statusHistory: parsedStatusHistory,
                activityLogs: parsedActivityLogs,
                communicationHistory: parsedCommHistory,
                notes: inq.inquirynote.map(n => ({
                    id: n.id,
                    note: n.note,
                    authorName: n.authorName || n.adminuser?.name || 'Admin',
                    createdAt: n.createdAt,
                    createdById: n.createdById,
                })),
            };
        });
        res.json({
            inquiries: parsed,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    }
    catch (err) {
        console.error('Fetch inquiries error:', err);
        res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
});
// ----------------------------------------------------
// PROTECTED: GET /api/v1/inquiries/:id
// Single inquiry details
// ----------------------------------------------------
router.get('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const inquiryId = getRouteParam(req.params.id);
        const inq = await prisma_1.default.contactinquiry.findUnique({
            where: { id: inquiryId },
            include: {
                inquirynote: {
                    orderBy: { createdAt: 'desc' },
                    include: { adminuser: { select: { id: true, name: true, email: true } } },
                },
            },
        });
        if (!inq) {
            return res.status(400).json({ error: 'Inquiry not found' });
        }
        // Auto mark as read when opened
        if (!inq.isRead) {
            await prisma_1.default.contactinquiry.update({
                where: { id: inq.id },
                data: { isRead: true },
            });
            inq.isRead = true;
        }
        let parsedStatusHistory = [];
        let parsedActivityLogs = [];
        let parsedCommHistory = [];
        try {
            if (inq.statusHistory)
                parsedStatusHistory = JSON.parse(inq.statusHistory);
        }
        catch (e) { }
        try {
            if (inq.activityLogs)
                parsedActivityLogs = JSON.parse(inq.activityLogs);
        }
        catch (e) { }
        try {
            if (inq.communicationHistory)
                parsedCommHistory = JSON.parse(inq.communicationHistory);
        }
        catch (e) { }
        const notes = inq.inquirynote?.map((n) => ({
            id: n.id,
            note: n.note,
            authorName: n.authorName || n.adminuser?.name || 'Admin',
            createdAt: n.createdAt,
            createdById: n.createdById,
        })) || [];
        res.json({
            ...inq,
            statusHistory: parsedStatusHistory,
            activityLogs: parsedActivityLogs,
            communicationHistory: parsedCommHistory,
            notes,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch inquiry details' });
    }
});
// ----------------------------------------------------
// PROTECTED: PUT /api/v1/inquiries/:id/status
// Update status with audit history
// ----------------------------------------------------
router.put('/:id/status', auth_1.authenticate, async (req, res) => {
    try {
        const { status, note, assignedToId } = req.body;
        const adminUser = req.adminUser;
        const adminName = adminUser?.name || 'Administrator';
        const validStatuses = ['new', 'in_progress', 'waiting_response', 'responded', 'closed', 'spam'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: `Invalid status: ${status}` });
        }
        const inquiryId = getRouteParam(req.params.id);
        const current = await prisma_1.default.contactinquiry.findUnique({
            where: { id: inquiryId },
        });
        if (!current) {
            return res.status(404).json({ error: 'Inquiry not found' });
        }
        const nowIso = new Date().toISOString();
        // Parse existing history
        let statusHistoryList = [];
        try {
            if (current.statusHistory)
                statusHistoryList = JSON.parse(current.statusHistory);
        }
        catch (e) { }
        statusHistoryList.push({
            status,
            prevStatus: current.status,
            changedBy: adminName,
            changedAt: nowIso,
            note: note || `Status changed from ${current.status} to ${status}`,
        });
        // Parse activity logs
        let activityLogsList = [];
        try {
            if (current.activityLogs)
                activityLogsList = JSON.parse(current.activityLogs);
        }
        catch (e) { }
        activityLogsList.push({
            id: (0, uuid_1.v4)(),
            action: 'STATUS_CHANGE',
            description: `Status changed to ${status.toUpperCase().replace('_', ' ')}${note ? ` (${note})` : ''}`,
            performedBy: adminName,
            timestamp: nowIso,
        });
        const updateData = {
            status,
            statusHistory: JSON.stringify(statusHistoryList),
            activityLogs: JSON.stringify(activityLogsList),
        };
        if (assignedToId !== undefined) {
            updateData.assignedAdminId = assignedToId || null;
            if (assignedToId) {
                const assignedAdmin = await prisma_1.default.adminuser.findUnique({ where: { id: assignedToId } });
                updateData.assignedAdminName = assignedAdmin?.name || null;
            }
            else {
                updateData.assignedAdminName = null;
            }
        }
        if (status === 'closed' && !current.resolvedAt) {
            updateData.resolvedAt = new Date();
        }
        else if (status !== 'closed' && current.resolvedAt) {
            updateData.resolvedAt = null;
        }
        if (status === 'responded' && !current.firstRespondedAt) {
            updateData.firstRespondedAt = new Date();
        }
        const updated = await prisma_1.default.contactinquiry.update({
            where: { id: inquiryId },
            data: updateData,
            include: {
                inquirynote: {
                    orderBy: { createdAt: 'desc' },
                    include: { adminuser: { select: { id: true, name: true, email: true } } },
                },
            },
        });
        const notes = updated.inquirynote?.map((n) => ({
            id: n.id,
            note: n.note,
            authorName: n.authorName || n.adminuser?.name || 'Admin',
            createdAt: n.createdAt,
            createdById: n.createdById,
        })) || [];
        res.json({
            ...updated,
            statusHistory: statusHistoryList,
            activityLogs: activityLogsList,
            notes,
        });
    }
    catch (err) {
        console.error('Update status error:', err);
        res.status(500).json({ error: 'Failed to update status' });
    }
});
// ----------------------------------------------------
// PROTECTED: PUT /api/v1/inquiries/:id/assign
// Assign to admin user
// ----------------------------------------------------
router.put('/:id/assign', auth_1.authenticate, async (req, res) => {
    try {
        const { adminId } = req.body;
        const callerName = req.adminUser?.name || 'Administrator';
        const nowIso = new Date().toISOString();
        let assignedAdminName = null;
        if (adminId) {
            const targetAdmin = await prisma_1.default.adminuser.findUnique({ where: { id: adminId } });
            if (!targetAdmin) {
                return res.status(404).json({ error: 'Selected admin user does not exist.' });
            }
            assignedAdminName = targetAdmin.name;
        }
        const inquiryId = getRouteParam(req.params.id);
        const current = await prisma_1.default.contactinquiry.findUnique({ where: { id: inquiryId } });
        if (!current) {
            return res.status(404).json({ error: 'Inquiry not found' });
        }
        let activityLogsList = [];
        try {
            if (current.activityLogs)
                activityLogsList = JSON.parse(current.activityLogs);
        }
        catch (e) { }
        activityLogsList.push({
            id: (0, uuid_1.v4)(),
            action: 'ASSIGNMENT_CHANGE',
            description: assignedAdminName
                ? `Assigned to ${assignedAdminName}`
                : 'Inquiry unassigned',
            performedBy: callerName,
            timestamp: nowIso,
        });
        const updated = await prisma_1.default.contactinquiry.update({
            where: { id: inquiryId },
            data: {
                assignedAdminId: adminId || null,
                assignedAdminName,
                activityLogs: JSON.stringify(activityLogsList),
            },
            include: {
                inquirynote: {
                    orderBy: { createdAt: 'desc' },
                    include: { adminuser: { select: { id: true, name: true, email: true } } },
                },
            },
        });
        const notes = updated.inquirynote?.map((n) => ({
            id: n.id,
            note: n.note,
            authorName: n.authorName || n.adminuser?.name || 'Admin',
            createdAt: n.createdAt,
            createdById: n.createdById,
        })) || [];
        res.json({
            ...updated,
            activityLogs: activityLogsList,
            notes,
        });
    }
    catch (err) {
        console.error('Assign inquiry error:', err);
        res.status(500).json({ error: 'Failed to assign inquiry' });
    }
});
// ----------------------------------------------------
// PROTECTED: POST /api/v1/inquiries/:id/notes
// Add an internal note
// ----------------------------------------------------
router.post('/:id/notes', auth_1.authenticate, async (req, res) => {
    try {
        const { note } = req.body;
        if (!note || !note.trim()) {
            return res.status(400).json({ error: 'Note content cannot be empty.' });
        }
        const adminName = req.adminUser?.name || 'Administrator';
        const inquiryId = getRouteParam(req.params.id);
        const current = await prisma_1.default.contactinquiry.findUnique({ where: { id: inquiryId } });
        if (!current) {
            return res.status(404).json({ error: 'Inquiry not found' });
        }
        const createdNote = await prisma_1.default.inquirynote.create({
            data: {
                id: (0, uuid_1.v4)(),
                inquiryId: inquiryId,
                note: note.trim(),
                createdById: req.admin.adminId,
                authorName: adminName,
            },
            include: {
                adminuser: { select: { id: true, name: true, email: true } },
            },
        });
        // Append to activity log
        const nowIso = new Date().toISOString();
        let activityLogsList = [];
        try {
            if (current.activityLogs)
                activityLogsList = JSON.parse(current.activityLogs);
        }
        catch (e) { }
        activityLogsList.push({
            id: (0, uuid_1.v4)(),
            action: 'NOTE_ADDED',
            description: `Note added: "${note.trim().slice(0, 50)}${note.trim().length > 50 ? '...' : ''}"`,
            performedBy: adminName,
            timestamp: nowIso,
        });
        await prisma_1.default.contactinquiry.update({
            where: { id: inquiryId },
            data: { activityLogs: JSON.stringify(activityLogsList) },
        });
        res.status(201).json({
            id: createdNote.id,
            note: createdNote.note,
            authorName: createdNote.authorName || createdNote.adminuser?.name || 'Admin',
            createdAt: createdNote.createdAt,
            createdById: createdNote.createdById,
        });
    }
    catch (err) {
        console.error('Add note error:', err);
        res.status(500).json({ error: 'Failed to add note' });
    }
});
// ----------------------------------------------------
// PROTECTED: DELETE /api/v1/inquiries/:id/notes/:noteId
// Delete internal note
// ----------------------------------------------------
router.delete('/:id/notes/:noteId', auth_1.authenticate, async (req, res) => {
    try {
        const { id, noteId } = req.params;
        const inquiryId = getRouteParam(id);
        const noteIdStr = getRouteParam(noteId);
        const adminName = req.adminUser?.name || 'Administrator';
        const note = await prisma_1.default.inquirynote.findFirst({
            where: { id: noteIdStr, inquiryId: inquiryId },
        });
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        await prisma_1.default.inquirynote.delete({ where: { id: noteIdStr } });
        // Log deletion
        const current = await prisma_1.default.contactinquiry.findUnique({ where: { id: inquiryId } });
        if (current) {
            let activityLogsList = [];
            try {
                if (current.activityLogs)
                    activityLogsList = JSON.parse(current.activityLogs);
            }
            catch (e) { }
            activityLogsList.push({
                id: (0, uuid_1.v4)(),
                action: 'NOTE_DELETED',
                description: `Note deleted by ${adminName}`,
                performedBy: adminName,
                timestamp: new Date().toISOString(),
            });
            await prisma_1.default.contactinquiry.update({
                where: { id: inquiryId },
                data: { activityLogs: JSON.stringify(activityLogsList) },
            });
        }
        res.json({ success: true, message: 'Note deleted successfully.' });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
});
// ----------------------------------------------------
// PROTECTED: POST /api/v1/inquiries/:id/reply
// Send customer email and log communication
// ----------------------------------------------------
router.post('/:id/reply', auth_1.authenticate, inquiryReplyLimiter, async (req, res) => {
    try {
        const { to, subject, message, updateStatusToResponded = true } = req.body;
        const recipient = typeof to === 'string' ? to.trim().toLowerCase() : '';
        if (!(0, emailService_1.isValidEmail)(recipient)) {
            return res.status(400).json({ error: 'A valid recipient email address is required.' });
        }
        if (typeof subject !== 'string' || !subject.trim() || subject.length > 200 || /[\r\n]/.test(subject)) {
            return res.status(400).json({ error: 'Email subject is required.' });
        }
        if (typeof message !== 'string' || !message.trim() || message.length > 20000) {
            return res.status(400).json({ error: 'Email message body is required.' });
        }
        const inquiryId = getRouteParam(req.params.id);
        const current = await prisma_1.default.contactinquiry.findUnique({ where: { id: inquiryId } });
        if (!current) {
            return res.status(404).json({ error: 'Inquiry not found' });
        }
        const adminName = req.adminUser?.name || 'STE Smart Tax Experts Team';
        const nowIso = new Date().toISOString();
        // Send email to customer
        const brand = (0, emailTemplateService_1.getBrandContext)();
        const delivery = await (0, emailService_1.sendEmail)({
            to: recipient,
            subject: subject.trim(),
            replyTo: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
            html: (0, emailTemplateService_1.buildAdminReplyEmail)({
                message: message.trim(),
                referenceNumber: current.inquiryNumber || current.id,
            }, brand),
        });
        // Append to communication history
        let commList = [];
        try {
            if (current.communicationHistory)
                commList = JSON.parse(current.communicationHistory);
        }
        catch (e) { }
        commList.push({
            id: (0, uuid_1.v4)(),
            type: 'EMAIL',
            direction: 'OUTBOUND',
            subject: subject.trim(),
            body: message.trim(),
            sender: adminName,
            recipient,
            timestamp: nowIso,
            deliveryStatus: delivery.success ? 'accepted_by_smtp' : 'not_accepted',
            messageId: delivery.messageId,
            error: delivery.error,
        });
        if (!delivery.success) {
            await prisma_1.default.contactinquiry.update({
                where: { id: inquiryId },
                data: { communicationHistory: JSON.stringify(commList) },
            });
            return res.status(502).json({
                error: delivery.error || 'SMTP did not accept the reply.',
                communicationHistory: commList,
            });
        }
        // Append to activity log
        let activityLogsList = [];
        try {
            if (current.activityLogs)
                activityLogsList = JSON.parse(current.activityLogs);
        }
        catch (e) { }
        activityLogsList.push({
            id: (0, uuid_1.v4)(),
            action: 'EMAIL_SENT',
            description: `Replied via email: "${subject.trim()}"`,
            performedBy: adminName,
            timestamp: nowIso,
        });
        const updateData = {
            communicationHistory: JSON.stringify(commList),
            activityLogs: JSON.stringify(activityLogsList),
        };
        if (updateStatusToResponded && current.status !== 'closed') {
            updateData.status = 'responded';
            if (!current.firstRespondedAt) {
                updateData.firstRespondedAt = new Date();
            }
            let statusHistoryList = [];
            try {
                if (current.statusHistory)
                    statusHistoryList = JSON.parse(current.statusHistory);
            }
            catch (e) { }
            statusHistoryList.push({
                status: 'responded',
                prevStatus: current.status,
                changedBy: adminName,
                changedAt: nowIso,
                note: `Customer reply sent via email`,
            });
            updateData.statusHistory = JSON.stringify(statusHistoryList);
        }
        const updated = await prisma_1.default.contactinquiry.update({
            where: { id: inquiryId },
            data: updateData,
            include: {
                inquirynote: {
                    orderBy: { createdAt: 'desc' },
                    include: { adminuser: { select: { id: true, name: true, email: true } } },
                },
            },
        });
        res.json({
            success: true,
            message: 'Reply sent successfully to customer.',
            communicationHistory: commList,
            inquiry: { ...updated, communicationHistory: commList },
        });
    }
    catch (err) {
        console.error('Reply inquiry error:', err);
        res.status(500).json({ error: 'Failed to send reply email: ' + err.message });
    }
});
// ----------------------------------------------------
// PROTECTED: PUT /api/v1/inquiries/:id/archive
// Toggle archive / soft-delete
// ----------------------------------------------------
router.put('/:id/archive', auth_1.authenticate, async (req, res) => {
    try {
        const { isArchived } = req.body;
        const adminName = req.adminUser?.name || 'Administrator';
        const nowIso = new Date().toISOString();
        const inquiryId = getRouteParam(req.params.id);
        const current = await prisma_1.default.contactinquiry.findUnique({ where: { id: inquiryId } });
        if (!current) {
            return res.status(404).json({ error: 'Inquiry not found' });
        }
        let activityLogsList = [];
        try {
            if (current.activityLogs)
                activityLogsList = JSON.parse(current.activityLogs);
        }
        catch (e) { }
        activityLogsList.push({
            id: (0, uuid_1.v4)(),
            action: isArchived ? 'ARCHIVED' : 'RESTORED',
            description: isArchived ? 'Inquiry archived' : 'Inquiry restored from archive',
            performedBy: adminName,
            timestamp: nowIso,
        });
        const updated = await prisma_1.default.contactinquiry.update({
            where: { id: inquiryId },
            data: {
                isArchived: Boolean(isArchived),
                activityLogs: JSON.stringify(activityLogsList),
            },
        });
        res.json({ success: true, inquiry: updated });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to update archive status' });
    }
});
// ----------------------------------------------------
// PROTECTED: PUT /api/v1/inquiries/:id/read
// Mark inquiry as read/unread
// ----------------------------------------------------
router.put('/:id/read', auth_1.authenticate, async (req, res) => {
    try {
        const { isRead = true } = req.body;
        const inquiryId = getRouteParam(req.params.id);
        const updated = await prisma_1.default.contactinquiry.update({
            where: { id: inquiryId },
            data: { isRead: Boolean(isRead) },
        });
        res.json({ success: true, inquiry: updated });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to update read status' });
    }
});
// ----------------------------------------------------
// PROTECTED: DELETE /api/v1/inquiries/:id
// Permanent delete or archive
// ----------------------------------------------------
router.delete('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const { permanent } = req.query;
        const inquiryId = getRouteParam(req.params.id);
        if (permanent === 'true') {
            // First delete dependent notes
            await prisma_1.default.inquirynote.deleteMany({ where: { inquiryId: inquiryId } });
            await prisma_1.default.contactinquiry.delete({ where: { id: inquiryId } });
            return res.json({ success: true, message: 'Inquiry permanently deleted.' });
        }
        // Soft delete (archive)
        const adminName = req.adminUser?.name || 'Administrator';
        const current = await prisma_1.default.contactinquiry.findUnique({ where: { id: inquiryId } });
        if (!current) {
            return res.status(404).json({ error: 'Inquiry not found' });
        }
        let activityLogsList = [];
        try {
            if (current.activityLogs)
                activityLogsList = JSON.parse(current.activityLogs);
        }
        catch (e) { }
        activityLogsList.push({
            id: (0, uuid_1.v4)(),
            action: 'ARCHIVED',
            description: 'Inquiry soft-deleted (archived)',
            performedBy: adminName,
            timestamp: new Date().toISOString(),
        });
        await prisma_1.default.contactinquiry.update({
            where: { id: inquiryId },
            data: {
                isArchived: true,
                activityLogs: JSON.stringify(activityLogsList),
            },
        });
        res.json({ success: true, message: 'Inquiry archived successfully.' });
    }
    catch (err) {
        console.error('Delete inquiry error:', err);
        res.status(500).json({ error: 'Failed to delete inquiry' });
    }
});
exports.default = router;
