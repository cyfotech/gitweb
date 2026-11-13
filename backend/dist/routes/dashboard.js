"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/v1/dashboard/stats
router.get('/stats', auth_1.authenticate, async (_req, res) => {
    try {
        const [totalPages, publishedPages, draftPages, totalServices, totalBlogPosts, publishedBlogPosts, totalMedia, totalVisitors, totalPageViews, totalClicks, totalInquiries, totalConsultations, newInquiries, newConsultations,] = await Promise.all([
            prisma_1.default.websitepage.count(),
            prisma_1.default.websitepage.count({ where: { status: 'published' } }),
            prisma_1.default.websitepage.count({ where: { status: 'draft' } }),
            prisma_1.default.service.count(),
            prisma_1.default.blogpost.count(),
            prisma_1.default.blogpost.count({ where: { isPublished: true } }),
            prisma_1.default.mediaasset.count(),
            prisma_1.default.visitorsession.count(),
            prisma_1.default.pageview.count(),
            prisma_1.default.clickevent.count(),
            prisma_1.default.contactinquiry.count(),
            prisma_1.default.consultationrequest.count(),
            prisma_1.default.contactinquiry.count({ where: { status: 'new' } }),
            prisma_1.default.consultationrequest.count({ where: { status: 'new' } }),
        ]);
        res.json({
            pages: { total: totalPages, published: publishedPages, draft: draftPages },
            services: totalServices,
            blog: { total: totalBlogPosts, published: publishedBlogPosts },
            media: totalMedia,
            visitors: totalVisitors,
            pageViews: totalPageViews,
            clicks: totalClicks,
            inquiries: { total: totalInquiries, new: newInquiries },
            consultations: { total: totalConsultations, new: newConsultations },
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
});
// GET /api/v1/dashboard/recent-activity
router.get('/recent-activity', auth_1.authenticate, async (_req, res) => {
    try {
        const [inquiries, consultations, logs] = await Promise.all([
            prisma_1.default.contactinquiry.findMany({
                orderBy: { id: 'desc' },
                take: 5,
                select: { id: true, name: true, email: true, status: true },
            }),
            prisma_1.default.consultationrequest.findMany({
                orderBy: { id: 'desc' },
                take: 5,
                select: { id: true, fullName: true, email: true, status: true },
            }),
            prisma_1.default.adminactivitylog.findMany({
                orderBy: { id: 'desc' },
                take: 10,
                include: { adminuser: { select: { name: true } } },
            }),
        ]);
        const mappedConsultations = consultations.map(c => {
            const parts = c.fullName.split(' ');
            return {
                id: c.id,
                firstName: parts[0] || 'Client',
                lastName: parts.slice(1).join(' ') || '',
                email: c.email,
                status: c.status,
                createdAt: new Date(),
            };
        });
        const mappedInquiries = inquiries.map(i => ({
            ...i,
            createdAt: new Date(),
        }));
        const mappedLogs = logs.map(l => ({
            id: l.id,
            action: l.eventType,
            severity: l.status,
            createdAt: new Date(),
            admin: {
                firstName: l.adminuser?.name?.split(' ')[0] || 'Admin',
                lastName: l.adminuser?.name?.split(' ').slice(1).join(' ') || '',
            },
        }));
        res.json({ inquiries: mappedInquiries, consultations: mappedConsultations, recentLogs: mappedLogs });
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch recent activity' });
    }
});
exports.default = router;
