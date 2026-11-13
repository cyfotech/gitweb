import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  Lock, 
  Users, 
  Globe2, 
  CheckCircle2, 
  ArrowUpRight,
  FileCheck,
  TrendingUp,
  Cpu,
  BarChart3,
  Check
} from 'lucide-react';

interface AboutSectionProps {
  onOpenConsultation: () => void;
}

export function AboutSection({ onOpenConsultation }: AboutSectionProps) {
  const diagnosticSteps = [
    { title: 'Source Data Ingestion', desc: 'Secure 256-bit SSL sync with QuickBooks, UltraTax, Xero & CCH.' },
    { title: 'AI & CPA Dual Review', desc: 'Automated discrepancy flagging paired with Senior EA verification.' },
    { title: 'SOC 2 & IRS 4557 Delivery', desc: 'Zero-defect tax returns delivered directly to partner workflow.' }
  ];

  return (
    <section id="about" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative bg-white dark:bg-[#071C24] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#E4F0EE] dark:bg-[rgba(44,207,197,0.12)] text-[#315F69] dark:text-[#79F1E8] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.25)] mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Firm Integrity & Leadership</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#17252B] dark:text-[#F3FBFC]">
            Engineering Fiscal Certainty for Over 15 Years
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#526168] dark:text-[#A8C0C6] leading-relaxed">
            Preferred Tax Consultancy was founded on a singular principle: combining high-level US tax advisory with an elite offshore delivery infrastructure so businesses and CPA practices can operate without fear of compliance errors or staffing constraints.
          </p>
        </div>

        {/* Modern Graphic Feature Banner / Advisory Architecture Visual */}
        <div className="mb-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#E4F0EE]/80 via-white to-[#F3FAF8] dark:from-[#09232A] dark:via-[#071C25] dark:to-[#041416] border border-[#22AF68]/25 dark:border-[#35E092]/30 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#22AF68]/10 dark:bg-[#35E092]/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-[#c49a52]/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#22AF68]/15 dark:bg-[#35E092]/15 text-[#16A765] dark:text-[#35E092]">
                <Cpu className="w-3.5 h-3.5" />
                <span>Proprietary CPA & Tax Delivery Pipeline</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif-editorial text-[#17252B] dark:text-[#F3FBFC]">
                Enterprise-Grade US Tax Automation & Partner Oversight
              </h3>
              <p className="text-sm text-[#526168] dark:text-[#A8C0C6] leading-relaxed">
                Our dual-layer review methodology couples advanced diagnostic software checks with elite Enrolled Agent (EA) supervision. Every return undergoes rigorous multi-point verification before client sign-off.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {diagnosticSteps.map((step, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/70 dark:bg-[#071C25]/80 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)]">
                    <div className="w-7 h-7 rounded-lg bg-[#22AF68]/20 text-[#16A765] dark:text-[#35E092] flex items-center justify-center font-bold text-xs mb-2">
                      0{idx + 1}
                    </div>
                    <div className="font-bold text-xs text-[#17252B] dark:text-[#F3FBFC] mb-1">{step.title}</div>
                    <div className="text-[11px] text-[#526168] dark:text-[#A8C0C6] leading-tight">{step.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-white dark:bg-[#06181E] border border-[#22AF68]/30 dark:border-[#35E092]/25 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)]">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#16A765]" />
                    <span className="text-xs font-bold uppercase tracking-wider">Practice Metrics</span>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
                    99.8% Certified
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAF9] dark:bg-[#0A2328]">
                    <span className="text-[#526168] dark:text-[#A8C0C6]">Returns Processed Annually</span>
                    <span className="font-mono font-bold text-sm text-[#16A765] dark:text-[#35E092]">12,500+</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAF9] dark:bg-[#0A2328]">
                    <span className="text-[#526168] dark:text-[#A8C0C6]">Average Turnaround SLA</span>
                    <span className="font-mono font-bold text-sm text-[#16A765] dark:text-[#35E092]">48 Hours</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAF9] dark:bg-[#0A2328]">
                    <span className="text-[#526168] dark:text-[#A8C0C6]">IRS Audit Rejection Rate</span>
                    <span className="font-mono font-bold text-sm text-[#16A765] dark:text-[#35E092]">&lt; 0.2%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 text-[11px] text-[#526168] dark:text-[#A8C0C6]">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#35E092] shrink-0" />
                  <span>Fully compliant with IRS Publication 4557 &amp; Gramm-Leach-Bliley Act.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="glass-panel p-6 rounded-3xl border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)] shadow-sm hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#E4F0EE] dark:bg-[rgba(44,207,197,0.15)] flex items-center justify-center text-[#315F69] dark:text-[#79F1E8] mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#17252B] dark:text-[#F3FBFC] mb-2">
              99.8% Accuracy Standard
            </h3>
            <p className="text-xs text-[#526168] dark:text-[#A8C0C6] leading-relaxed">
              Every tax return, journal entry, and workpaper undergoes a multi-layer diagnostic review by senior Enrolled Agents and licensed CPAs prior to partner delivery.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)] shadow-sm hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#E4F0EE] dark:bg-[rgba(44,207,197,0.15)] flex items-center justify-center text-[#315F69] dark:text-[#79F1E8] mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#17252B] dark:text-[#F3FBFC] mb-2">
              SOC 2 & ISO 27001 Security
            </h3>
            <p className="text-xs text-[#526168] dark:text-[#A8C0C6] leading-relaxed">
              We operate strictly within your existing cloud environments (UltraTax, QuickBooks, Xero) via secure 256-bit SSL tunnels and strict NDA confidentiality protocols.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)] shadow-sm hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#E4F0EE] dark:bg-[rgba(44,207,197,0.15)] flex items-center justify-center text-[#315F69] dark:text-[#79F1E8] mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#17252B] dark:text-[#F3FBFC] mb-2">
              Dedicated Staff Integration
            </h3>
            <p className="text-xs text-[#526168] dark:text-[#A8C0C6] leading-relaxed">
              Your assigned accountants work your US time zone, attend your morning standups, communicate over your Slack channels, and become true extensions of your team.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)] shadow-sm hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#E4F0EE] dark:bg-[rgba(44,207,197,0.15)] flex items-center justify-center text-[#315F69] dark:text-[#79F1E8] mb-4">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#17252B] dark:text-[#F3FBFC] mb-2">
              Seamless Scalability
            </h3>
            <p className="text-xs text-[#526168] dark:text-[#A8C0C6] leading-relaxed">
              Scale from a single part-time bookkeeper to a 10-person tax team in days during busy season surges, then dial back with zero severance or unemployment liability.
            </p>
          </div>
        </div>

        {/* Security & Regulatory Standards Banner */}
        <div className="glass-panel rounded-3xl p-8 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.22)] shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#315F69] dark:text-[#79F1E8] uppercase tracking-wider mb-2">
              <FileCheck className="w-4 h-4" />
              <span>IRS Publication 4557 & Data Privacy Compliance</span>
            </div>
            <h3 className="text-xl font-bold text-[#17252B] dark:text-[#F3FBFC] mb-2">
              Enterprise-Grade Confidentiality for Accounting Practices
            </h3>
            <p className="text-xs sm:text-sm text-[#526168] dark:text-[#A8C0C6] leading-relaxed">
              Client financial records and tax returns are safeguarded by strict role-based access control, biometric workstation security, and zero local data storage protocols.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenConsultation}
            className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-[#16A765] text-white dark:bg-[#35C98A] dark:text-[#031117] hover:scale-105 active:scale-95 transition-all shadow-md shrink-0 flex items-center gap-2"
          >
            <span>Partner With Our Firm</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}

