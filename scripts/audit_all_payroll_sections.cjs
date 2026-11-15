const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 800 } });
  await page.goto('http://localhost:3001/services/payroll-management', { waitUntil: 'networkidle' });

  const issues = await page.evaluate(() => {
    const findings = [];
    const winW = window.innerWidth;

    // Check all inputs, sliders, tables, cards
    document.querySelectorAll('section').forEach(sec => {
      const secId = sec.id || 'sec';
      const secR = sec.getBoundingClientRect();

      // Check cards and inner elements exceeding width
      sec.querySelectorAll('div, ul, table, form').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width > winW && !el.classList.contains('marquee') && !el.classList.contains('stations-grid') && !el.closest('.stations-grid')) {
          let cur = el;
          let scrollable = false;
          while (cur && cur !== document.body) {
            const s = window.getComputedStyle(cur);
            if (s.overflowX === 'auto' || s.overflowX === 'scroll' || s.overflowX === 'hidden') {
              scrollable = true;
              break;
            }
            cur = cur.parentElement;
          }
          if (!scrollable) {
            findings.push({
              sec: secId,
              tag: el.tagName,
              class: el.className,
              width: Math.round(r.width),
              winW
            });
          }
        }
      });
    });

    return findings;
  });

  console.log('UNSCROLLABLE OVERFLOW ISSUES:', JSON.stringify(issues));
  await browser.close();
})();
