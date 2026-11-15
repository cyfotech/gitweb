const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://localhost:3001/usa-tax-preparation-services', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(500);

  const btns = await page.locator('[role="tab"]').all();
  console.log('Total tabs on page:', btns.length);
  for (let i = 0; i < btns.length; i++) {
    const text = await btns[i].innerText();
    const bg = await btns[i].evaluate(el => window.getComputedStyle(el).backgroundColor);
    const color = await btns[i].evaluate(el => window.getComputedStyle(el).color);
    console.log('Tab ' + i + ': ' + text.replace(/\n/g, ' ') + ' | bg: ' + bg + ' | color: ' + color);
  }

  await browser.close();
})();
