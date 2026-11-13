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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("./utils/logger");
const prisma_1 = require("./utils/prisma");
const emailService_1 = require("./services/emailService");
const envValidate_1 = require("./utils/envValidate");
const errorHandler_1 = require("./middleware/errorHandler");
const requestLogger_1 = require("./middleware/requestLogger");
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const pages_1 = __importDefault(require("./routes/pages"));
const sections_1 = __importDefault(require("./routes/sections"));
const services_1 = __importDefault(require("./routes/services"));
const blog_1 = __importDefault(require("./routes/blog"));
const seo_1 = __importDefault(require("./routes/seo"));
const media_1 = __importDefault(require("./routes/media"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const logs_1 = __importDefault(require("./routes/logs"));
const inquiries_1 = __importDefault(require("./routes/inquiries"));
const consultations_1 = __importDefault(require("./routes/consultations"));
const webhooks_1 = __importDefault(require("./routes/webhooks"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const settings_1 = __importDefault(require("./routes/settings"));
const navigation_1 = __importDefault(require("./routes/navigation"));
const visitors_1 = __importDefault(require("./routes/visitors"));
const applications_1 = __importDefault(require("./routes/applications"));
// Validate environment on boot (warn-only; never logs secrets)
const envCheck = (0, envValidate_1.validateEnv)();
if (!envCheck.ok) {
    logger_1.logger.warn('Environment validation warnings:');
    envCheck.warnings.forEach(w => logger_1.logger.warn('  - ' + w));
}
else if (envCheck.warnings.length) {
    envCheck.warnings.forEach(w => logger_1.logger.warn('  - ' + w));
}
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8001;
// Security middleware
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
// CORS
app.use((0, cors_1.default)({
    origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-Token'],
}));
// Rate limiting
const globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
});
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many authentication attempts.' },
});
app.use(globalLimiter);
app.use((0, cookie_parser_1.default)());
// Raw body for Calendly webhook (signature verification needs exact bytes).
// Must be registered before the global JSON parser so it captures the raw stream.
app.use('/api/v1/webhooks/calendly', express_1.default.raw({ type: '*/*' }));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger_1.requestLogger);
// Serve uploaded media files statically
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads'), {
    maxAge: '7d',
    etag: true,
}));
// API Routes
app.use('/api/v1/auth', authLimiter, auth_1.default);
app.use('/api/v1/pages', pages_1.default);
app.use('/api/v1/sections', sections_1.default);
app.use('/api/v1/services', services_1.default);
app.use('/api/v1/blog', blog_1.default);
app.use('/api/v1/seo', seo_1.default);
app.use('/api/v1/media', media_1.default);
app.use('/api/v1/analytics', analytics_1.default);
app.use('/api/v1/logs', logs_1.default);
app.use('/api/v1/inquiries', inquiries_1.default);
app.use('/api/v1/consultations', consultations_1.default);
app.use('/api/v1/dashboard', dashboard_1.default);
app.use('/api/v1/settings', settings_1.default);
app.use('/api/v1/navigation', navigation_1.default);
app.use('/api/v1/visitors', visitors_1.default);
app.use('/api/v1/applications', applications_1.default);
app.use('/api/v1/webhooks', webhooks_1.default);
// Health check with active database probe
app.get('/api/v1/health', async (_req, res) => {
    let dbStatus = 'disconnected';
    try {
        await prisma_1.prisma.$queryRaw `SELECT 1`;
        dbStatus = 'connected';
    }
    catch (err) {
        dbStatus = 'disconnected';
    }
    if (dbStatus === 'connected') {
        return res.status(200).json({
            status: 'ok',
            database: 'connected',
            timestamp: new Date().toISOString(),
        });
    }
    else {
        return res.status(503).json({
            status: 'degraded',
            database: 'disconnected',
            timestamp: new Date().toISOString(),
            error: 'Database connection unavailable',
        });
    }
});
// Error handler
app.use(errorHandler_1.errorHandler);
const server = app.listen(PORT, () => {
    logger_1.logger.info(`Backend server running on port ${PORT}`);
    logger_1.logger.info(`Environment: ${process.env.NODE_ENV}`);
});
function shutdown(signal) {
    logger_1.logger.info(`Received ${signal}; shutting down backend.`);
    server.close(() => {
        (0, emailService_1.closeEmailTransport)();
        void prisma_1.prisma.$disconnect().then(() => process.exit(0)).catch((error) => {
            logger_1.logger.error('Failed to disconnect Prisma during shutdown', error);
            process.exit(1);
        });
    });
    setTimeout(() => process.exit(1), 10000).unref();
}
process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
exports.default = app;
