const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://localhost:3001/usa-tax-preparation-services', { waitUntil: 'networkidle' });

  // Light mode screenshot
  const sec1 = page.locator('section:has(h2:has-text("US Tax Preparation Services for"))');
  await sec1.screenshot({ path: 'frontend/test_sec1_light_now.png' });
  console.log('Saved light mode screenshot');
  await browser.close();
})();
