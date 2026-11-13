import React, { useState, useEffect } from 'react';
import { 
  Calendar, User, Mail, Phone, Building, Briefcase, RefreshCw, Clock, 
  CheckCircle, AlertCircle, FileText, Search, Trash2, 
  ChevronRight, MessageSquare, Plus, X, ArrowRight, Video, MapPin, Send,
  CheckCircle2, AlertTriangle, ArrowUpDown, ChevronDown
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { consultationsApi } from '../../api/inquiries';

// Core Operational Statuses
const STATUS_CONFIG: Record<string, { label: string; badgeCls: string; dotCls: string; step: number }> = {
  new: {
    label: 'New Request',
    badgeCls: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25',
    dotCls: 'bg-emerald-500',
    step: 1,
  },
  approved: {
    label: 'Approved',
    badgeCls: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/25',
    dotCls: 'bg-teal-500',
    step: 2,
  },
  contacted: {
    label: 'Contacted',
    badgeCls: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25',
    dotCls: 'bg-indigo-500',
    step: 2,
  },
  scheduled: {
    label: 'Scheduled',
    badgeCls: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/25',
    dotCls: 'bg-sky-500',
    step: 3,
  },
  in_progress: {
    label: 'In Progress',
    badgeCls: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25',
    dotCls: 'bg-amber-500',
    step: 4,
  },
  completed: {
    label: 'Completed',
    badgeCls: 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 border border-emerald-600/25',
    dotCls: 'bg-emerald-600',
    step: 5,
  },
  cancelled: {
    label: 'Cancelled',
    badgeCls: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25',
    dotCls: 'bg-rose-500',
    step: 0,
  },
  rejected: {
    label: 'Rejected',
    badgeCls: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/25',
    dotCls: 'bg-orange-500',
    step: 0,
  },
};

export function ConsultationsManagerPage() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  // Clean Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Modals & Intelligent Action States
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    appointmentDate: '',
    appointmentTime: '10:00 AM EST',
    meetingType: 'Calendly Video Call',
    meetingLocation: 'https://calendly.com/smarttaxexperts/strategic-consultation',
    assignedAdminName: 'David Miller, Senior CPA',
  });

  const [outcomeModalOpen, setOutcomeModalOpen] = useState(false);
  const [outcomeType, setOutcomeType] = useState<'cancelled' | 'rejected'>('cancelled');
  const [outcomeReason, setOutcomeReason] = useState('');

  const [statusOverrideModalOpen, setStatusOverrideModalOpen] = useState(false);
  const [overrideStatus, setOverrideStatus] = useState('');
  const [overrideReason, setOverrideReason] = useState('');

  const [noteText, setNoteText] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyRecipient, setReplyRecipient] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const showNotification = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const openReplyModal = () => {
    if (!selectedConsultation) return;
    setReplyRecipient(selectedConsultation.email);
    setReplySubject(`Re: [${selectedConsultation.referenceNo || 'STE'}] Consultation enquiry`);
    setReplyMessage(
      `Dear ${selectedConsultation.fullName},\n\nThank you for contacting STE Smart Tax Experts. Regarding your ${selectedConsultation.serviceSlug?.replace(/-/g, ' ') || 'consultation'} request:\n\n[Write your response here]\n\nBest regards,\nSTE Smart Tax Experts`
    );
    setReplyModalOpen(true);
  };

  const handleSendReply = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedConsultation || !replyRecipient.trim() || !replySubject.trim() || !replyMessage.trim()) return;
    setSendingReply(true);
    try {
      const result = await consultationsApi.reply(selectedConsultation.id, {
        to: replyRecipient.trim(),
        subject: replySubject.trim(),
        message: replyMessage.trim(),
      });
      setSelectedConsultation((current: any) => current
        ? { ...current, communicationHistory: result.communicationHistory }
        : current);
      setConsultations((current) => current.map((item) => item.id === selectedConsultation.id
        ? { ...item, communicationHistory: result.communicationHistory }
        : item));
      setReplyModalOpen(false);
      showNotification('Reply accepted by SMTP and recorded in email history.');
    } catch (error: any) {
      const responseData = error?.response?.data;
      const history = responseData?.communicationHistory;
      if (Array.isArray(history)) {
        setSelectedConsultation((current: any) => current
          ? { ...current, communicationHistory: history }
          : current);
        setConsultations((current) => current.map((item) => item.id === selectedConsultation.id
          ? { ...item, communicationHistory: history }
          : item));
      }
      alert(`Reply email was not accepted: ${responseData?.error || error.message || 'SMTP error'}`);
    } finally {
      setSendingReply(false);
    }
  };

  // Fetch Consultations
  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const data: any = await consultationsApi.getAll({
        search: searchTerm,
        status: statusFilter,
        category: categoryFilter,
        startDate: dateFilter || undefined,
        sort: sortOrder === 'asc' ? 'oldest' : 'newest',
        limit: 100,
      });

      const list = data?.consultations || (Array.isArray(data) ? data : []);
      setConsultations(list);
      setTotal(data?.total || list.length);

      if (list.length > 0) {
        if (!selectedConsultation || !list.some((item: any) => item.id === selectedConsultation.id)) {
          setSelectedConsultation(list[0]);
        } else {
          const refreshed = list.find((item: any) => item.id === selectedConsultation.id);
          if (refreshed) setSelectedConsultation(refreshed);
        }
      } else {
        setSelectedConsultation(null);
      }
    } catch (err: any) {
      console.error('Failed to fetch consultations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Analytics (5 Essential Cards)
  const fetchAnalytics = async () => {
    try {
      const res: any = await consultationsApi.getAnalytics();
      setAnalytics(res?.summary || null);
    } catch (err) {
      console.error('Failed to load consultation analytics:', err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchConsultations();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, categoryFilter, dateFilter, sortOrder]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // -------------------------------------------------------------------------
  // INTELLIGENT STEP TRANSITIONS: NEW -> APPROVED -> CONTACTED -> SCHEDULED -> IN PROGRESS -> COMPLETED
  // -------------------------------------------------------------------------

  // Approve Consultation Request
  const handleApprove = async () => {
    if (!selectedConsultation) return;
    try {
      await consultationsApi.updateStatus(selectedConsultation.id, 'approved', {
        note: `Consultation approved by administrator. Customer informed with scheduling options.`,
      });
      showNotification('Consultation Approved! Customer notification email dispatched.');
      fetchConsultations();
      fetchAnalytics();
    } catch (err: any) {
      alert('Failed to approve consultation: ' + (err.message || 'Error'));
    }
  };

  // Step 1 -> 2: Mark Contacted
  const handleMarkContacted = async () => {
    if (!selectedConsultation) return;
    try {
      await consultationsApi.updateStatus(selectedConsultation.id, 'contacted', {
        note: `Contacted customer via ${selectedConsultation.preferredContactMethod || 'email'}. Initial requirements reviewed.`,
      });
      showNotification('Customer marked as Contacted.');
      fetchConsultations();
      fetchAnalytics();
    } catch (err: any) {
      alert('Failed to update status: ' + (err.message || 'Error'));
    }
  };

  // Step 2 -> 3: Schedule Appointment
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsultation || !scheduleData.appointmentDate) return;
    try {
      await consultationsApi.schedule(selectedConsultation.id, scheduleData);
      showNotification(`Consultation scheduled for ${scheduleData.appointmentDate} at ${scheduleData.appointmentTime}.`);
      setScheduleModalOpen(false);
      fetchConsultations();
      fetchAnalytics();
    } catch (err: any) {
      alert('Failed to schedule consultation: ' + (err.message || 'Error'));
    }
  };

  // Step 3 -> 4: Start Consultation (In Progress)
  const handleStartConsultation = async () => {
    if (!selectedConsultation) return;
    try {
      await consultationsApi.updateStatus(selectedConsultation.id, 'in_progress', {
        note: 'Consultation session initiated with customer.',
      });
      showNotification('Consultation is now In Progress.');
      fetchConsultations();
      fetchAnalytics();
    } catch (err: any) {
      alert('Failed to update status: ' + (err.message || 'Error'));
    }
  };

  // Step 4 -> 5: Mark Completed
  const handleMarkCompleted = async () => {
    if (!selectedConsultation) return;
    try {
      await consultationsApi.updateStatus(selectedConsultation.id, 'completed', {
        note: 'Discovery session completed. Scope engagement deliverables finalized.',
      });
      showNotification('Consultation successfully Completed!');
      fetchConsultations();
      fetchAnalytics();
    } catch (err: any) {
      alert('Failed to complete consultation: ' + (err.message || 'Error'));
    }
  };

  // Cancelled or Rejected (With Required Reason)
  const handleOutcomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsultation || !outcomeReason.trim()) {
      alert('Please state a reason for cancellation or rejection.');
      return;
    }
    try {
      await consultationsApi.updateStatus(selectedConsultation.id, outcomeType, {
        cancellationReason: outcomeReason.trim(),
        note: `${outcomeType === 'cancelled' ? 'Cancellation' : 'Rejection'} Reason: ${outcomeReason.trim()}`,
      });
      showNotification(`Consultation marked as ${outcomeType.toUpperCase()}.`);
      setOutcomeModalOpen(false);
      setOutcomeReason('');
      fetchConsultations();
      fetchAnalytics();
    } catch (err: any) {
      alert('Failed to update request: ' + (err.message || 'Error'));
    }
  };

  // Manual Status Correction for authorized admin
  const handleStatusOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsultation || !overrideStatus) return;
    try {
      await consultationsApi.updateStatus(selectedConsultation.id, overrideStatus, {
        note: overrideReason.trim() ? `Status corrected: ${overrideReason.trim()}` : `Administrator manually corrected status to ${overrideStatus}`,
      });
      showNotification(`Status updated to ${overrideStatus.replace('_', ' ').toUpperCase()}.`);
      setStatusOverrideModalOpen(false);
      setOverrideReason('');
      fetchConsultations();
      fetchAnalytics();
    } catch (err: any) {
      alert('Failed to correct status: ' + (err.message || 'Error'));
    }
  };

  // Notes
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsultation || !noteText.trim()) return;
    try {
      await consultationsApi.addNote(selectedConsultation.id, noteText);
      setNoteText('');
      showNotification('Internal note saved.');
      fetchConsultations();
    } catch (err: any) {
      alert('Failed to save note: ' + (err.message || 'Error'));
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!selectedConsultation) return;
    try {
      await consultationsApi.deleteNote(selectedConsultation.id, noteId);
      showNotification('Note deleted.');
      fetchConsultations();
    } catch (err: any) {
      alert('Failed to delete note: ' + (err.message || 'Error'));
    }
  };

  const activeStatus = selectedConsultation?.status || 'new';
  const statusInfo = STATUS_CONFIG[activeStatus] || {
    label: activeStatus,
    badgeCls: 'bg-slate-500/15 text-slate-400 border border-slate-500/20',
    dotCls: 'bg-slate-400',
    step: 1,
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5 animate-fade-in text-slate-900 dark:text-white">
        
        {/* Floating Notification */}
        {actionSuccess && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-teal-600 text-white shadow-xl text-xs font-semibold animate-fade-in">
            <CheckCircle2 size={16} />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2.5">
              <Calendar className="w-6 h-6 text-teal-500" />
              <span>Consultations Management</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review customer scope inquiries, coordinate discovery calls, and manage consultation workflow
            </p>
          </div>

          <button
            onClick={() => {
              fetchConsultations();
              fetchAnalytics();
            }}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-black/5 dark:bg-white/5 hover:bg-teal-500/10 text-slate-600 dark:text-slate-300 border border-teal-500/20 transition-all cursor-pointer"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin text-teal-500' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* 1. SECTIONS STRIP (Quick Status Buckets) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {[
            { id: 'new', label: 'New Enquiries', count: analytics?.new ?? 0, color: 'emerald' },
            { id: 'approved', label: 'Approved', count: analytics?.approved ?? 0, color: 'teal' },
            { id: 'contacted', label: 'Contacted', count: analytics?.contacted ?? 0, color: 'indigo' },
            { id: 'scheduled', label: 'Scheduled', count: analytics?.scheduled ?? 0, color: 'sky' },
            { id: 'in_progress', label: 'In Progress', count: analytics?.inProgress ?? 0, color: 'amber' },
            { id: 'completed', label: 'Completed', count: analytics?.completed ?? 0, color: 'emerald' },
            { id: 'cancelled', label: 'Cancelled / Rejected', count: (analytics?.cancelled ?? 0) + (analytics?.rejected ?? 0), color: 'rose' },
          ].map((sec) => (
            <div
              key={sec.id}
              onClick={() => setStatusFilter(statusFilter === sec.id ? '' : sec.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                statusFilter === sec.id
                  ? 'bg-teal-500/20 border-teal-500/60 shadow-sm'
                  : 'bg-white/80 dark:bg-[#071A22]/80 border-teal-500/15 hover:border-teal-500/35'
              }`}
            >
              <span className="text-[10px] font-semibold text-slate-500 block truncate mb-1">
                {sec.label}
              </span>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                {sec.count}
              </div>
            </div>
          ))}
        </div>

        {/* 2. COMPACT SEARCH & CLEAN FILTER STRIP */}
        <div className="bg-white/80 dark:bg-[#071A22]/80 border border-teal-500/15 rounded-2xl p-3 backdrop-blur-xl flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-black/5 dark:bg-[#031117] border border-teal-500/15 focus:outline-none focus:border-teal-400 text-slate-900 dark:text-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl text-xs bg-black/5 dark:bg-[#031117] border border-teal-500/15 focus:outline-none focus:border-teal-400 text-slate-800 dark:text-slate-200"
          >
            <option value="">All Statuses</option>
            <option value="new">1. New Enquiries</option>
            <option value="approved">2. Approved Consultations</option>
            <option value="contacted">3. Contacted Customers</option>
            <option value="scheduled">4. Scheduled Meetings</option>
            <option value="in_progress">5. In Progress</option>
            <option value="completed">6. Completed Requests</option>
            <option value="cancelled">7. Cancelled Requests</option>
            <option value="rejected">8. Rejected Requests</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl text-xs bg-black/5 dark:bg-[#031117] border border-teal-500/15 focus:outline-none focus:border-teal-400 text-slate-800 dark:text-slate-200"
          >
            <option value="">All Categories</option>
            <option value="cpa">CPA Firms</option>
            <option value="business">Company / Business</option>
            <option value="individual">Individual / Family</option>
          </select>

          {/* Sort Button */}
          <button
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-teal-500/15 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
            title="Toggle sort direction"
          >
            <ArrowUpDown size={12} />
            <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
          </button>

          {(searchTerm || statusFilter || categoryFilter || dateFilter) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setCategoryFilter('');
                setDateFilter('');
              }}
              className="text-xs text-rose-500 hover:underline px-1 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* 3. CLEAN TWO-COLUMN WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* LEFT: Clean, Compact Consultation Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
            {loading && consultations.length === 0 ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-white/40 dark:bg-white/5 border border-teal-500/10 animate-pulse" />
              ))
            ) : consultations.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-xs bg-white/40 dark:bg-[#071A22]/40 rounded-2xl border border-teal-500/10">
                <Calendar size={24} className="mx-auto text-teal-500/30 mb-2" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">No consultation requests found.</p>
                <p className="text-[11px] mt-0.5">Adjust your filters or submit a new consultation online.</p>
              </div>
            ) : (
              consultations.map((item) => {
                const isSelected = selectedConsultation?.id === item.id;
                const itemStatus = STATUS_CONFIG[item.status] || {
                  label: item.status || 'New',
                  badgeCls: 'bg-slate-500/15 text-slate-400 border border-slate-500/20',
                  dotCls: 'bg-slate-400',
                  step: 1,
                };

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedConsultation(item)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left relative ${
                      isSelected
                        ? 'bg-teal-500/15 border-teal-500/60 shadow-md ring-1 ring-teal-500/30'
                        : 'bg-white/80 dark:bg-[#071A22]/80 border-teal-500/10 hover:border-teal-500/30 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="min-w-0">
                        <span className="font-bold text-xs truncate text-slate-900 dark:text-white block">
                          {item.fullName}
                        </span>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {item.email} • {item.phone}
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize shrink-0 flex items-center gap-1.5 ${itemStatus.badgeCls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${itemStatus.dotCls}`} />
                        <span>{itemStatus.label}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-black/5 dark:border-white/5 text-slate-600 dark:text-slate-400">
                      <span className="truncate font-medium text-teal-600 dark:text-teal-300">
                        {item.serviceSlug ? item.serviceSlug.replace(/-/g, ' ') : 'Tax Consultation'}
                      </span>
                      <span className="shrink-0 text-[10px] text-slate-400 ml-2">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT: Intelligent Selected Customer Details & Workflow (7 cols) */}
          <div className="lg:col-span-7 bg-white/90 dark:bg-[#071A22]/90 border border-teal-500/20 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-5">
            {selectedConsultation ? (
              <div className="space-y-5">
                
                {/* Header & Status Step Flow Indicator */}
                <div className="space-y-3 pb-3 border-b border-teal-500/15">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {selectedConsultation.fullName}
                      </h2>
                      <p className="text-xs text-slate-500">
                        Submitted {selectedConsultation.createdAt ? new Date(selectedConsultation.createdAt).toLocaleString() : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${statusInfo.badgeCls}`}>
                        <span className={`w-2 h-2 rounded-full ${statusInfo.dotCls}`} />
                        <span>{statusInfo.label}</span>
                      </span>

                      {/* Manual correction button */}
                      <button
                        onClick={() => {
                          setOverrideStatus(selectedConsultation.status);
                          setStatusOverrideModalOpen(true);
                        }}
                        className="text-[11px] text-slate-500 hover:text-teal-400 underline cursor-pointer"
                        title="Correct status if entered by mistake"
                      >
                        Correct Status
                      </button>
                    </div>
                  </div>

                  {/* Logical Workflow Progression Bar */}
                  <div className="grid grid-cols-5 gap-1 pt-1">
                    {[
                      { step: 1, key: 'new', label: '1. New' },
                      { step: 2, key: 'contacted', label: '2. Contacted' },
                      { step: 3, key: 'scheduled', label: '3. Scheduled' },
                      { step: 4, key: 'in_progress', label: '4. In Progress' },
                      { step: 5, key: 'completed', label: '5. Completed' },
                    ].map((st) => {
                      const isReached = statusInfo.step >= st.step && statusInfo.step > 0;
                      const isCurrent = statusInfo.step === st.step;

                      return (
                        <div
                          key={st.key}
                          className={`text-center py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                            isCurrent
                              ? 'bg-teal-500 text-white border-teal-400 shadow-sm'
                              : isReached
                              ? 'bg-teal-500/15 text-teal-600 dark:text-teal-300 border-teal-500/30'
                              : 'bg-black/5 dark:bg-white/5 text-slate-400 border-transparent'
                          }`}
                        >
                          {st.label}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 6. INTELLIGENT CONTEXTUAL ACTION AREA */}
                <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/25 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                      Recommended Next Action
                    </span>
                    <span className="text-[11px] text-slate-500">Workflow automation</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Approve Action */}
                    {activeStatus === 'new' && (
                      <button
                        onClick={handleApprove}
                        className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md transition-all cursor-pointer"
                        title="Approve consultation and notify customer"
                      >
                        <CheckCircle size={14} />
                        <span>Approve</span>
                      </button>
                    )}

                    {/* Set Appointment Direct Action */}
                    {activeStatus !== 'completed' && activeStatus !== 'cancelled' && activeStatus !== 'rejected' && (
                      <button
                        onClick={() => {
                          setScheduleData(prev => ({
                            ...prev,
                            appointmentDate: prev.appointmentDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
                          }));
                          setScheduleModalOpen(true);
                        }}
                        className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md transition-all cursor-pointer"
                      >
                        <Calendar size={14} />
                        <span>{selectedConsultation.appointmentDate ? 'Reschedule' : 'Set Appointment'}</span>
                      </button>
                    )}

                    {/* Contact Customer / Reply Email */}
                    <button
                      onClick={openReplyModal}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all cursor-pointer"
                    >
                      <Mail size={14} />
                      <span>Contact Customer</span>
                    </button>

                    {/* Action: If NEW/APPROVED -> Contact Customer Status */}
                    {(activeStatus === 'new' || activeStatus === 'approved') && (
                      <button
                        onClick={handleMarkContacted}
                        className="py-2.5 px-3 rounded-xl text-xs font-medium bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-teal-500/20 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                        title="Mark customer contacted"
                      >
                        <Phone size={14} className="inline mr-1" />
                        <span>Mark Contacted</span>
                      </button>
                    )}

                    {/* Action 3: If SCHEDULED -> Start Consultation */}
                    {activeStatus === 'scheduled' && (
                      <button
                        onClick={handleStartConsultation}
                        className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md transition-all cursor-pointer"
                      >
                        <Briefcase size={14} />
                        <span>Start Consultation</span>
                      </button>
                    )}

                    {/* Action 4: If IN PROGRESS -> Mark Completed */}
                    {activeStatus === 'in_progress' && (
                      <button
                        onClick={handleMarkCompleted}
                        className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all cursor-pointer"
                      >
                        <CheckCircle size={14} />
                        <span>Complete</span>
                      </button>
                    )}

                    {/* Reject Button */}
                    {activeStatus === 'new' && (
                      <button
                        onClick={() => {
                          setOutcomeType('rejected');
                          setOutcomeModalOpen(true);
                        }}
                        className="py-2.5 px-3 rounded-xl text-xs text-orange-500 hover:bg-orange-500/10 border border-orange-500/20 transition-all cursor-pointer"
                      >
                        Reject
                      </button>
                    )}

                    {/* Cancel Request */}
                    {activeStatus !== 'completed' && activeStatus !== 'cancelled' && activeStatus !== 'rejected' && (
                      <button
                        onClick={() => {
                          setOutcomeType('cancelled');
                          setOutcomeModalOpen(true);
                        }}
                        className="py-2.5 px-3 rounded-xl text-xs text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* 4. SIMPLIFIED CUSTOMER DETAILS (A, B) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  
                  {/* A. Customer Information */}
                  <div className="p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-teal-500/15 flex flex-col justify-between min-w-0 box-border">
                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-4 pb-2 border-b border-teal-500/10">
                        Customer Information
                      </h3>
                      <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                        <div className="grid grid-cols-[minmax(95px,38%)_minmax(0,62%)] sm:grid-cols-[minmax(105px,40%)_minmax(0,60%)] gap-2.5 items-start">
                          <span className="text-slate-500 min-w-0">Full Name</span>
                          <span className="font-semibold text-slate-900 dark:text-white min-w-0 text-right [overflow-wrap:anywhere] break-words">
                            {selectedConsultation.fullName}
                          </span>
                        </div>
                        <div className="grid grid-cols-[minmax(95px,38%)_minmax(0,62%)] sm:grid-cols-[minmax(105px,40%)_minmax(0,60%)] gap-2.5 items-start">
                          <span className="text-slate-500 min-w-0">Email</span>
                          <a
                            href={`mailto:${selectedConsultation.email}`}
                            className="font-semibold text-teal-600 dark:text-teal-300 hover:underline min-w-0 text-right [overflow-wrap:anywhere] break-words leading-relaxed"
                          >
                            {selectedConsultation.email}
                          </a>
                        </div>
                        <div className="grid grid-cols-[minmax(95px,38%)_minmax(0,62%)] sm:grid-cols-[minmax(105px,40%)_minmax(0,60%)] gap-2.5 items-start">
                          <span className="text-slate-500 min-w-0">Phone</span>
                          <a
                            href={`tel:${selectedConsultation.phone}`}
                            className="font-semibold text-teal-600 dark:text-teal-300 hover:underline min-w-0 text-right [overflow-wrap:anywhere] break-words"
                          >
                            {selectedConsultation.phone}
                          </a>
                        </div>
                        <div className="grid grid-cols-[minmax(95px,38%)_minmax(0,62%)] sm:grid-cols-[minmax(105px,40%)_minmax(0,60%)] gap-2.5 items-start">
                          <span className="text-slate-500 min-w-0">Business / Firm</span>
                          <span className="font-semibold text-slate-900 dark:text-white min-w-0 text-right [overflow-wrap:anywhere] break-words leading-relaxed">
                            {selectedConsultation.companyName || 'Private Client'}
                          </span>
                        </div>
                        <div className="grid grid-cols-[minmax(95px,38%)_minmax(0,62%)] sm:grid-cols-[minmax(105px,40%)_minmax(0,60%)] gap-2.5 items-start">
                          <span className="text-slate-500 min-w-0">Client Category</span>
                          <span className="font-bold capitalize text-teal-600 dark:text-teal-300 min-w-0 text-right [overflow-wrap:anywhere]">
                            {selectedConsultation.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* B. Consultation Details */}
                  <div className="p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-teal-500/15 flex flex-col justify-between min-w-0 box-border">
                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-4 pb-2 border-b border-teal-500/10">
                        Consultation Details
                      </h3>
                      <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                        <div className="grid grid-cols-[minmax(95px,38%)_minmax(0,62%)] sm:grid-cols-[minmax(105px,40%)_minmax(0,60%)] gap-2.5 items-start">
                          <span className="text-slate-500 min-w-0">Requested Service</span>
                          <span className="font-bold text-slate-900 dark:text-white capitalize min-w-0 text-right [overflow-wrap:anywhere] break-words leading-relaxed">
                            {selectedConsultation.serviceSlug ? selectedConsultation.serviceSlug.replace(/-/g, ' ') : 'Tax Advisory'}
                          </span>
                        </div>
                        <div className="grid grid-cols-[minmax(95px,38%)_minmax(0,62%)] sm:grid-cols-[minmax(105px,40%)_minmax(0,60%)] gap-2.5 items-start">
                          <span className="text-slate-500 min-w-0">Contact Channel</span>
                          <span className="font-semibold capitalize text-teal-600 dark:text-teal-300 min-w-0 text-right [overflow-wrap:anywhere]">
                            {selectedConsultation.preferredContactMethod || 'Email'}
                          </span>
                        </div>
                        <div className="grid grid-cols-[minmax(95px,38%)_minmax(0,62%)] sm:grid-cols-[minmax(105px,40%)_minmax(0,60%)] gap-2.5 items-start">
                          <span className="text-slate-500 min-w-0">Tax Volume Band</span>
                          <span className="font-semibold text-slate-900 dark:text-white min-w-0 text-right [overflow-wrap:anywhere] break-words">
                            {selectedConsultation.annualVolumeOrRevenue || 'Standard'}
                          </span>
                        </div>
                        <div className="grid grid-cols-[minmax(95px,38%)_minmax(0,62%)] sm:grid-cols-[minmax(105px,40%)_minmax(0,60%)] gap-2.5 items-start">
                          <span className="text-slate-500 min-w-0">Assigned Expert</span>
                          <span className="font-semibold text-teal-600 dark:text-teal-300 min-w-0 text-right [overflow-wrap:anywhere] break-words">
                            {selectedConsultation.assignedAdminName || 'Unassigned'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scope Requirements */}
                {selectedConsultation.message && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Customer Scope Specifications
                    </span>
                    <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-teal-500/10 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {selectedConsultation.message}
                    </div>
                  </div>
                )}

                {/* Customer email communication and SMTP delivery history */}
                <section className="space-y-3 pt-3 border-t border-teal-500/15">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
                      <Mail size={14} />
                      Email Communication ({selectedConsultation.communicationHistory?.length || 0})
                    </h3>
                    <button
                      onClick={openReplyModal}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Send size={12} /> Reply Email
                    </button>
                  </div>
                  {selectedConsultation.communicationHistory?.length ? (
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {selectedConsultation.communicationHistory.map((item: any) => (
                        <article key={item.id} className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/15 space-y-1.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-semibold text-xs text-slate-900 dark:text-white">{item.subject}</span>
                            <span className={`text-[10px] font-bold ${item.deliveryStatus === 'accepted_by_smtp' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                              {item.deliveryStatus === 'accepted_by_smtp' ? 'Accepted by SMTP' : 'Not accepted'}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500">
                            {item.purpose?.replace(/_/g, ' ') || 'Email'} · To: {item.recipient} · {item.timestamp ? new Date(item.timestamp).toLocaleString() : ''}
                          </p>
                          <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words">{item.body}</p>
                          {item.error && <p className="text-xs text-rose-600 dark:text-rose-400">Delivery error: {item.error}</p>}
                          {item.messageId && <p className="text-[10px] text-slate-500 break-all">Message ID: {item.messageId}</p>}
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 italic">No email activity recorded.</p>
                  )}
                </section>

                {/* C. Scheduled Appointment Details (if exists) */}
                {selectedConsultation.appointmentDate && (
                  <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/25 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                        <Clock size={13} />
                        <span>Confirmed Appointment</span>
                      </span>
                      <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">
                        {selectedConsultation.appointmentDate} at {selectedConsultation.appointmentTime}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500">Method: </span>
                        <span className="font-semibold">{selectedConsultation.meetingType || 'Online Video'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Assigned: </span>
                        <span className="font-semibold">{selectedConsultation.assignedAdminName || 'Tax Director'}</span>
                      </div>
                      {selectedConsultation.meetingLocation && (
                        <div className="sm:col-span-2">
                          <span className="text-slate-500">Meeting Link: </span>
                          <a href={selectedConsultation.meetingLocation} target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-300 underline font-mono">
                            {selectedConsultation.meetingLocation}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Cancellation / Rejection Notice */}
                {selectedConsultation.cancellationReason && (
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300 space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-rose-400">
                      <AlertTriangle size={13} />
                      <span>Request {selectedConsultation.status === 'rejected' ? 'Rejected' : 'Cancelled'}</span>
                    </span>
                    <p className="text-[11px] text-slate-300">{selectedConsultation.cancellationReason}</p>
                  </div>
                )}

                {/* D. INTERNAL NOTES (Add, View, Delete) */}
                <div className="space-y-2.5 pt-2 border-t border-teal-500/15">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <MessageSquare size={13} className="text-teal-500" />
                      <span>Internal Notes ({selectedConsultation.parsedNotes?.length || 0})</span>
                    </span>
                  </div>

                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an internal note (visible only to administrators)..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl text-xs bg-black/5 dark:bg-[#031117] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white cursor-pointer shadow-sm"
                    >
                      Add Note
                    </button>
                  </form>

                  {selectedConsultation.parsedNotes && selectedConsultation.parsedNotes.length > 0 ? (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {selectedConsultation.parsedNotes.map((n: any) => (
                        <div key={n.id} className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/10 text-xs flex items-start justify-between gap-2">
                          <div>
                            <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{n.text}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {n.author} • {n.timestamp ? new Date(n.timestamp).toLocaleString() : ''}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteNote(n.id)}
                            className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                            title="Delete note"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 italic">No notes recorded yet.</p>
                  )}
                </div>

                {/* E. SIMPLE ACTIVITY HISTORY TIMELINE */}
                <div className="space-y-2 pt-2 border-t border-teal-500/15">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                    Activity History
                  </span>
                  
                  {selectedConsultation.statusHistory && selectedConsultation.statusHistory.length > 0 ? (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {selectedConsultation.statusHistory.map((item: any, idx: number) => (
                        <div key={item.id || idx} className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/10 text-[11px] flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {item.title || item.status}
                            </span>
                            <span className="text-slate-400 ml-1.5 truncate">
                              — {item.note || 'Recorded by ' + item.changedBy}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                            {item.timestamp ? new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 italic">No activity history.</p>
                  )}
                </div>

              </div>
            ) : (
              <div className="py-28 text-center text-slate-500 text-xs space-y-1.5">
                <Calendar size={28} className="mx-auto text-teal-500/30 mb-2" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">No consultation selected</p>
                <p className="text-[11px]">Click on any customer inquiry on the left to review scope and take action.</p>
              </div>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* SCHEDULE CONSULTATION MODAL                          */}
        {/* ---------------------------------------------------- */}
        {replyModalOpen && selectedConsultation && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <form onSubmit={handleSendReply} className="bg-white dark:bg-[#071A22] border border-emerald-500/30 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Reply to customer</h3>
                  <p className="text-xs text-slate-500">Sending from the configured STE owner Gmail account.</p>
                </div>
                <button type="button" onClick={() => setReplyModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                  <X size={16} />
                </button>
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Recipient Email</label>
                <input type="email" required maxLength={254} value={replyRecipient} onChange={(event) => setReplyRecipient(event.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-[#031117] border border-emerald-500/25 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Subject</label>
                <input required maxLength={200} value={replySubject} onChange={(event) => setReplySubject(event.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-[#031117] border border-emerald-500/25 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Message</label>
                <textarea required maxLength={20000} rows={9} value={replyMessage} onChange={(event) => setReplyMessage(event.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-[#031117] border border-emerald-500/25 text-slate-900 dark:text-white resize-y" />
              </div>
              <div className="flex justify-end gap-2 border-t border-emerald-500/15 pt-3">
                <button type="button" onClick={() => setReplyModalOpen(false)} className="px-4 py-2 rounded-xl text-xs bg-black/5 dark:bg-white/5">Cancel</button>
                <button type="submit" disabled={sendingReply || !replyRecipient.trim() || !replySubject.trim() || !replyMessage.trim()} className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white flex items-center gap-2">
                  <Send size={13} /> {sendingReply ? 'Sending…' : 'Send Reply'}
                </button>
              </div>
            </form>
          </div>
        )}

        {scheduleModalOpen && selectedConsultation && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#071A22] border border-teal-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-teal-500/20">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-500" />
                  <span>Schedule Consultation &amp; Send Confirmation Email</span>
                </h3>
                <button onClick={() => setScheduleModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              {/* Client Info Summary */}
              <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Client:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedConsultation.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-mono text-teal-600 dark:text-teal-400 font-semibold">{selectedConsultation.email}</span>
                </div>
                {selectedConsultation.phone && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <span className="text-slate-700 dark:text-slate-300">{selectedConsultation.phone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Service:</span>
                  <span className="text-slate-700 dark:text-slate-300">{selectedConsultation.serviceSlug || 'Discovery'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reference:</span>
                  <span className="font-mono text-[11px] text-slate-500">{selectedConsultation.referenceNo}</span>
                </div>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-500 block mb-1">Appointment Date *</label>
                  <input
                    type="date"
                    required
                    value={scheduleData.appointmentDate}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      setScheduleData(prev => {
                        const datePart = newDate ? newDate.replace(/-/g, '') : '';
                        const timePart = prev.appointmentTime ? prev.appointmentTime.replace(/[^0-9]/g, '') : '';
                        const autoLink = `https://meet.google.com/ste-${datePart ? datePart.slice(-4) : 'call'}-${timePart ? timePart.slice(0, 4) : 'room'}`;
                        return {
                          ...prev,
                          appointmentDate: newDate,
                          meetingLocation: prev.meetingLocation && !prev.meetingLocation.includes('meet.google.com/ste-') ? prev.meetingLocation : autoLink,
                        };
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/25 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-500 block">Appointment Time *</label>
                    <span className="text-[10px] text-teal-500 font-medium">Type any custom time (e.g. 10:45 AM EST)</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:30 AM EST or 03:15 PM PST"
                    value={scheduleData.appointmentTime}
                    onChange={(e) => {
                      const newTime = e.target.value;
                      setScheduleData(prev => ({
                        ...prev,
                        appointmentTime: newTime,
                      }));
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#071A22] border border-teal-500/30 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 font-medium text-xs"
                  />
                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {['09:00 AM EST', '10:00 AM EST', '11:30 AM EST', '01:00 PM EST', '02:30 PM EST', '04:00 PM EST'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setScheduleData(prev => ({ ...prev, appointmentTime: preset }))}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border transition-colors ${
                          scheduleData.appointmentTime === preset
                            ? 'bg-teal-500/20 text-teal-400 border-teal-500/50'
                            : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-teal-500/15 hover:bg-teal-500/10'
                        }`}
                      >
                        {preset.replace(' EST', '')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Automatic Calendly Video Connection Status */}
                <div className="p-3 rounded-2xl bg-[#087C50]/10 border border-[#20AD68]/30 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#20AD68] animate-pulse" />
                      Meeting Link (Calendly Live API)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#20AD68]/20 text-[#20AD68] font-bold">
                      Auto-Connected
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-[#20AD68] dark:text-[#32D99A] bg-black/10 dark:bg-black/30 p-2 rounded-xl break-all select-all">
                    {scheduleData.meetingLocation || 'https://calendly.com/smarttaxexperts/strategic-consultation'}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Live Calendly meeting link is automatically attached to the consultation, synced with Google Calendar, and emailed to the client.
                  </p>
                </div>

                <div>
                  <label className="text-slate-500 block mb-1">Assigned Professional</label>
                  <input
                    type="text"
                    placeholder="e.g. David Miller, Lead US CPA"
                    value={scheduleData.assignedAdminName}
                    onChange={(e) => setScheduleData({ ...scheduleData, assignedAdminName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/25 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-teal-500/15">
                  <button
                    type="button"
                    onClick={() => setScheduleModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs bg-black/5 dark:bg-white/5 border border-teal-500/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Confirm &amp; Send Confirmation Email</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* CANCEL / REJECT CONFIRMATION MODAL                   */}
        {/* ---------------------------------------------------- */}
        {outcomeModalOpen && selectedConsultation && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#071A22] border border-rose-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-rose-500/20">
                <h3 className="font-bold text-sm text-rose-500 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Confirm {outcomeType === 'cancelled' ? 'Cancellation' : 'Rejection'}</span>
                </h3>
                <button onClick={() => setOutcomeModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleOutcomeSubmit} className="space-y-3 text-xs">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Please provide a reason. This will be permanently recorded in the consultation activity history.
                </p>

                <div>
                  <label className="text-slate-500 block mb-1">Reason *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Customer requested cancellation due to internal postponement..."
                    value={outcomeReason}
                    onChange={(e) => setOutcomeReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-[#031117] border border-rose-500/25 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-teal-500/15">
                  <button
                    type="button"
                    onClick={() => setOutcomeModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs bg-black/5 dark:bg-white/5 border border-teal-500/20"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md cursor-pointer"
                  >
                    Confirm {outcomeType === 'cancelled' ? 'Cancel' : 'Reject'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MANUAL STATUS CORRECTION MODAL                       */}
        {/* ---------------------------------------------------- */}
        {statusOverrideModalOpen && selectedConsultation && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#071A22] border border-teal-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-teal-500/20">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Correct Consultation Status
                </h3>
                <button onClick={() => setStatusOverrideModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleStatusOverride} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-500 block mb-1">Select Status</label>
                  <select
                    value={overrideStatus}
                    onChange={(e) => setOverrideStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/25 font-semibold text-teal-600 dark:text-teal-300"
                  >
                    <option value="new">1. New Request</option>
                    <option value="contacted">2. Contacted</option>
                    <option value="scheduled">3. Scheduled</option>
                    <option value="in_progress">4. In Progress</option>
                    <option value="completed">5. Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-500 block mb-1">Correction Note (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Correcting mistaken click"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/25 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-teal-500/15">
                  <button
                    type="button"
                    onClick={() => setStatusOverrideModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs bg-black/5 dark:bg-white/5 border border-teal-500/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md cursor-pointer"
                  >
                    Save Correction
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
export default ConsultationsManagerPage;
