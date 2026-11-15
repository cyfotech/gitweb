const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://localhost:3001/usa-tax-preparation-services', { waitUntil: 'networkidle' });
  
  // Set dark mode
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(1000);

  // Take full page screenshot in dark mode
  await page.screenshot({ path: 'frontend/tax_prep_dark_full.png', fullPage: true });
  console.log('Saved dark full page screenshot');

  // Also take light full page screenshot
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'frontend/tax_prep_light_full.png', fullPage: true });
  console.log('Saved light full page screenshot');

  await browser.close();
})();
