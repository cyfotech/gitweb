import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Percent,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  BarChart3,
  Scale,
  Building2,
  UserCheck
} from 'lucide-react';
import {
  calculateFederalIndividualTax,
  calculateCpaOutsourcingRoi,
  calculateBusinessTaxOptimization,
  FilingStatus
} from '../data/taxCalculator';
import { EditableElement } from './EditableElement';

const SLIDER_CSS = `
  .cpa-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 6px;
    border-radius: 9999px;
    outline: none;
    --track: #E2EBE8;
    cursor: pointer;
    background: linear-gradient(
      to right,
      #059669 0%,
      #059669 var(--fill, 0%),
      var(--track) var(--fill, 0%),
      var(--track) 100%
    );
  }
  .cpa-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #059669;
    border: 3px solid #ffffff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
    cursor: pointer;
    transition: transform 0.15s ease;
  }
  .cpa-slider::-webkit-slider-thumb:hover {
    transform: scale(1.12);
  }
  .cpa-slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #059669;
    border: 3px solid #ffffff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
    cursor: pointer;
  }
  .cpa-slider::-moz-range-track {
    height: 6px;
    border-radius: 9999px;
    background: transparent;
  }
  .dark .cpa-slider {
    --track: rgba(255, 255, 255, 0.18);
  }
`;

export interface FinancialClarityContent {
  title?: string | null;
  subheading?: string | null;
  description?: string | null;
  content?: string | null;
}

interface FinancialClarityChapterProps {
  onOpenConsultation: (category?: string, service?: string) => void;
  cmsContent?: FinancialClarityContent | null;
}

export function FinancialClarityChapter({ onOpenConsultation, cmsContent }: FinancialClarityChapterProps) {
  const [activeTab, setActiveTab] = useState<'roi' | 'tax' | 'business'>('roi');

  const displayTitle = cmsContent?.title || 'Financial intelligence, quantified.';
  const displaySubheading = cmsContent?.subheading || 'CHAPTER 03 — FINANCIAL CLARITY';
  const displayDescription = cmsContent?.description || 'No vague claims or unverified performance statistics. Explore our interactive financial modeling tools powered by actual 2025 IRS tax law and economic realization models.';

  // ROI Simulator State
  const [hoursPerMonth, setHoursPerMonth] = useState<number>(120);
  const [domesticRate, setDomesticRate] = useState<number>(70);
  const [offshoreRate, setOffshoreRate] = useState<number>(30);

  const roiResult = calculateCpaOutsourcingRoi({
    hoursPerMonth,
    domesticHourlyRate: domesticRate,
    offshoreHourlyRate: offshoreRate,
    // Overhead removed per spec: Monthly Domestic Cost = Domestic Hourly Rate × Monthly Production Hours
    domesticOverheadPercentage: 0,
  });

  // Fill percentages for the custom emerald slider tracks
  const hoursFill = ((hoursPerMonth - 20) / (160 - 20)) * 100;
  const domesticFill = (domesticRate / 100) * 100;
  const offshoreFill = ((offshoreRate - 10) / (50 - 10)) * 100;

  // Individual Tax State
  const [individualIncome, setIndividualIncome] = useState<number>(125000);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('marriedJoint');

  const taxResult = calculateFederalIndividualTax(individualIncome, filingStatus);

  // Business Tax State
  const [grossRevenue, setGrossRevenue] = useState<number>(850000);
  const [operatingExpenses, setOperatingExpenses] = useState<number>(450000);
  const [equipmentInvestment, setEquipmentInvestment] = useState<number>(80000);
  const [entityType, setEntityType] = useState<'scorp' | 'ccorp' | 'llc'>('scorp');

  const bizResult = calculateBusinessTaxOptimization({
    grossRevenue,
    operatingExpenses,
    equipmentInvestment,
    entityType,
  });

  return (
    <section id="financial-clarity" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFCFB] dark:bg-[#030F14] transition-colors duration-300">
      <style>{SLIDER_CSS}</style>
      <div className="max-w-7xl mx-auto">
        {/* Chapter Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <EditableElement
            sectionKey="financial_clarity"
            elementKey="subheading"
            elementType="subheading"
            label="Clarity Subheading"
            value={displaySubheading}
          >
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2AA499] dark:text-[#49E3D6] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#49E3D6]" />
              <span>{displaySubheading}</span>
            </div>
          </EditableElement>

          <EditableElement
            sectionKey="financial_clarity"
            elementKey="title"
            elementType="heading"
            label="Clarity Main Headline"
            value={displayTitle}
          >
            <h2 className="font-serif-editorial text-3xl sm:text-5xl font-normal text-[#12242B] dark:text-[#F4FBFC] tracking-tight mb-4">
              {displayTitle}
            </h2>
          </EditableElement>

          <EditableElement
            sectionKey="financial_clarity"
            elementKey="description"
            elementType="paragraph"
            label="Clarity Narrative Description"
            value={displayDescription}
          >
            <p className="text-sm sm:text-base text-[#476067] dark:text-[#A8C0C6] leading-relaxed">
              {displayDescription}
            </p>
          </EditableElement>
        </div>

        {/* Tab Selector Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)]">
            <button
              onClick={() => setActiveTab('roi')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all bg-[#17383F] text-white dark:bg-[#49E3D6] dark:text-[#03181E] shadow-sm"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>CPA Outsourcing ROI Simulator</span>
            </button>
          </div>
        </div>

        {/* Tab 1: CPA Outsourcing ROI Simulator */}
        {activeTab === 'roi' && (
          <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {/* LEFT: Inputs */}
            <div className="rounded-[30px] bg-white dark:bg-[#071C25] border border-emerald-100 dark:border-[rgba(121,241,232,0.18)] shadow-sm p-6 sm:p-8 lg:p-10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-[#49E3D6]">
                Capacity & Margin Engine
              </span>
              <h3 className="text-2xl font-bold text-[#12242B] dark:text-[#F4FBFC] mt-1 mb-2">
                CPA Outsourcing Savings Calculator
              </h3>
              <p className="text-xs sm:text-sm text-[#476067] dark:text-[#A8C0C6] mb-8">
                Model your practice capacity recovery by shifting standard preparation and bookkeeping to dedicated offshore pods.
              </p>

              <div className="space-y-8">
                {/* Slider 1: Hours */}
                <div>
                  <div className="flex justify-between items-baseline mb-3 text-xs font-bold text-[#12242B] dark:text-[#F4FBFC]">
                    <span>Monthly Production Hours Outsourced</span>
                    <span className="text-emerald-600 dark:text-[#49E3D6] font-mono text-sm">{hoursPerMonth} hrs/mo</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="160"
                    step="20"
                    value={hoursPerMonth}
                    onChange={(e) => setHoursPerMonth(Number(e.target.value))}
                    className="cpa-slider"
                    style={{ ['--fill' as string]: `${hoursFill}%` }}
                  />
                  <div className="flex justify-between mt-2 text-[10px] font-mono text-gray-400 dark:text-[#8AA3A8]">
                    {[20, 40, 60, 80, 100, 120, 140, 160].map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>

                {/* Slider 2: Domestic Rate */}
                <div>
                  <div className="flex justify-between items-baseline mb-3 text-xs font-bold text-[#12242B] dark:text-[#F4FBFC]">
                    <span>Current Domestic Loaded Cost</span>
                    <span className="text-emerald-600 dark:text-[#49E3D6] font-mono text-sm">${domesticRate}/hr</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={domesticRate}
                    onChange={(e) => setDomesticRate(Number(e.target.value))}
                    className="cpa-slider"
                    style={{ ['--fill' as string]: `${domesticFill}%` }}
                  />
                  <div className="flex justify-between mt-2 text-[10px] font-mono text-gray-400 dark:text-[#8AA3A8]">
                    {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>

                {/* Slider 3: Offshore Rate */}
                <div>
                  <div className="flex justify-between items-baseline mb-3 text-xs font-bold text-[#12242B] dark:text-[#F4FBFC]">
                    <span>Dedicated Offshore Rate</span>
                    <span className="text-emerald-600 dark:text-[#49E3D6] font-mono text-sm">${offshoreRate}/hr</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="10"
                    value={offshoreRate}
                    onChange={(e) => setOffshoreRate(Number(e.target.value))}
                    className="cpa-slider"
                    style={{ ['--fill' as string]: `${offshoreFill}%` }}
                  />
                  <div className="flex justify-between mt-2 text-[10px] font-mono text-gray-400 dark:text-[#8AA3A8]">
                    {[10, 20, 30, 40, 50].map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-[#03131A] border border-emerald-100 dark:border-[rgba(121,241,232,0.1)] text-xs text-[#476067] dark:text-[#8AA3A8]">
                Domestic cost is calculated directly at your loaded billing rate — no added overhead markup.
              </div>
            </div>

            {/* RIGHT: Results Card */}
            <div className="flex flex-col rounded-[30px] bg-gradient-to-b from-emerald-50/80 to-white dark:from-[#0A2430] dark:to-[#071C25] border border-emerald-100 dark:border-[rgba(121,241,232,0.18)] shadow-sm p-6 sm:p-8 lg:p-10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#476067] dark:text-[#A8C0C6]">
                Annual Projected Bottom-Line Impact
              </span>
              <div className="mt-3 text-4xl sm:text-5xl font-black text-emerald-700 dark:text-[#49E3D6] font-mono">
                ${roiResult.annualSavings.toLocaleString()}
              </div>
              <p className="mt-2 text-xs font-semibold text-emerald-700/80 dark:text-[#49E3D6]/80">
                Over 30% reduction in operating costs — maximizing profitability.
              </p>

              <div className="my-8 grid grid-cols-3 divide-x divide-emerald-100 dark:divide-white/10 text-center">
                <div className="pr-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#8AA3A8]">Monthly Domestic Cost</div>
                  <div className="mt-1 text-base sm:text-lg font-black text-[#12242B] dark:text-[#F4FBFC] font-mono">
                    ${roiResult.monthlyDomesticCost.toLocaleString()}
                  </div>
                </div>
                <div className="px-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#8AA3A8]">Monthly Outsourced Cost</div>
                  <div className="mt-1 text-base sm:text-lg font-black text-[#12242B] dark:text-[#F4FBFC] font-mono">
                    ${roiResult.monthlyOffshoreCost.toLocaleString()}
                  </div>
                </div>
                <div className="pl-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#8AA3A8]">Monthly Net Savings</div>
                  <div className="mt-1 text-base sm:text-lg font-black text-emerald-600 dark:text-[#49E3D6] font-mono">
                    ${roiResult.monthlySavings.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <button
                  onClick={() => onOpenConsultation('cpa')}
                  className="w-full py-3.5 px-6 rounded-full text-sm font-bold bg-[#17383F] hover:bg-[#0E262B] text-white dark:bg-[#49E3D6] dark:hover:bg-[#7DF5E8] dark:text-[#03181E] transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Lock In These Margins With Smart Tax Experts</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Individual 2025 Tax Estimator */}
        {activeTab === 'tax' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl p-6 sm:p-10 bg-white dark:bg-[#071C25] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)] shadow-xl">
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2AA499] dark:text-[#49E3D6]">
                  IRS Code 2025 Inflation Adjusted
                </span>
                <h3 className="text-2xl font-bold text-[#12242B] dark:text-[#F4FBFC] mt-1 mb-2">
                  Federal Individual Tax Estimator
                </h3>
                <p className="text-xs sm:text-sm text-[#476067] dark:text-[#A8C0C6]">
                  Calculates exact tax liability using official 2025 IRS brackets and standard deductions ($15,000 Single / $30,000 Married Filing Jointly).
                </p>
              </div>

              {/* Filing Status Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#12242B] dark:text-[#F4FBFC]">
                  Filing Status:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'single', label: 'Single' },
                    { id: 'marriedJoint', label: 'Married Joint' },
                    { id: 'headOfHousehold', label: 'Head of House' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setFilingStatus(s.id as FilingStatus)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${filingStatus === s.id
                        ? 'bg-[#17383F] text-white dark:bg-[#49E3D6] dark:text-[#03181E] border-transparent'
                        : 'bg-black/5 dark:bg-white/5 border-[#DCE5E2] dark:border-white/10 text-[#476067] dark:text-[#A8C0C6]'
                        }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Annual Gross Income Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#12242B] dark:text-[#F4FBFC]">
                  <span>Gross Household Income:</span>
                  <span className="text-[#2AA499] dark:text-[#49E3D6] font-mono text-sm">
                    ${individualIncome.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="600000"
                  step="5000"
                  value={individualIncome}
                  onChange={(e) => setIndividualIncome(Number(e.target.value))}
                  className="w-full accent-[#2AA499] dark:accent-[#49E3D6] cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#E2EBE8] dark:border-[rgba(121,241,232,0.1)] text-xs text-[#64748B] dark:text-[#8AA3A8]">
                Standard deduction applied: ${filingStatus === 'marriedJoint' ? '30,000' : filingStatus === 'headOfHousehold' ? '22,500' : '15,000'}.
              </div>
            </div>

            {/* Tax Result Card */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#F4F9F8] dark:bg-[#03131A] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)] flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#476067] dark:text-[#A8C0C6]">
                    Estimated Federal Tax Liability
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-[#12242B] dark:text-[#F4FBFC] mt-2 font-mono">
                    ${taxResult.totalTax.toLocaleString()}
                  </div>
                  <div className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mt-1">
                    Effective Federal Rate: {taxResult.effectiveRate}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)]">
                  <div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#8AA3A8]">Gross Income</div>
                    <div className="text-lg font-bold text-[#12242B] dark:text-[#F4FBFC] font-mono">
                      ${individualIncome.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#8AA3A8]">Taxable Base</div>
                    <div className="text-lg font-bold text-[#12242B] dark:text-[#F4FBFC] font-mono">
                      ${taxResult.taxableIncome.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onOpenConsultation('individual', 'individual-tax-prep')}
                  className="w-full py-3.5 rounded-full text-xs font-bold bg-[#17383F] hover:bg-[#0E262B] text-white dark:bg-[#49E3D6] dark:hover:bg-[#7DF5E8] dark:text-[#03181E] transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Review Strategy & Optimize Deductions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Business Section 179 & QBI Planner */}
        {activeTab === 'business' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl p-6 sm:p-10 bg-white dark:bg-[#071C25] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)] shadow-xl">
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2AA499] dark:text-[#49E3D6]">
                  Capital Investments & Pass-Through Gains
                </span>
                <h3 className="text-2xl font-bold text-[#12242B] dark:text-[#F4FBFC] mt-1 mb-2">
                  Section 179 & QBI Optimization
                </h3>
                <p className="text-xs sm:text-sm text-[#476067] dark:text-[#A8C0C6]">
                  Estimate immediate first-year equipment expensing and Section 199A Qualified Business Income deductions.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#12242B] dark:text-[#F4FBFC]">
                  <span>Equipment / Capital Asset Purchases:</span>
                  <span className="text-[#2AA499] dark:text-[#49E3D6] font-mono text-sm">
                    ${equipmentInvestment.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="250000"
                  step="5000"
                  value={equipmentInvestment}
                  onChange={(e) => setEquipmentInvestment(Number(e.target.value))}
                  className="w-full accent-[#2AA499] dark:accent-[#49E3D6] cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#12242B] dark:text-[#F4FBFC]">
                  <span>Gross Business Revenue:</span>
                  <span className="text-[#2AA499] dark:text-[#49E3D6] font-mono text-sm">
                    ${grossRevenue.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="2000000"
                  step="25000"
                  value={grossRevenue}
                  onChange={(e) => setGrossRevenue(Number(e.target.value))}
                  className="w-full accent-[#2AA499] dark:accent-[#49E3D6] cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#E2EBE8] dark:border-[rgba(121,241,232,0.1)] text-xs text-[#64748B] dark:text-[#8AA3A8]">
                Modeled under 2025 Section 179 dollar cap ($1.22M) and standard 20% Section 199A pass-through treatment.
              </div>
            </div>

            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#F4F9F8] dark:bg-[#03131A] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)] flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#476067] dark:text-[#A8C0C6]">
                    Total Tax Saved Through Optimizations
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
                    ${bizResult.totalTaxSaved.toLocaleString()}
                  </div>
                  <div className="text-xs font-semibold text-[#476067] dark:text-[#A8C0C6] mt-1">
                    First-Year Expensing + Pass-Through QBI Benefit
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)]">
                  <div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#8AA3A8]">Section 179 Deduction</div>
                    <div className="text-lg font-bold text-[#12242B] dark:text-[#F4FBFC] font-mono">
                      ${bizResult.section179Deduction.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#8AA3A8]">Section 199A QBI Benefit</div>
                    <div className="text-lg font-bold text-[#12242B] dark:text-[#F4FBFC] font-mono">
                      ${bizResult.section199aQbiDeduction.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onOpenConsultation('business', 'strategic-tax-planning')}
                  className="w-full py-3.5 rounded-full text-xs font-bold bg-[#17383F] hover:bg-[#0E262B] text-white dark:bg-[#49E3D6] dark:hover:bg-[#7DF5E8] dark:text-[#03181E] transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Build Corporate Entity Strategy</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
