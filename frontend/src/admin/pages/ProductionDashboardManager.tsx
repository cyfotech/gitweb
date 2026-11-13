import React, { useState, useEffect } from 'react';
import {
  Activity, Save, RotateCcw, Plus, Trash2, CheckCircle2,
  Sliders, Eye, Image as ImageIcon, BarChart2, ShieldCheck,
  Sparkles, FileCheck2, Cpu, ArrowUpRight, Layout, Monitor
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { ThreeDCard, MagneticButton } from '../components/ThreeDComponents';
import { settingsApi } from '../../api/settings';

export interface ProductionDashboardConfig {
  brandTag: string;
  kicker: string;
  title: string;
  statusText: string;
  stat1Title: string;
  stat1Value: string;
  stat1Change: string;
  stat2Title: string;
  stat2Value: string;
  stat2Change: string;
  chartTitle: string;
  chartSubtitle: string;
  chartType: string;
  chartData: Array<{
    day: string;
    value: number;
    throughput: number;
  }>;
  footerNote: string;
  footerTimestamp: string;
  cardTopTitle: string;
  cardTopSubtitle: string;
  cardBottomTitle: string;
  cardBottomSubtitle: string;
  caption: string;
  bgImageUrl?: string;
}

export const defaultProductionDashboardConfig: ProductionDashboardConfig = {
  brandTag: 'US tax operations',
  kicker: 'TAX PREPARATION WORKFLOW',
  title: 'Tax return workflow',
  statusText: 'Sample',
  stat1Title: 'Workflow stages',
  stat1Value: '04',
  stat1Change: 'Intake to delivery',
  stat2Title: 'Review layers',
  stat2Value: '02',
  stat2Change: 'Preparer + reviewer',
  chartTitle: 'Weekly workflow activity',
  chartSubtitle: 'Illustrative data',
  chartType: 'combined',
  chartData: [
    { day: 'Mon', value: 45, throughput: 30 },
    { day: 'Tue', value: 58, throughput: 42 },
    { day: 'Wed', value: 52, throughput: 48 },
    { day: 'Thu', value: 68, throughput: 55 },
    { day: 'Fri', value: 74, throughput: 62 },
    { day: 'Sat', value: 85, throughput: 78 },
    { day: 'Sun', value: 94, throughput: 90 },
  ],
  footerNote: 'Review-led tax preparation',
  footerTimestamp: 'Sample workflow',
  cardTopTitle: 'Independent review',
  cardTopSubtitle: 'A second set of eyes',
  cardBottomTitle: 'Flexible capacity',
  cardBottomSubtitle: 'Support for seasonal peaks',
  caption: 'White-label tax support for CPA firms',
};

export function ProductionDashboardManagerPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'chart' | 'cards' | 'preview'>('overview');
  const [config, setConfig] = useState<ProductionDashboardConfig>(defaultProductionDashboardConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    settingsApi.getAll()
      .then((res) => {
        if (res && res.production_dashboard_config) {
          setConfig({ ...defaultProductionDashboardConfig, ...res.production_dashboard_config });
        }
      })
      .catch((err) => console.warn('Could not fetch production dashboard config:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await settingsApi.updateKey('production_dashboard_config', config, 'Production Dashboard Configuration', 'visual_components');
      setSuccessMsg('Production Dashboard saved & published successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      alert('Failed to save: ' + (err.message || 'Error'));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset Production Dashboard to factory defaults?')) return;
    setConfig(defaultProductionDashboardConfig);
    await settingsApi.updateKey('production_dashboard_config', defaultProductionDashboardConfig, 'Production Dashboard Configuration', 'visual_components');
    setSuccessMsg('Reset to defaults complete.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/70 dark:bg-[#071C25]/80 border border-teal-500/20 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-cyan-400 border border-teal-500/20">
              <Activity size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Production Dashboard Manager
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-600 dark:text-cyan-300 border border-teal-500/20">
                  Dedicated Module
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage the live operations dashboard, review stats, weekly throughput curve, and floating two-tier audit cards.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
            <MagneticButton
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-teal-500/20 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save size={14} />
              <span>{saving ? 'Saving...' : 'Publish Changes'}</span>
            </MagneticButton>
          </div>
        </div>

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-teal-500/20 bg-white/40 dark:bg-black/20 rounded-2xl p-1.5 gap-2 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'overview', label: '1. Header & Identity', icon: Sliders },
            { id: 'stats', label: '2. Review & Delivery Stats', icon: BarChart2 },
            { id: 'chart', label: `3. Throughput Graph (${config.chartData.length} Days)`, icon: Activity },
            { id: 'cards', label: '4. Floating Badges', icon: ShieldCheck },
            { id: 'preview', label: '5. Live Interactive Preview', icon: Eye },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-teal-500 text-white shadow-md shadow-teal-500/25 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Overview */}
        {activeTab === 'overview' && (
          <ThreeDCard className="p-6 rounded-3xl bg-white/70 dark:bg-[#071C25]/80 border border-teal-500/20 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders size={18} className="text-teal-500" />
              <span>Dashboard Header &amp; Brand Badges</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Brand Tag
                </label>
                <input
                  type="text"
                  value={config.brandTag}
                  onChange={(e) => setConfig({ ...config, brandTag: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kicker (Eyebrow)
                </label>
                <input
                  type="text"
                  value={config.kicker}
                  onChange={(e) => setConfig({ ...config, kicker: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Main Heading
                </label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Footer Note
                </label>
                <input
                  type="text"
                  value={config.footerNote}
                  onChange={(e) => setConfig({ ...config, footerNote: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Footer Timestamp Text
                </label>
                <input
                  type="text"
                  value={config.footerTimestamp}
                  onChange={(e) => setConfig({ ...config, footerTimestamp: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bottom Caption
                </label>
                <input
                  type="text"
                  value={config.caption}
                  onChange={(e) => setConfig({ ...config, caption: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </ThreeDCard>
        )}

        {/* TAB 2: Review & Delivery Statistics */}
        {activeTab === 'stats' && (
          <ThreeDCard className="p-6 rounded-3xl bg-white/70 dark:bg-[#071C25]/80 border border-teal-500/20 shadow-xl space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 size={18} className="text-teal-500" />
              <span>Operations Metrics &amp; Live Numbers</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stat 1 */}
              <div className="p-5 rounded-2xl bg-black/5 dark:bg-black/30 border border-teal-500/10 space-y-3">
                <span className="text-xs font-bold text-teal-600 dark:text-cyan-400 uppercase tracking-wider block">
                  Metric Card 1 (Returns in Review)
                </span>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={config.stat1Title}
                    onChange={(e) => setConfig({ ...config, stat1Title: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Value (e.g. 128)</label>
                    <input
                      type="text"
                      value={config.stat1Value}
                      onChange={(e) => setConfig({ ...config, stat1Value: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Growth Badge</label>
                    <input
                      type="text"
                      value={config.stat1Change}
                      onChange={(e) => setConfig({ ...config, stat1Change: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-5 rounded-2xl bg-black/5 dark:bg-black/30 border border-teal-500/10 space-y-3">
                <span className="text-xs font-bold text-teal-600 dark:text-cyan-400 uppercase tracking-wider block">
                  Metric Card 2 (Ready for Delivery)
                </span>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={config.stat2Title}
                    onChange={(e) => setConfig({ ...config, stat2Title: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Value (e.g. 94)</label>
                    <input
                      type="text"
                      value={config.stat2Value}
                      onChange={(e) => setConfig({ ...config, stat2Value: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Status Badge</label>
                    <input
                      type="text"
                      value={config.stat2Change}
                      onChange={(e) => setConfig({ ...config, stat2Change: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </ThreeDCard>
        )}

        {/* TAB 3: Weekly Throughput Curve & Chart */}
        {activeTab === 'chart' && (
          <ThreeDCard className="p-6 rounded-3xl bg-white/70 dark:bg-[#071C25]/80 border border-teal-500/20 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity size={18} className="text-teal-500" />
                  <span>Throughput Chart Points ({config.chartData.length} Days)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Control the coordinates of the multi-gradient SVG trend line and bar volume indicators.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newPt = {
                    day: `Day ${config.chartData.length + 1}`,
                    value: 65,
                    throughput: 50,
                  };
                  setConfig({ ...config, chartData: [...config.chartData, newPt] });
                }}
                className="px-3.5 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-cyan-400 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Plus size={14} />
                <span>Add Day</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {config.chartData.map((pt, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-black/5 dark:bg-black/30 border border-teal-500/10 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={pt.day}
                      onChange={(e) => {
                        const updated = [...config.chartData];
                        updated[idx].day = e.target.value;
                        setConfig({ ...config, chartData: updated });
                      }}
                      className="w-20 px-2 py-1 text-xs font-bold rounded bg-white dark:bg-[#030e14] border border-teal-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (config.chartData.length <= 3) return;
                        const updated = config.chartData.filter((_, i) => i !== idx);
                        setConfig({ ...config, chartData: updated });
                      }}
                      className="p-1 text-rose-500 hover:bg-rose-500/10 rounded"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                      <span>Volume (Bar)</span>
                      <span>{pt.value}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={pt.value}
                      onChange={(e) => {
                        const updated = [...config.chartData];
                        updated[idx].value = parseInt(e.target.value) || 10;
                        setConfig({ ...config, chartData: updated });
                      }}
                      className="w-full accent-teal-500 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </ThreeDCard>
        )}

        {/* TAB 4: Floating Status Cards */}
        {activeTab === 'cards' && (
          <ThreeDCard className="p-6 rounded-3xl bg-white/70 dark:bg-[#071C25]/80 border border-teal-500/20 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-teal-500" />
              <span>Independent Floating Review Badges</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Badge 1 (Two-tier review) */}
              <div className="p-5 rounded-2xl bg-black/5 dark:bg-black/30 border border-teal-500/10 space-y-3">
                <div className="flex items-center gap-2">
                  <FileCheck2 size={20} className="text-teal-400" />
                  <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                    Top Floating Badge
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={config.cardTopTitle}
                    onChange={(e) => setConfig({ ...config, cardTopTitle: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={config.cardTopSubtitle}
                    onChange={(e) => setConfig({ ...config, cardTopSubtitle: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Badge 2 (Capacity optimized) */}
              <div className="p-5 rounded-2xl bg-black/5 dark:bg-black/30 border border-teal-500/10 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={20} className="text-amber-400" />
                  <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                    Bottom Floating Badge
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={config.cardBottomTitle}
                    onChange={(e) => setConfig({ ...config, cardBottomTitle: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={config.cardBottomSubtitle}
                    onChange={(e) => setConfig({ ...config, cardBottomSubtitle: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </ThreeDCard>
        )}

        {/* TAB 5: Live Interactive Preview */}
        {activeTab === 'preview' && (
          <ThreeDCard className="p-8 rounded-3xl bg-gradient-to-b from-[#030e14] to-[#071C25] border border-teal-500/30 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-teal-500/20 pb-4">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                <Monitor size={15} />
                <span>Live Public Component Simulation (CPA Outsourcing)</span>
              </div>
              <span className="text-[11px] text-slate-400">Updates live from your form adjustments</span>
            </div>

            <div className="relative min-h-[380px] flex items-center justify-center p-8 overflow-hidden rounded-2xl bg-[#03151D]/80 border border-teal-500/20">
              <div className="w-full max-w-lg relative p-6 rounded-3xl bg-[#06242e]/90 border border-[#2dd4bf]/40 backdrop-blur-xl shadow-2xl space-y-4">
                {/* Topbar */}
                <div className="flex items-center justify-between border-b border-teal-500/20 pb-2">
                  <span className="text-xs font-bold text-teal-300">{config.brandTag}</span>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                  </div>
                </div>

                {/* Operations Title */}
                <div>
                  <small className="text-[9px] uppercase tracking-wider text-teal-400 font-bold block">{config.kicker}</small>
                  <strong className="text-base text-white">{config.title}</strong>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-2xl bg-black/40 border border-teal-500/20">
                    <small className="text-[10px] text-slate-400 block">{config.stat1Title}</small>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <strong className="text-xl text-white font-mono">{config.stat1Value}</strong>
                      <span className="text-[10px] text-emerald-400">{config.stat1Change}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-teal-500/20">
                    <small className="text-[10px] text-slate-400 block">{config.stat2Title}</small>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <strong className="text-xl text-white font-mono">{config.stat2Value}</strong>
                      <span className="text-[10px] text-teal-300">{config.stat2Change}</span>
                    </div>
                  </div>
                </div>

                {/* Bars & Graph */}
                <div className="h-20 flex items-end justify-between gap-2 px-2 pt-2 border-b border-teal-500/20">
                  {config.chartData.map((pt, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        style={{ height: `${pt.value}%` }}
                        className="w-full bg-gradient-to-t from-teal-500/40 to-cyan-400 rounded-t-md"
                      />
                      <span className="text-[8px] font-mono text-slate-400">{pt.day}</span>
                    </div>
                  ))}
                </div>

                {/* Floating Badges */}
                <div className="absolute -top-4 -right-4 p-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-xl text-center">
                  <FileCheck2 size={18} className="mx-auto text-emerald-400" />
                  <strong className="text-[9px] block text-white mt-1">{config.cardTopTitle}</strong>
                  <small className="text-[8px] text-slate-300">{config.cardTopSubtitle}</small>
                </div>

                <div className="absolute -bottom-4 -left-4 p-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-xl text-center">
                  <Sparkles size={16} className="mx-auto text-amber-400" />
                  <strong className="text-[9px] block text-white mt-1">{config.cardBottomTitle}</strong>
                  <small className="text-[8px] text-slate-300">{config.cardBottomSubtitle}</small>
                </div>
              </div>
            </div>
          </ThreeDCard>
        )}

      </div>
    </AdminLayout>
  );
}

