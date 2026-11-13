import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import path from 'path';

import { logger } from './utils/logger';
import { prisma } from './utils/prisma';
import { closeEmailTransport } from './services/emailService';
import { validateEnv } from './utils/envValidate';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { cleanupExpiredOtps } from './services/adminOtpService';

// Routes
import authRoutes from './routes/auth';
import pagesRoutes from './routes/pages';
import sectionsRoutes from './routes/sections';
import servicesRoutes from './routes/services';
import blogRoutes from './routes/blog';
import seoRoutes from './routes/seo';
import mediaRoutes from './routes/media';
import analyticsRoutes from './routes/analytics';
import logsRoutes from './routes/logs';
import inquiriesRoutes from './routes/inquiries';
import consultationsRoutes from './routes/consultations';
import webhookRoutes from './routes/webhooks';
import dashboardRoutes from './routes/dashboard';
import settingsRoutes from './routes/settings';
import visualComponentsRoutes from './routes/visual-components';
import navigationRoutes from './routes/navigation';
import visitorsRoutes from './routes/visitors';
import applicationsRoutes from './routes/applications';

// Validate environment on boot (warn-only; never logs secrets)
const envCheck = validateEnv();
if (!envCheck.ok) {
  logger.warn('Environment validation warnings:');
  envCheck.warnings.forEach(w => logger.warn('  - ' + w));
} else if (envCheck.warnings.length) {
  envCheck.warnings.forEach(w => logger.warn('  - ' + w));
}

const app = express();
const PORT = process.env.PORT || 8001;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-Token'],
}));

// Rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Generous allowance for legitimate admin sessions and dev testing
  message: { error: 'Too many authentication attempts.' },
});

app.use(globalLimiter);
app.use(cookieParser());

// Raw body for Calendly webhook (signature verification needs exact bytes).
// Must be registered before the global JSON parser so it captures the raw stream.
app.use('/api/v1/webhooks/calendly', express.raw({ type: '*/*' }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);

// Serve uploaded media files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  maxAge: '7d',
  etag: true,
}));

// API Routes
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/pages', pagesRoutes);
app.use('/api/v1/sections', sectionsRoutes);
app.use('/api/v1/services', servicesRoutes);
app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1/seo', seoRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/logs', logsRoutes);
app.use('/api/v1/inquiries', inquiriesRoutes);
app.use('/api/v1/consultations', consultationsRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/visual-components', visualComponentsRoutes);
app.use('/api/v1/navigation', navigationRoutes);
app.use('/api/v1/visitors', visitorsRoutes);
app.use('/api/v1/applications', applicationsRoutes);
app.use('/api/v1/webhooks', webhookRoutes);

// Health check with active database probe
app.get('/api/v1/health', async (_req, res) => {
  let dbStatus = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = 'disconnected';
  }

  if (dbStatus === 'connected') {
    return res.status(200).json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } else {
    return res.status(503).json({
      status: 'degraded',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
      error: 'Database connection unavailable',
    });
  }
});

// Error handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info(`Backend server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);

  // Schedule periodic cleanup of expired/used OTPs every 5 minutes
  setInterval(() => {
    cleanupExpiredOtps().catch(err => {
      logger.error('Scheduled OTP cleanup encountered an error', err);
    });
  }, 5 * 60 * 1000);
});

function shutdown(signal: string) {
  logger.info(`Received ${signal}; shutting down backend.`);
  server.close(() => {
    closeEmailTransport();
    void prisma.$disconnect().then(() => process.exit(0)).catch((error: unknown) => {
      logger.error('Failed to disconnect Prisma during shutdown', error);
      process.exit(1);
    });
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));

export default app;
