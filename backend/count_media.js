const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMedia() {
  console.log('mediaasset:', await prisma.mediaasset.count());
  console.log('mediafolder:', await prisma.mediafolder.count());
  console.log('mediausage:', await prisma.mediausage.count());
  console.log('mediaversion:', await prisma.mediaversion.count());
}

checkMedia().catch(console.error).finally(() => prisma.$disconnect());

