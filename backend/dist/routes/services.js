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
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
const router = (0, express_1.Router)();
function getRouteParam(value) {
    return Array.isArray(value) ? value[0] : value;
}
// Ensure upload directory exists
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const SERVICE_DIR = path_1.default.join(UPLOAD_DIR, 'services');
if (!fs_1.default.existsSync(SERVICE_DIR)) {
    fs_1.default.mkdirSync(SERVICE_DIR, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, SERVICE_DIR),
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const safeBase = path_1.default.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
        cb(null, `service_${safeBase}_${(0, uuid_1.v4)().slice(0, 8)}${ext}`);
    },
});
const fileFilter = (_req, file, cb) => {
    const mime = (file.mimetype || '').toLowerCase();
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif', '.bmp'];
    if (mime.startsWith('image/') || validExts.includes(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error(`File format ${file.mimetype} is not supported. Please upload an image file.`));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});
async function slugExists(slug, excludeId) {
    const existing = await prisma_1.default.service.findFirst({
        where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
        select: { id: true },
    });
    return !!existing;
}
async function resolveCategory(categoryId, categorySlug) {
    if (categoryId) {
        const cat = await prisma_1.default.servicecategory.findUnique({ where: { id: categoryId } });
        if (cat)
            return cat;
    }
    if (categorySlug) {
        const cat = await prisma_1.default.servicecategory.findFirst({ where: { slug: categorySlug } });
        if (cat)
            return cat;
    }
    // default to first enabled category
    const fallback = await prisma_1.default.servicecategory.findFirst({ where: { isEnabled: true } });
    return fallback;
}
// GET /api/v1/services - get all services
// Public calls return published services only. Authenticated admins may pass ?published=all to include drafts.
router.get('/', (req, res, next) => {
    if (req.query.published === 'all') {
        return (0, auth_1.authenticate)(req, res, next);
    }
    next();
}, async (req, res) => {
    try {
        const { published, categoryId, q } = req.query;
        const where = {};
        const isAuthed = !!req.admin;
        if (!isAuthed) {
            where.isPublished = true;
        }
        else if (published === 'true') {
            where.isPublished = true;
        }
        if (categoryId)
            where.categoryId = categoryId;
        if (q) {
            where.OR = [
                { name: { contains: String(q) } },
                { shortDescription: { contains: String(q) } },
                { slug: { contains: String(q) } },
            ];
        }
        const services = await prisma_1.default.service.findMany({
            where,
            include: { servicecategory: true },
            orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
        });
        res.json(services);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});
// GET /api/v1/services/slug/:slug - get by slug (public: published only unless authenticated)
router.get('/slug/:slug', (req, res, next) => {
    if (req.query.draft === 'true') {
        return (0, auth_1.authenticate)(req, res, next);
    }
    next();
}, async (req, res) => {
    try {
        const slug = getRouteParam(req.params.slug);
        const service = await prisma_1.default.service.findUnique({
            where: { slug },
            include: { servicecategory: true },
        });
        if (!service)
            return res.status(404).json({ error: 'Service not found' });
        if (!req.admin && !service.isPublished) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.json(service);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch service' });
    }
});
// POST /api/v1/services/upload-image - Upload a service image (admin)
router.post('/upload-image', auth_1.authenticate, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }
        const file = req.file;
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const relativePath = `/uploads/services/${file.filename}`;
        const fullUrl = `${baseUrl}${relativePath}`;
        let width = null;
        let height = null;
        try {
            const metadata = await (0, sharp_1.default)(file.path).metadata();
            width = metadata.width || null;
            height = metadata.height || null;
        }
        catch {
            // ignore
        }
        try {
            const svcFolder = await prisma_1.default.mediafolder.findFirst({ where: { name: 'Services' } });
            await prisma_1.default.mediaasset.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    filename: file.filename,
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    size: file.size,
                    width,
                    height,
                    folder: 'Services',
                    folderId: svcFolder?.id || null,
                    altText: path_1.default.basename(file.originalname, path_1.default.extname(file.originalname)).replace(/[-_]/g, ' '),
                    storageLocation: fullUrl,
                    thumbnailUrl: fullUrl,
                    adminUserId: req.admin?.adminId || null,
                },
            });
        }
        catch {
            // DAM registration best-effort
        }
        res.json({ success: true, url: fullUrl, filename: file.filename, originalName: file.originalname, size: file.size, width, height });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Image upload failed' });
    }
});
// Helper to parse JSON fields from payload
function parseJson(value, fallback = null) {
    if (value === undefined || value === null)
        return fallback;
    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        }
        catch {
            return fallback;
        }
    }
    return value;
}
async function buildServiceData(body, existingId) {
    const slug = (body.slug || '').toString().trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
    if (!slug)
        throw new Error('Slug is required');
    if (await slugExists(slug, existingId))
        throw new Error('Slug already in use');
    const category = await resolveCategory(body.categoryId, body.categorySlug);
    const displayOrder = typeof body.displayOrder === 'number' ? body.displayOrder : (body.displayOrder ? parseInt(String(body.displayOrder), 10) || 0 : 0);
    return {
        id: existingId || undefined,
        name: String(body.name || '').trim(),
        slug,
        categoryId: category?.id || '',
        shortDescription: String(body.shortDescription || '').trim(),
        fullDescription: String(body.fullDescription || '').trim(),
        heroImage: body.heroImage || body.coverImage || null,
        thumbnailImage: body.thumbnailImage || body.coverImage || null,
        iconName: body.iconName || 'FileText',
        additionalImages: parseJson(body.additionalImages),
        video: body.video || null,
        gif: body.gif || null,
        features: parseJson(body.features, []),
        benefits: parseJson(body.benefits, []),
        deliverables: parseJson(body.deliverables, []),
        workflow: parseJson(body.workflow, []),
        faqs: parseJson(body.faqs, []),
        relatedSlugs: parseJson(body.relatedSlugs, []),
        idealFor: body.idealFor || null,
        turnaroundTime: body.turnaroundTime || null,
        demoType: body.demoType || 'tax-workflow',
        heroTagline: body.heroTagline || null,
        isFeatured: body.isFeatured === true || body.isFeatured === 'true',
        isPublished: body.isPublished !== false && body.isPublished !== 'false',
        displayOrder,
        ctaText: String(body.ctaText || 'Book Consultation'),
        ctaUrl: body.ctaUrl || '',
        seoTitle: body.seoTitle || body.metaTitle || null,
        seoDescription: body.seoDescription || body.metaDescription || null,
        seoKeywords: body.seoKeywords || null,
        metaTitle: body.metaTitle || body.seoTitle || null,
        metaDescription: body.metaDescription || body.seoDescription || null,
    };
}
// POST /api/v1/services - Create service (admin)
router.post('/', auth_1.authenticate, async (req, res) => {
    try {
        const data = await buildServiceData(req.body);
        const service = await prisma_1.default.service.create({
            data: {
                ...data,
                id: (0, uuid_1.v4)(),
                publicationDate: data.isPublished ? new Date() : null,
            },
        });
        await (0, activityLog_1.logActivity)({ adminId: req.admin?.adminId, action: 'SERVICE_CREATE', resource: 'Service', resourceId: service.id, details: { name: service.name } });
        res.status(201).json(service);
    }
    catch (err) {
        const status = err.message === 'Slug already in use' || err.message === 'Slug is required' ? 400 : 500;
        res.status(status).json({ error: err.message || 'Failed to create service' });
    }
});
// PUT /api/v1/services/:id - Update service (admin)
router.put('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const id = getRouteParam(req.params.id);
        const existing = await prisma_1.default.service.findUnique({ where: { id } });
        if (!existing)
            return res.status(404).json({ error: 'Service not found' });
        const previousData = { name: existing.name, slug: existing.slug, isPublished: existing.isPublished };
        const data = await buildServiceData(req.body, id);
        const service = await prisma_1.default.service.update({
            where: { id },
            data,
            include: { servicecategory: true },
        });
        try {
            await prisma_1.default.servicerevision.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    serviceId: id,
                    previousData,
                    newData: { name: service.name, slug: service.slug, isPublished: service.isPublished },
                    changeType: 'UPDATE',
                    adminUserId: req.admin?.adminId || null,
                },
            });
        }
        catch {
            // revision best-effort
        }
        await (0, activityLog_1.logActivity)({ adminId: req.admin?.adminId, action: 'SERVICE_UPDATE', resource: 'Service', resourceId: id, details: { name: service.name } });
        res.json(service);
    }
    catch (err) {
        const status = err.message === 'Slug already in use' || err.message === 'Slug is required' ? 400 : 500;
        res.status(status).json({ error: err.message || 'Failed to update service' });
    }
});
// DELETE /api/v1/services/:id - Delete service (admin)
router.delete('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const id = getRouteParam(req.params.id);
        const existing = await prisma_1.default.service.findUnique({ where: { id } });
        if (!existing)
            return res.status(404).json({ error: 'Service not found' });
        await prisma_1.default.servicerevision.deleteMany({ where: { serviceId: id } });
        await prisma_1.default.service.delete({ where: { id } });
        await (0, activityLog_1.logActivity)({ adminId: req.admin?.adminId, action: 'SERVICE_DELETE', resource: 'Service', resourceId: id, details: { name: existing.name } });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete service' });
    }
});
// PATCH /api/v1/services/:id/status - Publish/Unpublish (admin)
router.patch('/:id/status', auth_1.authenticate, async (req, res) => {
    try {
        const id = getRouteParam(req.params.id);
        const isPublished = req.body.isPublished === true || req.body.isPublished === 'true';
        const service = await prisma_1.default.service.update({
            where: { id },
            data: { isPublished, publicationDate: isPublished ? new Date() : undefined },
        });
        await (0, activityLog_1.logActivity)({ adminId: req.admin?.adminId, action: 'SERVICE_STATUS', resource: 'Service', resourceId: id, details: { isPublished } });
        res.json(service);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to update status' });
    }
});
// PATCH /api/v1/services/:id/featured - Toggle featured (admin)
router.patch('/:id/featured', auth_1.authenticate, async (req, res) => {
    try {
        const id = getRouteParam(req.params.id);
        const isFeatured = req.body.isFeatured === true || req.body.isFeatured === 'true';
        const service = await prisma_1.default.service.update({ where: { id }, data: { isFeatured } });
        res.json(service);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to update featured status' });
    }
});
// POST /api/v1/services/:id/duplicate - Duplicate a service (admin)
router.post('/:id/duplicate', auth_1.authenticate, async (req, res) => {
    try {
        const id = getRouteParam(req.params.id);
        const source = await prisma_1.default.service.findUnique({ where: { id } });
        if (!source)
            return res.status(404).json({ error: 'Service not found' });
        const newSlug = `${source.slug}-copy`;
        let finalSlug = newSlug;
        let n = 2;
        while (await slugExists(finalSlug)) {
            finalSlug = `${source.slug}-copy-${n}`;
            n += 1;
        }
        const copy = await prisma_1.default.service.create({
            data: {
                id: (0, uuid_1.v4)(),
                name: `${source.name} (Copy)`,
                slug: finalSlug,
                categoryId: source.categoryId,
                shortDescription: source.shortDescription,
                fullDescription: source.fullDescription,
                heroImage: source.heroImage,
                thumbnailImage: source.thumbnailImage,
                iconName: source.iconName,
                additionalImages: source.additionalImages,
                video: source.video,
                gif: source.gif,
                features: source.features,
                benefits: source.benefits,
                deliverables: source.deliverables,
                workflow: source.workflow,
                faqs: source.faqs,
                relatedSlugs: source.relatedSlugs,
                idealFor: source.idealFor,
                turnaroundTime: source.turnaroundTime,
                demoType: source.demoType,
                heroTagline: source.heroTagline,
                isFeatured: false,
                isPublished: false,
                displayOrder: source.displayOrder + 1,
                ctaText: source.ctaText,
                ctaUrl: source.ctaUrl,
                seoTitle: source.seoTitle,
                seoDescription: source.seoDescription,
                seoKeywords: source.seoKeywords,
                metaTitle: source.metaTitle,
                metaDescription: source.metaDescription,
            },
        });
        await (0, activityLog_1.logActivity)({ adminId: req.admin?.adminId, action: 'SERVICE_DUPLICATE', resource: 'Service', resourceId: copy.id, details: { name: copy.name } });
        res.status(201).json(copy);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to duplicate service' });
    }
});
// PUT /api/v1/services/reorder/bulk - Reorder services (admin)
router.put('/reorder/bulk', auth_1.authenticate, async (req, res) => {
    try {
        const order = Array.isArray(req.body?.order) ? req.body.order : [];
        await prisma_1.default.$transaction(order.map((item, index) => prisma_1.default.service.update({
            where: { id: item.id },
            data: { displayOrder: typeof item.displayOrder === 'number' ? item.displayOrder : index },
        })));
        await (0, activityLog_1.logActivity)({ adminId: req.admin?.adminId, action: 'SERVICE_REORDER', resource: 'Service' });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to reorder services' });
    }
});
exports.default = router;
