const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const settings = await prisma.globalsetting.findMany();
  console.log('Global settings count:', settings.length);
  for (const s of settings) {
    let preview = String(s.value);
    try {
      const parsed = JSON.parse(s.value);
      preview = Array.isArray(parsed) ? `Array(${parsed.length})` : `Object(${Object.keys(parsed).length} keys)`;
    } catch (e) {
      preview = preview.slice(0, 30);
    }
    console.log(` - [${s.category || 'general'}] ${s.key}: ${preview}`);
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());
