const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://localhost:3001/usa-tax-preparation-services', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(500);

  // click Partnership (tab index 2)
  const buttons = await page.locator('.rail-btn').all();
  console.log('rail-btns count:', buttons.length);
  if (buttons.length >= 3) {
    await buttons[2].click();
    await page.waitForTimeout(500);
  }

  const sec1 = page.locator('section:has(h2:has-text("US Tax Preparation Services for"))');
  await sec1.screenshot({ path: 'frontend/test_sec1_dark.png' });
  console.log('Saved sec1 screenshot');

  await browser.close();
})();
