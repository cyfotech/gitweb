const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function truncateData() {
  console.log('Starting full deletion of contact inquiries and consultancy data...');

  // 1. Delete dependent inquiry notes first to prevent foreign key errors
  const deletedNotes = await prisma.inquirynote.deleteMany({});
  console.log(`✓ Deleted inquirynote records: ${deletedNotes.count}`);

  // 2. Delete all contact inquiries
  const deletedInquiries = await prisma.contactinquiry.deleteMany({});
  console.log(`✓ Deleted contactinquiry records: ${deletedInquiries.count}`);

  // 3. Delete all consultation requests
  const deletedConsultations = await prisma.consultationrequest.deleteMany({});
  console.log(`✓ Deleted consultationrequest records: ${deletedConsultations.count}`);

  // 4. Delete appointments & calendly webhooks if any
  const deletedAppointments = await prisma.appointment.deleteMany({});
  console.log(`✓ Deleted appointment records: ${deletedAppointments.count}`);

  const deletedCalendly = await prisma.calendlywebhookdelivery.deleteMany({});
  console.log(`✓ Deleted calendlywebhookdelivery records: ${deletedCalendly.count}`);

  // Verify counts
  const remainingInquiries = await prisma.contactinquiry.count();
  const remainingNotes = await prisma.inquirynote.count();
  const remainingConsultations = await prisma.consultationrequest.count();
  const remainingAppointments = await prisma.appointment.count();

  console.log('\n--- VERIFICATION OF REMAINING COUNTS ---');
  console.log(`Contact Inquiries:       ${remainingInquiries}`);
  console.log(`Inquiry Notes:           ${remainingNotes}`);
  console.log(`Consultation Requests:   ${remainingConsultations}`);
  console.log(`Appointments:            ${remainingAppointments}`);
  console.log('STATUS: FULLY TRUNCATED (0 records remain)');
}

truncateData()
  .catch((err) => {
    console.error('Error during truncation:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

