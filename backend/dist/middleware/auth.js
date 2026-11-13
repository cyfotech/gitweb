"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.requireSuperAdmin = requireSuperAdmin;
const jwt_1 = require("../utils/jwt");
const prisma_1 = __importDefault(require("../utils/prisma"));
async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const token = authHeader.split(' ')[1];
        const payload = (0, jwt_1.verifyAccessToken)(token);
        // Verify admin exists in adminuser table
        const admin = await prisma_1.default.adminuser.findUnique({
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
    }
    catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
function requireSuperAdmin(req, res, next) {
    if (!req.admin?.isSuperAdmin) {
        return res.status(403).json({ error: 'Super admin access required' });
    }
    next();
}
