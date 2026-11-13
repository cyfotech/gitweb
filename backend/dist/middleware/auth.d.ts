import { Request, Response, NextFunction } from 'express';
import { JWTPayload } from '../utils/jwt';
export interface AuthRequest extends Request {
    admin?: JWTPayload;
    adminUser?: {
        adminId: string;
        email: string;
        name?: string;
        isSuperAdmin: boolean;
        roleId?: string;
    };
}
export declare function authenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
export declare function requireSuperAdmin(req: AuthRequest, res: Response, next: NextFunction): Response<any, Record<string, any>>;
