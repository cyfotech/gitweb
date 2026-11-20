import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../api/client';


function cssToStyle(input) {
  if (!input) return undefined;
  const output = {};
  input.split(';').forEach((declaration) => {
    const colon = declaration.indexOf(':');
    if (colon < 0) return;
    const rawName = declaration.slice(0, colon).trim();
    const value = declaration.slice(colon + 1).trim();
    if (!rawName || !value) return;
    const name = rawName.startsWith('--')
      ? rawName
      : rawName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    output[name] = value;
  });
  return output;
}

class MainServicesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { orb: 0, svc: 0, auto: true, flow: 1, apar: 'ar', fbar: 14500, formCat: 'All', sw: 0, who: 0, picks: [true, true, false, false, false, true, false], proc: 0, doubt: 0, faq: 0, chips: [false, false, false, false, false, false, false], sent: false, fname: '', femail: '', fphone: '', fbiz: '', freq: '', bizOpen: false, ferr: {}, sending: false };
  }
  componentDidMount() {
    this.t1 = setInterval(() => this.setState(s => ({ orb: (s.orb + 1) % 7 })), 3200);
    this.t2 = setInterval(() => this.setState(s => s.auto ? { svc: (s.svc + 1) % 7 } : null), 9000);
    this.t3 = setInterval(() => this.setState(s => ({ proc: (s.proc + 1) % 7 })), 4500);
  }
  componentWillUnmount() { clearInterval(this.t1); clearInterval(this.t2); clearInterval(this.t3); }
  renderVals() {
    const s = this.state;
    const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
    const pill = (on, dark) => on
      ? 'min-height:44px;padding:0 18px;border-radius:999px;background:' + (dark ? '#6EE7C2' : '#0B1A1E') + ';color:' + (dark ? '#0B1A1E' : '#FFFFFF')
      : 'min-height:44px;padding:0 18px;border-radius:999px;background:transparent;color:' + (dark ? '#C9D6D8' : '#0B1A1E') + ';box-shadow:inset 0 0 0 1.5px ' + (dark ? 'rgba(255,255,255,0.25)' : '#C9C3B6');
    const goSvc = (i) => () => this.setState({ svc: i, auto: false });

    const SV = [
      {
        code: 'TAX', short: 'Tax Preparation', name: 'USA Tax Preparation', tag: '01 · USA TAX PREPARATION', sceneLabel: 'LIVE VIEW · DOCUMENTS TO RETURN',
        intro: 'Every income source, deduction, credit and schedule is considered before a return is ready for review, for individuals, businesses, nonprofits, estates and trusts.',
        items: ['Individual returns: 1040, 1040-SR, 1040-NR', 'Partnership returns: Form 1065 and K-1s', 'S Corporation returns: Form 1120-S', 'C Corporation returns: Form 1120', 'Nonprofit returns: Form 990 series', 'Prior-year and amended returns'],
        chipLabel: 'Key forms', chips: ['1040', '1065', '1120-S', '1120', '990', '1041'],
        q: 'W-2, freelance 1099s and a rental property, all on one return?', a: 'We organize every schedule for you', who: 'Individuals, businesses and CPA firms', href: '/usa-tax-preparation-services/'
      },
      {
        code: 'BKP', short: 'Bookkeeping', name: 'Bookkeeping & Accounting', tag: '02 · BOOKKEEPING & ACCOUNTING', sceneLabel: 'LIVE VIEW · BANK RECONCILIATION',
        intro: 'Every transaction recorded, classified and reconciled, so your books show where the business really stands every month, not only at tax time.',
        items: ['Full-cycle daily, weekly or monthly bookkeeping', 'Bank, credit card, PayPal and Stripe reconciliation', 'General Ledger and Chart of Accounts', 'P&L, Balance Sheet and Cash Flow statements', 'Month-end and year-end close', 'Catch-up and cleanup bookkeeping'],
        chipLabel: 'Platforms', chips: ['QuickBooks Online', 'QuickBooks Desktop'],
        q: 'Books months behind and bank balances that never match?', a: 'Catch-up bookkeeping fixes that', who: 'Small businesses, startups and CPA firms', href: '/bookkeeping-services-usa/'
      },
      {
        code: 'PAY', short: 'Payroll', name: 'Payroll Management', tag: '03 · PAYROLL MANAGEMENT', sceneLabel: 'LIVE VIEW · GROSS-TO-NET',
        intro: 'Wages calculated, withholding applied, employer taxes accounted for and every pay run reconciled, through to year-end W-2s.',
        items: ['Hourly and salaried gross-to-net payroll', 'Federal, state and local withholding', 'Social Security, Medicare, FUTA and SUTA', 'Benefit, 401(k), HSA and FSA deductions', 'Contractor payments and 1099-NEC', 'Payroll reconciliation and year-end reporting'],
        chipLabel: 'Key forms', chips: ['941', '940', '944', 'W-2', 'W-3', '1099-NEC'],
        q: 'Not sure your payroll taxes reconcile to what was filed?', a: 'We reconcile every pay run', who: 'Employers of every size and CPA firms', href: '/us-payroll-management-services/'
      },
      {
        code: 'PLN', short: 'Tax Planning', name: 'Tax Planning & Advisory', tag: '04 · TAX PLANNING & ADVISORY', sceneLabel: 'LIVE VIEW · PROJECTION VS PAYMENTS',
        intro: 'Tax preparation looks at what already happened. Tax planning looks ahead, with projections and estimates while there is still time to act.',
        items: ['Annual income and tax projections', 'Quarterly estimated tax calculations', 'Entity structure and S Corporation considerations', 'Depreciation and asset purchase timing', 'Retirement contribution analysis', 'Year-end tax planning'],
        chipLabel: 'Covers', chips: ['Projections', 'Estimates', 'Safe harbor', 'Entity review'],
        q: 'Worried April will bring a tax bill you didn’t see coming?', a: 'Get a tax projection now', who: 'Individuals, self-employed and business owners', href: '/us-tax-planning-services/'
      },
      {
        code: 'AP/AR', short: 'AP & AR', name: 'Accounts Payable & Receivable', tag: '05 · ACCOUNTS PAYABLE & RECEIVABLE', sceneLabel: 'LIVE VIEW · AGING REPORT',
        intro: 'A clear picture of what your business owes and what it needs to collect: invoices verified, balances tracked and aging reported.',
        items: ['Vendor onboarding and W-9 collection', 'Invoice verification with 2-way and 3-way matching', 'Payment schedule preparation', 'Customer invoicing and recurring billing', 'Payment application and unapplied cash', 'AP and AR aging reports'],
        chipLabel: 'Reports', chips: ['AP Aging', 'AR Aging', 'Vendor recs', 'Customer recs'],
        q: 'Don’t know who owes you, or who you owe, right now?', a: 'See it in one aging report', who: 'Growing and established businesses', href: '/accounts-payable-receivable-outsourcing/'
      },
      {
        code: 'INTL', short: 'Foreign Compliance', name: 'Foreign Tax Compliance', tag: '06 · FOREIGN TAX COMPLIANCE', sceneLabel: 'INTERACTIVE · FBAR THRESHOLD',
        intro: 'Foreign accounts, overseas companies and cross-border payments carry their own US reporting rules. We organize the information and prepare the forms for technical review.',
        items: ['FBAR: FinCEN Form 114', 'FATCA: Form 8938', 'Foreign corporations: Form 5471', 'Foreign-owned US entities: Form 5472', 'PFIC Form 8621 and foreign trusts 3520 / 3520-A', 'Foreign Tax Credit (1116) and Form 1040-NR'],
        chipLabel: 'Key forms', chips: ['FinCEN 114', '8938', '5471', '5472', '8865', '8858'],
        q: 'Have a bank account, company or investment outside the US?', a: 'Check your FBAR & FATCA duties', who: 'US taxpayers abroad, foreign-owned US entities, CPA firms', href: '/us-foreign-tax-compliance-services/'
      },
      {
        code: 'FILE', short: 'Tax Filing', name: 'US Tax Filing', tag: '07 · US TAX FILING', sceneLabel: 'LIVE VIEW · E-FILE TRACKER',
        intro: 'Preparing a return and submitting it are separate stages. We coordinate authorization, e-filing, acknowledgments and any rejection fixes.',
        items: ['Federal individual and business returns', 'State income and franchise tax returns', 'Sales tax return preparation', 'Payroll filings: 941, 940, W-2 and 1099', 'Extensions: 4868, 7004 and 8868', 'Amended returns, including 1040-X'],
        chipLabel: 'Key forms', chips: ['4868', '7004', '8868', '1040-X'],
        q: 'Running out of time before the filing deadline?', a: 'We’ll file your extension', who: 'Individuals, businesses and accounting firms', href: '/us-tax-filing-services/'
      }
    ];

    // Orbit
    const orbNodes = SV.map((v, i) => {
      const ang = (i / 7) * Math.PI * 2 - Math.PI / 2;
      const left = 50 + 41 * Math.cos(ang), top = 50 + 41 * Math.sin(ang);
      const on = s.orb === i;
      return {
        code: v.code, label: v.name, pressed: String(on), pick: () => this.setState({ orb: i, svc: i, auto: false }),
        style: 'position:absolute;left:' + left.toFixed(2) + '%;top:' + top.toFixed(2) + '%;transform:translate(-50%,-50%) scale(' + (on ? 1.18 : 1) + ');width:64px;height:64px;border-radius:50%;font:600 12px JetBrains Mono,monospace;letter-spacing:0.04em;' + (on ? 'background:#6EE7C2;color:#0B1A1E;box-shadow:0 0 0 10px rgba(110,231,194,0.18)' : 'background:#12262B;color:#FFFFFF;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,0.25)')
      };
    });
    const oa = (s.orb / 7) * Math.PI * 2 - Math.PI / 2;

    // Flow
    const FL = [
      { name: 'Transactions', who: 'YOUR BUSINESS', title: 'Money moves every day', text: 'Customer payments, vendor invoices, payroll, bank deposits, loan payments and operating expenses all need to be captured.', cta: 'See Bookkeeping', svc: 1 },
      { name: 'Bookkeeping', who: 'BOOKKEEPING', title: 'Recorded, classified, reconciled', text: 'Each transaction is recorded and categorized in the General Ledger and matched against bank and card statements.', cta: 'See Bookkeeping', svc: 1 },
      { name: 'Payroll · AP/AR', who: 'PAYROLL · AP & AR', title: 'People paid, invoices tracked', text: 'Wages and withholding are calculated, vendor bills verified and customer balances followed up, all flowing back into the books.', cta: 'See Payroll', svc: 2 },
      { name: 'Statements', who: 'ACCOUNTING', title: 'Records become reports', text: 'Month-end close produces the P&L, Balance Sheet and Cash Flow Statement, so you see profit, obligations and cash before tax season.', cta: 'See Accounting', svc: 1 },
      { name: 'Tax planning', who: 'TAX PLANNING', title: 'Looking ahead', text: 'Year-to-date figures feed tax projections and quarterly estimates, while decisions can still change the outcome.', cta: 'See Tax Planning', svc: 3 },
      { name: 'Tax preparation', who: 'TAX PREPARATION', title: 'Reported correctly', text: 'Reconciled records become federal and state returns with the right schedules and organized workpapers for review.', cta: 'See Tax Preparation', svc: 0 },
      { name: 'Tax filing', who: 'TAX FILING', title: 'Submitted and tracked', text: 'After your authorization, returns are e-filed and acknowledgments tracked. Rejections are reviewed and resubmitted.', cta: 'See Tax Filing', svc: 6 }
    ];
    const flowNodes = FL.map((f, i) => {
      const on = s.flow === i, past = i < s.flow;
      return {
        n: String(i + 1), name: f.name, pressed: String(on), pick: () => this.setState({ flow: i }),
        dot: 'width:64px;height:64px;border-radius:50%;display:grid;place-items:center;font:700 20px Space Grotesk,sans-serif;transition:all .3s;' + (on ? 'background:#0B1A1E;color:#6EE7C2;box-shadow:0 0 0 8px rgba(13,122,99,0.15)' : past ? 'background:#DDF5EC;color:#0A5C4B' : 'background:#FFFFFF;color:#0B1A1E;box-shadow:inset 0 0 0 1.5px #C9C3B6'),
        label: 'font-size:14px;font-weight:' + (on ? 700 : 500) + ';color:' + (on ? '#0B1A1E' : '#4C5654') + ';text-align:center;line-height:1.3'
      };
    });
    const cf = FL[s.flow];

    // Service tabs — the four core services, each navigates to its dedicated page
    const CORE_ROUTES = ['/usa-tax-preparation-services', '/bookkeeping', '/services/payroll-management', '/tax-planning'];
    const svcTabs = SV.slice(0, 4).map((v, i) => {
      const on = s.svc === i;
      return {
        num: '0' + (i + 1), name: v.name, pressed: String(on),
        pick: goSvc(i),
        showBar: on,
        style: 'position:relative;overflow:hidden;display:flex;align-items:center;gap:14px;min-height:60px;padding:0 20px;border-radius:16px;font-size:16px;' + (on ? 'background:#0B1A1E;color:#FFFFFF' : 'background:#F7F5F0;color:#0B1A1E;box-shadow:inset 0 0 0 1px #E4E0D6'),
        numStyle: 'font-size:12px;color:' + (on ? '#6EE7C2' : '#0D7A63'),
        arrowStyle: 'transition:transform .3s;transform:translateX(' + (on ? '0' : '-6px') + ');opacity:' + (on ? 1 : 0) + ';color:#6EE7C2'
      };
    });
    const cur = SV[s.svc];

    // Bookkeeping rows
    const RR = [['Stripe payout', '+$2,480.00', '#6EE7C2'], ['Office lease', '−$3,200.00', '#FFFFFF'], ['Customer ACH', '+$1,240.00', '#6EE7C2'], ['Bank service fee', '−$35.00', '#F2B544'], ['Payroll run', '−$6,812.40', '#FFFFFF']];
    const recRows = RR.map((r, i) => ({
      d: r[0], a: r[1], c: r[2], delay: 'animation-delay:' + (0.15 + i * 0.25) + 's',
      status: i === 3 ? 'Added ✓' : 'Matched ✓',
      checkStyle: 'animation-delay:' + (i === 3 ? 2.2 : 0.6 + i * 0.3) + 's;font-size:12px;font-weight:600;padding:3px 9px;border-radius:999px;' + (i === 3 ? 'background:rgba(242,181,68,0.18);color:#F2B544' : 'background:rgba(110,231,194,0.15);color:#6EE7C2')
    }));

    // Payroll waterfall
    const WF = [['Gross pay', 5000, 'g'], ['Federal income tax', 520], ['Social Security', 310], ['Medicare', 72.5], ['State tax', 200], ['401(k)', 250], ['Health premium', 150], ['Net pay', 0, 'n']];
    let run = 5000;
    const wf = WF.map((w, i) => {
      let bottom, h, color, amt;
      if (w[2] === 'g') { bottom = 0; h = 5000; color = '#FFFFFF'; amt = '$5,000'; }
      else if (w[2] === 'n') { bottom = 0; h = run; color = '#6EE7C2'; amt = '$' + run.toLocaleString('en-US', { minimumFractionDigits: 2 }); }
      else { run -= w[1]; bottom = run; h = w[1]; color = '#F2B544'; amt = '−$' + w[1].toLocaleString('en-US', { minimumFractionDigits: w[1] % 1 ? 2 : 0 }); }
      const b = bottom / 5000 * 100, hp = h / 5000 * 100;
      return {
        name: w[0], amt,
        barStyle: 'position:absolute;left:0;right:0;bottom:' + b.toFixed(2) + '%;height:' + hp.toFixed(2) + '%;min-height:4px;border-radius:6px;background:' + color + ';animation-delay:' + (i * 0.22) + 's',
        lblStyle: 'position:absolute;left:50%;transform:translateX(-50%);bottom:calc(' + (b + hp).toFixed(2) + '% + 6px);font-size:10px;white-space:nowrap;color:' + (w[2] ? '#FFFFFF' : '#F2B544')
      };
    });

    // AP/AR
    const AG = { ar: [42300, 18750, 9400, 4100, 2650], ap: [28900, 12300, 5200, 1800, 600] };
    const BK = ['Current', '1–30 days', '31–60 days', '61–90 days', '90+ days'];
    const av = AG[s.apar]; const amax = Math.max.apply(null, av);
    const agColors = ['#6EE7C2', '#9AF0D5', '#F2B544', '#E89A3C', '#E46B4F'];
    const aging = av.map((v, i) => ({ b: BK[i], v: money(v), style: 'display:block;height:100%;border-radius:8px;width:' + (v / amax * 100).toFixed(1) + '%;background:' + agColors[i] }));
    const isAR = s.apar === 'ar';

    // FBAR
    const over = s.fbar > 10000;
    const fbarPct = Math.min(100, s.fbar / 50000 * 100);

    const intlForms = [['FinCEN 114', 'FBAR'], ['8938', 'FATCA assets'], ['5471', 'Foreign corporations'], ['5472', 'Foreign-owned US'], ['8865', 'Foreign partnerships'], ['8858', 'Disregarded entities'], ['3520', 'Foreign trusts'], ['8621', 'PFIC holdings']]
      .map((x, i) => ({ f: x[0], p: x[1], st: 'animation-delay:' + (0.1 + i * 0.12) + 's;background:#12262B;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:10px 12px' }));

    const FS = [['1', 'Prepared', 'Return complete'], ['2', 'Reviewed', 'Checked by reviewer'], ['3', 'Authorized', 'Your signature'], ['4', 'Submitted', 'Authorized e-file'], ['✓', 'Accepted', 'Acknowledgment']];
    const fileSteps = FS.map((f, i) => ({ i: f[0], t: f[1], d: f[2], st: 'animation-delay:' + (0.3 + i * 0.55) + 's;width:56px;height:56px;margin:0 auto;border-radius:50%;display:grid;place-items:center;font:700 20px Space Grotesk,sans-serif;' + (i === 4 ? 'background:#6EE7C2;color:#0B1A1E;box-shadow:0 0 0 8px rgba(110,231,194,0.2)' : 'background:#12262B;color:#FFFFFF;box-shadow:inset 0 0 0 1.5px #6EE7C2') }));

    // Forms wall
    const FM = [
      ['Individual', 0, '1040', 'Individual income tax return'], ['Individual', 0, '1040-SR', 'Return for seniors'], ['Individual', 0, '1040-NR', 'Nonresident alien return'], ['Individual', 0, 'Sch C', 'Business income and expenses'], ['Individual', 0, 'Sch D', 'Capital gains and losses'], ['Individual', 0, 'Sch E', 'Rental and pass-through income'], ['Individual', 0, 'Sch SE', 'Self-employment tax'], ['Individual', 6, '1040-X', 'Amended individual return'],
      ['Business', 0, '1065', 'Partnership return'], ['Business', 0, '1120-S', 'S Corporation return'], ['Business', 0, '1120', 'C Corporation return'], ['Business', 0, '1120-F', 'Foreign corporation return'], ['Business', 0, '990', 'Nonprofit reporting'], ['Business', 0, '1041', 'Estate and trust return'], ['Business', 0, '4562', 'Depreciation and amortization'], ['Business', 0, '8995', 'Qualified Business Income deduction'],
      ['Payroll', 2, '941', 'Quarterly employment tax'], ['Payroll', 2, '940', 'Annual FUTA return'],
      ['International', 5, '8938', 'Specified foreign assets'], ['International', 5, '5471', 'Foreign corporation interests'], ['International', 5, '5472', 'Foreign-owned US entity'], ['International', 5, '1116', 'Foreign Tax Credit']
    ];
    const CATS = ['All', 'Individual', 'Business', 'Payroll', 'International', 'Filing'].filter(c => c === 'All' || FM.some(f => f[0] === c));
    const formCats = CATS.map(c => ({ name: c, count: String(c === 'All' ? FM.length : FM.filter(f => f[0] === c).length), pressed: String(s.formCat === c), style: pill(s.formCat === c, true), pick: () => this.setState({ formCat: c }) }));
    const formTiles = FM.filter(f => s.formCat === 'All' || f[0] === s.formCat).map(f => ({ cat: f[0].toUpperCase() + ' · ' + SV[f[1]].short.toUpperCase(), f: f[2], p: f[3], go: goSvc(f[1]) }));

    // Software
    const SW = [
      { m: 'DT', name: 'Drake Tax', type: 'TAX PREPARATION', use: 'individual and business tax return preparation', svc: [0, 6] },
      { m: 'PC', name: 'Intuit ProConnect Tax', type: 'TAX PREPARATION', use: 'professional tax preparation and workflow', svc: [0, 6] },
      { m: 'UT', name: 'Thomson Reuters UltraTax CS', type: 'TAX PREPARATION', use: 'professional tax preparation and reporting', svc: [0, 6] },
      { m: 'CCH', name: 'CCH ProSystem', type: 'TAX PREPARATION', use: 'tax preparation and compliance', svc: [0, 6] },
      { m: 'PS', name: 'Intuit ProSeries', type: 'TAX PREPARATION', use: 'individual and business tax preparation', svc: [0, 6] },
      { m: 'QB', name: 'QuickBooks Online & Desktop', type: 'ACCOUNTING & PAYROLL', use: 'bookkeeping, accounting, payroll and AP/AR records', svc: [1, 2, 4] }
    ];
    const swTiles = SW.map((w, i) => {
      const on = s.sw === i;
      return {
        m: w.m, name: w.name, type: w.type === 'TAX PREPARATION' ? 'Tax preparation' : 'Accounting & payroll', pressed: String(on), pick: () => this.setState({ sw: i }),
        style: 'display:flex;flex-direction:column;align-items:flex-start;text-align:left;padding:20px;border-radius:22px;min-height:150px;' + (on ? 'background:#0B1A1E;color:#FFFFFF;box-shadow:0 20px 40px rgba(11,26,30,0.18)' : 'background:#FFFFFF;color:#0B1A1E;box-shadow:inset 0 0 0 1px #E4E0D6'),
        monoStyle: 'width:48px;height:48px;border-radius:14px;display:grid;place-items:center;font-size:' + (w.m.length > 2 ? 14 : 17) + 'px;font-weight:700;' + (on ? 'background:#6EE7C2;color:#0B1A1E' : 'background:#F7F5F0;color:#0D7A63')
      };
    });
    const swCur = SW[s.sw];
    const swSvc = SV.map((v, i) => {
      const on = swCur.svc.indexOf(i) >= 0;
      return { name: v.name, mark: on ? '●' : '○', style: 'display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-radius:12px;font-size:14px;transition:all .3s;' + (on ? 'background:rgba(110,231,194,0.14);color:#FFFFFF;box-shadow:inset 0 0 0 1px rgba(110,231,194,0.4)' : 'background:#12262B;color:#7F9396') };
    });

    // Builder
    const WHO = [
      { name: 'CPA firms', title: 'CPA firms & accounting practices', text: 'Extra preparation capacity and recurring accounting support, working inside your workflows, software, documentation standards and review procedures.', rec: [0, 1, 5, 6], cta: 'Discuss CPA Outsourcing' },
      { name: 'Small & medium businesses', title: 'US small & medium-sized businesses', text: 'Updated financials to understand profitability, manage cash flow and prepare for tax: monthly bookkeeping, payroll, AP/AR and tax preparation.', rec: [1, 2, 4, 3, 0], cta: 'Build My Business Support Plan' },
      { name: 'Corporations', title: 'Corporations & established businesses', text: 'Higher transaction volumes, multiple accounts and detailed reporting: full-cycle accounting, month-end close, corporate tax preparation and more.', rec: [1, 2, 4, 0, 6], cta: 'Discuss Corporate Accounting Support' },
      { name: 'Startups', title: 'Startups & entrepreneurs', text: 'A strong accounting foundation from day one: bookkeeping setup, Chart of Accounts, expense tracking, payroll and business tax preparation.', rec: [1, 2, 0], cta: 'Set Up My Startup’s Books' },
      { name: 'Individuals', title: 'Individual taxpayers & self-employed', text: 'For employees, freelancers, investors, property owners and taxpayers with international income who want their returns organized and prepared.', rec: [0, 3, 6, 5], cta: 'Get Help With My Tax Return' }
    ];
    const whoTabs = WHO.map((w, i) => ({ name: w.name, pressed: String(s.who === i), style: pill(s.who === i, false), pick: () => this.setState({ who: i, picks: [0, 1, 2, 3, 4, 5, 6].map(k => w.rec.indexOf(k) >= 0) }) }));
    const whoCur = WHO[s.who];
    const CAD = ['SEASONAL', 'MONTHLY', 'EVERY PAY RUN', 'QUARTERLY', 'MONTHLY', 'ANNUAL', 'PER DEADLINE'];
    const pickList = SV.map((v, i) => {
      const on = s.picks[i];
      return {
        name: v.short, cad: CAD[i], mark: on ? '✓' : '', pressed: String(on), toggle: () => this.setState(st => { const p = st.picks.slice(); p[i] = !p[i]; return { picks: p }; }),
        style: 'display:flex;align-items:center;gap:10px;min-height:50px;padding:0 14px;border-radius:14px;font-size:14px;' + (on ? 'background:#0B1A1E;color:#FFFFFF' : 'background:#FFFFFF;color:#0B1A1E;box-shadow:inset 0 0 0 1px #E4E0D6'),
        box: 'flex:none;width:22px;height:22px;border-radius:7px;display:grid;place-items:center;font-size:12px;font-weight:700;' + (on ? 'background:#6EE7C2;color:#0B1A1E' : 'box-shadow:inset 0 0 0 1.5px #C9C3B6')
      };
    });
    const MONTHS = [[0, 1, 2, 3, 8, 9], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [0, 3, 5, 8, 10, 11], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3, 9], [0, 2, 3, 8, 9]];
    const ML = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
    const MN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const counts = ML.map((l, m) => MONTHS.reduce((acc, arr, i) => acc + (s.picks[i] && arr.indexOf(m) >= 0 ? 1 : 0), 0));
    const cmax = Math.max(1, Math.max.apply(null, counts));
    const heat = counts.map((c, m) => ({ l: ML[m], v: String(c), style: 'display:block;width:100%;border-radius:8px 8px 0 0;height:' + (c ? Math.max(8, c / 7 * 100) : 3).toFixed(1) + '%;background:' + (c === cmax && c > 0 ? '#6EE7C2' : c >= cmax - 1 && c > 1 ? '#9AF0D5' : 'rgba(255,255,255,0.22)') }));
    const pickCount = s.picks.filter(Boolean).length;
    const peakIdx = counts.indexOf(Math.max.apply(null, counts));
    const monthly = s.picks[1] || s.picks[2] || s.picks[4];
    const cadence = pickCount === 0 ? '—' : monthly ? 'Monthly' : s.picks[3] ? 'Quarterly' : 'Seasonal';

    // Process
    const PR = [
      { short: 'Understand', title: 'Understanding your requirements', text: 'We begin with your business, entity structure, accounting needs, tax requirements, workload and expected deliverables.' },
      { short: 'Onboard', title: 'Document collection & onboarding', text: 'We identify the documents, accounting records, tax information and software access needed to begin.' },
      { short: 'Allocate', title: 'Work allocation', text: 'Tasks are assigned by nature and complexity, with clear responsibility for bookkeeping, payroll, tax preparation or compliance.' },
      { short: 'Process', title: 'Accounting & tax processing', text: 'Our team performs the agreed work, maintains documentation and prepares supporting schedules and reports.' },
      { short: 'Review', title: 'Review & quality checks', text: 'Completed work is checked against the engagement’s review requirements. Discrepancies and missing information are addressed.' },
      { short: 'Approve', title: 'Client review & approval', text: 'Work is shared with your designated contact or authorized professional for review and approval.' },
      { short: 'File & support', title: 'Filing & ongoing support', text: 'Where included, authorized filing is coordinated and acknowledgments kept. Recurring clients continue on the agreed schedule.' }
    ];
    const procSteps = PR.map((p, i) => {
      const on = s.proc === i, past = i < s.proc;
      return {
        n: String(i + 1), short: p.short, pressed: String(on), pick: () => this.setState({ proc: i }),
        dot: 'width:56px;height:56px;border-radius:50%;display:grid;place-items:center;font:700 19px Space Grotesk,sans-serif;transition:all .35s;' + (on ? 'background:#6EE7C2;color:#0B1A1E;transform:scale(1.1)' : past ? 'background:#0D7A63;color:#FFFFFF' : 'background:#12262B;color:#FFFFFF;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,0.25)'),
        lbl: 'font-size:14px;font-weight:' + (on ? 700 : 500) + ';color:' + (on ? '#FFFFFF' : '#A9BBBE')
      };
    });
    const cp = PR[s.proc];

    // Doubts
    const DB = [
      { q: 'Can you work inside my CPA firm’s software?', a: 'Yes, Drake, UltraTax, CCH & more', d: 'Our environment includes Drake Tax, Intuit ProConnect Tax, Thomson Reuters UltraTax CS, CCH ProSystem, Intuit ProSeries and QuickBooks, used according to your access, licensing and workflow.' },
      { q: 'Do I have to outsource everything?', a: 'No, start with one service', d: 'Each service can be engaged independently or as part of a broader arrangement. Many clients start with a single service, such as tax preparation or monthly bookkeeping.' },
      { q: 'Who checks the work before I see it?', a: 'A dedicated reviewer, then you', d: 'Completed work goes through review procedures set for your engagement, then to your designated contact or authorized professional for approval.' },
      { q: 'Will you file anything without my approval?', a: 'Never, filing needs your authorization', d: 'Filing happens only where the engagement includes it and after the necessary authorization. Preparation, review, approval and submission responsibilities are defined up front.' },
      { q: 'My books are a mess. Is it too late?', a: 'No, catch-up bookkeeping fixes it', d: 'We organize historical information, reconstruct transaction records, correct classifications, reconcile accounts and bring the books up to date.' },
      { q: 'Is my financial data handled safely?', a: 'Authorized channels & access controls', d: 'Taxpayer and financial information is handled through authorized channels with appropriate access controls, in line with tax information disclosure restrictions.' },
      { q: 'Does an extension give me more time to pay?', a: 'No, only more time to file', d: 'An extension (such as Form 4868 or 7004) generally extends the time to file, not the time to pay tax owed. We help you estimate what may be due.' },
      { q: 'Is FBAR the same as Form 8938?', a: 'No, different rules; both may apply', d: 'FBAR (FinCEN Form 114) and Form 8938 have different thresholds and reporting rules. They are not substitutes for one another, and some taxpayers must file both.' }
    ];
    const doubts = DB.map((d, i) => {
      const open = s.doubt === i, dark = i % 3 === 0;
      return {
        n: '0' + (i + 1), q: d.q, a: d.a, detail: d.d, open, expanded: String(open), toggle: () => this.setState({ doubt: open ? -1 : i }),
        card: 'display:flex;flex-direction:column;gap:16px;min-height:250px;border-radius:24px;padding:24px;' + (dark ? 'background:#0B1A1E;color:#FFFFFF' : 'background:#F7F5F0;color:#0B1A1E;box-shadow:inset 0 0 0 1px #E4E0D6'),
        numStyle: 'font-size:12px;color:' + (dark ? '#6EE7C2' : '#0D7A63'),
        btn: 'display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:52px;padding:0 16px;border-radius:14px;text-align:left;font-size:14px;' + (dark ? 'background:#6EE7C2;color:#0B1A1E' : 'background:#0B1A1E;color:#6EE7C2'),
        icon: 'flex:none;transition:transform .3s;transform:rotate(' + (open ? 90 : 0) + 'deg)',
        detailStyle: 'margin:0;font-size:14px;line-height:1.6;color:' + (dark ? '#C9D6D8' : '#4C5654')
      };
    });

    // FAQ
    const FQ = [
      { q: 'What services does Smart Tax Expertss provide?', a: 'US tax preparation, bookkeeping and accounting, payroll management, tax planning, accounts payable and receivable, foreign tax compliance and tax filing support.' },
      { q: 'Do you work directly with US clients?', a: 'Yes. We support individuals, self-employed professionals, small businesses and corporations based on their accounting and tax requirements.' },
      { q: 'Do you provide outsourcing services to US CPA firms?', a: 'Yes. We support CPA firms and accounting practices with tax preparation, bookkeeping, accounting, payroll and other agreed tasks, working to your workflows and review procedures.' },
      { q: 'How experienced is your team?', a: 'Smart Tax Expertss brings 5–10 years of experience and has served 250–500 clients, with a team of accountants, reviewers and tax specialists.' },
      { q: 'Can you prepare both individual and business tax returns?', a: 'Yes. Our scope covers Forms 1040, 1065, 1120, 1120-S, 990, 1041 and other applicable forms, depending on the taxpayer’s situation.' },
      { q: 'Do you support foreign tax compliance?', a: 'Yes. We provide preparation support for FBAR, Form 8938 and Forms 5471, 5472, 8865, 8858, 3520, 3520-A and 8621, subject to the relevant requirements and technical review.' },
      { q: 'Do you provide tax filing in addition to preparation?', a: 'Yes, where the engagement includes the necessary authorization and filing arrangements. Preparation, review, approval and submission responsibilities are defined clearly.' },
      { q: 'Can you work with our existing CPA or accounting team?', a: 'Yes. We work according to agreed workflows, software environments, reporting requirements and reviewer responsibilities.' },
      { q: 'What documents are needed to start?', a: 'It varies by service, but typically bank statements, financial statements, invoices, receipts, payroll reports, previous tax returns and relevant taxpayer or business information.' },
      { q: 'How do we get started?', a: 'Contact our team and explain your requirements. We’ll discuss the assignment, expected workload, documents, software and a suitable engagement arrangement.' }
    ];
    const faqs = FQ.map((f, i) => {
      const open = s.faq === i;
      return {
        q: f.q, a: f.a, open, expanded: String(open), toggle: () => this.setState({ faq: open ? -1 : i }),
        iconStyle: 'flex:none;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;font-size:22px;transition:transform .3s,background .3s;' + (open ? 'transform:rotate(45deg);background:#0B1A1E;color:#FFFFFF' : 'background:#ECE8DF;color:#0B1A1E')
      };
    });

    const BUSINESS_TYPES = [
      'CPA firm / accounting practice',
      'Small or medium-sized business',
      'Corporation / established business',
      'Startup or entrepreneur',
      'Individual or self-employed taxpayer'
    ];
    const CATEGORY_MAP = {
      'CPA firm / accounting practice': 'cpa',
      'Small or medium-sized business': 'business',
      'Corporation / established business': 'business',
      'Startup or entrepreneur': 'business',
      'Individual or self-employed taxpayer': 'individual'
    };
    const SERVICE_SLUGS = ['tax-prep-outsourcing', 'bookkeeping-services', 'payroll-management', 'tax-planning', 'accounts-payable-receivable', 'foreign-compliance', 'tax-filing'];
    const formChips = SV.map((v, i) => {
      const on = s.chips[i];
      return {
        name: v.short, pressed: String(on), toggle: () => this.setState(st => { const c = st.chips.slice(); c[i] = !c[i]; return { chips: c }; }),
        style: 'min-height:40px;padding:0 14px;border-radius:999px;font-size:13px;' + (on ? 'background:#0B1A1E;color:#FFFFFF' : 'background:#FFFFFF;color:#0B1A1E;box-shadow:inset 0 0 0 1.5px #C9C3B6')
      };
    });
    const footLinks = SV.map(v => ({ name: v.name, href: v.href })).concat([{ name: 'CPA Firm Outsourcing', href: '#builder' }]);
    const sw = ['Drake Tax', 'Intuit ProConnect Tax', 'Thomson Reuters UltraTax CS', 'CCH ProSystem', 'Intuit ProSeries', 'QuickBooks Online', 'QuickBooks Desktop'];

    return {
      softwareLoop: sw.concat(sw),
      orbNodes, orbX: (200 + 164 * Math.cos(oa)).toFixed(1), orbY: (200 + 164 * Math.sin(oa)).toFixed(1),
      orbTag: SV[s.orb].tag.split(' · ')[0] + ' / 07', orbName: SV[s.orb].name, orbGo: () => this.setState(st => ({ svc: st.orb, auto: false })),
      flowNodes, flowNum: String(s.flow + 1), flowWho: cf.who, flowTitle: cf.title, flowText: cf.text, flowCta: cf.cta, flowGo: goSvc(cf.svc), goForeign: goSvc(5),
      svcTabs, cur, exploreHref: CORE_ROUTES[s.svc] || (SV[s.svc] || {}).href || '/services', autoNote: s.auto ? 'Auto-playing. Select a service to explore at your pace.' : 'Showing your selection.',
      s0: s.svc === 0, s1: s.svc === 1, s2: s.svc === 2, s3: s.svc === 3, s4: s.svc === 4, s5: s.svc === 5, s6: s.svc === 6,
      recRows, wf,
      aging, agingTitle: isAR ? 'Total receivables outstanding (sample)' : 'Total payables outstanding (sample)', agingTotal: money(av.reduce((a, b) => a + b, 0)),
      arPressed: String(isAR), apPressed: String(!isAR), arTab: pill(isAR, true), apTab: pill(!isAR, true),
      showAR: () => this.setState({ apar: 'ar' }), showAP: () => this.setState({ apar: 'ap' }),
      fbar: s.fbar, fbarFmt: money(s.fbar), onFbar: (e) => this.setState({ fbar: Number(e.target.value) }),
      fbarBar: 'position:absolute;left:0;top:0;bottom:0;border-radius:8px;width:' + fbarPct.toFixed(1) + '%;background:' + (over ? '#F2B544' : '#6EE7C2'),
      fbarMsg: over ? 'Above $10,000 at some point in the year: an FBAR (FinCEN Form 114) may be required for US persons. Form 8938 has separate thresholds to check.' : 'At or below $10,000 combined: FBAR is generally not required, though other reporting such as Form 8938 can still apply.',
      fbarBox: 'margin-top:14px;border-radius:12px;padding:12px 14px;font-size:13px;line-height:1.5;' + (over ? 'background:rgba(242,181,68,0.14);color:#F7D394;box-shadow:inset 0 0 0 1px rgba(242,181,68,0.4)' : 'background:rgba(110,231,194,0.1);color:#B5F3DE;box-shadow:inset 0 0 0 1px rgba(110,231,194,0.35)'),
      intlForms, fileSteps,
      formCats, formTiles,
      swTiles, swCur, swSvc,
      whoTabs, whoCur, pickList, heat, pickCount: String(pickCount), peakMonth: pickCount ? MN[peakIdx] : '—', cadence,
      procSteps, procNum: '0' + (s.proc + 1), procTitle: cp.title, procText: cp.text,
      procBar: 'height:100%;background:#6EE7C2;width:' + (s.proc / 6 * 100).toFixed(1) + '%',
      doubts, faqs, formChips, footLinks,
      notSent: !s.sent, sent: s.sent,
      fname: s.fname, femail: s.femail, fphone: s.fphone, fbiz: s.fbiz, freq: s.freq,
      bizOpen: s.bizOpen, ferr: s.ferr, sending: s.sending,
      businessTypes: BUSINESS_TYPES, businessCat: (b) => CATEGORY_MAP[b] || 'business',
      setFname: (e) => this.setState({ fname: e.target.value, ferr: { ...s.ferr, name: undefined } }),
      setFemail: (e) => this.setState({ femail: e.target.value, ferr: { ...s.ferr, email: undefined } }),
      setFphone: (e) => this.setState({ fphone: e.target.value, ferr: { ...s.ferr, phone: undefined } }),
      setFreq: (e) => this.setState({ freq: e.target.value, ferr: { ...s.ferr, msg: undefined } }),
      setBiz: (b) => this.setState({ fbiz: b, bizOpen: false, ferr: { ...s.ferr, biz: undefined } }),
      toggleBiz: () => this.setState(st => ({ bizOpen: !st.bizOpen, ferr: { ...st.ferr, biz: undefined } })),
      onSubmit: (e) => {
        e.preventDefault();
        const errors = {};
        const name = s.fname.trim();
        const email = s.femail.trim().toLowerCase();
        const phone = s.fphone.trim();
        const biz = s.fbiz;
        const msg = s.freq.trim();
        const selected = s.chips.map((on, i) => on ? i : -1).filter(i => i >= 0);
        if (!name) errors.name = 'Full name is required.';
        if (!email || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) errors.email = 'Please enter a valid email address.';
        const phoneDigits = phone.replace(/\D/g, '').length;
        if (!phone || !/^\+?[\d\s().-]+$/.test(phone) || phoneDigits < 7 || phoneDigits > 15) errors.phone = 'Please enter a valid phone number.';
        if (!biz) errors.biz = 'Please select your business type.';
        if (selected.length === 0) errors.services = 'Please select at least one service.';
        if (!msg) errors.msg = 'Please describe your requirements.';
        if (Object.keys(errors).length) { this.setState({ ferr: errors }); return; }
        this.setState({ sending: true, ferr: {} });
        const payload = {
          fullName: name,
          email,
          phone,
          category: CATEGORY_MAP[biz] || 'business',
          serviceSlug: SERVICE_SLUGS[selected[0]] || 'tax-prep-outsourcing',
          message: msg,
          preferredContactMethod: 'email',
          privacyConsent: true,
          sourcePage: window.location.pathname || '/services',
        };
        apiClient.post('/consultations', payload)
          .then(() => this.setState({ sending: false, sent: true }))
          .catch(() => this.setState({ sending: false, ferr: { form: 'Unable to submit your request right now. Please try again.' } }));
      }
    };
  }

  render() {
    const v = this.renderVals();
    return (
      <>




        <link rel="preconnect" href="https://fonts.googleapis.com" />


        <style>{"/* latin-ext */\n@font-face {\n  font-family: 'Instrument Serif';\n  font-style: italic;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/instrumentserif/v5/jizHRFtNs2ka5fXjeivQ4LroWlx-6zAjgn7MsNo.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Instrument Serif';\n  font-style: italic;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/cd3f7360-c8b7-4120-932d-232bdd527d4c\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Instrument Serif';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-6zsTjmbI.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Instrument Serif';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-6zUTjg.woff2) format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2JL7SUc.woff2) format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa0ZL7SUc.woff2) format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek-ext */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2ZL7SUc.woff2) format('woff2');\n  unicode-range: U+1F00-1FFF;\n}\n/* greek */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1pL7SUc.woff2) format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2pL7SUc.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa25L7SUc.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/b9efbd1c-12df-48a1-8038-3f30577300ff\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2JL7SUc.woff2) format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa0ZL7SUc.woff2) format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek-ext */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2ZL7SUc.woff2) format('woff2');\n  unicode-range: U+1F00-1FFF;\n}\n/* greek */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1pL7SUc.woff2) format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2pL7SUc.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa25L7SUc.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/b9efbd1c-12df-48a1-8038-3f30577300ff\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2JL7SUc.woff2) format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa0ZL7SUc.woff2) format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek-ext */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2ZL7SUc.woff2) format('woff2');\n  unicode-range: U+1F00-1FFF;\n}\n/* greek */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1pL7SUc.woff2) format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2pL7SUc.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa25L7SUc.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(\"/page-assets/b9efbd1c-12df-48a1-8038-3f30577300ff\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2JL7SUc.woff2) format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa0ZL7SUc.woff2) format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek-ext */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2ZL7SUc.woff2) format('woff2');\n  unicode-range: U+1F00-1FFF;\n}\n/* greek */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1pL7SUc.woff2) format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2pL7SUc.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa25L7SUc.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(\"/page-assets/b9efbd1c-12df-48a1-8038-3f30577300ff\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPx3cwhsk.woff2) format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPxTcwhsk.woff2) format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPxPcwhsk.woff2) format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPx_cwhsk.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPx7cwhsk.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/cf63b328-35c1-4f04-8195-7f827ac030d2\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPx3cwhsk.woff2) format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPxTcwhsk.woff2) format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPxPcwhsk.woff2) format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPx_cwhsk.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPx7cwhsk.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(\"/page-assets/cf63b328-35c1-4f04-8195-7f827ac030d2\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Space Grotesk';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPb54C-s0.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Space Grotesk';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPb94C-s0.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Space Grotesk';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/bd0ad2f3-ae48-4fb6-a596-314cf52bcf00\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Space Grotesk';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPb54C-s0.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Space Grotesk';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPb94C-s0.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Space Grotesk';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(\"/page-assets/bd0ad2f3-ae48-4fb6-a596-314cf52bcf00\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Space Grotesk';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPb54C-s0.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Space Grotesk';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPb94C-s0.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Space Grotesk';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(\"/page-assets/bd0ad2f3-ae48-4fb6-a596-314cf52bcf00\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n"}</style>


        <style>{"\nbody{margin:0;background:#F7F5F0}\na{color:#0D7A63}a:hover{color:#0A5C4B}\n*{box-sizing:border-box}\n.h{font-family:'Space Grotesk',Inter,sans-serif;letter-spacing:-0.02em}\n.serif{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-weight:400;letter-spacing:0}\n.mono{font-family:'JetBrains Mono',ui-monospace,monospace}\n.btn{display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:0 24px;border-radius:999px;font:600 15px Inter,sans-serif;text-decoration:none;cursor:pointer;border:0;transition:transform .25s ease,background .25s ease,box-shadow .25s ease,color .25s ease}\n.btn:hover{transform:translateY(-2px)}\n.btn-mint{background:#6EE7C2;color:#0B1A1E}.btn-mint:hover{background:#9AF0D5;color:#0B1A1E;box-shadow:0 12px 32px rgba(110,231,194,.28)}\n.btn-ghost{background:transparent;color:#FFFFFF;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.35)}.btn-ghost:hover{color:#FFFFFF;box-shadow:inset 0 0 0 1.5px #6EE7C2}\n.btn-ink{background:#0B1A1E;color:#FFFFFF}.btn-ink:hover{background:#0D7A63;color:#FFFFFF}\n.btn-line{background:transparent;color:#0B1A1E;box-shadow:inset 0 0 0 1.5px #0B1A1E}.btn-line:hover{color:#0D7A63;box-shadow:inset 0 0 0 1.5px #0D7A63}\n.arrow{display:inline-block;transition:transform .25s ease}.btn:hover .arrow,.lnk:hover .arrow,.doubt:hover .arrow{transform:translateX(4px)}\n.lnk{display:inline-flex;align-items:center;gap:8px;font-weight:600;text-decoration:none;color:#0D7A63;min-height:44px}\n.doubt{display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:0 22px;border-radius:14px;background:#0B1A1E;color:#6EE7C2;font:600 15px Inter,sans-serif;text-decoration:none;transition:all .25s ease}\n.doubt:hover{background:#0D7A63;color:#FFFFFF;transform:translateY(-2px)}\n.tab{cursor:pointer;border:0;font:600 14px Inter,sans-serif;transition:all .25s ease}\n.lift{transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s ease}.lift:hover{transform:translateY(-6px);box-shadow:0 26px 50px rgba(11,26,30,.12)}\n.fill{transition:width .7s cubic-bezier(.2,.8,.2,1),height .7s cubic-bezier(.2,.8,.2,1),left .7s cubic-bezier(.2,.8,.2,1)}\n.ring-spin{animation:spin 50s linear infinite}.ring-spin-r{animation:spin 36s linear infinite reverse}\n.flow{stroke-dasharray:4 8;animation:dash 1.2s linear infinite}\n.pulse{transform-box:fill-box;transform-origin:center;animation:pulse 2.2s ease-out infinite}\n.float1{animation:float 6s ease-in-out infinite}.float2{animation:float 7s ease-in-out -2s infinite}.float3{animation:float 8s ease-in-out -4s infinite}\n.marquee{display:flex;gap:56px;width:max-content;animation:marquee 32s linear infinite}\n.travel{position:absolute;top:-5px;width:12px;height:12px;border-radius:50%;background:#6EE7C2;box-shadow:0 0 0 6px rgba(110,231,194,.22);animation:travel 7s linear infinite}\n.sl{animation:slideIn .6s cubic-bezier(.2,.8,.2,1) both}\n.pop{animation:pop .5s cubic-bezier(.2,1.4,.4,1) both}\n.fx{transform-origin:left;animation:fillX .9s cubic-bezier(.2,.8,.2,1) both}\n.gy{transform-origin:bottom;animation:growY .9s cubic-bezier(.2,.8,.2,1) both}\n.draw{stroke-dasharray:900;stroke-dashoffset:900;animation:draw 2.2s .3s ease forwards}\n.fadeA{animation:fadeOut .5s 2.4s ease forwards}\n.fadeB{opacity:0;animation:fadeIn .5s 2.6s ease forwards}\n.scan{animation:scan 2.8s ease-in-out infinite}\n.today{animation:today 8s ease-in-out infinite alternate}\n.blink{animation:blink 1.6s ease-in-out infinite}\n.bar-prog{transform-origin:left;animation:fillX 9s linear both}\n.panel-in{animation:fade .5s ease both}\n.subnav a{color:#4C5654;text-decoration:none;font:500 14px Inter,sans-serif;padding:10px 14px;border-radius:999px;white-space:nowrap;transition:all .2s ease}\n.subnav a:hover{color:#0B1A1E;background:#ECE8DF}\ninput[type=range]{width:100%;height:28px;cursor:pointer}\ninput,select,textarea{font:400 15px Inter,sans-serif}\n@keyframes spin{to{transform:rotate(360deg)}}\n@keyframes dash{to{stroke-dashoffset:-24}}\n@keyframes pulse{0%{transform:scale(1);opacity:1}70%{transform:scale(2.6);opacity:0}100%{opacity:0}}\n@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}\n@keyframes marquee{to{transform:translateX(-50%)}}\n@keyframes travel{from{left:0%}to{left:100%}}\n@keyframes slideIn{from{opacity:0;transform:translateX(-28px)}to{opacity:1;transform:none}}\n@keyframes pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}\n@keyframes fillX{from{transform:scaleX(0)}to{transform:scaleX(1)}}\n@keyframes growY{from{transform:scaleY(0)}to{transform:scaleY(1)}}\n@keyframes draw{to{stroke-dashoffset:0}}\n@keyframes fadeOut{to{opacity:0}}\n@keyframes fadeIn{to{opacity:1}}\n@keyframes scan{0%,100%{top:8%}50%{top:86%}}\n@keyframes today{from{left:4%}to{left:88%}}\n@keyframes blink{0%,100%{opacity:1}50%{opacity:.35}}\n@keyframes fade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}\n@keyframes rv{from{opacity:0;transform:translateY(48px)}to{opacity:1;transform:none}}\n@supports (animation-timeline: view()){\n.rv{animation:rv linear both;animation-timeline:view();animation-range:entry 0% cover 22%}\n}\n@media (prefers-reduced-motion: reduce){*{animation:none !important;transition:none !important}.fadeB{opacity:1}.draw{stroke-dashoffset:0}}\n"}</style>





        <div className="main-services-page" style={cssToStyle("font-family: Inter, sans-serif; color: #0B1A1E; background: #F7F5F0; min-height: 100vh")} data-canvas-width="1440" data-canvas-height="8000" data-document-role="page" data-label="Main services page — US Accounting & Tax">


          {/*  ================= TOP BAR =================  */}


          <header style={cssToStyle("background: #0B1A1E; border-bottom: 1px solid rgba(255,255,255,0.08)")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto; padding: 18px 32px; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap")}>

              <a href="#top" style={cssToStyle("display: flex; align-items: center; gap: 12px; text-decoration: none; color: #FFFFFF")}>

                <span style={cssToStyle("width: 38px; height: 38px; border-radius: 10px; background: #6EE7C2; display: grid; place-items: center; color: #0B1A1E; font: 700 16px 'Space Grotesk', sans-serif")}>ST</span>


                <span className="h" style={cssToStyle("font-size: 19px; font-weight: 600")}>Smart Tax Expertss</span>

              </a>


              <nav aria-label="Main" style={cssToStyle("display: flex; gap: 28px; flex-wrap: wrap")}>

                <a href="#explorer" style={cssToStyle("color: #FFFFFF; text-decoration: none; font-size: 15px; font-weight: 600")}>Services</a>


                <a href="#builder" style={cssToStyle("color: #A9BBBE; text-decoration: none; font-size: 15px")}>CPA Outsourcing</a>


                <a href="#software" style={cssToStyle("color: #A9BBBE; text-decoration: none; font-size: 15px")}>Software</a>


                <a href="#consult" style={cssToStyle("color: #A9BBBE; text-decoration: none; font-size: 15px")}>Contact</a>

              </nav>


              <a href="#consult" className="btn btn-mint" style={cssToStyle("min-height: 44px; padding: 0 20px; font-size: 14px")}>Discuss Your Requirements</a>

            </div>

          </header>



          {/*  ================= 1. HERO (same pattern) =================  */}


          <section id="top" style={cssToStyle("background: #0B1A1E; color: #FFFFFF; position: relative; overflow: hidden")}>

            <div aria-hidden="true" style={cssToStyle("position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 56px 56px")}></div>


            <div style={cssToStyle("max-width: 1240px; margin: 0 auto; padding: 88px 32px 96px; display: flex; flex-wrap: wrap; gap: 56px; align-items: center; position: relative")}>

              <div style={cssToStyle("flex: 1 1 520px; min-width: 0")}>

                <nav aria-label="Breadcrumb" style={cssToStyle("font-size: 13px; color: #A9BBBE; margin-bottom: 28px")}>

                  <a href="#" style={cssToStyle("color: #A9BBBE; text-decoration: none")}>Home</a>

                  <span aria-hidden="true">/</span>

                  <span style={cssToStyle("color: #6EE7C2")}>Services</span>

                </nav>


                <p className="mono" style={cssToStyle("margin: 0 0 18px; font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: #6EE7C2")}>US Accounting · Tax · Outsourcing</p>


                <h1 className="h" style={cssToStyle("margin: 0; font-size: clamp(38px, 5vw, 64px); line-height: 1.1; font-weight: 700")}>
                  Every US accounting &amp; tax service, under{" "}
                  <span style={cssToStyle("color: #6EE7C2")}>one</span>{" "}
                  outsourcing relationship.
                </h1>


                <p style={cssToStyle("margin: 28px 0 0; font-size: 19px; line-height: 1.6; color: #C9D6D8; max-width: 590px")}>Bookkeeping builds the records. Accounting turns them into reports. Tax preparation decides how it is reported, and filing completes it. Smart Tax Expertss brings all seven services together for US businesses, individual taxpayers and CPA firms.</p>


                <div style={cssToStyle("display: flex; gap: 14px; flex-wrap: wrap; margin-top: 36px")}>

                  <a href="#consult" className="btn btn-mint">Discuss Your Requirements
                    <span className="arrow" aria-hidden="true">→</span></a>


                  <a href="#explorer" className="btn btn-ghost">Explore Our Services</a>

                </div>


                <div style={cssToStyle("display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); margin-top: 56px; border-top: 1px solid rgba(255,255,255,0.12)")}>

                  <div style={cssToStyle("padding: 22px 18px 0 0")}>

                    <div className="h" style={cssToStyle("font-size: 34px; font-weight: 700")}>5–10</div>


                    <div style={cssToStyle("font-size: 13px; color: #A9BBBE; margin-top: 4px")}>Years of experience</div>

                  </div>


                  <div style={cssToStyle("padding: 22px 18px 0 18px; border-left: 1px solid rgba(255,255,255,0.12)")}>

                    <div className="h" style={cssToStyle("font-size: 34px; font-weight: 700")}>250–500</div>


                    <div style={cssToStyle("font-size: 13px; color: #A9BBBE; margin-top: 4px")}>Clients served</div>

                  </div>


                  <div style={cssToStyle("padding: 22px 18px 0 18px; border-left: 1px solid rgba(255,255,255,0.12)")}>

                    <div className="h" style={cssToStyle("font-size: 34px; font-weight: 700")}>7</div>


                    <div style={cssToStyle("font-size: 13px; color: #A9BBBE; margin-top: 4px")}>Core service lines</div>

                  </div>


                  <div style={cssToStyle("padding: 22px 0 0 18px; border-left: 1px solid rgba(255,255,255,0.12)")}>

                    <div className="h" style={cssToStyle("font-size: 34px; font-weight: 700")}>6</div>


                    <div style={cssToStyle("font-size: 13px; color: #A9BBBE; margin-top: 4px")}>Professional tax &amp; accounting platforms</div>

                  </div>

                </div>

              </div>



              {/*  Service orbit  */}


              <div className="svc-orbit-wrap" style={cssToStyle("flex: 1 1 440px; min-width: 0; display: flex; justify-content: center")}>

                <div className="svc-orbit-box" style={cssToStyle("position: relative; width: 100%; max-width: 500px; aspect-ratio: 1 / 1")}>

                  <svg viewBox="0 0 400 400" aria-hidden="true" style={cssToStyle("position: absolute; inset: 0; width: 100%; height: 100%")}>

                    <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(255,255,255,0.06)"></circle>


                    <g className="ring-spin" style={cssToStyle("transform-origin: 200px 200px")}><circle cx="200" cy="200" r="164" fill="none" stroke="rgba(110,231,194,0.35)" strokeDasharray="2 9"></circle></g>


                    <g className="ring-spin-r" style={cssToStyle("transform-origin: 200px 200px")}><circle cx="200" cy="200" r="120" fill="none" stroke="rgba(255,255,255,0.12)" strokeDasharray="40 14"></circle></g>


                    <line className="flow" x1="200" y1="200" x2={v.orbX} y2={v.orbY} stroke="#6EE7C2" strokeWidth="2"></line>


                    <circle className="pulse" cx={v.orbX} cy={v.orbY} r="10" fill="#6EE7C2" opacity="0.6"></circle>

                  </svg>


                  <div style={cssToStyle("position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 44%; aspect-ratio: 1 / 1; border-radius: 50%; background: #12262B; border: 1px solid rgba(110,231,194,0.45); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 18px; box-shadow: 0 0 80px rgba(110,231,194,0.12)")}>

                    <div className="mono" style={cssToStyle("font-size: 11px; color: #6EE7C2; letter-spacing: 0.12em")}>{v.orbTag}</div>


                    <div className="h panel-in" style={cssToStyle("font-size: clamp(16px, 2vw, 22px); font-weight: 700; line-height: 1.15; margin-top: 8px")}>{v.orbName}</div>


                    <a href="#explorer" onClick={v.orbGo} className="lnk" style={cssToStyle("font-size: 13px; color: #6EE7C2; min-height: 36px; margin-top: 4px")}>See how it works
                      <span className="arrow" aria-hidden="true">→</span></a>

                  </div>


                  {(v.orbNodes || []).map((n, index) => (
                    <React.Fragment key={index}>


                      <button type="button" onClick={n.pick} aria-label={n.label} aria-pressed={n.pressed} className="tab" style={cssToStyle(n.style)}>{n.code}</button>


                    </React.Fragment>
                  ))}


                  <div className="float1" style={cssToStyle("position: absolute; top: 2%; right: -2%; background: #12262B; border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; padding: 10px 14px")}>

                    <div className="mono" style={cssToStyle("font-size: 10px; color: #6EE7C2")}>FORM 1040</div>


                    <div style={cssToStyle("font-size: 13px; font-weight: 600; margin-top: 2px")}>Ready for review</div>

                  </div>


                  <div className="float2" style={cssToStyle("position: absolute; bottom: 4%; left: -4%; background: #12262B; border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; padding: 10px 14px")}>

                    <div className="mono" style={cssToStyle("font-size: 10px; color: #6EE7C2")}>BANK RECONCILIATION</div>


                    <div style={cssToStyle("font-size: 13px; font-weight: 600; margin-top: 2px")}>$0.00 difference</div>

                  </div>


                  <div className="float3" style={cssToStyle("position: absolute; bottom: 2%; right: 0; background: #F2B544; color: #0B1A1E; border-radius: 14px; padding: 10px 14px")}>

                    <div className="mono" style={cssToStyle("font-size: 10px")}>FORM 941</div>


                    <div style={cssToStyle("font-size: 13px; font-weight: 600; margin-top: 2px")}>Quarter reconciled</div>

                  </div>

                </div>

              </div>

            </div>

          </section>



          {/*  ================= SOFTWARE MARQUEE =================  */}


          <section aria-label="Software we work with" style={cssToStyle("background: #12262B; overflow: hidden; padding: 20px 0; border-top: 1px solid rgba(255,255,255,0.06)")}>

            <div className="marquee">

              {(v.softwareLoop || []).map((sw, index) => (
                <React.Fragment key={index}>


                  <span className="h" style={cssToStyle("color: #A9BBBE; font-size: 18px; font-weight: 500; white-space: nowrap; display: inline-flex; align-items: center; gap: 56px")}>{sw}
                    <span aria-hidden="true" style={cssToStyle("color: #6EE7C2")}>✦</span></span>


                </React.Fragment>
              ))}

            </div>

          </section>



          {/*  ================= STICKY SUB-NAV =================  */}


          <nav aria-label="On this page" className="subnav" style={cssToStyle("position: sticky; top: 0; z-index: 20; background: rgba(247,245,240,0.92); backdrop-filter: blur(10px); border-bottom: 1px solid #E4E0D6")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto; padding: 10px 32px; display: flex; gap: 4px; overflow-x: auto; align-items: center")}>

              <span className="mono" style={cssToStyle("font-size: 12px; color: #0D7A63; margin-right: 12px; white-space: nowrap")}>ON THIS PAGE</span>


              <a href="#flow">How it connects</a>


              <a href="#explorer">Services</a>


              <a href="#forms">Forms</a>


              <a href="#software">Software</a>


              <a href="#builder">Build your scope</a>


              <a href="#process">Process</a>


              <a href="#doubts">Quick answers</a>


              <a href="#faq">FAQ</a>

            </div>

          </nav>



          {/*  ================= 2. CONNECTED FLOW =================  */}


          <section id="flow" style={cssToStyle("padding: 112px 32px 104px")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto")}>

              <div className="rv" style={cssToStyle("display: flex; flex-wrap: wrap; gap: 32px; justify-content: space-between; align-items: flex-end")}>

                <div style={cssToStyle("flex: 1 1 560px; min-width: 0")}>

                  <p className="mono" style={cssToStyle("margin: 0 0 14px; font-size: 13px; letter-spacing: 0.14em; color: #0D7A63")}>HOW OUR SERVICES CONNECT</p>


                  <h2 className="h" style={cssToStyle("margin: 0; font-size: clamp(34px, 4.4vw, 58px); line-height: 1.02; font-weight: 700")}>One transaction.
                    <span className="serif" style={cssToStyle("font-size: 1.1em")}>Seven</span>
                    services it passes through.</h2>

                </div>


                <p style={cssToStyle("flex: 1 1 360px; margin: 0; font-size: 17px; line-height: 1.65; color: #4C5654")}>A customer payment today becomes a ledger entry, a line on your financial statements, a number in your tax projection and finally a figure on a filed return. Tap any stage to see who handles it.</p>

              </div>



              <div className="rv svc-flow-card" style={cssToStyle("margin-top: 56px; background: #FFFFFF; border: 1px solid #E4E0D6; border-radius: 32px; padding: 48px 36px 36px")}>

                <div className="svc-flow-track-wrap" style={cssToStyle("position: relative; margin: 0 4% 0")}>

                  <div className="svc-flow-track-line" aria-hidden="true" style={cssToStyle("position: absolute; left: 0; right: 0; top: 31px; height: 2px; background: #E4E0D6")}>

                    <span className="travel"></span>
                    <span className="travel" style={cssToStyle("animation-delay: -2.3s")}></span>
                    <span className="travel" style={cssToStyle("animation-delay: -4.6s")}></span>

                  </div>


                  <div className="svc-flow-grid" style={cssToStyle("position: relative; display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 12px")}>

                    {(v.flowNodes || []).map((f, index) => (
                      <React.Fragment key={index}>


                        <button type="button" className="tab" onClick={f.pick} aria-pressed={f.pressed} style={cssToStyle("background: transparent; display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 0; min-height: 120px")}>

                          <span style={cssToStyle(f.dot)}>{f.n}</span>


                          <span style={cssToStyle(f.label)}>{f.name}</span>

                        </button>


                      </React.Fragment>
                    ))}

                  </div>

                </div>


                <div className="panel-in" style={cssToStyle("margin-top: 28px; display: flex; flex-wrap: wrap; gap: 28px; align-items: center; justify-content: space-between; background: #F7F5F0; border-radius: 22px; padding: 26px 28px")}>

                  <div style={cssToStyle("flex: 1 1 520px; min-width: 0")}>

                    <div className="mono" style={cssToStyle("font-size: 12px; color: #0D7A63; letter-spacing: 0.1em")}>STAGE {v.flowNum} · HANDLED BY {v.flowWho}</div>


                    <div className="h" style={cssToStyle("font-size: 26px; font-weight: 700; margin-top: 8px")}>{v.flowTitle}</div>


                    <p style={cssToStyle("margin: 8px 0 0; font-size: 16px; line-height: 1.6; color: #4C5654")}>{v.flowText}</p>

                  </div>


                  <a href="#explorer" onClick={v.flowGo} className="btn btn-ink">{v.flowCta}
                    <span className="arrow" aria-hidden="true">→</span></a>

                </div>


                <p style={cssToStyle("margin: 18px 0 0; font-size: 14px; color: #4C5654")}>Have overseas accounts or foreign owners?
                  <a href="#explorer" onClick={v.goForeign} style={cssToStyle("font-weight: 600")}>Foreign tax compliance runs alongside tax preparation →</a></p>

              </div>

            </div>

          </section>



          {/*  ================= 3. SERVICE EXPLORER =================  */}


          <section id="explorer" style={cssToStyle("padding: 104px 32px; background: #FFFFFF; border-top: 1px solid #E4E0D6; border-bottom: 1px solid #E4E0D6")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto")}>

              <div className="rv" style={cssToStyle("display: flex; flex-wrap: wrap; gap: 32px; justify-content: space-between; align-items: flex-end")}>

                <div style={cssToStyle("flex: 1 1 600px; min-width: 0")}>

                  <p className="mono" style={cssToStyle("margin: 0 0 14px; font-size: 13px; letter-spacing: 0.14em; color: #0D7A63")}>OUR CORE SERVICES</p>


                  <h2 className="h" style={cssToStyle("margin: 0; font-size: clamp(34px, 4.4vw, 58px); line-height: 1.02; font-weight: 700")}>Watch each service
                    <span className="serif" style={cssToStyle("font-size: 1.1em")}>at work.</span></h2>

                </div>


                <p style={cssToStyle("flex: 1 1 360px; margin: 0; font-size: 17px; line-height: 1.65; color: #4C5654")}>Every service can be engaged on its own or as part of a broader accounting arrangement. Choose one to see what it does, what it covers and where to go next.</p>

              </div>



              <div style={cssToStyle("display: flex; flex-wrap: wrap; gap: 28px; margin-top: 48px; align-items: flex-start")}>

                {/*  list  */}


                <div role="tablist" aria-label="Services" style={cssToStyle("flex: 1 1 300px; min-width: 0; display: grid; gap: 8px")}>

                  {(v.svcTabs || []).map((t, index) => (
                    <React.Fragment key={index}>


                      <button type="button" role="tab" aria-selected={t.pressed} onClick={t.pick} className="tab" style={cssToStyle(t.style)}>

                        <span className="mono" style={cssToStyle(t.numStyle)}>{t.num}</span>


                        <span style={cssToStyle("flex: 1; text-align: left")}>{t.name}</span>


                        <span aria-hidden="true" style={cssToStyle(t.arrowStyle)}>→</span>


                        {(t.showBar) && (
                          <React.Fragment>


                            <span aria-hidden="true" style={cssToStyle("position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: rgba(110,231,194,0.2)")}><span className="bar-prog" style={cssToStyle("display: block; height: 100%; background: #6EE7C2")}></span></span>


                          </React.Fragment>
                        )}

                      </button>


                    </React.Fragment>
                  ))}


                  <p style={cssToStyle("font-size: 13px; color: #4C5654; margin: 10px 4px 0")}>{v.autoNote}</p>

                </div>



                {/*  stage  */}


                <div role="tabpanel" style={cssToStyle("flex: 999 1 640px; min-width: 0")}>

                  <div style={cssToStyle("position: relative; background: #0B1A1E; color: #FFFFFF; border-radius: 28px; padding: 28px; min-height: 380px; overflow: hidden")}>

                    <div aria-hidden="true" style={cssToStyle("position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px); background-size: 32px 32px")}></div>


                    <div style={cssToStyle("position: relative")}>

                      <div style={cssToStyle("display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; align-items: baseline")}>

                        <div className="mono" style={cssToStyle("font-size: 12px; color: #6EE7C2; letter-spacing: 0.12em")}>{v.cur.tag}</div>


                        <div className="mono" style={cssToStyle("font-size: 11px; color: #A9BBBE")}>{v.cur.sceneLabel}</div>

                      </div>



                      {/*  S0 TAX PREP  */}


                      {(v.s0) && (
                        <React.Fragment>


                          <div style={cssToStyle("display: flex; flex-wrap: wrap; gap: 22px; margin-top: 22px; align-items: center")}>

                            <div style={cssToStyle("flex: 1 1 200px; display: grid; gap: 10px")}>

                              <div className="sl" style={cssToStyle("animation-delay: .1s; background: #12262B; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 14px")}><div className="mono" style={cssToStyle("font-size: 11px; color: #6EE7C2")}>W-2</div>
                                <div style={cssToStyle("font-size: 14px; margin-top: 2px")}>Employment wages</div></div>


                              <div className="sl" style={cssToStyle("animation-delay: .4s; background: #12262B; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 14px")}><div className="mono" style={cssToStyle("font-size: 11px; color: #6EE7C2")}>1099-NEC</div>
                                <div style={cssToStyle("font-size: 14px; margin-top: 2px")}>Freelance income</div></div>


                              <div className="sl" style={cssToStyle("animation-delay: .7s; background: #12262B; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 14px")}><div className="mono" style={cssToStyle("font-size: 11px; color: #6EE7C2")}>1099-DIV</div>
                                <div style={cssToStyle("font-size: 14px; margin-top: 2px")}>Investment dividends</div></div>


                              <div className="sl" style={cssToStyle("animation-delay: 1s; background: #12262B; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 14px")}><div className="mono" style={cssToStyle("font-size: 11px; color: #6EE7C2")}>RENTAL LEDGER</div>
                                <div style={cssToStyle("font-size: 14px; margin-top: 2px")}>Rental property</div></div>

                            </div>


                            <svg aria-hidden="true" style={cssToStyle("width: 48px; height: 120px; flex: none")}><path className="flow" d="M2 20 C30 20 30 60 58 60 M2 100 C30 100 30 60 58 60" fill="none" stroke="#6EE7C2" strokeWidth="2"></path></svg>


                            <div style={cssToStyle("flex: 1.4 1 280px; background: #FFFFFF; color: #0B1A1E; border-radius: 16px; padding: 20px; position: relative; overflow: hidden")}>

                              <div className="scan" aria-hidden="true" style={cssToStyle("position: absolute; left: 0; right: 0; height: 2px; background: rgba(13,122,99,0.35)")}></div>


                              <div style={cssToStyle("display: flex; justify-content: space-between; align-items: baseline")}><div className="h" style={cssToStyle("font-size: 20px; font-weight: 700")}>Form 1040</div>
                                <div className="mono" style={cssToStyle("font-size: 10px; color: #4C5654")}>INDIVIDUAL RETURN</div></div>


                              <div style={cssToStyle("display: grid; gap: 12px; margin-top: 16px")}>

                                <div><div style={cssToStyle("display: flex; justify-content: space-between; font-size: 12px; color: #4C5654")}><span>Wages</span>
                                  <span className="mono">W-2</span></div>
                                  <div style={cssToStyle("height: 8px; background: #EEF1EF; border-radius: 4px; margin-top: 5px")}><div className="fx" style={cssToStyle("animation-delay: .5s; width: 88%; height: 100%; background: #0B1A1E; border-radius: 4px")}></div></div></div>


                                <div><div style={cssToStyle("display: flex; justify-content: space-between; font-size: 12px; color: #4C5654")}><span>Business income</span>
                                  <span className="mono">SCH C</span></div>
                                  <div style={cssToStyle("height: 8px; background: #EEF1EF; border-radius: 4px; margin-top: 5px")}><div className="fx" style={cssToStyle("animation-delay: .8s; width: 54%; height: 100%; background: #0D7A63; border-radius: 4px")}></div></div></div>


                                <div><div style={cssToStyle("display: flex; justify-content: space-between; font-size: 12px; color: #4C5654")}><span>Interest &amp; dividends</span>
                                  <span className="mono">SCH B</span></div>
                                  <div style={cssToStyle("height: 8px; background: #EEF1EF; border-radius: 4px; margin-top: 5px")}><div className="fx" style={cssToStyle("animation-delay: 1.1s; width: 30%; height: 100%; background: #0D7A63; border-radius: 4px")}></div></div></div>


                                <div><div style={cssToStyle("display: flex; justify-content: space-between; font-size: 12px; color: #4C5654")}><span>Rental income</span>
                                  <span className="mono">SCH E</span></div>
                                  <div style={cssToStyle("height: 8px; background: #EEF1EF; border-radius: 4px; margin-top: 5px")}><div className="fx" style={cssToStyle("animation-delay: 1.4s; width: 42%; height: 100%; background: #0D7A63; border-radius: 4px")}></div></div></div>


                                <div><div style={cssToStyle("display: flex; justify-content: space-between; font-size: 12px; color: #4C5654")}><span>Self-employment tax</span>
                                  <span className="mono">SCH SE</span></div>
                                  <div style={cssToStyle("height: 8px; background: #EEF1EF; border-radius: 4px; margin-top: 5px")}><div className="fx" style={cssToStyle("animation-delay: 1.7s; width: 22%; height: 100%; background: #C2761A; border-radius: 4px")}></div></div></div>

                              </div>


                              <div className="pop" style={cssToStyle("animation-delay: 2.2s; margin-top: 16px; display: inline-flex; align-items: center; gap: 8px; background: #DDF5EC; color: #0A5C4B; border-radius: 999px; padding: 6px 12px; font-size: 13px; font-weight: 600")}><span aria-hidden="true">✓</span>
                                Return package ready for review</div>

                            </div>

                          </div>


                        </React.Fragment>
                      )}



                      {/*  S1 BOOKKEEPING  */}


                      {(v.s1) && (
                        <React.Fragment>


                          <div style={cssToStyle("display: flex; flex-wrap: wrap; gap: 16px; margin-top: 22px")}>

                            <div style={cssToStyle("flex: 1 1 260px; background: #12262B; border-radius: 16px; padding: 16px")}>

                              <div className="mono" style={cssToStyle("font-size: 11px; color: #A9BBBE")}>BANK STATEMENT</div>


                              {(v.recRows || []).map((r, index) => (
                                <React.Fragment key={index}>


                                  <div className="sl" style={cssToStyle(((r.delay) + "; display: flex; justify-content: space-between; gap: 10px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.07); font-size: 13px"))}><span>{r.d}</span>
                                    <span className="mono" style={cssToStyle(("color: " + (r.c)))}>{r.a}</span></div>


                                </React.Fragment>
                              ))}

                            </div>


                            <div style={cssToStyle("flex: 1 1 260px; background: #12262B; border-radius: 16px; padding: 16px")}>

                              <div className="mono" style={cssToStyle("font-size: 11px; color: #A9BBBE")}>GENERAL LEDGER</div>


                              {(v.recRows || []).map((r, index) => (
                                <React.Fragment key={index}>


                                  <div style={cssToStyle("display: flex; justify-content: space-between; gap: 10px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.07); font-size: 13px; align-items: center")}><span>{r.d}</span>
                                    <span className="pop" style={cssToStyle(r.checkStyle)}>{r.status}</span></div>


                                </React.Fragment>
                              ))}

                            </div>

                          </div>


                          <div style={cssToStyle("margin-top: 16px; display: flex; flex-wrap: wrap; gap: 14px; align-items: center; justify-content: space-between; background: #12262B; border-radius: 16px; padding: 14px 18px")}>

                            <span style={cssToStyle("font-size: 14px; color: #A9BBBE")}>Difference between bank and books</span>


                            <span style={cssToStyle("position: relative; display: inline-block; min-width: 230px; height: 30px; text-align: right")}>

                              <span className="h fadeA" style={cssToStyle("position: absolute; right: 0; font-size: 22px; font-weight: 700; color: #F2B544")}>$35.00 unmatched</span>


                              <span className="h fadeB" style={cssToStyle("position: absolute; right: 0; font-size: 22px; font-weight: 700; color: #6EE7C2")}>$0.00 · Reconciled</span>

                            </span>

                          </div>


                        </React.Fragment>
                      )}



                      {/*  S2 PAYROLL  */}


                      {(v.s2) && (
                        <React.Fragment>


                          <div style={cssToStyle("margin-top: 18px; display: flex; gap: 6px; align-items: flex-end; height: 250px; border-bottom: 1px solid rgba(255,255,255,0.2); padding: 0 4px")}>

                            {(v.wf || []).map((w, index) => (
                              <React.Fragment key={index}>


                                <div style={cssToStyle("flex: 1; height: 100%; position: relative; min-width: 0")}>

                                  <div className="mono" style={cssToStyle(w.lblStyle)}>{w.amt}</div>


                                  <div className="gy" style={cssToStyle(w.barStyle)}></div>

                                </div>


                              </React.Fragment>
                            ))}

                          </div>


                          <div style={cssToStyle("display: flex; gap: 6px; padding: 8px 4px 0")}>

                            {(v.wf || []).map((w, index) => (
                              <React.Fragment key={index}>


                                <div style={cssToStyle("flex: 1; min-width: 0; text-align: center; font-size: 11px; color: #C9D6D8; line-height: 1.3")}>{w.name}</div>


                              </React.Fragment>
                            ))}

                          </div>


                          <p style={cssToStyle("margin: 14px 0 0; font-size: 12px; color: #A9BBBE")}>Illustrative gross-to-net for one $5,000 pay period. Social Security 6.2% and Medicare 1.45% shown; other withholding varies by employee, state and elections.</p>


                        </React.Fragment>
                      )}



                      {/*  S3 TAX PLANNING  */}


                      {(v.s3) && (
                        <React.Fragment>


                          <div style={cssToStyle("position: relative; margin-top: 18px; background: #12262B; border-radius: 16px; padding: 18px 18px 12px")}>

                            <div style={cssToStyle("display: flex; gap: 18px; font-size: 12px; color: #C9D6D8; flex-wrap: wrap")}>

                              <span style={cssToStyle("display: inline-flex; gap: 6px; align-items: center")}><span style={cssToStyle("width: 18px; height: 3px; background: #F2B544")}></span>
                                Projected annual tax</span>


                              <span style={cssToStyle("display: inline-flex; gap: 6px; align-items: center")}><span style={cssToStyle("width: 18px; height: 3px; background: #6EE7C2")}></span>
                                Estimated payments made</span>

                            </div>


                            <div style={cssToStyle("position: relative; margin-top: 10px")}>

                              <svg role="img" aria-label="Illustrative chart of projected tax against cumulative quarterly estimated payments" style={cssToStyle("width: 100%; height: auto; display: block")}>

                                <g stroke="rgba(255,255,255,0.08)"><line x1="0" y1="40" x2="520" y2="40"></line>
                                  <line x1="0" y1="90" x2="520" y2="90"></line>
                                  <line x1="0" y1="140" x2="520" y2="140"></line>
                                  <line x1="0" y1="190" x2="520" y2="190"></line></g>


                                <path className="draw" d="M10 150 C90 130 160 110 230 92 S380 60 510 40" fill="none" stroke="#F2B544" strokeWidth="3" strokeLinecap="round"></path>


                                <path className="draw" d="M10 190 L110 190 L110 152 L190 152 L190 114 L330 114 L330 76 L470 76 L470 40 L510 40" fill="none" stroke="#6EE7C2" strokeWidth="3" strokeLinejoin="round" style={cssToStyle("animation-delay: .9s")}></path>


                                <circle cx="110" cy="152" r="6" fill="#6EE7C2"></circle>
                                <circle cx="190" cy="114" r="6" fill="#6EE7C2"></circle>
                                <circle cx="330" cy="76" r="6" fill="#6EE7C2"></circle>
                                <circle cx="470" cy="40" r="6" fill="#6EE7C2"></circle>

                              </svg>


                              <div className="today" aria-hidden="true" style={cssToStyle("position: absolute; top: 0; bottom: 0; width: 2px; background: rgba(255,255,255,0.5)")}><span className="mono" style={cssToStyle("position: absolute; top: -4px; left: 6px; font-size: 10px; background: #FFFFFF; color: #0B1A1E; padding: 2px 6px; border-radius: 4px; white-space: nowrap")}>TODAY</span></div>

                            </div>


                            <div style={cssToStyle("display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin-top: 10px")}>

                              <div className="pop" style={cssToStyle("animation-delay: .4s; background: #0B1A1E; border-radius: 10px; padding: 8px 10px")}><div className="mono" style={cssToStyle("font-size: 10px; color: #6EE7C2")}>Q1</div>
                                <div style={cssToStyle("font-size: 13px; font-weight: 600")}>Apr 15</div></div>


                              <div className="pop" style={cssToStyle("animation-delay: .7s; background: #0B1A1E; border-radius: 10px; padding: 8px 10px")}><div className="mono" style={cssToStyle("font-size: 10px; color: #6EE7C2")}>Q2</div>
                                <div style={cssToStyle("font-size: 13px; font-weight: 600")}>Jun 15</div></div>


                              <div className="pop" style={cssToStyle("animation-delay: 1s; background: #0B1A1E; border-radius: 10px; padding: 8px 10px")}><div className="mono" style={cssToStyle("font-size: 10px; color: #6EE7C2")}>Q3</div>
                                <div style={cssToStyle("font-size: 13px; font-weight: 600")}>Sep 15</div></div>


                              <div className="pop" style={cssToStyle("animation-delay: 1.3s; background: #F2B544; color: #0B1A1E; border-radius: 10px; padding: 8px 10px")}><div className="mono" style={cssToStyle("font-size: 10px")}>Q4</div>
                                <div style={cssToStyle("font-size: 13px; font-weight: 600")}>Jan 15</div></div>

                            </div>

                          </div>


                          <p style={cssToStyle("margin: 12px 0 0; font-size: 12px; color: #A9BBBE")}>Illustration: projected tax is tracked against federal estimated payment dates, so payments can be adjusted while quarters remain.</p>


                        </React.Fragment>
                      )}



                      {/*  S4 AP / AR  */}


                      {(v.s4) && (
                        <React.Fragment>


                          <div style={cssToStyle("display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; align-items: center; margin-top: 18px")}>

                            <div style={cssToStyle("display: flex; gap: 6px; background: #12262B; padding: 5px; border-radius: 999px")} role="group" aria-label="Choose aging report">

                              <button type="button" className="tab" onClick={v.showAR} aria-pressed={v.arPressed} style={cssToStyle(v.arTab)}>Receivables (AR)</button>


                              <button type="button" className="tab" onClick={v.showAP} aria-pressed={v.apPressed} style={cssToStyle(v.apTab)}>Payables (AP)</button>

                            </div>


                            <div style={cssToStyle("text-align: right")}><div style={cssToStyle("font-size: 12px; color: #A9BBBE")}>{v.agingTitle}</div>
                              <div className="h" style={cssToStyle("font-size: 24px; font-weight: 700")}>{v.agingTotal}</div></div>

                          </div>


                          <div style={cssToStyle("display: grid; gap: 12px; margin-top: 18px")}>

                            {(v.aging || []).map((g, index) => (
                              <React.Fragment key={index}>


                                <div style={cssToStyle("display: grid; grid-template-columns: 96px minmax(0, 1fr) 96px; gap: 12px; align-items: center")}>

                                  <span className="mono" style={cssToStyle("font-size: 12px; color: #C9D6D8")}>{g.b}</span>


                                  <span style={cssToStyle("height: 26px; background: rgba(255,255,255,0.06); border-radius: 8px; overflow: hidden")}><span className="fill" style={cssToStyle(g.style)}></span></span>


                                  <span className="mono" style={cssToStyle("font-size: 13px; text-align: right")}>{g.v}</span>

                                </div>


                              </React.Fragment>
                            ))}

                          </div>


                          <p style={cssToStyle("margin: 16px 0 0; font-size: 12px; color: #A9BBBE")}>Sample aging view. Payment authorization and release of funds always stay with your approved controls.</p>


                        </React.Fragment>
                      )}



                      {/*  S5 FOREIGN  */}


                      {(v.s5) && (
                        <React.Fragment>


                          <div style={cssToStyle("display: flex; flex-wrap: wrap; gap: 18px; margin-top: 18px")}>

                            <div style={cssToStyle("flex: 1.3 1 300px; background: #12262B; border-radius: 16px; padding: 18px")}>

                              <div className="h" style={cssToStyle("font-size: 17px; font-weight: 600")}>FBAR threshold check</div>


                              <label htmlFor="fbar" style={cssToStyle("display: block; font-size: 13px; color: #A9BBBE; margin-top: 12px")}>Highest combined value of your foreign accounts during the year:
                                <span className="h" style={cssToStyle("color: #FFFFFF; font-size: 22px; font-weight: 700")}>{v.fbarFmt}</span></label>


                              <input id="fbar" type="range" min="0" max="50000" step="500" value={v.fbar} onChange={v.onFbar} style={cssToStyle("accent-color: #6EE7C2")} />


                              <div style={cssToStyle("position: relative; height: 16px; background: rgba(255,255,255,0.08); border-radius: 8px; margin-top: 6px")}>

                                <div className="fill" style={cssToStyle(v.fbarBar)}></div>


                                <div aria-hidden="true" style={cssToStyle("position: absolute; left: 20%; top: -6px; bottom: -6px; width: 2px; background: #FFFFFF")}></div>

                              </div>


                              <div className="mono" style={cssToStyle("position: relative; height: 16px; font-size: 10px; color: #A9BBBE; margin-top: 4px")}><span style={cssToStyle("position: absolute; left: 20%; transform: translateX(-50%)")}>$10,000</span></div>


                              <div className="panel-in" style={cssToStyle(v.fbarBox)}>{v.fbarMsg}</div>

                            </div>


                            <div style={cssToStyle("flex: 1 1 220px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; align-content: start")}>

                              {(v.intlForms || []).map((x, index) => (
                                <React.Fragment key={index}>


                                  <div className="pop" style={cssToStyle(x.st)}><div className="mono" style={cssToStyle("font-size: 12px; color: #6EE7C2")}>{x.f}</div>
                                    <div style={cssToStyle("font-size: 12px; color: #C9D6D8; margin-top: 2px")}>{x.p}</div></div>


                                </React.Fragment>
                              ))}

                            </div>

                          </div>


                        </React.Fragment>
                      )}



                      {/*  S6 FILING  */}


                      {(v.s6) && (
                        <React.Fragment>


                          <div style={cssToStyle("position: relative; margin-top: 30px; padding: 0 4%")}>

                            <div aria-hidden="true" style={cssToStyle("position: absolute; left: 10%; right: 10%; top: 27px; height: 2px; background: rgba(255,255,255,0.12)")}><div className="fx" style={cssToStyle("animation-duration: 2.6s; animation-delay: .2s; height: 100%; background: #6EE7C2")}></div></div>


                            <div style={cssToStyle("position: relative; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px")}>

                              {(v.fileSteps || []).map((f, index) => (
                                <React.Fragment key={index}>


                                  <div style={cssToStyle("text-align: center")}>

                                    <div className="pop" style={cssToStyle(f.st)}>{f.i}</div>


                                    <div style={cssToStyle("font-size: 13px; font-weight: 600; margin-top: 10px")}>{f.t}</div>


                                    <div style={cssToStyle("font-size: 11px; color: #A9BBBE; margin-top: 2px; line-height: 1.35")}>{f.d}</div>

                                  </div>


                                </React.Fragment>
                              ))}

                            </div>

                          </div>


                          <div className="pop" style={cssToStyle("animation-delay: 2.9s; margin-top: 26px; background: #12262B; border-radius: 16px; padding: 14px 18px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between")}>

                            <span style={cssToStyle("font-size: 14px")}><span className="blink" style={cssToStyle("display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #6EE7C2; margin-right: 8px")}></span>
                              Acknowledgment tracked · rejections reviewed and resubmitted</span>


                            <span className="mono" style={cssToStyle("font-size: 12px; color: #F2B544")}>EXTENSIONS: 4868 · 7004 · 8868</span>

                          </div>


                          <p style={cssToStyle("margin: 12px 0 0; font-size: 12px; color: #A9BBBE")}>An extension generally gives more time to file, not more time to pay tax owed.</p>


                        </React.Fragment>
                      )}

                    </div>

                  </div>



                  {/*  content under stage  */}


                  <div className="panel-in" style={cssToStyle("display: flex; flex-wrap: wrap; gap: 32px; margin-top: 32px")}>

                    <div style={cssToStyle("flex: 1.3 1 360px; min-width: 0")}>

                      <h3 className="h" style={cssToStyle("margin: 0; font-size: 34px; font-weight: 700; line-height: 1.1")}>{v.cur.name}</h3>


                      <p style={cssToStyle("font-size: 17px; line-height: 1.65; color: #4C5654; margin: 14px 0 0")}>{v.cur.intro}</p>


                      <ul style={cssToStyle("list-style: none; padding: 0; margin: 22px 0 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 10px 20px")}>

                        {(v.cur.items || []).map((li, index) => (
                          <React.Fragment key={index}>


                            <li style={cssToStyle("display: flex; gap: 10px; align-items: flex-start; font-size: 15px; line-height: 1.45")}><span aria-hidden="true" style={cssToStyle("flex: none; width: 20px; height: 20px; border-radius: 50%; background: #DDF5EC; color: #0D7A63; display: grid; place-items: center; font-size: 11px; font-weight: 700; margin-top: 1px")}>✓</span>
                              {li}</li>


                          </React.Fragment>
                        ))}

                      </ul>


                      <div style={cssToStyle("margin-top: 22px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center")}>

                        <span style={cssToStyle("font-size: 13px; font-weight: 600; color: #4C5654; margin-right: 4px")}>{v.cur.chipLabel}</span>


                        {(v.cur.chips || []).map((c, index) => (
                          <React.Fragment key={index}>


                            <span className="mono" style={cssToStyle("font-size: 12px; padding: 6px 11px; border-radius: 8px; background: #F7F5F0; border: 1px solid #E4E0D6")}>{c}</span>


                          </React.Fragment>
                        ))}

                      </div>

                    </div>


                    <div style={cssToStyle("flex: 1 1 300px; min-width: 0; background: #F7F5F0; border: 1px solid #E4E0D6; border-radius: 24px; padding: 26px; display: flex; flex-direction: column; gap: 14px; align-self: stretch")}>

                      <div className="mono" style={cssToStyle("font-size: 12px; color: #0D7A63; letter-spacing: 0.1em")}>STILL WONDERING?</div>


                      <div className="h" style={cssToStyle("font-size: 24px; font-weight: 700; line-height: 1.2")}>{v.cur.q}</div>


                      <a href="#consult" className="doubt">{v.cur.a}
                        <span className="arrow" aria-hidden="true">→</span></a>


                      <div style={cssToStyle("font-size: 13px; color: #4C5654")}>Best for: {v.cur.who}</div>


                      <a href={v.exploreHref} onClick={(e) => { e.preventDefault(); this.props.navigate && this.props.navigate(v.exploreHref, { state: { fromCore: true } }); }} className="lnk" style={cssToStyle("margin-top: auto")}>Explore {v.cur.short} in detail
                        <span className="arrow" aria-hidden="true">→</span></a>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </section>



          {/*  ================= 4. FORMS WALL =================  */}


          <section id="forms" style={cssToStyle("padding: 104px 32px; background: #0B1A1E; color: #FFFFFF")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto")}>

              <div className="rv" style={cssToStyle("display: flex; flex-wrap: wrap; gap: 32px; justify-content: space-between; align-items: flex-end")}>

                <div style={cssToStyle("flex: 1 1 560px; min-width: 0")}>

                  <p className="mono" style={cssToStyle("margin: 0 0 14px; font-size: 13px; letter-spacing: 0.14em; color: #6EE7C2")}>FORMS &amp; SCHEDULES WE WORK WITH</p>


                  <h2 className="h" style={cssToStyle("margin: 0; font-size: clamp(34px, 4.4vw, 58px); line-height: 1.02; font-weight: 700")}>Find your form.
                    <span className="serif" style={cssToStyle("font-size: 1.1em; color: #6EE7C2")}>We'll find the service.</span></h2>

                </div>


                <p style={cssToStyle("flex: 1 1 360px; margin: 0; font-size: 17px; line-height: 1.65; color: #C9D6D8")}>The forms required depend on each taxpayer's situation and the tax year's instructions. Filter by area and tap a form to jump to the service that handles it.</p>

              </div>


              <div role="group" aria-label="Filter forms" style={cssToStyle("display: flex; flex-wrap: wrap; gap: 8px; margin-top: 40px")}>

                {(v.formCats || []).map((c, index) => (
                  <React.Fragment key={index}>


                    <button type="button" className="tab" onClick={c.pick} aria-pressed={c.pressed} style={cssToStyle(c.style)}>{c.name}
                      <span className="mono" style={cssToStyle("opacity: .7; margin-left: 4px")}>{c.count}</span></button>


                  </React.Fragment>
                ))}

              </div>


              <div style={cssToStyle("display: grid; grid-template-columns: repeat(auto-fill, minmax(176px, 1fr)); gap: 12px; margin-top: 28px")}>

                {(v.formTiles || []).map((f, index) => (
                  <React.Fragment key={index}>


                    <a href="#explorer" onClick={f.go} className="lift panel-in" style={cssToStyle("text-decoration: none; color: #FFFFFF; background: #12262B; border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 18px; min-height: 138px; display: flex; flex-direction: column; gap: 8px")}>

                      <span className="mono" style={cssToStyle("font-size: 11px; color: #A9BBBE")}>{f.cat}</span>


                      <span className="h" style={cssToStyle("font-size: 24px; font-weight: 700; color: #6EE7C2")}>{f.f}</span>


                      <span style={cssToStyle("font-size: 13px; color: #C9D6D8; line-height: 1.4")}>{f.p}</span>

                    </a>


                  </React.Fragment>
                ))}

              </div>

            </div>

          </section>



          {/*  ================= 5. SOFTWARE =================  */}


          <section id="software" style={cssToStyle("padding: 112px 32px")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto")}>

              <div className="rv" style={cssToStyle("display: flex; flex-wrap: wrap; gap: 32px; justify-content: space-between; align-items: flex-end")}>

                <div style={cssToStyle("flex: 1 1 560px; min-width: 0")}>

                  <p className="mono" style={cssToStyle("margin: 0 0 14px; font-size: 13px; letter-spacing: 0.14em; color: #0D7A63")}>PROFESSIONAL SOFTWARE</p>


                  <h2 className="h" style={cssToStyle("margin: 0; font-size: clamp(34px, 4.4vw, 58px); line-height: 1.02; font-weight: 700")}>Already on your platform?
                    <span className="serif" style={cssToStyle("font-size: 1.1em")}>So are we.</span></h2>

                </div>


                <p style={cssToStyle("flex: 1 1 360px; margin: 0; font-size: 17px; line-height: 1.65; color: #4C5654")}>We work in the tools modern US practices already use, according to your engagement, licensing and the access you assign. Pick a platform to see which services run on it.</p>

              </div>


              <div className="rv" style={cssToStyle("display: flex; flex-wrap: wrap; gap: 24px; margin-top: 48px")}>

                <div style={cssToStyle("flex: 1 1 420px; min-width: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px")}>

                  {(v.swTiles || []).map((w, index) => (
                    <React.Fragment key={index}>


                      <button type="button" className="tab lift" onClick={w.pick} aria-pressed={w.pressed} style={cssToStyle(w.style)}>

                        <span className="h" style={cssToStyle(w.monoStyle)}>{w.m}</span>


                        <span style={cssToStyle("font-size: 16px; font-weight: 700; margin-top: 14px")}>{w.name}</span>


                        <span style={cssToStyle("font-size: 12px; opacity: .75; margin-top: 2px")}>{w.type}</span>

                      </button>


                    </React.Fragment>
                  ))}

                </div>


                <div className="panel-in" style={cssToStyle("flex: 1 1 400px; min-width: 0; background: #0B1A1E; color: #FFFFFF; border-radius: 28px; padding: 32px; display: flex; flex-direction: column; gap: 18px")}>

                  <div className="mono" style={cssToStyle("font-size: 12px; color: #6EE7C2; letter-spacing: 0.1em")}>{v.swCur.type}</div>


                  <div className="h" style={cssToStyle("font-size: 32px; font-weight: 700; line-height: 1.1")}>{v.swCur.name}</div>


                  <p style={cssToStyle("margin: 0; font-size: 16px; line-height: 1.6; color: #C9D6D8")}>Used for: {v.swCur.use}</p>


                  <div style={cssToStyle("font-size: 13px; font-weight: 600; color: #A9BBBE; margin-top: 6px")}>Services that run on this platform</div>


                  <div style={cssToStyle("display: grid; gap: 8px")}>

                    {(v.swSvc || []).map((v, index) => (
                      <React.Fragment key={index}>


                        <div style={cssToStyle(v.style)}><span>{v.name}</span>
                          <span aria-hidden="true">{v.mark}</span></div>


                      </React.Fragment>
                    ))}

                  </div>


                  <p style={cssToStyle("margin: 6px 0 0; font-size: 12px; color: #A9BBBE")}>Software access and capabilities are confirmed against your engagement and licensing arrangements.</p>

                </div>

              </div>

            </div>

          </section>



          {/*  ================= 6. ENGAGEMENT BUILDER =================  */}


          <section id="builder" style={cssToStyle("padding: 104px 32px; background: #FFFFFF; border-top: 1px solid #E4E0D6; border-bottom: 1px solid #E4E0D6")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto")}>

              <div className="rv" style={cssToStyle("display: flex; flex-wrap: wrap; gap: 32px; justify-content: space-between; align-items: flex-end")}>

                <div style={cssToStyle("flex: 1 1 560px; min-width: 0")}>

                  <p className="mono" style={cssToStyle("margin: 0 0 14px; font-size: 13px; letter-spacing: 0.14em; color: #0D7A63")}>WHO WE WORK WITH · BUILD YOUR SCOPE</p>


                  <h2 className="h" style={cssToStyle("margin: 0; font-size: clamp(34px, 4.4vw, 58px); line-height: 1.02; font-weight: 700")}>Tell us who you are.
                    <span className="serif" style={cssToStyle("font-size: 1.1em")}>We'll sketch the engagement.</span></h2>

                </div>

              </div>


              <div role="group" aria-label="Who are you?" style={cssToStyle("display: flex; flex-wrap: wrap; gap: 8px; margin-top: 40px")}>

                {(v.whoTabs || []).map((w, index) => (
                  <React.Fragment key={index}>


                    <button type="button" className="tab" onClick={w.pick} aria-pressed={w.pressed} style={cssToStyle(w.style)}>{w.name}</button>


                  </React.Fragment>
                ))}

              </div>


              <div style={cssToStyle("display: flex; flex-wrap: wrap; gap: 24px; margin-top: 28px")}>

                <div className="panel-in" style={cssToStyle("flex: 1 1 420px; min-width: 0; background: #F7F5F0; border: 1px solid #E4E0D6; border-radius: 28px; padding: 30px")}>

                  <div className="h" style={cssToStyle("font-size: 26px; font-weight: 700")}>{v.whoCur.title}</div>


                  <p style={cssToStyle("margin: 10px 0 0; font-size: 16px; line-height: 1.6; color: #4C5654")}>{v.whoCur.text}</p>


                  <div style={cssToStyle("font-size: 13px; font-weight: 600; margin-top: 22px")}>Toggle the services you need</div>


                  <div style={cssToStyle("display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px; margin-top: 10px")}>

                    {(v.pickList || []).map((p, index) => (
                      <React.Fragment key={index}>


                        <button type="button" className="tab" onClick={p.toggle} aria-pressed={p.pressed} style={cssToStyle(p.style)}><span style={cssToStyle(p.box)}>{p.mark}</span>
                          <span style={cssToStyle("flex: 1; text-align: left")}>{p.name}</span>
                          <span className="mono" style={cssToStyle("font-size: 10px; opacity: .7")}>{p.cad}</span></button>


                      </React.Fragment>
                    ))}

                  </div>

                </div>


                <div style={cssToStyle("flex: 1.1 1 460px; min-width: 0; background: #0B1A1E; color: #FFFFFF; border-radius: 28px; padding: 30px")}>

                  <div style={cssToStyle("display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; align-items: baseline")}>

                    <div className="h" style={cssToStyle("font-size: 20px; font-weight: 600")}>Your year at a glance</div>


                    <div className="mono" style={cssToStyle("font-size: 11px; color: #A9BBBE")}>ILLUSTRATIVE WORKLOAD RHYTHM</div>

                  </div>


                  <div style={cssToStyle("display: flex; align-items: flex-end; gap: 6px; height: 190px; margin-top: 22px; border-bottom: 1px solid rgba(255,255,255,0.18)")}>

                    {(v.heat || []).map((m, index) => (
                      <React.Fragment key={index}>


                        <div style={cssToStyle("flex: 1; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 6px; min-width: 0")}>

                          <span className="mono" style={cssToStyle("font-size: 10px; color: #A9BBBE")}>{m.v}</span>


                          <span className="fill" style={cssToStyle(m.style)}></span>

                        </div>


                      </React.Fragment>
                    ))}

                  </div>


                  <div style={cssToStyle("display: flex; gap: 6px; margin-top: 8px")}>

                    {(v.heat || []).map((m, index) => (
                      <React.Fragment key={index}>


                        <span className="mono" style={cssToStyle("flex: 1; min-width: 0; text-align: center; font-size: 10px; color: #C9D6D8")}>{m.l}</span>


                      </React.Fragment>
                    ))}

                  </div>


                  <p style={cssToStyle("margin: 14px 0 0; font-size: 12px; color: #A9BBBE")}>Bars show how many of your selected services are typically active each month, for example quarterly estimates, filing season and extended deadlines.</p>


                  <div style={cssToStyle("display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: 20px")}>

                    <div style={cssToStyle("background: #12262B; border-radius: 14px; padding: 14px")}><div style={cssToStyle("font-size: 12px; color: #A9BBBE")}>Services selected</div>
                      <div className="h" style={cssToStyle("font-size: 26px; font-weight: 700")}>{v.pickCount}</div></div>


                    <div style={cssToStyle("background: #12262B; border-radius: 14px; padding: 14px")}><div style={cssToStyle("font-size: 12px; color: #A9BBBE")}>Busiest month</div>
                      <div className="h" style={cssToStyle("font-size: 26px; font-weight: 700; color: #6EE7C2")}>{v.peakMonth}</div></div>


                    <div style={cssToStyle("background: #12262B; border-radius: 14px; padding: 14px")}><div style={cssToStyle("font-size: 12px; color: #A9BBBE")}>Cadence</div>
                      <div className="h" style={cssToStyle("font-size: 20px; font-weight: 700; color: #F2B544")}>{v.cadence}</div></div>

                  </div>


                  <a href="#consult" className="btn btn-mint" style={cssToStyle("margin-top: 22px; width: 100%; justify-content: center")}>{v.whoCur.cta}
                    <span className="arrow" aria-hidden="true">→</span></a>

                </div>

              </div>

            </div>

          </section>



          {/*  ================= 7. PROCESS =================  */}


          <section id="process" style={cssToStyle("padding: 104px 32px; background: #0B1A1E; color: #FFFFFF")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto")}>

              <div className="rv" style={cssToStyle("display: flex; flex-wrap: wrap; gap: 32px; justify-content: space-between; align-items: flex-end")}>

                <div style={cssToStyle("flex: 1 1 560px; min-width: 0")}>

                  <p className="mono" style={cssToStyle("margin: 0 0 14px; font-size: 13px; letter-spacing: 0.14em; color: #6EE7C2")}>OUR WORKING PROCESS</p>


                  <h2 className="h" style={cssToStyle("margin: 0; font-size: clamp(34px, 4.4vw, 58px); line-height: 1.02; font-weight: 700")}>From first call to final delivery,
                    <span className="serif" style={cssToStyle("font-size: 1.1em; color: #6EE7C2")}>in seven clear steps.</span></h2>

                </div>


                <p style={cssToStyle("flex: 1 1 360px; margin: 0; font-size: 17px; line-height: 1.65; color: #C9D6D8")}>Outsourcing works best when everyone knows what needs doing, what information is required and who is responsible at each stage.</p>

              </div>


              <div style={cssToStyle("position: relative; margin-top: 56px")}>

                <div aria-hidden="true" className="proc-line" style={cssToStyle("position: absolute; left: 3%; right: 3%; top: 27px; height: 2px; background: rgba(255,255,255,0.12)")}><div className="fill" style={cssToStyle(v.procBar)}></div></div>


                <div className="proc-grid" style={cssToStyle("position: relative; display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 10px")}>

                  {(v.procSteps || []).map((p, index) => (
                    <React.Fragment key={index}>


                      <button type="button" className="tab" onClick={p.pick} aria-pressed={p.pressed} style={cssToStyle("background: transparent; color: #FFFFFF; display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 0; min-height: 110px")}>

                        <span className="proc-dot" style={cssToStyle(p.dot)}>{p.n}</span>


                        <span className="proc-lbl" style={cssToStyle(p.lbl)}>{p.short}</span>

                      </button>


                    </React.Fragment>
                  ))}

                </div>

              </div>


              <div className="panel-in" style={cssToStyle("margin-top: 26px; display: flex; flex-wrap: wrap; gap: 28px; align-items: center; background: #12262B; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 30px")}>

                <div className="h" style={cssToStyle("font-size: 96px; font-weight: 700; color: #6EE7C2; line-height: 0.85")}>{v.procNum}</div>


                <div style={cssToStyle("flex: 1 1 420px; min-width: 0")}>

                  <div className="h" style={cssToStyle("font-size: 26px; font-weight: 700")}>{v.procTitle}</div>


                  <p style={cssToStyle("margin: 8px 0 0; font-size: 16px; line-height: 1.6; color: #C9D6D8")}>{v.procText}</p>

                </div>

              </div>

            </div>

          </section>



          {/*  ================= 8. TRUST BENTO =================  */}


          <section className="svc-trust-section" style={cssToStyle("padding: 112px 32px 96px")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto")}>

              <div className="rv" style={cssToStyle("max-width: 760px")}>

                <p className="mono" style={cssToStyle("margin: 0 0 14px; font-size: 13px; letter-spacing: 0.14em; color: #0D7A63")}>ACCURACY · CONFIDENTIALITY · COMPLIANCE</p>


                <h2 className="h" style={cssToStyle("margin: 0; font-size: clamp(34px, 4.4vw, 58px); line-height: 1.02; font-weight: 700")}>Financial information{" "}
                  <span className="serif" style={cssToStyle("font-size: 1.1em")}>deserves careful handling.</span></h2>

              </div>


              <div className="svc-trust-grid" style={cssToStyle("display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-top: 48px")}>

                <div className="rv lift svc-trust-lead" style={cssToStyle("grid-column: span 2; min-width: 0; background: #0B1A1E; color: #FFFFFF; border-radius: 28px; padding: 32px; display: flex; flex-wrap: wrap; gap: 28px; align-items: center")}>

                  <div style={cssToStyle("flex: 1 1 260px")}>

                    <svg aria-hidden="true" width="40" height="40" fill="none" stroke="#6EE7C2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z"></path>
                      <path d="M8.5 12l2.5 2.5 4.5-5"></path></svg>


                    <div className="h" style={cssToStyle("font-size: 26px; font-weight: 700; margin-top: 16px")}>Review before anything leaves us</div>


                    <p style={cssToStyle("margin: 10px 0 0; font-size: 15px; line-height: 1.6; color: #C9D6D8")}>Work is checked against the engagement's review requirements. Discrepancies and missing information are raised, then the work goes to your designated contact or authorized professional for approval.</p>

                  </div>


                  <div style={cssToStyle("flex: 1 1 220px; display: grid; gap: 10px")}>

                    <div className="sl" style={cssToStyle("animation-delay: .1s; background: #12262B; border-radius: 12px; padding: 12px 14px; font-size: 14px; display: flex; justify-content: space-between")}><span>Prepared</span>
                      <span style={cssToStyle("color: #6EE7C2")}>Accountant</span></div>


                    <div className="sl" style={cssToStyle("animation-delay: .3s; background: #12262B; border-radius: 12px; padding: 12px 14px; font-size: 14px; display: flex; justify-content: space-between")}><span>Checked</span>
                      <span style={cssToStyle("color: #6EE7C2")}>Reviewer</span></div>


                    <div className="sl" style={cssToStyle("animation-delay: .5s; background: #12262B; border-radius: 12px; padding: 12px 14px; font-size: 14px; display: flex; justify-content: space-between")}><span>Approved</span>
                      <span style={cssToStyle("color: #F2B544")}>You / your CPA</span></div>

                  </div>

                </div>


                <div className="rv lift" style={cssToStyle("background: #FFFFFF; border: 1px solid #E4E0D6; border-radius: 28px; padding: 28px")}>

                  <svg aria-hidden="true" width="34" height="34" fill="none" stroke="#0D7A63" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"></rect>
                    <path d="M8 10V7a4 4 0 018 0v3"></path></svg>


                  <div className="h" style={cssToStyle("font-size: 20px; font-weight: 700; margin-top: 14px")}>Confidentiality</div>


                  <p style={cssToStyle("margin: 8px 0 0; font-size: 15px; line-height: 1.6; color: #4C5654")}>Taxpayer and financial information handled through authorized channels, in line with tax information disclosure restrictions.</p>

                </div>


                <div className="rv lift" style={cssToStyle("background: #FFFFFF; border: 1px solid #E4E0D6; border-radius: 28px; padding: 28px")}>

                  <svg aria-hidden="true" width="34" height="34" fill="none" stroke="#0D7A63" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="15" r="4"></circle>
                    <path d="M11 12l9-9M17 6l3 3M15 8l2 2"></path></svg>


                  <div className="h" style={cssToStyle("font-size: 20px; font-weight: 700; margin-top: 14px")}>Access management</div>


                  <p style={cssToStyle("margin: 8px 0 0; font-size: 15px; line-height: 1.6; color: #4C5654")}>Authorized platform access only, with appropriate access controls for every engagement.</p>

                </div>


                <div className="rv lift" style={cssToStyle("background: #FFFFFF; border: 1px solid #E4E0D6; border-radius: 28px; padding: 28px")}>

                  <svg aria-hidden="true" width="34" height="34" fill="none" stroke="#0D7A63" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19V5M4 19h16"></path>
                    <path d="M8 15l3-4 3 2 5-6"></path></svg>


                  <div className="h" style={cssToStyle("font-size: 20px; font-weight: 700; margin-top: 14px")}>Financial accuracy</div>


                  <p style={cssToStyle("margin: 8px 0 0; font-size: 15px; line-height: 1.6; color: #4C5654")}>Transactions, balances and supporting documents reviewed to identify discrepancies early.</p>

                </div>


                <div className="rv lift" style={cssToStyle("background: #FFFFFF; border: 1px solid #E4E0D6; border-radius: 28px; padding: 28px")}>

                  <svg aria-hidden="true" width="34" height="34" fill="none" stroke="#0D7A63" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h9l4 4v14H6z"></path>
                    <path d="M14 3v5h5M9 13h7M9 17h5"></path></svg>


                  <div className="h" style={cssToStyle("font-size: 20px; font-weight: 700; margin-top: 14px")}>Organized workpapers</div>


                  <p style={cssToStyle("margin: 8px 0 0; font-size: 15px; line-height: 1.6; color: #4C5654")}>Supporting records and calculations kept so every assignment is easy to review.</p>

                </div>


                <div className="rv lift" style={cssToStyle("background: #DDF5EC; border-radius: 28px; padding: 28px")}>

                  <svg aria-hidden="true" width="34" height="34" fill="none" stroke="#0A5C4B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"></circle>
                    <path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"></path></svg>


                  <div className="h" style={cssToStyle("font-size: 20px; font-weight: 700; margin-top: 14px")}>Compliance awareness</div>


                  <p style={cssToStyle("margin: 8px 0 0; font-size: 15px; line-height: 1.6; color: #0B1A1E")}>Work follows the relevant tax-year instructions and federal, state and international reporting requirements.</p>

                </div>

              </div>

            </div>

          </section>



          {/*  ================= 9. DOUBT WALL =================  */}


          <section id="doubts" className="svc-doubts-section" style={cssToStyle("padding: 96px 32px 104px; background: #FFFFFF; border-top: 1px solid #E4E0D6")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto")}>

              <div className="rv" style={cssToStyle("display: flex; flex-wrap: wrap; gap: 32px; justify-content: space-between; align-items: flex-end")}>

                <div style={cssToStyle("flex: 1 1 560px; min-width: 0")}>

                  <p className="mono" style={cssToStyle("margin: 0 0 14px; font-size: 13px; letter-spacing: 0.14em; color: #0D7A63")}>QUICK ANSWERS</p>


                  <h2 className="h" style={cssToStyle("margin: 0; font-size: clamp(34px, 4.4vw, 58px); line-height: 1.02; font-weight: 700")}>Got a doubt?{" "}
                    <span className="serif" style={cssToStyle("font-size: 1.1em")}>The answer is on the button.</span></h2>

                </div>


                <p style={cssToStyle("flex: 1 1 360px; margin: 0; font-size: 17px; line-height: 1.65; color: #4C5654")}>The questions business owners and CPA firms ask most before outsourcing. Tap any answer for the detail.</p>

              </div>


              <div className="svc-doubts-grid" style={cssToStyle("display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 14px; margin-top: 44px")}>

                {(v.doubts || []).map((d, index) => (
                  <React.Fragment key={index}>


                    <div className="lift svc-doubt-card" style={cssToStyle(d.card)}>

                      <div className="mono" style={cssToStyle(d.numStyle)}>{d.n}</div>


                      <div className="h" style={cssToStyle("font-size: 21px; font-weight: 700; line-height: 1.25; flex: 1")}>{d.q}</div>


                      <button type="button" className="tab" onClick={d.toggle} aria-expanded={d.expanded} style={cssToStyle(d.btn)}>{d.a}
                        <span aria-hidden="true" style={cssToStyle(d.icon)}>→</span></button>


                      {(d.open) && (
                        <React.Fragment>


                          <p className="panel-in" style={cssToStyle(d.detailStyle)}>{d.detail}</p>


                        </React.Fragment>
                      )}

                    </div>


                  </React.Fragment>
                ))}

              </div>

            </div>

          </section>



          {/*  ================= 10. FAQ =================  */}


          <section id="faq" className="svc-faq-section" style={cssToStyle("padding: 104px 32px")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 56px")}>

              <div className="rv" style={cssToStyle("flex: 1 1 320px; min-width: 0")}>

                <p className="mono" style={cssToStyle("margin: 0 0 14px; font-size: 13px; letter-spacing: 0.14em; color: #0D7A63")}>FREQUENTLY ASKED QUESTIONS</p>


                <h2 className="h" style={cssToStyle("margin: 0; font-size: clamp(32px, 3.8vw, 48px); line-height: 1.05; font-weight: 700")}>Everything you'd ask{" "}
                  <span className="serif" style={cssToStyle("font-size: 1.1em")}>on a first call.</span></h2>

                <p style={cssToStyle("font-size: 16px; line-height: 1.6; color: #4C5654; margin: 18px 0 0")}>Can't find your question?</p>


                <a href="#consult" className="doubt" style={cssToStyle("margin-top: 12px")}>Ask us directly — we reply with specifics
                  <span className="arrow" aria-hidden="true">→</span></a>

              </div>


              <div className="svc-faq-list" style={cssToStyle("flex: 2 1 560px; min-width: 0; display: grid; gap: 10px")}>

                {(v.faqs || []).map((f, index) => (
                  <React.Fragment key={index}>


                    <div className="svc-faq-card" style={cssToStyle("background: #FFFFFF; border: 1px solid #E4E0D6; border-radius: 20px")}>

                      <button type="button" className="tab svc-faq-btn" onClick={f.toggle} aria-expanded={f.expanded} style={cssToStyle("width: 100%; min-height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 22px; background: transparent; color: #0B1A1E; text-align: left; font-size: 17px")}>

                        <span>{f.q}</span>
                        <span aria-hidden="true" style={cssToStyle(f.iconStyle)}>+</span>

                      </button>


                      {(f.open) && (
                        <React.Fragment>


                          <p className="panel-in svc-faq-answer" style={cssToStyle("margin: 0; padding: 0 22px 22px; font-size: 16px; line-height: 1.65; color: #4C5654")}>{f.a}</p>


                        </React.Fragment>
                      )}

                    </div>


                  </React.Fragment>
                ))}

              </div>

            </div>

          </section>



          {/*  ================= 11. FINAL CTA =================  */}


          <section id="consult" style={cssToStyle("padding: 104px 32px; background: #0B1A1E; color: #FFFFFF; position: relative; overflow: hidden")}>

            <div aria-hidden="true" style={cssToStyle("position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 56px 56px")}></div>


            <div style={cssToStyle("max-width: 1240px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 56px; position: relative")}>

              <div className="rv" style={cssToStyle("flex: 1 1 420px; min-width: 0")}>

                <p className="mono" style={cssToStyle("margin: 0 0 14px; font-size: 13px; letter-spacing: 0.14em; color: #6EE7C2")}>LET'S DISCUSS YOUR REQUIREMENTS</p>


                <h2 className="h" style={cssToStyle("margin: 0; font-size: clamp(34px, 4.4vw, 58px); line-height: 1.02; font-weight: 700")}>A better way to manage your US accounting
                  <span className="serif" style={cssToStyle("font-size: 1.1em; color: #6EE7C2")}>&amp; tax work.</span></h2>


                <p style={cssToStyle("font-size: 18px; line-height: 1.6; color: #C9D6D8; margin: 22px 0 0")}>Tell us what you need help with. We'll discuss the relevant services, the expected scope and how an outsourcing arrangement fits your existing process.</p>


                <div style={cssToStyle("display: grid; gap: 10px; margin-top: 30px")}>

                  <a href="#consult" className="doubt" style={cssToStyle("background: #12262B; justify-content: space-between")}><span style={cssToStyle("color: #C9D6D8; font-weight: 500")}>Need extra capacity this tax season?</span>
                    <span>Add our preparers →</span></a>


                  <a href="#consult" className="doubt" style={cssToStyle("background: #12262B; justify-content: space-between")}><span style={cssToStyle("color: #C9D6D8; font-weight: 500")}>Only need one service?</span>
                    <span>Start with just that →</span></a>


                  <a href="#consult" className="doubt" style={cssToStyle("background: #12262B; justify-content: space-between")}><span style={cssToStyle("color: #C9D6D8; font-weight: 500")}>Not sure what you need?</span>
                    <span>We'll scope it with you →</span></a>

                </div>

              </div>


              <div className="rv" style={cssToStyle("flex: 1 1 460px; min-width: 0; background: #FFFFFF; color: #0B1A1E; border-radius: 28px; padding: 36px")}>

                {(v.notSent) && (
                  <React.Fragment>


                    <form onSubmit={v.onSubmit} style={cssToStyle("display: grid; gap: 16px")}>

                      <div className="h" style={cssToStyle("font-size: 26px; font-weight: 700")}>Request a Consultation</div>


                      <div style={cssToStyle("display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px")}>

                        <label style={cssToStyle("display: grid; gap: 6px; font-size: 13px; font-weight: 600")}>Full name
                          <input type="text" name="name" value={v.fname} onChange={v.setFname} placeholder="Your full name" aria-invalid={Boolean(v.ferr.name)} style={cssToStyle("min-height: 48px; padding: 0 14px; border-radius: 12px; border: 1.5px solid " + (v.ferr.name ? '#E11D48' : '#B8C4C1'))} />
                          {v.ferr.name && <span style={cssToStyle("font-size: 12px; color: #E11D48")}>{v.ferr.name}</span>}
                        </label>


                        <label style={cssToStyle("display: grid; gap: 6px; font-size: 13px; font-weight: 600")}>Email
                          <input type="email" name="email" value={v.femail} onChange={v.setFemail} placeholder="you@firm.com" aria-invalid={Boolean(v.ferr.email)} style={cssToStyle("min-height: 48px; padding: 0 14px; border-radius: 12px; border: 1.5px solid " + (v.ferr.email ? '#E11D48' : '#B8C4C1'))} />
                          {v.ferr.email && <span style={cssToStyle("font-size: 12px; color: #E11D48")}>{v.ferr.email}</span>}
                        </label>

                      </div>


                      <div style={cssToStyle("display: grid; gap: 6px; font-size: 13px; font-weight: 600; position: relative")}>I am a

                        <button type="button" onClick={v.toggleBiz} aria-haspopup="listbox" aria-expanded={v.bizOpen} style={cssToStyle("min-height: 48px; padding: 0 14px; border-radius: 12px; border: 1.5px solid " + (v.ferr.biz ? '#E11D48' : '#B8C4C1') + "; background: #FFFFFF; display: flex; align-items: center; justify-content: space-between; cursor: pointer; text-align: left; color: #0B1A1E")}>
                          <span style={cssToStyle("color: " + (v.fbiz ? '#0B1A1E' : '#8A9793'))}>{v.fbiz || 'Select your business type'}</span>
                          <span aria-hidden="true" style={cssToStyle("transition: transform .25s; transform: rotate(" + (v.bizOpen ? '180deg' : '0deg') + ")")}>▾</span>
                        </button>
                        {v.ferr.biz && <span style={cssToStyle("font-size: 12px; color: #E11D48")}>{v.ferr.biz}</span>}

                        {v.bizOpen && (
                          <ul role="listbox" style={cssToStyle("position: absolute; top: calc(100% + 6px); left: 0; right: 0; background: #FFFFFF; border: 1px solid #E1E7E5; border-radius: 14px; box-shadow: 0 18px 44px rgba(11,26,30,0.18); padding: 6px; margin: 0; list-style: none; z-index: 50; max-height: 260px; overflow: auto")}>
                            {v.businessTypes.map((opt, oi) => (
                              <li key={oi}>
                                <button type="button" onClick={() => v.setBiz(opt)} role="option" aria-selected={v.fbiz === opt} style={cssToStyle("display: block; width: 100%; text-align: left; padding: 11px 12px; border-radius: 9px; font-size: 13.5px; background: " + (v.fbiz === opt ? '#EAF7F1' : 'transparent') + "; color: #0B1A1E; cursor: pointer; border: 0")}>{opt}</button>
                              </li>
                            ))}
                          </ul>
                        )}

                      </div>


                      <fieldset style={cssToStyle("border: 0; padding: 0; margin: 0")}>

                        <legend style={cssToStyle("font-size: 13px; font-weight: 600; margin-bottom: 8px")}>Services I'm interested in</legend>
                        {v.ferr.services && <span style={cssToStyle("font-size: 12px; color: #E11D48; display: block; margin-bottom: 4px")}>{v.ferr.services}</span>}


                        <div style={cssToStyle("display: flex; flex-wrap: wrap; gap: 8px")}>

                          {(v.formChips || []).map((c, index) => (
                            <React.Fragment key={index}>


                              <button type="button" className="tab" onClick={c.toggle} aria-pressed={c.pressed} style={cssToStyle(c.style)}>{c.name}</button>


                            </React.Fragment>
                          ))}

                        </div>

                      </fieldset>


                      <label style={cssToStyle("display: grid; gap: 6px; font-size: 13px; font-weight: 600")}>Tell us about your requirements
                        <textarea name="msg" rows="4" value={v.freq} onChange={v.setFreq} placeholder="Describe your accounting or tax requirements and the support you are looking for..." style={cssToStyle("padding: 12px 14px; min-height: 120px; border-radius: 12px; border: 1.5px solid " + (v.ferr.msg ? '#E11D48' : '#B8C4C1') + "; resize: vertical; font-family: inherit")}></textarea>
                        {v.ferr.msg && <span style={cssToStyle("font-size: 12px; color: #E11D48")}>{v.ferr.msg}</span>}
                      </label>


                      {v.ferr.form && <div role="alert" style={cssToStyle("font-size: 13px; color: #B91C1C; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 10px; padding: 10px 12px")}>{v.ferr.form}</div>}
                      <button type="submit" className="btn btn-ink" disabled={v.sending} style={cssToStyle("justify-content: center; width: 100%; opacity: " + (v.sending ? '0.7' : '1') + "; cursor: " + (v.sending ? 'not-allowed' : 'pointer'))}>{v.sending ? 'Submitting Request...' : 'Request a Consultation'}
                        {!v.sending && <span className="arrow" aria-hidden="true">→</span>}</button>


                      <p style={cssToStyle("font-size: 12px; color: #4C5654; margin: 0")}>Your information is handled confidentially through authorized channels.</p>

                    </form>


                  </React.Fragment>
                )}


                {(v.sent) && (
                  <React.Fragment>


                    <div className="panel-in" style={cssToStyle("text-align: center; padding: 56px 12px")}>

                      <div className="pop" style={cssToStyle("width: 76px; height: 76px; margin: 0 auto; border-radius: 50%; background: #DDF5EC; color: #0D7A63; display: grid; place-items: center; font-size: 34px; font-weight: 700")}>✓</div>


                      <div className="h" style={cssToStyle("font-size: 28px; font-weight: 700; margin-top: 22px")}>Request received</div>


                      <p style={cssToStyle("font-size: 16px; color: #4C5654; line-height: 1.6; margin: 10px 0 0")}>Our team will be in touch to discuss your requirements, documents and software.</p>

                    </div>


                  </React.Fragment>
                )}

              </div>

            </div>

          </section>



          {/*  ================= FOOTER / INTERLINKS =================  */}


          <footer style={cssToStyle("background: #08130F; color: #A9BBBE; padding: 56px 32px 32px")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto")}>

              <div style={cssToStyle("display: flex; flex-wrap: wrap; gap: 40px; justify-content: space-between")}>

                <div style={cssToStyle("flex: 1 1 280px")}>

                  <div style={cssToStyle("display: flex; align-items: center; gap: 12px; color: #FFFFFF")}><span style={cssToStyle("width: 36px; height: 36px; border-radius: 10px; background: #6EE7C2; display: grid; place-items: center; color: #0B1A1E; font: 700 15px 'Space Grotesk', sans-serif")}>ST</span>
                    <span className="h" style={cssToStyle("font-size: 18px; font-weight: 600")}>Smart Tax Expertss</span></div>


                  <p style={cssToStyle("font-size: 14px; line-height: 1.6; margin: 14px 0 0; max-width: 340px")}>Your partner in US accounting, tax preparation &amp; financial outsourcing.</p>

                </div>


                <nav aria-label="Service pages" style={cssToStyle("flex: 2 1 520px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 6px 24px")}>

                  {(v.footLinks || []).map((l, index) => (
                    <React.Fragment key={index}>


                      <a href={l.href} style={cssToStyle("color: #C9D6D8; text-decoration: none; font-size: 14px; min-height: 36px; display: flex; align-items: center")}>{l.name}</a>


                    </React.Fragment>
                  ))}

                </nav>

              </div>


              <div style={cssToStyle("margin-top: 36px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; font-size: 13px")}>

                <span>© Smart Tax Expertss</span>


                <span>Information on this page is general and is not tax or legal advice.</span>

              </div>

            </div>

          </footer>


        </div>


      </>
    );
  }
}

function MainServicesPageWithNav(props) {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (location.state && location.state.scrollToExplorer) {
      const el = document.getElementById('explorer');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      }
    }
  }, [location.key]);

  return <MainServicesPage {...props} navigate={navigate} />;
}

export default MainServicesPageWithNav;
