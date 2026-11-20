"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function () { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function (o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.importFrontendContent = importFrontendContent;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const prisma = new client_1.PrismaClient();
// Absolute paths to frontend content data
const FRONTEND_DIR = path.resolve(__dirname, '../../frontend');
const BLOG_DATA_PATH = path.join(FRONTEND_DIR, 'src/data/blog.ts');
const SERVICES_DATA_PATH = path.join(FRONTEND_DIR, 'src/data/services.ts');
async function importFrontendContent() {
    console.log('====================================================');
    console.log('Starting Complete Frontend Content Extraction & Sync');
    console.log('====================================================');
    const report = {
        pagesImported: 0,
        sectionsImported: 0,
        sectionsUpdated: 0,
        categoriesImported: 0,
        servicesImported: 0,
        servicesUpdated: 0,
        blogPostsImported: 0,
        mediaAssetsImported: 0,
        seoRecordsImported: 0,
        skipped: 0,
        errors: [],
    };
    try {
        // ----------------------------------------------------
        // 1. IMPORT & SYNC BLOG CATEGORIES & POSTS
        // ----------------------------------------------------
        console.log('\n[1/5] Extracting & Importing Blog Data...');
        const blogCategories = [
            { name: 'Tax Strategy', slug: 'tax-strategy', description: 'Strategic tax guidance and regulatory updates' },
            { name: 'CPA Outsourcing', slug: 'cpa-outsourcing', description: 'Offshore capacity and practice scaling insights' },
            { name: 'IRS Regulations', slug: 'irs-regulations', description: 'IRS bulletins, compliance and legal changes' },
            { name: 'Corporate Accounting', slug: 'corporate-accounting', description: 'Corporate structuring, PTET and state taxes' },
            { name: 'Small Business', slug: 'small-business', description: 'Tax optimization and compliance for growing businesses' },
        ];
        const categoryMap = new Map();
        for (const cat of blogCategories) {
            let existingCat = await prisma.blogcategory.findUnique({ where: { slug: cat.slug } });
            if (!existingCat) {
                existingCat = await prisma.blogcategory.create({
                    data: {
                        id: (0, uuid_1.v4)(),
                        name: cat.name,
                        slug: cat.slug,
                        description: cat.description,
                        updatedAt: new Date(),
                    },
                });
                report.categoriesImported++;
            }
            categoryMap.set(cat.name, existingCat.id);
            categoryMap.set(cat.slug, existingCat.id);
        }
        // Read BLOG_POSTS from frontend/src/data/blog.ts
        if (fs.existsSync(BLOG_DATA_PATH)) {
            const blogCode = fs.readFileSync(BLOG_DATA_PATH, 'utf8');
            // Real blog post records extracted verbatim from frontend/src/data/blog.ts
            const blogPosts = [
                {
                    slug: 'irs-inflation-adjustments-2025',
                    title: 'IRS Releases Tax Inflation Adjustments for Tax Year 2025 (IR-2024-273)',
                    excerpt: 'The Internal Revenue Service announced annual inflation adjustments for more than 60 tax provisions, including the standard deduction and tax rate schedules for individual taxpayers.',
                    content: 'The Internal Revenue Service announced annual inflation adjustments for more than 60 tax provisions, including the standard deduction and tax rate schedules for individual taxpayers for Tax Year 2025. Standard deduction amounts for married couples filing jointly increase to $30,000, while single taxpayers see an adjustment to $15,000.',
                    category: 'IRS Regulations',
                    publishedAt: new Date('2024-10-22'),
                    readTime: '6 min read',
                    authorName: 'Internal Revenue Service',
                    authorRole: 'Official Newsroom Release',
                    authorAvatar: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=120&auto=format&fit=crop&q=80',
                    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80',
                    featured: true,
                },
                {
                    slug: 'accounting-firms-offshore-talent-strategy',
                    title: 'How Accounting Practices Navigate Staffing Shortages with Strategic Outsourcing',
                    excerpt: 'As public accounting firms confront an unprecedented talent deficit, top managing partners are modernizing workflows by integrating dedicated offshore teams for seasonal compliance surges.',
                    content: 'As public accounting firms confront an unprecedented talent deficit, top managing partners are modernizing workflows by integrating dedicated offshore teams for seasonal compliance surges. By establishing dedicated teams abroad, practices maintain 48-hour turnarounds during peak quarters without burning out core domestic advisory staff.',
                    category: 'CPA Outsourcing',
                    publishedAt: new Date('2024-11-14'),
                    readTime: '8 min read',
                    authorName: 'Journal of Accountancy',
                    authorRole: 'Practice Management Editorial',
                    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
                    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
                    featured: true,
                },
                {
                    slug: 'aicpa-top-tax-priorities-for-firms',
                    title: 'AICPA Tax Section: Key Compliance Updates and Technology Adoption Guidelines',
                    excerpt: 'An authoritative review of multi-state nexus thresholds, corporate alternative minimum taxes, and standard operating procedures for secure client data sharing.',
                    content: 'An authoritative review of multi-state nexus thresholds, corporate alternative minimum taxes, and standard operating procedures for secure client data sharing across modern cloud workpaper suites.',
                    category: 'Tax Strategy',
                    publishedAt: new Date('2024-12-05'),
                    readTime: '7 min read',
                    authorName: 'AICPA Insights',
                    authorRole: 'Tax Policy Division',
                    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
                    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
                    featured: false,
                },
                {
                    slug: '2025-state-business-tax-climate-index',
                    title: 'Tax Foundation: 2025 State Business Tax Climate Index and Analysis',
                    excerpt: 'How state corporate income tax reforms, pass-through entity taxes (PTET), and franchise obligations are altering corporate site selection and entity formation nationwide.',
                    content: 'How state corporate income tax reforms, pass-through entity taxes (PTET), and franchise obligations are altering corporate site selection and entity formation nationwide.',
                    category: 'Corporate Accounting',
                    publishedAt: new Date('2025-01-10'),
                    readTime: '10 min read',
                    authorName: 'Tax Foundation',
                    authorRole: 'Center for State Tax Policy',
                    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
                    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
                    featured: false,
                },
                {
                    slug: 'maximizing-section-199a-qbi-deduction',
                    title: 'The Executive Guide to Maximizing the Section 199A Qualified Business Income Deduction',
                    excerpt: 'A comprehensive proprietary breakdown from our senior tax directors on how pass-through entities, LLCs, and S-Corps can legally capture the full 20% QBI deduction without triggering SSTB phaseouts.',
                    content: `Section 199A of the Internal Revenue Code permits non-corporate taxpayers a deduction equal to up to 20% of their Qualified Business Income (QBI) from a qualified trade or business operated as a sole proprietorship, partnership, or S-corporation.

However, high earners in Specified Service Trades or Businesses (SSTBs)—such as healthcare providers, law firms, consultants, and financial managers—frequently fall into statutory phaseout zones where the deduction diminishes rapidly.

In this proprietary technical advisory, Preferred Tax Consultancy outlines three defensible structures our clients utilize:
1. Wage and Property Optimization: Re-balancing W-2 reasonable compensation against depreciable unadjusted basis immediately after acquisition (UBIA).
2. Entity Bifurcation: Segregating administrative and intellectual property assets into non-SSTB operating subsidiaries with clear commercial economic substance.
3. Defined Benefit Pension Stacking: Utilizing IRS-approved cash balance plans to deliberately lower taxable income below statutory threshold limits.

Consult with our senior tax advisory partners to model your specific entity pass-through calculations.`,
                    category: 'Tax Strategy',
                    publishedAt: new Date('2025-02-18'),
                    readTime: '5 min read',
                    authorName: 'David Vance, CPA',
                    authorRole: 'Managing Director, Tax Advisory',
                    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
                    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
                    featured: false,
                },
                {
                    slug: 'busy-season-workpaper-standardization-handbook',
                    title: 'Standardizing Workpapers for Hybrid Domestic & Offshore CPA Teams',
                    excerpt: 'How boutique CPA firms achieve 40% higher realization rates during peak filing quarters by deploying standardized tickmarks, PBC checklists, and 48-hour SLA turnarounds.',
                    content: `When managing a blend of onshore engagement partners and offshore tax preparers, operational friction rarely stems from technical competence—it stems from inconsistent workpaper hygiene.

Our proven five-pillar standardization framework includes:
1. Unified Indexing: Consistent lead sheet structures across 1040, 1120-S, and 1065 binders.
2. Mandatory Tickmark Conventions: Color-coded audit and mathematical validation marks with explicit cross-references.
3. Automated PBC Portals: Instant notification triggers when clients upload unreadable W-2 scans or missing 1099-B statements.
4. Two-Tier Review Hierarchy: First-pass technical diagnostic clearance by an offshore senior accountant followed by high-level partner advisory review.
5. Strict 24-48 Hour SLA Tracking: Dashboard accountability ensuring returns never stall in review limbo.`,
                    category: 'CPA Outsourcing',
                    publishedAt: new Date('2025-03-02'),
                    readTime: '6 min read',
                    authorName: 'Sarah Chen, EA',
                    authorRole: 'Director of Outsourcing Solutions',
                    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
                    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&auto=format&fit=crop&q=80',
                    featured: false,
                },
                {
                    slug: 'navigating-section-174-rd-amortization',
                    title: 'Navigating IRS Section 174 R&D Amortization Rules for Software & Tech Firms',
                    excerpt: 'An in-depth analysis of mandatory capitalization and amortization rules for domestic versus foreign research and experimental expenditures under recent tax code updates.',
                    content: 'An in-depth analysis of mandatory capitalization and amortization rules for domestic versus foreign research and experimental expenditures under recent tax code updates, providing actionable strategies for software companies and tech-enabled businesses.',
                    category: 'Tax Strategy',
                    publishedAt: new Date('2025-03-15'),
                    readTime: '7 min read',
                    authorName: 'Michael Sterling, CPA',
                    authorRole: 'Principal, Corporate Tax',
                    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
                    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
                    featured: false,
                },
                {
                    slug: 'maximizing-state-savings-ptet-elections',
                    title: 'Maximizing State Tax Savings Through Pass-Through Entity Tax (PTET) Elections',
                    excerpt: 'How partnerships and S-corporations bypass the $10,000 SALT deduction cap by paying state-level income taxes at the entity level and securing federal business deductions.',
                    content: 'How partnerships and S-corporations bypass the $10,000 SALT deduction cap by paying state-level income taxes at the entity level and securing federal business deductions for high-bracket equity partners.',
                    category: 'Corporate Accounting',
                    publishedAt: new Date('2025-04-02'),
                    readTime: '8 min read',
                    authorName: 'Elena Rostova, EA',
                    authorRole: 'Senior State Tax Director',
                    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
                    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
                    featured: false,
                },
                {
                    slug: 'irs-publication-4557-cpa-cybersecurity-standards',
                    title: 'IRS Publication 4557: Essential Cybersecurity Standards for Modern CPA Practices',
                    excerpt: 'Safeguarding client data against sophisticated tax season phishing and ransomware attacks with mandatory safeguards, multi-factor authentication, and encrypted workpaper vaults.',
                    content: 'Safeguarding client data against sophisticated tax season phishing and ransomware attacks with mandatory safeguards, multi-factor authentication, and encrypted workpaper vaults under IRS Publication 4557 compliance mandates.',
                    category: 'CPA Outsourcing',
                    publishedAt: new Date('2025-04-20'),
                    readTime: '6 min read',
                    authorName: 'Marcus Thorne',
                    authorRole: 'Chief Information Security Officer',
                    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
                    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
                    featured: false,
                },
            ];
            for (const post of blogPosts) {
                const catId = categoryMap.get(post.category) || Array.from(categoryMap.values())[0];
                const existing = await prisma.blogpost.findUnique({ where: { slug: post.slug } });
                if (!existing) {
                    await prisma.blogpost.create({
                        data: {
                            id: (0, uuid_1.v4)(),
                            slug: post.slug,
                            title: post.title,
                            excerpt: post.excerpt,
                            content: post.content,
                            categoryId: catId,
                            categoryName: post.category,
                            publishedAt: post.publishedAt,
                            readTime: post.readTime,
                            authorName: post.authorName,
                            authorRole: post.authorRole,
                            authorAvatar: post.authorAvatar,
                            image: post.image,
                            featured: post.featured,
                            isPublished: true,
                            metaTitle: post.title,
                            metaDescription: post.excerpt,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                    });
                    report.blogPostsImported++;
                    console.log(`  ✓ Imported blog post: ${post.title}`);
                }
                else {
                    report.skipped++;
                }
            }
        }
        // ----------------------------------------------------
        // 2. IMPORT ALL 20 SERVICES FROM SERVICES_CATALOG
        // ----------------------------------------------------
        console.log('\n[2/5] Extracting & Importing All 20 Services...');
        // Service categories mapping
        const srvCatMap = new Map();
        const existingCats = await prisma.servicecategory.findMany();
        for (const c of existingCats) {
            srvCatMap.set(c.slug, c.id);
        }
        // All 20 services from frontend/src/data/services.ts
        const ALL_SERVICES = [
            // Individual (4)
            {
                slug: 'individual-tax-prep',
                name: 'Individual Tax Preparation',
                categorySlug: 'individual',
                shortDescription: 'Comprehensive Federal & State Form 1040 filing, maximizing standard & itemized deductions.',
                fullDescription: 'Our seasoned tax specialists review your W-2s, 1099s, investment dividends, capital gains, and real estate income to ensure 100% compliance while claiming every eligible credit.',
                ctaText: 'Book Individual Tax Prep',
                ctaUrl: '/book-consultation?category=individual&service=individual-tax-prep',
                displayOrder: 1,
                deliverables: ['Form 1040 Federal & State', 'Schedule A, B, C, D & E Filings', 'E-file Confirmation', 'Prior Year Comparison'],
                features: [
                    { title: 'Multi-State Nexus Review', desc: 'Seamlessly allocate income and withholding across state jurisdictions for remote and relocated workers.' },
                    { title: 'Capital Gains & Crypto Audit', desc: 'Accurate reconciliation of 1099-B brokerage summaries, staking rewards, and real estate 1031 exchanges.' },
                ],
            },
            {
                slug: 'family-tax-planning',
                name: 'Family Tax Planning & Wealth Preservation',
                categorySlug: 'individual',
                shortDescription: 'Multi-generational estate structuring, gift tax compliance, and education savings optimization.',
                fullDescription: 'Proactive estate, gift, and wealth transfer planning ensuring family assets are shielded from excessive estate taxation while funding 529 plans and trust vehicles.',
                ctaText: 'Protect Family Wealth',
                ctaUrl: '/book-consultation?category=individual&service=family-tax-planning',
                displayOrder: 2,
                deliverables: ['Estate & Gift Tax Modeling', '529 Plan Contribution Analysis', 'Trust Tax Filings', 'Asset Transfer Strategy'],
                features: [
                    { title: 'Dynasty Trust Guidance', desc: 'Long-term tax mitigation through generation-skipping trusts and irrevocable gift structures.' },
                ],
            },
            {
                slug: 'personal-tax-consultation',
                name: 'Strategic Personal Tax Consultation',
                categorySlug: 'individual',
                shortDescription: 'One-on-one advisory sessions with a Senior Enrolled Agent or licensed CPA to optimize your tax position.',
                fullDescription: 'Targeted advisory addressing stock options (ISO/RSU/ESPP), sudden wealth events, real estate 1031 exchanges, and multi-state relocation implications.',
                ctaText: 'Schedule Consultation',
                ctaUrl: '/book-consultation?category=individual&service=personal-tax-consultation',
                displayOrder: 3,
                deliverables: ['Written Tax Strategy Blueprint', 'Scenario Comparison Matrix', 'Estimated Tax Payment Voucher Set', '60-Min Partner Consultation'],
                features: [
                    { title: 'Equity Compensation Modeling', desc: 'Precise tax forecasting for AMT triggers on ISO exercises and capital gain harvesting strategies.' },
                ],
            },
            {
                slug: 'irs-assistance',
                name: 'IRS Notice Resolution & Representation',
                categorySlug: 'individual',
                shortDescription: 'Defending taxpayers against CP2000 letters, audit notifications, and penalty assessments.',
                fullDescription: 'Experienced Enrolled Agents handle bilateral communication directly with the IRS and state departments of revenue to secure penalty abatement and resolve audits.',
                ctaText: 'Resolve IRS Issues',
                ctaUrl: '/book-consultation?category=individual&service=irs-assistance',
                displayOrder: 4,
                deliverables: ['Power of Attorney Representation', 'Transcript Analysis Report', 'Penalty Abatement Request', 'Notice Response Workpapers'],
                features: [
                    { title: 'Direct IRS Representation', desc: 'We act as your authorized representative before the IRS under Form 2848 Power of Attorney.' },
                ],
            },
            // Business (6)
            {
                slug: 'business-tax-preparation',
                name: 'Business Entity Tax Preparation',
                categorySlug: 'business',
                shortDescription: 'Corporate Form 1120, S-Corp 1120-S, and Partnership Form 1065 compliance with multi-tier K-1 generation.',
                fullDescription: 'We prepare corporate tax returns with exhaustive balance sheet and Schedule M-1/M-3 book-to-tax reconciliations, ensuring full compliance.',
                ctaText: 'File Business Returns',
                ctaUrl: '/book-consultation?category=business&service=business-tax-preparation',
                displayOrder: 5,
                deliverables: ['Form 1120 / 1120-S / 1065', 'Schedule K-1 Allocations', 'Schedule M-1 / M-3 Reconciliation', 'State Franchise Filings'],
                features: [
                    { title: 'Book-to-Tax Reconciliations', desc: 'Thorough examination of GAAP net income versus taxable income to identify permanent and timing differences.' },
                ],
            },
            {
                slug: 'accounting-services',
                name: 'Full-Cycle Corporate Accounting',
                categorySlug: 'business',
                shortDescription: 'End-to-end accounting supervision, monthly closing, and financial oversight for growing enterprises.',
                fullDescription: 'From chart of accounts architecture to accrual-basis month-end closing, we provide CFO-level financial visibility and audit-ready workpapers.',
                ctaText: 'Streamline Accounting',
                ctaUrl: '/book-consultation?category=business&service=accounting-services',
                displayOrder: 6,
                deliverables: ['Monthly Trial Balance', 'Accrual Schedules', 'Bank & Card Reconciliations', 'Management Reporting Pack'],
                features: [
                    { title: 'GAAP Accrual Accounting', desc: 'Proper recognition of revenue, prepaid expenses, and deferred liabilities for audit readiness.' },
                ],
            },
            {
                slug: 'bookkeeping',
                name: 'Precision Cloud Bookkeeping',
                categorySlug: 'business',
                shortDescription: 'Daily transaction recording, bank reconciliations, and clean ledger maintenance in QuickBooks Online or Xero.',
                fullDescription: 'Keep your books impeccably balanced and tax-ready all year long with disciplined cloud bookkeeping.',
                ctaText: 'Start Bookkeeping',
                ctaUrl: '/book-consultation?category=business&service=bookkeeping',
                displayOrder: 7,
                deliverables: ['Reconciled Bank & Credit Card Feeds', 'Clean General Ledger', 'Accounts Payable/Receivable Aging', 'Monthly Balance Sheet'],
                features: [
                    { title: 'Real-Time Bank Feeds', desc: 'Automated daily reconciliation of operating, payroll, and merchant processing accounts.' },
                ],
            },
            {
                slug: 'payroll-management',
                name: 'Payroll Management & Compliance',
                categorySlug: 'business',
                shortDescription: 'Automated multi-state payroll processing, direct deposit, and quarterly Form 941/940 payroll tax filings.',
                fullDescription: 'Flawless payroll execution across all 50 states with automatic tax deposits, new-hire reporting, and year-end W-2/1099 distribution.',
                ctaText: 'Manage Payroll',
                ctaUrl: '/book-consultation?category=business&service=payroll-management',
                displayOrder: 8,
                deliverables: ['Bi-Weekly/Semi-Monthly Payroll Runs', 'Quarterly Form 941 Filings', 'Annual Form 940 & W-2s', 'State Unemployment Compliance'],
                features: [
                    { title: 'Multi-State Tax Withholding', desc: 'Accurate state and local tax withholding based on remote employee work locations.' },
                ],
            },
            {
                slug: 'financial-reporting',
                name: 'Financial Reporting & KPI Dashboards',
                categorySlug: 'business',
                shortDescription: 'Executive-level financial statements, margin analytics, cash flow forecasting, and KPI performance scorecards.',
                fullDescription: 'Transform raw accounting ledgers into decision-grade executive intelligence with custom dashboards and trend analysis.',
                ctaText: 'Get Financial Reports',
                ctaUrl: '/book-consultation?category=business&service=financial-reporting',
                displayOrder: 9,
                deliverables: ['Income Statement & Balance Sheet', 'Statement of Cash Flows', 'Gross Margin Analysis Memo', 'Interactive KPI Dashboard'],
                features: [
                    { title: 'Comparative Financial Statements', desc: 'Period-over-period and budget-vs-actual variance reporting with executive commentary.' },
                ],
            },
            {
                slug: 'business-tax-planning',
                name: 'Strategic Business Tax Planning',
                categorySlug: 'business',
                shortDescription: 'Proactive entity structuring, Section 199A QBI maximization, Section 179 depreciation, and R&D tax credit capture.',
                fullDescription: 'Custom tax mitigation strategies designed to preserve working capital, defer taxable gain, and maximize statutory deductions legally.',
                ctaText: 'Plan Business Taxes',
                ctaUrl: '/book-consultation?category=business&service=business-tax-planning',
                displayOrder: 10,
                deliverables: ['Annual Tax Optimization Roadmap', 'Cost Segregation Feasibility Study', 'Section 179 Expense Strategy', 'QBI Deduction Maximization Plan'],
                features: [
                    { title: 'Pass-Through Entity Tax (PTET)', desc: 'Bypass the federal SALT cap through state-level entity taxation elections.' },
                ],
            },
            // CPA Firm Outsourcing (10)
            {
                slug: 'tax-prep-outsourcing',
                name: 'Tax Preparation Outsourcing for CPAs',
                categorySlug: 'cpa',
                shortDescription: 'Dedicated offshore tax preparation pods handling 1040, 1120-S, and 1065 compliance directly inside your software.',
                fullDescription: 'Scale your accounting practice without hiring bottlenecks. Our dedicated offshore pods work inside UltraTax, Drake, ProConnect, or Axcess with two-tier review.',
                ctaText: 'Augment CPA Capacity',
                ctaUrl: '/book-consultation?category=cpa&service=tax-prep-outsourcing',
                displayOrder: 11,
                deliverables: ['Completed Return Workpapers', 'Standardized Tickmarked Binders', 'Diagnostic Clearing Sheet', 'Ready-for-Partner Signoff'],
                features: [
                    { title: 'Direct Cloud Software Access', desc: 'Our teams work via secure remote desktop or cloud instances inside your firm software.' },
                ],
            },
            {
                slug: 'bookkeeping-outsourcing',
                name: 'White-Label Bookkeeping Outsourcing',
                categorySlug: 'cpa',
                shortDescription: 'Outsourced bookkeeping infrastructure for CPA firms managing multiple client accounts simultaneously.',
                fullDescription: 'Deliver flawless bookkeeping to your entire firm roster with dedicated preparers working to your firm standardized procedures.',
                ctaText: 'Scale Firm Bookkeeping',
                ctaUrl: '/book-consultation?category=cpa&service=bookkeeping-outsourcing',
                displayOrder: 12,
                deliverables: ['Monthly Reconciled Ledgers', 'Exception Item Log', 'Trial Balance Clearance Memo', 'Client-Ready Deliverable Pack'],
                features: [
                    { title: 'Strict SOP Adherence', desc: 'We adopt your firm naming conventions, chart of accounts hierarchies, and review checklists.' },
                ],
            },
            {
                slug: 'accounting-outsourcing',
                name: 'Full-Scale Accounting Practice Augmentation',
                categorySlug: 'cpa',
                shortDescription: 'Enterprise-grade offshore accounting pods acting as seamless extensions of your domestic practice.',
                fullDescription: 'End-to-end accounting operations support providing mid-tier and regional CPA firms with scalable, dedicated offshore pods.',
                ctaText: 'Build Dedicated Pod',
                ctaUrl: '/book-consultation?category=cpa&service=accounting-outsourcing',
                displayOrder: 13,
                deliverables: ['Dedicated Staff Allocation', 'Daily Timesheet & Metric Reports', 'Multi-Level Quality Assurance', 'Partner-Level Coordination'],
                features: [
                    { title: 'Dedicated Full-Time Accountants', desc: 'Full-time dedicated staff assigned exclusively to your practice.' },
                ],
            },
            {
                slug: 'payroll-processing',
                name: 'White-Label Payroll Processing for Firms',
                categorySlug: 'cpa',
                shortDescription: 'Scalable payroll preparation and compliance service enabling accounting firms to offer payroll without administrative drag.',
                fullDescription: 'Outsource multi-state payroll mechanics, quarterly filings, and year-end reporting while maintaining direct partner-client relationships.',
                ctaText: 'Outsource Firm Payroll',
                ctaUrl: '/book-consultation?category=cpa&service=payroll-processing',
                displayOrder: 14,
                deliverables: ['Payroll Calculation Worksheets', 'Pre-Drafted Tax Deposit Vouchers', 'Quarterly Reconciliation Folders', 'W-2 / 1099 Generation Files'],
                features: [
                    { title: 'Automated Filing Preps', desc: 'Ready-to-transmit payroll returns prepared for partner approval.' },
                ],
            },
            {
                slug: 'audit-support',
                name: 'Audit Preparation & Workpaper Support',
                categorySlug: 'cpa',
                shortDescription: 'Technical workpaper preparation, lead schedule compilation, and sampling tie-outs for audit and review engagements.',
                fullDescription: 'Accelerate assurance engagements with offshore technical staff handling lead schedules, confirmation tracking, and test-of-details documentation.',
                ctaText: 'Accelerate Audit Support',
                ctaUrl: '/book-consultation?category=cpa&service=audit-support',
                displayOrder: 15,
                deliverables: ['Lead Schedule Binders', 'Bank & Debt Confirmation Summaries', 'Substantive Analytical Workpapers', 'Internal Control Walkthrough Drafts'],
                features: [
                    { title: 'Standardized Audit Indexing', desc: 'Uniform binder structures compatible with CCH Engagement, AdvanceFlow, and Thomson Reuters.' },
                ],
            },
            {
                slug: 'financial-statement-prep',
                name: 'Financial Statement Preparation (SSARS)',
                categorySlug: 'cpa',
                shortDescription: 'Compilation and preparation of GAAP-compliant balance sheets, income statements, and accompanying disclosures.',
                fullDescription: 'Comprehensive preparation of financial statements and footnotes in accordance with SSARS guidelines, ready for partner certification.',
                ctaText: 'Prepare Statements',
                ctaUrl: '/book-consultation?category=cpa&service=financial-statement-prep',
                displayOrder: 16,
                deliverables: ['Full GAAP Financial Statement Draft', 'Footnote Disclosure Binders', 'SSARS Review Checklists', 'Management Representation Letter Draft'],
                features: [
                    { title: 'Complete Footnote Drafting', desc: 'Pre-drafted technical footnotes tailored to client industry and GAAP standards.' },
                ],
            },
            {
                slug: 'tax-review-support',
                name: 'Senior Tax Review & Quality Assurance',
                categorySlug: 'cpa',
                shortDescription: 'Second-tier diagnostic tax reviews performed by senior offshore accountants to catch discrepancies before partner signoff.',
                fullDescription: 'Elevate realization rates and eliminate embarrassing revision cycles by adding an independent quality assurance review layer.',
                ctaText: 'Enhance Review Quality',
                ctaUrl: '/book-consultation?category=cpa&service=tax-review-support',
                displayOrder: 17,
                deliverables: ['Comprehensive Review Point Memo', 'Cross-Entity Discrepancy Log', 'Software Diagnostic Clearing Sheet', 'Partner-Ready Quality Certification'],
                features: [
                    { title: 'Zero-Tolerance Diagnostic Clearance', desc: 'Every calculation, carryover, and basis worksheet verified for absolute accuracy.' },
                ],
            },
            {
                slug: 'year-end-cleanup',
                name: 'Catch-Up & Year-End General Ledger Cleanup',
                categorySlug: 'cpa',
                shortDescription: 'Rapid multi-month reconciliation, suspense account liquidation, and opening balance restatement for messy client books.',
                fullDescription: 'Transform chaotic un-reconciled client ledgers into pristine, audit-ready balance sheets in days ahead of tax deadlines.',
                ctaText: 'Deploy Cleanup Squad',
                ctaUrl: '/book-consultation?category=cpa&service=year-end-cleanup',
                displayOrder: 18,
                deliverables: ['Suspense Account Liquidation Memo', 'Prior-Period Adjustment Schedule', 'Clean Year-End Trial Balance', 'Documented Reconciliation Folder'],
                features: [
                    { title: 'Suspense Account Clearing', desc: 'Identify, categorize, and reclassify misplaced transactions across all fiscal years.' },
                ],
            },
            {
                slug: 'write-up-services',
                name: 'Full Write-Up & After-the-Fact Payroll',
                categorySlug: 'cpa',
                shortDescription: 'Historical transaction reconstruction, manual journal entry posting, and after-the-fact payroll reconciliation.',
                fullDescription: 'Complete retrospective reconstruction of business ledgers for delinquent or multi-year non-filer engagements.',
                ctaText: 'Reconstruct Ledgers',
                ctaUrl: '/book-consultation?category=cpa&service=write-up-services',
                displayOrder: 19,
                deliverables: ['Restructured General Ledger', 'After-the-Fact Form 941 Reconciliation', 'Complete 1099-NEC/MISC Filing Set', 'Audit-Defensible Workpapers'],
                features: [
                    { title: 'Historical Ledger Reconstruction', desc: 'Rebuilding fiscal records from raw bank statements, canceled checks, and invoices.' },
                ],
            },
            {
                slug: 'dedicated-staff-augmentation',
                name: 'Dedicated Offshore Staff Augmentation',
                categorySlug: 'cpa',
                shortDescription: 'Hand-picked, dedicated full-time tax accountants and bookkeepers integrated directly into your firm Slack, email, and PM tools.',
                fullDescription: 'Hire dedicated, pre-vetted senior tax accountants and bookkeepers working exclusively for your practice under strict US data security protocols.',
                ctaText: 'Hire Dedicated Talent',
                ctaUrl: '/book-consultation?category=cpa&service=dedicated-staff-augmentation',
                displayOrder: 20,
                deliverables: ['Full-Time Dedicated Talent', 'Daily Time-Tracking & Metrics', 'SOC 2 Compliant Secure Workstations', 'Quarterly Performance Reviews'],
                features: [
                    { title: 'Direct Team Integration', desc: 'Your remote accountants attend firm standups, use your firm email, and work in your time zone.' },
                ],
            },
        ];
        for (const srv of ALL_SERVICES) {
            const catId = srvCatMap.get(srv.categorySlug) || Array.from(srvCatMap.values())[0];
            const existing = await prisma.service.findUnique({ where: { slug: srv.slug } });
            if (!existing) {
                await prisma.service.create({
                    data: {
                        id: (0, uuid_1.v4)(),
                        name: srv.name,
                        slug: srv.slug,
                        categoryId: catId,
                        shortDescription: srv.shortDescription,
                        fullDescription: srv.fullDescription,
                        ctaText: srv.ctaText,
                        ctaUrl: srv.ctaUrl,
                        displayOrder: srv.displayOrder,
                        isPublished: true,
                        publicationDate: new Date(),
                        deliverables: srv.deliverables,
                        features: srv.features,
                        seoTitle: `${srv.name} | Preferred Tax Consultancy`,
                        seoDescription: srv.shortDescription,
                    },
                });
                report.servicesImported++;
                console.log(`  ✓ Imported service: ${srv.name}`);
            }
            else {
                // Update shortDescription, fullDescription, deliverables, features to ensure full content
                await prisma.service.update({
                    where: { slug: srv.slug },
                    data: {
                        shortDescription: srv.shortDescription,
                        fullDescription: srv.fullDescription,
                        deliverables: srv.deliverables,
                        features: srv.features,
                    },
                });
                report.servicesUpdated++;
            }
        }
        // ----------------------------------------------------
        // 3. SYNC REAL CONTENT INTO ALL PAGE SECTIONS
        // ----------------------------------------------------
        console.log('\n[3/5] Updating Page Sections with Real Content from Components...');
        // Section real data dictionary from actual components
        const SECTION_REAL_DATA = {
            // Home page sections
            'hero': {
                title: 'Strategic Tax Advisory & Global Accounting Infrastructure',
                subheading: 'Preferred Tax Consultancy Group',
                description: 'Elite tax planning, corporate compliance, and dedicated offshore CPA capacity delivered with institutional precision and 24-hour continuous operational support.',
                content: JSON.stringify({
                    eyebrow: 'Verified Enrolled Agents & Senior CPAs',
                    primaryCtaText: 'Schedule Strategic Consultation',
                    primaryCtaUrl: '/book-consultation',
                    secondaryCtaText: 'Explore Service Catalog',
                    secondaryCtaUrl: '/services',
                    calculatorButtonText: 'Open 2025 Tax Calculator',
                    stats: [
                        { label: 'Accuracy Rate', value: '99.8%' },
                        { label: 'Partner Response SLA', value: '< 24 Hours' },
                        { label: 'Active States Covered', value: '50 States' },
                    ],
                }),
            },
            'services_showcase': {
                title: 'Core Practice Areas & Advisory Verticals',
                subheading: 'Specialized solutions for individuals, businesses, and CPA practices',
                description: 'Whether you require personal wealth tax shielding, corporate GAAP compliance, or firm capacity augmentation, explore our structured practice areas.',
                content: JSON.stringify({
                    categories: ['Individual / Family', 'Company / Business', 'CPA Firm Outsourcing'],
                    totalServicesCount: 20,
                }),
            },
            'financial_clarity': {
                title: 'Financial Clarity & Compliance Certainty',
                subheading: 'Transparent reporting and rigorous diagnostic audits',
                description: 'Eliminate tax season surprises with multi-layer review workflows, standardized tickmark workpapers, and continuous IRS regulation monitoring.',
                content: JSON.stringify({
                    checkpoints: [
                        'Automated 256-Bit Encrypted PBC Document Vault',
                        'Two-Tier Enrolled Agent Diagnostic Reviews',
                        'Zero-Error E-File Verification Safeguards',
                    ],
                }),
            },
            'human_expertise': {
                title: 'Seasoned Enrolled Agents & Senior CPAs',
                subheading: 'Decades of combined technical tax and GAAP knowledge',
                description: 'Our senior practice directors bring extensive Big Four and regional firm pedigree, ensuring your returns withstand rigorous IRS audit standards.',
            },
            'cpa_pipeline': {
                title: 'Dedicated Offshore Capacity for CPA Firms',
                subheading: 'White-label staffing and preparation capacity for accounting practices',
                description: 'Overcome acute public accounting talent shortages with dedicated offshore pods working directly inside your existing tax software environments.',
            },
            'editorial_insights': {
                title: 'Dispatches & Verified Regulatory Intelligence',
                subheading: 'Authoritative analysis on federal and state tax developments',
                description: 'Curated technical memos, IRS notices, and strategic practice management frameworks drafted by our senior partners and published authorities.',
            },
            'closing_cta': {
                title: 'Schedule Your Confidential Strategic Consultation',
                subheading: 'Direct access to senior advisory leadership',
                description: 'Engage with our managing directors to review your tax objectives or scale your practice capacity ahead of critical filing deadlines.',
                content: JSON.stringify({
                    phone: '+1 214 837 7128',
                    email: 'brian@smarttaxexpertss.com',
                    address: '5900 BALCONES DR STE 100 AUSTIN TX 78731-4298 USA',
                }),
            },
        };
        const sections = await prisma.pagesection.findMany();
        for (const section of sections) {
            const realData = SECTION_REAL_DATA[section.sectionKey];
            if (realData) {
                await prisma.pagesection.update({
                    where: { id: section.id },
                    data: {
                        title: realData.title || section.title,
                        subheading: realData.subheading || section.subheading,
                        description: realData.description || section.description,
                        content: realData.content || section.content,
                    },
                });
                report.sectionsUpdated++;
            }
        }
        // ----------------------------------------------------
        // 4. SEED PAGE SEO RECORDS
        // ----------------------------------------------------
        console.log('\n[4/5] Syncing Page SEO Records...');
        const pages = await prisma.websitepage.findMany();
        for (const page of pages) {
            const existingSeo = await prisma.pageseo.findUnique({ where: { pageId: page.id } });
            if (!existingSeo) {
                await prisma.pageseo.create({
                    data: {
                        id: (0, uuid_1.v4)(),
                        pageId: page.id,
                        metaTitle: `${page.title} | Preferred Tax Consultancy Group`,
                        metaDescription: page.description || `Preferred Tax Consultancy - Expert US tax and accounting services for ${page.title}.`,
                        canonicalUrl: `https://preferredtax.com${page.slug === 'home' ? '' : '/' + page.slug}`,
                        robotsIndex: true,
                        robotsFollow: true,
                        ogTitle: `${page.title} | Preferred Tax Consultancy`,
                        ogDescription: page.description || 'Enterprise tax planning and CPA outsourcing infrastructure.',
                        ogImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
                        twitterTitle: `${page.title} | Preferred Tax Consultancy`,
                        twitterDescription: page.description || 'Enterprise tax planning and CPA outsourcing infrastructure.',
                        sitemapPriority: page.slug === 'home' ? '1.0' : '0.8',
                        sitemapChange: 'weekly',
                    },
                });
                report.seoRecordsImported++;
                console.log(`  ✓ Created SEO record for page: ${page.title}`);
            }
        }
        // ----------------------------------------------------
        // 5. SEED MEDIA ASSETS IN MEDIA LIBRARY
        // ----------------------------------------------------
        console.log('\n[5/5] Registering Media Assets from Frontend...');
        const mediaFiles = [
            { filename: 'home-premium-bg.png', originalName: 'home-premium-bg.png', mimeType: 'image/png', size: 1858455, folder: 'backgrounds', altText: 'Home Hero Premium Ambient Office Background', storageLocation: '/dist/assets/home-premium-bg.png' },
            { filename: 'about-office-bg.png', originalName: 'about-office-bg.png', mimeType: 'image/png', size: 2234793, folder: 'backgrounds', altText: 'About Us Executive Headquarters Background', storageLocation: '/dist/assets/about-office-bg.png' },
            { filename: 'about-chart-bg.png', originalName: 'about-chart-bg.png', mimeType: 'image/png', size: 1738303, folder: 'backgrounds', altText: 'Financial Analytics Growth Chart Background', storageLocation: '/dist/assets/about-chart-bg.png' },
            { filename: 'cpa-outsourcing-office-bg.png', originalName: 'cpa-outsourcing-office-bg.png', mimeType: 'image/png', size: 2125220, folder: 'backgrounds', altText: 'CPA Outsourcing Global Infrastructure Background', storageLocation: '/dist/assets/cpa-outsourcing-office-bg.png' },
            { filename: 'hire-professionals-office-bg.png', originalName: 'hire-professionals-office-bg.png', mimeType: 'image/png', size: 2054329, folder: 'backgrounds', altText: 'Accounting Professionals Talent Vault Background', storageLocation: '/dist/assets/hire-professionals-office-bg.png' },
            { filename: 'tax-resources-office-bg.png', originalName: 'tax-resources-office-bg.png', mimeType: 'image/png', size: 2091146, folder: 'backgrounds', altText: 'Tax Resources & Regulatory Intelligence Background', storageLocation: '/dist/assets/tax-resources-office-bg.png' },
            { filename: 'ste_logo_dark.png', originalName: 'ste_logo_dark.png', mimeType: 'image/png', size: 156956, folder: 'branding', altText: 'Preferred Tax Consultancy Official Brand Logo (Dark)', storageLocation: '/assets/aistudio/ste_logo_dark.png' },
            { filename: 'ste_logo_light.png', originalName: 'ste_logo_light.png', mimeType: 'image/png', size: 92596, folder: 'branding', altText: 'Preferred Tax Consultancy Official Brand Logo (Light)', storageLocation: '/assets/aistudio/ste_logo_light.png' },
        ];
        for (const media of mediaFiles) {
            const existing = await prisma.mediaasset.findFirst({ where: { filename: media.filename } });
            if (!existing) {
                await prisma.mediaasset.create({
                    data: {
                        id: (0, uuid_1.v4)(),
                        filename: media.filename,
                        originalName: media.originalName,
                        mimeType: media.mimeType,
                        size: media.size,
                        folder: media.folder,
                        altText: media.altText,
                        storageLocation: media.storageLocation,
                        isProcessed: true,
                    },
                });
                report.mediaAssetsImported++;
                console.log(`  ✓ Registered media asset: ${media.filename}`);
            }
        }
        console.log('\n====================================================');
        console.log('Frontend Content Extraction & Sync Complete!');
        console.log('====================================================');
        console.log(JSON.stringify(report, null, 2));
    }
    catch (err) {
        console.error('Extraction failed:', err);
    }
    finally {
        await prisma.$disconnect();
    }
}
if (require.main === module) {
    importFrontendContent();
}
