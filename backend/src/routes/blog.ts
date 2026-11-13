import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { logActivity } from '../services/activityLog';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const router = Router();

function getRouteParam(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

// Ensure upload directory exists
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const BLOG_DIR = path.join(UPLOAD_DIR, 'blog');
if (!fs.existsSync(BLOG_DIR)) {
  fs.mkdirSync(BLOG_DIR, { recursive: true });
}

// Multer storage for blog images
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, BLOG_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    cb(null, `blog_${safeBase}_${uuidv4().slice(0, 8)}${ext}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const mime = (file.mimetype || '').toLowerCase();
  const ext = path.extname(file.originalname).toLowerCase();
  const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif', '.bmp'];

  if (mime.startsWith('image/') || validExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File format ${file.mimetype} is not supported. Please upload an image file.`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit allows any standard high-res image
});

// POST /api/v1/blog/upload-image - Upload a blog featured image
router.post('/upload-image', authenticate, upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const file = req.file;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const relativePath = `/uploads/blog/${file.filename}`;
    const fullUrl = `${baseUrl}${relativePath}`;

    let width: number | null = null;
    let height: number | null = null;

    try {
      const metadata = await sharp(file.path).metadata();
      width = metadata.width || null;
      height = metadata.height || null;
    } catch (e: any) {
      console.warn('[Blog Image Sharp] metadata read error:', e.message);
    }

    // Automatically register as a Media Asset in DAM system so it is tracked
    try {
      const blogFolder = await prisma.mediafolder.findFirst({ where: { name: 'Blogs' } });
      await prisma.mediaasset.create({
        data: {
          id: uuidv4(),
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          width,
          height,
          folder: 'Blogs',
          folderId: blogFolder?.id || null,
          altText: path.basename(file.originalname, path.extname(file.originalname)).replace(/[-_]/g, ' '),
          storageLocation: fullUrl,
          thumbnailUrl: fullUrl,
          adminUserId: req.admin?.adminId || null,
        },
      });
    } catch (damErr: any) {
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
  } catch (err: any) {
    console.error('Blog image upload error:', err);
    res.status(500).json({ error: err.message || 'Image upload failed' });
  }
});

// GET /api/v1/blog - list posts
router.get('/', (req, res, next) => {
  if (req.query.published === 'all') {
    return authenticate(req as AuthRequest, res, next);
  }
  next();
}, async (req, res) => {
  try {
    const { page = '1', limit = '30', search, category } = req.query;
    const pageNum = Math.max(1, Number.parseInt(String(page), 10) || 1);
    const limitNum = Math.min(100, Math.max(1, Number.parseInt(String(limit), 10) || 30));
    const where: any = req.query.published === 'all' ? {} : { isPublished: true };
    const filters: any[] = [];

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
        { blogcategory: { name: category as string } },
        { categoryName: category as string },
      ] });
    }

    if (filters.length) where.AND = filters;

    const [posts, total] = await Promise.all([
      prisma.blogpost.findMany({
        where,
        include: { blogcategory: true },
        orderBy: { publishedAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.blogpost.count({ where }),
    ]);

    res.json({ posts, total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) });
  } catch {
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// GET /api/v1/blog/slug/:slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const post = await prisma.blogpost.findUnique({
      where: { slug: req.params.slug, isPublished: true },
      include: { blogcategory: true },
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// GET /api/v1/blog/:id - protected admin detail
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const post = await prisma.blogpost.findUnique({
      where: { id: getRouteParam(req.params.id) },
      include: { blogcategory: true },
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// POST /api/v1/blog - create post
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    let finalSlug = data.slug
      ? data.slug.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
      : (data.title || 'post').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    // Prevent duplicate slug collision
    const existing = await prisma.blogpost.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      finalSlug = `${finalSlug}-${uuidv4().slice(0, 6)}`;
    }

    // Support both `image` and `coverImage` payload fields, handling clean null
    const rawImage = data.image !== undefined ? data.image : data.coverImage;
    const cleanImage = rawImage && typeof rawImage === 'string' && rawImage.trim() !== '' ? rawImage.trim() : null;

    const post = await prisma.blogpost.create({
      data: {
        id: uuidv4(),
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

    await logActivity({
      adminId: req.admin?.adminId,
      action: 'blog_post_created',
      resource: 'blog',
      resourceId: post.id,
      details: { title: post.title, hasImage: !!cleanImage },
    });

    res.status(201).json(post);
  } catch (err: any) {
    console.error('Create blog post error:', err);
    res.status(500).json({ error: err.message || 'Failed to create post' });
  }
});

// PUT /api/v1/blog/:id - update post
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    const rawImage = data.image !== undefined ? data.image : data.coverImage;
    const cleanImage = rawImage && typeof rawImage === 'string' && rawImage.trim() !== '' ? rawImage.trim() : null;

    const updateData: any = {
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
      const duplicate = await prisma.blogpost.findFirst({
        where: { slug: finalSlug, NOT: { id: getRouteParam(req.params.id) } },
        select: { id: true },
      });
      if (duplicate) return res.status(409).json({ error: 'That article slug is already in use.' });
      updateData.slug = finalSlug;
    }

    if (data.publishedAt !== undefined) {
      updateData.publishedAt = data.publishedAt ? new Date(data.publishedAt) : new Date();
    }

    const post = await prisma.blogpost.update({
      where: { id: getRouteParam(req.params.id) },
      data: updateData,
      include: { blogcategory: true },
    });

    await logActivity({
      adminId: req.admin?.adminId,
      action: 'blog_post_updated',
      resource: 'blog',
      resourceId: post.id,
      details: { title: post.title, hasImage: !!post.image },
    });

    res.json(post);
  } catch (err: any) {
    console.error('Update blog post error:', err);
    res.status(500).json({ error: err.message || 'Failed to update post' });
  }
});

// DELETE /api/v1/blog/:id
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const postId = getRouteParam(req.params.id);
    await prisma.blogpost.delete({ where: { id: postId } });
    await logActivity({
      adminId: req.admin?.adminId,
      action: 'blog_post_deleted',
      resource: 'blog',
      resourceId: postId,
    });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// GET /api/v1/blog/categories/all
router.get('/categories/all', async (_req, res) => {
  try {
    const categories = await prisma.blogcategory.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router;
