import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowRight,
  Clock,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
  Compass,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { SERVICES_CATALOG, ClientCategory, ServiceItem } from '../data/services';
import { EditableElement } from './EditableElement';
import { servicesApi } from '../api/services';

export interface EditorialServiceShowcaseContent {
  title?: string | null;
  subheading?: string | null;
  description?: string | null;
  content?: string | null;
  backgroundImage?: string | null;
  parsedContent?: Record<string, any> | null;
}

interface EditorialServiceShowcaseProps {
  onSelectServiceForConsultation: (category: ClientCategory, slug: string) => void;
  onExploreAll: () => void;
  onViewServiceDetails: (slug: string) => void;
  cmsContent?: EditorialServiceShowcaseContent | null;
}

type FilterCategory = 'all' | ClientCategory;

// Curated high-resolution editorial imagery mapped to each category
const CATEGORY_IMAGES: Record<ClientCategory, string[]> = {
  cpa: [
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80'
  ],
  business: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80'
  ],
  individual: [
    'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80'
  ]
};

export function EditorialServiceShowcase({
  onSelectServiceForConsultation,
  onExploreAll,
  onViewServiceDetails,
  cmsContent,
}: EditorialServiceShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_CATALOG);

  const displayTitle = cmsContent?.title || 'Curated Practice Directory & Dispatches';
  const displaySubheading = cmsContent?.subheading || 'CHAPTER 02 • FULL PRACTICE CATALOG';
  const displayDescription = cmsContent?.description || 'Explore our complete compendium of 20 verified tax disciplines. Every engagement incorporates dual-tier CPA audit gates, IRS Circular 230 compliance, and guaranteed delivery SLAs.';
  const content = cmsContent?.parsedContent || {};
  const categoryLabels = {
    all: content.allLabel || 'All Practices',
    cpa: content.cpaLabel || 'CPA Firm Outsourcing',
    business: content.businessLabel || 'Corporate & Business',
    individual: content.individualLabel || 'Private Wealth & Individuals',
  };
  const directoryButton = content.directoryButton || 'Complete 20-Practice Directory';
  const cardGuideButton = content.cardGuideButton || 'Read Practice Guide';
  const bookButton = content.bookButton || 'Book Engagement';
  const loadMoreButton = content.loadMoreButton || 'Load More Practices';
  const fullDirectoryButton = content.fullDirectoryButton || 'View Full 20-Service Architecture Directory';
  const serviceImages = content.serviceImages && typeof content.serviceImages === 'object' && !Array.isArray(content.serviceImages)
    ? content.serviceImages as Record<string, string>
    : {};

  useEffect(() => {
    let active = true;
    servicesApi.getAll(true)
      .then((response: any) => {
        if (!active || !Array.isArray(response) || response.length === 0) return;
        const nextServices: ServiceItem[] = response.map((remote: any) => {
          const fallback = SERVICES_CATALOG.find((item) => item.slug === remote.slug);
          const category = remote.servicecategory?.slug || fallback?.category || 'individual';
          return {
            id: remote.id,
            slug: remote.slug,
            name: remote.name || fallback?.name || '',
            category: category as ClientCategory,
            shortDescription: remote.shortDescription || fallback?.shortDescription || '',
            fullDescription: remote.fullDescription || fallback?.fullDescription || '',
            iconName: remote.iconName || fallback?.iconName || 'FileSpreadsheet',
            deliverables: Array.isArray(remote.deliverables) && remote.deliverables.length ? remote.deliverables : fallback?.deliverables || [],
            idealFor: remote.idealFor || fallback?.idealFor || '',
            turnaroundTime: remote.turnaroundTime || fallback?.turnaroundTime || '',
            popular: remote.isFeatured ?? fallback?.popular ?? false,
            demoType: remote.demoType || fallback?.demoType || 'tax-workflow',
            heroTagline: remote.heroTagline || fallback?.heroTagline || remote.shortDescription || '',
            features: Array.isArray(remote.features) ? remote.features : fallback?.features || [],
            workflow: Array.isArray(remote.workflow) ? remote.workflow : fallback?.workflow || [],
            executionStages: Array.isArray(remote.executionStages) ? remote.executionStages : fallback?.executionStages,
            benefits: Array.isArray(remote.benefits) ? remote.benefits : fallback?.benefits || [],
            faqs: Array.isArray(remote.faqs) ? remote.faqs : fallback?.faqs || [],
            relatedSlugs: Array.isArray(remote.relatedSlugs) ? remote.relatedSlugs : fallback?.relatedSlugs || [],
            heroAnimationConfig: remote.heroAnimationConfig || fallback?.heroAnimationConfig,
          };
        });
        setServices(nextServices);
      })
      .catch((error: unknown) => {
        console.warn('Unable to load current services for the home page; showing the bundled service catalog.', error);
      });
    return () => { active = false; };
  }, []);

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'all') return services;
    return services.filter((s) => s.category === selectedCategory);
  }, [services, selectedCategory]);

  const displayedServices = filteredServices.slice(0, visibleCount);

  const categoryCounts = {
    all: services.length,
    cpa: services.filter((s) => s.category === 'cpa').length,
    business: services.filter((s) => s.category === 'business').length,
    individual: services.filter((s) => s.category === 'individual').length,
  };

  return (
    <section
      id="services-preview"
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#F4F7F6] dark:bg-[#041219] transition-colors duration-300"
      aria-label="Practice Catalog and Technical Editorial Showcase"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading & Editorial Context */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#DCE5E2] dark:border-[rgba(53,224,146,0.18)]">
          <div className="max-w-3xl">
            <EditableElement
              sectionKey="services_showcase"
              elementKey="subheading"
              elementType="subheading"
              label="Catalog Section Subheading"
              value={displaySubheading}
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#22AF68] dark:text-[#35E092] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#35E092]" />
                <span>{displaySubheading}</span>
              </div>
            </EditableElement>

            <EditableElement
              sectionKey="services_showcase"
              elementKey="title"
              elementType="heading"
              label="Practice Catalog Headline"
              value={displayTitle}
            >
              <h2 className="font-serif-editorial text-3xl sm:text-5xl font-normal text-[#12242B] dark:text-[#F4FBFC] tracking-tight">
                {displayTitle}
              </h2>
            </EditableElement>

            <EditableElement
              sectionKey="services_showcase"
              elementKey="description"
              elementType="paragraph"
              label="Practice Directory Description"
              value={displayDescription}
            >
              <p className="mt-3 text-sm sm:text-base text-[#52646A] dark:text-[#B6CAD0] leading-relaxed">
                {displayDescription}
              </p>
            </EditableElement>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <EditableElement
              sectionKey="services_showcase"
              elementKey="directoryButton"
              elementType="button"
              label="Directory Exploration Button"
              value={directoryButton}
            >
              <button
                type="button"
                onClick={onExploreAll}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-white dark:bg-[#071C25] border border-[#22AF68]/40 dark:border-[#35E092]/30 text-[#12242B] dark:text-[#F4FBFC] hover:bg-black/5 dark:hover:bg-white/10 transition-all shadow-sm group"
              >
                <Compass className="w-4 h-4 text-[#22AF68] dark:text-[#35E092]" />
                <span>{directoryButton}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </EditableElement>
          </div>
        </div>

        {/* Editorial Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {[
            { id: 'all', label: categoryLabels.all, count: categoryCounts.all },
            { id: 'cpa', label: categoryLabels.cpa, count: categoryCounts.cpa },
            { id: 'business', label: categoryLabels.business, count: categoryCounts.business },
            { id: 'individual', label: categoryLabels.individual, count: categoryCounts.individual },
          ].map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(tab.id as FilterCategory);
                  setVisibleCount(6);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${isActive
                    ? 'bg-[#17383F] text-white dark:bg-[#35E092] dark:text-[#051917] shadow-sm'
                    : 'bg-white/70 dark:bg-[#071C25]/70 border border-[#DCECE3] dark:border-[rgba(53,224,146,0.15)] text-[#52646A] dark:text-[#B6CAD0] hover:text-[#17262B] dark:hover:text-white'
                  }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive
                      ? 'bg-white/20 dark:bg-black/20'
                      : 'bg-black/5 dark:bg-white/10 text-[#52646A] dark:text-[#88A4AB]'
                    }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Blog-Inspired Editorial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedServices.map((service, idx) => {
            const imagePool = CATEGORY_IMAGES[service.category] || CATEGORY_IMAGES.cpa;
            const cardImage = serviceImages[service.slug] || imagePool[idx % imagePool.length];

            return (
              <EditableElement
                key={service.slug}
                sectionKey="services_showcase"
                elementKey={`service_${service.slug}`}
                elementType="card"
                label={`${service.name} Card`}
                value={service.name}
              >
                <article
                  className="group flex flex-col justify-between rounded-3xl bg-white dark:bg-[#071C25] border border-[#DCECE3] dark:border-[rgba(53,224,146,0.18)] hover:border-[#22AF68] dark:hover:border-[#35E092] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div>
                    {/* Card Editorial Image Header */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                      <img
                        src={cardImage}
                        alt={service.name}
                        className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 group-hover:brightness-100 transition-all duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                      {/* Category & SLA floating tags */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-[#051917]/90 text-[#17262B] dark:text-[#35E092] backdrop-blur-md">
                          {service.category === 'cpa'
                            ? 'CPA Outsourcing'
                            : service.category === 'business'
                              ? 'Corporate Strategy'
                              : 'Private Wealth'}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/60 text-emerald-300 backdrop-blur-md border border-white/10">
                          <Clock className="w-3 h-3 text-[#35E092]" />
                          <span>{service.turnaroundTime}</span>
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="text-[10px] font-mono uppercase text-emerald-300 tracking-wider">
                          Discipline #{String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    {/* Card Editorial Body Content */}
                    <div className="p-5 sm:p-6">
                      <h3 className="font-bold text-lg sm:text-xl text-[#12242B] dark:text-[#F4FBFC] group-hover:text-[#22AF68] dark:group-hover:text-[#35E092] transition-colors leading-snug mb-2">
                        {service.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#52646A] dark:text-[#B6CAD0] line-clamp-2 leading-relaxed mb-4">
                        {service.heroTagline || service.shortDescription}
                      </p>

                      {/* Scope Highlights Preview */}
                      <div className="space-y-1.5 pt-3 border-t border-[#DCECE3]/80 dark:border-[rgba(53,224,146,0.12)] mb-4">
                        <div className="text-[11px] font-bold text-[#17262B] dark:text-white mb-1 flex items-center gap-1.5">
                          <FileCheck className="w-3.5 h-3.5 text-[#22AF68] dark:text-[#35E092]" />
                          <span>Core Deliverable Scope:</span>
                        </div>
                        {service.deliverables.slice(0, 2).map((del, dIdx) => (
                          <div key={dIdx} className="text-xs text-[#52646A] dark:text-[#88A4AB] flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span className="truncate">{del}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Editorial Footer Actions */}
                  <div className="p-5 sm:p-6 pt-0 border-t border-transparent flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onViewServiceDetails(service.slug)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#22AF68] dark:text-[#35E092] hover:underline underline-offset-4 group/btn"
                    >
                      <span>{cardGuideButton}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectServiceForConsultation(service.category, service.slug)}
                      className="px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-black/5 dark:bg-white/10 text-[#12242B] dark:text-[#F4FBFC] border border-transparent hover:!bg-white hover:!text-[#35E092] hover:!border-[#35E092]/40 hover:shadow-[0_0_16px_rgba(53,224,146,0.3)] dark:hover:!bg-[#0e2a27] dark:hover:!text-[#35E092] dark:hover:!border-[#35E092]/40 dark:hover:shadow-[0_0_18px_rgba(53,224,146,0.45)] hover:-translate-y-0.5 transition-all duration-300"
                    >
                      {bookButton}
                    </button>
                  </div>
                </article>
              </EditableElement>
            );
          })}
        </div>

        {/* Load More or Explore All Row */}
        <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          {visibleCount < filteredServices.length && (
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => Math.min(prev + 6, filteredServices.length))}
              className="px-6 py-3 rounded-full text-xs font-bold border border-[#22AF68] text-[#17262B] dark:text-[#F4FBFC] hover:bg-[#22AF68]/10 transition-all"
            >
              {loadMoreButton} ({filteredServices.length - visibleCount} remaining)
            </button>
          )}

          <button
            type="button"
            onClick={onExploreAll}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold bg-[#17383F] hover:bg-[#0E262B] text-white dark:bg-[#35E092] dark:hover:bg-[#27C177] dark:text-[#051917] shadow-sm transition-all"
          >
            <span>{fullDirectoryButton}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
