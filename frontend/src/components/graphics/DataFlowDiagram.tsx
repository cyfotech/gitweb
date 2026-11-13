import React, { useState } from 'react';
import { ArrowRight, Lock } from 'lucide-react';

interface CmsStage {
  id?: string;
  name: string;
  subtext: string;
  security: string;
}

interface DataFlowContent {
  title?: string;
  subheading?: string;
  description?: string;
  stages?: CmsStage[];
  metrics?: Array<{ label: string; value: string }>;
}

interface DataFlowDiagramProps {
  cmsContent?: {
    title?: string | null;
    subheading?: string | null;
    description?: string | null;
    parsedContent?: DataFlowContent | null;
  } | null;
}

const ENQUIRY_ROUTES = [
  { id: 'tax', code: 'TX', label: 'Tax preparation', team: 'Tax preparation team', top: '18.75%', path: 'tax' },
  { id: 'books', code: 'BK', label: 'Bookkeeping & accounting', team: 'Books & accounting team', top: '50%', path: 'books' },
  { id: 'payroll', code: 'PR', label: 'Payroll processing', team: 'Payroll team', top: '81.25%', path: 'payroll' },
];

function isCmsStage(value: unknown): value is CmsStage {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const stage = value as Record<string, unknown>;
  return typeof stage.name === 'string'
    && typeof stage.subtext === 'string'
    && typeof stage.security === 'string';
}

export function DataFlowDiagram({ cmsContent }: DataFlowDiagramProps) {
  const cms = cmsContent?.parsedContent;
  const configuredStages = Array.isArray(cms?.stages) ? cms.stages.filter(isCmsStage) : [];
  const metrics = Array.isArray(cms?.metrics)
    ? cms.metrics.filter((metric) => typeof metric?.label === 'string' && typeof metric?.value === 'string').slice(0, 4)
    : [];
  const routes = configuredStages.length >= 3
    ? configuredStages.slice(0, 3).map((stage, index) => ({
      ...ENQUIRY_ROUTES[index],
      label: stage.name,
      team: stage.subtext,
    }))
    : ENQUIRY_ROUTES;
  const [selectedRouteId, setSelectedRouteId] = useState(routes[0].id);
  const selectedRoute = routes.find((route) => route.id === selectedRouteId) ?? routes[0];

  return (
    <div className="cpa-enquiry-routing w-full rounded-3xl p-6 sm:p-8 bg-white/70 dark:bg-[#071C25]/80 backdrop-blur-xl border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)] shadow-xl">
      <div className="pb-6 border-b border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#E4F0EE] dark:bg-[rgba(44,207,197,0.12)] text-[#315F69] dark:text-[#7DF5E8] mb-1">
          <Lock className="w-3 h-3" aria-hidden="true" />
          <span>{cmsContent?.subheading || 'Enquiry routing'}</span>
        </div>
        <h3 className="text-xl font-bold text-[#12242B] dark:text-[#F4FBFC]">
          {cmsContent?.title || 'Your enquiry, routed to the right team'}
        </h3>
        <p className="text-xs text-[#526168] dark:text-[#A8C0C6] mt-0.5">
          {cmsContent?.description || 'Choose a service area to see which CPA team will receive your request.'}
        </p>
      </div>

      <div className="cpa-enquiry-routing__canvas">
        <div className="cpa-enquiry-routing__map" role="group" aria-label="Choose a service to route your enquiry">
          <svg
            className="cpa-enquiry-routing__paths"
            viewBox="0 0 560 480"
            fill="none"
            aria-hidden="true"
          >
            <path d="M 120 240 C 230 240, 220 90, 330 90" className="cpa-enquiry-routing__base-path" />
            <path d="M 120 240 L 330 240" className="cpa-enquiry-routing__base-path" />
            <path d="M 120 240 C 230 240, 220 390, 330 390" className="cpa-enquiry-routing__base-path" />
            <path d="M 120 240 C 230 240, 220 90, 330 90" className="cpa-enquiry-routing__flow-path" />
            <path d="M 120 240 L 330 240" className="cpa-enquiry-routing__flow-path" />
            <path d="M 120 240 C 230 240, 220 390, 330 390" className="cpa-enquiry-routing__flow-path" />
          </svg>

          <span className="cpa-enquiry-routing__token cpa-enquiry-routing__token--tax" aria-hidden="true" />
          <span className="cpa-enquiry-routing__token cpa-enquiry-routing__token--books" aria-hidden="true" />
          <span className="cpa-enquiry-routing__token cpa-enquiry-routing__token--payroll" aria-hidden="true" />

          <div className="cpa-enquiry-routing__source">
            <span className="cpa-enquiry-routing__ring" aria-hidden="true" />
            <span className="cpa-enquiry-routing__ring cpa-enquiry-routing__ring--delayed" aria-hidden="true" />
            <span className="cpa-enquiry-routing__source-core">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16v12H5.2L4 17.2V4Z" />
                <path d="M8 9h8M8 12h5" />
              </svg>
              <span>YOUR ENQUIRY</span>
            </span>
          </div>

          {routes.map((route) => (
            <button
              type="button"
              key={route.id}
              className={`cpa-enquiry-routing__desk cpa-enquiry-routing__desk--${route.path}${route.id === selectedRoute.id ? ' is-selected' : ''}`}
              style={{ top: route.top }}
              aria-pressed={route.id === selectedRoute.id}
              onClick={() => setSelectedRouteId(route.id)}
            >
              <span className="cpa-enquiry-routing__desk-code">{route.code}</span>
              <span className="cpa-enquiry-routing__desk-copy">
                <strong>{route.label}</strong>
                <small>{route.team}</small>
              </span>
              <ArrowRight className="cpa-enquiry-routing__desk-arrow" aria-hidden="true" />
            </button>
          ))}

          <p className="cpa-enquiry-routing__caption">PICK A DESK TO SEE HOW WE HELP ↗</p>
        </div>
      </div>

      <p className="cpa-enquiry-routing__selection" aria-live="polite">
        Selected route: <strong>{selectedRoute.team}</strong>
      </p>

      {metrics.length > 0 && (
        <div className="mt-6 pt-5 border-t border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {metrics.map((metric, index) => (
            <div key={`${metric.label}-${index}`} className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5">
              <div className="text-xs font-mono text-[#526168] dark:text-[#A8C0C6]">{metric.label}</div>
              <div className="text-base font-bold text-[#12242B] dark:text-[#F4FBFC] mt-0.5">{metric.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
