import { Router, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { logActivity } from '../services/activityLog';

const router = Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const MEDIA_DIR = path.join(UPLOAD_DIR, 'media');
const THUMB_DIR = path.join(MEDIA_DIR, 'thumbnails');
const VERSIONS_DIR = path.join(MEDIA_DIR, 'versions');

[UPLOAD_DIR, MEDIA_DIR, THUMB_DIR, VERSIONS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Configure disk storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, MEDIA_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    cb(null, `${safeBase}_${uuidv4().slice(0, 8)}${ext}`);
  },
});

const ALLOWED_MIME_TYPES = [
  // Images
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif',
  // Videos
  'video/mp4', 'video/webm', 'video/quicktime',
  // Documents
  'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain', 'text/csv',
  // Archives
  'application/zip', 'application/x-zip-compressed',
];

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not supported. Please upload an image, video, or approved document format.`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

// Helper: Calculate SHA-256 hash of file
function getFileHash(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', (err) => reject(err));
  });
}

// -------------------------------------------------------------------------
// GET /api/v1/media/statistics
// Total Assets, Storage Breakdown, Mime Type Counts, Unused Assets Count
// -------------------------------------------------------------------------
router.get('/statistics', authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const [assets, foldersCount, usageEntries] = await Promise.all([
      prisma.mediaasset.findMany({
        where: { isArchived: false },
        select: {
          id: true,
          mimeType: true,
          size: true,
          storageLocation: true,
          isArchived: true,
        },
      }),
      prisma.mediafolder.count(),
      prisma.mediausage.findMany({ select: { mediaId: true } }),
    ]);

    const usedMediaIds = new Set(usageEntries.map((u) => u.mediaId));

    let totalStorageBytes = 0;
    let imageStorageBytes = 0;
    let videoStorageBytes = 0;
    let documentStorageBytes = 0;
    let otherStorageBytes = 0;

    let imageCount = 0;
    let videoCount = 0;
    let documentCount = 0;
    let otherCount = 0;
    let unusedCount = 0;

    assets.forEach((a) => {
      const sz = a.size || 0;
      totalStorageBytes += sz;

      const mime = (a.mimeType || '').toLowerCase();
      if (mime.startsWith('image/')) {
        imageCount++;
        imageStorageBytes += sz;
      } else if (mime.startsWith('video/')) {
        videoCount++;
        videoStorageBytes += sz;
      } else if (
        mime.includes('pdf') ||
        mime.includes('word') ||
        mime.includes('excel') ||
        mime.includes('officedocument') ||
        mime.includes('text') ||
        mime.includes('presentation')
      ) {
        documentCount++;
        documentStorageBytes += sz;
      } else {
        otherCount++;
        otherStorageBytes += sz;
      }

      if (!usedMediaIds.has(a.id)) {
        unusedCount++;
      }
    });

    res.json({
      totalAssets: assets.length,
      totalFolders: foldersCount,
      totalStorageBytes,
      imageCount,
      videoCount,
      documentCount,
      otherCount,
      unusedCount,
      storageBreakdown: {
        images: imageStorageBytes,
        videos: videoStorageBytes,
        documents: documentStorageBytes,
        other: otherStorageBytes,
      },
    });
  } catch (err: any) {
    console.error('Fetch media stats error:', err);
    res.status(500).json({ error: 'Failed to fetch media statistics' });
  }
});

// -------------------------------------------------------------------------
// GET /api/v1/media
// Filterable, searchable, folder-aware, paginated media asset list
// -------------------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const {
      folder,
      folderId,
      type,
      search,
      unusedOnly,
      archived,
      sort = 'newest',
      page = '1',
      limit = '30',
    } = req.query;

    const where: any = {};

    if (archived === 'true') {
      where.isArchived = true;
    } else {
      where.isArchived = false;
    }

    if (folderId && folderId !== 'all') {
      where.folderId = folderId as string;
    } else if (folder && folder !== 'all') {
      where.folder = folder as string;
    }

    if (type && type !== 'all') {
      if (type === 'image') where.mimeType = { startsWith: 'image/' };
      else if (type === 'video') where.mimeType = { startsWith: 'video/' };
      else if (type === 'document') {
        where.OR = [
          { mimeType: { contains: 'pdf' } },
          { mimeType: { contains: 'word' } },
          { mimeType: { contains: 'officedocument' } },
          { mimeType: { contains: 'excel' } },
          { mimeType: { contains: 'sheet' } },
          { mimeType: { contains: 'text' } },
          { mimeType: { contains: 'presentation' } },
        ];
      }
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim();
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { originalName: { contains: q } },
            { filename: { contains: q } },
            { altText: { contains: q } },
            { caption: { contains: q } },
            { description: { contains: q } },
            { seoTitle: { contains: q } },
          ],
        },
      ];
    }

    if (unusedOnly === 'true') {
      where.mediausage = { none: {} };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    else if (sort === 'name_asc') orderBy = { originalName: 'asc' };
    else if (sort === 'name_desc') orderBy = { originalName: 'desc' };
    else if (sort === 'size_desc') orderBy = { size: 'desc' };
    else if (sort === 'size_asc') orderBy = { size: 'asc' };

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 30;
    const skip = (pageNum - 1) * limitNum;

    const [assets, total] = await Promise.all([
      prisma.mediaasset.findMany({
        where,
        include: {
          mediafolder: { select: { id: true, name: true, path: true } },
          mediausage: true,
          _count: { select: { mediausage: true } },
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.mediaasset.count({ where }),
    ]);

    const mapped = assets.map((a) => ({
      ...a,
      url: a.storageLocation,
      thumbnailUrl: a.thumbnailUrl || a.processedUrl || a.storageLocation,
      usageCount: a._count.mediausage,
    }));

    res.json({
      assets: mapped,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err: any) {
    console.error('Fetch media assets error:', err);
    res.status(500).json({ error: 'Failed to fetch media assets' });
  }
});

// -------------------------------------------------------------------------
// GET /api/v1/media/duplicates
// Detect exact file duplicates using SHA-256 hash
// -------------------------------------------------------------------------
router.get('/duplicates', authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const assetsWithHash = await prisma.mediaasset.findMany({
      where: { fileHash: { not: null }, isArchived: false },
      include: {
        mediafolder: { select: { id: true, name: true } },
        _count: { select: { mediausage: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const groups: Record<string, any[]> = {};
    assetsWithHash.forEach((asset) => {
      if (asset.fileHash) {
        if (!groups[asset.fileHash]) groups[asset.fileHash] = [];
        groups[asset.fileHash].push({
          ...asset,
          url: asset.storageLocation,
          thumbnailUrl: asset.thumbnailUrl || asset.storageLocation,
          usageCount: asset._count.mediausage,
        });
      }
    });

    const duplicateGroups = Object.entries(groups)
      .filter(([, list]) => list.length > 1)
      .map(([hash, files]) => ({
        hash,
        count: files.length,
        size: files[0].size,
        files,
      }));

    res.json(duplicateGroups);
  } catch (err: any) {
    console.error('Duplicates detection error:', err);
    res.status(500).json({ error: 'Failed to analyze duplicates' });
  }
});

// -------------------------------------------------------------------------
// GET /api/v1/media/:id
// Single media asset with full usage dependencies, versions, and SEO
// -------------------------------------------------------------------------
router.get('/:id', async (req, res) => {
  try {
    const asset = await prisma.mediaasset.findUnique({
      where: { id: req.params.id },
      include: {
        mediafolder: true,
        mediausage: true,
        mediaversion: { orderBy: { createdAt: 'desc' } },
        adminuser: { select: { id: true, name: true, email: true } },
      },
    });

    if (!asset) return res.status(404).json({ error: 'Media asset not found' });

    res.json({
      ...asset,
      url: asset.storageLocation,
      thumbnailUrl: asset.thumbnailUrl || asset.processedUrl || asset.storageLocation,
      usageCount: asset.mediausage.length,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch asset details' });
  }
});

// -------------------------------------------------------------------------
// POST /api/v1/media/upload
// Advanced upload with Sharp thumbnails, WebP conversion support & SHA-256 hash
// -------------------------------------------------------------------------
router.post(
  '/upload',
  authenticate,
  upload.array('files', 20),
  async (req: AuthRequest, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files provided for upload.' });
      }

      const folderId = req.body.folderId;
      let folderRecord: any = null;
      if (folderId && folderId !== 'all') {
        folderRecord = await prisma.mediafolder.findUnique({ where: { id: folderId } });
      }

      const folderName = folderRecord?.name || req.body.folder || 'Unsorted';
      const createdAssets = [];

      for (const file of files) {
        const fileHash = await getFileHash(file.path);

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const relativePath = `/uploads/media/${file.filename}`;
        const storageLocation = `${baseUrl}${relativePath}`;

        let width: number | null = null;
        let height: number | null = null;
        let thumbnailUrl: string | null = null;
        let isProcessed = false;

        // Process images with sharp (excluding SVG)
        if (file.mimetype.startsWith('image/') && file.mimetype !== 'image/svg+xml') {
          try {
            const metadata = await sharp(file.path).metadata();
            width = metadata.width || null;
            height = metadata.height || null;

            // Generate high-performance thumbnail
            const thumbFilename = `thumb_${file.filename}`;
            const thumbPath = path.join(THUMB_DIR, thumbFilename);
            await sharp(file.path)
              .resize(480, 360, { fit: 'cover', position: 'center' })
              .webp({ quality: 80 })
              .toFile(thumbPath);

            thumbnailUrl = `${baseUrl}/uploads/media/thumbnails/${thumbFilename}`;
            isProcessed = true;
          } catch (sharpErr: any) {
            console.warn('[Media Sharp Processor] notice:', sharpErr.message);
          }
        }

        // Generate friendly altText from original filename
        const baseNameNoExt = path.basename(file.originalname, path.extname(file.originalname));
        const autoAltText = baseNameNoExt.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

        const asset = await prisma.mediaasset.create({
          data: {
            id: uuidv4(),
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            width,
            height,
            folder: folderName,
            folderId: folderRecord?.id || null,
            altText: req.body.altText || autoAltText,
            caption: req.body.caption || null,
            description: req.body.description || null,
            seoTitle: req.body.seoTitle || autoAltText,
            seoDescription: req.body.seoDescription || null,
            storageLocation,
            thumbnailUrl,
            processedUrl: thumbnailUrl,
            isProcessed,
            fileHash,
            adminUserId: req.admin?.adminId || null,
          },
        });

        await logActivity({
          adminId: req.admin?.adminId,
          action: 'MEDIA_UPLOADED',
          resource: 'media',
          resourceId: asset.id,
          details: { filename: file.originalname, size: file.size, folder: folderName },
        });

        createdAssets.push({
          ...asset,
          url: storageLocation,
          thumbnailUrl: thumbnailUrl || storageLocation,
          usageCount: 0,
        });
      }

      res.status(201).json({
        success: true,
        count: createdAssets.length,
        assets: createdAssets,
      });
    } catch (err: any) {
      console.error('Upload media error:', err);
      res.status(500).json({ error: err.message || 'Media upload failed' });
    }
  }
);

// -------------------------------------------------------------------------
// PUT /api/v1/media/:id
// Update metadata, SEO attributes, tags, folder
// -------------------------------------------------------------------------
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const {
      originalName,
      altText,
      caption,
      description,
      seoTitle,
      seoDescription,
      folderId,
      folder,
      tags,
    } = req.body;

    let targetFolder = folder;
    if (folderId) {
      const f = await prisma.mediafolder.findUnique({ where: { id: folderId } });
      if (f) targetFolder = f.name;
    }

    const updated = await prisma.mediaasset.update({
      where: { id: req.params.id },
      data: {
        originalName: originalName !== undefined ? originalName : undefined,
        altText: altText !== undefined ? altText : undefined,
        caption: caption !== undefined ? caption : undefined,
        description: description !== undefined ? description : undefined,
        seoTitle: seoTitle !== undefined ? seoTitle : undefined,
        seoDescription: seoDescription !== undefined ? seoDescription : undefined,
        folderId: folderId !== undefined ? folderId : undefined,
        folder: targetFolder !== undefined ? targetFolder : undefined,
        tags: tags !== undefined ? tags : undefined,
      },
      include: {
        mediafolder: true,
        mediausage: true,
        _count: { select: { mediausage: true } },
      },
    });

    await logActivity({
      adminId: req.admin?.adminId,
      action: 'MEDIA_UPDATED',
      resource: 'media',
      resourceId: updated.id,
      details: { originalName: updated.originalName, altText: updated.altText },
    });

    res.json({
      ...updated,
      url: updated.storageLocation,
      thumbnailUrl: updated.thumbnailUrl || updated.storageLocation,
      usageCount: updated._count.mediausage,
    });
  } catch (err: any) {
    console.error('Update media error:', err);
    res.status(500).json({ error: 'Failed to update media asset' });
  }
});

// -------------------------------------------------------------------------
// POST /api/v1/media/:id/replace
// Safe Replacement System: backup current file into mediaversion, store replacement,
// preserve the exact same media ID and update website section references
// -------------------------------------------------------------------------
router.post(
  '/:id/replace',
  authenticate,
  upload.single('file'),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'Replacement file is required.' });

      const asset = await prisma.mediaasset.findUnique({
        where: { id: req.params.id },
        include: { mediausage: true, mediaversion: true },
      });
      if (!asset) return res.status(404).json({ error: 'Media asset not found.' });

      const newFile = req.file;
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const newRelativePath = `/uploads/media/${newFile.filename}`;
      const newStorageLocation = `${baseUrl}${newRelativePath}`;

      // 1. Record previous version in mediaversion
      const nextVersionNumber = asset.mediaversion.length + 1;
      await prisma.mediaversion.create({
        data: {
          id: uuidv4(),
          mediaId: asset.id,
          filename: asset.filename,
          storagePath: asset.storageLocation,
          size: asset.size,
          versionNumber: nextVersionNumber,
          createdById: req.admin?.adminId || null,
        },
      });

      // 2. Compute metadata for replacement
      let width: number | null = null;
      let height: number | null = null;
      let thumbnailUrl: string | null = null;

      if (newFile.mimetype.startsWith('image/') && newFile.mimetype !== 'image/svg+xml') {
        try {
          const meta = await sharp(newFile.path).metadata();
          width = meta.width || null;
          height = meta.height || null;

          const thumbFilename = `thumb_${newFile.filename}`;
          const thumbPath = path.join(THUMB_DIR, thumbFilename);
          await sharp(newFile.path)
            .resize(480, 360, { fit: 'cover' })
            .webp({ quality: 80 })
            .toFile(thumbPath);
          thumbnailUrl = `${baseUrl}/uploads/media/thumbnails/${thumbFilename}`;
        } catch (e) {}
      }

      const newHash = await getFileHash(newFile.path);

      // 3. Update media asset
      const updated = await prisma.mediaasset.update({
        where: { id: asset.id },
        data: {
          filename: newFile.filename,
          originalName: newFile.originalname,
          mimeType: newFile.mimetype,
          size: newFile.size,
          width,
          height,
          storageLocation: newStorageLocation,
          thumbnailUrl,
          processedUrl: thumbnailUrl,
          fileHash: newHash,
        },
      });

      // 4. Cascade URL update to all active page sections using the previous storage location
      await prisma.pagesection.updateMany({
        where: { backgroundImage: asset.storageLocation },
        data: { backgroundImage: newStorageLocation },
      });

      await logActivity({
        adminId: req.admin?.adminId,
        action: 'MEDIA_REPLACED',
        resource: 'media',
        resourceId: asset.id,
        details: {
          oldFilename: asset.filename,
          newFilename: newFile.filename,
          version: nextVersionNumber,
          affectedUsages: asset.mediausage.length,
        },
      });

      res.json({
        success: true,
        message: 'File replaced successfully with version history preserved.',
        asset: {
          ...updated,
          url: updated.storageLocation,
          thumbnailUrl: updated.thumbnailUrl || updated.storageLocation,
          usageCount: asset.mediausage.length,
        },
      });
    } catch (err: any) {
      console.error('Replace media error:', err);
      res.status(500).json({ error: 'Failed to replace media asset' });
    }
  }
);

// -------------------------------------------------------------------------
// POST /api/v1/media/:id/edit-image
// In-browser Image Transformations: Crop, Resize, Rotate, Flip, WebP conversion
// -------------------------------------------------------------------------
router.post('/:id/edit-image', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const {
      rotate = 0,
      flip = false,
      flop = false,
      width,
      height,
      crop, // { left, top, width, height }
      format = 'preserve', // 'preserve' | 'webp' | 'png' | 'jpeg'
      quality = 85,
      saveAsNew = false,
    } = req.body;

    const asset = await prisma.mediaasset.findUnique({ where: { id: req.params.id } });
    if (!asset) return res.status(404).json({ error: 'Media asset not found.' });

    const sourcePath = path.join(MEDIA_DIR, asset.filename);
    if (!fs.existsSync(sourcePath)) {
      return res.status(404).json({ error: 'Physical image file not found on disk.' });
    }

    let transformer = sharp(sourcePath);

    if (rotate) transformer = transformer.rotate(rotate);
    if (flip) transformer = transformer.flip();
    if (flop) transformer = transformer.flop();

    if (crop && crop.width && crop.height) {
      transformer = transformer.extract({
        left: Math.round(crop.left),
        top: Math.round(crop.top),
        width: Math.round(crop.width),
        height: Math.round(crop.height),
      });
    } else if (width || height) {
      transformer = transformer.resize({
        width: width ? parseInt(width, 10) : undefined,
        height: height ? parseInt(height, 10) : undefined,
        fit: 'inside',
      });
    }

    let outputExt = path.extname(asset.filename).toLowerCase();
    let outputMime = asset.mimeType;

    if (format === 'webp') {
      transformer = transformer.webp({ quality: parseInt(quality, 10) || 85 });
      outputExt = '.webp';
      outputMime = 'image/webp';
    } else if (format === 'jpeg' || format === 'jpg') {
      transformer = transformer.jpeg({ quality: parseInt(quality, 10) || 85 });
      outputExt = '.jpg';
      outputMime = 'image/jpeg';
    } else if (format === 'png') {
      transformer = transformer.png({ quality: parseInt(quality, 10) || 85 });
      outputExt = '.png';
      outputMime = 'image/png';
    }

    const newFilename = `edited_${uuidv4().slice(0, 8)}${outputExt}`;
    const destinationPath = path.join(MEDIA_DIR, newFilename);
    await transformer.toFile(destinationPath);

    const stats = fs.statSync(destinationPath);
    const newMeta = await sharp(destinationPath).metadata();
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const newStorageLocation = `${baseUrl}/uploads/media/${newFilename}`;

    // Thumbnail for edited image
    const thumbFilename = `thumb_${newFilename}`;
    const thumbPath = path.join(THUMB_DIR, thumbFilename);
    await sharp(destinationPath)
      .resize(480, 360, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(thumbPath);
    const thumbnailUrl = `${baseUrl}/uploads/media/thumbnails/${thumbFilename}`;

    const newHash = await getFileHash(destinationPath);

    if (saveAsNew) {
      // Create new asset
      const newAsset = await prisma.mediaasset.create({
        data: {
          id: uuidv4(),
          filename: newFilename,
          originalName: `edited_${asset.originalName}`,
          mimeType: outputMime,
          size: stats.size,
          width: newMeta.width || null,
          height: newMeta.height || null,
          folder: asset.folder,
          folderId: asset.folderId,
          altText: asset.altText,
          caption: asset.caption,
          description: asset.description,
          seoTitle: asset.seoTitle,
          seoDescription: asset.seoDescription,
          storageLocation: newStorageLocation,
          thumbnailUrl,
          processedUrl: thumbnailUrl,
          isProcessed: true,
          fileHash: newHash,
          adminUserId: req.admin?.adminId || null,
        },
      });

      return res.status(201).json({
        success: true,
        savedAsNew: true,
        asset: {
          ...newAsset,
          url: newAsset.storageLocation,
          thumbnailUrl,
          usageCount: 0,
        },
      });
    }

    // Overwrite existing with version snapshot
    await prisma.mediaversion.create({
      data: {
        id: uuidv4(),
        mediaId: asset.id,
        filename: asset.filename,
        storagePath: asset.storageLocation,
        size: asset.size,
        versionNumber: (await prisma.mediaversion.count({ where: { mediaId: asset.id } })) + 1,
        createdById: req.admin?.adminId || null,
      },
    });

    const updated = await prisma.mediaasset.update({
      where: { id: asset.id },
      data: {
        filename: newFilename,
        mimeType: outputMime,
        size: stats.size,
        width: newMeta.width || null,
        height: newMeta.height || null,
        storageLocation: newStorageLocation,
        thumbnailUrl,
        processedUrl: thumbnailUrl,
        fileHash: newHash,
      },
    });

    res.json({
      success: true,
      savedAsNew: false,
      asset: {
        ...updated,
        url: updated.storageLocation,
        thumbnailUrl,
      },
    });
  } catch (err: any) {
    console.error('Image editor error:', err);
    res.status(500).json({ error: 'Failed to process image transformation' });
  }
});

// -------------------------------------------------------------------------
// POST /api/v1/media/:id/link-usage
// Link media asset to a page or section
// -------------------------------------------------------------------------
router.post('/:id/link-usage', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { pageId, sectionId, blogId, contentType = 'section', location } = req.body;
    const existing = await prisma.mediausage.findFirst({
      where: {
        mediaId: req.params.id,
        sectionId: sectionId || null,
        pageId: pageId || null,
        blogId: blogId || null,
      },
    });

    if (existing) {
      return res.json({ success: true, usage: existing });
    }

    const usage = await prisma.mediausage.create({
      data: {
        id: uuidv4(),
        mediaId: req.params.id,
        pageId: pageId || null,
        sectionId: sectionId || null,
        blogId: blogId || null,
        contentType,
        location: location || 'Page Section',
      },
    });

    res.status(201).json({ success: true, usage });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to link media usage' });
  }
});

// -------------------------------------------------------------------------
// POST /api/v1/media/bulk-action
// Bulk move, delete, archive, tag, or ALT update
// -------------------------------------------------------------------------
router.post('/bulk-action', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { action, assetIds, targetFolderId, targetFolderName, altText, tags } = req.body;
    if (!Array.isArray(assetIds) || assetIds.length === 0) {
      return res.status(400).json({ error: 'assetIds must be a non-empty array' });
    }

    let successCount = 0;
    const errors: string[] = [];

    if (action === 'move') {
      let resolvedFolderName = targetFolderName;
      if (targetFolderId) {
        const folderRec = await prisma.mediafolder.findUnique({ where: { id: targetFolderId } });
        if (folderRec) resolvedFolderName = folderRec.name;
      }

      await prisma.mediaasset.updateMany({
        where: { id: { in: assetIds } },
        data: {
          folderId: targetFolderId || null,
          folder: resolvedFolderName || 'Unsorted',
        },
      });
      successCount = assetIds.length;
    } else if (action === 'archive') {
      await prisma.mediaasset.updateMany({
        where: { id: { in: assetIds } },
        data: { isArchived: true },
      });
      successCount = assetIds.length;
    } else if (action === 'restore') {
      await prisma.mediaasset.updateMany({
        where: { id: { in: assetIds } },
        data: { isArchived: false },
      });
      successCount = assetIds.length;
    } else if (action === 'delete') {
      for (const id of assetIds) {
        try {
          const asset = await prisma.mediaasset.findUnique({
            where: { id },
            include: { _count: { select: { mediausage: true } } },
          });
          if (asset) {
            // Unlink disk files safely
            const diskPath = path.join(MEDIA_DIR, asset.filename);
            if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath);

            await prisma.mediaasset.delete({ where: { id } });
            successCount++;
          }
        } catch (e: any) {
          errors.push(`Error deleting asset ${id}: ${e.message}`);
        }
      }
    } else if (action === 'update_alt' && altText !== undefined) {
      await prisma.mediaasset.updateMany({
        where: { id: { in: assetIds } },
        data: { altText },
      });
      successCount = assetIds.length;
    }

    await logActivity({
      adminId: req.admin?.adminId,
      action: 'MEDIA_BULK_ACTION',
      resource: 'media',
      details: { action, count: successCount, errors },
    });

    res.json({ success: true, processed: successCount, errors });
  } catch (err: any) {
    console.error('Bulk action error:', err);
    res.status(500).json({ error: 'Bulk action failed' });
  }
});

// -------------------------------------------------------------------------
// DELETE /api/v1/media/:id
// Safe Delete with usage verification warning check
// -------------------------------------------------------------------------
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { force = 'false' } = req.query;
    const asset = await prisma.mediaasset.findUnique({
      where: { id: req.params.id },
      include: {
        mediausage: true,
        _count: { select: { mediausage: true } },
      },
    });

    if (!asset) return res.status(404).json({ error: 'Asset not found' });

    // Protect active references unless force is true
    if (asset._count.mediausage > 0 && force !== 'true') {
      return res.status(400).json({
        error: `Cannot delete asset. It is actively referenced by ${asset._count.mediausage} section(s).`,
        usages: asset.mediausage,
      });
    }

    // Delete disk files
    const diskPath = path.join(MEDIA_DIR, asset.filename);
    if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath);

    if (asset.thumbnailUrl && asset.thumbnailUrl.includes('thumbnails/')) {
      const thumbFile = path.basename(asset.thumbnailUrl);
      const thumbDisk = path.join(THUMB_DIR, thumbFile);
      if (fs.existsSync(thumbDisk)) fs.unlinkSync(thumbDisk);
    }

    await prisma.mediaasset.delete({ where: { id: req.params.id } });

    await logActivity({
      adminId: req.admin?.adminId,
      action: 'MEDIA_DELETED',
      resource: 'media',
      resourceId: req.params.id,
      details: { filename: asset.filename, originalName: asset.originalName },
    });

    res.json({ success: true, message: 'Media asset deleted successfully.' });
  } catch (err: any) {
    console.error('Delete media error:', err);
    res.status(500).json({ error: 'Failed to delete media asset' });
  }
});

// -------------------------------------------------------------------------
// FOLDER MANAGEMENT
// -------------------------------------------------------------------------

// GET /api/v1/media/folders/all
router.get('/folders/all', async (_req, res) => {
  try {
    const folders = await prisma.mediafolder.findMany({
      include: {
        _count: { select: { mediaasset: true } },
      },
      orderBy: { name: 'asc' },
    });

    const mapped = folders.map((f) => ({
      ...f,
      assetCount: f._count.mediaasset,
    }));

    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

// POST /api/v1/media/folders
router.post('/folders', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, parentId } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Folder name is required.' });
    }

    const cleanName = name.trim();
    const existing = await prisma.mediafolder.findFirst({
      where: { name: cleanName, parentId: parentId || null },
    });
    if (existing) {
      return res.status(400).json({ error: 'A folder with this name already exists in this location.' });
    }

    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const folder = await prisma.mediafolder.create({
      data: {
        id: uuidv4(),
        name: cleanName,
        parentId: parentId || null,
        path: `/${slug}`,
        isRoot: !parentId,
      },
    });

    await logActivity({
      adminId: req.admin?.adminId,
      action: 'FOLDER_CREATED',
      resource: 'media',
      details: { folderName: cleanName },
    });

    res.status(201).json({ ...folder, assetCount: 0 });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create folder' });
  }
});

// PUT /api/v1/media/folders/:id
router.put('/folders/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Folder name is required.' });

    const cleanName = name.trim();
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    const folder = await prisma.mediafolder.update({
      where: { id: req.params.id },
      data: { name: cleanName, path: `/${slug}` },
    });

    // Cascade name update to mediaasset.folder
    await prisma.mediaasset.updateMany({
      where: { folderId: req.params.id },
      data: { folder: cleanName },
    });

    res.json(folder);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update folder' });
  }
});

// DELETE /api/v1/media/folders/:id
router.delete('/folders/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { targetMoveFolderId } = req.body || {};
    const folder = await prisma.mediafolder.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { mediaasset: true } } },
    });

    if (!folder) return res.status(404).json({ error: 'Folder not found.' });

    // If folder has assets, move them to target folder or Unsorted
    if (folder._count.mediaasset > 0) {
      let targetName = 'Unsorted';
      let targetId = targetMoveFolderId || null;

      if (targetMoveFolderId) {
        const dest = await prisma.mediafolder.findUnique({ where: { id: targetMoveFolderId } });
        if (dest) targetName = dest.name;
      }

      await prisma.mediaasset.updateMany({
        where: { folderId: folder.id },
        data: { folderId: targetId, folder: targetName },
      });
    }

    await prisma.mediafolder.delete({ where: { id: req.params.id } });

    await logActivity({
      adminId: req.admin?.adminId,
      action: 'FOLDER_DELETED',
      resource: 'media',
      details: { folderName: folder.name, movedAssetsTo: targetMoveFolderId || 'Unsorted' },
    });

    res.json({ success: true, message: 'Folder deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete folder' });
  }
});

export default router;
