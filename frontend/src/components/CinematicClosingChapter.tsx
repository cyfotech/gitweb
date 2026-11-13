import React from 'react';
import { ArrowRight, ShieldCheck, Clock, CheckCircle2, Lock, Sparkles, Building2, User, Users } from 'lucide-react';
import { ConsultationForm } from './ConsultationForm';
import { ClientCategory } from '../data/services';
import { EditableElement } from './EditableElement';

export interface CinematicClosingContent {
  title?: string | null;
  subheading?: string | null;
  description?: string | null;
  content?: string | null;
}

interface CinematicClosingChapterProps {
  initialCategory?: ClientCategory;
  initialServiceSlug?: string;
  cmsContent?: CinematicClosingContent | null;
}

export function CinematicClosingChapter({
  initialCategory = 'business',
  initialServiceSlug = '',
  cmsContent,
}: CinematicClosingChapterProps) {
  const displayTitle = cmsContent?.title || 'Take command of your financial trajectory.';
  const displaySubheading = cmsContent?.subheading || 'CHAPTER 07 — STRATEGIC ENGAGEMENT';
  const displayDescription = cmsContent?.description || 'Whether scaling your accounting firm’s seasonal capacity or seeking comprehensive entity tax planning, initiate a confidential discovery briefing below.';
  return (
    <section id="contact" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#FAFCFB] dark:bg-[#030F14] overflow-hidden transition-colors duration-300">
      
      {/* Background radial ambient illumination */}
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[500px] bg-gradient-to-t from-[#2CCFC5]/15 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Chapter Header & Dramatic Framing */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <EditableElement
            sectionKey="closing_cta"
            elementKey="subheading"
            elementType="subheading"
            label="Closing Subheading"
            value={displaySubheading}
          >
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2AA499] dark:text-[#49E3D6] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#49E3D6]" />
              <span>{displaySubheading}</span>
            </div>
          </EditableElement>

          <EditableElement
            sectionKey="closing_cta"
            elementKey="title"
            elementType="heading"
            label="Closing Main Headline"
            value={displayTitle}
          >
            <h2 className="font-serif-editorial text-4xl sm:text-6xl font-normal text-[#12242B] dark:text-[#F4FBFC] tracking-tight leading-[1.08] mb-6">
              {displayTitle}
            </h2>
          </EditableElement>

          <EditableElement
            sectionKey="closing_cta"
            elementKey="description"
            elementType="paragraph"
            label="Closing Narrative Description"
            value={displayDescription}
          >
            <p className="text-sm sm:text-base text-[#476067] dark:text-[#A8C0C6] leading-relaxed">
              {displayDescription}
            </p>
          </EditableElement>
        </div>

        {/* Embedded Complete Consultation Form */}
        <div className="max-w-4xl mx-auto">
          <ConsultationForm
            initialCategory={initialCategory}
            initialServiceSlug={initialServiceSlug}
          />
        </div>

      </div>
    </section>
  );
}
