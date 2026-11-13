export interface CustomFormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'number';
  placeholder?: string;
  required: boolean;
  enabled: boolean;
  order: number;
  options?: string[]; // for select type
  helpText?: string;
}

export interface ServiceCalendlyMapping {
  serviceSlug: string;
  serviceName: string;
  calendlyUrl: string;
  assignedProfessional?: string;
  durationMinutes: number;
  consultationType: 'online' | 'phone' | 'in_person' | 'any';
}

export interface ConsultationSettingsData {
  // 1. Calendly Core Configuration
  calendlyEnabled: boolean;
  defaultCalendlyUrl: string;
  calendlyEventType: string;
  defaultDurationMinutes: number;
  defaultTimezone: string;
  bookingDisplayMode: 'popup' | 'inline' | 'redirect';
  autoConfirmBooking: boolean;
  calendlyApiToken?: string;
  connectionStatus?: 'verified' | 'untested' | 'error';
  lastTestedAt?: string;

  // 2. Consultation Content & Public Copy
  bookButtonText: string;
  headerEyebrow: string;
  headerTitle: string;
  headerDescription: string;
  popupHeading: string;
  popupSubheading: string;
  popupDelaySeconds: number;
  bookingInstructions: string;
  confirmationHeading: string;
  confirmationMessage: string;
  cancellationPolicyNotice: string;
  reschedulingInstructions: string;
  directAdvisorAccessText: string;
  ndaConfidentialityText: string;

  // 3. Form Management
  formTitle: string;
  formSubtitle: string;
  step1Label: string;
  step2Label: string;
  step3Label: string;
  customFields: CustomFormField[];
  formSuccessMessage: string;
  validationErrorMessage: string;

  // 4. Service-Specific Calendly Links
  serviceMappings: ServiceCalendlyMapping[];

  // 5. Email Notification Settings
  customerEmailSubject: string;
  customerEmailTemplate: string;
  adminNotificationEmail: string;
  cancellationNoticeSubject: string;
  cancellationNoticeTemplate: string;
  rescheduleNoticeSubject: string;
  rescheduleNoticeTemplate: string;
}

export const defaultConsultationSettings: ConsultationSettingsData = {
  // 1. Calendly
  calendlyEnabled: true,
  defaultCalendlyUrl: 'https://calendly.com/smarttaxexperts/strategic-consultation',
  calendlyEventType: '30-Minute Discovery Session',
  defaultDurationMinutes: 30,
  defaultTimezone: 'America/New_York (EST)',
  bookingDisplayMode: 'popup',
  autoConfirmBooking: true,
  calendlyApiToken: '',
  connectionStatus: 'untested',

  // 2. Content
  bookButtonText: 'Book Strategic Consultation',
  headerEyebrow: 'Priority Consultation & Scope Inquiry',
  headerTitle: 'Book Your Strategic Discovery Session',
  headerDescription: 'Select your category below. We dynamically configure your service scope, turnaround SLA, and assign a dedicated Senior US CPA.',
  popupHeading: 'Book an Instant Call',
  popupSubheading: 'Have questions about your tax needs? Schedule a quick discovery session with our senior advisory team.',
  popupDelaySeconds: 15,
  bookingInstructions: 'Select your preferred time slot on our live calendar. A meeting link will be automatically generated and dispatched to your email.',
  confirmationHeading: 'Consultation Request Confirmed',
  confirmationMessage: 'Our senior practice directors have received your scope requirements and will reach out to confirm your discovery meeting within 4 business hours.',
  cancellationPolicyNotice: 'Please provide at least 24 hours notice for rescheduling or cancellations to allow partner slot reallocations.',
  reschedulingInstructions: 'You can modify your meeting slot via the rescheduling link in your confirmation email or by contacting your assigned CPA directly.',
  directAdvisorAccessText: '15-min discovery call · No obligation',
  ndaConfidentialityText: 'All submitted information is strictly protected under bilateral NDA and 256-Bit SSL encryption.',

  // 3. Form Management
  formTitle: 'Strategic Scope Inquiry Form',
  formSubtitle: 'Structured consultation request intake',
  step1Label: 'Step 1: Select Your Client Classification',
  step2Label: 'Step 2: Service Offering',
  step3Label: 'Step 3: Contact & Scope Specifications',
  customFields: [
    { id: 'f-name', name: 'fullName', label: 'Your Full Name', type: 'text', placeholder: 'e.g. Rachel Sterling', required: true, enabled: true, order: 1 },
    { id: 'f-email', name: 'email', label: 'Work Email Address', type: 'email', placeholder: 'rachel@company.com', required: true, enabled: true, order: 2 },
    { id: 'f-phone', name: 'phone', label: 'Phone / Direct Line', type: 'tel', placeholder: '(555) 234-5678', required: true, enabled: true, order: 3 },
    { id: 'f-company', name: 'companyName', label: 'Company / Firm Name (Optional)', type: 'text', placeholder: 'e.g. Sterling Capital LLC', required: false, enabled: true, order: 4 },
    { id: 'f-revenue', name: 'annualRevenue', label: 'Annual Revenue / Tax Volume Band', type: 'select', required: false, enabled: true, order: 5, options: ['Under $250K / Individual 1040', '$250K - $1M Revenue', '$1M - $5M Revenue', '$5M - $25M+ Mid-Market', 'CPA Firm: 50-200 Returns/yr', 'CPA Firm: 200-1000+ Returns/yr'] },
    { id: 'f-message', name: 'message', label: 'Scope Requirements / Specific Deadlines', type: 'textarea', placeholder: 'Share details on your tax entities, software in use, or required timeline...', required: false, enabled: true, order: 6 },
  ],
  formSuccessMessage: 'Thank you. Your consultation request has been successfully recorded in our priority queue.',
  validationErrorMessage: 'Please fill out all required fields marked with an asterisk (*).',

  // 4. Service Mappings
  serviceMappings: [
    {
      serviceSlug: 'tax-prep-outsourcing',
      serviceName: 'Tax Preparation Outsourcing',
      calendlyUrl: 'https://calendly.com/smarttaxexperts/cpa-tax-outsourcing',
      assignedProfessional: 'David Miller, Senior CPA',
      durationMinutes: 45,
      consultationType: 'online',
    },
    {
      serviceSlug: 'corporate-tax-planning',
      serviceName: 'Corporate Tax Planning & Advisory',
      calendlyUrl: 'https://calendly.com/smarttaxexperts/corporate-tax-planning',
      assignedProfessional: 'Sarah Jenkins, Partner',
      durationMinutes: 60,
      consultationType: 'online',
    },
    {
      serviceSlug: 'individual-tax-compliance',
      serviceName: 'High Net Worth & Individual 1040',
      calendlyUrl: 'https://calendly.com/smarttaxexperts/individual-tax',
      assignedProfessional: 'Elena Rostova, EA',
      durationMinutes: 30,
      consultationType: 'phone',
    },
    {
      serviceSlug: 'gst-international-crossborder',
      serviceName: 'International & Cross-Border Tax Structuring',
      calendlyUrl: 'https://calendly.com/smarttaxexperts/cross-border-tax',
      assignedProfessional: 'Michael Chen, Director',
      durationMinutes: 45,
      consultationType: 'online',
    },
  ],

  // 5. Notifications
  customerEmailSubject: 'Strategic Consultation Confirmed [Ref: {{referenceNo}}] - Smart Tax Experts',
  customerEmailTemplate: 'Dear {{fullName}},\n\nThank you for booking your strategic discovery session with Smart Tax Experts. Our senior directors have reviewed your requirements for {{serviceName}}.\n\nNext Steps: A Senior US CPA will reach out via {{preferredContactMethod}} within 4 business hours to finalize your scope.\n\nBest regards,\nSmart Tax Experts Leadership',
  adminNotificationEmail: 'advisory@smarttaxexperts.com',
  cancellationNoticeSubject: 'Notice: Consultation Request Cancelled [Ref: {{referenceNo}}]',
  cancellationNoticeTemplate: 'Dear {{fullName}},\n\nYour consultation request has been cancelled as per your request.\nReason: {{reason}}\n\nIf you wish to reschedule in the future, please visit our booking portal.\n\nSmart Tax Experts Team',
  rescheduleNoticeSubject: 'Update: Consultation Rescheduled [Ref: {{referenceNo}}]',
  rescheduleNoticeTemplate: 'Dear {{fullName}},\n\nYour consultation appointment has been updated to {{appointmentDate}} at {{appointmentTime}}.\n\nMeeting link: {{meetingLocation}}\nAssigned Advisor: {{assignedAdminName}}',
};

