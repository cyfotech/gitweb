import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PageSectionData } from '../hooks/usePageContent';

export type ElementType =
  | 'heading'
  | 'subheading'
  | 'paragraph'
  | 'button'
  | 'image'
  | 'gif'
  | 'video'
  | 'card'
  | 'chart'
  | 'metric'
  | 'badge'
  | 'link'
  | 'text'
  | 'section';

export interface MetricConfig {
  label: string;
  value: string;
  icon?: string; // 'trending-up' | 'shield' | 'award' | 'activity' | 'clock' | 'check'
  barCount?: number; // default: 7
  barHeights?: number[]; // percentage heights e.g. [35, 57, 42, 72, 56, 92, 100]
  animationSpeed?: string; // e.g. '1.3s', '0.8s', '2s'
  barColor?: string; // gradient top color e.g. '#63f2e8'
  barColorEnd?: string; // gradient bottom color e.g. '#218f98'
  showBars?: boolean; // toggle equalizer pulse bars
}

export interface ChartDataPoint {
  label: string;
  value: number;
  [key: string]: any;
}

export type ChartType =
  | 'bar'
  | 'horizontal_bar'
  | 'line'
  | 'area'
  | 'pie'
  | 'donut'
  | 'radar'
  | 'scatter'
  | 'stacked_bar'
  | 'mixed';

export interface ChartAnimationSettings {
  enabled: boolean;
  duration: number; // in ms
  delay: number; // in ms
  easing: 'ease' | 'linear' | 'ease-in-out' | 'cubic-bezier';
}

export interface ChartConfig {
  title?: string;
  subtitle?: string;
  chartType?: ChartType;
  xAxisLabel?: string;
  yAxisLabel?: string;
  unit?: string;
  seriesName?: string;
  dataPoints: ChartDataPoint[];
  animation?: ChartAnimationSettings;
}

export interface SelectedElementInfo {
  sectionKey: string;
  sectionId?: string;
  elementKey: string;
  elementType: ElementType;
  label: string;
  currentValue?: any;
  chartConfig?: ChartConfig;
  metricConfig?: MetricConfig;
  targetBoundingRect?: DOMRect | null;
}

export interface ElementStyleProps {
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: string;
  backgroundColor?: string;
  borderRadius?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none';
  aspectRatio?: string;
}

export interface VisualEditorDraftState {
  pageId?: string;
  pageSlug?: string;
  sections: PageSectionData[];
  selectedSectionId?: string | null;
  selectedSectionKey?: string | null;
  selectedElement?: SelectedElementInfo | null;
  isEditorActive: boolean;
  activeDevice: 'desktop' | 'laptop' | 'tablet' | 'mobile';
  zoomLevel: number;
  fitMode: 'fit' | 'actual';
  hasUnsavedChanges: boolean;
}

interface VisualEditorContextType {
  draftState: VisualEditorDraftState;
  setDraftSections: (sections: PageSectionData[]) => void;
  updateSectionDraft: (sectionId: string, partial: Partial<PageSectionData>) => void;
  updateElementDraft: (sectionKey: string, elementKey: string, value: any, extraStyles?: ElementStyleProps) => void;
  selectSection: (sectionId: string | null, sectionKey?: string | null) => void;
  selectElement: (info: SelectedElementInfo | null) => void;
  setDevice: (device: 'desktop' | 'laptop' | 'tablet' | 'mobile') => void;
  setZoom: (zoom: number) => void;
  setFitMode: (mode: 'fit' | 'actual') => void;
  deleteElement: (sectionKey: string, elementKey: string) => void;
  duplicateSection: (sectionKey: string) => void;
  deleteSection: (sectionKey: string) => void;
  setActivePage: (pageId: string, pageSlug: string, initialSections: PageSectionData[]) => void;
  discardDraft: () => void;
  markSaved: () => void;
}

const VisualEditorContext = createContext<VisualEditorContextType | null>(null);

const STORAGE_KEY_PREFIX = 'PTAX_VISUAL_BUILDER_DRAFT_';

export function VisualEditorProvider({ children }: { children: ReactNode }) {
  const [draftState, setDraftState] = useState<VisualEditorDraftState>({
    sections: [],
    selectedSectionId: null,
    selectedSectionKey: null,
    selectedElement: null,
    isEditorActive: false,
    activeDevice: 'desktop',
    zoomLevel: 1,
    fitMode: 'fit',
    hasUnsavedChanges: false,
  });

  const [initialSectionsSnapshot, setInitialSectionsSnapshot] = useState<PageSectionData[]>([]);

  // Set active page for editing
  const setActivePage = (pageId: string, pageSlug: string, initialSections: PageSectionData[]) => {
    // ALWAYS seed from the live server data. localStorage drafts shadow the published
    // DB rows, which made the admin preview diverge from the public site ("show live data").
    const loadedSections = initialSections;
    const hasDraft = false;

    setInitialSectionsSnapshot(initialSections);
    const firstSection = loadedSections[0];
    setDraftState({
      pageId,
      pageSlug,
      sections: loadedSections,
      selectedSectionId: firstSection?.id || null,
      selectedSectionKey: firstSection?.sectionKey || null,
      selectedElement: firstSection
        ? {
          sectionKey: firstSection.sectionKey,
          sectionId: firstSection.id,
          elementKey: 'title',
          elementType: 'heading',
          label: 'Main Headline',
          currentValue: firstSection.title,
        }
        : null,
      isEditorActive: true,
      activeDevice: 'desktop',
      zoomLevel: 1,
      fitMode: 'fit',
      hasUnsavedChanges: hasDraft,
    });
  };

  const setDraftSections = (sections: PageSectionData[]) => {
    setDraftState((prev) => {
      if (prev.pageSlug) {
        try {
          localStorage.setItem(`${STORAGE_KEY_PREFIX}${prev.pageSlug}`, JSON.stringify(sections));
        } catch { }
      }
      return {
        ...prev,
        sections,
        hasUnsavedChanges: true,
      };
    });
  };

  const updateSectionDraft = (sectionId: string, partial: Partial<PageSectionData>) => {
    setDraftState((prev) => {
      const updated = prev.sections.map((sec) => (sec.id === sectionId ? { ...sec, ...partial } : sec));
      if (prev.pageSlug) {
        try {
          localStorage.setItem(`${STORAGE_KEY_PREFIX}${prev.pageSlug}`, JSON.stringify(updated));
        } catch { }
      }
      return {
        ...prev,
        sections: updated,
        hasUnsavedChanges: true,
      };
    });
  };

  const updateElementDraft = (sectionKey: string, elementKey: string, value: any, extraStyles?: ElementStyleProps) => {
    setDraftState((prev) => {
      const targetSec = prev.sections.find((s) => s.sectionKey === sectionKey);
      if (!targetSec) return prev;

      let partial: Partial<PageSectionData> = {};
      let parsedContent: Record<string, any> = {};
      try {
        if (targetSec.content) parsedContent = JSON.parse(targetSec.content);
      } catch { }

      if (extraStyles) {
        parsedContent[`_style_${elementKey}`] = {
          ...(parsedContent[`_style_${elementKey}`] || {}),
          ...extraStyles,
        };
      }

      if (elementKey === 'title') {
        partial.title = value;
      } else if (elementKey === 'subheading') {
        partial.subheading = value;
      } else if (elementKey === 'description') {
        partial.description = value;
      } else if (elementKey === 'backgroundImage') {
        partial.backgroundImage = value;
      } else if (elementKey === 'backgroundVideo') {
        partial.backgroundVideo = value;
      } else if (elementKey.startsWith('item_') && (elementKey.endsWith('_q') || elementKey.endsWith('_a'))) {
        // Nested FAQ array element: item_{idx}_{q|a}
        const parts = elementKey.split('_');
        const itemIdx = parseInt(parts[1], 10);
        const field = parts[2];
        if (!Array.isArray(parsedContent.items)) {
          parsedContent.items = [];
        }
        if (!parsedContent.items[itemIdx]) {
          parsedContent.items[itemIdx] = { q: '', a: '' };
        }
        parsedContent.items[itemIdx][field] = value;
      } else if (elementKey.startsWith('review_')) {
        // Nested Review array element: review_{idx}_{name|role|text}
        const parts = elementKey.split('_');
        const itemIdx = parseInt(parts[1], 10);
        const field = parts[2];
        if (!Array.isArray(parsedContent.reviews)) {
          parsedContent.reviews = [];
        }
        if (!parsedContent.reviews[itemIdx]) {
          parsedContent.reviews[itemIdx] = { name: '', role: '', text: '', rating: 5 };
        }
        parsedContent.reviews[itemIdx][field] = value;
      } else if (elementKey.startsWith('chart_') || elementKey === 'chartConfig' || typeof value === 'object' && value?.dataPoints) {
        // Structured Chart or Graph Configuration
        parsedContent[elementKey] = value;
      } else {
        parsedContent[elementKey] = value;
      }

      partial.content = JSON.stringify(parsedContent);

      const updated = prev.sections.map((sec) =>
        sec.sectionKey === sectionKey ? { ...sec, ...partial } : sec
      );

      if (prev.pageSlug) {
        try {
          localStorage.setItem(`${STORAGE_KEY_PREFIX}${prev.pageSlug}`, JSON.stringify(updated));
        } catch { }
      }

      // Also update selectedElement value and infer / update elementType if changed
      let newElementType = prev.selectedElement?.elementType;
      if (typeof value === 'object' && value !== null && value.displayMode) {
        newElementType = value.displayMode as ElementType;
      }

      const updatedSelectedElement = prev.selectedElement
        ? {
          ...prev.selectedElement,
          currentValue: value,
          ...(newElementType ? { elementType: newElementType } : {}),
          ...(typeof value === 'object' && value?.dataPoints ? { chartConfig: value } : {}),
        }
        : null;

      return {
        ...prev,
        sections: updated,
        selectedElement: updatedSelectedElement,
        hasUnsavedChanges: true,
      };
    });
  };

  const deleteElement = (sectionKey: string, elementKey: string) => {
    updateElementDraft(sectionKey, elementKey, '');
  };

  const duplicateSection = (sectionKey: string) => {
    setDraftState((prev) => {
      const index = prev.sections.findIndex((s) => s.sectionKey === sectionKey);
      if (index === -1) return prev;
      const original = prev.sections[index];
      const cloneKey = `${original.sectionKey}_copy_${Date.now().toString(36).slice(-4)}`;
      const duplicated: PageSectionData = {
        ...original,
        id: `sec_${Date.now()}`,
        sectionKey: cloneKey,
        title: original.title ? `${original.title} (Copy)` : 'Copy Section',
        displayOrder: index + 1,
      };

      const newSections = [...prev.sections];
      newSections.splice(index + 1, 0, duplicated);
      const renumbered = newSections.map((s, idx) => ({ ...s, displayOrder: idx }));

      if (prev.pageSlug) {
        try {
          localStorage.setItem(`${STORAGE_KEY_PREFIX}${prev.pageSlug}`, JSON.stringify(renumbered));
        } catch { }
      }

      return {
        ...prev,
        sections: renumbered,
        selectedSectionId: duplicated.id,
        selectedSectionKey: duplicated.sectionKey,
        hasUnsavedChanges: true,
      };
    });
  };

  const deleteSection = (sectionKey: string) => {
    setDraftState((prev) => {
      const filtered = prev.sections.filter((s) => s.sectionKey !== sectionKey);
      const renumbered = filtered.map((s, idx) => ({ ...s, displayOrder: idx }));
      if (prev.pageSlug) {
        try {
          localStorage.setItem(`${STORAGE_KEY_PREFIX}${prev.pageSlug}`, JSON.stringify(renumbered));
        } catch { }
      }
      return {
        ...prev,
        sections: renumbered,
        selectedSectionId: renumbered[0]?.id || null,
        selectedSectionKey: renumbered[0]?.sectionKey || null,
        selectedElement: null,
        hasUnsavedChanges: true,
      };
    });
  };

  const selectSection = (sectionId: string | null, sectionKey?: string | null) => {
    setDraftState((prev) => {
      const found = sectionId
        ? prev.sections.find((s) => s.id === sectionId)
        : sectionKey
          ? prev.sections.find((s) => s.sectionKey === sectionKey)
          : null;

      return {
        ...prev,
        selectedSectionId: found ? found.id : null,
        selectedSectionKey: found ? found.sectionKey : null,
        selectedElement: found
          ? {
            sectionKey: found.sectionKey,
            sectionId: found.id,
            elementKey: 'title',
            elementType: 'heading',
            label: 'Section Headline',
            currentValue: found.title,
          }
          : null,
      };
    });
  };

  const selectElement = (info: SelectedElementInfo | null) => {
    setDraftState((prev) => {
      let matchingSection = prev.sections.find((s) => s.sectionKey === info?.sectionKey);
      return {
        ...prev,
        selectedSectionKey: info?.sectionKey || prev.selectedSectionKey,
        selectedSectionId: matchingSection?.id || prev.selectedSectionId,
        selectedElement: info,
      };
    });
  };

  const setDevice = (device: 'desktop' | 'laptop' | 'tablet' | 'mobile') => {
    setDraftState((prev) => ({ ...prev, activeDevice: device }));
  };

  const setZoom = (zoom: number) => {
    setDraftState((prev) => ({ ...prev, zoomLevel: Math.max(0.4, Math.min(zoom, 1.6)) }));
  };

  const setFitMode = (mode: 'fit' | 'actual') => {
    setDraftState((prev) => ({
      ...prev,
      fitMode: mode,
      zoomLevel: mode === 'fit' ? 1 : 1,
    }));
  };

  const discardDraft = () => {
    if (draftState.pageSlug) {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${draftState.pageSlug}`);
    }
    setDraftState((prev) => ({
      ...prev,
      sections: initialSectionsSnapshot,
      hasUnsavedChanges: false,
    }));
  };

  const markSaved = () => {
    if (draftState.pageSlug) {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${draftState.pageSlug}`);
    }
    setInitialSectionsSnapshot(draftState.sections);
    setDraftState((prev) => ({
      ...prev,
      hasUnsavedChanges: false,
    }));
  };

  return (
    <VisualEditorContext.Provider
      value={{
        draftState,
        setDraftSections,
        updateSectionDraft,
        updateElementDraft,
        selectSection,
        selectElement,
        setDevice,
        setZoom,
        setFitMode,
        deleteElement,
        duplicateSection,
        deleteSection,
        setActivePage,
        discardDraft,
        markSaved,
      }}
    >
      {children}
    </VisualEditorContext.Provider>
  );
}

export function useVisualEditor() {
  const ctx = useContext(VisualEditorContext);
  return ctx;
}
