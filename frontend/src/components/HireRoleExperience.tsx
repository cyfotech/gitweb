import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  BookOpenCheck,
  Check,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Landmark,
  Layers3,
  LockKeyhole,
  ReceiptText,
  ScanLine,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  WalletCards,
} from 'lucide-react';
import type { HireRole } from '../data/hireRoles';
import './HireRoleExperience.css';

const EASE = [0.22, 1, 0.36, 1] as const;

const MOTION = {
  enter: { opacity: 0, y: 16, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
};

function useWorkflowCycle(length: number) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduceMotion || length < 2) return;
    const timer = window.setInterval(() => setActive(current => (current + 1) % length), 3600);
    return () => window.clearInterval(timer);
  }, [length, reduceMotion]);

  return { active, setActive, reduceMotion };
}

function SceneShell({ role, scene, children }: { role: HireRole; scene: string; children: React.ReactNode }) {
  return (
    <div className={`hire-scene hire-scene-${scene}`} data-role-scene={role.slug}>
      <div className="hire-scene-ambient hire-scene-ambient-a" />
      <div className="hire-scene-ambient hire-scene-ambient-b" />
      <div className="hire-scene-grid" />
      <div className="hire-scene-orbit hire-scene-orbit-a" />
      <div className="hire-scene-orbit hire-scene-orbit-b" />
      <div className="hire-scene-content">{children}</div>
      <div className="hire-scene-caption">
        <span className="hire-scene-caption-dot" />
        <span>LIVE WORKSPACE</span>
        <span className="hire-scene-caption-divider" />
        <span>{role.shortTitle}</span>
      </div>
    </div>
  );
}

function SceneTopbar({ icon: Icon, label, status = 'In progress' }: {
  icon: typeof FileText;
  label: string;
  status?: string;
}) {
  return (
    <div className="hire-scene-topbar">
      <div className="hire-scene-brand">
        <span className="hire-scene-brand-icon"><Icon size={15} /></span>
        <span>{label}</span>
      </div>
      <span className="hire-scene-status"><i />{status}</span>
    </div>
  );
}

function SceneTabs({ items, active, onSelect }: {
  items: string[];
  active: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="hire-scene-tabs" role="group" aria-label="Select workflow view">
      {items.map((item, index) => (
        <button
          type="button"
          key={item}
          className={active === index ? 'is-active' : ''}
          aria-pressed={active === index}
          onClick={() => onSelect(index)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function TaxPreparationScene({ role }: { role: HireRole }) {
  const forms = ['1040', '1120', '1120S', '1065'];
  const { active, setActive, reduceMotion } = useWorkflowCycle(forms.length);
  const progress = [68, 82, 74, 91][active];

  return (
    <SceneShell role={role} scene="tax">
      <motion.div
        className="tax-document-stack"
        initial={reduceMotion ? false : MOTION.enter}
        animate="show"
        transition={{ duration: reduceMotion ? 0 : 0.65, ease: EASE, delay: 0.16 }}
      >
        {forms.map((form, index) => (
          <button
            type="button"
            className={`tax-document tax-document-${index + 1}${active === index ? ' is-selected' : ''}`}
            key={form}
            onClick={() => setActive(index)}
            aria-pressed={active === index}
          >
            <span className="tax-document-fold" />
            <FileText size={14} />
            <strong>Form {form}</strong>
            <small>{index === 0 ? 'Individual' : 'Business return'}</small>
            <i>{active === index ? <Check size={10} /> : String(index + 1).padStart(2, '0')}</i>
          </button>
        ))}
        <span className="tax-document-stack-label"><Layers3 size={12} /> TAX FORMS</span>
      </motion.div>

      <motion.div
        className="tax-workspace"
        initial={reduceMotion ? false : { opacity: 0, y: 22, rotateY: -7, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, rotateY: -3, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.8, ease: EASE, delay: 0.05 }}
        whileHover={reduceMotion ? undefined : { rotateY: 0, y: -3, transition: { duration: 0.35 } }}
      >
        <SceneTopbar icon={FileSpreadsheet} label="RETURN WORKSPACE" status="Preparing" />
        <div className="tax-workspace-title">
          <div><small>CLIENT FILING · 2025</small><h3>Federal return</h3></div>
          <span className="tax-workspace-secure"><LockKeyhole size={12} /> SECURE</span>
        </div>

        <SceneTabs items={forms} active={active} onSelect={setActive} />

        <div className="tax-workspace-metrics">
          <div className="tax-metric-primary">
            <span>ESTIMATED REFUND</span>
            <strong>${(2840 + active * 315).toLocaleString()}</strong>
            <small><TrendingUp size={12} /> Calculated from verified entries</small>
          </div>
          <div className="tax-donut" style={{ '--tax-progress': `${progress}%` } as React.CSSProperties}>
            <span><b>{progress}%</b><small>complete</small></span>
          </div>
        </div>

        <div className="tax-chart-panel">
          <div className="tax-chart-heading"><span>Income summary</span><small>ANNUAL · USD</small></div>
          <div className="tax-chart">
            <div className="tax-chart-ylabels"><span>80k</span><span>40k</span><span>0</span></div>
            <svg viewBox="0 0 360 112" role="img" aria-label="Income and deduction trend chart">
              <defs>
                <linearGradient id="taxAreaGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--scene-accent)" stopOpacity=".28" />
                  <stop offset="100%" stopColor="var(--scene-accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path className="tax-chart-area" d="M2 91 C38 84 47 69 77 74 S118 56 148 63 S192 32 220 46 S264 29 289 38 S327 16 358 12 L358 108 L2 108 Z" />
              <path className="tax-chart-line" pathLength="1" d="M2 91 C38 84 47 69 77 74 S118 56 148 63 S192 32 220 46 S264 29 289 38 S327 16 358 12" />
              <path className="tax-chart-line tax-chart-line-secondary" pathLength="1" d="M2 103 C35 98 50 91 78 94 S118 81 148 88 S193 68 220 78 S260 65 290 72 S327 56 358 54" />
              <circle cx="289" cy="38" r="4" />
            </svg>
          </div>
          <div className="tax-chart-xlabels"><span>JAN</span><span>APR</span><span>JUL</span><span>OCT</span><span>DEC</span></div>
        </div>

        <div className="tax-workspace-footer">
          <span><CheckCircle2 size={13} /> {forms[active]} data reconciled</span>
          <span>STEP {active + 2} / 5 <ArrowUpRight size={12} /></span>
        </div>
      </motion.div>

      <motion.div className="tax-float-chip tax-chip-deductions" animate={reduceMotion ? undefined : { y: [0, -6, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}>
        <span><CircleDollarSign size={16} /></span><div><small>DEDUCTIONS FOUND</small><strong>$12,480</strong></div><i>+8.2%</i>
      </motion.div>
      <motion.div className="tax-float-chip tax-chip-reviewed" animate={reduceMotion ? undefined : { y: [0, 5, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
        <span><BadgeCheck size={16} /></span><div><small>DOCUMENTS</small><strong>12 / 12 verified</strong></div>
      </motion.div>
      <span className="tax-scan-beam" aria-hidden="true" />
    </SceneShell>
  );
}

function TaxReviewScene({ role }: { role: HireRole }) {
  const checks = ['Income & source docs', 'Deductions and credits', 'Basis & carryovers', 'State filing requirements'];
  const { active, setActive, reduceMotion } = useWorkflowCycle(checks.length);
  const reviewScore = [96, 93, 98, 91][active];

  return (
    <SceneShell role={role} scene="review">
      <motion.div
        className="review-board"
        initial={reduceMotion ? false : { opacity: 0, y: 22, rotateY: 6, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, rotateY: 2, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.8, ease: EASE }}
        whileHover={reduceMotion ? undefined : { rotateY: 0, y: -3, transition: { duration: 0.35 } }}
      >
        <SceneTopbar icon={ClipboardCheck} label="QUALITY CONTROL" status="Review active" />
        <div className="review-heading"><div><small>ENGAGEMENT  ·  25-0418</small><h3>Return review</h3></div><span className="review-lock"><ShieldCheck size={13} /> QC</span></div>
        <div className="review-summary">
          <div className="review-score-ring" style={{ '--review-score': `${reviewScore}%` } as React.CSSProperties}>
            <span><strong>{reviewScore}</strong><small>QC SCORE</small></span>
          </div>
          <div className="review-summary-copy"><span>Review confidence</span><strong>Ready for sign-off</strong><small><CheckCircle2 size={12} /> 18 of 19 checks cleared</small></div>
        </div>
        <div className="review-checklist">
          <div className="review-checklist-heading"><span>REVIEW CHECKLIST</span><small>04 SECTIONS</small></div>
          {checks.map((check, index) => (
            <button type="button" className={`review-check-row${active === index ? ' is-active' : ''}`} key={check} onClick={() => setActive(index)} aria-pressed={active === index}>
              <span className={`review-check-icon${index <= active ? ' is-checked' : ''}`}>{index <= active ? <Check size={12} /> : <span>{index + 1}</span>}</span>
              <span>{check}</span>
              <small>{index < active ? 'CLEARED' : index === active ? 'REVIEWING' : 'QUEUED'}</small>
            </button>
          ))}
        </div>
        <div className="review-board-footer"><span><ScanLine size={13} /> Evidence cross-check</span><span>LIVE REVIEW <i /></span></div>
      </motion.div>

      <motion.div className="review-margin-note" initial={reduceMotion ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduceMotion ? 0 : .45, delay: .35 }}>
        <span className="review-note-mark">!</span>
        <div><small>REVIEW NOTE</small><strong>K-1 basis confirmed</strong><span>Source: supporting workpaper</span></div>
        <CheckCircle2 size={16} />
      </motion.div>
      <motion.div className="review-stamp" animate={reduceMotion ? undefined : { rotate: [0, -2, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
        <ShieldCheck size={18} /><span>READY</span><small>FOR SIGN-OFF</small>
      </motion.div>
      <div className="review-orbit-label review-label-one"><FileCheck2 size={13} /> Traceable evidence</div>
      <div className="review-orbit-label review-label-two"><BookOpenCheck size={13} /> Multi-state check</div>
    </SceneShell>
  );
}

function AccountingScene({ role }: { role: HireRole }) {
  const accounts = ['Operating · 2048', 'Payroll · 1182', 'Corporate Visa'];
  const { active, setActive, reduceMotion } = useWorkflowCycle(accounts.length);
  const amounts = ['$28,410.52', '$12,840.00', '$6,284.19'];

  return (
    <SceneShell role={role} scene="accounting">
      <motion.div
        className="accounting-ledger"
        initial={reduceMotion ? false : { opacity: 0, y: 22, rotateY: -5, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, rotateY: -2, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.8, ease: EASE }}
        whileHover={reduceMotion ? undefined : { rotateY: 0, y: -3, transition: { duration: 0.35 } }}
      >
        <SceneTopbar icon={FileSpreadsheet} label="GENERAL LEDGER" status="Synced" />
        <div className="accounting-heading"><div><small>MONTH-END CLOSE · MAY 2025</small><h3>Reconciliation</h3></div><span><Landmark size={14} /> BANK FEED</span></div>
        <SceneTabs items={['Operating', 'Payroll', 'Card']} active={active} onSelect={setActive} />
        <div className="account-balance-row">
          <div><small>STATEMENT BALANCE</small><strong>{amounts[active]}</strong></div>
          <span className="account-balanced"><Check size={12} /> MATCHED</span>
        </div>
        <div className="accounting-table">
          <div className="accounting-table-head"><span>TRANSACTION</span><span>BOOKS</span><span>STATUS</span></div>
          {[
            ['Client payment · INV-284', '$4,800.00', 'Matched'],
            ['Payroll clearing · PR-052', '$3,250.00', 'Matched'],
            ['Office expense · V-144', '$624.19', active === 2 ? 'Review' : 'Matched'],
            ['Service fee · BANK-018', '$42.00', 'Matched'],
          ].map(([label, amount, status], index) => (
            <motion.div className="accounting-table-row" key={label} initial={reduceMotion ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduceMotion ? 0 : .3, delay: .25 + index * .08 }}>
              <span><i className={`accounting-dot accounting-dot-${index + 1}`} />{label}</span><b>{amount}</b><small className={status === 'Review' ? 'needs-review' : ''}>{status === 'Matched' && <Check size={11} />}{status}</small>
            </motion.div>
          ))}
        </div>
        <div className="accounting-close-progress"><span><CheckCircle2 size={13} /> Close progress</span><strong>{active === 1 ? '8 / 9' : '12 / 13'} accounts</strong><i><b style={{ width: `${active === 1 ? 88 : 92}%` }} /></i></div>
      </motion.div>

      <motion.div className="accounting-float-card accounting-feed-card" animate={reduceMotion ? undefined : { y: [0, -5, 0] }} transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}>
        <span className="account-feed-icon"><Banknote size={16} /></span><div><small>BANK FEED</small><strong>Synced just now</strong></div><i />
      </motion.div>
      <motion.div className="accounting-float-card accounting-balance-card" animate={reduceMotion ? undefined : { y: [0, 5, 0] }} transition={{ duration: 4.9, repeat: Infinity, ease: 'easeInOut', delay: .4 }}>
        <span className="account-balance-icon"><TrendingUp size={15} /></span><div><small>UNMATCHED VARIANCE</small><strong>$0.00</strong></div><CheckCircle2 size={16} />
      </motion.div>
      <span className="accounting-flow accounting-flow-one" /><span className="accounting-flow accounting-flow-two" />
    </SceneShell>
  );
}

function PayablesReceivablesScene({ role }: { role: HireRole }) {
  const stages = ['Invoice capture', 'Approval control', 'Cash application', 'Aging follow-up'];
  const { active, setActive, reduceMotion } = useWorkflowCycle(stages.length);
  const paid = [76, 82, 89, 94][active];

  return (
    <SceneShell role={role} scene="operations">
      <motion.div
        className="operations-board"
        initial={reduceMotion ? false : { opacity: 0, y: 22, rotateY: 4, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, rotateY: 1, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.8, ease: EASE }}
        whileHover={reduceMotion ? undefined : { rotateY: 0, y: -3, transition: { duration: 0.35 } }}
      >
        <SceneTopbar icon={ArrowLeftRight} label="CASH OPERATIONS" status="Queue live" />
        <div className="operations-heading"><div><small>FINANCE OPERATIONS · TODAY</small><h3>Payables &amp; receivables</h3></div><span className="operations-period">MAY 2025</span></div>
        <div className="operations-flow">
          <div className="operations-lane operations-ap">
            <div className="operations-lane-heading"><span><ArrowUpRight size={14} /></span><div><small>OUTGOING · AP</small><strong>Vendor payments</strong></div><b>18</b></div>
            <div className="operations-invoice"><ReceiptText size={15} /><span><strong>Northstar Supply</strong><small>INV-1048 · Due today</small></span><b>$2,840</b></div>
            <div className="operations-invoice"><ReceiptText size={15} /><span><strong>Meridian Office</strong><small>INV-1032 · Approved</small></span><b>$1,260</b></div>
            <div className="operations-lane-bottom"><span>Scheduled</span><strong>$24.8k</strong><i><b style={{ width: `${paid}%` }} /></i></div>
          </div>
          <div className="operations-transfer" aria-hidden="true"><ArrowDownLeft size={14} /><span /></div>
          <div className="operations-lane operations-ar">
            <div className="operations-lane-heading"><span><ArrowDownLeft size={14} /></span><div><small>INCOMING · AR</small><strong>Customer receipts</strong></div><b>26</b></div>
            <div className="operations-invoice"><WalletCards size={15} /><span><strong>Atlas Creative</strong><small>INV-2084 · Received</small></span><b>$4,200</b></div>
            <div className="operations-invoice"><WalletCards size={15} /><span><strong>Harbor Group</strong><small>INV-2071 · Follow-up</small></span><b>$1,840</b></div>
            <div className="operations-lane-bottom"><span>Collected</span><strong>{paid}%</strong><i><b style={{ width: `${paid}%` }} /></i></div>
          </div>
        </div>
        <div className="operations-bottom">
          <div><small>NET CASH POSITION</small><strong>$18,640 <i>+12.4%</i></strong></div>
          <div className="operations-wave" aria-label="Cash activity sparkline"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
        </div>
        <div className="operations-stage">
          <span><CheckCircle2 size={13} /> {stages[active]}</span>
          <SceneTabs items={['1', '2', '3', '4']} active={active} onSelect={setActive} />
        </div>
      </motion.div>

      <motion.div className="operations-alert" animate={reduceMotion ? undefined : { y: [0, -5, 0] }} transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}>
        <span><Clock3 size={15} /></span><div><small>AGING ALERT</small><strong>2 invoices need follow-up</strong></div><ArrowUpRight size={14} />
      </motion.div>
      <motion.div className="operations-total-chip" animate={reduceMotion ? undefined : { y: [0, 5, 0] }} transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: .5 }}>
        <CircleDollarSign size={16} /><span>PAYMENT CONTROLS</span><CheckCircle2 size={15} />
      </motion.div>
      <div className="operations-backdrop-mark"><ArrowLeftRight size={68} /></div>
    </SceneShell>
  );
}

export function HireRoleExperience({ role }: { role: HireRole }) {
  switch (role.slug) {
    case 'tax-preparer':
      return <TaxPreparationScene role={role} />;
    case 'tax-reviewer':
      return <TaxReviewScene role={role} />;
    case 'accountant-bookkeeping':
      return <AccountingScene role={role} />;
    case 'ap-ar':
      return <PayablesReceivablesScene role={role} />;
    default:
      return <div className="hire-scene-fallback"><Sparkles size={24} /><span>{role.shortTitle}</span></div>;
  }
}
