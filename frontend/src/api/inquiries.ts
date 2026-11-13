import apiClient from './client';

export interface InquiryNote {
  id: string;
  note: string;
  authorName: string;
  createdAt: string;
  createdById?: string;
}

export interface StatusHistoryItem {
  status: string;
  prevStatus?: string;
  changedBy: string;
  changedAt: string;
  note?: string;
}

export interface ActivityLogItem {
  id: string;
  action: string;
  description: string;
  performedBy: string;
  timestamp: string;
}

export interface CommunicationItem {
  id: string;
  type: string;
  direction: 'INBOUND' | 'OUTBOUND';
  purpose?: string;
  subject: string;
  body: string;
  sender: string;
  recipient: string;
  timestamp: string;
  deliveryStatus?: 'accepted_by_smtp' | 'not_accepted';
  messageId?: string;
  error?: string;
}

export interface ContactInquiry {
  id: string;
  inquiryNumber?: string;
  name: string;
  email: string;
  phone?: string | null;
  organization?: string | null;
  inquiryType: string;
  subject?: string | null;
  message: string;
  status: 'new' | 'in_progress' | 'waiting_response' | 'responded' | 'closed' | 'spam';
  assignedAdminId?: string | null;
  assignedAdminName?: string | null;
  sourcePage?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  isRead: boolean;
  isArchived: boolean;
  firstRespondedAt?: string | null;
  resolvedAt?: string | null;
  statusHistory?: StatusHistoryItem[];
  activityLogs?: ActivityLogItem[];
  communicationHistory?: CommunicationItem[];
  notes?: InquiryNote[];
  createdAt: string;
  updatedAt: string;
}

export interface InquiryAnalytics {
  total: number;
  new: number;
  inProgress: number;
  waitingResponse: number;
  responded: number;
  closed: number;
  spam: number;
  unassigned: number;
  archived: number;
  todayCount: number;
  weekCount: number;
  resolutionRate: number;
}

export interface InquirySubmissionResponse {
  success: true;
  submissionReceived: true;
  inquiryId: string;
  inquiryNumber: string;
  emailDelivery: {
    customerConfirmation: 'accepted_by_smtp' | 'not_accepted';
    ownerNotification: 'accepted_by_smtp' | 'not_accepted';
  };
  emailDeliveryErrors?: {
    customerConfirmation?: string;
    ownerNotification?: string;
  };
  message: string;
}

export const inquiriesApi = {
  // Public form submission
  submit: (data: {
    name: string;
    email: string;
    phone?: string;
    organization?: string;
    inquiryType: string;
    subject?: string;
    message: string;
    sourcePage?: string;
  }) => apiClient.post<InquirySubmissionResponse>('/inquiries', data, { skipAuth: true, timeout: 60_000 }),

  // Admin: Get all with filtering, searching, pagination
  getAll: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    adminId?: string;
    unassigned?: boolean;
    timeframe?: string;
    isArchived?: boolean;
    sort?: string;
  }) => {
    const query = new URLSearchParams(
      Object.entries(params || {})
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return apiClient.get(`/inquiries${query ? `?${query}` : ''}`);
  },

  // Admin: Analytics metrics
  getAnalytics: (): Promise<InquiryAnalytics> => apiClient.get('/inquiries/analytics'),

  // Admin: Admin user directory for assignment
  getAdmins: (): Promise<{ id: string; name: string; email: string; role: string }[]> =>
    apiClient.get('/inquiries/admins'),

  // Admin: Single inquiry by ID
  getById: (id: string): Promise<ContactInquiry> => apiClient.get(`/inquiries/${id}`),

  // Admin: Update status
  updateStatus: (id: string, status: string, note?: string, assignedToId?: string) =>
    apiClient.put(`/inquiries/${id}/status`, { status, note, assignedToId }),

  // Admin: Assign to admin user
  assign: (id: string, adminId: string | null) =>
    apiClient.put(`/inquiries/${id}/assign`, { adminId }),

  // Admin: Add internal note
  addNote: (id: string, note: string) =>
    apiClient.post(`/inquiries/${id}/notes`, { note }),

  // Admin: Delete internal note
  deleteNote: (id: string, noteId: string) =>
    apiClient.delete(`/inquiries/${id}/notes/${noteId}`),

  // Admin: Send customer email response
  reply: (id: string, payload: { to: string; subject: string; message: string; updateStatusToResponded?: boolean }) =>
    apiClient.post(`/inquiries/${id}/reply`, payload),

  // Admin: Archive or unarchive
  toggleArchive: (id: string, isArchived: boolean) =>
    apiClient.put(`/inquiries/${id}/archive`, { isArchived }),

  // Admin: Mark as read/unread
  markRead: (id: string, isRead: boolean = true) =>
    apiClient.put(`/inquiries/${id}/read`, { isRead }),

  // Admin: Delete
  delete: (id: string, permanent: boolean = false) =>
    apiClient.delete(`/inquiries/${id}${permanent ? '?permanent=true' : ''}`),
};

export const consultationsApi = {
  submit: (data: {
    fullName: string;
    email: string;
    phone: string;
    companyName?: string;
    category: string;
    serviceSlug: string;
    serviceName?: string;
    annualVolumeOrRevenue: string;
    preferredContactMethod: 'email' | 'phone';
    message: string;
    privacyConsent: boolean;
    sourcePage?: string;
  }) => apiClient.post<{
    success: boolean;
    submissionReceived: boolean;
    id: string;
    referenceNo: string;
    emailDelivery: {
      customerConfirmation: 'accepted_by_smtp' | 'not_accepted';
      ownerNotification: 'accepted_by_smtp' | 'not_accepted';
    };
    emailDeliveryErrors?: {
      customerConfirmation?: string;
      ownerNotification?: string;
    };
    emailDeliveryMessage?: string;
    message: string;
  }>('/consultations', data, { skipAuth: true, timeout: 60_000 }),
  
  getAll: (params?: { page?: number; limit?: number; status?: string; category?: string; search?: string; startDate?: string; endDate?: string; sort?: string }) => {
    const query = new URLSearchParams(
      Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => [k, String(v)])
    ).toString();
    return apiClient.get(`/consultations${query ? `?${query}` : ''}`);
  },

  getAnalytics: () => apiClient.get('/consultations/analytics'),
  
  getById: (id: string) => apiClient.get(`/consultations/${id}`),

  updateStatus: (id: string, status: string, payload?: { note?: string; cancellationReason?: string; assignedAdminName?: string }) =>
    apiClient.put(`/consultations/${id}/status`, { status, ...payload }),
  
  schedule: (id: string, data: { appointmentDate: string; appointmentTime: string; meetingType: string; meetingLocation?: string; assignedAdminName?: string }) =>
    apiClient.put(`/consultations/${id}/schedule`, data),

  addNote: (id: string, note: string) =>
    apiClient.post(`/consultations/${id}/notes`, { note }),

  deleteNote: (id: string, noteId: string) =>
    apiClient.delete(`/consultations/${id}/notes/${noteId}`),

  reply: (id: string, payload: { to: string; subject: string; message: string }) =>
    apiClient.post<{
      success: boolean;
      acceptedBySmtp: boolean;
      messageId?: string;
      communicationHistory: CommunicationItem[];
    }>(`/consultations/${id}/reply`, payload),

  updateDetails: (id: string, data: any) =>
    apiClient.put(`/consultations/${id}`, data),
};
