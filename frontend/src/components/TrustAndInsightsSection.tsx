import React, { useState } from 'react';
import { 
  Users, 
  Cpu, 
  ShieldCheck, 
  Headphones, 
  ChevronLeft, 
  ChevronRight, 
  Quote 
} from 'lucide-react';

const TRUST_FEATURES = [
  {
    icon: Users,
    title: 'Experienced Professionals'
  },
  {
    icon: Cpu,
    title: 'Technology Driven Process'
  },
  {
    icon: ShieldCheck,
    title: 'Accurate & Compliant'
  },
  {
    icon: Headphones,
    title: 'Dedicated Support'
  }
];

const TESTIMONIALS = [
  {
    quote: "Preferred Tax Consultancy has transformed the way we manage our accounting operations.",
    author: "Rachel Sterling, CPA",
    firm: "Managing Partner, Sterling & Associates"
  },
  {
    quote: "Their offshore tax preparers integrated seamlessly into our Drake workflow, reducing our turnaround time by 60%.",
    author: "Mark Davis, EA",
    firm: "Founder, Davis Advisory Group"
  },
  {
    quote: "Flawless multi-state corporate tax preparation. They caught $42K in missed Section 179 depreciation deductions.",
    author: "Elena Rostova",
    firm: "CFO, Apex Robotics Corp"
  }
];

export function TrustAndInsightsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  // 10 Ascending growth data bars matching the mockup
  const growthBars = [22, 34, 46, 52, 64, 72, 80, 88, 94, 108];

  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 relative bg-[#FAFCFB] dark:bg-[#030F14] transition-colors duration-300">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Column 1: WHY BUSINESSES TRUST US (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="mb-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#E7F2F0] dark:bg-[rgba(44,207,197,0.14)] text-[#1E6169] dark:text-[#7DF5E8] border border-[#D5E5E1] dark:border-[rgba(121,241,232,0.25)] mb-3">
                <span>WHY BUSINESSES TRUST US</span>
              </div>
            </div>

            {/* 4 Cards in 2x2 Grid (matches screenshot) */}
            <div className="grid grid-cols-2 gap-3 flex-1">
              {TRUST_FEATURES.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white dark:bg-[#071C25] border border-[#E2EBE8] dark:border-[rgba(121,241,232,0.18)] shadow-xs flex flex-col items-center text-center justify-center hover:border-[#17383F] dark:hover:border-[#49E3D6] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#E7F2F0] dark:bg-[rgba(44,207,197,0.15)] flex items-center justify-center text-[#1E6169] dark:text-[#7DF5E8] mb-2.5 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-[#12242B] dark:text-[#F4FBFC] leading-snug">
                      {feat.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: INTERACTIVE CHART (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="mb-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#E7F2F0] dark:bg-[rgba(44,207,197,0.14)] text-[#1E6169] dark:text-[#7DF5E8] border border-[#D5E5E1] dark:border-[rgba(121,241,232,0.25)] mb-3">
                <span>INTERACTIVE CHART</span>
              </div>
            </div>

            {/* Client Growth Journey Card (matches screenshot) */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#071C25] border border-[#E2EBE8] dark:border-[rgba(121,241,232,0.18)] shadow-xs flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#12242B] dark:text-[#F4FBFC] mb-1">
                  Client Growth Journey
                </h4>
                <p className="text-[11px] text-[#64748B] dark:text-[#8AA3A8]">
                  Annual revenue scaling & tax liability compression
                </p>
              </div>

              {/* Chart with ascending bars and bezier trend line */}
              <div className="relative h-44 w-full mt-4 flex items-end justify-between gap-1.5 px-2">
                {/* Horizontal reference lines */}
                <div className="absolute inset-x-0 top-6 border-b border-gray-100 dark:border-gray-800" />
                <div className="absolute inset-x-0 top-20 border-b border-gray-100 dark:border-gray-800" />

                {/* Bars */}
                {growthBars.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group z-10">
                    <div
                      className="w-full rounded-t-sm bg-[#4AE5D9]/40 dark:bg-[#103D47] group-hover:bg-[#2AA499] dark:group-hover:bg-[#49E3D6] transition-all"
                      style={{ height: `${(val / 110) * 85}%` }}
                    />
                  </div>
                ))}

                {/* Smooth ascending trend line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path
                    d="M 5 80 Q 40 60, 65 35 T 95 10"
                    fill="none"
                    stroke="#2AA499"
                    strokeWidth="2.5"
                    className="dark:stroke-[#49E3D6]"
                  />
                  <circle cx="95" cy="10" r="3" fill="#49E3D6" stroke="#071C25" strokeWidth="1.5" />
                </svg>
              </div>

              <div className="flex justify-between items-center text-[10px] text-[#64748B] dark:text-[#8AA3A8] pt-3 border-t border-gray-100 dark:border-gray-800 mt-2">
                <span>Verified Historical Benchmark</span>
                <span className="font-bold text-[#1E6169] dark:text-[#7DF5E8]">+38% YoY Efficiency</span>
              </div>
            </div>
          </div>

          {/* Column 3: Real People. Real Progress. (3 cols) */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div className="mb-4 invisible lg:visible">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase opacity-0">
                <span>TESTIMONIAL</span>
              </div>
            </div>

            {/* Testimonial Card with Quote Icon and Carousel Arrows (matches screenshot) */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#071C25] border border-[#E2EBE8] dark:border-[rgba(121,241,232,0.18)] shadow-xs flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-[#12242B] dark:text-[#F4FBFC]">
                    Real People.<br />Real Progress.
                  </h4>
                  <div className="w-8 h-8 rounded-full bg-[#E7F2F0] dark:bg-[rgba(44,207,197,0.15)] flex items-center justify-center text-[#1E6169] dark:text-[#7DF5E8]">
                    <Quote className="w-4 h-4 fill-current" />
                  </div>
                </div>

                {/* 4 Circular Customer Avatars */}
                <div className="flex -space-x-2 overflow-hidden my-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Customer"
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-[#071C25] object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    alt="Customer"
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-[#071C25] object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                    alt="Customer"
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-[#071C25] object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                    alt="Customer"
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-[#071C25] object-cover"
                  />
                </div>

                {/* Quote Text */}
                <p className="text-xs text-[#476067] dark:text-[#A8C0C6] leading-relaxed italic mt-2">
                  &ldquo;{TESTIMONIALS[activeTestimonial].quote}&rdquo;
                </p>
                <div className="mt-2 text-[10px] font-semibold text-[#12242B] dark:text-[#F4FBFC]">
                  — {TESTIMONIALS[activeTestimonial].author}
                </div>
              </div>

              {/* Bottom Carousel Controls */}
              <div className="flex items-center justify-end gap-1.5 pt-4 border-t border-gray-100 dark:border-gray-800 mt-3">
                <button
                  onClick={prevTestimonial}
                  aria-label="Previous testimonial"
                  className="w-7 h-7 rounded-full border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)] flex items-center justify-center text-[#12242B] dark:text-[#F4FBFC] hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  aria-label="Next testimonial"
                  className="w-7 h-7 rounded-full border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)] flex items-center justify-center text-[#12242B] dark:text-[#F4FBFC] hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
