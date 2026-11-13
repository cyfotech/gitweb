import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  calculateUsIncomeTax, 
  FEDERAL_BRACKETS_2025, 
  FEDERAL_BRACKETS_2024,
  STANDARD_DEDUCTIONS_BASE_2025,
  SUPPORTED_STATE_TAX_RULES,
  SUPPORTED_LOCAL_TAX_RULES
} from './usTaxCalculatorEngine';

test('Tax Year 2025: Single filer with income under standard deduction owes $0 federal tax', () => {
  const res = calculateUsIncomeTax({
    taxYear: 2025,
    filingStatus: 'single',
    stateOfResidence: 'TX',
    taxpayerAge: 32,
    qualifyingChildrenUnder17: 0,
    otherDependents: 0,
    wages: 14500,
    selfEmploymentIncome: 0,
    taxableInterest: 0,
    ordinaryDividends: 0,
    qualifiedDividends: 0,
    longTermCapitalGains: 0,
    shortTermCapitalGains: 0,
    rentalAndPassiveIncome: 0,
    otherIncome: 0,
    deductionMethod: 'standard',
    federalWithholding: 500,
    stateWithholding: 0,
    estimatedTaxPayments: 0
  });

  assert.equal(res.totalGrossIncome, 14500);
  assert.equal(res.standardDeductionAllowed, 15000);
  assert.equal(res.totalTaxableIncome, 0);
  assert.equal(res.ordinaryIncomeTax, 0);
  assert.equal(res.netFederalTaxLiability, 0);
  assert.equal(res.stateTaxLiability, 0, 'Texas has no personal wage tax');
  assert.equal(res.refundOrBalanceDue, 500, 'Full withholding refunded');
  assert.equal(res.isRefund, true);
});

test('Tax Year 2025: Single filer $60,000 W-2 applies exact 10% and 12% brackets', () => {
  const res = calculateUsIncomeTax({
    taxYear: 2025,
    filingStatus: 'single',
    stateOfResidence: 'TX',
    taxpayerAge: 29,
    qualifyingChildrenUnder17: 0,
    otherDependents: 0,
    wages: 60000,
    selfEmploymentIncome: 0,
    taxableInterest: 0,
    ordinaryDividends: 0,
    qualifiedDividends: 0,
    longTermCapitalGains: 0,
    shortTermCapitalGains: 0,
    rentalAndPassiveIncome: 0,
    otherIncome: 0,
    deductionMethod: 'standard',
    federalWithholding: 5500,
    stateWithholding: 0,
    estimatedTaxPayments: 0
  });

  // Gross = 60,000. Standard deduction = 15,000. Taxable = 45,000.
  // 10% on first $11,925 = $1,192.50
  // 12% on remaining ($45,000 - $11,925 = $33,075) = $3,969.00
  // Total ordinary tax = 1,192.50 + 3,969.00 = $5,161.50
  assert.equal(res.totalTaxableIncome, 45000);
  assert.equal(res.ordinaryIncomeTax, 5161.5);
  assert.equal(res.netFederalTaxLiability, 5161.5);
  assert.equal(res.marginalFederalRate, 12);
  assert.equal(res.refundOrBalanceDue, 338.5); // 5500 - 5161.5 = 338.5
});

test('Tax Year 2025: Senior 65+ receives additional standard deduction ($2,000)', () => {
  const res = calculateUsIncomeTax({
    taxYear: 2025,
    filingStatus: 'single',
    stateOfResidence: 'FL',
    taxpayerAge: 67, // 65+
    qualifyingChildrenUnder17: 0,
    otherDependents: 0,
    wages: 50000,
    selfEmploymentIncome: 0,
    taxableInterest: 0,
    ordinaryDividends: 0,
    qualifiedDividends: 0,
    longTermCapitalGains: 0,
    shortTermCapitalGains: 0,
    rentalAndPassiveIncome: 0,
    otherIncome: 0,
    deductionMethod: 'standard',
    federalWithholding: 3000,
    stateWithholding: 0,
    estimatedTaxPayments: 0
  });

  // Base $15,000 + $2,000 senior = $17,000
  assert.equal(res.standardDeductionAllowed, 17000);
  assert.equal(res.totalTaxableIncome, 33000);
});

test('Tax Year 2025: Married Filing Jointly $150,000 with 2 children applies CTC', () => {
  const res = calculateUsIncomeTax({
    taxYear: 2025,
    filingStatus: 'married_joint',
    stateOfResidence: 'TX',
    taxpayerAge: 38,
    spouseAge: 36,
    qualifyingChildrenUnder17: 2,
    otherDependents: 0,
    wages: 150000,
    selfEmploymentIncome: 0,
    taxableInterest: 0,
    ordinaryDividends: 0,
    qualifiedDividends: 0,
    longTermCapitalGains: 0,
    shortTermCapitalGains: 0,
    rentalAndPassiveIncome: 0,
    otherIncome: 0,
    deductionMethod: 'standard',
    federalWithholding: 12000,
    stateWithholding: 0,
    estimatedTaxPayments: 0
  });

  // Standard deduction MFJ 2025 = $30,000
  // Taxable = $120,000
  // 10% on $23,850 = $2,385
  // 12% on ($96,950 - $23,850 = $73,100) = $8,772
  // 22% on ($120,000 - $96,950 = $23,050) = $5,071
  // Total tax before credits = 2385 + 8772 + 5071 = $16,228
  assert.equal(res.ordinaryIncomeTax, 16228);
  // Child Tax Credit for 2 children = $4,000 (AGI $150k is well under $400k MFJ phaseout)
  assert.equal(res.childTaxCredit, 4000);
  assert.equal(res.netFederalTaxLiability, 12228);
});

test('Self-Employment tax calculates 15.3% on 92.35% and allows 50% above-the-line deduction', () => {
  const res = calculateUsIncomeTax({
    taxYear: 2025,
    filingStatus: 'single',
    stateOfResidence: 'NV',
    taxpayerAge: 35,
    qualifyingChildrenUnder17: 0,
    otherDependents: 0,
    wages: 0,
    selfEmploymentIncome: 100000,
    taxableInterest: 0,
    ordinaryDividends: 0,
    qualifiedDividends: 0,
    longTermCapitalGains: 0,
    shortTermCapitalGains: 0,
    rentalAndPassiveIncome: 0,
    otherIncome: 0,
    deductionMethod: 'standard',
    federalWithholding: 0,
    stateWithholding: 0,
    estimatedTaxPayments: 20000
  });

  // Net SE income = 100,000 * 0.9235 = 92,350
  // SS tax = 92,350 * 0.124 = 11,451.40
  // Medicare tax = 92,350 * 0.029 = 2,678.15
  // Total SE tax = 14,129.55
  assert.equal(res.selfEmploymentTax, 14129.55);
  // 50% SE deduction = 7,064.78
  assert.equal(res.adjustmentsToIncome, 7064.78);
  assert.equal(res.adjustedGrossIncome, 92935.22);
});

test('Long-Term Capital Gains receive 0% and 15% preferential rate treatment', () => {
  const res = calculateUsIncomeTax({
    taxYear: 2025,
    filingStatus: 'single',
    stateOfResidence: 'WY',
    taxpayerAge: 40,
    qualifyingChildrenUnder17: 0,
    otherDependents: 0,
    wages: 30000,
    selfEmploymentIncome: 0,
    taxableInterest: 0,
    ordinaryDividends: 0,
    qualifiedDividends: 0,
    longTermCapitalGains: 40000,
    shortTermCapitalGains: 0,
    rentalAndPassiveIncome: 0,
    otherIncome: 0,
    deductionMethod: 'standard',
    federalWithholding: 0,
    stateWithholding: 0,
    estimatedTaxPayments: 5000
  });

  // Total Gross = 70,000. Std deduction = 15,000.
  // Total Taxable = 55,000.
  // Ordinary taxable = 30,000 - 15,000 = 15,000.
  // Preferential taxable = 40,000.
  // Ordinary tax on 15,000:
  // 10% on 11,925 = 1,192.50
  // 12% on (15,000 - 11,925 = 3,075) = 369.00 -> $1,561.50
  assert.equal(res.ordinaryIncomeTax, 1561.5);

  // Capital gains span from $15,000 to $55,000.
  // 2025 single 0% threshold is $48,350.
  // 0% bracket span: $48,350 - $15,000 = $33,350 @ 0% = $0.
  // 15% bracket span: $55,000 - $48,350 = $6,650 @ 15% = $997.50.
  assert.equal(res.preferentialIncomeTax, 997.5);
  assert.equal(res.federalIncomeTaxBeforeCredits, 2559);
});

test('High-income earner triggers Additional Medicare Tax (0.9%) and NIIT (3.8%)', () => {
  const res = calculateUsIncomeTax({
    taxYear: 2025,
    filingStatus: 'single',
    stateOfResidence: 'FL',
    taxpayerAge: 45,
    qualifyingChildrenUnder17: 0,
    otherDependents: 0,
    wages: 300000,
    selfEmploymentIncome: 0,
    taxableInterest: 50000,
    ordinaryDividends: 0,
    qualifiedDividends: 0,
    longTermCapitalGains: 0,
    shortTermCapitalGains: 0,
    rentalAndPassiveIncome: 0,
    otherIncome: 0,
    deductionMethod: 'standard',
    federalWithholding: 80000,
    stateWithholding: 0,
    estimatedTaxPayments: 0
  });

  // Threshold for single is $200,000.
  // Wages = $300,000 -> excess = $100,000. Additional Medicare = 100,000 * 0.009 = $900.
  assert.equal(res.additionalMedicareTax, 900);
  // AGI = $350,000. Excess over $200,000 = $150,000.
  // Net investment income = $50,000 interest.
  // NIIT base = min(50,000, 150,000) = $50,000.
  // NIIT = 50,000 * 0.038 = $1,900.
  assert.equal(res.netInvestmentIncomeTax, 1900);
});

test('State & Local Taxes: Pennsylvania flat 3.07% + Philadelphia 3.75%', () => {
  const res = calculateUsIncomeTax({
    taxYear: 2025,
    filingStatus: 'single',
    stateOfResidence: 'PA',
    locality: 'PHILA',
    taxpayerAge: 30,
    qualifyingChildrenUnder17: 0,
    otherDependents: 0,
    wages: 100000,
    selfEmploymentIncome: 0,
    taxableInterest: 0,
    ordinaryDividends: 0,
    qualifiedDividends: 0,
    longTermCapitalGains: 0,
    shortTermCapitalGains: 0,
    rentalAndPassiveIncome: 0,
    otherIncome: 0,
    deductionMethod: 'standard',
    federalWithholding: 15000,
    stateWithholding: 3070,
    estimatedTaxPayments: 3750
  });

  // PA flat 3.07% on $100,000 = $3,070
  assert.equal(res.stateTaxLiability, 3070);
  // Philadelphia 3.75% on $100,000 = $3,750
  assert.equal(res.localTaxLiability, 3750);
});

test('State & Local Taxes: New York State progressive tax + New York City resident brackets', () => {
  const res = calculateUsIncomeTax({
    taxYear: 2025,
    filingStatus: 'single',
    stateOfResidence: 'NY',
    locality: 'NYC',
    taxpayerAge: 32,
    qualifyingChildrenUnder17: 0,
    otherDependents: 0,
    wages: 120000,
    selfEmploymentIncome: 0,
    taxableInterest: 0,
    ordinaryDividends: 0,
    qualifiedDividends: 0,
    longTermCapitalGains: 0,
    shortTermCapitalGains: 0,
    rentalAndPassiveIncome: 0,
    otherIncome: 0,
    deductionMethod: 'standard',
    federalWithholding: 20000,
    stateWithholding: 6500,
    estimatedTaxPayments: 4000
  });

  // NY State taxable income = 120,000 - 8,000 NY std deduction = 112,000.
  assert.equal(res.stateTaxableIncome, 112000);
  assert.ok(res.stateTaxLiability > 5500 && res.stateTaxLiability < 7500);
  // NYC resident brackets applied on 112,000
  assert.ok(res.localTaxLiability > 3500 && res.localTaxLiability < 4500);
});

test('Unsupported state is gracefully identified without fabricating arbitrary rates', () => {
  const res = calculateUsIncomeTax({
    taxYear: 2025,
    filingStatus: 'single',
    stateOfResidence: 'XX', // invalid/unsupported state code
    taxpayerAge: 28,
    qualifyingChildrenUnder17: 0,
    otherDependents: 0,
    wages: 80000,
    selfEmploymentIncome: 0,
    taxableInterest: 0,
    ordinaryDividends: 0,
    qualifiedDividends: 0,
    longTermCapitalGains: 0,
    shortTermCapitalGains: 0,
    rentalAndPassiveIncome: 0,
    otherIncome: 0,
    deductionMethod: 'standard',
    federalWithholding: 10000,
    stateWithholding: 0,
    estimatedTaxPayments: 0
  });

  assert.equal(res.isStateSupported, false);
  assert.equal(res.stateTaxLiability, 0);
  assert.ok(res.jurisdictionNotes?.includes('not currently in the verified registry'));
  // Federal portion must still calculate cleanly
  assert.ok(res.netFederalTaxLiability > 0);
});
