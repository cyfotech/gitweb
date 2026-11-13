"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logActivity = logActivity;
exports.logSystemEvent = logSystemEvent;
const prisma_1 = __importDefault(require("../utils/prisma"));
const logger_1 = require("../utils/logger");
const uuid_1 = require("uuid");
async function logActivity(params) {
    try {
        if (params.adminId) {
            await prisma_1.default.adminactivitylog.create({
                data: {
                    id: (0, uuid_1.v4)(),
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
    }
    catch (err) {
        logger_1.logger.error('Failed to log activity', { err, params });
    }
}
async function logSystemEvent(level, message, context) {
    try {
        await prisma_1.default.systemlog.create({
            data: {
                id: (0, uuid_1.v4)(),
                level,
                message,
                source: 'backend',
                details: context || null,
            },
        });
    }
    catch (err) {
        logger_1.logger.error('Failed to log system event', { err });
    }
}
