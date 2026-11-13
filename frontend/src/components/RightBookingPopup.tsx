import React, { useState, useEffect } from 'react';
import { Calendar, X, ArrowRight, Clock, Mail, CheckCircle2, Loader2, Phone, User } from 'lucide-react';
import { openCalendlyPopup } from './CalendlyWidget';
import { useGlobalSettings } from '../context/GlobalSettingsContext';
import { consultationsApi } from '../api/inquiries';

interface RightBookingPopupProps {
  delaySeconds?: number;
}

export function RightBookingPopup({ delaySeconds = 15 }: RightBookingPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showDirectForm, setShowDirectForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    try {
      const alreadyDismissed = sessionStorage.getItem('ste_booking_popup_dismissed');
      if (alreadyDismissed === 'true') {
        setIsDismissed(true);
        return;
      }
    } catch {
      // sessionStorage unavailable
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delaySeconds * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [delaySeconds]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    try {
      sessionStorage.setItem('ste_booking_popup_dismissed', 'true');
    } catch {
      // Ignore
    }
  };

  const { settings } = useGlobalSettings();
  const calendlyDynamicUrl = settings.consultationSettings?.defaultCalendlyUrl;

  const handleOpenCalendly = () => {
    openCalendlyPopup(undefined, calendlyDynamicUrl);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');

    try {
      await consultationsApi.submit({
        fullName: formData.name.trim() || 'Website Visitor',
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || '+1 555-019-2834',
        serviceSlug: 'instant-call-request',
        serviceName: 'Instant Call Consultation',
        category: 'business',
        annualVolumeOrRevenue: 'standard',
        preferredContactMethod: 'email',
        message: 'Instant Call Consultation Request submitted from website popup. Please schedule date & time with client.',
        sourcePage: window.location.pathname,
        privacyConsent: true,
      });
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <aside
      aria-label="Instant consultation scheduling invitation"
      role="complementary"
      className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-[340px] sm:max-w-[360px] w-[calc(100vw-32px)] transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-6"
    >
      <div className="relative p-5 sm:p-6 rounded-2xl bg-white/95 dark:bg-[#071C25]/95 backdrop-blur-xl border border-[#27C177]/40 dark:border-[#35E092]/30 shadow-2xl shadow-black/15 dark:shadow-black/50 text-[#12242B] dark:text-[#F4FBFC]">
        {/* Subtle top accent bar */}
        <div className="absolute top-0 left-6 right-6 h-1 rounded-b bg-gradient-to-r from-[#22AF68] via-[#35E092] to-[#27C177]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close booking invitation"
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-[#64748B] hover:text-[#12242B] dark:text-[#8AA3A8] dark:hover:text-[#F4FBFC] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-[#27C177]/15 dark:bg-[#35E092]/15 text-[#1E9457] dark:text-[#35E092] flex items-center justify-center shrink-0 border border-[#27C177]/25">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#1E9457] dark:text-[#35E092] mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#35E092] animate-pulse" />
              <span>Direct Advisor Access</span>
            </div>
            <h3 className="text-base font-bold leading-tight text-[#12242B] dark:text-[#F4FBFC]">
              Book an Instant Call
            </h3>
          </div>
        </div>

        {submitted ? (
          <div className="py-3 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#27C177]/20 text-[#1E9457] dark:text-[#35E092] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[#12242B] dark:text-white">Request Sent to Admin!</h4>
            <p className="text-xs text-[#526168] dark:text-[#A8C0C6] leading-relaxed">
              Our advisory team has received your details and will assign a Senior CPA, set your appointment time, and send your meeting confirmation email.
            </p>
            <button
              type="button"
              onClick={handleDismiss}
              className="mt-3 px-4 py-1.5 text-xs font-semibold rounded-lg bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-black/10"
            >
              Done
            </button>
          </div>
        ) : showDirectForm ? (
          <form onSubmit={handleSubmitRequest} className="space-y-2.5 my-2">
            <p className="text-[11px] text-[#526168] dark:text-[#A8C0C6] leading-relaxed">
              Submit your email. Our admin team will schedule your consultation date &amp; time and email you the meeting link.
            </p>

            {errorMsg && (
              <div className="text-[11px] text-red-500 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                {errorMsg}
              </div>
            )}

            <div>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-lg text-xs bg-black/5 dark:bg-[#031117] border border-teal-500/30 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="Your Email Address *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-lg text-xs bg-black/5 dark:bg-[#031117] border border-teal-500/30 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="tel"
                  placeholder="Phone Number (optional)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-lg text-xs bg-black/5 dark:bg-[#031117] border border-teal-500/30 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowDirectForm(false)}
                className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-black/10"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#17383F] hover:bg-[#0E262B] text-white dark:bg-[#27C177] dark:hover:bg-[#35E092] dark:text-[#051917] shadow transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send to Admin</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="text-xs text-[#526168] dark:text-[#A8C0C6] leading-relaxed mb-4">
              Have questions about your tax needs? Schedule a consultation with our team.
            </p>

            <div className="flex items-center gap-2 mb-4 text-[11px] text-[#64748B] dark:text-[#8AA3A8]">
              <Clock className="w-3.5 h-3.5 text-[#27C177] shrink-0" />
              <span>15-min discovery call · No obligation</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowDirectForm(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#17383F] hover:bg-[#0E262B] text-white dark:bg-[#27C177] dark:hover:bg-[#35E092] dark:text-[#051917] shadow-md hover:shadow-lg transition-all group"
              >
                <span>Request Call &amp; Get Scheduled</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleOpenCalendly}
                className="w-full text-center text-[11px] text-slate-500 hover:text-teal-500 dark:text-slate-400 dark:hover:text-[#35E092] py-1 transition-colors"
              >
                Or pick a time directly on Calendly &rarr;
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
