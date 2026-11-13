import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  HelpCircle, 
  Star, 
  Layers, 
  FileText, 
  Image, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  LayoutTemplate
} from 'lucide-react';

export interface ComponentTemplate {
  type: string;
  label: string;
  description: string;
  icon: any;
  defaultTitle: string;
  defaultSubheading: string;
  defaultDescription: string;
  defaultContent: any;
  category: string;
}

export const COMPONENT_TEMPLATES: ComponentTemplate[] = [
  {
    type: 'FaqSection',
    label: 'FAQ Accordion Section',
    description: 'Frequently asked questions with diagnostic & partnership answers.',
    icon: HelpCircle,
    defaultTitle: 'Frequently Asked Advisory & Practice Questions',
    defaultSubheading: 'CLARITY & ENGAGEMENT',
    defaultDescription: 'Essential answers regarding our two-tier review rigor, turnaround times, and SOC 2 data isolation.',
    defaultContent: {
      items: [
        { q: 'How does your white-label CPA prep workflow function?', a: 'Our dedicated pods integrate directly into your cloud tax software (UltraTax CS, Drake, QuickBooks) using bank-grade 256-bit SSL tunnels.' },
        { q: 'What is your error rate and quality guarantee?', a: 'We maintain a 99.8% diagnostic review accuracy standard. All returns must clear senior reviewer and licensed CPA gates before delivery.' },
        { q: 'What turnaround times are guaranteed?', a: 'Standard turnaround is 24 to 48 hours, with follow-the-sun overnight support so work is ready for partner sign-off the next morning.' }
      ]
    },
    category: 'Information'
  },
  {
    type: 'TestimonialsSection',
    label: 'Client & Partner Testimonials',
    description: 'Verified partner reviews, star ratings, and firm endorsements.',
    icon: Star,
    defaultTitle: 'Trusted by High-Performing Accounting Firms & Enterprises',
    defaultSubheading: 'VERIFIED REVIEWS',
    defaultDescription: 'See how our offshore capacity and advisory rigor have elevated managing partners nationwide.',
    defaultContent: {
      reviews: [
        { name: 'David M. Miller, CPA', role: 'Managing Partner, Miller & Co. CPAs (New York)', text: 'Preferred Tax delivered 4,000+ preparation hours during tax season without a single error escalation. A game-changer.', rating: 5 },
        { name: 'Sarah Jenkins, EA', role: 'Director of Taxation, Apex Advisory Group', text: 'Their workpaper diagnostics and IRS Circular 230 adherence withstand every partner review. Truly institutional caliber.', rating: 5 }
      ]
    },
    category: 'Social Proof'
  },
  {
    type: 'CustomContentSection',
    label: 'Editorial Feature Showcase',
    description: 'Highlighted advisory vertical with full-width media presentation.',
    icon: LayoutTemplate,
    defaultTitle: 'Institutional Tax Strategy for Complex Cross-Border Entities',
    defaultSubheading: 'CROSS-BORDER ADVISORY',
    defaultDescription: 'Navigating multi-jurisdiction compliance, CFC rules, and transfer pricing with Big Four pedigree and boutique agility.',
    defaultContent: {
      features: ['Multinational Entity Restructuring', 'Foreign Tax Credit (FTC) Maximization', 'Section 965 & GILTI Modeling']
    },
    category: 'Content'
  }
];

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (template: ComponentTemplate) => void;
}

export function AddSectionModal({ isOpen, onClose, onAddSection }: AddSectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="w-full max-w-2xl bg-[#071922] border border-teal-500/30 rounded-3xl p-6 shadow-2xl text-white relative">
        <div className="flex items-center justify-between pb-4 border-b border-teal-500/15 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Plus size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Component Library: Add Section</h3>
              <p className="text-xs text-slate-400">Choose a production-tested component to insert into your live page.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {COMPONENT_TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon;
            return (
              <div
                key={tmpl.type}
                onClick={() => {
                  onAddSection(tmpl);
                  onClose();
                }}
                className="group p-4 rounded-2xl bg-white/5 border border-teal-500/15 hover:border-teal-400/50 hover:bg-teal-500/10 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
                      <Icon size={18} />
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 text-slate-400 border border-teal-500/20">
                      {tmpl.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors mb-1">
                    {tmpl.label}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-teal-500/10 flex items-center justify-between text-xs font-bold text-teal-400">
                  <span>Insert Component</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

