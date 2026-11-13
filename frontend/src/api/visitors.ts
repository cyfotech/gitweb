import apiClient from './client';

// Cookie helpers
export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function setCookie(name: string, value: string, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const secure = window.location.protocol === 'https:' ? ';Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/;SameSite=Lax${secure}`;
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;`;
}

export interface VisitorIdentity {
  visitorUuid: string;
  visitorId?: string;
  displayName?: string | null;
  email?: string | null;
  identificationStatus: 'anonymous' | 'identified' | 'previously_identified' | 'returning';
  totalVisits?: number;
  firstVisit?: string;
  lastVisit?: string;
}

export const visitorApi = {
  // Identify or initialize visitor
  async identify(pageUrl = window.location.pathname, page = document.title): Promise<VisitorIdentity> {
    const existingUuid = getCookie('ptax_vid');
    const response: any = await apiClient.post('/visitors/identify', {
      visitorUuid: existingUuid,
      pageUrl,
      page,
    });

    if (response?.visitorUuid) {
      setCookie('ptax_vid', response.visitorUuid, 365);
    }
    return response;
  },

  // Record an activity log
  async trackActivity(activity: {
    activityType: string;
    page?: string;
    pageUrl?: string;
    description?: string;
    metadata?: any;
    status?: 'success' | 'failed' | 'warning';
  }) {
    const visitorUuid = getCookie('ptax_vid');
    try {
      return await apiClient.post('/visitors/activity', {
        visitorUuid,
        page: activity.page || document.title,
        pageUrl: activity.pageUrl || window.location.pathname,
        activityType: activity.activityType,
        description: activity.description,
        metadata: activity.metadata,
        status: activity.status || 'success',
      });
    } catch (e) {
      console.warn('Visitor activity logging error:', e);
    }
  },

  // Associate name/email after form submission
  async associateIdentity(data: {
    name: string;
    email?: string;
    formType: string;
    pageUrl?: string;
  }) {
    const visitorUuid = getCookie('ptax_vid');
    const response: any = await apiClient.post('/visitors/associate-identity', {
      visitorUuid,
      name: data.name,
      email: data.email,
      formType: data.formType,
      pageUrl: data.pageUrl || window.location.pathname,
    });
    return response;
  },

  // Admin stats
  async getStats() {
    return await apiClient.get('/visitors/stats');
  },

  // Admin logs feed
  async getLogs(params: {
    search?: string;
    activityType?: string;
    status?: string;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.activityType) query.append('activityType', params.activityType);
    if (params.status) query.append('status', params.status);
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);

    return await apiClient.get(`/visitors/logs?${query.toString()}`);
  },

  // Admin visitor detail
  async getVisitorDetail(id: string) {
    return await apiClient.get(`/visitors/${id}`);
  },

  // Admin delete visitor (GDPR)
  async deleteVisitor(id: string) {
    return await apiClient.delete(`/visitors/${id}`);
  },
};

