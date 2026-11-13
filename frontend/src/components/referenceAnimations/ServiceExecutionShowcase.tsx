import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Receipt,
  Globe2,
  Send,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import './ReferenceAnimations.css';

export function ServiceExecutionShowcase() {
  const [activeTab, setActiveTab] = useState<'BKP' | 'PAY' | 'APAR' | 'INTL' | 'FILE'>('BKP');
  const [aparMode, setAparMode] = useState<'ar' | 'ap'>('ar');
  const [fbarAmount, setFbarAmount] = useState<number>(14500);
  const [fileStep, setFileStep] = useState<number>(4);

  // Bookkeeping Reconciliation Feed Data
  const recTransactions = [
    { desc: 'Stripe merchant payout batch', amt: '+$2,480.00', status: 'Matched ✓', color: 'emerald' },
    { desc: 'Commercial office lease (ACH)', amt: '−$3,200.00', status: 'Matched ✓', color: 'slate' },
    { desc: 'Corporate client consulting fee', amt: '+$1,240.00', status: 'Matched ✓', color: 'emerald' },
    { desc: 'Commercial bank maintenance fee', amt: '−$35.00', status: 'Auto-Matched ✓', color: 'amber' },
    { desc: 'Semi-monthly payroll disbursement', amt: '−$6,812.40', status: 'Reconciled ✓', color: 'slate' },
  ];

  // Waterfall Gross-to-Net Data
  const payrollBars = [
    { label: 'Gross Wages', amt: '$5,000.00', pct: 100, fill: '#10B981', note: 'Base Pay' },
    { label: 'Federal Tax', amt: '−$520.00', pct: 10.4, fill: '#EF4444', note: 'W-4 Tier' },
    { label: 'Social Security', amt: '−$310.00', pct: 6.2, fill: '#F59E0B', note: 'OASDI' },
    { label: 'Medicare', amt: '−$72.50', pct: 1.45, fill: '#F59E0B', note: '1.45%' },
    { label: 'State Income', amt: '−$200.00', pct: 4.0, fill: '#3B82F6', note: 'Withholding' },
    { label: '401(k) Pre-tax', amt: '−$250.00', pct: 5.0, fill: '#6366F1', note: 'Elective' },
    { label: 'Health Benefit', amt: '−$150.00', pct: 3.0, fill: '#8B5CF6', note: 'Pre-Tax' },
    { label: 'Net Take-Home', amt: '$3,497.50', pct: 69.95, fill: '#10B981', note: 'Direct Deposit' },
  ];

  // AP / AR Aging Data
  const agingData = {
    ar: [
      { bucket: 'Current', val: '$42,300', pct: 90, color: '#10B981' },
      { bucket: '1–30 days', val: '$18,750', pct: 45, color: '#34D399' },
      { bucket: '31–60 days', val: '$9,400', pct: 25, color: '#F59E0B' },
      { bucket: '61–90 days', val: '$4,100', pct: 12, color: '#F97316' },
      { bucket: '90+ days', val: '$2,650', pct: 7, color: '#EF4444' },
    ],
    ap: [
      { bucket: 'Current', val: '$28,900', pct: 85, color: '#10B981' },
      { bucket: '1–30 days', val: '$12,300', pct: 40, color: '#34D399' },
      { bucket: '31–60 days', val: '$5,200', pct: 20, color: '#F59E0B' },
      { bucket: '61–90 days', val: '$1,800', pct: 8, color: '#F97316' },
      { bucket: '90+ days', val: '$600', pct: 3, color: '#EF4444' },
    ],
  }[aparMode];

  // E-File Steps
  const efileStages = [
    { num: '01', title: 'Prepared', desc: 'Workpapers completed in Drake/ProConnect' },
    { num: '02', title: 'Reviewed', desc: 'Dual CPA diagnostic error check pass' },
    { num: '03', title: 'Authorized', desc: 'Form 8879 taxpayer digital signature' },
    { num: '04', title: 'Submitted', desc: 'Transmitted to IRS Modernized e-File' },
    { num: '05', title: 'Accepted', desc: 'Official IRS submission acknowledgment' },
  ];

  return (
    <div className="ref-anim-card" aria-label="Live Service Execution Simulators">
      <div className="ref-anim-header">
        <div className="flex items-center gap-2">
          <span className="ref-anim-dot" />
          <span className="text-xs font-bold text-[#12242B] dark:text-[#F4FBFC] uppercase tracking-wider font-mono">
            Interactive Operational Simulators
          </span>
        </div>
        <div className="flex rounded-full bg-black/5 dark:bg-white/5 p-0.5 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)] text-[9px] font-bold">
          {(['BKP', 'PAY', 'APAR', 'INTL', 'FILE'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full transition-all ${
                activeTab === tab
                  ? 'bg-[#12242B] dark:bg-[#49E3D6] text-white dark:text-[#03141A] shadow-sm font-bold'
                  : 'text-[#476067] dark:text-[#A8C0C6]'
              }`}
            >
              {tab === 'BKP' && 'Bookkeeping'}
              {tab === 'PAY' && 'Payroll'}
              {tab === 'APAR' && 'AP / AR'}
              {tab === 'INTL' && 'Foreign FBAR'}
              {tab === 'FILE' && 'E-Filing'}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Bookkeeping Tab */}
      {activeTab === 'BKP' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs pb-1 border-b border-[#E2EBE8] dark:border-[rgba(121,241,232,0.15)]">
            <span className="font-bold text-[#12242B] dark:text-[#F4FBFC]">Chase &bull; Stripe Bank Feed Ingestion</span>
            <span className="font-mono text-emerald-600 dark:text-[#49E3D6] font-bold text-[10px]">100% Reconciled</span>
          </div>

          <div className="ref-rec-stream">
            {recTransactions.map((tx, idx) => (
              <div key={idx} className="ref-rec-item is-matched">
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="font-medium truncate">{tx.desc}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono font-bold">{tx.amt}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#49E3D6] font-bold font-mono">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-emerald-500/20 flex items-center justify-between text-xs">
            <span>General Ledger Ending Balance: $48,250.00</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-[#49E3D6]">Variance: $0.00</span>
          </div>
        </div>
      )}

      {/* 2. Payroll Tab */}
      {activeTab === 'PAY' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs pb-1 border-b border-[#E2EBE8] dark:border-[rgba(121,241,232,0.15)]">
            <span className="font-bold text-[#12242B] dark:text-[#F4FBFC]">Gross-to-Net Paycheck Calculation Waterfall</span>
            <span className="font-mono text-emerald-600 dark:text-[#49E3D6] font-bold text-[10px]">Form 941 Compliant</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {payrollBars.map((bar, i) => (
              <div key={bar.label} className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-gray-800 text-xs">
                <div className="text-[9px] uppercase font-bold text-gray-400">{bar.label}</div>
                <div className="text-sm font-mono font-bold mt-0.5" style={{ color: bar.fill }}>
                  {bar.amt}
                </div>
                <div className="text-[8.5px] text-gray-500">{bar.note}</div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-500/10 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <div className="text-[9px] uppercase font-bold text-gray-500">Net Employee Paycheck</div>
              <div className="text-base font-bold font-serif-editorial text-emerald-600 dark:text-[#49E3D6]">$3,497.50</div>
            </div>
            <div className="text-right text-[10px] text-gray-500">
              <div>ACH NACHA Batch Processed</div>
              <div className="font-mono text-emerald-500 font-bold">Direct Deposit Complete</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. AP / AR Tab */}
      {activeTab === 'APAR' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs pb-1 border-b border-[#E2EBE8] dark:border-[rgba(121,241,232,0.15)]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#12242B] dark:text-[#F4FBFC]">Aging Report Schedule</span>
              <div className="flex rounded-full bg-black/5 dark:bg-white/5 p-0.5 border border-gray-300 dark:border-gray-700 text-[9px] font-bold">
                <button
                  onClick={() => setAparMode('ar')}
                  className={`px-2 py-0.5 rounded-full transition-all ${
                    aparMode === 'ar' ? 'bg-emerald-500 text-white' : 'text-gray-400'
                  }`}
                >
                  Receivables (AR)
                </button>
                <button
                  onClick={() => setAparMode('ap')}
                  className={`px-2 py-0.5 rounded-full transition-all ${
                    aparMode === 'ap' ? 'bg-emerald-500 text-white' : 'text-gray-400'
                  }`}
                >
                  Payables (AP)
                </button>
              </div>
            </div>
            <span className="font-mono text-emerald-600 dark:text-[#49E3D6] font-bold text-[10px]">
              Total {aparMode.toUpperCase()}: {aparMode === 'ar' ? '$77,200' : '$48,800'}
            </span>
          </div>

          <div className="space-y-2">
            {agingData.map((row) => (
              <div key={row.bucket} className="ref-aging-row">
                <span className="font-bold">{row.bucket}</span>
                <div className="ref-aging-track">
                  <div className="ref-aging-fill" style={{ width: `${row.pct}%`, background: row.color }} />
                </div>
                <span className="font-mono font-bold text-right">{row.val}</span>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-emerald-500/20 flex items-center justify-between text-xs">
            <span>2-Way &amp; 3-Way Verification Complete</span>
            <span className="font-mono text-emerald-600 dark:text-[#49E3D6] font-bold">Audit-Ready Aging</span>
          </div>
        </div>
      )}

      {/* 4. Foreign FBAR Tab */}
      {activeTab === 'INTL' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs pb-1 border-b border-[#E2EBE8] dark:border-[rgba(121,241,232,0.15)]">
            <span className="font-bold text-[#12242B] dark:text-[#F4FBFC]">FinCEN Form 114 &bull; FBAR Threshold Check</span>
            <span className="font-mono text-emerald-600 dark:text-[#49E3D6] font-bold text-[10px]">Statutory $10,000 Trigger</span>
          </div>

          <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-gray-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span>Aggregate Aggregate Foreign Account Value:</span>
              <span className="font-mono text-sm font-bold text-emerald-600 dark:text-[#49E3D6]">
                ${fbarAmount.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="2000"
              max="50000"
              step="500"
              value={fbarAmount}
              onChange={(e) => setFbarAmount(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-gray-400 font-mono">
              <span>$2,000</span>
              <span className="font-bold text-rose-500">$10,000 Threshold</span>
              <span>$50,000</span>
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
            fbarAmount > 10000 
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300' 
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
          }`}>
            <div className="flex items-center gap-2">
              {fbarAmount > 10000 ? (
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              )}
              <span>
                {fbarAmount > 10000
                  ? 'FBAR Required: Value exceeds $10,000 aggregate mark.'
                  : 'FBAR Exempt: Below $10,000 annual aggregate threshold.'}
              </span>
            </div>
            <span className="font-mono font-bold text-[10px]">
              {fbarAmount > 10000 ? 'FinCEN 114 Needed' : 'No Filing Triggered'}
            </span>
          </div>
        </div>
      )}

      {/* 5. E-Filing Tab */}
      {activeTab === 'FILE' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs pb-1 border-b border-[#E2EBE8] dark:border-[rgba(121,241,232,0.15)]">
            <span className="font-bold text-[#12242B] dark:text-[#F4FBFC]">IRS Modernized e-File (MeF) 5-Step Pipeline</span>
            <span className="font-mono text-emerald-600 dark:text-[#49E3D6] font-bold text-[10px]">Direct IRS Transmission</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {efileStages.map((stage, idx) => (
              <div 
                key={stage.num}
                onClick={() => setFileStep(idx + 1)}
                className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                  fileStep >= idx + 1
                    ? 'border-emerald-500 bg-emerald-500/10 text-[#12242B] dark:text-[#F4FBFC]'
                    : 'border-gray-200 dark:border-gray-800 text-gray-400 opacity-60'
                }`}
              >
                <div className="text-[10px] font-mono font-bold text-emerald-500">{stage.num}</div>
                <div className="text-xs font-bold mt-0.5">{stage.title}</div>
                <div className="text-[8px] text-gray-500 mt-0.5 leading-tight">{stage.desc}</div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-emerald-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Official IRS Submission Stamp &bull; Submission ID: 20250415-9942</span>
            </div>
            <span className="font-mono text-emerald-600 dark:text-[#49E3D6] font-bold">100% Accepted</span>
          </div>
        </div>
      )}
    </div>
  );
}