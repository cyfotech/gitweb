import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/v1/dashboard/stats
router.get('/stats', authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const [
      totalPages, publishedPages, draftPages,
      totalServices, totalBlogPosts, publishedBlogPosts,
      totalMedia, totalVisitors, totalPageViews,
      totalClicks, totalInquiries, totalConsultations,
      newInquiries, newConsultations,
    ] = await Promise.all([
      prisma.websitepage.count(),
      prisma.websitepage.count({ where: { status: 'published' } }),
      prisma.websitepage.count({ where: { status: 'draft' } }),
      prisma.service.count(),
      prisma.blogpost.count(),
      prisma.blogpost.count({ where: { isPublished: true } }),
      prisma.mediaasset.count(),
      prisma.visitorsession.count(),
      prisma.pageview.count(),
      prisma.clickevent.count(),
      prisma.contactinquiry.count(),
      prisma.consultationrequest.count(),
      prisma.contactinquiry.count({ where: { status: 'new' } }),
      prisma.consultationrequest.count({ where: { status: 'new' } }),
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
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// GET /api/v1/dashboard/recent-activity
router.get('/recent-activity', authenticate, async (_req, res) => {
  try {
    const [inquiries, consultations, logs] = await Promise.all([
      prisma.contactinquiry.findMany({
        orderBy: { id: 'desc' },
        take: 5,
        select: { id: true, name: true, email: true, status: true },
      }),
      prisma.consultationrequest.findMany({
        orderBy: { id: 'desc' },
        take: 5,
        select: { id: true, fullName: true, email: true, status: true },
      }),
      prisma.adminactivitylog.findMany({
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
  } catch {
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});

export default router;
