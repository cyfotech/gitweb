import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import './FinancialDonutChart.css';

export interface FinancialDonutDatum {
  id: string;
  name: string;
  value: number;
  color: string;
  description?: string;
  metric?: string;
}

interface FinancialDonutChartProps {
  data: FinancialDonutDatum[];
  title: string;
  subtitle: string;
  centerLabel: string;
  valueFormatter?: (value: number) => string;
  totalFormatter?: (value: number) => string;
  onSelectionChange?: (item: FinancialDonutDatum) => void;
  tone?: 'home' | 'about' | 'services';
  variant?: 'home' | 'executive' | 'service-rings';
}

const DEFAULT_RADIUS = 82;
const DEFAULT_VALUE_FORMATTER = (value: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
const DEFAULT_TOTAL_FORMATTER = (value: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reducedMotion;
}

export function FinancialDonutChart({
  data,
  title,
  subtitle,
  centerLabel,
  valueFormatter = DEFAULT_VALUE_FORMATTER,
  totalFormatter = DEFAULT_TOTAL_FORMATTER,
  onSelectionChange,
  tone = 'home',
  variant = 'home'
}: FinancialDonutChartProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const idPrefix = `financial-donut-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(data[0]?.id ?? '');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [animatedPercent, setAnimatedPercent] = useState(0);

  const validData = useMemo(
    () => data.filter(item => Number.isFinite(item.value) && item.value > 0),
    [data]
  );
  const total = validData.reduce((sum, item) => sum + item.value, 0);
  const selectedItem = validData.find(item => item.id === selectedId) ?? validData[0];
  const activeItem = validData.find(item => item.id === hoveredId) ?? selectedItem;
  const activePercent = activeItem && total > 0 ? (activeItem.value / total) * 100 : 0;
  const selectedPercent = selectedItem && total > 0 ? (selectedItem.value / total) * 100 : 0;
  const formattedValue = valueFormatter;

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!selectedItem) {
      setAnimatedPercent(0);
      return;
    }
    if (!isVisible || reducedMotion) {
      setAnimatedPercent(isVisible ? selectedPercent : 0);
      return;
    }

    let frame = 0;
    let startTime = 0;
    setAnimatedPercent(0);
    const duration = 850;
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedPercent(selectedPercent * eased);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isVisible, reducedMotion, selectedId, selectedPercent, selectedItem]);

  if (!validData.length) {
    return (
      <div className={`financial-donut financial-donut--${tone}`} role="status">
        <p>No performance data is available.</p>
      </div>
    );
  }

  let accumulated = 0;
  const slices = validData.map((item, index) => {
    const share = item.value / total;
    const radius = variant === 'service-rings'
      ? 97 - (index * (33 / Math.max(validData.length - 1, 1)))
      : variant === 'executive' ? 84 : 78;
    const circumference = 2 * Math.PI * radius;
    const strokeWidth = variant === 'service-rings' ? 7 : variant === 'executive' ? 18 : 24;
    const separatorWidth = variant === 'service-rings' ? 0 : 5;
    const rawArcLength = share * circumference;
    const roundedCapCompensation = rawArcLength > strokeWidth + separatorWidth
      ? strokeWidth
      : 0;
    const arcLength = variant === 'service-rings'
      ? Math.max(0, rawArcLength - 3)
      : Math.max(0, rawArcLength - separatorWidth - roundedCapCompensation);
    const startOffset = variant === 'service-rings'
      ? 0
      : accumulated * circumference + separatorWidth / 2;
    const dashGap = variant === 'service-rings'
      ? circumference
      : circumference - arcLength;
    accumulated += share;
    return {
      ...item,
      index,
      radius,
      circumference,
      strokeWidth,
      strokeLinecap: roundedCapCompensation ? 'round' as const : 'butt' as const,
      arcLength,
      startOffset,
      dashGap,
      percent: share * 100,
      gradientId: `${idPrefix}-gradient-${index}`
    };
  });

  const handleSelect = (item: FinancialDonutDatum) => {
    setSelectedId(item.id);
    setHoveredId(null);
    onSelectionChange?.(item);
  };

  return (
    <div
      ref={rootRef}
      className={`financial-donut financial-donut--${tone} financial-donut--${variant}`}
      data-visible={isVisible}
      data-reduced-motion={reducedMotion}
    >
      <div className="financial-donut__heading">
        <div>
          <span className="financial-donut__eyebrow">LIVE PERFORMANCE MIX</span>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <span className="financial-donut__total">
          <small>TOTAL</small>
          <strong>{totalFormatter(total)}</strong>
        </span>
      </div>

      <div className="financial-donut__body">
        <div className="financial-donut__visual">
          {variant !== 'service-rings' && (
            <>
              <span className="financial-donut__orbit financial-donut__orbit--outer" aria-hidden="true" />
              <span className="financial-donut__orbit financial-donut__orbit--inner" aria-hidden="true" />
            </>
          )}
          <svg
            className={`financial-donut__svg financial-donut__svg--${variant}`}
            viewBox="0 0 240 240"
            role="img"
            aria-label={`${title}: ${validData.map(item => `${item.name} ${((item.value / total) * 100).toFixed(1)} percent`).join(', ')}`}
          >
            <defs>
              {slices.map(slice => (
                <linearGradient key={slice.gradientId} id={slice.gradientId} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={slice.color} stopOpacity="0.72" />
                  <stop offset="100%" stopColor={slice.color} />
                </linearGradient>
              ))}
              <radialGradient id={`${idPrefix}-home-halo`}>
                <stop offset="0%" stopColor="#ffffff" stopOpacity=".16" />
                <stop offset="72%" stopColor="#ffffff" stopOpacity=".025" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
              <radialGradient id={`${idPrefix}-service-core`} cx="35%" cy="25%">
                <stop offset="0%" stopColor="#19464a" />
                <stop offset="100%" stopColor="#092b34" />
              </radialGradient>
              <filter id={`${idPrefix}-glow`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation={variant === 'home' ? '2.2' : '1.5'} result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id={`${idPrefix}-shadow`} x="-30%" y="-30%" width="160%" height="170%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
                <feOffset dy="7" result="offsetBlur" />
                <feComponentTransfer><feFuncA type="linear" slope=".28" /></feComponentTransfer>
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {variant === 'home' && (
              <>
                <circle className="financial-donut__home-halo" cx="120" cy="120" r="94" fill={`url(#${idPrefix}-home-halo)`} />
                <circle className="financial-donut__track" cx="120" cy="120" r="78" />
                <circle className="financial-donut__ring" cx="120" cy="120" r="104" />
                <circle className="financial-donut__ring financial-donut__ring--inner" cx="120" cy="120" r="58" />
              </>
            )}
            {variant === 'executive' && (
              <>
                <circle className="financial-donut__executive-track" cx="120" cy="120" r="84" />
                <circle className="financial-donut__executive-rail" cx="120" cy="120" r="103" />
                <circle className="financial-donut__executive-rail financial-donut__executive-rail--inner" cx="120" cy="120" r="62" />
              </>
            )}
            {variant === 'service-rings' && slices.map(slice => (
              <circle
                key={`track-${slice.id}`}
                className="financial-donut__service-track"
                cx="120"
                cy="120"
                r={slice.radius}
                style={{ '--ring-order': slice.index } as CSSProperties}
              />
            ))}
            {variant === 'home' && (
              <g className="financial-donut__depth" transform="rotate(-90 120 120) translate(0 7)">
                {slices.map(slice => (
                  <circle
                    key={`depth-${slice.id}`}
                    className="financial-donut__depth-slice"
                    cx="120"
                    cy="120"
                    r={slice.radius}
                    fill="none"
                    stroke={slice.color}
                    strokeWidth={slice.strokeWidth}
                    strokeDasharray={isVisible ? `${slice.arcLength}px ${slice.dashGap}px` : `0 ${slice.circumference}px`}
                    strokeDashoffset={-slice.startOffset}
                    strokeLinecap={slice.strokeLinecap}
                    style={{
                      '--slice-length': `${slice.arcLength}px`,
                      '--circle-length': `${slice.circumference}px`,
                      '--slice-gap': `${slice.dashGap}px`,
                      '--slice-delay': `${slice.index * 220}ms`
                    } as CSSProperties}
                  />
                ))}
              </g>
            )}
            <g className={`financial-donut__slices financial-donut__slices--${variant}`} transform="rotate(-90 120 120)">
              {slices.map(slice => {
                const style = {
                  '--slice-length': `${slice.arcLength}px`,
                  '--circle-length': `${slice.circumference}px`,
                  '--slice-gap': `${slice.dashGap}px`,
                  '--slice-delay': `${slice.index * (variant === 'executive' ? 260 : 220)}ms`
                } as CSSProperties;
                return (
                  <circle
                    key={slice.id}
                    className={`financial-donut__slice${activeItem.id === slice.id ? ' is-active' : ''}`}
                    cx="120"
                    cy="120"
                    r={slice.radius}
                    fill="none"
                    stroke={`url(#${slice.gradientId})`}
                    strokeWidth={slice.strokeWidth}
                    strokeDasharray={isVisible ? `${slice.arcLength}px ${slice.dashGap}px` : `0 ${slice.circumference}px`}
                    strokeDashoffset={-slice.startOffset}
                    strokeLinecap={slice.strokeLinecap}
                    style={style}
                    filter={activeItem.id === slice.id ? `url(#${idPrefix}-${variant === 'home' ? 'shadow' : 'glow'})` : undefined}
                    onPointerEnter={() => setHoveredId(slice.id)}
                    onPointerLeave={() => setHoveredId(null)}
                    onFocus={() => setHoveredId(slice.id)}
                    onBlur={() => setHoveredId(null)}
                    onClick={() => handleSelect(slice)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${slice.name}, ${slice.percent.toFixed(1)} percent, ${formattedValue(slice.value)}`}
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleSelect(slice);
                      }
                    }}
                  />
                );
              })}
            </g>
            {variant === 'home' && (
              <circle className="financial-donut__home-glint" cx="120" cy="120" r="78" />
            )}
            {variant === 'service-rings' && (
              <circle className="financial-donut__service-core" cx="120" cy="120" r="49" fill={`url(#${idPrefix}-service-core)`} />
            )}
            <text className="financial-donut__center-value" x="120" y="115" textAnchor="middle">
              {animatedPercent.toFixed(1)}%
            </text>
            <text className="financial-donut__center-label" x="120" y="133" textAnchor="middle">
              {centerLabel}
            </text>
            <text className="financial-donut__center-total" x="120" y="150" textAnchor="middle">
              {totalFormatter(total)} total
            </text>
          </svg>
          <div className="financial-donut__selection-badge" aria-live="polite">
            <i style={{ backgroundColor: activeItem.color }} />
            <span>{activeItem.name}</span>
            <strong>{activePercent.toFixed(1)}%</strong>
          </div>
        </div>

        <div className="financial-donut__legend" role="list" aria-label="Chart categories">
          {slices.map(slice => (
            <button
              type="button"
              key={slice.id}
              className={`financial-donut__legend-item${selectedItem.id === slice.id ? ' is-selected' : ''}${activeItem.id === slice.id ? ' is-active' : ''}`}
              onClick={() => handleSelect(slice)}
              onPointerEnter={() => setHoveredId(slice.id)}
              onPointerLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(slice.id)}
              onBlur={() => setHoveredId(null)}
              aria-pressed={selectedItem.id === slice.id}
            >
              <i className="financial-donut__swatch" style={{ backgroundColor: slice.color }} />
              <span className="financial-donut__legend-copy">
                <strong>{slice.name}</strong>
                <small>{slice.metric || formattedValue(slice.value)}</small>
              </span>
              <span className="financial-donut__legend-value">
                <strong>{slice.percent.toFixed(1)}%</strong>
                <small>{formattedValue(slice.value)}</small>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="financial-donut__tooltip" aria-live="polite">
        <span className="financial-donut__tooltip-mark" style={{ backgroundColor: activeItem.color }} />
        <span className="financial-donut__tooltip-copy">
          <strong>{activeItem.name}</strong>
          <small>{activeItem.description || 'Performance share based on the displayed reporting period.'}</small>
        </span>
        <span className="financial-donut__tooltip-value">
          <strong>{formattedValue(activeItem.value)}</strong>
          <small>{activePercent.toFixed(1)}% of total</small>
        </span>
      </div>
    </div>
  );
}
