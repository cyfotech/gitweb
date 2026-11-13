"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth_1 = require("../middleware/auth");
const activityLog_1 = require("../services/activityLog");
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
// GET /api/v1/seo/public/:slug - Public SEO lookup by page slug for live runtime head injection
router.get('/public/:slug', async (req, res) => {
    try {
        const slug = req.params.slug === 'index' || req.params.slug === 'root' ? 'home' : req.params.slug;
        const page = await prisma_1.default.websitepage.findUnique({
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
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch public SEO metadata' });
    }
});
// GET /api/v1/seo/audit - Full site SEO audit and scoring across all registered pages
router.get('/audit', auth_1.authenticate, async (_req, res) => {
    try {
        const pages = await prisma_1.default.websitepage.findMany({
            include: { pageseo: true },
        });
        const audits = pages.map((p) => {
            const seo = p.pageseo;
            const issues = [];
            let score = 100;
            // Meta title checks
            if (!seo?.metaTitle || !seo.metaTitle.trim()) {
                score -= 25;
                issues.push({ type: 'critical', message: 'Missing meta title tag' });
            }
            else if (seo.metaTitle.length < 30) {
                score -= 10;
                issues.push({ type: 'warning', message: `Meta title is too short (${seo.metaTitle.length} chars, recommended 50-60)` });
            }
            else if (seo.metaTitle.length > 65) {
                score -= 10;
                issues.push({ type: 'warning', message: `Meta title may truncate on Google (${seo.metaTitle.length} chars, recommended 50-60)` });
            }
            else {
                issues.push({ type: 'good', message: 'Meta title length is optimal' });
            }
            // Meta description checks
            if (!seo?.metaDescription || !seo.metaDescription.trim()) {
                score -= 25;
                issues.push({ type: 'critical', message: 'Missing meta description tag' });
            }
            else if (seo.metaDescription.length < 70) {
                score -= 10;
                issues.push({ type: 'warning', message: `Meta description is too short (${seo.metaDescription.length} chars, recommended 150-160)` });
            }
            else if (seo.metaDescription.length > 165) {
                score -= 10;
                issues.push({ type: 'warning', message: `Meta description exceeds 160 characters and may be truncated` });
            }
            else {
                issues.push({ type: 'good', message: 'Meta description length is optimal' });
            }
            // Canonical URL check
            if (!seo?.canonicalUrl || !seo.canonicalUrl.trim()) {
                score -= 15;
                issues.push({ type: 'warning', message: 'No canonical URL declared' });
            }
            else {
                issues.push({ type: 'good', message: 'Canonical URL properly configured' });
            }
            // Open Graph check
            if (!seo?.ogImage) {
                score -= 10;
                issues.push({ type: 'warning', message: 'Missing Open Graph image for social sharing' });
            }
            else {
                issues.push({ type: 'good', message: 'Social preview image configured' });
            }
            // Structured data check
            if (!seo?.structuredData) {
                score -= 10;
                issues.push({ type: 'warning', message: 'No JSON-LD structured data attached' });
            }
            else {
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
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to conduct SEO audit' });
    }
});
// GET /api/v1/seo/robots - Get editable robots.txt rules
router.get('/robots', async (_req, res) => {
    try {
        const setting = await prisma_1.default.globalsetting.findUnique({
            where: { key: 'robots_txt_content' },
        });
        const defaultRobots = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://smarttaxexperts.com/sitemap.xml`;
        res.json({ content: setting ? setting.value : defaultRobots });
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch robots.txt' });
    }
});
// PUT /api/v1/seo/robots - Save robots.txt configuration
router.put('/robots', auth_1.authenticate, async (req, res) => {
    try {
        const { content } = req.body;
        await prisma_1.default.globalsetting.upsert({
            where: { key: 'robots_txt_content' },
            update: { value: content },
            create: {
                id: (0, uuid_1.v4)(),
                key: 'robots_txt_content',
                value: content,
                category: 'seo',
            },
        });
        await (0, activityLog_1.logActivity)({
            adminId: req.admin?.adminId,
            action: 'robots_txt_updated',
            resource: 'seo',
        });
        res.json({ success: true, message: 'Robots.txt updated successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to update robots.txt' });
    }
});
// GET /api/v1/seo/:pageId
router.get('/:pageId', async (req, res) => {
    try {
        const seo = await prisma_1.default.pageseo.findUnique({
            where: { pageId: req.params.pageId },
        });
        if (!seo)
            return res.json({});
        let parsedKeywords = [];
        if (Array.isArray(seo.metaKeywords)) {
            parsedKeywords = seo.metaKeywords;
        }
        else if (typeof seo.metaKeywords === 'string') {
            try {
                const parsed = JSON.parse(seo.metaKeywords);
                if (Array.isArray(parsed)) {
                    parsedKeywords = parsed;
                }
                else {
                    parsedKeywords = seo.metaKeywords.split(',').map(s => s.trim()).filter(Boolean);
                }
            }
            catch {
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
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch SEO data' });
    }
});
// PUT /api/v1/seo/:pageId
router.put('/:pageId', auth_1.authenticate, async (req, res) => {
    try {
        const data = req.body;
        let jsonLdParsed = null;
        if (data.jsonLd) {
            try {
                jsonLdParsed = typeof data.jsonLd === 'string' ? JSON.parse(data.jsonLd) : data.jsonLd;
            }
            catch {
                jsonLdParsed = { raw: data.jsonLd };
            }
        }
        const payload = {
            metaTitle: data.metaTitle || '',
            metaDescription: data.metaDescription || '',
            metaKeywords: Array.isArray(data.metaKeywords)
                ? data.metaKeywords
                : (data.metaKeywords ? String(data.metaKeywords).split(',').map((k) => k.trim()).filter(Boolean) : []),
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
        const seo = await prisma_1.default.pageseo.upsert({
            where: { pageId: req.params.pageId },
            update: payload,
            create: {
                id: (0, uuid_1.v4)(),
                pageId: req.params.pageId,
                ...payload,
            },
        });
        await (0, activityLog_1.logActivity)({
            adminId: req.admin?.adminId,
            action: 'seo_updated',
            resource: 'seo',
            resourceId: req.params.pageId,
        });
        res.json(seo);
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to save SEO data' });
    }
});
// GET /api/v1/seo/sitemap/generate - XML Sitemap generator
router.get('/sitemap/generate', async (_req, res) => {
    try {
        const pages = await prisma_1.default.websitepage.findMany({
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
    }
    catch {
        res.status(500).json({ error: 'Failed to generate sitemap' });
    }
});
exports.default = router;
