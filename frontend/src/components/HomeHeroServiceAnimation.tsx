import React, { useState } from 'react';
import { FinancialDonutChart } from './FinancialDonutChart';
import { useAnimationSettings } from '../context/AnimationSettingsContext';
import { OrbitalServiceWheel } from './referenceAnimations/OrbitalServiceWheel';
import { Compass, PieChart } from 'lucide-react';

const defaultHomeFinancialMix = [
  {
    id: 'tax-preparation',
    name: 'Tax preparation',
    value: 1280000,
    color: '#22b887',
    description: 'Prepared and reviewed returns across individual and business clients.',
    metric: '4,200+ returns'
  },
  {
    id: 'accounting-books',
    name: 'Accounting & books',
    value: 920000,
    color: '#39c7c0',
    description: 'Reconciliations, monthly close, and reliable financial records.',
    metric: '3,500+ closes'
  },
  {
    id: 'payroll-support',
    name: 'Payroll support',
    value: 610000,
    color: '#d3a753',
    description: 'Accurate payroll processing and employee pay-cycle support.',
    metric: '1,800+ pay runs'
  },
  {
    id: 'firm-capacity',
    name: 'Firm capacity',
    value: 430000,
    color: '#728fb5',
    description: 'Dedicated accounting teams aligned to partner workflows.',
    metric: '12 specialist pods'
  }
];

export function HomeHeroServiceAnimation() {
  const { settings } = useAnimationSettings();
  const [activeView, setActiveView] = useState<'orbital' | 'portfolio'>('orbital');
  const chartConfig = settings?.homeDonutChart;

  if (chartConfig && chartConfig.enabled === false) {
    return null;
  }

  const data = chartConfig?.items?.length ? chartConfig.items : defaultHomeFinancialMix;
  const title = chartConfig?.title || 'Financial operations';
  const subtitle = chartConfig?.subtitle || 'A clearer view of work delivered across your firm.';
  const centerLabel = chartConfig?.centerLabel || 'PORTFOLIO MIX';

  return (
    <div className="relative w-full space-y-3">
      {/* View Switcher Pill */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-full bg-black/5 dark:bg-white/5 p-1 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)] text-[10px] font-bold">
          <button
            onClick={() => setActiveView('orbital')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
              activeView === 'orbital'
                ? 'bg-[#12242B] dark:bg-[#49E3D6] text-white dark:text-[#03141A] shadow-sm'
                : 'text-[#476067] dark:text-[#A8C0C6]'
            }`}
            type="button"
          >
            <Compass className="w-3 h-3" />
            <span>7-Service Orbital</span>
          </button>
          <button
            onClick={() => setActiveView('portfolio')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
              activeView === 'portfolio'
                ? 'bg-[#12242B] dark:bg-[#49E3D6] text-white dark:text-[#03141A] shadow-sm'
                : 'text-[#476067] dark:text-[#A8C0C6]'
            }`}
            type="button"
          >
            <PieChart className="w-3 h-3" />
            <span>Portfolio Mix</span>
          </button>
        </div>
      </div>

      {/* Render Active View */}
      {activeView === 'orbital' ? (
        <div className="transition-all duration-300">
          <OrbitalServiceWheel />
        </div>
      ) : (
        <div className="transition-all duration-300">
          <FinancialDonutChart
            data={data}
            title={title}
            subtitle={subtitle}
            centerLabel={centerLabel}
            valueFormatter={value => `$${new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(value)}`}
            totalFormatter={value => `$${new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(value)}`}
            tone="home"
          />
        </div>
      )}
    </div>
  );
}