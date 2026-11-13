import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  BookOpen,
  CreditCard,
  Calculator,
  Receipt,
  Globe2,
  Send,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import './ReferenceAnimations.css';

export interface ServiceNode {
  code: string;
  short: string;
  name: string;
  tag: string;
  intro: string;
  items: string[];
  chips: string[];
  icon: React.ElementType;
}

export const SEVEN_SERVICES: ServiceNode[] = [
  {
    code: 'TAX',
    short: 'Tax Prep',
    name: 'USA Tax Preparation',
    tag: '01 · USA TAX PREPARATION',
    intro: 'Every income source, deduction, credit and schedule is considered before a return is ready for review, for individuals, businesses, nonprofits, estates and trusts.',
    items: ['Individual returns: Form 1040, 1040-SR, 1040-NR', 'Partnerships: Form 1065 & Schedule K-1s', 'S Corporations: Form 1120-S', 'C Corporations: Form 1120', 'Prior-year catch-ups & amended returns'],
    chips: ['1040', '1065', '1120-S', '1120', '990', '1041'],
    icon: FileSpreadsheet,
  },
  {
    code: 'BKP',
    short: 'Bookkeeping',
    name: 'Bookkeeping & Accounting',
    tag: '02 · BOOKKEEPING & ACCOUNTING',
    intro: 'Every transaction recorded, classified and reconciled, so your books show where the business really stands every month, not only at tax time.',
    items: ['Full-cycle daily, weekly or monthly bookkeeping', 'Bank, credit card, PayPal and Stripe reconciliation', 'General Ledger & Chart of Accounts setup', 'P&L, Balance Sheet and Cash Flow generation', 'Month-end and year-end close packages'],
    chips: ['QBO', 'QuickBooks Desktop', 'Xero', 'NetSuite'],
    icon: BookOpen,
  },
  {
    code: 'PAY',
    short: 'Payroll',
    name: 'Payroll Management',
    tag: '03 · PAYROLL MANAGEMENT',
    intro: 'Wages calculated, withholding applied, employer taxes accounted for and every pay run reconciled, through to year-end W-2s.',
    items: ['Hourly & salaried gross-to-net calculations', 'Federal, state and local multi-state withholding', 'Social Security, Medicare, FUTA & SUTA filing', '401(k), HSA and benefit pre-tax deductions', 'Contractor compliance & Form 1099-NEC'],
    chips: ['941', '940', 'W-2', '1099-NEC', 'SUTA'],
    icon: CreditCard,
  },
  {
    code: 'PLN',
    short: 'Planning',
    name: 'Tax Planning & Advisory',
    tag: '04 · TAX PLANNING & ADVISORY',
    intro: 'Tax preparation looks at what already happened. Tax planning looks ahead, with projections and estimates while there is still time to act.',
    items: ['Annual income and tax liability projections', 'Quarterly estimated tax calculations (1040-ES)', 'Entity structure & S-Corp compensation evaluation', 'Section 179 & bonus depreciation acceleration', 'Year-end tax optimization roadmap'],
    chips: ['Projections', 'Estimates', 'Safe Harbor', 'Entity Review'],
    icon: Calculator,
  },
  {
    code: 'AP/AR',
    short: 'AP & AR',
    name: 'Accounts Payable & Receivable',
    tag: '05 · ACCOUNTS PAYABLE & RECEIVABLE',
    intro: 'A clear picture of what your business owes and what it needs to collect: invoices verified, balances tracked and aging reported.',
    items: ['Vendor onboarding and W-9 verification', '2-way and 3-way invoice matching', 'Payment run approval workflows', 'Customer invoicing and unapplied cash clearing', 'Granular 30/60/90-day aging reports'],
    chips: ['AP Aging', 'AR Aging', 'Bill.com', 'Vendor Recs'],
    icon: Receipt,
  },
  {
    code: 'INTL',
    short: 'Foreign',
    name: 'Foreign Tax Compliance',
    tag: '06 · FOREIGN TAX COMPLIANCE',
    intro: 'Foreign accounts, overseas companies and cross-border payments carry their own US reporting rules. We organize the information and prepare the forms for technical review.',
    items: ['FBAR: FinCEN Form 114 reporting', 'FATCA: Form 8938 specified foreign assets', 'Foreign corporations: Form 5471', 'Foreign-owned US entities: Form 5472', 'Foreign Tax Credit (Form 1116) optimization'],
    chips: ['FinCEN 114', '8938', '5471', '5472', '3520'],
    icon: Globe2,
  },
  {
    code: 'FILE',
    short: 'Filing',
    name: 'US Tax Filing & E-File',
    tag: '07 · US TAX FILING',
    intro: 'Preparing a return and submitting it are separate stages. We coordinate authorization, e-filing, acknowledgments and any rejection fixes.',
    items: ['Direct electronic transmission to IRS & State', 'Form 8879 e-signature collection', 'IRS MeF acknowledgment tracking', 'Immediate reject code resolution', 'Form 4868 / 7004 extension filings'],
    chips: ['4868', '7004', '8879', '1040-X', 'MeF'],
    icon: Send,
  },
];

interface OrbitalServiceWheelProps {
  onSelectService?: (serviceCode: string) => void;
  className?: string;
}

export function OrbitalServiceWheel({ onSelectService, className = '' }: OrbitalServiceWheelProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SEVEN_SERVICES.length);
    }, 3400);
    return () => clearInterval(timer);
  }, [isPaused]);

  const active = SEVEN_SERVICES[activeIdx];
  const ActiveIcon = active.icon;

  const handleNodeClick = (index: number) => {
    setActiveIdx(index);
    if (onSelectService) {
      onSelectService(SEVEN_SERVICES[index].code);
    }
  };

  return (
    <div 
      className={`ref-anim-card ${className}`}
      
      
      aria-label="Interactive 7-Service Accounting & Tax Orbital Wheel"
    >
      <div className="ref-anim-header">
        <div className="flex items-center gap-2">
          <span className="ref-anim-dot" />
          <span className="text-xs font-bold text-[#12242B] dark:text-[#F4FBFC] uppercase tracking-wider font-sans">
            Transaction Journey · 7 Interconnected Practices
          </span>
        </div>
        <div className="ref-anim-badge">
          <span>{active.short} Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Circular Orbital Wheel */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="ref-orbit-container">
            <div className="ref-orbit-track" />
            
            {/* Center Core */}
            <div className="ref-orbit-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#49E3D6]">One Hub</span>
              <span className="text-xs font-bold font-sans tracking-tight leading-tight mt-0.5">7 Unified Services</span>
              <span className="text-[8.5px] text-gray-300 font-sans mt-1">SOC-2 &bull; Circular 230</span>
            </div>

            {/* 7 Orbiting Nodes */}
            {SEVEN_SERVICES.map((node, i) => {
              const ang = (i / 7) * Math.PI * 2 - Math.PI / 2;
              const left = 50 + 41 * Math.cos(ang);
              const top = 50 + 41 * Math.sin(ang);
              const isActive = activeIdx === i;

              return (
                <button
                  key={node.code}
                  onClick={() => handleNodeClick(i)}
                  className={`ref-orbit-node ${isActive ? 'is-active' : ''}`}
                  style={{ left: `${left}%`, top: `${top}%` }}
                  title={`${node.name} (${node.code})`}
                  type="button"
                >
                  <span>{node.code}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Service Detail Panel */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-[#49E3D6]/15 flex items-center justify-center text-emerald-600 dark:text-[#49E3D6]">
                <ActiveIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold font-sans uppercase text-emerald-600 dark:text-[#49E3D6] tracking-wider">
                  {active.tag}
                </span>
                <h4 className="text-lg font-bold text-[#12242B] dark:text-[#F4FBFC] font-sans tracking-tight">
                  {active.name}
                </h4>
              </div>
            </div>

            <p className="text-xs text-[#476067] dark:text-[#A8C0C6] leading-relaxed mb-4">
              {active.intro}
            </p>

            <div className="grid gap-1.5 mb-4">
              {active.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#12242B] dark:text-[#E2EBE8]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-[#49E3D6] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2EBE8] dark:border-[rgba(121,241,232,0.15)] flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase text-gray-400">Key Tags:</span>
              {active.chips.map((c) => (
                <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 font-sans text-[#315F69] dark:text-[#7DF5E8] font-bold">
                  {c}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-[#49E3D6] font-sans">
              <span>Step 0{activeIdx + 1} of 07</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

