import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const PAGES = [
  { slug: 'home', title: 'Home', description: 'Cinematic 7-Chapter Homepage', status: 'published' },
  { slug: 'about', title: 'About Us', description: 'Firm History & Integrity', status: 'published' },
  { slug: 'services', title: 'Services', description: 'Complete 20-Services Directory', status: 'published' },
  { slug: 'cpa-outsourcing', title: 'CPA Outsourcing', description: 'Dedicated CPA Outsourcing Architecture', status: 'published' },
  { slug: 'hire-professionals', title: 'Hire Professionals', description: 'Hire Dedicated Accounting Professionals', status: 'published' },
  { slug: 'tax-resources', title: 'Tax Resources', description: 'Tax Intelligence Hub, Deadlines & Calculators', status: 'published' },
  { slug: 'blog', title: 'Blog', description: 'Editorial Dispatches & Verified Publications', status: 'published' },
  { slug: 'contact', title: 'Contact Us', description: 'Direct Office Coordinates & Inquiries', status: 'published' },
  { slug: 'book-consultation', title: 'Book Consultation', description: 'Strategic Consultation Booking Engine', status: 'published' },
  { slug: 'tax-calculator', title: 'Tax Calculator', description: 'Functional US Tax Calculator', status: 'published' },
];

const DEFAULT_CPA_SOFTWARE = ['UltraTax CS', 'ProConnect Tax', 'Drake Software', 'Lacerte', 'CCH Axcess', 'QuickBooks Online', 'Xero', 'NetSuite', 'Bill.com', 'Gusto & ADP'];
const DEFAULT_DEADLINES = [
  { date: 'January 15, 2025', title: 'Q4 2024 Estimated Tax Payment', description: 'Deadline for individuals and businesses paying fourth-quarter estimated taxes (Form 1040-ES).' },
  { date: 'January 31, 2025', title: 'W-2 & 1099-NEC Distribution', description: 'Employers must furnish Form W-2 to employees and Form 1099-NEC to independent contractors and the IRS.' },
  { date: 'March 15, 2025', title: 'S-Corporation & Partnership Filing (Form 1120-S / 1065)', description: 'Crucial deadline for calendar-year pass-through entities. Extension request (Form 7004) grants 6 additional months.' },
  { date: 'April 15, 2025', title: 'Individual & C-Corporation Tax Day (Form 1040 / 1120)', description: 'Federal income tax filing & payment deadline. Last day to contribute to traditional and Roth IRAs for 2024.' },
  { date: 'June 16, 2025', title: 'Q2 2025 Estimated Tax Payment', description: 'Second-quarter estimated payment due for self-employed individuals and pass-through owners.' },
  { date: 'September 15, 2025', title: 'Extended S-Corp & Partnership Deadline', description: 'Final deadline for calendar-year S-Corporations and Partnerships that filed Form 7004.' },
  { date: 'October 15, 2025', title: 'Extended Individual & C-Corp Deadline', description: 'Final deadline for calendar-year taxpayers granted a 6-month extension (Form 4868).' },
];
const DEFAULT_TIMELINE = [
  { quarter: 'Q1 Sprint', period: 'January 1 – March 31', focus: 'Peak Form 1040 & 1065/1120-S Blitz', volume: '150 – 400+ returns/week', keyDeliverables: ['W-2 & 1099-NEC reconciliations', 'S-Corp & Partnership Form 1120-S / 1065 workpapers', 'Dual-review diagnostic signoff within 48h', 'Form 7004 extension preparation'] },
  { quarter: 'Q2 Sprint', period: 'April 1 – June 30', focus: 'C-Corp Deadline & Post-Filing Cleanups', volume: '100 – 250 returns/week', keyDeliverables: ['Form 1120 Corporate Tax returns', 'State tax apportionment & franchise filings', 'Q2 estimated quarterly tax calculations (Form 1040-ES)', 'Delinquent bookkeeping reconciliation catch-up'] },
  { quarter: 'Q3 Sprint', period: 'July 1 – September 30', focus: 'Mid-Year Planning & Extended Business Returns', volume: '80 – 180 returns/week', keyDeliverables: ['September 15 extended S-Corp/Partnership finalization', 'Mid-year strategic tax advisory memos & entity restructuring', 'R&D tax credit (Form 6765) study documentation', 'Q3 estimated tax calculations'] },
  { quarter: 'Q4 Sprint', period: 'October 1 – December 31', focus: 'October 15 Final 1040s & Year-End Tax Prep', volume: '120 – 300 returns/week', keyDeliverables: ['October 15 final individual extension filings', 'Section 179 equipment purchase tax optimization', 'Year-end tax loss harvesting & bonus depreciation audits', 'Upcoming tax season capacity ramp-up'] },
];
const DEFAULT_DATA_FLOW = {
  stages: [
    { id: 'ingestion', name: 'Client Ingestion', subtext: 'Encrypted document portal (W-2s, 1099s, trial balances)', security: 'TLS 1.3 / 256-bit AES' },
    { id: 'prep', name: 'Diagnostic Preparation', subtext: 'Offshore Senior Tax Accountant workpaper compilation', security: 'Zero Local Data Retention' },
    { id: 'review', name: 'Two-Tier CPA Audit', subtext: 'US Enrolled Agent / licensed CPA diagnostic review', security: 'Cross-Check Checklist' },
    { id: 'efile', name: 'Final Delivery & e-File', subtext: 'Client signature packet & direct IRS / state transmission', security: 'IRS MeF Certified' },
  ],
  metrics: [
    { label: 'Average Turnaround', value: '24 – 48 Hours' },
    { label: 'Diagnostic Accuracy', value: '99.8% First-Pass' },
    { label: 'Data Storage', value: 'Client Server Only' },
    { label: 'Review Standard', value: 'EA / CPA Sign-off' },
  ],
  autoAdvance: true,
  cycleIntervalMs: 3200,
};
const DEFAULT_HIRE_ROLES = [
  { slug: 'tax-preparer', title: 'Tax Preparer', cardDescription: 'Build accurate individual and business returns with a team that values careful work and client trust.', specialization: 'Forms 1040 · 1120 · 1120S · 1065', skills: ['Form 1040 fundamentals', 'W-2 and 1099 data', 'Deductions and credits', 'Return diagnostics', 'Tax documentation', 'Federal and state compliance'] },
  { slug: 'tax-reviewer', title: 'Tax Reviewer', cardDescription: 'Strengthen return quality through thoughtful review, clear coaching, and consistent compliance checks.', specialization: 'Quality control · Federal & state', skills: ['Strong US tax knowledge', 'Return review and quality assurance', 'Federal and state regulations', 'Tax research and analysis'] },
  { slug: 'accountant-bookkeeping', title: 'Accountant / Bookkeeping', cardDescription: 'Keep client books dependable through disciplined transaction processing, reconciliation, and reporting.', specialization: 'Reconciliations · Month-end close', skills: ['Transaction coding', 'Bank and credit-card reconciliations', 'Financial reporting'] },
  { slug: 'ap-ar', title: 'Accounts Payable & Receivable Specialist', cardDescription: 'Support dependable payment and receivables workflows with clear records and timely follow-through.', specialization: 'Invoice processing · Receivables', skills: ['Invoice and purchase-order matching', 'Vendor management and reconciliation', 'Payment scheduling and controls'] },
];

function isUninitializedContent(content: string | null): boolean {
  if (!content || content.trim() === '{}' || content.trim() === '') return true;
  try {
    const parsed: unknown = JSON.parse(content);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return false;
    const entries = Object.values(parsed as Record<string, unknown>);
    return entries.length > 0 && entries.every((value) => Array.isArray(value) && value.length === 0);
  } catch {
    return false;
  }
}

const PAGE_SECTIONS: Record<string, { sectionKey: string; sectionType: string; title: string; desc: string; content?: string }[]> = {
  home: [
    { sectionKey: 'hero', sectionType: 'CinematicHeroChapter', title: 'Strategic Tax Advisory & Global Accounting Infrastructure', desc: 'Enterprise-grade tax planning and outsourcing.', content: JSON.stringify({ eyebrow: 'STRATEGIC US TAX & CPA ADVISORY', primaryCtaText: 'Book Strategic Consultation', primaryCtaUrl: '/book-consultation?category=cpa&service=tax-prep-outsourcing', secondaryCtaText: 'Explore Practices', secondaryCtaUrl: '/services', calculatorButtonText: 'Calculate Your US Taxes', trust_item1_category: 'PROCESS', trust_item1_title: 'Structured review', trust_item1_subtitle: 'Clear checkpoints', trust_item2_category: 'DOCUMENTS', trust_item2_title: 'Organized intake', trust_item2_subtitle: 'Review-ready flow', trust_item3_category: 'VISIBILITY', trust_item3_title: 'Clear milestones', trust_item3_subtitle: 'Progress at a glance', trust_item4_category: 'DELIVERY', trust_item4_title: 'Human oversight', trust_item4_subtitle: 'Quality-minded workflow' }) },
    { sectionKey: 'services_showcase', sectionType: 'EditorialServiceShowcase', title: 'Core Practice Areas & Advisory Verticals', desc: 'Specialized solutions for individuals, businesses, and CPA firms.', content: JSON.stringify({ directoryButton: 'Complete 20-Practice Directory', allLabel: 'All Practices', cpaLabel: 'CPA Firm Outsourcing', businessLabel: 'Corporate & Business', individualLabel: 'Private Wealth & Individuals', cardGuideButton: 'Read Practice Guide', bookButton: 'Book Engagement', loadMoreButton: 'Load More Practices', fullDirectoryButton: 'View Full 20-Service Architecture Directory' }) },
    { sectionKey: 'media_showcase', sectionType: 'VideoShowcase', title: 'Financial Intelligence in Real-Time Motion', desc: 'Explore the operational rhythm of our dual-review diagnostic preparation pipeline and multi-tier tax compliance engine.', content: JSON.stringify({ posterImage: '/assets/aistudio/Preferred_Tax_Consultancy_Light_and_Dark_UI_Mockup_5df4cb50.png', videoUrl: '', mediaMode: 'simulation', badgeText: 'Real-Time Production Telemetry', integrityNotice: 'No local MP4 file bundled in repository. Displaying high-precision procedural motion simulation.', simulationLabel: 'Procedural Experience', playerLabel: 'Direct Video Player', exploreButtonText: 'Explore Verified Service Catalog', metrics: [{ label: 'Throughput', value: '400+ Returns/Wk', detail: 'Peak Q1 capacity' }, { label: 'Turnaround', value: '48h SLA', detail: 'Guaranteed review' }, { label: 'Zero Retention', value: 'SOC 2 Type II', detail: 'Encrypted VDI' }] }) },
    { sectionKey: 'data_flow', sectionType: 'DataFlowDiagram', title: 'Secure Data Flow', desc: 'Follow how documents move through our tax preparation workflow.', content: JSON.stringify(DEFAULT_DATA_FLOW) },
    { sectionKey: 'data_flow', sectionType: 'DataFlowDiagram', title: 'Secure Data Flow', desc: 'Follow how documents move through our tax preparation workflow.' },
    { sectionKey: 'financial_clarity', sectionType: 'FinancialClarityChapter', title: 'Financial Clarity & Compliance Certainty', desc: 'Transparent reporting and rigorous compliance audits.' },
    { sectionKey: 'human_expertise', sectionType: 'HumanExpertiseChapter', title: 'Seasoned Enrolled Agents & Senior CPAs', desc: 'Decades of combined technical tax and GAAP knowledge.' },
    { sectionKey: 'cpa_pipeline', sectionType: 'CpaCollaborationPipeline', title: 'Dedicated Offshore Capacity for CPA Firms', desc: 'Secure, white-label staffing and preparation capacity.' },
    { sectionKey: 'editorial_insights', sectionType: 'EditorialInsightsChapter', title: 'Dispatches & Regulatory Analyses', desc: 'Insights on IRS policy and state tax adjustments.' },
    { sectionKey: 'closing_cta', sectionType: 'CinematicClosingChapter', title: 'Schedule Your Confidential Strategic Consultation', desc: 'Engage with our senior partners today.' },
  ],
  about: [
    { sectionKey: 'hero', sectionType: 'AboutHero', title: 'Integrity, Precision, and Institutional Trust', desc: 'The history and vision of Preferred Tax Consultancy.', content: JSON.stringify({ eyebrow: 'Firm Integrity & Leadership', hero_stats: [{ icon: 'award', value: '15+', label: 'Years of excellence' }, { icon: 'users', value: '500+', label: 'Firms supported' }, { icon: 'shield', value: '99.8%', label: 'Accuracy standard' }], metric_operational_quality: { label: 'Operational quality', value: '99.8%', icon: 'trending-up', barCount: 7, barHeights: [35, 57, 42, 72, 56, 92, 100], animationSpeed: '1.3s', barColor: '#63f2e8', barColorEnd: '#218f98', showBars: true }, chart_about_performance: { displayMode: 'chart', title: 'Financial Performance Trend', subtitle: 'Quarterly Volume vs Advisory Value vs Turnaround SLA', chartType: 'line', dataPoints: [{ label: 'Q1', value: 850 }, { label: 'Q2', value: 1100 }, { label: 'Q3', value: 920 }, { label: 'Q4', value: 1450 }], mediaUrl: '', altText: 'Financial Performance Trend' } }) },
    { sectionKey: 'firm_story', sectionType: 'FirmStory', title: 'Built by Tax Specialists for Modern Complexities', desc: 'From boutique practice to full-scale accounting advisory.' },
    { sectionKey: 'values', sectionType: 'FirmValues', title: 'Our Core Tenets & Professional Standards', desc: 'Absolute compliance, discretion, and proactive optimization.', content: JSON.stringify({ pillars: [{ number: '01', title: '99.8% Accuracy Standard', description: 'Every tax return, journal entry, and workpaper undergoes a multi-layer diagnostic review by senior Enrolled Agents and licensed CPAs prior to partner delivery.', icon: 'shield', accent: 'teal', tag: 'Review-led delivery' }, { number: '02', title: 'SOC 2 & ISO 27001 Security', description: 'We operate strictly within your existing cloud environments via secure tunnels and strict NDA confidentiality protocols.', icon: 'lock', accent: 'gold', tag: 'Security-first workflows' }, { number: '03', title: 'Dedicated Talent Pods', description: 'Dedicated accountants learn your firm’s chart of accounts, workpaper conventions, and review style.', icon: 'users', accent: 'teal', tag: 'People who know your process' }, { number: '04', title: 'Time-Zone Acceleration', description: 'Follow-the-sun support keeps peer-reviewed workpapers ready for partner sign-off.', icon: 'globe', accent: 'gold', tag: 'Follow-the-sun support' }] }) },
    { sectionKey: 'quality_snapshot', sectionType: 'QualitySnapshot', title: 'Quality & performance snapshot', desc: 'Clear review stages and measurable standards support partner confidence.' },
    { sectionKey: 'cta', sectionType: 'AboutCta', title: 'Partner with Experienced Tax Professionals', desc: 'Start a conversation with our managing directors.', content: JSON.stringify({ buttonText: 'Schedule Strategic Consultation' }) },
  ],
  services: [
    { sectionKey: 'hero', sectionType: 'ServicesHero', title: 'Complete Practice Directory', desc: 'Comprehensive tax and accounting capabilities.' },
    { sectionKey: 'categories', sectionType: 'ServiceCategories', title: 'Client Categories', desc: 'Individual, Business, and CPA Firm offerings.', content: JSON.stringify({ labels: { all: 'All Practices', individual: 'Individual & Family', business: 'Business & Corporate', cpa: 'CPA Firm Capacity' } }) },
    { sectionKey: 'services_grid', sectionType: 'AllServicesGrid', title: 'All Available Practice Offerings', desc: 'Select any service for details and deliverables.', content: JSON.stringify({ searchPlaceholder: 'Search practices, deliverables, forms...', emptyStateHeading: 'No services matched', emptyStateSubtext: 'Try searching for 1040, 1120-S, bookkeeping, reconciliation, or audit.', resetButtonText: 'Reset Filters', exploreButtonText: 'Explore Service' }) },
  ],
  'cpa-outsourcing': [
    { sectionKey: 'hero', sectionType: 'CpaHero', title: 'Dedicated Offshore Accounting Capacity', desc: 'Scale your accounting practice without overhead burdens.', content: JSON.stringify({ eyebrow: 'CPA Practice Capacity Scaling', primaryButtonText: 'Explore outsourcing', secondaryButtonText: 'View all capabilities', proof1Title: 'Quality-first', proof1Description: 'Diagnostic reviews', proof2Title: 'Reliable turnaround', proof2Description: 'Deadline-focused delivery', proof3Title: 'Secure workflows', proof3Description: 'Confidential by design' }) },
    { sectionKey: 'overview', sectionType: 'CpaOutsourcingOverview', title: 'How CPA Outsourcing Works', desc: 'Seamless integration with your tax software and workflow.' },
    { sectionKey: 'software_stack', sectionType: 'SoftwareStack', title: 'Fits your existing tech stack', desc: 'Native compatibility with your firm’s tax, accounting, and payroll tools.', content: JSON.stringify({ items: DEFAULT_CPA_SOFTWARE }) },
    { sectionKey: 'offerings', sectionType: 'CpaOfferings', title: 'The 10 Core CPA Firm Offerings', desc: 'Select a specialized capability to review the workflow or reserve production capacity.' },
    { sectionKey: 'timeline', sectionType: 'DeliveryTimeline', title: 'From intake to delivery', desc: 'A structured workflow keeps deadlines visible and reviews consistent.', content: JSON.stringify({ quarters: DEFAULT_TIMELINE, autoAdvance: false, cycleIntervalMs: 4500 }) },
    { sectionKey: 'data_flow', sectionType: 'SecureDataFlow', title: 'Connected data. Controlled handoffs.', desc: 'Visualize how source documents move through the production process.', content: JSON.stringify(DEFAULT_DATA_FLOW) },
    { sectionKey: 'cta', sectionType: 'CpaCta', title: 'Expand Your Firm Capacity Today', desc: 'Schedule an intake call with our outsourcing team.' },
  ],
  'hire-professionals': [
    { sectionKey: 'hero', sectionType: 'HireHero', title: 'Hire Dedicated Accounting Professionals', desc: 'Pre-vetted CPAs, EAs, and senior bookkeepers.', content: JSON.stringify({ eyebrow: 'Dedicated Staff Augmentation' }) },
    { sectionKey: 'professionals_grid', sectionType: 'HireProfessionalsGrid', title: 'Available Talent Profiles', desc: 'Inspect expertise, certifications, and availability.', content: JSON.stringify({ roles: DEFAULT_HIRE_ROLES }) },
    { sectionKey: 'cta', sectionType: 'HireProfessionalsCta', title: 'Interview Qualified Candidates Within 48 Hours', desc: 'Lock in top-tier accounting talent ahead of the busy season crunch. All candidates sign comprehensive bilateral NDAs and pass strict background verifications.', content: JSON.stringify({ subheading: '72-Hour Rapid Deployment', buttonText: 'Explore Open Roles' }) },
  ],
  'tax-resources': [
    { sectionKey: 'hero', sectionType: 'TaxResourcesHero', title: 'Tax Intelligence & Deadlines', desc: 'Critical IRS filing dates, thresholds, and calculators.', content: JSON.stringify({ eyebrow: 'Tax Intelligence Hub' }) },
    { sectionKey: 'estimator', sectionType: 'TaxEstimator', title: 'Interactive 2025 Federal Income Tax Estimator', desc: 'Based on official IRS Revenue Procedure 2024-40 inflation adjustments for Tax Year 2025.' },
    { sectionKey: 'deadlines', sectionType: 'TaxDeadlines', title: 'Key Statutory Deadlines', desc: 'Quarterly and annual tax compliance dates.', content: JSON.stringify({ items: DEFAULT_DEADLINES }) },
    { sectionKey: 'ledger', sectionType: 'AccountingLedger', title: 'Double Entry Ledger', desc: 'Accounting fundamentals and double-entry bookkeeping.' },
  ],
  blog: [
    { sectionKey: 'hero', sectionType: 'BlogHero', title: 'Editorial Dispatches & IRS Publications', desc: 'Authoritative tax updates from senior partners.', content: JSON.stringify({ eyebrow: 'Verified Industry Intelligence' }) },
    { sectionKey: 'posts_grid', sectionType: 'BlogPostsGrid', title: 'All Articles', desc: 'Explore all published perspectives.', content: JSON.stringify({ searchPlaceholder: 'Search articles…', readArticleLabel: 'Read article' }) },
  ],
  contact: [
    { sectionKey: 'hero', sectionType: 'ContactHero', title: 'Contact Our Advisory Leadership', desc: 'Direct communications with senior partners.', content: JSON.stringify({ eyebrow: 'DIRECT ADVISORY ACCESS' }) },
    { sectionKey: 'contact_form', sectionType: 'ContactForm', title: 'Direct Partner Inquiry', desc: 'Complete the details below for prompt review.', content: JSON.stringify({ eyebrow: 'START A CONVERSATION', nameLabel: 'Your Full Name', namePlaceholder: 'e.g. Sarah Jenkins, CPA', emailLabel: 'Work Email', emailPlaceholder: 'sjenkins@firmcpas.com', phoneLabel: 'Phone Number', phonePlaceholder: '(555) 000-0000', organizationLabel: 'Organization', organizationPlaceholder: 'Your firm or organization', inquiryTypeLabel: 'Client Classification', messageLabel: 'Scope Overview or Questions', messagePlaceholder: 'Describe your current volume, target software stack, or specific tax objectives...', privacyText: 'Confidentiality Protected by Mutual NDA', submitText: 'Submit Inquiry', submittingText: 'Submitting...', unavailableText: 'Submissions Unavailable' }) },
  ],
  'book-consultation': [
    { sectionKey: 'hero', sectionType: 'ConsultationHero', title: 'Book a Strategic Consultation', desc: 'Reserve a confidential session with a CPA or EA.', content: JSON.stringify({ badge: 'Executive Consultation Scheduling' }) },
    { sectionKey: 'booking_form', sectionType: 'BookingForm', title: 'Consultation Scheduler', desc: 'Select your service domain and timing.' },
    { sectionKey: 'trust_pillars', sectionType: 'BookingTrustPillars', title: 'What to expect', desc: 'A responsive, confidential, and practical consultation experience.', content: JSON.stringify({ items: [{ title: '24-Hour Partner Response', description: 'Every booking request is evaluated by a senior practice director within one business day with proposed meeting slots.' }, { title: 'Strict Non-Disclosure (NDA)', description: 'All discussions and shared firm documents are strictly confidential, governed by institutional non-disclosure standards.' }, { title: 'Zero Pressure Discovery', description: 'Our consultations focus on feasibility, staffing bandwidth, software compatibility, and cost-benefit analysis.' }] }) },
  ],
  'tax-calculator': [
    { sectionKey: 'hero', sectionType: 'CalculatorHero', title: 'Federal & State Tax Calculator', desc: 'Estimate effective tax burdens and potential savings.', content: JSON.stringify({ eyebrow: 'Federal & State Tax Calculator' }) },
    { sectionKey: 'calculator', sectionType: 'TaxCalculator', title: 'Interactive Estimator', desc: 'Input income and deductions for immediate estimations.' },
  ],
};

const CATEGORIES = [
  { name: 'Individual / Family', slug: 'individual', description: 'Personal tax compliance and family wealth protection' },
  { name: 'Company / Business', slug: 'business', description: 'Corporate entity structuring, compliance and bookkeeping' },
  { name: 'CPA Firm', slug: 'cpa', description: 'Dedicated offshore tax and accounting capacity' },
];

async function seed() {
  console.log('🌱 Starting comprehensive database seed...');

  // 1. Categories
  for (const cat of CATEGORIES) {
    const existing = await prisma.servicecategory.findUnique({ where: { slug: cat.slug } });
    if (!existing) {
      await prisma.servicecategory.create({
        data: {
          id: uuidv4(),
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          isEnabled: true,
        },
      });
      console.log(`  ✓ Service Category: ${cat.name}`);
    }
  }

  const individualCat = await prisma.servicecategory.findUnique({ where: { slug: 'individual' } });
  const businessCat = await prisma.servicecategory.findUnique({ where: { slug: 'business' } });
  const cpaCat = await prisma.servicecategory.findUnique({ where: { slug: 'cpa' } });

  // 2. Initial Services
  const SAMPLE_SERVICES = [
    { slug: 'individual-tax-prep', name: 'Individual Tax Preparation', catId: individualCat?.id, shortDesc: 'Comprehensive Federal & State Form 1040 filing, maximizing standard & itemized deductions.', fullDesc: 'Our seasoned tax specialists review your W-2s, 1099s, investment dividends, capital gains, and real estate income to ensure 100% compliance while claiming every eligible credit.' },
    { slug: 'family-tax-planning', name: 'Family Tax Planning', catId: individualCat?.id, shortDesc: 'Multi-generational tax minimization, child tax credits, education 529 plans & estate protection.', fullDesc: 'Proactive year-round tax roadmap designed to protect family wealth, optimize dependent credits, structure college savings, and minimize generational gift transfer taxes.' },
    { slug: 'business-tax-preparation', name: 'Business Tax Preparation', catId: businessCat?.id, shortDesc: 'Accurate Federal & State tax compliance for Form 1120 (C-Corp), 1120-S (S-Corp), and 1065 (LLC/Partnership).', fullDesc: 'Rigorous multi-tier tax return preparation accounting for depreciation schedules, Section 179 expenses, R&D credits, shareholder compensation, and state apportionment.' },
    { slug: 'tax-prep-outsourcing', name: 'Tax Preparation Outsourcing', catId: cpaCat?.id, shortDesc: 'High-volume Federal & multi-state tax return preparation for CPA firms during busy seasons and year-round.', fullDesc: 'Our trained offshore tax preparers handle 1040, 1120, 1120-S, and 1065 returns directly inside your firm software following your exact workpaper standards.' },
  ];

  for (const s of SAMPLE_SERVICES) {
    if (!s.catId) continue;
    const existing = await prisma.service.findUnique({ where: { slug: s.slug } });
    if (!existing) {
      await prisma.service.create({
        data: {
          id: uuidv4(),
          slug: s.slug,
          name: s.name,
          categoryId: s.catId,
          shortDescription: s.shortDesc,
          fullDescription: s.fullDesc,
          ctaText: 'Schedule Consultation',
          ctaUrl: `/book-consultation?service=${s.slug}`,
          isPublished: true,
          displayOrder: 1,
        },
      });
      console.log(`  ✓ Service: ${s.name}`);
    }
  }

  // 3. Pages & Sections
  for (const p of PAGES) {
    let page = await prisma.websitepage.findUnique({ where: { slug: p.slug } });
    if (!page) {
      page = await prisma.websitepage.create({
        data: {
          id: uuidv4(),
          slug: p.slug,
          title: p.title,
          description: p.description,
          status: p.status,
          type: 'standard',
          publishedAt: new Date(),
        },
      });
      console.log(`  ✓ Page: ${p.title}`);
    }

    // Sections
    const sections = PAGE_SECTIONS[p.slug] || [];
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      const existingSec = await prisma.pagesection.findFirst({
        where: { pageId: page.id, sectionKey: s.sectionKey },
      });
      if (!existingSec) {
        await prisma.pagesection.create({
          data: {
            id: uuidv4(),
            pageId: page.id,
            sectionKey: s.sectionKey,
            sectionType: s.sectionType,
            title: s.title,
            description: s.desc,
            content: s.content,
            displayOrder: i,
            isEnabled: true,
          },
        });
      } else if (s.content && isUninitializedContent(existingSec.content)) {
        await prisma.pagesection.update({
          where: { id: existingSec.id },
          data: { content: s.content },
        });
      }
    }
  }

  // 4. Blog Category & Sample Post
  let blogCat = await prisma.blogcategory.findFirst();
  if (!blogCat) {
    blogCat = await prisma.blogcategory.create({
      data: {
        id: uuidv4(),
        name: 'Tax Strategy',
        slug: 'tax-strategy',
        description: 'Strategic tax guidance and regulatory updates',
        updatedAt: new Date(),
      },
    });
  }

  const existingPost = await prisma.blogpost.findUnique({ where: { slug: 'maximizing-section-199a-qbi-deduction' } });
  if (!existingPost) {
    await prisma.blogpost.create({
      data: {
        id: uuidv4(),
        slug: 'maximizing-section-199a-qbi-deduction',
        title: 'The Executive Guide to Maximizing the Section 199A Qualified Business Income Deduction',
        excerpt: 'A comprehensive proprietary breakdown on how pass-through entities, LLCs, and S-Corps capture the full 20% QBI deduction.',
        content: 'Section 199A of the Internal Revenue Code permits non-corporate taxpayers a deduction equal to up to 20% of their Qualified Business Income (QBI)...',
        categoryId: blogCat.id,
        authorName: 'David Vance, CPA',
        authorRole: 'Managing Director, Tax Advisory',
        readTime: '5 min read',
        isPublished: true,
        updatedAt: new Date(),
      },
    });
    console.log('  ✓ Sample Blog Post created');
  }

  console.log('✅ Seeding complete!');
  await prisma.$disconnect();
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
});
