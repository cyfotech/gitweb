const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const widths = [320, 375, 414, 768, 1024];

  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto('http://localhost:3001/services/payroll-management', { waitUntil: 'networkidle' });

    const overlaps = await page.evaluate((width) => {
      const results = [];
      const sections = Array.from(document.querySelectorAll('section'));

      sections.forEach((sec, idx) => {
        const secId = sec.id || ('sec_' + idx);
        const headings = Array.from(sec.querySelectorAll('h1, h2, h3, p, button, a.btn, a.dbtn, .card-h, .card, .rv'));

        // Check pairwise overlaps inside section
        for (let i = 0; i < headings.length; i++) {
          const r1 = headings[i].getBoundingClientRect();
          if (r1.width === 0 || r1.height === 0) continue;
          if (window.getComputedStyle(headings[i]).position === 'absolute') {
            // Check if absolute element collides with heading or button
            for (let j = 0; j < headings.length; j++) {
              if (i === j) continue;
              if (headings[i].contains(headings[j]) || headings[j].contains(headings[i])) continue;
              const r2 = headings[j].getBoundingClientRect();
              const intersects = !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
              if (intersects && (headings[j].tagName.startsWith('H') || headings[j].tagName === 'P')) {
                results.push({
                  sec: secId,
                  el1: headings[i].tagName + '.' + headings[i].className,
                  el2: headings[j].tagName + '.' + headings[j].className,
                  text2: headings[j].innerText.slice(0, 30)
                });
              }
            }
          }
        }

        // Check elements exceeding viewport width
        sec.querySelectorAll('*').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.right > width + 2 && !el.classList.contains('marquee') && !el.classList.contains('stations-grid') && !el.closest('.stations-grid')) {
            let parent = el.parentElement;
            let clipped = false;
            while (parent && parent !== document.body) {
              const ps = window.getComputedStyle(parent);
              if (ps.overflowX === 'hidden' || ps.overflowX === 'auto' || ps.overflow === 'hidden' || ps.overflow === 'auto') {
                clipped = true;
                break;
              }
              parent = parent.parentElement;
            }
            if (!clipped) {
              results.push({
                sec: secId,
                type: 'overflow',
                tag: el.tagName,
                class: el.className,
                right: Math.round(r.right),
                width: width
              });
            }
          }
        });
      });

      return { width, issues: results };
    }, w);

    console.log(JSON.stringify(overlaps));
    await page.close();
  }

  await browser.close();
})();
