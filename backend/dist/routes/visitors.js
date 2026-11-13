"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../utils/prisma");
const uuid_1 = require("uuid");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Helper to determine device type, browser & OS from User-Agent
function parseUserAgent(ua) {
    let browser = 'Unknown Browser';
    let os = 'Unknown OS';
    let deviceType = 'Desktop';
    if (!ua)
        return { browser, os, deviceType };
    if (/mobile/i.test(ua))
        deviceType = 'Mobile';
    else if (/tablet|ipad/i.test(ua))
        deviceType = 'Tablet';
    else
        deviceType = 'Desktop';
    // OS
    if (/windows/i.test(ua))
        os = 'Windows';
    else if (/macintosh|mac os x/i.test(ua))
        os = 'macOS';
    else if (/android/i.test(ua))
        os = 'Android';
    else if (/iphone|ipad|ipod/i.test(ua))
        os = 'iOS';
    else if (/linux/i.test(ua))
        os = 'Linux';
    // Browser
    if (/edg/i.test(ua))
        browser = 'Edge';
    else if (/chrome|crios/i.test(ua))
        browser = 'Chrome';
    else if (/firefox|fxios/i.test(ua))
        browser = 'Firefox';
    else if (/safari/i.test(ua) && !/chrome/i.test(ua))
        browser = 'Safari';
    else if (/opera|opr/i.test(ua))
        browser = 'Opera';
    return { browser, os, deviceType };
}
// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ENDPOINTS FOR TRACKING & IDENTIFICATION
// ─────────────────────────────────────────────────────────────────────────────
/**
 * POST /api/v1/visitors/identify
 * Identifies or creates a visitor based on visitorUuid cookie/body.
 * Also registers/updates their device and increments visit count if returning.
 */
router.post('/identify', async (req, res) => {
    try {
        let visitorUuid = req.cookies?.ptax_vid || req.body?.visitorUuid;
        const ua = req.headers['user-agent'] || '';
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || '';
        const { browser, os, deviceType } = parseUserAgent(ua);
        const deviceIdentifier = `${browser}-${os}-${deviceType}`;
        let visitorRecord = null;
        let isNewVisitor = false;
        if (visitorUuid) {
            visitorRecord = await prisma_1.prisma.visitor.findUnique({
                where: { visitorUuid },
                include: { devices: true },
            });
        }
        if (!visitorRecord) {
            isNewVisitor = true;
            visitorUuid = (0, uuid_1.v4)();
            visitorRecord = await prisma_1.prisma.visitor.create({
                data: {
                    visitorUuid,
                    displayName: null,
                    email: null,
                    identificationStatus: 'anonymous',
                    totalVisits: 1,
                    devices: {
                        create: {
                            deviceIdentifier,
                            browser,
                            operatingSystem: os,
                            deviceType,
                        },
                    },
                    activityLogs: {
                        create: {
                            activityType: 'first_visit',
                            page: 'Landing',
                            pageUrl: req.body?.pageUrl || '/',
                            description: 'First website visit recorded',
                            ipAddress: ip.substring(0, 45),
                            userAgent: ua.substring(0, 500),
                            status: 'success',
                        },
                    },
                },
                include: { devices: true },
            });
        }
        else {
            // Returning visitor
            const lastVisitTime = new Date(visitorRecord.lastVisit).getTime();
            const now = Date.now();
            // Increment visits if last visit was more than 30 mins ago
            const shouldIncrement = (now - lastVisitTime) > 30 * 60 * 1000;
            const newStatus = visitorRecord.displayName ? 'previously_identified' : 'returning';
            visitorRecord = await prisma_1.prisma.visitor.update({
                where: { id: visitorRecord.id },
                data: {
                    lastVisit: new Date(),
                    totalVisits: shouldIncrement ? visitorRecord.totalVisits + 1 : visitorRecord.totalVisits,
                    identificationStatus: visitorRecord.displayName ? 'previously_identified' : visitorRecord.identificationStatus,
                },
                include: { devices: true },
            });
            // Update or create device
            const existingDevice = visitorRecord.devices.find(d => d.deviceIdentifier === deviceIdentifier);
            if (existingDevice) {
                await prisma_1.prisma.visitordevice.update({
                    where: { id: existingDevice.id },
                    data: { lastSeenAt: new Date() },
                });
            }
            else {
                await prisma_1.prisma.visitordevice.create({
                    data: {
                        visitorId: visitorRecord.id,
                        deviceIdentifier,
                        browser,
                        operatingSystem: os,
                        deviceType,
                    },
                });
            }
            // Log returning visit if significant time passed
            if (shouldIncrement) {
                await prisma_1.prisma.visitoractivitylog.create({
                    data: {
                        visitorId: visitorRecord.id,
                        activityType: 'returning_visit',
                        page: req.body?.page || 'Website',
                        pageUrl: req.body?.pageUrl || '/',
                        description: `Returning visitor session started (${visitorRecord.displayName || 'Anonymous'})`,
                        ipAddress: ip.substring(0, 45),
                        userAgent: ua.substring(0, 500),
                        status: 'success',
                    },
                });
            }
        }
        // Set first-party persistent cookie (1 year expiry)
        res.cookie('ptax_vid', visitorUuid, {
            maxAge: 365 * 24 * 60 * 60 * 1000,
            httpOnly: false, // Accessible to client tracking scripts
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        });
        return res.json({
            success: true,
            visitorUuid,
            visitorId: visitorRecord.id,
            displayName: visitorRecord.displayName,
            email: visitorRecord.email,
            identificationStatus: visitorRecord.displayName ? 'previously_identified' : (isNewVisitor ? 'anonymous' : 'returning'),
            totalVisits: visitorRecord.totalVisits,
            firstVisit: visitorRecord.firstVisit,
            lastVisit: visitorRecord.lastVisit,
        });
    }
    catch (error) {
        console.error('Visitor identify error:', error);
        return res.status(500).json({ error: 'Failed to identify visitor' });
    }
});
/**
 * POST /api/v1/visitors/activity
 * Log user actions, page navigation, form views/submits, clicks.
 */
router.post('/activity', async (req, res) => {
    try {
        const visitorUuid = req.cookies?.ptax_vid || req.body?.visitorUuid;
        const { activityType, page, pageUrl, description, metadata, status = 'success' } = req.body;
        const ua = req.headers['user-agent'] || '';
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || '';
        let visitor = null;
        if (visitorUuid) {
            visitor = await prisma_1.prisma.visitor.findUnique({
                where: { visitorUuid },
            });
        }
        const log = await prisma_1.prisma.visitoractivitylog.create({
            data: {
                visitorId: visitor ? visitor.id : null,
                activityType: activityType || 'page_view',
                page: page || 'Unknown Page',
                pageUrl: pageUrl || '/',
                description: description || `User activity: ${activityType}`,
                ipAddress: ip.substring(0, 45),
                userAgent: ua.substring(0, 500),
                metadata: metadata ? metadata : undefined,
                status: status,
            },
        });
        return res.json({ success: true, logId: log.id });
    }
    catch (error) {
        console.error('Activity log error:', error);
        return res.status(500).json({ error: 'Failed to record activity' });
    }
});
/**
 * POST /api/v1/visitors/associate-identity
 * Associates a name and email with a visitor upon form submission.
 */
router.post('/associate-identity', async (req, res) => {
    try {
        const visitorUuid = req.cookies?.ptax_vid || req.body?.visitorUuid;
        const { name, email, formType, submissionId } = req.body;
        if (!name && !email) {
            return res.status(400).json({ error: 'Name or email required for association' });
        }
        let visitor = null;
        if (visitorUuid) {
            visitor = await prisma_1.prisma.visitor.findUnique({
                where: { visitorUuid },
            });
        }
        if (!visitor) {
            const newUuid = visitorUuid || (0, uuid_1.v4)();
            visitor = await prisma_1.prisma.visitor.create({
                data: {
                    visitorUuid: newUuid,
                    displayName: name ? name.trim() : null,
                    email: email ? email.trim() : null,
                    identificationStatus: 'identified',
                },
            });
        }
        else {
            visitor = await prisma_1.prisma.visitor.update({
                where: { id: visitor.id },
                data: {
                    displayName: name ? name.trim() : visitor.displayName,
                    email: email ? email.trim() : visitor.email,
                    identificationStatus: 'identified',
                },
            });
        }
        // Record Form Submission
        const formRecord = await prisma_1.prisma.formsubmission.create({
            data: {
                visitorId: visitor.id,
                formType: formType || 'general_form',
                submittedName: name ? name.trim() : null,
                submittedEmail: email ? email.trim() : null,
                submissionStatus: 'success',
            },
        });
        // Record system log
        const ua = req.headers['user-agent'] || '';
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || '';
        await prisma_1.prisma.visitoractivitylog.create({
            data: {
                visitorId: visitor.id,
                activityType: 'form_submit_success',
                page: formType ? `Form: ${formType}` : 'Form Submission',
                pageUrl: req.body?.pageUrl || '/',
                description: `Form submitted and identity verified: ${name || 'User'} (${email || 'No email'})`,
                ipAddress: ip.substring(0, 45),
                userAgent: ua.substring(0, 500),
                status: 'success',
            },
        });
        return res.json({
            success: true,
            visitorId: visitor.id,
            displayName: visitor.displayName,
            identificationStatus: 'identified',
            submissionId: formRecord.id,
        });
    }
    catch (error) {
        console.error('Identity association error:', error);
        return res.status(500).json({ error: 'Failed to associate identity' });
    }
});
// ─────────────────────────────────────────────────────────────────────────────
// ADMIN ENDPOINTS (AUTHENTICATION PROTECTED)
// ─────────────────────────────────────────────────────────────────────────────
/**
 * GET /api/v1/visitors/stats
 * Aggregated stats for the admin dashboard.
 */
router.get('/stats', auth_1.authenticate, async (_req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [totalVisitors, identifiedVisitors, anonymousVisitors, returningVisitors, totalSubmissions, todayActivities, recentDevices,] = await Promise.all([
            prisma_1.prisma.visitor.count(),
            prisma_1.prisma.visitor.count({ where: { displayName: { not: null } } }),
            prisma_1.prisma.visitor.count({ where: { displayName: null } }),
            prisma_1.prisma.visitor.count({ where: { totalVisits: { gt: 1 } } }),
            prisma_1.prisma.formsubmission.count(),
            prisma_1.prisma.visitoractivitylog.count({
                where: { createdAt: { gte: today } },
            }),
            prisma_1.prisma.visitordevice.count(),
        ]);
        return res.json({
            totalVisitors,
            uniqueVisitors: totalVisitors,
            identifiedVisitors,
            anonymousVisitors,
            returningVisitors,
            totalSubmissions,
            todayActivities,
            activeDevices: recentDevices,
        });
    }
    catch (error) {
        console.error('Visitor stats error:', error);
        return res.status(500).json({ error: 'Failed to load stats' });
    }
});
/**
 * GET /api/v1/visitors/logs
 * Searchable, filterable activity log feed for admin.
 */
router.get('/logs', auth_1.authenticate, async (req, res) => {
    try {
        const { search = '', activityType = '', status = '', page = '1', limit = '50', startDate, endDate, } = req.query;
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
        const skip = (pageNum - 1) * limitNum;
        const where = {};
        if (activityType) {
            where.activityType = activityType;
        }
        if (status) {
            where.status = status;
        }
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        if (search) {
            const searchStr = search.trim();
            where.OR = [
                { description: { contains: searchStr } },
                { page: { contains: searchStr } },
                { pageUrl: { contains: searchStr } },
                { visitor: { displayName: { contains: searchStr } } },
                { visitor: { email: { contains: searchStr } } },
                { visitor: { visitorUuid: { contains: searchStr } } },
            ];
        }
        const [logs, total] = await Promise.all([
            prisma_1.prisma.visitoractivitylog.findMany({
                where,
                include: {
                    visitor: {
                        include: {
                            devices: {
                                take: 1,
                                orderBy: { lastSeenAt: 'desc' },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limitNum,
            }),
            prisma_1.prisma.visitoractivitylog.count({ where }),
        ]);
        const formattedLogs = logs.map(log => {
            const primaryDevice = log.visitor?.devices?.[0];
            return {
                id: log.id,
                visitorId: log.visitorId,
                visitorUuid: log.visitor?.visitorUuid || 'Unknown',
                visitorName: log.visitor?.displayName || 'Anonymous Visitor',
                visitorEmail: log.visitor?.email || null,
                identificationStatus: log.visitor?.displayName ? 'Previously Identified' : (log.visitor?.totalVisits && log.visitor.totalVisits > 1 ? 'Returning Visitor' : 'New Visitor'),
                activityType: log.activityType,
                page: log.page || 'Home',
                pageUrl: log.pageUrl || '/',
                description: log.description,
                device: primaryDevice ? `${primaryDevice.deviceType} (${primaryDevice.operatingSystem})` : 'Desktop',
                browser: primaryDevice ? primaryDevice.browser : 'Browser',
                os: primaryDevice ? primaryDevice.operatingSystem : 'OS',
                ipAddress: log.ipAddress || '127.0.0.1',
                status: log.status,
                createdAt: log.createdAt,
            };
        });
        return res.json({
            logs: formattedLogs,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        });
    }
    catch (error) {
        console.error('Fetch visitor logs error:', error);
        return res.status(500).json({ error: 'Failed to fetch logs' });
    }
});
/**
 * GET /api/v1/visitors/:id
 * Detailed history of an individual visitor.
 */
router.get('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const visitor = await prisma_1.prisma.visitor.findFirst({
            where: {
                OR: [
                    { id },
                    { visitorUuid: id },
                ],
            },
            include: {
                devices: {
                    orderBy: { lastSeenAt: 'desc' },
                },
                formSubmissions: {
                    orderBy: { createdAt: 'desc' },
                },
                activityLogs: {
                    orderBy: { createdAt: 'desc' },
                    take: 100,
                },
            },
        });
        if (!visitor) {
            return res.status(404).json({ error: 'Visitor not found' });
        }
        return res.json({
            visitor: {
                id: visitor.id,
                visitorUuid: visitor.visitorUuid,
                displayName: visitor.displayName || 'Anonymous Visitor',
                email: visitor.email,
                identificationStatus: visitor.displayName ? 'Previously Identified' : (visitor.totalVisits > 1 ? 'Returning Visitor' : 'New Visitor'),
                firstVisit: visitor.firstVisit,
                lastVisit: visitor.lastVisit,
                totalVisits: visitor.totalVisits,
                devices: visitor.devices,
                formSubmissions: visitor.formSubmissions,
                activityTimeline: visitor.activityLogs.map(a => ({
                    id: a.id,
                    activityType: a.activityType,
                    page: a.page,
                    pageUrl: a.pageUrl,
                    description: a.description,
                    status: a.status,
                    createdAt: a.createdAt,
                })),
            },
        });
    }
    catch (error) {
        console.error('Visitor detail error:', error);
        return res.status(500).json({ error: 'Failed to retrieve visitor details' });
    }
});
/**
 * DELETE /api/v1/visitors/:id
 * Privacy compliance / GDPR data erasure.
 */
router.delete('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.prisma.$transaction([
            prisma_1.prisma.visitoractivitylog.deleteMany({ where: { visitorId: id } }),
            prisma_1.prisma.formsubmission.deleteMany({ where: { visitorId: id } }),
            prisma_1.prisma.visitordevice.deleteMany({ where: { visitorId: id } }),
            prisma_1.prisma.visitor.delete({ where: { id } }),
        ]);
        return res.json({ success: true, message: 'Visitor record and history deleted successfully' });
    }
    catch (error) {
        console.error('Delete visitor error:', error);
        return res.status(500).json({ error: 'Failed to delete visitor data' });
    }
});
exports.default = router;
