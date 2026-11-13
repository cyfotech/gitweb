import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Lock,
  Sparkles,
  AlertCircle,
  Clock,
  User,
  Mail,
  Phone,
  Building,
  HelpCircle,
  FileCheck,
  Calendar
} from 'lucide-react';
import { getSubmissionError } from '../utils/formErrors';
import confetti from 'canvas-confetti';
import { consultationsApi } from '../api/inquiries';
import { openCalendlyPopup } from './CalendlyWidget';
import { useGlobalSettings } from '../context/GlobalSettingsContext';
import { visitorApi } from '../api/visitors';
import { analyticsApi } from '../api/analytics';
import { useBackendStatus } from '../context/BackendStatusContext';
import {
  CLIENT_CATEGORIES,
  getServicesByCategory,
  findServiceBySlug,
  ClientCategory,
  ServiceItem
} from '../data/services';

interface ConsultationFormProps {
  initialCategory?: ClientCategory;
  initialServiceSlug?: string;
  onSubmitted?: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  category: ClientCategory;
  serviceSlug: string;
  annualVolumeOrRevenue: string;
  preferredContactMethod: 'email' | 'phone';
  message: string;
  privacyConsent: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  serviceSlug?: string;
  annualVolumeOrRevenue?: string;
  message?: string;
  privacyConsent?: string;
}

type EmailDeliveryStatus = 'accepted_by_smtp' | 'not_accepted';

interface ConsultationEmailDelivery {
  customerConfirmation: EmailDeliveryStatus;
  ownerNotification: EmailDeliveryStatus;
  errors?: {
    customerConfirmation?: string;
    ownerNotification?: string;
  };
}

const VOLUME_OPTIONS = [
  'Under $250K',
  '$250K - $1M',
  '$1M - $5M',
  '$5M - $25M+',
  'CPA Firm: 50-200 Returns/yr',
  'CPA Firm: 200-1000+ Returns/yr',
];
const VALIDATED_FIELDS: (keyof FormErrors)[] = [
  'fullName',
  'email',
  'phone',
  'companyName',
  'serviceSlug',
  'annualVolumeOrRevenue',
  'message',
  'privacyConsent',
];

function validateConsultationField(field: keyof FormErrors, value: FormData[keyof FormData], category: ClientCategory): string | undefined {
  const text = typeof value === 'string' ? value.trim() : '';
  if (field === 'fullName') {
    if (!text) return 'Full name is required.';
    if (text.length > 120) return 'Name must be 120 characters or fewer.';
  }
  if (field === 'email') {
    if (!text) return 'Email address is required.';
    if (text.length > 254) return 'Email must be 254 characters or fewer.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return 'Please enter a valid email address.';
  }
  if (field === 'phone') {
    const digits = text.replace(/\D/g, '').length;
    if (!text) return 'Phone number is required for verification.';
    if (!/^\+?[\d\s().-]+$/.test(text) || digits < 7 || digits > 15) return 'Enter a valid phone number, including country code if needed.';
  }
  if (field === 'companyName' && text.length > 191) return 'Company name must be 191 characters or fewer.';
  if (field === 'serviceSlug' && !getServicesByCategory(category).some(service => service.slug === value)) return 'Please select a valid service.';
  if (field === 'annualVolumeOrRevenue' && !VOLUME_OPTIONS.includes(text)) return 'Select one of the listed volume bands.';
  if (field === 'message' && text.length > 5000) return 'Use 5,000 characters or fewer.';
  if (field === 'privacyConsent' && value !== true) return 'Please provide consent before submitting.';
  return undefined;
}

export function ConsultationForm({
  initialCategory = 'business',
  initialServiceSlug = '',
  onSubmitted
}: ConsultationFormProps) {
  // Validate incoming initialCategory and initialServiceSlug
  const validCategory: ClientCategory =
    ['individual', 'business', 'cpa'].includes(initialCategory) ? initialCategory : 'business';

  const categoryServices = getServicesByCategory(validCategory);
  const matchingInitialService = categoryServices.find((s) => s.slug === initialServiceSlug);
  const initialValidSlug = matchingInitialService ? matchingInitialService.slug : (categoryServices[0]?.slug || '');

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    category: validCategory,
    serviceSlug: initialValidSlug,
    annualVolumeOrRevenue: '$250K - $1M',
    preferredContactMethod: 'email',
    message: '',
    privacyConsent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionReference, setSubmissionReference] = useState('');
  const [emailDelivery, setEmailDelivery] = useState<ConsultationEmailDelivery | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { isFullyAvailable } = useBackendStatus();
  const { settings } = useGlobalSettings();
  const formRef = useRef<HTMLFormElement>(null);
  const isSubmittingRef = useRef(false);
  const calendlyDynamicUrl = settings.consultationSettings?.defaultCalendlyUrl;
  const bookingDisplayMode = settings.consultationSettings?.bookingDisplayMode || 'popup';

  // Sync when initialCategory or initialServiceSlug changes externally
  useEffect(() => {
    if (initialCategory && ['individual', 'business', 'cpa'].includes(initialCategory)) {
      const allowed = getServicesByCategory(initialCategory);
      const matched = allowed.find((s) => s.slug === initialServiceSlug);
      setFormData((prev) => ({
        ...prev,
        category: initialCategory,
        serviceSlug: matched ? matched.slug : (allowed[0]?.slug || '')
      }));
    }
  }, [initialCategory, initialServiceSlug]);

  // Handle category change: strictly filter services, and clear serviceSlug if not valid in new category
  const handleCategoryChange = (newCategory: ClientCategory) => {
    const newAvailableServices = getServicesByCategory(newCategory);
    const isCurrentServiceValid = newAvailableServices.some((s) => s.slug === formData.serviceSlug);

    setFormData((prev) => ({
      ...prev,
      category: newCategory,
      serviceSlug: isCurrentServiceValid ? prev.serviceSlug : (newAvailableServices[0]?.slug || '')
    }));
    setErrors(previous => ({ ...previous, serviceSlug: undefined }));

    try {
      const url = new URL(window.location.href);
      url.searchParams.set('category', newCategory);
      const defaultSlug = newAvailableServices[0]?.slug || '';
      url.searchParams.set('service', isCurrentServiceValid ? formData.serviceSlug : defaultSlug);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Ignore in non-browser context
    }
  };

  const handleServiceChange = (newSlug: string) => {
    setFormData((prev) => ({ ...prev, serviceSlug: newSlug }));
    setErrors(previous => ({ ...previous, serviceSlug: undefined }));
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('category', formData.category);
      url.searchParams.set('service', newSlug);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Ignore
    }
  };

  const updateFormField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(previous => ({ ...previous, [field]: value }));
    setSubmitError(null);
    const errorField = field as keyof FormErrors;
    if (errorField in errors) {
      const message = validateConsultationField(errorField, value, formData.category);
      setErrors(previous => ({ ...previous, [errorField]: message }));
    }
  };

  const validateFieldOnBlur = (field: keyof FormErrors, value: FormData[keyof FormData]) => {
    const message = validateConsultationField(field, value, formData.category);
    setErrors(previous => ({ ...previous, [field]: message }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    for (const field of VALIDATED_FIELDS) {
      const message = validateConsultationField(field, formData[field], formData.category);
      if (message) errs[field] = message;
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      window.requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
    }
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    if (!validate()) {
      return;
    }

    if (!isFullyAvailable) {
      setSubmitError('Consultation bookings are temporarily unavailable. Please try again later.');
      return;
    }

    setIsSubmitting(true);
    isSubmittingRef.current = true;
    setSubmitError(null);

    try {
      const res = await consultationsApi.submit({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        companyName: formData.companyName.trim() || undefined,
        category: formData.category,
        serviceSlug: formData.serviceSlug,
        serviceName: selectedServiceDetails?.name,
        annualVolumeOrRevenue: formData.annualVolumeOrRevenue,
        preferredContactMethod: formData.preferredContactMethod,
        message: formData.message.trim(),
        sourcePage: `${window.location.pathname}${window.location.search}`,
        privacyConsent: formData.privacyConsent,
      });

      if (!res?.success || !res.submissionReceived || !res.referenceNo || !res.emailDelivery) {
        throw new Error('The server did not confirm receipt. Please try again.');
      }
      setIsSubmitted(true);
      setSubmissionReference(res.referenceNo);
      setEmailDelivery({
        ...res.emailDelivery,
        errors: res.emailDeliveryErrors,
      });

      // Automatic Name Recognition & Visitor Tracking
      visitorApi.associateIdentity({
        name: formData.fullName,
        email: formData.email,
        formType: 'Book Consultation',
        pageUrl: window.location.pathname,
      }).catch(console.warn);

      analyticsApi.trackClick({
        pageUrl: '/book-consultation',
        clickType: 'consultation',
        elementId: 'consultation_form_submit',
        elementText: 'Book Consultation',
      });

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback
      }

      if (onSubmitted) {
        onSubmitted();
      }
    } catch (err: unknown) {
      // PRESERVE FORM STATE IN MEMORY - NO FAKE SUCCESS
      const msg = getSubmissionError(err, 'Consultation bookings are temporarily unavailable. Please try again later.');
      setSubmitError(msg);
      setIsSubmitted(false);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const currentAvailableServices = getServicesByCategory(formData.category);
  const selectedServiceDetails = findServiceBySlug(formData.serviceSlug);

  return (
    <div id="contact" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative bg-white dark:bg-[#071C24] transition-colors duration-300">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#E4F0EE] dark:bg-[rgba(44,207,197,0.12)] text-[#315F69] dark:text-[#79F1E8] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.25)] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Priority Consultation & Scope Inquiry</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#17252B] dark:text-[#F3FBFC]">
            Book Your Strategic Discovery Session
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#526168] dark:text-[#A8C0C6]">
            Select your category below. We dynamically configure your service scope, turnaround SLA, and assign a dedicated Senior US CPA.
          </p>
        </div>

        {/* Form Container */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.22)] shadow-2xl relative overflow-hidden">

          {isSubmitted ? (
            /* Success State */
            <div className="text-center py-12 px-4 animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 dark:bg-emerald-400/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-black/5 dark:bg-white/10 text-[#315F69] dark:text-[#79F1E8] mb-3">
                Tracking ID: {submissionReference}
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17252B] dark:text-[#F3FBFC] mb-3">
                Consultation Request Received
              </h3>

              <p className="text-sm text-[#526168] dark:text-[#A8C0C6] max-w-lg mx-auto leading-relaxed mb-6">
                Thank you, <strong>{formData.fullName}</strong>. A Senior Tax Advisory Director has received your request for <strong>{selectedServiceDetails?.name}</strong> and will reach out via {formData.preferredContactMethod} within 4 business hours.
              </p>

              <div
                role="status"
                aria-live="polite"
                className="max-w-md mx-auto mb-6 rounded-xl border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)] bg-black/5 dark:bg-[#031117]/80 p-4 text-left text-xs space-y-2"
              >
                <p className="font-bold text-[#17252B] dark:text-[#F3FBFC]">Request saved successfully.</p>
                <p className="text-[#526168] dark:text-[#A8C0C6]">
                  Customer confirmation: {emailDelivery?.customerConfirmation === 'accepted_by_smtp' ? 'accepted by email server' : 'not accepted; please contact us with your tracking ID'}.
                </p>
                {emailDelivery?.errors?.customerConfirmation && (
                  <p className="text-rose-600 dark:text-rose-300">{emailDelivery.errors.customerConfirmation}</p>
                )}
                <p className="text-[#526168] dark:text-[#A8C0C6]">
                  Owner notification: {emailDelivery?.ownerNotification === 'accepted_by_smtp' ? 'accepted by email server' : 'not accepted; our team will follow up'}.
                </p>
                {emailDelivery?.errors?.ownerNotification && (
                  <p className="text-rose-600 dark:text-rose-300">{emailDelivery.errors.ownerNotification}</p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-black/5 dark:bg-[#031117]/80 max-w-md mx-auto text-left text-xs space-y-2 mb-8 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)]">
                <div className="flex justify-between">
                  <span className="text-[#526168] dark:text-[#A8C0C6]">Client Category:</span>
                  <span className="font-bold text-[#17252B] dark:text-[#F3FBFC] capitalize">{formData.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#526168] dark:text-[#A8C0C6]">Selected Service:</span>
                  <span className="font-bold text-[#17252B] dark:text-[#F3FBFC]">{selectedServiceDetails?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#526168] dark:text-[#A8C0C6]">Target SLA:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedServiceDetails?.turnaroundTime}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => openCalendlyPopup(undefined, calendlyDynamicUrl)}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#315F69] text-white dark:bg-[#2CCFC5] dark:text-[#031117] hover:scale-105 active:scale-95 transition-all shadow-md inline-flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule a Consultation</span>
                </button>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData((prev) => ({ ...prev, message: '' }));
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-black/5 dark:bg-white/10 text-[#17252B] dark:text-[#F3FBFC] hover:scale-105 active:scale-95 transition-all"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            /* Active Form */
            <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-8">

              {/* STEP 1: CLIENT CATEGORY SELECTOR */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#17252B] dark:text-[#F3FBFC] block mb-3">
                  Step 1: Select Your Client Classification <span className="text-rose-500">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {CLIENT_CATEGORIES.map((cat) => {
                    const isSelected = formData.category === cat.id;

                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${isSelected
                          ? 'glass-panel border-[#315F69] dark:border-[#2CCFC5] shadow-md scale-[1.01]'
                          : 'bg-black/5 dark:bg-[#031117]/60 border-[#DCE5E2] dark:border-[rgba(121,241,232,0.12)] hover:border-gray-400 dark:hover:border-gray-700 opacity-80 hover:opacity-100'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-sm font-bold ${isSelected ? 'text-[#315F69] dark:text-[#79F1E8]' : 'text-[#17252B] dark:text-[#F3FBFC]'}`}>
                            {cat.label}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-[#315F69] dark:text-[#2CCFC5]" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#526168] dark:text-[#A8C0C6] leading-relaxed">
                          {cat.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: DYNAMIC SERVICE OPTIONS */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="service-select" className="text-xs font-bold uppercase tracking-wider text-[#17252B] dark:text-[#F3FBFC]">
                    Step 2: Service Offering ({formData.category === 'cpa' ? '10 CPA Outsourcing Offerings' : formData.category === 'business' ? '6 Business Offerings' : '4 Individual Offerings'}) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-[#526168] dark:text-[#A8C0C6]">
                    Filtered for {formData.category.toUpperCase()}
                  </span>
                </div>

                <select
                  id="service-select"
                  value={formData.serviceSlug}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  onBlur={(e) => validateFieldOnBlur('serviceSlug', e.target.value)}
                  aria-invalid={Boolean(errors.serviceSlug)}
                  aria-describedby={errors.serviceSlug ? 'consultation-service-error' : undefined}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium bg-black/5 dark:bg-[#031117] border ${errors.serviceSlug
                    ? 'border-rose-500'
                    : 'border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)]'
                    } text-[#17252B] dark:text-[#F3FBFC] focus:outline-none focus:ring-2 focus:ring-[#2CCFC5] transition-all`}
                >
                  {currentAvailableServices.map((srv) => (
                    <option key={srv.id} value={srv.slug} className="bg-white dark:bg-[#0D222B] text-slate-900 dark:text-slate-100">
                      {srv.name} — {srv.turnaroundTime}
                    </option>
                  ))}
                </select>
                {errors.serviceSlug && (
                  <p className="text-xs text-rose-500 mt-1" id="consultation-service-error" role="alert">{errors.serviceSlug}</p>
                )}

                {/* Service Details Preview Strip */}
                {selectedServiceDetails && (
                  <div className="mt-2.5 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.1)] text-xs flex items-center justify-between text-[#526168] dark:text-[#A8C0C6]">
                    <span className="truncate pr-2">
                      <strong className="text-[#17252B] dark:text-[#F3FBFC]">Scope: </strong>
                      {selectedServiceDetails.shortDescription}
                    </span>
                    <span className="shrink-0 font-bold text-[#315F69] dark:text-[#79F1E8]">
                      SLA: {selectedServiceDetails.turnaroundTime}
                    </span>
                  </div>
                )}
              </div>

              {/* STEP 3: CONTACT INFORMATION & DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label htmlFor="consultation-fullName" className="text-xs font-semibold text-[#17252B] dark:text-[#F3FBFC] block mb-1.5">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#526168] dark:text-[#A8C0C6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="consultation-fullName"
                      placeholder="e.g. Rachel Sterling"
                      maxLength={120}
                      required
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={errors.fullName ? 'consultation-fullName-error' : undefined}
                      value={formData.fullName}
                      onChange={(e) => updateFormField('fullName', e.target.value)}
                      onBlur={(e) => validateFieldOnBlur('fullName', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-black/5 dark:bg-[#031117] border ${errors.fullName ? 'border-rose-500' : 'border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)]'
                        } text-[#17252B] dark:text-[#F3FBFC] focus:outline-none focus:ring-2 focus:ring-[#2CCFC5]`}
                    />
                  </div>
                  {errors.fullName && <p className="text-xs text-rose-500 mt-1" id="consultation-fullName-error" role="alert">{errors.fullName}</p>}
                </div>

                {/* Work Email */}
                <div>
                  <label htmlFor="consultation-email" className="text-xs font-semibold text-[#17252B] dark:text-[#F3FBFC] block mb-1.5">
                    Work Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#526168] dark:text-[#A8C0C6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      id="consultation-email"
                      placeholder="rachel@company.com"
                      maxLength={254}
                      required
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'consultation-email-error' : undefined}
                      value={formData.email}
                      onChange={(e) => updateFormField('email', e.target.value)}
                      onBlur={(e) => validateFieldOnBlur('email', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-black/5 dark:bg-[#031117] border ${errors.email ? 'border-rose-500' : 'border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)]'
                        } text-[#17252B] dark:text-[#F3FBFC] focus:outline-none focus:ring-2 focus:ring-[#2CCFC5]`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-rose-500 mt-1" id="consultation-email-error" role="alert">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="consultation-phone" className="text-xs font-semibold text-[#17252B] dark:text-[#F3FBFC] block mb-1.5">
                    Phone / Direct Line <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#526168] dark:text-[#A8C0C6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      id="consultation-phone"
                      placeholder="(555) 234-5678"
                      maxLength={32}
                      required
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? 'consultation-phone-error' : undefined}
                      value={formData.phone}
                      onChange={(e) => updateFormField('phone', e.target.value)}
                      onBlur={(e) => validateFieldOnBlur('phone', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-black/5 dark:bg-[#031117] border ${errors.phone ? 'border-rose-500' : 'border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)]'
                        } text-[#17252B] dark:text-[#F3FBFC] focus:outline-none focus:ring-2 focus:ring-[#2CCFC5]`}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-rose-500 mt-1" id="consultation-phone-error" role="alert">{errors.phone}</p>}
                </div>

                {/* Company or Firm Name */}
                <div>
                  <label htmlFor="consultation-companyName" className="text-xs font-semibold text-[#17252B] dark:text-[#F3FBFC] block mb-1.5">
                    Company / Firm Name (Optional)
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-[#526168] dark:text-[#A8C0C6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="consultation-companyName"
                      placeholder="e.g. Sterling Capital LLC"
                      maxLength={191}
                      aria-invalid={Boolean(errors.companyName)}
                      aria-describedby={errors.companyName ? 'consultation-companyName-error' : undefined}
                      value={formData.companyName}
                      onChange={(e) => updateFormField('companyName', e.target.value)}
                      onBlur={(e) => validateFieldOnBlur('companyName', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-black/5 dark:bg-[#031117] border ${errors.companyName ? 'border-rose-500' : 'border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)]'
                        } text-[#17252B] dark:text-[#F3FBFC] focus:outline-none focus:ring-2 focus:ring-[#2CCFC5]`}
                    />
                  </div>
                  {errors.companyName && <p className="text-xs text-rose-500 mt-1" id="consultation-companyName-error" role="alert">{errors.companyName}</p>}
                </div>
              </div>

              {/* Volume & Preferred Contact Method (Email and Phone only) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="consultation-volume" className="text-xs font-semibold text-[#17252B] dark:text-[#F3FBFC] block mb-1.5">
                    Annual Revenue / Tax Volume Band
                  </label>
                  <select
                    id="consultation-volume"
                    value={formData.annualVolumeOrRevenue}
                    aria-invalid={Boolean(errors.annualVolumeOrRevenue)}
                    aria-describedby={errors.annualVolumeOrRevenue ? 'consultation-volume-error' : undefined}
                    onChange={(e) => updateFormField('annualVolumeOrRevenue', e.target.value)}
                    onBlur={(e) => validateFieldOnBlur('annualVolumeOrRevenue', e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-black/5 dark:bg-[#031117] border ${errors.annualVolumeOrRevenue ? 'border-rose-500' : 'border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)]'
                      } text-[#17252B] dark:text-[#F3FBFC] focus:outline-none focus:ring-2 focus:ring-[#2CCFC5]`}
                  >
                    <option value="Under $250K" className="bg-white dark:bg-[#0D222B] text-slate-900 dark:text-slate-100">Under $250K / Individual 1040</option>
                    <option value="$250K - $1M" className="bg-white dark:bg-[#0D222B] text-slate-900 dark:text-slate-100">$250K - $1M Revenue</option>
                    <option value="$1M - $5M" className="bg-white dark:bg-[#0D222B] text-slate-900 dark:text-slate-100">$1M - $5M Revenue</option>
                    <option value="$5M - $25M+" className="bg-white dark:bg-[#0D222B] text-slate-900 dark:text-slate-100">$5M - $25M+ Mid-Market</option>
                    <option value="CPA Firm: 50-200 Returns/yr" className="bg-white dark:bg-[#0D222B] text-slate-900 dark:text-slate-100">CPA Firm: 50-200 Returns/yr</option>
                    <option value="CPA Firm: 200-1000+ Returns/yr" className="bg-white dark:bg-[#0D222B] text-slate-900 dark:text-slate-100">CPA Firm: 200-1000+ Returns/yr</option>
                  </select>
                  {errors.annualVolumeOrRevenue && <p className="text-xs text-rose-500 mt-1" id="consultation-volume-error" role="alert">{errors.annualVolumeOrRevenue}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#17252B] dark:text-[#F3FBFC] block mb-1.5">
                    Preferred Contact Channel
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['email', 'phone'] as const).map((method) => (
                      <button
                        type="button"
                        key={method}
                        onClick={() => updateFormField('preferredContactMethod', method)}
                        aria-pressed={formData.preferredContactMethod === method}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold capitalize border transition-all ${formData.preferredContactMethod === method
                          ? 'bg-[#315F69] text-white dark:bg-[#2CCFC5] dark:text-[#031117] border-transparent shadow-sm'
                          : 'bg-black/5 dark:bg-white/5 border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)] text-[#526168] dark:text-[#A8C0C6]'
                          }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="consultation-message" className="text-xs font-semibold text-[#17252B] dark:text-[#F3FBFC] block mb-1.5">
                  Scope Requirements / Specific Deadlines (Optional)
                </label>
                <textarea
                  id="consultation-message"
                  rows={3}
                  maxLength={5000}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'consultation-message-error' : undefined}
                  placeholder="Share details on your tax entities, software in use, or required completion timeline..."
                  value={formData.message}
                  onChange={(e) => updateFormField('message', e.target.value)}
                  onBlur={(e) => validateFieldOnBlur('message', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-black/5 dark:bg-[#031117] border ${errors.message ? 'border-rose-500' : 'border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)]'
                    } text-[#17252B] dark:text-[#F3FBFC] focus:outline-none focus:ring-2 focus:ring-[#2CCFC5]`}
                />
                {errors.message && <p className="text-xs text-rose-500 mt-1" id="consultation-message-error" role="alert">{errors.message}</p>}
              </div>

              {/* Security, Privacy Policy & Confidentiality Consent Checkbox */}
              <div>
                <label className="flex items-center gap-2 text-xs text-[#526168] dark:text-[#A8C0C6] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={formData.privacyConsent}
                    aria-invalid={Boolean(errors.privacyConsent)}
                    aria-describedby={errors.privacyConsent ? 'consultation-privacy-error' : undefined}
                    onChange={(e) => updateFormField('privacyConsent', e.target.checked)}
                    onBlur={(e) => validateFieldOnBlur('privacyConsent', e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-[#2CCFC5] focus:ring-[#2CCFC5] border-[#DCE5E2] dark:border-[rgba(121,241,232,0.3)] bg-transparent cursor-pointer"
                  />
                  <Lock className="w-3.5 h-3.5 text-[#315F69] dark:text-[#79F1E8] shrink-0" />
                  <span>All submitted information is strictly protected under bilateral NDA and 256-Bit SSL encryption.</span>
                </label>
                {errors.privacyConsent && (
                  <p className="text-xs text-rose-500 mt-1" id="consultation-privacy-error" role="alert">{errors.privacyConsent}</p>
                )}
              </div>

              {/* Submit Error Warning */}
              {submitError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{submitError}</span>
                </div>
              )}

              {!isFullyAvailable && !submitError && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Consultation bookings are temporarily unavailable. Please try again later.</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || !isFullyAvailable}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold bg-[#315F69] hover:bg-[#254B53] text-white dark:bg-[#2CCFC5] dark:hover:bg-[#79F1E8] dark:text-[#031117] hover:shadow-[0_0_25px_-4px_rgba(44,207,197,0.45)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Processing Scope Request...</span>
                  </div>
                ) : !isFullyAvailable ? (
                  <span>Bookings Unavailable (Backend Offline)</span>
                ) : (
                  <>
                    <span>Confirm Consultation & Scope Request</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
