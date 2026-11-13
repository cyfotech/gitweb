import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Users, UserCheck, UserX, UserPlus, FileText, Activity, 
  Search, RefreshCw, Download, ExternalLink, Calendar, 
  Monitor, Smartphone, Laptop, Clock, ArrowRight, Shield, Filter,
  ShieldAlert, CheckCircle, Server
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { ThreeDCard, MagneticButton } from '../components/ThreeDComponents';
import { visitorApi } from '../../api/visitors';
import apiClient from '../../api/client';

export function ActivityLogsPage() {
  const location = useLocation();

  // Determine active view mode based on URL or tab selection
  // /admin/logs/system -> System Logs (Live Visitor & User Tracking)
  // /admin/logs -> Admin Activity (Admin Audit Trail & Content Edits)
  const isSystemLogsRoute = location.pathname.includes('/system');
  const [activeTab, setActiveTab] = useState<'visitor_system' | 'admin_audit'>(
    isSystemLogsRoute ? 'visitor_system' : 'admin_audit'
  );

  // Sync tab whenever URL pathname changes
  useEffect(() => {
    if (location.pathname.includes('/system')) {
      setActiveTab('visitor_system');
      setPage(1);
    } else {
      setActiveTab('admin_audit');
      setPage(1);
    }
  }, [location.pathname]);

  // Visitor & System Intelligence state
  const [stats, setStats] = useState({
    totalVisitors: 0,
    uniqueVisitors: 0,
    identifiedVisitors: 0,
    anonymousVisitors: 0,
    returningVisitors: 0,
    totalSubmissions: 0,
    todayActivities: 0,
    activeDevices: 0,
  });

  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Admin audit logs state
  const [adminLogs, setAdminLogs] = useState<any[]>([]);
  const [adminTotal, setAdminTotal] = useState(0);
  const [adminLoading, setAdminLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [activityType, setActivityType] = useState('');
  const [status, setStatus] = useState('');
  const limit = 25;

  // Load stats
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res: any = await visitorApi.getStats();
      if (res) setStats(res);
    } catch (e) {
      console.error('Failed to load visitor stats:', e);
    } finally {
      setStatsLoading(false);
    }
  };

  // Load Visitor/System logs
  const fetchVisitorLogs = async () => {
    try {
      setLoading(true);
      const res: any = await visitorApi.getLogs({
        page,
        limit,
        search,
        activityType,
        status,
      });
      if (res) {
        setLogs(res.logs || []);
        setTotal(res.total || 0);
      }
    } catch (e) {
      console.error('Failed to load visitor logs:', e);
    } finally {
      setLoading(false);
    }
  };

  // Load Admin Audit logs
  const fetchAdminAuditLogs = async () => {
    try {
      setAdminLoading(true);
      const res: any = await apiClient.get(`/logs/activity?page=${page}&limit=${limit}`);
      if (res) {
        setAdminLogs(res.logs || []);
        setAdminTotal(res.total || 0);
      }
    } catch (e) {
      console.error('Failed to load admin audit logs:', e);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'visitor_system') {
      fetchVisitorLogs();
    } else {
      fetchAdminAuditLogs();
    }
  }, [page, activityType, status, activeTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    if (activeTab === 'visitor_system') {
      fetchVisitorLogs();
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (activeTab === 'visitor_system') {
      if (!logs.length) return;
      const headers = ['Log ID', 'Visitor Name', 'Visitor UUID', 'Identification Status', 'Activity', 'Page', 'Device', 'OS', 'Browser', 'IP', 'Status', 'Timestamp'];
      const rows = logs.map(l => [
        `"${l.id}"`,
        `"${l.visitorName}"`,
        `"${l.visitorUuid}"`,
        `"${l.identificationStatus}"`,
        `"${l.activityType}"`,
        `"${l.page}"`,
        `"${l.device}"`,
        `"${l.os}"`,
        `"${l.browser}"`,
        `"${l.ipAddress}"`,
        `"${l.status}"`,
        `"${new Date(l.createdAt).toLocaleString()}"`,
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `system-activity-logs-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      if (!adminLogs.length) return;
      const headers = ['Log ID', 'Admin Email', 'Action', 'Resource', 'Target ID', 'Severity', 'IP Address', 'Timestamp'];
      const rows = adminLogs.map(l => [
        `"${l.id}"`,
        `"${l.admin?.email || 'N/A'}"`,
        `"${l.action}"`,
        `"${l.resource || 'N/A'}"`,
        `"${l.resourceId || 'N/A'}"`,
        `"${l.severity}"`,
        `"${l.ipAddress || '127.0.0.1'}"`,
        `"${new Date(l.createdAt).toLocaleString()}"`,
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `admin-audit-logs-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <AdminLayout>
      <div className="p-5 sm:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                <Activity className="w-6 h-6 text-teal-500" />
                <span>System Logs & Visitor Intelligence</span>
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-300 border border-teal-500/20">
                Live Tracking Active
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Automatic visitor recognition, persistent device tracing, verified form submissions, and chronological audit trails.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Switcher: Admin Activity vs System Logs */}
            <div className="flex rounded-xl bg-slate-200/80 dark:bg-white/5 p-1 border border-teal-500/20">
              <Link
                to="/admin/logs/system"
                onClick={() => { setActiveTab('visitor_system'); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'visitor_system'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Activity size={13} />
                <span>System Logs (Live Visitors)</span>
              </Link>
              <Link
                to="/admin/logs"
                onClick={() => { setActiveTab('admin_audit'); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'admin_audit'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldAlert size={13} />
                <span>Admin Activity</span>
              </Link>
            </div>

            <MagneticButton
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#071A22]/80 border border-teal-500/20 hover:bg-teal-500/10 text-slate-800 dark:text-slate-200 transition-all flex items-center gap-2 shadow-sm"
              title="Export Logs to CSV"
            >
              <Download size={14} className="text-teal-600 dark:text-teal-400" />
              <span>Export CSV</span>
            </MagneticButton>

            <MagneticButton
              onClick={() => {
                fetchStats();
                if (activeTab === 'visitor_system') fetchVisitorLogs();
                else fetchAdminAuditLogs();
              }}
              className="p-2.5 rounded-xl bg-white dark:bg-[#071A22]/80 text-slate-700 dark:text-slate-300 border border-teal-500/20 hover:bg-teal-500/10 transition-all cursor-pointer shadow-sm"
              title="Refresh Logs"
            >
              <RefreshCw size={14} className={loading || adminLoading ? 'animate-spin' : ''} />
            </MagneticButton>
          </div>
        </div>

        {/* 8 Stats Metrics (Only shown for System Logs) */}
        {activeTab === 'visitor_system' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {/* Total Visitors */}
            <div className="bg-white/80 dark:bg-[#071A22]/70 border border-teal-500/20 rounded-2xl p-4 shadow-sm backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Total Visitors</span>
                <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {statsLoading ? '...' : stats.totalVisitors}
              </div>
              <div className="text-[10px] text-teal-700 dark:text-teal-400 font-mono font-medium mt-1">
                {stats.uniqueVisitors} unique devices
              </div>
            </div>

            {/* Returning Visitors */}
            <div className="bg-white/80 dark:bg-[#071A22]/70 border border-teal-500/20 rounded-2xl p-4 shadow-sm backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Returning Visitors</span>
                <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {statsLoading ? '...' : stats.returningVisitors}
              </div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-medium mt-1">
                Multi-session retention
              </div>
            </div>

            {/* Identified Visitors */}
            <div className="bg-white/80 dark:bg-[#071A22]/70 border border-teal-500/20 rounded-2xl p-4 shadow-sm backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Identified Visitors</span>
                <UserPlus className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="mt-2 text-2xl font-black text-cyan-700 dark:text-cyan-300">
                {statsLoading ? '...' : stats.identifiedVisitors}
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 font-mono font-medium mt-1">
                {stats.anonymousVisitors} anonymous
              </div>
            </div>

            {/* Form Submissions */}
            <div className="bg-white/80 dark:bg-[#071A22]/70 border border-teal-500/20 rounded-2xl p-4 shadow-sm backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Form Submissions</span>
                <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {statsLoading ? '...' : stats.totalSubmissions}
              </div>
              <div className="text-[10px] text-amber-700 dark:text-amber-400 font-mono font-medium mt-1">
                {stats.todayActivities} activities today
              </div>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        {activeTab === 'visitor_system' ? (
          <div className="bg-white/80 dark:bg-[#071A22]/70 border border-teal-500/20 rounded-2xl p-4 shadow-sm backdrop-blur-md flex flex-col md:flex-row gap-3 items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by visitor name, email, visitor UUID, page or description..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-white/5 border border-teal-500/25 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
              />
            </form>

            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <select
                value={activityType}
                onChange={(e) => { setActivityType(e.target.value); setPage(1); }}
                className="px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-white/5 border border-teal-500/25 text-slate-800 dark:text-slate-200 focus:outline-none font-medium"
              >
                <option value="">All Activities</option>
                <option value="first_visit">First Visit</option>
                <option value="returning_visit">Returning Visit</option>
                <option value="page_view">Page View</option>
                <option value="form_open">Form Open</option>
                <option value="form_submit_success">Form Submitted</option>
              </select>

              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                className="px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-white/5 border border-teal-500/25 text-slate-800 dark:text-slate-200 focus:outline-none font-medium"
              >
                <option value="">All Statuses</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        ) : null}

        {/* Tab 1: System Logs (Visitor Intelligence) */}
        {activeTab === 'visitor_system' ? (
          <div className="bg-white/80 dark:bg-[#071A22]/70 border border-teal-500/20 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-teal-500/15">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span>Real-Time Visitor Activity Stream</span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">({total} total records)</span>
            </h2>
            <span className="text-[11px] text-slate-700 dark:text-slate-400 font-mono font-medium">
              Page {page} of {Math.max(1, Math.ceil(total / limit))}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-teal-500/20 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Visitor Identity</th>
                  <th className="py-3 px-3">Activity</th>
                  <th className="py-3 px-3">Page / Target</th>
                  <th className="py-3 px-3">Device & Browser</th>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-500/10">
                {loading && logs.length === 0 ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="py-4 px-3">
                        <div className="h-6 bg-teal-500/10 rounded-lg w-full" />
                      </td>
                    </tr>
                  ))
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-600 dark:text-slate-400 text-xs">
                      No system logs found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const isIdentified = log.visitorName && log.visitorName !== 'Anonymous Visitor';
                    return (
                      <tr key={log.id} className="hover:bg-teal-500/5 transition-colors group">
                        {/* Visitor */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              isIdentified ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30' : 'bg-slate-200 dark:bg-slate-500/20 text-slate-700 dark:text-slate-300'
                            }`}>
                              {isIdentified ? log.visitorName.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-slate-900 dark:text-white truncate">
                                  {log.visitorName}
                                </span>
                                {isIdentified && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-400/40">
                                    Identified
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono block truncate font-medium" title={log.visitorUuid}>
                                UUID: {log.visitorUuid.slice(0, 13)}...
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Activity */}
                        <td className="py-3.5 px-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            log.activityType.includes('form')
                              ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-500/20'
                              : log.activityType.includes('returning')
                              ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20'
                              : 'bg-teal-100 dark:bg-teal-500/10 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-500/20'
                          }`}>
                            {log.activityType}
                          </span>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 max-w-xs truncate">
                            {log.description}
                          </p>
                        </td>

                        {/* Page */}
                        <td className="py-3.5 px-3">
                          <span className="font-semibold text-slate-900 dark:text-slate-200 block truncate max-w-[150px]">
                            {log.page}
                          </span>
                          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono block truncate max-w-[150px]">
                            {log.pageUrl}
                          </span>
                        </td>

                        {/* Device */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <Monitor className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                            <div>
                              <span className="font-semibold text-slate-900 dark:text-slate-200">
                                {log.browser} on {log.os}
                              </span>
                              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono block">
                                IP: {log.ipAddress}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Timestamp */}
                        <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300 font-mono text-[11px] whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-3 text-right">
                          {log.visitorId ? (
                            <Link
                              to={`/admin/visitors/${log.visitorId}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 hover:bg-teal-600 hover:text-white transition-all border border-teal-500/30"
                            >
                              <span>History</span>
                              <ArrowRight size={12} />
                            </Link>
                          ) : (
                            <span className="text-[10px] text-slate-500">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-3 border-t border-teal-500/15 text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              Showing {logs.length} of {total} activities
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-teal-500/20 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-500/10 text-slate-800 dark:text-slate-200 transition-all cursor-pointer font-medium"
              >
                Previous
              </button>
              <button
                disabled={page * limit >= total}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-teal-500/20 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-500/10 text-slate-800 dark:text-slate-200 transition-all cursor-pointer font-medium"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        ) : (
          /* Tab 2: Admin Activity (Audit Feed) */
          <div className="bg-white/80 dark:bg-[#071A22]/70 border border-teal-500/20 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-teal-500/15">
              <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Admin Management & Security Audit Feed</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">({adminTotal} total records)</span>
              </h2>
              <span className="text-[11px] text-slate-700 dark:text-slate-400 font-mono font-medium">
                Page {page} of {Math.max(1, Math.ceil(adminTotal / limit))}
              </span>
            </div>

            <div className="space-y-3">
              {adminLoading && adminLogs.length === 0 ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-2xl bg-white/40 dark:bg-white/5 border border-teal-500/10 animate-pulse" />
                ))
              ) : adminLogs.length === 0 ? (
                <div className="py-16 text-center text-slate-600 dark:text-slate-400 text-xs">
                  No admin activity records logged yet.
                </div>
              ) : (
                adminLogs.map((log) => (
                  <ThreeDCard
                    key={log.id}
                    intensity={5}
                    className="bg-white/90 dark:bg-[#071A22]/80 border border-teal-500/20 p-4 shadow-sm backdrop-blur-xl flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-500/20">
                        {log.action || 'ADMIN ACTION'}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                          {log.resource ? `Modified ${log.resource} (${log.resourceId || 'N/A'})` : log.action}
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono mt-0.5">
                          Admin: {log.admin?.email || 'admin@preferredtax.com'} • IP: {log.ipAddress || '127.0.0.1'}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-600 dark:text-slate-400 shrink-0 font-mono">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </ThreeDCard>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-3 border-t border-teal-500/15 text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                Showing {adminLogs.length} of {adminTotal} admin actions
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-teal-500/20 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-500/10 text-slate-800 dark:text-slate-200 transition-all cursor-pointer font-medium"
                >
                  Previous
                </button>
                <button
                  disabled={page * limit >= adminTotal}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-teal-500/20 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-500/10 text-slate-800 dark:text-slate-200 transition-all cursor-pointer font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
export default ActivityLogsPage;
