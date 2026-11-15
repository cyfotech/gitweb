const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://localhost:3001/usa-tax-preparation-services', { waitUntil: 'networkidle' });

  // remove dark class to test real light mode
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  await page.waitForTimeout(500);

  const sec1 = page.locator('section:has(h2:has-text("US Tax Preparation Services for"))');
  await sec1.screenshot({ path: 'frontend/test_sec1_real_light.png' });
  console.log('Saved real light mode screenshot');
  await browser.close();
})();
