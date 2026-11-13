import * as dotenv from 'dotenv';
dotenv.config();

import { getBrandContext, buildCustomerConfirmation, buildCareerApplicationConfirmation, buildOwnerNotification } from '../src/services/emailTemplateService';

console.log('=== Email Template Verification ===\n');

// Check brand context
const brand = getBrandContext();
console.log('Brand Context:');
console.log('  businessName:', brand.businessName);
console.log('  logoUrl:', brand.logoUrl);
console.log();

// Logo attachment is configured in emailService.ts with:
// - filename: 'preferred-tax-consultancy-logo.png'
// - path: ../../../frontend/public/assets/aistudio/ste_logo_light.png
// - cid: 'preferred-tax-logo'
console.log('Logo Attachment (from emailService.ts):');
console.log('  filename: preferred-tax-consultancy-logo.png');
console.log('  cid: preferred-tax-logo');
console.log('  path: frontend/public/assets/aistudio/ste_logo_light.png (relative to backend/)');
console.log();

// Generate sample HTML and verify key elements
const customerHtml = buildCustomerConfirmation({
  customerName: 'Test User',
  referenceNumber: 'TEST-123',
  position: 'Tax Consultant',
  submittedAt: '2024-01-15T10:00:00.000Z',
  applicationDetails: [
    { label: 'Position', value: 'Tax Consultant' },
    { label: 'Years Experience', value: '5' }
  ],
  coverLetter: 'This is a test cover letter.',
  nextSteps: 'Our team will contact you within 24 hours.'
}, brand);

const ownerHtml = buildOwnerNotification({
  referenceNumber: 'TEST-456',
  sourcePage: '/contact',
  formName: 'Contact Form',
  fields: [
    { label: 'Full Name', value: 'John Doe' },
    { label: 'Email', value: 'john@example.com' }
  ]
}, brand);

const careerHtml = buildCareerApplicationConfirmation({
  customerName: 'Jane Smith',
  referenceNumber: 'APP-789',
  position: 'Accountant',
  submittedAt: '2024-01-15T10:00:00.000Z',
  applicationDetails: [
    { label: 'Position', value: 'Accountant' },
    { label: 'Years of Experience', value: '7' }
  ]
}, brand);

console.log('=== HTML Template Verification ===\n');

// Customer confirmation checks
console.log('Customer Confirmation Template:');
console.log('  Logo CID reference:', customerHtml.includes('cid:preferred-tax-logo') ? '✓ YES' : '✗ NO');
console.log('  Mint teal (#22AF68):', customerHtml.includes('#22AF68') ? '✓ YES' : '✗ NO');
console.log('  Emerald (#079E85):', customerHtml.includes('#079E85') ? '✓ YES' : '✗ NO');
console.log('  Navy header (#08151D):', customerHtml.includes('#08151D') ? '✓ YES' : '✗ NO');
console.log('  Gold accent (#C49A52):', customerHtml.includes('#C49A52') ? '✓ YES' : '✗ NO');
console.log('  Responsive meta viewport:', customerHtml.includes('viewport') ? '✓ YES' : '✗ NO');
console.log('  DOCTYPE html:', customerHtml.includes('<!DOCTYPE html>') ? '✓ YES' : '✗ NO');
console.log();

// Owner notification checks
console.log('Owner Notification Template:');
console.log('  Logo CID reference:', ownerHtml.includes('cid:preferred-tax-logo') ? '✓ YES' : '✗ NO');
console.log('  Mint teal (#22AF68):', ownerHtml.includes('#22AF68') ? '✓ YES' : '✗ NO');
console.log();

// Career application checks
console.log('Career Application Template:');
console.log('  Logo CID reference:', careerHtml.includes('cid:preferred-tax-logo') ? '✓ YES' : '✗ NO');
console.log('  Mint teal (#22AF68):', careerHtml.includes('#22AF68') ? '✓ YES' : '✗ NO');
console.log('  Responsive meta viewport:', careerHtml.includes('viewport') ? '✓ YES' : '✗ NO');
console.log();

// Print sample HTML snippet for visual verification
console.log('=== Sample HTML Snippet (first 1000 chars) ===\n');
const snippet = customerHtml.substring(0, 1000);
console.log(snippet);
console.log('...\n');

console.log('=== Verification Complete ===');
console.log('\nLogo file location check:');
const fs = require('fs');
const path = require('path');
const frontendLogoPath = path.resolve(__dirname, '../../frontend/public/assets/aistudio/ste_logo_light.png');

console.log('  frontend/public/assets/aistudio/ste_logo_light.png:', fs.existsSync(frontendLogoPath) ? '✓ EXISTS' : '✗ MISSING');