import React, { useState } from 'react';
import {
  UserCheck,
  Star,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  Briefcase,
  Cpu
} from 'lucide-react';
import { CPA_PROFILES, HIRING_ENGAGEMENT_MODELS, ProfessionalProfile } from '../data/cpaProfiles';

interface HireProfessionalsSectionProps {
  onHireProfessional: (professionalName: string, role: string) => void;
}

export function HireProfessionalsSection({ onHireProfessional }: HireProfessionalsSectionProps) {
  const [selectedModel, setSelectedModel] = useState<number>(0);

  return (
    <section id="hire-professionals" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#F7F9F8] dark:bg-[#031117] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#E4F0EE] dark:bg-[rgba(44,207,197,0.12)] text-[#315F69] dark:text-[#79F1E8] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.25)] mb-3">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Dedicated Staff Augmentation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#17252B] dark:text-[#F3FBFC]">
            Hire Dedicated Tax & Accounting Professionals
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#526168] dark:text-[#A8C0C6] leading-relaxed">
            Deploy pre-vetted Enrolled Agents, CPAs, and CAS Controllers directly into your workflow. Seamless time-zone overlap, zero recruitment friction, and immediate project ramp-up.
          </p>
        </div>

        {/* Engagement Models Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {HIRING_ENGAGEMENT_MODELS.map((model, idx) => (
            <div
              key={idx}
              className={`p-6 sm:p-7 rounded-3xl transition-all duration-300 border flex flex-col justify-between ${model.recommended
                  ? 'glass-panel border-[#315F69] dark:border-[#2CCFC5] shadow-xl relative scale-[1.02]'
                  : 'bg-white dark:bg-[#071C24] border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)] shadow-sm hover:shadow-md'
                }`}
            >
              {model.recommended && (
                <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#315F69] text-white dark:bg-[#2CCFC5] dark:text-[#031117] shadow-sm">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-[#17252B] dark:text-[#F3FBFC] mb-1">
                  {model.title}
                </h3>
                <p className="text-xs text-[#526168] dark:text-[#A8C0C6] mb-4">
                  {model.idealFor}
                </p>


                <div className="space-y-2.5 mb-6">
                  {model.benefits.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2 text-xs text-[#526168] dark:text-[#A8C0C6]">
                      <CheckCircle2 className="w-4 h-4 text-[#315F69] dark:text-[#2CCFC5] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onHireProfessional('Staff Augmentation', model.title)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${model.recommended
                    ? 'bg-[#315F69] text-white dark:bg-[#2CCFC5] dark:text-[#031117] hover:scale-[1.02] shadow-md'
                    : 'bg-black/5 dark:bg-white/5 text-[#17252B] dark:text-[#F3FBFC] hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
              >
                <span>Select Engagement Model</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Featured Professional Profiles Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-[#17252B] dark:text-[#F3FBFC]">
                Pre-Vetted Senior Accounting Talent
              </h3>
              <p className="text-xs sm:text-sm text-[#526168] dark:text-[#A8C0C6]">
                Available for full-time or seasonal engagement with verified US tax credentials.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CPA_PROFILES.map((prof) => (
              <div
                key={prof.id}
                className="glass-panel rounded-3xl p-6 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)] shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <img
                    src={prof.avatar}
                    alt={prof.name}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 border-2 border-[#315F69]/30 dark:border-[#2CCFC5]/40"
                  />

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-base font-bold text-[#17252B] dark:text-[#F3FBFC]">
                        {prof.name}
                      </h4>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{prof.rating}</span>
                        <span className="text-gray-400 font-normal">({prof.reviewsCount})</span>
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-[#315F69] dark:text-[#79F1E8] mb-2">
                      {prof.role} • {prof.experienceYears}+ Years Exp.
                    </div>

                    <p className="text-xs text-[#526168] dark:text-[#A8C0C6] leading-relaxed mb-4">
                      {prof.bio}
                    </p>

                    {/* Credentials Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {prof.credentials.map((cred, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#E4F0EE] dark:bg-[rgba(44,207,197,0.12)] text-[#315F69] dark:text-[#79F1E8]"
                        >
                          {cred}
                        </span>
                      ))}
                    </div>

                    {/* Software Skills */}
                    <div className="text-[11px] text-[#526168] dark:text-[#A8C0C6] mb-4">
                      <span className="font-semibold text-[#17252B] dark:text-[#F3FBFC]">Software: </span>
                      {prof.software.join(' • ')}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#DCE5E2] dark:border-[rgba(121,241,232,0.12)]">
                      <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Availability: {prof.availability}</span>
                      </span>

                      <button
                        onClick={() => onHireProfessional(prof.name, prof.role)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#315F69] text-white dark:bg-[#2CCFC5] dark:text-[#031117] hover:scale-105 active:scale-95 transition-all flex items-center gap-1 shadow-sm"
                      >
                        <span>Schedule Interview</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
