import apiClient from './client';

export const blogApi = {
  getAll: (publishedOnly = false, page = 1, limit = 30, search?: string, category?: string) => {
    const params = new URLSearchParams();
    params.append('published', publishedOnly ? 'true' : 'all');
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (search) params.append('search', search);
    if (category && category !== 'All') params.append('category', category);
    return apiClient.get(`/blog?${params.toString()}`);
  },

  getBySlug: (slug: string) => apiClient.get(`/blog/slug/${slug}`),

  getById: (id: string) => apiClient.get(`/blog/${id}`),

  getCategories: () => apiClient.get('/blog/categories/all'),

  create: (data: any) => apiClient.post('/blog', data),

  update: (id: string, data: any) => apiClient.put(`/blog/${id}`, data),

  delete: (id: string) => apiClient.delete(`/blog/${id}`),

  uploadImage: (file: File) => {
    const form = new FormData();
    form.append('image', file);
    return apiClient.post('/blog/upload-image', form);
  },
};
