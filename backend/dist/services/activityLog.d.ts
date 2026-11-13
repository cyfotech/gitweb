interface LogActivityParams {
    adminId?: string;
    action: string;
    resource?: string;
    resourceId?: string;
    details?: Record<string, any>;
    ipAddress?: string;
    severity?: 'info' | 'warning' | 'error';
}
export declare function logActivity(params: LogActivityParams): Promise<void>;
export declare function logSystemEvent(level: string, message: string, context?: Record<string, any>): Promise<void>;
export {};
