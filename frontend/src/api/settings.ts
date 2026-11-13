import apiClient from './client';

export const settingsApi = {
  getAll: (): Promise<Record<string, any>> => apiClient.get('/settings'),
  updateBulk: (settings: Record<string, any>) => apiClient.put('/settings/bulk', { settings }),
  updateKey: (key: string, value: any, description?: string, category?: string) =>
    apiClient.put(`/settings/${key}`, { value, description, category }),
  testCalendly: (url: string, token?: string) =>
    apiClient.post('/settings/test-calendly', { url, token }),
};

