import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  Users,
  Briefcase,
  Layers,
  ShieldCheck,
  ArrowRight,
  Clock,
  Send,
  Sliders,
  Sparkles,
  ClipboardCheck,
  FileCheck2,
  FolderSync
} from 'lucide-react';
import './ServiceHeroAnimations.css';

/* ==========================================================================
   11. US TAX PREP & OUTSOURCING HERO ANIMATION
   Concept: Multi-tier outsourcing pipeline: Intake -> Workpapers -> CPA QA -> Client Delivery.
   ========================================================================== */
export function TaxPrepOutsourcingHero() {
  const [activeStage, setActiveStage] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((s) => (s % 4) + 1);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const stages = [
    { num: '01', name: 'Intake & OCR', count: '14 Returns' },
    { num: '02', name: 'Workpaper Prep', count: 'Drake/ProConnect' },
    { num: '03', name: 'Senior CPA QA', count: 'Dual-Review' },
    { num: '04', name: 'Firm Delivery', count: 'Ready to File' },
  ];

  return (
    <div className="sha-terminal" aria-label="Tax Preparation Outsourcing Pipeline">
      <div className="sha-header">
        <div className="sha-header-brand">
          <span className="sha-header-gem" />
          <span>CPA Firm Capacity &bull; Tax Outsourcing</span>
        </div>
        <div className="sha-header-actions">
          <div className="sha-status-pill">
            <span className="sha-status-dot" />
            <span>Dedicated Tax Pod</span>
          </div>
        </div>
      </div>

      {/* 4 Pipeline Stages */}
      <div className="sha-tpo-stages">
        {stages.map((st, i) => (
          <div
            key={st.num}
            onClick={() => setActiveStage(i + 1)}
            className={`sha-tpo-stage cursor-pointer ${activeStage === i + 1 ? 'active' : ''}`}
          >
            <div className="font-mono text-emerald-500 font-bold">{st.num}</div>
            <div className="truncate">{st.name}</div>
            <div className="text-[7px] text-gray-400 truncate">{st.count}</div>
          </div>
        ))}
      </div>

      {/* Active Work Queue Items */}
      <div className="grid gap-1.5 mb-3">
        {[
          { id: 'RET-1040-08', client: 'Apex Holdings (1040 + Sch C)', status: 'CPA Review Pass', icon: CheckCircle2, ready: true },
          { id: 'RET-1120S-14', client: 'Beacon Tech LLC (1120-S)', status: 'Workpaper Generation', icon: Clock, ready: false },
          { id: 'RET-1065-03', client: 'Riverstone Capital (1065)', status: 'K-1 Allocation Check', icon: Clock, ready: false },
        ].map((item, idx) => (
          <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-emerald-500/10 text-[9px]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-emerald-500 font-bold">{item.id}</span>
              <span className="font-medium truncate">{item.client}</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-gray-500">
              <item.icon size={12} className={item.ready ? 'text-emerald-500' : 'text-amber-500'} />
              <span>{item.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SLA & Security Footer */}
      <div className="flex items-center justify-between text-[8.5px] text-gray-500 px-1">
        <span>Standard Turnaround: 48–72 Hours</span>
        <span className="font-mono text-emerald-500 font-bold">Encrypted SOC-2 Portal</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   12. BOOKKEEPING OUTSOURCING HERO ANIMATION
   Concept: Automated multi-source data ingestion, rules engine categorization,
   bank rec, and monthly ledger tie-out.
   ========================================================================== */
export function BookkeepingOutsourcingHero() {
  const [pulseRule, setPulseRule] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseRule((r) => (r + 1) % 3);
    }, 2900);
    return () => clearInterval(timer);
  }, []);

  const rules = [
    { source: 'Stripe Payout', rule: 'Merchant Net Revenue -> Acct #4020', conf: '99.8% Match' },
    { source: 'Bill.com Vendor', rule: 'Software Subscriptions -> Acct #6150', conf: '100% Match' },
    { source: 'Expensify Feed', rule: 'Employee Travel & Lodging -> Acct #6210', conf: 'Auto-Matched' },
  ];

  return (
    <div className="sha-terminal" aria-label="Outsourced Bookkeeping Rules Engine">
      <div className="sha-header">
        <div className="sha-header-brand">
          <span className="sha-header-gem" />
          <span>Automated Bookkeeping Engine</span>
        </div>
        <div className="sha-header-actions">
          <div className="sha-status-pill">
            <span className="sha-status-dot" />
            <span>Rules Active</span>
          </div>
        </div>
      </div>

      <div className="sha-rules-grid">
        <div className="text-[8.5px] uppercase font-bold text-gray-400 tracking-wider">
          Feed Ingestion &bull; Bank Rules Automation
        </div>
        {rules.map((r, i) => (
          <div 
            key={r.source} 
            className={`sha-rule-row transition-all ${
              pulseRule === i ? 'border-emerald-500 bg-emerald-500/10' : ''
            }`}
          >
            <span className="font-mono font-bold text-emerald-500 truncate">{r.source}</span>
            <span className="truncate">{r.rule}</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-bold shrink-0">
              {r.conf}
            </span>
          </div>
        ))}
      </div>

      {/* Monthly Tie-Out Callout */}
      <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-emerald-500/20 flex items-center justify-between text-[9px]">
        <div className="flex items-center gap-2">
          <FolderSync size={14} className="text-emerald-500" />
          <span>Month-End Close Package &bull; 12 Entities</span>
        </div>
        <span className="font-mono text-emerald-500 font-bold">100% Reconciled</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   13. ACCOUNTING OUTSOURCING HERO ANIMATION
   Concept: Smart task allocation board distributing work to specialists with
   capacity gauges and live progress indicators.
   ========================================================================== */
export function AccountingOutsourcingHero() {
  const [activeLane, setActiveLane] = useState(1);

  return (
    <div className="sha-terminal" aria-label="Accounting Task Allocation Board">
      <div className="sha-header">
        <div className="sha-header-brand">
          <span className="sha-header-gem" />
          <span>Specialist Workload Allocation</span>
        </div>
        <div className="sha-header-actions">
          <div className="sha-status-pill">
            <span className="sha-status-dot" />
            <span>3 Associates Online</span>
          </div>
        </div>
      </div>

      {/* 3 Specialist Lanes */}
      <div className="sha-team-lanes">
        <div className="sha-lane-box">
          <div className="flex justify-between items-center text-[9px] font-bold">
            <span>Associate 1 (Staff)</span>
            <span className="text-emerald-500 font-mono">85% Cap</span>
          </div>
          <div className="sha-lane-task">Bank &amp; Credit Tie-outs</div>
          <div className="sha-lane-task">Accounts Payable Coding</div>
        </div>

        <div className="sha-lane-box">
          <div className="flex justify-between items-center text-[9px] font-bold">
            <span>Associate 2 (Sr. Acct)</span>
            <span className="text-emerald-500 font-mono">90% Cap</span>
          </div>
          <div className="sha-lane-task">Revenue Recognition 606</div>
          <div className="sha-lane-task">Fixed Asset Depreciation</div>
        </div>

        <div className="sha-lane-box">
          <div className="flex justify-between items-center text-[9px] font-bold">
            <span>Reviewer (CPA)</span>
            <span className="text-emerald-500 font-mono">75% Cap</span>
          </div>
          <div className="sha-lane-task">Financial Statement QA</div>
          <div className="sha-lane-task">Executive Deck Review</div>
        </div>
      </div>

      {/* Allocation Summary */}
      <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-emerald-500/20 flex items-center justify-between text-[9px]">
        <span>Current Sprint: 48 Tasks Processed Today</span>
        <span className="font-mono text-emerald-500 font-bold">On-Schedule &bull; 99.4% Delivery</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   14. PAYROLL PROCESSING HERO ANIMATION
   Concept: Multi-state payroll run, state withholdings (CA, NY, TX, FL),
   deductions validation, and direct deposit approval gate.
   ========================================================================== */
export function PayrollProcessingHero() {
  const [selectedState, setSelectedState] = useState<'TX' | 'CA' | 'NY' | 'FL'>('TX');

  const stateDetails = {
    TX: { name: 'Texas (No State Income Tax)', withholding: '$0.00 State Tax', suta: '1.2% SUTA' },
    CA: { name: 'California (EDD Compliance)', withholding: 'SDI 1.1% + State Tax Tier', suta: '3.4% UI' },
    NY: { name: 'New York (NYS + NYC)', withholding: 'NYS Tax + NYC Resident Tax', suta: '2.8% UI' },
    FL: { name: 'Florida (No Personal Tax)', withholding: '$0.00 State Tax', suta: '1.0% Reemployment' },
  }[selectedState];

  return (
    <div className="sha-terminal" aria-label="Multi-State Payroll Processing Engine">
      <div className="sha-header">
        <div className="sha-header-brand">
          <span className="sha-header-gem" />
          <span>Multi-State Payroll Processing</span>
        </div>
        <div className="sha-header-actions">
          <div className="sha-status-pill">
            <span className="sha-status-dot" />
            <span>Form 941 Compliance</span>
          </div>
        </div>
      </div>

      {/* State Selector Tabs */}
      <div className="sha-state-pills">
        {(['TX', 'CA', 'NY', 'FL'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setSelectedState(st)}
            className={`sha-state-pill ${selectedState === st ? 'active' : ''}`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Selected State Payroll Profile */}
      <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-emerald-500/20 mb-3">
        <div className="text-[10px] font-bold text-emerald-500 mb-1">{stateDetails.name}</div>
        <div className="flex justify-between items-center text-[9px] py-1 border-b border-dashed border-gray-500/20">
          <span>State Withholding Rules:</span>
          <span className="font-mono font-bold">{stateDetails.withholding}</span>
        </div>
        <div className="flex justify-between items-center text-[9px] pt-1">
          <span>Employer SUTA / Unemployment:</span>
          <span className="font-mono font-bold">{stateDetails.suta}</span>
        </div>
      </div>

      {/* Approval Status */}
      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-[9px]">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={13} className="text-emerald-500" />
          <span>ACH NACHA Direct Deposit Batch Generated</span>
        </div>
        <span className="font-mono text-emerald-500 font-bold">Zero Rejections</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   15. AUDIT SUPPORT HERO ANIMATION
   Concept: Professional audit PBC checklist, document verification, electronic
   tickmarks (tick, sum, tie-out), and readiness tracking.
   ========================================================================== */
export function AuditSupportHero() {
  const [checkedCount, setCheckedCount] = useState(4);

  return (
    <div className="sha-terminal" aria-label="Professional Audit Documentation Support">
      <div className="sha-header">
        <div className="sha-header-brand">
          <span className="sha-header-gem" />
          <span>Audit PBC Binder &bull; Workpapers</span>
        </div>
        <div className="sha-header-actions">
          <div className="sha-status-pill">
            <span className="sha-status-dot" />
            <span>Prepared By Client (PBC)</span>
          </div>
        </div>
      </div>

      <div className="sha-pbc-list">
        {[
          { code: 'PBC-01', name: 'Cash & Bank Confirmations', mark: '✓ Verified' },
          { code: 'PBC-02', name: 'Accounts Receivable Aging & Rollforward', mark: '∑ Tested' },
          { code: 'PBC-03', name: 'Fixed Asset Additions (> $5K Invoices)', mark: 'Ⓣ Tie-out' },
          { code: 'PBC-04', name: 'Revenue Cutoff & Subsequent Invoicing', mark: '✓ Verified' },
        ].map((item) => (
          <div key={item.code} className="sha-pbc-item">
            <div className="flex items-center gap-2">
              <span className="font-mono text-emerald-500 font-bold">{item.code}</span>
              <span className="font-medium truncate">{item.name}</span>
            </div>
            <span className="sha-tickmark">{item.mark}</span>
          </div>
        ))}
      </div>

      {/* Audit Readiness Banner */}
      <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-emerald-500/20 flex items-center justify-between text-[9px]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>Audit Readiness Score: 96%</span>
        </div>
        <span className="font-mono text-emerald-500 font-bold">Substantiated Schedules Ready</span>
      </div>
    </div>
  );
}
