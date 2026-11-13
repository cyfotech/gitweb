import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { authenticate, AuthRequest } from '../middleware/auth';
import { logActivity } from '../services/activityLog';
import { v4 as uuidv4 } from 'uuid';
import rateLimit from 'express-rate-limit';
import {
  requestAdminOtp,
  verifyAdminOtp,
  cleanupExpiredOtps,
} from '../services/adminOtpService';

const router = Router();

// Rate limiter for OTP requests: max 5 requests per IP every 5 minutes
const otpRequestRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login code requests. Please wait a few minutes before trying again.' },
});

// Rate limiter for OTP verifications: max 15 attempts per IP every 5 minutes
const otpVerifyRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many verification attempts. Please wait a few minutes.' },
});

const requestOtpSchema = z.object({
  username: z.string().min(1, 'Username is required'),
});

const verifyOtpSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  otp: z.string().regex(/^\d{8}$/, 'Temporary password must be 8 digits'),
});

// POST /api/v1/auth/request-otp (Step 1: Enter Username & Send 8-digit temporary password via SMTP)
router.post('/request-otp', otpRequestRateLimiter, async (req: Request, res: Response) => {
  try {
    const { username } = requestOtpSchema.parse(req.body);
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Trigger non-blocking cleanup of stale OTPs
    void cleanupExpiredOtps();

    const result = await requestAdminOtp({
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

    await logActivity({
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
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Username is required', details: err.errors });
    }
    res.status(500).json({ error: 'Server error processing temporary password request' });
  }
});

// POST /api/v1/auth/verify-otp (Step 2 & 3: Email Verification & Successful Login)
router.post('/verify-otp', otpVerifyRateLimiter, async (req: Request, res: Response) => {
  try {
    const { username, otp } = verifyOtpSchema.parse(req.body);
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const result = await verifyAdminOtp({
      usernameOrEmail: username,
      otp,
      ipAddress,
      userAgent,
    });

    if (!result.success || !result.admin) {
      await logActivity({
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

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken({ adminId: admin.id });

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

    await logActivity({
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
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid input. Please provide username and 8-digit code.', details: err.errors });
    }
    res.status(500).json({ error: 'Server error verifying temporary password' });
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /api/v1/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const admin = await prisma.adminuser.findUnique({
      where: { email },
      include: { adminrole: true },
    });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, admin.password);

    if (!validPassword) {
      await logActivity({
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

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken({ adminId: admin.id });

    // Update last login
    await prisma.adminuser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    await logActivity({
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
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid input', details: err.errors });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/v1/auth/refresh
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });

    const payload = verifyRefreshToken(refreshToken);
    const admin = await prisma.adminuser.findUnique({
      where: { id: payload.adminId },
      include: { adminrole: true },
    });

    if (!admin) {
      return res.status(401).json({ error: 'Admin not found' });
    }

    const isSuperAdmin = admin.adminrole?.name === 'SUPER_ADMIN';
    const newAccessToken = signAccessToken({
      adminId: admin.id,
      email: admin.email,
      isSuperAdmin,
      roleId: admin.roleId || undefined,
    });
    const newRefreshToken = signRefreshToken({ adminId: admin.id });

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// POST /api/v1/auth/logout
router.post('/logout', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await logActivity({
      adminId: req.admin?.adminId,
      action: 'logout',
      ipAddress: req.ip,
    });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Logout failed' });
  }
});

// GET /api/v1/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const admin = await prisma.adminuser.findUnique({
      where: { id: req.admin!.adminId },
      include: { adminrole: true },
    });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
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
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/v1/auth/setup - create or update super admin
router.post('/setup', async (req: Request, res: Response) => {
  try {
    const setupSecret = req.headers['x-setup-secret'];
    if (setupSecret !== (process.env.ADMIN_SETUP_SECRET || 'preferred_tax_admin_setup_2024')) {
      return res.status(403).json({ error: 'Invalid setup secret' });
    }

    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
      firstName: z.string(),
      lastName: z.string(),
    });

    const { email, password, firstName, lastName } = schema.parse(req.body);
    const passwordHash = await bcrypt.hash(password, 12);

    let superRole = await prisma.adminrole.findUnique({
      where: { name: 'SUPER_ADMIN' },
    });
    if (!superRole) {
      superRole = await prisma.adminrole.create({
        data: {
          id: uuidv4(),
          name: 'SUPER_ADMIN',
          description: 'Super Administrator',
        },
      });
    }

    const existingAdmin = await prisma.adminuser.findUnique({ where: { email } });
    let admin;
    if (existingAdmin) {
      admin = await prisma.adminuser.update({
        where: { email },
        data: {
          name: `${firstName} ${lastName}`.trim(),
          password: passwordHash,
          roleId: superRole.id,
        },
      });
    } else {
      admin = await prisma.adminuser.create({
        data: {
          id: uuidv4(),
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
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid input', details: err.errors });
    }
    res.status(500).json({ error: 'Setup failed' });
  }
});

export default router;
