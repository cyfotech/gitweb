import apiClient from './client';

export const servicesApi = {
  getAll: (publishedOnly = false) => apiClient.get(`/services${publishedOnly ? '?published=true' : ''}`),
  getAllAdmin: () => apiClient.get('/services?published=all'),
  getBySlug: (slug: string) => apiClient.get(`/services/slug/${slug}`),
  getDraftBySlug: (slug: string) => apiClient.get(`/services/slug/${slug}?draft=true`),
  create: (data: any) => apiClient.post('/services', data),
  update: (id: string, data: any) => apiClient.put(`/services/${id}`, data),
  delete: (id: string) => apiClient.delete(`/services/${id}`),
  duplicate: (id: string) => apiClient.post(`/services/${id}/duplicate`),
  setStatus: (id: string, isPublished: boolean) => apiClient.patch(`/services/${id}/status`, { isPublished }),
  setFeatured: (id: string, isFeatured: boolean) => apiClient.patch(`/services/${id}/featured`, { isFeatured }),
  reorder: (order: { id: string; displayOrder: number }[]) =>
    apiClient.put('/services/reorder/bulk', { order }),
  uploadImage: (formData: FormData) => apiClient.post('/services/upload-image', formData),
  getCategories: () => apiClient.get('/services/categories'),
  createCategory: (data: any) => apiClient.post('/services/categories', data),
  updateCategory: (id: string, data: any) => apiClient.put(`/services/categories/${id}`, data),
  deleteCategory: (id: string) => apiClient.delete(`/services/categories/${id}`),
  getPageConfig: () => apiClient.get('/services/page-config'),
  updatePageConfig: (data: any) => apiClient.put('/services/page-config', data),
};

