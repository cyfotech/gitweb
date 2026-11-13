import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  ShieldCheck,
  Lock,
  Users,
  Globe2,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  Building,
  Scale,
  Activity,
  BadgeCheck,
  Network,
  TrendingUp,
  Clock3,
} from 'lucide-react';
import { NetworkDiagram } from '../components/graphics/NetworkDiagram';
import { AuditReportCard } from '../components/graphics/AuditReportCard';
import aboutOfficeBackground from './about-office-bg.png';
import aboutChartBackground from './about-chart-bg.png';
import { usePageContent } from '../hooks/usePageContent';
import { useGlobalSettings } from '../context/GlobalSettingsContext';
import { EditableSectionContainer } from '../components/EditableSectionContainer';
import { EditableElement } from '../components/EditableElement';
import { SocialLinksBar } from '../components/SocialLinksBar';
import { FinancialDonutChart } from '../components/FinancialDonutChart';
import { useAnimationSettings } from '../context/AnimationSettingsContext';
import { ContinuousPlanningLoop, PlanningSignalsDiagnostic } from '../components/referenceAnimations';
import './AboutUs.css';

const PILLARS = [
  {
    number: '01',
    title: '99.8% Accuracy Standard',
    description:
      'Every tax return, journal entry, and workpaper undergoes a multi-layer diagnostic review by senior Enrolled Agents and licensed CPAs prior to partner delivery.',
    Icon: ShieldCheck,
    accent: 'teal',
    tag: 'Review-led delivery',
  },
  {
    number: '02',
    title: 'SOC 2 & ISO 27001 Security',
    description:
      'We operate strictly within your existing cloud environments (UltraTax, QuickBooks, Xero) via secure 256-bit SSL tunnels and strict NDA confidentiality protocols.',
    Icon: Lock,
    accent: 'gold',
    tag: 'Security-first workflows',
  },
  {
    number: '03',
    title: 'Dedicated Talent Pods',
    description:
      'Zero random freelancer roulette. You are assigned dedicated, named accountants who learn your firm’s specific chart of accounts, workpaper conventions, and review style.',
    Icon: Users,
    accent: 'teal',
    tag: 'People who know your process',
  },
  {
    number: '04',
    title: 'Time-Zone Acceleration',
    description:
      'Submit files at 6:00 PM EST and wake up to completed, peer-reviewed workpapers ready for partner sign-off by 8:00 AM EST the following morning.',
    Icon: Globe2,
    accent: 'gold',
    tag: 'Follow-the-sun support',
  },
];

function ChartGraph({ type, quarters, values, displayValues, max }: { type: string; quarters: string[]; values: number[]; displayValues: string[]; max: number }) {
  const n = values.length;
  if (n === 0) return null;
  const W = 400, H = 120, padT = 12, padB = 8;
  const innerH = H - padT - padB;
  const safeMax = Math.max(max, 1);
  const xAt = (i: number) => (n <= 1 ? W / 2 : padT + i * ((W - padT * 2) / (n - 1)));
  const yAt = (v: number) => padT + innerH - (v / safeMax) * innerH;
  const colors = ['#16A765', '#35C98A', '#0E7490', '#D97706', '#6366F1', '#EC4899', '#14B8A6', '#F59E0B'];
  const gridlines = (
    <>
      <line x1="0" y1="30" x2="400" y2="30" stroke="currentColor" className="text-gray-200 dark:text-white/10" strokeDasharray="4 4" />
      <line x1="0" y1="65" x2="400" y2="65" stroke="currentColor" className="text-gray-200 dark:text-white/10" strokeDasharray="4 4" />
      <line x1="0" y1="100" x2="400" y2="100" stroke="currentColor" className="text-gray-200 dark:text-white/10" strokeDasharray="4 4" />
    </>
  );

  if (type === 'pie' || type === 'donut') {
    const total = values.reduce((a, b) => a + b, 0) || 1;
    const cx = 200, cy = 60, r = 48, ir = type === 'donut' ? 30 : 0;
    let angle = -Math.PI / 2;
    const slices = values.map((v, i) => {
      const start = angle;
      const sweep = (v / total) * Math.PI * 2;
      angle += sweep;
      const large = sweep > Math.PI ? 1 : 0;
      const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
      const x2 = cx + r * Math.cos(start + sweep), y2 = cy + r * Math.sin(start + sweep);
      let d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
      if (ir > 0) {
        const ix1 = cx + ir * Math.cos(start + sweep), iy1 = cy + ir * Math.sin(start + sweep);
        const ix2 = cx + ir * Math.cos(start), iy2 = cy + ir * Math.sin(start);
        d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${ir} ${ir} 0 ${large} 0 ${ix2} ${iy2} Z`;
      }
      return <path key={i} d={d} fill={colors[i % colors.length]} stroke="#fff" strokeWidth="1.5" />;
    });
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
        {slices}
        <text x="200" y="66" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill="#0B3B42">{type === 'donut' ? 'Donut' : 'Pie'}</text>
      </svg>
    );
  }

  if (type === 'radar') {
    if (n < 3) {
      return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
          {gridlines}
          {values.map((v, i) => {
            const bw = Math.max(8, (W - padT * 2) / n - 6);
            const bx = padT + i * ((W - padT * 2) / n) + ((W - padT * 2) / n - bw) / 2;
            const h = (v / safeMax) * innerH;
            return <rect key={i} x={bx} y={padT + innerH - h} width={bw} height={h} rx="3" fill="#16A765" />;
          })}
        </svg>
      );
    }
    const cx = 200, cy = 62, R = 52;
    const angAt = (i: number) => -Math.PI / 2 + i * ((2 * Math.PI) / n);
    const rings = [0.25, 0.5, 0.75, 1].map((f) => {
      const pts = values.map((_, i) => `${cx + R * f * Math.cos(angAt(i))},${cy + R * f * Math.sin(angAt(i))}`);
      return <polygon key={f} points={pts.join(' ')} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeDasharray="3 3" strokeWidth="1" />;
    });
    const axes = values.map((_, i) => {
      const x = cx + R * Math.cos(angAt(i)), y = cy + R * Math.sin(angAt(i));
      return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />;
    });
    const pts = values.map((v, i) => {
      const rr = (v / safeMax) * R;
      return `${cx + rr * Math.cos(angAt(i))},${cy + rr * Math.sin(angAt(i))}`;
    });
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
        {rings}{axes}
        <polygon points={pts.join(' ')} fill="url(#trendGradient)" stroke="#16A765" strokeWidth="2" />
        {values.map((v, i) => {
          const rr = (v / safeMax) * R;
          return <circle key={i} cx={cx + rr * Math.cos(angAt(i))} cy={cy + rr * Math.sin(angAt(i))} r="3.5" fill="#16A765" stroke="#fff" strokeWidth="1.5" />;
        })}
      </svg>
    );
  }

  if (type === 'bar' || type === 'stacked_bar' || type === 'bar_chart') {
    const bw = Math.max(8, (W - padT * 2) / n - 6);
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
        {gridlines}
        {values.map((v, i) => {
          const h = (v / safeMax) * innerH;
          const bx = padT + i * ((W - padT * 2) / n) + ((W - padT * 2) / n - bw) / 2;
          return (
            <g key={i}>
              <rect x={bx} y={padT + innerH - h} width={bw} height={h} rx="3" fill="#16A765" />
              <text x={bx + bw / 2} y={padT + innerH - h - 3} fontSize="8" textAnchor="middle" fill="currentColor" fontFamily="monospace" fontWeight="bold">{displayValues[i]}</text>
            </g>
          );
        })}
      </svg>
    );
  }

  if (type === 'horizontal_bar') {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
        {values.map((v, i) => {
          const w = (v / safeMax) * (W - padT * 2 - 8);
          const y = padT + i * (innerH / n);
          const h = Math.max(6, innerH / n - 5);
          return (
            <g key={i}>
              <rect x={padT} y={y + 2} width={w} height={h} rx="3" fill="#16A765" />
              <text x={padT + w + 4} y={y + h - 2} fontSize="8" fill="currentColor" fontFamily="monospace" fontWeight="bold">{displayValues[i]}</text>
            </g>
          );
        })}
      </svg>
    );
  }

  if (type === 'scatter') {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
        {gridlines}
        {values.map((v, i) => (
          <circle key={i} cx={xAt(i)} cy={yAt(v)} r="5" fill="#16A765" stroke="#fff" strokeWidth="1.5" />
        ))}
      </svg>
    );
  }

  // line / area / mixed (default)
  const pts = values.map((v, i) => `${xAt(i)},${yAt(v)}`);
  const lineData = `M ${pts.join(' L ')}`;
  const areaData = `M ${xAt(0)} ${padT + innerH} L ${pts.join(' L ')} L ${xAt(n - 1)} ${padT + innerH} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
      {gridlines}
      {(type === 'area' || type === 'mixed') && <path d={areaData} fill="url(#trendGradient)" />}
      <path d={lineData} fill="none" stroke="#16A765" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((v, i) => (
        <circle key={i} cx={xAt(i)} cy={yAt(v)} r="4.5" fill="#16A765" stroke="#fff" strokeWidth="2" />
      ))}
    </svg>
  );
}

const aboutHeroPerformance = [
  { id: 'tax-returns', name: 'Tax returns', value: 6400, color: '#34d399', description: 'Federal and state filings completed across the year.', metric: '6,400 filings' },
  { id: 'advisory', name: 'Advisory value', value: 3280, color: '#d3a753', description: 'Strategic tax planning and advisory engagements.', metric: '$32.8M advised' },
  { id: 'quality', name: 'Quality reviews', value: 2400, color: '#42c5bd', description: 'Returns and workpapers completed through review.', metric: '99.8% standard' },
  { id: 'turnaround', name: 'On-time delivery', value: 1800, color: '#7795b8', description: 'Client deliverables completed within agreed service levels.', metric: '24h average' }
];

function FinancialPerformanceTrendChart({ data }: { data?: any } = {}) {
  const { settings } = useAnimationSettings();
  const heroTrendConfig = settings?.aboutHeroTrend;

  const customData = Array.isArray(data?.dataPoints)
    ? data.dataPoints.filter((point: any) => point && typeof point.value === 'number' && point.value > 0)
    : [];

  const chartData = (heroTrendConfig?.items && heroTrendConfig.items.length > 0)
    ? heroTrendConfig.items
    : customData.length >= 2
      ? customData.map((point: any, index: number) => ({
        id: `cms-performance-${index}`,
        name: String(point.label || `Performance ${index + 1}`),
        value: point.value,
        color: ['#34d399', '#d3a753', '#42c5bd', '#7795b8', '#a78bfa'][index % 5],
        description: data?.title || 'Performance data from the site content settings.'
      }))
      : aboutHeroPerformance;

  const title = heroTrendConfig?.title || 'Financial performance';
  const subtitle = heroTrendConfig?.subtitle || 'A snapshot of annual delivery and advisory results.';
  const centerLabel = heroTrendConfig?.centerLabel || 'PERFORMANCE MIX';

  return (
    <FinancialDonutChart
      data={chartData}
      title={title}
      subtitle={subtitle}
      centerLabel={centerLabel}
      valueFormatter={value => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value)}
      totalFormatter={value => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value)}
      tone="about"
      variant="executive"
    />
  );
}

function ServicePerformanceAnalyticsChart() {
  const { settings } = useAnimationSettings();

  const config = settings?.aboutPieChart;
  const isEnabled = config?.enabled !== false;
  const services = (config?.items && config.items.length > 0)
    ? config.items
    : [
        { id: 'corporate-tax', name: 'Corporate tax', value: 4200, color: '#34d399', metric: '99.9% accuracy · 36h avg', description: 'Multi-jurisdiction federal and state returns with depreciation schedules and partner sign-off.' },
        { id: 'nexus-compliance', name: 'Nexus compliance', value: 2800, color: '#d3a753', metric: '99.8% accuracy · 24h avg', description: 'Sales tax apportionment, economic nexus tracking, and state authority correspondence.' },
        { id: 'cpa-outsourcing', name: 'CPA outsourcing', value: 3500, color: '#42c5bd', metric: '99.9% accuracy · 18h avg', description: 'Month-end close, bank reconciliations, trial balance workpapers, and ERP integration.' },
        { id: 'rd-credit', name: 'R&D tax credits', value: 2100, color: '#7795b8', metric: '99.7% accuracy · $45M+ identified', description: 'Qualified research expense analysis and IRS-audit-ready technical write-ups.' },
        { id: 'hnw-advisory', name: 'HNW advisory', value: 1100, color: '#a78bfa', metric: '100% accuracy · 12h avg', description: 'Estate planning, trust taxation, year-round tax minimization, and family-office support.' },
      ];

  if (!isEnabled) {
    return null;
  }

  return (
    <FinancialDonutChart
      data={services}
      title={config?.title || "Service performance"}
      subtitle={config?.subtitle || "Delivery mix with quality and turnaround metrics."}
      centerLabel={config?.centerLabel || "SERVICE MIX"}
      valueFormatter={value => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value)}
      totalFormatter={value => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value)}
      tone="services"
      variant="service-rings"
    />
  );
}

export function AboutUs() {
  const navigate = useNavigate();
  const { getSection, isSectionEnabled } = usePageContent('about');
  const { settings } = useGlobalSettings();
  const { settings: animSettings } = useAnimationSettings();

  const heroSection = getSection('hero');
  const valuesSection = getSection('values');
  const firmStorySection = getSection('firm_story');
  const qualitySection = getSection('quality_snapshot');
  const ctaSection = getSection('cta');

  const heroEyebrow = heroSection?.parsedContent?.eyebrow || heroSection?.subheading || 'Firm Integrity & Leadership';
  const heroTitle = heroSection?.title || 'Precision Meets Possibility';
  const heroDesc = heroSection?.description || 'Founded over 15 years ago, Smart Tax Experts (STE) has engineered a resilient, high-integrity tax and financial advisory ecosystem. We unite high-level US tax strategy with an elite, dedicated offshore accounting delivery infrastructure.';

  // Dynamic Floating Operational Quality Metric configuration
  const defaultMetricConfig = {
    label: 'Operational quality',
    value: '99.8%',
    icon: 'trending-up',
    barCount: 7,
    barHeights: [35, 57, 42, 72, 56, 92, 100],
    animationSpeed: '1.3s',
    barColor: '#63f2e8',
    barColorEnd: '#218f98',
    showBars: true,
  };
  const heroMetric = {
    ...defaultMetricConfig,
    ...(heroSection?.parsedContent?.metric_operational_quality || {}),
  };

  const heroStatIconMap = {
    award: Award,
    users: Users,
    shield: ShieldCheck,
    activity: Activity,
    trending: TrendingUp,
  } as any;
  const defaultHeroStats = [
    { icon: 'award', value: '15+', label: 'Years of excellence' },
    { icon: 'users', value: '500+', label: 'Firms supported' },
    { icon: 'shield', value: '99.8%', label: 'Accuracy standard' },
  ];
  const heroStats =
    Array.isArray(heroSection?.parsedContent?.hero_stats) && heroSection?.parsedContent?.hero_stats.length
      ? heroSection?.parsedContent?.hero_stats
      : defaultHeroStats;

  const pillarSource =
    Array.isArray(valuesSection?.parsedContent?.pillars) && valuesSection?.parsedContent?.pillars.length
      ? valuesSection?.parsedContent?.pillars.map((p: any) => ({
        number: p.number || '',
        title: p.title || '',
        description: p.description || '',
        tag: p.tag || '',
        accent: p.accent || 'teal',
        Icon:
          p.icon === 'lock' ? Lock :
            p.icon === 'users' ? Users :
              p.icon === 'globe' ? Globe2 : ShieldCheck,
      }))
      : PILLARS;

  // Dynamic Chart/Media configuration for hero performance panel
  const rawPerformanceMedia = heroSection?.parsedContent?.chart_about_performance;
  let parsedPerformanceMedia: any = rawPerformanceMedia;
  if (typeof rawPerformanceMedia === 'string') {
    try {
      parsedPerformanceMedia = JSON.parse(rawPerformanceMedia);
    } catch {
      parsedPerformanceMedia = {};
    }
  }

  const heroPerformanceMedia = {
    displayMode: 'chart',
    title: 'Financial Performance Trend',
    subtitle: 'Quarterly Volume vs Advisory Value vs Turnaround SLA',
    chartType: 'line',
    dataPoints: [
      { label: 'Q1', value: 850 },
      { label: 'Q2', value: 1100 },
      { label: 'Q3', value: 920 },
      { label: 'Q4', value: 1450 }
    ],
    mediaUrl: '',
    altText: 'Financial Performance Trend',
    ...(parsedPerformanceMedia || {})
  };

  const valuesTitle = valuesSection?.title || 'A higher standard of financial delivery';
  const valuesDesc = valuesSection?.description || 'Four principles shape how we protect quality, support partners, and keep work moving.';

  const ctaTitle = ctaSection?.title || 'Ready to Experience Institutional Precision?';
  const ctaDesc = ctaSection?.description || 'Schedule an executive consultation with our partner team to design a customized engagement model.';
  const firmStoryTitle = firmStorySection?.title || 'Our delivery network';
  const firmStoryDesc = firmStorySection?.description || 'A secure and integrated model for US tax and accounting practices.';
  const qualityTitle = qualitySection?.title || 'Quality & performance snapshot';
  const qualityDesc = qualitySection?.description || 'Clear review stages and measurable standards support partner confidence.';
  const ctaButtonText = ctaSection?.parsedContent?.buttonText || 'Schedule Strategic Consultation';

  const handleCardPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / Math.max(rect.width, 1);
    const y = (event.clientY - rect.top) / Math.max(rect.height, 1);
    // Keep the tilt deliberately subtle so text and diagrams remain easy to read.
    event.currentTarget.style.setProperty('--about-tilt-x', `${(0.5 - y) * 2.4}deg`);
    event.currentTarget.style.setProperty('--about-tilt-y', `${(x - 0.5) * 2.8}deg`);
    event.currentTarget.style.setProperty('--about-glow-x', `${x * 100}%`);
    event.currentTarget.style.setProperty('--about-glow-y', `${y * 100}%`);
  };

  const resetCardPointer = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--about-tilt-x', '0deg');
    event.currentTarget.style.setProperty('--about-tilt-y', '0deg');
    event.currentTarget.style.setProperty('--about-glow-x', '50%');
    event.currentTarget.style.setProperty('--about-glow-y', '50%');
  };

  return (
    <main className="about-page-premium">
      <div className="about-page-atmosphere about-atmosphere-a" aria-hidden="true" />
      <div className="about-page-atmosphere about-atmosphere-b" aria-hidden="true" />

      <div className="about-page-content">
        <EditableSectionContainer sectionKey="hero" sectionTitle="Firm Integrity Hero" isEnabled={isSectionEnabled('hero')} sectionData={heroSection}>
          <section
            className="about-hero"
            style={{ '--about-office-bg': heroSection?.backgroundImage ? `url("${heroSection.backgroundImage}")` : `url("${aboutOfficeBackground}")` } as CSSProperties}
          >
            <div className="about-hero-background-shade" aria-hidden="true" />
            <div className="about-hero-copy">
              <EditableElement
                sectionKey="hero"
                elementKey="subheading"
                elementType="subheading"
                label="About Eyebrow"
                value={heroEyebrow}
              >
                <div className="about-eyebrow"><Award size={15} /><span>{heroEyebrow}</span><i /></div>
              </EditableElement>

              <EditableElement
                sectionKey="hero"
                elementKey="title"
                elementType="heading"
                label="About Main Headline"
                value={heroTitle}
              >
                <h1>
                  {heroTitle.includes('&') ? (
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
                label="About Lead Description"
                value={heroDesc}
              >
                <p className="about-hero-description">
                  {heroDesc}
                </p>
              </EditableElement>

              <div className="about-hero-stats">
                {heroStats.map((s: { icon?: string; value?: string; label?: string }, i: number) => {
                  const iconKey = s.icon as keyof typeof heroStatIconMap | undefined;
                  const StatIcon = iconKey && heroStatIconMap[iconKey] ? heroStatIconMap[iconKey] : ShieldCheck;
                  return (
                    <div className="about-hero-stat" key={i}>
                      <span className="about-stat-icon"><StatIcon size={18} /></span>
                      <span><strong>{s.value}</strong><small>{s.label}</small></span>
                    </div>
                  );
                })}
              </div>

              <EditableElement
                sectionKey="hero"
                elementKey="partnerButton"
                elementType="button"
                label="Partnership Button"
                value="Explore a partnership"
              >
                <button type="button" className="about-button about-button-gold" onClick={() => navigate('/book-consultation')}>
                  Explore a partnership <ArrowRight size={16} />
                </button>
              </EditableElement>
            </div>

            <div
              className="about-hero-visual"
              aria-label="Interactive financial performance trend chart"
              onPointerMove={handleCardPointerMove}
              onPointerLeave={resetCardPointer}
            >
              {/* Decorative globe and orbit graphics stay behind the content. */}
              <div className="about-visual-atmosphere" aria-hidden="true">
                <div className="about-visual-globe">
                  <Globe2 size={78} strokeWidth={0.8} />
                  <span />
                  <i />
                  <b />
                </div>
                <div className="about-visual-orbit about-visual-orbit-one" />
                <div className="about-visual-orbit about-visual-orbit-two" />
              </div>

              {/* Detached metric card: above and outside the chart panel. */}
              <EditableElement
                sectionKey="hero"
                elementKey="metric_operational_quality"
                elementType="metric"
                label="Operational Quality Metric Card"
                value={heroMetric}
                metricConfig={heroMetric}
              >
                <div className="about-visual-float about-visual-float-top">
                  <span className="about-visual-float-icon">
                    {heroMetric.icon === 'shield' ? (
                      <ShieldCheck size={18} />
                    ) : heroMetric.icon === 'award' ? (
                      <Award size={18} />
                    ) : heroMetric.icon === 'activity' ? (
                      <Activity size={18} />
                    ) : (
                      <TrendingUp size={18} />
                    )}
                  </span>
                  <div className="about-visual-float-copy">
                    <small>{animSettings?.aboutHeroTrend?.metricCardLabel || heroMetric.label}</small>
                    <strong>{animSettings?.aboutHeroTrend?.metricCardValue || heroMetric.value}</strong>
                    {heroMetric.showBars !== false && (
                      <i
                        className="about-mini-bars"
                        aria-hidden="true"
                        style={
                          {
                            '--bar-pulse-speed': heroMetric.animationSpeed || '1.3s',
                          } as CSSProperties
                        }
                      >
                        {Array.from({ length: heroMetric.barCount || 7 }).map((_, bIdx) => {
                          const barH =
                            heroMetric.barHeights && heroMetric.barHeights[bIdx] !== undefined
                              ? heroMetric.barHeights[bIdx]
                              : [35, 57, 42, 72, 56, 92, 100][bIdx] || 50;
                          return (
                            <b
                              key={bIdx}
                              style={{
                                height: `${barH}%`,
                                background: `linear-gradient(${heroMetric.barColor || '#63f2e8'}, ${heroMetric.barColorEnd || '#218f98'})`,
                                animationDuration: heroMetric.animationSpeed || '1.3s',
                                animationDelay: `${bIdx * 0.11}s`,
                              }}
                            />
                          );
                        })}
                      </i>
                    )}
                  </div>
                </div>
              </EditableElement>

              {/* The chart / media is a separate, correctly constrained panel. */}
              <EditableElement
                sectionKey="hero"
                elementKey="chart_about_performance"
                elementType={
                  heroPerformanceMedia.displayMode === 'image'
                    ? 'image'
                    : heroPerformanceMedia.displayMode === 'video'
                      ? 'video'
                      : heroPerformanceMedia.displayMode === 'gif'
                        ? 'gif'
                        : 'chart'
                }
                label="Financial Performance Trend Showcase"
                value={heroPerformanceMedia}
                chartConfig={
                  heroPerformanceMedia.dataPoints
                    ? heroPerformanceMedia
                    : {
                      title: heroPerformanceMedia.title || 'Financial Performance Trend',
                      subtitle: heroPerformanceMedia.subtitle || 'Quarterly Volume vs Advisory Value vs Turnaround SLA',
                      chartType: heroPerformanceMedia.chartType || 'line',
                      dataPoints: [
                        { label: 'Q1', value: 850 },
                        { label: 'Q2', value: 1100 },
                        { label: 'Q3', value: 920 },
                        { label: 'Q4', value: 1450 }
                      ]
                    }
                }
              >
                <div className="about-dashboard-card">
                  <div className="about-dashboard-header">
                    <span><Activity size={15} /> {animSettings?.aboutHeroTrend?.title || heroPerformanceMedia.title || 'Financial Performance Trend'}</span>
                    <span className="about-live-label">
                      <i /> {animSettings?.aboutHeroTrend?.cardBadge || heroPerformanceMedia.displayMode?.toUpperCase() || 'CHART'}
                    </span>
                  </div>

                  {heroPerformanceMedia.displayMode === 'image' && heroPerformanceMedia.mediaUrl ? (
                    <div className="w-full h-56 rounded-xl overflow-hidden mt-3 bg-black/40 border border-teal-500/20 flex items-center justify-center p-1">
                      <img
                        src={heroPerformanceMedia.mediaUrl}
                        alt={heroPerformanceMedia.altText || 'Performance Overview'}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ) : heroPerformanceMedia.displayMode === 'video' && heroPerformanceMedia.mediaUrl ? (
                    <div className="w-full h-56 rounded-xl overflow-hidden mt-3 bg-black/60 border border-teal-500/20 shadow-inner">
                      <video
                        src={heroPerformanceMedia.mediaUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : heroPerformanceMedia.displayMode === 'gif' && heroPerformanceMedia.mediaUrl ? (
                    <div className="w-full h-56 rounded-xl overflow-hidden mt-3 bg-black/40 border border-teal-500/20 flex items-center justify-center p-1 relative">
                      <img
                        src={heroPerformanceMedia.mediaUrl}
                        alt={heroPerformanceMedia.altText || 'Animated Overview'}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/70 text-teal-300 border border-teal-500/30">
                        GIF
                      </span>
                    </div>
                  ) : (
                    <FinancialPerformanceTrendChart data={heroPerformanceMedia} />
                  )}
                </div>
              </EditableElement>

              {/* Detached delivery card: below and outside the chart panel. */}
              <div className="about-visual-float about-visual-float-bottom">
                <span className="about-visual-float-icon"><Clock3 size={18} /></span>
                <div className="about-visual-float-copy">
                  <small>Delivery model</small>
                  <strong>Built around your firm</strong>
                </div>
                <span className="about-delivery-status" aria-hidden="true"><CheckCircle2 size={16} /></span>
              </div>
            </div>
            <div className="about-hero-bottomline">
              <span><BadgeCheck size={14} /> Review-led delivery</span>
              <span><Lock size={14} /> Confidential workflows</span>
              <span><Globe2 size={14} /> Cross-time-zone support</span>
            </div>
          </section>
        </EditableSectionContainer>

        <EditableSectionContainer sectionKey="values" sectionTitle="Operating Principles & Standards" isEnabled={isSectionEnabled('values')} sectionData={valuesSection}>
          <section className="about-pillars-section" aria-labelledby="about-pillars-heading">
            <div className="about-section-heading">
              <span className="about-section-kicker"><Sparkles size={13} /> Our operating principles</span>
              <h2 id="about-pillars-heading">
                {valuesTitle.includes('standard') ? (
                  <>A higher standard of <span>financial delivery</span></>
                ) : (
                  valuesTitle
                )}
              </h2>
              <p>{valuesDesc}</p>
            </div>

            <div className="about-pillars-grid">
              {pillarSource.map(({ number, title, description, Icon, accent, tag }: any) => (
                <article
                  className={`about-pillar-card about-pillar-${accent}`}
                  key={title}
                  onPointerMove={handleCardPointerMove}
                  onPointerLeave={resetCardPointer}
                >
                  <div className="about-card-light" aria-hidden="true" />
                  <div className="about-pillar-top"><span className="about-pillar-icon"><Icon size={23} /></span><span className="about-pillar-number">{number}</span></div>
                  <div className="about-pillar-tag"><i /> {tag}</div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <div className="about-pillar-bottom"><span>Preferred standard</span><ArrowUpRight size={15} /></div>
                </article>
              ))}
            </div>
          </section>
        </EditableSectionContainer>

        <EditableSectionContainer sectionKey="firm_story" sectionTitle="Delivery Network Architecture" isEnabled={isSectionEnabled('firm_story')} sectionData={firmStorySection}>
          <section className="about-network-section">
            <div className="about-module-heading">
              <span className="about-module-icon"><Network size={18} /></span>
              <div><span className="about-section-kicker">{firmStorySection?.subheading || 'Connected teams, controlled workflows'}</span><h2>{firmStoryTitle}</h2><p>{firmStoryDesc}</p></div>
            </div>
            <div className="about-network-frame" onPointerMove={handleCardPointerMove} onPointerLeave={resetCardPointer}>
              <NetworkDiagram />
            </div>
          </section>
        </EditableSectionContainer>

        <EditableSectionContainer sectionKey="quality_snapshot" sectionTitle="Quality & Performance Snapshot" isEnabled={isSectionEnabled('quality_snapshot')} sectionData={qualitySection}>
        <section className="about-quality-section">
          <div className="about-module-heading">
            <span className="about-module-icon about-module-icon-gold"><Scale size={18} /></span>
            <div><span className="about-section-kicker">{qualitySection?.subheading || 'Audit-grade confidence'}</span><h2>{qualityTitle}</h2><p>{qualityDesc}</p></div>
          </div>
          <div className="about-quality-grid">
            <div
              className="about-quality-chart-panel"
              style={{ '--about-chart-bg': `url("${aboutChartBackground}")` } as CSSProperties}
              onPointerMove={handleCardPointerMove}
              onPointerLeave={resetCardPointer}
            >
              <div className="about-card-light" aria-hidden="true" />
              <div className="about-chart-panel-heading"><span><Activity size={15} /> Service performance analytics</span><span className="about-chart-panel-tag">INTERACTIVE</span></div>
              <ServicePerformanceAnalyticsChart />
            </div>
            <div className="about-audit-panel" onPointerMove={handleCardPointerMove} onPointerLeave={resetCardPointer}>
              <div className="about-card-light" aria-hidden="true" />
              <div className="about-audit-panel-heading"><span><FileCheckIcon /> Sample quality checkpoint</span><span className="about-status-pill"><i /> Review-led</span></div>
              <AuditReportCard />
              <div className="about-audit-steps">
                <span><CheckCircle2 size={14} /> Diagnostic checks</span>
                <span><CheckCircle2 size={14} /> Senior review</span>
                <span><CheckCircle2 size={14} /> Partner-ready handoff</span>
              </div>
            </div>
          </div>
        </section>
        </EditableSectionContainer>

        {/* Reference Interactive Methodology: Continuous 6-Stage Planning Loop */}
        <section className="about-reference-methodology my-12">
          <ContinuousPlanningLoop />
        </section>

        <EditableSectionContainer sectionKey="cta" sectionTitle="Strategic Partner CTA" isEnabled={isSectionEnabled('cta')} sectionData={ctaSection}>
          <section className="about-cta-section" style={{ '--about-office-bg': ctaSection?.backgroundImage ? `url("${ctaSection.backgroundImage}")` : `url("${aboutOfficeBackground}")` } as CSSProperties}>
            <div className="about-cta-light about-cta-light-a" aria-hidden="true" />
            <div className="about-cta-light about-cta-light-b" aria-hidden="true" />
            <div className="about-cta-emblem"><Building size={25} /><span /></div>
            <div className="about-cta-copy">
              <span className="about-cta-kicker"><Sparkles size={13} /> Your strategic delivery partner</span>
              <h2>{ctaTitle}</h2>
              <p>{ctaDesc}</p>
              <div className="about-cta-assurances"><span><CheckCircle2 size={14} /> Strategic guidance</span><span><CheckCircle2 size={14} /> Custom engagement</span><span><CheckCircle2 size={14} /> Dedicated partner support</span></div>
            </div>
            <button type="button" className="about-button about-button-cta" onClick={() => navigate('/book-consultation')}>
              {ctaButtonText} <ArrowRight size={17} />
            </button>

            {/* Social Media Channels on About Us */}
            <div className="pt-4 flex flex-col items-center">
              <span className="text-xs text-white/80 font-medium mb-2">Connect with our leadership:</span>
              <SocialLinksBar
                channels={settings.socialChannels}
                fallbackLinks={{
                  linkedin: settings.linkedin,
                  twitter: settings.twitter,
                  facebook: settings.facebook,
                  instagram: settings.instagram,
                  youtube: settings.youtube,
                }}
                variant="card"
                iconSize={15}
              />
            </div>
          </section>
        </EditableSectionContainer>

        <footer className="about-page-footer"><span /> Integrity in every detail <b>•</b> Partnership in every process</footer>
      </div>
    </main>
  );
}

function FileCheckIcon() {
  return <CheckCircle2 size={15} />;
}

export default AboutUs;
