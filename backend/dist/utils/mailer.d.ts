export interface FormEmailField {
    label: string;
    value: string;
}
export interface FormSubmissionEmail {
    formName: string;
    referenceNumber: string;
    customerName: string;
    customerEmail: string;
    fields: FormEmailField[];
    message?: string;
    sourcePage: string;
    submittedAt: Date;
}
export interface FormEmailResult {
    customerSent: boolean;
    ownerSent: boolean;
    error?: string;
}
export declare function sendFormSubmissionEmails(data: FormSubmissionEmail): Promise<FormEmailResult>;
interface ConsultationNotificationData {
    referenceNo: string;
    fullName: string;
    email: string;
    phone: string;
    companyName?: string | null;
    category: string;
    serviceName: string;
    annualVolumeOrRevenue?: string | null;
    preferredContactMethod?: string | null;
    message?: string | null;
    createdAt: Date;
}
export declare function sendConsultationEmails(data: ConsultationNotificationData): Promise<FormEmailResult>;
export interface CareerApplicationData {
    fullName: string;
    email: string;
    phone: string;
    position: string;
    companyName?: string | null;
    experienceLevel?: string | null;
    yearsExperience: number;
    relevantSkills: string;
    softwareKnowledge?: string | null;
    coverLetter?: string | null;
    additionalInfo?: string | null;
    applicationDate: Date;
    resumeName?: string | null;
}
export declare function sendCareerApplicationEmails(data: CareerApplicationData, applicationId?: string): Promise<{
    customerSent: boolean;
    ownerSent: boolean;
    error?: string;
}>;
export {};
