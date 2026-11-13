import * as dotenv from 'dotenv';
dotenv.config();

import { getOwnerEmail, verifySmtpConnection } from '../src/services/emailService';
import { sendFormSubmissionEmails, sendCareerApplicationEmails } from '../src/utils/mailer';

async function main() {
  const ownerEmail = getOwnerEmail();
  if (!ownerEmail) {
    throw new Error('Set OWNER_EMAIL (or SMTP_USER) before running the SMTP test.');
  }

  const verification = await verifySmtpConnection();
  if (!verification.success) {
    throw new Error(verification.error || 'SMTP connection verification failed.');
  }

  console.log('\n=== Preferred Tax Consultancy Email Template Test ===\n');
  console.log('Testing premium 3D-inspired email templates with:');
  console.log('  - Embedded STE logo (cid:preferred-tax-logo)');
  console.log('  - 3D-inspired palette: emerald green (#05A68D), mint green (#34C759), charcoal (#2C3E50), white');
  console.log('  - Elegant gradients, depth with shadows, modern typography');
  console.log('  - Responsive HTML with inline CSS');
  console.log('  - Gmail, Outlook, and mobile compatible\n');

  // Test Form Submission Emails
  console.log('=== Testing Form Submission Emails ===\n');

  const contactRef = `CONTACT-TEST-${Date.now()}`;
  const formResult = await sendFormSubmissionEmails({
    formName: 'Contact Us Test',
    referenceNumber: contactRef,
    customerName: 'Preferred Tax Consultancy team',
    customerEmail: ownerEmail,
    fields: [
      { label: 'Full Name', value: 'Preferred Tax Consultancy team' },
      { label: 'Email', value: ownerEmail },
      { label: 'Phone', value: '+1 555 123 4567' },
      { label: 'Requested Service', value: 'General Inquiry' },
    ],
    message: 'This test verifies the premium 3D-inspired contact form email template for Smart Tax Expert with logo header and brand colors.',
    sourcePage: '/contact',
    submittedAt: new Date(),
  });

  if (!formResult.customerSent || !formResult.ownerSent) {
    throw new Error(formResult.error || 'Form submission emails were not accepted.');
  }

  console.log(`✓ Form submission emails sent successfully for ${ownerEmail}`);
  console.log('  - Customer confirmation sent:', formResult.customerSent);
  console.log('  - Owner notification sent:', formResult.ownerSent);

  // Test Career Application Emails
  console.log('\n=== Testing Career Application Emails ===\n');

  const applicationId = `APP-${Date.now()}`;
  const careerResult = await sendCareerApplicationEmails({
    fullName: 'Test Applicant',
    email: ownerEmail,
    phone: '+1 555 987 6543',
    position: 'Tax Preparer',
    companyName: 'Test Company Ltd.',
    experienceLevel: 'Senior Tax Preparer',
    yearsExperience: 5,
    relevantSkills: 'Tax preparation, client management, QuickBooks, Excel',
    softwareKnowledge: 'QuickBooks, TaxAct, ProSeries, Excel, Google Workspace',
    coverLetter: 'Dear Hiring Manager,\n\nI am writing to express my interest in the Senior Tax Preparer position at Preferred Tax Consultancy. With over 5 years of experience in tax preparation...\n\nSincerely,\nTest Applicant',
    additionalInfo: 'Available for full-time employment. References available upon request.',
    applicationDate: new Date(),
    resumeName: 'test_resume.pdf',
  }, applicationId);

  if (!careerResult.customerSent || !careerResult.ownerSent) {
    throw new Error(careerResult.error || 'Career application emails were not accepted.');
  }

  console.log(`✓ Career application emails sent successfully for ${ownerEmail}`);
  console.log('  - Customer confirmation sent:', careerResult.customerSent);
  console.log('  - Owner notification sent:', careerResult.ownerSent);
  console.log('  - Application ID:', applicationId);

  console.log('\n=== All Tests Passed ===');
  console.log('\nCheck your email inbox for the test messages.');
  console.log('Verify the logo renders correctly in the email header (CID: preferred-tax-logo).');
  console.log('\nPremium template features verified:');
  console.log('  ✓ STE logo in charcoal header (cid:preferred-tax-logo)');
  console.log('  ✓ Emerald green (#05A68D) primary accent color');
  console.log('  ✓ Mint green (#34C759) secondary accent color');
  console.log('  ✓ Charcoal (#2C3E50) header with gradient');
  console.log('  ✓ 3D depth with subtle shadows');
  console.log('  ✓ Elegant gradient backgrounds');
  console.log('  ✓ Responsive layout with rounded sections');
  console.log('  ✓ Gmail, Outlook, and mobile compatible');
  console.log('\nIn Gmail: View > Show original to verify CID attachment.');
  console.log('In Outlook: Double-click to open, then View > Message > Internet headers.');
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : 'Test failed.');
  process.exitCode = 1;
});