import React, { useState } from 'react';
import { Layers, Users, TrendingUp, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import './ReferenceAnimations.css';

export function CpaPeakCapacityCalculator() {
  const [inHouseCapacity, setInHouseCapacity] = useState<number>(80);
  const [peakDemand, setPeakDemand] = useState<number>(140);

  const deficit = Math.max(0, peakDemand - inHouseCapacity);
  const percentOver = Math.round((deficit / inHouseCapacity) * 100);
  const hoursSaved = deficit * 4.5; // Average 4.5 hours per return saved for the CPA firm

  return (
    <div className="ref-anim-card" aria-label="CPA Firm Peak Season Capacity Calculator">
      <div className="ref-anim-header">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-500 dark:text-[#49E3D6]" />
          <span className="text-xs font-bold text-[#12242B] dark:text-[#F4FBFC] uppercase tracking-wider font-mono">
            Capacity Modeling &bull; Peak Filing Season Simulator
          </span>
        </div>
        <div className="ref-anim-badge">
          <span>{deficit > 0 ? `${deficit} Returns Deficit` : '100% In-House Capable'}</span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-lg font-bold text-[#12242B] dark:text-[#F4FBFC] font-serif-editorial">
          Where does peak season outrun your team?
        </h4>
        <p className="text-xs text-[#476067] dark:text-[#A8C0C6] mt-1 leading-relaxed">
          Tax season brings condensed deadlines, high client volumes, and review bottlenecks. Model your firm's preparation threshold and calculate offshore capacity augmentation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Sliders Box */}
        <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)] space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-bold">
              <span>In-House Team Monthly Capacity:</span>
              <span className="font-mono text-emerald-600 dark:text-[#49E3D6]">{inHouseCapacity} Returns</span>
            </div>
            <input
              type="range"
              min="30"
              max="200"
              step="5"
              value={inHouseCapacity}
              onChange={(e) => setInHouseCapacity(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-gray-400 font-mono mt-1">
              <span>30 / mo</span>
              <span>100 / mo</span>
              <span>200 / mo</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5 font-bold">
              <span>Peak Tax Season Client Inflow:</span>
              <span className="font-mono text-rose-500">{peakDemand} Returns</span>
            </div>
            <input
              type="range"
              min="50"
              max="350"
              step="10"
              value={peakDemand}
              onChange={(e) => setPeakDemand(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-gray-400 font-mono mt-1">
              <span>50 / mo</span>
              <span>200 / mo</span>
              <span>350 / mo</span>
            </div>
          </div>
        </div>

        {/* Visualizer Gauge / Capacity Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex flex-col justify-between">
            <div>
              <span className="text-[9px] uppercase font-bold text-rose-600 dark:text-rose-400 tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Peak Workload Deficit
              </span>
              <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
                +{deficit} Returns
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                {percentOver}% over internal firm capacity.
              </div>
            </div>
            <div className="text-[9px] font-mono text-gray-400 mt-2">
              Potential overtime risk without pod.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col justify-between">
            <div>
              <span className="text-[9px] uppercase font-bold text-emerald-600 dark:text-[#49E3D6] tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Offshore Pod Relief
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-[#49E3D6] mt-1">
                {hoursSaved.toFixed(0)} Hours
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                Senior partner review hours reclaimed.
              </div>
            </div>
            <div className="text-[9px] font-mono text-emerald-600 dark:text-[#49E3D6] font-bold mt-2">
              48–72h Turnaround SLA
            </div>
          </div>
        </div>
      </div>

      <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[#DCE5E2] dark:border-gray-800 text-[11px] text-gray-500 flex items-center justify-between">
        <span>Assigned dedicated preparers follow your firm's specific software (Drake/UltraTax/ProConnect) and checklists.</span>
        <span className="font-mono text-emerald-600 dark:text-[#49E3D6] font-bold text-xs shrink-0">Turnkey Capacity</span>
      </div>
    </div>
  );
}