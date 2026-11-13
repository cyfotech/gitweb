import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsApi } from '../api/analytics';

/**
 * useAutoTelemetry:
 * 1. Tracks every visible section via IntersectionObserver (50% visibility threshold, once per page view).
 * 2. Tracks every button and link click on the public website with semantic intent categorization.
 */
export function useAutoTelemetry() {
  const location = useLocation();
  const trackedSections = useRef<Set<string>>(new Set());

  // Reset tracked sections upon route change
  useEffect(() => {
    trackedSections.current.clear();
  }, [location.pathname]);

  // Section Observer
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;

    const pageSlug = location.pathname === '/' ? 'home' : location.pathname.replace(/^\//, '');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const sectionKey = el.getAttribute('data-section-key') || el.id || el.getAttribute('aria-label') || el.tagName.toLowerCase();
            const sectionName = el.getAttribute('data-section-name') || el.querySelector('h1, h2, h3')?.textContent?.trim() || sectionKey;

            const dedupeKey = `${pageSlug}::${sectionKey}`;
            if (!trackedSections.current.has(dedupeKey)) {
              trackedSections.current.add(dedupeKey);
              analyticsApi.trackSectionView({
                pageSlug,
                sectionKey,
                sectionName: sectionName.slice(0, 100),
              }).catch(() => {});
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.35, // Trigger when 35% of the section is visible
      }
    );

    // Observe all semantic <section>, <header>, <footer> and containers
    const sections = document.querySelectorAll('section, [data-section-key], header, footer, main > div');
    sections.forEach((sec) => observer.observe(sec));

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);

  // Click Observer: Intercepts buttons and links globally on public pages
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('button, a, [role="button"]') as HTMLElement | null;
      if (!target) return;

      const elementText = target.innerText?.trim() || target.getAttribute('aria-label') || target.getAttribute('title') || 'Click';
      const elementId = target.id || target.getAttribute('data-tracking-id') || elementText.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 50);
      const isLink = target.tagName === 'A';
      const targetUrl = target.getAttribute('href') || undefined;

      // Identify closest section
      const closestSection = target.closest('section, [data-section-key], footer, header');
      const sectionKey = closestSection?.getAttribute('data-section-key') || closestSection?.id || undefined;

      // Categorize Intent
      let intentCategory: 'cta' | 'conversion' | 'navigation' | 'form' | 'general' = 'general';
      const lowerText = elementText.toLowerCase();

      if (lowerText.includes('consultation') || lowerText.includes('book') || lowerText.includes('hire') || lowerText.includes('submit')) {
        intentCategory = 'cta';
      } else if (lowerText.includes('contact') || lowerText.includes('inquiry') || lowerText.includes('get started')) {
        intentCategory = 'conversion';
      } else if (isLink && targetUrl?.startsWith('/')) {
        intentCategory = 'navigation';
      }

      analyticsApi.trackClick({
        elementId,
        elementText: elementText.slice(0, 100),
        elementType: isLink ? 'link' : 'button',
        intentCategory,
        sectionKey,
        pageUrl: location.pathname,
        targetUrl,
      }).catch(() => {});
    };

    document.addEventListener('click', handleClick, { passive: true });
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [location.pathname]);
}

