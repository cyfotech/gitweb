// Complete End-to-End Test for Book Consultation System
const API_BASE = 'http://localhost:8001/api/v1';

async function runTests() {
  console.log('==================================================');
  console.log('🚀 TESTING SMART TAX EXPERTS BOOK CONSULTATION SYSTEM');
  console.log('==================================================\n');

  // STEP 1: Log in as admin to get token
  console.log('Step 1: Admin Authentication...');
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@preferredtax.com', password: 'root' })
  });
  const loginData = await loginRes.json();
  const token = loginData.accessToken || loginData.token;
  if (!token) {
    throw new Error('Admin login failed: ' + JSON.stringify(loginData));
  }
  console.log('✅ Admin authenticated successfully.\n');

  // STEP 2: Submit a realistic customer consultation from public website
  console.log('Step 2: Submitting Customer Consultation (Rachel Sterling, CPA Firm)...');
  const submissionData = {
    fullName: 'Rachel Sterling',
    email: `rachel.sterling.${Date.now()}@sterlingcpa.com`,
    phone: '(555) 234-5678',
    companyName: 'Sterling CPA Partners LLC',
    category: 'cpa',
    serviceSlug: 'tax-prep-outsourcing',
    annualVolumeOrRevenue: 'CPA Firm: 200-1000+ Returns/yr',
    preferredContactMethod: 'phone',
    message: 'We manage 450+ 1040 and 1120S filings annually using UltraTax and ProConnect. Seeking dedicated off-shore team with 48h turnaround SLA.',
    privacyConsent: true
  };

  const submitRes = await fetch(`${API_BASE}/consultations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submissionData)
  });

  const submitResult = await submitRes.json();
  console.log('Submission Response:', submitResult);
  if (!submitResult.success || !submitResult.referenceNo || !submitResult.id) {
    throw new Error('Consultation submission failed!');
  }
  const consultationId = submitResult.id;
  const refNo = submitResult.referenceNo;
  console.log(`✅ Saved in MySQL Database with Reference No: ${refNo} (ID: ${consultationId})\n`);

  // STEP 3: Verify Admin CMS queue receives the consultation
  console.log('Step 3: Fetching Consultation Queue in Admin CMS...');
  const fetchRes = await fetch(`${API_BASE}/consultations?search=${encodeURIComponent(refNo)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const fetchData = await fetchRes.json();
  const found = fetchData.consultations?.find(c => c.id === consultationId || c.referenceNo === refNo);
  if (!found) {
    throw new Error('Submitted consultation not found in Admin queue!');
  }
  console.log(`✅ Record successfully verified in Admin Queue:`);
  console.log(`   Customer: ${found.fullName} (${found.companyName})`);
  console.log(`   Email: ${found.email} | Phone: ${found.phone}`);
  console.log(`   Category: ${found.category} | Service: ${found.serviceSlug}`);
  console.log(`   Status: ${found.status} | Preferred Contact: ${found.preferredContactMethod}\n`);

  // STEP 4: Update status from 'new' to 'contacted'
  console.log('Step 4: Updating status to "contacted" with audit note...');
  const statusRes = await fetch(`${API_BASE}/consultations/${consultationId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      status: 'contacted',
      note: 'Spoke with Rachel via phone. Discovery Zoom meeting scheduled for Wednesday at 10 AM EST.',
      assignedAdminName: 'David Miller, Senior Partner'
    })
  });
  const statusData = await statusRes.json();
  console.log(`✅ Status updated to: ${statusData.status}`);
  console.log(`   Assigned Partner: ${statusData.assignedAdminName}`);
  console.log(`   Audit History Length: ${statusData.statusHistory?.length || 0} events\n`);

  // STEP 5: Add an internal admin note
  console.log('Step 5: Adding Internal Executive Note...');
  const noteRes = await fetch(`${API_BASE}/consultations/${consultationId}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      note: 'Client requires dedicated 3-member team with UltraTax certification.'
    })
  });
  const noteData = await noteRes.json();
  if (!noteData.notes.includes('UltraTax certification')) {
    throw new Error('Failed to verify internal note in database!');
  }
  console.log('✅ Internal note successfully stored in database.\n');

  // STEP 6: Check Real Database Analytics
  console.log('Step 6: Verifying Real Database Analytics Aggregations...');
  const analyticsRes = await fetch(`${API_BASE}/consultations/analytics`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const analyticsData = await analyticsRes.json();
  console.log('Analytics Summary:', analyticsData.summary);
  if (analyticsData.summary.total < 1) {
    throw new Error('Analytics failed to aggregate real records!');
  }
  console.log('✅ Analytics endpoint operational and connected to database.\n');

  // STEP 7: Verify persistence after re-fetch
  console.log('Step 7: Verifying Database Persistence...');
  const verifyRes = await fetch(`${API_BASE}/consultations/${consultationId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const verified = await verifyRes.json();
  if (verified.status !== 'contacted') {
    throw new Error(`Expected status 'contacted', got '${verified.status}'`);
  }
  console.log(`✅ Verified database persistence: status '${verified.status}' confirmed.\n`);

  console.log('==================================================');
  console.log('🎉 ALL 7 BOOK CONSULTATION WORKFLOW TESTS PASSED!');
  console.log('==================================================');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
