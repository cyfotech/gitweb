import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Globe,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Save,
  RefreshCw,
  Plus,
  X,
  FileText,
  Tag,
  BarChart3,
  Trash2,
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { pagesApi } from '../../api/pages';
import { seoApi, SEOData } from '../../api/seo';

type SEOTab = 'general' | 'keywords' | 'audit' | 'analytics' | 'technical';

interface KeywordItem {
  id: string;
  text: string;
  isPrimary: boolean;
}

export function SEOManagerPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<SEOTab>('general');
  const [pageSearch, setPageSearch] = useState('');

  // SEO Form State
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState<KeywordItem[]>([]);
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [robotsIndex, setRobotsIndex] = useState(true);
  const [robotsFollow, setRobotsFollow] = useState(true);
  const [sitemapPriority, setSitemapPriority] = useState('0.8');
  const [sitemapChange, setSitemapChange] = useState('weekly');

  // Social / Open Graph State
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');
  const [twitterImage, setTwitterImage] = useState('');

  // Schema Markup State - (removed)

  // Technical SEO & Robots.txt
  const [robotsTxtContent, setRobotsTxtContent] = useState('');
  const [robotsTxtLoading, setRobotsTxtLoading] = useState(false);

  // Audit state
  const [auditData, setAuditData] = useState<any>(null);
  const [auditLoading, setAuditLoading] = useState(false);

  // Statuses
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch all registered website pages
  const fetchPages = async () => {
    setLoading(true);
    try {
      const data: any = await pagesApi.getAll();
      const list = Array.isArray(data) ? data : [];
      setPages(list);
      if (list.length > 0 && !selectedPage) {
        loadPageSeo(list[0]);
      }
    } catch {
      showToast('error', 'Failed to retrieve website pages.');
    } finally {
      setLoading(false);
    }
  };

  // Load SEO details for selected page
  const loadPageSeo = async (page: any) => {
    setSelectedPage(page);
    try {
      const data: any = await seoApi.getByPageId(page.id);
      if (data && (data.metaTitle || data.metaDescription || data.canonicalUrl)) {
        setMetaTitle(data.metaTitle || '');
        setMetaDescription(data.metaDescription || '');

        // Parse keywords
        let kwList: KeywordItem[] = [];
        if (Array.isArray(data.metaKeywords)) {
          kwList = data.metaKeywords.map((k: string, i: number) => ({
            id: `kw-${i}`,
            text: k,
            isPrimary: i === 0,
          }));
        } else if (typeof data.metaKeywords === 'string' && data.metaKeywords.trim()) {
          kwList = data.metaKeywords.split(',').map((k: string, i: number) => ({
            id: `kw-${i}`,
            text: k.trim(),
            isPrimary: i === 0,
          })).filter((k: KeywordItem) => Boolean(k.text));
        }
        setKeywords(kwList);

        setCanonicalUrl(data.canonicalUrl || `https://smarttaxexperts.com${page.slug === 'home' ? '' : '/' + page.slug}`);
        setRobotsIndex(data.robotsIndex ?? true);
        setRobotsFollow(data.robotsFollow ?? true);
        setSitemapPriority(data.sitemapPriority || (page.slug === 'home' ? '1.0' : '0.8'));
        setSitemapChange(data.sitemapChange || 'weekly');

        setOgTitle(data.ogTitle || data.metaTitle || '');
        setOgDescription(data.ogDescription || data.metaDescription || '');
        setOgImage(data.ogImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200');
        setTwitterTitle(data.twitterTitle || data.metaTitle || '');
        setTwitterDescription(data.twitterDescription || data.metaDescription || '');
        setTwitterImage(data.twitterImage || data.ogImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200');

      } else {
        // Generate pre-populated defaults
        const defTitle = `${page.title} | Smart Tax Experts (STE) - CPA Advisory`;
        const defDesc = page.description || 'Premier US tax preparation, GAAP accounting, and scalable offshore CPA outsourcing with 24-48h SLAs.';
        const defCanonical = `https://smarttaxexperts.com${page.slug === 'home' ? '' : '/' + page.slug}`;

        setMetaTitle(defTitle);
        setMetaDescription(defDesc);
        setKeywords([
          { id: 'kw-0', text: 'Smart Tax Experts', isPrimary: true },
          { id: 'kw-1', text: `${page.title} Services`, isPrimary: false },
          { id: 'kw-2', text: 'US Tax Advisory', isPrimary: false },
          { id: 'kw-3', text: 'CPA Outsourcing', isPrimary: false },
        ]);
        setCanonicalUrl(defCanonical);
        setRobotsIndex(true);
        setRobotsFollow(true);
        setSitemapPriority(page.slug === 'home' ? '1.0' : '0.8');
        setSitemapChange('weekly');

        setOgTitle(defTitle);
        setOgDescription(defDesc);
        setOgImage('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200');
        setTwitterTitle(defTitle);
        setTwitterDescription(defDesc);
        setTwitterImage('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200');
      }
    } catch {
      showToast('error', 'Failed to load page SEO parameters.');
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // Fetch full site audit
  const runAudit = async () => {
    setAuditLoading(true);
    try {
      const data: any = await seoApi.getAudit();
      setAuditData(data);
    } catch {
      showToast('error', 'Audit inspection failed.');
    } finally {
      setAuditLoading(false);
    }
  };

  // Fetch robots.txt
  const loadRobotsTxt = async () => {
    setRobotsTxtLoading(true);
    try {
      const res: any = await seoApi.getRobotsTxt();
      if (res && res.content) {
        setRobotsTxtContent(res.content);
      }
    } catch {
      // Handled silently
    } finally {
      setRobotsTxtLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'audit' && !auditData) {
      runAudit();
    }
    if (activeTab === 'technical' && !robotsTxtContent) {
      loadRobotsTxt();
    }
  }, [activeTab]);

  // Keyword operations
  const processKeywordsInput = (inputString: string) => {
    if (!inputString || !inputString.trim()) return;
    const parts = inputString
      .split(/[,;\n]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (parts.length === 0) return;

    const existingLower = new Set(keywords.map((k: KeywordItem) => k.text.toLowerCase()));
    const newItems: KeywordItem[] = [];

    parts.forEach((part, index) => {
      const lower = part.toLowerCase();
      if (!existingLower.has(lower)) {
        existingLower.add(lower);
        newItems.push({
          id: `kw-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`,
          text: part,
          isPrimary: keywords.length === 0 && newItems.length === 0,
        });
      }
    });

    if (newItems.length > 0) {
      setKeywords(prev => [...prev, ...newItems]);
      showToast('success', `Added ${newItems.length} keyword${newItems.length > 1 ? 's' : ''}.`);
    } else {
      showToast('error', 'Keywords already exist or duplicate entries detected.');
    }
    setNewKeywordInput('');
  };

  const handleAddKeyword = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    processKeywordsInput(newKeywordInput);
  };

  const handleRemoveKeyword = (id: string) => {
    const next = keywords.filter(k => k.id !== id);
    if (next.length > 0 && !next.some(k => k.isPrimary)) {
      next[0].isPrimary = true;
    }
    setKeywords(next);
  };

  const handleSetPrimary = (id: string) => {
    setKeywords(keywords.map(k => ({ ...k, isPrimary: k.id === id })));
  };

  const handleClearKeywords = () => {
    if (keywords.length === 0) return;
    setKeywords([]);
    showToast('success', 'All targeted keywords cleared.');
  };

  // Save SEO configuration
  const handleSave = async () => {
    if (!selectedPage) return;
    setSaving(true);
    try {
      const payload = {
        metaTitle,
        metaDescription,
        metaKeywords: keywords.map(k => k.text),
        canonicalUrl,
        robotsIndex,
        robotsFollow,
        ogTitle: ogTitle || metaTitle,
        ogDescription: ogDescription || metaDescription,
        ogImage,
        twitterTitle: twitterTitle || metaTitle,
        twitterDescription: twitterDescription || metaDescription,
        twitterImage: twitterImage || ogImage,
        sitemapPriority,
        sitemapChange,
      };

      await seoApi.update(selectedPage.id, payload);
      showToast('success', `SEO for "${selectedPage.title}" saved & synchronized with live website!`);

      // If on technical tab and robots.txt changed, save robots
      if (activeTab === 'technical' && robotsTxtContent) {
        await seoApi.updateRobotsTxt(robotsTxtContent);
      }
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update SEO configurations.');
    } finally {
      setSaving(false);
    }
  };

  // Filtered page list
  const filteredPages = useMemo(() => {
    if (!pageSearch.trim()) return pages;
    return pages.filter(p =>
      p.title.toLowerCase().includes(pageSearch.toLowerCase()) ||
      p.slug.toLowerCase().includes(pageSearch.toLowerCase())
    );
  }, [pages, pageSearch]);

  // Live calculation of current page SEO score
  const pageScore = useMemo(() => {
    let score = 100;
    if (!metaTitle) score -= 30;
    else if (metaTitle.length < 35 || metaTitle.length > 65) score -= 10;

    if (!metaDescription) score -= 30;
    else if (metaDescription.length < 120 || metaDescription.length > 165) score -= 10;

    if (!canonicalUrl) score -= 15;
    if (keywords.length === 0) score -= 10;
    if (!ogImage) score -= 10;
    return Math.max(10, Math.min(100, score));
  }, [metaTitle, metaDescription, canonicalUrl, keywords, ogImage]);

  return (
    <AdminLayout>
      <div className="p-4 sm:p-7 max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-teal-500/20">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                <span>Enterprise SEO & Metadata Optimization Engine</span>
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-700 dark:text-cyan-300 border border-teal-500/30 uppercase">
                Live Dynamic Sync
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Configure page meta titles, rich descriptions, multi-keyword targets, canonical URLs, Open Graph previews, and valid JSON-LD schemas. Updates immediately synchronize with live website head tags and XML sitemaps.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !selectedPage}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              <span>{saving ? 'Publishing...' : 'Save & Publish SEO'}</span>
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toast && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 border shadow-sm transition-all ${
              toast.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-300'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Main Grid: Left Page Selector + Right Tabbed Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Page Selection Directory (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white/80 dark:bg-[#071A22]/70 border border-teal-500/20 rounded-3xl p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-teal-500/10">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Public Website Pages ({pages.length})
                </span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono font-bold">
                  {selectedPage ? `/${selectedPage.slug}` : ''}
                </span>
              </div>

              {/* Search filter input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={pageSearch}
                  onChange={(e) => setPageSearch(e.target.value)}
                  placeholder="Search pages by name or slug..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Pages List */}
              <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1 custom-scrollbar">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-14 rounded-2xl bg-teal-500/5 animate-pulse" />
                  ))
                ) : filteredPages.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">No matching pages found.</p>
                ) : (
                  filteredPages.map((page) => {
                    const isSelected = selectedPage?.id === page.id;
                    return (
                      <button
                        key={page.id}
                        type="button"
                        onClick={() => loadPageSeo(page)}
                        className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer border flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-teal-500/15 border-teal-500 text-slate-900 dark:text-white shadow-sm'
                            : 'bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/5 hover:border-teal-500/30 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-xs truncate">
                            {page.title}
                          </p>
                          <p className="text-[10px] text-teal-600 dark:text-teal-400 font-mono truncate">
                            {page.slug === 'home' ? '/' : `/${page.slug}`}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-bold">
                            {page.slug === 'home' ? 'Index' : 'Public'}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick SEO Health Snapshot */}
            {selectedPage && (
              <div className="bg-white/80 dark:bg-[#071A22]/70 border border-teal-500/20 rounded-3xl p-5 backdrop-blur-xl shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Page SEO Health
                  </span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                    pageScore >= 80 ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' :
                    pageScore >= 50 ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
                    'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                  }`}>
                    {pageScore} / 100
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pageScore >= 80 ? 'bg-emerald-500' : pageScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${pageScore}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {pageScore >= 80
                    ? 'Excellent configuration. All core meta tags, keywords, canonical URLs and social previews are complete.'
                    : 'Action recommended. Complete the missing titles, descriptions, and keywords to maximize search visibility.'}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Tabbed SEO Controls & Live Previews (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            {/* Navigation Tabs */}
            <div className="flex border-b border-teal-500/20 gap-1.5 text-xs font-semibold overflow-x-auto pb-1">
              {[
                { id: 'general', label: 'Meta & Search', icon: <Globe size={14} /> },
                { id: 'keywords', label: 'Target Keywords', icon: <Tag size={14} /> },
                { id: 'audit', label: 'Site-wide Audit', icon: <BarChart3 size={14} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as SEOTab)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer font-semibold shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB 1: General (Meta Title, Description, Google Search Preview) */}
            {activeTab === 'general' && (
              <div className="space-y-5">
                {/* Google Search Result Preview Card */}
                <div className="bg-[#031417] border border-teal-500/25 rounded-3xl p-5 text-slate-200 shadow-xl space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-teal-500/15">
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <Search size={12} />
                      <span>Google Search Result Snippet Preview</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Desktop & Mobile</span>
                  </div>

                  <div className="pt-2 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <span>{canonicalUrl || 'https://smarttaxexperts.com'}</span>
                    </div>
                    <h3 className="text-base font-medium text-[#8ab4f8] hover:underline cursor-pointer leading-snug">
                      {metaTitle || 'Add a Meta Title Tag to preview Google result...'}
                    </h3>
                    <p className="text-xs text-[#bdc1c6] leading-relaxed line-clamp-2">
                      {metaDescription || 'Add a Meta Description Tag to preview Google search engine snippet snippet here...'}
                    </p>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="bg-white/80 dark:bg-[#071A22]/70 border border-teal-500/20 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-xl space-y-5">
                  {/* Meta Title */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Meta Title Tag
                      </label>
                      <span className={`text-[11px] font-mono font-medium ${
                        metaTitle.length >= 50 && metaTitle.length <= 60
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : metaTitle.length > 60
                          ? 'text-rose-500'
                          : 'text-slate-500'
                      }`}>
                        {metaTitle.length} / 60 characters (recommended 50-60)
                      </span>
                    </div>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="e.g. About Us | Smart Tax Experts (STE) - CPA Advisory"
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-teal-500/25 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500 font-medium"
                    />
                  </div>

                  {/* Meta Description */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Meta Description Tag
                      </label>
                      <span className={`text-[11px] font-mono font-medium ${
                        metaDescription.length >= 150 && metaDescription.length <= 160
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : metaDescription.length > 160
                          ? 'text-rose-500'
                          : 'text-slate-500'
                      }`}>
                        {metaDescription.length} / 160 characters (recommended 150-160)
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="e.g. Explore our firm's heritage, certified CPA credentials, and institutional review standards..."
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-teal-500/25 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500 font-medium resize-none leading-relaxed"
                    />
                  </div>

                  {/* Canonical URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                      Canonical Tag URL (rel="canonical")
                    </label>
                    <input
                      type="url"
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      placeholder="https://smarttaxexperts.com/..."
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-teal-500/25 text-slate-900 dark:text-slate-100 font-mono placeholder-slate-400 focus:outline-none focus:border-teal-500"
                    />
                    <p className="text-[10px] text-slate-500">
                      Declares the authoritative original URL to search engines, preventing duplicate content dilution.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Multiple Keywords Management */}
            {activeTab === 'keywords' && (
              <div className="bg-white/80 dark:bg-[#071A22]/70 border border-teal-500/20 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-xl space-y-6">
                <div>
                  <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Tag className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Multiple Keyword Targeting & Planning</span>
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Assign primary and secondary keywords for this page. Target keywords are monitored against title and heading density to ensure natural, organic search optimization.
                  </p>
                </div>

                {/* Add Keyword Form */}
                <form onSubmit={handleAddKeyword} className="space-y-3">
                  <div className="flex gap-2.5">
                    <input
                      type="text"
                      value={newKeywordInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.endsWith(',')) {
                          processKeywordsInput(val.slice(0, -1));
                        } else {
                          setNewKeywordInput(val);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          processKeywordsInput(newKeywordInput);
                        }
                      }}
                      placeholder="Paste comma-separated keywords or type single keyword (e.g. Tax Consultant in Ahmedabad, Tax Planning, GST Filing)..."
                      className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-teal-500/25 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddKeyword()}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-md transition-all cursor-pointer shrink-0"
                    >
                      <Plus size={14} />
                      <span>Add Keyword(s)</span>
                    </button>
                    {keywords.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearKeywords}
                        className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/30 transition-all cursor-pointer shrink-0"
                        title="Clear all targeted keywords on this page"
                      >
                        <Trash2 size={13} />
                        <span>Clear All</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    💡 <b>Tip:</b> You can paste multiple keywords separated by commas. Each will be automatically trimmed, validated, deduplicated, and converted into separate keyword tags.
                  </p>
                </form>

                {/* Targeted Keywords Summary & List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                      Targeted Keywords ({keywords.length})
                    </span>
                    <div className="flex items-center gap-3">
                      {keywords.length > 0 && (
                        <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                          Primary: <b>{keywords.find(k => k.isPrimary)?.text || 'None'}</b>
                        </span>
                      )}
                      {keywords.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearKeywords}
                          className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 size={11} />
                          <span>Clear all ({keywords.length})</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {keywords.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center">No keywords assigned yet. Add one above.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2.5">
                      {keywords.map((kw) => (
                        <div
                          key={kw.id}
                          className={`px-3 py-1.5 rounded-xl text-xs border flex items-center gap-2 transition-all ${
                            kw.isPrimary
                              ? 'bg-teal-500/15 border-teal-500 text-teal-800 dark:text-teal-200 font-bold shadow-sm'
                              : 'bg-white dark:bg-white/5 border-slate-200 dark:border-teal-500/20 text-slate-700 dark:text-slate-300 font-medium'
                          }`}
                        >
                          <span>{kw.text}</span>

                          {kw.isPrimary ? (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-teal-600 text-white">
                              Primary
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(kw.id)}
                              className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                              title="Set as Primary Keyword"
                            >
                              Make Primary
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(kw.id)}
                            className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                            title="Remove keyword"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Keyword Analysis Box */}
                <div className="p-4 rounded-2xl bg-teal-500/5 border border-teal-500/15 text-xs text-slate-700 dark:text-slate-300 space-y-2">
                  <span className="font-bold text-teal-700 dark:text-teal-300 block">
                    Keyword Density & Content Placement:
                  </span>
                  <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-600 dark:text-slate-400">
                    <li>Primary keyword: <b>{keywords.find(k => k.isPrimary)?.text || 'None selected'}</b></li>
                    <li>Ensure the primary keyword appears naturally in the page H1 heading and first paragraph.</li>
                    <li>Avoid unnatural repetition ("keyword stuffing") to maintain high search rank quality scores.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 4: Site-wide SEO Audit */}
            {activeTab === 'audit' && (
              <div className="bg-white/80 dark:bg-[#071A22]/70 border border-teal-500/20 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-teal-500/15">
                  <div>
                    <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>Full Website Automated SEO Audit</span>
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Scans meta tag lengths, duplicate descriptions, structured data validations, and canonical alignments across every registered page.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={runAudit}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-md transition-all cursor-pointer shrink-0"
                  >
                    <RefreshCw size={13} className={auditLoading ? 'animate-spin' : ''} />
                    <span>Run Full Audit</span>
                  </button>
                </div>

                {auditLoading ? (
                  <div className="py-12 text-center text-xs text-slate-500">
                    <RefreshCw size={24} className="animate-spin mx-auto text-teal-500 mb-2" />
                    <span>Scanning website pages and verifying metadata...</span>
                  </div>
                ) : auditData ? (
                  <div className="space-y-6">
                    {/* Overall Score KPI Card */}
                    <div className="p-5 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <span className="text-xs text-teal-700 dark:text-teal-300 font-bold uppercase tracking-wider">
                          Site-Wide SEO Health Score
                        </span>
                        <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                          {auditData.overallScore} / 100
                        </div>
                      </div>
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        Total {auditData.pagesAudited} pages analyzed
                      </span>
                    </div>

                    {/* Pages Breakdown Table */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                        Page-by-Page Audit Breakdown
                      </span>

                      <div className="space-y-2">
                        {auditData.audits?.map((audit: any) => (
                          <div
                            key={audit.pageId}
                            className="p-3.5 rounded-2xl border border-teal-500/15 bg-white dark:bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white">
                                  {audit.pageTitle}
                                </span>
                                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">
                                  /{audit.pageSlug}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-2 mt-1.5">
                                {audit.issues?.map((iss: any, i: number) => (
                                  <span
                                    key={i}
                                    className={`text-[10px] px-2 py-0.5 rounded-lg font-medium flex items-center gap-1 ${
                                      iss.type === 'critical'
                                        ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                                        : iss.type === 'warning'
                                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                                        : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                    }`}
                                  >
                                    {iss.type === 'critical' && <XCircle size={10} />}
                                    {iss.type === 'warning' && <AlertTriangle size={10} />}
                                    {iss.type === 'good' && <CheckCircle2 size={10} />}
                                    <span>{iss.message}</span>
                                  </span>
                                ))}
                              </div>
                            </div>

                            <span className={`font-black text-xs px-2.5 py-1 rounded-xl shrink-0 self-end md:self-center ${
                              audit.score >= 80 ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' :
                              audit.score >= 50 ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300' :
                              'bg-rose-500/20 text-rose-600 dark:text-rose-300'
                            }`}>
                              {audit.score} / 100
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default SEOManagerPage;
