const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://localhost:3001/usa-tax-preparation-services', { waitUntil: 'networkidle' });

  // light mode panel background
  const lightPanelBg = await page.locator('[role="tabpanel"]').first().evaluate(el => window.getComputedStyle(el).backgroundColor);
  console.log('Light panel background:', lightPanelBg);

  // dark mode panel background
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(500);
  const darkPanelBg = await page.locator('[role="tabpanel"]').first().evaluate(el => window.getComputedStyle(el).backgroundColor);
  console.log('Dark panel background:', darkPanelBg);

  await browser.close();
})();
