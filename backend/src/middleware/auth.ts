import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JWTPayload } from '../utils/jwt';
import prisma from '../utils/prisma';

export interface AuthRequest extends Request {
  admin?: JWTPayload;
  adminUser?: { adminId: string; email: string; name?: string; isSuperAdmin: boolean; roleId?: string };
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    // Verify admin exists in adminuser table
    const admin = await prisma.adminuser.findUnique({
      where: { id: payload.adminId },
      include: { adminrole: true },
    });

    if (!admin) {
      return res.status(401).json({ error: 'Account not found' });
    }

    req.admin = {
      adminId: admin.id,
      email: admin.email,
      isSuperAdmin: admin.adminrole?.name === 'SUPER_ADMIN',
      roleId: admin.roleId || undefined,
    };
    req.adminUser = {
      adminId: admin.id,
      email: admin.email,
      name: admin.name,
      isSuperAdmin: admin.adminrole?.name === 'SUPER_ADMIN',
      roleId: admin.roleId || undefined,
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireSuperAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.admin?.isSuperAdmin) {
    return res.status(403).json({ error: 'Super admin access required' });
  }
  next();
}
