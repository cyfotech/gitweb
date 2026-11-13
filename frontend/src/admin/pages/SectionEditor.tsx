import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Eye, EyeOff, Save, Upload, GripVertical,
  CheckCircle, AlertCircle, Plus, Layers, Monitor, Laptop,
  Tablet, Smartphone, ArrowUp, ArrowDown, RefreshCw, ExternalLink,
  Sliders, Type, Image as ImageIcon, Code, Check, X,
  Edit3, Maximize2, Minimize2, ArrowRight, ZoomIn, ZoomOut,
  RotateCcw as ResetIcon, Trash2, Copy, AlignLeft, AlignCenter,
  AlignRight, ChevronUp, ChevronDown, Search,
  SlidersHorizontal, FileText, Undo, Redo2, Clock,
  BarChart2, MoreVertical, History, AlertTriangle
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { PublicPagePreview } from '../components/PublicPagePreview';
import { AddSectionModal, ComponentTemplate } from '../components/AddSectionModal';
import { pagesApi } from '../../api/pages';
import { sectionsApi } from '../../api/sections';
import { mediaApi } from '../../api/media';
import { MediaSelectorModal } from '../components/MediaSelectorModal';
import { useVisualEditor } from '../../context/VisualEditorContext';
import { useBackendStatus } from '../../context/BackendStatusContext';
import { PageSectionData } from '../../hooks/usePageContent';

// ─── Types ───────────────────────────────────────────────────────────────────

type SaveStatus = 'idle' | 'saving' | 'saved' | 'publishing' | 'published' | 'error';
type AutosaveStatus = 'idle' | 'saving' | 'saved';
type DeviceMode = 'desktop' | 'laptop' | 'tablet' | 'mobile';
type BottomTab =
  | 'content' | 'media' | 'chart' | 'button'
  | 'design' | 'layout' | 'animation' | 'history' | 'advanced';

interface HistoryEntry {
  sections: PageSectionData[];
  timestamp: number;
  label: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const buildFieldsArray = (sec: PageSectionData): { fieldKey: string; value: string }[] => {
  const fields: { fieldKey: string; value: string }[] = [
    { fieldKey: 'title', value: sec.title || '' },
    { fieldKey: 'subheading', value: sec.subheading || '' },
    { fieldKey: 'description', value: sec.description || '' },
    { fieldKey: 'backgroundImage', value: sec.backgroundImage || '' },
    { fieldKey: 'backgroundVideo', value: sec.backgroundVideo || '' },
  ];
  if (sec.content) {
    try {
      const parsed = JSON.parse(sec.content);
      Object.entries(parsed).forEach(([k, v]) => {
        if (!['title', 'subheading', 'description', 'backgroundImage', 'backgroundVideo'].includes(k)) {
          fields.push({ fieldKey: k, value: typeof v === 'object' ? JSON.stringify(v) : String(v) });
        }
      });
    } catch { }
  }
  return fields;
};

const getDeviceWidth = (mode: DeviceMode): string => {
  switch (mode) {
    case 'mobile': return '375px';
    case 'tablet': return '768px';
    case 'laptop': return '1024px';
    default: return '100%';
  }
};

function mapSectionForEditor(sec: any): PageSectionData {
  let draft: Record<string, any> | null = null;
  if (sec.draftData) {
    try {
      const parsed = JSON.parse(sec.draftData);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('Draft content must be an object.');
      }
      draft = parsed;
    } catch (error) {
      throw new Error(`Could not load the saved draft for "${sec.sectionKey}".`, { cause: error });
    }
  }

  const content = draft?.content ?? sec.content ?? '';
  return {
    id: sec.id,
    pageId: sec.pageId,
    sectionKey: sec.sectionKey,
    sectionType: sec.sectionType || sec.sectionKey,
    displayOrder: sec.displayOrder ?? 0,
    isEnabled: sec.isEnabled ?? true,
    title: draft?.title ?? sec.title ?? '',
    subheading: draft?.subheading ?? sec.subheading ?? '',
    description: draft?.description ?? sec.description ?? '',
    backgroundImage: draft?.backgroundImage ?? sec.backgroundImage ?? '',
    backgroundVideo: draft?.backgroundVideo ?? sec.backgroundVideo ?? '',
    imagePosition: draft?.imagePosition ?? sec.imagePosition ?? null,
    imageAltText: draft?.imageAltText ?? sec.imageAltText ?? null,
    content: typeof content === 'string' ? content : JSON.stringify(content),
    updatedAt: sec.updatedAt ? new Date(sec.updatedAt).toISOString() : undefined,
  };
}

const getSectionElements = (sec: PageSectionData): { key: string; label: string; type: string }[] => {
  const elements: { key: string; label: string; type: string }[] = [];
  if (sec.title) elements.push({ key: 'title', label: 'Main Heading', type: 'heading' });
  if (sec.subheading) elements.push({ key: 'subheading', label: 'Subheading', type: 'subheading' });
  if (sec.description) elements.push({ key: 'description', label: 'Description', type: 'paragraph' });
  if (sec.backgroundImage) elements.push({ key: 'backgroundImage', label: 'Background Image', type: 'image' });
  if (sec.content) {
    try {
      const parsed = JSON.parse(sec.content);
      Object.keys(parsed).forEach(k => {
        if (!['title', 'subheading', 'description', 'backgroundImage', 'backgroundVideo'].includes(k) && !k.startsWith('_style_')) {
          const v = parsed[k];
          const type = typeof v === 'object' && v?.dataPoints ? 'chart' : 'paragraph';
          elements.push({ key: k, label: k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), type });
        }
      });
    } catch { }
  }
  return elements;
};

// ─── Navigation Guard Modal ────────────────────────────────────────────────

function NavGuardModal({
  onSaveAndLeave,
  onDiscardAndLeave,
  onStay,
}: {
  onSaveAndLeave: () => void;
  onDiscardAndLeave: () => void;
  onStay: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#07161D] border border-teal-500/20 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle size={18} className="text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Unsaved Changes</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              You have unsaved changes to this page. What would you like to do before leaving?
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <button
            type="button"
            onClick={onSaveAndLeave}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-bold text-sm transition-all hover:brightness-110"
          >
            Save Draft & Leave
          </button>
          <button
            type="button"
            onClick={onDiscardAndLeave}
            className="w-full py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 font-bold text-sm hover:bg-rose-500/20 transition-all"
          >
            Discard Changes & Leave
          </button>
          <button
            type="button"
            onClick={onStay}
            className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold text-sm hover:bg-white/10 transition-all"
          >
            Stay & Continue Editing
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Editor Page ─────────────────────────────────────────────────────────

export function SectionEditorPage() {
  const { pageId } = useParams<{ pageId: string }>();
  const [page, setPage] = useState<any>(null);
  const [sections, setSections] = useState<PageSectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Save states
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>('idle');

  // Editor UI state
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [searchSectionQuery, setSearchSectionQuery] = useState('');

  // Fullscreen canvas
  const [isCanvasFullscreen, setIsCanvasFullscreen] = useState(false);

  // Bottom dock
  const [isBottomDockExpanded, setIsBottomDockExpanded] = useState(true);
  const [bottomDockHeight, setBottomDockHeight] = useState(380);
  const [activeBottomTab, setActiveBottomTab] = useState<BottomTab>('content');
  const [sectionRevisions, setSectionRevisions] = useState<any[]>([]);
  const [loadingRevisions, setLoadingRevisions] = useState(false);

  // Sidebar section tree
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [contextMenuId, setContextMenuId] = useState<string | null>(null);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });

  // Drag & drop
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Undo/Redo
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Media / upload
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [elementSaving, setElementSaving] = useState(false);
  const [elementSaveSuccess, setElementSaveSuccess] = useState(false);

  // Element styles
  const [elementStyles, setElementStyles] = useState({
    fontSize: '16px', fontWeight: 'normal', color: '#ffffff',
    textAlign: 'left' as 'left' | 'center' | 'right',
    lineHeight: '1.5', letterSpacing: 'normal', backgroundColor: '',
    borderRadius: '8px', objectFit: 'contain' as 'contain' | 'cover' | 'fill', padding: '12px',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewScrollContainerRef = useRef<HTMLDivElement>(null);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const visualEditor = useVisualEditor();
  const { isFullyAvailable } = useBackendStatus();

  // ─── Browser unload warning for unsaved changes ─────────────────────────────
  const hasUnsavedChanges = visualEditor?.draftState?.hasUnsavedChanges ?? false;
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // ─── Load Page ──────────────────────────────────────────────────────────────
  const fetchPage = useCallback(async () => {
    if (!pageId) { setLoadError('No page ID provided.'); setLoading(false); return; }
    setLoading(true);
    setLoadError(null);
    try {
      const data = await pagesApi.getById(pageId);
      const pageData = data?.data ?? data;
      if (!pageData) throw new Error('Page not found or empty response.');
      setPage(pageData);
      const rawSections = pageData.sections || pageData.pagesection || [];
      const mapped: PageSectionData[] = rawSections.map(mapSectionForEditor);
      mapped.sort((a, b) => a.displayOrder - b.displayOrder);
      setSections(mapped);
      visualEditor?.setActivePage(pageId, pageData.slug, mapped);
      // Seed undo history
      setHistory([{ sections: mapped, timestamp: Date.now(), label: 'Initial Load' }]);
      setHistoryIndex(0);
    } catch (err: any) {
      setLoadError(err.message || 'Failed to load page.');
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => { fetchPage(); }, [fetchPage]);

  // ─── Sync sections from visual editor context ───────────────────────────────
  useEffect(() => {
    const len = visualEditor?.draftState?.sections?.length ?? 0;
    if (len > 0) {
      setSections(visualEditor!.draftState.sections);
    }
  }, [visualEditor?.draftState?.sections]);

  // ─── Auto-open bottom dock when element selected ────────────────────────────
  useEffect(() => {
    if (visualEditor?.draftState?.selectedElement) {
      setIsBottomDockExpanded(true);
      setActiveBottomTab('content');
    }
  }, [visualEditor?.draftState?.selectedElement?.elementKey, visualEditor?.draftState?.selectedElement?.sectionKey]);

  // ─── Keyboard shortcuts (Ctrl+Z, Ctrl+Y) ───────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // ─── Undo / Redo ────────────────────────────────────────────────────────────
  const pushToHistory = useCallback((newSections: PageSectionData[], label: string) => {
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIndex + 1);
      const entry: HistoryEntry = { sections: [...newSections], timestamp: Date.now(), label };
      return [...trimmed, entry].slice(-50);
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    const entry = history[newIndex];
    setHistoryIndex(newIndex);
    setSections(entry.sections);
    visualEditor?.setDraftSections(entry.sections);
  }, [historyIndex, history, visualEditor]);

  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    const entry = history[newIndex];
    setHistoryIndex(newIndex);
    setSections(entry.sections);
    visualEditor?.setDraftSections(entry.sections);
  }, [historyIndex, history, visualEditor]);

  // ─── Autosave ────────────────────────────────────────────────────────────────
  const triggerAutosave = useCallback(() => {
    if (!isFullyAvailable) return;
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(async () => {
      setAutosaveStatus('saving');
      try {
        const currentSections = visualEditor?.draftState?.sections || sections;
        for (const sec of currentSections) {
          const result = await sectionsApi.saveContent(sec.id, {
            fields: buildFieldsArray(sec),
            isDraft: true,
            note: `Autosaved at ${new Date().toLocaleTimeString()}`,
            expectedUpdatedAt: sec.updatedAt,
          });
          const updatedAt = result.updatedAt || sec.updatedAt;
          setSections((prev) => prev.map((item) => item.id === sec.id ? { ...item, updatedAt } : item));
          visualEditor?.updateSectionDraft(sec.id, { updatedAt });
        }
        setAutosaveStatus('saved');
        visualEditor?.markSaved();
        setTimeout(() => setAutosaveStatus('idle'), 3000);
      } catch {
        setAutosaveStatus('idle');
      }
    }, 3000);
  }, [isFullyAvailable, sections, visualEditor]);

  // ─── Save Draft ──────────────────────────────────────────────────────────────
  const handleSaveDraft = useCallback(async () => {
    if (!isFullyAvailable) return;
    setSaveStatus('saving');
    try {
      const currentSections = visualEditor?.draftState?.sections || sections;
      for (const sec of currentSections) {
        const result = await sectionsApi.saveContent(sec.id, {
          fields: buildFieldsArray(sec),
          isDraft: true,
          note: `Draft saved at ${new Date().toLocaleTimeString()}`,
          expectedUpdatedAt: sec.updatedAt,
        });
        const updatedAt = result.updatedAt || sec.updatedAt;
        setSections((prev) => prev.map((item) => item.id === sec.id ? { ...item, updatedAt } : item));
        visualEditor?.updateSectionDraft(sec.id, { updatedAt });
      }
      setSaveStatus('saved');
      visualEditor?.markSaved();
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  }, [isFullyAvailable, sections, visualEditor]);

  // ─── Publish ─────────────────────────────────────────────────────────────────
  const handlePublish = useCallback(async () => {
    if (!isFullyAvailable) return;
    setSaveStatus('publishing');
    try {
      const currentSections = visualEditor?.draftState?.sections || sections;
      for (const sec of currentSections) {
        const result = await sectionsApi.saveContent(sec.id, {
          fields: buildFieldsArray(sec),
          isDraft: true,
          note: `Prepared for publish at ${new Date().toLocaleTimeString()}`,
          expectedUpdatedAt: sec.updatedAt,
        });
        const updatedAt = result.updatedAt || sec.updatedAt;
        setSections((prev) => prev.map((item) => item.id === sec.id ? { ...item, updatedAt } : item));
        visualEditor?.updateSectionDraft(sec.id, { updatedAt });
      }
      await pagesApi.publish(pageId!, true);
      setSaveStatus('published');
      visualEditor?.markSaved();
      setTimeout(() => setSaveStatus('idle'), 4000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  }, [isFullyAvailable, sections, pageId, visualEditor]);

  // ─── Save element to database ─────────────────────────────────────────────
  const handleSaveElementToDatabase = async () => {
    if (!selectedSection || !isFullyAvailable) return;
    setElementSaving(true);
    try {
      const result = await sectionsApi.saveContent(selectedSection.id, {
        fields: buildFieldsArray(selectedSection),
        isDraft: true,
        note: `Element draft saved at ${new Date().toLocaleTimeString()}`,
        expectedUpdatedAt: selectedSection.updatedAt,
      });
      const updatedAt = result.updatedAt || selectedSection.updatedAt;
      setSections((prev) => prev.map((item) => item.id === selectedSection.id ? { ...item, updatedAt } : item));
      visualEditor?.updateSectionDraft(selectedSection.id, { updatedAt });
      setElementSaveSuccess(true);
      visualEditor?.markSaved();
      setTimeout(() => setElementSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save element:', err);
    } finally {
      setElementSaving(false);
    }
  };

  // ─── Section actions ──────────────────────────────────────────────────────
  const moveSection = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);
    const reordered = newSections.map((s, idx) => ({ ...s, displayOrder: idx }));
    setSections(reordered);
    visualEditor?.setDraftSections(reordered);
    pushToHistory(reordered, `Moved "${moved.title || moved.sectionKey}" ${direction}`);
    try {
      await pagesApi.reorderSections(pageId!, reordered.map(s => ({ sectionId: s.id, displayOrder: s.displayOrder })));
    } catch { }
  };

  const toggleVisibility = async (sec: PageSectionData, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = !sec.isEnabled;
    const remapped = sections.map(s => s.id === sec.id ? { ...s, isEnabled: updated } : s);
    setSections(remapped);
    visualEditor?.setDraftSections(remapped);
    try { await sectionsApi.toggleVisibility(sec.id, updated); } catch { }
  };

  const handleDeleteSection = async (sec: PageSectionData) => {
    if (!window.confirm(`Delete section "${sec.title || sec.sectionKey}"? This cannot be undone.`)) return;
    setContextMenuId(null);
    try {
      if (isFullyAvailable) await sectionsApi.delete(sec.id);
      visualEditor?.deleteSection(sec.sectionKey);
      const newSections = sections.filter(s => s.id !== sec.id).map((s, idx) => ({ ...s, displayOrder: idx }));
      setSections(newSections);
      pushToHistory(newSections, `Deleted "${sec.title || sec.sectionKey}"`);
    } catch (err: any) {
      alert('Failed to delete section: ' + (err.message || 'Server error'));
    }
  };

  const handleDuplicateSection = async (sec: PageSectionData) => {
    setContextMenuId(null);
    try {
      if (isFullyAvailable) {
        const result = await sectionsApi.duplicate(sec.id);
        const dupe = result?.data ?? result;
        if (dupe) {
          const index = sections.findIndex(s => s.id === sec.id);
          const newSections = [...sections];
          newSections.splice(index + 1, 0, { ...dupe, displayOrder: index + 1 });
          const reordered = newSections.map((s, idx) => ({ ...s, displayOrder: idx }));
          setSections(reordered);
          visualEditor?.setDraftSections(reordered);
          pushToHistory(reordered, `Duplicated "${sec.title || sec.sectionKey}"`);
        }
      } else {
        visualEditor?.duplicateSection(sec.sectionKey);
      }
    } catch (err: any) {
      alert('Failed to duplicate: ' + (err.message || 'Error'));
    }
  };

  const handleStartRename = (sec: PageSectionData) => {
    setContextMenuId(null);
    setRenamingId(sec.id);
    setRenameValue(sec.title || sec.sectionKey);
    setTimeout(() => renameInputRef.current?.focus(), 50);
  };

  const handleConfirmRename = async (sec: PageSectionData) => {
    if (!renameValue.trim() || renameValue.trim() === (sec.title || sec.sectionKey)) {
      setRenamingId(null);
      return;
    }
    try {
      if (isFullyAvailable) await sectionsApi.rename(sec.id, { title: renameValue.trim() });
      const newSections = sections.map(s => s.id === sec.id ? { ...s, title: renameValue.trim() } : s);
      setSections(newSections);
      visualEditor?.setDraftSections(newSections);
    } catch { }
    setRenamingId(null);
  };

  // ─── Add section ──────────────────────────────────────────────────────────
  const handleAddNewSection = async (template: ComponentTemplate) => {
    if (!pageId) return;
    const suffix = Date.now().toString(36).slice(-4);
    const newKey = `${template.type.toLowerCase()}_${suffix}`;
    try {
      let created: PageSectionData;
      if (isFullyAvailable) {
        const result = await sectionsApi.create({
          pageId, sectionKey: newKey, sectionType: template.type,
          title: template.defaultTitle, subheading: template.defaultSubheading,
          description: template.defaultDescription,
          content: JSON.stringify(template.defaultContent),
          displayOrder: sections.length, isEnabled: true,
        });
        created = result?.data ?? result;
      } else {
        created = {
          id: `sec_${Date.now()}`, pageId, sectionKey: newKey, sectionType: template.type,
          title: template.defaultTitle, subheading: template.defaultSubheading,
          description: template.defaultDescription,
          content: JSON.stringify(template.defaultContent),
          displayOrder: sections.length, isEnabled: true,
          backgroundImage: '', backgroundVideo: '', imagePosition: null, imageAltText: null,
        };
      }
      const newSections = [...sections, created];
      setSections(newSections);
      visualEditor?.setDraftSections(newSections);
      visualEditor?.selectSection(created.id, created.sectionKey);
      pushToHistory(newSections, `Added "${created.title}"`);
      setTimeout(() => {
        const el = document.getElementById(`section-${created.sectionKey}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    } catch (err) { console.error('Failed to add section:', err); }
  };

  // ─── Drag & Drop ─────────────────────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };
  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null); setDragOverIndex(null); return;
    }
    const newSections = [...sections];
    const [moved] = newSections.splice(dragIndex, 1);
    newSections.splice(dropIndex, 0, moved);
    const reordered = newSections.map((s, idx) => ({ ...s, displayOrder: idx }));
    setSections(reordered);
    visualEditor?.setDraftSections(reordered);
    pushToHistory(reordered, `Reordered sections`);
    setDragIndex(null); setDragOverIndex(null);
    try {
      await pagesApi.reorderSections(pageId!, reordered.map(s => ({ sectionId: s.id, displayOrder: s.displayOrder })));
    } catch { }
  };
  const handleDragEnd = () => { setDragIndex(null); setDragOverIndex(null); };

  // ─── Revisions ───────────────────────────────────────────────────────────
  const fetchSectionRevisions = async (sectionId: string) => {
    setLoadingRevisions(true);
    try {
      const data = await sectionsApi.getById(sectionId);
      setSectionRevisions((data?.data ?? data)?.revisions || []);
    } catch { }
    setLoadingRevisions(false);
  };

  const handleRestoreRevision = async (sectionId: string, revisionId: string) => {
    if (!window.confirm('Restore this revision? Current changes will be replaced.')) return;
    try {
      await sectionsApi.restoreRevision(sectionId, revisionId);
      await fetchPage();
    } catch (err: any) { alert('Failed to restore: ' + (err.message || 'Error')); }
  };

  // ─── Media upload ─────────────────────────────────────────────────────────
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedSection || !isFullyAvailable) return;
    setUploadingMedia(true); setUploadError(null); setUploadSuccess(false);
    try {
      const res = await mediaApi.upload(file, 'website_builder');
      const resData = (res as any)?.data ?? res;
      const fileUrl = resData?.url || resData?.storageLocation;
      if (fileUrl) {
        if (selectedElement && (selectedElement.elementType === 'image' || selectedElement.elementType === 'video')) {
          handleElementValueChange(fileUrl);
        } else {
          handleSectionFieldChange('backgroundImage', fileUrl);
        }
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (err: any) { setUploadError(err.message || 'Upload failed'); }
    setUploadingMedia(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─── Element / Section field changes ─────────────────────────────────────
  const selectedElement = visualEditor?.draftState?.selectedElement;
  const selectedSection = sections.find(
    s => s.sectionKey === (selectedElement?.sectionKey || visualEditor?.draftState?.selectedSectionKey)
  ) || sections[0];

  const handleElementValueChange = (newVal: any) => {
    if (!selectedElement) return;
    visualEditor?.updateElementDraft(selectedElement.sectionKey, selectedElement.elementKey, newVal, elementStyles);
    triggerAutosave();
  };

  const handleStyleChange = (key: string, val: any) => {
    const updated = { ...elementStyles, [key]: val };
    setElementStyles(updated);
    if (selectedElement) {
      visualEditor?.updateElementDraft(selectedElement.sectionKey, selectedElement.elementKey, selectedElement.currentValue, updated);
    }
  };

  const handleSectionFieldChange = (key: string, val: string) => {
    if (!selectedSection) return;
    visualEditor?.updateSectionDraft(selectedSection.id, { [key]: val });
    triggerAutosave();
  };

  // ─── Filter sections by search ────────────────────────────────────────────
  const filteredSections = sections.filter(s => {
    if (!searchSectionQuery) return true;
    const q = searchSectionQuery.toLowerCase();
    return (s.title && s.title.toLowerCase().includes(q)) ||
      (s.sectionKey && s.sectionKey.toLowerCase().includes(q)) ||
      (s.sectionType && s.sectionType.toLowerCase().includes(q));
  });

  // ─── Save status display ──────────────────────────────────────────────────
  const getSaveButtonContent = () => {
    switch (saveStatus) {
      case 'publishing': return <><RefreshCw size={13} className="animate-spin" /><span>Publishing...</span></>;
      case 'published': return <><Check size={13} /><span>Published!</span></>;
      case 'saving': return <><RefreshCw size={13} className="animate-spin" /><span>Saving...</span></>;
      case 'saved': return <><Check size={13} /><span>Saved!</span></>;
      case 'error': return <><AlertCircle size={13} /><span>Failed</span></>;
      default: return <><Save size={13} /><span>Publish to Website</span></>;
    }
  };

  const getPublishBtnClass = () => {
    if (saveStatus === 'published') return 'bg-emerald-500 text-slate-950';
    if (saveStatus === 'error') return 'bg-rose-500 text-white';
    return 'bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 hover:brightness-110';
  };

  // ─── Loading / Error ─────────────────────────────────────────────────────
  if (loading && !page) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mx-auto mb-4 animate-spin">
            <RefreshCw size={28} />
          </div>
          <h2 className="text-base font-bold text-white mb-1">Loading Visual Page Editor...</h2>
          <p className="text-xs text-slate-400 max-w-sm">Connecting to database and mounting canvas workspace.</p>
        </div>
      </AdminLayout>
    );
  }

  if (loadError) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Unable to Load Page Editor</h2>
          <p className="text-xs text-rose-300 max-w-md mx-auto mb-6 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 font-mono">{loadError}</p>
          <div className="flex items-center gap-3">
            <button type="button" onClick={fetchPage} className="px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer">
              <RefreshCw size={14} /><span>Retry</span>
            </button>
            <Link to="/admin/pages" className="px-5 py-2.5 rounded-xl bg-white/5 text-slate-300 font-bold text-xs flex items-center gap-2 border border-white/10">
              <ChevronLeft size={14} /><span>Back to Pages</span>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" className="hidden" accept="image/*,video/*" onChange={handleFileUpload} />

      <div className="flex flex-col overflow-hidden bg-slate-950 text-white font-sans antialiased select-none" style={{ height: 'calc(100vh - 64px)' }}>

        {/* ─── TOP COMMAND BAR ────────────────────────────────────────────── */}
        <header className="h-13 px-4 bg-[#07161D] border-b border-teal-500/20 flex items-center justify-between gap-3 shrink-0 z-30 shadow-md">
          {/* Left: Back + Page name */}
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/admin/pages" className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors shrink-0">
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">All Pages</span>
            </Link>
            <div className="h-4 w-px bg-teal-500/20 shrink-0" />
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-extrabold text-white truncate">{page?.title || 'Visual Page Builder'}</span>
              {page?.slug && (
                <span className="hidden sm:inline text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/20 shrink-0">
                  /{page.slug}
                </span>
              )}
              {visualEditor?.draftState?.hasUnsavedChanges && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse shrink-0">
                  Unsaved
                </span>
              )}
            </div>
          </div>

          {/* Center: Device + Zoom */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-teal-500/20">
              {([
                { mode: 'desktop', Icon: Monitor, title: 'Desktop' },
                { mode: 'laptop', Icon: Laptop, title: 'Laptop (1024px)' },
                { mode: 'tablet', Icon: Tablet, title: 'Tablet (768px)' },
                { mode: 'mobile', Icon: Smartphone, title: 'Mobile (375px)' },
              ] as { mode: DeviceMode; Icon: any; title: string }[]).map(({ mode, Icon, title }) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setDeviceMode(mode)}
                  title={title}
                  className={`p-1.5 rounded-lg transition-all ${deviceMode === mode ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-teal-500/20 text-xs">
              <button type="button" onClick={() => setZoomLevel(z => Math.max(0.5, +(z - 0.1).toFixed(1)))} className="p-1 rounded text-slate-400 hover:text-white">
                <ZoomOut size={13} />
              </button>
              <span className="font-mono text-[11px] px-1.5 text-teal-300 font-bold min-w-[36px] text-center">{Math.round(zoomLevel * 100)}%</span>
              <button type="button" onClick={() => setZoomLevel(z => Math.min(1.5, +(z + 0.1).toFixed(1)))} className="p-1 rounded text-slate-400 hover:text-white">
                <ZoomIn size={13} />
              </button>
              <button type="button" onClick={() => setZoomLevel(1)} className="p-1 rounded text-slate-400 hover:text-white" title="Reset zoom">
                <ResetIcon size={12} />
              </button>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Undo/Redo */}
            <div className="hidden sm:flex items-center gap-1 bg-black/30 p-1 rounded-lg border border-teal-500/15">
              <button
                type="button"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                title={`Undo (Ctrl+Z) — ${historyIndex} steps`}
                className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 transition-all"
              >
                <Undo size={13} />
              </button>
              <button
                type="button"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                title={`Redo (Ctrl+Y) — ${history.length - 1 - historyIndex} ahead`}
                className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 transition-all"
              >
                <Redo2 size={13} />
              </button>
            </div>

            {/* Autosave status */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 min-w-[90px]">
              {autosaveStatus === 'saving' && <><RefreshCw size={11} className="animate-spin text-teal-400" /><span className="text-teal-400">Autosaving</span></>}
              {autosaveStatus === 'saved' && <><CheckCircle size={11} className="text-emerald-400" /><span className="text-emerald-400">Autosaved</span></>}
              {autosaveStatus === 'idle' && visualEditor?.draftState?.hasUnsavedChanges && (
                <><Clock size={11} className="text-amber-400" /><span className="text-amber-400">Unsaved</span></>
              )}
            </div>

            {/* Fullscreen canvas toggle */}
            <button
              type="button"
              onClick={() => setIsCanvasFullscreen(f => !f)}
              title={isCanvasFullscreen ? 'Exit fullscreen' : 'Fullscreen canvas'}
              className="hidden md:flex items-center gap-1 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-teal-500/20 transition-all"
            >
              {isCanvasFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>

            {/* Public preview */}
            <a
              href={page?.slug === 'home' ? '/' : `/${page?.slug}`}
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 border border-white/10 hover:border-teal-500/30 transition-all"
            >
              <ExternalLink size={13} />
              <span>Preview</span>
            </a>

            {/* Discard */}
            {visualEditor?.draftState?.hasUnsavedChanges && (
              <button
                type="button"
                onClick={() => { if (window.confirm('Discard all unsaved changes?')) visualEditor.discardDraft(); }}
                className="hidden sm:block px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
              >
                Discard
              </button>
            )}

            {/* Save Draft */}
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={saveStatus === 'saving' || !isFullyAvailable}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 border border-white/10 hover:border-teal-500/30 hover:bg-white/10 transition-all cursor-pointer"
            >
              <Save size={13} />
              <span>Save Draft</span>
            </button>

            {/* Publish */}
            <button
              type="button"
              onClick={handlePublish}
              disabled={saveStatus === 'saving' || saveStatus === 'publishing' || !isFullyAvailable}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${getPublishBtnClass()}`}
            >
              {getSaveButtonContent()}
            </button>
          </div>
        </header>

        {/* ─── WORKSPACE BODY ─────────────────────────────────────────────── */}
        <div className="flex flex-1 min-h-0 relative">

          {/* ─── LEFT SIDEBAR ───────────────────────────────────────────── */}
          <aside className={`transition-all duration-300 border-r border-teal-500/15 bg-[#05131A] flex flex-col shrink-0 ${isCanvasFullscreen ? 'w-0 overflow-hidden' : isSidebarCollapsed ? 'w-12' : 'w-64 sm:w-72'}`}>

            {/* Sidebar Header */}
            <div className="p-3 border-b border-teal-500/15 flex items-center justify-between gap-2">
              {!isSidebarCollapsed && (
                <div className="flex items-center gap-2">
                  <Layers size={14} className="text-teal-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                    Structure ({sections.length})
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1 ml-auto">
                {!isSidebarCollapsed && (
                  <button
                    type="button"
                    onClick={() => setIsAddSectionModalOpen(true)}
                    className="p-1 px-2 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                    title="Add new section"
                  >
                    <Plus size={12} /><span>Add</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                  title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  {isSidebarCollapsed ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
                </button>
              </div>
            </div>

            {/* Search */}
            {!isSidebarCollapsed && (
              <div className="p-2 border-b border-teal-500/10">
                <div className="relative">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchSectionQuery}
                    onChange={e => setSearchSectionQuery(e.target.value)}
                    placeholder="Search sections..."
                    className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-black/40 border border-teal-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>
            )}

            {/* Section Tree */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredSections.map((sec, idx) => {
                const isSelected = visualEditor?.draftState?.selectedSectionId === sec.id || visualEditor?.draftState?.selectedSectionKey === sec.sectionKey;
                const isExpanded = expandedSections.has(sec.id);
                const elements = getSectionElements(sec);
                const isDragOver = dragOverIndex === idx;

                return (
                  <div key={sec.id}>
                    {/* Section Row */}
                    <div
                      draggable
                      onDragStart={e => handleDragStart(e, idx)}
                      onDragOver={e => handleDragOver(e, idx)}
                      onDrop={e => handleDrop(e, idx)}
                      onDragEnd={handleDragEnd}
                      onClick={() => {
                        visualEditor?.selectSection(sec.id, sec.sectionKey);
                        const el = document.getElementById(`section-${sec.sectionKey}`);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className={`group relative flex items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${isDragOver ? 'border-teal-400 bg-teal-500/10' :
                        isSelected ? 'bg-teal-500/15 border-teal-400 text-white shadow-lg' :
                          'bg-white/5 border-teal-500/10 text-slate-300 hover:bg-white/10 hover:border-teal-500/25'
                        } ${dragIndex === idx ? 'opacity-40' : ''}`}
                    >
                      {!isSidebarCollapsed ? (
                        <>
                          {/* Drag handle */}
                          <GripVertical size={12} className="text-slate-500 group-hover:text-slate-300 shrink-0 cursor-grab active:cursor-grabbing" />

                          {/* Expand toggle */}
                          <button
                            type="button"
                            onClick={e => { e.stopPropagation(); setExpandedSections(prev => { const s = new Set(prev); s.has(sec.id) ? s.delete(sec.id) : s.add(sec.id); return s; }); }}
                            className="shrink-0 text-slate-500 hover:text-white transition-colors"
                          >
                            {isExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                          </button>

                          {/* Section index */}
                          <span className="text-[10px] font-mono font-bold text-teal-400 shrink-0">
                            {String(idx + 1).padStart(2, '0')}
                          </span>

                          {/* Title (or inline rename input) */}
                          <div className="flex-1 min-w-0" onDoubleClick={e => { e.stopPropagation(); handleStartRename(sec); }}>
                            {renamingId === sec.id ? (
                              <input
                                ref={renameInputRef}
                                type="text"
                                value={renameValue}
                                onChange={e => setRenameValue(e.target.value)}
                                onBlur={() => handleConfirmRename(sec)}
                                onKeyDown={e => { if (e.key === 'Enter') handleConfirmRename(sec); if (e.key === 'Escape') setRenamingId(null); }}
                                onClick={e => e.stopPropagation()}
                                className="w-full px-1 py-0.5 rounded bg-black/60 border border-teal-400 text-xs text-white focus:outline-none"
                              />
                            ) : (
                              <>
                                <p className="text-xs font-semibold truncate leading-tight">{sec.title || sec.sectionKey.replace(/_/g, ' ')}</p>
                                <span className="text-[9px] text-slate-500 font-mono block truncate">{sec.sectionType}</span>
                              </>
                            )}
                          </div>

                          {/* Section Actions */}
                          <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button type="button" onClick={e => toggleVisibility(sec, e)} className="p-1 text-slate-400 hover:text-white transition-colors" title={sec.isEnabled ? 'Hide section' : 'Show section'}>
                              {sec.isEnabled ? <Eye size={11} className="text-teal-400" /> : <EyeOff size={11} />}
                            </button>
                            <button type="button" onClick={e => { e.stopPropagation(); moveSection(idx, 'up'); }} disabled={idx === 0} className="p-1 text-slate-400 hover:text-white disabled:opacity-20 transition-colors" title="Move up">
                              <ArrowUp size={11} />
                            </button>
                            <button type="button" onClick={e => { e.stopPropagation(); moveSection(idx, 'down'); }} disabled={idx === sections.length - 1} className="p-1 text-slate-400 hover:text-white disabled:opacity-20 transition-colors" title="Move down">
                              <ArrowDown size={11} />
                            </button>
                            {/* Context Menu Button */}
                            <button
                              type="button"
                              onClick={e => { e.stopPropagation(); setContextMenuId(contextMenuId === sec.id ? null : sec.id); setContextMenuPos({ x: e.clientX, y: e.clientY }); }}
                              className="p-1 text-slate-400 hover:text-white transition-colors"
                              title="Section options"
                            >
                              <MoreVertical size={11} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <span className="text-[10px] font-mono text-teal-400 font-bold w-full text-center">{String(idx + 1).padStart(2, '0')}</span>
                      )}
                    </div>

                    {/* Context Menu */}
                    {contextMenuId === sec.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setContextMenuId(null)} />
                        <div
                          className="fixed z-50 bg-[#07161D] border border-teal-500/20 rounded-xl shadow-2xl overflow-hidden min-w-[160px]"
                          style={{ top: Math.min(contextMenuPos.y, window.innerHeight - 180), left: Math.min(contextMenuPos.x, window.innerWidth - 180) }}
                        >
                          <button type="button" onClick={() => handleStartRename(sec)} className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-teal-500/10 hover:text-white flex items-center gap-2 transition-colors">
                            <Edit3 size={12} /> Rename
                          </button>
                          <button type="button" onClick={() => handleDuplicateSection(sec)} className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-teal-500/10 hover:text-white flex items-center gap-2 transition-colors">
                            <Copy size={12} /> Duplicate
                          </button>
                          <button type="button" onClick={e => toggleVisibility(sec, e)} className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-teal-500/10 hover:text-white flex items-center gap-2 transition-colors">
                            {sec.isEnabled ? <EyeOff size={12} /> : <Eye size={12} />} {sec.isEnabled ? 'Hide' : 'Show'}
                          </button>
                          <div className="border-t border-teal-500/15" />
                          <button type="button" onClick={() => handleDeleteSection(sec)} className="w-full text-left px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors">
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </>
                    )}

                    {/* Sub-elements (when expanded) */}
                    {isExpanded && !isSidebarCollapsed && elements.length > 0 && (
                      <div className="ml-6 mt-1 space-y-0.5">
                        {elements.map(el => {
                          const isElSelected = selectedElement?.sectionKey === sec.sectionKey && selectedElement?.elementKey === el.key;
                          return (
                            <div
                              key={el.key}
                              onClick={e => {
                                e.stopPropagation();
                                visualEditor?.selectElement({
                                  sectionKey: sec.sectionKey,
                                  sectionId: sec.id,
                                  elementKey: el.key,
                                  elementType: el.type as any,
                                  label: el.label,
                                  currentValue: el.type === 'heading' ? sec.title : el.type === 'subheading' ? sec.subheading : sec.description,
                                });
                              }}
                              className={`flex items-center gap-2 px-2 py-1 rounded-lg text-[11px] cursor-pointer transition-all ${isElSelected ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                                }`}
                            >
                              <Type size={10} className="text-teal-500/60 shrink-0" />
                              <span className="truncate">{el.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Section (bottom) */}
            {!isSidebarCollapsed && (
              <div className="p-2 border-t border-teal-500/15">
                <button
                  type="button"
                  onClick={() => setIsAddSectionModalOpen(true)}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 hover:from-teal-500/30 hover:to-cyan-500/30 border border-teal-500/30 text-teal-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <Plus size={14} /><span>Add New Section</span>
                </button>
              </div>
            )}
          </aside>

          {/* ─── CENTER CANVAS ───────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden relative">
            <main
              ref={previewScrollContainerRef}
              className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden bg-slate-900/90 flex flex-col items-center transition-all select-text"
              style={{ scrollBehavior: 'smooth' }}
            >
              <div
                style={{
                  width: getDeviceWidth(deviceMode),
                  minWidth: getDeviceWidth(deviceMode),
                  maxWidth: getDeviceWidth(deviceMode),
                  transformOrigin: 'top center',
                  ...(zoomLevel !== 1 ? {
                    transform: `scale(${zoomLevel})`,
                    marginBottom: `calc((${zoomLevel} - 1) * 100%)`,
                  } : {}),
                }}
                className="transition-all duration-300 shadow-2xl border border-teal-500/25 bg-white dark:bg-[#030F14] rounded-none"
              >
                {page?.slug && <PublicPagePreview pageSlug={page.slug} />}
              </div>
            </main>

            {/* ─── BOTTOM INSPECTOR DOCK ────────────────────────────────── */}
            <div
              style={{ height: isCanvasFullscreen ? '0px' : isBottomDockExpanded ? `${bottomDockHeight}px` : '42px' }}
              className={`transition-all duration-300 border-t border-teal-500/20 bg-[#071922] shadow-[0_-5px_25px_rgba(0,0,0,0.5)] flex flex-col shrink-0 z-30 ${isCanvasFullscreen ? 'overflow-hidden' : ''}`}
            >
              {/* Dock Header */}
              <div className="h-10 min-h-10 px-3 sm:px-4 border-b border-teal-500/15 flex items-center justify-between gap-2 bg-[#05131A] select-none shrink-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 min-w-0 text-xs font-bold text-teal-300">
                    <SlidersHorizontal size={14} className="text-teal-400" />
                    <span className="truncate" title={selectedElement ? `Inspector: ${selectedElement.label} (${selectedElement.elementType})` : 'Visual Workspace Inspector'}>
                      {selectedElement ? `Inspector: ${selectedElement.label} (${selectedElement.elementType})` : 'Visual Workspace Inspector'}
                    </span>
                  </div>
                  {selectedElement && (
                    <span className="hidden xl:block shrink-0 text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-slate-400 border border-teal-500/20">
                      {selectedElement.sectionKey}.{selectedElement.elementKey}
                    </span>
                  )}
                </div>

                {/* Tabs */}
                {isBottomDockExpanded && (
                  <div className="flex flex-1 min-w-0 items-center gap-0.5 bg-black/40 p-0.5 rounded-lg border border-teal-500/20 text-xs overflow-x-auto max-w-[560px]">
                    {(['content', 'media', 'chart', 'button', 'design', 'layout', 'animation', 'history', 'advanced'] as BottomTab[]).map(tab => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => {
                          setActiveBottomTab(tab);
                          if (tab === 'history' && selectedSection) fetchSectionRevisions(selectedSection.id);
                        }}
                        className={`px-2.5 py-1 rounded-md font-bold capitalize transition-all whitespace-nowrap ${activeBottomTab === tab ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                      >
                        {tab === 'chart' ? (selectedElement?.elementType === 'metric' ? '📈 Metric' : '📊 Chart') : tab === 'history' ? '📜 History' : tab === 'animation' ? '✨ Anim & Bars' : tab}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setIsBottomDockExpanded(!isBottomDockExpanded)}
                  className="shrink-0 p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white flex items-center gap-1 text-xs"
                >
                  {isBottomDockExpanded ? <><span className="text-[11px] hidden sm:inline">Collapse</span><ChevronDown size={14} /></> : <><span className="text-[11px] hidden sm:inline">Inspector</span><ChevronUp size={14} /></>}
                </button>
              </div>

              {/* Dock Content */}
              {isBottomDockExpanded && (
                <div className="flex-1 overflow-y-auto p-4 select-text">

                  {/* CONTENT TAB */}
                  {activeBottomTab === 'content' && (
                    <div className="max-w-4xl mx-auto space-y-3 text-xs">
                      {selectedElement ? (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          <div className="md:col-span-8 space-y-2">
                            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wide">{selectedElement.label}</label>
                            {selectedElement.elementType === 'metric' ? (
                              <div className="space-y-3 p-3 rounded-xl bg-black/40 border border-teal-500/20">
                                {(() => {
                                  const metricVal = (typeof selectedElement.currentValue === 'object' && selectedElement.currentValue !== null)
                                    ? selectedElement.currentValue
                                    : { label: 'Operational quality', value: '99.8%', icon: 'trending-up', animationSpeed: '1.3s', showBars: true };

                                  const updateMetricField = (field: string, val: any) => {
                                    handleElementValueChange({ ...metricVal, [field]: val });
                                  };

                                  return (
                                    <>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Metric Subtitle / Label</label>
                                          <input
                                            type="text"
                                            value={metricVal.label || ''}
                                            onChange={e => updateMetricField('label', e.target.value)}
                                            placeholder="e.g. Operational quality"
                                            className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-teal-500/25 text-white text-xs font-semibold focus:outline-none focus:border-teal-400"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Metric Value / Statistic</label>
                                          <input
                                            type="text"
                                            value={metricVal.value || ''}
                                            onChange={e => updateMetricField('value', e.target.value)}
                                            placeholder="e.g. 99.8%"
                                            className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-teal-500/25 text-teal-300 font-mono text-xs font-bold focus:outline-none focus:border-teal-400"
                                          />
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Badge Icon</label>
                                          <select
                                            value={metricVal.icon || 'trending-up'}
                                            onChange={e => updateMetricField('icon', e.target.value)}
                                            className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-teal-500/25 text-teal-300 text-xs focus:outline-none"
                                          >
                                            <option value="trending-up">📈 Trending Up (Growth)</option>
                                            <option value="shield">🛡️ Shield Check (Security)</option>
                                            <option value="award">🏆 Award (Excellence)</option>
                                            <option value="activity">⚡ Activity (Performance)</option>
                                          </select>
                                        </div>
                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Equalizer Pulse Speed</label>
                                          <select
                                            value={metricVal.animationSpeed || '1.3s'}
                                            onChange={e => updateMetricField('animationSpeed', e.target.value)}
                                            className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-teal-500/25 text-teal-300 text-xs focus:outline-none"
                                          >
                                            <option value="0.7s">Fast (0.7s pulse)</option>
                                            <option value="1.3s">Smooth (1.3s default)</option>
                                            <option value="2.2s">Relaxed (2.2s pulse)</option>
                                            <option value="0s">Static (No motion)</option>
                                          </select>
                                        </div>
                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Animated Bars</label>
                                          <button
                                            type="button"
                                            onClick={() => updateMetricField('showBars', metricVal.showBars === false ? true : false)}
                                            className={`w-full py-1.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${metricVal.showBars !== false
                                              ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                                              : 'bg-black/50 text-slate-400 border-teal-500/15'
                                              }`}
                                          >
                                            {metricVal.showBars !== false ? '✓ Bars Visible' : '✕ Bars Hidden'}
                                          </button>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-2 gap-3 pt-1">
                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Bar Gradient Top</label>
                                          <div className="flex items-center gap-2">
                                            <input
                                              type="color"
                                              value={metricVal.barColor || '#63f2e8'}
                                              onChange={e => updateMetricField('barColor', e.target.value)}
                                              className="w-8 h-7 rounded border border-teal-500/25 bg-black cursor-pointer"
                                            />
                                            <input
                                              type="text"
                                              value={metricVal.barColor || '#63f2e8'}
                                              onChange={e => updateMetricField('barColor', e.target.value)}
                                              className="flex-1 px-2 py-1 rounded-lg bg-black/50 border border-teal-500/25 text-xs text-teal-300 font-mono"
                                            />
                                          </div>
                                        </div>
                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Bar Gradient Bottom</label>
                                          <div className="flex items-center gap-2">
                                            <input
                                              type="color"
                                              value={metricVal.barColorEnd || '#218f98'}
                                              onChange={e => updateMetricField('barColorEnd', e.target.value)}
                                              className="w-8 h-7 rounded border border-teal-500/25 bg-black cursor-pointer"
                                            />
                                            <input
                                              type="text"
                                              value={metricVal.barColorEnd || '#218f98'}
                                              onChange={e => updateMetricField('barColorEnd', e.target.value)}
                                              className="flex-1 px-2 py-1 rounded-lg bg-black/50 border border-teal-500/25 text-xs text-teal-300 font-mono"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                            ) : selectedElement.elementType === 'paragraph' ? (
                              <textarea
                                rows={4}
                                value={selectedElement.currentValue || ''}
                                onChange={e => handleElementValueChange(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-teal-500/25 text-white text-xs leading-relaxed focus:outline-none focus:border-teal-400"
                                placeholder="Type paragraph text..."
                              />
                            ) : (
                              <input
                                type="text"
                                value={selectedElement.currentValue || ''}
                                onChange={e => handleElementValueChange(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-teal-500/25 text-white text-xs font-semibold focus:outline-none focus:border-teal-400"
                                placeholder="Type headline, label or value..."
                              />
                            )}
                            <div className="flex items-center gap-2 pt-2 border-t border-teal-500/20">
                              <button
                                type="button"
                                onClick={handleSaveElementToDatabase}
                                disabled={elementSaving || !isFullyAvailable}
                                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:brightness-110 text-slate-950 font-extrabold transition-all text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                              >
                                {elementSaving ? <><RefreshCw size={13} className="animate-spin" /><span>Saving...</span></> : elementSaveSuccess ? <><Check size={13} /><span>Saved!</span></> : <><Save size={13} /><span>Save Changes</span></>}
                              </button>
                              <button type="button" onClick={() => handleElementValueChange('')} className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/25 hover:bg-rose-500/20 text-xs font-bold transition-all">
                                Clear
                              </button>
                            </div>
                          </div>
                          <div className="md:col-span-4 p-3 rounded-xl bg-black/40 border border-teal-500/20 space-y-2">
                            <p className="text-[11px] font-bold text-teal-300 uppercase tracking-wide">Element Info</p>
                            <div className="space-y-1 text-[11px] text-slate-400">
                              <div><span className="text-slate-500">Type:</span> <span className="text-teal-300">{selectedElement.elementType}</span></div>
                              <div><span className="text-slate-500">Section:</span> <span className="font-mono text-xs text-slate-300">{selectedElement.sectionKey}</span></div>
                              <div><span className="text-slate-500">Key:</span> <span className="font-mono text-xs text-slate-300">{selectedElement.elementKey}</span></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 text-slate-400">
                          <Type size={24} className="mx-auto mb-2 text-teal-400" />
                          <p className="font-semibold text-slate-200">Select an element in the live preview</p>
                          <p className="text-[11px] text-slate-500 mt-1">Click any headline, paragraph, card, or button in the center preview to start editing.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MEDIA TAB */}
                  {activeBottomTab === 'media' && (
                    <div className="max-w-4xl mx-auto space-y-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-7 space-y-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wide mb-1">Media Asset URL</label>
                            <input
                              type="text"
                              value={
                                selectedElement && (selectedElement.elementType === 'image' || selectedElement.elementType === 'video')
                                  ? selectedElement.currentValue || ''
                                  : selectedSection?.backgroundImage || ''
                              }
                              onChange={e => {
                                if (selectedElement && (selectedElement.elementType === 'image' || selectedElement.elementType === 'video')) {
                                  handleElementValueChange(e.target.value);
                                } else {
                                  handleSectionFieldChange('backgroundImage', e.target.value);
                                }
                              }}
                              placeholder="https://... or upload below"
                              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-teal-500/25 text-white text-xs focus:outline-none focus:border-teal-400"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <button type="button" onClick={() => setIsMediaSelectorOpen(true)} className="py-2.5 px-4 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/40 text-teal-300 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer text-xs">
                              <ImageIcon size={15} /><span>Media Vault</span>
                            </button>
                            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingMedia || !isFullyAvailable} className="py-2.5 px-4 rounded-xl border border-dashed border-teal-500/40 hover:border-teal-400 bg-teal-500/5 hover:bg-teal-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer font-bold text-slate-300 text-xs">
                              <Upload size={15} /><span>{uploadingMedia ? 'Uploading...' : 'Upload File'}</span>
                            </button>
                          </div>
                          {uploadSuccess && <p className="text-[11px] text-emerald-400 font-semibold">Media uploaded successfully!</p>}
                          {uploadError && <p className="text-[11px] text-rose-400">{uploadError}</p>}
                          <button type="button" onClick={handleSaveElementToDatabase} disabled={elementSaving || !isFullyAvailable} className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:brightness-110 text-slate-950 font-extrabold transition-all text-xs flex items-center gap-1.5 shadow-md cursor-pointer">
                            {elementSaving ? <><RefreshCw size={13} className="animate-spin" /><span>Saving...</span></> : <><Save size={13} /><span>Save Media</span></>}
                          </button>
                        </div>
                        <div className="md:col-span-5 flex flex-col items-center justify-center p-3 rounded-2xl bg-black/60 border border-teal-500/20">
                          <span className="text-[10px] text-slate-400 mb-2 font-mono uppercase">Preview</span>
                          <div className="w-full aspect-video rounded-xl overflow-hidden bg-black/40 border border-teal-500/10 flex items-center justify-center">
                            <img
                              src={selectedElement?.currentValue || selectedSection?.backgroundImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600'}
                              alt="Media Preview"
                              className="w-full h-full object-contain"
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CHART TAB */}
                  {activeBottomTab === 'chart' && (
                    <div className="max-w-4xl mx-auto space-y-4 text-xs">
                      {selectedSection ? (() => {
                        let contentData: any = {};
                        try {
                          contentData = JSON.parse(selectedSection.content || '{}');
                          if (typeof contentData !== 'object' || contentData === null) contentData = {};
                        } catch { }

                        // Check if an element is specifically selected or if there is a chartConfig/chart key.
                        // The public renderer reads the per-element key (e.g. chart_about_performance),
                        // so we MUST resolve from that key only — never fall back to the whole section
                        // content object (which leaks unrelated demo keys like a stray top-level chartType).
                        const elementKey = selectedElement?.elementKey || 'chart_about_performance';
                        let currentMediaConfig = contentData[elementKey] ?? contentData.chartConfig ?? {};
                        if (typeof currentMediaConfig === 'string') {
                          try { currentMediaConfig = JSON.parse(currentMediaConfig); } catch { currentMediaConfig = {}; }
                        }
                        if (typeof currentMediaConfig !== 'object' || currentMediaConfig === null || Array.isArray(currentMediaConfig)) {
                          currentMediaConfig = {};
                        }

                        const displayMode: 'chart' | 'image' | 'video' | 'gif' = currentMediaConfig.displayMode || 'chart';

                        const updateMediaConfig = (patch: object) => {
                          const updatedConfig = { ...currentMediaConfig, ...patch };
                          if (selectedElement && selectedElement.elementKey) {
                            handleElementValueChange(updatedConfig);
                          } else {
                            const merged = { ...contentData, [elementKey]: updatedConfig };
                            handleSectionFieldChange('content', JSON.stringify(merged));
                          }
                        };

                        // Safely parse dataPoints if stored as JSON string or raw array
                        let rawPoints = currentMediaConfig.dataPoints || contentData.dataPoints;
                        if (typeof rawPoints === 'string') {
                          try { rawPoints = JSON.parse(rawPoints); } catch { rawPoints = []; }
                        }
                        const dataPoints: { label: string; value: number }[] = Array.isArray(rawPoints) ? rawPoints : [];

                        const updatePoint = (i: number, key: 'label' | 'value', val: string) => {
                          const pts = [...dataPoints];
                          pts[i] = { ...pts[i], [key]: key === 'value' ? parseFloat(val) || 0 : val };
                          updateMediaConfig({ dataPoints: pts });
                        };
                        const addPoint = () => updateMediaConfig({ dataPoints: [...dataPoints, { label: `Q${dataPoints.length + 1}`, value: 1000 }] });
                        const removePoint = (i: number) => updateMediaConfig({ dataPoints: dataPoints.filter((_, idx) => idx !== i) });

                        return (
                          <div className="space-y-4">
                            {/* Showcase Display Mode Switcher: Chart vs Image vs Video vs GIF */}
                            <div className="p-3.5 rounded-xl bg-black/40 border border-teal-500/20 space-y-3">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                  <h4 className="font-bold text-teal-300 flex items-center gap-2">
                                    <BarChart2 size={15} />
                                    <span>Showcase Visual Type</span>
                                  </h4>
                                  <p className="text-[11px] text-slate-400 mt-0.5">
                                    Switch this interactive showcase between dynamic Charts, high-res Images, Videos, or animated GIFs.
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-teal-500/30">
                                  {(['chart', 'image', 'video', 'gif'] as const).map(mode => (
                                    <button
                                      key={mode}
                                      type="button"
                                      onClick={() => updateMediaConfig({ displayMode: mode })}
                                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${displayMode === mode
                                        ? 'bg-teal-500 text-slate-950 shadow-md'
                                        : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                      {mode === 'chart' ? '📊 Chart' : mode === 'image' ? '🖼️ Image' : mode === 'video' ? '🎬 Video' : '✨ GIF'}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* MODE 1: CHART SETTINGS */}
                            {displayMode === 'chart' && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Chart Title</label>
                                    <input
                                      type="text"
                                      value={currentMediaConfig.title || 'Financial Performance Trend'}
                                      onChange={e => updateMediaConfig({ title: e.target.value })}
                                      className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-teal-500/25 text-white text-xs focus:outline-none focus:border-teal-400"
                                      placeholder="e.g. Financial Performance Trend"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Subtitle</label>
                                    <input
                                      type="text"
                                      value={currentMediaConfig.subtitle || ''}
                                      onChange={e => updateMediaConfig({ subtitle: e.target.value })}
                                      className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-teal-500/25 text-white text-xs focus:outline-none focus:border-teal-400"
                                      placeholder="Optional subtitle"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Unit / Suffix</label>
                                    <input
                                      type="text"
                                      value={currentMediaConfig.unit || ''}
                                      onChange={e => updateMediaConfig({ unit: e.target.value })}
                                      className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-teal-500/25 text-white text-xs focus:outline-none focus:border-teal-400"
                                      placeholder="%, $, etc."
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Chart Style</label>
                                    <select
                                      value={currentMediaConfig.chartType || 'line'}
                                      onChange={e => updateMediaConfig({ chartType: e.target.value })}
                                      className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-teal-500/25 text-teal-300 text-xs focus:outline-none"
                                    >
                                      <option value="line">Line / Trend Curve (Interactive)</option>
                                      <option value="bar">Bar Chart</option>
                                      <option value="horizontal_bar">Horizontal Bar Chart</option>
                                      <option value="area">Area Chart</option>
                                      <option value="stacked_bar">Stacked Bar Chart</option>
                                      <option value="pie">Pie Chart</option>
                                      <option value="donut">Donut Chart</option>
                                      <option value="radar">Radar Chart</option>
                                      <option value="scatter">Scatter Chart</option>
                                      <option value="mixed">Mixed Chart</option>
                                    </select>
                                  </div>
                                </div>

                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-slate-300 uppercase">Data Points ({dataPoints.length})</span>
                                    <button
                                      type="button"
                                      onClick={addPoint}
                                      className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                    >
                                      <Plus size={11} /> Add Row
                                    </button>
                                  </div>
                                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                                    {dataPoints.length === 0 ? (
                                      <div className="text-center py-4 text-slate-500 border border-dashed border-teal-500/20 rounded-xl">
                                        No data points. Click "Add Row" to begin.
                                      </div>
                                    ) : (
                                      dataPoints.map((pt, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-teal-500/15">
                                          <span className="text-[10px] font-mono text-slate-500 w-5 shrink-0">{i + 1}</span>
                                          <input
                                            type="text"
                                            value={pt.label}
                                            onChange={e => updatePoint(i, 'label', e.target.value)}
                                            placeholder="Label"
                                            className="flex-1 px-2 py-1 rounded-lg bg-black/50 border border-teal-500/20 text-white text-xs focus:outline-none focus:border-teal-400"
                                          />
                                          <input
                                            type="number"
                                            value={pt.value}
                                            onChange={e => updatePoint(i, 'value', e.target.value)}
                                            placeholder="Value"
                                            className="w-24 px-2 py-1 rounded-lg bg-black/50 border border-teal-500/20 text-teal-300 text-xs font-mono focus:outline-none focus:border-teal-400"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => removePoint(i)}
                                            className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 shrink-0 cursor-pointer"
                                          >
                                            <X size={11} />
                                          </button>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* MODE 2, 3, 4: IMAGE / VIDEO / GIF MEDIA SETTINGS */}
                            {(displayMode === 'image' || displayMode === 'video' || displayMode === 'gif') && (
                              <div className="p-3.5 rounded-xl bg-black/40 border border-teal-500/20 space-y-3">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">
                                    {displayMode.toUpperCase()} Asset URL
                                  </label>
                                  <input
                                    type="text"
                                    value={currentMediaConfig.mediaUrl || ''}
                                    onChange={e => updateMediaConfig({ mediaUrl: e.target.value })}
                                    placeholder={
                                      displayMode === 'video'
                                        ? 'https://... video.mp4 or webm'
                                        : displayMode === 'gif'
                                          ? 'https://... animated.gif'
                                          : 'https://... image.webp, png or jpg'
                                    }
                                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-teal-500/25 text-white text-xs focus:outline-none focus:border-teal-400"
                                  />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Header Title (Optional)</label>
                                    <input
                                      type="text"
                                      value={currentMediaConfig.title || ''}
                                      onChange={e => updateMediaConfig({ title: e.target.value })}
                                      placeholder="e.g. Platform Overview"
                                      className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-teal-500/25 text-white text-xs focus:outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Alt / Accessibility Text</label>
                                    <input
                                      type="text"
                                      value={currentMediaConfig.altText || ''}
                                      onChange={e => updateMediaConfig({ altText: e.target.value })}
                                      placeholder="e.g. Visual Overview of Strategy"
                                      className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-teal-500/25 text-white text-xs focus:outline-none"
                                    />
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => setIsMediaSelectorOpen(true)}
                                    className="px-3 py-2 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/40 text-teal-300 font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs"
                                  >
                                    <ImageIcon size={14} /><span>Select from Vault</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingMedia || !isFullyAvailable}
                                    className="px-3 py-2 rounded-xl border border-dashed border-teal-500/40 hover:border-teal-400 bg-teal-500/5 hover:bg-teal-500/10 flex items-center gap-1.5 transition-all cursor-pointer font-bold text-slate-300 text-xs"
                                  >
                                    <Upload size={14} /><span>{uploadingMedia ? 'Uploading...' : `Upload New ${displayMode.toUpperCase()}`}</span>
                                  </button>
                                </div>
                              </div>
                            )}

                            <div className="pt-2 border-t border-teal-500/15 flex items-center justify-between">
                              <span className="text-[11px] text-slate-400">
                                Mode: <strong className="text-teal-300 uppercase">{displayMode}</strong>. Live preview updates immediately.
                              </span>
                              <button
                                type="button"
                                onClick={handleSaveElementToDatabase}
                                disabled={elementSaving || !isFullyAvailable}
                                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:brightness-110 text-slate-950 font-extrabold transition-all text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                              >
                                {elementSaving ? <><RefreshCw size={13} className="animate-spin" /><span>Saving...</span></> : <><Save size={13} /><span>Save Showcase Visual</span></>}
                              </button>
                            </div>
                          </div>
                        );
                      })() : (
                        <div className="text-center py-6 text-slate-500">
                          <BarChart2 size={24} className="mx-auto mb-2 text-slate-600" />
                          <p>Select a section with chart or showcase data to edit.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* BUTTON / LINK TAB */}
                  {activeBottomTab === 'button' && (
                    <div className="max-w-4xl mx-auto space-y-4 text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <ArrowRight size={14} className="text-teal-400" />
                        <h4 className="font-bold text-teal-300">Button &amp; Link Editor</h4>
                      </div>
                      {selectedSection ? (() => {
                        let btnData: { buttonText?: string; buttonUrl?: string; buttonTarget?: string; buttonStyle?: string; buttonText2?: string; buttonUrl2?: string } = {};
                        try { btnData = JSON.parse(selectedSection.content || '{}'); } catch { }

                        const updateBtn = (patch: object) => handleSectionFieldChange('content', JSON.stringify({ ...btnData, ...patch }));

                        return (
                          <div className="space-y-4">
                            <div className="p-3 rounded-xl bg-black/30 border border-teal-500/20 space-y-3">
                              <p className="text-[11px] font-bold text-teal-300 uppercase tracking-wide">Primary Button</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Button Text</label>
                                  <input type="text" value={btnData.buttonText || ''} onChange={e => updateBtn({ buttonText: e.target.value })} className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-teal-500/25 text-white text-xs focus:outline-none focus:border-teal-400" placeholder="e.g. Get Started" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Button URL</label>
                                  <input type="text" value={btnData.buttonUrl || ''} onChange={e => updateBtn({ buttonUrl: e.target.value })} className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-teal-500/25 text-white text-xs focus:outline-none focus:border-teal-400" placeholder="/contact or https://..." />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Open In</label>
                                  <select value={btnData.buttonTarget || '_self'} onChange={e => updateBtn({ buttonTarget: e.target.value })} className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-teal-500/25 text-teal-300 text-xs focus:outline-none">
                                    <option value="_self">Same Tab</option>
                                    <option value="_blank">New Tab</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Button Style</label>
                                  <select value={btnData.buttonStyle || 'primary'} onChange={e => updateBtn({ buttonStyle: e.target.value })} className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-teal-500/25 text-teal-300 text-xs focus:outline-none">
                                    <option value="primary">Primary (Teal)</option>
                                    <option value="secondary">Secondary (Outline)</option>
                                    <option value="ghost">Ghost</option>
                                    <option value="danger">Danger (Rose)</option>
                                    <option value="link">Plain Link</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            <div className="p-3 rounded-xl bg-black/30 border border-teal-500/20 space-y-3">
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Secondary Button (optional)</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Button Text</label>
                                  <input type="text" value={btnData.buttonText2 || ''} onChange={e => updateBtn({ buttonText2: e.target.value })} className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-teal-500/25 text-white text-xs focus:outline-none focus:border-teal-400" placeholder="e.g. Learn More" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Button URL</label>
                                  <input type="text" value={btnData.buttonUrl2 || ''} onChange={e => updateBtn({ buttonUrl2: e.target.value })} className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-teal-500/25 text-white text-xs focus:outline-none focus:border-teal-400" placeholder="/about or https://..." />
                                </div>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-teal-500/15">
                              <button type="button" onClick={handleSaveElementToDatabase} disabled={elementSaving || !isFullyAvailable} className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:brightness-110 text-slate-950 font-extrabold transition-all text-xs flex items-center gap-1.5 shadow-md cursor-pointer">
                                {elementSaving ? <><RefreshCw size={13} className="animate-spin" /><span>Saving...</span></> : <><Save size={13} /><span>Save Button Config</span></>}
                              </button>
                            </div>
                          </div>
                        );
                      })() : (
                        <div className="text-center py-6 text-slate-500">
                          <ArrowRight size={24} className="mx-auto mb-2 text-slate-600" />
                          <p>Select a section to configure its buttons and links.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* DESIGN TAB */}
                  {activeBottomTab === 'design' && (
                    <div className="max-w-4xl mx-auto space-y-4 text-xs">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Font Size</label>
                          <input type="text" value={elementStyles.fontSize} onChange={e => handleStyleChange('fontSize', e.target.value)} className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-teal-500/25 text-white text-xs focus:outline-none focus:border-teal-400" placeholder="16px" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Font Weight</label>
                          <select value={elementStyles.fontWeight} onChange={e => handleStyleChange('fontWeight', e.target.value)} className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-teal-500/25 text-teal-300 text-xs focus:outline-none">
                            <option value="normal">Normal</option>
                            <option value="semibold">Semi Bold</option>
                            <option value="bold">Bold</option>
                            <option value="extrabold">Extra Bold</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Text Color</label>
                          <div className="flex gap-2">
                            <input type="color" value={elementStyles.color} onChange={e => handleStyleChange('color', e.target.value)} className="w-10 h-9 rounded-lg border border-teal-500/25 bg-black/50 cursor-pointer" />
                            <input type="text" value={elementStyles.color} onChange={e => handleStyleChange('color', e.target.value)} className="flex-1 px-2 py-1.5 rounded-xl bg-black/50 border border-teal-500/25 text-white text-xs focus:outline-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Text Align</label>
                          <div className="flex gap-1">
                            {(['left', 'center', 'right'] as const).map(align => (
                              <button key={align} type="button" onClick={() => handleStyleChange('textAlign', align)} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${elementStyles.textAlign === align ? 'bg-teal-500 text-slate-950' : 'bg-black/50 text-slate-400 border border-teal-500/20'}`}>
                                {align === 'left' ? '≡' : align === 'center' ? '≡' : '≡'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LAYOUT TAB */}
                  {activeBottomTab === 'layout' && (
                    <div className="max-w-4xl mx-auto space-y-4 text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <SlidersHorizontal size={14} className="text-teal-400" />
                        <h4 className="font-bold text-teal-300">Layout &amp; Spacing</h4>
                      </div>
                      {selectedSection ? (() => {
                        let layoutData: { paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderRadius?: string; objectFit?: string; marginTop?: string; marginBottom?: string } = {};
                        try { const c = JSON.parse(selectedSection.content || '{}'); layoutData = c._layout || {}; } catch { }

                        const updateLayout = (patch: object) => {
                          let parsed: any = {};
                          try { parsed = JSON.parse(selectedSection.content || '{}'); } catch { }
                          handleSectionFieldChange('content', JSON.stringify({ ...parsed, _layout: { ...layoutData, ...patch } }));
                        };

                        return (
                          <div className="space-y-4">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Padding</p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {(['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'] as const).map(k => (
                                  <div key={k}>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">{k.replace('padding', '')}</label>
                                    <input type="text" value={(layoutData as any)[k] || ''} onChange={e => updateLayout({ [k]: e.target.value })} placeholder="0px" className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-teal-500/25 text-white text-xs focus:outline-none focus:border-teal-400" />
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Margin</p>
                              <div className="grid grid-cols-2 gap-3">
                                {(['marginTop', 'marginBottom'] as const).map(k => (
                                  <div key={k}>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">{k.replace('margin', '')}</label>
                                    <input type="text" value={(layoutData as any)[k] || ''} onChange={e => updateLayout({ [k]: e.target.value })} placeholder="0px" className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-teal-500/25 text-white text-xs focus:outline-none focus:border-teal-400" />
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Border Radius</label>
                                <input type="text" value={layoutData.borderRadius || ''} onChange={e => updateLayout({ borderRadius: e.target.value })} placeholder="12px" className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-teal-500/25 text-white text-xs focus:outline-none focus:border-teal-400" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Image Object-Fit</label>
                                <select value={layoutData.objectFit || 'cover'} onChange={e => updateLayout({ objectFit: e.target.value })} className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-teal-500/25 text-teal-300 text-xs focus:outline-none">
                                  <option value="cover">Cover</option>
                                  <option value="contain">Contain</option>
                                  <option value="fill">Fill</option>
                                  <option value="none">None</option>
                                </select>
                              </div>
                            </div>
                            <div className="pt-2 border-t border-teal-500/15">
                              <button type="button" onClick={handleSaveElementToDatabase} disabled={elementSaving || !isFullyAvailable} className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:brightness-110 text-slate-950 font-extrabold transition-all text-xs flex items-center gap-1.5 shadow-md cursor-pointer">
                                {elementSaving ? <><RefreshCw size={13} className="animate-spin" /><span>Saving...</span></> : <><Save size={13} /><span>Save Layout</span></>}
                              </button>
                            </div>
                          </div>
                        );
                      })() : (
                        <div className="text-center py-6 text-slate-500">
                          <SlidersHorizontal size={24} className="mx-auto mb-2 text-slate-600" />
                          <p>Select a section to adjust its layout and spacing.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ANIMATION TAB */}
                  {activeBottomTab === 'animation' && (
                    <div className="max-w-4xl mx-auto space-y-4 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Sliders size={14} className="text-teal-400" />
                          <h4 className="font-bold text-teal-300">
                            {selectedElement?.elementType === 'metric'
                              ? 'Interactive Floating Metric & Equalizer Pulse'
                              : 'Animation & Entrance Effects'}
                          </h4>
                        </div>
                        {selectedElement?.elementType === 'metric' && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                            Editing: {selectedElement.label}
                          </span>
                        )}
                      </div>

                      {/* If a metric element is selected, provide dedicated Equalizer Pulse Bar & Float controls */}
                      {selectedElement?.elementType === 'metric' ? (() => {
                        const metricVal = (typeof selectedElement.currentValue === 'object' && selectedElement.currentValue !== null)
                          ? selectedElement.currentValue
                          : { label: 'Operational quality', value: '99.8%', icon: 'trending-up', barCount: 7, barHeights: [35, 57, 42, 72, 56, 92, 100], animationSpeed: '1.3s', barColor: '#63f2e8', barColorEnd: '#218f98', showBars: true };

                        const updateMetricField = (field: string, val: any) => {
                          handleElementValueChange({ ...metricVal, [field]: val });
                        };

                        const BAR_PRESETS = [
                          { label: 'Ascending Staircase', heights: [25, 40, 55, 70, 80, 92, 100] },
                          { label: 'Wave Peak', heights: [35, 60, 90, 100, 85, 55, 30] },
                          { label: 'Dynamic Equalizer', heights: [35, 57, 42, 72, 56, 92, 100] },
                          { label: 'High Benchmark', heights: [70, 85, 75, 95, 88, 98, 100] },
                        ];

                        return (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Pulse & Motion Speed */}
                              <div className="p-3.5 rounded-xl bg-black/40 border border-teal-500/20 space-y-3">
                                <p className="text-[11px] font-bold text-teal-300 uppercase tracking-wide flex items-center gap-1.5">
                                  <span>Pulse &amp; Bar Animation</span>
                                </p>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Pulse Cycle Speed</label>
                                  <select
                                    value={metricVal.animationSpeed || '1.3s'}
                                    onChange={e => updateMetricField('animationSpeed', e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-teal-500/25 text-teal-300 text-xs focus:outline-none"
                                  >
                                    <option value="0.7s">⚡ High Frequency (0.7s - rapid beat)</option>
                                    <option value="1.0s">📈 Fast Active (1.0s)</option>
                                    <option value="1.3s">✨ Balanced Smooth (1.3s - standard)</option>
                                    <option value="1.8s">🌊 Gentle Wave (1.8s)</option>
                                    <option value="2.5s">💤 Relaxed Low (2.5s)</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Number of Pulse Bars</label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="range"
                                      min={3}
                                      max={12}
                                      value={metricVal.barCount || 7}
                                      onChange={e => {
                                        const count = parseInt(e.target.value, 10);
                                        const currentH = metricVal.barHeights || [35, 57, 42, 72, 56, 92, 100];
                                        const newH = Array.from({ length: count }).map((_, idx) => currentH[idx] ?? Math.round(30 + Math.random() * 70));
                                        handleElementValueChange({ ...metricVal, barCount: count, barHeights: newH });
                                      }}
                                      className="flex-1 accent-teal-400 cursor-pointer"
                                    />
                                    <span className="text-xs font-mono font-bold text-teal-300 w-8 text-right">
                                      {metricVal.barCount || 7}
                                    </span>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Preset Curve</label>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    {BAR_PRESETS.map(preset => (
                                      <button
                                        key={preset.label}
                                        type="button"
                                        onClick={() => {
                                          handleElementValueChange({
                                            ...metricVal,
                                            barCount: preset.heights.length,
                                            barHeights: preset.heights,
                                          });
                                        }}
                                        className="px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-teal-500/20 border border-teal-500/20 text-slate-300 hover:text-teal-300 text-[11px] font-medium text-left truncate transition-all cursor-pointer"
                                      >
                                        {preset.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Live Bar Preview & Color Gradients */}
                              <div className="p-3.5 rounded-xl bg-black/40 border border-teal-500/20 space-y-3">
                                <p className="text-[11px] font-bold text-teal-300 uppercase tracking-wide">
                                  Live Equalizer Bar Preview
                                </p>

                                <div className="h-16 flex items-end justify-center gap-1.5 p-2 rounded-xl bg-black/70 border border-teal-500/15">
                                  {Array.from({ length: metricVal.barCount || 7 }).map((_, idx) => {
                                    const h = (metricVal.barHeights && metricVal.barHeights[idx] !== undefined)
                                      ? metricVal.barHeights[idx]
                                      : [35, 57, 42, 72, 56, 92, 100][idx] || 50;
                                    return (
                                      <div
                                        key={idx}
                                        className="w-2.5 rounded-t transition-all duration-300 animate-pulse"
                                        style={{
                                          height: `${h}%`,
                                          background: `linear-gradient(${metricVal.barColor || '#63f2e8'}, ${metricVal.barColorEnd || '#218f98'})`,
                                          animationDuration: metricVal.animationSpeed || '1.3s',
                                          animationDelay: `${idx * 0.1}s`,
                                        }}
                                        title={`Bar ${idx + 1}: ${h}%`}
                                      />
                                    );
                                  })}
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Glow Top</label>
                                    <div className="flex items-center gap-1.5">
                                      <input
                                        type="color"
                                        value={metricVal.barColor || '#63f2e8'}
                                        onChange={e => updateMetricField('barColor', e.target.value)}
                                        className="w-8 h-7 rounded border border-teal-500/25 bg-black cursor-pointer"
                                      />
                                      <input
                                        type="text"
                                        value={metricVal.barColor || '#63f2e8'}
                                        onChange={e => updateMetricField('barColor', e.target.value)}
                                        className="flex-1 px-2 py-1 rounded bg-black/60 border border-teal-500/20 text-xs font-mono text-teal-300"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Gradient Base</label>
                                    <div className="flex items-center gap-1.5">
                                      <input
                                        type="color"
                                        value={metricVal.barColorEnd || '#218f98'}
                                        onChange={e => updateMetricField('barColorEnd', e.target.value)}
                                        className="w-8 h-7 rounded border border-teal-500/25 bg-black cursor-pointer"
                                      />
                                      <input
                                        type="text"
                                        value={metricVal.barColorEnd || '#218f98'}
                                        onChange={e => updateMetricField('barColorEnd', e.target.value)}
                                        className="flex-1 px-2 py-1 rounded bg-black/60 border border-teal-500/20 text-xs font-mono text-teal-300"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-teal-500/15 flex items-center justify-between">
                              <span className="text-[11px] text-slate-400">
                                Live changes are visible immediately in the center preview.
                              </span>
                              <button
                                type="button"
                                onClick={handleSaveElementToDatabase}
                                disabled={elementSaving || !isFullyAvailable}
                                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:brightness-110 text-slate-950 font-extrabold transition-all text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                              >
                                {elementSaving ? <><RefreshCw size={13} className="animate-spin" /><span>Saving...</span></> : <><Save size={13} /><span>Save Metric Animation</span></>}
                              </button>
                            </div>
                          </div>
                        );
                      })() : selectedSection ? (() => {
                        let animData: { animationClass?: string; duration?: string; delay?: string; easing?: string } = {};
                        try { const c = JSON.parse(selectedSection.content || '{}'); animData = c._animation || {}; } catch { }

                        const updateAnim = (patch: object) => {
                          let parsed: any = {};
                          try { parsed = JSON.parse(selectedSection.content || '{}'); } catch { }
                          handleSectionFieldChange('content', JSON.stringify({ ...parsed, _animation: { ...animData, ...patch } }));
                        };

                        const ANIMATIONS = [
                          { value: '', label: 'None' },
                          { value: 'animate-fade-in', label: 'Fade In' },
                          { value: 'animate-slide-up', label: 'Slide Up' },
                          { value: 'animate-slide-down', label: 'Slide Down' },
                          { value: 'animate-slide-left', label: 'Slide from Left' },
                          { value: 'animate-slide-right', label: 'Slide from Right' },
                          { value: 'animate-zoom-in', label: 'Zoom In' },
                          { value: 'animate-bounce', label: 'Bounce' },
                          { value: 'animate-pulse', label: 'Pulse' },
                        ];

                        return (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Entrance Animation</label>
                                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                  {ANIMATIONS.map(a => (
                                    <button
                                      key={a.value}
                                      type="button"
                                      onClick={() => updateAnim({ animationClass: a.value })}
                                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${animData.animationClass === a.value ? 'bg-teal-500/20 border-teal-500/40 text-teal-300' : 'bg-black/30 border-teal-500/15 text-slate-400 hover:text-white hover:border-teal-500/30'}`}
                                    >
                                      {a.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Duration</label>
                                  <select value={animData.duration || '0.5s'} onChange={e => updateAnim({ duration: e.target.value })} className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-teal-500/25 text-teal-300 text-xs focus:outline-none">
                                    <option value="0.3s">Fast (0.3s)</option>
                                    <option value="0.5s">Normal (0.5s)</option>
                                    <option value="0.8s">Slow (0.8s)</option>
                                    <option value="1.2s">Very Slow (1.2s)</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Delay</label>
                                  <select value={animData.delay || '0s'} onChange={e => updateAnim({ delay: e.target.value })} className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-teal-500/25 text-teal-300 text-xs focus:outline-none">
                                    <option value="0s">No Delay</option>
                                    <option value="0.1s">0.1s</option>
                                    <option value="0.2s">0.2s</option>
                                    <option value="0.3s">0.3s</option>
                                    <option value="0.5s">0.5s</option>
                                    <option value="1s">1s</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Easing</label>
                                  <select value={animData.easing || 'ease-out'} onChange={e => updateAnim({ easing: e.target.value })} className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-teal-500/25 text-teal-300 text-xs focus:outline-none">
                                    <option value="ease">Ease</option>
                                    <option value="ease-in">Ease In</option>
                                    <option value="ease-out">Ease Out</option>
                                    <option value="ease-in-out">Ease In-Out</option>
                                    <option value="linear">Linear</option>
                                  </select>
                                </div>
                                {animData.animationClass && (
                                  <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
                                    <p className="text-[10px] font-bold text-teal-300 uppercase mb-1">Preview Class</p>
                                    <code className="text-[11px] font-mono text-teal-400">{animData.animationClass}</code>
                                    <p className="text-[10px] text-slate-500 mt-1">duration: {animData.duration || '0.5s'} · delay: {animData.delay || '0s'} · {animData.easing || 'ease-out'}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="pt-2 border-t border-teal-500/15">
                              <button type="button" onClick={handleSaveElementToDatabase} disabled={elementSaving || !isFullyAvailable} className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:brightness-110 text-slate-950 font-extrabold transition-all text-xs flex items-center gap-1.5 shadow-md cursor-pointer">
                                {elementSaving ? <><RefreshCw size={13} className="animate-spin" /><span>Saving...</span></> : <><Save size={13} /><span>Save Animation</span></>}
                              </button>
                            </div>
                          </div>
                        );
                      })() : (
                        <div className="text-center py-6 text-slate-500">
                          <Sliders size={24} className="mx-auto mb-2 text-slate-600" />
                          <p>Select a section to configure animations.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* HISTORY TAB */}
                  {activeBottomTab === 'history' && (
                    <div className="max-w-4xl mx-auto space-y-3 text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-teal-300 flex items-center gap-2"><History size={14} /> Content Revisions</h4>
                        {selectedSection && (
                          <button type="button" onClick={() => fetchSectionRevisions(selectedSection.id)} className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                            <RefreshCw size={11} className={loadingRevisions ? 'animate-spin' : ''} /> Refresh
                          </button>
                        )}
                      </div>
                      {loadingRevisions ? (
                        <div className="flex items-center gap-2 text-slate-400 py-4"><RefreshCw size={14} className="animate-spin" /> Loading revisions...</div>
                      ) : sectionRevisions.length === 0 ? (
                        <div className="text-center py-6 text-slate-500">
                          <History size={24} className="mx-auto mb-2 text-slate-600" />
                          <p>No revisions yet. Save changes to create revision history.</p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {sectionRevisions.map((rev: any, i: number) => (
                            <div key={rev.id} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-black/40 border border-teal-500/15 hover:border-teal-500/30 transition-colors">
                              <div>
                                <p className="text-[11px] font-semibold text-slate-200">Rev {sectionRevisions.length - i}: {rev.changeType || 'edit'}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{rev.changeNotes || '—'}</p>
                                <p className="text-[10px] text-slate-600 font-mono mt-0.5">{rev.createdAt ? new Date(rev.createdAt).toLocaleString() : '—'}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => selectedSection && handleRestoreRevision(selectedSection.id, rev.id)}
                                className="px-2.5 py-1 rounded-lg bg-teal-500/15 text-teal-300 border border-teal-500/25 hover:bg-teal-500/25 text-[11px] font-bold shrink-0 transition-all"
                              >
                                Restore
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ADVANCED TAB */}
                  {activeBottomTab === 'advanced' && (
                    <div className="max-w-4xl mx-auto space-y-3 text-xs">
                      <h4 className="font-bold text-teal-300 flex items-center gap-2"><Code size={14} /> Raw Section Content</h4>
                      {selectedSection ? (
                        <>
                          <textarea
                            rows={8}
                            value={selectedSection.content || ''}
                            onChange={e => handleSectionFieldChange('content', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-black/60 border border-teal-500/25 text-teal-300 text-xs font-mono leading-relaxed focus:outline-none focus:border-teal-400"
                            placeholder="JSON content..."
                            spellCheck={false}
                          />
                          <button type="button" onClick={handleSaveElementToDatabase} disabled={elementSaving || !isFullyAvailable} className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer">
                            <Save size={13} /> Save Raw Content
                          </button>
                        </>
                      ) : (
                        <p className="text-slate-500">Select a section to view its raw content.</p>
                      )}
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Section Modal */}
      <AddSectionModal
        isOpen={isAddSectionModalOpen}
        onClose={() => setIsAddSectionModalOpen(false)}
        onAddSection={(template) => { setIsAddSectionModalOpen(false); handleAddNewSection(template); }}
      />

      {/* Media Selector Modal */}
      <MediaSelectorModal
        isOpen={isMediaSelectorOpen}
        onClose={() => setIsMediaSelectorOpen(false)}
        onSelect={(asset) => {
          if (selectedElement && (selectedElement.elementType === 'image' || selectedElement.elementType === 'video')) {
            handleElementValueChange(asset.url || asset.storageLocation);
          } else {
            handleSectionFieldChange('backgroundImage', asset.url || asset.storageLocation);
          }
          setIsMediaSelectorOpen(false);
        }}
      />
    </AdminLayout>
  );
}
