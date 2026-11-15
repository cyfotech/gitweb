import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { getHireRoleWithOverrides } from '../data/hireRoles';
import { ProfessionalApplicationForm } from '../components/ProfessionalApplicationForm';
import { HireRoleExperience } from '../components/HireRoleExperience';
import { usePageContent } from '../hooks/usePageContent';
import './HireProfessionalsPage.css';

const ROLE_REVEAL = {
  hidden: { opacity: 0, y: 18, filter: 'blur(5px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

const ROLE_STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.03 } },
} as const;

export function HireProfessionalRolePage() {
  const { roleSlug } = useParams();
  const { getSection } = usePageContent('hire-professionals');
  const role = getHireRoleWithOverrides(roleSlug, getSection('professionals_grid')?.parsedContent?.roles);
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(0);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  // Reset page-specific UI when navigating from one role to another.
  useEffect(() => {
    setSelectedLevelIndex(0);
    setIsApplicationOpen(false);
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }, [roleSlug, reduceMotion]);

  if (!role) return <Navigate to="/hire-professionals" replace />;

  // Keep the selected index valid if role content is updated dynamically.
  const availableLevelCount = role.levels?.length ?? 0;
  const safeSelectedLevelIndex =
    availableLevelCount > 0
      ? Math.min(selectedLevelIndex, availableLevelCount - 1)
      : 0;

  const selectedLevel = role.levels?.[safeSelectedLevelIndex];
  const responsibilities = selectedLevel?.responsibilities ?? role.responsibilities;
  const skills = selectedLevel?.skills ?? role.skills;
  const software = selectedLevel?.software ?? role.software;
  const qualifications = selectedLevel?.qualifications ?? role.qualifications;
  const experience = selectedLevel?.experience ?? role.experience;
  const expectations = selectedLevel?.expectations ?? role.expectations;
  const RoleIcon = role.icon;

  return (
    <main className="hire-pro-page hp-role-page" id="hire-professional-role">
      <div className="hp-ambient hp-ambient-one" aria-hidden="true" />
      <div className="hp-ambient hp-ambient-two" aria-hidden="true" />
      <div className="hp-content hp-role-content">
        <motion.nav
          className="hp-role-breadcrumb"
          aria-label="Breadcrumb"
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
          variants={ROLE_REVEAL}
        >
          <Link to="/hire-professionals"><ArrowLeft size={15} /> All professional roles</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span>{role.title}</span>
        </motion.nav>

        <motion.section
          className="hp-role-hero"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={ROLE_STAGGER}
        >
          <motion.div className="hp-role-hero-copy" variants={ROLE_STAGGER}>
            <motion.span className="hp-eyebrow" variants={ROLE_REVEAL}>
              <RoleIcon size={15} aria-hidden="true" />
              Career opportunity
            </motion.span>
            <motion.h1 variants={ROLE_REVEAL}>{role.title}</motion.h1>
            <motion.p variants={ROLE_REVEAL}>{selectedLevel?.description ?? role.overview}</motion.p>
            <motion.div className="hp-role-specialty" variants={ROLE_REVEAL}>
              <Sparkles size={15} aria-hidden="true" />
              <span>{role.specialization}</span>
            </motion.div>
            <motion.div className="hp-role-hero-actions" variants={ROLE_REVEAL}>
              <button
                type="button"
                className="hp-detail-button hp-detail-button-primary"
                onClick={() => setIsApplicationOpen(true)}
                aria-label={`Apply for the ${role.title} position`}
              >
                Apply Now <ArrowRight size={16} aria-hidden="true" />
              </button>
              <Link
                to="/hire-professionals"
                className="hp-detail-button hp-detail-button-secondary"
              >
                Back to All Roles
              </Link>
            </motion.div>
          </motion.div>
          <motion.div
            className="hp-role-hero-visual"
            role="region"
            aria-label={`${role.title} interactive workflow animation`}
            variants={ROLE_REVEAL}
          >
            <HireRoleExperience role={role} />
          </motion.div>
        </motion.section>

        {role.levels && (
          <motion.section
            className="hp-role-level-section"
            aria-label="Select experience level"
            initial={reduceMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            variants={ROLE_STAGGER}
          >
            <div className="hp-role-section-heading">
              <span className="hp-detail-kicker">Choose your experience</span>
              <h2>Find the right <em>level</em></h2>
            </div>
            <div className="hp-level-options">
              {role.levels.map((level, index) => (
                <motion.button
                  type="button"
                  key={level.label}
                  className={`hp-level-option${safeSelectedLevelIndex === index ? ' is-selected' : ''}`}
                  onClick={() => setSelectedLevelIndex(index)}
                  aria-pressed={safeSelectedLevelIndex === index}
                  aria-label={`Show ${level.label} experience details`}
                  variants={ROLE_REVEAL}
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                >
                  <span className="hp-level-icon" aria-hidden="true">
                    <GraduationCap size={19} />
                  </span>
                  <span className="hp-level-copy">
                    <strong>{level.label}</strong>
                    <small>{level.experience}</small>
                  </span>
                  <span className="hp-level-check" aria-hidden="true">
                    <Check size={14} />
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            aria-live="polite"
            aria-atomic="true"
            key={selectedLevel?.label || role.slug}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: 'easeOut' }}
          >
            <motion.section className="hp-role-overview hp-role-section" initial={reduceMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={ROLE_STAGGER}>
              <motion.div variants={ROLE_REVEAL}>
                <span className="hp-detail-kicker">Role overview</span>
                <h2>Make a measurable difference in <em>every engagement.</em></h2>
              </motion.div>
              <motion.p variants={ROLE_REVEAL}>{selectedLevel?.description ?? role.overview}</motion.p>
              <motion.div className="hp-role-experience-note" variants={ROLE_REVEAL}><span><BriefcaseBusiness size={17} /></span><div><strong>Experience</strong><small>{experience}</small></div></motion.div>
            </motion.section>

            <motion.section className="hp-role-detail-grid hp-role-section" initial={reduceMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={ROLE_STAGGER}>
              <motion.article className="hp-role-info-card hp-role-responsibilities" variants={ROLE_REVEAL} whileHover={reduceMotion ? undefined : { y: -3 }}>
                <span className="hp-role-card-icon"><CheckCircle2 size={19} /></span>
                <span className="hp-detail-kicker">Day-to-day impact</span>
                <h2>Key responsibilities</h2>
                <ul>
                  {responsibilities.map((item, index) => (
                    <li key={`${index}-${item}`}>
                      <Check size={15} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
              <motion.article className="hp-role-info-card hp-role-skills" variants={ROLE_REVEAL} whileHover={reduceMotion ? undefined : { y: -3 }}>
                <span className="hp-role-card-icon"><Sparkles size={19} /></span>
                <span className="hp-detail-kicker">Technical capability</span>
                <h2>Required skills</h2>
                <div className="hp-role-skill-list" aria-label="Required skills">
                  {skills.map((skill, index) => (
                    <span key={`${index}-${skill}`}>{skill}</span>
                  ))}
                </div>
                <h3>Software &amp; tools</h3>
                <div className="hp-role-tool-list" aria-label="Software and tools">
                  {software.map((tool, index) => (
                    <span key={`${index}-${tool}`}>{tool}</span>
                  ))}
                </div>
              </motion.article>
            </motion.section>

            <motion.section className="hp-role-qualifications hp-role-section" initial={reduceMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={ROLE_STAGGER}>
              <motion.div className="hp-role-section-heading" variants={ROLE_REVEAL}>
                <span className="hp-detail-kicker">What helps you thrive</span>
                <h2>Qualifications &amp; <em>expectations</em></h2>
              </motion.div>
              <div className="hp-role-qualification-grid">
                <motion.article className="hp-role-info-card" variants={ROLE_REVEAL} whileHover={reduceMotion ? undefined : { y: -3 }}>
                  <span className="hp-role-card-icon"><GraduationCap size={19} /></span>
                  <h3>Qualifications</h3>
                  <ul>
                    {qualifications.map((item, index) => (
                      <li key={`${index}-${item}`}>
                        <Check size={15} aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
                <motion.article className="hp-role-info-card" variants={ROLE_REVEAL} whileHover={reduceMotion ? undefined : { y: -3 }}>
                  <span className="hp-role-card-icon"><ShieldCheck size={19} /></span>
                  <h3>What we expect</h3>
                  <ul>
                    {expectations.map((item, index) => (
                      <li key={`${index}-${item}`}>
                        <Check size={15} aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
                <motion.article className="hp-role-info-card hp-role-benefits-card" variants={ROLE_REVEAL} whileHover={reduceMotion ? undefined : { y: -3 }}>
                  <span className="hp-role-card-icon"><BriefcaseBusiness size={19} /></span>
                  <h3>Why work with us</h3>
                  <ul>
                    {role.benefits.map((item, index) => (
                      <li key={`${index}-${item}`}>
                        <Check size={15} aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              </div>
            </motion.section>
          </motion.div>
        </AnimatePresence>

        <motion.section className="hp-role-apply-cta" initial={reduceMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={ROLE_STAGGER}>
          <motion.div variants={ROLE_REVEAL}>
            <span className="hp-detail-kicker">Your next chapter</span>
            <h2>Bring your expertise to a team that values <em>good work.</em></h2>
            <p>Share your experience and let’s explore whether this role is a good fit.</p>
          </motion.div>
          <motion.button
            type="button"
            className="hp-detail-button hp-detail-button-primary"
            onClick={() => setIsApplicationOpen(true)}
            aria-label={`Apply for the ${role.title} position`}
            variants={ROLE_REVEAL}
            whileHover={reduceMotion ? undefined : { y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          >
            Apply for This Position
            <ArrowUpRight size={16} aria-hidden="true" />
          </motion.button>
        </motion.section>
      </div>
      <AnimatePresence>
        {isApplicationOpen && (
          <ProfessionalApplicationForm
            role={role}
            selectedLevel={selectedLevel?.label}
            onClose={() => setIsApplicationOpen(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default HireProfessionalRolePage;
