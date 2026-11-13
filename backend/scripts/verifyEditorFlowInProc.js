/**
 * Boots the CURRENT (new) backend in-process on an ephemeral port and verifies
 * the draft/publish lifecycle, bypassing the stale localhost:8001 instance
 * that was started before the sections.ts rewrite.
 */
process.env.PORT = '8011';
// load .env (dotenv won't override PORT since we already set it)
require('ts-node/register');
require('../src/index'); // module load calls app.listen(PORT)

const BASE = `http://localhost:8011/api/v1`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForServer(retries = 40) {
  for (let i = 0; i < retries; i++) {
    try {
      const r = await fetch(`${BASE}/health`);
      if (r.status === 200) return true;
    } catch {}
    await sleep(250);
  }
  return false;
}

async function main() {
  if (!(await waitForServer())) {
    console.error('FAIL server did not become ready');
    process.exit(1);
  }
  console.log('PASS in-process backend ready on 8011');

  const setupRes = await fetch(`${BASE}/auth/setup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-setup-secret': 'preferred_tax_admin_setup_2024' },
    body: JSON.stringify({ email: 'editor_verify@nova.test', password: 'verifyPass123!', firstName: 'Verify', lastName: 'Tester' }),
  });
  if (![200, 201].includes(setupRes.status)) { console.error('FAIL setup', setupRes.status); process.exit(1); }
  console.log('PASS setup admin');

  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'editor_verify@nova.test', password: 'verifyPass123!' }),
  });
  const login = await loginRes.json();
  if (!login.accessToken) { console.error('FAIL login', login); process.exit(1); }
  const auth = { Authorization: `Bearer ${login.accessToken}` };
  console.log('PASS login');

  const pages = await (await fetch(`${BASE}/pages`)).json();
  const home = pages.find((p) => p.slug === 'home');
  const page = await (await fetch(`${BASE}/pages/${home.id}`)).json();
  const section = page.sections[0];
  const originalTitle = section.title;
  console.log('PASS home section fetched', section.sectionKey);

  // Draft
  const draftRes = await fetch(`${BASE}/sections/${section.id}/draft`, {
    method: 'PUT',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: [{ fieldKey: 'title', fieldType: 'text', value: `${originalTitle} [DRAFT-SUFFIX]` }], note: 'verify' }),
  });
  if (draftRes.status !== 200) { console.error('FAIL draft', draftRes.status, await draftRes.text()); process.exit(1); }
  console.log('PASS draft saved');

  const pubBefore = await (await fetch(`${BASE}/pages/slug/home`)).json();
  const beforeSect = pubBefore.sections.find((s) => s.id === section.id);
  if (beforeSect?.title?.includes('[DRAFT-SUFFIX]')) { console.error('FAIL draft leaked to public'); process.exit(1); }
  console.log('PASS draft NOT visible publicly');

  const pubRes = await fetch(`${BASE}/sections/${section.id}/publish`, {
    method: 'PUT',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ note: 'verify publish' }),
  });
  if (pubRes.status !== 200) { console.error('FAIL publish', pubRes.status, await pubRes.text()); process.exit(1); }
  console.log('PASS publish');

  const pubAfter = await (await fetch(`${BASE}/pages/slug/home`)).json();
  const afterSect = pubAfter.sections.find((s) => s.id === section.id);
  if (!afterSect?.title?.includes('[DRAFT-SUFFIX]')) { console.error('FAIL published change not public', afterSect?.title); process.exit(1); }
  console.log('PASS published change visible publicly');

  // Restore original
  await fetch(`${BASE}/sections/${section.id}/publish`, {
    method: 'PUT',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: [{ fieldKey: 'title', fieldType: 'text', value: originalTitle }] }),
  });
  const finalCheck = await (await fetch(`${BASE}/pages/slug/home`)).json();
  const finalSect = finalCheck.sections.find((s) => s.id === section.id);
  if (finalSect?.title !== originalTitle) { console.error('FAIL restore', finalSect?.title); process.exit(1); }
  console.log('PASS restored original title');

  console.log('\nALL CHECKS PASSED');
  process.exit(0);
}

main().catch((e) => { console.error('ERROR', e.message); process.exit(1); });
