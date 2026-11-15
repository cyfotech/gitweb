const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://localhost:3001/usa-tax-preparation-services', { waitUntil: 'networkidle' });

  // Light theme
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  await page.waitForTimeout(500);

  const planner = page.locator('#outsourcing div[role="img"]');
  if (await planner.count() > 0) {
    const info = await planner.evaluate(el => {
      const heading = el.querySelector('p:nth-child(2), h3, p');
      return {
        bg: window.getComputedStyle(el).backgroundColor,
        color: window.getComputedStyle(el).color,
        headingColor: heading ? window.getComputedStyle(heading).color : null
      };
    });
    console.log('Light planner info:', info);
  }

  // Dark theme
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(500);
  if (await planner.count() > 0) {
    const info = await planner.evaluate(el => {
      return {
        bg: window.getComputedStyle(el).backgroundColor,
        color: window.getComputedStyle(el).color
      };
    });
    console.log('Dark planner info:', info);
  }

  await browser.close();
})();
