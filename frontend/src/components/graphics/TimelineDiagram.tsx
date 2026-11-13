import React, { useState } from 'react';
import { Calendar, ArrowRight, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface QuarterSprint {
  quarter: string;
  focus: string;
  period: string;
  volume: string;
  keyDeliverables: string[];
  active?: boolean;
}

interface TimelineContent {
  quarters?: QuarterSprint[];
  autoAdvance?: boolean;
  cycleIntervalMs?: number;
  eyebrow?: string;
  heading?: string;
  description?: string;
  deliverablesHeading?: string;
  throughputLabel?: string;
  availabilityText?: string;
  slaText?: string;
}

interface TimelineDiagramProps {
  cmsContent?: {
    parsedContent?: TimelineContent | null;
  } | null;
}

const DEFAULT_QUARTERS: QuarterSprint[] = [
  {
    quarter: 'Q1 Sprint',
    period: 'January 1 – March 31',
    focus: 'Peak Form 1040 & 1065/1120-S Blitz',
    volume: '150 – 400+ returns/week',
    keyDeliverables: [
      'W-2 & 1099-NEC reconciliations',
      'S-Corp & Partnership Form 1120-S / 1065 workpapers',
      'Dual-review diagnostic signoff within 48h',
      'Form 7004 extension preparation'
    ]
  },
  {
    quarter: 'Q2 Sprint',
    period: 'April 1 – June 30',
    focus: 'C-Corp Deadline & Post-Filing Cleanups',
    volume: '100 – 250 returns/week',
    keyDeliverables: [
      'Form 1120 Corporate Tax returns',
      'State tax apportionment & franchise filings',
      'Q2 estimated quarterly tax calculations (Form 1040-ES)',
      'Delinquent bookkeeping reconciliation catch-up'
    ]
  },
  {
    quarter: 'Q3 Sprint',
    period: 'July 1 – September 30',
    focus: 'Mid-Year Planning & Extended Business Returns',
    volume: '80 – 180 returns/week',
    keyDeliverables: [
      'September 15 extended S-Corp/Partnership finalization',
      'Mid-year strategic tax advisory memos & entity restructuring',
      'R&D tax credit (Form 6765) study documentation',
      'Q3 estimated tax calculations'
    ]
  },
  {
    quarter: 'Q4 Sprint',
    period: 'October 1 – December 31',
    focus: 'October 15 Final 1040s & Year-End Tax Prep',
    volume: '120 – 300 returns/week',
    keyDeliverables: [
      'October 15 final individual extension filings',
      'Section 179 equipment purchase tax optimization',
      'Year-end tax loss harvesting & bonus depreciation audits',
      'Upcoming tax season capacity ramp-up'
    ]
  }
];

function isQuarterSprint(value: unknown): value is QuarterSprint {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const quarter = value as Record<string, unknown>;
  return typeof quarter.quarter === 'string'
    && typeof quarter.focus === 'string'
    && typeof quarter.period === 'string'
    && typeof quarter.volume === 'string'
    && Array.isArray(quarter.keyDeliverables)
    && quarter.keyDeliverables.every((item) => typeof item === 'string');
}

function getVolumeRange(volume: string): [number, number] {
  const values = volume.replace(/,/g, '').match(/\d+/g)?.map(Number) ?? [];
  const lower = values[0] ?? 0;
  return [lower, values[1] ?? lower];
}

export function TimelineDiagram({ cmsContent }: TimelineDiagramProps) {
  const content = cmsContent?.parsedContent;
  const configuredQuarters = Array.isArray(content?.quarters) ? content.quarters.filter(isQuarterSprint) : [];
  const quarters = configuredQuarters.length ? configuredQuarters : DEFAULT_QUARTERS;
  const volumeRanges = quarters.map((quarter) => getVolumeRange(quarter.volume));
  const maxVolume = Math.max(1, ...volumeRanges.map(([, upper]) => upper));
  const [activeQuarter, setActiveQuarter] = useState<number>(0);
  const [isAutomated, setIsAutomated] = useState(content?.autoAdvance ?? false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const currentIndex = activeQuarter % quarters.length;
  const current = quarters[currentIndex];

  React.useEffect(() => {
    if (!isAutomated || prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveQuarter((index) => (index + 1) % quarters.length);
    }, Math.max(500, content?.cycleIntervalMs || 4500));
    return () => window.clearInterval(timer);
  }, [content?.cycleIntervalMs, isAutomated, prefersReducedMotion, quarters.length]);

  React.useEffect(() => {
    if (typeof content?.autoAdvance === 'boolean') setIsAutomated(content.autoAdvance);
    setActiveQuarter((index) => Math.min(index, quarters.length - 1));
  }, [content?.autoAdvance, quarters.length]);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  return (
    <div className="w-full rounded-3xl p-6 sm:p-8 bg-white/70 dark:bg-[#071C25]/80 backdrop-blur-xl border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)] shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#E4F0EE] dark:bg-[rgba(44,207,197,0.12)] text-[#315F69] dark:text-[#7DF5E8] mb-1">
            <Calendar className="w-3 h-3" />
            <span>{content?.eyebrow || 'Operational Capacity Planning'}</span>
          </div>
          <h3 className="text-xl font-bold text-[#12242B] dark:text-[#F4FBFC]">
            {content?.heading || 'Annual Tax Production & Sprint Roadmap'}
          </h3>
          <p className="text-xs text-[#526168] dark:text-[#A8C0C6] mt-0.5">
            {content?.description || 'How our dedicated offshore teams ramp up seamlessly across the four fiscal quarterly cycles.'}
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)]">
          {quarters.map((q, idx) => (
            <button
              key={q.quarter}
              onClick={() => setActiveQuarter(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                currentIndex === idx
                  ? 'bg-[#17383F] text-white dark:bg-[#49E3D6] dark:text-[#03181E] shadow-sm'
                  : 'text-[#526168] dark:text-[#A8C0C6] hover:text-[#12242B] dark:hover:text-[#F4FBFC]'
              }`}
            >
              Q{idx + 1}
            </button>
          ))}
        </div>
      </div>

      <div
        className="cpa-workload-chart"
        role="img"
        aria-label={`Weekly return volume range by quarter: ${quarters.map((quarter) => `${quarter.quarter}, ${quarter.volume}`).join('; ')}`}
      >
        {quarters.map((quarter, index) => {
          const [lower, upper] = volumeRanges[index];
          const lowerPosition = (lower / maxVolume) * 100;
          const upperPosition = (upper / maxVolume) * 100;

          return (
            <div
              className={`cpa-workload-chart__quarter${currentIndex === index ? ' is-active' : ''}`}
              key={quarter.quarter}
              aria-label={`${quarter.quarter}: ${quarter.volume}`}
            >
              <span className="cpa-workload-chart__plot" aria-hidden="true">
                <i
                  className="cpa-workload-chart__range"
                  style={{
                    bottom: `${lowerPosition}%`,
                    height: `${Math.max(upperPosition - lowerPosition, 2)}%`,
                    animationDelay: `${index * 90}ms`,
                  }}
                />
                <i className="cpa-workload-chart__limit" style={{ bottom: `${upperPosition}%` }} />
                <i className="cpa-workload-chart__limit cpa-workload-chart__limit--lower" style={{ bottom: `${lowerPosition}%` }} />
              </span>
              <strong>Q{index + 1}</strong>
              <small>{quarter.volume}</small>
            </div>
          );
        })}
      </div>

      {/* Selected Quarter Detailed View */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 p-5 rounded-2xl bg-[#E4F0EE]/50 dark:bg-[rgba(44,207,197,0.08)] border border-[#315F69]/20 dark:border-[#49E3D6]/30 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider bg-[#315F69] text-white dark:bg-[#49E3D6] dark:text-[#03181E]">
              {current.quarter}
            </span>
            <h4 className="text-lg font-bold text-[#12242B] dark:text-[#F4FBFC] mt-3">
              {current.focus}
            </h4>
            <div className="text-xs text-[#526168] dark:text-[#A8C0C6] mt-1 flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>{current.period}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10">
            <span className="text-[11px] font-mono text-[#526168] dark:text-[#A8C0C6] block">
              {content?.throughputLabel || 'Typical Firm Processing Throughput:'}
            </span>
            <span className="text-sm font-bold font-mono text-[#315F69] dark:text-[#49E3D6]">
              {current.volume}
            </span>
          </div>
        </div>

        <div className="md:col-span-2 p-5 rounded-2xl bg-white/40 dark:bg-[#071C25]/40 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)]">
          <h5 className="text-xs font-mono uppercase tracking-wider text-[#526168] dark:text-[#A8C0C6] mb-3">
            {content?.deliverablesHeading || 'Key Diagnostic & Production Deliverables'}
          </h5>
          <div className="space-y-2.5">
            {current.keyDeliverables.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#12242B] dark:text-[#F4FBFC]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#49E3D6] shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] text-[#526168] dark:text-[#A8C0C6]">
            <span>{content?.availabilityText || 'Staffing Availability: Guaranteed 2-week advance capacity lock'}</span>
            <span className="font-mono text-emerald-600 dark:text-[#49E3D6]">{content?.slaText || 'SLA: 48h Turnaround'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
