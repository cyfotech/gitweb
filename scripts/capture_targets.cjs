const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://localhost:3001/usa-tax-preparation-services', { waitUntil: 'networkidle' });

  // Light
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  await page.waitForTimeout(400);
  const sec1 = await page.$('section#services');
  if (sec1) await sec1.screenshot({ path: 'frontend/final_light_sec1.png' });
  const planner = await page.$('#planner');
  if (planner) await planner.screenshot({ path: 'frontend/final_light_planner.png' });

  // Dark
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(400);
  if (sec1) await sec1.screenshot({ path: 'frontend/final_dark_sec1.png' });
  if (planner) await planner.screenshot({ path: 'frontend/final_dark_planner.png' });
  const faq = await page.$('#faq');
  if (faq) await faq.screenshot({ path: 'frontend/final_dark_faq.png' });

  console.log('Targeted screenshots captured');
  await browser.close();
})();
