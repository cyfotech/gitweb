const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.websitepage.findMany({
    include: { pagesection: true }
  });
  console.log('Total pages:', pages.length);
  for (const p of pages) {
    console.log(`Page: ${p.slug} (${p.title}) -> ${p.pagesection.length} sections`);
    for (const s of p.pagesection) {
      let k = 0;
      let sampleKeys = [];
      try {
        const obj = JSON.parse(s.content || '{}');
        sampleKeys = Object.keys(obj);
        k = sampleKeys.length;
      } catch (e) {}
      console.log(`  [${s.sectionKey}] "${s.title}" (keys: ${k}, sample: ${sampleKeys.slice(0, 4).join(', ')})`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
