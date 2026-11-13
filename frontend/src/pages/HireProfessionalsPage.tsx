import { useState, useEffect } from 'react';
import type { PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import {
  UserCheck,
  Star,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  Briefcase,
  Cpu,
  ArrowRight,
  Sparkles,
  Zap,
  BadgeCheck,
  CheckCircle2,
} from 'lucide-react';
import { getHireRolesWithOverrides } from '../data/hireRoles';
import { EditableElement } from '../components/EditableElement';
import { usePageContent } from '../hooks/usePageContent';
import { EditableSectionContainer } from '../components/EditableSectionContainer';
import { settingsApi } from '../api/settings';
import { defaultTaxIntelligenceConfig, TaxIntelligenceConfig } from '../admin/pages/TaxIntelligenceManager';
import './HireProfessionalsPage.css';

export function HireProfessionalsPage() {
  const reduceMotion = useReducedMotion();
  const { getSection, isSectionEnabled } = usePageContent('hire-professionals');
  const [taxConfig, setTaxConfig] = useState<TaxIntelligenceConfig>(defaultTaxIntelligenceConfig);

  useEffect(() => {
    settingsApi.getAll()
      .then((res) => {
        if (res && res.tax_intelligence_config) {
          setTaxConfig({ ...defaultTaxIntelligenceConfig, ...res.tax_intelligence_config });
        }
      })
      .catch(() => {});
  }, []);

  const heroSection = getSection('hero');
  const rolesSection = getSection('professionals_grid');
  const ctaSection = getSection('cta');
  const roles = getHireRolesWithOverrides(rolesSection?.parsedContent?.roles);
  const eyebrowText = heroSection?.parsedContent?.eyebrow || 'Dedicated Staff Augmentation';
  const headlineText = heroSection?.title || 'Hire Dedicated US-Trained Tax & Accounting Professionals';
  const descriptionText = heroSection?.description || 'Deploy pre-vetted Enrolled Agents, CPAs, and CAS Controllers directly into your workflow. Seamless time-zone overlap, zero recruitment friction, and 72-hour project ramp-up.';

  const handleBrowseRoles = () => {
    document.getElementById('hp-roles')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCardPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / Math.max(rect.width, 1);
    const y = (event.clientY - rect.top) / Math.max(rect.height, 1);
    event.currentTarget.style.setProperty('--hp-tilt-x', `${(0.5 - y) * 7}deg`);
    event.currentTarget.style.setProperty('--hp-tilt-y', `${(x - 0.5) * 8}deg`);
    event.currentTarget.style.setProperty('--hp-shine-x', `${x * 100}%`);
    event.currentTarget.style.setProperty('--hp-shine-y', `${y * 100}%`);
  };

  const resetCardPointer = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--hp-tilt-x', '0deg');
    event.currentTarget.style.setProperty('--hp-tilt-y', '0deg');
    event.currentTarget.style.setProperty('--hp-shine-x', '50%');
    event.currentTarget.style.setProperty('--hp-shine-y', '50%');
  };

  return (
    <main
      className="hire-pro-page"
      aria-label="Hire dedicated tax and accounting professionals"
    >
      <div className="hp-ambient hp-ambient-one" aria-hidden="true" />
      <div className="hp-ambient hp-ambient-two" aria-hidden="true" />

      <div className="hp-content">
        {/* Hero */}
        <EditableSectionContainer sectionKey="hero" sectionTitle="Professional Hiring Hero" isEnabled={isSectionEnabled('hero')} sectionData={heroSection}>
        <section className="hp-hero">
          <div className="hp-hero-copy">
            <EditableElement
              sectionKey="hero"
              elementKey="eyebrow"
              elementType="subheading"
              label="Hire Pros Eyebrow"
              value={eyebrowText}
            >
              <div className="hp-eyebrow">
                <UserCheck size={15} aria-hidden="true" />
                <span>{eyebrowText}</span>
                <span className="hp-eyebrow-pulse" aria-hidden="true" />
              </div>
            </EditableElement>

            <EditableElement
              sectionKey="hero"
              elementKey="title"
              elementType="heading"
              label="Hire Pros Headline"
              value={headlineText}
            >
              <h1>
                {headlineText}
              </h1>
            </EditableElement>

            <EditableElement
              sectionKey="hero"
              elementKey="description"
              elementType="paragraph"
              label="Hire Pros Description"
              value={descriptionText}
            >
              <p className="hp-hero-description">
                {descriptionText}
              </p>
            </EditableElement>

            <div className="hp-trust-row" aria-label="Our strengths">
              <div className="hp-trust-item"><span className="hp-trust-icon"><ShieldCheck size={17} /></span><span>Pre-Vetted Professionals</span></div>
              <div className="hp-trust-item"><span className="hp-trust-icon"><Star size={17} /></span><span>US Tax Law Expertise</span></div>
              <div className="hp-trust-item"><span className="hp-trust-icon"><Briefcase size={17} /></span><span>Seamless Integration</span></div>
            </div>
          </div>

          {/* Animated 3D Talent Augmentation & Deployment Hub */}
          <div className="hp-hero-art" aria-label="Interactive talent augmentation terminal">
            <div className="hp-orbit hp-orbit-one" />
            <div className="hp-orbit hp-orbit-two" />

            {/* Main Talent Deployment Terminal */}
            <div className="hp-talent-terminal">
              {/* Terminal Topbar */}
              <div className="hp-term-topbar">
                <div className="hp-term-brand">
                  <span className="hp-term-gem" />
                  <span>Dedicated Talent Pod</span>
                </div>
                <div className="hp-term-live-badge">
                  <span className="hp-term-live-dot" />
                  <span>Pod Active</span>
                </div>
              </div>

              {/* Vetting Pipeline Strip */}
              <div className="hp-vetting-strip" aria-label="Talent vetting and deployment stages">
                <div className="hp-vetting-step hp-vetting-step--active">
                  <span className="hp-vetting-num">01</span>
                  <span>IRS Vetted</span>
                </div>
                <div className="hp-vetting-connector"><span className="hp-vetting-flow" /></div>
                <div className="hp-vetting-step hp-vetting-step--active">
                  <span className="hp-vetting-num">02</span>
                  <span>Skill Tested</span>
                </div>
                <div className="hp-vetting-connector"><span className="hp-vetting-flow" /></div>
                <div className="hp-vetting-step hp-vetting-step--active">
                  <span className="hp-vetting-num">03</span>
                  <span>72h Deployed</span>
                </div>
              </div>

              {/* Dedicated Talent Cards / Profiles */}
              <div className="hp-specialist-cards">
                {/* Specialist 1 */}
                <div className="hp-spec-card hp-spec-card-1">
                  <div className="hp-spec-avatar hp-avatar-tax">
                    <UserCheck size={16} />
                    <span className="hp-avatar-status" />
                  </div>
                  <div className="hp-spec-info">
                    <div className="hp-spec-header">
                      <strong>Senior Tax Preparer (EA)</strong>
                      <span className="hp-spec-tag">1040 / 1120-S</span>
                    </div>
                    <div className="hp-spec-meta">
                      <span>Drake · ProConnect</span>
                      <em className="hp-spec-state hp-state-deployed">Active in Pod</em>
                    </div>
                  </div>
                </div>

                {/* Specialist 2 */}
                <div className="hp-spec-card hp-spec-card-2">
                  <div className="hp-spec-avatar hp-avatar-acct">
                    <Briefcase size={16} />
                    <span className="hp-avatar-status" />
                  </div>
                  <div className="hp-spec-info">
                    <div className="hp-spec-header">
                      <strong>CAS Controller / Lead</strong>
                      <span className="hp-spec-tag">US GAAP</span>
                    </div>
                    <div className="hp-spec-meta">
                      <span>QuickBooks · Xero</span>
                      <em className="hp-spec-state hp-state-active">Reconciliation</em>
                    </div>
                  </div>
                </div>

                {/* Specialist 3 */}
                <div className="hp-spec-card hp-spec-card-3">
                  <div className="hp-spec-avatar hp-avatar-qa">
                    <ShieldCheck size={16} />
                    <span className="hp-avatar-status" />
                  </div>
                  <div className="hp-spec-info">
                    <div className="hp-spec-header">
                      <strong>Senior Tax Reviewer (CPA)</strong>
                      <span className="hp-spec-tag">Multi-State</span>
                    </div>
                    <div className="hp-spec-meta">
                      <span>Workpaper QA</span>
                      <em className="hp-spec-state hp-state-ready">Ready to Match</em>
                    </div>
                  </div>
                </div>
              </div>

              {/* Software Integration Pills */}
              <div className="hp-tool-pills" aria-label="Proficient software stack">
                {['Drake', 'UltraTax', 'ProConnect', 'QuickBooks', 'Xero', 'Teams/Slack'].map((tool) => (
                  <span key={tool} className="hp-tool-pill">{tool}</span>
                ))}
              </div>

              {/* Terminal Footer */}
              <div className="hp-term-footer">
                <div className="hp-term-stat">
                  <strong>US EST / CST</strong>
                  <small>Time Zone Overlap</small>
                </div>
                <div className="hp-term-divider" />
                <div className="hp-term-stat">
                  <strong className="hp-term-teal">Zero Overhead</strong>
                  <small>No Recruitment Friction</small>
                </div>
              </div>
            </div>

            {/* Floating Card 1: Pre-Vetted Verification */}
            <div className="hp-floating-badge hp-float-card-top">
              <div className="hp-float-icon hp-float-icon-teal">
                <ShieldCheck size={18} />
              </div>
              <div className="hp-float-text">
                <strong>Pre-Vetted US Talent</strong>
                <small>Top 3% Assessment Passed</small>
              </div>
              <span className="hp-float-check"><BadgeCheck size={16} /></span>
            </div>

            {/* Floating Card 2: 72h Ramp-Up */}
            <div className="hp-floating-badge hp-float-card-bottom">
              <div className="hp-float-icon hp-float-icon-gold">
                <Zap size={18} />
              </div>
              <div className="hp-float-text">
                <strong>72-Hour Deployment</strong>
                <small>Direct Workflow Integration</small>
              </div>
              <span className="hp-float-pulse-dot" />
            </div>

            {/* Caption */}
            <div className="hp-art-caption">
              <span className="hp-caption-dot" />
              <span>Dedicated Staff Augmentation</span>
              <ArrowUpRight size={14} />
            </div>
          </div>

          <div className="hp-hero-metrics">
            <div className="hp-metric"><span className="hp-metric-icon"><Clock size={17} /></span><div><strong>72-hour</strong><small>Rapid deployment</small></div></div>
            <div className="hp-metric"><span className="hp-metric-icon"><ShieldCheck size={17} /></span><div><strong>Pre-screened</strong><small>Qualified professionals</small></div></div>
            <div className="hp-metric"><span className="hp-metric-icon"><Cpu size={17} /></span><div><strong>Workflow-ready</strong><small>Software proficient</small></div></div>
          </div>
        </section>
        </EditableSectionContainer>

        <EditableSectionContainer sectionKey="professionals_grid" sectionTitle="Professional Roles" isEnabled={isSectionEnabled('professionals_grid')} sectionData={rolesSection}>
        <section className="hp-section hp-role-catalogue" id="hp-roles" aria-labelledby="hp-roles-heading">
          <div className="hp-section-heading hp-section-heading-split">
            <div>
              <span className="hp-section-kicker">{rolesSection?.subheading || 'Build your next chapter'}</span>
              <h2 id="hp-roles-heading">{rolesSection?.title || <>Explore professional <span>roles</span></>}</h2>
              <p>{rolesSection?.description || 'Choose a specialist path and learn about the work, tools, and experience that will help you thrive.'}</p>
            </div>
            <div className="hp-heading-note"><span className="hp-heading-note-dot" /> Four disciplines. One quality standard.</div>
          </div>

          <div className="hp-role-card-grid">
            {roles.map((role, index) => {
              const RoleIcon = role.icon;
              return (
                <motion.div
                  key={role.slug}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.18 }}
                  transition={{ duration: reduceMotion ? 0 : 0.48, delay: reduceMotion ? 0 : index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={`/hire-professionals/${role.slug}`}
                    className={`hp-role-card hp-role-card-${index + 1}`}
                    onPointerMove={handleCardPointerMove}
                    onPointerLeave={resetCardPointer}
                  >
                    <span className="hp-role-card-index">0{index + 1} / SPECIALIST PATH</span>
                    <span className="hp-role-card-icon"><RoleIcon size={25} strokeWidth={1.7} /></span>
                    <h3>{role.title}</h3>
                    <p>{role.cardDescription}</p>
                    <span className="hp-role-card-specialty"><Sparkles size={13} />{role.specialization}</span>
                    <span className="hp-role-card-skills">{role.skills.slice(0, 3).map(skill => <i key={skill}>{skill}</i>)}</span>
                    <span className="hp-role-card-link">Explore role <ArrowUpRight size={16} /></span>
                    <span className="hp-role-card-watermark" aria-hidden="true"><RoleIcon size={110} /></span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Deployment CTA */}
        </EditableSectionContainer>

        <EditableSectionContainer sectionKey="cta" sectionTitle="Hiring Call to Action" isEnabled={isSectionEnabled('cta')} sectionData={ctaSection}>
        <section className="hp-deployment-cta">
          <div className="hp-cta-grid-lines" aria-hidden="true" />
          <div className="hp-cta-icon-wrap"><div className="hp-cta-icon"><Clock size={27} /></div></div>
          <div className="hp-cta-copy">
            <span className="hp-cta-kicker">{ctaSection?.subheading || '72-Hour Rapid Deployment'}</span>
            <h2>{ctaSection?.title || 'Interview Qualified Candidates Within 48 Hours'}</h2>
            <p>{ctaSection?.description || 'Lock in top-tier accounting talent ahead of the busy season crunch. All candidates sign comprehensive bilateral NDAs and pass strict background verifications.'}</p>
            <div className="hp-cta-assurances">
              <span><ShieldCheck size={15} /> Verified &amp; Secure</span>
              <span><Clock size={15} /> Quick Ramp-Up</span>
              <span><UserCheck size={15} /> US-Trained Talent</span>
            </div>
          </div>
          <button type="button" onClick={handleBrowseRoles} className="hp-button hp-button-cta">
            <span>{ctaSection?.parsedContent?.buttonText || 'Explore Open Roles'}</span><ArrowRight size={17} />
          </button>
        </section>
        </EditableSectionContainer>
      </div>
    </main>
  );
}

export default HireProfessionalsPage;
