"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
async function setupAdmin() {
    const email = process.env.ADMIN_EMAIL || 'admin@preferredtax.com';
    const password = process.env.ADMIN_PASSWORD || 'root'; // set to root as requested by user
    const name = 'Super Admin';
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    let superRole = await prisma.adminrole.findUnique({
        where: { name: 'SUPER_ADMIN' },
    });
    if (!superRole) {
        superRole = await prisma.adminrole.create({
            data: {
                id: (0, uuid_1.v4)(),
                name: 'SUPER_ADMIN',
                description: 'Super Administrator role for Preferred Tax Consultancy',
            },
        });
    }
    const existing = await prisma.adminuser.findUnique({ where: { email } });
    if (existing) {
        await prisma.adminuser.update({
            where: { email },
            data: {
                password: passwordHash,
                name,
                roleId: superRole.id,
            },
        });
        console.log(`✅ Super admin updated: ${email} with password: ${password}`);
    }
    else {
        await prisma.adminuser.create({
            data: {
                id: (0, uuid_1.v4)(),
                email,
                name,
                password: passwordHash,
                roleId: superRole.id,
            },
        });
        console.log(`✅ Super admin created: ${email} with password: ${password}`);
    }
    await prisma.$disconnect();
}
setupAdmin().catch(err => {
    console.error('Setup failed:', err);
    process.exit(1);
});
