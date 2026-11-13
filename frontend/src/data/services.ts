export type ClientCategory = 'individual' | 'business' | 'cpa';

export type DemoType =
  | 'tax-workflow'
  | 'accounting-pipeline'
  | 'bookkeeping-ledger'
  | 'payroll-timeline'
  | 'cpa-collaboration'
  | 'financial-reporting'
  | 'audit-sampling'
  | 'cleanup-reconcile'
  | 'tax-planning'
  | 'staff-augmentation';

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceWorkflowStep {
  step: string;
  title: string;
  description: string;
  deliverable: string;
}

export interface ServiceBenefit {
  title: string;
  description: string;
  stat?: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  category: ClientCategory;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  deliverables: string[];
  idealFor: string;
  turnaroundTime: string;
  popular?: boolean;
  demoType: DemoType;
  heroTagline: string;
  features: { title: string; desc: string }[];
  workflow: ServiceWorkflowStep[];
  executionStages?: ServiceWorkflowStep[];
  benefits: ServiceBenefit[];
  faqs: ServiceFaq[];
  relatedSlugs: string[];
  heroAnimationConfig?: {
    eyebrow?: string;
    stages?: string[];
    source?: string;
    focus?: string;
    result?: string;
    metric?: string;
    stat1Label?: string;
    stat1Value?: string;
    stat1Sub?: string;
    stat2Label?: string;
    stat2Value?: string;
    stat2Sub?: string;
    stat3Label?: string;
    stat3Value?: string;
    stat3Sub?: string;
  };
}

export const CLIENT_CATEGORIES: { id: ClientCategory; label: string; description: string }[] = [
  {
    id: 'individual',
    label: 'Individual / Family',
    description: 'Personal 1040 returns, multi-state filings, family wealth planning & IRS notice support.'
  },
  {
    id: 'business',
    label: 'Company / Business',
    description: 'Corporate 1120/1120-S, LLC 1065, comprehensive bookkeeping, payroll & financial reporting.'
  },
  {
    id: 'cpa',
    label: 'CPA Firm',
    description: 'Dedicated offshore accounting & tax preparation capacity for accounting practices.'
  }
];

export const SERVICES_CATALOG: ServiceItem[] = [
  // =========================================================================
  // 1. INDIVIDUAL / FAMILY SERVICES
  // =========================================================================
  {
    id: 'ind-tax-prep',
    slug: 'individual-tax-prep',
    name: 'Individual Tax Preparation',
    category: 'individual',
    shortDescription: 'Comprehensive Federal & State Form 1040 filing, maximizing standard & itemized deductions.',
    fullDescription: 'Our seasoned tax specialists review your W-2s, 1099s, investment dividends, capital gains, and real estate income to ensure 100% compliance while claiming every eligible credit.',
    iconName: 'FileSpreadsheet',
    deliverables: ['Form 1040 Federal & State', 'Schedule A, B, C, D & E Filings', 'E-file Confirmation', 'Prior Year Comparison'],
    idealFor: 'W-2 employees, high-net-worth individuals, freelance professionals, and retirees.',
    turnaroundTime: '2-4 Business Days',
    popular: true,
    demoType: 'tax-workflow',
    heroTagline: 'Precision Form 1040 Preparation with Multi-State Optimization and Double-Check Auditing.',
    features: [
      { title: 'Multi-State Nexus Review', desc: 'Seamlessly allocate income and withholding across state jurisdictions for remote and relocated workers.' },
      { title: 'Capital Gains & Crypto Audit', desc: 'Accurate reconciliation of 1099-B brokerage summaries, staking rewards, and real estate 1031 exchanges.' },
      { title: 'Itemized vs Standard Evaluation', desc: 'Algorithmic comparison between Schedule A itemized deductions and high standard deductions for optimal net liability.' },
      { title: 'Direct E-File with IRS Tracking', desc: 'Instant submission to the IRS modernized e-File system with digital confirmation receipts.' }
    ],
    workflow: [
      { step: '01', title: 'Secure Document Intake', description: 'Upload W-2s, 1099s, and prior-year returns to our encrypted 256-bit client vault.', deliverable: 'Verified PBC Checklist' },
      { step: '02', title: 'Deduction & Credit Analysis', description: 'Senior tax specialists analyze eligible adjustments, childcare credits, and retirement contributions.', deliverable: 'Tax Optimization Memo' },
      { step: '03', title: 'Senior EA Diagnostic Audit', description: 'A licensed Enrolled Agent performs diagnostic review clearing all potential IRS e-file reject codes.', deliverable: 'Zero-Error Workpapers' },
      { step: '04', title: 'Client Review & E-Filing', description: 'You review the draft return via digital signature portal, and we transmit directly to Federal & State authorities.', deliverable: 'Official E-File Acceptance' }
    ],
    executionStages: [
      { step: '01', title: 'Client Onboarding', description: 'Confirm the filing profile, household details, filing states, and engagement scope before preparation begins.', deliverable: 'Client profile and filing checklist' },
      { step: '02', title: 'Document Collection', description: 'Gather income statements, prior-year returns, deduction records, and supporting documents for the return.', deliverable: 'Document inventory' },
      { step: '03', title: 'Data Processing', description: 'Organize income and supporting records, reconcile source documents, and identify any missing information.', deliverable: 'Organized tax records' },
      { step: '04', title: 'Tax Calculation', description: 'Apply eligible deductions and credits, then prepare the federal and applicable state return calculations.', deliverable: 'Draft return calculations' },
      { step: '05', title: 'Expert Review', description: 'A tax professional checks return consistency, supporting workpapers, and applicable filing requirements.', deliverable: 'Reviewed return and notes' },
      { step: '06', title: 'Final Delivery', description: 'Share the return for client review and approval before any authorized electronic filing.', deliverable: 'Return package ready for review' }
    ],
    benefits: [
      { title: 'Zero Audit Flag Guarantee', description: 'Every return is mathematically cross-referenced against IRS statistical discriminants.', stat: '99.8%' },
      { title: 'Maximized Eligible Refunds', description: 'Systematic deduction capture often yields hundreds to thousands in overlooked savings.', stat: '+$1,450' },
      { title: 'Rapid Turnaround SLA', description: 'Get your completed draft within 48 to 72 business hours after document receipt.', stat: '48h SLA' },
      { title: 'Year-Round Support', description: 'We answer IRS notices and mid-year tax withholding questions at zero extra cost.', stat: '365 Days' }
    ],
    faqs: [
      { question: 'What documents do I need to provide for my Form 1040 return?', answer: 'We require all W-2s, 1099s (INT, DIV, MISC, NEC, B), Form 1098 mortgage statements, property tax receipts, childcare expense statements, and your previous year tax return.' },
      { question: 'How do you handle income earned in multiple states?', answer: 'We prepare resident, non-resident, and part-year returns, ensuring proper credit for taxes paid to other jurisdictions to eliminate double taxation.' },
      { question: 'What happens if the IRS issues a CP2000 notice?', answer: 'Our Enrolled Agents pull your master wage transcript, draft a formal written rebuttal, and represent you until the matter is officially cleared.' }
    ],
    relatedSlugs: ['family-tax-planning', 'personal-tax-consultation', 'irs-assistance']
  },
  {
    id: 'ind-family-planning',
    slug: 'family-tax-planning',
    name: 'Family Tax Planning',
    category: 'individual',
    shortDescription: 'For people who want to understand their US tax obligations, organise income information and review relevant deductions, credits and planning opportunities.',
    fullDescription: 'Changes in employment, investments, property, retirement contributions and family circumstances all shape your tax position. We review them during the year, so you can make decisions while the opportunity is still open.',
    iconName: 'Users',
    deliverables: ['529 Savings Plan Analysis', 'Gift & Estate Tax Structuring', 'Education Credit Optimization', 'Annual Wealth Review'],
    idealFor: 'Individuals & families',
    turnaroundTime: '3-5 Business Days',
    demoType: 'tax-planning',
    heroTagline: 'Don’t wait until tax season to think about your taxes.',
    features: [
      { title: 'Income & tax liability projections', desc: 'Reviewing available income, expenses, deductions, credits and payments to estimate your potential federal and, where applicable, state tax position.' },
      { title: 'Deduction & credit review', desc: 'Identifying potentially applicable deductions and credits, and checking the requirements, limitations and supporting documentation each one needs.' },
      { title: 'Retirement contribution planning', desc: 'Reviewing eligible retirement plan options and contribution opportunities, taking account of your circumstances and the applicable limits.' },
      { title: 'Capital gains & investment planning', desc: 'Reviewing potential gains, losses, investment disposals and the relevant tax rules before a transaction is completed.' }
    ],
    workflow: [
      { step: '01', title: 'Family Wealth Discovery', description: 'Review assets, dependent structures, and educational savings goals.', deliverable: 'Family Asset Map' },
      { step: '02', title: 'Multi-Year Tax Projection', description: 'Simulate progressive income tax brackets across a 3-to-5 year family horizon.', deliverable: 'Bracket Smoothing Model' },
      { step: '03', title: 'Gift & 529 Strategy Draft', description: 'Design optimal timing for college contributions and generational asset transfers.', deliverable: 'Actionable Allocation Plan' },
      { step: '04', title: 'Annual Review & Adjustment', description: 'Recalibrate strategies annually as children reach milestone ages or tax codes change.', deliverable: 'Annual Strategy Memo' }
    ],
    benefits: [
      { title: 'Understand what you may owe before the deadline', description: 'A projection estimates your potential liability from the information available, so you can consider estimated payments or withholding adjustments in time.' },
      { title: 'Find deductions and credits you may be eligible for', description: 'Many have eligibility conditions, income limits, documentation rules or deadlines. Reviewing them during the year helps keep eligible opportunities from being missed.' },
      { title: 'Avoid unnecessary surprises at tax time', description: 'Changes in income, investment gains, self-employment earnings and profitability all move the amount due. Regular reviews surface issues earlier.' }
    ],
    faqs: [
      { question: 'What is the difference between tax planning and tax preparation?', answer: 'Tax preparation organises financial information and prepares the required return for a completed tax year. Tax planning looks ahead, evaluating how decisions about income, expenses, investments and business activity may affect future tax obligations.' },
      { question: 'When should tax planning happen?', answer: 'Planning is most useful throughout the year, not just before the deadline. Depending on the engagement, we review available information, prepare projections and identify potential actions before the relevant tax-year deadlines. Ongoing engagements follow an agreed monthly, quarterly or annual cycle.' },
      { question: 'Can you guarantee a tax refund or a particular amount of tax savings?', answer: 'No. No responsible tax professional should guarantee a refund or saving without reviewing your full circumstances — and even then, the outcome depends on applicable law and verified information. Our focus is accurate work and legitimate opportunities supported by the facts and tax rules.' },
      { question: 'Does claiming more deductions always reduce my tax?', answer: 'Not by the full amount. A deduction’s effect depends on your circumstances, applicable rates, limitations and other rules, and spending money purely to obtain a deduction doesn’t necessarily improve your financial results. We look at the overall outcome.' },
      { question: 'Does tax planning cover state taxes?', answer: 'We can consider federal and applicable state tax within the agreed scope. State obligations depend on factors such as residency, business activities, income sources and state-specific rules.' },
      { question: 'What documents are needed to start?', answer: 'It depends on the scope. Individuals typically share prior-year returns, recent pay statements, 1099s, investment statements and details of expected changes. Businesses typically share year-to-date financial statements, payroll information, planned purchases and previous returns.' },
      { question: 'What does a tax projection show?', answer: 'A projection estimates your potential tax liability using the financial information available at that time. It can identify a possible balance due and help you consider estimated payments or withholding adjustments.' },
      { question: 'Can planning help with estimated tax payments?', answer: 'Yes. We consider whether your current withholding or estimated payments look sufficient in light of expected income and the applicable payment rules, and flag where an adjustment may be worth discussing.' }
    ],
    relatedSlugs: ['individual-tax-prep', 'personal-tax-consultation']
  },
  {
    id: 'ind-consultation',
    slug: 'personal-tax-consultation',
    name: 'Personal Tax Consultation',
    category: 'individual',
    shortDescription: 'One-on-one advisory for major financial milestones, crypto trading, and property transactions.',
    fullDescription: 'Direct strategic sessions with a senior tax advisor before you sell real estate, exercise stock options (ISO/NSO), or relocate across state lines to avoid unexpected tax surprises.',
    iconName: 'Briefcase',
    deliverables: ['Estimated Tax Impact Summary', 'Cross-State Relocation Roadmap', 'Crypto & Stock Option Audit', 'Quarterly Estimates (1040-ES)'],
    idealFor: 'Tech employees with equity, property investors, and cross-state movers.',
    turnaroundTime: '1-2 Business Days',
    demoType: 'tax-planning',
    heroTagline: 'Strategic One-on-One Advisory Before High-Stakes Financial Transactions.',
    features: [
      { title: 'Stock Option Advisory (ISO/NSO/RSU)', desc: 'Model Alternative Minimum Tax (AMT) triggers and choose optimal exercise windows.' },
      { title: 'Real Estate Sale Modeling', desc: 'Calculate Section 121 primary residence capital gains exclusions and depreciation recapture.' },
      { title: 'Quarterly Estimated Tax Filings', desc: 'Accurate safe-harbor calculations for Form 1040-ES to avoid underpayment interest penalties.' },
      { title: 'Cross-State Domicile Planning', desc: 'Defend residency transitions from high-tax states with clear physical presence and nexus documentation.' }
    ],
    workflow: [
      { step: '01', title: 'Pre-Session Intake', description: 'Submit transaction documents, equity grants, or real estate closing disclosures.', deliverable: 'Pre-Audit File' },
      { step: '02', title: 'Forensic Tax Modeling', description: 'We calculate exact tax liabilities under multiple scenario assumptions.', deliverable: 'Comparative Scenario Sheet' },
      { step: '03', title: 'Live CPA Consultation', description: '60-minute deep-dive video call with a senior tax partner explaining findings.', deliverable: 'Actionable Step-by-Step' },
      { step: '04', title: 'Written Executive Summary', description: 'Receive an audit-ready technical memorandum detailing the chosen course of action.', deliverable: 'Written Tax Memo' }
    ],
    benefits: [
      { title: 'Avoid Surprise Tax Bills', description: 'Know exact tax liability months before tax filing deadlines arrive.', stat: '$0 Surprises' },
      { title: 'AMT Mitigation', description: 'Prevent catastrophic unexpected Alternative Minimum Tax triggers upon option exercise.', stat: 'Saved $30K+' },
      { title: 'Direct Partner Access', description: 'Work directly with seasoned CPAs who know your personal financial landscape.', stat: '1-on-1' }
    ],
    faqs: [
      { question: 'When should I consult with a tax advisor about stock options?', answer: 'Ideally before exercising Incentive Stock Options (ISOs), as exercising can trigger Alternative Minimum Tax (AMT) even if you do not sell the shares.' },
      { question: 'How is primary residence capital gains excluded?', answer: 'Under Section 121, you can exclude up to $250,000 ($500,000 for married couples) of capital gains if you owned and lived in the home for 2 of the previous 5 years.' }
    ],
    relatedSlugs: ['individual-tax-prep', 'irs-assistance']
  },
  {
    id: 'ind-irs-assistance',
    slug: 'irs-assistance',
    name: 'IRS Assistance',
    category: 'individual',
    shortDescription: 'Prompt resolution for IRS CP2000 notices, penalty abatement, audit letters & payment plans.',
    fullDescription: 'Experienced Enrolled Agents and CPAs represent you directly before the IRS and state taxing authorities to resolve disputed balances, appeal penalties, and secure offer-in-compromise agreements.',
    iconName: 'ShieldAlert',
    deliverables: ['IRS Transcript Analysis', 'Formal Response Letter Draft', 'Penalty Abatement Petition', 'Installment Agreement Setup'],
    idealFor: 'Taxpayers with unfiled prior returns, audit notifications, or disputed penalties.',
    turnaroundTime: '24-48 Hours Response',
    demoType: 'tax-workflow',
    heroTagline: 'Direct Representation and Penalty Abatement Before Federal & State Authorities.',
    features: [
      { title: 'IRS Notice Analysis (CP2000 / CP504)', desc: 'Dissect IRS discrepancy notices against master transcripts to identify automated matching errors.' },
      { title: 'First-Time Penalty Abatement (FTA)', desc: 'Petition for full removal of failure-to-file and failure-to-pay penalties under IRS administrative relief.' },
      { title: 'Audit Representation (Form 2848)', desc: 'We represent you via official Power of Attorney so you never have to speak directly to an IRS agent.' },
      { title: 'Installment Agreements & OIC', desc: 'Negotiate affordable monthly payment plans or structured Offer-in-Compromise settlements.' }
    ],
    workflow: [
      { step: '01', title: 'Notice Intake & POA Authorization', description: 'Upload the IRS notice and sign Form 2848 Power of Attorney for official representation.', deliverable: 'Form 2848 Registered' },
      { step: '02', title: 'Master Transcript Retrieval', description: 'We pull your official IRS wage, return, and account transcripts from the IRS e-services portal.', deliverable: 'Transcript Tie-Out' },
      { step: '03', title: 'Rebuttal & Schedule Reconstruction', description: 'Reconstruct accurate cost basis schedules and draft formal legal response letters.', deliverable: 'Formal Written Petition' },
      { step: '04', title: 'Case Resolution & Clearance', description: 'Follow through until the IRS issues an official closure notice clearing penalties or disputed taxes.', deliverable: 'IRS Clearance Notice' }
    ],
    benefits: [
      { title: 'Stop Wage Garnishments', description: 'Immediate intervention halts impending bank levies and automated wage deductions.', stat: 'Halt Levies' },
      { title: 'Substantial Penalty Reductions', description: 'Frequently eliminate thousands of dollars in compounding interest and penalties.', stat: 'Saved $8.5K avg' },
      { title: 'Zero Personal Contact', description: 'We handle all phone calls and correspondence with IRS revenue officers.', stat: '100% Protected' }
    ],
    faqs: [
      { question: 'What should I do first when I receive an IRS CP2000 notice?', answer: 'Do not panic or immediately sign the agreement. CP2000 notices are proposed assessments based on automated third-party reporting that frequently overlook your actual purchase cost basis.' },
      { question: 'Can penalties be removed if I had a reasonable cause?', answer: 'Yes. The IRS grants penalty relief for reasonable cause (medical emergencies, natural disasters, unavoidable absence) and First-Time Penalty Abatement for clean filing histories.' }
    ],
    relatedSlugs: ['individual-tax-prep', 'personal-tax-consultation']
  },

  // =========================================================================
  // 2. COMPANY / BUSINESS SERVICES
  // =========================================================================
  {
    id: 'biz-tax-prep',
    slug: 'business-tax-preparation',
    name: 'Business Tax Preparation',
    category: 'business',
    shortDescription: 'Accurate Federal & State tax compliance for Form 1120 (C-Corp), 1120-S (S-Corp), and 1065 (LLC/Partnership).',
    fullDescription: 'Rigorous multi-tier tax return preparation accounting for depreciation schedules, Section 179 expenses, R&D credits, shareholder compensation, and state apportionment.',
    iconName: 'Building2',
    deliverables: ['Corporate Forms 1120, 1120-S, 1065', 'K-1 Distribution Schedules', 'State Franchise & Income Filings', 'Depreciation & Amortization Schedules'],
    idealFor: 'Small-to-midsize corporations, LLCs, startups, and multi-member partnerships.',
    turnaroundTime: '5-7 Business Days',
    popular: true,
    demoType: 'tax-planning',
    heroTagline: 'Audit-Proof Corporate Tax Preparation for Form 1120-S, 1065, and 1120 Filers.',
    features: [
      { title: 'Shareholder Basis Tracking (Form 7203)', desc: 'Accurate annual debt and stock basis tracking ensuring loss pass-through deductibility.' },
      { title: 'Multi-State Apportionment Schedules', desc: 'Calculate payroll, property, and sales factors across taxing jurisdictions to prevent double taxation.' },
      { title: 'Section 179 & Bonus Depreciation', desc: 'Accelerate asset deductions on qualifying machinery, hardware, and commercial vehicles.' },
      { title: 'K-1 Schedule Distribution', desc: 'Rapid generation and electronic distribution of partner/shareholder K-1 packages.' }
    ],
    workflow: [
      { step: '01', title: 'Trial Balance Tie-Out', description: 'Reconcile year-end balance sheets and income statements against general ledger accounts.', deliverable: 'Adjusted Trial Balance' },
      { step: '02', title: 'Book-to-Tax M-1 / M-3 Adjustments', description: 'Calculate permanent and temporary timing differences between GAAP and tax accounting.', deliverable: 'Schedule M-1 Workpaper' },
      { step: '03', title: 'Two-Tier Partner Review', description: 'Senior corporate CPA reviews all basis, credits, and apportionment percentages.', deliverable: 'Diagnostic Error Log' },
      { step: '04', title: 'E-Filing & K-1 Package Release', description: 'Transmit return to IRS and state departments; deliver client-ready electronic K-1s.', deliverable: 'E-File Confirmation' }
    ],
    benefits: [
      { title: 'Prevent Pass-Through Audits', description: '100% mathematical tie-out between corporate returns and shareholder 1040s.', stat: '99.9%' },
      { title: 'Tax Liability Compression', description: 'Capture Section 199A QBI deductions and eligible R&D operational credits.', stat: '-24% Effective' },
      { title: 'Multi-State Nexus Confidence', description: 'Avoid costly surprise franchise tax penalties across modern remote workforces.', stat: '50 States' }
    ],
    faqs: [
      { question: 'What is the filing deadline for Form 1120-S and Form 1065?', answer: 'Calendar-year S-Corporations and Partnerships must file by March 15th, or file Form 7004 for an automatic 6-month extension to September 15th.' },
      { question: 'Why is Form 7203 Shareholder Basis required?', answer: 'The IRS strictly mandates Form 7203 to verify whether shareholders have sufficient tax basis to claim pass-through business losses or tax-free distributions.' }
    ],
    relatedSlugs: ['accounting-services', 'bookkeeping', 'business-tax-planning']
  },
  {
    id: 'biz-accounting',
    slug: 'accounting-services',
    name: 'Accounting Services',
    category: 'business',
    shortDescription: 'GAAP-compliant financial statements, monthly close, balance sheet reconciliations & CFO oversight.',
    fullDescription: 'Transform your raw accounting data into clear executive insights. We prepare Monthly Income Statements, Balance Sheets, Cash Flow statements, and provide strategic financial reviews.',
    iconName: 'TrendingUp',
    deliverables: ['Monthly GAAP Financial Statements', 'Balance Sheet Reconciliations', 'Accrual vs Cash Analysis', 'Executive Financial Dashboard'],
    idealFor: 'Growing enterprises, venture-backed companies, and multi-location businesses.',
    turnaroundTime: 'Monthly Cycle Close (by 7th)',
    demoType: 'accounting-pipeline',
    heroTagline: 'Executive GAAP Accounting, Timely Month-End Closes, and Strategic CFO Dashboards.',
    features: [
      { title: 'Full-Cycle Month-End Close', desc: 'Standardized checklists ensuring bank, credit card, and clearing accounts close cleanly by the 7th of every month.' },
      { title: 'Revenue Recognition (ASC 606)', desc: 'Accurate deferral and recognition schedules for subscription, retainer, and milestone-based revenues.' },
      { title: 'Lease Accounting (ASC 842)', desc: 'Compute right-of-use asset amortizations and lease liability roll forwards.' },
      { title: 'Executive Variance Reporting', desc: 'Detailed actual-vs-budget monthly variance analysis identifying operational cost overruns.' }
    ],
    workflow: [
      { step: '01', title: 'Data Feed Verification', description: 'Audit all automated bank feeds, merchant processors, and billing engines for synchronization.', deliverable: 'Feed Integrity Report' },
      { step: '02', title: 'Accrual & Prepayment True-Up', description: 'Book adjusting journal entries for prepaid insurance, accrued liabilities, and depreciation.', deliverable: 'AJE Binder' },
      { step: '03', title: 'Balance Sheet Reconciliation', description: 'Tie every balance sheet line item to external documentation and support schedules.', deliverable: 'Reconciliation Workpapers' },
      { step: '04', title: 'Management Packet Delivery', description: 'Deliver board-ready comparative financial packages with executive commentary.', deliverable: 'Monthly Financial Package' }
    ],
    benefits: [
      { title: 'Close Books Faster', description: 'Reliably close accounting books by the 7th calendar day of every month.', stat: 'By the 7th' },
      { title: 'Bank & Lender Ready', description: 'GAAP-compliant balance sheets readily accepted by commercial loan underwriters.', stat: '100% GAAP' },
      { title: 'Real Visibility', description: 'Clear cash flow tracking prevents unexpected liquidity crunches.', stat: 'Real-time' }
    ],
    faqs: [
      { question: 'What is the difference between cash and accrual accounting?', answer: 'Cash accounting records income and expenses when money changes hands, while accrual accounting recognizes revenue when earned and expenses when incurred, providing an accurate picture of business profitability.' }
    ],
    relatedSlugs: ['business-tax-preparation', 'bookkeeping', 'financial-reporting']
  },
  {
    id: 'biz-bookkeeping',
    slug: 'bookkeeping',
    name: 'Bookkeeping',
    category: 'business',
    shortDescription: 'Daily transaction categorization, bank & credit card reconciliation, accounts payable & receivable.',
    fullDescription: 'Keep your financial books audit-ready 365 days a year. Fully synced with QuickBooks Online, Xero, and specialized ERPs, eliminating year-end catch-up headaches.',
    iconName: 'Receipt',
    deliverables: ['Weekly Bank Feed Matching', 'Accounts Payable & Receivable Tracking', 'Monthly Variance Reports', 'Receipt & Invoice Storage'],
    idealFor: 'Businesses looking for accurate, zero-stress, hands-off monthly bookkeeping.',
    turnaroundTime: 'Ongoing Continuous Sync',
    popular: true,
    demoType: 'bookkeeping-ledger',
    heroTagline: 'Daily Transaction Matching, Automated Reconciliations, and Audit-Ready General Ledgers.',
    features: [
      { title: 'Zero Uncategorized Transactions', desc: 'Weekly transaction reviews eliminate the dreaded year-end "Ask My Accountant" suspense account backlog.' },
      { title: 'Automated AP & Bill.com Management', desc: 'Process vendor bills, maintain W-9 compliance records, and streamline payment approvals.' },
      { title: 'Accounts Receivable Aging', desc: 'Issue automated customer invoicing statements and monitor 30/60/90-day delinquency reports.' },
      { title: 'Multi-Currency & Merchant Fees', desc: 'Properly account for Stripe, PayPal, and Shopify merchant fees and exchange gains/losses.' }
    ],
    workflow: [
      { step: '01', title: 'Daily Bank Feed Categorization', description: 'Match receipts and bank lines against proper chart of accounts categories.', deliverable: 'Matched Feeds' },
      { step: '02', title: 'Discrepancy Query Log', description: 'Send concise weekly query emails for ambiguous transactions.', deliverable: 'Zero Suspense Account' },
      { step: '03', title: 'Monthly Bank Reconciliation', description: 'Reconcile ending bank and credit card statements against ledger balances.', deliverable: 'Reconciliation Certificate' },
      { step: '04', title: 'Monthly Review Report', description: 'Deliver month-end summary showing cash position and major expenditure categories.', deliverable: 'P&L Snapshot' }
    ],
    benefits: [
      { title: 'Never Face Year-End Scrambles', description: 'Books are kept 100% clean and current every single week.', stat: 'Zero Backlog' },
      { title: 'Clean Deductions', description: 'Ensure every legitimate business meal, travel, and supply expense is categorized properly.', stat: 'Max Deductions' },
      { title: 'Hours Saved', description: 'Reclaim 15-20 hours of monthly administrative time spent wrestling with receipts.', stat: '20 hrs/mo' }
    ],
    faqs: [
      { question: 'What accounting software do you support?', answer: 'We are certified experts in QuickBooks Online, QuickBooks Desktop Enterprise, Xero, NetSuite, and Sage Intacct.' }
    ],
    relatedSlugs: ['accounting-services', 'payroll-management', 'business-tax-preparation']
  },
  {
    id: 'biz-payroll',
    slug: 'payroll-management',
    name: 'Payroll Management',
    category: 'business',
    shortDescription: 'On-time payroll runs, direct deposit, multi-state tax withholdings, W-2/1099 annual filings.',
    fullDescription: 'Flawless payroll processing adhering to Federal, State, and Local payroll tax regulations. Covers wage garnishments, contractor 1099 compliance, and workers compensation audits.',
    iconName: 'CreditCard',
    deliverables: ['Semi-Monthly/Bi-Weekly Runs', 'Quarterly Form 941/940 Filings', 'Year-End Form W-2 & 1099-NEC', 'State Unemployment Reporting'],
    idealFor: 'Companies with 2 to 250+ employees across single or multiple states.',
    turnaroundTime: 'Per Defined Pay Cycle',
    demoType: 'payroll-timeline',
    heroTagline: 'Multi-State Direct Deposit, Flawless Tax Withholding, and End-of-Year Compliance Filings.',
    features: [
      { title: 'Multi-State Withholding Compliance', desc: 'Register and accurately withhold income taxes across remote employees in all 50 states.' },
      { title: 'Automated Direct Deposit', desc: 'Seamlessly schedule bi-weekly, semi-monthly, or weekly employee and contractor disbursements.' },
      { title: 'Form 941, 940 & SUTA Reporting', desc: 'Timely filing of quarterly employer federal and state unemployment tax returns.' },
      { title: 'Year-End W-2 & 1099-NEC Generation', desc: 'Electronic generation, distribution, and IRS/SSA submission before January 31 deadlines.' }
    ],
    workflow: [
      { step: '01', title: 'Timesheet & Wage Audit', description: 'Verify hours, overtime calculations, commissions, and expense reimbursements.', deliverable: 'Payroll Audit Register' },
      { step: '02', title: 'Tax Withholding Calculation', description: 'Apply federal, state, and local tax schedules, pre-tax benefits, and garnishments.', deliverable: 'Tax Liability Summary' },
      { step: '03', title: 'Executive Approval & Funding', description: 'Management reviews preview register and authorizes direct deposit transmission.', deliverable: 'Approved ACH Release' },
      { step: '04', title: 'Quarterly & Annual Filings', description: 'Prepare and e-file Forms 941, 940, and annual W-2/1099 packets.', deliverable: 'Agency Acceptance Stamped' }
    ],
    benefits: [
      { title: '100% Penalty-Free Guarantee', description: 'Eliminate costly payroll tax late-deposit and underpayment penalties.', stat: 'Zero Penalties' },
      { title: 'Multi-Jurisdiction Freedom', description: 'Hire remote talent in any US state without payroll compliance fear.', stat: '50 States' },
      { title: 'Employee Portal Access', description: 'Staff get 24/7 self-service access to paystubs and annual W-2 tax forms.', stat: 'Self-Service' }
    ],
    faqs: [
      { question: 'How do you handle 1099 independent contractor reporting?', answer: 'We collect Form W-9 before payment release, track annual compensation thresholds ($600+), and electronically file Form 1099-NEC with both the IRS and state authorities by January 31.' }
    ],
    relatedSlugs: ['bookkeeping', 'accounting-services']
  },
  {
    id: 'biz-financial-reporting',
    slug: 'financial-reporting',
    name: 'Financial Reporting',
    category: 'business',
    shortDescription: 'Custom KPI dashboards, budget vs actual variance analysis, bank loan reporting & covenant tracking.',
    fullDescription: 'Actionable financial reporting designed for stakeholders, bank lenders, investors, and board presentations, giving leadership transparent visibility into profitability trends.',
    iconName: 'PieChart',
    deliverables: ['Management Discussion & Analysis (MD&A)', 'Budget vs Actual Variance Reports', 'Bank Covenant Compliance Packets', 'Unit Economics Breakdowns'],
    idealFor: 'Founders, CFOs, and business owners requiring granular operational metrics.',
    turnaroundTime: '3-5 Business Days',
    demoType: 'financial-reporting',
    heroTagline: 'Board-Ready Financial KPI Dashboards, Bank Covenant Tracking, and Unit Economics.',
    features: [
      { title: 'Executive KPI Dashboard', desc: 'Real-time visualizations of gross margin, EBITDA, customer acquisition payback, and burn rate.' },
      { title: 'Budget vs Actual Variance', desc: 'Granular departmental variance analysis identifying exactly where operating expenditures diverge from forecasts.' },
      { title: 'Debt Covenant Monitoring', desc: 'Track Debt Service Coverage Ratios (DSCR) and current liquidity ratios to maintain commercial lender compliance.' },
      { title: 'Segment & Product Profitability', desc: 'Determine true contribution margins across distinct service lines, locations, or product tiers.' }
    ],
    workflow: [
      { step: '01', title: 'KPI Framework Alignment', description: 'Define the critical metrics driving your business model with our senior analysts.', deliverable: 'KPI Metric Charter' },
      { step: '02', title: 'Data Aggregation & Modeling', description: 'Consolidate general ledger data with operational systems (CRM, ERP, Billing).', deliverable: 'Consolidated Data Model' },
      { step: '03', title: 'Executive Report Generation', description: 'Draft comprehensive presentation packets with graphical summaries and narrative MD&A.', deliverable: 'Executive Board Deck' },
      { step: '04', title: 'Leadership Strategy Review', description: 'Monthly or quarterly briefing session walking through operational insights and recommendations.', deliverable: 'Strategic Action Memo' }
    ],
    benefits: [
      { title: 'Investor & Board Ready', description: 'Professional reporting packets that build credibility with stakeholders.', stat: 'Institutional' },
      { title: 'Protect Bank Covenants', description: 'Proactive alerts prevent technical loan covenant defaults before they happen.', stat: 'Risk Mitigated' },
      { title: 'Actionable Decision Making', description: 'Stop operating on guesswork; make pricing and hiring decisions backed by hard unit economics.', stat: 'Data-Driven' }
    ],
    faqs: [
      { question: 'Can these reports be customized for our specific investors or lenders?', answer: 'Yes. We customize report templates to match the exact financial ratios, covenant calculation formulas, and formatting required by your bank or venture board.' }
    ],
    relatedSlugs: ['accounting-services', 'business-tax-planning']
  },
  {
    id: 'biz-tax-planning',
    slug: 'business-tax-planning',
    name: 'US Tax Planning for the year ahead',
    category: 'business',
    shortDescription: 'For companies that need organised books, a clear view of their tax position and help evaluating decisions as they grow.',
    fullDescription: 'Hiring, operating in another state, buying assets or changing tax classification create new responsibilities. Planning lets you consider them in advance.',
    iconName: 'Calculator',
    deliverables: ['Entity Classification Analysis (LLC vs S-Corp)', 'Quarterly Tax Projection Models', 'Qualified Business Income (QBI) Plan', 'Capital Expenditure Strategy'],
    idealFor: 'Small & growing businesses',
    turnaroundTime: '1-2 Weeks Strategic Plan',
    demoType: 'tax-planning',
    heroTagline: 'Preparation looks back. Planning looks ahead.',
    features: [
      { title: 'Business entity & compensation review', desc: 'Considering whether the current structure and compensation arrangements still fit. For example, an eligible business may evaluate whether an S corporation election makes financial sense after reasonable compensation, payroll costs and compliance are considered.' },
      { title: 'Depreciation & asset purchase planning', desc: 'Evaluating the tax treatment of qualifying business assets, including depreciation methods, Section 179 and bonus depreciation where applicable.' },
      { title: 'Estimated tax & withholding review', desc: 'Considering whether current federal withholding or estimated payments are sufficient given expected income and the applicable payment rules.' },
      { title: 'Year-end tax review', desc: 'Reviewing the year’s financial position, identifying unresolved items and preparing a list of relevant actions before the tax year closes.' }
    ],
    workflow: [
      { step: '01', title: 'Forensic Tax Return Audit', description: 'Examine 3 years of prior returns to identify missed carryforwards, elections, and credits.', deliverable: 'Diagnostic Gap Analysis' },
      { step: '02', title: 'Quarterly Scenario Simulation', description: 'Model forecasted revenues against potential restructuring options (LLC vs S-Corp vs C-Corp).', deliverable: 'Tax Optimization Model' },
      { step: '03', title: 'Executive Roadmap Presentation', description: 'Review actionable moves including retirement plan funding, equipment timing, and compensation splits.', deliverable: 'Strategic Blueprint' },
      { step: '04', title: 'Quarterly Execution Monitoring', description: 'Re-evaluate quarterly estimates in June, September, and December to ensure zero year-end surprises.', deliverable: 'Quarterly True-Up Memos' }
    ],
    benefits: [
      { title: 'Make better decisions about business expenses', description: 'Equipment, employee costs and retirement contributions carry different financial and tax consequences. Planning tests the timing and treatment before you commit.' },
      { title: 'Manage cash flow with fewer shocks', description: 'Tax payments are part of financial planning. Knowing what’s coming lets you prepare, instead of treating tax as an unexpected expense.' },
      { title: 'Prepare for business growth', description: 'Hiring, operating in another state, buying assets or changing tax classification create new responsibilities. Planning lets you consider them in advance.' }
    ],
    faqs: [
      { question: 'Why is tax planning important for a small business?', answer: 'It helps owners understand potential liabilities, review eligible deductions and credits, consider estimated payments and evaluate the tax implications of decisions — which can help prevent unexpected tax obligations.' },
      { question: 'Should my business consider an S corporation election?', answer: 'It depends. An eligible business may evaluate whether an S corporation election makes financial sense after considering reasonable compensation, payroll costs, compliance requirements and other factors. We review this as part of an entity and compensation review.' },
      { question: 'Can you plan around equipment and asset purchases?', answer: 'Yes. We evaluate the tax treatment of qualifying business assets — including depreciation methods, Section 179 and bonus depreciation where applicable — before the purchase is made.' }
    ],
    relatedSlugs: ['business-tax-preparation', 'accounting-services']
  },

  // =========================================================================
  // 3. CPA OUTSOURCING SERVICES (The 10 Offerings)
  // =========================================================================
  {
    id: 'cpa-tax-prep-outsource',
    slug: 'tax-prep-outsourcing',
    name: 'US Tax Preparation & Outsourcing Services',
    category: 'cpa',
    shortDescription: 'Extend your preparation capacity without expanding your in-house team.',
    fullDescription: 'Tax season brings more client work, tighter deadlines and pressure on internal resources. Hiring and training for every busy period isn’t always practical. We work as an extension of your workflow — following your instructions, preferred software and review procedures.',
    iconName: 'FileText',
    deliverables: ['Individual tax returns', 'Business tax returns', 'Form 1040 support', 'Partnerships — Form 1065', 'S corporations — Form 1120-S', 'C corporations — Form 1120', 'Supporting schedules & workpapers', 'Bookkeeping & data organisation', 'Data entry & documentation', 'Amended return support', 'Tax-season workload assistance'],
    idealFor: 'US CPA Firms',
    turnaroundTime: 'Agreed up front',
    popular: true,
    demoType: 'cpa-collaboration',
    heroTagline: 'Tax preparation and accounting support, built around the way you work.',
    features: [
      { title: 'US Tax Preparation Services for Individuals and Businesses', desc: 'Every taxpayer’s situation is different. We start from the records you provide, identify what the return requires, and organise it for review and completion — never one template for every entity.' },
      { title: 'US Tax Preparation Outsourcing for CPA Firms', desc: 'Tax season brings more client work, tighter deadlines and pressure on internal resources. Hiring and training for every busy period isn’t always practical. We work as an extension of your workflow — following your instructions, preferred software and review procedures.' },
      { title: 'Bookkeeping and Accounting Support', desc: 'Incomplete records, uncategorised transactions and inconsistent reconciliations slow every return down. Ongoing support keeps your books in shape all year — or gets them organised before preparation begins.' },
      { title: 'Additional Tax and Compliance Support', desc: 'Extensions, amendments, state-level and payroll reporting — scoped to your situation before any work begins.' }
    ],
    workflow: [
      { step: '01', title: 'Understand your requirements', description: 'We start by understanding whether you need individual tax preparation, business tax support, bookkeeping, or outsourcing assistance for your CPA firm.', deliverable: 'Service needs, business type, expected workload and preferred timeline' },
      { step: '02', title: 'Collect financial documents', description: 'We identify the information and supporting documents the engagement needs — income statements, expense records, prior-year returns, accounting reports and other relevant documentation.', deliverable: 'Income statements, expense records, prior-year returns, accounting reports and other relevant documentation' },
      { step: '03', title: 'Organise and prepare', description: 'Our accountants and tax specialists organise the information and prepare the return or accounting workpapers using the agreed software and workflow.', deliverable: 'The return or accounting workpapers' },
      { step: '04', title: 'Review and quality checks', description: 'Prepared work is checked against the available information and preparation requirements. Missing information or points needing clarification are flagged for resolution.', deliverable: 'Missing information or points needing clarification' },
      { step: '05', title: 'Finalisation and handover', description: 'Completed work is shared through the agreed process for final review, approval and filing by the responsible taxpayer or authorised tax professional.', deliverable: 'Final review, approval and filing' }
    ],
    benefits: [
      { title: 'Experience', description: 'Supporting a range of individual, business and professional requirements.', stat: '5–10 years across tax & accounting' },
      { title: 'A client base of 250–500', description: 'Experience supporting different client requirements and engagement types.', stat: '250–500' },
      { title: 'Accountants, reviewers & tax specialists', description: 'A mixed team covering preparation, documentation and review.' },
      { title: 'Fluent in established software', description: 'Drake, ProConnect, UltraTax, QuickBooks, CCH ProSystem fx and ProSeries.' },
      { title: 'Direct clients and CPA firms', description: 'Individuals, business owners and firms needing more preparation capacity.' },
      { title: 'Practical, process-led', description: 'Organised records, clear communication and a defined workflow — requirements first.' }
    ],
    faqs: [
      { question: 'What US tax preparation services does Smart Tax Expertss provide?', answer: 'Tax preparation support for individuals and businesses, including Form 1040, Form 1065, Form 1120-S and Form 1120 preparation, plus bookkeeping, accounting and tax outsourcing support for CPA firms.' },
      { question: 'Do you provide tax preparation services for US CPA firms?', answer: 'Yes. We provide offshore tax preparation and accounting support for US CPA firms and accounting practices. The engagement is shaped around return types, workload, software, documentation requirements and your firm’s workflow.' },
      { question: 'Which tax preparation software does your team use?', answer: 'Drake, Intuit ProConnect, UltraTax CS, QuickBooks, CCH ProSystem fx and ProSeries, among other platforms. The software used depends on the client’s or CPA firm’s requirements.' },
      { question: 'Can you prepare both individual and business tax returns?', answer: 'Yes — including Form 1040, partnership returns, S corporation returns and C corporation returns, depending on the engagement.' },
      { question: 'Do you provide bookkeeping services along with tax preparation?', answer: 'Yes. Bookkeeping and accounting support includes transaction categorisation, reconciliations, expense organisation and other agreed tasks that keep records ready for tax preparation.' },
      { question: 'How experienced is the Smart Tax Expertss team?', answer: 'Smart Tax Expertss has 5–10 years of experience, supported by a mixed team of accountants, reviewers and tax specialists.' },
      { question: 'How many clients has Smart Tax Expertss served?', answer: 'The company has a client base of 250–500. The nature and scope of services vary according to each client’s requirements.' },
      { question: 'Can a CPA firm outsource only selected tax preparation tasks?', answer: 'Yes. You can outsource specific work such as individual returns, business returns, supporting schedules, workpapers or bookkeeping tasks. The scope is defined before the engagement begins.' },
      { question: 'Do you provide support for state tax returns?', answer: 'State tax preparation support can be discussed based on the relevant state, taxpayer circumstances and scope of work. Requirements vary by state, so they’re established before preparation begins.' },
      { question: 'Does Smart Tax Expertss file tax returns directly with the IRS?', answer: 'Filing arrangements depend on the engagement and the applicable authorisations, credentials and filing requirements. The taxpayer or responsible authorised tax professional remains responsible for ensuring the return is reviewed, approved and filed through the appropriate process.' }
    ],
    relatedSlugs: ['tax-review-support', 'bookkeeping-outsourcing', 'dedicated-staff-augmentation']
  },
  {
    id: 'cpa-bookkeeping-outsource',
    slug: 'bookkeeping-outsourcing',
    name: 'Bookkeeping Outsourcing',
    category: 'cpa',
    shortDescription: 'End-to-end back-office bookkeeping support for CPA firms managing dozens or hundreds of client ledgers.',
    fullDescription: 'Delegate repetitive monthly bank feeds, reconciliation of clearing accounts, credit card reconciliations, and payroll entries to dedicated offshore bookkeeping teams working under your brand.',
    iconName: 'BookOpen',
    deliverables: ['Bank & Credit Card Cleared Workpapers', 'Standardized Chart of Accounts Mapping', 'Month-End Close Checklist', 'Client Query Logs'],
    idealFor: 'Accounting firms scaling their Client Accounting Services (CAS) practice.',
    turnaroundTime: 'Real-time Daily / Weekly',
    demoType: 'bookkeeping-ledger',
    heroTagline: 'Scale Your CAS Practice with White-Label Dedicated Monthly Bookkeeping Teams.',
    features: [
      { title: 'White-Label CAS Support', desc: 'We operate quietly behind your brand; your clients only see your accounting firm name and domain.' },
      { title: 'Daily Bank Feed Clearing', desc: 'Transactions are cleared daily, preventing month-end reconciliation bottlenecks.' },
      { title: 'Standard Chart of Accounts (COA)', desc: 'Strict alignment to your firm standardized chart of accounts for uniform tax preparation later.' },
      { title: 'Clean Query Escalation Logs', desc: 'Weekly summarized queries sent in clean spreadsheets for partner or manager sign-off.' }
    ],
    workflow: [
      { step: '01', title: 'Firm Client Onboarding', description: 'Map chart of accounts, bank feed access, and standard operating procedures.', deliverable: 'Firm SOP Binder' },
      { step: '02', title: 'Daily / Weekly Transaction Sync', description: 'Reconcile bank lines, categorize expenses, and match receipts in cloud software.', deliverable: 'Clean Bank Feeds' },
      { step: '03', title: 'Monthly Reconciliation Binder', description: 'Tie balance sheet accounts to bank statements with PDF proof of zero variance.', deliverable: 'Signed Rec Sheets' },
      { step: '04', title: 'Month-End Close Package', description: 'Deliver trial balance and financial drafts for firm manager review.', deliverable: 'CAS Close Package' }
    ],
    benefits: [
      { title: 'Double CAS Client Capacity', description: 'Take on dozens of new monthly retainer clients without hiring domestic bookkeepers.', stat: '2x Capacity' },
      { title: '65% Cost Savings', description: 'Flat rates of $24-$28/hr compared to $60-$80/hr domestic bookkeeper costs.', stat: '65% Cost Saved' },
      { title: 'Tax-Ready Year-End Books', description: 'Because our team understands US tax codes, ledgers flow seamlessly into tax software.', stat: '100% Tax-Ready' }
    ],
    faqs: [
      { question: 'Do you communicate directly with our firm clients?', answer: 'By default, we operate 100% white-label through your designated firm email alias, or we simply hand work to your managers for direct client transmission.' }
    ],
    relatedSlugs: ['accounting-outsourcing', 'tax-prep-outsourcing', 'year-end-cleanup']
  },
  {
    id: 'cpa-accounting-outsource',
    slug: 'accounting-outsourcing',
    name: 'Accounting Outsourcing',
    category: 'cpa',
    shortDescription: 'Complex accrual accounting, deferred revenue schedules, lease accounting (ASC 842), and journal entries.',
    fullDescription: 'Senior offshore staff accountants execute technical accounting workflows including revenue recognition, fixed asset register depreciation, intercompany eliminations, and equity waterfall entries.',
    iconName: 'Layers',
    deliverables: ['ASC 606 & ASC 842 Schedules', 'Fixed Asset Rollforwards', 'Prepaid & Accrual Reconciliations', 'Workpaper Binder Ready for Review'],
    idealFor: 'CPA firms serving mid-market corporate clients with complex GAAP demands.',
    turnaroundTime: '3-5 Business Days',
    demoType: 'accounting-pipeline',
    heroTagline: 'Technical Senior Staff Accountants for Complex Accruals, ASC 606 & ASC 842.',
    features: [
      { title: 'ASC 606 Multi-Element Arrangements', desc: 'Detailed deferred revenue schedules, milestone billing reconciliations, and contract asset tracking.' },
      { title: 'Fixed Asset Register Management', desc: 'Capital expenditure additions, disposals, and dual-book (GAAP vs Tax) depreciation roll forwards.' },
      { title: 'Intercompany Eliminations', desc: 'Consolidated workpapers reconciling intercompany payables, receivables, and management fee markups.' },
      { title: 'Equity & Cap Table True-Ups', desc: 'Record stock compensation expense (ASC 718), convertible notes, and preferred share distribution waterfalls.' }
    ],
    workflow: [
      { step: '01', title: 'Complex Schedule Request', description: 'Firm manager shares source contracts, lease documents, and capitalization policies.', deliverable: 'Technical Intake' },
      { step: '02', title: 'Schedule Construction', description: 'Our senior accountants build dynamic Excel rollforward schedules with full audit trails.', deliverable: 'GAAP Schedule Workbook' },
      { step: '03', title: 'Adjusting Journal Entries', description: 'Draft comprehensive AJEs with supporting calculations and account cross-references.', deliverable: 'AJE Summary Binder' },
      { step: '04', title: 'Manager Review Delivery', description: 'Submit workpapers ready for partner review and audit committee presentations.', deliverable: 'Audit-Proof Package' }
    ],
    benefits: [
      { title: 'Handle High-Fee Mid-Market Clients', description: 'Deliver technical GAAP advisory that command top billing rates.', stat: 'High-Value' },
      { title: 'Experienced CPAs and ACCAs', description: 'Our senior accountants have 6-10+ years of technical US GAAP accounting experience.', stat: '6-10 yrs Exp' },
      { title: 'Seamless Audit Tie-Out', description: 'Workpapers built to withstand Big Four and mid-tier audit scrutiny.', stat: 'Audit-Proof' }
    ],
    faqs: [
      { question: 'What credentials do your senior accounting team members hold?', answer: 'Our senior accountants hold active credentials including Chartered Accountant (CA), ACCA, Certified Internal Auditor (CIA), and Master of Accountancy degrees.' }
    ],
    relatedSlugs: ['financial-statement-prep', 'audit-support', 'cpa-tax-prep-outsource']
  },
  {
    id: 'cpa-payroll-processing',
    slug: 'payroll-processing',
    name: 'Payroll Processing',
    category: 'cpa',
    shortDescription: 'Turnkey white-label payroll compliance, multi-state withholding, and year-end 1099/W-2 preparation for your clients.',
    fullDescription: 'Outsource the operational burden of client payroll across ADP, Gusto, Paychex, and QuickBooks Payroll, ensuring strict adherence to state tax deadlines and unemployment filings.',
    iconName: 'Coins',
    deliverables: ['Pre-Payroll Audit Verification', 'Payroll Tax Filing Tracking', 'Year-End 1099 Reconciliation', 'Direct Deposit Exception Logs'],
    idealFor: 'Firms wanting to offer payroll as a value-add without hiring in-house administrators.',
    turnaroundTime: '24h Prior to Pay Date',
    demoType: 'payroll-timeline',
    heroTagline: 'Turnkey Multi-State Payroll Operations and 1099/W-2 Compliance for Your Client Base.',
    features: [
      { title: 'Payroll Platform Agnostic', desc: 'We administer payroll inside Gusto, ADP Workforce Now, Paychex, and QuickBooks Online Payroll.' },
      { title: 'Multi-State Tax Registration Tracking', desc: 'Ensure state unemployment and withholding tax accounts are registered correctly.' },
      { title: 'High-Volume 1099 Distribution', desc: 'Reconcile vendor payments against W-9 forms and e-file hundreds of 1099-NEC forms in January.' },
      { title: 'General Ledger Payroll Journal Entry', desc: 'Post balanced gross-to-net payroll journal entries into client accounting software.' }
    ],
    workflow: [
      { step: '01', title: 'Timesheet & Bonus Input', description: 'Receive hours and bonus approvals from client managers.', deliverable: 'Input Summary' },
      { step: '02', title: 'Pre-Payroll Calculation Audit', description: 'Verify deductions, benefits, and net pay figures against prior pay period variances.', deliverable: 'Pre-Flight Audit' },
      { step: '03', title: 'Firm Sign-Off & Submission', description: 'Send confirmation summary to firm manager before authorizing ACH deposit.', deliverable: 'Authorized Payroll' },
      { step: '04', title: 'GL Journal Entry Posting', description: 'Post the corresponding balanced payroll journal entry directly into QuickBooks or Xero.', deliverable: 'Balanced GL Entry' }
    ],
    benefits: [
      { title: 'Zero Payroll Headaches', description: 'Eliminate tedious bi-weekly calculation tasks for your onshore team.', stat: '100% Automated' },
      { title: 'Client Retention Anchor', description: 'Clients who use your firm for payroll rarely switch accounting providers.', stat: 'High Retention' },
      { title: 'Scalable Fixed Pricing', description: 'Predictable per-employee per-month pricing protects your firm profit margins.', stat: 'High Margin' }
    ],
    faqs: [
      { question: 'Do you manage payroll tax deposits?', answer: 'Yes, payroll tax withholding deposits are automatically scheduled and tracked through your client payroll service provider.' }
    ],
    relatedSlugs: ['bookkeeping-outsourcing', 'dedicated-staff-augmentation']
  },
  {
    id: 'cpa-audit-support',
    slug: 'audit-support',
    name: 'Audit Support',
    category: 'cpa',
    shortDescription: 'Pre-audit sampling, confirmations, trial balance tie-outs, and PBC (Provided by Client) list tracking.',
    fullDescription: 'Accelerate your assurance engagements. Our offshore audit specialists prepare lead sheets, sample test selections, roll forwards, and analytical review workpapers ready for partner sign-off.',
    iconName: 'ClipboardCheck',
    deliverables: ['Audit Lead Schedule Workpapers', 'Bank & Accounts Receivable Confirmations', 'Substantive Testing Documentation', 'Internal Control Walkthrough Logs'],
    idealFor: 'Audit partners seeking to reduce engagement hours and improve realization rates.',
    turnaroundTime: 'Custom Engagement Sprints',
    popular: true,
    demoType: 'audit-sampling',
    heroTagline: 'Substantive Testing, Lead Schedule Tie-Outs, and PBC Management Ready for Partner Sign-Off.',
    features: [
      { title: 'Audit Lead Schedule Preparation', desc: 'Build standardized lead sheets linking trial balance accounts directly to working papers and testing schedules.' },
      { title: 'Third-Party Confirmations', desc: 'Draft and track bank, loan, legal, and accounts receivable confirmations via Confirmation.com.' },
      { title: 'Substantive Sampling & Vouching', desc: 'Select random/monetary-unit samples and vouch transactions against invoices, POs, and bank statements.' },
      { title: 'PBC List Coordination', desc: 'Maintain real-time dashboard tracking of client document submissions and pending items.' }
    ],
    workflow: [
      { step: '01', title: 'Engagement Planning & PBC Setup', description: 'Setup audit workpaper binder, roll forward prior year files, and customize client PBC list.', deliverable: 'Master PBC Tracker' },
      { step: '02', title: 'Trial Balance & Lead Schedules', description: 'Tie out current year trial balance to prior year and establish lead schedule materiality thresholds.', deliverable: 'Tied Lead Schedules' },
      { step: '03', title: 'Substantive Testing & Vouching', description: 'Test revenue cut-off, expense substantiation, fixed asset additions, and payroll samples.', deliverable: 'Documented Test Sheets' },
      { step: '04', title: 'Audit Binder Partner Review', description: 'Deliver clean, tickmarked audit binders in Caseware or AdvanceFlow ready for partner review.', deliverable: 'Partner Review File' }
    ],
    benefits: [
      { title: 'Cut Engagement Hours by 50%', description: 'Onshore auditors focus on risk assessment and partner review instead of manual vouching.', stat: '-50% Hours' },
      { title: 'Improve Partner Realization', description: 'Drastically lower the blended hourly cost on fixed-fee audit engagements.', stat: 'Up to 55%' },
      { title: 'AICPA Peer Review Compliance', description: 'Workpapers built strictly to US GAAS and AICPA assurance standards.', stat: '100% GAAS' }
    ],
    faqs: [
      { question: 'What audit software platforms do you support?', answer: 'We are experienced in Caseware Working Papers, Thomson Reuters AdvanceFlow, CCH ProSystem fx Engagement, and Excel-based custom workpaper binders.' }
    ],
    relatedSlugs: ['financial-statement-prep', 'accounting-outsourcing']
  },
  {
    id: 'cpa-financial-statements',
    slug: 'financial-statement-prep',
    name: 'Financial Statement Preparation',
    category: 'cpa',
    shortDescription: 'Compilation and preparation of GAAP/OCBOA financial statements, footnote disclosures, and cash flow exhibits.',
    fullDescription: 'Production of publication-ready financial statements for client banking, bonding, or tax attachment requirements, prepared rigorously to AICPA SSARS standards.',
    iconName: 'FileCheck',
    deliverables: ['Balance Sheet, Income & Cash Flow Statements', 'Standard Footnote Disclosures', 'Accountant Preparation Reports', 'Comparative Period Variance Analysis'],
    idealFor: 'CPA firms delivering compiled financial packages to commercial lenders.',
    turnaroundTime: '2-3 Business Days',
    demoType: 'financial-reporting',
    heroTagline: 'AICPA SSARS Compliant Compilation and Financial Statement Footnote Packages.',
    features: [
      { title: 'SSARS 21/25 Compliant Formatting', desc: 'Strict compliance with AICPA preparation, compilation, and review documentation requirements.' },
      { title: 'Comprehensive Footnote Drafting', desc: 'Draft standardized footnotes covering accounting policies, debt terms, lease commitments, and contingencies.' },
      { title: 'Cash Flow Statement Generation', desc: 'Accurately reconcile operating, investing, and financing cash flows using the indirect method.' },
      { title: 'Comparative Multi-Year Formats', desc: 'Professional typography and side-by-side comparative period presentation ready for bank underwriters.' }
    ],
    workflow: [
      { step: '01', title: 'Trial Balance Ingestion', description: 'Import adjusted trial balance and verify balance sheet equality.', deliverable: 'Balanced Trial Balance' },
      { step: '02', title: 'Statement Formatting & Footnotes', description: 'Draft Balance Sheet, Income Statement, Statement of Cash Flows, and Footnote Disclosures.', deliverable: 'Draft Financial Report' },
      { step: '03', title: 'Internal Quality Control Check', description: 'Senior reviewer verifies math tie-outs, footnote cross-references, and SSARS wording.', deliverable: 'QC Review Checklist' },
      { step: '04', title: 'Publication-Ready Delivery', description: 'Deliver clean PDF report on firm letterhead template ready for partner signature.', deliverable: 'Final Bound Financials' }
    ],
    benefits: [
      { title: 'Fast 48-Hour Turnaround', description: 'Deliver compiled financial statements to clients facing urgent bank financing deadlines.', stat: '48h SLA' },
      { title: 'Zero Formatting Flaws', description: 'Publication-quality layouts that enhance your firm professional reputation.', stat: 'Bank-Ready' },
      { title: 'Cost-Effective Production', description: 'Eliminate tedious manual spreadsheet compilation hours for your senior staff.', stat: 'Save 60%' }
    ],
    faqs: [
      { question: 'Can you draft custom footnote disclosures for complex debt agreements?', answer: 'Yes, we prepare detailed footnotes for SBA loans, line of credit covenants, convertible notes, and complex equity structures.' }
    ],
    relatedSlugs: ['accounting-outsourcing', 'audit-support']
  },
  {
    id: 'cpa-tax-review',
    slug: 'tax-review-support',
    name: 'Tax Review Support',
    category: 'cpa',
    shortDescription: 'First-level and second-level review of tax returns prepared by in-house junior staff to identify missed deductions.',
    fullDescription: 'Deploy senior reviewers with 8+ years of US tax experience to clear diagnostics, verify basis calculations (Form 7203), and flag technical planning opportunities prior to final partner sign-off.',
    iconName: 'CheckCircle2',
    deliverables: ['Review Memo & Review Notes', 'Form 7203 Shareholder Basis Check', 'State Apportionment Review', 'Cross-Year Carryforward Verification'],
    idealFor: 'Sole practitioners and boutique CPA firms needing an extra pair of senior eyes.',
    turnaroundTime: '24-36 Hours',
    demoType: 'tax-workflow',
    heroTagline: 'Deploy Seasoned 8+ Year US Tax Reviewers to Free Up Partner Hours During Peak Deadlines.',
    features: [
      { title: 'Comprehensive Diagnostic Clearance', desc: 'Investigate and resolve complex software diagnostics, e-file validation warnings, and state apportionment flags.' },
      { title: 'Detailed Review Notes in Software', desc: 'Clear, standardized review notes linked directly to tax return input fields for junior staff correction.' },
      { title: 'Form 7203 & K-1 Schedule Scrutiny', desc: 'Rigorous cross-checking of shareholder distributions against accumulated adjustments accounts (AAA).' },
      { title: 'Planning Opportunity Identification', desc: 'Flag potential missed deductions (Section 179, QBI, PTET, R&D credits) to present to the client.' }
    ],
    workflow: [
      { step: '01', title: 'Prepared Return Submission', description: 'Firm submits return prepared by in-house staff along with indexed workpapers.', deliverable: 'Review File' },
      { step: '02', title: 'Technical Review Execution', description: 'Senior reviewer verifies inputs against workpapers, checks prior year carryforwards, and clears diagnostics.', deliverable: 'Diagnostic Tie-Out' },
      { step: '03', title: 'Review Notes Documentation', description: 'Document clear, organized review comments for junior staff correction or make direct corrections if authorized.', deliverable: 'Structured Review Memo' },
      { step: '04', title: 'Partner Ready Sign-Off', description: 'Submit verified return to partner with a clean bill of health ready for client signature.', deliverable: 'Sign-Off Ready Return' }
    ],
    benefits: [
      { title: 'Free Up Partner Hours', description: 'Partners spend time advising high-fee clients rather than reviewing Form 1040s and 1120s line by line.', stat: 'Save 30h/wk' },
      { title: 'Eliminate Filing Errors', description: 'Double-tier scrutiny catches subtle multi-state apportionment and basis tracking errors.', stat: 'Zero Errors' },
      { title: 'Rapid 24-36 Hour Turnaround', description: 'Quick turnaround prevents returns from piling up on the partner desk.', stat: '24-36h' }
    ],
    faqs: [
      { question: 'Can your reviewers fix input errors directly or do they only provide review notes?', answer: 'We follow your firm preferred protocol: our reviewers can either provide structured review notes for your staff to correct, or fix inputs directly and highlight changes.' }
    ],
    relatedSlugs: ['tax-prep-outsourcing', 'dedicated-staff-augmentation']
  },
  {
    id: 'cpa-year-end-cleanup',
    slug: 'year-end-cleanup',
    name: 'Year-End Cleanup',
    category: 'cpa',
    shortDescription: 'Rapid diagnostic cleanup of messy client books, uncategorized transactions, and unbalanced equity.',
    fullDescription: 'When new clients hand you books with negative bank balances, commingled expenses, and unverified loan balances, our cleanup squad rebuilds the ledger quickly for immediate tax filing.',
    iconName: 'Sparkles',
    deliverables: ['Opening Balance Equity True-Up', 'Historical Clearing of Undeposited Funds', 'Loan Amortization Tie-Out', 'Clean Adjusted Trial Balance'],
    idealFor: 'Firms taking on new clients right before filing deadlines.',
    turnaroundTime: '3-5 Business Days',
    popular: true,
    demoType: 'cleanup-reconcile',
    heroTagline: 'Rapid Forensic Cleanup of Messy Ledgers, Negative Balances, and Undeposited Funds.',
    features: [
      { title: 'Opening Balance Equity Elimination', desc: 'Dissect and reclassify mysterious opening balance equity entries into proper partner capital accounts.' },
      { title: 'Undeposited Funds Historical Purge', desc: 'Clear stale uncleared checks, duplicate invoices, and phantom merchant deposits accumulating over years.' },
      { title: 'Loan Balance Amortization Tie-Out', desc: 'Split mixed principal and interest payments and tie ending liability balances to lender 1098 forms.' },
      { title: 'Commingled Personal Expense Cleanse', desc: 'Segregate personal owner draws from legitimate deductible corporate operating expenses.' }
    ],
    workflow: [
      { step: '01', title: 'Diagnostic Ledger Triage', description: 'Conduct automated scan of balance sheet and trial balance to quantify required adjustments.', deliverable: 'Diagnostic Triage Report' },
      { step: '02', title: 'Historical Bank Re-Tie', description: 'Re-import statements, reconcile cleared balances, and eliminate duplicate feed transactions.', deliverable: 'Reconciled Bank Proof' },
      { step: '03', title: 'Equity & Retained Earnings Roll', description: 'Roll prior-year tax returns into beginning retained earnings to balance shareholder equity.', deliverable: 'Equity Rollforward' },
      { step: '04', title: 'Clean Tax-Ready Trial Balance', description: 'Deliver clean adjusted trial balance ready for immediate tax return import.', deliverable: 'Tax-Ready Ledger' }
    ],
    benefits: [
      { title: 'Rescue New Client Onboarding', description: 'Turn nightmare onboarding books into clean tax returns in less than 5 business days.', stat: '3-5 Days' },
      { title: 'Bill Profitable Cleanup Fees', description: 'Easily charge high diagnostic and catch-up fees while outsourcing the heavy ledger lifting.', stat: 'High Margin' },
      { title: 'Zero Retained Earnings Variance', description: 'Ensure the balance sheet ties out to prior year tax returns down to the penny.', stat: '100% Tied' }
    ],
    faqs: [
      { question: 'How far back can you clean up client accounting books?', answer: 'We regularly perform cleanups covering 1 to 5+ unfiled prior tax years, reconstructing missing general ledgers from source bank PDF statements.' }
    ],
    relatedSlugs: ['bookkeeping-outsourcing', 'tax-prep-outsourcing']
  },
  {
    id: 'cpa-write-up-services',
    slug: 'write-up-services',
    name: 'Write-up Services',
    category: 'cpa',
    shortDescription: 'Periodic ledger write-up, journal entries, trial balance generation, and depreciation schedule maintenance.',
    fullDescription: 'Traditional write-up services executed with modern digital efficiency. We convert source bank statements, sales registers, and cash receipts into an authoritative General Ledger and Trial Balance.',
    iconName: 'PenTool',
    deliverables: ['Adjusting Journal Entries (AJEs)', 'General Ledger Detail Report', 'Working Trial Balance', 'Depreciation & Amortization Schedules'],
    idealFor: 'Firms serving small mom-and-pop clients who do not use modern cloud accounting.',
    turnaroundTime: '48-72 Hours',
    demoType: 'bookkeeping-ledger',
    heroTagline: 'Modern Digital Write-Up from Paper Receipts, Bank Statements, and Source Documents.',
    features: [
      { title: 'Statement OCR & Digital Ingestion', desc: 'Convert scanned PDF bank statements and receipts into digital general ledger entries via optical character recognition.' },
      { title: 'Standardized Adjusting Journal Entries', desc: 'Post depreciation, payroll clearing, loan payments, and accrued expense entries.' },
      { title: 'Working Trial Balance Generation', desc: 'Generate complete debit-and-credit trial balances with full source document cross-references.' },
      { title: 'Periodic Compilation Reports', desc: 'Deliver clean quarterly or annual compilation packages ready for tax filing.' }
    ],
    workflow: [
      { step: '01', title: 'Source Document Intake', description: 'Upload scanned paper receipts, PDF bank statements, and sales registers.', deliverable: 'Digital Intake Binder' },
      { step: '02', title: 'Transaction Posting & Coding', description: 'Digitize and code transactions into general ledger accounting software.', deliverable: 'General Ledger Detail' },
      { step: '03', title: 'Standard Adjustments & AJEs', description: 'Post depreciation rollforwards, accruals, and year-end inventory true-ups.', deliverable: 'AJE Schedule' },
      { step: '04', title: 'Trial Balance Delivery', description: 'Deliver balanced, tax-ready working trial balance for firm tax software import.', deliverable: 'Working Trial Balance' }
    ],
    benefits: [
      { title: 'Profitable Small-Client Service', description: 'Keep traditional write-up clients highly profitable without tying up domestic staff.', stat: 'Profitable' },
      { title: '48-72 Hour Delivery SLA', description: 'Rapid turnaround even on messy source document batches.', stat: '48-72h' },
      { title: 'Tax Software Ready', description: 'Direct import capabilities into UltraTax, Drake, and ProSystem fx.', stat: 'Direct Import' }
    ],
    faqs: [
      { question: 'Can you work from scanned paper bank statements and check copies?', answer: 'Yes, our team uses specialized optical document processing to convert paper scans into structured general ledger data.' }
    ],
    relatedSlugs: ['year-end-cleanup', 'bookkeeping-outsourcing']
  },
  {
    id: 'cpa-staff-augmentation',
    slug: 'dedicated-staff-augmentation',
    name: 'Dedicated Staff Augmentation',
    category: 'cpa',
    shortDescription: 'Hire full-time or fractional dedicated CPAs, EAs, and senior accountants dedicated exclusively to your practice.',
    fullDescription: 'Scale your practice without recruitment overhead or domestic payroll burdens. Your dedicated staff works your hours, attends your team standups, and integrates seamlessly into your firm workflow.',
    iconName: 'UserCheck',
    deliverables: ['Dedicated Full-Time Resource (160 hrs/mo)', 'Direct Slack / Teams Integration', 'Time-Tracked Transparency Reports', 'Dedicated Supervisor Oversight'],
    idealFor: 'Rapidly growing accounting firms looking to add 1 to 10+ full-time accountants.',
    turnaroundTime: 'Onboarding in 5-7 Days',
    popular: true,
    demoType: 'staff-augmentation',
    heroTagline: 'Dedicated Full-Time CPAs and EAs Working Exclusively Inside Your Practice.',
    features: [
      { title: '100% Dedicated to Your Practice Only', desc: 'Your assigned staff accountant never juggles multiple firms; they work exclusively on your client accounts.' },
      { title: 'US Time-Zone Overlap', desc: 'Work your exact hours (EST, CST, MST, PST) for real-time collaboration, Slack messaging, and daily standups.' },
      { title: 'Zero Domestic Payroll or Fringe Burden', desc: 'We handle employee healthcare, payroll taxes, modern hardware, high-speed fiber, and office overhead.' },
      { title: 'Pre-Trained on Top US Tax Suites', desc: 'Resources arrive pre-screened with verified expertise in UltraTax, Drake, QuickBooks, and Xero.' }
    ],
    workflow: [
      { step: '01', title: 'Firm Needs Consultation', description: 'Specify required software proficiencies, experience level, and weekly working hours.', deliverable: 'Talent Specification' },
      { step: '02', title: 'Video Interviews with Top Candidates', description: 'Interview pre-screened CPAs and EAs directly via Zoom or Teams to select your ideal match.', deliverable: 'Candidate Selection' },
      { step: '03', title: 'Virtual Onboarding & Security Setup', description: 'Provide firm software credentials and integrate resource into firm Slack/Teams channels.', deliverable: 'Active Credentials' },
      { step: '04', title: 'Seamless Daily Integration', description: 'Resource begins full-time production with daily time-tracking reports and supervisor oversight.', deliverable: 'Production Reports' }
    ],
    benefits: [
      { title: 'Save Up to 70% Over Domestic Hires', description: 'Dedicated full-time senior accountants starting at $22 - $28/hr with zero recruiting agency fees.', stat: 'Save 70%' },
      { title: 'Overcome the CPA Shortage', description: 'Instantly fill open seats that have sat vacant for months on domestic job boards.', stat: '5-Day Ramp' },
      { title: 'Long-Term Team Retention', description: 'Our employee retention rate exceeds 94%, ensuring year-over-year institutional knowledge.', stat: '94% Retention' }
    ],
    faqs: [
      { question: 'What happens if a dedicated team member takes vacation or leave?', answer: 'We maintain trained backup associates cross-trained on your firm standard operating procedures to ensure continuous production without client delays.' },
      { question: 'Is there a long-term commitment required?', answer: 'We offer flexible month-to-month contracts following an initial trial period, as well as seasonal busy-season agreements.' }
    ],
    relatedSlugs: ['tax-prep-outsourcing', 'bookkeeping-outsourcing', 'tax-review-support']
  }
];

export function getServicesByCategory(category: ClientCategory): ServiceItem[] {
  return SERVICES_CATALOG.filter((item) => item.category === category);
}

export function findServiceBySlug(slug: string): ServiceItem | undefined {
  return SERVICES_CATALOG.find((item) => item.slug === slug);
}
