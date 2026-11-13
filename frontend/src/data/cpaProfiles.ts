export interface ProfessionalProfile {
  id: string;
  name: string;
  role: string;
  experienceYears: number;
  credentials: string[];
  software: string[];
  specialty: string;
  bio: string;
  availability: 'Immediate' | '2 Weeks Notice' | 'Full-Time Only';
  rating: number;
  reviewsCount: number;
  avatar: string;
  keySkills: string[];
}

export const CPA_PROFILES: ProfessionalProfile[] = [
  {
    id: 'cpa-1',
    name: 'Ananya Sharma, CPA (Eligible) & EA',
    role: 'Senior US Corporate Tax Preparer',
    experienceYears: 8,
    credentials: ['IRS Enrolled Agent (EA)', 'Master of Accountancy', 'AICPA Affiliate'],
    software: ['UltraTax CS', 'ProConnect Tax', 'CCH Axcess', 'QuickBooks Online'],
    specialty: 'Form 1120, 1120-S, 1065 & Multi-state Apportionment',
    bio: 'Specialized in high-volume multi-state corporate and partnership returns. Experienced in reviewing complex K-1 schedules, Section 179 depreciation rollforwards, and clearing difficult diagnostic errors.',
    availability: 'Immediate',
    rating: 4.95,
    reviewsCount: 38,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80',
    keySkills: ['Form 1120-S Preparation', 'Multi-State Tax Allocation', 'Basis Calculations (Form 7203)', 'Diagnostic Review']
  },
  {
    id: 'cpa-2',
    name: 'Rohit Mehta, ACCA & CA',
    role: 'Senior Financial Controller & CAS Lead',
    experienceYears: 10,
    credentials: ['ACCA Qualified', 'Chartered Accountant', 'Xero Platinum Certified'],
    software: ['QuickBooks Enterprise', 'Xero', 'NetSuite', 'Bill.com'],
    specialty: 'Full-Cycle Month-End Close, Accruals & ASC 842',
    bio: 'Leads dedicated client accounting services (CAS) engagements for US practices. Expert in managing complex inventory reconciliations, intercompany entries, and preparing board-ready monthly financials.',
    availability: 'Immediate',
    rating: 4.98,
    reviewsCount: 52,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    keySkills: ['Month-End GAAP Close', 'ASC 842 Lease Reconciliations', 'Cash Flow Forecasting', 'Bill.com AP/AR Automation']
  },
  {
    id: 'cpa-3',
    name: 'Priyanka Patel',
    role: 'Audit Support & Assurance Specialist',
    experienceYears: 6,
    credentials: ['Certified Internal Auditor (CIA)', 'B.Com Honors in Finance'],
    software: ['AdvanceFlow', 'Caseware', 'Excel PowerQuery', 'CCH ProSystem fx Engagement'],
    specialty: 'Trial Balance Tie-Outs, Sampling & PBC Tracking',
    bio: 'Supports onshore audit partners by drafting lead schedules, executing substantive test workpapers, verifying bank and accounts receivable confirmations, and maintaining rigorous audit trail documentation.',
    availability: '2 Weeks Notice',
    rating: 4.92,
    reviewsCount: 29,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&auto=format&fit=crop&q=80',
    keySkills: ['Substantive Testing', 'Audit Lead Sheets', 'PBC List Coordination', 'Internal Control Walkthroughs']
  },
  {
    id: 'cpa-4',
    name: 'Vikram Joshi',
    role: 'Payroll & Multi-State Compliance Specialist',
    experienceYears: 7,
    credentials: ['Certified Payroll Professional (CPP)', 'Tax Law Diploma'],
    software: ['ADP Workforce Now', 'Gusto', 'Paychex Flex', 'QuickBooks Payroll'],
    specialty: 'Multi-State Withholding, Form 941/940 & Year-End 1099/W-2',
    bio: 'Dedicated payroll operations lead overseeing multi-state payroll runs, local tax jurisdiction registrations, garnishment orders, and quarterly federal/state payroll tax reconciliations.',
    availability: 'Immediate',
    rating: 4.96,
    reviewsCount: 44,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
    keySkills: ['Form 941 Reconciliations', 'Multi-State Tax Filings', '1099-NEC & W-2 Distribution', 'Direct Deposit Exception Auditing']
  }
];

export const HIRING_ENGAGEMENT_MODELS = [
  {
    title: 'Dedicated Full-Time (160 hrs/mo)',
    idealFor: 'Firms needing year-round capacity and seamless team integration.',
    pricing: 'Starting at $22 - $28 / hr',
    benefits: [
      '100% dedicated to your practice only',
      'Works in your US time zone (EST / CST / PST)',
      'Direct Slack/Teams and email integration',
      'Assigned backup associate during leaves',
      'Zero recruitment fees or payroll tax liabilities'
    ],
    recommended: true
  },
  {
    title: 'Seasonal Busy-Season Surge',
    idealFor: 'Firms facing January - April & September - October volume spikes.',
    pricing: 'Starting at $26 - $32 / hr',
    benefits: [
      'Flexible 3 to 5 month contract durations',
      'Pre-trained on US tax software (UltraTax, ProConnect, Drake)',
      'Rapid ramp-up with standard workpaper kits',
      'Scalable from 1 to 10+ tax preparers',
      'Overtime availability during peak filing weeks'
    ],
    recommended: false
  },
  {
    title: 'Project-Based Block Hours (40 - 80 hrs)',
    idealFor: 'Messy year-end cleanups, audit sprint support, or specialized consulting.',
    pricing: 'Starting at $30 - $35 / hr',
    benefits: [
      'Dedicated delivery sprint with milestone reviews',
      'Ideal for unblocking overdue accounting projects',
      'Fixed scope deliverables and SLA commitments',
      'Senior oversight on all completed workpapers',
      'Pay only for hours consumed'
    ],
    recommended: false
  }
];
