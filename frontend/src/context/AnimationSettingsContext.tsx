import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { settingsApi } from '../api/settings';

export interface AnimationSettingsConfig {
  animationsEnabled: boolean;
  reducedMotion: boolean;
  autoplay: boolean;
  loop: boolean;
  speedMultiplier: number; // 0.5 (slow) to 2.0 (fast), default 1.0
  cycleIntervalMs: number; // default 4200ms
  // Specific visual components configurations
  homeDonutChart?: {
    enabled: boolean;
    title: string;
    subtitle: string;
    centerLabel: string;
    items: Array<{
      id: string;
      name: string;
      value: number;
      color: string;
      description?: string;
      metric?: string;
    }>;
  };
  cpaCollaborationPipeline?: {
    enabled: boolean;
    autoAdvance: boolean;
    cycleIntervalMs: number;
    stages: Array<{
      id: number;
      title: string;
      shortTitle: string;
      duration: string;
      summary: string;
      securityControls?: string;
    }>;
  };
  aboutPieChart?: {
    enabled: boolean;
    title: string;
    subtitle: string;
    centerLabel: string;
    items: Array<{
      id: string;
      name: string;
      value: number;
      color: string;
      description?: string;
      metric?: string;
    }>;
  };
  aboutHeroTrend?: {
    enabled: boolean;
    cardBadge: string;
    title: string;
    subtitle: string;
    centerLabel: string;
    metricCardLabel: string;
    metricCardValue: string;
    items: Array<{
      id: string;
      name: string;
      value: number;
      color: string;
      metric?: string;
      description?: string;
    }>;
  };
  // Detailed animation overrides mapped by registered animation ID
  elementOverrides?: Record<string, {
    enabled?: boolean;
    duration?: string;
    delay?: string;
    speed?: string;
    easing?: string;
    trigger?: string;
    repeat?: string | number;
    intensity?: number;
    opacity?: number;
    scale?: number;
    x?: number;
    y?: number;
    blur?: number;
    customCss?: string;
    status?: 'active' | 'paused' | 'disabled';
  }>;
}

export const defaultAnimationSettings: AnimationSettingsConfig = {
  animationsEnabled: true,
  reducedMotion: false,
  autoplay: true,
  loop: true,
  speedMultiplier: 1.0,
  cycleIntervalMs: 4200,
  homeDonutChart: {
    enabled: true,
    title: 'Financial operations',
    subtitle: 'A clearer view of work delivered across your firm.',
    centerLabel: 'PORTFOLIO MIX',
    items: [
      {
        id: 'tax-preparation',
        name: 'Tax preparation',
        value: 1280000,
        color: '#22b887',
        description: 'Prepared and reviewed returns across individual and business clients.',
        metric: '4,200+ returns',
      },
      {
        id: 'accounting-books',
        name: 'Accounting & books',
        value: 920000,
        color: '#39c7c0',
        description: 'Reconciliations, monthly close, and reliable financial records.',
        metric: '3,500+ closes',
      },
      {
        id: 'payroll-support',
        name: 'Payroll support',
        value: 610000,
        color: '#d3a753',
        description: 'Accurate payroll processing and employee pay-cycle support.',
        metric: '1,800+ pay runs',
      },
      {
        id: 'firm-capacity',
        name: 'Firm capacity',
        value: 430000,
        color: '#728fb5',
        description: 'Dedicated accounting teams aligned to partner workflows.',
        metric: '12 specialist pods',
      },
    ],
  },
  cpaCollaborationPipeline: {
    enabled: true,
    autoAdvance: true,
    cycleIntervalMs: 6000,
    stages: [
      {
        id: 1,
        title: 'Stage 01: Secure Ingestion & Cloud Sync',
        shortTitle: '01. Ingestion',
        duration: 'Hour 0–2',
        summary: 'Source documents, trial balances, and prior-year tax returns are ingested directly into your practice cloud or private virtual desktop.',
        securityControls: 'SOC 2 Type II Encrypted VPN, zero local caching or file saving.',
      },
      {
        id: 2,
        title: 'Stage 02: Preparation & Workpaper Standardization',
        shortTitle: '02. Preparation',
        duration: 'Hour 2–18',
        summary: 'Dedicated tax associates enter source data, calculate multi-state apportionments, and build lead schedules with standardized tick-marks.',
        securityControls: 'Two-factor authentication and role-based folder permission isolation.',
      },
      {
        id: 3,
        title: 'Stage 03: US CPA Senior Diagnostic Audit',
        shortTitle: '03. CPA Audit',
        duration: 'Hour 18–24',
        summary: 'A seasoned US-licensed CPA reviews every line item, verifies partner basis, tests elections, and clears all diagnostic gates.',
        securityControls: 'Senior US CPA signature authorization gate required for progression.',
      },
      {
        id: 4,
        title: 'Stage 04: e-File Ready Return & Client Delivery',
        shortTitle: '04. Delivery',
        duration: 'Hour 24–48',
        summary: 'The completed tax return package, transmittal letter, and Form 8879 are delivered back to your firm portal ready for your final partner review and client signature.',
        securityControls: 'Automated notification and immediate audit trail lock.',
      },
    ],
  },
  aboutPieChart: {
    enabled: true,
    title: 'Service performance',
    subtitle: 'Delivery mix with quality and turnaround metrics.',
    centerLabel: 'SERVICE MIX',
    items: [
      {
        id: 'corporate-tax',
        name: 'Corporate tax',
        value: 4200,
        color: '#34d399',
        metric: '99.9% accuracy · 36h avg',
        description: 'Multi-jurisdiction federal and state returns with depreciation schedules and partner sign-off.',
      },
      {
        id: 'nexus-compliance',
        name: 'Nexus compliance',
        value: 2800,
        color: '#d3a753',
        metric: '99.8% accuracy · 24h avg',
        description: 'Sales tax apportionment, economic nexus tracking, and state authority correspondence.',
      },
      {
        id: 'cpa-outsourcing',
        name: 'CPA outsourcing',
        value: 3500,
        color: '#42c5bd',
        metric: '99.9% accuracy · 18h avg',
        description: 'Month-end close, bank reconciliations, trial balance workpapers, and ERP integration.',
      },
      {
        id: 'rd-credit',
        name: 'R&D tax credits',
        value: 2100,
        color: '#7795b8',
        metric: '99.7% accuracy · $45M+ identified',
        description: 'Qualified research expense analysis and IRS-audit-ready technical write-ups.',
      },
      {
        id: 'hnw-advisory',
        name: 'HNW advisory',
        value: 1100,
        color: '#a78bfa',
        metric: '100% accuracy · 12h avg',
        description: 'Estate planning, trust taxation, year-round tax minimization, and family-office support.',
      },
    ],
  },
  aboutHeroTrend: {
    enabled: true,
    cardBadge: 'CHART',
    title: 'Financial performance',
    subtitle: 'A snapshot of annual delivery and advisory results.',
    centerLabel: 'PERFORMANCE MIX',
    metricCardLabel: 'Operational quality',
    metricCardValue: '99.8%',
    items: [
      { id: 'q1', name: 'Q1', value: 850, color: '#34d399', metric: '850', description: 'Q1 Financial Performance Trend' },
      { id: 'q2', name: 'Q2', value: 1100, color: '#d3a753', metric: '1.1K', description: 'Q2 Financial Performance Trend' },
      { id: 'q3', name: 'Q3', value: 920, color: '#42c5bd', metric: '920', description: 'Q3 Financial Performance Trend' },
      { id: 'q4', name: 'Q4', value: 1450, color: '#7795b8', metric: '1.5K', description: 'Q4 Financial Performance Trend' },
    ],
  },
};

interface AnimationSettingsContextType {
  settings: AnimationSettingsConfig;
  loading: boolean;
  updateSettings: (newSettings: Partial<AnimationSettingsConfig>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

const AnimationSettingsContext = createContext<AnimationSettingsContextType>({
  settings: defaultAnimationSettings,
  loading: false,
  updateSettings: async () => {},
  resetToDefaults: async () => {},
});

export const AnimationSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AnimationSettingsConfig>(defaultAnimationSettings);
  const [loading, setLoading] = useState<boolean>(true);

  // Injects active animation styles (durations, delays, speeds, custom CSS) to public DOM
  useEffect(() => {
    let styleTag = document.getElementById('ptc-live-animation-engine-styles') as HTMLStyleElement | null;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'ptc-live-animation-engine-styles';
      document.head.appendChild(styleTag);
    }

    if (!settings.animationsEnabled) {
      styleTag.innerHTML = `
        *, *::before, *::after {
          animation-play-state: paused !important;
          animation-duration: 0.001ms !important;
          transition-duration: 0.001ms !important;
        }
      `;
      return;
    }

    const speed = settings.speedMultiplier || 1.0;
    const rules: string[] = [];

    // System-wide speed multiplier rule
    if (speed !== 1.0) {
      rules.push(`
        :root {
          --ct-anim-speed-factor: ${1 / speed};
        }
      `);
    }

    // Element-specific overrides
    if (settings.elementOverrides) {
      Object.entries(settings.elementOverrides).forEach(([id, ov]) => {
        if (!ov) return;
        const selector = `[data-anim-id="${id}"], .anim-${id}`;
        if (ov.enabled === false || ov.status === 'disabled') {
          rules.push(`${selector} { animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; }`);
        } else {
          const decls: string[] = [];
          if (ov.status === 'paused') decls.push('animation-play-state: paused !important;');
          if (ov.duration) decls.push(`animation-duration: ${ov.duration} !important; transition-duration: ${ov.duration} !important;`);
          if (ov.delay) decls.push(`animation-delay: ${ov.delay} !important; transition-delay: ${ov.delay} !important;`);
          if (ov.easing) decls.push(`animation-timing-function: ${ov.easing} !important;`);
          if (ov.repeat === 'infinite') decls.push(`animation-iteration-count: infinite !important;`);
          else if (typeof ov.repeat === 'number') decls.push(`animation-iteration-count: ${ov.repeat} !important;`);
          if (typeof ov.opacity === 'number') decls.push(`opacity: ${ov.opacity} !important;`);
          if (typeof ov.scale === 'number') decls.push(`transform: scale(${ov.scale}) !important;`);
          if (ov.customCss) decls.push(ov.customCss);

          if (decls.length > 0) {
            rules.push(`${selector} { ${decls.join(' ')} }`);
          }
        }
      });
    }

    styleTag.innerHTML = rules.join('\n');
  }, [settings]);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await settingsApi.getAll();
      if (res && res.animation_settings) {
        setSettings({
          ...defaultAnimationSettings,
          ...res.animation_settings,
        });
      }
    } catch (err) {
      console.warn('[AnimationSettingsProvider] Using fallback animation settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (newSettings: Partial<AnimationSettingsConfig>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    await settingsApi.updateKey(
      'animation_settings',
      merged,
      'Centralized Website Animation & Simulation Settings',
      'animation'
    );
  };

  const resetToDefaults = async () => {
    setSettings(defaultAnimationSettings);
    await settingsApi.updateKey(
      'animation_settings',
      defaultAnimationSettings,
      'Centralized Website Animation & Simulation Settings',
      'animation'
    );
  };

  return (
    <AnimationSettingsContext.Provider
      value={{
        settings,
        loading,
        updateSettings,
        resetToDefaults,
      }}
    >
      {children}
    </AnimationSettingsContext.Provider>
  );
};

export const useAnimationSettings = () => useContext(AnimationSettingsContext);

