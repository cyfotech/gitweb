import apiClient from './client';

export const analyticsApi = {
  initSession: () => {
    const existing = sessionStorage.getItem('ptc_session_token');
    if (existing) return Promise.resolve({ sessionToken: existing });
    return apiClient.post('/analytics/session', {}, { skipAuth: true }).then((data: any) => {
      sessionStorage.setItem('ptc_session_token', data.sessionToken);
      return data;
    });
  },

  trackPageView: (url: string, pageSlug?: string, referrer?: string) => {
    const sessionToken = sessionStorage.getItem('ptc_session_token');
    return apiClient.post('/analytics/pageview', { sessionToken, url, pageSlug, referrer }, { skipAuth: true });
  },

  // Track section impressions via IntersectionObserver
  trackSectionView: (data: {
    pageSlug: string;
    sectionKey: string;
    sectionName?: string;
    dwellTimeSeconds?: number;
  }) => {
    return apiClient.post('/analytics/section-view', data, { skipAuth: true });
  },

  // Track all button and link interactions
  trackClick: (data: {
    elementId?: string;
    elementText?: string;
    elementType?: 'button' | 'link' | 'card' | 'cta' | 'nav';
    intentCategory?: 'general' | 'cta' | 'navigation' | 'form' | 'conversion' | 'contact' | 'consultation';
    sectionKey?: string;
    pageUrl: string;
    targetUrl?: string;
    clickType?: string;
  }) => {
    return apiClient.post('/analytics/click', data, { skipAuth: true });
  },

  trackEvent: (eventType: string, data?: Record<string, any>) => {
    const sessionToken = sessionStorage.getItem('ptc_session_token');
    return apiClient.post('/analytics/event', {
      sessionToken,
      eventType,
      pageUrl: window.location.pathname,
      ...data,
    }, { skipAuth: true });
  },

  // Telemetry APIs for Admin Dashboard
  getStats: (days: number | string = 30) => apiClient.get(`/analytics/stats?days=${days}`),
  getClickReport: (days: number | string = 30) => apiClient.get(`/analytics/clicks/report?days=${days}`),
  getSections: (pageSlug?: string) => apiClient.get(`/analytics/sections?pageSlug=${pageSlug || 'all'}`),
  getButtons: () => apiClient.get('/analytics/buttons'),
  getBlogs: () => apiClient.get('/analytics/blogs'),
  getFunnel: () => apiClient.get('/analytics/funnel'),
};
