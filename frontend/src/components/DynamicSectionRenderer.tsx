import React from 'react';
import { EditableElement } from './EditableElement';
import { CheckCircle2, ArrowRight, HelpCircle, Star, Sparkles, MessageSquare } from 'lucide-react';

export interface DynamicSectionRendererProps {
  section: {
    id: string;
    sectionKey: string;
    sectionType: string;
    title: string | null;
    subheading: string | null;
    description: string | null;
    content: string | null;
    backgroundImage: string | null;
    backgroundVideo: string | null;
    displayOrder: number;
    isEnabled: boolean;
  };
}

export function DynamicSectionRenderer({ section }: DynamicSectionRendererProps) {
  let parsed: any = {};
  try {
    if (section.content) parsed = JSON.parse(section.content);
  } catch {}

  const title = section.title || 'Dynamic Section Headline';
  const subheading = section.subheading || 'Specialized Section';
  const description = section.description || 'Custom configured dynamic section content.';

  // FAQ Section
  if (section.sectionType === 'FaqSection') {
    const items = Array.isArray(parsed.items)
      ? parsed.items
      : [
          { q: 'What is your review procedure for tax filings?', a: 'Every return undergoes a rigorous multi-tier diagnostic review by Senior Enrolled Agents and licensed CPAs.' },
          { q: 'How does your white-label CPA capacity integration work?', a: 'Our dedicated pods integrate directly into your software (UltraTax, Drake, QuickBooks) using bank-grade secure tunnels.' },
          { q: 'What turnaround times are guaranteed?', a: 'Standard overnight turnaround is available, with completed workpapers ready for partner sign-off within 24 to 48 hours.' },
        ];

    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#041217] text-white border-t border-teal-500/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <EditableElement sectionKey={section.sectionKey} elementKey="subheading" elementType="subheading" label="FAQ Subheading" value={subheading}>
              <span className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-2 block">{subheading}</span>
            </EditableElement>
            <EditableElement sectionKey={section.sectionKey} elementKey="title" elementType="heading" label="FAQ Title" value={title}>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif-editorial text-white">{title}</h2>
            </EditableElement>
            <EditableElement sectionKey={section.sectionKey} elementKey="description" elementType="paragraph" label="FAQ Description" value={description}>
              <p className="mt-2 text-slate-400 text-sm">{description}</p>
            </EditableElement>
          </div>

          <div className="space-y-4">
            {items.map((item: any, idx: number) => (
              <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-teal-500/20 backdrop-blur-md">
                <EditableElement
                  sectionKey={section.sectionKey}
                  elementKey={`item_${idx}_q`}
                  elementType="heading"
                  label={`FAQ Question ${idx + 1}`}
                  value={item.q}
                >
                  <h4 className="text-base font-bold text-teal-300 flex items-center gap-2 mb-2">
                    <HelpCircle size={16} className="text-teal-400 shrink-0" />
                    <span>{item.q}</span>
                  </h4>
                </EditableElement>
                <EditableElement
                  sectionKey={section.sectionKey}
                  elementKey={`item_${idx}_a`}
                  elementType="paragraph"
                  label={`FAQ Answer ${idx + 1}`}
                  value={item.a}
                >
                  <p className="text-sm text-slate-300 leading-relaxed pl-6">{item.a}</p>
                </EditableElement>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Testimonials Section
  if (section.sectionType === 'TestimonialsSection') {
    const reviews = Array.isArray(parsed.reviews)
      ? parsed.reviews
      : [
          { name: 'David M. Miller, CPA', role: 'Managing Partner, Miller & Co. CPAs', text: 'Integrating Preferred Tax added 4,000 hours of white-label prep capacity to our busy season with zero onboarding friction.', rating: 5 },
          { name: 'Sarah Jenkins, EA', role: 'Director of Taxation, Apex Advisory', text: 'Their workpaper diagnostics and IRS circular 230 adherence withstand every scrutiny. Truly an institutional partner.', rating: 5 },
        ];

    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#051921] text-white border-t border-teal-500/15">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <EditableElement sectionKey={section.sectionKey} elementKey="subheading" elementType="subheading" label="Testimonials Eyebrow" value={subheading}>
              <span className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-2 block">{subheading}</span>
            </EditableElement>
            <EditableElement sectionKey={section.sectionKey} elementKey="title" elementType="heading" label="Testimonials Title" value={title}>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif-editorial text-white">{title}</h2>
            </EditableElement>
            <EditableElement sectionKey={section.sectionKey} elementKey="description" elementType="paragraph" label="Testimonials Description" value={description}>
              <p className="mt-2 text-slate-400 text-sm max-w-2xl mx-auto">{description}</p>
            </EditableElement>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev: any, idx: number) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-teal-500/20 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-amber-400 mb-3">
                    {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <EditableElement
                    sectionKey={section.sectionKey}
                    elementKey={`review_${idx}_text`}
                    elementType="paragraph"
                    label={`Review Text ${idx + 1}`}
                    value={rev.text}
                  >
                    <p className="text-sm text-slate-200 italic mb-4 leading-relaxed">"{rev.text}"</p>
                  </EditableElement>
                </div>
                <div className="pt-3 border-t border-teal-500/10">
                  <EditableElement
                    sectionKey={section.sectionKey}
                    elementKey={`review_${idx}_name`}
                    elementType="heading"
                    label={`Reviewer Name ${idx + 1}`}
                    value={rev.name}
                  >
                    <p className="text-xs font-bold text-teal-300">{rev.name}</p>
                  </EditableElement>
                  <EditableElement
                    sectionKey={section.sectionKey}
                    elementKey={`review_${idx}_role`}
                    elementType="subheading"
                    label={`Reviewer Role ${idx + 1}`}
                    value={rev.role}
                  >
                    <p className="text-[10px] text-slate-400">{rev.role}</p>
                  </EditableElement>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Feature / Custom Section
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#041217] text-white border-t border-teal-500/15">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <EditableElement sectionKey={section.sectionKey} elementKey="subheading" elementType="subheading" label="Section Eyebrow" value={subheading}>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-2 block">{subheading}</span>
          </EditableElement>
          <EditableElement sectionKey={section.sectionKey} elementKey="title" elementType="heading" label="Section Headline" value={title}>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif-editorial text-white">{title}</h2>
          </EditableElement>
          <EditableElement sectionKey={section.sectionKey} elementKey="description" elementType="paragraph" label="Section Description" value={description}>
            <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">{description}</p>
          </EditableElement>
        </div>

        {section.backgroundImage && (
          <EditableElement sectionKey={section.sectionKey} elementKey="backgroundImage" elementType="image" label="Section Image" value={section.backgroundImage}>
            <div className="rounded-3xl overflow-hidden border border-teal-500/20 shadow-2xl max-w-4xl mx-auto aspect-video mb-8">
              <img src={section.backgroundImage} alt={title} className="w-full h-full object-contain bg-black/40" />
            </div>
          </EditableElement>
        )}
      </div>
    </section>
  );
}
