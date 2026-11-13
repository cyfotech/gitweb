import apiClient from './client';

export const navigationApi = {
  getAll: () => apiClient.get('/navigation'),
  create: (data: { name: string; url: string; order?: number; isVisible?: boolean; target?: string; parentId?: string }) =>
    apiClient.post('/navigation', data),
  update: (id: string, data: { name?: string; url?: string; order?: number; isVisible?: boolean; target?: string }) =>
    apiClient.put(`/navigation/${id}`, data),
  delete: (id: string) => apiClient.delete(`/navigation/${id}`),
  reorderBulk: (order: { id: string; order: number }[]) =>
    apiClient.put('/navigation/reorder/bulk', { order }),
};

