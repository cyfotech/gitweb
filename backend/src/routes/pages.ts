import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { logActivity } from '../services/activityLog';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// GET /api/v1/pages - list all pages with rich metadata
router.get('/', authenticate, async (_req, res) => {
  try {
    const pages = await prisma.websitepage.findMany({
      include: {
        pageseo: true,
        _count: { select: { pagesection: true } },
        pagesection: {
          select: { updatedAt: true, isEnabled: true },
          orderBy: { updatedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { title: 'asc' },
    });

    const mapped = pages.map(p => {
      // Derive last modified from most-recently-updated section
      const latestSectionUpdatedAt = p.pagesection?.[0]?.updatedAt || null;
      const lastModified = p.publishedAt || latestSectionUpdatedAt || null;

      // Count enabled sections
      const enabledSectionCount = p._count.pagesection;

      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        route: p.slug === 'home' ? '/' : `/${p.slug}`,
        isPublished: p.status === 'published',
        status: p.status,
        publishedAt: p.publishedAt,
        lastModified,
        _count: { sections: enabledSectionCount },
        seo: p.pageseo
          ? {
            hasMetaTitle: !!(p.pageseo as any).metaTitle,
            hasMetaDescription: !!(p.pageseo as any).metaDescription,
            hasOgImage: !!(p.pageseo as any).ogImage,
            metaTitle: (p.pageseo as any).metaTitle || null,
          }
          : null,
      };
    });

    res.json(mapped);
  } catch (err: any) {
    console.error('[pages] GET / error:', err);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

// GET /api/v1/pages/:id - get single page with sections
router.get('/:id', authenticate, async (req, res) => {
  try {
    const pageId = String(req.params.id);
    const page = await prisma.websitepage.findUnique({
      where: { id: pageId },
      include: {
        pagesection: {
          orderBy: { displayOrder: 'asc' },
        },
        pageseo: true,
      },
    });
    if (!page) return res.status(404).json({ error: 'Page not found' });

    res.json({
      id: page.id,
      slug: page.slug,
      title: page.title,
      description: page.description,
      route: page.slug === 'home' ? '/' : `/${page.slug}`,
      isPublished: page.status === 'published',
      status: page.status,
      publishedAt: page.publishedAt,
      sections: page.pagesection,
      seo: page.pageseo,
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

// GET /api/v1/pages/slug/:slug - get by slug (for public frontend)
router.get('/slug/:slug', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    const slug = String(req.params.slug);
    const page = await prisma.websitepage.findFirst({
      where: { slug, status: 'published' },
      include: {
        pagesection: {
          orderBy: { displayOrder: 'asc' },
        },
        pageseo: true,
      },
    });
    if (!page) return res.status(404).json({ error: 'Page not found' });

    // Public endpoint: strip draftData and revision internals so unpublished
    // content is never exposed to the public site.
    const cleanSections = page.pagesection.map(({ draftData, revisionId, parentSectionId, updatedAt, ...section }) => (
      section.isEnabled
        ? section
        : {
            ...section,
            title: null,
            subheading: null,
            description: null,
            content: null,
            backgroundImage: null,
            backgroundVideo: null,
            imagePosition: null,
            imageAltText: null,
          }
    ));

    res.json({
      id: page.id,
      slug: page.slug,
      title: page.title,
      description: page.description,
      isPublished: page.status === 'published',
      sections: cleanSections,
      seo: page.pageseo,
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

// PUT /api/v1/pages/:id/publish - publish/unpublish
router.put('/:id/publish', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { isPublished } = req.body;
    if (typeof isPublished !== 'boolean') {
      return res.status(422).json({ error: 'isPublished must be a boolean' });
    }

    const pageId = String(req.params.id);
    const publishedAt = isPublished ? new Date() : null;
    const page = await prisma.$transaction(async (transaction) => {
      const current = await transaction.websitepage.findUnique({
        where: { id: pageId },
        include: { pagesection: true },
      });
      if (!current) return null;

      if (isPublished) {
        for (const section of current.pagesection) {
          if (!section.draftData) continue;

          let draft: any;
          try {
            draft = JSON.parse(section.draftData);
          } catch {
            throw new Error(`Invalid draft data for section "${section.sectionKey}"`);
          }
          if (!draft || typeof draft !== 'object' || Array.isArray(draft)) {
            throw new Error(`Invalid draft data for section "${section.sectionKey}"`);
          }

          await transaction.pagesection.update({
            where: { id: section.id },
            data: {
              title: draft.title ?? section.title,
              subheading: draft.subheading ?? section.subheading,
              description: draft.description ?? section.description,
              backgroundImage: draft.backgroundImage ?? section.backgroundImage,
              backgroundVideo: draft.backgroundVideo ?? section.backgroundVideo,
              imagePosition: draft.imagePosition ?? section.imagePosition,
              imageAltText: draft.imageAltText ?? section.imageAltText,
              content: draft.content === undefined
                ? section.content
                : JSON.stringify(draft.content),
              draftData: null,
              publishedAt,
            },
          });

          await transaction.contentrevision.create({
            data: {
              id: uuidv4(),
              sectionId: section.id,
              previousData: {
                title: section.title,
                subheading: section.subheading,
                description: section.description,
                backgroundImage: section.backgroundImage,
                backgroundVideo: section.backgroundVideo,
                imagePosition: section.imagePosition,
                imageAltText: section.imageAltText,
                content: section.content,
              },
              newData: draft,
              changeType: 'publish',
              changeNotes: 'Published with page',
              adminUserId: req.admin?.adminId || null,
            },
          });
        }
      }

      return transaction.websitepage.update({
        where: { id: pageId },
        data: {
          status: isPublished ? 'published' : 'draft',
          publishedAt,
        },
      });
    });
    if (!page) return res.status(404).json({ error: 'Page not found' });

    await logActivity({
      adminId: req.admin?.adminId,
      action: isPublished ? 'page_published' : 'page_unpublished',
      resource: 'page',
      resourceId: pageId,
    });
    res.json(page);
  } catch (err) {
    console.error('[pages] PUT /:id/publish error:', err);
    res.status(500).json({ error: 'Failed to publish page changes' });
  }
});

// PUT /api/v1/pages/:id/sections/reorder - reorder sections
router.put('/:id/sections/reorder', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const pageId = String(req.params.id);
    const { order } = req.body; // Array of { sectionId, displayOrder }
    const updates = order.map((item: { sectionId: string; displayOrder: number }) =>
      prisma.pagesection.update({
        where: { id: item.sectionId },
        data: { displayOrder: item.displayOrder },
      })
    );

    await prisma.$transaction(updates);

    await logActivity({
      adminId: req.admin?.adminId,
      action: 'sections_reordered',
      resource: 'page',
      resourceId: pageId,
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to reorder sections' });
  }
});

// POST /api/v1/pages/:id/duplicate - duplicate a page with all its sections
router.post('/:id/duplicate', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const pageId = String(req.params.id);
    const original = await prisma.websitepage.findUnique({
      where: { id: pageId },
      include: { pagesection: { orderBy: { displayOrder: 'asc' } }, pageseo: true },
    });

    if (!original) return res.status(404).json({ error: 'Page not found' });

    const newSlug = `${original.slug}-copy-${Date.now().toString(36).slice(-4)}`;
    const newPageId = uuidv4();

    // Create duplicate page
    const newPage = await prisma.websitepage.create({
      data: {
        id: newPageId,
        slug: newSlug,
        title: `${original.title} (Copy)`,
        description: original.description,
        status: 'draft',
        type: original.type,
        metaTitle: original.metaTitle,
        metaDescription: original.metaDescription,
        metaKeywords: original.metaKeywords,
      },
    });

    // Duplicate all sections
    if (original.pagesection && original.pagesection.length > 0) {
      const sectionCreates = original.pagesection.map(sec =>
        prisma.pagesection.create({
          data: {
            id: uuidv4(),
            pageId: newPageId,
            sectionKey: sec.sectionKey,
            sectionType: sec.sectionType,
            title: sec.title,
            subheading: sec.subheading,
            description: sec.description,
            content: sec.content,
            backgroundImage: sec.backgroundImage,
            backgroundVideo: sec.backgroundVideo,
            imagePosition: sec.imagePosition,
            imageAltText: sec.imageAltText,
            displayOrder: sec.displayOrder,
            isEnabled: sec.isEnabled,
          },
        })
      );
      await prisma.$transaction(sectionCreates);
    }

    // Duplicate SEO if exists
    if (original.pageseo) {
      await prisma.pageseo.create({
        data: {
          id: uuidv4(),
          pageId: newPageId,
          metaTitle: (original.pageseo as any).metaTitle || `${original.title} (Copy)`,
          metaDescription: (original.pageseo as any).metaDescription || '',
          ogTitle: (original.pageseo as any).ogTitle || '',
          ogDescription: (original.pageseo as any).ogDescription || '',
          twitterTitle: (original.pageseo as any).twitterTitle || '',
          twitterDescription: (original.pageseo as any).twitterDescription || '',
          sitemapPriority: (original.pageseo as any).sitemapPriority || '0.5',
          sitemapChange: (original.pageseo as any).sitemapChange || 'weekly',
        },
      });
    }

    await logActivity({
      adminId: req.admin?.adminId,
      action: 'page_duplicated',
      resource: 'page',
      resourceId: newPageId,
    });

    res.status(201).json({
      id: newPage.id,
      slug: newPage.slug,
      title: newPage.title,
      message: 'Page duplicated successfully',
    });
  } catch (err: any) {
    console.error('[pages] POST /:id/duplicate error:', err);
    res.status(500).json({ error: err.message || 'Failed to duplicate page' });
  }
});

export default router;
