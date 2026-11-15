import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:3002';
const ROUTE = process.env.ROUTE || '/tax-preparation';
const W = parseInt(process.env.W || '390', 10);
const MODE = process.env.MODE || 'dark';
const OUT = process.env.OUT || 'contrast_results.json';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: W, height: 844 } });
const page = await ctx.newPage();
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push(String(e)));

await page.goto(BASE + ROUTE, { waitUntil: 'domcontentloaded', timeout: 45000 });
await page.waitForTimeout(2500);

// Apply dark mode to the html root
if (MODE === 'dark') {
  await page.evaluate(() => { document.documentElement.classList.add('dark'); });
  await page.waitForTimeout(400);
}

async function collect() {
  return page.evaluate(() => {
    function parseColor(c) {
      if (!c) return null;
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const p = m[1].split(',').map(x => parseFloat(x.trim()));
      return { r: p[0] || 0, g: p[1] || 0, b: p[2] || 0, a: p.length > 3 ? p[3] : 1 };
    }
    function lum({ r, g, b }) {
      const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    }
    function ratio(a, b) {
      const l1 = lum(a), l2 = lum(b);
      const hi = Math.max(l1, l2), lo = Math.min(l1, l2);
      return (hi + 0.05) / (lo + 0.05);
    }
    // effective bg: walk ancestors, find first opaque-ish
    function effBg(el) {
      let node = el;
      while (node) {
        const bg = getComputedStyle(node).backgroundColor;
        const c = parseColor(bg);
        if (c && c.a > 0.9) return c;
        node = node.parentElement;
      }
      return { r: 255, g: 255, b: 255, a: 1 };
    }
    const out = [];
    const els = document.querySelectorAll('body *');
    for (const el of els) {
      const cs = getComputedStyle(el);
      const txt = (el.textContent || '').trim().replace(/\s+/g, ' ');
      if (!txt) continue;
      const size = parseFloat(cs.fontSize) || 16;
      const weight = parseInt(cs.fontWeight) || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const thresh = large ? 3 : 4.5;
      const fg = parseColor(cs.color);
      if (!fg) continue;
      const bg = effBg(el);
      const r = ratio(fg, bg);
      if (r < thresh) {
        out.push({
          tag: el.tagName,
          cls: el.className && typeof el.className === 'string' ? el.className.slice(0, 40) : '',
          txt: txt.slice(0, 40),
          color: cs.color,
          bg: `rgb(${bg.r},${bg.g},${bg.b})`,
          ratio: +r.toFixed(2),
          size, weight, large,
          inVP: (() => {
            const rect = el.getBoundingClientRect();
            return rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
          })(),
        });
      }
    }
    return out;
  });
}

const all = [];
for (let i = 0; i < 12; i++) {
  all.push(...await collect());
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await page.waitForTimeout(250);
}

import { writeFileSync } from 'fs';
writeFileSync(OUT, JSON.stringify({ mode: MODE, w: W, route: ROUTE, errors, fails: all }, null, 2));
await browser.close();
console.log('done, fails:', all.length);
