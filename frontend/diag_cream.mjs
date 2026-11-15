import { chromium } from 'playwright';
const parseRgb = (s) => {
  const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/.exec(s);
  return m ? { r: +m[1], g: +m[2], b: +m[3] } : null;
};
const browser = await chromium.launch();
for (const path of ['/services', '/services/payroll-management', '/main-services', '/hire-professionals']) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:3000' + path, { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(800);
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(350);
  const found = await page.evaluate(() => {
    const out = [];
    const els = [...document.querySelectorAll('div,span,a,header,nav,section')];
    for (const el of els) {
      const cs = getComputedStyle(el);
      const b = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/.exec(cs.backgroundColor);
      if (!b) continue;
      const [r, g, gg] = [+b[1], +b[2], +b[3]];
      // cream-ish background
      if (r > 235 && g > 230 && gg > 225) {
        const txt = (el.textContent || '').trim().slice(0, 50).replace(/\s+/g, ' ');
        const rect = el.getBoundingClientRect();
        if (rect.width > 5 && rect.height > 5 && rect.top < window.innerHeight * 1.2) {
          out.push({ tag: el.tagName, cls: (el.className||'').toString().slice(0,50), bg: cs.backgroundColor, txt });
        }
      }
    }
    return out.slice(0, 12);
  });
  console.log('=== ' + path + ' ===');
  console.log(JSON.stringify(found, null, 1));
  await page.close().catch(() => {});
}
await browser.close();
