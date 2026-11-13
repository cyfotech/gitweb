const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function truncateMedia() {
  console.log('--- STARTING MEDIA LIBRARY TRUNCATION ---');

  // 1. Delete media usage tracking
  const deletedUsage = await prisma.mediausage.deleteMany({});
  console.log(`✓ Deleted mediausage records: ${deletedUsage.count}`);

  // 2. Delete media versions
  const deletedVersions = await prisma.mediaversion.deleteMany({});
  console.log(`✓ Deleted mediaversion records: ${deletedVersions.count}`);

  // 3. Delete media assets
  const deletedAssets = await prisma.mediaasset.deleteMany({});
  console.log(`✓ Deleted mediaasset records: ${deletedAssets.count}`);

  // 4. Delete media folders
  // First nullify self-referencing parentId to avoid FK constraints
  await prisma.mediafolder.updateMany({
    data: { parentId: null },
  });
  const deletedFolders = await prisma.mediafolder.deleteMany({});
  console.log(`✓ Deleted mediafolder records: ${deletedFolders.count}`);

  // 5. Clean up uploaded physical files in backend/uploads directory while preserving folder structures
  const UPLOAD_DIR = path.resolve(__dirname, 'uploads');
  const MEDIA_DIR = path.join(UPLOAD_DIR, 'media');
  const THUMB_DIR = path.join(MEDIA_DIR, 'thumbnails');
  const VERSIONS_DIR = path.join(MEDIA_DIR, 'versions');

  let cleanedFilesCount = 0;
  function cleanDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        cleanDirectory(fullPath);
      } else {
        try {
          fs.unlinkSync(fullPath);
          cleanedFilesCount++;
        } catch (e) {
          console.warn(`Could not delete file ${fullPath}: ${e.message}`);
        }
      }
    }
  }

  cleanDirectory(UPLOAD_DIR);
  console.log(`✓ Cleaned ${cleanedFilesCount} physical uploaded files from disk.`);

  // Ensure base upload subdirectories exist for future uploads
  [UPLOAD_DIR, MEDIA_DIR, THUMB_DIR, VERSIONS_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // Verify remaining counts
  const assetCount = await prisma.mediaasset.count();
  const folderCount = await prisma.mediafolder.count();
  const usageCount = await prisma.mediausage.count();
  const versionCount = await prisma.mediaversion.count();

  console.log('\n--- VERIFICATION OF REMAINING MEDIA RECORDS ---');
  console.log(`mediaasset:     ${assetCount}`);
  console.log(`mediafolder:    ${folderCount}`);
  console.log(`mediausage:     ${usageCount}`);
  console.log(`mediaversion:   ${versionCount}`);
  console.log('STATUS: MEDIA LIBRARY FULLY TRUNCATED (0 records remain)');
}

truncateMedia()
  .catch((err) => {
    console.error('Error during media truncation:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

