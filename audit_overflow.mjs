// Fast responsive overflow audit. Writes incremental JSON to .audit_results.ndjson
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = 'http://localhost:3000';
const OUT = '.audit_results.ndjson';
fs.writeFileSync(OUT, '');

const pages = [
  ['home', '/'],
  ['about', '/about'],
  ['services', '/services'],
  ['tax-planning', '/tax-planning'],
  ['tax-preparation', '/tax-preparation'],
  ['bookkeeping', '/bookkeeping'],
  ['payroll', '/services/payroll-management'],
  ['contact', '/contact'],
  ['blog', '/blog'],
  ['calculator', '/tax-calculator'],
  ['404', '/definitely-not-a-page'],
];

const widths = [320, 360, 390, 430, 768, 1024, 1440, 1920];

const browser = await chromium.launch();
for (const [name, path] of pages) {
  for (const w of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    const consoleErrors = [];
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160));
    });
    let rec = { page: name, width: w, url: '', status: 0, scrollWidth: 0, innerWidth: 0, overflow: 0, offRight: 0, offLeft: 0, clippedCards: 0, consoleErrors: [] };
    try {
      const resp = await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 15000 });
      rec.status = resp ? resp.status() : 0;
      await page.waitForTimeout(350);
      rec.url = page.url();
      rec = await page.evaluate(() => {
        const iw = window.innerWidth;
        const sw = document.documentElement.scrollWidth;
        let offRight = 0, offLeft = 0, clippedCards = 0;
        const els = document.querySelectorAll('body *');
        for (const el of els) {
          const cs = getComputedStyle(el);
          // skip intentional scroll containers
          if (/(auto|scroll)/.test(cs.overflowX + cs.overflowY)) continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (r.right > iw + 1) offRight++;
          if (r.left < -1) offLeft++;
          // card-like elements partially cut at right edge
          if (r.width > 0 && r.right > iw && r.width > iw * 0.5) clippedCards++;
        }
        return { innerWidth: iw, scrollWidth: sw, offRight, offLeft, clippedCards };
      });
      rec.overflow = Math.max(0, rec.scrollWidth - rec.innerWidth);
      rec.consoleErrors = consoleErrors.slice(0, 3);
    } catch (e) {
      rec.consoleErrors = ['LOAD_FAIL: ' + String(e).slice(0, 120)];
    }
    fs.appendFileSync(OUT, JSON.stringify(rec) + '\n');
    console.log(`${name}\t${w}\toverflow=${rec.overflow}\toffRight=${rec.offRight}\toffLeft=${rec.offLeft}\tclippedCards=${rec.clippedCards}\tstatus=${rec.status}\tcerr=${consoleErrors.length}`);
    await ctx.close();
  }
}
await browser.close();
console.log('DONE');
