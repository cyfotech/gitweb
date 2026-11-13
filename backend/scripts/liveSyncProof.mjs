// Live proof: admin draft -> publish -> public site reflects the change.
// Uses a reversible edit on the home hero title and restores it at the end.
const BASE = 'http://localhost:8001/api/v1';

async function req(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  let body = null;
  try { body = await res.json(); } catch { /* no body */ }
  return { status: res.status, body };
}

const results = [];
const claim = (name, pass, note = '') => results.push({ name, pass: !!pass, note });

// 1. login
const login = await req('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email: 'admin@preferredtax.com', password: 'root' }),
});
claim('admin login', login.status === 200, `${login.status}`);
const token = login.body?.token || login.body?.accessToken;
if (!token) { console.log('FATAL: no token'); console.log(JSON.stringify(results, null, 2)); process.exit(1); }
const auth = { Authorization: `Bearer ${token}` };

// 2. find home hero section
const home = await req('/pages/slug/home');
claim('public home fetched', home.status === 200, `${home.status}`);
const hero = home.body?.sections?.find(s => s.sectionKey === 'hero');
if (!hero) { console.log('FATAL: no hero section'); process.exit(1); }
const originalTitle = hero.title;

// 3. save a draft with a marked title
const draftTitle = originalTitle + ' [SYNC-PROOF]';
const draft = await req(`/sections/${hero.id}/draft`, {
  method: 'PUT',
  headers: auth,
  body: JSON.stringify({ fields: { title: draftTitle } }),
});
claim('save draft', draft.status === 200, `${draft.status}`);

// 4. confirm public endpoint does NOT show the draft
const pubAfterDraft = await req('/pages/slug/home');
const pubTitleAfterDraft = pubAfterDraft.body?.sections?.find(s => s.sectionKey === 'hero')?.title;
claim('draft invisible publicly', pubTitleAfterDraft === originalTitle, `public="${pubTitleAfterDraft}"`);

// 5. publish
const pub = await req(`/sections/${hero.id}/publish`, { method: 'PUT', headers: auth });
claim('publish', pub.status === 200, `${pub.status}`);

// 6. confirm public endpoint NOW shows the new title
const pubAfterPub = await req('/pages/slug/home');
const pubTitleAfterPub = pubAfterPub.body?.sections?.find(s => s.sectionKey === 'hero')?.title;
claim('published change visible publicly', pubTitleAfterPub === draftTitle, `public="${pubTitleAfterPub}"`);

// 7. restore original title (publish revert)
const restore = await req(`/sections/${hero.id}/draft`, {
  method: 'PUT',
  headers: auth,
  body: JSON.stringify({ fields: { title: originalTitle } }),
});
await req(`/sections/${hero.id}/publish`, { method: 'PUT', headers: auth });
const confirmRestore = await req('/pages/slug/home');
const restoredTitle = confirmRestore.body?.sections?.find(s => s.sectionKey === 'hero')?.title;
claim('restored original title', restoredTitle === originalTitle, `public="${restoredTitle}"`);

console.log('\n=== LIVE SYNC PROOF (admin -> public site) ===');
for (const r of results) console.log(`${r.pass ? 'PASS' : 'FAIL'} | ${r.name}${r.note ? ` | ${r.note}` : ''}`);
const passed = results.filter(r => r.pass).length;
console.log(`\n=== ${passed}/${results.length} passed ===`);
if (passed !== results.length) process.exit(1);
