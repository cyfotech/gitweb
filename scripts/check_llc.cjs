const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://localhost:3001/usa-tax-preparation-services', { waitUntil: 'networkidle' });

  // 1. Light theme: click LLC tab (index 5)
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  await page.waitForTimeout(500);
  const btns = await page.locator('.rail-btn').all();
  if (btns.length >= 6) {
    await btns[5].click(); // LLC
    await page.waitForTimeout(500);
  }
  const secLight = page.locator('section:has(h2:has-text("US Tax Preparation Services for"))');
  await secLight.screenshot({ path: 'frontend/test_llc_light.png' });
  console.log('Saved LLC light screenshot');

  // 2. Dark theme: keep LLC tab active
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(500);
  await secLight.screenshot({ path: 'frontend/test_llc_dark.png' });
  console.log('Saved LLC dark screenshot');

  // Check 1065 Partnership as well in dark theme
  if (btns.length >= 3) {
    await btns[2].click(); // Partnership
    await page.waitForTimeout(500);
    await secLight.screenshot({ path: 'frontend/test_1065_dark.png' });
    console.log('Saved 1065 dark screenshot');
  }

  await browser.close();
})();
