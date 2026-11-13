import React, { useState } from 'react';
import { 
  ArrowRight, 
  Play, 
  Check, 
  Clock, 
  RefreshCw, 
  FolderLock, 
  ShieldCheck, 
  TrendingUp, 
  BarChart2, 
  ChevronDown,
  Lock,
  FileCheck
} from 'lucide-react';

interface HeroSectionProps {
  onOpenConsultation: (category?: string, service?: string) => void;
  onWatchVideo?: () => void;
}

export function HeroSection({ onOpenConsultation, onWatchVideo }: HeroSectionProps) {
  const [activeTab, setActiveTab] = useState<'Revenue' | 'Expenses' | 'Cash Flow'>('Revenue');
  const [selectedYear, setSelectedYear] = useState('This Year');

  // Interactive chart data based on active tab
  const chartData = activeTab === 'Revenue'
    ? [38, 55, 42, 68, 50, 75, 62, 85, 78, 92, 88, 96]
    : activeTab === 'Expenses'
    ? [25, 30, 28, 35, 32, 40, 36, 44, 42, 48, 45, 50]
    : [20, 35, 25, 45, 30, 50, 40, 60, 52, 68, 60, 76];

  const maxVal = Math.max(...chartData, 100);

  return (
    <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#FAFCFB] dark:bg-[#030F14] transition-colors duration-300">
      
      {/* Background ambient radial glow in dark mode */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#315F69]/10 to-[#2CCFC5]/15 dark:from-[#2CCFC5]/12 dark:to-[#79F1E8]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Far Left Vertical Scroll Indicator (matches screenshot, cleanly in outer gutter) */}
      <div className="hidden 2xl:flex fixed left-4 2xl:left-6 top-1/2 -translate-y-1/2 flex-col items-center gap-3 text-[10px] tracking-widest text-[#476067] dark:text-[#7DF5E8] z-20 select-none pointer-events-none opacity-80">
        <span className="w-1.5 h-1.5 rounded-full bg-[#315F69] dark:bg-[#49E3D6]" />
        <span className="w-[1px] h-10 bg-gradient-to-b from-[#315F69] dark:from-[#49E3D6] to-transparent" />
        <span className="[writing-mode:vertical-lr] font-mono font-semibold tracking-[0.2em]">
          SCROLL
        </span>
        <span className="text-xs">↓</span>
      </div>

      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          
          {/* Left Column: Eyebrow, Editorial Typography & CTAs */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-start text-left">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#E7F2F0] dark:bg-[rgba(44,207,197,0.14)] text-[#1E6169] dark:text-[#7DF5E8] border border-[#D5E5E1] dark:border-[rgba(121,241,232,0.25)] mb-6">
              <span>YOUR TRUSTED TAX & ACCOUNTING PARTNER</span>
            </div>

            {/* Editorial Serif Heading */}
            <h1 className="font-serif-editorial text-4xl sm:text-5xl lg:text-[58px] xl:text-[62px] font-normal tracking-tight text-[#12242B] dark:text-[#F4FBFC] leading-[1.08] mb-6">
              Clarity for every<br />
              financial decision.
            </h1>

            {/* Supporting Description */}
            <p className="text-sm sm:text-base text-[#476067] dark:text-[#A8C0C6] leading-relaxed max-w-md mb-8">
              Strategic tax, accounting and advisory solutions for businesses and CPA firms.
            </p>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <button
                onClick={() => onOpenConsultation()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-xs sm:text-[13px] transition-all duration-200 shadow-sm bg-[#17383F] hover:bg-[#0E262B] text-white dark:bg-[#49E3D6] dark:hover:bg-[#7DF5E8] dark:text-[#03181E] hover:scale-105 active:scale-95 focus:outline-none"
              >
                <span>Book Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onWatchVideo}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs sm:text-[13px] transition-all duration-200 text-[#12242B] dark:text-[#F4FBFC] hover:bg-black/5 dark:hover:bg-white/10"
              >
                <div className="w-8 h-8 rounded-full border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.3)] flex items-center justify-center bg-white/70 dark:bg-white/5">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5 text-[#12242B] dark:text-[#7DF5E8]" />
                </div>
                <span>Watch Video</span>
              </button>
            </div>

            {/* Social Proof Overlapping Avatars */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Client avatar"
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#030F14] object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Client avatar"
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#030F14] object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                  alt="Client avatar"
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#030F14] object-cover"
                />
              </div>
              <div className="text-left text-xs leading-tight">
                <span className="text-[#64748B] dark:text-[#8AA3A8] block">Trusted by</span>
                <span className="font-bold text-[#12242B] dark:text-[#F4FBFC]">CPA Firms & Businesses</span>
              </div>
            </div>
          </div>

          {/* Right Column: Exact Layered Financial Dashboard Composition */}
          <div className="lg:col-span-7 xl:col-span-7 relative min-h-[480px] sm:min-h-[520px] flex items-center justify-center mt-6 lg:mt-0">
            
            {/* Playful top-right hand-written annotation note (matches screenshot) */}
            <div className="absolute -top-6 right-4 sm:right-10 flex flex-col items-end z-20 pointer-events-none select-none">
              <span className="font-serif italic text-xs sm:text-[13px] text-[#2E6B75] dark:text-[#7DF5E8] font-medium tracking-wide">
                Smarter<br />Tax Solutions
              </span>
              <svg className="w-8 h-8 text-[#2E6B75] dark:text-[#7DF5E8] -mt-1 mr-2" viewBox="0 0 40 40" fill="none">
                <path d="M 28 6 C 26 16 18 22 8 26 M 8 26 L 14 20 M 8 26 L 16 28" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Laptop Screen / Background Canvas Container */}
            <div className="w-full max-w-[580px] relative rounded-3xl p-2.5 sm:p-4 bg-slate-200/60 dark:bg-[#071C24]/80 border border-slate-300/80 dark:border-[rgba(121,241,232,0.15)] shadow-2xl backdrop-blur-xl">
              
              {/* Main Dashboard Screen (Card 2) */}
              <div className="rounded-2xl bg-white dark:bg-[#09222B] p-4 sm:p-5 border border-[#E2EBE8] dark:border-[rgba(121,241,232,0.18)] shadow-sm">
                
                {/* Header row */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#12242B] dark:text-[#F4FBFC]">
                      Financial Overview
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Tabs */}
                    <div className="flex items-center gap-1 bg-black/5 dark:bg-black/20 p-0.5 rounded-lg text-[10px] font-semibold">
                      {(['Revenue', 'Expenses', 'Cash Flow'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-2 py-0.5 rounded-md transition-all ${
                            activeTab === tab
                              ? 'bg-[#17383F] text-white dark:bg-[#49E3D6] dark:text-[#03181E] shadow-xs'
                              : 'text-[#476067] dark:text-[#A8C0C6] hover:text-[#12242B] dark:hover:text-[#F4FBFC]'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Year dropdown */}
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/5 dark:bg-black/20 text-[10px] font-medium text-[#476067] dark:text-[#A8C0C6] cursor-pointer">
                      <span>{selectedYear}</span>
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                {/* SVG Graph + Multi-bar Combination (matches screenshot) */}
                <div className="relative h-44 sm:h-48 w-full pt-4">
                  {/* Grid lines */}
                  <div className="absolute inset-x-0 top-6 border-b border-gray-100 dark:border-gray-800/80" />
                  <div className="absolute inset-x-0 top-18 border-b border-gray-100 dark:border-gray-800/80" />
                  <div className="absolute inset-x-0 top-30 border-b border-gray-100 dark:border-gray-800/80" />

                  {/* Bars & Line Graph */}
                  <div className="relative h-32 flex items-end justify-between gap-1.5 sm:gap-2 px-2 z-10">
                    {chartData.map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                        <div
                          className="w-full rounded-t-sm transition-all duration-500 bg-[#E0EFEF] dark:bg-[#103D47] group-hover:bg-[#2AA499] dark:group-hover:bg-[#49E3D6]"
                          style={{ height: `${(val / maxVal) * 90}%` }}
                        />
                      </div>
                    ))}

                    {/* Overlay Smooth Trend Bezier Curve */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path
                        d="M 4 70 Q 25 50, 45 40 T 95 12"
                        fill="none"
                        stroke="#2AA499"
                        strokeWidth="2.5"
                        className="dark:stroke-[#49E3D6]"
                      />
                      {/* Dots on line */}
                      <circle cx="4" cy="70" r="2.5" fill="#49E3D6" stroke="#09222B" strokeWidth="1" />
                      <circle cx="28" cy="52" r="2.5" fill="#49E3D6" stroke="#09222B" strokeWidth="1" />
                      <circle cx="50" cy="38" r="2.5" fill="#49E3D6" stroke="#09222B" strokeWidth="1" />
                      <circle cx="72" cy="24" r="2.5" fill="#49E3D6" stroke="#09222B" strokeWidth="1" />
                      <circle cx="95" cy="12" r="2.5" fill="#49E3D6" stroke="#09222B" strokeWidth="1" />
                    </svg>
                  </div>

                  {/* X Axis Months */}
                  <div className="flex justify-between text-[9px] text-gray-400 dark:text-gray-500 pt-2 px-2">
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((m, i) => (
                      <span key={i}>{m}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Card 1 (Left - Documents) */}
              <div className="sm:absolute -bottom-8 -left-6 w-52 sm:w-56 p-3 sm:p-3.5 rounded-2xl bg-white/95 dark:bg-[#071C25]/95 backdrop-blur-xl border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.22)] shadow-xl z-20 mt-3 sm:mt-0">
                <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-gray-100 dark:border-gray-800/80">
                  <div className="w-6 h-6 rounded-lg bg-[#E7F2F0] dark:bg-[rgba(44,207,197,0.15)] flex items-center justify-center text-[#1E6169] dark:text-[#7DF5E8]">
                    <FolderLock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[#12242B] dark:text-[#F4FBFC] leading-tight">Documents</div>
                    <div className="text-[9px] text-[#64748B] dark:text-[#8AA3A8]">Secure & Organized</div>
                  </div>
                </div>

                <div className="space-y-1.5 text-[10px]">
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-black/5 dark:bg-black/20">
                    <span className="text-[#12242B] dark:text-[#F4FBFC] font-medium">1040 Review</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                      Completed
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-black/5 dark:bg-black/20">
                    <span className="text-[#12242B] dark:text-[#F4FBFC] font-medium">Business Returns</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                      In Progress
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-black/5 dark:bg-black/20">
                    <span className="text-[#12242B] dark:text-[#F4FBFC] font-medium">Client Documents</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400">
                      Synced
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Card 3 (Right - Tax Compliance Gauge) */}
              <div className="sm:absolute -top-6 -right-6 w-48 sm:w-52 p-3.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-[#071C25]/95 backdrop-blur-xl border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.22)] shadow-xl z-20 mt-3 sm:mt-0">
                <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-gray-100 dark:border-gray-800/80">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[#12242B] dark:text-[#F4FBFC] leading-tight">Tax Compliance</div>
                    <div className="text-[9px] text-[#64748B] dark:text-[#8AA3A8]">On Track</div>
                  </div>
                </div>

                {/* Circular 92% Gauge */}
                <div className="relative w-16 h-16 mx-auto my-1 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.2"
                      className="text-gray-200 dark:text-gray-800"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#2AA499"
                      strokeDasharray="92, 100"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      className="dark:stroke-[#49E3D6]"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-sm font-bold text-[#12242B] dark:text-[#F4FBFC]">92%</span>
                  </div>
                </div>

                <div className="space-y-1 text-[9px] pt-1 text-[#476067] dark:text-[#A8C0C6]">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>Returns Filed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>Documents Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>No Pending Items</span>
                  </div>
                </div>
              </div>

              {/* Floating Card 4 (Bottom Center - Growth Planning) */}
              <div className="sm:absolute -bottom-10 right-4 w-44 sm:w-48 p-3 rounded-2xl bg-white/95 dark:bg-[#071C25]/95 backdrop-blur-xl border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.22)] shadow-xl z-30 mt-3 sm:mt-0">
                <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-gray-100 dark:border-gray-800/80">
                  <div className="w-5 h-5 rounded-md bg-[#E7F2F0] dark:bg-[rgba(44,207,197,0.15)] flex items-center justify-center text-[#1E6169] dark:text-[#7DF5E8]">
                    <TrendingUp className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#12242B] dark:text-[#F4FBFC] leading-tight">Growth Planning</div>
                    <div className="text-[8px] text-[#64748B] dark:text-[#8AA3A8]">Strategic Guidance</div>
                  </div>
                </div>

                <div className="flex items-end justify-between h-9 px-3 gap-2">
                  <div className="w-3.5 bg-[#4AE5D9]/40 rounded-t-sm h-[35%]" />
                  <div className="w-3.5 bg-[#4AE5D9]/60 rounded-t-sm h-[55%]" />
                  <div className="w-3.5 bg-[#4AE5D9]/80 rounded-t-sm h-[75%]" />
                  <div className="w-3.5 bg-[#4AE5D9] rounded-t-sm h-[95%]" />
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
