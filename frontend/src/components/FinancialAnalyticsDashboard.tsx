import React, { useState } from 'react';
import {
  TrendingUp,
  FileText,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronDown,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Calendar
} from 'lucide-react';
import { EditableElement } from './EditableElement';
import { useVisualEditor, ChartConfig } from '../context/VisualEditorContext';

type TabView = 'revenue' | 'expenses' | 'cashflow';

interface MonthData {
  month: string;
  revenue: number;
  expenses: number;
  cashflow: number;
}

const DEFAULT_FINANCIAL_DATA: MonthData[] = [
  { month: 'Jan', revenue: 78, expenses: 45, cashflow: 33 },
  { month: 'Feb', revenue: 84, expenses: 48, cashflow: 36 },
  { month: 'Mar', revenue: 98, expenses: 52, cashflow: 46 },
  { month: 'Apr', revenue: 120, expenses: 58, cashflow: 62 },
  { month: 'May', revenue: 95, expenses: 50, cashflow: 45 },
  { month: 'Jun', revenue: 104, expenses: 54, cashflow: 50 },
  { month: 'Jul', revenue: 110, expenses: 55, cashflow: 55 },
  { month: 'Aug', revenue: 115, expenses: 56, cashflow: 59 },
  { month: 'Sep', revenue: 108, expenses: 53, cashflow: 55 },
  { month: 'Oct', revenue: 125, expenses: 60, cashflow: 65 },
  { month: 'Nov', revenue: 132, expenses: 62, cashflow: 70 },
  { month: 'Dec', revenue: 145, expenses: 65, cashflow: 80 }
];

export function FinancialAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<TabView>('revenue');
  const [activePeriod, setActivePeriod] = useState<string>('This Year');
  const [hoveredMonth, setHoveredMonth] = useState<MonthData | null>(null);

  const visualEditor = useVisualEditor();
  const heroSection = visualEditor?.draftState?.sections?.find(s => s.sectionKey === 'hero');
  
  let customChartConfig: any = null;
  let parsedHeroContent: any = {};
  if (heroSection?.content) {
    try {
      parsedHeroContent = JSON.parse(heroSection.content);
      if (parsedHeroContent.chart_financial_analytics) {
        customChartConfig = parsedHeroContent.chart_financial_analytics;
      }
    } catch {}
  }

  const rawData: MonthData[] = customChartConfig?.dataPoints?.length
    ? customChartConfig.dataPoints.map((dp: any) => ({
        month: dp.label || 'Mo',
        revenue: Number(dp.value) || 50,
        expenses: Number(dp.expenses ?? dp.value * 0.5) || 30,
        cashflow: Number(dp.cashflow ?? dp.value * 0.4) || 20,
      }))
    : DEFAULT_FINANCIAL_DATA;

  const activeChartType: any = customChartConfig?.chartType || 'bar';

  const currentChartConfig: ChartConfig = {
    title: customChartConfig?.title || 'Financial Performance & Compliance Hub',
    subtitle: customChartConfig?.subtitle || 'Executive Analytics Overview',
    chartType: activeChartType,
    xAxisLabel: customChartConfig?.xAxisLabel || 'Months',
    yAxisLabel: customChartConfig?.yAxisLabel || 'Index / $K',
    unit: customChartConfig?.unit || '$K',
    seriesName: customChartConfig?.seriesName || activeTab.toUpperCase(),
    dataPoints: rawData.map(d => ({
      label: d.month,
      value: d[activeTab],
      expenses: d.expenses,
      cashflow: d.cashflow
    })),
    animation: customChartConfig?.animation || {
      enabled: true,
      duration: 600,
      delay: 100,
      easing: 'ease-in-out'
    }
  };

  const tabMetrics = {
    revenue: {
      headline: '$1,248,500',
      change: '+18.4%',
      isPositive: true,
      sublabel: 'YTD Gross Revenue'
    },
    expenses: {
      headline: '$682,100',
      change: '-5.2%',
      isPositive: true,
      sublabel: 'YTD Operating Costs'
    },
    cashflow: {
      headline: '$566,400',
      change: '+29.6%',
      isPositive: true,
      sublabel: 'Net Free Cash Flow'
    }
  };

  const currentMetric = tabMetrics[activeTab];

  const customYtd = parsedHeroContent.kpi_ytd_revenue;
  const customSavings = parsedHeroContent.kpi_tax_savings;
  const customAudit = parsedHeroContent.kpi_audit_confidence;

  const ytdTitle = typeof customYtd === 'object' ? customYtd.title : customYtd || currentMetric.headline;
  const ytdBadge = typeof customYtd === 'object' ? customYtd.badge : `${currentMetric.change} vs Prior Year`;
  const ytdDesc = typeof customYtd === 'object' ? customYtd.description : currentMetric.sublabel;

  const savingsTitle = typeof customSavings === 'object' ? customSavings.title : customSavings || '$142,800';
  const savingsBadge = typeof customSavings === 'object' ? customSavings.badge : 'Via QBI & Sec 179 Accelerated';
  const savingsDesc = typeof customSavings === 'object' ? customSavings.description : 'Projected Tax Savings';

  const auditTitle = typeof customAudit === 'object' ? customAudit.title : customAudit || '99.98%';
  const auditBadge = typeof customAudit === 'object' ? customAudit.badge : 'Dual CPA Review Gate Passed';
  const auditDesc = typeof customAudit === 'object' ? customAudit.description : 'Filing Audit Confidence';

  return (
    <div
      className="w-full rounded-3xl p-5 sm:p-7 bg-white/90 dark:bg-[#071C25]/90 backdrop-blur-xl border border-[#DCECE3] dark:border-[rgba(53,224,146,0.22)] shadow-2xl relative select-none"
      aria-label="Financial analytics dashboard demonstration"
    >
      {/* Top Header of the Analytics Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#DCECE3] dark:border-[rgba(53,224,146,0.15)]">
        <div>
          <EditableElement
            sectionKey="hero"
            elementKey="chart_eyebrow"
            elementType="badge"
            label="Dashboard Eyebrow"
            value={currentChartConfig.subtitle}
          >
            <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#22AF68] dark:text-[#35E092] mb-1">
              <span className="w-2 h-2 rounded-full bg-[#35E092] animate-pulse" />
              <span>{currentChartConfig.subtitle || 'EXECUTIVE ANALYTICS OVERVIEW'}</span>
            </div>
          </EditableElement>

          <EditableElement
            sectionKey="hero"
            elementKey="chart_title"
            elementType="heading"
            label="Dashboard Title"
            value={currentChartConfig.title}
          >
            <h3 className="text-lg sm:text-xl font-bold font-serif-editorial text-[#17262B] dark:text-[#F2FBF7]">
              {currentChartConfig.title || 'Financial Performance & Compliance Hub'}
            </h3>
          </EditableElement>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="inline-flex p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-[#DCECE3] dark:border-[rgba(53,224,146,0.15)] text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('revenue')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'revenue'
                  ? 'bg-[#17383F] text-white dark:bg-[#35E092] dark:text-[#051917] shadow-sm'
                  : 'text-[#52646A] dark:text-[#88A4AB] hover:text-[#17262B] dark:hover:text-white'
              }`}
            >
              Revenue
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('expenses')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'expenses'
                  ? 'bg-[#17383F] text-white dark:bg-[#35E092] dark:text-[#051917] shadow-sm'
                  : 'text-[#52646A] dark:text-[#88A4AB] hover:text-[#17262B] dark:hover:text-white'
              }`}
            >
              Expenses
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cashflow')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'cashflow'
                  ? 'bg-[#17383F] text-white dark:bg-[#35E092] dark:text-[#051917] shadow-sm'
                  : 'text-[#52646A] dark:text-[#88A4AB] hover:text-[#17262B] dark:hover:text-white'
              }`}
            >
              Cash Flow
            </button>
          </div>

          <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#DCECE3] dark:border-[rgba(53,224,146,0.18)] bg-white/80 dark:bg-black/20 text-xs font-semibold text-[#52646A] dark:text-[#B6CAD0]">
            <Calendar className="w-3.5 h-3.5 text-[#22AF68]" />
            <span>{activePeriod}</span>
          </div>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
        <EditableElement
          sectionKey="hero"
          elementKey="kpi_ytd_revenue"
          elementType="card"
          label="YTD Revenue Card"
          value={typeof customYtd === 'object' ? customYtd : { title: ytdTitle, badge: ytdBadge, description: ytdDesc }}
        >
          <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#DCECE3] dark:border-[rgba(53,224,146,0.12)]">
            <div className="text-[11px] font-semibold text-[#52646A] dark:text-[#88A4AB]">
              {ytdDesc}
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-[#17262B] dark:text-[#F2FBF7] mt-0.5">
              {ytdTitle}
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-[#35E092] mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>{ytdBadge}</span>
            </div>
          </div>
        </EditableElement>

        <EditableElement
          sectionKey="hero"
          elementKey="kpi_tax_savings"
          elementType="card"
          label="Projected Savings Card"
          value={typeof customSavings === 'object' ? customSavings : { title: savingsTitle, badge: savingsBadge, description: savingsDesc }}
        >
          <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#DCECE3] dark:border-[rgba(53,224,146,0.12)]">
            <div className="text-[11px] font-semibold text-[#52646A] dark:text-[#88A4AB]">
              {savingsDesc}
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-[#22AF68] dark:text-[#35E092] mt-0.5">
              {savingsTitle}
            </div>
            <div className="text-[11px] text-[#52646A] dark:text-[#88A4AB] mt-1">
              {savingsBadge}
            </div>
          </div>
        </EditableElement>

        <EditableElement
          sectionKey="hero"
          elementKey="kpi_audit_confidence"
          elementType="card"
          label="Audit Confidence Card"
          value={typeof customAudit === 'object' ? customAudit : { title: auditTitle, badge: auditBadge, description: auditDesc }}
        >
          <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#DCECE3] dark:border-[rgba(53,224,146,0.12)]">
            <div className="text-[11px] font-semibold text-[#52646A] dark:text-[#88A4AB]">
              {auditDesc}
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-[#17262B] dark:text-[#F2FBF7] mt-0.5">
              {auditTitle}
            </div>
            <div className="text-[11px] text-[#52646A] dark:text-[#88A4AB] mt-1">
              {auditBadge}
            </div>
          </div>
        </EditableElement>
      </div>

      {/* Main Bar & Area Chart Visualization — CLICK TO EDIT CHART */}
      <EditableElement
        sectionKey="hero"
        elementKey="chart_financial_analytics"
        elementType="chart"
        label="Monthly Financial Realization Chart"
        chartConfig={currentChartConfig}
        value={currentChartConfig}
      >
        <div className="relative p-4 rounded-2xl bg-[#F8FAF9] dark:bg-[#041416]/70 border border-[#DCECE3] dark:border-[rgba(53,224,146,0.12)] mb-5">
          <div className="flex items-center justify-between text-xs text-[#52646A] dark:text-[#88A4AB] mb-3">
            <span className="font-semibold">Monthly Realization Schedule (Jan &ndash; Dec)</span>
            <span className="text-[11px] italic">Illustrative financial model &bull; Verified proportional scaling</span>
          </div>

          {/* SVG Chart with Dynamic Chart Type Support (Bar, Horizontal Bar, Line, Area, Pie, Donut, Radar, Scatter, Stacked Bar, Mixed) */}
          <div className="h-48 sm:h-52 w-full">
            {activeChartType === 'pie' || activeChartType === 'donut' ? (
              // Pie / Donut Chart View
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180">
                <g transform="translate(180, 90)">
                  {(() => {
                    const total = rawData.reduce((acc, cur) => acc + (cur[activeTab] || 10), 0) || 1;
                    let accumulatedAngle = 0;
                    const colors = ['#35E092', '#22AF68', '#49E3D6', '#2BB5A8', '#10B981', '#064E3B', '#34D399', '#6EE7B7', '#A7F3D0', '#059669', '#14B8A6', '#0D9488'];
                    const isDonut = activeChartType === 'donut';
                    const outerRadius = 75;
                    const innerRadius = isDonut ? 45 : 0;

                    return rawData.map((d, i) => {
                      const val = d[activeTab] || 10;
                      const sliceAngle = (val / total) * 2 * Math.PI;
                      const startAngle = accumulatedAngle;
                      const endAngle = accumulatedAngle + sliceAngle;
                      accumulatedAngle = endAngle;

                      const x1 = Math.cos(startAngle) * outerRadius;
                      const y1 = Math.sin(startAngle) * outerRadius;
                      const x2 = Math.cos(endAngle) * outerRadius;
                      const y2 = Math.sin(endAngle) * outerRadius;

                      const ix1 = Math.cos(startAngle) * innerRadius;
                      const iy1 = Math.sin(startAngle) * innerRadius;
                      const ix2 = Math.cos(endAngle) * innerRadius;
                      const iy2 = Math.sin(endAngle) * innerRadius;

                      const largeArc = sliceAngle > Math.PI ? 1 : 0;

                      const pathData = isDonut
                        ? `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z`
                        : `M 0 0 L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

                      const isHovered = hoveredMonth?.month === d.month;

                      return (
                        <path
                          key={d.month + i}
                          d={pathData}
                          fill={colors[i % colors.length]}
                          className={`transition-all duration-300 cursor-pointer ${isHovered ? 'filter brightness-125 scale-105 origin-center' : 'opacity-90'}`}
                          onMouseEnter={() => setHoveredMonth(d)}
                          onMouseLeave={() => setHoveredMonth(null)}
                        />
                      );
                    });
                  })()}
                </g>

                {/* Donut Center Total Label */}
                {activeChartType === 'donut' && (
                  <g transform="translate(180, 90)">
                    <text textAnchor="middle" dy="-4" className="text-[10px] font-bold fill-current text-slate-400">TOTAL</text>
                    <text textAnchor="middle" dy="14" className="text-sm font-extrabold font-mono fill-current text-emerald-500 dark:text-[#35E092]">
                      ${rawData.reduce((acc, c) => acc + (c[activeTab] || 0), 0)}k
                    </text>
                  </g>
                )}

                {/* Pie/Donut Legend Grid */}
                <g transform="translate(340, 20)">
                  {rawData.slice(0, 8).map((d, i) => {
                    const colors = ['#35E092', '#22AF68', '#49E3D6', '#2BB5A8', '#10B981', '#064E3B', '#34D399', '#6EE7B7'];
                    const col = i % 2;
                    const row = Math.floor(i / 2);
                    return (
                      <g key={'leg-' + d.month} transform={`translate(${col * 120}, ${row * 35})`} className="cursor-pointer" onMouseEnter={() => setHoveredMonth(d)} onMouseLeave={() => setHoveredMonth(null)}>
                        <rect width="10" height="10" rx="3" fill={colors[i % colors.length]} />
                        <text x="16" y="9" className="text-[11px] font-medium fill-current text-[#52646A] dark:text-[#88A4AB]">
                          {d.month}: ${d[activeTab]}k
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            ) : activeChartType === 'horizontal_bar' ? (
              // Horizontal Bar Chart
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180">
                <defs>
                  <linearGradient id="hBarGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#22AF68" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#35E092" stopOpacity="1" />
                  </linearGradient>
                </defs>
                {rawData.slice(0, 6).map((d, i) => {
                  const y = 15 + i * 27;
                  const maxVal = Math.max(...rawData.map(item => item[activeTab] || 50), 100);
                  const barWidth = Math.min(460, Math.max(20, (d[activeTab] / maxVal) * 440));
                  const isHovered = hoveredMonth?.month === d.month;

                  return (
                    <g key={'hbar-' + d.month} onMouseEnter={() => setHoveredMonth(d)} onMouseLeave={() => setHoveredMonth(null)} className="cursor-pointer">
                      <text x="0" y={y + 13} className="text-[11px] font-mono fill-current text-[#52646A] dark:text-[#88A4AB] font-semibold">{d.month}</text>
                      <rect x="45" y={y} width={barWidth} height="18" rx="5" fill="url(#hBarGrad)" className={`transition-all duration-300 ${isHovered ? 'filter brightness-115 scale-x-102' : 'opacity-90'}`} />
                      <text x={55 + barWidth} y={y + 13} className="text-[11px] font-mono font-bold fill-current text-emerald-600 dark:text-[#35E092]">${d[activeTab]}k</text>
                    </g>
                  );
                })}
              </svg>
            ) : activeChartType === 'radar' ? (
              // Radar Chart
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180">
                <g transform="translate(300, 90)">
                  {[20, 45, 70].map((r) => (
                    <polygon
                      key={r}
                      fill="none"
                      stroke="currentColor"
                      strokeOpacity="0.12"
                      points={Array.from({ length: 6 }).map((_, i) => {
                        const angle = (i / 6) * 2 * Math.PI - Math.PI / 2;
                        return `${Math.cos(angle) * r},${Math.sin(angle) * r}`;
                      }).join(' ')}
                    />
                  ))}
                  {/* Radar Polygon */}
                  <polygon
                    fill="#35E092"
                    fillOpacity="0.3"
                    stroke="#35E092"
                    strokeWidth="2"
                    points={rawData.slice(0, 6).map((d, i) => {
                      const maxVal = Math.max(...rawData.map(item => item[activeTab] || 50), 100);
                      const r = Math.min(70, Math.max(15, (d[activeTab] / maxVal) * 65));
                      const angle = (i / 6) * 2 * Math.PI - Math.PI / 2;
                      return `${Math.cos(angle) * r},${Math.sin(angle) * r}`;
                    }).join(' ')}
                  />
                  {/* Radar Points and Labels */}
                  {rawData.slice(0, 6).map((d, i) => {
                    const maxVal = Math.max(...rawData.map(item => item[activeTab] || 50), 100);
                    const r = Math.min(70, Math.max(15, (d[activeTab] / maxVal) * 65));
                    const angle = (i / 6) * 2 * Math.PI - Math.PI / 2;
                    const lx = Math.cos(angle) * 85;
                    const ly = Math.sin(angle) * 85;
                    const px = Math.cos(angle) * r;
                    const py = Math.sin(angle) * r;
                    return (
                      <g key={'radar-' + d.month} onMouseEnter={() => setHoveredMonth(d)} onMouseLeave={() => setHoveredMonth(null)} className="cursor-pointer">
                        <circle cx={px} cy={py} r="4" fill="#10B981" />
                        <text x={lx} y={ly + 4} textAnchor="middle" className="text-[10px] font-bold fill-current text-[#52646A] dark:text-[#88A4AB]">{d.month}</text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            ) : activeChartType === 'scatter' ? (
              // Scatter Chart
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180">
                {[30, 70, 110, 150].map((y) => (
                  <line key={y} x1="30" y1={y} x2="570" y2={y} stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
                ))}
                {rawData.map((d, i) => {
                  const x = 40 + i * (520 / Math.max(rawData.length - 1, 1));
                  const maxVal = Math.max(...rawData.map(item => item[activeTab] || 50), 100);
                  const y = 150 - (d[activeTab] / maxVal) * 120;
                  const isHovered = hoveredMonth?.month === d.month;
                  return (
                    <g key={'scat-' + d.month} onMouseEnter={() => setHoveredMonth(d)} onMouseLeave={() => setHoveredMonth(null)} className="cursor-pointer">
                      <circle cx={x} cy={y} r={isHovered ? 8 : 6} fill="#35E092" className="transition-all duration-300 drop-shadow-md" />
                      <circle cx={x} cy={y} r="12" fill="#35E092" fillOpacity={isHovered ? 0.3 : 0.1} />
                      <text x={x} y="168" textAnchor="middle" className="text-[10px] font-mono fill-current text-[#52646A] dark:text-[#88A4AB]">{d.month}</text>
                    </g>
                  );
                })}
              </svg>
            ) : (
              // Standard Vertical Bar, Line, Area, Stacked Bar or Mixed
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 160">
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#35E092" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#22AF68" stopOpacity="0.75" />
                  </linearGradient>
                  <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#49E3D6" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.65" />
                  </linearGradient>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#35E092" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#35E092" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[20, 55, 90, 125].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="600"
                    y2={y}
                    stroke="currentColor"
                    strokeOpacity="0.08"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Area fill for Area and Mixed chart types */}
                {(activeChartType === 'area' || activeChartType === 'mixed') && (
                  <polygon
                    fill="url(#areaGrad)"
                    points={`20,140 ${rawData.map((d, i) => {
                      const x = 20 + i * (560 / Math.max(rawData.length, 1)) + Math.max(8, 220 / Math.max(rawData.length, 1));
                      const val = d[activeTab] || 50;
                      const maxVal = Math.max(...rawData.map(item => item[activeTab] || 50), 100);
                      const y = 140 - Math.min(130, Math.max(10, (val / maxVal) * 115));
                      return `${x},${y}`;
                    }).join(' ')} 580,140`}
                  />
                )}

                {/* Bars for Bar, Stacked Bar, and Mixed */}
                {activeChartType !== 'line' && activeChartType !== 'area' && rawData.map((d, i) => {
                  const x = 20 + i * (560 / Math.max(rawData.length, 1));
                  const val = d[activeTab] || 50;
                  const maxVal = Math.max(...rawData.map(item => item[activeTab] || 50), 100);
                  const height = Math.min(130, Math.max(10, (val / maxVal) * 115));
                  const y = 140 - height;
                  const isHovered = hoveredMonth?.month === d.month;
                  const barWidth = Math.max(16, 440 / Math.max(rawData.length, 1));

                  return (
                    <g
                      key={`${d.month}-${i}`}
                      onMouseEnter={() => setHoveredMonth(d)}
                      onMouseLeave={() => setHoveredMonth(null)}
                      className="cursor-pointer group"
                    >
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={height}
                        rx="5"
                        fill="url(#barGrad)"
                        className={`transition-all duration-300 ${
                          isHovered ? 'filter brightness-110 drop-shadow-md scale-y-105 origin-bottom' : 'opacity-90'
                        }`}
                      />
                      {activeChartType === 'stacked_bar' && (
                        <rect
                          x={x}
                          y={y - Math.min(40, height * 0.4)}
                          width={barWidth}
                          height={Math.min(40, height * 0.4)}
                          rx="4"
                          fill="url(#barGrad2)"
                          className="opacity-80"
                        />
                      )}
                      <text
                        x={x + Math.max(8, 220 / Math.max(rawData.length, 1))}
                        y="155"
                        textAnchor="middle"
                        className="text-[11px] font-sans fill-current text-[#52646A] dark:text-[#88A4AB]"
                      >
                        {d.month}
                      </text>
                    </g>
                  );
                })}

                {/* Trend Polyline (Line, Area, Mixed) */}
                {(activeChartType === 'line' || activeChartType === 'area' || activeChartType === 'mixed' || activeChartType === 'bar') && (
                  <polyline
                    fill="none"
                    stroke="#17383F"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="dark:stroke-[#64F4B8] drop-shadow-sm transition-all duration-500"
                    points={rawData.map((d, i) => {
                      const x = 20 + i * (560 / Math.max(rawData.length, 1)) + Math.max(8, 220 / Math.max(rawData.length, 1));
                      const val = d[activeTab] || 50;
                      const maxVal = Math.max(...rawData.map(item => item[activeTab] || 50), 100);
                      const y = 140 - Math.min(130, Math.max(10, (val / maxVal) * 115)) - 4;
                      return `${x},${y}`;
                    }).join(' ')}
                  />
                )}

                {/* Line Points when in pure Line Mode */}
                {activeChartType === 'line' && rawData.map((d, i) => {
                  const x = 20 + i * (560 / Math.max(rawData.length, 1)) + Math.max(8, 220 / Math.max(rawData.length, 1));
                  const val = d[activeTab] || 50;
                  const maxVal = Math.max(...rawData.map(item => item[activeTab] || 50), 100);
                  const y = 140 - Math.min(130, Math.max(10, (val / maxVal) * 115)) - 4;
                  return (
                    <g key={'pt-' + d.month} onMouseEnter={() => setHoveredMonth(d)} onMouseLeave={() => setHoveredMonth(null)} className="cursor-pointer">
                      <circle cx={x} cy={y} r="5" fill="#35E092" className="drop-shadow-md" />
                      <text x={x} y="155" textAnchor="middle" className="text-[11px] font-sans fill-current text-[#52646A] dark:text-[#88A4AB]">{d.month}</text>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          {/* Hover detail tooltip */}
          {hoveredMonth && (
            <div className="absolute top-3 right-4 px-3 py-1.5 rounded-lg bg-[#17383F] text-white dark:bg-[#35E092] dark:text-[#051917] text-xs font-mono font-bold shadow-lg animate-in fade-in">
              {hoveredMonth.month}: ${hoveredMonth[activeTab]}k ({activeTab})
            </div>
          )}
        </div>
      </EditableElement>

      {/* Two Supporting Dashboard Cards: Document Status & Compliance Gauge */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Document Ingestion & Verification Card */}
        <EditableElement
          sectionKey="hero"
          elementKey="card_doc_ingestion"
          elementType="card"
          label="Document Intake Pipeline Card"
        >
          <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#DCECE3] dark:border-[rgba(53,224,146,0.12)] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#22AF68]" />
                <span className="font-bold text-xs">Documents: Secure &amp; Organized</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#35E092]">
                TLS 1.3 Active
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#0A2328] border border-[#DCECE3]/60 dark:border-[rgba(53,224,146,0.1)]">
                <span className="text-[#52646A] dark:text-[#B6CAD0]">Form 1040 Diagnostic Review</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-[#35E092]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Completed
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#0A2328] border border-[#DCECE3]/60 dark:border-[rgba(53,224,146,0.1)]">
                <span className="text-[#52646A] dark:text-[#B6CAD0]">Multi-State 1120-S Returns</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  <Clock className="w-3.5 h-3.5" />
                  In Progress (Tier 2)
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#0A2328] border border-[#DCECE3]/60 dark:border-[rgba(53,224,146,0.1)]">
                <span className="text-[#52646A] dark:text-[#B6CAD0]">Bank &amp; Ledger Reconciliation</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-[#35E092]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Balanced &bull; $0 Var
                </span>
              </div>
            </div>
          </div>
        </EditableElement>

        {/* Circular Compliance Progress Gauge Card */}
        <EditableElement
          sectionKey="hero"
          elementKey="card_compliance_gauge"
          elementType="card"
          label="Compliance Gauge Card"
        >
          <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#DCECE3] dark:border-[rgba(53,224,146,0.12)] flex items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-[#22AF68]" />
                <span>Tax Compliance: On Track</span>
              </div>
              <p className="text-[11px] text-[#52646A] dark:text-[#88A4AB] leading-relaxed">
                Diagnostic checklist verified against IRS Circular 230 and state apportionment guidelines.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-semibold text-[#52646A] dark:text-[#B6CAD0]">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#22AF68]" /> Returns Filed
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#22AF68]" /> Workpapers Synced
                </span>
              </div>
            </div>

            {/* Circular SVG Gauge 92% */}
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeWidth="7"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="#22AF68"
                  strokeWidth="7"
                  strokeDasharray="213.6"
                  strokeDashoffset={213.6 * (1 - 0.92)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-black font-mono leading-none text-[#17262B] dark:text-white">
                  92%
                </span>
                <span className="text-[9px] font-bold text-[#52646A] dark:text-[#88A4AB]">
                  ON TRACK
                </span>
              </div>
            </div>
          </div>
        </EditableElement>
      </div>
    </div>
  );
}
