import React from 'react';
import BackToServices from '../../components/navigation/BackToServices';
import ScrollNavigation from '../../components/navigation/ScrollNavigation';


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

var ACC_LIGHT = { "#17694F": "#86D9B5", "#1F4FB8": "#A9C1FF", "#6B3FA0": "#D2B8F5", "#9A4A12": "#F4B886" };
var HZ_DARK = { "#E3A33B": "#8F5A0B", "#E5866A": "#A0432A", "#6FB1F2": "#1F5F9E", "#D8C04A": "#7A6A10" };

var MARQ = ["Income projections", "Estimated tax review", "Withholding review", "Retirement contribution planning", "Entity & compensation review", "Depreciation & Section 179", "Capital gains timing", "Year-end tax review"];

var MONTHS = [
  { ab: "Jan", n: "January", q: "Q1", date: "Jan 15", who: "Individuals · Business owners", t: "Close last year, set this year's baseline", d: "The final estimated payment for the previous tax year generally falls in mid-January. It's also the right moment to set a first projection for the year ahead.", acts: ["Confirm last year's final estimated payment", "Note expected changes in income, family or business", "Set a baseline projection for the new year"] },
  { ab: "Feb", n: "February", q: "Q1", date: "", who: "Individuals · Business owners", t: "Organise records while they're fresh", d: "Forms and statements start arriving. Organising them now supports last year's return and gives this year's planning a clean starting point.", acts: ["Gather W-2s, 1099s and brokerage statements", "Compare last year's outcome with expectations", "Flag anything that surprised you"] },
  { ab: "Mar", n: "March", q: "Q1", date: "Mar 15", who: "Business owners", t: "Check structure and compensation", d: "Many partnership and S corporation returns are due in March for calendar-year entities — a natural moment to ask whether the current structure and owner compensation still fit.", acts: ["Review entity and compensation arrangements", "Raise classification questions early", "Check payroll and reasonable compensation"] },
  { ab: "Apr", n: "April", q: "Q2", date: "Apr 15", who: "Individuals · Business owners", t: "First quarterly estimate", d: "Individual returns and the first estimated payment for the current year are generally due in mid-April. Last year's filed figures sharpen this year's projection.", acts: ["Review the first estimated payment", "Update the projection with the filed return", "Revisit withholding if the balance due was large"] },
  { ab: "May", n: "May", q: "Q2", date: "", who: "Individuals", t: "Check withholding", d: "If your job, income or household changed, withholding set at the start of the year may no longer fit what you're likely to owe.", acts: ["Compare year-to-date withholding with the projection", "Consider withholding adjustments where needed", "Review side income and self-employment earnings"] },
  { ab: "Jun", n: "June", q: "Q2", date: "Jun 15", who: "Individuals · Business owners", t: "Mid-year projection", d: "The second estimated payment generally falls in mid-June. Half a year of actual figures makes the projection far more useful.", acts: ["Re-run the projection with half-year actuals", "Review the second estimated payment", "Spot issues while there's time to act"] },
  { ab: "Jul", n: "July", q: "Q3", date: "", who: "Business owners", t: "Plan purchases and growth", d: "Equipment, hiring and expansion can carry different tax consequences. Evaluate timing and treatment before committing to the transaction.", acts: ["Review planned asset and equipment purchases", "Consider hiring and multi-state implications", "Check documentation for business expenses"] },
  { ab: "Aug", n: "August", q: "Q3", date: "", who: "Individuals · Business owners", t: "Review retirement contributions", d: "Retirement plan options and contribution limits depend on the plan and your circumstances. Reviewing them mid-year leaves room to adjust.", acts: ["Review eligible retirement plan options", "Check contributions against applicable limits", "Align contributions with cash flow"] },
  { ab: "Sep", n: "September", q: "Q3", date: "Sep 15", who: "Individuals · Business owners", t: "Q3 estimate and projection refresh", d: "The third estimated payment and many extended business returns fall in mid-September. Three quarters of data make the year-end picture clearer.", acts: ["Review the third estimated payment", "Refresh the projection", "Start the list of year-end decisions"] },
  { ab: "Oct", n: "October", q: "Q4", date: "Oct 15", who: "Individuals · Business owners", t: "Open the year-end window", d: "Extended individual returns are generally due in mid-October. With last year closed, attention turns fully to this year's remaining decisions.", acts: ["Finalise any extended returns", "Prioritise open year-end items", "Review investment gains and losses so far"] },
  { ab: "Nov", n: "November", q: "Q4", date: "", who: "Individuals · Business owners", t: "Make year-end decisions", d: "Capital gains, asset purchases and compensation decisions are easier to evaluate while there's still time left in the year.", acts: ["Review potential gains, losses and disposals", "Evaluate qualifying asset purchases", "Confirm compensation and payroll decisions"] },
  { ab: "Dec", n: "December", q: "Q4", date: "", who: "Individuals · Business owners", t: "Before the year closes", d: "Many planning actions must be completed by December 31. The year-end review turns the open list into decisions.", acts: ["Complete the year-end review", "Confirm actions that must happen by Dec 31", "Prepare records for filing season"] }
];

var WHY = [
  { g: "≈", t: "Understand what you may owe before the deadline", d: "A projection estimates your potential liability from the information available, so you can consider estimated payments or withholding adjustments in time." },
  { g: "+", t: "Find deductions and credits you may be eligible for", d: "Many have eligibility conditions, income limits, documentation rules or deadlines. Reviewing them during the year helps keep eligible opportunities from being missed." },
  { g: "⇄", t: "Make better decisions about business expenses", d: "Equipment, employee costs and retirement contributions carry different financial and tax consequences. Planning tests the timing and treatment before you commit." },
  { g: "!", t: "Avoid unnecessary surprises at tax time", d: "Changes in income, investment gains, self-employment earnings and profitability all move the amount due. Regular reviews surface issues earlier." },
  { g: "∿", t: "Manage cash flow with fewer shocks", d: "Tax payments are part of financial planning. Knowing what's coming lets you prepare, instead of treating tax as an unexpected expense." },
  { g: "↗", t: "Prepare for business growth", d: "Hiring, operating in another state, buying assets or changing tax classification create new responsibilities. Planning lets you consider them in advance." }
];
var WHY_STY = [
  { bg: "#0C1A22", fg: "#F3EFE6", ia: "HZ" }, { bg: "#FFFDF8", fg: "#0C1A22", ia: "ACC" }, { bg: "ACC", fg: "#FFFFFF", ia: "HZ" },
  { bg: "#E2D9C7", fg: "#0C1A22", ia: "ACC" }, { bg: "#0C1A22", fg: "#F3EFE6", ia: "HZ" }, { bg: "HZ", fg: "#0C1A22", ia: "#FFFFFF" }
];

var RATES = [10, 12, 22, 24, 32, 35, 37];
var CF_M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
var CF_PLAN = { 3: 1, 5: 1, 8: 1, 12: 1 };

var COVERS = [
  { t: "Income & tax liability projections", aud: ["ind", "biz"], d: "Reviewing available income, expenses, deductions, credits and payments to estimate your potential federal and, where applicable, state tax position.", q: "Where do I stand right now — and where am I heading?" },
  { t: "Business entity & compensation review", aud: ["biz"], d: "Considering whether the current structure and compensation arrangements still fit. For example, an eligible business may evaluate whether an S corporation election makes financial sense after reasonable compensation, payroll costs and compliance are considered.", q: "Is our structure still the right one for how we earn?" },
  { t: "Deduction & credit review", aud: ["ind", "biz"], d: "Identifying potentially applicable deductions and credits, and checking the requirements, limitations and supporting documentation each one needs.", q: "What might I qualify for, and can I support it?" },
  { t: "Retirement contribution planning", aud: ["ind", "biz"], d: "Reviewing eligible retirement plan options and contribution opportunities, taking account of your circumstances and the applicable limits.", q: "How much should go into retirement this year?" },
  { t: "Depreciation & asset purchase planning", aud: ["biz"], d: "Evaluating the tax treatment of qualifying business assets, including depreciation methods, Section 179 and bonus depreciation where applicable.", q: "When — and how — should we buy that equipment?" },
  { t: "Estimated tax & withholding review", aud: ["ind", "biz"], d: "Considering whether current federal withholding or estimated payments are sufficient given expected income and the applicable payment rules.", q: "Am I paying enough, often enough?" },
  { t: "Capital gains & investment planning", aud: ["ind"], d: "Reviewing potential gains, losses, investment disposals and the relevant tax rules before a transaction is completed.", q: "What happens to my tax if I sell this?" },
  { t: "Year-end tax review", aud: ["ind", "biz"], d: "Reviewing the year's financial position, identifying unresolved items and preparing a list of relevant actions before the tax year closes.", q: "What still needs deciding before December 31?" }
];
var COV_AUDS = [{ id: "all", t: "Everything" }, { id: "ind", t: "Individuals" }, { id: "biz", t: "Business owners" }];

var LOOP = [
  { k: "Understand", t: "Understand your situation", d: "We start with what you're planning for — individual tax, business decisions, or both — and the changes you expect this year.", out: ["Goals & changes", "Scope agreed"] },
  { k: "Review", t: "Review the information", d: "Prior-year returns, year-to-date records and financial statements relevant to the agreed scope. Missing details are identified for clarification.", out: ["Documents reviewed", "Open questions listed"] },
  { k: "Project", t: "Project the tax position", d: "Income, deductions, credits and payments are organised into a projection of your potential federal and, where applicable, state position.", out: ["Liability projection", "Payment check"] },
  { k: "Evaluate", t: "Evaluate the options", d: "Timing, contributions, purchases, payments and structure are considered against the overall financial outcome — not just the deduction.", out: ["Options compared", "Trade-offs explained"] },
  { k: "Act", t: "Agree actions and communicate", d: "You get the agreed actions, outstanding items and next steps in a clear format, with the deadlines that matter.", out: ["Action list", "Key dates"] },
  { k: "Revisit", t: "Revisit as the year moves", d: "For ongoing engagements we review relevant financial changes through the year and refresh the plan when something shifts.", out: ["Quarterly refresh", "Year-end review"] }
];

var WHO = [
  { t: "Individuals & families", d: "For people who want to understand their US tax obligations, organise income information and review relevant deductions, credits and planning opportunities.", qs: ["Will my withholding cover this year's tax?", "How would selling these shares affect my tax?", "Which credits might apply to my family?"], cta: "Book a planning review", href: "#contact" },
  { t: "Self-employed professionals", d: "For freelancers, independent contractors, consultants and sole proprietors managing business income, expenses and self-employment tax considerations.", qs: ["How much should I set aside for estimated tax?", "Which expenses are deductible — and documented?", "How does self-employment tax affect me?"], cta: "Plan my estimated taxes", href: "#contact" },
  { t: "Small & growing businesses", d: "For companies that need organised books, a clear view of their tax position and help evaluating decisions as they grow.", qs: ["Should we evaluate an S corporation election?", "When should we buy new equipment?", "What changes if we hire or expand to another state?"], cta: "Plan our business taxes", href: "#contact" },
  { t: "Established businesses", d: "For organisations that need structured, recurring tax planning alongside dependable financial records and reporting.", qs: ["What's our projected liability this year?", "How do owner compensation and payroll interact?", "Which year-end actions are still open?"], cta: "Discuss year-round planning", href: "#contact" },
  { t: "CPA & accounting firms", d: "For practices that need preparation and bookkeeping capacity behind their own client work, following the firm's processes and review standards.", qs: ["Can your team follow our checklists and software?", "Can you prepare supporting schedules for our review?", "Does sign-off stay with our firm?"], cta: "Explore CPA outsourcing", href: "#contact" }
];
var WHO_STY = [
  { bg: "#0C1A22", fg: "#F3EFE6", qbg: "rgba(255,255,255,0.07)", btn: "btn btn-hz" },
  { bg: "HZ", fg: "#0C1A22", qbg: "rgba(255,255,255,0.4)", btn: "btn btn-ink" },
  { bg: "ACC", fg: "#FFFFFF", qbg: "rgba(255,255,255,0.12)", btn: "btn btn-hz" },
  { bg: "#E2D9C7", fg: "#0C1A22", qbg: "rgba(255,255,255,0.55)", btn: "btn btn-ink" },
  { bg: "#1D3340", fg: "#F3EFE6", qbg: "rgba(255,255,255,0.07)", btn: "btn btn-hz" }
];

var FAQ = [
  { c: "basics", q: "What is the difference between tax planning and tax preparation?", a: "Tax preparation organises financial information and prepares the required return for a completed tax year. Tax planning looks ahead, evaluating how decisions about income, expenses, investments and business activity may affect future tax obligations." },
  { c: "basics", q: "When should tax planning happen?", a: "Planning is most useful throughout the year, not just before the deadline. Depending on the engagement, we review available information, prepare projections and identify potential actions before the relevant tax-year deadlines. Ongoing engagements follow an agreed monthly, quarterly or annual cycle." },
  { c: "basics", q: "Can you guarantee a tax refund or a particular amount of tax savings?", a: "No. No responsible tax professional should guarantee a refund or saving without reviewing your full circumstances — and even then, the outcome depends on applicable law and verified information. Our focus is accurate work and legitimate opportunities supported by the facts and tax rules." },
  { c: "basics", q: "Does claiming more deductions always reduce my tax?", a: "Not by the full amount. A deduction's effect depends on your circumstances, applicable rates, limitations and other rules, and spending money purely to obtain a deduction doesn't necessarily improve your financial results. We look at the overall outcome." },
  { c: "basics", q: "Does tax planning cover state taxes?", a: "We can consider federal and applicable state tax within the agreed scope. State obligations depend on factors such as residency, business activities, income sources and state-specific rules." },
  { c: "basics", q: "What documents are needed to start?", a: "It depends on the scope. Individuals typically share prior-year returns, recent pay statements, 1099s, investment statements and details of expected changes. Businesses typically share year-to-date financial statements, payroll information, planned purchases and previous returns." },
  { c: "ind", q: "What does a tax projection show?", a: "A projection estimates your potential tax liability using the financial information available at that time. It can identify a possible balance due and help you consider estimated payments or withholding adjustments." },
  { c: "ind", q: "Can planning help with estimated tax payments?", a: "Yes. We consider whether your current withholding or estimated payments look sufficient in light of expected income and the applicable payment rules, and flag where an adjustment may be worth discussing." },
  { c: "biz", q: "Why is tax planning important for a small business?", a: "It helps owners understand potential liabilities, review eligible deductions and credits, consider estimated payments and evaluate the tax implications of decisions — which can help prevent unexpected tax obligations." },
  { c: "biz", q: "Should my business consider an S corporation election?", a: "It depends. An eligible business may evaluate whether an S corporation election makes financial sense after considering reasonable compensation, payroll costs, compliance requirements and other factors. We review this as part of an entity and compensation review." },
  { c: "biz", q: "Can you plan around equipment and asset purchases?", a: "Yes. We evaluate the tax treatment of qualifying business assets — including depreciation methods, Section 179 and bonus depreciation where applicable — before the purchase is made." }
];
var FAQ_CATS = [{ id: "all", t: "All" }, { id: "basics", t: "Planning basics" }, { id: "ind", t: "Individuals" }, { id: "biz", t: "Business" }];
var FAQ_TAG = { basics: "BASICS", ind: "INDIVIDUAL", biz: "BUSINESS" };

var CHECKS = ["My income changed significantly this year", "I'm self-employed or own a business", "I had an unexpected balance due last year", "I'm planning a large purchase, sale or investment", "My family or filing situation changed", "I'm considering changing my business structure"];
var SIGS = [
  { t: "Start with a year-end review", d: "No strong signals yet. A review before December 31 helps keep it that way." },
  { t: "A mid-year projection is worth it", d: "One or two changes can move your tax position. A projection shows where you stand." },
  { t: "Year-round planning makes sense", d: "Several moving parts. Regular reviews help you act before decisions are locked in." },
  { t: "Let's talk soon", d: "A lot is changing at once — the earlier we look, the more options are still open." }
];
var WHOAM = [
  { id: "ind", t: "An individual", ph: "e.g. new job mid-year, sold some shares, expecting a child", sub: "Book My Planning Review" },
  { id: "self", t: "Self-employed", ph: "e.g. freelance income up this year, unsure about estimated payments", sub: "Plan My Estimated Taxes" },
  { id: "biz", t: "A business owner", ph: "e.g. buying equipment, hiring, reviewing owner compensation", sub: "Plan Our Business Taxes" }
];
var WHEN = [{ id: "now", t: "Right away" }, { id: "ye", t: "Before year-end" }, { id: "next", t: "Next tax year" }];

var NOW = new Date().getMonth();
var DEF = { mode: "ind", split: 50, cmpAnim: false, mon: NOW, why: 0, whyAuto: true, ded: 10000, rate: 24, cfTax: 24000, cfMode: "plan", cov: 0, covAud: "all", step: 0, who: 0, cat: "all", q: "", fq: 0, checks: [false, false, false, false, false, false], whoAm: "ind", when: "now", sent: false };

function pad(n) { return n < 10 ? "0" + n : "" + n; }
function usd(n) { return "$" + Math.round(n).toLocaleString("en-US"); }
function usdK(n) { return n >= 1000 ? "$" + (Math.round(n / 100) / 10).toString().replace(/\\.0$/, "") + "k" : "$" + Math.round(n); }

class TaxPlanningPage extends React.Component {
  s() { return Object.assign({}, DEF, this.state || {}); }
  componentDidMount() {
    var self = this;
    this._t = setInterval(function () {
      var s = self.s();
      if (s.whyAuto) self.setState({ why: (s.why + 1) % WHY.length });
    }, 6000);
  }
  componentWillUnmount() { clearInterval(this._t); }

  renderVals() {
    var self = this;
    var s = this.s();
    var accent = this.props.accent ?? "#17694F";
    var horizon = this.props.horizon ?? "#E3A33B";
    var animOn = this.props.animations ?? true;
    var isInd = s.mode === "ind";

    function col(v) { return v === "ACC" ? accent : (v === "HZ" ? horizon : v); }

    /* compare */
    var cmpPick = function (v) { return function () { self.setState({ split: v, cmpAnim: true }); }; };

    /* dial */
    var parts = [];
    for (var i = 0; i < 12; i++) {
      var a0 = i * 30;
      var c = i === s.mon ? accent : (MONTHS[i].date ? "rgba(12,26,34,0.24)" : "rgba(12,26,34,0.11)");
      parts.push("transparent " + a0 + "deg " + (a0 + 1.2) + "deg");
      parts.push(c + " " + (a0 + 1.2) + "deg " + (a0 + 28.8) + "deg");
      parts.push("transparent " + (a0 + 28.8) + "deg " + (a0 + 30) + "deg");
    }
    var months = MONTHS.map(function (m, i) {
      var th = (i * 30 + 15) * Math.PI / 180;
      var cls = "mbtn" + (i === s.mon ? " on" : "") + (i === NOW ? " now" : "");
      return {
        ab: m.ab, n: m.n, date: !!m.date, cls: cls, sel: i === s.mon ? "true" : "false",
        x: (50 + 41.5 * Math.sin(th)).toFixed(2), y: (50 - 41.5 * Math.cos(th)).toFixed(2),
        dx: (50 + 50 * Math.sin(th)).toFixed(2), dy: (50 - 50 * Math.cos(th)).toFixed(2),
        pick: function () { self.setState({ mon: i }); }
      };
    });
    var cm = MONTHS[s.mon];
    var curMonth = Object.assign({}, cm, { num: pad(s.mon + 1), isNow: s.mon === NOW });

    /* why carousel */
    var why = WHY.map(function (w, i) {
      var st = WHY_STY[i];
      return Object.assign({}, w, {
        n: pad(i + 1), bg: col(st.bg), fg: st.fg, ia: col(st.ia),
        i1: i === 0, i2: i === 1, i3: i === 2, i4: i === 3, i5: i === 4, i6: i === 5,
        op: i < s.why ? "0.35" : "1",
        active: i === s.why, past: i < s.why, sel: i === s.why ? "true" : "false",
        pick: function () { self.setState({ why: i, whyAuto: false }); }
      });
    });

    /* deduction lab */
    var eff = s.ded * s.rate / 100;
    var rates = RATES.map(function (r) {
      var on = r === s.rate;
      return {
        r: r, cls: on ? "pill-d on" : "pill-d", sel: on ? "true" : "false",
        h: (r / 37 * 100).toFixed(1), amt: usdK(s.ded * r / 100),
        bg: on ? accent : "rgba(12,26,34,0.14)", lc: on ? "#0C1A22" : "#4F5B60",
        pick: function () { self.setState({ rate: r }); }
      };
    });

    /* cash flow */
    var planned = s.cfMode === "plan";
    var cfBars = CF_M.map(function (m, i) {
      var amt = planned ? (CF_PLAN[i] ? s.cfTax / 4 : 0) : (i === 15 ? s.cfTax : 0);
      return {
        m: m, has: amt > 0, amt: usdK(amt),
        h: amt > 0 ? (amt / s.cfTax * 100).toFixed(1) : "1.5",
        bg: amt > 0 ? (planned ? accent : "repeating-linear-gradient(135deg, " + horizon + " 0 8px, #F0C47A 8px 16px)") : "rgba(12,26,34,0.08)",
        lc: i >= 12 ? "#0C1A22" : "#4F5B60"
      };
    });

    /* covers */
    var covers = COVERS.map(function (c, i) {
      var open = i === s.cov;
      var match = s.covAud === "all" || c.aud.indexOf(s.covAud) >= 0;
      return {
        n: pad(i + 1), t: c.t, d: c.d, q: c.q, open: open,
        tags: c.aud.map(function (x) { return x === "ind" ? "INDIVIDUALS" : "BUSINESS"; }).join(" · "),
        op: match ? "1" : "0.28", exp: open ? "true" : "false", pid: "cov-" + i,
        icCls: open ? "idx-ic open" : "idx-ic",
        toggle: function () { self.setState({ cov: open ? -1 : i }); }
      };
    });
    var covAuds = COV_AUDS.map(function (a) {
      var on = a.id === s.covAud;
      return { t: a.t, cls: on ? "pill on" : "pill", sel: on ? "true" : "false", pick: function () { self.setState({ covAud: a.id }); } };
    });

    /* loop */
    var loop = LOOP.map(function (p, i) {
      var th = i * 60 * Math.PI / 180;
      return Object.assign({}, p, {
        n: pad(i + 1), x: (50 + 50 * Math.sin(th)).toFixed(2), y: (50 - 50 * Math.cos(th)).toFixed(2),
        cls: i === s.step ? "node on" : (i < s.step ? "node done" : "node"),
        sel: i === s.step ? "true" : "false",
        pick: function () { self.setState({ step: i }); }
      });
    });
    var curStep = Object.assign({}, LOOP[s.step], { n: pad(s.step + 1) });

    /* who */
    var who = WHO.map(function (p, i) {
      var on = i === s.who, st = WHO_STY[i];
      return Object.assign({}, p, {
        n: pad(i + 1), active: on, closed: !on,
        flex: on ? "5 1 0%" : "1 1 0%", pcls: on ? "who-p act" : "who-p",
        bg: col(st.bg), fg: st.fg, qbg: st.qbg, btn: st.btn,
        pick: function () { self.setState({ who: i }); }
      });
    });

    /* faq */
    var ql = (s.q || "").toLowerCase().trim();
    var list = [];
    FAQ.forEach(function (f, i) {
      if (s.cat !== "all" && f.c !== s.cat) return;
      if (ql && (f.q + " " + f.a).toLowerCase().indexOf(ql) < 0) return;
      var open = i === s.fq;
      list.push({
        q: f.q, a: f.a, tag: FAQ_TAG[f.c], open: open, exp: open ? "true" : "false", pid: "faq-" + i,
        icCls: open ? "faq-ic open" : "faq-ic",
        sh: open ? "0 24px 50px -30px rgba(12,26,34,0.35)" : "none",
        toggle: function () { self.setState({ fq: open ? -1 : i }); }
      });
    });
    var faqCats = FAQ_CATS.map(function (c) {
      var on = c.id === s.cat;
      return { t: c.t, cls: on ? "pill on" : "pill", sel: on ? "true" : "false", pick: function () { self.setState({ cat: c.id }); } };
    });

    /* signal check */
    var score = s.checks.filter(Boolean).length;
    var sig = score === 0 ? SIGS[0] : (score <= 2 ? SIGS[1] : (score <= 4 ? SIGS[2] : SIGS[3]));
    var checks = CHECKS.map(function (t, i) {
      var on = !!s.checks[i];
      return {
        t: t, cls: on ? "chk on" : "chk", sel: on ? "true" : "false",
        toggle: function () { var arr = self.s().checks.slice(); arr[i] = !arr[i]; self.setState({ checks: arr }); }
      };
    });
    var curWho = WHOAM[0];
    var whoAm = WHOAM.map(function (w) {
      var on = w.id === s.whoAm;
      if (on) curWho = w;
      return { t: w.t, cls: on ? "pill on" : "pill", sel: on ? "true" : "false", pick: function () { self.setState({ whoAm: w.id }); } };
    });
    var whenOpts = WHEN.map(function (w) {
      var on = w.id === s.when;
      return { t: w.t, cls: on ? "pill on" : "pill", sel: on ? "true" : "false", pick: function () { self.setState({ when: w.id }); } };
    });

    return {
      accent: accent, accentLight: ACC_LIGHT[accent] || "#86D9B5",
      horizon: horizon, horizonDark: HZ_DARK[horizon] || "#8F5A0B",
      animCls: animOn ? "" : "anim-off",

      modeInd: isInd, modeBiz: !isInd,
      segInd: isInd ? "seg on" : "seg", segBiz: isInd ? "seg" : "seg on",
      pressInd: isInd ? "true" : "false", pressBiz: isInd ? "false" : "true",
      toInd: function () { self.setState({ mode: "ind" }); },
      toBiz: function () { self.setState({ mode: "biz" }); },
      marquee: MARQ.concat(MARQ),

      split: s.split,
      cmpEase: s.cmpAnim ? ".8s cubic-bezier(.2,.7,.2,1)" : "0s",
      setSplit: function (e) { self.setState({ split: Number(e.target.value), cmpAnim: false }); },
      cmpPrep: cmpPick(92), cmpMid: cmpPick(50), cmpPlan: cmpPick(8),
      cmpPrepCls: s.split >= 80 ? "pill on" : "pill",
      cmpMidCls: s.split > 20 && s.split < 80 ? "pill on" : "pill",
      cmpPlanCls: s.split <= 20 ? "pill on" : "pill",

      dialBg: "conic-gradient(" + parts.join(", ") + ")",
      months: months, curMonth: curMonth,
      prevMonth: function () { self.setState({ mon: (self.s().mon + 11) % 12 }); },
      nextMonth: function () { self.setState({ mon: (self.s().mon + 1) % 12 }); },
      toNow: function () { self.setState({ mon: NOW }); },

      why: why,
      whyShift: "translateX(calc(" + (-s.why) + " * (min(400px, 84%) + 20px)))",
      whyDur: s.whyAuto ? "6s" : "0.4s",
      whyAutoLabel: s.whyAuto ? "Pause" : "Autoplay",
      whyAutoPressed: s.whyAuto ? "true" : "false",
      toggleWhyAuto: function () { self.setState({ whyAuto: !self.s().whyAuto }); },
      prevWhy: function () { var c = self.s(); self.setState({ why: (c.why + WHY.length - 1) % WHY.length, whyAuto: false }); },
      nextWhy: function () { var c = self.s(); self.setState({ why: (c.why + 1) % WHY.length, whyAuto: false }); },

      ded: s.ded, rate: s.rate, outRate: 100 - s.rate,
      coinScale: (0.6 + s.rate / 37 * 0.9).toFixed(2),
      dedFmt: usd(s.ded), effFmt: usd(eff), outFmt: usd(s.ded - eff),
      setDed: function (e) { self.setState({ ded: Number(e.target.value) }); },
      rates: rates,
      dedLabel: "Of a " + usd(s.ded) + " deductible expense at a " + s.rate + "% rate, about " + usd(eff) + " is the federal tax effect and " + usd(s.ded - eff) + " remains out of pocket.",

      cfTax: s.cfTax, cfFmt: usd(s.cfTax), cfBars: cfBars,
      cfPlanned: planned, cfLump: !planned, cfQuarter: usd(s.cfTax / 4),
      setCf: function (e) { self.setState({ cfTax: Number(e.target.value) }); },
      cfPlanCls: planned ? "pill on" : "pill", cfLumpCls: planned ? "pill" : "pill on",
      cfPlanPressed: planned ? "true" : "false", cfLumpPressed: planned ? "false" : "true",
      cfToPlan: function () { self.setState({ cfMode: "plan" }); },
      cfToLump: function () { self.setState({ cfMode: "lump" }); },
      cfMax: usd(planned ? s.cfTax / 4 : s.cfTax),
      cfCount: planned ? "4" : "1",
      cfSee: planned ? "Early in the year" : "At filing",
      cfLabel: planned ? "Four planned payments of " + usd(s.cfTax / 4) + " in April, June, September and the following January." : "One payment of " + usd(s.cfTax) + " at filing in the following April.",

      covers: covers, covAuds: covAuds,

      loop: loop, curStep: curStep,
      loopDeg: ((s.step + 1) / LOOP.length * 360).toFixed(1),
      prevStep: function () { self.setState({ step: (self.s().step + LOOP.length - 1) % LOOP.length }); },
      nextStep: function () { self.setState({ step: (self.s().step + 1) % LOOP.length }); },

      who: who,

      q: s.q, setQ: function (e) { self.setState({ q: e.target.value }); },
      faqs: list, faqCats: faqCats, faqEmpty: list.length === 0,
      faqCount: "Showing " + list.length + " of " + FAQ.length,

      checks: checks, score: score, sig: sig,
      moodCalm: score === 0, moodThink: score > 0 && score <= 2, moodAlert: score > 2,
      gaugeDeg: (score / 6 * 180).toFixed(1),
      needleDeg: (-90 + score / 6 * 180).toFixed(1),
      whoAm: whoAm, whenOpts: whenOpts,
      msgPh: curWho.ph, submitLabel: curWho.sub,
      sent: s.sent, notSent: !s.sent,
      submit: function (e) { if (e && e.preventDefault) e.preventDefault(); self.setState({ sent: true }); },
      reset: function () { self.setState({ sent: false }); }
    };
  }

  render() {
    const v = this.renderVals();
    return (
      <>
        <ScrollNavigation />




        <link rel="preconnect" href="https://fonts.googleapis.com" />


        <style>{"/* latin-ext */\n@font-face {\n  font-family: 'Instrument Serif';\n  font-style: italic;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/instrumentserif/v5/jizHRFtNs2ka5fXjeivQ4LroWlx-6zAjgn7MsNo.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Instrument Serif';\n  font-style: italic;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/ec9030dd-6444-48f1-905b-cd0db85bd970\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Instrument Serif';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-6zsTjmbI.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Instrument Serif';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-6zUTjg.woff2) format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsK8ah8QA.woff2) format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsD8ah8QA.woff2) format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsL8ah8QA.woff2) format('woff2');\n  unicode-range: U+1F00-1FFF;\n}\n/* greek */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsE8ah8QA.woff2) format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsI8ah8QA.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsJ8ah8QA.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/8a8f8ab4-a84c-42fa-966b-84806416a6dd\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsK8ah8QA.woff2) format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsD8ah8QA.woff2) format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsL8ah8QA.woff2) format('woff2');\n  unicode-range: U+1F00-1FFF;\n}\n/* greek */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsE8ah8QA.woff2) format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsI8ah8QA.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsJ8ah8QA.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/8a8f8ab4-a84c-42fa-966b-84806416a6dd\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsK8ah8QA.woff2) format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsD8ah8QA.woff2) format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsL8ah8QA.woff2) format('woff2');\n  unicode-range: U+1F00-1FFF;\n}\n/* greek */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsE8ah8QA.woff2) format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsI8ah8QA.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsJ8ah8QA.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(\"/page-assets/8a8f8ab4-a84c-42fa-966b-84806416a6dd\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsK8ah8QA.woff2) format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsD8ah8QA.woff2) format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsL8ah8QA.woff2) format('woff2');\n  unicode-range: U+1F00-1FFF;\n}\n/* greek */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsE8ah8QA.woff2) format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsI8ah8QA.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsJ8ah8QA.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(\"/page-assets/8a8f8ab4-a84c-42fa-966b-84806416a6dd\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/ed35b871-4bce-46d9-b17a-dd4ab5e59f8c\") format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/98887c4f-4cc4-4926-bb46-fe2ff298e4e8\") format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/080f18be-ad4e-4d6c-98d0-bd05abb31303\") format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/a43547b8-ce06-49fa-84b3-be5fcbc6e32d\") format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/402d3988-77bc-4611-b365-1da433c5f5ec\") format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/8e584030-7dd1-49cf-a40a-c28cfeffdc6b\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/ed35b871-4bce-46d9-b17a-dd4ab5e59f8c\") format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/98887c4f-4cc4-4926-bb46-fe2ff298e4e8\") format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/080f18be-ad4e-4d6c-98d0-bd05abb31303\") format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/a43547b8-ce06-49fa-84b3-be5fcbc6e32d\") format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/402d3988-77bc-4611-b365-1da433c5f5ec\") format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/8e584030-7dd1-49cf-a40a-c28cfeffdc6b\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n"}</style>


        <style>{"\nbody{margin:0}\na{color:inherit}a:hover{color:inherit}\n.stp *{box-sizing:border-box}\n.stp h1,.stp h2,.stp h3,.stp h4,.stp p,.stp ul,.stp ol,.stp dl,.stp dd,.stp figure,.stp fieldset{margin:0}\n.stp ul,.stp ol{padding:0;list-style:none}\n.stp button{font-family:inherit}\n.stp button:focus-visible,.stp a:focus-visible,.stp input:focus-visible,.stp textarea:focus-visible{outline:3px solid var(--hz);outline-offset:3px}\n.serif{font-family:'Instrument Serif',Georgia,serif;font-weight:400;letter-spacing:0}\n.mono{font-family:'JetBrains Mono',ui-monospace,monospace}\n.kick{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;letter-spacing:.14em;text-transform:uppercase}\n.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:52px;padding:0 26px;border-radius:999px;font:600 15px/1 'Inter Tight',system-ui,sans-serif;text-decoration:none;border:1px solid transparent;cursor:pointer;transition:transform .3s cubic-bezier(.2,.7,.2,1),background .3s,color .3s,border-color .3s,box-shadow .3s;white-space:nowrap}\n.btn:hover{transform:translateY(-2px)}\n.btn svg{transition:transform .3s cubic-bezier(.2,.7,.2,1)}\n.btn:hover svg{transform:translateX(4px)}\n.btn-acc{background:var(--acc);color:#fff;box-shadow:0 10px 30px -12px var(--acc)}\n.btn-acc:hover{color:#fff}\n.btn-hz{background:var(--hz);color:#0C1A22;box-shadow:0 10px 30px -14px var(--hz)}\n.btn-hz:hover{color:#0C1A22}\n.btn-ghost-d{border-color:rgba(255,255,255,.3);color:#fff;background:transparent}\n.btn-ghost-d:hover{border-color:#fff;color:#fff}\n.btn-ink{background:#0C1A22;color:#F3EFE6}\n.btn-ink:hover{color:#fff}\n.btn-line{border-color:rgba(12,26,34,.3);color:#0C1A22;background:transparent}\n.btn-line:hover{border-color:#0C1A22;color:#0C1A22}\n.navlink{color:#C9D3D8;text-decoration:none;font-size:14px;font-weight:500;padding:12px 0;transition:color .2s}\n.navlink:hover{color:#fff}\n.gridbg{background-image:linear-gradient(rgba(255,255,255,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.055) 1px,transparent 1px);background-size:72px 72px;-webkit-mask-image:radial-gradient(ellipse 80% 70% at 70% 30%,#000 30%,transparent 75%);mask-image:radial-gradient(ellipse 80% 70% at 70% 30%,#000 30%,transparent 75%)}\n.seg{min-height:44px;padding:0 18px;border-radius:999px;border:0;background:transparent;color:#A9B6BD;font-size:14px;font-weight:600;cursor:pointer;transition:background .3s,color .3s}\n.seg:hover{color:#fff}\n.seg.on{background:#fff;color:#0C1A22}\n.pill{min-height:44px;padding:0 18px;border-radius:999px;border:1px solid rgba(12,26,34,.2);background:transparent;color:#0C1A22;font-size:14px;font-weight:600;cursor:pointer;transition:all .3s;white-space:nowrap}\n.pill:hover{border-color:#0C1A22}\n.pill.on{background:#0C1A22;border-color:#0C1A22;color:#F3EFE6}\n.pill-d{min-height:44px;padding:0 18px;border-radius:999px;border:1px solid rgba(255,255,255,.2);background:transparent;color:#DCE4E7;font-size:14px;font-weight:600;cursor:pointer;transition:all .3s;white-space:nowrap}\n.pill-d:hover{border-color:rgba(255,255,255,.6)}\n.pill-d.on{background:var(--hz);border-color:var(--hz);color:#0C1A22}\n.round{width:52px;height:52px;border-radius:50%;border:1px solid rgba(12,26,34,.22);background:transparent;color:#0C1A22;display:grid;place-items:center;cursor:pointer;transition:all .3s}\n.round:hover{background:#0C1A22;color:#F3EFE6;border-color:#0C1A22}\n.round-d{width:52px;height:52px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:transparent;color:#fff;display:grid;place-items:center;cursor:pointer;transition:all .3s}\n.round-d:hover{background:#fff;color:#0C1A22}\n.mbtn{position:absolute;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;border:0;background:transparent;font:500 12px 'JetBrains Mono',monospace;color:#2A363C;cursor:pointer;transition:color .3s,transform .3s;z-index:2}\n.mbtn:hover{transform:scale(1.12);color:#0C1A22}\n.mbtn.on{color:#fff;font-weight:600}\n.mbtn.now{box-shadow:inset 0 0 0 2px var(--hz-d)}\n.mbtn.on.now{box-shadow:inset 0 0 0 2px #fff}\n.idx{width:100%;display:grid;grid-template-columns:80px minmax(0,1fr) 220px 60px;gap:clamp(14px,2vw,24px);align-items:center;min-height:112px;padding:22px 4px;border:1px solid transparent;border-radius:18px;background:transparent;color:#0C1A22;text-align:left;cursor:pointer;transition:background .3s,border-color .35s,box-shadow .35s}\n.idx:hover{background:rgba(12,26,34,.045);border-color:rgba(12,26,34,.12)}\n.idx[aria-expanded=\"true\"]{background:#ffffff;border-color:rgba(23,105,79,.4);box-shadow:0 16px 44px -20px rgba(23,105,79,.4)}\n.idx:hover .idx-t{transform:translateX(8px)}\n.idx-t{min-width:0;font-size:clamp(22px,3vw,40px);letter-spacing:-.03em;font-weight:600;line-height:1.1;transition:transform .45s cubic-bezier(.2,.7,.2,1)}\n.idx-ic{justify-self:end;width:60px;height:60px;border-radius:50%;border:1px solid rgba(12,26,34,.22);display:grid;place-items:center;transition:transform .45s cubic-bezier(.2,.7,.2,1),background .3s,color .3s,border-color .3s}\n.idx-ic:hover{border-color:rgba(12,26,34,.42)}\n.idx-ic.open{transform:rotate(45deg);background:var(--hz);border-color:var(--hz);color:#fff}\n.node{position:absolute;width:68px;height:68px;margin:-34px 0 0 -34px;border-radius:50%;border:1px solid rgba(255,255,255,.22);background:#0C1A22;color:#DCE4E7;font:500 14px 'JetBrains Mono',monospace;cursor:pointer;transition:all .4s cubic-bezier(.2,.7,.2,1);z-index:3}\n.node:hover{border-color:#fff;color:#fff}\n.node.on{background:var(--hz);border-color:var(--hz);color:#0C1A22;transform:scale(1.18);box-shadow:0 0 0 10px rgba(227,163,59,.15)}\n.node.done{background:#1D3340;color:#fff}\n.who-row{display:flex;gap:12px;height:560px}\n.who-p{position:relative;border-radius:28px;overflow:hidden;transition:flex .7s cubic-bezier(.2,.7,.2,1),background .4s;min-width:0}\n.who-btn{position:absolute;inset:0;width:100%;border:0;background:transparent;color:inherit;cursor:pointer;display:flex;flex-direction:column;justify-content:space-between;align-items:center;padding:26px 0;text-align:center}\n.who-btn:hover .vt{opacity:1}\n.vt{writing-mode:vertical-rl;transform:rotate(180deg);font-size:20px;font-weight:600;letter-spacing:-.01em;opacity:.85;transition:opacity .3s;white-space:nowrap}\n.faq-c{border-radius:20px;background:#FFFDF8;border:1px solid rgba(12,26,34,.08);transition:box-shadow .4s,border-color .4s}\n.faq-c:hover{border-color:rgba(12,26,34,.22)}\n.faq-q{width:100%;display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:76px;padding:20px 24px;border:0;background:transparent;color:#0C1A22;font-size:17px;font-weight:600;text-align:left;cursor:pointer}\n.faq-ic{flex:none;width:36px;height:36px;border-radius:50%;border:1px solid rgba(12,26,34,.2);display:grid;place-items:center;transition:transform .4s cubic-bezier(.2,.7,.2,1),background .3s,color .3s}\n.faq-ic.open{transform:rotate(45deg);background:#0C1A22;color:#fff;border-color:#0C1A22}\n.chk{width:100%;display:flex;align-items:center;gap:14px;min-height:60px;padding:14px 18px;border-radius:16px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.03);color:#DCE4E7;font-size:15px;font-weight:500;text-align:left;cursor:pointer;transition:all .3s}\n.chk:hover{border-color:rgba(255,255,255,.45)}\n.chk .bx{flex:none;width:24px;height:24px;border-radius:7px;border:1.5px solid rgba(255,255,255,.4);display:grid;place-items:center;color:transparent;transition:all .3s}\n.chk.on{background:rgba(227,163,59,.1);border-color:var(--hz);color:#fff}\n.chk.on .bx{background:var(--hz);border-color:var(--hz);color:#0C1A22}\n.field{display:flex;flex-direction:column;gap:8px}\n.field label{font-size:13px;font-weight:600;color:#3E4A50}\n.field input,.field textarea{width:100%;min-height:52px;padding:14px 16px;border-radius:14px;border:1px solid rgba(12,26,34,.16);background:#fff;color:#0C1A22;font:400 15px 'Inter Tight',system-ui,sans-serif}\n.field input::placeholder,.field textarea::placeholder{color:#7A8489}\n.srch{width:100%;min-height:56px;padding:0 20px 0 52px;border-radius:999px;border:1px solid rgba(12,26,34,.18);background:#fff;color:#0C1A22;font:500 16px 'Inter Tight',system-ui,sans-serif}\n.stp input[type=range]{width:100%;height:28px;cursor:pointer;accent-color:var(--hz)}\n.cmp-range{position:absolute!important;inset:0;width:100%!important;height:100%!important;opacity:0;cursor:ew-resize!important;margin:0;z-index:6}\n.lift{transition:transform .45s cubic-bezier(.2,.7,.2,1),box-shadow .45s}\n.lift:hover{transform:translateY(-6px);box-shadow:0 30px 60px -32px rgba(12,26,34,.45)}\n.marq{display:flex;width:max-content;animation:marq 46s linear infinite}\n.marq-wrap:hover .marq{animation-play-state:paused}\n.prog{position:absolute;left:0;right:0;bottom:-1px;height:2px;background:var(--hz);transform-origin:left;transform:scaleX(0)}\n@supports (animation-timeline: scroll()){.prog{animation:progx linear both;animation-timeline:scroll(root)}}\n@keyframes progx{from{transform:scaleX(0)}to{transform:scaleX(1)}}\n@keyframes marq{to{transform:translateX(-50%)}}\n@keyframes rise{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}\n@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}\n@keyframes slideIn{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:none}}\n@keyframes floatA{0%,100%{transform:translateY(0) rotate(-8deg)}50%{transform:translateY(-16px) rotate(-6deg)}}\n@keyframes floatB{0%,100%{transform:translateY(0) rotate(7deg)}50%{transform:translateY(-12px) rotate(5deg)}}\n@keyframes floatC{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}\n@keyframes orb{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-40px,30px) scale(1.12)}}\n@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(227,163,59,.6)}100%{box-shadow:0 0 0 16px rgba(227,163,59,0)}}\n@keyframes pulseG{0%{box-shadow:0 0 0 0 rgba(134,217,181,.55)}100%{box-shadow:0 0 0 14px rgba(134,217,181,0)}}\n@keyframes draw{0%{stroke-dashoffset:320}35%,100%{stroke-dashoffset:0}}\n@keyframes drawP{0%,30%{stroke-dashoffset:260;opacity:0}32%{opacity:1}65%,100%{stroke-dashoffset:0;opacity:1}}\n@keyframes cone{0%,55%{opacity:0;transform:scaleX(.2)}75%,100%{opacity:1;transform:scaleX(1)}}\n@keyframes ring{0%{r:6;opacity:.9}100%{r:22;opacity:0}}\n@keyframes tick{0%,8%{opacity:0;transform:scale(.3)}14%,92%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1)}}\n@keyframes st{0%{opacity:0}3%,30%{opacity:1}33%,100%{opacity:0}}\n@keyframes travel{0%{left:0%}22%,30%{left:33.33%}52%,60%{left:66.66%}82%,100%{left:100%}}\n@keyframes spin{to{transform:rotate(360deg)}}\n@keyframes prog{from{transform:scaleX(0)}to{transform:scaleX(1)}}\n@keyframes grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}\n@keyframes shine{0%{background-position:-200% 0}100%{background-position:200% 0}}\n@keyframes bob{0%,100%{transform:translate(-50%,0)}50%{transform:translate(-50%,-6px)}}\n/* ===== HERO CHARACTER (12s story loop) ===== */\n.hc .armR{transform-box:view-box;transform-origin:202px 152px;animation:hArmR 12s cubic-bezier(.45,0,.3,1) infinite}\n.hc .foreR{transform-box:fill-box;transform-origin:68% 0%;animation:hForeR 12s cubic-bezier(.45,0,.3,1) infinite}\n.hc .armL{transform-box:view-box;transform-origin:118px 152px;animation:hArmL 12s cubic-bezier(.45,0,.3,1) infinite}\n.hc .foreL{transform-box:fill-box;transform-origin:32% 0%;animation:hForeL 12s cubic-bezier(.45,0,.3,1) infinite}\n.hc .head{transform-box:view-box;transform-origin:160px 128px;animation:hHead 12s ease-in-out infinite}\n.hc .eyes{transform-box:fill-box;animation:hEyes 12s ease-in-out infinite}\n.hc .brows{transform-box:fill-box;animation:hBrows 12s ease-in-out infinite}\n.hc .m1{animation:hM1 12s infinite}.hc .m2{animation:hM2 12s infinite}.hc .m3{animation:hM3 12s infinite}\n.hc .pkL{transform-box:view-box;transform-origin:106px 270px;animation:hPocket 12s cubic-bezier(.3,1.6,.5,1) infinite}\n.hc .pkR{transform-box:view-box;transform-origin:214px 270px;animation:hPocket 12s cubic-bezier(.3,1.6,.5,1) infinite}\n.hc .moth{animation:hMoth 12s ease-in-out infinite}\n.hc .bub{transform-box:view-box;transform-origin:118px 46px;animation:hBub 12s cubic-bezier(.3,1.4,.5,1) infinite}\n.hc .bq{animation:hQ 12s infinite}.hc .bchart{animation:hChart 12s infinite}\n.hc .bar{transform-box:fill-box;transform-origin:50% 100%;animation:hBar 12s cubic-bezier(.3,1.4,.5,1) infinite}\n.hc .bulb{transform-box:view-box;transform-origin:160px 18px;animation:hBulb 12s cubic-bezier(.3,1.6,.5,1) infinite}\n.hc .spark{transform-box:fill-box;transform-origin:50% 50%;animation:hSpark 12s infinite}\n.blink{transform-box:fill-box;transform-origin:50% 50%;animation:blink 4s infinite}\n.wing{transform-box:fill-box;transform-origin:50% 100%;animation:flap .16s ease-in-out infinite alternate}\n.rays{transform-box:fill-box;transform-origin:50% 50%;animation:spin 6s linear infinite}\n.tie-fl{transform-box:fill-box;transform-origin:50% 0%;animation:tieF 1.6s ease-in-out infinite alternate}\n.cap{position:absolute;left:0;top:0;opacity:0;white-space:nowrap;display:inline-block;padding:8px 12px;border-radius:14px 14px 14px 4px;background:#FFFFFF;color:#0C1A22;box-shadow:0 10px 24px -10px rgba(0,0,0,.6)}\n.cap1{animation:cap1 12s infinite}.cap2{animation:cap2 12s infinite}.cap3{animation:cap3 12s infinite}.cap4{animation:cap4 12s infinite;background:var(--hz)}\n@keyframes hArmR{0%,8%{transform:rotate(0)}11%{transform:rotate(-7deg)}14%{transform:rotate(3deg)}17%{transform:rotate(-7deg)}20%{transform:rotate(0)}24%,34%{transform:rotate(-16deg)}38%{transform:rotate(0)}44%,66%{transform:rotate(33deg)}70%{transform:rotate(-30deg)}75%,90%{transform:rotate(-160deg)}97%,100%{transform:rotate(0)}}\n@keyframes hForeR{0%,20%{transform:rotate(0)}24%,34%{transform:rotate(-55deg)}38%{transform:rotate(0)}44%,66%{transform:rotate(135deg)}70%{transform:rotate(30deg)}75%,100%{transform:rotate(0)}}\n@keyframes hArmL{0%,8%{transform:rotate(0)}11%{transform:rotate(7deg)}14%{transform:rotate(-3deg)}17%{transform:rotate(7deg)}20%{transform:rotate(0)}24%,34%{transform:rotate(16deg)}38%,100%{transform:rotate(0)}}\n@keyframes hForeL{0%,20%{transform:rotate(0)}24%,34%{transform:rotate(55deg)}38%,100%{transform:rotate(0)}}\n@keyframes hHead{0%,7%{transform:none}11%,19%{transform:rotate(3deg) translateY(4px)}24%,34%{transform:none}44%,66%{transform:rotate(-7deg)}75%,90%{transform:rotate(5deg)}97%,100%{transform:none}}\n@keyframes hEyes{0%,7%{transform:none}11%,19%{transform:translateY(3px)}24%,40%{transform:none}44%,66%{transform:translate(-3px,-3px)}70%,100%{transform:none}}\n@keyframes blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}\n@keyframes hBrows{0%,21%{transform:none}24%,34%{transform:translateY(-7px)}40%{transform:none}44%,66%{transform:translateY(2px)}74%,90%{transform:translateY(-5px)}95%,100%{transform:none}}\n@keyframes hM1{0%,21%{opacity:1}23%,37%{opacity:0}39%,71%{opacity:1}73%,94%{opacity:0}96%,100%{opacity:1}}\n@keyframes hM2{0%,21%{opacity:0}23%,37%{opacity:1}39%,100%{opacity:0}}\n@keyframes hM3{0%,71%{opacity:0}73%,94%{opacity:1}96%,100%{opacity:0}}\n@keyframes hPocket{0%,21%{transform:scale(0)}26%,36%{transform:scale(1)}40%,100%{transform:scale(0)}}\n@keyframes hMoth{0%,24%{opacity:0;transform:translate(0,0)}26%{opacity:1;transform:translate(4px,-10px)}30%{transform:translate(34px,-46px)}34%{transform:translate(14px,-88px)}38%{opacity:1;transform:translate(52px,-128px)}43%,100%{opacity:0;transform:translate(76px,-176px)}}\n@keyframes flap{from{transform:scaleY(1)}to{transform:scaleY(.25)}}\n@keyframes hBub{0%,22%{opacity:0;transform:scale(.3)}27%,66%{opacity:1;transform:scale(1)}70%,100%{opacity:0;transform:scale(.5)}}\n@keyframes hQ{0%,23%{opacity:0}27%,38%{opacity:1}41%,100%{opacity:0}}\n@keyframes hChart{0%,40%{opacity:0}43%,66%{opacity:1}69%,100%{opacity:0}}\n@keyframes hBar{0%,43%{transform:scaleY(0)}52%,100%{transform:scaleY(1)}}\n@keyframes hBulb{0%,72%{opacity:0;transform:scale(0)}76%{opacity:1;transform:scale(1.25)}79%,90%{opacity:1;transform:scale(1)}94%,100%{opacity:0;transform:scale(.3)}}\n@keyframes hSpark{0%,74%{opacity:0;transform:scale(0) rotate(0)}78%{opacity:1;transform:scale(1.2) rotate(45deg)}88%{opacity:1;transform:scale(.8) rotate(90deg)}92%,100%{opacity:0;transform:scale(0)}}\n@keyframes tieF{from{transform:rotate(-4deg)}to{transform:rotate(5deg)}}\n@keyframes cap1{0%,1%{opacity:0;transform:translateY(6px)}3%,19%{opacity:1;transform:none}21%,100%{opacity:0}}\n@keyframes cap2{0%,22%{opacity:0;transform:translateY(6px)}25%,37%{opacity:1;transform:none}40%,100%{opacity:0}}\n@keyframes cap3{0%,41%{opacity:0;transform:translateY(6px)}44%,66%{opacity:1;transform:none}69%,100%{opacity:0}}\n@keyframes cap4{0%,72%{opacity:0;transform:translateY(6px)}75%,94%{opacity:1;transform:none}97%,100%{opacity:0}}\n/* ===== SCENE CHARACTERS ===== */\n.st-armL{transform-box:fill-box;transform-origin:100% 0%;animation:frL .42s ease-in-out infinite alternate}\n.st-armR{transform-box:fill-box;transform-origin:0% 0%;animation:frR .42s ease-in-out infinite alternate;animation-delay:-.2s}\n@keyframes frL{from{transform:rotate(40deg)}to{transform:rotate(150deg)}}\n@keyframes frR{from{transform:rotate(-40deg)}to{transform:rotate(-150deg)}}\n.st-head{transform-box:fill-box;transform-origin:50% 100%;animation:shake .3s ease-in-out infinite alternate}\n@keyframes shake{from{transform:rotate(-6deg)}to{transform:rotate(6deg)}}\n.sweat{transform-box:fill-box;animation:sweat 1.1s ease-in infinite}\n@keyframes sweat{0%{opacity:0;transform:translateY(-2px)}20%{opacity:1}100%{opacity:0;transform:translateY(16px)}}\n.clk-m{transform-box:fill-box;transform-origin:50% 100%;animation:spin 1.2s linear infinite}\n.fly{transform-box:fill-box;transform-origin:50% 50%;animation:fly 2.8s ease-out infinite}\n@keyframes fly{0%{opacity:0;transform:translate(0,0) rotate(0)}12%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--r))}}\n.pt-arm{transform-box:fill-box;transform-origin:0% 0%;animation:pointA 2.4s ease-in-out infinite alternate}\n@keyframes pointA{from{transform:rotate(-76deg)}to{transform:rotate(-90deg)}}\n.pt-head{transform-box:fill-box;transform-origin:50% 100%;animation:nod 3s ease-in-out infinite alternate}\n@keyframes nod{from{transform:rotate(-3deg)}to{transform:rotate(4deg)}}\n.sunp{transform-box:fill-box;transform-origin:50% 50%;animation:sunp 3s ease-in-out infinite alternate}\n@keyframes sunp{from{transform:scale(.92);opacity:.8}to{transform:scale(1.06);opacity:1}}\n.dashflow{animation:dashf 1.4s linear infinite}\n@keyframes dashf{to{stroke-dashoffset:-30}}\n.flag{transform-box:fill-box;transform-origin:50% 100%;animation:flagPop 6s cubic-bezier(.3,1.6,.5,1) infinite}\n@keyframes flagPop{0%{transform:scale(0)}10%,86%{transform:scale(1)}96%,100%{transform:scale(0)}}\n.say{animation:say 6s ease-in-out infinite}\n@keyframes say{0%,10%{opacity:0;transform:translateY(6px)}18%,80%{opacity:1;transform:none}90%,100%{opacity:0}}\n.bill{transform-box:fill-box;animation:bill 4s cubic-bezier(.4,0,.3,1) infinite}\n@keyframes bill{0%{opacity:0;transform:translate(0,0) rotate(0)}6%{opacity:1}45%{transform:translate(190px,-48px) rotate(-10deg)}80%{opacity:1;transform:translate(392px,6px) rotate(8deg)}88%,100%{opacity:0;transform:translate(396px,16px) rotate(8deg)}}\n.coin{animation:coinB 4s cubic-bezier(.4,0,.3,1) infinite}\n@keyframes coinB{0%,52%{opacity:0;transform:translate(0,0)}56%{opacity:1;transform:translate(-10px,-10px)}78%{transform:translate(-210px,-72px)}96%{opacity:1;transform:translate(-414px,-12px)}100%{opacity:0;transform:translate(-414px,-12px)}}\n.coinS{transform-box:fill-box;transform-origin:50% 50%;transition:transform .5s}\n.lblA{animation:lblA 4s infinite}.lblB{animation:lblB 4s infinite}\n@keyframes lblA{0%,58%{opacity:0}66%,94%{opacity:1}100%{opacity:0}}\n@keyframes lblB{0%,4%{opacity:0}10%,46%{opacity:1}54%,100%{opacity:0}}\n.dd-head{transform-box:fill-box;transform-origin:50% 100%;animation:ddh 4s ease-in-out infinite}\n@keyframes ddh{0%,55%{transform:rotate(0)}70%,90%{transform:rotate(-8deg)}100%{transform:rotate(0)}}\n.walker{animation:walk 10s linear infinite}\n@keyframes walk{0%{transform:translateX(0);opacity:0}3%{opacity:1}95%{opacity:1}100%{transform:translateX(860px);opacity:0}}\n.w-legL{transform-box:fill-box;transform-origin:100% 0%;animation:legS .5s ease-in-out infinite alternate}\n.w-legR{transform-box:fill-box;transform-origin:0% 0%;animation:legS .5s ease-in-out infinite alternate-reverse}\n.w-armL{transform-box:fill-box;transform-origin:100% 0%;animation:legS .5s ease-in-out infinite alternate-reverse}\n.w-armR{transform-box:fill-box;transform-origin:0% 0%;animation:legS .5s ease-in-out infinite alternate}\n@keyframes legS{from{transform:rotate(-22deg)}to{transform:rotate(22deg)}}\n.w-bob{animation:wbob .25s ease-in-out infinite alternate}\n@keyframes wbob{from{transform:translateY(0)}to{transform:translateY(-3px)}}\n.bxA{animation:bxA 10s infinite}.bxB{animation:bxB 10s infinite}.bxC{animation:bxC 10s infinite}.bxD{animation:bxD 10s infinite}\n@keyframes bxA{0%,20%{opacity:0;transform:translateY(-26px)}23%,95%{opacity:1;transform:none}100%{opacity:0}}\n@keyframes bxB{0%,43%{opacity:0;transform:translateY(-26px)}46%,95%{opacity:1;transform:none}100%{opacity:0}}\n@keyframes bxC{0%,66%{opacity:0;transform:translateY(-26px)}69%,95%{opacity:1;transform:none}100%{opacity:0}}\n@keyframes bxD{0%,89%{opacity:0;transform:translateY(-26px)}92%,96%{opacity:1;transform:none}100%{opacity:0}}\n.lumpG{transform-box:fill-box;transform-origin:50% 100%;animation:wob .5s ease-in-out infinite alternate}\n@keyframes wob{from{transform:rotate(-2.5deg) scaleY(1)}to{transform:rotate(2.5deg) scaleY(.97)}}\n.dust{transform-box:fill-box;transform-origin:50% 50%;animation:dust 1.4s ease-out infinite}\n@keyframes dust{0%{opacity:.7;transform:scale(.4)}100%{opacity:0;transform:scale(1.6) translateY(-6px)}}\n.steam{animation:steam 2.2s ease-out infinite}\n@keyframes steam{0%{opacity:0;transform:translateY(4px)}30%{opacity:.8}100%{opacity:0;transform:translateY(-14px)}}\n.scratch{transform-box:fill-box;transform-origin:0% 0%;animation:scr .25s ease-in-out infinite alternate}\n@keyframes scr{from{transform:rotate(-5deg)}to{transform:rotate(5deg)}}\n.wave-L{transform-box:fill-box;transform-origin:100% 0%;animation:waveA .4s ease-in-out infinite alternate}\n.wave-R{transform-box:fill-box;transform-origin:0% 0%;animation:waveA .4s ease-in-out infinite alternate-reverse}\n@keyframes waveA{from{transform:rotate(-15deg)}to{transform:rotate(15deg)}}\n.qfloat{animation:qf 2s ease-in-out infinite}\n@keyframes qf{0%{opacity:0;transform:translateY(6px)}30%,70%{opacity:1}100%{opacity:0;transform:translateY(-10px)}}\n.bang{transform-box:fill-box;transform-origin:50% 100%;animation:bang .5s ease-in-out infinite alternate}\n@keyframes bang{from{transform:scale(.85)}to{transform:scale(1.15)}}\n.jump{animation:jump .7s cubic-bezier(.3,0,.4,1) infinite alternate}\n@keyframes jump{from{transform:translateY(0)}to{transform:translateY(-16px)}}\n.conf{transform-box:fill-box;transform-origin:50% 50%;animation:conf 2.4s linear infinite}\n@keyframes conf{0%{opacity:0;transform:translateY(-20px) rotate(0)}10%{opacity:1}100%{opacity:0;transform:translateY(150px) rotate(540deg)}}\n/* ===== CARD ICONS ===== */\n.ic-needle{transform-box:fill-box;transform-origin:50% 100%;animation:needle 2.6s ease-in-out infinite alternate}\n@keyframes needle{from{transform:rotate(-62deg)}to{transform:rotate(48deg)}}\n.ic-mag{animation:mag 3.2s ease-in-out infinite alternate}\n@keyframes mag{from{transform:translateY(0)}to{transform:translateY(54px)}}\n.ic-beam{transform-box:fill-box;transform-origin:50% 0%;animation:beam 2.4s ease-in-out infinite alternate}\n@keyframes beam{from{transform:rotate(-10deg)}to{transform:rotate(10deg)}}\n.ic-ring{transform-box:fill-box;transform-origin:50% 50%;animation:ringc 2.2s ease-in-out infinite}\n@keyframes ringc{0%,55%,100%{transform:rotate(0)}60%{transform:rotate(12deg)}65%{transform:rotate(-12deg)}70%{transform:rotate(10deg)}75%{transform:rotate(-10deg)}80%{transform:rotate(0)}}\n.ic-wave{animation:icw 2s linear infinite}\n@keyframes icw{from{transform:translateX(0)}to{transform:translateX(-60px)}}\n.ic-grow{transform-box:fill-box;transform-origin:50% 100%;animation:icg 3.2s cubic-bezier(.3,1.4,.5,1) infinite}\n@keyframes icg{0%{transform:scaleY(0)}30%,85%{transform:scaleY(1)}100%{transform:scaleY(0)}}\n.ic-arrow{stroke-dasharray:140;animation:icArr 3.2s ease-in-out infinite}\n@keyframes icArr{0%,20%{stroke-dashoffset:140}55%,85%{stroke-dashoffset:0}100%{stroke-dashoffset:140}}\n.in{animation:rise 1s cubic-bezier(.2,.7,.2,1) both}\n.d1{animation-delay:.08s}.d2{animation-delay:.18s}.d3{animation-delay:.28s}.d4{animation-delay:.4s}\n.fade-up{animation:fadeUp .55s cubic-bezier(.2,.7,.2,1) both}\n.slide-in{animation:slideIn .6s cubic-bezier(.2,.7,.2,1) both}\n.bar-grow{transform-origin:bottom;animation:grow .8s cubic-bezier(.2,.7,.2,1) both}\n@supports (animation-timeline: view()){.rv{animation:rise linear both;animation-timeline:view();animation-range:entry 0% entry 36%}}\n.anim-off *,.anim-off *::before,.anim-off *::after{animation:none!important;transition:none!important}\n@media (prefers-reduced-motion: reduce){.stp *,.stp *::before,.stp *::after{animation:none!important;transition:none!important}}\n@media (max-width: 900px){\n.navlinks{display:none!important}\n.hide-sm{display:none!important}\n.who-row{flex-direction:column;height:auto}\n.who-p{flex:none!important;min-height:76px}\n.who-p.act{min-height:520px}\n.who-btn{flex-direction:row;padding:0 24px}\n.vt{writing-mode:horizontal-tb;transform:none;font-size:17px}\n.cmp-stage{height:600px!important}\n.idx{grid-template-columns:56px minmax(0,1fr) 56px;gap:10px;min-height:auto;padding:18px 2px;border-radius:14px}\n.idx .hide-sm{display:inline!important;grid-column:2;margin-top:-4px;font-size:11px;letter-spacing:.08em;color:#4F5B60;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.idx .idx-t{grid-column:2}\n.idx .idx-ic{width:52px;height:52px}\n.idx .mono{width:auto}\n}\n"}</style>





        <div className={("stp " + (v.animCls))} style={cssToStyle(("--acc: " + (v.accent) + "; --acc-l: " + (v.accentLight) + "; --hz: " + (v.horizon) + "; --hz-d: " + (v.horizonDark) + "; font-family: 'Inter Tight', system-ui, sans-serif; color: #0C1A22; background: #F3EFE6; -webkit-font-smoothing: antialiased; overflow-x: hidden;"))} data-canvas-width="1440" data-canvas-height="8000" data-document-role="page" data-label="Service page — US Tax Planning">


          {/*  ================= NAV =================  */}


          <header style={cssToStyle("position: sticky; top: 0; z-index: 60; background: rgba(12,26,34,0.84); backdrop-filter: saturate(160%) blur(16px); -webkit-backdrop-filter: saturate(160%) blur(16px); border-bottom: 1px solid rgba(255,255,255,0.08);")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto; padding: 12px clamp(20px, 4vw, 40px); display: flex; align-items: center; justify-content: space-between; gap: 24px;")}>

              <a href="#top" style={cssToStyle("display: flex; align-items: center; gap: 12px; text-decoration: none; color: #FFFFFF; min-height: 44px;")}>

                <svg width="34" height="34" fill="none" aria-hidden="true"><rect x="0.5" y="0.5" width="33" height="33" rx="9" stroke="rgba(255,255,255,0.35)"></rect>
                  <path d="M9 11h16M9 17h11M9 23h7" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"></path>
                  <circle cx="24" cy="22" r="3.2" fill="var(--acc-l)"></circle></svg>


                <span style={cssToStyle("font-size: 17px; font-weight: 600; letter-spacing: -0.01em;")}>Smart Tax
                  <span className="serif" style={cssToStyle("font-style: italic; font-size: 20px; color: var(--acc-l);")}>Expertss</span></span>

              </a>


              <nav aria-label="Primary" className="navlinks" style={cssToStyle("display: flex; gap: 28px; align-items: center;")}>

                <a className="navlink" href="#compare">Planning vs Prep</a>


                <a className="navlink" href="#year">Planning Year</a>


                <a className="navlink" href="#lab">Planning Lab</a>


                <a className="navlink" href="#covers">What We Cover</a>


                <a className="navlink" href="#process">Process</a>


                <a className="navlink" href="#faq">FAQ</a>

              </nav>


              <a href="#contact" className="btn btn-acc" style={cssToStyle("min-height: 44px; padding: 0 20px; font-size: 14px;")}>Book a Planning Review
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>

            </div>


            <div className="prog" aria-hidden="true"></div>

          </header>





          {/*  ================= HERO (same pattern as tax prep page) =================  */}


          <section id="top" style={cssToStyle("position: relative; background: #0C1A22; color: #E9EEF0; overflow: hidden;")}>

            <div className="gridbg" aria-hidden="true" style={cssToStyle("position: absolute; inset: 0;")}></div>


            <div aria-hidden="true" style={cssToStyle("position: absolute; width: 640px; height: 640px; right: -160px; top: -200px; border-radius: 50%; background: radial-gradient(circle, var(--acc) 0%, transparent 65%); opacity: 0.35; animation: orb 18s ease-in-out infinite;")}></div>

            <div style={cssToStyle("position: relative; max-width: 1240px; margin: 0 auto; padding: 34px clamp(20px, 4vw, 40px) 0; display: flex; justify-content: flex-start;")}>
              <BackToServices />
            </div>


            <div aria-hidden="true" style={cssToStyle("position: absolute; width: 420px; height: 420px; right: 30%; bottom: -260px; border-radius: 50%; background: radial-gradient(circle, var(--hz) 0%, transparent 65%); opacity: 0.16; animation: orb 22s ease-in-out infinite reverse;")}></div>



            <div style={cssToStyle("position: relative; max-width: 1240px; margin: 0 auto; padding: clamp(56px, 8vw, 104px) clamp(20px, 4vw, 40px) 56px; display: flex; flex-wrap: wrap; gap: clamp(40px, 5vw, 72px); align-items: center;")}>


              <div style={cssToStyle("flex: 1 1 540px; min-width: 0; display: flex; flex-direction: column; gap: 28px;")}>

                <p className="mono in" style={cssToStyle("font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #A9B6BD; display: flex; align-items: center; gap: 12px;")}><span style={cssToStyle("width: 8px; height: 8px; border-radius: 50%; background: var(--hz); animation: pulse 2s infinite;")}></span>
                  US Tax Planning · Year-round · Federal &amp; State</p>



                <div className="in d1" role="group" aria-label="Choose who you are" style={cssToStyle("display: inline-flex; align-self: flex-start; padding: 5px; border-radius: 999px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); flex-wrap: wrap;")}>

                  <button type="button" className={v.segInd} aria-pressed={v.pressInd} onClick={v.toInd}>Individuals &amp; Families</button>


                  <button type="button" className={v.segBiz} aria-pressed={v.pressBiz} onClick={v.toBiz}>Business Owners</button>

                </div>



                <h1 className="in d2" style={cssToStyle("font-size: clamp(44px, 6.2vw, 86px); line-height: 0.98; letter-spacing: -0.035em; font-weight: 600; color: #FFFFFF;")}>US Tax Planning
                  <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400; color: var(--hz);")}>for the year ahead</span></h1>



                <p className="serif in d3" style={cssToStyle("font-size: clamp(22px, 2.4vw, 30px); line-height: 1.25; color: #DCE4E7; font-style: italic; max-width: 560px;")}>Don't wait until tax season to think about your taxes.</p>



                {(v.modeInd) && (
                  <React.Fragment>


                    <div className="fade-up" style={cssToStyle("display: flex; flex-direction: column; gap: 28px;")}>

                      <p style={cssToStyle("font-size: 17px; line-height: 1.65; color: #A9B6BD; max-width: 560px;")}>Changes in employment, investments, property, retirement contributions and family circumstances all shape your tax position. We review them during the year, so you can make decisions while the opportunity is still open.</p>


                      <div style={cssToStyle("display: flex; gap: 14px; flex-wrap: wrap;")}>

                        <a href="#contact" className="btn btn-acc">Book a Planning Review
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>


                        <a href="#year" className="btn btn-ghost-d">Explore the planning year</a>

                      </div>

                    </div>


                  </React.Fragment>
                )}


                {(v.modeBiz) && (
                  <React.Fragment>


                    <div className="fade-up" style={cssToStyle("display: flex; flex-direction: column; gap: 28px;")}>

                      <p style={cssToStyle("font-size: 17px; line-height: 1.65; color: #A9B6BD; max-width: 560px;")}>Expected income, expenses, payroll, owner compensation and asset purchases — reviewed through the year, so you can evaluate the tax effect of a decision before you commit to it.</p>


                      <div style={cssToStyle("display: flex; gap: 14px; flex-wrap: wrap;")}>

                        <a href="#contact" className="btn btn-acc">Plan Your Business Taxes
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>


                        <a href="#lab" className="btn btn-ghost-d">Try the deduction reality check</a>

                      </div>

                    </div>


                  </React.Fragment>
                )}

              </div>



              {/*  hero visual: live projection card  */}


              <div className="in d3" style={cssToStyle("flex: 1 1 440px; min-width: 0; position: relative; height: 540px;")} role="img" aria-label="Animated illustration: a well-dressed man checks his empty pockets, thinks about a tax projection, then has the idea to plan ahead — beside an illustrative tax projection card">

                {/*  animated character: checks pockets → thinks → idea  */}


                <div aria-hidden="true" style={cssToStyle("position: absolute; left: 0; bottom: 112px; width: min(176px, 30%); z-index: 3; right: auto;")}>

                  <div className="mono" style={cssToStyle("position: absolute; left: 44%; top: -8px; height: 34px; font-size: 11px; letter-spacing: 0.03em; z-index: 2;")}>

                    <span className="cap cap1">Checking pockets…</span>


                    <span className="cap cap2">Hmm, where did it all go?</span>


                    <span className="cap cap3">What if I planned ahead?</span>


                    <span className="cap cap4">Plan it before Dec 31!</span>

                  </div>


                  <svg className="hc" width="100%" fill="none" style={cssToStyle("display: block; overflow: visible;")}>

                    <ellipse cx="160" cy="392" rx="84" ry="10" fill="rgba(0,0,0,0.38)"></ellipse>


                    <g className="pkL"><path d="M108 266 C90 268 84 284 90 298 C100 302 107 292 111 280 Z" fill="#FFFFFF"></path></g>


                    <g className="pkR"><path d="M212 266 C230 268 236 284 230 298 C220 302 213 292 209 280 Z" fill="#FFFFFF"></path></g>


                    <path d="M108 262 L212 262 L207 380 L169 380 L160 302 L151 380 L113 380 Z" fill="#D8CCB2"></path>


                    <path d="M131 300 L133 376 M189 300 L187 376" stroke="#BFB194" strokeWidth="1.5"></path>


                    <ellipse cx="130" cy="386" rx="27" ry="9" fill="#4A2F1E"></ellipse>


                    <ellipse cx="190" cy="386" rx="27" ry="9" fill="#4A2F1E"></ellipse>


                    <rect x="150" y="114" width="20" height="28" rx="6" fill="#A8714F"></rect>


                    <path d="M112 152 Q160 132 208 152 L218 272 L102 272 Z" fill="#E6DCC6"></path>


                    <path d="M145 140 L160 204 L132 162 Z" fill="#CDBFA3"></path>


                    <path d="M175 140 L160 204 L188 162 Z" fill="#CDBFA3"></path>


                    <path d="M146 140 L160 188 L174 140 Z" fill="#FFFFFF"></path>


                    <g className="tie-fl"><path d="M155 143 L165 143 L163 150 L167 198 L160 207 L153 198 L157 150 Z" fill="var(--acc)"></path></g>


                    <path d="M186 172 L202 169 L200 178 L187 179 Z" fill="var(--hz)"></path>


                    <circle cx="160" cy="226" r="3" fill="#B3A587"></circle>


                    <circle cx="160" cy="246" r="3" fill="#B3A587"></circle>


                    <path d="M118 262 L140 262 M180 262 L202 262" stroke="#B3A587" strokeWidth="2.5" strokeLinecap="round"></path>


                    <g className="moth"><g className="wing"><ellipse cx="217" cy="286" rx="6" ry="4.5" fill="#E2DACB"></ellipse>
                      <ellipse cx="229" cy="286" rx="6" ry="4.5" fill="#E2DACB"></ellipse></g>
                      <ellipse cx="223" cy="289" rx="2.2" ry="5.5" fill="#6B5B45"></ellipse></g>


                    <g className="head">

                      <circle cx="124" cy="94" r="8" fill="#B87D5B"></circle>


                      <circle cx="196" cy="94" r="8" fill="#B87D5B"></circle>


                      <circle cx="160" cy="90" r="37" fill="#C68B67"></circle>


                      <path d="M123 86 Q120 50 160 48 Q201 48 198 86 Q192 66 172 64 Q150 72 128 80 Z" fill="#1E1A17"></path>


                      <g className="brows"><path d="M137 76 Q145 71 153 75 M167 75 Q175 71 183 76" stroke="#1E1A17" strokeWidth="4" strokeLinecap="round"></path></g>


                      <g className="eyes"><g className="blink"><circle cx="146" cy="91" r="4.2" fill="#1E1A17"></circle>
                        <circle cx="174" cy="91" r="4.2" fill="#1E1A17"></circle></g></g>


                      <path d="M135 91 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0 M163 91 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0 M157 90 L163 90" stroke="#1E1A17" strokeWidth="2.2"></path>


                      <path d="M160 97 Q155 105 162 107" stroke="#A8714F" strokeWidth="2.6" strokeLinecap="round"></path>


                      <path className="m1" d="M150 115 Q160 119 170 115" stroke="#5B2E1E" strokeWidth="3.2" strokeLinecap="round"></path>


                      <ellipse className="m2" cx="160" cy="116" rx="5.5" ry="6.5" fill="#5B2E1E"></ellipse>


                      <path className="m3" d="M145 110 Q160 127 175 110 Z" fill="#5B2E1E"></path>

                    </g>


                    <g className="armL">

                      <path d="M118 152 L108 208" stroke="#E6DCC6" strokeWidth="25" strokeLinecap="round"></path>


                      <g className="foreL">

                        <path d="M108 208 L112 250" stroke="#E6DCC6" strokeWidth="23" strokeLinecap="round"></path>


                        <path d="M104 252 L120 252" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round"></path>


                        <circle cx="112" cy="262" r="11" fill="#C68B67"></circle>

                      </g>

                    </g>


                    <g className="armR">

                      <path d="M202 152 L212 208" stroke="#E6DCC6" strokeWidth="25" strokeLinecap="round"></path>


                      <g className="foreR">

                        <path d="M212 208 L208 250" stroke="#E6DCC6" strokeWidth="23" strokeLinecap="round"></path>


                        <path d="M200 252 L216 252" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round"></path>


                        <circle cx="208" cy="262" r="11" fill="#C68B67"></circle>


                        <path d="M208 268 L208 281" stroke="#C68B67" strokeWidth="7" strokeLinecap="round"></path>

                      </g>

                    </g>


                    <g className="bub">

                      <circle cx="118" cy="44" r="5" fill="#FFFFFF"></circle>


                      <circle cx="104" cy="28" r="8" fill="#FFFFFF"></circle>


                      <ellipse cx="54" cy="-14" rx="62" ry="46" fill="#FFFFFF"></ellipse>


                      <g className="bq"><text x="54" y="4" textAnchor="middle" fontFamily="Instrument Serif, Georgia, serif" font-style="italic" fontSize="54" fill="#0C1A22">$?</text></g>


                      <g className="bchart">

                        <path d="M18 16 H92" stroke="#0C1A22" strokeWidth="2" strokeLinecap="round"></path>


                        <rect className="bar" x="24" y="2" width="11" height="14" rx="2" fill="var(--acc)"></rect>


                        <rect className="bar" x="40" y="-8" width="11" height="24" rx="2" fill="var(--acc)" style={cssToStyle("animation-delay: .12s;")}></rect>


                        <rect className="bar" x="56" y="-18" width="11" height="34" rx="2" fill="var(--hz)" style={cssToStyle("animation-delay: .24s;")}></rect>


                        <rect className="bar" x="72" y="-30" width="11" height="46" rx="2" fill="var(--hz)" style={cssToStyle("animation-delay: .36s;")}></rect>


                        <path d="M22 -20 Q50 -30 84 -46" stroke="#0C1A22" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round"></path>


                        <path d="M77 -48 L86 -47 L83 -39" stroke="#0C1A22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>

                      </g>

                    </g>


                    <g className="bulb">

                      <g className="rays"><path d="M160 -22 V-32 M160 38 V48 M128 8 H118 M192 8 H202 M137 -15 L130 -22 M183 -15 L190 -22 M137 31 L130 38 M183 31 L190 38" stroke="var(--hz)" strokeWidth="3.5" strokeLinecap="round"></path></g>


                      <circle cx="160" cy="6" r="18" fill="var(--hz)"></circle>


                      <path d="M153 6 Q160 14 167 6" stroke="#FFF6E0" strokeWidth="2.5" strokeLinecap="round"></path>


                      <rect x="152" y="22" width="16" height="10" rx="3" fill="#C9D3D8"></rect>

                    </g>


                    <path className="spark" d="M252 8 L255 17 L264 20 L255 23 L252 32 L249 23 L240 20 L249 17 Z" fill="var(--hz)"></path>


                    <path className="spark" style={cssToStyle("animation-delay: .2s;")} d="M222 2 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2 Z" fill="#FFFFFF"></path>


                    <path className="spark" style={cssToStyle("animation-delay: .35s;")} d="M272 50 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2 Z" fill="var(--acc-l)"></path>

                  </svg>

                </div>



                <div aria-hidden="true" style={cssToStyle("position: absolute; right: 0; top: 20px; width: min(340px, 66%); z-index: 1; border-radius: 22px; background: #FBFBF8; color: #0C1A22; box-shadow: 0 50px 100px -30px rgba(0,0,0,0.6); overflow: hidden; animation: floatC 7s ease-in-out infinite;")}>

                  <div style={cssToStyle("padding: 20px 22px 6px; display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;")}>

                    <div>

                      <p className="mono" style={cssToStyle("font-size: 11px; letter-spacing: 0.12em; color: #4A5A62;")}>TAX PROJECTION</p>


                      <p style={cssToStyle("font-size: 19px; font-weight: 600; letter-spacing: -0.02em; margin-top: 4px;")}>Year-to-date + rest of year</p>

                    </div>


                    <div style={cssToStyle("position: relative; width: 118px; height: 28px; flex: none;")}>

                      <span style={cssToStyle("position: absolute; inset: 0; display: grid; place-items: center; border-radius: 999px; font-size: 12px; font-weight: 600; background: #FFF1DB; color: #7A4300; animation: st 9s infinite both;")}>Projecting</span>


                      <span style={cssToStyle("position: absolute; inset: 0; display: grid; place-items: center; border-radius: 999px; font-size: 12px; font-weight: 600; background: #E6EEFF; color: #1E3F8F; animation: st 9s 3s infinite both;")}>Options review</span>


                      <span style={cssToStyle("position: absolute; inset: 0; display: grid; place-items: center; border-radius: 999px; font-size: 12px; font-weight: 600; background: #DDF3E9; color: #0F5A42; animation: st 9s 6s infinite both;")}>Plan agreed</span>

                    </div>

                  </div>


                  <div style={cssToStyle("padding: 8px 14px 0;")}>

                    <svg width="100%" height="170" fill="none">

                      <path d="M10 30H350M10 70H350M10 110H350M10 150H350" stroke="rgba(12,26,34,0.07)" strokeWidth="1"></path>


                      <path d="M180 14V160" stroke="rgba(12,26,34,0.18)" strokeDasharray="3 4"></path>


                      <g style={cssToStyle("transform-origin: 180px 96px; animation: cone 9s ease-in-out infinite;")}><path d="M180 96L350 18L350 82Z" fill="var(--hz)" fillOpacity="0.18"></path></g>


                      <path d="M10 150C40 145 60 132 90 124S150 104 180 96" stroke="var(--acc)" strokeWidth="3.2" strokeLinecap="round" strokeDasharray="320" style={cssToStyle("animation: draw 9s ease-in-out infinite;")}></path>


                      <path d="M180 96C220 86 262 70 350 50" stroke="var(--hz-d)" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="6 6" style={cssToStyle("animation: drawP 9s ease-in-out infinite;")}></path>


                      <path d="M258 74V160" stroke="var(--hz-d)" strokeWidth="1.4" strokeDasharray="2 4"></path>


                      <circle cx="258" cy="74" r="6" fill="var(--hz)"></circle>


                      <circle cx="258" cy="74" r="6" stroke="var(--hz)" strokeWidth="2" style={cssToStyle("animation: ring 2.2s ease-out infinite;")}></circle>


                      <circle cx="180" cy="96" r="4.5" fill="#0C1A22"></circle>


                      <text x="186" y="24" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#4A5A62">TODAY</text>


                      <text x="266" y="168" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#7A4300">Q3 REVIEW</text>

                    </svg>


                    <div className="mono" style={cssToStyle("display: flex; justify-content: space-between; padding: 0 6px; font-size: 9px; color: #6A777D;")}><span>J</span>
                      <span>F</span>
                      <span>M</span>
                      <span>A</span>
                      <span>M</span>
                      <span>J</span>
                      <span>J</span>
                      <span>A</span>
                      <span>S</span>
                      <span>O</span>
                      <span>N</span>
                      <span>D</span></div>

                  </div>


                  <ul style={cssToStyle("padding: 10px 22px 8px; display: flex; flex-direction: column;")}>

                    <li style={cssToStyle("display: flex; align-items: center; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid rgba(12,26,34,0.07); font-size: 13.5px;")}>YTD income &amp; payments reviewed
                      <span style={cssToStyle("width: 20px; height: 20px; border-radius: 50%; background: var(--acc); color: #fff; display: grid; place-items: center; animation: tick 9s 0.4s infinite both;")}><svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg></span></li>


                    <li style={cssToStyle("display: flex; align-items: center; justify-content: space-between; padding: 9px 0; font-size: 13.5px;")}>Actions agreed before Dec 31
                      <span style={cssToStyle("width: 20px; height: 20px; border-radius: 50%; background: #0C1A22; color: #fff; display: grid; place-items: center; animation: tick 9s 4.4s infinite both;")}><svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg></span></li>

                  </ul>

                </div>



                <div aria-hidden="true" style={cssToStyle("position: absolute; left: 0; right: 0; bottom: 6px; margin: 0 auto; width: min(460px, 100%); padding: 18px 22px; border-radius: 18px; background: rgba(12,26,34,0.75); border: 1px solid rgba(255,255,255,0.14); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);")}>

                  <div style={cssToStyle("position: relative; height: 2px; margin: 10px 8px 14px; background: rgba(255,255,255,0.15);")}>

                    <span style={cssToStyle("position: absolute; left: 0; top: -5px; width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,0.4);")}></span>


                    <span style={cssToStyle("position: absolute; left: 33.33%; top: -5px; width: 12px; height: 12px; margin-left: -6px; border-radius: 50%; background: rgba(255,255,255,0.4);")}></span>


                    <span style={cssToStyle("position: absolute; left: 66.66%; top: -5px; width: 12px; height: 12px; margin-left: -6px; border-radius: 50%; background: rgba(255,255,255,0.4);")}></span>


                    <span style={cssToStyle("position: absolute; right: 0; top: -5px; width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,0.4);")}></span>


                    <span style={cssToStyle("position: absolute; top: -8px; width: 18px; height: 18px; margin-left: -9px; border-radius: 50%; background: var(--hz); box-shadow: 0 0 20px var(--hz); animation: travel 9s cubic-bezier(.6,0,.3,1) infinite;")}></span>

                  </div>


                  <div className="mono" style={cssToStyle("display: flex; justify-content: space-between; font-size: 11px; letter-spacing: 0.06em; color: #A9B6BD; text-transform: uppercase;")}><span>Baseline</span>
                    <span>Mid-year</span>
                    <span>Refresh</span>
                    <span>Year-end</span></div>

                </div>


                <p className="mono" style={cssToStyle("position: absolute; right: 0; top: -22px; font-size: 10px; letter-spacing: 0.14em; color: #6F8089; text-transform: uppercase;")}>Illustrative projection</p>

              </div>

            </div>



            {/*  stats  */}


            <div style={cssToStyle("position: relative; max-width: 1240px; margin: 0 auto; padding: 0 clamp(20px, 4vw, 40px);")}>

              <dl style={cssToStyle("display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); border-top: 1px solid rgba(255,255,255,0.12);")}>

                <div className="rv" style={cssToStyle("padding: 32px 28px 36px 0; border-right: 1px solid rgba(255,255,255,0.08);")}>

                  <dd style={cssToStyle("font-size: clamp(40px, 4.4vw, 60px); font-weight: 600; letter-spacing: -0.04em; color: #fff; line-height: 1;")}>5+
                    <span className="serif" style={cssToStyle("font-style: italic; color: var(--hz); font-size: 0.6em; margin-left: 6px;")}>yrs</span></dd>


                  <dt style={cssToStyle("margin-top: 12px; font-size: 14px; color: #A9B6BD;")}>Experience in US tax &amp; accounting work</dt>

                </div>


                <div className="rv" style={cssToStyle("padding: 32px 28px 36px; border-right: 1px solid rgba(255,255,255,0.08);")}>

                  <dd style={cssToStyle("font-size: clamp(40px, 4.4vw, 60px); font-weight: 600; letter-spacing: -0.04em; color: #fff; line-height: 1;")}>250+</dd>


                  <dt style={cssToStyle("margin-top: 12px; font-size: 14px; color: #A9B6BD;")}>Clients served</dt>

                </div>


                <div className="rv" style={cssToStyle("padding: 32px 28px 36px; border-right: 1px solid rgba(255,255,255,0.08);")}>

                  <dd style={cssToStyle("font-size: clamp(40px, 4.4vw, 60px); font-weight: 600; letter-spacing: -0.04em; color: #fff; line-height: 1;")}>3
                    <span className="serif" style={cssToStyle("font-style: italic; color: var(--hz); font-size: 0.6em; margin-left: 6px;")}>roles</span></dd>


                  <dt style={cssToStyle("margin-top: 12px; font-size: 14px; color: #A9B6BD;")}>Accountants, reviewers &amp; tax specialists</dt>

                </div>


                <div className="rv" style={cssToStyle("padding: 32px 0 36px 28px;")}>

                  <dd style={cssToStyle("font-size: clamp(40px, 4.4vw, 60px); font-weight: 600; letter-spacing: -0.04em; color: #fff; line-height: 1;")}>12
                    <span className="serif" style={cssToStyle("font-style: italic; color: var(--hz); font-size: 0.6em; margin-left: 6px;")}>months</span></dd>


                  <dt style={cssToStyle("margin-top: 12px; font-size: 14px; color: #A9B6BD;")}>A planning view, not a single deadline</dt>

                </div>

              </dl>

            </div>



            {/*  topic marquee  */}


            <div className="marq-wrap" style={cssToStyle("position: relative; border-top: 1px solid rgba(255,255,255,0.08); padding: 22px 0; overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);")}>

              <p style={cssToStyle("position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0);")}>Planning topics: income projections, estimated tax, withholding, retirement contributions, entity and compensation review, depreciation and Section 179, capital gains timing and year-end review.</p>


              <div className="marq" aria-hidden="true">

                {(v.marquee || []).map((m, index) => (
                  <React.Fragment key={index}>


                    <span style={cssToStyle("display: inline-flex; align-items: center; gap: 28px; padding-right: 28px; white-space: nowrap; font-size: 22px; font-weight: 500; color: #C9D3D8; letter-spacing: -0.01em;")}>{m}
                      <span style={cssToStyle("color: var(--hz); font-size: 14px;")}>✦</span></span>


                  </React.Fragment>
                ))}

              </div>

            </div>

          </section>



          {/*  ================= 01 COMPARE SLIDER =================  */}


          <section id="compare" style={cssToStyle("max-width: 1320px; margin: 0 auto; padding: clamp(90px, 11vw, 150px) clamp(20px, 4vw, 40px) clamp(70px, 8vw, 110px);")}>

            <div className="rv" style={cssToStyle("display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr)); gap: 28px 64px; align-items: end; margin-bottom: 48px;")}>

              <div>

                <p className="kick" style={cssToStyle("color: var(--hz-d); margin-bottom: 22px; display: flex; align-items: center; gap: 12px;")}><span style={cssToStyle("width: 36px; height: 1px; background: currentColor;")}></span>
                  Chapter 01 — Direction</p>


                <h2 style={cssToStyle("font-size: clamp(38px, 5.4vw, 76px); line-height: 0.98; letter-spacing: -0.04em; font-weight: 600;")}>Preparation looks
                  <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400;")}>back.</span>
                  <br />
                  Planning looks
                  <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400; color: var(--hz-d);")}>ahead.</span></h2>

              </div>


              <div style={cssToStyle("display: flex; flex-direction: column; gap: 20px; max-width: 480px;")}>

                <p style={cssToStyle("font-size: 17px; line-height: 1.65; color: #4F5B60;")}>Tax preparation reports financial activity that has already taken place. Tax planning considers how today's decisions may affect what you owe. Drag the divider to see the difference.</p>


                <div role="group" aria-label="Jump to a view" style={cssToStyle("display: flex; gap: 8px; flex-wrap: wrap;")}>

                  <button type="button" className={v.cmpPrepCls} onClick={v.cmpPrep}>Show preparation</button>


                  <button type="button" className={v.cmpMidCls} onClick={v.cmpMid}>Side by side</button>


                  <button type="button" className={v.cmpPlanCls} onClick={v.cmpPlan}>Show planning</button>

                </div>

              </div>

            </div>



            <div className="rv cmp-stage" style={cssToStyle("position: relative; height: 560px; border-radius: 32px; overflow: hidden; box-shadow: 0 60px 120px -60px rgba(12,26,34,0.55); user-select: none;")}>

              {/*  base layer: preparation  */}


              <div style={cssToStyle("position: absolute; inset: 0; background: #E4DDCF; display: flex;")}>

                <div style={cssToStyle("flex: 1 1 50%; min-width: 0; padding: clamp(24px, 4vw, 56px); display: flex; flex-direction: column; gap: 18px;")}>

                  <p className="kick" style={cssToStyle("color: #5B5245;")}>Tax preparation · Rear view</p>


                  <p className="serif" style={cssToStyle("font-size: clamp(34px, 4.4vw, 64px); line-height: 0.95; font-style: italic; color: #2B2620;")}>What happened.</p>


                  <ul style={cssToStyle("margin-top: 8px; display: flex; flex-direction: column; gap: 0;")}>

                    <li style={cssToStyle("display: flex; gap: 14px; align-items: baseline; padding: 13px 0; border-top: 1px solid rgba(43,38,32,0.14); font-size: clamp(14px, 1.3vw, 16px); color: #2B2620;")}><span className="mono" style={cssToStyle("font-size: 11px; color: #6D6455;")}>01</span>
                      W-2s, 1099s and statements arrive</li>


                    <li style={cssToStyle("display: flex; gap: 14px; align-items: baseline; padding: 13px 0; border-top: 1px solid rgba(43,38,32,0.14); font-size: clamp(14px, 1.3vw, 16px); color: #2B2620;")}><span className="mono" style={cssToStyle("font-size: 11px; color: #6D6455;")}>02</span>
                      Expenses already incurred are recorded</li>


                    <li style={cssToStyle("display: flex; gap: 14px; align-items: baseline; padding: 13px 0; border-top: 1px solid rgba(43,38,32,0.14); font-size: clamp(14px, 1.3vw, 16px); color: #2B2620;")}><span className="mono" style={cssToStyle("font-size: 11px; color: #6D6455;")}>03</span>
                      A balance due is discovered at filing</li>


                    <li style={cssToStyle("display: flex; gap: 14px; align-items: baseline; padding: 13px 0; border-top: 1px solid rgba(43,38,32,0.14); border-bottom: 1px solid rgba(43,38,32,0.14); font-size: clamp(14px, 1.3vw, 16px); color: #2B2620;")}><span className="mono" style={cssToStyle("font-size: 11px; color: #6D6455;")}>04</span>
                      Most decisions are already made</li>

                  </ul>

                </div>


                <div className="hide-sm" aria-hidden="true" style={cssToStyle("flex: 1 1 50%; min-width: 0; position: relative;")}>

                  <svg width="100%" height="100%" fill="none" style={cssToStyle("position: absolute; inset: 0;")}>

                    <circle cx="322" cy="74" r="36" fill="#FBF8F1" stroke="#2B2620" strokeWidth="3"></circle>


                    <path className="clk-m" d="M322 74 L322 52" stroke="#2B2620" strokeWidth="3" strokeLinecap="round"></path>


                    <path d="M322 74 L334 80" stroke="#2B2620" strokeWidth="3" strokeLinecap="round"></path>


                    <circle cx="322" cy="74" r="3.5" fill="#8F3B2E"></circle>


                    <text x="322" y="134" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="13" letter-spacing="2" fill="#8F3B2E">APR 15</text>


                    <g transform="translate(120 140) scale(1.6)">

                      <rect x="46" y="55" width="8" height="9" fill="#A8714F"></rect>


                      <path d="M31 68 Q50 58 69 68 L71 116 L29 116 Z" fill="#23405A"></path>


                      <path d="M45 62 L50 78 L55 62 Z" fill="#FFFFFF"></path>


                      <path d="M48.5 65 L51.5 65 L52.5 88 L50 92 L47.5 88 Z" fill="var(--hz)"></path>


                      <g className="st-head">

                        <circle cx="50" cy="44" r="17" fill="#C68B67"></circle>


                        <path d="M33 42 Q31 24 50 24 Q69 24 67 42 Q62 32 51 33 Q40 34 33 42 Z" fill="#1E1A17"></path>


                        <path d="M40 39 L47 36 M60 39 L53 36" stroke="#1E1A17" strokeWidth="2" strokeLinecap="round"></path>


                        <g className="blink"><circle cx="44" cy="45" r="2.4" fill="#1E1A17"></circle>
                          <circle cx="56" cy="45" r="2.4" fill="#1E1A17"></circle></g>


                        <path d="M43 54 Q46 51 49 54 Q52 57 55 54 Q57 52 58 53" stroke="#5B2E1E" strokeWidth="1.8" strokeLinecap="round"></path>


                        <path className="sweat" d="M68 34 Q65 39 68 41 Q71 39 68 34 Z" fill="#8CC7F0"></path>

                      </g>


                      <g className="st-armL"><path d="M34 70 L24 104" stroke="#23405A" strokeWidth="9" strokeLinecap="round"></path>
                        <circle cx="24" cy="106" r="5" fill="#C68B67"></circle>
                        <rect x="18" y="104" width="14" height="10" rx="1" fill="#FFFFFF" stroke="#2B2620" strokeWidth="0.8"></rect></g>


                      <g className="st-armR"><path d="M66 70 L76 104" stroke="#23405A" strokeWidth="9" strokeLinecap="round"></path>
                        <circle cx="76" cy="106" r="5" fill="#C68B67"></circle>
                        <rect x="68" y="104" width="14" height="10" rx="1" fill="#FFFFFF" stroke="#2B2620" strokeWidth="0.8"></rect></g>

                    </g>


                    <path d="M50 440 C64 362 110 330 200 326 C290 330 336 362 350 440 Z" fill="#F4EFE4" stroke="rgba(43,38,32,0.25)" strokeWidth="2"></path>


                    <g transform="rotate(-12 130 370)"><rect x="96" y="350" width="66" height="46" rx="3" fill="#FBF8F1" stroke="rgba(43,38,32,0.3)"></rect>
                      <path d="M104 362 H150 M104 372 H140 M104 382 H146" stroke="rgba(43,38,32,0.2)" strokeWidth="3" strokeLinecap="round"></path></g>


                    <g transform="rotate(9 262 372)"><rect x="226" y="350" width="72" height="50" rx="3" fill="#FFFFFF" stroke="rgba(43,38,32,0.3)"></rect>
                      <text x="262" y="382" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="13" letter-spacing="2" fill="#8F3B2E" transform="rotate(-10 262 378)">FILED</text>
                      <rect x="234" y="364" width="56" height="22" rx="3" stroke="#8F3B2E" strokeWidth="2" transform="rotate(-10 262 375)"></rect></g>


                    <g transform="rotate(-4 196 402)"><rect x="160" y="384" width="70" height="44" rx="3" fill="#FBF8F1" stroke="rgba(43,38,32,0.3)"></rect>
                      <text x="174" y="402" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="rgba(43,38,32,0.45)">W-2</text></g>


                    <g className="fly" style={cssToStyle("--dx: -130px; --dy: -230px; --r: -260deg;")}><rect x="188" y="318" width="22" height="28" rx="2" fill="#FFFFFF" stroke="rgba(43,38,32,0.35)"></rect></g>


                    <g className="fly" style={cssToStyle("--dx: 120px; --dy: -210px; --r: 220deg; animation-delay: -.6s;")}><rect x="188" y="318" width="22" height="28" rx="2" fill="#FFFFFF" stroke="rgba(43,38,32,0.35)"></rect></g>


                    <g className="fly" style={cssToStyle("--dx: -60px; --dy: -280px; --r: 180deg; animation-delay: -1.2s;")}><rect x="188" y="318" width="22" height="28" rx="2" fill="#FBF8F1" stroke="rgba(43,38,32,0.35)"></rect></g>


                    <g className="fly" style={cssToStyle("--dx: 160px; --dy: -120px; --r: -200deg; animation-delay: -1.8s;")}><rect x="188" y="318" width="22" height="28" rx="2" fill="#FFFFFF" stroke="rgba(43,38,32,0.35)"></rect></g>


                    <g className="fly" style={cssToStyle("--dx: -170px; --dy: -110px; --r: 240deg; animation-delay: -2.3s;")}><rect x="188" y="318" width="22" height="28" rx="2" fill="#FBF8F1" stroke="rgba(43,38,32,0.35)"></rect></g>

                  </svg>

                </div>

              </div>



              {/*  top layer: planning  */}


              <div style={cssToStyle(("position: absolute; inset: 0; background: #0C1A22; color: #E9EEF0; display: flex; clip-path: inset(0 0 0 " + (v.split) + "%); transition: clip-path " + (v.cmpEase) + ";"))}>

                <div className="gridbg" aria-hidden="true" style={cssToStyle("position: absolute; inset: 0; opacity: 0.7;")}></div>


                <div className="hide-sm" aria-hidden="true" style={cssToStyle("flex: 1 1 50%; min-width: 0; position: relative;")}>

                  <svg width="100%" height="100%" fill="none" style={cssToStyle("position: absolute; inset: 0;")}>

                    <circle className="sunp" cx="336" cy="92" r="52" fill="var(--hz)" fillOpacity="0.14"></circle>


                    <circle className="sunp" cx="336" cy="92" r="30" fill="var(--hz)"></circle>


                    <path d="M0 400 H400" stroke="rgba(255,255,255,0.16)" strokeWidth="2"></path>


                    <path d="M205 250 C250 225 290 195 360 150" stroke="rgba(255,255,255,0.12)" strokeWidth="16" strokeLinecap="round"></path>


                    <path className="dashflow" d="M205 250 C250 225 290 195 360 150" stroke="var(--hz)" strokeWidth="3" strokeDasharray="8 7" strokeLinecap="round"></path>


                    <g className="flag"><path d="M246 228 V198" stroke="#E9EEF0" strokeWidth="2.5" strokeLinecap="round"></path>
                      <path d="M246 198 L266 204 L246 211 Z" fill="var(--acc-l)"></path>
                      <text x="246" y="246" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#C9D3D8">Q2</text></g>


                    <g className="flag" style={cssToStyle("animation-delay: .5s;")}><path d="M296 200 V170" stroke="#E9EEF0" strokeWidth="2.5" strokeLinecap="round"></path>
                      <path d="M296 170 L316 176 L296 183 Z" fill="var(--acc-l)"></path>
                      <text x="296" y="218" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#C9D3D8">Q3</text></g>


                    <g className="flag" style={cssToStyle("animation-delay: 1s;")}><path d="M346 160 V128" stroke="#E9EEF0" strokeWidth="2.5" strokeLinecap="round"></path>
                      <path d="M346 128 L366 134 L346 141 Z" fill="var(--hz)"></path>
                      <text x="346" y="178" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#C9D3D8">Q4</text></g>


                    <ellipse cx="110" cy="396" rx="46" ry="6" fill="rgba(0,0,0,0.4)"></ellipse>


                    <g transform="translate(30 150) scale(1.6)">

                      <path d="M45 112 L41 150" stroke="#D8CCB2" strokeWidth="9" strokeLinecap="round"></path>


                      <path d="M55 112 L59 150" stroke="#D8CCB2" strokeWidth="9" strokeLinecap="round"></path>


                      <path d="M33 152 L43 152 M57 152 L67 152" stroke="#4A2F1E" strokeWidth="5" strokeLinecap="round"></path>


                      <rect x="46" y="55" width="8" height="9" fill="#A8714F"></rect>


                      <path d="M31 68 Q50 58 69 68 L71 116 L29 116 Z" fill="#E6DCC6"></path>


                      <path d="M45 62 L50 78 L55 62 Z" fill="#FFFFFF"></path>


                      <g className="tie-fl"><path d="M48.5 65 L51.5 65 L52.5 88 L50 92 L47.5 88 Z" fill="var(--acc)"></path></g>


                      <path d="M58 76 L65 75 L64 79 L58 79 Z" fill="var(--hz)"></path>


                      <g transform="rotate(28 34 70)"><path d="M34 70 L24 104" stroke="#E6DCC6" strokeWidth="9" strokeLinecap="round"></path>
                        <circle cx="24" cy="106" r="5" fill="#C68B67"></circle></g>


                      <g className="pt-head">

                        <circle cx="50" cy="44" r="17" fill="#C68B67"></circle>


                        <path d="M33 42 Q31 24 50 24 Q69 24 67 42 Q62 32 51 33 Q40 34 33 42 Z" fill="#1E1A17"></path>


                        <path d="M41 38 Q45 36 48 38 M53 38 Q57 36 60 38" stroke="#1E1A17" strokeWidth="1.6" strokeLinecap="round"></path>


                        <g className="blink"><circle cx="46.5" cy="45" r="2.2" fill="#1E1A17"></circle>
                          <circle cx="58.5" cy="45" r="2.2" fill="#1E1A17"></circle></g>


                        <path d="M45 52 Q51 57 57 52" stroke="#5B2E1E" strokeWidth="1.8" strokeLinecap="round"></path>

                      </g>


                      <g className="pt-arm"><path d="M66 70 L76 104" stroke="#E6DCC6" strokeWidth="9" strokeLinecap="round"></path>
                        <circle cx="76" cy="106" r="5" fill="#C68B67"></circle></g>

                    </g>


                    <g className="say"><rect x="60" y="116" width="168" height="38" rx="19" fill="#FFFFFF"></rect>
                      <path d="M104 152 L100 166 L118 153 Z" fill="#FFFFFF"></path>
                      <text x="144" y="140" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="12" fill="#0C1A22">Let's plan ahead.</text></g>

                  </svg>

                </div>


                <div style={cssToStyle("position: relative; flex: 1 1 50%; min-width: 0; padding: clamp(24px, 4vw, 56px); display: flex; flex-direction: column; gap: 18px; text-align: right; align-items: flex-end;")}>

                  <p className="kick" style={cssToStyle("color: var(--hz);")}>Tax planning · Windshield</p>


                  <p className="serif" style={cssToStyle("font-size: clamp(34px, 4.4vw, 64px); line-height: 0.95; font-style: italic; color: #fff;")}>What could happen.</p>


                  <ul style={cssToStyle("margin-top: 8px; display: flex; flex-direction: column; width: 100%;")}>

                    <li style={cssToStyle("display: flex; gap: 14px; justify-content: flex-end; align-items: baseline; padding: 13px 0; border-top: 1px solid rgba(255,255,255,0.12); font-size: clamp(14px, 1.3vw, 16px);")}>Income and liability projected
                      <span className="mono" style={cssToStyle("font-size: 11px; color: var(--hz);")}>01</span></li>


                    <li style={cssToStyle("display: flex; gap: 14px; justify-content: flex-end; align-items: baseline; padding: 13px 0; border-top: 1px solid rgba(255,255,255,0.12); font-size: clamp(14px, 1.3vw, 16px);")}>Purchase timing evaluated first
                      <span className="mono" style={cssToStyle("font-size: 11px; color: var(--hz);")}>02</span></li>


                    <li style={cssToStyle("display: flex; gap: 14px; justify-content: flex-end; align-items: baseline; padding: 13px 0; border-top: 1px solid rgba(255,255,255,0.12); font-size: clamp(14px, 1.3vw, 16px);")}>Estimated payments reviewed in time
                      <span className="mono" style={cssToStyle("font-size: 11px; color: var(--hz);")}>03</span></li>


                    <li style={cssToStyle("display: flex; gap: 14px; justify-content: flex-end; align-items: baseline; padding: 13px 0; border-top: 1px solid rgba(255,255,255,0.12); border-bottom: 1px solid rgba(255,255,255,0.12); font-size: clamp(14px, 1.3vw, 16px);")}>Decisions made while options are open
                      <span className="mono" style={cssToStyle("font-size: 11px; color: var(--hz);")}>04</span></li>

                  </ul>

                </div>

              </div>



              {/*  handle  */}


              <div aria-hidden="true" style={cssToStyle(("position: absolute; top: 0; bottom: 0; left: " + (v.split) + "%; width: 2px; margin-left: -1px; background: #fff; z-index: 4; transition: left " + (v.cmpEase) + "; box-shadow: 0 0 24px rgba(255,255,255,0.6);"))}>

                <div style={cssToStyle("position: absolute; top: 50%; left: 50%; width: 64px; height: 64px; margin: -32px 0 0 -32px; border-radius: 50%; background: #fff; color: #0C1A22; display: grid; place-items: center; box-shadow: 0 12px 30px -8px rgba(0,0,0,0.5);")}>

                  <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6"></path></svg>

                </div>


                <span className="mono" style={cssToStyle("position: absolute; top: 20px; left: 50%; transform: translateX(-50%); padding: 6px 10px; border-radius: 999px; background: #fff; color: #0C1A22; font-size: 10px; letter-spacing: 0.12em; white-space: nowrap;")}>TODAY</span>

              </div>


              <input type="range" className="cmp-range" min="4" max="96" step="1" value={v.split} onChange={v.setSplit} aria-label="Divider between tax preparation (left) and tax planning (right)" />

            </div>


            <p className="rv serif" style={cssToStyle("margin-top: 32px; text-align: center; font-size: clamp(22px, 2.4vw, 30px); font-style: italic; color: #2E3A40;")}>Preparation records the year.
              <span style={cssToStyle("color: var(--hz-d);")}>Planning helps shape it.</span></p>

          </section>



          {/*  ================= 02 PLANNING YEAR DIAL =================  */}


          <section id="year" style={cssToStyle("background: #EAE3D5; border-top: 1px solid rgba(12,26,34,0.06); border-bottom: 1px solid rgba(12,26,34,0.06);")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto; padding: clamp(90px, 11vw, 140px) clamp(20px, 4vw, 40px);")}>

              <div className="rv" style={cssToStyle("text-align: center; max-width: 820px; margin: 0 auto 56px;")}>

                <p className="kick" style={cssToStyle("color: var(--hz-d); margin-bottom: 22px; display: inline-flex; align-items: center; gap: 12px;")}><span style={cssToStyle("width: 36px; height: 1px; background: currentColor;")}></span>
                  Chapter 02 — Rhythm
                  <span style={cssToStyle("width: 36px; height: 1px; background: currentColor;")}></span></p>


                <h2 style={cssToStyle("font-size: clamp(36px, 5vw, 68px); line-height: 1; letter-spacing: -0.035em; font-weight: 600;")}>Twelve months.
                  <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400;")}>Not one deadline.</span></h2>


                <p style={cssToStyle("margin-top: 20px; font-size: 17px; line-height: 1.65; color: #4F5B60;")}>Turn the dial. Each month has a planning job — the ring marks common federal dates, and the dashed ring marks where we are now.</p>

              </div>



              <div style={cssToStyle("display: flex; flex-wrap: wrap; gap: clamp(40px, 6vw, 88px); align-items: center; justify-content: center;")}>

                <div className="rv" style={cssToStyle("flex: 0 1 520px; min-width: 0; width: 100%;")}>

                  <div style={cssToStyle("position: relative; width: min(520px, 100%); aspect-ratio: 1 / 1; margin: 0 auto;")}>

                    <div aria-hidden="true" style={cssToStyle(("position: absolute; inset: 0; border-radius: 50%; background: " + (v.dialBg) + "; -webkit-mask: radial-gradient(circle closest-side, transparent 64%, #000 64.5%); mask: radial-gradient(circle closest-side, transparent 64%, #000 64.5%); transition: background .5s;"))}></div>


                    <div aria-hidden="true" style={cssToStyle("position: absolute; inset: -18px; border-radius: 50%; border: 1px dashed rgba(12,26,34,0.2); animation: spin 80s linear infinite;")}></div>


                    {(v.months || []).map((m, index) => (
                      <React.Fragment key={index}>


                        <button type="button" className={m.cls} style={cssToStyle(("left: " + (m.x) + "%; top: " + (m.y) + "%;"))} aria-pressed={m.sel} aria-label={m.n} onClick={m.pick}>{m.ab}</button>


                        {(m.date) && (
                          <React.Fragment>


                            <span aria-hidden="true" style={cssToStyle(("position: absolute; left: " + (m.dx) + "%; top: " + (m.dy) + "%; width: 12px; height: 12px; margin: -6px 0 0 -6px; border-radius: 50%; background: var(--hz); border: 2px solid #EAE3D5; z-index: 3;"))}></span>


                          </React.Fragment>
                        )}


                      </React.Fragment>
                    ))}


                    <div style={cssToStyle("position: absolute; inset: 21%; border-radius: 50%; background: #0C1A22; color: #E9EEF0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 12%; box-shadow: 0 40px 80px -30px rgba(12,26,34,0.6);")}>

                      <p className="mono" style={cssToStyle("font-size: 11px; letter-spacing: 0.16em; color: var(--hz);")}>{v.curMonth.q} · MONTH {v.curMonth.num}</p>


                      <p className="serif fade-up" style={cssToStyle("font-size: clamp(32px, 5vw, 52px); font-style: italic; line-height: 1; margin-top: 8px; color: #fff;")}>{v.curMonth.n}</p>


                      {(v.curMonth.date) && (
                        <React.Fragment>


                          <p className="mono" style={cssToStyle("margin-top: 12px; font-size: 12px; padding: 6px 12px; border-radius: 999px; background: rgba(227,163,59,0.16); color: var(--hz);")}>Common date · {v.curMonth.date}*</p>


                        </React.Fragment>
                      )}


                      {(v.curMonth.isNow) && (
                        <React.Fragment>


                          <p className="mono" style={cssToStyle("margin-top: 10px; font-size: 11px; letter-spacing: 0.12em; color: #A9B6BD;")}>YOU ARE HERE</p>


                        </React.Fragment>
                      )}

                    </div>

                  </div>

                </div>



                <div className="rv" style={cssToStyle("flex: 1 1 400px; min-width: 0; max-width: 520px;")}>

                  <div className="slide-in" aria-live="polite" style={cssToStyle("display: flex; flex-direction: column; gap: 20px;")}>

                    <p className="kick" style={cssToStyle("color: #4F5B60;")}>{v.curMonth.who}</p>


                    <h3 style={cssToStyle("font-size: clamp(28px, 3.2vw, 42px); line-height: 1.05; letter-spacing: -0.03em; font-weight: 600;")}>{v.curMonth.t}</h3>


                    <p style={cssToStyle("font-size: 17px; line-height: 1.65; color: #4F5B60;")}>{v.curMonth.d}</p>


                    <ol style={cssToStyle("display: flex; flex-direction: column; gap: 10px; margin-top: 6px;")}>

                      {(v.curMonth.acts || []).map((a, index) => (
                        <React.Fragment key={index}>


                          <li style={cssToStyle("display: flex; gap: 14px; align-items: center; padding: 16px 18px; border-radius: 16px; background: #F7F3EA; font-size: 15px; font-weight: 500;")}><span style={cssToStyle("flex: none; width: 26px; height: 26px; border-radius: 50%; background: #0C1A22; color: var(--hz); display: grid; place-items: center;")}><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></span>
                            {a}</li>


                        </React.Fragment>
                      ))}

                    </ol>


                    <div style={cssToStyle("display: flex; gap: 10px; align-items: center; margin-top: 8px;")}>

                      <button type="button" className="round" aria-label="Previous month" onClick={v.prevMonth}><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"></path></svg></button>


                      <button type="button" className="round" aria-label="Next month" onClick={v.nextMonth}><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></button>


                      <button type="button" className="pill" onClick={v.toNow}>Jump to today</button>

                    </div>

                  </div>

                </div>

              </div>


              <p className="rv" style={cssToStyle("margin-top: 48px; text-align: center; font-size: 13px; line-height: 1.6; color: #4F5B60;")}>* Common federal dates for calendar-year taxpayers. Dates move when they fall on a weekend or legal holiday and are confirmed for each tax year and taxpayer type.</p>

            </div>

          </section>



          {/*  ================= 03 WHY PLAN CAROUSEL =================  */}


          <section style={cssToStyle("padding: clamp(90px, 11vw, 140px) 0; overflow: hidden;")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto; padding: 0 clamp(20px, 4vw, 40px);")}>

              <div className="rv" style={cssToStyle("display: flex; flex-wrap: wrap; gap: 28px 64px; justify-content: space-between; align-items: flex-end; margin-bottom: 48px;")}>

                <div style={cssToStyle("flex: 1 1 560px; min-width: 0;")}>

                  <p className="kick" style={cssToStyle("color: var(--hz-d); margin-bottom: 22px; display: flex; align-items: center; gap: 12px;")}><span style={cssToStyle("width: 36px; height: 1px; background: currentColor;")}></span>
                    Chapter 03 — Reasons</p>


                  <h2 style={cssToStyle("font-size: clamp(36px, 5vw, 68px); line-height: 1; letter-spacing: -0.035em; font-weight: 600;")}>Why plan your taxes?
                    <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400;")}>Six honest reasons.</span></h2>

                </div>


                <div style={cssToStyle("display: flex; align-items: center; gap: 10px;")}>

                  <button type="button" className="round" aria-label="Previous reason" onClick={v.prevWhy}><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"></path></svg></button>


                  <button type="button" className="round" style={cssToStyle("background: #0C1A22; color: #F3EFE6;")} aria-label="Next reason" onClick={v.nextWhy}><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></button>


                  <button type="button" className="pill" aria-pressed={v.whyAutoPressed} onClick={v.toggleWhyAuto}>{v.whyAutoLabel}</button>

                </div>

              </div>



              <div className="rv" style={cssToStyle("position: relative;")}>

                <div style={cssToStyle(("display: flex; gap: 20px; transform: " + (v.whyShift) + "; transition: transform .8s cubic-bezier(.2,.7,.2,1);"))}>

                  {(v.why || []).map((w, index) => (
                    <React.Fragment key={index}>


                      <article className="lift" style={cssToStyle(("flex: 0 0 min(400px, 84%); min-height: 480px; border-radius: 30px; padding: 34px; background: " + (w.bg) + "; color: " + (w.fg) + "; display: flex; flex-direction: column; position: relative; overflow: hidden; opacity: " + (w.op) + "; transition: opacity .6s;"))}>

                        <div aria-hidden="true" style={cssToStyle(("position: absolute; right: 24px; top: 24px; width: 120px; height: 120px; --ia: " + (w.ia) + ";"))}>

                          {(w.i1) && (
                            <React.Fragment>
                              <svg width="120" height="120" fill="none"><path d="M18 88 A42 42 0 0 1 102 88" stroke="currentColor" strokeOpacity="0.2" strokeWidth="10" strokeLinecap="round"></path>
                                <path d="M18 88 A42 42 0 0 1 60 46" stroke="var(--ia)" strokeWidth="10" strokeLinecap="round"></path>
                                <g className="ic-needle"><path d="M60 88 L60 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></path></g>
                                <circle cx="60" cy="88" r="7" fill="currentColor"></circle></svg>
                            </React.Fragment>
                          )}


                          {(w.i2) && (
                            <React.Fragment>
                              <svg width="120" height="120" fill="none"><path d="M22 30 H98 M22 50 H86 M22 70 H96 M22 90 H78" stroke="currentColor" strokeOpacity="0.3" strokeWidth="6" strokeLinecap="round"></path>
                                <g className="ic-mag"><circle cx="52" cy="26" r="17" stroke="var(--ia)" strokeWidth="6" fill="currentColor" fillOpacity="0.06"></circle>
                                  <path d="M64 38 L80 54" stroke="var(--ia)" strokeWidth="7" strokeLinecap="round"></path></g></svg>
                            </React.Fragment>
                          )}


                          {(w.i3) && (
                            <React.Fragment>
                              <svg width="120" height="120" fill="none"><path d="M60 30 V100 M38 102 H82" stroke="currentColor" strokeWidth="6" strokeLinecap="round"></path>
                                <g className="ic-beam"><path d="M16 32 H104" stroke="currentColor" strokeWidth="6" strokeLinecap="round"></path>
                                  <path d="M24 32 L14 62 M24 32 L34 62 M96 32 L86 62 M96 32 L106 62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"></path>
                                  <path d="M10 62 Q24 78 38 62 Z" fill="var(--ia)"></path>
                                  <path d="M82 62 Q96 78 110 62 Z" fill="currentColor"></path></g></svg>
                            </React.Fragment>
                          )}


                          {(w.i4) && (
                            <React.Fragment>
                              <svg width="120" height="120" fill="none"><g className="ic-ring"><circle cx="60" cy="64" r="34" stroke="currentColor" strokeWidth="7"></circle>
                                <path d="M30 30 Q36 20 48 22 M90 30 Q84 20 72 22" stroke="var(--ia)" strokeWidth="7" strokeLinecap="round"></path>
                                <path d="M60 64 V44 M60 64 L74 72" stroke="var(--ia)" strokeWidth="6" strokeLinecap="round"></path>
                                <path d="M36 98 L30 106 M84 98 L90 106" stroke="currentColor" strokeWidth="6" strokeLinecap="round"></path></g></svg>
                            </React.Fragment>
                          )}


                          {(w.i5) && (
                            <React.Fragment>
                              <svg width="120" height="120" fill="none"><g className="ic-wave"><path d="M-60 56 q15 -26 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" stroke="var(--ia)" strokeWidth="7" strokeLinecap="round"></path>
                                <path d="M-60 86 q15 -14 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" stroke="currentColor" strokeOpacity="0.3" strokeWidth="5" strokeLinecap="round"></path></g></svg>
                            </React.Fragment>
                          )}


                          {(w.i6) && (
                            <React.Fragment>
                              <svg width="120" height="120" fill="none"><path d="M14 106 H106" stroke="currentColor" strokeOpacity="0.3" strokeWidth="4" strokeLinecap="round"></path>
                                <rect className="ic-grow" x="18" y="82" width="16" height="22" rx="3" fill="currentColor" fillOpacity="0.35"></rect>
                                <rect className="ic-grow" style={cssToStyle("animation-delay: .15s;")} x="40" y="66" width="16" height="38" rx="3" fill="currentColor" fillOpacity="0.5"></rect>
                                <rect className="ic-grow" style={cssToStyle("animation-delay: .3s;")} x="62" y="50" width="16" height="54" rx="3" fill="currentColor" fillOpacity="0.7"></rect>
                                <rect className="ic-grow" style={cssToStyle("animation-delay: .45s;")} x="84" y="30" width="16" height="74" rx="3" fill="currentColor"></rect>
                                <path className="ic-arrow" d="M14 70 L42 50 L64 38 L98 12" stroke="var(--ia)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M86 10 L100 10 L100 24" stroke="var(--ia)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                            </React.Fragment>
                          )}

                        </div>


                        <p className="mono" style={cssToStyle("position: relative; font-size: 13px; letter-spacing: 0.12em; opacity: 0.75;")}>{w.n} / 06</p>


                        <div style={cssToStyle("flex: 1;")}></div>


                        <h3 style={cssToStyle("position: relative; font-size: 30px; line-height: 1.08; letter-spacing: -0.025em; font-weight: 600;")}>{w.t}</h3>


                        <p style={cssToStyle("position: relative; margin-top: 16px; font-size: 16px; line-height: 1.6; opacity: 0.86;")}>{w.d}</p>

                      </article>


                    </React.Fragment>
                  ))}

                </div>

              </div>


              <div role="tablist" aria-label="Choose a reason" style={cssToStyle("margin-top: 32px; display: flex; gap: 8px;")}>

                {(v.why || []).map((w, index) => (
                  <React.Fragment key={index}>


                    <button type="button" role="tab" aria-selected={w.sel} aria-label={("Reason " + (w.n))} onClick={w.pick} style={cssToStyle("flex: 1; height: 44px; border: 0; background: transparent; cursor: pointer; padding: 0; display: flex; align-items: center;")}>

                      <span style={cssToStyle("display: block; width: 100%; height: 4px; border-radius: 4px; background: rgba(12,26,34,0.12); overflow: hidden;")}>

                        {(w.active) && (
                          <React.Fragment>
                            <span style={cssToStyle(("display: block; height: 100%; background: #0C1A22; transform-origin: left; animation: prog " + (v.whyDur) + " linear both;"))}></span>
                          </React.Fragment>
                        )}


                        {(w.past) && (
                          <React.Fragment>
                            <span style={cssToStyle("display: block; height: 100%; background: #0C1A22;")}></span>
                          </React.Fragment>
                        )}

                      </span>

                    </button>


                  </React.Fragment>
                ))}

              </div>

            </div>

          </section>



          {/*  ================= 04 PLANNING LAB: DEDUCTION REALITY CHECK =================  */}


          <section id="lab" style={cssToStyle("position: relative; background: #0C1A22; color: #E9EEF0; overflow: hidden;")}>

            <div className="gridbg" aria-hidden="true" style={cssToStyle("position: absolute; inset: 0; opacity: 0.6;")}></div>


            <div aria-hidden="true" style={cssToStyle("position: absolute; width: 700px; height: 700px; left: -300px; top: -200px; border-radius: 50%; background: radial-gradient(circle, var(--hz) 0%, transparent 65%); opacity: 0.1;")}></div>


            <div style={cssToStyle("position: relative; max-width: 1240px; margin: 0 auto; padding: clamp(90px, 11vw, 140px) clamp(20px, 4vw, 40px);")}>

              <div className="rv" style={cssToStyle("max-width: 900px;")}>

                <p className="kick" style={cssToStyle("color: var(--hz); margin-bottom: 22px; display: flex; align-items: center; gap: 12px;")}><span style={cssToStyle("width: 36px; height: 1px; background: currentColor;")}></span>
                  Chapter 04 — Planning lab · Deduction reality check</p>


                <h2 style={cssToStyle("font-size: clamp(36px, 5.2vw, 72px); line-height: 0.98; letter-spacing: -0.035em; font-weight: 600; color: #fff;")}>A
                  <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400; color: var(--hz);")}>{v.dedFmt}</span>
                  deduction is not {v.dedFmt} saved.</h2>


                <p style={cssToStyle("margin-top: 22px; font-size: 17px; line-height: 1.7; color: #A9B6BD; max-width: 680px;")}>A deduction's real effect depends on your circumstances, tax rates and limits. Spending money only to get a deduction still leaves you out of pocket. Move the controls to see why we look at the whole financial outcome.</p>

              </div>



              <div style={cssToStyle("margin-top: 56px; display: flex; flex-wrap: wrap; gap: 24px; align-items: stretch;")}>

                <div className="rv" style={cssToStyle("flex: 1 1 380px; min-width: 0; border-radius: 28px; padding: clamp(24px, 3vw, 36px); background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column; gap: 28px;")}>

                  <div>

                    <label htmlFor="ded" style={cssToStyle("display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font-size: 14px; font-weight: 600; color: #C9D3D8;")}><span>Deductible expense</span>
                      <span className="mono" style={cssToStyle("font-size: 22px; color: #fff;")}>{v.dedFmt}</span></label>


                    <input id="ded" type="range" min="1000" max="50000" step="500" value={v.ded} onChange={v.setDed} style={cssToStyle("margin-top: 10px;")} />


                    <div className="mono" style={cssToStyle("display: flex; justify-content: space-between; font-size: 11px; color: #8A989F;")}><span>$1,000</span>
                      <span>$50,000</span></div>

                  </div>


                  <fieldset style={cssToStyle("border: 0; padding: 0;")}>

                    <legend style={cssToStyle("font-size: 14px; font-weight: 600; color: #C9D3D8; padding: 0; margin-bottom: 12px;")}>Assumed federal marginal rate</legend>


                    <div style={cssToStyle("display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px;")}>

                      {(v.rates || []).map((r, index) => (
                        <React.Fragment key={index}>


                          <button type="button" className={r.cls} aria-pressed={r.sel} onClick={r.pick} style={cssToStyle("padding: 0;")}>{r.r}%</button>


                        </React.Fragment>
                      ))}

                    </div>

                  </fieldset>


                  <p style={cssToStyle("margin-top: auto; font-size: 12px; line-height: 1.6; color: #8A989F;")}>Illustration only: federal income tax at one marginal rate, assuming the full amount is deductible. It ignores state tax, phase-outs, limits, the standard deduction and other rules. Not tax advice.</p>

                </div>



                <div className="rv" style={cssToStyle("flex: 1.6 1 520px; min-width: 0; border-radius: 28px; padding: clamp(24px, 3vw, 40px); background: #F7F3EA; color: #0C1A22; display: flex; flex-direction: column; gap: 28px;")}>

                  <div aria-hidden="true" style={cssToStyle("border-radius: 20px; background: #EFE8DA; overflow: hidden;")}>

                    <svg width="100%" fill="none" style={cssToStyle("display: block;")}>

                      <path d="M0 156 H640" stroke="rgba(12,26,34,0.15)" strokeWidth="2"></path>


                      <g transform="translate(24 4)">

                        <path d="M45 112 L41 150 L35 151" stroke="#14232E" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"></path>


                        <path d="M55 112 L59 150 L65 151" stroke="#14232E" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"></path>


                        <rect x="46" y="55" width="8" height="9" fill="#A8714F"></rect>


                        <path d="M31 68 Q50 58 69 68 L71 116 L29 116 Z" fill="#1F3A4D"></path>


                        <path d="M45 62 L50 78 L55 62 Z" fill="#FFFFFF"></path>


                        <path d="M48.5 65 L51.5 65 L52.5 88 L50 92 L47.5 88 Z" fill="var(--hz)"></path>


                        <g transform="rotate(8 34 70)"><path d="M34 70 L24 104" stroke="#1F3A4D" strokeWidth="9" strokeLinecap="round"></path>
                          <circle cx="24" cy="106" r="5" fill="#C68B67"></circle></g>


                        <g className="dd-head">

                          <circle cx="50" cy="44" r="17" fill="#C68B67"></circle>


                          <path d="M33 42 Q31 24 50 24 Q69 24 67 42 Q62 32 51 33 Q40 34 33 42 Z" fill="#1E1A17"></path>


                          <g className="blink"><circle cx="45.5" cy="45" r="2.2" fill="#1E1A17"></circle>
                            <circle cx="57.5" cy="45" r="2.2" fill="#1E1A17"></circle></g>


                          <path d="M45 53 Q50 56 56 53" stroke="#5B2E1E" strokeWidth="1.8" strokeLinecap="round"></path>

                        </g>


                        <g transform="rotate(-68 66 70)"><path d="M66 70 L76 104" stroke="#1F3A4D" strokeWidth="9" strokeLinecap="round"></path>
                          <circle cx="76" cy="106" r="5" fill="#C68B67"></circle></g>

                      </g>


                      <rect x="118" y="67" width="30" height="20" rx="4" fill="#6B4423"></rect>


                      <path d="M118 74 H148" stroke="#4E3018" strokeWidth="2"></path>


                      <g transform="translate(520 82)">

                        <path d="M-24 -10 H-6 L6 52 H78" stroke="#0C1A22" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"></path>


                        <path d="M0 2 H96 L86 40 H8 Z" fill="#FFFDF8" stroke="#0C1A22" strokeWidth="3.5" strokeLinejoin="round"></path>


                        <text x="47" y="27" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" letter-spacing="1.5" fill="#4F5B60">EXPENSE</text>


                        <circle cx="18" cy="66" r="7" fill="#0C1A22"></circle>
                        <circle cx="68" cy="66" r="7" fill="#0C1A22"></circle>

                      </g>


                      <g className="bill"><rect x="146" y="60" width="34" height="18" rx="3" fill="var(--hz)" stroke="#0C1A22" strokeWidth="1.2"></rect>
                        <text x="163" y="73" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#0C1A22">$</text></g>


                      <g className="bill" style={cssToStyle("animation-delay: .35s;")}><rect x="146" y="60" width="34" height="18" rx="3" fill="var(--hz)" stroke="#0C1A22" strokeWidth="1.2"></rect>
                        <text x="163" y="73" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#0C1A22">$</text></g>


                      <g className="bill" style={cssToStyle("animation-delay: .7s;")}><rect x="146" y="60" width="34" height="18" rx="3" fill="var(--hz)" stroke="#0C1A22" strokeWidth="1.2"></rect>
                        <text x="163" y="73" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#0C1A22">$</text></g>


                      <g className="bill" style={cssToStyle("animation-delay: 1.05s;")}><rect x="146" y="60" width="34" height="18" rx="3" fill="var(--hz)" stroke="#0C1A22" strokeWidth="1.2"></rect>
                        <text x="163" y="73" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#0C1A22">$</text></g>


                      <g className="coin"><g className="coinS" style={cssToStyle(("transform: scale(" + (v.coinScale) + ");"))}><circle cx="560" cy="92" r="13" fill="var(--acc)" stroke="#0C1A22" strokeWidth="1.2"></circle>
                        <text x="560" y="96.5" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="600" fill="#FFFFFF">$</text></g></g>


                      <text className="lblB" x="340" y="142" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="13" fill="#7A4300">{v.dedFmt} goes out →</text>


                      <text className="lblA" x="340" y="142" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="13" fontWeight="600" fill="var(--acc)">← only ≈ {v.effFmt} comes back as tax effect</text>

                    </svg>

                  </div>


                  <div style={cssToStyle("display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px;")}>

                    <div style={cssToStyle("padding: 18px; border-radius: 18px; background: #fff;")}><p className="mono" style={cssToStyle("font-size: 10px; letter-spacing: 0.1em; color: #4F5B60; text-transform: uppercase;")}>You spend</p>
                      <p style={cssToStyle("margin-top: 6px; font-size: 32px; font-weight: 600; letter-spacing: -0.03em;")}>{v.dedFmt}</p></div>


                    <div style={cssToStyle("padding: 18px; border-radius: 18px; background: var(--acc); color: #fff;")}><p className="mono" style={cssToStyle("font-size: 10px; letter-spacing: 0.1em; color: rgba(255,255,255,0.85); text-transform: uppercase;")}>Federal tax effect</p>
                      <p style={cssToStyle("margin-top: 6px; font-size: 32px; font-weight: 600; letter-spacing: -0.03em;")}>{v.effFmt}</p></div>


                    <div style={cssToStyle("padding: 18px; border-radius: 18px; background: #0C1A22; color: #fff;")}><p className="mono" style={cssToStyle("font-size: 10px; letter-spacing: 0.1em; color: #A9B6BD; text-transform: uppercase;")}>Still out of pocket</p>
                      <p style={cssToStyle("margin-top: 6px; font-size: 32px; font-weight: 600; letter-spacing: -0.03em; color: var(--hz);")}>{v.outFmt}</p></div>

                  </div>



                  <div role="img" aria-label={v.dedLabel}>

                    <div style={cssToStyle("display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; color: #4F5B60; margin-bottom: 10px;")}><span>Where each dollar goes</span>
                      <span className="mono">{v.rate}% / {v.outRate}%</span></div>


                    <div style={cssToStyle("height: 64px; border-radius: 16px; overflow: hidden; display: flex; background: #E9E3D7;")}>

                      <div style={cssToStyle(("width: " + (v.rate) + "%; background: var(--acc); display: flex; align-items: center; padding-left: 14px; color: #fff; font-size: 13px; font-weight: 600; white-space: nowrap; transition: width .6s cubic-bezier(.2,.7,.2,1);"))}>Tax effect</div>


                      <div style={cssToStyle("flex: 1; background: repeating-linear-gradient(135deg, var(--hz) 0 8px, #F0C47A 8px 16px); display: flex; align-items: center; justify-content: flex-end; padding-right: 14px; color: #0C1A22; font-size: 13px; font-weight: 600; white-space: nowrap;")}>Your cash</div>

                    </div>

                  </div>



                  <div>

                    <p style={cssToStyle("font-size: 13px; font-weight: 600; color: #4F5B60; margin-bottom: 14px;")}>Same {v.dedFmt}, tax effect at each federal rate</p>


                    <div aria-hidden="true" style={cssToStyle("height: 200px; display: flex; align-items: flex-end; gap: 10px; border-bottom: 1px solid rgba(12,26,34,0.2);")}>

                      {(v.rates || []).map((r, index) => (
                        <React.Fragment key={index}>


                          <div style={cssToStyle("flex: 1; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 8px;")}>

                            <span className="mono" style={cssToStyle(("font-size: 11px; color: " + (r.lc) + "; font-weight: 500; white-space: nowrap;"))}>{r.amt}</span>


                            <div className="bar-grow" style={cssToStyle(("width: 100%; height: " + (r.h) + "%; border-radius: 10px 10px 0 0; background: " + (r.bg) + "; transition: height .6s cubic-bezier(.2,.7,.2,1), background .3s;"))}></div>

                          </div>


                        </React.Fragment>
                      ))}

                    </div>


                    <div className="mono" aria-hidden="true" style={cssToStyle("display: flex; gap: 10px; margin-top: 8px;")}>

                      {(v.rates || []).map((r, index) => (
                        <React.Fragment key={index}>
                          <span style={cssToStyle("flex: 1; text-align: center; font-size: 11px; color: #4F5B60;")}>{r.r}%</span>
                        </React.Fragment>
                      ))}

                    </div>

                  </div>


                  <p className="serif" style={cssToStyle("font-size: 22px; font-style: italic; line-height: 1.35; color: #2E3A40;")}>Our approach considers the overall financial outcome — never an expense simply because it may produce a deduction.</p>

                </div>

              </div>

            </div>

          </section>



          {/*  ================= 05 CASH FLOW: SPREAD VS SURPRISE =================  */}


          <section style={cssToStyle("max-width: 1240px; margin: 0 auto; padding: clamp(90px, 11vw, 140px) clamp(20px, 4vw, 40px);")}>

            <div className="rv" style={cssToStyle("display: flex; flex-wrap: wrap; gap: 28px 64px; justify-content: space-between; align-items: flex-end; margin-bottom: 44px;")}>

              <div style={cssToStyle("flex: 1 1 560px; min-width: 0;")}>

                <p className="kick" style={cssToStyle("color: var(--hz-d); margin-bottom: 22px; display: flex; align-items: center; gap: 12px;")}><span style={cssToStyle("width: 36px; height: 1px; background: currentColor;")}></span>
                  Chapter 05 — Planning lab · Cash flow</p>


                <h2 style={cssToStyle("font-size: clamp(36px, 5vw, 68px); line-height: 1; letter-spacing: -0.035em; font-weight: 600;")}>Know what you may owe
                  <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400;")}>before the deadline.</span></h2>

              </div>


              <p style={cssToStyle("flex: 1 1 340px; min-width: 0; max-width: 440px; font-size: 17px; line-height: 1.65; color: #4F5B60;")}>The same tax bill feels very different as one surprise at filing or as planned payments through the year. Set the amount and switch views.</p>

            </div>



            <div className="rv" style={cssToStyle("border-radius: 32px; background: #FFFDF8; border: 1px solid rgba(12,26,34,0.08); padding: clamp(22px, 3.4vw, 44px); box-shadow: 0 50px 100px -60px rgba(12,26,34,0.4);")}>

              <div style={cssToStyle("display: flex; flex-wrap: wrap; gap: 24px 40px; align-items: flex-end; justify-content: space-between;")}>

                <div role="group" aria-label="Payment approach" style={cssToStyle("display: inline-flex; padding: 5px; border-radius: 999px; background: #EFE9DD; flex-wrap: wrap;")}>

                  <button type="button" className={v.cfPlanCls} aria-pressed={v.cfPlanPressed} onClick={v.cfToPlan} style={cssToStyle("border: 0;")}>Planned through the year</button>


                  <button type="button" className={v.cfLumpCls} aria-pressed={v.cfLumpPressed} onClick={v.cfToLump} style={cssToStyle("border: 0;")}>One surprise at filing</button>

                </div>


                <div style={cssToStyle("flex: 0 1 380px; min-width: 240px;")}>

                  <label htmlFor="cft" style={cssToStyle("display: flex; justify-content: space-between; gap: 12px; font-size: 14px; font-weight: 600; color: #3E4A50;")}><span>Tax not covered by withholding</span>
                    <span className="mono" style={cssToStyle("color: #0C1A22;")}>{v.cfFmt}</span></label>


                  <input id="cft" type="range" min="2000" max="80000" step="1000" value={v.cfTax} onChange={v.setCf} />

                </div>

              </div>



              <div aria-hidden="true" style={cssToStyle("margin-top: 28px; border-radius: 22px; background: #F3EFE6; overflow: hidden;")}>

                {(v.cfPlanned) && (
                  <React.Fragment>


                    <svg width="100%" fill="none" style={cssToStyle("display: block;")}>

                      <circle className="sunp" cx="840" cy="-14" r="18" fill="var(--hz)" fillOpacity="0.7"></circle>


                      <path d="M0 152 H900" stroke="rgba(12,26,34,0.18)" strokeWidth="2"></path>


                      <rect x="170" y="134" width="60" height="18" rx="4" fill="#E2D9C7"></rect>
                      <text x="200" y="147" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#4F5B60">APR</text>


                      <rect x="370" y="134" width="60" height="18" rx="4" fill="#E2D9C7"></rect>
                      <text x="400" y="147" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#4F5B60">JUN</text>


                      <rect x="570" y="134" width="60" height="18" rx="4" fill="#E2D9C7"></rect>
                      <text x="600" y="147" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#4F5B60">SEP</text>


                      <rect x="770" y="134" width="60" height="18" rx="4" fill="#E2D9C7"></rect>
                      <text x="800" y="147" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#4F5B60">JAN</text>


                      <g className="bxA"><rect x="186" y="106" width="28" height="28" rx="4" fill="var(--acc)"></rect>
                        <path d="M186 118 H214 M200 106 V134" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.5"></path></g>


                      <g className="bxB"><rect x="386" y="106" width="28" height="28" rx="4" fill="var(--acc)"></rect>
                        <path d="M386 118 H414 M400 106 V134" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.5"></path></g>


                      <g className="bxC"><rect x="586" y="106" width="28" height="28" rx="4" fill="var(--acc)"></rect>
                        <path d="M586 118 H614 M600 106 V134" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.5"></path></g>


                      <g className="bxD"><rect x="786" y="106" width="28" height="28" rx="4" fill="var(--acc)"></rect>
                        <path d="M786 118 H814 M800 106 V134" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.5"></path></g>


                      <g className="walker"><g transform="translate(-30 1)"><g className="w-bob">

                        <g className="w-legL"><path d="M45 112 L41 150 L35 151" stroke="#14232E" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"></path></g>


                        <g className="w-legR"><path d="M55 112 L59 150 L65 151" stroke="#14232E" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"></path></g>


                        <rect x="46" y="55" width="8" height="9" fill="#A8714F"></rect>


                        <path d="M31 68 Q50 58 69 68 L71 116 L29 116 Z" fill="#1F3A4D"></path>


                        <path d="M45 62 L50 78 L55 62 Z" fill="#FFFFFF"></path>


                        <path d="M48.5 65 L51.5 65 L52.5 88 L50 92 L47.5 88 Z" fill="var(--hz)"></path>


                        <g className="w-armL"><path d="M34 70 L24 104" stroke="#1F3A4D" strokeWidth="9" strokeLinecap="round"></path>
                          <circle cx="24" cy="106" r="5" fill="#C68B67"></circle></g>


                        <circle cx="50" cy="44" r="17" fill="#C68B67"></circle>


                        <path d="M33 42 Q31 24 50 24 Q69 24 67 42 Q62 32 51 33 Q40 34 33 42 Z" fill="#1E1A17"></path>


                        <g className="blink"><circle cx="46.5" cy="45" r="2.2" fill="#1E1A17"></circle>
                          <circle cx="58.5" cy="45" r="2.2" fill="#1E1A17"></circle></g>


                        <path d="M45 52 Q51 57 57 52" stroke="#5B2E1E" strokeWidth="1.8" strokeLinecap="round"></path>


                        <g transform="rotate(-35 66 70)"><path d="M66 70 L76 104" stroke="#1F3A4D" strokeWidth="9" strokeLinecap="round"></path>
                          <rect x="68" y="98" width="17" height="17" rx="3" fill="var(--acc)"></rect>
                          <circle cx="76" cy="106" r="5" fill="#C68B67"></circle></g>

                      </g></g></g>


                      <text x="20" y="-24" fontFamily="JetBrains Mono, monospace" fontSize="12" fill="#4F5B60">Four lighter steps · {v.cfQuarter} each</text>

                    </svg>


                  </React.Fragment>
                )}


                {(v.cfLump) && (
                  <React.Fragment>


                    <svg width="100%" fill="none" style={cssToStyle("display: block;")}>

                      <path d="M0 152 H900" stroke="rgba(12,26,34,0.18)" strokeWidth="2"></path>


                      <path d="M420 152 l-12 8 M450 152 l4 10 M482 152 l14 7" stroke="rgba(12,26,34,0.35)" strokeWidth="2" strokeLinecap="round"></path>


                      <path d="M760 152 V100" stroke="#4F5B60" strokeWidth="4"></path>


                      <rect x="718" y="66" width="84" height="40" rx="6" fill="#FFFDF8" stroke="#0C1A22" strokeWidth="2"></rect>


                      <text x="760" y="92" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="13" fontWeight="600" fill="#A0432A">APR 15</text>


                      <circle className="dust" cx="424" cy="148" r="9" fill="rgba(12,26,34,0.14)"></circle>


                      <circle className="dust" style={cssToStyle("animation-delay: .6s;")} cx="478" cy="148" r="9" fill="rgba(12,26,34,0.14)"></circle>


                      <g className="lumpG"><g transform="translate(400 1)">

                        <ellipse cx="50" cy="2" rx="68" ry="32" fill="#2E3A40"></ellipse>


                        <path d="M8 -12 Q28 -26 60 -28" stroke="rgba(255,255,255,0.16)" strokeWidth="4" strokeLinecap="round"></path>


                        <text x="50" y="-10" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="13" fontWeight="600" fill="var(--hz)">TAX DUE</text>


                        <text x="50" y="7" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#FFFFFF">{v.cfFmt}</text>


                        <g transform="rotate(16 45 112)"><path d="M45 112 L41 150 L35 151" stroke="#14232E" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"></path></g>


                        <g transform="rotate(-16 55 112)"><path d="M55 112 L59 150 L65 151" stroke="#14232E" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"></path></g>


                        <rect x="46" y="55" width="8" height="9" fill="#A8714F"></rect>


                        <path d="M31 68 Q50 58 69 68 L71 116 L29 116 Z" fill="#1F3A4D"></path>


                        <path d="M45 62 L50 78 L55 62 Z" fill="#FFFFFF"></path>


                        <path d="M48.5 65 L51.5 65 L52.5 88 L50 92 L47.5 88 Z" fill="var(--hz)"></path>


                        <circle cx="50" cy="44" r="17" fill="#C68B67"></circle>


                        <path d="M33 42 Q31 30 50 30 Q69 30 67 42 Q62 36 51 37 Q40 38 33 42 Z" fill="#1E1A17"></path>


                        <path d="M41 43 L46 46 L41 49 M59 43 L54 46 L59 49" stroke="#1E1A17" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path>


                        <rect x="44" y="52" width="12" height="5" rx="2" fill="#FFFFFF" stroke="#5B2E1E" strokeWidth="1.2"></rect>


                        <path className="sweat" d="M70 36 Q67 41 70 43 Q73 41 70 36 Z" fill="#8CC7F0"></path>


                        <path className="sweat" style={cssToStyle("animation-delay: .5s;")} d="M30 38 Q27 43 30 45 Q33 43 30 38 Z" fill="#8CC7F0"></path>


                        <g transform="rotate(150 34 70)"><path d="M34 70 L24 104" stroke="#1F3A4D" strokeWidth="9" strokeLinecap="round"></path>
                          <circle cx="24" cy="106" r="5" fill="#C68B67"></circle></g>


                        <g transform="rotate(-150 66 70)"><path d="M66 70 L76 104" stroke="#1F3A4D" strokeWidth="9" strokeLinecap="round"></path>
                          <circle cx="76" cy="106" r="5" fill="#C68B67"></circle></g>

                      </g></g>


                      <text x="20" y="-24" fontFamily="JetBrains Mono, monospace" fontSize="12" fill="#4F5B60">One heavy lift · all at once</text>

                    </svg>


                  </React.Fragment>
                )}

              </div>


              <div role="img" aria-label={v.cfLabel} style={cssToStyle("margin-top: 36px; position: relative;")}>

                <div style={cssToStyle("position: relative; height: 280px; display: flex; align-items: flex-end; gap: 8px; border-bottom: 1px solid rgba(12,26,34,0.25); padding-top: 34px;")}>

                  <div aria-hidden="true" style={cssToStyle("position: absolute; left: calc(75% - 4px); top: 0; bottom: 0; border-left: 1px dashed rgba(12,26,34,0.25);")}><span className="mono" style={cssToStyle("position: absolute; left: 8px; top: 0; font-size: 10px; letter-spacing: 0.1em; color: #4F5B60; white-space: nowrap;")}>FOLLOWING YEAR →</span></div>


                  {(v.cfBars || []).map((b, index) => (
                    <React.Fragment key={index}>


                      <div aria-hidden="true" style={cssToStyle("flex: 1; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 8px;")}>

                        {(b.has) && (
                          <React.Fragment>


                            <span className="mono fade-up" style={cssToStyle("font-size: 11px; font-weight: 500; white-space: nowrap; color: #0C1A22;")}>{b.amt}</span>


                          </React.Fragment>
                        )}


                        <div style={cssToStyle(("width: 100%; max-width: 54px; height: " + (b.h) + "%; border-radius: 10px 10px 0 0; background: " + (b.bg) + "; transition: height .7s cubic-bezier(.2,.7,.2,1);"))}></div>

                      </div>


                    </React.Fragment>
                  ))}

                </div>


                <div className="mono" aria-hidden="true" style={cssToStyle("display: flex; gap: 8px; margin-top: 10px;")}>

                  {(v.cfBars || []).map((b, index) => (
                    <React.Fragment key={index}>
                      <span style={cssToStyle(("flex: 1; text-align: center; font-size: 10px; color: " + (b.lc) + ";"))}>{b.m}</span>
                    </React.Fragment>
                  ))}

                </div>

              </div>



              <div style={cssToStyle("margin-top: 28px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;")}>

                <div style={cssToStyle("padding: 20px; border-radius: 18px; background: #F3EFE6;")}><p className="mono" style={cssToStyle("font-size: 10px; letter-spacing: 0.1em; color: #4F5B60; text-transform: uppercase;")}>Largest single payment</p>
                  <p style={cssToStyle("margin-top: 6px; font-size: 34px; font-weight: 600; letter-spacing: -0.03em;")}>{v.cfMax}</p></div>


                <div style={cssToStyle("padding: 20px; border-radius: 18px; background: #F3EFE6;")}><p className="mono" style={cssToStyle("font-size: 10px; letter-spacing: 0.1em; color: #4F5B60; text-transform: uppercase;")}>Number of payments</p>
                  <p style={cssToStyle("margin-top: 6px; font-size: 34px; font-weight: 600; letter-spacing: -0.03em;")}>{v.cfCount}</p></div>


                <div style={cssToStyle("padding: 20px; border-radius: 18px; background: #0C1A22; color: #fff;")}><p className="mono" style={cssToStyle("font-size: 10px; letter-spacing: 0.1em; color: #A9B6BD; text-transform: uppercase;")}>You first see the number</p>
                  <p style={cssToStyle("margin-top: 6px; font-size: 34px; font-weight: 600; letter-spacing: -0.03em; color: var(--hz);")}>{v.cfSee}</p></div>

              </div>


              <p style={cssToStyle("margin-top: 18px; font-size: 12px; line-height: 1.6; color: #4F5B60;")}>Illustrative cash-timing view using common federal estimated-payment dates (April, June, September and the following January) and equal instalments. Actual payment requirements, safe-harbour rules, penalties and interest depend on your circumstances.</p>

            </div>

          </section>



          {/*  ================= 06 WHAT WE COVER — EDITORIAL INDEX =================  */}


          <section id="covers" style={cssToStyle("background: #FFFDF8; border-top: 1px solid rgba(12,26,34,0.06); border-bottom: 1px solid rgba(12,26,34,0.06);")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto; padding: clamp(90px, 11vw, 140px) clamp(20px, 4vw, 40px);")}>

              <div className="rv" style={cssToStyle("display: flex; flex-wrap: wrap; gap: 28px 64px; justify-content: space-between; align-items: flex-end; margin-bottom: 40px;")}>

                <div style={cssToStyle("flex: 1 1 560px; min-width: 0;")}>

                  <p className="kick" style={cssToStyle("color: var(--hz-d); margin-bottom: 22px; display: flex; align-items: center; gap: 12px;")}><span style={cssToStyle("width: 36px; height: 1px; background: currentColor;")}></span>
                    Chapter 06 — Scope</p>


                  <h2 style={cssToStyle("font-size: clamp(36px, 5vw, 68px); line-height: 1; letter-spacing: -0.035em; font-weight: 600;")}>What our tax planning
                    <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400;")}>covers.</span></h2>

                </div>


                <div role="group" aria-label="Filter by audience" style={cssToStyle("display: flex; gap: 8px; flex-wrap: wrap;")}>

                  {(v.covAuds || []).map((a, index) => (
                    <React.Fragment key={index}>


                      <button type="button" className={a.cls} aria-pressed={a.sel} onClick={a.pick}>{a.t}</button>


                    </React.Fragment>
                  ))}

                </div>

              </div>



              <div className="rv" style={cssToStyle("border-top: 1px solid rgba(12,26,34,0.14);")}>

                {(v.covers || []).map((c, index) => (
                  <React.Fragment key={index}>


                    <div style={cssToStyle(("border-bottom: 1px solid rgba(12,26,34,0.14); opacity: " + (c.op) + "; transition: opacity .4s;"))}>

                      <h3 style={cssToStyle("margin: 0;")}><button type="button" className="idx" aria-expanded={c.exp} aria-controls={c.pid} onClick={c.toggle}>

                        <span className="mono" style={cssToStyle("flex: none; width: 44px; font-size: 13px; color: var(--hz-d); font-weight: 400;")}>{c.n}</span>


                        <span className="idx-t" style={cssToStyle("flex: 1; min-width: 0; font-size: clamp(22px, 3vw, 40px); letter-spacing: -0.03em; font-weight: 600; line-height: 1.1;")}>{c.t}</span>


                        <span className="mono hide-sm" style={cssToStyle("flex: none; font-size: 11px; letter-spacing: 0.08em; color: #4F5B60; font-weight: 400;")}>{c.tags}</span>


                        <span className={c.icCls} aria-hidden="true"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14"></path></svg></span>

                      </button></h3>


                      {(c.open) && (
                        <React.Fragment>


                          <div id={c.pid} className="fade-up" style={cssToStyle("display: flex; flex-wrap: wrap; gap: 24px 48px; padding: 0 0 36px 84px;")}>

                            <p style={cssToStyle("flex: 1 1 420px; min-width: 0; font-size: 18px; line-height: 1.65; color: #3E4A50;")}>{c.d}</p>


                            <div style={cssToStyle("flex: 0 1 300px; min-width: 0; padding: 22px; border-radius: 20px; background: #0C1A22; color: #E9EEF0;")}>

                              <p className="mono" style={cssToStyle("font-size: 10px; letter-spacing: 0.14em; color: var(--hz); text-transform: uppercase;")}>The question it answers</p>


                              <p className="serif" style={cssToStyle("margin-top: 10px; font-size: 22px; line-height: 1.3; font-style: italic; color: #fff;")}>{c.q}</p>

                            </div>

                          </div>


                        </React.Fragment>
                      )}

                    </div>


                  </React.Fragment>
                ))}

              </div>

            </div>

          </section>



          {/*  ================= 07 PROCESS LOOP =================  */}


          <section id="process" style={cssToStyle("position: relative; background: #0C1A22; color: #E9EEF0; overflow: hidden;")}>

            <div className="gridbg" aria-hidden="true" style={cssToStyle("position: absolute; inset: 0; opacity: 0.6;")}></div>


            <div style={cssToStyle("position: relative; max-width: 1240px; margin: 0 auto; padding: clamp(90px, 11vw, 140px) clamp(20px, 4vw, 40px);")}>

              <div className="rv" style={cssToStyle("max-width: 820px; margin-bottom: 64px;")}>

                <p className="kick" style={cssToStyle("color: var(--hz); margin-bottom: 22px; display: flex; align-items: center; gap: 12px;")}><span style={cssToStyle("width: 36px; height: 1px; background: currentColor;")}></span>
                  Chapter 07 — Process</p>


                <h2 style={cssToStyle("font-size: clamp(36px, 5vw, 68px); line-height: 1; letter-spacing: -0.035em; font-weight: 600; color: #fff;")}>Planning isn't a step.
                  <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400; color: var(--hz);")}>It's a loop.</span></h2>

              </div>



              <div style={cssToStyle("display: flex; flex-wrap: wrap; gap: clamp(48px, 7vw, 100px); align-items: center;")}>

                <div className="rv" style={cssToStyle("flex: 0 1 480px; min-width: 0; width: 100%;")}>

                  <div style={cssToStyle("position: relative; width: min(440px, 82%); aspect-ratio: 1 / 1; margin: 40px auto;")}>

                    <div aria-hidden="true" style={cssToStyle("position: absolute; inset: 0; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.14);")}></div>


                    <div aria-hidden="true" style={cssToStyle(("position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(from 0deg, var(--hz) 0deg " + (v.loopDeg) + "deg, transparent " + (v.loopDeg) + "deg); -webkit-mask: radial-gradient(circle closest-side, transparent 98.6%, #000 99%); mask: radial-gradient(circle closest-side, transparent 98.6%, #000 99%); transition: background .6s;"))}></div>


                    <div aria-hidden="true" style={cssToStyle("position: absolute; inset: 0; animation: spin 18s linear infinite; z-index: 4;")}>

                      <svg width="34" height="48" fill="none" style={cssToStyle("position: absolute; left: 50%; top: -46px; margin-left: -17px; overflow: visible;")}>

                        <g className="w-legL"><path d="M45 112 L41 150 L35 151" stroke="#D8CCB2" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"></path></g>


                        <g className="w-legR"><path d="M55 112 L59 150 L65 151" stroke="#D8CCB2" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"></path></g>


                        <path d="M31 68 Q50 58 69 68 L71 116 L29 116 Z" fill="#E6DCC6"></path>


                        <path d="M48.5 65 L51.5 65 L52.5 88 L50 92 L47.5 88 Z" fill="var(--hz)"></path>


                        <g className="w-armL"><path d="M34 70 L24 104" stroke="#E6DCC6" strokeWidth="10" strokeLinecap="round"></path></g>


                        <g className="w-armR"><path d="M66 70 L76 104" stroke="#E6DCC6" strokeWidth="10" strokeLinecap="round"></path></g>


                        <circle cx="50" cy="44" r="18" fill="#C68B67"></circle>


                        <path d="M32 42 Q30 23 50 23 Q70 23 68 42 Q62 32 51 33 Q40 34 32 42 Z" fill="#1E1A17"></path>

                      </svg>

                    </div>


                    <div style={cssToStyle("position: absolute; inset: 22%; border-radius: 50%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;")}>

                      <p className="mono" style={cssToStyle("font-size: clamp(54px, 9vw, 92px); line-height: 1; color: var(--hz); letter-spacing: -0.05em;")}>{v.curStep.n}</p>


                      <p className="mono" style={cssToStyle("margin-top: 6px; font-size: 11px; letter-spacing: 0.16em; color: #A9B6BD;")}>OF 06 · REPEATS</p>

                    </div>


                    {(v.loop || []).map((p, index) => (
                      <React.Fragment key={index}>


                        <button type="button" className={p.cls} style={cssToStyle(("left: " + (p.x) + "%; top: " + (p.y) + "%;"))} aria-pressed={p.sel} aria-label={("Step " + (p.n) + ": " + (p.t))} onClick={p.pick}>{p.n}</button>


                      </React.Fragment>
                    ))}

                  </div>

                </div>



                <div className="rv" style={cssToStyle("flex: 1 1 420px; min-width: 0;")}>

                  <div className="slide-in" aria-live="polite" style={cssToStyle("display: flex; flex-direction: column; gap: 20px;")}>

                    <p className="kick" style={cssToStyle("color: #A9B6BD;")}>Step {v.curStep.n} — {v.curStep.k}</p>


                    <h3 style={cssToStyle("font-size: clamp(30px, 3.4vw, 46px); line-height: 1.04; letter-spacing: -0.03em; font-weight: 600; color: #fff;")}>{v.curStep.t}</h3>


                    <p style={cssToStyle("font-size: 17px; line-height: 1.7; color: #A9B6BD; max-width: 560px;")}>{v.curStep.d}</p>


                    <div style={cssToStyle("display: flex; flex-wrap: wrap; gap: 8px;")}>

                      {(v.curStep.out || []).map((o, index) => (
                        <React.Fragment key={index}>


                          <span style={cssToStyle("padding: 10px 16px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.18); font-size: 14px; color: #E9EEF0;")}>{o}</span>


                        </React.Fragment>
                      ))}

                    </div>


                    <div style={cssToStyle("display: flex; gap: 10px; margin-top: 10px;")}>

                      <button type="button" className="round-d" aria-label="Previous step" onClick={v.prevStep}><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"></path></svg></button>


                      <button type="button" className="round-d" style={cssToStyle("background: var(--hz); border-color: var(--hz); color: #0C1A22;")} aria-label="Next step" onClick={v.nextStep}><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></button>

                    </div>

                  </div>

                </div>

              </div>


              <p className="rv" style={cssToStyle("margin-top: 48px; font-size: 13px; line-height: 1.6; color: #8A989F; max-width: 760px;")}>For ongoing engagements, reviews follow the agreed monthly, quarterly or annual cycle. Scope, timing and communication are agreed before work begins.</p>

            </div>

          </section>



          {/*  ================= 08 WHO WE SUPPORT — EXPANDING PANELS =================  */}


          <section style={cssToStyle("max-width: 1320px; margin: 0 auto; padding: clamp(90px, 11vw, 140px) clamp(20px, 4vw, 40px);")}>

            <div className="rv" style={cssToStyle("display: flex; flex-wrap: wrap; gap: 28px 64px; justify-content: space-between; align-items: flex-end; margin-bottom: 44px;")}>

              <div style={cssToStyle("flex: 1 1 560px; min-width: 0;")}>

                <p className="kick" style={cssToStyle("color: var(--hz-d); margin-bottom: 22px; display: flex; align-items: center; gap: 12px;")}><span style={cssToStyle("width: 36px; height: 1px; background: currentColor;")}></span>
                  Chapter 08 — People</p>


                <h2 style={cssToStyle("font-size: clamp(36px, 5vw, 68px); line-height: 1; letter-spacing: -0.035em; font-weight: 600;")}>Who we plan
                  <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400;")}>with.</span></h2>

              </div>


              <p style={cssToStyle("flex: 1 1 340px; min-width: 0; max-width: 420px; font-size: 17px; line-height: 1.65; color: #4F5B60;")}>Different situations raise different questions. Open the one closest to yours.</p>

            </div>



            <div className="rv who-row">

              {(v.who || []).map((p, index) => (
                <React.Fragment key={index}>


                  <div className={p.pcls} style={cssToStyle(("flex: " + (p.flex) + "; background: " + (p.bg) + "; color: " + (p.fg) + ";"))}>

                    {(p.closed) && (
                      <React.Fragment>


                        <button type="button" className="who-btn" aria-expanded="false" onClick={p.pick}>

                          <span className="mono" style={cssToStyle("font-size: 12px; opacity: 0.7;")}>{p.n}</span>


                          <span className="vt">{p.t}</span>


                          <span style={cssToStyle("width: 40px; height: 40px; border-radius: 50%; border: 1px solid currentColor; display: grid; place-items: center; opacity: 0.6; flex: none;")}><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg></span>

                        </button>


                      </React.Fragment>
                    )}


                    {(p.active) && (
                      <React.Fragment>


                        <div className="fade-up" style={cssToStyle("position: absolute; inset: 0; padding: clamp(26px, 3.4vw, 44px); display: flex; flex-direction: column; gap: 18px; overflow: auto;")}>

                          <p className="serif" aria-hidden="true" style={cssToStyle("position: absolute; right: 24px; top: 0; font-size: 180px; line-height: 1; font-style: italic; opacity: 0.1;")}>{p.n}</p>


                          <p className="mono" style={cssToStyle("position: relative; font-size: 12px; letter-spacing: 0.14em; opacity: 0.8;")}>{p.n} / 05</p>


                          <h3 style={cssToStyle("position: relative; font-size: clamp(28px, 3vw, 42px); line-height: 1.04; letter-spacing: -0.03em; font-weight: 600; max-width: 520px;")}>{p.t}</h3>


                          <p style={cssToStyle("position: relative; font-size: 16px; line-height: 1.65; opacity: 0.88; max-width: 520px;")}>{p.d}</p>


                          <div style={cssToStyle("flex: 1; min-height: 8px;")}></div>


                          <p className="mono" style={cssToStyle("position: relative; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.75;")}>Questions we often hear</p>


                          <ul style={cssToStyle("position: relative; display: flex; flex-direction: column; gap: 8px;")}>

                            {(p.qs || []).map((q, index) => (
                              <React.Fragment key={index}>


                                <li style={cssToStyle(("padding: 14px 16px; border-radius: 14px; background: " + (p.qbg) + "; font-size: 15px; font-weight: 500;"))}>“{q}”</li>


                              </React.Fragment>
                            ))}

                          </ul>


                          <a href={p.href} className={p.btn} style={cssToStyle("position: relative; align-self: flex-start; margin-top: 6px;")}>{p.cta}
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>

                        </div>


                      </React.Fragment>
                    )}

                  </div>


                </React.Fragment>
              ))}

            </div>

          </section>



          {/*  ================= 09 TRUST BENTO =================  */}


          <section style={cssToStyle("background: #EAE3D5; border-top: 1px solid rgba(12,26,34,0.06);")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto; padding: clamp(90px, 11vw, 140px) clamp(20px, 4vw, 40px);")}>

              <div className="rv" style={cssToStyle("max-width: 820px; margin-bottom: 48px;")}>

                <p className="kick" style={cssToStyle("color: var(--hz-d); margin-bottom: 22px; display: flex; align-items: center; gap: 12px;")}><span style={cssToStyle("width: 36px; height: 1px; background: currentColor;")}></span>
                  Chapter 09 — Trust</p>


                <h2 style={cssToStyle("font-size: clamp(36px, 5vw, 68px); line-height: 1; letter-spacing: -0.035em; font-weight: 600;")}>Choosing a partner is more than
                  <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400;")}>comparing prices.</span></h2>

              </div>


              <div style={cssToStyle("display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 270px), 1fr)); gap: 14px;")}>

                <article className="lift rv" style={cssToStyle("grid-row: span 2; border-radius: 28px; padding: 36px; background: #0C1A22; color: #fff; display: flex; flex-direction: column; justify-content: space-between; gap: 40px; min-height: 440px; position: relative; overflow: hidden;")}>

                  <div aria-hidden="true" style={cssToStyle("position: absolute; right: -80px; bottom: -80px; width: 280px; height: 280px; border-radius: 50%; background: radial-gradient(circle, var(--hz) 0%, transparent 70%); opacity: 0.35;")}></div>


                  <p className="mono" style={cssToStyle("position: relative; font-size: 12px; letter-spacing: 0.14em; color: var(--hz);")}>EXPERIENCE</p>


                  <div style={cssToStyle("position: relative;")}>

                    <p style={cssToStyle("font-size: clamp(80px, 9vw, 128px); font-weight: 600; letter-spacing: -0.06em; line-height: 0.85;")}>5+</p>


                    <p className="serif" style={cssToStyle("margin-top: 12px; font-size: 30px; font-style: italic;")}>years in US tax &amp; accounting</p>


                    <p style={cssToStyle("margin-top: 16px; font-size: 15px; line-height: 1.6; color: #A9B6BD; max-width: 360px;")}>Supporting individual taxpayers, businesses and accounting firms — each with different reporting needs.</p>

                  </div>

                </article>


                <article className="lift rv" style={cssToStyle("border-radius: 28px; padding: 30px; background: #FFFDF8; display: flex; flex-direction: column; gap: 12px; min-height: 210px;")}>

                  <p style={cssToStyle("font-size: 56px; font-weight: 600; letter-spacing: -0.05em; line-height: 1;")}>250+</p>


                  <p style={cssToStyle("font-size: 16px; font-weight: 600;")}>Clients served</p>


                  <p style={cssToStyle("font-size: 14px; line-height: 1.6; color: #4F5B60;")}>Across individual, business and CPA-firm engagements.</p>

                </article>


                <article className="lift rv" style={cssToStyle("border-radius: 28px; padding: 30px; background: var(--acc); color: #fff; display: flex; flex-direction: column; gap: 14px; min-height: 210px;")}>

                  <p className="mono" style={cssToStyle("font-size: 11px; letter-spacing: 0.14em; opacity: 0.85;")}>TEAM STRUCTURE</p>


                  <div style={cssToStyle("display: flex; flex-wrap: wrap; gap: 8px;")}><span style={cssToStyle("padding: 8px 14px; border-radius: 999px; background: rgba(255,255,255,0.16); font-size: 14px; font-weight: 600;")}>Accountants</span>
                    <span style={cssToStyle("padding: 8px 14px; border-radius: 999px; background: rgba(255,255,255,0.16); font-size: 14px; font-weight: 600;")}>Reviewers</span>
                    <span style={cssToStyle("padding: 8px 14px; border-radius: 999px; background: rgba(255,255,255,0.16); font-size: 14px; font-weight: 600;")}>Tax specialists</span></div>


                  <p style={cssToStyle("font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.9);")}>Preparation and review responsibilities organised around each engagement.</p>

                </article>


                <article className="lift rv" style={cssToStyle("border-radius: 28px; padding: 30px; background: #FFFDF8; display: flex; flex-direction: column; gap: 12px; min-height: 210px;")}>

                  <p className="mono" style={cssToStyle("font-size: 11px; letter-spacing: 0.14em; color: var(--hz-d);")}>BEYOND TAX SEASON</p>


                  <p style={cssToStyle("font-size: 22px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.2;")}>Planning, bookkeeping and payroll accounting, arranged year-round.</p>

                </article>


                <article className="lift rv" style={cssToStyle("border-radius: 28px; padding: 30px; background: #FFFDF8; display: flex; flex-direction: column; gap: 12px; min-height: 210px;")}>

                  <p className="mono" style={cssToStyle("font-size: 11px; letter-spacing: 0.14em; color: var(--hz-d);")}>COMMUNICATION</p>


                  <p style={cssToStyle("font-size: 22px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.2;")}>What's needed. What's done.
                    <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400;")}>What needs attention.</span></p>

                </article>


                <article className="lift rv" style={cssToStyle("grid-column: 1 / -1; border-radius: 28px; padding: clamp(26px, 3vw, 40px); background: #F7F3EA; border: 1.5px dashed rgba(12,26,34,0.3); display: flex; flex-wrap: wrap; gap: 20px 48px; align-items: center;")}>

                  <p className="serif" style={cssToStyle("flex: 1 1 360px; font-size: clamp(28px, 3.2vw, 44px); line-height: 1.05; font-style: italic;")}>What we won't promise.</p>


                  <p style={cssToStyle("flex: 2 1 420px; min-width: 0; font-size: 17px; line-height: 1.65; color: #3E4A50;")}>A guaranteed refund or a fixed amount of tax savings. Outcomes depend on applicable law and verified information — our focus is accurate work and legitimate opportunities supported by the facts and tax rules.</p>

                </article>

              </div>


              <div className="rv" style={cssToStyle("margin-top: 28px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px 28px; padding: 22px 26px; border-radius: 22px; background: rgba(255,255,255,0.5);")}>

                <p className="mono" style={cssToStyle("font-size: 11px; letter-spacing: 0.14em; color: #4F5B60;")}>SOFTWARE EXPERIENCE</p>


                <p style={cssToStyle("font-size: 16px; font-weight: 600; color: #2E3A40;")}>Drake Tax · Intuit ProConnect · UltraTax CS · CCH ProSystem · ProSeries · QuickBooks</p>

              </div>

            </div>

          </section>



          {/*  ================= 10 FAQ =================  */}


          <section id="faq" style={cssToStyle("max-width: 1240px; margin: 0 auto; padding: clamp(90px, 11vw, 140px) clamp(20px, 4vw, 40px);")}>

            <div className="rv" style={cssToStyle("text-align: center; max-width: 760px; margin: 0 auto 40px;")}>

              <p className="kick" style={cssToStyle("color: var(--hz-d); margin-bottom: 22px; display: inline-flex; align-items: center; gap: 12px;")}><span style={cssToStyle("width: 36px; height: 1px; background: currentColor;")}></span>
                Chapter 10 — Questions
                <span style={cssToStyle("width: 36px; height: 1px; background: currentColor;")}></span></p>


              <h2 style={cssToStyle("font-size: clamp(36px, 5vw, 68px); line-height: 1; letter-spacing: -0.035em; font-weight: 600;")}>Ask us
                <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400;")}>anything.</span></h2>

            </div>


            <div className="rv" style={cssToStyle("max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px;")}>

              <div style={cssToStyle("position: relative;")}>

                <svg aria-hidden="true" width="20" height="20" fill="none" stroke="#4F5B60" strokeWidth="2" strokeLinecap="round" style={cssToStyle("position: absolute; left: 20px; top: 18px;")}><circle cx="11" cy="11" r="7"></circle>
                  <path d="M20 20l-3.5-3.5"></path></svg>


                <label htmlFor="faqsearch" style={cssToStyle("position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0);")}>Search questions</label>


                <input id="faqsearch" className="srch" type="search" placeholder="Search — e.g. estimated tax, S corporation, deadline" value={v.q} onChange={v.setQ} />

              </div>


              <div style={cssToStyle("display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px;")}>

                <div role="group" aria-label="Question category" style={cssToStyle("display: flex; gap: 8px; flex-wrap: wrap;")}>

                  {(v.faqCats || []).map((c, index) => (
                    <React.Fragment key={index}>


                      <button type="button" className={c.cls} aria-pressed={c.sel} onClick={c.pick}>{c.t}</button>


                    </React.Fragment>
                  ))}

                </div>


                <p className="mono" aria-live="polite" style={cssToStyle("font-size: 12px; color: #4F5B60;")}>{v.faqCount}</p>

              </div>


              <div style={cssToStyle("display: flex; flex-direction: column; gap: 10px; margin-top: 8px;")}>

                {(v.faqs || []).map((f, index) => (
                  <React.Fragment key={index}>


                    <div className="faq-c" style={cssToStyle(("box-shadow: " + (f.sh) + ";"))}>

                      <h3 style={cssToStyle("margin: 0;")}><button type="button" className="faq-q" aria-expanded={f.exp} aria-controls={f.pid} onClick={f.toggle}><span style={cssToStyle("display: flex; gap: 16px; align-items: baseline;")}><span className="mono" style={cssToStyle("font-size: 11px; color: var(--hz-d); font-weight: 400; white-space: nowrap;")}>{f.tag}</span>
                        {f.q}</span>
                        <span className={f.icCls} aria-hidden="true"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"></path></svg></span></button></h3>


                      {(f.open) && (
                        <React.Fragment>


                          <div id={f.pid} className="fade-up" style={cssToStyle("padding: 0 64px 24px 24px; font-size: 16px; line-height: 1.7; color: #3E4A50;")}>{f.a}</div>


                        </React.Fragment>
                      )}

                    </div>


                  </React.Fragment>
                ))}


                {(v.faqEmpty) && (
                  <React.Fragment>


                    <div className="fade-up" style={cssToStyle("padding: 40px; border-radius: 20px; border: 1.5px dashed rgba(12,26,34,0.25); text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px;")}>

                      <p className="serif" style={cssToStyle("font-size: 26px; font-style: italic;")}>No matching questions — ask us directly.</p>


                      <a href="#contact" className="btn btn-ink">Ask our team</a>

                    </div>


                  </React.Fragment>
                )}

              </div>

            </div>

          </section>



          {/*  ================= 11 CTA: PLANNING SIGNAL CHECK + FORM =================  */}


          <section id="contact" style={cssToStyle("position: relative; background: #0C1A22; color: #E9EEF0; overflow: hidden;")}>

            <div aria-hidden="true" style={cssToStyle("position: absolute; width: 760px; height: 760px; right: -260px; top: -380px; border-radius: 50%; background: radial-gradient(circle, var(--acc) 0%, transparent 65%); opacity: 0.4; animation: orb 20s ease-in-out infinite;")}></div>


            <div className="gridbg" aria-hidden="true" style={cssToStyle("position: absolute; inset: 0;")}></div>


            <div style={cssToStyle("position: relative; max-width: 1240px; margin: 0 auto; padding: clamp(90px, 11vw, 140px) clamp(20px, 4vw, 40px) 80px;")}>

              <div className="rv" style={cssToStyle("max-width: 900px; margin-bottom: 56px;")}>

                <p className="kick" style={cssToStyle("color: var(--hz); margin-bottom: 22px; display: flex; align-items: center; gap: 12px;")}><span style={cssToStyle("width: 36px; height: 1px; background: currentColor;")}></span>
                  Final chapter — Your move</p>


                <h2 style={cssToStyle("font-size: clamp(40px, 5.8vw, 84px); line-height: 0.96; letter-spacing: -0.04em; font-weight: 600; color: #fff;")}>Make decisions
                  <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400; color: var(--hz);")}>before</span>
                  the opportunity passes.</h2>

              </div>



              <div style={cssToStyle("display: flex; flex-wrap: wrap; gap: 24px; align-items: stretch;")}>

                {/*  signal check  */}


                <div className="rv" style={cssToStyle("flex: 1 1 440px; min-width: 0; border-radius: 30px; padding: clamp(24px, 3vw, 38px); background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column; gap: 22px;")}>

                  <div style={cssToStyle("display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap;")}>

                    <div>

                      <p className="mono" style={cssToStyle("font-size: 11px; letter-spacing: 0.14em; color: var(--hz);")}>PLANNING SIGNAL CHECK</p>


                      <h3 style={cssToStyle("margin-top: 8px; font-size: 26px; letter-spacing: -0.02em; font-weight: 600; color: #fff;")}>Which of these sound like your year?</h3>

                    </div>


                    <div aria-hidden="true" style={cssToStyle("flex: none; width: 92px; height: 128px;")}>

                      {(v.moodCalm) && (
                        <React.Fragment>


                          <svg className="fade-up" width="92" height="128" fill="none">

                            <path d="M45 112 L41 150 L35 151" stroke="#D8CCB2" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"></path>


                            <path d="M55 112 L59 150 L65 151" stroke="#D8CCB2" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"></path>


                            <rect x="46" y="55" width="8" height="9" fill="#A8714F"></rect>


                            <path d="M31 68 Q50 58 69 68 L71 116 L29 116 Z" fill="#E6DCC6"></path>


                            <path d="M45 62 L50 78 L55 62 Z" fill="#FFFFFF"></path>


                            <path d="M48.5 65 L51.5 65 L52.5 88 L50 92 L47.5 88 Z" fill="var(--acc)"></path>


                            <g transform="rotate(10 34 70)"><path d="M34 70 L24 104" stroke="#E6DCC6" strokeWidth="9" strokeLinecap="round"></path>
                              <circle cx="24" cy="106" r="5" fill="#C68B67"></circle></g>


                            <circle cx="50" cy="44" r="17" fill="#C68B67"></circle>


                            <path d="M33 42 Q31 24 50 24 Q69 24 67 42 Q62 32 51 33 Q40 34 33 42 Z" fill="#1E1A17"></path>


                            <path d="M41 46 Q44 43 47 46 M53 46 Q56 43 59 46" stroke="#1E1A17" strokeWidth="1.8" strokeLinecap="round"></path>


                            <path d="M45 52 Q50 57 55 52" stroke="#5B2E1E" strokeWidth="1.8" strokeLinecap="round"></path>


                            <g transform="rotate(45 66 70)"><path d="M66 70 L76 104" stroke="#E6DCC6" strokeWidth="9" strokeLinecap="round"></path></g>


                            <rect x="40" y="92" width="14" height="15" rx="2" fill="#FFFFFF"></rect>
                            <path d="M54 96 q5 0 5 4 q0 4 -5 4" stroke="#FFFFFF" strokeWidth="2"></path>


                            <circle cx="47" cy="102" r="5" fill="#C68B67"></circle>


                            <path className="steam" d="M44 88 q-3 -4 0 -8 q3 -4 0 -8" stroke="#C9D3D8" strokeWidth="1.6" strokeLinecap="round"></path>


                            <path className="steam" style={cssToStyle("animation-delay: .9s;")} d="M50 88 q-3 -4 0 -8 q3 -4 0 -8" stroke="#C9D3D8" strokeWidth="1.6" strokeLinecap="round"></path>

                          </svg>


                        </React.Fragment>
                      )}


                      {(v.moodThink) && (
                        <React.Fragment>


                          <svg className="fade-up" width="92" height="128" fill="none">

                            <path d="M45 112 L41 150 L35 151" stroke="#D8CCB2" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"></path>


                            <path d="M55 112 L59 150 L65 151" stroke="#D8CCB2" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"></path>


                            <rect x="46" y="55" width="8" height="9" fill="#A8714F"></rect>


                            <path d="M31 68 Q50 58 69 68 L71 116 L29 116 Z" fill="#E6DCC6"></path>


                            <path d="M45 62 L50 78 L55 62 Z" fill="#FFFFFF"></path>


                            <path d="M48.5 65 L51.5 65 L52.5 88 L50 92 L47.5 88 Z" fill="var(--acc)"></path>


                            <g transform="rotate(10 34 70)"><path d="M34 70 L24 104" stroke="#E6DCC6" strokeWidth="9" strokeLinecap="round"></path>
                              <circle cx="24" cy="106" r="5" fill="#C68B67"></circle></g>


                            <circle cx="50" cy="44" r="17" fill="#C68B67"></circle>


                            <path d="M33 42 Q31 24 50 24 Q69 24 67 42 Q62 32 51 33 Q40 34 33 42 Z" fill="#1E1A17"></path>


                            <g className="blink"><circle cx="46" cy="42.5" r="2.2" fill="#1E1A17"></circle>
                              <circle cx="58" cy="42.5" r="2.2" fill="#1E1A17"></circle></g>


                            <path d="M46 54 L55 53" stroke="#5B2E1E" strokeWidth="1.8" strokeLinecap="round"></path>


                            <g transform="rotate(-170 66 70)"><g className="scratch"><path d="M66 70 L76 104" stroke="#E6DCC6" strokeWidth="9" strokeLinecap="round"></path>
                              <circle cx="76" cy="106" r="5" fill="#C68B67"></circle></g></g>


                            <text className="qfloat" x="82" y="30" fontFamily="Instrument Serif, Georgia, serif" font-style="italic" fontSize="28" fill="var(--hz)">?</text>

                          </svg>


                        </React.Fragment>
                      )}


                      {(v.moodAlert) && (
                        <React.Fragment>


                          <svg className="fade-up" width="92" height="128" fill="none">

                            <path d="M45 112 L41 150 L35 151" stroke="#D8CCB2" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"></path>


                            <path d="M55 112 L59 150 L65 151" stroke="#D8CCB2" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"></path>


                            <rect x="46" y="55" width="8" height="9" fill="#A8714F"></rect>


                            <path d="M31 68 Q50 58 69 68 L71 116 L29 116 Z" fill="#E6DCC6"></path>


                            <path d="M45 62 L50 78 L55 62 Z" fill="#FFFFFF"></path>


                            <path d="M48.5 65 L51.5 65 L52.5 88 L50 92 L47.5 88 Z" fill="var(--acc)"></path>


                            <circle cx="50" cy="44" r="17" fill="#C68B67"></circle>


                            <path d="M33 42 Q31 24 50 24 Q69 24 67 42 Q62 32 51 33 Q40 34 33 42 Z" fill="#1E1A17"></path>


                            <circle cx="44" cy="45" r="3.2" fill="#1E1A17"></circle>
                            <circle cx="56" cy="45" r="3.2" fill="#1E1A17"></circle>


                            <ellipse cx="50" cy="54" rx="3.5" ry="4" fill="#5B2E1E"></ellipse>


                            <g transform="rotate(150 34 70)"><g className="wave-L"><path d="M34 70 L24 104" stroke="#E6DCC6" strokeWidth="9" strokeLinecap="round"></path>
                              <circle cx="24" cy="106" r="5" fill="#C68B67"></circle></g></g>


                            <g transform="rotate(-150 66 70)"><g className="wave-R"><path d="M66 70 L76 104" stroke="#E6DCC6" strokeWidth="9" strokeLinecap="round"></path>
                              <circle cx="76" cy="106" r="5" fill="#C68B67"></circle></g></g>


                            <text className="bang" x="84" y="30" fontFamily="Inter Tight, sans-serif" fontWeight="700" fontSize="30" fill="var(--hz)">!</text>

                          </svg>


                        </React.Fragment>
                      )}

                    </div>

                  </div>


                  <div style={cssToStyle("display: flex; flex-direction: column; gap: 8px;")}>

                    {(v.checks || []).map((c, index) => (
                      <React.Fragment key={index}>


                        <button type="button" className={c.cls} aria-pressed={c.sel} onClick={c.toggle}><span className="bx"><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg></span>
                          {c.t}</button>


                      </React.Fragment>
                    ))}

                  </div>


                  <div style={cssToStyle("display: flex; flex-wrap: wrap; gap: 24px; align-items: center; padding: 22px; border-radius: 22px; background: rgba(255,255,255,0.05);")}>

                    <div role="img" aria-label={("Planning signal: " + (v.score) + " of 6")} style={cssToStyle("position: relative; width: 180px; height: 96px; flex: none;")}>

                      <div aria-hidden="true" style={cssToStyle(("position: absolute; left: 0; top: 0; width: 180px; height: 180px; border-radius: 50%; background: conic-gradient(from -90deg, var(--hz) 0deg " + (v.gaugeDeg) + "deg, rgba(255,255,255,0.12) " + (v.gaugeDeg) + "deg 180deg, transparent 180deg); -webkit-mask: radial-gradient(circle closest-side, transparent 70%, #000 71%); mask: radial-gradient(circle closest-side, transparent 70%, #000 71%); transition: background .5s;"))}></div>


                      <div aria-hidden="true" style={cssToStyle(("position: absolute; left: 89px; bottom: 6px; width: 2px; height: 74px; background: #fff; transform-origin: bottom center; transform: rotate(" + (v.needleDeg) + "deg); transition: transform .7s cubic-bezier(.3,1.4,.5,1); border-radius: 2px;"))}></div>


                      <div aria-hidden="true" style={cssToStyle("position: absolute; left: 82px; bottom: 0; width: 16px; height: 16px; border-radius: 50%; background: #fff;")}></div>


                      <p className="mono" aria-hidden="true" style={cssToStyle("position: absolute; left: 0; right: 0; top: 34px; text-align: center; font-size: 12px; color: #A9B6BD;")}>{v.score}/6</p>

                    </div>


                    <div className="fade-up" style={cssToStyle("flex: 1 1 200px; min-width: 0;")} aria-live="polite">

                      <p style={cssToStyle("font-size: 20px; font-weight: 600; color: #fff; letter-spacing: -0.01em;")}>{v.sig.t}</p>


                      <p style={cssToStyle("margin-top: 6px; font-size: 14px; line-height: 1.6; color: #A9B6BD;")}>{v.sig.d}</p>

                    </div>

                  </div>


                  <p style={cssToStyle("font-size: 12px; line-height: 1.6; color: #8A989F;")}>A conversation starter, not tax advice. We'll confirm what applies once we understand your situation.</p>

                </div>



                {/*  form  */}


                <div className="rv" style={cssToStyle("flex: 1 1 440px; min-width: 0; border-radius: 30px; padding: clamp(24px, 3vw, 38px); background: #F7F3EA; color: #0C1A22;")}>

                  {(v.notSent) && (
                    <React.Fragment>


                      <form onSubmit={v.submit} style={cssToStyle("display: flex; flex-direction: column; gap: 18px;")}>

                        <div>

                          <p className="mono" style={cssToStyle("font-size: 11px; letter-spacing: 0.14em; color: var(--hz-d);")}>BOOK A PLANNING REVIEW</p>


                          <p style={cssToStyle("margin-top: 8px; font-size: 26px; letter-spacing: -0.02em; font-weight: 600;")}>Tell us what you need help with.</p>

                        </div>


                        <fieldset style={cssToStyle("border: 0; padding: 0;")}>

                          <legend style={cssToStyle("font-size: 13px; font-weight: 600; color: #3E4A50; margin-bottom: 10px; padding: 0;")}>I am</legend>


                          <div style={cssToStyle("display: flex; flex-wrap: wrap; gap: 8px;")}>

                            {(v.whoAm || []).map((w, index) => (
                              <React.Fragment key={index}>


                                <button type="button" className={w.cls} aria-pressed={w.sel} onClick={w.pick}>{w.t}</button>


                              </React.Fragment>
                            ))}

                          </div>

                        </fieldset>


                        <fieldset style={cssToStyle("border: 0; padding: 0;")}>

                          <legend style={cssToStyle("font-size: 13px; font-weight: 600; color: #3E4A50; margin-bottom: 10px; padding: 0;")}>I'd like to start</legend>


                          <div style={cssToStyle("display: flex; flex-wrap: wrap; gap: 8px;")}>

                            {(v.whenOpts || []).map((w, index) => (
                              <React.Fragment key={index}>


                                <button type="button" className={w.cls} aria-pressed={w.sel} onClick={w.pick}>{w.t}</button>


                              </React.Fragment>
                            ))}

                          </div>

                        </fieldset>


                        <div style={cssToStyle("display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px;")}>

                          <div className="field"><label htmlFor="f-name">Full name</label>
                            <input id="f-name" type="text" autoComplete="name" placeholder="Jane Carter" /></div>


                          <div className="field"><label htmlFor="f-email">Email</label>
                            <input id="f-email" type="email" autoComplete="email" placeholder="jane@company.com" /></div>

                        </div>


                        <div className="field"><label htmlFor="f-msg">What's changing this year?</label>
                          <textarea id="f-msg" rows="3" placeholder={v.msgPh} style={cssToStyle("min-height: 110px; resize: vertical;")}></textarea></div>


                        <button type="submit" className="btn btn-ink" style={cssToStyle("width: 100%; min-height: 58px; font-size: 16px;")}>{v.submitLabel}
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></button>


                        <p style={cssToStyle("font-size: 12px; line-height: 1.5; color: #4F5B60;")}>We'll reply to discuss scope before any work begins. Please don't send tax documents through this form.</p>

                      </form>


                    </React.Fragment>
                  )}


                  {(v.sent) && (
                    <React.Fragment>


                      <div className="fade-up" aria-live="polite" style={cssToStyle("min-height: 460px; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 18px;")}>

                        <svg aria-hidden="true" width="150" height="178" fill="none" style={cssToStyle("overflow: visible;")}>

                          <rect className="conf" x="14" y="-20" width="8" height="12" rx="2" fill="var(--hz)"></rect>


                          <rect className="conf" style={cssToStyle("animation-delay: .4s;")} x="42" y="-24" width="7" height="10" rx="2" fill="var(--acc)"></rect>


                          <rect className="conf" style={cssToStyle("animation-delay: .9s;")} x="110" y="-22" width="8" height="12" rx="2" fill="#6FB1F2"></rect>


                          <rect className="conf" style={cssToStyle("animation-delay: 1.3s;")} x="136" y="-18" width="7" height="10" rx="2" fill="var(--hz)"></rect>


                          <rect className="conf" style={cssToStyle("animation-delay: 1.8s;")} x="76" y="-24" width="7" height="11" rx="2" fill="#E5866A"></rect>


                          <ellipse cx="80" cy="160" rx="34" ry="5" fill="rgba(12,26,34,0.15)"></ellipse>


                          <g className="jump"><g transform="translate(30 6)">

                            <path d="M45 112 L41 150 L35 151" stroke="#14232E" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"></path>


                            <path d="M55 112 L59 150 L65 151" stroke="#14232E" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"></path>


                            <rect x="46" y="55" width="8" height="9" fill="#A8714F"></rect>


                            <path d="M31 68 Q50 58 69 68 L71 116 L29 116 Z" fill="#1F3A4D"></path>


                            <path d="M45 62 L50 78 L55 62 Z" fill="#FFFFFF"></path>


                            <path d="M48.5 65 L51.5 65 L52.5 88 L50 92 L47.5 88 Z" fill="var(--hz)"></path>


                            <circle cx="50" cy="44" r="17" fill="#C68B67"></circle>


                            <path d="M33 42 Q31 24 50 24 Q69 24 67 42 Q62 32 51 33 Q40 34 33 42 Z" fill="#1E1A17"></path>


                            <path d="M41 46 Q44 43 47 46 M53 46 Q56 43 59 46" stroke="#1E1A17" strokeWidth="1.8" strokeLinecap="round"></path>


                            <path d="M43 51 Q50 60 57 51 Z" fill="#5B2E1E"></path>


                            <g transform="rotate(150 34 70)"><g className="wave-L"><path d="M34 70 L24 104" stroke="#1F3A4D" strokeWidth="9" strokeLinecap="round"></path>
                              <circle cx="24" cy="106" r="5" fill="#C68B67"></circle></g></g>


                            <g transform="rotate(-150 66 70)"><g className="wave-R"><path d="M66 70 L76 104" stroke="#1F3A4D" strokeWidth="9" strokeLinecap="round"></path>
                              <circle cx="76" cy="106" r="5" fill="#C68B67"></circle></g></g>

                          </g></g>

                        </svg>


                        <p className="serif" style={cssToStyle("font-size: 40px; font-style: italic; line-height: 1.05;")}>Thank you — we'll be in touch.</p>


                        <p style={cssToStyle("font-size: 15px; color: #4F5B60;")}>We'll review your situation and suggest the right starting point.</p>


                        <button type="button" className="btn btn-line" onClick={v.reset}>Send another enquiry</button>

                      </div>


                    </React.Fragment>
                  )}

                </div>

              </div>

            </div>



            <footer style={cssToStyle("position: relative; border-top: 1px solid rgba(255,255,255,0.1);")}>

              <div style={cssToStyle("max-width: 1240px; margin: 0 auto; padding: 32px clamp(20px, 4vw, 40px) 40px; display: flex; flex-wrap: wrap; gap: 20px 48px; justify-content: space-between; align-items: flex-start;")}>

                <div style={cssToStyle("display: flex; flex-direction: column; gap: 10px;")}>

                  <p style={cssToStyle("font-size: 16px; font-weight: 600; color: #fff;")}>Smart Tax
                    <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400; color: var(--acc-l);")}>Expertss</span></p>


                  <p className="serif" style={cssToStyle("font-size: 17px; font-style: italic; color: #A9B6BD;")}>Practical US tax and accounting support, built around your requirements.</p>

                </div>


                <nav aria-label="Related services" style={cssToStyle("display: flex; flex-wrap: wrap; gap: 4px 22px;")}>

                  <a className="navlink" href="#top">Tax Preparation</a>


                  <a className="navlink" href="#top">Bookkeeping</a>


                  <a className="navlink" href="#top">Payroll Services</a>


                  <a className="navlink" href="#top">CPA Tax Outsourcing</a>


                  <a className="navlink" href="#contact">Contact</a>

                </nav>


                <p style={cssToStyle("flex: 1 1 100%; font-size: 12px; line-height: 1.65; color: #8A989F; max-width: 980px;")}>Tax preparation, tax advice, filing, payroll and representation are distinct activities and may be subject to different professional, authorisation and jurisdictional requirements. Services under each engagement are subject to applicable US federal and state laws, the client's circumstances and the agreed scope of work. Any return or tax position requiring professional approval must be reviewed and authorised by an appropriately qualified and authorised professional.</p>

              </div>

            </footer>

          </section>


        </div>


      </>
    );
  }
}

export default TaxPlanningPage;
