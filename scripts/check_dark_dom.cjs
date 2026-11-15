const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://localhost:3001/usa-tax-preparation-services', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(500);

  const info = await page.evaluate(() => {
    // 1. Compliance cards
    const compCards = Array.from(document.querySelectorAll('article.lift')).map(card => ({
      h3: card.querySelector('h3')?.textContent,
      h3Color: card.querySelector('h3') ? window.getComputedStyle(card.querySelector('h3')).color : null,
      pColor: card.querySelector('p') ? window.getComputedStyle(card.querySelector('p')).color : null,
      cardBg: window.getComputedStyle(card).backgroundColor
    }));

    // 2. "Typically involves" section in Section 07 (Who we work with)
    const typHeader = Array.from(document.querySelectorAll('p.mono')).find(p => p.textContent.includes('Typically involves'));
    let typInfo = null;
    if (typHeader && typHeader.parentElement) {
      const container = typHeader.parentElement;
      const firstRow = container.querySelector('div');
      const textSpan = firstRow ? firstRow.querySelector('span:first-child') : null;
      const badgeSpan = firstRow ? firstRow.querySelector('span.mono') : null;
      typInfo = {
        containerBg: window.getComputedStyle(container).backgroundColor,
        firstRowBg: firstRow ? window.getComputedStyle(firstRow).backgroundColor : null,
        textSpanColor: textSpan ? window.getComputedStyle(textSpan).color : null,
        badgeSpanColor: badgeSpan ? window.getComputedStyle(badgeSpan).color : null
      };
    }

    // 3. Section 07 left card tabpanel
    const whoCard = document.querySelector('[role="tabpanel"]');
    let whoInfo = null;
    if (whoCard) {
      const h3 = whoCard.querySelector('h3');
      const p = whoCard.querySelector('p:not(.mono)');
      whoInfo = {
        cardBg: window.getComputedStyle(whoCard.parentElement).backgroundColor,
        h3Color: h3 ? window.getComputedStyle(h3).color : null,
        pColor: p ? window.getComputedStyle(p).color : null
      };
    }

    // 4. Reconciliation checklist
    const reconCard = document.querySelector('[role="img"][aria-label*="reconciliation"]');
    let reconInfo = null;
    if (reconCard) {
      const title = reconCard.querySelector('p');
      const firstRow = reconCard.querySelector('div[aria-hidden="true"] > div');
      const rowName = firstRow ? firstRow.querySelector('p') : null;
      reconInfo = {
        cardBg: window.getComputedStyle(reconCard).backgroundColor,
        titleColor: title ? window.getComputedStyle(title).color : null,
        rowNameColor: rowName ? window.getComputedStyle(rowName).color : null
      };
    }

    return { compCards, typInfo, whoInfo, reconInfo };
  });

  console.log('DOM Info:', JSON.stringify(info, null, 2));

  await browser.close();
})();
