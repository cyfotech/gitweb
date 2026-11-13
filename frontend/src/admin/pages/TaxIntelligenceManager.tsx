import React, { useState, useEffect } from 'react';
import {
  Sparkles, Save, RotateCcw, Plus, Trash2, CheckCircle2,
  Sliders, Eye, Image as ImageIcon, BarChart2, ShieldCheck,
  Star, DollarSign, Layers, Layout, RefreshCw, Upload, Smartphone, Tablet, Monitor
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { ThreeDCard, MagneticButton } from '../components/ThreeDComponents';
import { settingsApi } from '../../api/settings';

export interface TaxIntelligenceConfig {
  title: string;
  badge: string;
  annualReviewLabel: string;
  annualReviewMetric: string;
  caption: string;
  chartBars: Array<{
    id: string;
    label: string;
    value: number;
    color: string;
    enabled: boolean;
  }>;
  complianceCard: {
    title: string;
    seal: string;
    subtitle: string;
    status: string;
  };
  talentCard: {
    title: string;
    icon: string;
    subtitle: string;
    status: string;
  };
  coin: {
    symbol: string;
    enabled: boolean;
    text: string;
  };
  containerStyle: {
    bgOpacity: number;
    blur: number;
    borderColor: string;
    bgImageUrl?: string;
  };
}

export const defaultTaxIntelligenceConfig: TaxIntelligenceConfig = {
  title: 'Tax intelligence',
  badge: 'PREMIER TAX COMPLIANCE',
  annualReviewLabel: 'Annual review',
  annualReviewMetric: '+18.6%',
  caption: 'Trusted financial expertise',
  chartBars: [
    { id: 'b1', label: 'Jan', value: 35, color: '#22b887', enabled: true },
    { id: 'b2', label: 'Feb', value: 45, color: '#2dd4bf', enabled: true },
    { id: 'b3', label: 'Mar', value: 40, color: '#38bdf8', enabled: true },
    { id: 'b4', label: 'Apr', value: 65, color: '#34d399', enabled: true },
    { id: 'b5', label: 'May', value: 55, color: '#22b887', enabled: true },
    { id: 'b6', label: 'Jun', value: 80, color: '#2dd4bf', enabled: true },
    { id: 'b7', label: 'Jul', value: 95, color: '#49e3d6', enabled: true },
  ],
  complianceCard: {
    title: 'COMPLIANCE',
    seal: 'ShieldCheck',
    subtitle: 'Reviewed & verified',
    status: 'active',
  },
  talentCard: {
    title: 'CPA / EA',
    icon: 'Star',
    subtitle: 'Expert talent',
    status: 'active',
  },
  coin: {
    symbol: '$',
    enabled: true,
    text: 'USD',
  },
  containerStyle: {
    bgOpacity: 0.85,
    blur: 16,
    borderColor: '#49e3d6',
  },
};

export function TaxIntelligenceManagerPage() {
  const [activeTab, setActiveTab] = useState<'content' | 'bars' | 'cards' | 'style' | 'preview'>('content');
  const [config, setConfig] = useState<TaxIntelligenceConfig>(defaultTaxIntelligenceConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    settingsApi.getAll()
      .then((res) => {
        if (res && res.tax_intelligence_config) {
          setConfig({ ...defaultTaxIntelligenceConfig, ...res.tax_intelligence_config });
        }
      })
      .catch((err) => console.warn('Could not fetch tax intelligence config:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await settingsApi.updateKey('tax_intelligence_config', config, 'Tax Intelligence Visual Dashboard Configuration', 'visual_components');
      setSuccessMsg('Tax Intelligence configuration published successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      alert('Failed to save: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset Tax Intelligence visual component to default?')) return;
    setConfig(defaultTaxIntelligenceConfig);
    await settingsApi.updateKey('tax_intelligence_config', defaultTaxIntelligenceConfig, 'Tax Intelligence Visual Dashboard Configuration', 'visual_components');
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
              <DollarSign size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Tax Intelligence Visual Manager
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-600 dark:text-cyan-300 border border-teal-500/20">
                  Dedicated Module
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Complete control over the 3D Tax Intelligence dashboard, dynamic chart bars, floating compliance cards, and coin indicators.
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
            { id: 'content', label: '1. Titles & Metrics', icon: Sliders },
            { id: 'bars', label: `2. Chart Bars (${config.chartBars.length})`, icon: BarChart2 },
            { id: 'cards', label: '3. Floating Cards & Coin', icon: Layers },
            { id: 'style', label: '4. Background & Glassmorphism', icon: Layout },
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

        {/* TAB 1: Content */}
        {activeTab === 'content' && (
          <ThreeDCard className="p-6 rounded-3xl bg-white/70 dark:bg-[#071C25]/80 border border-teal-500/20 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders size={18} className="text-teal-500" />
              <span>Dashboard Titles &amp; Footnote Metrics</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Dashboard Title
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
                  Caption / Kicker Tag
                </label>
                <input
                  type="text"
                  value={config.caption}
                  onChange={(e) => setConfig({ ...config, caption: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Footer Review Label
                </label>
                <input
                  type="text"
                  value={config.annualReviewLabel}
                  onChange={(e) => setConfig({ ...config, annualReviewLabel: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Growth Metric (Percentage)
                </label>
                <input
                  type="text"
                  value={config.annualReviewMetric}
                  onChange={(e) => setConfig({ ...config, annualReviewMetric: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none font-mono"
                />
              </div>
            </div>
          </ThreeDCard>
        )}

        {/* TAB 2: Dynamic Chart Bars */}
        {activeTab === 'bars' && (
          <ThreeDCard className="p-6 rounded-3xl bg-white/70 dark:bg-[#071C25]/80 border border-teal-500/20 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart2 size={18} className="text-teal-500" />
                  <span>Dynamic Chart Bars Management</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Add, edit, reorder, or customize the height and colors of each bar in the Tax Intelligence chart.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newBar = {
                    id: `b${Date.now()}`,
                    label: `M${config.chartBars.length + 1}`,
                    value: 60,
                    color: '#2dd4bf',
                    enabled: true,
                  };
                  setConfig({ ...config, chartBars: [...config.chartBars, newBar] });
                }}
                className="px-3.5 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-cyan-400 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Plus size={14} />
                <span>Add Bar</span>
              </button>
            </div>

            <div className="space-y-3">
              {config.chartBars.map((bar, idx) => (
                <div
                  key={bar.id}
                  className="p-3.5 rounded-2xl bg-black/5 dark:bg-black/30 border border-teal-500/10 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                >
                  <div className="sm:col-span-1 flex items-center gap-2">
                    <input
                      type="color"
                      value={bar.color}
                      onChange={(e) => {
                        const updated = [...config.chartBars];
                        updated[idx].color = e.target.value;
                        setConfig({ ...config, chartBars: updated });
                      }}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Month / Label</label>
                    <input
                      type="text"
                      value={bar.label}
                      onChange={(e) => {
                        const updated = [...config.chartBars];
                        updated[idx].label = e.target.value;
                        setConfig({ ...config, chartBars: updated });
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-0.5">
                      <span>Value / Height</span>
                      <span className="text-teal-400">{bar.value}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={bar.value}
                      onChange={(e) => {
                        const updated = [...config.chartBars];
                        updated[idx].value = parseInt(e.target.value) || 10;
                        setConfig({ ...config, chartBars: updated });
                      }}
                      className="w-full accent-teal-500 cursor-pointer"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-2">
                    <label className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bar.enabled}
                        onChange={(e) => {
                          const updated = [...config.chartBars];
                          updated[idx].enabled = e.target.checked;
                          setConfig({ ...config, chartBars: updated });
                        }}
                        className="rounded text-teal-500"
                      />
                      <span>Active</span>
                    </label>
                  </div>

                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (config.chartBars.length <= 2) {
                          alert('At least two bars are required for the visual.');
                          return;
                        }
                        const updated = config.chartBars.filter((_, i) => i !== idx);
                        setConfig({ ...config, chartBars: updated });
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </ThreeDCard>
        )}

        {/* TAB 3: Floating Cards & Coin */}
        {activeTab === 'cards' && (
          <ThreeDCard className="p-6 rounded-3xl bg-white/70 dark:bg-[#071C25]/80 border border-teal-500/20 shadow-xl space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers size={18} className="text-teal-500" />
              <span>Floating Compliance Badges &amp; 3D Currency Coin</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Compliance Card 1 */}
              <div className="p-5 rounded-2xl bg-black/5 dark:bg-black/30 border border-teal-500/10 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-emerald-400" />
                  <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                    Floating Card 1 (Compliance)
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={config.complianceCard.title}
                    onChange={(e) => setConfig({
                      ...config,
                      complianceCard: { ...config.complianceCard, title: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={config.complianceCard.subtitle}
                    onChange={(e) => setConfig({
                      ...config,
                      complianceCard: { ...config.complianceCard, subtitle: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Talent Card 2 */}
              <div className="p-5 rounded-2xl bg-black/5 dark:bg-black/30 border border-teal-500/10 space-y-3">
                <div className="flex items-center gap-2">
                  <Star size={20} className="text-amber-400" />
                  <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                    Floating Card 2 (CPA / EA Talent)
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={config.talentCard.title}
                    onChange={(e) => setConfig({
                      ...config,
                      talentCard: { ...config.talentCard, title: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={config.talentCard.subtitle}
                    onChange={(e) => setConfig({
                      ...config,
                      talentCard: { ...config.talentCard, subtitle: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Floating Coin */}
              <div className="md:col-span-2 p-5 rounded-2xl bg-black/5 dark:bg-black/30 border border-teal-500/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-white block">Floating Financial Coin</span>
                  <span className="text-[11px] text-slate-400">Golden 3D circular currency token hovering beside the dashboard</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    maxLength={3}
                    value={config.coin.symbol}
                    onChange={(e) => setConfig({
                      ...config,
                      coin: { ...config.coin, symbol: e.target.value }
                    })}
                    className="w-12 text-center px-2 py-1 text-xs rounded-lg bg-white dark:bg-[#030e14] border border-teal-500/20 font-bold"
                  />
                  <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.coin.enabled}
                      onChange={(e) => setConfig({
                        ...config,
                        coin: { ...config.coin, enabled: e.target.checked }
                      })}
                      className="rounded text-teal-500"
                    />
                    <span>Visible</span>
                  </label>
                </div>
              </div>
            </div>
          </ThreeDCard>
        )}

        {/* TAB 4: Styling & Glassmorphism */}
        {activeTab === 'style' && (
          <ThreeDCard className="p-6 rounded-3xl bg-white/70 dark:bg-[#071C25]/80 border border-teal-500/20 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layout size={18} className="text-teal-500" />
              <span>Container Glassmorphism &amp; Background Options</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Optional Background Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://... or /assets/..."
                  value={config.containerStyle.bgImageUrl || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    containerStyle: { ...config.containerStyle, bgImageUrl: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Container Border Glow Color
                </label>
                <input
                  type="text"
                  value={config.containerStyle.borderColor}
                  onChange={(e) => setConfig({
                    ...config,
                    containerStyle: { ...config.containerStyle, borderColor: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Backdrop Blur Filter</span>
                  <span className="text-teal-400">{config.containerStyle.blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="32"
                  value={config.containerStyle.blur}
                  onChange={(e) => setConfig({
                    ...config,
                    containerStyle: { ...config.containerStyle, blur: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Glass Opacity</span>
                  <span className="text-teal-400">{Math.round(config.containerStyle.bgOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={config.containerStyle.bgOpacity}
                  onChange={(e) => setConfig({
                    ...config,
                    containerStyle: { ...config.containerStyle, bgOpacity: parseFloat(e.target.value) || 0.85 }
                  })}
                  className="w-full accent-teal-500 cursor-pointer"
                />
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
                <span>Live Public Component Simulation</span>
              </div>
              <span className="text-[11px] text-slate-400">Updates live from your form adjustments</span>
            </div>

            {/* Simulated 3D Art Stage */}
            <div className="relative min-h-[380px] flex items-center justify-center p-8 overflow-hidden rounded-2xl bg-[#03151D]/80 border border-teal-500/20">
              <div className="w-full max-w-lg relative p-6 rounded-3xl bg-[#06242e]/90 border border-[#2dd4bf]/40 backdrop-blur-xl shadow-2xl space-y-5">
                {/* Topline dots */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                    <span className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center font-bold text-teal-300">
                      {config.coin.symbol}
                    </span>
                    <span>{config.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-60">
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                  </div>
                </div>

                {/* Bars Chart */}
                <div className="h-32 flex items-end justify-between gap-2 px-2 pt-4 border-b border-teal-500/20">
                  {config.chartBars.filter(b => b.enabled).map((bar) => (
                    <div key={bar.id} className="flex-1 flex flex-col items-center gap-1 group">
                      <div
                        style={{ height: `${bar.value}%`, backgroundColor: bar.color }}
                        className="w-full rounded-t-lg transition-all group-hover:brightness-125"
                      />
                      <span className="text-[9px] font-mono text-slate-400">{bar.label}</span>
                    </div>
                  ))}
                </div>

                {/* Footer Review */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">{config.annualReviewLabel}</span>
                  <b className="text-teal-400 font-mono text-sm">{config.annualReviewMetric}</b>
                </div>

                {/* Simulated Floating Badges */}
                <div className="absolute -top-4 -right-4 p-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-xl text-center">
                  <ShieldCheck size={18} className="mx-auto text-emerald-400" />
                  <strong className="text-[9px] block text-white mt-1">{config.complianceCard.title}</strong>
                  <small className="text-[8px] text-slate-300">{config.complianceCard.subtitle}</small>
                </div>

                <div className="absolute -bottom-4 -left-4 p-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-xl text-center">
                  <Star size={16} className="mx-auto text-amber-400" />
                  <strong className="text-[9px] block text-white mt-1">{config.talentCard.title}</strong>
                  <small className="text-[8px] text-slate-300">{config.talentCard.subtitle}</small>
                </div>
              </div>
            </div>
          </ThreeDCard>
        )}

      </div>
    </AdminLayout>
  );
}

