import apiClient from './client';

export interface SectionField {
  fieldKey: string;
  fieldType: string;
  value?: unknown;
}

export const sectionsApi = {
  getById: (id: string) => apiClient.get(`/sections/${id}`),
  create: (data: any) => apiClient.post('/sections', data),
  delete: (id: string) => apiClient.delete(`/sections/${id}`),
  duplicate: (id: string) => apiClient.post(`/sections/${id}/duplicate`),
  saveContent: (id: string, payload: {
    fields: SectionField[] | any[];
    isDraft?: boolean;
    note?: string;
    expectedUpdatedAt?: string;
  }) => {
    const { isDraft, fields, note, expectedUpdatedAt } = payload;
    // Server has separate draft vs publish endpoints. Drafts are invisible to the public site.
    return apiClient.put(isDraft ? `/sections/${id}/draft` : `/sections/${id}/publish`, {
      fields,
      note,
      expectedUpdatedAt,
    });
  },
  rename: (id: string, data: { sectionKey?: string; title?: string }) =>
    apiClient.put(`/sections/${id}/rename`, data),
  toggleVisibility: (id: string, isVisible: boolean) =>
    apiClient.put(`/sections/${id}/visibility`, { isVisible }),
  restoreRevision: (sectionId: string, revisionId: string) =>
    apiClient.post(`/sections/${sectionId}/restore/${revisionId}`),
};
