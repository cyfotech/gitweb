import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FileEdit,
  Globe,
  Users,
  Briefcase,
  Building2,
  Calculator,
  BookOpen,
  Mail,
  Calendar,
  FileText,
  Eye,
  Layers,
  Search,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  Filter,
  SortAsc,
  Sparkles,
  ShieldCheck,
  Clock,
  Copy,
} from 'lucide-react';
import { pagesApi } from '../../api/pages';
import { AdminLayout } from '../components/AdminLayout';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface PageSeo {
  metaTitle?: string | null;
  metaDescription?: string | null;
  hasMetaTitle?: boolean;
  hasMetaDescription?: boolean;
  hasOgImage?: boolean;
  [key: string]: unknown;
}

interface Page {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  route: string;
  isPublished: boolean;
  status?: string;
  lastModified?: string | null;
  publishedAt?: string | null;
  _count: { sections: number };
  seo: PageSeo | null;
}

type StatusFilter = 'all' | 'published' | 'draft';
type SortOption = 'name-asc' | 'name-desc' | 'sections-desc' | 'modified-desc';

// ─────────────────────────────────────────────────────────────────────────────
// Icon & gradient helpers
// ─────────────────────────────────────────────────────────────────────────────

function getPageIcon(slug: string): React.ReactElement {
  const cls = 'w-7 h-7 text-white drop-shadow-md';
  const map: Record<string, React.ReactElement> = {
    home: <Globe className={cls} />,
    about: <Users className={cls} />,
    services: <Briefcase className={cls} />,
    'cpa-outsourcing': <Building2 className={cls} />,
    'hire-professionals': <Building2 className={cls} />,
    'tax-resources': <Calculator className={cls} />,
    'tax-calculator': <Calculator className={cls} />,
    blog: <BookOpen className={cls} />,
    contact: <Mail className={cls} />,
    'book-consultation': <Calendar className={cls} />,
  };
  return map[slug] ?? <FileText className={cls} />;
}

function getPageGradient(slug: string): string {
  const map: Record<string, string> = {
    home: 'from-teal-600/90 via-cyan-700/80 to-slate-900',
    about: 'from-blue-600/90 via-indigo-700/80 to-slate-900',
    services: 'from-emerald-600/90 via-teal-700/80 to-slate-900',
    'cpa-outsourcing': 'from-amber-600/90 via-orange-700/80 to-slate-900',
    'hire-professionals': 'from-emerald-600/90 via-cyan-800/80 to-slate-900',
    'tax-resources': 'from-rose-600/90 via-pink-700/80 to-slate-900',
    blog: 'from-sky-600/90 via-blue-700/80 to-slate-900',
    contact: 'from-teal-600/90 via-emerald-700/80 to-slate-900',
    'book-consultation': 'from-violet-600/90 via-purple-700/80 to-slate-900',
    'tax-calculator': 'from-amber-600/90 via-yellow-700/80 to-slate-900',
  };
  return map[slug] ?? 'from-slate-700 via-slate-800 to-slate-900';
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton Card
// ─────────────────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white/5 dark:bg-[#071A22]/60 border border-teal-500/15 overflow-hidden animate-pulse flex flex-col h-[340px]">
      <div className="h-20 bg-white/10" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="h-5 bg-white/10 rounded-lg w-3/4" />
          <div className="h-4 bg-white/10 rounded-lg w-1/3" />
          <div className="h-3 bg-white/10 rounded-lg w-full mt-2" />
          <div className="h-3 bg-white/10 rounded-lg w-5/6" />
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-white/10 rounded-lg w-1/2" />
          <div className="flex gap-2 pt-1">
            <div className="h-9 bg-white/10 rounded-xl flex-1" />
            <div className="h-9 bg-white/10 rounded-xl flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page Card
// ─────────────────────────────────────────────────────────────────────────────

interface PageCardProps {
  page: Page;
  onTogglePublish: (id: string) => Promise<void>;
  publishing: boolean;
  cardError: string | null;
  onDuplicate?: (id: string) => Promise<void>;
  duplicating?: boolean;
}

function PageCard({ page, onTogglePublish, publishing, cardError, onDuplicate, duplicating }: PageCardProps) {
  const gradient = getPageGradient(page.slug);
  const icon = getPageIcon(page.slug);
  const hasSeo = !!(page.seo?.metaTitle || page.seo?.hasMetaTitle);
  const publicUrl = page.route === '/' ? '/' : `/${page.slug}`;

  const formattedDate = useMemo(() => {
    if (!page.lastModified && !page.publishedAt) return null;
    const date = new Date(page.lastModified || page.publishedAt || '');
    if (isNaN(date.getTime())) return null;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, [page.lastModified, page.publishedAt]);

  return (
    <div className="rounded-2xl bg-white/70 dark:bg-[#071A22]/90 border border-teal-500/15 dark:border-teal-500/20 overflow-hidden flex flex-col h-[360px] transition-all duration-300 hover:border-teal-400/40 hover:shadow-[0_8px_30px_rgba(20,184,166,0.12)] group">
      {/* Top gradient banner with icon & live pill */}
      <div className={`h-20 bg-gradient-to-r ${gradient} relative flex items-center justify-between px-5 shrink-0 overflow-hidden`}>
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />

        {/* Page Icon */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md shadow-sm">
            {icon}
          </div>
          <span className="font-mono text-xs font-bold text-teal-200 bg-black/40 px-2.5 py-0.5 rounded-md border border-white/15">
            {publicUrl}
          </span>
        </div>

        {/* Status badge */}
        <div className="relative z-10">
          {page.isPublished ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 backdrop-blur-md shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/30 border border-slate-400/30 text-slate-300 backdrop-blur-md shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Draft
            </span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5 justify-between">
        {/* Top block: Title & description */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-slate-900 dark:text-white font-extrabold text-base leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors line-clamp-1">
              {page.title}
            </h3>
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-2 min-h-[32px]">
            {page.description || 'No description added for this page yet.'}
          </p>
        </div>

        {/* Middle block: Metadata indicators */}
        <div className="space-y-2.5 pt-2 border-t border-teal-500/10 dark:border-teal-500/15">
          <div className="flex items-center justify-between text-xs font-semibold">
            {/* Section count */}
            <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Layers className="w-3.5 h-3.5 text-teal-500" />
              <span>{page._count?.sections ?? 0} Section{(page._count?.sections ?? 0) !== 1 ? 's' : ''}</span>
            </span>

            {/* SEO badge */}
            {hasSeo ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[11px] font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                SEO Configured
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[11px] font-bold">
                <AlertCircle className="w-3 h-3 text-amber-500" />
                SEO Pending
              </span>
            )}
          </div>

          {/* Date info if available */}
          {formattedDate && (
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <Clock className="w-3 h-3" />
              <span>Updated: {formattedDate}</span>
            </div>
          )}
        </div>

        {/* Error message if action failed */}
        {cardError && (
          <p className="text-xs text-rose-500 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-1.5">
            {cardError}
          </p>
        )}

        {/* Bottom block: Action buttons with consistent alignment */}
        <div className="flex items-center gap-2 pt-2 border-t border-teal-500/10 dark:border-teal-500/15 mt-1">
          {/* Public Preview */}
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 bg-black/5 dark:bg-white/5 border border-teal-500/15 hover:border-teal-500/40 transition-all cursor-pointer shadow-sm"
            title="Preview live public page"
          >
            <Eye className="w-4 h-4" />
          </a>

          {/* Duplicate button */}
          {onDuplicate && (
            <button
              type="button"
              onClick={() => onDuplicate(page.id)}
              disabled={duplicating}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 bg-black/5 dark:bg-white/5 border border-teal-500/15 hover:border-teal-500/40 transition-all cursor-pointer shadow-sm disabled:opacity-50"
              title="Duplicate page and sections"
            >
              {duplicating ? <RefreshCw className="w-4 h-4 animate-spin text-teal-400" /> : <Copy className="w-4 h-4" />}
            </button>
          )}

          {/* Publish / Unpublish Toggle */}
          <button
            type="button"
            onClick={() => onTogglePublish(page.id)}
            disabled={publishing}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${page.isPublished
                ? 'text-rose-600 dark:text-rose-300 bg-rose-500/10 border-rose-500/25 hover:bg-rose-500/20'
                : 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/25 hover:bg-emerald-500/20'
              }`}
            title={page.isPublished ? 'Unpublish page' : 'Publish page to website'}
          >
            {publishing ? (
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Updating</span>
              </span>
            ) : page.isPublished ? (
              <span>Unpublish</span>
            ) : (
              <span>Publish</span>
            )}
          </button>

          {/* Edit Page Primary CTA */}
          <Link
            to={`/admin/pages/${page.id}/content`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:brightness-110 transition-all shadow-md hover:shadow-teal-500/20 ml-auto cursor-pointer"
          >
            <span>Edit Content</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to={`/admin/pages/${page.id}/sections`}
            aria-label={`Open visual editor for ${page.title}`}
            title="Open visual editor"
            className="inline-flex items-center justify-center rounded-xl border border-teal-500/20 bg-black/5 p-2 text-slate-600 transition-all hover:border-teal-500/40 hover:text-teal-600 dark:bg-white/5 dark:text-slate-300 dark:hover:text-teal-300"
          >
            <Layers className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function EditingPagesIndex() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [sortOpen, setSortOpen] = useState(false);
  const [publishingIds, setPublishingIds] = useState<Set<string>>(new Set());
  const [duplicatingIds, setDuplicatingIds] = useState<Set<string>>(new Set());
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchPages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pagesApi.getAll();
      setPages(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load pages. Please verify backend connection.');
      console.error('[EditingPages] fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  // ── Duplicate Page ─────────────────────────────────────────────────────────

  const handleDuplicatePage = useCallback(async (id: string) => {
    setDuplicatingIds(prev => new Set(prev).add(id));
    try {
      await pagesApi.duplicate(id);
      await fetchPages();
    } catch (err: any) {
      setCardErrors(prev => ({
        ...prev,
        [id]: err?.response?.data?.error || 'Failed to duplicate page.',
      }));
    } finally {
      setDuplicatingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [fetchPages]);

  // ── Publish toggle ─────────────────────────────────────────────────────────

  const handleTogglePublish = useCallback(
    async (id: string) => {
      const page = pages.find((p) => p.id === id);
      if (!page) return;

      // Optimistic update
      setPages((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isPublished: !p.isPublished } : p))
      );
      setPublishingIds((prev) => new Set(prev).add(id));
      setCardErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });

      try {
        await pagesApi.publish(id, !page.isPublished);
      } catch (err) {
        // Revert on error
        setPages((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isPublished: page.isPublished } : p))
        );
        setCardErrors((prev) => ({
          ...prev,
          [id]: 'Failed to update publish status. Please try again.',
        }));
        console.error('[EditingPages] publish error:', err);
      } finally {
        setPublishingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [pages]
  );

  // ── Filtering & sorting ────────────────────────────────────────────────────

  const filteredPages = useMemo(() => {
    let result = [...pages];

    if (statusFilter === 'published') result = result.filter((p) => p.isPublished);
    if (statusFilter === 'draft') result = result.filter((p) => !p.isPublished);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.route.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      );
    }

    if (sortOption === 'name-asc') result.sort((a, b) => a.title.localeCompare(b.title));
    if (sortOption === 'name-desc') result.sort((a, b) => b.title.localeCompare(a.title));
    if (sortOption === 'sections-desc')
      result.sort((a, b) => (b._count?.sections ?? 0) - (a._count?.sections ?? 0));
    if (sortOption === 'modified-desc')
      result.sort((a, b) => {
        const dateA = new Date(a.lastModified || a.publishedAt || 0).getTime();
        const dateB = new Date(b.lastModified || b.publishedAt || 0).getTime();
        return dateB - dateA;
      });

    return result;
  }, [pages, statusFilter, search, sortOption]);

  // ── Counts for filter tabs ─────────────────────────────────────────────────
  const publishedCount = useMemo(() => pages.filter((p) => p.isPublished).length, [pages]);
  const draftCount = useMemo(() => pages.filter((p) => !p.isPublished).length, [pages]);

  const sortLabel: Record<SortOption, string> = {
    'name-asc': 'Name A–Z',
    'name-desc': 'Name Z–A',
    'sections-desc': 'Most Sections',
    'modified-desc': 'Recently Updated',
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <AdminLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-text">

        {/* ── Top Header with Stats Bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-teal-500/15">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-teal-500/20 to-cyan-500/10 border border-teal-500/25 shadow-sm text-teal-400 shrink-0">
              <FileEdit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Page Manager
                </h1>
                {!loading && pages.length > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-teal-500/15 border border-teal-500/30 text-teal-700 dark:text-teal-300">
                    {pages.length} Pages
                  </span>
                )}
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">
                Inspect, edit and synchronize all public website routes with the live CMS database.
              </p>
            </div>
          </div>

          {/* Quick stats pills & Refresh */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {!loading && pages.length > 0 && (
              <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/15 text-xs font-bold">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                  {publishedCount} Live
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-500/15 text-slate-700 dark:text-slate-400">
                  {draftCount} Draft
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={fetchPages}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-black/5 dark:bg-white/5 border border-teal-500/20 hover:border-teal-500/40 hover:bg-black/10 dark:hover:bg-white/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm"
              title="Refresh pages from database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-400' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* ── Error banner with retry ── */}
        {error && (
          <div className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 animate-fade-in shadow-sm">
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={fetchPages}
              className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold transition-colors shrink-0 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Search & Filter Controls Toolbar ── */}
        {!loading && !error && (
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pages by title, URL or slug…"
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#071A22] border border-teal-500/20 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 shadow-sm transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              {/* Status Filter Tabs */}
              <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/15">
                {(['all', 'published', 'draft'] as StatusFilter[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setStatusFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${statusFilter === f
                        ? 'bg-teal-500 text-slate-950 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                  >
                    {f === 'all' ? (
                      <span className="flex items-center gap-1.5">
                        <Filter className="w-3 h-3" />
                        <span>All ({pages.length})</span>
                      </span>
                    ) : f === 'published' ? (
                      <span>Live ({publishedCount})</span>
                    ) : (
                      <span>Draft ({draftCount})</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Sort Selector Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSortOpen((o) => !o)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#071A22] border border-teal-500/20 hover:border-teal-500/40 transition-all cursor-pointer shadow-sm"
                >
                  <SortAsc className="w-3.5 h-3.5 text-teal-400" />
                  <span>{sortLabel[sortOption]}</span>
                </button>
                {sortOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setSortOpen(false)} />
                    <div className="absolute right-0 top-full mt-1.5 z-40 w-48 rounded-xl bg-white dark:bg-[#07161D] border border-teal-500/25 shadow-2xl overflow-hidden py-1">
                      {(Object.entries(sortLabel) as [SortOption, string][]).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setSortOption(key as SortOption);
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${sortOption === key
                              ? 'bg-teal-500/15 text-teal-600 dark:text-teal-300 font-bold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                            }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Loading Skeletons ── */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && !error && filteredPages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl bg-white/50 dark:bg-white/5 border border-teal-500/15">
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mb-4 shadow-sm">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-slate-900 dark:text-white font-extrabold text-base mb-1">
              No pages match your filter
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mb-5 leading-relaxed">
              {search || statusFilter !== 'all'
                ? "Try clearing your search query or switching your status filter to 'All'."
                : 'No pages currently exist in the database.'}
            </p>
            {(search || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-all shadow-md cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* ── Page Cards Grid ── */}
        {!loading && !error && filteredPages.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPages.map((page) => (
                <PageCard
                  key={page.id}
                  page={page}
                  onTogglePublish={handleTogglePublish}
                  publishing={publishingIds.has(page.id)}
                  cardError={cardErrors[page.id] ?? null}
                  onDuplicate={handleDuplicatePage}
                  duplicating={duplicatingIds.has(page.id)}
                />
              ))}
            </div>

            {/* Footer Summary */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-teal-500/10">
              <span>Showing {filteredPages.length} of {pages.length} total pages</span>
              <span>All changes automatically synchronized with database</span>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

export default EditingPagesIndex;
