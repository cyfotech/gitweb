import apiClient from './client';

export const pagesApi = {
  getAll: () => apiClient.get('/pages'),
  getById: (id: string) => apiClient.get(`/pages/${id}`),
  getBySlug: (slug: string) => apiClient.get(`/pages/slug/${slug}`),
  publish: (id: string, isPublished: boolean) =>
    apiClient.put(`/pages/${id}/publish`, { isPublished }),
  reorderSections: (
    pageId: string,
    order: { sectionId: string; displayOrder: number }[]
  ) => apiClient.put(`/pages/${pageId}/sections/reorder`, { order }),
  duplicate: (id: string) => apiClient.post(`/pages/${id}/duplicate`),
};
