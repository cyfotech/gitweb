const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 800 } });
  await page.goto('http://localhost:3001/services/payroll-management', { waitUntil: 'networkidle' });

  const data = await page.evaluate(() => {
    const sec = document.querySelector('#filing');
    const rv = sec.querySelectorAll('.rv')[1];
    const monthsGrid = rv.children[0];
    return {
      containerW: monthsGrid.getBoundingClientRect().width,
      cols: window.getComputedStyle(monthsGrid).gridTemplateColumns,
      cells: Array.from(monthsGrid.children).map(c => ({
        text: c.innerText.replace(/\n/g, ' '),
        w: Math.round(c.getBoundingClientRect().width),
        h: Math.round(c.getBoundingClientRect().height),
        fontSize: window.getComputedStyle(c.children[0] || c).fontSize
      }))
    };
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
