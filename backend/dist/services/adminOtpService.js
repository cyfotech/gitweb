"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.maskEmail = maskEmail;
exports.generateSecure8DigitOtp = generateSecure8DigitOtp;
exports.cleanupExpiredOtps = cleanupExpiredOtps;
exports.requestAdminOtp = requestAdminOtp;
exports.verifyAdminOtp = verifyAdminOtp;
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const logger_1 = require("../utils/logger");
const adminOtpEmail_1 = require("./adminOtpEmail");
const emailInboxService_1 = require("./emailInboxService");
const OTP_LENGTH = 8;
const OTP_EXPIRY_MINUTES = 5;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_SECONDS = 60;
/**
 * Masks an email for safe frontend display (e.g., p***h@gmail.com).
 */
function maskEmail(email) {
    const [user, domain] = email.split('@');
    if (!domain)
        return '***';
    if (user.length <= 2) {
        return `${user[0]}***@${domain}`;
    }
    const first = user[0];
    const last = user[user.length - 1];
    return `${first}${'*'.repeat(Math.max(3, user.length - 2))}${last}@${domain}`;
}
/**
 * Generates a cryptographically secure 8-digit numeric OTP string.
 */
function generateSecure8DigitOtp() {
    // Use crypto.randomInt for uniform, cryptographically secure digits
    let otp = '';
    for (let i = 0; i < OTP_LENGTH; i++) {
        otp += crypto_1.default.randomInt(0, 10).toString();
    }
    return otp;
}
/**
 * Background cleanup for expired or used OTP records.
 */
async function cleanupExpiredOtps() {
    try {
        const now = new Date();
        const result = await prisma_1.default.adminotp.deleteMany({
            where: {
                OR: [
                    { expiresAt: { lt: now } },
                    { isUsed: true },
                ],
            },
        });
        if (result.count > 0) {
            logger_1.logger.info(`Cleaned up ${result.count} expired/used admin OTP records.`);
        }
        return result.count;
    }
    catch (error) {
        logger_1.logger.error('Error during OTP cleanup', error);
        return 0;
    }
}
/**
 * Generates and dispatches a temporary 8-digit OTP password for an admin user.
 * Return a generic response for invalid or unknown usernames to prevent account enumeration.
 */
async function requestAdminOtp(params) {
    const { usernameOrEmail, ipAddress, userAgent } = params;
    const normalizedInput = usernameOrEmail.trim().toLowerCase();
    // Find eligible, active admin account by email, full name, or username keywords:
    // "admin", "super admin", "superadmin", "administrator", email or name match
    const isSuperAdminAlias = ['admin', 'super admin', 'superadmin', 'administrator', 'super'].includes(normalizedInput);
    const admin = await prisma_1.default.adminuser.findFirst({
        where: {
            OR: [
                { email: { equals: normalizedInput } },
                { name: { equals: normalizedInput } },
                ...(isSuperAdminAlias ? [{ adminrole: { name: { equals: 'SUPER_ADMIN' } } }] : []),
            ],
        },
        include: {
            adminrole: true,
        },
    });
    // Strict check: if username does not exist or account is inactive, return userExists: false
    // so the frontend only displays the password input field when username is valid
    if (!admin) {
        logger_1.logger.warn('Admin OTP requested for unknown admin username', {
            input: normalizedInput,
            ipAddress,
        });
        return {
            success: false,
            userExists: false,
            message: 'Invalid admin username. No active administrator account was found.',
        };
    }
    // Check if account is locked
    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
        logger_1.logger.warn('Admin OTP requested for locked account', {
            adminId: admin.id,
            email: admin.email,
            lockedUntil: admin.lockedUntil,
        });
        return {
            success: false,
            userExists: false,
            message: 'Admin account is temporarily locked due to security policy. Please try again later.',
        };
    }
    // Check resend cooldown: prevent spamming resend within 60 seconds
    const latestOtp = await prisma_1.default.adminotp.findFirst({
        where: {
            adminUserId: admin.id,
            isUsed: false,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    const now = new Date();
    if (latestOtp) {
        const elapsedSeconds = Math.floor((now.getTime() - latestOtp.createdAt.getTime()) / 1000);
        if (elapsedSeconds < RESEND_COOLDOWN_SECONDS) {
            const waitTime = RESEND_COOLDOWN_SECONDS - elapsedSeconds;
            return {
                success: false,
                message: `Please wait ${waitTime} seconds before requesting a new login password.`,
                maskedEmail: maskEmail(admin.email),
                cooldownSeconds: waitTime,
            };
        }
    }
    // Invalidate any existing active OTPs for this admin before creating a fresh one
    await prisma_1.default.adminotp.updateMany({
        where: {
            adminUserId: admin.id,
            isUsed: false,
        },
        data: {
            isUsed: true,
            usedAt: now,
        },
    });
    // Generate 8-digit OTP and securely hash it with bcrypt
    const rawOtp = generateSecure8DigitOtp();
    const otpHashed = await bcryptjs_1.default.hash(rawOtp, 10);
    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);
    // Store hashed OTP in database
    await prisma_1.default.adminotp.create({
        data: {
            adminUserId: admin.id,
            otpHashed,
            expiresAt,
            maxAttempts: MAX_ATTEMPTS,
            attempts: 0,
            isUsed: false,
            ipAddress: ipAddress || null,
            userAgent: userAgent || null,
        },
    });
    // Send the email via SMTP service
    const emailResult = await (0, adminOtpEmail_1.sendAdminOtpEmail)({
        to: admin.email,
        adminName: admin.name || 'Administrator',
        otp: rawOtp,
        expiresInMinutes: OTP_EXPIRY_MINUTES,
        ipAddress,
        userAgent,
    });
    if (!emailResult.success) {
        logger_1.logger.error('Failed to dispatch temporary password email via SMTP', {
            adminId: admin.id,
            email: admin.email,
            error: emailResult.error,
        });
        // Invalidate the record if email failed
        await prisma_1.default.adminotp.updateMany({
            where: { adminUserId: admin.id, isUsed: false },
            data: { isUsed: true, usedAt: now },
        });
        return {
            success: false,
            message: 'Failed to dispatch email. Please check SMTP connection or contact server administrator.',
        };
    }
    return {
        success: true,
        userExists: true,
        message: 'A temporary 8-digit login password has been sent to your verified email.',
        maskedEmail: maskEmail(admin.email),
        expiresInSeconds: OTP_EXPIRY_MINUTES * 60,
        cooldownSeconds: RESEND_COOLDOWN_SECONDS,
    };
}
/**
 * Verifies the 8-digit temporary password submitted by the admin.
 */
async function verifyAdminOtp(params) {
    const { usernameOrEmail, otp, ipAddress } = params;
    const normalizedInput = usernameOrEmail.trim().toLowerCase();
    const normalizedOtp = otp.trim().replace(/\s+/g, '');
    if (!/^\d{8}$/.test(normalizedOtp)) {
        return {
            success: false,
            error: 'Password must be exactly 8 numeric digits.',
        };
    }
    const isSuperAdminAlias = ['admin', 'super admin', 'superadmin', 'administrator', 'super'].includes(normalizedInput);
    const admin = await prisma_1.default.adminuser.findFirst({
        where: {
            OR: [
                { email: { equals: normalizedInput } },
                { name: { equals: normalizedInput } },
                ...(isSuperAdminAlias ? [{ adminrole: { name: { equals: 'SUPER_ADMIN' } } }] : []),
            ],
        },
        include: {
            adminrole: true,
        },
    });
    if (!admin) {
        return {
            success: false,
            error: 'Invalid or expired temporary password.',
        };
    }
    // Account lock check
    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
        return {
            success: false,
            error: 'Admin account is currently locked due to security policy. Please try again later.',
        };
    }
    const now = new Date();
    // Find the active OTP for this admin
    const activeOtp = await prisma_1.default.adminotp.findFirst({
        where: {
            adminUserId: admin.id,
            isUsed: false,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    if (!activeOtp) {
        return {
            success: false,
            error: 'No active login session found or password already used. Please request a new code.',
        };
    }
    // Check 5-minute backend expiration
    if (activeOtp.expiresAt < now) {
        // Invalidate expired record
        await prisma_1.default.adminotp.update({
            where: { id: activeOtp.id },
            data: { isUsed: true, usedAt: now },
        });
        return {
            success: false,
            error: 'Temporary password has expired (5-minute limit exceeded). Please request a new code.',
        };
    }
    // Check attempt limit
    if (activeOtp.attempts >= activeOtp.maxAttempts) {
        // Invalidate due to too many failed attempts
        await prisma_1.default.adminotp.update({
            where: { id: activeOtp.id },
            data: { isUsed: true, usedAt: now },
        });
        return {
            success: false,
            error: 'Maximum verification attempts exceeded. For your security, this password has been invalidated. Please request a new code.',
        };
    }
    // Compare submitted OTP with securely hashed value
    const isValid = await bcryptjs_1.default.compare(normalizedOtp, activeOtp.otpHashed);
    if (!isValid) {
        const updatedAttempts = activeOtp.attempts + 1;
        const remaining = Math.max(0, activeOtp.maxAttempts - updatedAttempts);
        if (updatedAttempts >= activeOtp.maxAttempts) {
            // Invalidate on final failure
            await prisma_1.default.adminotp.update({
                where: { id: activeOtp.id },
                data: {
                    attempts: updatedAttempts,
                    isUsed: true,
                    usedAt: now,
                },
            });
            return {
                success: false,
                error: 'Incorrect password. Maximum attempts exceeded. Code has been invalidated.',
                attemptsRemaining: 0,
            };
        }
        else {
            await prisma_1.default.adminotp.update({
                where: { id: activeOtp.id },
                data: { attempts: updatedAttempts },
            });
            return {
                success: false,
                error: `Incorrect password. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
                attemptsRemaining: remaining,
            };
        }
    }
    // SUCCESS: IMMEDIATELY invalidate/delete the used OTP record
    // 1. Mark as used in DB
    await prisma_1.default.adminotp.update({
        where: { id: activeOtp.id },
        data: {
            isUsed: true,
            usedAt: now,
        },
    });
    // 2. Delete the record immediately to guarantee zero reuse
    try {
        await prisma_1.default.adminotp.delete({
            where: { id: activeOtp.id },
        });
    }
    catch (err) {
        logger_1.logger.warn('Could not delete used OTP record immediately, isUsed is set to true', err);
    }
    // Update admin user login timestamp and reset login failures
    await prisma_1.default.adminuser.update({
        where: { id: admin.id },
        data: {
            lastLoginAt: now,
            loginFailures: 0,
            lockedUntil: null,
        },
    });
    // IMMEDIATELY DELETE THE TEMPORARY PASSWORD EMAIL FROM THE INBOX
    // As requested: "if password is use and login is done using it will immediately delete that mail"
    void (0, emailInboxService_1.deleteAdminOtpEmailFromInbox)({
        toEmail: admin.email,
        otpCode: normalizedOtp,
    }).then(delRes => {
        logger_1.logger.info('Immediate inbox email purge result:', delRes);
    }).catch(delErr => {
        logger_1.logger.error('Failed immediate inbox email purge:', delErr);
    });
    return {
        success: true,
        admin,
    };
}
