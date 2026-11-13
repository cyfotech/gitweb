import { useEffect, useRef, useState } from 'react';
import type { FormEvent, FocusEvent, ChangeEvent } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'motion/react';
import {
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  LoaderCircle,
  Mail,
  ShieldCheck,
  UploadCloud,
  UserRound,
  X,
} from 'lucide-react';
import { applicationsApi, type CareerApplicationPayload } from '../api/applications';
import type { HireRole } from '../data/hireRoles';
import { getSubmissionError } from '../utils/formErrors';

interface ProfessionalApplicationFormProps {
  role: HireRole;
  selectedLevel?: string;
  onClose: () => void;
}

type ApplicationField =
  | 'fullName'
  | 'email'
  | 'phone'
  | 'country'
  | 'city'
  | 'experienceLevel'
  | 'yearsExperience'
  | 'employmentStatus'
  | 'expectedSalary'
  | 'relevantSkills'
  | 'softwareKnowledge'
  | 'linkedinProfile'
  | 'coverLetter'
  | 'additionalInfo'
  | 'privacyAccepted'
  | 'resume';

type FieldErrors = Partial<Record<ApplicationField, string>>;

const MAX_RESUME_SIZE = 5 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = /\.(pdf|doc|docx)$/i;
const REQUIRED_FIELDS: ApplicationField[] = [
  'fullName',
  'email',
  'phone',
  'country',
  'city',
  'yearsExperience',
  'relevantSkills',
  'softwareKnowledge',
];

function validateValue(name: ApplicationField, value: string): string | undefined {
  const trimmed = value.trim();
  if (REQUIRED_FIELDS.includes(name) && !trimmed) return 'This field is required.';
  if (name === 'fullName' && trimmed.length > 120) return 'Use 120 characters or fewer.';
  if (name === 'email') {
    if (trimmed.length > 254) return 'Email must be 254 characters or fewer.';
    if (trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Enter a valid email address.';
  }
  if (name === 'phone' && trimmed) {
    const digitCount = trimmed.replace(/\D/g, '').length;
    if (!/^\+?[\d\s().-]+$/.test(trimmed) || digitCount < 7 || digitCount > 15) {
      return 'Enter a valid phone number, including country code if needed.';
    }
  }
  if (name === 'yearsExperience' && trimmed) {
    const years = Number(trimmed);
    if (!Number.isFinite(years) || years < 0 || years > 60) return 'Enter a value between 0 and 60 years.';
  }
  if (name === 'relevantSkills' && trimmed.length > 12000) return 'Use 12,000 characters or fewer.';
  if (name === 'softwareKnowledge' && trimmed.length > 8000) return 'Use 8,000 characters or fewer.';
  if (name === 'expectedSalary' && trimmed.length > 100) return 'Use 100 characters or fewer.';
  if (name === 'linkedinProfile' && trimmed && !/^https:\/\/(www\.)?linkedin\.com\//i.test(trimmed)) {
    return 'Enter a LinkedIn profile URL beginning with https://linkedin.com/.';
  }
  if (name === 'coverLetter' && trimmed.length > 20000) return 'Use 20,000 characters or fewer.';
  if (name === 'additionalInfo' && trimmed.length > 12000) return 'Use 12,000 characters or fewer.';
  return undefined;
}

export function ProfessionalApplicationForm({ role, selectedLevel, onClose }: ProfessionalApplicationFormProps) {
  const reduceMotion = useReducedMotion();
  const [resume, setResume] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [submittedReference, setSubmittedReference] = useState('');
  const dialogRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onCloseRef = useRef(onClose);
  const isSubmittingRef = useRef(isSubmitting);
  onCloseRef.current = onClose;
  isSubmittingRef.current = isSubmitting;

  useEffect(() => {
    const scrollY = window.scrollY;
    const body = document.body;
    const root = document.getElementById('root');
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const documentElement = document.documentElement;
    const previousScrollBehavior = documentElement.style.scrollBehavior;
    const previousBodyStyles = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    const previousInert = root?.inert ?? false;
    const previousAriaHidden = root ? root.getAttribute('aria-hidden') : null;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    if (root) {
      root.inert = true;
      root.setAttribute('aria-hidden', 'true');
    }

    const focusInitial = window.requestAnimationFrame(() => {
      firstFieldRef.current?.focus({ preventScroll: true });
    });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (!isSubmittingRef.current) onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter(element => element.getAttribute('aria-hidden') !== 'true');
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialogRef.current.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusInitial);
      window.removeEventListener('keydown', handleKeyDown);
      if (root) {
        root.inert = previousInert;
        if (previousAriaHidden === null) root.removeAttribute('aria-hidden');
        else root.setAttribute('aria-hidden', previousAriaHidden);
      }
      Object.assign(body.style, previousBodyStyles);
      previousFocus?.focus({ preventScroll: true });
      documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, scrollY);
      documentElement.style.scrollBehavior = previousScrollBehavior;
    };
  }, []);

  const validateField = (name: ApplicationField, value: string) => {
    const message = validateValue(name, value);
    setErrors(previous => {
      if (!message && !previous[name]) return previous;
      return { ...previous, [name]: message };
    });
  };

  const handleFieldBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = event.currentTarget.name as ApplicationField;
    if (name in errors || REQUIRED_FIELDS.includes(name)) validateField(name, event.currentTarget.value);
  };

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = event.currentTarget.name as ApplicationField;
    if (errors[name]) validateField(name, event.currentTarget.value);
    setSubmitError('');
  };

  const updateResume = (file?: File) => {
    if (!file) return;
    if (!ACCEPTED_EXTENSIONS.test(file.name)) {
      setResume(null);
      setErrors(previous => ({ ...previous, resume: 'Choose a PDF, DOC, or DOCX resume.' }));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    if (file.size === 0 || file.size > MAX_RESUME_SIZE) {
      setResume(null);
      setErrors(previous => ({ ...previous, resume: file.size === 0 ? 'The selected file is empty.' : 'Resume must be 5 MB or smaller.' }));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setErrors(previous => ({ ...previous, resume: undefined }));
    setSubmitError('');
    setResume(file);
  };

  const validateForm = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    const nextErrors: FieldErrors = {};
    for (const name of REQUIRED_FIELDS) {
      const message = validateValue(name, String(formData.get(name) ?? ''));
      if (message) nextErrors[name] = message;
    }
    const optionalFields: ApplicationField[] = [
      'expectedSalary',
      'relevantSkills',
      'softwareKnowledge',
      'linkedinProfile',
      'coverLetter',
      'additionalInfo',
    ];
    for (const name of optionalFields) {
      const value = String(formData.get(name) ?? '');
      const message = validateValue(name, value);
      if (message) nextErrors[name] = message;
    }
    if (role.levels && !role.levels.some(level => level.label === formData.get('experienceLevel'))) {
      nextErrors.experienceLevel = 'Select one of the available experience levels.';
    }
    if (!resume) nextErrors.resume = 'Attach your resume / CV before submitting.';
    if (!formData.has('privacyAccepted')) nextErrors.privacyAccepted = 'Consent is required to submit your application.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      window.requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmittingRef.current || !validateForm(event.currentTarget)) return;
    const formData = new FormData(event.currentTarget);
    const yearsExperience = Number(formData.get('yearsExperience'));

    const payload: CareerApplicationPayload = {
      fullName: String(formData.get('fullName') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      country: String(formData.get('country') || '').trim(),
      city: String(formData.get('city') || '').trim(),
      position: role.title,
      experienceLevel: role.levels ? String(formData.get('experienceLevel') || selectedLevel || '') : undefined,
      yearsExperience,
      relevantSkills: String(formData.get('relevantSkills') || '').trim(),
      softwareKnowledge: String(formData.get('softwareKnowledge') || '').trim(),
      employmentStatus: String(formData.get('employmentStatus') || ''),
      expectedSalary: String(formData.get('expectedSalary') || '').trim(),
      linkedinProfile: String(formData.get('linkedinProfile') || '').trim(),
      coverLetter: String(formData.get('coverLetter') || '').trim(),
      additionalInfo: String(formData.get('additionalInfo') || '').trim(),
      privacyAccepted: formData.has('privacyAccepted'),
    };

    setIsSubmitting(true);
    isSubmittingRef.current = true;
    setSubmitError('');
    try {
      const response = await applicationsApi.submit(payload, resume!);
      if (!response?.success || !response.applicationId) {
        throw new Error('The server did not confirm receipt. Please try again.');
      }
      setSubmittedReference(response.applicationId);
      contentRef.current?.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' });
    } catch (error: unknown) {
      setSubmitError(getSubmissionError(error, 'We could not submit your application. Please try again.'));
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const describedBy = (name: ApplicationField) => errors[name] ? `${name}-error` : undefined;
  const fieldProps = (name: ApplicationField) => ({
    onBlur: handleFieldBlur,
    onChange: handleFieldChange,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': describedBy(name),
  });
  const errorText = (name: ApplicationField) => errors[name] && (
    <span className="hp-field-error" id={`${name}-error`} role="alert">{errors[name]}</span>
  );
  const FieldLabel = ({ htmlFor, children, required = false }: { htmlFor: string; children: string; required?: boolean }) => (
    <label htmlFor={htmlFor} className="hp-application-field-label">
      {children}{required && <span aria-hidden="true"> *</span>}
    </label>
  );

  return createPortal(
    <motion.div
      className="hp-application-backdrop"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.18 }}
      onMouseDown={event => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
      onWheel={event => {
        if (!contentRef.current?.contains(event.target as Node)) event.preventDefault();
      }}
    >
      <motion.section
        ref={dialogRef}
        className="hp-application-modal"
        initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.99 }}
        transition={{ duration: reduceMotion ? 0 : 0.22, ease: 'easeOut' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hp-application-title"
        aria-describedby="hp-application-description"
        tabIndex={-1}
        onMouseDown={event => event.stopPropagation()}
      >
        <header className="hp-application-heading">
          <span className="hp-application-heading-icon"><BriefcaseBusiness size={19} /></span>
          <div className="hp-application-heading-copy">
            <span className="hp-detail-kicker">{submittedReference ? 'Application received' : 'Candidate application'}</span>
            <h2 id="hp-application-title">{submittedReference ? 'Thank you for applying' : `Apply for ${role.title}`}</h2>
            <p id="hp-application-description">
              {submittedReference
                ? 'Your application has been received by our recruitment team.'
                : 'Share your details and experience. Your information is sent securely.'}
            </p>
          </div>
          <button
            className="hp-application-close"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close application form"
          >
            <X size={19} />
          </button>
        </header>

        <div className="hp-application-content" ref={contentRef}>
          {submittedReference ? (
            <div className="hp-application-success" role="status" aria-live="polite">
              <span className="hp-application-success-icon"><CheckCircle2 size={30} /></span>
              <h3>Application submitted successfully</h3>
              <p>Thank you for your interest. Our recruitment team will review your application and contact you if your profile matches our requirements.</p>
              <div className="hp-application-reference"><ShieldCheck size={16} /><span>Reference</span><strong>{submittedReference}</strong></div>
              <button type="button" className="hp-detail-button hp-detail-button-primary" onClick={onClose}>Close</button>
            </div>
          ) : (
            <form className="hp-application-form" onSubmit={handleSubmit} noValidate>
              <section className="hp-application-section" aria-labelledby="hp-personal-heading">
                <div className="hp-application-section-heading">
                  <span><UserRound size={16} /></span>
                  <div><h3 id="hp-personal-heading">Personal information</h3><p>How should our recruitment team address you?</p></div>
                </div>
                <div className="hp-form-grid">
                  <div className="hp-form-field">
                    <FieldLabel htmlFor="application-fullName" required>Full name</FieldLabel>
                    <input ref={firstFieldRef} id="application-fullName" name="fullName" autoComplete="name" required maxLength={120} {...fieldProps('fullName')} />
                    {errorText('fullName')}
                  </div>
                  <div className="hp-form-field">
                    <FieldLabel htmlFor="application-email" required>Email address</FieldLabel>
                    <input id="application-email" name="email" type="email" autoComplete="email" required maxLength={254} {...fieldProps('email')} />
                    {errorText('email')}
                  </div>
                  <div className="hp-form-field">
                    <FieldLabel htmlFor="application-phone" required>Phone number</FieldLabel>
                    <input id="application-phone" name="phone" type="tel" autoComplete="tel" required maxLength={32} placeholder="+1 (555) 000-0000" {...fieldProps('phone')} />
                    {errorText('phone')}
                  </div>
                  <div className="hp-form-field">
                    <FieldLabel htmlFor="application-country" required>Country</FieldLabel>
                    <input id="application-country" name="country" autoComplete="country-name" required maxLength={100} {...fieldProps('country')} />
                    {errorText('country')}
                  </div>
                  <div className="hp-form-field">
                    <FieldLabel htmlFor="application-city" required>City</FieldLabel>
                    <input id="application-city" name="city" autoComplete="address-level2" required maxLength={100} {...fieldProps('city')} />
                    {errorText('city')}
                  </div>
                </div>
              </section>

              <section className="hp-application-section" aria-labelledby="hp-role-heading">
                <div className="hp-application-section-heading">
                  <span><BriefcaseBusiness size={16} /></span>
                  <div><h3 id="hp-role-heading">Professional information</h3><p>Tell us which opportunity best fits your background.</p></div>
                </div>
                <div className="hp-form-grid">
                  <div className="hp-form-field">
                    <FieldLabel htmlFor="application-position">Position applying for</FieldLabel>
                    <input id="application-position" value={role.title} readOnly aria-readonly="true" />
                  </div>
                  {role.levels && (
                    <div className="hp-form-field">
                      <FieldLabel htmlFor="application-experienceLevel" required>Experience level</FieldLabel>
                      <select id="application-experienceLevel" name="experienceLevel" defaultValue={selectedLevel || role.levels[0].label} required {...fieldProps('experienceLevel')}>
                        {role.levels.map(level => <option key={level.label} value={level.label} className="bg-white dark:bg-[#0D222B] text-slate-900 dark:text-slate-100">{level.label}</option>)}
                      </select>
                      {errorText('experienceLevel')}
                    </div>
                  )}
                  <div className="hp-form-field">
                    <FieldLabel htmlFor="application-employmentStatus">Current employment status</FieldLabel>
                    <select id="application-employmentStatus" name="employmentStatus" defaultValue="" {...fieldProps('employmentStatus')}>
                      <option value="" className="bg-white dark:bg-[#0D222B] text-slate-900 dark:text-slate-100">Select a status</option>
                      <option value="Employed" className="bg-white dark:bg-[#0D222B] text-slate-900 dark:text-slate-100">Employed</option>
                      <option value="Self-employed" className="bg-white dark:bg-[#0D222B] text-slate-900 dark:text-slate-100">Self-employed</option>
                      <option value="Unemployed" className="bg-white dark:bg-[#0D222B] text-slate-900 dark:text-slate-100">Unemployed</option>
                      <option value="Student / recent graduate" className="bg-white dark:bg-[#0D222B] text-slate-900 dark:text-slate-100">Student / recent graduate</option>
                      <option value="Other" className="bg-white dark:bg-[#0D222B] text-slate-900 dark:text-slate-100">Other</option>
                    </select>
                    {errorText('employmentStatus')}
                  </div>
                  <div className="hp-form-field">
                    <FieldLabel htmlFor="application-expectedSalary">Expected salary</FieldLabel>
                    <input id="application-expectedSalary" name="expectedSalary" maxLength={100} placeholder="Optional" {...fieldProps('expectedSalary')} />
                    {errorText('expectedSalary')}
                  </div>
                  <div className="hp-form-field hp-form-span">
                    <FieldLabel htmlFor="application-linkedinProfile">LinkedIn profile</FieldLabel>
                    <input id="application-linkedinProfile" name="linkedinProfile" type="url" maxLength={500} placeholder="https://www.linkedin.com/in/your-profile" {...fieldProps('linkedinProfile')} />
                    {errorText('linkedinProfile')}
                  </div>
                </div>
              </section>

              <section className="hp-application-section" aria-labelledby="hp-skills-heading">
                <div className="hp-application-section-heading">
                  <span><ShieldCheck size={16} /></span>
                  <div><h3 id="hp-skills-heading">Experience &amp; skills</h3><p>Highlight the experience and tools you would bring to the team.</p></div>
                </div>
                <div className="hp-form-grid">
                  <div className="hp-form-field hp-form-span">
                    <FieldLabel htmlFor="application-yearsExperience" required>Total years of experience</FieldLabel>
                    <input id="application-yearsExperience" name="yearsExperience" type="number" min="0" max="60" step="0.5" required inputMode="decimal" {...fieldProps('yearsExperience')} />
                    {errorText('yearsExperience')}
                  </div>
                  <div className="hp-form-field hp-form-span">
                    <FieldLabel htmlFor="application-relevantSkills" required>Relevant skills</FieldLabel>
                    <textarea id="application-relevantSkills" name="relevantSkills" required rows={3} maxLength={12000} placeholder="Describe your tax, accounting, or client-service experience." {...fieldProps('relevantSkills')} />
                    {errorText('relevantSkills')}
                  </div>
                  <div className="hp-form-field hp-form-span">
                    <FieldLabel htmlFor="application-softwareKnowledge" required>Software knowledge</FieldLabel>
                    <textarea id="application-softwareKnowledge" name="softwareKnowledge" required rows={2} maxLength={8000} placeholder="For example: Drake, QuickBooks, Xero, or other relevant tools." {...fieldProps('softwareKnowledge')} />
                    {errorText('softwareKnowledge')}
                  </div>
                </div>
              </section>

              <section className="hp-application-section" aria-labelledby="hp-resume-heading">
                <div className="hp-application-section-heading">
                  <span><FileText size={16} /></span>
                  <div><h3 id="hp-resume-heading">Resume / document upload <b>*</b></h3><p>PDF, DOC, or DOCX · 5 MB maximum</p></div>
                </div>
                <button
                  className={`hp-resume-dropzone${isDragging ? ' is-dragging' : ''}${resume ? ' has-file' : ''}${errors.resume ? ' has-error' : ''}`}
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={event => { event.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={event => { event.preventDefault(); setIsDragging(false); updateResume(event.dataTransfer.files[0]); }}
                  aria-describedby={errors.resume ? 'resume-error' : 'resume-hint'}
                  aria-invalid={Boolean(errors.resume)}
                >
                  {resume ? <FileText size={22} /> : <UploadCloud size={23} />}
                  <span><strong>{resume?.name || 'Drop your resume here or browse files'}</strong><small id="resume-hint">{resume ? `${(resume.size / (1024 * 1024)).toFixed(2)} MB · Ready to upload` : 'Your file is only shared with the recruitment team.'}</small></span>
                </button>
                <input
                  ref={fileInputRef}
                  id="application-resume"
                  className="hp-visually-hidden"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={event => updateResume(event.target.files?.[0])}
                  aria-invalid={Boolean(errors.resume)}
                  aria-describedby={errors.resume ? 'resume-error' : 'resume-hint'}
                  tabIndex={-1}
                />
                {errors.resume && <span className="hp-field-error" id="resume-error" role="alert">{errors.resume}</span>}
              </section>

              <section className="hp-application-section" aria-labelledby="hp-additional-heading">
                <div className="hp-application-section-heading">
                  <span><Mail size={16} /></span>
                  <div><h3 id="hp-additional-heading">Additional information</h3><p>Optional context you would like our team to consider.</p></div>
                </div>
                <div className="hp-form-grid">
                  <div className="hp-form-field hp-form-span">
                    <FieldLabel htmlFor="application-coverLetter">Cover letter</FieldLabel>
                    <textarea id="application-coverLetter" name="coverLetter" rows={3} maxLength={20000} placeholder="Optional" {...fieldProps('coverLetter')} />
                    {errorText('coverLetter')}
                  </div>
                  <div className="hp-form-field hp-form-span">
                    <FieldLabel htmlFor="application-additionalInfo">Anything else to share?</FieldLabel>
                    <textarea id="application-additionalInfo" name="additionalInfo" rows={2} maxLength={12000} placeholder="Optional" {...fieldProps('additionalInfo')} />
                    {errorText('additionalInfo')}
                  </div>
                </div>
              </section>

              <label className={`hp-privacy-consent${errors.privacyAccepted ? ' has-error' : ''}`}>
                <input
                  name="privacyAccepted"
                  type="checkbox"
                  required
                  aria-invalid={Boolean(errors.privacyAccepted)}
                  aria-describedby={describedBy('privacyAccepted')}
                  onChange={() => setErrors(previous => ({ ...previous, privacyAccepted: undefined }))}
                />
                <span>I consent to the use of my information for recruitment and understand it will be handled confidentially. <b>*</b></span>
              </label>
              {errorText('privacyAccepted')}

              {submitError && <p className="hp-application-error" role="alert" aria-live="assertive">{submitError}</p>}

              <footer className="hp-application-actions">
                <span>Fields marked <b>*</b> are required.</span>
                <div>
                  <button className="hp-detail-button hp-detail-button-secondary" type="button" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                  <button className="hp-detail-button hp-detail-button-primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <><LoaderCircle className="hp-spinner" size={16} /> Submitting…</> : 'Submit application'}
                  </button>
                </div>
              </footer>
            </form>
          )}
        </div>
      </motion.section>
    </motion.div>,
    document.body
  );
}
