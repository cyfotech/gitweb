import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator } from 'lucide-react';
import type { ClientCategory } from '../data/services';
import { HomeHeroServiceAnimation } from './HomeHeroServiceAnimation';
import { DynamicUniversalMediaRenderer } from './DynamicUniversalMediaRenderer';
import { EditableElement } from './EditableElement';
import './CinematicHeroChapter.css';

export type CinematicHeroContent = {
  title?: string | null;
  subheading?: string | null;
  description?: string | null;
  content?: string | null;
  backgroundImage?: string | null;
  backgroundVideo?: string | null;
  imagePosition?: string | null;
  imageAltText?: string | null;
  parsedContent?: {
    eyebrow?: string;
    primaryCtaText?: string;
    primaryCtaUrl?: string;
    secondaryCtaText?: string;
    secondaryCtaUrl?: string;
    calculatorButtonText?: string;
    trust_item1_category?: string;
    trust_item1_title?: string;
    trust_item1_subtitle?: string;
    trust_item2_category?: string;
    trust_item2_title?: string;
    trust_item2_subtitle?: string;
    trust_item3_category?: string;
    trust_item3_title?: string;
    trust_item3_subtitle?: string;
    trust_item4_category?: string;
    trust_item4_title?: string;
    trust_item4_subtitle?: string;
    hero_media_format?: string;
    hero_media_url?: string;
    hero_media_alt?: string;
    stats?: Array<{ label: string; value: string }>;
  } | null;
};

type CinematicHeroChapterProps = {
  onOpenConsultation: (
    category?: ClientCategory | string,
    serviceSlug?: string
  ) => void;
  onExploreWork: () => void;
  onOpenCalculator?: () => void;
  cmsContent?: CinematicHeroContent | null;
};

type ChartMode = 'workflow' | 'capacity' | 'quality';

type ChartPoint = { label: string; value: number };

const CHART_DATA: Record<ChartMode, ChartPoint[]> = {
  workflow: [
    { label: 'W1', value: 32 },
    { label: 'W2', value: 46 },
    { label: 'W3', value: 39 },
    { label: 'W4', value: 57 },
    { label: 'W5', value: 52 },
    { label: 'W6', value: 68 },
    { label: 'W7', value: 63 },
    { label: 'W8', value: 84 },
  ],
  capacity: [
    { label: 'W1', value: 44 },
    { label: 'W2', value: 40 },
    { label: 'W3', value: 56 },
    { label: 'W4', value: 51 },
    { label: 'W5', value: 69 },
    { label: 'W6', value: 64 },
    { label: 'W7', value: 77 },
    { label: 'W8', value: 88 },
  ],
  quality: [
    { label: 'W1', value: 48 },
    { label: 'W2', value: 58 },
    { label: 'W3', value: 55 },
    { label: 'W4', value: 67 },
    { label: 'W5', value: 64 },
    { label: 'W6', value: 78 },
    { label: 'W7', value: 74 },
    { label: 'W8', value: 91 },
  ],
};

const CHART_LABELS: Record<ChartMode, { title: string; description: string; unit: string }> = {
  workflow: {
    title: 'Workflow activity',
    description: 'Illustrative movement across workflow checkpoints',
    unit: 'index',
  },
  capacity: {
    title: 'Capacity planning',
    description: 'Illustrative workload allocation trend',
    unit: 'index',
  },
  quality: {
    title: 'Review readiness',
    description: 'Illustrative review-readiness trend',
    unit: 'index',
  },
};

function ArrowRightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M12 3.2 19 6v5.3c0 4.2-2.8 7.5-7 9.5-4.2-2-7-5.3-7-9.5V6l7-2.8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m8.7 11.9 2.2 2.2 4.5-4.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M7 3.8h7l4 4v12.4H7a2 2 0 0 1-2-2V5.8a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 4v4h4M8.5 12h7M8.5 15.5h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M4 19.2h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6.5 16v-4M11.5 16V7M16.5 16V10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function MiniTrend({ values }: { values: number[] }) {
  const points = values
    .map((value, index) => {
      const x = 3 + (index / Math.max(values.length - 1, 1)) * 94;
      const y = 26 - (value / 100) * 22;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg className="ct-mini-trend" viewBox="0 0 100 30" role="img" aria-label="Illustrative trend line">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InteractiveChart() {
  const [mode, setMode] = useState<ChartMode>('workflow');
  const points = CHART_DATA[mode];
  const modeInfo = CHART_LABELS[mode];

  const chartGeometry = useMemo(() => {
    const width = 340;
    const height = 124;
    const padX = 10;
    const padY = 12;
    const usableWidth = width - padX * 2;
    const usableHeight = height - padY * 2;
    const maxValue = Math.max(...points.map((point) => point.value), 100);

    const coords = points.map((point, index) => ({
      ...point,
      x: padX + (index / (points.length - 1)) * usableWidth,
      y: height - padY - (point.value / maxValue) * usableHeight,
    }));

    const line = coords.map((point) => `${point.x},${point.y}`).join(' ');
    const first = coords[0];
    const last = coords[coords.length - 1];
    const area = `M ${first.x} ${height - padY} L ${coords
      .map((point) => `${point.x} ${point.y}`)
      .join(' L ')} L ${last.x} ${height - padY} Z`;

    return { coords, line, area, width, height };
  }, [points]);

  const average = Math.round(points.reduce((sum, point) => sum + point.value, 0) / points.length);
  const lastValue = points[points.length - 1].value;

  return (
    <div className="ct-chart-panel">
      <div className="ct-chart-panel__heading">
        <div>
          <span className="ct-overline">ANALYTICS PREVIEW</span>
          <h3>{modeInfo.title}</h3>
          <p>{modeInfo.description}</p>
        </div>
        <div className="ct-chart-live" aria-label="Animated demonstration, not connected to live business data">
          <span className="ct-chart-live__pulse" />
          MOTION PREVIEW
        </div>
      </div>

      <div className="ct-chart-tabs" role="group" aria-label="Choose chart view">
        <button type="button" className={mode === 'workflow' ? 'is-active' : ''} onClick={() => setMode('workflow')} aria-pressed={mode === 'workflow'}>
          Workflow
        </button>
        <button type="button" className={mode === 'capacity' ? 'is-active' : ''} onClick={() => setMode('capacity')} aria-pressed={mode === 'capacity'}>
          Capacity
        </button>
        <button type="button" className={mode === 'quality' ? 'is-active' : ''} onClick={() => setMode('quality')} aria-pressed={mode === 'quality'}>
          Review
        </button>
      </div>

      <div className="ct-chart-summary">
        <div>
          <span className="ct-chart-summary__label">LATEST SAMPLE</span>
          <strong>{lastValue}<small> / 100</small></strong>
        </div>
        <div className="ct-chart-summary__average">
          <span className="ct-chart-summary__label">PERIOD AVERAGE</span>
          <strong>{average}<small> / 100</small></strong>
        </div>
        <div className="ct-chart-summary__trend">
          <MiniTrend values={points.map((point) => point.value)} />
          <span>sample trend</span>
        </div>
      </div>

      <div className="ct-chart-plot" aria-label={`${modeInfo.title}. Illustrative sample data, not actual company metrics.`}>
        <div className="ct-chart-plot__grid" aria-hidden="true">
          <i /><i /><i /><i />
        </div>
        <svg key={mode} className="ct-chart-svg" viewBox={`0 0 ${chartGeometry.width} ${chartGeometry.height}`} role="img" aria-label={`${modeInfo.title} line chart showing sample values over eight checkpoints`}>
          <defs>
            <linearGradient id={`ct-area-${mode}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" className="ct-chart-svg__area-stop" />
              <stop offset="100%" className="ct-chart-svg__area-stop ct-chart-svg__area-stop--end" />
            </linearGradient>
            <linearGradient id={`ct-line-${mode}`} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" className="ct-chart-svg__line-stop ct-chart-svg__line-stop--start" />
              <stop offset="100%" className="ct-chart-svg__line-stop" />
            </linearGradient>
          </defs>
          <path className="ct-chart-svg__area" d={chartGeometry.area} fill={`url(#ct-area-${mode})`} />
          <polyline className="ct-chart-svg__line" points={chartGeometry.line} stroke={`url(#ct-line-${mode})`} />
          {chartGeometry.coords.map((point, index) => (
            <g key={`${mode}-${point.label}`} className="ct-chart-svg__point" style={{ animationDelay: `${index * 70}ms` }}>
              <circle className="ct-chart-svg__point-halo" cx={point.x} cy={point.y} r="6" />
              <circle className="ct-chart-svg__point-dot" cx={point.x} cy={point.y} r="2.8" />
            </g>
          ))}
        </svg>
      </div>

      <div className="ct-chart-axis" aria-hidden="true">
        {points.map((point) => <span key={point.label}>{point.label}</span>)}
      </div>

      <div className="ct-chart-panel__footer">
        <span><i /> Sample visualization</span>
        <span>Illustrative index · not live company data</span>
      </div>
    </div>
  );
}

type PieSegment = {
  label: string;
  value: number;
  className: string;
};

// Illustrative workflow mix for visual demonstration only; it is not company data.
const PIE_SEGMENTS: PieSegment[] = [
  { label: 'Document intake', value: 30, className: 'ct-pie-slice--teal' },
  { label: 'Review checkpoints', value: 25, className: 'ct-pie-slice--gold' },
  { label: 'Data in motion', value: 25, className: 'ct-pie-slice--blue' },
  { label: 'Human oversight', value: 20, className: 'ct-pie-slice--coral' },
];

function pieSlicePath(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  yOffset = 0,
): string {
  const point = (angle: number) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(radians),
      y: cy + yOffset + radius * Math.sin(radians),
    };
  };

  const start = point(startAngle);
  const end = point(endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${cx} ${cy + yOffset}`,
    `L ${start.x.toFixed(3)} ${start.y.toFixed(3)}`,
    `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`,
    'Z',
  ].join(' ');
}

function WorkflowPieChart() {
  const [activeIndex, setActiveIndex] = useState(0);

  const slices = useMemo(() => {
    let currentAngle = -90;

    return PIE_SEGMENTS.map((segment, index) => {
      const startAngle = currentAngle;
      const endAngle = currentAngle + (segment.value / 100) * 360;
      const middleAngle = (startAngle + endAngle) / 2;
      const radians = (middleAngle * Math.PI) / 180;
      const offset = activeIndex === index ? 3.5 : 0;
      currentAngle = endAngle;

      return {
        ...segment,
        index,
        startAngle,
        endAngle,
        topPath: pieSlicePath(108, 88, 67, startAngle, endAngle),
        depthPath: pieSlicePath(108, 88, 67, startAngle, endAngle, 8),
        translateX: Math.cos(radians) * offset,
        translateY: Math.sin(radians) * offset,
      };
    });
  }, [activeIndex]);

  return (
    <div className="ct-pie-panel" aria-label="Illustrative workflow allocation pie chart">
      <div className="ct-pie-panel__heading">
        <div>
          <span className="ct-pie-panel__overline">ILLUSTRATIVE DISTRIBUTION</span>
          <h3>Workflow allocation</h3>
          <p>Sample distribution · totals 100%</p>
        </div>
        <span className="ct-pie-panel__badge"><i /> SAMPLE</span>
      </div>

      <div className="ct-pie-panel__body">
        <svg
          className="ct-pie-chart-svg"
          viewBox="0 0 216 177"
          role="img"
          aria-label="Pie chart: document intake 30 percent, review checkpoints 25 percent, data in motion 25 percent, human oversight 20 percent. Illustrative sample data."
        >
          <defs>
            <filter id="ct-pie-shadow" x="-30%" y="-30%" width="160%" height="180%">
              <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#6f5527" floodOpacity="0.18" />
            </filter>
            <linearGradient id="ct-pie-gloss" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#17252d" stopOpacity="0.12" />
            </linearGradient>
          </defs>
          <g filter="url(#ct-pie-shadow)" className="ct-pie-chart-svg__slices">
            {slices.map((slice) => (
              <g
                key={slice.label}
                className={`ct-pie-segment ${activeIndex === slice.index ? 'is-active' : ''}`}
                transform={`translate(${slice.translateX.toFixed(2)} ${slice.translateY.toFixed(2)})`}
              >
                <path className={`ct-pie-slice-depth ${slice.className}`} d={slice.depthPath} />
                <path className={`ct-pie-slice ${slice.className}`} d={slice.topPath} />
              </g>
            ))}
            <path
              className="ct-pie-chart-svg__gloss"
              d="M 63 45 C 76 18, 126 12, 151 34 C 126 26, 93 28, 63 45 Z"
            />
          </g>
        </svg>

        <div className="ct-pie-legend" role="group" aria-label="Highlight a workflow category">
          {PIE_SEGMENTS.map((segment, index) => (
            <button
              type="button"
              key={segment.label}
              className={`ct-pie-legend__item ${activeIndex === index ? 'is-active' : ''}`}
              onClick={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              aria-pressed={activeIndex === index}
              aria-label={`Highlight ${segment.label}, ${segment.value} percent`}
            >
              <span className={`ct-pie-legend__swatch ${segment.className}`} aria-hidden="true" />
              <span className="ct-pie-legend__label">{segment.label}</span>
              <strong>{segment.value}%</strong>
            </button>
          ))}
        </div>
      </div>
      <div className="ct-pie-panel__footer">
        <span><i /> DEMONSTRATION DATA</span>
        <span>Not actual company metrics</span>
      </div>
    </div>
  );
}

function Financial3DScene() {
  return (
    <div className="ct-scene" aria-label="Interactive financial dashboard with animated illustrative charts" role="group">
      <div className="ct-scene__aura ct-scene__aura--outer" aria-hidden="true" />
      <div className="ct-scene__aura ct-scene__aura--inner" aria-hidden="true" />
      <div className="ct-scene__grid-floor" aria-hidden="true" />

      <div className="ct-orbit ct-orbit--one" aria-hidden="true" />
      <div className="ct-orbit ct-orbit--two" aria-hidden="true" />
      <div className="ct-orbit ct-orbit--three" aria-hidden="true" />
      <div className="ct-orbit-dot ct-orbit-dot--one" aria-hidden="true" />
      <div className="ct-orbit-dot ct-orbit-dot--two" aria-hidden="true" />
      <div className="ct-orbit-dot ct-orbit-dot--three" aria-hidden="true" />

      {/* Replace the decorative CPA sphere with a real, labelled pie chart. */}
      <WorkflowPieChart />

      <div className="ct-float-card ct-float-card--document">
        <span className="ct-float-card__icon"><DocumentIcon /></span>
        <span className="ct-float-card__copy">
          <strong>Document intake</strong>
          <small>Organized for review</small>
        </span>
        <span className="ct-status-dot" aria-hidden="true" />
      </div>

      <div className="ct-float-card ct-float-card--review">
        <span className="ct-float-card__icon ct-float-card__icon--gold"><ShieldIcon /></span>
        <span className="ct-float-card__copy">
          <strong>Review checkpoints</strong>
          <small>Review · Verify · Deliver</small>
        </span>
      </div>

      <div className="ct-live-orbit-label" aria-hidden="true">
        <span className="ct-live-orbit-label__icon"><ChartIcon /></span>
        <span><strong>DATA IN MOTION</strong><small>Interactive preview</small></span>
      </div>

      <div className="ct-scene__spark ct-scene__spark--one" aria-hidden="true" />
      <div className="ct-scene__spark ct-scene__spark--two" aria-hidden="true" />
      <div className="ct-scene__spark ct-scene__spark--three" aria-hidden="true" />
    </div>
  );
}

export function CinematicHeroChapter({
  onOpenConsultation,
  onExploreWork,
  onOpenCalculator,
  cmsContent,
}: CinematicHeroChapterProps) {
  const navigate = useNavigate();
  const eyebrowText = cmsContent?.parsedContent?.eyebrow || cmsContent?.subheading || 'STRATEGIC US TAX & CPA ADVISORY';
  const heroTitle = cmsContent?.title || 'Financial clarity. Engineered for growth.';
  const heroDescription = cmsContent?.description || 'High-precision tax preparation, bespoke entity advisory, and scalable white-label CPA capacity engineered for modern accounting firms and expanding enterprises.';
  const primaryCta = cmsContent?.parsedContent?.primaryCtaText || 'Book Strategic Consultation';
  const secondaryCta = cmsContent?.parsedContent?.secondaryCtaText || 'Explore Practices';
  const calcText = cmsContent?.parsedContent?.calculatorButtonText || 'Calculate Your US Taxes';
  const customBg = cmsContent?.backgroundImage;
  const customVideo = cmsContent?.backgroundVideo;
  const backgroundPosition = cmsContent?.imagePosition || 'center right';
  const imageAltText = cmsContent?.imageAltText || 'Financial advisory background';

  const followCmsLink = (url: string | undefined, fallback: () => void) => {
    if (!url) {
      fallback();
    } else if (/^https?:\/\//i.test(url)) {
      window.location.assign(url);
    } else {
      navigate(url);
    }
  };

  // Editable Trust Row items from CMS parsed content
  const trustItem1Category = cmsContent?.parsedContent?.trust_item1_category || 'PROCESS';
  const trustItem1Title = cmsContent?.parsedContent?.trust_item1_title || 'Structured review';
  const trustItem1Subtitle = cmsContent?.parsedContent?.trust_item1_subtitle || 'Clear checkpoints';

  const trustItem2Category = cmsContent?.parsedContent?.trust_item2_category || 'DOCUMENTS';
  const trustItem2Title = cmsContent?.parsedContent?.trust_item2_title || 'Organized intake';
  const trustItem2Subtitle = cmsContent?.parsedContent?.trust_item2_subtitle || 'Review-ready flow';

  const trustItem3Category = cmsContent?.parsedContent?.trust_item3_category || 'VISIBILITY';
  const trustItem3Title = cmsContent?.parsedContent?.trust_item3_title || 'Clear milestones';
  const trustItem3Subtitle = cmsContent?.parsedContent?.trust_item3_subtitle || 'Progress at a glance';

  const trustItem4Category = cmsContent?.parsedContent?.trust_item4_category || 'DELIVERY';
  const trustItem4Title = cmsContent?.parsedContent?.trust_item4_title || 'Human oversight';
  const trustItem4Subtitle = cmsContent?.parsedContent?.trust_item4_subtitle || 'Quality-minded workflow';

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    // tilt removed to keep stable on mouse move
    // tilt removed to keep stable on mouse move
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--pointer-rotate-y', '0deg');
    event.currentTarget.style.setProperty('--pointer-rotate-x', '0deg');
  };

  return (
    <section className="ct-hero" aria-labelledby="ct-hero-title">
      <div className="ct-hero__background" aria-hidden="true">
        <div className="ct-hero__background-glow ct-hero__background-glow--one" />
        <div className="ct-hero__background-glow ct-hero__background-glow--two" />
        {customVideo && (
          <video
            className="ct-hero__background-video"
            src={customVideo}
            autoPlay
            muted
            loop
            playsInline
          />
        )}
        <EditableElement
          sectionKey="hero"
          elementKey="backgroundImage"
          elementType="image"
          label="Hero Background Media"
          value={customBg}
        >
          <div
            className="ct-hero__background-image"
            role={customBg ? 'img' : undefined}
            aria-label={customBg ? imageAltText : undefined}
            style={customBg ? { backgroundImage: `url(${customBg})`, backgroundPosition, opacity: 0.25 } : undefined}
          />
        </EditableElement>
        <div className="ct-hero__background-grid" />
        <div className="ct-hero__background-noise" />
      </div>

      <div className="ct-hero__container">
        <div className="ct-hero__copy">
          <EditableElement
            sectionKey="hero"
            elementKey="subheading"
            elementType="subheading"
            label="Eyebrow Subtitle"
            value={eyebrowText}
          >
            <div className="ct-hero__eyebrow">
              <span className="ct-hero__eyebrow-line" />
              <span>{eyebrowText}</span>
              <span className="ct-hero__eyebrow-dot" />
            </div>
          </EditableElement>

          <EditableElement
            sectionKey="hero"
            elementKey="title"
            elementType="heading"
            label="Hero Main Headline"
            value={heroTitle}
          >
            <h1 id="ct-hero-title" className="ct-hero__title">
              {heroTitle.includes('.') ? (
                <>
                  {heroTitle.split('.')[0]}.
                  <span>{heroTitle.split('.').slice(1).join('.').trim()}</span>
                </>
              ) : heroTitle.includes('&') ? (
                <>
                  {heroTitle.split('&')[0]} &amp;
                  <span>{heroTitle.split('&').slice(1).join('&').trim()}</span>
                </>
              ) : (
                heroTitle
              )}
            </h1>
          </EditableElement>

          <EditableElement
            sectionKey="hero"
            elementKey="description"
            elementType="paragraph"
            label="Lead Paragraph Description"
            value={heroDescription}
          >
            <p className="ct-hero__description">
              {heroDescription}
            </p>
          </EditableElement>

          <div className="ct-hero__actions flex flex-wrap items-center gap-3">
            <EditableElement
              sectionKey="hero"
              elementKey="primaryCtaText"
              elementType="button"
              label="Primary CTA Button"
              value={primaryCta}
            >
              <button
                type="button"
                className="ct-hero__button ct-hero__button--primary"
                onClick={() => followCmsLink(cmsContent?.parsedContent?.primaryCtaUrl, () => onOpenConsultation('cpa', 'tax-prep-outsourcing'))}
              >
                <span>{primaryCta}</span>
                <ArrowRightIcon />
              </button>
            </EditableElement>

            {onOpenCalculator && (
              <EditableElement
                sectionKey="hero"
                elementKey="calculatorButtonText"
                elementType="button"
                label="Calculator CTA Button"
                value={calcText}
              >
                <button
                  type="button"
                  className="ct-hero__button ct-hero__button--calculator"
                  onClick={onOpenCalculator}
                  aria-label={calcText}
                >
                  <Calculator className="w-4 h-4 text-[#16A765] dark:text-[#35E092]" />
                  <span>{calcText}</span>
                </button>
              </EditableElement>
            )}

            <EditableElement
              sectionKey="hero"
              elementKey="secondaryCtaText"
              elementType="button"
              label="Secondary CTA Button"
              value={secondaryCta}
            >
              <button
                type="button"
                className="ct-hero__button ct-hero__button--secondary"
                onClick={() => followCmsLink(cmsContent?.parsedContent?.secondaryCtaUrl, onExploreWork)}
              >
                <span>{secondaryCta}</span>
                <ChevronDownIcon />
              </button>
            </EditableElement>
          </div>

          <div className="ct-hero__trust-row" aria-label="Service approach">
            <EditableElement
              sectionKey="hero"
              elementKey="trust_item1_title"
              elementType="text"
              label="Trust Badge 1 Title"
              value={trustItem1Title}
            >
              <div className="ct-trust-item">
                <span className="ct-trust-item__icon ct-trust-item__icon--teal"><ShieldIcon /></span>
                <span>
                  <small>{trustItem1Category}</small>
                  <strong>{trustItem1Title}</strong>
                  <em>{trustItem1Subtitle}</em>
                </span>
              </div>
            </EditableElement>

            <EditableElement
              sectionKey="hero"
              elementKey="trust_item2_title"
              elementType="text"
              label="Trust Badge 2 Title"
              value={trustItem2Title}
            >
              <div className="ct-trust-item">
                <span className="ct-trust-item__icon ct-trust-item__icon--blue"><DocumentIcon /></span>
                <span>
                  <small>{trustItem2Category}</small>
                  <strong>{trustItem2Title}</strong>
                  <em>{trustItem2Subtitle}</em>
                </span>
              </div>
            </EditableElement>

            <EditableElement
              sectionKey="hero"
              elementKey="trust_item3_title"
              elementType="text"
              label="Trust Badge 3 Title"
              value={trustItem3Title}
            >
              <div className="ct-trust-item">
                <span className="ct-trust-item__icon ct-trust-item__icon--gold"><ChartIcon /></span>
                <span>
                  <small>{trustItem3Category}</small>
                  <strong>{trustItem3Title}</strong>
                  <em>{trustItem3Subtitle}</em>
                </span>
              </div>
            </EditableElement>

            <EditableElement
              sectionKey="hero"
              elementKey="trust_item4_title"
              elementType="text"
              label="Trust Badge 4 Title"
              value={trustItem4Title}
            >
              <div className="ct-trust-item">
                <span className="ct-trust-item__icon ct-trust-item__icon--teal"><ShieldIcon /></span>
                <span>
                  <small>{trustItem4Category}</small>
                  <strong>{trustItem4Title}</strong>
                  <em>{trustItem4Subtitle}</em>
                </span>
              </div>
            </EditableElement>
          </div>
        </div>

        <div
          className="ct-hero__visual-wrap w-full max-w-xl"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          aria-label="Automatic financial services animation"
        >
          {/* Dynamic Universal Media Renderer (Supports: Chart | Image | Video | GIF | Embed) */}
          {cmsContent?.content && (() => {
            try {
              const p = JSON.parse(cmsContent.content);
              if (p.hero_media_format && p.hero_media_format !== 'chart') {
                return (
                  <EditableElement
                    sectionKey="hero"
                    elementKey="hero_media_url"
                    elementType={p.hero_media_format}
                    label={`Hero ${p.hero_media_format.toUpperCase()}`}
                    value={p.hero_media_url || ''}
                  >
                    <DynamicUniversalMediaRenderer
                      mediaType={p.hero_media_format}
                      mediaUrl={p.hero_media_url}
                      altText={cmsContent.parsedContent?.hero_media_alt || imageAltText}
                      fallbackComponent={<HomeHeroServiceAnimation />}
                    />
                  </EditableElement>
                );
              }
            } catch { }
            return null;
          })()}
          {(!cmsContent?.content || (() => {
            try {
              const p = JSON.parse(cmsContent.content);
              return !p.hero_media_format || p.hero_media_format === 'chart';
            } catch { return true; }
          })()) && (
              <HomeHeroServiceAnimation />
            )}
        </div>
      </div>

      <div className="ct-hero__scroll-cue" aria-hidden="true">
        <span>SCROLL TO EXPLORE</span>
        <i />
      </div>
    </section>
  );
}
