import React, { useState } from 'react';
import {
  Plus, Trash2, Copy, GripVertical, Eye, EyeOff, ChevronDown, ChevronUp,
  X, CheckCircle2, Info, ArrowUp, ArrowDown, Sparkles, Save, FileText,
  Layers, HelpCircle, ListChecks, Workflow, TrendingUp, Image as ImageIcon
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface BuilderItem {
  id: string;
  type: string;
  title: string;
  description: string;
  image: string;
  stat: string;
  deliverable: string;
  question: string;
  answer: string;
  step: string;
  enabled: boolean;
  data: Record<string, unknown>;
}

export interface BuilderSection {
  key: string;        // stable key, maps to a service column
  label: string;      // section title shown in the panel
  badge?: string;     // small label shown on the card
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  description: string;
  items: BuilderItem[]; // one entry per repeatable block
}

export type SectionBuilderModel = Record<string, BuilderSection>;

const uid = () => Math.random().toString(36).slice(2, 10);

/* ------------------------------------------------------------------ */
/*  Helpers: convert service JSON columns <-> builder model            */
/* ------------------------------------------------------------------ */

export function toBuilderModel(service: any): SectionBuilderModel {
  const mapItems = (arr: any, type: string, step: Record<string, string> = {}): BuilderItem[] =>
    (Array.isArray(arr) ? arr : []).map((it: any) => ({
      id: uid(),
      type,
      title: String(it.title ?? it.name ?? it.label ?? ''),
      description: String(it.desc ?? it.description ?? ''),
      image: String(it.image ?? it.img ?? ''),
      stat: String(it.stat ?? ''),
      deliverable: String(it.deliverable ?? ''),
      question: String(it.question ?? ''),
      answer: String(it.answer ?? ''),
      step: String(step[type] ?? it.step ?? ''),
      enabled: it.enabled !== false,
      data: { ...it },
    }));

  const heroCfg = service.heroAnimationConfig || service.additionalImages?.heroAnimationConfig || {};

  return {
    hero: {
      key: 'hero', label: 'Hero / Intro', badge: 'HERO', icon: Sparkles,
      description: 'Eyebrow, headline, tagline and supporting copy shown at the top of the page.',
      items: [
        {
          id: uid(), type: 'hero', title: String(heroCfg.eyebrow ?? ''),
          description: String(heroCfg.source ?? ''),
          deliverable: String(heroCfg.focus ?? ''),
          step: String(heroCfg.result ?? ''),
          stat: String(heroCfg.metric ?? ''),
          enabled: true,
          data: { eyebrow: heroCfg.eyebrow, source: heroCfg.source, focus: heroCfg.focus, result: heroCfg.result, metric: heroCfg.metric },
        },
      ],
    },
    overview: {
      key: 'overview', label: 'Overview', badge: 'OVERVIEW', icon: FileText,
      description: 'Short description, full description and hero tagline.',
      items: [{
        id: uid(), type: 'overview',
        title: String(service.name ?? ''),
        description: String(service.fullDescription ?? ''),
        deliverable: String(service.shortDescription ?? ''),
        enabled: true,
        data: { name: service.name, short: service.shortDescription, full: service.fullDescription },
      }],
    },
    features: {
      key: 'features', label: 'Features', badge: 'FEATURES', icon: ListChecks,
      description: 'Key capabilities and deliverables shown as titled cards.',
      items: mapItems(service.features, 'features', { features: 'Feature' }),
    },
    benefits: {
      key: 'benefits', label: 'Benefits', badge: 'BENEFITS', icon: TrendingUp,
      description: 'Outcomes with an optional stat/metric and description.',
      items: mapItems(service.benefits, 'benefits', { benefits: 'Benefit' }),
    },
    deliverables: {
      key: 'deliverables', label: 'Deliverables', badge: 'OUTPUTS', icon: CheckCircle2,
      description: 'What the client receives on completion (a list).',
      items: mapItems(service.deliverables, 'deliverables', { deliverables: '' }),
    },
    workflow: {
      key: 'workflow', label: 'Workflow / Process', badge: 'WORKFLOW', icon: Workflow,
      description: 'Step-by-step process with stage, title and description.',
      items: mapItems(service.workflow, 'workflow', { workflow: 'Step' }),
    },
    faqs: {
      key: 'faqs', label: 'FAQs', badge: 'FAQS', icon: HelpCircle,
      description: 'Question/answer pairs for the accordion.',
      items: mapItems(service.faqs, 'faqs', { faqs: 'Q' }),
    },
    media: {
      key: 'media', label: 'Media', badge: 'MEDIA', icon: ImageIcon,
      description: 'Hero / thumbnail / gallery images used on the page.',
      items: [{
        id: uid(), type: 'media',
        title: 'Hero image',
        description: String(service.heroImage ?? ''),
        image: String(service.heroImage ?? ''),
        deliverable: String(service.thumbnailImage ?? ''),
        enabled: true,
        data: { heroImage: service.heroImage, thumbnailImage: service.thumbnailImage },
      }],
    },
  };
}

export function fromBuilderModel(model: SectionBuilderModel): Record<string, unknown> {
  const section = (key: string) => model[key]?.items ?? [];

  const hero = section('hero')[0]?.data || {};
  const overview = section('overview')[0]?.data || {};
  const media = section('media')[0]?.data || {};

  const features = section('features')
    .filter(i => i.enabled)
    .map(i => ({ title: i.title, desc: i.description, image: i.image || undefined }))
    .filter(i => i.title || i.desc);

  const benefits = section('benefits')
    .filter(i => i.enabled)
    .map(i => ({ stat: i.stat, title: i.title, description: i.description }))
    .filter(i => i.title || i.description || i.stat);

  const deliverables = section('deliverables')
    .filter(i => i.enabled)
    .map(i => i.title || i.description)
    .filter(Boolean);

  const workflow = section('workflow')
    .filter(i => i.enabled)
    .map(i => ({ step: i.step || '', title: i.title, description: i.description, deliverable: i.deliverable || undefined }))
    .filter(i => i.title || i.description);

  const faqs = section('faqs')
    .filter(i => i.enabled)
    .map(i => ({ question: i.question, answer: i.answer }))
    .filter(i => i.question || i.answer);

  const heroAnimationConfig = {
    eyebrow: hero.eyebrow ?? '',
    source: hero.source ?? '',
    focus: hero.focus ?? '',
    result: hero.result ?? '',
    metric: hero.metric ?? '',
  };

  return {
    name: overview.name ?? '',
    shortDescription: overview.short ?? '',
    fullDescription: overview.full ?? '',
    heroImage: media.heroImage ?? null,
    thumbnailImage: media.thumbnailImage ?? null,
    features,
    benefits,
    deliverables,
    workflow,
    faqs,
    heroAnimationConfig,
  };
}

/* ------------------------------------------------------------------ */
/*  Per-item editor                                                    */
/* ------------------------------------------------------------------ */

function ItemEditor({ section, item, onChange }: {
  section: BuilderSection;
  item: BuilderItem;
  onChange: (item: BuilderItem) => void;
}) {
  const field = (label: string, key: keyof BuilderItem, textarea = false) => (
    <label className="flex-1 min-w-[140px] flex flex-col gap-1">
      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      {textarea ? (
        <textarea
          value={String(item[key] ?? '')}
          onChange={(e) => onChange({ ...item, [key]: e.target.value })}
          rows={2}
          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-teal-500/20 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 resize-y"
        />
      ) : (
        <input
          type="text"
          value={String(item[key] ?? '')}
          onChange={(e) => onChange({ ...item, [key]: e.target.value })}
          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-teal-500/20 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
        />
      )}
    </label>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {section.key === 'overview' && (
        <>
          {field('Service name', 'title')}
          {field('Short description', 'deliverable', true)}
          {field('Full description', 'description', true)}
        </>
      )}
      {section.key === 'hero' && (
        <>
          {field('Eyebrow', 'title')}
          {field('Headline / Source', 'description')}
          {field('Focus', 'deliverable')}
          {field('Result', 'step')}
          {field('Metric', 'stat')}
        </>
      )}
      {section.key === 'features' && (
        <>
          {field('Feature title', 'title')}
          {field('Description', 'description', true)}
          {field('Image URL (optional)', 'image')}
        </>
      )}
      {section.key === 'benefits' && (
        <>
          {field('Metric (optional)', 'stat')}
          {field('Benefit title', 'title')}
          {field('Description', 'description', true)}
        </>
      )}
      {section.key === 'deliverables' && (
        <>
          {field('Deliverable', 'title')}
          {field('Detail (optional)', 'description')}
        </>
      )}
      {section.key === 'workflow' && (
        <>
          {field('Step label', 'step')}
          {field('Stage title', 'title')}
          {field('Description', 'description', true)}
          {field('Deliverable (optional)', 'deliverable', true)}
        </>
      )}
      {section.key === 'faqs' && (
        <>
          {field('Question', 'question', true)}
          {field('Answer', 'answer', true)}
        </>
      )}
      {section.key === 'media' && (
        <>
          {field('Hero image URL', 'image')}
          {field('Thumbnail URL', 'deliverable')}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main builder                                                       */
/* ------------------------------------------------------------------ */

export function ServiceSectionBuilder({ service, onSave }: {
  service: any;
  onSave: (model: SectionBuilderModel) => Promise<void>;
}) {
  const [model, setModel] = useState<SectionBuilderModel>(() => toBuilderModel(service));
  const [openSection, setOpenSection] = useState<string | null>(Object.keys(toBuilderModel(service))[0] ?? null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const updateItem = (sectionKey: string, itemId: string, next: BuilderItem) => {
    setModel(prev => {
      const section = prev[sectionKey];
      if (!section) return prev;
      return {
        ...prev,
        [sectionKey]: {
          ...section,
          items: section.items.map(i => i.id === itemId ? next : i),
        },
      };
    });
    setDirty(true);
  };

  const addItem = (sectionKey: string) => {
    setModel(prev => {
      const section = prev[sectionKey];
      if (!section) return prev;
      const defaults: Partial<BuilderItem> =
        sectionKey === 'faqs'
          ? { question: 'New question', answer: 'New answer' }
          : sectionKey === 'workflow'
            ? { title: 'New stage', step: `0${section.items.length + 1}` }
            : sectionKey === 'benefits'
              ? { stat: '99.9%', title: 'New benefit', description: 'Describe the outcome.' }
              : { title: 'New item', description: 'Describe this item.' };
      return {
        ...prev,
        [sectionKey]: {
          ...section,
          items: [...section.items, { id: uid(), type: sectionKey, enabled: true, data: {}, ...defaults } as BuilderItem],
        },
      };
    });
    setDirty(true);
  };

  const duplicateItem = (sectionKey: string, itemId: string) => {
    setModel(prev => {
      const section = prev[sectionKey];
      if (!section) return prev;
      const idx = section.items.findIndex(i => i.id === itemId);
      if (idx < 0) return prev;
      const copy = { ...section.items[idx], id: uid(), title: `${section.items[idx].title} (Copy)` };
      const items = [...section.items];
      items.splice(idx + 1, 0, copy);
      return { ...prev, [sectionKey]: { ...section, items } };
    });
    setDirty(true);
  };

  const removeItem = (sectionKey: string, itemId: string) => {
    setModel(prev => {
      const section = prev[sectionKey];
      if (!section) return prev;
      return {
        ...prev,
        [sectionKey]: { ...section, items: section.items.filter(i => i.id !== itemId) },
      };
    });
    setDirty(true);
  };

  const toggleItem = (sectionKey: string, itemId: string) => {
    updateItem(sectionKey, itemId, { ...model[sectionKey].items.find(i => i.id === itemId)!, enabled: !model[sectionKey].items.find(i => i.id === itemId)!.enabled });
  };

  const moveItem = (sectionKey: string, itemId: string, dir: -1 | 1) => {
    setModel(prev => {
      const section = prev[sectionKey];
      if (!section) return prev;
      const idx = section.items.findIndex(i => i.id === itemId);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= section.items.length) return prev;
      const items = [...section.items];
      [items[idx], items[target]] = [items[target], items[idx]];
      return { ...prev, [sectionKey]: { ...section, items } };
    });
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(model);
      setDirty(false);
    } finally {
      setSaving(false);
    }
  };

  const sectionKeys = Object.keys(model);

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-teal-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Visual Page Builder</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-300 border border-teal-500/20">
            {sectionKeys.length} sections
          </span>
          {dirty && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
              <Info size={11} /> Unsaved changes
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <div className="flex rounded-lg border border-teal-500/20 overflow-hidden">
            {(['light', 'dark'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={`px-3 py-1.5 text-[11px] font-bold capitalize transition-all ${theme === t
                  ? 'bg-teal-500 text-white'
                  : 'bg-transparent text-slate-500 dark:text-slate-400 hover:bg-teal-500/10'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !dirty}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 shadow-lg shadow-teal-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save size={14} />
            {saving ? 'Saving…' : 'Save Sections'}
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {sectionKeys.map((key) => {
          const section = model[key];
          const isOpen = openSection === key;
          const enabledCount = section.items.filter(i => i.enabled).length;
          return (
            <div
              key={key}
              className={`rounded-2xl border transition-all ${isOpen
                  ? 'border-teal-400/40 bg-white/80 dark:bg-[#071A22]/80 shadow-lg'
                  : 'border-teal-500/15 bg-white/50 dark:bg-[#071A22]/50'
                }`}
            >
              {/* Section header */}
              <button
                type="button"
                onClick={() => setOpenSection(isOpen ? null : key)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
              >
                <span className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-300 border border-teal-500/20 flex items-center justify-center shrink-0">
                  <section.icon size={15} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-bold text-slate-900 dark:text-white truncate">
                    {section.label}
                  </span>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {section.description}
                  </span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-300 border border-teal-500/20">
                  {section.badge}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-500 dark:text-slate-400">
                  {enabledCount}/{section.items.length}
                </span>
                {isOpen ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
              </button>

              {/* Section body */}
              {isOpen && (
                <div className="px-4 pb-4 border-t border-teal-500/10 pt-3 space-y-3">
                  {section.items.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">
                      No items yet. Add the first one below.
                    </p>
                  )}

                  {section.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`rounded-xl border p-3 space-y-3 transition-all ${item.enabled
                        ? 'border-teal-500/20 bg-black/5 dark:bg-white/5'
                        : 'border-slate-300/40 dark:border-white/10 opacity-50'}`}
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical size={14} className="text-slate-400 cursor-grab shrink-0" />
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-300">
                          #{idx + 1}
                        </span>
                        <span className="flex-1 min-w-0 text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                          {item.title || `Untitled ${section.label}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => moveItem(key, item.id, -1)}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg hover:bg-teal-500/10 text-slate-400 disabled:opacity-30"
                          title="Move up"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(key, item.id, 1)}
                          disabled={idx === section.items.length - 1}
                          className="p-1.5 rounded-lg hover:bg-teal-500/10 text-slate-400 disabled:opacity-30"
                          title="Move down"
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleItem(key, item.id)}
                          className="p-1.5 rounded-lg hover:bg-teal-500/10 text-slate-400"
                          title={item.enabled ? 'Disable' : 'Enable'}
                        >
                          {item.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateItem(key, item.id)}
                          className="p-1.5 rounded-lg hover:bg-teal-500/10 text-slate-400"
                          title="Duplicate"
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(key, item.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <ItemEditor section={section} item={item} onChange={(next) => updateItem(key, item.id, next)} />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addItem(key)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-teal-500/30 text-xs font-bold text-teal-600 dark:text-teal-300 hover:bg-teal-500/10 transition-all"
                  >
                    <Plus size={14} />
                    Add {section.label.toLowerCase()} item
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live preview */}
      <div className="rounded-2xl border border-teal-500/15 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-white/60 dark:bg-white/5 border-b border-teal-500/10">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'}`} />
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Live preview · {theme} theme
            </span>
          </div>
          <span className="text-[10px] font-bold text-teal-500">PREVIEW</span>
        </div>
        <div className={`${theme === 'dark' ? 'dark' : ''}`}>
          <div className={`min-h-[220px] p-6 ${theme === 'dark' ? 'bg-[#041416] text-slate-100' : 'bg-[#F7F5F0] text-slate-800'}`}>
            <PreviewSections model={model} theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Minimal live preview renderer (same design tokens)                 */
/* ------------------------------------------------------------------ */

function PreviewSections({ model, theme }: { model: SectionBuilderModel; theme: 'light' | 'dark' }) {
  const surface = theme === 'dark'
    ? 'bg-white/5 border-white/10'
    : 'bg-white border-teal-500/15 shadow-sm';
  const heading = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const body = theme === 'dark' ? 'text-slate-300' : 'text-slate-600';

  const wrap = (title: string, children: React.ReactNode) => (
    <section className={`rounded-xl border p-4 mb-4 ${surface}`}>
      <h4 className={`text-xs font-bold uppercase tracking-wide mb-2 ${heading}`}>{title}</h4>
      {children}
    </section>
  );

  return (
    <div>
      {model.overview?.items.map((it, i) => (
        <div key={i} className="mb-4">
          <h3 className={`text-lg font-extrabold ${heading}`}>{it.title}</h3>
          {it.deliverable && <p className={`text-xs mt-1 ${body}`}>{it.deliverable}</p>}
          {it.description && <p className={`text-sm mt-2 ${body}`}>{it.description}</p>}
        </div>
      ))}

      {model.features?.items.filter(i => i.enabled).length > 0 && wrap('Features', (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {model.features.items.filter(i => i.enabled).map((it, i) => (
            <div key={i} className="rounded-lg p-2.5 border border-teal-500/15 bg-teal-500/5">
              <p className={`text-xs font-bold ${heading}`}>{it.title}</p>
              {it.description && <p className={`text-[11px] mt-0.5 ${body}`}>{it.description}</p>}
            </div>
          ))}
        </div>
      ))}

      {model.workflow?.items.filter(i => i.enabled).length > 0 && wrap('Workflow', (
        <ol className="space-y-2">
          {model.workflow.items.filter(i => i.enabled).map((it, i) => (
            <li key={i} className="flex gap-2 items-start">
              <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                {it.step || i + 1}
              </span>
              <div>
                <p className={`text-xs font-bold ${heading}`}>{it.title}</p>
                {it.description && <p className={`text-[11px] ${body}`}>{it.description}</p>}
              </div>
            </li>
          ))}
        </ol>
      ))}

      {model.faqs?.items.filter(i => i.enabled).length > 0 && wrap('FAQs', (
        <div className="space-y-1.5">
          {model.faqs.items.filter(i => i.enabled).map((it, i) => (
            <div key={i} className="rounded-lg p-2.5 border border-teal-500/15">
              <p className={`text-xs font-bold ${heading}`}>{it.question}</p>
              {it.answer && <p className={`text-[11px] mt-0.5 ${body}`}>{it.answer}</p>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ServiceSectionBuilder;
