import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, AdminUser } from '../../api/auth';

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  requestOtp: (username: string) => Promise<{ maskedEmail: string; expiresInSeconds: number; cooldownSeconds?: number }>;
  verifyOtp: (username: string, otp: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    await authApi.logout();
    setAdmin(null);
  }, []);

  useEffect(() => {
    // Restore admin from localStorage
    const stored = authApi.getStoredAdmin();
    if (stored && authApi.isAuthenticated()) {
      setAdmin(stored);
      // Verify token is still valid
      authApi.me()
        .then(setAdmin)
        .catch(() => {
          setAdmin(null);
          authApi.clearTokens();
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }

    // Listen for forced logout
    const handleLogout = () => {
      setAdmin(null);
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const requestOtp = async (username: string) => {
    const res = await authApi.requestOtp(username);
    return {
      maskedEmail: res.maskedEmail,
      expiresInSeconds: res.expiresInSeconds,
      cooldownSeconds: res.cooldownSeconds,
    };
  };

  const verifyOtp = async (username: string, otp: string) => {
    const data = await authApi.verifyOtp(username, otp);
    setAdmin(data.admin);
  };

  const login = async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    setAdmin(data.admin);
  };

  return (
    <AdminAuthContext.Provider value={{
      admin,
      isLoading,
      isAuthenticated: !!admin,
      requestOtp,
      verifyOtp,
      login,
      logout,
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

