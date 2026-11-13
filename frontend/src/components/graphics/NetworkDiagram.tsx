import React from 'react';
import { Globe2, ShieldCheck, Lock, Users, ArrowRightLeft, Cpu } from 'lucide-react';

export function NetworkDiagram() {
  return (
    <div className="w-full rounded-3xl p-6 sm:p-8 bg-white/70 dark:bg-[#071C25]/80 backdrop-blur-xl border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)] shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#E4F0EE] dark:bg-[rgba(44,207,197,0.12)] text-[#315F69] dark:text-[#7DF5E8] mb-1">
            <Globe2 className="w-3 h-3" />
            <span>Dual-Shoring Operational Matrix</span>
          </div>
          <h3 className="text-xl font-bold text-[#12242B] dark:text-[#F4FBFC]">
            Seamless US Partner & Offshore Engine Architecture
          </h3>
          <p className="text-xs text-[#526168] dark:text-[#A8C0C6] mt-0.5">
            How your onshore firm leadership retains total client advisory control while offshore certified accountants handle heavy preparation.
          </p>
        </div>

        <span className="text-[11px] font-mono px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold self-start sm:self-center">
          256-Bit Encrypted VDI Tunnels
        </span>
      </div>

      {/* 3-Tier Grid Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 items-center">
        {/* Left Node: US Onshore Firm */}
        <div className="p-6 rounded-2xl bg-white/50 dark:bg-[#071C25]/50 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)]">
          <div className="w-10 h-10 rounded-xl bg-[#315F69] text-white dark:bg-[#49E3D6] dark:text-[#03181E] flex items-center justify-center mb-4">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#315F69] dark:text-[#49E3D6]">
            Tier 01: Onshore (USA)
          </span>
          <h4 className="text-base font-bold text-[#12242B] dark:text-[#F4FBFC] mt-1 mb-2">
            Your Firm & Tax Partners
          </h4>
          <ul className="text-xs text-[#526168] dark:text-[#A8C0C6] space-y-2">
            <li>• Direct client relationship & billing</li>
            <li>• High-value strategic advisory & tax planning</li>
            <li>• Final sign-off and e-file authority</li>
            <li>• Zero administrative hiring overhead</li>
          </ul>
        </div>

        {/* Center Node: The Security Conduit */}
        <div className="p-6 rounded-2xl bg-[#E4F0EE]/60 dark:bg-[rgba(44,207,197,0.08)] border border-[#315F69]/30 dark:border-[#49E3D6]/30 text-center relative">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#17383F] dark:bg-[#49E3D6] text-white dark:text-[#03181E] flex items-center justify-center mb-3 shadow-lg">
            <Lock className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#315F69] dark:text-[#49E3D6]">
            Secure Bridge
          </span>
          <h4 className="text-sm font-bold text-[#12242B] dark:text-[#F4FBFC] mt-1 mb-2">
            Zero-Trust Data Tunnel
          </h4>
          <p className="text-xs text-[#526168] dark:text-[#A8C0C6] leading-relaxed">
            All accounting work takes place directly inside your hosted environment (UltraTax, Lacerte, QBO, CCH). No client data is ever saved to offshore local disks.
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-mono text-[#315F69] dark:text-[#7DF5E8]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SOC 2 Type II Audited</span>
          </div>
        </div>

        {/* Right Node: Dedicated Offshore Delivery */}
        <div className="p-6 rounded-2xl bg-white/50 dark:bg-[#071C25]/50 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)]">
          <div className="w-10 h-10 rounded-xl bg-[#315F69] text-white dark:bg-[#49E3D6] dark:text-[#03181E] flex items-center justify-center mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#315F69] dark:text-[#49E3D6]">
            Tier 02: Offshore Engine
          </span>
          <h4 className="text-base font-bold text-[#12242B] dark:text-[#F4FBFC] mt-1 mb-2">
            Dedicated Certified Team
          </h4>
          <ul className="text-xs text-[#526168] dark:text-[#A8C0C6] space-y-2">
            <li>• US Tax-trained Enrolled Agents & Senior CPAs</li>
            <li>• Complete trial balance & workpaper preparation</li>
            <li>• Two-tier internal diagnostic QC check</li>
            <li>• Overlapping US Eastern & Pacific hours</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
