const BASE = process.env.BASE || 'http://localhost:8001/api/v1';
const req = async (p, o = {}) => {
  const { headers, ...rest } = o;
  const r = await fetch(BASE + p, { ...rest, headers: { 'Content-Type': 'application/json', ...(headers || {}) } });
  let b = null;
  try { b = await r.json(); } catch { b = await r.text(); }
  return { status: r.status, body: b };
};
(async () => {
  const l = await req('/auth/login', { method: 'POST', body: JSON.stringify({ email: 'admin@preferredtax.com', password: 'root' }) });
  const a = { Authorization: 'Bearer ' + (l.body.accessToken || l.body.token) };
  const pages = await req('/pages', { headers: a });
  const about = (pages.body || []).find(p => p.slug === 'about');
  const detail = await req('/pages/' + about.id, { headers: a });
  const hero = (detail.body?.sections || []).find(s => s.sectionKey === 'hero');
  console.log('EDITOR hero id:', hero?.id);
  console.log('EDITOR hero.title:', hero?.title);
  console.log('EDITOR hero.draftData:', hero?.draftData ? hero.draftData.slice(0, 400) : '(null)');
  console.log('EDITOR hero.content keys:', (() => { try { return Object.keys(JSON.parse(hero?.content || '{}')); } catch { return 'unparseable'; } })());
  const buf = await req('/pages/slug/about');
  const pubHero = (buf.body?.sections || []).find(s => s.sectionKey === 'hero');
  console.log('PUBLIC hero.title:', pubHero?.title);
  try {
    const c = JSON.parse(pubHero?.content || '{}');
    console.log('PUBLIC content.chart_about_performance:', JSON.stringify(c.chart_about_performance));
    console.log('PUBLIC content keys:', Object.keys(c));
  } catch (e) { console.log('PUBLIC content unparseable:', e.message); }
})();
