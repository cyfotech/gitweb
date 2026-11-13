// Automated responsive viewport audit for Preferred Tax Consultancy (fast path)
// Tests every public route at multiple viewports in both themes, checking for
// horizontal overflow + page errors. Optimized to fit within time limits.
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const OUT_DIR = path.resolve('./scripts/viewport-output');
fs.mkdirSync(OUT_DIR, { recursive: true });

const ROUTES = [
  { path: '/', label: 'home' },
  { path: '/about', label: 'about' },
  { path: '/services', label: 'services' },
  { path: '/tax-planning', label: 'tax-planning' },
  { path: '/tax-preparation', label: 'tax-preparation' },
  { path: '/bookkeeping', label: 'bookkeeping' },
  { path: '/hire-professionals', label: 'hire-professionals' },
  { path: '/tax-resources', label: 'tax-resources' },
  { path: '/blog', label: 'blog' },
  { path: '/contact', label: 'contact' },
  { path: '/tax-calculator', label: 'tax-calculator' },
  { path: '/book-consultation', label: 'book-consultation' },
];

const VIEWPORTS = [
  { name: 'mobile320', width: 320, height: 640 },
  { name: 'mobile375', width: 375, height: 812 },
  { name: 'mobile390', width: 390, height: 844 },
  { name: 'mobile430', width: 430, height: 932 },
  { name: 'tablet768', width: 768, height: 1024 },
  { name: 'tablet820', width: 820, height: 1180 },
  { name: 'lap1024', width: 1024, height: 768 },
  { name: 'lap1280', width: 1280, height: 720 },
  { name: 'lap1366', width: 1366, height: 768 },
  { name: 'desk1920', width: 1920, height: 1080 },
  { name: 'uw2560', width: 2560, height: 1440 },
];

async function auditPage(page, route) {
  const url = `${BASE}${route.path}`;
  const consoleErrors = [];
  page.removeAllListeners('console');
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 160));
  });
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(500);
    const r = await page.evaluate(() => {
      const issues = [];
      const d = document.documentElement;
      if (d.scrollWidth > d.clientWidth + 1) issues.push({ sel: 'document', sw: d.scrollWidth, cw: d.clientWidth });
      const b = document.body;
      if (b.scrollWidth > b.clientWidth + 1) issues.push({ sel: 'body', sw: b.scrollWidth, cw: b.clientWidth });
      document.querySelectorAll('body *').forEach((el) => {
        if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
          const cs = getComputedStyle(el);
          if (cs.overflow === 'hidden') return;
          const tag = el.tagName.toLowerCase();
          if (['svg', 'path', 'g', 'defs', 'circle', 'rect', 'line', 'polyline', 'polygon'].includes(tag)) return;
          issues.push({ sel: `${tag}.${String(el.className).trim().split(/\s+/).join('.')}`, sw: el.scrollWidth, cw: el.clientWidth });
          // cap at 120 per page
          if (issues.length >= 120) return;
        }
      });
      return issues;
    });
    const real = r.filter((x) => x.sw - x.cw > 2).map((x) => ({ ...x, over: x.sw - x.cw }));
    real.sort((a, b2) => b2.over - a.over);
    return { ok: real.length === 0, issues: real.slice(0, 20), consoleErrors };
  } catch (e) {
    return { ok: false, loadError: e.message.slice(0, 200), consoleErrors };
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const allIssues = [];
  const byRoute = {};

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    for (const theme of ['light', 'dark']) {
      const page = await context.newPage();
      await page.addInitScript((th) => {
        try {
          localStorage.setItem('preferred-tax-theme', th);
          if (th === 'dark') document.documentElement.classList.add('dark');
          else document.documentElement.classList.remove('dark');
        } catch (e) { }
      }, theme);
      for (const route of ROUTES) {
        const r = await auditPage(page, route);
        if (!r.ok && r.issues) {
          for (const iss of r.issues) {
            const key = `${route.label}::${iss.sel}`;
            if (!byRoute[key]) byRoute[key] = { route: route.label, sel: iss.sel, over: iss.over, cases: [] };
            byRoute[key].cases.push(`${vp.name}/${theme} (+${iss.over}px)`);
          }
          allIssues.push({ vp: vp.name, theme, route: route.label, issues: r.issues });
        }
        if (r.consoleErrors && r.consoleErrors.length) {
          allIssues.push({ vp: vp.name, theme, route: route.label, console: r.consoleErrors });
        }
      }
      await page.close();
    }
    await context.close();
  }
  await browser.close();

  let md = '# Viewport Audit Report\n\n';
  md += `Base: ${BASE}\n`;
  md += `Routes: ${ROUTES.length}, Viewports: ${VIEWPORTS.length}, Themes: 2\n\n`;

  const overflowOnly = allIssues.filter((x) => x.issues && x.issues.length);
  md += '## Horizontal overflow issues\n\n';
  if (Object.keys(byRoute).length === 0) {
    md += 'None detected.\n';
  } else {
    md += `Total unique offending elements: ${Object.keys(byRoute).length}\n\n`;
    for (const [k, v] of Object.entries(byRoute)) {
      md += `- **${v.route}** \`${v.sel}\` overflows by up to ${v.over}px — ${v.cases.slice(0, 10).join(', ')}\n`;
    }
  }

  const consoleOnly = allIssues.filter((x) => x.console && x.console.length);
  md += '\n## Page console errors (all pages, filtered)\n\n';
  if (consoleOnly.length === 0) {
    md += 'None.\n';
  } else {
    const seen = {};
    for (const c of consoleOnly) {
      for (const e of c.console) {
        if (/502|favicon|404/.test(e)) continue;
        const key = e.slice(0, 120);
        if (!seen[key]) seen[key] = { count: 0, sample: e };
        seen[key].count++;
      }
    }
    for (const v of Object.values(seen)) {
      md += `- (${v.count}x) ${v.sample}\n`;
    }
  }

  fs.writeFileSync(path.join(OUT_DIR, 'REPORT.md'), md);
  console.log('DONE');
  console.log('Unique overflow elements:', Object.keys(byRoute).length);
  for (const [k, v] of Object.entries(byRoute)) {
    console.log(`  ${v.route} :: ${v.sel} +${v.over}px (${v.cases.length} cases)`);
  }
  console.log('Non-backend console error types:', consoleOnly.length ? Object.keys(consoleOnly.reduce((a, c) => (c.console.forEach((e) => (a[e.slice(0, 80)] = 1)), a), {})).length : 0);
}

main().catch((e) => {
  console.error('FATAL', e.message);
  process.exit(1);
});
