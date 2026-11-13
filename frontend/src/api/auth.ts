import apiClient from './client';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isSuperAdmin: boolean;
  lastLoginAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  admin: AdminUser;
}

export interface RequestOtpResponse {
  success: boolean;
  userExists: boolean;
  message: string;
  maskedEmail: string;
  expiresInSeconds: number;
  cooldownSeconds?: number;
}

export const authApi = {
  requestOtp: async (username: string): Promise<RequestOtpResponse> => {
    return apiClient.post<RequestOtpResponse>('/auth/request-otp', { username }, { skipAuth: true });
  },

  verifyOtp: async (username: string, otp: string): Promise<AuthResponse> => {
    const data = await apiClient.post<AuthResponse>('/auth/verify-otp', { username, otp }, { skipAuth: true });
    // Use sessionStorage so session is automatically terminated when the browser tab/window is closed
    sessionStorage.setItem('ptc_access_token', data.accessToken);
    sessionStorage.setItem('ptc_refresh_token', data.refreshToken);
    sessionStorage.setItem('ptc_admin', JSON.stringify(data.admin));

    // Clear any persistent localStorage tokens from older sessions
    localStorage.removeItem('ptc_access_token');
    localStorage.removeItem('ptc_refresh_token');
    localStorage.removeItem('ptc_admin');

    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const data = await apiClient.post<AuthResponse>('/auth/login', { email, password }, { skipAuth: true });
    sessionStorage.setItem('ptc_access_token', data.accessToken);
    sessionStorage.setItem('ptc_refresh_token', data.refreshToken);
    sessionStorage.setItem('ptc_admin', JSON.stringify(data.admin));

    localStorage.removeItem('ptc_access_token');
    localStorage.removeItem('ptc_refresh_token');
    localStorage.removeItem('ptc_admin');

    return data;
  },

  clearTokens: () => {
    sessionStorage.removeItem('ptc_access_token');
    sessionStorage.removeItem('ptc_refresh_token');
    sessionStorage.removeItem('ptc_admin');
    localStorage.removeItem('ptc_access_token');
    localStorage.removeItem('ptc_refresh_token');
    localStorage.removeItem('ptc_admin');
  },

  logout: async () => {
    const refreshToken = sessionStorage.getItem('ptc_refresh_token') || localStorage.getItem('ptc_refresh_token');
    try {
      await apiClient.post('/auth/logout', { refreshToken });
    } catch {
      // Ignore logout errors
    } finally {
      authApi.clearTokens();
    }
  },

  me: (): Promise<AdminUser> => apiClient.get('/auth/me'),

  getStoredAdmin: (): AdminUser | null => {
    try {
      const stored = sessionStorage.getItem('ptc_admin') || localStorage.getItem('ptc_admin');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!(sessionStorage.getItem('ptc_access_token') || localStorage.getItem('ptc_access_token'));
  },
};

