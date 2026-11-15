"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../utils/prisma"));
const jwt_1 = require("../utils/jwt");
const auth_1 = require("../middleware/auth");
const activityLog_1 = require("../services/activityLog");
const uuid_1 = require("uuid");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const adminOtpService_1 = require("../services/adminOtpService");
const router = (0, express_1.Router)();
// Rate limiter for OTP requests: max 5 requests per IP every 5 minutes
const otpRequestRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many login code requests. Please wait a few minutes before trying again.' },
});
// Rate limiter for OTP verifications: max 15 attempts per IP every 5 minutes
const otpVerifyRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many verification attempts. Please wait a few minutes.' },
});
const requestOtpSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, 'Username is required'),
});
const verifyOtpSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, 'Username is required'),
    otp: zod_1.z.string().regex(/^\d{8}$/, 'Temporary password must be 8 digits'),
});
// POST /api/v1/auth/request-otp (Step 1: Enter Username & Send 8-digit temporary password via SMTP)
router.post('/request-otp', otpRequestRateLimiter, async (req, res) => {
    try {
        const { username } = requestOtpSchema.parse(req.body);
        const ipAddress = req.ip || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];
        // Trigger non-blocking cleanup of stale OTPs
        void (0, adminOtpService_1.cleanupExpiredOtps)();
        const result = await (0, adminOtpService_1.requestAdminOtp)({
            usernameOrEmail: username,
            ipAddress,
            userAgent,
        });
        if (!result.success) {
            return res.status(400).json({
                error: result.message,
                userExists: result.userExists,
                cooldownSeconds: result.cooldownSeconds,
            });
        }
        await (0, activityLog_1.logActivity)({
            action: 'admin_otp_requested',
            details: { username, maskedEmail: result.maskedEmail },
            ipAddress,
            severity: 'info',
        });
        res.json({
            success: true,
            userExists: true,
            message: result.message,
            maskedEmail: result.maskedEmail,
            expiresInSeconds: result.expiresInSeconds,
            cooldownSeconds: result.cooldownSeconds,
        });
    }
    catch (err) {
        if (err.name === 'ZodError') {
            return res.status(400).json({ error: 'Username is required', details: err.errors });
        }
        res.status(500).json({ error: 'Server error processing temporary password request' });
    }
});
// POST /api/v1/auth/verify-otp (Step 2 & 3: Email Verification & Successful Login)
router.post('/verify-otp', otpVerifyRateLimiter, async (req, res) => {
    try {
        const { username, otp } = verifyOtpSchema.parse(req.body);
        const ipAddress = req.ip || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];
        const result = await (0, adminOtpService_1.verifyAdminOtp)({
            usernameOrEmail: username,
            otp,
            ipAddress,
            userAgent,
        });
        if (!result.success || !result.admin) {
            await (0, activityLog_1.logActivity)({
                action: 'admin_otp_failed',
                details: { username, error: result.error, attemptsRemaining: result.attemptsRemaining },
                ipAddress,
                severity: 'warning',
            });
            return res.status(401).json({
                error: result.error || 'Invalid or expired temporary password',
                attemptsRemaining: result.attemptsRemaining,
            });
        }
        const admin = result.admin;
        const isSuperAdmin = admin.adminrole?.name === 'SUPER_ADMIN';
        const payload = {
            adminId: admin.id,
            email: admin.email,
            isSuperAdmin,
            roleId: admin.roleId || undefined,
        };
        const accessToken = (0, jwt_1.signAccessToken)(payload);
        const refreshToken = (0, jwt_1.signRefreshToken)({ adminId: admin.id });
        // Set secure session cookies (no maxAge or expires set -> session cookie, deleted on browser close)
        res.cookie('admin_access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        res.cookie('admin_refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        await (0, activityLog_1.logActivity)({
            adminId: admin.id,
            action: 'admin_otp_login_success',
            details: { username: admin.name, email: admin.email },
            ipAddress,
            severity: 'info',
        });
        const nameParts = admin.name.split(' ');
        res.json({
            success: true,
            accessToken,
            refreshToken,
            admin: {
                id: admin.id,
                email: admin.email,
                firstName: nameParts[0] || 'Admin',
                lastName: nameParts.slice(1).join(' ') || '',
                avatar: admin.image,
                isSuperAdmin,
            },
        });
    }
    catch (err) {
        if (err.name === 'ZodError') {
            return res.status(400).json({ error: 'Invalid input. Please provide username and 8-digit code.', details: err.errors });
        }
        res.status(500).json({ error: 'Server error verifying temporary password' });
    }
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const admin = await prisma_1.default.adminuser.findUnique({
            where: { email },
            include: { adminrole: true },
        });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const validPassword = await bcryptjs_1.default.compare(password, admin.password);
        if (!validPassword) {
            await (0, activityLog_1.logActivity)({
                adminId: admin.id,
                action: 'login_failed',
                details: { reason: 'Invalid password' },
                ipAddress: req.ip,
                severity: 'warning',
            });
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isSuperAdmin = admin.adminrole?.name === 'SUPER_ADMIN';
        const payload = {
            adminId: admin.id,
            email: admin.email,
            isSuperAdmin,
            roleId: admin.roleId || undefined,
        };
        const accessToken = (0, jwt_1.signAccessToken)(payload);
        const refreshToken = (0, jwt_1.signRefreshToken)({ adminId: admin.id });
        // Update last login
        await prisma_1.default.adminuser.update({
            where: { id: admin.id },
            data: { lastLoginAt: new Date() },
        });
        await (0, activityLog_1.logActivity)({
            adminId: admin.id,
            action: 'login',
            ipAddress: req.ip,
            severity: 'info',
        });
        const nameParts = admin.name.split(' ');
        res.json({
            accessToken,
            refreshToken,
            admin: {
                id: admin.id,
                email: admin.email,
                firstName: nameParts[0] || 'Admin',
                lastName: nameParts.slice(1).join(' ') || '',
                avatar: admin.image,
                isSuperAdmin,
            },
        });
    }
    catch (err) {
        if (err.name === 'ZodError') {
            return res.status(400).json({ error: 'Invalid input', details: err.errors });
        }
        res.status(500).json({ error: 'Server error' });
    }
});
// POST /api/v1/auth/refresh
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken)
            return res.status(400).json({ error: 'Refresh token required' });
        const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        const admin = await prisma_1.default.adminuser.findUnique({
            where: { id: payload.adminId },
            include: { adminrole: true },
        });
        if (!admin) {
            return res.status(401).json({ error: 'Admin not found' });
        }
        const isSuperAdmin = admin.adminrole?.name === 'SUPER_ADMIN';
        const newAccessToken = (0, jwt_1.signAccessToken)({
            adminId: admin.id,
            email: admin.email,
            isSuperAdmin,
            roleId: admin.roleId || undefined,
        });
        const newRefreshToken = (0, jwt_1.signRefreshToken)({ adminId: admin.id });
        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    }
    catch {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
});
// POST /api/v1/auth/logout
router.post('/logout', auth_1.authenticate, async (req, res) => {
    try {
        await (0, activityLog_1.logActivity)({
            adminId: req.admin?.adminId,
            action: 'logout',
            ipAddress: req.ip,
        });
        res.json({ success: true });
    }
    catch {
        res.status(500).json({ error: 'Logout failed' });
    }
});
// GET /api/v1/auth/me
router.get('/me', auth_1.authenticate, async (req, res) => {
    try {
        const admin = await prisma_1.default.adminuser.findUnique({
            where: { id: req.admin.adminId },
            include: { adminrole: true },
        });
        if (!admin)
            return res.status(404).json({ error: 'Admin not found' });
        const nameParts = admin.name.split(' ');
        res.json({
            id: admin.id,
            email: admin.email,
            firstName: nameParts[0] || 'Admin',
            lastName: nameParts.slice(1).join(' ') || '',
            avatar: admin.image,
            isSuperAdmin: admin.adminrole?.name === 'SUPER_ADMIN',
            lastLoginAt: admin.lastLoginAt,
            role: admin.adminrole ? { id: admin.adminrole.id, name: admin.adminrole.name } : null,
        });
    }
    catch {
        res.status(500).json({ error: 'Server error' });
    }
});
// POST /api/v1/auth/setup - create or update super admin
router.post('/setup', async (req, res) => {
    try {
        const setupSecret = req.headers['x-setup-secret'];
        if (setupSecret !== (process.env.ADMIN_SETUP_SECRET || 'preferred_tax_admin_setup_2024')) {
            return res.status(403).json({ error: 'Invalid setup secret' });
        }
        const schema = zod_1.z.object({
            email: zod_1.z.string().email(),
            password: zod_1.z.string().min(8),
            firstName: zod_1.z.string(),
            lastName: zod_1.z.string(),
        });
        const { email, password, firstName, lastName } = schema.parse(req.body);
        const passwordHash = await bcryptjs_1.default.hash(password, 12);
        let superRole = await prisma_1.default.adminrole.findUnique({
            where: { name: 'SUPER_ADMIN' },
        });
        if (!superRole) {
            superRole = await prisma_1.default.adminrole.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    name: 'SUPER_ADMIN',
                    description: 'Super Administrator',
                },
            });
        }
        const existingAdmin = await prisma_1.default.adminuser.findUnique({ where: { email } });
        let admin;
        if (existingAdmin) {
            admin = await prisma_1.default.adminuser.update({
                where: { email },
                data: {
                    name: `${firstName} ${lastName}`.trim(),
                    password: passwordHash,
                    roleId: superRole.id,
                },
            });
        }
        else {
            admin = await prisma_1.default.adminuser.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    email,
                    name: `${firstName} ${lastName}`.trim(),
                    password: passwordHash,
                    roleId: superRole.id,
                },
            });
        }
        res.status(201).json({
            success: true,
            admin: { id: admin.id, email: admin.email, name: admin.name },
        });
    }
    catch (err) {
        if (err.name === 'ZodError') {
            return res.status(400).json({ error: 'Invalid input', details: err.errors });
        }
        res.status(500).json({ error: 'Setup failed' });
    }
});
exports.default = router;
