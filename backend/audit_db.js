const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.websitepage.findMany({
    include: { sections: true }
  });
  console.log('Total pages:', pages.length);
  for (const p of pages) {
    console.log(`Page: ${p.slug} (${p.title}) -> ${p.sections.length} sections`);
    for (const s of p.sections) {
      let k = 0;
      try {
        k = Object.keys(JSON.parse(s.content || '{}')).length;
      } catch (e) {}
      console.log(`  [${s.sectionKey}] ${s.title} (keys: ${k}, order: ${s.displayOrder})`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

