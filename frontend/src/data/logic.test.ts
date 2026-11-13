import test from 'node:test';
import assert from 'node:assert/strict';
import { getServicesByCategory, SERVICES_CATALOG, CLIENT_CATEGORIES } from './services';
import { calculateCpaOutsourcingRoi, calculateFederalIndividualTax, calculateBusinessTaxOptimization } from './taxCalculator';
import { BLOG_POSTS } from './blog';

test('client category service filtering returns exact matching category offerings', () => {
  const cpaServices = getServicesByCategory('cpa');
  assert.equal(cpaServices.length, 10, 'Must have exactly 10 CPA Outsourcing offerings');
  assert.ok(cpaServices.every((s) => s.category === 'cpa'), 'All CPA services must have category cpa');

  const indServices = getServicesByCategory('individual');
  assert.equal(indServices.length, 4, 'Must have 4 Individual / Family services');
  assert.ok(indServices.every((s) => s.category === 'individual'));

  const bizServices = getServicesByCategory('business');
  assert.equal(bizServices.length, 6, 'Must have 6 Company / Business services');
  assert.ok(bizServices.every((s) => s.category === 'business'));

  assert.equal(SERVICES_CATALOG.length, 20, 'Catalog total must be 20 verified services');
});

test('cpa outsourcing ROI calculation computes accurate savings and margins', () => {
  const result = calculateCpaOutsourcingRoi({
    hoursPerMonth: 160,
    domesticHourlyRate: 85,
    offshoreHourlyRate: 28,
    domesticOverheadPercentage: 15
  });

  // Fully loaded domestic = 85 * 1.15 = 97.75 -> 160 * 97.75 = 15640
  assert.equal(result.monthlyDomesticCost, 15640);
  // Offshore = 160 * 28 = 4480
  assert.equal(result.monthlyOffshoreCost, 4480);
  assert.equal(result.monthlySavings, 11160);
  assert.equal(result.annualSavings, 133920);
  assert.ok(result.savingsPercentage > 70 && result.savingsPercentage < 72);
  assert.equal(result.hoursRecoveredAnnual, 1920);
  assert.equal(result.monthlyBreakdown.length, 12);
  assert.equal(result.monthlyBreakdown[11].cumulativeSavings, 133920);
});

test('individual tax calculation properly applies 2025 standard deduction and brackets', () => {
  const zeroTax = calculateFederalIndividualTax(14000, 'single');
  assert.equal(zeroTax.totalTax, 0, 'Income below $15,000 standard deduction should have $0 federal tax');

  const moderateTax = calculateFederalIndividualTax(50000, 'single');
  // Taxable = 50,000 - 15,000 = 35,000
  // First bracket (0 to 11,925 at 10%): $1,192.50
  // Second bracket (11,925 to 35,000 at 12%): 23,075 * 0.12 = $2,769
  // Total = 1192.5 + 2769 = 3961.5 -> Math.round = 3962
  assert.equal(moderateTax.totalTax, 3962);
  assert.ok(moderateTax.effectiveRate > 7 && moderateTax.effectiveRate < 9);
});

test('business tax calculation applies Section 179 and QBI correctly', () => {
  const res = calculateBusinessTaxOptimization({
    grossRevenue: 500000,
    operatingExpenses: 200000,
    equipmentInvestment: 50000,
    entityType: 'scorp'
  });

  // Net operating income = 300,000
  assert.equal(res.netOperatingIncome, 300000);
  assert.equal(res.section179Deduction, 50000);
  // Remaining income after depreciation = 250,000. QBI 20% = 50,000
  assert.equal(res.section199aQbiDeduction, 50000);
  assert.equal(res.taxableBase, 200000);
  assert.ok(res.totalTaxSaved > 0);
});

test('blog articles always have an internal detail route', () => {
  assert.ok(BLOG_POSTS.length > 0);
  const slugs = BLOG_POSTS.map((post) => post.slug);
  assert.equal(new Set(slugs).size, slugs.length, 'Article detail slugs must be unique');
  for (const slug of slugs) {
    assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  }
});
