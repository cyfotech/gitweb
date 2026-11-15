const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://localhost:3001/hire-professionals', { waitUntil: 'networkidle' });
  
  // evaluate current theme
  const hasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  console.log('Initially dark?', hasDark);

  const whySec = await page.$('#why');
  if (whySec) {
    await whySec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await whySec.screenshot({ path: 'frontend/test_hire_current.png' });
    console.log('Saved current screenshot');
  }

  // test light mode
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  await page.waitForTimeout(500);
  if (whySec) {
    await whySec.screenshot({ path: 'frontend/test_hire_light.png' });
    console.log('Saved light screenshot');
  }

  // test dark mode
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(500);
  if (whySec) {
    await whySec.screenshot({ path: 'frontend/test_hire_dark.png' });
    console.log('Saved dark screenshot');
  }

  await browser.close();
})();
