"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
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
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
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
const PAGE_SECTIONS = {
    home: [
        { sectionKey: 'hero', sectionType: 'CinematicHeroChapter', title: 'Strategic Tax Advisory & Global Accounting Infrastructure', desc: 'Enterprise-grade tax planning and outsourcing.' },
        { sectionKey: 'services_showcase', sectionType: 'EditorialServiceShowcase', title: 'Core Practice Areas & Advisory Verticals', desc: 'Specialized solutions for individuals, businesses, and CPA firms.' },
        { sectionKey: 'financial_clarity', sectionType: 'FinancialClarityChapter', title: 'Financial Clarity & Compliance Certainty', desc: 'Transparent reporting and rigorous compliance audits.' },
        { sectionKey: 'human_expertise', sectionType: 'HumanExpertiseChapter', title: 'Seasoned Enrolled Agents & Senior CPAs', desc: 'Decades of combined technical tax and GAAP knowledge.' },
        { sectionKey: 'cpa_pipeline', sectionType: 'CpaCollaborationPipeline', title: 'Dedicated Offshore Capacity for CPA Firms', desc: 'Secure, white-label staffing and preparation capacity.' },
        { sectionKey: 'editorial_insights', sectionType: 'EditorialInsightsChapter', title: 'Dispatches & Regulatory Analyses', desc: 'Insights on IRS policy and state tax adjustments.' },
        { sectionKey: 'closing_cta', sectionType: 'CinematicClosingChapter', title: 'Schedule Your Confidential Strategic Consultation', desc: 'Engage with our senior partners today.' },
    ],
    about: [
        { sectionKey: 'hero', sectionType: 'AboutHero', title: 'Integrity, Precision, and Institutional Trust', desc: 'The history and vision of Preferred Tax Consultancy.' },
        { sectionKey: 'firm_story', sectionType: 'FirmStory', title: 'Built by Tax Specialists for Modern Complexities', desc: 'From boutique practice to full-scale accounting advisory.' },
        { sectionKey: 'values', sectionType: 'FirmValues', title: 'Our Core Tenets & Professional Standards', desc: 'Absolute compliance, discretion, and proactive optimization.' },
        { sectionKey: 'cta', sectionType: 'AboutCta', title: 'Partner with Experienced Tax Professionals', desc: 'Start a conversation with our managing directors.' },
    ],
    services: [
        { sectionKey: 'hero', sectionType: 'ServicesHero', title: 'Complete Practice Directory', desc: 'Comprehensive tax and accounting capabilities.' },
        { sectionKey: 'categories', sectionType: 'ServiceCategories', title: 'Client Categories', desc: 'Individual, Business, and CPA Firm offerings.' },
        { sectionKey: 'services_grid', sectionType: 'AllServicesGrid', title: 'All Available Practice Offerings', desc: 'Select any service for details and deliverables.' },
    ],
    'cpa-outsourcing': [
        { sectionKey: 'hero', sectionType: 'CpaHero', title: 'Dedicated Offshore Accounting Capacity', desc: 'Scale your accounting practice without overhead burdens.' },
        { sectionKey: 'overview', sectionType: 'CpaOutsourcingOverview', title: 'How CPA Outsourcing Works', desc: 'Seamless integration with your tax software and workflow.' },
        { sectionKey: 'cta', sectionType: 'CpaCta', title: 'Expand Your Firm Capacity Today', desc: 'Schedule an intake call with our outsourcing team.' },
    ],
    'hire-professionals': [
        { sectionKey: 'hero', sectionType: 'HireHero', title: 'Hire Dedicated Accounting Professionals', desc: 'Pre-vetted CPAs, EAs, and senior bookkeepers.' },
        { sectionKey: 'professionals_grid', sectionType: 'HireProfessionalsGrid', title: 'Available Talent Profiles', desc: 'Inspect expertise, certifications, and availability.' },
    ],
    'tax-resources': [
        { sectionKey: 'hero', sectionType: 'TaxResourcesHero', title: 'Tax Intelligence & Deadlines', desc: 'Critical IRS filing dates, thresholds, and calculators.' },
        { sectionKey: 'deadlines', sectionType: 'TaxDeadlines', title: 'Key Statutory Deadlines', desc: 'Quarterly and annual tax compliance dates.' },
    ],
    blog: [
        { sectionKey: 'hero', sectionType: 'BlogHero', title: 'Editorial Dispatches & IRS Publications', desc: 'Authoritative tax updates from senior partners.' },
        { sectionKey: 'posts_grid', sectionType: 'BlogPostsGrid', title: 'All Articles', desc: 'Explore all published perspectives.' },
    ],
    contact: [
        { sectionKey: 'hero', sectionType: 'ContactHero', title: 'Contact Our Advisory Leadership', desc: 'Direct communications with senior partners.' },
        { sectionKey: 'contact_form', sectionType: 'ContactForm', title: 'Inquiry Form', desc: 'Submit your requirements securely.' },
    ],
    'book-consultation': [
        { sectionKey: 'hero', sectionType: 'ConsultationHero', title: 'Book a Strategic Consultation', desc: 'Reserve a confidential session with a CPA or EA.' },
        { sectionKey: 'booking_form', sectionType: 'BookingForm', title: 'Consultation Scheduler', desc: 'Select your service domain and timing.' },
    ],
    'tax-calculator': [
        { sectionKey: 'hero', sectionType: 'CalculatorHero', title: 'Federal & State Tax Calculator', desc: 'Estimate effective tax burdens and potential savings.' },
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
                    id: (0, uuid_1.v4)(),
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
        if (!s.catId)
            continue;
        const existing = await prisma.service.findUnique({ where: { slug: s.slug } });
        if (!existing) {
            await prisma.service.create({
                data: {
                    id: (0, uuid_1.v4)(),
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
                    id: (0, uuid_1.v4)(),
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
                        id: (0, uuid_1.v4)(),
                        pageId: page.id,
                        sectionKey: s.sectionKey,
                        sectionType: s.sectionType,
                        title: s.title,
                        description: s.desc,
                        displayOrder: i,
                        isEnabled: true,
                    },
                });
            }
        }
    }
    // 4. Blog Category & Sample Post
    let blogCat = await prisma.blogcategory.findFirst();
    if (!blogCat) {
        blogCat = await prisma.blogcategory.create({
            data: {
                id: (0, uuid_1.v4)(),
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
                id: (0, uuid_1.v4)(),
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
