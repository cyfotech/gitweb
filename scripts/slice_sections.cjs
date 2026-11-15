const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://localhost:3001/usa-tax-preparation-services', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(500);

  // find all elements on the page and check text contrast / color
  const issues = await page.evaluate(() => {
    const isDarkBackground = (rgb) => {
      const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!match) return false;
      const r = parseInt(match[1]), g = parseInt(match[2]), b = parseInt(match[3]);
      // luminance
      return (0.299 * r + 0.587 * g + 0.114 * b) < 128;
    };

    const getBgColor = (el) => {
      let cur = el;
      while (cur && cur !== document.documentElement) {
        const bg = window.getComputedStyle(cur).backgroundColor;
        if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
          return bg;
        }
        cur = cur.parentElement;
      }
      return 'rgb(7, 18, 31)'; // default page dark bg
    };

    const results = [];
    const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, li, a, div');
    
    // check cards or sections that look like use cases or cards
    return results;
  });

  // Let's capture sections by id or tag
  const sections = await page.$$('section');
  console.log('Total sections:', sections.length);
  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    const id = await sec.getAttribute('id') || `sec_${i}`;
    await sec.screenshot({ path: `frontend/tax_sec_${i}_${id}.png` });
  }

  await browser.close();
})();
