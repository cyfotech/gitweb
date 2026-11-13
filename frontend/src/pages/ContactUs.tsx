import React, { useRef, useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  LoaderCircle,
  CheckCircle2,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RightBookingPopup } from '../components/RightBookingPopup';
import { inquiriesApi } from '../api/inquiries';
import { analyticsApi } from '../api/analytics';
import { visitorApi } from '../api/visitors';
import { getSubmissionError } from '../utils/formErrors';
import { useBackendStatus } from '../context/BackendStatusContext';
import { useGlobalSettings } from '../context/GlobalSettingsContext';
import { usePageContent } from '../hooks/usePageContent';
import { EditableElement } from '../components/EditableElement';
import { EditableSectionContainer } from '../components/EditableSectionContainer';
import { SocialLinksBar } from '../components/SocialLinksBar';
import { InteractiveRoutingSlip, InteractiveDoubtSolver } from '../components/referenceAnimations';
import './ContactUs.css';

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  organization: string;
  inquiryType: string;
  message: string;
};

type ContactField = keyof ContactFormData;
type ContactErrors = Partial<Record<ContactField, string>>;

function validateContactField(name: ContactField, value: string): string | undefined {
  const trimmed = value.trim();
  if ((name === 'name' || name === 'email' || name === 'message') && !trimmed) return 'This field is required.';
  if (name === 'name' && trimmed.length > 120) return 'Use 120 characters or fewer.';
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
  if (name === 'organization' && trimmed.length > 191) return 'Use 191 characters or fewer.';
  if (name === 'inquiryType' && !['cpa_firm', 'business', 'individual'].includes(value)) return 'Choose a valid client classification.';
  if (name === 'message') {
    if (trimmed.length > 10000) return 'Use 10,000 characters or fewer.';
  }
  return undefined;
}

export function ContactUs() {
  const { isFullyAvailable } = useBackendStatus();
  const { settings } = useGlobalSettings();
  const { getSection, isSectionEnabled } = usePageContent('contact');
  const heroSection = getSection('hero');
  const contactFormSection = getSection('contact_form');
  const formContent = contactFormSection?.parsedContent || {};

  const heroEyebrow = heroSection?.parsedContent?.eyebrow || heroSection?.subheading || 'CONTACT SMART TAX EXPERTSS — US TAX & ACCOUNTING OUTSOURCING SERVICES';
  const heroTitle = heroSection?.title || settings.contactHeading || 'Let’s discuss your tax, accounting & outsourcing requirements.';
  const heroDesc = heroSection?.description || settings.contactDescription || 'Whether you are a CPA firm looking to expand your team’s capacity, a business seeking dependable accounting support, or an individual who needs help with US tax preparation — tell us what you need. We’ll route it to the right desk.';

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    organization: '',
    inquiryType: 'cpa_firm',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [emailDelivery, setEmailDelivery] = useState<{
    customerConfirmation: 'accepted_by_smtp' | 'not_accepted';
    ownerNotification: 'accepted_by_smtp' | 'not_accepted';
  } | null>(null);
  const [emailDeliveryErrors, setEmailDeliveryErrors] = useState<{
    customerConfirmation?: string;
    ownerNotification?: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ContactErrors>({});
  const isSubmittingRef = useRef(false);

  const updateField = (name: ContactField, value: string) => {
    setFormData(previous => ({ ...previous, [name]: value }));
    setSubmitError(null);
    if (fieldErrors[name]) {
      setFieldErrors(previous => ({ ...previous, [name]: validateContactField(name, value) }));
    }
  };

  const validateFieldOnBlur = (name: ContactField, value: string) => {
    setFieldErrors(previous => ({ ...previous, [name]: validateContactField(name, value) }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    const form = e.currentTarget;

    const nextErrors = (Object.keys(formData) as ContactField[]).reduce<ContactErrors>((errors, field) => {
      const message = validateContactField(field, formData[field]);
      if (message) errors[field] = message;
      return errors;
    }, {});
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      window.requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }

    if (!isFullyAvailable) {
      setSubmitError('Contact submissions are temporarily unavailable. Please try again later.');
      return;
    }

    setIsSubmitting(true);
    isSubmittingRef.current = true;
    setSubmitError(null);

    try {
      const response = await inquiriesApi.submit({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        organization: formData.organization.trim(),
        inquiryType: formData.inquiryType,
        message: formData.message.trim(),
        sourcePage: window.location.pathname,
      });
      if (!response?.success || !response.submissionReceived || !response.inquiryId) {
        throw new Error('The server did not confirm receipt. Please try again.');
      }

      setEmailDelivery(response.emailDelivery);
      setEmailDeliveryErrors(response.emailDeliveryErrors || null);
      setSubmitted(true);

      // Automatic Name Recognition & Visitor Tracking (runs regardless of email delivery status)
      visitorApi.associateIdentity({
        name: formData.name,
        email: formData.email,
        formType: 'Contact Us',
        pageUrl: '/contact',
      }).catch(console.warn);

      analyticsApi.trackClick({
        pageUrl: '/contact',
        clickType: 'contact',
        elementId: 'contact_form_submit',
        elementText: 'Submit Inquiry',
      });

      // Only show confetti if email was delivered successfully
      if (response.emailDelivery?.customerConfirmation === 'accepted_by_smtp') {
        try {
          confetti({
            particleCount: 65,
            spread: 68,
            origin: { y: 0.72 },
            colors: ['#C9A86A', '#2CCFC5', '#79F1E8', '#F7E8C8'],
          });
        } catch {
          // Confetti optional
        }
      }
    } catch (err: unknown) {
      // PRESERVE VISITOR FORM DATA IN MEMORY - DO NOT MARK AS SUCCESSFUL
      const msg = getSubmissionError(err, 'Contact submissions are temporarily unavailable. Please try again later.');
      setSubmitError(msg);
      setSubmitted(false);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <main className="contact-premium">
      <div className="contact-premium__backdrop" aria-hidden="true">
        <span className="contact-premium__orb contact-premium__orb--one" />
        <span className="contact-premium__orb contact-premium__orb--two" />
        <span className="contact-premium__grid" />
      </div>

      <div className="contact-premium__container">
        <EditableSectionContainer sectionKey="hero" sectionTitle="Contact Introduction" isEnabled={isSectionEnabled('hero')} sectionData={heroSection}>
        <header className="contact-premium__intro contact-reveal">
          <EditableElement
            sectionKey="hero"
            elementKey="subheading"
            elementType="subheading"
            label="Contact Eyebrow"
            value={heroEyebrow}
          >
            <div className="contact-premium__eyebrow">
              <span className="contact-premium__eyebrow-icon"><Mail size={15} /></span>
              <span>{heroEyebrow}</span>
              <span className="contact-premium__eyebrow-line" />
            </div>
          </EditableElement>

          <EditableElement
            sectionKey="hero"
            elementKey="title"
            elementType="heading"
            label="Contact Headline"
            value={heroTitle}
          >
            <h1 className="contact-premium__title">
              {heroTitle.includes('&') ? (
                <>
                  {heroTitle.split('&')[0]}
                  <span>&amp; {heroTitle.split('&').slice(1).join('&').trim()}</span>
                </>
              ) : (
                heroTitle
              )}
            </h1>
          </EditableElement>

          <EditableElement
            sectionKey="hero"
            elementKey="description"
            elementType="paragraph"
            label="Contact Lead Description"
            value={heroDesc}
          >
            <p className="contact-premium__lead">
              {heroDesc}
            </p>
          </EditableElement>

          <div className="contact-premium__trust-row">
            <span><ShieldCheck size={16} /> Confidential conversations</span>
            <span className="contact-premium__trust-dot" />
            <span><Clock size={16} /> Response within 1 business day</span>
          </div>
        </header>
        </EditableSectionContainer>

        {/* Reference Interactive Module: Dynamic Digital Routing Slip */}
        <div className="mb-14">
          <InteractiveRoutingSlip />
        </div>

        <div className="contact-premium__layout">
          <aside className="contact-premium__sidebar" aria-label="Contact information">
            <article className="contact-info-card">
              <div className="contact-info-card__top">
                <span className="contact-info-card__icon"><MapPin size={20} /></span>
                <span className="contact-info-card__index">01</span>
              </div>
              <h2>National Headquarters</h2>
              <p>
                {settings.brandName}<br />
                {settings.address}
              </p>
              {settings.mapEmbedUrl && (
                <div className="mt-3 rounded-lg overflow-hidden border border-teal-500/20">
                  <iframe
                    title="Office Location Map"
                    src={settings.mapEmbedUrl}
                    className="w-full h-32 border-0"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="contact-info-card__accent" />
            </article>

            <article className="contact-info-card">
              <div className="contact-info-card__top">
                <span className="contact-info-card__icon"><Mail size={20} /></span>
                <span className="contact-info-card__index">02</span>
              </div>
              <h2>Direct Communication Lines</h2>
              <p className="contact-info-card__contact-line">
                Advisory: <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </p>
              <p className="contact-info-card__contact-line">
                Phone: <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}>{settings.phone}</a>
              </p>
              {settings.whatsapp && (
                <p className="contact-info-card__contact-line">
                  WhatsApp: <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">{settings.whatsapp}</a>
                </p>
              )}

              {/* Social Channels on Contact Page */}
              <div className="pt-2 border-t border-teal-500/10 mt-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Connect & Follow:
                </span>
                <SocialLinksBar
                  channels={settings.socialChannels}
                  fallbackLinks={{
                    linkedin: settings.linkedin,
                    twitter: settings.twitter,
                    facebook: settings.facebook,
                    instagram: settings.instagram,
                    youtube: settings.youtube,
                  }}
                  variant="card"
                  iconSize={15}
                />
              </div>

              <div className="contact-info-card__accent" />
            </article>

            <article className="contact-info-card">
              <div className="contact-info-card__top">
                <span className="contact-info-card__icon"><Clock size={20} /></span>
                <span className="contact-info-card__index">03</span>
              </div>
              <h2>{settings.operationalTitle || 'Active Operational Window'}</h2>
              <p>{settings.operationalLine1 || settings.businessHours || 'Mon – Fri: 8:00 AM – 7:00 PM EST'}</p>
              <p>{settings.operationalLine2 || 'Offshore Processing: 24-Hour Continuous Cycle'}</p>
              <p>{settings.operationalLine3 || 'Peak Season Support: 7 Days / Week'}</p>
              <div className="contact-info-card__accent" />
            </article>

            <div className="contact-premium__sidebar-note">
              <span className="contact-premium__sidebar-note-icon"><Sparkles size={17} /></span>
              <p>Thoughtful guidance. Clear communication. A partnership built around your goals.</p>
            </div>
          </aside>

          <EditableSectionContainer sectionKey="contact_form" sectionTitle="Contact Form" isEnabled={isSectionEnabled('contact_form')} sectionData={contactFormSection}>
          <section className="contact-form-panel contact-reveal">
            <div className="contact-form-panel__glow" aria-hidden="true" />

            {submitted ? (
              <div className="contact-success" role="status" aria-live="polite">
                <div className="contact-success__icon"><CheckCircle2 size={34} /></div>
                <span className="contact-success__eyebrow">Inquiry received</span>
                <h2>Inquiry Received</h2>
                <p>
                  Thank you, {formData.name}. Your inquiry is saved. An executive will respond to {formData.email} within 24 hours.
                </p>
                {emailDelivery && (
                  <p role="status" className="contact-success__delivery">
                    {emailDelivery.customerConfirmation === 'not_accepted' || emailDelivery.ownerNotification === 'not_accepted'
                      ? <><span className="font-semibold">Note:</span> Delivery confirmation email is being processed. Your inquiry is confirmed saved.</>
                      : <>
                          Customer confirmation: {emailDelivery.customerConfirmation === 'accepted_by_smtp' ? 'accepted by email server' : 'not accepted'}.
                          {' '}Owner notification: {emailDelivery.ownerNotification === 'accepted_by_smtp' ? 'accepted by email server' : 'not accepted'}.
                        </>
                    }
                    {emailDeliveryErrors?.customerConfirmation && ` Customer email: ${emailDeliveryErrors.customerConfirmation}`}
                    {emailDeliveryErrors?.ownerNotification && ` Owner email: ${emailDeliveryErrors.ownerNotification}`}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="contact-premium__button contact-premium__button--secondary"
                >
                  Send Another Inquiry <span aria-hidden="true">↗</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                <div className="contact-form__heading">
                  <div>
                    <span className="contact-form__eyebrow"><MessageSquare size={14} /> {formContent.eyebrow || 'START A CONVERSATION'}</span>
                    <h2>{contactFormSection?.title || 'Direct Partner Inquiry'}</h2>
                    <p>{contactFormSection?.description || 'Complete the details below for prompt review.'}</p>
                  </div>
                  <div className="contact-form__heading-mark" aria-hidden="true"><Send size={21} /></div>
                </div>

                {!isFullyAvailable && (
                  <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                    Contact submissions are temporarily unavailable. Please try again later.
                  </div>
                )}

                {submitError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                    {submitError}
                  </div>
                )}

                <div className="contact-form__grid">
                  <div className="contact-field">
                    <label htmlFor="contact-name">{formContent.nameLabel || 'Your Full Name'} <span>*</span></label>
                    <input
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      required
                      maxLength={120}
                      aria-invalid={Boolean(fieldErrors.name)}
                      aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                      placeholder={formContent.namePlaceholder || 'e.g. Sarah Jenkins, CPA'}
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      onBlur={(e) => validateFieldOnBlur('name', e.target.value)}
                    />
                    {fieldErrors.name && <span className="contact-field__error" id="contact-name-error" role="alert">{fieldErrors.name}</span>}
                  </div>

                  <div className="contact-field">
                    <label htmlFor="contact-email">{formContent.emailLabel || 'Work Email'} <span>*</span></label>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                      placeholder={formContent.emailPlaceholder || 'sjenkins@firmcpas.com'}
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      onBlur={(e) => validateFieldOnBlur('email', e.target.value)}
                    />
                    {fieldErrors.email && <span className="contact-field__error" id="contact-email-error" role="alert">{fieldErrors.email}</span>}
                  </div>

                  <div className="contact-field">
                    <label htmlFor="contact-phone">{formContent.phoneLabel || 'Phone Number'}</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      autoComplete="tel"
                      maxLength={32}
                      aria-invalid={Boolean(fieldErrors.phone)}
                      aria-describedby={fieldErrors.phone ? 'contact-phone-error' : undefined}
                      placeholder={formContent.phonePlaceholder || '(555) 000-0000'}
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      onBlur={(e) => validateFieldOnBlur('phone', e.target.value)}
                    />
                    {fieldErrors.phone && <span className="contact-field__error" id="contact-phone-error" role="alert">{fieldErrors.phone}</span>}
                  </div>

                  <div className="contact-field">
                    <label htmlFor="contact-organization">{formContent.organizationLabel || 'Organization'}</label>
                    <input
                      id="contact-organization"
                      type="text"
                      autoComplete="organization"
                      maxLength={191}
                      aria-invalid={Boolean(fieldErrors.organization)}
                      aria-describedby={fieldErrors.organization ? 'contact-organization-error' : undefined}
                      placeholder={formContent.organizationPlaceholder || 'Your firm or organization'}
                      value={formData.organization}
                      onChange={(e) => updateField('organization', e.target.value)}
                      onBlur={(e) => validateFieldOnBlur('organization', e.target.value)}
                    />
                    {fieldErrors.organization && <span className="contact-field__error" id="contact-organization-error" role="alert">{fieldErrors.organization}</span>}
                  </div>

                  <div className="contact-field contact-field--full">
                    <label htmlFor="contact-inquiry-type">{formContent.inquiryTypeLabel || 'Client Classification'}</label>
                    <select
                      id="contact-inquiry-type"
                      value={formData.inquiryType}
                      aria-invalid={Boolean(fieldErrors.inquiryType)}
                      aria-describedby={fieldErrors.inquiryType ? 'contact-inquiry-type-error' : undefined}
                      onChange={(e) => updateField('inquiryType', e.target.value)}
                      onBlur={(e) => validateFieldOnBlur('inquiryType', e.target.value)}
                    >
                      <option value="cpa_firm" className="bg-white dark:bg-[#0D222B] text-slate-900 dark:text-slate-100">CPA / Accounting Practice</option>
                      <option value="business" className="bg-white dark:bg-[#0D222B] text-slate-900 dark:text-slate-100">Commercial Business Entity</option>
                      <option value="individual" className="bg-white dark:bg-[#0D222B] text-slate-900 dark:text-slate-100">High-Net-Worth Individual</option>
                    </select>
                    {fieldErrors.inquiryType && <span className="contact-field__error" id="contact-inquiry-type-error" role="alert">{fieldErrors.inquiryType}</span>}
                  </div>

                  <div className="contact-field contact-field--full">
                    <label htmlFor="contact-message">{formContent.messageLabel || 'Scope Overview or Questions'} <span>*</span></label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      maxLength={10000}
                      aria-invalid={Boolean(fieldErrors.message)}
                      aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
                      placeholder={formContent.messagePlaceholder || 'Describe your current volume, target software stack, or specific tax objectives...'}
                      value={formData.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      onBlur={(e) => validateFieldOnBlur('message', e.target.value)}
                    />
                    {fieldErrors.message && <span className="contact-field__error" id="contact-message-error" role="alert">{fieldErrors.message}</span>}
                  </div>
                </div>

                <div className="contact-form__footer">
                  <div className="contact-form__privacy">
                    <ShieldCheck size={18} />
                    <span>{formContent.privacyText || 'Confidentiality Protected by Mutual NDA'}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFullyAvailable}
                    className="contact-premium__button disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? <><LoaderCircle className="contact-form__spinner" size={16} /> <span>{formContent.submittingText || 'Submitting...'}</span></> : <><span>{!isFullyAvailable ? (formContent.unavailableText || 'Submissions Unavailable') : (formContent.submitText || 'Submit Inquiry')}</span><Send size={16} /></>}
                  </button>
                </div>
                <p className="contact-form__fine-print">Your details are used to respond to this inquiry.</p>
              </form>
            )}
          </section>
          </EditableSectionContainer>
        </div>

        {/* Reference Interactive Module: Got a Doubt? The Answer is on the Button */}
        <div className="mt-14">
          <InteractiveDoubtSolver />
        </div>
      </div>

      {/* Right-side 15-second Calendly booking popup */}
      <RightBookingPopup delaySeconds={15} />
    </main>
  );
}
