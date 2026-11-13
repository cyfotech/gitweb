import * as dotenv from 'dotenv';
dotenv.config();

import { getBrandContext, buildCustomerConfirmation } from '../src/services/emailTemplateService';

const brand = getBrandContext();
const html = buildCustomerConfirmation({
  customerName: 'Test',
  referenceNumber: 'TEST',
  submittedAt: '2024-01-01',
  applicationDetails: []
}, brand);

console.log('Gold (#C49A52) in customer HTML:', html.includes('#C49A52'));
console.log('\nSearching for BRAND constants in template:');
console.log('  mint:', html.includes('#22AF68'));
console.log('  mintLight:', html.includes('#35E092'));
console.log('  emerald:', html.includes('#079E85'));
console.log('  gold:', html.includes('#C49A52'));
console.log('  goldDark:', html.includes('#A9782D'));
console.log('  navy:', html.includes('#08151D'));
console.log('  textPrimary:', html.includes('#142D35'));
console.log('  textSecondary:', html.includes('#52656B'));
console.log('  textMuted:', html.includes('#718187'));
console.log('  bgMain:', html.includes('#F7FAF9'));
console.log('  bgCard:', html.includes('#FFFFFF'));
console.log('  borderLight:', html.includes('#DCE7E4'));