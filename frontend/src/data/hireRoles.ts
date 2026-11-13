import type { LucideIcon } from 'lucide-react';
import { Calculator, ClipboardCheck, BookOpenCheck, ArrowLeftRight } from 'lucide-react';

export interface RoleLevel {
  label: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  software: string[];
  qualifications: string[];
  experience: string;
  expectations: string[];
}

export interface HireRole {
  slug: string;
  title: string;
  shortTitle: string;
  cardDescription: string;
  icon: LucideIcon;
  specialization: string;
  overview: string;
  responsibilities: string[];
  skills: string[];
  software: string[];
  qualifications: string[];
  experience: string;
  expectations: string[];
  benefits: string[];
  levels?: RoleLevel[];
}

export type HireRoleOverride = Partial<Omit<HireRole, 'icon'>> & { slug: string };

export const HIRE_ROLES: HireRole[] = [
  {
    slug: 'tax-preparer',
    title: 'Tax Preparer',
    shortTitle: 'Tax preparation',
    cardDescription: 'Build accurate individual and business returns with a team that values careful work and client trust.',
    icon: Calculator,
    specialization: 'Forms 1040 · 1120 · 1120S · 1065',
    overview: 'Prepare complete, well-supported US federal and state tax returns. You will work from organized client source documents, follow review-ready workpaper standards, and help clients meet filing deadlines with confidence.',
    responsibilities: ['Organize source documents and identify missing information.', 'Prepare individual returns and supporting schedules; business returns according to experience level.', 'Enter and reconcile W-2, 1099, K-1 and other tax data.', 'Research deductions and credits applicable to the client facts.', 'Resolve software diagnostics and document assumptions.', 'Protect confidential taxpayer information and meet agreed deadlines.'],
    skills: ['Form 1040 fundamentals', 'W-2 and 1099 data', 'Deductions and credits', 'Return diagnostics', 'Tax documentation', 'Federal and state compliance'],
    software: ['Drake Tax', 'UltraTax CS', 'ProConnect', 'Lacerte'],
    qualifications: ['Accounting, taxation, finance or equivalent practical experience.', 'Relevant tax training; EA credential is valued for senior work.', 'Clear written communication and a strong commitment to confidentiality.'],
    experience: 'Junior: foundational preparation experience or relevant training. Senior: typically 3+ seasons with complex individual and business returns.',
    expectations: ['Document work so another preparer or reviewer can follow it.', 'Ask focused questions when source documents conflict or are incomplete.', 'Apply feedback consistently while maintaining accuracy during busy periods.'],
    benefits: ['Structured technical support and review feedback', 'Exposure to varied client profiles and tax situations', 'Clear scope, team communication and seasonal planning'],
    levels: [
      {
        label: 'Junior Tax Preparer',
        description: 'Support accurate individual tax preparation while building practical knowledge of US forms, tax software, and documentation standards.',
        responsibilities: ['Enter W-2, 1099 and basic client data into tax software.', 'Prepare straightforward Form 1040 returns using provided checklists.', 'Organize source documents and flag missing or inconsistent information.', 'Apply common deductions and credits with guidance.', 'Clear basic diagnostics and prepare returns for reviewer handoff.'],
        skills: ['Basic US individual tax preparation', 'Form 1040 fundamentals', 'W-2 / 1099 data entry', 'Basic deductions and credits', 'Document verification', 'Attention to detail and willingness to learn'],
        software: ['Drake Tax basics', 'UltraTax CS basics', 'ProConnect basics', 'Microsoft Excel'],
        qualifications: ['Accounting or tax coursework, a relevant degree, or equivalent practical training.', 'Comfort with spreadsheets and digital document workflows.', 'Demonstrated care with confidential financial data.'],
        experience: 'Entry-level through approximately 2 tax seasons; training and supervised return assignments are available.',
        expectations: ['Follow documented preparation checklists.', 'Escalate unfamiliar tax situations rather than guessing.', 'Incorporate reviewer feedback and communicate blockers early.']
      },
      {
        label: 'Senior Tax Preparer',
        description: 'Own complex returns from source-document analysis through workpaper completion, applying tax research and planning judgment across individual and business engagements.',
        responsibilities: ['Prepare complex Forms 1040, 1120, 1120S and 1065.', 'Handle multi-state filing requirements, K-1s and complex schedules.', 'Research tax questions and document the authority and conclusion.', 'Identify planning opportunities and communicate implications to the engagement lead.', 'Resolve advanced diagnostics and review supporting calculations.', 'Coach junior preparers and help keep projects on schedule.'],
        skills: ['Advanced individual and business tax preparation', 'Complex return analysis', 'Tax planning and optimization', 'Multi-state returns', 'Tax research and compliance', 'Advanced deductions and credits'],
        software: ['Advanced Drake Tax', 'UltraTax CS', 'Lacerte', 'ProConnect', 'Microsoft Excel'],
        qualifications: ['Bachelor’s degree in accounting, taxation or a related discipline, or equivalent experience.', 'EA, CPA or progress toward a relevant credential is preferred.', 'Strong tax research, workpaper and client communication skills.'],
        experience: 'Typically 3+ tax seasons preparing complex individual and entity returns.',
        expectations: ['Exercise sound judgment and clearly document conclusions.', 'Manage multiple deadlines with proactive status updates.', 'Support consistent work quality through constructive peer guidance.']
      }
    ]
  },
  {
    slug: 'tax-reviewer',
    title: 'Tax Reviewer',
    shortTitle: 'Tax review',
    cardDescription: 'Strengthen return quality through thoughtful review, clear coaching, and consistent compliance checks.',
    icon: ClipboardCheck,
    specialization: 'Quality control · Federal & state',
    overview: 'Review completed returns and workpapers before delivery or submission. The reviewer helps identify errors, confirm supporting evidence, assess compliance, and return actionable feedback to preparers.',
    responsibilities: ['Review Forms 1040, 1120, 1120S and 1065 for accuracy and completeness.', 'Validate deductions, credits, basis, carryovers and supporting documents.', 'Identify inconsistencies, missing information and software diagnostics.', 'Check federal, state and multi-state filing requirements.', 'Research complex tax questions and record review conclusions.', 'Provide clear corrections and coaching, then confirm final quality control.'],
    skills: ['Strong US tax knowledge', 'Return review and quality assurance', 'Federal and state regulations', 'Tax research and analysis', 'Complex scenario assessment', 'Precise review notes'],
    software: ['Drake Tax', 'UltraTax CS', 'Lacerte', 'ProConnect', 'Excel'],
    qualifications: ['Degree or equivalent professional experience in accounting or taxation.', 'EA, CPA or comparable tax credential preferred.', 'Experience reviewing returns and communicating technical feedback.'],
    experience: 'Typically 3+ years in US tax preparation, including substantive review of individual and business returns.',
    expectations: ['Apply review standards consistently and fairly.', 'Prioritize risk and materiality without overlooking supporting details.', 'Return concise, actionable notes and help prevent recurring errors.'],
    benefits: ['Senior-level technical collaboration', 'Consistent quality standards and defined review workflows', 'Opportunity to mentor and improve team processes']
  },
  {
    slug: 'accountant-bookkeeping',
    title: 'Accountant / Bookkeeping',
    shortTitle: 'Accounting & bookkeeping',
    cardDescription: 'Keep client books dependable through disciplined transaction processing, reconciliation, and reporting.',
    icon: BookOpenCheck,
    specialization: 'Reconciliations · Month-end close',
    overview: 'Maintain reliable accounting records and translate day-to-day transactions into organized, review-ready books. Work may include recurring bookkeeping, reconciliations, close support, and financial reporting.',
    responsibilities: ['Record and categorize daily financial transactions.', 'Reconcile bank and credit-card accounts and investigate variances.', 'Process invoices and maintain accounts payable and receivable records.', 'Prepare journal entries and support general-ledger accuracy.', 'Assist with month-end and year-end close and financial statements.', 'Maintain source documentation and communicate unusual activity.'],
    skills: ['Transaction coding', 'Bank and credit-card reconciliation', 'Accounts payable and receivable', 'Journal entries', 'Financial reporting', 'Excel and documentation'],
    software: ['QuickBooks Online', 'Xero', 'NetSuite', 'Microsoft Excel'],
    qualifications: ['Accounting, bookkeeping or finance education, or equivalent practical experience.', 'Familiarity with double-entry bookkeeping and standard financial statements.', 'Dependable organization and communication skills.'],
    experience: 'Junior: foundational bookkeeping or accounting support. Senior: typically 3+ years supporting full-cycle books and close.',
    expectations: ['Maintain traceable documentation and consistent coding.', 'Investigate reconciliation differences rather than carrying unexplained balances.', 'Communicate close status and missing client information on time.'],
    benefits: ['Clear month-end workflows and quality review', 'Exposure to multiple accounting platforms and industries', 'Collaborative support for professional development'],
    levels: [
      {
        label: 'Junior Accountant / Bookkeeper',
        description: 'Provide dependable day-to-day bookkeeping support while learning reconciliation, transaction controls, and reporting fundamentals.',
        responsibilities: ['Record and categorize daily transactions from source documents.', 'Reconcile bank and credit-card accounts using established procedures.', 'Process invoices and assist with basic AP/AR tracking.', 'Maintain organized digital records and supporting documentation.', 'Prepare basic reports and flag unmatched or unusual activity.'],
        skills: ['Basic bookkeeping', 'Transaction recording', 'Bank and credit-card reconciliations', 'AP / AR fundamentals', 'Invoice processing', 'Expense categorization', 'Basic financial reporting', 'Excel and QuickBooks fundamentals'],
        software: ['QuickBooks Online fundamentals', 'Excel', 'Exposure to Xero is helpful'],
        qualifications: ['Accounting or bookkeeping coursework, a relevant certificate, or equivalent experience.', 'Basic understanding of debits, credits and financial records.', 'Strong data accuracy and documentation habits.'],
        experience: 'Entry-level through approximately 2 years of bookkeeping or accounting support.',
        expectations: ['Follow account coding and reconciliation checklists.', 'Raise discrepancies promptly and retain supporting evidence.', 'Accept feedback and meet recurring transaction deadlines.']
      },
      {
        label: 'Senior Accountant / Bookkeeper',
        description: 'Own full-cycle bookkeeping and close activities, producing reliable financial statements and helping improve the accounting process.',
        responsibilities: ['Manage general ledger activity and complex reconciliations.', 'Prepare month-end and year-end closing entries and schedules.', 'Prepare income statements, balance sheets and cash-flow reporting.', 'Analyze variances, cash flow and account balances.', 'Review accounting adjustments and journal entries.', 'Guide junior accounting staff and improve close procedures.'],
        skills: ['Advanced bookkeeping and accounting', 'Month-end and year-end close', 'General ledger management', 'Financial statement preparation', 'Complex reconciliations', 'Financial analysis and cash-flow monitoring', 'Staff supervision'],
        software: ['QuickBooks Online advanced', 'Xero', 'NetSuite', 'Excel'],
        qualifications: ['Degree, professional accounting qualification or equivalent full-cycle experience.', 'Strong understanding of accrual accounting and financial statements.', 'Experience reviewing work and coordinating close activities.'],
        experience: 'Typically 3+ years in full-cycle accounting, month-end close, or senior bookkeeping.',
        expectations: ['Own assigned accounts through reconciled, supportable close.', 'Explain material variances and open items clearly.', 'Maintain controls while coaching colleagues constructively.']
      }
    ]
  },
  {
    slug: 'ap-ar',
    title: 'AP / AR (Accounts Payable / Accounts Receivable)',
    shortTitle: 'AP / AR operations',
    cardDescription: 'Support healthy cash operations with accurate vendor payments, customer billing, and account follow-up.',
    icon: ArrowLeftRight,
    specialization: 'Vendor payments · Customer collections',
    overview: 'Manage the operational flow between vendor obligations and customer receipts. This role combines careful invoice processing, payment controls, customer account follow-up, and clear cash-application records.',
    responsibilities: ['Match vendor invoices to purchase orders and supporting approvals.', 'Verify expenses, code bills, and maintain vendor records.', 'Schedule payments and reconcile vendor statements.', 'Create customer invoices and apply incoming cash accurately.', 'Track aging balances, follow up on overdue accounts, and document collections.', 'Prepare AP/AR aging and cash activity reports.'],
    skills: ['Invoice and purchase-order matching', 'Vendor management and reconciliation', 'Payment scheduling and controls', 'Customer invoicing', 'Cash application and collections', 'Aging and account reconciliation'],
    software: ['QuickBooks', 'Xero', 'NetSuite', 'SAP', 'Microsoft Excel'],
    qualifications: ['Accounting, finance, business administration education or equivalent experience.', 'Understanding of invoice, payment and receivables workflows.', 'Professional written communication for vendor and customer follow-up.'],
    experience: 'Entry-level to experienced operations candidates considered; prior AP/AR or accounting-system experience is valued.',
    expectations: ['Protect payment details and follow approval controls.', 'Resolve unmatched invoices and unapplied cash promptly.', 'Communicate respectfully and keep aging records current.'],
    benefits: ['Defined processing and approval workflows', 'Cross-functional finance operations experience', 'Supportive team environment and clear operating standards']
  }
];

export function getHireRole(slug?: string) {
  return HIRE_ROLES.find(role => role.slug === slug);
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isRoleLevel(value: unknown): value is RoleLevel {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const level = value as Record<string, unknown>;
  return typeof level.label === 'string'
    && typeof level.description === 'string'
    && typeof level.experience === 'string'
    && isStringList(level.responsibilities)
    && isStringList(level.skills)
    && isStringList(level.software)
    && isStringList(level.qualifications)
    && isStringList(level.expectations);
}

function parseRoleOverride(value: unknown): HireRoleOverride | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  if (typeof record.slug !== 'string') return null;

  const override: HireRoleOverride = { slug: record.slug };
  const textFields = ['title', 'shortTitle', 'cardDescription', 'specialization', 'overview', 'experience'] as const;
  for (const field of textFields) {
    if (typeof record[field] === 'string') override[field] = record[field];
  }
  const listFields = ['responsibilities', 'skills', 'software', 'qualifications', 'expectations', 'benefits'] as const;
  for (const field of listFields) {
    if (isStringList(record[field])) override[field] = record[field];
  }
  if (Array.isArray(record.levels) && record.levels.every(isRoleLevel)) {
    override.levels = record.levels;
  }
  return override;
}

export function getHireRoleWithOverrides(slug: string | undefined, values: unknown) {
  const role = getHireRole(slug);
  if (!role) return undefined;
  const overrides = Array.isArray(values)
    ? values.map(parseRoleOverride).filter((value): value is HireRoleOverride => value !== null)
    : [];
  const override = overrides.find((item) => item.slug === role.slug);
  return override ? { ...role, ...override } : role;
}

export function getHireRolesWithOverrides(values: unknown): HireRole[] {
  return HIRE_ROLES.map((role) => getHireRoleWithOverrides(role.slug, values) || role);
}
