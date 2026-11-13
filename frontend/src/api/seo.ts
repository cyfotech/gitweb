import apiClient from './client';

export interface SEOData {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string | string[];
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  jsonLd: string;
  sitemapPriority?: string;
  sitemapChange?: string;
}

export const seoApi = {
  getByPageId: (pageId: string) => apiClient.get<SEOData>(`/seo/${pageId}`),
  update: (pageId: string, data: Partial<SEOData>) => apiClient.put(`/seo/${pageId}`, data),
  getPublicMetadata: (slug: string) => apiClient.get<SEOData>(`/seo/public/${slug}`),
  getAudit: () => apiClient.get<{ overallScore: number; pagesAudited: number; audits: any[] }>('/seo/audit'),
  getRobotsTxt: () => apiClient.get<{ content: string }>('/seo/robots'),
  updateRobotsTxt: (content: string) => apiClient.put('/seo/robots', { content }),
  generateSitemap: () => apiClient.get('/seo/sitemap/generate'),
};

export default seoApi;
