import React, { useState } from 'react';
import { ShieldCheck, Users, CheckCircle2, Award, ArrowRight, Lock, Sparkles, Building2 } from 'lucide-react';
import { CPA_PROFILES } from '../data/cpaProfiles';
import { EditableElement } from './EditableElement';

export interface HumanExpertiseContent {
  title?: string | null;
  subheading?: string | null;
  description?: string | null;
  content?: string | null;
}

interface HumanExpertiseChapterProps {
  onOpenConsultation: (category?: string, service?: string) => void;
  cmsContent?: HumanExpertiseContent | null;
}

export function HumanExpertiseChapter({ onOpenConsultation, cmsContent }: HumanExpertiseChapterProps) {
  const [activeApproach, setActiveApproach] = useState<number>(0);

  const displayTitle = cmsContent?.title || 'Direct human approach.';
  const displaySubheading = cmsContent?.subheading || 'CHAPTER 04 — HUMAN EXPERTISE';
  const displayDescription = cmsContent?.description || 'Algorithms don’t sign tax returns. Licensed CPAs and seasoned tax practitioners do. Discover how our hybrid structure safeguards precision and scales capacity.';

  const approaches = [
    {
      title: 'The Dual-Shoring Architecture',
      subtitle: 'Onshore relationship partners + dedicated offshore delivery pods',
      description: 'Your firm communicates directly with senior US CPAs for strategic scoping, client interfacing, and engagement management. Meanwhile, our vetted full-time offshore accountants handle high-volume workpaper assembly, data entry, and return drafts in your tax software overnight.',
      metrics: ['24-Hour SLA Delivery', 'Time-Zone Overlap Coordination', 'Dedicated Pod Continuity'],
    },
    {
      title: '3-Tier Quality Firewall',
      subtitle: 'Zero unreviewed deliverables ever leave our desk',
      description: 'Every return and workpaper binder passes through three rigorous gates: Tier 1 Preparer self-audit and diagnostic clearance, Tier 2 Senior Reviewer tick-mark reconciliation, and Tier 3 US Licensed CPA partner diagnostic sign-off before upload to your client portal.',
      metrics: ['100% CPA Partner Sign-Off', 'Standardized Tick-Mark Indexing', 'Diagnostic Error Clearance'],
    },
    {
      title: 'Bank-Grade Data Isolation',
      subtitle: 'Zero data leaves your secured cloud environment',
      description: 'Our teams work exclusively inside your practice environment via encrypted remote virtual desktops (Drake Hosted, UltraTax SaaS, or Azure Virtual Desktop). We maintain a strict zero-local-storage policy—no client files or PII ever exist on local machines.',
      metrics: ['SOC 2 Type II Certified', 'IRS Publication 4557 Compliant', 'Encrypted TLS 1.3 / VPN Tunnels'],
    },
  ];

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#F4F7F6] dark:bg-[#041219] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Chapter Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)]">
          <div>
            <EditableElement
              sectionKey="human_expertise"
              elementKey="subheading"
              elementType="subheading"
              label="Human Expertise Subheading"
              value={displaySubheading}
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2AA499] dark:text-[#49E3D6] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#49E3D6]" />
                <span>{displaySubheading}</span>
              </div>
            </EditableElement>

            <EditableElement
              sectionKey="human_expertise"
              elementKey="title"
              elementType="heading"
              label="Human Expertise Headline"
              value={displayTitle}
            >
              <h2 className="font-serif-editorial text-3xl sm:text-5xl font-normal text-[#12242B] dark:text-[#F4FBFC] tracking-tight">
                {displayTitle}
              </h2>
            </EditableElement>
          </div>

          <EditableElement
            sectionKey="human_expertise"
            elementKey="description"
            elementType="paragraph"
            label="Human Expertise Description"
            value={displayDescription}
          >
            <p className="text-xs sm:text-sm text-[#476067] dark:text-[#A8C0C6] max-w-md">
              {displayDescription}
            </p>
          </EditableElement>
        </div>

        {/* Cinematic Dual-Tone Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
          
          {/* Left: Cinematic Professional Image */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden min-h-[460px] shadow-2xl border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)] flex flex-col justify-end p-8">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80"
              alt="Senior CPA practice leadership team"
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.75] contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030F14] via-[#030F14]/50 to-transparent" />

            <div className="relative z-10 text-white space-y-3">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-[#49E3D6]/20 text-[#49E3D6] backdrop-blur-md border border-[#49E3D6]/30 uppercase tracking-wider">
                Senior Practice Leadership
              </span>
              <h3 className="text-2xl font-bold leading-tight">
                Senior CPAs & EAs Leading Every Engagement
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Our practice leads average over 12+ years of complex corporate, partnership, and multi-state compliance experience.
              </p>
            </div>
          </div>

          {/* Right: Interactive 3-Pillar Operational Methodology */}
          <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#071C25] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)] shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-6">
                {approaches.map((app, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveApproach(idx)}
                    className={`flex-1 py-3 px-3 rounded-2xl text-xs font-bold transition-all text-left border ${
                      activeApproach === idx
                        ? 'bg-[#17383F] text-white dark:bg-[#49E3D6] dark:text-[#03181E] border-transparent shadow-sm'
                        : 'bg-black/[0.02] dark:bg-white/[0.03] text-[#476067] dark:text-[#A8C0C6] border-[#E2EBE8] dark:border-[rgba(121,241,232,0.1)] hover:bg-black/5'
                    }`}
                  >
                    <div className="text-[10px] opacity-70 mb-0.5">0{idx + 1}</div>
                    <div className="line-clamp-1">{app.title}</div>
                  </button>
                ))}
              </div>

              {/* Active Approach Display */}
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2AA499] dark:text-[#49E3D6]">
                  {approaches[activeApproach].subtitle}
                </span>
                <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#12242B] dark:text-[#F4FBFC]">
                  {approaches[activeApproach].title}
                </h3>
                <p className="text-sm text-[#476067] dark:text-[#A8C0C6] leading-relaxed">
                  {approaches[activeApproach].description}
                </p>

                <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {approaches[activeApproach].metrics.map((metric, mIdx) => (
                    <div key={mIdx} className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#E2EBE8] dark:border-[rgba(121,241,232,0.1)] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-xs font-semibold text-[#12242B] dark:text-[#F4FBFC]">{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-[#E2EBE8] dark:border-[rgba(121,241,232,0.15)] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#64748B] dark:text-[#8AA3A8]">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>IRS Circular 230 Registered & Bonded</span>
              </div>

              <button
                onClick={() => onOpenConsultation('cpa')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-[#17383F] hover:bg-[#0E262B] text-white dark:bg-[#49E3D6] dark:hover:bg-[#7DF5E8] dark:text-[#03181E] shadow-sm transition-all"
              >
                <span>Schedule Partner Briefing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Real CPA Profiles Strip */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#12242B] dark:text-[#F4FBFC]">
              Meet Our Senior Delivery Specialists
            </h3>
            <span className="text-xs text-[#64748B] dark:text-[#8AA3A8]">
              Available for dedicated firm staff augmentation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CPA_PROFILES.slice(0, 3).map((profile) => (
              <div
                key={profile.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#071C25] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#49E3D6]/30"
                    />
                    <div>
                      <div className="text-sm font-bold text-[#12242B] dark:text-[#F4FBFC]">{profile.name}</div>
                      <div className="text-xs text-[#2AA499] dark:text-[#49E3D6] font-medium">{profile.role}</div>
                    </div>
                  </div>

                  <p className="text-xs text-[#476067] dark:text-[#A8C0C6] line-clamp-3 mb-4 leading-relaxed">
                    {profile.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {profile.credentials.map((cred, cIdx) => (
                      <span key={cIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 font-semibold text-[#12242B] dark:text-[#F4FBFC]">
                        {cred}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2EBE8] dark:border-[rgba(121,241,232,0.1)] flex items-center justify-between text-xs">
                  <span className="text-[#64748B] dark:text-[#8AA3A8]">
                    {profile.experienceYears}+ Yrs Exp
                  </span>
                  <button
                    onClick={() => onOpenConsultation('cpa', 'dedicated-staff-augmentation')}
                    className="font-bold text-[#2AA499] dark:text-[#49E3D6] hover:underline"
                  >
                    Request Resume →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
