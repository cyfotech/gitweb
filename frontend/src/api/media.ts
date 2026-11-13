import apiClient from './client';

export interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width?: number | null;
  height?: number | null;
  folder: string;
  folderId?: string | null;
  altText?: string | null;
  caption?: string | null;
  description?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  tags?: any;
  storageLocation: string;
  url: string;
  thumbnailUrl: string;
  fileHash?: string | null;
  isArchived: boolean;
  usageCount?: number;
  createdAt?: string;
  updatedAt?: string;
  mediafolder?: { id: string; name: string; path: string };
  mediausage?: {
    id: string;
    pageId?: string;
    sectionId?: string;
    blogId?: string;
    contentType: string;
    location?: string;
  }[];
  mediaversion?: {
    id: string;
    filename: string;
    storagePath: string;
    size: number;
    versionNumber: number;
    createdAt: string;
  }[];
}

export interface MediaFolder {
  id: string;
  name: string;
  parentId?: string | null;
  path: string;
  isRoot: boolean;
  assetCount?: number;
}

export interface MediaStatistics {
  totalAssets: number;
  totalFolders: number;
  totalStorageBytes: number;
  imageCount: number;
  videoCount: number;
  documentCount: number;
  otherCount: number;
  unusedCount: number;
  storageBreakdown: {
    images: number;
    videos: number;
    documents: number;
    other: number;
  };
}

export const mediaApi = {
  // Fetch assets with advanced filtering
  getAll: (params?: {
    folder?: string;
    folderId?: string;
    type?: string;
    search?: string;
    unusedOnly?: boolean;
    archived?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams(
      Object.entries(params || {})
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return apiClient.get(`/media${query ? `?${query}` : ''}`);
  },

  // Single asset with full details
  getById: (id: string): Promise<MediaAsset> => apiClient.get(`/media/${id}`),

  // Statistics
  getStatistics: (): Promise<MediaStatistics> => apiClient.get('/media/statistics'),

  // Duplicates detection
  getDuplicates: () => apiClient.get('/media/duplicates'),

  // Multi-file upload with folder assignment
  uploadFiles: (files: File[], folderId?: string, onProgress?: (percent: number) => void) => {
    const form = new FormData();
    files.forEach((file) => form.append('files', file));
    if (folderId && folderId !== 'all') form.append('folderId', folderId);
    return apiClient.post('/media/upload', form);
  },

  // Single file upload backward compatibility
  upload: (file: File, folderId?: string, altText?: string) => {
    const form = new FormData();
    form.append('files', file);
    if (folderId && folderId !== 'all') form.append('folderId', folderId);
    if (altText) form.append('altText', altText);
    return apiClient.post('/media/upload', form);
  },

  // Update metadata & SEO
  update: (
    id: string,
    data: {
      originalName?: string;
      altText?: string;
      caption?: string;
      description?: string;
      seoTitle?: string;
      seoDescription?: string;
      folderId?: string | null;
      folder?: string;
      tags?: any;
    }
  ) => apiClient.put(`/media/${id}`, data),

  // Replace file safely with version backup
  replaceFile: (id: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return apiClient.post(`/media/${id}/replace`, form);
  },

  // In-browser image editing (crop, rotate, resize, webp convert)
  editImage: (
    id: string,
    payload: {
      rotate?: number;
      flip?: boolean;
      flop?: boolean;
      width?: number;
      height?: number;
      crop?: { left: number; top: number; width: number; height: number };
      format?: string;
      quality?: number;
      saveAsNew?: boolean;
    }
  ) => apiClient.post(`/media/${id}/edit-image`, payload),

  // Link usage to a page or section
  linkUsage: (id: string, payload: { pageId?: string; sectionId?: string; blogId?: string; location?: string }) =>
    apiClient.post(`/media/${id}/link-usage`, payload),

  // Bulk actions
  bulkAction: (payload: {
    action: 'move' | 'archive' | 'restore' | 'delete' | 'update_alt';
    assetIds: string[];
    targetFolderId?: string;
    targetFolderName?: string;
    altText?: string;
    tags?: any;
  }) => apiClient.post('/media/bulk-action', payload),

  // Delete single file (with force override for active usages)
  delete: (id: string, force: boolean = false) =>
    apiClient.delete(`/media/${id}${force ? '?force=true' : ''}`),

  // Folders
  getFolders: (): Promise<MediaFolder[]> => apiClient.get('/media/folders/all'),
  createFolder: (name: string, parentId?: string) =>
    apiClient.post('/media/folders', { name, parentId }),
  updateFolder: (id: string, name: string) =>
    apiClient.put(`/media/folders/${id}`, { name }),
  deleteFolder: (id: string, targetMoveFolderId?: string) =>
    apiClient.delete(`/media/folders/${id}`, { data: { targetMoveFolderId } }),
};
