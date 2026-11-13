import React, { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  CreditCard,
  Receipt,
  Scale,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  PieChart,
  Sliders,
  Sparkles
} from 'lucide-react';
import './ServiceHeroAnimations.css';

/* ==========================================================================
   5. BUSINESS TAX PREPARATION HERO ANIMATION
   Concept: Corporate 1120-S / 1065 preparation workspace with revenue/expense
   ingestion, M-1 book-to-tax adjustments, and automated schedule K-1 pass-through.
   ========================================================================== */
export function BusinessTaxPrepHero() {
  const [activeForm, setActiveForm] = useState<'1120-S' | '1065'>('1120-S');
  const [calcStep, setCalcStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCalcStep((s) => (s + 1) % 3);
    }, 3300);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="sha-terminal" aria-label="Business Tax Preparation Workspace">
      <div className="sha-header">
        <div className="sha-header-brand">
          <span className="sha-header-gem" />
          <span>Corporate Tax Studio &bull; Form {activeForm}</span>
        </div>
        <div className="sha-header-actions">
          <div className="flex rounded-full bg-black/5 dark:bg-white/5 p-0.5 border border-emerald-500/20 text-[9px] font-bold">
            <button
              onClick={() => setActiveForm('1120-S')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                activeForm === '1120-S' ? 'bg-emerald-500 text-white' : 'text-gray-400'
              }`}
            >
              1120-S (S-Corp)
            </button>
            <button
              onClick={() => setActiveForm('1065')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                activeForm === '1065' ? 'bg-emerald-500 text-white' : 'text-gray-400'
              }`}
            >
              1065 (LLC)
            </button>
          </div>
        </div>
      </div>

      {/* Income / Expense Ingestion Strip */}
      <div className="sha-biz-inputs">
        <div className="sha-biz-box">
          <div className="text-[8px] uppercase tracking-wider text-gray-400 font-bold">Gross Receipts</div>
          <div className="text-xs font-bold font-mono">$1,280,000</div>
          <div className="text-[7.5px] text-gray-500">1099-K &amp; Stripe Verified</div>
        </div>
        <div className="sha-biz-box">
          <div className="text-[8px] uppercase tracking-wider text-gray-400 font-bold">Cost of Goods</div>
          <div className="text-xs font-bold font-mono text-gray-500">-$420,000</div>
          <div className="text-[7.5px] text-gray-500">Inventory &amp; Supplies</div>
        </div>
        <div className="sha-biz-box">
          <div className="text-[8px] uppercase tracking-wider text-gray-400 font-bold">Operating Expenses</div>
          <div className="text-xs font-bold font-mono text-gray-500">-$310,000</div>
          <div className="text-[7.5px] text-gray-500">Payroll, Rent, Software</div>
        </div>
      </div>

      {/* Schedule M-1 Book-to-Tax Adjustments */}
      <div className="sha-m1-adjustments">
        <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-500/20">
          <span>Schedule M-1 Adjustments</span>
          <span className="font-mono text-emerald-500">Auto-Reconciled</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-dashed border-gray-500/20">
          <span>Section 179 Immediate Asset Write-Off</span>
          <span className="font-mono font-bold text-emerald-500">-$85,000</span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-dashed border-gray-500/20">
          <span>50% Business Meals Disallowance</span>
          <span className="font-mono text-rose-400">+$4,200</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span>Net Ordinary Business Income (Line 21)</span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">$469,200</span>
        </div>
      </div>

      {/* Bottom K-1 Status */}
      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-[9px]">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={13} className="text-emerald-500" />
          <span>Schedule K-1 Shareholder Packages Generated</span>
        </div>
        <span className="font-bold text-emerald-500 font-mono">100% Diagnostic Check Passed</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   6. ACCOUNTING SERVICES HERO ANIMATION
   Concept: Live double-entry bookkeeping ledger with debit and credit balance
   verification, transaction posting, and balanced balance-sheet seal.
   ========================================================================== */
export function AccountingServicesHero() {
  const [pulseRow, setPulseRow] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseRow((r) => (r + 1) % 4);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const ledgerRows = [
    { code: '1010', name: 'Operating Cash in Bank', debit: '$48,250.00', credit: '—' },
    { code: '1200', name: 'Accounts Receivable (Invoices)', debit: '$24,500.00', credit: '—' },
    { code: '2010', name: 'Accounts Payable (Vendors)', debit: '—', credit: '$18,350.00' },
    { code: '4010', name: 'Consulting & SaaS Revenue', debit: '—', credit: '$54,400.00' },
  ];

  return (
    <div className="sha-terminal" aria-label="Professional Accounting Workflow">
      <div className="sha-header">
        <div className="sha-header-brand">
          <span className="sha-header-gem" />
          <span>Double-Entry General Ledger</span>
        </div>
        <div className="sha-header-actions">
          <div className="sha-status-pill">
            <span className="sha-status-dot" />
            <span>US GAAP Audit Compliant</span>
          </div>
        </div>
      </div>

      <table className="sha-ledger-table">
        <thead>
          <tr>
            <th>Acct #</th>
            <th>Account Description</th>
            <th style={{ textAlign: 'right' }}>Debit ($)</th>
            <th style={{ textAlign: 'right' }}>Credit ($)</th>
          </tr>
        </thead>
        <tbody>
          {ledgerRows.map((row, idx) => (
            <tr 
              key={row.code}
              className={`transition-colors ${pulseRow === idx ? 'bg-emerald-500/10' : ''}`}
            >
              <td className="text-gray-400">{row.code}</td>
              <td className="font-medium">{row.name}</td>
              <td style={{ textAlign: 'right' }} className="font-bold text-emerald-600 dark:text-emerald-400">
                {row.debit}
              </td>
              <td style={{ textAlign: 'right' }} className="font-bold text-gray-500">
                {row.credit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Balanced Ledger Footer */}
      <div className="sha-ledger-footer">
        <div className="flex items-center gap-2">
          <Scale size={16} />
          <span>Trial Balance Verified</span>
        </div>
        <div className="font-mono">
          Debits: $72,750.00 &bull; Credits: $72,750.00 (Balanced &bull; $0.00 Diff)
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   7. BOOKKEEPING HERO ANIMATION
   Concept: Advanced 2-sided bank reconciliation with matching beams,
   Chase bank feed vs internal ledger records, 100% matched completion.
   ========================================================================== */
export function BookkeepingHero() {
  const [reconcilePercent, setReconcilePercent] = useState(85);

  useEffect(() => {
    const timer = setInterval(() => {
      setReconcilePercent((p) => (p >= 100 ? 70 : p + 15));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const matches = [
    { bank: 'Chase Dep #4821', amount: '$4,250.00', ledger: 'Inv #1092 TechCorp' },
    { bank: 'AWS Cloud Hosting', amount: '-$680.00', ledger: 'Software Hosting Exp' },
    { bank: 'Stripe Merchant Payout', amount: '$12,410.00', ledger: 'Online Sales Batch' },
  ];

  return (
    <div className="sha-terminal" aria-label="Bank Reconciliation Engine">
      <div className="sha-header">
        <div className="sha-header-brand">
          <span className="sha-header-gem" />
          <span>Real-Time Bank Reconciliation</span>
        </div>
        <div className="sha-header-actions">
          <div className="sha-status-pill">
            <span className="sha-status-dot" />
            <span>Chase &bull; QBO Feed Live</span>
          </div>
        </div>
      </div>

      <div className="sha-rec-split">
        {/* Left Side: Bank Feed */}
        <div className="sha-rec-col">
          <div className="text-[8.5px] uppercase font-bold text-gray-400 tracking-wider">
            Bank Statement Feed
          </div>
          {matches.map((m) => (
            <div key={m.bank} className="sha-rec-row matched">
              <span className="truncate">{m.bank}</span>
              <span className="font-mono font-bold text-emerald-500 shrink-0">{m.amount}</span>
            </div>
          ))}
        </div>

        {/* Center Matching Beam */}
        <div className="sha-rec-beam">
          <ArrowRight size={14} className="animate-pulse" />
          <ArrowRight size={14} className="animate-pulse" />
          <ArrowRight size={14} className="animate-pulse" />
        </div>

        {/* Right Side: Ledger Entries */}
        <div className="sha-rec-col">
          <div className="text-[8.5px] uppercase font-bold text-gray-400 tracking-wider">
            Internal QBO Ledger
          </div>
          {matches.map((m) => (
            <div key={m.ledger} className="sha-rec-row matched">
              <span className="truncate">{m.ledger}</span>
              <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Reconciliation Progress Meter */}
      <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-emerald-500/20 flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-[9px] font-bold">
          <span>Month-End Reconciliation Progress</span>
          <span className="font-mono text-emerald-500">{reconcilePercent}% Matched</span>
        </div>
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-700 rounded-full"
            style={{ width: `${reconcilePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   8. PAYROLL MANAGEMENT HERO ANIMATION
   Concept: Dynamic Gross-to-Net payroll calculator, federal/state withholdings,
   FICA, 401(k), and net pay calculation waterfall.
   ========================================================================== */
export function PayrollManagementHero() {
  const [grossSalary, setGrossSalary] = useState(6250);

  // Dynamic calculated rates (illustrative sample only)
  const fedTax = Math.round(grossSalary * 0.125);
  const fica = Math.round(grossSalary * 0.0765);
  const stateTax = Math.round(grossSalary * 0.045);
  const k401 = Math.round(grossSalary * 0.05);
  const netPay = grossSalary - (fedTax + fica + stateTax + k401);

  return (
    <div className="sha-terminal" aria-label="Gross-to-Net Payroll Calculator">
      <div className="sha-header">
        <div className="sha-header-brand">
          <span className="sha-header-gem" />
          <span>Automated Payroll Run &bull; Gross-to-Net</span>
        </div>
        <div className="sha-header-actions">
          <div className="sha-status-pill">
            <span className="sha-status-dot" />
            <span>Direct Deposit Ready</span>
          </div>
        </div>
      </div>

      {/* Employee & Gross Strip */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-emerald-500/15 mb-3">
        <div>
          <div className="text-[10px] font-bold">Alex Morgan &bull; Full-Time Employee (W-4)</div>
          <div className="text-[8px] text-gray-500">Pay Frequency: Semi-Monthly &bull; State: TX / TX-exempt</div>
        </div>
        <div className="text-right">
          <div className="text-[8px] uppercase font-bold text-gray-400">Gross Salary</div>
          <div className="text-xs font-bold font-mono text-emerald-500">${grossSalary.toLocaleString()}</div>
        </div>
      </div>

      {/* Waterfall Bars */}
      <div className="sha-payroll-waterfall">
        <div className="sha-pay-bar-row">
          <span>Federal Withholding</span>
          <div className="sha-bar-track">
            <div className="sha-bar-fill bg-rose-400" style={{ width: '13%' }} />
          </div>
          <span className="font-mono text-right text-rose-500">-${fedTax}</span>
        </div>

        <div className="sha-pay-bar-row">
          <span>FICA (SS &amp; Medicare)</span>
          <div className="sha-bar-track">
            <div className="sha-bar-fill bg-amber-400" style={{ width: '8%' }} />
          </div>
          <span className="font-mono text-right text-amber-500">-${fica}</span>
        </div>

        <div className="sha-pay-bar-row">
          <span>Pre-Tax 401(k) (5%)</span>
          <div className="sha-bar-track">
            <div className="sha-bar-fill bg-blue-400" style={{ width: '5%' }} />
          </div>
          <span className="font-mono text-right text-blue-500">-${k401}</span>
        </div>
      </div>

      {/* Final Net Paycheck Box */}
      <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-500/10 border border-emerald-500/30 flex items-center justify-between">
        <div>
          <div className="text-[8px] uppercase font-bold text-gray-500">Net Take-Home Paycheck</div>
          <div className="text-sm font-bold font-serif text-emerald-600 dark:text-emerald-400">
            ${netPay.toLocaleString()}
          </div>
        </div>
        <div className="text-right text-[8.5px] text-gray-500">
          <div>Form 941 &bull; Automated Withholding</div>
          <div className="font-mono text-emerald-500 font-bold">ACH Direct Deposit Cleared</div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   9. FINANCIAL REPORTING HERO ANIMATION
   Concept: Premium animated financial dashboard with comparative bar/line charts,
   P&L visualization, sample data watermark, and auto-report builder.
   ========================================================================== */
export function FinancialReportingHero() {
  const [period, setPeriod] = useState<'Q1' | 'Q2' | 'Q3'>('Q2');

  const chartData = {
    Q1: [
      { month: 'Jan', rev: 70, exp: 40 },
      { month: 'Feb', rev: 80, exp: 45 },
      { month: 'Mar', rev: 95, exp: 50 },
    ],
    Q2: [
      { month: 'Apr', rev: 85, exp: 48 },
      { month: 'May', rev: 105, exp: 52 },
      { month: 'Jun', rev: 120, exp: 55 },
    ],
    Q3: [
      { month: 'Jul', rev: 110, exp: 54 },
      { month: 'Aug', rev: 130, exp: 58 },
      { month: 'Sep', rev: 145, exp: 62 },
    ],
  }[period];

  return (
    <div className="sha-terminal" aria-label="Executive Financial Reporting Studio">
      <div className="sha-header">
        <div className="sha-header-brand">
          <span className="sha-header-gem" />
          <span>Executive Financial Dashboard</span>
        </div>
        <div className="sha-header-actions">
          <div className="flex rounded-full bg-black/5 dark:bg-white/5 p-0.5 border border-emerald-500/20 text-[9px] font-bold">
            {(['Q1', 'Q2', 'Q3'] as const).map((q) => (
              <button
                key={q}
                onClick={() => setPeriod(q)}
                className={`px-2 py-0.5 rounded-full transition-all ${
                  period === q ? 'bg-emerald-500 text-white' : 'text-gray-400'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="sha-kpi-row">
        <div className="sha-kpi-card">
          <span className="text-[7.5px] uppercase font-bold text-gray-400">Net Revenue</span>
          <span className="text-xs font-bold font-mono text-emerald-500">$370.2K</span>
          <span className="text-[7px] text-emerald-500 font-bold">+18.4% YoY</span>
        </div>
        <div className="sha-kpi-card">
          <span className="text-[7.5px] uppercase font-bold text-gray-400">Gross Margin</span>
          <span className="text-xs font-bold font-mono">68.5%</span>
          <span className="text-[7px] text-emerald-500 font-bold">Top Quartile</span>
        </div>
        <div className="sha-kpi-card">
          <span className="text-[7.5px] uppercase font-bold text-gray-400">EBITDA</span>
          <span className="text-xs font-bold font-mono text-emerald-500">$118.6K</span>
          <span className="text-[7px] text-gray-500">Audit-Ready</span>
        </div>
      </div>

      {/* Animated Bar Chart */}
      <div className="sha-chart-visual">
        {chartData.map((d) => (
          <div key={d.month} className="sha-chart-col">
            <div className="sha-chart-bar-group">
              <div className="sha-bar-rev" style={{ height: `${d.rev}%` }} title={`Revenue: ${d.rev}%`} />
              <div className="sha-bar-exp" style={{ height: `${d.exp}%` }} title={`Expense: ${d.exp}%`} />
            </div>
            <span className="text-[8px] font-bold text-gray-400">{d.month}</span>
          </div>
        ))}
      </div>

      {/* Sample Data Disclaimer Watermark */}
      <div className="mt-2 text-center text-[7.5px] text-gray-400 uppercase tracking-widest font-mono">
        Illustrative Sample Data &bull; Automated Monthly Executive Deck
      </div>
    </div>
  );
}

/* ==========================================================================
   10. BUSINESS TAX PLANNING HERO ANIMATION
   Concept: 12-Month Jan-Dec interactive planning roadmap, estimated tax
   safe-harbor checkpoints, projection graph, and year-end milestones.
   ========================================================================== */
export function BusinessTaxPlanningHero() {
  const [activeQ, setActiveQ] = useState(2); // Q2 default

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveQ((q) => (q % 4) + 1);
    }, 3400);
    return () => clearInterval(timer);
  }, []);

  const quarters = [
    { q: 'Q1 (Jan–Mar)', title: 'Entity Election', desc: 'S-Corp Form 2553 & Prior Year Close' },
    { q: 'Q2 (Apr–Jun)', title: 'Safe Harbor Q1/Q2', desc: '110% Prior Year Safe-Harbor Projection' },
    { q: 'Q3 (Jul–Sep)', title: 'CapEx Acceleration', desc: 'Section 179 & Bonus Depreciation Planning' },
    { q: 'Q4 (Oct–Dec)', title: 'Year-End Optimization', desc: 'Pre-Paid Expenses & Retirement Ramps' },
  ];

  return (
    <div className="sha-terminal" aria-label="Annual Tax Planning Calendar">
      <div className="sha-header">
        <div className="sha-header-brand">
          <span className="sha-header-gem" />
          <span>Annual Strategic Tax Roadmap</span>
        </div>
        <div className="sha-header-actions">
          <div className="sha-status-pill">
            <span className="sha-status-dot" />
            <span>4-Quarter Horizon</span>
          </div>
        </div>
      </div>

      {/* 4 Quarters */}
      <div className="sha-calendar-quarters">
        {quarters.map((q, i) => (
          <div
            key={q.q}
            onClick={() => setActiveQ(i + 1)}
            className={`sha-quarter-card ${activeQ === i + 1 ? 'active' : ''}`}
          >
            <div className="text-[8px] font-mono text-emerald-500 font-bold">{q.q.split(' ')[0]}</div>
            <div className="text-[9px] font-bold truncate">{q.title}</div>
          </div>
        ))}
      </div>

      {/* Active Milestone Card */}
      <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-emerald-500/20 mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-bold text-emerald-500">{quarters[activeQ - 1].q}</span>
          <span className="text-[8px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-mono font-bold">
            Active Planning Phase
          </span>
        </div>
        <div className="text-[11px] font-bold">{quarters[activeQ - 1].title}</div>
        <div className="text-[8.5px] text-gray-500 mt-0.5">{quarters[activeQ - 1].desc}</div>
      </div>

      {/* Bottom Strategy Callout */}
      <div className="flex items-center justify-between text-[8.5px] text-gray-500 px-1">
        <span>Quarterly Estimated Federal Deadlines: Apr 15 &bull; Jun 15 &bull; Sep 15 &bull; Jan 15</span>
        <span className="text-emerald-500 font-bold font-mono">Penalties Avoided: 100%</span>
      </div>
    </div>
  );
}
