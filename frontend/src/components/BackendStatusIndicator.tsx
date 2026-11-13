import React, { useState } from 'react';
import { useBackendStatus } from '../context/BackendStatusContext';
import { RefreshCw, ChevronDown, ChevronUp, Server } from 'lucide-react';

export function BackendStatusIndicator() {
  const { status, isChecking, lastChecked, healthInfo, checkHealth } = useBackendStatus();
  const [isExpanded, setIsExpanded] = useState(false);

  // Status visual mapping
  const config = {
    CONNECTED: {
      color: 'bg-emerald-500',
      border: 'border-emerald-500/30',
      pulse: 'bg-emerald-400',
      label: 'System Operational',
      badge: 'CONNECTED',
    },
    DEGRADED: {
      color: 'bg-amber-500',
      border: 'border-amber-500/40',
      pulse: 'bg-amber-400',
      label: 'Database / Services Degraded',
      badge: 'DEGRADED',
    },
    OFFLINE: {
      color: 'bg-rose-500',
      border: 'border-rose-500/40',
      pulse: 'bg-rose-400',
      label: 'Backend Offline',
      badge: 'OFFLINE',
    },
  }[status];

  return (
    <div className="fixed bottom-4 right-4 z-50 select-none">
      <div
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full backdrop-blur-md bg-[#030F14]/85 border ${config.border} shadow-lg shadow-black/40 text-xs transition-all`}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.pulse}`}
          />
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${config.color}`} />
        </span>

        <span className="font-medium text-slate-200 hidden sm:inline">{config.label}</span>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-white transition-colors p-0.5"
          title="Details"
        >
          {isExpanded ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
        </button>
      </div>

      {isExpanded && (
        <div className="absolute bottom-10 right-0 w-64 p-3 rounded-xl backdrop-blur-xl bg-[#071A22]/95 border border-teal-500/20 shadow-2xl text-xs space-y-2 text-slate-300">
          <div className="flex items-center justify-between border-b border-teal-500/10 pb-2">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Server size={13} className="text-teal-400" /> Backend Status
            </span>
            <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${config.border} bg-white/5`}>
              {config.badge}
            </span>
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">API Health:</span>
              <span className={status === 'OFFLINE' ? 'text-rose-400' : 'text-emerald-400'}>
                {status === 'OFFLINE' ? 'Unreachable' : 'Responding'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">MySQL Database:</span>
              <span
                className={
                  healthInfo?.database === 'connected' ? 'text-emerald-400' : 'text-amber-400'
                }
              >
                {healthInfo?.database || 'unknown'}
              </span>
            </div>
            {lastChecked && (
              <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                <span>Checked:</span>
                <span>{lastChecked.toLocaleTimeString()}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => checkHealth()}
            disabled={isChecking}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 transition-all text-xs"
          >
            <RefreshCw size={12} className={isChecking ? 'animate-spin' : ''} />
            {isChecking ? 'Checking...' : 'Check Connection'}
          </button>
        </div>
      )}
    </div>
  );
}

