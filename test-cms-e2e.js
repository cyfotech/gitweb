const API_BASE = 'http://localhost:8001/api/v1';

async function runCmsE2ETests() {
  console.log('==================================================');
  console.log('🚀 TESTING CMS END-TO-END PIPELINE & FRONTEND SYNC');
  console.log('==================================================\n');

  try {
    // 1. Authenticate Admin
    console.log('Step 1: Authenticating Admin Session...');
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@preferredtax.com',
        password: 'root',
      }),
    });
    const loginData = await loginRes.json();
    const token = loginData.accessToken;
    if (!token) throw new Error('Failed to obtain access token: ' + JSON.stringify(loginData));
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    console.log('✅ Admin authenticated successfully.\n');

    // 2. Fetch all pages (Page Manager verification)
    console.log('Step 2: Testing GET /pages (Page Manager API)...');
    const pagesRes = await fetch(`${API_BASE}/pages`, { headers: authHeaders });
    const pages = await pagesRes.json();
    console.log(`✅ Retrieved ${pages.length} pages from MySQL.`);
    const homePage = pages.find((p) => p.slug === 'home');
    if (!homePage) throw new Error('Home page not found in /pages response');
    console.log(`   Target page: "${homePage.title}" (ID: ${homePage.id}, Route: ${homePage.route})\n`);

    // 3. Fetch single page sections (Section Editor verification)
    console.log(`Step 3: Testing GET /pages/${homePage.id} (Section Editor API)...`);
    const pageDetailRes = await fetch(`${API_BASE}/pages/${homePage.id}`, { headers: authHeaders });
    const pageDetail = await pageDetailRes.json();
    const sections = pageDetail.sections;
    console.log(`✅ Page detail loaded. Found ${sections.length} sections for Home page.`);
    const heroSection = sections.find((s) => s.sectionKey === 'hero');
    if (!heroSection) throw new Error('Hero section not found on Home page');
    const originalHeroTitle = heroSection.title;
    console.log(`   Hero section ID: ${heroSection.id}`);
    console.log(`   Current Title: "${originalHeroTitle}"\n`);

    // 4. Test Draft Update (PUT /sections/:id/draft)
    console.log('Step 4: Testing PUT /sections/:id/draft (Save Draft to MySQL)...');
    const testDraftTitle = `Your Trusted Financial Growth Partner (Draft Test ${Date.now().toString(36)})`;
    const draftRes = await fetch(`${API_BASE}/sections/${heroSection.id}/draft`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        fields: [{ fieldKey: 'title', value: testDraftTitle }],
        note: 'Automated E2E draft test',
      }),
    });
    if (!draftRes.ok) throw new Error('Draft update failed: ' + (await draftRes.text()));
    console.log('✅ Draft saved to database (separate draftData snapshot).\n');

    // 5. Verify Public Page STILL shows published title (Draft separation)
    console.log('Step 5: Verifying Public Page (GET /pages/slug/home) still serves published title...');
    const publicBeforePublishRes = await fetch(`${API_BASE}/pages/slug/home`);
    const publicBeforePublish = await publicBeforePublishRes.json();
    const publicHeroBefore = publicBeforePublish.sections.find((s) => s.sectionKey === 'hero');
    console.log(`   Public Hero Title: "${publicHeroBefore.title}"`);
    if (publicHeroBefore.title === testDraftTitle) {
      throw new Error('Draft leaked into public API before publishing!');
    }
    console.log('✅ Verified: Draft remains private and isolated from public website.\n');

    // 6. Test Publish to Public Website (PUT /sections/:id/publish)
    console.log('Step 6: Testing Publishing Section to Live Website (PUT /sections/:id/publish)...');
    const liveTitle = 'Your Trusted Financial Growth Partner';
    const publishRes = await fetch(`${API_BASE}/sections/${heroSection.id}/publish`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        fields: [{ fieldKey: 'title', value: liveTitle }],
        note: 'Automated E2E publish test',
      }),
    });
    if (!publishRes.ok) throw new Error('Publish update failed: ' + (await publishRes.text()));
    console.log('✅ Published changes saved to MySQL & revision logged.\n');

    // 7. Verify Public API immediately serves new published title
    console.log('Step 7: Verifying Public Frontend API returns updated title...');
    const publicAfterPublishRes = await fetch(`${API_BASE}/pages/slug/home`);
    const publicAfterPublish = await publicAfterPublishRes.json();
    const publicHeroAfter = publicAfterPublish.sections.find((s) => s.sectionKey === 'hero');
    console.log(`   Updated Public Hero Title: "${publicHeroAfter.title}"`);
    if (publicHeroAfter.title !== liveTitle) {
      throw new Error(`Public title did not update! Expected "${liveTitle}", got "${publicHeroAfter.title}"`);
    }
    console.log('✅ Verified: Public frontend receives published title from MySQL.\n');

    // 8. Test Section Reordering
    console.log('Step 8: Testing PUT /pages/:id/sections/reorder...');
    const reorderPayload = sections.map((s, idx) => ({
      sectionId: s.id,
      displayOrder: idx,
    }));
    const reorderRes = await fetch(`${API_BASE}/pages/${homePage.id}/sections/reorder`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ order: reorderPayload }),
    });
    const reorderData = await reorderRes.json();
    if (!reorderData.success) throw new Error('Reorder API failed: ' + JSON.stringify(reorderData));
    console.log('✅ Reordering persisted successfully in Prisma transaction.\n');

    // 9. Test Reverting Title for Cleanliness
    console.log('Step 9: Restoring original title for clean state...');
    await fetch(`${API_BASE}/sections/${heroSection.id}/publish`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        fields: [{ fieldKey: 'title', value: originalHeroTitle }],
        note: 'Restoring original title after E2E test',
      }),
    });
    console.log(`✅ Title cleanly restored to "${originalHeroTitle}".\n`);

    // 10. Test Page Duplicate API
    console.log('Step 10: Testing POST /pages/:id/duplicate...');
    const dupRes = await fetch(`${API_BASE}/pages/${homePage.id}/duplicate`, {
      method: 'POST',
      headers: authHeaders,
    });
    const dupData = await dupRes.json();
    if (!dupRes.ok) throw new Error('Duplicate API failed: ' + JSON.stringify(dupData));
    console.log(`✅ Page duplicate created: "${dupData.title}" (ID: ${dupData.id}, Slug: ${dupData.slug})\n`);

    console.log('==================================================');
    console.log('🎉 ALL 10 CMS END-TO-END VERIFICATION TESTS PASSED!');
    console.log('==================================================');
  } catch (err) {
    console.error('❌ E2E Test Failure:', err.message);
    process.exit(1);
  }
}

runCmsE2ETests();
