import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

type RequestConfig = AxiosRequestConfig & { skipAuth?: boolean };

class ApiService {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE,
      timeout: 10000, // 10 second strict timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for Auth and Session Tokens
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = sessionStorage.getItem('ptc_access_token') || localStorage.getItem('ptc_access_token');
        if (token && config.headers && !config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }

        const sessionToken = sessionStorage.getItem('ptc_session_token');
        if (sessionToken && config.headers) {
          config.headers['X-Session-Token'] = sessionToken;
        }

        // Let the browser/runtime set multipart boundary headers when uploading FormData
        if (config.data instanceof FormData && config.headers) {
          delete config.headers['Content-Type'];
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor with auto-refresh & safe error normalization
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<any>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle Token Expiry
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')) {
            return Promise.reject(error);
          }

          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers['Authorization'] = `Bearer ${token}`;
                }
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          const refreshToken = sessionStorage.getItem('ptc_refresh_token') || localStorage.getItem('ptc_refresh_token');
          if (!refreshToken) {
            this.clearTokens();
            window.dispatchEvent(new CustomEvent('auth:logout'));
            return Promise.reject(error);
          }

          try {
            const refreshRes = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
            const { accessToken, refreshToken: newRefreshToken } = refreshRes.data;

            sessionStorage.setItem('ptc_access_token', accessToken);
            sessionStorage.setItem('ptc_refresh_token', newRefreshToken);
            localStorage.removeItem('ptc_access_token');
            localStorage.removeItem('ptc_refresh_token');

            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            }

            this.refreshSubscribers.forEach((cb) => cb(accessToken));
            this.refreshSubscribers = [];
            this.isRefreshing = false;

            return this.client(originalRequest);
          } catch (refreshErr) {
            this.clearTokens();
            this.refreshSubscribers = [];
            this.isRefreshing = false;
            window.dispatchEvent(new CustomEvent('auth:logout'));
            return Promise.reject(refreshErr);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  clearTokens() {
    sessionStorage.removeItem('ptc_access_token');
    sessionStorage.removeItem('ptc_refresh_token');
    sessionStorage.removeItem('ptc_admin');
    localStorage.removeItem('ptc_access_token');
    localStorage.removeItem('ptc_refresh_token');
    localStorage.removeItem('ptc_admin');
  }

  async get<T = any>(endpoint: string, params?: any, config?: RequestConfig): Promise<T> {
    const res = await this.client.get<T>(endpoint, { ...(config ?? {}), params });
    return res.data;
  }

  async post<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    const res = await this.client.post<T>(endpoint, data, config);
    return res.data;
  }

  async put<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    const res = await this.client.put<T>(endpoint, data, config);
    return res.data;
  }

  async patch<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    const res = await this.client.patch<T>(endpoint, data, config);
    return res.data;
  }

  async delete<T = any>(endpoint: string, dataOrConfig?: any, config?: RequestConfig): Promise<T> {
    const requestConfig: any = dataOrConfig && typeof dataOrConfig === 'object' && !('data' in dataOrConfig || 'headers' in dataOrConfig || 'params' in dataOrConfig)
      ? { ...(config ?? {}), ...(dataOrConfig ?? {}) }
      : { ...(config ?? {}), data: dataOrConfig };
    const res = await this.client.delete<T>(endpoint, requestConfig);
    return res.data;
  }
}

export const apiClient = new ApiService();
export default apiClient;
