import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import './ReferenceAnimations.css';

interface DoubtItem {
  q: string;
  a: string;
  tag: string;
  detail: string;
}

const DOUBTS: DoubtItem[] = [
  {
    q: 'W-2, freelance 1099s and a rental property, all on one return?',
    a: 'We organize every schedule for you into a unified Form 1040.',
    tag: 'Individual Tax',
    detail: 'Schedule C captures 1099 business write-offs, Schedule E calculates rental property depreciation, and Form 1040 combines everything without audit flags.'
  },
  {
    q: 'Books months behind and bank balances that never match?',
    a: 'Catch-up bookkeeping cleans and reconciles your historical records.',
    tag: 'Bookkeeping',
    detail: 'We pull bank and credit card statements, categorize backlogged transactions, clear suspense balances, and deliver audit-ready reconciled ledgers.'
  },
  {
    q: 'Not sure your payroll taxes reconcile to what was filed?',
    a: 'We reconcile every pay run against quarterly Form 941 deposits.',
    tag: 'Payroll',
    detail: 'Eliminates IRS and state late-deposit penalties by matching payroll tax trust funds against actual agency transmittals.'
  },
  {
    q: 'Worried April will bring a tax bill you didn’t see coming?',
    a: 'Get a quarterly tax projection with safe-harbor payment milestones.',
    tag: 'Tax Planning',
    detail: 'We calculate exact year-to-date income and model your federal and state tax liability before the tax year closes while deductions are still actionable.'
  },
  {
    q: 'Don’t know who owes you, or who you owe, right now?',
    a: 'See it in one real-time AP and AR aging report.',
    tag: 'AP / AR',
    detail: 'Clear visibility across 30, 60, and 90-day aging brackets ensures invoices get paid promptly and vendor obligations remain in good standing.'
  },
  {
    q: 'Have a bank account, company or investment outside the US?',
    a: 'We audit your FinCEN 114 (FBAR) and FATCA Form 8938 duties.',
    tag: 'Foreign Compliance',
    detail: 'Cross-border reporting carries steep statutory penalties. We verify whether aggregate foreign accounts exceed $10,000 and file accurate disclosures.'
  },
  {
    q: 'Running out of time before the upcoming filing deadline?',
    a: 'We file your Form 4868 (Individual) or Form 7004 (Business) extension.',
    tag: 'Tax Filing',
    detail: 'An automatic 6-month extension protects against failure-to-file penalties while accurate tax estimates are calculated.'
  }
];

export function InteractiveDoubtSolver() {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const active = DOUBTS[selectedIdx];

  return (
    <div className="ref-anim-card" aria-label="Interactive Doubt Solver">
      <div className="ref-anim-header">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-emerald-500 dark:text-[#49E3D6]" />
          <span className="text-xs font-bold text-[#12242B] dark:text-[#F4FBFC] uppercase tracking-wider font-mono">
            Got a Doubt? The Answer is on the Button.
          </span>
        </div>
        <div className="ref-anim-badge">
          <span>{active.tag}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Clickable Question Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          {DOUBTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                selectedIdx === idx
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-sm'
                  : 'border-[#DCE5E2] dark:border-gray-800 bg-black/[0.02] dark:bg-white/[0.02] hover:border-gray-400'
              }`}
              type="button"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 font-bold ${
                  selectedIdx === idx ? 'bg-emerald-500 text-white' : 'bg-black/10 dark:bg-white/10 text-gray-500'
                }`}>
                  {idx + 1}
                </span>
                <span className="text-xs font-semibold text-[#12242B] dark:text-[#F4FBFC] truncate">
                  {item.q}
                </span>
              </div>
              <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                selectedIdx === idx ? 'text-emerald-500 translate-x-0.5' : 'text-gray-400'
              }`} />
            </button>
          ))}
        </div>

        {/* Right: Instant Answer Callout (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)]">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-600 dark:text-[#49E3D6]">
                {active.tag} Solution
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#49E3D6] font-bold font-mono">
                Verified Answer
              </span>
            </div>

            <h4 className="text-base sm:text-lg font-bold text-[#12242B] dark:text-[#F4FBFC] font-serif-editorial leading-snug mb-2">
              &ldquo;{active.a}&rdquo;
            </h4>

            <p className="text-xs text-[#476067] dark:text-[#A8C0C6] leading-relaxed">
              {active.detail}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E2EBE8] dark:border-gray-800 flex items-center justify-between text-xs">
            <span className="text-gray-400 font-mono text-[10px]">Smart Tax Expertss Methodology</span>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-[#49E3D6] font-bold text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Direct Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}