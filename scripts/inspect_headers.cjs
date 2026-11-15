const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 800 } });
  await page.goto('http://localhost:3001/services/payroll-management', { waitUntil: 'networkidle' });

  const headers = await page.evaluate(() => {
    const list = [];
    document.querySelectorAll('header, nav, .hdr, .subnav, div[style*="justify-content: space-between"]').forEach(el => {
      const r = el.getBoundingClientRect();
      list.push({
        tag: el.tagName,
        class: el.className,
        rect: { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height) },
        text: (el.innerText || '').slice(0, 60).replace(/\n/g, ' ')
      });
    });
    return list;
  });

  console.log(JSON.stringify(headers, null, 2));
  await browser.close();
})();
