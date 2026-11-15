import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  Building,
  User,
  Calendar,
  Clock,
  Send,
  Trash2,
  Archive,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock3,
  HelpCircle,
  ShieldAlert,
  UserCheck,
  Plus,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  FileText,
  Activity,
  History,
  Info,
  X,
  Check,
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import {
  inquiriesApi,
  ContactInquiry,
  InquiryAnalytics,
  InquiryNote,
  StatusHistoryItem,
  ActivityLogItem,
  CommunicationItem,
} from '../../api/inquiries';

// 6 Core Status Badges
const STATUS_CONFIG: Record<
  string,
  { label: string; badgeCls: string; dotCls: string; icon: any; borderCls: string }
> = {
  new: {
    label: 'New',
    badgeCls: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    dotCls: 'bg-cyan-400',
    icon: AlertCircle,
    borderCls: 'border-cyan-500/40',
  },
  in_progress: {
    label: 'In Progress',
    badgeCls: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    dotCls: 'bg-amber-400',
    icon: Clock3,
    borderCls: 'border-amber-500/40',
  },
  waiting_response: {
    label: 'Waiting Response',
    badgeCls: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    dotCls: 'bg-purple-400',
    icon: HelpCircle,
    borderCls: 'border-purple-500/40',
  },
  responded: {
    label: 'Responded',
    badgeCls: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    dotCls: 'bg-blue-400',
    icon: Send,
    borderCls: 'border-blue-500/40',
  },
  closed: {
    label: 'Closed',
    badgeCls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    dotCls: 'bg-emerald-400',
    icon: CheckCircle2,
    borderCls: 'border-emerald-500/40',
  },
  spam: {
    label: 'Spam',
    badgeCls: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    dotCls: 'bg-rose-400',
    icon: ShieldAlert,
    borderCls: 'border-rose-500/40',
  },
};

export function ContactInquiriesPage() {
  // State
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [analytics, setAnalytics] = useState<InquiryAnalytics | null>(null);
  const [admins, setAdmins] = useState<{ id: string; name: string; email: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filters & Pagination
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeframeFilter, setTimeframeFilter] = useState<string>('all');
  const [adminFilter, setAdminFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('newest');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Tab in Right Panel: 'details' | 'timeline' | 'communication'
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'communication'>('details');

  // New Note
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  // Email Reply Modal / Form
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyRecipient, setReplyRecipient] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Status Change Dialog Note
  const [statusChangeNote, setStatusChangeNote] = useState('');
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  // Fetch Analytics & Admins once on mount
  useEffect(() => {
    loadAnalytics();
    loadAdmins();
  }, []);

  // Fetch Inquiries when filters change
  useEffect(() => {
    fetchInquiries();
  }, [page, statusFilter, timeframeFilter, adminFilter, sortOption]);

  const loadAnalytics = async () => {
    try {
      const data = await inquiriesApi.getAnalytics();
      setAnalytics(data);
    } catch (e) {
      console.error('Failed to load analytics', e);
    }
  };

  const loadAdmins = async () => {
    try {
      const data = await inquiriesApi.getAdmins();
      setAdmins(data);
    } catch (e) {
      console.error('Failed to load admins', e);
    }
  };

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 25,
        sort: sortOption,
      };

      if (statusFilter !== 'all') params.status = statusFilter;
      if (timeframeFilter !== 'all') params.timeframe = timeframeFilter;
      if (adminFilter === 'unassigned') {
        params.unassigned = true;
      } else if (adminFilter !== 'all') {
        params.adminId = adminFilter;
      }
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res: any = await inquiriesApi.getAll(params);
      const list = res.inquiries || [];
      setInquiries(list);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.total || 0);

      // Select first inquiry if none selected or selection not in new list
      if (list.length > 0) {
        if (!selectedInquiry || !list.some((item: any) => item.id === selectedInquiry.id)) {
          setSelectedInquiry(list[0]);
        } else {
          // Refresh selected inquiry with latest data
          const updatedSelected = list.find((item: any) => item.id === selectedInquiry.id);
          if (updatedSelected) setSelectedInquiry(updatedSelected);
        }
      } else {
        setSelectedInquiry(null);
      }
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchInquiries();
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setTimeframeFilter('all');
    setAdminFilter('all');
    setSearchQuery('');
    setSortOption('newest');
    setPage(1);
  };

  // Status Update
  const handleStatusChange = async (newStatus: string) => {
    if (!selectedInquiry) return;
    setSubmitting(true);
    try {
      const res: any = await inquiriesApi.updateStatus(
        selectedInquiry.id,
        newStatus,
        statusChangeNote || undefined
      );
      setSelectedInquiry((prev) => (prev ? { ...prev, ...res } : null));
      setStatusChangeNote('');
      setPendingStatus(null);
      await fetchInquiries();
      await loadAnalytics();
    } catch (err: any) {
      alert('Failed to update status: ' + (err.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  // Assign Admin
  const handleAssignAdmin = async (adminId: string) => {
    if (!selectedInquiry) return;
    setSubmitting(true);
    try {
      const assignedId = adminId === 'unassign' ? null : adminId;
      const res: any = await inquiriesApi.assign(selectedInquiry.id, assignedId);
      setSelectedInquiry((prev) => (prev ? { ...prev, ...res } : null));
      await fetchInquiries();
      await loadAnalytics();
    } catch (err: any) {
      alert('Failed to assign admin: ' + (err.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  // Add Internal Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !noteText.trim()) return;
    setAddingNote(true);
    try {
      const newNote = await inquiriesApi.addNote(selectedInquiry.id, noteText.trim());
      setSelectedInquiry((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          notes: [newNote, ...(prev.notes || [])],
        };
      });
      setNoteText('');
      // refresh inquiry list in background
      fetchInquiries();
    } catch (err: any) {
      alert('Failed to add note: ' + (err.message || 'Unknown error'));
    } finally {
      setAddingNote(false);
    }
  };

  // Delete Note
  const handleDeleteNote = async (noteId: string) => {
    if (!selectedInquiry || !confirm('Are you sure you want to delete this internal note?')) return;
    try {
      await inquiriesApi.deleteNote(selectedInquiry.id, noteId);
      setSelectedInquiry((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          notes: (prev.notes || []).filter((n) => n.id !== noteId),
        };
      });
    } catch (err: any) {
      alert('Failed to delete note: ' + (err.message || 'Unknown error'));
    }
  };

  // Open Reply Box with Template
  const handleOpenReplyBox = () => {
    if (!selectedInquiry) return;
    setReplyRecipient(selectedInquiry.email);
    setReplySubject(`Re: [${selectedInquiry.inquiryNumber || 'STE'}] ${selectedInquiry.subject || selectedInquiry.inquiryType}`);
    setReplyMessage(
      `Dear ${selectedInquiry.name},\n\nThank you for contacting Smart Tax Experts. Regarding your inquiry on "${selectedInquiry.inquiryType}":\n\n[Please enter your response here]\n\nBest regards,\nSmart Tax Experts Advisory Practice\nhttps://smarttaxexperts.com`
    );
    setShowReplyBox(true);
  };

  // Send Reply Email
  const handleSendReply = async () => {
    if (!selectedInquiry || !replyRecipient.trim() || !replySubject.trim() || !replyMessage.trim()) return;
    setSendingReply(true);
    try {
      const res: any = await inquiriesApi.reply(selectedInquiry.id, {
        to: replyRecipient.trim(),
        subject: replySubject.trim(),
        message: replyMessage.trim(),
        updateStatusToResponded: true,
      });
      alert('Email reply sent successfully!');
      setShowReplyBox(false);
      setReplyRecipient('');
      setReplySubject('');
      setReplyMessage('');
      if (res.inquiry) {
        setSelectedInquiry((prev) => (prev ? { ...prev, ...res.inquiry } : null));
      }
      await fetchInquiries();
      await loadAnalytics();
    } catch (err: any) {
      const history = err?.response?.data?.communicationHistory;
      if (Array.isArray(history)) {
        setSelectedInquiry((current) => current ? { ...current, communicationHistory: history } : null);
      }
      alert('Failed to send email: ' + (err.message || 'Unknown error'));
    } finally {
      setSendingReply(false);
    }
  };

  // Archive / Soft Delete
  const handleToggleArchive = async () => {
    if (!selectedInquiry) return;
    const nextArchived = !selectedInquiry.isArchived;
    if (nextArchived && !confirm('Archive this inquiry? It will be hidden from the active inbox.')) {
      return;
    }
    try {
      await inquiriesApi.toggleArchive(selectedInquiry.id, nextArchived);
      await fetchInquiries();
      await loadAnalytics();
    } catch (err: any) {
      alert('Failed to update archive status: ' + (err.message || 'Error'));
    }
  };

  // Copy Reference / Email
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper date formatter
  const formatDate = (isoString?: string | null) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '—';
    }
  };

  const getStatusBadge = (statusKey: string) => {
    const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.new;
    const Icon = cfg.icon;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize ${cfg.badgeCls}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotCls}`} />
        <span>{cfg.label}</span>
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-teal-500/10 border border-teal-500/25 text-teal-600 dark:text-teal-400">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                  Contact Inquiries
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                    {totalCount} Total
                  </span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Live inquiry queue, admin routing, internal audit notes &amp; direct customer communication
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                fetchInquiries();
                loadAnalytics();
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0B2530] border border-slate-200 dark:border-teal-500/20 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white hover:border-teal-500/40 text-xs font-semibold transition-all cursor-pointer shadow-sm"
              title="Refresh Queue"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin text-teal-500' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Analytics Metric Cards Bar */}
        {analytics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {[
              {
                id: 'all',
                label: 'All Inquiries',
                count: analytics.total,
                color: 'text-slate-900 dark:text-white',
                border: 'border-slate-200 dark:border-white/10',
                bg: 'bg-white/80 dark:bg-[#0B2530]/60',
              },
              {
                id: 'new',
                label: 'New',
                count: analytics.new,
                color: 'text-cyan-600 dark:text-cyan-400',
                border: 'border-cyan-500/30',
                bg: 'bg-cyan-500/10 dark:bg-cyan-500/5',
              },
              {
                id: 'in_progress',
                label: 'In Progress',
                count: analytics.inProgress,
                color: 'text-amber-600 dark:text-amber-400',
                border: 'border-amber-500/30',
                bg: 'bg-amber-500/10 dark:bg-amber-500/5',
              },
              {
                id: 'waiting_response',
                label: 'Waiting',
                count: analytics.waitingResponse,
                color: 'text-purple-600 dark:text-purple-300',
                border: 'border-purple-500/30',
                bg: 'bg-purple-500/10 dark:bg-purple-500/5',
              },
              {
                id: 'responded',
                label: 'Responded',
                count: analytics.responded,
                color: 'text-blue-600 dark:text-blue-400',
                border: 'border-blue-500/30',
                bg: 'bg-blue-500/10 dark:bg-blue-500/5',
              },
              {
                id: 'closed',
                label: 'Closed',
                count: analytics.closed,
                color: 'text-emerald-600 dark:text-emerald-400',
                border: 'border-emerald-500/30',
                bg: 'bg-emerald-500/10 dark:bg-emerald-500/5',
              },
              {
                id: 'spam',
                label: 'Spam',
                count: analytics.spam,
                color: 'text-rose-600 dark:text-rose-400',
                border: 'border-rose-500/30',
                bg: 'bg-rose-500/10 dark:bg-rose-500/5',
              },
              {
                id: 'unassigned',
                label: 'Unassigned',
                count: analytics.unassigned,
                color: 'text-slate-600 dark:text-slate-300',
                border: 'border-slate-300 dark:border-slate-500/30',
                bg: 'bg-slate-100 dark:bg-slate-500/5',
              },
            ].map((metric) => {
              const isActive =
                metric.id === 'unassigned'
                  ? adminFilter === 'unassigned'
                  : statusFilter === metric.id;

              return (
                <button
                  key={metric.id}
                  onClick={() => {
                    if (metric.id === 'unassigned') {
                      setAdminFilter(adminFilter === 'unassigned' ? 'all' : 'unassigned');
                      setStatusFilter('all');
                    } else {
                      setStatusFilter(metric.id);
                      if (adminFilter === 'unassigned') setAdminFilter('all');
                    }
                    setPage(1);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer shadow-sm ${
                    metric.bg
                  } ${metric.border} ${
                    isActive
                      ? 'ring-2 ring-teal-500 border-teal-500 bg-teal-500/15 shadow-lg'
                      : 'hover:border-teal-500/40'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block truncate uppercase tracking-wider">
                    {metric.label}
                  </span>
                  <span className={`text-xl font-black ${metric.color} block mt-0.5`}>
                    {metric.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="bg-white/90 dark:bg-[#0B2530]/80 border border-slate-200 dark:border-teal-500/15 rounded-2xl p-3.5 space-y-3 shadow-md dark:shadow-none">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-2.5 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email, phone, company, reference ID or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#071A22] border border-slate-300 dark:border-teal-500/20 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-auto px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#071A22] border border-slate-300 dark:border-teal-500/20 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting_response">Waiting Response</option>
              <option value="responded">Responded</option>
              <option value="closed">Closed</option>
              <option value="spam">Spam</option>
            </select>

            {/* Timeframe Dropdown */}
            <select
              value={timeframeFilter}
              onChange={(e) => {
                setTimeframeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-auto px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#071A22] border border-slate-300 dark:border-teal-500/20 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
            </select>

            {/* Admin Assignment Filter */}
            <select
              value={adminFilter}
              onChange={(e) => {
                setAdminFilter(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-auto px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#071A22] border border-slate-300 dark:border-teal-500/20 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="all">All Assignees</option>
              <option value="unassigned">Unassigned Only</option>
              {admins.map((adm) => (
                <option key={adm.id} value={adm.id}>
                  {adm.name}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-auto px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#071A22] border border-slate-300 dark:border-teal-500/20 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="updated">Recently Updated</option>
              <option value="name_asc">Name (A-Z)</option>
            </select>

            <button
              type="submit"
              className="w-full md:w-auto px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Filter
            </button>

            {(statusFilter !== 'all' ||
              timeframeFilter !== 'all' ||
              adminFilter !== 'all' ||
              searchQuery ||
              sortOption !== 'newest') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="w-full md:w-auto px-3 py-2 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 font-medium text-xs transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Master-Detail Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Inquiry Queue */}
          <div className="lg:col-span-5 bg-white/90 dark:bg-[#0B2530]/70 border border-slate-200 dark:border-teal-500/15 rounded-3xl p-3.5 backdrop-blur-xl shadow-xl flex flex-col min-h-[640px]">
            <div className="flex items-center justify-between px-2.5 py-2 border-b border-slate-200 dark:border-teal-500/15 mb-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Inquiries Queue ({totalCount})
              </span>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                Page {page} of {totalPages}
              </span>
            </div>

            <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[620px] pr-1 custom-scrollbar">
              {loading && inquiries.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 rounded-2xl bg-black/5 dark:bg-white/5 border border-slate-200 dark:border-teal-500/10 animate-pulse"
                  />
                ))
              ) : inquiries.length === 0 ? (
                <div className="py-20 text-center text-slate-500 dark:text-slate-400 text-xs space-y-2">
                  <Mail className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-500 opacity-50" />
                  <p>No contact inquiries found matching criteria.</p>
                  <button
                    onClick={handleClearFilters}
                    className="text-teal-600 dark:text-teal-400 underline font-semibold cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                inquiries.map((item) => {
                  const isSelected = selectedInquiry?.id === item.id;
                  const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.new;

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedInquiry(item)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-teal-500/15 border-teal-500 shadow-md ring-1 ring-teal-500/50'
                          : 'bg-slate-50/90 dark:bg-[#071A22]/90 border-slate-200 dark:border-teal-500/10 hover:border-teal-500/30'
                      }`}
                    >
                      {/* Unread indicator */}
                      {!item.isRead && (
                        <span
                          className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-500 rounded-full ring-4 ring-white dark:ring-[#071A22]"
                          title="Unread"
                        />
                      )}

                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                            {item.name}
                          </span>
                          {item.inquiryNumber && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                              {item.inquiryNumber}
                            </span>
                          )}
                        </div>
                        {getStatusBadge(item.status)}
                      </div>

                      {/* Snippet */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-2 font-normal leading-relaxed">
                        {item.message}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/5 pt-2">
                        <span className="truncate max-w-[150px]">
                          {item.organization || item.inquiryType || 'General'}
                        </span>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>

                      {/* Assigned Admin Footer if any */}
                      {item.assignedAdminName && (
                        <div className="mt-1.5 text-[10px] text-teal-600 dark:text-teal-400/90 flex items-center gap-1">
                          <UserCheck size={11} />
                          <span>Assigned: {item.assignedAdminName}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200 dark:border-teal-500/15 text-xs">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#071A22] border border-slate-300 dark:border-teal-500/20 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  {page} / {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#071A22] border border-slate-300 dark:border-teal-500/20 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Complete Inquiry Detail View */}
          <div className="lg:col-span-7 bg-white/95 dark:bg-[#0B2530]/80 border border-slate-200 dark:border-teal-500/20 rounded-3xl p-5 sm:p-7 backdrop-blur-xl shadow-xl space-y-6 min-h-[640px]">
            {selectedInquiry ? (
              <div className="space-y-6">
                {/* Header Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-teal-500/15">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-slate-900 dark:text-white">{selectedInquiry.name}</h2>
                      {selectedInquiry.inquiryNumber && (
                        <button
                          onClick={() => copyToClipboard(selectedInquiry.inquiryNumber!, 'inqNum')}
                          className="px-2 py-0.5 rounded-md bg-teal-500/15 text-teal-700 dark:text-teal-300 font-mono text-xs border border-teal-500/30 flex items-center gap-1 hover:bg-teal-500/25 transition-colors cursor-pointer"
                          title="Click to copy inquiry ID"
                        >
                          <span>{selectedInquiry.inquiryNumber}</span>
                          {copiedId === 'inqNum' ? <Check size={11} /> : <Copy size={11} />}
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Received {formatDate(selectedInquiry.createdAt)} &bull; Source:{' '}
                      <span className="text-teal-600 dark:text-teal-400 font-medium">{selectedInquiry.sourcePage || '/contact'}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={handleOpenReplyBox}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <Send size={13} />
                      <span>Reply Email</span>
                    </button>

                    <button
                      onClick={handleToggleArchive}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-[#071A22] border border-slate-300 dark:border-teal-500/20 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-teal-500/40 transition-colors cursor-pointer"
                      title={selectedInquiry.isArchived ? 'Restore inquiry' : 'Archive inquiry'}
                    >
                      <Archive size={14} />
                    </button>
                  </div>
                </div>

                {/* Status & Assignment Quick Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071A22]/90 border border-slate-200 dark:border-teal-500/15">
                  {/* Status Dropdown */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                      Current Status
                    </label>
                    <select
                      value={selectedInquiry.status}
                      disabled={submitting}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0B2530] border border-slate-300 dark:border-teal-500/30 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="waiting_response">Waiting for Response</option>
                      <option value="responded">Responded</option>
                      <option value="closed">Closed / Resolved</option>
                      <option value="spam">Spam / Junk</option>
                    </select>
                  </div>

                  {/* Assign to Admin Dropdown */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                      Assigned Administrator
                    </label>
                    <select
                      value={selectedInquiry.assignedAdminId || 'unassign'}
                      disabled={submitting}
                      onChange={(e) => handleAssignAdmin(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0B2530] border border-slate-300 dark:border-teal-500/30 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                    >
                      <option value="unassign">Unassigned</option>
                      {admins.map((adm) => (
                        <option key={adm.id} value={adm.id}>
                          {adm.name} ({adm.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Navigation Tabs for Right Detail Section */}
                <div className="flex border-b border-slate-200 dark:border-teal-500/15 gap-4">
                  {[
                    { id: 'details', label: 'Inquiry & Contact', icon: User },
                    { id: 'timeline', label: 'Audit Timeline', icon: Activity },
                    { id: 'communication', label: 'Email Communication', icon: MessageSquare },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`pb-2.5 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border-b-2 ${
                          isActive
                            ? 'text-teal-600 dark:text-teal-400 border-teal-500'
                            : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        <Icon size={14} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* TAB 1: DETAILS & CONTACT */}
                {activeTab === 'details' && (
                  <div className="space-y-5">
                    {/* Customer Info 2-Column Responsive Card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071A22] border border-slate-200 dark:border-teal-500/10">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                          Direct Email
                        </span>
                        <a
                          href={`mailto:${selectedInquiry.email}`}
                          className="text-xs text-teal-600 dark:text-teal-300 font-semibold hover:underline flex items-center gap-1.5 [overflow-wrap:anywhere] break-words"
                        >
                          <Mail size={13} className="shrink-0" />
                          <span>{selectedInquiry.email}</span>
                        </a>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071A22] border border-slate-200 dark:border-teal-500/10">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                          Direct Phone
                        </span>
                        {selectedInquiry.phone ? (
                          <a
                            href={`tel:${selectedInquiry.phone}`}
                            className="text-xs text-slate-900 dark:text-white font-semibold hover:text-teal-600 dark:hover:text-teal-300 flex items-center gap-1.5 [overflow-wrap:anywhere] break-words"
                          >
                            <Phone size={13} className="shrink-0 text-slate-400" />
                            <span>{selectedInquiry.phone}</span>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 dark:text-slate-500">Not provided</span>
                        )}
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071A22] border border-slate-200 dark:border-teal-500/10">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                          Company / Organization
                        </span>
                        <span className="text-xs text-slate-800 dark:text-white font-semibold flex items-center gap-1.5 [overflow-wrap:anywhere] break-words">
                          <Building size={13} className="shrink-0 text-slate-400" />
                          <span>{selectedInquiry.organization || 'Individual / Non-disclosed'}</span>
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071A22] border border-slate-200 dark:border-teal-500/10">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                          Inquiry Classification
                        </span>
                        <span className="text-xs text-teal-600 dark:text-teal-300 font-semibold">
                          {selectedInquiry.inquiryType || 'General Consultation'}
                        </span>
                      </div>

                      {/* Requested Services Badges if present */}
                      {selectedInquiry.subject && selectedInquiry.subject !== 'General Enquiry' && (
                        <div className="md:col-span-2 p-3.5 rounded-2xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/20">
                          <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block mb-2">
                            Requested Services / Interests
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedInquiry.subject.split(',').map((srv, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-[#071A22] text-teal-700 dark:text-teal-300 border border-teal-500/30 shadow-xs"
                              >
                                {srv.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Untruncated Original Message */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Full Inquiry Message
                        </span>
                        <button
                          onClick={() => copyToClipboard(selectedInquiry.message, 'msgCopy')}
                          className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                        >
                          {copiedId === 'msgCopy' ? 'Copied!' : 'Copy Text'}
                        </button>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071A22] border border-slate-200 dark:border-teal-500/15 text-slate-800 dark:text-slate-200 text-xs leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere] break-words font-sans">
                        {selectedInquiry.message}
                      </div>
                    </div>

                    {/* Internal Team Notes Section */}
                    <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-teal-500/15">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Internal Administrative Notes ({selectedInquiry.notes?.length || 0})
                      </span>

                      {/* Add Note Form */}
                      <form onSubmit={handleAddNote} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add internal note for advisory team..."
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#071A22] border border-slate-300 dark:border-teal-500/20 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={addingNote || !noteText.trim()}
                          className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs disabled:opacity-40 transition-colors cursor-pointer shadow-sm"
                        >
                          {addingNote ? 'Saving...' : 'Add Note'}
                        </button>
                      </form>

                      {/* Note List */}
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {selectedInquiry.notes && selectedInquiry.notes.length > 0 ? (
                          selectedInquiry.notes.map((note) => (
                            <div
                              key={note.id}
                              className="p-3 rounded-xl bg-slate-50 dark:bg-[#071A22] border border-slate-200 dark:border-teal-500/10 flex items-start justify-between gap-3 text-xs"
                            >
                              <div className="space-y-1">
                                <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap [overflow-wrap:anywhere] break-words">
                                  {note.note}
                                </p>
                                <span className="text-[10px] text-slate-500 block">
                                  By <strong className="text-teal-600 dark:text-teal-400">{note.authorName}</strong> &bull;{' '}
                                  {formatDate(note.createdAt)}
                                </span>
                              </div>
                              <button
                                onClick={() => handleDeleteNote(note.id)}
                                className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                                title="Delete Note"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="py-4 text-center text-slate-500 text-xs italic">
                            No internal notes added yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: AUDIT TIMELINE */}
                {activeTab === 'timeline' && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Chronological Activity Audit Trail
                    </span>

                    <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-teal-500/20">
                      {selectedInquiry.activityLogs && selectedInquiry.activityLogs.length > 0 ? (
                        selectedInquiry.activityLogs.map((act) => (
                          <div key={act.id} className="relative group text-xs">
                            <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-teal-400 ring-4 ring-white dark:ring-[#0B2530]" />
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#071A22] border border-slate-200 dark:border-teal-500/10 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-teal-600 dark:text-teal-400 text-[11px] uppercase tracking-wide">
                                  {act.action.replace('_', ' ')}
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                  {formatDate(act.timestamp)}
                                </span>
                              </div>
                              <p className="text-slate-800 dark:text-slate-300">{act.description}</p>
                              <span className="text-[10px] text-slate-500 block">
                                Performed by: {act.performedBy}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center text-slate-500 text-xs italic">
                          No audit activity logs recorded yet.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: EMAIL COMMUNICATION */}
                {activeTab === 'communication' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Email Logs & Dispatches ({selectedInquiry.communicationHistory?.length || 0})
                      </span>
                      <button
                        onClick={handleOpenReplyBox}
                        className="px-3 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Send size={12} />
                        <span>Compose Email</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {selectedInquiry.communicationHistory &&
                      selectedInquiry.communicationHistory.length > 0 ? (
                        selectedInquiry.communicationHistory.map((comm) => (
                          <div
                            key={comm.id}
                            className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071A22] border border-slate-200 dark:border-teal-500/15 space-y-2 text-xs"
                          >
                            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white block">{comm.subject}</span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                  To: {comm.recipient} &bull; From: {comm.sender}
                                </span>
                              </div>
                              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">
                                {formatDate(comm.timestamp)}
                              </span>
                            </div>
                            {comm.deliveryStatus && (
                              <div className={`text-[10px] font-bold ${comm.deliveryStatus === 'accepted_by_smtp' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                {comm.deliveryStatus === 'accepted_by_smtp' ? 'Accepted by SMTP' : 'Not accepted by SMTP'}
                                {comm.purpose ? ` · ${comm.purpose.replace(/_/g, ' ')}` : ''}
                              </div>
                            )}
                            <div className="text-slate-800 dark:text-slate-300 leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere] break-words">
                              {comm.body}
                            </div>
                            {comm.error && (
                              <p className="text-rose-400 leading-relaxed">Delivery error: {comm.error}</p>
                            )}
                            {comm.messageId && (
                              <p className="text-[10px] text-slate-500 break-all">Message ID: {comm.messageId}</p>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="py-12 text-center text-slate-500 text-xs space-y-2">
                          <Mail className="w-6 h-6 mx-auto text-slate-600" />
                          <p>No customer email replies recorded yet.</p>
                          <button
                            onClick={handleOpenReplyBox}
                            className="text-teal-400 underline font-semibold cursor-pointer"
                          >
                            Send the first email response
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-32 text-center text-slate-400 text-xs space-y-3">
                <Mail className="w-10 h-10 mx-auto text-slate-600 opacity-50" />
                <p className="font-semibold text-slate-300">No inquiry selected</p>
                <p className="text-slate-500 max-w-sm mx-auto">
                  Select an inquiry from the queue on the left to review customer details, manage
                  status, assign staff, and respond.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* EMAIL REPLY MODAL / DRAWER */}
        {showReplyBox && selectedInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-[#0B2530] border border-slate-200 dark:border-teal-500/30 rounded-3xl p-6 w-full max-w-2xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-teal-500/15 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400">
                    <Send size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Direct Customer Email Reply
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Sending from the configured STE owner Gmail account.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReplyBox(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    required
                    maxLength={254}
                    value={replyRecipient}
                    onChange={(e) => setReplyRecipient(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#071A22] border border-slate-300 dark:border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#071A22] border border-slate-300 dark:border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Message Body
                  </label>
                  <textarea
                    rows={8}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#071A22] border border-slate-300 dark:border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 font-sans leading-relaxed resize-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[11px] text-teal-700 dark:text-teal-300 flex items-center gap-2">
                  <Info size={14} className="shrink-0 text-teal-600 dark:text-teal-400" />
                  <span>
                    Sending this email will automatically update the inquiry status to{' '}
                    <strong>Responded</strong> and log the transmission into the audit trail.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200 dark:border-teal-500/15">
                <button
                  type="button"
                  onClick={() => setShowReplyBox(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#071A22] border border-slate-300 dark:border-teal-500/20 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={sendingReply || !replyRecipient.trim() || !replySubject.trim() || !replyMessage.trim()}
                  onClick={handleSendReply}
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 disabled:opacity-40 transition-colors cursor-pointer shadow-md"
                >
                  {sendingReply ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Sending Email...</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Send Reply Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default ContactInquiriesPage;
