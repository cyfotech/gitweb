const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; background: #F1F4F2; font-family: Inter, sans-serif; padding: 40px; }
        .h { font-family: Manrope, sans-serif; letter-spacing: -0.025em; }
        .mono { font-family: 'IBM Plex Mono', monospace; }
        .fit-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
        }
        .fit-card {
          border-radius: 28px;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 380px;
          transition: transform .3s ease, box-shadow .3s ease;
        }
        .fit-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(11,26,30,.08);
        }
        .fit-card-0 { background: #0B1A1E; color: #FFFFFF; }
        .fit-card-1 { background: #FFFFFF; color: #0B1A1E; box-shadow: inset 0 0 0 1px #DCE3E1; }
        .fit-card-2 { background: #E3E9E6; color: #0B1A1E; }
        .fit-card-3 { background: #FFFFFF; color: #0B1A1E; box-shadow: inset 0 0 0 1px #DCE3E1; }
        .fit-card-4 { background: #E3E9E6; color: #0B1A1E; }
        .lnk {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="fit-grid">
        <div class="fit-card fit-card-0">
          <div>
            <div style="display:flex; gap:12px; align-items:center; margin-bottom:16px;">
              <span class="mono" style="font-size:13px; opacity:0.7;">01</span>
              <span class="h" style="font-size:20px; font-weight:800; line-height:1.2;">Small &amp; growing businesses</span>
            </div>
            <p style="font-size:15px; line-height:1.6; margin:0; opacity:0.85;">Regular payroll calculations, deductions, payroll reports and accounting records, without building an in-house payroll function.</p>
          </div>
          <a href="#consult" class="lnk" style="color:#37E191;">Start with a payroll review &rarr;</a>
        </div>
        <div class="fit-card fit-card-1">
          <div>
            <div style="display:flex; gap:12px; align-items:center; margin-bottom:16px;">
              <span class="mono" style="font-size:13px; opacity:0.7;">02</span>
              <span class="h" style="font-size:20px; font-weight:800; line-height:1.2;">Hourly &amp; salaried teams</span>
            </div>
            <p style="font-size:15px; line-height:1.6; margin:0; color:#4A5A5E;">Attendance, working hours, overtime, salary processing and employee deductions handled each cycle with review before release.</p>
          </div>
          <a href="#processing" class="lnk" style="color:#0E7A49;">See payroll processing &rarr;</a>
        </div>
        <div class="fit-card fit-card-2">
          <div>
            <div style="display:flex; gap:12px; align-items:center; margin-bottom:16px;">
              <span class="mono" style="font-size:13px; opacity:0.7;">03</span>
              <span class="h" style="font-size:20px; font-weight:800; line-height:1.2;">Multi-state employers</span>
            </div>
            <p style="font-size:15px; line-height:1.6; margin:0; color:#4A5A5E;">Work-location records, state withholding, unemployment tax and reporting for employees spread across jurisdictions.</p>
          </div>
          <a href="#multistate" class="lnk" style="color:#0E7A49;">See multi-state payroll &rarr;</a>
        </div>
        <div class="fit-card fit-card-3">
          <div>
            <div style="display:flex; gap:12px; align-items:center; margin-bottom:16px;">
              <span class="mono" style="font-size:13px; opacity:0.7;">04</span>
              <span class="h" style="font-size:20px; font-weight:800; line-height:1.2;">CPA firms</span>
            </div>
            <p style="font-size:15px; line-height:1.6; margin:0; color:#4A5A5E;">Recurring payroll processing, tax reporting preparation, payroll accounting and reconciliation inside your firm’s existing workflow.</p>
          </div>
          <a href="#cpa" class="lnk" style="color:#0E7A49;">See CPA outsourcing &rarr;</a>
        </div>
        <div class="fit-card fit-card-4">
          <div>
            <div style="display:flex; gap:12px; align-items:center; margin-bottom:16px;">
              <span class="mono" style="font-size:13px; opacity:0.7;">05</span>
              <span class="h" style="font-size:20px; font-weight:800; line-height:1.2;">Accounting &amp; bookkeeping practices</span>
            </div>
            <p style="font-size:15px; line-height:1.6; margin:0; color:#4A5A5E;">Payroll accounting entries, liability reconciliation, wage reporting and year-end payroll support for your client base.</p>
          </div>
          <a href="#accounting" class="lnk" style="color:#0E7A49;">See reconciliation &rarr;</a>
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setContent(html);
  await page.screenshot({ path: 'fit_grid_preview_all_text.png' });
  await browser.close();
  console.log('Saved fit_grid_preview_all_text.png');
})();
