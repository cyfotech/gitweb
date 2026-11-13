import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Percent, 
  Building2, 
  CheckCircle2, 
  ArrowUpRight,
  Info
} from 'lucide-react';
import { 
  calculateCpaOutsourcingRoi, 
  calculateBusinessTaxOptimization,
  CpaOutsourcingParams,
  BusinessTaxOptimizationParams
} from '../data/taxCalculator';

interface CalculatorSectionProps {
  onOpenConsultation: () => void;
}

export function CalculatorSection({ onOpenConsultation }: CalculatorSectionProps) {
  const [calculatorTab, setCalculatorTab] = useState<'cpa-roi' | 'tax-opt'>('cpa-roi');

  // CPA ROI state
  const [cpaParams, setCpaParams] = useState<CpaOutsourcingParams>({
    hoursPerMonth: 120,
    domesticHourlyRate: 85,
    offshoreHourlyRate: 28,
    domesticOverheadPercentage: 15
  });

  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(null);

  // Business Tax Optimization state
  const [taxParams, setTaxParams] = useState<BusinessTaxOptimizationParams>({
    grossRevenue: 650000,
    operatingExpenses: 280000,
    equipmentInvestment: 60000,
    entityType: 'scorp'
  });

  const roiResult = calculateCpaOutsourcingRoi(cpaParams);
  const taxOptResult = calculateBusinessTaxOptimization(taxParams);

  // Chart calculation for CPA ROI
  const chartWidth = 540;
  const chartHeight = 200;
  const padX = 40;
  const padY = 25;
  const pWidth = chartWidth - padX * 2;
  const pHeight = chartHeight - padY * 2;
  const maxSavings = roiResult.annualSavings * 1.08 || 100000;

  const chartPoints = roiResult.monthlyBreakdown.map((item, idx) => {
    const x = padX + (idx / (roiResult.monthlyBreakdown.length - 1)) * pWidth;
    const y = chartHeight - padY - (item.cumulativeSavings / maxSavings) * pHeight;
    return { x, y, ...item };
  });

  const cumulativePath = chartPoints.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const cumulativeArea = `${cumulativePath} L ${chartPoints[chartPoints.length - 1].x} ${chartHeight - padY} L ${chartPoints[0].x} ${chartHeight - padY} Z`;

  return (
    <section id="calculator" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#F7F9F8] dark:bg-[#031117] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#E4F0EE] dark:bg-[rgba(44,207,197,0.12)] text-[#315F69] dark:text-[#79F1E8] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.25)] mb-3">
              <Calculator className="w-3.5 h-3.5" />
              <span>Real Financial Modeling</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#17252B] dark:text-[#F3FBFC]">
              Interactive ROI & Tax Optimization Engine
            </h2>
            <p className="mt-3 text-base text-[#526168] dark:text-[#A8C0C6]">
              All calculations run on mathematical models grounded in current IRS tax codes (Section 179, Section 199A QBI) and real CPA staffing realization benchmarks.
            </p>
          </div>

          {/* Calculator Mode Switch */}
          <div className="flex items-center p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)] self-start md:self-auto">
            <button
              onClick={() => setCalculatorTab('cpa-roi')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                calculatorTab === 'cpa-roi'
                  ? 'bg-[#315F69] text-white dark:bg-[#2CCFC5] dark:text-[#031117] shadow-sm'
                  : 'text-[#526168] dark:text-[#A8C0C6] hover:text-[#17252B] dark:hover:text-[#F3FBFC]'
              }`}
            >
              CPA Outsourcing ROI
            </button>
            <button
              onClick={() => setCalculatorTab('tax-opt')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                calculatorTab === 'tax-opt'
                  ? 'bg-[#315F69] text-white dark:bg-[#2CCFC5] dark:text-[#031117] shadow-sm'
                  : 'text-[#526168] dark:text-[#A8C0C6] hover:text-[#17252B] dark:hover:text-[#F3FBFC]'
              }`}
            >
              Business Tax Deductions
            </button>
          </div>
        </div>

        {/* Tab 1: CPA Outsourcing ROI & Capacity */}
        {calculatorTab === 'cpa-roi' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Input Controls (5 Cols) */}
            <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.22)] shadow-xl">
              <h3 className="text-lg font-bold text-[#17252B] dark:text-[#F3FBFC] mb-1">
                Firm Staffing Parameters
              </h3>
              <p className="text-xs text-[#526168] dark:text-[#A8C0C6] mb-6">
                Adjust required hours and rates to estimate cost reduction and recovered billable hours.
              </p>

              <div className="space-y-6">
                {/* Monthly Hours Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[#17252B] dark:text-[#F3FBFC] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#315F69] dark:text-[#2CCFC5]" />
                      <span>Monthly Accounting Hours Needed</span>
                    </label>
                    <span className="text-sm font-bold text-[#315F69] dark:text-[#79F1E8]">
                      {cpaParams.hoursPerMonth} hrs/mo
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="320"
                    step="10"
                    value={cpaParams.hoursPerMonth}
                    onChange={(e) => setCpaParams({ ...cpaParams, hoursPerMonth: Number(e.target.value) })}
                    className="w-full accent-[#315F69] dark:accent-[#2CCFC5] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#526168] dark:text-[#A8C0C6] mt-1">
                    <span>Part-Time (20 hrs)</span>
                    <span>1 Full-Time (160 hrs)</span>
                    <span>2 Full-Time (320 hrs)</span>
                  </div>
                </div>

                {/* Domestic In-House Rate */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[#17252B] dark:text-[#F3FBFC] flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-[#315F69] dark:text-[#2CCFC5]" />
                      <span>Average US Domestic Base Rate</span>
                    </label>
                    <span className="text-sm font-bold text-[#17252B] dark:text-[#F3FBFC]">
                      ${cpaParams.domesticHourlyRate}/hr
                    </span>
                  </div>
                  <input
                    type="range"
                    min="55"
                    max="140"
                    step="5"
                    value={cpaParams.domesticHourlyRate}
                    onChange={(e) => setCpaParams({ ...cpaParams, domesticHourlyRate: Number(e.target.value) })}
                    className="w-full accent-[#315F69] dark:accent-[#2CCFC5] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#526168] dark:text-[#A8C0C6] mt-1">
                    <span>$55/hr (Junior)</span>
                    <span>$85/hr (Mid-tier)</span>
                    <span>$140/hr (Senior CPA)</span>
                  </div>
                </div>

                {/* Dedicated Offshore Rate (Preferred Tax Rate) */}
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-[#071C24]/80 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)]">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#526168] dark:text-[#A8C0C6] font-medium">Preferred Tax Dedicated Rate:</span>
                    <span className="font-bold text-[#315F69] dark:text-[#79F1E8]">${cpaParams.offshoreHourlyRate}/hr (Flat)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#526168] dark:text-[#A8C0C6] font-medium">Domestic Overhead Fringe (Taxes/Benefits):</span>
                    <span className="font-bold text-[#17252B] dark:text-[#F3FBFC]">+{cpaParams.domesticOverheadPercentage}%</span>
                  </div>
                </div>

                <button
                  onClick={onOpenConsultation}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold bg-[#315F69] text-white dark:bg-[#2CCFC5] dark:text-[#031117] hover:scale-[1.02] active:scale-95 transition-all shadow-md"
                >
                  <span>Lock In This Outsourcing Rate</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Results & Visual Chart (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Stat Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="glass-panel p-4 rounded-2xl border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)]">
                  <div className="text-[11px] font-semibold text-[#526168] dark:text-[#A8C0C6] uppercase">Monthly Savings</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#315F69] dark:text-[#79F1E8] mt-1">
                    ${roiResult.monthlySavings.toLocaleString()}
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-2xl border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)]">
                  <div className="text-[11px] font-semibold text-[#526168] dark:text-[#A8C0C6] uppercase">Annual Savings</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                    ${roiResult.annualSavings.toLocaleString()}
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-2xl border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)]">
                  <div className="text-[11px] font-semibold text-[#526168] dark:text-[#A8C0C6] uppercase">Cost Reduction</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#17252B] dark:text-[#F3FBFC] mt-1">
                    {roiResult.savingsPercentage}%
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-2xl border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)]">
                  <div className="text-[11px] font-semibold text-[#526168] dark:text-[#A8C0C6] uppercase">Annual Hours Saved</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#17252B] dark:text-[#F3FBFC] mt-1">
                    {roiResult.hoursRecoveredAnnual} hrs
                  </div>
                </div>
              </div>

              {/* Cumulative 12-Month SVG Chart */}
              <div className="glass-panel rounded-3xl p-6 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.22)] shadow-xl relative">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#17252B] dark:text-[#F3FBFC]">
                      Cumulative 12-Month Savings Trajectory
                    </h4>
                    <p className="text-xs text-[#526168] dark:text-[#A8C0C6]">
                      Net capital retained by outsourcing to Preferred Tax Consultancy
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      +${roiResult.annualSavings.toLocaleString()} Year 1
                    </span>
                  </div>
                </div>

                <div className="w-full overflow-hidden">
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
                    <defs>
                      <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2CCFC5" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#2CCFC5" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Guideline */}
                    {[0.25, 0.5, 0.75].map((pct, i) => (
                      <line
                        key={i}
                        x1={padX}
                        y1={padY + pHeight * pct}
                        x2={chartWidth - padX}
                        y2={padY + pHeight * pct}
                        stroke="currentColor"
                        strokeDasharray="4 4"
                        className="text-gray-200 dark:text-gray-800"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Area */}
                    <path d={cumulativeArea} fill="url(#roiGradient)" />

                    {/* Line */}
                    <path
                      d={cumulativePath}
                      fill="none"
                      stroke="#2CCFC5"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Points */}
                    {chartPoints.map((pt, i) => (
                      <g
                        key={i}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredMonthIndex(i)}
                        onMouseLeave={() => setHoveredMonthIndex(null)}
                      >
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={hoveredMonthIndex === i ? '6' : '3.5'}
                          fill="#031117"
                          stroke="#79F1E8"
                          strokeWidth="2"
                        />
                        <text
                          x={pt.x}
                          y={chartHeight - 6}
                          textAnchor="middle"
                          className="text-[9px] fill-[#526168] dark:fill-[#A8C0C6] font-medium"
                        >
                          {pt.month}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                {/* Hover Tooltip */}
                {hoveredMonthIndex !== null && (
                  <div className="absolute top-4 right-6 bg-[#0B2530] text-[#F3FBFC] text-xs p-2.5 rounded-xl border border-[#79F1E8]/30 shadow-xl pointer-events-none">
                    <div className="font-bold text-[#79F1E8]">{chartPoints[hoveredMonthIndex].month} Cumulative:</div>
                    <div>Savings: ${chartPoints[hoveredMonthIndex].cumulativeSavings.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-400">Domestic: ${chartPoints[hoveredMonthIndex].domestic.toLocaleString()} / mo</div>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Business Tax Deductions (Section 179 + QBI) */}
        {calculatorTab === 'tax-opt' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Inputs (5 Cols) */}
            <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.22)] shadow-xl">
              <h3 className="text-lg font-bold text-[#17252B] dark:text-[#F3FBFC] mb-1">
                Business Financial Profile
              </h3>
              <p className="text-xs text-[#526168] dark:text-[#A8C0C6] mb-6">
                Calculate Section 179 accelerated depreciation and Section 199A QBI pass-through deductions.
              </p>

              <div className="space-y-4">
                {/* Entity Selector */}
                <div>
                  <label className="text-xs font-semibold text-[#17252B] dark:text-[#F3FBFC] block mb-1.5">
                    Business Entity Classification
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'scorp', label: 'S-Corp (1120-S)' },
                      { id: 'llc', label: 'LLC (1065)' },
                      { id: 'ccorp', label: 'C-Corp (1120)' }
                    ].map((ent) => (
                      <button
                        key={ent.id}
                        onClick={() => setTaxParams({ ...taxParams, entityType: ent.id as any })}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                          taxParams.entityType === ent.id
                            ? 'bg-[#315F69] text-white dark:bg-[#2CCFC5] dark:text-[#031117] border-transparent shadow-sm'
                            : 'bg-black/5 dark:bg-white/5 border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)] text-[#526168] dark:text-[#A8C0C6]'
                        }`}
                      >
                        {ent.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gross Revenue */}
                <div>
                  <label className="text-xs font-semibold text-[#17252B] dark:text-[#F3FBFC] block mb-1.5">
                    Annual Gross Revenue ($)
                  </label>
                  <input
                    type="number"
                    step="10000"
                    value={taxParams.grossRevenue}
                    onChange={(e) => setTaxParams({ ...taxParams, grossRevenue: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-black/5 dark:bg-[#071C24] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)] text-[#17252B] dark:text-[#F3FBFC] focus:outline-none focus:ring-2 focus:ring-[#2CCFC5]"
                  />
                </div>

                {/* Operating Expenses */}
                <div>
                  <label className="text-xs font-semibold text-[#17252B] dark:text-[#F3FBFC] block mb-1.5">
                    Annual Operating Expenses (COGS, Rent, W-2 Payroll) ($)
                  </label>
                  <input
                    type="number"
                    step="10000"
                    value={taxParams.operatingExpenses}
                    onChange={(e) => setTaxParams({ ...taxParams, operatingExpenses: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-black/5 dark:bg-[#071C24] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)] text-[#17252B] dark:text-[#F3FBFC] focus:outline-none focus:ring-2 focus:ring-[#2CCFC5]"
                  />
                </div>

                {/* Equipment / Software Investments */}
                <div>
                  <label className="text-xs font-semibold text-[#17252B] dark:text-[#F3FBFC] block mb-1.5">
                    Qualifying Equipment / Tech Purchases (Section 179) ($)
                  </label>
                  <input
                    type="number"
                    step="5000"
                    value={taxParams.equipmentInvestment}
                    onChange={(e) => setTaxParams({ ...taxParams, equipmentInvestment: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-black/5 dark:bg-[#071C24] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)] text-[#17252B] dark:text-[#F3FBFC] focus:outline-none focus:ring-2 focus:ring-[#2CCFC5]"
                  />
                </div>

                <button
                  onClick={onOpenConsultation}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold bg-[#315F69] text-white dark:bg-[#2CCFC5] dark:text-[#031117] hover:scale-[1.02] active:scale-95 transition-all shadow-md mt-4"
                >
                  <span>Request Custom Corporate Tax Plan</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Deduction Breakdown & Visual Bars (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.22)] shadow-xl">
                <h4 className="text-base font-bold text-[#17252B] dark:text-[#F3FBFC] mb-4">
                  Deduction & Net Liability Breakdown
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-black/5 dark:bg-[#071C24] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)]">
                    <span className="text-[11px] text-[#526168] dark:text-[#A8C0C6] block">Net Operating Income</span>
                    <span className="text-lg font-bold text-[#17252B] dark:text-[#F3FBFC]">
                      ${taxOptResult.netOperatingIncome.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/5 dark:bg-[#071C24] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)]">
                    <span className="text-[11px] text-[#526168] dark:text-[#A8C0C6] block">Section 179 Expensed</span>
                    <span className="text-lg font-bold text-[#315F69] dark:text-[#79F1E8]">
                      ${taxOptResult.section179Deduction.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/5 dark:bg-[#071C24] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)]">
                    <span className="text-[11px] text-[#526168] dark:text-[#A8C0C6] block">20% QBI Deduction</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      ${taxOptResult.section199aQbiDeduction.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Liability Comparison Bars */}
                <div className="space-y-4 pt-4 border-t border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)]">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-[#526168] dark:text-[#A8C0C6]">Standard Unoptimized Liability:</span>
                      <span className="text-[#17252B] dark:text-[#F3FBFC]">${taxOptResult.estimatedStandardLiability.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-3.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full w-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-[#315F69] dark:text-[#79F1E8]">Optimized Pass-Through Liability:</span>
                      <span className="text-[#315F69] dark:text-[#79F1E8] font-bold">${taxOptResult.estimatedOptimizedLiability.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-3.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(5, (taxOptResult.estimatedOptimizedLiability / (taxOptResult.estimatedStandardLiability || 1)) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Total Saved Callout */}
                <div className="mt-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                      Estimated Tax Savings Captured
                    </div>
                    <div className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-400">
                      ${taxOptResult.totalTaxSaved.toLocaleString()}
                    </div>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
