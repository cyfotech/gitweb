import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Edit, Trash2, Eye, EyeOff, RefreshCw, GripVertical, X, Save,
  Briefcase, Search, Layers, Clock, CheckCircle2, AlertCircle, Copy, Star,
  Upload, Image as ImageIcon, ExternalLink, HelpCircle, ListOrdered, CheckSquare,
  Sparkles, PlayCircle
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { ThreeDCard, MagneticButton } from '../components/ThreeDComponents';
import { servicesApi } from '../../api/services';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
}

export function ServiceManagerPage() {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPageConfigModal, setShowPageConfigModal] = useState(false);
  const [savingPageConfig, setSavingPageConfig] = useState(false);
  const [pageConfig, setPageConfig] = useState({
    badge: 'Practice Directory',
    heading: 'Complete Practice Catalog',
    description: 'Explore all specialized disciplines across personal tax compliance, corporate accounting, and dedicated white-label CPA firm capacity.',
    searchPlaceholder: 'Search practices, deliverables, forms...',
    emptyStateHeading: 'No services matched',
    emptyStateSubtext: 'Try searching for 1040, 1120-S, bookkeeping, reconciliation, or audit.',
    resetButtonText: 'Reset Filters',
    exploreButtonText: 'Explore Service',
    featuresSectionBadge: 'Comprehensive Scope',
    featuresSectionHeading: "What This Service Includes",
    featuresSectionSubtext: 'Every engagement is engineered for complete tax efficiency, zero filing errors, and audit-ready documentation.',
    deliverablesBoxHeading: 'Official Deliverables You Receive:',
    workflowSectionBadge: 'Structured Execution',
    workflowSectionHeading: 'How This Service Works',
    workflowSectionSubtext: 'A battle-tested 4-step framework from initial document intake to final certified filing.',
    simulationBadge: 'Interactive service walkthrough',
    simulationSubtext: 'Explore the stages, checkpoints, and handoffs that shape this service from start to delivery.',
    benefitsSectionBadge: 'Measurable Value',
    benefitsSectionHeading: 'Proven Benefits & Efficiency Gains',
    faqsSectionBadge: 'Clarifications',
    faqsSectionHeading: 'Frequently Asked Questions',
    ctaBannerBadge: 'Ready to Engage?',
    ctaBannerSubtext: 'Book a 1-on-1 discovery consultation. We will preselect this service, evaluate your filing deadlines, and provide a clear, transparent engagement proposal.',
    ctaButtonText: 'Book Consultation Now',
  });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategorySlug, setNewCategorySlug] = useState('');
  const [formTab, setFormTab] = useState<'general' | 'content' | 'animation' | 'media' | 'seo'>('general');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const emptyForm = {
    slug: '', name: '', shortDescription: '', fullDescription: '',
    iconName: 'FileText', deliverables: '', idealFor: '',
    turnaroundTime: '2-4 Days', isPopular: false, isPublished: true,
    demoType: 'tax-workflow', heroTagline: '', features: '', workflow: '',
    benefits: '', faqs: '', relatedSlugs: '',
    metaTitle: '', metaDescription: '', coverImage: '', categoryId: '',
    // Live Hero Workflow Animation fields
    animEyebrow: '',
    animSource: '',
    animFocus: '',
    animResult: '',
    animMetric: '',
    animStages: '',
    // Custom animation digits / stat cards
    stat1Label: '',
    stat1Value: '',
    stat1Sub: '',
    stat2Label: '',
    stat2Value: '',
    stat2Sub: '',
    stat3Label: '',
    stat3Value: '',
    stat3Sub: '',
  };

  // Helper converters between structured backend data and clean human-readable plain text
  const deliverablesToText = (raw: any): string => {
    if (!raw) return '';
    let arr = raw;
    if (typeof raw === 'string') {
      try { arr = JSON.parse(raw); } catch { return raw; }
    }
    if (Array.isArray(arr)) {
      return arr.map(i => typeof i === 'string' ? i : (i.title || i.name || JSON.stringify(i))).join('\n');
    }
    return String(arr);
  };

  const textToDeliverables = (text: string): string[] => {
    if (!text) return [];
    const trimmed = text.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try { return JSON.parse(trimmed); } catch {}
    }
    return text.split('\n').map(l => l.trim().replace(/^[-*•]\s*/, '')).filter(Boolean);
  };

  const featuresToText = (raw: any): string => {
    if (!raw) return '';
    let arr = raw;
    if (typeof raw === 'string') {
      try { arr = JSON.parse(raw); } catch { return raw; }
    }
    if (Array.isArray(arr)) {
      return arr.map(f => `${f.title || ''} : ${f.desc || f.description || ''}`).join('\n');
    }
    return String(raw);
  };

  const textToFeatures = (text: string): { title: string; desc: string }[] => {
    if (!text) return [];
    const trimmed = text.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try { return JSON.parse(trimmed); } catch {}
    }
    return text.split('\n').map(l => l.trim()).filter(Boolean).map(line => {
      const clean = line.replace(/^[-*•]\s*/, '');
      const sep = clean.includes(' : ') ? ' : ' : (clean.includes(':') ? ':' : '|');
      const parts = clean.split(sep).map(p => p.trim());
      return {
        title: parts[0] || '',
        desc: parts.slice(1).join(sep).trim() || ''
      };
    });
  };

  const benefitsToText = (raw: any): string => {
    if (!raw) return '';
    let arr = raw;
    if (typeof raw === 'string') {
      try { arr = JSON.parse(raw); } catch { return raw; }
    }
    if (Array.isArray(arr)) {
      return arr.map(b => `${b.stat || '99.9%'} | ${b.title || ''} | ${b.description || ''}`).join('\n');
    }
    return String(raw);
  };

  const textToBenefits = (text: string): { stat: string; title: string; description: string }[] => {
    if (!text) return [];
    const trimmed = text.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try { return JSON.parse(trimmed); } catch {}
    }
    return text.split('\n').map(l => l.trim()).filter(Boolean).map(line => {
      const clean = line.replace(/^[-*•]\s*/, '');
      const parts = clean.split('|').map(p => p.trim());
      if (parts.length >= 3) {
        return { stat: parts[0], title: parts[1], description: parts.slice(2).join(' | ') };
      } else if (parts.length === 2) {
        return { stat: '', title: parts[0], description: parts[1] };
      }
      return { stat: '', title: parts[0], description: '' };
    });
  };

  const workflowToText = (raw: any): string => {
    if (!raw) return '';
    let arr = raw;
    if (typeof raw === 'string') {
      try { arr = JSON.parse(raw); } catch { return raw; }
    }
    if (Array.isArray(arr)) {
      return arr.map((w, i) => `${w.step || (i + 1 < 10 ? '0' + (i + 1) : String(i + 1))} | ${w.title || ''} | ${w.description || ''} | ${w.deliverable || ''}`).join('\n');
    }
    return String(raw);
  };

  const textToWorkflow = (text: string): { step: string; title: string; description: string; deliverable: string }[] => {
    if (!text) return [];
    const trimmed = text.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try { return JSON.parse(trimmed); } catch {}
    }
    return text.split('\n').map(l => l.trim()).filter(Boolean).map((line, i) => {
      const clean = line.replace(/^[-*•]\s*/, '');
      const parts = clean.split('|').map(p => p.trim());
      return {
        step: parts[0] || (i + 1 < 10 ? '0' + (i + 1) : String(i + 1)),
        title: parts[1] || '',
        description: parts[2] || '',
        deliverable: parts[3] || ''
      };
    });
  };

  const faqsToText = (raw: any): string => {
    if (!raw) return '';
    let arr = raw;
    if (typeof raw === 'string') {
      try { arr = JSON.parse(raw); } catch { return raw; }
    }
    if (Array.isArray(arr)) {
      return arr.map(f => `Q: ${f.question || ''}\nA: ${f.answer || ''}`).join('\n\n');
    }
    return String(raw);
  };

  const textToFaqs = (text: string): { question: string; answer: string }[] => {
    if (!text) return [];
    const trimmed = text.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try { return JSON.parse(trimmed); } catch {}
    }
    const blocks = text.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
    const out: { question: string; answer: string }[] = [];
    for (const block of blocks) {
      if (block.includes('A:') || block.startsWith('Q:')) {
        const qMatch = block.match(/Q:\s*(.*?)(?=\nA:|$)/s);
        const aMatch = block.match(/A:\s*(.*)/s);
        out.push({
          question: qMatch ? qMatch[1].trim() : block.split('\n')[0].replace(/^Q:\s*/, '').trim(),
          answer: aMatch ? aMatch[1].trim() : ''
        });
      } else if (block.includes('|')) {
        const parts = block.split('|').map(p => p.trim());
        out.push({ question: parts[0], answer: parts.slice(1).join(' | ') });
      } else {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        out.push({ question: lines[0] || '', answer: lines.slice(1).join(' ') || '' });
      }
    }
    return out;
  };

  const relatedSlugsToText = (raw: any): string => {
    if (!raw) return '';
    let arr = raw;
    if (typeof raw === 'string') {
      try { arr = JSON.parse(raw); } catch { return raw; }
    }
    if (Array.isArray(arr)) {
      return arr.join(', ');
    }
    return String(raw);
  };

  const textToRelatedSlugs = (text: string): string[] => {
    if (!text) return [];
    return text.split(/[,\n]/).map(s => s.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '')).filter(Boolean);
  };

  const [form, setForm] = useState<typeof emptyForm>(emptyForm);

  const fetchCategories = async () => {
    try {
      const data = await servicesApi.getCategories();
      if (Array.isArray(data)) setCategories(data);
    } catch {
      // Fallback
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await servicesApi.getAllAdmin();
      setServices(Array.isArray(data) ? data : []);
    } catch {
      // Fallback to public if needed
      try {
        const fallback = await servicesApi.getAll();
        setServices(Array.isArray(fallback) ? fallback : []);
      } catch {
        // Silently
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPageConfig = async () => {
    try {
      const data = await servicesApi.getPageConfig();
      if (data && typeof data === 'object') {
        setPageConfig(prev => ({ ...prev, ...data }));
      }
    } catch {}
  };

  const handleSavePageConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPageConfig(true);
    try {
      await servicesApi.updatePageConfig(pageConfig);
      setShowPageConfigModal(false);
      alert('Services page header and search configuration saved successfully!');
    } catch (err: any) {
      alert('Failed to save page configuration: ' + (err.message || 'Error'));
    } finally {
      setSavingPageConfig(false);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
    fetchPageConfig();
  }, []);

  const openEdit = (service: any) => {
    setEditingService(service);
    setFormTab('general');
    const heroAnim = service.additionalImages?.heroAnimationConfig || {};
    const animStages = Array.isArray(heroAnim.stages)
      ? heroAnim.stages.join('\n')
      : (service.workflow && Array.isArray(service.workflow) && service.workflow.length >= 4
          ? service.workflow.slice(0, 4).map((w: any) => w.title).join('\n')
          : '');

    setForm({
      ...emptyForm,
      ...service,
      coverImage: service.heroImage || service.thumbnailImage || '',
      categoryId: service.categoryId || service.servicecategory?.id || '',
      deliverables: deliverablesToText(service.deliverables),
      features: featuresToText(service.features),
      workflow: workflowToText(service.workflow),
      benefits: benefitsToText(service.benefits),
      faqs: faqsToText(service.faqs),
      relatedSlugs: relatedSlugsToText(service.relatedSlugs),
      animEyebrow: heroAnim.eyebrow || '',
      animSource: heroAnim.source || '',
      animFocus: heroAnim.focus || '',
      animResult: heroAnim.result || '',
      animMetric: heroAnim.metric || '',
      animStages: animStages,
      stat1Label: heroAnim.stat1Label || '',
      stat1Value: heroAnim.stat1Value || '',
      stat1Sub: heroAnim.stat1Sub || '',
      stat2Label: heroAnim.stat2Label || '',
      stat2Value: heroAnim.stat2Value || '',
      stat2Sub: heroAnim.stat2Sub || '',
      stat3Label: heroAnim.stat3Label || '',
      stat3Value: heroAnim.stat3Value || '',
      stat3Sub: heroAnim.stat3Sub || '',
    });
    setShowForm(true);
  };

  const openCreate = () => {
    setEditingService(null);
    setFormTab('general');
    setForm({
      ...emptyForm,
      categoryId: categories[0]?.id || '',
    });
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res: any = await servicesApi.uploadImage(formData);
      if (res && res.url) {
        setForm((prev) => ({ ...prev, coverImage: res.url }));
      }
    } catch (err: any) {
      alert('Failed to upload image: ' + (err.message || 'Error'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await servicesApi.createCategory({
        name: newCategoryName.trim(),
        slug: newCategorySlug.trim() || undefined,
      });
      setNewCategoryName('');
      setNewCategorySlug('');
      setShowCategoryModal(false);
      fetchCategories();
    } catch (err: any) {
      alert('Failed to create category: ' + (err.message || 'Error'));
    }
  };

  const handleSave = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Build animation config from plain text fields if provided
      const stagesArray = form.animStages
        ? form.animStages.split('\n').map(s => s.trim()).filter(Boolean)
        : [];

      const currentAdditionalImages = editingService?.additionalImages || {};
      const heroAnimationConfig: any = {
        ...(typeof currentAdditionalImages === 'object' && currentAdditionalImages.heroAnimationConfig ? currentAdditionalImages.heroAnimationConfig : {})
      };
      if (form.animEyebrow.trim()) heroAnimationConfig.eyebrow = form.animEyebrow.trim();
      if (form.animSource.trim()) heroAnimationConfig.source = form.animSource.trim();
      if (form.animFocus.trim()) heroAnimationConfig.focus = form.animFocus.trim();
      if (form.animResult.trim()) heroAnimationConfig.result = form.animResult.trim();
      if (form.animMetric.trim()) heroAnimationConfig.metric = form.animMetric.trim();
      if (stagesArray.length > 0) heroAnimationConfig.stages = stagesArray;

      // Custom digits / stat numbers
      if (form.stat1Label.trim()) heroAnimationConfig.stat1Label = form.stat1Label.trim();
      if (form.stat1Value.trim()) heroAnimationConfig.stat1Value = form.stat1Value.trim();
      if (form.stat1Sub.trim()) heroAnimationConfig.stat1Sub = form.stat1Sub.trim();
      if (form.stat2Label.trim()) heroAnimationConfig.stat2Label = form.stat2Label.trim();
      if (form.stat2Value.trim()) heroAnimationConfig.stat2Value = form.stat2Value.trim();
      if (form.stat2Sub.trim()) heroAnimationConfig.stat2Sub = form.stat2Sub.trim();
      if (form.stat3Label.trim()) heroAnimationConfig.stat3Label = form.stat3Label.trim();
      if (form.stat3Value.trim()) heroAnimationConfig.stat3Value = form.stat3Value.trim();
      if (form.stat3Sub.trim()) heroAnimationConfig.stat3Sub = form.stat3Sub.trim();

      const additionalImages = {
        ...(typeof currentAdditionalImages === 'object' ? currentAdditionalImages : {}),
        heroAnimationConfig: Object.keys(heroAnimationConfig).length > 0 ? heroAnimationConfig : undefined,
      };

      const payload = {
        ...form,
        isPublished: isDraft ? false : form.isPublished,
        deliverables: textToDeliverables(form.deliverables),
        features: textToFeatures(form.features),
        workflow: textToWorkflow(form.workflow),
        benefits: textToBenefits(form.benefits),
        faqs: textToFaqs(form.faqs),
        relatedSlugs: textToRelatedSlugs(form.relatedSlugs),
        heroImage: form.coverImage || undefined,
        thumbnailImage: form.coverImage || undefined,
        additionalImages,
      };

      if (editingService) {
        await servicesApi.update(editingService.id, payload);
      } else {
        await servicesApi.create(payload);
      }
      setShowForm(false);
      fetchServices();
    } catch (err: any) {
      alert('Failed to save service: ' + (err.message || 'Error'));
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (service: any) => {
    try {
      await servicesApi.setStatus(service.id, !service.isPublished);
      fetchServices();
    } catch (err: any) {
      alert('Failed to update status: ' + (err.message || 'Error'));
    }
  };

  const toggleFeatured = async (service: any) => {
    try {
      await servicesApi.setFeatured(service.id, !service.isFeatured);
      fetchServices();
    } catch (err: any) {
      alert('Failed to update featured: ' + (err.message || 'Error'));
    }
  };

  const handleDuplicate = async (service: any) => {
    if (!confirm(`Duplicate "${service.name}"?`)) return;
    try {
      await servicesApi.duplicate(service.id);
      fetchServices();
    } catch (err: any) {
      alert('Failed to duplicate: ' + (err.message || 'Error'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this service offering?')) return;
    try {
      await servicesApi.delete(id);
      fetchServices();
    } catch (err: any) {
      alert('Failed to delete: ' + (err.message || 'Error'));
    }
  };

  const handleDrop = async (dropIdx: number) => {
    if (dragIdx === null || dragIdx === dropIdx) { setDragIdx(null); return; }
    const newServices = [...services];
    const [moved] = newServices.splice(dragIdx, 1);
    newServices.splice(dropIdx, 0, moved);
    const reordered = newServices.map((s, i) => ({ ...s, displayOrder: i }));
    setServices(reordered);
    setDragIdx(null);
    try {
      await servicesApi.reorder(reordered.map(s => ({ id: s.id, displayOrder: s.displayOrder })));
    } catch {
      // Reorder fallback
    }
  };

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || s.servicecategory?.slug === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <AdminLayout>
      <div className="p-5 sm:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                <Briefcase className="w-6 h-6 text-teal-500" />
                <span>Practice Directory & Services CMS</span>
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-300 border border-teal-500/20">
                {services.length} Total Services
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Configure deliverables, SLA turnaround commitments, and category mapping across all verticals
            </p>
          </div>

          <div className="flex items-center gap-3">
            <MagneticButton
              onClick={() => setShowPageConfigModal(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-white/5 border border-teal-500/20 hover:bg-teal-500/10 transition-all cursor-pointer shadow-sm"
            >
              <Edit size={14} className="text-teal-500" />
              <span>Edit Services Page Header</span>
            </MagneticButton>

            <MagneticButton
              onClick={() => setShowCategoryModal(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-white/5 border border-teal-500/20 hover:bg-teal-500/10 transition-all cursor-pointer shadow-sm"
            >
              <Layers size={14} />
              <span>Manage Categories</span>
            </MagneticButton>

            <MagneticButton
              onClick={fetchServices}
              className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 border border-teal-500/20 hover:bg-teal-500/10 transition-all cursor-pointer shadow-sm"
              title="Refresh"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </MagneticButton>

            <MagneticButton
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Add New Service</span>
            </MagneticButton>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#071A22]/70 border border-teal-500/15 backdrop-blur-xl shadow-md flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search services by title or scope description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/5 dark:bg-white/5 border border-teal-500/15 rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-black/5 dark:bg-[#071A22] border border-teal-500/15 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-400"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3D Services List */}
        <div className="space-y-3">
          {loading && services.length === 0 ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-white/40 dark:bg-white/5 border border-teal-500/10 animate-pulse" />
            ))
          ) : filteredServices.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              No matching practice offerings found.
            </div>
          ) : (
            filteredServices.map((service, idx) => (
              <ThreeDCard
                key={service.id}
                intensity={8}
                draggable
                onDragStart={() => setDragIdx(idx)}
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleDrop(idx)}
                className="bg-white/80 dark:bg-[#071A22]/80 border border-teal-500/15 p-4 sm:p-5 shadow-lg backdrop-blur-xl flex items-center gap-4 group hover:border-teal-400/40 transition-all cursor-default"
              >
                <GripVertical size={16} className="text-slate-400 group-hover:text-teal-400 cursor-grab shrink-0" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {service.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-300 border border-teal-500/20 capitalize">
                      {service.servicecategory?.slug || 'Practice'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${service.isPublished
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-500/15 text-slate-500'
                      }`}>
                      {service.isPublished ? 'Live' : 'Hidden'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {service.isFeatured && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                      ★ Featured
                    </span>
                  )}
                  <button
                    onClick={() => window.open(`/services/${service.slug}`, '_blank')}
                    className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-500/10 transition-all cursor-pointer"
                    title="Preview on Website"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => handleDuplicate(service)}
                    className="p-2 rounded-xl text-slate-500 hover:text-violet-600 dark:hover:text-violet-300 hover:bg-violet-500/10 transition-all cursor-pointer"
                    title="Duplicate Service"
                  >
                    <Copy size={15} />
                  </button>
                  <button
                    onClick={() => toggleFeatured(service)}
                    className="p-2 rounded-xl text-slate-500 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-amber-500/10 transition-all cursor-pointer"
                    title={service.isFeatured ? 'Unfeature' : 'Set Featured'}
                  >
                    <Star size={15} className={service.isFeatured ? 'fill-amber-400 text-amber-500' : ''} />
                  </button>
                  <button
                    onClick={() => togglePublish(service)}
                    className="p-2 rounded-xl text-slate-500 hover:text-teal-600 dark:hover:text-teal-300 hover:bg-teal-500/10 transition-all cursor-pointer"
                    title={service.isPublished ? 'Unpublish' : 'Publish'}
                  >
                    {service.isPublished ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button
                    onClick={() => openEdit(service)}
                    className="p-2 rounded-xl text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-cyan-500/10 transition-all cursor-pointer"
                    title="Edit Service"
                  >
                    <Edit size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-500/10 transition-all cursor-pointer"
                    title="Delete Service"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </ThreeDCard>
            ))
          )}
        </div>

        {/* 3D Edit/Create Modal */}
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 lg:p-8 lg:pl-72 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-4xl xl:max-w-5xl max-h-[92vh] bg-white dark:bg-[#071A22] border border-teal-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-teal-500/15 bg-white/80 dark:bg-[#071A22]/80">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {editingService ? `Edit: ${editingService.name}` : 'Add New Service Offering'}
                  </h3>
                  {form.slug && (
                    <a
                      href={`/services/${form.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-teal-600 dark:text-cyan-400 hover:underline"
                    >
                      <ExternalLink size={12} />
                      <span>Preview Live</span>
                    </a>
                  )}
                </div>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              {/* Form Navigation Tabs */}
              <div className="flex border-b border-teal-500/15 bg-black/5 dark:bg-black/20 px-4 sm:px-6 pt-2 gap-1 sm:gap-2 text-xs font-semibold overflow-x-auto custom-scrollbar">
                {[
                  { id: 'general', label: 'General & Overview', icon: Briefcase },
                  { id: 'content', label: 'Rich Content (Scope, FAQs)', icon: Layers },
                  { id: 'animation', label: 'Animation & Simulation', icon: PlayCircle },
                  { id: 'media', label: 'Hero Image & Media', icon: ImageIcon },
                  { id: 'seo', label: 'SEO & Metadata', icon: Search },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFormTab(t.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        formTab === t.id
                          ? 'border-teal-500 text-teal-600 dark:text-cyan-300'
                          : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <Icon size={14} />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              <form onSubmit={(e) => handleSave(e, false)} className="p-6 overflow-y-auto space-y-4 custom-scrollbar text-xs">
                {/* TAB 1: General Info */}
                {formTab === 'general' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Service Name *</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={e => {
                            const name = e.target.value;
                            setForm(prev => ({
                              ...prev,
                              name,
                              slug: prev.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                            }));
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">URL Slug *</label>
                        <input
                          type="text"
                          required
                          value={form.slug}
                          onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-') })}
                          className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Practice Category *</label>
                        <select
                          value={form.categoryId}
                          onChange={e => setForm({ ...form, categoryId: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-[#071A22] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Turnaround Time SLA</label>
                        <input
                          type="text"
                          value={form.turnaroundTime}
                          onChange={e => setForm({ ...form, turnaroundTime: e.target.value })}
                          placeholder="e.g. 2-4 Business Days"
                          className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ideal Client Profile</label>
                        <input
                          type="text"
                          value={form.idealFor}
                          onChange={e => setForm({ ...form, idealFor: e.target.value })}
                          placeholder="e.g. Businesses & CPA Firms"
                          className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Hero Tagline</label>
                      <input
                        type="text"
                        value={form.heroTagline}
                        onChange={e => setForm({ ...form, heroTagline: e.target.value })}
                        placeholder="Compelling value proposition headline..."
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Short Summary (Catalog Cards)</label>
                      <textarea
                        rows={2}
                        required
                        value={form.shortDescription}
                        onChange={e => setForm({ ...form, shortDescription: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Technical Scope</label>
                      <textarea
                        rows={4}
                        value={form.fullDescription}
                        onChange={e => setForm({ ...form, fullDescription: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: Rich Content Sections */}
                {formTab === 'content' && (
                  <div className="space-y-5">
                    {/* Deliverables Section */}
                    <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/[0.03] border border-teal-500/15 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span>Deliverables</span>
                        </label>
                        <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">One deliverable per line</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Enter deliverables received by the client. Simply press Enter after each item. No quotes or brackets needed.
                      </p>
                      <textarea
                        rows={5}
                        value={form.deliverables}
                        onChange={e => setForm({ ...form, deliverables: e.target.value })}
                        placeholder={`Executive Summary & Multi-State Nexus Memo\nIRS Forms 1120, 1120-S, 1065 & Schedules\nDual CPA Sign-Off & E-Filing Authorization\nAudit-Ready Workpapers & General Ledger Ties`}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#041219] border border-teal-500/25 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400 font-sans text-xs leading-relaxed"
                      />
                    </div>

                    {/* Key Features Section */}
                    <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/[0.03] border border-teal-500/15 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                          <CheckSquare size={14} className="text-teal-500" />
                          <span>What This Service Includes (Key Features)</span>
                        </label>
                        <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">Format: Feature Title : Description</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Each line represents a numbered feature card on the service detail page. Separate title from description with a colon (:).
                      </p>
                      <textarea
                        rows={6}
                        value={form.features}
                        onChange={e => setForm({ ...form, features: e.target.value })}
                        placeholder={`Shareholder Basis Tracking : Accurate annual debt and stock basis tracking ensuring loss pass-through deductibility.\nMulti-State Apportionment : Optimal property, payroll, and sales apportionment schedules minimizing state nexus tax burdens.\nDepreciation Modeling : Section 179 and MACRS bonus depreciation optimization tailored to capital investments.`}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#041219] border border-teal-500/25 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400 font-sans text-xs leading-relaxed"
                      />
                    </div>

                    {/* Strategic Benefits Section */}
                    <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/[0.03] border border-teal-500/15 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                          <Star size={14} className="text-amber-500" />
                          <span>Strategic Benefits & Measurable Value</span>
                        </label>
                        <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">Format: Stat | Title | Description</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Displayed in the Measurable Value section. Put the highlight metric/stat, title, and description separated by a pipe (|).
                      </p>
                      <textarea
                        rows={5}
                        value={form.benefits}
                        onChange={e => setForm({ ...form, benefits: e.target.value })}
                        placeholder={`99.9% | Prevent Pass-Through Audits | 100% mathematical tie-out between corporate returns and shareholder 1040s.\n14 Days | Accelerated Corporate Close | Rapid turnaround prevents tax extensions and eliminates late-filing statutory penalties.\n100% | Circular 230 Protected | Prepared under strict bilateral non-disclosure agreements with dual CPA oversight.`}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#041219] border border-teal-500/25 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400 font-sans text-xs leading-relaxed"
                      />
                    </div>

                    {/* Process Workflow & Live Animation Steps */}
                    <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/[0.03] border border-teal-500/15 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                          <ListOrdered size={14} className="text-cyan-500" />
                          <span>Process Workflow & Execution Simulation Steps</span>
                        </label>
                        <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">Format: Step | Title | Description | Deliverable</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Directly drives both the 4-Step Timeline section AND the interactive Live Execution Simulation animation on the service page.
                      </p>
                      <textarea
                        rows={6}
                        value={form.workflow}
                        onChange={e => setForm({ ...form, workflow: e.target.value })}
                        placeholder={`01 | Trial Balance Tie-Out | Reconcile year-end balance sheets and income statements against underlying general ledgers | Adjusted Trial Balance\n02 | M-1 / M-3 Adjustments | Identify book-to-tax permanent and timing differences to compute accurate taxable income | Tax Workpaper Pack\n03 | Dual CPA Quality Review | Senior Tax Partner independently verifies all K-1 allocations and state nexus factors | Certified Review Notes\n04 | Secure E-Filing Dispatch | Generate official client filing copies with IRS/State electronic confirmation receipts | Filing Acknowledgement`}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#041219] border border-teal-500/25 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400 font-sans text-xs leading-relaxed"
                      />
                    </div>

                    {/* Frequently Asked Questions */}
                    <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/[0.03] border border-teal-500/15 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                          <HelpCircle size={14} className="text-teal-500" />
                          <span>Frequently Asked Questions (FAQs)</span>
                        </label>
                        <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">Format: Q: Question followed by A: Answer</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Type each question starting with &quot;Q:&quot; and its answer starting with &quot;A:&quot;. Separate multiple FAQs with a blank line.
                      </p>
                      <textarea
                        rows={7}
                        value={form.faqs}
                        onChange={e => setForm({ ...form, faqs: e.target.value })}
                        placeholder={`Q: What is the filing deadline for Form 1120-S and Form 1065?\nA: Calendar-year S Corporations and Partnerships must file by March 15th, or file Form 7004 for an automatic 6-month extension to September 15th.\n\nQ: How do you handle multi-state revenue allocation?\nA: We review payroll records, property footprints, and customer invoice destinations to apply exact statutory state apportionment formulas.`}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#041219] border border-teal-500/25 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400 font-sans text-xs leading-relaxed"
                      />
                    </div>

                    {/* Related Services Slugs */}
                    <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/[0.03] border border-teal-500/15 space-y-2">
                      <label className="font-bold text-slate-800 dark:text-white block">
                        Related Services (Comma-separated Slugs)
                      </label>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Enter service slugs to highlight at the bottom of this service page (e.g. bookkeeping, sales-tax, cpa-outsourcing).
                      </p>
                      <input
                        type="text"
                        value={form.relatedSlugs}
                        onChange={e => setForm({ ...form, relatedSlugs: e.target.value })}
                        placeholder="e.g. business-tax, bookkeeping, cpa-tax-overflow"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#041219] border border-teal-500/25 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400 font-mono text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 3: Live Animation & Simulation Content */}
                {formTab === 'animation' && (
                  <div className="space-y-6">
                    {/* Hero Workflow Animation (Top Card in Hero) */}
                    <div className="p-5 rounded-2xl bg-teal-500/[0.03] dark:bg-teal-950/20 border border-teal-500/25 space-y-4">
                      <div className="flex items-center gap-2 border-b border-teal-500/20 pb-2.5">
                        <PlayCircle className="text-teal-400" size={18} />
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Hero Workflow Card Animation</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Customizes the live looping animated workflow card displayed in the top hero section of the service page.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3.5">
                        <div>
                          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Animation Eyebrow Label
                          </label>
                          <input
                            type="text"
                            value={form.animEyebrow}
                            onChange={e => setForm({ ...form, animEyebrow: e.target.value })}
                            placeholder="e.g. BUSINESS RETURN • 1120 / 1065"
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#041219] border border-teal-500/25 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400 font-sans text-xs"
                          />
                          <span className="text-[10px] text-slate-400 mt-1 block">Displayed at the top-left of the animated card</span>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Result Badge & Metric Code
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={form.animResult}
                              onChange={e => setForm({ ...form, animResult: e.target.value })}
                              placeholder="e.g. Reviewed return"
                              className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-[#041219] border border-teal-500/25 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400 font-sans text-xs"
                            />
                            <input
                              type="text"
                              value={form.animMetric}
                              onChange={e => setForm({ ...form, animMetric: e.target.value })}
                              placeholder="e.g. 1120 or 1040"
                              className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-[#041219] border border-teal-500/25 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400 font-sans text-xs"
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">Bottom checkmark badge title and pill code</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3.5">
                        <div>
                          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Source Documents Label
                          </label>
                          <input
                            type="text"
                            value={form.animSource}
                            onChange={e => setForm({ ...form, animSource: e.target.value })}
                            placeholder="e.g. P&L · balance sheet · forms"
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#041219] border border-teal-500/25 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400 font-sans text-xs"
                          />
                          <span className="text-[10px] text-slate-400 mt-1 block">Input documents shown under the stage loop</span>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Active Focus Task Label
                          </label>
                          <input
                            type="text"
                            value={form.animFocus}
                            onChange={e => setForm({ ...form, animFocus: e.target.value })}
                            placeholder="e.g. Business tax calculation"
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#041219] border border-teal-500/25 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400 font-sans text-xs"
                          />
                          <span className="text-[10px] text-slate-400 mt-1 block">Highlighted task in middle stage transition</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-semibold text-slate-700 dark:text-slate-300">
                            4 Animation Stages (One per line)
                          </label>
                          <span className="text-[10px] text-teal-500 font-medium">Exactly 4 stages for the 4-step loop</span>
                        </div>
                        <textarea
                          rows={4}
                          value={form.animStages}
                          onChange={e => setForm({ ...form, animStages: e.target.value })}
                          placeholder={`Revenue mapped\nExpenses reviewed\nDeductions tested\nReturn finalized`}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#041219] border border-teal-500/25 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400 font-sans text-xs leading-relaxed"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          If left blank, these automatically sync from the 4 execution simulation steps below.
                        </span>
                      </div>

                      {/* Live Animation Metric Digits & Stats */}
                      <div className="p-4 rounded-xl bg-black/5 dark:bg-white/[0.02] border border-teal-500/20 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-slate-800 dark:text-white block text-xs">
                            Animation Digits &amp; Financial Metric Cards
                          </label>
                          <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">Live numbers inside the card</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Edit the 3 numeric stat cards shown inside the live animation card (e.g. Gross Receipts, Operating Costs, Taxable Income).
                        </p>

                        <div className="grid grid-cols-3 gap-3">
                          {/* Card 1 */}
                          <div className="space-y-1.5 p-2.5 rounded-lg bg-white dark:bg-[#030e14] border border-teal-500/15">
                            <span className="text-[10px] font-bold text-teal-500 uppercase tracking-wider block">Stat 1 (Left)</span>
                            <input
                              type="text"
                              value={form.stat1Label}
                              onChange={e => setForm({ ...form, stat1Label: e.target.value })}
                              placeholder="Label: GROSS RECEIPTS"
                              className="w-full px-2 py-1.5 text-xs rounded-md bg-transparent border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                            />
                            <input
                              type="text"
                              value={form.stat1Value}
                              onChange={e => setForm({ ...form, stat1Value: e.target.value })}
                              placeholder="Value: $1.24M"
                              className="w-full px-2 py-1.5 text-xs font-bold font-mono rounded-md bg-transparent border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                            />
                            <input
                              type="text"
                              value={form.stat1Sub}
                              onChange={e => setForm({ ...form, stat1Sub: e.target.value })}
                              placeholder="Subtext: +8.2%"
                              className="w-full px-2 py-1 text-[11px] rounded-md bg-transparent border border-teal-500/20 text-teal-600 dark:text-teal-400 focus:outline-none focus:border-teal-400"
                            />
                          </div>

                          {/* Card 2 */}
                          <div className="space-y-1.5 p-2.5 rounded-lg bg-white dark:bg-[#030e14] border border-teal-500/15">
                            <span className="text-[10px] font-bold text-teal-500 uppercase tracking-wider block">Stat 2 (Center)</span>
                            <input
                              type="text"
                              value={form.stat2Label}
                              onChange={e => setForm({ ...form, stat2Label: e.target.value })}
                              placeholder="Label: OPERATING COSTS"
                              className="w-full px-2 py-1.5 text-xs rounded-md bg-transparent border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                            />
                            <input
                              type="text"
                              value={form.stat2Value}
                              onChange={e => setForm({ ...form, stat2Value: e.target.value })}
                              placeholder="Value: $846K"
                              className="w-full px-2 py-1.5 text-xs font-bold font-mono rounded-md bg-transparent border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                            />
                            <input
                              type="text"
                              value={form.stat2Sub}
                              onChange={e => setForm({ ...form, stat2Sub: e.target.value })}
                              placeholder="Subtext: Reviewed"
                              className="w-full px-2 py-1 text-[11px] rounded-md bg-transparent border border-teal-500/20 text-teal-600 dark:text-teal-400 focus:outline-none focus:border-teal-400"
                            />
                          </div>

                          {/* Card 3 */}
                          <div className="space-y-1.5 p-2.5 rounded-lg bg-white dark:bg-[#030e14] border border-teal-500/15">
                            <span className="text-[10px] font-bold text-teal-500 uppercase tracking-wider block">Stat 3 (Right)</span>
                            <input
                              type="text"
                              value={form.stat3Label}
                              onChange={e => setForm({ ...form, stat3Label: e.target.value })}
                              placeholder="Label: TAXABLE INCOME"
                              className="w-full px-2 py-1.5 text-xs rounded-md bg-transparent border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                            />
                            <input
                              type="text"
                              value={form.stat3Value}
                              onChange={e => setForm({ ...form, stat3Value: e.target.value })}
                              placeholder="Value: $286K"
                              className="w-full px-2 py-1.5 text-xs font-bold font-mono rounded-md bg-transparent border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                            />
                            <input
                              type="text"
                              value={form.stat3Sub}
                              onChange={e => setForm({ ...form, stat3Sub: e.target.value })}
                              placeholder="Subtext: 1120-S · sample"
                              className="w-full px-2 py-1 text-[11px] rounded-md bg-transparent border border-teal-500/20 text-teal-600 dark:text-teal-400 focus:outline-none focus:border-teal-400"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Orbit Execution Simulation Animation */}
                    <div className="p-5 rounded-2xl bg-cyan-500/[0.03] dark:bg-cyan-950/20 border border-cyan-500/25 space-y-3">
                      <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-2.5">
                        <Sparkles className="text-cyan-400" size={18} />
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Live Execution Orbit Simulation Steps</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Powers the circular execution simulation diagram with interactive stages, deliverables, and checkpoints.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                          <ListOrdered size={14} className="text-cyan-500" />
                          <span>Simulation Stages (Step | Title | Description | Deliverable)</span>
                        </label>
                        <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium">Format: Step | Title | Description | Deliverable</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Each line populates a node in the orbit ring, stage title, description, and the &quot;STAGE CHECKPOINT&quot; deliverable badge.
                      </p>
                      <textarea
                        rows={5}
                        value={form.workflow}
                        onChange={e => setForm({ ...form, workflow: e.target.value })}
                        placeholder={`01 | Trial Balance Tie-Out | Reconcile year-end balance sheets and income statements against underlying general ledgers | Adjusted Trial Balance\n02 | M-1 / M-3 Adjustments | Identify book-to-tax permanent and timing differences to compute accurate taxable income | Tax Workpaper Pack\n03 | Dual CPA Quality Review | Senior Tax Partner independently verifies all K-1 allocations and state nexus factors | Certified Review Notes\n04 | Secure E-Filing Dispatch | Generate official client filing copies with IRS/State electronic confirmation receipts | Filing Acknowledgement`}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#041219] border border-cyan-500/25 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400 font-sans text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 3: Media Upload */}
                {formTab === 'media' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Service Cover Image</label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={form.coverImage}
                          onChange={e => setForm({ ...form, coverImage: e.target.value })}
                          placeholder="Image URL or upload a file..."
                          className="flex-1 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                        />
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Upload size={14} />
                          <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                        </button>
                      </div>
                    </div>

                    {form.coverImage && (
                      <div className="p-3 rounded-2xl bg-black/5 dark:bg-black/30 border border-teal-500/20 flex items-center gap-4">
                        <img
                          src={form.coverImage}
                          alt="Preview"
                          className="w-24 h-16 object-cover rounded-xl border border-teal-500/30"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                        <div className="text-xs">
                          <span className="font-bold text-slate-800 dark:text-white block">Image Attached</span>
                          <span className="text-slate-500 break-all">{form.coverImage}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: SEO Metadata */}
                {formTab === 'seo' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Meta Title</label>
                      <input
                        type="text"
                        value={form.metaTitle}
                        onChange={e => setForm({ ...form, metaTitle: e.target.value })}
                        placeholder="SEO Title displayed in search results..."
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Meta Description</label>
                      <textarea
                        rows={3}
                        value={form.metaDescription}
                        onChange={e => setForm({ ...form, metaDescription: e.target.value })}
                        placeholder="Concise summary for search engines..."
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>
                )}

                {/* Publication & Status Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-teal-500/15">
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isPublished}
                        onChange={e => setForm({ ...form, isPublished: e.target.checked })}
                        className="accent-teal-500 w-4 h-4 rounded"
                      />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Published to Directory</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isPopular}
                        onChange={e => setForm({ ...form, isPopular: e.target.checked })}
                        className="accent-amber-500 w-4 h-4 rounded"
                      />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Featured Service</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleSave(e, true)}
                      disabled={saving}
                      className="px-4 py-2 rounded-xl text-teal-600 dark:text-teal-400 border border-teal-500/30 hover:bg-teal-500/10 font-bold transition-all cursor-pointer disabled:opacity-50"
                    >
                      Save Draft
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 rounded-xl text-white font-bold bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Save size={14} />
                      <span>{saving ? 'Saving...' : 'Publish Service'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Services Page Header & Config Modal */}
        {showPageConfigModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-lg bg-white dark:bg-[#071A22] border border-teal-500/30 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-teal-500/15">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit size={16} className="text-teal-500" />
                  <span>Edit Services Page Header &amp; Search Content</span>
                </h3>
                <button onClick={() => setShowPageConfigModal(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSavePageConfig} className="space-y-4 text-xs max-h-[75vh] overflow-y-auto custom-scrollbar pr-1">
                <div className="p-3.5 rounded-2xl bg-teal-500/5 border border-teal-500/20 space-y-3">
                  <span className="font-bold text-teal-600 dark:text-cyan-300 block uppercase tracking-wider text-[11px]">
                    1. Main Services Directory Page Header &amp; Search
                  </span>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Top Badge Label</label>
                    <input
                      type="text"
                      required
                      value={pageConfig.badge}
                      onChange={e => setPageConfig({ ...pageConfig, badge: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Main Page Heading</label>
                    <input
                      type="text"
                      required
                      value={pageConfig.heading}
                      onChange={e => setPageConfig({ ...pageConfig, heading: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subtext / Overview Description</label>
                    <textarea
                      rows={2}
                      required
                      value={pageConfig.description}
                      onChange={e => setPageConfig({ ...pageConfig, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Search Placeholder</label>
                      <input
                        type="text"
                        value={pageConfig.searchPlaceholder}
                        onChange={e => setPageConfig({ ...pageConfig, searchPlaceholder: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Card CTA Button Label</label>
                      <input
                        type="text"
                        value={pageConfig.exploreButtonText}
                        onChange={e => setPageConfig({ ...pageConfig, exploreButtonText: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-3">
                  <span className="font-bold text-cyan-600 dark:text-cyan-300 block uppercase tracking-wider text-[11px]">
                    2. Service Detail Page Section Headings &amp; Badges
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Scope Badge</label>
                      <input
                        type="text"
                        value={pageConfig.featuresSectionBadge}
                        onChange={e => setPageConfig({ ...pageConfig, featuresSectionBadge: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Scope Heading</label>
                      <input
                        type="text"
                        value={pageConfig.featuresSectionHeading}
                        onChange={e => setPageConfig({ ...pageConfig, featuresSectionHeading: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Deliverables Box Heading</label>
                    <input
                      type="text"
                      value={pageConfig.deliverablesBoxHeading}
                      onChange={e => setPageConfig({ ...pageConfig, deliverablesBoxHeading: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Workflow Badge</label>
                      <input
                        type="text"
                        value={pageConfig.workflowSectionBadge}
                        onChange={e => setPageConfig({ ...pageConfig, workflowSectionBadge: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Workflow Heading</label>
                      <input
                        type="text"
                        value={pageConfig.workflowSectionHeading}
                        onChange={e => setPageConfig({ ...pageConfig, workflowSectionHeading: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Workflow Subtext</label>
                    <input
                      type="text"
                      value={pageConfig.workflowSectionSubtext}
                      onChange={e => setPageConfig({ ...pageConfig, workflowSectionSubtext: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Simulation Badge</label>
                      <input
                        type="text"
                        value={pageConfig.simulationBadge}
                        onChange={e => setPageConfig({ ...pageConfig, simulationBadge: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Simulation Subtext</label>
                      <input
                        type="text"
                        value={pageConfig.simulationSubtext}
                        onChange={e => setPageConfig({ ...pageConfig, simulationSubtext: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Benefits Heading</label>
                      <input
                        type="text"
                        value={pageConfig.benefitsSectionHeading}
                        onChange={e => setPageConfig({ ...pageConfig, benefitsSectionHeading: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">FAQs Heading</label>
                      <input
                        type="text"
                        value={pageConfig.faqsSectionHeading}
                        onChange={e => setPageConfig({ ...pageConfig, faqsSectionHeading: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">CTA Banner Badge</label>
                      <input
                        type="text"
                        value={pageConfig.ctaBannerBadge}
                        onChange={e => setPageConfig({ ...pageConfig, ctaBannerBadge: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">CTA Action Button</label>
                      <input
                        type="text"
                        value={pageConfig.ctaButtonText}
                        onChange={e => setPageConfig({ ...pageConfig, ctaButtonText: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-teal-500/15">
                  <button
                    type="button"
                    onClick={() => setShowPageConfigModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-black/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingPageConfig}
                    className="px-5 py-2 rounded-xl font-bold bg-teal-600 hover:bg-teal-500 text-white shadow transition-all disabled:opacity-50"
                  >
                    {savingPageConfig ? 'Saving...' : 'Save Page Content'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Category Management Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-white dark:bg-[#071A22] border border-teal-500/30 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-teal-500/15">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers size={16} className="text-teal-500" />
                  <span>Service Categories</span>
                </h3>
                <button onClick={() => setShowCategoryModal(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              {/* Current Categories List */}
              <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar">
                {categories.map((c) => (
                  <div key={c.id} className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/15 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-white">{c.name}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">slug: {c.slug}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Category Form */}
              <form onSubmit={handleCreateCategory} className="pt-3 border-t border-teal-500/15 space-y-3 text-xs">
                <span className="font-bold text-slate-800 dark:text-white block">Add Category</span>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Category Name (e.g. Non-Profit / Exemption)"
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Category Slug (optional, auto-generated)"
                    value={newCategorySlug}
                    onChange={e => setNewCategorySlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-'))}
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400 font-mono"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(false)}
                    className="px-3 py-1.5 rounded-xl text-slate-500 hover:bg-black/5"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl font-bold bg-teal-600 hover:bg-teal-500 text-white shadow"
                  >
                    Create Category
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
