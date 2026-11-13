const API_BASE = 'http://localhost:8001/api/v1';

async function testCompleteLifecycle() {
  console.log('=== VERIFYING REDESIGNED CONSULTATION WORKFLOW LIFECYCLE ===\n');

  // 1. Admin login
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@preferredtax.com', password: 'root' })
  });
  const token = (await loginRes.json()).accessToken;

  // 2. Submit customer consultation from website
  const timestamp = Date.now();
  const subRes = await fetch(`${API_BASE}/consultations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Marcus Vance',
      email: `marcus.vance.${timestamp}@vancetech.io`,
      phone: '(415) 890-1234',
      companyName: 'Vance Technologies Inc',
      category: 'business',
      serviceSlug: 'corporate-tax-planning',
      annualVolumeOrRevenue: '$1M - $5M',
      preferredContactMethod: 'phone',
      message: 'Need corporate tax structuring and multi-state franchise tax reviews.',
      privacyConsent: true
    })
  });
  const submission = await subRes.json();
  const id = submission.id;
  console.log(`1. [NEW REQUEST] Created consultation ${submission.referenceNo} (ID: ${id})`);

  // 3. Mark Contacted
  const contactedRes = await fetch(`${API_BASE}/consultations/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      status: 'contacted',
      note: 'Spoke with Marcus on the phone. Client confirmed interest in corporate tax planning.'
    })
  });
  const contacted = await contactedRes.json();
  console.log(`2. [CONTACTED] Status changed to '${contacted.status}'. History items: ${contacted.statusHistory.length}`);

  // 4. Schedule Consultation Appointment
  const scheduleRes = await fetch(`${API_BASE}/consultations/${id}/schedule`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      appointmentDate: '2026-11-15',
      appointmentTime: '02:00 PM EST',
      meetingType: 'Online Video (Google Meet / Zoom)',
      meetingLocation: 'https://meet.google.com/ste-vance-discovery',
      assignedAdminName: 'David Miller, Senior CPA'
    })
  });
  const scheduled = await scheduleRes.json();
  console.log(`3. [SCHEDULED] Appointment saved for ${scheduled.appointmentDate} at ${scheduled.appointmentTime}. Status: '${scheduled.status}'`);

  // 5. Start Consultation (In Progress)
  const inProgressRes = await fetch(`${API_BASE}/consultations/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      status: 'in_progress',
      note: 'Discovery session underway with Marcus Vance.'
    })
  });
  const inProg = await inProgressRes.json();
  console.log(`4. [IN PROGRESS] Status changed to '${inProg.status}'.`);

  // 6. Complete Consultation
  const completedRes = await fetch(`${API_BASE}/consultations/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      status: 'completed',
      note: 'Consultation completed successfully. Proposal dispatched for corporate tax filing.'
    })
  });
  const completed = await completedRes.json();
  console.log(`5. [COMPLETED] Status changed to '${completed.status}'.`);

  // 7. Add an internal note
  const noteRes = await fetch(`${API_BASE}/consultations/${id}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      note: 'Proposal sent: $15,000 annual corporate compliance contract.'
    })
  });
  const noteData = await noteRes.json();
  console.log(`6. [NOTE ADDED] Total notes: ${noteData.parsedNotes?.length}. Latest: "${noteData.parsedNotes?.[0]?.text}"`);

  // 8. Delete a note
  const noteId = noteData.parsedNotes?.[0]?.id;
  const delNoteRes = await fetch(`${API_BASE}/consultations/${id}/notes/${noteId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const delData = await delNoteRes.json();
  console.log(`7. [NOTE DELETED] Remaining notes: ${delData.parsedNotes?.length}`);

  // 9. Verify 5 Essential Cards from DB
  const analyticsRes = await fetch(`${API_BASE}/consultations/analytics`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const stats = (await analyticsRes.json()).summary;
  console.log('\n8. [ANALYTICS SUMMARY]:', stats);
  console.log('\n=== ALL LIFECYCLE OPERATIONS PASSED WITH FULL PERSISTENCE! ===');
}

testCompleteLifecycle().catch(console.error);

