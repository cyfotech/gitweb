import React, { useState } from 'react';
import { 
  ArrowRight, 
  Play, 
  Pause, 
  Compass, 
  Layers, 
  Headphones 
} from 'lucide-react';

interface PartnershipSectionProps {
  onLearnMore?: () => void;
}

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Strategy',
    subtitle: 'Tailored to Your Goals',
    icon: Compass,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80'
  },
  {
    number: '02',
    title: 'Execution',
    subtitle: 'Driven by Expertise',
    icon: Layers,
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1000&auto=format&fit=crop&q=80'
  },
  {
    number: '03',
    title: 'Ongoing Support',
    subtitle: 'Always by Your Side',
    icon: Headphones,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&auto=format&fit=crop&q=80'
  }
];

export function PartnershipSection({ onLearnMore }: PartnershipSectionProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="partnership" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 relative bg-white dark:bg-[#04131A] transition-colors duration-300">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Section Grid: 3-column composition matching screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Heading & CTA */}
          <div className="lg:col-span-4 flex flex-col items-start text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#E7F2F0] dark:bg-[rgba(44,207,197,0.14)] text-[#1E6169] dark:text-[#7DF5E8] border border-[#D5E5E1] dark:border-[rgba(121,241,232,0.25)] mb-4">
              <span>PINNED SCROLL STORY</span>
            </div>

            {/* Editorial Serif Heading */}
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-tight text-[#12242B] dark:text-[#F4FBFC] leading-[1.12] mb-5">
              A Partnership<br />
              Built Around You
            </h2>

            {/* Description */}
            <p className="text-sm text-[#476067] dark:text-[#A8C0C6] leading-relaxed mb-8 max-w-sm">
              We combine deep expertise with a client-first approach to deliver measurable results.
            </p>

            {/* Learn More Button */}
            <button
              onClick={onLearnMore}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-[13px] font-semibold bg-[#17383F] hover:bg-[#0E262B] text-white dark:bg-[#49E3D6] dark:hover:bg-[#7DF5E8] dark:text-[#03181E] transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <span>Learn More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Center Column: Prominent Media Frame with 3 Colleagues & Video Button */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.22)] bg-slate-900 aspect-[16/11]">
              <img
                src={PROCESS_STEPS[activeStepIndex].image}
                alt="Partnership meeting"
                className="w-full h-full object-cover transition-all duration-700 filter brightness-95"
              />

              {/* Gradient shadow overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

              {/* Centered VIDEO PREVIEW button pill (matches screenshot) */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 m-auto w-fit h-fit px-4 py-2.5 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md border border-white/60 dark:border-[rgba(121,241,232,0.4)] text-[#12242B] dark:text-[#F4FBFC] text-xs font-bold tracking-wider flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-[#17383F] dark:bg-[#49E3D6] text-white dark:text-[#03181E] flex items-center justify-center">
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5 fill-current" />}
                </div>
                <span>VIDEO PREVIEW</span>
              </button>

              {/* Playing indicator */}
              {isPlaying && (
                <div className="absolute top-4 left-4 bg-[#03181E]/80 backdrop-blur-md text-[#49E3D6] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#49E3D6]/30 flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#49E3D6]" />
                  <span>Interactive Walkthrough Active</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: 3 Process Steps with Number Badges */}
          <div className="lg:col-span-3 space-y-3">
            {PROCESS_STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = activeStepIndex === idx;

              return (
                <div
                  key={step.number}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border flex items-center justify-between ${
                    isActive
                      ? 'bg-white dark:bg-[#071C25] shadow-lg border-[#17383F] dark:border-[#49E3D6] scale-[1.02]'
                      : 'bg-black/5 dark:bg-white/5 border-transparent opacity-75 hover:opacity-100 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-[#17383F] text-white dark:bg-[#49E3D6] dark:text-[#03181E]'
                          : 'bg-black/10 dark:bg-white/10 text-[#476067] dark:text-[#A8C0C6]'
                      }`}
                    >
                      <StepIcon className="w-4 h-4" />
                    </div>

                    <div className="text-left">
                      <h4 className="text-sm font-bold text-[#12242B] dark:text-[#F4FBFC] leading-tight">
                        {step.title}
                      </h4>
                      <p className="text-[11px] text-[#64748B] dark:text-[#8AA3A8]">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Circular Number Badge (matches screenshot) */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                      isActive
                        ? 'bg-[#E7F2F0] text-[#1E6169] dark:bg-[rgba(44,207,197,0.2)] dark:text-[#7DF5E8]'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.number}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
