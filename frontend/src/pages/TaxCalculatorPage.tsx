import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, ShieldCheck } from 'lucide-react';
import { UsTaxCalculatorModal } from '../components/UsTaxCalculatorModal';
import { EditableElement } from '../components/EditableElement';
import { usePageContent } from '../hooks/usePageContent';
import { EditableSectionContainer } from '../components/EditableSectionContainer';

export function TaxCalculatorPage() {
  const navigate = useNavigate();
  const { getSection, isSectionEnabled } = usePageContent('tax-calculator');

  const heroSection = getSection('hero');
  const calcSection = getSection('calculator');
  const badgeText = calcSection?.parsedContent?.badge || 'IRS Revenue Procedure 2024-40 Compliant';
  const titleText = heroSection?.title || 'US Income Tax Calculation Engine';
  const descText = heroSection?.description || 'Interactive multi-tier tax calculator for US Federal, State, and Local income taxes for Tax Years 2024 and 2025.';

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#52646A] dark:text-[#B6CAD0] hover:text-[#17262B] dark:hover:text-[#F2FBF7] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Homepage</span>
        </button>
      </div>

      <EditableSectionContainer sectionKey="hero" sectionTitle="Tax Calculator Introduction" isEnabled={isSectionEnabled('hero')} sectionData={heroSection}>
      <div className="text-center max-w-2xl mx-auto mb-10">
        <EditableElement
          sectionKey="calculator"
          elementKey="badge"
          elementType="badge"
          label="Compliance Badge"
          value={badgeText}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#22AF68]/15 text-[#1A8650] dark:text-[#35E092] border border-[#22AF68]/30 mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>{badgeText}</span>
          </div>
        </EditableElement>

        <EditableElement
          sectionKey="calculator"
          elementKey="title"
          elementType="heading"
          label="Calculator Page Title"
          value={titleText}
        >
          <h1 className="text-3xl sm:text-5xl font-bold font-serif-editorial text-[#17262B] dark:text-[#F2FBF7] tracking-tight">
            {titleText}
          </h1>
        </EditableElement>

        <EditableElement
          sectionKey="calculator"
          elementKey="description"
          elementType="paragraph"
          label="Calculator Page Description"
          value={descText}
        >
          <p className="mt-3 text-sm sm:text-base text-[#52646A] dark:text-[#B6CAD0] leading-relaxed">
            {descText}
          </p>
        </EditableElement>
      </div>

      </EditableSectionContainer>
      <EditableSectionContainer sectionKey="calculator" sectionTitle="Tax Calculator" isEnabled={isSectionEnabled('calculator')} sectionData={calcSection}>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-[#17262B] dark:text-[#F2FBF7]">{calcSection?.title || 'Interactive Estimator'}</h2>
        <p className="mt-2 text-sm text-[#52646A] dark:text-[#B6CAD0]">{calcSection?.description || 'Input income and deductions for immediate estimations.'}</p>
      </div>
      <UsTaxCalculatorModal
        isOpen={true}
        onClose={() => navigate('/')}
        onBookConsultation={() => navigate('/book-consultation')}
      />
      </EditableSectionContainer>
    </div>
  );
}
