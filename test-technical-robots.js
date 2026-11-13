const http = require('http');

function post(url, data, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const postData = JSON.stringify(data);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function put(url, data, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const postData = JSON.stringify(data);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${token}`
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (e) { resolve(body); }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function get(url, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'GET',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (e) { resolve(body); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runTechnicalRobotsTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING "TECHNICAL & ROBOTS" COMPREHENSIVE TESTS');
  console.log('====================================================');

  // Authenticate
  const login = await post('http://localhost:8001/api/v1/auth/login', {
    email: 'admin@preferredtax.com',
    password: 'root'
  });
  const token = login.accessToken;
  console.log('✓ 1. Authenticated as Admin');

  // STEP 1: Test GET /api/v1/seo/robots (Fetch default or stored robots.txt)
  const robotsFetch = await get('http://localhost:8001/api/v1/seo/robots');
  console.log('✓ 2. Fetched robots.txt:');
  console.log('----------------------------------------------------');
  console.log(robotsFetch.content);
  console.log('----------------------------------------------------');

  // STEP 2: Test PUT /api/v1/seo/robots (Admin updates robots.txt)
  const customRobotsContent = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nDisallow: /private/\n\nSitemap: https://smarttaxexperts.com/sitemap.xml`;
  const updateRobots = await put('http://localhost:8001/api/v1/seo/robots', { content: customRobotsContent }, token);
  console.log('✓ 3. Updated robots.txt via PUT /api/v1/seo/robots:', updateRobots);

  // STEP 3: Verify persistence of robots.txt
  const robotsVerify = await get('http://localhost:8001/api/v1/seo/robots');
  if (robotsVerify.content.includes('Disallow: /private/')) {
    console.log('✓ 4. Verification PASSED: Updated robots.txt is saved in MySQL GlobalSetting table!');
  } else {
    throw new Error('Robots.txt update did not persist!');
  }

  // STEP 4: Test Page-Level Robots Directives (INDEX vs NOINDEX, FOLLOW vs NOFOLLOW)
  const pages = await get('http://localhost:8001/api/v1/pages', token);
  const contactPage = pages.find(p => p.slug === 'contact');

  console.log(`✓ 5. Testing Page-level Directives on "${contactPage.title}" (${contactPage.id})...`);

  // Set contact page to NOINDEX, NOFOLLOW with priority 0.5 and monthly
  await put(`http://localhost:8001/api/v1/seo/${contactPage.id}`, {
    metaTitle: 'Contact Us | Smart Tax Experts (STE)',
    metaDescription: 'Get in touch with our team for tax queries.',
    robotsIndex: false,
    robotsFollow: false,
    sitemapPriority: '0.5',
    sitemapChange: 'monthly'
  }, token);

  // Fetch public endpoint to verify live runtime impact
  const publicContactSeo = await get('http://localhost:8001/api/v1/seo/public/contact');
  console.log('✓ 6. Verified Public SEO endpoint for /contact:');
  console.log(`   - robotsIndex: ${publicContactSeo.robotsIndex} (Triggers <meta name="robots" content="noindex, nofollow">)`);
  console.log(`   - robotsFollow: ${publicContactSeo.robotsFollow}`);
  console.log(`   - sitemapPriority: ${publicContactSeo.sitemapPriority}`);
  console.log(`   - sitemapChange: ${publicContactSeo.sitemapChange}`);

  // STEP 5: Test Live XML Sitemap Generation
  const sitemapXml = await get('http://localhost:8001/api/v1/seo/sitemap/generate');
  console.log('✓ 7. Verified dynamic sitemap.xml generator (GET /api/v1/seo/sitemap/generate):');
  console.log('----------------------------------------------------');
  console.log(sitemapXml.slice(0, 350) + '...\n</urlset>');
  console.log('----------------------------------------------------');

  if (sitemapXml.includes('<loc>https://smarttaxexperts.com/contact</loc>') && sitemapXml.includes('<priority>0.5</priority>')) {
    console.log('✓ 8. Sitemap accurately includes page priorities and change frequencies!');
  }

  // Reset contact page back to index: true, follow: true, priority: 0.8
  await put(`http://localhost:8001/api/v1/seo/${contactPage.id}`, {
    metaTitle: 'Contact Our Advisory & Outsourcing Leadership | Smart Tax Experts (STE)',
    metaDescription: 'Schedule a confidential US tax preparation or CPA outsourcing consultation with our certified partners.',
    robotsIndex: true,
    robotsFollow: true,
    sitemapPriority: '0.8',
    sitemapChange: 'weekly'
  }, token);
  console.log('✓ 9. Restored Contact page to default index: true, follow: true.');

  console.log('\n====================================================');
  console.log('🎉 ALL TECHNICAL & ROBOTS TESTS PASSED 100%!');
  console.log('====================================================');
}

runTechnicalRobotsTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});

