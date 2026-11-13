import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Calculator,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Building2,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  Percent,
  Calendar,
  Layers,
  RotateCcw,
  User,
  Users,
  Briefcase,
  FileCheck
} from 'lucide-react';
import {
  calculateUsIncomeTax,
  UsTaxCalculatorInputs,
  UsTaxCalculatorResults,
  SupportedTaxYear,
  UsFilingStatus,
  SUPPORTED_STATE_TAX_RULES,
  SUPPORTED_LOCAL_TAX_RULES
} from '../data/usTaxCalculatorEngine';
import './UsTaxCalculatorModal.css';

interface UsTaxCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookConsultation?: () => void;
}

export function UsTaxCalculatorModal({
  isOpen,
  onClose,
  onBookConsultation
}: UsTaxCalculatorModalProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Background scroll lock while calculator modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    // Prevent layout shift from scrollbar disappearing
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Guided Form Inputs State
  const [inputs, setInputs] = useState<UsTaxCalculatorInputs>({
    taxYear: 2025,
    filingStatus: 'single',
    stateOfResidence: 'TX',
    locality: 'none',

    taxpayerAge: 32,
    spouseAge: 30,
    isBlind: false,
    isSpouseBlind: false,
    qualifyingChildrenUnder17: 0,
    otherDependents: 0,

    wages: 85000,
    selfEmploymentIncome: 0,
    taxableInterest: 0,
    ordinaryDividends: 0,
    qualifiedDividends: 0,
    longTermCapitalGains: 0,
    shortTermCapitalGains: 0,
    rentalAndPassiveIncome: 0,
    otherIncome: 0,

    deductionMethod: 'standard',
    mortgageInterest: 0,
    charitableDonations: 0,
    stateLocalTaxesPaid: 0,
    medicalExpenses: 0,

    traditionalIraContribution: 0,
    hsaContribution: 0,
    studentLoanInterest: 0,

    federalWithholding: 9500,
    stateWithholding: 0,
    estimatedTaxPayments: 0
  });

  // Recalculate whenever inputs change
  const computedResult = useMemo(() => {
    return calculateUsIncomeTax(inputs);
  }, [inputs]);

  if (!isOpen || typeof document === 'undefined') return null;

  const steps = [
    { num: 1, title: 'Year & State' },
    { num: 2, title: 'Filing Status' },
    { num: 3, title: 'Income' },
    { num: 4, title: 'Deductions' },
    { num: 5, title: 'Credits' },
    { num: 6, title: 'Payments' },
    { num: 7, title: 'Review' },
    { num: 8, title: 'Results' }
  ];

  const handleInputChange = (field: keyof UsTaxCalculatorInputs, value: any) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNumericChange = (field: keyof UsTaxCalculatorInputs, valStr: string) => {
    const parsed = parseFloat(valStr.replace(/[^0-9.-]/g, '')) || 0;
    setInputs((prev) => ({
      ...prev,
      [field]: Math.max(0, parsed)
    }));
  };

  const nextStep = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetCalculator = () => {
    setCurrentStep(1);
    setInputs({
      taxYear: 2025,
      filingStatus: 'single',
      stateOfResidence: 'TX',
      locality: 'none',
      taxpayerAge: 32,
      spouseAge: 30,
      isBlind: false,
      isSpouseBlind: false,
      qualifyingChildrenUnder17: 0,
      otherDependents: 0,
      wages: 85000,
      selfEmploymentIncome: 0,
      taxableInterest: 0,
      ordinaryDividends: 0,
      qualifiedDividends: 0,
      longTermCapitalGains: 0,
      shortTermCapitalGains: 0,
      rentalAndPassiveIncome: 0,
      otherIncome: 0,
      deductionMethod: 'standard',
      mortgageInterest: 0,
      charitableDonations: 0,
      stateLocalTaxesPaid: 0,
      medicalExpenses: 0,
      traditionalIraContribution: 0,
      hsaContribution: 0,
      studentLoanInterest: 0,
      federalWithholding: 9500,
      stateWithholding: 0,
      estimatedTaxPayments: 0
    });
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Smart Tax Experts US Income Tax Calculator"
      className="ste-calc-portal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="ste-calc-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: responsive layout prevents title/actions from overlapping */}
        <div className="ste-calc-header !flex !flex-col !items-stretch !gap-3 sm:!flex-row sm:!items-center sm:!justify-between">
          {/* Brand, compliance badge, and calculator title */}
          <div className="flex w-full min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-[#27C177]/25 bg-[#27C177]/15 text-[#1E9457] dark:bg-[#35E092]/15 dark:text-[#35E092]">
              <Calculator className="h-5 w-5" aria-hidden="true" />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex min-w-0 items-start gap-1.5">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400" aria-hidden="true" />
                <span className="min-w-0 whitespace-normal break-words text-[9px] font-bold leading-snug tracking-wide text-emerald-600 dark:text-emerald-400 sm:text-[10px] md:text-xs">
                  IRS CODE COMPLIANT &bull; TAX YEARS 2024 &amp; 2025
                </span>
              </div>

              <h2 className="min-w-0 whitespace-normal break-words text-base font-bold leading-tight text-[#17252B] dark:text-[#F4FBFC] font-serif-editorial sm:text-lg md:text-xl">
                US Income Tax Calculator
              </h2>
            </div>
          </div>

          {/* Actions stay together and move below the title on narrow screens */}
          <div className="flex shrink-0 items-center justify-end gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={resetCalculator}
              aria-label="Reset calculator inputs"
              title="Reset inputs to defaults"
              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl bg-black/5 px-3 py-2 text-xs font-semibold text-[#52646A] transition-colors hover:bg-black/10 hover:text-[#17252B] dark:bg-white/5 dark:text-[#8AA3A8] dark:hover:bg-white/10 dark:hover:text-white"
            >
              <RotateCcw className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close tax calculator"
              title="Close modal"
              className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-xl bg-black/5 p-2 text-[#52646A] transition-colors hover:bg-black/10 hover:text-[#17252B] dark:bg-white/5 dark:text-[#8AA3A8] dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Multi-Step Progress Tracker: Pinned below header */}
        <div className="ste-calc-progress">
          {/* Mobile view: segmented bar + step status indicator */}
          <div className="block md:hidden">
            <div className="flex items-center justify-between text-xs font-bold text-[#17252B] dark:text-[#F4FBFC] mb-1.5">
              <span className="flex items-center gap-1.5 truncate pr-2">
                <span className="w-2 h-2 rounded-full bg-[#16A765] dark:bg-[#35E092] animate-pulse shrink-0" />
                <span className="shrink-0">Step {currentStep} of 8:</span>
                <span className="text-[#16A765] dark:text-[#35E092] font-semibold truncate">{steps[currentStep - 1].title}</span>
              </span>
              <span className="font-mono text-[11px] text-[#52646A] dark:text-[#8AA3A8] shrink-0">
                {Math.round((currentStep / 8) * 100)}%
              </span>
            </div>
            
            {/* 8-segment progress line */}
            <div className="grid grid-cols-8 gap-1 mb-2">
              {steps.map((st) => {
                const isPast = currentStep > st.num;
                const isCurrent = currentStep === st.num;
                return (
                  <button
                    key={st.num}
                    type="button"
                    onClick={() => setCurrentStep(st.num)}
                    title={`Jump to Step ${st.num}: ${st.title}`}
                    className={`h-1.5 rounded-full transition-all ${
                      isCurrent
                        ? 'bg-[#16A765] dark:bg-[#35E092] ring-2 ring-[#16A765]/30'
                        : isPast
                        ? 'bg-[#16A765]/70 dark:bg-[#35E092]/70'
                        : 'bg-gray-200 dark:bg-white/10'
                    }`}
                  />
                );
              })}
            </div>

            {/* Horizontal scrollable step pills on mobile */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {steps.map((st) => {
                const isPast = currentStep > st.num;
                const isCurrent = currentStep === st.num;
                return (
                  <button
                    key={st.num}
                    type="button"
                    onClick={() => setCurrentStep(st.num)}
                    className={`flex items-center gap-1 text-[11px] font-bold py-1 px-2.5 rounded-lg whitespace-nowrap transition-all shrink-0 ${
                      isCurrent
                        ? 'bg-[#16A765] text-white shadow-sm'
                        : isPast
                        ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-black/5 dark:bg-white/5 text-[#64748B] dark:text-[#8AA3A8]'
                    }`}
                  >
                    <span>{isPast ? '✓' : st.num}.</span>
                    <span>{st.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop/Tablet view: full horizontal step bar */}
          <div className="hidden md:flex items-center justify-between gap-1">
            {steps.map((st) => {
              const isPast = currentStep > st.num;
              const isCurrent = currentStep === st.num;

              return (
                <button
                  key={st.num}
                  type="button"
                  onClick={() => setCurrentStep(st.num)}
                  className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-2.5 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-[#16A765] text-white shadow-sm'
                      : isPast
                      ? 'text-[#16A765] dark:text-[#35E092] hover:bg-emerald-50 dark:hover:bg-white/5'
                      : 'text-[#64748B] dark:text-[#8AA3A8] opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isCurrent
                        ? 'bg-white/25 text-white'
                        : isPast
                        ? 'bg-[#16A765]/20 dark:bg-[#35E092]/20 text-[#16A765] dark:text-[#35E092]'
                        : 'bg-black/10 dark:bg-white/10'
                    }`}
                  >
                    {isPast ? '✓' : st.num}
                  </span>
                  <span className="truncate">{st.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body: Internally scrollable with min-height: 0 */}
        <div className="ste-calc-body">
          {/* STEP 1: YEAR & JURISDICTION */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-3 border-b border-[#DCECE3] dark:border-[#0E2C31]">
                <h3 className="text-lg sm:text-xl font-bold font-serif-editorial text-[#17252B] dark:text-[#F4FBFC]">
                  Step 1: Select Tax Year &amp; Jurisdiction
                </h3>
                <p className="text-xs text-[#52646A] dark:text-[#B6CAD0] mt-0.5">
                  Configure your applicable US tax filing season and residential jurisdiction.
                </p>
              </div>

              {/* Tax Year Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#315F69] dark:text-[#B6CAD0] mb-2">
                  Tax Year
                </label>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  {[2025, 2024].map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleInputChange('taxYear', year as SupportedTaxYear)}
                      className={`p-3.5 rounded-xl border text-center font-bold text-sm transition-all ${
                        inputs.taxYear === year
                          ? 'bg-emerald-50 dark:bg-[#22AF68]/15 border-2 border-[#16A765] text-[#17252B] dark:text-[#F2FBF7] shadow-sm'
                          : 'bg-white dark:bg-[#092226] border-gray-300 dark:border-[#0E2C31] text-[#17252B] dark:text-[#F2FBF7] hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                    >
                      <div>Tax Year {year}</div>
                      <div className="text-[11px] font-normal text-[#52646A] dark:text-[#88A4AB]">
                        {year === 2025 ? 'Filing Season 2026' : 'Filing Season 2025'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* State of Residence */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#315F69] dark:text-[#B6CAD0] mb-2">
                  State of Primary Residence
                </label>
                <select
                  value={inputs.stateOfResidence}
                  onChange={(e) => handleInputChange('stateOfResidence', e.target.value)}
                  className="w-full max-w-md p-3 rounded-xl border border-gray-300 dark:border-[#0E2C31] bg-white dark:bg-[#092226] text-sm font-semibold text-[#17252B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A765]"
                >
                  <optgroup label="No Personal Income Tax States (Verified)">
                    <option value="TX">Texas (TX) — No state income tax</option>
                    <option value="FL">Florida (FL) — No state income tax</option>
                    <option value="NV">Nevada (NV) — No state income tax</option>
                    <option value="TN">Tennessee (TN) — No state income tax</option>
                    <option value="WA">Washington (WA) — No earned income tax</option>
                    <option value="WY">Wyoming (WY) — No state income tax</option>
                    <option value="SD">South Dakota (SD) — No state income tax</option>
                    <option value="AK">Alaska (AK) — No state income tax</option>
                  </optgroup>
                  <optgroup label="Flat & Progressive Tax States (Verified)">
                    <option value="CA">California (CA) — 1% to 12.3% + 1% Mental Health</option>
                    <option value="NY">New York (NY) — 4% to 10.9%</option>
                    <option value="PA">Pennsylvania (PA) — 3.07% flat</option>
                    <option value="IL">Illinois (IL) — 4.95% flat</option>
                    <option value="NJ">New Jersey (NJ) — 1.4% to 10.75%</option>
                    <option value="MA">Massachusetts (MA) — 5.0% flat + 4% Millionaires</option>
                    <option value="NC">North Carolina (NC) — 4.5% flat</option>
                    <option value="AZ">Arizona (AZ) — 2.5% flat</option>
                    <option value="CO">Colorado (CO) — 4.4% flat</option>
                    <option value="IN">Indiana (IN) — 3.05% flat</option>
                  </optgroup>
                  <optgroup label="Other States (Federal accurately calculated, state verified on engagement)">
                    <option value="OH">Ohio (OH)</option>
                    <option value="VA">Virginia (VA)</option>
                    <option value="GA">Georgia (GA)</option>
                    <option value="MI">Michigan (MI)</option>
                  </optgroup>
                </select>
                <p className="text-xs text-[#52646A] dark:text-[#88A4AB] mt-1.5">
                  Our engine automatically applies verified state deduction schedules and bracket progression.
                </p>
              </div>

              {/* Local Jurisdiction (City / County) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#315F69] dark:text-[#B6CAD0] mb-2">
                  Local Jurisdiction (City / Municipality)
                </label>
                <select
                  value={inputs.locality || 'none'}
                  onChange={(e) => handleInputChange('locality', e.target.value)}
                  className="w-full max-w-md p-3 rounded-xl border border-gray-300 dark:border-[#0E2C31] bg-white dark:bg-[#092226] text-sm font-semibold text-[#17252B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A765]"
                >
                  <option value="none">None / Standard County (No local earned income tax)</option>
                  <option value="NYC">New York City, NY (Resident Tax: 3.078% to 3.876%)</option>
                  <option value="PHILA">Philadelphia, PA (Resident Wage Tax: 3.75%)</option>
                  <option value="YONKERS">Yonkers, NY (Resident Surcharge: 16.75% of NY State tax)</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: FILING STATUS & DEMOGRAPHICS */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-3 border-b border-[#DCECE3] dark:border-[#0E2C31]">
                <h3 className="text-lg sm:text-xl font-bold font-serif-editorial text-[#17252B] dark:text-[#F4FBFC]">
                  Step 2: Federal Filing Status &amp; Taxpayer Details
                </h3>
                <p className="text-xs text-[#52646A] dark:text-[#B6CAD0] mt-0.5">
                  IRS filing statuses determine standard deductions, progressive rate brackets, and credit phaseouts.
                </p>
              </div>

              {/* Dynamic Status Visuals */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-white/[0.02] border border-emerald-200 dark:border-[#0E2C31] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#16A765]/15 text-[#16A765] dark:text-[#35E092] flex items-center justify-center shrink-0">
                  {inputs.filingStatus === 'single' && <User className="w-6 h-6" />}
                  {inputs.filingStatus === 'married_joint' && <Users className="w-6 h-6" />}
                  {inputs.filingStatus === 'head_of_household' && <Users className="w-6 h-6" />}
                  {inputs.filingStatus === 'married_separate' && <User className="w-6 h-6" />}
                  {inputs.filingStatus === 'qualifying_surviving_spouse' && <Briefcase className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold capitalize text-[#17252B] dark:text-[#F4FBFC]">
                    {inputs.filingStatus.replace(/_/g, ' ')}
                  </h4>
                  <p className="text-xs text-[#52646A] dark:text-[#88A4AB]">
                    Base standard deduction: ${inputs.taxYear === 2025 ? (inputs.filingStatus === 'married_joint' ? '30,000' : inputs.filingStatus === 'head_of_household' ? '22,500' : '15,000') : (inputs.filingStatus === 'married_joint' ? '29,200' : inputs.filingStatus === 'head_of_household' ? '21,900' : '14,600')}
                  </p>
                </div>
              </div>

              {/* Status Radio Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: 'single', label: 'Single', desc: 'Unmarried or legally separated on Dec 31' },
                  { id: 'married_joint', label: 'Married Filing Jointly', desc: 'Married couple filing combined return' },
                  { id: 'married_separate', label: 'Married Filing Separately', desc: 'Married filers choosing separate returns' },
                  { id: 'head_of_household', label: 'Head of Household', desc: 'Unmarried paying >50% cost of home for dependent' },
                  { id: 'qualifying_surviving_spouse', label: 'Qualifying Surviving Spouse', desc: 'Spouse deceased within 2 preceding years with dependent' }
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleInputChange('filingStatus', st.id as UsFilingStatus)}
                    className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all ${
                      inputs.filingStatus === st.id
                        ? 'bg-emerald-50 dark:bg-[#22AF68]/15 border-2 border-[#16A765] text-[#17252B] dark:text-[#F2FBF7] shadow-sm ring-1 ring-[#16A765]/20'
                        : 'bg-white dark:bg-[#092226] border-gray-300 dark:border-[#0E2C31] text-[#17252B] dark:text-[#F2FBF7] hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="font-bold text-sm text-[#17252B] dark:text-[#F2FBF7]">{st.label}</div>
                    <div className="text-xs text-[#52646A] dark:text-[#88A4AB] mt-1">{st.desc}</div>
                  </button>
                ))}
              </div>

              {/* Demographics & Dependents */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-[#17252B] dark:text-[#F4FBFC] mb-1">Your Age</label>
                  <input
                    type="number"
                    min="18"
                    max="115"
                    value={inputs.taxpayerAge}
                    onChange={(e) => handleNumericChange('taxpayerAge', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#0E2C31] bg-white dark:bg-[#092226] text-sm font-semibold text-[#17252B] dark:text-white"
                  />
                  <span className="text-[10px] text-[#52646A] dark:text-[#88A4AB] mt-1 block">Age 65+ adds senior standard deduction</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17252B] dark:text-[#F4FBFC] mb-1">Qualifying Children (&lt; 17)</label>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    value={inputs.qualifyingChildrenUnder17}
                    onChange={(e) => handleNumericChange('qualifyingChildrenUnder17', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#0E2C31] bg-white dark:bg-[#092226] text-sm font-semibold text-[#17252B] dark:text-white"
                  />
                  <span className="text-[10px] text-[#52646A] dark:text-[#88A4AB] mt-1 block">$2,000 Child Tax Credit per eligible child</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17252B] dark:text-[#F4FBFC] mb-1">Other Dependents</label>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    value={inputs.otherDependents}
                    onChange={(e) => handleNumericChange('otherDependents', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#0E2C31] bg-white dark:bg-[#092226] text-sm font-semibold text-[#17252B] dark:text-white"
                  />
                  <span className="text-[10px] text-[#52646A] dark:text-[#88A4AB] mt-1 block">$500 Credit for Other Dependents</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: INCOME INFORMATION */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-3 border-b border-[#DCECE3] dark:border-[#0E2C31]">
                <h3 className="text-lg sm:text-xl font-bold font-serif-editorial text-[#17252B] dark:text-[#F4FBFC]">
                  Step 3: Income Categories
                </h3>
                <p className="text-xs text-[#52646A] dark:text-[#B6CAD0] mt-0.5">
                  Categorize your income streams. Capital gains and qualified dividends are taxed at preferential rates.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17252B] dark:text-[#F4FBFC] mb-1">Wages, Salaries &amp; Tips (Form W-2)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">$</span>
                    <input
                      type="number"
                      value={inputs.wages}
                      onChange={(e) => handleNumericChange('wages', e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#0E2C31] bg-white dark:bg-[#092226] text-sm font-semibold text-[#17252B] dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17252B] dark:text-[#F4FBFC] mb-1">Self-Employment / 1099 Net Profit</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">$</span>
                    <input
                      type="number"
                      value={inputs.selfEmploymentIncome}
                      onChange={(e) => handleNumericChange('selfEmploymentIncome', e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#0E2C31] bg-white dark:bg-[#092226] text-sm font-semibold text-[#17252B] dark:text-white"
                    />
                  </div>
                  <span className="text-[10px] text-[#52646A] dark:text-[#88A4AB] mt-1 block">Subject to Schedule SE (15.3% tax with 50% deduction)</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17252B] dark:text-[#F4FBFC] mb-1">Taxable Interest &amp; Ordinary Dividends</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">$</span>
                    <input
                      type="number"
                      value={inputs.taxableInterest}
                      onChange={(e) => handleNumericChange('taxableInterest', e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#0E2C31] bg-white dark:bg-[#092226] text-sm font-semibold text-[#17252B] dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17252B] dark:text-[#F4FBFC] mb-1">Qualified Dividends &bull; Preferential Rate</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">$</span>
                    <input
                      type="number"
                      value={inputs.qualifiedDividends}
                      onChange={(e) => handleNumericChange('qualifiedDividends', e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#0E2C31] bg-white dark:bg-[#092226] text-sm font-semibold text-[#17252B] dark:text-white"
                    />
                  </div>
                  <span className="text-[10px] text-[#52646A] dark:text-[#88A4AB] mt-1 block">Taxed at 0%, 15%, or 20% depending on income</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17252B] dark:text-[#F4FBFC] mb-1">Long-Term Capital Gains (&gt; 1 Year)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">$</span>
                    <input
                      type="number"
                      value={inputs.longTermCapitalGains}
                      onChange={(e) => handleNumericChange('longTermCapitalGains', e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#0E2C31] bg-white dark:bg-[#092226] text-sm font-semibold text-[#17252B] dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17252B] dark:text-[#F4FBFC] mb-1">Rental &amp; Pass-Through Income</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">$</span>
                    <input
                      type="number"
                      value={inputs.rentalAndPassiveIncome}
                      onChange={(e) => handleNumericChange('rentalAndPassiveIncome', e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#0E2C31] bg-white dark:bg-[#092226] text-sm font-semibold text-[#17252B] dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Real-time Subtotal */}
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-[#16A765] dark:text-[#35E092]">Total Estimated Gross Income:</span>
                <span className="text-base sm:text-lg font-bold font-mono text-[#17252B] dark:text-white">
                  ${(inputs.wages + inputs.selfEmploymentIncome + inputs.taxableInterest + inputs.qualifiedDividends + inputs.longTermCapitalGains + inputs.rentalAndPassiveIncome).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: DEDUCTIONS & ADJUSTMENTS */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-3 border-b border-[#DCECE3] dark:border-[#0E2C31]">
                <h3 className="text-lg sm:text-xl font-bold font-serif-editorial text-[#17252B] dark:text-[#F4FBFC]">
                  Step 4: Deductions &amp; Above-the-Line Adjustments
                </h3>
                <p className="text-xs text-[#52646A] dark:text-[#B6CAD0] mt-0.5">
                  Choose standard deduction or itemize. Our engine automatically applies the highest legal deduction.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                <button
                  type="button"
                  onClick={() => handleInputChange('deductionMethod', 'standard')}
                  className={`p-3.5 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all ${
                    inputs.deductionMethod === 'standard'
                      ? 'bg-emerald-50 dark:bg-[#22AF68]/15 border-2 border-[#16A765] text-[#17252B] dark:text-[#F2FBF7] shadow-sm'
                      : 'bg-white dark:bg-[#092226] border-gray-300 dark:border-[#0E2C31] text-[#17252B] dark:text-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Standard (${computedResult.standardDeductionAllowed.toLocaleString()})
                </button>

                <button
                  type="button"
                  onClick={() => handleInputChange('deductionMethod', 'itemized')}
                  className={`p-3.5 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all ${
                    inputs.deductionMethod === 'itemized'
                      ? 'bg-emerald-50 dark:bg-[#22AF68]/15 border-2 border-[#16A765] text-[#17252B] dark:text-[#F2FBF7] shadow-sm'
                      : 'bg-white dark:bg-[#092226] border-gray-300 dark:border-[#0E2C31] text-[#17252B] dark:text-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Itemized Deductions (Schedule A)
                </button>
              </div>

              {/* If itemized selected */}
              {inputs.deductionMethod === 'itemized' && (
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-[#0E2C31] grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#17252B] dark:text-[#F4FBFC] mb-1">Mortgage Interest Paid</label>
                    <input
                      type="number"
                      value={inputs.mortgageInterest || 0}
                      onChange={(e) => handleNumericChange('mortgageInterest', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#0E2C31] bg-white dark:bg-[#092226] text-sm text-[#17252B] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#17252B] dark:text-[#F4FBFC] mb-1">Charitable Donations</label>
                    <input
                      type="number"
                      value={inputs.charitableDonations || 0}
                      onChange={(e) => handleNumericChange('charitableDonations', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#0E2C31] bg-white dark:bg-[#092226] text-sm text-[#17252B] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#17252B] dark:text-[#F4FBFC] mb-1">State &amp; Local Taxes (SALT &bull; Capped at $10k)</label>
                    <input
                      type="number"
                      value={inputs.stateLocalTaxesPaid || 0}
                      onChange={(e) => handleNumericChange('stateLocalTaxesPaid', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#0E2C31] bg-white dark:bg-[#092226] text-sm text-[#17252B] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#17252B] dark:text-[#F4FBFC] mb-1">Medical Expenses (Exceeding 7.5% AGI)</label>
                    <input
                      type="number"
                      value={inputs.medicalExpenses || 0}
                      onChange={(e) => handleNumericChange('medicalExpenses', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#0E2C31] bg-white dark:bg-[#092226] text-sm text-[#17252B] dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Above-the-line adjustments */}
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#315F69] dark:text-[#B6CAD0] mb-3">
                  Above-the-Line Adjustments (Directly Reducing AGI)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#17252B] dark:text-[#F4FBFC] mb-1">HSA Contributions</label>
                    <input
                      type="number"
                      value={inputs.hsaContribution || 0}
                      onChange={(e) => handleNumericChange('hsaContribution', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#0E2C31] bg-white dark:bg-[#092226] text-sm font-semibold text-[#17252B] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#17252B] dark:text-[#F4FBFC] mb-1">Traditional IRA Contributions</label>
                    <input
                      type="number"
                      value={inputs.traditionalIraContribution || 0}
                      onChange={(e) => handleNumericChange('traditionalIraContribution', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#0E2C31] bg-white dark:bg-[#092226] text-sm font-semibold text-[#17252B] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#17252B] dark:text-[#F4FBFC] mb-1">Student Loan Interest (Capped $2.5k)</label>
                    <input
                      type="number"
                      value={inputs.studentLoanInterest || 0}
                      onChange={(e) => handleNumericChange('studentLoanInterest', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#0E2C31] bg-white dark:bg-[#092226] text-sm font-semibold text-[#17252B] dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: CREDITS */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-3 border-b border-[#DCECE3] dark:border-[#0E2C31]">
                <h3 className="text-lg sm:text-xl font-bold font-serif-editorial text-[#17252B] dark:text-[#F4FBFC]">
                  Step 5: Eligible Tax Credits
                </h3>
                <p className="text-xs text-[#52646A] dark:text-[#B6CAD0] mt-0.5">
                  Tax credits provide dollar-for-dollar reductions of your federal tax liability.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-[#17252B] dark:text-[#F2FBF7]">Child Tax Credit</div>
                    <div className="text-xs text-[#52646A] dark:text-[#88A4AB]">
                      Based on {inputs.qualifyingChildrenUnder17} qualifying child(ren) under 17
                    </div>
                  </div>
                  <span className="font-mono font-bold text-base text-[#16A765] dark:text-[#35E092]">
                    ${computedResult.childTaxCredit.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-emerald-200 dark:border-emerald-500/20">
                  <div>
                    <div className="font-bold text-sm text-[#17252B] dark:text-[#F2FBF7]">Other Dependent Credit</div>
                    <div className="text-xs text-[#52646A] dark:text-[#88A4AB]">
                      Based on {inputs.otherDependents} other qualifying dependent(s)
                    </div>
                  </div>
                  <span className="font-mono font-bold text-base text-[#16A765] dark:text-[#35E092]">
                    ${computedResult.otherDependentCredit.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-emerald-200 dark:border-emerald-500/20">
                  <div>
                    <div className="font-bold text-sm text-[#17252B] dark:text-[#F2FBF7]">Earned Income Tax Credit (EITC)</div>
                    <div className="text-xs text-[#52646A] dark:text-[#88A4AB]">
                      Calculated on earned income &amp; family size
                    </div>
                  </div>
                  <span className="font-mono font-bold text-base text-[#16A765] dark:text-[#35E092]">
                    ${computedResult.earnedIncomeCredit.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: PAYMENTS & WITHHOLDING */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-3 border-b border-[#DCECE3] dark:border-[#0E2C31]">
                <h3 className="text-lg sm:text-xl font-bold font-serif-editorial text-[#17252B] dark:text-[#F4FBFC]">
                  Step 6: Taxes Already Paid / Withheld
                </h3>
                <p className="text-xs text-[#52646A] dark:text-[#B6CAD0] mt-0.5">
                  Compare your actual payments with computed tax liability to calculate your refund or balance payable.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17252B] dark:text-[#F4FBFC] mb-1">Federal Tax Withheld (Box 2)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">$</span>
                    <input
                      type="number"
                      value={inputs.federalWithholding}
                      onChange={(e) => handleNumericChange('federalWithholding', e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#0E2C31] bg-white dark:bg-[#092226] text-sm font-semibold text-[#17252B] dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17252B] dark:text-[#F4FBFC] mb-1">State Tax Withheld (Box 17)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">$</span>
                    <input
                      type="number"
                      value={inputs.stateWithholding}
                      onChange={(e) => handleNumericChange('stateWithholding', e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#0E2C31] bg-white dark:bg-[#092226] text-sm font-semibold text-[#17252B] dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17252B] dark:text-[#F4FBFC] mb-1">Quarterly Estimated Payments</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">$</span>
                    <input
                      type="number"
                      value={inputs.estimatedTaxPayments}
                      onChange={(e) => handleNumericChange('estimatedTaxPayments', e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#0E2C31] bg-white dark:bg-[#092226] text-sm font-semibold text-[#17252B] dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: REVIEW */}
          {currentStep === 7 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-3 border-b border-[#DCECE3] dark:border-[#0E2C31]">
                <h3 className="text-lg sm:text-xl font-bold font-serif-editorial text-[#17252B] dark:text-[#F4FBFC]">
                  Step 7: Review Entered Data
                </h3>
                <p className="text-xs text-[#52646A] dark:text-[#B6CAD0] mt-0.5">
                  Verify all parameters before generating your diagnostic tax estimate.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-[#0E2C31] space-y-2.5">
                  <div className="font-bold text-sm text-[#17252B] dark:text-[#F2FBF7] mb-2 pb-1.5 border-b border-gray-200 dark:border-white/10">
                    Filing Parameters
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#52646A] dark:text-[#88A4AB]">Tax Year:</span>
                    <span className="font-bold text-[#17252B] dark:text-white">{inputs.taxYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#52646A] dark:text-[#88A4AB]">Filing Status:</span>
                    <span className="font-bold text-[#17252B] dark:text-white capitalize">{inputs.filingStatus.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#52646A] dark:text-[#88A4AB]">Primary State:</span>
                    <span className="font-bold text-[#17252B] dark:text-white">{computedResult.stateName}</span>
                  </div>
                  {computedResult.localityName && (
                    <div className="flex justify-between">
                      <span className="text-[#52646A] dark:text-[#88A4AB]">Local Municipality:</span>
                      <span className="font-bold text-[#17252B] dark:text-white">{computedResult.localityName}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-[#0E2C31] space-y-2.5">
                  <div className="font-bold text-sm text-[#17252B] dark:text-[#F2FBF7] mb-2 pb-1.5 border-b border-gray-200 dark:border-white/10">
                    Financial Totals
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#52646A] dark:text-[#88A4AB]">Total Gross Income:</span>
                    <span className="font-bold text-[#17252B] dark:text-white font-mono">${computedResult.totalGrossIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#52646A] dark:text-[#88A4AB]">Adjusted Gross Income (AGI):</span>
                    <span className="font-bold text-[#17252B] dark:text-white font-mono">${computedResult.adjustedGrossIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#52646A] dark:text-[#88A4AB]">Deduction Applied ({computedResult.deductionTypeUsed}):</span>
                    <span className="font-bold text-[#16A765] dark:text-[#35E092] font-mono">-${computedResult.totalDeductionApplied.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#52646A] dark:text-[#88A4AB]">Total Paid &amp; Withheld:</span>
                    <span className="font-bold text-[#17252B] dark:text-white font-mono">${computedResult.totalPaymentsAndWithholding.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3.5 rounded-full text-sm font-bold bg-[#16A765] hover:bg-[#128a53] text-white shadow-lg transition-all active:scale-95"
                >
                  Generate Official Diagnostic Estimate &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 8: COMPREHENSIVE RESULT DASHBOARD */}
          {currentStep === 8 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Highlight Refund or Balance Card */}
              <div
                className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-5 ${
                  computedResult.isRefund
                    ? 'bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white dark:from-[#092b23] dark:via-[#071c25] dark:to-[#041417] border-emerald-500/40'
                    : 'bg-gradient-to-br from-amber-50 via-orange-50/60 to-white dark:from-amber-950/40 dark:via-[#1c1307] dark:to-[#140c04] border-amber-500/40'
                }`}
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/10 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#16A765] dark:text-[#35E092]" />
                    <span className="text-[#17252B] dark:text-white">Calculated Federal &amp; State Result</span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#52646A] dark:text-[#B6CAD0]">
                    {computedResult.isRefund ? 'Estimated Tax Refund' : 'Estimated Remaining Balance Due'}
                  </h3>
                  <div className={`text-3xl sm:text-4xl md:text-5xl font-black font-mono tracking-tight mt-1 ${computedResult.isRefund ? 'text-[#16A765] dark:text-[#35E092]' : 'text-amber-600 dark:text-amber-400'}`}>
                    ${Math.abs(computedResult.refundOrBalanceDue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-[#52646A] dark:text-[#B6CAD0] mt-1.5 max-w-md">
                    {computedResult.isRefund
                      ? 'Your withholding and estimated payments exceed your total combined tax liability.'
                      : 'Additional balance required to satisfy combined federal, state, and local obligations.'}
                  </p>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/10">
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#071C25] border border-gray-200 dark:border-[#0E2C31] text-xs shadow-xs text-center sm:text-right">
                    <div className="text-[#52646A] dark:text-[#88A4AB]">Effective Federal Rate</div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-[#16A765] dark:text-[#35E092]">
                      {computedResult.effectiveFederalRate}%
                    </div>
                  </div>
                  <div className="text-[11px] text-[#52646A] dark:text-[#88A4AB]">
                    Marginal Bracket: <strong className="text-[#17252B] dark:text-white font-mono">{computedResult.marginalFederalRate}%</strong>
                  </div>
                </div>
              </div>

              {/* Itemized Calculation Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Federal Liability Column */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200 dark:border-[#0E2C31] space-y-3">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-gray-200 dark:border-[#0E2C31]">
                    <Building2 className="w-4 h-4 text-[#16A765]" />
                    <h4 className="font-bold text-sm text-[#17252B] dark:text-white">Federal Tax Calculation Breakdown</h4>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#52646A] dark:text-[#88A4AB]">Total Gross Income:</span>
                      <span className="font-semibold text-[#17252B] dark:text-white font-mono">${computedResult.totalGrossIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#52646A] dark:text-[#88A4AB]">Adjustments to Income:</span>
                      <span className="font-semibold text-[#16A765] dark:text-[#35E092] font-mono">-${computedResult.adjustmentsToIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#52646A] dark:text-[#88A4AB]">Adjusted Gross Income (AGI):</span>
                      <span className="font-semibold font-mono text-[#17252B] dark:text-white">${computedResult.adjustedGrossIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#52646A] dark:text-[#88A4AB]">Deduction Applied ({computedResult.deductionTypeUsed}):</span>
                      <span className="font-semibold text-[#16A765] dark:text-[#35E092] font-mono">-${computedResult.totalDeductionApplied.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-1 border-t border-gray-200 dark:border-[#0E2C31] text-[#17252B] dark:text-white">
                      <span>Taxable Ordinary Income:</span>
                      <span className="font-mono">${computedResult.taxableOrdinaryIncome.toLocaleString()}</span>
                    </div>
                    {computedResult.taxablePreferentialIncome > 0 && (
                      <div className="flex justify-between font-bold text-[#17252B] dark:text-white">
                        <span>Taxable Capital Gains / Dividends:</span>
                        <span className="font-mono">${computedResult.taxablePreferentialIncome.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-1">
                      <span className="text-[#52646A] dark:text-[#88A4AB]">Ordinary Income Tax:</span>
                      <span className="text-[#17252B] dark:text-white font-mono">${computedResult.ordinaryIncomeTax.toLocaleString()}</span>
                    </div>
                    {computedResult.preferentialIncomeTax > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[#52646A] dark:text-[#88A4AB]">Preferential Cap Gains Tax:</span>
                        <span className="text-[#17252B] dark:text-white font-mono">${computedResult.preferentialIncomeTax.toLocaleString()}</span>
                      </div>
                    )}
                    {computedResult.selfEmploymentTax > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[#52646A] dark:text-[#88A4AB]">Self-Employment Tax (SE):</span>
                        <span className="text-[#17252B] dark:text-white font-mono">+${computedResult.selfEmploymentTax.toLocaleString()}</span>
                      </div>
                    )}
                    {computedResult.additionalMedicareTax > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[#52646A] dark:text-[#88A4AB]">Additional Medicare Tax (0.9%):</span>
                        <span className="text-[#17252B] dark:text-white font-mono">+${computedResult.additionalMedicareTax.toLocaleString()}</span>
                      </div>
                    )}
                    {computedResult.netInvestmentIncomeTax > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[#52646A] dark:text-[#88A4AB]">Net Investment Income Tax (3.8%):</span>
                        <span className="text-[#17252B] dark:text-white font-mono">+${computedResult.netInvestmentIncomeTax.toLocaleString()}</span>
                      </div>
                    )}
                    {computedResult.totalTaxCredits > 0 && (
                      <div className="flex justify-between text-[#16A765] dark:text-[#35E092]">
                        <span>Total Tax Credits Applied:</span>
                        <span className="font-mono">-${computedResult.totalTaxCredits.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-sm pt-2 border-t border-gray-200 dark:border-[#0E2C31] text-[#17252B] dark:text-[#35E092]">
                      <span>Net Federal Tax Liability:</span>
                      <span className="font-mono">${computedResult.netFederalTaxLiability.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* State, Local & Payment Totals Column */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200 dark:border-[#0E2C31] space-y-3">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-gray-200 dark:border-[#0E2C31]">
                    <ShieldCheck className="w-4 h-4 text-[#16A765]" />
                    <h4 className="font-bold text-sm text-[#17252B] dark:text-white">State &amp; Local Tax Summary</h4>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#52646A] dark:text-[#88A4AB]">State Jurisdiction:</span>
                      <span className="font-semibold text-[#17252B] dark:text-white">{computedResult.stateName} ({computedResult.stateCode})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#52646A] dark:text-[#88A4AB]">State Taxable Base:</span>
                      <span className="font-semibold text-[#17252B] dark:text-white font-mono">${computedResult.stateTaxableIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-[#52646A] dark:text-[#88A4AB]">State Income Tax:</span>
                      <span className="font-mono text-[#17252B] dark:text-white">${computedResult.stateTaxLiability.toLocaleString()}</span>
                    </div>
                    {computedResult.stateNotes && (
                      <div className="text-[11px] text-[#52646A] dark:text-[#88A4AB] italic bg-white dark:bg-black/20 p-2 rounded-lg border border-gray-200 dark:border-white/5">
                        {computedResult.stateNotes}
                      </div>
                    )}

                    {computedResult.localTaxLiability > 0 && (
                      <div className="flex justify-between font-semibold pt-1">
                        <span className="text-[#52646A] dark:text-[#88A4AB]">Local Municipality Tax:</span>
                        <span className="font-mono text-[#17252B] dark:text-white">${computedResult.localTaxLiability.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between font-bold text-sm pt-2.5 border-t border-gray-200 dark:border-[#0E2C31] text-[#17252B] dark:text-white">
                      <span>Total Combined Tax:</span>
                      <span className="font-mono text-[#16A765] dark:text-[#35E092]">${computedResult.totalCombinedTaxLiability.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xs text-[#52646A] dark:text-[#B6CAD0]">
                      <span>Total Paid / Withheld:</span>
                      <span className="font-mono">${computedResult.totalPaymentsAndWithholding.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Consultation Banner */}
                  <div className="pt-2">
                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 space-y-2">
                      <div className="font-bold text-xs text-[#17252B] dark:text-[#F2FBF7]">
                        Ready to File with Certified CPA Verification?
                      </div>
                      <p className="text-[11px] text-[#52646A] dark:text-[#B6CAD0]">
                        Connect directly with our senior Enrolled Agents to claim every eligible deduction and ensure zero audit exposure.
                      </p>
                      {onBookConsultation && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onBookConsultation();
                          }}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-[#16A765] hover:bg-[#128a53] text-white transition-all shadow-sm"
                        >
                          <span>Schedule Tax Discovery Call</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Statutory Disclaimer */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-gray-100/70 dark:bg-white/5 text-[11px] text-[#52646A] dark:text-[#88A4AB] leading-relaxed border border-gray-200/60 dark:border-white/5">
                <strong>Important Legal &amp; Compliance Notice:</strong> This calculator provides an educational diagnostic estimate based on IRS Revenue Procedure 2024-40 (2025 tax year adjustments) and verified state tax tables as of October 2026. It does not constitute official legal or tax filing advice and does not substitute for an engagement with a licensed Certified Public Accountant (CPA) or Enrolled Agent (EA).
              </div>
            </div>
          )}
        </div>

        {/* Footer: Pinned at bottom */}
        <div className="ste-calc-footer">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              currentStep === 1
                ? 'opacity-40 cursor-not-allowed text-gray-400'
                : 'text-[#17252B] dark:text-white bg-gray-200/80 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-xs sm:text-sm font-bold text-[#52646A] dark:text-[#8AA3A8]">
            Step {currentStep} of 8
          </div>

          {currentStep < 8 ? (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#16A765] hover:bg-[#128a53] text-white shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <span>{currentStep === 7 ? 'Calculate Tax' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold border-2 border-[#16A765] text-[#16A765] dark:text-[#35E092] hover:bg-[#16A765]/10 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>New Calculation</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default UsTaxCalculatorModal;