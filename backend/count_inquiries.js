const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCounts() {
  const contactInquiries = await prisma.contactinquiry.count();
  const inquiryNotes = await prisma.inquirynote.count();
  const consultationRequests = await prisma.consultationrequest.count();
  const appointments = await prisma.appointment.count();
  const calendlyDeliveries = await prisma.calendlywebhookdelivery.count();

  console.log('Current Counts:');
  console.log(' - contactinquiry:', contactInquiries);
  console.log(' - inquirynote:', inquiryNotes);
  console.log(' - consultationrequest:', consultationRequests);
  console.log(' - appointment:', appointments);
  console.log(' - calendlywebhookdelivery:', calendlyDeliveries);
}

checkCounts().catch(console.error).finally(() => prisma.$disconnect());

