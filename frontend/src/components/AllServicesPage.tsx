import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft,
  FileSpreadsheet,
  Building2,
  Users,
  Users2,
  Briefcase,
  ShieldAlert,
  TrendingUp,
  Receipt,
  CreditCard,
  PieChart,
  Calculator,
  FileText,
  BookOpen,
  Layers,
  Coins,
  ClipboardCheck,
  FileCheck,
  UserCheck
} from 'lucide-react';
import { SERVICES_CATALOG, CLIENT_CATEGORIES, ClientCategory, ServiceItem } from '../data/services';
import { servicesApi } from '../api/services';
import { usePageContent } from '../hooks/usePageContent';
import { EditableSectionContainer } from './EditableSectionContainer';
import { OrbitalServiceWheel, FormsExplorer, InteractiveDoubtSolver } from './referenceAnimations';

const SERVICE_ICONS: Record<string, React.ElementType> = {
  FileSpreadsheet,
  Users,
  Users2,
  Briefcase,
  ShieldAlert,
  Building2,
  TrendingUp,
  Receipt,
  CreditCard,
  PieChart,
  Calculator,
  FileText,
  BookOpen,
  Layers,
  Coins,
  ClipboardCheck,
  FileCheck,
  CheckCircle2,
  Sparkles,
  UserCheck,
};

const getServiceIcon = (iconName: string, category: string): React.ElementType => {
  if (SERVICE_ICONS[iconName]) return SERVICE_ICONS[iconName];
  if (category === 'cpa') return Layers;
  if (category === 'business') return Building2;
  return Users2;
};

interface AllServicesPageProps {
  onSelectService: (slug: string) => void;
  onOpenConsultation: (category: string, serviceSlug: string) => void;
  onBackToHome: () => void;
}

export function AllServicesPage({
  onSelectService,
  onOpenConsultation,
  onBackToHome
}: AllServicesPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [catalog, setCatalog] = useState<ServiceItem[]>(SERVICES_CATALOG);
  const { getSection, getContentValue, isSectionEnabled } = usePageContent('services');
  const [pageConfig, setPageConfig] = useState<{
    badge: string;
    heading: string;
    description: string;
    searchPlaceholder: string;
    emptyStateHeading: string;
    emptyStateSubtext: string;
    resetButtonText: string;
    exploreButtonText: string;
  }>({
    badge: 'US ACCOUNTING · TAX · OUTSOURCING',
    heading: 'Every US accounting & tax service, under one outsourcing relationship.',
    description: 'Bookkeeping builds the records. Accounting turns them into reports. Tax preparation decides how it is reported, and filing completes it. Smart Tax Expertss brings all seven services together for US businesses, individual taxpayers and CPA firms.',
    searchPlaceholder: 'Search practices, deliverables, forms...',
    emptyStateHeading: 'No services matched',
    emptyStateSubtext: 'Try searching for 1040, 1120-S, bookkeeping, reconciliation, or audit.',
    resetButtonText: 'Reset Filters',
    exploreButtonText: 'Explore Service',
  });

  useEffect(() => {
    // Fetch dynamic page config
    servicesApi.getPageConfig()
      .then((cfg: any) => {
        if (cfg && cfg.heading) setPageConfig(prev => ({ ...prev, ...cfg }));
      })
      .catch(() => {});

    // Fetch dynamic services
    servicesApi.getAll(true)
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          // Format all dynamic database services into UI-compatible items
          const dbCatalog: ServiceItem[] = data.map((remote) => {
            const matchedStatic = SERVICES_CATALOG.find((s) => s.slug === remote.slug);
            return {
              id: remote.id,
              slug: remote.slug,
              name: remote.name || matchedStatic?.name || '',
              category: (remote.servicecategory?.slug || matchedStatic?.category || 'individual') as ClientCategory,
              shortDescription: remote.shortDescription || matchedStatic?.shortDescription || '',
              fullDescription: remote.fullDescription || matchedStatic?.fullDescription || '',
              iconName: (remote.iconName || matchedStatic?.iconName || 'FileSpreadsheet') as any,
              deliverables: remote.deliverables?.length ? remote.deliverables : (matchedStatic?.deliverables || ['Tax Review', 'Executive Documentation']),
              idealFor: remote.idealFor || matchedStatic?.idealFor || 'Businesses & Individuals',
              turnaroundTime: remote.turnaroundTime || matchedStatic?.turnaroundTime || '2-4 Days',
              popular: remote.isFeatured ?? matchedStatic?.popular ?? false,
              demoType: (remote.demoType || matchedStatic?.demoType || 'tax-workflow') as any,
              heroTagline: remote.heroTagline || matchedStatic?.heroTagline || remote.shortDescription || '',
              features: remote.features?.length ? remote.features : (matchedStatic?.features || []),
              workflow: remote.workflow?.length ? remote.workflow : (matchedStatic?.workflow || []),
              benefits: remote.benefits?.length ? remote.benefits : (matchedStatic?.benefits || []),
              faqs: remote.faqs?.length ? remote.faqs : (matchedStatic?.faqs || []),
              relatedSlugs: remote.relatedSlugs?.length ? remote.relatedSlugs : (matchedStatic?.relatedSlugs || []),
            };
          });

          setCatalog(dbCatalog);
        }
      })
      .catch(() => {});
  }, []);

  const filteredServices = useMemo(() => {
    return catalog.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesSearch = 
        item.name.toLowerCase().includes(query) ||
        item.shortDescription.toLowerCase().includes(query) ||
        item.fullDescription.toLowerCase().includes(query) ||
        item.deliverables.some(d => d.toLowerCase().includes(query)) ||
        item.idealFor.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [catalog, selectedCategory, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: catalog.length,
      individual: catalog.filter(s => s.category === 'individual').length,
      business: catalog.filter(s => s.category === 'business').length,
      cpa: catalog.filter(s => s.category === 'cpa').length
    };
  }, [catalog]);
  const heroSection = getSection('hero');
  const categoryLabels = getContentValue<Record<string, string>>('categories', 'labels', {});
  const gridContent = getSection('services_grid')?.parsedContent || {};
  const categoriesSection = getSection('categories');
  const servicesGridSection = getSection('services_grid');
  const gridConfig = {
    searchPlaceholder: gridContent.searchPlaceholder || pageConfig.searchPlaceholder,
    emptyStateHeading: gridContent.emptyStateHeading || pageConfig.emptyStateHeading,
    emptyStateSubtext: gridContent.emptyStateSubtext || pageConfig.emptyStateSubtext,
    resetButtonText: gridContent.resetButtonText || pageConfig.resetButtonText,
    exploreButtonText: gridContent.exploreButtonText || pageConfig.exploreButtonText,
  };

  return (
    <div className="services-catalog-page pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Return to Home */}
      <div className="flex items-center justify-between mb-8 text-xs text-[#476067] dark:text-[#A8C0C6]">
        <div className="flex items-center gap-2 font-medium">
          <button 
            onClick={onBackToHome}
            className="hover:text-[#12242B] dark:hover:text-[#F4FBFC] transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-[#12242B] dark:text-[#F4FBFC] font-semibold">Services</span>
        </div>

        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 font-semibold text-[#12242B] dark:text-[#F4FBFC] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Header */}
      <EditableSectionContainer sectionKey="hero" sectionTitle="Services Introduction" isEnabled={isSectionEnabled('hero')} sectionData={heroSection}>
      <div className="services-catalog-intro text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-[#315F69] dark:text-[#7DF5E8]">
          {heroSection?.subheading || pageConfig.badge}
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-editorial text-[#12242B] dark:text-[#F4FBFC] mt-2 mb-4">
          {heroSection?.title || pageConfig.heading}
        </h1>
        <p className="text-sm sm:text-base text-[#476067] dark:text-[#A8C0C6] leading-relaxed">
          {heroSection?.description || pageConfig.description}
        </p>
      </div>
      </EditableSectionContainer>

      {/* Reference Interactive Orbital Animation: 7 Unified Services */}
      <div className="mb-12">
        <OrbitalServiceWheel />
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="services-catalog-scroll-reveal flex flex-col md:flex-row items-center justify-between gap-4 mb-10 p-4 rounded-3xl bg-white/80 dark:bg-[#071C25]/80 backdrop-blur-md border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)] shadow-sm">
        {/* Category Pills */}
        <EditableSectionContainer sectionKey="categories" sectionTitle="Service Categories" isEnabled={isSectionEnabled('categories')} sectionData={categoriesSection}>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {(categoriesSection?.title || categoriesSection?.description) && (
            <div className="w-full">
              {categoriesSection.title && <h2 className="text-sm font-bold text-[#12242B] dark:text-[#F4FBFC]">{categoriesSection.title}</h2>}
              {categoriesSection.description && <p className="mt-1 text-xs text-[#476067] dark:text-[#A8C0C6]">{categoriesSection.description}</p>}
            </div>
          )}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`services-category-chip px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#17383F] text-white dark:bg-[#49E3D6] dark:text-[#03181E] shadow-sm'
                : 'bg-black/5 dark:bg-white/5 text-[#476067] dark:text-[#A8C0C6] hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            {categoryLabels.all || 'All Practices'} ({counts.all})
          </button>
          <button
            onClick={() => setSelectedCategory('individual')}
            className={`services-category-chip px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedCategory === 'individual'
                ? 'bg-[#17383F] text-white dark:bg-[#49E3D6] dark:text-[#03181E] shadow-sm'
                : 'bg-black/5 dark:bg-white/5 text-[#476067] dark:text-[#A8C0C6] hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            {categoryLabels.individual || 'Individual & Family'} ({counts.individual})
          </button>
          <button
            onClick={() => setSelectedCategory('business')}
            className={`services-category-chip px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedCategory === 'business'
                ? 'bg-[#17383F] text-white dark:bg-[#49E3D6] dark:text-[#03181E] shadow-sm'
                : 'bg-black/5 dark:bg-white/5 text-[#476067] dark:text-[#A8C0C6] hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            {categoryLabels.business || 'Business & Corporate'} ({counts.business})
          </button>
          <button
            onClick={() => setSelectedCategory('cpa')}
            className={`services-category-chip px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedCategory === 'cpa'
                ? 'bg-[#17383F] text-white dark:bg-[#49E3D6] dark:text-[#03181E] shadow-sm'
                : 'bg-black/5 dark:bg-white/5 text-[#476067] dark:text-[#A8C0C6] hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            {categoryLabels.cpa || 'CPA Firm Capacity'} ({counts.cpa})
          </button>
        </div>
        </EditableSectionContainer>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#476067] dark:text-[#A8C0C6]" />
          <input
            type="text"
            placeholder={gridConfig.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full text-xs bg-black/5 dark:bg-white/5 border border-transparent focus:border-[#315F69] dark:focus:border-[#49E3D6] text-[#12242B] dark:text-[#F4FBFC] placeholder-[#476067]/70 dark:placeholder-[#A8C0C6]/70 outline-none transition-all"
          />
        </div>
      </div>

      {/* Services Grid (20 Services) */}
      <EditableSectionContainer sectionKey="services_grid" sectionTitle="Service Catalog Grid" isEnabled={isSectionEnabled('services_grid')} sectionData={servicesGridSection}>
      {filteredServices.length === 0 ? (
        <div className="services-catalog-scroll-reveal text-center py-16 rounded-3xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#E2EBE8] dark:border-[#102C38]">
          <p className="text-base font-semibold text-[#12242B] dark:text-[#F4FBFC]">
            {gridConfig.emptyStateHeading} &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="text-xs text-[#476067] dark:text-[#A8C0C6] mt-1">
            {gridConfig.emptyStateSubtext}
          </p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 rounded-full text-xs font-bold bg-[#17383F] text-white dark:bg-[#49E3D6] dark:text-[#03181E]"
          >
            {gridConfig.resetButtonText}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => {
            const Icon = getServiceIcon(service.iconName, service.category);
            return (
              <div
                key={service.slug}
                style={{ animationDelay: `${Math.min(index * 40, 360)}ms` }}
                className="services-catalog-scroll-reveal rounded-3xl p-6 bg-white dark:bg-[#071C25] border border-[#DCE5E2] dark:border-[#102C38] shadow-sm hover:shadow-xl hover:border-[#315F69] dark:hover:border-[#49E3D6]/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Header: Icon + Category + Turnaround */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#17383F]/10 to-[#17383F]/5 dark:from-[#49E3D6]/20 dark:to-[#49E3D6]/5 text-[#17383F] dark:text-[#49E3D6] border border-[#17383F]/10 dark:border-[#49E3D6]/20 group-hover:scale-105 group-hover:border-[#17383F]/30 dark:group-hover:border-[#49E3D6]/50 transition-all duration-300 shadow-xs shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        {service.popular && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300 border border-amber-500/20">
                            <Sparkles className="w-2.5 h-2.5" />
                            Featured
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 text-[#315F69] dark:text-[#7DF5E8]">
                          {service.category === 'cpa' ? 'CPA Outsourcing' : service.category}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <Clock className="w-3 h-3" />
                        <span>{service.turnaroundTime}</span>
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => onSelectService(service.slug)}
                    className="text-lg font-bold text-[#12242B] dark:text-[#F4FBFC] group-hover:text-[#315F69] dark:group-hover:text-[#49E3D6] cursor-pointer transition-colors mb-2 leading-snug"
                  >
                    {service.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#476067] dark:text-[#A8C0C6] leading-relaxed mb-4 line-clamp-2">
                    {service.shortDescription}
                  </p>

                  {/* Target Audience / Ideal For */}
                  {service.idealFor && (
                    <div className="mb-4 pb-3 border-b border-[#E2EBE8]/60 dark:border-[#102C38]/60 flex items-center gap-1.5 text-[10.5px] font-medium text-[#315F69] dark:text-[#7DF5E8]">
                      <span className="font-semibold text-[#12242B] dark:text-[#F4FBFC]">Ideal for:</span>
                      <span className="truncate">{service.idealFor}</span>
                    </div>
                  )}

                  {/* Key Deliverables */}
                  <div className="space-y-1.5 mb-6">
                    {service.deliverables.slice(0, 3).map((del, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-2 text-[11px] text-[#12242B] dark:text-[#F4FBFC] group-hover:translate-x-0.5 transition-transform duration-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{del}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4 border-t border-[#E2EBE8] dark:border-[#102C38]">
                  <button
                    onClick={() => onSelectService(service.slug)}
                    className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-white bg-[#17383F] hover:bg-[#0F282E] dark:bg-[#49E3D6] dark:hover:bg-[#7DF5E8] dark:text-[#03181E] shadow-sm hover:shadow transition-all group/btn"
                  >
                    <span>{gridConfig.exploreButtonText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </EditableSectionContainer>

      {/* Reference Interactive Modules: Forms Explorer & Doubt Solver */}
      <div className="mt-16 space-y-12">
        <FormsExplorer />
        <InteractiveDoubtSolver />
      </div>
    </div>
  );
}
