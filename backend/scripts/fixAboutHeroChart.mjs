// Repair the About hero section content so the published data is authoritative
// and identical for the public renderer and the admin editor.
//
// The public AboutUs component reads chart config from content["chart_about_performance"].
// The DB content currently has NO such key; instead it carries stray top-level demo
// keys (chartType:"bar", dataPoints:[one point]) that made the editor show the wrong
// bar/pie with a single data point. This script:
//   1. reads the about page's hero section
//   2. sets content.chart_about_performance to the real line chart (Q1-Q4)
//   3. removes the stray top-level chartType / dataPoints demo keys
//   4. saves as draft and publishes
const BASE = process.env.BASE || 'http://localhost:8001/api/v1';

const req = async (p, o = {}) => {
  const { headers, ...rest } = o;
  const r = await fetch(BASE + p, {
    ...rest,
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
  });
  let b = null;
  try { b = await r.json(); } catch { b = await r.text(); }
  return { status: r.status, body: b };
};

(async () => {
  const l = await req('/auth/login', { method: 'POST', body: JSON.stringify({ email: 'admin@preferredtax.com', password: 'root' }) });
  console.log('login', l.status);
  if (l.status !== 200) return;
  const a = { Authorization: 'Bearer ' + (l.body.accessToken || l.body.token) };

  // find about page id
  const pages = await req('/pages', { headers: a });
  const about = (pages.body || []).find(p => p.slug === 'about');
  if (!about) { console.log('about page not found'); return; }

  const detail = await req('/pages/' + about.id, { headers: a });
  const hero = (detail.body?.sections || []).find(s => s.sectionKey === 'hero');
  if (!hero) { console.log('hero section not found'); return; }

  let content = {};
  try { content = JSON.parse(hero.content || '{}'); } catch { console.log('could not parse hero content'); return; }

  // real chart config the public renderer expects
  content.chart_about_performance = {
    displayMode: 'chart',
    title: 'Financial Performance Trend',
    subtitle: 'Quarterly Volume vs Advisory Value vs Turnaround SLA',
    chartType: 'line',
    dataPoints: [
      { label: 'Q1', value: 850 },
      { label: 'Q2', value: 1100 },
      { label: 'Q3', value: 920 },
      { label: 'Q4', value: 1450 },
    ],
    mediaUrl: '',
    altText: 'Financial Performance Trend',
  };

  // remove stray top-level demo keys that confused the editor
  delete content.chartType;
  delete content.dataPoints;
  delete content.chartConfig;

  const fields = [{ fieldKey: 'content', value: JSON.stringify(content) }];

  const d = await req('/sections/' + hero.id + '/draft', { method: 'PUT', headers: a, body: JSON.stringify({ fields }) });
  console.log('draft', d.status, JSON.stringify(d.body).slice(0, 120));

  const p = await req('/sections/' + hero.id + '/publish', { method: 'PUT', headers: a });
  console.log('publish', p.status, JSON.stringify(p.body).slice(0, 120));

  // verify public endpoint now returns the real chart
  const pub = await req('/pages/slug/about');
  const pubHero = (pub.body?.sections || []).find(s => s.sectionKey === 'hero');
  let pubContent = {};
  try { pubContent = JSON.parse(pubHero?.content || '{}'); } catch {}
  console.log('PUBLIC chart_about_performance:', JSON.stringify(pubContent.chart_about_performance));
})();
