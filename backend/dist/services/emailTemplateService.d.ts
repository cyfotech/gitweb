/**
 * Smart Tax Expert — Premium 3D-Inspired Branded Email Templates.
 *
 * Modern, professional email designs matching the website's visual identity.
 * Features: STE logo header, emerald/mint/charcoal palette, elegant gradients,
 * depth with shadows, modern typography, responsive layout.
 * Compatible with Gmail, Outlook, and mobile devices.
 * Templates are returned as full HTML strings with inline CSS.
 */
export interface BrandContext {
    businessName: string;
    businessEmail: string;
    websiteUrl: string;
    calendlyUrl: string;
    logoUrl: string;
}
export declare function getBrandContext(): BrandContext;
interface InquiryEmailData {
    customerName: string;
    referenceNumber: string;
    serviceName?: string;
    nextSteps?: string;
    formName?: string;
    submittedAt?: string;
    summary?: {
        label: string;
        value: string;
    }[];
    message?: string;
}
/** Customer confirmation for a general website enquiry / consultation request. */
export declare function buildCustomerConfirmation(data: InquiryEmailData, brand?: BrandContext): string;
export interface OwnerNotificationData {
    referenceNumber: string;
    sourcePage?: string;
    fields: {
        label: string;
        value: string;
    }[];
    message?: string;
    formName?: string;
}
/** Owner notification with the complete enquiry details. */
export declare function buildOwnerNotification(data: OwnerNotificationData, brand?: BrandContext): string;
export interface AppointmentEmailData {
    customerName: string;
    customerEmail: string;
    appointmentDate: string;
    appointmentTime: string;
    durationMinutes: string;
    meetingLocation: string;
    meetingUrl: string;
    referenceNumber: string;
}
/** Appointment confirmation (sent to customer and owner after Calendly booking). */
export declare function buildAppointmentConfirmation(data: AppointmentEmailData, brand?: BrandContext): string;
/** Appointment cancellation notification. */
export declare function buildAppointmentCancellation(data: AppointmentEmailData, brand?: BrandContext): string;
export declare function buildAdminReplyEmail(data: {
    message: string;
    referenceNumber: string;
}, brand?: BrandContext): string;
interface CareerApplicationData {
    customerName: string;
    customerEmail: string;
    position: string;
    referenceNumber: string;
    submittedAt: string;
    applicationDetails?: {
        label: string;
        value: string;
    }[];
    coverLetter?: string;
    nextSteps?: string;
}
/** Customer confirmation email for career application submission. */
export declare function buildCareerApplicationConfirmation(data: CareerApplicationData, brand?: BrandContext): string;
/** Owner/admin notification for new career application. */
export declare function buildCareerApplicationNotification(data: CareerApplicationData, brand?: BrandContext): string;
export {};
