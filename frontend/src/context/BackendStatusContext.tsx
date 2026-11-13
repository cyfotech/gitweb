import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type BackendStatus = 'CONNECTED' | 'DEGRADED' | 'OFFLINE';

export interface HealthInfo {
  status: 'ok' | 'degraded' | 'error';
  database: 'connected' | 'disconnected' | 'unknown';
  timestamp?: string;
  error?: string;
}

interface BackendStatusContextType {
  status: BackendStatus;
  isFullyAvailable: boolean; // CONNECTED only
  isChecking: boolean;
  lastChecked: Date | null;
  healthInfo: HealthInfo | null;
  checkHealth: () => Promise<BackendStatus>;
}

const BackendStatusContext = createContext<BackendStatusContextType | undefined>(undefined);

export function BackendStatusProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<BackendStatus>('CONNECTED');
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [healthInfo, setHealthInfo] = useState<HealthInfo | null>(null);

  const checkHealth = useCallback(async (): Promise<BackendStatus> => {
    setIsChecking(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch('/api/v1/health', {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      setLastChecked(new Date());

      if (response.status === 200) {
        const data = await response.json().catch(() => null);
        if (data && data.status === 'ok' && data.database === 'connected') {
          setStatus('CONNECTED');
          setHealthInfo(data);
          return 'CONNECTED';
        } else {
          setStatus('DEGRADED');
          setHealthInfo(data || { status: 'degraded', database: 'disconnected' });
          return 'DEGRADED';
        }
      } else if (response.status === 503) {
        const data = await response.json().catch(() => null);
        setStatus('DEGRADED');
        setHealthInfo(data || { status: 'degraded', database: 'disconnected' });
        return 'DEGRADED';
      } else {
        setStatus('OFFLINE');
        setHealthInfo({ status: 'error', database: 'unknown', error: `HTTP ${response.status}` });
        return 'OFFLINE';
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      setLastChecked(new Date());
      setStatus('OFFLINE');
      setHealthInfo({ status: 'error', database: 'unknown', error: err.name === 'AbortError' ? 'Connection timed out' : 'Connection refused' });
      return 'OFFLINE';
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    // Initial health check on application startup
    checkHealth();

    // Periodic health check every 20 seconds
    const interval = setInterval(() => {
      checkHealth();
    }, 20000);

    return () => clearInterval(interval);
  }, [checkHealth]);

  return (
    <BackendStatusContext.Provider
      value={{
        status,
        isFullyAvailable: status === 'CONNECTED',
        isChecking,
        lastChecked,
        healthInfo,
        checkHealth,
      }}
    >
      {children}
    </BackendStatusContext.Provider>
  );
}

export function useBackendStatus() {
  const context = useContext(BackendStatusContext);
  if (!context) {
    throw new Error('useBackendStatus must be used within a BackendStatusProvider');
  }
  return context;
}

