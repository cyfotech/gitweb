import * as dotenv from 'dotenv';
dotenv.config();

import { getBrandContext, buildCustomerConfirmation, buildOwnerNotification } from '../src/services/emailTemplateService';
import * as fs from 'fs';
import * as path from 'path';

const brand = getBrandContext();

console.log('=== New Premium 3D Email Template Verification ===\n');

// Generate sample HTML
const customerHtml = buildCustomerConfirmation({
  customerName: 'John Doe',
  referenceNumber: 'CONTACT-12345',
  serviceName: 'Tax Consultation',
  submittedAt: '2024-01-15 10:30:00',
  message: 'I would like to schedule a tax consultation for my small business.',
  nextSteps: 'Our team will contact you within 4 business hours to schedule your consultation.',
}, brand);

const ownerHtml = buildOwnerNotification({
  referenceNumber: 'CONTACT-12345',
  formName: 'Contact Us',
  sourcePage: '/contact',
  fields: [
    { label: 'Full Name', value: 'John Doe' },
    { label: 'Email', value: 'john@example.com' },
    { label: 'Phone', value: '+1 555 123 4567' },
    { label: 'Requested Service', value: 'Tax Consultation' },
  ],
  message: 'I would like to schedule a tax consultation for my small business.',
}, brand);

console.log('Brand Colors (3D-inspired palette):');
console.log('  Emerald (#05A68D):', customerHtml.includes('#05A68D') ? '✓ YES' : '✗ NO');
console.log('  Mint (#34C759):', customerHtml.includes('#34C759') ? '✓ YES' : '✗ NO');
console.log('  Charcoal (#2C3E50):', customerHtml.includes('#2C3E50') ? '✓ YES' : '✗ NO');
console.log('  White (#FFFFFF):', customerHtml.includes('#FFFFFF') ? '✓ YES' : '✗ NO');
console.log();

console.log('Premium Design Elements:');
console.log('  Logo CID reference:', customerHtml.includes('cid:preferred-tax-logo') ? '✓ YES' : '✗ NO');
console.log('  Gradient background:', customerHtml.includes('linear-gradient') ? '✓ YES' : '✗ NO');
console.log('  Box shadow:', customerHtml.includes('box-shadow') ? '✓ YES' : '✗ NO');
console.log('  Rounded borders (border-radius):', customerHtml.includes('border-radius') ? '✓ YES' : '✗ NO');
console.log('  Responsive viewport:', customerHtml.includes('viewport') ? '✓ YES' : '✗ NO');
console.log('  DOCTYPE HTML:', customerHtml.includes('<!DOCTYPE html>') ? '✓ YES' : '✗ NO');
console.log();

console.log('Owner Notification Template:');
console.log('  Emerald color:', ownerHtml.includes('#05A68D') ? '✓ YES' : '✗ NO');
console.log('  Box shadow:', ownerHtml.includes('box-shadow') ? '✓ YES' : '✗ NO');
console.log('  Logo CID reference:', ownerHtml.includes('cid:preferred-tax-logo') ? '✓ YES' : '✗ NO');
console.log();

// Save sample HTML for visual inspection
const outputPath = path.join(__dirname, '../output/sample-email.html');
try {
  fs.writeFileSync(outputPath, customerHtml);
  console.log('Sample HTML saved to: backend/output/sample-email.html');
} catch (e) {
  console.log('Could not save HTML file (directory may not exist)');
}

console.log('\n=== Verification Complete ===');

// Verify logo file exists
const frontendLogoPath = path.resolve(__dirname, '../../frontend/public/assets/aistudio/ste_logo_light.png');
console.log('\nLogo file check:');
console.log('  frontend/public/assets/aistudio/ste_logo_light.png:', fs.existsSync(frontendLogoPath) ? '✓ EXISTS' : '✗ MISSING');