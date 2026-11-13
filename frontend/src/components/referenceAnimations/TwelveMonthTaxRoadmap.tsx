import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import './ReferenceAnimations.css';

interface MonthItem {
  ab: string;
  n: string;
  q: string;
  date: string;
  who: string;
  t: string;
  d: string;
  acts: string[];
}

const MONTHS: MonthItem[] = [
  { ab: 'Jan', n: 'January', q: 'Q1', date: 'Jan 15', who: 'Individuals · Business owners', t: "Close last year, set this year's baseline", d: "The final estimated payment for the previous tax year generally falls in mid-January. It's also the right moment to set a first projection for the year ahead.", acts: ["Confirm last year's final estimated payment", "Note expected changes in income, family or business", "Set a baseline projection for the new year"] },
  { ab: 'Feb', n: 'February', q: 'Q1', date: '', who: 'Individuals · Business owners', t: "Organise records while they're fresh", d: "Forms and statements start arriving. Organising them now supports last year's return and gives this year's planning a clean starting point.", acts: ["Gather W-2s, 1099s and brokerage statements", "Compare last year's outcome with expectations", "Flag anything that surprised you"] },
  { ab: 'Mar', n: 'March', q: 'Q1', date: 'Mar 15', who: 'Business owners', t: "Check structure and compensation", d: "Many partnership and S corporation returns are due in March for calendar-year entities — a natural moment to ask whether the current structure and owner compensation still fit.", acts: ["Review entity and compensation arrangements", "Raise classification questions early", "Check payroll and reasonable compensation"] },
  { ab: 'Apr', n: 'April', q: 'Q2', date: 'Apr 15', who: 'Individuals · Business owners', t: "First quarterly estimate", d: "Individual returns and the first estimated payment for the current year are generally due in mid-April. Last year's filed figures sharpen this year's projection.", acts: ["Review the first estimated payment", "Update the projection with the filed return", "Revisit withholding if the balance due was large"] },
  { ab: 'May', n: 'May', q: 'Q2', date: '', who: 'Individuals', t: "Check withholding", d: "If your job, income or household changed, withholding set at the start of the year may no longer fit what you're likely to owe.", acts: ["Compare year-to-date withholding with the projection", "Consider withholding adjustments where needed", "Review side income and self-employment earnings"] },
  { ab: 'Jun', n: 'June', q: 'Q2', date: 'Jun 15', who: 'Individuals · Business owners', t: "Mid-year projection", d: "The second estimated payment generally falls in mid-June. Half a year of actual figures makes the projection far more useful.", acts: ["Re-run the projection with half-year actuals", "Review the second estimated payment", "Spot issues while there's time to act"] },
  { ab: 'Jul', n: 'July', q: 'Q3', date: '', who: 'Business owners', t: "Plan purchases and growth", d: "Equipment, hiring and expansion can carry different tax consequences. Evaluate timing and treatment before committing to the transaction.", acts: ["Review planned asset and equipment purchases", "Consider hiring and multi-state implications", "Check documentation for business expenses"] },
  { ab: 'Aug', n: 'August', q: 'Q3', date: '', who: 'Individuals · Business owners', t: "Review retirement contributions", d: "Retirement plan options and contribution limits depend on the plan and your circumstances. Reviewing them mid-year leaves room to adjust.", acts: ["Review eligible retirement plan options", "Check contributions against applicable limits", "Align contributions with cash flow"] },
  { ab: 'Sep', n: 'September', q: 'Q3', date: 'Sep 15', who: 'Individuals · Business owners', t: "Q3 estimate and projection refresh", d: "The third estimated payment and many extended business returns fall in mid-September. Three quarters of data make the year-end picture clearer.", acts: ["Review the third estimated payment", "Refresh the projection", "Start the list of year-end decisions"] },
  { ab: 'Oct', n: 'October', q: 'Q4', date: 'Oct 15', who: 'Individuals · Business owners', t: "Open the year-end window", d: "Extended individual returns are generally due in mid-October. With last year closed, attention turns fully to this year's remaining decisions.", acts: ["Finalise any extended returns", "Prioritise open year-end items", "Review investment gains and losses so far"] },
  { ab: 'Nov', n: 'November', q: 'Q4', date: '', who: 'Individuals · Business owners', t: "Make year-end decisions", d: "Capital gains, asset purchases and compensation decisions are easier to evaluate while there's still time left in the year.", acts: ["Review potential gains, losses and disposals", "Evaluate qualifying asset purchases", "Confirm compensation and payroll decisions"] },
  { ab: 'Dec', n: 'December', q: 'Q4', date: 'Dec 31', who: 'Individuals · Business owners', t: "Before the year closes", d: "Many planning actions must be completed by December 31. The year-end review turns the open list into decisions.", acts: ["Complete the year-end review", "Confirm actions that must happen by Dec 31", "Prepare records for filing season"] },
];

export function TwelveMonthTaxRoadmap() {
  const currentMonthIdx = new Date().getMonth();
  const [activeMonth, setActiveMonth] = useState<number>(currentMonthIdx >= 0 && currentMonthIdx < 12 ? currentMonthIdx : 3);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveMonth((prev) => (prev + 1) % MONTHS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const cur = MONTHS[activeMonth];

  return (
    <div className="ref-anim-card" aria-label="12-Month Interactive Annual Tax Roadmap">
      <div className="ref-anim-header">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-500 dark:text-[#49E3D6]" />
          <span className="text-xs font-bold text-[#12242B] dark:text-[#F4FBFC] uppercase tracking-wider font-mono">
            Twelve Months &bull; Strategic Tax Roadmap
          </span>
        </div>
        <div className="flex items-center gap-2">
          {cur.date && (
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono font-bold border border-rose-500/20">
              Deadline: {cur.date}
            </span>
          )}
          <span className="ref-anim-badge">
            <span>{cur.q} Milestone</span>
          </span>
        </div>
      </div>

      {/* 12 Month Grid Selector */}
      <div className="ref-month-grid">
        {MONTHS.map((m, idx) => (
          <button
            key={m.ab}
            onClick={() => {
              setActiveMonth(idx);
              setIsAutoPlaying(false);
            }}
            className={`ref-month-btn ${activeMonth === idx ? 'is-active' : ''}`}
            type="button"
          >
            <div>{m.ab}</div>
            {m.date ? (
              <div className="text-[8px] opacity-75 font-mono">{m.date.split(' ')[1]}</div>
            ) : (
              <div className="text-[8px] opacity-40 font-mono">··</div>
            )}
          </button>
        ))}
      </div>

      {/* Selected Month Action Panel */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold font-mono text-emerald-600 dark:text-[#49E3D6] uppercase tracking-wider">
              {cur.n} &bull; {cur.q} Phase &bull; {cur.who}
            </span>
            <h4 className="text-base sm:text-lg font-bold text-[#12242B] dark:text-[#F4FBFC] font-serif-editorial">
              {cur.t}
            </h4>
          </div>
          {cur.date && (
            <div className="text-right">
              <span className="text-[9px] uppercase font-bold text-gray-400">IRS / State Deadline</span>
              <div className="text-xs font-mono font-bold text-rose-500">{cur.date}</div>
            </div>
          )}
        </div>

        <p className="text-xs text-[#476067] dark:text-[#A8C0C6] leading-relaxed">
          {cur.d}
        </p>

        <div className="pt-2 border-t border-[#E2EBE8] dark:border-[rgba(121,241,232,0.1)]">
          <div className="text-[9.5px] uppercase font-bold text-gray-400 mb-2 tracking-wider">
            Key Planning Milestones for {cur.n}:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {cur.acts.map((act, i) => (
              <div key={i} className="p-2 rounded-xl bg-white dark:bg-[#071C25] border border-[#DCE5E2] dark:border-gray-800 flex items-start gap-2 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-[#49E3D6] shrink-0 mt-0.5" />
                <span className="text-[11px] font-medium leading-tight text-[#12242B] dark:text-[#E2EBE8]">{act}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}