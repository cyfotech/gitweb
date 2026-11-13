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
  const [hoursPerMonth, setHoursPerMonth] = useState<number>(160);
  const [domesticRate, setDomesticRate] = useState<number>(85);
  const [offshoreRate, setOffshoreRate] = useState<number>(28);

  const roiResult = calculateCpaOutsourcingRoi({
    hoursPerMonth,
    domesticHourlyRate: domesticRate,
    offshoreHourlyRate: offshoreRate,
    domesticOverheadPercentage: 15,
  });

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
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'roi'
                  ? 'bg-[#17383F] text-white dark:bg-[#49E3D6] dark:text-[#03181E] shadow-sm'
                  : 'text-[#476067] dark:text-[#A8C0C6] hover:text-[#12242B] dark:hover:text-[#F4FBFC]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>CPA Outsourcing ROI</span>
            </button>

            <button
              onClick={() => setActiveTab('tax')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'tax'
                  ? 'bg-[#17383F] text-white dark:bg-[#49E3D6] dark:text-[#03181E] shadow-sm'
                  : 'text-[#476067] dark:text-[#A8C0C6] hover:text-[#12242B] dark:hover:text-[#F4FBFC]'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>2025 Individual Tax Estimator</span>
            </button>

            <button
              onClick={() => setActiveTab('business')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'business'
                  ? 'bg-[#17383F] text-white dark:bg-[#49E3D6] dark:text-[#03181E] shadow-sm'
                  : 'text-[#476067] dark:text-[#A8C0C6] hover:text-[#12242B] dark:hover:text-[#F4FBFC]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Section 179 & QBI Planner</span>
            </button>
          </div>
        </div>

        {/* Tab 1: CPA Outsourcing ROI Simulator */}
        {activeTab === 'roi' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl p-6 sm:p-10 bg-white dark:bg-[#071C25] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)] shadow-xl">
            {/* Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2AA499] dark:text-[#49E3D6]">
                  Capacity & Margin Engine
                </span>
                <h3 className="text-2xl font-bold text-[#12242B] dark:text-[#F4FBFC] mt-1 mb-2">
                  CPA Outsourcing Savings Calculator
                </h3>
                <p className="text-xs sm:text-sm text-[#476067] dark:text-[#A8C0C6]">
                  Model your practice capacity recovery by shifting standard preparation and bookkeeping to dedicated offshore pods.
                </p>
              </div>

              {/* Slider 1: Hours */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#12242B] dark:text-[#F4FBFC]">
                  <span>Monthly Production Hours Outsourced:</span>
                  <span className="text-[#2AA499] dark:text-[#49E3D6] font-mono text-sm">{hoursPerMonth} hrs/mo</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="640"
                  step="20"
                  value={hoursPerMonth}
                  onChange={(e) => setHoursPerMonth(Number(e.target.value))}
                  className="w-full accent-[#2AA499] dark:accent-[#49E3D6] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Part-Time (40h)</span>
                  <span>1 Full FTE (160h)</span>
                  <span>Pod Scale (640h)</span>
                </div>
              </div>

              {/* Slider 2: Domestic Rate */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#12242B] dark:text-[#F4FBFC]">
                  <span>Current Domestic Loaded Cost:</span>
                  <span className="text-[#2AA499] dark:text-[#49E3D6] font-mono text-sm">${domesticRate}/hr</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  step="5"
                  value={domesticRate}
                  onChange={(e) => setDomesticRate(Number(e.target.value))}
                  className="w-full accent-[#2AA499] dark:accent-[#49E3D6] cursor-pointer"
                />
              </div>

              {/* Slider 3: Preferred Tax Rate */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#12242B] dark:text-[#F4FBFC]">
                  <span>Preferred Tax Dedicated Rate:</span>
                  <span className="text-emerald-500 font-mono text-sm">${offshoreRate}/hr</span>
                </div>
                <input
                  type="range"
                  min="22"
                  max="45"
                  step="1"
                  value={offshoreRate}
                  onChange={(e) => setOffshoreRate(Number(e.target.value))}
                  className="w-full accent-[#2AA499] dark:accent-[#49E3D6] cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#E2EBE8] dark:border-[rgba(121,241,232,0.1)] text-xs text-[#64748B] dark:text-[#8AA3A8]">
                Includes 15% estimated domestic employer payroll taxes, benefits, workspace, and licensing overhead.
              </div>
            </div>

            {/* Results Graphic */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#F4F9F8] dark:bg-[#03131A] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)] flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#476067] dark:text-[#A8C0C6]">
                    Annual Projected Bottom-Line Impact
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-[#12242B] dark:text-[#F4FBFC] mt-2 font-mono">
                    ${roiResult.annualSavings.toLocaleString()}
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                    +{roiResult.savingsPercentage}% Gross Margin Expansion
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)]">
                  <div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#8AA3A8]">Monthly Domestic Cost</div>
                    <div className="text-lg font-bold text-[#12242B] dark:text-[#F4FBFC] font-mono">
                      ${roiResult.monthlyDomesticCost.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#8AA3A8]">Monthly Outsourced Cost</div>
                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      ${roiResult.monthlyOffshoreCost.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#8AA3A8]">Monthly Net Savings</div>
                    <div className="text-lg font-bold text-[#2AA499] dark:text-[#49E3D6] font-mono">
                      ${roiResult.monthlySavings.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#8AA3A8]">Annual Firm Hours Saved</div>
                    <div className="text-lg font-bold text-[#12242B] dark:text-[#F4FBFC] font-mono">
                      {roiResult.hoursRecoveredAnnual.toLocaleString()} hrs
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onOpenConsultation('cpa')}
                  className="w-full py-3.5 rounded-full text-xs font-bold bg-[#17383F] hover:bg-[#0E262B] text-white dark:bg-[#49E3D6] dark:hover:bg-[#7DF5E8] dark:text-[#03181E] transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Lock In These Margins With Preferred Tax</span>
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
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        filingStatus === s.id
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
