import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CinematicHeroChapter } from '../components/CinematicHeroChapter';
import { EditorialServiceShowcase } from '../components/EditorialServiceShowcase';
import { FinancialClarityChapter } from '../components/FinancialClarityChapter';
import { CpaCollaborationPipeline } from '../components/CpaCollaborationPipeline';
import { EditorialInsightsChapter } from '../components/EditorialInsightsChapter';
import { CinematicClosingChapter } from '../components/CinematicClosingChapter';
import { VideoShowcase } from '../components/media/VideoShowcase';
import { DataFlowDiagram } from '../components/graphics/DataFlowDiagram';
import { UsTaxCalculatorModal } from '../components/UsTaxCalculatorModal';
import { EditableSectionContainer } from '../components/EditableSectionContainer';
import { DynamicSectionRenderer } from '../components/DynamicSectionRenderer';
import { ClientCategory } from '../data/services';
import { useBidirectionalScrollReveal } from '../utils/scrollAnimations';
import { usePageContent } from '../hooks/usePageContent';

import './Home.css';

export function Home() {
  const navigate = useNavigate();
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const { getSection, sections, isSectionEnabled } = usePageContent('home');

  // Any newly added custom sections beyond the standard core 7
  const customSections = sections.filter(
    (s) =>
      !['hero', 'services_showcase', 'media_showcase', 'financial_clarity', 'human_expertise', 'cpa_pipeline', 'data_flow', 'editorial_insights', 'closing_cta'].includes(
        s.sectionKey
      ) && s.isEnabled !== false
  );

  // Keep the existing bidirectional reveal behavior.
  useBidirectionalScrollReveal();

  const handleOpenConsultation = (
    category?: ClientCategory | string,
    serviceSlug?: string
  ) => {
    const params = new URLSearchParams();

    if (category) params.set('category', category);
    if (serviceSlug) params.set('service', serviceSlug);

    const query = params.toString();
    navigate(query ? `/book-consultation?${query}` : '/book-consultation');
  };

  const handleExploreWork = () => {
    document.getElementById('services-preview')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };


  // Pointer-driven RGB light and subtle 3D tilt are scoped to this page.
  // Existing child-component behavior and navigation are left intact.
  const activeCardRef = React.useRef<HTMLElement | null>(null);

  const clearActiveCard = () => {
    const activeCard = activeCardRef.current;
    if (!activeCard) return;

    activeCard.removeAttribute('data-home-rgb-active');
    activeCard.style.removeProperty('--home-card-tilt-x');
    activeCard.style.removeProperty('--home-card-tilt-y');
    activeCard.style.removeProperty('--home-card-glow-x');
    activeCard.style.removeProperty('--home-card-glow-y');
    activeCardRef.current = null;
  };

  const handleHomePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return;

    const root = event.currentTarget;
    const rootRect = root.getBoundingClientRect();
    const pointerX = ((event.clientX - rootRect.left) / Math.max(rootRect.width, 1)) * 100;
    const pointerY = ((event.clientY - rootRect.top) / Math.max(rootRect.height, 1)) * 100;

    root.style.setProperty('--home-pointer-x', `${pointerX}%`);
    root.style.setProperty('--home-pointer-y', `${pointerY}%`);

    const eventTarget = event.target;
    if (!(eventTarget instanceof Element)) {
      clearActiveCard();
      return;
    }

    // Only cards/panels are tilted; whole chapters never tilt.
    const candidate = eventTarget.closest<HTMLElement>(
      'article, [data-3d-card], .glass-panel, [class*="__card"], [class*="-card"], [class*="Card"]'
    );

    if (!candidate || !root.contains(candidate) || candidate.closest('.home-premium__ambient')) {
      clearActiveCard();
      return;
    }

    if (activeCardRef.current && activeCardRef.current !== candidate) {
      clearActiveCard();
    }

    const cardRect = candidate.getBoundingClientRect();
    const cardX = (event.clientX - cardRect.left) / Math.max(cardRect.width, 1);
    const cardY = (event.clientY - cardRect.top) / Math.max(cardRect.height, 1);
    const tiltX = (0.5 - cardY) * 5.2;
    const tiltY = (cardX - 0.5) * 6.2;

    candidate.setAttribute('data-home-rgb-active', 'true');
    candidate.style.setProperty('--home-card-tilt-x', `${tiltX.toFixed(2)}deg`);
    candidate.style.setProperty('--home-card-tilt-y', `${tiltY.toFixed(2)}deg`);
    candidate.style.setProperty('--home-card-glow-x', `${(cardX * 100).toFixed(1)}%`);
    candidate.style.setProperty('--home-card-glow-y', `${(cardY * 100).toFixed(1)}%`);
    activeCardRef.current = candidate;
  };

  const handleHomePointerLeave = (event: React.PointerEvent<HTMLElement>) => {
    clearActiveCard();
    event.currentTarget.style.setProperty('--home-pointer-x', '50%');
    event.currentTarget.style.setProperty('--home-pointer-y', '18%');
  };

  return (
    <main
      className="home-premium"
      onPointerMove={handleHomePointerMove}
      onPointerLeave={handleHomePointerLeave}
    >
      {/* CHAPTER 1 — CINEMATIC HERO */}
      <EditableSectionContainer sectionKey="hero" sectionTitle="Hero Chapter" isEnabled={isSectionEnabled('hero')}>
        <section className="home-premium__chapter home-premium__hero" data-home-section="hero">
          <div
            className="home-premium__ambient home-premium__ambient--hero"
            aria-hidden="true"
          />
          <CinematicHeroChapter
            cmsContent={getSection('hero')}
            onOpenConsultation={(cat, srv) =>
              handleOpenConsultation(cat as ClientCategory, srv)
            }
            onExploreWork={handleExploreWork}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
          />
        </section>
      </EditableSectionContainer>

      {/* CHAPTER 2 — SERVICE SHOWCASE */}
      <EditableSectionContainer sectionKey="services_showcase" sectionTitle="Core Practice Areas" isEnabled={isSectionEnabled('services_showcase')} sectionData={getSection('services_showcase')}>
        <section
          id="services-preview"
          className="home-premium__chapter home-premium__services scroll-reveal-depth"
          data-home-section="services"
        >
          <div
            className="home-premium__ambient home-premium__ambient--services"
            aria-hidden="true"
          />
          <EditorialServiceShowcase
            cmsContent={getSection('services_showcase')}
            onSelectServiceForConsultation={(cat, slug) =>
              handleOpenConsultation(cat, slug)
            }
            onExploreAll={() => navigate('/services')}
            onViewServiceDetails={(slug) => navigate(`/services/${slug}`)}
          />
        </section>
      </EditableSectionContainer>

      {/* CHAPTER 3 — FINANCIAL CLARITY */}
      <EditableSectionContainer sectionKey="financial_clarity" sectionTitle="Financial Clarity & Calculators" isEnabled={isSectionEnabled('financial_clarity')} sectionData={getSection('financial_clarity')}>
        <EditableSectionContainer sectionKey="data_flow" sectionTitle="Secure Data Flow" isEnabled={isSectionEnabled('data_flow')} sectionData={getSection('data_flow')}>
          <section
            className="home-premium__chapter home-premium__clarity scroll-reveal-depth"
            data-home-section="financial-clarity"
          >
            <div
              className="home-premium__ambient home-premium__ambient--clarity"
              aria-hidden="true"
            />
            <FinancialClarityChapter
              cmsContent={getSection('financial_clarity')}
              onOpenConsultation={(cat, srv) =>
                handleOpenConsultation(cat as ClientCategory, srv)
              }
            />
          </section>
        </EditableSectionContainer>

        {/* CHAPTER 5 — CPA COLLABORATION */}
        <EditableSectionContainer sectionKey="cpa_pipeline" sectionTitle="CPA Collaboration Pipeline" isEnabled={isSectionEnabled('cpa_pipeline')} sectionData={getSection('cpa_pipeline')}>
          <section
            className="home-premium__chapter home-premium__collaboration scroll-reveal-depth"
            data-home-section="cpa-collaboration"
          >
            <div
              className="home-premium__ambient home-premium__ambient--collaboration"
              aria-hidden="true"
            />
            <CpaCollaborationPipeline
              cmsContent={getSection('cpa_pipeline')}
              onRequestPilot={() =>
                handleOpenConsultation('cpa', 'tax-prep-outsourcing')
              }
            />
          </section>
        </EditableSectionContainer>

        {/* ENCRYPTED DATA FLOW VISUALIZATION */}
        <section
          className="home-premium__chapter home-premium__data-flow scroll-reveal-depth"
          data-home-section="data-flow"
          aria-label="Data flow visualization"
        >
          <div
            className="home-premium__ambient home-premium__ambient--data-flow"
            aria-hidden="true"
          />
          <div className="home-premium__content mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <DataFlowDiagram cmsContent={getSection('data_flow')} />
          </div>
        </section>
      </EditableSectionContainer>

      {/* CHAPTER 6 — INSIGHTS */}
      <EditableSectionContainer sectionKey="editorial_insights" sectionTitle="Strategic Insights & Memos" isEnabled={isSectionEnabled('editorial_insights')} sectionData={getSection('editorial_insights')}>
        <section
          className="home-premium__chapter home-premium__insights scroll-reveal-depth"
          data-home-section="insights"
        >
          <div
            className="home-premium__ambient home-premium__ambient--insights"
            aria-hidden="true"
          />
          <EditorialInsightsChapter cmsContent={getSection('editorial_insights')} />
        </section>
      </EditableSectionContainer>

      {/* CHAPTER 7 — CLOSING CONSULTATION CTA */}
      <EditableSectionContainer sectionKey="closing_cta" sectionTitle="Closing Engagement CTA" isEnabled={isSectionEnabled('closing_cta')} sectionData={getSection('closing_cta')}>
        <section
          className="home-premium__chapter home-premium__closing scroll-reveal-depth"
          data-home-section="closing"
        >
          <div
            className="home-premium__ambient home-premium__ambient--closing"
            aria-hidden="true"
          />
          <CinematicClosingChapter
            cmsContent={getSection('closing_cta')}
            initialCategory="cpa"
            initialServiceSlug="tax-prep-outsourcing"
          />
        </section>
      </EditableSectionContainer>

      {/* DYNAMIC NEW CUSTOM SECTIONS ADDED VIA BUILDER */}
      {customSections.map((sec) => (
        <EditableSectionContainer
          key={sec.id}
          sectionKey={sec.sectionKey}
          sectionTitle={sec.title || sec.sectionType}
          sectionData={sec}
        >
          <DynamicSectionRenderer section={sec} />
        </EditableSectionContainer>
      ))}

      {/* Global Interactive US Income Tax Calculator Modal */}
      <UsTaxCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onBookConsultation={() => handleOpenConsultation('cpa')}
      />
    </main>
  );
}
