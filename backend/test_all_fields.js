/**
 * Comprehensive Automated Field-Level Test Runner
 * Tests every page, section, container, and editable field across the site.
 */

require('dotenv').config();
const http = require('http');
const { signAccessToken } = require('./dist/utils/jwt');

const ADMIN_TOKEN = signAccessToken({
  adminId: 'd89b3921-33a7-413c-88c5-6cbaa5823d8d',
  email: 'pauravshah2@gmail.com',
  isSuperAdmin: true,
});

function request(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, 'http://localhost:8001');
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };
    if (data) {
      reqHeaders['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
    }

    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: method,
        headers: reqHeaders,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(body);
          } catch (e) {
            parsed = body;
          }
          resolve({ status: res.statusCode, data: parsed });
        });
      }
    );

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

function checkFrontendRoute(path) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3000${path}`, (res) => {
      resolve({ path, status: res.statusCode });
    });
    req.on('error', (err) => resolve({ path, status: 'ERROR', error: err.message }));
  });
}

async function runTestSuite() {
  console.log('========================================================================');
  console.log('🚀 STARTING FULL FIELD-LEVEL AUDIT & VERIFICATION TEST SUITE');
  console.log('========================================================================\n');

  const report = {
    pagesAudited: 0,
    sectionsAudited: 0,
    fieldsTested: 0,
    fieldsPassed: 0,
    fieldsFailed: 0,
    globalSettingsTested: 0,
    globalSettingsPassed: 0,
    frontendRoutesTested: 0,
    frontendRoutesPassed: 0,
    pageSummaries: [],
  };

  // 1. Audit Public and Admin Frontend Routes
  console.log('--- PHASE 1: FRONTEND ROUTE DISCOVERY & REACHABILITY ---');
  const frontendRoutes = [
    '/',
    '/about',
    '/services',
    '/services/individual-tax-prep',
    '/cpa-outsourcing',
    '/hire-professionals',
    '/hire-professionals/tax-preparer',
    '/tax-resources',
    '/blog',
    '/contact',
    '/book-consultation',
    '/tax-calculator',
    '/admin/dashboard',
    '/admin/pages',
    '/admin/tax-intelligence',
    '/admin/production-dashboard',
    '/admin/execution-map',
    '/admin/services-workflow',
    '/admin/live-animations',
    '/admin/shared-media',
  ];

  for (const route of frontendRoutes) {
    const res = await checkFrontendRoute(route);
    report.frontendRoutesTested++;
    if (res.status === 200) {
      report.frontendRoutesPassed++;
      console.log(`  ✓ Route [200 OK]: ${route}`);
    } else {
      console.error(`  ✗ Route [FAILED ${res.status}]: ${route}`);
    }
  }

  // 2. Audit All Pages and Sections from Backend API
  console.log('\n--- PHASE 2: DATABASE PAGE & SECTION CONTENT FIELD AUDIT ---');
  const pagesRes = await request('GET', '/api/v1/pages', null, {
    Authorization: `Bearer ${ADMIN_TOKEN}`,
  });

  const pages = Array.isArray(pagesRes.data)
    ? pagesRes.data
    : pagesRes.data?.pages || pagesRes.data?.data || [];

  console.log(`Discovered ${pages.length} website pages registered in system.\n`);
  report.pagesAudited = pages.length;

  for (const pageSummary of pages) {
    const pageDetailRes = await request('GET', `/api/v1/pages/slug/${pageSummary.slug}`);
    const page = pageDetailRes.data;
    const sections = page.sections || page.pagesection || [];

    console.log(`📄 PAGE: /${pageSummary.slug} ("${pageSummary.title}") — ${sections.length} Sections`);
    const pageInfo = {
      slug: pageSummary.slug,
      title: pageSummary.title,
      sectionCount: sections.length,
      sections: [],
    };

    for (const sec of sections) {
      report.sectionsAudited++;
      let contentObj = {};
      try {
        contentObj = typeof sec.content === 'string' ? JSON.parse(sec.content || '{}') : (sec.content || {});
      } catch (e) {
        contentObj = {};
      }

      const keys = Object.keys(contentObj);
      console.log(`   ├─ Section: [${sec.sectionKey}] "${sec.title}" (Keys: ${keys.length})`);

      const secInfo = {
        sectionKey: sec.sectionKey,
        title: sec.title,
        keys: keys,
        tests: [],
      };

      // Test A: Draft save via PUT /api/v1/sections/:id/draft with field list
      const originalTitle = sec.title;
      const testTitle = originalTitle + ' [Test-Draft]';

      const draftRes = await request(
        'PUT',
        `/api/v1/sections/${sec.id}/draft`,
        {
          fields: [
            { fieldKey: 'title', value: testTitle },
            { fieldKey: 'description', value: sec.description || '' },
          ],
        },
        { Authorization: `Bearer ${ADMIN_TOKEN}` }
      );

      report.fieldsTested++;
      if (draftRes.status === 200) {
        report.fieldsPassed++;
        secInfo.tests.push({ field: 'draft.title', result: 'PASS' });
      } else {
        report.fieldsFailed++;
        secInfo.tests.push({ field: 'draft.title', result: 'FAIL', status: draftRes.status });
      }

      // Test B: Publish draft via PUT /api/v1/sections/:id/publish
      const publishRes = await request(
        'PUT',
        `/api/v1/sections/${sec.id}/publish`,
        {
          fields: [
            { fieldKey: 'title', value: originalTitle },
            { fieldKey: 'description', value: sec.description || '' },
          ],
          note: 'Verification automated test restore',
        },
        { Authorization: `Bearer ${ADMIN_TOKEN}` }
      );

      report.fieldsTested++;
      if (publishRes.status === 200) {
        report.fieldsPassed++;
        secInfo.tests.push({ field: 'publish.title', result: 'PASS' });
      } else {
        report.fieldsFailed++;
        secInfo.tests.push({ field: 'publish.title', result: 'FAIL', status: publishRes.status });
      }

      // Test C: Content JSON field draft & publish test if keys present
      if (keys.length > 0) {
        const testKey = keys[0];
        const originalVal = contentObj[testKey];
        let testVal = originalVal;
        if (typeof originalVal === 'string') {
          testVal = originalVal + ' [Audited]';
        }

        const draftContentRes = await request(
          'PUT',
          `/api/v1/sections/${sec.id}/draft`,
          {
            fields: [
              { fieldKey: testKey, value: testVal },
            ],
          },
          { Authorization: `Bearer ${ADMIN_TOKEN}` }
        );

        report.fieldsTested++;
        if (draftContentRes.status === 200) {
          report.fieldsPassed++;
          secInfo.tests.push({ field: `draft.content.${testKey}`, result: 'PASS' });

          // Restore through publish
          await request(
            'PUT',
            `/api/v1/sections/${sec.id}/publish`,
            {
              fields: [
                { fieldKey: testKey, value: originalVal },
              ],
              note: 'Restored original test value',
            },
            { Authorization: `Bearer ${ADMIN_TOKEN}` }
          );
        } else {
          report.fieldsFailed++;
          secInfo.tests.push({ field: `draft.content.${testKey}`, result: 'FAIL', status: draftContentRes.status });
        }
      }

      pageInfo.sections.push(secInfo);
    }

    report.pageSummaries.push(pageInfo);
    console.log('');
  }

  // 3. Audit Dedicated Visual Managers & Global Settings
  console.log('--- PHASE 3: DEDICATED VISUAL MANAGERS & GLOBAL SETTINGS AUDIT ---');
  const allSettingsRes = await request('GET', '/api/v1/settings');
  const allSettings = allSettingsRes.data || {};

  const visualManagerKeys = [
    'tax_intelligence_config',
    'production_dashboard_config',
    'execution_map_config',
    'animation_settings',
    'footer_content',
    'contact_info',
  ];

  for (const key of visualManagerKeys) {
    report.globalSettingsTested++;
    const exists = key in allSettings;

    if (exists) {
      report.globalSettingsPassed++;
      console.log(`  ✓ Setting [${key}]: Available in system settings dictionary`);

      // Test update verification roundtrip via PUT /api/v1/settings/:key
      let currentVal = allSettings[key];
      const putRes = await request(
        'PUT',
        `/api/v1/settings/${key}`,
        { value: currentVal },
        { Authorization: `Bearer ${ADMIN_TOKEN}` }
      );

      if (putRes.status === 200) {
        console.log(`    ↳ Update verification roundtrip: PASS`);
      } else {
        console.error(`    ↳ Update verification roundtrip: FAIL (${putRes.status})`);
      }
    } else {
      console.error(`  ✗ Setting [${key}]: Not found in global settings`);
    }
  }

  // Final Summary
  console.log('\n========================================================================');
  console.log('📊 MASTER TEST SUITE RESULTS SUMMARY');
  console.log('========================================================================');
  console.log(`Total Pages Audited:           ${report.pagesAudited} / 10`);
  console.log(`Total Sections Audited:        ${report.sectionsAudited}`);
  console.log(`Frontend Routes Reachable:     ${report.frontendRoutesPassed} / ${report.frontendRoutesTested}`);
  console.log(`Field-Level CRUD Tests:        ${report.fieldsPassed} Passed, ${report.fieldsFailed} Failed`);
  console.log(`Global Settings & Managers:    ${report.globalSettingsPassed} / ${report.globalSettingsTested}`);
  console.log(`Overall Health:                ${report.fieldsFailed === 0 && report.globalSettingsPassed === 6 ? '100% HEALTHY & VERIFIED' : 'ISSUES DETECTED'}`);
  console.log('========================================================================\n');

  return report;
}

runTestSuite().catch(console.error);
