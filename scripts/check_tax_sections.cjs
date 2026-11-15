const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://localhost:3001/usa-tax-preparation-services', { waitUntil: 'networkidle' });
  
  // Set dark mode
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(500);

  // Take screenshot of section 04 (compliance)
  const compSec = await page.locator('h2:has-text("Additional Tax and Compliance Support")').first();
  if (await compSec.count() > 0) {
    const parentSec = page.locator('section:has(h2:has-text("Additional Tax and Compliance Support"))');
    await parentSec.screenshot({ path: 'frontend/tax_compliance_dark.png' });
    console.log('Saved compliance screenshot');
  }

  // Take screenshot of section 07 (who we work with)
  const whoSec = page.locator('section:has(h2:has-text("Find your fit"))');
  if (await whoSec.count() > 0) {
    await whoSec.screenshot({ path: 'frontend/tax_who_dark.png' });
    console.log('Saved who screenshot');
  }

  // Take screenshot of Bookkeeping checklist
  const bkSec = page.locator('section:has(h2:has-text("Bookkeeping and Accounting Support"))');
  if (await bkSec.count() > 0) {
    await bkSec.screenshot({ path: 'frontend/tax_bk_dark.png' });
    console.log('Saved bk screenshot');
  }

  // Take screenshot of LLC classifier
  const llcSec = page.locator('section:has(h3:has-text("How is your LLC taxed?"))');
  if (await llcSec.count() > 0) {
    await llcSec.screenshot({ path: 'frontend/tax_llc_dark.png' });
    console.log('Saved llc screenshot');
  }

  await browser.close();
})();
