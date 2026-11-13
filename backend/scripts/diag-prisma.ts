import { prisma } from '../src/utils/prisma';

(async () => {
  try {
    const sec = await prisma.pagesection.findFirst({ where: { sectionKey: 'hero' } });
    console.log('section found:', !!sec, sec?.id);
    if (!sec) return;
    const res = await prisma.pagesection.update({
      where: { id: sec.id },
      data: { draftData: JSON.stringify({ title: 'DIAG-TEST' }) },
    });
    console.log('UPDATE_OK draftData prefix:', res.draftData?.slice(0, 30));
  } catch (e: any) {
    console.log('ERROR:', e.message);
    if (e.meta) console.log('META:', JSON.stringify(e.meta));
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
})();
