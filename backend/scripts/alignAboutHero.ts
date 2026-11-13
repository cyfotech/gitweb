import prisma from '../src/utils/prisma';

async function main() {
  const about = await prisma.websitepage.findUnique({ where: { slug: 'about' } });
  if (!about) { console.log('about page not found'); return; }

  const hero = await prisma.pagesection.findFirst({
    where: { pageId: about.id, sectionKey: 'hero' },
  });
  if (!hero) { console.log('hero section not found'); return; }

  // The public page visually renders these (its component-level defaults).
  // Sync the DB so the admin editor shows the exact same content.
  await prisma.pagesection.update({
    where: { id: hero.id },
    data: {
      title: 'Precision Meets Possibility',
      subheading: 'Firm Integrity & Leadership',
      draftData: null,
      publishedAt: new Date(),
    },
  });

  console.log('hero title synced to: Precision Meets Possibility');
}

main()
  .catch((e) => { console.error('ERROR', e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
