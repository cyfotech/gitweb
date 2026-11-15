const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const widths = [320, 360, 390, 600, 768, 1024, 1440];

  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto('http://localhost:3001/hire-professionals', { waitUntil: 'networkidle' });

    const issues = await page.evaluate((width) => {
      const results = [];
      const sections = document.querySelectorAll('.pg section');

      sections.forEach((sec, idx) => {
        const secId = sec.id || ('sec_' + idx);
        const secRect = sec.getBoundingClientRect();
        
        // Find children with problematic layout
        const all = sec.querySelectorAll('*');
        all.forEach(el => {
          const r = el.getBoundingClientRect();
          // Text wrapping / overflowing
          if (r.width > width + 2 && !el.classList.contains('track') && !el.classList.contains('mq')) {
            results.push({
              sec: secId,
              tag: el.tagName,
              class: el.className,
              issue: 'element wider than viewport',
              w: Math.round(r.width),
              viewport: width
            });
          }
        });

        // Check grid/flex wrapping
        const grids = sec.querySelectorAll('div[style*="grid-template-columns"], div[style*="display: grid"], div[style*="display: flex"]');
        grids.forEach(g => {
          const gStyle = window.getComputedStyle(g);
          const r = g.getBoundingClientRect();
          if (r.width > width) {
            results.push({
              sec: secId,
              tag: g.tagName,
              class: g.className,
              issue: 'grid/flex exceeds width',
              w: Math.round(r.width)
            });
          }
        });
      });

      return { width, issueCount: results.length, issues: results.slice(0, 8) };
    }, w);

    console.log(JSON.stringify(issues));
    await page.close();
  }

  await browser.close();
})();
