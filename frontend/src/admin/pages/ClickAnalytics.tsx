import React, { useState, useEffect } from 'react';
import {
  MousePointer, Eye, Users, TrendingUp, Layers, BookOpen,
  Monitor, Smartphone, Tablet, RefreshCw, Sparkles, Activity,
  Filter, Calendar, ArrowRight, UserCheck, CheckCircle2,
  ChevronDown, Search, Download, HelpCircle
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { ThreeDCard, MagneticButton } from '../components/ThreeDComponents';
import { analyticsApi } from '../../api/analytics';

export function ClickAnalyticsPage() {
  // Global Range Filter
  const [dateFilter, setDateFilter] = useState('30');
  const [loading, setLoading] = useState(true);

  // Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'sections' | 'buttons' | 'blogs' | 'funnel'>('overview');

  // Telemetry Datasets
  const [stats, setStats] = useState<any>(null);
  const [clicks, setClicks] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [buttons, setButtons] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [funnel, setFunnel] = useState<any[]>([]);

  // Search & Filter state for sub-tables
  const [tableSearch, setTableSearch] = useState('');
  const [pageFilter, setPageFilter] = useState('all');

  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const [statsData, clickData, sectionsData, buttonsData, blogsData, funnelData] = await Promise.all([
        analyticsApi.getStats(dateFilter),
        analyticsApi.getClickReport(dateFilter),
        analyticsApi.getSections(pageFilter),
        analyticsApi.getButtons(),
        analyticsApi.getBlogs(),
        analyticsApi.getFunnel(),
      ]);
      setStats(statsData);
      setClicks(Array.isArray(clickData) ? clickData : []);
      setSections(Array.isArray(sectionsData) ? sectionsData : []);
      setButtons(Array.isArray(buttonsData) ? buttonsData : []);
      setBlogs(Array.isArray(blogsData) ? blogsData : []);
      setFunnel(Array.isArray(funnelData) ? funnelData : []);
    } catch (err: any) {
      console.error('Failed to load telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, [dateFilter, pageFilter]);

  // Export CSV Handler
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: any[] = [];
    let filename = `telemetry-report-${dateFilter}-days.csv`;

    if (activeTab === 'sections') {
      headers = ['Page', 'Section Key', 'Section Name', 'Views', 'Unique Visitors', 'Clicks', 'CTR'];
      rows = sections.map(s => [`"${s.page}"`, `"${s.sectionKey}"`, `"${s.sectionName}"`, s.views, s.uniqueVisitors, s.clicks, `"${s.ctr}"`]);
    } else if (activeTab === 'buttons') {
      headers = ['Element Name', 'Type', 'Intent Category', 'Page', 'Section', 'Total Clicks', 'Unique Clickers'];
      rows = buttons.map(b => [`"${b.elementName}"`, `"${b.elementType}"`, `"${b.intentCategory}"`, `"${b.page}"`, `"${b.section}"`, b.clicks, b.uniqueClickers]);
    } else if (activeTab === 'blogs') {
      headers = ['Blog Title', 'Slug', 'Category', 'Total Views', 'Clicks'];
      rows = blogs.map(b => [`"${b.title}"`, `"${b.slug}"`, `"${b.category}"`, b.views, b.clicks]);
    } else {
      headers = ['Element Text', 'Visitor Name', 'Identification Status', 'Page', 'Section', 'Timestamp'];
      rows = clicks.map(c => [`"${c.elementText}"`, `"${c.visitorName}"`, `"${c.identificationStatus}"`, `"${c.pageUrl}"`, `"${c.sectionKey}"`, `"${new Date(c.timestamp).toLocaleString()}"`]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="p-5 sm:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                <MousePointer className="w-6 h-6 text-emerald-500" />
                <span>Click Analytics & Visitor Telemetry</span>
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20">
                Live Tracking Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Real-time section engagement, button telemetry, persistent visitor identities, and full conversion funnel.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Date Filters */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-black/5 dark:bg-[#071A22] border border-teal-500/15 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-400 cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>

            <MagneticButton
              onClick={handleExportCSV}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/80 dark:bg-[#071A22]/80 border border-teal-500/20 hover:bg-teal-500/10 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5 shadow-sm"
              title="Export Current Tab CSV"
            >
              <Download size={13} className="text-teal-500" />
              <span>Export CSV</span>
            </MagneticButton>

            <MagneticButton
              onClick={fetchTelemetry}
              className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 border border-teal-500/20 hover:bg-teal-500/10 transition-all cursor-pointer shadow-sm"
              title="Refresh Telemetry"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </MagneticButton>
          </div>
        </div>

        {/* 10 Top Database KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          {/* Card 1: Unique Sessions */}
          <div className="bg-white/80 dark:bg-[#071A22]/80 border border-teal-500/15 p-4 rounded-2xl shadow-sm backdrop-blur-md">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Unique Visitors</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stats?.visitors?.total || '0'}
            </p>
            <span className="text-[10px] text-cyan-500 font-mono">
              {stats?.identifiedVisitors?.total || 0} identified
            </span>
          </div>

          {/* Card 2: Page Impressions */}
          <div className="bg-white/80 dark:bg-[#071A22]/80 border border-teal-500/15 p-4 rounded-2xl shadow-sm backdrop-blur-md">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Page Impressions</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stats?.pageViews?.total || '0'}
            </p>
            <span className="text-[10px] text-slate-400 font-mono">
              {stats?.sectionViews?.total || 0} section views
            </span>
          </div>

          {/* Card 3: Button & Link Clicks */}
          <div className="bg-white/80 dark:bg-[#071A22]/80 border border-teal-500/15 p-4 rounded-2xl shadow-sm backdrop-blur-md">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total Clicks</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stats?.clicks?.total || '0'}
            </p>
            <span className="text-[10px] text-emerald-500 font-mono">
              {stats?.clicks?.highIntent || 0} high-intent
            </span>
          </div>

          {/* Card 4: CTR */}
          <div className="bg-white/80 dark:bg-[#071A22]/80 border border-teal-500/15 p-4 rounded-2xl shadow-sm backdrop-blur-md">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Click-Through Rate</span>
            <p className="text-2xl font-black text-emerald-500 mt-1">
              {stats?.ctr || '0.0%'}
            </p>
            <span className="text-[10px] text-slate-400 font-mono">
              Clicks / Impressions
            </span>
          </div>

          {/* Card 5: Form Conversions */}
          <div className="bg-white/80 dark:bg-[#071A22]/80 border border-teal-500/15 p-4 rounded-2xl shadow-sm backdrop-blur-md">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Form Submissions</span>
            <p className="text-2xl font-black text-amber-500 mt-1">
              {stats?.formSubmissions?.total || '0'}
            </p>
            <span className="text-[10px] text-amber-400 font-mono">
              {stats?.conversionRate || '0.0%'} conversion
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-teal-500/15 gap-2 text-xs font-semibold overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            High-Intent Click Stream
          </button>

          <button
            onClick={() => setActiveTab('sections')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'sections'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            Section Performance
          </button>

          <button
            onClick={() => setActiveTab('buttons')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'buttons'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            Button & Link Performance
          </button>

          <button
            onClick={() => setActiveTab('funnel')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'funnel'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            Conversion Funnel
          </button>

          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'blogs'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            Blog Readership
          </button>
        </div>

        {/* TAB 1: High-Intent Click Stream */}
        {activeTab === 'overview' && (
          <div className="bg-white/70 dark:bg-[#071A22]/70 border border-teal-500/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-teal-500/10">
              <div>
                <h2 className="font-bold text-base text-slate-900 dark:text-white">
                  High-Impact Click Stream ({clicks.length} events)
                </h2>
                <p className="text-xs text-slate-500">Live events with automatic visitor identity resolution</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {clicks.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No click telemetry recorded for the selected period yet. Click buttons on the live site to populate.
                </div>
              ) : (
                clicks.map((c: any, i: number) => {
                  const isIdentified = c.visitorName && c.visitorName !== 'Anonymous Visitor';
                  return (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/10 hover:border-teal-500/30 transition-all text-xs gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {c.elementText || c.elementId}
                            </span>
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono">
                              {c.intentCategory || 'click'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-slate-500 font-mono text-[11px]">
                            <span>Page: {c.pageUrl}</span>
                            <span>•</span>
                            <span>Section: {c.sectionKey}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className={`font-semibold block ${isIdentified ? 'text-cyan-400' : 'text-slate-400'}`}>
                            {c.visitorName}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(c.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Section Performance */}
        {activeTab === 'sections' && (
          <div className="bg-white/70 dark:bg-[#071A22]/70 border border-teal-500/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-teal-500/10">
              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                Independent Section Visibility & Engagement
              </h2>
              <span className="text-xs text-slate-500 font-mono">IntersectionObserver 35% Threshold</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-teal-500/20 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                    <th className="py-3 px-3">Page</th>
                    <th className="py-3 px-3">Section Identifier</th>
                    <th className="py-3 px-3">Total Views</th>
                    <th className="py-3 px-3">Unique Visitors</th>
                    <th className="py-3 px-3">Clicks</th>
                    <th className="py-3 px-3 text-right">CTR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-500/10">
                  {sections.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                        No section views recorded yet. Scroll through any public website page to record impressions.
                      </td>
                    </tr>
                  ) : (
                    sections.map((s, idx) => (
                      <tr key={idx} className="hover:bg-teal-500/5 transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                          {s.page}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {s.sectionName}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {s.sectionKey}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono">{s.views}</td>
                        <td className="py-3 px-3 font-mono text-cyan-400">{s.uniqueVisitors}</td>
                        <td className="py-3 px-3 font-mono text-emerald-400">{s.clicks}</td>
                        <td className="py-3 px-3 font-mono text-right font-bold text-emerald-400">
                          {s.ctr}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Button & Link Performance */}
        {activeTab === 'buttons' && (
          <div className="bg-white/70 dark:bg-[#071A22]/70 border border-teal-500/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-teal-500/10">
              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                Interactive Elements (Buttons, CTAs, Navigation Links)
              </h2>
              <span className="text-xs text-slate-500">Tracked with unique identifiers</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-teal-500/20 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                    <th className="py-3 px-3">Element Name / ID</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Page</th>
                    <th className="py-3 px-3">Section</th>
                    <th className="py-3 px-3">Total Clicks</th>
                    <th className="py-3 px-3 text-right">Unique Clickers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-500/10">
                  {buttons.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                        No button clicks recorded yet. Interact with the website to track elements.
                      </td>
                    </tr>
                  ) : (
                    buttons.map((b, idx) => (
                      <tr key={idx} className="hover:bg-teal-500/5 transition-colors">
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {b.elementName}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {b.elementId}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono">
                            {b.intentCategory}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono">{b.page}</td>
                        <td className="py-3 px-3 font-mono text-slate-400">{b.section}</td>
                        <td className="py-3 px-3 font-mono font-bold text-emerald-400">{b.clicks}</td>
                        <td className="py-3 px-3 font-mono text-right text-cyan-400">{b.uniqueClickers}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Conversion Funnel */}
        {activeTab === 'funnel' && (
          <div className="bg-white/70 dark:bg-[#071A22]/70 border border-teal-500/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                Multi-Stage Conversion Funnel
              </h2>
              <p className="text-xs text-slate-500">
                True database conversion progression from initial visitor arrival to confirmed form submission.
              </p>
            </div>

            <div className="space-y-4">
              {funnel.map((stage: any, index: number) => {
                const maxVal = Math.max(...funnel.map((s: any) => s.count), 1);
                const pct = Math.round((stage.count / maxVal) * 100);

                return (
                  <div key={index} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{stage.name}</span>
                      <span className="font-mono text-teal-400 font-bold">{stage.count} events ({pct}%)</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-black/10 dark:bg-white/5 overflow-hidden border border-teal-500/15">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${Math.max(pct, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: Blog Readership */}
        {activeTab === 'blogs' && (
          <div className="bg-white/70 dark:bg-[#071A22]/70 border border-teal-500/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-teal-500/10">
              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                Blog Article Readership & Reader Engagement
              </h2>
              <span className="text-xs text-slate-500">Attributed to visitor content consumption</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-teal-500/20 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                    <th className="py-3 px-3">Article Title</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Slug</th>
                    <th className="py-3 px-3">Total Views</th>
                    <th className="py-3 px-3 text-right">Interactions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-500/10">
                  {blogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500 text-xs">
                        No blog posts found.
                      </td>
                    </tr>
                  ) : (
                    blogs.map((b, idx) => (
                      <tr key={idx} className="hover:bg-teal-500/5 transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                          {b.title}
                        </td>
                        <td className="py-3 px-3 text-slate-400">{b.category}</td>
                        <td className="py-3 px-3 font-mono text-[11px] text-teal-400">{b.slug}</td>
                        <td className="py-3 px-3 font-mono font-bold text-cyan-400">{b.views}</td>
                        <td className="py-3 px-3 font-mono text-right font-bold text-emerald-400">{b.clicks}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
export default ClickAnalyticsPage;
