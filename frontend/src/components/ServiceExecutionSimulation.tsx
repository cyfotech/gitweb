import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Activity,
  ArrowUpRight,
  BookOpenCheck,
  Calculator,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  ClipboardCheck,
  FileCheck2,
  FileInput,
  Files,
  Landmark,
  Pause,
  Play,
  RotateCcw,
  ScanSearch,
  Send,
  ShieldCheck,
  UserRound,
  Workflow,
  type LucideIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ServiceItem, ServiceWorkflowStep } from '../data/services';
import { settingsApi } from '../api/settings';
import { defaultExecutionMapConfig, ExecutionMapConfig } from '../admin/pages/ExecutionMapManager';
import './ServiceExecutionSimulation.css';

interface ServiceExecutionSimulationProps {
  service: ServiceItem;
}

const STAGE_ICONS: LucideIcon[] = [
  FileInput,
  Files,
  Workflow,
  Calculator,
  ShieldCheck,
  Send
];

function getStageIcon(stage: ServiceWorkflowStep, index: number): LucideIcon {
  const text = `${stage.title} ${stage.description}`.toLowerCase();
  if (/client|onboard|profile|consult|discovery/.test(text)) return UserRound;
  if (/collect|intake|upload|document|record|receive/.test(text)) return FileInput;
  if (/review|verify|audit|quality|compliance|check/.test(text)) return ClipboardCheck;
  if (/calculat|model|analy|deduction|credit|tax/.test(text)) return Calculator;
  if (/reconcil|ledger|book|account|journal|balance/.test(text)) return BookOpenCheck;
  if (/file|deliver|submit|transmit|final|response|send/.test(text)) return FileCheck2;
  if (/notice|irs|authority|regulat/.test(text)) return Landmark;
  if (/scan|categor|classif|match/.test(text)) return ScanSearch;
  if (/approv|sign/.test(text)) return CircleCheck;
  return STAGE_ICONS[index % STAGE_ICONS.length];
}

function getStageStatus(index: number, activeIndex: number) {
  if (index < activeIndex) return 'completed';
  if (index === activeIndex) return 'in-progress';
  return 'pending';
}

export function ServiceExecutionSimulation({ service }: ServiceExecutionSimulationProps) {
  const [mapConfig, setMapConfig] = useState<ExecutionMapConfig>(defaultExecutionMapConfig);

  useEffect(() => {
    settingsApi.getAll()
      .then((res) => {
        if (res && res.execution_map_config) {
          setMapConfig({ ...defaultExecutionMapConfig, ...res.execution_map_config });
        }
      })
      .catch(() => {});
  }, []);

  // If service has its own execution stages, use them; otherwise, fallback to the globally managed execution map stages
  const configuredStages: ServiceWorkflowStep[] = (mapConfig.stages && mapConfig.stages.length > 0)
    ? mapConfig.stages.map((st) => ({
        step: st.step,
        title: st.title,
        description: st.description,
        deliverable: st.checkpointDesc || st.deliverable || 'Standard Deliverable',
      }))
    : [];

  const stages = service.executionStages ?? (configuredStages.length > 0 ? configuredStages : (service.workflow ?? []));
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const stageCount = stages.length;
  const activeStage = stages[activeIndex];
  const circumference = 2 * Math.PI * 39;
  const progressLength = stageCount ? circumference * ((activeIndex + 1) / stageCount) : 0;
  const stageProgress = stageCount ? (activeIndex + 1) / stageCount : 0;

  useEffect(() => {
    if (prefersReducedMotion) setIsPlaying(false);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isPlaying || stageCount < 2 || !mapConfig.autoplay) return;
    const intervalMs = mapConfig.cycleIntervalMs || 4200;
    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % stageCount);
    }, intervalMs);
    return () => window.clearTimeout(timer);
  }, [activeIndex, isPlaying, stageCount, mapConfig.autoplay, mapConfig.cycleIntervalMs]);

  const moveTo = (index: number) => {
    if (!stageCount) return;
    setActiveIndex((index + stageCount) % stageCount);
  };

  if (!activeStage) {
    return (
      <div className="service-execution service-execution--empty" role="status">
        <div className="service-execution__empty-mark"><Workflow aria-hidden="true" /></div>
        <div>
          <strong>Workflow details are being prepared</strong>
          <p>Execution stages for {service.name} will appear here when available.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="service-execution"
      data-playing={isPlaying}
      data-reduced-motion={prefersReducedMotion || undefined}
    >
      <div className="service-execution__canvas">
        <div className="service-execution__map-heading">
          <span className="service-execution__overline">Execution map</span>
          <span className="service-execution__map-count">
            {String(activeIndex + 1).padStart(2, '0')}
            <span> / </span>
            {String(stageCount).padStart(2, '0')}
          </span>
        </div>

        <div
          className="service-execution__orbit"
          role="group"
          aria-label="Select an execution stage"
          style={{ '--stage-count': stageCount } as React.CSSProperties}
        >
          <svg
            className="service-execution__routes"
            viewBox="0 0 100 100"
            aria-hidden="true"
            focusable="false"
          >
            <circle className="service-execution__route-track" cx="50" cy="50" r="39" />
            <circle
              className="service-execution__route-progress"
              cx="50"
              cy="50"
              r="39"
              style={{ strokeDasharray: `${progressLength} ${circumference}` }}
            />
            <circle className="service-execution__hub-track" cx="50" cy="50" r="16.5" />
            <circle
              className="service-execution__hub-progress"
              cx="50"
              cy="50"
              r="16.5"
              style={{
                strokeDasharray: `${2 * Math.PI * 16.5 * stageProgress} ${2 * Math.PI * 16.5}`
              }}
            />
          </svg>

          <div className="service-execution__core" aria-hidden="true">
            <Activity className="service-execution__core-icon" />
            <strong>{String(activeIndex + 1).padStart(2, '0')}</strong>
            <span>of {String(stageCount).padStart(2, '0')}</span>
          </div>

          {stages.map((stage, index) => {
            const angle = (index / stageCount) * Math.PI * 2 - Math.PI / 2;
            const Icon = getStageIcon(stage, index);
            const status = getStageStatus(index, activeIndex);

            return (
              <button
                type="button"
                key={`${stage.step}-${stage.title}`}
                className="service-execution__node"
                data-status={status}
                data-active={index === activeIndex}
                aria-label={`Stage ${index + 1}: ${stage.title}. ${status.replace('-', ' ')}.`}
                aria-pressed={index === activeIndex}
                onClick={() => moveTo(index)}
                style={{
                  left: `${50 + 39 * Math.cos(angle)}%`,
                  top: `${50 + 39 * Math.sin(angle)}%`
                }}
              >
                <span className="service-execution__node-icon">
                  {status === 'completed' ? <Check aria-hidden="true" /> : <Icon aria-hidden="true" />}
                </span>
                <span className="service-execution__node-number">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </button>
            );
          })}
        </div>

        <div className="service-execution__map-caption">
          <span>Illustrative sequence · simulated state</span>
          <span className="service-execution__legend" aria-label="Stage state legend">
            <span><i data-state="completed" />Complete</span>
            <span><i data-state="current" />Current</span>
            <span><i data-state="pending" />Up next</span>
          </span>
        </div>
      </div>

      <div className="service-execution__details" aria-live="polite" aria-atomic="true">
        <div className="service-execution__detail-topline">
          <span className="service-execution__phase">
            Phase {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <span className={`service-execution__state service-execution__state--${getStageStatus(activeIndex, activeIndex)}`}>
            <i aria-hidden="true" />
            In this walkthrough
          </span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="service-execution__stage-copy"
            key={`${service.slug}-${activeIndex}`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.24, ease: 'easeOut' }}
          >
            <span className="service-execution__stage-kicker">
              {service.name}
            </span>
            <h4>{activeStage.title}</h4>
            <p>{activeStage.description}</p>
            <div className="service-execution__deliverable">
              <span className="service-execution__deliverable-mark">
                <ArrowUpRight aria-hidden="true" />
              </span>
              <span>
                <small>Stage checkpoint</small>
                <strong>{activeStage.deliverable}</strong>
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="service-execution__controls">
          <span className="service-execution__step-count">
            {String(activeIndex + 1).padStart(2, '0')}
            <span> of </span>
            {String(stageCount).padStart(2, '0')} stages
          </span>
          <div className="service-execution__buttons">
            <button
              type="button"
              className="service-execution__control"
              onClick={() => moveTo(activeIndex - 1)}
              aria-label="Previous stage"
              title="Previous stage"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className="service-execution__control service-execution__control--play"
              onClick={() => setIsPlaying((playing) => !playing)}
              aria-label={isPlaying ? 'Pause autoplay' : 'Play autoplay'}
              aria-pressed={isPlaying}
              title={isPlaying ? 'Pause autoplay' : 'Play autoplay'}
            >
              {isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
            </button>
            <button
              type="button"
              className="service-execution__control"
              onClick={() => moveTo(activeIndex + 1)}
              aria-label="Next stage"
              title="Next stage"
            >
              <ChevronRight aria-hidden="true" />
            </button>
            <button
              type="button"
              className="service-execution__control service-execution__control--reset"
              onClick={() => moveTo(0)}
              aria-label="Restart walkthrough"
              title="Restart walkthrough"
            >
              <RotateCcw aria-hidden="true" />
            </button>
          </div>
        </div>
        <span className="service-execution__sr-only" aria-live="polite">
          {isPlaying ? 'Autoplay on' : 'Autoplay paused'}.
          Stage {activeIndex + 1} of {stageCount}: {activeStage.title}.
        </span>
      </div>
    </div>
  );
}
