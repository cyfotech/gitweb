const BASE = 'http://localhost:8001/api/v1';
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
  const h = await req('/pages/slug/home');
  const hero = h.body.sections.find(s => s.sectionKey === 'hero');
  console.log('hero', hero.id, '|', hero.title);

  const d = await req('/sections/' + hero.id + '/draft', {
    method: 'PUT', headers: a, body: JSON.stringify({ fields: [{ fieldKey: 'title', value: 'LIVE-CHECK-' + Date.now() }] }),
  });
  console.log('draft', d.status, JSON.stringify(d.body));

  if (d.status === 200) {
    const p = await req('/sections/' + hero.id + '/publish', { method: 'PUT', headers: a });
    console.log('publish', p.status, JSON.stringify(p.body).slice(0, 120));
    const h2 = await req('/pages/slug/home');
    console.log('publicTitle', h2.body.sections.find(s => s.sectionKey === 'hero').title);
    // restore
    await req('/sections/' + hero.id + '/draft', { method: 'PUT', headers: a, body: JSON.stringify({ fields: [{ fieldKey: 'title', value: hero.title }] }) });
    await req('/sections/' + hero.id + '/publish', { method: 'PUT', headers: a });
    console.log('restored');
  }
})();
