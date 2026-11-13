import React from 'react';

/**
 * Bookkeeping & Accounting Support page.
 * Native React implementation converted from the supplied HTML.
 * Original content, visual styles, animations and interactive behaviour are retained.
 */


class BookkeepingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { aud: 0, mix: 50, svc: 0, phase: 0, rep: 0, ans: [null, null, null, null, null, null], model: 0, who: 0, faq: 0, fa: 0, need: { 0: true }, sent: false };
    this.timer = null;
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      if (this.props.motion === false) return;
      this.setState({ who: (this.state.who + 1) % 4 });
    }, 6000);
  }
  componentWillUnmount() { if (this.timer) clearInterval(this.timer); }
  renderVals() {
    const s = this.state;
    const motion = this.props.motion ?? true;
    const set = (o) => this.setState(o);

    const heroTabs = ['Business owners', 'Self-employed', 'CPA firms'].map((label, i) => ({ label, cls: 'tg' + (s.aud === i ? ' on' : ''), pressed: s.aud === i ? 'true' : 'false', pick: () => set({ aud: i }) }));

    const recRows = [
      { d: 'Customer deposit', acct: 'Sales income', amt: '+4,250.00' },
      { d: 'Software subscription', acct: 'Software', amt: '−89.00' },
      { d: 'Office rent', acct: 'Rent expense', amt: '−2,400.00' },
      { d: 'Card payment', acct: 'Credit card', amt: '−612.40' },
      { d: 'Processor payout', acct: 'Sales income', amt: '+1,180.25' }
    ].map((r, i) => ({ ...r, delay: (i * 0.55) + 's' }));

    const mess = [
      { x: '4%', y: '18%', w: '200px', r: '-8deg', bg: '#FFFFFF', k: 'RECEIPT', t: 'Office supplies', flag: 'NO CATEGORY', dur: '6s' },
      { x: '22%', y: '50%', w: '190px', r: '6deg', bg: '#FFF4D6', k: 'INVOICE #?', t: 'Customer invoice', flag: 'PAID?', dur: '7s' },
      { x: '36%', y: '12%', w: '210px', r: '4deg', bg: '#FFFFFF', k: 'BANK LINE', t: 'Transfer 1,000.00', flag: 'DUPLICATE?', dur: '8s' },
      { x: '52%', y: '46%', w: '200px', r: '-5deg', bg: '#E9F2FF', k: 'CARD', t: 'Software charge', flag: 'MISSING RECEIPT', dur: '6.5s' },
      { x: '66%', y: '14%', w: '190px', r: '9deg', bg: '#FFF4D6', k: 'BILL', t: 'Vendor bill', flag: 'DUE WHEN?', dur: '7.5s' },
      { x: '78%', y: '52%', w: '190px', r: '-10deg', bg: '#FFFFFF', k: 'STATEMENT', t: 'Card statement', flag: 'NOT RECONCILED', dur: '9s' },
      { x: '8%', y: '66%', w: '180px', r: '3deg', bg: '#E9F2FF', k: 'PAYOUT', t: 'Processor payout', flag: 'WHICH ACCOUNT?', dur: '7s' }
    ];
    const ledger = [
      { dt: '05/01', t: 'Office supplies', acct: 'Office expenses', cbg: '#EEFBF4', amt: '−142.18', s: 'Categorised' },
      { dt: '05/03', t: 'Customer invoice', acct: 'Accounts receivable', cbg: '#BFF3D8', amt: '+3,600.00', s: 'Matched' },
      { dt: '05/06', t: 'Transfer', acct: 'Owner transfer', cbg: '#EEFBF4', amt: '1,000.00', s: 'Single entry' },
      { dt: '05/09', t: 'Software charge', acct: 'Software', cbg: '#BFF3D8', amt: '−89.00', s: 'Receipt on file' },
      { dt: '05/14', t: 'Vendor bill', acct: 'Accounts payable', cbg: '#EEFBF4', amt: '−860.00', s: 'Scheduled' },
      { dt: '05/31', t: 'Card statement', acct: 'Credit card', cbg: '#BFF3D8', amt: '−612.40', s: 'Reconciled' },
      { dt: '05/31', t: 'Processor payout', acct: 'Sales income', cbg: '#EEFBF4', amt: '+1,180.25', s: 'Matched' }
    ];

    const SV = [
      { code: 'CAT', t: 'Transaction categorisation', d: 'Recording and classifying business transactions using an agreed chart of accounts and consistent accounting treatment.' },
      { code: 'BANK', t: 'Bank reconciliation', d: 'Comparing the accounting records with bank statements, identifying missing or duplicated transactions and investigating differences.' },
      { code: 'CARD', t: 'Credit card reconciliation', d: 'Reconciling card activity and balances so that business spending and liabilities are recorded correctly.' },
      { code: 'A/R', t: 'Accounts receivable', d: 'Recording customer invoices, tracking open balances and maintaining customer payment records.' },
      { code: 'A/P', t: 'Accounts payable', d: 'Recording vendor bills, monitoring amounts due and maintaining supplier balances.' },
      { code: 'GL', t: 'General ledger maintenance', d: 'Maintaining the ledger and supporting accounts that form the basis of your financial reporting.' },
      { code: 'CLOSE', t: 'Month-end bookkeeping', d: 'Completing regular reconciliations, reviewing account balances and preparing records for the monthly close.' },
      { code: 'P&L', t: 'Financial reporting', d: 'Preparing Profit and Loss, Balance Sheet and Cash Flow reports from your accounting records, within the agreed reporting scope.' }
    ];
    const services = SV.map((x, i) => ({ ...x, n: '0' + (i + 1), cls: 'sv' + (s.svc === i ? ' on' : ''), sel: s.svc === i ? 'true' : 'false', pick: () => { if (this.state.svc !== i) set({ svc: i }); } }));
    const cur = services[s.svc];
    const vflags = {}; for (let i = 0; i < 8; i++) vflags['v' + i] = s.svc === i;

    const catRows = [
      { t: 'Fuel — company vehicle', cat: 'Vehicle expenses', bg: '#BFF3D8' },
      { t: 'Client lunch', cat: 'Meals', bg: '#EEFBF4' },
      { t: 'Laptop purchase', cat: 'Fixed assets', bg: '#37E191' },
      { t: 'Monthly hosting', cat: 'Software', bg: '#BFF3D8' }
    ].map((r, i) => ({ ...r, delay: (i * 0.4) + 's' }));
    const bankRows = [
      { a: '+4,250.00', b: '+4,250.00', ok: true, flag: false, rbg: '#EEFBF4' },
      { a: '−2,400.00', b: '−2,400.00', ok: true, flag: false, rbg: '#EEFBF4' },
      { a: '−89.00', b: '—', ok: false, flag: true, rbg: '#FFF4D6' },
      { a: '+1,180.25', b: '+1,180.25', ok: true, flag: false, rbg: '#EEFBF4' }
    ].map((r, i) => ({ ...r, delay: (i * 0.5) + 's' }));
    const aging = [
      { l: 'Current', v: '62%', h: '92%', c: '#121519' },
      { l: '1–30', v: '21%', h: '46%', c: '#22AE68' },
      { l: '31–60', v: '9%', h: '26%', c: '#37E191' },
      { l: '61–90', v: '5%', h: '16%', c: '#BFF3D8' },
      { l: '90+', v: '3%', h: '10%', c: '#F5C37A' }
    ].map((a, i) => ({ ...a, delay: (i * 0.1) + 's' }));
    const dueDays = [3, 9, 15, 22, 28]; const paidDays = [3, 9, 15];
    const cal = Array.from({ length: 28 }, (_, i) => {
      const d = i + 1; const due = dueDays.includes(d); const paid = paidDays.includes(d);
      return { n: d, bg: paid ? '#37E191' : (due ? '#121519' : '#F2F5F3'), fg: paid ? '#0A2418' : (due ? '#FFFFFF' : '#50575E') };
    });
    const closeList = ['Bank accounts reconciled', 'Credit cards reconciled', 'A/R and A/P reviewed', 'Balances reviewed, unusual items flagged', 'Records ready for the monthly close'].map((t, i) => ({ t, delay: (i * 0.6) + 's' }));
    const repCards = [{ t: 'Profit & Loss', bg: '#121519', fg: '#37E191' }, { t: 'Balance Sheet', bg: '#22AE68', fg: '#0A2418' }, { t: 'Cash Flow', bg: '#EEFBF4', fg: '#0B7A44' }];

    // dial
    const P = [
      { t: 'Capture & categorise', when: 'Through the month', f: 0.40, d: 'Transactions are recorded and classified against your chart of accounts as records arrive.', items: ['Bank & card transactions', 'Customer invoices & vendor bills', 'Receipts & expense records'] },
      { t: 'Reconcile', when: 'At month-end', f: 0.24, d: 'Bank and card accounts are compared with statements; differences are investigated.', items: ['Bank reconciliation', 'Credit card reconciliation', 'Payroll reports to the ledger, where in scope'] },
      { t: 'Review & resolve', when: 'At month-end', f: 0.18, d: 'Balances are reviewed, unusual activity flagged and questions sent to your contact.', items: ['Account balance review', 'Logged open questions', 'Corrections from your answers'] },
      { t: 'Close & report', when: 'After close', f: 0.18, d: 'The month is closed and reports are prepared from reconciled records.', items: ['Profit & Loss', 'Balance Sheet', 'Cash Flow'] }
    ];
    const C = 2 * Math.PI * 130; const gap = 8; let acc = 0;
    const arcs = P.map((p, i) => {
      const len = p.f * C - gap; const off = -acc; acc += p.f * C;
      const on = s.phase === i;
      return { da: len.toFixed(1) + ' ' + (C - len).toFixed(1), off: off.toFixed(1), col: on ? '#37E191' : (i % 2 ? '#2A3038' : '#343B44'), sw: on ? 40 : 30 };
    });
    const phases = P.map((p, i) => ({ ...p, n: '0' + (i + 1), cls: 'ph' + (s.phase === i ? ' on' : ''), pressed: s.phase === i ? 'true' : 'false', pick: () => set({ phase: i }) }));
    const ph = phases[s.phase];

    // reports
    const repTabs = ['Profit & Loss', 'Balance Sheet', 'Cash Flow'].map((label, i) => ({ label, cls: 'seg' + (s.rep === i ? ' on' : ''), pressed: s.rep === i ? 'true' : 'false', pick: () => set({ rep: i }) }));
    const RQ = [
      { title: 'Profit & Loss · Jan – Jun', q: 'Are we making money — and where is it going?', a: 'Revenue and expenses by category, month by month, built from transactions categorised to your chart of accounts.' },
      { title: 'Balance Sheet · as at 30 June', q: 'What do we own, and what do we owe?', a: 'Assets, liabilities and equity at a point in time — supported by reconciled bank, card and ledger accounts.' },
      { title: 'Cash Flow · Jan – Jun', q: 'Why is cash different from profit?', a: 'How cash moved through operating, investing and financing activity, from opening to closing balance.' }
    ][s.rep];
    const rev = [42, 46, 44, 51, 55, 58], exp = [35, 37, 36, 39, 41, 42], mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const pl = mo.map((m, i) => ({ m, net: rev[i] - exp[i], rh: (rev[i] / 62 * 100).toFixed(1) + '%', eh: (exp[i] / 62 * 100).toFixed(1) + '%', delay: (i * 0.08) + 's', delay2: (i * 0.08 + 0.05) + 's' }));
    const assets = [
      { t: 'Cash', v: '38k', f: 38, c: '#121519', fg: '#37E191' },
      { t: 'Accounts receivable', v: '22k', f: 22, c: '#22AE68', fg: '#0A2418' },
      { t: 'Fixed assets', v: '40k', f: 40, c: '#37E191', fg: '#0A2418' }
    ];
    const liabs = [
      { t: 'Accounts payable', v: '18k', f: 18, c: '#3A4046', fg: '#FFFFFF' },
      { t: 'Payroll liabilities', v: '7k', f: 7, c: '#50575E', fg: '#FFFFFF' },
      { t: 'Loans', v: '25k', f: 25, c: '#121519', fg: '#FFFFFF' },
      { t: 'Equity', v: '50k', f: 50, c: '#BFF3D8', fg: '#0A2418' }
    ];
    const W = [
      { t: 'Opening', v: '24k', from: 0, to: 24, c: '#121519' },
      { t: 'Operating', v: '+18k', from: 24, to: 42, c: '#22AE68' },
      { t: 'Investing', v: '−9k', from: 33, to: 42, c: '#F5C37A' },
      { t: 'Financing', v: '−4k', from: 29, to: 33, c: '#F5C37A' },
      { t: 'Closing', v: '29k', from: 0, to: 29, c: '#37E191' }
    ];
    const mx = 48;
    const wf = W.map((w, i) => ({ ...w, bottom: (w.from / mx * 100).toFixed(1) + '%', height: ((w.to - w.from) / mx * 100).toFixed(1) + '%', labelB: (w.to / mx * 100 + 2).toFixed(1) + '%', delay: (i * 0.15) + 's' }));

    // health check
    const Q = [
      'Are your bank accounts reconciled every month?',
      'Are credit card statements reconciled to your books?',
      'Is every transaction categorised to a consistent chart of accounts?',
      'Do you know which customer invoices are still open?',
      'Do you track vendor bills and when they fall due?',
      'Could you produce a P&L and Balance Sheet you trust today?'
    ];
    const setAns = (i, v) => { const a = this.state.ans.slice(); a[i] = v; set({ ans: a }); };
    const qs = Q.map((t, i) => ({
      t, n: '0' + (i + 1),
      yCls: 'yn' + (s.ans[i] === 1 ? ' yes' : ''), nCls: 'yn' + (s.ans[i] === 0 ? ' no' : ''),
      yP: s.ans[i] === 1 ? 'true' : 'false', nP: s.ans[i] === 0 ? 'true' : 'false',
      border: s.ans[i] === null ? 'transparent' : (s.ans[i] === 1 ? '#22AE68' : '#121519'),
      yes: () => setAns(i, 1), no: () => setAns(i, 0)
    }));
    const answered = s.ans.filter((a) => a !== null).length;
    const score = s.ans.filter((a) => a === 1).length;
    let verdict, verdictD, verdictCta, gaugeCol;
    if (answered < 3) { verdict = 'Answer a few questions'; verdictD = 'Six quick yes/no questions give you an indicative view of how ready your records are for reporting and tax preparation.'; verdictCta = 'Talk to Our Team'; gaugeCol = '#8B959C'; }
    else if (score <= 2) { verdict = 'Your books need attention'; verdictD = 'Start with a scoping call: we’ll look at where your records stand and agree what needs to happen before regular monthly support.'; verdictCta = 'Request a Consultation'; gaugeCol = '#F5C37A'; }
    else if (score <= 4) { verdict = 'A solid base with gaps'; verdictD = 'Monthly bookkeeping with regular reconciliations and a defined close can close the gaps and keep records ready for tax time.'; verdictCta = 'Discuss Monthly Bookkeeping'; gaugeCol = '#22AE68'; }
    else { verdict = 'Well organised books'; verdictD = 'You’re in good shape. Ongoing support can keep it that way while freeing up your own time.'; verdictCta = 'Talk to Our Team'; gaugeCol = '#37E191'; }
    const gaugeOff = (314.16 * (1 - score / 6)).toFixed(1);

    const models = [
      { n: '01', tag: 'ONGOING', t: 'Monthly bookkeeping', d: 'Regular support that keeps your books current, reconciled and closed every month.', items: ['Transaction categorisation', 'Bank & card reconciliations', 'A/R and A/P support', 'Month-end close & reports'], cta: 'Request a Consultation', bg: '#F2F5F3', fg: '#121519', rule: 'rgba(18,21,25,0.06)', margin: 'rgba(34,174,104,0.4)', tickC: '#0B7A44', btn: 'b b-ink' },
      { n: '02', tag: 'CONNECTED', t: 'Bookkeeping + tax preparation', d: 'Bookkeeping and tax preparation as connected engagements — organised books give tax preparation a stronger starting point.', items: ['Records organised for tax preparation', 'Consistent categorisation all year', 'Year-end handover to tax', 'One team, one set of records'], cta: 'Talk to Our Team', bg: '#121519', fg: '#FFFFFF', rule: 'rgba(255,255,255,0.05)', margin: 'rgba(55,225,145,0.45)', tickC: '#37E191', btn: 'b b-mint' },
      { n: '03', tag: 'FOR CPA FIRMS', t: 'Bookkeeping support for CPA firms', d: 'Additional capacity for client bookkeeping inside your software, checklists, naming conventions and review process.', items: ['Bookkeeping & data organisation', 'Reconciliations & GL maintenance', 'Work that’s ready for your review', 'Your firm keeps the client relationship'], cta: 'Discuss CPA Outsourcing', bg: '#37E191', fg: '#0A2418', rule: 'rgba(10,36,24,0.08)', margin: 'rgba(10,36,24,0.3)', tickC: '#0A2418', btn: 'b b-ink' }
    ];

    const payroll = [
      { n: '01', t: 'Gross wages', d: 'Payroll transactions recorded in your accounting system.', bg: '#121519', fg: '#37E191' },
      { n: '02', t: 'Employee withholdings', d: 'Withholdings and benefits accounted for correctly.', bg: '#FFFFFF', fg: '#121519' },
      { n: '03', t: 'Employer payroll taxes', d: 'Employer tax expenses and liabilities recorded.', bg: '#37E191', fg: '#0A2418' },
      { n: '04', t: 'Reconciled to the GL', d: 'Payroll reports reconciled with the general ledger.', bg: '#22AE68', fg: '#0A2418' },
      { n: '05', t: 'Balance sheet reviewed', d: 'Payroll-related accounts reviewed and coordinated with year-end tax.', bg: '#121519', fg: '#FFFFFF' }
    ];

    const steps = [
      { t: 'Understand the requirement', d: 'Your software, number of accounts, volume, chart of accounts, deadlines and instructions.' },
      { t: 'Collect & organise records', d: 'Records arrive through the agreed channel; missing or unclear items are identified early.' },
      { t: 'Record & categorise', d: 'Transactions are processed in your software using the agreed workflow and treatment.' },
      { t: 'Reconcile & review', d: 'Accounts are reconciled and checked for completeness, consistency and discrepancies.' },
      { t: 'Resolve questions', d: 'Questions go to your designated contact; corrections follow the answers received.' },
      { t: 'Report & hand over', d: 'Reports and status notes are delivered so you know what’s complete and what’s open.' }
    ].map((x, i) => ({ ...x, n: '0' + (i + 1) }));

    const quality = ['Engagement-specific instructions & checklists', 'Source documents received — or clearly flagged', 'Key amounts compared with statements & schedules', 'Mathematical accuracy & internal consistency', 'Unusual items & unclear classifications flagged', 'Open questions recorded and tracked to resolution'].map((t, i) => ({ t, delay: (i * 0.8) + 's' }));
    const conf = ['Approved channels for receiving and sharing documents', 'Access limited to authorised people on the engagement', 'Individual user accounts and permissions in software', 'Confidentiality obligations for team members', 'Agreed storage, retention, return or disposal of files', 'Defined escalation if a data incident is suspected'].map((t, i) => ({ t, n: '0' + (i + 1) }));

    const WHO = [
      { t: 'Small & medium-sized businesses', d: 'Businesses that want recurring bookkeeping and accounting support without building every function in-house.', needs: ['Monthly bookkeeping & close', 'A/R and A/P tracking', 'P&L, Balance Sheet & Cash Flow'], bg: '#37E191', fg: '#0A2418', chip: 'rgba(10,36,24,0.1)' },
      { t: 'Self-employed & independent contractors', d: 'Income from several clients and platforms, expenses across cards and receipts — organised into books that make tax time simpler.', needs: ['Income records organised', 'Expenses categorised consistently', 'Records ready for Schedule C'], bg: '#FFFFFF', fg: '#121519', chip: '#F2F5F3' },
      { t: 'CPA firms & accounting practices', d: 'Firms that need extra bookkeeping capacity for clients, delivered inside their software and review process.', needs: ['Client bookkeeping support', 'Reconciliations & GL', 'Organised handovers for review'], bg: '#121519', fg: '#FFFFFF', chip: 'rgba(255,255,255,0.08)' },
      { t: 'Growing professional service businesses', d: 'Organisations that need structured financial records as they grow — and dependable support behind them.', needs: ['Chart of accounts that scales', 'Payroll accounting, where in scope', 'Clear monthly reporting'], bg: '#22AE68', fg: '#0A2418', chip: 'rgba(10,36,24,0.1)' }
    ];
    const who = WHO.map((w, i) => ({ ...w, n: '0' + (i + 1), hidden: s.who === i ? 'false' : 'true' }));
    const goWho = (i) => { set({ who: i }); if (this.timer) { clearInterval(this.timer); this.timer = setInterval(() => { if (this.props.motion === false) return; this.setState({ who: (this.state.who + 1) % 4 }); }, 6000); } };
    const whoDots = WHO.map((w, i) => ({ label: w.t, cls: 'dot' + (s.who === i ? ' on' : ''), pressed: s.who === i ? 'true' : 'false', pick: () => goWho(i) }));

    const FAQ = [
      ['What do your bookkeeping services include?', 'Transaction categorisation, bank and credit card reconciliations, accounts receivable and payable support, general ledger maintenance, month-end bookkeeping and financial reporting — within the scope agreed for your engagement.'],
      ['Isn’t bookkeeping just data entry?', 'No. Properly maintained records help you understand performance, identify unusual activity and make informed decisions — and they give tax preparation a more dependable starting point.'],
      ['Can you provide both bookkeeping and tax preparation?', 'Yes. Bookkeeping and tax preparation can be provided as separate or connected engagements, depending on what’s agreed. Organised books make a stronger starting point for tax preparation.'],
      ['Which accounting software do you use?', 'We provide QuickBooks-based assistance, and other platforms can be discussed based on your requirements. Current software proficiency is confirmed before an engagement begins.'],
      ['Do you provide payroll services?', 'Payroll-related support may include accounting entries, payroll reconciliations and organising information for payroll reporting. Whether payroll processing, tax deposits and filing are included is confirmed in the service agreement.'],
      ['Can a CPA firm outsource only bookkeeping?', 'Yes. A firm can choose support for bookkeeping, reconciliations or data organisation for selected clients rather than outsourcing everything. Tasks and handover requirements are defined before work begins.'],
      ['How do you check the quality of the work?', 'The agreed workflow can include completeness checks, comparison of key amounts with statements, consistency checks, flagging unusual items and tracking open questions. The exact review responsibility is documented.'],
      ['How do we share our financial records?', 'Through an approved channel agreed at onboarding — not through an ordinary contact form. Access is limited to the people working on your engagement.'],
      ['How do we get started?', 'Tell us the support you need, your accounting software, the number of accounts and any deadlines. We’ll then discuss scope, onboarding, document exchange and next steps.']
    ];
    const faqs = FAQ.map((f, i) => ({ q: f[0], a: f[1], n: (i + 1 < 10 ? '0' : '') + (i + 1), cls: 'fqb' + (s.faq === i ? ' on' : ''), sel: s.faq === i ? 'true' : 'false', pick: () => set({ faq: i }) }));
    const fq = faqs[s.faq];

    const AUD = ['Business', 'Self-employed', 'CPA firm'];
    const formAud = AUD.map((label, i) => ({ label, cls: 'pill' + (s.fa === i ? ' on' : ''), pressed: s.fa === i ? 'true' : 'false', pick: () => set({ fa: i }) }));
    const NEEDS = ['Monthly bookkeeping', 'Reconciliations', 'A/R & A/P', 'Payroll accounting', 'Financial reports'];
    const needs = NEEDS.map((label, i) => ({ label, cls: 'pill' + (s.need[i] ? ' on' : ''), pressed: s.need[i] ? 'true' : 'false', pick: () => { const n = { ...this.state.need }; n[i] = !n[i]; set({ need: n }); } }));
    const submitLabel = ['Request a Consultation', 'Talk to Our Team', 'Discuss CPA Outsourcing'][s.fa];

    return {
      motionCls: motion ? '' : 'motion-off',
      heroTabs, heroBiz: s.aud === 0, heroSelf: s.aud === 1, heroCpa: s.aud === 2,
      recRows, mess, ledger, mix: s.mix,
      onMix: (e) => set({ mix: Number(e.target.value) }),
      services, cur, ...vflags, catRows, bankRows, aging, cal, closeList, repCards,
      svcPrev: () => set({ svc: (s.svc + 7) % 8 }), svcNext: () => set({ svc: (s.svc + 1) % 8 }),
      phases, arcs, ph,
      repTabs, repTitle: RQ.title, repQ: RQ.q, repA: RQ.a, r0: s.rep === 0, r1: s.rep === 1, r2: s.rep === 2, pl, assets, liabs, wf,
      qs, answered, score, verdict, verdictD, verdictCta, gaugeCol, gaugeOff,
      resetQs: () => set({ ans: [null, null, null, null, null, null] }),
      models, payroll, steps, quality, conf,
      who, whoDots, whoX: s.who * 100,
      whoPrev: () => goWho((s.who + 3) % 4), whoNext: () => goWho((s.who + 1) % 4),
      faqs, fq,
      formAud, needs, submitLabel, sent: s.sent,
      onSubmit: (e) => { if (e && e.preventDefault) e.preventDefault(); set({ sent: true }); }
    };
  }

  render() {
    const {
      motionCls, heroTabs, heroBiz, heroSelf, heroCpa, recRows, mess, ledger, mix, onMix,
      services, cur, catRows, bankRows, aging, cal, closeList, repCards, svcPrev, svcNext,
      phases, arcs, ph, repTabs, repTitle, repQ, repA, r0, r1, r2, pl, assets, liabs, wf,
      qs, answered, score, verdict, verdictD, verdictCta, gaugeCol, gaugeOff, resetQs,
      models, payroll, steps, quality, conf, who, whoDots, whoX, whoPrev, whoNext,
      faqs, fq, formAud, needs, submitLabel, sent, onSubmit,
      v0, v1, v2, v3, v4, v5, v6, v7, ...vflags
    } = this.renderVals();
    return (
      <>
        <style>{"/* latin-ext */\n@font-face {\n  font-family: 'DM Mono';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/dmmono/v16/aFTU7PB1QTsUX8KYthSQBLyM.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'DM Mono';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/bookkeeping-assets/2a2a1d00-750a-4ac7-b8ff-6edf63b3a58c.woff2\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'DM Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/dmmono/v16/aFTR7PB1QTsUX8KYvumzEY2tbZX9.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'DM Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/bookkeeping-assets/11a10026-f38d-46d9-8836-18750f0b2460.woff2\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggqxSuXd.woff2) format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggOxSuXd.woff2) format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggSxSuXd.woff2) format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggixSuXd.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggmxSuXd.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/bookkeeping-assets/41da9a21-c312-4c20-92e0-066d58409e74.woff2\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggqxSuXd.woff2) format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggOxSuXd.woff2) format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggSxSuXd.woff2) format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggixSuXd.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggmxSuXd.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/bookkeeping-assets/41da9a21-c312-4c20-92e0-066d58409e74.woff2\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggqxSuXd.woff2) format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggOxSuXd.woff2) format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggSxSuXd.woff2) format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggixSuXd.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggmxSuXd.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(\"/bookkeeping-assets/41da9a21-c312-4c20-92e0-066d58409e74.woff2\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggqxSuXd.woff2) format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggOxSuXd.woff2) format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggSxSuXd.woff2) format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggixSuXd.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggmxSuXd.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(\"/bookkeeping-assets/41da9a21-c312-4c20-92e0-066d58409e74.woff2\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 800;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggqxSuXd.woff2) format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 800;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggOxSuXd.woff2) format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 800;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggSxSuXd.woff2) format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 800;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggixSuXd.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 800;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggmxSuXd.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Manrope';\n  font-style: normal;\n  font-weight: 800;\n  font-display: swap;\n  src: url(\"/bookkeeping-assets/41da9a21-c312-4c20-92e0-066d58409e74.woff2\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Sora';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/sora/v17/xMQ9uFFYT72X5wkB_18qmnndmSdSnh2BAfO5mnuyOo1lfiQwWa-xsaQ.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Sora';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/bookkeeping-assets/ef2f2773-d69b-442e-89e1-d434d6230143.woff2\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Sora';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/sora/v17/xMQ9uFFYT72X5wkB_18qmnndmSdSnh2BAfO5mnuyOo1lfiQwWa-xsaQ.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Sora';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/bookkeeping-assets/ef2f2773-d69b-442e-89e1-d434d6230143.woff2\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Sora';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/sora/v17/xMQ9uFFYT72X5wkB_18qmnndmSdSnh2BAfO5mnuyOo1lfiQwWa-xsaQ.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Sora';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(\"/bookkeeping-assets/ef2f2773-d69b-442e-89e1-d434d6230143.woff2\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Sora';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/sora/v17/xMQ9uFFYT72X5wkB_18qmnndmSdSnh2BAfO5mnuyOo1lfiQwWa-xsaQ.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Sora';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(\"/bookkeeping-assets/ef2f2773-d69b-442e-89e1-d434d6230143.woff2\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Sora';\n  font-style: normal;\n  font-weight: 800;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/sora/v17/xMQ9uFFYT72X5wkB_18qmnndmSdSnh2BAfO5mnuyOo1lfiQwWa-xsaQ.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Sora';\n  font-style: normal;\n  font-weight: 800;\n  font-display: swap;\n  src: url(\"/bookkeeping-assets/ef2f2773-d69b-442e-89e1-d434d6230143.woff2\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n\n\n\nbody{margin:0}\na{color:#0B7A44}a:hover{color:#121519}\n.r *{box-sizing:border-box}\n.r h1,.r h2,.r h3,.r h4,.r p,.r ul,.r ol,.r figure,.r fieldset,.r dl,.r dd{margin:0}\n.r ul,.r ol{padding:0;list-style:none}\n.r fieldset{border:0;padding:0}\n.r button{font-family:inherit}\n.disp{font-family:'Sora',system-ui,sans-serif;letter-spacing:-0.035em}\n.mono{font-family:'DM Mono',ui-monospace,monospace}\n.eyebrow{font-family:'DM Mono',monospace;font-size:12px;letter-spacing:.16em;text-transform:uppercase}\n.wrap{max-width:1280px;margin:0 auto;padding-left:clamp(20px,4vw,48px);padding-right:clamp(20px,4vw,48px)}\n.b{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:52px;padding:0 26px;border-radius:999px;font:700 15px/1 'Manrope',system-ui,sans-serif;text-decoration:none;border:1.5px solid transparent;cursor:pointer;white-space:nowrap;transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s,background .3s,color .3s,border-color .3s}\n.b:hover{transform:translateY(-3px)}\n.b .ar{display:inline-grid;place-items:center;width:28px;height:28px;border-radius:50%;transition:transform .35s cubic-bezier(.2,.8,.2,1)}\n.b:hover .ar{transform:rotate(-45deg)}\n.b-mint{background:#37E191;color:#0A2418}.b-mint:hover{color:#0A2418;box-shadow:0 18px 40px -16px rgba(55,225,145,.8)}\n.b-mint .ar{background:#0A2418;color:#37E191}\n.b-ink{background:#121519;color:#fff}.b-ink:hover{color:#fff;box-shadow:0 18px 40px -18px rgba(18,21,25,.7)}\n.b-ink .ar{background:#37E191;color:#0A2418}\n.b-line{border-color:rgba(255,255,255,.35);color:#fff;background:transparent}.b-line:hover{border-color:#37E191;color:#fff}\n.b-line-d{border-color:rgba(18,21,25,.25);color:#121519;background:transparent}.b-line-d:hover{border-color:#121519;color:#121519}\n.nl{color:#C5CCD2;text-decoration:none;font-size:14px;font-weight:600;padding:12px 0;position:relative}\n.nl:hover{color:#fff}\n.nl::after{content:\"\";position:absolute;left:0;right:0;bottom:6px;height:2px;background:#37E191;transform:scaleX(0);transform-origin:left;transition:transform .35s}\n.nl:hover::after{transform:scaleX(1)}\n.tg{min-height:44px;padding:0 18px;border-radius:999px;border:0;background:transparent;color:#AEB7BE;font-size:14px;font-weight:700;cursor:pointer;transition:all .35s}\n.tg:hover{color:#fff}\n.tg.on{background:#37E191;color:#0A2418}\n.ribbon{position:absolute;border-radius:999px;pointer-events:none}\n/* ledger motif */\n.ruled{background-image:repeating-linear-gradient(0deg,rgba(18,21,25,.06) 0 1px,transparent 1px 40px)}\n.ruled-d{background-image:repeating-linear-gradient(0deg,rgba(255,255,255,.05) 0 1px,transparent 1px 40px)}\n.margin-line{position:absolute;top:0;bottom:0;width:2px;background:rgba(34,174,104,.35)}\n.tick{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#37E191;color:#0A2418;flex:none}\n/* service index */\n.sv{width:100%;display:grid;grid-template-columns:64px minmax(0,1fr) 40px;align-items:center;gap:16px;min-height:76px;padding:14px 20px;border:0;border-top:1px solid rgba(18,21,25,.12);background:transparent;color:#50575E;text-align:left;cursor:pointer;position:relative;overflow:hidden;transition:color .35s}\n.sv::before{content:\"\";position:absolute;inset:0;background:#121519;transform:scaleX(0);transform-origin:left;transition:transform .55s cubic-bezier(.7,0,.2,1);z-index:0}\n.sv > *{position:relative;z-index:1}\n.sv:hover{color:#121519}\n.sv.on{color:#fff}\n.sv.on::before{transform:scaleX(1)}\n.sv .sn{font:500 13px 'DM Mono',monospace;opacity:.7}\n.sv .st{font:700 clamp(18px,1.7vw,24px)/1.2 'Sora',sans-serif;letter-spacing:-.025em}\n.sv .sa{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;border:1.5px solid currentColor;opacity:.35;transition:all .4s}\n.sv.on .sa{opacity:1;background:#37E191;border-color:#37E191;color:#0A2418;transform:rotate(-45deg)}\n/* generic chips / segmented */\n.seg{min-height:44px;padding:0 18px;border-radius:12px;border:0;background:transparent;color:#50575E;font-size:14px;font-weight:700;cursor:pointer;transition:all .3s}\n.seg:hover{color:#121519}\n.seg.on{background:#121519;color:#fff}\n.ph{width:100%;display:flex;align-items:center;gap:16px;min-height:72px;padding:14px 18px;border-radius:18px;border:1.5px solid rgba(255,255,255,.1);background:transparent;color:#AEB7BE;text-align:left;cursor:pointer;transition:all .35s}\n.ph:hover{border-color:rgba(255,255,255,.35);color:#fff}\n.ph.on{background:#37E191;border-color:#37E191;color:#0A2418}\n.ph .pn{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;font:500 13px 'DM Mono',monospace;background:rgba(255,255,255,.08)}\n.ph.on .pn{background:#0A2418;color:#37E191}\n.yn{min-height:44px;min-width:92px;padding:0 16px;border-radius:12px;border:1.5px solid rgba(18,21,25,.16);background:#fff;color:#121519;font-size:14px;font-weight:700;cursor:pointer;transition:all .3s}\n.yn:hover{border-color:#121519}\n.yn.yes{background:#22AE68;border-color:#22AE68;color:#0A2418}\n.yn.no{background:#121519;border-color:#121519;color:#fff}\n.fqb{width:100%;display:flex;align-items:center;gap:16px;min-height:64px;padding:14px 18px;border:0;border-radius:16px;background:transparent;color:#50575E;font:700 16px/1.35 'Manrope',sans-serif;text-align:left;cursor:pointer;transition:all .3s}\n.fqb:hover{color:#121519;background:#F2F5F3}\n.fqb.on{background:#121519;color:#fff}\n.fqb .fqn{flex:none;font:500 12px 'DM Mono',monospace;opacity:.6}\n.dot{width:44px;height:44px;border:0;background:transparent;cursor:pointer;display:grid;place-items:center;padding:0}\n.dot span{display:block;height:6px;width:28px;border-radius:6px;background:rgba(255,255,255,.2);overflow:hidden;position:relative}\n.dot.on span{background:rgba(255,255,255,.2)}\n.dot.on span::after{content:\"\";position:absolute;inset:0;background:#37E191;transform-origin:left;animation:fill 6s linear both}\n.pill{min-height:46px;padding:0 18px;border-radius:999px;border:1.5px solid rgba(255,255,255,.18);background:rgba(255,255,255,.04);color:#E8EDF0;font-size:14px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:10px;transition:all .3s}\n.pill:hover{border-color:rgba(255,255,255,.55)}\n.pill.on{background:#37E191;border-color:#37E191;color:#0A2418}\n.fld{display:flex;flex-direction:column;gap:8px}\n.fld label{font-size:13px;font-weight:700;color:#C5CCD2}\n.fld input,.fld textarea,.fld select{width:100%;min-height:52px;padding:14px 16px;border-radius:14px;border:1.5px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05);color:#fff;font:500 15px 'Manrope',sans-serif}\n.fld select option{color:#121519}\n.fld input::placeholder,.fld textarea::placeholder{color:#8B959C}\n.r button:focus-visible,.r a:focus-visible,.r input:focus-visible,.r textarea:focus-visible,.r select:focus-visible{outline:3px solid #22AE68;outline-offset:3px}\n.lift{transition:transform .5s cubic-bezier(.2,.8,.2,1),box-shadow .5s}\n.lift:hover{transform:translateY(-10px);box-shadow:0 40px 70px -40px rgba(18,21,25,.55)}\n.bar{transform-origin:bottom;transition:height .8s cubic-bezier(.2,.8,.2,1)}\n.mrq{display:flex;gap:56px;width:max-content;animation:marq 38s linear infinite}\n/* before/after */\n.ba-range{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:ew-resize;margin:0;z-index:6}\n.ba-range:focus-visible + .ba-handle .ba-knob{outline:3px solid #37E191;outline-offset:4px}\n/* animations */\n@keyframes rise{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:none}}\n@keyframes pop{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:none}}\n@keyframes drift1{0%,100%{transform:rotate(-24deg) translateX(0)}50%{transform:rotate(-20deg) translateX(-60px)}}\n@keyframes drift2{0%,100%{transform:rotate(-24deg) translateX(0)}50%{transform:rotate(-27deg) translateX(50px)}}\n@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(55,225,145,.6)}100%{box-shadow:0 0 0 16px rgba(55,225,145,0)}}\n@keyframes tk{0%,8%{opacity:0;transform:scale(.3)}14%,88%{opacity:1;transform:none}96%,100%{opacity:0;transform:scale(.3)}}\n@keyframes ln{0%,8%{transform:scaleX(0)}16%,88%{transform:scaleX(1)}96%,100%{transform:scaleX(0)}}\n@keyframes diffA{0%,62%{opacity:1;transform:none}68%,96%{opacity:0;transform:translateY(-14px)}100%{opacity:1;transform:none}}\n@keyframes diffB{0%,62%{opacity:0;transform:translateY(14px)}68%,94%{opacity:1;transform:none}100%{opacity:0}}\n@keyframes scan{0%{top:8%}50%{top:86%}100%{top:8%}}\n@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}\n@keyframes grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}\n@keyframes growx{from{transform:scaleX(0)}to{transform:scaleX(1)}}\n@keyframes chip{0%,20%{opacity:0;transform:translateX(-10px)}30%,90%{opacity:1;transform:none}100%{opacity:0}}\n@keyframes flow{0%{left:0%;opacity:0}8%{opacity:1}92%{opacity:1}100%{left:100%;opacity:0}}\n@keyframes fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}\n@keyframes marq{to{transform:translateX(-50%)}}\n@keyframes spin{to{transform:rotate(360deg)}}\n@keyframes wob{0%,100%{transform:rotate(var(--r))}50%{transform:rotate(calc(var(--r) + 3deg)) translateY(-4px)}}\n.in{animation:rise 1s cubic-bezier(.2,.8,.2,1) both}\n.d1{animation-delay:.1s}.d2{animation-delay:.2s}.d3{animation-delay:.32s}.d4{animation-delay:.45s}\n.pop{animation:pop .55s cubic-bezier(.2,.8,.2,1) both}\n.gr{transform-origin:bottom;animation:grow .9s cubic-bezier(.2,.8,.2,1) both}\n.gx{transform-origin:left;animation:growx 1s cubic-bezier(.2,.8,.2,1) both}\n@supports (animation-timeline: view()){.rv{animation:rise linear both;animation-timeline:view();animation-range:entry 0% entry 35%}.rail-fill{animation:growx linear both;animation-timeline:view();animation-range:entry 20% cover 55%}}\n.motion-off *,.motion-off *::before,.motion-off *::after{animation:none!important;transition:none!important}\n@media (prefers-reduced-motion: reduce){.r *,.r *::before,.r *::after{animation:none!important;transition:none!important}}\n@media (max-width: 960px){.navx{display:none!important}.stick{position:static!important}.dialbox{transform:scale(.86)}}\n"}</style>
        <div className={`r ${motionCls}`} style={{fontFamily: "'Manrope', system-ui, sans-serif", color: "#121519", background: "#FFFFFF", overflowX: "hidden", WebkitFontSmoothing: "antialiased"}} data-canvas-width="1440" data-canvas-height="8000" data-document-role="page" data-label="Service page — Bookkeeping & Accounting Support">
  

   {/* ================= NAV ================= */} 
  

  <header style={{position: "sticky", top: "0", zIndex: "80", background: "rgba(18,21,25,0.84)", backdropFilter: "saturate(170%) blur(18px)", WebkitBackdropFilter: "saturate(170%) blur(18px)", borderBottom: "1px solid rgba(255,255,255,0.08)"}}>
    

    <div className="wrap" style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", minHeight: "76px"}}>
      

      <a href="#top" aria-label="Smart Tax Expertss home" style={{display: "flex", alignItems: "center", minHeight: "44px"}}>
        <img src="/bookkeeping-assets/ba182925-a38c-497a-bc97-3263f95171dc.png" alt="Smart Tax Experts logo" style={{height: "40px", width: "auto", display: "block"}} />
      </a>
      

      <nav aria-label="Primary" className="navx" style={{display: "flex", gap: "28px"}}>
        

        <a className="nl" href="#services">
          Services
        </a>
        

        <a className="nl" href="#order">
          Before & After
        </a>
        

        <a className="nl" href="#close">
          Month-End
        </a>
        

        <a className="nl" href="#reports">
          Reports
        </a>
        

        <a className="nl" href="#check">
          Books Check
        </a>
        

        <a className="nl" href="#faq">
          FAQ
        </a>
        

      </nav>
      

      <a href="#start" className="b b-mint" style={{minHeight: "46px", padding: "0 8px 0 20px", fontSize: "14px"}}>
        Talk to Our Team
        <span className="ar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6"></path>
          </svg>
        </span>
      </a>
      

    </div>
    

  </header>
  

   {/* ================= HERO (same pattern as the tax page) ================= */} 
  

  <section id="top" style={{position: "relative", background: "#121519", color: "#E8EDF0", overflow: "hidden"}}>
    

    <div aria-hidden="true" className="ribbon" style={{width: "1400px", height: "170px", right: "-520px", top: "70px", background: "#37E191", opacity: "0.95", animation: "drift1 16s ease-in-out infinite"}}></div>
    

    <div aria-hidden="true" className="ribbon" style={{width: "1400px", height: "170px", right: "-620px", top: "250px", background: "#22AE68", animation: "drift2 19s ease-in-out infinite"}}></div>
    

    <div aria-hidden="true" className="ribbon" style={{width: "1400px", height: "60px", right: "-700px", top: "450px", border: "2px solid rgba(255,255,255,0.12)", animation: "drift1 22s ease-in-out infinite"}}></div>
    

    <div aria-hidden="true" style={{position: "absolute", inset: "0", background: "linear-gradient(90deg, #121519 38%, rgba(18,21,25,0.55) 62%, rgba(18,21,25,0.1) 100%)"}}></div>
    

    <div className="wrap" style={{position: "relative", paddingTop: "clamp(56px, 8vw, 110px)", paddingBottom: "clamp(56px, 7vw, 96px)", display: "flex", flexWrap: "wrap", gap: "56px", alignItems: "center"}}>
      

      <div style={{flex: "1 1 560px", minWidth: "0", display: "flex", flexDirection: "column", gap: "28px"}}>
        

        <p className="eyebrow in" style={{color: "#37E191", display: "flex", alignItems: "center", gap: "12px"}}>
          <span style={{width: "10px", height: "10px", borderRadius: "3px", background: "#37E191", animation: "pulse 2s infinite"}}></span>
          Bookkeeping · Reconciliations · Reporting
        </p>
        

        <div className="in d1" role="group" aria-label="Who is this for?" style={{display: "inline-flex", alignSelf: "flex-start", flexWrap: "wrap", padding: "5px", borderRadius: "999px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)"}}>
          

          {(heroTabs || []).map((t, index) => (
            <React.Fragment key={index}>
              

              <button type="button" className={t.cls} aria-pressed={t.pressed} onClick={t.pick}>
                {t.label}
              </button>
              

            </React.Fragment>
          ))}
          

        </div>
        

        <h1 className="disp in d2" style={{fontSize: "clamp(42px, 5.8vw, 82px)", lineHeight: "1.0", fontWeight: "700", color: "#FFFFFF"}}>
          Bookkeeping 
          <span style={{color: "#37E191"}}>
            &
          </span>
           Accounting Support Services
        </h1>
        

        <p className="in d3" style={{fontSize: "clamp(19px, 1.8vw, 23px)", lineHeight: "1.45", fontWeight: "600", color: "#E8EDF0", maxWidth: "600px"}}>
          Reliable tax preparation starts with reliable records. We keep yours categorised, reconciled and ready.
        </p>
        

        {(heroBiz) && (
          <>
            

            <div className="pop" style={{display: "flex", flexDirection: "column", gap: "28px"}}>
              

              <p style={{fontSize: "17px", lineHeight: "1.7", color: "#AEB7BE", maxWidth: "580px"}}>
                Transactions categorised to your chart of accounts, bank and card accounts reconciled, receivables and payables tracked — and a monthly close you can actually read.
              </p>
              

              <div style={{display: "flex", gap: "14px", flexWrap: "wrap"}}>
                

                <a href="#start" className="b b-mint" style={{paddingRight: "10px"}}>
                  Request a Consultation
                  <span className="ar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6"></path>
                    </svg>
                  </span>
                </a>
                

                <a href="#check" className="b b-line">
                  Check your books
                </a>
                

              </div>
              

            </div>
            

          </>
        )}
        

        {(heroSelf) && (
          <>
            

            <div className="pop" style={{display: "flex", flexDirection: "column", gap: "28px"}}>
              

              <p style={{fontSize: "17px", lineHeight: "1.7", color: "#AEB7BE", maxWidth: "580px"}}>
                Income from several clients and platforms, expenses on cards and receipts in folders — we organise it into consistent books that make tax season simpler.
              </p>
              

              <div style={{display: "flex", gap: "14px", flexWrap: "wrap"}}>
                

                <a href="#start" className="b b-mint" style={{paddingRight: "10px"}}>
                  Talk to Our Team
                  <span className="ar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6"></path>
                    </svg>
                  </span>
                </a>
                

                <a href="#order" className="b b-line">
                  See the before & after
                </a>
                

              </div>
              

            </div>
            

          </>
        )}
        

        {(heroCpa) && (
          <>
            

            <div className="pop" style={{display: "flex", flexDirection: "column", gap: "28px"}}>
              

              <p style={{fontSize: "17px", lineHeight: "1.7", color: "#AEB7BE", maxWidth: "580px"}}>
                Bookkeeping and data organisation for your clients, inside your software, checklists and review process — so your team spends its time on review and advice.
              </p>
              

              <div style={{display: "flex", gap: "14px", flexWrap: "wrap"}}>
                

                <a href="#start" className="b b-mint" style={{paddingRight: "10px"}}>
                  Discuss CPA Outsourcing
                  <span className="ar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6"></path>
                    </svg>
                  </span>
                </a>
                

                <a href="#models" className="b b-line">
                  How engagements work
                </a>
                

              </div>
              

            </div>
            

          </>
        )}
        

      </div>
      

       live reconciliation card 
      

      <div className="in d3" style={{flex: "1 1 440px", minWidth: "0", position: "relative", padding: "30px 0 40px"}} role="img" aria-label="Illustration: a bank reconciliation where each bank line is matched to the books and the difference reaches zero">
        

        <div aria-hidden="true" style={{position: "relative", zIndex: "2", borderRadius: "28px", background: "#FFFFFF", color: "#121519", boxShadow: "0 50px 90px -40px rgba(0,0,0,0.8)", overflow: "hidden"}}>
          

          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid rgba(18,21,25,0.08)"}}>
            

            <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
              <span style={{width: "32px", height: "32px", borderRadius: "10px", background: "#121519", display: "grid", placeItems: "center", color: "#37E191"}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 10h18M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18M12 3l9 5H3z"></path>
                </svg>
              </span>
              <div>
                <p style={{fontSize: "14px", fontWeight: "800"}}>
                  Bank reconciliation
                </p>
                <p className="mono" style={{fontSize: "11px", color: "#50575E"}}>
                  Operating account · Month-end
                </p>
              </div>
            </div>
            

            <span className="mono" style={{fontSize: "10px", padding: "6px 10px", borderRadius: "999px", background: "#EEFBF4", color: "#0B7A44"}}>
              SAMPLE
            </span>
            

          </div>
          

          <div className="ruled" style={{position: "relative", display: "grid", gridTemplateColumns: "minmax(0,1fr) 34px minmax(0,1fr)", padding: "14px 22px 4px", gap: "0"}}>
            

            <p className="eyebrow" style={{fontSize: "10px", color: "#50575E", paddingBottom: "10px"}}>
              Bank statement
            </p>
            <span></span>
            <p className="eyebrow" style={{fontSize: "10px", color: "#50575E", paddingBottom: "10px", textAlign: "right"}}>
              Books
            </p>
            

            {(recRows || []).map((w, index) => (
              <React.Fragment key={index}>
                

                <div style={{height: "40px", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                  <p style={{fontSize: "13px", fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                    {w.d}
                  </p>
                  <p className="mono" style={{fontSize: "11px", color: "#50575E"}}>
                    {w.amt}
                  </p>
                </div>
                

                <div style={{height: "40px", position: "relative", display: "grid", placeItems: "center"}}>
                  

                  <span style={{position: "absolute", left: "-4px", right: "-4px", top: "50%", height: "2px", background: "#22AE68", transformOrigin: "left", animation: `ln 7s ${w.delay} ease-in-out infinite`}}></span>
                  

                  <span className="tick" style={{position: "relative", animation: `tk 7s ${w.delay} ease-in-out infinite`}}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7.5"></path>
                    </svg>
                  </span>
                  

                </div>
                

                <div style={{height: "40px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end"}}>
                  <p style={{fontSize: "13px", fontWeight: "700", color: "#3A4046"}}>
                    {w.acct}
                  </p>
                  <p className="mono" style={{fontSize: "11px", color: "#50575E"}}>
                    {w.amt}
                  </p>
                </div>
                

              </React.Fragment>
            ))}
            

            <span style={{position: "absolute", left: "0", right: "0", height: "2px", background: "rgba(55,225,145,0.55)", boxShadow: "0 0 18px 2px rgba(55,225,145,0.45)", animation: "scan 7s ease-in-out infinite"}}></span>
            

          </div>
          

          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "18px 22px", background: "#121519", color: "#fff"}}>
            

            <div>
              <p className="eyebrow" style={{fontSize: "10px", color: "#AEB7BE"}}>
                Difference
              </p>
              

              <div style={{position: "relative", height: "40px", minWidth: "150px"}}>
                

                <p className="disp" style={{position: "absolute", left: "0", top: "0", fontSize: "32px", fontWeight: "700", color: "#F5C37A", animation: "diffA 7s ease-in-out infinite"}}>
                  $612.40
                </p>
                

                <p className="disp" style={{position: "absolute", left: "0", top: "0", fontSize: "32px", fontWeight: "700", color: "#37E191", animation: "diffB 7s ease-in-out infinite"}}>
                  $0.00
                </p>
                

              </div>
            </div>
            

            <span style={{display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "999px", background: "#37E191", color: "#0A2418", fontSize: "13px", fontWeight: "800"}}>
              <span style={{width: "8px", height: "8px", borderRadius: "50%", background: "#0A2418", animation: "pulse 2s infinite"}}></span>
              Reconciled
            </span>
            

          </div>
          

        </div>
        

        <div aria-hidden="true" style={{position: "absolute", zIndex: "3", left: "-26px", top: "0", padding: "12px 16px", borderRadius: "16px", background: "#22AE68", color: "#0A2418", fontSize: "13px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 20px 40px -20px rgba(0,0,0,.7)", animation: "float 6s ease-in-out infinite"}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12V7l-8-4-8 4v10l8 4 3-1.5M8 9l4 2 4-2M12 11v9"></path>
          </svg>
          Chart of accounts applied
        </div>
        

        <div aria-hidden="true" style={{position: "absolute", zIndex: "3", right: "-10px", bottom: "0", padding: "14px 16px", borderRadius: "18px", background: "rgba(18,21,25,0.9)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", display: "flex", alignItems: "flex-end", gap: "6px", animation: "float 7s 1s ease-in-out infinite"}}>
          

          <span style={{width: "10px", height: "18px", borderRadius: "3px", background: "#22AE68"}}></span>
          <span style={{width: "10px", height: "28px", borderRadius: "3px", background: "#22AE68"}}></span>
          <span style={{width: "10px", height: "22px", borderRadius: "3px", background: "#22AE68"}}></span>
          <span style={{width: "10px", height: "36px", borderRadius: "3px", background: "#37E191"}}></span>
          

          <span style={{marginLeft: "8px", fontSize: "13px", fontWeight: "800", color: "#fff"}}>
            P&L ready
          </span>
          

        </div>
        

      </div>
      

    </div>
    

     trust strip 
    

    <div className="wrap" style={{position: "relative", paddingBottom: "48px"}}>
      

      <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "12px"}}>
        

        <div className="rv" style={{padding: "22px 24px", borderRadius: "20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)"}}>
          <p className="disp" style={{fontSize: "34px", fontWeight: "700", color: "#fff"}}>
            ~250–500
          </p>
          <p style={{fontSize: "14px", color: "#AEB7BE", marginTop: "6px"}}>
            Clients served
          </p>
        </div>
        

        <div className="rv" style={{padding: "22px 24px", borderRadius: "20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)"}}>
          <p className="disp" style={{fontSize: "34px", fontWeight: "700", color: "#fff"}}>
            8 services
          </p>
          <p style={{fontSize: "14px", color: "#AEB7BE", marginTop: "6px"}}>
            From categorisation to financial reports
          </p>
        </div>
        

        <div className="rv" style={{padding: "22px 24px", borderRadius: "20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)"}}>
          <p className="disp" style={{fontSize: "34px", fontWeight: "700", color: "#fff"}}>
            QuickBooks
          </p>
          <p style={{fontSize: "14px", color: "#AEB7BE", marginTop: "6px"}}>
            Based bookkeeping assistance
          </p>
        </div>
        

        <div className="rv" style={{padding: "22px 24px", borderRadius: "20px", background: "#37E191", color: "#0A2418"}}>
          <p className="disp" style={{fontSize: "34px", fontWeight: "700"}}>
            Dr = Cr
          </p>
          <p style={{fontSize: "14px", marginTop: "6px", fontWeight: "600"}}>
            Books that balance, month after month
          </p>
        </div>
        

      </div>
      

    </div>
    

  </section>
  

   {/* ================= BEFORE / AFTER SLIDER ================= */} 
  

  <section id="order" style={{position: "relative", padding: "clamp(90px, 11vw, 150px) 0", background: "#FFFFFF"}}>
    

    <div className="wrap">
      

      <div style={{display: "flex", flexWrap: "wrap", gap: "32px 64px", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "48px"}}>
        

        <div className="rv" style={{flex: "1 1 560px", minWidth: "0"}}>
          

          <p className="eyebrow" style={{color: "#0B7A44", marginBottom: "18px"}}>
            Why bookkeeping matters
          </p>
          

          <h2 className="disp" style={{fontSize: "clamp(36px, 4.8vw, 68px)", lineHeight: "1.02", fontWeight: "700"}}>
            Bookkeeping is not just data entry. 
            <span style={{color: "#0B7A44"}}>
              Drag to see the difference.
            </span>
          </h2>
          

        </div>
        

        <p className="rv" style={{flex: "1 1 360px", minWidth: "0", maxWidth: "440px", fontSize: "17px", lineHeight: "1.7", color: "#50575E"}}>
          When transactions aren't categorised consistently, accounts aren't reconciled or documents are missing, it's harder to understand your position — and harder to prepare your taxes. Properly maintained records help you spot unusual activity and make informed decisions.
        </p>
        

      </div>
      

      <div className="rv" style={{position: "relative", height: "clamp(440px, 46vw, 600px)", borderRadius: "32px", overflow: "hidden", background: "#ECE6DA", boxShadow: "inset 0 0 0 1px rgba(18,21,25,0.08)", userSelect: "none"}}>
        

         BEFORE: shoebox chaos 
        

        <div aria-hidden="true" style={{position: "absolute", inset: "0", backgroundImage: "radial-gradient(rgba(18,21,25,0.08) 1px, transparent 1px)", backgroundSize: "18px 18px"}}>
          

          <span className="eyebrow" style={{position: "absolute", left: "28px", top: "26px", padding: "8px 12px", borderRadius: "999px", background: "#121519", color: "#fff", fontSize: "11px"}}>
            Before
          </span>
          

          {(mess || []).map((m, index) => (
            <React.Fragment key={index}>
              

              <div style={{position: "absolute", left: m.x, top: m.y, width: m.w, "--r": m.r, transform: `rotate(${m.r})`, animation: `wob ${m.dur} ease-in-out infinite`, padding: "16px", borderRadius: "6px", background: m.bg, boxShadow: "0 14px 30px -18px rgba(18,21,25,0.6)", color: "#121519"}}>
                

                <p className="mono" style={{fontSize: "11px", color: "#50575E"}}>
                  {m.k}
                </p>
                

                <p style={{fontSize: "15px", fontWeight: "800", marginTop: "4px"}}>
                  {m.t}
                </p>
                

                <div style={{marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px"}}>
                  <span style={{height: "6px", borderRadius: "6px", background: "rgba(18,21,25,0.12)", width: "90%"}}></span>
                  <span style={{height: "6px", borderRadius: "6px", background: "rgba(18,21,25,0.12)", width: "62%"}}></span>
                </div>
                

                <span style={{display: "inline-block", marginTop: "12px", padding: "5px 9px", borderRadius: "6px", background: "#121519", color: "#F5C37A", font: "700 11px 'DM Mono', monospace"}}>
                  {m.flag}
                </span>
                

              </div>
              

            </React.Fragment>
          ))}
          

        </div>
        

         AFTER: ordered ledger 
        

        <div aria-hidden="true" className="ruled" style={{position: "absolute", inset: "0", backgroundColor: "#FFFFFF", clipPath: `inset(0 0 0 ${mix}%)`, padding: "clamp(24px, 4vw, 48px)"}}>
          

          <span className="eyebrow" style={{position: "absolute", right: "28px", top: "26px", padding: "8px 12px", borderRadius: "999px", background: "#37E191", color: "#0A2418", fontSize: "11px"}}>
            After
          </span>
          

          <div className="margin-line" style={{left: "clamp(16px, 3vw, 36px)"}}></div>
          

          <div style={{maxWidth: "1040px", margin: "40px auto 0", borderRadius: "20px", border: "1px solid rgba(18,21,25,0.1)", overflow: "hidden", background: "#fff"}}>
            

            <div style={{display: "grid", gridTemplateColumns: "80px minmax(0,1.6fr) minmax(0,1.2fr) 120px 120px", gap: "12px", padding: "14px 20px", background: "#121519", color: "#C5CCD2"}} className="eyebrow">
              

              <span style={{fontSize: "10px"}}>
                Date
              </span>
              <span style={{fontSize: "10px"}}>
                Description
              </span>
              <span style={{fontSize: "10px"}}>
                Account
              </span>
              <span style={{fontSize: "10px", textAlign: "right"}}>
                Amount
              </span>
              <span style={{fontSize: "10px", textAlign: "right"}}>
                Status
              </span>
              

            </div>
            

            {(ledger || []).map((l, index) => (
              <React.Fragment key={index}>
                

                <div style={{display: "grid", gridTemplateColumns: "80px minmax(0,1.6fr) minmax(0,1.2fr) 120px 120px", gap: "12px", alignItems: "center", minHeight: "52px", padding: "0 20px", borderTop: "1px solid rgba(18,21,25,0.07)", fontSize: "14px"}}>
                  

                  <span className="mono" style={{color: "#50575E", fontSize: "12px"}}>
                    {l.dt}
                  </span>
                  

                  <span style={{fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                    {l.t}
                  </span>
                  

                  <span style={{justifySelf: "start", padding: "5px 10px", borderRadius: "8px", background: l.cbg, fontSize: "12px", fontWeight: "700", color: "#0A2418", whiteSpace: "nowrap"}}>
                    {l.acct}
                  </span>
                  

                  <span className="mono" style={{textAlign: "right", fontSize: "13px"}}>
                    {l.amt}
                  </span>
                  

                  <span style={{justifySelf: "end", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "800", color: "#0B7A44"}}>
                    <span className="tick" style={{width: "18px", height: "18px"}}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.5l4.5 4.5L19 7.5"></path>
                      </svg>
                    </span>
                    {l.s}
                  </span>
                  

                </div>
                

              </React.Fragment>
            ))}
            

          </div>
          

        </div>
        

        <input className="ba-range" type="range" min="0" max="100" step="1" value={mix} onChange={onMix} aria-label="Compare unorganised records with organised books" />
        

        <div className="ba-handle" aria-hidden="true" style={{position: "absolute", top: "0", bottom: "0", left: `${mix}%`, width: "0", zIndex: "5", pointerEvents: "none"}}>
          

          <span style={{position: "absolute", top: "0", bottom: "0", left: "-1.5px", width: "3px", background: "#121519"}}></span>
          

          <span className="ba-knob" style={{position: "absolute", top: "50%", left: "-32px", width: "64px", height: "64px", marginTop: "-32px", borderRadius: "50%", background: "#121519", color: "#37E191", display: "grid", placeItems: "center", boxShadow: "0 16px 34px -12px rgba(18,21,25,0.7)"}}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l-6 6 6 6M15 6l6 6-6 6"></path>
            </svg>
          </span>
          

        </div>
        

      </div>
      

      <p className="mono" style={{marginTop: "14px", fontSize: "12px", color: "#50575E"}}>
        Illustrative example — not client data.
      </p>
      

    </div>
    

  </section>
  

   {/* ================= SERVICES INDEX + LIVE PREVIEW ================= */} 
  

  <section id="services" style={{background: "#F2F5F3", padding: "clamp(90px, 11vw, 150px) 0"}}>
    

    <div className="wrap">
      

      <div className="rv" style={{maxWidth: "900px", marginBottom: "56px"}}>
        

        <p className="eyebrow" style={{color: "#0B7A44", marginBottom: "18px"}}>
          01 · Bookkeeping services
        </p>
        

        <h2 className="disp" style={{fontSize: "clamp(36px, 4.8vw, 68px)", lineHeight: "1.02", fontWeight: "700"}}>
          Eight services. 
          <span style={{color: "#0B7A44"}}>
            One set of books you can trust.
          </span>
        </h2>
        

      </div>
      

      <div style={{display: "flex", flexWrap: "wrap", gap: "48px", alignItems: "flex-start"}}>
        

        <div style={{flex: "1 1 520px", minWidth: "0", borderBottom: "1px solid rgba(18,21,25,0.12)"}} role="tablist" aria-label="Bookkeeping services">
          

          {(services || []).map((s, index) => (
            <React.Fragment key={index}>
              

              <button type="button" role="tab" className={s.cls} aria-selected={s.sel} onClick={s.pick} onMouseEnter={s.pick}>
                

                <span className="sn">
                  {s.n}
                </span>
                

                <span className="st">
                  {s.t}
                </span>
                

                <span className="sa">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </span>
                

              </button>
              

            </React.Fragment>
          ))}
          

        </div>
        

        <div className="stick" style={{flex: "1 1 460px", minWidth: "0", position: "sticky", top: "110px"}}>
          

          <div role="tabpanel" style={{borderRadius: "32px", background: "#121519", color: "#fff", padding: "clamp(26px, 3vw, 40px)", position: "relative", overflow: "hidden", minHeight: "600px", display: "flex", flexDirection: "column", gap: "22px"}}>
            

            <div aria-hidden="true" className="ribbon" style={{width: "460px", height: "90px", right: "-170px", top: "30px", background: "#22AE68", opacity: ".9", transform: "rotate(-24deg)"}}></div>
            

            <div style={{position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              

              <span className="mono" style={{fontSize: "13px", color: "#37E191"}}>
                {`${cur.n} / 08`}
              </span>
              

              <span className="mono" style={{fontSize: "12px", padding: "7px 12px", borderRadius: "999px", border: "1.5px solid rgba(255,255,255,0.3)", color: "#fff"}}>
                {cur.code}
              </span>
              

            </div>
            

            <h3 className="disp" style={{position: "relative", fontSize: "clamp(28px, 2.6vw, 38px)", lineHeight: "1.08", fontWeight: "700"}}>
              {cur.t}
            </h3>
            

            <p style={{position: "relative", fontSize: "16px", lineHeight: "1.7", color: "#C5CCD2", maxWidth: "460px"}}>
              {cur.d}
            </p>
            

            <div aria-hidden="true" style={{position: "relative", flex: "1", minHeight: "250px", borderRadius: "22px", background: "#FFFFFF", color: "#121519", padding: "22px", overflow: "hidden"}}>
              

               1 categorisation 
              

              {(v0) && (
                <>
                  

                  <div className="pop" style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                    

                    {(catRows || []).map((c, index) => (
                      <React.Fragment key={index}>
                        

                        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", minHeight: "44px", padding: "0 14px", borderRadius: "12px", background: "#F2F5F3"}}>
                          

                          <span style={{fontSize: "14px", fontWeight: "700"}}>
                            {c.t}
                          </span>
                          

                          <span style={{padding: "5px 10px", borderRadius: "8px", background: c.bg, fontSize: "12px", fontWeight: "800", color: "#0A2418", animation: `chip 5s ${c.delay} ease-in-out infinite`}}>
                            {c.cat}
                          </span>
                          

                        </div>
                        

                      </React.Fragment>
                    ))}
                    

                  </div>
                  

                </>
              )}
              

               2 bank rec 
              

              {(v1) && (
                <>
                  

                  <div className="pop" style={{display: "grid", gridTemplateColumns: "minmax(0,1fr) 40px minmax(0,1fr)", gap: "10px 0", alignItems: "center"}}>
                    

                    <p className="eyebrow" style={{fontSize: "10px", color: "#50575E"}}>
                      Statement
                    </p>
                    <span></span>
                    <p className="eyebrow" style={{fontSize: "10px", color: "#50575E", textAlign: "right"}}>
                      Ledger
                    </p>
                    

                    {(bankRows || []).map((b, index) => (
                      <React.Fragment key={index}>
                        

                        <div style={{minHeight: "42px", padding: "0 12px", borderRadius: "10px", background: "#F2F5F3", display: "flex", alignItems: "center"}} className="mono">
                          <span style={{fontSize: "13px"}}>
                            {b.a}
                          </span>
                        </div>
                        

                        <div style={{display: "grid", placeItems: "center", height: "42px"}}>
                          {(b.ok) && (
                            <>
                              <span className="tick" style={{animation: `tk 5s ${b.delay} ease-in-out infinite`}}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M5 12.5l4.5 4.5L19 7.5"></path>
                                </svg>
                              </span>
                            </>
                          )}
                          {(b.flag) && (
                            <>
                              <span style={{width: "22px", height: "22px", borderRadius: "50%", background: "#F5C37A", display: "grid", placeItems: "center", font: "800 13px 'Manrope'", color: "#121519"}}>
                                ?
                              </span>
                            </>
                          )}
                        </div>
                        

                        <div style={{minHeight: "42px", padding: "0 12px", borderRadius: "10px", background: b.rbg, display: "flex", alignItems: "center", justifyContent: "flex-end"}} className="mono">
                          <span style={{fontSize: "13px"}}>
                            {b.b}
                          </span>
                        </div>
                        

                      </React.Fragment>
                    ))}
                    

                    <p style={{gridColumn: "1 / -1", marginTop: "6px", fontSize: "13px", fontWeight: "700", color: "#50575E"}}>
                      Missing or duplicated items are investigated, not ignored.
                    </p>
                    

                  </div>
                  

                </>
              )}
              

               3 credit card rec 
              

              {(v2) && (
                <>
                  

                  <div className="pop" style={{display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "center"}}>
                    

                    <div style={{flex: "0 0 210px", height: "132px", borderRadius: "16px", background: "#121519", color: "#fff", padding: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between", transform: "rotate(-6deg)", boxShadow: "0 20px 34px -18px rgba(18,21,25,.8)"}}>
                      

                      <span style={{width: "36px", height: "26px", borderRadius: "6px", background: "#37E191"}}></span>
                      

                      <span className="mono" style={{fontSize: "13px", letterSpacing: ".2em"}}>
                        •••• •••• •••• 0000
                      </span>
                      

                      <span style={{fontSize: "11px", fontWeight: "700", color: "#AEB7BE"}}>
                        BUSINESS CARD
                      </span>
                      

                    </div>
                    

                    <div style={{flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "12px"}}>
                      

                      <div>
                        <p className="eyebrow" style={{fontSize: "10px", color: "#50575E"}}>
                          Statement balance
                        </p>
                        <div style={{height: "12px", borderRadius: "12px", background: "#121519", marginTop: "8px"}} className="gx"></div>
                      </div>
                      

                      <div>
                        <p className="eyebrow" style={{fontSize: "10px", color: "#50575E"}}>
                          Ledger balance
                        </p>
                        <div style={{height: "12px", borderRadius: "12px", background: "#22AE68", marginTop: "8px", animationDelay: ".4s"}} className="gx"></div>
                      </div>
                      

                      <p style={{display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "800", color: "#0B7A44"}}>
                        <span className="tick">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12.5l4.5 4.5L19 7.5"></path>
                          </svg>
                        </span>
                        Spending & liabilities recorded correctly
                      </p>
                      

                    </div>
                    

                  </div>
                  

                </>
              )}
              

               4 AR aging 
              

              {(v3) && (
                <>
                  

                  <div className="pop">
                    

                    <p className="eyebrow" style={{fontSize: "10px", color: "#50575E", marginBottom: "14px"}}>
                      Open customer balances by age
                    </p>
                    

                    <div style={{display: "flex", alignItems: "flex-end", gap: "14px", height: "170px", borderBottom: "1.5px solid #121519"}}>
                      

                      {(aging || []).map((a, index) => (
                        <React.Fragment key={index}>
                          

                          <div style={{flex: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", gap: "6px"}}>
                            

                            <span className="mono" style={{fontSize: "11px", color: "#3A4046"}}>
                              {a.v}
                            </span>
                            

                            <span className="gr" style={{width: "100%", height: a.h, borderRadius: "8px 8px 0 0", background: a.c, animationDelay: a.delay}}></span>
                            

                          </div>
                          

                        </React.Fragment>
                      ))}
                      

                    </div>
                    

                    <div style={{display: "flex", gap: "14px", marginTop: "8px"}}>
                      {(aging || []).map((a, index) => (
                        <React.Fragment key={index}>
                          <span className="mono" style={{flex: "1", textAlign: "center", fontSize: "11px", color: "#50575E"}}>
                            {a.l}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                    

                  </div>
                  

                </>
              )}
              

               5 AP calendar 
              

              {(v4) && (
                <>
                  

                  <div className="pop">
                    

                    <p className="eyebrow" style={{fontSize: "10px", color: "#50575E", marginBottom: "14px"}}>
                      Vendor bills due this month
                    </p>
                    

                    <div style={{display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "6px"}}>
                      

                      {(cal || []).map((d, index) => (
                        <React.Fragment key={index}>
                          

                          <div style={{height: "36px", borderRadius: "8px", background: d.bg, color: d.fg, display: "grid", placeItems: "center", font: "600 11px 'DM Mono', monospace"}}>
                            {d.n}
                          </div>
                          

                        </React.Fragment>
                      ))}
                      

                    </div>
                    

                    <p style={{marginTop: "12px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "700", color: "#3A4046"}}>
                      <span style={{width: "12px", height: "12px", borderRadius: "4px", background: "#121519"}}></span>
                      Bill due
                      <span style={{width: "12px", height: "12px", borderRadius: "4px", background: "#37E191", marginLeft: "10px"}}></span>
                      Paid & recorded
                    </p>
                    

                  </div>
                  

                </>
              )}
              

               6 GL T-account 
              

              {(v5) && (
                <>
                  

                  <div className="pop">
                    

                    <p className="disp" style={{textAlign: "center", fontSize: "20px", fontWeight: "700", paddingBottom: "10px", borderBottom: "3px solid #121519"}}>
                      Cash · 1000
                    </p>
                    

                    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
                      

                      <div style={{borderRight: "3px solid #121519", padding: "12px 16px 0 0", display: "flex", flexDirection: "column", gap: "8px"}}>
                        

                        <p className="eyebrow" style={{fontSize: "10px", color: "#0B7A44"}}>
                          Debit
                        </p>
                        

                        <p className="mono" style={{display: "flex", justifyContent: "space-between", fontSize: "13px"}}>
                          <span>
                            Deposits
                          </span>
                          <span>
                            5,430.25
                          </span>
                        </p>
                        

                        <p className="mono" style={{display: "flex", justifyContent: "space-between", fontSize: "13px"}}>
                          <span>
                            Transfer in
                          </span>
                          <span>
                            1,000.00
                          </span>
                        </p>
                        

                      </div>
                      

                      <div style={{padding: "12px 0 0 16px", display: "flex", flexDirection: "column", gap: "8px"}}>
                        

                        <p className="eyebrow" style={{fontSize: "10px", color: "#0B7A44"}}>
                          Credit
                        </p>
                        

                        <p className="mono" style={{display: "flex", justifyContent: "space-between", fontSize: "13px"}}>
                          <span>
                            Rent
                          </span>
                          <span>
                            2,400.00
                          </span>
                        </p>
                        

                        <p className="mono" style={{display: "flex", justifyContent: "space-between", fontSize: "13px"}}>
                          <span>
                            Card payment
                          </span>
                          <span>
                            612.40
                          </span>
                        </p>
                        

                        <p className="mono" style={{display: "flex", justifyContent: "space-between", fontSize: "13px"}}>
                          <span>
                            Software
                          </span>
                          <span>
                            89.00
                          </span>
                        </p>
                        

                      </div>
                      

                    </div>
                    

                    <p style={{marginTop: "18px", padding: "12px 14px", borderRadius: "12px", background: "#EEFBF4", display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: "800"}}>
                      <span>
                        Balance
                      </span>
                      <span className="mono">
                        3,328.85 Dr
                      </span>
                    </p>
                    

                  </div>
                  

                </>
              )}
              

               7 month-end checklist 
              

              {(v6) && (
                <>
                  

                  <div className="pop" style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                    

                    {(closeList || []).map((c, index) => (
                      <React.Fragment key={index}>
                        

                        <div style={{display: "flex", alignItems: "center", gap: "12px", minHeight: "40px"}}>
                          

                          <span className="tick" style={{animation: `tk 6s ${c.delay} ease-in-out infinite`}}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12.5l4.5 4.5L19 7.5"></path>
                            </svg>
                          </span>
                          

                          <span style={{fontSize: "14px", fontWeight: "700"}}>
                            {c.t}
                          </span>
                          

                        </div>
                        

                      </React.Fragment>
                    ))}
                    

                    <div style={{height: "8px", borderRadius: "8px", background: "#F2F5F3", overflow: "hidden", marginTop: "4px"}}>
                      <div className="gx" style={{height: "100%", background: "#22AE68", animationDuration: "2.4s"}}></div>
                    </div>
                    

                  </div>
                  

                </>
              )}
              

               8 reports 
              

              {(v7) && (
                <>
                  

                  <div className="pop" style={{display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px", height: "100%"}}>
                    

                    {(repCards || []).map((c, index) => (
                      <React.Fragment key={index}>
                        

                        <div style={{borderRadius: "14px", background: c.bg, color: c.fg, padding: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "200px"}}>
                          

                          <p style={{fontSize: "14px", fontWeight: "800", lineHeight: "1.25"}}>
                            {c.t}
                          </p>
                          

                          <div style={{display: "flex", alignItems: "flex-end", gap: "5px", height: "80px"}}>
                            

                            <span className="gr" style={{flex: "1", height: "40%", borderRadius: "4px", background: "currentColor", opacity: ".35"}}></span>
                            

                            <span className="gr" style={{flex: "1", height: "70%", borderRadius: "4px", background: "currentColor", opacity: ".55", animationDelay: ".1s"}}></span>
                            

                            <span className="gr" style={{flex: "1", height: "55%", borderRadius: "4px", background: "currentColor", opacity: ".75", animationDelay: ".2s"}}></span>
                            

                            <span className="gr" style={{flex: "1", height: "90%", borderRadius: "4px", background: "currentColor", animationDelay: ".3s"}}></span>
                            

                          </div>
                          

                        </div>
                        

                      </React.Fragment>
                    ))}
                    

                  </div>
                  

                </>
              )}
              

            </div>
            

            <div style={{position: "relative", display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", justifyContent: "space-between"}}>
              

              <div style={{display: "flex", gap: "8px"}}>
                

                <button type="button" aria-label="Previous service" onClick={svcPrev} style={{width: "48px", height: "48px", borderRadius: "14px", border: "1.5px solid rgba(255,255,255,0.25)", background: "transparent", color: "#fff", display: "grid", placeItems: "center", cursor: "pointer"}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M19 12H5M11 6l-6 6 6 6"></path>
                  </svg>
                </button>
                

                <button type="button" aria-label="Next service" onClick={svcNext} style={{width: "48px", height: "48px", borderRadius: "14px", border: "0", background: "#37E191", color: "#0A2418", display: "grid", placeItems: "center", cursor: "pointer"}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </button>
                

              </div>
              

              <a href="#start" className="b b-mint" style={{minHeight: "48px", paddingRight: "8px"}}>
                Discuss this service
                <span className="ar">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </span>
              </a>
              

            </div>
            

          </div>
          

        </div>
        

      </div>
      

    </div>
    

  </section>
  

   {/* ================= MONTH-END DIAL ================= */} 
  

  <section id="close" className="ruled-d" style={{position: "relative", background: "#121519", color: "#E8EDF0", padding: "clamp(90px, 11vw, 150px) 0", overflow: "hidden"}}>
    

    <div className="wrap">
      

      <div style={{display: "flex", flexWrap: "wrap", gap: "64px", alignItems: "center"}}>
        

        <div style={{flex: "1 1 480px", minWidth: "0", display: "flex", flexDirection: "column", gap: "22px"}}>
          

          <p className="eyebrow rv" style={{color: "#37E191"}}>
            02 · The monthly rhythm
          </p>
          

          <h2 className="disp rv" style={{fontSize: "clamp(36px, 4.6vw, 64px)", lineHeight: "1.02", fontWeight: "700", color: "#fff"}}>
            One month, 
            <span style={{color: "#37E191"}}>
              closed properly.
            </span>
          </h2>
          

          <p className="rv" style={{fontSize: "17px", lineHeight: "1.7", color: "#AEB7BE", maxWidth: "520px"}}>
            Monthly bookkeeping follows a steady cycle. Pick a phase to see what happens in it — the exact cadence is agreed with you at the start of the engagement.
          </p>
          

          <div style={{display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px"}} role="group" aria-label="Month-end phases">
            

            {(phases || []).map((p, index) => (
              <React.Fragment key={index}>
                

                <button type="button" className={p.cls} aria-pressed={p.pressed} onClick={p.pick}>
                  

                  <span className="pn">
                    {p.n}
                  </span>
                  

                  <span style={{flex: "1", display: "flex", flexDirection: "column", gap: "2px"}}>
                    <span style={{fontSize: "17px", fontWeight: "800"}}>
                      {p.t}
                    </span>
                    <span className="mono" style={{fontSize: "11px", opacity: ".75", letterSpacing: ".08em", textTransform: "uppercase"}}>
                      {p.when}
                    </span>
                  </span>
                  

                </button>
                

              </React.Fragment>
            ))}
            

          </div>
          

        </div>
        

        <div style={{flex: "1 1 480px", minWidth: "0", display: "flex", justifyContent: "center"}}>
          

          <div className="dialbox" style={{position: "relative", width: "480px", maxWidth: "100%", aspectRatio: "1"}}>
            

            <svg viewBox="0 0 320 320" style={{width: "100%", height: "100%", display: "block", transform: "rotate(-90deg)"}} role="img" aria-label="Monthly bookkeeping cycle dial with four phases; the selected phase is highlighted">
              

              <circle cx="160" cy="160" r="130" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="34"></circle>
              

              {(arcs || []).map((a, index) => (
                <React.Fragment key={index}>
                  

                  <circle cx="160" cy="160" r="130" fill="none" stroke={a.col} strokeWidth={a.sw} strokeDasharray={a.da} strokeDashoffset={a.off} style={{transition: "stroke .5s, stroke-width .5s"}}></circle>
                  

                </React.Fragment>
              ))}
              

              <circle cx="160" cy="160" r="96" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="2 6"></circle>
              

            </svg>
            

            <div aria-hidden="true" style={{position: "absolute", inset: "0", animation: "spin 40s linear infinite"}}>
              <span style={{position: "absolute", left: "50%", top: "4px", width: "12px", height: "12px", marginLeft: "-6px", borderRadius: "50%", background: "#37E191", boxShadow: "0 0 18px #37E191"}}></span>
            </div>
            

            <div style={{position: "absolute", inset: "22%", borderRadius: "50%", background: "#1B1F24", border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "26px", gap: "10px"}}>
              

              <span className="mono" style={{fontSize: "12px", color: "#37E191"}}>
                {`Phase ${ph.n}`}
              </span>
              

              <p className="disp" style={{fontSize: "clamp(20px, 2.2vw, 26px)", fontWeight: "700", lineHeight: "1.1", color: "#fff"}}>
                {ph.t}
              </p>
              

              <p style={{fontSize: "13px", lineHeight: "1.55", color: "#AEB7BE"}}>
                {ph.d}
              </p>
              

            </div>
            

          </div>
          

        </div>
        

      </div>
      

      <ul style={{marginTop: "48px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px"}}>
        

        {(ph.items || []).map((i, index) => (
          <React.Fragment key={index}>
            

            <li className="pop" style={{display: "flex", alignItems: "center", gap: "12px", padding: "18px 20px", borderRadius: "18px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", fontSize: "15px", fontWeight: "700", color: "#fff"}}>
              <span className="tick">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5"></path>
                </svg>
              </span>
              {i}
            </li>
            

          </React.Fragment>
        ))}
        

      </ul>
      

    </div>
    

  </section>
  

   {/* ================= REPORTS + CHARTS ================= */} 
  

  <section id="reports" style={{padding: "clamp(90px, 11vw, 150px) 0", background: "#FFFFFF"}}>
    

    <div className="wrap">
      

      <div style={{display: "flex", flexWrap: "wrap", gap: "28px 64px", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "40px"}}>
        

        <div className="rv" style={{flex: "1 1 560px", minWidth: "0"}}>
          

          <p className="eyebrow" style={{color: "#0B7A44", marginBottom: "18px"}}>
            03 · Financial reporting
          </p>
          

          <h2 className="disp" style={{fontSize: "clamp(36px, 4.8vw, 68px)", lineHeight: "1.02", fontWeight: "700"}}>
            Reports that read 
            <span style={{color: "#0B7A44"}}>
              like answers, not spreadsheets.
            </span>
          </h2>
          

        </div>
        

        <div className="rv" role="group" aria-label="Choose a report" style={{display: "inline-flex", flexWrap: "wrap", gap: "4px", padding: "5px", borderRadius: "16px", background: "#F2F5F3"}}>
          

          {(repTabs || []).map((t, index) => (
            <React.Fragment key={index}>
              

              <button type="button" className={t.cls} aria-pressed={t.pressed} onClick={t.pick}>
                {t.label}
              </button>
              

            </React.Fragment>
          ))}
          

        </div>
        

      </div>
      

      <div className="rv" style={{display: "flex", flexWrap: "wrap", gap: "20px"}}>
        

        <div style={{flex: "999 1 640px", minWidth: "0", borderRadius: "32px", border: "1px solid rgba(18,21,25,0.1)", padding: "clamp(24px, 3vw, 40px)", background: "#FFFFFF", minHeight: "520px", display: "flex", flexDirection: "column", gap: "24px"}}>
          

          <div style={{display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", alignItems: "baseline"}}>
            

            <p className="disp" style={{fontSize: "24px", fontWeight: "700"}}>
              {repTitle}
            </p>
            

            <span className="mono" style={{fontSize: "11px", padding: "6px 10px", borderRadius: "999px", background: "#F2F5F3", color: "#50575E"}}>
              Sample data · for illustration
            </span>
            

          </div>
          

           P&L grouped bars 
          

          {(r0) && (
            <>
              

              <div className="pop" style={{flex: "1", display: "flex", flexDirection: "column", gap: "16px"}}>
                

                <div style={{display: "flex", gap: "20px", fontSize: "13px", fontWeight: "700", color: "#3A4046"}}>
                  <span style={{display: "inline-flex", alignItems: "center", gap: "8px"}}>
                    <span style={{width: "12px", height: "12px", borderRadius: "4px", background: "#121519"}}></span>
                    Revenue
                  </span>
                  <span style={{display: "inline-flex", alignItems: "center", gap: "8px"}}>
                    <span style={{width: "12px", height: "12px", borderRadius: "4px", background: "#37E191"}}></span>
                    Expenses
                  </span>
                </div>
                

                <div role="img" aria-label="Sample bar chart: monthly revenue and expenses for six months, revenue rising from 42k to 58k while expenses rise from 35k to 42k" style={{flex: "1", position: "relative", display: "flex", alignItems: "flex-end", gap: "clamp(10px, 2vw, 28px)", minHeight: "300px", borderBottom: "1.5px solid #121519", backgroundImage: "repeating-linear-gradient(0deg, rgba(18,21,25,0.07) 0 1px, transparent 1px 60px)"}}>
                  

                  {(pl || []).map((m, index) => (
                    <React.Fragment key={index}>
                      

                      <div style={{flex: "1", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", gap: "8px"}}>
                        

                        <span className="mono" style={{fontSize: "11px", fontWeight: "500", color: "#0B7A44"}}>
                          {`+${m.net}k`}
                        </span>
                        

                        <div style={{width: "100%", height: "100%", display: "flex", alignItems: "flex-end", gap: "4px"}}>
                          

                          <span className="gr" style={{flex: "1", height: m.rh, background: "#121519", borderRadius: "6px 6px 0 0", animationDelay: m.delay}}></span>
                          

                          <span className="gr" style={{flex: "1", height: m.eh, background: "#37E191", borderRadius: "6px 6px 0 0", animationDelay: m.delay2}}></span>
                          

                        </div>
                        

                      </div>
                      

                    </React.Fragment>
                  ))}
                  

                </div>
                

                <div style={{display: "flex", gap: "clamp(10px, 2vw, 28px)"}}>
                  {(pl || []).map((m, index) => (
                    <React.Fragment key={index}>
                      <span className="mono" style={{flex: "1", textAlign: "center", fontSize: "12px", color: "#50575E"}}>
                        {m.m}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
                

              </div>
              

            </>
          )}
          

           Balance sheet 
          

          {(r1) && (
            <>
              

              <div className="pop" style={{flex: "1", display: "flex", flexWrap: "wrap", gap: "36px", alignItems: "stretch"}}>
                

                <div role="img" aria-label="Sample balance sheet: assets of 100k equal liabilities of 50k plus equity of 50k" style={{flex: "1 1 320px", display: "flex", gap: "28px", alignItems: "flex-end", minHeight: "320px"}}>
                  

                  <div style={{flex: "1", display: "flex", flexDirection: "column", gap: "10px", height: "100%"}}>
                    

                    <div style={{flex: "1", display: "flex", flexDirection: "column", borderRadius: "16px", overflow: "hidden"}}>
                      

                      {(assets || []).map((a, index) => (
                        <React.Fragment key={index}>
                          

                          <div className="gr" style={{flex: a.f, background: a.c, color: a.fg, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", fontSize: "13px", fontWeight: "800"}}>
                            <span>
                              {a.t}
                            </span>
                            <span className="mono">
                              {a.v}
                            </span>
                          </div>
                          

                        </React.Fragment>
                      ))}
                      

                    </div>
                    

                    <p className="eyebrow" style={{fontSize: "11px", textAlign: "center", color: "#3A4046"}}>
                      Assets
                    </p>
                    

                  </div>
                  

                  <div aria-hidden="true" style={{alignSelf: "center", width: "56px", height: "56px", borderRadius: "50%", background: "#121519", color: "#37E191", display: "grid", placeItems: "center", font: "700 22px 'Sora'"}}>
                    =
                  </div>
                  

                  <div style={{flex: "1", display: "flex", flexDirection: "column", gap: "10px", height: "100%"}}>
                    

                    <div style={{flex: "1", display: "flex", flexDirection: "column", borderRadius: "16px", overflow: "hidden"}}>
                      

                      {(liabs || []).map((a, index) => (
                        <React.Fragment key={index}>
                          

                          <div className="gr" style={{flex: a.f, background: a.c, color: a.fg, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", fontSize: "13px", fontWeight: "800"}}>
                            <span>
                              {a.t}
                            </span>
                            <span className="mono">
                              {a.v}
                            </span>
                          </div>
                          

                        </React.Fragment>
                      ))}
                      

                    </div>
                    

                    <p className="eyebrow" style={{fontSize: "11px", textAlign: "center", color: "#3A4046"}}>
                      Liabilities + Equity
                    </p>
                    

                  </div>
                  

                </div>
                

                <div style={{flex: "1 1 220px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "14px"}}>
                  

                  <p className="disp" style={{fontSize: "30px", fontWeight: "700", lineHeight: "1.05"}}>
                    It balances. 
                    <span style={{color: "#0B7A44"}}>
                      Every time.
                    </span>
                  </p>
                  

                  <p style={{fontSize: "15px", lineHeight: "1.65", color: "#50575E"}}>
                    A balance sheet is only as good as the reconciliations behind it — which is why we reconcile bank, card and payroll-related accounts before reporting.
                  </p>
                  

                </div>
                

              </div>
              

            </>
          )}
          

           Cash flow waterfall 
          

          {(r2) && (
            <>
              

              <div className="pop" style={{flex: "1", display: "flex", flexDirection: "column", gap: "12px"}}>
                

                <div role="img" aria-label="Sample cash flow waterfall: opening cash 24k, plus 18k operating, minus 9k investing, minus 4k financing, closing cash 29k" style={{position: "relative", display: "flex", gap: "clamp(12px, 2.4vw, 32px)", height: "320px", borderBottom: "1.5px solid #121519", backgroundImage: "repeating-linear-gradient(0deg, rgba(18,21,25,0.07) 0 1px, transparent 1px 64px)"}}>
                  

                  {(wf || []).map((w, index) => (
                    <React.Fragment key={index}>
                      

                      <div style={{flex: "1", position: "relative", height: "100%"}}>
                        

                        <div className="gr" style={{position: "absolute", left: "8%", right: "8%", bottom: w.bottom, height: w.height, background: w.c, borderRadius: "8px", animationDelay: w.delay}}></div>
                        

                        <span className="mono" style={{position: "absolute", left: "0", right: "0", textAlign: "center", bottom: w.labelB, fontSize: "12px", fontWeight: "500", color: "#121519"}}>
                          {w.v}
                        </span>
                        

                      </div>
                      

                    </React.Fragment>
                  ))}
                  

                </div>
                

                <div style={{display: "flex", gap: "clamp(12px, 2.4vw, 32px)"}}>
                  {(wf || []).map((w, index) => (
                    <React.Fragment key={index}>
                      <span style={{flex: "1", textAlign: "center", fontSize: "12px", fontWeight: "700", color: "#3A4046"}}>
                        {w.t}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
                

              </div>
              

            </>
          )}
          

        </div>
        

        <div style={{flex: "1 1 300px", minWidth: "0", display: "flex", flexDirection: "column", gap: "20px"}}>
          

          <div style={{flex: "1", borderRadius: "32px", background: "#121519", color: "#fff", padding: "32px", display: "flex", flexDirection: "column", gap: "16px", position: "relative", overflow: "hidden"}}>
            

            <div aria-hidden="true" className="ribbon" style={{width: "360px", height: "70px", right: "-140px", bottom: "40px", background: "#22AE68", transform: "rotate(-24deg)"}}></div>
            

            <p className="eyebrow" style={{color: "#37E191", position: "relative"}}>
              What it tells you
            </p>
            

            <p className="disp" style={{fontSize: "26px", lineHeight: "1.15", fontWeight: "700", position: "relative"}}>
              {repQ}
            </p>
            

            <p style={{fontSize: "15px", lineHeight: "1.65", color: "#C5CCD2", position: "relative"}}>
              {repA}
            </p>
            

          </div>
          

          <div style={{borderRadius: "24px", background: "#EEFBF4", padding: "24px", fontSize: "14px", lineHeight: "1.6", color: "#0A2418", fontWeight: "600"}}>
            Profit and Loss, Balance Sheet and Cash Flow reports are prepared from your accounting records within the agreed reporting scope.
          </div>
          

        </div>
        

      </div>
      

    </div>
    

  </section>
  

   {/* ================= BOOKS HEALTH CHECK ================= */} 
  

  <section id="check" style={{background: "#F2F5F3", padding: "clamp(90px, 11vw, 150px) 0"}}>
    

    <div className="wrap">
      

      <div className="rv" style={{maxWidth: "860px", marginBottom: "48px"}}>
        

        <p className="eyebrow" style={{color: "#0B7A44", marginBottom: "18px"}}>
          04 · 60-second books check
        </p>
        

        <h2 className="disp" style={{fontSize: "clamp(36px, 4.8vw, 68px)", lineHeight: "1.02", fontWeight: "700"}}>
          How tax-ready 
          <span style={{color: "#0B7A44"}}>
            are your books?
          </span>
        </h2>
        

      </div>
      

      <div style={{display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start"}}>
        

        <fieldset style={{flex: "999 1 600px", minWidth: "0", display: "flex", flexDirection: "column", gap: "10px"}}>
          

          <legend style={{position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)"}}>
            Answer six questions about your records
          </legend>
          

          {(qs || []).map((q, index) => (
            <React.Fragment key={index}>
              

              <div style={{display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "14px 24px", padding: "18px 22px", borderRadius: "20px", background: "#FFFFFF", border: `1.5px solid ${q.border}`, transition: "border-color .3s"}}>
                

                <p style={{flex: "1 1 340px", display: "flex", gap: "14px", alignItems: "baseline", fontSize: "16px", fontWeight: "700", lineHeight: "1.4"}}>
                  <span className="mono" style={{fontSize: "12px", color: "#0B7A44"}}>
                    {q.n}
                  </span>
                  {q.t}
                </p>
                

                <div style={{display: "flex", gap: "8px"}} role="group" aria-label={q.t}>
                  

                  <button type="button" className={q.yCls} aria-pressed={q.yP} onClick={q.yes}>
                    Yes
                  </button>
                  

                  <button type="button" className={q.nCls} aria-pressed={q.nP} onClick={q.no}>
                    Not yet
                  </button>
                  

                </div>
                

              </div>
              

            </React.Fragment>
          ))}
          

        </fieldset>
        

        <div className="stick" style={{flex: "1 1 360px", minWidth: "0", position: "sticky", top: "110px", borderRadius: "32px", background: "#121519", color: "#fff", padding: "32px", display: "flex", flexDirection: "column", gap: "18px", overflow: "hidden"}}>
          

          <p className="eyebrow" style={{color: "#37E191"}}>
            Your result
          </p>
          

          <div style={{position: "relative", width: "100%", maxWidth: "300px", margin: "0 auto"}}>
            

            <svg viewBox="0 0 240 132" style={{width: "100%", display: "block"}} role="img" aria-label={`Books readiness gauge showing ${score} of 6`}>
              

              <path d="M20 120 A100 100 0 0 1 220 120" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="18" strokeLinecap="round"></path>
              

              <path d="M20 120 A100 100 0 0 1 220 120" fill="none" stroke={gaugeCol} strokeWidth="18" strokeLinecap="round" strokeDasharray="314.16" strokeDashoffset={gaugeOff} style={{transition: "stroke-dashoffset .9s cubic-bezier(.2,.8,.2,1), stroke .5s"}}></path>
              

            </svg>
            

            <div style={{position: "absolute", left: "0", right: "0", bottom: "0", textAlign: "center"}}>
              <p className="disp" style={{fontSize: "48px", fontWeight: "700", lineHeight: "1"}}>
                {score}
                <span style={{fontSize: "22px", color: "#8B959C"}}>
                  /6
                </span>
              </p>
            </div>
            

          </div>
          

          <p className="disp" style={{fontSize: "24px", fontWeight: "700", lineHeight: "1.15", textAlign: "center"}}>
            {verdict}
          </p>
          

          <p style={{fontSize: "15px", lineHeight: "1.65", color: "#C5CCD2", textAlign: "center"}}>
            {verdictD}
          </p>
          

          <p className="mono" style={{fontSize: "11px", color: "#8B959C", textAlign: "center"}}>
            {`${answered} of 6 answered · indicative only`}
          </p>
          

          <a href="#start" className="b b-mint" style={{paddingRight: "10px"}}>
            {verdictCta}
            <span className="ar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6"></path>
              </svg>
            </span>
          </a>
          

          <button type="button" onClick={resetQs} style={{minHeight: "44px", border: "0", background: "transparent", color: "#AEB7BE", fontSize: "14px", fontWeight: "700", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "4px"}}>
            Start over
          </button>
          

        </div>
        

      </div>
      

    </div>
    

  </section>
  

   {/* ================= ENGAGEMENT MODELS ================= */} 
  

  <section id="models" style={{padding: "clamp(90px, 11vw, 150px) 0", background: "#FFFFFF"}}>
    

    <div className="wrap">
      

      <div style={{display: "flex", flexWrap: "wrap", gap: "28px 64px", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "48px"}}>
        

        <div className="rv" style={{flex: "1 1 560px", minWidth: "0"}}>
          

          <p className="eyebrow" style={{color: "#0B7A44", marginBottom: "18px"}}>
            05 · Ways to work with us
          </p>
          

          <h2 className="disp" style={{fontSize: "clamp(36px, 4.8vw, 68px)", lineHeight: "1.02", fontWeight: "700"}}>
            Pick the engagement 
            <span style={{color: "#0B7A44"}}>
              that fits your books.
            </span>
          </h2>
          

        </div>
        

        <p className="rv" style={{flex: "1 1 340px", minWidth: "0", maxWidth: "420px", fontSize: "16px", lineHeight: "1.7", color: "#50575E"}}>
          Support can be discussed for a defined task, a particular stage of your accounting workflow or an ongoing workload — subject to capacity and agreement.
        </p>
        

      </div>
      

      <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px"}}>
        

        {(models || []).map((m, index) => (
          <React.Fragment key={index}>
            

            <article className="lift rv" style={{position: "relative", borderRadius: "32px", padding: "34px", background: m.bg, color: m.fg, display: "flex", flexDirection: "column", gap: "18px", minHeight: "560px", overflow: "hidden"}}>
              

              <div aria-hidden="true" style={{position: "absolute", inset: "0", backgroundImage: `repeating-linear-gradient(0deg, ${m.rule} 0 1px, transparent 1px 40px)`, pointerEvents: "none"}}></div>
              

              <div aria-hidden="true" style={{position: "absolute", top: "0", bottom: "0", left: "64px", width: "2px", background: m.margin}}></div>
              

              <div style={{position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                

                <span className="mono" style={{fontSize: "13px", opacity: ".75"}}>
                  {m.n}
                </span>
                

                <span className="mono" style={{fontSize: "12px", padding: "7px 12px", borderRadius: "999px", border: "1.5px solid currentColor"}}>
                  {m.tag}
                </span>
                

              </div>
              

              <h3 className="disp" style={{position: "relative", fontSize: "30px", lineHeight: "1.08", fontWeight: "700", paddingLeft: "52px"}}>
                {m.t}
              </h3>
              

              <p style={{position: "relative", fontSize: "15px", lineHeight: "1.65", opacity: ".85", paddingLeft: "52px"}}>
                {m.d}
              </p>
              

              <ul style={{position: "relative", display: "flex", flexDirection: "column", gap: "0", paddingLeft: "52px", flex: "1"}}>
                

                {(m.items || []).map((i, index) => (
                  <React.Fragment key={index}>
                    

                    <li style={{minHeight: "40px", display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "700"}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={m.tickC} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12.5l4.5 4.5L19 7.5"></path>
                      </svg>
                      {i}
                    </li>
                    

                  </React.Fragment>
                ))}
                

              </ul>
              

              <a href="#start" className={m.btn} style={{position: "relative", alignSelf: "flex-start", paddingRight: "10px"}}>
                {m.cta}
                <span className="ar">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </span>
              </a>
              

            </article>
            

          </React.Fragment>
        ))}
        

      </div>
      

    </div>
    

  </section>
  

   {/* ================= PAYROLL FLOW ================= */} 
  

  <section id="payroll" style={{position: "relative", background: "#0B7A44", color: "#FFFFFF", padding: "clamp(90px, 11vw, 140px) 0", overflow: "hidden"}}>
    

    <div aria-hidden="true" className="ribbon" style={{width: "1300px", height: "150px", left: "-400px", top: "-40px", background: "#22AE68", opacity: ".55", transform: "rotate(-12deg)"}}></div>
    

    <div className="wrap" style={{position: "relative"}}>
      

      <div style={{display: "flex", flexWrap: "wrap", gap: "28px 64px", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "56px"}}>
        

        <div className="rv" style={{flex: "1 1 560px", minWidth: "0"}}>
          

          <p className="eyebrow" style={{color: "#BFF3D8", marginBottom: "18px"}}>
            06 · Payroll accounting
          </p>
          

          <h2 className="disp" style={{fontSize: "clamp(36px, 4.6vw, 64px)", lineHeight: "1.02", fontWeight: "700"}}>
            Payroll, recorded 
            <span style={{color: "#121519"}}>
              end to end.
            </span>
          </h2>
          

        </div>
        

        <p className="rv" style={{flex: "1 1 340px", minWidth: "0", maxWidth: "440px", fontSize: "16px", lineHeight: "1.7", color: "#E3F8EC"}}>
          Gross wages, withholdings, employer payroll taxes, benefits and liabilities — recorded in your accounting system and reconciled with the general ledger, where included in the engagement.
        </p>
        

      </div>
      

      <div className="rv" style={{position: "relative", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "14px"}}>
        

        <div aria-hidden="true" style={{position: "absolute", left: "4%", right: "4%", top: "46px", height: "2px", background: "rgba(255,255,255,0.3)"}}>
          

          <span style={{position: "absolute", top: "-5px", width: "12px", height: "12px", borderRadius: "50%", background: "#37E191", boxShadow: "0 0 16px #37E191", animation: "flow 5s linear infinite"}}></span>
          

          <span style={{position: "absolute", top: "-5px", width: "12px", height: "12px", borderRadius: "50%", background: "#fff", animation: "flow 5s 2.5s linear infinite"}}></span>
          

        </div>
        

        {(payroll || []).map((p, index) => (
          <React.Fragment key={index}>
            

            <div style={{position: "relative", display: "flex", flexDirection: "column", gap: "14px"}}>
              

              <span style={{width: "92px", height: "92px", borderRadius: "28px", background: p.bg, color: p.fg, display: "grid", placeItems: "center", font: "500 14px 'DM Mono', monospace", boxShadow: "0 20px 40px -24px rgba(0,0,0,.6)"}}>
                {p.n}
              </span>
              

              <p className="disp" style={{fontSize: "20px", fontWeight: "700", lineHeight: "1.15"}}>
                {p.t}
              </p>
              

              <p style={{fontSize: "14px", lineHeight: "1.6", color: "#E3F8EC"}}>
                {p.d}
              </p>
              

            </div>
            

          </React.Fragment>
        ))}
        

      </div>
      

      <div style={{marginTop: "56px", display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "stretch"}}>
        

        <div className="rv" style={{flex: "1 1 420px", minWidth: "0", borderRadius: "28px", background: "#121519", padding: "30px", display: "flex", flexDirection: "column", gap: "18px"}}>
          

          <p className="eyebrow" style={{color: "#37E191"}}>
            Reporting workflows we support
          </p>
          

          <div style={{display: "flex", flexWrap: "wrap", gap: "10px"}}>
            

            <span className="disp" style={{padding: "14px 20px", borderRadius: "16px", background: "#37E191", color: "#0A2418", fontSize: "22px", fontWeight: "700"}}>
              941
            </span>
            

            <span className="disp" style={{padding: "14px 20px", borderRadius: "16px", background: "#22AE68", color: "#0A2418", fontSize: "22px", fontWeight: "700"}}>
              940
            </span>
            

            <span className="disp" style={{padding: "14px 20px", borderRadius: "16px", background: "#FFFFFF", color: "#121519", fontSize: "22px", fontWeight: "700"}}>
              W-2
            </span>
            

            <span className="disp" style={{padding: "14px 20px", borderRadius: "16px", border: "1.5px solid rgba(255,255,255,0.3)", color: "#fff", fontSize: "22px", fontWeight: "700"}}>
              W-3
            </span>
            

          </div>
          

          <p style={{fontSize: "14px", lineHeight: "1.6", color: "#AEB7BE"}}>
            Organising information for quarterly and annual payroll reporting, where included in the agreed scope.
          </p>
          

        </div>
        

        <div className="rv" style={{flex: "1 1 420px", minWidth: "0", borderRadius: "28px", background: "#EEFBF4", color: "#0A2418", padding: "30px", display: "flex", flexDirection: "column", gap: "14px"}}>
          

          <p className="eyebrow" style={{color: "#0B7A44"}}>
            Scope, in writing
          </p>
          

          <p className="disp" style={{fontSize: "22px", fontWeight: "700", lineHeight: "1.2"}}>
            Federal, state and local payroll requirements differ.
          </p>
          

          <p style={{fontSize: "15px", lineHeight: "1.65", color: "#3A4046"}}>
            Your engagement states clearly whether we provide payroll accounting support, payroll processing, tax deposit support, form preparation, filing or a combination — so nothing is assumed.
          </p>
          

        </div>
        

      </div>
      

    </div>
    

  </section>
  

   {/* ================= PROCESS RAIL ================= */} 
  

  <section id="process" style={{padding: "clamp(90px, 11vw, 150px) 0", background: "#FFFFFF", overflow: "hidden"}}>
    

    <div className="wrap">
      

      <div className="rv" style={{maxWidth: "860px", marginBottom: "64px"}}>
        

        <p className="eyebrow" style={{color: "#0B7A44", marginBottom: "18px"}}>
          07 · How it works
        </p>
        

        <h2 className="disp" style={{fontSize: "clamp(36px, 4.8vw, 68px)", lineHeight: "1.02", fontWeight: "700"}}>
          From first call 
          <span style={{color: "#0B7A44"}}>
            to a closed month.
          </span>
        </h2>
        

      </div>
      

      <div style={{position: "relative"}}>
        

        <div aria-hidden="true" style={{position: "absolute", left: "0", right: "0", top: "27px", height: "3px", background: "#F2F5F3", borderRadius: "3px"}}>
          <div className="rail-fill" style={{height: "100%", background: "linear-gradient(90deg, #22AE68, #37E191)", borderRadius: "3px", transformOrigin: "left"}}></div>
        </div>
        

        <ol style={{position: "relative", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "28px 20px"}}>
          

          {(steps || []).map((s, index) => (
            <React.Fragment key={index}>
              

              <li className="rv" style={{display: "flex", flexDirection: "column", gap: "14px"}}>
                

                <span style={{width: "56px", height: "56px", borderRadius: "18px", background: "#121519", color: "#37E191", display: "grid", placeItems: "center", font: "500 14px 'DM Mono', monospace", boxShadow: "0 0 0 8px #FFFFFF"}}>
                  {s.n}
                </span>
                

                <p className="disp" style={{fontSize: "20px", fontWeight: "700", lineHeight: "1.15"}}>
                  {s.t}
                </p>
                

                <p style={{fontSize: "14px", lineHeight: "1.65", color: "#50575E"}}>
                  {s.d}
                </p>
                

              </li>
              

            </React.Fragment>
          ))}
          

        </ol>
        

      </div>
      

    </div>
    

  </section>
  

   {/* ================= QUALITY + CONFIDENTIALITY + SOFTWARE ================= */} 
  

  <section id="quality" style={{background: "#121519", color: "#E8EDF0", padding: "clamp(90px, 11vw, 150px) 0", overflow: "hidden"}}>
    

    <div className="wrap">
      

      <div className="rv" style={{maxWidth: "900px", marginBottom: "56px"}}>
        

        <p className="eyebrow" style={{color: "#37E191", marginBottom: "18px"}}>
          08 · Quality & confidentiality
        </p>
        

        <h2 className="disp" style={{fontSize: "clamp(36px, 4.8vw, 68px)", lineHeight: "1.02", fontWeight: "700", color: "#fff"}}>
          A file the next person 
          <span style={{color: "#37E191"}}>
            can actually use.
          </span>
        </h2>
        

      </div>
      

      <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px"}}>
        

        <div className="rv" style={{borderRadius: "32px", background: "#FFFFFF", color: "#121519", padding: "34px", display: "flex", flexDirection: "column", gap: "6px"}}>
          

          <p className="eyebrow" style={{color: "#0B7A44", marginBottom: "14px"}}>
            Review checklist
          </p>
          

          {(quality || []).map((q, index) => (
            <React.Fragment key={index}>
              

              <div style={{display: "flex", alignItems: "center", gap: "14px", minHeight: "54px", borderBottom: "1px dashed rgba(18,21,25,0.14)"}}>
                

                <span className="tick" style={{width: "26px", height: "26px", animation: `tk 9s ${q.delay} ease-in-out infinite`}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7.5"></path>
                  </svg>
                </span>
                

                <span style={{fontSize: "15px", fontWeight: "700"}}>
                  {q.t}
                </span>
                

              </div>
              

            </React.Fragment>
          ))}
          

        </div>
        

        <div className="rv" style={{borderRadius: "32px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", padding: "34px", display: "flex", flexDirection: "column", gap: "22px"}}>
          

          <div style={{display: "flex", alignItems: "center", gap: "16px"}}>
            

            <span style={{width: "64px", height: "64px", borderRadius: "20px", background: "#37E191", color: "#0A2418", display: "grid", placeItems: "center"}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4" y="10" width="16" height="11" rx="3"></rect>
                <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"></path>
              </svg>
            </span>
            

            <p className="disp" style={{fontSize: "24px", fontWeight: "700", lineHeight: "1.15", color: "#fff"}}>
              How we handle your financial information
            </p>
            

          </div>
          

          <ul style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px"}}>
            

            {(conf || []).map((c, index) => (
              <React.Fragment key={index}>
                

                <li style={{padding: "16px 18px", borderRadius: "16px", background: "rgba(255,255,255,0.05)", fontSize: "14px", lineHeight: "1.5", fontWeight: "600", color: "#E8EDF0"}}>
                  <span className="mono" style={{display: "block", fontSize: "11px", color: "#37E191", marginBottom: "6px"}}>
                    {c.n}
                  </span>
                  {c.t}
                </li>
                

              </React.Fragment>
            ))}
            

          </ul>
          

        </div>
        

      </div>
      

      <div className="rv" style={{marginTop: "20px", borderRadius: "32px", background: "#37E191", color: "#0A2418", padding: "clamp(26px, 3vw, 40px)", display: "flex", flexWrap: "wrap", gap: "24px 48px", alignItems: "center", overflow: "hidden"}}>
        

        <div style={{flex: "1 1 320px", minWidth: "0"}}>
          

          <p className="eyebrow" style={{marginBottom: "10px"}}>
            Software
          </p>
          

          <p className="disp" style={{fontSize: "clamp(26px, 2.6vw, 36px)", fontWeight: "700", lineHeight: "1.1"}}>
            We work inside your system — not around it.
          </p>
          

          <p style={{fontSize: "15px", lineHeight: "1.6", marginTop: "10px", fontWeight: "600"}}>
            QuickBooks-based assistance, plus other platforms as agreed per engagement. The platform supports the work; knowledge and review do the rest.
          </p>
          

        </div>
        

        <div aria-hidden="true" style={{flex: "1 1 420px", minWidth: "0", overflow: "hidden", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)", maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)"}}>
          

          <div className="mrq">
            

            <span className="disp" style={{fontSize: "30px", fontWeight: "700", whiteSpace: "nowrap"}}>
              QuickBooks
            </span>
            <span className="disp" style={{fontSize: "30px", fontWeight: "700", whiteSpace: "nowrap", opacity: ".5"}}>
              Chart of accounts
            </span>
            <span className="disp" style={{fontSize: "30px", fontWeight: "700", whiteSpace: "nowrap"}}>
              General ledger
            </span>
            <span className="disp" style={{fontSize: "30px", fontWeight: "700", whiteSpace: "nowrap", opacity: ".5"}}>
              Your workflow
            </span>
            

            <span className="disp" style={{fontSize: "30px", fontWeight: "700", whiteSpace: "nowrap"}}>
              QuickBooks
            </span>
            <span className="disp" style={{fontSize: "30px", fontWeight: "700", whiteSpace: "nowrap", opacity: ".5"}}>
              Chart of accounts
            </span>
            <span className="disp" style={{fontSize: "30px", fontWeight: "700", whiteSpace: "nowrap"}}>
              General ledger
            </span>
            <span className="disp" style={{fontSize: "30px", fontWeight: "700", whiteSpace: "nowrap", opacity: ".5"}}>
              Your workflow
            </span>
            

          </div>
          

        </div>
        

      </div>
      

    </div>
    

  </section>
  

   {/* ================= WHO WE WORK WITH — SLIDER ================= */} 
  

  <section id="who" style={{position: "relative", background: "#1B1F24", color: "#fff", padding: "clamp(90px, 11vw, 140px) 0", overflow: "hidden"}}>
    

    <div className="wrap">
      

      <div style={{display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "40px"}}>
        

        <div className="rv" style={{flex: "1 1 560px", minWidth: "0"}}>
          

          <p className="eyebrow" style={{color: "#37E191", marginBottom: "18px"}}>
            09 · Who we work with
          </p>
          

          <h2 className="disp" style={{fontSize: "clamp(36px, 4.6vw, 64px)", lineHeight: "1.02", fontWeight: "700"}}>
            Built for people 
            <span style={{color: "#37E191"}}>
              who'd rather run the business.
            </span>
          </h2>
          

        </div>
        

        <div style={{display: "flex", gap: "10px"}}>
          

          <button type="button" aria-label="Previous audience" onClick={whoPrev} style={{width: "56px", height: "56px", borderRadius: "18px", border: "1.5px solid rgba(255,255,255,0.25)", background: "transparent", color: "#fff", display: "grid", placeItems: "center", cursor: "pointer"}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6"></path>
            </svg>
          </button>
          

          <button type="button" aria-label="Next audience" onClick={whoNext} style={{width: "56px", height: "56px", borderRadius: "18px", border: "0", background: "#37E191", color: "#0A2418", display: "grid", placeItems: "center", cursor: "pointer"}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6"></path>
            </svg>
          </button>
          

        </div>
        

      </div>
      

      <div style={{overflow: "hidden", borderRadius: "36px"}} aria-live="polite">
        

        <div style={{display: "flex", transform: `translateX(-${whoX}%)`, transition: "transform .9s cubic-bezier(.7,0,.2,1)"}}>
          

          {(who || []).map((w, index) => (
            <React.Fragment key={index}>
              

              <article style={{flex: "0 0 100%", minHeight: "440px", padding: "clamp(28px, 4vw, 60px)", background: w.bg, color: w.fg, display: "flex", flexWrap: "wrap", gap: "32px 56px", alignItems: "flex-end", position: "relative", overflow: "hidden"}} aria-hidden={w.hidden}>
                

                <p aria-hidden="true" className="disp" style={{position: "absolute", right: "-10px", top: "-40px", fontSize: "clamp(180px, 22vw, 320px)", fontWeight: "800", lineHeight: "1", opacity: ".1", letterSpacing: "-.06em"}}>
                  {w.n}
                </p>
                

                <div style={{flex: "1 1 480px", minWidth: "0", position: "relative", display: "flex", flexDirection: "column", gap: "18px"}}>
                  

                  <span className="mono" style={{fontSize: "13px", opacity: ".8"}}>
                    {`${w.n} / 04`}
                  </span>
                  

                  <h3 className="disp" style={{fontSize: "clamp(32px, 4vw, 56px)", lineHeight: "1.02", fontWeight: "700"}}>
                    {w.t}
                  </h3>
                  

                  <p style={{fontSize: "17px", lineHeight: "1.7", maxWidth: "560px", opacity: ".88"}}>
                    {w.d}
                  </p>
                  

                </div>
                

                <div style={{flex: "1 1 280px", minWidth: "0", position: "relative", display: "flex", flexDirection: "column", gap: "10px"}}>
                  

                  {(w.needs || []).map((n, index) => (
                    <React.Fragment key={index}>
                      

                      <p style={{padding: "14px 18px", borderRadius: "14px", background: w.chip, fontSize: "14px", fontWeight: "800"}}>
                        {n}
                      </p>
                      

                    </React.Fragment>
                  ))}
                  

                </div>
                

              </article>
              

            </React.Fragment>
          ))}
          

        </div>
        

      </div>
      

      <div style={{display: "flex", gap: "4px", marginTop: "18px"}} role="group" aria-label="Choose audience">
        

        {(whoDots || []).map((d, index) => (
          <React.Fragment key={index}>
            

            <button type="button" className={d.cls} aria-label={d.label} aria-pressed={d.pressed} onClick={d.pick}>
              <span></span>
            </button>
            

          </React.Fragment>
        ))}
        

      </div>
      

    </div>
    

  </section>
  

   {/* ================= FAQ ================= */} 
  

  <section id="faq" style={{padding: "clamp(90px, 11vw, 150px) 0", background: "#FFFFFF"}}>
    

    <div className="wrap">
      

      <div className="rv" style={{maxWidth: "860px", marginBottom: "48px"}}>
        

        <p className="eyebrow" style={{color: "#0B7A44", marginBottom: "18px"}}>
          10 · Questions
        </p>
        

        <h2 className="disp" style={{fontSize: "clamp(36px, 4.8vw, 68px)", lineHeight: "1.02", fontWeight: "700"}}>
          Bookkeeping, 
          <span style={{color: "#0B7A44"}}>
            answered plainly.
          </span>
        </h2>
        

      </div>
      

      <div style={{display: "flex", flexWrap: "wrap", gap: "28px", alignItems: "flex-start"}}>
        

        <div style={{flex: "1 1 440px", minWidth: "0", display: "flex", flexDirection: "column", gap: "4px"}} role="tablist" aria-label="Frequently asked questions">
          

          {(faqs || []).map((f, index) => (
            <React.Fragment key={index}>
              

              <button type="button" role="tab" className={f.cls} aria-selected={f.sel} onClick={f.pick}>
                <span className="fqn">
                  {f.n}
                </span>
                <span>
                  {f.q}
                </span>
              </button>
              

            </React.Fragment>
          ))}
          

        </div>
        

        <div className="stick" role="tabpanel" style={{flex: "1 1 480px", minWidth: "0", position: "sticky", top: "110px", borderRadius: "32px", background: "#F2F5F3", padding: "clamp(28px, 3.4vw, 48px)", minHeight: "420px", display: "flex", flexDirection: "column", gap: "22px", overflow: "hidden"}}>
          

          <p aria-hidden="true" className="disp" style={{position: "absolute", right: "20px", top: "-30px", fontSize: "220px", fontWeight: "800", color: "#37E191", opacity: ".35", lineHeight: "1"}}>
            ?
          </p>
          

          <span className="mono" style={{position: "relative", fontSize: "13px", color: "#0B7A44"}}>
            {fq.n}
          </span>
          

          <h3 className="disp" style={{position: "relative", fontSize: "clamp(24px, 2.4vw, 32px)", lineHeight: "1.15", fontWeight: "700", maxWidth: "520px"}}>
            {fq.q}
          </h3>
          

          <p style={{position: "relative", fontSize: "17px", lineHeight: "1.75", color: "#3A4046"}}>
            {fq.a}
          </p>
          

          <div style={{flex: "1"}}></div>
          

          <a href="#start" className="b b-ink" style={{position: "relative", alignSelf: "flex-start", paddingRight: "10px"}}>
            Ask us something else
            <span className="ar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6"></path>
              </svg>
            </span>
          </a>
          

        </div>
        

      </div>
      

    </div>
    

  </section>
  

   {/* ================= FINAL CTA + FORM ================= */} 
  

  <section id="start" style={{position: "relative", background: "#121519", color: "#E8EDF0", padding: "clamp(90px, 11vw, 140px) 0", overflow: "hidden"}}>
    

    <div aria-hidden="true" className="ribbon" style={{width: "1400px", height: "170px", left: "-560px", bottom: "80px", background: "#37E191", opacity: ".9", animation: "drift1 18s ease-in-out infinite"}}></div>
    

    <div aria-hidden="true" className="ribbon" style={{width: "1400px", height: "60px", left: "-600px", bottom: "300px", border: "2px solid rgba(255,255,255,0.12)", animation: "drift2 22s ease-in-out infinite"}}></div>
    

    <div className="wrap" style={{position: "relative", display: "flex", flexWrap: "wrap", gap: "56px", alignItems: "flex-start"}}>
      

      <div style={{flex: "1 1 460px", minWidth: "0", display: "flex", flexDirection: "column", gap: "24px"}}>
        

        <p className="eyebrow rv" style={{color: "#37E191"}}>
          Start here
        </p>
        

        <h2 className="disp rv" style={{fontSize: "clamp(40px, 5vw, 72px)", lineHeight: "1.0", fontWeight: "700", color: "#fff"}}>
          Let's get your books 
          <span style={{color: "#37E191"}}>
            in balance.
          </span>
        </h2>
        

        <p className="rv" style={{fontSize: "17px", lineHeight: "1.7", color: "#AEB7BE", maxWidth: "520px"}}>
          Tell us your accounting software, how many bank and card accounts you run, and whether you need monthly support or help connected to tax preparation. We'll discuss scope and a practical working arrangement.
        </p>
        

        <ol className="rv" style={{display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px"}}>
          

          <li style={{display: "flex", gap: "14px", alignItems: "center", fontSize: "15px", fontWeight: "700", color: "#fff"}}>
            <span className="mono" style={{width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,255,255,0.08)", display: "grid", placeItems: "center", fontSize: "12px", color: "#37E191"}}>
              01
            </span>
            You share your requirement
          </li>
          

          <li style={{display: "flex", gap: "14px", alignItems: "center", fontSize: "15px", fontWeight: "700", color: "#fff"}}>
            <span className="mono" style={{width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,255,255,0.08)", display: "grid", placeItems: "center", fontSize: "12px", color: "#37E191"}}>
              02
            </span>
            We discuss scope, software & onboarding
          </li>
          

          <li style={{display: "flex", gap: "14px", alignItems: "center", fontSize: "15px", fontWeight: "700", color: "#fff"}}>
            <span className="mono" style={{width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,255,255,0.08)", display: "grid", placeItems: "center", fontSize: "12px", color: "#37E191"}}>
              03
            </span>
            We agree a secure channel for your records
          </li>
          

        </ol>
        

      </div>
      

      <form className="rv" style={{flex: "1 1 520px", minWidth: "0", borderRadius: "32px", background: "rgba(27,31,36,0.92)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", padding: "clamp(24px, 3vw, 40px)", display: "flex", flexDirection: "column", gap: "20px"}} onSubmit={onSubmit}>
        

        <fieldset style={{display: "flex", flexDirection: "column", gap: "10px"}}>
          

          <legend style={{fontSize: "13px", fontWeight: "700", color: "#C5CCD2", marginBottom: "10px"}}>
            I'm enquiring as
          </legend>
          

          <div style={{display: "flex", flexWrap: "wrap", gap: "8px"}}>
            

            {(formAud || []).map((a, index) => (
              <React.Fragment key={index}>
                

                <button type="button" className={a.cls} aria-pressed={a.pressed} onClick={a.pick}>
                  {a.label}
                </button>
                

              </React.Fragment>
            ))}
            

          </div>
          

        </fieldset>
        

        <fieldset style={{display: "flex", flexDirection: "column", gap: "10px"}}>
          

          <legend style={{fontSize: "13px", fontWeight: "700", color: "#C5CCD2", marginBottom: "10px"}}>
            Support needed (choose any)
          </legend>
          

          <div style={{display: "flex", flexWrap: "wrap", gap: "8px"}}>
            

            {(needs || []).map((n, index) => (
              <React.Fragment key={index}>
                

                <button type="button" className={n.cls} aria-pressed={n.pressed} onClick={n.pick}>
                  {n.label}
                </button>
                

              </React.Fragment>
            ))}
            

          </div>
          

        </fieldset>
        

        <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px"}}>
          

          <div className="fld">
            <label htmlFor="bk-name">
              Full name
            </label>
            <input id="bk-name" type="text" autocomplete="name" placeholder="Your name" />
          </div>
          

          <div className="fld">
            <label htmlFor="bk-email">
              Work email
            </label>
            <input id="bk-email" type="email" autocomplete="email" placeholder="you@company.com" />
          </div>
          

        </div>
        

        <div className="fld">
          <label htmlFor="bk-sw">
            Accounting software
          </label>
          

          <select id="bk-sw">
            <option>
              QuickBooks
            </option>
            <option>
              Other / not sure
            </option>
            <option>
              No software yet
            </option>
          </select>
        </div>
        

        <div className="fld">
          <label htmlFor="bk-msg">
            Tell us about your books
          </label>
          <textarea id="bk-msg" rows="4" placeholder="Number of bank and card accounts, how current your books are, and any deadlines"></textarea>
        </div>
        

        <p style={{display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: "1.55", color: "#AEB7BE"}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#37E191" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flex: "none", marginTop: "1px"}}>
            <rect x="4" y="10" width="16" height="11" rx="3"></rect>
            <path d="M8 10V7a4 4 0 0 1 8 0v3"></path>
          </svg>
          Please don't send bank statements or tax documents through this form — we'll agree a secure channel first.
        </p>
        

        <div style={{display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center"}}>
          

          <button type="submit" className="b b-mint" style={{paddingRight: "10px"}}>
            {submitLabel}
            <span className="ar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6"></path>
              </svg>
            </span>
          </button>
          

          {(sent) && (
            <>
              <p className="pop" role="status" style={{fontSize: "14px", fontWeight: "700", color: "#37E191"}}>
                Thanks — we'll be in touch to discuss your requirement.
              </p>
            </>
          )}
          

        </div>
        

      </form>
      

    </div>
    

  </section>
  

   {/* ================= FOOTER ================= */} 
  

  <footer style={{background: "#0D0F12", color: "#AEB7BE", padding: "56px 0 40px"}}>
    

    <div className="wrap" style={{display: "flex", flexWrap: "wrap", gap: "32px", justifyContent: "space-between", alignItems: "flex-start"}}>
      

      <div style={{display: "flex", flexDirection: "column", gap: "14px", maxWidth: "380px"}}>
        

        <img src="/bookkeeping-assets/ba182925-a38c-497a-bc97-3263f95171dc.png" alt="Smart Tax Experts logo" style={{height: "44px", width: "auto", alignSelf: "flex-start"}} />
        

        <p style={{fontSize: "14px", lineHeight: "1.6"}}>
          US Tax Preparation • Bookkeeping • Accounting Support • CPA Outsourcing
        </p>
        

        <p className="disp" style={{fontSize: "16px", color: "#fff", fontWeight: "600"}}>
          Clear processes. Organised work. Professional support.
        </p>
        

      </div>
      

      <nav aria-label="Footer" style={{display: "grid", gridTemplateColumns: "repeat(2, minmax(0, auto))", gap: "4px 40px"}}>
        

        <a className="nl" href="#services">
          Bookkeeping services
        </a>
        

        <a className="nl" href="#payroll">
          Payroll accounting
        </a>
        

        <a className="nl" href="#reports">
          Financial reporting
        </a>
        

        <a className="nl" href="#models">
          CPA firm support
        </a>
        

        <a className="nl" href="#faq">
          FAQ
        </a>
        

        <a className="nl" href="#start">
          Contact us
        </a>
        

      </nav>
      

    </div>
    

    <div className="wrap" style={{marginTop: "40px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", flexWrap: "wrap", gap: "12px 24px", justifyContent: "space-between", fontSize: "12px", lineHeight: "1.6"}}>
      

      <p>
        © Smart Tax Expertss. Marketing information only — not tax or legal advice.
      </p>
      

      <p>
        <a href="#top" style={{color: "#AEB7BE"}}>
          Privacy policy
        </a>
         · 
        <a href="#top" style={{color: "#AEB7BE"}}>
          Terms
        </a>
      </p>
      

    </div>
    

  </footer>
  

</div>
      </>
    );
  }

}

export default BookkeepingPage;
