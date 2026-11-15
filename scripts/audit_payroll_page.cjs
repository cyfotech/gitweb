const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const widths = [320, 360, 375, 390, 414, 430, 600, 768, 1024, 1440];

  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto('http://localhost:3001/services/payroll-management', { waitUntil: 'networkidle' });

    const report = await page.evaluate((width) => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const overflowing = [];

      document.querySelectorAll('*').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.right > winW + 1.5) {
          let parent = el.parentElement;
          let clipped = false;
          while (parent && parent !== document.body) {
            const ps = window.getComputedStyle(parent);
            if (ps.overflowX === 'hidden' || ps.overflowX === 'clip' || ps.overflowX === 'auto' || ps.overflowX === 'scroll' ||
                ps.overflow === 'hidden' || ps.overflow === 'clip' || ps.overflow === 'auto' || ps.overflow === 'scroll') {
              clipped = true;
              break;
            }
            parent = parent.parentElement;
          }
          if (!clipped) {
            overflowing.push({
              tag: el.tagName,
              id: el.id,
              class: el.className,
              rectRight: Math.round(r.right),
              excess: Math.round(r.right - winW),
              text: (el.innerText || '').slice(0, 35).replace(/\n/g, ' ')
            });
          }
        }
      });

      return {
        width,
        docW,
        winW,
        hasScroll: docW > winW,
        overflowCount: overflowing.length,
        items: overflowing.slice(0, 6)
      };
    }, w);

    console.log(JSON.stringify(report));
    await page.close();
  }

  await browser.close();
})();
