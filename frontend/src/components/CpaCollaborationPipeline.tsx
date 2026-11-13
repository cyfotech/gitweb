import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  FileCheck, 
  Cloud, 
  Send,
  Lock,
  ChevronRight
} from 'lucide-react';
import { EditableElement } from './EditableElement';
import { useAnimationSettings } from '../context/AnimationSettingsContext';

export interface CpaCollaborationContent {
  title?: string | null;
  subheading?: string | null;
  description?: string | null;
  content?: string | null;
}

interface CpaCollaborationPipelineProps {
  onRequestPilot: () => void;
  cmsContent?: CpaCollaborationContent | null;
}

interface WorkflowStage {
  id: number;
  title: string;
  shortTitle: string;
  duration: string;
  icon: React.ReactNode;
  summary: string;
  sopSteps: string[];
  techStack: string[];
  securityControls: string;
}

const STAGES: WorkflowStage[] = [
  {
    id: 1,
    title: 'Stage 01: Secure Ingestion & Cloud Sync',
    shortTitle: '01. Ingestion',
    duration: 'Hour 0–2',
    icon: <Cloud className="w-5 h-5" />,
    summary: 'Source documents, trial balances, and prior-year tax returns are ingested directly into your practice cloud or private virtual desktop.',
    sopSteps: [
      'Encrypted transfer via Drake Hosted, UltraTax SaaS, or Citrix Virtual Desktop',
      'Completeness verification against standard PBC (Provided by Client) intake checklist',
      'TIFF & PDF bookmarking and naming according to standard firm tax workpaper index',
    ],
    techStack: ['Drake Hosted', 'UltraTax CS', 'ProConnect', 'Citrix / Azure Virtual Desktop'],
    securityControls: 'SOC 2 Type II Encrypted VPN, zero local caching or file saving.',
  },
  {
    id: 2,
    title: 'Stage 02: Preparation & Workpaper Standardization',
    shortTitle: '02. Preparation',
    duration: 'Hour 2–18',
    icon: <FileText className="w-5 h-5" />,
    summary: 'Dedicated tax associates enter source data, calculate multi-state apportionments, and build lead schedules with standardized tick-marks.',
    sopSteps: [
      'Data entry for W-2, 1099, K-1s, depreciation schedules, and trial balance mapping',
      'M-1 and M-3 book-to-tax adjustment computations',
      'Self-audit pass with resolution of preliminary diagnostic warnings in tax software',
    ],
    techStack: ['QuickBooks Online', 'Xero', 'Excel PowerQuery', 'AdvanceFlow'],
    securityControls: 'Two-factor authentication and role-based folder permission isolation.',
  },
  {
    id: 3,
    title: 'Stage 03: US CPA Senior Diagnostic Audit',
    shortTitle: '03. CPA Audit',
    duration: 'Hour 18–24',
    icon: <ShieldCheck className="w-5 h-5" />,
    summary: 'A seasoned US-licensed CPA reviews every line item, verifies partner basis, tests elections (e.g., Section 179/Bonus), and clears all diagnostic gates.',
    sopSteps: [
      'Comprehensive tick-mark verification against original source PDF documentation',
      'Basis calculation checks (Form 7203) and passive activity loss limitations',
      'Drafting of review notes and direct clearance before final export',
    ],
    techStack: ['CCH ProSystem fx', 'UltraTax CS Diagnostics', 'IRS E-Services'],
    securityControls: 'Senior US CPA signature authorization gate required for progression.',
  },
  {
    id: 4,
    title: 'Stage 04: e-File Ready Return & Client Delivery',
    shortTitle: '04. Delivery',
    duration: 'Hour 24–48',
    icon: <Send className="w-5 h-5" />,
    summary: 'The completed tax return package, transmittal letter, and Form 8879 are delivered back to your firm portal ready for your final partner review and client signature.',
    sopSteps: [
      'Compilation of client presentation copy and government filing copy',
      'Form 8879 signature package ready for DocuSign or firm e-sign portal',
      'Comprehensive workpaper binder archived back to your server',
    ],
    techStack: ['SafeSend Returns', 'DocuSign', 'SmartVault', 'ShareFile'],
    securityControls: 'Automated notification and immediate audit trail lock.',
  },
];

export function CpaCollaborationPipeline({ onRequestPilot, cmsContent }: CpaCollaborationPipelineProps) {
  const { settings } = useAnimationSettings();
  const pipelineConfig = settings?.cpaCollaborationPipeline;

  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [packetProgress, setPacketProgress] = useState<number>(1);

  const displayTitle = cmsContent?.title || 'CPA collaboration in motion.';
  const displaySubheading = cmsContent?.subheading || 'CHAPTER 05 — COLLABORATION PIPELINE';
  const displayDescription = cmsContent?.description || 'How your firm collaborates with Preferred Tax: transparent, secure, and integrated directly inside your existing tax software ecosystem.';

  // Merge default stages with dynamic custom overrides
  const effectiveStages = STAGES.map((s, idx) => {
    const custom = pipelineConfig?.stages?.[idx];
    if (!custom) return s;
    return {
      ...s,
      title: custom.title || s.title,
      shortTitle: custom.shortTitle || s.shortTitle,
      duration: custom.duration || s.duration,
      summary: custom.summary || s.summary,
      securityControls: custom.securityControls || s.securityControls,
    };
  });

  // Dynamic auto-advance cycle with editable interval and pause
  useEffect(() => {
    if (pipelineConfig && pipelineConfig.autoAdvance === false) return;
    if (settings && settings.autoplay === false) return;

    const interval = pipelineConfig?.cycleIntervalMs || 6000;
    const timer = setInterval(() => {
      setPacketProgress((prev) => (prev >= effectiveStages.length ? 1 : prev + 1));
    }, interval);
    return () => clearInterval(timer);
  }, [pipelineConfig, settings, effectiveStages.length]);

  const activeStage = effectiveStages.find((s) => s.id === activeStageId) || effectiveStages[0];

  return (
    <section id="cpa-outsourcing" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFCFB] dark:bg-[#030F14] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Chapter Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)]">
          <div>
            <EditableElement
              sectionKey="cpa_pipeline"
              elementKey="subheading"
              elementType="subheading"
              label="Pipeline Subheading"
              value={displaySubheading}
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2AA499] dark:text-[#49E3D6] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#49E3D6]" />
                <span>{displaySubheading}</span>
              </div>
            </EditableElement>

            <EditableElement
              sectionKey="cpa_pipeline"
              elementKey="title"
              elementType="heading"
              label="Pipeline Main Headline"
              value={displayTitle}
            >
              <h2 className="font-serif-editorial text-3xl sm:text-5xl font-normal text-[#12242B] dark:text-[#F4FBFC] tracking-tight">
                {displayTitle}
              </h2>
            </EditableElement>
          </div>

          <EditableElement
            sectionKey="cpa_pipeline"
            elementKey="description"
            elementType="paragraph"
            label="Pipeline Narrative Description"
            value={displayDescription}
          >
            <p className="text-xs sm:text-sm text-[#476067] dark:text-[#A8C0C6] max-w-md">
              {displayDescription}
            </p>
          </EditableElement>
        </div>

        {/* Animated Document Pipeline Visualization */}
        <div className="relative mb-12 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#071C25] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)] shadow-xl">
          
          {/* Connector Line with Moving Packet */}
          <div className="relative hidden md:block mb-10 pt-4">
            <div className="h-1.5 w-full bg-[#E2EBE8] dark:bg-black/40 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-[#2AA499] to-[#49E3D6] transition-all duration-700 rounded-full"
                style={{ width: `${(activeStageId / 4) * 100}%` }}
              />
            </div>

            {/* Moving Document Packet Indicator */}
            <div
              className="absolute top-1 -translate-y-1/2 -translate-x-1/2 transition-all duration-700 z-10"
              style={{ left: `${((activeStageId - 0.5) / 4) * 100}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-[#17383F] dark:bg-[#49E3D6] text-white dark:text-[#03181E] flex items-center justify-center shadow-lg border-2 border-white dark:border-[#030F14] animate-pulse">
                <FileCheck className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Stage Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {effectiveStages.map((stage) => {
              const isActive = activeStageId === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStageId(stage.id)}
                  className={`p-4 rounded-2xl text-left transition-all duration-300 border ${
                    isActive
                      ? 'bg-[#E7F2F0] dark:bg-[#103D47]/50 border-[#2AA499] dark:border-[#49E3D6] shadow-sm'
                      : 'bg-black/[0.02] dark:bg-white/[0.02] border-[#E2EBE8] dark:border-[rgba(121,241,232,0.1)] hover:bg-black/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-mono text-[#2AA499] dark:text-[#49E3D6]">
                      {stage.shortTitle}
                    </span>
                    <span className="text-[10px] font-semibold text-[#64748B] dark:text-[#8AA3A8]">
                      {stage.duration}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#12242B] dark:text-[#F4FBFC] line-clamp-1">
                    {stage.title.split(': ')[1]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Detail Panel */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#F4F9F8] dark:bg-[#03131A] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left: Summary & SOP Checklist */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    SLA Window: {activeStage.duration}
                  </span>
                  <span className="text-xs text-[#64748B] dark:text-[#8AA3A8]">
                    Strict SOP Enforcement
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#12242B] dark:text-[#F4FBFC]">
                  {activeStage.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#476067] dark:text-[#A8C0C6] leading-relaxed">
                  {activeStage.summary}
                </p>

                {/* SOP Steps */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-[#12242B] dark:text-[#F4FBFC] block">
                    Execution Checklist:
                  </span>
                  {activeStage.sopSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#12242B] dark:text-[#F4FBFC]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Technical Integration & Security Gate */}
              <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-white dark:bg-[#071C25] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#8AA3A8] block mb-2">
                    Compatible Software Ecosystem
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeStage.techStack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 text-[#12242B] dark:text-[#F4FBFC]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2EBE8] dark:border-[rgba(121,241,232,0.1)]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2AA499] dark:text-[#49E3D6] mb-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Security Firewall</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#8AA3A8] leading-relaxed">
                    {activeStage.securityControls}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onRequestPilot}
                    className="w-full py-2.5 rounded-full text-xs font-bold bg-[#17383F] hover:bg-[#0E262B] text-white dark:bg-[#49E3D6] dark:hover:bg-[#7DF5E8] dark:text-[#03181E] transition-all flex items-center justify-center gap-2"
                  >
                    <span>Request Test Return Pilot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
