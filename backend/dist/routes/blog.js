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
const BLOG_DIR = path_1.default.join(UPLOAD_DIR, 'blog');
if (!fs_1.default.existsSync(BLOG_DIR)) {
    fs_1.default.mkdirSync(BLOG_DIR, { recursive: true });
}
// Multer storage for blog images
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, BLOG_DIR),
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const safeBase = path_1.default.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
        cb(null, `blog_${safeBase}_${(0, uuid_1.v4)().slice(0, 8)}${ext}`);
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
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit allows any standard high-res image
});
// POST /api/v1/blog/upload-image - Upload a blog featured image
router.post('/upload-image', auth_1.authenticate, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }
        const file = req.file;
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const relativePath = `/uploads/blog/${file.filename}`;
        const fullUrl = `${baseUrl}${relativePath}`;
        let width = null;
        let height = null;
        try {
            const metadata = await (0, sharp_1.default)(file.path).metadata();
            width = metadata.width || null;
            height = metadata.height || null;
        }
        catch (e) {
            console.warn('[Blog Image Sharp] metadata read error:', e.message);
        }
        // Automatically register as a Media Asset in DAM system so it is tracked
        try {
            const blogFolder = await prisma_1.default.mediafolder.findFirst({ where: { name: 'Blogs' } });
            await prisma_1.default.mediaasset.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    filename: file.filename,
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    size: file.size,
                    width,
                    height,
                    folder: 'Blogs',
                    folderId: blogFolder?.id || null,
                    altText: path_1.default.basename(file.originalname, path_1.default.extname(file.originalname)).replace(/[-_]/g, ' '),
                    storageLocation: fullUrl,
                    thumbnailUrl: fullUrl,
                    adminUserId: req.admin?.adminId || null,
                },
            });
        }
        catch (damErr) {
            console.warn('[Blog Image DAM Auto-Register] notice:', damErr.message);
        }
        res.json({
            success: true,
            url: fullUrl,
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            width,
            height,
        });
    }
    catch (err) {
        console.error('Blog image upload error:', err);
        res.status(500).json({ error: err.message || 'Image upload failed' });
    }
});
// GET /api/v1/blog - list posts
router.get('/', (req, res, next) => {
    if (req.query.published === 'all') {
        return (0, auth_1.authenticate)(req, res, next);
    }
    next();
}, async (req, res) => {
    try {
        const { page = '1', limit = '30', search, category } = req.query;
        const pageNum = Math.max(1, Number.parseInt(String(page), 10) || 1);
        const limitNum = Math.min(100, Math.max(1, Number.parseInt(String(limit), 10) || 30));
        const where = req.query.published === 'all' ? {} : { isPublished: true };
        const filters = [];
        if (search && typeof search === 'string' && search.trim()) {
            const q = search.trim();
            filters.push({ OR: [
                    { title: { contains: q } },
                    { excerpt: { contains: q } },
                    { content: { contains: q } },
                ] });
        }
        if (category && category !== 'All') {
            filters.push({ OR: [
                    { blogcategory: { name: category } },
                    { categoryName: category },
                ] });
        }
        if (filters.length)
            where.AND = filters;
        const [posts, total] = await Promise.all([
            prisma_1.default.blogpost.findMany({
                where,
                include: { blogcategory: true },
                orderBy: { publishedAt: 'desc' },
                skip: (pageNum - 1) * limitNum,
                take: limitNum,
            }),
            prisma_1.default.blogpost.count({ where }),
        ]);
        res.json({ posts, total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) });
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
});
// GET /api/v1/blog/slug/:slug
router.get('/slug/:slug', async (req, res) => {
    try {
        const post = await prisma_1.default.blogpost.findUnique({
            where: { slug: req.params.slug, isPublished: true },
            include: { blogcategory: true },
        });
        if (!post)
            return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});
// GET /api/v1/blog/:id - protected admin detail
router.get('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const post = await prisma_1.default.blogpost.findUnique({
            where: { id: getRouteParam(req.params.id) },
            include: { blogcategory: true },
        });
        if (!post)
            return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});
// POST /api/v1/blog - create post
router.post('/', auth_1.authenticate, async (req, res) => {
    try {
        const data = req.body;
        let finalSlug = data.slug
            ? data.slug.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
            : (data.title || 'post').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
        // Prevent duplicate slug collision
        const existing = await prisma_1.default.blogpost.findUnique({ where: { slug: finalSlug } });
        if (existing) {
            finalSlug = `${finalSlug}-${(0, uuid_1.v4)().slice(0, 6)}`;
        }
        // Support both `image` and `coverImage` payload fields, handling clean null
        const rawImage = data.image !== undefined ? data.image : data.coverImage;
        const cleanImage = rawImage && typeof rawImage === 'string' && rawImage.trim() !== '' ? rawImage.trim() : null;
        const post = await prisma_1.default.blogpost.create({
            data: {
                id: (0, uuid_1.v4)(),
                slug: finalSlug,
                title: data.title,
                excerpt: data.excerpt || '',
                content: data.content || null,
                categoryId: data.categoryId || null,
                categoryName: data.categoryName || null,
                authorName: data.authorName || 'Preferred Tax Director',
                authorRole: data.authorRole || 'Tax Advisory & Compliance',
                authorAvatar: data.authorAvatar || null,
                image: cleanImage,
                readTime: data.readTime || '5 min read',
                featured: !!data.isFeatured || !!data.featured,
                isPublished: data.isPublished ?? true,
                metaTitle: data.metaTitle || data.title,
                metaDescription: data.metaDescription || data.excerpt || null,
                metaKeywords: data.metaKeywords ?? undefined,
                publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
                updatedAt: new Date(),
            },
            include: { blogcategory: true },
        });
        await (0, activityLog_1.logActivity)({
            adminId: req.admin?.adminId,
            action: 'blog_post_created',
            resource: 'blog',
            resourceId: post.id,
            details: { title: post.title, hasImage: !!cleanImage },
        });
        res.status(201).json(post);
    }
    catch (err) {
        console.error('Create blog post error:', err);
        res.status(500).json({ error: err.message || 'Failed to create post' });
    }
});
// PUT /api/v1/blog/:id - update post
router.put('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const data = req.body;
        const rawImage = data.image !== undefined ? data.image : data.coverImage;
        const cleanImage = rawImage && typeof rawImage === 'string' && rawImage.trim() !== '' ? rawImage.trim() : null;
        const updateData = {
            title: data.title !== undefined ? data.title : undefined,
            excerpt: data.excerpt !== undefined ? data.excerpt : undefined,
            content: data.content !== undefined ? data.content : undefined,
            categoryId: data.categoryId !== undefined ? (data.categoryId || null) : undefined,
            categoryName: data.categoryName !== undefined ? data.categoryName : undefined,
            authorName: data.authorName !== undefined ? data.authorName : undefined,
            authorRole: data.authorRole !== undefined ? data.authorRole : undefined,
            authorAvatar: data.authorAvatar !== undefined ? data.authorAvatar : undefined,
            image: rawImage !== undefined ? cleanImage : undefined,
            readTime: data.readTime !== undefined ? data.readTime : undefined,
            featured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : (data.featured !== undefined ? Boolean(data.featured) : undefined),
            isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : undefined,
            metaTitle: data.metaTitle !== undefined ? data.metaTitle : undefined,
            metaDescription: data.metaDescription !== undefined ? data.metaDescription : undefined,
            metaKeywords: data.metaKeywords !== undefined ? data.metaKeywords : undefined,
            updatedAt: new Date(),
        };
        if (data.slug) {
            const finalSlug = data.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            const duplicate = await prisma_1.default.blogpost.findFirst({
                where: { slug: finalSlug, NOT: { id: getRouteParam(req.params.id) } },
                select: { id: true },
            });
            if (duplicate)
                return res.status(409).json({ error: 'That article slug is already in use.' });
            updateData.slug = finalSlug;
        }
        if (data.publishedAt !== undefined) {
            updateData.publishedAt = data.publishedAt ? new Date(data.publishedAt) : new Date();
        }
        const post = await prisma_1.default.blogpost.update({
            where: { id: getRouteParam(req.params.id) },
            data: updateData,
            include: { blogcategory: true },
        });
        await (0, activityLog_1.logActivity)({
            adminId: req.admin?.adminId,
            action: 'blog_post_updated',
            resource: 'blog',
            resourceId: post.id,
            details: { title: post.title, hasImage: !!post.image },
        });
        res.json(post);
    }
    catch (err) {
        console.error('Update blog post error:', err);
        res.status(500).json({ error: err.message || 'Failed to update post' });
    }
});
// DELETE /api/v1/blog/:id
router.delete('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const postId = getRouteParam(req.params.id);
        await prisma_1.default.blogpost.delete({ where: { id: postId } });
        await (0, activityLog_1.logActivity)({
            adminId: req.admin?.adminId,
            action: 'blog_post_deleted',
            resource: 'blog',
            resourceId: postId,
        });
        res.json({ success: true });
    }
    catch {
        res.status(500).json({ error: 'Failed to delete post' });
    }
});
// GET /api/v1/blog/categories/all
router.get('/categories/all', async (_req, res) => {
    try {
        const categories = await prisma_1.default.blogcategory.findMany({
            orderBy: { name: 'asc' },
        });
        res.json(categories);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});
exports.default = router;
