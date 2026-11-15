import { chromium } from 'playwright';
const browser = await chromium.launch();
for (const path of ['/services', '/services/payroll-management', '/main-services', '/hire-professionals']) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:3000' + path, { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(800);
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(350);
  const chain = await page.evaluate(() => {
    // find element whose text starts with "System Operational"
    const walk = [];
    const els = [...document.querySelectorAll('div,section,span,header,nav,main,body')];
    const target = els.find(el => (el.textContent||'').trim().startsWith('System Operational'));
    if (!target) return [{ note: 'not found' }];
    let n = target; let d = 0;
    while (n && d < 8) {
      const cs = getComputedStyle(n);
      const b = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/.exec(cs.backgroundColor);
      walk.push({ tag: n.tagName, cls: (n.className||'').toString().slice(0,45), id: n.id, bg: b ? cs.backgroundColor : 'transparent', col: cs.color, position: cs.position });
      n = n.parentElement; d++;
    }
    return walk;
  });
  console.log('=== ' + path + ' (System Operational chain) ===');
  console.log(JSON.stringify(chain, null, 1));
  await page.close().catch(() => {});
}
await browser.close();
