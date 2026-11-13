import { useState, useEffect, useCallback, useMemo } from 'react';
import { pagesApi } from '../api/pages';
import { useVisualEditor } from '../context/VisualEditorContext';
import { subscribeToCmsContentUpdates } from '../utils/cmsContentUpdates';

export interface PageSectionData {
  id: string;
  pageId: string;
  sectionKey: string;
  sectionType: string;
  title: string | null;
  subheading: string | null;
  description: string | null;
  content: string | null;
  backgroundImage: string | null;
  backgroundVideo: string | null;
  imagePosition: string | null;
  imageAltText: string | null;
  isEnabled: boolean;
  displayOrder: number;
  updatedAt?: string;
}

export interface PageData {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  isPublished: boolean;
  sections: PageSectionData[];
  seo?: any;
}

export function usePageContent(slug: string) {
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const visualEditorCtx = useVisualEditor();

  const fetchPage = useCallback(async () => {
    try {
      setLoading(true);
      const res = await pagesApi.getBySlug(slug);
      const pageData = res?.data ?? res;
      if (pageData) {
        setData(pageData);
      }
      setError(null);
    } catch (err: any) {
      console.warn(`[usePageContent] Unable to fetch dynamic data for slug "${slug}", using fallback:`, err.message);
      setError(err.message || 'Failed to load page content');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  useEffect(() => subscribeToCmsContentUpdates(({ slug: updatedSlug }) => {
    if (updatedSlug === slug) void fetchPage();
  }), [fetchPage, slug]);

  // If inside visual editor and active on this page, use the live draft state!
  const effectiveSections: PageSectionData[] = useMemo(() => {
    if (
      visualEditorCtx &&
      visualEditorCtx.draftState.isEditorActive &&
      visualEditorCtx.draftState.pageSlug === slug &&
      visualEditorCtx.draftState.sections.length > 0
    ) {
      return visualEditorCtx.draftState.sections;
    }
    return data?.sections || [];
  }, [visualEditorCtx, slug, data?.sections]);

  // Helper to extract a section by sectionKey with its parsed JSON content
  const getSection = useCallback(
    (key: string): (PageSectionData & { parsedContent?: any; isSelectedInEditor?: boolean }) | null => {
      const found = effectiveSections.find((s) => s.sectionKey === key && s.isEnabled !== false);
      if (!found) return null;

      let parsedContent: any = null;
      if (found.content) {
        try {
          parsedContent = JSON.parse(found.content);
        } catch {
          parsedContent = found.content;
        }
      }

      const isSelected =
        visualEditorCtx?.draftState?.isEditorActive &&
        (visualEditorCtx?.draftState?.selectedSectionId === found.id ||
          visualEditorCtx?.draftState?.selectedSectionKey === key);

      return {
        ...found,
        parsedContent,
        isSelectedInEditor: !!isSelected,
      };
    },
    [effectiveSections, visualEditorCtx]
  );

  const getContentValue = useCallback(
    <T,>(sectionKey: string, fieldKey: string, fallback: T): T => {
      const section = getSection(sectionKey);
      const value = section?.parsedContent?.[fieldKey];
      return value === undefined || value === null || value === '' ? fallback : value as T;
    },
    [getSection]
  );

  const isSectionEnabled = useCallback(
    (sectionKey: string): boolean => {
      const section = effectiveSections.find((item) => item.sectionKey === sectionKey);
      return section ? section.isEnabled !== false : true;
    },
    [effectiveSections]
  );

  return {
    page: data,
    sections: effectiveSections,
    loading,
    error,
    refresh: fetchPage,
    getSection,
    getContentValue,
    isSectionEnabled,
    isDraftLive:
      visualEditorCtx?.draftState.isEditorActive &&
      visualEditorCtx?.draftState.pageSlug === slug,
  };
}
