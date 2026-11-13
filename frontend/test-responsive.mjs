import { chromium } from 'playwright';

const BREAKPOINTS = [
  { name: '320px-small-mobile', width: 320, height: 600 },
  { name: '360px-android', width: 360, height: 740 },
  { name: '375px-iphone', width: 375, height: 667 },
  { name: '390px-iphone', width: 390, height: 844 },
  { name: '414px-mobile', width: 414, height: 896 },
  { name: '430px-large-mobile', width: 430, height: 932 },
  { name: '576px-small-tablet', width: 576, height: 900 },
  { name: '768px-tablet', width: 768, height: 1024 },
  { name: '820px-tablet', width: 820, height: 1180 },
  { name: '1024px-laptop', width: 1024, height: 768 },
  { name: '1280px-desktop', width: 1280, height: 800 },
  { name: '1440px-desktop', width: 1440, height: 900 },
  { name: '1920px-large', width: 1920, height: 1080 },
];

const ROUTES = [
  '/',
  '/about',
  '/services',
  '/cpa-outsourcing',
  '/hire-professionals',
  '/blog',
  '/contact',
  '/book-consultation',
  '/tax-calculator',
  '/tax-planning',
  '/tax-preparation',
  '/bookkeeping',
  '/tax-resources'
];

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const issues = [];

  for (const bp of [
    { name: '320px', width: 320, height: 600 },
    { name: '375px', width: 375, height: 667 },
    { name: '768px', width: 768, height: 1024 },
    { name: '1280px', width: 1280, height: 800 }
  ]) {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    for (const route of ROUTES) {
      try {
        await page.goto(`http://localhost:3000${route}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(600);

        const check = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollW = Math.max(docEl.scrollWidth, body.scrollWidth);
          const clientW = docEl.clientWidth;
          const hasHScroll = scrollW > clientW + 2;

          // Find overflowing elements
          const overflowing = [];
          if (hasHScroll) {
            const all = document.querySelectorAll('*');
            for (const el of all) {
              const r = el.getBoundingClientRect();
              if (r.right > clientW + 2 && r.width > 0 && r.height > 0) {
                const tag = el.tagName.toLowerCase();
                const cls = (el.className && typeof el.className === 'string') ? el.className.slice(0, 50) : '';
                const id = el.id ? `#${el.id}` : '';
                overflowing.push(`${tag}${id}.${cls} (right: ${Math.round(r.right)}px, w: ${Math.round(r.width)}px)`);
                if (overflowing.length >= 5) break;
              }
            }
          }
          return { scrollW, clientW, hasHScroll, overflowing };
        });

        if (check.hasHScroll) {
          issues.push({
            breakpoint: bp.name,
            route,
            scrollW: check.scrollW,
            clientW: check.clientW,
            overflowing: check.overflowing
          });
        }
      } catch (e) {
        issues.push({ breakpoint: bp.name, route, error: e.message });
      }
    }
  }

  console.log(JSON.stringify(issues, null, 2));
  await browser.close();
}

run();

