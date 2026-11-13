import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { logActivity } from '../services/activityLog';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// GET /api/v1/seo/public/:slug - Public SEO lookup by page slug for live runtime head injection
router.get('/public/:slug', async (req, res) => {
  try {
    const slug = req.params.slug === 'index' || req.params.slug === 'root' ? 'home' : req.params.slug;
    const page = await prisma.websitepage.findUnique({
      where: { slug },
      include: { pageseo: true },
    });

    if (!page || !page.pageseo) {
      return res.json({
        metaTitle: `${slug.charAt(0).toUpperCase() + slug.slice(1)} | Smart Tax Experts (STE)`,
        metaDescription: 'Smart Tax Experts provides high-precision US tax preparation, corporate advisory, and scalable offshore CPA outsourcing.',
        canonicalUrl: `https://smarttaxexperts.com${slug === 'home' ? '' : '/' + slug}`,
        robotsIndex: true,
        robotsFollow: true,
      });
    }

    const seo = page.pageseo;
    res.json({
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      metaKeywords: seo.metaKeywords,
      canonicalUrl: seo.canonicalUrl,
      robotsIndex: seo.robotsIndex,
      robotsFollow: seo.robotsFollow,
      ogTitle: seo.ogTitle,
      ogDescription: seo.ogDescription,
      ogImage: seo.ogImage,
      twitterTitle: seo.twitterTitle,
      twitterDescription: seo.twitterDescription,
      twitterImage: seo.twitterImage,
      structuredData: seo.structuredData,
      sitemapPriority: seo.sitemapPriority,
      sitemapChange: seo.sitemapChange,
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch public SEO metadata' });
  }
});

// GET /api/v1/seo/audit - Full site SEO audit and scoring across all registered pages
router.get('/audit', authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const pages = await prisma.websitepage.findMany({
      include: { pageseo: true },
    });

    const audits = pages.map((p) => {
      const seo = p.pageseo;
      const issues: { type: 'critical' | 'warning' | 'good'; message: string }[] = [];
      let score = 100;

      // Meta title checks
      if (!seo?.metaTitle || !seo.metaTitle.trim()) {
        score -= 25;
        issues.push({ type: 'critical', message: 'Missing meta title tag' });
      } else if (seo.metaTitle.length < 30) {
        score -= 10;
        issues.push({ type: 'warning', message: `Meta title is too short (${seo.metaTitle.length} chars, recommended 50-60)` });
      } else if (seo.metaTitle.length > 65) {
        score -= 10;
        issues.push({ type: 'warning', message: `Meta title may truncate on Google (${seo.metaTitle.length} chars, recommended 50-60)` });
      } else {
        issues.push({ type: 'good', message: 'Meta title length is optimal' });
      }

      // Meta description checks
      if (!seo?.metaDescription || !seo.metaDescription.trim()) {
        score -= 25;
        issues.push({ type: 'critical', message: 'Missing meta description tag' });
      } else if (seo.metaDescription.length < 70) {
        score -= 10;
        issues.push({ type: 'warning', message: `Meta description is too short (${seo.metaDescription.length} chars, recommended 150-160)` });
      } else if (seo.metaDescription.length > 165) {
        score -= 10;
        issues.push({ type: 'warning', message: `Meta description exceeds 160 characters and may be truncated` });
      } else {
        issues.push({ type: 'good', message: 'Meta description length is optimal' });
      }

      // Canonical URL check
      if (!seo?.canonicalUrl || !seo.canonicalUrl.trim()) {
        score -= 15;
        issues.push({ type: 'warning', message: 'No canonical URL declared' });
      } else {
        issues.push({ type: 'good', message: 'Canonical URL properly configured' });
      }

      // Open Graph check
      if (!seo?.ogImage) {
        score -= 10;
        issues.push({ type: 'warning', message: 'Missing Open Graph image for social sharing' });
      } else {
        issues.push({ type: 'good', message: 'Social preview image configured' });
      }

      // Structured data check
      if (!seo?.structuredData) {
        score -= 10;
        issues.push({ type: 'warning', message: 'No JSON-LD structured data attached' });
      } else {
        issues.push({ type: 'good', message: 'Valid JSON-LD schema detected' });
      }

      const finalScore = Math.max(10, Math.min(100, score));
      return {
        pageId: p.id,
        pageSlug: p.slug,
        pageTitle: p.title,
        score: finalScore,
        status: finalScore >= 80 ? 'good' : finalScore >= 50 ? 'warning' : 'critical',
        issues,
      };
    });

    const overallScore = Math.round(audits.reduce((acc, a) => acc + a.score, 0) / (audits.length || 1));

    res.json({
      overallScore,
      pagesAudited: audits.length,
      audits,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to conduct SEO audit' });
  }
});

// GET /api/v1/seo/robots - Get editable robots.txt rules
router.get('/robots', async (_req, res) => {
  try {
    const setting = await prisma.globalsetting.findUnique({
      where: { key: 'robots_txt_content' },
    });
    const defaultRobots = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://smarttaxexperts.com/sitemap.xml`;
    res.json({ content: setting ? setting.value : defaultRobots });
  } catch {
    res.status(500).json({ error: 'Failed to fetch robots.txt' });
  }
});

// PUT /api/v1/seo/robots - Save robots.txt configuration
router.put('/robots', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    await prisma.globalsetting.upsert({
      where: { key: 'robots_txt_content' },
      update: { value: content },
      create: {
        id: uuidv4(),
        key: 'robots_txt_content',
        value: content,
        category: 'seo',
      },
    });

    await logActivity({
      adminId: req.admin?.adminId,
      action: 'robots_txt_updated',
      resource: 'seo',
    });

    res.json({ success: true, message: 'Robots.txt updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update robots.txt' });
  }
});

// GET /api/v1/seo/:pageId
router.get('/:pageId', async (req, res) => {
  try {
    const seo = await prisma.pageseo.findUnique({
      where: { pageId: req.params.pageId },
    });
    if (!seo) return res.json({});
    let parsedKeywords: string[] = [];
    if (Array.isArray(seo.metaKeywords)) {
      parsedKeywords = seo.metaKeywords as string[];
    } else if (typeof seo.metaKeywords === 'string') {
      try {
        const parsed = JSON.parse(seo.metaKeywords);
        if (Array.isArray(parsed)) {
          parsedKeywords = parsed;
        } else {
          parsedKeywords = seo.metaKeywords.split(',').map(s => s.trim()).filter(Boolean);
        }
      } catch {
        parsedKeywords = seo.metaKeywords.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    res.json({
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      metaKeywords: parsedKeywords,
      canonicalUrl: seo.canonicalUrl,
      robotsIndex: seo.robotsIndex,
      robotsFollow: seo.robotsFollow,
      ogTitle: seo.ogTitle,
      ogDescription: seo.ogDescription,
      ogImage: seo.ogImage,
      twitterTitle: seo.twitterTitle,
      twitterDescription: seo.twitterDescription,
      twitterImage: seo.twitterImage,
      jsonLd: seo.structuredData ? JSON.stringify(seo.structuredData, null, 2) : '',
      sitemapPriority: seo.sitemapPriority,
      sitemapChange: seo.sitemapChange,
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch SEO data' });
  }
});

// PUT /api/v1/seo/:pageId
router.put('/:pageId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    let jsonLdParsed: any = null;
    if (data.jsonLd) {
      try {
        jsonLdParsed = typeof data.jsonLd === 'string' ? JSON.parse(data.jsonLd) : data.jsonLd;
      } catch {
        jsonLdParsed = { raw: data.jsonLd };
      }
    }

    const payload = {
      metaTitle: data.metaTitle || '',
      metaDescription: data.metaDescription || '',
      metaKeywords: Array.isArray(data.metaKeywords)
        ? data.metaKeywords
        : (data.metaKeywords ? String(data.metaKeywords).split(',').map((k: string) => k.trim()).filter(Boolean) : []),
      canonicalUrl: data.canonicalUrl || null,
      robotsIndex: data.robotsIndex ?? true,
      robotsFollow: data.robotsFollow ?? true,
      ogTitle: data.ogTitle || data.metaTitle || '',
      ogDescription: data.ogDescription || data.metaDescription || '',
      ogImage: data.ogImage || null,
      twitterTitle: data.twitterTitle || data.metaTitle || '',
      twitterDescription: data.twitterDescription || data.metaDescription || '',
      twitterImage: data.twitterImage || null,
      structuredData: jsonLdParsed,
      sitemapPriority: data.sitemapPriority || '0.8',
      sitemapChange: data.sitemapChange || 'weekly',
    };

    const seo = await prisma.pageseo.upsert({
      where: { pageId: req.params.pageId },
      update: payload,
      create: {
        id: uuidv4(),
        pageId: req.params.pageId,
        ...payload,
      },
    });

    await logActivity({
      adminId: req.admin?.adminId,
      action: 'seo_updated',
      resource: 'seo',
      resourceId: req.params.pageId,
    });

    res.json(seo);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to save SEO data' });
  }
});

// GET /api/v1/seo/sitemap/generate - XML Sitemap generator
router.get('/sitemap/generate', async (_req, res) => {
  try {
    const pages = await prisma.websitepage.findMany({
      where: { status: 'published' },
      include: { pageseo: true },
    });

    const baseUrl = process.env.FRONTEND_URL || 'https://smarttaxexperts.com';
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    pages.forEach((page) => {
      // Exclude pages explicitly configured with noindex
      if (page.pageseo && page.pageseo.robotsIndex === false) {
        return;
      }

      const path = page.slug === 'home' ? '/' : `/${page.slug}`;
      const canonical = page.pageseo?.canonicalUrl || `${baseUrl}${path}`;
      const priority = page.pageseo?.sitemapPriority || (page.slug === 'home' ? '1.0' : '0.8');
      const changefreq = page.pageseo?.sitemapChange || 'weekly';

      xml += `\n  <url>\n    <loc>${canonical}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    });

    xml += '\n</urlset>';
    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
  } catch {
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
});

export default router;
