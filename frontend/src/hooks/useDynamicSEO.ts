import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { seoApi } from '../api/seo';

/**
 * Universal SEO injection hook.
 * Dynamically synchronizes document.title, canonical URL, meta description,
 * robots indexing tags, Open Graph, Twitter Cards, and JSON-LD structured data
 * directly from the database whenever public route changes.
 */
export function useDynamicSEO() {
  const location = useLocation();

  useEffect(() => {
    // Determine page slug from route pathname
    const path = location.pathname.replace(/^\//, '') || 'home';

    // Skip admin routes from public SEO injection
    if (path.startsWith('admin')) return;
    // Article pages set SEO from the resolved article record and slug.
    if (/^blog\/[^/]+$/.test(path)) return;

    let isMounted = true;

    async function applySEO() {
      try {
        const seo: any = await seoApi.getPublicMetadata(path);
        if (!isMounted || !seo) return;

        // 1. Meta Title
        if (seo.metaTitle) {
          document.title = seo.metaTitle;
        }

        // 2. Meta Description
        updateMetaTag('name', 'description', seo.metaDescription);

        // 3. Meta Keywords
        if (seo.metaKeywords) {
          const kwStr = Array.isArray(seo.metaKeywords) ? seo.metaKeywords.join(', ') : String(seo.metaKeywords);
          updateMetaTag('name', 'keywords', kwStr);
        }

        // 4. Robots Meta (Index / Follow)
        const robotsContent = `${seo.robotsIndex !== false ? 'index' : 'noindex'}, ${seo.robotsFollow !== false ? 'follow' : 'nofollow'}`;
        updateMetaTag('name', 'robots', robotsContent);

        // 5. Canonical URL
        if (seo.canonicalUrl) {
          let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
          if (!canonicalEl) {
            canonicalEl = document.createElement('link');
            canonicalEl.setAttribute('rel', 'canonical');
            document.head.appendChild(canonicalEl);
          }
          canonicalEl.setAttribute('href', seo.canonicalUrl);
        }

        // 6. Open Graph Tags
        updateMetaTag('property', 'og:title', seo.ogTitle || seo.metaTitle);
        updateMetaTag('property', 'og:description', seo.ogDescription || seo.metaDescription);
        if (seo.ogImage) {
          updateMetaTag('property', 'og:image', seo.ogImage);
        }
        updateMetaTag('property', 'og:url', seo.canonicalUrl || window.location.href);

        // 7. Twitter Card Tags
        updateMetaTag('name', 'twitter:card', 'summary_large_image');
        updateMetaTag('name', 'twitter:title', seo.twitterTitle || seo.ogTitle || seo.metaTitle);
        updateMetaTag('name', 'twitter:description', seo.twitterDescription || seo.ogDescription || seo.metaDescription);
        if (seo.twitterImage || seo.ogImage) {
          updateMetaTag('name', 'twitter:image', seo.twitterImage || seo.ogImage);
        }

        // 8. JSON-LD Structured Data
        if (seo.structuredData) {
          let scriptEl = document.getElementById('dynamic-jsonld-schema') as HTMLScriptElement;
          if (!scriptEl) {
            scriptEl = document.createElement('script');
            scriptEl.id = 'dynamic-jsonld-schema';
            scriptEl.type = 'application/ld+json';
            document.head.appendChild(scriptEl);
          }
          scriptEl.textContent = typeof seo.structuredData === 'string'
            ? seo.structuredData
            : JSON.stringify(seo.structuredData);
        }
      } catch (err) {
        // Fallback to default document title safely
        console.warn('SEO dynamic injection note:', err);
      }
    }

    applySEO();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);
}

function updateMetaTag(attributeName: 'name' | 'property', attributeValue: string, content?: string) {
  if (!content) return;
  let tag = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attributeName, attributeValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}
