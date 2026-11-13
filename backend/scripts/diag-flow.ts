import { prisma } from '../src/utils/prisma';
import { v4 as uuidv4 } from 'uuid';

(async () => {
  const id = 'd1e998c8-b37b-4d39-bf28-79be193ad51e'; // live hero (public endpoint)
  try {
    const current = await prisma.pagesection.findUnique({ where: { id } });
    console.log('current found:', !!current, 'draftData?', current?.draftData?.slice(0, 20));
    if (!current) return;

    // mimic snapshot build + applyFields (just title)
    const snapshot: Record<string, any> = {
      title: current.title, subheading: current.subheading, description: current.description,
      backgroundImage: current.backgroundImage, backgroundVideo: current.backgroundVideo,
      imagePosition: current.imagePosition, imageAltText: current.imageAltText,
      content: {},
    };
    if (current.content) { try { snapshot.content = JSON.parse(current.content); } catch { snapshot.content = { text: current.content }; } }
    snapshot.title = 'DIAG-FLOW-TEST';

    await prisma.pagesection.update({ where: { id }, data: { draftData: JSON.stringify(snapshot) } });
    console.log('step1 update OK');

    await prisma.contentrevision.create({
      data: {
        id: uuidv4(), sectionId: id,
        previousData: { draftData: current.draftData || null },
        newData: snapshot,
        changeType: 'draft_save',
        changeNotes: 'DIAG', adminUserId: null,
      },
    });
    console.log('step2 revision OK');
  } catch (e: any) {
    console.log('ERROR at:', e.message);
    if (e.meta) console.log('META:', JSON.stringify(e.meta));
  } finally {
    // cleanup the diagnostic draft
    try {
      await prisma.pagesection.update({ where: { id }, data: { draftData: null } });
    } catch {}
    await prisma.$disconnect();
    process.exit(0);
  }
})();
