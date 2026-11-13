import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowDown,
  BadgeCheck,
  Banknote,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Calculator,
  ChartNoAxesCombined,
  Check,
  CircleDollarSign,
  ClipboardCheck,
  CreditCard,
  FileCheck2,
  FileSearch,
  FileWarning,
  FileSpreadsheet,
  Files,
  GitCompareArrows,
  Landmark,
  LockKeyhole,
  ListChecks,
  Network,
  Receipt,
  SearchCheck,
  ScanSearch,
  Sparkles,
  ShieldCheck,
  TableProperties,
  UserRoundPlus,
  Users,
  WalletCards,
  type LucideIcon
} from 'lucide-react';
import type { ServiceItem } from '../data/services';
import './ServiceWorkflowAnimation.css';
import './ServiceSceneVisuals.css';

type Scene = {
  eyebrow: string;
  stages: [string, string, string, string];
  source: string;
  focus: string;
  result: string;
  metric: string;
  icon: LucideIcon;
};

const scenes: Record<string, Scene> = {
  'individual-tax-prep': {
    eyebrow: 'PERSONAL RETURN • FORM 1040',
    stages: ['Income docs', 'Deductions', 'Tax calculation', 'Return filed'],
    source: 'W-2 · 1099-DIV · 1098',
    focus: 'Federal + state return',
    result: 'E-file ready',
    metric: '1040',
    icon: FileSpreadsheet
  },
  'family-tax-planning': {
    eyebrow: 'HOUSEHOLD STRATEGY',
    stages: ['Family profile', 'Dependent review', 'Credit modeling', 'Action plan'],
    source: 'Parents · dependents · goals',
    focus: 'Education + child credits',
    result: 'Multi-year roadmap',
    metric: '3–5 yr',
    icon: Users
  },
  'personal-tax-consultation': {
    eyebrow: 'ONE-TO-ONE ADVISORY',
    stages: ['Client goals', 'Financial review', 'Recommendations', 'Meeting summary'],
    source: 'Questions · income · timeline',
    focus: 'Advisor analysis',
    result: 'Clear next steps',
    metric: '1:1',
    icon: Sparkles
  },
  'irs-assistance': {
    eyebrow: 'NOTICE RESOLUTION',
    stages: ['Notice received', 'Records verified', 'Response prepared', 'Case tracked'],
    source: 'IRS notice · client records',
    focus: 'Evidence-backed response',
    result: 'Resolution in progress',
    metric: 'CASE',
    icon: Landmark
  },
  'business-tax-preparation': {
    eyebrow: 'BUSINESS RETURN • 1120 / 1065',
    stages: ['Revenue mapped', 'Expenses reviewed', 'Deductions tested', 'Return finalized'],
    source: 'P&L · balance sheet · forms',
    focus: 'Business tax calculation',
    result: 'Reviewed return',
    metric: '1120',
    icon: BriefcaseBusiness
  },
  'accounting-services': {
    eyebrow: 'ACCOUNTING CYCLE',
    stages: ['Transactions', 'Journal entries', 'Ledger posting', 'Accounts balanced'],
    source: 'Source transactions',
    focus: 'General ledger',
    result: 'Balanced books',
    metric: 'DR = CR',
    icon: BookOpenCheck
  },
  bookkeeping: {
    eyebrow: 'BOOKS IN ORDER',
    stages: ['Receipt intake', 'Categorization', 'Bank matching', 'Books reconciled'],
    source: 'Receipts · invoices · bank feed',
    focus: 'Categorized activity',
    result: 'Reconciled books',
    metric: 'MATCH',
    icon: Receipt
  },
  'payroll-management': {
    eyebrow: 'PEOPLE & PAY',
    stages: ['Employee records', 'Hours approved', 'Pay + deductions', 'Payroll summary'],
    source: 'Team · hours · pay rates',
    focus: 'Withholding calculation',
    result: 'Pay run reviewed',
    metric: 'PAYDAY',
    icon: WalletCards
  },
  'financial-reporting': {
    eyebrow: 'MANAGEMENT REPORTING',
    stages: ['Financial data', 'Income statement', 'Balance sheet', 'KPI dashboard'],
    source: 'Current-period ledger',
    focus: 'Performance signals',
    result: 'Decision-ready report',
    metric: 'Q4',
    icon: ChartNoAxesCombined
  },
  'business-tax-planning': {
    eyebrow: 'PROACTIVE TAX STRATEGY',
    stages: ['Business outlook', 'Model scenarios', 'Compare deductions', 'Recommendations'],
    source: 'Forecast · entity · goals',
    focus: 'Tax scenario analysis',
    result: 'Planning brief',
    metric: 'PLAN',
    icon: Calculator
  },
  'tax-prep-outsourcing': {
    eyebrow: 'SECURE PREPARATION POD',
    stages: ['Client upload', 'Work assigned', 'Return prepared', 'QA + delivery'],
    source: 'Secure client workspace',
    focus: 'Assigned prep queue',
    result: 'Reviewed workpapers',
    metric: 'QUEUE',
    icon: Files
  },
  'bookkeeping-outsourcing': {
    eyebrow: 'BOOKKEEPING DELIVERY',
    stages: ['Transaction intake', 'Coding queue', 'Reconciliation', 'Quality review'],
    source: 'Bank + sales activity',
    focus: 'Categorization desk',
    result: 'Closed books',
    metric: 'CLOSE',
    icon: ListChecks
  },
  'accounting-outsourcing': {
    eyebrow: 'CONNECTED ACCOUNTING',
    stages: ['Data transfer', 'Account workflow', 'Balance checks', 'Records delivered'],
    source: 'Client accounting system',
    focus: 'Verified ledger entries',
    result: 'Complete records',
    metric: 'SYNC',
    icon: Network
  },
  'payroll-processing': {
    eyebrow: 'PAY RUN PROCESSING',
    stages: ['Timesheets', 'Gross pay', 'Tax deductions', 'Net pay sent'],
    source: 'Approved hours · pay rates',
    focus: 'Net pay calculation',
    result: 'Payment file ready',
    metric: 'NET',
    icon: Banknote
  },
  'audit-support': {
    eyebrow: 'AUDIT-READY EVIDENCE',
    stages: ['Collect records', 'Index evidence', 'Verify checklist', 'Support package'],
    source: 'Requests · supporting docs',
    focus: 'Evidence index',
    result: 'Organized response set',
    metric: 'PBC',
    icon: ClipboardCheck
  },
  'financial-statement-prep': {
    eyebrow: 'FINANCIAL STATEMENTS',
    stages: ['Ledger balances', 'Income statement', 'Balance sheet', 'Cash flow'],
    source: 'Adjusted trial balance',
    focus: 'Statement preparation',
    result: 'Financial package',
    metric: 'GAAP',
    icon: FileCheck2
  },
  'tax-review-support': {
    eyebrow: 'RETURN QUALITY REVIEW',
    stages: ['Return received', 'Inspect entries', 'Flag exceptions', 'Approve status'],
    source: 'Draft return · workpapers',
    focus: 'Compliance checks',
    result: 'Review sign-off',
    metric: 'QC',
    icon: FileSearch
  },
  'year-end-cleanup': {
    eyebrow: 'YEAR-END CLOSE',
    stages: ['Find open items', 'Detect duplicates', 'Correct balances', 'Close the year'],
    source: 'Unreconciled activity',
    focus: 'Corrections + tie-outs',
    result: 'Year-end ready',
    metric: '12/31',
    icon: ScanSearch
  },
  'write-up-services': {
    eyebrow: 'SOURCE-TO-LEDGER',
    stages: ['Client documents', 'Sort & classify', 'Post ledger entries', 'Organized records'],
    source: 'Statements · receipts · notes',
    focus: 'Write-up ledger',
    result: 'Clean financial records',
    metric: 'GL',
    icon: FileSpreadsheet
  },
  'dedicated-staff-augmentation': {
    eyebrow: 'EXTENDED ACCOUNTING TEAM',
    stages: ['Team onboarding', 'Assign work', 'Collaborate', 'Deliver & report'],
    source: 'Dedicated accounting pod',
    focus: 'Shared workboard',
    result: 'Completed deliverables',
    metric: 'TEAM',
    icon: UserRoundPlus
  }
};

function ServiceSceneVisual({ slug, stage, customStats }: { slug: string; stage: number; customStats?: any }) {
  const step = stage + 1;

  switch (slug) {
    case 'individual-tax-prep': {
      const s1Label = customStats?.stat1Label || 'FILING STATUS';
      const s1Val = customStats?.stat1Value || (step === 1 ? 'Single' : 'Head of household');
      const s2Label = customStats?.stat2Label || 'INCOME VERIFIED';
      const s2Val = customStats?.stat2Value || '$84,200';
      const s3Label = customStats?.stat3Label || 'DEDUCTIONS';
      const s3Val = customStats?.stat3Value || (step > 1 ? '$16,100' : 'Reviewing');

      return (
        <div className={`service-scene service-scene--1040 service-scene--step-${step}`}>
          <div className="service-scene__form-heading"><FileSpreadsheet /><span>FORM 1040 <small>INDIVIDUAL RETURN · SAMPLE</small></span><i>{step === 4 ? 'READY' : 'DRAFT'}</i></div>
          <div className="service-scene__form-fields">
            <span><small>{s1Label}</small><b>{s1Val}</b></span>
            <span><small>{s2Label}</small><b>{s2Val}</b></span>
            <span><small>{s3Label}</small><b>{s3Val}</b></span>
          </div>
          <div className="service-scene__tax-outcome"><span>{step > 2 ? 'ESTIMATED REFUND' : 'TAXABLE INCOME'}</span><strong>{step > 2 ? '$2,480' : '$68,100'}</strong><i style={{ width: `${26 + step * 17}%` }} /></div>
        </div>
      );
    }
    case 'family-tax-planning':
      return (
        <div className={`service-scene service-scene--family service-scene--step-${step}`}>
          <div className="service-scene__family-members"><span><i>AM</i><b>Alex<small>Parent</small></b></span><span><i>JM</i><b>Jordan<small>Parent</small></b></span><span><i>+</i><b>2 dependents<small>Household</small></b></span></div>
          <div className="service-scene__credit-map"><span><Users /><b>Household profile</b><i /></span><span><CircleDollarSign /><b>Child tax credit</b><strong>{customStats?.stat2Value || (step > 1 ? '$4,000*' : 'Review')}</strong></span><span><BookOpenCheck /><b>Education plan</b><strong>{customStats?.stat3Value || (step > 2 ? '529' : 'Modeling')}</strong></span></div>
          <small className="service-scene__footnote">*Illustrative planning example</small>
        </div>
      );
    case 'personal-tax-consultation':
      return (
        <div className={`service-scene service-scene--consultation service-scene--step-${step}`}>
          <div className="service-scene__appointment"><span className="service-scene__calendar"><small>OCT</small><b>24</b></span><span><b>Tax strategy session</b><small>Advisor availability · sample</small></span><i>{step === 1 ? 'REQUESTED' : 'CONFIRMED'}</i></div>
          <div className="service-scene__availability"><small>ADVISOR AVAILABILITY</small><span><i>9:00</i><i className={step === 2 ? 'is-selected' : ''}>10:30</i><i>1:00</i><i>2:30</i></span></div>
          <div className="service-scene__recommendation"><Sparkles /><span><small>PERSONALIZED INSIGHT</small><b>{step > 2 ? 'Review withholding before year-end' : 'Income and goals under review'}</b></span></div>
        </div>
      );
    case 'irs-assistance':
      return (
        <div className={`service-scene service-scene--irs service-scene--step-${step}`}>
          <div className="service-scene__notice"><span><FileWarning /><b>IRS NOTICE<small>Correspondence · sample</small></b></span><strong>CP-2000</strong><small>Tax year 2024</small></div>
          <div className="service-scene__case-line"><span className="is-done"><i>1</i>Notice logged</span><span className={step > 1 ? 'is-done' : ''}><i>2</i>Records matched</span><span className={step > 2 ? 'is-done' : ''}><i>3</i>Response submitted</span><span className={step > 3 ? 'is-done' : ''}><i>4</i>Case resolution</span></div>
          <div className="service-scene__case-status"><ShieldCheck /><span><small>CASE STATUS</small><b>{step === 4 ? 'Awaiting IRS response' : 'Evidence review in progress'}</b></span><i>{step}/4</i></div>
        </div>
      );
    case 'business-tax-preparation': {
      const label1 = customStats?.stat1Label || 'GROSS RECEIPTS';
      const val1 = customStats?.stat1Value || '$1.24M';
      const sub1 = customStats?.stat1Sub || '+8.2%';

      const label2 = customStats?.stat2Label || 'OPERATING COSTS';
      const val2 = customStats?.stat2Value || '$846K';
      const sub2 = customStats?.stat2Sub || 'Reviewed';

      const label3 = customStats?.stat3Label || 'TAXABLE INCOME';
      const val3 = customStats?.stat3Value || (step > 2 ? '$286K' : 'Calculating');
      const sub3 = customStats?.stat3Sub || '1120-S · sample';

      return (
        <div className={`service-scene service-scene--business-tax service-scene--step-${step}`}>
          <div className="service-scene__business-metrics">
            <span>
              <small>{label1}</small>
              <b>{val1}</b>
              <i>{sub1}</i>
            </span>
            <span>
              <small>{label2}</small>
              <b>{val2}</b>
              <i>{sub2}</i>
            </span>
            <span>
              <small>{label3}</small>
              <b>{val3}</b>
              <i>{sub3}</i>
            </span>
          </div>
          <div className="service-scene__tax-ruler"><span>Revenue</span><i><b style={{ width: '92%' }} /></i><span>Expenses</span><i><b style={{ width: `${60 + step * 5}%` }} /></i><span>Deductions</span><i><b style={{ width: `${28 + step * 11}%` }} /></i></div>
        </div>
      );
    }
    case 'accounting-services':
      return (
        <div className={`service-scene service-scene--journal service-scene--step-${step}`}>
          <div className="service-scene__journal-title"><TableProperties /><b>JOURNAL ENTRY <small>JE-1024 · SAMPLE</small></b><i>{step > 2 ? 'POSTED' : 'IN REVIEW'}</i></div>
          <div className="service-scene__journal-head"><span>ACCOUNT</span><span>DEBIT</span><span>CREDIT</span></div>
          <div className="service-scene__journal-row"><span>Operating cash</span><b>$8,420</b><i>—</i></div>
          <div className="service-scene__journal-row"><span>Client revenue</span><b>—</b><i>$8,420</i></div>
          <div className="service-scene__journal-total"><span>DEBITS = CREDITS</span><strong>{step > 1 ? '$8,420 = $8,420' : 'Balancing…'}</strong></div>
        </div>
      );
    case 'bookkeeping':
      return (
        <div className={`service-scene service-scene--bookkeeping service-scene--step-${step}`}>
          <div className="service-scene__receipt-stack"><span><Receipt /><b>COFFEE SUPPLY CO.<small>Card · Oct 18</small></b><strong>-$84.20</strong></span><span><Receipt /><b>CLOUD HOSTING<small>ACH · Oct 19</small></b><strong>-$129.00</strong></span><span><Receipt /><b>CLIENT PAYMENT<small>Transfer · Oct 20</small></b><strong>+$2,450.00</strong></span></div>
          <div className="service-scene__bookkeeping-footer"><span><i />{step === 1 ? 'New items received' : 'Bank feed synced'}</span><strong>{step > 2 ? '3 / 3 MATCHED' : 'CATEGORIZING'}</strong></div>
        </div>
      );
    case 'payroll-management':
      return (
        <div className={`service-scene service-scene--payroll service-scene--step-${step}`}>
          <div className="service-scene__payroll-head"><span>TEAM PAY RUN</span><strong>OCT 31 · SAMPLE</strong></div>
          <div className="service-scene__employee-row"><i>JD</i><span><b>Jamie D.</b><small>80.0 hrs · approved</small></span><strong>$3,200</strong><CheckCircle2 /></div>
          <div className="service-scene__employee-row"><i>RK</i><span><b>Riley K.</b><small>76.5 hrs · approved</small></span><strong>$3,060</strong><CheckCircle2 /></div>
          <div className="service-scene__payroll-totals"><span>GROSS <b>$6,260</b></span><span>WITHHOLDING <b>−$1,142</b></span><span>NET PAY <b>{step > 2 ? '$5,118' : 'Calculating'}</b></span></div>
          <div className="service-scene__payroll-progress"><i><b style={{ width: `${step * 25}%` }} /></i><small>{step === 4 ? 'APPROVAL COMPLETE' : 'PAYROLL REVIEW'}</small></div>
        </div>
      );
    case 'financial-reporting':
      return (
        <div className={`service-scene service-scene--reporting service-scene--step-${step}`}>
          <div className="service-scene__report-kpis"><span><small>REVENUE</small><b>$248.6k</b><i>+12.4%</i></span><span><small>OPERATING COSTS</small><b>$172.3k</b><i>−3.1%</i></span><span><small>NET MARGIN</small><b>30.7%</b><i>+4.8 pts</i></span></div>
          <div className="service-scene__report-chart"><div className="service-scene__chart-legend"><span>Revenue</span><i /><span>Expenses</span><i /></div><div className="service-scene__chart-bars">{[48, 69, 54, 78, 64, 87, 72, 96].map((height, i) => <span key={i}><i style={{ height: `${height}%` }} /><b style={{ height: `${Math.max(14, height * 0.62)}%` }} /></span>)}</div><small>MONTHLY PERFORMANCE · SAMPLE</small></div>
        </div>
      );
    case 'business-tax-planning':
      return (
        <div className={`service-scene service-scene--scenarios service-scene--step-${step}`}>
          <div className="service-scene__forecast"><span>ESTIMATED PROFIT<small>Annual forecast · sample</small></span><strong>$320,000</strong><i><b style={{ width: `${25 + step * 16}%` }} /></i></div>
          <div className="service-scene__scenario-cards"><span><small>BASELINE</small><b>$74,800</b><i>Projected tax</i></span><span className="is-optimized"><small>OPTIMIZED SCENARIO</small><b>$61,200</b><i>Illustrative estimate</i></span></div>
          <div className="service-scene__scenario-note"><GitCompareArrows /><span>{step > 2 ? 'Compare assumptions with advisor' : 'Modeling entity and deduction options'}</span></div>
        </div>
      );
    case 'tax-prep-outsourcing':
      return (
        <div className={`service-scene service-scene--outsourcing-tax service-scene--step-${step}`}>
          <div className="service-scene__secure-queue"><span><LockKeyhole /><b>FIRM PORTAL<small>Encrypted document handoff</small></b></span><i>{step === 1 ? 'INTAKE' : 'ASSIGNED'}</i></div>
          <div className="service-scene__work-lanes"><span><small>INTAKE</small><b>1040 · 2025</b><i>Docs verified</i></span><ArrowRight /><span className={step > 1 ? 'is-active' : ''}><small>PREP POD</small><b>Workpaper</b><i>Assigned</i></span><ArrowRight /><span className={step > 2 ? 'is-active' : ''}><small>QUALITY REVIEW</small><b>CPA check</b><i>Dual review</i></span></div>
          <div className="service-scene__queue-footer"><Files /> Secure delivery to client workspace <strong>{step}/4</strong></div>
        </div>
      );
    case 'bookkeeping-outsourcing':
      return (
        <div className={`service-scene service-scene--bank-feed service-scene--step-${step}`}>
          <div className="service-scene__feed-head"><span>TRANSACTION BATCH <small>CLIENT 047 · OCTOBER</small></span><i><b /> SYNCED</i></div>
          <div className="service-scene__feed-transactions"><span><b>ACH · Cloud tools</b><small>Software expense</small><strong>−$249</strong></span><span><b>Card · City market</b><small>Office supplies</small><strong>−$86</strong></span><span><b>ACH · Client invoice</b><small>Accounts receivable</small><strong>+$4,820</strong></span></div>
          <div className="service-scene__match-meter"><span>RECONCILIATION</span><i><b style={{ width: `${step * 25}%` }} /></i><strong>{step > 2 ? '3 / 3' : `${step}/3`}</strong></div>
        </div>
      );
    case 'accounting-outsourcing':
      return (
        <div className={`service-scene service-scene--accounting-sync service-scene--step-${step}`}>
          <div className="service-scene__sync-nodes"><span><BriefcaseBusiness /><b>CLIENT ERP<small>Ledger export</small></b></span><i><b /></i><span><Network /><b>ACCOUNTING POD<small>Validation queue</small></b></span></div>
          <div className="service-scene__sync-batch"><span><small>JOURNAL BATCH</small><b>JE-{240 + stage}</b></span><span><small>ACCOUNTS MAPPED</small><b>{step > 1 ? '18 / 18' : 'Mapping'}</b></span><span><small>STATUS</small><b>{step === 4 ? 'HANDOFF READY' : 'VERIFYING'}</b></span></div>
          <div className="service-scene__sync-records"><span>Cash</span><i /><span>Receivables</span><i /><span>Revenue</span><i /></div>
        </div>
      );
    case 'payroll-processing':
      return (
        <div className={`service-scene service-scene--payslip service-scene--step-${step}`}>
          <div className="service-scene__pay-slip"><div><span><CreditCard /><b>PAYMENT BATCH<small>Biweekly · sample</small></b></span><strong>PAY-{804 + stage}</strong></div><p><span>Gross pay</span><b>$3,200.00</b></p><p><span>Federal + state withholding</span><b>−$612.40</b></p><p><span>Benefits</span><b>−$148.00</b></p><p className="is-net"><span>Net deposit</span><b>${step > 2 ? '2,439.60' : 'Calculating'}</b></p></div>
          <div className="service-scene__payment-status"><span><i />ACH PAYMENT</span><strong>{step === 4 ? 'TRANSMITTED' : 'SECURE PROCESSING'}</strong></div>
        </div>
      );
    case 'audit-support':
      return (
        <div className={`service-scene service-scene--audit service-scene--step-${step}`}>
          <div className="service-scene__audit-summary"><span><ClipboardCheck /><b>PBC REQUEST LIST<small>Evidence package · sample</small></b></span><strong>{step > 2 ? '4 / 4' : `${step}/4`}<small>VERIFIED</small></strong></div>
          <div className="service-scene__audit-checks"><span><i className={step > 0 ? 'is-checked' : ''}><Check /></i>Bank statements <b>Oct–Dec</b></span><span><i className={step > 1 ? 'is-checked' : ''}><Check /></i>Revenue support <b>Invoices</b></span><span><i className={step > 2 ? 'is-checked' : ''}><Check /></i>Expense samples <b>Receipts</b></span><span><i className={step > 3 ? 'is-checked' : ''}><Check /></i>Reconciliation <b>Reviewed</b></span></div>
          <div className="service-scene__evidence-tag"><ShieldCheck /> Evidence indexed · review-ready</div>
        </div>
      );
    case 'financial-statement-prep':
      return (
        <div className={`service-scene service-scene--statements service-scene--step-${step}`}>
          <div className="service-scene__statement-tabs"><span className={step === 1 ? 'is-active' : ''}>P&amp;L</span><span className={step === 2 ? 'is-active' : ''}>BALANCE</span><span className={step >= 3 ? 'is-active' : ''}>CASH FLOW</span></div>
          <div className="service-scene__statement-paper"><div><FileCheck2 /><span><b>{step === 1 ? 'Income statement' : step === 2 ? 'Balance sheet' : 'Cash flow statement'}</b><small>Period ending Oct 31 · sample</small></span></div><p><span>{step === 1 ? 'Total revenue' : step === 2 ? 'Total assets' : 'Operating cash'}</span><b>{step === 1 ? '$248,600' : step === 2 ? '$186,420' : '$32,840'}</b></p><p><span>{step === 1 ? 'Operating expenses' : step === 2 ? 'Total liabilities' : 'Investing cash'}</span><b>{step === 1 ? '$172,300' : step === 2 ? '$74,100' : '−$8,240'}</b></p><div className="service-scene__statement-foot"><CheckCircle2 /> VALIDATED · DEBITS = CREDITS</div></div>
        </div>
      );
    case 'tax-review-support':
      return (
        <div className={`service-scene service-scene--tax-review service-scene--step-${step}`}>
          <div className="service-scene__review-doc"><span><FileSearch /><b>RETURN REVIEW<small>Draft 1040 · sample</small></b></span><i>{step > 2 ? 'CHECKED' : 'SCANNING'}</i></div>
          <div className="service-scene__review-lines"><span><b>W-2 income</b><i>$84,200</i><CheckCircle2 /></span><span className={step === 2 ? 'is-highlighted' : ''}><b>Withholding match</b><i>$12,640</i><CheckCircle2 /></span><span className={step === 3 ? 'is-highlighted' : ''}><b>Credit eligibility</b><i>{step > 2 ? 'Verified' : 'Review'}</i><SearchCheck /></span></div>
          <div className="service-scene__review-result"><span>QUALITY CHECKS</span><strong>{step === 4 ? 'APPROVED' : `${step + 1} / 4 PASSED`}</strong></div>
        </div>
      );
    case 'year-end-cleanup':
      return (
        <div className={`service-scene service-scene--year-end service-scene--step-${step}`}>
          <div className="service-scene__close-date"><span>FISCAL YEAR CLOSE</span><strong>DEC 31 <small>· SAMPLE</small></strong></div>
          <div className="service-scene__close-stack"><span><i className="is-alert"><FileWarning /></i><b>Unmatched items<small>{step < 2 ? '12 transactions' : '4 remaining'}</small></b><strong>{step < 2 ? '12' : '04'}</strong></span><span><i><GitCompareArrows /></i><b>Adjusting entries<small>{step > 1 ? 'Prepared' : 'To prepare'}</small></b><strong>{step > 1 ? '06' : '—'}</strong></span><span><i><CheckCircle2 /></i><b>Account tie-out<small>{step > 2 ? 'Reconciled' : 'Pending'}</small></b><strong>{step > 2 ? '$0' : '…'}</strong></span></div>
          <div className="service-scene__close-progress"><span><i style={{ width: `${step * 25}%` }} /></span><b>{step === 4 ? 'CLOSE PACKAGE READY' : 'YEAR-END CHECKLIST'}</b></div>
        </div>
      );
    case 'write-up-services':
      return (
        <div className={`service-scene service-scene--writeup service-scene--step-${step}`}>
          <div className="service-scene__writeup-flow"><span><Files /><b>SOURCE DOCS<small>Bank · receipts</small></b></span><i><ArrowRight /></i><span><Calculator /><b>CLASSIFY<small>{step > 1 ? 'Mapped' : 'In progress'}</small></b></span><i><ArrowRight /></i><span><BookOpenCheck /><b>LEDGER<small>{step > 2 ? 'Posted' : 'Pending'}</small></b></span></div>
          <div className="service-scene__writeup-entry"><span>DATE</span><span>ACCOUNT</span><span>AMOUNT</span><b>10/18</b><b>Office expense</b><b>$84.20</b></div>
          <div className="service-scene__writeup-note"><CheckCircle2 /> Source-to-ledger trail retained</div>
        </div>
      );
    case 'dedicated-staff-augmentation':
      return (
        <div className={`service-scene service-scene--staffing service-scene--step-${step}`}>
          <div className="service-scene__staff-match"><span><UserRoundPlus /><b>CAPACITY MATCH<small>Seasonal workload · sample</small></b></span><strong>{step > 1 ? '3 specialists' : 'Matching…'}</strong></div>
          <div className="service-scene__staff-profiles"><span><i>EA</i><b>Tax prep<small>1040 · 1120S</small></b><strong>{step > 1 ? 'ASSIGNED' : 'AVAILABLE'}</strong></span><span><i>BK</i><b>Bookkeeping<small>QBO · close</small></b><strong>{step > 2 ? 'ASSIGNED' : 'MATCHING'}</strong></span><span><i>QA</i><b>Reviewer<small>Workpaper QA</small></b><strong>{step > 3 ? 'ON POD' : 'NEXT'}</strong></span></div>
          <div className="service-scene__workload"><span>WEEKLY CAPACITY</span><i><b style={{ width: `${30 + step * 15}%` }} /></i><strong>{step * 8} / 40 hrs</strong></div>
        </div>
      );
    default: {
      const label1 = customStats?.stat1Label || 'STAGE STATUS';
      const val1 = customStats?.stat1Value || 'Active';
      const sub1 = customStats?.stat1Sub || 'In Process';

      const label2 = customStats?.stat2Label || 'VERIFICATION';
      const val2 = customStats?.stat2Value || 'Dual CPA';
      const sub2 = customStats?.stat2Sub || 'Direct Review';

      const label3 = customStats?.stat3Label || 'PROGRESS';
      const val3 = customStats?.stat3Value || `Step 0${step}`;
      const sub3 = customStats?.stat3Sub || 'Of 04 Stages';

      return (
        <div className={`service-scene service-scene--btax service-scene--step-${step}`}>
          <div className="service-scene__calc-card">
            <div className="service-scene__metric-row">
              <div className="service-scene__metric"><span>{label1}</span><strong>{val1}</strong><small>{sub1}</small></div>
              <div className="service-scene__metric"><span>{label2}</span><strong>{val2}</strong><small>{sub2}</small></div>
              <div className="service-scene__metric"><span>{label3}</span><strong>{val3}</strong><small>{sub3}</small></div>
            </div>
            <div className="service-scene__calc-bars">
              <div className="service-scene__calc-bar"><span style={{ width: `${(step) * 25}%` }} /></div>
            </div>
          </div>
        </div>
      );
    }
  }
}

interface ServiceWorkflowAnimationProps {
  service: ServiceItem;
  variant?: 'hero' | 'detail';
}

export function ServiceWorkflowAnimation({
  service,
  variant = 'hero'
}: ServiceWorkflowAnimationProps) {
  const fallbackScene = scenes[service.slug] || scenes['business-tax-preparation'];
  const dynamicConfig = service.heroAnimationConfig || {};

  const scene: Scene = {
    eyebrow: dynamicConfig.eyebrow || fallbackScene.eyebrow,
    stages: (dynamicConfig.stages && dynamicConfig.stages.length === 4
      ? (dynamicConfig.stages as [string, string, string, string])
      : (service.workflow && service.workflow.length >= 4
        ? [service.workflow[0].title, service.workflow[1].title, service.workflow[2].title, service.workflow[3].title]
        : fallbackScene.stages)),
    source: dynamicConfig.source || fallbackScene.source,
    focus: dynamicConfig.focus || fallbackScene.focus,
    result: dynamicConfig.result || fallbackScene.result,
    metric: dynamicConfig.metric || fallbackScene.metric,
    icon: fallbackScene.icon,
  };
  const visualSlug = scenes[service.slug] ? service.slug : 'business-tax-preparation';
  const Icon = scene.icon;

  const rootRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState === 'visible'
  );

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setIsPageVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  return (
    <div
      ref={rootRef}
      className={`service-workflow service-workflow--${variant} service-workflow--${visualSlug}`}
      data-running={isVisible && isPageVisible}
      aria-label={`${service.name} workflow: ${scene.stages.join(', ')}`}
      role="img"
    >
      <div className="service-workflow__topline">
        <span className="service-workflow__eyebrow">{scene.eyebrow}</span>
        <span className="service-workflow__cycle">ILLUSTRATIVE SAMPLE · LIVE WORKFLOW</span>
      </div>
      <div className="service-workflow__artwork">
        <div className="service-workflow__source">
          <span className="service-workflow__source-icon"><Icon aria-hidden="true" /></span>
          <span className="service-workflow__source-label">{scene.source}</span>
        </div>
        <div className="service-workflow__stages" aria-hidden="true">
          {scene.stages.map((stage, index) => (
            <div
              className="service-workflow__stage"
              key={stage}
              style={{ animationDelay: `${((4 - index) % 4) * -2.25}s` }}
            >
              <span className="service-workflow__stage-head">
                <span className="service-workflow__stage-number">STAGE 0{index + 1} / 04</span>
                <Icon className="service-workflow__stage-icon" aria-hidden="true" />
              </span>
              <strong className="service-workflow__stage-title">{stage}</strong>
              <ServiceSceneVisual slug={visualSlug} stage={index} customStats={dynamicConfig} />
              <span className="service-workflow__stage-detail">
                {index === 0
                  ? scene.source
                  : index === 1
                    ? scene.focus
                    : index === 2
                      ? `Quality check · ${scene.metric}`
                      : scene.result}
              </span>
              <span className="service-workflow__stage-progress">
                {scene.stages.map((_, progressIndex) => (
                  <i key={progressIndex} className={progressIndex <= index ? 'is-complete' : ''}>
                    {progressIndex === index && <b />}
                  </i>
                ))}
                <span>{index + 1} OF 04</span>
              </span>
            </div>
          ))}
        </div>
        <div className="service-workflow__focus">
          <span className="service-workflow__focus-icon"><Icon aria-hidden="true" /></span>
          <span>{scene.focus}</span>
          <ArrowDown className="service-workflow__focus-arrow" aria-hidden="true" />
        </div>
        <div className="service-workflow__result">
          <span className="service-workflow__result-mark"><Check aria-hidden="true" /></span>
          <span className="service-workflow__result-label">{scene.result}</span>
          <span className="service-workflow__result-metric">{scene.metric}</span>
          <BadgeCheck className="service-workflow__result-check" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
