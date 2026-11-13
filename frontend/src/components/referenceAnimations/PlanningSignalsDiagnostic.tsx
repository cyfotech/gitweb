import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Compass, ArrowRight } from 'lucide-react';
import './ReferenceAnimations.css';

const CHECKS = [
  'My income changed significantly this year',
  "I'm self-employed or own a growing business",
  'I had an unexpected balance due to the IRS last year',
  "I'm planning a large capital asset purchase, property sale or stock exercise",
  'My family or filing status changed (marriage, child, multi-state move)',
  "I'm considering restructuring my business (LLC to S-Corp election)",
];

const SIGNALS = [
  {
    level: 'Routine Monitoring',
    title: 'Start with a year-end review',
    desc: 'No major risk signals detected yet. A straightforward baseline review before December 31 helps keep your filing clean and prevents surprises.',
    tone: 'emerald'
  },
  {
    level: 'Moderate Shift',
    title: 'A mid-year projection is strongly recommended',
    desc: 'One or two moving factors can shift your tax bracket or trigger unexpected underpayment penalties. A mid-year projection clarifies your safe-harbor standing.',
    tone: 'emerald'
  },
  {
    level: 'High Priority',
    title: 'Year-round proactive tax planning is essential',
    desc: 'Multiple moving parts across income and structure. Regular quarterly check-ins allow proactive adjustments to withholding, retirement ramps, and expense timing.',
    tone: 'amber'
  },
  {
    level: 'Immediate Action Needed',
    title: 'Urgent: Discovery session recommended before year-end',
    desc: 'Extensive simultaneous changes detected. The earlier our senior tax advisors evaluate your position, the more substantial deductions and structural options remain open.',
    tone: 'rose'
  }
];

export function PlanningSignalsDiagnostic() {
  const [checkedItems, setCheckedItems] = useState<boolean[]>([true, true, false, false, false, false]);

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  const count = checkedItems.filter(Boolean).length;
  const signalIdx = count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : 3;
  const activeSignal = SIGNALS[signalIdx];
  const needleRotation = -90 + (count / 6) * 180; // from -90deg to +90deg

  return (
    <div className="ref-anim-card" aria-label="Tax Planning Signals & Triggers Diagnostic">
      <div className="ref-anim-header">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-500 dark:text-[#49E3D6]" />
          <span className="text-xs font-bold text-[#12242B] dark:text-[#F4FBFC] uppercase tracking-wider font-mono">
            Diagnostic Screener &bull; Tax Need Severity
          </span>
        </div>
        <div className="ref-anim-badge">
          <span>{count} of 6 Triggers Checked</span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-lg font-bold text-[#12242B] dark:text-[#F4FBFC] font-serif-editorial">
          Which of these sound like your year?
        </h4>
        <p className="text-xs text-[#476067] dark:text-[#A8C0C6] mt-1 leading-relaxed">
          Select the life events or business changes that apply to your current tax year. Our interactive diagnostic calculates your planning urgency.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: 6 Checkbox Triggers (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          {CHECKS.map((text, idx) => {
            const isChecked = checkedItems[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                  isChecked
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-[#DCE5E2] dark:border-gray-800 bg-black/[0.02] dark:bg-white/[0.02]'
                }`}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                  isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-400'
                }`}>
                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs font-medium text-[#12242B] dark:text-[#F4FBFC]">
                  {text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right: Dynamic Gauge & Recommendation (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)] text-center">
          {/* Half-circle needle gauge */}
          <div className="relative w-44 h-24 mx-auto overflow-hidden">
            <svg viewBox="0 0 100 50" className="w-full h-full">
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-gray-200 dark:text-gray-800"
              />
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="url(#ref-gauge-grad)"
                strokeWidth="8"
                strokeDasharray="126"
                strokeDashoffset={126 - (count / 6) * 126}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
              <defs>
                <linearGradient id="ref-gauge-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
              </defs>
            </svg>
            <div
              className="absolute bottom-0 left-1/2 w-1 h-14 bg-[#12242B] dark:bg-[#49E3D6] origin-bottom transition-transform duration-700 rounded-full"
              style={{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }}
            />
          </div>

          <div className="mt-2">
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-600 dark:text-[#49E3D6]">
              {activeSignal.level}
            </span>
            <h5 className="text-sm sm:text-base font-bold text-[#12242B] dark:text-[#F4FBFC] font-serif-editorial mt-0.5">
              {activeSignal.title}
            </h5>
            <p className="text-[11.5px] text-[#476067] dark:text-[#A8C0C6] mt-1 leading-relaxed">
              {activeSignal.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}