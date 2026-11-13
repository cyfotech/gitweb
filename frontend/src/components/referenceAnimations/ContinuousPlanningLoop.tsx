import React, { useState, useEffect } from 'react';
import { RotateCcw, CheckCircle2, ArrowRight, Sparkles, Compass } from 'lucide-react';
import './ReferenceAnimations.css';

interface LoopStage {
  num: string;
  key: string;
  title: string;
  desc: string;
  outputs: string[];
}

const LOOP_STAGES: LoopStage[] = [
  {
    num: '01',
    key: 'Understand',
    title: 'Understand your situation',
    desc: "We start with what you're planning for — individual tax, business decisions, or both — and the financial shifts expected this tax year.",
    outputs: ['Goals & lifestyle changes clarified', 'Filing scope agreed up front']
  },
  {
    num: '02',
    key: 'Review',
    title: 'Review the information',
    desc: 'Prior-year returns, year-to-date income statements, and brokerage reports. Missing documents and basis items are flagged early.',
    outputs: ['Verified source documentation', 'Open deduction questions identified']
  },
  {
    num: '03',
    key: 'Project',
    title: 'Project the tax position',
    desc: 'Income, adjustments, deductions, and credits are modeled into a clear projection of potential Federal and multi-state tax positions.',
    outputs: ['Draft liability projection model', 'Safe-harbor withholding check']
  },
  {
    num: '04',
    key: 'Evaluate',
    title: 'Evaluate strategic options',
    desc: 'CapEx timing, retirement plan contributions, Section 179 expenses, and entity compensation are evaluated for optimal net financial outcome.',
    outputs: ['Scenario trade-offs compared', 'Net tax savings quantified']
  },
  {
    num: '05',
    key: 'Act',
    title: 'Agree actions and communicate',
    desc: 'You receive agreed actionable steps, estimated payment vouchers (Form 1040-ES), and critical deadline milestones.',
    outputs: ['Prioritized action checklist', 'Quarterly payment schedules']
  },
  {
    num: '06',
    key: 'Revisit',
    title: 'Revisit as the year moves',
    desc: 'Tax planning is an ongoing loop. We review quarterly financial actuals in June, September, and December to recalibrate before year-end.',
    outputs: ['Quarterly true-up memo', 'Year-end optimization lock-in']
  }
];

export function ContinuousPlanningLoop() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % LOOP_STAGES.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isPaused]);

  const cur = LOOP_STAGES[activeStep];

  return (
    <div 
      className="ref-anim-card" 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Continuous 6-Stage Tax Planning Loop"
    >
      <div className="ref-anim-header">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-emerald-500 dark:text-[#49E3D6]" />
          <span className="text-xs font-bold text-[#12242B] dark:text-[#F4FBFC] uppercase tracking-wider font-mono">
            Proactive Methodology &bull; Continuous Planning Loop
          </span>
        </div>
        <div className="ref-anim-badge">
          <span>Stage {cur.num} of 06</span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-lg font-bold text-[#12242B] dark:text-[#F4FBFC] font-serif-editorial">
          Planning isn&rsquo;t a one-time step. It&rsquo;s a continuous loop.
        </h4>
        <p className="text-xs text-[#476067] dark:text-[#A8C0C6] mt-1 leading-relaxed">
          Unlike backward-looking preparation, proactive planning evaluates decisions throughout the year so you capture opportunities before the deadline closes.
        </p>
      </div>

      {/* 6 Step Interactive Selector Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
        {LOOP_STAGES.map((st, idx) => (
          <button
            key={st.num}
            onClick={() => setActiveStep(idx)}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              activeStep === idx
                ? 'border-emerald-500 bg-emerald-500/10 shadow-sm'
                : 'border-[#DCE5E2] dark:border-gray-800 bg-black/[0.02] dark:bg-white/[0.02]'
            }`}
            type="button"
          >
            <div className="text-[10px] font-mono font-bold text-emerald-600 dark:text-[#49E3D6]">
              {st.num}
            </div>
            <div className="text-xs font-bold text-[#12242B] dark:text-[#F4FBFC] mt-0.5 truncate">
              {st.key}
            </div>
          </button>
        ))}
      </div>

      {/* Active Stage Detailed Panel */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-600 dark:text-[#49E3D6]">
              Phase {cur.num} &bull; {cur.key}
            </span>
            <h5 className="text-base sm:text-lg font-bold text-[#12242B] dark:text-[#F4FBFC] font-serif-editorial">
              {cur.title}
            </h5>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#49E3D6] font-mono font-bold">
            Loop Active
          </span>
        </div>

        <p className="text-xs text-[#476067] dark:text-[#A8C0C6] leading-relaxed">
          {cur.desc}
        </p>

        <div className="pt-2 border-t border-[#E2EBE8] dark:border-gray-800">
          <div className="text-[10px] font-bold uppercase text-gray-400 mb-1.5">
            Key Deliverables &amp; Outcomes:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {cur.outputs.map((out, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-[#12242B] dark:text-[#E2EBE8]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-[#49E3D6] shrink-0" />
                <span>{out}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}