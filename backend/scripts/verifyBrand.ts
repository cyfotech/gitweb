import * as dotenv from 'dotenv';
dotenv.config();

import { getBrandContext, buildCustomerConfirmation } from '../src/services/emailTemplateService';

const brand = getBrandContext();
console.log('Brand Context:');
console.log('  Business Name:', brand.businessName);
console.log('  Logo URL:', brand.logoUrl);

const html = buildCustomerConfirmation({
  customerName: 'Test User',
  referenceNumber: 'TEST-123',
  submittedAt: '2024-01-01',
  nextSteps: 'Test next steps.',
}, brand);

console.log('\nTemplate verification:');
console.log('  Business name "Smart Tax Expert" in HTML:', html.includes('Smart Tax Expert') ? '✓ YES' : '✗ NO');
console.log('  Tagline "Tax Expert" in HTML:', html.includes('Tax Expert') ? '✓ YES' : '✗ NO');
console.log('  Emerald green (#05A68D):', html.includes('#05A68D') ? '✓ YES' : '✗ NO');
console.log('  Mint green (#34C759):', html.includes('#34C759') ? '✓ YES' : '✗ NO');
console.log('  Charcoal (#2C3E50):', html.includes('#2C3E50') ? '✓ YES' : '✗ NO');
console.log('  Logo CID (preferred-tax-logo):', html.includes('cid:preferred-tax-logo') ? '✓ YES' : '✗ NO');
console.log('  Text-shadow removed from footer:', !html.includes('text-shadow:0 1px 1px rgba(0,0,0,0.05)') ? '✓ YES' : '✗ NO');

console.log('\n=== Done ===');