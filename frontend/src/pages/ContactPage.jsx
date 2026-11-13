import React from 'react';


/* Context-aware theme token maps. Each map flips with the site's light/dark
   theme (index.css :root / .dark). Crucially, the SAME raw hex is mapped to
   DIFFERENT tokens depending on the CSS property:
     - foreground (#17262b used as TEXT) -> text-primary (readable in dark)
     - surface  (#17262b used as a panel BACKGROUND stays navy; #fff -> card)
     - border   (#17262b outline -> text-primary so ghost buttons stay visible)
   This keeps the fixed navy panels intact while making all text legible in
   both themes. */
const FG_TOKENS = {
  '#17262b': 'var(--text-primary)',
  '#52646a': 'var(--text-secondary)',
  '#76858a': 'var(--text-muted)',
  '#b6cad0': 'var(--text-secondary)',
  '#fff': '#fff',
  '#ffffff': '#fff',
  '#22af68': 'var(--primary-accent)',
  '#1a8650': 'var(--muted-teal)',
  '#c49a52': 'var(--accent-gold)',
  '#5C7BFF': 'var(--accent-blue)'
};

const SURFACE_TOKENS = {
  '#f7f7f2': 'var(--bg-main)',
  '#fff': 'var(--card-surface)',
  '#ffffff': 'var(--card-surface)',
  '#eef1eb': 'var(--bg-secondary)',
  '#e8f3ef': 'var(--mint-surface)',
  '#fbf2df': 'var(--gold-surface)',
  '#22af68': 'var(--primary-accent)',
  '#c49a52': 'var(--accent-gold)'
};

const BORDER_TOKENS = {
  '#17262b': 'var(--text-primary)',
  '#dcece3': 'var(--border-color)',
  '#c2ded0': 'var(--border-strong)',
  '#E1E5EA': 'var(--border-color)',
  '#eef1eb': 'var(--border-color)'
};

function replaceColors(value, map) {
  Object.keys(map)
    .sort((a, b) => b.length - a.length)
    .forEach((key) => {
      const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const rx = new RegExp(escaped + '(?![\\da-fA-F])', 'g');
      value = value.replace(rx, map[key]);
    });
  return value;
}

function cssToStyle(input) {
  if (!input) return undefined;
  const output = {};
  input.split(';').forEach((declaration) => {
    const colon = declaration.indexOf(':');
    if (colon < 0) return;
    const rawName = declaration.slice(0, colon).trim();
    const value = declaration.slice(colon + 1).trim();
    if (!rawName || !value) return;
    const prop = rawName.toLowerCase();
    let mapped = value;
    if (prop === 'color' || prop === 'fill' || prop === 'stroke') {
      mapped = replaceColors(value, FG_TOKENS);
    } else if (prop.indexOf('background') !== -1) {
      mapped = replaceColors(value, SURFACE_TOKENS);
    } else if (prop.indexOf('border') !== -1 || prop.indexOf('shadow') !== -1) {
      mapped = replaceColors(value, BORDER_TOKENS);
      mapped = mapped.replace(/rgba\(14,\s*26,\s*43,\s*[^)]*\)/g, 'var(--border-color)');
    }
    const name = rawName.startsWith('--')
      ? rawName
      : rawName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    output[name] = mapped;
  });
  return output;
}

const PATHS = [
  {
    id: 'cpa', role: 'cpa', tab: 'CPA Firms', kicker: 'FOR CPA FIRMS & ACCOUNTING PRACTICES', title: 'Extra hands for filing season — and every season after.', lead: 'Looking for an experienced outsourcing team to support your accounting practice? We work with CPA firms and accounting professionals who need assistance with:', cta: 'Discuss CPA Outsourcing Requirements',
    items: ['Individual and business tax return preparation', 'Tax return review and documentation support', 'Bookkeeping and financial reporting', 'Payroll processing and reporting', 'Accounts payable and accounts receivable', 'Foreign tax compliance support', 'Seasonal workload and recurring accounting tasks']
  },
  {
    id: 'biz', role: 'biz', tab: 'Businesses', kicker: 'FOR BUSINESSES & COMPANIES', title: 'Books that close on time, every single month.', lead: 'Need dependable accounting support to manage your day-to-day financial operations? We assist businesses with:', cta: 'Discuss Business Accounting Requirements',
    items: ['Monthly and ongoing bookkeeping', 'Payroll management', 'Accounts payable and receivable', 'Financial records and reconciliations', 'Business tax preparation', 'Tax planning and advisory support', 'Federal and state tax filing assistance']
  },
  {
    id: 'ind', role: 'ind', tab: 'Individuals', kicker: 'FOR INDIVIDUALS & TAXPAYERS', title: 'Your US tax responsibilities, made clear.', lead: 'Need help understanding or managing your US tax responsibilities? Our services can support individuals with:', cta: 'Discuss Individual Tax Requirements',
    items: ['Individual income tax preparation', 'Federal and state tax return assistance', 'Tax documentation and income reporting', 'Tax planning support', 'Foreign income and asset reporting requirements', 'Tax filing and amended return assistance']
  }
];
const DESKS = [
  { code: 'CPA', label: 'CPA Outsourcing Desk', sub: 'Capacity · Review · Season', top: '52px', i: 0 },
  { code: 'BIZ', label: 'Business Accounting Desk', sub: 'Books · Payroll · Filing', top: '202px', i: 1 },
  { code: 'IND', label: 'Individual Tax Desk', sub: 'Returns · Planning · Foreign', top: '352px', i: 2 }
];
const ROLES = [
  { id: 'cpa', code: 'CPA', label: 'CPA / Accounting Firm', hint: 'Outsourcing, review support & seasonal capacity', desk: 'CPA Outsourcing Desk' },
  { id: 'biz', code: 'BIZ', label: 'Business Owner', hint: 'Bookkeeping, payroll & business tax', desk: 'Business Accounting Desk' },
  { id: 'ind', code: 'IND', label: 'Individual', hint: 'Personal US tax returns & planning', desk: 'Individual Tax Desk' },
  { id: 'oth', code: '···', label: 'Other', hint: 'Not sure where you fit? Start here', desk: 'General Enquiries Desk' }
];
const SERVICES = ['USA Tax Preparation', 'Bookkeeping & Accounting', 'Payroll Management', 'Tax Planning & Advisory', 'Accounts Payable & Receivable', 'Foreign Compliance', 'Tax Filing', 'Multiple Services', 'Not Sure – Need Guidance'];
const SCOPES = ['One-time assistance', 'Ongoing support', 'Not sure yet'];
const TIMELINES = ['As soon as possible', 'Within 30 days', 'Next filing season', 'Just exploring'];
const QUEUE = [
  { form: 'Form 1040', client: 'Client file A', status: 'PREPARED' },
  { form: 'Form 1120-S', client: 'Client file B', status: 'IN REVIEW' },
  { form: 'Form 1065', client: 'Client file C', status: 'QUEUED' },
  { form: 'Form 1040', client: 'Client file D', status: 'READY FOR YOU' }
];
const STATUS_C = { 'PREPARED': ['rgba(92,123,255,.2)', '#AFC0FF'], 'IN REVIEW': ['rgba(255,196,77,.18)', '#FFD27A'], 'QUEUED': ['rgba(255,255,255,.08)', '#b6cad0'], 'READY FOR YOU': ['rgba(196,154,82,.18)', '#c49a52'] };
const PROC = [
  { short: 'Understand', title: 'Understand your requirements', text: 'We review your enquiry to understand your service needs, business type, expected workload and preferred timeline.', tags: ['Service needs', 'Business type', 'Workload', 'Timeline'] },
  { short: 'Discuss', title: 'Initial discussion', text: 'Our team connects with you to discuss your requirements, clarify any questions and understand the scope of work.', tags: ['Clarify questions', 'Scope of work'] },
  { short: 'Scope', title: 'Service scope & workflow', text: 'We discuss the relevant services, expected deliverables, responsibilities, communication process and engagement requirements.', tags: ['Deliverables', 'Responsibilities', 'Communication'] },
  { short: 'Onboard', title: 'Engagement & onboarding', text: 'Once both parties agree on the scope and terms, we coordinate onboarding and establish the required workflow and document-sharing arrangements.', tags: ['Agreed terms', 'Workflow set-up', 'Secure document sharing'] },
  { short: 'Coordinate', title: 'Ongoing coordination', text: 'For ongoing engagements, we establish communication and review processes to support consistent service delivery.', tags: ['Review cadence', 'Consistent delivery'] }
];
const FAQS = [
  ['Who can contact Preferred Tax Consultancy?', 'CPA firms, accounting practices, small and medium-sized businesses, corporations, startups and individuals seeking US tax and accounting support can contact us.'],
  ['Do you provide outsourcing services to US CPA firms?', 'Yes. CPA firms can enquire about outsourcing support for tax preparation, bookkeeping, payroll, accounts payable and receivable, and other accounting activities. The exact scope and review responsibilities are agreed upon before engagement.'],
  ['Can I enquire about more than one service?', 'Yes. You can select multiple services in the enquiry form and describe your requirements. Our team can discuss how these services may fit into a coordinated engagement.'],
  ['Do you offer one-time and ongoing services?', 'You can enquire about both project-based and recurring support. Availability, scope, timelines and engagement terms will be discussed based on your requirements.'],
  ['What information should I share when contacting you?', 'Start with your name, organisation, contact details, required services and a brief explanation of your needs. You do not need to share confidential tax or financial documents through the general contact form.'],
  ['Can I discuss my requirements before making a decision?', 'Yes. You can submit an enquiry to discuss your requirements, understand the potential service scope and evaluate whether our services are appropriate for your needs.'],
  ['How do you handle confidential tax and accounting documents?', 'Confidentiality and appropriate handling of financial information are important in any accounting engagement. Secure document-sharing arrangements, access permissions and applicable tax information disclosure requirements are agreed upon before sensitive documents are transferred.'],
  ['How can I get started with outsourcing?', 'Submit your enquiry with your service requirements. Our team can then discuss the expected workload, workflow, deliverables and engagement arrangements.']
];
const SOFTWARE = ['Drake Tax', 'Intuit ProConnect', 'UltraTax CS', 'CCH ProSystem', 'ProSeries', 'QuickBooks'];
const MONTHS = [['JAN', '46%'], ['FEB', '58%'], ['MAR', '72%'], ['APR', '64%'], ['MAY', '82%'], ['JUN', '94%']];

class ContactPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { path: 0, step: 0, role: '', services: [], scope: '', timeline: '', volume: '', message: '', name: '', company: '', email: '', phone: '', country: '', submitted: false, proc: 0, paused: false, tick: 0, faq: 0 };
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      if (this.state.paused || this.props.autoplay === false) return;
      const t = this.state.tick + 1;
      if (t >= 25) this.setState({ tick: 0, proc: (this.state.proc + 1) % 5 });
      else this.setState({ tick: t });
    }, 200);
  }
  componentWillUnmount() { clearInterval(this.timer); }
  field(k) { return (e) => this.setState({ [k]: e.target.value }); }

  renderVals() {
    const s = this.state;
    const accent = this.props.accent ?? '#22af68';
    const lime = '#c49a52';

    const paths = PATHS.map((p, i) => ({
      ...p,
      num: '0' + (i + 1),
      active: i === s.path,
      isCpa: p.id === 'cpa', isBiz: p.id === 'biz', isInd: p.id === 'ind',
      tabColor: i === s.path ? '#17262b' : '#b6cad0',
      dotW: i === s.path ? '40px' : '12px',
      dotC: i === s.path ? lime : 'rgba(255,255,255,.25)',
      items: p.items.map((t, j) => ({ label: t, delay: (0.08 * j + 0.15) + 's' })),
      pick: () => this.setState({ path: i }),
      go: () => this.setState({ path: i, role: p.role, step: s.submitted ? s.step : Math.max(s.step, 1) })
    }));

    const desks = DESKS.map((d) => ({ ...d, pick: () => this.setState({ path: d.i }) }));

    const roles = ROLES.map((r) => {
      const sel = s.role === r.id;
      return { ...r, selected: sel, border: sel ? accent : 'var(--border-color)', bg: sel ? 'var(--mint-surface)' : 'var(--card-surface)', iconBg: sel ? accent : 'var(--card-elevated)', iconFg: sel ? '#fff' : lime, dot: sel ? accent : 'transparent', pick: () => this.setState({ role: r.id }) };
    });
    const services = SERVICES.map((label) => {
      const sel = s.services.includes(label);
      return {
        label, selected: sel, mark: sel ? '✓' : '+', border: sel ? '#17262b' : '#dcece3', bg: sel ? '#17262b' : '#fff', fg: sel ? '#fff' : '#17262b',
        toggle: () => this.setState({ services: sel ? s.services.filter((x) => x !== label) : s.services.concat([label]) })
      };
    });
    const opt = (list, key) => list.map((label) => {
      const sel = s[key] === label;
      return { label, selected: sel, border: sel ? accent : 'var(--border-color)', bg: sel ? 'var(--mint-surface)' : 'var(--card-surface)', fg: sel ? accent : '#17262b', pick: () => this.setState({ [key]: label }) };
    });

    const stepNames = ['Who you are', 'What you need', 'Workload & timing', 'Contact details'];
    const formSteps = stepNames.map((label, i) => {
      const done = s.submitted || i < s.step; const cur = !s.submitted && i === s.step;
      return { label, num: done ? '✓' : '0' + (i + 1), bar: done ? accent : (cur ? '#17262b' : '#dcece3'), color: done || cur ? '#17262b' : '#76858a' };
    });
    const canNext = [s.role !== '', s.services.length > 0, true, s.name.trim() !== '' && /.+@.+\\..+/.test(s.email)][s.step];

    const roleObj = ROLES.find((r) => r.id === s.role);
    const filled = [s.role, s.services.length ? 'x' : '', s.scope, s.timeline, s.name, s.email].filter(Boolean).length;
    const pct = Math.round((filled / 6) * 100);

    const proc = PROC.map((p, i) => {
      const active = i === s.proc; const done = i < s.proc;
      return {
        ...p, num: '0' + (i + 1), active, aria: 'Step ' + (i + 1) + ': ' + p.title,
        ring: active || done ? accent : '#dcece3', bg: active ? accent : (done ? '#fff' : '#fff'), fg: active ? '#fff' : (done ? accent : '#52646a'),
        scale: active ? '1.12' : '1', label: active ? '#17262b' : '#52646a',
        tags: p.tags.map((t, j) => ({ label: t, delay: (0.1 * j + 0.2) + 's' })),
        pick: () => this.setState({ proc: i, paused: true, tick: 0 })
      };
    });

    const faqs = FAQS.map(([q, a], i) => {
      const open = s.faq === i;
      return {
        q, a, open, num: '0' + (i + 1), border: open ? accent : 'var(--border-color)', iconBg: open ? accent : 'var(--bg-secondary)', iconFg: open ? '#fff' : '#17262b', rot: open ? '45deg' : '0deg',
        toggle: () => this.setState({ faq: open ? -1 : i })
      };
    });

    return {
      accent,
      rootClass: this.props.motion === false ? 'no-motion' : '',
      desks,
      paths,
      indX: (s.path * 100) + '%',
      pathNum: '0' + (s.path + 1),
      prevPath: () => this.setState({ path: (s.path + 2) % 3 }),
      nextPath: () => this.setState({ path: (s.path + 1) % 3 }),
      queue: QUEUE.concat(QUEUE).map((q) => ({ ...q, bg: STATUS_C[q.status][0], fg: STATUS_C[q.status][1] })),
      months: MONTHS.map(([label, h], i) => ({ label, h, c: i === 5 ? lime : '#5C7BFF', delay: (0.1 * i + 0.2) + 's' })),
      closeItems: [
        { label: 'Bank & card reconciliations', tag: 'RECONCILED', delay: '.8s' },
        { label: 'Payroll processed & reported', tag: 'PAYROLL', delay: '1s' },
        { label: 'Payables & receivables updated', tag: 'AP / AR', delay: '1.2s' }
      ],
      checklist: ['Income documents organised', 'Federal & state return prepared', 'Foreign income & assets reviewed', 'Return walked through with you', 'Ready to file'].map((label, i) => ({ label, delay: (0.45 * i + 0.3) + 's' })),

      roles, services,
      scopes: opt(SCOPES, 'scope'),
      timelines: opt(TIMELINES, 'timeline'),
      formSteps,
      s0: s.step === 0, s1: s.step === 1, s2: s.step === 2, s3: s.step === 3,
      submitted: s.submitted, notSubmitted: !s.submitted,
      showBack: s.step > 0, hideBack: s.step === 0, stepNum: s.step + 1,
      notLast: s.step < 3, isLast: s.step === 3,
      nextDisabled: !canNext,
      nextBg: canNext ? accent : '#AEB7C4',
      nextCursor: canNext ? 'pointer' : 'not-allowed',
      next: () => { if (canNext) this.setState({ step: Math.min(3, s.step + 1) }); },
      back: () => this.setState({ step: Math.max(0, s.step - 1) }),
      submit: () => { if (canNext) this.setState({ submitted: true }); },
      reset: () => this.setState({ step: 0, role: '', services: [], scope: '', timeline: '', volume: '', message: '', name: '', company: '', email: '', phone: '', country: '', submitted: false }),
      volume: s.volume, message: s.message, name: s.name, company: s.company, email: s.email, phone: s.phone, country: s.country,
      onVolume: this.field('volume'), onMessage: this.field('message'), onName: this.field('name'), onCompany: this.field('company'), onEmail: this.field('email'), onPhone: this.field('phone'), onCountry: this.field('country'),

      ticketDesk: roleObj ? roleObj.desk : 'Awaiting your selection',
      deskColor: roleObj ? lime : '#76858a',
      ticketRole: roleObj ? roleObj.label : '—',
      noServices: s.services.length === 0,
      ticketScope: s.scope || '—',
      ticketTimeline: s.timeline || '—',
      ticketContact: s.name ? (s.name + (s.company ? ' · ' + s.company : '')) : '—',
      ticketFirst: s.name ? s.name.split(' ')[0] : 'there',
      slipPct: pct + '%',
      slipPctLabel: pct + '%',
      slipStatus: s.submitted ? '● SENT' : (pct > 0 ? '● DRAFTING' : '○ EMPTY'),

      proc,
      procFill: (s.proc / 4 * 100) + '%',
      autoW: (s.paused || this.props.autoplay === false) ? '0%' : (s.tick * 4) + '%',
      togglePlay: () => this.setState({ paused: !s.paused, tick: 0 }),
      playLabel: s.paused ? '▶  Play walkthrough' : '❚❚  Pause walkthrough',

      faqs,
      software: SOFTWARE.concat(SOFTWARE)
    };
  }

  render() {
    const v = this.renderVals();
    return (
      <>




        <link rel="preconnect" href="https://fonts.googleapis.com" />


        <style>{"/* cyrillic-ext */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/1ca1ea50-2a48-4843-8061-0ae66fd9f57c\") format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/a2596166-48fb-4591-8e85-e461cd94ebe5\") format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek-ext */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/afc58fde-2848-4e35-9410-3596594c2eec\") format('woff2');\n  unicode-range: U+1F00-1FFF;\n}\n/* greek */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/702fd117-a42d-496d-9bf2-4852f8c75efd\") format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/860be1c7-7569-4ea1-8558-d7f2d9388c83\") format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/83c423b7-2c12-4458-942e-c16847ce2b12\") format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/fa46b087-4151-429c-b5c5-9038c2007734\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/1ca1ea50-2a48-4843-8061-0ae66fd9f57c\") format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/a2596166-48fb-4591-8e85-e461cd94ebe5\") format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek-ext */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/afc58fde-2848-4e35-9410-3596594c2eec\") format('woff2');\n  unicode-range: U+1F00-1FFF;\n}\n/* greek */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/702fd117-a42d-496d-9bf2-4852f8c75efd\") format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/860be1c7-7569-4ea1-8558-d7f2d9388c83\") format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/83c423b7-2c12-4458-942e-c16847ce2b12\") format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/fa46b087-4151-429c-b5c5-9038c2007734\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(\"/page-assets/1ca1ea50-2a48-4843-8061-0ae66fd9f57c\") format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(\"/page-assets/a2596166-48fb-4591-8e85-e461cd94ebe5\") format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek-ext */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(\"/page-assets/afc58fde-2848-4e35-9410-3596594c2eec\") format('woff2');\n  unicode-range: U+1F00-1FFF;\n}\n/* greek */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(\"/page-assets/702fd117-a42d-496d-9bf2-4852f8c75efd\") format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(\"/page-assets/860be1c7-7569-4ea1-8558-d7f2d9388c83\") format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(\"/page-assets/83c423b7-2c12-4458-942e-c16847ce2b12\") format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(\"/page-assets/fa46b087-4151-429c-b5c5-9038c2007734\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/3c69c422-0d81-4172-a55d-4b4326674fac\") format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/063e3d07-762b-4cf9-9418-400fd98ed561\") format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/c6affcee-cadc-4f0f-ac19-85607b7d8c40\") format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/af101665-ae24-4522-a7fb-e05fbd4038d7\") format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/4685d0ab-03ff-475c-bfc9-45093352ab90\") format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/b00ab560-691b-4a15-8264-365810c77978\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/3c69c422-0d81-4172-a55d-4b4326674fac\") format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/063e3d07-762b-4cf9-9418-400fd98ed561\") format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/c6affcee-cadc-4f0f-ac19-85607b7d8c40\") format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/af101665-ae24-4522-a7fb-e05fbd4038d7\") format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/4685d0ab-03ff-475c-bfc9-45093352ab90\") format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/b00ab560-691b-4a15-8264-365810c77978\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Space Grotesk';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPb54C-s0.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Space Grotesk';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPb94C-s0.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Space Grotesk';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/3b2ab9fd-dddc-4222-a123-c29399832680\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Space Grotesk';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPb54C-s0.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Space Grotesk';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPb94C-s0.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Space Grotesk';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/3b2ab9fd-dddc-4222-a123-c29399832680\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Space Grotesk';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPb54C-s0.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Space Grotesk';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPb94C-s0.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Space Grotesk';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(\"/page-assets/3b2ab9fd-dddc-4222-a123-c29399832680\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Space Grotesk';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPb54C-s0.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Space Grotesk';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPb94C-s0.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Space Grotesk';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(\"/page-assets/3b2ab9fd-dddc-4222-a123-c29399832680\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n"}</style>


        <style>{"\nbody{margin:0;background:var(--bg-main);color:var(--text-primary);font-family:'Plus Jakarta Sans',system-ui,sans-serif}\na{color:var(--primary-accent)}a:hover{color:var(--muted-teal)}\n*{box-sizing:border-box}\n.mono{font-family:'JetBrains Mono',ui-monospace,monospace}\n.disp{font-family:'Playfair Display',Georgia,serif}\n.gridbg{background-image:linear-gradient(rgba(14,26,43,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(14,26,43,.06) 1px,transparent 1px);background-size:48px 48px}\n.gridbg-d{background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:48px 48px}\n\n.btn-p{transition:transform .25s cubic-bezier(.2,.7,.2,1),box-shadow .25s,background .25s}\n.btn-p:hover{transform:translateY(-2px);box-shadow:0 14px 30px -12px rgba(34,175,104,.55)}\n.btn-l{transition:transform .25s cubic-bezier(.2,.7,.2,1),box-shadow .25s}\n.btn-l:hover{transform:translateY(-2px);box-shadow:0 14px 30px -12px rgba(196,154,82,.55)}\n.btn-g{transition:background .25s,border-color .25s,color .25s}\n.btn-g:hover{background:#17262b;color:#fff !important;border-color:#17262b !important}\n.btn-gd:hover{background:#fff;color:#17262b !important}\n.arrow{display:inline-block;transition:transform .25s}\na:hover .arrow,button:hover .arrow{transform:translateX(4px)}\n.tile{transition:transform .3s cubic-bezier(.2,.7,.2,1),border-color .3s,box-shadow .3s}\n.tile:hover{transform:translateY(-4px);border-color:#22af68 !important;box-shadow:0 20px 40px -24px rgba(14,26,43,.35)}\n.desk{transition:transform .3s cubic-bezier(.2,.7,.2,1),border-color .3s,box-shadow .3s}\n.desk:hover{transform:translateX(6px);border-color:#c49a52 !important;box-shadow:0 18px 40px -20px rgba(14,26,43,.5)}\n.chip{transition:background .2s,border-color .2s,color .2s,transform .2s}\n.chip:hover{border-color:#22af68 !important;transform:translateY(-1px)}\n.rolecard{transition:border-color .25s,background .25s,transform .25s}\n.rolecard:hover{transform:translateY(-2px);border-color:#22af68 !important}\n.field{transition:border-color .2s,box-shadow .2s}\n.field:focus{outline:none;border-color:#22af68 !important;box-shadow:0 0 0 4px rgba(34,175,104,.15)}\nbutton:focus-visible,a:focus-visible{outline:3px solid #22af68;outline-offset:3px}\n.faqq{transition:background .2s}\n.faqq:hover{background:#eef1eb}\n.navbtn{transition:background .2s,color .2s,border-color .2s}\n.navbtn:hover{background:#c49a52;color:#17262b !important;border-color:#c49a52 !important}\n\n@keyframes flow{to{stroke-dashoffset:-64}}\n.flow{stroke-dasharray:4 12;animation:flow 1.6s linear infinite}\n@keyframes travel{0%{ offset-distance:0%;opacity:0}8%{opacity:1}92%{opacity:1}100%{offset-distance:100%;opacity:0}}\n.pkt{position:absolute;left:0;top:0;width:12px;height:12px;border-radius:50%;background:#c49a52;box-shadow:0 0 0 4px rgba(196,154,82,.25),0 0 18px rgba(196,154,82,.9);offset-rotate:0deg;offset-anchor:center;animation:travel 3.2s cubic-bezier(.5,0,.3,1) infinite}\n.pk1{offset-path:path('M 120 240 C 230 240, 220 90, 330 90')}\n.pk2{offset-path:path('M 120 240 L 330 240');animation-delay:1.05s}\n.pk3{offset-path:path('M 120 240 C 230 240, 220 390, 330 390');animation-delay:2.1s}\n@keyframes ring{0%{ transform: scale(.6); opacity: .7 }100%{transform:scale(2.1);opacity:0}}\n.ring{position:absolute;inset:0;border-radius:50%;border:2px solid #22af68;animation:ring 2.4s cubic-bezier(.2,.7,.2,1) infinite}\n.ring2{animation-delay:1.2s}\n@keyframes blink{0%, 100%{ opacity: 1 }50%{opacity:.25}}\n.blink{animation:blink 1.6s ease-in-out infinite}\n@keyframes sweep{from{background-size:0% 38%}to{background-size:100% 38%}}\n.mark{background-image:linear-gradient(#22af68,#22af68);background-repeat:no-repeat;background-position:0 88%;background-size:100% 38%;animation:sweep 1.1s .5s cubic-bezier(.2,.7,.2,1) both}\n@keyframes rise{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}\n.in{animation:rise .8s cubic-bezier(.2,.7,.2,1) both}\n.d1{animation-delay:.08s}.d2{animation-delay:.16s}.d3{animation-delay:.24s}.d4{animation-delay:.32s}.d5{animation-delay:.4s}.d6{animation-delay:.48s}\n@keyframes fadeSwap{from{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}\n.swap{animation:fadeSwap .6s cubic-bezier(.2,.7,.2,1) both}\n@keyframes queue{from{transform:translateY(0)}to{transform:translateY(-50%)}}\n.queue{animation:queue 14s linear infinite}\n@keyframes grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}\n.bar{transform-origin:bottom;animation:grow .9s cubic-bezier(.2,.7,.2,1) both}\n@keyframes growx{from{transform:scaleX(0)}to{transform:scaleX(1)}}\n.barx{transform-origin:left;animation:growx 1.2s cubic-bezier(.2,.7,.2,1) both}\n@keyframes pop{0%{ opacity: 0; transform: scale(.4) }70%{transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}\n.pop{animation:pop .5s cubic-bezier(.2,.7,.2,1) both}\n@keyframes draw{from{stroke-dashoffset:60}to{stroke-dashoffset:0}}\n.tick{stroke-dasharray:60;animation:draw .6s cubic-bezier(.2,.7,.2,1) both}\n@keyframes ringfill{from{stroke-dashoffset:302}to{stroke-dashoffset:30}}\n.ringfill{stroke-dasharray:302;animation:ringfill 3.2s cubic-bezier(.2,.7,.2,1) both}\n@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}\n.marquee{animation:marquee 26s linear infinite}\n@keyframes toggle{0%, 30%{ transform: translateX(0) }45%,80%{transform:translateX(20px)}95%,100%{transform:translateX(0)}}\n.knob{animation:toggle 4.5s ease-in-out infinite}\n@keyframes knobbg{0%, 30%{ background: #c2ded0 }45%,80%{background:#22af68}95%,100%{background:#c2ded0}}\n.track{animation:knobbg 4.5s ease-in-out infinite}\n@keyframes success{from{stroke-dashoffset:120}to{stroke-dashoffset:0}}\n.succ{stroke-dasharray:120;animation:success .9s .2s cubic-bezier(.2,.7,.2,1) both}\n@keyframes slidein{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:none}}\n.slidein{animation:slidein .5s cubic-bezier(.2,.7,.2,1) both}\n@keyframes scan{0%{ top: 0 }100%{top:100%}}\n.scan{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#22af68,transparent);animation:scan 2.8s ease-in-out infinite alternate}\n\n@supports (animation-timeline: view()){\n  .rv{animation:rise linear both;animation-timeline:view();animation-range:entry 0% entry 55%}\n}\n.no-motion *,.no-motion *::before,.no-motion *::after{animation:none !important;transition:none !important}\n@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation:none !important;transition:none !important}}\n\n.hero-vis{position:relative;width:560px;height:480px;flex:0 0 auto;max-width:100%;margin-left:auto;}\n@media (max-width:1180px){.hero-vis{transform:scale(.85);transform-origin:center right;margin:0 auto;}}\n@media (max-width:960px){.hero-vis{transform:scale(.8);transform-origin:center center;margin:24px auto 0;}}\n@media (max-width:640px){.hero-vis{transform:scale(.65);transform-origin:center center;margin:16px auto 0;}}\n@media (max-width:640px){.h-xl{font-size:44px !important}.h-l{font-size:36px !important}.pad{padding-left:20px !important;padding-right:20px !important}.sec{padding-top:72px !important;padding-bottom:72px !important}}\n"}</style>





        <div className={v.rootClass} style={cssToStyle("width: 100%; background: var(--bg-main); color: var(--text-primary); font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-size: 16px; line-height: 1.55; overflow-x: hidden")} data-canvas-width="1440" data-canvas-height="6600" data-document-role="page" data-label="Contact Us — desktop page">


          {/*  ============ TOP BAR ============  */}


          <header className="pad" style={cssToStyle("max-width: 1320px; margin: 0 auto; padding: 22px 40px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap")}>

            <a href="#top" style={cssToStyle("display: flex; align-items: center; gap: 10px; text-decoration: none; color: #17262b")}>

              <span style={cssToStyle("width: 34px; height: 34px; border-radius: 9px; background: #17262b; display: flex; align-items: center; justify-content: center")}>

                <svg width="18" height="18" fill="none" stroke="#c49a52" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 17l5-5 4 4 7-8"></path>
                  <path d="M15 8h5v5"></path></svg>

              </span>


              <span className="disp" style={cssToStyle("font-weight: 700; font-size: 18px; letter-spacing: -0.01em")}>Preferred Tax Consultancy</span>

            </a>


            <nav aria-label="Contact page sections" style={cssToStyle("display: flex; gap: 6px; flex-wrap: wrap")}>

              <a href="#paths" style={cssToStyle("padding: 10px 14px; font-size: 14px; font-weight: 500; color: #52646a; text-decoration: none")}>Who we help</a>


              <a href="#enquiry" style={cssToStyle("padding: 10px 14px; font-size: 14px; font-weight: 500; color: #52646a; text-decoration: none")}>Enquiry</a>


              <a href="#process" style={cssToStyle("padding: 10px 14px; font-size: 14px; font-weight: 500; color: #52646a; text-decoration: none")}>Process</a>


              <a href="#faq" style={cssToStyle("padding: 10px 14px; font-size: 14px; font-weight: 500; color: #52646a; text-decoration: none")}>FAQs</a>

            </nav>


            <a href="#enquiry" className="btn-p" style={cssToStyle(("display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 20px; border-radius: 999px; background: " + (v.accent) + "; color: #fff; text-decoration: none; font-weight: 600; font-size: 14px"))}>Discuss your requirements
              <span className="arrow">→</span></a>

          </header>



          {/*  ============ HERO ============  */}


          <section id="top" className="gridbg pad" style={cssToStyle("border-top: 1px solid rgba(14,26,43,.08); border-bottom: 1px solid rgba(14,26,43,.08)")}>

            <div style={cssToStyle("max-width: 1360px; margin: 0 auto; padding: 64px 32px 56px; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 520px), 1fr)); gap: clamp(36px, 5vw, 72px); align-items: center")}>

              <div style={cssToStyle("min-width: 0; max-width: 620px")}>

                <h1 className="section-eyebrow in" style={cssToStyle("margin: 0 0 24px; color: var(--primary-accent)")}>
                  <span className="eyebrow-dot"></span>
                  Contact Preferred Tax Consultancy — US Tax &amp; Accounting Outsourcing
                </h1>


                <h2 className="in d1" style={cssToStyle("margin: 0; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-size: clamp(38px, 4.4vw, 62px); line-height: 1.08; letter-spacing: -0.04em; font-weight: 750; color: var(--text-primary); text-wrap: balance")}>
                  Let’s discuss your tax, accounting &amp;{" "}
                  <span style={cssToStyle("color: var(--accent-gold);")}>outsourcing</span>{" "}
                  requirements.
                </h2>


                <p className="in d2" style={cssToStyle("margin: 26px 0 0; font-size: 19px; color: #52646a; max-width: 560px")}>Whether you are a CPA firm looking to expand your team’s capacity, a business seeking dependable accounting support, or an individual who needs help with US tax preparation — tell us what you need. We’ll route it to the right desk.</p>


                <div className="in d3" style={cssToStyle("display: flex; gap: 12px; flex-wrap: wrap; margin-top: 34px")}>

                  <a href="#enquiry" className="btn-p" style={cssToStyle(("display: inline-flex; align-items: center; gap: 10px; min-height: 56px; padding: 0 28px; border-radius: 999px; background: " + (v.accent) + "; color: #fff; text-decoration: none; font-weight: 600; font-size: 16px"))}>Discuss Your Requirements
                    <span className="arrow">→</span></a>


                  <a href="#paths" className="btn-g" style={cssToStyle("display: inline-flex; align-items: center; gap: 10px; min-height: 56px; padding: 0 26px; border-radius: 999px; border: 1.5px solid #17262b; color: #17262b; text-decoration: none; font-weight: 600; font-size: 16px")}>Explore Our Services</a>

                </div>


                <p className="in d4" style={cssToStyle("margin: 30px 0 0; font-size: 15px; font-weight: 600; color: #17262b; max-width: 520px; border-top: 1px dashed rgba(14,26,43,.25); padding-top: 18px")}>From individual tax returns to ongoing accounting operations — let’s make your financial work more organised, accurate and manageable.</p>

              </div>



              {/*  routing visual  */}


              <div className="hero-vis in d2" aria-label="Animated diagram: your enquiry is routed to the CPA, Business or Individual desk" role="img" style={cssToStyle("position: relative; width: 560px; height: 480px; flex: 0 0 auto; margin-left: auto; max-width: 100%;")}>

                <svg width="560" height="480" fill="none" aria-hidden="true" style={cssToStyle("position: absolute; inset: 0")}>

                  <path d="M 120 240 C 230 240, 220 90, 330 90" stroke="#17262b" strokeOpacity=".14" strokeWidth="2"></path>


                  <path d="M 120 240 L 330 240" stroke="#17262b" strokeOpacity=".14" strokeWidth="2"></path>


                  <path d="M 120 240 C 230 240, 220 390, 330 390" stroke="#17262b" strokeOpacity=".14" strokeWidth="2"></path>


                  <path className="flow" d="M 120 240 C 230 240, 220 90, 330 90" stroke="#22af68" strokeWidth="2"></path>


                  <path className="flow" d="M 120 240 L 330 240" stroke="#22af68" strokeWidth="2"></path>


                  <path className="flow" d="M 120 240 C 230 240, 220 390, 330 390" stroke="#22af68" strokeWidth="2"></path>

                </svg>


                <span className="pkt pk1"></span>
                <span className="pkt pk2"></span>
                <span className="pkt pk3"></span>



                <div style={cssToStyle("position: absolute; left: 20px; top: 180px; width: 120px; height: 120px")}>

                  <span className="ring"></span>
                  <span className="ring ring2"></span>


                  <div style={cssToStyle("position: absolute; inset: 0; border-radius: 50%; background: #17262b; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; box-shadow: 0 20px 40px -18px rgba(14,26,43,.6)")}>

                    <svg width="26" height="26" fill="none" stroke="#c49a52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16v12H5.2L4 17.2V4z"></path>
                      <path d="M8 9h8M8 12h5"></path></svg>


                    <span className="mono" style={cssToStyle("font-size: 10px; letter-spacing: .1em")}>YOUR ENQUIRY</span>

                  </div>

                </div>



                {(v.desks || []).map((d, index) => (
                  <React.Fragment key={index}>


                    <a href="#paths" onClick={d.pick} className="desk" style={cssToStyle(("position: absolute; left: 330px; top: " + (d.top) + "; width: 228px; min-height: 76px; padding: 14px 16px; border-radius: 16px; background: var(--card-surface); border: 1.5px solid var(--border-color); text-decoration: none; color: #17262b; display: flex; align-items: center; gap: 12px; box-shadow: 0 10px 30px -22px rgba(14,26,43,.45)"))}>

                      <span style={cssToStyle("width: 40px; height: 40px; flex: 0 0 auto; border-radius: 12px; background: #17262b; color: #c49a52; display: flex; align-items: center; justify-content: center")} className="mono">{d.code}</span>


                      <span style={cssToStyle("display: flex; flex-direction: column; min-width: 0")}>

                        <span style={cssToStyle("font-weight: 600; font-size: 15px")}>{d.label}</span>


                        <span className="mono" style={cssToStyle("font-size: 11px; color: #52646a")}>{d.sub}</span>

                      </span>


                      <span className="arrow" style={cssToStyle("margin-left: auto; color: #22af68; font-weight: 700")}>→</span>

                    </a>


                  </React.Fragment>
                ))}


                <p className="mono" style={cssToStyle("position: absolute; left: 22px; bottom: 6px; margin: 0; font-size: 11px; color: #52646a; letter-spacing: .06em")}>PICK A DESK TO SEE HOW WE HELP ↗</p>

              </div>

            </div>



            {/*  quick contact strip  */}


            <div style={cssToStyle("max-width: 1320px; margin: 0 auto; padding: 0 40px 56px; display: flex; flex-wrap: wrap; gap: 14px")}>

              <a href="mailto:[EMAIL]" className="tile rv" style={cssToStyle("flex: 1 1 230px; min-height: 92px; padding: 18px 20px; border-radius: 18px; background: var(--card-surface); border: 1px solid var(--border-color); text-decoration: none; color: #17262b; display: flex; gap: 14px; align-items: center")}>

                <span style={cssToStyle("width: 44px; height: 44px; border-radius: 12px; background: #e8f3ef; color: #22af68; display: flex; align-items: center; justify-content: center; flex: 0 0 auto")}><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect>
                  <path d="M3 7l9 6 9-6"></path></svg></span>


                <span style={cssToStyle("display: flex; flex-direction: column")}><span className="mono" style={cssToStyle("font-size: 11px; color: #52646a; letter-spacing: .08em")}>EMAIL US</span>
                  <span style={cssToStyle("font-weight: 600")}>[BUSINESS EMAIL]</span></span>

              </a>


              <a href="tel:[PHONE]" className="tile rv" style={cssToStyle("flex: 1 1 230px; min-height: 92px; padding: 18px 20px; border-radius: 18px; background: var(--card-surface); border: 1px solid var(--border-color); text-decoration: none; color: #17262b; display: flex; gap: 14px; align-items: center")}>

                <span style={cssToStyle("width: 44px; height: 44px; border-radius: 12px; background: #e8f3ef; color: #22af68; display: flex; align-items: center; justify-content: center; flex: 0 0 auto")}><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"></path></svg></span>


                <span style={cssToStyle("display: flex; flex-direction: column")}><span className="mono" style={cssToStyle("font-size: 11px; color: #52646a; letter-spacing: .08em")}>CALL / WHATSAPP</span>
                  <span style={cssToStyle("font-weight: 600")}>[PHONE NUMBER]</span></span>

              </a>


              <div className="tile rv" style={cssToStyle("flex: 1 1 230px; min-height: 92px; padding: 18px 20px; border-radius: 18px; background: var(--card-surface); border: 1px solid var(--border-color); display: flex; gap: 14px; align-items: center")}>

                <span style={cssToStyle("width: 44px; height: 44px; border-radius: 12px; background: #e8f3ef; color: #22af68; display: flex; align-items: center; justify-content: center; flex: 0 0 auto")}><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle>
                  <path d="M12 7v5l3 2"></path></svg></span>


                <span style={cssToStyle("display: flex; flex-direction: column")}><span className="mono" style={cssToStyle("font-size: 11px; color: #52646a; letter-spacing: .08em")}>WORKING HOURS</span>
                  <span style={cssToStyle("font-weight: 600")}>[US ET / IST HOURS]</span></span>

              </div>


              <div className="tile rv" style={cssToStyle("flex: 1 1 230px; min-height: 92px; padding: 18px 20px; border-radius: 18px; background: var(--card-surface); border: 1px solid var(--border-color); display: flex; gap: 14px; align-items: center")}>

                <span style={cssToStyle("width: 44px; height: 44px; border-radius: 12px; background: #e8f3ef; color: #22af68; display: flex; align-items: center; justify-content: center; flex: 0 0 auto")}><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"></path>
                  <circle cx="12" cy="9.5" r="2.5"></circle></svg></span>


                <span style={cssToStyle("display: flex; flex-direction: column")}><span className="mono" style={cssToStyle("font-size: 11px; color: #52646a; letter-spacing: .08em")}>OFFICE</span>
                  <span style={cssToStyle("font-weight: 600")}>[OFFICE ADDRESS]</span></span>

              </div>

            </div>

          </section>






          {/*  ============ 2. ENQUIRY ============  */}


          <section id="enquiry" className="sec pad" style={cssToStyle("padding: 112px 40px")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto")}>

              <div className="rv" style={cssToStyle("max-width: 760px")}>

                <p className="mono" style={cssToStyle(("margin: 0 0 16px; font-size: 13px; letter-spacing: .1em; color: " + (v.accent)))}>02 — SEND US YOUR ENQUIRY</p>


                <h2 className="disp h-l" style={cssToStyle("margin: 0; font-size: 54px; line-height: 1.05; letter-spacing: -0.03em; font-weight: 600")}>Four quick steps. Your routing slip fills itself in.</h2>


                <p style={cssToStyle("margin: 18px 0 0; color: #52646a; font-size: 18px")}>Share a few details about your requirements so our team understands your situation before getting in touch.</p>

              </div>



              <div style={cssToStyle("margin-top: 52px; display: flex; flex-wrap: wrap; gap: 28px; align-items: flex-start")}>

                {/*  FORM CARD  */}


                <div className="rv" style={cssToStyle("flex: 999 1 600px; min-width: 0; border-radius: 28px; background: var(--card-surface); border: 1px solid var(--border-color); box-shadow: 0 30px 60px -40px rgba(14,26,43,.35); overflow: hidden")}>

                  {/*  stepper  */}


                  <div style={cssToStyle("padding: 26px 32px 0")}>

                    <div style={cssToStyle("display: flex; gap: 8px; flex-wrap: wrap")}>

                      {(v.formSteps || []).map((fs, index) => (
                        <React.Fragment key={index}>


                          <div style={cssToStyle("flex: 1 1 120px; display: flex; flex-direction: column; gap: 10px")}>

                            <span style={cssToStyle(("height: 4px; border-radius: 999px; background: " + (fs.bar) + "; transition: background .5s"))}></span>


                            <span style={cssToStyle(("display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: " + (fs.color)))}><span className="mono" style={cssToStyle("font-size: 11px")}>{fs.num}</span>
                              {fs.label}</span>

                          </div>


                        </React.Fragment>
                      ))}

                    </div>

                  </div>



                  <div style={cssToStyle("padding: 32px; min-height: 470px")}>

                    {(v.submitted) && (
                      <React.Fragment>


                        <div className="swap" style={cssToStyle("display: flex; flex-direction: column; align-items: flex-start; gap: 18px; padding: 20px 0")}>

                          <svg width="84" height="84" aria-hidden="true"><circle cx="42" cy="42" r="38" fill="#c49a52"></circle>
                            <path className="succ" d="M26 43l11 11 22-24" stroke="#17262b" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg>


                          <h3 className="disp" style={cssToStyle("margin: 0; font-size: 34px; letter-spacing: -0.02em")}>Enquiry received — routed to the {v.ticketDesk}.</h3>


                          <p style={cssToStyle("margin: 0; color: #52646a; font-size: 17px; max-width: 560px")}>Thank you, {v.ticketFirst}. Our team will review your requirements and connect with you [RESPONSE TIME] to discuss scope, workflow and next steps.</p>


                          <div style={cssToStyle("display: flex; flex-direction: column; gap: 10px; margin-top: 6px; width: 100%")}>

                            <div className="slidein" style={cssToStyle("display: flex; gap: 12px; align-items: center; padding: 14px 16px; border-radius: 14px; background: #f7f7f2; animation-delay: .3s")}><span className="mono" style={cssToStyle("color: #22af68; font-size: 12px")}>01</span>
                              We review your service needs, workload and timeline.</div>


                            <div className="slidein" style={cssToStyle("display: flex; gap: 12px; align-items: center; padding: 14px 16px; border-radius: 14px; background: #f7f7f2; animation-delay: .45s")}><span className="mono" style={cssToStyle("color: #22af68; font-size: 12px")}>02</span>
                              We schedule an initial discussion to clarify scope.</div>


                            <div className="slidein" style={cssToStyle("display: flex; gap: 12px; align-items: center; padding: 14px 16px; border-radius: 14px; background: #f7f7f2; animation-delay: .6s")}><span className="mono" style={cssToStyle("color: #22af68; font-size: 12px")}>03</span>
                              We agree a secure method for sharing documents — only if needed.</div>

                          </div>


                          <button type="button" onClick={v.reset} className="btn-g" style={cssToStyle("margin-top: 8px; min-height: 48px; padding: 0 22px; border-radius: 999px; border: 1.5px solid #17262b; background: transparent; color: #17262b; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 15px")}>Send another enquiry</button>

                        </div>


                      </React.Fragment>
                    )}



                    {(v.notSubmitted) && (
                      <React.Fragment>


                        <div>

                          {/*  step 0  */}


                          {(v.s0) && (
                            <React.Fragment>


                              <fieldset className="swap" style={cssToStyle("border: 0; margin: 0; padding: 0")}>

                                <legend className="disp" style={cssToStyle("font-size: 28px; font-weight: 600; letter-spacing: -0.02em; padding: 0")}>Who are you?</legend>


                                <p style={cssToStyle("margin: 8px 0 0; color: #52646a")}>This decides which desk receives your enquiry.</p>


                                <div style={cssToStyle("margin-top: 24px; display: flex; flex-wrap: wrap; gap: 14px")}>

                                  {(v.roles || []).map((r, index) => (
                                    <React.Fragment key={index}>


                                      <button type="button" aria-pressed={r.selected} onClick={r.pick} className="rolecard" style={cssToStyle(("flex: 1 1 240px; min-height: 120px; text-align: left; padding: 20px; border-radius: 18px; border: 1.5px solid " + (r.border) + "; background: " + (r.bg) + "; cursor: pointer; font-family: inherit; color: #17262b; display: flex; flex-direction: column; gap: 8px"))}>

                                        <span style={cssToStyle("display: flex; justify-content: space-between; align-items: center; width: 100%")}>

                                          <span className="mono" style={cssToStyle(("width: 40px; height: 40px; border-radius: 12px; background: " + (r.iconBg) + "; color: " + (r.iconFg) + "; display: flex; align-items: center; justify-content: center; font-size: 13px; transition: background .3s, color .3s"))}>{r.code}</span>


                                          <span style={cssToStyle(("width: 22px; height: 22px; border-radius: 50%; border: 2px solid " + (r.border) + "; background: " + (r.dot) + "; transition: all .3s"))}></span>

                                        </span>


                                        <span style={cssToStyle("font-weight: 600; font-size: 17px")}>{r.label}</span>


                                        <span style={cssToStyle("font-size: 14px; color: #52646a")}>{r.hint}</span>

                                      </button>


                                    </React.Fragment>
                                  ))}

                                </div>

                              </fieldset>


                            </React.Fragment>
                          )}



                          {/*  step 1  */}


                          {(v.s1) && (
                            <React.Fragment>


                              <fieldset className="swap" style={cssToStyle("border: 0; margin: 0; padding: 0")}>

                                <legend className="disp" style={cssToStyle("font-size: 28px; font-weight: 600; letter-spacing: -0.02em; padding: 0")}>What service are you interested in?</legend>


                                <p style={cssToStyle("margin: 8px 0 0; color: #52646a")}>Select all that apply.</p>


                                <div style={cssToStyle("margin-top: 22px; display: flex; flex-wrap: wrap; gap: 10px")}>

                                  {(v.services || []).map((sv, index) => (
                                    <React.Fragment key={index}>


                                      <button type="button" aria-pressed={sv.selected} onClick={sv.toggle} className="chip" style={cssToStyle(("min-height: 46px; padding: 0 18px; border-radius: 999px; border: 1.5px solid " + (sv.border) + "; background: " + (sv.bg) + "; color: " + (sv.fg) + "; font-family: inherit; font-size: 15px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 8px"))}>{sv.mark} {sv.label}</button>


                                    </React.Fragment>
                                  ))}

                                </div>


                                <p className="disp" style={cssToStyle("margin: 32px 0 0; font-size: 18px; font-weight: 600")}>Are you looking for one-time assistance or ongoing support?</p>


                                <div style={cssToStyle("margin-top: 14px; display: flex; flex-wrap: wrap; gap: 10px")}>

                                  {(v.scopes || []).map((sc, index) => (
                                    <React.Fragment key={index}>


                                      <button type="button" aria-pressed={sc.selected} onClick={sc.pick} className="chip" style={cssToStyle(("min-height: 46px; padding: 0 18px; border-radius: 12px; border: 1.5px solid " + (sc.border) + "; background: " + (sc.bg) + "; color: " + (sc.fg) + "; font-family: inherit; font-size: 15px; font-weight: 500; cursor: pointer"))}>{sc.label}</button>


                                    </React.Fragment>
                                  ))}

                                </div>

                              </fieldset>


                            </React.Fragment>
                          )}



                          {/*  step 2  */}


                          {(v.s2) && (
                            <React.Fragment>


                              <fieldset className="swap" style={cssToStyle("border: 0; margin: 0; padding: 0")}>

                                <legend className="disp" style={cssToStyle("font-size: 28px; font-weight: 600; letter-spacing: -0.02em; padding: 0")}>Tell us about your requirements</legend>


                                <div style={cssToStyle("margin-top: 22px; display: flex; flex-direction: column; gap: 6px")}>

                                  <label htmlFor="f-vol" style={cssToStyle("font-size: 14px; font-weight: 600")}>Estimated monthly workload or number of returns
                                    <span style={cssToStyle("color: #52646a; font-weight: 400")}>(optional)</span></label>


                                  <input id="f-vol" type="text" className="field" value={v.volume} onChange={v.onVolume} placeholder="e.g. ~40 individual returns per month in season" style={cssToStyle("min-height: 52px; padding: 0 16px; border-radius: 12px; border: 1.5px solid #dcece3; font-family: inherit; font-size: 16px; color: #17262b; background: #fff")} />

                                </div>


                                <p style={cssToStyle("margin: 22px 0 0; font-size: 14px; font-weight: 600")}>Preferred engagement timeline</p>


                                <div style={cssToStyle("margin-top: 10px; display: flex; flex-wrap: wrap; gap: 10px")}>

                                  {(v.timelines || []).map((tl, index) => (
                                    <React.Fragment key={index}>


                                      <button type="button" aria-pressed={tl.selected} onClick={tl.pick} className="chip" style={cssToStyle(("min-height: 46px; padding: 0 18px; border-radius: 12px; border: 1.5px solid " + (tl.border) + "; background: " + (tl.bg) + "; color: " + (tl.fg) + "; font-family: inherit; font-size: 15px; font-weight: 500; cursor: pointer"))}>{tl.label}</button>


                                    </React.Fragment>
                                  ))}

                                </div>


                                <div style={cssToStyle("margin-top: 22px; display: flex; flex-direction: column; gap: 6px")}>

                                  <label htmlFor="f-msg" style={cssToStyle("font-size: 14px; font-weight: 600")}>Additional details about your requirements</label>


                                  <textarea id="f-msg" rows="5" className="field" value={v.message} onChange={v.onMessage} placeholder="Please describe the type of tax, accounting or outsourcing support you are looking for. You can also mention your current challenges, expected workload or any specific requirements." style={cssToStyle("padding: 14px 16px; border-radius: 12px; border: 1.5px solid #dcece3; font-family: inherit; font-size: 16px; color: #17262b; resize: vertical; background: #fff")}></textarea>

                                </div>

                              </fieldset>


                            </React.Fragment>
                          )}



                          {/*  step 3  */}


                          {(v.s3) && (
                            <React.Fragment>


                              <fieldset className="swap" style={cssToStyle("border: 0; margin: 0; padding: 0")}>

                                <legend className="disp" style={cssToStyle("font-size: 28px; font-weight: 600; letter-spacing: -0.02em; padding: 0")}>How can we reach you?</legend>


                                <div style={cssToStyle("margin-top: 22px; display: flex; flex-wrap: wrap; gap: 16px")}>

                                  <div style={cssToStyle("flex: 1 1 260px; display: flex; flex-direction: column; gap: 6px")}>

                                    <label htmlFor="f-name" style={cssToStyle("font-size: 14px; font-weight: 600")}>Full name *</label>


                                    <input id="f-name" type="text" autoComplete="name" className="field" value={v.name} onChange={v.onName} style={cssToStyle("min-height: 52px; padding: 0 16px; border-radius: 12px; border: 1.5px solid #dcece3; font-family: inherit; font-size: 16px; color: #17262b; background: #fff")} />

                                  </div>


                                  <div style={cssToStyle("flex: 1 1 260px; display: flex; flex-direction: column; gap: 6px")}>

                                    <label htmlFor="f-co" style={cssToStyle("font-size: 14px; font-weight: 600")}>Company / firm name
                                      <span style={cssToStyle("color: #52646a; font-weight: 400")}>(optional)</span></label>


                                    <input id="f-co" type="text" autoComplete="organization" className="field" value={v.company} onChange={v.onCompany} style={cssToStyle("min-height: 52px; padding: 0 16px; border-radius: 12px; border: 1.5px solid #dcece3; font-family: inherit; font-size: 16px; color: #17262b; background: #fff")} />

                                  </div>


                                  <div style={cssToStyle("flex: 1 1 260px; display: flex; flex-direction: column; gap: 6px")}>

                                    <label htmlFor="f-email" style={cssToStyle("font-size: 14px; font-weight: 600")}>Business email address *</label>


                                    <input id="f-email" type="email" autoComplete="email" className="field" value={v.email} onChange={v.onEmail} style={cssToStyle("min-height: 52px; padding: 0 16px; border-radius: 12px; border: 1.5px solid #dcece3; font-family: inherit; font-size: 16px; color: #17262b; background: #fff")} />

                                  </div>


                                  <div style={cssToStyle("flex: 1 1 260px; display: flex; flex-direction: column; gap: 6px")}>

                                    <label htmlFor="f-phone" style={cssToStyle("font-size: 14px; font-weight: 600")}>Contact number</label>


                                    <input id="f-phone" type="tel" autoComplete="tel" className="field" value={v.phone} onChange={v.onPhone} style={cssToStyle("min-height: 52px; padding: 0 16px; border-radius: 12px; border: 1.5px solid #dcece3; font-family: inherit; font-size: 16px; color: #17262b; background: #fff")} />

                                  </div>


                                  <div style={cssToStyle("flex: 1 1 260px; display: flex; flex-direction: column; gap: 6px")}>

                                    <label htmlFor="f-country" style={cssToStyle("font-size: 14px; font-weight: 600")}>Country</label>


                                    <input id="f-country" type="text" autoComplete="country-name" className="field" value={v.country} onChange={v.onCountry} placeholder="United States" style={cssToStyle("min-height: 52px; padding: 0 16px; border-radius: 12px; border: 1.5px solid #dcece3; font-family: inherit; font-size: 16px; color: #17262b; background: #fff")} />

                                  </div>

                                </div>


                                <div style={cssToStyle("margin-top: 22px; display: flex; gap: 12px; padding: 16px 18px; border-radius: 14px; background: #fbf2df; border: 1px solid #e4bd72; font-size: 14px; color: #52646a")}>

                                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={cssToStyle("flex: 0 0 auto; margin-top: 1px")}><rect x="5" y="11" width="14" height="10" rx="2"></rect>
                                    <path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>


                                  <span>Please do not include SSNs, ITINs, bank account details, tax return copies or other sensitive financial information in this form. We’ll agree a secure method for sharing documents if needed.</span>

                                </div>

                              </fieldset>


                            </React.Fragment>
                          )}



                          {/*  form nav  */}


                          <div style={cssToStyle("margin-top: 32px; padding-top: 22px; border-top: 1px solid #dcece3; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap")}>

                            {(v.showBack) && (
                              <React.Fragment>


                                <button type="button" onClick={v.back} className="btn-g" style={cssToStyle("min-height: 52px; padding: 0 22px; border-radius: 999px; border: 1.5px solid #c2ded0; background: transparent; color: #17262b; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 15px")}>← Back</button>


                              </React.Fragment>
                            )}


                            {(v.hideBack) && (
                              <React.Fragment>


                                <span className="mono" style={cssToStyle("font-size: 12px; color: #52646a")}>STEP {v.stepNum} OF 4</span>


                              </React.Fragment>
                            )}


                            {(v.notLast) && (
                              <React.Fragment>


                                <button type="button" onClick={v.next} disabled={v.nextDisabled} className="btn-p" style={cssToStyle(("min-height: 56px; padding: 0 28px; border-radius: 999px; border: 0; background: " + (v.nextBg) + "; color: #fff; font-weight: 600; cursor: " + (v.nextCursor) + "; font-family: inherit; font-size: 16px; display: inline-flex; align-items: center; gap: 10px"))}>Continue
                                  <span className="arrow">→</span></button>


                              </React.Fragment>
                            )}


                            {(v.isLast) && (
                              <React.Fragment>


                                <button type="button" onClick={v.submit} disabled={v.nextDisabled} className="btn-p" style={cssToStyle(("min-height: 56px; padding: 0 28px; border-radius: 999px; border: 0; background: " + (v.nextBg) + "; color: #fff; font-weight: 600; cursor: " + (v.nextCursor) + "; font-family: inherit; font-size: 16px; display: inline-flex; align-items: center; gap: 10px"))}>Submit Your Enquiry
                                  <span className="arrow">→</span></button>


                              </React.Fragment>
                            )}

                          </div>

                        </div>


                      </React.Fragment>
                    )}

                  </div>

                </div>



              </div>

            </div>

          </section>



          {/*  ============ 3. PROCESS ============  */}


          <section id="process" className="sec pad" style={cssToStyle("padding: 112px 40px; background: var(--card-surface); border-top: 1px solid rgba(14,26,43,.08); border-bottom: 1px solid rgba(14,26,43,.08)")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto")}>

              <div className="rv" style={cssToStyle("display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 24px")}>

                <div style={cssToStyle("max-width: 700px")}>

                  <p className="mono" style={cssToStyle(("margin: 0 0 16px; font-size: 13px; letter-spacing: .1em; color: " + (v.accent)))}>03 — HOW WE HANDLE YOUR ENQUIRY</p>


                  <h2 className="disp h-l" style={cssToStyle("margin: 0; font-size: 54px; line-height: 1.05; letter-spacing: -0.03em; font-weight: 600")}>A professional engagement starts with understanding.</h2>

                </div>


                <button type="button" onClick={v.togglePlay} className="btn-g" style={cssToStyle("min-height: 48px; padding: 0 20px; border-radius: 999px; border: 1.5px solid #c2ded0; background: transparent; color: #17262b; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 14px; display: inline-flex; align-items: center; gap: 8px")}>{v.playLabel}</button>

              </div>



              {/*  track  */}


              <div className="rv" style={cssToStyle("margin-top: 56px; position: relative")}>

                <div aria-hidden="true" style={cssToStyle("position: absolute; left: 28px; right: 28px; top: 27px; height: 3px; background: #dcece3; border-radius: 999px")}>

                  <span style={cssToStyle(("display: block; height: 100%; width: " + (v.procFill) + "; background: " + (v.accent) + "; border-radius: 999px; transition: width .8s cubic-bezier(.2,.8,.2,1)"))}></span>

                </div>


                <ol style={cssToStyle("list-style: none; margin: 0; padding: 0; position: relative; display: flex; justify-content: space-between; gap: 8px")}>

                  {(v.proc || []).map((st, index) => (
                    <React.Fragment key={index}>


                      <li style={cssToStyle("flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; align-items: center; text-align: center")}>

                        <button type="button" onClick={st.pick} aria-current={st.active} aria-label={st.aria} style={cssToStyle(("width: 56px; height: 56px; border-radius: 50%; border: 3px solid " + (st.ring) + "; background: " + (st.bg) + "; color: " + (st.fg) + "; cursor: pointer; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 500; transform: scale(" + (st.scale) + "); transition: all .5s cubic-bezier(.2,.8,.2,1)"))}>{st.num}</button>


                        <span className="disp" style={cssToStyle(("margin-top: 14px; font-size: 15px; font-weight: 600; color: " + (st.label) + "; transition: color .4s"))}>{st.short}</span>

                      </li>


                    </React.Fragment>
                  ))}

                </ol>

              </div>



              {/*  active step  */}


              <div style={cssToStyle("margin-top: 40px; border-radius: 28px; background: #f7f7f2; border: 1px solid var(--border-color); overflow: hidden")}>

                {(v.proc || []).map((st, index) => (
                  <React.Fragment key={index}>


                    {(st.active) && (
                      <React.Fragment>


                        <div className="swap" style={cssToStyle("display: flex; flex-wrap: wrap; align-items: stretch")}>

                          <div style={cssToStyle("flex: 0 1 300px; padding: 40px; background: #17262b; color: #fff; display: flex; flex-direction: column; justify-content: space-between; gap: 24px")}>

                            <span className="mono" style={cssToStyle("font-size: 12px; letter-spacing: .1em; color: #c49a52")}>STEP {st.num} / 05</span>


                            <span className="disp" style={cssToStyle("font-size: 120px; line-height: .85; font-weight: 600; letter-spacing: -0.05em")}>{st.num}</span>

                          </div>


                          <div style={cssToStyle("flex: 1 1 420px; min-width: 0; padding: 40px 44px; display: flex; flex-direction: column; justify-content: center")}>

                            <h3 className="disp" style={cssToStyle("margin: 0; font-size: 34px; letter-spacing: -0.02em; font-weight: 600")}>{st.title}</h3>


                            <p style={cssToStyle("margin: 14px 0 0; font-size: 18px; color: #52646a; max-width: 620px")}>{st.text}</p>


                            <div style={cssToStyle("margin-top: 22px; display: flex; flex-wrap: wrap; gap: 8px")}>

                              {(st.tags || []).map((tg, index) => (
                                <React.Fragment key={index}>


                                  <span className="mono slidein" style={cssToStyle(("font-size: 12px; padding: 6px 12px; border-radius: 999px; background: var(--card-surface); border: 1px solid #dcece3; animation-delay: " + (tg.delay)))}>{tg.label}</span>


                                </React.Fragment>
                              ))}

                            </div>

                          </div>

                        </div>


                      </React.Fragment>
                    )}


                  </React.Fragment>
                ))}


                <div aria-hidden="true" style={cssToStyle("height: 4px; background: #dcece3")}>

                  <span style={cssToStyle(("display: block; height: 100%; width: " + (v.autoW) + "; background: #c49a52"))}></span>

                </div>

              </div>

            </div>

          </section>



          {/*  ============ 4. WHY ============  */}


          <section className="sec pad" style={cssToStyle("padding: 112px 40px")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto")}>

              <div className="rv" style={cssToStyle("max-width: 760px")}>

                <p className="mono" style={cssToStyle(("margin: 0 0 16px; font-size: 13px; letter-spacing: .1em; color: " + (v.accent)))}>04 — WHY START A CONVERSATION WITH US</p>


                <h2 className="disp h-l" style={cssToStyle("margin: 0; font-size: 54px; line-height: 1.05; letter-spacing: -0.03em; font-weight: 600")}>More than a price comparison.</h2>


                <p style={cssToStyle("margin: 18px 0 0; color: #52646a; font-size: 18px")}>You need a team that understands accounting workflows, tax documentation, compliance requirements — and handles financial information responsibly.</p>

              </div>



              <div style={cssToStyle("margin-top: 52px; display: flex; flex-wrap: wrap; gap: 18px")}>

                <div className="tile rv" style={cssToStyle(("flex: 2 1 460px; min-height: 300px; border-radius: 28px; padding: 36px; background: " + (v.accent) + "; color: #fff; border: 1px solid transparent; display: flex; flex-direction: column; justify-content: space-between; gap: 24px"))}>

                  <span className="mono" style={cssToStyle("font-size: 12px; letter-spacing: .1em; opacity: .85")}>A TEAM WITH RELEVANT ACCOUNTING EXPERIENCE</span>


                  <div>

                    <p className="disp" style={cssToStyle("margin: 0; font-size: 96px; line-height: .9; font-weight: 600; letter-spacing: -0.05em")}>5–10
                      <span style={cssToStyle("font-size: 36px; letter-spacing: -0.02em")}> yrs</span></p>


                    <p style={cssToStyle("margin: 14px 0 0; font-size: 17px; max-width: 480px; opacity: .92")}>Accountants, reviewers and tax specialists with 5–10 years of experience, as represented in our team experience profile.</p>

                  </div>

                </div>


                <div className="tile rv" style={cssToStyle("flex: 1 1 300px; min-height: 300px; border-radius: 28px; padding: 36px; background: #17262b; color: #fff; border: 1px solid transparent; display: flex; flex-direction: column; justify-content: space-between; gap: 24px")}>

                  <span className="mono" style={cssToStyle("font-size: 12px; letter-spacing: .1em; color: #c49a52")}>EXPERIENCE ACROSS CLIENT REQUIREMENTS</span>


                  <div>

                    <p className="disp" style={cssToStyle("margin: 0; font-size: 80px; line-height: .9; font-weight: 600; letter-spacing: -0.05em")}>250–500</p>


                    <p style={cssToStyle("margin: 14px 0 0; font-size: 16px; color: #b6cad0")}>A client base reflecting experience across different accounting and tax service requirements.</p>

                  </div>

                </div>


                <div className="tile rv" style={cssToStyle("flex: 1 1 340px; min-height: 280px; border-radius: 28px; padding: 32px; background: var(--card-surface); border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 18px")}>

                  <span className="mono" style={cssToStyle("font-size: 12px; letter-spacing: .1em; color: #52646a")}>SUPPORT ACROSS MULTIPLE FUNCTIONS</span>


                  <h3 className="disp" style={cssToStyle("margin: 0; font-size: 26px; letter-spacing: -0.02em; font-weight: 600")}>One relationship. Every function.</h3>


                  <div style={cssToStyle("display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto")}>

                    <span style={cssToStyle("font-size: 13px; padding: 7px 12px; border-radius: 999px; background: #e8f3ef; color: #1a8650")}>Tax preparation</span>


                    <span style={cssToStyle("font-size: 13px; padding: 7px 12px; border-radius: 999px; background: #e8f3ef; color: #1a8650")}>Bookkeeping</span>


                    <span style={cssToStyle("font-size: 13px; padding: 7px 12px; border-radius: 999px; background: #e8f3ef; color: #1a8650")}>Payroll</span>


                    <span style={cssToStyle("font-size: 13px; padding: 7px 12px; border-radius: 999px; background: #e8f3ef; color: #1a8650")}>Tax planning</span>


                    <span style={cssToStyle("font-size: 13px; padding: 7px 12px; border-radius: 999px; background: #e8f3ef; color: #1a8650")}>Foreign compliance</span>


                    <span style={cssToStyle("font-size: 13px; padding: 7px 12px; border-radius: 999px; background: #e8f3ef; color: #1a8650")}>AP / AR</span>

                  </div>

                </div>


                <div className="tile rv" style={cssToStyle("flex: 1 1 340px; min-height: 280px; border-radius: 28px; padding: 32px; background: var(--card-surface); border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 18px")}>

                  <span className="mono" style={cssToStyle("font-size: 12px; letter-spacing: .1em; color: #52646a")}>FLEXIBLE OUTSOURCING DISCUSSIONS</span>


                  <h3 className="disp" style={cssToStyle("margin: 0; font-size: 26px; letter-spacing: -0.02em; font-weight: 600")}>Shape the engagement around you.</h3>


                  <div style={cssToStyle("display: flex; flex-direction: column; gap: 12px; margin-top: auto")}>

                    <div style={cssToStyle("display: flex; justify-content: space-between; align-items: center")}><span style={cssToStyle("font-weight: 500")}>Defined project</span>
                      <span className="track" style={cssToStyle("width: 46px; height: 26px; border-radius: 999px; padding: 3px; display: block")}><span className="knob" style={cssToStyle("display: block; width: 20px; height: 20px; border-radius: 50%; background: #17262b")}></span></span></div>


                    <div style={cssToStyle("display: flex; justify-content: space-between; align-items: center")}><span style={cssToStyle("font-weight: 500")}>Recurring accounting work</span>
                      <span className="track" style={cssToStyle("width: 46px; height: 26px; border-radius: 999px; padding: 3px; display: block; animation-delay: 1.5s")}><span className="knob" style={cssToStyle("display: block; width: 20px; height: 20px; border-radius: 50%; background: #17262b; animation-delay: 1.5s")}></span></span></div>


                    <div style={cssToStyle("display: flex; justify-content: space-between; align-items: center")}><span style={cssToStyle("font-weight: 500")}>Seasonal capacity</span>
                      <span className="track" style={cssToStyle("width: 46px; height: 26px; border-radius: 999px; padding: 3px; display: block; animation-delay: 3s")}><span className="knob" style={cssToStyle("display: block; width: 20px; height: 20px; border-radius: 50%; background: #17262b; animation-delay: 3s")}></span></span></div>

                  </div>

                </div>


                <div className="tile rv" style={cssToStyle("flex: 1 1 100%; border-radius: 28px; padding: 30px 0; background: var(--card-surface); border: 1px solid var(--border-color); overflow: hidden")}>

                  <div style={cssToStyle("padding: 0 32px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; align-items: baseline")}>

                    <span className="mono" style={cssToStyle("font-size: 12px; letter-spacing: .1em; color: #52646a")}>FAMILIARITY WITH PROFESSIONAL TAX SOFTWARE</span>


                    <span style={cssToStyle("font-size: 13px; color: #52646a")}>Subject to the specific engagement and workflow.</span>

                  </div>


                  <div style={cssToStyle("margin-top: 22px; overflow: hidden; mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)")}>

                    <div className="marquee" style={cssToStyle("display: flex; gap: 14px; width: max-content")}>

                      {(v.software || []).map((sw, index) => (
                        <React.Fragment key={index}>


                          <span className="disp" style={cssToStyle("white-space: nowrap; font-size: 22px; font-weight: 600; padding: 14px 26px; border-radius: 16px; border: 1.5px solid #E1E5EA; color: #17262b")}>{sw}</span>


                        </React.Fragment>
                      ))}

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </section>



          {/*  ============ 5. FAQ ============  */}


          <section id="faq" className="sec pad" style={cssToStyle("padding: 40px 40px 112px")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 56px")}>

              <div className="rv" style={cssToStyle("flex: 1 1 320px; min-width: 0")}>

                <div style={cssToStyle("position: sticky; top: 24px")}>

                  <p className="mono" style={cssToStyle(("margin: 0 0 16px; font-size: 13px; letter-spacing: .1em; color: " + (v.accent)))}>05 — FREQUENTLY ASKED QUESTIONS</p>


                  <h2 className="disp h-l" style={cssToStyle("margin: 0; font-size: 48px; line-height: 1.05; letter-spacing: -0.03em; font-weight: 600")}>Questions before you reach out?</h2>


                  <p style={cssToStyle("margin: 16px 0 0; color: #52646a; font-size: 17px")}>Still unsure which desk is right for you? Select “Not Sure – Need Guidance” in the form and we’ll point you the right way.</p>


                  <a href="#enquiry" className="btn-p" style={cssToStyle(("margin-top: 26px; display: inline-flex; align-items: center; gap: 10px; min-height: 52px; padding: 0 24px; border-radius: 999px; background: " + (v.accent) + "; color: #fff; text-decoration: none; font-weight: 600"))}>Ask us directly
                    <span className="arrow">→</span></a>

                </div>

              </div>


              <div style={cssToStyle("flex: 2 1 560px; min-width: 0; display: flex; flex-direction: column; gap: 10px")}>

                {(v.faqs || []).map((f, index) => (
                  <React.Fragment key={index}>


                    <div className="rv" style={cssToStyle(("border-radius: 18px; background: var(--card-surface); border: 1.5px solid " + (f.border) + "; overflow: hidden; transition: border-color .3s"))}>

                      <h3 style={cssToStyle("margin: 0")}>

                        <button type="button" onClick={f.toggle} aria-expanded={f.open} className="faqq" style={cssToStyle("width: 100%; min-height: 68px; padding: 18px 22px; border: 0; background: transparent; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 16px; font-family: 'Space Grotesk', Inter, sans-serif; font-size: 18px; font-weight: 600; color: #17262b")}>

                          <span className="mono" style={cssToStyle("font-size: 12px; color: #52646a; font-weight: 400")}>{f.num}</span>


                          <span style={cssToStyle("flex: 1 1 auto")}>{f.q}</span>


                          <span aria-hidden="true" style={cssToStyle(("width: 34px; height: 34px; flex: 0 0 auto; border-radius: 50%; background: " + (f.iconBg) + "; color: " + (f.iconFg) + "; display: flex; align-items: center; justify-content: center; font-size: 20px; transform: rotate(" + (f.rot) + "); transition: transform .4s cubic-bezier(.2,.8,.2,1), background .3s"))}>+</span>

                        </button>

                      </h3>


                      {(f.open) && (
                        <React.Fragment>


                          <p className="swap" style={cssToStyle("margin: 0; padding: 0 22px 22px 58px; color: #52646a; font-size: 16px")}>{f.a}</p>


                        </React.Fragment>
                      )}

                    </div>


                  </React.Fragment>
                ))}

              </div>

            </div>

          </section>



          {/*  ============ 6. FINAL CTA ============  */}


          <section className="pad" style={cssToStyle("padding: 0 40px 40px")}>

            <div className="gridbg-d rv" style={cssToStyle("max-width: 1320px; margin: 0 auto; position: relative; border-radius: 36px; background: #17262b; color: #fff; padding: 96px 56px; overflow: hidden")}>

              <svg aria-hidden="true" width="100%" height="100%" fill="none" style={cssToStyle("position: absolute; inset: 0; opacity: .5")}>

                <path className="flow" d="M -20 340 C 300 340, 420 120, 760 120 S 1100 260, 1240 60" stroke="#c49a52" strokeWidth="2"></path>


                <path className="flow" d="M -20 390 C 360 390, 520 220, 820 220 S 1120 330, 1240 180" stroke="#5C7BFF" strokeWidth="2"></path>

              </svg>


              <div style={cssToStyle("position: relative; max-width: 820px")}>

                <p className="mono" style={cssToStyle("margin: 0 0 18px; font-size: 13px; letter-spacing: .1em; color: #c49a52")}>06 — LET’S BEGIN</p>


                <h2 className="disp h-l" style={cssToStyle("margin: 0; font-size: 64px; line-height: 1.02; letter-spacing: -0.035em; font-weight: 600")}>Let’s build a better accounting workflow together.</h2>


                <p style={cssToStyle("margin: 22px 0 0; font-size: 18px; color: #b6cad0; max-width: 640px")}>Whether you’re managing a growing accounting practice, handling business finances or taking care of individual tax obligations, the right support makes your work more organised and manageable.</p>


                <div style={cssToStyle("display: flex; gap: 12px; flex-wrap: wrap; margin-top: 36px")}>

                  <a href="#enquiry" className="btn-l" style={cssToStyle("display: inline-flex; align-items: center; gap: 10px; min-height: 58px; padding: 0 30px; border-radius: 999px; background: #c49a52; color: #17262b; text-decoration: none; font-weight: 700; font-size: 17px")}>Start Your Enquiry Today
                    <span className="arrow">→</span></a>


                  <a href="#paths" className="btn-gd" style={cssToStyle("display: inline-flex; align-items: center; gap: 10px; min-height: 58px; padding: 0 28px; border-radius: 999px; border: 1.5px solid rgba(255,255,255,.4); color: #fff; text-decoration: none; font-weight: 600; font-size: 17px; transition: background .25s, color .25s")}>Explore Our Services</a>

                </div>

              </div>

            </div>


            <footer style={cssToStyle("max-width: 1320px; margin: 0 auto; padding: 32px 16px 8px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; font-size: 14px; color: #52646a")}>

              <span className="disp" style={cssToStyle("font-weight: 700; color: var(--text-primary)")}>Preferred Tax Consultancy</span>


              <span>Tax Preparation · Bookkeeping &amp; Accounting · Payroll Management · Tax Planning · Foreign Compliance · Accounting Outsourcing</span>

            </footer>

          </section>


        </div>


      </>
    );
  }
}

export default ContactPage;








