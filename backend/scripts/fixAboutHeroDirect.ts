import prisma from '../src/utils/prisma';

async function main() {
  const about = await prisma.websitepage.findUnique({ where: { slug: 'about' } });
  if (!about) { console.log('about page not found'); return; }

  const hero = await prisma.pagesection.findFirst({
    where: { pageId: about.id, sectionKey: 'hero' },
  });
  if (!hero) { console.log('hero section not found'); return; }

  let content: Record<string, any> = {};
  try { content = JSON.parse(hero.content || '{}'); } catch { content = {}; }

  // Authoritative real chart config the public renderer reads
  content.chart_about_performance = {
    displayMode: 'chart',
    title: 'Financial Performance Trend',
    subtitle: 'Quarterly Volume vs Advisory Value vs Turnaround SLA',
    chartType: 'line',
    dataPoints: [
      { label: 'Q1', value: 850 },
      { label: 'Q2', value: 1100 },
      { label: 'Q3', value: 920 },
      { label: 'Q4', value: 1450 },
    ],
    mediaUrl: '',
    altText: 'Financial Performance Trend',
  };

  // Remove stray top-level demo keys that confused the editor
  delete content.chartType;
  delete content.dataPoints;
  delete content.chartConfig;
  delete content.content; // accidental nested content key from prior API misuse

  await prisma.pagesection.update({
    where: { id: hero.id },
    data: {
      content: JSON.stringify(content),
      draftData: null,
      publishedAt: new Date(),
    },
  });

  console.log('hero content updated, keys:', Object.keys(content));
  console.log('chart_about_performance =', JSON.stringify(content.chart_about_performance));
}

main()
  .catch((e) => { console.error('ERROR', e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
