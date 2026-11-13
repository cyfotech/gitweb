import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';
import { useBackendStatus } from '../../context/BackendStatusContext';
import { ServerOff, RefreshCw } from 'lucide-react';

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const { status, isFullyAvailable, isChecking, checkHealth } = useBackendStatus();

  // 1. Strict Backend and Database Dependency Check
  if (!isFullyAvailable) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030F14] text-white p-6">
        <div className="max-w-md w-full bg-[#071A22] border border-rose-500/30 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-5">
            <ServerOff size={32} />
          </div>

          <h2 className="text-xl font-bold text-white mb-2">
            Admin services are temporarily unavailable.
          </h2>

          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Please check the backend and database connection and try again.
            The admin panel requires active connection to both Node.js (Port 8001) and MySQL.
          </p>

          <div className="bg-white/5 rounded-lg p-3 text-xs font-mono text-slate-400 mb-6 flex justify-between">
            <span>System Status:</span>
            <span className={status === 'OFFLINE' ? 'text-rose-400 font-semibold' : 'text-amber-400 font-semibold'}>
              {status}
            </span>
          </div>

          <button
            onClick={() => checkHealth()}
            disabled={isChecking}
            className="w-full py-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} className={isChecking ? 'animate-spin' : ''} />
            {isChecking ? 'Rechecking Connection...' : 'Retry Connection'}
          </button>
        </div>
      </div>
    );
  }

  // 2. Authentication Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030F14]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500">Verifying session...</p>
        </div>
      </div>
    );
  }

  // 3. User Authentication Check
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
