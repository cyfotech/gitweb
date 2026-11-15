import React from 'react';
import BackToServices from '../../components/navigation/BackToServices';
import ScrollNavigation from '../../components/navigation/ScrollNavigation';
import { inquiriesApi } from '../../api/inquiries';


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

var SVC = [
  {
    num: "01", form: "1040", short: "Individual", tag: "Individuals & families", title: "Individual Tax Preparation",
    desc: "Personal federal income tax returns for employees, freelancers, independent contractors and the self-employed — including when income comes from several sources or circumstances change.",
    items: ["Form 1040 preparation", "W-2 and 1099 income reporting", "Self-employment and freelance income", "Investment income, capital gains and losses", "Review of eligible deductions and credits", "Schedule C and supporting schedules", "Amended returns and documentation", "Extension-related preparation support"]
  },
  {
    num: "02", form: "Sch C", short: "Sole Proprietorship", tag: "Business", title: "Sole Proprietorships",
    desc: "Business income and expenses prepared alongside the owner's individual return, including applicable Schedule C reporting.",
    items: ["Schedule C business income and expenses", "Prepared with the owner's Form 1040", "Self-employment reporting", "Expense records organised for review"]
  },
  {
    num: "03", form: "1065", short: "Partnership", tag: "Business", title: "Partnerships",
    desc: "Partnership income tax returns, prepared with the related Schedule K-1 information for each partner.",
    items: ["Form 1065 preparation", "Schedule K-1 information", "Supporting schedules and workpapers", "Organised for partner or firm review"]
  },
  {
    num: "04", form: "1120-S", short: "S Corporation", tag: "Business", title: "S Corporations",
    desc: "Form 1120-S and the related shareholder reporting schedules, prepared from the company's records.",
    items: ["Form 1120-S preparation", "Shareholder reporting schedules", "Supporting schedules and workpapers", "Books reviewed before preparation"]
  },
  {
    num: "05", form: "1120", short: "C Corporation", tag: "Business", title: "C Corporations",
    desc: "Corporate income tax returns on Form 1120 with the relevant supporting schedules.",
    items: ["Form 1120 preparation", "Relevant supporting schedules", "Tax workpapers and documentation", "Books reviewed before preparation"]
  },
  {
    num: "06", form: "LLC", short: "LLC", tag: "Business", title: "Limited Liability Companies",
    desc: "Prepared according to the LLC's federal tax classification — a disregarded entity, a partnership or a corporation, depending on its structure and elections.",
    items: ["Classification confirmed first", "Return type matched to the entity", "Supporting schedules where applicable", "Try the classifier below"]
  }
];
var LLC = [
  { label: "Single-member, no election", treated: "Disregarded entity", ret: "Owner's return · e.g. Sch C + 1040", note: "For an individual owner, business activity is generally reported on the owner's own return." },
  { label: "Multi-member, no election", treated: "Partnership", ret: "Form 1065 + Schedule K-1s", note: "By default, an LLC with two or more members is generally treated as a partnership." },
  { label: "Elected S corporation status", treated: "S corporation", ret: "Form 1120-S", note: "An eligible LLC can elect S corporation treatment, which changes the return and shareholder reporting." },
  { label: "Elected corporate treatment", treated: "C corporation", ret: "Form 1120", note: "An LLC can elect to be taxed as a corporation, filing a corporate income tax return." }
];
var MONTHS = [["Jan", 0.45, ""], ["Feb", 0.72, ""], ["Mar", 1, "Mar 15"], ["Apr", 0.98, "Apr 15"], ["May", 0.32, ""], ["Jun", 0.26, ""], ["Jul", 0.28, ""], ["Aug", 0.4, ""], ["Sep", 0.86, "Sep 15"], ["Oct", 0.8, "Oct 15"], ["Nov", 0.24, ""], ["Dec", 0.22, ""]];
var DOCS = [
  { form: "1120-S", name: "S Corporation Return", title: "U.S. Income Tax Return for an S Corporation", status: "In review", items: ["Shareholder & basis records received", "Books reconciled to the return", "Form 1120-S prepared & balanced", "Reviewer sign-off complete"] },
  { form: "1065", name: "Partnership Return", title: "U.S. Return of Partnership Income", status: "Preparing", items: ["Trial balance & records received", "Supporting schedules & workpapers", "Schedule K-1 information", "Reviewer check complete"] },
  { form: "1040", name: "Individual Return", title: "U.S. Individual Income Tax Return", status: "Ready", items: ["W-2 / 1099 income organised", "Deductions & credits reviewed", "Form 1040 prepared", "Final review & handover"] },
  { form: "SUPPORT", name: "Supporting Documents", title: "Organised supporting documentation", status: "Preparing", items: ["Income statements collected", "Expense records organised", "Supporting schedules matched", "Ready for preparation"] }
];
var DOCS = [
  { form: "1120-S", name: "S Corporation Return", title: "U.S. Income Tax Return for an S Corporation", status: "In review", items: ["Shareholder & basis records received", "Books reconciled to the return", "Form 1120-S prepared & balanced", "Reviewer sign-off complete"] },
  { form: "1065", name: "Partnership Return", title: "U.S. Return of Partnership Income", status: "Preparing", items: ["Trial balance & records received", "Supporting schedules & workpapers", "Schedule K-1 information", "Reviewer check complete"] },
  { form: "1040", name: "Individual Return", title: "U.S. Individual Income Tax Return", status: "Ready", items: ["W-2 / 1099 income organised", "Deductions & credits reviewed", "Form 1040 prepared", "Final review & handover"] },
  { form: "SUPPORT", name: "Supporting Documents", title: "Organised supporting documentation", status: "Preparing", items: ["Income statements collected", "Expense records organised", "Supporting schedules matched", "Ready for preparation"] }
];
var STEPS = [
  { t: "Understand your requirements", d: "We start by understanding whether you need individual tax preparation, business tax support, bookkeeping, or outsourcing assistance for your CPA firm." },
  { t: "Collect financial documents", d: "We identify the information and supporting documents the engagement needs — income statements, expense records, prior-year returns, accounting reports and other relevant documentation." },
  { t: "Organise and prepare", d: "Our accountants and tax specialists organise the information and prepare the return or accounting workpapers using the agreed software and workflow." },
  { t: "Review and quality checks", d: "Prepared work is checked against the available information and preparation requirements. Missing information or points needing clarification are flagged for resolution." },
  { t: "Finalisation and handover", d: "Completed work is shared through the agreed process for final review, approval and filing by the responsible taxpayer or authorised tax professional." }
];
var AUD = [
  { t: "Individuals & Families", d: "For taxpayers who need support preparing personal income tax returns and organising tax-related documentation.", cta: "Get in Touch", href: "#contact", forms: [{ l: "Personal income tax return", f: "1040" }, { l: "Wage & contractor income", f: "W-2 · 1099" }, { l: "Amendments", f: "Amended" }] },
  { t: "Small & Medium Businesses", d: "For businesses that need tax preparation, bookkeeping and accounting support aligned with their business structure.", cta: "Discuss Your Requirements", href: "#contact", forms: [{ l: "Partnership return", f: "1065" }, { l: "S corporation return", f: "1120-S" }, { l: "C corporation return", f: "1120" }] },
  { t: "Self-Employed & Contractors", d: "For individuals managing business income, expenses and applicable self-employment reporting requirements.", cta: "Get in Touch", href: "#contact", forms: [{ l: "Business income & expenses", f: "Sch C" }, { l: "Individual return", f: "1040" }, { l: "Contractor income", f: "1099" }] },
  { t: "US CPA Firms", d: "For firms looking for offshore tax preparation, bookkeeping and accounting support to manage workloads and improve operational capacity.", cta: "Discuss CPA Outsourcing", href: "#outsourcing", forms: [{ l: "Individual & business returns", f: "1040 · 1065" }, { l: "Supporting schedules & workpapers", f: "WP" }, { l: "Bookkeeping & data organisation", f: "GL" }] },
  { t: "Tax Professionals & EAs", d: "For tax professionals who need additional preparation support for individual or business returns, subject to the agreed scope of work.", cta: "Discuss Your Requirements", href: "#contact", forms: [{ l: "Individual returns", f: "1040" }, { l: "Business returns", f: "1120 · 1120-S" }, { l: "Tax-season workload", f: "Peak" }] }
];
var FAQ = [
  ["What US tax preparation services does Smart Tax Expertss provide?", "Tax preparation support for individuals and businesses, including Form 1040, Form 1065, Form 1120-S and Form 1120 preparation, plus bookkeeping, accounting and tax outsourcing support for CPA firms."],
  ["Do you provide tax preparation services for US CPA firms?", "Yes. We provide offshore tax preparation and accounting support for US CPA firms and accounting practices. The engagement is shaped around return types, workload, software, documentation requirements and your firm's workflow."],
  ["Which tax preparation software does your team use?", "Drake, Intuit ProConnect, UltraTax CS, QuickBooks, CCH ProSystem fx and ProSeries, among other platforms. The software used depends on the client's or CPA firm's requirements."],
  ["Can you prepare both individual and business tax returns?", "Yes — including Form 1040, partnership returns, S corporation returns and C corporation returns, depending on the engagement."],
  ["Do you provide bookkeeping services along with tax preparation?", "Yes. Bookkeeping and accounting support includes transaction categorisation, reconciliations, expense organisation and other agreed tasks that keep records ready for tax preparation."],
  ["How experienced is the Smart Tax Expertss team?", "Smart Tax Expertss has 5–10 years of experience, supported by a mixed team of accountants, reviewers and tax specialists."],
  ["How many clients has Smart Tax Expertss served?", "The company has a client base of 250–500. The nature and scope of services vary according to each client's requirements."],
  ["Can a CPA firm outsource only selected tax preparation tasks?", "Yes. You can outsource specific work such as individual returns, business returns, supporting schedules, workpapers or bookkeeping tasks. The scope is defined before the engagement begins."],
  ["Do you provide support for state tax returns?", "State tax preparation support can be discussed based on the relevant state, taxpayer circumstances and scope of work. Requirements vary by state, so they're established before preparation begins."],
  ["Does Smart Tax Expertss file tax returns directly with the IRS?", "Filing arrangements depend on the engagement and the applicable authorisations, credentials and filing requirements. The taxpayer or responsible authorised tax professional remains responsible for ensuring the return is reviewed, approved and filed through the appropriate process."]
];
var ENQ = [
  { id: "tax", t: "Individual / business tax", label: "Tell us about your return", ph: "e.g. Form 1040 with freelance income, or an S corp return for 2025", submit: "Get in Touch" },
  { id: "cpa", t: "CPA outsourcing", label: "Tell us about your firm's workload", ph: "Return types, approximate volume, software (Drake, UltraTax CS…) and review process", submit: "Discuss CPA Outsourcing" },
  { id: "bk", t: "Bookkeeping", label: "Tell us about your books", ph: "Accounting software, number of accounts, monthly or catch-up support", submit: "Request a Consultation" }
];
var CPA_ITEMS = ["Individual tax returns", "Business tax returns", "Form 1040 support", "Partnerships — Form 1065", "S corporations — Form 1120-S", "C corporations — Form 1120", "Supporting schedules & workpapers", "Bookkeeping & data organisation", "Data entry & documentation", "Amended return support", "Tax-season workload assistance"];
var SOFTWARE = [{ n: "Drake Tax", v: "TAX" }, { n: "Intuit ProConnect", v: "TAX" }, { n: "UltraTax CS", v: "THOMSON REUTERS" }, { n: "CCH ProSystem fx", v: "TAX" }, { n: "ProSeries", v: "TAX" }, { n: "QuickBooks", v: "ACCOUNTING" }, { n: "Other tools", v: "BY ENGAGEMENT" }];
var MARQUEE_BASE = ["Drake Tax", "Intuit ProConnect", "Thomson Reuters UltraTax CS", "QuickBooks", "CCH ProSystem fx", "ProSeries"];
var BK = ["Recording & categorising transactions", "Bank & credit card reconciliations", "Accounts payable & receivable support", "Expense tracking & organisation", "General ledger maintenance", "Financial data preparation", "Monthly bookkeeping support", "QuickBooks-based assistance"];
var LEDGER = [{ code: "BNK", name: "Operating account", status: "Matched" }, { code: "CC", name: "Business credit card", status: "Matched" }, { code: "A/P", name: "Vendor bills", status: "Categorised" }, { code: "A/R", name: "Customer invoices", status: "Categorised" }, { code: "GL", name: "General ledger", status: "Reconciled" }];
var COMPLIANCE = [
  { t: "State Tax Preparation Support", tag: "By state", d: "State requirements differ by circumstances, business activity and state rules. We discuss state income tax return preparation based on the information and filing requirements provided." },
  { t: "Payroll Tax Support", tag: "Business", d: "Payroll-related requirements involve compensation records, withholding information and reporting obligations. Support is scoped to your business requirements." },
  { t: "Amended Tax Returns", tag: "Corrections", d: "When a filed return needs correcting, we prepare the amended return using the corrected information and supporting documentation provided." },
  { t: "Tax Extensions & Documentation", tag: "Deadlines", d: "Preparation support for extension-related requirements and organised documentation. An extension to file generally does not extend the time to pay tax due." },
  { t: "International & Foreign Reporting", tag: "Case by case", d: "Cross-border income, foreign financial interests and international activity can add US reporting requirements. We assess the specific forms, records and review needed before proceeding." }
];
var WHY = [
  { t: "A client base of 250–500", d: "Experience supporting different client requirements and engagement types." },
  { t: "Accountants, reviewers & tax specialists", d: "A mixed team covering preparation, documentation and review." },
  { t: "Fluent in established software", d: "Drake, ProConnect, UltraTax, QuickBooks, CCH ProSystem fx and ProSeries." },
  { t: "Direct clients and CPA firms", d: "Individuals, business owners and firms needing more preparation capacity." },
  { t: "Practical, process-led", d: "Organised records, clear communication and a defined workflow — requirements first." }
];
var ACC_LIGHT = { "#17694F": "#86D9B5", "#1F4FB8": "#A9C1FF", "#6B3FA0": "#D2B8F5", "#9A4A12": "#F4B886" };
var DEF = { mode: "direct", svc: 0, auto: true, llc: 0, peak: 120, cap: 80, step: 0, aud: 0, faq: 0, enq: "tax", sent: false, doc: 0, docSeq: 0, chk: 0 };

function pad(n) { return n < 10 ? "0" + n : "" + n; }

class TaxPreparationPage extends React.Component {
  s() { return Object.assign({}, DEF, this.state || {}); }
  componentDidMount() {
    var self = this;
    this._t = setInterval(function () {
      var s = self.s();
      if (s.auto) self.setState({ svc: (s.svc + 1) % SVC.length });
    }, 7000);
    this._d = setInterval(function () {
      var s = self.s();
      var D = DOCS[(s.doc || 0) % DOCS.length];
      if ((s.chk || 0) < D.items.length) {
        self.setState({ chk: (s.chk || 0) + 1 });
      } else {
        self.setState({ doc: (s.doc + 1) % DOCS.length, chk: 0, docSeq: (s.docSeq || 0) + 1 });
      }
    }, 1600);
  }
  componentWillUnmount() { clearInterval(this._t); clearInterval(this._d); }

  renderVals() {
    var self = this;
    var s = this.s();
    var accent = this.props.accent ?? "#17694F";
    var animOn = this.props.animations ?? true;

    var slides = SVC.map(function (x, i) {
      return Object.assign({}, x, {
        active: i === s.svc,
        cls: i === s.svc ? "rail-btn on" : "rail-btn",
        sel: i === s.svc ? "true" : "false",
        pick: function () { self.setState({ svc: i, auto: false }); }
      });
    });

    var llcOpts = LLC.map(function (o, i) {
      return Object.assign({}, o, {
        active: i === s.llc,
        cls: i === s.llc ? "chip on" : "chip",
        pressed: i === s.llc ? "true" : "false",
        pick: function () { self.setState({ llc: i }); }
      });
    });

    var peak = s.peak, cap = s.cap;
    var maxV = Math.max(peak, cap) * 1.08;
    var monthsOver = 0, overflowSum = 0;
    var bars = MONTHS.map(function (m) {
      var d = peak * m[1];
      var inV = Math.min(d, cap);
      var ov = Math.max(0, d - cap);
      if (ov > 0.5) { monthsOver++; overflowSum += ov; }
      var total = d / maxV * 100;
      return {
        m: m[0], deadline: m[2],
        total: total.toFixed(2) + "%",
        inShare: (d > 0 ? inV / d * 100 : 0).toFixed(2) + "%",
        ovShare: (d > 0 ? ov / d * 100 : 0).toFixed(2) + "%",
        inColor: ov > 0.5 ? "#0C1A22" : "#B9CCC3",
        inRadius: ov > 0.5 ? "0" : "6px 6px 0 0"
      };
    });
    var peakGap = Math.max(0, peak - cap);
    var annual = Math.round(overflowSum * 4.33);

    var steps = STEPS.map(function (p, i) {
      return Object.assign({}, p, {
        n: pad(i + 1),
        active: i === s.step,
        cls: i === s.step ? "step-btn on" : (i < s.step ? "step-btn done" : "step-btn"),
        sel: i === s.step ? "true" : "false",
        pick: function () { self.setState({ step: i }); }
      });
    });

    var aud = AUD.map(function (a, i) {
      return Object.assign({}, a, {
        n: pad(i + 1),
        active: i === s.aud,
        cls: i === s.aud ? "chip on" : "chip",
        sel: i === s.aud ? "true" : "false",
        pick: function () { self.setState({ aud: i }); }
      });
    });

    var faqs = FAQ.map(function (f, i) {
      var open = i === s.faq;
      return {
        n: pad(i + 1), q: f[0], a: f[1], open: open,
        exp: open ? "true" : "false", pid: "faq-a-" + i,
        icCls: open ? "faq-ic open" : "faq-ic",
        toggle: function () { self.setState({ faq: open ? -1 : i }); }
      };
    });

    var cur = ENQ[0];
    var enq = ENQ.map(function (e) {
      if (e.id === s.enq) cur = e;
      return {
        t: e.t,
        cls: e.id === s.enq ? "chip chip-d on" : "chip chip-d",
        pressed: e.id === s.enq ? "true" : "false",
        pick: function () { self.setState({ enq: e.id }); }
      };
    });

    var isDirect = s.mode === "direct";

    return {
      accent: accent,
      accentLight: ACC_LIGHT[accent] || "#86D9B5",
      animCls: animOn ? "" : "anim-off",

      modeDirect: isDirect, modeCpa: !isDirect,
      segDirect: isDirect ? "seg on" : "seg", segCpa: isDirect ? "seg" : "seg on",
      pressDirect: isDirect ? "true" : "false", pressCpa: isDirect ? "false" : "true",
      toDirect: function () { self.setState({ mode: "direct" }); },
      toCpa: function () { self.setState({ mode: "cpa" }); },

      marquee: MARQUEE_BASE.concat(MARQUEE_BASE),

      slides: slides,
      auto: s.auto,
      autoLabel: s.auto ? "Pause autoplay" : "Play autoplay",
      autoPressed: s.auto ? "true" : "false",
      toggleAuto: function () { self.setState({ auto: !self.s().auto }); },
      prevSlide: function () { var c = self.s(); self.setState({ svc: (c.svc - 1 + SVC.length) % SVC.length, auto: false }); },
      nextSlide: function () { var c = self.s(); self.setState({ svc: (c.svc + 1) % SVC.length, auto: false }); },
      doc: s.doc,
      docKey: s.doc + "-" + (s.docSeq || 0),
      curDoc: DOCS[s.doc % DOCS.length],
      chk: s.chk || 0,
      progPct: Math.min(100, Math.round((s.chk || 0) / DOCS[s.doc % DOCS.length].items.length * 100)),
      docDone: (s.chk || 0) >= DOCS[s.doc % DOCS.length].items.length,
      activeStep: Math.min((s.chk || 0), 3),
      tlWidth: (Math.min((s.chk || 0), 3) / 3 * 100) + "%",
      miles: (function () {
        var st = Math.min((s.chk || 0), 3);
        var out = [];
        for (var i = 0; i < 4; i++) {
          var t = i / 3 * 100;
          out.push({ i: i, p: t, done: i < st, active: i === st });
        }
        return out;
      })(),
      prevDoc: function () { var c = self.s(); self.setState({ doc: (c.doc - 1 + DOCS.length) % DOCS.length, chk: 0, docSeq: (c.docSeq || 0) + 1 }); },
      nextDoc: function () { var c = self.s(); self.setState({ doc: (c.doc + 1) % DOCS.length, chk: 0, docSeq: (c.docSeq || 0) + 1 }); },

      llcOpts: llcOpts,

      cpaItems: CPA_ITEMS,
      software: SOFTWARE,
      peak: peak, cap: cap,
      setPeak: function (e) { self.setState({ peak: Number(e.target.value) }); },
      setCap: function (e) { self.setState({ cap: Number(e.target.value) }); },
      bars: bars,
      capLine: (cap / maxV * 100).toFixed(2) + "%",
      peakGap: peakGap,
      monthsOver: monthsOver,
      annual: annual.toLocaleString("en-US"),
      chartLabel: "Illustrative monthly workload against in-house capacity of " + cap + " returns per week. " + monthsOver + " months exceed capacity, with about " + annual + " returns of overflow per year.",

      bkItems: BK.map(function (t, i) { return { n: pad(i + 1), t: t }; }),
      ledger: LEDGER.map(function (l, i) { return Object.assign({}, l, { delay: (i * 0.6) + "s", delay2: (i * 0.6 + 1.2) + "s" }); }),

      compliance: COMPLIANCE.map(function (c, i) { return Object.assign({}, c, { n: pad(i + 1) }); }),

      steps: steps,
      stepPct: (s.step / (STEPS.length - 1) * 100) + "%",
      prevStep: function () { var c = self.s(); self.setState({ step: Math.max(0, c.step - 1) }); },
      nextStep: function () { var c = self.s(); self.setState({ step: (c.step + 1) % STEPS.length }); },

      why: WHY.map(function (w, i) { return Object.assign({}, w, { n: pad(i + 2) }); }),

      aud: aud,
      faqs: faqs,

      enq: enq,
      msgLabel: cur.label, msgPh: cur.ph, submitLabel: cur.submit,
      sent: s.sent, notSent: !s.sent,
      submitting: s.submitting,
      submitError: s.submitError,
      submit: async function (e) {
        if (e && e.preventDefault) e.preventDefault();
        if (self.state && self.state.submitting) return;

        const nameInput = document.getElementById('f-name');
        const emailInput = document.getElementById('f-email');
        const msgInput = document.getElementById('f-msg');

        const name = (nameInput && nameInput.value || '').trim();
        const email = (emailInput && emailInput.value || '').trim();
        const msg = (msgInput && msgInput.value || '').trim();

        if (!name) {
          self.setState({ submitError: 'Please enter your name.' });
          if (nameInput) nameInput.focus();
          return;
        }
        if (!email || !/.+@.+\..+/.test(email)) {
          self.setState({ submitError: 'Please enter a valid email address.' });
          if (emailInput) emailInput.focus();
          return;
        }

        self.setState({ submitting: true, submitError: '' });
        try {
          await inquiriesApi.submit({
            name,
            email,
            inquiryType: 'USA Tax Preparation Inquiry',
            subject: 'Tax Prep - ' + cur.t,
            message: msg || `Looking for ${cur.t} support.`,
            sourcePage: '/services/usa-tax-preparation'
          });
          self.setState({ sent: true, submitting: false, submitError: '' });
        } catch (err) {
          self.setState({ submitting: false, submitError: err?.message || 'Submission failed. Please try again.' });
        }
      },
      reset: function () { self.setState({ sent: false, submitting: false, submitError: '' }); }
    };
  }

  render() {
    const v = this.renderVals();
    return (
      <>
        <ScrollNavigation />




        <link rel="preconnect" href="https://fonts.googleapis.com" />


        <style>{"/* latin-ext */\n@font-face {\n  font-family: 'Instrument Serif';\n  font-style: italic;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/instrumentserif/v5/jizHRFtNs2ka5fXjeivQ4LroWlx-6zAjgn7MsNo.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Instrument Serif';\n  font-style: italic;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/2fa25405-475d-4188-b6b5-db06c47704ce\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Instrument Serif';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-6zsTjmbI.woff2) format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Instrument Serif';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-6zUTjg.woff2) format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/497c8a41-af96-410b-87dd-17fbf2533956\") format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/c7d02507-2f5e-4ab5-99b2-1f85c8907010\") format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/015c2e1e-9f73-4f8a-89a9-bd7f1f4d9fa2\") format('woff2');\n  unicode-range: U+1F00-1FFF;\n}\n/* greek */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/f4a016c9-7a02-43c6-a13c-9cdb623ccdc4\") format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/f657b6d4-5edf-409c-ba19-e23f5866ce6c\") format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/19150ca4-5c97-46d0-8cb6-7eb480126002\") format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/7425ac7d-302a-4350-823a-05e0e56cddc5\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/497c8a41-af96-410b-87dd-17fbf2533956\") format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/c7d02507-2f5e-4ab5-99b2-1f85c8907010\") format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/015c2e1e-9f73-4f8a-89a9-bd7f1f4d9fa2\") format('woff2');\n  unicode-range: U+1F00-1FFF;\n}\n/* greek */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/f4a016c9-7a02-43c6-a13c-9cdb623ccdc4\") format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/f657b6d4-5edf-409c-ba19-e23f5866ce6c\") format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/19150ca4-5c97-46d0-8cb6-7eb480126002\") format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/7425ac7d-302a-4350-823a-05e0e56cddc5\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(\"/page-assets/497c8a41-af96-410b-87dd-17fbf2533956\") format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(\"/page-assets/c7d02507-2f5e-4ab5-99b2-1f85c8907010\") format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(\"/page-assets/015c2e1e-9f73-4f8a-89a9-bd7f1f4d9fa2\") format('woff2');\n  unicode-range: U+1F00-1FFF;\n}\n/* greek */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(\"/page-assets/f4a016c9-7a02-43c6-a13c-9cdb623ccdc4\") format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(\"/page-assets/f657b6d4-5edf-409c-ba19-e23f5866ce6c\") format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(\"/page-assets/19150ca4-5c97-46d0-8cb6-7eb480126002\") format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(\"/page-assets/7425ac7d-302a-4350-823a-05e0e56cddc5\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(\"/page-assets/497c8a41-af96-410b-87dd-17fbf2533956\") format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(\"/page-assets/c7d02507-2f5e-4ab5-99b2-1f85c8907010\") format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(\"/page-assets/015c2e1e-9f73-4f8a-89a9-bd7f1f4d9fa2\") format('woff2');\n  unicode-range: U+1F00-1FFF;\n}\n/* greek */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(\"/page-assets/f4a016c9-7a02-43c6-a13c-9cdb623ccdc4\") format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(\"/page-assets/f657b6d4-5edf-409c-ba19-e23f5866ce6c\") format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(\"/page-assets/19150ca4-5c97-46d0-8cb6-7eb480126002\") format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Inter Tight';\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(\"/page-assets/7425ac7d-302a-4350-823a-05e0e56cddc5\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/933a34c3-cc5b-4852-9354-f52ff489c004\") format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/cc7a180e-e7f4-4de8-b2aa-6aa14ef566fa\") format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/3cebf106-c8fe-4ad0-b3bc-bf62a9b09e76\") format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/abbb2d37-6197-4c91-bb2b-17decc357273\") format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/5012921c-4e3b-4ccc-a7c2-8d1846d04bc7\") format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/page-assets/8cd4b4cd-30be-42a8-a9b5-83362c92bec0\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n/* cyrillic-ext */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/933a34c3-cc5b-4852-9354-f52ff489c004\") format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/cc7a180e-e7f4-4de8-b2aa-6aa14ef566fa\") format('woff2');\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/3cebf106-c8fe-4ad0-b3bc-bf62a9b09e76\") format('woff2');\n  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/abbb2d37-6197-4c91-bb2b-17decc357273\") format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/5012921c-4e3b-4ccc-a7c2-8d1846d04bc7\") format('woff2');\n  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'JetBrains Mono';\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/page-assets/8cd4b4cd-30be-42a8-a9b5-83362c92bec0\") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n"}</style>


        <style>{"\nbody{margin:0}\na{color:inherit}a:hover{color:inherit}\n.stx *{box-sizing:border-box}\n.stx h1,.stx h2,.stx h3,.stx h4,.stx p,.stx ul,.stx ol,.stx dl,.stx dd,.stx figure{margin:0}\n.stx ul,.stx ol{padding:0;list-style:none}\n.serif{font-family:'Instrument Serif',Georgia,serif;font-weight:400;letter-spacing:0}\n.mono{font-family:'JetBrains Mono',ui-monospace,monospace}\n.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:50px;padding:0 24px;border-radius:999px;font:600 15px/1 'Inter Tight',system-ui,sans-serif;text-decoration:none;border:1px solid transparent;cursor:pointer;transition:transform .3s cubic-bezier(.2,.7,.2,1),background .3s,color .3s,border-color .3s,box-shadow .3s;white-space:nowrap}\n.btn:hover{transform:translateY(-2px)}\n.btn svg{transition:transform .3s cubic-bezier(.2,.7,.2,1)}\n.btn:hover svg{transform:translateX(4px)}\n.btn-acc{background:var(--acc);color:#fff;box-shadow:0 10px 30px -12px var(--acc)}\n.btn-acc:hover{color:#fff;box-shadow:0 16px 36px -12px var(--acc)}\n.btn-ghost-d{border-color:rgba(255,255,255,.3);color:#fff;background:transparent}\n.btn-ghost-d:hover{border-color:#fff;color:#fff}\n.btn-ghost-l{border-color:rgba(12,26,34,.28);color:#0C1A22;background:transparent}\n.btn-ghost-l:hover{border-color:#0C1A22;color:#0C1A22}\n.btn-light{background:#fff;color:#0C1A22}\n.btn-light:hover{color:#0C1A22}\n.navlink{color:#C9D3D8;text-decoration:none;font-size:14px;font-weight:500;padding:12px 0;transition:color .2s}\n.navlink:hover{color:#fff}\n.lift{transition:transform .45s cubic-bezier(.2,.7,.2,1),box-shadow .45s,border-color .45s}\n.lift:hover{transform:translateY(-6px);box-shadow:0 30px 60px -30px rgba(12,26,34,.45)}\n.stx button{font-family:inherit}\n.stx button:focus-visible,.stx a:focus-visible,.stx input:focus-visible,.stx textarea:focus-visible{outline:3px solid var(--acc-l);outline-offset:3px}\n.gridbg{background-image:linear-gradient(rgba(255,255,255,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.055) 1px,transparent 1px);background-size:72px 72px;-webkit-mask-image:radial-gradient(ellipse 80% 70% at 70% 30%,#000 30%,transparent 75%);mask-image:radial-gradient(ellipse 80% 70% at 70% 30%,#000 30%,transparent 75%)}\n.seg{min-height:44px;padding:0 18px;border-radius:999px;border:0;background:transparent;color:#A9B6BD;font-size:14px;font-weight:600;cursor:pointer;transition:background .3s,color .3s}\n.seg:hover{color:#fff}\n.seg.on{background:#fff;color:#0C1A22}\n.rail-btn{width:100%;display:flex;align-items:center;gap:16px;min-height:64px;padding:12px 18px;border:0;border-radius:16px;background:transparent;color:#0C1A22;text-align:left;cursor:pointer;transition:background .35s,color .35s}\n.rail-btn:hover{background:rgba(12,26,34,.06)}\n.rail-btn.on{background:#0C1A22;color:#fff}\n.rail-btn .rf{margin-left:auto;font-size:12px;opacity:.6}\n.chip{min-height:46px;padding:0 18px;border-radius:12px;border:1px solid rgba(12,26,34,.16);background:#fff;color:#0C1A22;font-size:14px;font-weight:600;cursor:pointer;text-align:left;transition:all .3s}\n.chip:hover{border-color:#0C1A22}\n.chip.on{background:var(--acc);border-color:var(--acc);color:#fff}\n.chip-d{border-color:rgba(255,255,255,.16);background:rgba(255,255,255,.04);color:#E9EEF0}\n.chip-d:hover{border-color:rgba(255,255,255,.5)}\n.chip-d.on{background:#fff;border-color:#fff;color:#0C1A22}\n.step-btn{display:flex;flex-direction:column;align-items:flex-start;gap:10px;padding:0;border:0;background:transparent;cursor:pointer;text-align:left;color:#4A5A62;transition:color .3s}\n.step-btn:hover{color:#0C1A22}\n.step-btn .dot{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:#fff;border:1px solid rgba(12,26,34,.18);font:500 13px 'JetBrains Mono',monospace;color:#0C1A22;transition:all .35s}\n.step-btn.on{color:#0C1A22}\n.step-btn.on .dot{background:var(--acc);border-color:var(--acc);color:#fff;transform:scale(1.12)}\n.step-btn.done .dot{background:#0C1A22;border-color:#0C1A22;color:#fff}\n.faq-q{width:100%;display:flex;align-items:center;justify-content:space-between;gap:24px;min-height:72px;padding:20px 0;border:0;background:transparent;color:#0C1A22;font-size:18px;font-weight:600;text-align:left;cursor:pointer;transition:color .25s}\n.faq-q:hover{color:var(--acc)}\n.faq-ic{flex:none;width:36px;height:36px;border-radius:50%;border:1px solid rgba(12,26,34,.2);display:grid;place-items:center;transition:transform .4s cubic-bezier(.2,.7,.2,1),background .3s,color .3s}\n.faq-ic.open{transform:rotate(45deg);background:#0C1A22;color:#fff;border-color:#0C1A22}\n.field{display:flex;flex-direction:column;gap:8px}\n.field label{font-size:13px;font-weight:600;color:#C9D3D8}\n.field input,.field textarea{width:100%;min-height:50px;padding:14px 16px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.05);color:#fff;font:400 15px 'Inter Tight',system-ui,sans-serif}\n.field input::placeholder,.field textarea::placeholder{color:#8A989F}\n.stx input[type=range]{width:100%;accent-color:var(--acc-l);height:28px;cursor:pointer}\n.outline-num{color:transparent;-webkit-text-stroke:1.5px rgba(12,26,34,.14)}\n.marq{display:flex;width:max-content;animation:marq 42s linear infinite}\n.marq-wrap:hover .marq{animation-play-state:paused}\n@keyframes marq{to{transform:translateX(-50%)}}\n@keyframes rise{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}\n@keyframes slideIn{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:none}}\n@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}\n@keyframes floatA{0%,100%{transform:translateY(0) rotate(-9deg)}50%{transform:translateY(-16px) rotate(-7deg)}}\n@keyframes floatB{0%,100%{transform:translateY(0) rotate(8deg)}50%{transform:translateY(-12px) rotate(6deg)}}\n@keyframes floatC{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}\n@keyframes tick{0%,8%{opacity:0;transform:scale(.3)}14%,92%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1)}}\n@keyframes fillbar{0%{transform:scaleX(0)}70%,100%{transform:scaleX(1)}}\n@keyframes travel{0%{left:0%}22%,30%{left:33.33%}52%,60%{left:66.66%}82%,100%{left:100%}}\n@keyframes st{0%{opacity:0}3%,30%{opacity:1}33%,100%{opacity:0}}\n@keyframes prog{from{transform:scaleX(0)}to{transform:scaleX(1)}}\n@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(134,217,181,.55)}100%{box-shadow:0 0 0 14px rgba(134,217,181,0)}}\n@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(520%)}}\n@keyframes grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}\n@keyframes orb{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-40px,30px) scale(1.12)}}\n.in{animation:rise 1s cubic-bezier(.2,.7,.2,1) both}\n.d1{animation-delay:.08s}.d2{animation-delay:.18s}.d3{animation-delay:.28s}.d4{animation-delay:.38s}.d5{animation-delay:.5s}\n.slide-in{animation:slideIn .7s cubic-bezier(.2,.7,.2,1) both}\n.fade-up{animation:fadeUp .5s cubic-bezier(.2,.7,.2,1) both}\n.bar-grow{transform-origin:bottom;animation:grow .9s cubic-bezier(.2,.7,.2,1) both}\n@supports (animation-timeline: view()){.rv{animation:rise linear both;animation-timeline:view();animation-range:entry 0% entry 38%}}\n.anim-off *,.anim-off *::before,.anim-off *::after{animation:none!important;transition:none!important}\n@media (prefers-reduced-motion: reduce){.stx *,.stx *::before,.stx *::after{animation:none!important;transition:none!important}}\n@media (max-width: 900px){.navlinks{display:none!important}.hide-sm{display:none!important}}\n"}</style>





        <style>{".doc-nav{transition:background .3s,transform .3s,border-color .3s}.doc-nav:hover{background:rgba(255,255,255,.14)!important;transform:scale(1.06)}.doc-nav:active{transform:scale(.96)}.doc-nav:focus-visible{outline:3px solid var(--acc-l);outline-offset:2px}"}</style>


        <div className={("stx " + (v.animCls))} style={cssToStyle(("--acc: " + (v.accent) + "; --acc-l: " + (v.accentLight) + "; font-family: 'Inter Tight', system-ui, sans-serif; color: #0C1A22; background: #F4F5F1; -webkit-font-smoothing: antialiased; overflow-x: hidden;"))} data-canvas-width="1440" data-canvas-height="8000" data-document-role="page" data-label="Service page — US Tax Preparation & Outsourcing">


          {/*  ============ NAV ============  */}


          <header style={cssToStyle("position: sticky; top: 0; z-index: 60; background: rgba(12,26,34,0.82); backdrop-filter: saturate(160%) blur(16px); -webkit-backdrop-filter: saturate(160%) blur(16px); border-bottom: 1px solid rgba(255,255,255,0.08);")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto; padding: 12px clamp(20px, 4vw, 40px); display: flex; align-items: center; justify-content: space-between; gap: 24px;")}>

              <a href="#top" style={cssToStyle("display: flex; align-items: center; gap: 12px; text-decoration: none; color: #FFFFFF; min-height: 44px;")}>

                <svg width="34" height="34" fill="none" aria-hidden="true"><rect x="0.5" y="0.5" width="33" height="33" rx="9" stroke="rgba(255,255,255,0.35)"></rect>
                  <path d="M9 11h16M9 17h11M9 23h7" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"></path>
                  <circle cx="24" cy="22" r="3.2" fill="var(--acc-l)"></circle></svg>


                <span style={cssToStyle("font-size: 17px; font-weight: 600; letter-spacing: -0.01em;")}>Smart Tax
                  <span className="serif" style={cssToStyle("font-style: italic; font-size: 20px; color: var(--acc-l);")}>Expertss</span></span>

              </a>


              <nav aria-label="Primary" className="navlinks" style={cssToStyle("display: flex; gap: 30px; align-items: center;")}>

                <a className="navlink" href="#services">Tax Preparation</a>


                <a className="navlink" href="#outsourcing">CPA Outsourcing</a>


                <a className="navlink" href="#bookkeeping">Bookkeeping</a>


                <a className="navlink" href="#process">Process</a>


                <a className="navlink" href="#faq">FAQ</a>

              </nav>


              <a href="#contact" className="btn btn-acc" style={cssToStyle("min-height: 44px; padding: 0 20px; font-size: 14px;")}>Get in Touch
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>

            </div>

          </header>



          {/*  ============ HERO ============  */}


          <section id="top" style={cssToStyle("position: relative; background: #0C1A22; color: #E9EEF0; overflow: hidden;")}>

            <div className="gridbg" aria-hidden="true" style={cssToStyle("position: absolute; inset: 0;")}></div>


            <div aria-hidden="true" style={cssToStyle("position: absolute; width: 640px; height: 640px; right: -160px; top: -200px; border-radius: 50%; background: radial-gradient(circle, var(--acc) 0%, transparent 65%); opacity: 0.35; animation: orb 18s ease-in-out infinite;")}></div>

            <div style={cssToStyle("position: relative; max-width: 1240px; margin: 0 auto; padding: 34px clamp(20px, 4vw, 40px) 0; display: flex; justify-content: flex-start;")}>
              <BackToServices />
            </div>



            <div style={cssToStyle("position: relative; max-width: 1240px; margin: 0 auto; padding: clamp(56px, 8vw, 104px) clamp(20px, 4vw, 40px) 56px; display: flex; flex-wrap: wrap; gap: clamp(40px, 5vw, 72px); align-items: center;")}>


              <div style={cssToStyle("flex: 1 1 540px; min-width: 0; display: flex; flex-direction: column; gap: 28px;")}>

                <p className="mono in" style={cssToStyle("font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #A9B6BD; display: flex; align-items: center; gap: 12px;")}><span style={cssToStyle("width: 8px; height: 8px; border-radius: 50%; background: var(--acc-l); animation: pulse 2s infinite;")}></span>
                  US Tax · Bookkeeping · CPA Outsourcing</p>



                <div className="in d1" role="group" aria-label="Choose who you are" style={cssToStyle("display: inline-flex; align-self: flex-start; padding: 5px; border-radius: 999px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); flex-wrap: wrap;")}>

                  <button type="button" className={v.segDirect} aria-pressed={v.pressDirect} onClick={v.toDirect}>Individuals &amp; Businesses</button>


                  <button type="button" className={v.segCpa} aria-pressed={v.pressCpa} onClick={v.toCpa}>US CPA Firms</button>

                </div>



                <h1 className="in d2" style={cssToStyle("font-size: clamp(42px, 5.6vw, 78px); line-height: 1.02; letter-spacing: -0.035em; font-weight: 600; color: #FFFFFF; max-width: 640px; display: block;")}>US Tax Preparation
                  <br />
                  <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400; color: var(--acc-l);")}>&amp;</span>
                  <span style={cssToStyle("display: inline-block; margin-left: 10px;")}>Outsourcing Services</span></h1>



                <p className="serif in d3" style={cssToStyle("font-size: clamp(22px, 2.4vw, 30px); line-height: 1.25; color: #DCE4E7; font-style: italic; max-width: 560px;")}>Tax preparation and accounting support, built around the way you work.</p>



                {(v.modeDirect) && (
                  <React.Fragment>


                    <div className="fade-up" style={cssToStyle("display: flex; flex-direction: column; gap: 28px;")}>

                      <p style={cssToStyle("font-size: 17px; line-height: 1.65; color: #A9B6BD; max-width: 560px;")}>Personal and business tax returns prepared from organised records, checked against the information you provide, and handed over for review and filing — for individuals, families and business owners.</p>


                      <div style={cssToStyle("display: flex; gap: 14px; flex-wrap: wrap;")}>

                        <a href="#contact" className="btn btn-acc">Get in Touch
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>


                        <a href="#services" className="btn btn-ghost-d">Discuss Your Requirements</a>

                      </div>

                    </div>


                  </React.Fragment>
                )}


                {(v.modeCpa) && (
                  <React.Fragment>


                    <div className="fade-up" style={cssToStyle("display: flex; flex-direction: column; gap: 28px;")}>

                      <p style={cssToStyle("font-size: 17px; line-height: 1.65; color: #A9B6BD; max-width: 560px;")}>Offshore preparation capacity that works inside your firm's software, checklists and review procedures — so your in-house team stays on client relationships, advisory work and final review.</p>


                      <div style={cssToStyle("display: flex; gap: 14px; flex-wrap: wrap;")}>

                        <a href="#outsourcing" className="btn btn-acc">Discuss CPA Outsourcing
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>


                        <a href="#planner" className="btn btn-ghost-d">Model your peak-season gap</a>

                      </div>

                    </div>


                  </React.Fragment>
                )}

              </div>



              {/*  hero visual  */}


              <div className="in d3" style={cssToStyle("flex: 1 1 440px; min-width: 0; position: relative; height: 500px;")} role="img" aria-label="Illustrative preparation workflow: a partnership return moving from received to prepared, reviewed and handed over">

                <div aria-hidden="true" style={cssToStyle("position: absolute; left: 4%; top: 30px; width: 62%; height: 300px; border-radius: 18px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); animation: floatA 9s ease-in-out infinite; padding: 22px;")}>

                  <p className="mono" style={cssToStyle("font-size: 44px; color: rgba(255,255,255,0.16); font-weight: 500;")}>1120-S</p>

                </div>


                <div aria-hidden="true" style={cssToStyle("position: absolute; right: 2%; top: 6px; width: 54%; height: 260px; border-radius: 18px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); animation: floatB 11s ease-in-out infinite; padding: 22px; text-align: right;")}>

                  <p className="mono" style={cssToStyle("font-size: 44px; color: rgba(255,255,255,0.16); font-weight: 500;")}>1040</p>

                </div>



                <div aria-hidden="true" style={cssToStyle("position: absolute; left: 50%; top: 66px; transform: translateX(-50%); width: min(380px, 92%); border-radius: 22px; background: #FBFBF8; color: #0C1A22; box-shadow: 0 50px 100px -30px rgba(0,0,0,0.6); overflow: hidden; animation: floatC 7s ease-in-out infinite;")}>

                  <div style={cssToStyle("position: absolute; left: 0; right: 0; top: 0; height: 60px; background: linear-gradient(180deg, transparent, rgba(23,105,79,0.08), transparent); animation: scan 4.5s ease-in-out infinite;")}></div>


                  <div style={cssToStyle("padding: 22px 24px 18px; border-bottom: 1px dashed rgba(12,26,34,0.15); display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;")}>

                    <div>

                      <p className="mono" style={cssToStyle("font-size: 11px; letter-spacing: 0.12em; color: #4A5A62;")}>FORM</p>


                      <p className="mono" style={cssToStyle("font-size: 34px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.1;")}>{v.curDoc.form}</p>


                      <p style={cssToStyle("font-size: 13px; color: #4A5A62; margin-top: 4px;")}>{v.curDoc.title}</p>

                    </div>


                    <span style={cssToStyle("align-self: flex-start; padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 600; background: #FFF1DB; color: #8A4B00;")}>{v.curDoc.status}</span>

                  </div>


                  <ul style={cssToStyle("padding: 14px 24px 8px; display: flex; flex-direction: column; gap: 4px;")}>

                    {v.curDoc.items.map(function (item, i) {
                      var done = i < v.chk;
                      return (
                        <li key={i} style={cssToStyle("display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: " + (i < v.curDoc.items.length - 1 ? "1px solid rgba(12,26,34,0.07)" : "none") + "; font-size: 14px; color: " + (done ? "#0F5A42" : "#4A5A62") + "; transition: color .4s;")}>
                          <span>{item}</span>
                          <span style={cssToStyle("flex: none; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; color: #fff; background: " + (done ? "var(--acc)" : "rgba(12,26,34,0.1)") + "; transition: background .4s; animation: " + (done ? "tick 0.5s cubic-bezier(.2,.7,.2,1) both" : "none") + ";")}>
                            {done ? <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg> : null}
                          </span>
                        </li>
                      );
                    })}

                  </ul>


                  <div style={cssToStyle("padding: 10px 24px 22px;")}>

                    <div style={cssToStyle("height: 6px; border-radius: 6px; background: rgba(12,26,34,0.08); overflow: hidden;")}><div style={cssToStyle("height: 100%; width: " + v.progPct + "%; background: var(--acc); transition: width .6s cubic-bezier(.2,.7,.2,1);")}></div></div>

                  </div>

                </div>



                <div style={cssToStyle("position: absolute; left: 0; right: 0; bottom: 10px; margin: 0 auto; width: min(480px, 100%); padding: 18px 22px 16px; border-radius: 18px; background: rgba(12,26,34,0.75); border: 1px solid rgba(255,255,255,0.14); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);")}>

                  <div style={cssToStyle("position: relative; height: 18px; margin: 10px 8px 14px;")}>
                    <span style={cssToStyle("position: absolute; left: 0; right: 0; top: 8px; height: 2px; border-radius: 2px; background: rgba(255,255,255,0.15);")}></span>
                    <span style={cssToStyle("position: absolute; left: 0; top: 8px; height: 2px; border-radius: 2px; background: var(--acc-l); box-shadow: 0 0 8px var(--acc-l); width: " + v.tlWidth + "; transition: width .6s cubic-bezier(.2,.7,.2,1);")}></span>

                    {v.miles.map(function (m) {
                      return <span key={m.i} style={cssToStyle("position: absolute; left: " + m.p + "%; top: 3px; width: 14px; height: 14px; margin-left: -7px; border-radius: 50%; border: 2px solid " + (m.active ? "var(--acc-l)" : (m.done ? "var(--acc)" : "rgba(255,255,255,0.35)")) + "; background: " + (m.active ? "var(--acc-l)" : (m.done ? "var(--acc)" : "rgba(12,26,34,0.9)")) + "; box-shadow: " + (m.active ? "0 0 14px var(--acc-l)" : "none") + "; transition: background .4s, border-color .4s, box-shadow .4s;")}>
                        <span style={cssToStyle("position: absolute; inset: 3px; border-radius: 50%; background: #fff; opacity: " + ((m.done || m.active) ? 1 : 0) + "; transition: opacity .4s;")}></span>
                      </span>;
                    })}

                  </div>


                  <div className="mono" style={cssToStyle("display: flex; justify-content: space-between; font-size: 11px; letter-spacing: 0.06em; color: #A9B6BD; text-transform: uppercase;")}><span>Received</span>
                    <span>Prepared</span>
                    <span>Reviewed</span>
                    <span>Handover</span></div>


                  <div style={cssToStyle("display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 14px;")}>

                    <button type="button" className="mono" aria-label="Previous document" onClick={v.prevDoc} style={cssToStyle("flex: none; width: 42px; height: 42px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.25); background: rgba(255,255,255,0.06); color: var(--acc-l); display: grid; place-items: center; cursor: pointer; transition: background .3s, transform .3s, border-color .3s;")}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"></path></svg>
                    </button>


                    <span className="mono" style={cssToStyle("font-size: 11px; letter-spacing: 0.1em; color: #C9D3D8; text-transform: uppercase;")}>{v.curDoc.name} · {pad(v.activeStep + 1)}/{pad(4)}</span>


                    <button type="button" className="mono" aria-label="Next document" onClick={v.nextDoc} style={cssToStyle("flex: none; width: 42px; height: 42px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.25); background: rgba(255,255,255,0.06); color: var(--acc-l); display: grid; place-items: center; cursor: pointer; transition: background .3s, transform .3s, border-color .3s;")}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
                    </button>

                  </div>

                </div>


                <p className="mono" style={cssToStyle("position: absolute; right: 0; top: -22px; font-size: 10px; letter-spacing: 0.14em; color: #6F8089; text-transform: uppercase;")}>Illustrative workflow</p>

              </div>

            </div>



            {/*  stats  */}


            <div style={cssToStyle("position: relative; max-width: 1240px; margin: 0 auto; padding: 0 clamp(20px, 4vw, 40px);")}>

              <dl style={cssToStyle("display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); border-top: 1px solid rgba(255,255,255,0.12);")}>

                <div className="rv" style={cssToStyle("padding: 32px 28px 36px 0; border-right: 1px solid rgba(255,255,255,0.08);")}>

                  <dd style={cssToStyle("font-size: clamp(40px, 4.4vw, 60px); font-weight: 600; letter-spacing: -0.04em; color: #fff; line-height: 1;")}>5–10
                    <span className="serif" style={cssToStyle("font-style: italic; color: var(--acc-l); font-size: 0.6em; margin-left: 6px;")}>yrs</span></dd>


                  <dt style={cssToStyle("margin-top: 12px; font-size: 14px; color: #A9B6BD;")}>Experience in tax &amp; accounting work</dt>

                </div>


                <div className="rv" style={cssToStyle("padding: 32px 28px 36px; border-right: 1px solid rgba(255,255,255,0.08);")}>

                  <dd style={cssToStyle("font-size: clamp(40px, 4.4vw, 60px); font-weight: 600; letter-spacing: -0.04em; color: #fff; line-height: 1;")}>250–500</dd>


                  <dt style={cssToStyle("margin-top: 12px; font-size: 14px; color: #A9B6BD;")}>Client base across engagement types</dt>

                </div>


                <div className="rv" style={cssToStyle("padding: 32px 28px 36px; border-right: 1px solid rgba(255,255,255,0.08);")}>

                  <dd style={cssToStyle("font-size: clamp(40px, 4.4vw, 60px); font-weight: 600; letter-spacing: -0.04em; color: #fff; line-height: 1;")}>3
                    <span className="serif" style={cssToStyle("font-style: italic; color: var(--acc-l); font-size: 0.6em; margin-left: 6px;")}>roles</span></dd>


                  <dt style={cssToStyle("margin-top: 12px; font-size: 14px; color: #A9B6BD;")}>Accountants, reviewers &amp; tax specialists</dt>

                </div>


                <div className="rv" style={cssToStyle("padding: 32px 0 36px 28px;")}>

                  <dd style={cssToStyle("font-size: clamp(40px, 4.4vw, 60px); font-weight: 600; letter-spacing: -0.04em; color: #fff; line-height: 1;")}>6+</dd>


                  <dt style={cssToStyle("margin-top: 12px; font-size: 14px; color: #A9B6BD;")}>Tax &amp; accounting platforms</dt>

                </div>

              </dl>

            </div>



            {/*  software marquee  */}


            <div className="marq-wrap" style={cssToStyle("position: relative; border-top: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 22px 0; overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);")}>

              <p className="sr" style={cssToStyle("position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0);")}>Works with Drake Tax, Intuit ProConnect, Thomson Reuters UltraTax CS, QuickBooks, CCH ProSystem fx and ProSeries.</p>


              <div className="marq" aria-hidden="true">

                {(v.marquee || []).map((m, index) => (
                  <React.Fragment key={index}>


                    <span style={cssToStyle("display: inline-flex; align-items: center; gap: 28px; padding-right: 28px; white-space: nowrap; font-size: 22px; font-weight: 500; color: #C9D3D8; letter-spacing: -0.01em;")}>{m}
                      <span style={cssToStyle("color: var(--acc-l); font-size: 14px;")}>✦</span></span>


                  </React.Fragment>
                ))}

              </div>

            </div>

          </section>



          {/*  ============ SERVICES SLIDER ============  */}


          <section id="services" style={cssToStyle("max-width: 1240px; margin: 0 auto; padding: clamp(80px, 10vw, 140px) clamp(20px, 4vw, 40px) 60px;")}>

            <div className="rv" style={cssToStyle("display: flex; flex-wrap: wrap; gap: 32px 64px; align-items: flex-end; justify-content: space-between; margin-bottom: 56px;")}>

              <div style={cssToStyle("flex: 1 1 560px; min-width: 0;")}>

                <p className="mono" style={cssToStyle("font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--acc); margin-bottom: 20px;")}>01 — Direct clients</p>


                <h2 style={cssToStyle("font-size: clamp(34px, 4.4vw, 60px); line-height: 1.02; letter-spacing: -0.03em; font-weight: 600;")}>US Tax Preparation Services for
                  <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400;")}>Individuals and Businesses</span></h2>

              </div>


              <p style={cssToStyle("flex: 1 1 360px; min-width: 0; max-width: 440px; font-size: 17px; line-height: 1.65; color: #4A5A62;")}>Every taxpayer's situation is different. We start from the records you provide, identify what the return requires, and organise it for review and completion — never one template for every entity.</p>

            </div>



            <div className="rv" style={cssToStyle("display: flex; flex-wrap: wrap; gap: 28px; align-items: stretch;")}>

              <div role="tablist" aria-label="Tax preparation services" style={cssToStyle("flex: 1 1 320px; min-width: 0; max-width: 400px; display: flex; flex-direction: column; gap: 6px; padding: 10px; border-radius: 24px; background: #FFFFFF; border: 1px solid rgba(12,26,34,0.08); align-self: flex-start;")}>

                {(v.slides || []).map((s, index) => (
                  <React.Fragment key={index}>


                    <button type="button" role="tab" className={s.cls} aria-selected={s.sel} onClick={s.pick}>

                      <span className="mono" style={cssToStyle("font-size: 12px; opacity: 0.55;")}>{s.num}</span>


                      <span style={cssToStyle("font-size: 16px; font-weight: 600;")}>{s.short}</span>


                      <span className="mono rf">{s.form}</span>

                    </button>


                  </React.Fragment>
                ))}

              </div>



              <div role="tabpanel" style={cssToStyle("flex: 999 1 560px; min-width: 0; position: relative; border-radius: 28px; background: #FFFFFF; border: 1px solid rgba(12,26,34,0.08); overflow: hidden; min-height: 560px; display: flex; flex-direction: column;")}>

                {(v.slides || []).map((s, index) => (
                  <React.Fragment key={index}>


                    {(s.active) && (
                      <React.Fragment>


                        <div style={cssToStyle("flex: 1; display: flex; flex-direction: column; padding: clamp(28px, 4vw, 52px); position: relative;")}>

                          <p className="mono outline-num slide-in" aria-hidden="true" style={cssToStyle("position: absolute; right: clamp(16px, 3vw, 40px); top: 6px; font-size: clamp(90px, 13vw, 190px); font-weight: 500; letter-spacing: -0.05em; line-height: 1; pointer-events: none;")}>{s.form}</p>


                          <p className="mono slide-in" style={cssToStyle("position: relative; font-size: 12px; letter-spacing: 0.14em; color: var(--acc); text-transform: uppercase;")}>{s.num} / 06 · {s.tag}</p>


                          <h3 className="slide-in d1" style={cssToStyle("position: relative; margin-top: 18px; font-size: clamp(30px, 3.4vw, 46px); letter-spacing: -0.03em; line-height: 1.05; font-weight: 600; max-width: 520px;")}>{s.title}</h3>


                          <p className="slide-in d2" style={cssToStyle("position: relative; margin-top: 18px; font-size: 17px; line-height: 1.65; color: #4A5A62; max-width: 560px;")}>{s.desc}</p>


                          <ul className="slide-in d3" style={cssToStyle("position: relative; margin-top: 32px; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px 28px;")}>

                            {(s.items || []).map((it, index) => (
                              <React.Fragment key={index}>


                                <li style={cssToStyle("display: flex; gap: 12px; align-items: flex-start; font-size: 15px; line-height: 1.5; padding-bottom: 12px; border-bottom: 1px solid rgba(12,26,34,0.07);")}><span style={cssToStyle("flex: none; margin-top: 2px; width: 20px; height: 20px; border-radius: 50%; background: #E3F1EA; color: var(--acc); display: grid; place-items: center;")}><svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg></span>
                                  {it}</li>


                              </React.Fragment>
                            ))}

                          </ul>


                          <div style={cssToStyle("flex: 1; min-height: 28px;")}></div>


                          <div style={cssToStyle("position: relative; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px;")}>

                            <a href="#contact" className="btn btn-acc">Discuss this return
                              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>


                            <div style={cssToStyle("display: flex; align-items: center; gap: 10px;")}>

                              <button type="button" aria-label="Previous service" onClick={v.prevSlide} style={cssToStyle("width: 50px; height: 50px; border-radius: 50%; border: 1px solid rgba(12,26,34,0.2); background: #fff; color: #0C1A22; display: grid; place-items: center; cursor: pointer;")}><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"></path></svg></button>


                              <button type="button" aria-label="Next service" onClick={v.nextSlide} style={cssToStyle("width: 50px; height: 50px; border-radius: 50%; border: 0; background: #0C1A22; color: #fff; display: grid; place-items: center; cursor: pointer;")}><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></button>


                              <button type="button" onClick={v.toggleAuto} aria-pressed={v.autoPressed} style={cssToStyle("min-height: 44px; padding: 0 14px; border: 0; background: transparent; color: #4A5A62; font-size: 13px; font-weight: 600; cursor: pointer;")}>{v.autoLabel}</button>

                            </div>

                          </div>


                          {(v.auto) && (
                            <React.Fragment>


                              <div aria-hidden="true" style={cssToStyle("position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: rgba(12,26,34,0.06);")}><div style={cssToStyle("height: 100%; background: var(--acc); transform-origin: left; animation: prog 7s linear both;")}></div></div>


                            </React.Fragment>
                          )}

                        </div>


                      </React.Fragment>
                    )}


                  </React.Fragment>
                ))}

              </div>

            </div>

          </section>



          {/*  ============ LLC CLASSIFIER ============  */}


          <section style={cssToStyle("max-width: 1240px; margin: 0 auto; padding: 20px clamp(20px, 4vw, 40px) clamp(80px, 10vw, 130px);")}>

            <div className="rv" style={cssToStyle("border-radius: 28px; background: #E6ECE8; padding: clamp(28px, 4vw, 52px); display: flex; flex-wrap: wrap; gap: 40px; align-items: stretch;")}>

              <div style={cssToStyle("flex: 1 1 440px; min-width: 0; display: flex; flex-direction: column; gap: 20px;")}>

                <p className="mono" style={cssToStyle("font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--acc);")}>Interactive · LLC classifier</p>


                <h3 style={cssToStyle("font-size: clamp(26px, 2.8vw, 38px); line-height: 1.08; letter-spacing: -0.025em; font-weight: 600;")}>How is your LLC taxed?
                  <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400;")}>It decides the return.</span></h3>


                <p style={cssToStyle("font-size: 16px; line-height: 1.6; color: #3E4D55; max-width: 480px;")}>An LLC can be treated as a disregarded entity, a partnership or a corporation for federal income tax purposes. Pick the structure closest to yours.</p>


                <div role="group" aria-label="LLC structure" style={cssToStyle("display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 10px; margin-top: 4px;")}>

                  {(v.llcOpts || []).map((o, index) => (
                    <React.Fragment key={index}>


                      <button type="button" className={o.cls} aria-pressed={o.pressed} onClick={o.pick}>{o.label}</button>


                    </React.Fragment>
                  ))}

                </div>

              </div>


              <div style={cssToStyle("flex: 1 1 380px; min-width: 0; border-radius: 22px; background: #0C1A22; color: #E9EEF0; padding: 32px; display: flex; flex-direction: column; gap: 22px; position: relative; overflow: hidden;")}>

                <div aria-hidden="true" style={cssToStyle("position: absolute; right: -60px; bottom: -60px; width: 220px; height: 220px; border-radius: 50%; background: radial-gradient(circle, var(--acc) 0%, transparent 70%); opacity: 0.5;")}></div>


                {(v.llcOpts || []).map((o, index) => (
                  <React.Fragment key={index}>


                    {(o.active) && (
                      <React.Fragment>


                        <div className="fade-up" style={cssToStyle("position: relative; display: flex; flex-direction: column; gap: 22px;")} aria-live="polite">

                          <div>

                            <p className="mono" style={cssToStyle("font-size: 11px; letter-spacing: 0.14em; color: #8A989F; text-transform: uppercase;")}>Generally treated as</p>


                            <p className="serif" style={cssToStyle("font-size: clamp(34px, 3.4vw, 46px); line-height: 1.05; margin-top: 8px; font-style: italic; color: #fff;")}>{o.treated}</p>

                          </div>


                          <div style={cssToStyle("height: 1px; background: rgba(255,255,255,0.12);")}></div>


                          <div>

                            <p className="mono" style={cssToStyle("font-size: 11px; letter-spacing: 0.14em; color: #8A989F; text-transform: uppercase;")}>Typical federal return</p>


                            <p className="mono" style={cssToStyle("font-size: 22px; margin-top: 8px; color: var(--acc-l);")}>{o.ret}</p>

                          </div>


                          <p style={cssToStyle("font-size: 14px; line-height: 1.6; color: #A9B6BD;")}>{o.note}</p>

                        </div>


                      </React.Fragment>
                    )}


                  </React.Fragment>
                ))}


                <p style={cssToStyle("position: relative; margin-top: auto; font-size: 12px; line-height: 1.55; color: #8A989F;")}>General federal default and election rules only. Your entity's actual classification is confirmed before preparation begins.</p>

              </div>

            </div>

          </section>



          {/*  ============ CPA OUTSOURCING ============  */}


          <section id="outsourcing" style={cssToStyle("position: relative; background: #0C1A22; color: #E9EEF0; overflow: hidden;")}>

            <div className="gridbg" aria-hidden="true" style={cssToStyle("position: absolute; inset: 0; opacity: 0.6;")}></div>


            <div style={cssToStyle("position: relative; max-width: 1240px; margin: 0 auto; padding: clamp(80px, 10vw, 140px) clamp(20px, 4vw, 40px);")}>


              <div className="rv" style={cssToStyle("max-width: 900px;")}>

                <p className="mono" style={cssToStyle("font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--acc-l); margin-bottom: 20px;")}>02 — For US CPA firms</p>


                <h2 style={cssToStyle("font-size: clamp(34px, 4.6vw, 64px); line-height: 1.02; letter-spacing: -0.03em; font-weight: 600; color: #fff;")}>US Tax Preparation Outsourcing for CPA Firms</h2>


                <p className="serif" style={cssToStyle("margin-top: 22px; font-size: clamp(22px, 2.4vw, 32px); line-height: 1.25; font-style: italic; color: #DCE4E7;")}>Extend your preparation capacity without expanding your in-house team.</p>

              </div>



              <div style={cssToStyle("margin-top: 64px; display: flex; flex-wrap: wrap; gap: 48px; align-items: flex-start;")}>

                <div className="rv" style={cssToStyle("flex: 1 1 400px; min-width: 0; display: flex; flex-direction: column; gap: 22px;")}>

                  <p style={cssToStyle("font-size: 17px; line-height: 1.7; color: #A9B6BD;")}>Tax season brings more client work, tighter deadlines and pressure on internal resources. Hiring and training for every busy period isn't always practical. We work as an extension of your workflow — following your instructions, preferred software and review procedures.</p>


                  <p className="mono" style={cssToStyle("font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #8A989F; margin-top: 10px;")}>What we prepare</p>


                  <ul style={cssToStyle("display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0 24px;")}>

                    {(v.cpaItems || []).map((c, index) => (
                      <React.Fragment key={index}>


                        <li style={cssToStyle("display: flex; gap: 12px; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 15px; color: #E9EEF0;")}><span style={cssToStyle("color: var(--acc-l); display: grid; place-items: center;")}><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg></span>
                          {c}</li>


                      </React.Fragment>
                    ))}

                  </ul>

                </div>



                {/*  capacity planner  */}


                <div id="planner" className="rv" style={cssToStyle("flex: 1.2 1 520px; min-width: 0; border-radius: 28px; background: #FBFBF8; color: #0C1A22; padding: clamp(24px, 3vw, 36px); box-shadow: 0 60px 120px -50px rgba(0,0,0,0.7);")}>

                  <div style={cssToStyle("display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap;")}>

                    <div>

                      <p className="mono" style={cssToStyle("font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--acc);")}>Interactive · Capacity planner</p>


                      <h3 style={cssToStyle("margin-top: 8px; font-size: 24px; letter-spacing: -0.02em; font-weight: 600;")}>Where does peak season outrun your team?</h3>

                    </div>


                    <span className="mono" style={cssToStyle("font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; padding: 6px 10px; border-radius: 999px; background: #EEF0EC; color: #4A5A62;")}>Illustrative</span>

                  </div>



                  <div style={cssToStyle("margin-top: 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;")}>

                    <div>

                      <label htmlFor="peak" style={cssToStyle("display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; color: #3E4D55;")}><span>Peak-season returns / week</span>
                        <span className="mono" style={cssToStyle("color: #0C1A22;")}>{v.peak}</span></label>


                      <input id="peak" type="range" min="20" max="400" step="5" value={v.peak} onChange={v.setPeak} />

                    </div>


                    <div>

                      <label htmlFor="cap" style={cssToStyle("display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; color: #3E4D55;")}><span>In-house capacity / week</span>
                        <span className="mono" style={cssToStyle("color: #0C1A22;")}>{v.cap}</span></label>


                      <input id="cap" type="range" min="20" max="400" step="5" value={v.cap} onChange={v.setCap} />

                    </div>

                  </div>



                  <div role="img" aria-label={v.chartLabel} style={cssToStyle("margin-top: 26px; position: relative; height: 240px; display: flex; align-items: flex-end; gap: 6px; padding-top: 26px; border-bottom: 1px solid rgba(12,26,34,0.2);")}>

                    <div aria-hidden="true" style={cssToStyle(("position: absolute; left: 0; right: 0; bottom: " + (v.capLine) + "; border-top: 2px dashed #0C1A22; z-index: 2; transition: bottom .5s cubic-bezier(.2,.7,.2,1);"))}><span className="mono" style={cssToStyle("position: absolute; right: 0; top: -22px; font-size: 10px; letter-spacing: 0.08em; background: #0C1A22; color: #fff; padding: 3px 7px; border-radius: 6px;")}>IN-HOUSE CAPACITY</span></div>


                    {(v.bars || []).map((b, index) => (
                      <React.Fragment key={index}>


                        <div aria-hidden="true" style={cssToStyle("flex: 1; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; position: relative;")}>

                          <span className="mono" style={cssToStyle("position: absolute; left: 50%; transform: translateX(-50%); top: -22px; font-size: 9px; white-space: nowrap; color: #8A4B00;")}>{b.deadline}</span>


                          <div className="bar-grow" style={cssToStyle(("display: flex; flex-direction: column; justify-content: flex-end; height: " + (b.total) + "; transition: height .5s cubic-bezier(.2,.7,.2,1);"))}>

                            <div style={cssToStyle(("height: " + (b.ovShare) + "; background: repeating-linear-gradient(135deg, #E8A33D 0 6px, #F2C27A 6px 12px); border-radius: 6px 6px 0 0; transition: height .5s;"))}></div>


                            <div style={cssToStyle(("height: " + (b.inShare) + "; background: " + (b.inColor) + "; border-radius: " + (b.inRadius) + "; transition: height .5s, background .3s;"))}></div>

                          </div>

                        </div>


                      </React.Fragment>
                    ))}

                  </div>


                  <div className="mono" aria-hidden="true" style={cssToStyle("display: flex; gap: 6px; margin-top: 8px;")}>

                    {(v.bars || []).map((b, index) => (
                      <React.Fragment key={index}>
                        <span style={cssToStyle("flex: 1; text-align: center; font-size: 10px; color: #4A5A62;")}>{b.m}</span>
                      </React.Fragment>
                    ))}

                  </div>



                  <div style={cssToStyle("margin-top: 22px; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px;")}>

                    <div style={cssToStyle("padding: 16px; border-radius: 16px; background: #F1F3EF;")}><p className="mono" style={cssToStyle("font-size: 10px; letter-spacing: 0.1em; color: #4A5A62; text-transform: uppercase;")}>Peak gap / week</p>
                      <p style={cssToStyle("margin-top: 6px; font-size: 30px; font-weight: 600; letter-spacing: -0.03em;")}>{v.peakGap}</p></div>


                    <div style={cssToStyle("padding: 16px; border-radius: 16px; background: #F1F3EF;")}><p className="mono" style={cssToStyle("font-size: 10px; letter-spacing: 0.1em; color: #4A5A62; text-transform: uppercase;")}>Months over capacity</p>
                      <p style={cssToStyle("margin-top: 6px; font-size: 30px; font-weight: 600; letter-spacing: -0.03em;")}>{v.monthsOver}</p></div>


                    <div style={cssToStyle("padding: 16px; border-radius: 16px; background: #0C1A22; color: #fff;")}><p className="mono" style={cssToStyle("font-size: 10px; letter-spacing: 0.1em; color: #A9B6BD; text-transform: uppercase;")}>Est. overflow / year</p>
                      <p style={cssToStyle("margin-top: 6px; font-size: 30px; font-weight: 600; letter-spacing: -0.03em;")}>≈ {v.annual}</p></div>

                  </div>


                  <p style={cssToStyle("margin-top: 16px; font-size: 12px; line-height: 1.55; color: #4A5A62;")}>Seasonal shape follows common federal due dates for calendar-year filers (Mar 15, Apr 15, and extended Sep 15 / Oct 15). Figures are an illustration from your inputs, not a quote or commitment.</p>

                </div>

              </div>



              {/*  workflow fit  */}


              <div className="rv" style={cssToStyle("margin-top: 80px; display: flex; flex-wrap: wrap; gap: 40px; align-items: flex-start; padding-top: 56px; border-top: 1px solid rgba(255,255,255,0.1);")}>

                <div style={cssToStyle("flex: 1 1 360px; min-width: 0;")}>

                  <h3 style={cssToStyle("font-size: clamp(26px, 2.8vw, 38px); line-height: 1.08; letter-spacing: -0.025em; font-weight: 600; color: #fff;")}>Outsourcing that fits
                    <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400; color: var(--acc-l);")}>your</span>
                    workflow.</h3>


                  <p style={cssToStyle("margin-top: 16px; font-size: 16px; line-height: 1.65; color: #A9B6BD;")}>Before an engagement starts, we agree the details with your team — so our work drops into your process, not the other way round.</p>


                  <a href="#contact" className="btn btn-light" style={cssToStyle("margin-top: 28px;")}>Discuss CPA Outsourcing
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>

                </div>


                <div style={cssToStyle("flex: 1.4 1 480px; min-width: 0; display: flex; flex-direction: column; gap: 28px;")}>

                  <div>

                    <p className="mono" style={cssToStyle("font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #8A989F; margin-bottom: 14px;")}>Agreed up front</p>


                    <div style={cssToStyle("display: flex; flex-wrap: wrap; gap: 10px;")}>

                      <span style={cssToStyle("padding: 12px 18px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.18); font-size: 14px;")}>Preferred software</span>


                      <span style={cssToStyle("padding: 12px 18px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.18); font-size: 14px;")}>Return types</span>


                      <span style={cssToStyle("padding: 12px 18px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.18); font-size: 14px;")}>Document handling</span>


                      <span style={cssToStyle("padding: 12px 18px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.18); font-size: 14px;")}>Turnaround expectations</span>


                      <span style={cssToStyle("padding: 12px 18px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.18); font-size: 14px;")}>Review requirements</span>

                    </div>

                  </div>


                  <div>

                    <p className="mono" style={cssToStyle("font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #8A989F; margin-bottom: 14px;")}>Platforms we work in</p>


                    <div style={cssToStyle("display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 10px;")}>

                      {(v.software || []).map((sw, index) => (
                        <React.Fragment key={index}>


                          <div className="lift" style={cssToStyle("padding: 18px; border-radius: 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);")}><p className="mono" style={cssToStyle("font-size: 10px; color: #8A989F; letter-spacing: 0.08em;")}>{sw.v}</p>
                            <p style={cssToStyle("margin-top: 6px; font-size: 16px; font-weight: 600; color: #fff;")}>{sw.n}</p></div>


                        </React.Fragment>
                      ))}

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </section>



          {/*  ============ BOOKKEEPING ============  */}


          <section id="bookkeeping" style={cssToStyle("max-width: 1240px; margin: 0 auto; padding: clamp(80px, 10vw, 140px) clamp(20px, 4vw, 40px);")}>

            <div style={cssToStyle("display: flex; flex-wrap: wrap; gap: clamp(40px, 6vw, 88px); align-items: center;")}>

              <div className="rv" style={cssToStyle("flex: 1 1 460px; min-width: 0;")}>

                <p className="mono" style={cssToStyle("font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--acc); margin-bottom: 20px;")}>03 — Year-round</p>


                <h2 style={cssToStyle("font-size: clamp(34px, 4.4vw, 58px); line-height: 1.02; letter-spacing: -0.03em; font-weight: 600;")}>Bookkeeping and Accounting Support</h2>


                <p className="serif" style={cssToStyle("margin-top: 18px; font-size: clamp(22px, 2.2vw, 28px); font-style: italic; line-height: 1.3; color: #3E4D55;")}>Better-organised records make tax preparation easier.</p>


                <p style={cssToStyle("margin-top: 18px; font-size: 16px; line-height: 1.7; color: #4A5A62;")}>Incomplete records, uncategorised transactions and inconsistent reconciliations slow every return down. Ongoing support keeps your books in shape all year — or gets them organised before preparation begins.</p>


                <ul style={cssToStyle("margin-top: 28px; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0 28px;")}>

                  {(v.bkItems || []).map((k, index) => (
                    <React.Fragment key={index}>


                      <li style={cssToStyle("display: flex; gap: 12px; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(12,26,34,0.09); font-size: 15px;")}><span className="mono" style={cssToStyle("font-size: 11px; color: var(--acc); width: 20px;")}>{k.n}</span>
                        {k.t}</li>


                    </React.Fragment>
                  ))}

                </ul>

              </div>



              <div className="rv" style={cssToStyle("flex: 1 1 440px; min-width: 0; border-radius: 28px; background: #FFFFFF; border: 1px solid rgba(12,26,34,0.08); padding: 28px; box-shadow: 0 40px 80px -50px rgba(12,26,34,0.4);")} role="img" aria-label="Sample month-end reconciliation checklist with each account being matched and reconciled">

                <div style={cssToStyle("display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;")}>

                  <p style={cssToStyle("font-weight: 600; font-size: 16px;")}>Month-end close</p>


                  <span className="mono" style={cssToStyle("font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; padding: 6px 10px; border-radius: 999px; background: #EEF0EC; color: #4A5A62;")}>Sample</span>

                </div>


                <div aria-hidden="true" style={cssToStyle("display: flex; flex-direction: column;")}>

                  {(v.ledger || []).map((l, index) => (
                    <React.Fragment key={index}>


                      <div style={cssToStyle("display: flex; align-items: center; gap: 14px; padding: 16px 0; border-top: 1px solid rgba(12,26,34,0.07);")}>

                        <span style={cssToStyle("width: 36px; height: 36px; border-radius: 10px; background: #F1F3EF; display: grid; place-items: center;")} className="mono"><span style={cssToStyle("font-size: 11px; color: #4A5A62;")}>{l.code}</span></span>


                        <div style={cssToStyle("flex: 1; min-width: 0;")}><p style={cssToStyle("font-size: 15px; font-weight: 600;")}>{l.name}</p>
                          <div style={cssToStyle("margin-top: 8px; height: 4px; border-radius: 4px; background: #EEF0EC; overflow: hidden;")}><div style={cssToStyle(("height: 100%; background: var(--acc); transform-origin: left; animation: fillbar 8s ease-in-out infinite; animation-delay: " + (l.delay) + ";"))}></div></div></div>


                        <span style={cssToStyle(("font-size: 12px; font-weight: 600; padding: 6px 10px; border-radius: 999px; background: #DDF3E9; color: #0F5A42; animation: tick 8s infinite both; animation-delay: " + (l.delay2) + ";"))}>{l.status}</span>

                      </div>


                    </React.Fragment>
                  ))}

                </div>


                <div style={cssToStyle("margin-top: 8px; padding: 18px; border-radius: 16px; background: #0C1A22; color: #fff; display: flex; align-items: center; justify-content: space-between; gap: 12px;")}>

                  <span style={cssToStyle("font-size: 14px; color: #C9D3D8;")}>Books ready for tax preparation</span>


                  <span className="mono" style={cssToStyle("font-size: 12px; color: var(--acc-l);")}>QuickBooks-based</span>

                </div>

              </div>

            </div>

          </section>



          {/*  ============ ADDITIONAL COMPLIANCE ============  */}


          <section style={cssToStyle("background: #FFFFFF; border-top: 1px solid rgba(12,26,34,0.06); border-bottom: 1px solid rgba(12,26,34,0.06);")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto; padding: clamp(80px, 10vw, 130px) clamp(20px, 4vw, 40px);")}>

              <div className="rv" style={cssToStyle("display: flex; flex-wrap: wrap; gap: 24px 64px; justify-content: space-between; align-items: flex-end; margin-bottom: 48px;")}>

                <div style={cssToStyle("flex: 1 1 520px; min-width: 0;")}>

                  <p className="mono" style={cssToStyle("font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--acc); margin-bottom: 20px;")}>04 — Beyond the annual return</p>


                  <h2 style={cssToStyle("font-size: clamp(32px, 4vw, 54px); line-height: 1.04; letter-spacing: -0.03em; font-weight: 600;")}>Additional Tax and Compliance Support</h2>

                </div>


                <p style={cssToStyle("flex: 1 1 340px; min-width: 0; max-width: 420px; font-size: 16px; line-height: 1.65; color: #4A5A62;")}>Extensions, amendments, state-level and payroll reporting — scoped to your situation before any work begins.</p>

              </div>


              <div style={cssToStyle("display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;")}>

                {(v.compliance || []).map((c, index) => (
                  <React.Fragment key={index}>


                    <article className="lift rv" style={cssToStyle("border-radius: 22px; padding: 28px; background: #F4F5F1; border: 1px solid rgba(12,26,34,0.06); display: flex; flex-direction: column; gap: 16px; min-height: 280px;")}>

                      <div style={cssToStyle("display: flex; justify-content: space-between; align-items: center;")}>

                        <span className="mono" style={cssToStyle("font-size: 13px; color: var(--acc);")}>{c.n}</span>


                        <span className="mono" style={cssToStyle("font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; padding: 5px 9px; border-radius: 999px; background: #FFFFFF; color: #4A5A62;")}>{c.tag}</span>

                      </div>


                      <h3 style={cssToStyle("font-size: 22px; letter-spacing: -0.02em; font-weight: 600; line-height: 1.15;")}>{c.t}</h3>


                      <p style={cssToStyle("font-size: 15px; line-height: 1.6; color: #4A5A62;")}>{c.d}</p>

                    </article>


                  </React.Fragment>
                ))}


                <a href="#contact" className="lift rv" style={cssToStyle("border-radius: 22px; padding: 28px; background: var(--acc); color: #fff; display: flex; flex-direction: column; justify-content: space-between; gap: 16px; min-height: 280px; text-decoration: none;")}>

                  <p className="serif" style={cssToStyle("font-size: 32px; line-height: 1.1; font-style: italic;")}>Not sure what applies to you?</p>


                  <span style={cssToStyle("display: inline-flex; align-items: center; gap: 10px; font-weight: 600;")}>Talk it through with us
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></span>

                </a>

              </div>

            </div>

          </section>



          {/*  ============ PROCESS ============  */}


          <section id="process" style={cssToStyle("max-width: 1240px; margin: 0 auto; padding: clamp(80px, 10vw, 140px) clamp(20px, 4vw, 40px);")}>

            <div className="rv" style={cssToStyle("text-align: center; max-width: 760px; margin: 0 auto 64px;")}>

              <p className="mono" style={cssToStyle("font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--acc); margin-bottom: 20px;")}>05 — How it works</p>


              <h2 style={cssToStyle("font-size: clamp(34px, 4.4vw, 58px); line-height: 1.02; letter-spacing: -0.03em; font-weight: 600;")}>A clear process, from
                <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400;")}>documents to review.</span></h2>

            </div>



            <div className="rv" style={cssToStyle("position: relative; padding: 0 22px;")}>

              <div aria-hidden="true" style={cssToStyle("position: absolute; left: 44px; right: 44px; top: 22px; height: 2px; background: rgba(12,26,34,0.12);")}><div style={cssToStyle(("height: 100%; width: " + (v.stepPct) + "; background: var(--acc); transition: width .6s cubic-bezier(.2,.7,.2,1);"))}></div></div>


              <div role="tablist" aria-label="Process steps" style={cssToStyle("position: relative; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 24px;")}>

                {(v.steps || []).map((p, index) => (
                  <React.Fragment key={index}>


                    <button type="button" role="tab" className={p.cls} aria-selected={p.sel} onClick={p.pick}>

                      <span className="dot">{p.n}</span>


                      <span style={cssToStyle("font-size: 16px; font-weight: 600; line-height: 1.3;")}>{p.t}</span>

                    </button>


                  </React.Fragment>
                ))}

              </div>

            </div>



            <div className="rv" style={cssToStyle("margin-top: 48px; border-radius: 28px; background: #0C1A22; color: #E9EEF0; padding: clamp(28px, 4vw, 52px); position: relative; overflow: hidden; min-height: 240px;")}>

              <div className="gridbg" aria-hidden="true" style={cssToStyle("position: absolute; inset: 0; opacity: 0.5;")}></div>


              {(v.steps || []).map((p, index) => (
                <React.Fragment key={index}>


                  {(p.active) && (
                    <React.Fragment>


                      <div className="slide-in" role="tabpanel" style={cssToStyle("position: relative; display: flex; flex-wrap: wrap; gap: 32px 64px; align-items: center;")}>

                        <p className="mono" aria-hidden="true" style={cssToStyle("flex: 0 0 auto; font-size: clamp(90px, 11vw, 150px); line-height: 0.9; letter-spacing: -0.05em; color: var(--acc-l);")}>{p.n}</p>


                        <div style={cssToStyle("flex: 1 1 420px; min-width: 0;")}>

                          <h3 style={cssToStyle("font-size: clamp(26px, 2.8vw, 36px); letter-spacing: -0.02em; font-weight: 600; color: #fff;")}>{p.t}</h3>


                          <p style={cssToStyle("margin-top: 14px; font-size: 17px; line-height: 1.7; color: #A9B6BD; max-width: 640px;")}>{p.d}</p>

                        </div>


                        <div style={cssToStyle("display: flex; gap: 10px;")}>

                          <button type="button" aria-label="Previous step" onClick={v.prevStep} style={cssToStyle("width: 50px; height: 50px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.25); background: transparent; color: #fff; display: grid; place-items: center; cursor: pointer;")}><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"></path></svg></button>


                          <button type="button" aria-label="Next step" onClick={v.nextStep} style={cssToStyle("width: 50px; height: 50px; border-radius: 50%; border: 0; background: #fff; color: #0C1A22; display: grid; place-items: center; cursor: pointer;")}><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></button>

                        </div>

                      </div>


                    </React.Fragment>
                  )}


                </React.Fragment>
              ))}

            </div>


            <p className="rv" style={cssToStyle("margin-top: 18px; font-size: 13px; line-height: 1.6; color: #4A5A62; text-align: center; font-style: italic;")}>The exact workflow, review responsibilities and filing arrangements depend on the engagement and the agreement with the client or CPA firm.</p>

          </section>



          {/*  ============ WHY ============  */}


          <section style={cssToStyle("background: #0C1A22; color: #E9EEF0;")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto; padding: clamp(80px, 10vw, 140px) clamp(20px, 4vw, 40px);")}>

              <div className="rv" style={cssToStyle("display: flex; flex-wrap: wrap; gap: 24px 64px; justify-content: space-between; align-items: flex-end; margin-bottom: 56px;")}>

                <div style={cssToStyle("flex: 1 1 540px; min-width: 0;")}>

                  <p className="mono" style={cssToStyle("font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--acc-l); margin-bottom: 20px;")}>06 — Why Smart Tax Expertss</p>


                  <h2 style={cssToStyle("font-size: clamp(34px, 4.4vw, 58px); line-height: 1.02; letter-spacing: -0.03em; font-weight: 600; color: #fff;")}>More than a price comparison.</h2>

                </div>


                <p style={cssToStyle("flex: 1 1 340px; min-width: 0; max-width: 420px; font-size: 16px; line-height: 1.65; color: #A9B6BD;")}>You need a team that understands your requirements, works in your systems and handles financial information carefully. Here's what shapes our approach.</p>

              </div>



              <div style={cssToStyle("display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;")}>

                <article className="lift rv" style={cssToStyle("grid-row: span 2; border-radius: 24px; padding: 36px; background: var(--acc); color: #fff; display: flex; flex-direction: column; justify-content: space-between; gap: 40px; min-height: 420px;")}>

                  <p className="mono" style={cssToStyle("font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.8;")}>Experience</p>


                  <div>

                    <p style={cssToStyle("font-size: clamp(64px, 7vw, 104px); font-weight: 600; letter-spacing: -0.05em; line-height: 0.9;")}>5–10</p>


                    <p className="serif" style={cssToStyle("font-size: 30px; font-style: italic; margin-top: 8px;")}>years across tax &amp; accounting</p>


                    <p style={cssToStyle("margin-top: 18px; font-size: 15px; line-height: 1.6; color: rgba(255,255,255,0.85); max-width: 380px;")}>Supporting a range of individual, business and professional requirements.</p>

                  </div>

                </article>


                {(v.why || []).map((w, index) => (
                  <React.Fragment key={index}>


                    <article className="lift rv" style={cssToStyle("border-radius: 24px; padding: 30px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; gap: 14px; min-height: 200px;")}>

                      <span className="mono" style={cssToStyle("font-size: 12px; color: var(--acc-l);")}>{w.n}</span>


                      <h3 style={cssToStyle("font-size: 21px; font-weight: 600; letter-spacing: -0.02em; color: #fff; line-height: 1.2;")}>{w.t}</h3>


                      <p style={cssToStyle("font-size: 15px; line-height: 1.6; color: #A9B6BD;")}>{w.d}</p>

                    </article>


                  </React.Fragment>
                ))}

              </div>

            </div>

          </section>



          {/*  ============ WHO WE WORK WITH ============  */}


          <section style={cssToStyle("max-width: 1240px; margin: 0 auto; padding: clamp(80px, 10vw, 140px) clamp(20px, 4vw, 40px);")}>

            <div className="rv" style={cssToStyle("margin-bottom: 40px;")}>

              <p className="mono" style={cssToStyle("font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--acc); margin-bottom: 20px;")}>07 — Who we work with</p>


              <h2 style={cssToStyle("font-size: clamp(34px, 4.4vw, 58px); line-height: 1.02; letter-spacing: -0.03em; font-weight: 600; max-width: 820px;")}>Find your fit.
                <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400;")}>Pick the one that sounds like you.</span></h2>

            </div>


            <div className="rv" role="tablist" aria-label="Client types" style={cssToStyle("display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px;")}>

              {(v.aud || []).map((a, index) => (
                <React.Fragment key={index}>


                  <button type="button" role="tab" className={a.cls} aria-selected={a.sel} onClick={a.pick}>{a.t}</button>


                </React.Fragment>
              ))}

            </div>


            <div className="rv" style={cssToStyle("border-radius: 28px; background: #FFFFFF; border: 1px solid rgba(12,26,34,0.08); overflow: hidden;")}>

              {(v.aud || []).map((a, index) => (
                <React.Fragment key={index}>


                  {(a.active) && (
                    <React.Fragment>


                      <div className="fade-up" role="tabpanel" style={cssToStyle("display: flex; flex-wrap: wrap; align-items: stretch;")}>

                        <div style={cssToStyle("flex: 1 1 460px; min-width: 0; padding: clamp(28px, 4vw, 52px); display: flex; flex-direction: column; gap: 18px;")}>

                          <p className="mono" style={cssToStyle("font-size: 12px; color: var(--acc);")}>{a.n} / 05</p>


                          <h3 style={cssToStyle("font-size: clamp(28px, 3vw, 40px); letter-spacing: -0.025em; font-weight: 600; line-height: 1.08;")}>{a.t}</h3>


                          <p style={cssToStyle("font-size: 17px; line-height: 1.65; color: #4A5A62; max-width: 520px;")}>{a.d}</p>


                          <a href={a.href} className="btn btn-acc" style={cssToStyle("align-self: flex-start; margin-top: 10px;")}>{a.cta}
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>

                        </div>


                        <div style={cssToStyle("flex: 1 1 340px; min-width: 0; background: #E6ECE8; padding: clamp(28px, 4vw, 44px); display: flex; flex-direction: column; justify-content: center; gap: 12px;")}>

                          <p className="mono" style={cssToStyle("font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #3E4D55;")}>Typically involves</p>


                          {(a.forms || []).map((f, index) => (
                            <React.Fragment key={index}>


                              <div style={cssToStyle("display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 18px; border-radius: 14px; background: #FFFFFF;")}><span style={cssToStyle("font-size: 15px; font-weight: 600;")}>{f.l}</span>
                                <span className="mono" style={cssToStyle("font-size: 13px; color: var(--acc);")}>{f.f}</span></div>


                            </React.Fragment>
                          ))}

                        </div>

                      </div>


                    </React.Fragment>
                  )}


                </React.Fragment>
              ))}

            </div>

          </section>



          {/*  ============ FAQ ============  */}


          <section id="faq" style={cssToStyle("background: #FFFFFF; border-top: 1px solid rgba(12,26,34,0.06);")}>

            <div style={cssToStyle("max-width: 1240px; margin: 0 auto; padding: clamp(80px, 10vw, 140px) clamp(20px, 4vw, 40px); display: flex; flex-wrap: wrap; gap: 48px clamp(40px, 6vw, 96px); align-items: flex-start;")}>

              <div className="rv" style={cssToStyle("flex: 1 1 320px; min-width: 0; max-width: 420px; display: flex; flex-direction: column; gap: 20px;")}>

                <p className="mono" style={cssToStyle("font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--acc);")}>08 — Questions</p>


                <h2 style={cssToStyle("font-size: clamp(34px, 4vw, 54px); line-height: 1.02; letter-spacing: -0.03em; font-weight: 600;")}>Frequently asked
                  <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400;")}>questions</span></h2>


                <p style={cssToStyle("font-size: 16px; line-height: 1.65; color: #4A5A62;")}>Can't find what you need? Tell us about your returns, software and timelines.</p>


                <a href="#contact" className="btn btn-ghost-l" style={cssToStyle("align-self: flex-start;")}>Ask our team
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>

              </div>


              <div className="rv" style={cssToStyle("flex: 999 1 560px; min-width: 0; border-top: 1px solid rgba(12,26,34,0.12);")}>

                {(v.faqs || []).map((q, index) => (
                  <React.Fragment key={index}>


                    <div style={cssToStyle("border-bottom: 1px solid rgba(12,26,34,0.12);")}>

                      <h3 style={cssToStyle("margin: 0;")}><button type="button" className="faq-q" aria-expanded={q.exp} aria-controls={q.pid} onClick={q.toggle}><span style={cssToStyle("display: flex; gap: 18px; align-items: baseline;")}><span className="mono" style={cssToStyle("font-size: 12px; color: var(--acc); font-weight: 400;")}>{q.n}</span>
                        {q.q}</span>
                        <span className={q.icCls} aria-hidden="true"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg></span></button></h3>


                      {(q.open) && (
                        <React.Fragment>


                          <div id={q.pid} className="fade-up" style={cssToStyle("padding: 0 56px 26px 40px; font-size: 16px; line-height: 1.7; color: #4A5A62;")}>{q.a}</div>


                        </React.Fragment>
                      )}

                    </div>


                  </React.Fragment>
                ))}

              </div>

            </div>

          </section>



          {/*  ============ CONTACT ============  */}


          <section id="contact" style={cssToStyle("position: relative; background: #0C1A22; color: #E9EEF0; overflow: hidden;")}>

            <div aria-hidden="true" style={cssToStyle("position: absolute; width: 760px; height: 760px; left: -260px; bottom: -380px; border-radius: 50%; background: radial-gradient(circle, var(--acc) 0%, transparent 65%); opacity: 0.45; animation: orb 20s ease-in-out infinite;")}></div>


            <div className="gridbg" aria-hidden="true" style={cssToStyle("position: absolute; inset: 0;")}></div>


            <div style={cssToStyle("position: relative; max-width: 1240px; margin: 0 auto; padding: clamp(80px, 10vw, 140px) clamp(20px, 4vw, 40px); display: flex; flex-wrap: wrap; gap: 56px; align-items: flex-start;")}>

              <div className="rv" style={cssToStyle("flex: 1 1 460px; min-width: 0; display: flex; flex-direction: column; gap: 24px;")}>

                <p className="mono" style={cssToStyle("font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--acc-l);")}>Let's talk</p>


                <h2 style={cssToStyle("font-size: clamp(38px, 5vw, 72px); line-height: 0.98; letter-spacing: -0.035em; font-weight: 600; color: #fff;")}>Let's make your tax and accounting work
                  <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400; color: var(--acc-l);")}>more manageable.</span></h2>


                <p style={cssToStyle("font-size: 17px; line-height: 1.7; color: #A9B6BD; max-width: 520px;")}>Tell us about your requirements, the returns or accounting work involved, and the support you're looking for. We'll explain the next steps and whether we're the right fit.</p>


                <p className="serif" style={cssToStyle("margin-top: 12px; font-size: 22px; font-style: italic; color: #DCE4E7;")}>Tax Preparation. Accounting Support. CPA Outsourcing.</p>

              </div>



              <div className="rv" style={cssToStyle("flex: 1 1 440px; min-width: 0; border-radius: 28px; padding: clamp(24px, 3vw, 36px); background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.14); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);")}>

                {(v.notSent) && (
                  <React.Fragment>


                    <form onSubmit={v.submit} style={cssToStyle("display: flex; flex-direction: column; gap: 18px;")}>

                      <fieldset style={cssToStyle("border: 0; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;")}>

                        <legend style={cssToStyle("font-size: 13px; font-weight: 600; color: #C9D3D8; margin-bottom: 10px; padding: 0;")}>I'm looking for</legend>


                        <div style={cssToStyle("display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px;")}>

                          {(v.enq || []).map((e, index) => (
                            <React.Fragment key={index}>


                              <button type="button" className={e.cls} aria-pressed={e.pressed} onClick={e.pick}>{e.t}</button>


                            </React.Fragment>
                          ))}

                        </div>

                      </fieldset>


                      <div style={cssToStyle("display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px;")}>

                        <div className="field"><label htmlFor="f-name">Full name</label>
                          <input id="f-name" type="text" autoComplete="name" placeholder="Jane Carter" /></div>


                        <div className="field"><label htmlFor="f-email">Work email</label>
                          <input id="f-email" type="email" autoComplete="email" placeholder="jane@firm.com" /></div>

                      </div>


                      <div className="field"><label htmlFor="f-msg">{v.msgLabel}</label>
                        <textarea id="f-msg" rows="4" placeholder={v.msgPh} style={cssToStyle("min-height: 120px; resize: vertical;")}></textarea></div>


                      {v.submitError && (
                        <div style={{ color: '#F87171', fontSize: '13px', fontWeight: 600 }}>
                          {v.submitError}
                        </div>
                      )}

                      <button type="submit" disabled={v.submitting} className="btn btn-acc" style={cssToStyle("width: 100%; min-height: 56px; font-size: 16px; opacity: " + (v.submitting ? '0.7' : '1') + ";")}>
                        {v.submitting ? 'Sending...' : v.submitLabel}
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></button>


                      <p style={cssToStyle("font-size: 12px; line-height: 1.5; color: #8A989F;")}>We'll reply to discuss scope before any work begins. Please don't send tax documents through this form.</p>

                    </form>


                  </React.Fragment>
                )}


                {(v.sent) && (
                  <React.Fragment>


                    <div className="fade-up" aria-live="polite" style={cssToStyle("min-height: 380px; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 18px;")}>

                      <span style={cssToStyle("width: 64px; height: 64px; border-radius: 50%; background: var(--acc); display: grid; place-items: center; animation: pulse 2s infinite;")}><svg width="28" height="28" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg></span>


                      <p className="serif" style={cssToStyle("font-size: 36px; font-style: italic; color: #fff; line-height: 1.1;")}>Thank you — we'll be in touch.</p>


                      <p style={cssToStyle("font-size: 15px; color: #A9B6BD;")}>Our team will review your requirements and reply with next steps.</p>


                      <button type="button" className="btn btn-ghost-d" onClick={v.reset}>Send another enquiry</button>

                    </div>


                  </React.Fragment>
                )}

              </div>

            </div>



            <footer style={cssToStyle("position: relative; border-top: 1px solid rgba(255,255,255,0.1);")}>

              <div style={cssToStyle("max-width: 1240px; margin: 0 auto; padding: 28px clamp(20px, 4vw, 40px) 36px; display: flex; flex-wrap: wrap; gap: 16px 40px; justify-content: space-between; align-items: center;")}>

                <p style={cssToStyle("font-size: 15px; font-weight: 600; color: #fff;")}>Smart Tax
                  <span className="serif" style={cssToStyle("font-style: italic; font-weight: 400; color: var(--acc-l);")}>Expertss</span></p>


                <p style={cssToStyle("flex: 1 1 420px; min-width: 0; max-width: 680px; font-size: 12px; line-height: 1.6; color: #8A989F;")}>Filing arrangements depend on the engagement and applicable authorisations. The taxpayer or responsible authorised tax professional remains responsible for reviewing, approving and filing each return.</p>

              </div>

            </footer>

          </section>


        </div>


      </>
    );
  }
}

export default TaxPreparationPage;
