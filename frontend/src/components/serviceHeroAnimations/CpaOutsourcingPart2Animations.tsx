import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  Users,
  Briefcase,
  Layers,
  ShieldCheck,
  Scale,
  FolderCheck,
  ArrowRight,
  Sparkles,
  Zap,
  ClipboardList,
  AlertTriangle,
  RotateCcw,
  UserCheck
} from 'lucide-react';
import './ServiceHeroAnimations.css';

/* ==========================================================================
   16. FINANCIAL STATEMENT PREPARATION HERO ANIMATION
   Concept: Structured financial statement builder with Balance Sheet,
   Income Statement, and Statement of Cash Flows tabs and GAAP formatting.
   ========================================================================== */
export function FinancialStatementPrepHero() {
  const [activeTab, setActiveTab] = useState<'BS' | 'IS' | 'CF'>('BS');

  const statements = {
    BS: {
      title: 'Balance Sheet (Statement of Financial Position)',
      lines: [
        { label: 'Current & Fixed Assets', val: '$840,000' },
        { label: 'Current & Long-Term Liabilities', val: '$320,000' },
        { label: "Stockholders' Equity & Retained Earnings", val: '$520,000' },
      ],
      equation: 'Assets ($840K) = Liabilities ($320K) + Equity ($520K) ✓ Balanced',
    },
    IS: {
      title: 'Income Statement (Statement of Operations)',
      lines: [
        { label: 'Gross Revenue / Net Sales', val: '$1,200,000' },
        { label: 'Cost of Goods Sold (COGS)', val: '-$450,000' },
        { label: 'Operating Expenses (OpEx & SG&A)', val: '-$490,000' },
        { label: 'Net Operating Income', val: '$260,000' },
      ],
      equation: 'Gross Profit ($750K) - OpEx ($490K) = Net Income ($260K)',
    },
    CF: {
      title: 'Statement of Cash Flows (Indirect Method)',
      lines: [
        { label: 'Cash Flow from Operating Activities', val: '+$280,000' },
        { label: 'Cash Flow from Investing Activities (CapEx)', val: '-$60,000' },
        { label: 'Cash Flow from Financing Activities', val: '-$40,000' },
      ],
      equation: 'Net Increase in Cash & Equivalents: +$180,000',
    },
  }[activeTab];

  return (
    <div className="sha-terminal" aria-label="GAAP Financial Statement Builder">
      <div className="sha-header">
        <div className="sha-header-brand">
          <span className="sha-header-gem" />
          <span>Financial Statement Builder</span>
        </div>
        <div className="sha-header-actions">
          <div className="sha-status-pill">
            <span className="sha-status-dot" />
            <span>US GAAP Compilation</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sha-stmt-tabs">
        <button
          onClick={() => setActiveTab('BS')}
          className={`sha-stmt-tab ${activeTab === 'BS' ? 'active' : ''}`}
        >
          Balance Sheet
        </button>
        <button
          onClick={() => setActiveTab('IS')}
          className={`sha-stmt-tab ${activeTab === 'IS' ? 'active' : ''}`}
        >
          Income Statement
        </button>
        <button
          onClick={() => setActiveTab('CF')}
          className={`sha-stmt-tab ${activeTab === 'CF' ? 'active' : ''}`}
        >
          Cash Flows
        </button>
      </div>

      {/* Statement Body */}
      <div className="sha-stmt-body">
        <div className="text-[8.5px] uppercase font-bold text-gray-400 border-b border-gray-500/20 pb-1">
          {statements.title}
        </div>
        {statements.lines.map((ln) => (
          <div key={ln.label} className="flex justify-between items-center py-0.5 border-b border-dashed border-gray-500/15">
            <span className="truncate">{ln.label}</span>
            <span className="font-mono font-bold text-emerald-500 shrink-0">{ln.val}</span>
          </div>
        ))}
        <div className="pt-1 text-[8.5px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">
          {statements.equation}
        </div>
      </div>

      {/* GAAP Note Footer */}
      <div className="mt-2 text-center text-[7.5px] text-gray-400 font-mono">
        Compiled under Statements on Standards for Accounting and Review Services (SSARS)
      </div>
    </div>
  );
}

/* ==========================================================================
   17. TAX REVIEW SUPPORT HERO ANIMATION
   Concept: Dual diagnostic reviewer console, discrepancy diagnostic scanner,
   line-by-line validation, and senior CPA approval sign-off.
   ========================================================================== */
export function TaxReviewSupportHero() {
  const [activeCheck, setActiveCheck] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCheck((c) => (c + 1) % 3);
    }, 3100);
    return () => clearInterval(timer);
  }, []);

  const checks = [
    { form: '1040 Line 1z', check: 'W-2 Wage vs SSA Record Tie-Out', status: 'Passed' },
    { form: 'Schedule C', check: '1099-NEC Gross Receipts Match', status: 'Passed' },
    { form: 'Schedule A', check: 'State & Local Tax $10,000 SALT Cap Check', status: 'Passed' },
  ];

  return (
    <div className="sha-terminal" aria-label="Tax Review Diagnostic Console">
      <div className="sha-header">
        <div className="sha-header-brand">
          <span className="sha-header-gem" />
          <span>Diagnostic Review Console</span>
        </div>
        <div className="sha-header-actions">
          <div className="sha-status-pill">
            <span className="sha-status-dot" />
            <span>Senior CPA Review</span>
          </div>
        </div>
      </div>

      <div className="sha-diag-lines">
        <div className="text-[8.5px] uppercase font-bold text-gray-400 tracking-wider">
          Critical Diagnostic Error Checks
        </div>
        {checks.map((chk, i) => (
          <div 
            key={chk.form} 
            className={`sha-diag-row transition-all ${
              activeCheck === i ? 'border-emerald-500 bg-emerald-500/10' : ''
            }`}
          >
            <span className="font-mono font-bold text-emerald-500 truncate">{chk.form}</span>
            <span className="truncate">{chk.check}</span>
            <span className="flex items-center gap-1 font-bold text-emerald-500 text-[8px] shrink-0 font-mono">
              <CheckCircle2 size={12} /> {chk.status}
            </span>
          </div>
        ))}
      </div>

      {/* Senior CPA Signoff Stamp */}
      <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-emerald-500/20 flex items-center justify-between">
        <div>
          <div className="text-[8px] uppercase font-bold text-gray-400">Diagnostic QA Status</div>
          <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">24 of 24 Critical Checkpoints Cleared</div>
        </div>
        <div className="sha-signoff-stamp">
          <ShieldCheck size={13} />
          <span>CPA QA SIGN-OFF APPROVED</span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   18. YEAR-END CLEANUP HERO ANIMATION
   Concept: Unorganized transaction inbox -> Cleanup Engine -> Reconciled clean books.
   ========================================================================== */
export function YearEndCleanupHero() {
  const [cleaned, setCleaned] = useState(false);

  return (
    <div className="sha-terminal" aria-label="Year-End Accounting Cleanup Engine">
      <div className="sha-header">
        <div className="sha-header-brand">
          <span className="sha-header-gem" />
          <span>Year-End Accounting Cleanup</span>
        </div>
        <div className="sha-header-actions">
          <button
            onClick={() => setCleaned(!cleaned)}
            className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[8.5px] font-bold flex items-center gap-1"
          >
            <RotateCcw size={10} />
            <span>{cleaned ? 'Reset' : 'Auto-Clean'}</span>
          </button>
        </div>
      </div>

      <div className="sha-cleanup-split">
        {/* Unorganized Inbox */}
        <div className="sha-cleanup-box">
          <div className="text-[8px] uppercase font-bold text-rose-500 flex items-center gap-1">
            <AlertTriangle size={11} /> Unreconciled Inbox (Prior)
          </div>
          <div className="p-1.5 rounded bg-black/5 dark:bg-white/5 border border-rose-500/20">
            38 Uncategorized Feeds
          </div>
          <div className="p-1.5 rounded bg-black/5 dark:bg-white/5 border border-rose-500/20">
            Suspense Acct: $14,250
          </div>
          <div className="p-1.5 rounded bg-black/5 dark:bg-white/5 border border-rose-500/20">
            Missing 1099 W-9s
          </div>
        </div>

        {/* Cleaned Reconciled Books */}
        <div className="sha-cleanup-box">
          <div className="text-[8px] uppercase font-bold text-emerald-500 flex items-center gap-1">
            <CheckCircle2 size={11} /> Cleaned Tax-Ready Books
          </div>
          <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/25 font-bold text-emerald-600 dark:text-emerald-400">
            0 Uncategorized Feeds
          </div>
          <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/25 font-bold text-emerald-600 dark:text-emerald-400">
            Suspense Acct: $0.00
          </div>
          <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/25 font-bold text-emerald-600 dark:text-emerald-400">
            1099-NEC Audit Cleared
          </div>
        </div>
      </div>

      {/* Outcome Footer */}
      <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-emerald-500/20 flex items-center justify-between text-[9px]">
        <span>Year-End Closing Readiness</span>
        <span className="font-mono font-bold text-emerald-500">100% Tax-Filing Ready</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   19. WRITE-UP SERVICES HERO ANIMATION
   Concept: Raw paper receipts & merchant statements -> OCR Extraction ->
   Automated double-entry journal entries -> Ledger balance.
   ========================================================================== */
export function WriteUpServicesHero() {
  const [activeItem, setActiveItem] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveItem((i) => (i + 1) % 3);
    }, 3100);
    return () => clearInterval(timer);
  }, []);

  const items = [
    { raw: 'Receipt #841 &bull; Dell Tech', cat: 'Office Equipment (#1510)', amount: '$2,450.00' },
    { raw: 'Bank Debit &bull; Delta Air', cat: 'Client Travel Exp (#6210)', amount: '$680.00' },
    { raw: 'Merchant Check &bull; Regus', cat: 'Office Rent (#6110)', amount: '$1,850.00' },
  ];

  return (
    <div className="sha-terminal" aria-label="Transaction to Ledger Transformation">
      <div className="sha-header">
        <div className="sha-header-brand">
          <span className="sha-header-gem" />
          <span>Write-up &amp; Record Transformation</span>
        </div>
        <div className="sha-header-actions">
          <div className="sha-status-pill">
            <span className="sha-status-dot" />
            <span>OCR Extraction Active</span>
          </div>
        </div>
      </div>

      <div className="sha-writeup-flow">
        {/* Source Records */}
        <div className="sha-source-doc">
          <div className="text-[8px] uppercase font-bold text-gray-400">Raw Source Record</div>
          <div className="font-bold">{items[activeItem].raw.split('&bull;')[1]}</div>
          <div className="text-[8px] text-gray-500">Scanned Receipt / PDF Statement</div>
          <div className="mt-1 font-mono font-bold text-emerald-500">{items[activeItem].amount}</div>
        </div>

        {/* Generated Journal Entry */}
        <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-emerald-500/20 text-[9px] flex flex-col gap-1 justify-center">
          <div className="text-[8px] uppercase font-bold text-emerald-500">Auto-Generated Journal Entry</div>
          <div className="flex justify-between items-center py-0.5 border-b border-dashed border-gray-500/20">
            <span>Debit: {items[activeItem].cat}</span>
            <span className="font-mono font-bold text-emerald-500">{items[activeItem].amount}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span>Credit: Operating Cash (#1010)</span>
            <span className="font-mono font-bold text-gray-500">{items[activeItem].amount}</span>
          </div>
        </div>
      </div>

      {/* Trial Balance Ready */}
      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-[9px]">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={13} className="text-emerald-500" />
          <span>Posted to General Ledger &bull; Balanced</span>
        </div>
        <span className="font-mono text-emerald-500 font-bold">Trial Balance Ready</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   20. DEDICATED STAFF AUGMENTATION HERO ANIMATION
   Concept: Professional staffing team collaboration pod with role allocation,
   utilization rates, skill matching, and US time-zone overlap.
   ========================================================================== */
export function StaffAugmentationHero() {
  return (
    <div className="sha-terminal" aria-label="Dedicated Staff Augmentation Terminal">
      <div className="sha-header">
        <div className="sha-header-brand">
          <span className="sha-header-gem" />
          <span>Dedicated Staff Augmentation Pod</span>
        </div>
        <div className="sha-header-actions">
          <div className="sha-status-pill">
            <span className="sha-status-dot" />
            <span>Dedicated Pod</span>
          </div>
        </div>
      </div>

      <div className="sha-pod-members">
        {[
          { name: 'Senior US Tax Senior (EA)', role: 'Form 1040 / 1120-S &bull; Drake', util: '85%' },
          { name: 'CAS Senior Bookkeeper', role: 'Month-End Close &bull; QuickBooks', util: '90%' },
          { name: 'Senior Tax Reviewer (CPA)', role: 'Multi-State Compliance QA', util: '75%' },
        ].map((m) => (
          <div key={m.name} className="sha-pod-row">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 font-bold shrink-0">
              <UserCheck size={16} />
            </div>
            <div className="min-w-0">
              <div className="font-bold truncate text-[10px]">{m.name}</div>
              <div className="text-[8px] text-gray-400 truncate">{m.role}</div>
            </div>
            <div className="text-right">
              <div className="text-[7.5px] uppercase font-bold text-gray-400">Utilization</div>
              <div className="font-mono font-bold text-emerald-500 text-[9.5px]">{m.util}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Time-zone and Security Badge */}
      <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-emerald-500/20 flex items-center justify-between text-[9px]">
        <span>Time Zone: US Eastern / Central Alignment</span>
        <span className="font-mono text-emerald-500 font-bold">SOC-2 Firm VPN Integration</span>
      </div>
    </div>
  );
}
