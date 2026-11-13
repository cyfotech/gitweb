import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowDown, ArrowLeft, ArrowUp, Check, ChevronDown, ChevronRight, ExternalLink, Eye, EyeOff, FileText, Save, Upload } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { pagesApi } from '../../api/pages';
import { sectionsApi } from '../../api/sections';
import type { PageSectionData } from '../../hooks/usePageContent';
import { publishCmsContentUpdate } from '../../utils/cmsContentUpdates';
import { useAnimationSettings, type AnimationSettingsConfig } from '../../context/AnimationSettingsContext';

interface EditableSection extends PageSectionData {
  content: string;
  hasDraft: boolean;
}

interface PageRecord {
  id: string;
  slug: string;
  title: string;
  isPublished: boolean;
}

type JsonPath = Array<string | number>;
type SaveState = 'idle' | 'saving' | 'publishing';

const CORE_FIELDS = [
  ['title', 'Section title'],
  ['subheading', 'Subtitle'],
  ['description', 'Description'],
  ['backgroundImage', 'Background image URL'],
  ['backgroundVideo', 'Background video URL'],
  ['imagePosition', 'Image position'],
  ['imageAltText', 'Image alt text'],
] as const;

function parseContent(value: unknown): unknown {
  if (typeof value !== 'string') return value ?? {};
  try {
    return JSON.parse(value);
  } catch {
    return { text: value };
  }
}

function mapSection(section: Record<string, any>): EditableSection {
  let draft: Record<string, any> | null = null;
  if (section.draftData) {
    try {
      draft = JSON.parse(section.draftData);
    } catch (error) {
      throw new Error(`Could not load the saved draft for "${section.sectionKey}".`, { cause: error });
    }
    if (!draft || typeof draft !== 'object' || Array.isArray(draft)) {
      throw new Error(`Saved draft for "${section.sectionKey}" has an invalid format.`);
    }
  }

  const content = draft?.content ?? section.content ?? '{}';
  return {
    id: section.id,
    pageId: section.pageId,
    sectionKey: section.sectionKey,
    sectionType: section.sectionType || section.sectionKey,
    title: draft?.title ?? section.title ?? '',
    subheading: draft?.subheading ?? section.subheading ?? '',
    description: draft?.description ?? section.description ?? '',
    backgroundImage: draft?.backgroundImage ?? section.backgroundImage ?? '',
    backgroundVideo: draft?.backgroundVideo ?? section.backgroundVideo ?? '',
    imagePosition: draft?.imagePosition ?? section.imagePosition ?? null,
    imageAltText: draft?.imageAltText ?? section.imageAltText ?? null,
    content: typeof content === 'string' ? content : JSON.stringify(content),
    isEnabled: section.isEnabled ?? true,
    displayOrder: section.displayOrder ?? 0,
    updatedAt: section.updatedAt,
    hasDraft: !!section.draftData,
  };
}

function labelFor(key: string): string {
  const knownLabels: Record<string, string> = {
    eyebrow: 'Eyebrow text',
    cta: 'Button text',
    ctaText: 'Button text',
    ctaUrl: 'Button link',
    href: 'Link URL',
    src: 'Image URL',
    alt: 'Image description',
    centerLabel: 'Chart center label',
    chartType: 'Chart style',
    dataPoints: 'Chart data points',
    easing: 'Animation easing',
    duration: 'Animation duration (ms)',
    delay: 'Animation delay (ms)',
    speed: 'Animation speed',
    speedMultiplier: 'Animation speed',
    cycleIntervalMs: 'Time between animation steps (ms)',
    autoAdvance: 'Automatically advance animation',
    autoplay: 'Play automatically',
    loop: 'Repeat continuously',
    reducedMotion: 'Reduce motion',
    animationsEnabled: 'Enable animations',
    enabled: 'Enable this animation',
    items: 'Items',
    stages: 'Stages',
    value: 'Value',
    color: 'Color',
    title: 'Title',
    shortTitle: 'Short title',
    summary: 'Summary',
    description: 'Description',
    securityControls: 'Security details',
    metric: 'Metric',
    label: 'Label',
    name: 'Name',
    image: 'Image',
    imageAlt: 'Image description',
    backgroundImage: 'Background image URL',
    backgroundVideo: 'Background video URL',
  };
  if (knownLabels[key]) return knownLabels[key];
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function updateAtPath<T>(root: T, path: JsonPath, value: unknown): T {
  if (path.length === 0) return value as T;
  const [head, ...tail] = path;
  const copy: any = Array.isArray(root)
    ? [...root]
    : root && typeof root === 'object'
      ? { ...(root as Record<string, unknown>) }
      : typeof head === 'number'
        ? []
        : {};
  copy[head] = updateAtPath(copy[head], tail, value);
  return copy as T;
}

function emptyValueLike(value: unknown): unknown {
  if (Array.isArray(value)) return [];
  if (typeof value === 'string') return '';
  if (typeof value === 'number') return 0;
  if (typeof value === 'boolean') return false;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, child]) => [
        key,
        key.toLowerCase() === 'id' ? `item-${Date.now().toString(36)}` : emptyValueLike(child),
      ])
    );
  }
  return {};
}

function ContentField({
  label,
  value,
  path,
  onChange,
}: {
  label: string;
  value: unknown;
  path: JsonPath;
  onChange: (path: JsonPath, value: unknown) => void;
}) {
  const inputClass = 'w-full rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#06151c] px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/40';

  if (Array.isArray(value)) {
    return (
      <fieldset className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-white/10 dark:bg-black/10">
        <legend className="px-1 text-sm font-bold text-slate-800 dark:text-slate-100">
          {label} <span className="font-normal text-slate-500">({value.length})</span>
        </legend>
        {value.map((item, index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-[#071A22]">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="min-w-0 truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                {arrayItemTitle(item, index)}
              </span>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => {
                    const reordered = [...value];
                    [reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]];
                    onChange(path, reordered);
                  }}
                  className="rounded px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:text-slate-300 dark:hover:bg-white/10"
                  aria-label={`Move item ${index + 1} up`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={index === value.length - 1}
                  onClick={() => {
                    const reordered = [...value];
                    [reordered[index + 1], reordered[index]] = [reordered[index], reordered[index + 1]];
                    onChange(path, reordered);
                  }}
                  className="rounded px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:text-slate-300 dark:hover:bg-white/10"
                  aria-label={`Move item ${index + 1} down`}
                >
                  ↓
                </button>
              <button
                type="button"
                onClick={() => onChange(path, value.filter((_, itemIndex) => itemIndex !== index))}
                className="text-xs font-semibold text-rose-600 hover:text-rose-500"
              >
                Remove item
              </button>
              </div>
            </div>
            <ContentField
              label={arrayItemTitle(item, index)}
              value={item}
              path={[...path, index]}
              onChange={onChange}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange(path, [...value, emptyValueLike(value[0])])}
          className="rounded-lg border border-dashed border-teal-500/40 px-3 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-500/5 dark:text-teal-300"
        >
          + Add {singularLabel(label)}
        </button>
      </fieldset>
    );
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    const objectIsAnimation = /animation|motion/i.test(label) ||
      ['duration', 'delay', 'easing'].some((key) => key in (value as Record<string, unknown>));
    return (
      <fieldset className={`space-y-3 rounded-xl border p-3 ${objectIsAnimation ? 'border-violet-300 bg-violet-50/60 dark:border-violet-400/20 dark:bg-violet-500/[0.04]' : 'border-slate-200 dark:border-white/10'}`}>
        <legend className="px-1 text-sm font-bold text-slate-800 dark:text-slate-100">
          {objectIsAnimation ? `Animation: ${label}` : label}
        </legend>
        {entries.length === 0 && <p className="text-xs text-slate-500">No fields in this object.</p>}
        <div className="grid gap-3 md:grid-cols-2">
          {entries.map(([key, child]) => (
            <div key={key} className={`min-w-0 space-y-1.5 ${child && typeof child === 'object' ? 'md:col-span-2' : ''}`}>
              {typeof child !== 'boolean' && <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">{labelFor(key)}</label>}
              <ContentField label={labelFor(key)} value={child} path={[...path, key]} onChange={onChange} />
            </div>
          ))}
        </div>
        <AddObjectField value={value as Record<string, unknown>} path={path} onChange={onChange} />
      </fieldset>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => onChange(path, event.target.checked)}
          className="h-4 w-4 accent-teal-500"
        />
        {label}
      </label>
    );
  }

  if (typeof value === 'number') {
    const isDuration = /duration|delay|interval|speed|count|value|height|width|size/i.test(label);
    return (
      <div className="flex items-center gap-2">
        <input
          aria-label={label}
          type="number"
          value={value}
          min={/opacity|multiplier/i.test(label) ? 0 : undefined}
          step={/multiplier/i.test(label) ? 0.1 : 1}
          onChange={(event) => onChange(path, event.target.value === '' ? 0 : Number(event.target.value))}
          className={inputClass}
        />
        {isDuration && <span className="shrink-0 text-xs text-slate-500">{/multiplier/i.test(label) ? '×' : 'ms'}</span>}
      </div>
    );
  }

  const stringValue = value == null ? '' : String(value);
  const normalizedLabel = label.toLowerCase();
  if (normalizedLabel.includes('easing')) {
    return (
      <select aria-label={label} value={stringValue} onChange={(event) => onChange(path, event.target.value)} className={inputClass}>
        {['ease', 'linear', 'ease-in-out', 'cubic-bezier'].map((option) => <option key={option} value={option}>{labelFor(option)}</option>)}
      </select>
    );
  }
  if (normalizedLabel.includes('chart style')) {
    return (
      <select aria-label={label} value={stringValue} onChange={(event) => onChange(path, event.target.value)} className={inputClass}>
        {['bar', 'horizontal_bar', 'line', 'area', 'pie', 'donut', 'radar', 'scatter', 'stacked_bar', 'mixed'].map((option) => <option key={option} value={option}>{labelFor(option)}</option>)}
      </select>
    );
  }
  if (normalizedLabel.includes('image position')) {
    return (
      <select aria-label={label} value={stringValue} onChange={(event) => onChange(path, event.target.value)} className={inputClass}>
        {['left', 'right', 'top', 'bottom', 'center', 'cover'].map((option) => <option key={option} value={option}>{labelFor(option)}</option>)}
      </select>
    );
  }
  const isUrl = /image|video|url|src|link/i.test(normalizedLabel);
  const isColor = normalizedLabel.includes('color') && /^#[\da-f]{3,8}$/i.test(stringValue);
  if (isColor) {
    return (
      <div className="flex items-center gap-2">
        <input
          aria-label={`${label} color picker`}
          type="color"
          value={stringValue.length === 4 ? `#${stringValue[1]}${stringValue[1]}${stringValue[2]}${stringValue[2]}${stringValue[3]}${stringValue[3]}` : stringValue.slice(0, 7)}
          onChange={(event) => onChange(path, event.target.value)}
          className="h-10 w-12 rounded border border-slate-300 bg-transparent p-1 dark:border-white/10"
        />
        <input aria-label={label} type="text" value={stringValue} onChange={(event) => onChange(path, event.target.value)} className={inputClass} />
      </div>
    );
  }
  const isLongText = /description|summary|subtitle|paragraph|message|body|content|caption|security details/i.test(normalizedLabel);
  return stringValue.length > 100 || (!isUrl && (stringValue.includes('\n') || isLongText)) ? (
    <textarea
      aria-label={label}
      rows={stringValue.length > 180 ? 4 : 2}
      value={stringValue}
      onChange={(event) => onChange(path, event.target.value)}
      className={`${inputClass} resize-y`}
    />
  ) : (
    <input
      aria-label={label}
      type={isUrl ? 'url' : 'text'}
      value={stringValue}
      onChange={(event) => onChange(path, event.target.value)}
      className={inputClass}
    />
  );
}

function arrayItemTitle(item: unknown, index: number): string {
  if (item && typeof item === 'object' && !Array.isArray(item)) {
    const object = item as Record<string, unknown>;
    const title = object.title ?? object.name ?? object.label ?? object.shortTitle ?? object.id;
    if (typeof title === 'string' && title.trim()) return `${String(index + 1).padStart(2, '0')} · ${title}`;
  }
  return `Item ${String(index + 1).padStart(2, '0')}`;
}

function singularLabel(label: string): string {
  if (/ies$/i.test(label)) return `${label.slice(0, -3)}y`;
  if (/s$/i.test(label)) return label.slice(0, -1);
  return label;
}

function AddObjectField({
  value,
  path,
  onChange,
}: {
  value: Record<string, unknown>;
  path: JsonPath;
  onChange: (path: JsonPath, value: unknown) => void;
}) {
  const [key, setKey] = useState('');
  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const nextKey = key.trim();
        if (!nextKey || Object.prototype.hasOwnProperty.call(value, nextKey)) return;
        onChange(path, { ...value, [nextKey]: '' });
        setKey('');
      }}
    >
      <input
        aria-label="New content field name"
        value={key}
        onChange={(event) => setKey(event.target.value)}
        placeholder="Add field name"
        className="min-w-0 flex-1 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#06151c] px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
      />
      <button type="submit" className="rounded-lg bg-slate-200 px-3 py-2 text-xs font-semibold dark:bg-white/10">
        Add field
      </button>
    </form>
  );
}

function AnimationSettingsPanel() {
  const { settings, updateSettings, loading } = useAnimationSettings();
  const [draft, setDraft] = useState<AnimationSettingsConfig>(settings);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(settings);

  const save = async () => {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await updateSettings(draft);
      setNotice('Website animation settings saved.');
    } catch (saveError: any) {
      setError(saveError?.message || 'Could not save website animation settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <details className="overflow-hidden rounded-2xl border border-violet-300/70 bg-white dark:border-violet-400/20 dark:bg-[#071A22]">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 sm:px-5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-300">✦</span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-slate-900 dark:text-white">Website animations, charts &amp; motion</span>
          <span className="mt-0.5 block text-xs text-slate-500">Global playback, chart content, pipeline stages and animation timing</span>
        </span>
        {hasChanges && <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-700 dark:text-amber-300">Unsaved</span>}
        <ChevronDown size={16} className="shrink-0 text-slate-400" />
      </summary>
      <div className="space-y-4 border-t border-slate-200 p-4 dark:border-white/10 sm:p-5">
        <p className="rounded-lg bg-violet-500/5 px-3 py-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          These controls edit the shared animation settings used by the site. Saving here applies them immediately; page section content below still uses Save Draft and Publish.
        </p>
        {loading ? (
          <p className="text-sm text-slate-500">Loading animation settings…</p>
        ) : (
          <ContentField
            label="Animation settings"
            value={draft}
            path={[]}
            onChange={(_, value) => setDraft(value as AnimationSettingsConfig)}
          />
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-white/10">
          <div className="text-xs">
            {error && <span role="alert" className="text-rose-600 dark:text-rose-300">{error}</span>}
            {notice && <span role="status" className="text-emerald-700 dark:text-emerald-300">{notice}</span>}
          </div>
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving || loading || !hasChanges}
            className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-violet-500 disabled:opacity-50"
          >
            {saving ? 'Saving animation settings…' : 'Save animation settings'}
          </button>
        </div>
      </div>
    </details>
  );
}

function buildFields(section: EditableSection) {
  const content = parseContent(section.content);
  return [
    { fieldKey: 'title', value: section.title ?? '' },
    { fieldKey: 'subheading', value: section.subheading ?? '' },
    { fieldKey: 'description', value: section.description ?? '' },
    { fieldKey: 'backgroundImage', value: section.backgroundImage ?? '' },
    { fieldKey: 'backgroundVideo', value: section.backgroundVideo ?? '' },
    { fieldKey: 'imagePosition', value: section.imagePosition ?? 'left' },
    { fieldKey: 'imageAltText', value: section.imageAltText ?? '' },
    ...(content && typeof content === 'object' && !Array.isArray(content)
      ? Object.entries(content as Record<string, unknown>).map(([fieldKey, value]) => ({ fieldKey, value }))
      : [{ fieldKey: 'text', value: content }]),
  ];
}

export function PageContentEditor() {
  const { pageId } = useParams<{ pageId: string }>();
  const [page, setPage] = useState<PageRecord | null>(null);
  const [sections, setSections] = useState<EditableSection[]>([]);
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadPage = useCallback(async () => {
    if (!pageId) {
      setError('No page was selected.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response: any = await pagesApi.getById(pageId);
      const record = response?.data ?? response;
      if (!record) throw new Error('The selected page was not found.');
      const rawSections = record.sections ?? record.pagesection ?? [];
      const mapped = rawSections.map(mapSection).sort((a: EditableSection, b: EditableSection) => a.displayOrder - b.displayOrder);
      setPage({ id: record.id, slug: record.slug, title: record.title, isPublished: record.isPublished ?? record.status === 'published' });
      setSections(mapped);
      setDirtyIds(new Set());
      setExpandedId(mapped[0]?.id ?? null);
    } catch (loadError: any) {
      setError(loadError?.message || 'Unable to load this page.');
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    void loadPage();
  }, [loadPage]);

  const draftCount = useMemo(() => sections.filter((section) => section.hasDraft).length, [sections]);
  const publicUrl = page?.slug === 'home' ? '/' : `/${page?.slug ?? ''}`;

  const updateSection = (sectionId: string, update: (section: EditableSection) => EditableSection) => {
    setSections((current) => current.map((section) => section.id === sectionId ? update(section) : section));
    setDirtyIds((current) => new Set(current).add(sectionId));
    setNotice('');
  };

  const updateContent = (sectionId: string, path: JsonPath, value: unknown) => {
    updateSection(sectionId, (section) => {
      const next = updateAtPath(parseContent(section.content), path, value);
      return { ...section, content: JSON.stringify(next) };
    });
  };

  const toggleSection = async (section: EditableSection) => {
    const isEnabled = !section.isEnabled;
    setSections((current) => current.map((item) => item.id === section.id ? { ...item, isEnabled } : item));
    setError('');
    try {
      await sectionsApi.toggleVisibility(section.id, isEnabled);
      if (page) publishCmsContentUpdate(page.slug);
      setNotice(isEnabled ? 'Section is visible on the website.' : 'Section is hidden on the website.');
    } catch (visibilityError: any) {
      setSections((current) => current.map((item) => item.id === section.id ? { ...item, isEnabled: section.isEnabled } : item));
      setError(visibilityError?.message || `Could not ${isEnabled ? 'show' : 'hide'} this section.`);
    }
  };

  const reorderSection = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    const reordered = [...sections];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    const normalized = reordered.map((section, order) => ({ ...section, displayOrder: order }));
    setSections(normalized);
    setError('');
    try {
      await pagesApi.reorderSections(pageId!, normalized.map(({ id, displayOrder }) => ({ sectionId: id, displayOrder })));
      if (page) publishCmsContentUpdate(page.slug);
    } catch (reorderError: any) {
      setSections(sections);
      setError(reorderError?.message || 'Could not change the section order.');
    }
  };

  const persistSection = async (section: EditableSection, publish: boolean) => {
    const response: any = await sectionsApi.saveContent(section.id, {
      fields: buildFields(section),
      isDraft: !publish,
      note: publish ? 'Published from section content editor' : 'Draft saved from section content editor',
      expectedUpdatedAt: section.updatedAt,
    });
    const result = response?.data ?? response;
    setSections((current) => current.map((item) => item.id === section.id
      ? { ...item, hasDraft: !publish, updatedAt: result?.updatedAt ?? item.updatedAt }
      : item));
    setDirtyIds((current) => {
      const next = new Set(current);
      next.delete(section.id);
      return next;
    });
  };

  const saveDrafts = async () => {
    const changedSections = sections.filter((section) => dirtyIds.has(section.id));
    if (changedSections.length === 0) return;
    setSaveState('saving');
    setError('');
    try {
      for (const section of changedSections) await persistSection(section, false);
      setNotice('Saved to draft. Publish to make it live.');
    } catch (saveError: any) {
      setError(saveError?.message || 'Could not save the draft. Your edits are still on this screen.');
    } finally {
      setSaveState('idle');
    }
  };

  const publishSection = async (section: EditableSection) => {
    setSaveState('publishing');
    setError('');
    try {
      await persistSection(section, true);
      if (page) publishCmsContentUpdate(page.slug);
      setNotice(`"${section.title || section.sectionKey}" is now live.`);
    } catch (publishError: any) {
      setError(publishError?.message || 'Could not publish this section.');
    } finally {
      setSaveState('idle');
    }
  };

  const saveSectionDraft = async (section: EditableSection) => {
    setSaveState('saving');
    setError('');
    try {
      await persistSection(section, false);
      setNotice('Saved to draft. Publish to make it live.');
    } catch (saveError: any) {
      setError(saveError?.message || 'Could not save this section.');
    } finally {
      setSaveState('idle');
    }
  };

  const publishPage = async () => {
    if (!page) return;
    setSaveState('publishing');
    setError('');
    try {
      for (const section of sections) {
        if (dirtyIds.has(section.id)) await persistSection(section, false);
      }
      await pagesApi.publish(page.id, true);
      setSections((current) => current.map((section) => ({ ...section, hasDraft: false })));
      setDirtyIds(new Set());
      setPage((current) => current ? { ...current, isPublished: true } : current);
      publishCmsContentUpdate(page.slug);
      setNotice('All page drafts were published to the website.');
    } catch (publishError: any) {
      setError(publishError?.message || 'Could not publish the page. Saved drafts remain available.');
    } finally {
      setSaveState('idle');
    }
  };

  return (
    <AdminLayout>
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-teal-500/15 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Link to="/admin/pages" aria-label="Back to pages" className="mt-1 rounded-lg p-2 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-white/10">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <FileText className="text-teal-500" size={20} />
                <h1 className="text-xl font-black text-slate-900 dark:text-white">{page?.title || 'Page content'}</h1>
                {page && <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${page.isPublished ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-slate-500/10 text-slate-600 dark:text-slate-300'}`}>{page.isPublished ? 'Published' : 'Unpublished'}</span>}
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Edit content by section. Drafts do not change the public page until published.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {page && (
              <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5">
                <Eye size={14} /> View Live <ExternalLink size={13} />
              </a>
            )}
            <button type="button" onClick={saveDrafts} disabled={saveState !== 'idle' || dirtyIds.size === 0} className="inline-flex items-center gap-2 rounded-lg border border-teal-500/40 px-3 py-2 text-xs font-bold text-teal-700 disabled:opacity-50 dark:text-teal-300">
              <Save size={14} /> {saveState === 'saving' ? 'Saving…' : 'Save Draft'}
            </button>
            <button type="button" onClick={publishPage} disabled={saveState !== 'idle' || !page} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-400 to-cyan-400 px-3 py-2 text-xs font-extrabold text-slate-950 disabled:opacity-50">
              <Upload size={14} /> {saveState === 'publishing' ? 'Publishing…' : 'Publish to Website'}
            </button>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-3 py-1.5 font-semibold text-slate-700 dark:text-slate-200">
            {dirtyIds.size > 0
              ? `${dirtyIds.size} unsaved section${dirtyIds.size === 1 ? '' : 's'}`
              : draftCount > 0
                ? `${draftCount} section${draftCount === 1 ? '' : 's'} with unpublished changes`
                : page?.isPublished
                  ? 'Live site is up to date'
                  : 'Page is not published'}
          </span>
          {notice && <span role="status" className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300"><Check size={14} />{notice}</span>}
          {error && <span role="alert" className="text-rose-600 dark:text-rose-300">{error}</span>}
        </div>

        <AnimationSettingsPanel />

        {loading ? (
          <p className="rounded-xl border border-slate-200 p-6 text-sm text-slate-500 dark:border-white/10">Loading page sections…</p>
        ) : sections.length === 0 ? (
          <p className="rounded-xl border border-slate-200 p-6 text-sm text-slate-500 dark:border-white/10">This page has no editable sections.</p>
        ) : (
          <div className="space-y-3">
            {sections.map((section, index) => {
              const isOpen = expandedId === section.id;
              const customContent = parseContent(section.content);
              return (
                <section key={section.id} className={`overflow-hidden rounded-2xl border bg-white dark:bg-[#071A22] ${dirtyIds.has(section.id) ? 'border-amber-400/60' : 'border-slate-200 dark:border-white/10'} ${!section.isEnabled ? 'opacity-75' : ''}`}>
                  <div className="flex items-center gap-2 px-3 sm:px-4">
                  <button type="button" onClick={() => setExpandedId(isOpen ? null : section.id)} aria-expanded={isOpen} className="flex min-w-0 flex-1 items-center gap-3 py-4 text-left">
                    {isOpen ? <ChevronDown size={16} className="shrink-0 text-teal-500" /> : <ChevronRight size={16} className="shrink-0 text-slate-400" />}
                    <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-300">{String(index + 1).padStart(2, '0')}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-slate-900 dark:text-white">{section.title || labelFor(section.sectionKey)}</span>
                      <span className="mt-0.5 block truncate font-mono text-[11px] text-slate-500">{section.sectionKey}</span>
                    </span>
                    {!section.isEnabled && <span className="rounded-full bg-slate-500/10 px-2 py-1 text-[10px] font-bold text-slate-500">Hidden</span>}
                    {dirtyIds.has(section.id) && <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-700 dark:text-amber-300">Unsaved</span>}
                    {!dirtyIds.has(section.id) && section.hasDraft && <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-700 dark:text-amber-300">Draft</span>}
                    {!section.hasDraft && !dirtyIds.has(section.id) && <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">Published</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => void toggleSection(section)}
                    title={section.isEnabled ? 'Hide section from the website' : 'Show section on the website'}
                    aria-label={section.isEnabled ? 'Hide section' : 'Show section'}
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-teal-600 dark:text-slate-300 dark:hover:bg-white/10"
                  >
                    {section.isEnabled ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => void reorderSection(index, -1)}
                    aria-label="Move section up"
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:text-slate-300 dark:hover:bg-white/10"
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    type="button"
                    disabled={index === sections.length - 1}
                    onClick={() => void reorderSection(index, 1)}
                    aria-label="Move section down"
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:text-slate-300 dark:hover:bg-white/10"
                  >
                    <ArrowDown size={15} />
                  </button>
                  </div>

                  {isOpen && (
                    <div className="space-y-5 border-t border-slate-200 px-4 py-5 dark:border-white/10 sm:px-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        {CORE_FIELDS.map(([key, label]) => (
                          <label key={key} className={`space-y-1.5 ${key === 'description' ? 'md:col-span-2' : ''}`}>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{label}</span>
                            <ContentField
                              label={label}
                              value={(section as any)[key] ?? ''}
                              path={[]}
                              onChange={(_, value) => updateSection(section.id, (current) => ({ ...current, [key]: value }))}
                            />
                          </label>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Section content</h2>
                          <p className="mt-1 text-xs text-slate-500">Update text, links, images, values, and repeated items saved with this section.</p>
                        </div>
                        <ContentField
                          label="Content"
                          value={customContent}
                          path={[]}
                          onChange={(_, value) => updateContent(section.id, [], value)}
                        />
                      </div>

                      <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4 dark:border-white/10">
                        <button
                          type="button"
                          onClick={() => void saveSectionDraft(section)}
                          disabled={saveState !== 'idle' || !dirtyIds.has(section.id)}
                          className="rounded-lg border border-teal-500/40 px-3 py-2 text-xs font-bold text-teal-700 disabled:opacity-50 dark:text-teal-300"
                        >
                          Save Section Draft
                        </button>
                        <button
                          type="button"
                          onClick={() => void publishSection(section)}
                          disabled={saveState !== 'idle' || !page?.isPublished}
                          className="rounded-lg bg-teal-500 px-3 py-2 text-xs font-extrabold text-slate-950 disabled:opacity-50"
                        >
                          {page?.isPublished ? 'Save & Publish Section' : 'Publish page to make live'}
                        </button>
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </main>
    </AdminLayout>
  );
}
