import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/v1/logs/activity
router.get('/activity', authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const [logs, total] = await Promise.all([
      prisma.adminactivitylog.findMany({
        include: {
          adminuser: { select: { name: true, email: true } },
        },
        orderBy: { id: 'desc' },
        take: 100,
      }),
      prisma.adminactivitylog.count(),
    ]);

    const mapped = logs.map(l => ({
      id: l.id,
      action: l.eventType,
      resource: l.targetPage,
      resourceId: l.targetObject,
      severity: l.status,
      ipAddress: l.ipAddress,
      createdAt: new Date(),
      admin: {
        firstName: l.adminuser?.name?.split(' ')[0] || 'Admin',
        lastName: l.adminuser?.name?.split(' ').slice(1).join(' ') || '',
        email: l.adminuser?.email || '',
      },
    }));

    res.json({ logs: mapped, total, page: 1 });
  } catch {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// GET /api/v1/logs/system
router.get('/system', authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const [logs, total] = await Promise.all([
      prisma.systemlog.findMany({
        orderBy: { id: 'desc' },
        take: 100,
      }),
      prisma.systemlog.count(),
    ]);
    const mapped = logs.map(l => ({
      ...l,
      createdAt: new Date(),
    }));
    res.json({ logs: mapped, total, page: 1 });
  } catch {
    res.status(500).json({ error: 'Failed to fetch system logs' });
  }
});

// GET /api/v1/logs/export
router.get('/export', authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const logs = await prisma.adminactivitylog.findMany({
      include: { adminuser: { select: { email: true } } },
      orderBy: { id: 'desc' },
      take: 2000,
    });

    const csv = [
      'Admin,Action,Resource,ResourceId,Severity,IP',
      ...logs.map(l =>
        `"${l.adminuser?.email || 'system'}","${l.eventType}","${l.targetPage || ''}","${l.targetObject || ''}","${l.status}","${l.ipAddress || ''}"`
      ),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="activity-logs.csv"');
    res.send(csv);
  } catch {
    res.status(500).json({ error: 'Failed to export logs' });
  }
});

export default router;
