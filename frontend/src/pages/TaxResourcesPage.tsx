import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  ArrowUpRight,
  ArrowRight,
  Calculator,
  Scale,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import {
  IRS_TAX_BRACKETS_2025,
  STANDARD_DEDUCTIONS_2025,
} from '../data/taxCalculator';
import type { FilingStatus } from '../data/taxCalculator';
import { LedgerIllustration } from '../components/graphics/LedgerIllustration';
import { EditableElement } from '../components/EditableElement';
import { usePageContent } from '../hooks/usePageContent';
import { EditableSectionContainer } from '../components/EditableSectionContainer';
import './TaxResourcesPage.css';

const DEADLINES_2025 = [
  {
    date: 'January 15, 2025',
    title: 'Q4 2024 Estimated Tax Payment',
    description:
      'Deadline for individuals and businesses paying fourth-quarter estimated taxes (Form 1040-ES).',
  },
  {
    date: 'January 31, 2025',
    title: 'W-2 & 1099-NEC Distribution',
    description:
      'Employers must furnish Form W-2 to employees and Form 1099-NEC to independent contractors and the IRS.',
  },
  {
    date: 'March 15, 2025',
    title: 'S-Corporation & Partnership Filing (Form 1120-S / 1065)',
    description:
      'Crucial deadline for calendar-year pass-through entities. Extension request (Form 7004) grants 6 additional months.',
  },
  {
    date: 'April 15, 2025',
    title: 'Individual & C-Corporation Tax Day (Form 1040 / 1120)',
    description:
      'Federal income tax filing & payment deadline. Last day to contribute to traditional and Roth IRAs for 2024.',
  },
  {
    date: 'June 16, 2025',
    title: 'Q2 2025 Estimated Tax Payment',
    description:
      'Second-quarter estimated payment due for self-employed individuals and pass-through owners.',
  },
  {
    date: 'September 15, 2025',
    title: 'Extended S-Corp & Partnership Deadline',
    description:
      'Final deadline for calendar-year S-Corporations and Partnerships that filed Form 7004.',
  },
  {
    date: 'October 15, 2025',
    title: 'Extended Individual & C-Corp Deadline',
    description:
      'Final deadline for calendar-year taxpayers granted a 6-month extension (Form 4868).',
  },
];

const FILING_STATUSES: { key: FilingStatus; label: string }[] = [
  { key: 'single', label: 'Single' },
  { key: 'marriedJoint', label: 'Married Filing Jointly' },
  { key: 'headOfHousehold', label: 'Head of Household' },
];

const money = (value: number) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

export function TaxResourcesPage() {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] =
    useState<FilingStatus>('single');
  const [incomeInput, setIncomeInput] = useState<number>(125000);
  const { getSection, isSectionEnabled } = usePageContent('tax-resources');

  const heroSection = getSection('hero');
  const estimatorSection = getSection('estimator');
  const deadlinesSection = getSection('deadlines');
  const ledgerSection = getSection('ledger');
  const deadlines = Array.isArray(deadlinesSection?.parsedContent?.items) && deadlinesSection.parsedContent.items.length
    ? deadlinesSection.parsedContent.items
    : DEADLINES_2025;
  const eyebrowText = heroSection?.parsedContent?.eyebrow || 'Tax Intelligence Hub';
  const headlineText = heroSection?.title || '2025 Tax Rates, Deadlines & Planning References';
  const descriptionText = heroSection?.description || 'Official IRS inflation-adjusted thresholds, statutory deadlines, and interactive tools for individuals, businesses, and CPA partners.';

  // Calculate estimated tax using the existing 2025 data module.
  const brackets = IRS_TAX_BRACKETS_2025[selectedStatus];
  const standardDeduction = STANDARD_DEDUCTIONS_2025[selectedStatus];
  const taxableIncome = Math.max(0, incomeInput - standardDeduction);

  let calculatedTax = 0;
  for (const bracket of brackets) {
    if (taxableIncome > bracket.min) {
      const bracketLimit = bracket.max ?? Infinity;
      const taxableInBracket =
        Math.min(taxableIncome, bracketLimit) - bracket.min;
      calculatedTax += taxableInBracket * bracket.rate;
    }
  }

  const effectiveRate =
    incomeInput > 0 ? (calculatedTax / incomeInput) * 100 : 0;

  const updatePointerGlow = (
    event: React.PointerEvent<HTMLElement>,
  ) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    element.style.setProperty(
      '--tax-pointer-x',
      `${event.clientX - rect.left}px`,
    );
    element.style.setProperty(
      '--tax-pointer-y',
      `${event.clientY - rect.top}px`,
    );
  };

  const resetPointerGlow = (
    event: React.PointerEvent<HTMLElement>,
  ) => {
    event.currentTarget.style.setProperty('--tax-pointer-x', '50%');
    event.currentTarget.style.setProperty('--tax-pointer-y', '50%');
  };

  return (
    <main className="tax-resources-premium">
      <div
        className="tax-resources-premium__background"
        aria-hidden="true"
      />
      <div
        className="tax-resources-premium__ambience"
        aria-hidden="true"
      >
        <span className="tax-resources-premium__orb tax-resources-premium__orb--teal" />
        <span className="tax-resources-premium__orb tax-resources-premium__orb--gold" />
        <span className="tax-resources-premium__grid" />
      </div>

      <div className="tax-resources-premium__container">
        {/* Original page heading and description */}
        <EditableSectionContainer sectionKey="hero" sectionTitle="Tax Resources Introduction" isEnabled={isSectionEnabled('hero')} sectionData={heroSection}>
        <header className="tax-resources-hero tax-resource-reveal">
          <div className="tax-resources-hero__copy">
            <EditableElement
              sectionKey="hero"
              elementKey="subheading"
              elementType="subheading"
              label="Resources Eyebrow"
              value={eyebrowText}
            >
              <div className="tax-resources-hero__eyebrow">
                <span className="tax-resources-hero__eyebrow-icon">
                  <BookOpen size={17} />
                </span>
                <span>{eyebrowText}</span>
                <i aria-hidden="true" />
              </div>
            </EditableElement>

            <EditableElement
              sectionKey="hero"
              elementKey="title"
              elementType="heading"
              label="Resources Headline"
              value={headlineText}
            >
              <h1 className="tax-resources-hero__title">
                {headlineText}
              </h1>
            </EditableElement>

            <EditableElement
              sectionKey="hero"
              elementKey="description"
              elementType="paragraph"
              label="Resources Description"
              value={descriptionText}
            >
              <p className="tax-resources-hero__description">
                {descriptionText}
              </p>
            </EditableElement>

            <div className="tax-resources-hero__trust">
              <span><ShieldCheck size={15} /> Planning references</span>
              <span><Scale size={15} /> Interactive estimator</span>
              <span><Sparkles size={15} /> Tax intelligence</span>
            </div>
          </div>

          <div className="tax-resources-hero__visual" aria-hidden="true">
            <div className="tax-resources-hero__visual-halo" />
            <div className="tax-resources-hero__document tax-resources-hero__document--back">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="tax-resources-hero__document tax-resources-hero__document--front">
              <div className="tax-resources-hero__document-top">
                <FileText size={21} />
                <span>IRS / TAX</span>
              </div>
              <div className="tax-resources-hero__chart">
                <i /><i /><i /><i /><i />
              </div>
              <div className="tax-resources-hero__doc-line" />
              <div className="tax-resources-hero__doc-line tax-resources-hero__doc-line--short" />
              <div className="tax-resources-hero__seal">
                <ShieldCheck size={22} />
              </div>
            </div>
            <span className="tax-resources-hero__floating-icon tax-resources-hero__floating-icon--one">
              <Calculator size={19} />
            </span>
            <span className="tax-resources-hero__floating-icon tax-resources-hero__floating-icon--two">
              <Scale size={19} />
            </span>
          </div>
        </header>
        </EditableSectionContainer>

        {/* Interactive 2025 Bracket Explorer */}
        <EditableSectionContainer sectionKey="estimator" sectionTitle="Tax Estimator" isEnabled={isSectionEnabled('estimator')} sectionData={estimatorSection}>
        <section
          className="tax-estimator tax-resource-reveal"
          aria-labelledby="tax-estimator-heading"
          onPointerMove={updatePointerGlow}
          onPointerLeave={resetPointerGlow}
        >
          <div className="tax-estimator__top">
            <div className="tax-estimator__heading">
              <span className="tax-estimator__icon">
                <Calculator size={21} />
              </span>
              <div>
                <span className="tax-section-kicker">Interactive tool</span>
                <h2 id="tax-estimator-heading">
                  {estimatorSection?.title || 'Interactive 2025 Federal Income Tax Estimator'}
                </h2>
                <p>
                  {estimatorSection?.description || 'Based on official IRS Revenue Procedure 2024-40 inflation adjustments for Tax Year 2025.'}
                </p>
              </div>
            </div>

            <div className="tax-estimator__statuses" aria-label="Filing status">
              {FILING_STATUSES.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={selectedStatus === key}
                  onClick={() => setSelectedStatus(key)}
                  className={`tax-status-button ${
                    selectedStatus === key ? 'is-active' : ''
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="tax-estimator__body">
            <div className="tax-income-control">
              <div className="tax-income-control__label-row">
                <label htmlFor="tax-income-range">
                  Gross Adjusted Income (AGI)
                </label>
                <output htmlFor="tax-income-range">
                  {money(incomeInput)}
                </output>
              </div>
              <input
                id="tax-income-range"
                type="range"
                min="20000"
                max="600000"
                step="5000"
                value={incomeInput}
                onChange={(event) =>
                  setIncomeInput(Number(event.target.value))
                }
              />
              <div className="tax-income-control__scale">
                <span>$20K</span>
                <span>$300K</span>
                <span>$600K</span>
              </div>
              <p className="tax-income-control__hint">
                Move the slider to explore an illustrative income level.
              </p>
            </div>

            <div className="tax-metric tax-metric--deduction">
              <span className="tax-metric__label">
                2025 Standard Deduction
              </span>
              <strong>{money(standardDeduction)}</strong>
              <span className="tax-metric__detail">
                Taxable Income: {money(taxableIncome)}
              </span>
              <span className="tax-metric__icon"><FileText size={18} /></span>
            </div>

            <div className="tax-metric tax-metric--estimate">
              <span className="tax-metric__label">
                Estimated Federal Tax
              </span>
              <strong>{money(Math.round(calculatedTax))}</strong>
              <span className="tax-metric__detail">
                Effective Rate: {effectiveRate.toFixed(1)}%
              </span>
              <span className="tax-metric__icon"><Calculator size={18} /></span>
            </div>
          </div>

          <div className="tax-estimator__footer">
            <span>
              <AlertCircle size={14} />
              Illustrative Financial Projection — Not Actual Company Data
            </span>
            <button
              type="button"
              onClick={() => navigate('/book-consultation')}
            >
              Review custom tax planning strategy
              <ArrowUpRight size={15} />
            </button>
          </div>
        </section>

        {/* Deadlines Section */}
        </EditableSectionContainer>

        <EditableSectionContainer sectionKey="deadlines" sectionTitle="Tax Deadlines" isEnabled={isSectionEnabled('deadlines')} sectionData={deadlinesSection}>
        <section className="tax-deadlines" aria-labelledby="tax-deadlines-heading">
          <div className="tax-section-heading tax-resource-reveal">
            <div>
              <span className="tax-section-kicker">Plan ahead</span>
              <h2 id="tax-deadlines-heading">
                <Calendar size={25} />
                {deadlinesSection?.title || '2025 Key Federal Filing Deadlines'}
              </h2>
              <p>
                {deadlinesSection?.description || 'Mark your calendar to ensure statutory compliance and avoid late-filing penalties.'}
              </p>
            </div>
            <div className="tax-section-heading__mark" aria-hidden="true">
              <Calendar size={27} />
            </div>
          </div>

          <div className="tax-deadlines__grid">
            {deadlines.map((deadline: typeof DEADLINES_2025[number], index: number) => (
              <article
                key={deadline.date}
                className="tax-deadline-card tax-resource-reveal"
                style={{ animationDelay: `${Math.min(index * 65, 390)}ms` }}
                onPointerMove={updatePointerGlow}
                onPointerLeave={resetPointerGlow}
              >
                <div className="tax-deadline-card__top">
                  <span className="tax-deadline-card__number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="tax-deadline-card__calendar">
                    <Calendar size={17} />
                  </span>
                </div>
                <time className="tax-deadline-card__date">{deadline.date}</time>
                <h3>{deadline.title}</h3>
                <p>{deadline.description}</p>
                <span className="tax-deadline-card__edge" aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        {/* Existing double-entry ledger illustration */}
        </EditableSectionContainer>

        <EditableSectionContainer sectionKey="ledger" sectionTitle="Ledger Guide" isEnabled={isSectionEnabled('ledger')} sectionData={ledgerSection}>
        <section className="tax-ledger-section tax-resource-reveal">
          <div className="tax-ledger-section__heading">
            <span className="tax-section-kicker">{ledgerSection?.subheading || 'Accounting fundamentals'}</span>
            <h2><BookOpen size={23} /> {ledgerSection?.title || 'Double Entry Ledger'}</h2>
            {ledgerSection?.description && <p>{ledgerSection.description}</p>}
          </div>
          <div className="tax-ledger-section__panel">
            <LedgerIllustration />
          </div>
        </section>
        </EditableSectionContainer>

        {/* Original IRS Circular 230 Disclosure Box */}
        <aside className="tax-disclosure tax-resource-reveal">
          <span className="tax-disclosure__icon">
            <ShieldCheck size={21} />
          </span>
          <div>
            <strong>Treasury Department Circular 230 Notice:</strong>
            <p>
              To ensure compliance with requirements imposed by the IRS, we
              inform you that any U.S. federal tax advice contained in this
              communication (including any attachments) is not intended or
              written to be used, and cannot be used, for the purpose of (i)
              avoiding penalties under the Internal Revenue Code or (ii)
              promoting, marketing, or recommending to another party any
              transaction or matter addressed herein.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
