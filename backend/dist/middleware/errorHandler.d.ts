import { Request, Response, NextFunction } from 'express';
export declare function errorHandler(err: any, req: Request, res: Response, _next: NextFunction): Response<any, Record<string, any>>;
