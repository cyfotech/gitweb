// Authenticated end-to-end smoke test for the Admin visual editor backend.
// Exercises: login -> fetch section -> save draft (invisible publicly) ->
// publish (visible publicly) -> restore original.
// Run: node backend/scripts/editorSmoke.mjs
const BASE = process.env.BASE || 'http://localhost:8001/api/v1';

async function req(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
  });
  const text = await res.text();
  let body = null;
  try { body = JSON.parse(text); } catch { body = text; }
  return { status: res.status, body };
}

let token = '';
function auth() { return { Authorization: `Bearer ${token}` }; }

(async () => {
  const results = [];
  const record = (name, ok, detail = '') => {
    results.push({ name, ok: ok ? 'PASS' : 'FAIL', detail });
    console.log(`${ok ? 'PASS' : 'FAIL'} | ${name} ${detail ? '| ' + detail : ''}`);
  };

  // 1. Login
  const login = await req('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@preferredtax.com', password: 'root' }),
  });
  token = login.body?.accessToken || login.body?.access_token || '';
  record('login', login.status === 200 && !!token, `status=${login.status}`);

  if (!token) { console.log('\nABORT: no token'); process.exit(1); }

  // 2. Fetch home page + first section
  const page = await req('/pages/slug/home', { headers: auth() });
  const sections = page.body?.sections || page.body?.data?.sections || [];
  const sec = sections.find(s => s.sectionKey) || sections[0];
  record('fetch home page', page.status === 200 && !!sec, `sections=${sections.length}, first=${sec?.sectionKey}`);
  const ORIG_TITLE = sec?.title || '';

  // 3. Save a draft title
  const draftTitle = `DRAFT_PROBE_${Date.now()}`;
  const draft = await req(`/sections/${sec.id}/draft`, {
    method: 'PUT',
    headers: auth(),
    body: JSON.stringify({ fields: [{ fieldKey: 'title', fieldType: 'string', value: draftTitle }] }),
  });
  record('save draft', draft.status === 200 || draft.status === 201, `status=${draft.status}`);
  if (draft.status >= 400) console.log('   draft body:', JSON.stringify(draft.body).slice(0, 500));

  // 4. Public slug must NOT show the draft
  const pubAfterDraft = await req('/pages/slug/home', { headers: auth() });
  const secAfterDraft = (pubAfterDraft.body?.sections || []).find(s => s.id === sec.id);
  record('draft invisible on public slug', secAfterDraft?.title !== draftTitle, `public title remains original=${secAfterDraft?.title === ORIG_TITLE}`);

  // 5. Publish
  const pub = await req(`/sections/${sec.id}/publish`, {
    method: 'PUT',
    headers: auth(),
    body: JSON.stringify({ fields: [{ fieldKey: 'title', fieldType: 'string', value: draftTitle }] }),
  });
  record('publish draft', pub.status === 200 || pub.status === 201, `status=${pub.status}`);

  // 6. Public slug MUST now show the published title
  const pubAfterPublish = await req('/pages/slug/home', { headers: auth() });
  const secAfterPublish = (pubAfterPublish.body?.sections || []).find(s => s.id === sec.id);
  const visible = secAfterPublish?.title === draftTitle;
  record('published change visible on public slug', visible, `public title -> ${secAfterPublish?.title}`);

  // 7. Restore original title (cleanup)
  const restore = await req(`/sections/${sec.id}/publish`, {
    method: 'PUT',
    headers: auth(),
    body: JSON.stringify({ fields: [{ fieldKey: 'title', fieldType: 'string', value: ORIG_TITLE }] }),
  });
  record('cleanup: restore original title', restore.status === 200 || restore.status === 201, `status=${restore.status}`);

  const passed = results.filter(r => r.ok === 'PASS').length;
  console.log(`\n=== ${passed}/${results.length} passed ===`);
  process.exit(results.every(r => r.ok === 'PASS') ? 0 : 2);
})();
