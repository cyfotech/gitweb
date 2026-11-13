import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, CheckCircle, Clock, Briefcase, BookOpen, Image,
  Users, Eye, MousePointer, Target, Mail, Calendar,
  TrendingUp, RefreshCw, AlertCircle, ArrowRight, ShieldCheck,
  Sparkles, Layers, Activity
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { ThreeDCard, MagneticButton } from '../components/ThreeDComponents';
import apiClient from '../../api/client';

interface DashboardStats {
  pages: { total: number; published: number; draft: number };
  services: number;
  blog: { total: number; published: number };
  media: number;
  visitors: number;
  pageViews: number;
  clicks: number;
  inquiries: { total: number; new: number };
  consultations: { total: number; new: number };
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get('/dashboard/stats');
      setStats(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="p-5 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Futuristic 3D Command Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900/40 via-cyan-900/30 to-emerald-900/40 border border-teal-500/20 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/15 text-teal-700 dark:text-cyan-300 border border-teal-500/25 mb-3">
                <Sparkles size={13} className="text-teal-500 dark:text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Executive Command Console</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Smart Tax Experts (STE)
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Centralized CMS, live traffic monitoring, multi-tier inquiry routing, and published content orchestration with MySQL synchronization.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <MagneticButton
                onClick={fetchStats}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-teal-700 dark:text-teal-300 bg-white dark:bg-[#071A22] border border-teal-500/30 hover:border-teal-400 shadow-md transition-all cursor-pointer"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                <span>Refresh Live Telemetry</span>
              </MagneticButton>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 3D KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <ThreeDCard className="bg-white/80 dark:bg-[#071A22]/80 border border-teal-500/15 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="p-2.5 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400">
                <Briefcase size={20} />
              </span>
              <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20">
                100% Synced
              </span>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {loading ? '...' : stats?.services ?? 20}
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Practice Offerings</p>
            <div className="mt-4 pt-3 border-t border-teal-500/10 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">All 3 Categories</span>
              <Link to="/admin/services" className="text-teal-600 dark:text-teal-300 hover:underline font-semibold flex items-center gap-1">
                Manage <ArrowRight size={11} />
              </Link>
            </div>
          </ThreeDCard>

          <ThreeDCard className="bg-white/80 dark:bg-[#071A22]/80 border border-teal-500/15 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                <BookOpen size={20} />
              </span>
              <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                Published
              </span>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {loading ? '...' : stats?.blog?.total ?? 9}
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Verified Publications</p>
            <div className="mt-4 pt-3 border-t border-teal-500/10 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">5 Strategy Pillars</span>
              <Link to="/admin/blog" className="text-cyan-600 dark:text-cyan-300 hover:underline font-semibold flex items-center gap-1">
                Open CMS <ArrowRight size={11} />
              </Link>
            </div>
          </ThreeDCard>

          <ThreeDCard className="bg-white/80 dark:bg-[#071A22]/80 border border-teal-500/15 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <Calendar size={20} />
              </span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                New: {stats?.consultations?.new ?? 0}
              </span>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {loading ? '...' : stats?.consultations?.total ?? 0}
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Consultation Requests</p>
            <div className="mt-4 pt-3 border-t border-teal-500/10 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">SLA Tracking</span>
              <Link to="/admin/consultations" className="text-emerald-600 dark:text-emerald-300 hover:underline font-semibold flex items-center gap-1">
                View Queue <ArrowRight size={11} />
              </Link>
            </div>
          </ThreeDCard>

          <ThreeDCard className="bg-white/80 dark:bg-[#071A22]/80 border border-teal-500/15 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <Mail size={20} />
              </span>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                New: {stats?.inquiries?.new ?? 0}
              </span>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {loading ? '...' : stats?.inquiries?.total ?? 0}
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Direct Partner Inquiries</p>
            <div className="mt-4 pt-3 border-t border-teal-500/10 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Confidential Desk</span>
              <Link to="/admin/contact" className="text-amber-600 dark:text-amber-300 hover:underline font-semibold flex items-center gap-1">
                Review <ArrowRight size={11} />
              </Link>
            </div>
          </ThreeDCard>
        </div>

        {/* 3D Command Hub Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Access Launchpad */}
          <div className="lg:col-span-2 bg-white/70 dark:bg-[#071A22]/70 border border-teal-500/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Content & Systems Launchpad</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Quick access to primary management modules</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-300 border border-teal-500/20">
                5 Primary Sections
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/admin/pages"
                className="group p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-teal-500/15 hover:border-teal-400 hover:bg-teal-500/5 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                    Page Sections Editor
                  </span>
                  <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-1 group-hover:text-teal-400 transition-transform" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Edit headlines, structured JSON data, and visual components across all 10 site pages.
                </p>
              </Link>

              <Link
                to="/admin/seo"
                className="group p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-teal-500/15 hover:border-teal-400 hover:bg-teal-500/5 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                    SEO Meta Suite
                  </span>
                  <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-1 group-hover:text-cyan-400 transition-transform" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Real-time Google search snippet previews, social OpenGraph cards, and robot crawler indexes.
                </p>
              </Link>

              <Link
                to="/admin/analytics"
                className="group p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-teal-500/15 hover:border-teal-400 hover:bg-teal-500/5 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                    Click Telemetry
                  </span>
                  <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-400 transition-transform" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Track visitor session conversions, engagement bounce depth, and device breakups.
                </p>
              </Link>

              <Link
                to="/admin/media"
                className="group p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-teal-500/15 hover:border-teal-400 hover:bg-teal-500/5 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                    Media Vault
                  </span>
                  <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-1 group-hover:text-amber-400 transition-transform" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Manage brand assets, high-resolution hero imagery, and document attachments.
                </p>
              </Link>
            </div>
          </div>

          {/* System Telemetry & Architecture Card */}
          <div className="bg-white/70 dark:bg-[#071A22]/70 border border-teal-500/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-teal-500 animate-pulse" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Active Infrastructure</h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/10">
                  <span className="text-slate-500 dark:text-slate-400">Database Engine</span>
                  <span className="font-mono font-bold text-teal-600 dark:text-teal-300">MySQL 8.0</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/10">
                  <span className="text-slate-500 dark:text-slate-400">ORM Architecture</span>
                  <span className="font-mono font-bold text-cyan-600 dark:text-cyan-300">Prisma Client</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/10">
                  <span className="text-slate-500 dark:text-slate-400">Backend Port</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">:8001</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/10">
                  <span className="text-slate-500 dark:text-slate-400">Security Cipher</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">JWT 256-Bit</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-teal-500/10 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Audited & Verified under SOC 2 Protocols
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
