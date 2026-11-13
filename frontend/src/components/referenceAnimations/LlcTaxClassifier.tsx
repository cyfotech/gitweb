import React, { useState } from 'react';
import { Building2, CheckCircle2, ArrowRight, ShieldCheck, FileText, Layers } from 'lucide-react';
import './ReferenceAnimations.css';

interface LlcOption {
  id: string;
  label: string;
  treated: string;
  ret: string;
  forms: string[];
  note: string;
  advantage: string;
}

const LLC_OPTIONS: LlcOption[] = [
  {
    id: 'single',
    label: 'Single-member, no election',
    treated: 'Disregarded Entity',
    ret: "Owner's return · Schedule C + Form 1040",
    forms: ['Schedule C', 'Schedule SE (Self-Employment)', 'Form 1040'],
    note: 'For a single individual owner, business revenue and deductible expenses pass directly into the personal tax return.',
    advantage: 'Simplest compliance, single annual tax deadline (April 15).'
  },
  {
    id: 'multi',
    label: 'Multi-member, no election',
    treated: 'Partnership',
    ret: 'Form 1065 + Schedule K-1s',
    forms: ['Form 1065', 'Schedule K-1 (per partner)', 'State Partnership Return'],
    note: 'By default, an LLC with two or more members is treated as a partnership. Net ordinary income passes through to each partner.',
    advantage: 'Flexible capital allocations, separate informational filing due March 15.'
  },
  {
    id: 'scorp',
    label: 'Elected S corporation status',
    treated: 'S Corporation (Form 2553)',
    ret: 'Form 1120-S + Schedule K-1s',
    forms: ['Form 1120-S', 'Schedule K-1', 'Form 7203 (Basis)', 'Quarterly Form 941 (W-2)'],
    note: 'Eligible LLC files Form 2553 to be taxed under Subchapter S. Owners take reasonable W-2 salary and tax-free profit distributions.',
    advantage: 'Significant self-employment tax (FICA 15.3%) compression on net distributions.'
  },
  {
    id: 'corp',
    label: 'Elected corporate treatment',
    treated: 'C Corporation (Form 8832)',
    ret: 'Form 1120',
    forms: ['Form 1120', 'State Franchise Filings', 'Corporate Minutes'],
    note: 'LLC elects to be taxed as an independent corporation. Profits are taxed at the federal corporate rate (21%).',
    advantage: 'Retained earnings flexibility, venture capital readiness, Section 1202 QSBS.'
  }
];

export function LlcTaxClassifier() {
  const [selectedLlc, setSelectedLlc] = useState<string>('scorp');
  const active = LLC_OPTIONS.find((o) => o.id === selectedLlc) || LLC_OPTIONS[0];

  return (
    <div className="ref-anim-card" aria-label="Interactive LLC Tax Classification Decision Tree">
      <div className="ref-anim-header">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-500 dark:text-[#49E3D6]" />
          <span className="text-xs font-bold text-[#12242B] dark:text-[#F4FBFC] uppercase tracking-wider font-mono">
            Entity Architecture &bull; LLC Tax Classification
          </span>
        </div>
        <div className="ref-anim-badge">
          <span>{active.treated}</span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-lg font-bold text-[#12242B] dark:text-[#F4FBFC] font-serif-editorial">
          How is your LLC taxed? It decides the return.
        </h4>
        <p className="text-xs text-[#476067] dark:text-[#A8C0C6] mt-1 leading-relaxed">
          An LLC is a legal structure created under state law. For federal tax purposes, it can be taxed in four distinct ways depending on membership and tax elections.
        </p>
      </div>

      {/* 4 Classification Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
        {LLC_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelectedLlc(opt.id)}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedLlc === opt.id
                ? 'border-emerald-500 bg-emerald-500/10 shadow-sm'
                : 'border-[#DCE5E2] dark:border-gray-800 bg-black/[0.02] dark:bg-white/[0.02] hover:border-gray-400'
            }`}
            type="button"
          >
            <div className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-[#49E3D6]">
              {opt.treated}
            </div>
            <div className="text-xs font-bold text-[#12242B] dark:text-[#F4FBFC] mt-0.5 line-clamp-1">
              {opt.label}
            </div>
          </button>
        ))}
      </div>

      {/* Active Classification Details */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E2EBE8] dark:border-[rgba(121,241,232,0.1)]">
          <div>
            <div className="text-[10px] font-mono uppercase text-gray-400 font-bold">Mandatory Federal Filing:</div>
            <div className="text-sm sm:text-base font-bold font-mono text-emerald-600 dark:text-[#49E3D6]">
              {active.ret}
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-[#49E3D6] text-xs font-bold font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Classification Verified</span>
          </div>
        </div>

        <p className="text-xs text-[#476067] dark:text-[#A8C0C6] leading-relaxed">
          {active.note}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-white dark:bg-[#071C25] border border-[#DCE5E2] dark:border-gray-800">
            <div className="text-[10px] font-bold uppercase text-gray-400 mb-1.5">Required Tax Schedules:</div>
            <div className="flex flex-wrap gap-1.5">
              {active.forms.map((f) => (
                <span key={f} className="text-[10.5px] px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 font-mono text-[#12242B] dark:text-[#E2EBE8] font-bold">
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-[#071C25] border border-[#DCE5E2] dark:border-gray-800">
            <div className="text-[10px] font-bold uppercase text-gray-400 mb-1">Strategic Advantage:</div>
            <div className="text-xs font-medium text-emerald-600 dark:text-[#49E3D6]">
              {active.advantage}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}