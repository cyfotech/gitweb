import * as dotenv from 'dotenv';
dotenv.config();
process.env.PORT = '8112';

// Import the real app (it listens on PORT at import time)
import app from '../src/index';

const BASE = 'http://localhost:8112/api/v1';
const req = async (path: string, opts: any = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  let body: any = null;
  try { body = await res.json(); } catch { body = await res.text().catch(() => null); }
  return { status: res.status, body };
};

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

(async () => {
  // wait for server to accept connections
  for (let i = 0; i < 20; i++) {
    try {
      const h = await fetch('http://localhost:8112/api/v1/health');
      if (h.ok) break;
    } catch { }
    await sleep(500);
  }
  await sleep(300);
  try {
    const login = await req('/auth/login', { method: 'POST', body: JSON.stringify({ email: 'admin@preferredtax.com', password: 'root' }) });
    console.log('login:', login.status);
    if (login.status !== 200) { console.log(JSON.stringify(login.body)); process.exit(1); }
    const token = login.body.token;
    const auth = { Authorization: `Bearer ${token}` };

    const home = await req('/pages/slug/home');
    const hero = home.body.sections.find((s: any) => s.sectionKey === 'hero');
    const orig = hero.title;

    const draft = await req(`/sections/${hero.id}/draft`, {
      method: 'PUT', headers: auth, body: JSON.stringify({ fields: { title: 'FRESH-SYNC-TEST' } }),
    });
    console.log('draft:', draft.status, JSON.stringify(draft.body).slice(0, 400));

    // cleanup
    await req(`/sections/${hero.id}/draft`, { method: 'PUT', headers: auth, body: JSON.stringify({ fields: { title: orig } }) });
    await req(`/sections/${hero.id}/publish`, { method: 'PUT', headers: auth });
    console.log('cleanup done, restored:', orig);
  } catch (e: any) {
    console.log('TEST_ERR', e.message || e);
  } finally {
    process.exit(0);
  }
})();
