import prisma from '../src/utils/prisma';

async function main() {
  // Reproduce the exact (fixed) query from services.ts
  const services = await prisma.service.findMany({
    where: { isPublished: true },
    include: { servicecategory: true },
    orderBy: { displayOrder: 'asc' },
  });
  console.log(`OK: fetched ${services.length} published services`);
  if (services[0]) {
    console.log('first service:', services[0].name, '| category:', services[0].servicecategory?.name);
  }
  await prisma.$disconnect();
}

main()
  .catch(async (e) => {
    console.error('FAILED:', e.message);
    await prisma.$disconnect();
    process.exit(1);
  });
