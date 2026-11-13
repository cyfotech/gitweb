/**
 * Admin-Controlled Email Template Service
 *
 * Manages editable email templates for all website forms with variable substitution.
 * Supports: Contact Us, Consultation Request, CPA Services Inquiry, Other Enquiries, Blog Inquiry
 */
import { BrandContext } from './emailTemplateService';
export type FormType = 'contact' | 'consultation' | 'services_enquiry' | 'other_enquiries' | 'blog';
export interface EmailTemplateData {
    id: string;
    formType: string;
    subject: string;
    greeting: string;
    message: string;
    footer: string;
    branding: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface TemplateVariable {
    [key: string]: string | number | undefined | FieldData | FieldData[];
}
export interface FieldData {
    label: string;
    value: string | number | undefined;
}
/**
 * Substitute template variables with actual values
 */
export declare function substituteVariables(template: string, variables: TemplateVariable): string;
/**
 * Get all email templates
 */
export declare function getAllTemplates(): Promise<EmailTemplateData[]>;
/**
 * Get template by form type
 */
export declare function getTemplateByFormType(formType: FormType): Promise<EmailTemplateData | null>;
/**
 * Create or update a template
 */
export declare function upsertTemplate(formType: FormType, data: {
    subject: string;
    greeting: string;
    message: string;
    footer: string;
    branding?: string | null;
    isActive?: boolean;
}): Promise<EmailTemplateData>;
/**
 * Seed default templates into database
 */
export declare function seedDefaultTemplates(): Promise<void>;
/**
 * Build customer confirmation email from admin-controlled template
 */
export declare function buildCustomerEmailFromTemplate(formType: FormType, variables: TemplateVariable, brand?: BrandContext): Promise<{
    subject: string;
    html: string;
} | null>;
/**
 * Build owner notification email from template
 */
export declare function buildOwnerEmailFromTemplate(formType: FormType, variables: TemplateVariable, brand?: BrandContext): Promise<{
    subject: string;
    html: string;
} | null>;
