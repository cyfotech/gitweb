"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = isValidEmail;
exports.sendEmail = sendEmail;
exports.verifySmtpConnection = verifySmtpConnection;
exports.getOwnerEmail = getOwnerEmail;
exports.closeEmailTransport = closeEmailTransport;
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../utils/logger");
let transporter = null;
const SMTP_RETRY_DELAYS_MS = [500, 1500, 4000];
const RETRYABLE_CONNECTION_ERRORS = new Set([
    'ECONNECTION',
    'ECONNREFUSED',
    'ECONNRESET',
    'EAI_AGAIN',
    'ESOCKET',
    'ETIMEDOUT',
]);
function getSmtpConfig() {
    const host = (process.env.SMTP_HOST || process.env.EMAIL_HOST)?.trim();
    const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
    const user = (process.env.SMTP_USER || process.env.EMAIL_HOST_USER)?.trim();
    const password = (process.env.SMTP_PASSWORD || process.env.SMTP_PASS || process.env.EMAIL_HOST_PASSWORD)?.replace(/\s/g, '');
    if (!host || !user || !password || !Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error('SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD.');
    }
    return { host, port, user, password };
}
function getTransporter() {
    if (transporter)
        return transporter;
    const { host, port, user, password } = getSmtpConfig();
    transporter = nodemailer_1.default.createTransport({
        host,
        port,
        secure: port === 465,
        requireTLS: port === 587,
        auth: { user, pass: password },
        tls: { minVersion: 'TLSv1.2' },
        pool: true,
        maxConnections: 3,
        maxMessages: 100,
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 30000,
        logger: false,
        debug: false,
    });
    return transporter;
}
function getFromAddress() {
    const { user } = getSmtpConfig();
    const address = process.env.SMTP_FROM_EMAIL?.trim() || process.env.DEFAULT_FROM_EMAIL?.replace(/.*<([^>]+)>.*/, '$1').trim() || user;
    const name = process.env.SMTP_FROM_NAME?.trim() || 'STE Smart Tax Experts';
    if (!isValidEmail(address) || /[\r\n]/.test(name)) {
        throw new Error('SMTP sender configuration is invalid.');
    }
    return { name, address };
}
function isValidEmail(value) {
    return value.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
}
function safeSubject(value) {
    return value.length > 0 && value.length <= 200 && !/[\r\n]/.test(value);
}
function htmlToText(html) {
    return html
        .replace(/<\s*br\s*\/?>/gi, '\n')
        .replace(/<\/(p|div|tr|h[1-6])\s*>/gi, '\n')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}
function getLogoAttachment() {
    const logoPaths = [
        path_1.default.resolve(__dirname, '../../../frontend/public/assets/aistudio/ste_logo_light.png'),
        path_1.default.resolve(__dirname, '../../../frontend/public/uploads/media/ste_logo_light.png'),
        path_1.default.resolve(__dirname, '../../../frontend/public/assets/aistudio/ste_logo_light_native.png'),
    ];
    for (const logoPath of logoPaths) {
        if (fs_1.default.existsSync(logoPath)) {
            return [{
                    filename: 'smart-tax-experts-logo.png',
                    path: logoPath,
                    cid: 'preferred-tax-logo',
                    contentType: 'image/png',
                }];
        }
    }
    console.warn('[Email] STE logo not found in any expected location. Email will use text header only.');
    return [];
}
async function sendEmail(input) {
    if (!isValidEmail(input.to) || (input.replyTo && !isValidEmail(input.replyTo))) {
        return { success: false, error: 'Email recipient is invalid.' };
    }
    if (!safeSubject(input.subject)) {
        return { success: false, error: 'Email subject is invalid.' };
    }
    for (let attempt = 0;; attempt += 1) {
        try {
            const info = await getTransporter().sendMail({
                from: getFromAddress(),
                to: input.to,
                replyTo: input.replyTo,
                subject: input.subject,
                html: input.html,
                text: input.text || htmlToText(input.html),
                attachments: getLogoAttachment(),
            });
            logger_1.logger.info('Message accepted by SMTP server', {
                messageId: info.messageId,
                recipientDomain: input.to.split('@')[1],
                attempt: attempt + 1,
            });
            return { success: true, messageId: info.messageId };
        }
        catch (error) {
            const responseCode = error && typeof error === 'object' && 'responseCode' in error
                ? Number(error.responseCode)
                : undefined;
            const errorCode = error && typeof error === 'object' && 'code' in error
                ? String(error.code)
                : '';
            const command = error && typeof error === 'object' && 'command' in error
                ? String(error.command)
                : '';
            const isTemporaryRejection = responseCode !== undefined &&
                Number.isInteger(responseCode) &&
                responseCode >= 400 &&
                responseCode < 500;
            const isSafeConnectionRetry = RETRYABLE_CONNECTION_ERRORS.has(errorCode) &&
                (!command || /^(CONN|CONNECT|GREETING|STARTTLS)$/i.test(command));
            if ((isTemporaryRejection || isSafeConnectionRetry) && attempt < SMTP_RETRY_DELAYS_MS.length) {
                const delay = SMTP_RETRY_DELAYS_MS[attempt];
                console.warn('[Email] SMTP temporary failure; retrying message', {
                    code: errorCode || undefined,
                    responseCode,
                    command: command || undefined,
                    attempt: attempt + 1,
                    delayMs: delay,
                    recipientDomain: input.to.split('@')[1],
                });
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            const details = error && typeof error === 'object'
                ? {
                    code: 'code' in error ? String(error.code) : 'SMTP_ERROR',
                    command: 'command' in error ? String(error.command) : undefined,
                    responseCode,
                    attempt: attempt + 1,
                    message: 'message' in error ? String(error.message).replace(/[\r\n]/g, ' ').slice(0, 200) : undefined,
                }
                : { code: 'SMTP_ERROR', attempt: attempt + 1 };
            logger_1.logger.error('SMTP delivery failed', details);
            const failureCode = responseCode ? `SMTP ${responseCode}` : details.code;
            return {
                success: false,
                error: `SMTP did not accept this email (${failureCode}). Check the backend email logs.`,
            };
        }
    }
}
async function verifySmtpConnection() {
    try {
        await getTransporter().verify();
        return { success: true };
    }
    catch (error) {
        const details = error && typeof error === 'object'
            ? {
                code: 'code' in error ? String(error.code) : 'SMTP_ERROR',
                command: 'command' in error ? String(error.command) : undefined,
                responseCode: 'responseCode' in error ? Number(error.responseCode) : undefined,
                message: 'message' in error ? String(error.message).replace(/[\r\n]/g, ' ').slice(0, 200) : undefined,
            }
            : { code: 'SMTP_ERROR' };
        logger_1.logger.error('SMTP connection verification failed', details);
        return { success: false, error: 'SMTP connection verification failed. Check the backend SMTP configuration and logs.' };
    }
}
function getOwnerEmail() {
    return (process.env.ADMIN_NOTIFICATION_EMAIL?.trim() ||
        process.env.OWNER_EMAIL?.trim() ||
        process.env.SMTP_USER?.trim() ||
        process.env.EMAIL_HOST_USER?.trim() ||
        'pauravshah2@gmail.com');
}
function closeEmailTransport() {
    transporter?.close();
    transporter = null;
}
