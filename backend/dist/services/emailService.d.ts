export interface EmailSendResult {
    success: boolean;
    error?: string;
}
export interface SendEmailInput {
    to: string;
    subject: string;
    html: string;
    text?: string;
    replyTo?: string;
}
export declare function isValidEmail(value: string): boolean;
export declare function sendEmail(input: SendEmailInput): Promise<EmailSendResult>;
export declare function verifySmtpConnection(): Promise<EmailSendResult>;
export declare function getOwnerEmail(): string;
export declare function closeEmailTransport(): void;
