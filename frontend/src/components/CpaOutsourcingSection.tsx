import React from 'react';
import { 
  Building2, 
  ArrowUpRight, 
  Check, 
  ShieldCheck, 
  Cpu, 
  Clock, 
  Sparkles,
  FileText,
  BookOpen,
  Layers,
  Coins,
  ClipboardCheck,
  FileCheck,
  CheckCircle2,
  PenTool,
  UserCheck
} from 'lucide-react';
import { getServicesByCategory, ServiceItem } from '../data/services';

interface CpaOutsourcingSectionProps {
  onRequestScope: (serviceSlug: string) => void;
  onViewDetail?: (serviceSlug: string) => void;
}

const CPA_ICON_MAP: Record<string, React.ElementType> = {
  FileText,
  BookOpen,
  Layers,
  Coins,
  ClipboardCheck,
  FileCheck,
  CheckCircle2,
  Sparkles,
  PenTool,
  UserCheck
};

const SOFTWARE_STACK = [
  'UltraTax CS',
  'ProConnect Tax',
  'Drake Software',
  'Lacerte',
  'CCH Axcess',
  'QuickBooks Online',
  'Xero',
  'NetSuite',
  'Bill.com',
  'Gusto & ADP'
];

export function CpaOutsourcingSection({ onRequestScope, onViewDetail }: CpaOutsourcingSectionProps) {
  const cpaServices = getServicesByCategory('cpa');

  return (
    <section id="cpa-outsourcing" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative bg-white dark:bg-[#071C24] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#E4F0EE] dark:bg-[rgba(44,207,197,0.12)] text-[#315F69] dark:text-[#79F1E8] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.25)] mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Dedicated Firm Capacity</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#17252B] dark:text-[#F3FBFC]">
            10 Dedicated CPA Outsourcing Solutions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#526168] dark:text-[#A8C0C6] leading-relaxed">
            Eliminate busy-season burnout, compress turnaround cycles to 24-48 hours, and boost firm realization margins by 40%+ with our rigorously trained US tax and accounting professionals.
          </p>
        </div>

        {/* Software Stack Ticker */}
        <div className="mb-14 p-4 sm:p-5 rounded-2xl glass-panel border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs mb-3">
            <span className="font-bold uppercase tracking-wider text-[#17252B] dark:text-[#F3FBFC] flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#315F69] dark:text-[#79F1E8]" />
              <span>Native Software Proficiencies</span>
            </span>
            <span className="text-[#526168] dark:text-[#A8C0C6]">
              Work is executed directly within your secure cloud tax & accounting software.
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {SOFTWARE_STACK.map((sw, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-black/5 dark:bg-white/5 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.14)] text-[#17252B] dark:text-[#F3FBFC]"
              >
                {sw}
              </span>
            ))}
          </div>
        </div>

        {/* 10 CPA Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cpaServices.map((service, index) => {
            const Icon = CPA_ICON_MAP[service.iconName] || FileText;

            return (
              <div
                key={service.id}
                className="group relative glass-panel rounded-3xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)] hover:border-[#315F69] dark:hover:border-[#2CCFC5] flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#E4F0EE] dark:bg-[rgba(44,207,197,0.15)] flex items-center justify-center text-[#315F69] dark:text-[#79F1E8] group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#526168] dark:text-[#A8C0C6]">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 
                    onClick={() => onViewDetail ? onViewDetail(service.slug) : onRequestScope(service.slug)}
                    className="text-lg font-bold text-[#17252B] dark:text-[#F3FBFC] group-hover:text-[#315F69] dark:group-hover:text-[#79F1E8] transition-colors mb-2 cursor-pointer"
                  >
                    {service.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#526168] dark:text-[#A8C0C6] leading-relaxed mb-5">
                    {service.shortDescription}
                  </p>

                  {/* Deliverables List */}
                  <div className="space-y-2 mb-6 pt-3 border-t border-[#DCE5E2]/60 dark:border-[rgba(121,241,232,0.12)]">
                    {service.deliverables.map((item, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2 text-xs text-[#526168] dark:text-[#A8C0C6]">
                        <Check className="w-3.5 h-3.5 text-[#315F69] dark:text-[#2CCFC5] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#DCE5E2] dark:border-[rgba(121,241,232,0.14)]">
                  <button
                    onClick={() => onViewDetail ? onViewDetail(service.slug) : onRequestScope(service.slug)}
                    className="inline-flex w-full items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#315F69] hover:bg-[#223D44] dark:bg-[#2CCFC5] dark:text-[#031117] dark:hover:bg-[#7DF5E8] transition-all shadow-sm"
                  >
                    <span>Explore Service</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
