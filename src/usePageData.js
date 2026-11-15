import { useEffect, useState } from 'react';

/**
 * All state + content for the page.
 * Ported 1:1 from the original class component's state/renderVals().
 */
const INITIAL = {
  aud: 0, mode: 0, heroAuto: true, who: 0, why: 0, whyAuto: true, fit: {},
  match: 0, role: 0, pattern: 0, hrs: 20, step: 0, uc: 0, ind: 0, sw: 0,
  stage: 0, faq: 0, fstep: 0, sent: false, agree: false, needAgree: false,
  pros: {}, sws: {}, tick: 0,
};

const clock = (tz) => {
  try {
    return new Date().toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '';
  }
};
const L = (arr) => arr.map((t, i) => ({ t, delay: (i * 0.06).toFixed(2) + 's' }));

export default function usePageData() {
  const [state, setState] = useState(INITIAL);
  const up = (o) => setState((p) => ({ ...p, ...o }));
  const tog = (key, v) =>
    setState((p) => ({ ...p, [key]: { ...p[key], [v]: !p[key][v] } }));

  // auto-rotating hero board + "why" carousel
  useEffect(() => {
    const id = setInterval(() => {
      setState((p) => {
        const n = { ...p, tick: p.tick + 1 };
        if (p.heroAuto) n.mode = p.mode ? 0 : 1;
        if (p.whyAuto && p.tick % 2 === 1) n.why = (p.why + 1) % 10;
        return n;
      });
    }, 4200);
    return () => clearInterval(id);
  }, []);

    const s = state;
    const set = (o) => () => up(o);
    const sel = (key, i, extra) => ({ on: s[key] === i, cls: s[key] === i ? 'on' : '', pressed: s[key] === i ? 'true' : 'false', pick: set(Object.assign({ [key]: i }, extra || {})) });
    const num = (i) => (i < 9 ? '0' : '') + (i + 1);

    /* HERO */
    const audData = [
      { label: 'CPA & tax firms', line: 'Tax season brings more documents than your team can comfortably process. Choose tax preparers and bookkeepers from our team in India who work inside your procedures, while your authorized US professionals keep review, approval and filing.', laneA: 'Your senior team', routine: ['Organize tax documents', 'Enter return data', 'Prepare draft returns', 'Build workpapers'], senior: ['Technical review', 'Approve & file', 'Client conversations'] },
      { label: 'Bookkeeping firms', line: 'Every new client is good for business and creates recurring work. Choose a dedicated bookkeeper from our team who maintains books, reconciles accounts and prepares reports using your chart of accounts and monthly checklist.', laneA: 'Your senior accountants', routine: ['Categorize transactions', 'Bank & card reconciliations', 'Record vendor bills', 'Monthly report prep'], senior: ['Review the books', 'Client decisions', 'Take on new accounts'] },
      { label: 'Growing businesses', line: 'Not every business needs a full accounting department. Choose a part-time or full-time professional from our team to maintain your books, process invoices, reconcile accounts or support payroll, based on the actual work you need done.', laneA: 'Your finance lead', routine: ['Process invoices', 'Reconcile bank accounts', 'Prepare payroll inputs', 'Month-end schedules'], senior: ['Review results', 'Approve payments', 'Financial decisions'] }
    ];
    const A = audData[s.aud];
    const auds = audData.map((a, i) => Object.assign({ label: a.label }, sel('aud', i)));
    const modeB = s.mode === 1;

    /* WHO */
    const whoData = [
      { label: 'US CPA Firms', h: 'Additional capacity, inside your established procedures.', p: 'You already have clients, established processes and a team responsible for reviewing and delivering accounting services. What you need is additional capacity. Choose tax preparers, bookkeepers, staff accountants and other accounting professionals from our existing team, ready to work within your firm’s established procedures.', useLabel: 'You can use them for', uses: ['Individual and business tax preparation support', 'Monthly bookkeeping', 'Bank and credit card reconciliations', 'General ledger maintenance', 'Financial statement preparation', 'Tax workpaper organization', 'Accounts payable and receivable', 'Seasonal accounting support'], cta: 'Hire Professionals for My CPA Firm' },
      { label: 'Tax Preparation Firms', h: 'More preparation capacity when deadlines tighten.', p: 'Tax season brings more work, tighter deadlines and greater pressure on existing staff. If your team is spending too much time organizing documents, preparing draft returns and handling repetitive preparation work, additional professionals may help distribute the workload.', useLabel: 'We match you based on', uses: ['The tax forms your firm prepares', 'The tax software you use', 'The level of preparation experience you require'], cta: 'Find Tax Preparation Professionals' },
      { label: 'Bookkeeping & Accounting Firms', h: 'Recurring work needs recurring capacity.', p: 'Adding more clients is good for business, but every new account also creates recurring work. Choose professionals from our team who can support that workload, with no recruitment process for you to manage.', useLabel: 'Someone who can', uses: ['Maintain client books', 'Reconcile accounts', 'Prepare reports', 'Follow your existing bookkeeping procedures'], cta: 'Build My Bookkeeping Team' },
      { label: 'Small & Medium-Sized Businesses', h: 'The right amount of accounting help, not a whole department.', p: 'Not every business needs a full accounting department. Depending on your workload, a part-time or full-time professional may be a more suitable arrangement than hiring an entire local department.', useLabel: 'You might simply need someone to', uses: ['Maintain your books', 'Process invoices', 'Reconcile bank accounts', 'Prepare monthly financial information'], cta: 'Hire an Accountant for My Business' },
      { label: 'Fractional CFO & Advisory Firms', h: 'Keep senior time on analysis and advice.', p: 'Your senior team should be spending time on financial analysis, business decisions and client advisory work, not getting stuck preparing every schedule and reconciliation. An accountant or financial analyst can support the underlying accounting work.', useLabel: 'How the work divides', uses: ['The professional prepares schedules and reconciliations', 'Your senior professionals review results', 'Your senior professionals advise clients'], cta: 'Find Accounting Support' },
      { label: 'Growing Outsourced Accounting Businesses', h: 'Plan a team with different specializations.', p: 'If your own accounting practice is expanding, you may need multiple professionals with different specializations. We can help you plan which professionals to add from our team as your requirements grow.', useLabel: 'Team planning for', uses: ['Bookkeepers', 'Accountants', 'Payroll specialists', 'Tax preparers', 'Senior review positions'], cta: 'Plan My Accounting Team' }
    ];
    const who = whoData.map((w, i) => Object.assign({}, w, { num: num(i), uses: L(w.uses) }, sel('who', i)));

    /* WHY */
    const whyData = [
      ['Your accounting workload is growing faster than your team.', 'New clients and responsibilities arrive, but the team is the same size. Bookkeeping, reconciliations, tax preparation and reporting compete for everyone’s time.', 'Add bookkeepers, accountants or tax professionals from our team to handle defined responsibilities and distribute the workload.', 'Your CPA firm adds 20 new bookkeeping clients. Instead of loading your existing accountants, you choose a dedicated bookkeeper from our team for the additional accounts.'],
      ['Hiring experienced accounting professionals locally is expensive.', 'Salary, recruitment expenses, benefits, employment costs, training and overheads. For smaller firms, another local full-time employee may not make commercial sense.', 'Our team in India gives you experienced professionals who are ready to start. Evaluate the total engagement cost against local hiring. The objective is not the cheapest person, but skills and cost that make sense for the work.', 'A US bookkeeping firm needs QuickBooks support without another local full-time position. It explores a dedicated professional in India with relevant software experience.'],
      ['Your senior accountants are spending too much time on routine work.', 'Hours go into categorizing transactions, organizing documents, preparing routine schedules and chasing missing information instead of work that needs judgement.', 'Divide responsibilities by complexity. An offshore professional handles assigned preparation; your senior team reviews, corrects, interprets and approves.', 'A senior accountant spends 12 hours each week on reconciliations and workpapers. A dedicated accountant prepares those schedules under your procedures.'],
      ['Tax season creates more work than your existing team can handle.', 'Documents arrive at different times, new clients come in, and deadlines remain fixed. Permanent hires just for seasonal demand may not be practical.', 'Add tax preparation professionals from our team for an agreed period. Your authorized US tax professionals keep technical review, approval and filing.', 'A practice handling 500 individual returns a year sees a sharp increase between January and April and adds preparers from our team for that period.'],
      ['You need a specific skill, not another general accountant.', 'The team exists, but nobody is experienced in multi-entity accounting, payroll reconciliations, US tax preparation, QuickBooks cleanup or financial reporting.', 'Choose a professional who already has the exact role and experience you need, rather than hiring someone and hoping they learn everything after joining.', 'A firm with three bookkeepers needs someone experienced in business tax preparation using Drake or ProConnect, and chooses a professional with exactly that experience.'],
      ['Your business needs accounting support, but not a full-time employee.', 'Bookkeeping for 15 hours a week, payroll support twice a month, or a temporary backlog does not justify a full-time position.', 'Part-time and project-based arrangements define the hours, responsibilities and duration before hiring.', 'A US consulting business needs about 20 hours of bookkeeping support each week. A part-time dedicated bookkeeper may fit better than a full-time accountant.'],
      ['Recruitment is taking too much of your time.', 'Job descriptions, vacancies, resumes, interviews, skills checks and joining dates consume management time, and the selected candidate may still lack practical experience.', 'Skip it. Our team is already in place. Tell us the work, meet the professionals we match to it, and choose.', 'A managing partner needs another senior bookkeeper but cannot spend several weeks on recruitment. They choose one from our team and work begins after onboarding.'],
      ['Your team is becoming dependent on a few key employees.', 'When work depends on one or two people, a short absence delays monthly closing, leaves reconciliations incomplete and makes documentation hard to follow.', 'An additional professional takes on documented workflows and recurring assignments. Proper SOPs, documentation and handover procedures matter just as much.', 'A second professional follows the documented month-end checklist, so closing no longer depends on one person being available.'],
      ['You want to expand without building every function locally.', 'A whole new local team means recruitment, employment costs, training, infrastructure and management growing at the same rate as revenue.', 'Offshore staffing adds professionals in India while your business retains its client relationships and established operating model.', 'A bookkeeping company plans to grow from 40 to 70 accounts, adding bookkeepers and a senior accountant from our team as the workload increases.'],
      ['You need more time for clients and business development.', 'Often the biggest underlying reason. When you are personally involved in every transaction and reconciliation, growth becomes difficult.', 'Distribute routine accounting responsibilities among appropriately selected professionals and spend your time where you are directly needed.', 'A CPA firm owner delegates defined bookkeeping responsibilities and focuses on client advisory, technical review and business development.']
    ];
    const why = whyData.map((y, i) => ({ n: num(i), t: y[0], prob: y[1], help: y[2], ex: y[3], hidden: s.why === i ? 'false' : 'true' }));
    const goWhy = (d) => () => up({ why: (s.why + d + 10) % 10, whyAuto: false });

    const fitData = ['You have recurring accounting work that needs additional capacity.', 'Local hiring costs do not fit your budget.', 'You need a specific accounting or tax skill.', 'Your senior team is overloaded with routine preparation work.', 'Your workload increases during particular months.', 'You want a professional who can work with your existing systems.', 'You have established processes and someone available to supervise the work.'];
    const fit = fitData.map((t, i) => ({ t: t, on: !!s.fit[i], tog: () => tog('fit', i) }));
    const fitN = fit.filter((q) => q.on).length;
    const fitMsg = fitN === 0 ? '0 of 7 ticked' : fitN + ' of 7 apply to you. It makes sense to explore dedicated staffing.';

    /* MATCH */
    const matchData = [['Too many monthly bookkeeping accounts', 'Dedicated Bookkeeper', 'Transaction recording and reconciliations'], ['Tax season workload', 'Tax Preparer', 'Assigned tax preparation work'], ['Delayed monthly closing', 'Staff Accountant', 'Journal entries and account reconciliations'], ['Payroll administration workload', 'Payroll Specialist', 'Payroll inputs and reporting support'], ['Unpaid invoices and vendor bills', 'AP/AR Specialist', 'Invoice and receivable management'], ['Incomplete financial schedules', 'Senior Accountant', 'Reporting and reconciliation preparation'], ['Accounting backlog', 'Project-Based Bookkeeper', 'Historical bookkeeping cleanup'], ['Too much senior accountant workload', 'Junior / Mid-Level Accountant', 'Routine preparation tasks']];
    const match = matchData.map((r, i) => Object.assign({ c: r[0], p: r[1], r: r[2] }, sel('match', i)));

    /* ROLES */
    const roleData = [
      { label: 'US Tax Preparers', intro: 'If your firm handles individual and business tax returns, you may need additional preparation capacity. We match you with team members by the returns they have worked on, their software experience and their level of responsibility.', pos: ['Individual Tax Return Preparer', 'Business Tax Return Preparer', 'Tax Associate', 'Senior Tax Preparer', 'Tax Reviewer', 'Tax Workpaper Specialist', 'Seasonal Tax Preparation Professional'], workLabel: 'What can they work on? Depending on experience', work: ['Form 1040 and associated schedules', 'Form 1065 partnership returns', 'Form 1120-S S corporation returns', 'Form 1120 C corporation returns', 'Tax document organization', 'Supporting schedules and workpapers', 'Identifying missing information', 'Preparing draft returns for review', 'Addressing reviewer comments'], sw: 'Drake Tax, ProConnect, UltraTax CS, CCH Axcess, CCH ProSystem fx, ProSeries and Lacerte.', ex: 'Your firm receives 150 individual returns during filing season. Tax preparation professionals handle assigned preparation tasks while your authorized US tax professionals retain technical oversight, required review and filing responsibilities.', cta: 'Hire a US Tax Preparer' },
      { label: 'Dedicated Bookkeepers', intro: 'Bookkeeping is not just entering transactions into software. A good bookkeeper understands how transactions affect accounts, how reconciliations work and why the books must be accurate before reports are prepared.', pos: ['Junior Bookkeeper', 'US Bookkeeping Specialist', 'QuickBooks Bookkeeper', 'Full-Charge Bookkeeper', 'Senior Bookkeeper', 'Bookkeeping Team Lead'], workLabel: 'Typical responsibilities', work: ['Recording and categorizing transactions', 'Bank and credit card reconciliations', 'Recording bills and customer invoices', 'Accounts payable and receivable support', 'Vendor and customer statement reconciliation', 'Maintaining bookkeeping records', 'Identifying unmatched or unusual transactions', 'Preparing monthly reports', 'Supporting month-end closing'], sw: 'QuickBooks Online, QuickBooks Desktop, Xero, Sage and other accounting platforms.', ex: 'You manage 25 small business clients. A dedicated bookkeeper handles assigned accounts using your chart of accounts, monthly checklist and reporting procedures. Your senior accountant reviews the completed work.', cta: 'Hire a Dedicated Bookkeeper' },
      { label: 'Accountants & Senior Accounting Professionals', intro: 'When your business grows, basic bookkeeping may no longer be enough. You may need someone who understands general ledger accounting, adjusting entries, balance sheet reconciliations, accruals and monthly reporting.', pos: ['Staff Accountant', 'General Ledger Accountant', 'Senior Accountant', 'Accounting Analyst', 'Financial Reporting Accountant', 'Reconciliation Specialist', 'Accounting Team Lead'], workLabel: 'Typical responsibilities', work: ['Journal entries', 'Accruals and prepayments', 'General ledger maintenance', 'Balance sheet reconciliations', 'Fixed asset schedules', 'Revenue and expense accounting', 'Intercompany reconciliations', 'Month-end and year-end close support', 'Trial balance review', 'Financial statement preparation'], sw: '', ex: 'Your business operates through multiple entities with monthly reporting. An experienced accountant prepares the schedules and maintains the general ledger. Your finance manager retains review and financial decisions.', cta: 'Hire an Accountant' },
      { label: 'Payroll Specialists', intro: 'Payroll requires accuracy, confidentiality and an understanding of the company’s payroll processes. Add professionals from our team to support payroll administration and related accounting work.', pos: ['Payroll Administrator', 'Payroll Processing Specialist', 'Payroll Accountant', 'Payroll Reconciliation Specialist', 'Multi-State Payroll Support Professional'], workLabel: 'Typical responsibilities', work: ['Preparing payroll inputs', 'Checking timesheets and employee changes', 'Reviewing payroll registers', 'Supporting payroll reconciliations', 'Maintaining payroll-related records', 'Preparing payroll reports', 'Coordinating information for payroll tax processes', 'Supporting payroll accounting entries'], sw: 'ADP, Gusto, Paychex, Rippling, Paylocity and UKG.', ex: 'Your business has 80 employees and runs payroll twice a month. A payroll specialist organizes information, verifies inputs and prepares reconciliation schedules under your approved procedures. The employer and authorized payroll personnel retain approval and legal responsibilities.', cta: 'Hire a Payroll Specialist' },
      { label: 'Accounts Payable & Receivable Professionals', intro: 'If your business handles a high volume of invoices and payments, you may need dedicated AP/AR support.', pos: ['Accounts Payable Specialist', 'Accounts Receivable Specialist', 'Billing Specialist', 'Cash Application Specialist', 'Collections Support Professional'], workLabel: 'Typical responsibilities', work: ['Vendor invoice processing', 'Invoice data verification', 'Vendor statement reconciliation', 'Payment preparation support', 'Customer invoicing', 'Payment allocation', 'Accounts receivable aging', 'Outstanding payment follow-ups', 'Billing records and reporting'], sw: '', ex: 'Your construction company receives hundreds of invoices every month. An AP specialist organizes invoices, verifies required documentation and prepares payment schedules for authorized approval.', cta: 'Hire AP/AR Professionals' },
      { label: 'Specialized Accounting & Finance Professionals', intro: 'Some businesses need skills beyond regular bookkeeping and accounting. These roles require a more specific assessment of practical experience, technical knowledge and the level of responsibility involved.', pos: ['Sales Tax Support Specialists', 'Form 1099 Preparation Support', 'Audit Documentation Specialists', 'Financial Analysts', 'Budgeting and Forecasting Analysts', 'Controller Support Professionals', 'Multi-Entity Accounting Specialists', 'Accounting Cleanup Professionals'], workLabel: 'How we approach these roles', work: ['Assessment of practical experience', 'Assessment of technical knowledge', 'Clarity on the level of responsibility', 'Availability confirmed position by position'], sw: '', ex: '', cta: 'Discuss a Specialized Role' }
    ];
    const roles = roleData.map((r, i) => Object.assign({}, r, { num: num(i), pos: L(r.pos), work: L(r.work), hasSw: !!r.sw, hasEx: !!r.ex }, sel('role', i)));

    /* MODELS */
    const patterns = ['Ongoing, every week', 'Seasonal peaks', 'One defined project'].map((l, i) => Object.assign({ label: l }, sel('pattern', i)));
    const rec = s.pattern === 0 ? (s.hrs > 25 ? 0 : 1) : 2;
    const modelData = [
      { name: 'Full-Time Dedicated Professional', for: 'For businesses with ongoing work and a regular workload.', desc: 'Works an agreed full-time schedule and is assigned primarily or exclusively to your engagement, depending on the contract. You assign daily tasks, set priorities and integrate them into your workflow.', ex: 'A CPA firm managing bookkeeping for 40 small businesses hires one dedicated bookkeeper who becomes familiar with its clients, procedures and reporting expectations.', inc: ['Agreed full-time working hours', 'A named professional', 'Defined responsibilities', 'Regular communication', 'Client-specific SOPs and reporting', 'Ongoing work continuity', 'Employment and HR support as contracted'], when: ['You have work throughout the month', 'The role requires consistent attention', 'You want someone familiar with your processes', 'You expect the workload to continue long term'], cta: 'Discuss Full-Time Hiring' },
      { name: 'Part-Time Dedicated Professional', for: 'For businesses with recurring but limited work.', desc: 'Works a predefined number of hours per week or month. You get an agreed level of availability without committing to a full-time schedule.', ex: 'A small consulting company needs about 20 hours of bookkeeping support each week: transaction recording, bank reconciliation, invoice organization and monthly reporting.', inc: ['Fixed weekly or monthly hours', 'An agreed work schedule', 'Defined responsibilities', 'Regular task updates', 'A named professional where agreed', 'Scope and availability reviewed as needed'], when: ['Your work is recurring but limited', 'You have a predictable monthly workload', 'You do not need full-time availability', 'You want continuity without full-time staffing'], cta: 'Discuss Part-Time Hiring' },
      { name: 'Flexible Hybrid & Project-Based Hiring', for: 'For changing workloads, seasonal demand or specific projects.', desc: 'Three people for tax season, an accountant for a cleanup project, or extra support during a month-end backlog. Resources may be shared, project-allocated or dedicated for a defined period, depending on the agreement.', ex: 'A US tax firm takes on two tax preparers from our team for an agreed seasonal period. They handle assigned preparation work while the senior team manages technical review and filing.', inc: ['Project-specific or seasonal allocation', 'Defined deliverables and timelines', 'Agreed resource availability', 'Temporary capacity for increased workload', 'Scope-based commercial arrangements', 'A possibility of moving into a recurring engagement'], when: ['You need temporary support', 'Your workload changes during the year', 'You have a backlog to clear', 'You need specific skills for a defined project'], cta: s.pattern === 1 ? 'Request Seasonal Staffing' : 'Request Project-Based Staffing' }
    ];
    const models = modelData.map((m, i) => Object.assign({}, m, { num: i + 1, on: rec === i, inc: L(m.inc), when: L(m.when), bd: rec === i ? '#37E191' : 'rgba(255,255,255,.16)', bg: rec === i ? 'rgba(55,225,145,.1)' : 'transparent' }));
    const cells = []; for (let i = 0; i < 40; i++) cells.push({ bg: i < s.hrs ? '#37E191' : 'rgba(255,255,255,.1)' });
    const mh = [92, 96, 100, 88, 34, 30, 28, 30, 40, 46, 30, 34];
    const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((l, i) => ({ l: l, h: mh[i] + '%', bg: i < 4 ? '#FFB84D' : 'rgba(255,255,255,.22)', delay: (i * 0.05).toFixed(2) + 's' }));

    /* PROCESS */
    const T = 'Smart Tax Expertss', Y = 'You', B = 'You + Smart Tax Expertss';
    const stepData = [
      ['Tell us the work', B, 'One conversation about what you need done. No recruitment brief, no job description to write.', 'We want to understand', ['What type of business you operate', 'The role and what the professional will do every day', 'Which software they must know', 'Working hours and US time-zone overlap', 'Full-time, part-time or project-based', 'When you want to start'], 'A clear requirement we can match against our team.'],
      ['We match professionals from our team', T, 'We already have the people. Instead of sourcing and screening strangers, we put forward professionals from our own team whose experience fits your work.', 'For each professional you see', ['Role and experience', 'US accounting or tax exposure', 'Tax forms and return types handled, where relevant', 'Software they have actually worked on', 'Availability and working hours'], 'Matched professionals to choose from, not a pile of resumes.'],
      ['You choose your professional', Y, 'This is your call. Speak with the professionals we put forward and pick the one you want on your work. You are never required to accept someone simply because we suggested them.', 'You can', ['Meet the professional', 'Ask technical questions', 'Explain your internal processes', 'Decide whether they fit your team'], ''],
      ['Onboarding to your procedures', B, 'Before handling live work, the professional learns how your business operates. Access to sensitive information is provided only after the applicable legal, contractual and security requirements are satisfied.', 'This may involve', ['Software access and training', 'Accounting procedures and client-specific SOPs', 'Reporting formats and task management tools', 'Communication channels', 'Review, approval and escalation processes', 'Security and confidentiality instructions'], ''],
      ['Work starts', B, 'The professional begins working to the agreed schedule and responsibilities, as an extension of your team.', 'In a dedicated staffing arrangement', ['Your team assigns the work', 'Your team manages day-to-day priorities', 'You review and approve the work', 'We handle the employment and HR support included in your agreement'], '']
    ];
    const steps = stepData.map((d, i) => Object.assign({ num: i + 1, t: d[0], lead: d[1], leadBg: d[1] === Y ? '#FFB84D' : (d[1] === T ? '#37E191' : '#CFE0F5'), p: d[2], listLabel: d[3], list: L(d[4]), get: d[5], hasGet: !!d[5], aria: 'Step ' + (i + 1) + ': ' + d[0] }, sel('step', i), { cls: s.step === i ? 'on' : (i < s.step ? 'done' : '') }));

    const gantt = [
      ['Share your requirement', '0%', '20%', 'One conversation', '#37E191', ''],
      ['We match professionals from our team', '16%', '24%', 'No sourcing or screening stage', '#37E191', ''],
      ['You meet and choose', '36%', '26%', 'Depends on your availability', '#FFB84D', 'hatch'],
      ['Onboarding and system access', '58%', '26%', 'Depends on your systems and security setup', '#FFB84D', 'hatch'],
      ['Work starts', '82%', '18%', 'Agreed start date', '#9BF0C6', '']
    ].map((g) => ({ t: g[0], l: g[1], w: g[2], est: g[3], bg: g[4], cls: g[5] }));

    /* USE CASES */
    const caseData = [
      ['A CPA firm that needs more tax preparers', 'An established team of five handles individual and business returns. As deadlines approach, more documents arrive than the team can comfortably process, and seniors spend too long on initial preparation.', 'Two tax preparers with relevant individual and business tax preparation experience.', 'Offshore professionals prepare assigned draft work. The firm instructs and reviews. Authorized US professionals handle approvals and filing. The firm retains its client relationships.', 'Flexible seasonal or full-time dedicated hiring'],
      ['A bookkeeping firm that has taken on more clients', 'The firm adds 15 new monthly clients: transaction recording, bank reconciliations, vendor bills and monthly reports. The existing team is struggling to finish on schedule.', 'A dedicated QuickBooks bookkeeper, assessed on reconciliations, categorization and monthly bookkeeping.', 'The professional manages assigned bookkeeping using the firm’s procedures. The senior accountant reviews the work and handles client-specific decisions.', 'Full-time dedicated hiring'],
      ['An e-commerce business that needs better financial records', 'An online retailer is paid through multiple gateways and marketplaces. Sales, refunds, platform fees and settlements are not always easy to reconcile.', 'An accountant or bookkeeper with relevant e-commerce reconciliation experience.', 'The professional prepares settlement reconciliations, records assigned transactions and organizes supporting schedules. The finance manager reviews the results.', 'Full-time or part-time dedicated hiring'],
      ['A US business that needs payroll support', 'A company with a regular payroll cycle spends considerable time collecting employee information, checking payroll inputs and preparing reports.', 'A payroll specialist familiar with its payroll software and procedures.', 'The professional supports data preparation, register checks and reconciliations. Authorized personnel retain payroll approval and the employer’s legal obligations.', 'Part-time or full-time dedicated hiring'],
      ['A firm with months of bookkeeping backlog', 'Several client accounts are behind on reconciliations and transaction recording. The firm wants them up to date before normal monthly reporting continues.', 'A bookkeeping cleanup specialist for a defined period, with accounts, periods, software, outputs and deadlines defined before work starts.', 'The professional works through the backlog, identifies missing information and prepares the accounts for review.', 'Project-based staffing'],
      ['A fractional CFO firm that needs reporting support', 'Too much senior time goes into preparing reconciliations, organizing schedules and compiling financial data.', 'An experienced accountant or financial analyst with general ledger, reporting and spreadsheet-based analysis experience.', 'The professional prepares financial schedules and reports. The CFO team reviews, interprets the numbers and provides strategic recommendations.', 'Full-time or part-time dedicated hiring']
    ];
    const cases = caseData.map((c, i) => Object.assign({ num: num(i), t: c[0], sit: c[1], need: c[2], split: c[3], model: c[4], hidden: s.uc === i ? 'false' : 'true', aria: 'Use case ' + (i + 1) }, sel('uc', i)));

    /* INDUSTRIES + SOFTWARE */
    const indData = [['CPA, Tax & Accounting Firms', 'Tax preparation, bookkeeping, general ledger accounting, reconciliation, workpaper preparation, financial reporting and accounting support.'], ['E-Commerce & Retail', 'Marketplace reconciliation, payment gateway settlements, sales recording, refunds, inventory-related accounting and monthly reporting.'], ['Real Estate & Property Management', 'Rental income tracking, property-level bookkeeping, vendor payments, expense recording and financial reporting.'], ['Healthcare Practices', 'Bookkeeping, expense recording, vendor accounting, payroll administration support and reporting, with appropriate privacy and access controls.'], ['Construction & Contracting', 'Vendor invoices, accounts payable, job-cost accounting support, project expense tracking, billing support and reconciliations.'], ['Professional Services', 'Client billing, time-based invoicing, expense recording, accounts receivable, monthly bookkeeping and profitability reporting.'], ['Restaurants & Hospitality', 'Daily sales reconciliation, vendor accounting, payroll-related accounting, expense classification and financial reporting.'], ['Technology & SaaS', 'Subscription billing reconciliation, deferred revenue support, expense accounting, general ledger maintenance and monthly financial reporting.'], ['Manufacturing & Distribution', 'Purchasing records, inventory-related accounting, vendor reconciliation, cost schedules and financial reporting.'], ['Nonprofit Organizations', 'Fund accounting support, grant-related transaction tracking, reconciliations and reporting preparation, subject to the candidate’s relevant experience.']];
    const inds = indData.map((n, i) => Object.assign({ label: n[0], text: n[1] }, sel('ind', i)));
    const swData = [
      ['US Tax Preparation Software', ['Drake Tax', 'Intuit ProConnect Tax', 'Thomson Reuters UltraTax CS', 'CCH ProSystem fx Tax', 'CCH Axcess Tax', 'Intuit ProSeries', 'Intuit Lacerte', 'TaxSlayer Pro'], 'Individual and business tax preparation, supporting schedules, workpapers, document organization and draft return preparation.'],
      ['Bookkeeping & Accounting Software', ['QuickBooks Online', 'QuickBooks Desktop', 'Xero', 'Sage', 'NetSuite', 'Microsoft Dynamics', 'Zoho Books'], 'Transaction recording, reconciliations, general ledger maintenance, accounts payable, accounts receivable and monthly financial reporting.'],
      ['Payroll Software', ['ADP', 'Gusto', 'Paychex', 'Rippling', 'Paylocity', 'UKG', 'OnPay'], 'Payroll input preparation, employee information updates, payroll register checks, payroll reporting and reconciliation support.'],
      ['Practice Management & Workflow', ['TaxDome', 'Karbon', 'Canopy', 'ShareFile', 'SmartVault', 'Microsoft 365', 'Trello', 'Asana'], 'Client document organization, task management, internal coordination, workflow tracking and review management.'],
      ['Reporting & Productivity Tools', ['Microsoft Excel', 'Google Sheets', 'Microsoft Power BI', 'Google Workspace', 'Microsoft Teams', 'Zoom'], 'Depending on the position, experience with reporting, spreadsheet and communication tools may also be required.']
    ];
    const sws = swData.map((w, i) => Object.assign({ label: w[0], names: L(w[1]), work: w[2] }, sel('sw', i)));
    const mqNames = ['Drake Tax', 'QuickBooks Online', 'ADP', 'UltraTax CS', 'Xero', 'Gusto', 'CCH Axcess', 'Sage', 'Paychex', 'Lacerte', 'NetSuite', 'TaxDome', 'ProSeries', 'Karbon'];
    const marquee = mqNames.concat(mqNames).map((t) => ({ t: t }));

    /* TEAM */
    const stageData = [
      ['Start with one professional', 'You might begin with one bookkeeper, accountant or tax preparer. Define the role, responsibilities, working hours and reporting process.', [], [0]],
      ['Establish your workflow', 'Once the professional starts, establish:', ['Daily and weekly responsibilities', 'Reporting expectations', 'Work allocation', 'Review procedures', 'Communication schedules', 'Performance indicators'], [0]],
      ['Add specialized professionals', 'As work increases, you may need different skills. A CPA firm may start with one bookkeeper and later add a tax preparer or payroll specialist.', [], [0, 3, 4]],
      ['Introduce senior review or coordination', 'When the team becomes larger, you may need a senior accountant, tax reviewer or team lead to coordinate work and support technical oversight.', [], [0, 3, 4, 5]],
      ['Build a structured offshore accounting team', 'An example team for a growing accounting practice: two dedicated bookkeepers, one senior accountant, one tax preparer, one payroll specialist and one senior reviewer or team lead.', [], [0, 1, 2, 3, 4, 5]]
    ];
    const stages = stageData.map((g, i) => Object.assign({ num: i + 1, t: g[0], p: g[1], list: L(g[2]), hasList: g[2].length > 0 }, sel('stage', i)));
    const filled = stageData[s.stage][3];
    const seats = ['Dedicated bookkeeper', 'Dedicated bookkeeper', 'Senior accountant', 'Tax preparer', 'Payroll specialist', 'Senior reviewer / team lead'].map((r, i) => ({ role: r, cls: filled.indexOf(i) > -1 ? 'on' : 'off', state: filled.indexOf(i) > -1 ? 'Filled' : 'Open seat' }));

    /* FAQ */
    const faqData = [
      ['Can I hire just one accountant or bookkeeper?', 'Yes. You can begin with one professional. You do not need to hire an entire team.'],
      ['Do I have to go through resumes and screening?', 'No. Our team is already in place. You tell us the work, we put forward professionals from our team who fit it, and you choose. There are no job posts, resume rounds or screening stages on your side.'],
      ['Can I meet the professionals before choosing?', 'Yes. You can speak with the professionals we put forward and ask your own technical questions. The final choice is yours.'],
      ['Do you only have US tax preparers?', 'No. Our team includes bookkeepers, accountants, payroll specialists, AP/AR professionals, financial analysts and other accounting-related roles.'],
      ['Can I hire someone with QuickBooks Online experience?', 'Yes. Tell us QuickBooks Online is mandatory and we will match you with professionals who have practical experience on it.'],
      ['Can I request someone experienced in Form 1040 or business tax returns?', 'Yes. You can specify whether you need individual tax preparation, partnership returns, S corporation returns or C corporation returns, and we match on that specific experience.'],
      ['Can the professional work during US business hours?', 'You can specify the required time-zone overlap and schedule. Availability will depend on the candidate and the agreed employment arrangement.'],
      ['Who manages the professional’s daily work?', 'In a client-managed dedicated staffing model, your business generally assigns tasks, sets priorities and reviews the work. Employment and HR responsibilities are handled according to the actual contractual arrangement.'],
      ['Who is the legal employer?', 'The employing entity depends on the engagement structure. If Smart Tax Expertss or its designated Indian entity employs the professional, that entity’s employment responsibilities should be documented in the agreement.'],
      ['Can I hire someone for only three or six months?', 'A fixed-term or project-based arrangement can be discussed, subject to candidate availability, applicable employment requirements and contractual terms.'],
      ['Can I increase working hours later?', 'Potentially, yes. Any change depends on the professional’s availability and the revised commercial and employment arrangements.'],
      ['What happens if the professional leaves?', 'The agreed continuity process should cover notice, handover, access revocation and a replacement from our team. The actual replacement terms and timeframes will be specified in your agreement.'],
      ['Can I use my existing accounting and tax software?', 'Yes, subject to technical feasibility, licensing and security requirements. You can specify the platforms candidates should know.'],
      ['Do you provide tax return review and filing?', 'This page focuses on dedicated staffing. Preparation, review and filing services are separate scopes. Any review or filing responsibility must be specifically agreed and carried out by appropriately authorized professionals.'],
      ['Will my business and customer information remain confidential?', 'Confidentiality obligations and appropriate security arrangements should be established before access is granted. US tax information may also require specific legal authorization for offshore disclosure.'],
      ['Is dedicated staffing the same as outsourcing accounting services?', 'No. In dedicated staffing, a professional works with your business under an agreed staffing and management arrangement. In managed accounting outsourcing, the service provider takes responsibility for a defined scope of work and delivery. We can discuss which structure is more appropriate for your requirements.'],
      ['How quickly can work start?', 'Because the team already exists, there is no sourcing or screening stage. The start date depends on how soon you can meet and choose, the availability of the professional you want, and onboarding and system access. We can give you a realistic start date after understanding your requirements.']
    ];
    const faqs = faqData.map((f, i) => ({ q: f[0], a: f[1], open: s.faq === i, cls: s.faq === i ? 'on' : '', tog: set({ faq: s.faq === i ? -1 : i }) }));

    /* FORM */
    const pill = (key, arr) => arr.map((t) => ({ t: t, on: !!s[key][t], cls: s[key][t] ? 'on' : '', tog: () => tog(key, t) }));
    const fNames = ['Part A of 4 · Your business', 'Part B of 4 · Your hiring requirement', 'Part C of 4 · The work', 'Part D of 4 · Budget and extras'];
    const show = (i) => (s.fstep === i ? 'block' : 'none');

    return {
      clockUS: clock('America/New_York'), clockIN: clock('Asia/Kolkata'),
      auds: auds, audLine: A.line, laneA: A.laneA, routine: L(A.routine), senior: L(A.senior),
      modeA: !modeB, modeB: modeB, modeAcls: modeB ? '' : 'on', modeBcls: modeB ? 'on' : '',
      setModeA: set({ mode: 0, heroAuto: false }), setModeB: set({ mode: 1, heroAuto: false }),
      meterW: modeB ? '22%' : '86%', meterC: modeB ? '#37E191' : '#FFB84D', meterLabel: modeB ? 'Lower' : 'High',
      boardNote: modeB ? 'Preparation moves to the dedicated seat. Review, approval and client relationships stay with your team.' : 'Routine preparation crowds out the work that needs senior judgement.',
      who: who,
      why: why, whyShift: '-' + (s.why * 100) + '%', whyPct: ((s.why + 1) * 10) + '%', whyCount: num(s.why) + ' / 10', whyPrev: goWhy(-1), whyNext: goWhy(1),
      fit: fit, fitMsg: fitMsg,
      match: match, roles: roles,
      patterns: patterns, isOngoing: s.pattern === 0, isSeasonal: s.pattern === 1, isProject: s.pattern === 2,
      hrs: s.hrs, setHrs: (e) => up({ hrs: Number(e.target.value) }), cells: cells, months: months, models: models,
      steps: steps, stepPct: (s.step / 4 * 100) + '%', stepPrev: set({ step: (s.step + 4) % 5 }), stepNext: set({ step: (s.step + 1) % 5 }),
      gantt: gantt,
      cases: cases, ucShift: '-' + (s.uc * 100) + '%', ucPrev: set({ uc: (s.uc + 5) % 6 }), ucNext: set({ uc: (s.uc + 1) % 6 }),
      inds: inds, sws: sws, marquee: marquee,
      stages: stages, seats: seats, seatAria: 'Team board showing ' + filled.length + ' of 6 seats filled',
      faqs: faqs,
      sent: s.sent, notSent: !s.sent, fsteps: [0, 1, 2, 3].map((i) => ({ bg: i <= s.fstep ? '#37E191' : 'rgba(255,255,255,.16)' })), fLabel: fNames[s.fstep],
      dA: show(0), dB: show(1), dC: show(2), dD: show(3),
      proPills: pill('pros', ['US Tax Preparer', 'Senior Tax Preparer / Reviewer', 'Bookkeeper', 'QuickBooks Specialist', 'Staff Accountant', 'Senior Accountant', 'Payroll Specialist', 'Accounts Payable Specialist', 'Accounts Receivable Specialist', 'Financial Reporting Professional', 'Other']),
      swPills: pill('sws', ['QuickBooks Online', 'QuickBooks Desktop', 'Xero', 'Drake Tax', 'ProConnect', 'UltraTax', 'ProSeries', 'CCH', 'Lacerte', 'ADP', 'Gusto', 'Paychex', 'Other', 'No Specific Software Requirement']),
      agree: s.agree, togAgree: () => up({ agree: !s.agree, needAgree: false }), needAgree: s.needAgree,
      backVis: s.fstep === 0 ? 'hidden' : 'visible', backCls: s.fstep === 0 ? 'hid' : '', fBack: set({ fstep: Math.max(0, s.fstep - 1) }), fNext: set({ fstep: Math.min(3, s.fstep + 1) }),
      notLast: s.fstep < 3, isLast: s.fstep === 3,
      fSend: () => (s.agree ? up({ sent: true }) : up({ needAgree: true })),
      noSubmit: (e) => { e.preventDefault(); }
    };
}
