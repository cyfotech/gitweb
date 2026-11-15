const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://localhost:3001/usa-tax-preparation-services', { waitUntil: 'networkidle' });

  // 1. Light theme
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  await page.waitForTimeout(500);

  const sections = await page.$$('section');
  for (let i = 0; i < sections.length; i++) {
    const id = (await sections[i].getAttribute('id')) || ('sec_' + i);
    await sections[i].screenshot({ path: 'frontend/audit_light_' + i + '_' + id + '.png' });
  }

  // 2. Dark theme
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(500);
  for (let i = 0; i < sections.length; i++) {
    const id = (await sections[i].getAttribute('id')) || ('sec_' + i);
    await sections[i].screenshot({ path: 'frontend/audit_dark_' + i + '_' + id + '.png' });
  }

  console.log('Done capturing all sections');
  await browser.close();
})();
