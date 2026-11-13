import React, { useState, useEffect } from 'react';
import { Sparkles, Sliders, Layers, CheckCircle2 } from 'lucide-react';
import type { ServiceItem } from '../data/services';
import { ServiceExecutionSimulation } from './ServiceExecutionSimulation';
import { servicesApi } from '../api/services';

// Import reference animation components
import {
  ServiceExecutionShowcase,
  TwelveMonthTaxRoadmap,
  DeductionVsCreditCalculator,
  LlcTaxClassifier,
  CpaPeakCapacityCalculator,
  ContinuousPlanningLoop,
  PlanningSignalsDiagnostic,
} from './referenceAnimations';

interface ServiceDemoProps {
  service: ServiceItem;
}

export function ServiceDemonstration({ service }: ServiceDemoProps) {
  const [config, setConfig] = useState<any>({
    simulationBadge: 'Interactive Service Walkthrough',
    simulationSubtext: 'Explore the operational mechanics, live calculators, and execution stages that shape this service.',
  });
  const [viewMode, setViewMode] = useState<'simulator' | 'stages'>('simulator');

  useEffect(() => {
    servicesApi.getPageConfig()
      .then((cfg) => {
        if (cfg && typeof cfg === 'object') {
          setConfig((prev: any) => ({ ...prev, ...cfg }));
        }
      })
      .catch(() => {});
  }, []);

  // Determine which reference animation best matches the service
  const renderTailoredSimulator = () => {
    switch (service.slug) {
      // Planning services
      case 'business-tax-planning':
        return <TwelveMonthTaxRoadmap />;
      case 'family-tax-planning':
        return <DeductionVsCreditCalculator />;
      case 'personal-tax-consultation':
        return <ContinuousPlanningLoop />;

      // Business & corporate tax
      case 'business-tax-preparation':
        return <LlcTaxClassifier />;

      // CPA Outsourcing & Capacity
      case 'tax-prep-outsourcing':
      case 'dedicated-staff-augmentation':
        return <CpaPeakCapacityCalculator />;

      // IRS & Audit
      case 'irs-assistance':
      case 'audit-support':
      case 'tax-review-support':
        return <PlanningSignalsDiagnostic />;

      // Accounting, Bookkeeping, Payroll, Financial Reporting, Write-up, Year-End Cleanup
      case 'bookkeeping':
      case 'accounting-services':
      case 'payroll-management':
      case 'payroll-processing':
      case 'financial-reporting':
      case 'financial-statement-prep':
      case 'bookkeeping-outsourcing':
      case 'accounting-outsourcing':
      case 'year-end-cleanup':
      case 'write-up-services':
      case 'individual-tax-prep':
      default:
        return <ServiceExecutionShowcase />;
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-[#DCE5E2] bg-white/70 p-5 shadow-xl backdrop-blur-xl dark:border-[rgba(121,241,232,0.2)] dark:bg-[#071C25]/80 sm:p-8">
      <div className="mb-6 flex flex-col justify-between gap-3 border-b border-[#E2EBE8] pb-6 dark:border-[#102C38] sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#49E3D6]/30 bg-[#49E3D6]/15 px-3 py-1 text-xs font-semibold text-[#17383F] dark:text-[#7DF5E8]">
            <Sparkles className="h-3.5 w-3.5 text-[#315F69] dark:text-[#49E3D6]" />
            <span>{config.simulationBadge || 'Interactive Service Walkthrough'}</span>
          </div>
          <h3 className="text-xl font-bold text-[#12242B] dark:text-[#F4FBFC] sm:text-2xl font-serif-editorial">
            Live Execution Simulation: {service.name}
          </h3>
          <p className="mt-1 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#476067] dark:text-[#A8C0C6]">
            {config.simulationSubtext || 'Explore the operational mechanics, live calculators, and execution stages that shape this service.'}
          </p>
        </div>

        {/* View Switcher: Interactive Reference Simulator vs Stage Progress Map */}
        <div className="flex rounded-full bg-black/5 dark:bg-white/5 p-1 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)] text-xs font-bold shrink-0">
          <button
            onClick={() => setViewMode('simulator')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
              viewMode === 'simulator'
                ? 'bg-[#12242B] dark:bg-[#49E3D6] text-white dark:text-[#03141A] shadow-sm'
                : 'text-[#476067] dark:text-[#A8C0C6]'
            }`}
            type="button"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Live Simulator</span>
          </button>
          <button
            onClick={() => setViewMode('stages')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
              viewMode === 'stages'
                ? 'bg-[#12242B] dark:bg-[#49E3D6] text-white dark:text-[#03141A] shadow-sm'
                : 'text-[#476067] dark:text-[#A8C0C6]'
            }`}
            type="button"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Stage Checkpoints</span>
          </button>
        </div>
      </div>

      {viewMode === 'simulator' ? (
        <div className="transition-all duration-300">
          {renderTailoredSimulator()}
        </div>
      ) : (
        <div className="transition-all duration-300">
          <ServiceExecutionSimulation key={service.slug} service={service} />
        </div>
      )}
    </div>
  );
}