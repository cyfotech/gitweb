/**
 * Authoritative Tax Formulas & Interactive Financial Calculation Engine
 * Grounded in IRS Code Section 179, Section 199A (QBI), and Industry Standard CPA Realization Models
 */

export interface TaxBracket {
  rate: number;
  min: number;
  max: number | null;
}

export type FilingStatus = 'single' | 'marriedJoint' | 'headOfHousehold';

export const IRS_TAX_BRACKETS_2025: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { rate: 0.10, min: 0, max: 11925 },
    { rate: 0.12, min: 11925, max: 48475 },
    { rate: 0.22, min: 48475, max: 103350 },
    { rate: 0.24, min: 103350, max: 197300 },
    { rate: 0.32, min: 197300, max: 250525 },
    { rate: 0.35, min: 250525, max: 626350 },
    { rate: 0.37, min: 626350, max: null }
  ],
  marriedJoint: [
    { rate: 0.10, min: 0, max: 23850 },
    { rate: 0.12, min: 23850, max: 96950 },
    { rate: 0.22, min: 96950, max: 206700 },
    { rate: 0.24, min: 206700, max: 394600 },
    { rate: 0.32, min: 394600, max: 501050 },
    { rate: 0.35, min: 501050, max: 751600 },
    { rate: 0.37, min: 751600, max: null }
  ],
  headOfHousehold: [
    { rate: 0.10, min: 0, max: 17000 },
    { rate: 0.12, min: 17000, max: 64850 },
    { rate: 0.22, min: 64850, max: 103350 },
    { rate: 0.24, min: 103350, max: 197300 },
    { rate: 0.32, min: 197300, max: 250500 },
    { rate: 0.35, min: 250500, max: 626350 },
    { rate: 0.37, min: 626350, max: null }
  ]
};

export const STANDARD_DEDUCTIONS_2025: Record<FilingStatus, number> = {
  single: 15000,
  marriedJoint: 30000,
  headOfHousehold: 22500
};

export function calculateFederalIndividualTax(income: number, status: FilingStatus): {
  taxableIncome: number;
  totalTax: number;
  effectiveRate: number;
  bracketBreakdown: { rate: number; taxableInBracket: number; taxAmount: number }[];
} {
  const standardDeduction = STANDARD_DEDUCTIONS_2025[status];
  const taxableIncome = Math.max(0, income - standardDeduction);
  const brackets = IRS_TAX_BRACKETS_2025[status];

  let totalTax = 0;
  const bracketBreakdown: { rate: number; taxableInBracket: number; taxAmount: number }[] = [];

  for (const bracket of brackets) {
    if (taxableIncome > bracket.min) {
      const upper = bracket.max !== null ? Math.min(taxableIncome, bracket.max) : taxableIncome;
      const taxableInBracket = upper - bracket.min;
      const taxAmount = taxableInBracket * bracket.rate;
      totalTax += taxAmount;
      bracketBreakdown.push({
        rate: bracket.rate,
        taxableInBracket,
        taxAmount
      });
    }
  }

  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;

  return {
    taxableIncome,
    totalTax: Math.round(totalTax),
    effectiveRate: Number(effectiveRate.toFixed(2)),
    bracketBreakdown
  };
}

export interface CpaOutsourcingParams {
  hoursPerMonth: number;
  domesticHourlyRate: number; // e.g. $85
  offshoreHourlyRate: number; // e.g. $28
  domesticOverheadPercentage: number; // e.g. 15% for payroll taxes, benefits, recruiting
}

export interface CpaOutsourcingResult {
  monthlyDomesticCost: number;
  monthlyOffshoreCost: number;
  monthlySavings: number;
  annualSavings: number;
  savingsPercentage: number;
  hoursRecoveredAnnual: number;
  monthlyBreakdown: {
    month: string;
    domestic: number;
    outsourced: number;
    cumulativeSavings: number;
  }[];
}

export function calculateCpaOutsourcingRoi(params: CpaOutsourcingParams): CpaOutsourcingResult {
  const { hoursPerMonth, domesticHourlyRate, offshoreHourlyRate, domesticOverheadPercentage } = params;

  const fullyLoadedDomesticRate = domesticHourlyRate * (1 + domesticOverheadPercentage / 100);
  const monthlyDomesticCost = Math.round(hoursPerMonth * fullyLoadedDomesticRate);
  const monthlyOffshoreCost = Math.round(hoursPerMonth * offshoreHourlyRate);
  const monthlySavings = monthlyDomesticCost - monthlyOffshoreCost;
  const annualSavings = monthlySavings * 12;
  const savingsPercentage = monthlyDomesticCost > 0 ? Number(((monthlySavings / monthlyDomesticCost) * 100).toFixed(1)) : 0;
  const hoursRecoveredAnnual = hoursPerMonth * 12;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let runningSavings = 0;
  const monthlyBreakdown = months.map((month) => {
    runningSavings += monthlySavings;
    return {
      month,
      domestic: monthlyDomesticCost,
      outsourced: monthlyOffshoreCost,
      cumulativeSavings: runningSavings
    };
  });

  return {
    monthlyDomesticCost,
    monthlyOffshoreCost,
    monthlySavings,
    annualSavings,
    savingsPercentage,
    hoursRecoveredAnnual,
    monthlyBreakdown
  };
}

export interface BusinessTaxOptimizationParams {
  grossRevenue: number;
  operatingExpenses: number;
  equipmentInvestment: number;
  entityType: 'llc' | 'scorp' | 'ccorp';
}

export function calculateBusinessTaxOptimization(params: BusinessTaxOptimizationParams): {
  netOperatingIncome: number;
  section179Deduction: number;
  section199aQbiDeduction: number;
  taxableBase: number;
  estimatedStandardLiability: number;
  estimatedOptimizedLiability: number;
  totalTaxSaved: number;
} {
  const { grossRevenue, operatingExpenses, equipmentInvestment, entityType } = params;

  const netOperatingIncome = Math.max(0, grossRevenue - operatingExpenses);

  // Section 179 Cap for 2024-2025 is $1,220,000 max deduction
  const section179Deduction = Math.min(equipmentInvestment, 1220000, netOperatingIncome);
  const incomeAfterDepreciation = Math.max(0, netOperatingIncome - section179Deduction);

  // Section 199A QBI 20% deduction applies to pass-through entities (LLC and S-Corp)
  const isPassThrough = entityType === 'llc' || entityType === 'scorp';
  const section199aQbiDeduction = isPassThrough ? Math.round(incomeAfterDepreciation * 0.20) : 0;

  const taxableBase = Math.max(0, incomeAfterDepreciation - section199aQbiDeduction);

  // Corporate baseline vs pass-through estimated effective tax rate ~26% federal + state average
  const baselineRate = entityType === 'ccorp' ? 0.21 : 0.28;
  const estimatedStandardLiability = Math.round(netOperatingIncome * baselineRate);
  const estimatedOptimizedLiability = Math.round(taxableBase * baselineRate);
  const totalTaxSaved = Math.max(0, estimatedStandardLiability - estimatedOptimizedLiability);

  return {
    netOperatingIncome,
    section179Deduction,
    section199aQbiDeduction,
    taxableBase,
    estimatedStandardLiability,
    estimatedOptimizedLiability,
    totalTaxSaved
  };
}
