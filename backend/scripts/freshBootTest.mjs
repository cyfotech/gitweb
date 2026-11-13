// Boots the current backend code fresh on an ephemeral port and tests the draft endpoint.
// This isolates whether the code+DB work (fresh) vs. the running :8001 server being stale.
import app from '../src/app.js';
process.env.PORT = '8111';
const server = app.listen(8111, async () => {
  const BASE = 'http://localhost:8111/api/v1';
  const req = async (path, opts = {}) => {
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
      ...opts,
    });
    let body = null;
    try { body = await res.json(); } catch { body = await res.text().catch(() => null); }
    return { status: res.status, body };
  };

  try {
    const login = await req('/auth/login', { method: 'POST', body: JSON.stringify({ email: 'admin@preferredtax.com', password: 'root' }) });
    console.log('login:', login.status);
    if (login.status !== 200) { console.log(JSON.stringify(login.body)); process.exit(1); }
    const token = login.body.token;
    const auth = { Authorization: `Bearer ${token}` };

    const home = await req('/pages/slug/home');
    const hero = home.body.sections.find(s => s.sectionKey === 'hero');
    const draft = await req(`/sections/${hero.id}/draft`, {
      method: 'PUT', headers: auth, body: JSON.stringify({ fields: { title: 'FRESH-SYNC-TEST' } }),
    });
    console.log('draft:', draft.status, JSON.stringify(draft.body));

    // cleanup: restore original title
    const orig = home.body.sections.find(s => s.sectionKey === 'hero').title;
    await req(`/sections/${hero.id}/draft`, { method: 'PUT', headers: auth, body: JSON.stringify({ fields: { title: orig } }) });
    await req(`/sections/${hero.id}/publish`, { method: 'PUT', headers: auth });
    console.log('cleanup done, original restored to:', orig);
  } catch (e) {
    console.log('TEST_ERR', e.message);
  } finally {
    server.close(() => process.exit(0));
  }
});
