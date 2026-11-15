const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 800 } });
  await page.goto('http://localhost:3001/services/payroll-management', { waitUntil: 'networkidle' });

  const sections = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('section')).map(s => {
      const h2 = s.querySelector('h2');
      const r = s.getBoundingClientRect();
      const wrap = s.querySelector('.wrap');
      return {
        id: s.id,
        heading: h2 ? h2.innerText.slice(0, 30).replace(/\n/g, ' ') : '',
        width: Math.round(r.width),
        wrapWidth: wrap ? Math.round(wrap.getBoundingClientRect().width) : null
      };
    });
  });

  console.log(JSON.stringify(sections, null, 2));

  // Take full page screenshot
  await page.screenshot({ path: 'frontend/payroll_mobile_full.png', fullPage: true });
  console.log('Saved payroll_mobile_full.png');

  await browser.close();
})();
