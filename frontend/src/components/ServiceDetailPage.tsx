import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Calendar,
  Layers,
  FileCheck,
  Check
} from 'lucide-react';
import { ServiceItem, SERVICES_CATALOG, CLIENT_CATEGORIES } from '../data/services';
import { ServiceDemonstration } from './ServiceDemonstrations';
import { ServiceLiveHeroAnimation } from './ServiceLiveHeroAnimation';
import { EditableElement } from './EditableElement';
import { openCalendlyPopup } from './CalendlyWidget';
import { useGlobalSettings } from '../context/GlobalSettingsContext';
import { servicesApi } from '../api/services';

interface ServiceDetailPageProps {
  service: ServiceItem;
  onOpenConsultation: (category: string, serviceSlug: string) => void;
  onNavigateService: (slug: string) => void;
  onBackToCatalog: () => void;
  onBackToHome: () => void;
}

export function ServiceDetailPage({
  service,
  onOpenConsultation,
  onNavigateService,
  onBackToCatalog,
  onBackToHome
}: ServiceDetailPageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [sectionConfig, setSectionConfig] = useState<any>({
    featuresSectionBadge: 'Comprehensive Scope',
    featuresSectionHeading: "What This Service Includes",
    featuresSectionSubtext: 'Every engagement is engineered for complete tax efficiency, zero filing errors, and audit-ready documentation.',
    deliverablesBoxHeading: 'Official Deliverables You Receive:',
    workflowSectionBadge: 'Structured Execution',
    workflowSectionHeading: 'How This Service Works',
    workflowSectionSubtext: 'A battle-tested 4-step framework from initial document intake to final certified filing.',
    benefitsSectionBadge: 'Measurable Value',
    benefitsSectionHeading: 'Proven Benefits & Efficiency Gains',
    faqsSectionBadge: 'Clarifications',
    faqsSectionHeading: 'Frequently Asked Questions',
    ctaBannerBadge: 'Ready to Engage?',
    ctaBannerSubtext: 'Book a 1-on-1 discovery consultation. We will preselect this service, evaluate your filing deadlines, and provide a clear, transparent engagement proposal.',
    ctaButtonText: 'Book Consultation Now',
  });
  const { settings } = useGlobalSettings();
  const calendlyDynamicUrl = settings.consultationSettings?.defaultCalendlyUrl;

  useEffect(() => {
    servicesApi.getPageConfig()
      .then((cfg) => {
        if (cfg && typeof cfg === 'object') {
          setSectionConfig((prev: any) => ({ ...prev, ...cfg }));
        }
      })
      .catch(() => {});
  }, []);

  // Scroll to top when service changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setOpenFaqIndex(0);
  }, [service.slug]);

  const categoryObj = CLIENT_CATEGORIES.find(c => c.id === service.category);
  const relatedServices = SERVICES_CATALOG.filter(s =>
    service.relatedSlugs?.includes(s.slug) || (s.category === service.category && s.slug !== service.slug)
  ).slice(0, 3);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div
      className={`service-detail-page pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${
        service.slug === 'tax-prep-outsourcing'
          ? 'service-detail-page--preparation'
          : service.slug === 'business-tax-planning'
            ? 'service-detail-page--planning'
            : ''
      }`}
    >
      {/* 1. Breadcrumbs & Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 text-xs font-medium text-[#476067] dark:text-[#A8C0C6]">
        <nav className="flex items-center gap-2">
          <button
            onClick={onBackToHome}
            className="hover:text-[#12242B] dark:hover:text-[#F4FBFC] transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={onBackToCatalog}
            className="hover:text-[#12242B] dark:hover:text-[#F4FBFC] transition-colors"
          >
            Services Catalog
          </button>
          <span>/</span>
          <span className="capitalize">{categoryObj?.label || service.category}</span>
          <span>/</span>
          <span className="text-[#12242B] dark:text-[#F4FBFC] font-semibold">{service.name}</span>
        </nav>

        <button
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-semibold text-[#12242B] dark:text-[#F4FBFC] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All 20 Services</span>
        </button>
      </div>

      {/* 2. Hero Section */}
      <section className="service-detail-hero relative mb-16 overflow-hidden rounded-3xl border border-[#DCE5E2] bg-gradient-to-br from-white via-[#F4F9F8] to-[#E8F3F1] p-5 shadow-xl dark:border-[rgba(121,241,232,0.2)] dark:from-[#05161D] dark:via-[#071C25] dark:to-[#0A2632] sm:p-8 lg:p-9">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#49E3D6]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="service-detail-hero__grid relative z-10">
          <div className="service-detail-hero__content min-w-0">
            <div className="service-reference-hero-meta mb-4 flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#17383F] text-white dark:bg-[#49E3D6] dark:text-[#03181E] uppercase tracking-wider">
                {categoryObj?.label || service.category}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                <Clock className="w-3.5 h-3.5" />
                <span>SLA: {service.turnaroundTime}</span>
              </span>
              {service.popular && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Featured Practice</span>
                </span>
              )}
            </div>

            <EditableElement
              sectionKey="service_detail"
              elementKey="name"
              elementType="heading"
              label="Service Title"
              value={service.name}
            >
              <h1 className="service-reference-hero-title mb-5 text-3xl font-bold font-serif-editorial leading-[1.08] tracking-tight text-[#12242B] dark:text-[#F4FBFC] sm:text-4xl xl:text-5xl">
                {service.name}
              </h1>
            </EditableElement>

            <EditableElement
              sectionKey="service_detail"
              elementKey="heroTagline"
              elementType="paragraph"
              label="Service Tagline"
              value={service.heroTagline || service.shortDescription}
            >
              <p className="service-reference-hero-lead mb-7 max-w-none text-base font-medium leading-relaxed text-[#315F69] dark:text-[#A8C0C6] sm:text-lg">
                {service.heroTagline || service.shortDescription}
              </p>
            </EditableElement>

            <div className="service-reference-hero-actions mb-7 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenConsultation(service.category, service.slug)}
                className="service-reference-primary-button inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full text-sm font-semibold bg-[#17383F] hover:bg-[#0F282E] text-white dark:bg-[#49E3D6] dark:hover:bg-[#7DF5E8] dark:text-[#03181E] shadow-lg transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Consultation for This Service</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openCalendlyPopup(undefined, calendlyDynamicUrl)}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-sm font-semibold border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.25)] bg-white/60 dark:bg-black/20 hover:bg-white dark:hover:bg-white/10 text-[#12242B] dark:text-[#F4FBFC] transition-all"
              >
                <Calendar className="w-4 h-4 text-[#315F69] dark:text-[#49E3D6]" />
                <span>Book on Calendly</span>
              </button>

              <a
                href="#interactive-demo"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-sm font-semibold border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.25)] bg-white/60 dark:bg-black/20 hover:bg-white dark:hover:bg-white/10 text-[#12242B] dark:text-[#F4FBFC] transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#315F69] dark:text-[#49E3D6]" />
                <span>Try Live Demonstration</span>
              </a>
            </div>

            {/* Quick Specifications Pill bar */}
            <div className="service-reference-hero-specs grid grid-cols-1 gap-3 border-t border-[#DCE5E2]/60 pt-5 dark:border-[#102C38] sm:grid-cols-3 sm:gap-2">
              <div className="flex items-center gap-2.5 text-xs text-[#476067] dark:text-[#A8C0C6]">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="min-w-0 leading-relaxed"><strong>Compliance:</strong> IRS Circular 230 &amp; SOC-2</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#476067] dark:text-[#A8C0C6]">
                <Layers className="w-4 h-4 text-[#315F69] dark:text-[#49E3D6] shrink-0" />
                <span className="min-w-0 leading-relaxed"><strong>Ideal For:</strong> {service.idealFor}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#476067] dark:text-[#A8C0C6]">
                <FileCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="min-w-0 leading-relaxed"><strong>Review:</strong> Dual CPA Signoff Standard</span>
              </div>
            </div>
          </div>

          <div className="service-detail-hero__visual min-w-0">
            <ServiceLiveHeroAnimation service={service} />
          </div>
        </div>
      </section>

      {/* 3. What This Service Includes & Deliverables */}
      <section className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#315F69] dark:text-[#7DF5E8]">
            {sectionConfig.featuresSectionBadge || 'Comprehensive Scope'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif-editorial text-[#12242B] dark:text-[#F4FBFC] mt-1">
            {sectionConfig.featuresSectionHeading || "What This Service Includes"}
          </h2>
          <p className="text-sm text-[#476067] dark:text-[#A8C0C6] mt-2">
            {sectionConfig.featuresSectionSubtext || 'Every engagement is engineered for complete tax efficiency, zero filing errors, and audit-ready documentation.'}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {service.features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-[#071C25] border border-[#DCE5E2] dark:border-[#102C38] shadow-sm hover:border-[#315F69] dark:hover:border-[#49E3D6]/40 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-[#49E3D6]/15 text-[#17383F] dark:text-[#49E3D6] flex items-center justify-center shrink-0 font-bold text-sm">
                  0{idx + 1}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#12242B] dark:text-[#F4FBFC] mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#476067] dark:text-[#A8C0C6] leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Official Deliverables Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#E2EBE8] dark:border-[#102C38]">
          <h3 className="text-sm sm:text-base font-bold text-[#12242B] dark:text-[#F4FBFC] mb-4 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-500" />
            {sectionConfig.deliverablesBoxHeading || 'Official Deliverables You Receive:'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {service.deliverables.map((del, dIdx) => (
              <div
                key={dIdx}
                className="p-3.5 rounded-xl bg-white dark:bg-[#071C25] border border-[#DCE5E2] dark:border-[#102C38] flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#12242B] dark:text-[#F4FBFC]"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{del}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Four-Step Workflow Timeline */}
      <section className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#315F69] dark:text-[#7DF5E8]">
            {sectionConfig.workflowSectionBadge || 'Structured Execution'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif-editorial text-[#12242B] dark:text-[#F4FBFC] mt-1">
            {sectionConfig.workflowSectionHeading || 'How This Service Works'}
          </h2>
          <p className="text-sm text-[#476067] dark:text-[#A8C0C6] mt-2">
            {sectionConfig.workflowSectionSubtext || 'A battle-tested 4-step framework from initial document intake to final certified filing.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {service.workflow.map((st) => (
            <div
              key={st.step}
              className="p-5 rounded-2xl bg-white dark:bg-[#071C25] border border-[#DCE5E2] dark:border-[#102C38] relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold font-serif-editorial text-[#315F69] dark:text-[#49E3D6]">
                    {st.step}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[#476067] dark:text-[#A8C0C6]">
                    Phase {st.step}
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#12242B] dark:text-[#F4FBFC] mb-2">
                  {st.title}
                </h4>
                <p className="text-xs text-[#476067] dark:text-[#A8C0C6] leading-relaxed mb-4">
                  {st.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E2EBE8] dark:border-[#102C38] text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Deliverable: {st.deliverable}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Interactive Operational Demonstration */}
      <section id="interactive-demo" className="mb-16 scroll-mt-28">
        <ServiceDemonstration service={service} />
      </section>

      {/* 6. Measurable Value & Benefits */}
      <section className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#315F69] dark:text-[#7DF5E8]">
            {sectionConfig.benefitsSectionBadge || 'Measurable Value'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif-editorial text-[#12242B] dark:text-[#F4FBFC] mt-1">
            {sectionConfig.benefitsSectionHeading || 'Proven Benefits & Efficiency Gains'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {service.benefits.map((b, bIdx) => (
            <div
              key={bIdx}
              className="p-6 rounded-2xl bg-white dark:bg-[#071C25] border border-[#DCE5E2] dark:border-[#102C38] shadow-sm flex flex-col justify-between"
            >
              <div>
                {b.stat && (
                  <div className="text-3xl sm:text-4xl font-bold font-mono text-[#315F69] dark:text-[#49E3D6] mb-2">
                    {b.stat}
                  </div>
                )}
                <h3 className="text-base sm:text-lg font-bold text-[#12242B] dark:text-[#F4FBFC] mb-2">
                  {b.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#476067] dark:text-[#A8C0C6] leading-relaxed">
                  {b.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Frequently Asked Questions Accordion */}
      <section className="mb-16 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#315F69] dark:text-[#7DF5E8]">
            {sectionConfig.faqsSectionBadge || 'Clarifications'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-editorial text-[#12242B] dark:text-[#F4FBFC] mt-1">
            {sectionConfig.faqsSectionHeading || 'Frequently Asked Questions'}
          </h2>
        </div>

        <div className="space-y-3">
          {service.faqs.map((faq, fIdx) => (
            <div
              key={fIdx}
              className="rounded-2xl border border-[#DCE5E2] dark:border-[#102C38] bg-white dark:bg-[#071C25] overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(fIdx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="font-bold text-sm sm:text-base text-[#12242B] dark:text-[#F4FBFC]">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#476067] dark:text-[#A8C0C6] shrink-0 transition-transform duration-200 ${openFaqIndex === fIdx ? 'rotate-180 text-[#315F69] dark:text-[#49E3D6]' : ''
                    }`}
                />
              </button>
              {openFaqIndex === fIdx && (
                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#476067] dark:text-[#A8C0C6] leading-relaxed border-t border-[#E2EBE8] dark:border-[#102C38]/60">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. Dedicated Preselected Consultation CTA Banner */}
      <section className="mb-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#17383F] to-[#0B252B] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7DF5E8]">
              {sectionConfig.ctaBannerBadge || 'Ready to Engage?'}
            </span>
            <h3 className="text-2xl sm:text-4xl font-bold font-serif-editorial mt-1 mb-2">
              Get Started with {service.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
              {sectionConfig.ctaBannerSubtext || 'Book a 1-on-1 discovery consultation. We will preselect this service, evaluate your filing deadlines, and provide a clear, transparent engagement proposal.'}
            </p>
          </div>

          <button
            onClick={() => onOpenConsultation(service.category, service.slug)}
            className="service-reference-primary-button px-8 py-4 rounded-full text-sm font-bold bg-[#49E3D6] hover:bg-[#7DF5E8] text-[#03181E] shadow-xl transition-all flex items-center gap-2 shrink-0"
          >
            <span>{sectionConfig.ctaButtonText || 'Book Consultation Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 9. Related Services */}
      {relatedServices.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold font-serif-editorial text-[#12242B] dark:text-[#F4FBFC]">
              Related Advisory Services
            </h3>
            <button
              onClick={onBackToCatalog}
              className="text-xs font-bold text-[#315F69] dark:text-[#49E3D6] hover:underline"
            >
              View Full Catalog →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedServices.map(rel => (
              <div
                key={rel.slug}
                onClick={() => onNavigateService(rel.slug)}
                className="p-5 rounded-2xl bg-white dark:bg-[#071C25] border border-[#DCE5E2] dark:border-[#102C38] hover:border-[#315F69] dark:hover:border-[#49E3D6]/50 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#315F69] dark:text-[#7DF5E8]">
                    {rel.category}
                  </span>
                  <h4 className="text-base font-bold text-[#12242B] dark:text-[#F4FBFC] mt-1 mb-1">
                    {rel.name}
                  </h4>
                  <p className="text-xs text-[#476067] dark:text-[#A8C0C6] line-clamp-2">
                    {rel.shortDescription}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E2EBE8] dark:border-[#102C38] flex items-center justify-between text-xs font-semibold text-[#315F69] dark:text-[#49E3D6]">
                  <span>Explore Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
