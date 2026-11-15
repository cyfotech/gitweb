const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://localhost:3001/usa-tax-preparation-services', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(500);

  const btns = await page.locator('.rail-btn').all();
  for (let i = 0; i < btns.length; i++) {
    const isSelected = await btns[i].evaluate(el => el.classList.contains('on'));
    const cs = await btns[i].evaluate(el => {
      const computed = window.getComputedStyle(el);
      const span1 = el.querySelector('span:nth-child(2)');
      const spanCs = span1 ? window.getComputedStyle(span1) : null;
      return {
        bg: computed.backgroundColor,
        color: computed.color,
        spanColor: spanCs ? spanCs.color : null
      };
    });
    console.log('Btn ' + i + ' (selected: ' + isSelected + '):', JSON.stringify(cs));
  }

  await browser.close();
})();
