// Dark-mode contrast + overflow audit for all service routes (bounded, fast).
import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const ROUTES = [
  ['/services', 'Services'],
  ['/tax-planning', 'TaxPlanning'],
  ['/tax-preparation', 'TaxPreparation'],
  ['/bookkeeping', 'Bookkeeping'],
  ['/services/payroll-management', 'Payroll'],
  ['/main-services', 'MainServices'],
  ['/cpa-outsourcing', 'CpaOutsourcing'],
  ['/hire-professionals', 'HireProfessionals'],
];
const WIDTHS = [390, 768, 1440];

function lum(r, g, b) {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function ratio(a, b) {
  const L1 = Math.max(a, b), L2 = Math.min(a, b);
  return (L1 + 0.05) / (L2 + 0.05);
}
const parseRgb = (s) => {
  const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/.exec(s);
  if (!m) return null;
  return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : parseFloat(m[4]) };
};

const browser = await chromium.launch();
const out = [];

for (const [path, label] of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
  try {
    await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(900);
    // ensure dark
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(300);
    const docW = await page.evaluate(() => document.documentElement.scrollWidth);
    const vw = await page.evaluate(() => window.innerWidth);

    const fails = [];
    for (const W of WIDTHS) {
      await page.setViewportSize({ width: W, height: 844 });
      await page.waitForTimeout(450);
      // collect on-screen visible text elements with effective bg contrast
      const res = await page.evaluate(() => {
        const parseRgb = (s) => {
          const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/.exec(s);
          if (!m) return null;
          return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : parseFloat(m[4]) };
        };
        const lum = (r, g, b) => {
          const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
          return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
        };
        const ratio = (a, b) => { const L1 = Math.max(a, b), L2 = Math.min(a, b); return (L1 + 0.05) / (L2 + 0.05); };
        const els = [...document.querySelectorAll('p,span,h1,h2,h3,h4,li,a,button,label,input,textarea,em,strong,b,div')];
        const hits = [];
        for (const el of els) {
          const cs = getComputedStyle(el);
          const col = parseRgb(cs.color);
          const fs = parseFloat(cs.fontSize);
          if (!col || col.a < 0.5) continue;
          // effective background: walk ancestors
          let bg = null;
          let n = el;
          while (n && n !== document.documentElement) {
            const bcs = getComputedStyle(n);
            const b = parseRgb(bcs.backgroundColor);
            if (b && b.a > 0.1) { bg = b; break; }
            n = n.parentElement;
          }
          if (!bg) bg = { r: 7, g: 18, b: 31, a: 1 };
          const r = ratio(lum(col.r, col.g, col.b), lum(bg.r, bg.g, bg.b));
          const minReq = fs >= 18.66 ? 3 : 4.5;
          if (r < minReq) {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0 && rect.width > 1) {
              const txt = (el.textContent || '').trim().slice(0, 40).replace(/\s+/g, ' ');
              hits.push({ tag: el.tagName, txt, col: cs.color, bg: `rgb(${bg.r},${bg.g},${bg.b})`, r: r.toFixed(2), req: minReq });
            }
          }
        }
        return hits;
      });
      // dedupe by text+tag
      const seen = new Set();
      for (const h of res) {
        const key = h.tag + '|' + h.txt + '|' + h.col;
        if (!seen.has(key)) { seen.add(key); fails.push({ W, ...h }); }
      }
    }
    out.push({
      route: path, label, docScrollOverflow: docW > vw ? `${docW} > ${vw}` : 'none',
      consoleErrors: errors.length, contrastFails: fails.slice(0, 12), totalFails: fails.length,
    });
  } catch (e) {
    out.push({ route: path, label, error: e.message.split('\n')[0] });
  }
  try { await page.close(); } catch (_) { }
}

await browser.close();
const fs = await import('node:fs');
fs.writeFileSync('audit_service_results.json', JSON.stringify(out, null, 2));
console.log('WROTE audit_service_results.json rows=' + out.length);
