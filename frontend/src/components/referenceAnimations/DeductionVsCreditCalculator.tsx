import React, { useState } from 'react';
import { Calculator, ArrowRight, Sparkles, Scale, Info } from 'lucide-react';
import './ReferenceAnimations.css';

const TAX_BRACKETS = [10, 12, 22, 24, 32, 35, 37];

export function DeductionVsCreditCalculator() {
  const [deductionAmount, setDeductionAmount] = useState<number>(10000);
  const [taxRate, setTaxRate] = useState<number>(24);

  const taxSaved = Math.round(deductionAmount * (taxRate / 100));
  const creditSaved = deductionAmount; // Credits are dollar-for-dollar
  const unshieldedAmount = deductionAmount - taxSaved;

  return (
    <div className="ref-anim-card" aria-label="Tax Deduction vs Tax Credit Calculator">
      <div className="ref-anim-header">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-emerald-500 dark:text-[#49E3D6]" />
          <span className="text-xs font-bold text-[#12242B] dark:text-[#F4FBFC] uppercase tracking-wider font-mono">
            Strategic Calculator &bull; Deduction vs. Credit Reality
          </span>
        </div>
        <div className="ref-anim-badge">
          <span>{taxRate}% Marginal Bracket</span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-lg font-bold text-[#12242B] dark:text-[#F4FBFC] font-serif-editorial">
          A ${deductionAmount.toLocaleString()} deduction is NOT ${deductionAmount.toLocaleString()} saved.
        </h4>
        <p className="text-xs text-[#476067] dark:text-[#A8C0C6] mt-1 leading-relaxed">
          Deductions reduce taxable income by your marginal rate, whereas tax credits reduce tax liability dollar-for-dollar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Sliders Box */}
        <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)] space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-bold">
              <span>Proposed Deduction Amount:</span>
              <span className="font-mono text-emerald-600 dark:text-[#49E3D6]">
                ${deductionAmount.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="2000"
              max="50000"
              step="1000"
              value={deductionAmount}
              onChange={(e) => setDeductionAmount(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-gray-400 font-mono mt-1">
              <span>$2,000</span>
              <span>$25,000</span>
              <span>$50,000</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5 font-bold">
              <span>Marginal Federal Tax Bracket:</span>
              <span className="font-mono text-emerald-600 dark:text-[#49E3D6]">{taxRate}%</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {TAX_BRACKETS.map((rate) => (
                <button
                  key={rate}
                  onClick={() => setTaxRate(rate)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    taxRate === rate
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-black/5 dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  type="button"
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Comparison Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col justify-between">
            <div>
              <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">
                Actual Tax Saved (Deduction)
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-[#49E3D6] mt-1">
                ${taxSaved.toLocaleString()}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                Calculated at {taxRate}% marginal tax rate.
              </div>
            </div>
            <div className="text-[9px] font-mono text-gray-400 mt-2">
              Out of pocket: ${unshieldedAmount.toLocaleString()}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/[0.04] dark:bg-white/[0.04] border border-gray-300 dark:border-gray-700 flex flex-col justify-between">
            <div>
              <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">
                Equivalent Tax Credit
              </span>
              <div className="text-2xl font-bold font-mono text-[#12242B] dark:text-[#F4FBFC] mt-1">
                ${creditSaved.toLocaleString()}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                Dollar-for-dollar liability reduction.
              </div>
            </div>
            <div className="text-[9px] font-mono text-emerald-600 dark:text-[#49E3D6] font-bold mt-2">
              +${(creditSaved - taxSaved).toLocaleString()} higher value
            </div>
          </div>
        </div>
      </div>

      <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[#DCE5E2] dark:border-gray-800 text-[11px] text-gray-500 flex items-center justify-between">
        <span>Strategic insight: Spending money purely for a tax write-off still expends ${unshieldedAmount.toLocaleString()} in net cash.</span>
        <span className="font-mono text-emerald-600 dark:text-[#49E3D6] font-bold text-xs shrink-0">Comprehensive Strategy</span>
      </div>
    </div>
  );
}