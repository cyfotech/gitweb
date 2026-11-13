/**
 * SMT Smart Tax Experts — Environment Validation
 *
 * Validates required environment variables on boot without logging values.
 */
export declare function validateEnv(): {
    ok: boolean;
    warnings: string[];
};
