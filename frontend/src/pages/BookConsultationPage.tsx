import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { ConsultationForm } from '../components/ConsultationForm';
import { RightBookingPopup } from '../components/RightBookingPopup';
import { CalendlyInline } from '../components/CalendlyWidget';
import { useGlobalSettings } from '../context/GlobalSettingsContext';
import { ClientCategory, SERVICES_CATALOG } from '../data/services';
import { EditableElement } from '../components/EditableElement';
import { usePageContent } from '../hooks/usePageContent';
import { EditableSectionContainer } from '../components/EditableSectionContainer';

export function BookConsultationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getSection, isSectionEnabled } = usePageContent('book-consultation');
  const { settings } = useGlobalSettings();
  const consultationSettings = settings.consultationSettings;
  const calendlyDynamicUrl = consultationSettings?.defaultCalendlyUrl;
  const bookingDisplayMode = consultationSettings?.bookingDisplayMode || 'popup';

  const heroSection = getSection('hero');
  const bookingSection = getSection('booking_form');
  const trustSection = getSection('trust_pillars');
  const trustPillars = Array.isArray(trustSection?.parsedContent?.items) && trustSection.parsedContent.items.length
    ? trustSection.parsedContent.items
    : [
        { title: '24-Hour Partner Response', description: 'Every booking request is evaluated by a senior practice director within one business day with proposed meeting slots.' },
        { title: 'Strict Non-Disclosure (NDA)', description: 'All discussions and shared firm documents are strictly confidential, governed by institutional non-disclosure standards.' },
        { title: 'Zero Pressure Discovery', description: 'Our consultations focus purely on feasibility, staffing bandwidth, software compatibility, and tangible cost-benefit analysis.' },
      ];
  const badgeText = heroSection?.parsedContent?.badge || 'Executive Consultation Scheduling';
  const titleText = heroSection?.title || 'Book Your Strategic Consultation';
  const descText = heroSection?.description || 'Connect directly with our senior Enrolled Agents and CPA practice directors. We will analyze your tax compliance requirements, review software integrations, and structure a custom engagement model.';

  const categoryParam = searchParams.get('category');
  const serviceParam = searchParams.get('service');

  const validCategory: ClientCategory =
    categoryParam && ['individual', 'business', 'cpa'].includes(categoryParam)
      ? (categoryParam as ClientCategory)
      : 'cpa';

  const validServiceSlug =
    serviceParam && SERVICES_CATALOG.some(s => s.slug === serviceParam)
      ? serviceParam
      : '';

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Return to home button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#526168] dark:text-[#A8C0C6] hover:text-[#17252B] dark:hover:text-[#F3FBFC] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Homepage</span>
        </button>
      </div>

      {/* Header */}
      <EditableSectionContainer sectionKey="hero" sectionTitle="Consultation Introduction" isEnabled={isSectionEnabled('hero')} sectionData={heroSection}>
      <div className="max-w-3xl mb-12">
        <EditableElement
          sectionKey="hero"
          elementKey="badge"
          elementType="badge"
          label="Consultation Eyebrow"
          value={badgeText}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#E4F0EE] dark:bg-[rgba(44,207,197,0.12)] text-[#315F69] dark:text-[#79F1E8] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.25)] mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>{badgeText}</span>
          </div>
        </EditableElement>

        <EditableElement
          sectionKey="hero"
          elementKey="title"
          elementType="heading"
          label="Consultation Headline"
          value={titleText}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#17252B] dark:text-[#F3FBFC] font-serif-editorial">
            {titleText}
          </h1>
        </EditableElement>

        <EditableElement
          sectionKey="hero"
          elementKey="description"
          elementType="paragraph"
          label="Consultation Description"
          value={descText}
        >
          <p className="mt-4 text-base sm:text-lg text-[#526168] dark:text-[#A8C0C6] leading-relaxed">
            {descText}
          </p>
        </EditableElement>
      </div>
      </EditableSectionContainer>

      {/* Interactive Form Component */}
      <EditableSectionContainer sectionKey="booking_form" sectionTitle="Consultation Booking Form" isEnabled={isSectionEnabled('booking_form')} sectionData={bookingSection}>
      <div className="mb-16">
        {(bookingSection?.title || bookingSection?.description) && (
          <div className="mb-6 text-center">
            {bookingSection.title && <h2 className="text-2xl font-bold text-[#17252B] dark:text-[#F3FBFC]">{bookingSection.title}</h2>}
            {bookingSection.description && <p className="mt-2 text-sm text-[#526168] dark:text-[#A8C0C6]">{bookingSection.description}</p>}
          </div>
        )}
        <ConsultationForm
          initialCategory={validCategory}
          initialServiceSlug={validServiceSlug}
        />
      </div>
      </EditableSectionContainer>

      {/* Inline Calendly booking section (when configured for inline mode) */}
      {bookingDisplayMode === 'inline' && (
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17252B] dark:text-[#F3FBFC]">
              Or Schedule Directly on Our Live Calendar
            </h2>
            <p className="mt-3 text-sm text-[#526168] dark:text-[#A8C0C6]">
              Pick a time that works for you — a meeting link is generated automatically.
            </p>
          </div>
          <div className="rounded-3xl border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.22)] shadow-2xl overflow-hidden glass-panel">
            <CalendlyInline dynamicUrl={calendlyDynamicUrl} height={700} />
          </div>
        </div>
      )}

      {/* Consultation FAQ / Trust Pillars */}
      <EditableSectionContainer sectionKey="trust_pillars" sectionTitle="Consultation Trust Pillars" isEnabled={isSectionEnabled('trust_pillars')} sectionData={trustSection}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-black/5 dark:border-white/5">
        {trustPillars.map((pillar: { title?: string; description?: string }, index: number) => (
          <div key={index} className="p-6 rounded-2xl bg-black/5 dark:bg-white/5">
            <div className="w-8 h-8 rounded-xl bg-[#315F69] text-white dark:bg-[#49E3D6] dark:text-[#03181E] flex items-center justify-center mb-3">
              {index === 0 ? <Clock className="w-4 h-4" /> : index === 1 ? <Lock className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </div>
            <h3 className="text-sm font-bold text-[#17252B] dark:text-[#F3FBFC] mb-1">
              {pillar.title}
            </h3>
            <p className="text-xs text-[#526168] dark:text-[#A8C0C6] leading-relaxed">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
      </EditableSectionContainer>

      {/* Right-side 15-second Calendly booking popup */}
      <RightBookingPopup delaySeconds={15} />
    </div>
  );
}
