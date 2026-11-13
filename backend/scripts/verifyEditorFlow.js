/**
 * Verifies the Phase 1-2 draft/publish lifecycle against the real backend.
 * Flow: setup admin -> login -> pick a real section -> save draft (public unchanged)
 *       -> publish (public updates) -> restore original title.
 */
const BASE = 'http://localhost:8001/api/v1';

async function main() {
  // 1. Ensure an admin exists via setup (idempotent)
  const setupRes = await fetch(`${BASE}/auth/setup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-setup-secret': 'preferred_tax_admin_setup_2024' },
    body: JSON.stringify({
      email: 'editor_verify@nova.test',
      password: 'verifyPass123!',
      firstName: 'Verify',
      lastName: 'Tester',
    }),
  });
  if (setupRes.status !== 201 && setupRes.status !== 200) {
    console.error('SETUP FAILED', setupRes.status, await setupRes.text());
    process.exit(1);
  }
  console.log('PASS setup admin');

  // 2. Login
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'editor_verify@nova.test', password: 'verifyPass123!' }),
  });
  const login = await loginRes.json();
  if (!login.accessToken) { console.error('LOGIN FAILED', login); process.exit(1); }
  const auth = { Authorization: `Bearer ${login.accessToken}` };
  console.log('PASS login');

  // 3. List pages, find home
  const pages = await (await fetch(`${BASE}/pages`)).json();
  const home = pages.find((p) => p.slug === 'home');
  if (!home) { console.error('NO HOME PAGE', pages); process.exit(1); }
  const pageRes = await (await fetch(`${BASE}/pages/${home.id}`)).json();
  const section = pageRes.sections[0];
  if (!section) { console.error('NO SECTIONS on home'); process.exit(1); }
  const originalTitle = section.title;
  console.log('PASS fetched home page + section', section.sectionKey);

  // 4. Save a draft (change title)
  const draftFields = [
    { fieldKey: 'title', fieldType: 'text', value: `${originalTitle} [DRAFT-SUFFIX]` },
  ];
  const draftRes = await fetch(`${BASE}/sections/${section.id}/draft`, {
    method: 'PUT',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: draftFields, note: 'verify draft' }),
  });
  if (draftRes.status !== 200) { console.error('DRAFT FAILED', draftRes.status, await draftRes.text()); process.exit(1); }
  console.log('PASS saved draft');

  // 5. Public slug must NOT show the draft
  const publicBefore = await (await fetch(`${BASE}/pages/slug/home`)).json();
  const beforeSect = publicBefore.sections.find((s) => s.id === section.id);
  const leakedDraft = beforeSect?.title?.includes('[DRAFT-SUFFIX]');
  if (leakedDraft) { console.error('FAIL draft leaked to public', beforeSect.title); process.exit(1); }
  console.log('PASS draft NOT visible publicly');

  // 6. Publish
  const pubRes = await fetch(`${BASE}/sections/${section.id}/publish`, {
    method: 'PUT',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ note: 'verify publish' }),
  });
  if (pubRes.status !== 200) { console.error('PUBLISH FAILED', pubRes.status, await pubRes.text()); process.exit(1); }
  console.log('PASS publish');

  // 7. Public slug must now show the change
  const publicAfter = await (await fetch(`${BASE}/pages/slug/home`)).json();
  const afterSect = publicAfter.sections.find((s) => s.id === section.id);
  if (!afterSect?.title?.includes('[DRAFT-SUFFIX]')) {
    console.error('FAIL published change not public', afterSect?.title); process.exit(1);
  }
  console.log('PASS published change visible publicly');

  // 8. Restore original title via publish
  const restoreRes = await fetch(`${BASE}/sections/${section.id}/publish`, {
    method: 'PUT',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: [{ fieldKey: 'title', fieldType: 'text', value: originalTitle }] }),
  });
  if (restoreRes.status !== 200) { console.error('RESTORE FAILED', restoreRes.status); process.exit(1); }
  const finalCheck = await (await fetch(`${BASE}/pages/slug/home`)).json();
  const finalSect = finalCheck.sections.find((s) => s.id === section.id);
  if (finalSect?.title !== originalTitle) {
    console.error('FAIL restore did not revert title', finalSect?.title); process.exit(1);
  }
  console.log('PASS restore original title');

  console.log('\nALL CHECKS PASSED');
  process.exit(0);
}

main().catch((e) => { console.error('ERROR', e.message); process.exit(1); });
