import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { logActivity } from '../services/activityLog';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// GET /api/v1/navigation - list all nav items
router.get('/', async (_req, res) => {
  try {
    const items = await prisma.navigationitem.findMany({
      orderBy: { order: 'asc' },
    });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch navigation items' });
  }
});

// POST /api/v1/navigation - create nav item
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, url, order, isVisible, target, parentId, websitePageId } = req.body;

    if (!name || !url) {
      return res.status(400).json({ error: 'name and url are required' });
    }

    const slug = (name as string).toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36).slice(-4);

    const item = await prisma.navigationitem.create({
      data: {
        id: uuidv4(),
        slug,
        name,
        url,
        order: order ?? 99,
        isVisible: isVisible !== false,
        target: target || '_self',
        parentId: parentId || null,
        websitePageId: websitePageId || null,
      },
    });

    await logActivity({
      adminId: req.admin?.adminId,
      action: 'nav_item_created',
      resource: 'navigation',
      resourceId: item.id,
    });

    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create navigation item' });
  }
});

// PUT /api/v1/navigation/:id - update nav item
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, url, order, isVisible, target, parentId } = req.body;

    const item = await prisma.navigationitem.update({
      where: { id: req.params.id },
      data: {
        name,
        url,
        order: order ?? 99,
        isVisible: isVisible !== false,
        target: target || '_self',
        parentId: parentId || null,
      },
    });

    await logActivity({
      adminId: req.admin?.adminId,
      action: 'nav_item_updated',
      resource: 'navigation',
      resourceId: item.id,
    });

    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update navigation item' });
  }
});

// DELETE /api/v1/navigation/:id - delete nav item
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.navigationitem.delete({ where: { id: req.params.id } });

    await logActivity({
      adminId: req.admin?.adminId,
      action: 'nav_item_deleted',
      resource: 'navigation',
      resourceId: req.params.id,
    });

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete navigation item' });
  }
});

// PUT /api/v1/navigation/reorder/bulk - bulk reorder
router.put('/reorder/bulk', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { order } = req.body; // Array of { id, order }
    const updates = (order as { id: string; order: number }[]).map(item =>
      prisma.navigationitem.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    );
    await prisma.$transaction(updates);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to reorder navigation items' });
  }
});

export default router;
