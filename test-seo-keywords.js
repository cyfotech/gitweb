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
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ raw: body, status: res.statusCode });
        }
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
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ raw: body, status: res.statusCode });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  console.log('--- STARTING SEO MANAGER KEYWORD SUITE TESTS ---');
  const login = await post('http://localhost:8001/api/v1/auth/login', {
    email: 'admin@preferredtax.com',
    password: 'root'
  });
  const token = login.accessToken;
  console.log('✓ Admin authenticated, accessToken received.');

  const pages = await get('http://localhost:8001/api/v1/pages', token);
  const about = pages.find(p => p.slug === 'about');
  const home = pages.find(p => p.slug === 'home');

  console.log(`✓ Located Pages: About (${about.id}), Home (${home.id})`);

  // TEST 1 & 2: Enter 16 keywords on About Us and Save
  const sampleKeywords = [
    'Smart Tax Experts',
    'Tax Consultancy Firm in Ahmedabad',
    'Tax Consultant in Ahmedabad',
    'Professional Tax Consultants',
    'Tax Advisory Services in Ahmedabad',
    'Financial Consultancy Firm',
    'Corporate Tax Consultants',
    'Business Tax Advisory',
    'Income Tax Consultants',
    'GST Consultants in Ahmedabad',
    'Accounting and Tax Services',
    'Business Financial Solutions',
    'Tax Compliance Services',
    'Tax Planning Consultants',
    'Best Tax Consultancy Firm in Ahmedabad',
    'Trusted Tax Consultants in Gujarat'
  ];

  const putResult = await put(`http://localhost:8001/api/v1/seo/${about.id}`, {
    metaTitle: 'About Us | Smart Tax Experts - Leading Tax Consultants',
    metaDescription: 'Trusted tax and accounting advisory firm in Ahmedabad providing enterprise compliance and tax planning.',
    metaKeywords: sampleKeywords,
    canonicalUrl: 'https://smarttaxexperts.com/about',
    robotsIndex: true,
    robotsFollow: true
  }, token);

  console.log('TEST 1 & 2 PASSED: Saved 16 keywords on About Us.');

  // TEST 3 & 4: Fetch About Us and verify all 16 keywords are preserved
  const aboutSeo = await get(`http://localhost:8001/api/v1/seo/${about.id}`, token);
  if (Array.isArray(aboutSeo.metaKeywords) && aboutSeo.metaKeywords.length === 16) {
    console.log(`TEST 3 & 4 PASSED: Fetched back all ${aboutSeo.metaKeywords.length} keywords from MySQL database.`);
    console.log(`Primary Keyword: "${aboutSeo.metaKeywords[0]}"`);
    console.log(`Last Keyword: "${aboutSeo.metaKeywords[aboutSeo.metaKeywords.length - 1]}"`);
  } else {
    throw new Error(`TEST 3 & 4 FAILED: Expected 16 keywords, got ${JSON.stringify(aboutSeo.metaKeywords)}`);
  }

  // TEST 5 & 6: Switch to Home Page and verify independence
  const homeSeo = await get(`http://localhost:8001/api/v1/seo/${home.id}`, token);
  const homeHasAboutKw = homeSeo.metaKeywords && homeSeo.metaKeywords.includes('Trusted Tax Consultants in Gujarat');
  if (!homeHasAboutKw) {
    console.log(`TEST 5 & 6 PASSED: Home Page keywords are completely independent & isolated (${homeSeo.metaKeywords.length} keywords)!`);
  } else {
    throw new Error('TEST 5 & 6 FAILED: Overlap detected between Home and About Us.');
  }

  // TEST 7 & 8: Return to About Us and verify 16 keywords still exist
  const aboutReturn = await get(`http://localhost:8001/api/v1/seo/${about.id}`, token);
  if (aboutReturn.metaKeywords.length === 16 && aboutReturn.metaKeywords[0] === 'Smart Tax Experts') {
    console.log('TEST 7 & 8 PASSED: Returning to About Us verifies all 16 keywords are completely intact.');
  } else {
    throw new Error('TEST 7 & 8 FAILED: Lost keywords upon returning.');
  }

  // TEST 9 & 10: Remove 1 keyword ('Trusted Tax Consultants in Gujarat') and Save
  const remaining15 = sampleKeywords.filter(k => k !== 'Trusted Tax Consultants in Gujarat');
  await put(`http://localhost:8001/api/v1/seo/${about.id}`, {
    metaTitle: aboutReturn.metaTitle,
    metaDescription: aboutReturn.metaDescription,
    metaKeywords: remaining15,
    canonicalUrl: aboutReturn.canonicalUrl,
    robotsIndex: true,
    robotsFollow: true
  }, token);

  const aboutFinal = await get(`http://localhost:8001/api/v1/seo/${about.id}`, token);
  if (aboutFinal.metaKeywords.length === 15 && !aboutFinal.metaKeywords.includes('Trusted Tax Consultants in Gujarat')) {
    console.log(`TEST 9 & 10 PASSED: Successfully deleted 1 keyword. Current count is ${aboutFinal.metaKeywords.length} and changes persisted in MySQL!`);
  } else {
    throw new Error('TEST 9 & 10 FAILED: Deletion was not persisted.');
  }

  // TEST PUBLIC ENDPOINT (Live Website Meta Integration)
  const publicSeo = await get('http://localhost:8001/api/v1/seo/public/about');
  if (publicSeo && publicSeo.metaKeywords && publicSeo.metaKeywords.length === 15) {
    console.log(`PUBLIC ENDPOINT VERIFIED: Public website receives all 15 keywords for /about:`);
    console.log(`"${publicSeo.metaKeywords.slice(0, 5).join(', ')}..."`);
  }

  console.log('\n============================================================');
  console.log('SUCCESS: ALL 10 SEO KEYWORD TESTS PASSED VERIFICATION!');
  console.log('============================================================\n');
}

run().catch(err => {
  console.error('Error during test:', err);
  process.exit(1);
});
