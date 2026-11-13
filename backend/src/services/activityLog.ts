import prisma from '../utils/prisma';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

interface LogActivityParams {
  adminId?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  severity?: 'info' | 'warning' | 'error';
}

export async function logActivity(params: LogActivityParams) {
  try {
    if (params.adminId) {
      await prisma.adminactivitylog.create({
        data: {
          id: uuidv4(),
          adminUserId: params.adminId,
          eventType: params.action,
          description: `Action on ${params.resource || 'system'}: ${params.action}`,
          ipAddress: params.ipAddress || null,
          targetPage: params.resource || null,
          targetObject: params.resourceId || null,
          updatedValue: params.details || null,
          status: params.severity || 'info',
        },
      });
    }
  } catch (err) {
    logger.error('Failed to log activity', { err, params });
  }
}

export async function logSystemEvent(level: string, message: string, context?: Record<string, any>) {
  try {
    await prisma.systemlog.create({
      data: {
        id: uuidv4(),
        level,
        message,
        source: 'backend',
        details: context || null,
      },
    });
  } catch (err) {
    logger.error('Failed to log system event', { err });
  }
}
