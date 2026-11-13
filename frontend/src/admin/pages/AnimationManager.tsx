import React, { useState } from 'react';
import {
  PlayCircle,
  Save,
  RotateCcw,
  Layers,
  Plus,
  Trash2,
  CheckCircle2,
  Sliders,
  Activity,
  BarChart2,
  PieChart,
  TrendingUp,
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { ThreeDCard, MagneticButton } from '../components/ThreeDComponents';
import { useAnimationSettings, defaultAnimationSettings } from '../../context/AnimationSettingsContext';

export function AnimationManagerPage() {
  const { settings, loading, updateSettings, resetToDefaults } = useAnimationSettings();

  const [activeTab, setActiveTab] = useState<'global' | 'home-chart' | 'about-hero' | 'about-chart' | 'cpa-pipeline' | 'services'>('global');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Local state initialized from context
  const [form, setForm] = useState(settings);

  // Sync state when settings load
  React.useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await updateSettings(form);
      setSuccessMsg('Animation settings saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      alert('Failed to save settings: ' + (err.message || 'Error'));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset all website animation content & settings back to system defaults?')) return;
    setSaving(true);
    try {
      await resetToDefaults();
      setForm(defaultAnimationSettings);
      setSuccessMsg('Reset to defaults complete.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      alert('Reset failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/70 dark:bg-[#071C25]/80 border border-teal-500/20 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-cyan-400 border border-teal-500/20">
              <PlayCircle size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Live Animation &amp; Simulation Manager
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-600 dark:text-cyan-300 border border-teal-500/20">
                  Global CMS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Centralized control for all live animations, motion loops, financial simulation charts, and step sequences across the entire website.
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
              <span>Reset Defaults</span>
            </button>
            <MagneticButton
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-teal-500/20 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save size={14} />
              <span>{saving ? 'Saving Changes...' : 'Save All Animations'}</span>
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
            { id: 'global', label: 'Global Motion Settings', icon: Sliders },
            { id: 'home-chart', label: 'Home Page Donut Chart', icon: BarChart2 },
            { id: 'about-hero', label: 'About Us Hero Trend & Quality Card', icon: TrendingUp },
            { id: 'about-chart', label: 'About Us Service Performance Pie', icon: PieChart },
            { id: 'cpa-pipeline', label: 'CPA Collaboration Pipeline', icon: Activity },
            { id: 'services', label: 'Service Detail Animations Guide', icon: Layers },
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

        {/* TAB 1: Global Motion Controls */}
        {activeTab === 'global' && (
          <ThreeDCard className="p-6 rounded-3xl bg-white/70 dark:bg-[#071C25]/80 border border-teal-500/20 shadow-xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders size={18} className="text-teal-500" />
                <span>Central Motion Engine Rules</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Configure firm-wide playback rules for all interactive loops, auto-progressing steps, and SVG transitions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Toggles */}
              <div className="space-y-4 p-5 rounded-2xl bg-black/5 dark:bg-black/30 border border-teal-500/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-cyan-400">
                  Playback Behavior
                </h4>

                <label className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-teal-500/5 cursor-pointer transition-colors">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white block">Enable Live Animations</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Master switch for all website animations</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.animationsEnabled}
                    onChange={(e) => setForm({ ...form, animationsEnabled: e.target.checked })}
                    className="w-4 h-4 text-teal-500 rounded border-slate-300 focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-teal-500/5 cursor-pointer transition-colors">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white block">Autoplay Loops</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Automatically progress simulation steps</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.autoplay}
                    onChange={(e) => setForm({ ...form, autoplay: e.target.checked })}
                    className="w-4 h-4 text-teal-500 rounded border-slate-300 focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-teal-500/5 cursor-pointer transition-colors">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white block">Infinite Loop</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Loop back to Step 1 after reaching final stage</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.loop}
                    onChange={(e) => setForm({ ...form, loop: e.target.checked })}
                    className="w-4 h-4 text-teal-500 rounded border-slate-300 focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-teal-500/5 cursor-pointer transition-colors">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white block">Reduced Motion Support</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Honor OS preference for reduced animations</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.reducedMotion}
                    onChange={(e) => setForm({ ...form, reducedMotion: e.target.checked })}
                    className="w-4 h-4 text-teal-500 rounded border-slate-300 focus:ring-teal-500"
                  />
                </label>
              </div>

              {/* Right Column: Timing */}
              <div className="space-y-4 p-5 rounded-2xl bg-black/5 dark:bg-black/30 border border-teal-500/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-cyan-400">
                  Timing &amp; Cadence
                </h4>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-white mb-2">
                    <span>Speed Multiplier</span>
                    <span className="text-teal-500">{form.speedMultiplier}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={form.speedMultiplier}
                    onChange={(e) => setForm({ ...form, speedMultiplier: parseFloat(e.target.value) })}
                    className="w-full accent-teal-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>0.5x (Relaxed)</span>
                    <span>1.0x (Standard)</span>
                    <span>2.0x (Swift)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-white mb-2">
                    Default Step Transition Delay (Milliseconds)
                  </label>
                  <input
                    type="number"
                    min="1500"
                    max="10000"
                    step="500"
                    value={form.cycleIntervalMs}
                    onChange={(e) => setForm({ ...form, cycleIntervalMs: parseInt(e.target.value) || 4200 })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Recommended: 4200ms (4.2 seconds per stage)</p>
                </div>
              </div>
            </div>
          </ThreeDCard>
        )}

        {/* TAB 2: Home Page Donut Chart */}
        {activeTab === 'home-chart' && (
          <ThreeDCard className="p-6 rounded-3xl bg-white/70 dark:bg-[#071C25]/80 border border-teal-500/20 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart2 size={18} className="text-teal-500" />
                  <span>Home Hero Donut Chart Content</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Edit the financial operations donut breakdown, slice values, and summary labels shown in the Home Page hero section.
                </p>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.homeDonutChart?.enabled ?? true}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      homeDonutChart: {
                        ...(form.homeDonutChart || defaultAnimationSettings.homeDonutChart!),
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 text-teal-500 rounded border-slate-300"
                />
                <span>Display Donut Chart</span>
              </label>
            </div>

            {/* Labels */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Card Main Title
                </label>
                <input
                  type="text"
                  value={form.homeDonutChart?.title || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      homeDonutChart: {
                        ...(form.homeDonutChart || defaultAnimationSettings.homeDonutChart!),
                        title: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Card Subtitle
                </label>
                <input
                  type="text"
                  value={form.homeDonutChart?.subtitle || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      homeDonutChart: {
                        ...(form.homeDonutChart || defaultAnimationSettings.homeDonutChart!),
                        subtitle: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Center Ring Label
                </label>
                <input
                  type="text"
                  value={form.homeDonutChart?.centerLabel || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      homeDonutChart: {
                        ...(form.homeDonutChart || defaultAnimationSettings.homeDonutChart!),
                        centerLabel: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Slices Array */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-cyan-400">
                  Data Slices ({form.homeDonutChart?.items?.length || 0})
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    const current = form.homeDonutChart?.items || defaultAnimationSettings.homeDonutChart!.items;
                    const newItem = {
                      id: `item-${Date.now()}`,
                      name: 'New Practice Area',
                      value: 500000,
                      color: '#42c5bd',
                      description: 'Description of service delivered',
                      metric: '1,000+ units',
                    };
                    setForm({
                      ...form,
                      homeDonutChart: {
                        ...(form.homeDonutChart || defaultAnimationSettings.homeDonutChart!),
                        items: [...current, newItem],
                      },
                    });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-cyan-400 text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <Plus size={14} />
                  <span>Add Slice</span>
                </button>
              </div>

              <div className="space-y-3">
                {(form.homeDonutChart?.items || defaultAnimationSettings.homeDonutChart!.items).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-2xl bg-black/5 dark:bg-black/30 border border-teal-500/10 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                  >
                    <div className="sm:col-span-1 flex items-center gap-2">
                      <input
                        type="color"
                        value={item.color}
                        onChange={(e) => {
                          const updated = [...(form.homeDonutChart?.items || defaultAnimationSettings.homeDonutChart!.items)];
                          updated[idx] = { ...updated[idx], color: e.target.value };
                          setForm({
                            ...form,
                            homeDonutChart: {
                              ...(form.homeDonutChart || defaultAnimationSettings.homeDonutChart!),
                              items: updated,
                            },
                          });
                        }}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                        title="Slice Color"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const updated = [...(form.homeDonutChart?.items || defaultAnimationSettings.homeDonutChart!.items)];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setForm({
                            ...form,
                            homeDonutChart: {
                              ...(form.homeDonutChart || defaultAnimationSettings.homeDonutChart!),
                              items: updated,
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Value (Numerical)</label>
                      <input
                        type="number"
                        value={item.value}
                        onChange={(e) => {
                          const updated = [...(form.homeDonutChart?.items || defaultAnimationSettings.homeDonutChart!.items)];
                          updated[idx] = { ...updated[idx], value: parseFloat(e.target.value) || 0 };
                          setForm({
                            ...form,
                            homeDonutChart: {
                              ...(form.homeDonutChart || defaultAnimationSettings.homeDonutChart!),
                              items: updated,
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Metric Badge</label>
                      <input
                        type="text"
                        value={item.metric || ''}
                        onChange={(e) => {
                          const updated = [...(form.homeDonutChart?.items || defaultAnimationSettings.homeDonutChart!.items)];
                          updated[idx] = { ...updated[idx], metric: e.target.value };
                          setForm({
                            ...form,
                            homeDonutChart: {
                              ...(form.homeDonutChart || defaultAnimationSettings.homeDonutChart!),
                              items: updated,
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Description</label>
                      <input
                        type="text"
                        value={item.description || ''}
                        onChange={(e) => {
                          const updated = [...(form.homeDonutChart?.items || defaultAnimationSettings.homeDonutChart!.items)];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setForm({
                            ...form,
                            homeDonutChart: {
                              ...(form.homeDonutChart || defaultAnimationSettings.homeDonutChart!),
                              items: updated,
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          const current = form.homeDonutChart?.items || defaultAnimationSettings.homeDonutChart!.items;
                          if (current.length <= 1) {
                            alert('At least one data slice is required.');
                            return;
                          }
                          const updated = current.filter((_, i) => i !== idx);
                          setForm({
                            ...form,
                            homeDonutChart: {
                              ...(form.homeDonutChart || defaultAnimationSettings.homeDonutChart!),
                              items: updated,
                            },
                          });
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete slice"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ThreeDCard>
        )}

        {/* TAB: About Us Hero Trend Card */}
        {activeTab === 'about-hero' && (
          <ThreeDCard className="p-6 rounded-3xl bg-white/70 dark:bg-[#071C25]/80 border border-teal-500/20 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp size={18} className="text-teal-500" />
                  <span>About Us Hero Financial Performance Trend Card</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Live data editing for the Hero interactive trend donut and floating Operational Quality badge on the About Us page.
                </p>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.aboutHeroTrend?.enabled ?? true}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      aboutHeroTrend: {
                        ...(form.aboutHeroTrend || defaultAnimationSettings.aboutHeroTrend!),
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 text-teal-500 rounded border-slate-300"
                />
                <span>Display About Hero Trend</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Trend Main Title
                </label>
                <input
                  type="text"
                  value={form.aboutHeroTrend?.title || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      aboutHeroTrend: {
                        ...(form.aboutHeroTrend || defaultAnimationSettings.aboutHeroTrend!),
                        title: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Card Subtitle
                </label>
                <input
                  type="text"
                  value={form.aboutHeroTrend?.subtitle || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      aboutHeroTrend: {
                        ...(form.aboutHeroTrend || defaultAnimationSettings.aboutHeroTrend!),
                        subtitle: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Quality Card Metric Label
                </label>
                <input
                  type="text"
                  value={form.aboutHeroTrend?.metricCardLabel || 'Operational quality'}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      aboutHeroTrend: {
                        ...(form.aboutHeroTrend || defaultAnimationSettings.aboutHeroTrend!),
                        metricCardLabel: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Quality Metric Value
                </label>
                <input
                  type="text"
                  value={form.aboutHeroTrend?.metricCardValue || '99.8%'}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      aboutHeroTrend: {
                        ...(form.aboutHeroTrend || defaultAnimationSettings.aboutHeroTrend!),
                        metricCardValue: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Quarter Slices */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-cyan-400">
                Quarterly Breakdown Slices ({form.aboutHeroTrend?.items?.length || 0})
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(form.aboutHeroTrend?.items || defaultAnimationSettings.aboutHeroTrend!.items).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-2xl bg-black/5 dark:bg-black/30 border border-teal-500/10 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800 dark:text-white">{item.name}</span>
                      <input
                        type="color"
                        value={item.color}
                        onChange={(e) => {
                          const updated = [...(form.aboutHeroTrend?.items || defaultAnimationSettings.aboutHeroTrend!.items)];
                          updated[idx] = { ...updated[idx], color: e.target.value };
                          setForm({
                            ...form,
                            aboutHeroTrend: {
                              ...(form.aboutHeroTrend || defaultAnimationSettings.aboutHeroTrend!),
                              items: updated,
                            },
                          });
                        }}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Display Value / Label</label>
                      <input
                        type="text"
                        value={item.metric || ''}
                        onChange={(e) => {
                          const updated = [...(form.aboutHeroTrend?.items || defaultAnimationSettings.aboutHeroTrend!.items)];
                          updated[idx] = { ...updated[idx], metric: e.target.value };
                          setForm({
                            ...form,
                            aboutHeroTrend: {
                              ...(form.aboutHeroTrend || defaultAnimationSettings.aboutHeroTrend!),
                              items: updated,
                            },
                          });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Numerical Value (Weight)</label>
                      <input
                        type="number"
                        value={item.value}
                        onChange={(e) => {
                          const updated = [...(form.aboutHeroTrend?.items || defaultAnimationSettings.aboutHeroTrend!.items)];
                          updated[idx] = { ...updated[idx], value: parseFloat(e.target.value) || 0 };
                          setForm({
                            ...form,
                            aboutHeroTrend: {
                              ...(form.aboutHeroTrend || defaultAnimationSettings.aboutHeroTrend!),
                              items: updated,
                            },
                          });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ThreeDCard>
        )}

        {/* TAB 3: About Us Service Performance Pie */}
        {activeTab === 'about-chart' && (
          <ThreeDCard className="p-6 rounded-3xl bg-white/70 dark:bg-[#071C25]/80 border border-teal-500/20 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <PieChart size={18} className="text-teal-500" />
                  <span>About Us Service Performance Pie Chart</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Edit the Service Performance Analytics breakdown and snapshot metrics shown on the About Us page.
                </p>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.aboutPieChart?.enabled ?? true}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      aboutPieChart: {
                        ...(form.aboutPieChart || defaultAnimationSettings.aboutPieChart!),
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 text-teal-500 rounded border-slate-300"
                />
                <span>Display About Pie Chart</span>
              </label>
            </div>

            {/* Labels */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Card Main Title
                </label>
                <input
                  type="text"
                  value={form.aboutPieChart?.title || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      aboutPieChart: {
                        ...(form.aboutPieChart || defaultAnimationSettings.aboutPieChart!),
                        title: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Card Subtitle
                </label>
                <input
                  type="text"
                  value={form.aboutPieChart?.subtitle || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      aboutPieChart: {
                        ...(form.aboutPieChart || defaultAnimationSettings.aboutPieChart!),
                        subtitle: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Center Ring Label
                </label>
                <input
                  type="text"
                  value={form.aboutPieChart?.centerLabel || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      aboutPieChart: {
                        ...(form.aboutPieChart || defaultAnimationSettings.aboutPieChart!),
                        centerLabel: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Slices Array */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-cyan-400">
                  Data Slices ({form.aboutPieChart?.items?.length || 0})
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    const current = form.aboutPieChart?.items || defaultAnimationSettings.aboutPieChart!.items;
                    const newItem = {
                      id: `service-slice-${Date.now()}`,
                      name: 'Corporate Advisory',
                      value: 450000,
                      color: '#42c5bd',
                      description: 'Advisory and tax planning deliverables.',
                      metric: '980+ engagements',
                    };
                    setForm({
                      ...form,
                      aboutPieChart: {
                        ...(form.aboutPieChart || defaultAnimationSettings.aboutPieChart!),
                        items: [...current, newItem],
                      },
                    });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-cyan-400 text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <Plus size={14} />
                  <span>Add Slice</span>
                </button>
              </div>

              <div className="space-y-3">
                {(form.aboutPieChart?.items || defaultAnimationSettings.aboutPieChart!.items).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-2xl bg-black/5 dark:bg-black/30 border border-teal-500/10 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                  >
                    <div className="sm:col-span-1 flex items-center gap-2">
                      <input
                        type="color"
                        value={item.color}
                        onChange={(e) => {
                          const updated = [...(form.aboutPieChart?.items || defaultAnimationSettings.aboutPieChart!.items)];
                          updated[idx] = { ...updated[idx], color: e.target.value };
                          setForm({
                            ...form,
                            aboutPieChart: {
                              ...(form.aboutPieChart || defaultAnimationSettings.aboutPieChart!),
                              items: updated,
                            },
                          });
                        }}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                        title="Slice Color"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const updated = [...(form.aboutPieChart?.items || defaultAnimationSettings.aboutPieChart!.items)];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setForm({
                            ...form,
                            aboutPieChart: {
                              ...(form.aboutPieChart || defaultAnimationSettings.aboutPieChart!),
                              items: updated,
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Value (Numerical)</label>
                      <input
                        type="number"
                        value={item.value}
                        onChange={(e) => {
                          const updated = [...(form.aboutPieChart?.items || defaultAnimationSettings.aboutPieChart!.items)];
                          updated[idx] = { ...updated[idx], value: parseFloat(e.target.value) || 0 };
                          setForm({
                            ...form,
                            aboutPieChart: {
                              ...(form.aboutPieChart || defaultAnimationSettings.aboutPieChart!),
                              items: updated,
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Metric Badge</label>
                      <input
                        type="text"
                        value={item.metric || ''}
                        onChange={(e) => {
                          const updated = [...(form.aboutPieChart?.items || defaultAnimationSettings.aboutPieChart!.items)];
                          updated[idx] = { ...updated[idx], metric: e.target.value };
                          setForm({
                            ...form,
                            aboutPieChart: {
                              ...(form.aboutPieChart || defaultAnimationSettings.aboutPieChart!),
                              items: updated,
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Description</label>
                      <input
                        type="text"
                        value={item.description || ''}
                        onChange={(e) => {
                          const updated = [...(form.aboutPieChart?.items || defaultAnimationSettings.aboutPieChart!.items)];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setForm({
                            ...form,
                            aboutPieChart: {
                              ...(form.aboutPieChart || defaultAnimationSettings.aboutPieChart!),
                              items: updated,
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          const current = form.aboutPieChart?.items || defaultAnimationSettings.aboutPieChart!.items;
                          if (current.length <= 1) {
                            alert('At least one data slice is required.');
                            return;
                          }
                          const updated = current.filter((_, i) => i !== idx);
                          setForm({
                            ...form,
                            aboutPieChart: {
                              ...(form.aboutPieChart || defaultAnimationSettings.aboutPieChart!),
                              items: updated,
                            },
                          });
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete slice"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ThreeDCard>
        )}

        {/* TAB 4: CPA Collaboration Pipeline */}
        {activeTab === 'cpa-pipeline' && (
          <ThreeDCard className="p-6 rounded-3xl bg-white/70 dark:bg-[#071C25]/80 border border-teal-500/20 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity size={18} className="text-teal-500" />
                  <span>CPA Collaboration Pipeline Animation Stages</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Manage the multi-stage interactive collaboration stepper displayed in the CPA Outsourcing section.
                </p>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.cpaCollaborationPipeline?.autoAdvance ?? true}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      cpaCollaborationPipeline: {
                        ...(form.cpaCollaborationPipeline || defaultAnimationSettings.cpaCollaborationPipeline!),
                        autoAdvance: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 text-teal-500 rounded border-slate-300"
                />
                <span>Auto-Advance Stages</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Stage Cycle Interval (ms)
                </label>
                <input
                  type="number"
                  min="2000"
                  max="15000"
                  step="500"
                  value={form.cpaCollaborationPipeline?.cycleIntervalMs || 6000}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      cpaCollaborationPipeline: {
                        ...(form.cpaCollaborationPipeline || defaultAnimationSettings.cpaCollaborationPipeline!),
                        cycleIntervalMs: parseInt(e.target.value) || 6000,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Stages List */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-cyan-400">
                Pipeline Stages ({(form.cpaCollaborationPipeline?.stages || defaultAnimationSettings.cpaCollaborationPipeline!.stages).length})
              </h4>

              {(form.cpaCollaborationPipeline?.stages || defaultAnimationSettings.cpaCollaborationPipeline!.stages).map((stage, idx) => (
                <div
                  key={stage.id}
                  className="p-5 rounded-2xl bg-black/5 dark:bg-black/30 border border-teal-500/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-teal-600 dark:text-cyan-400">
                      STAGE 0{stage.id}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      Cadence: {stage.duration}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Title</label>
                      <input
                        type="text"
                        value={stage.title}
                        onChange={(e) => {
                          const updated = [...(form.cpaCollaborationPipeline?.stages || defaultAnimationSettings.cpaCollaborationPipeline!.stages)];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setForm({
                            ...form,
                            cpaCollaborationPipeline: {
                              ...(form.cpaCollaborationPipeline || defaultAnimationSettings.cpaCollaborationPipeline!),
                              stages: updated,
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Short Label</label>
                      <input
                        type="text"
                        value={stage.shortTitle}
                        onChange={(e) => {
                          const updated = [...(form.cpaCollaborationPipeline?.stages || defaultAnimationSettings.cpaCollaborationPipeline!.stages)];
                          updated[idx] = { ...updated[idx], shortTitle: e.target.value };
                          setForm({
                            ...form,
                            cpaCollaborationPipeline: {
                              ...(form.cpaCollaborationPipeline || defaultAnimationSettings.cpaCollaborationPipeline!),
                              stages: updated,
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Duration Badge</label>
                      <input
                        type="text"
                        value={stage.duration}
                        onChange={(e) => {
                          const updated = [...(form.cpaCollaborationPipeline?.stages || defaultAnimationSettings.cpaCollaborationPipeline!.stages)];
                          updated[idx] = { ...updated[idx], duration: e.target.value };
                          setForm({
                            ...form,
                            cpaCollaborationPipeline: {
                              ...(form.cpaCollaborationPipeline || defaultAnimationSettings.cpaCollaborationPipeline!),
                              stages: updated,
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Executive Summary
                      </label>
                      <textarea
                        rows={2}
                        value={stage.summary}
                        onChange={(e) => {
                          const updated = [...(form.cpaCollaborationPipeline?.stages || defaultAnimationSettings.cpaCollaborationPipeline!.stages)];
                          updated[idx] = { ...updated[idx], summary: e.target.value };
                          setForm({
                            ...form,
                            cpaCollaborationPipeline: {
                              ...(form.cpaCollaborationPipeline || defaultAnimationSettings.cpaCollaborationPipeline!),
                              stages: updated,
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Security Controls Checkpoint
                      </label>
                      <textarea
                        rows={2}
                        value={stage.securityControls || ''}
                        onChange={(e) => {
                          const updated = [...(form.cpaCollaborationPipeline?.stages || defaultAnimationSettings.cpaCollaborationPipeline!.stages)];
                          updated[idx] = { ...updated[idx], securityControls: e.target.value };
                          setForm({
                            ...form,
                            cpaCollaborationPipeline: {
                              ...(form.cpaCollaborationPipeline || defaultAnimationSettings.cpaCollaborationPipeline!),
                              stages: updated,
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ThreeDCard>
        )}

        {/* TAB 5: Services CMS Link */}
        {activeTab === 'services' && (
          <ThreeDCard className="p-6 rounded-3xl bg-white/70 dark:bg-[#071C25]/80 border border-teal-500/20 shadow-xl space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-cyan-400 border border-teal-500/20">
                <Layers size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Per-Service Hero Workflow Animations &amp; Orbit Simulations
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
                  Each individual service offering has its own dedicated <strong>Animation &amp; Simulation</strong> editor directly inside the <strong>Services Manager</strong>. You can customize the eyebrow tag, source documents label, active focus task, result badge code, 4 animation loop stages, and the 3 financial metric cards (`GROSS RECEIPTS`, `OPERATING COSTS`, `TAXABLE INCOME`) individually per service.
                </p>
                <div className="pt-2">
                  <a
                    href="/admin/services"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all shadow-md"
                  >
                    <span>Open Services Manager</span>
                    <PlayCircle size={14} />
                  </a>
                </div>
              </div>
            </div>
          </ThreeDCard>
        )}

      </div>
    </AdminLayout>
  );
}
