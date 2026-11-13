import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FinalCtaSectionProps {
  onOpenConsultation: () => void;
}

export function FinalCtaSection({ onOpenConsultation }: FinalCtaSectionProps) {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#FAFCFB] dark:bg-[#030F14] transition-colors duration-300">
      <div className="max-w-[1280px] mx-auto">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)] min-h-[360px] sm:min-h-[420px] flex items-center justify-center p-8 sm:p-12 text-center group">
          
          {/* Background Office Image with Panoramic Skyline matching screenshot */}
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=80"
            alt="Corporate office skyline"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] dark:brightness-[0.4] group-hover:scale-105 transition-transform duration-1000"
          />

          {/* Semi-transparent dark contrast overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/60 dark:from-[#030F14]/90 dark:via-[#030F14]/75 dark:to-[#030F14]/80" />

          {/* Centered Content */}
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            {/* Heading in font-serif-editorial */}
            <h2 className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white leading-[1.15] mb-8">
              Ready to Simplify<br />
              Your Tax & Accounting?
            </h2>

            {/* CTA Button and playful curved arrow (matches screenshot) */}
            <div className="relative inline-flex items-center">
              <button
                onClick={onOpenConsultation}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 bg-white text-[#12242B] hover:bg-gray-100 dark:bg-[#49E3D6] dark:hover:bg-[#7DF5E8] dark:text-[#03181E] shadow-xl hover:scale-105 active:scale-95 focus:outline-none"
              >
                <span>Book Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Hand-drawn curved arrow indicator */}
              <div className="hidden sm:block absolute -right-12 -bottom-6 pointer-events-none text-white/80 dark:text-[#7DF5E8]">
                <svg className="w-10 h-10 -rotate-12" viewBox="0 0 40 40" fill="none">
                  <path d="M 6 30 C 14 18 24 14 34 10 M 34 10 L 26 12 M 34 10 L 32 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
