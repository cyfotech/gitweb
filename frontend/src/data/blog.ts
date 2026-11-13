export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: 'Tax Strategy' | 'CPA Outsourcing' | 'IRS Regulations' | 'Corporate Accounting' | 'Small Business';
  publishedAt: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  image?: string;
  sourceName?: string;
  featured?: boolean;
  metaKeywords?: {
    focusKeyword?: string;
    canonicalUrl?: string;
    ogImage?: string;
    imageAlt?: string;
    shortDescription?: string;
    allowIndex?: boolean;
  };
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'irs-inflation-adjustments-2025',
    slug: 'irs-inflation-adjustments-2025',
    title: 'IRS Releases Tax Inflation Adjustments for Tax Year 2025 (IR-2024-273)',
    excerpt: 'The Internal Revenue Service announced annual inflation adjustments for more than 60 tax provisions, including the standard deduction and tax rate schedules for individual taxpayers.',
    category: 'IRS Regulations',
    publishedAt: 'Oct 22, 2024',
    readTime: '6 min read',
    author: {
      name: 'Internal Revenue Service',
      role: 'Official Newsroom Release',
      avatar: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=120&auto=format&fit=crop&q=80'
    },
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80',
    sourceName: 'IRS.gov Newsroom',
    featured: true
  },
  {
    id: 'joa-accounting-talent-shortage',
    slug: 'accounting-firms-offshore-talent-strategy',
    title: 'How Accounting Practices Navigate Staffing Shortages with Strategic Outsourcing',
    excerpt: 'As public accounting firms confront an unprecedented talent deficit, top managing partners are modernizing workflows by integrating dedicated offshore teams for seasonal compliance surges.',
    category: 'CPA Outsourcing',
    publishedAt: 'Nov 14, 2024',
    readTime: '8 min read',
    author: {
      name: 'Journal of Accountancy',
      role: 'Practice Management Editorial',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    },
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    sourceName: 'Journal of Accountancy',
    featured: true
  },
  {
    id: 'aicpa-tax-practitioner-priorities',
    slug: 'aicpa-top-tax-priorities-for-firms',
    title: 'AICPA Tax Section: Key Compliance Updates and Technology Adoption Guidelines',
    excerpt: 'An authoritative review of multi-state nexus thresholds, corporate alternative minimum taxes, and standard operating procedures for secure client data sharing.',
    category: 'Tax Strategy',
    publishedAt: 'Dec 05, 2024',
    readTime: '7 min read',
    author: {
      name: 'AICPA Insights',
      role: 'Tax Policy Division',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
    },
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    sourceName: 'AICPA & CIMA',
    featured: false
  },
  {
    id: 'tax-foundation-state-business-index',
    slug: '2025-state-business-tax-climate-index',
    title: 'Tax Foundation: 2025 State Business Tax Climate Index and Analysis',
    excerpt: 'How state corporate income tax reforms, pass-through entity taxes (PTET), and franchise obligations are altering corporate site selection and entity formation nationwide.',
    category: 'Corporate Accounting',
    publishedAt: 'Jan 10, 2025',
    readTime: '10 min read',
    author: {
      name: 'Tax Foundation',
      role: 'Center for State Tax Policy',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
    },
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    sourceName: 'Tax Foundation',
    featured: false
  },
  {
    id: 'preferred-tax-qbi-guide',
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
    publishedAt: 'Feb 18, 2025',
    readTime: '5 min read',
    author: {
      name: 'David Vance, CPA',
      role: 'Managing Director, Tax Advisory',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
    },
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    featured: false
  },
  {
    id: 'preferred-cpa-busy-season-prep',
    slug: 'busy-season-workpaper-standardization-handbook',
    title: 'Standardizing Workpapers for Hybrid Domestic & Offshore CPA Teams',
    excerpt: 'How boutique CPA firms can improve consistency during peak filing quarters with standardized tickmarks, PBC checklists, and clearly defined service targets.',
    content: `When managing a blend of onshore engagement partners and offshore tax preparers, operational friction rarely stems from technical competence—it stems from inconsistent workpaper hygiene.

Our proven five-pillar standardization framework includes:
1. Unified Indexing: Consistent lead sheet structures across 1040, 1120-S, and 1065 binders.
2. Mandatory Tickmark Conventions: Color-coded audit and mathematical validation marks with explicit cross-references.
3. Automated PBC Portals: Instant notification triggers when clients upload unreadable W-2 scans or missing 1099-B statements.
4. Two-Tier Review Hierarchy: First-pass technical diagnostic clearance by an offshore senior accountant followed by high-level partner advisory review.
5. Strict 24-48 Hour SLA Tracking: Dashboard accountability ensuring returns never stall in review limbo.`,
    category: 'CPA Outsourcing',
    publishedAt: 'Mar 02, 2025',
    readTime: '6 min read',
    author: {
      name: 'Sarah Chen, EA',
      role: 'Director of Outsourcing Solutions',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80'
    },
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&auto=format&fit=crop&q=80',
    featured: false
  },
  // --- Three New Blog Posts Added ---
  {
    id: 'irs-section-174-rd-amortization',
    slug: 'navigating-section-174-rd-amortization',
    title: 'Navigating IRS Section 174 R&D Amortization Rules for Software & Tech Firms',
    excerpt: 'An in-depth analysis of mandatory capitalization and amortization rules for domestic versus foreign research and experimental expenditures under recent tax code updates.',
    category: 'Tax Strategy',
    publishedAt: 'Mar 15, 2025',
    readTime: '7 min read',
    author: {
      name: 'Michael Sterling, CPA',
      role: 'Principal, Corporate Tax',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
    },
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    sourceName: 'IRS Tax Policy Guidance',
    featured: false
  },
  {
    id: 'pass-through-entity-tax-ptet-strategy',
    slug: 'maximizing-state-savings-ptet-elections',
    title: 'Maximizing State Tax Savings Through Pass-Through Entity Tax (PTET) Elections',
    excerpt: 'How partnerships and S-corporations bypass the $10,000 SALT deduction cap by paying state-level income taxes at the entity level and securing federal business deductions.',
    category: 'Corporate Accounting',
    publishedAt: 'Apr 02, 2025',
    readTime: '8 min read',
    author: {
      name: 'Elena Rostova, EA',
      role: 'Senior State Tax Director',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
    },
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
    sourceName: 'AICPA Tax Division',
    featured: false
  },
  {
    id: 'irs-publication-4557-cybersecurity-cpa',
    slug: 'irs-publication-4557-cpa-cybersecurity-standards',
    title: 'IRS Publication 4557: Essential Cybersecurity Standards for Modern CPA Practices',
    excerpt: 'Safeguarding client data against sophisticated tax season phishing and ransomware attacks with mandatory safeguards, multi-factor authentication, and encrypted workpaper vaults.',
    category: 'CPA Outsourcing',
    publishedAt: 'Apr 20, 2025',
    readTime: '6 min read',
    author: {
      name: 'Marcus Thorne',
      role: 'Chief Information Security Officer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
    },
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    sourceName: 'IRS Security Summit',
    featured: false
  }
];

export const BLOG_CATEGORIES = [
  'All',
  'Tax Strategy',
  'CPA Outsourcing',
  'IRS Regulations',
  'Corporate Accounting'
] as const;
