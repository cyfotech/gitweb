const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://localhost:3001/usa-tax-preparation-services', { waitUntil: 'networkidle' });

  // light theme
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  await page.waitForTimeout(500);

  const btns = await page.locator('.rail-btn').all();
  if (btns.length >= 2) {
    await btns[1].click(); // click Sole Proprietorship (Sch C)
    await page.waitForTimeout(500);
  }

  const container = page.locator('section:has(h2:has-text("US Tax Preparation Services for"))');
  await container.screenshot({ path: 'frontend/test_sch_c_light.png' });
  console.log('Saved test_sch_c_light.png');

  await browser.close();
})();
