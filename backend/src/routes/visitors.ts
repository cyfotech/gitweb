import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Helper to determine device type, browser & OS from User-Agent
function parseUserAgent(ua: string) {
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';
  let deviceType = 'Desktop';

  if (!ua) return { browser, os, deviceType };

  if (/mobile/i.test(ua)) deviceType = 'Mobile';
  else if (/tablet|ipad/i.test(ua)) deviceType = 'Tablet';
  else deviceType = 'Desktop';

  // OS
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  // Browser
  if (/edg/i.test(ua)) browser = 'Edge';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/opera|opr/i.test(ua)) browser = 'Opera';

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
router.post('/identify', async (req: Request, res: Response) => {
  try {
    let visitorUuid = req.cookies?.ptax_vid || req.body?.visitorUuid;
    const ua = req.headers['user-agent'] || '';
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '';
    const { browser, os, deviceType } = parseUserAgent(ua);
    const deviceIdentifier = `${browser}-${os}-${deviceType}`;

    let visitorRecord = null;
    let isNewVisitor = false;

    if (visitorUuid) {
      visitorRecord = await prisma.visitor.findUnique({
        where: { visitorUuid },
        include: { devices: true },
      });
    }

    if (!visitorRecord) {
      isNewVisitor = true;
      visitorUuid = uuidv4();
      visitorRecord = await prisma.visitor.create({
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
    } else {
      // Returning visitor
      const lastVisitTime = new Date(visitorRecord.lastVisit).getTime();
      const now = Date.now();
      // Increment visits if last visit was more than 30 mins ago
      const shouldIncrement = (now - lastVisitTime) > 30 * 60 * 1000;

      const newStatus = visitorRecord.displayName ? 'previously_identified' : 'returning';

      visitorRecord = await prisma.visitor.update({
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
        await prisma.visitordevice.update({
          where: { id: existingDevice.id },
          data: { lastSeenAt: new Date() },
        });
      } else {
        await prisma.visitordevice.create({
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
        await prisma.visitoractivitylog.create({
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
  } catch (error: any) {
    console.error('Visitor identify error:', error);
    return res.status(500).json({ error: 'Failed to identify visitor' });
  }
});

/**
 * POST /api/v1/visitors/activity
 * Log user actions, page navigation, form views/submits, clicks.
 */
router.post('/activity', async (req: Request, res: Response) => {
  try {
    const visitorUuid = req.cookies?.ptax_vid || req.body?.visitorUuid;
    const { activityType, page, pageUrl, description, metadata, status = 'success' } = req.body;

    const ua = req.headers['user-agent'] || '';
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '';

    let visitor = null;
    if (visitorUuid) {
      visitor = await prisma.visitor.findUnique({
        where: { visitorUuid },
      });
    }

    const log = await prisma.visitoractivitylog.create({
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
  } catch (error: any) {
    console.error('Activity log error:', error);
    return res.status(500).json({ error: 'Failed to record activity' });
  }
});

/**
 * POST /api/v1/visitors/associate-identity
 * Associates a name and email with a visitor upon form submission.
 */
router.post('/associate-identity', async (req: Request, res: Response) => {
  try {
    const visitorUuid = req.cookies?.ptax_vid || req.body?.visitorUuid;
    const { name, email, formType, submissionId } = req.body;

    if (!name && !email) {
      return res.status(400).json({ error: 'Name or email required for association' });
    }

    let visitor = null;
    if (visitorUuid) {
      visitor = await prisma.visitor.findUnique({
        where: { visitorUuid },
      });
    }

    if (!visitor) {
      const newUuid = visitorUuid || uuidv4();
      visitor = await prisma.visitor.create({
        data: {
          visitorUuid: newUuid,
          displayName: name ? name.trim() : null,
          email: email ? email.trim() : null,
          identificationStatus: 'identified',
        },
      });
    } else {
      visitor = await prisma.visitor.update({
        where: { id: visitor.id },
        data: {
          displayName: name ? name.trim() : visitor.displayName,
          email: email ? email.trim() : visitor.email,
          identificationStatus: 'identified',
        },
      });
    }

    // Record Form Submission
    const formRecord = await prisma.formsubmission.create({
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
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '';

    await prisma.visitoractivitylog.create({
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
  } catch (error: any) {
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
router.get('/stats', authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalVisitors,
      identifiedVisitors,
      anonymousVisitors,
      returningVisitors,
      totalSubmissions,
      todayActivities,
      recentDevices,
    ] = await Promise.all([
      prisma.visitor.count(),
      prisma.visitor.count({ where: { displayName: { not: null } } }),
      prisma.visitor.count({ where: { displayName: null } }),
      prisma.visitor.count({ where: { totalVisits: { gt: 1 } } }),
      prisma.formsubmission.count(),
      prisma.visitoractivitylog.count({
        where: { createdAt: { gte: today } },
      }),
      prisma.visitordevice.count(),
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
  } catch (error: any) {
    console.error('Visitor stats error:', error);
    return res.status(500).json({ error: 'Failed to load stats' });
  }
});

/**
 * GET /api/v1/visitors/logs
 * Searchable, filterable activity log feed for admin.
 */
router.get('/logs', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const {
      search = '',
      activityType = '',
      status = '',
      page = '1',
      limit = '50',
      startDate,
      endDate,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (activityType) {
      where.activityType = activityType as string;
    }

    if (status) {
      where.status = status as string;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    if (search) {
      const searchStr = (search as string).trim();
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
      prisma.visitoractivitylog.findMany({
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
      prisma.visitoractivitylog.count({ where }),
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
  } catch (error: any) {
    console.error('Fetch visitor logs error:', error);
    return res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

/**
 * GET /api/v1/visitors/:id
 * Detailed history of an individual visitor.
 */
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const visitor = await prisma.visitor.findFirst({
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
  } catch (error: any) {
    console.error('Visitor detail error:', error);
    return res.status(500).json({ error: 'Failed to retrieve visitor details' });
  }
});

/**
 * DELETE /api/v1/visitors/:id
 * Privacy compliance / GDPR data erasure.
 */
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.$transaction([
      prisma.visitoractivitylog.deleteMany({ where: { visitorId: id } }),
      prisma.formsubmission.deleteMany({ where: { visitorId: id } }),
      prisma.visitordevice.deleteMany({ where: { visitorId: id } }),
      prisma.visitor.delete({ where: { id } }),
    ]);

    return res.json({ success: true, message: 'Visitor record and history deleted successfully' });
  } catch (error: any) {
    console.error('Delete visitor error:', error);
    return res.status(500).json({ error: 'Failed to delete visitor data' });
  }
});

export default router;

