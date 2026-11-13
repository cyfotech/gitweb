import React, { useState } from 'react';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Compass, 
  Coins, 
  CreditCard, 
  Users2,
  Check,
  X
} from 'lucide-react';
import { ClientCategory, ServiceItem, SERVICES_CATALOG } from '../data/services';

interface ServicesSectionProps {
  onSelectServiceForConsultation: (category: ClientCategory, serviceSlug: string) => void;
  onExploreAll?: () => void;
  onViewServiceDetails?: (slug: string) => void;
}

const FEATURED_SERVICES = [
  {
    id: 'tax-prep',
    title: 'Tax Preparation',
    category: 'individual' as ClientCategory,
    slug: 'individual-tax-prep',
    icon: FileText,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80',
    description: 'Accurate Federal & State individual and corporate returns, maximizing every eligible deduction and credit.'
  },
  {
    id: 'accounting-services',
    title: 'Accounting Services',
    category: 'business' as ClientCategory,
    slug: 'accounting-services',
    icon: Compass,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    description: 'GAAP-compliant financial statements, balance sheet reconciliations, and executive CFO reporting.'
  },
  {
    id: 'bookkeeping',
    title: 'Bookkeeping',
    category: 'business' as ClientCategory,
    slug: 'bookkeeping',
    icon: Coins,
    image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80',
    description: 'Daily transaction categorization, bank reconciliations, accounts payable and automated ledger syncing.'
  },
  {
    id: 'payroll-management',
    title: 'Payroll Management',
    category: 'business' as ClientCategory,
    slug: 'payroll-management',
    icon: CreditCard,
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80',
    description: 'On-time payroll runs, direct deposits, multi-state tax withholdings, and year-end W-2/1099 filings.'
  },
  {
    id: 'cpa-outsourcing',
    title: 'CPA Outsourcing',
    category: 'cpa' as ClientCategory,
    slug: 'tax-prep-outsourcing',
    icon: Users2,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
    description: 'Dedicated offshore tax preparers and accountants scaling busy-season capacity for US accounting practices.'
  }
];

export function ServicesSection({ onSelectServiceForConsultation, onExploreAll, onViewServiceDetails }: ServicesSectionProps) {
  const [scrollIndex, setScrollIndex] = useState(0);

  const handlePrev = () => {
    setScrollIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setScrollIndex((prev) => Math.min(FEATURED_SERVICES.length - 1, prev + 1));
  };

  return (
    <section id="services" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 relative bg-[#FAFCFB] dark:bg-[#030F14] transition-colors duration-300">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            {/* Eyebrow */}
            <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#E7F2F0] dark:bg-[rgba(44,207,197,0.14)] text-[#1E6169] dark:text-[#7DF5E8] border border-[#D5E5E1] dark:border-[rgba(121,241,232,0.25)] mb-3">
              <span>OUR SERVICES</span>
            </div>
            
            {/* Heading in font-serif-editorial */}
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-tight text-[#12242B] dark:text-[#F4FBFC] leading-snug">
              Comprehensive Tax & Accounting Solutions
            </h2>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Explore All Services Button */}
            <button
              onClick={onExploreAll}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#17383F] hover:bg-[#0E262B] text-white dark:bg-[#49E3D6] dark:hover:bg-[#7DF5E8] dark:text-[#03181E] transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <span>Explore All 20 Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Carousel navigation arrow buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                disabled={scrollIndex === 0}
                aria-label="Previous services"
                className="w-8 h-8 rounded-full border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)] flex items-center justify-center text-[#12242B] dark:text-[#F4FBFC] bg-white dark:bg-[#071C25] disabled:opacity-30 transition-all hover:bg-black/5 dark:hover:bg-white/10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                disabled={scrollIndex >= FEATURED_SERVICES.length - 3}
                aria-label="Next services"
                className="w-8 h-8 rounded-full border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)] flex items-center justify-center text-[#12242B] dark:text-[#F4FBFC] bg-white dark:bg-[#071C25] disabled:opacity-30 transition-all hover:bg-black/5 dark:hover:bg-white/10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 5 Cards Row (matches screenshot layout & proportions) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {FEATURED_SERVICES.map((srv) => {
            const Icon = srv.icon;

            return (
              <div
                key={srv.id}
                onClick={() => onViewServiceDetails ? onViewServiceDetails(srv.slug) : onSelectServiceForConsultation(srv.category, srv.slug)}
                className="group relative rounded-2xl p-4 bg-white dark:bg-[#071C25] border border-[#E2EBE8] dark:border-[rgba(121,241,232,0.18)] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Icon */}
                  <div className="w-9 h-9 rounded-xl bg-[#E7F2F0] dark:bg-[rgba(44,207,197,0.15)] flex items-center justify-center text-[#1E6169] dark:text-[#7DF5E8] mb-3 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-[#12242B] dark:text-[#F4FBFC] mb-2 leading-tight group-hover:text-[#315F69] dark:group-hover:text-[#49E3D6] transition-colors">
                    {srv.title}
                  </h3>
                </div>

                {/* Supporting photo thumbnail (matches screenshot) */}
                <div className="mt-4 pt-2">
                  <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={srv.image}
                      alt={srv.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="mt-3 flex items-center justify-end">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#315F69] dark:text-[#7DF5E8] group-hover:text-[#12242B] dark:group-hover:text-[#F4FBFC] transition-colors">
                      Explore Service
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
