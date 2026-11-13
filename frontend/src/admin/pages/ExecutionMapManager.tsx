import React, { useState, useEffect } from 'react';
import {
  GitCommit, Save, RotateCcw, Plus, Trash2, CheckCircle2,
  Sliders, Eye, Check, Activity, ArrowUpRight, Play, Pause,
  Layers, RefreshCw, Monitor
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { ThreeDCard, MagneticButton } from '../components/ThreeDComponents';
import { settingsApi } from '../../api/settings';

export interface ExecutionStage {
  step: string;
  phase: string;
  title: string;
  category: string;
  description: string;
  checkpointTitle: string;
  checkpointDesc: string;
  status: 'completed' | 'current' | 'pending';
  deliverable?: string;
}

export interface ExecutionMapConfig {
  mapHeading: string;
  caption: string;
  autoplay: boolean;
  cycleIntervalMs: number;
  loop: boolean;
  stages: ExecutionStage[];
}

export const defaultExecutionMapConfig: ExecutionMapConfig = {
  mapHeading: 'Execution map',
  caption: 'Illustrative sequence · simulated state',
  autoplay: true,
  cycleIntervalMs: 4200,
  loop: true,
  stages: [
    {
      step: '01',
      phase: 'PHASE 01',
      title: 'Family Wealth Discovery',
      category: 'Family Tax Planning',
      description: 'Review assets, dependent structures, and educational savings goals.',
      checkpointTitle: 'STAGE CHECKPOINT',
      checkpointDesc: 'Family Asset Map',
      status: 'completed',
      deliverable: 'Family Asset Map',
    },
    {
      step: '02',
      phase: 'PHASE 02',
      title: 'Multi-Year Tax Projection',
      category: 'Family Tax Planning',
      description: 'Simulate progressive income tax brackets across a 3-to-5 year family horizon.',
      checkpointTitle: 'STAGE CHECKPOINT',
      checkpointDesc: 'Bracket Smoothing Model',
      status: 'completed',
      deliverable: 'Bracket Smoothing Model',
    },
    {
      step: '03',
      phase: 'PHASE 03',
      title: 'Gift & 529 Strategy Draft',
      category: 'Family Tax Planning',
      description: 'Design optimal timing for college contributions and generational asset transfers.',
      checkpointTitle: 'STAGE CHECKPOINT',
      checkpointDesc: 'Actionable Allocation Plan',
      status: 'completed',
      deliverable: 'Actionable Allocation Plan',
    },
    {
      step: '04',
      phase: 'PHASE 04',
      title: 'Annual Review & Adjustment',
      category: 'Family Tax Planning',
      description: 'Recalibrate strategies annually as children reach milestone ages or tax codes change.',
      checkpointTitle: 'STAGE CHECKPOINT',
      checkpointDesc: 'Annual Strategy Memo',
      status: 'current',
      deliverable: 'Annual Strategy Memo',
    },
  ],
};

export function ExecutionMapManagerPage() {
  const [activeTab, setActiveTab] = useState<'stages' | 'orbit' | 'controls' | 'preview'>('stages');
  const [config, setConfig] = useState<ExecutionMapConfig>(defaultExecutionMapConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Preview simulation states
  const [previewActiveIdx, setPreviewActiveIdx] = useState(0);
  const [previewPlaying, setPreviewPlaying] = useState(true);

  useEffect(() => {
    settingsApi.getAll()
      .then((res) => {
        if (res && res.execution_map_config) {
          setConfig({ ...defaultExecutionMapConfig, ...res.execution_map_config });
        }
      })
      .catch((err) => console.warn('Could not fetch execution map config:', err))
      .finally(() => setLoading(false));
  }, []);

  // Simulation timer for preview
  useEffect(() => {
    if (!previewPlaying || config.stages.length < 2) return;
    const interval = setInterval(() => {
      setPreviewActiveIdx((prev) => (prev + 1) % config.stages.length);
    }, config.cycleIntervalMs || 4200);
    return () => clearInterval(interval);
  }, [previewPlaying, config.stages.length, config.cycleIntervalMs]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await settingsApi.updateKey('execution_map_config', config, 'Execution Map & Phase Walkthrough Configuration', 'visual_components');
      setSuccessMsg('Execution Map & Walkthrough stages saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      alert('Failed to save: ' + (err.message || 'Error'));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset execution map stages to system defaults?')) return;
    setConfig(defaultExecutionMapConfig);
    await settingsApi.updateKey('execution_map_config', defaultExecutionMapConfig, 'Execution Map & Phase Walkthrough Configuration', 'visual_components');
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
              <GitCommit size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Execution Map &amp; Phase Manager
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-600 dark:text-cyan-300 border border-teal-500/20">
                  Interactive Walkthrough
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Dynamic circular node map with automatic position recalculation, stage checkpoint descriptions, and live walkthrough controls.
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
              <span>{saving ? 'Saving...' : 'Publish Stages'}</span>
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
            { id: 'stages', label: `1. Stages & Checkpoints (${config.stages.length})`, icon: GitCommit },
            { id: 'orbit', label: '2. Circular Orbit & Calculation', icon: Activity },
            { id: 'controls', label: '3. Cadence & Autoplay', icon: Sliders },
            { id: 'preview', label: '4. Live Interactive Walkthrough Preview', icon: Eye },
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

        {/* TAB 1: Stages Management */}
        {activeTab === 'stages' && (
          <ThreeDCard className="p-6 rounded-3xl bg-white/70 dark:bg-[#071C25]/80 border border-teal-500/20 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <GitCommit size={18} className="text-teal-500" />
                  <span>Execution Stages &amp; Phase Checkpoints</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Add, edit, or remove stages. The circular orbit dynamically spaces {config.stages.length} nodes evenly around the 360&deg; circle.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const nextNum = config.stages.length + 1;
                  const stepStr = String(nextNum).padStart(2, '0');
                  const newStage: ExecutionStage = {
                    step: stepStr,
                    phase: `PHASE ${stepStr}`,
                    title: `Phase ${nextNum} Strategy`,
                    category: 'Execution Deliverable',
                    description: 'Detailed description of this execution milestone.',
                    checkpointTitle: 'STAGE CHECKPOINT',
                    checkpointDesc: `Milestone ${nextNum} Package`,
                    status: 'pending',
                    deliverable: `Milestone ${nextNum} Package`,
                  };
                  setConfig({ ...config, stages: [...config.stages, newStage] });
                }}
                className="px-3.5 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-cyan-400 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Plus size={14} />
                <span>Add Stage</span>
              </button>
            </div>

            <div className="space-y-4">
              {config.stages.map((stage, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-black/5 dark:bg-black/30 border border-teal-500/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
                        {stage.step}
                      </span>
                      <span className="text-xs font-bold text-white uppercase">{stage.phase}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={stage.status}
                        onChange={(e) => {
                          const updated = [...config.stages];
                          updated[idx].status = e.target.value as any;
                          setConfig({ ...config, stages: updated });
                        }}
                        className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-[#030e14] border border-teal-500/20 text-teal-400 font-semibold"
                      >
                        <option value="completed">Complete</option>
                        <option value="current">Current</option>
                        <option value="pending">Up Next</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          if (config.stages.length <= 2) {
                            alert('A walkthrough requires at least 2 stages.');
                            return;
                          }
                          const updated = config.stages.filter((_, i) => i !== idx).map((s, n) => ({
                            ...s,
                            step: String(n + 1).padStart(2, '0'),
                            phase: `PHASE ${String(n + 1).padStart(2, '0')}`,
                          }));
                          setConfig({ ...config, stages: updated });
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Stage Title</label>
                      <input
                        type="text"
                        value={stage.title}
                        onChange={(e) => {
                          const updated = [...config.stages];
                          updated[idx].title = e.target.value;
                          setConfig({ ...config, stages: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Stage Checkpoint Description</label>
                      <input
                        type="text"
                        value={stage.checkpointDesc}
                        onChange={(e) => {
                          const updated = [...config.stages];
                          updated[idx].checkpointDesc = e.target.value;
                          updated[idx].deliverable = e.target.value;
                          setConfig({ ...config, stages: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Walkthrough Description</label>
                    <textarea
                      rows={2}
                      value={stage.description}
                      onChange={(e) => {
                        const updated = [...config.stages];
                        updated[idx].description = e.target.value;
                        setConfig({ ...config, stages: updated });
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </ThreeDCard>
        )}

        {/* TAB 2: Orbit & Calculation */}
        {activeTab === 'orbit' && (
          <ThreeDCard className="p-6 rounded-3xl bg-white/70 dark:bg-[#071C25]/80 border border-teal-500/20 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity size={18} className="text-teal-500" />
              <span>Orbit Mathematical Spacing &amp; Captions</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Execution Map Title
                </label>
                <input
                  type="text"
                  value={config.mapHeading}
                  onChange={(e) => setConfig({ ...config, mapHeading: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Footer Sequence Caption
                </label>
                <input
                  type="text"
                  value={config.caption}
                  onChange={(e) => setConfig({ ...config, caption: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#030e14] border border-teal-500/20 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-teal-400 block">Radial Angle Calculation Formula</span>
              <p className="font-mono text-[11px] text-cyan-300">
                angle = (stageIndex / {config.stages.length}) * 2π - π/2
              </p>
              <p className="text-[11px] text-slate-400">
                Nodes automatically space themselves uniformly at <code>39%</code> radius from center.
              </p>
            </div>
          </ThreeDCard>
        )}

        {/* TAB 3: Cadence & Controls */}
        {activeTab === 'controls' && (
          <ThreeDCard className="p-6 rounded-3xl bg-white/70 dark:bg-[#071C25]/80 border border-teal-500/20 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders size={18} className="text-teal-500" />
              <span>Interactive Progression Rules</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-black/30 border border-teal-500/10 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-white block">Autoplay Stages</span>
                  <span className="text-[11px] text-slate-400">Advance to next stage automatically</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.autoplay}
                  onChange={(e) => setConfig({ ...config, autoplay: e.target.checked })}
                  className="w-4 h-4 text-teal-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-black/30 border border-teal-500/10 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-white block">Infinite Walkthrough Loop</span>
                  <span className="text-[11px] text-slate-400">Return to Phase 01 after final stage</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.loop}
                  onChange={(e) => setConfig({ ...config, loop: e.target.checked })}
                  className="w-4 h-4 text-teal-500 rounded"
                />
              </label>

              <div className="sm:col-span-2">
                <div className="flex justify-between text-xs font-bold text-white mb-1">
                  <span>Stage Progression Delay</span>
                  <span className="text-teal-400 font-mono">{config.cycleIntervalMs / 1000}s</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="10000"
                  step="500"
                  value={config.cycleIntervalMs}
                  onChange={(e) => setConfig({ ...config, cycleIntervalMs: parseInt(e.target.value) || 4200 })}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>
            </div>
          </ThreeDCard>
        )}

        {/* TAB 4: Live Interactive Preview */}
        {activeTab === 'preview' && (() => {
          const activeStage = config.stages[previewActiveIdx] || config.stages[0];
          const stageCount = config.stages.length;

          return (
            <ThreeDCard className="p-8 rounded-3xl bg-gradient-to-b from-[#030e14] to-[#071C25] border border-teal-500/30 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-teal-500/20 pb-4">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                  <Monitor size={15} />
                  <span>Live Execution Walkthrough Simulation (Service Details)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewPlaying(!previewPlaying)}
                    className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500/30"
                  >
                    {previewPlaying ? <Pause size={13} /> : <Play size={13} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewActiveIdx(0)}
                    className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500/30"
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>
              </div>

              {/* 2-Column Split: Circular Orbit + Phase Walkthrough card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 rounded-2xl bg-[#03151D]/90 border border-teal-500/20">
                {/* Left 5 Cols: Orbit Circle */}
                <div className="lg:col-span-5 relative w-64 h-64 mx-auto flex items-center justify-center">
                  {/* SVG Tracks */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="39" fill="none" stroke="rgba(45, 212, 191, 0.15)" strokeWidth="1.5" />
                    <circle
                      cx="50"
                      cy="50"
                      r="39"
                      fill="none"
                      stroke="#2dd4bf"
                      strokeWidth="2"
                      strokeDasharray={`${(2 * Math.PI * 39 * (previewActiveIdx + 1)) / stageCount} ${2 * Math.PI * 39}`}
                    />
                  </svg>

                  {/* Center Hub */}
                  <div className="w-20 h-20 rounded-full bg-[#071c25] border-2 border-teal-400/60 flex flex-col items-center justify-center text-center shadow-lg">
                    <Activity size={16} className="text-teal-400" />
                    <span className="text-sm font-black text-white">{String(previewActiveIdx + 1).padStart(2, '0')}</span>
                    <span className="text-[9px] text-slate-400">OF {String(stageCount).padStart(2, '0')}</span>
                  </div>

                  {/* Orbit Nodes */}
                  {config.stages.map((st, idx) => {
                    const angle = (idx / stageCount) * Math.PI * 2 - Math.PI / 2;
                    const left = 50 + 39 * Math.cos(angle);
                    const top = 50 + 39 * Math.sin(angle);
                    const isActive = idx === previewActiveIdx;
                    const isPassed = idx < previewActiveIdx;

                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setPreviewActiveIdx(idx)}
                        style={{ left: `${left}%`, top: `${top}%` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isActive
                            ? 'bg-teal-400 text-slate-900 ring-4 ring-teal-400/30 scale-110 shadow-lg'
                            : isPassed
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-400/40'
                            : 'bg-black/40 text-slate-500 border border-white/10'
                        }`}
                      >
                        {isPassed ? <Check size={13} /> : st.step}
                      </button>
                    );
                  })}
                </div>

                {/* Right 7 Cols: Active Phase Details */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">{activeStage.phase}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {String(previewActiveIdx + 1).padStart(2, '0')} of {String(stageCount).padStart(2, '0')} stages
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white">{activeStage.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{activeStage.description}</p>

                  <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                      <ArrowUpRight size={16} />
                    </div>
                    <div>
                      <small className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                        {activeStage.checkpointTitle}
                      </small>
                      <strong className="text-xs text-white">{activeStage.checkpointDesc}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </ThreeDCard>
          );
        })()}

      </div>
    </AdminLayout>
  );
}

