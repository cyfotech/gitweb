const BASE = process.env.BASE || 'http://localhost:8115/api/v1';
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
  if (l.status !== 200) { console.log(JSON.stringify(l.body)); return; }
  const t = l.body.accessToken || l.body.token;
  const a = { Authorization: 'Bearer ' + t };

  const h = await req('/pages/slug/home');
  const hero = h.body.sections.find(s => s.sectionKey === 'hero');
  console.log('hero', hero.id, 'title', hero.title);

  const d = await req('/sections/' + hero.id + '/draft', {
    method: 'PUT', headers: a, body: JSON.stringify({ fields: [{ fieldKey: 'title', value: 'FRESH-SYNC-TEST' }] }),
  });
  console.log('draft', d.status, JSON.stringify(d.body));

  const p = await req('/sections/' + hero.id + '/publish', { method: 'PUT', headers: a });
  console.log('publish', p.status, JSON.stringify(p.body).slice(0, 200));

  const h2 = await req('/pages/slug/home');
  console.log('publicTitleAfterPublish', h2.body.sections.find(s => s.sectionKey === 'hero').title);

  // cleanup
  await req('/sections/' + hero.id + '/draft', { method: 'PUT', headers: a, body: JSON.stringify({ fields: [{ fieldKey: 'title', value: h.body.sections.find(s => s.sectionKey === 'hero').title }] }) });
  await req('/sections/' + hero.id + '/publish', { method: 'PUT', headers: a });
  const h3 = await req('/pages/slug/home');
  console.log('restoredTitle', h3.body.sections.find(s => s.sectionKey === 'hero').title);
})();
