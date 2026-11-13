import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Calculator,
  Sparkles,
  Users,
  Video,
  FileCheck,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Calendar,
  Layers,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import './ServiceHeroAnimations.css';

/* ==========================================================================
   1. INDIVIDUAL TAX PREPARATION HERO ANIMATION
   Concept: Automated tax workflow with document intake, deduction optimization,
   digital Form 1040 transfer, calculation update, and e-file completion status.
   ========================================================================== */
export function IndividualTaxPrepHero() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 3200);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div 
      className="sha-terminal" 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Automated Tax Preparation Workflow Visualizer"
    >
      <div className="sha-header">
        <div className="sha-header-brand">
          <span className="sha-header-gem" />
          <span>Form 1040 Digital Preparation</span>
        </div>
        <div className="sha-header-actions">
          <div className="sha-status-pill">
            <span className="sha-status-dot" />
            <span>{['Intake', 'Deductions', 'Calc Engine', 'E-File Ready'][step]}</span>
          </div>
          <div className="sha-step-indicators">
            {[0, 1, 2, 3].map((s) => (
              <span
                key={s}
                onClick={() => setStep(s)}
                className={`sha-step-dot ${step === s ? 'active' : ''}`}
                title={`Jump to Step ${s + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="sha-itp-grid">
        {/* Left: Document Intake Stack */}
        <div className="sha-doc-queue">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Verified Source Records</span>
            <span className="text-emerald-500 font-mono">3 / 3</span>
          </div>

          {[
            { type: 'W-2', name: 'TechCorp Salary', amount: '$94,200', active: step >= 0 },
            { type: '1099-INT', name: 'Chase Yield', amount: '$1,850', active: step >= 1 },
            { type: '1098', name: 'Mortgage Interest', amount: '$12,400', active: step >= 2 },
          ].map((doc, idx) => (
            <div 
              key={doc.type} 
              className={`sha-doc-card ${step === idx ? 'is-processing' : ''}`}
            >
              <span className="sha-doc-badge">{doc.type}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{doc.name}</div>
                <div className="text-[8.5px] text-gray-400 font-mono">{doc.amount}</div>
              </div>
              {step > idx ? (
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
              ) : step === idx ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-gray-400/40 shrink-0" />
              )}
            </div>
          ))}

          {/* Optimized Deduction Callout */}
          <div className="mt-2 p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-[9px] flex items-center gap-2">
            <Sparkles size={14} className="text-emerald-500 shrink-0" />
            <span>
              <strong>Deduction Strategy:</strong> Standard vs Itemized ($16,250 optimized).
            </span>
          </div>
        </div>

        {/* Right: Digital Form 1040 Sheet */}
        <div className="sha-1040-sheet">
          <div className="sha-sheet-header">
            <span>IRS FORM 1040 &bull; U.S. INDIVIDUAL</span>
            <span className="font-mono text-emerald-500">TY 2025</span>
          </div>

          <div className="sha-calc-line">
            <span>Line 1z: Total Wages & Tips</span>
            <span className="font-mono font-bold">$94,200</span>
          </div>
          <div className="sha-calc-line">
            <span>Line 11: Adjusted Gross Income (AGI)</span>
            <span className="font-mono font-bold">$96,050</span>
          </div>
          <div className={`sha-calc-line ${step >= 1 ? 'highlight' : ''}`}>
            <span>Line 12: Itemized Deduction Schedule A</span>
            <span className="font-mono">-$16,250</span>
          </div>
          <div className="sha-calc-line">
            <span>Line 15: Taxable Income</span>
            <span className="font-mono font-bold">$79,800</span>
          </div>
          <div className={`sha-calc-line ${step >= 2 ? 'highlight' : ''}`}>
            <span>Line 24: Total Tax Liability</span>
            <span className="font-mono">$8,980</span>
          </div>

          {/* Refund Callout */}
          <div className="sha-refund-box">
            <div>
              <div className="text-[8.5px] uppercase tracking-wider font-bold text-gray-500">
                Calculated Federal Outcome
              </div>
              <div className="text-sm font-bold font-serif text-emerald-600 dark:text-emerald-400">
                Federal Refund: $3,420
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[9px] font-bold">
              <CheckCircle2 size={12} />
              <span>E-File Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. FAMILY TAX PLANNING HERO ANIMATION
   Concept: Family financial profile with interactive planning categories,
   multi-year projection chart, and connected decision tree.
   ========================================================================== */
export function FamilyTaxPlanningHero() {
  const [activePlan, setActivePlan] = useState<'standard' | 'optimized'>('optimized');
  const [yearIndex, setYearIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setYearIndex((y) => (y + 1) % 3);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const years = ['2025 Planning', '2026 Ramp', '2027 College'];

  return (
    <div className="sha-terminal" aria-label="Family Tax Planning Visualizer">
      <div className="sha-header">
        <div className="sha-header-brand">
          <span className="sha-header-gem" />
          <span>Family Wealth & Tax Architecture</span>
        </div>
        <div className="sha-header-actions">
          <div className="flex rounded-full bg-black/5 dark:bg-white/5 p-0.5 border border-emerald-500/20 text-[9px] font-bold">
            <button
              onClick={() => setActivePlan('standard')}
              className={`px-2.5 py-0.5 rounded-full transition-all ${
                activePlan === 'standard' ? 'bg-white dark:bg-black shadow-xs text-gray-700 dark:text-gray-200' : 'text-gray-400'
              }`}
            >
              Baseline
            </button>
            <button
              onClick={() => setActivePlan('optimized')}
              className={`px-2.5 py-0.5 rounded-full transition-all ${
                activePlan === 'optimized' ? 'bg-emerald-500 text-white shadow-xs' : 'text-gray-400'
              }`}
            >
              Tax Optimized
            </button>
          </div>
        </div>
      </div>

      {/* Central Family Profile */}
      <div className="sha-ftp-profile">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
            <Users size={16} />
          </div>
          <div>
            <div className="text-[11px] font-bold">Miller Family Household (MFJ)</div>
            <div className="text-[8.5px] text-gray-500">2 Dependent Children &bull; W-2 &amp; Equity Income</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[8.5px] uppercase font-bold text-gray-400">Target Bracket</div>
          <div className="text-xs font-bold font-mono text-emerald-500">22% Bracket Window</div>
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="sha-ftp-pillars">
        <div className="sha-pillar-box">
          <div className="text-[8px] uppercase tracking-wider text-gray-400 font-bold">Child Tax Credit</div>
          <div className="text-xs font-bold font-mono">$4,000</div>
          <div className="text-[8px] text-emerald-500 font-medium">$2,000 / dependent fully utilized</div>
        </div>

        <div className="sha-pillar-box">
          <div className="text-[8px] uppercase tracking-wider text-gray-400 font-bold">529 College Plan</div>
          <div className="text-xs font-bold font-mono">$15,000/yr</div>
          <div className="text-[8px] text-emerald-500 font-medium">State tax deductible growth</div>
        </div>

        <div className="sha-pillar-box">
          <div className="text-[8px] uppercase tracking-wider text-gray-400 font-bold">HSA &amp; FSA Shelter</div>
          <div className="text-xs font-bold font-mono">$8,300</div>
          <div className="text-[8px] text-emerald-500 font-medium">Triple-tax-advantaged shield</div>
        </div>
      </div>

      {/* Interactive Planning Timeline */}
      <div className="sha-timeline-bar">
        <div className="flex items-center gap-2">
          <Calendar size={13} className="text-emerald-500" />
          <span className="font-bold">Horizon:</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{years[yearIndex]}</span>
        </div>
        <div className="text-[9px] text-gray-500">
          Estimated 3-Yr Tax Shield: <strong className="text-emerald-500 font-mono">+$24,800</strong>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. PERSONAL TAX CONSULTATION HERO ANIMATION
   Concept: Virtual consultation terminal with client profile, document review,
   advisory stages progressing, and actionable personal summary.
   ========================================================================== */
export function PersonalTaxConsultationHero() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((p) => (p + 1) % 4);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const stages = [
    { title: 'Discovery & Intake', detail: 'Multi-State Residency & Stock Grants' },
    { title: 'Tax Nexus Analysis', detail: 'CA vs WA Sourcing Evaluation' },
    { title: 'Strategy Formation', detail: 'Capital Gains & 83(b) Timing' },
    { title: 'Action Plan Ready', detail: 'Delivered in Client Portal' },
  ];

  return (
    <div className="sha-terminal" aria-label="Virtual Tax Consultation Dashboard">
      <div className="sha-header">
        <div className="sha-header-brand">
          <span className="sha-header-gem" />
          <span>Private Advisory Session</span>
        </div>
        <div className="sha-header-actions">
          <div className="sha-status-pill">
            <span className="sha-status-dot" />
            <span>Consultant Active</span>
          </div>
        </div>
      </div>

      <div className="sha-ptc-desk">
        {/* Virtual Call Box */}
        <div className="sha-call-box">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold border border-emerald-500/20">
                <Video size={13} />
              </div>
              <div>
                <div className="text-[10px] font-bold">Senior Tax Strategist (EA)</div>
                <div className="text-[8px] text-gray-500">1-on-1 Dedicated Session</div>
              </div>
            </div>
            <span className="text-[8px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-mono">
              Live
            </span>
          </div>

          <div className="sha-sound-wave" title="Audio waveform">
            <i style={{ animationDelay: '0s' }} />
            <i style={{ animationDelay: '0.2s' }} />
            <i style={{ animationDelay: '0.4s' }} />
            <i style={{ animationDelay: '0.1s' }} />
            <i style={{ animationDelay: '0.3s' }} />
            <i style={{ animationDelay: '0.5s' }} />
            <i style={{ animationDelay: '0.2s' }} />
          </div>

          <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-emerald-500/10 text-[9px] text-gray-500">
            &ldquo;We will structure your multi-state remote withholding and optimize your equity vesting schedule before year-end.&rdquo;
          </div>
        </div>

        {/* Advisory Roadmap */}
        <div className="flex flex-col gap-2 justify-between">
          <div className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">
            Consultation Milestones
          </div>

          <div className="sha-roadmap-list">
            {stages.map((st, i) => (
              <div 
                key={st.title} 
                className={`sha-roadmap-item transition-all ${
                  phase === i ? 'border-emerald-500 bg-emerald-500/10 font-bold' : ''
                }`}
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono ${
                  phase >= i ? 'bg-emerald-500 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-500'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-[9.5px]">{st.title}</div>
                  <div className="text-[8px] text-gray-400 truncate">{st.detail}</div>
                </div>
                {phase > i && <CheckCircle2 size={12} className="text-emerald-500" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   4. IRS ASSISTANCE HERO ANIMATION
   Concept: IRS case dashboard with notice tracking, supporting evidence review,
   timeline progress, and resolution stages (without guaranteed outcome).
   ========================================================================== */
export function IrsAssistanceHero() {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((s) => (s % 4) + 1);
    }, 3400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="sha-terminal" aria-label="IRS Case Assistance Dashboard">
      <div className="sha-header">
        <div className="sha-header-brand">
          <span className="sha-header-gem" />
          <span>IRS Representation &amp; Defense</span>
        </div>
        <div className="sha-header-actions">
          <div className="sha-status-pill">
            <span className="sha-status-dot" />
            <span>Form 2848 Power of Attorney</span>
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="sha-irs-banner">
        <AlertCircle size={16} className="text-rose-500 shrink-0" />
        <div className="flex-1">
          <div className="font-bold text-rose-500">IRS Notice Review &bull; CP2000 Matching</div>
          <div className="text-[8.5px] text-gray-500">Proposed Discrepancy: Brokerage 1099-B Cost Basis Missing</div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500 font-mono text-[9px] font-bold">
          Active Case
        </span>
      </div>

      {/* 4 Resolution Stages */}
      <div className="sha-irs-phases">
        {[
          { num: '01', label: 'Transcript Pull', sub: 'Wage & Income' },
          { num: '02', label: 'Basis Audit', sub: 'Schedule D Tie-out' },
          { num: '03', label: 'Rebuttal File', sub: 'IRS PPS Priority' },
          { num: '04', label: 'Resolution Status', sub: 'Penalty Abatement' },
        ].map((ph, idx) => (
          <div
            key={ph.num}
            onClick={() => setActiveStep(idx + 1)}
            className={`sha-phase-step cursor-pointer transition-all ${
              activeStep === idx + 1 ? 'active' : ''
            }`}
          >
            <span className="font-mono text-emerald-500 font-bold">{ph.num}</span>
            <span className="truncate">{ph.label}</span>
            <span className="text-[7.5px] text-gray-400 truncate">{ph.sub}</span>
          </div>
        ))}
      </div>

      {/* Evidence Verification Checklist */}
      <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-emerald-500/15 flex items-center justify-between text-[9px]">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>Circular 230 Licensed Practitioner Representation</span>
        </div>
        <span className="text-emerald-500 font-bold flex items-center gap-1 font-mono">
          <CheckCircle2 size={12} /> Case Dossier Verified
        </span>
      </div>
    </div>
  );
}
