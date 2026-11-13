const BASE = 'http://localhost:8001/api/v1';
const email = process.argv[2] || 'admin@preferredtax.com';
const password = process.argv[3] || 'root';

async function req(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  let body = null;
  try { body = await res.json(); } catch { body = await res.text().catch(() => null); }
  return { status: res.status, body };
}

const login = await req('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
console.log('login status:', login.status);
if (login.status !== 200) { console.log(JSON.stringify(login.body)); process.exit(1); }
const token = login.body?.token || login.body?.accessToken;
const auth = { Authorization: `Bearer ${token}` };

const home = await req('/pages/slug/home');
const hero = home.body?.sections?.find(s => s.sectionKey === 'hero');
console.log('hero id:', hero?.id, 'title:', hero?.title);

const draft = await req(`/sections/${hero.id}/draft`, {
  method: 'PUT',
  headers: auth,
  body: JSON.stringify({ fields: { title: 'SYNC-PROOF-TEST' } }),
});
console.log('draft status:', draft.status);
console.log('draft body:', JSON.stringify(draft.body, null, 2));
