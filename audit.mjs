import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const WIDTHS = [320, 360, 390, 430, 768, 1024, 1440, 1920];

// Public routes to audit (key marketing pages + detail routes + 404).
const ROUTES = [
  '/',
  '/about',
  '/services',
  '/tax-preparation',
  '/tax-planning',
  '/bookkeeping',
  '/services/payroll-management',
  '/cpa-outsourcing',
  '/hire-professionals',
  '/tax-resources',
  '/blog',
  '/contact',
  '/book-consultation',
  '/tax-calculator',
  '/this-route-does-not-exist', // 404
];

function isScrollContainer(el) {
  const s = getComputedStyle(el);
  return s.overflow === 'auto' || s.overflow === 'scroll' ||
    s.overflowX === 'auto' || s.overflowX === 'scroll' ||
    s.overflowX === 'hidden' || s.overflow === 'hidden';
}

function auditPage() {
  const vw = window.innerWidth;
  const docScroll = document.documentElement.scrollWidth;
  const bodyScroll = document.body.scrollWidth;
  const overflowElems = [];
  const clipped = [];
  // All visible elements
  const els = document.querySelectorAll('body *');
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    // Element protruding beyond viewport (allow <1px rounding)
    if (r.right > vw + 1 || r.left < -1) {
      // Skip intentional containers that clip their own overflow
      if (isScrollContainer(el)) { clipped.push({ tag: el.tagName, cls: el.className && String(el.className).slice(0, 60), right: Math.round(r.right), left: Math.round(r.left) }); continue; }
      overflowElems.push({ tag: el.tagName, cls: el.className && String(el.className).slice(0, 60), right: Math.round(r.right), left: Math.round(r.left) });
    }
  }
  return { vw, docScroll, bodyScroll, horizOverflow: docScroll > vw + 1 || bodyScroll > vw + 1, overflowElems: overflowElems.slice(0, 25), clipped: clipped.slice(0, 10) };
}

const browser = await chromium.launch();
const results = [];

for (const route of ROUTES) {
  for (const w of WIDTHS) {
    const page = await browser.newPage({ viewport: { width: w, height: 800 } });
    const consoleErrs = [];
    page.on('console', m => { if (m.type() === 'error') consoleErrs.push(m.text().slice(0, 120)); });
    page.on('pageerror', e => consoleErrs.push('pageerror: ' + String(e).slice(0, 120)));
    try {
      await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(800);
      const data = await page.evaluate(auditPage);
      results.push({ route, w, ok: !data.horizOverflow && data.overflowElems.length === 0, data, consoleErrs: consoleErrs.slice(0, 3) });
    } catch (e) {
      results.push({ route, w, ok: false, error: String(e).slice(0, 120), consoleErrs });
    }
    await page.close();
  }
}

await browser.close();

// Summarize
let fail = 0;
for (const r of results) {
  const flag = r.ok ? 'PASS' : 'FAIL';
  if (!r.ok) fail++;
  const extra = r.data ? ` scrollW=${r.data.docScroll} vw=${r.data.vw} offViewport=${r.data.overflowElems.length}` : (r.error ? ' ERR ' + r.error : '');
  const ce = r.consoleErrs.length ? ' | console: ' + r.consoleErrs.join(' ; ') : '';
  console.log(`${flag} ${r.route} @${r.w}${extra}${ce}`);
}
console.log(`\nTOTAL=${results.length} FAIL=${fail}`);
