import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://localhost:3000/services', { waitUntil: 'domcontentloaded', timeout: 25000 });
await page.waitForTimeout(900);
await page.evaluate(() => document.documentElement.classList.add('dark'));
await page.waitForTimeout(400);

// 1) Find a span with text "01" and dump its ancestry backgrounds
const stepChain = await page.evaluate(() => {
  const spans = [...document.querySelectorAll('span')].filter(s => (s.textContent||'').trim() === '01');
  const out = [];
  for (const s of spans.slice(0, 2)) {
    const chain = [];
    let n = s; let depth = 0;
    while (n && depth < 6) {
      const cs = getComputedStyle(n);
      chain.push({ tag: n.tagName, id: n.id, cls: (n.className||'').toString().slice(0,30), bg: cs.backgroundColor, col: cs.color, display: cs.display });
      n = n.parentElement; depth++;
    }
    out.push(chain);
  }
  return out;
});

// 2) Dump the navbar element and its bg/text
const navbar = await page.evaluate(() => {
  const el = document.querySelector('.ptc-navbar') || document.querySelector('header') || [...document.querySelectorAll('div')].find(d => (d.textContent||'').includes('System Operational') && getComputedStyle(d).position === 'fixed');
  if (!el) return null;
  const cs = getComputedStyle(el);
  const links = [...el.querySelectorAll('a')].slice(0, 3).map(a => ({ txt: (a.textContent||'').trim().slice(0,20), col: getComputedStyle(a).color }));
  return { tag: el.tagName, cls: (el.className||'').toString().slice(0,60), bg: cs.backgroundColor, position: cs.position, color: cs.color, links };
});

console.log('STEP CHAIN:', JSON.stringify(stepChain, null, 2));
console.log('NAVBAR:', JSON.stringify(navbar, null, 2));
await browser.close();
