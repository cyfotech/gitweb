export interface JWTPayload {
    adminId: string;
    email: string;
    isSuperAdmin: boolean;
    roleId?: string;
}
export declare function signAccessToken(payload: JWTPayload): string;
export declare function signRefreshToken(payload: Pick<JWTPayload, 'adminId'>): string;
export declare function verifyAccessToken(token: string): JWTPayload;
export declare function verifyRefreshToken(token: string): Pick<JWTPayload, 'adminId'>;
